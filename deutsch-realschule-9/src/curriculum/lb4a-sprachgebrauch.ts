import type { Lesson } from "../model/types";

/** Lernbereich 4, erster Teil: Sprachgebrauch und Satzbau-Grundlagen (4.1 und 4.2.1 bis 4.2.3). */
export const LB4A: Lesson[] = [
  {
    id: "de-fachbegriffe-fremdwoerter",
    lb: 4,
    unit: "4.1",
    covers: ["4.1.1"],
    title: "Fachbegriffe, Fremdwörter und Synonyme treffend einsetzen",
    intro:
      "Fremdwörter, Fachbegriffe und Synonyme können einen Text genauer machen oder unverständlich. Du lernst, wann welches Wort passt.",
    paragraphs: [
      "Stell dir vor, ein Mitschüler beginnt sein Referat mit dem Satz: „Heute präsentiere ich die Resultate meiner Evaluation der Applikationsnutzung.“ Die Klasse versteht kaum etwas. Das Problem liegt nicht an den Wörtern selbst, sondern an ihrer Wahl. Ein **Fremdwort** stammt aus einer anderen Sprache, und man erkennt seine Herkunft noch, zum Beispiel „Interview“ oder „Argument“. Ein **Fachbegriff** ist ein Wort mit einer genau festgelegten Bedeutung in einem Fach oder Beruf, zum Beispiel „Prädikat“ im Deutschunterricht. Viele Fachbegriffe sind Fremdwörter, aber nicht alle: „Satzglied“ ist ein rein deutscher Fachbegriff.",
      "Ob ein Fremdwort sinnvoll ist, prüfst du mit drei Fragen. Erstens: Gibt es ein deutsches Wort, das genauso genau ist? Dann nimmst du das deutsche, zum Beispiel „auswerten“ statt „evaluieren“ oder „teilnehmen“ statt „partizipieren“. Zweitens: Kennen die Zuhörenden oder Lesenden das Wort? Ein Fremdwort, das niemand versteht, bringt nichts. Drittens: Verlangt das Fach diesen Begriff? Dann behältst du ihn, denn für „Fotosynthese“ gibt es kein einzelnes gleichwertiges deutsches Wort. Auch das **Sprachniveau** zählt: Ein Referat oder eine Bewerbung soll sachlich klingen, weder aufgeblasen noch zu locker.",
      "Einen Fachbegriff, den dein Publikum vermutlich nicht kennt, erklärst du beim ersten Gebrauch kurz, zum Beispiel mit „also“, mit einem Nebensatz oder in Klammern: „die Fotosynthese, also der Vorgang, bei dem Pflanzen mithilfe von Licht aus Wasser und Kohlenstoffdioxid Zucker herstellen“. Danach darfst du ihn ohne Erklärung weiterverwenden. Das ist im mündlichen Vortrag besonders wichtig, denn Zuhörende können nicht nachschlagen. Verwechsle außerdem keine Fremdwörter, die ähnlich klingen: Eine „Rezension“ ist die kritische Besprechung eines Buches, eine „Rezession“ ein Rückgang der Wirtschaftsleistung.",
      "**Synonyme** sind Wörter mit ähnlicher Bedeutung. Sie helfen dir, Wiederholungen zu vermeiden, sind aber selten wirklich austauschbar. Meist unterscheiden sie sich im **Beiklang**: Ein Wort kann neutral, anerkennend oder abwertend klingen. „Sparsam“ und „geizig“ beschreiben beide, dass jemand wenig Geld ausgibt, doch „sparsam“ klingt nach Lob und „geizig“ nach Vorwurf. Ähnlich ist es bei „schlank“, „dünn“ und „mager“. Frage dich vor jedem Austausch: Passt die Bedeutung, und passt der Beiklang zu meiner Absicht und zur Situation?",
    ],
    terms: [
      {
        term: "Fremdwort",
        text: "Ein aus einer anderen Sprache übernommenes Wort, dessen fremde Herkunft noch erkennbar ist, zum Beispiel „Interview“.",
      },
      {
        term: "Fachbegriff",
        text: "Ein Wort mit einer genau festgelegten Bedeutung in einem Fach oder Beruf, das beim ersten Gebrauch oft erklärt werden muss.",
      },
      {
        term: "Synonym",
        text: "Ein Wort, das einem anderen in der Bedeutung ähnlich ist, zum Beispiel „Ergebnis“ und „Resultat“.",
      },
      {
        term: "Beiklang",
        text: "Das Gefühl oder die Wertung, die ein Wort mitbringt: Zwei Synonyme können neutral, anerkennend oder abwertend klingen.",
      },
      {
        term: "Sprachniveau",
        text: "Wie fachlich, förmlich und anspruchsvoll ein Text formuliert ist; es soll zu den Lesenden und zum Anlass passen.",
      },
    ],
    examples: [
      {
        title: "Ein Fachbegriff mit und ohne Erklärung (eigens verfasst)",
        text: "Ohne Erklärung: Lea sagt im Referat: „Die Inflation hat uns alle getroffen.“\nMit Erklärung: Lea sagt im Referat: „Die Inflation, also der allgemeine Anstieg der Preise, hat uns alle getroffen.“",
        analysis:
          "In der zweiten Fassung steht der Fachbegriff „Inflation“ weiter im Text, denn er ist genau und gehört zum Thema. Der Einschub „also der allgemeine Anstieg der Preise“ erklärt ihn aber beim ersten Gebrauch, sodass auch Zuhörende ohne Vorwissen folgen können.",
      },
    ],
    takeaway:
      "Ein Fremdwort oder Fachbegriff ist richtig, wenn er genauer ist als jedes deutsche Wort, die Lesenden ihn verstehen und du ihn beim ersten Gebrauch erklärst. Bei Synonymen prüfst du neben der Bedeutung auch den Beiklang.",
    sourceIds: ["lp", "dwds"],
    quiz: {
      question: "Wann ist ein Fremdwort in einem Text sinnvoll?",
      answer: "Wenn es genauer ist als ein deutsches Wort oder fachlich nötig ist und die Lesenden es verstehen.",
      wrong: [
        "Immer, weil ein Text mit Fremdwörtern gebildeter und überzeugender wirkt als einer ohne.",
        "Nie, weil jeder Text ohne Fremdwörter automatisch besser verständlich und damit besser ist.",
      ],
      explanation:
        "Ein Fremdwort lohnt sich nur, wenn es etwas leistet: Es ist genauer oder gehört zum Fach, und die Lesenden verstehen es. Gebildet zu klingen ist kein Grund. Ein vollständiger Verzicht ist aber auch falsch, denn manche Fachbegriffe lassen sich nicht gleichwertig ersetzen.",
    },
    workshop: {
      kind: "choose",
      title: "Das passende Wort wählen",
      instruction:
        "Lies jeden Satz und wähle das Wort, das nach Bedeutung, Beiklang und Lesepublikum passt. In einer Lücke kann auch eine ganze Erklärung stehen.",
      items: [
        {
          before: "Mia schreibt in ihrer Bewerbung über sich: „Ich arbeite ",
          options: ["beharrlich", "stur", "verbissen"],
          answer: 0,
          after: " an meinen Zielen.“",
          feedback:
            "Synonyme unterscheiden sich im Beiklang. In einer Bewerbung brauchst du das Wort, das anerkennend klingt und nicht abwertend.",
        },
        {
          before: "Die Schulleiterin lobt die Fachschaft: „Ihr geht sehr ",
          options: ["sparsam", "geizig", "knauserig"],
          answer: 0,
          after: " mit dem Budget um.“",
          feedback:
            "Bei einem Lob passt das Wort mit anerkennendem Beiklang. „geizig“ und „knauserig“ beschreiben dasselbe, klingen aber nach Vorwurf.",
        },
        {
          before: "Wer fremde Texte ohne Quellenangabe abschreibt und als eigene ausgibt, begeht ein ",
          options: ["Plagiat", "Plakat", "Plädoyer"],
          answer: 0,
          after: ".",
          feedback:
            "Ähnlich klingende Fremdwörter haben verschiedene Bedeutungen: Ein Plagiat ist die unerlaubte Übernahme eines fremden Werkes, ein Plakat hängt an der Wand, ein Plädoyer ist die Schlussrede vor Gericht oder allgemein eine Rede für eine Sache.",
        },
        {
          before: "In der Schülerzeitung erscheint eine ",
          options: ["Rezension", "Rezession", "Resignation"],
          answer: 0,
          after: " des neuen Jugendromans.",
          feedback:
            "Prüfe bei Fremdwörtern immer die Bedeutung: Eine Rezension ist die kritische Besprechung eines Buches, eine Rezession ein Rückgang der Wirtschaftsleistung.",
        },
        {
          before: "Lea erklärt einer 5. Klasse, die das Wort noch nie gehört hat: „Ein Ökosystem, ",
          options: [
            "also das Zusammenspiel von Lebewesen und ihrem Lebensraum,",
            "wie ihr bestimmt alle aus dem Biologieunterricht wisst und kennt,",
            "ein Begriff aus der Ökologie, den Fachleute oft benutzen,",
          ],
          answer: 0,
          after: " ist zum Beispiel ein Teich.“",
          feedback:
            "Ein Fachbegriff wird beim ersten Gebrauch erklärt. Erst der Zusatz, der sagt, was das Wort bedeutet, hilft Zuhörenden, die es nicht kennen. Ein Hinweis auf das Fach allein erklärt es nicht.",
        },
      ],
      conclusion:
        "Ein Wort muss zur Bedeutung, zum Beiklang und zu den Lesenden passen. Fachbegriffe erklärst du, ähnlich klingende Fremdwörter prüfst du genau, und Synonyme wählst du nach ihrem Beiklang.",
    },
    casework: {
      title: "Ein Referat voller Fremdwörter",
      story:
        "Jonas stellt in einer 7. Klasse sein Projekt über Handys vor. Er beginnt: **„Die Apps senden permanent Impulse, die zur Nutzung animieren. Ein Algorithmus entscheidet, was ihr seht.“** Die Kinder der 7. Klasse schauen ratlos.",
      steps: [
        {
          question: "Warum versteht die 7. Klasse Jonas nicht?",
          options: [
            "Er benutzt Fremdwörter und einen Fachbegriff, ohne sie zu ersetzen oder zu erklären.",
            "Er spricht über ein Thema, das für eine 7. Klasse zu schwer ist und zu viel Vorwissen verlangt.",
            "Seine Sätze sind zu kurz und zu knapp, um etwas verständlich zu erklären.",
          ],
          answer: 0,
          explanation:
            "Nicht das Thema, sondern die Wortwahl ist das Problem. „permanent“, „Impulse“ und „animieren“ sind Fremdwörter, „Algorithmus“ ist ein Fachbegriff, und nichts davon wird erklärt.",
        },
        {
          question: "Welches Wort ist ein Fachbegriff, den Jonas besser erklärt, statt ihn zu ersetzen, und warum?",
          options: [
            "„Algorithmus“: Er gehört zur Informatik, und ein einzelnes deutsches Wort ersetzt ihn nicht genau.",
            "„permanent“: Es gehört zur Physik und lässt sich durch kein deutsches Wort ersetzen.",
            "„animieren“: Es kommt nur in der Werbung vor und hat kein gleichwertiges deutsches Wort.",
          ],
          answer: 0,
          explanation:
            "„Algorithmus“ gehört zur Informatik, und ein einzelnes deutsches Wort ersetzt ihn nicht genau. „permanent“ und „animieren“ sind keine Fachbegriffe: Dafür gibt es bekannte Wörter wie „ständig“ und „anregen“.",
        },
        {
          question: "Welche Fassung des ersten Satzes versteht die Klasse am besten?",
          options: [
            "Die Apps senden ständig Signale, die euch zur Nutzung locken.",
            "Die Apps emittieren kontinuierlich Stimuli, die zur Nutzung animieren.",
            "Die Apps machen irgendetwas, damit man sie benutzt.",
          ],
          answer: 0,
          explanation:
            "Die erste Fassung ersetzt die Fremdwörter durch bekannte Wörter und bleibt genau. Die zweite ist noch schwerer verständlich als das Original. Die dritte ist einfach, aber so ungenau, dass die Aussage verloren geht.",
        },
        {
          question: "Wie führt Jonas den Begriff „Algorithmus“ am besten ein?",
          options: [
            "Er erklärt ihn beim ersten Gebrauch kurz, zum Beispiel mit „also eine Schritt-für-Schritt-Anleitung“.",
            "Er lässt ihn weg, weil Fachbegriffe in Referaten für Kinder nicht vorkommen dürfen und der Satz auch ohne ihn klar bleibt.",
            "Er wiederholt ihn mehrmals hintereinander, bis sich die Klasse an das Wort gewöhnt und es sich gemerkt hat.",
          ],
          answer: 0,
          explanation:
            "Eine kurze Erklärung beim ersten Gebrauch macht den Fachbegriff verständlich. Weglassen würde die Aussage ungenau machen, und bloße Wiederholung erklärt nichts.",
        },
      ],
      verdict:
        "Jonas ersetzt „permanent“, „Impulse“ und „animieren“ durch bekannte Wörter und erklärt den Fachbegriff „Algorithmus“ beim ersten Gebrauch. So bleibt sein Text genau, und die Klasse versteht ihn.",
    },
    tasks: {
      1: {
        prompt:
          "Überarbeite den Satz für einen Aushang, den alle Klassen verstehen sollen: „Die Schülervertretung initiiert eine Evaluation der Mensa und bittet um konstruktive Partizipation.“ Schreibe die neue Fassung und begründe in zwei Sätzen, was du geändert hast.",
        hints: [
          "Suche zuerst alle Fremdwörter und frage dich bei jedem: Gibt es ein bekanntes deutsches Wort, das genauso genau ist?",
          "Entscheide, ob ein Fachbegriff bleiben muss. Wenn ja, erkläre ihn beim ersten Gebrauch kurz.",
        ],
        model:
          "Die Schülervertretung lässt die Mensa bewerten und bittet alle um ihre Meinung. Ich habe „initiiert“, „Evaluation“, „konstruktive“ und „Partizipation“ ersetzt, weil es für jedes Wort ein bekanntes deutsches gibt, das genauso genau ist. Ein Aushang wird von allen Klassen gelesen, auch von den jüngeren, und der Satz soll beim ersten Lesen verständlich sein.",
        criteria: [
          "Ersetzt mindestens zwei unnötige Fremdwörter durch bekannte deutsche Wörter.",
          "Behält die Aussage des Satzes genau bei.",
          "Begründet die Änderungen mit Blick auf die Lesenden.",
        ],
      },
      2: {
        prompt:
          "Du stellst einer 5. Klasse ein Thema aus einem anderen Fach vor, zum Beispiel aus Biologie, Physik oder Geschichte. Schreibe drei bis vier Sätze deines Vortrags. Führe darin einen Fachbegriff ein und erkläre ihn, und verwende ein Synonym, dessen Beiklang zur Situation passt. Füge einen Satz an, der deine Wahl des Synonyms begründet.",
        hints: [
          "Wähle einen Fachbegriff, den Kinder der 5. Klasse vermutlich nicht kennen, und erkläre ihn mit „also“ oder in einem Nebensatz.",
          "Überlege, ob dein Synonym neutral, anerkennend oder abwertend klingt und ob das zu deinem Vortrag passt.",
        ],
        model:
          "Heute erzähle ich euch etwas über die Fotosynthese, also den Vorgang, bei dem Pflanzen mithilfe von Licht aus Wasser und Kohlenstoffdioxid Zucker herstellen. Das Kohlenstoffdioxid nehmen sie durch winzige Öffnungen in den Blättern auf, die man ohne Mikroskop kaum sieht. Dabei entsteht auch der Sauerstoff, den wir atmen. Ich habe „winzig“ gewählt und nicht „mickrig“, weil „mickrig“ abwertend klingt und nicht zu einer sachlichen Erklärung passt.",
        criteria: [
          "Führt einen Fachbegriff ein und erklärt ihn beim ersten Gebrauch.",
          "Kommt ohne unnötige Fremdwörter aus.",
          "Begründet die Wahl des Synonyms mit seinem Beiklang.",
        ],
      },
    },
  },
  {
    id: "de-diskriminierung-unwort",
    lb: 4,
    unit: "4.1",
    covers: ["4.1.2"],
    title: "Diskriminierende Sprache erkennen und vermeiden",
    intro:
      "Wörter können verletzen, auch wenn niemand das will. Du erkennst, wie Sprache abwertet, und prüfst die Wirkung deiner Wörter.",
    paragraphs: [
      "Jonas ruft quer durch den Raum: „Typisch Mädchen, die verstehen das nie!“ Er meint es als Scherz. Doch Lena hört etwas anderes: Sie wird mit allen Mädchen in einen Topf geworfen, und ihr wird etwas abgesprochen, nur weil sie ein Mädchen ist. Daran zeigt sich der wichtigste Gedanke dieser Lektion: Bei Sprache zählt nicht nur, was du meinst, sondern auch, was bei anderen ankommt. Von **Diskriminierung** spricht man, wenn Menschen wegen eines Merkmals, zum Beispiel ihres Geschlechts, ihrer Herkunft, ihres Alters oder einer Behinderung, abgewertet oder benachteiligt werden. Das kann auch durch Sprache geschehen.",
      "Sprache kann auf mehreren Wegen abwerten oder ausgrenzen. Erstens durch **Pauschalisierung**: Aussagen mit „alle“, „typisch“ oder „immer“ schreiben jedem Mitglied einer Gruppe dieselbe Eigenschaft zu, obwohl Menschen verschieden sind. Zweitens durch **abwertende Bezeichnungen**: Sie stempeln Menschen ab und reduzieren sie auf ein Merkmal. Drittens durch ein Wir-gegen-die-Denken, das manche zu Außenstehenden macht, etwa mit Sätzen wie „Die gehören eben nicht zu uns.“ Ob eine Äußerung so wirkt, hängt vom Zusammenhang ab. Ein Merkmal sachlich zu nennen, etwa um zu helfen, ist dagegen keine Abwertung. Deshalb hilft es, die Wirkung zu prüfen, statt nur auf einzelne Wörter zu achten.",
      "Die sprachkritische Aktion „Unwort des Jahres“ lenkt den Blick auf solche Wörter. Sie wurde 1991 von dem Sprachwissenschaftler Horst Dieter Schlosser ins Leben gerufen. Jede Person kann bis zum 31. Dezember Vorschläge mit Begründung und Quellenangabe einreichen. Eine unabhängige Jury aus Sprachwissenschaft und Journalismus wählt in der ersten Januarhälfte des folgenden Jahres aus den Vorschlägen aus. Als Kriterien nennt sie zum Beispiel: Ein Ausdruck verstößt gegen die Menschenwürde oder gegen demokratische Prinzipien, er diskriminiert gesellschaftliche Gruppen oder er ist beschönigend, verschleiernd oder irreführend. Die Jury versteht sich nach eigener Aussage nicht als Sprachschützerin, sondern als Vermittlerin öffentlichen Unbehagens an bestimmten Sprachgebräuchen. Die Aktion will das Sprachbewusstsein fördern.",
      "Wie weit Sprachkritik gehen soll, ist umstritten. Manche sagen: Wörter prägen Denken und Verhalten, deshalb lohnt es sich, abwertende Ausdrücke zu meiden. Andere meinen: Wer Wörter verbietet, löst keine Probleme, und entscheidend sei die Absicht. Auch „politisch korrekt“ wird unterschiedlich gebraucht: Die einen meinen damit Respekt, die anderen spotten über übertriebene Sprachregeln. Du musst dich nicht auf eine Seite schlagen, aber du kannst die Wirkung prüfen: Wer könnte sich getroffen fühlen? Wird jemand auf ein Merkmal reduziert? Wird eine ganze Gruppe über einen Kamm geschoren? Gibt es eine sachliche Alternative, die dasselbe sagt?",
    ],
    terms: [
      {
        term: "Diskriminierung",
        text: "Die Abwertung oder Benachteiligung von Menschen wegen eines Merkmals wie Geschlecht, Herkunft, Alter oder Behinderung.",
      },
      {
        term: "Pauschalisierung",
        text: "Eine Aussage, die einer ganzen Gruppe dieselbe Eigenschaft zuschreibt, etwa mit „alle“ oder „typisch“.",
      },
      {
        term: "Abwertende Bezeichnung",
        text: "Ein Wort für Menschen, das sie herabsetzt und auf ein Merkmal reduziert.",
      },
      {
        term: "Unwort des Jahres",
        text: "Eine sprachkritische Aktion, bei der eine Jury jedes Jahr einen Ausdruck der öffentlichen Sprache kritisiert.",
      },
      {
        term: "Politisch korrekt",
        text: "Ein Sprachgebrauch, der Gruppen nicht abwertet; der Ausdruck wird als Lob und als Spott verwendet.",
      },
    ],
    examples: [
      {
        title: "Aus einem Vorwurf eine Beobachtung machen (eigens verfasst)",
        text: "Vorher: „Typisch Neue, die stören nur!“\nNachher: „Die Neuen kennen die Räume noch nicht. Wir zeigen ihnen den Weg.“",
        analysis:
          "Der erste Satz ordnet alle Neuen unter „typisch“ ein und unterstellt ihnen eine schlechte Absicht. Der zweite beschreibt, was stimmt, nämlich dass die Räume noch unbekannt sind, und schlägt eine Handlung vor. Aus der Pauschalisierung wird eine Beobachtung, aus der Abwertung ein Angebot.",
      },
    ],
    takeaway:
      "Diskriminierend wirkt Sprache, wenn sie Gruppen pauschal bewertet oder Menschen auf ein Merkmal reduziert. Es zählt die Wirkung, nicht nur die Absicht. Prüfe, wer sich getroffen fühlen könnte, und suche eine sachliche Alternative.",
    sourceIds: ["lp", "unwort"],
    quiz: {
      question: "Welche Aussage über diskriminierende Sprache stimmt?",
      answer: "Es kommt auf die Wirkung an: Auch ein als Scherz gemeinter Satz kann Betroffene verletzen oder ausgrenzen.",
      wrong: [
        "Es kommt nur auf die Absicht an: Wer niemanden verletzen will, kann auch nicht diskriminieren.",
        "Nur Schimpfwörter diskriminieren, und sachlich klingende Sätze über Gruppen sind immer harmlos.",
      ],
      explanation:
        "Betroffene hören die Wirkung eines Satzes, nicht die Absicht dahinter. Deshalb entlastet gute Absicht nicht. Und auch freundlich oder sachlich klingende Sätze können eine ganze Gruppe pauschal abwerten.",
    },
    workshop: {
      kind: "classify",
      title: "Wie wirkt dieser Satz?",
      instruction:
        "Ordne jeden Satz zu: Verallgemeinert er über eine ganze Gruppe, wertet er eine einzelne Person ab, oder bleibt er sachlich und respektvoll? Ein Merkmal sachlich zu nennen, etwa um zu helfen, ist noch keine Abwertung.",
      categories: ["Verallgemeinert über eine Gruppe", "Wertet eine Person ab", "Bleibt sachlich und respektvoll"],
      entries: [
        {
          text: "„Alle Leute vom Land sind rückständig und haben keine Ahnung.“",
          target: 0,
          feedback: "Der Satz schreibt einer ganzen Gruppe mit „alle“ eine abwertende Eigenschaft zu.",
        },
        {
          text: "„Du hast schon wieder nichts kapiert, du bist einfach zu dumm dafür.“",
          target: 1,
          feedback: "Der Satz greift eine einzelne Person an und bewertet sie, statt ein Verhalten zu beschreiben.",
        },
        {
          text: "„Unser Mitschüler Tim sitzt im Rollstuhl, deshalb brauchen wir für den Ausflug einen Weg ohne Stufen.“",
          target: 2,
          feedback: "Der Satz nennt eine Tatsache und leitet daraus eine praktische Konsequenz ab, ohne jemanden abzuwerten.",
        },
        {
          text: "„Typisch Fußballfans: Die sind doch alle nur auf Streit aus.“",
          target: 0,
          feedback: "„typisch“ und „alle“ verallgemeinern über eine ganze Gruppe, obwohl Fans verschieden sind.",
        },
        {
          text: "„Lars, dein Referat war ein einziges Desaster, und du solltest dich schämen.“",
          target: 1,
          feedback: "Der Satz wertet eine einzelne Person ab und greift sie persönlich an, statt sachlich zu kritisieren.",
        },
        {
          text: "„Die neue Mitschülerin spricht noch nicht so gut Deutsch, darum erklären wir ihr die Aufgaben langsamer.“",
          target: 2,
          feedback: "Der Satz beschreibt einen Umstand und nennt eine hilfreiche Reaktion, ohne die Person abzuwerten.",
        },
      ],
      conclusion:
        "Pauschale Aussagen über Gruppen und persönliche Abwertungen verletzen. Sachlich wird es, wenn du beschreibst, was geschieht, und dabei niemanden auf ein Merkmal reduzierst.",
    },
    casework: {
      title: "Eine Überschrift in der Schülerzeitung",
      story:
        "Die Redaktion der Schülerzeitung plant für die Titelseite die Überschrift **„Die Alten blockieren immer die Computer in der Stadtbücherei“**. Im Artikel geht es darum, dass ältere Menschen dort oft lange am Rechner sitzen und Jugendliche kaum Plätze bekommen.",
      steps: [
        {
          question: "Welche Wirkung kann die Überschrift auf ältere Menschen haben?",
          options: [
            "Sie ordnet alle Älteren einer Gruppe zu und wertet sie ab, auch wer nichts blockiert.",
            "Sie wirkt neutral, weil sie nur eine Tatsache nennt und keine Gruppe ausdrücklich beschimpft.",
            "Sie hat keine Wirkung, weil nur die Absicht der Redaktion zählt und die ist ja nicht böse gemeint.",
          ],
          answer: 0,
          explanation:
            "Die Überschrift trifft alle Älteren, nicht nur die, um die es im Artikel geht. Die Absicht der Redaktion ändert nichts daran, wie sie bei den Betroffenen ankommt.",
        },
        {
          question: "Welche Wörter machen die Überschrift pauschal?",
          options: [
            "„Die Alten“ und „immer“",
            "„blockieren“ und „Stadtbücherei“",
            "„Computer“ und „Titelseite“",
          ],
          answer: 0,
          explanation:
            "„Die Alten“ steckt alle Älteren in eine Schublade, und „immer“ behauptet, dass es ohne Ausnahme so ist. Im Artikel steht dagegen nur „oft“. Die anderen Wörter sind sachlich.",
        },
        {
          question: "Welche Überschrift nennt dasselbe Anliegen sachlicher und respektvoller?",
          options: [
            "Zu wenige Computerplätze: Wer darf wie lange an den Rechner?",
            "Schluss mit der Computer-Belagerung durch alle Senioren!",
            "Computerplätze: Die Jungen haben das Nachsehen!",
          ],
          answer: 0,
          explanation:
            "Die erste Überschrift benennt das Problem, nämlich zu wenige Plätze, und nicht eine Gruppe. Die anderen beiden stellen wieder eine Altersgruppe gegen die andere.",
        },
        {
          question:
            "Zwei Redaktionsmitglieder streiten: Eine sagt, Überschriften dürften zuspitzen. Der andere meint, jede Zuspitzung sei Diskriminierung. Was ist ein ausgewogenes Vorgehen?",
          options: [
            "Zuspitzen ist erlaubt, wenn die Redaktion die Wirkung prüft und eine respektvolle Alternative erwägt.",
            "Zuspitzungen werden grundsätzlich verboten, damit sich niemand getroffen fühlen kann und es keine Beschwerden gibt.",
            "Beschwerden werden nicht beachtet, weil sich Sprache ohnehin nicht regeln lässt und jeder sie anders versteht.",
          ],
          answer: 0,
          explanation:
            "Beide Sichtweisen haben recht: Zuspitzung gehört zu Zeitungen, aber ihre Wirkung muss geprüft werden. Ein Verbot und Gleichgültigkeit sind die beiden Extreme.",
        },
      ],
      verdict:
        "Die Überschrift wertet eine ganze Altersgruppe ab. Eine sachliche Fassung nennt das Problem statt der Gruppe. So bleibt die Redaktion ausgewogen: Sie darf zuspitzen, prüft aber die Wirkung.",
    },
    tasks: {
      1: {
        prompt:
          "Ein Mitschüler schreibt im Klassenchat: „Die Jungs aus der 9b sind alle Angeber, mit denen redet man besser gar nicht.“ Formuliere den Satz sachlich um und erkläre in zwei Sätzen, welche Wirkung der Originalsatz haben kann.",
        hints: [
          "Streiche die Pauschalisierung („alle“) und frage dich, was genau passiert ist.",
          "Beschreibe das Verhalten, statt Personen zu bewerten, und sage, was du dir wünschst.",
        ],
        model:
          "Zwei Jungen aus der 9b haben beim Sportfest laut geprahlt, das hat mich geärgert. Ich würde mir wünschen, dass wir in Ruhe darüber reden. Der Originalsatz steckt alle Jungen der 9b in dieselbe Schublade, obwohl nicht alle so sind, und er kann sie verletzen oder ausgrenzen. Außerdem beendet er ein Gespräch, bevor es begonnen hat.",
        criteria: [
          "Ersetzt die Pauschalisierung durch eine konkrete Beobachtung.",
          "Beschreibt das Verhalten, ohne Personen abzuwerten.",
          "Nennt eine mögliche Wirkung des Originalsatzes auf Betroffene.",
        ],
      },
      2: {
        prompt:
          "Du gehörst zur Redaktion der Schülerzeitung. Ein Beitrag beschreibt eine Gruppe spöttisch („Die Kinder aus den 5. Klassen sind sowieso nur laut und nerven alle.“). Schreibe eine Stellungnahme von vier bis fünf Sätzen: Nenne die mögliche Wirkung, nimm die Gegenposition („Das ist doch nur Spaß“) ernst und schlage eine Änderung vor.",
        hints: [
          "Frage dich, wer sich getroffen fühlen könnte und woran du das erkennst.",
          "Gib der Gegenposition einen fairen Satz, bevor du deinen Vorschlag machst.",
        ],
        model:
          "Der Satz über die Kinder aus den 5. Klassen kann diese verletzen, weil er alle Jüngeren als laut und lästig abstempelt, obwohl nicht alle so sind. Manche in der Redaktion sagen, es sei nur Spaß, und Zuspitzung gehöre zu einer Schülerzeitung. Das stimmt, und Humor ist erlaubt. Trotzdem sollten wir prüfen, ob der Spott jemanden trifft, der sich nicht wehren kann. Ich schlage vor, das Problem zu benennen, zum Beispiel „In den Pausen ist es oft sehr laut“, statt eine ganze Klassenstufe abzuwerten.",
        criteria: [
          "Nennt die mögliche Wirkung auf die Betroffenen.",
          "Berücksichtigt die Gegenposition fair.",
          "Macht einen konkreten, sachlichen Änderungsvorschlag.",
        ],
      },
    },
  },
  {
    id: "de-sprachebenen",
    lb: 4,
    unit: "4.1",
    covers: ["4.1.3"],
    title: "Sprachebenen: Umgangs- und Standardsprache gezielt wählen",
    intro:
      "Mit Freunden sprichst du anders als im Bewerbungsgespräch. Du lernst, die Sprachebene bewusst auf die Situation abzustimmen.",
    paragraphs: [
      "Lena schreibt ihrer Freundin: „Hab voll verpennt, sorry, komm gleich!“ Eine Stunde später schreibt sie an eine Firma: „Sehr geehrte Frau Berger, leider habe ich verschlafen und bitte um Entschuldigung.“ Beide Nachrichten sagen fast dasselbe, aber auf unterschiedlicher **Sprachebene**. Die **Umgangssprache** ist die Sprache des Alltags, vor allem im Mündlichen: Sie verkürzt („hab“), nutzt lockere Wörter („verpennen“, „Bock haben“) und Füllwörter („halt“, „irgendwie“) und baut oft unvollständige Sätze. Die **Standardsprache** gilt überall, wo du dich verständlich und allgemein anerkannt ausdrücken willst: in der Schule, in Briefen, in der Zeitung und in Bewerbungen. Sie verwendet vollständige Sätze, ausgeschriebene Formen und eine neutrale Wortwahl.",
      "Daneben gibt es weitere Ebenen. Die **gehobene Sprache** klingt feierlich und gewählt, zum Beispiel in Reden („Wir gedenken der Verstorbenen“). Auch förmliche Wörter wie „Obliegenheiten“ statt „Aufgaben“ gelten als gehoben. Die **Jugendsprache** verbindet Gruppen von Jugendlichen durch eigene Wörter, die sich schnell ändern; wer die Gruppe nicht kennt, versteht sie oft nicht. Welche Ebene passt, hängt von vier Dingen ab: vom Anlass, von den Angesprochenen, vom Medium (gesprochen oder geschrieben) und von deiner Absicht. In einem Bewerbungsgespräch erwartet man Standardsprache: vollständige, höfliche Sätze und eine sachliche Wortwahl. Im Chat mit Freunden wirkt dieselbe Sprache dagegen schnell steif.",
      "Eine falsch gewählte Ebene wirkt in beide Richtungen. Zu umgangssprachlich („Ich hab halt voll Bock auf die Ausbildung“) kann im Bewerbungsgespräch respektlos oder unvorbereitet wirken. Zu gehoben („Ich erlaube mir, meiner Freude über Ihre Einladung Ausdruck zu verleihen“) klingt gekünstelt. So wechselst du gezielt in die Standardsprache: Du ersetzt lockere Wörter durch neutrale („Bock haben“ durch „Lust haben“), schreibst Verkürzungen aus („hab“ wird „habe“), streichst Füllwörter wie „halt“ und „irgendwie“ und baust vollständige Sätze. Nach „weil“ steht in der Standardsprache das Verb am Ende: „weil ich Zeit habe“. Im Gespräch hörst du oft „weil ich habe Zeit“; der Duden führt diese Stellung als nicht standardsprachlich.",
    ],
    terms: [
      {
        term: "Sprachebene",
        text: "Die Stufe zwischen locker und gehoben, auf der ein Text oder ein Gespräch formuliert ist.",
      },
      {
        term: "Umgangssprache",
        text: "Die lockere, oft verkürzte Sprache des Alltags, die vor allem mündlich gebraucht wird.",
      },
      {
        term: "Standardsprache",
        text: "Die überall verständliche, geregelte Sprache für Schule, Beruf und Zeitung mit vollständigen Sätzen und neutraler Wortwahl.",
      },
      {
        term: "Gehobene Sprache",
        text: "Eine gewählte, feierliche Ausdrucksweise, die vor allem in Reden und besonderen Anlässen vorkommt.",
      },
      {
        term: "Jugendsprache",
        text: "Die Sprache einer Gruppe Jugendlicher mit eigenen Wörtern, die sich schnell ändern.",
      },
    ],
    examples: [
      {
        title: "Dieselbe Bitte auf drei Ebenen (eigens verfasst)",
        text: "Chat unter Freunden: „Kannste mir mal die Mathe-Hausaufgaben schicken?“\nNachricht an die Lehrerin: „Könnten Sie mir bitte die Hausaufgabe noch einmal schicken?“\nÜbertrieben gehoben: „Ich bitte Sie ergebenst, mir die Aufgaben nochmals zukommen zu lassen.“",
        analysis:
          "Die erste Fassung ist umgangssprachlich: „Kannste“ ist verkürzt, und „mal“ macht die Bitte locker. Die zweite ist Standardsprache mit Anrede „Sie“ und höflichem Konjunktiv. Die dritte ist gehoben und wirkt für eine Schulnachricht übertrieben. Die zweite Fassung passt zur Situation.",
      },
    ],
    takeaway:
      "Wähle die Sprachebene nach Anlass, Gegenüber und Medium: Im Bewerbungsgespräch und in Briefen passt die Standardsprache, unter Freunden die Umgangssprache. Zu locker wirkt respektlos, zu gehoben gekünstelt.",
    sourceIds: ["lp", "dwds", "duden"],
    quiz: {
      question: "Welche Sprachebene passt in einem Bewerbungsgespräch am besten?",
      answer: "Die Standardsprache mit vollständigen, höflichen Sätzen und neutraler Wortwahl.",
      wrong: [
        "Die Umgangssprache, weil sie locker wirkt und dadurch Sympathie weckt.",
        "Die gehobene Sprache, weil sie besonders gebildet klingt und beeindruckt.",
      ],
      explanation:
        "In einem Bewerbungsgespräch erwartet man eine höfliche, verständliche Standardsprache. Zu lockere Sprache kann respektlos wirken. Zu gehobene Sprache klingt gekünstelt und lässt dich unnatürlich erscheinen.",
    },
    workshop: {
      kind: "mark",
      title: "Passt die Sprachebene?",
      instruction:
        "Mara antwortet im Vorstellungsgespräch auf die Frage, warum sie sich beworben hat. Wähle oben eine Markierung und klicke die Stellen an, die für diese Situation nicht passen. Stellen in Standardsprache bleiben unmarkiert.",
      labels: ["Zu umgangssprachlich", "Zu gehoben"],
      text: [
        { t: "Guten Tag, vielen Dank für die Einladung. " },
        { t: "Mir gefällt der Beruf " },
        {
          t: "echt mega",
          label: 0,
          feedback: "„echt mega“ ist umgangssprachlich und für ein Bewerbungsgespräch zu locker. Besser wäre „sehr“.",
        },
        { t: ", weil ich gern organisiere. " },
        { t: "In meinem Schulpraktikum habe ich Termine abgestimmt und Gäste empfangen. " },
        { t: "Dabei habe ich gemerkt, dass ich auf Büroarbeit " },
        {
          t: "richtig Bock habe",
          label: 0,
          feedback: "„Bock haben“ ist umgangssprachlich. In Standardsprache sagst du zum Beispiel „große Lust habe“.",
        },
        { t: ". " },
        { t: "Wenn viel Arbeit anfällt, " },
        {
          t: "habe ich null Probleme",
          label: 0,
          feedback: "„null Probleme“ ist umgangssprachlich. Standardsprachlich wäre „komme ich gut zurecht“.",
        },
        { t: ". " },
        { t: "Außerdem arbeite ich gern im Team. " },
        {
          t: "Meine Obliegenheiten erfülle ich stets gewissenhaft. ",
          label: 1,
          feedback: "„Obliegenheiten“ ist ein gehobenes Wort für „Aufgaben“ und klingt im Gespräch gekünstelt. Natürlicher wäre „Ich erledige meine Aufgaben gewissenhaft.“",
        },
        {
          t: "Ich gedenke, mich in Ihrem geschätzten Hause zu bewähren.",
          label: 1,
          feedback: "„gedenken“ im Sinne von „vorhaben“ und „in Ihrem geschätzten Hause“ sind gehoben und wirken im Gespräch steif. In einem Bewerbungsgespräch genügt „Ich möchte mich bei Ihnen bewähren.“",
        },
      ],
      conclusion:
        "Die Standardsprache passt in ein Bewerbungsgespräch. Zu lockere Wörter wirken respektlos, zu gehobene gekünstelt. Du erkennst beides am Anlass und am Gegenüber.",
    },
    casework: {
      title: "Eine E-Mail für das Praktikum",
      story:
        "Jonas will ein Praktikum in einer Schreinerei machen und schreibt an den Inhaber: **„Hi Herr Brandt, ich wollte mal fragen, ob bei Ihnen noch ein Platz frei ist. Wär echt nett. LG Jonas“** Herrn Brandt kennt er nicht.",
      steps: [
        {
          question: "Auf welcher Sprachebene schreibt Jonas?",
          options: [
            "Umgangssprache, wie in einer Chatnachricht an Freunde",
            "Gehobene Sprache, wie in einer feierlichen Rede vor Gästen",
            "Fachsprache des Schreinerhandwerks",
          ],
          answer: 0,
          explanation:
            "„Hi“, „wollte mal fragen“, „Wär echt nett“ und „LG“ sind typisch für lockere Nachrichten unter Freunden.",
        },
        {
          question: "Warum passt diese Sprachebene hier nicht?",
          options: [
            "Herr Brandt ist ein fremder Erwachsener, und eine Anfrage verlangt höfliche Standardsprache.",
            "Umgangssprache ist grundsätzlich falsch und darf in keiner Nachricht an einen Erwachsenen benutzt werden.",
            "Herr Brandt versteht umgangssprachliche Wörter nicht, weil er älter ist als Jonas.",
          ],
          answer: 0,
          explanation:
            "Die Umgangssprache ist nicht falsch, sondern hier unpassend: Gegenüber und Anlass verlangen mehr Förmlichkeit. Verstehen würde Herr Brandt Jonas durchaus.",
        },
        {
          question: "Welche Fassung passt zur Situation?",
          options: [
            "Sehr geehrter Herr Brandt, haben Sie noch einen Praktikumsplatz frei? Ich würde mich über eine Antwort freuen. Mit freundlichen Grüßen Jonas Weber",
            "Verehrter Herr Brandt, ich gestatte mir, ergebenst anzufragen, ob Sie mir in Ihrer Werkstatt eine Stätte der Bildung bereitstellen könnten.",
            "Guten Tag, ist bei euch noch was frei? Würd gern bei euch reinschnuppern. Gruß Jonas",
          ],
          answer: 0,
          explanation:
            "Die erste Fassung ist höflich, vollständig und sachlich. Die zweite ist übertrieben gehoben, die dritte noch zu locker.",
        },
        {
          question: "Wäre eine ähnlich lockere Nachricht in einem Chat mit einem Freund auch falsch?",
          options: [
            "Nein, dort passt die lockere Sprache, denn es kommt auf die Situation an.",
            "Ja, denn Umgangssprache ist in jeder Situation falsch, auch unter Freunden.",
            "Ja, denn auch Freunde erwarten eine förmliche Anrede und vollständige Sätze.",
          ],
          answer: 0,
          explanation:
            "Keine Sprachebene ist an sich besser. Unter Freunden ist der lockere Ton angemessen, nur bei Fremden und in Bewerbungen nicht.",
        },
      ],
      verdict:
        "Jonas’ Nachricht ist nicht falsch, aber für diesen Anlass unpassend. An einen Fremden schreibt er in Standardsprache, unter Freunden darf er locker bleiben. Entscheidend ist die Situation.",
    },
    tasks: {
      1: {
        prompt:
          "Formuliere diese Antwort aus einem Vorstellungsgespräch in Standardsprache um: „Ich hab halt echt Lust auf die Lehre, und Stress ist bei mir kein Ding.“ Schreibe die neue Fassung und nenne zwei Änderungen.",
        hints: [
          "Markiere zuerst die Wörter, die du nur im Gespräch mit Freunden sagen würdest.",
          "Schreibe Verkürzungen aus, streiche Füllwörter und suche für lockere Wendungen neutrale.",
        ],
        model:
          "Ich habe große Lust auf die Lehre, und auch bei viel Arbeit bleibe ich ruhig. Ich habe das Füllwort „halt“, die Verkürzung „hab“ und die lockere Wendung „kein Ding“ durch neutrale Formulierungen ersetzt. So klingt die Antwort höflich und sachlich, aber nicht gekünstelt.",
        criteria: [
          "Verwendet vollständige Sätze ohne Verkürzungen und Füllwörter.",
          "Ersetzt die lockere Wendung durch eine neutrale Formulierung.",
          "Nennt zwei Änderungen und begründet sie mit der Situation.",
        ],
      },
      2: {
        prompt:
          "Du kannst am Samstag nicht beim Schulfest helfen. Schreibe dieselbe Mitteilung in zwei Fassungen: Fassung A geht als Chatnachricht an einen Freund aus der Klasse, Fassung B als E-Mail an die Schulleiterin. Erkläre in einem Satz, woran man den Unterschied erkennt.",
        hints: [
          "Überlege für jede Fassung: Wer liest sie, und was erwartet er oder sie?",
          "Achte in Fassung B auf Anrede, vollständige Sätze, neutrale Wörter und eine höfliche Schlussformel.",
        ],
        model:
          "Fassung A: „Hey Ben, ich kann am Samstag leider nicht beim Schulfest helfen, ich hab Familienfeier. Sag den anderen Bescheid, ok?“ Fassung B: „Sehr geehrte Frau Weber, leider kann ich am Samstag nicht beim Schulfest helfen, weil ich an einer Familienfeier teilnehme. Ich bitte um Ihr Verständnis. Mit freundlichen Grüßen Mia Schmidt“ Der Unterschied zeigt sich an Anrede, Wortwahl und Satzbau: A ist verkürzt und locker, B vollständig, höflich und neutral.",
        criteria: [
          "Fassung A ist erkennbar umgangssprachlich, Fassung B erkennbar standardsprachlich.",
          "Fassung B enthält Anrede, Schlussformel und vollständige Sätze.",
          "Der Unterschied wird in einem Satz benannt.",
        ],
      },
    },
  },
  {
    id: "de-praezise-formulieren",
    lb: 4,
    unit: "4.1",
    covers: ["4.1.4"],
    title: "Präzise formulieren: Verallgemeinerungen und Doppelungen vermeiden",
    intro:
      "Wer „alle“ und „immer“ sagt, ist leicht zu widerlegen. Du formulierst genauer, streichst Doppelungen und variierst deinen Ausdruck.",
    paragraphs: [
      "Lara schreibt in der Schülerzeitung: „Alle Lehrkräfte geben immer zu viele Hausaufgaben.“ Eine Lehrerin braucht nur ein Gegenbeispiel, und Laras Aussage fällt in sich zusammen. Das ist das Problem von **Verallgemeinerungen**: Wörter wie „alle“, „immer“, „nie“, „jeder“, „keiner“ oder „überall“ behaupten etwas ohne Ausnahme. Das stimmt selten, und wer argumentiert, macht sich damit angreifbar. Genauer wird die Aussage, wenn du Mengen und Häufigkeiten abstufst: „manche“, „viele“, „die meisten“, „oft“, „meistens“. Noch besser sind konkrete Angaben: „Drei Lehrkräfte haben diese Woche Aufgaben für mehr als eine Stunde gegeben.“ Man nennt das eine **differenzierte** Aussage.",
      "Das zweite Problem sind **Redundanzen**: Etwas wird überflüssig doppelt gesagt. Eine besondere Form ist die Doppelung, auch **Pleonasmus** genannt: „neue Innovation“ (eine Innovation ist schon etwas Neues), „bereits schon“ (beide Wörter bedeuten hier dasselbe) oder „alter Greis“ (ein Greis ist ein alter Mann). Solche Doppelungen streichst du: „Innovation“, „schon“, „Greis“. Auch ganze Sätze können dasselbe zweimal sagen: „Das Essen ist zu teuer. Es kostet zu viel Geld.“ Bewusste Wiederholung zur Betonung ist etwas anderes. Du erkennst sie daran, dass sie einen Zweck hat und nicht nur Füllmaterial ist.",
      "Schließlich willst du sprachlich variabel schreiben. Wer fünf Sätze hintereinander mit „Dann“ beginnt oder dreimal „Spiel“ in einem Satz sagt, wirkt eintönig. Du kannst Wörter durch Synonyme oder Pronomen ersetzen („das Spiel“, „die Partie“, „sie“), Satzanfänge ändern („Am Samstag spielten wir …“ statt „Wir spielten am Samstag …“) und Sätze unterschiedlich bauen. Zum Variieren gehört auch Präzision. Allerweltswörter wie „machen“, „tun“, „Sache“ und „Ding“ sagen wenig. Ein genaueres Verb oder Adjektiv trifft besser: „ein Referat halten“ statt „machen“, „eine anspruchsvolle Aufgabe“ statt „eine schwere Sache“. Achte beim Ersetzen auf den Beiklang der Wörter.",
    ],
    terms: [
      {
        term: "Verallgemeinerung",
        text: "Eine Aussage mit „alle“, „immer“ oder „nie“, die eine Ausnahme nicht zulässt und deshalb leicht widerlegt werden kann.",
      },
      {
        term: "Differenzierte Aussage",
        text: "Eine genaue Aussage, die Mengen und Häufigkeiten abstuft, zum Beispiel mit „manche“, „oft“ oder einer Zahl.",
      },
      {
        term: "Redundanz",
        text: "Eine überflüssige Mehrfachnennung derselben Information innerhalb eines Satzes oder Textes.",
      },
      {
        term: "Pleonasmus",
        text: "Eine Doppelung sinnverwandter Ausdrücke, zum Beispiel „neue Innovation“, die meist als Stilfehler gilt.",
      },
      {
        term: "Allerweltswort",
        text: "Ein Wort wie „machen“ oder „Sache“, das so allgemein ist, dass es wenig aussagt und oft durch ein genaueres ersetzt werden kann.",
      },
    ],
    examples: [
      {
        title: "Eine Aussage überarbeitet (eigens verfasst)",
        text: "Vorher: Die Mensa ist immer zu teuer, und alle finden das Essen schlecht.\nNachher: Mit 4,50 Euro pro Mittagessen liegt die Mensa über dem, was viele Schülerinnen und Schüler ausgeben möchten. Bei einer Umfrage in unserer Klasse fanden zwölf von 25 das Essen nicht gut genug.",
        analysis:
          "Die erste Fassung behauptet etwas ohne Ausnahme („immer“, „alle“). Die zweite nennt einen Preis und eine Zahl und sagt „viele“ statt „alle“. Dadurch ist sie überprüfbar und schwerer zu widerlegen, und sie überzeugt mehr.",
      },
    ],
    takeaway:
      "Genau schreiben heißt: Verallgemeinerungen durch „manche“, „oft“ oder Zahlen ersetzen, Doppelungen wie „neue Innovation“ streichen und Wiederholungen durch Synonyme, Pronomen und anderen Satzbau variieren.",
    sourceIds: ["lp", "dwds"],
    quiz: {
      question: "Welche Formulierung vermeidet eine Verallgemeinerung?",
      answer: "In unserer Klasse kamen diese Woche vier Personen mehrmals zu spät.",
      wrong: [
        "Alle aus unserer Klasse kommen ständig zu spät zum Unterricht.",
        "In unserer Klasse kommt eigentlich nie jemand pünktlich zum Unterricht.",
      ],
      explanation:
        "Nur der erste Satz nennt eine überprüfbare Zahl und einen Zeitraum. „alle“ und „ständig“ sowie „nie jemand“ behaupten etwas ohne Ausnahme. Das Wort „eigentlich“ macht den dritten Satz nicht genauer.",
    },
    workshop: {
      kind: "mark",
      title: "Verallgemeinerungen und Doppelungen finden",
      instruction:
        "Wähle oben eine Markierung und klicke im Kommentar die Stellen an, die eine Verallgemeinerung oder eine Doppelung zeigen. Genaue Angaben bleiben unmarkiert.",
      labels: ["Verallgemeinerung", "Doppelung (Pleonasmus)"],
      text: [
        { t: "Unsere Schule braucht dringend mehr Fahrradständer. " },
        { t: "Morgens ist " },
        {
          t: "immer alles voll",
          label: 0,
          feedback: "„immer“ und „alles“ behaupten ohne Ausnahme, dass jeden Morgen jeder Platz belegt ist. Das ist leicht zu widerlegen.",
        },
        { t: ". " },
        {
          t: "Alle Jugendlichen",
          label: 0,
          feedback: "„alle“ schreibt der ganzen Gruppe ein Verhalten zu. Genauer wäre „viele Jugendliche“ oder eine Zahl.",
        },
        { t: " müssen ihre Räder deshalb an Geländern und Laternen anketten, und " },
        {
          t: "kein Mensch",
          label: 0,
          feedback: "„kein Mensch“ verneint ohne Ausnahme. Dass sich niemand kümmert, lässt sich nicht belegen.",
        },
        { t: " kümmert sich darum. " },
        { t: "Viele stellen ihr Rad an den Zaun. " },
        { t: "Bei einer Zählung am Montag standen 40 Räder am Zaun. " },
        { t: "Ein neuer Ständer wäre eine " },
        {
          t: "neue Innovation",
          label: 1,
          feedback: "Eine Innovation ist schon etwas Neues. „neue“ doppelt die Bedeutung und kann gestrichen werden.",
        },
        { t: " für den Schulhof, und die Stadt sollte " },
        {
          t: "bereits schon",
          label: 1,
          feedback: "„bereits“ und „schon“ bedeuten hier dasselbe. Eines der beiden Wörter genügt.",
        },
        { t: " im Herbst entscheiden." },
      ],
      conclusion:
        "Verallgemeinerungen wie „immer“ und „alle“ machen eine Aussage angreifbar, Doppelungen wie „neue Innovation“ blähen sie auf. Genaue Angaben und knappe Formulierungen überzeugen mehr.",
    },
    casework: {
      title: "Ein Kommentar zum Handyverbot",
      story:
        "Ben schreibt für die Schülerzeitung: **„Handys stören immer den Unterricht. Alle Jugendlichen starren nur noch auf den Bildschirm. Wir brauchen ein neues Handyverbot, das neu eingeführt wird. Ein Handy macht die Konzentration kaputt.“** Die Redaktion bittet ihn, den Text zu überarbeiten.",
      steps: [
        {
          question: "Welche Wörter machen die ersten beiden Sätze leicht angreifbar?",
          options: [
            "„immer“ und „alle“: Sie behaupten etwas ohne Ausnahme",
            "„Unterricht“ und „Bildschirm“: Sie sind zu allgemein",
            "„stören“ und „starren“: Sie sind zu negativ und zu drastisch",
          ],
          answer: 0,
          explanation:
            "Ein einziger Fall, in dem ein Handy nicht stört oder ein Jugendlicher nicht auf den Bildschirm starrt, widerlegt die Sätze.",
        },
        {
          question: "Welche Fassung ist differenziert, ohne vage zu werden?",
          options: [
            "Handys können den Unterricht stören, besonders wenn sie in Arbeitsphasen benutzt werden.",
            "Handys stören eigentlich fast immer, und zwar jeden Tag, jede Stunde und überall.",
            "Handys sind laut mancher Leute vielleicht irgendwie ein bisschen schädlich, jedenfalls manchmal.",
          ],
          answer: 0,
          explanation:
            "Die erste Fassung sagt, wann und wodurch Handys stören. Die zweite verallgemeinert weiter, und die dritte ist so vorsichtig, dass sie nichts mehr aussagt.",
        },
        {
          question: "Welche Doppelung steckt im dritten Satz?",
          options: [
            "„neues Handyverbot, das neu eingeführt wird“: „neu“ steht doppelt",
            "„Wir brauchen“ und „Handyverbot“: Beide Teile sagen dasselbe",
            "„Handyverbot“ und „Unterricht“: Beide Wörter meinen dasselbe",
          ],
          answer: 0,
          explanation:
            "Ein „neues“ Verbot, das „neu eingeführt“ wird, sagt zweimal dasselbe. Ein Wort davon kann wegfallen.",
        },
        {
          question: "Welche Fassung ersetzt „macht die Konzentration kaputt“ am genauesten, ohne zu übertreiben?",
          options: [
            "beeinträchtigt die Konzentration",
            "zerstört die Konzentration auf Dauer",
            "ruiniert die Konzentration vollständig",
          ],
          answer: 0,
          explanation:
            "„beeinträchtigen“ sagt genau, dass die Konzentration schwächer wird. „zerstören“ und „ruinieren“ übertreiben und behaupten wieder etwas ohne Ausnahme.",
        },
      ],
      verdict:
        "Ben ersetzt „immer“ und „alle“ durch genaue Angaben, streicht die Doppelung „neu … neu“ und wählt ein präzises Verb. So wird sein Argument schwerer zu widerlegen.",
    },
    tasks: {
      1: {
        prompt:
          "Überarbeite diesen Beitrag aus der Schülerzeitung: „Alle in unserer Klasse hassen Sportunterricht, und das ist schon immer so. Die Turnhalle ist einfach schlecht und macht keinen Spaß.“ Schreibe zwei bis drei Sätze und nenne, was du geändert hast.",
        hints: [
          "Suche Wörter wie „alle“ und „immer“ und ersetze sie durch „manche“, „oft“ oder eine Zahl.",
          "Ersetze Allerweltswörter wie „schlecht“ und „keinen Spaß“ durch genauere Angaben, zum Beispiel was an der Turnhalle stört.",
        ],
        model:
          "Fünf von 25 Schülerinnen und Schülern unserer Klasse gehen nur ungern in den Sportunterricht. Sie nennen vor allem die kalte Umkleide und die schlecht beleuchtete Turnhalle als Gründe. Ich habe „alle“ und „schon immer“ durch eine Zahl ersetzt und die Wörter „schlecht“ und „keinen Spaß“ durch genaue Angaben.",
        criteria: [
          "Ersetzt „alle“ und „immer“ durch genauere Angaben.",
          "Nennt genaue Gründe statt allgemeiner Wertungen.",
          "Erklärt kurz, was geändert wurde.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Absatz von vier bis fünf Sätzen für die Schülerzeitung zu der Frage „Brauchen wir längere Pausen?“. Vermeide Verallgemeinerungen und Doppelungen, nenne mindestens eine konkrete Zahl oder ein Beispiel und beginne nicht zwei Sätze mit demselben Wort.",
        hints: [
          "Plane zuerst zwei Argumente und je ein Beispiel oder eine Zahl.",
          "Prüfe jeden Satz auf „alle“, „immer“, „nie“ und auf Wörter, die dasselbe doppelt sagen.",
        ],
        model:
          "Längere Pausen könnten manchen von uns helfen. In den ersten Stunden am Vormittag fällt es vielen schwer, konzentriert zu bleiben, und 15 Minuten reichen oft nicht, um etwas zu essen und kurz durchzuatmen. Manche Lehrkräfte befürchten dagegen, dass der Stoff nicht mehr in die Stunden passt. Ich schlage deshalb vor, die große Pause probeweise um zehn Minuten zu verlängern und nach einem Monat in den Klassen zu prüfen, ob sich die Konzentration verbessert hat.",
        criteria: [
          "Enthält keine Verallgemeinerung wie „alle“, „immer“ oder „nie“.",
          "Nennt eine konkrete Zahl oder ein Beispiel.",
          "Beginnt keine zwei Sätze mit demselben Wort.",
        ],
      },
    },
  },
  {
    id: "de-satzbau-wiederholung",
    lb: 4,
    unit: "4.2",
    covers: ["4.2.1"],
    title: "Satzbau aus Klasse 8 wiederholen und in eigenen Texten nutzen",
    intro:
      "Konjunktiv, Satzglieder, Infinitiv- und Partizipgruppen: Du wiederholst den Stoff aus Klasse 8 und nutzt ihn in eigenen Texten.",
    paragraphs: [
      "Wiederholung aus Klasse 8: Der **Konjunktiv I** gibt die Aussage einer anderen Person in der indirekten Rede wieder. Aus „Mia sagt: ‚Ich habe Hunger.‘“ wird „Mia sagt, sie habe Hunger.“ Du bildest ihn aus dem Verbstamm mit den Endungen -e, -est, -e, -en, -et, -en; „sein“ ist unregelmäßig („er sei“). Lautet die Form wie der Indikativ, etwa bei „sie haben“, nimmst du den **Konjunktiv II** als Ersatz: „Die Gäste sagen, sie hätten Zeit.“ Der Konjunktiv II drückt außerdem Wünsche, Unwirkliches und höfliche Bitten aus: „Wenn ich mehr Zeit hätte, würde ich öfter lesen.“ oder „Könntest du mir helfen?“ Bei vielen Verben sieht er wie das Präteritum aus, dann hilft „würde“ mit dem Infinitiv.",
      "Wiederholung aus Klasse 8: Ein Satz besteht aus **Satzgliedern**: aus Subjekt, Prädikat, Objekten und Adverbialen. Du findest sie mit der **Umstellprobe**: Was sich im Aussagesatz gemeinsam an den Satzanfang schieben lässt, ist ein Satzglied. Das Prädikat bleibt dabei an zweiter Stelle. So variierst du Satzanfänge in eigenen Texten: „Mia fuhr gestern mit dem Rad zur Schule.“ wird zu „Gestern fuhr Mia mit dem Rad zur Schule.“ Außerdem unterscheidest du Satzarten: Der Aussagesatz informiert, der Fragesatz fordert eine Antwort, der Aufforderungssatz verlangt eine Handlung. Wenn du sie bewusst wechselst, wirkt ein Text lebendiger, zum Beispiel mit einer Frage am Absatzanfang.",
      "Wiederholung aus Klasse 8: **Infinitiv- und Partizipgruppen** verdichten Informationen. Eine Infinitivgruppe enthält „zu“ und ein Verb im Infinitiv: „Sie lernt viel, um die Prüfung zu bestehen.“ Nach dem Amtlichen Regelwerk (Fassung 2024) grenzt du sie grundsätzlich mit Komma ab, mit „um … zu“, „ohne … zu“ und „statt … zu“ genauso wie ohne einleitendes Wort: „Er hofft, den Pokal zu gewinnen.“ Eine Partizipgruppe enthält ein Partizip: „Vom Regen überrascht, rannten wir zum Bus.“ oder „Auf der Bank sitzend, las er die Zeitung.“ Das Komma nach einer Partizipgruppe am Satzanfang darfst du setzen oder weglassen. Beide Gruppen ersetzen einen Nebensatz („Weil wir vom Regen überrascht wurden, …“) und machen den Satz kürzer. Zu viele davon machen einen Satz aber schwer lesbar.",
      "Wiederholung aus Klasse 8: Manchmal häufen sich in einem Text Wörter derselben Wortart, und das hat eine Wirkung. Viele Verben treiben eine Handlung voran: „Er rannte, sprang, stolperte, rappelte sich auf.“ Viele Adjektive machen eine Beschreibung anschaulich: „ein alter, schiefer, moosbewachsener Turm“. Viele Nomen wirken dicht und sachlich: „Die Prüfung ergab Mängel an Bremsen, Leitungen und Kabeln.“ Beim Überarbeiten eigener Texte nutzt du dein Wissen mit Absicht: Konjunktiv für wiedergegebene Aussagen, Umstellprobe gegen eintönige Satzanfänge, Infinitiv- und Partizipgruppen für kompakte Sätze und die Wortarten für die gewünschte Wirkung. Auch im Gespräch hilft dir dieses Wissen, etwa für höfliche Bitten im Konjunktiv II oder für Berichte darüber, was andere gesagt haben.",
    ],
    terms: [
      {
        term: "Konjunktiv I",
        text: "Die Verbform der indirekten Rede, mit der du wiedergibst, was jemand anderes gesagt hat, zum Beispiel „er sei“.",
      },
      {
        term: "Konjunktiv II",
        text: "Die Verbform für Wünsche, Unwirkliches und höfliche Bitten und der Ersatz, wenn der Konjunktiv I wie der Indikativ lautet.",
      },
      {
        term: "Satzglied",
        text: "Ein Teil des Satzes, der sich bei der Umstellprobe nur gemeinsam verschieben lässt, zum Beispiel Subjekt oder Adverbial.",
      },
      {
        term: "Infinitivgruppe",
        text: "Eine Wortgruppe mit „zu“ und einem Verb im Infinitiv, etwa „um die Prüfung zu bestehen“.",
      },
      {
        term: "Partizipgruppe",
        text: "Eine Wortgruppe mit einem Partizip, die einen Nebensatz ersetzt, etwa „Auf der Bank sitzend“.",
      },
      {
        term: "Wortarthäufung",
        text: "Die auffällige Häufung von Verben, Adjektiven oder Nomen in einem Text, die eine bestimmte Wirkung erzeugt.",
      },
    ],
    examples: [
      {
        title: "Ein Absatz überarbeitet (eigens verfasst)",
        text: "Vorher: Mia kam zu spät. Mia sagte: „Der Bus hat Verspätung.“ Mia war erschöpft vom Rennen. Mia setzte sich.\nNachher: Gestern kam Mia zu spät. Sie sagte, der Bus habe Verspätung. Erschöpft vom Rennen, setzte sie sich auf ihren Platz.",
        analysis:
          "Die zweite Fassung beginnt mit einem Adverbial, ersetzt das Subjekt durch ein Pronomen und gibt die Aussage im Konjunktiv I wieder („habe“). Eine Partizipgruppe fasst zwei Sätze zusammen. So entsteht ein Text ohne eintönige Satzanfänge.",
      },
    ],
    takeaway:
      "Konjunktiv I gibt Gesagtes wieder, Konjunktiv II drückt Wünsche und Unwirkliches aus. Mit der Umstellprobe variierst du Satzanfänge, mit Infinitiv- und Partizipgruppen verdichtest du Sätze, und mit Wortarten steuerst du die Wirkung.",
    sourceIds: ["lp", "regelwerk"],
    quiz: {
      question: "Warum steht in „Die Gäste sagten, sie hätten keine Zeit.“ der Konjunktiv II?",
      answer: "Der Konjunktiv I „sie haben“ lautet wie der Indikativ, daher nimmt man den Konjunktiv II als Ersatz.",
      wrong: [
        "Die Gäste äußern einen Wunsch, und der Konjunktiv II ist die Form, die Wünsche ausdrückt.",
        "Indirekte Rede steht grundsätzlich im Konjunktiv II, der Konjunktiv I kommt dabei nie vor.",
      ],
      explanation:
        "Indirekte Rede steht zuerst im Konjunktiv I. Weil „sie haben“ aber genauso lautet wie der Indikativ, erkennt man die indirekte Rede nicht. Dann hilft der Konjunktiv II „sie hätten“. Ein Wunsch wird hier nicht geäußert.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Struktur ist das?",
      instruction:
        "Jeder Satz zeigt eine Struktur aus Klasse 8. Ordne ihn der Struktur zu, die in ihm vorkommt.",
      categories: ["Konjunktiv I", "Konjunktiv II", "Infinitivgruppe", "Partizipgruppe"],
      entries: [
        {
          text: "Die Sprecherin erklärte, das Konzert sei ausverkauft.",
          target: 0,
          feedback: "„sei“ ist Konjunktiv I und gibt in indirekter Rede wieder, was die Sprecherin gesagt hat.",
        },
        {
          text: "Wenn ich mehr Taschengeld hätte, würde ich mir ein Fahrrad kaufen.",
          target: 1,
          feedback: "„hätte“ und „würde“ drücken eine Bedingung aus, die nicht erfüllt ist: Konjunktiv II.",
        },
        {
          text: "Mia versucht, den Bus noch zu erreichen.",
          target: 2,
          feedback: "„den Bus noch zu erreichen“ besteht aus „zu“ und einem Verb im Infinitiv: eine Infinitivgruppe.",
        },
        {
          text: "Auf dem Sofa liegend, las Mia den ganzen Nachmittag.",
          target: 3,
          feedback: "„Auf dem Sofa liegend“ enthält das Partizip „liegend“ und ersetzt einen Nebensatz.",
        },
        {
          text: "Ben schrieb in einer Nachricht, er komme später.",
          target: 0,
          feedback: "„komme“ ist Konjunktiv I und unterscheidet sich vom Indikativ „kommt“: indirekte Rede.",
        },
        {
          text: "Ich wünschte, ich könnte fliegen.",
          target: 1,
          feedback: "„könnte“ drückt einen Wunsch aus, der nicht erfüllbar ist: Konjunktiv II.",
        },
      ],
      conclusion:
        "Konjunktiv I und II, Infinitivgruppen und Partizipgruppen erkennst du an ihren Formen: Endungen auf -e, „hätte“ oder „würde“, „zu“ mit Infinitiv und ein Partizip in einer Wortgruppe, die einen Nebensatz ersetzt.",
    },
    casework: {
      title: "Ein Interview wird zum Bericht",
      story:
        "Die Schülerzeitung druckt ein Interview mit einer Handballtrainerin. Sie sagt: **„Wir haben zu wenig trainiert. Wenn wir mehr Zeit gehabt hätten, wären wir besser vorbereitet gewesen. Ich hoffe, im nächsten Jahr den Pokal zu gewinnen.“** Ben soll daraus einen Bericht schreiben.",
      steps: [
        {
          question: "Wie gibt Ben den ersten Satz („Wir haben zu wenig trainiert.“) in indirekter Rede wieder?",
          options: [
            "Die Trainerin sagte, sie hätten zu wenig trainiert.",
            "Die Trainerin sagte, sie hat zu wenig trainiert.",
            "Die Trainerin sagte, wir hätten zu wenig trainiert.",
          ],
          answer: 0,
          explanation:
            "Der Konjunktiv I „sie haben“ lautet wie der Indikativ, deshalb steht der Konjunktiv II „hätten“. „sie hat“ ist Indikativ Singular und passt nicht zu „wir“. In der Wiedergabe wird aus „wir“ außerdem „sie“, denn Ben berichtet über die Mannschaft.",
        },
        {
          question: "Was drückt der zweite Satz („Wenn wir mehr Zeit gehabt hätten, wären wir besser vorbereitet gewesen.“) aus?",
          options: [
            "Etwas, das nicht eingetreten ist: Es wurde zu wenig trainiert, also fehlte die Vorbereitung.",
            "Die Wiedergabe einer fremden Aussage in indirekter Rede, die die Trainerin zitiert.",
            "Eine Aufforderung an die Mannschaft, im nächsten Jahr mehr zu trainieren.",
          ],
          answer: 0,
          explanation:
            "Der Konjunktiv II „gehabt hätten“ und „wären“ beschreibt eine unerfüllte Bedingung in der Vergangenheit. Wiedergegeben wird hier nichts, und aufgefordert auch nicht.",
        },
        {
          question: "Welcher Teil des dritten Satzes ist eine Infinitivgruppe?",
          options: [
            "im nächsten Jahr den Pokal zu gewinnen",
            "Ich hoffe, im nächsten Jahr den Pokal",
            "Ich hoffe, im nächsten Jahr",
          ],
          answer: 0,
          explanation:
            "Eine Infinitivgruppe enthält „zu“ und ein Verb im Infinitiv: „zu gewinnen“. In den anderen Ausschnitten steht der Hauptsatz „Ich hoffe“, und der Infinitiv mit „zu“ fehlt.",
        },
        {
          question:
            "Ben will im Bericht den Satz „Der Verein hat im Mai das Turnier gewonnen.“ mit „Im Mai“ beginnen. Welche Umstellung ist richtig?",
          options: [
            "Im Mai hat der Verein das Turnier gewonnen.",
            "Im Mai der Verein hat das Turnier gewonnen.",
            "Hat im Mai der Verein das Turnier gewonnen?",
          ],
          answer: 0,
          explanation:
            "Im Aussagesatz bleibt das Prädikat an zweiter Stelle, hier „hat“. Die dritte Fassung ist ein Fragesatz und ändert deshalb die Satzart.",
        },
      ],
      verdict:
        "Ben nutzt den Konjunktiv I und seinen Ersatz für die indirekte Rede, erkennt den Konjunktiv II als Ausdruck des Unwirklichen und variiert den Satzanfang mit der Umstellprobe, ohne die Satzart zu ändern.",
    },
    practice: {
      kind: "choose",
      title: "Konjunktiv und Infinitivgruppen: drei Sätze pro Runde",
      instruction:
        "Wähle in jedem Satz die Form oder das Wort, das grammatisch passt. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "Ben sagt, er ",
            options: ["sei", "seien", "seid"],
            answer: 0,
            after: " heute krank.",
            feedback:
              "In der indirekten Rede steht der Konjunktiv I. Zu „er“ gehört „sei“, das sich vom Indikativ „ist“ unterscheidet.",
          },
          {
            before: "Mia schreibt, ihre Schwester ",
            options: ["komme", "kommen", "kämen"],
            answer: 0,
            after: " morgen später.",
            feedback:
              "Der Konjunktiv I der dritten Person Singular endet auf -e: sie komme. „kommen“ und „kämen“ sind Pluralformen und passen nicht zu einer einzelnen Person.",
          },
          {
            before: "Die Gäste sagen, sie ",
            options: ["hätten", "habe", "hat"],
            answer: 0,
            after: " keine Zeit.",
            feedback:
              "Der Konjunktiv I „sie haben“ sieht aus wie der Indikativ. Dann nimmst du als Ersatz den Konjunktiv II: sie hätten.",
          },
          {
            before: "Wenn ich mehr Zeit ",
            options: ["hätte", "habe", "hatte"],
            answer: 0,
            after: ", würde ich öfter lesen.",
            feedback:
              "Eine unerfüllte Bedingung steht im Konjunktiv II: hätte. „habe“ ist Konjunktiv I und „hatte“ der Indikativ.",
          },
          {
            before: "Ich wünschte, ich ",
            options: ["könnte", "kann", "konnte"],
            answer: 0,
            after: " besser Gitarre spielen.",
            feedback:
              "Ein Wunsch, der nicht erfüllt ist, steht im Konjunktiv II: könnte. „kann“ und „konnte“ sind Indikativ.",
          },
          {
            before: "Er lernt jeden Tag, ",
            options: ["um", "weil", "damit"],
            answer: 0,
            after: " die Prüfung zu bestehen.",
            feedback:
              "Eine Infinitivgruppe mit „zu“ wird mit „um“ eingeleitet: um die Prüfung zu bestehen. Vor „um … zu“ steht ein Komma.",
          },
          {
            before: "Sie ging nach Hause, ",
            options: ["ohne", "weil", "obwohl"],
            answer: 0,
            after: " sich zu verabschieden.",
            feedback:
              "Vor einem Infinitiv mit „zu“ passt „ohne“: ohne sich zu verabschieden. „weil“ und „obwohl“ brauchen einen Nebensatz mit gebeugtem Verb.",
          },
          {
            before: "Auf der Bank ",
            options: ["sitzend", "sitzen", "sitzt"],
            answer: 0,
            after: ", las er die Zeitung.",
            feedback:
              "Die Partizipgruppe am Satzanfang braucht ein Partizip: Auf der Bank sitzend. Sie ersetzt einen Nebensatz wie „während er auf der Bank saß“.",
          },
        ],
        2: [
          {
            before: "Die Pressesprecherin erklärte auf der Pressekonferenz, die Firma ",
            options: ["werde", "werden", "wirst"],
            answer: 0,
            after: " im nächsten Jahr zweihundert neue Stellen schaffen.",
            feedback:
              "Die indirekte Rede steht im Konjunktiv I. Zu „die Firma“ gehört „werde“; „werden“ passt nur zu „wir“ und „sie“ im Plural.",
          },
          {
            before: "Die Befragten gaben bei der Polizei an, sie ",
            options: ["könnten", "könne", "kann"],
            answer: 0,
            after:
              " sich an das Kennzeichen des Wagens nicht erinnern, weil alles sehr schnell gegangen sei.",
            feedback:
              "Der Konjunktiv I „sie können“ lautet wie der Indikativ, deshalb steht als Ersatz der Konjunktiv II: sie könnten.",
          },
          {
            before: "Wenn wir den früheren Zug genommen ",
            options: ["hätten", "haben", "hatten"],
            answer: 0,
            after: ", wären wir rechtzeitig zum Konzert gekommen.",
            feedback:
              "Eine unerfüllte Bedingung in der Vergangenheit steht im Konjunktiv II: hätten genommen, wären gekommen.",
          },
          {
            before: "Die Klasse sammelt seit Wochen Altpapier, ",
            options: ["um", "weil", "obwohl"],
            answer: 0,
            after: " eine Klassenfahrt nach Wien zu finanzieren.",
            feedback:
              "Eine Infinitivgruppe mit „zu“, die einen Zweck nennt, wird mit „um“ eingeleitet. Vor „um … zu“ steht ein Komma.",
          },
          {
            before: "Der Torwart verließ den Platz, ",
            options: ["ohne", "weil", "damit"],
            answer: 0,
            after: " sich bei den Fans zu bedanken, und alle sahen ihm erstaunt nach.",
            feedback:
              "Vor einem Infinitiv mit „zu“ passt „ohne“: ohne sich zu bedanken. „weil“ und „damit“ verlangen ein gebeugtes Verb.",
          },
          {
            before: "Vom langen Training ",
            options: ["erschöpft", "erschöpfen", "erschöpfend"],
            answer: 0,
            after: ", schlief die Mannschaft im Bus sofort ein.",
            feedback:
              "Die Partizipgruppe am Satzanfang braucht das Partizip II: Vom langen Training erschöpft. Sie ersetzt einen Nebensatz mit „weil“.",
          },
          {
            before: "Mia wünscht sich, sie ",
            options: ["könnte", "kann", "konnte"],
            answer: 0,
            after: " in den Ferien nach Italien reisen, aber das Geld reicht nicht.",
            feedback:
              "Ein Wunsch, der sich nicht erfüllt, steht im Konjunktiv II: könnte. „kann“ und „konnte“ sind Indikativ.",
          },
          {
            before: "Wenn es morgen heiß und trocken wäre, ",
            options: ["würden", "werden", "wurden"],
            answer: 0,
            after: " wir den Ausflug an den See machen.",
            feedback:
              "Zu einer unwirklichen Bedingung mit „wäre“ gehört im Hauptsatz der Konjunktiv II mit „würden“.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Mias Mutter sagt: „Ich habe heute lange gearbeitet, und ich bin müde.“ Gib die Aussage in indirekter Rede wieder und beginne mit „Mia sagt, ihre Mutter …“. Erkläre in einem Satz, welchen Modus du gewählt hast und warum.",
        hints: [
          "Wandle „ich“ in „sie“ um und bilde die Form des Verbs für die dritte Person Singular im Konjunktiv I.",
          "Prüfe: Unterscheidet sich deine Form von „hat“ und „ist“? Dann brauchst du keine Ersatzform.",
        ],
        model:
          "Mia sagt, ihre Mutter habe heute lange gearbeitet und sei müde. Ich habe den Konjunktiv I gewählt, weil er in der indirekten Rede anzeigt, dass ich nur wiedergebe, was jemand anderes gesagt hat. „habe“ und „sei“ unterscheiden sich vom Indikativ „hat“ und „ist“, deshalb brauche ich keinen Ersatz durch den Konjunktiv II.",
        criteria: [
          "Verwendet den Konjunktiv I für beide Verben („habe“, „sei“).",
          "Wandelt das Pronomen richtig um („ich“ wird „sie“).",
          "Nennt den Konjunktiv I als Grund für die Form.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf Sätze über deine Traumferien. Verwende einen Satz im Konjunktiv II (Wunsch oder Unwirkliches), eine Infinitivgruppe mit „um … zu“ und eine Partizipgruppe. Beginne mindestens zwei Sätze mit verschiedenen Satzgliedern. Benenne die drei Strukturen hinter deinem Text.",
        hints: [
          "Nutze „Wenn ich …, würde ich …“ oder „Ich wünschte, ich …“ für den Konjunktiv II.",
          "Für die Partizipgruppe eignet sich ein Satzanfang wie „Müde von der Reise, …“ oder „Am Strand liegend, …“.",
        ],
        model:
          "Wenn ich unbegrenzt Zeit hätte, würde ich zwei Monate durch Portugal reisen. Zuerst würde ich mir ein Fahrrad leihen, um die Küste zu erkunden. Am Strand liegend, würde ich abends meinen Reisebericht schreiben. Ich wünschte, es wäre schon Sommer. Im Winter plane ich die Route. Die Strukturen: Konjunktiv II („hätte … würde“), Infinitivgruppe („um die Küste zu erkunden“), Partizipgruppe („Am Strand liegend“). Die Sätze beginnen mit verschiedenen Satzgliedern, zum Beispiel „Zuerst“ und „Ich“.",
        criteria: [
          "Enthält einen Satz im Konjunktiv II mit einem Wunsch oder Unwirklichem.",
          "Enthält eine Infinitivgruppe mit „um … zu“ und eine Partizipgruppe.",
          "Benennt die drei Strukturen und variiert die Satzanfänge.",
        ],
      },
    },
  },
  {
    id: "de-saetze-verknuepfen",
    lb: 4,
    unit: "4.2",
    covers: ["4.2.2"],
    title: "Sätze verknüpfen und Schachtelsätze auflösen",
    intro:
      "Mit Konjunktionen, Adverbien und Relativsätzen verbindest du Sätze sinnvoll und löst verschachtelte Sätze lesefreundlich auf.",
    paragraphs: [
      "Vergleiche: „Es regnete. Wir blieben zu Hause.“ und „Weil es regnete, blieben wir zu Hause.“ Der erste Text reiht Aussagen nur aneinander. Der zweite sagt auch, wie sie zusammenhängen: Der Regen ist der Grund. Das leisten **Konjunktionen**. Nebenordnende Konjunktionen („und“, „aber“, „denn“, „oder“, „sondern“) verbinden gleichrangige Sätze, und das Verb bleibt an zweiter Stelle: „Es regnete, aber wir gingen hinaus.“ Unterordnende Konjunktionen leiten einen Nebensatz ein, in dem das Verb am Ende steht: „Obwohl es regnete, gingen wir hinaus.“ Sie drücken verschiedene Beziehungen aus: einen Grund („weil“, „da“), einen Gegensatz oder eine Einräumung („obwohl“: Es geschieht das Gegenteil des Erwarteten), einen Zweck („damit“), eine Bedingung („falls“, „wenn“) oder eine Zeit („als“, „nachdem“, „bevor“).",
      "Auch **Adverbien** wie „deshalb“, „trotzdem“, „außerdem“, „dann“ und „allerdings“ verknüpfen Sätze. Sie sind Teil des Satzes: Steht ein solches Adverb am Satzanfang, folgt das Verb direkt dahinter: „Es regnete in Strömen. Trotzdem gingen wir hinaus.“ Ein **Relativsatz** hängt eine Zusatzinformation an ein Nomen und beginnt mit einem Relativpronomen wie „der“, „die“ oder „das“: Aus „Ich habe eine Jacke. Die Jacke ist wasserdicht.“ wird „Ich habe eine Jacke, die wasserdicht ist.“ So sparst du Wiederholungen und baust zusammenhängende Texte. Achte auf die Beziehung: „deshalb“ verbindet einen Grund mit seiner Folge, „trotzdem“ nennt einen Gegensatz, „außerdem“ eine Ergänzung. Wer das falsche Wort wählt, ändert den Sinn.",
      "Ein **Schachtelsatz** entsteht, wenn mehrere Nebensätze ineinander stecken. Dann liegen Subjekt und Prädikat des Hauptsatzes weit auseinander, und die Lesenden verlieren den Faden: „Die Lehrerin, die uns, nachdem wir das Heft, das wir abgeben sollten, vergessen hatten, ermahnte, war verärgert.“ So löst du ihn auf: Erstens suchst du die Kernaussage des Hauptsatzes („Die Lehrerin war verärgert.“). Zweitens zerlegst du den Rest in einzelne Aussagen, meist eine pro Verb. Drittens ordnest du sie in der Reihenfolge, in der etwas geschah, und verbindest sie mit passenden Wörtern: „Wir hatten das Heft vergessen, das wir abgeben sollten. Deshalb ermahnte uns die Lehrerin. Sie war verärgert.“",
      "Sätze umzuformen heißt auch, die Bauform zu wechseln, damit der Text zur Absicht passt. Aus einem langen Satzgefüge machst du zwei Hauptsätze, oder du verbindest zwei kurze Sätze zu einem. Du kannst den Nebensatz an den Anfang stellen, wenn der Grund zuerst wichtig ist („Weil der Bus ausfiel, kam Mia zu spät.“), oder ans Ende, wenn die Hauptsache zuerst stehen soll („Mia kam zu spät, weil der Bus ausfiel.“). Eine Empfehlung für lesefreundliche Texte lautet: pro Satz ein Hauptgedanke und möglichst höchstens ein oder zwei Nebensätze. Das ist keine feste Regel, sondern eine Faustregel. Prüfe eigene Texte laut: Wo du Luft holen musst oder den Faden verlierst, teilst du den Satz.",
    ],
    terms: [
      {
        term: "Nebenordnende Konjunktion",
        text: "Ein Bindewort wie „und“, „aber“ oder „denn“, das gleichrangige Sätze verbindet; das Verb steht im zweiten Satz an zweiter Stelle.",
      },
      {
        term: "Unterordnende Konjunktion",
        text: "Ein Bindewort wie „weil“, „obwohl“ oder „damit“, das einen Nebensatz einleitet; das Verb steht am Ende des Nebensatzes.",
      },
      {
        term: "Verknüpfendes Adverb",
        text: "Ein Wort wie „deshalb“ oder „trotzdem“, das Sätze inhaltlich verbindet; am Satzanfang folgt das Verb direkt darauf.",
      },
      {
        term: "Relativsatz",
        text: "Ein Nebensatz mit „der“, „die“ oder „das“, der ein Nomen näher beschreibt und Wiederholungen spart.",
      },
      {
        term: "Schachtelsatz",
        text: "Ein langer Satz, in dem mehrere Nebensätze ineinander stecken und die Lesenden den Faden verlieren.",
      },
    ],
    examples: [
      {
        title: "Fünf Sätze werden zwei (eigens verfasst)",
        text: "Vorher: Mia hat ein Fahrrad. Das Fahrrad ist neu. Das Fahrrad steht im Hof. Es regnet. Mia fährt trotzdem zur Schule.\nNachher: Mia hat ein neues Fahrrad, das im Hof steht. Obwohl es regnet, fährt sie damit zur Schule.",
        analysis:
          "In der ersten Fassung stehen fünf kurze Sätze nebeneinander, und das Wort „Fahrrad“ wiederholt sich. In der zweiten steckt die Zusatzinformation „das im Hof steht“ in einem Relativsatz, und „obwohl“ zeigt den Gegensatz zwischen Regen und Radfahren. Der Text wird kürzer, und die Beziehungen werden sichtbar.",
      },
    ],
    takeaway:
      "Konjunktionen, Adverbien und Relativsätze zeigen, wie Sätze zusammenhängen. Wähle sie nach der Beziehung (Grund, Gegensatz, Zweck, Bedingung) und löse Schachtelsätze auf: Kernaussage finden, in einzelne Aussagen zerlegen, sinnvoll neu verbinden.",
    sourceIds: ["lp", "dwds"],
    quiz: {
      question: "Was machst du als Erstes, wenn du einen Schachtelsatz auflösen willst?",
      answer: "Ich suche die Kernaussage des Hauptsatzes und zerlege den Rest dann in einzelne Aussagen.",
      wrong: [
        "Ich streiche alle Nebensätze, damit der Satz kürzer wird, und lasse die Informationen darin weg.",
        "Ich ersetze alle Konjunktionen durch „und“ und lasse den Rest unverändert stehen.",
      ],
      explanation:
        "Erst wenn du weißt, was die Hauptaussage ist, kannst du die übrigen Informationen ordnen. Nebensätze zu streichen verliert Inhalt, und lauter „und“ verwischt, wie die Aussagen zusammenhängen.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Beziehung stellt die Verknüpfung her?",
      instruction:
        "Jeder Satz verbindet zwei Aussagen mit einem Bindewort oder Adverb. Ordne ihn der Beziehung zu, die damit ausgedrückt wird.",
      categories: ["Grund und Folge", "Gegensatz oder Einräumung", "Zweck", "Bedingung"],
      entries: [
        {
          text: "Da der Zug Verspätung hatte, kam Jonas zu spät zum Konzert.",
          target: 0,
          feedback: "„da“ leitet einen Nebensatz ein, der den Grund für das Zuspätkommen nennt.",
        },
        {
          text: "Obwohl er wenig geschlafen hatte, spielte Ben sehr konzentriert.",
          target: 1,
          feedback: "„obwohl“ nennt einen Gegensatz: Nach wenig Schlaf erwartet man das Gegenteil.",
        },
        {
          text: "Lena spart ihr Taschengeld, damit sie sich ein neues Fahrrad kaufen kann.",
          target: 2,
          feedback: "„damit“ nennt das Ziel, das mit dem Sparen erreicht werden soll: einen Zweck.",
        },
        {
          text: "Falls es morgen schneit, fällt der Ausflug aus.",
          target: 3,
          feedback: "„falls“ nennt eine Bedingung, von der es abhängt, ob der Ausflug ausfällt.",
        },
        {
          text: "Das Essen war kalt. Deshalb schickte Lena es zurück.",
          target: 0,
          feedback: "„deshalb“ verbindet die Sätze mit einem Grund: Weil es kalt war, ging es zurück.",
        },
        {
          text: "Ben war erkältet. Trotzdem ging er zum Training.",
          target: 1,
          feedback: "„trotzdem“ zeigt einen Gegensatz: Eine Erkältung hält normalerweise vom Training ab.",
        },
      ],
      conclusion:
        "Konjunktionen und Adverbien drücken Beziehungen wie Grund, Gegensatz, Zweck und Bedingung aus. Wer das passende Wort wählt, macht den Zusammenhang der Sätze sichtbar.",
    },
    casework: {
      title: "Ein Schachtelsatz im Zeitungsbericht",
      story:
        "Für die Schülerzeitung schreibt Mia über das Schuljubiläum: **„Die Rektorin, die in ihrer Rede, nachdem sie die Gäste begrüßt hatte, sagte, dass die Schule, die vor zehn Jahren gegründet wurde, noch immer wachse, bedankte sich bei allen Mitwirkenden.“** Die Redaktion findet den Satz schwer lesbar.",
      steps: [
        {
          question: "Was ist die Hauptaussage des Satzes?",
          options: [
            "Die Rektorin bedankte sich bei allen Mitwirkenden.",
            "Die Schule wurde vor zehn Jahren gegründet und wächst noch immer.",
            "Die Gäste wurden von der Rektorin begrüßt.",
          ],
          answer: 0,
          explanation:
            "Der Hauptsatz lautet: „Die Rektorin bedankte sich bei allen Mitwirkenden.“ Alles andere sind Nebensätze, die ihn unterbrechen.",
        },
        {
          question: "Was macht den Satz schwer lesbar?",
          options: [
            "Mehrere Nebensätze stecken ineinander, und Subjekt und Prädikat liegen weit auseinander.",
            "Er enthält zu viele Adjektive und Adverbien, die jeden Satzteil unnötig ausschmücken und verlängern.",
            "Er steht in einer falschen Zeitform, weil Berichte immer im Präsens stehen müssen.",
          ],
          answer: 0,
          explanation:
            "Zwischen „Die Rektorin“ und „bedankte sich“ stehen mehrere Nebensätze. Die Lesenden müssen sich lange merken, worauf sich das Ende bezieht.",
        },
        {
          question: "Welche Auflösung ist am besten gelungen?",
          options: [
            "Die Rektorin begrüßte die Gäste. In ihrer Rede sagte sie, die Schule wachse noch immer. Gegründet wurde die Schule vor zehn Jahren. Zuletzt dankte sie allen Mitwirkenden.",
            "Die Rektorin, die in ihrer Rede, nachdem sie die Gäste begrüßt hatte, sagte, dass die Schule wächst, bedankte sich bei allen Mitwirkenden und Gästen.",
            "Die Rektorin begrüßte die Gäste, in ihrer Rede wächst die Schule, vor zehn Jahren gegründet, bedankte sich bei allen Mitwirkenden.",
          ],
          answer: 0,
          explanation:
            "Die erste Fassung behält alle Informationen und ordnet sie in der Reihenfolge des Geschehens. Die zweite bleibt verschachtelt und verliert Inhalt, die dritte reiht die Aussagen ohne Zusammenhang.",
        },
        {
          question:
            "Wie verbindet Mia „Die Rektorin begrüßte die Gäste.“ und „Sie bedankte sich bei allen Mitwirkenden.“ sinnvoll zu einem Satz?",
          options: [
            "Nachdem die Rektorin die Gäste begrüßt hatte, bedankte sie sich bei allen Mitwirkenden.",
            "Die Rektorin begrüßte die Gäste, weil sie sich bei allen Mitwirkenden bedankte.",
            "Die Rektorin begrüßte die Gäste, obwohl sie sich bei allen Mitwirkenden bedankte.",
          ],
          answer: 0,
          explanation:
            "Die beiden Handlungen folgen zeitlich aufeinander, deshalb passt „nachdem“. „weil“ und „obwohl“ würden einen Grund oder Gegensatz behaupten, den es nicht gibt.",
        },
      ],
      verdict:
        "Mia findet die Kernaussage, zerlegt den Satz in einzelne Aussagen und verbindet sie in zeitlicher Reihenfolge. Mit der Konjunktion „nachdem“ bleibt der Zusammenhang erhalten, und der Text wird lesefreundlich.",
    },
    practice: {
      kind: "choose",
      title: "Sätze verknüpfen: drei Sätze pro Runde",
      instruction:
        "Wähle in jedem Satz das Wort, das grammatisch und inhaltlich passt. Achte auf die Stellung des Verbs. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "Wir bleiben zu Hause, ",
            options: ["weil", "deshalb", "trotzdem"],
            answer: 0,
            after: " es stark regnet.",
            feedback:
              "„weil“ leitet einen Nebensatz mit dem Verb am Ende ein. „deshalb“ und „trotzdem“ verlangen das Verb an zweiter Stelle.",
          },
          {
            before: "Es regnet stark. ",
            options: ["Deshalb", "Weil", "Obwohl"],
            answer: 0,
            after: " bleiben wir zu Hause.",
            feedback:
              "Das Adverb „deshalb“ nennt die Folge und lässt das Verb an zweiter Stelle. „weil“ und „obwohl“ brauchen das Verb am Ende.",
          },
          {
            before: "Ben war erkältet. ",
            options: ["Trotzdem", "Weil", "Obwohl"],
            answer: 0,
            after: " ging er zum Training.",
            feedback:
              "„trotzdem“ nennt einen Gegensatz und steht vor dem Verb. „weil“ und „obwohl“ leiten Nebensätze ein, in denen das Verb am Ende steht.",
          },
          {
            before: "",
            options: ["Obwohl", "Trotzdem", "Deshalb"],
            answer: 0,
            after: " Ben erkältet war, ging er zum Training.",
            feedback:
              "Ein Nebensatz mit dem Verb am Ende wird mit der Konjunktion „obwohl“ eingeleitet. „trotzdem“ und „deshalb“ sind Adverbien mit dem Verb an zweiter Stelle.",
          },
          {
            before: "Ich habe eine Jacke, ",
            options: ["die", "der", "das"],
            answer: 0,
            after: " wasserdicht ist.",
            feedback:
              "Das Relativpronomen richtet sich nach dem Bezugswort: „die Jacke“ ist weiblich, also „die“.",
          },
          {
            before: "Das ist der Bus, ",
            options: ["mit dem", "mit der", "mit den"],
            answer: 0,
            after: " ich jeden Morgen fahre.",
            feedback:
              "Das Relativpronomen richtet sich nach dem Bezugswort: „der Bus“ ist männlich, nach „mit“ steht der Dativ, also „mit dem“.",
          },
          {
            before: "",
            options: ["Als", "Wenn", "Weil"],
            answer: 0,
            after: " ich gestern nach Hause kam, brannte im Flur schon das Licht.",
            feedback:
              "Für ein einmaliges Ereignis in der Vergangenheit steht „als“. „wenn“ gilt für Wiederholtes oder Zukünftiges, und „weil“ nennt einen Grund.",
          },
          {
            before: "Ich wollte zum Training kommen, ",
            options: ["aber", "damit", "dass"],
            answer: 0,
            after: " ich war krank.",
            feedback:
              "Die nebenordnende Konjunktion „aber“ lässt das Verb im zweiten Satz an zweiter Stelle. „damit“ und „dass“ verlangen das Verb am Ende.",
          },
        ],
        2: [
          {
            before: "Der Verein sucht dringend Unterstützung für das Sommerfest, ",
            options: ["weil", "deshalb", "trotzdem"],
            answer: 0,
            after: " viele Mitglieder im Urlaub sind und nur wenige Zeit haben.",
            feedback:
              "„weil“ leitet einen Nebensatz mit dem Verb am Ende ein und nennt den Grund. „deshalb“ und „trotzdem“ verlangen das Verb an zweiter Stelle.",
          },
          {
            before: "Der Bus fiel aus, und das Taxi kam erst nach einer halben Stunde. ",
            options: ["Deshalb", "Weil", "Obwohl"],
            answer: 0,
            after: " erreichten wir den Zug nicht mehr rechtzeitig.",
            feedback:
              "Das Adverb „deshalb“ nennt die Folge der beiden Verzögerungen und lässt das Verb an zweiter Stelle. „weil“ und „obwohl“ leiten Nebensätze ein, in denen das Verb am Ende steht.",
          },
          {
            before: "Lena hatte kaum geschlafen und musste früh zur Prüfung. ",
            options: ["Trotzdem", "Weil", "Obwohl"],
            answer: 0,
            after: " schrieb sie am Ende eine sehr gute Arbeit.",
            feedback:
              "„trotzdem“ nennt einen Gegensatz und lässt das Verb an zweiter Stelle. „weil“ und „obwohl“ leiten Nebensätze mit dem Verb am Ende ein.",
          },
          {
            before: "",
            options: ["Obwohl", "Deshalb", "Trotzdem"],
            answer: 0,
            after: " die Mannschaft nach der Halbzeit zurücklag, gab sie das Spiel nicht auf und drehte es noch.",
            feedback:
              "Der Nebensatz mit dem Verb am Ende wird mit „obwohl“ eingeleitet und nennt einen Gegensatz. „deshalb“ und „trotzdem“ stehen vor dem Verb.",
          },
          {
            before: "Die Lehrerin, ",
            options: ["der", "die", "den"],
            answer: 0,
            after: " wir das Geschenk überreichten, bedankte sich herzlich.",
            feedback:
              "Das Relativpronomen richtet sich nach Geschlecht und Fall: „überreichen“ verlangt den Dativ, und „die Lehrerin“ ist weiblich, also „der“.",
          },
          {
            before: "Der Mitschüler, ",
            options: ["dessen", "deren", "dem"],
            answer: 0,
            after: " Fahrrad gestohlen wurde, meldete den Diebstahl bei der Polizei.",
            feedback:
              "Zeigt das Relativpronomen einen Besitz an, steht der Genitiv: „der Mitschüler“ ist männlich, also „dessen“.",
          },
          {
            before: "",
            options: ["Wenn", "Als", "Nachdem"],
            answer: 0,
            after: " ich in der Pause Hunger habe, kaufe ich mir meistens ein belegtes Brötchen beim Bäcker.",
            feedback:
              "Für regelmäßig Wiederkehrendes im Präsens steht „wenn“. „als“ gilt für einmalige Ereignisse der Vergangenheit.",
          },
          {
            before: "Die Gruppe wollte den Gipfel noch vor dem Gewitter erreichen, ",
            options: ["aber", "damit", "dass"],
            answer: 0,
            after: " der Aufstieg dauerte länger als geplant.",
            feedback:
              "Die nebenordnende Konjunktion „aber“ verbindet zwei Hauptsätze und lässt das Verb im zweiten an zweiter Stelle. „damit“ und „dass“ verlangen das Verb am Ende.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Verbinde die folgenden kurzen Sätze zu zwei lesefreundlichen Sätzen und nutze mindestens einen Relativsatz und eine passende Konjunktion oder ein Adverb: „Lena hat einen Hund. Der Hund ist sehr verspielt. Sie geht jeden Tag mit ihm raus. Es regnet manchmal. Sie bleibt nicht zu Hause.“",
        hints: [
          "Suche Sätze, die über dasselbe Nomen etwas sagen. Daraus kannst du einen Relativsatz machen.",
          "Frage dich bei den übrigen Sätzen: Ist die Beziehung ein Grund, ein Gegensatz oder eine Bedingung? Wähle dann das passende Wort.",
        ],
        model:
          "Lena hat einen Hund, der sehr verspielt ist, und sie geht jeden Tag mit ihm raus. Obwohl es manchmal regnet, bleibt sie nicht zu Hause. Ich habe „der Hund“ durch den Relativsatz „der sehr verspielt ist“ ersetzt, damit sich das Wort nicht wiederholt. „obwohl“ zeigt den Gegensatz zwischen dem Regen und dem Spaziergang.",
        criteria: [
          "Verbindet die Sätze zu genau zwei Sätzen.",
          "Verwendet einen Relativsatz und eine passende Konjunktion oder ein Adverb.",
          "Die gewählte Verknüpfung entspricht der Beziehung der Aussagen.",
        ],
      },
      2: {
        prompt:
          "Löse diesen Schachtelsatz in drei oder vier kurze Sätze auf und achte darauf, dass keine Information verloren geht: „Lena erzählt, dass ihr Bruder, der in einer Bäckerei, die gleich neben dem Bahnhof liegt, eine Ausbildung macht, jeden Morgen um vier Uhr aufstehen muss, weil die Brötchen, die er backt, schon um sechs verkauft werden.“",
        hints: [
          "Finde zuerst die Kernaussage des Hauptsatzes: Was muss Lenas Bruder tun?",
          "Mache aus jedem Relativsatz und aus dem „weil“-Satz einen eigenen Satz oder baue ihn klar an einen kurzen Satz an.",
        ],
        model:
          "Lena erzählt von ihrem Bruder. Er macht eine Ausbildung in einer Bäckerei gleich neben dem Bahnhof. Dort backt er Brötchen, die schon um sechs verkauft werden. Deshalb muss er jeden Morgen um vier Uhr aufstehen.",
        criteria: [
          "Zerlegt den Satz in drei bis vier verständliche Sätze.",
          "Behält alle Informationen bei.",
          "Verbindet die Sätze mit passenden Wörtern wie „deshalb“ oder einem Relativsatz.",
        ],
      },
    },
  },
  {
    id: "de-satzstrukturen-wirkung",
    lb: 4,
    unit: "4.2",
    covers: ["4.2.3"],
    title: "Satzstrukturen unterscheiden und ihre Wirkung beschreiben",
    intro:
      "Ellipse, Satzreihe und Satzgefüge wirken sehr verschieden. Du erkennst sie im Text und setzt sie in eigenen Texten gezielt ein.",
    paragraphs: [
      "Vergleiche zwei Fassungen: „Ein Knall. Dann Stille.“ und „Nachdem es geknallt hatte, wurde es still.“ Beide Texte erzählen dasselbe, aber sie klingen verschieden. Das liegt am Satzbau. Ein **einfacher Satz** ist vollständig und hat nur ein gebeugtes Verb, aber keinen Nebensatz und keine Infinitivgruppe: „Der Bus kam pünktlich.“ Daneben gibt es drei Strukturen, die du unterscheiden und in ihrer Wirkung beschreiben sollst: die Ellipse, die Satzreihe und das Satzgefüge. Wer sie erkennt, kann einen Text genauer lesen und eigene Sätze mit Absicht bauen.",
      "Eine **Ellipse** ist ein unvollständiger, aber verständlicher Satz: Etwas fehlt, meist das Verb, und die Lesenden ergänzen es aus dem Zusammenhang. „Dann Stille.“ ist so ein Satz. Die Wirkung: Ellipsen sind knapp, setzen einen Gedanken scharf ab und können Spannung oder Nachdruck erzeugen. Du findest sie in Schlagzeilen („Neues Schulfest im Juni!“), in Werbung, in Dialogen und in spannenden Erzählungen. In sachlichen Texten und in Bewerbungen setzt du sie sparsam ein, weil sie dort unvollständig oder nachlässig wirken können.",
      "Eine **Satzreihe** verbindet gleichrangige Hauptsätze, durch Kommas oder durch Wörter wie „aber“: „Ich stand auf, ich zog mich an, ich rannte los.“ Jeder Teil könnte allein stehen. Die Wirkung: Satzreihen wirken meist schnell und lebendig, weil die Ereignisse knapp aufeinanderfolgen. Sie reihen Gedanken ohne Rangordnung. Zu viele davon hintereinander wirken aber abgehackt und eintönig.",
      "Ein **Satzgefüge** besteht aus einem Hauptsatz und mindestens einem Nebensatz: „Als es dunkel wurde, rannte ich nach Hause, weil ich Angst hatte.“ Der Nebensatz sagt, wann, warum oder unter welcher Bedingung etwas geschieht. Er kann auch eine Infinitivgruppe sein: „Ich rannte nach Hause, um nicht allein zu sein.“ Die Wirkung: Satzgefüge wirken meist ruhiger und genauer, weil sie Zusammenhänge wie Grund und Gegensatz ausdrücken. Sie passen zu Erklärungen und Argumenten. In eigenen Texten nutzt du die Strukturen gezielt: Satzreihe und Ellipse für Tempo und Spannung, Satzgefüge für Begründungen und genaue Zusammenhänge, dazwischen einfache Sätze zum Durchatmen.",
    ],
    terms: [
      {
        term: "Einfacher Satz",
        text: "Ein vollständiger Satz mit nur einem gebeugten Verb und ohne Nebensatz, zum Beispiel „Der Bus kam pünktlich.“",
      },
      {
        term: "Ellipse",
        text: "Ein unvollständiger, aber verständlicher Satz, in dem etwas fehlt, zum Beispiel „Dann Stille.“",
      },
      {
        term: "Satzreihe",
        text: "Die Verbindung gleichrangiger Hauptsätze durch Komma oder Wörter wie „aber“.",
      },
      {
        term: "Satzgefüge",
        text: "Ein Satz aus Hauptsatz und mindestens einem Nebensatz, der nicht allein stehen kann; auch eine Infinitivgruppe zählt als Nebensatz.",
      },
      {
        term: "Nebensatz",
        text: "Ein Teilsatz, der von einem Hauptsatz abhängt und meist mit einer Konjunktion wie „weil“ oder „als“ beginnt.",
      },
    ],
    examples: [
      {
        title: "Spannung oder Erklärung? (eigens verfasst)",
        text: "Text A: Die Tür knarrte. Schritte. Ein Schatten, dann Dunkelheit.\nText B: Weil die Tür knarrte, wusste ich, dass jemand im Haus war.",
        analysis:
          "Text A besteht aus einem einfachen Satz und zwei Ellipsen. Er wirkt knapp und angespannt, weil das Verb fehlt und die Eindrücke hart aufeinanderfolgen. Text B ist ein Satzgefüge. Er erklärt, warum die Person etwas bemerkt, und wirkt dadurch ruhiger und genauer.",
      },
    ],
    takeaway:
      "Ellipse, Satzreihe und Satzgefüge haben unterschiedliche Wirkungen: Die Ellipse wirkt meist knapp und spannend, die Satzreihe schnell und lebendig, das Satzgefüge ruhig und genau. Wähle die Struktur nach deiner Absicht.",
    sourceIds: ["lp", "dwds", "regelwerk"],
    quiz: {
      question: "Welche Wirkung hat eine Folge kurzer Hauptsätze in einer Erzählung meist?",
      answer: "Sie wirkt schnell und lebendig, weil die Ereignisse knapp aufeinanderfolgen.",
      wrong: [
        "Sie wirkt ruhig und nachdenklich, weil Gründe und Folgen genau erklärt werden.",
        "Sie wirkt sachlich und distanziert, weil jede Aussage ausführlich begründet wird.",
      ],
      explanation:
        "Kurze Hauptsätze reihen Ereignisse aneinander und erzeugen Tempo. Gründe und Folgen genau zu erklären ist dagegen die Stärke des Satzgefüges mit seinen Nebensätzen.",
    },
    workshop: {
      kind: "mark",
      title: "Satzstrukturen im Text finden",
      instruction:
        "Wähle oben eine Satzstruktur und klicke dann im Text die Sätze an, die sie zeigen. Vollständige Sätze mit nur einem Verb sind einfache Sätze und bleiben unmarkiert.",
      labels: ["Ellipse", "Satzreihe", "Satzgefüge"],
      text: [
        { t: "Der Wecker klingelte um sechs. " },
        {
          t: "Müde und genervt. ",
          label: 0,
          feedback: "Subjekt und Verb fehlen, aber der Sinn bleibt klar („Ich war müde und genervt.“). Das ist eine Ellipse.",
        },
        {
          t: "Ich stand auf, ich putzte mir die Zähne, ich zog mich an. ",
          label: 1,
          feedback: "Drei vollständige Hauptsätze stehen nebeneinander, jeder könnte allein stehen. Das ist eine Satzreihe.",
        },
        { t: "Draußen war es dunkel. " },
        {
          t: "Als ich aus dem Haus trat, regnete es in Strömen. ",
          label: 2,
          feedback: "Der Nebensatz mit „als“ hängt vom Hauptsatz ab und nennt die Zeit. Das ist ein Satzgefüge.",
        },
        {
          t: "Der Bus? Schon weg. ",
          label: 0,
          feedback: "Beide Sätze haben kein Verb und sind trotzdem verständlich. Das sind Ellipsen.",
        },
        {
          t: "Ich rannte los, aber der Bus bog schon um die Ecke. ",
          label: 1,
          feedback: "Zwei Hauptsätze sind mit „aber“ verbunden, und beide wären allein vollständig. Das ist eine Satzreihe.",
        },
        { t: "Die Straße glänzte nass. " },
        {
          t: "Ich wartete, bis der nächste Bus kam. ",
          label: 2,
          feedback: "Der „bis“-Satz ist ein Nebensatz, der vom Hauptsatz abhängt. Das ist ein Satzgefüge.",
        },
        { t: "Ich sah auf die Uhr. " },
        {
          t: "Schon wieder zu spät!",
          label: 0,
          feedback: "Das Verb fehlt, der Sinn ist klar („Ich bin schon wieder zu spät.“). Das ist eine Ellipse.",
        },
      ],
      conclusion:
        "Ellipsen sind unvollständig und knapp, Satzreihen reihen Hauptsätze, Satzgefüge enthalten Nebensätze. Die einfachen Sätze dazwischen geben dem Text Ruhe.",
    },
    casework: {
      title: "Ein Bericht über die Feuerwehrübung",
      story:
        "Die Schülerzeitung berichtet über eine Übung: **„Feuer in der Turnhalle! Die Sirenen heulten, die Lehrkräfte rannten, die Kinder drängten ins Freie. Weil alle den Notausgang kannten, wurde niemand verletzt.“**",
      steps: [
        {
          question: "Welche Struktur hat die Überschrift „Feuer in der Turnhalle!“?",
          options: [
            "Eine Ellipse: Das Verb fehlt („Es brennt …“), der Sinn bleibt klar.",
            "Eine Satzreihe: Mehrere Hauptsätze stehen gleichrangig nebeneinander",
            "Ein Satzgefüge: Ein Hauptsatz wird durch einen Nebensatz ergänzt",
          ],
          answer: 0,
          explanation:
            "Die Überschrift hat kein Verb und ist trotzdem verständlich, denn man ergänzt „Es brennt in der Turnhalle!“. Das ist eine Ellipse, wie man sie oft in Schlagzeilen findet.",
        },
        {
          question: "Welche Struktur hat der zweite Satz („Die Sirenen heulten, die Lehrkräfte rannten, …“)?",
          options: [
            "Eine Satzreihe: mehrere Hauptsätze nebeneinander",
            "Ein Satzgefüge: Er enthält auch Nebensätze",
            "Eine Ellipse: Er ist unvollständig, aber klar",
          ],
          answer: 0,
          explanation:
            "Jeder Teil hat ein eigenes Subjekt und ein eigenes Verb und könnte allein stehen. Nebensätze gibt es nicht.",
        },
        {
          question: "Welche Wirkung hat die Reihung kurzer Hauptsätze hier?",
          options: [
            "Sie wirkt schnell und hektisch und lässt das Durcheinander spüren.",
            "Sie wirkt ruhig und gelassen und erklärt genau, warum alles geschieht.",
            "Sie wirkt wie eine sachliche Begründung mit Gründen und Folgen.",
          ],
          answer: 0,
          explanation:
            "Die Ereignisse folgen knapp aufeinander, so entsteht Tempo. Gründe werden dabei nicht erklärt.",
        },
        {
          question: "Warum steht am Schluss ein Satzgefüge („Weil alle den Notausgang kannten, wurde niemand verletzt.“)?",
          options: [
            "Der Nebensatz nennt den Grund für den guten Ausgang und beruhigt den Text.",
            "Das Satzgefüge erzeugt noch mehr Spannung und Tempo als die Reihung davor.",
            "Satzgefüge dürfen in einem Bericht nur ganz am Ende stehen, nie am Anfang.",
          ],
          answer: 0,
          explanation:
            "Der „weil“-Satz erklärt, warum nichts Schlimmes geschah. Er ordnet das Geschehen und wirkt ruhiger als die Reihung davor.",
        },
      ],
      verdict:
        "Die Ellipse lenkt die Aufmerksamkeit auf die Überschrift, die Satzreihe lässt die Hektik spüren, und das Satzgefüge nennt am Schluss den Grund. Der Wechsel der Strukturen steuert die Wirkung.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe drei Sätze über deinen Schulweg: eine Satzreihe, ein Satzgefüge und eine Ellipse. Schreibe hinter jeden Satz in Klammern, welche Struktur er zeigt, und erkläre in einem Satz die Wirkung.",
        hints: [
          "Für die Satzreihe brauchst du mindestens zwei vollständige Hauptsätze, die du mit Komma oder „aber“ verbindest.",
          "Für das Satzgefüge eignet sich ein Nebensatz mit „weil“, „als“ oder „obwohl“. Für die Ellipse lässt du das Verb weg.",
        ],
        model:
          "Ich hole meinen Rucksack, ich laufe zur Haltestelle, ich steige in den Bus. (Satzreihe) Weil ich morgens meistens müde bin, höre ich im Bus Musik. (Satzgefüge) Endlich Schule. (Ellipse) Die Satzreihe lässt den Morgen schnell ablaufen, das Satzgefüge gibt einen Grund an, und die Ellipse setzt einen knappen Schlusspunkt.",
        criteria: [
          "Enthält eine Satzreihe mit mindestens zwei Hauptsätzen.",
          "Enthält ein Satzgefüge mit einem Nebensatz.",
          "Enthält eine Ellipse, benennt alle drei Strukturen und beschreibt eine Wirkung.",
        ],
      },
      2: {
        prompt:
          "Schreibe dieselbe Szene („Du findest im Briefkasten einen Brief ohne Absender“) in zwei Fassungen zu je drei bis vier Sätzen: Fassung A soll Spannung erzeugen (Satzreihe, Ellipse), Fassung B soll ruhig und genau erklären (Satzgefüge). Beschreibe in zwei Sätzen, wie sich die Wirkung unterscheidet.",
        hints: [
          "Für Fassung A: kurze Hauptsätze, ein Satz ohne Verb, keine Erklärungen.",
          "Für Fassung B: Gründe, Zeitangaben und Gegensätze mit Nebensätzen („weil“, „nachdem“, „obwohl“).",
        ],
        model:
          "Fassung A: Ein Brief. Kein Absender. Ich drehe ihn um, ich zögere, mein Herz klopft. Fassung B: Als ich im Briefkasten einen Brief ohne Absender fand, wunderte ich mich, weil ich keine Post erwartet hatte. Ich öffnete ihn erst, nachdem ich mich an den Tisch gesetzt hatte. Obwohl ich neugierig war, las ich ihn langsam und genau. Fassung A wirkt schnell und angespannt, weil die Sätze kurz sind und teilweise Verben fehlen. Fassung B wirkt ruhiger und genauer, weil die Nebensätze Gründe, Zeitfolge und Gegensätze nennen.",
        criteria: [
          "Fassung A enthält eine Satzreihe und eine Ellipse.",
          "Fassung B enthält mindestens zwei Satzgefüge mit passenden Konjunktionen.",
          "Die Wirkung beider Fassungen wird mit Bezug auf den Satzbau beschrieben.",
        ],
      },
    },
  },
];
