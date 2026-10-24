import type { Lesson } from "../model/types";

/**
 * Stufe 3, erster Teil: Wortschatz (Kompetenzerwartungen 1.2.1.1 bis 1.2.1.6): Themenwortschatz zu
 * Reisen und Berufswelt, eigene Interessen, unpersönliche Ausdrücke, Meinungen und Gefühle sowie
 * zeitliche Bezüge.
 */
export const S3A: Lesson[] = [
  {
    id: "fr-wortschatz-reisen-beruf",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.1", "1.2.1.2"],
    title: "Wortschatz: Reisen, Praktikum und Bewerbung",
    intro:
      "Mit dem Wortschatz zu Reise, Praktikum und Bewerbung kommst du in Alltagssituationen zurecht und nutzt bekannte Wörter in neuen Zusammenhängen.",
    paragraphs: [
      "**Reisen:** un billet (Fahrkarte, Ticket), une gare (Bahnhof), un aéroport, un vol (Flug), un horaire (Fahrplan), un retard (Verspätung), une correspondance (Anschluss), une valise (Koffer), réserver une chambre (ein Zimmer buchen), un séjour (Aufenthalt), une auberge de jeunesse (Jugendherberge), le départ, l’arrivée. Nützliche Sätze sind « À quelle heure part le train? » und « Je voudrais réserver une chambre pour deux nuits. »",
      "**Praktikum und Beruf:** un stage (Praktikum), un stagiaire / une stagiaire, une entreprise (Firma), un patron / une patronne (Chef), un collègue / une collègue, un métier (Beruf), un job de vacances (Ferienjob), un salaire, travailler, apprendre. « Je cherche un stage dans une boulangerie. », « J’ai fait mon stage dans une entreprise de logiciels. » Mit dem Wort stage beschreibst du ein Praktikum, mit job einen bezahlten Nebenjob.",
      "**Bewerbung:** un CV, une lettre de motivation (Bewerbungsschreiben), une candidature (Bewerbung), postuler (sich bewerben), un entretien (Vorstellungsgespräch), un poste (Stelle), les compétences (Fähigkeiten), un diplôme. « Je postule pour un stage chez vous. », « J’ai un entretien lundi. » Beachte: Das Verb postuler ersetzt im Französischen das deutsche „sich bewerben“, ohne Reflexivpronomen.",
      "Das Lernziel ist auch, bekannte Wörter in neuen Zusammenhängen zu verwenden. Das Wort **un billet** passt zum Zug (un billet de train), zum Konzert (un billet de concert) und zum Flugzeug (un billet d’avion). **Prendre** bedeutet nicht nur nehmen (prendre le train), sondern auch eine Entscheidung treffen (prendre une décision). **Passer** heißt vorbeigehen, aber auch verbringen (passer une semaine à Paris) oder ablegen (passer un examen).",
    ],
    terms: [
      { term: "un stage", text: "Ein Praktikum in einem Betrieb. Wer es macht, ist un stagiaire oder une stagiaire." },
      { term: "postuler", text: "Sich bewerben. Das Verb hat im Französischen kein Reflexivpronomen: je postule pour un poste." },
      { term: "un billet", text: "Eine Fahrkarte oder ein Ticket. Das Wort passt zu Zug, Flugzeug, Konzert und vielem mehr." },
    ],
    takeaway:
      "Zu Reisen gehören billet, gare, horaire, retard, valise, séjour. Zu Praktikum und Beruf gehören stage, entreprise, collègue, métier, job. Für die Bewerbung brauchst du CV, lettre de motivation, postuler, entretien. Bekannte Wörter wie billet, prendre und passer haben mehrere Bedeutungen.",
    sourceIds: ["lp", "larousse", "dfjw"],
    quiz: {
      question: "Wie sagst du: „Ich suche ein Praktikum in einer Bäckerei“?",
      answer: "Je cherche un stage dans une boulangerie.",
      wrong: ["Je cherche un voyage dans une boulangerie.", "Je cherche un séjour dans une boulangerie."],
      explanation:
        "Praktikum heißt un stage. Un voyage ist eine Reise und un séjour ein Aufenthalt, zum Beispiel im Urlaub.",
    },
    workshop: {
      kind: "classify",
      title: "Reise, Praktikum oder Bewerbung?",
      instruction: "Ordne jeden Satz dem Themenfeld zu, aus dem sein Wortschatz stammt.",
      categories: ["Reisen", "Praktikum", "Bewerbung"],
      entries: [
        { text: "J’ai réservé un billet de train pour Marseille.", target: 0, feedback: "Billet und train gehören zum Wortfeld Reisen." },
        { text: "Je cherche un stage dans une boulangerie.", target: 1, feedback: "Stage bezeichnet ein Praktikum in einem Betrieb." },
        { text: "J’envoie mon CV et ma lettre de motivation.", target: 2, feedback: "CV und lettre de motivation gehören zur Bewerbung." },
        { text: "Notre vol part de l’aéroport à huit heures.", target: 0, feedback: "Vol und aéroport sind Reisewörter." },
        { text: "Mon patron et mes collègues sont très sympas.", target: 1, feedback: "Patron und collègues beschreiben den Alltag im Praktikum." },
        { text: "J’ai un entretien lundi pour ce poste.", target: 2, feedback: "Entretien und poste gehören zur Bewerbung." },
      ],
      conclusion: "Die Wörter ordnen sich zu Wortfeldern: Reisen, Betrieb und Praktikum, Bewerbung.",
    },
    casework: {
      title: "Ein Praktikum in Lyon planen",
      story:
        "Eine Schülerin schreibt: « Je voudrais faire un stage à Lyon. J’ai envoyé mon CV et ma lettre de motivation. J’ai réservé un billet de train et une chambre dans une auberge de jeunesse pour une semaine. »",
      steps: [
        {
          question: "Was ist « un stage »?",
          options: ["Ein Praktikum", "Ein Ferienjob", "Eine Reise"],
          answer: 0,
          explanation: "Un stage ist ein Praktikum. Ein Ferienjob heißt un job de vacances, eine Reise un voyage.",
        },
        {
          question: "Welche Wörter gehören zur Bewerbung?",
          options: ["CV und lettre de motivation", "billet et auberge de jeunesse", "patron et collègue de travail"],
          answer: 0,
          explanation: "CV und lettre de motivation gehören zu jeder Bewerbung. Billet und auberge sind Reisewörter, patron und collègue gehören zum Alltag im Betrieb.",
        },
        {
          question: "Was bedeutet « une auberge de jeunesse »?",
          options: ["Jugendherberge", "Jugendzentrum", "Jugendgericht"],
          answer: 0,
          explanation: "Une auberge de jeunesse ist eine Jugendherberge, also eine günstige Unterkunft für junge Reisende.",
        },
      ],
      verdict:
        "Die Nachricht verbindet drei Wortfelder: Praktikum, Bewerbung und Reise. So sprichst du über Pläne für ein Praktikum im Ausland.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe drei Sätze: Du suchst ein Praktikum, du bewirbst dich und du buchst eine Fahrkarte. Verwende stage, postuler oder candidature und billet.",
        hints: [
          "Beginne mit « Je cherche un stage … ».",
          "Postuler braucht kein Reflexivpronomen.",
        ],
        model:
          "Je cherche un stage dans une entreprise à Munich. Je postule avec mon CV et ma lettre de motivation. J’ai réservé un billet de train pour jeudi. Stage steht für das Praktikum, postuler ersetzt „sich bewerben“ und billet bezeichnet die Fahrkarte.",
        criteria: [
          "Stage, postuler oder candidature und billet kommen vor.",
          "Postuler wird ohne Reflexivpronomen verwendet.",
          "Die Sätze sind verständlich und korrekt gebildet.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf bis sechs Sätze über ein geplantes Praktikum in Frankreich: Wo? Wie reist du an? Was bereitest du vor? Verwende Wortschatz aus allen drei Wortfeldern und mindestens ein bekanntes Wort in neuer Bedeutung (billet, prendre oder passer).",
        hints: [
          "Denke an Anreise, Unterkunft, Bewerbungsunterlagen und Gespräch.",
          "Für eine neue Bedeutung: prendre une décision oder passer une semaine.",
        ],
        model:
          "Je voudrais faire un stage à Paris. J’ai envoyé ma candidature avec mon CV et ma lettre de motivation. Mon entretien est lundi. Pour y aller, j’ai pris un billet de train et j’ai réservé une chambre pour une semaine. Je vais passer sept jours chez une collègue de ma tante. J’ai pris la décision de rester jusqu’à vendredi.",
        criteria: [
          "Wortschatz aus Reise, Praktikum und Bewerbung kommt vor.",
          "Ein bekanntes Wort wird in einer neuen Bedeutung verwendet.",
          "Der Text ist in sich stimmig.",
        ],
      },
    },
  },
  {
    id: "fr-wortschatz-interessen",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.3"],
    title: "Wortschatz: Musik, Medien und eigene Interessen",
    intro:
      "Über Musik, Medien und Hobbys sprichst du mit dem passenden Wortschatz. Achte auf jouer à und jouer de.",
    paragraphs: [
      "Über Musik sagst du: écouter de la musique, un groupe (Band), un morceau (Stück), une chanson, un concert, un chanteur / une chanteuse, jouer de la guitare. Über Medien: la télé, une émission (Sendung), une série, un film, un jeu vidéo, les réseaux sociaux, une appli, un podcast, une chaîne, regarder, télécharger, partager. « Je regarde une série sur une plateforme de streaming. »",
      "Wichtig ist die Präposition bei **jouer**. Bei Spielen und Sportarten steht jouer **à**: « jouer au football » (à + le), « jouer à la console », « jouer aux cartes » (à + les). Bei Instrumenten steht jouer **de**: « jouer de la guitare », « jouer du piano » (de + le), « jouer de l’accordéon ». Verwechsle sie nicht: « jouer la guitare » ist falsch.",
      "Eigene Interessen drückst du so aus: « J’adore la musique. », « Je suis fan de ce groupe. », « Je m’intéresse à la photographie. », « Ça me plaît. », « Je préfère les films d’aventure. » Nach s’intéresser steht à, nach fan steht de, nach adorer folgt direkt das Objekt.",
      "Typische Fehler sind « Je joue de football » (richtig ist au football), « Il est fan à ce groupe » (richtig ist de) und « Je m’intéresse de la musique » (richtig ist à la musique). Mit solchen Wendungen sprichst du über Interessen kurz und treffend, sie helfen dir, Gespräche mit Gleichaltrigen zu führen.",
    ],
    terms: [
      { term: "jouer à", text: "Steht bei Spielen und Sportarten: jouer au football, jouer aux cartes, jouer à la console." },
      { term: "jouer de", text: "Steht bei Musikinstrumenten: jouer de la guitare, jouer du piano." },
      { term: "s’intéresser à, être fan de", text: "Feste Wendungen für Interessen: Je m’intéresse à la musique. Il est fan de ce groupe." },
    ],
    takeaway:
      "Spiele und Sport: jouer à. Instrumente: jouer de. Interessen: s’intéresser à, être fan de, adorer, préférer. Medienwörter: série, émission, appli, podcast, réseaux sociaux.",
    sourceIds: ["lp", "larousse", "lepointdufle"],
    quiz: {
      question: "Wie sagst du: „Er spielt Gitarre“?",
      answer: "Il joue de la guitare.",
      wrong: ["Il joue à la guitare.", "Il joue la guitare."],
      explanation:
        "Bei Instrumenten steht jouer de: de la guitare. Jouer à gehört zu Spielen und Sport.",
    },
    workshop: {
      kind: "choose",
      title: "Die richtige Präposition wählen",
      instruction: "Entscheide, ob Spiel, Sportart, Instrument oder eine feste Wendung vorliegt.",
      items: [
        { before: "Mon frère joue ", options: ["de la", "à la", "la"], answer: 0, after: " guitare dans un groupe.", feedback: "Bei Instrumenten steht jouer de: jouer de la guitare." },
        { before: "Nous jouons ", options: ["au", "du", "le"], answer: 0, after: " football le samedi matin.", feedback: "Bei Sportarten steht jouer à: jouer au football (à + le)." },
        { before: "Elle est fan ", options: ["de", "à", "pour"], answer: 0, after: " cette chanteuse.", feedback: "Nach fan steht de: elle est fan de cette chanteuse." },
        { before: "Je m’intéresse ", options: ["à", "de", "pour"], answer: 0, after: " la musique électronique.", feedback: "S’intéresser verlangt à: je m’intéresse à la musique." },
        { before: "Tu joues ", options: ["du", "au", "le"], answer: 0, after: " piano depuis combien de temps?", feedback: "Bei Instrumenten steht jouer de: jouer du piano (de + le)." },
      ],
      conclusion: "Jouer à für Spiele und Sport, jouer de für Instrumente, s’intéresser à und être fan de als feste Wendungen.",
    },
    casework: {
      title: "Ein Chat über Hobbys",
      story:
        "In einem Chat schreibt Sam: « Je joue au basket et de la batterie. Je suis fan de ce groupe de rock. Le soir, je regarde une série et je m’intéresse beaucoup à la photo. »",
      steps: [
        {
          question: "Warum steht « de la batterie » und nicht « à la batterie »?",
          options: ["Batterie ist ein Instrument.", "Batterie ist eine Sportart.", "Weil batterie feminin ist."],
          answer: 0,
          explanation: "Instrumente nehmen jouer de, Sportarten und Spiele jouer à. Das Geschlecht spielt für die Wahl keine Rolle.",
        },
        {
          question: "Was drückt « Je suis fan de » aus?",
          options: ["Große Begeisterung.", "Eine klare Abneigung gegen etwas.", "Eine Frage nach einer Meinung."],
          answer: 0,
          explanation: "Être fan de zeigt, dass man etwas sehr mag.",
        },
        {
          question: "Welche Präposition folgt auf « s’intéresser »?",
          options: ["à", "de", "pour"],
          answer: 0,
          explanation: "S’intéresser verlangt à: je m’intéresse à la photo.",
        },
      ],
      verdict:
        "Sam spricht über Sport, Instrument, Lieblingsband und Medien. Die Präpositionen jouer à, jouer de, fan de und s’intéresser à sind die entscheidenden Muster.",
    },
    tasks: {
      1: {
        prompt:
          "Ergänze die Präpositionen: 1. Il joue … piano. 2. Nous jouons … cartes. 3. Elle s’intéresse … cinéma.",
        hints: [
          "Prüfe, ob ein Instrument, ein Spiel oder eine feste Wendung vorliegt.",
          "Denke an die Verschmelzung von de + le und à + les.",
        ],
        model:
          "1. Il joue du piano. 2. Nous jouons aux cartes. 3. Elle s’intéresse au cinéma. Beim Instrument steht de + le = du, beim Kartenspiel à + les = aux, und s’intéresser verlangt à + le = au.",
        criteria: [
          "Jouer de bei Instrumenten, jouer à bei Spielen.",
          "S’intéresser à ist richtig verwendet.",
          "Die Verschmelzungen du, au und aux sind richtig.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über deine Interessen: ein Sport oder Spiel, ein Instrument oder eine Lieblingsband, ein Medium (Serie, Podcast, App). Verwende mindestens jouer à, jouer de oder fan de, und s’intéresser à.",
        hints: [
          "Beginne mit « Je joue … » oder « Je suis fan de … ».",
          "Nutze Wörter wie une série, un podcast oder une appli.",
        ],
        model:
          "Je joue au volley avec mes amis le mardi. Ma sœur joue de la flûte dans l’orchestre de l’école. Je suis fan d’une chanteuse française qui s’appelle Zaz. Le soir, j’écoute un podcast et je m’intéresse beaucoup à l’histoire de France.",
        criteria: [
          "Jouer à, jouer de und fan de oder s’intéresser à kommen richtig vor.",
          "Mindestens ein Wort aus dem Wortfeld Medien.",
          "Der Text beschreibt die Interessen verständlich.",
        ],
      },
    },
  },
  {
    id: "fr-unpersoenliche-ausdruecke",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.4"],
    title: "Unpersönliche Ausdrücke",
    intro:
      "Mit il pleut, il neige, il vaut mieux und ça suffit sprichst du über Wetter und Vorschläge, ohne eine bestimmte Person zu nennen.",
    paragraphs: [
      "Unpersönliche Ausdrücke haben ein Subjekt **il**, das keine Person meint. Beim Wetter sagst du: « Il pleut. », « Il neige. », « Il fait beau. », « Il fait froid. », « Il y a du vent. » Das Verb steht immer in der 3. Person Singular. Auch in der Vergangenheit und Zukunft bleibt il: « Il a plu. », « Il pleuvait. », « Il neigera demain. »",
      "Mit **il vaut mieux + Infinitiv** gibst du einen Rat: « Il vaut mieux partir tôt. » (Es ist besser, früh zu gehen.) Nach il vaut mieux folgt der Infinitiv direkt, ohne de: « Il vaut mieux rester ici. » Ein ähnlicher Ausdruck ist « il est important de + Infinitiv »: « Il est important de se reposer. » Hier steht de vor dem Infinitiv.",
      "Mit **ça suffit** drückst du aus, dass etwas genug ist: « Ça suffit, merci. » (Es reicht, danke.) « Ça suffit maintenant! » (Jetzt reicht es!) Das Verb suffire kann auch mit il stehen: « Il suffit de + Infinitiv » (Es genügt, zu …).",
      "Typische Fehler sind « Elle pleut » oder « Ça pleut » (richtig ist il pleut), « Il vaut mieux de partir » (nach il vaut mieux steht kein de) und « Il pleuvent » (das Verb bleibt im Singular).",
    ],
    terms: [
      { term: "il pleut, il neige", text: "Unpersönliche Wetterausdrücke. Das Subjekt il bezeichnet keine Person, das Verb steht immer im Singular." },
      { term: "il vaut mieux + Infinitiv", text: "Ein Rat: Es ist besser, etwas zu tun. Der Infinitiv folgt direkt ohne de." },
      { term: "ça suffit", text: "Es reicht, es genügt. Als Ausruf bedeutet es auch: Jetzt reicht es!" },
    ],
    takeaway:
      "Wetter: il pleut, il neige, il fait beau. Rat: il vaut mieux + Infinitiv (ohne de). Genug: ça suffit. Das Subjekt il ist unpersönlich, das Verb bleibt im Singular.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "Il vaut mieux partir tôt.",
      wrong: ["Il vaut mieux de partir tôt.", "Il vaut mieux que partir tôt."],
      explanation:
        "Nach il vaut mieux folgt der Infinitiv direkt, ohne de und ohne que. Il est important de dagegen verlangt de.",
    },
    workshop: {
      kind: "choose",
      title: "Unpersönliche Ausdrücke richtig verwenden",
      instruction: "Achte auf das Subjekt il und auf das, was nach dem Ausdruck folgt.",
      items: [
        { before: "", options: ["Il pleut", "Elle pleut", "On pleut"], answer: 0, after: " depuis ce matin, restons à la maison.", feedback: "Das Wetter wird mit dem unpersönlichen il ausgedrückt: il pleut." },
        { before: "Il vaut mieux ", options: ["partir", "de partir", "partons"], answer: 0, after: " tôt pour éviter les embouteillages.", feedback: "Nach il vaut mieux steht der Infinitiv direkt, ohne de." },
        { before: "", options: ["Ça suffit", "Il suffit", "Ce suffit"], answer: 0, after: " maintenant, arrêtez de crier!", feedback: "Als Ausruf „Jetzt reicht es!“ verwendest du ça suffit." },
        { before: "En hiver, il ", options: ["neige", "neigent", "neiges"], answer: 0, after: " souvent dans les Alpes.", feedback: "Das Verb steht bei unpersönlichem il im Singular: il neige." },
        { before: "Il est important ", options: ["de", "à", "que"], answer: 0, after: " se reposer avant l’examen.", feedback: "Nach il est important steht vor dem Infinitiv de." },
      ],
      conclusion: "Il pleut, il neige, il vaut mieux + Infinitiv, ça suffit. Il ist hier ein leeres Subjekt.",
    },
    casework: {
      title: "Ein Ausflug im Regen",
      story:
        "Eine Gruppe plant einen Ausflug: « Il pleut ce matin. Il vaut mieux attendre un peu. Si ça continue, nous prendrons le train. Ça suffit, nous ne partons pas avant midi! »",
      steps: [
        {
          question: "Was bedeutet « il » in « Il pleut »?",
          options: ["Es ist ein unpersönliches Subjekt.", "Es meint hier einen bestimmten Jungen.", "Es ersetzt eine ganze Gruppe von Personen."],
          answer: 0,
          explanation: "Das il ist leer und bezeichnet keine Person. Das Verb bleibt immer im Singular.",
        },
        {
          question: "Warum folgt in « Il vaut mieux attendre » kein de?",
          options: ["Der Infinitiv folgt direkt.", "Attendre beginnt mit einem Vokal.", "De wäre an dieser Stelle verboten."],
          answer: 0,
          explanation: "Nach il vaut mieux steht der Infinitiv ohne Präposition. Bei il est important dagegen steht de.",
        },
        {
          question: "Was drückt « Ça suffit! » aus?",
          options: ["Es reicht.", "Es regnet.", "Es ist besser."],
          answer: 0,
          explanation: "Ça suffit heißt „es genügt“ oder „es reicht“.",
        },
      ],
      verdict:
        "Der Text verwendet drei unpersönliche Ausdrücke, um Wetter, Rat und Schlussstrich auszudrücken. Das Verb bleibt immer im Singular, vor dem Infinitiv steht kein de.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde Sätze: 1. Es regnet seit gestern. 2. Es ist besser, früh zu gehen. 3. Genug jetzt!",
        hints: [
          "Verwende das unpersönliche Subjekt il.",
          "Nach il vaut mieux folgt direkt der Infinitiv.",
        ],
        model:
          "1. Il pleut depuis hier. 2. Il vaut mieux partir tôt. 3. Ça suffit! Das Subjekt il ist unpersönlich, nach il vaut mieux steht der Infinitiv ohne de, und ça suffit ist ein fester Ausruf.",
        criteria: [
          "Il pleut und il vaut mieux sind richtig gebildet.",
          "Nach il vaut mieux steht kein de.",
          "Ça suffit steht als Ausruf.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über das Wetter und einen Plan an einem Wochenende. Verwende il pleut oder il neige, il fait + Adjektiv, il vaut mieux + Infinitiv und ça suffit.",
        hints: [
          "Beginne mit « Ce week-end, il … ».",
          "Gib einen Rat: « Il vaut mieux … ».",
        ],
        model:
          "Ce week-end, il pleut et il fait froid. Il vaut mieux rester à la maison. Nous jouons aux cartes, mais mon frère crie. Ça suffit! Dimanche, il neigera peut-être dans les montagnes.",
        criteria: [
          "Il pleut, il fait + Adjektiv und il vaut mieux + Infinitiv kommen vor.",
          "Ça suffit steht passend im Text.",
          "Das Verb bleibt bei il im Singular.",
        ],
      },
    },
  },
  {
    id: "fr-meinung-gefuehle",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.5", "1.1.6"],
    title: "Meinungen und Gefühle ausdrücken",
    intro:
      "Mit je pense que, je trouve que, à mon avis und Wendungen für Gefühle sagst du, was du denkst und fühlst, und begründest es.",
    paragraphs: [
      "Eine Meinung drückst du mit festen Wendungen aus: **je pense que**, **je crois que**, **je trouve que**, **j’espère que** und **à mon avis**. Nach pense que, crois que, trouve que und espère que steht ein normaler Aussagesatz im Indikativ: « Je pense que c’est une bonne idée. », « Je trouve que ce film est trop long. », « J’espère que tu viendras. » Bei à mon avis folgt ein Satz ohne que: « À mon avis, c’est trop cher. »",
      "Du stimmst zu oder widersprichst mit « Je suis d’accord. », « Tu as raison. », « Je ne suis pas d’accord. », « Pas du tout! ». Begründungen führst du mit **parce que** oder **car** ein: « Je suis content parce que j’ai réussi mon test. » Wenn du nicht sicher bist, helfen dir Wörter wie peut-être oder je ne sais pas.",
      "Gefühle sagst du so: « J’adore ça. », « Je déteste attendre. », « Je suis heureux / heureuse de + Infinitiv », « J’ai peur de + Infinitiv », « Ça me plaît. », « Ça me fait plaisir. », « Ça m’ennuie. » Nach der Gefühlswendung folgt oft de + Infinitiv: « Je suis content de partir en vacances. » Das Adjektiv richtet sich nach dir: « Je suis contente. » (ein Mädchen).",
      "Typische Fehler sind « Je pense de » (richtig ist je pense que), « J’ai peur à » (richtig ist de) und « Je suis heureux à partir » (richtig ist de partir). Wenn du dagegen eine Meinung verneinst (je ne pense pas que), ändert sich etwas im Satz, das lernst du später. In dieser Lektion bleibst du bei der bejahten Form.",
    ],
    terms: [
      { term: "je pense que, je trouve que", text: "Feste Wendungen für eine Meinung. Danach folgt ein normaler Aussagesatz: Je trouve que c’est intéressant." },
      { term: "à mon avis", text: "Eine Wendung für die eigene Meinung ohne que: À mon avis, c’est trop cher." },
      { term: "parce que, car", text: "Wörter, mit denen du eine Begründung anschließt: Je suis content parce que j’ai réussi." },
    ],
    takeaway:
      "Meinung: je pense que, je crois que, je trouve que, j’espère que, à mon avis. Zustimmung: je suis d’accord, tu as raison. Gefühle: j’adore, je déteste, ça me plaît, j’ai peur de. Begründung: parce que, car.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Ich finde, dass dieser Film zu lang ist“?",
      answer: "Je trouve que ce film est trop long.",
      wrong: ["Je trouve de ce film trop long.", "Je trouve ce film qui est trop long."],
      explanation:
        "Nach je trouve folgt que und ein normaler Aussagesatz. Mit de oder mit qui entsteht kein richtiger Satz.",
    },
    workshop: {
      kind: "classify",
      title: "Meinung, Gefühl, Zustimmung oder Widerspruch?",
      instruction: "Ordne jeden Satz der Sprechabsicht zu.",
      categories: ["Meinung", "Gefühl", "Zustimmung", "Widerspruch"],
      entries: [
        { text: "À mon avis, ce film est vraiment trop long.", target: 0, feedback: "À mon avis leitet eine eigene Meinung ein." },
        { text: "J’ai peur de rater mon train demain matin.", target: 1, feedback: "J’ai peur de drückt ein Gefühl aus." },
        { text: "Tu as raison, je suis tout à fait d’accord.", target: 2, feedback: "Tu as raison und je suis d’accord drücken Zustimmung aus." },
        { text: "Je ne suis pas d’accord, c’est une mauvaise idée.", target: 3, feedback: "Je ne suis pas d’accord widerspricht dem anderen." },
        { text: "Je trouve que cette appli est très pratique.", target: 0, feedback: "Je trouve que leitet eine Meinung ein." },
        { text: "Je suis contente de partir en vacances demain.", target: 1, feedback: "Je suis contente de zeigt ein Gefühl der Freude." },
      ],
      conclusion: "Meinung, Gefühl, Zustimmung und Widerspruch erkennst du an festen Wendungen. Mit parce que begründest du sie.",
    },
    casework: {
      title: "Wohin im Sommer?",
      story:
        "Zwei Freunde diskutieren: « Je pense qu’il vaut mieux aller à la mer. – Je ne suis pas d’accord. À mon avis, la montagne est plus calme. J’espère que tu comprends. »",
      steps: [
        {
          question: "Was folgt auf « je pense que »?",
          options: ["Ein normaler Aussagesatz.", "Ein Infinitiv mit de davor.", "Eine Frage mit Fragewort."],
          answer: 0,
          explanation: "Nach je pense que folgt ein vollständiger Aussagesatz mit Subjekt und Verb.",
        },
        {
          question: "Was drückt « Je ne suis pas d’accord » aus?",
          options: ["Widerspruch.", "Zustimmung.", "Eine Hoffnung."],
          answer: 0,
          explanation: "Je ne suis pas d’accord widerspricht dem anderen.",
        },
        {
          question: "Warum steht nach « à mon avis » kein que?",
          options: ["Die Wendung steht für sich.", "Que ist an dieser Stelle verboten.", "Weil avis ein männliches Wort ist."],
          answer: 0,
          explanation: "À mon avis steht vor einem normalen Satz, ein que ist nicht nötig.",
        },
      ],
      verdict:
        "Der Dialog verbindet Meinung, Widerspruch und Hoffnung. Mit parce que würdest du die Meinung noch begründen.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde Sätze: 1. Ich finde, dass dieses Buch interessant ist. 2. Ich hoffe, dass du kommst. 3. Ich habe Angst, den Bus zu verpassen.",
        hints: [
          "Nach je trouve que und j’espère que folgt ein Aussagesatz.",
          "Für Angst: avoir peur de + Infinitiv.",
        ],
        model:
          "1. Je trouve que ce livre est intéressant. 2. J’espère que tu viens. 3. J’ai peur de rater le bus. Nach je trouve que und j’espère que steht ein vollständiger Satz, bei j’ai peur de folgt de + Infinitiv.",
        criteria: [
          "Je trouve que und j’espère que leiten einen Aussagesatz ein.",
          "J’ai peur de steht mit Infinitiv.",
          "Die Sätze sind korrekt gebildet.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf bis sechs Sätze über ein Thema, das dir wichtig ist (zum Beispiel Handyregeln oder Schulsport). Gib deine Meinung, begründe sie mit parce que oder car, drücke ein Gefühl aus und widersprich oder stimme einer Gegenmeinung zu.",
        hints: [
          "Beginne mit « À mon avis, … » oder « Je pense que … ».",
          "Für die Gegenmeinung: « Je ne suis pas d’accord, parce que … ».",
        ],
        model:
          "À mon avis, il vaut mieux limiter le temps sur le portable, parce que les élèves dorment moins. Je trouve que c’est une bonne règle. Mon ami n’est pas d’accord, car il adore les jeux. Moi, j’ai peur de trop jouer le soir. J’espère que nous trouverons une solution ensemble.",
        criteria: [
          "Meinung, Begründung mit parce que oder car und ein Gefühl kommen vor.",
          "Eine Zustimmung oder ein Widerspruch ist enthalten.",
          "Nach pense, trouve und espère steht ein Aussagesatz.",
        ],
      },
    },
  },
  {
    id: "fr-zeitbezug-venir-de",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.6"],
    title: "venir de und être en train de",
    intro:
      "Mit venir de sagst du, dass etwas gerade passiert ist, mit être en train de, dass es gerade abläuft, und mit aller, dass es gleich geschieht.",
    paragraphs: [
      "**venir de + Infinitiv** drückt aus, dass etwas soeben geschehen ist: « Je viens de manger. » (Ich habe gerade gegessen.) « Elle vient de partir. » Du konjugierst nur venir: je viens de, tu viens de, il vient de, nous venons de, vous venez de, ils viennent de. Vor einem Vokal wird de zu d’: « Je viens d’arriver. »",
      "**être en train de + Infinitiv** betont, dass etwas gerade abläuft: « Je suis en train de manger. » (Ich bin gerade beim Essen.) « Ils sont en train de jouer. » Es entspricht deutschem „gerade dabei sein“ und kann kaum mit einem einzelnen deutschen Wort wiedergegeben werden. Mit dem imparfait beschreibst du dasselbe in der Vergangenheit: « J’étais en train de lire quand le téléphone a sonné. »",
      "Zusammen mit **aller + Infinitiv** (futur proche) ergibt sich eine Zeitleiste: Vorher: « Je viens de manger. » Jetzt: « Je suis en train de manger. » Gleich: « Je vais manger. » Pronomen stehen vor dem Infinitiv: « Je viens de le voir. », « Elle est en train de le faire. »",
      "Typische Fehler sind « Je viens à manger » (richtig ist de), « Je suis en train manger » (de fehlt) und die Verwechslung von venir de mit dem Wunsch: « Je viens de manger » heißt nicht „Ich komme zum Essen“.",
    ],
    terms: [
      { term: "venir de + Infinitiv", text: "Etwas ist soeben geschehen: je viens de manger, elle vient de partir." },
      { term: "être en train de + Infinitiv", text: "Etwas läuft gerade ab: je suis en train de manger." },
      { term: "aller + Infinitiv", text: "Etwas geschieht gleich: je vais manger. Das ist das futur proche." },
    ],
    takeaway:
      "Venir de + Infinitiv: gerade passiert. Être en train de + Infinitiv: gerade dabei. Aller + Infinitiv: gleich. Pronomen stehen vor dem Infinitiv, vor einem Vokal wird de zu d’.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Ich habe gerade gegessen“?",
      answer: "Je viens de manger.",
      wrong: ["Je suis en train de manger.", "Je vais manger."],
      explanation:
        "Etwas, das soeben geschehen ist, drückst du mit venir de aus. Être en train de meint „gerade dabei“, aller „gleich“.",
    },
    workshop: {
      kind: "choose",
      title: "Vorher, jetzt oder gleich?",
      instruction: "Entscheide, ob die Handlung soeben geschehen ist, gerade abläuft oder gleich geschieht.",
      items: [
        { before: "Il est midi: je ", options: ["viens de manger", "suis en train de manger", "vais manger"], answer: 0, after: " un sandwich, donc je n’ai plus faim.", feedback: "Das Essen ist schon vorbei, also venir de." },
        { before: "Chut! Le bébé ", options: ["est en train de", "vient de", "va"], answer: 0, after: " dormir dans la chambre.", feedback: "Das Kind schläft in diesem Moment, also être en train de." },
        { before: "Regarde les nuages: il ", options: ["va pleuvoir", "vient de pleuvoir", "est en train de pleuvoir"], answer: 0, after: " dans quelques minutes.", feedback: "Der Regen kommt gleich, also aller + Infinitiv." },
        { before: "Paul ne répond pas parce qu’il ", options: ["est en train de", "vient de", "va"], answer: 0, after: " prendre sa douche.", feedback: "Er steht gerade unter der Dusche, also être en train de." },
        { before: "Nous ", options: ["venons de", "sommes en train de", "allons"], answer: 0, after: " rentrer du cinéma, il est très tard.", feedback: "Sie sind soeben zurückgekommen, also venir de." },
      ],
      conclusion: "Venir de, être en train de und aller + Infinitiv zeigen vorher, jetzt und gleich.",
    },
    casework: {
      title: "Ein Anruf am Abend",
      story:
        "Nachrichten am Abend: « Tu es là? – Non, je viens de rentrer. – Qu’est-ce que tu fais? – Je suis en train de préparer le dîner. – Super, nous allons manger ensemble. »",
      steps: [
        {
          question: "Was bedeutet « je viens de rentrer »?",
          options: ["Ich bin gerade nach Hause gekommen.", "Ich komme gleich nach Hause.", "Ich bin gerade beim Heimkommen."],
          answer: 0,
          explanation: "Venir de + Infinitiv bedeutet, dass etwas soeben geschehen ist.",
        },
        {
          question: "Was drückt « je suis en train de préparer » aus?",
          options: ["Die Handlung läuft gerade ab.", "Die Handlung ist schon vorbei.", "Die Handlung beginnt erst morgen."],
          answer: 0,
          explanation: "Être en train de zeigt, dass jemand gerade dabei ist.",
        },
        {
          question: "Was drückt « nous allons manger » aus?",
          options: ["Die nahe Zukunft.", "Die Vergangenheit.", "Eine Gewohnheit."],
          answer: 0,
          explanation: "Aller + Infinitiv ist das futur proche und bezeichnet etwas, das bald geschieht.",
        },
      ],
      verdict:
        "Der Chat verwendet alle drei Ausdrücke in der richtigen Reihenfolge: vorher, jetzt, gleich.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde Sätze: 1. Ich habe gerade angerufen. 2. Er ist gerade beim Lesen. 3. Wir gehen gleich essen.",
        hints: [
          "Wähle zwischen venir de, être en train de und aller.",
          "Das zweite Verb steht im Infinitiv.",
        ],
        model:
          "1. Je viens d’appeler. 2. Il est en train de lire. 3. Nous allons manger. Die erste Handlung ist soeben geschehen (venir de), die zweite läuft gerade (être en train de), die dritte geschieht gleich (aller).",
        criteria: [
          "Venir de, être en train de und aller sind passend gewählt.",
          "Das zweite Verb steht im Infinitiv.",
          "Vor einem Vokal steht d’.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Chat (fünf bis sechs Zeilen) zwischen zwei Freunden, die gerade etwas tun, eben etwas getan haben und gleich etwas tun. Verwende venir de, être en train de und aller.",
        hints: [
          "Beginne mit « Tu es où? ».",
          "Verteile die drei Ausdrücke auf beide Personen.",
        ],
        model:
          "– Tu es où? – Je viens d’arriver à la gare. – Tu es en train de marcher? – Oui, je suis en train de chercher le bus. – Je vais t’attendre devant le café. – Parfait, je viens de voir ton message, j’arrive bientôt.",
        criteria: [
          "Venir de, être en train de und aller kommen je mindestens einmal vor.",
          "Das zweite Verb steht jeweils im Infinitiv.",
          "Der Chat ist verständlich und logisch aufgebaut.",
        ],
      },
    },
  },
];
