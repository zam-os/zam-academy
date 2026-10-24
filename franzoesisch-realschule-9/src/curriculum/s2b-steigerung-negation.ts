import type { Lesson } from "../model/types";

/**
 * Stufe 2, zweiter Teil: Grammatik, Personen, Gegenstände, Orte und Sachverhalte beschreiben
 * (Kompetenzerwartung 1.2.2.1): où und Präposition + qui, Steigerung der Adjektive,
 * Verneinung mit personne ne und rien ne, Artikel mit Ländernamen.
 */
export const S2B: Lesson[] = [
  {
    id: "fr-relatif-ou-prep",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "Relativsätze mit où und Präposition + qui",
    intro:
      "Mit où verweist du auf Orte und Zeitpunkte, mit Präposition + qui auf Personen. So beschreibst du Orte und Menschen genauer.",
    paragraphs: [
      "**où** ersetzt im Relativsatz eine Orts- oder Zeitangabe: « la ville où j’habite » (j’habite dans cette ville), « le café où nous nous retrouvons », « le jour où nous sommes partis ». Das Bezugswort ist ein Ort oder ein Zeitpunkt, und im Relativsatz folgt danach in der Regel ein Subjekt mit seinem Verb. Im Deutschen sagst du dafür „wo“, „in dem“ oder „an dem“, im Französischen genügt où.",
      "Bezieht sich der Relativsatz auf eine Person und braucht das Verb eine Präposition, steht die Präposition vor **qui**: « la fille avec qui je travaille », « le prof à qui je pose la question », « les amis chez qui nous dormons », « la copine pour qui j’ai acheté un cadeau ». Die Präposition rückt also direkt vor qui, das Verb folgt danach. Das Pronomen qui ändert sich dabei nicht.",
      "Beide Formen haben ihr Gebiet. Nach einer Präposition steht qui nur für Personen. Bei einem Ort oder Zeitpunkt nimmst du où, und bei Sachen mit Präposition formst du den Satz meist um, denn die passende Form dafür lernst du erst später. Für alle Fälle im Alltag reichen où und Präposition + qui.",
      "Typische Fehler sind « le garçon avec que je parle » (nach einer Präposition darf kein que stehen, richtig ist avec qui) und « le jour que nous sommes partis » (bei einer Zeitangabe steht où, nicht que). Auch « la ville qui j’habite » ist falsch: qui kann nie vor einem Subjekt stehen.",
    ],
    terms: [
      { term: "où", text: "Relativpronomen für Ort und Zeit. Es steht nach einem Nomen wie la ville, le jour, l’endroit und vor Subjekt und Verb." },
      { term: "préposition + qui", text: "Relativpronomen für Personen nach einer Präposition, zum Beispiel avec qui, à qui, chez qui, pour qui." },
      { term: "Bezugswort", text: "Das Nomen, auf das sich der Relativsatz bezieht. Seine Art (Ort, Zeit, Person) entscheidet über das Pronomen." },
    ],
    takeaway:
      "Für Orte und Zeitpunkte nimmst du où, für Personen nach einer Präposition die Präposition vor qui. Nach où folgt Subjekt und Verb, nach der Präposition + qui das Verb mit seinem Subjekt. Nach einer Präposition steht nie que.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "C’est la ville où nous passons nos vacances.",
      wrong: ["C’est la ville que nous passons nos vacances.", "C’est la ville qui nous passons nos vacances."],
      explanation:
        "Die Stadt ist ein Ort, also où. Mit que wäre der Satz falsch, weil nous passons nos vacances schon sein eigenes Objekt hat. Qui kann nie vor einem Subjekt wie nous stehen.",
    },
    workshop: {
      kind: "choose",
      title: "où, qui oder que?",
      instruction:
        "Prüfe, ob das Bezugswort ein Ort, ein Zeitpunkt oder eine Person mit Präposition ist. Dann wählst du où oder qui.",
      items: [
        { before: "Voilà le café ", options: ["où", "qui", "que"], answer: 0, after: " nous nous retrouvons.", feedback: "Le café ist ein Ort: Nous nous retrouvons dans le café. Für Orte nimmst du où." },
        { before: "Voici la copine avec ", options: ["qui", "que", "où"], answer: 0, after: " je fais du sport.", feedback: "La copine ist eine Person, und das Verb braucht die Präposition avec. Nach einer Präposition steht qui, nie que." },
        { before: "Le jour ", options: ["où", "qui", "que"], answer: 0, after: " nous partons, il pleut.", feedback: "Le jour ist ein Zeitpunkt. Für Zeitangaben nimmst du où, nicht que." },
        { before: "Le prof à ", options: ["qui", "où", "que"], answer: 0, after: " je pose une question est sympa.", feedback: "Je pose une question à un prof: Die Präposition à steht vor qui, weil das Bezugswort eine Person ist." },
        { before: "Voilà les amis chez ", options: ["qui", "où", "que"], answer: 0, after: " nous dormons ce week-end.", feedback: "Les amis sind Personen, und chez ist eine Präposition. Nach der Präposition steht qui." },
      ],
      conclusion: "Orte und Zeitpunkte bekommen où, Personen nach einer Präposition bekommen qui direkt hinter der Präposition.",
    },
    casework: {
      title: "Ein Beitrag über den Austausch",
      story:
        "Auf der Klassenseite schreibt Nina: « Voilà la ville où j’ai passé une semaine. Voici la famille chez qui j’ai habité. Et le jour où je suis partie, nous avons tous pleuré. »",
      steps: [
        {
          question: "Warum steht im ersten Satz où?",
          options: [
            "La ville ist ein Ort.",
            "La ville ist eine Person.",
            "La ville ist das Subjekt.",
          ],
          answer: 0,
          explanation: "Für Orte nimmst du où. Die anderen Pronomen sind hier nicht möglich.",
        },
        {
          question: "Warum steht im zweiten Satz qui und nicht que?",
          options: [
            "Nach der Präposition chez steht bei Personen qui.",
            "Weil la famille hier ein Ort und kein Mensch ist.",
            "Weil nach einer Präposition immer que folgen muss.",
          ],
          answer: 0,
          explanation: "Nach einer Präposition steht für Personen qui. Que nach einem Nomen ist dagegen häufig, aber nie direkt nach einer Präposition.",
        },
        {
          question: "Wie lautet das Pronomen in « le jour … je suis partie »?",
          options: ["où", "que", "qui"],
          answer: 0,
          explanation: "Le jour ist ein Zeitpunkt. Dafür nimmst du où, genau wie bei einem Ort.",
        },
      ],
      verdict:
        "Nina verwendet où für Ort und Zeit und chez qui für die Gastfamilie. Beide Muster brauchst du für Beschreibungen von Reisen und Aufenthalten.",
    },
    tasks: {
      1: {
        prompt:
          "Verbinde die Sätze mit où oder Präposition + qui: 1. C’est la ville. J’habite dans cette ville. 2. Voilà le copain. Je joue au foot avec ce copain. 3. C’est le jour. Nous avons un test ce jour-là.",
        hints: [
          "Frage dich, ob das Bezugswort ein Ort, ein Zeitpunkt oder eine Person ist.",
          "Bei Personen schiebst du die Präposition vor qui und lässt sie im zweiten Satz weg.",
        ],
        model:
          "1. C’est la ville où j’habite. 2. Voilà le copain avec qui je joue au foot. 3. C’est le jour où nous avons un test. In den Sätzen 1 und 3 ist das Bezugswort ein Ort beziehungsweise ein Zeitpunkt, deshalb où. Im zweiten Satz ist es eine Person mit der Präposition avec, die vor qui steht.",
        criteria: [
          "Der Ort und der Zeitpunkt werden mit où angeschlossen.",
          "Bei der Person steht die Präposition vor qui.",
          "Kein überflüssiges Wort aus dem zweiten Satz bleibt stehen.",
        ],
      },
      2: {
        prompt:
          "Beschreibe in vier bis fünf Sätzen einen Ort, den du magst, und eine Person, mit der du dort Zeit verbringst. Verwende où und eine Präposition + qui.",
        hints: [
          "Beginne mit « Mon endroit préféré, c’est … où … ».",
          "Für die Person: « mon ami avec qui … », « ma cousine chez qui … » oder « la fille à qui … ».",
        ],
        model:
          "Mon endroit préféré, c’est le parc près de chez moi, où je me promène souvent. Le samedi, j’y retrouve Max, un ami avec qui je joue au basket. Voilà aussi la boulangerie où nous achetons un croissant après le sport. Max est le copain à qui je raconte tout.",
        criteria: [
          "Mindestens ein Relativsatz mit où, richtig angeschlossen.",
          "Mindestens ein Relativsatz mit Präposition + qui für eine Person.",
          "Die Sätze beschreiben einen Ort und eine Person verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "où oder Präposition + qui: Übungsrunde",
      instruction:
        "Wähle für jeden Satz das richtige Relativpronomen. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Voilà la rue ", options: ["où", "que"], answer: 0, after: " j’habite.", feedback: "La rue ist ein Ort: Du wohnst in dieser Straße. Für Orte nimmst du où." },
          { before: "C’est l’ami avec ", options: ["qui", "que"], answer: 0, after: " je joue.", feedback: "L’ami ist eine Person und davor steht die Präposition avec: avec qui." },
          { before: "Voici le jour ", options: ["où", "qui"], answer: 0, after: " nous partons.", feedback: "Le jour ist ein Zeitpunkt. Auch für Zeitangaben nimmst du où, nicht que." },
          { before: "La fille à ", options: ["qui", "où"], answer: 0, after: " je parle est ma voisine.", feedback: "La fille ist eine Person und à ist eine Präposition, also steht à qui." },
          { before: "C’est la ville ", options: ["où", "que"], answer: 0, after: " nous habitons.", feedback: "La ville ist ein Ort: Wir wohnen in dieser Stadt. Für Orte nimmst du où." },
          { before: "Voilà le prof pour ", options: ["qui", "où"], answer: 0, after: " nous avons une surprise.", feedback: "Le prof ist eine Person, und die Präposition pour steht direkt vor qui." },
          { before: "J’aime le café ", options: ["où", "qui"], answer: 0, after: " nous allons.", feedback: "Le café ist ein Ort: Wir gehen in das Café. Für Orte nimmst du où." },
          { before: "Ce sont les amis chez ", options: ["qui", "où"], answer: 0, after: " j’habite.", feedback: "Les amis sind Personen, und die Präposition chez steht direkt vor qui." },
        ],
        2: [
          { before: "Le soir ", options: ["où", "que"], answer: 0, after: " nous sommes arrivés à Paris, nous avons mangé dans un petit restaurant.", feedback: "Le soir ist ein Zeitpunkt, also où." },
          { before: "La famille chez ", options: ["qui", "où"], answer: 0, after: " j’ai passé mes vacances habite près de Bordeaux.", feedback: "La famille sind Personen, und chez ist eine Präposition vor qui." },
          { before: "Voilà la salle ", options: ["où", "que"], answer: 0, after: " nous avons notre cours de français chaque semaine.", feedback: "La salle ist ein Ort, also où." },
          { before: "Les amis avec ", options: ["qui", "que"], answer: 0, after: " je voyage cet été viennent de Lyon.", feedback: "Nach der Präposition avec steht bei Personen qui." },
          { before: "Le jour ", options: ["où", "qui"], answer: 0, after: " il pleut, nous restons à la maison et nous jouons aux cartes.", feedback: "Le jour ist ein Zeitpunkt, also où." },
          { before: "La personne à ", options: ["qui", "où"], answer: 0, after: " tu dois écrire ton e-mail s’appelle Madame Roux.", feedback: "La personne ist eine Person, und à steht davor, also qui." },
          { before: "Le village ", options: ["où", "que"], answer: 0, after: " mes grands-parents habitent est très calme.", feedback: "Le village ist ein Ort, also où." },
          { before: "C’est le collègue sans ", options: ["qui", "où"], answer: 0, after: " elle ne peut pas finir son projet.", feedback: "Le collègue ist eine Person, und sans ist die Präposition vor qui." },
        ],
      },
    },
  },
  {
    id: "fr-comparatif",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "Den Komparativ des Adjektivs bilden",
    intro:
      "Mit plus, moins und aussi vergleichst du Personen und Dinge. Das Adjektiv passt sich dabei an das Nomen an, meilleur ersetzt plus bon.",
    paragraphs: [
      "Der Komparativ drückt aus, dass zwei Dinge ungleich oder gleich sind. Du bildest ihn mit **plus … que** (mehr als), **moins … que** (weniger als) und **aussi … que** (so … wie): « Paris est plus grand que Lyon. », « Mon frère est moins sportif que moi. », « Cette pizza est aussi bonne que celle de mon oncle. » Das Adjektiv steht zwischen den beiden Wörtern.",
      "Das Adjektiv gleicht sich an das Wort an, mit dem du etwas vergleichst. Es ändert sich also nicht nach dem zweiten Teil des Vergleichs: « Léa est plus grande que son frère. » (Léa ist feminin, also grande), « Mes parents sont plus patients que moi. » (parents ist männlich Plural, also patients). Nach que kann ein betontes Pronomen stehen: que moi, que toi, que lui, que elle, que nous, que vous, que eux, que elles.",
      "Eine Ausnahme ist das Adjektiv bon. Du sagst nicht plus bon, sondern **meilleur(e)(s)**: « Ce film est meilleur que le livre. », « Mes notes sont meilleures que celles de Paul. » Auch meilleur richtet sich nach dem Nomen: meilleur, meilleure, meilleurs, meilleures. Bei aussi bon und moins bon gibt es dagegen keine Veränderung: « Ces fruits sont moins bons que ceux de l’été. »",
      "Typische Fehler sind « plus bon » (richtig ist meilleur), « plus grand comme » (nach plus steht que) und « plus grande que moi » für einen Jungen (das Adjektiv richtet sich nach dem ersten Vergleichspartner, nicht nach dem Pronomen). Vor einem Vokal wird que zu qu’: « plus grand qu’elle ».",
    ],
    terms: [
      { term: "plus … que", text: "Der Komparativ der Überlegenheit: mehr als. Das Adjektiv steht zwischen plus und que." },
      { term: "aussi … que", text: "Der Komparativ der Gleichheit: so … wie. Das Adjektiv bleibt unverändert zwischen aussi und que." },
      { term: "meilleur(e)(s)", text: "Die Steigerungsform von bon: besser. Sie wird wie ein normales Adjektiv an Geschlecht und Zahl des Nomens angeglichen." },
    ],
    takeaway:
      "Vergleiche bildest du mit plus, moins oder aussi vor dem Adjektiv und que danach. Das Adjektiv richtet sich nach dem ersten Vergleichspartner. Aus plus bon wird meilleur(e)(s). Nach que steht ein betontes Pronomen: que moi, que lui.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Mein Bruder ist größer als ich“?",
      answer: "Mon frère est plus grand que moi.",
      wrong: ["Mon frère est plus grand que je.", "Mon frère est plus grande que moi."],
      explanation:
        "Nach que steht das betonte Pronomen moi, nicht je. Das Adjektiv richtet sich nach mon frère und bleibt deshalb männlich: grand.",
    },
    workshop: {
      kind: "choose",
      title: "Den Komparativ richtig bilden",
      instruction:
        "Achte auf Geschlecht und Zahl des ersten Vergleichspartners und darauf, ob du bon steigern musst.",
      items: [
        { before: "Cette pizza est ", options: ["meilleure", "plus bonne", "plus meilleure"], answer: 0, after: " que celle de la cantine.", feedback: "Bon steigert man nicht mit plus. Die Steigerungsform meilleur wird an das Nomen angeglichen: la pizza ist feminin, also meilleure." },
        { before: "Léa est ", options: ["aussi grande", "aussi grand", "aussi grandes"], answer: 0, after: " que sa mère.", feedback: "Léa ist ein Mädchen, das Adjektiv muss feminin im Singular stehen: grande." },
        { before: "Mes notes sont ", options: ["moins bonnes", "moins bon", "moins bons"], answer: 0, after: " que les notes de Paul.", feedback: "Les notes ist feminin Plural, also bonnes. Bei moins bon gibt es keine Sonderform." },
        { before: "Julien est plus rapide que ", options: ["moi", "je", "me"], answer: 0, after: ".", feedback: "Nach que steht das betonte Pronomen moi, nicht das Subjektpronomen je." },
        { before: "Les glaces de cette boutique sont ", options: ["meilleures", "meilleur", "plus bonnes"], answer: 0, after: " que celles de la boulangerie.", feedback: "Les glaces ist feminin Plural. Die Steigerungsform meilleur wird zu meilleures." },
      ],
      conclusion: "Das Adjektiv richtet sich nach dem ersten Vergleichspartner, bon wird zu meilleur, und nach que steht ein betontes Pronomen.",
    },
    casework: {
      title: "Zwei Smartphones im Test",
      story:
        "Ein Schüler vergleicht in einer Nachricht zwei Geräte: « Mon téléphone est moins cher que celui de Tom, mais l’appareil photo de Tom est meilleur que le mien. »",
      steps: [
        {
          question: "Welcher Vergleich steckt in « moins cher que »?",
          options: ["Ein Vergleich der Unterlegenheit: weniger teuer", "Ein Vergleich der Gleichheit: so teuer wie", "Ein Vergleich der Überlegenheit: teurer als"],
          answer: 0,
          explanation: "Moins … que drückt aus, dass etwas weniger ist. Aussi wäre Gleichheit, plus wäre mehr.",
        },
        {
          question: "Warum steht im zweiten Satz meilleur und nicht plus bon?",
          options: ["Bon wird im Komparativ zu meilleur.", "Plus bon klingt im Französischen zu lang.", "Weil Tom männlich ist und das Nomen folgt."],
          answer: 0,
          explanation: "Bon hat im Komparativ der Überlegenheit die eigene Form meilleur. Plus bon ist ein häufiger Fehler.",
        },
        {
          question: "Wie müsste es heißen, wenn die Kamera von « l’appareil photo » ersetzt wird durch « la caméra »?",
          options: ["la caméra de Tom est meilleure", "la caméra de Tom est meilleur", "la caméra de Tom est plus bonne"],
          answer: 0,
          explanation: "La caméra ist feminin, deshalb meilleure. Plus bonne gibt es nicht.",
        },
      ],
      verdict:
        "Der Schüler vergleicht mit moins … que und der Sonderform meilleur. Bei Geräten und Personen gleichermaßen musst du auf Geschlecht und Zahl achten.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde Vergleichssätze: 1. Paris – Lyon (grand, plus). 2. mon frère – moi (sportif, moins). 3. ce film – ce livre (bon, plus).",
        hints: [
          "Setze das erste Nomen als Subjekt, dann est, den Komparativ, que und den zweiten Vergleichspartner.",
          "Für den dritten Satz brauchst du die Sonderform von bon.",
        ],
        model:
          "1. Paris est plus grand que Lyon. 2. Mon frère est moins sportif que moi. 3. Ce film est meilleur que ce livre. Das Adjektiv steht jeweils männlich im Singular, denn Paris, mon frère und ce film sind männlich. Nach que steht in Satz 2 das betonte Pronomen moi.",
        criteria: [
          "Der Komparativ mit plus oder moins steht zwischen Subjekt und que.",
          "Das Adjektiv ist richtig angeglichen und bon wird zu meilleur.",
          "Nach que steht, wo nötig, ein betontes Pronomen.",
        ],
      },
      2: {
        prompt:
          "Vergleiche in vier bis fünf Sätzen zwei Orte, Personen oder Dinge, die dir wichtig sind (zum Beispiel zwei Städte, zwei Sportarten oder zwei Apps). Verwende plus, moins, aussi und meilleur.",
        hints: [
          "Wähle zwei Dinge, die du gut kennst, und überlege dir drei Eigenschaften.",
          "Achte beim Adjektiv auf Geschlecht und Zahl des ersten Vergleichspartners.",
        ],
        model:
          "J’aime le football et le basket. Le football est plus populaire que le basket en France. Le basket est moins long que le foot, mais il est aussi amusant. Pour moi, la nouvelle salle de sport est meilleure que l’ancienne. Mes amis sont plus sportifs que moi.",
        criteria: [
          "Mindestens ein Komparativ mit plus, einer mit moins und einer mit aussi.",
          "Meilleur(e)(s) statt plus bon, richtig angeglichen.",
          "Das Adjektiv richtet sich nach dem ersten Vergleichspartner.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Komparativ: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Mon frère est ", options: ["plus grand", "plus grande"], answer: 0, after: " que moi.", feedback: "Mon frère ist männlich, das Adjektiv bleibt grand." },
          { before: "Ma sœur est ", options: ["plus grande", "plus grand"], answer: 0, after: " que moi.", feedback: "Ma sœur ist feminin, das Adjektiv wird zu grande." },
          { before: "Cette glace est ", options: ["meilleure", "meilleur"], answer: 0, after: " que l’autre.", feedback: "Cette glace ist feminin, also meilleure." },
          { before: "Ce film est ", options: ["meilleur", "plus bon"], answer: 0, after: " que le livre.", feedback: "Bon wird im Komparativ zu meilleur, plus bon ist falsch." },
          { before: "Léa est aussi ", options: ["sympa", "sympas"], answer: 0, after: " que Clara.", feedback: "Das Adjektiv sympa bleibt unverändert im Singular: aussi sympa." },
          { before: "Tom court plus vite que ", options: ["moi", "je"], answer: 0, after: ".", feedback: "Nach que steht das betonte Pronomen moi." },
          { before: "Mes notes sont ", options: ["meilleures", "meilleur"], answer: 0, after: " que celles de Paul.", feedback: "Mes notes ist feminin Plural, also meilleures." },
          { before: "Paris est moins ", options: ["calme", "calmes"], answer: 0, after: " que mon village.", feedback: "Paris ist Singular, das Adjektiv calme bleibt im Singular." },
        ],
        2: [
          { before: "Cette année, les vacances de mes cousins étaient ", options: ["plus longues", "plus long", "plus longs"], answer: 0, after: " que les nôtres.", feedback: "Les vacances ist feminin Plural, also longues." },
          { before: "Ces chaussures sont ", options: ["meilleures", "plus bonnes", "meilleur"], answer: 0, after: " pour courir que mes vieilles baskets.", feedback: "Chaussures ist feminin Plural und bon wird zu meilleur: meilleures." },
          { before: "Le train est ", options: ["aussi rapide", "aussi rapides", "aussi rapidement"], answer: 0, after: " que l’avion pour aller de Strasbourg à Paris.", feedback: "Le train ist Singular, das Adjektiv rapide bleibt im Singular und wird nicht zum Adverb." },
          { before: "Mes grands-parents sont ", options: ["plus patients", "plus patient", "plus patiente"], answer: 0, after: " que mes parents, car ils ont plus de temps.", feedback: "Mes grands-parents ist männlich Plural, also patients." },
          { before: "Pour la cuisine, ma tante est ", options: ["meilleure", "meilleur", "plus bonne"], answer: 0, after: " que moi et que mes frères.", feedback: "Ma tante ist feminin, deshalb meilleure." },
          { before: "Cet exercice est ", options: ["moins difficile", "moins difficiles", "moins difficilement"], answer: 0, after: " que celui de la semaine dernière.", feedback: "Cet exercice ist Singular, das Adjektiv difficile bleibt im Singular." },
          { before: "Dans ma nouvelle classe, les élèves sont souvent ", options: ["plus calmes", "plus calme", "plus calmement"], answer: 0, after: " que dans mon ancienne classe.", feedback: "Les élèves ist Plural, also calmes. Das Adverb calmement passt nicht zu être." },
          { before: "Mon vélo est ", options: ["plus léger", "plus légère", "plus légers"], answer: 0, after: " que le vélo de mon père, mais il est moins solide.", feedback: "Mon vélo ist männlich Singular, deshalb léger." },
        ],
      },
    },
  },
  {
    id: "fr-superlatif",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "Den Superlativ des Adjektivs bilden",
    intro:
      "Mit le plus und le moins sagst du, wer oder was am größten, schönsten oder besten ist. Der Artikel und das Adjektiv passen sich an.",
    paragraphs: [
      "Der Superlativ besteht aus dem bestimmten Artikel, plus oder moins und dem Adjektiv: « C’est le plus grand garçon de la classe. », « Elle est la moins timide de ses amies. » Der Artikel richtet sich nach dem Nomen: le, la oder les. Das Adjektiv wird, wie immer, an Geschlecht und Zahl des Nomens angeglichen: « les plus petites villes ».",
      "Steht das Adjektiv nach dem Nomen, wiederholst du den Artikel: « le garçon le plus sympa », « la ville la plus intéressante ». Steht es vor dem Nomen (zum Beispiel grand, petit, beau, bon, jeune), kommt der Artikel nur einmal: « la plus belle ville », « le plus grand garçon ». Das gilt in der Regel für kurze, häufige Adjektive. Bei den anderen setzt du den Artikel zweimal.",
      "Den Bereich, in dem verglichen wird, schließt du mit **de** an: « le plus grand de la classe », « la plus belle ville de France », « le meilleur joueur du monde » (de + le = du), « les plus connus des musées » (de + les = des). Im Deutschen sagst du „der Klasse“ oder „in der Klasse“. Im Französischen steht dafür de und der bestimmte Artikel.",
      "Für bon gibt es wieder die eigene Form: **le meilleur, la meilleure, les meilleurs, les meilleures** (nie le plus bon). Typische Fehler sind « la ville plus belle de France » (Artikel fehlt: la plus belle ville oder la ville la plus belle) und « le plus grand en la classe » (richtig: de la classe).",
    ],
    terms: [
      { term: "le plus / le moins", text: "Der Superlativ der Überlegenheit und der Unterlegenheit: am meisten, am wenigsten. Der Artikel richtet sich nach dem Nomen." },
      { term: "le meilleur", text: "Der Superlativ von bon: der beste. Er wird an Geschlecht und Zahl des Nomens angeglichen: la meilleure, les meilleurs." },
      { term: "de + Gebiet", text: "Wenn du den Bereich nennst, in dem verglichen wird, schließt du ihn mit de an: de la classe, du monde, de France." },
    ],
    takeaway:
      "Superlativ = Artikel + plus oder moins + Adjektiv, danach de + Bereich. Steht das Adjektiv nach dem Nomen, wiederholst du den Artikel. Aus le plus bon wird le meilleur.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Das ist die schönste Stadt Frankreichs“?",
      answer: "C’est la plus belle ville de France.",
      wrong: ["C’est la ville plus belle de France.", "C’est la plus belle ville en France."],
      explanation:
        "Der Artikel muss vor plus stehen: la plus belle ville. Den Bereich schließt du mit de an, nicht mit en: de France.",
    },
    workshop: {
      kind: "choose",
      title: "Den Superlativ richtig bilden",
      instruction:
        "Achte auf den Artikel, auf die Stellung des Adjektivs und auf den Anschluss des Bereichs.",
      items: [
        { before: "Léa est ", options: ["la plus sportive", "plus sportive", "la sportive plus"], answer: 0, after: " de la classe.", feedback: "Der Superlativ braucht den bestimmten Artikel vor plus. Léa ist feminin, also la plus sportive." },
        { before: "C’est le ", options: ["meilleur", "plus bon", "plus meilleur"], answer: 0, after: " restaurant du quartier.", feedback: "Bon steigert man im Superlativ mit meilleur. Le plus bon gibt es nicht." },
        { before: "Voilà la ville ", options: ["la plus intéressante", "la intéressante plus", "plus intéressante"], answer: 0, after: " de la région.", feedback: "Intéressante steht nach dem Nomen, deshalb wird der Artikel wiederholt: la ville la plus intéressante." },
        { before: "Ce sont les ", options: ["plus grandes", "plus grands", "plus grande"], answer: 0, after: " villes de France.", feedback: "Villes ist feminin Plural, das Adjektiv wird zu grandes." },
        { before: "C’est le joueur le plus connu ", options: ["du", "dans le", "en"], answer: 0, after: " monde.", feedback: "Der Bereich wird mit de angeschlossen. De + le wird zu du: du monde." },
      ],
      conclusion: "Artikel, plus oder moins und Adjektiv gehören zusammen. Der Bereich folgt mit de, und bon wird zu meilleur.",
    },
    casework: {
      title: "Die Schulumfrage",
      story:
        "Im Schülerblog steht: « Qui est le plus sympa de la classe? Pour la majorité, c’est Hugo. La plus drôle est Chloé. Et le cours le plus intéressant, c’est l’informatique. »",
      steps: [
        {
          question: "Warum steht « le plus sympa » mit le?",
          options: ["Hugo ist männlich, der Artikel richtet sich nach ihm.", "Sympa braucht in diesem Satz immer den Artikel le.", "Der Artikel steht hier nur zufällig im Singular."],
          answer: 0,
          explanation: "Der Artikel richtet sich nach dem Nomen oder der Person, hier also nach Hugo (männlich).",
        },
        {
          question: "Warum steht « la plus drôle » mit la?",
          options: ["Chloé ist ein Mädchen, daher la.", "Drôle ist ein feminines Adjektiv, deshalb la.", "Plus verlangt immer den Artikel la."],
          answer: 0,
          explanation: "Nur das Geschlecht der Person entscheidet. Das Adjektiv drôle hat in beiden Geschlechtern dieselbe Form.",
        },
        {
          question: "Warum wird in « le cours le plus intéressant » der Artikel zweimal gesetzt?",
          options: ["Das Adjektiv steht nach dem Nomen.", "Weil cours männlich ist, braucht es zwei Artikel.", "Weil der Satz sonst zu kurz wäre."],
          answer: 0,
          explanation: "Steht das Adjektiv nach dem Nomen, wiederholst du den Artikel: le cours le plus intéressant.",
        },
      ],
      verdict:
        "Der Blogbeitrag zeigt drei Muster des Superlativs: Artikel nach dem Geschlecht der Person, de + Bereich und der doppelte Artikel bei nachgestelltem Adjektiv.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde Sätze mit dem Superlativ: 1. Paris – grande ville de France. 2. mon frère – sportif de la famille. 3. cette pizza – bonne du restaurant.",
        hints: [
          "Setze den Artikel vor plus und das Adjektiv danach.",
          "Beim dritten Satz musst du die Sonderform von bon verwenden.",
        ],
        model:
          "1. Paris est la plus grande ville de France. 2. Mon frère est le plus sportif de la famille. 3. Cette pizza est la meilleure du restaurant. Der Bereich ist jeweils mit de angeschlossen (de France, de la famille, du restaurant). In Satz 3 ist bon zu meilleure geworden.",
        criteria: [
          "Artikel, plus und Adjektiv stehen in der richtigen Reihenfolge.",
          "Der Bereich ist mit de, du oder de la angeschlossen.",
          "Aus bon wird meilleur und es ist richtig angeglichen.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über deine Klasse oder deine Stadt mit Superlativen (zum Beispiel der größte Park, der beste Eisladen, die netteste Person). Nutze mindestens einmal meilleur und einmal einen doppelten Artikel.",
        hints: [
          "Beginne mit « Dans ma classe, … » oder « À Munich, … ».",
          "Für den doppelten Artikel brauchst du ein Adjektiv nach dem Nomen, zum Beispiel sympa oder intéressant.",
        ],
        model:
          "Dans ma classe, Lina est la plus drôle. Elle est aussi la meilleure en maths. Notre professeur est le prof le plus sympa de l’école. Et le cours le plus intéressant, c’est le sport. Pour moi, la cantine de mon ancienne école était la meilleure de la ville.",
        criteria: [
          "Mindestens ein Superlativ mit meilleur und ein doppelter Artikel.",
          "Der Artikel richtet sich nach dem Nomen oder der Person.",
          "Der Bereich ist mit de, du oder de la angeschlossen.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Superlativ: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "C’est ", options: ["le plus grand", "plus grand"], answer: 0, after: " garçon.", feedback: "Der Superlativ braucht den Artikel: le plus grand." },
          { before: "Elle est ", options: ["la plus drôle", "le plus drôle"], answer: 0, after: " de la classe.", feedback: "Das Subjekt ist feminin, also la plus drôle." },
          { before: "Voilà ", options: ["la meilleure", "la plus bonne"], answer: 0, after: " pizza.", feedback: "Bon wird im Superlativ zu meilleur." },
          { before: "Ce sont ", options: ["les plus petits", "les plus petites"], answer: 0, after: " élèves.", feedback: "Élèves ist männlich Plural, also petits." },
          { before: "Il est le plus rapide ", options: ["de", "dans"], answer: 0, after: " la classe.", feedback: "Der Bereich wird mit de angeschlossen: de la classe." },
          { before: "C’est la voiture ", options: ["la moins chère", "la moins cher"], answer: 0, after: ".", feedback: "Das Adjektiv steht nach dem Nomen, der Artikel wird wiederholt, und es richtet sich nach voiture: chère." },
          { before: "C’est la ville la ", options: ["plus belle", "belle plus"], answer: 0, after: " de la région.", feedback: "Nach dem Artikel kommt plus, dann das Adjektiv: la plus belle." },
          { before: "Voilà le ", options: ["meilleur", "plus bon"], answer: 0, after: " joueur de l’équipe.", feedback: "Der Superlativ von bon heißt le meilleur." },
        ],
        2: [
          { before: "Ma grand-mère fait ", options: ["les meilleurs", "les plus bons", "les meilleures"], answer: 0, after: " gâteaux du monde, et toute la famille est d’accord.", feedback: "Gâteaux ist männlich Plural, bon wird zu meilleurs." },
          { before: "Mon frère et moi, nous avons choisi le film ", options: ["le plus drôle", "le plus drôles", "plus drôle"], answer: 0, after: " du festival pour cette soirée.", feedback: "Film ist männlich Singular und das Adjektiv steht nach dem Nomen, deshalb wird der Artikel wiederholt: le film le plus drôle." },
          { before: "Voilà la maison ", options: ["la plus ancienne", "la plus anciennes", "plus ancienne"], answer: 0, after: " du village, elle date du douzième siècle.", feedback: "Maison ist feminin Singular. Das Adjektiv steht nach dem Nomen, der Artikel wird wiederholt." },
          { before: "Les élèves ", options: ["les plus sportifs", "les plus sportive", "plus sportifs"], answer: 0, after: " de l’école participent à la course de samedi.", feedback: "Les élèves ist männlich Plural und das Adjektiv steht nach dem Nomen: les élèves les plus sportifs." },
          { before: "C’est ", options: ["la plus grande", "la plus grand", "le plus grande"], answer: 0, after: " ville de la région, et elle attire beaucoup de touristes.", feedback: "Ville ist feminin, das Adjektiv wird zu grande, der Artikel zu la." },
          { before: "Pour moi, le chocolat est le dessert ", options: ["le moins sain", "le moins saine", "moins sain"], answer: 0, after: " du menu, mais aussi le meilleur.", feedback: "Dessert ist männlich Singular und das Adjektiv steht nach dem Nomen. Der Artikel wird wiederholt: le moins sain." },
          { before: "Ma sœur est ", options: ["la plus jeune", "le plus jeune", "la plus jeunes"], answer: 0, after: " de la famille, mais elle est déjà la plus grande.", feedback: "Ma sœur ist feminin, also la plus jeune." },
          { before: "Les musées parisiens sont ", options: ["parmi les meilleurs", "parmi les meilleures", "parmi le meilleur"], answer: 0, after: " du monde pour les enfants, selon beaucoup de familles.", feedback: "Les musées ist männlich Plural, bon wird zu meilleurs." },
        ],
      },
    },
  },
  {
    id: "fr-negation-personne-rien",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "personne ne und rien ne: Verneinung des Subjekts",
    intro:
      "Mit personne und rien kannst du auch das Subjekt verneinen. Dann steht die Verneinung vor dem Verb und das Verb bleibt im Singular.",
    paragraphs: [
      "Du kennst die Verneinung mit **ne … personne** und **ne … rien**, wenn das Wort das Objekt ist: « Je ne vois personne. », « Je ne mange rien. » Das Verneinungswort steht dann nach dem Verb. Im passé composé steht rien zwischen Hilfsverb und Partizip, personne dagegen hinter dem Partizip: « Je n’ai rien mangé. », « Je n’ai vu personne. »",
      "Neu ist nun die Verneinung, bei der personne oder rien das **Subjekt** ist: « Personne ne répond. » (Niemand antwortet.), « Rien ne marche. » (Nichts funktioniert.), « Personne n’est venu. », « Rien n’est arrivé. » Das Verneinungswort steht am Satzanfang, dann folgt ne (vor einem Vokal n’) und das Verb. Das Verb steht immer in der 3. Person Singular.",
      "Anders als im Deutschen steht ne in diesem Satz trotzdem, auch wenn personne oder rien schon verneinen. Dagegen darfst du pas nicht zusätzlich setzen: « Personne ne répond pas » ist falsch. Und ne gehört vor das Verb, nie vor personne: « Ne personne répond » gibt es nicht.",
      "Als kurze Antworten stehen personne und rien allein, also ohne ne: « Qui est venu? – Personne. », « Qu’est-ce que tu fais? – Rien. » Typische Fehler sind « Personne répond » (ne fehlt) und « Rien ne marchent » (das Verb steht im Singular: Rien ne marche).",
    ],
    terms: [
      { term: "personne ne", text: "Die Verneinung mit personne als Subjekt: niemand. Danach folgt ne und das Verb im Singular." },
      { term: "rien ne", text: "Die Verneinung mit rien als Subjekt: nichts. Danach folgt ne und das Verb im Singular." },
      { term: "ne … personne, ne … rien", text: "Verneinung des Objekts: personne und rien stehen nach dem Verb, im passé composé rien vor dem Partizip und personne danach." },
    ],
    takeaway:
      "Ist personne oder rien Subjekt, steht es am Satzanfang, danach folgen ne und das Verb in der 3. Person Singular. Pas kommt nie dazu. Als Objekt stehen personne und rien nach dem Verb, im passé composé rien vor dem Partizip.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Niemand hat angerufen“?",
      answer: "Personne n’a téléphoné.",
      wrong: ["Personne n’a pas téléphoné.", "Ne personne a téléphoné."],
      explanation:
        "Personne ist Subjekt und steht am Satzanfang, danach folgt ne vor dem Verb. Ein zusätzliches pas ist falsch, und ne darf nicht vor personne stehen.",
    },
    workshop: {
      kind: "choose",
      title: "Die richtige Verneinung wählen",
      instruction:
        "Prüfe, ob personne oder rien das Subjekt ist oder das Objekt, und achte auf ne.",
      items: [
        { before: "", options: ["Personne ne", "Personne"], answer: 0, after: " répond au téléphone.", feedback: "Personne ist Subjekt. Danach folgt ne vor dem Verb: Personne ne répond." },
        { before: "Je ", options: ["ne vois rien", "vois rien ne"], answer: 0, after: " dans le brouillard.", feedback: "Rien ist hier Objekt und steht nach dem Verb. Ne steht vor dem Verb." },
        { before: "", options: ["Rien ne marche", "Rien marche"], answer: 0, after: " aujourd’hui, mon ordinateur est cassé.", feedback: "Rien ist Subjekt. Ne steht vor dem Verb, und das Verb steht im Singular." },
        { before: "Hier, je ", options: ["n’ai vu personne", "n’ai personne vu"], answer: 0, after: " au parc.", feedback: "Im passé composé steht personne nach dem Partizip, das Partizip steht direkt hinter dem Hilfsverb." },
        { before: "Au match, ", options: ["personne n’est venu", "personne est pas venu"], answer: 0, after: " pour nous soutenir.", feedback: "Personne ist Subjekt, ne wird vor einem Vokal zu n’, und pas fehlt." },
      ],
      conclusion: "Subjekt: personne oder rien am Satzanfang, danach ne und das Verb im Singular. Objekt: nach dem Verb, im passé composé rien vor dem Partizip.",
    },
    casework: {
      title: "Ein ruhiger Tag im Lager",
      story:
        "Eine Betreuerin schreibt am Abend ins Tagebuch: « Personne ne s’est plaint aujourd’hui. Rien n’a mal tourné. Je n’ai entendu personne crier, et je n’ai rien perdu. »",
      steps: [
        {
          question: "Was ist in « Personne ne s’est plaint » das Subjekt?",
          options: ["Personne", "Plaint", "Se plaindre"],
          answer: 0,
          explanation: "Personne steht am Satzanfang und ist Subjekt. Ne gehört zur Verneinung, plaint ist das Partizip.",
        },
        {
          question: "Warum steht in « Rien n’a mal tourné » kein pas?",
          options: ["Rien ne verneint schon, pas wäre doppelt.", "Weil das Verb im passé composé steht.", "Weil das Subjekt im Plural steht."],
          answer: 0,
          explanation: "Rien ne verneint allein. Ein zusätzliches pas gibt es nicht.",
        },
        {
          question: "Warum steht « personne » in « Je n’ai entendu personne » nach dem Partizip?",
          options: ["Als Objekt steht personne nach dem Partizip.", "Es ist Subjekt und steht deshalb immer am Ende des Satzes.", "Weil rien und personne immer gleich stehen müssen."],
          answer: 0,
          explanation: "Als Objekt steht personne im passé composé nach dem Partizip, rien dagegen davor.",
        },
      ],
      verdict:
        "Die Betreuerin verwendet personne ne und rien ne als Subjekte und ne … personne und ne … rien als Objekte. Das Verb steht beim Subjekt im Singular, pas fehlt.",
    },
    tasks: {
      1: {
        prompt:
          "Verneine die Sätze mit personne oder rien: 1. Quelqu’un répond au téléphone. 2. Je mange quelque chose. 3. Tout marche bien aujourd’hui.",
        hints: [
          "Überlege, ob das Wort im Satz Subjekt oder Objekt ist.",
          "Beim Subjekt stehen personne oder rien am Anfang und ne vor dem Verb.",
        ],
        model:
          "1. Personne ne répond au téléphone. 2. Je ne mange rien. 3. Rien ne marche aujourd’hui. In Satz 1 und 3 sind quelqu’un und tout Subjekte, deshalb personne ne und rien ne. In Satz 2 ist quelque chose Objekt, deshalb ne … rien nach dem Verb.",
        criteria: [
          "Das Subjekt wird mit personne ne oder rien ne verneint.",
          "Das Objekt wird mit ne … rien verneint.",
          "Es steht kein zusätzliches pas.",
        ],
      },
      2: {
        prompt:
          "Du bist in einem Ferienlager und alles geht schief. Schreibe vier bis fünf Sätze, in denen du beschreibst, dass niemand etwas tut und nichts klappt. Nutze personne ne, rien ne, ne … rien und ne … personne.",
        hints: [
          "Beginne mit « Aujourd’hui, personne ne … ».",
          "Im passé composé setzt du rien vor das Partizip und personne danach.",
        ],
        model:
          "Aujourd’hui, tout va mal au camp. Personne ne veut cuisiner, et rien ne marche dans la cuisine. Je n’ai rien mangé depuis ce matin. Je n’ai vu personne dans le jardin, parce que personne n’est sorti. Rien n’est facile ici.",
        criteria: [
          "Je ein Satz mit personne ne und rien ne ohne pas.",
          "ne … rien und ne … personne stehen richtig, auch im passé composé.",
          "Das Verb steht beim Subjekt personne oder rien im Singular.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "personne ne und rien ne: Übungsrunde",
      instruction:
        "Wähle die richtige Verneinung. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "", options: ["Personne ne", "Personne"], answer: 0, after: " vient à la fête.", feedback: "Personne ist Subjekt, danach folgt ne vor dem Verb." },
          { before: "", options: ["Rien ne", "Rien"], answer: 0, after: " marche ici.", feedback: "Rien ist Subjekt, danach folgt ne vor dem Verb." },
          { before: "Je ne vois ", options: ["personne", "rien"], answer: 0, after: " dans la rue.", feedback: "In der Rue stehen Personen, also personne." },
          { before: "Il ne mange ", options: ["rien", "personne"], answer: 0, after: " ce matin.", feedback: "Man isst etwas, nicht jemanden: rien." },
          { before: "Personne ", options: ["ne répond", "ne répondent"], answer: 0, after: " au téléphone.", feedback: "Das Verb steht nach personne im Singular." },
          { before: "Rien ", options: ["ne bouge", "ne bougent"], answer: 0, after: " dans la maison.", feedback: "Das Verb steht nach rien im Singular." },
          { before: "Rien ", options: ["ne va", "ne vont"], answer: 0, after: " bien ce matin.", feedback: "Das Verb steht nach rien im Singular." },
          { before: "Je n’ai ", options: ["rien mangé", "mangé rien"], answer: 0, after: " hier.", feedback: "Im passé composé steht rien vor dem Partizip." },
        ],
        2: [
          { before: "Au cinéma, ", options: ["personne n’a ri", "personne a ri", "personne n’ont ri"], answer: 0, after: " pendant le film, car il était vraiment trop sérieux.", feedback: "Personne ist Subjekt, ne wird zu n’ und das Verb steht im Singular." },
          { before: "Dans le bus, je ", options: ["n’ai parlé à personne", "n’ai personne parlé à", "ne personne ai parlé à"], answer: 0, after: " parce que j’étais très fatigué.", feedback: "Personne steht im passé composé nach dem Partizip und nach der Präposition." },
          { before: "", options: ["Rien n’est arrivé", "Rien est arrivé", "Rien ne sont arrivés"], answer: 0, after: " pendant que nous attendions devant la gare.", feedback: "Rien ist Subjekt, ne wird zu n’ und das Verb steht im Singular." },
          { before: "Malheureusement, ", options: ["personne ne sait", "personne sait pas", "personne ne savent"], answer: 0, after: " où se trouve la clé de la salle de classe.", feedback: "Personne ne verlangt das Verb im Singular. Ein pas wäre falsch." },
          { before: "Après le test, je ", options: ["n’ai rien compris", "n’ai compris rien", "ne rien ai compris"], answer: 0, after: " et mes amis non plus.", feedback: "Im passé composé steht rien zwischen Hilfsverb und Partizip." },
          { before: "Dans cette ville, ", options: ["rien ne ferme", "rien ferme", "rien ne ferment"], answer: 0, after: " avant minuit, c’est génial pour les touristes.", feedback: "Rien ist Subjekt, ne steht vor dem Verb und das Verb steht im Singular." },
          { before: "Je ", options: ["n’ai invité personne", "n’ai personne invité", "n’ai pas personne invité"], answer: 0, after: " à ma fête, car je veux rester seul ce soir.", feedback: "Personne steht im passé composé nach dem Partizip und es kommt kein pas dazu." },
          { before: "Au bureau, ", options: ["personne ne m’a répondu", "personne m’a répondu", "personne ne m’a pas répondu"], answer: 0, after: " quand j’ai demandé mon chemin.", feedback: "Personne ne verneint allein, und das Pronomen m’ steht vor dem Hilfsverb." },
        ],
      },
    },
  },
  {
    id: "fr-pays",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "Der Artikel bei Ländernamen",
    intro:
      "Ob du en, au oder aux sagst, hängt vom Geschlecht des Landes ab. Für die Herkunft brauchst du de, du oder des.",
    paragraphs: [
      "Ländernamen haben im Französischen immer einen Artikel und ein Geschlecht: **la France**, **l’Italie**, **le Portugal**, **le Canada**, **les États-Unis**. Die meisten Länder auf -e sind feminin (la Suisse, l’Espagne, l’Allemagne). Ausnahmen sind le Mexique und le Cambodge. Länder ohne -e am Ende sind meist maskulin (le Maroc, le Japon, le Danemark).",
      "Für „in“ und „nach“ nimmst du bei femininen Ländern **en**: « en France », « en Suisse », « en Italie ». Bei maskulinen Ländern mit Konsonant am Anfang steht **au** (à + le): « au Portugal », « au Maroc », « au Canada ». Bei Ländern im Plural nimmst du **aux** (à + les): « aux États-Unis », « aux Pays-Bas ». Männliche Länder mit Vokal am Anfang bekommen en: « en Iran », « en Israël ».",
      "Für die Herkunft („aus“) gilt das gespiegelt: feminin und vor Vokal steht **de** oder **d’**: « de France », « d’Italie », « d’Iran ». Maskulin mit Konsonant steht **du**: « du Portugal », « du Maroc ». Plural steht **des**: « des États-Unis ». Städte haben keinen Artikel und brauchen à und de: « à Paris », « de Paris ».",
      "Typische Fehler sind « à France » (richtig: en France), « en Portugal » (richtig: au Portugal) und « de les États-Unis » (richtig: des États-Unis). Wer sich unsicher ist, fragt zuerst nach dem Geschlecht und dem Anfangsbuchstaben des Landes.",
    ],
    terms: [
      { term: "en", text: "Steht für „in“ oder „nach“ bei femininen Ländern und bei Ländern mit Vokal am Anfang: en France, en Iran." },
      { term: "au, aux", text: "Stehen für „in“ oder „nach“ bei maskulinen Ländern mit Konsonant (au Portugal) und bei Ländern im Plural (aux États-Unis)." },
      { term: "de, du, des", text: "Stehen für „aus“: de oder d’ bei femininen Ländern und Vokalen, du bei maskulinen Ländern, des bei Plural." },
    ],
    takeaway:
      "In oder nach: en bei femininen und vokalischen Ländern, au bei männlichen, aux bei Plural. Aus: de oder d’, du, des. Städte brauchen à und de ohne Artikel.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Ich fahre nach Portugal“?",
      answer: "Je vais au Portugal.",
      wrong: ["Je vais en Portugal.", "Je vais à Portugal."],
      explanation:
        "Le Portugal ist maskulin und beginnt mit einem Konsonanten, deshalb au (à + le). En steht nur bei femininen Ländern oder bei Vokal am Anfang.",
    },
    workshop: {
      kind: "choose",
      title: "en, au oder aux?",
      instruction:
        "Frage dich zuerst nach dem Geschlecht und dem Anfangsbuchstaben des Landes, dann wähle die Form.",
      items: [
        { before: "Nous passons les vacances ", options: ["en", "au", "aux"], answer: 0, after: " Espagne.", feedback: "L’Espagne ist feminin, deshalb en." },
        { before: "Mon oncle habite ", options: ["au", "en", "aux"], answer: 0, after: " Canada.", feedback: "Le Canada ist maskulin und beginnt mit einem Konsonanten, deshalb au." },
        { before: "Ils voyagent ", options: ["aux", "en", "au"], answer: 0, after: " États-Unis.", feedback: "Les États-Unis steht im Plural, deshalb aux." },
        { before: "Elle vient ", options: ["d’", "de la", "du"], answer: 0, after: "Italie.", feedback: "L’Italie ist feminin und beginnt mit einem Vokal. Für die Herkunft steht d’." },
        { before: "Ce garçon vient ", options: ["du", "de", "des"], answer: 0, after: " Maroc.", feedback: "Le Maroc ist maskulin, für die Herkunft steht du (de + le)." },
      ],
      conclusion: "en für feminin und Vokal, au für maskulin, aux für Plural. Für die Herkunft de oder d’, du und des.",
    },
    casework: {
      title: "Postkarten aus aller Welt",
      story:
        "In der Klasse hängen Postkarten: « Salut! Je suis en Suisse. » – « Bonjour de Lisbonne! Je suis au Portugal. » – « Nous venons des Pays-Bas et nous passons une semaine en France. »",
      steps: [
        {
          question: "Warum heißt es « en Suisse »?",
          options: ["La Suisse ist feminin.", "La Suisse beginnt mit einem Konsonanten und ist maskulin.", "La Suisse steht im Plural."],
          answer: 0,
          explanation: "Länder auf -e sind meistens feminin, und feminine Länder verlangen en.",
        },
        {
          question: "Warum heißt es « au Portugal »?",
          options: ["Le Portugal ist maskulin, Konsonant am Anfang.", "Au steht bei allen Ländern in Europa.", "Le Portugal ist feminin, deshalb steht au."],
          answer: 0,
          explanation: "Bei maskulinen Ländern mit Konsonant am Anfang steht au (à + le).",
        },
        {
          question: "Warum heißt es « des Pays-Bas »?",
          options: ["Plural: für die Herkunft steht des.", "Les Pays-Bas besteht aus zwei Wörtern, deshalb des.", "Des steht nach jedem Nomen im Plural."],
          answer: 0,
          explanation: "Für die Herkunft stehen im Plural des, im Femininum de oder d’ und im Maskulinum du.",
        },
      ],
      verdict:
        "Die Postkarten zeigen das Muster: Geschlecht und Zahl des Landes bestimmen en, au, aux und die Herkunftsformen de, du, des.",
    },
    tasks: {
      1: {
        prompt:
          "Ergänze mit en, au, aux oder de, du, des: 1. Je vais … Allemagne. 2. Tu habites … Pays-Bas. 3. Ils viennent … Japon.",
        hints: [
          "Bestimme zuerst Geschlecht und Zahl des Landes.",
          "Bei „aus“ nimmst du de oder d’, du oder des.",
        ],
        model:
          "1. Je vais en Allemagne. 2. Tu habites aux Pays-Bas. 3. Ils viennent du Japon. L’Allemagne ist feminin (en), les Pays-Bas ist Plural (aux), und le Japon ist maskulin. Für die Herkunft steht deshalb du.",
        criteria: [
          "Feminine Länder bekommen en, maskuline au, Plural aux.",
          "Die Herkunft wird mit de, du oder des angegeben.",
          "Das Geschlecht des Landes ist richtig bestimmt.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über eine Reise in drei Länder. Sage, wohin du fährst und woher du jemanden mitbringst oder kennst. Nutze mindestens en, au, aux und eine Herkunftsform.",
        hints: [
          "Beginne mit « Cet été, je vais … ».",
          "Für die Herkunft: « Mon ami vient … ».",
        ],
        model:
          "Cet été, je vais en Italie avec ma famille. Ensuite, nous allons au Portugal chez des amis. Notre voyage finit aux États-Unis, chez ma tante. Mon ami Luca vient d’Italie, et sa copine vient du Maroc. Nous avons des amis des Pays-Bas.",
        criteria: [
          "en, au und aux werden je mindestens einmal richtig verwendet.",
          "Mindestens eine Herkunftsform (de, du, des) ist richtig.",
          "Die Reise ist verständlich beschrieben.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Länder und Artikel: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je vais ", options: ["en", "au"], answer: 0, after: " France.", feedback: "La France ist feminin, also en." },
          { before: "Il habite ", options: ["au", "en"], answer: 0, after: " Maroc.", feedback: "Le Maroc ist maskulin und beginnt mit einem Konsonanten, also au." },
          { before: "Nous allons ", options: ["aux", "au"], answer: 0, after: " États-Unis.", feedback: "Les États-Unis steht im Plural, also aux." },
          { before: "Elle vient ", options: ["de", "du"], answer: 0, after: " Suisse.", feedback: "La Suisse ist feminin, also de." },
          { before: "Tu travailles ", options: ["en", "au"], answer: 0, after: " Allemagne.", feedback: "L’Allemagne ist feminin, also en." },
          { before: "Il vient ", options: ["du", "de"], answer: 0, after: " Canada.", feedback: "Le Canada ist maskulin, also du." },
          { before: "Nous habitons ", options: ["en", "au"], answer: 0, after: " Italie.", feedback: "L’Italie ist feminin, also en." },
          { before: "Ils viennent ", options: ["des", "du"], answer: 0, after: " Pays-Bas.", feedback: "Les Pays-Bas steht im Plural, also des." },
        ],
        2: [
          { before: "Pour les vacances d’été, mes amis ont choisi d’aller ", options: ["au", "en", "aux"], answer: 0, after: " Portugal parce qu’il fait très chaud en juillet.", feedback: "Le Portugal ist maskulin und beginnt mit einem Konsonanten, also au." },
          { before: "Mon correspondant vient ", options: ["du", "de", "des"], answer: 0, after: " Danemark, mais il parle très bien allemand.", feedback: "Le Danemark ist maskulin und beginnt mit einem Konsonanten, für die Herkunft steht du." },
          { before: "Après un stage de trois semaines, elle est rentrée ", options: ["d’", "de la", "du"], answer: 0, after: "Angleterre avec beaucoup de souvenirs.", feedback: "L’Angleterre ist feminin und beginnt mit einem Vokal, also d’." },
          { before: "Beaucoup de touristes voyagent ", options: ["aux", "au", "en"], answer: 0, after: " États-Unis pour visiter les parcs nationaux.", feedback: "Les États-Unis steht im Plural, also aux." },
          { before: "Cet été, nous allons passer deux semaines ", options: ["en", "au", "aux"], answer: 0, after: " Espagne, près de la mer.", feedback: "L’Espagne ist feminin, also en." },
          { before: "Mon voisin est né ", options: ["en", "au", "aux"], answer: 0, after: " Iran, mais il habite en Allemagne depuis longtemps.", feedback: "Der Iran ist maskulin, beginnt aber mit einem Vokal, deshalb en." },
          { before: "Ces spécialités viennent ", options: ["du", "de", "des"], answer: 0, after: " Maroc et sont très populaires en France.", feedback: "Le Maroc ist maskulin, also du." },
          { before: "Cette étudiante arrive ", options: ["de", "du", "des"], answer: 0, after: " Suisse pour passer un semestre à Strasbourg.", feedback: "La Suisse ist feminin, also de." },
        ],
      },
    },
  },
];
