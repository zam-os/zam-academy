import type { Lesson } from "../model/types";

/**
 * Stufe 2, vierter Teil: Grammatik, Handlungen und Abläufe beschreiben (Kompetenzerwartung 1.2.2.4):
 * reflexive Verben im Präsens und im passé composé sowie unregelmäßige Verben.
 */
export const S2D: Lesson[] = [
  {
    id: "fr-pronominaux-present",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Reflexive Verben im Präsens",
    intro:
      "Verben wie se lever und se dépêcher haben ein Pronomen, das zum Subjekt passt. Damit beschreibst du deinen Tagesablauf.",
    paragraphs: [
      "Reflexive Verben (verbes pronominaux) bestehen aus einem Reflexivpronomen und dem Verb: **se lever** (aufstehen), **se réveiller** (aufwachen), **se doucher**, **s’habiller** (sich anziehen), **se dépêcher** (sich beeilen), **se coucher** (ins Bett gehen). Das Pronomen richtet sich nach dem Subjekt: je **me**, tu **te**, il/elle/on **se**, nous **nous**, vous **vous**, ils/elles **se**.",
      "Beispiel se lever: je me lève, tu te lèves, il se lève, nous nous levons, vous vous levez, ils se lèvent. Beachte den Akzent: Vor den stummen Endungen heißt es lève, bei nous und vous steht dagegen levons und levez. Vor einem Vokal oder stummen h werden me, te, se zu **m’, t’, s’**: « je m’habille », « tu t’appelles », « elle s’habille ».",
      "In der Verneinung umschließen ne und pas Pronomen und Verb: « Je ne me lève pas. », « Elle ne se dépêche pas. » In der Frage mit est-ce que bleibt die Reihenfolge: « Est-ce que tu te lèves à sept heures? » Mit einem Infinitiv passt sich das Pronomen dem Subjekt an: « Je vais me coucher. », « Tu vas te doucher. », « Nous allons nous dépêcher. »",
      "Typische Fehler sind « Je lève me » (das Pronomen steht vor dem Verb), « Nous se dépêchons » (das Pronomen muss zu nous passen) und die Annahme, dass sich im Deutschen und im Französischen immer dieselben Verben reflexiv verhalten. Zum Beispiel heißt „sich waschen“ se laver, aber „das Auto waschen“ ohne Pronomen laver la voiture.",
    ],
    terms: [
      { term: "verbe pronominal", text: "Ein Verb mit Reflexivpronomen, das zum Subjekt passt: je me lève, tu te lèves, nous nous levons." },
      { term: "m’, t’, s’", text: "Die verkürzten Formen von me, te, se vor einem Vokal oder stummen h: je m’habille, tu t’appelles." },
      { term: "Stellung des Pronomens", text: "Das Pronomen steht vor dem Verb. In der Verneinung umschließen ne und pas beide: je ne me lève pas." },
    ],
    examples: [
      {
        title: "Ein Morgen in der Familie (eigens verfasst)",
        text: "Le matin, je me réveille à six heures et demie. Mon frère se lève à sept heures. Nous nous dépêchons pour prendre le bus, mais ma sœur ne se dépêche jamais.",
        analysis:
          "Das Pronomen passt zum Subjekt: **je me**, **il se**, **nous nous**, **elle se**. Bei se dépêcher steht die Verneinung ne … jamais um das Pronomen und das Verb herum.",
      },
    ],
    takeaway:
      "Das Reflexivpronomen passt zum Subjekt (me, te, se, nous, vous, se) und steht vor dem Verb. Vor einem Vokal: m’, t’, s’. Verneinung: ne … pas umschließt Pronomen und Verb. Beim Infinitiv bleibt das Pronomen beim Subjekt.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Wir beeilen uns“?",
      answer: "Nous nous dépêchons.",
      wrong: ["Nous se dépêchons.", "Nous dépêchons nous."],
      explanation:
        "Das Pronomen muss zum Subjekt nous passen, also nous nous, und es steht vor dem Verb. Se gehört nur zu il, elle, on, ils und elles.",
    },
    workshop: {
      kind: "choose",
      title: "Das richtige Reflexivpronomen wählen",
      instruction:
        "Prüfe das Subjekt, wähle das passende Pronomen und achte auf die Stellung vor dem Verb.",
      items: [
        { before: "Tous les matins, je ", options: ["me lève", "se lève", "lève me"], answer: 0, after: " à sept heures.", feedback: "Das Subjekt ist je, also me, und das Pronomen steht vor dem Verb: je me lève." },
        { before: "Elle ", options: ["se douche", "me douche", "douche se"], answer: 0, after: " le soir après le sport.", feedback: "Das Subjekt ist elle, also se: elle se douche. Me gehört zu je." },
        { before: "Nous ", options: ["nous dépêchons", "se dépêchons", "dépêchons nous"], answer: 0, after: " pour prendre le bus.", feedback: "Zum Subjekt nous gehört das Pronomen nous: nous nous dépêchons." },
        { before: "Tu ", options: ["t’habilles", "te habilles", "s’habilles"], answer: 0, after: " pour la fête?", feedback: "Vor einem Vokal oder stummen h wird te zu t’: tu t’habilles." },
        { before: "Les enfants ne ", options: ["se couchent pas", "couchent pas se", "se pas couchent"], answer: 0, after: " avant neuf heures.", feedback: "Ne und pas umschließen Pronomen und Verb: ne se couchent pas." },
      ],
      conclusion: "Das Pronomen passt zum Subjekt, steht vor dem Verb und wird vor einem Vokal verkürzt.",
    },
    casework: {
      title: "Ein Tag im Ferienlager",
      story:
        "Eine Betreuerin schreibt: « À sept heures, tout le monde se réveille. Je me douche vite, puis je m’habille. Les enfants ne se dépêchent pas. Le soir, ils se couchent tôt. »",
      steps: [
        {
          question: "Warum steht « se » in « tout le monde se réveille »?",
          options: ["Tout le monde zählt als dritte Person.", "Se steht nach jedem Subjekt im Plural.", "Se ersetzt hier das Subjekt tout le monde."],
          answer: 0,
          explanation: "Tout le monde wird wie il behandelt, deshalb se. Se ist kein Ersatz für das Subjekt, sondern gehört als Reflexivpronomen dazu.",
        },
        {
          question: "Warum heißt es « je m’habille »?",
          options: ["Me wird vor stummem h zu m’.", "Me wird immer zu m’ am Satzanfang.", "Weil habiller ein Vokal ist."],
          answer: 0,
          explanation: "Vor einem Vokal oder stummen h wird das Pronomen verkürzt.",
        },
        {
          question: "Wie funktioniert « Les enfants ne se dépêchent pas »?",
          options: ["Ne und pas umschließen se und das Verb.", "Pas steht vor se, ne nach dem Verb.", "Ne steht nach dem Pronomen se."],
          answer: 0,
          explanation: "In der Verneinung steht das Reflexivpronomen zwischen ne und dem Verb, dahinter folgt pas.",
        },
      ],
      verdict:
        "Der Text zeigt das Reflexivpronomen bei verschiedenen Subjekten, die Verkürzung vor stummem h und die Verneinung. So beschreibst du Abläufe im Alltag.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die Verben in die richtige Form: 1. je (se lever) à sept heures. 2. nous (se dépêcher) pour le bus. 3. elle (s’habiller) vite.",
        hints: [
          "Wähle das Pronomen passend zum Subjekt.",
          "Vor einem Vokal oder stummen h wird das Pronomen verkürzt.",
        ],
        model:
          "1. Je me lève à sept heures. 2. Nous nous dépêchons pour le bus. 3. Elle s’habille vite. Das Pronomen passt jeweils zum Subjekt (me, nous, se) und steht vor dem Verb. In Satz 3 wird se vor dem stummen h zu s’.",
        criteria: [
          "Das Pronomen passt zum Subjekt.",
          "Das Pronomen steht vor dem Verb.",
          "Vor stummem h oder Vokal wird es verkürzt (s’).",
        ],
      },
      2: {
        prompt:
          "Beschreibe in fünf bis sechs Sätzen deinen Tagesablauf an einem Schultag. Verwende mindestens vier reflexive Verben, eine Verneinung und einen Infinitiv mit Pronomen (zum Beispiel je vais me coucher).",
        hints: [
          "Beginne mit « Le matin, je me réveille à … ».",
          "Für die Verneinung: « Je ne me dépêche pas le week-end. »",
        ],
        model:
          "Le matin, je me réveille à six heures et demie. Je me lève, je me douche et je m’habille. Mon frère ne se dépêche jamais, donc nous prenons le bus tard. Le soir, je me couche à dix heures. Ce soir, je vais me coucher plus tôt, car je suis fatigué.",
        criteria: [
          "Mindestens vier reflexive Verben richtig konjugiert.",
          "Eine Verneinung und ein Infinitiv mit passendem Pronomen.",
          "Der Text beschreibt einen Tagesablauf nachvollziehbar.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Reflexive Verben: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je ", options: ["me lève", "se lève"], answer: 0, after: " tôt le lundi.", feedback: "Zum Subjekt je gehört das Pronomen me." },
          { before: "Tu ", options: ["te couches", "me couches"], answer: 0, after: " à dix heures.", feedback: "Zum Subjekt tu gehört das Pronomen te." },
          { before: "Il ", options: ["se dépêche", "te dépêche"], answer: 0, after: " pour arriver à l’heure.", feedback: "Zum Subjekt il gehört das Pronomen se." },
          { before: "Nous ", options: ["nous réveillons", "se réveillons"], answer: 0, after: " à sept heures.", feedback: "Zum Subjekt nous gehört das Pronomen nous." },
          { before: "Vous ", options: ["vous douchez", "se douchez"], answer: 0, after: " le matin?", feedback: "Zum Subjekt vous gehört das Pronomen vous." },
          { before: "Elles ", options: ["se lèvent", "nous lèvent"], answer: 0, after: " très tôt.", feedback: "Zum Subjekt elles gehört das Pronomen se." },
          { before: "Je ", options: ["m’habille", "me habille"], answer: 0, after: " vite avant l’école.", feedback: "Vor stummem h wird me zu m’: je m’habille." },
          { before: "Je ne ", options: ["me couche pas", "couche me pas"], answer: 0, after: " tard.", feedback: "Ne und pas umschließen Pronomen und Verb." },
        ],
        2: [
          { before: "Quand il y a une interro le lendemain, ma sœur ", options: ["se couche", "me couche", "te couches"], answer: 0, after: " plus tôt que d’habitude pour être en forme.", feedback: "Zum Subjekt ma sœur gehört das Pronomen se." },
          { before: "En semaine, les élèves de ma classe ", options: ["se lèvent", "se lève", "nous levons"], answer: 0, after: " très tôt pour prendre le bus de six heures quarante.", feedback: "Zum Subjekt les élèves (Plural) gehört se mit der Verbform lèvent." },
          { before: "Nous avons beaucoup de travail ce soir, mais nous ", options: ["ne nous couchons pas", "ne se couchons pas", "nous ne couchons pas"], answer: 0, after: " trop tard, car demain, nous partons en excursion.", feedback: "Ne und pas umschließen das Pronomen nous und das Verb." },
          { before: "Le samedi, mon père ne ", options: ["se lève pas", "me lève pas", "lève se pas"], answer: 0, after: " avant dix heures, et ma mère prépare le petit déjeuner.", feedback: "Das Subjekt ist mon père, also se. Ne und pas umschließen Pronomen und Verb." },
          { before: "Ce matin, je suis en retard et je dois ", options: ["me dépêcher", "se dépêcher", "dépêcher me"], answer: 0, after: " pour attraper le tram avant sept heures et demie.", feedback: "Mit einem Infinitiv passt sich das Pronomen dem Subjekt an: je dois me dépêcher." },
          { before: "Après le sport, vous ", options: ["vous douchez", "se douchez", "vous douche"], answer: 0, after: " toujours aux vestiaires avant de rentrer à la maison.", feedback: "Zum Subjekt vous gehört das Pronomen vous und die Verbform douchez." },
          { before: "Dans mon quartier, tout le monde ", options: ["se connaît", "me connaît", "nous connaissons"], answer: 0, after: " depuis longtemps, c’est un petit village.", feedback: "Tout le monde wird wie il behandelt, also se connaît." },
          { before: "Ce soir, tu vas ", options: ["te coucher", "se coucher", "me coucher"], answer: 0, after: " tôt, parce que demain, tu as un grand match de handball.", feedback: "Mit einem Infinitiv passt sich das Pronomen dem Subjekt an: tu vas te coucher." },
        ],
      },
    },
  },
  {
    id: "fr-pronominaux-passe",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Reflexive Verben im passé composé",
    intro:
      "Reflexive Verben bilden das passé composé mit être. Das Partizip richtet sich in der Regel nach dem Subjekt.",
    paragraphs: [
      "Alle reflexiven Verben bilden das passé composé mit **être**. Das Reflexivpronomen steht vor être: « Je me suis levé. », « Tu t’es dépêché. », « Il s’est couché. », « Nous nous sommes réveillés. », « Vous vous êtes douchés. », « Ils se sont habillés. » Bei einem passé composé kommt also nie avoir vor, auch wenn das Verb im Deutschen mit „haben“ gebildet wird.",
      "Das Partizip passt sich in Geschlecht und Zahl dem Subjekt an, wie bei den anderen Verben mit être: « Elle s’est levée. », « Elles se sont dépêchées. », « Nous nous sommes couchés » (Jungen oder gemischte Gruppe), « Nous nous sommes couchées » (nur Mädchen). Wer sprechen oder schreiben will, prüft also zuerst, wer das Subjekt ist.",
      "In der Verneinung umschließen ne und pas das Pronomen und das Hilfsverb: « Je ne me suis pas levé. », « Elle ne s’est pas dépêchée. » In der Frage mit est-ce que bleibt die Reihenfolge: « Est-ce que tu t’es réveillé à six heures? » Wichtig: Es gibt Fälle, in denen das Partizip unverändert bleibt, zum Beispiel wenn ein direktes Objekt folgt (« Elle s’est lavé les mains »). Das lernst du später genauer, in dieser Lektion kommen solche Sätze nicht vor.",
      "Typische Fehler sind « J’ai me levé » (das Hilfsverb ist être und das Pronomen steht davor), « Elle s’est levé » (das Partizip muss weiblich sein: levée) und das Weglassen des Pronomens: « Je suis levé » bedeutet „Ich bin aufgestanden“ nur mit me, nicht ohne.",
    ],
    terms: [
      { term: "passé composé mit être", text: "Alle reflexiven Verben bilden das passé composé mit être. Das Reflexivpronomen steht davor: je me suis levé." },
      { term: "Angleichung des Partizips", text: "Das Partizip richtet sich nach dem Subjekt: elle s’est levée, ils se sont dépêchés, nous nous sommes couchées (Mädchen)." },
      { term: "Stellung in der Verneinung", text: "Ne und pas umschließen das Pronomen und das Hilfsverb: je ne me suis pas levé." },
    ],
    takeaway:
      "Reflexive Verben bilden das passé composé immer mit être, das Pronomen steht davor. Das Partizip passt zum Subjekt: elle s’est levée, ils se sont dépêchés. Verneinung: ne me suis pas levé.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Sie (das Mädchen) ist aufgestanden“?",
      answer: "Elle s’est levée.",
      wrong: ["Elle s’est levé.", "Elle a se levée."],
      explanation:
        "Das Hilfsverb ist être mit dem Pronomen s’ davor, und das Partizip richtet sich nach elle: levée. Mit avoir bildet kein reflexives Verb das passé composé.",
    },
    workshop: {
      kind: "choose",
      title: "Das passé composé reflexiver Verben bilden",
      instruction:
        "Achte auf das Hilfsverb être, die Stellung des Pronomens und die Angleichung des Partizips an das Subjekt.",
      items: [
        { before: "Hier, je ", options: ["me suis levé", "ai me levé", "me ai levé"], answer: 0, after: " très tôt.", feedback: "Das passé composé reflexiver Verben wird mit être gebildet, das Pronomen steht davor: je me suis levé." },
        { before: "Marie ", options: ["s’est dépêchée", "s’est dépêché", "a dépêchée"], answer: 0, after: " pour arriver à l’heure.", feedback: "Marie ist weiblich, das Partizip wird zu dépêchée. Das Hilfsverb ist être." },
        { before: "Nous ", options: ["nous sommes couchés", "nous avons couchés", "sommes nous couchés"], answer: 0, after: " après minuit.", feedback: "Mit nous gehört das Pronomen nous vor être: nous nous sommes couchés." },
        { before: "Mes frères ", options: ["se sont réveillés", "se sont réveillé", "ont se réveillés"], answer: 0, after: " avec le réveil.", feedback: "Mes frères ist männlich im Plural, also réveillés mit -s." },
        { before: "Elle ne ", options: ["s’est pas levée", "est pas levée", "s’a pas levée"], answer: 0, after: " avant huit heures.", feedback: "Ne und pas umschließen s’est. Das Partizip richtet sich nach elle: levée." },
      ],
      conclusion: "Immer être, das Pronomen davor, das Partizip richtet sich nach dem Subjekt, die Verneinung umschließt beide.",
    },
    casework: {
      title: "Ein Tagebucheintrag",
      story:
        "Léa schreibt: « Ce matin, je me suis levée à six heures. Mon frère ne s’est pas dépêché. Nous nous sommes retrouvés devant l’école, mais mes amies se sont déjà couchées tôt hier soir. »",
      steps: [
        {
          question: "Warum steht « me suis » und nicht « ai me »?",
          options: ["Reflexive Verben nehmen être.", "Je steht in diesem Satz immer mit suis.", "Me ersetzt hier das Hilfsverb avoir."],
          answer: 0,
          explanation: "Reflexive Verben bilden das passé composé mit être, das Pronomen steht davor.",
        },
        {
          question: "Warum heißt es « levée »?",
          options: ["Das Partizip passt sich Léa an.", "Weil lever auf -er endet, kommt -e dazu.", "Weil das Pronomen me feminin ist."],
          answer: 0,
          explanation: "Das Partizip richtet sich nach dem Subjekt. Léa ist ein Mädchen, also steht levée mit -e.",
        },
        {
          question: "Wie funktioniert « Mon frère ne s’est pas dépêché »?",
          options: ["Ne und pas umschließen s’est.", "Pas steht vor s’est, ne danach.", "Ne steht nach dem Partizip."],
          answer: 0,
          explanation: "Wie im Präsens umschließen ne und pas das Pronomen und das Hilfsverb.",
        },
      ],
      verdict:
        "Der Eintrag zeigt das passé composé mit être, die Angleichung des Partizips und die Verneinung. Alles hängt am Subjekt: Wer hat etwas getan?",
    },
    tasks: {
      1: {
        prompt:
          "Setze ins passé composé: 1. Je me lève à sept heures. (ich, männlich) 2. Elle se dépêche. 3. Nous nous couchons tard. (Jungen)",
        hints: [
          "Nimm être als Hilfsverb und stelle das Pronomen davor.",
          "Passe das Partizip dem Subjekt an.",
        ],
        model:
          "1. Je me suis levé à sept heures. 2. Elle s’est dépêchée. 3. Nous nous sommes couchés tard. Das Hilfsverb ist jeweils être, das Pronomen steht davor. In Satz 2 steht das Partizip weiblich (dépêchée), in Satz 3 männlich im Plural (couchés).",
        criteria: [
          "Das Hilfsverb ist être und das Pronomen steht davor.",
          "Das Partizip ist richtig angeglichen.",
          "Die Sätze behalten die Bedeutung des Präsens.",
        ],
      },
      2: {
        prompt:
          "Erzähle in fünf bis sechs Sätzen im passé composé von deinem gestrigen Tag. Verwende mindestens vier reflexive Verben, eine Verneinung und mindestens eine weibliche und eine männliche Form (zum Beispiel für dich und deine Freundin).",
        hints: [
          "Beginne mit « Hier, je me suis réveillé(e) à … ».",
          "Für die Verneinung: « Je ne me suis pas dépêché(e). »",
        ],
        model:
          "Hier, je me suis réveillé à sept heures. Je me suis levé, puis je me suis douché. Ma sœur ne s’est pas dépêchée, alors elle s’est habillée très vite. Mes amis et moi, nous nous sommes retrouvés devant l’école. Le soir, je me suis couché à dix heures.",
        criteria: [
          "Mindestens vier reflexive Verben im passé composé mit être.",
          "Das Partizip passt zum Subjekt, auch weiblich und im Plural.",
          "Eine Verneinung umschließt Pronomen und Hilfsverb.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Reflexive Verben im passé composé: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Hier, je ", options: ["me suis levé", "ai me levé"], answer: 0, after: " très tôt.", feedback: "Reflexive Verben nehmen im passé composé être." },
          { before: "Elle ", options: ["s’est couchée", "s’est couché"], answer: 0, after: " à dix heures.", feedback: "Das Partizip richtet sich nach dem weiblichen Subjekt." },
          { before: "Nous ", options: ["nous sommes dépêchés", "nous avons nous dépêchés"], answer: 0, after: " ce matin.", feedback: "Das Hilfsverb ist être, das Pronomen nous steht davor." },
          { before: "Ils ", options: ["se sont réveillés", "se sont réveillé"], answer: 0, after: " à sept heures.", feedback: "Das Subjekt ist männlich im Plural, also réveillés." },
          { before: "Tu ", options: ["t’es douché", "te es douché"], answer: 0, after: " après le sport?", feedback: "Te wird vor es zu t’: tu t’es douché." },
          { before: "Elles ", options: ["se sont habillées", "se sont habillé"], answer: 0, after: " pour la fête.", feedback: "Das Subjekt ist weiblich im Plural, also habillées." },
          { before: "Je ne ", options: ["me suis pas levé", "suis me pas levé"], answer: 0, after: " avant huit heures.", feedback: "Ne und pas umschließen Pronomen und Hilfsverb." },
          { before: "Vous ", options: ["vous êtes couchés", "vous avez couchés"], answer: 0, after: " tard hier soir.", feedback: "Das Hilfsverb ist être, das Pronomen vous steht davor." },
        ],
        2: [
          { before: "Ce week-end, ma cousine et ses amies ", options: ["se sont retrouvées", "se sont retrouvés", "ont se retrouvées"], answer: 0, after: " au centre commercial pour faire du shopping ensemble.", feedback: "Das Subjekt ist weiblich im Plural, also retrouvées mit -es." },
          { before: "Hier matin, mon frère ne ", options: ["s’est pas réveillé", "est pas réveillé", "s’a pas réveillé"], answer: 0, after: " à l’heure, et il a raté le bus de sept heures.", feedback: "Ne und pas umschließen s’est. Das Partizip bleibt männlich Singular." },
          { before: "Nous avons beaucoup travaillé et nous ", options: ["nous sommes couchés", "nous avons couchés", "sommes nous couchés"], answer: 0, after: " très tard, après minuit passé.", feedback: "Das Hilfsverb ist être, das Pronomen nous steht davor." },
          { before: "Léa, tu ", options: ["t’es dépêchée", "t’as dépêchée", "te es dépêchée"], answer: 0, after: " pour arriver au cours de dix heures, n’est-ce pas?", feedback: "Das Subjekt tu ist hier ein Mädchen, also dépêchée. Te wird vor es zu t’." },
          { before: "Mes parents ", options: ["se sont connus", "se sont connu", "ont se connus"], answer: 0, after: " pendant un séjour à Paris, il y a vingt ans.", feedback: "Das Subjekt ist männlich im Plural, also connus." },
          { before: "Après la fête, nous ", options: ["nous sommes retrouvés", "nous avons retrouvés", "sommes nous retrouvés"], answer: 0, after: " devant la gare, puis chacun est rentré chez soi.", feedback: "Das passé composé reflexiver Verben wird mit être gebildet, das Pronomen nous steht davor." },
          { before: "Ce matin, je ne ", options: ["me suis pas dépêchée", "me suis pas dépêché", "suis me pas dépêchée"], answer: 0, after: " et j’ai raté mon train, mais ma copine m’a aidée.", feedback: "Die Sprecherin ist ein Mädchen, also dépêchée. Ne und pas umschließen Pronomen und Hilfsverb." },
          { before: "Vous êtes en retard: Vous ", options: ["vous êtes levés", "vous avez levés", "êtes vous levés"], answer: 0, after: " trop tard ce matin?", feedback: "Das Hilfsverb ist être, das Pronomen vous steht davor." },
        ],
      },
    },
  },
  {
    id: "fr-irreguliers-un",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Unregelmäßige Verben: savoir, boire, croire, dire",
    intro:
      "Diese vier Verben musst du auswendig können. Mit ihnen sagst du, was du weißt, trinkst, glaubst und sagst.",
    paragraphs: [
      "**savoir** (wissen, können): je sais, tu sais, il sait, nous savons, vous savez, ils savent. Partizip: su (j’ai su). Es steht vor Sätzen und Infinitiven: « Je sais que tu viens. », « Elle sait nager. » **boire** (trinken): je bois, tu bois, il boit, nous buvons, vous buvez, ils boivent. Partizip: bu (j’ai bu).",
      "**croire** (glauben): je crois, tu crois, il croit, nous croyons, vous croyez, ils croient. Partizip: cru (j’ai cru). Im Plural vor den Endungen -ons und -ez steht -oy-, bei ils croient wieder -oi-. **dire** (sagen): je dis, tu dis, il dit, nous disons, vous **dites**, ils disent. Partizip: dit (j’ai dit).",
      "Die Singularformen klingen bei allen vier Verben gleich: je/tu sais, bois, crois, dis. Du erkennst sie an ihrem Stamm und der Endung -s oder -t. Auffällig ist die Form vous dites von dire (nicht vous disez), die du auch von faire kennst (vous faites).",
      "Typische Fehler sind « Vous disez » (richtig ist vous dites), « Ils boient » (richtig ist ils boivent), « Nous croions » (richtig ist nous croyons) und die falsche Partizipbildung « J’ai boivé » (richtig ist j’ai bu).",
    ],
    terms: [
      { term: "savoir", text: "Wissen oder können: je sais, nous savons, ils savent. Partizip: su." },
      { term: "boire, croire", text: "Boire (je bois, nous buvons, ils boivent; bu) und croire (je crois, nous croyons, ils croient; cru) haben im Plural einen anderen Stamm." },
      { term: "dire", text: "Sagen: je dis, nous disons, vous dites, ils disent. Partizip: dit. Die Form vous dites ist unregelmäßig." },
    ],
    takeaway:
      "Merke dir die Formen: savoir (sais, savons, savent; su), boire (bois, buvons, boivent; bu), croire (crois, croyons, croient; cru), dire (dis, disons, dites, disent; dit). Vous dites ist die Ausnahme.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welche Form ist richtig?",
      answer: "Vous dites la vérité.",
      wrong: ["Vous disez la vérité.", "Vous disent la vérité."],
      explanation:
        "Bei dire lautet die Form für vous dites, nicht regelmäßig disez. Disent gehört zu ils und elles.",
    },
    workshop: {
      kind: "choose",
      title: "Die richtige Form wählen",
      instruction:
        "Bestimme das Subjekt und wähle die passende Verbform. Achte besonders auf nous, vous und ils.",
      items: [
        { before: "Tu ", options: ["sais", "sait", "saves"], answer: 0, after: " parler français?", feedback: "Zu tu gehört bei savoir die Form sais." },
        { before: "Nous ", options: ["buvons", "boivons", "bevons"], answer: 0, after: " de l’eau après le sport.", feedback: "Im Plural wechselt der Stamm bei boire: nous buvons, vous buvez, aber ils boivent." },
        { before: "Ils ", options: ["croient", "croyent", "crois"], answer: 0, after: " que le test est facile.", feedback: "Bei ils lautet die Form von croire croient, mit -oi- und der Endung -ent." },
        { before: "Vous ", options: ["dites", "disez", "disent"], answer: 0, after: " toujours la vérité.", feedback: "Bei dire heißt die Form für vous dites, eine Ausnahme von der Regel." },
        { before: "Hier, j’ai ", options: ["bu", "bois", "boivé"], answer: 0, after: " un jus d’orange au petit déjeuner.", feedback: "Das Partizip von boire ist bu: j’ai bu." },
      ],
      conclusion: "Die vier Verben haben im Plural andere Stämme oder Endungen. Vous dites ist die Ausnahme bei dire.",
    },
    casework: {
      title: "Ein Gespräch beim Essen",
      story:
        "Am Tisch fragt die Gastmutter: « Vous buvez du lait? – Non, nous ne buvons que de l’eau. – Tu sais, mon fils dit que tu parles bien français. – Je crois que c’est un peu exagéré. »",
      steps: [
        {
          question: "Welche Form passt zu « nous » bei boire?",
          options: ["buvons", "boivons", "boirons"],
          answer: 0,
          explanation: "Bei boire wechselt der Stamm im Plural zu buv-: nous buvons, vous buvez.",
        },
        {
          question: "Warum steht « sais » und nicht « sait » in « Tu sais »?",
          options: ["Zu tu gehört die Endung -s.", "Sait passt nur zu ils.", "Savoir hat nur eine Form."],
          answer: 0,
          explanation: "Zu tu gehört bei savoir sais mit -s. Sait gehört zu il und elle.",
        },
        {
          question: "Wie heißt « dit » im passé composé von « il dit que tu parles »?",
          options: ["il a dit", "il est dit", "il a disé"],
          answer: 0,
          explanation: "Dire bildet das passé composé mit avoir und dem Partizip dit.",
        },
      ],
      verdict:
        "Das Gespräch zeigt boire, savoir, dire und croire in Alltagssätzen. Wenn du die Formen kennst, sprichst du flüssiger.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die richtige Form ein: 1. Nous (boire) du thé. 2. Vous (dire) la vérité. 3. Ils (croire) à cette histoire.",
        hints: [
          "Bestimme das Subjekt und suche die Form in der Tabelle.",
          "Achte auf den Wechsel des Stammes im Plural.",
        ],
        model:
          "1. Nous buvons du thé. 2. Vous dites la vérité. 3. Ils croient à cette histoire. Bei boire lautet die Form für nous buvons, bei dire die Form für vous dites, bei croire die Form für ils croient.",
        criteria: [
          "Die Form passt zum Subjekt.",
          "Der Stamm im Plural ist richtig gebildet.",
          "Vous dites ist nicht regelmäßig zu disez gebildet.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über ein Gespräch mit einer Freundin oder einem Freund, in dem es ums Trinken, um das Wissen und um Meinungen geht. Verwende savoir, boire, croire und dire in sinnvollen Sätzen.",
        hints: [
          "Beginne mit « Mon ami dit que… » oder « Je crois que… ».",
          "Nutze mindestens eine Form im Plural.",
        ],
        model:
          "Mon ami dit qu’il ne boit jamais de café. Moi, je crois que le thé est meilleur. Nous savons tous les deux que l’eau est la meilleure boisson. Vous dites toujours que vous préférez le jus d’orange, mais hier, vous avez bu un coca.",
        criteria: [
          "savoir, boire, croire und dire kommen je mindestens einmal vor.",
          "Alle Formen passen zum Subjekt.",
          "Die Sätze ergeben ein verständliches kurzes Gespräch.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "savoir, boire, croire, dire: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je ", options: ["sais", "sait"], answer: 0, after: " nager très bien.", feedback: "Zu je gehört bei savoir die Form sais." },
          { before: "Nous ", options: ["buvons", "boivons"], answer: 0, after: " du thé.", feedback: "Im Plural wechselt der Stamm bei boire zu buv-." },
          { before: "Elle ", options: ["croit", "croyent"], answer: 0, after: " que c’est vrai.", feedback: "Zu elle gehört bei croire die Form croit." },
          { before: "Vous ", options: ["dites", "disez"], answer: 0, after: " la vérité.", feedback: "Bei dire heißt die Form für vous dites." },
          { before: "Ils ", options: ["boivent", "buvent"], answer: 0, after: " de l’eau.", feedback: "Zu ils gehört bei boire die Form boivent." },
          { before: "Tu ", options: ["crois", "croit"], answer: 0, after: " que c’est facile?", feedback: "Zu tu gehört bei croire die Form crois." },
          { before: "J’ai ", options: ["bu", "boivé"], answer: 0, after: " un verre de lait.", feedback: "Das Partizip von boire ist bu." },
          { before: "Ils ", options: ["savent", "sait"], answer: 0, after: " la réponse.", feedback: "Zu ils gehört bei savoir die Form savent." },
        ],
        2: [
          { before: "Mes parents ", options: ["croient", "croyent", "croit"], answer: 0, after: " que nous dormons déjà, mais nous écoutons de la musique dans notre chambre.", feedback: "Zu mes parents (ils) gehört bei croire die Form croient." },
          { before: "Quand nous sommes en Espagne, nous ", options: ["buvons", "boivons", "bevons"], answer: 0, after: " beaucoup d’eau parce qu’il fait très chaud en été.", feedback: "Im Plural wechselt der Stamm bei boire: nous buvons." },
          { before: "Vous ", options: ["dites", "disez", "disent"], answer: 0, after: " que le film est nul, mais moi, je le trouve très drôle.", feedback: "Bei dire heißt die Form für vous dites." },
          { before: "Ma grand-mère ", options: ["sait", "sais", "savent"], answer: 0, after: " tout sur l’histoire de notre village, elle y habite depuis soixante ans.", feedback: "Zu ma grand-mère (elle) gehört bei savoir die Form sait." },
          { before: "Hier soir, mon frère n’a rien ", options: ["dit", "dis", "dite"], answer: 0, after: " pendant le repas, car il était très fatigué.", feedback: "Das Partizip von dire ist dit, es bleibt unverändert." },
          { before: "Tu ", options: ["sais", "sait", "savez"], answer: 0, after: " que nous partons demain à six heures du matin?", feedback: "Zu tu gehört bei savoir die Form sais." },
          { before: "Les élèves ", options: ["boivent", "buvent", "boit"], answer: 0, after: " de l’eau à la cantine, parce qu’il n’y a pas de boissons sucrées.", feedback: "Zu les élèves (ils) gehört bei boire die Form boivent." },
          { before: "Nous ", options: ["croyons", "croions", "croient"], answer: 0, after: " que notre équipe peut gagner le match samedi prochain.", feedback: "Im Plural wechselt bei croire der Stamm zu croy-: nous croyons." },
        ],
      },
    },
  },
  {
    id: "fr-irreguliers-deux",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "devenir, connaître und die Verben auf -ir",
    intro:
      "Devenir, connaître, choisir, réfléchir und finir gehören zum Pflichtwortschatz. Savoir und connaître unterscheidest du nach dem, was folgt.",
    paragraphs: [
      "**devenir** (werden) wird wie venir konjugiert: je deviens, tu deviens, il devient, nous devenons, vous devenez, ils deviennent. Das passé composé bildest du mit être: « Elle est devenue médecin. », « Ils sont devenus amis. » Das Partizip richtet sich nach dem Subjekt. **connaître** (kennen): je connais, tu connais, il connaît, nous connaissons, vous connaissez, ils connaissent. Partizip: connu (j’ai connu).",
      "Den Unterschied zwischen **savoir** und **connaître** merkst du dir so: Savoir steht für Fakten, Fähigkeiten und mit que: « Je sais que Paris est grand. », « Elle sait nager. » Connaître steht für Personen, Orte und Dinge, mit denen du vertraut bist: « Je connais Paris. », « Tu connais Max? » Nach savoir folgt ein Satz oder Infinitiv, nach connaître ein Nomen.",
      "Die Verben **choisir** (wählen), **réfléchir** (nachdenken) und **finir** (beenden) gehören zu den Verben auf -ir mit Erweiterung -iss-: je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent. Die Partizipien sind regelmäßig: fini, choisi, réfléchi (j’ai fini, tu as choisi, ils ont réfléchi).",
      "Typische Fehler sind « J’ai devenu » (devenir bildet das passé composé mit être: je suis devenu), « Je sais Paris » (für Orte nimmst du connaître) und « Nous finons » (richtig ist nous finissons mit -iss-).",
    ],
    terms: [
      { term: "devenir", text: "Werden. Wie venir: je deviens, nous devenons, ils deviennent. Das passé composé wird mit être gebildet: elle est devenue." },
      { term: "savoir und connaître", text: "Savoir: etwas wissen oder können (Satz, Infinitiv). Connaître: jemanden oder etwas kennen (Nomen: Person, Ort, Sache)." },
      { term: "Verben auf -ir mit -iss-", text: "Choisir, réfléchir, finir haben im Plural die Erweiterung -iss-: nous finissons, vous finissez, ils finissent." },
    ],
    takeaway:
      "Devenir geht wie venir und nimmt être im passé composé. Savoir für Fakten und Fähigkeiten, connaître für Personen, Orte und Dinge. Choisir, réfléchir und finir haben im Plural -iss-.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "Je connais Paris.",
      wrong: ["Je sais Paris.", "Je connaît Paris."],
      explanation:
        "Paris ist ein Ort, mit dem du vertraut bist, also connaître. Zu je gehört die Form connais, nicht connaît.",
    },
    workshop: {
      kind: "choose",
      title: "Die passende Form wählen",
      instruction:
        "Bestimme zuerst das Verb und das Subjekt. Bei savoir und connaître achtest du darauf, was folgt.",
      items: [
        { before: "Elle ", options: ["est devenue", "a devenu", "est devenu"], answer: 0, after: " médecin après ses études.", feedback: "Devenir bildet das passé composé mit être, und das Partizip richtet sich nach elle: devenue." },
        { before: "Je ", options: ["connais", "sais", "connaisse"], answer: 0, after: " bien cette ville.", feedback: "Cette ville ist ein Ort, mit dem du vertraut bist. Dafür steht connaître." },
        { before: "Nous ", options: ["finissons", "finons", "finissent"], answer: 0, after: " les devoirs avant le dîner.", feedback: "Bei finir kommt im Plural -iss- dazu: nous finissons." },
        { before: "Tu ", options: ["choisis", "choisit", "choisisses"], answer: 0, after: " un film ce soir?", feedback: "Zu tu gehört bei choisir die Form choisis." },
        { before: "Ils ", options: ["réfléchissent", "réfléchissons", "réfléchisent"], answer: 0, after: " avant de répondre.", feedback: "Zu ils gehört bei réfléchir die Form réfléchissent mit -iss-." },
      ],
      conclusion: "Devenir nimmt être, savoir und connaître unterscheidest du nach dem folgenden Teil, und die Verben auf -ir haben im Plural -iss-.",
    },
    casework: {
      title: "Ein Berufswunsch",
      story:
        "Im Gespräch sagt Jules: « Je sais que je veux devenir cuisinier. Ma tante connaît un restaurant à Lyon. Ma sœur a choisi une autre voie, elle est devenue infirmière. »",
      steps: [
        {
          question: "Warum steht « sais » in « Je sais que je veux… »?",
          options: ["Danach folgt ein Satz mit que.", "Danach folgt ein Ort.", "Savoir gilt nur für Personen."],
          answer: 0,
          explanation: "Savoir steht vor Sätzen mit que und vor Infinitiven. Für Orte und Personen nimmst du connaître.",
        },
        {
          question: "Warum steht « connaît » in « Ma tante connaît un restaurant »?",
          options: ["Nach connaître folgt ein Nomen.", "Connaître steht nach tante in diesem Satz.", "Restaurant ist hier eine Tätigkeit."],
          answer: 0,
          explanation: "Connaître steht, wenn jemand etwas oder jemanden kennt, also vor einem Nomen.",
        },
        {
          question: "Warum heißt es « est devenue »?",
          options: ["Devenir nimmt être im passé composé.", "Devenir nimmt im passé composé immer avoir.", "Weil sie in diesem Satz Lehrerin geworden ist."],
          answer: 0,
          explanation: "Das passé composé von devenir wird mit être gebildet, und das Partizip richtet sich nach dem Subjekt.",
        },
      ],
      verdict:
        "Jules benutzt savoir für eine Tatsache, connaître für einen Ort und devenir mit être im passé composé. Das sind Muster, die du in Berufsgesprächen oft brauchst.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die richtige Form ein: 1. Elle (devenir) professeure. (passé composé) 2. Je (connaître / savoir) ce garçon. 3. Nous (finir) le projet.",
        hints: [
          "Denke an das Hilfsverb bei devenir.",
          "Überlege, ob nach dem Verb eine Person oder ein Satz folgt.",
        ],
        model:
          "1. Elle est devenue professeure. 2. Je connais ce garçon. 3. Nous finissons le projet. Devenir nimmt im passé composé être, und das Partizip passt zu elle. Ein bestimmter Junge ist eine Person, also connaître. Finir hat im Plural -iss-.",
        criteria: [
          "Devenir hat im passé composé être und die richtige Angleichung.",
          "Connaître steht bei einer Person, savoir bei einem Satz.",
          "Finir hat die Endung -issons.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über deinen Berufswunsch. Verwende devenir, savoir, connaître und mindestens ein Verb auf -ir (choisir, finir, réfléchir).",
        hints: [
          "Beginne mit « Je veux devenir… » oder « Je réfléchis à mon avenir. ».",
          "Nutze savoir mit einem Satz und connaître mit einer Person oder einem Ort.",
        ],
        model:
          "Je réfléchis beaucoup à mon avenir. Je veux devenir infirmière, parce que je sais que ce métier est utile. Ma tante connaît un hôpital à Munich et nous finissons bientôt un stage ensemble. Mes amis choisissent d’autres métiers.",
        criteria: [
          "Devenir, savoir und connaître werden passend verwendet.",
          "Mindestens ein Verb auf -ir hat die richtige Form mit -iss-.",
          "Der Text beschreibt den Berufswunsch verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "devenir, connaître, -ir-Verben: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Il ", options: ["devient", "devenit"], answer: 0, after: " de plus en plus grand.", feedback: "Devenir geht wie venir: il devient." },
          { before: "Je ", options: ["connais", "sais"], answer: 0, after: " ton frère.", feedback: "Eine Person kennt man mit connaître." },
          { before: "Je ", options: ["sais", "connais"], answer: 0, after: " que tu viens.", feedback: "Vor einem Satz mit que steht savoir." },
          { before: "Nous ", options: ["finissons", "finons"], answer: 0, after: " à midi.", feedback: "Im Plural kommt bei finir -iss- dazu." },
          { before: "Elle ", options: ["choisit", "choisis"], answer: 0, after: " un livre.", feedback: "Zu elle gehört die Endung -it." },
          { before: "Ils ", options: ["réfléchissent", "réfléchissons"], answer: 0, after: " bien avant de répondre.", feedback: "Zu ils gehört die Endung -issent." },
          { before: "Elle ", options: ["est devenue", "a devenu"], answer: 0, after: " médecin.", feedback: "Devenir nimmt im passé composé être." },
          { before: "Tu ", options: ["connais", "connaît"], answer: 0, after: " bien la ville de Paris?", feedback: "Zu tu gehört die Form connais." },
        ],
        2: [
          { before: "Après son stage, mon cousin ", options: ["est devenu", "a devenu", "est devenue"], answer: 0, after: " plus sûr de lui et il a décidé de continuer dans cette entreprise.", feedback: "Devenir nimmt être, und das Partizip richtet sich nach dem männlichen Subjekt." },
          { before: "Je ne ", options: ["connais pas", "sais pas", "connaît pas"], answer: 0, after: " cette ville, mais mon oncle y habite depuis dix ans.", feedback: "Eine Stadt kennt man mit connaître. Zu je gehört connais." },
          { before: "Tu ", options: ["sais", "connais", "sait"], answer: 0, after: " que le musée ferme à dix-huit heures, n’est-ce pas?", feedback: "Vor einem Satz mit que steht savoir, zu tu gehört sais." },
          { before: "Nous ", options: ["choisissons", "choisons", "choisissent"], answer: 0, after: " un restaurant pour fêter l’anniversaire de notre grand-mère ce week-end.", feedback: "Bei choisir kommt im Plural -iss- dazu: nous choisissons." },
          { before: "Les élèves ", options: ["réfléchissent", "réfléchisent", "réfléchissons"], answer: 0, after: " longtemps avant de choisir un thème pour l’exposé de la semaine prochaine.", feedback: "Zu les élèves (ils) gehört réfléchissent mit -iss-." },
          { before: "Quand vous ", options: ["finissez", "finisez", "finit"], answer: 0, after: " vos devoirs, vous pouvez regarder un film avec vos frères.", feedback: "Zu vous gehört die Form finissez mit -iss-." },
          { before: "Mes amies ", options: ["sont devenues", "ont devenu", "sont devenus"], answer: 0, after: " très sportives depuis qu’elles s’entraînent ensemble après l’école.", feedback: "Devenir nimmt être, und das Partizip richtet sich nach dem weiblichen Plural: devenues." },
          { before: "Elle ", options: ["connaît", "sait", "connais"], answer: 0, after: " bien le directeur du collège, parce qu’il habite dans sa rue.", feedback: "Eine Person kennt man mit connaître. Zu elle gehört connaît." },
        ],
      },
    },
  },
];
