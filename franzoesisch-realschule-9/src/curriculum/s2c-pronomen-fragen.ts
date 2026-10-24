import type { Lesson } from "../model/types";

/**
 * Stufe 2, dritter Teil: Grammatik, sich auf Genanntes beziehen und miteinander sprechen
 * (Kompetenzerwartungen 1.2.2.2 und 1.2.2.3): die Pronomen y und en, die Frage mit Inversion,
 * die indirekte Rede und Frage sowie der Imperativ mit Pronomen.
 */
export const S2C: Lesson[] = [
  {
    id: "fr-pronom-y",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.2"],
    title: "Das Pronomen y",
    intro:
      "Mit y ersetzt du Orte und Sachen mit à, dans oder en. Es steht vor dem Verb und spart eine Wiederholung.",
    paragraphs: [
      "Das Pronomen **y** ersetzt eine Ortsangabe oder eine Sache, die mit einer Präposition wie à, dans, sur oder en angeschlossen ist: « Tu vas à Paris? – Oui, j’y vais. », « Il habite en France? – Oui, il y habite. », « Elle pense à son examen. – Elle y pense. » Du vermeidest damit, dasselbe Wort noch einmal zu sagen. Auf Deutsch entspricht y oft „dorthin“, „dort“ oder „daran“.",
      "Y steht vor dem konjugierten Verb: « J’y vais. », « Nous y habitons. » Vor einem Vokal oder stummen h wird je zu j’. In der Verneinung umschließt ne … pas das Pronomen und das Verb: « Je n’y vais pas. » Im passé composé steht y vor dem Hilfsverb: « J’y suis allé hier. » Mit einem Infinitiv steht y direkt vor dem Infinitiv: « Je vais y aller. », « Il veut y rester. »",
      "Y ersetzt nur Orte und Sachen, nicht Personen. Bei à + Person nimmst du ein Pronomen für Personen, also lui oder leur: « Je parle à Marie. – Je lui parle. » Das feste « il y a » (es gibt) enthält y ebenfalls, ändert sich aber nie.",
      "Typische Fehler sind « Je vais y. » (das Pronomen steht vor dem Verb), « Je y vais » (vor einem Vokal heißt es j’y) und « J’y ai allé » (aller bildet das passé composé mit être: J’y suis allé).",
    ],
    terms: [
      { term: "das Pronomen y", text: "Pronomen für Orte und Sachen mit à, dans, sur oder en. Es steht vor dem konjugierten Verb oder vor dem Infinitiv." },
      { term: "Pronom adverbial", text: "Ein Pronomen wie y oder en, das eine Ergänzung mit einer Präposition ersetzt und so Wiederholungen vermeidet." },
      { term: "Stellung vor dem Verb", text: "Y steht in der Regel direkt vor dem Verb. Im passé composé steht es vor dem Hilfsverb, in der Verneinung zwischen ne und dem Verb." },
    ],
    takeaway:
      "Y ersetzt Orte und Sachen mit à, dans, sur oder en und steht vor dem Verb. Bei Personen nimmst du lui oder leur. Mit Infinitiv: y vor dem Infinitiv. Im passé composé: y vor dem Hilfsverb.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie ersetzt du « Tu vas au cinéma? – Oui, je vais au cinéma. »?",
      answer: "Oui, j’y vais.",
      wrong: ["Oui, je le vais.", "Oui, je vais y."],
      explanation:
        "Au cinéma ist eine Ortsangabe mit à (à + le), also ersetzt y sie. Das Pronomen steht vor dem Verb: j’y vais. Le würde ein direktes Objekt ersetzen.",
    },
    workshop: {
      kind: "choose",
      title: "Mit y Wiederholungen vermeiden",
      instruction:
        "Prüfe, ob eine Ortsangabe oder eine Sache mit à ersetzt wird. Dann achte auf die Stellung vor dem Verb.",
      items: [
        { before: "Tu vas à Lyon? – Oui, j’", options: ["y", "en", "le"], answer: 0, after: " vais ce week-end.", feedback: "À Lyon ist eine Ortsangabe mit à. Dafür steht das Pronomen y, vor einem Vokal heißt es j’y." },
        { before: "Il pense à son examen. Il ", options: ["y", "lui", "en"], answer: 0, after: " pense tout le temps.", feedback: "À son examen ist eine Sache mit à, also y. Lui würde für eine Person stehen." },
        { before: "Nous allons ", options: ["y aller", "aller y", "y allons"], answer: 0, after: " demain.", feedback: "Mit einem Infinitiv steht y direkt vor dem Infinitiv: nous allons y aller." },
        { before: "Elle est allée à la piscine? – Oui, elle ", options: ["y est allée", "est y allée", "a y allé"], answer: 0, after: " hier.", feedback: "Im passé composé steht y vor dem Hilfsverb: elle y est allée. Aller bildet das passé composé mit être." },
        { before: "Je n’", options: ["y", "en", "le"], answer: 0, after: " vais pas aujourd’hui.", feedback: "In der Verneinung steht y zwischen ne und dem Verb: je n’y vais pas." },
      ],
      conclusion: "Y ersetzt Orte und Sachen und steht vor dem Verb, vor dem Infinitiv oder vor dem Hilfsverb.",
    },
    casework: {
      title: "Ein Gespräch vor dem Training",
      story:
        "Zwei Freundinnen sprechen vor dem Sport: « Tu vas à la piscine ce soir? – Oui, j’y vais avec Léa. – Moi, je n’y vais pas. J’ai un test et j’y pense depuis deux jours. »",
      steps: [
        {
          question: "Was ersetzt y in « j’y vais »?",
          options: ["à la piscine", "avec Léa ce soir", "ce soir"],
          answer: 0,
          explanation: "Y ersetzt den Ort mit à: à la piscine. Avec Léa und ce soir sind andere Angaben.",
        },
        {
          question: "Warum steht « je n’y vais pas » in dieser Reihenfolge?",
          options: ["Ne und pas umschließen y und das Verb.", "Y steht in der Verneinung hinter pas.", "Das Verb muss vor y stehen."],
          answer: 0,
          explanation: "In der Verneinung umschließen ne und pas das Pronomen und das Verb: je n’y vais pas.",
        },
        {
          question: "Was ersetzt y in « j’y pense depuis deux jours »?",
          options: ["à son test", "depuis deux jours", "Moi"],
          answer: 0,
          explanation: "Penser à + Sache wird durch y ersetzt: j’y pense meint, dass sie an den Test denkt.",
        },
      ],
      verdict:
        "Das Gespräch zeigt y für einen Ort und für eine Sache. In beiden Fällen steht es vor dem Verb, in der Verneinung zwischen ne und dem Verb.",
    },
    tasks: {
      1: {
        prompt:
          "Ersetze die markierten Teile durch y: 1. Tu vas à la bibliothèque? Oui, je vais à la bibliothèque. 2. Il pense à ses vacances. 3. Nous sommes allés au parc hier.",
        hints: [
          "Suche die Ortsangabe oder die Sache mit à im Satz.",
          "Setze y vor das Verb und vor das Hilfsverb im passé composé.",
        ],
        model:
          "1. Oui, j’y vais. 2. Il y pense. 3. Nous y sommes allés hier. In Satz 1 steht y vor vais und wird mit j’ verbunden. In Satz 3 steht y vor dem Hilfsverb sommes. In allen drei Sätzen ist keine Person ersetzt.",
        criteria: [
          "Y steht vor dem Verb oder vor dem Hilfsverb.",
          "Die Ortsangabe oder Sache mit à ist weggelassen.",
          "Bei vokalischem Beginn steht j’y statt je y.",
        ],
      },
      2: {
        prompt:
          "Schreibe ein kurzes Gespräch (vier bis fünf Zeilen) über einen Ort, an den du gern gehst, und einen Plan fürs Wochenende. Verwende y mindestens dreimal, auch mit Infinitiv und in der Verneinung.",
        hints: [
          "Beginne mit « Tu vas au … ce week-end? ».",
          "Für den Infinitiv: « Je vais y aller. », für die Verneinung: « Je n’y vais pas. ».",
        ],
        model:
          "– Tu vas au parc ce week-end? – Oui, j’y vais samedi avec mon frère. – Moi, je n’y vais pas, mais je vais y aller dimanche. – Tu y vas souvent? – Oui, nous y jouons au foot presque tous les week-ends.",
        criteria: [
          "Y wird mindestens dreimal richtig verwendet.",
          "Eine Verneinung und ein Infinitiv mit y kommen vor.",
          "Das Gespräch ist verständlich und bleibt beim Thema.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Das Pronomen y: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Tu vas au parc? – Oui, j’", options: ["y", "en"], answer: 0, after: " vais.", feedback: "Au parc ist eine Ortsangabe mit à, also y." },
          { before: "Il habite à Berlin. Il ", options: ["y", "le"], answer: 0, after: " habite depuis deux ans.", feedback: "À Berlin ist eine Ortsangabe, also y." },
          { before: "Nous allons ", options: ["y aller", "aller y"], answer: 0, after: " demain.", feedback: "Mit einem Infinitiv steht y direkt davor." },
          { before: "Je n’", options: ["y vais", "vais y"], answer: 0, after: " pas ce soir.", feedback: "In der Verneinung steht y zwischen ne und dem Verb: je n’y vais pas." },
          { before: "Elle ", options: ["y pense", "lui pense"], answer: 0, after: " souvent, à son voyage.", feedback: "À son voyage ist eine Sache, also y." },
          { before: "Tu es allé à la mer? – Oui, j’", options: ["y suis allé", "ai y allé"], answer: 0, after: " en juillet.", feedback: "Im passé composé steht y vor dem Hilfsverb." },
          { before: "Vous restez à la maison? – Oui, nous ", options: ["y restons", "restons y"], answer: 0, after: " ce soir.", feedback: "Das Pronomen y steht vor dem Verb." },
          { before: "Il veut ", options: ["y rester", "rester y"], answer: 0, after: " un jour de plus.", feedback: "Mit einem Infinitiv steht y direkt davor." },
        ],
        2: [
          { before: "Mon frère habite à Munich depuis deux ans et il ", options: ["y travaille", "lui travaille", "travaille y"], answer: 0, after: " aussi dans une grande entreprise de logiciels.", feedback: "À Munich ist eine Ortsangabe, also y, und das Pronomen steht vor dem Verb." },
          { before: "Tu connais ce café près de la gare? Moi, je ", options: ["n’y vais jamais", "ne vais jamais y", "n’y jamais vais"], answer: 0, after: ", parce qu’il est toujours trop plein à midi.", feedback: "In der Verneinung steht y zwischen ne und dem Verb: je n’y vais jamais." },
          { before: "Nous voulons passer l’été à la montagne et nous ", options: ["allons y rester", "y allons rester", "allons rester y"], answer: 0, after: " deux semaines avec nos cousins.", feedback: "Mit zwei Verben steht y direkt vor dem Infinitiv: nous allons y rester." },
          { before: "Hier, mes amis sont allés à la patinoire et ils ", options: ["y sont restés", "sont restés y", "ont y resté"], answer: 0, after: " jusqu’à la fermeture.", feedback: "Im passé composé steht y vor dem Hilfsverb. Rester bildet das passé composé mit être." },
          { before: "Léa pense à son prochain voyage et elle ", options: ["y pense", "lui pense", "pense y"], answer: 0, after: " tous les soirs avant de dormir.", feedback: "À son prochain voyage ist eine Sache, also y. Lui würde eine Person ersetzen." },
          { before: "Vous êtes déjà allés à Strasbourg? – Oui, nous ", options: ["y sommes allés", "sommes allés y", "avons y allé"], answer: 0, after: " pour le marché de Noël.", feedback: "Im passé composé steht y vor dem Hilfsverb sommes." },
          { before: "Mon père n’aime pas les musées, donc il ", options: ["n’y entre jamais", "ne entre y jamais", "y n’entre jamais"], answer: 0, after: " et reste dans la voiture.", feedback: "In der Verneinung steht y zwischen ne und dem Verb." },
          { before: "Je dois aller à la poste avant midi. Tu peux ", options: ["y passer", "passer y", "lui passer"], answer: 0, after: " avec moi si tu as le temps?", feedback: "Mit dem Infinitiv steht y direkt davor: y passer." },
        ],
      },
    },
  },
  {
    id: "fr-pronom-en",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.2"],
    title: "Das Pronomen en",
    intro:
      "Mit en ersetzt du Mengen und Dinge mit de. Zahlen und Mengenangaben bleiben dabei im Satz stehen.",
    paragraphs: [
      "Das Pronomen **en** ersetzt ein Nomen mit de, mit dem Teilungsartikel (du, de la, des) oder mit einer Mengenangabe: « Tu veux du pain? – Oui, j’en veux. », « Tu as des frères? – Oui, j’en ai deux. », « Il y a beaucoup de touristes. – Il y en a beaucoup. » Außerdem ersetzt en einen Ort mit de, wenn du daher kommst: « Tu viens de Paris? – Oui, j’en viens. »",
      "Wie y steht en vor dem konjugierten Verb, vor dem Infinitiv oder vor dem Hilfsverb: « J’en veux. », « Je vais en prendre. », « J’en ai mangé. » In der Verneinung umschließen ne und pas das Pronomen und das Verb: « Je n’en veux pas. » Eine Zahl oder Mengenangabe bleibt hinter dem Verb stehen: « J’en ai trois. », « J’en ai pris beaucoup. »",
      "Un und une bleiben bei en als Zahl im Satz stehen: « Tu as une sœur? – Oui, j’en ai une. » Das Pronomen en ersetzt hier das Nomen sœur, und die Anzahl bleibt als Mengenangabe stehen. Das Partizip nach en bleibt unverändert, auch bei einem weiblichen oder pluralischen Bezugswort.",
      "Typische Fehler sind « J’en ai deux frères » (das Nomen entfällt, richtig ist j’en ai deux), « J’en veux pas » (richtig ist je n’en veux pas) und « J’ai en deux » (das Pronomen steht vor dem Verb).",
    ],
    terms: [
      { term: "en", text: "Pronomen für ein Nomen mit de, mit Teilungsartikel oder Mengenangabe. Auch für den Ort, von dem man kommt: j’en viens." },
      { term: "Mengenangabe", text: "Zahl oder Menge wie un, deux, beaucoup, assez oder trop. Sie bleibt im Satz stehen, wenn das Nomen durch en ersetzt wird." },
      { term: "Teilungsartikel", text: "Die Formen du, de la, de l’ und des für eine nicht abzählbare Menge. En ersetzt das Nomen samt dem Artikel." },
    ],
    takeaway:
      "En ersetzt Nomen mit de, mit Teilungsartikel oder Menge und steht vor dem Verb. Zahlen und Mengenangaben bleiben stehen: j’en ai deux. In der Verneinung: je n’en veux pas.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "J’en ai deux.",
      wrong: ["J’ai deux en.", "J’en ai deux frères."],
      explanation:
        "En ersetzt das Nomen, die Zahl deux bleibt nach dem Verb stehen. Das Pronomen steht vor dem Verb. Das Nomen frères darf nicht noch einmal genannt werden.",
    },
    workshop: {
      kind: "choose",
      title: "Mit en Wiederholungen vermeiden",
      instruction:
        "Prüfe, ob ein Nomen mit de, mit Teilungsartikel oder einer Menge ersetzt wird. Zahlen bleiben im Satz stehen.",
      items: [
        { before: "Tu veux du gâteau? – Oui, j’", options: ["en", "y", "le"], answer: 0, after: " veux, merci.", feedback: "Du gâteau ist ein Teilungsartikel mit Nomen. Das ersetzt en: j’en veux." },
        { before: "Tu as des cousins? – J’", options: ["en", "y", "les"], answer: 0, after: " ai trois.", feedback: "En ersetzt des cousins, und die Zahl trois bleibt nach dem Verb stehen." },
        { before: "Il y a des places libres? – Oui, il y ", options: ["en a", "a en", "y a"], answer: 0, after: " beaucoup.", feedback: "En steht vor dem Verb: il y en a. Die Mengenangabe beaucoup bleibt dahinter." },
        { before: "Tu viens de Paris? – Oui, j’", options: ["en", "y", "le"], answer: 0, after: " viens.", feedback: "Venir de + Ort wird durch en ersetzt: j’en viens." },
        { before: "Je ne veux pas de sucre. Je n’", options: ["en", "y", "le"], answer: 0, after: " veux pas.", feedback: "In der Verneinung umschließen ne und pas das Pronomen en und das Verb: je n’en veux pas." },
      ],
      conclusion: "En ersetzt Nomen mit de, Teilungsartikel und Mengen. Es steht vor dem Verb und Zahlen bleiben dahinter.",
    },
    casework: {
      title: "Am Brotstand",
      story:
        "Auf dem Markt sagt die Kundin: « Je voudrais du pain. Vous en avez? – Oui, j’en ai beaucoup. – Alors j’en prends deux. Et des croissants? – Je n’en ai plus. »",
      steps: [
        {
          question: "Was ersetzt en in « Vous en avez? »?",
          options: ["du pain", "deux croissants", "Je voudrais"],
          answer: 0,
          explanation: "En ersetzt du pain, also das Nomen mit Teilungsartikel. Die Zahl deux wird erst später genannt.",
        },
        {
          question: "Warum steht in « j’en prends deux » die Zahl hinter dem Verb?",
          options: ["Zahlen bleiben hinter dem Verb stehen.", "En ersetzt auch die Zahl im selben Satz.", "Deux ist hier selbst ein Nomen im Plural."],
          answer: 0,
          explanation: "Das Pronomen ersetzt nur das Nomen. Zahlen und Mengenangaben bleiben im Satz stehen.",
        },
        {
          question: "Wie funktioniert die Verneinung in « Je n’en ai plus »?",
          options: ["Ne und plus umschließen en und das Verb.", "Plus steht in diesem Satz vor dem Pronomen en.", "En steht nach dem Verb und nach plus."],
          answer: 0,
          explanation: "Wie bei y umschließen ne und plus das Pronomen en und das Verb: je n’en ai plus.",
        },
      ],
      verdict:
        "Das Gespräch zeigt en mit Teilungsartikel, mit Zahl und in der Verneinung. Das Pronomen steht immer vor dem Verb, die Zahl bleibt dahinter.",
    },
    tasks: {
      1: {
        prompt:
          "Ersetze die markierten Teile durch en: 1. Tu veux du thé? Oui, je veux du thé. 2. J’ai deux frères. 3. Il ne mange pas de viande.",
        hints: [
          "Erkenne das Nomen mit Teilungsartikel, Zahl oder de.",
          "Die Zahl bleibt nach dem Verb stehen.",
        ],
        model:
          "1. Oui, j’en veux. 2. J’en ai deux. 3. Il n’en mange pas. In Satz 1 ersetzt en du thé, in Satz 2 ersetzt es frères, und die Zahl bleibt stehen. In Satz 3 ersetzt en de la viande, und ne und pas umschließen en und das Verb.",
        criteria: [
          "En steht vor dem Verb.",
          "Zahlen und Mengenangaben bleiben im Satz stehen.",
          "In der Verneinung umschließen ne und pas en und das Verb.",
        ],
      },
      2: {
        prompt:
          "Schreibe ein kurzes Gespräch (vier bis fünf Zeilen) auf dem Markt, bei dem du Obst oder Gemüse kaufst. Verwende en mindestens dreimal, auch in der Verneinung.",
        hints: [
          "Beginne mit « Bonjour, je voudrais des pommes. ».",
          "Antworten wie « J’en ai beaucoup » oder « Je n’en ai plus » helfen dir.",
        ],
        model:
          "– Bonjour, je voudrais des pommes. Vous en avez? – Oui, j’en ai beaucoup. – Alors j’en prends un kilo. Et des poires? – Je n’en ai plus aujourd’hui. – Dommage, j’en achète demain, merci.",
        criteria: [
          "En wird mindestens dreimal richtig verwendet.",
          "Eine Verneinung mit n’en kommt vor.",
          "Zahlen und Mengenangaben bleiben stehen.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Das Pronomen en: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Tu veux du lait? – Oui, j’", options: ["en", "y"], answer: 0, after: " veux.", feedback: "Du lait ist ein Teilungsartikel mit Nomen, also en." },
          { before: "Tu as des frères? – J’", options: ["en", "y"], answer: 0, after: " ai deux.", feedback: "En ersetzt des frères, die Zahl bleibt stehen." },
          { before: "Il y a du monde? – Oui, il y ", options: ["en a", "a en"], answer: 0, after: " beaucoup.", feedback: "En steht vor dem Verb a: il y en a beaucoup." },
          { before: "Je n’", options: ["en", "y"], answer: 0, after: " ai pas.", feedback: "In der Verneinung steht en zwischen ne und dem Verb." },
          { before: "Tu viens de la gare? – Oui, j’", options: ["en", "y"], answer: 0, after: " viens.", feedback: "Venir de + Ort wird durch en ersetzt." },
          { before: "Vous avez des idées? – Oui, nous ", options: ["en avons", "avons en"], answer: 0, after: " trois.", feedback: "En steht vor dem Verb, die Zahl bleibt stehen." },
          { before: "Elle mange des pommes. Elle ", options: ["en mange", "y mange"], answer: 0, after: " souvent.", feedback: "Des pommes wird durch en ersetzt." },
          { before: "Il veut du sucre. Il veut ", options: ["en prendre", "prendre en"], answer: 0, after: " un peu.", feedback: "Mit dem Infinitiv steht en direkt davor." },
        ],
        2: [
          { before: "Tu as acheté des livres pour le voyage? – Oui, j’", options: ["en ai acheté", "ai acheté en", "y ai acheté"], answer: 0, after: " trois, parce que le trajet est long.", feedback: "Im passé composé steht en vor dem Hilfsverb, die Zahl trois bleibt stehen." },
          { before: "J’aime les cartes postales et j’", options: ["en envoie", "y envoie", "envoie en"], answer: 0, after: " souvent à mes amis, parce que j’en trouve partout.", feedback: "En ersetzt les cartes postales und steht vor dem Verb. Vor einem Vokal wird je zu j’." },
          { before: "Dans cette ville, il y a beaucoup de parcs et nous ", options: ["en visitons", "visitons en", "y visitons"], answer: 0, after: " un chaque dimanche.", feedback: "Beaucoup de parcs wird durch en ersetzt, die Zahl un bleibt stehen." },
          { before: "Tu prends du sucre dans ton café? – Non, je ", options: ["n’en prends pas", "ne prends pas en", "n’y prends pas"], answer: 0, after: ", je le bois sans sucre.", feedback: "In der Verneinung umschließen ne und pas das Pronomen en und das Verb." },
          { before: "Combien de frères as-tu? – J’", options: ["en ai deux", "ai deux en", "y ai deux"], answer: 0, after: " et une petite sœur.", feedback: "En ersetzt das Nomen, die Zahl deux bleibt nach dem Verb stehen." },
          { before: "Je veux du fromage, mais il n’y ", options: ["en a plus", "a en plus", "y a plus"], answer: 0, after: " à la maison.", feedback: "Il n’y en a plus: En steht vor dem Verb a." },
          { before: "Ma tante est à Marseille. Elle ", options: ["en revient", "y revient", "revient en"], answer: 0, after: " demain avec de bonnes nouvelles pour nous.", feedback: "Revenir de + Ort wird durch en ersetzt: Sie kommt von dort zurück." },
          { before: "Nous cherchons des idées pour la fête, mais nous ", options: ["n’en trouvons pas", "ne trouvons pas en", "n’y trouvons pas"], answer: 0, after: " de bonnes pour le moment.", feedback: "En steht zwischen ne und dem Verb: nous n’en trouvons pas." },
        ],
      },
    },
  },
  {
    id: "fr-inversion",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.3"],
    title: "Die Frage mit Inversion verstehen",
    intro:
      "In geschriebenen Texten begegnet dir die Frage mit Inversion. Du erkennst sie am Bindestrich und kannst sie in eine einfachere Form umschreiben.",
    paragraphs: [
      "Im Französischen stellst du Fragen auf drei Arten: mit der Satzmelodie (« Tu viens? »), mit est-ce que (« Est-ce que tu viens? ») oder mit der Inversion (« Viens-tu? »). Die Inversion klingt gehoben und steht vor allem in Texten, Interviews und formellen Gesprächen. Du musst sie in diesem Jahr vor allem verstehen, selbst benutzt du im Alltag meist est-ce que oder die Satzmelodie.",
      "Bei der Inversion steht das Verb vor dem Pronomen, beide sind mit einem Bindestrich verbunden: « Où habites-tu? », « Quand partez-vous? », « Parle-t-il français? » Endet das Verb auf einen Vokal und beginnt das Pronomen mit einem Vokal (il, elle, on), schiebst du ein **-t-** dazwischen: « A-t-elle téléphoné? », « Va-t-on au cinéma? »",
      "Steht ein Nomen als Subjekt, bleibt es vor dem Verb und das passende Pronomen folgt dem Verb: « Marie est-elle partie? », « Ton frère aime-t-il le sport? » Im passé composé wird das Hilfsverb vorangestellt: « As-tu vu ce film? », « Êtes-vous allés à Paris? »",
      "Zum Umformen merkst du dir: Inversion → est-ce que, das Pronomen steht dann wieder vor dem Verb. « Quand partez-vous? » wird zu « Quand est-ce que vous partez? ». Typische Fehler sind das fehlende -t- (« Parle-il? » statt « Parle-t-il? ») und das Pronomen ohne Bindestrich (« Viens tu? »).",
    ],
    terms: [
      { term: "Inversion", text: "Eine Frageform, bei der das Verb vor dem Pronomen steht und beide mit einem Bindestrich verbunden sind: Viens-tu?" },
      { term: "-t- (t euphonique)", text: "Ein eingeschobener Laut zwischen einem Vokal am Verbende und il, elle oder on: Parle-t-il? A-t-elle?" },
      { term: "est-ce que", text: "Eine Frageeinleitung, mit der du eine Frage ohne Inversion stellst: Est-ce que tu viens?" },
    ],
    takeaway:
      "Bei der Inversion steht das Pronomen mit Bindestrich hinter dem Verb: Viens-tu? Endet das Verb auf einen Vokal, kommt -t- vor il, elle, on. Zum Umformen setzt du est-ce que davor und stellst das Pronomen wieder vor das Verb.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welche Frage bedeutet dasselbe wie « Est-ce que tu viens? »?",
      answer: "Viens-tu?",
      wrong: ["Tu viens-tu?", "Viens est-ce que tu?"],
      explanation:
        "Bei der Inversion steht das Verb vor dem Pronomen, mit Bindestrich: viens-tu. Die beiden anderen Formen vermischen die Frageformen.",
    },
    workshop: {
      kind: "choose",
      title: "Inversion erkennen und umformen",
      instruction:
        "Wähle die Form mit est-ce que, die dieselbe Frage stellt wie der Satz mit Inversion.",
      items: [
        { before: "« Où habites-tu? » heißt: ", options: ["Où est-ce que tu habites?", "Où habites-tu est-ce que?", "Est-ce que où tu habites?"], answer: 0, after: "", feedback: "Das Fragewort bleibt vorn, danach folgt est-ce que und das Pronomen steht wieder vor dem Verb." },
        { before: "« A-t-elle téléphoné? » heißt: ", options: ["Est-ce qu’elle a téléphoné?", "Est-ce que a-t-elle téléphoné?", "Elle a-t-elle téléphoné?"], answer: 0, after: "", feedback: "Das Hilfsverb a und das Pronomen tauschen die Plätze: elle a téléphoné. Est-ce que wird vor einem Vokal zu est-ce qu’." },
        { before: "Welches -t- fehlt: « Parle", options: ["-t-il", "-il", "-t’il"], answer: 0, after: " français? »", feedback: "Endet das Verb auf einen Vokal, schiebst du -t- ein, damit zwei Vokale nicht aufeinandertreffen: parle-t-il." },
        { before: "« Marie est-elle partie? » bedeutet: ", options: ["Est-ce que Marie est partie?", "Est-ce que Marie elle est partie?", "Marie est-ce qu’elle partie?"], answer: 0, after: "", feedback: "Das Nomen Marie bleibt das Subjekt, das Pronomen elle verschwindet bei est-ce que." },
        { before: "« Quand partez-vous? » heißt: ", options: ["Quand est-ce que vous partez?", "Quand vous partez est-ce que?", "Est-ce que quand vous partez?"], answer: 0, after: "", feedback: "Das Fragewort bleibt vorn, dann folgt est-ce que mit Subjekt und Verb." },
      ],
      conclusion: "Inversion verstehst du an dem Bindestrich. Zum Umformen setzt du est-ce que ein und stellst das Pronomen vor das Verb.",
    },
    casework: {
      title: "Ein Interview mit einem Austauschschüler",
      story:
        "In der Schülerzeitung steht: « Où habitez-vous? – À Rennes. – Parlez-vous allemand? – Un peu. – Aimez-vous le sport? – Oui, je joue au football. »",
      steps: [
        {
          question: "Woran erkennst du, dass « Parlez-vous allemand? » eine Frage mit Inversion ist?",
          options: ["Das Pronomen folgt mit Bindestrich dem Verb.", "Das Pronomen steht ohne Bindestrich vor dem Verb.", "Est-ce que steht direkt am Satzanfang als Frageteil."],
          answer: 0,
          explanation: "Bei der Inversion folgt das Pronomen mit Bindestrich auf das Verb: parlez-vous.",
        },
        {
          question: "Wie lautet « Où habitez-vous? » mit est-ce que?",
          options: ["Où est-ce que vous habitez?", "Est-ce que où vous habitez?", "Où vous habitez est-ce que?"],
          answer: 0,
          explanation: "Das Fragewort steht vorn, dann est-ce que, dann Subjekt und Verb.",
        },
        {
          question: "Welche Frage mit Inversion ist richtig gebildet?",
          options: ["Aime-t-il le sport?", "Aime-il le sport?", "Aimé-t-il le sport?"],
          answer: 0,
          explanation: "Das Verb aime endet auf einen Vokal und il beginnt mit einem Vokal, deshalb steht -t- dazwischen.",
        },
      ],
      verdict:
        "Das Interview zeigt Inversion in Alltagsfragen. Du erkennst sie am Bindestrich und kannst sie mit est-ce que umschreiben.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe die Fragen mit est-ce que um: 1. Où habites-tu? 2. Parle-t-il anglais? 3. Quand partez-vous?",
        hints: [
          "Behalte das Fragewort am Anfang.",
          "Setze est-ce que ein und stelle das Pronomen vor das Verb zurück.",
        ],
        model:
          "1. Où est-ce que tu habites? 2. Est-ce qu’il parle anglais? 3. Quand est-ce que vous partez? In Frage 2 steht kein Fragewort, deshalb beginnt est-ce qu’ den Satz. Vor einem Vokal wird est-ce que zu est-ce qu’.",
        criteria: [
          "Est-ce que steht nach dem Fragewort oder am Satzanfang.",
          "Das Pronomen steht wieder vor dem Verb und der Bindestrich entfällt.",
          "Vor einem Vokal wird est-ce que zu est-ce qu’.",
        ],
      },
      2: {
        prompt:
          "Du führst ein Interview mit einer französischen Gastschülerin. Schreibe fünf Fragen mit Inversion, zum Beispiel zu Wohnort, Hobbys, Schule und Plänen.",
        hints: [
          "Beginne mit Fragewörtern wie où, quand, pourquoi oder comment.",
          "Achte auf den Bindestrich und das -t- bei Verben mit vokalischem Ende vor il, elle, on.",
        ],
        model:
          "Où habites-tu? Quel sport pratiques-tu? Aimes-tu l’école? Quand rentres-tu en France? Parle-t-elle aussi anglais à la maison? Alle Fragen haben das Pronomen mit Bindestrich hinter dem Verb, in der letzten steht das -t-.",
        criteria: [
          "Mindestens vier Fragen sind mit Inversion richtig gebildet.",
          "Der Bindestrich und, wo nötig, das -t- stehen richtig.",
          "Die Fragen passen zu einem Interview mit einer Gastschülerin.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Inversion umformen: Übungsrunde",
      instruction:
        "Wähle die passende Umformung oder die richtige Inversion. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "« Viens-tu? » heißt: ", options: ["Est-ce que tu viens?", "Est-ce que viens tu?"], answer: 0, after: "", feedback: "Das Pronomen steht bei est-ce que wieder vor dem Verb." },
          { before: "« Parle-t-il français? »: Das ", options: ["-t-", "-l-"], answer: 0, after: " steht zwischen Verb und il.", feedback: "Zwischen einem Vokal und il, elle oder on steht -t-." },
          { before: "« Où vas-tu? » heißt: ", options: ["Où est-ce que tu vas?", "Où vas est-ce que tu?"], answer: 0, after: "", feedback: "Das Fragewort bleibt vorn, danach steht est-ce que mit Subjekt und Verb." },
          { before: "« A-t-elle faim? » heißt: ", options: ["Est-ce qu’elle a faim?", "Est-ce que a elle faim?"], answer: 0, after: "", feedback: "Elle a faim: Das Pronomen steht wieder vor dem Verb. Est-ce que wird zu est-ce qu’." },
          { before: "« Aimez-vous le sport? » heißt: ", options: ["Est-ce que vous aimez le sport?", "Aimez est-ce que vous le sport?"], answer: 0, after: "", feedback: "Das Pronomen vous steht bei est-ce que vor dem Verb." },
          { before: "Welche Inversion ist richtig? ", options: ["Mange-t-il?", "Mange-il?"], answer: 0, after: "", feedback: "Mange endet auf einen Vokal, deshalb braucht es -t- vor il." },
          { before: "« Quand pars-tu? » heißt: ", options: ["Quand est-ce que tu pars?", "Quand pars est-ce que tu?"], answer: 0, after: "", feedback: "Nach dem Fragewort folgt est-ce que, dann Subjekt und Verb." },
          { before: "« Comment vas-tu? » heißt: ", options: ["Comment est-ce que tu vas?", "Comment vas est-ce que tu?"], answer: 0, after: "", feedback: "Das Fragewort bleibt vorn, danach folgt est-ce que." },
        ],
        2: [
          { before: "In einem Interview fragt eine Journalistin: « Où habitent-ils depuis leur arrivée en France? » Mit est-ce que: ", options: ["Où est-ce qu’ils habitent depuis leur arrivée en France?", "Où habitent est-ce qu’ils depuis leur arrivée en France?", "Est-ce que où ils habitent depuis leur arrivée en France?"], answer: 0, after: "", feedback: "Das Fragewort bleibt vorn, danach folgt est-ce qu’ vor ils und das Pronomen steht wieder vor dem Verb." },
          { before: "Im Fragebogen steht: « Pratiquez-vous un sport avec vos amis le week-end? » Mit est-ce que: ", options: ["Est-ce que vous pratiquez un sport avec vos amis le week-end?", "Pratiquez est-ce que vous un sport avec vos amis le week-end?", "Est-ce que pratiquez-vous un sport avec vos amis le week-end?"], answer: 0, after: "", feedback: "Das Pronomen vous steht bei est-ce que wieder vor dem Verb, der Bindestrich entfällt." },
          { before: "Welche Frage ist als Inversion richtig? Auf dem Plakat steht: ", options: ["« Aime-t-elle vraiment les voyages en train? »", "« Aime-elle vraiment les voyages en train? »", "« Aimé-t-elle vraiment les voyages en train? »"], answer: 0, after: "", feedback: "Das Verb aime endet auf einen Vokal, vor elle steht -t-." },
          { before: "Der Lehrer fragt: « Pourquoi n’êtes-vous pas venus au cours de samedi dernier? » Mit est-ce que: ", options: ["Pourquoi est-ce que vous n’êtes pas venus au cours de samedi dernier?", "Pourquoi n’êtes est-ce que vous pas venus au cours de samedi dernier?", "Est-ce que pourquoi vous n’êtes pas venus au cours de samedi dernier?"], answer: 0, after: "", feedback: "Das Fragewort bleibt vorn, danach folgt est-ce que mit vous und der Verneinung." },
          { before: "Im Reiseführer: « Marie a-t-elle déjà visité le Louvre? » Mit est-ce que: ", options: ["Est-ce que Marie a déjà visité le Louvre?", "Est-ce que Marie elle a déjà visité le Louvre?", "Marie est-ce qu’elle a déjà visité le Louvre?"], answer: 0, after: "", feedback: "Das Nomen Marie bleibt Subjekt, das Pronomen elle entfällt bei est-ce que." },
          { before: "Ein Schüler fragt an der Rezeption: « Peut-on réserver une chambre par Internet pour la semaine prochaine? » Mit est-ce que: ", options: ["Est-ce qu’on peut réserver une chambre par Internet pour la semaine prochaine?", "Est-ce que peut-on réserver une chambre par Internet pour la semaine prochaine?", "On peut est-ce que réserver une chambre par Internet pour la semaine prochaine?"], answer: 0, after: "", feedback: "Das Pronomen on steht wieder vor dem Verb, est-ce que wird vor einem Vokal zu est-ce qu’." },
          { before: "Welche Inversion ist richtig? In der Zeitung steht: ", options: ["« Vont-ils fêter la fin de l’année à Paris? »", "« Vont ils fêter la fin de l’année à Paris? »", "« Ils vont-ils fêter la fin de l’année à Paris? »"], answer: 0, after: "", feedback: "Bei der Inversion steht das Pronomen mit Bindestrich hinter dem Verb: vont-ils." },
          { before: "Im Gespräch: « Habites-tu toujours dans la même ville que ta famille? » Mit est-ce que: ", options: ["Est-ce que tu habites toujours dans la même ville que ta famille?", "Habites est-ce que tu toujours dans la même ville que ta famille?", "Est-ce que habites-tu toujours dans la même ville que ta famille?"], answer: 0, after: "", feedback: "Das Pronomen tu steht bei est-ce que wieder vor dem Verb." },
        ],
      },
    },
  },
  {
    id: "fr-discours-indirect",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.3"],
    title: "Indirekte Rede und indirekte Fragen",
    intro:
      "Mit dire que, demander si und einem Fragewort gibst du wieder, was jemand gesagt oder gefragt hat. Das Verb der Einleitung steht im Präsens.",
    paragraphs: [
      "Mit der indirekten Rede gibst du Äußerungen anderer wieder: « Paul dit: « Je suis fatigué. » » wird zu « Paul dit qu’il est fatigué. » Du leitest mit **que** ein (vor einem Vokal **qu’**) und passt die Pronomen an: aus je wird il, aus mon wird son. Steht das einleitende Verb im Präsens wie dit, demande oder répond, bleibt die Zeit im Nebensatz unverändert.",
      "Bei Ja-nein-Fragen verwendest du **si**: « Elle demande: « Tu viens? » » wird zu « Elle demande si tu viens. » Vor il und ils wird si zu **s’**: « Il demande s’il peut venir. » Fragewörter wie où, quand, comment oder pourquoi bleiben stehen: « Il demande où tu habites. » Die Wortstellung ist die eines Aussagesatzes, also ohne Inversion und ohne est-ce que.",
      "Wird nach einem Gegenstand oder einer Person gefragt, ändern sich die Fragewörter: **qu’est-ce que** wird zu **ce que** (« Elle demande ce que tu fais. »), **qu’est-ce qui** wird zu **ce qui** (« Il demande ce qui est arrivé. »), und **qui** bleibt **qui**. Auch die Anrede ändert sich: aus tu wird je oder il, je wird il oder elle, je nach dem, wer berichtet.",
      "Typische Fehler sind « Il demande si est-ce que tu viens » (nach si kein est-ce que), « Elle dit que je suis fatiguée » statt qu’elle est fatiguée (die Person wechselt) und « Il demande qu’est-ce que tu fais » (richtig ist ce que).",
    ],
    terms: [
      { term: "discours indirect", text: "Die Wiedergabe einer Äußerung ohne wörtliche Rede, eingeleitet mit dire que, répondre que oder einem ähnlichen Verb." },
      { term: "interrogation indirecte", text: "Die Wiedergabe einer Frage: mit si bei Ja-nein-Fragen, mit dem Fragewort bei anderen Fragen, ohne Inversion." },
      { term: "ce que, ce qui", text: "Die Formen von qu’est-ce que und qu’est-ce qui in der indirekten Frage: ce que für das Objekt, ce qui für das Subjekt." },
    ],
    takeaway:
      "Äußerung: dire que, Ja-nein-Frage: demander si, Frage mit Wort: das Fragewort bleibt, qu’est-ce que wird ce que. Keine Inversion, Pronomen wechseln, Zeit bleibt beim Präsens im Einleitungsverb.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie gibst du « Elle demande: « Qu’est-ce que tu fais? » » wieder?",
      answer: "Elle demande ce que je fais.",
      wrong: ["Elle demande qu’est-ce que je fais.", "Elle demande si tu fais quoi."],
      explanation:
        "Qu’est-ce que wird in der indirekten Frage zu ce que, und der Bericht ändert tu zu je. Qu’est-ce que bleibt dort nicht stehen.",
    },
    workshop: {
      kind: "choose",
      title: "Indirekte Rede und indirekte Fragen bilden",
      instruction:
        "Achte auf die Einleitung (que, si, Fragewort, ce que) und darauf, dass die Pronomen zum Berichtenden passen.",
      items: [
        { before: "Paul dit: « Je suis fatigué. » → Paul dit ", options: ["qu’il est fatigué", "qu’il suis fatigué", "que je suis fatigué"], answer: 0, after: ".", feedback: "Je wird zu il und das Verb passt sich an: il est. Vor einem Vokal wird que zu qu’." },
        { before: "Elle demande: « Tu viens? » → Elle demande ", options: ["si je viens", "est-ce que je viens", "que je viens"], answer: 0, after: ".", feedback: "Eine Ja-nein-Frage wird mit si angeschlossen. Est-ce que steht in der indirekten Frage nicht." },
        { before: "Il demande: « Où habites-tu? » → Il demande ", options: ["où j’habite", "où habites-tu", "où est-ce que j’habite"], answer: 0, after: ".", feedback: "Das Fragewort bleibt stehen, die Wortstellung ist die eines Aussagesatzes und tu wird zu je." },
        { before: "Elle demande: « Qu’est-ce que tu fais? » → Elle demande ", options: ["ce que je fais", "qu’est-ce que je fais", "que je fais"], answer: 0, after: ".", feedback: "In der indirekten Frage wird qu’est-ce que zu ce que." },
        { before: "Il demande: « Est-ce que je peux venir? » → Il demande ", options: ["s’il peut venir", "si il peut venir", "que je peux venir"], answer: 0, after: ".", feedback: "Vor il wird si zu s’, und die Person wechselt von je zu il." },
      ],
      conclusion: "Dire que für Aussagen, si bei Ja-nein-Fragen, Fragewort bei anderen Fragen und ce que statt qu’est-ce que.",
    },
    casework: {
      title: "Was hat sie gesagt?",
      story:
        "Léa erzählt: « Mon prof dit que nous avons un test. Il demande si nous sommes prêts. Il demande aussi pourquoi Paul n’est pas là. »",
      steps: [
        {
          question: "Warum steht « que » in « Mon prof dit que nous avons un test »?",
          options: ["Dire leitet eine Aussage mit que ein.", "Que ersetzt hier ein Fragewort und stellt eine Frage.", "Das Verb steht hier im Futur und verlangt que."],
          answer: 0,
          explanation: "Nach dire folgt eine Aussage, die mit que angeschlossen wird.",
        },
        {
          question: "Warum steht « si » in « Il demande si nous sommes prêts »?",
          options: ["Es ist eine Ja-nein-Frage.", "Es ist eine Frage mit pourquoi.", "Es ist eine Aussage."],
          answer: 0,
          explanation: "Ja-nein-Fragen werden in der indirekten Frage mit si angeschlossen.",
        },
        {
          question: "Warum steht in « pourquoi Paul n’est pas là » keine Inversion?",
          options: ["Indirekte Fragen haben die normale Wortstellung.", "Pourquoi verlangt in jedem Satz keine Inversion.", "Weil Paul hier ein Eigenname ist und kein Pronomen."],
          answer: 0,
          explanation: "In der indirekten Frage stehen Subjekt und Verb in normaler Reihenfolge.",
        },
      ],
      verdict:
        "Léa gibt eine Aussage, eine Ja-nein-Frage und eine Frage mit Fragewort wieder. Das Verb der Einleitung steht im Präsens, die Zeit im Nebensatz bleibt.",
    },
    tasks: {
      1: {
        prompt:
          "Gib die Äußerungen indirekt wieder: 1. Paul dit: « J’ai faim. » 2. Marie demande: « Tu as faim? » 3. Max demande: « Où est ma veste? »",
        hints: [
          "Wähle die Einleitung (que, si, Fragewort) und passe die Pronomen an.",
          "Verwende keine Inversion und kein est-ce que.",
        ],
        model:
          "1. Paul dit qu’il a faim. 2. Marie demande si j’ai faim. 3. Max demande où est sa veste. In Satz 1 wird je zu il und que zu qu’. In Satz 2 wird tu zu je, weil du berichtest. In Satz 3 bleibt où stehen und ma wird zu sa.",
        criteria: [
          "Die Einleitung (que, si, Fragewort) ist richtig gewählt.",
          "Pronomen und Possessiva passen zum Berichtenden.",
          "Es steht keine Inversion und kein est-ce que in der indirekten Frage.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Bericht (vier bis fünf Sätze) über ein Gespräch mit einer Freundin oder einem Freund, in dem du wiedergibst, was sie oder er gesagt und gefragt hat. Verwende dire que, demander si und ein Fragewort.",
        hints: [
          "Beginne mit « Hier, mon ami m’a dit… » oder « Mon ami dit que… » im Präsens.",
          "Setze die Fragen indirekt: « Il demande si… », « Elle demande où… ».",
        ],
        model:
          "Ma copine Lina dit qu’elle va au cinéma ce soir. Elle demande si je viens avec elle. Elle demande aussi quel film je veux voir. Elle dit qu’elle préfère les comédies. Et elle demande pourquoi je ne réponds pas.",
        criteria: [
          "Dire que, demander si und ein Fragewort kommen vor.",
          "Die Pronomen passen zum Berichtenden.",
          "In indirekten Fragen steht keine Inversion.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Indirekte Rede: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Paul dit: « Je suis là. » → Paul dit ", options: ["qu’il est là", "que je suis là"], answer: 0, after: ".", feedback: "Je wird zu il, und que wird vor einem Vokal zu qu’." },
          { before: "Elle demande: « Tu viens? » → Elle demande ", options: ["si je viens", "que je viens"], answer: 0, after: ".", feedback: "Ja-nein-Fragen werden mit si angeschlossen." },
          { before: "Il demande: « Où vas-tu? » → Il demande ", options: ["où je vais", "où vas-tu"], answer: 0, after: ".", feedback: "In der indirekten Frage steht keine Inversion." },
          { before: "Elle dit: « J’ai soif. » → Elle dit ", options: ["qu’elle a soif", "qu’elle ai soif"], answer: 0, after: ".", feedback: "Das Verb passt sich an: elle a." },
          { before: "Il demande: « Qu’est-ce que tu manges? » → Il demande ", options: ["ce que je mange", "qu’est-ce que je mange"], answer: 0, after: ".", feedback: "In der indirekten Frage wird qu’est-ce que zu ce que." },
          { before: "Léa demande: « Est-ce qu’il pleut? » → Léa demande ", options: ["s’il pleut", "si il pleut"], answer: 0, after: ".", feedback: "Vor il und ils wird si zu s’: s’il pleut." },
          { before: "Max dit: « Mon frère est là. » → Max dit que ", options: ["son frère est là", "mon frère est là"], answer: 0, after: ".", feedback: "Mon wird zu son, weil du von seinem Bruder berichtest." },
          { before: "Elle demande: « Quand partons-nous? » → Elle demande ", options: ["quand nous partons", "quand partons-nous"], answer: 0, after: ".", feedback: "Das Fragewort bleibt, die Inversion fällt weg." },
        ],
        2: [
          { before: "Mon père dit: « Je pars demain matin. » → Mon père dit ", options: ["qu’il part demain matin", "que je pars demain matin", "que il part demain matin"], answer: 0, after: ".", feedback: "Je wird zu il und que zu qu’. Die Zeit bleibt unverändert, weil das Einleitungsverb im Präsens steht." },
          { before: "La prof demande aux élèves: « Avez-vous fini vos devoirs? » → La prof demande ", options: ["s’ils ont fini leurs devoirs", "si ils ont fini leurs devoirs", "que vous avez fini vos devoirs"], answer: 0, after: ".", feedback: "Vor ils wird si zu s’, und vous wird zu ils, vos zu leurs." },
          { before: "Mon voisin demande: « Qu’est-ce que tu fais pendant les vacances? » → Mon voisin demande ", options: ["ce que je fais pendant les vacances", "qu’est-ce que je fais pendant les vacances", "ce que tu fais pendant les vacances"], answer: 0, after: ".", feedback: "Qu’est-ce que wird zu ce que, und tu wird zu je, weil du berichtest." },
          { before: "Ma mère répond: « Je ne sais pas où est ma clé. » → Ma mère répond ", options: ["qu’elle ne sait pas où est sa clé", "que je ne sais pas où est ma clé", "qu’elle ne sait pas où est ma clé"], answer: 0, after: ".", feedback: "Je wird zu elle, ma zu sa. Nach où steht ohne Inversion die normale Wortstellung." },
          { before: "Le guide demande: « Qui parle français dans le groupe? » → Le guide demande ", options: ["qui parle français dans le groupe", "ce qui parle français dans le groupe", "si qui parle français dans le groupe"], answer: 0, after: ".", feedback: "Qui bleibt qui, auch in der indirekten Frage." },
          { before: "Léa demande à son ami: « Pourquoi n’es-tu pas venu? » → Léa demande à son ami ", options: ["pourquoi il n’est pas venu", "pourquoi n’est-il pas venu", "si il n’est pas venu"], answer: 0, after: ".", feedback: "Pourquoi bleibt stehen, die Inversion fällt weg und tu wird zu il." },
          { before: "Mes parents me disent: « Tu dois rentrer avant minuit. » → Mes parents me disent ", options: ["que je dois rentrer avant minuit", "que tu dois rentrer avant minuit", "qu’ils doivent rentrer avant minuit"], answer: 0, after: ".", feedback: "Du berichtest von dir, deshalb wird tu zu je." },
          { before: "Le serveur demande à mes parents: « Qu’est-ce qui vous fait plaisir? » → Il demande ", options: ["ce qui leur fait plaisir", "qu’est-ce qui leur fait plaisir", "ce que leur fait plaisir"], answer: 0, after: ".", feedback: "Qu’est-ce qui wird zu ce qui, und vous wird zu leur, weil du von deinen Eltern berichtest." },
        ],
      },
    },
  },
  {
    id: "fr-imperatif-pronom",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.3"],
    title: "Der Imperativ mit Pronomen",
    intro:
      "Im bejahten Imperativ hängst du Pronomen mit Bindestrich an das Verb, im verneinten stehen sie davor. Me und te werden dabei zu moi und toi.",
    paragraphs: [
      "Mit dem Imperativ gibst du Befehle, Bitten und Ratschläge. Wenn das Verb ein Pronomen bei sich hat, ändert sich die Stellung. Im **bejahten Imperativ** steht das Pronomen hinter dem Verb, verbunden mit einem Bindestrich: « Lève-toi! », « Réponds-moi! », « Regarde-le! », « Dépêche-toi! » Aus me wird dabei moi, aus te wird toi: « Donne-moi le livre. »",
      "Im **verneinten Imperativ** steht das Pronomen wie sonst vor dem Verb, und moi und toi werden wieder zu me und te: « Ne te lève pas! », « Ne me réponds pas! », « Ne le regarde pas! », « Ne me dérange pas! » Die Verneinung ne … pas umschließt dabei Pronomen und Verb.",
      "Mit den Formen für nous und vous gilt dasselbe: « Levons-nous! », « Levez-vous! », « Ne vous levez pas! » Bei Verben auf -er fällt in der 2. Person Singular das -s weg (Regarde! statt Regardes!). Es kehrt vor y und en zurück, damit man es ausspricht: « Vas-y! », « Parles-en! »",
      "Typische Fehler sind « Lève-te! » (im bejahten Imperativ heißt es toi), « Ne lève-toi pas! » (im verneinten steht das Pronomen vor dem Verb und heißt te) und der fehlende Bindestrich bei « Dépêche toi! ».",
    ],
    terms: [
      { term: "bejahter Imperativ", text: "Das Pronomen steht hinter dem Verb und ist mit Bindestrich verbunden: Lève-toi! Me und te werden zu moi und toi." },
      { term: "verneinter Imperativ", text: "Das Pronomen steht vor dem Verb, ohne Bindestrich: Ne te lève pas! Moi und toi werden wieder zu me und te." },
      { term: "moi, toi", text: "Die betonten Formen von me und te, die im bejahten Imperativ hinter dem Verb stehen." },
    ],
    takeaway:
      "Bejaht: Verb + Bindestrich + Pronomen, me und te werden zu moi und toi. Verneint: ne + Pronomen + Verb + pas, moi und toi werden wieder zu me und te. Bei -er-Verben fällt das -s weg, außer vor y und en.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du zu einem Freund: „Steh auf!“?",
      answer: "Lève-toi!",
      wrong: ["Lève-te!", "Te lève!"],
      explanation:
        "Im bejahten Imperativ steht das Pronomen hinter dem Verb und te wird zu toi. Te lève! stellt es falsch vor das Verb.",
    },
    workshop: {
      kind: "choose",
      title: "Den Imperativ mit Pronomen bilden",
      instruction:
        "Prüfe, ob der Imperativ bejaht oder verneint ist, und achte auf Stellung und Form des Pronomens.",
      items: [
        { before: "", options: ["Dépêche-toi", "Te dépêche", "Dépêche-te"], answer: 0, after: "! Le bus arrive.", feedback: "Bejaht steht das Pronomen hinter dem Verb, mit Bindestrich, und te wird zu toi." },
        { before: "Ne ", options: ["te lève pas", "lève-toi pas", "lève pas toi"], answer: 0, after: " si tôt!", feedback: "Verneint steht das Pronomen vor dem Verb, und toi wird wieder zu te." },
        { before: "", options: ["Réponds-moi", "Réponds-me", "Me réponds"], answer: 0, after: " vite, s’il te plaît.", feedback: "Bejaht steht das Pronomen hinter dem Verb, und me wird zu moi." },
        { before: "Ne ", options: ["me dérange pas", "dérange-moi pas", "dérange pas me"], answer: 0, after: " maintenant, je travaille.", feedback: "Verneint steht das Pronomen vor dem Verb, und moi wird wieder zu me." },
        { before: "Voilà Max. ", options: ["Regarde-le", "Le regarde", "Regarde-lui"], answer: 0, after: "!", feedback: "Bejaht steht das Pronomen le hinter dem Verb, mit Bindestrich. Lui wäre ein indirektes Objekt." },
      ],
      conclusion: "Bejaht: Pronomen hinter dem Verb mit Bindestrich, moi und toi. Verneint: Pronomen vor dem Verb, me und te.",
    },
    casework: {
      title: "Ein Morgen mit Hindernissen",
      story:
        "Eine Mutter ruft: « Lève-toi! Dépêche-toi! Ne me dis pas que tu n’as pas faim. Réponds-moi, s’il te plaît! »",
      steps: [
        {
          question: "Warum steht « toi » in « Lève-toi »?",
          options: ["Im bejahten Imperativ wird te zu toi.", "Toi steht nach jedem Verb im Satz.", "Te ist im Imperativ verboten und wird ersetzt."],
          answer: 0,
          explanation: "Nach dem Verb im bejahten Imperativ stehen die betonten Formen moi und toi.",
        },
        {
          question: "Warum steht « me » in « Ne me dis pas »?",
          options: ["Verneint steht me vor dem Verb.", "Weil me hier kürzer geschrieben wird als moi.", "Weil dis mit einem Vokal beginnen würde."],
          answer: 0,
          explanation: "Verneint steht das Pronomen vor dem Verb und moi wird wieder zu me.",
        },
        {
          question: "Wie heißt « Réponds-moi » verneint?",
          options: ["Ne me réponds pas.", "Ne réponds-moi pas.", "Ne réponds pas moi."],
          answer: 0,
          explanation: "Verneint rückt das Pronomen vor das Verb, und moi wird zu me.",
        },
      ],
      verdict:
        "Die Szene zeigt beide Stellungen im Alltag: bejaht mit Bindestrich und moi, toi, verneint mit me, te vor dem Verb.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde den Imperativ: 1. Du (tu) sollst dich beeilen (se dépêcher). 2. Du sollst mir antworten (répondre). 3. Du sollst mich nicht stören (déranger), verneint.",
        hints: [
          "Entscheide zuerst, ob bejaht oder verneint.",
          "Bejaht: me und te werden zu moi und toi. Verneint: wieder me und te.",
        ],
        model:
          "1. Dépêche-toi! 2. Réponds-moi! 3. Ne me dérange pas! In Satz 1 und 2 stehen die Pronomen mit Bindestrich hinter dem Verb, aus te und me werden toi und moi. In Satz 3 steht me vor dem Verb und die Verneinung umschließt beides.",
        criteria: [
          "Bejahte Imperative haben das Pronomen mit Bindestrich hinter dem Verb.",
          "Me und te werden bejaht zu moi und toi, verneint wieder zu me und te.",
          "Die Verneinung umschließt Pronomen und Verb.",
        ],
      },
      2: {
        prompt:
          "Schreibe sechs kurze Anweisungen oder Ratschläge an eine Freundin vor einer Prüfung, drei bejaht und drei verneint, mit Pronomen (toi, moi, me, te, le, la). Beispiele: Lève-toi, Ne te couche pas tard.",
        hints: [
          "Denke an Verben wie se lever, se préparer, se dépêcher, appeler, dire.",
          "Bejaht: Bindestrich und moi, toi. Verneint: Pronomen vor dem Verb.",
        ],
        model:
          "Lève-toi tôt! Prépare-toi bien! Appelle-moi après l’examen! Ne te couche pas trop tard! Ne te dépêche pas trop! Ne me dis pas que tu as oublié ton stylo! Die bejahten Sätze haben Bindestriche, in den verneinten steht das Pronomen vor dem Verb.",
        criteria: [
          "Drei bejahte Imperative mit Bindestrich und toi oder moi.",
          "Drei verneinte Imperative mit te oder me vor dem Verb.",
          "Die Sätze passen zur Situation vor einer Prüfung.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Imperativ mit Pronomen: Übungsrunde",
      instruction:
        "Wähle die richtige Form des Imperativs. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Le bus arrive: ", options: ["Dépêche-toi", "Dépêche-te"], answer: 0, after: " !", feedback: "Bejaht steht das Pronomen hinter dem Verb, und te wird zu toi." },
          { before: "Il est très tôt, ", options: ["ne te lève pas", "ne lève-toi pas"], answer: 0, after: " maintenant!", feedback: "Verneint steht das Pronomen vor dem Verb, und toi wird wieder zu te." },
          { before: "J’ai une question: ", options: ["réponds-moi", "réponds-me"], answer: 0, after: ", s’il te plaît!", feedback: "Bejaht steht moi hinter dem Verb, aus me wird moi." },
          { before: "Je travaille: ", options: ["ne me réponds pas", "ne réponds-moi pas"], answer: 0, after: " maintenant!", feedback: "Verneint steht me vor dem Verb, die Verneinung umschließt beide." },
          { before: "Voilà ton frère: ", options: ["regarde-le", "le regarde"], answer: 0, after: " là-bas!", feedback: "Bejaht steht das Pronomen hinter dem Verb, mit Bindestrich." },
          { before: "Ce film est nul: ", options: ["ne le regarde pas", "ne regarde-le pas"], answer: 0, after: " ce soir!", feedback: "Verneint steht le vor dem Verb, die Verneinung umschließt beide." },
          { before: "Nous sommes en retard: ", options: ["dépêchons-nous", "nous dépêchons"], answer: 0, after: " vite!", feedback: "Bei nous steht das Pronomen hinter dem Verb, mit Bindestrich." },
          { before: "Il est minuit: ", options: ["ne vous levez pas", "ne levez-vous pas"], answer: 0, after: " trop tard demain!", feedback: "Verneint steht vous vor dem Verb, die Verneinung umschließt beide." },
        ],
        2: [
          { before: "Ton frère te dérange pendant que tu travailles. Dis-lui: ", options: ["« Ne me dérange pas! »", "« Ne dérange-moi pas! »", "« Dérange-moi pas! »"], answer: 0, after: "", feedback: "Verneint steht me vor dem Verb und die Verneinung umschließt beide." },
          { before: "Du gibst deiner Freundin einen Rat, bevor sie in die Prüfung geht: ", options: ["« Calme-toi et prépare-toi bien! »", "« Calme-te et prépare-te bien! »", "« Te calme et te prépare bien! »"], answer: 0, after: "", feedback: "Bejaht stehen die Pronomen hinter dem Verb, und te wird zu toi." },
          { before: "Dein Freund soll Paul die Wahrheit sagen: ", options: ["« Dis-lui la vérité! »", "« Lui dis la vérité! »", "« Dis-le la vérité! »"], answer: 0, after: "", feedback: "Bejaht steht das Pronomen lui hinter dem Verb, mit Bindestrich. Es ersetzt die Person, der man etwas sagt." },
          { before: "Du bittest deine Tante um einen Anruf: ", options: ["« Appelle-moi ce soir! »", "« Appelle-me ce soir! »", "« Moi appelle ce soir! »"], answer: 0, after: "", feedback: "Bejaht steht das Pronomen hinter dem Verb und me wird zu moi." },
          { before: "Eine Lehrerin sagt zur Klasse: ", options: ["« Installez-vous, s’il vous plaît! »", "« Vous installez, s’il vous plaît! »", "« Installez, vous s’il vous plaît! »"], answer: 0, after: "", feedback: "Bei vous steht das Pronomen im bejahten Imperativ hinter dem Verb, mit Bindestrich." },
          { before: "Dein Kumpel soll nicht zu spät aufstehen: ", options: ["« Ne te lève pas trop tard! »", "« Ne lève-toi pas trop tard! »", "« Lève-toi pas trop tard! »"], answer: 0, after: "", feedback: "Verneint steht das Pronomen vor dem Verb, und toi wird wieder zu te." },
          { before: "Du willst, dass deine Mutter dich nicht anruft: ", options: ["« Ne m’appelle pas ce soir, s’il te plaît! »", "« N’appelle-moi pas ce soir, s’il te plaît! »", "« Appelle-moi pas ce soir, s’il te plaît! »"], answer: 0, after: "", feedback: "Verneint steht m’ vor dem Verb, und me wird vor einem Vokal zu m’." },
          { before: "Du sagst zu deinen Freunden, dass ihr euch beeilen sollt: ", options: ["« Dépêchons-nous, nous sommes en retard! »", "« Nous dépêchons, nous sommes en retard! »", "« Dépêchez-nous, nous sommes en retard! »"], answer: 0, after: "", feedback: "Bei nous steht das Pronomen im bejahten Imperativ hinter dem Verb, mit Bindestrich." },
        ],
      },
    },
  },
];
