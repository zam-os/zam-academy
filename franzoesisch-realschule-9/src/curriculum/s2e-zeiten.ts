import type { Lesson } from "../model/types";

/**
 * Stufe 2, fünfter Teil: Grammatik, zeitliche Bezüge und Bedingungen (Kompetenzerwartungen 1.2.2.4
 * bis 1.2.2.6): imparfait, Unterschied zum passé composé, futur simple und die Bedingung Typ I.
 */
export const S2E: Lesson[] = [
  {
    id: "fr-imparfait-formes",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Der imparfait: Formen",
    intro:
      "Den imparfait bildest du aus dem Stamm der nous-Form des Präsens plus -ais, -ais, -ait, -ions, -iez, -aient. Être hat einen eigenen Stamm.",
    paragraphs: [
      "Der **imparfait** ist eine Vergangenheitsform. Du bildest ihn so: Nimm die nous-Form des Präsens, streiche -ons und hänge die Endungen an: -ais, -ais, -ait, -ions, -iez, -aient. Beispiel parler: nous parlons → je parlais, tu parlais, il parlait, nous parlions, vous parliez, ils parlaient. Ebenso finir (nous finissons → je finissais), faire (nous faisons → je faisais), prendre (nous prenons → je prenais) und aller (nous allons → j’allais).",
      "Eine Ausnahme ist **être**. Der Stamm lautet ét-: j’étais, tu étais, il était, nous étions, vous étiez, ils étaient. Auch avoir, pouvoir und vouloir folgen der Regel mit ihrem Stamm: j’avais, je pouvais, je voulais. Merke dir ebenso venir (je venais), savoir (je savais), boire (je buvais), dire (je disais) und croire (je croyais).",
      "Bei einigen Verben ändert sich die Schreibung, damit die Aussprache stimmt: Bei manger bleibt das -e- vor -a-: je mangeais, aber nous mangions. Bei commencer steht ç vor a: je commençais, aber nous commencions. Bei Verben auf -ier steht bei nous und vous zweimal i: nous étudiions, vous étudiiez.",
      "Die Endungen -ais, -ait und -aient klingen gleich. Du musst beim Schreiben deshalb auf das Subjekt achten. Typische Fehler sind « il faisait » als « il faisais », « je commencais » statt je commençais und ein falscher Stamm bei être, zum Beispiel « j’esté ».",
    ],
    terms: [
      { term: "imparfait", text: "Eine Vergangenheitsform für Zustände, Gewohnheiten und Hintergrund. Sie wird aus dem Stamm der nous-Form plus -ais, -ait, -ions gebildet." },
      { term: "Stamm der nous-Form", text: "Aus nous parlons wird der Stamm parl-, aus nous finissons der Stamm finiss-. Daran hängst du die Endungen." },
      { term: "être im imparfait", text: "Das Verb être hat den eigenen Stamm ét-: j’étais, tu étais, il était, nous étions, vous étiez, ils étaient." },
    ],
    takeaway:
      "Imparfait = Stamm der nous-Form ohne -ons + -ais, -ais, -ait, -ions, -iez, -aient. Être hat den Stamm ét-. Bei manger und commencer steht -ge- und ç vor a (je mangeais, je commençais), nicht aber vor i.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie lautet der imparfait von manger für je?",
      answer: "je mangeais",
      wrong: ["je mangais", "je mangeait"],
      explanation:
        "Vor a behält manger das -e-, damit das g weich bleibt. Zu je gehört -ais, nicht -ait. Je mangais würde das g hart sprechen.",
    },
    workshop: {
      kind: "choose",
      title: "Den imparfait bilden",
      instruction:
        "Bestimme das Subjekt, nimm den Stamm der nous-Form und wähle die passende Endung. Achte auf Sonderfälle.",
      items: [
        { before: "Quand j’étais petit, je ", options: ["jouais", "jouait", "jouions"], answer: 0, after: " souvent dans le jardin.", feedback: "Zu je gehört im imparfait die Endung -ais: je jouais." },
        { before: "Elle ", options: ["avait", "avais", "avaient"], answer: 0, after: " un chat noir et blanc.", feedback: "Zu elle gehört -ait: elle avait. Avais gehört zu je und tu." },
        { before: "Nous ", options: ["mangions", "mangeions", "mangeons"], answer: 0, after: " toujours à la cantine.", feedback: "Bei nous steht kein zusätzliches -e-, weil danach ein i folgt: nous mangions." },
        { before: "Ils ", options: ["étaient", "étiez", "était"], answer: 0, after: " très contents du résultat.", feedback: "Être hat den Stamm ét-. Zu ils gehört -aient: ils étaient." },
        { before: "Je ", options: ["commençais", "commencais", "commençait"], answer: 0, after: " à travailler à huit heures.", feedback: "Vor a steht ç, damit das c weich bleibt: je commençais." },
      ],
      conclusion: "Zuerst das Subjekt, dann der Stamm der nous-Form und die passende Endung. Bei manger und commencer achtest du auf die Schreibung.",
    },
    casework: {
      title: "Erinnerungen an den Sommer",
      story:
        "Eine Schülerin schreibt: « Quand j’étais petite, nous allions chaque été chez mes grands-parents. Nous mangions des fruits du jardin et je commençais la journée avec un grand verre de lait. Mon frère finissait toujours le premier. »",
      steps: [
        {
          question: "Wie ist « nous allions » gebildet?",
          options: ["Stamm all- aus nous allons plus -ions.", "Stamm ir- plus -ions wie beim futur simple.", "Stamm aill- plus -ons aus dem Präsens."],
          answer: 0,
          explanation: "Nous allons ergibt den Stamm all-, dazu kommt die Endung -ions.",
        },
        {
          question: "Warum steht « je commençais » mit ç?",
          options: ["Das c soll vor a weich bleiben.", "Das c soll vor a hart bleiben.", "Weil das Verb unregelmäßig ist."],
          answer: 0,
          explanation: "Vor a würde ein c wie k klingen. Die Cédille ç bewahrt den weichen Laut.",
        },
        {
          question: "Warum endet « mon frère finissait » auf -ait?",
          options: ["Zu il oder elle gehört -ait.", "Weil finir mit i endet.", "Weil toujours -ait verlangt."],
          answer: 0,
          explanation: "Die Endung hängt vom Subjekt ab. Mon frère entspricht il, also -ait.",
        },
      ],
      verdict:
        "Der Text verwendet den imparfait in drei Formen: nous allions, je commençais und il finissait. Stamm und Endung bestimmen die Form.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde den imparfait: 1. je (jouer) 2. nous (manger) 3. ils (être)",
        hints: [
          "Nimm die nous-Form des Präsens und streiche -ons.",
          "Prüfe bei manger die Schreibung, bei être den eigenen Stamm.",
        ],
        model:
          "1. je jouais 2. nous mangions 3. ils étaient. Bei jouer ist der Stamm jou-, bei manger bleibt das -e- nur vor a (je mangeais), nicht vor i (nous mangions). Être hat den Stamm ét- und zu ils gehört -aient.",
        criteria: [
          "Die Endung passt zum Subjekt.",
          "Der Stamm ist richtig gebildet (auch bei être).",
          "Besonderheiten bei manger sind beachtet.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über deine Kindheit mit mindestens fünf Verben im imparfait (zum Beispiel être, avoir, jouer, manger, aller). Verwende verschiedene Personen.",
        hints: [
          "Beginne mit « Quand j’étais petit(e), … ».",
          "Nutze je, nous und ils für verschiedene Endungen.",
        ],
        model:
          "Quand j’étais petite, j’habitais dans un petit village. Nous jouions souvent dans le jardin de mes grands-parents. Mon frère avait un vélo rouge et il allait partout avec ses amis. Chaque été, nous mangions des fruits au soleil. Mes parents étaient toujours contents.",
        criteria: [
          "Mindestens fünf Verben stehen im imparfait.",
          "Die Endungen passen zu verschiedenen Subjekten.",
          "Der Text beschreibt die Kindheit verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Imparfait: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form des imparfait. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Quand j’étais petit, je ", options: ["jouais", "jouait"], answer: 0, after: " au foot.", feedback: "Zu je gehört im imparfait die Endung -ais." },
          { before: "Elle ", options: ["avait", "avais"], answer: 0, after: " un grand jardin.", feedback: "Zu elle gehört im imparfait die Endung -ait." },
          { before: "Nous ", options: ["allions", "allons"], answer: 0, after: " souvent à la mer.", feedback: "Im imparfait steht bei nous die Endung -ions." },
          { before: "Vous ", options: ["parliez", "parlez"], answer: 0, after: " toujours très vite.", feedback: "Im imparfait steht bei vous die Endung -iez." },
          { before: "Ils ", options: ["étaient", "étions"], answer: 0, after: " contents hier soir.", feedback: "Zu ils gehört -aient: ils étaient." },
          { before: "Tu ", options: ["finissais", "finissait"], answer: 0, after: " toujours le premier.", feedback: "Zu tu gehört -ais, der Stamm ist finiss-." },
          { before: "Je ", options: ["mangeais", "mangais"], answer: 0, after: " toujours à midi.", feedback: "Vor a bleibt das -e- bei manger." },
          { before: "Nous ", options: ["commencions", "commençions"], answer: 0, after: " tous les jours à huit heures.", feedback: "Vor i braucht c keine Cédille: nous commencions." },
        ],
        2: [
          { before: "À cette époque, mes grands-parents ", options: ["habitaient", "habitait", "habitions"], answer: 0, after: " dans un petit village de campagne près de la forêt.", feedback: "Zu mes grands-parents (ils) gehört die Endung -aient." },
          { before: "Quand nous étions enfants, nous ", options: ["jouions", "jouons", "jouaient"], answer: 0, after: " souvent dans la rue avec les enfants de notre quartier.", feedback: "Im imparfait steht bei nous die Endung -ions." },
          { before: "Avant, mon père ", options: ["prenait", "prenais", "prenaient"], answer: 0, after: " toujours le train pour aller travailler dans la grande ville.", feedback: "Zu mon père (il) gehört die Endung -ait; der Stamm ist wie bei nous prenons: pren-." },
          { before: "Quand je ", options: ["commençais", "commencais", "commençait"], answer: 0, after: " à lire, je ne comprenais pas tous les mots dans les livres.", feedback: "Vor a steht ç, damit das c weich bleibt: je commençais." },
          { before: "Vous ", options: ["étiez", "étiez-vous", "étaient"], answer: 0, after: " très jeunes à cette époque et vous habitiez déjà à Paris.", feedback: "Être hat den Stamm ét-, zu vous gehört -iez: vous étiez." },
          { before: "Chaque été, nous ", options: ["mangions", "mangeions", "mangeons"], answer: 0, after: " des glaces sur la plage, après avoir nagé dans la mer.", feedback: "Bei nous steht im imparfait kein zusätzliches -e-, weil danach i folgt." },
          { before: "Quand ils ", options: ["étaient", "était", "étions"], answer: 0, after: " plus jeunes, mes frères allaient à l’école à pied tous les jours.", feedback: "Zu ils gehört bei être im imparfait étaient." },
          { before: "Mon cousin ", options: ["avait", "avais", "avaient"], answer: 0, after: " un petit chien qui le suivait partout dans la maison.", feedback: "Zu mon cousin (il) gehört die Endung -ait: il avait." },
        ],
      },
    },
  },
  {
    id: "fr-imparfait-emploi",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Der imparfait: Gebrauch",
    intro:
      "Mit dem imparfait beschreibst du Zustände, Gewohnheiten und gleichzeitige Handlungen in der Vergangenheit.",
    paragraphs: [
      "Der imparfait beschreibt, wie etwas war. Du verwendest ihn für **Zustände und Hintergrund**: Wetter, Aussehen, Gefühle, Alter. « Il faisait beau. », « Elle avait douze ans. », « J’étais fatigué. », « La maison était grande et jaune. » Der imparfait sagt nichts über Anfang oder Ende.",
      "Außerdem verwendest du ihn für **Gewohnheiten und Wiederholungen** in der Vergangenheit: « Tous les étés, nous allions à la mer. », « Quand j’étais petit, je jouais au foot après l’école. » Signalwörter sind souvent, toujours, chaque jour, tous les …, d’habitude, autrefois und à cette époque-là.",
      "Drittens beschreibt der imparfait **gleichzeitig ablaufende Handlungen**: « Pendant que je lisais, ma sœur écoutait de la musique. » Beide Handlungen laufen nebeneinander, ohne dass eine fertig wird. In Erzählungen bildet der imparfait den Rahmen, in dem dann einzelne Ereignisse im passé composé geschehen. Das übst du in der nächsten Lektion.",
      "Im Deutschen verwendest du für diese Fälle Präteritum oder Perfekt („Es war schön“, „Wir sind jedes Jahr ans Meer gefahren“). Im Französischen wählst du nach Sinn: Beschreibungen und Gewohnheiten sind imparfait. Ein typischer Fehler ist das passé composé für eine Gewohnheit: « Chaque été, nous sommes allés à la mer » beschreibt nur ein einziges Mal und passt hier nicht.",
    ],
    terms: [
      { term: "Zustand und Hintergrund", text: "Der imparfait beschreibt Wetter, Aussehen, Gefühle und Alter in der Vergangenheit: il faisait beau, elle avait douze ans." },
      { term: "Gewohnheit", text: "Der imparfait drückt Handlungen aus, die sich wiederholten: tous les étés, nous allions à la mer." },
      { term: "Gleichzeitigkeit", text: "Mit pendant que verbindest du zwei Handlungen im imparfait, die nebeneinander ablaufen." },
    ],
    takeaway:
      "Imparfait für Zustände, Hintergrund, Gewohnheiten und gleichzeitige Handlungen in der Vergangenheit. Signalwörter: souvent, toujours, chaque jour, d’habitude, autrefois, pendant que.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Früher spielte ich jeden Tag Fußball“?",
      answer: "Chaque jour, je jouais au foot.",
      wrong: ["Chaque jour, j’ai joué au foot.", "Chaque jour, je joue au foot."],
      explanation:
        "Eine Gewohnheit in der Vergangenheit drückst du mit dem imparfait aus. Das passé composé meint einen einzelnen Vorgang, das Präsens passt nicht zu früher.",
    },
    workshop: {
      kind: "classify",
      title: "Wofür steht der imparfait?",
      instruction:
        "Ordne jeden Satz der Verwendung des imparfait zu: Beschreibung (Zustand, Hintergrund), Gewohnheit oder gleichzeitige Handlungen.",
      categories: ["Beschreibung", "Gewohnheit", "Gleichzeitigkeit"],
      entries: [
        { text: "Il faisait très chaud et le ciel était bleu.", target: 0, feedback: "Wetter und Himmel beschreiben einen Zustand, der den Hintergrund bildet." },
        { text: "Tous les étés, nous allions chez nos grands-parents.", target: 1, feedback: "Tous les étés zeigt eine wiederholte Handlung, also eine Gewohnheit." },
        { text: "Pendant que je faisais mes devoirs, ma sœur écoutait de la musique.", target: 2, feedback: "Pendant que verbindet zwei Handlungen, die zur selben Zeit ablaufen." },
        { text: "Ma grand-mère avait un grand jardin avec beaucoup de fleurs.", target: 0, feedback: "Hier wird beschrieben, was die Großmutter hatte: ein Zustand." },
        { text: "Quand j’étais petit, je jouais au foot chaque samedi.", target: 1, feedback: "Chaque samedi zeigt eine Wiederholung in der Vergangenheit." },
        { text: "Elle lisait pendant que le train traversait la campagne.", target: 2, feedback: "Pendant que verbindet zwei gleichzeitig ablaufende Vorgänge." },
      ],
      conclusion: "Zustand und Hintergrund, Gewohnheit und Gleichzeitigkeit sind die drei typischen Fälle für den imparfait.",
    },
    casework: {
      title: "Früher im Dorf",
      story:
        "Mein Großvater erzählt: « Autrefois, le village était petit. Les enfants jouaient dans la rue et ma mère faisait le pain tous les matins. Pendant que mon père travaillait dans les champs, je gardais les vaches. »",
      steps: [
        {
          question: "Warum steht « le village était petit » im imparfait?",
          options: ["Es beschreibt einen Zustand.", "Es ist ein einmaliges Ereignis.", "Es steht nach pendant que."],
          answer: 0,
          explanation: "Ein Zustand in der Vergangenheit steht im imparfait.",
        },
        {
          question: "Was zeigt « tous les matins »?",
          options: ["Eine Gewohnheit in der Vergangenheit.", "Eine Handlung, die gerade beginnt.", "Eine abgeschlossene Handlung."],
          answer: 0,
          explanation: "Tous les matins zeigt, dass sich etwas regelmäßig wiederholte. Dafür nimmst du den imparfait.",
        },
        {
          question: "Was drückt « pendant que » aus?",
          options: ["Gleichzeitigkeit zweier Handlungen.", "Zwei aufeinanderfolgende Handlungen.", "Eine einmalige Handlung."],
          answer: 0,
          explanation: "Pendant que verbindet Handlungen, die zur selben Zeit ablaufen, mit dem imparfait.",
        },
      ],
      verdict:
        "Der Großvater beschreibt Früher: Zustand, Gewohnheit und Gleichzeitigkeit stehen im imparfait. Einzelne Ereignisse würden im passé composé folgen.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die Verben in den imparfait: 1. Quand j’étais petit, je (jouer) toujours dans le jardin. 2. Il (faire) beau. 3. Pendant que je (lire), mon frère (écouter) de la musique.",
        hints: [
          "Bilde den imparfait aus der nous-Form des Präsens.",
          "Prüfe, welches Subjekt zu welchem Verb gehört.",
        ],
        model:
          "1. Quand j’étais petit, je jouais toujours dans le jardin. 2. Il faisait beau. 3. Pendant que je lisais, mon frère écoutait de la musique. Alle drei Sätze beschreiben eine Gewohnheit, einen Zustand beziehungsweise gleichzeitige Handlungen, also steht jeweils der imparfait.",
        criteria: [
          "Alle Verben stehen im imparfait.",
          "Die Endungen passen zum Subjekt.",
          "Stamm und Schreibung sind richtig.",
        ],
      },
      2: {
        prompt:
          "Beschreibe in fünf bis sechs Sätzen, wie dein Schulweg oder ein Ferienort in der Kindheit war. Verwende den imparfait für Beschreibung, Gewohnheit und Gleichzeitigkeit.",
        hints: [
          "Beginne mit « Quand j’étais petit(e), … ».",
          "Nutze Signalwörter wie souvent, toujours, chaque jour und pendant que.",
        ],
        model:
          "Quand j’étais petite, ma maison était près d’un grand lac. Il y avait beaucoup d’arbres autour. Chaque matin, mon père me conduisait à l’école. Pendant qu’il conduisait, je regardais les canards sur l’eau. Souvent, nous nous arrêtions pour les voir. J’étais toujours contente.",
        criteria: [
          "Beschreibung, Gewohnheit und Gleichzeitigkeit kommen vor.",
          "Alle Verbformen sind korrekt gebildet.",
          "Signalwörter werden passend eingesetzt.",
        ],
      },
    },
  },
  {
    id: "fr-imparfait-pc",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Imparfait oder passé composé?",
    intro:
      "Der imparfait beschreibt den Rahmen, das passé composé das Ereignis. Mit Signalwörtern wählst du die richtige Zeit.",
    paragraphs: [
      "In einer Erzählung in der Vergangenheit gibt es zwei Ebenen. Der **imparfait** beschreibt den Rahmen: Wetter, Zustände, Gewohnheiten, was gerade lief. Das **passé composé** erzählt das, was passiert ist: einzelne, abgeschlossene Ereignisse. « Il pleuvait quand je suis sorti. » (Rahmen: Regen, Ereignis: ich bin gegangen.) « Je regardais la télé quand le téléphone a sonné. »",
      "Signalwörter helfen bei der Wahl. Für den imparfait: toujours, souvent, d’habitude, chaque jour, tous les …, pendant que, à cette époque-là. Für das passé composé: un jour, hier, soudain, tout à coup, puis, ensuite, une fois, à huit heures. Aufeinanderfolgende Handlungen stehen im passé composé: « Je me suis levé, j’ai pris mon petit déjeuner et je suis parti. »",
      "Verben des Zustands wie être, avoir, pouvoir, vouloir oder croire stehen meist im imparfait, wenn sie einen Zustand beschreiben: « J’étais fatigué. », « Il avait faim. » Ein Ereignis steht dagegen im passé composé: « Soudain, j’ai eu peur. » Wichtig ist immer die Frage: Beschreibe ich, wie es war, oder erzähle ich, was geschah?",
      "Typische Fehler sind das passé composé für eine Gewohnheit (« Chaque été, nous sommes allés au bord de la mer »), und der imparfait für ein abgeschlossenes Ereignis (« Hier, il faisait un gâteau »). Besser: « Hier, il a fait un gâteau. »",
    ],
    terms: [
      { term: "Rahmen und Ereignis", text: "Der imparfait beschreibt den Rahmen einer Geschichte. Das passé composé erzählt die Ereignisse darin." },
      { term: "Signalwörter", text: "Imparfait: toujours, souvent, d’habitude, pendant que. Passé composé: un jour, hier, soudain, tout à coup, puis, ensuite." },
      { term: "Handlungsfolge", text: "Mehrere aufeinanderfolgende Handlungen stehen im passé composé: je me suis levé, j’ai mangé, je suis parti." },
    ],
    takeaway:
      "Imparfait für Rahmen, Zustand, Gewohnheit und gleichzeitige Handlungen, passé composé für einzelne, abgeschlossene Ereignisse und Handlungsfolgen. Signalwörter wie soudain oder hier weisen auf das passé composé.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig: „Es regnete, als ich wegging“?",
      answer: "Il pleuvait quand je suis parti.",
      wrong: ["Il pleut quand je suis parti.", "Il a plu quand je partais."],
      explanation:
        "Der Regen ist der Rahmen (imparfait), das Weggehen ist das Ereignis (passé composé). Im zweiten Satz stehen beide Zeiten vertauscht, im ersten steht das Präsens zur falschen Zeit.",
    },
    workshop: {
      kind: "choose",
      title: "Imparfait oder passé composé wählen",
      instruction:
        "Frage dich: Beschreibe ich einen Rahmen oder erzähle ich ein Ereignis? Achte auf die Signalwörter.",
      items: [
        { before: "Hier soir, je ", options: ["regardais", "ai regardé", "regarde"], answer: 0, after: " la télé quand le téléphone a sonné.", feedback: "Das Fernsehen lief gerade, es war der Rahmen. Das Klingeln war das Ereignis im passé composé." },
        { before: "Soudain, un chat ", options: ["est entré", "entrait", "entre"], answer: 0, after: " dans la cuisine.", feedback: "Soudain zeigt ein einzelnes Ereignis. Dafür steht das passé composé." },
        { before: "Quand j’étais petit, je ", options: ["jouais", "ai joué", "joue"], answer: 0, after: " tous les jours dans la rue.", feedback: "Tous les jours zeigt eine Gewohnheit in der Vergangenheit, also imparfait." },
        { before: "Il faisait beau, donc nous ", options: ["sommes allés", "allions", "allons"], answer: 0, after: " à la plage.", feedback: "Der Entschluss, zum Strand zu gehen, ist ein einzelnes Ereignis. Das Wetter bildet den Rahmen." },
        { before: "Pendant que mon père ", options: ["préparait", "a préparé", "prépare"], answer: 0, after: " le dîner, je faisais mes devoirs.", feedback: "Pendant que zeigt gleichzeitig ablaufende Handlungen im imparfait." },
      ],
      conclusion: "Rahmen und Gewohnheit im imparfait, einzelne Ereignisse im passé composé, Signalwörter helfen bei der Wahl.",
    },
    casework: {
      title: "Ein Unfall auf dem Schulweg",
      story:
        "Léo erzählt: « Ce matin, il pleuvait et je marchais vers l’école. Soudain, un vélo m’a heurté. J’ai crié, puis une dame est arrivée. Elle était très gentille et elle m’a aidé. »",
      steps: [
        {
          question: "Warum steht « il pleuvait » im imparfait?",
          options: ["Es beschreibt den Rahmen.", "Es zeigt ein Ereignis.", "Es folgt auf soudain."],
          answer: 0,
          explanation: "Das Wetter ist der Rahmen, in dem das Ereignis passiert.",
        },
        {
          question: "Warum steht « m’a heurté » im passé composé?",
          options: ["Es ist ein einzelnes Ereignis.", "Es beschreibt eine Gewohnheit.", "Es ist eine Beschreibung."],
          answer: 0,
          explanation: "Soudain kündigt ein Ereignis an, das abgeschlossen ist.",
        },
        {
          question: "Warum steht « elle était très gentille » im imparfait?",
          options: ["Es beschreibt einen Zustand.", "Es zeigt eine Handlung nach der anderen.", "Es ist ein Befehl."],
          answer: 0,
          explanation: "Eine Eigenschaft der Dame beschreibt einen Zustand, also imparfait.",
        },
      ],
      verdict:
        "Léos Bericht zeigt beide Ebenen: Der imparfait liefert Wetter und Eigenschaft, das passé composé die Handlungen.",
    },
    tasks: {
      1: {
        prompt:
          "Wähle die richtige Zeit: 1. Hier, je (aller) au cinéma. 2. Quand j’(être) petit, je (jouer) au foot. 3. Soudain, il (pleuvoir).",
        hints: [
          "Frage dich: Rahmen, Gewohnheit oder einzelnes Ereignis?",
          "Beachte die Signalwörter hier und soudain.",
        ],
        model:
          "1. Hier, je suis allé au cinéma. 2. Quand j’étais petit, je jouais au foot. 3. Soudain, il a plu. Satz 1 und 3 sind einzelne Ereignisse (passé composé), Satz 2 beschreibt eine Gewohnheit (imparfait).",
        criteria: [
          "Einzelne Ereignisse stehen im passé composé.",
          "Gewohnheit und Beschreibung stehen im imparfait.",
          "Die Formen sind richtig gebildet, mit être bei aller.",
        ],
      },
      2: {
        prompt:
          "Erzähle in sechs bis sieben Sätzen eine kurze Geschichte aus einem Ferientag. Verwende den imparfait für Wetter und Zustand und das passé composé für die Ereignisse. Nutze mindestens zwei Signalwörter.",
        hints: [
          "Beginne mit Rahmen: « Ce jour-là, il faisait … ».",
          "Setze Ereignisse mit soudain, puis oder ensuite.",
        ],
        model:
          "Ce jour-là, il faisait beau et nous étions au bord de la mer. Nous jouions au volley quand soudain, un chien est arrivé. Il a pris notre ballon et il est parti en courant. Puis nous avons couru derrière lui pendant que ses maîtres riaient. Finalement, nous avons récupéré le ballon. C’était une belle journée.",
        criteria: [
          "Rahmen im imparfait, Ereignisse im passé composé.",
          "Mindestens zwei Signalwörter passend eingesetzt.",
          "Die Geschichte ist in sich stimmig und verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Imparfait oder passé composé: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die passende Zeit. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Hier, je ", options: ["suis allé", "allais"], answer: 0, after: " au cinéma avec Paul.", feedback: "Hier zeigt ein einzelnes Ereignis, also passé composé." },
          { before: "Chaque été, nous ", options: ["allions", "sommes allés"], answer: 0, after: " à la mer.", feedback: "Chaque été zeigt eine Gewohnheit, also imparfait." },
          { before: "Il ", options: ["pleuvait", "a plu"], answer: 0, after: " quand je suis sorti.", feedback: "Der Regen ist der Rahmen, also imparfait." },
          { before: "Soudain, le téléphone ", options: ["a sonné", "sonnait"], answer: 0, after: " dans la cuisine.", feedback: "Soudain kündigt ein Ereignis an: passé composé." },
          { before: "Quand j’étais petit, je ", options: ["jouais", "ai joué"], answer: 0, after: " souvent dehors.", feedback: "Souvent zeigt eine Gewohnheit: imparfait." },
          { before: "Elle ", options: ["était", "a été"], answer: 0, after: " très fatiguée ce jour-là.", feedback: "Eine Befindlichkeit beschreibt einen Zustand: imparfait." },
          { before: "Un jour, il ", options: ["a trouvé", "trouvait"], answer: 0, after: " un portefeuille dans la rue.", feedback: "Un jour kündigt ein einzelnes Ereignis an." },
          { before: "Pendant que je lisais, ma sœur ", options: ["écoutait", "a écouté"], answer: 0, after: " de la musique.", feedback: "Pendant que zeigt Gleichzeitigkeit: imparfait." },
        ],
        2: [
          { before: "Quand nous ", options: ["étions", "avons été", "sommes"], answer: 0, after: " enfants, mon frère et moi allions chaque dimanche chez nos grands-parents, qui habitaient à la campagne.", feedback: "Quand nous étions enfants beschreibt die Zeit als Rahmen, also imparfait." },
          { before: "Il faisait très froid, alors nous ", options: ["avons décidé", "décidions", "décidons"], answer: 0, after: " de rester à la maison et de regarder un film toute la soirée.", feedback: "Der Entschluss ist ein einzelnes Ereignis, also passé composé." },
          { before: "Mon père lisait le journal quand soudain, tout le monde ", options: ["a entendu", "entendait", "entend"], answer: 0, after: " un grand bruit dans la rue devant la maison.", feedback: "Soudain kündigt ein Ereignis an, also passé composé." },
          { before: "Autrefois, ma grand-mère ", options: ["faisait", "a fait", "fait"], answer: 0, after: " le pain tous les samedis matin, et toute la famille venait le manger.", feedback: "Tous les samedis zeigt eine Gewohnheit, also imparfait." },
          { before: "Hier, après l’école, je ", options: ["suis rentré", "rentrais", "rentre"], answer: 0, after: " directement à la maison, puis j’ai fait mes devoirs et j’ai joué à la console.", feedback: "Hier und puis zeigen eine Handlungsfolge im passé composé." },
          { before: "Quand le professeur est entré, les élèves ", options: ["parlaient", "ont parlé", "parlent"], answer: 0, after: " encore, et personne ne l’a remarqué tout de suite.", feedback: "Das Sprechen lief gerade, es ist der Rahmen für das Ereignis." },
          { before: "Ce week-end-là, il ", options: ["a neigé", "neigeait", "neige"], answer: 0, after: " pendant trois jours, et nous sommes restés dans le chalet.", feedback: "Das Schneefallen war auf drei Tage begrenzt, also ein abgeschlossenes Ereignis." },
          { before: "Quand j’étais petite, je ", options: ["rêvais", "ai rêvé", "rêve"], answer: 0, after: " de devenir pilote, et je dessinais des avions dans mes cahiers de classe.", feedback: "Das wiederholte Träumen ist eine Gewohnheit, also imparfait." },
        ],
      },
    },
  },
  {
    id: "fr-futur-formes",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.5"],
    title: "Der futur simple: Formen",
    intro:
      "Den futur simple bildest du aus dem Infinitiv plus -ai, -as, -a, -ons, -ez, -ont. Viele wichtige Verben haben einen eigenen Stamm.",
    paragraphs: [
      "Der **futur simple** besteht aus dem Infinitiv und den Endungen -ai, -as, -a, -ons, -ez, -ont: je parlerai, tu parleras, il parlera, nous parlerons, vous parlerez, ils parleront. Bei Verben auf -re fällt das -e des Infinitivs weg: prendre → je prendrai, mettre → je mettrai, vendre → je vendrai. Die Endungen sind dieselben wie das Präsens von avoir (ai, as, a, avons, avez, ont), nur nous und vous haben -ons und -ez.",
      "Wichtige Verben haben einen **unregelmäßigen Stamm**, die Endungen bleiben gleich: être → je **serai**, avoir → j’**aurai**, aller → j’**irai**, faire → je **ferai**, pouvoir → je **pourrai**, vouloir → je **voudrai**, venir → je **viendrai**, voir → je **verrai**, savoir → je **saurai**, devoir → je **devrai**. Merke dir, dass die Stämme von pouvoir, voir und venir mit rr oder dr geschrieben werden.",
      "Auch die Schreibung einiger Verben ändert sich: acheter → j’achèterai, se lever → je me lèverai, appeler → j’appellerai. Verben auf -ier und -yer folgen meist der Regel: étudier → j’étudierai, payer → je paierai (oder je payerai).",
      "Typische Fehler sind « je allerai » (richtig ist j’irai), « je pourai » (richtig ist je pourrai mit rr) und « il avra » (richtig ist il aura). Unterscheide den Stamm und die Endung: Endungen gelten für alle Verben, Stämme musst du bei den Ausnahmen lernen.",
    ],
    terms: [
      { term: "futur simple", text: "Die Zeitform für die Zukunft. Sie wird aus dem Infinitiv (oder einem besonderen Stamm) plus -ai, -as, -a, -ons, -ez, -ont gebildet." },
      { term: "Stamm auf -r", text: "Alle Formen des futur simple enthalten ein -r- vor der Endung: je parlerai, nous serons, ils viendront." },
      { term: "unregelmäßiger Stamm", text: "Manche Verben haben einen eigenen Stamm, zum Beispiel ser- (être), aur- (avoir), ir- (aller), fer- (faire), pourr- (pouvoir)." },
    ],
    takeaway:
      "Futur simple = Infinitiv (bei -re ohne -e) + -ai, -as, -a, -ons, -ez, -ont. Unregelmäßige Stämme: ser-, aur-, ir-, fer-, pourr-, voudr-, viendr-, verr-, saur-, devr-. Vor der Endung steht immer -r-.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie lautet der futur simple von être für nous?",
      answer: "nous serons",
      wrong: ["nous êtrons", "nous serez"],
      explanation:
        "Être hat den Stamm ser-, dazu kommt die Endung -ons. Nous êtrons folgt der Regel mit dem Infinitiv, die hier nicht gilt, und -ez gehört zu vous.",
    },
    workshop: {
      kind: "choose",
      title: "Den futur simple bilden",
      instruction:
        "Bestimme das Verb, seinen Stamm und die Endung zum Subjekt. Bei unregelmäßigen Stämmen achtest du auf rr und dr.",
      items: [
        { before: "Demain, je ", options: ["parlerai", "parlera", "parlerons"], answer: 0, after: " avec le professeur.", feedback: "Zu je gehört die Endung -ai: je parlerai." },
        { before: "Nous ", options: ["irons", "allerons", "iront"], answer: 0, after: " à Paris cet été.", feedback: "Aller hat den Stamm ir-, dazu kommt -ons: nous irons." },
        { before: "Il ", options: ["aura", "avra", "sera"], answer: 0, after: " seize ans en mars prochain.", feedback: "Avoir hat den Stamm aur-: il aura." },
        { before: "Tu ", options: ["feras", "faiseras", "fera"], answer: 0, after: " tes devoirs ce soir?", feedback: "Faire hat den Stamm fer-, zu tu gehört -as: tu feras." },
        { before: "Ils ", options: ["pourront", "pouvront", "pouront"], answer: 0, after: " venir à la fête samedi soir.", feedback: "Pouvoir hat den Stamm pourr- mit zwei r, zu ils gehört -ont." },
      ],
      conclusion: "Futur simple: Stamm mit -r- plus Endung. Aller, être, avoir und faire haben eigene Stämme.",
    },
    casework: {
      title: "Pläne für den Sommer",
      story:
        "Eine Schülerin schreibt: « L’été prochain, je serai en Espagne avec ma famille. Nous irons à la plage et mon frère fera du surf. Mes parents prendront des photos. »",
      steps: [
        {
          question: "Wie ist « je serai » gebildet?",
          options: ["Stamm ser- plus -ai.", "Infinitiv être plus -ai.", "Stamm ét- plus -ai."],
          answer: 0,
          explanation: "Être hat im futur simple den eigenen Stamm ser-. Der Stamm ét- gehört zum imparfait.",
        },
        {
          question: "Wie entsteht « nous irons »?",
          options: ["Stamm ir- plus -ons.", "Infinitiv aller plus -ons.", "Stamm all- plus -ons."],
          answer: 0,
          explanation: "Aller hat im futur simple den Stamm ir-. Der Stamm all- gehört zum imparfait.",
        },
        {
          question: "Warum heißt es « prendront » und nicht « prenderont »?",
          options: ["Bei -re fällt das -e des Infinitivs weg.", "Weil prendre kein Futur bilden kann.", "Weil ils immer -ront als Endung hat."],
          answer: 0,
          explanation: "Verben auf -re verlieren das -e des Infinitivs: prendre → prendr-, dazu kommt -ont.",
        },
      ],
      verdict:
        "Der Text zeigt den futur simple mit Ausnahmestamm (ser-, ir-, fer-) und mit einem Verb auf -re. Die Endungen sind für alle gleich.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde den futur simple: 1. je (parler) 2. nous (aller) 3. ils (prendre)",
        hints: [
          "Prüfe, ob das Verb einen besonderen Stamm hat.",
          "Bei -re streichst du das -e des Infinitivs.",
        ],
        model:
          "1. je parlerai 2. nous irons 3. ils prendront. Parler folgt der Regel mit dem Infinitiv, aller hat den Stamm ir-, und bei prendre fällt das -e weg, deshalb prendront.",
        criteria: [
          "Der Stamm ist richtig gebildet.",
          "Die Endung passt zum Subjekt.",
          "Das -r- vor der Endung ist vorhanden.",
        ],
      },
      2: {
        prompt:
          "Schreibe vier bis fünf Sätze über deine Pläne für das nächste Jahr. Verwende mindestens fünf Verben im futur simple, darunter drei unregelmäßige (zum Beispiel être, avoir, aller, faire, pouvoir).",
        hints: [
          "Beginne mit « L’année prochaine, je … ».",
          "Nutze verschiedene Personen: je, nous, mes amis.",
        ],
        model:
          "L’année prochaine, je serai en dixième classe. Mes amis et moi, nous irons en Italie pour le voyage de classe. Je ferai du sport avec mon frère. Mes parents pourront nous accompagner. J’aurai un nouveau portable et je prendrai beaucoup de photos.",
        criteria: [
          "Mindestens fünf Verben im futur simple.",
          "Mindestens drei davon mit unregelmäßigem Stamm.",
          "Der Text beschreibt die Pläne verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Futur simple: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form des futur simple. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Demain, je ", options: ["parlerai", "parle"], answer: 0, after: " avec Paul.", feedback: "Im futur simple steht -r- plus Endung -ai." },
          { before: "Nous ", options: ["serons", "êtrons"], answer: 0, after: " à Paris ce week-end.", feedback: "Être hat im futur simple den Stamm ser-: nous serons." },
          { before: "Il ", options: ["aura", "avra"], answer: 0, after: " quinze ans en mai.", feedback: "Avoir hat im futur simple den Stamm aur-: il aura." },
          { before: "Tu ", options: ["iras", "alleras"], answer: 0, after: " au cinéma avec nous?", feedback: "Aller hat im futur simple den Stamm ir-: tu iras." },
          { before: "Ils ", options: ["feront", "faiseront"], answer: 0, after: " une pizza ce soir.", feedback: "Faire hat im futur simple den Stamm fer-: ils feront." },
          { before: "Vous ", options: ["pourrez", "pourez"], answer: 0, after: " venir à la fête demain.", feedback: "Pouvoir hat den Stamm pourr- mit zwei r." },
          { before: "Elle ", options: ["viendra", "venira"], answer: 0, after: " avec nous la semaine prochaine.", feedback: "Venir hat im futur simple den Stamm viendr-: elle viendra." },
          { before: "Nous ", options: ["prendrons", "prenderons"], answer: 0, after: " le train de huit heures.", feedback: "Bei Verben auf -re fällt das -e weg: nous prendrons." },
        ],
        2: [
          { before: "L’année prochaine, mes parents et moi, nous ", options: ["partirons", "partirez", "partons"], answer: 0, after: " en vacances en Bretagne pendant trois semaines entières.", feedback: "Zu nous gehört im futur simple die Endung -ons: nous partirons." },
          { before: "Dès que tu ", options: ["auras", "as", "avais"], answer: 0, after: " ton permis, tu pourras conduire la voiture de ton père pour aller au travail.", feedback: "Nach dès que steht der futur simple. Avoir hat den Stamm aur-." },
          { before: "Mon frère ", options: ["verra", "voira", "vera"], answer: 0, after: " ses amis allemands pendant les vacances de Noël, car il ira à Berlin.", feedback: "Voir hat im futur simple den Stamm verr- mit zwei r." },
          { before: "Quand nous ", options: ["serons", "sommes", "étions"], answer: 0, after: " plus grands, nous voyagerons beaucoup et nous découvrirons de nouveaux pays.", feedback: "Nach quand steht, wenn es um die Zukunft geht, der futur simple: nous serons." },
          { before: "Vous ", options: ["devrez", "devez", "devions"], answer: 0, after: " rendre vos devoirs avant midi, sinon le professeur ne les corrigera pas.", feedback: "Devoir hat den Stamm devr-, zu vous gehört -ez." },
          { before: "Ma sœur ", options: ["saura", "sait", "savera"], answer: 0, after: " bientôt faire du vélo sans les mains, car elle s’entraîne chaque jour.", feedback: "Savoir hat im futur simple den Stamm saur-." },
          { before: "Si tu veux, nous ", options: ["achèterons", "acheterons", "achetons"], answer: 0, after: " les billets de train ensemble demain matin avant d’aller au collège.", feedback: "Acheter ändert im futur simple die Schreibung: nous achèterons." },
          { before: "Les enfants ", options: ["pourront", "peuvent", "pouvront"], answer: 0, after: " jouer dans le jardin dès que la pluie s’arrêtera cet après-midi.", feedback: "Pouvoir hat den Stamm pourr-, zu ils gehört -ont." },
        ],
      },
    },
  },
  {
    id: "fr-futur-emploi",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.5"],
    title: "Der futur simple: Gebrauch",
    intro:
      "Der futur simple drückt Pläne, Voraussagen und Versprechen aus. Nach quand und dès que steht er, wenn die Handlung in der Zukunft liegt.",
    paragraphs: [
      "Der futur simple beschreibt, was später geschehen wird: **Pläne** (« L’été prochain, nous partirons en Italie. »), **Voraussagen** (« Demain, il fera beau. ») und **Versprechen** (« Je t’appellerai ce soir. »). Signalwörter sind demain, la semaine prochaine, l’année prochaine, dans deux jours, bientôt, plus tard.",
      "Neben dem futur simple gibt es das **futur proche** (aller + Infinitiv): « Je vais partir dans cinq minutes. » Es beschreibt eine nahe, sichere Zukunft. Der futur simple wirkt allgemeiner und eignet sich für weiter entfernte oder vorhergesagte Ereignisse. Im Alltag sind beide oft austauschbar, in geschriebenen Texten bevorzugst du den futur simple.",
      "Eine wichtige Regel betrifft Nebensätze mit **quand**, **dès que**, **aussitôt que** und **lorsque**. Liegt die Handlung in der Zukunft, steht im Französischen der futur simple, während du im Deutschen das Präsens benutzt: « Quand je serai grand, je serai pilote. » (Wenn ich groß bin, werde ich Pilot.) « Dès que tu arriveras, appelle-moi. »",
      "Typische Fehler sind das Präsens nach quand in einem Zukunftssatz (« Quand je suis grand, je serai pilote » ist falsch) und die Verwechslung mit si: Nach si steht nie der futur simple, das lernst du in der Lektion zur Bedingung. Prüfe also immer, ob du quand oder si hast.",
    ],
    terms: [
      { term: "Plan und Voraussage", text: "Der futur simple drückt aus, was jemand vorhat oder was voraussichtlich geschieht: nous partirons, il fera beau." },
      { term: "futur proche", text: "Die Zukunft mit aller + Infinitiv für nahe, sichere Pläne: je vais partir." },
      { term: "quand und dès que + futur simple", text: "Nach quand, dès que, aussitôt que und lorsque steht der futur simple, wenn die Handlung in der Zukunft liegt." },
    ],
    takeaway:
      "Futur simple für Pläne, Voraussagen und Versprechen. Futur proche (aller + Infinitiv) für die nahe Zukunft. Nach quand und dès que steht der futur simple, auch wenn du im Deutschen das Präsens sagst.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Wenn ich groß bin, werde ich Pilot“?",
      answer: "Quand je serai grand, je serai pilote.",
      wrong: ["Quand je suis grand, je serai pilote.", "Quand je serai grand, je suis pilote."],
      explanation:
        "Nach quand steht bei Zukunft der futur simple, und der Hauptsatz steht ebenfalls im futur simple. Mit dem Präsens passt weder Neben- noch Hauptsatz.",
    },
    workshop: {
      kind: "choose",
      title: "futur simple oder Präsens?",
      instruction:
        "Frage dich, ob die Handlung in der Zukunft liegt, und denke an die Regel für quand und dès que.",
      items: [
        { before: "Quand tu ", options: ["arriveras", "arrives", "arrivais"], answer: 0, after: ", appelle-moi tout de suite.", feedback: "Nach quand steht in einem Zukunftssatz der futur simple: Quand tu arriveras." },
        { before: "Demain, il ", options: ["fera", "fait", "faisait"], answer: 0, after: " beau dans tout le pays.", feedback: "Demain zeigt die Zukunft. Faire hat im futur simple den Stamm fer-." },
        { before: "Dès que nous ", options: ["aurons", "avons", "avions"], answer: 0, after: " le temps, nous visiterons Paris.", feedback: "Nach dès que steht der futur simple, wenn von der Zukunft die Rede ist." },
        { before: "L’année prochaine, je ", options: ["serai", "suis", "étais"], answer: 0, after: " en dixième classe.", feedback: "L’année prochaine zeigt die Zukunft: je serai." },
        { before: "Je t’", options: ["aiderai", "aide", "aidais"], answer: 0, after: " demain, promis!", feedback: "Ein Versprechen für morgen steht im futur simple." },
      ],
      conclusion: "Zukunft heißt futur simple, auch nach quand und dès que. Das Präsens gibt es in solchen Sätzen im Französischen nicht.",
    },
    casework: {
      title: "Ein Versprechen vor der Reise",
      story:
        "Eine Mutter sagt zu ihrer Tochter: « Quand nous arriverons à Paris, nous irons au Louvre. Dès que tu finiras tes devoirs, nous partirons. Je vais appeler grand-mère maintenant. »",
      steps: [
        {
          question: "Warum steht « arriverons » nach quand?",
          options: ["Die Handlung liegt in der Zukunft.", "Quand verlangt immer das Präsens im Nebensatz.", "Das Verb arriver ist unregelmäßig."],
          answer: 0,
          explanation: "Liegt die Handlung nach quand in der Zukunft, steht der futur simple.",
        },
        {
          question: "Was drückt « Je vais appeler » aus?",
          options: ["Eine nahe, sichere Zukunft.", "Eine Voraussage für nächstes Jahr.", "Eine Vergangenheit."],
          answer: 0,
          explanation: "Aller + Infinitiv beschreibt das futur proche, also etwas, das bald geschieht.",
        },
        {
          question: "Warum steht « finiras » nach dès que?",
          options: ["Dès que verlangt bei Zukunft den futur.", "Dès que steht immer mit dem Präsens.", "Finiras ist hier ein Substantiv."],
          answer: 0,
          explanation: "Wie nach quand steht nach dès que bei Zukunft der futur simple, obwohl du im Deutschen das Präsens sagst.",
        },
      ],
      verdict:
        "Die Mutter verwendet futur simple nach quand, ein Versprechen im futur simple und das futur proche für das Gespräch gleich. Du erkennst die Zukunft am Sinn und an den Signalwörtern.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die Verben in den futur simple: 1. Quand je (être) grand, je (devenir) pilote. 2. Demain, il (faire) beau. 3. Dès que nous (arriver), nous (manger).",
        hints: [
          "Nach quand und dès que steht bei Zukunft der futur simple.",
          "Prüfe die Stämme der unregelmäßigen Verben.",
        ],
        model:
          "1. Quand je serai grand, je deviendrai pilote. 2. Demain, il fera beau. 3. Dès que nous arriverons, nous mangerons. Alle Verben stehen im futur simple, auch nach quand und dès que. Être, devenir und faire haben unregelmäßige Stämme (ser-, deviendr-, fer-).",
        criteria: [
          "Alle Verben stehen im futur simple.",
          "Nach quand und dès que steht ebenfalls der futur simple.",
          "Die unregelmäßigen Stämme sind richtig.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf bis sechs Sätze über deine Zukunftsträume. Verwende den futur simple mit quand oder dès que, ein Versprechen und eine Voraussage.",
        hints: [
          "Beginne mit « Quand je serai plus âgé(e), … ».",
          "Nutze Versprechen wie « Je t’appellerai … » und Voraussagen wie « Demain, il … ».",
        ],
        model:
          "Quand je serai plus âgée, j’habiterai dans une grande ville. Dès que j’aurai mon diplôme, je chercherai un travail dans un hôpital. Je t’appellerai tous les dimanches, c’est promis. Mes amis viendront me voir et nous ferons des voyages ensemble. Un jour, nous visiterons le Canada.",
        criteria: [
          "Mindestens ein Satz mit quand oder dès que und futur simple.",
          "Ein Versprechen und eine Voraussage kommen vor.",
          "Alle Verben sind im futur simple richtig gebildet.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Futur simple im Satz: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Quand je ", options: ["serai", "suis"], answer: 0, after: " grand, je voyagerai.", feedback: "Nach quand steht bei Zukunft der futur simple." },
          { before: "Demain, nous ", options: ["partirons", "partons"], answer: 0, after: " pour Paris.", feedback: "Demain zeigt die Zukunft, also steht der futur simple." },
          { before: "Dès que tu ", options: ["arriveras", "arrives"], answer: 0, after: ", appelle-moi.", feedback: "Nach dès que steht bei Zukunft der futur simple." },
          { before: "Je t’", options: ["écrirai", "écris"], answer: 0, after: " demain, promis!", feedback: "Ein Versprechen steht im futur simple." },
          { before: "La semaine prochaine, il ", options: ["fera", "fait"], answer: 0, after: " beau.", feedback: "La semaine prochaine zeigt die Zukunft." },
          { before: "Lorsque nous ", options: ["aurons", "avons"], answer: 0, after: " le temps, nous irons au cinéma.", feedback: "Nach lorsque steht bei Zukunft der futur simple." },
          { before: "Plus tard, je ", options: ["serai", "suis"], answer: 0, after: " médecin.", feedback: "Plus tard zeigt die Zukunft, also steht der futur simple." },
          { before: "Dans deux jours, ils ", options: ["viendront", "viennent"], answer: 0, after: " chez nous.", feedback: "Dans deux jours zeigt die Zukunft." },
        ],
        2: [
          { before: "Quand nous ", options: ["serons", "sommes", "étions"], answer: 0, after: " en vacances, nous ferons de longues promenades dans la forêt avec toute la famille.", feedback: "Nach quand steht bei Zukunft der futur simple." },
          { before: "Dès que le professeur ", options: ["corrigera", "corrige", "corrigeait"], answer: 0, after: " les tests, il nous donnera les notes avant les vacances de Noël.", feedback: "Nach dès que steht bei Zukunft der futur simple." },
          { before: "L’été prochain, ma cousine ", options: ["viendra", "vient", "venait"], answer: 0, after: " passer deux semaines chez nous, et nous visiterons ensemble la région du lac.", feedback: "L’été prochain zeigt die Zukunft: viendra." },
          { before: "Je ne sais pas ce que je ", options: ["ferai", "fais", "faisais"], answer: 0, after: " après l’école, mais je choisirai un métier avec beaucoup de contact humain.", feedback: "Der Gedanke bezieht sich auf die Zukunft, deshalb futur simple." },
          { before: "Aussitôt que nous ", options: ["recevrons", "recevons", "recevions"], answer: 0, after: " la réponse de l’entreprise, nous vous préviendrons par e-mail sans attendre.", feedback: "Nach aussitôt que steht bei Zukunft der futur simple." },
          { before: "Demain matin, je me ", options: ["lèverai", "lève", "levais"], answer: 0, after: " très tôt, parce que je prends le train de six heures pour aller à Munich.", feedback: "Demain matin zeigt die Zukunft: lèverai mit Akzent." },
          { before: "Les météorologues disent qu’il ", options: ["pleuvra", "pleut", "pleuvait"], answer: 0, after: " toute la journée de dimanche, donc nous resterons à la maison.", feedback: "Eine Voraussage steht im futur simple." },
          { before: "Quand tu ", options: ["verras", "vois", "voyais"], answer: 0, after: " Paris pour la première fois, tu seras certainement impressionné par la tour Eiffel.", feedback: "Nach quand steht bei Zukunft der futur simple; voir hat den Stamm verr-." },
        ],
      },
    },
  },
  {
    id: "fr-condition-si",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.6"],
    title: "Erfüllbare Bedingungen mit si",
    intro:
      "Mit si formulierst du Bedingungen, Wünsche und Vorschläge. Nach si steht das Präsens, im Hauptsatz das Futur.",
    paragraphs: [
      "Die erfüllbare Bedingung (Typ I) besteht aus einem **si-Satz im Präsens** und einem Hauptsatz im **futur simple**: « Si tu viens, nous irons au cinéma. », « Si on a le temps, on visitera le musée. » Die Struktur ist dieselbe wie im Englischen (if + simple present, will). Du kannst den si-Satz vorn oder hinten stellen: « Nous irons au parc s’il fait beau. »",
      "Nach **si** steht nie der futur simple, auch wenn der Hauptsatz in der Zukunft liegt. « Si tu viendras » ist falsch, richtig ist « Si tu viens ». Das ist ein Unterschied zu quand, nach dem du bei Zukunft den futur simple setzt. Vor il und ils wird si zu **s’**: « s’il pleut », « s’ils viennent », aber « si elle vient », « si on y va ».",
      "Der Hauptsatz kann außerdem im Präsens stehen, wenn es um etwas Allgemeingültiges geht: « Si on chauffe de l’eau, elle bout. » Mit dem Imperativ gibst du einen Rat oder eine Aufforderung: « Si tu as faim, mange quelque chose! » Für Wünsche und Vorschläge verwendest du si + Präsens + on peut: « Si tu veux, on peut aller au cinéma. »",
      "Typische Fehler sind « Si je serai riche » (nach si kein Futur), « si il pleut » statt s’il pleut und der fehlende Bezug auf die Zeitform im Hauptsatz. Prüfe also: Was steht im si-Satz? Das Präsens. Was im Hauptsatz? Das Futur, das Präsens oder der Imperativ.",
    ],
    terms: [
      { term: "si + Präsens", text: "Der Bedingungssatz steht im Präsens, auch wenn er auf die Zukunft zielt: Si tu viens …" },
      { term: "Hauptsatz im futur simple", text: "Das mögliche Ergebnis der Bedingung steht im futur simple: … nous irons au cinéma." },
      { term: "s’il, s’ils", text: "Vor il und ils wird si zu s’. Vor elle, elles und on bleibt si unverändert." },
    ],
    takeaway:
      "Bedingung Typ I: si + Präsens, Hauptsatz im futur simple (oder Präsens, Imperativ). Nach si nie das Futur. Vor il und ils wird si zu s’.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "S’il pleut, nous resterons à la maison.",
      wrong: ["Si il pleut, nous resterons à la maison.", "S’il pleuvra, nous resterons à la maison."],
      explanation:
        "Vor il wird si zu s’, und nach si steht das Präsens. Der Hauptsatz steht im futur simple. Im dritten Satz steht nach si das Futur, das falsch ist.",
    },
    workshop: {
      kind: "choose",
      title: "Die Bedingung richtig bilden",
      instruction:
        "Achte auf die Zeit im si-Satz, auf s’ vor il und auf die Zeit im Hauptsatz.",
      items: [
        { before: "Si tu ", options: ["viens", "viendras", "venais"], answer: 0, after: ", nous irons au cinéma ce soir.", feedback: "Im si-Satz steht das Präsens, nicht der futur simple." },
        { before: "", options: ["S’il", "Si il", "Si l’"], answer: 0, after: " fait beau, nous irons au parc.", feedback: "Vor il wird si zu s’: s’il fait beau." },
        { before: "Si tu as faim, ", options: ["mange", "mangeras", "manges"], answer: 0, after: " quelque chose avant de partir!", feedback: "Mit si kannst du einen Rat im Imperativ geben: mange!" },
        { before: "Si nous ", options: ["avons", "aurons", "avions"], answer: 0, after: " le temps, nous visiterons le musée.", feedback: "Im si-Satz steht das Präsens: Si nous avons le temps." },
        { before: "Elle sera contente si tu ", options: ["l’invites", "l’inviteras", "l’invitais"], answer: 0, after: " à ta fête.", feedback: "Auch hinten im Satz steht nach si das Präsens." },
      ],
      conclusion: "Nach si steht das Präsens, im Hauptsatz das Futur. Vor il und ils wird si zu s’.",
    },
    casework: {
      title: "Ein Plan fürs Wochenende",
      story:
        "Zwei Freundinnen planen: « Si tu veux, on peut aller à la piscine. – D’accord, mais s’il pleut, nous resterons à la maison. – Si tu as le temps, apporte ton maillot! »",
      steps: [
        {
          question: "Warum steht « veux » im si-Satz?",
          options: ["Nach si steht das Präsens.", "Nach si steht der futur simple.", "Vouloir steht nur im Präsens."],
          answer: 0,
          explanation: "Nach si steht das Präsens, auch bei Zukunft.",
        },
        {
          question: "Warum heißt es « s’il pleut »?",
          options: ["Vor il wird si zu s’.", "Vor jedem Vokal wird si zu s’.", "Weil pleut mit p beginnt."],
          answer: 0,
          explanation: "Si wird nur vor il und ils zu s’, nicht vor anderen Wörtern.",
        },
        {
          question: "Was steht im Hauptsatz von « Si tu as le temps, apporte ton maillot »?",
          options: ["Ein Imperativ.", "Ein futur simple.", "Ein imparfait."],
          answer: 0,
          explanation: "Mit si lassen sich auch Ratschläge im Imperativ geben.",
        },
      ],
      verdict:
        "Das Gespräch zeigt si + Präsens mit einem Vorschlag (on peut), mit futur simple und mit dem Imperativ. Nach si steht nie ein futur.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde Sätze mit si: 1. Wenn du kommst, gehen wir ins Kino. 2. Wenn es regnet, bleiben wir zu Hause. 3. Wenn du Hunger hast, iss etwas!",
        hints: [
          "Setze den si-Satz ins Präsens.",
          "Vor il wird si zu s’.",
        ],
        model:
          "1. Si tu viens, nous irons au cinéma. 2. S’il pleut, nous resterons à la maison. 3. Si tu as faim, mange quelque chose! Im si-Satz steht jeweils das Präsens, im Hauptsatz futur simple oder Imperativ. In Satz 2 wird si vor il zu s’.",
        criteria: [
          "Der si-Satz steht im Präsens.",
          "Der Hauptsatz steht im futur simple oder im Imperativ.",
          "Vor il wird si zu s’.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf bis sechs Sätze mit Bedingungen: einen Plan, einen Vorschlag, einen Ratschlag und eine allgemeingültige Aussage. Verwende dabei si mit futur simple, mit on peut und mit dem Imperativ.",
        hints: [
          "Beginne mit « Si le temps est beau, … ».",
          "Für einen Vorschlag: « Si tu veux, on peut … ».",
        ],
        model:
          "Si le temps est beau demain, nous irons à la plage. Si tu veux, on peut inviter Marie. S’il pleut, nous jouerons aux cartes. Si tu as soif, bois de l’eau! Si on chauffe de la glace, elle fond. Et si tu as le temps, apporte ton ballon!",
        criteria: [
          "Plan, Vorschlag, Ratschlag und allgemeingültige Aussage kommen vor.",
          "Nach si steht immer das Präsens.",
          "Vor il wird si zu s’.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Bedingungen mit si: Übungsrunde",
      instruction:
        "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Si tu ", options: ["viens", "viendras"], answer: 0, after: ", nous irons au cinéma.", feedback: "Nach si steht das Präsens, auch wenn der Satz in die Zukunft zielt." },
          { before: "", options: ["S’il", "Si il"], answer: 0, after: " pleut, nous resterons à la maison.", feedback: "Vor il und ils wird si zu s’: s’il pleut." },
          { before: "Si nous ", options: ["avons", "aurons"], answer: 0, after: " le temps, nous irons au parc.", feedback: "Nach si steht das Präsens: Si nous avons le temps." },
          { before: "Si tu veux, ", options: ["on peut", "on pourra"], answer: 0, after: " aller à la piscine.", feedback: "Der Vorschlag steht im Präsens mit on peut." },
          { before: "Si elle ", options: ["vient", "viendra"], answer: 0, after: ", nous serons contents.", feedback: "Nach si steht das Präsens, und si bleibt vor elle unverändert." },
          { before: "S’ils ", options: ["viennent", "viendront"], answer: 0, after: " demain, nous jouerons au foot.", feedback: "Nach si steht das Präsens; vor ils wird si zu s’." },
          { before: "Si tu as froid, ", options: ["mets", "mettras"], answer: 0, after: " ton pull!", feedback: "Mit si kannst du einen Rat im Imperativ geben." },
          { before: "Nous irons à la mer si le temps ", options: ["est", "sera"], answer: 0, after: " beau.", feedback: "Auch hinten im Satz steht nach si das Präsens." },
        ],
        2: [
          { before: "Si le professeur ", options: ["est", "sera", "était"], answer: 0, after: " malade demain, nous n’aurons pas de cours de français et nous pourrons rester à la maison.", feedback: "Nach si steht das Präsens, auch wenn der Satz von morgen spricht." },
          { before: "Nous partirons en randonnée samedi ", options: ["s’il", "si il", "si l’"], answer: 0, after: " ne pleut pas trop, sinon nous irons au cinéma avec les cousins.", feedback: "Vor il und ils wird si zu s’: s’il ne pleut pas." },
          { before: "Si tu ", options: ["finis", "finiras", "finissais"], answer: 0, after: " tes devoirs avant sept heures, tu pourras regarder un film avec nous ce soir.", feedback: "Nach si steht das Präsens: Si tu finis." },
          { before: "Si vous voulez, nous ", options: ["pouvons", "pourrons", "pouvions"], answer: 0, after: " visiter le château de Versailles après le déjeuner et prendre le train du soir.", feedback: "Für einen Vorschlag steht im Hauptsatz das Präsens: nous pouvons." },
          { before: "Si on ", options: ["chauffe", "chauffera", "chauffait"], answer: 0, after: " de l’eau à cent degrés, elle bout, c’est une loi de la physique.", feedback: "Bei einer allgemeingültigen Aussage stehen beide Sätze im Präsens." },
          { before: "Si tu ", options: ["as", "auras", "avais"], answer: 0, after: " besoin d’aide pour tes devoirs de maths, demande à ton frère, il est très fort.", feedback: "Nach si steht das Präsens; der Hauptsatz folgt im Imperativ." },
          { before: "Si mes amis ", options: ["arrivent", "arriveront", "arrivaient"], answer: 0, after: " avant dix-neuf heures, nous mangerons ensemble dans le jardin avant de regarder le match.", feedback: "Nach si steht das Präsens: Si mes amis arrivent." },
          { before: "Tu ", options: ["réussiras", "réussis", "réussissais"], answer: 0, after: " ton examen si tu travailles régulièrement et si tu dors assez avant le jour de l’épreuve.", feedback: "Der Hauptsatz steht im futur simple, die si-Sätze im Präsens." },
        ],
      },
    },
  },
];
