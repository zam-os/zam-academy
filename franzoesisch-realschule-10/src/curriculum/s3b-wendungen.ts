import type { Lesson } from "../model/types";

/**
 * Stufe 3, zweiter Teil: Wendungen, Wortbildung und Aussprache (Kompetenzerwartungen 1.2.1.5 bis 1.2.1.10,
 * 1.2.3.1 und 1.2.3.2): Wertungen und Gefühle mit festen Wendungen im Subjonctif, Ratschläge und Befehle mit
 * dem Imperativ von être und avoir, Ersatzformen für das deutsche Passiv, Konnektoren wie même si und
 * pendant que, Umschreibung, Erschließen über Präfixe und Suffixe und Aussprache mit elektronischen Hilfen.
 * Den Subjonctif lernen die Schüler hier wie im Plan als feste Wendungen, nicht als ganzes System.
 */
export const S3B: Lesson[] = [
  {
    id: "fr-subjonctif-wendungen",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.5"],
    title: "Wertungen und Gefühle: Wendungen mit Subjonctif",
    intro:
      "Nach il faut que, je veux que und il est important que steht eine eigene Verbform, der Subjonctif. Du lernst ihn in festen Wendungen.",
    paragraphs: [
      "Wenn du jemandem sagst, was er tun **muss** oder was du von ihm **willst**, oder wenn du etwas **bewertest**, steht nach que eine besondere Verbform: der **subjonctif**. Der Plan nennt dafür feste Wendungen: « Il faut que tu fasses tes devoirs. », « Il faut que tu aies confiance en toi. », « Je veux que tu viennes avec moi. », « Il est important que tu sois à l’heure. » Lerne sie als Ganzes, wie Vokabeln.",
      "Bei **regelmäßigen Verben** bildest du den subjonctif aus der ils-Form des Präsens ohne -ent plus -e, -es, -e, -ions, -iez, -ent: ils parlent → que je parle, que tu parles; ils finissent → que tu finisses; ils attendent → que tu attendes. Bei je, tu, il und ils klingt er bei -er-Verben wie das Präsens. Wichtige **unregelmäßige Formen**: être → que tu sois, qu’il soit; avoir → que tu aies, qu’il ait; faire → que tu fasses; aller → que tu ailles; venir → que tu viennes; pouvoir → que tu puisses.",
      "Typische **Auslöser** sind: il faut que (man muss, du musst), il est important / nécessaire que (es ist wichtig, nötig, dass), je veux que, je voudrais que, j’aimerais que (ich will, möchte, dass), je suis content(e) que, j’ai peur que (ich freue mich, ich habe Angst, dass). Wichtig: Der Subjonctif steht nur, wenn im que-Satz **eine andere Person** handelt. Bei derselben Person nimmst du den Infinitiv: « Je veux venir. » aber « Je veux que tu viennes. »",
      "Nach **je pense que, je crois que, j’espère que** und **il est sûr que** steht dagegen der Indikativ: « Je pense que tu as raison. » Typische Fehler: « Il faut que tu fais » statt fasses, « Je veux que tu viens » statt viennes, « Il est important que tu es » statt sois und « Je veux que je vienne » statt je veux venir.",
    ],
    terms: [
      { term: "subjonctif", text: "Eine Verbform nach bestimmten Ausdrücken mit que, die einen Willen, eine Notwendigkeit oder ein Gefühl ausdrücken." },
      { term: "il faut que", text: "Man muss, du musst: « Il faut que tu fasses attention. » Danach steht der Subjonctif." },
      { term: "que tu sois / que tu aies", text: "Die Subjonctif-Formen von être und avoir: « Il est important que tu sois là. », « Il faut que tu aies confiance. »" },
      { term: "Infinitiv bei gleicher Person", text: "Will dieselbe Person etwas selbst tun, folgt der Infinitiv: « Je veux partir. », nicht que je parte." },
    ],
    takeaway:
      "Nach il faut que, il est important que, je veux que, je voudrais que, je suis content(e) que steht der Subjonctif: que tu fasses, aies, sois, viennes, ailles, puisses; regelmäßig aus der ils-Form + -e, -es, -e. Gleiche Person: Infinitiv. Nach je pense que, j’espère que: Indikativ.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Es ist wichtig, dass du pünktlich bist“?",
      answer: "Il est important que tu sois à l’heure.",
      wrong: ["Il est important que tu es à l’heure.", "Il est important que tu seras à l’heure."],
      explanation:
        "Nach il est important que steht der Subjonctif. Die Form von être für tu ist sois, nicht es (Präsens) oder seras (futur).",
    },
    workshop: {
      kind: "choose",
      title: "Subjonctif, Indikativ oder Infinitiv?",
      instruction: "Prüfe den Ausdruck vor que und ob dieselbe oder eine andere Person handelt.",
      items: [
        { before: "Il faut que tu ", options: ["fasses", "fais", "feras"], answer: 0, after: " tes devoirs avant le dîner.", feedback: "Nach il faut que steht der Subjonctif: que tu fasses." },
        { before: "Je veux que vous ", options: ["veniez", "venez", "viendrez"], answer: 0, after: " à ma fête samedi.", feedback: "Je veux que + andere Person: Subjonctif, que vous veniez." },
        { before: "Je pense que tu ", options: ["as", "aies", "aurais"], answer: 0, after: " raison.", feedback: "Nach je pense que steht der Indikativ: tu as." },
        { before: "Ma mère veut ", options: ["partir", "qu’elle parte", "que partir"], answer: 0, after: " en vacances en Corse.", feedback: "Dieselbe Person will selbst etwas: Infinitiv partir." },
        { before: "Il est important que nous ", options: ["soyons", "sommes", "serons"], answer: 0, after: " solidaires.", feedback: "Nach il est important que: Subjonctif von être, que nous soyons." },
        { before: "Je suis content que tu ", options: ["puisses", "peux", "pourras"], answer: 0, after: " venir avec nous.", feedback: "Nach einem Gefühl mit que: Subjonctif von pouvoir, que tu puisses." },
      ],
      conclusion: "Wille, Notwendigkeit und Gefühl mit que: Subjonctif. Meinung und Hoffnung (je pense, j’espère): Indikativ. Gleiche Person: Infinitiv.",
    },
    casework: {
      title: "Ratschläge vor der Prüfung",
      story:
        "Deine Lehrerin schreibt der Klasse: « Il faut que vous dormiez bien la veille. Il est important que vous ayez votre carte d’identité. Je veux que chacun puisse montrer ce qu’il sait. Je pense que vous êtes bien préparés! »",
      steps: [
        {
          question: "Warum steht « que vous ayez »?",
          options: ["Nach il est important que steht der Subjonctif.", "Weil avoir im Präsens für vous immer so heißt.", "Weil der Satz in der Zukunft spielt."],
          answer: 0,
          explanation: "Il est important que löst den Subjonctif aus; ayez ist die Form von avoir für vous.",
        },
        {
          question: "Zu welchem Verb gehört « puisse »?",
          options: ["pouvoir", "prendre", "plaire"],
          answer: 0,
          explanation: "Puisse ist der Subjonctif von pouvoir: qu’il puisse.",
        },
        {
          question: "Warum steht « vous êtes » nach « je pense que »?",
          options: ["Nach je pense que steht der Indikativ.", "Être hat keinen eigenen Subjonctif.", "Weil nach vous immer êtes stehen muss."],
          answer: 0,
          explanation: "Je pense que drückt eine Meinung aus: Indikativ.",
        },
      ],
      verdict:
        "Drei Auslöser für den Subjonctif (il faut que, il est important que, je veux que) und eine Meinung mit Indikativ: Der Brief ist sprachlich genau.",
    },
    tasks: {
      1: {
        prompt:
          "Ergänze den Subjonctif: 1. Il faut que tu (faire) attention. 2. Je veux que tu (venir). 3. Il est important que vous (avoir) confiance. 4. Il faut que nous (partir) tôt.",
        hints: ["Fasses, viennes, ayez sind unregelmäßig.", "Partir: ils partent → que nous partions."],
        model:
          "1. Il faut que tu fasses attention. 2. Je veux que tu viennes. 3. Il est important que vous ayez confiance. 4. Il faut que nous partions tôt. Bei partir bildest du aus ils partent den Stamm part- und hängst -ions an.",
        criteria: ["Alle Formen stehen im Subjonctif.", "Die unregelmäßigen Formen sind richtig.", "Partir ist regelmäßig gebildet."],
      },
      2: {
        prompt:
          "Dein jüngerer französischer Cousin kommt in die erste Klasse des collège und hat Angst. Schreibe ihm sechs bis acht Sätze mit Ratschlägen und Gefühlen. Verwende mindestens vier verschiedene Wendungen mit Subjonctif und einmal je pense que mit Indikativ.",
        hints: ["Nutze il faut que, il est important que, je veux que, je suis content que.", "Für Mut passt avoir confiance en soi."],
        model:
          "Salut Noé! Je suis content que tu commences le collège, c’est une nouvelle aventure. Il faut que tu aies confiance en toi. Il est important que tu sois gentil avec les autres, comme ça, tu te feras vite des amis. Il faut aussi que tu fasses tes devoirs chaque soir, même si c’est ennuyeux. Je veux que tu m’appelles si tu as un problème. Je pense que tu vas adorer ton nouveau collège! Bises, Jonas",
        criteria: ["Mindestens vier Wendungen mit Subjonctif sind richtig.", "Je pense que steht mit Indikativ.", "Der Ton passt zu einem Cousin."],
      },
    },
    practice: {
      kind: "choose",
      title: "Wendungen mit Subjonctif: Übungsrunde",
      instruction: "Wähle die richtige Form. Eine Runde zählt, wenn alle drei Sätze richtig sind.",
      pool: {
        1: [
          { before: "Il faut que tu ", options: ["sois", "es"], answer: 0, after: " patient.", feedback: "Nach il faut que steht der Subjonctif von être: sois." },
          { before: "Je veux que tu ", options: ["viennes", "viens"], answer: 0, after: " ce soir.", feedback: "Je veux que + andere Person: Subjonctif viennes." },
          { before: "Il faut que vous ", options: ["ayez", "avez"], answer: 0, after: " vos billets.", feedback: "Nach il faut que steht der Subjonctif von avoir: ayez." },
          { before: "Je pense qu’il ", options: ["est", "soit"], answer: 0, after: " malade.", feedback: "Nach je pense que steht der Indikativ: il est." },
          { before: "Il faut qu’elle ", options: ["fasse", "fait"], answer: 0, after: " du sport.", feedback: "Nach il faut que steht der Subjonctif von faire: fasse." },
          { before: "Je voudrais ", options: ["dormir", "que je dorme"], answer: 0, after: " plus longtemps.", feedback: "Dieselbe Person will selbst etwas: Infinitiv dormir." },
          { before: "Il faut que j’", options: ["aille", "vais"], answer: 0, after: " chez le dentiste.", feedback: "Nach il faut que steht der Subjonctif von aller: aille." },
          { before: "Il est important qu’ils ", options: ["puissent", "peuvent"], answer: 0, after: " parler.", feedback: "Nach il est important que: Subjonctif von pouvoir, puissent." },
        ],
        2: [
          { before: "Avant ton entretien d’embauche, il faut absolument que tu ", options: ["prépares", "prépareras", "préparais"], answer: 0, after: " quelques questions sur l’entreprise.", feedback: "Nach il faut que steht der Subjonctif; bei -er klingt er wie das Präsens: que tu prépares." },
          { before: "Mes parents ne veulent pas que je ", options: ["sorte", "sors", "sortirai"], answer: 0, after: " seule le soir pendant notre séjour à Paris.", feedback: "Vouloir que + andere Person: Subjonctif, aus ils sortent wird que je sorte." },
          { before: "Pour protéger la planète, il est nécessaire que chacun ", options: ["fasse", "fait", "fera"], answer: 0, after: " des efforts au quotidien, même les petits gestes comptent.", feedback: "Nach il est nécessaire que: Subjonctif von faire, qu’il fasse." },
          { before: "Je suis vraiment contente que vous ", options: ["soyez", "êtes", "serez"], answer: 0, after: " venus nous voir pendant les vacances de printemps.", feedback: "Nach einem Gefühl mit que: Subjonctif von être, que vous soyez." },
          { before: "Mon entraîneur pense que nous ", options: ["avons", "ayons", "aurions"], answer: 0, after: " de bonnes chances de gagner le tournoi régional cette année.", feedback: "Nach penser que steht der Indikativ: nous avons." },
          { before: "Il est important que les jeunes ", options: ["aient", "ont", "auront"], answer: 0, after: " la possibilité de faire un stage à l’étranger pendant leur formation.", feedback: "Nach il est important que: Subjonctif von avoir, qu’ils aient." },
          { before: "Ma grand-mère voudrait ", options: ["apprendre", "qu’elle apprenne", "que apprendre"], answer: 0, after: " à utiliser son nouveau smartphone pour nous envoyer des photos.", feedback: "Dieselbe Person möchte etwas lernen: Infinitiv apprendre." },
          { before: "Le professeur veut que nous ", options: ["finissions", "finissons", "finirons"], answer: 0, after: " le projet sur la francophonie avant les vacances de Noël.", feedback: "Vouloir que + andere Person: Subjonctif, que nous finissions mit -ions." },
        ],
      },
    },
  },
  {
    id: "fr-imperatif-etre-avoir",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.6"],
    title: "Ratschläge und Befehle: Sois calme! N’aie pas peur!",
    intro:
      "Être und avoir haben eigene Formen im Imperativ: sois, soyons, soyez und aie, ayons, ayez. Damit gibst du Ratschläge und Mut.",
    paragraphs: [
      "Mit dem **Imperativ** gibst du Befehle, Ratschläge und Aufforderungen. Du kennst ihn bei regelmäßigen Verben: Regarde! Finis! Attends! Allons-y! Venez! Bei Verben auf -er fällt in der tu-Form das s weg (Écoute!), außer vor y und en (Vas-y!). Die Formen gibt es für tu, nous und vous, ohne Subjektpronomen.",
      "**Être** und **avoir** haben eigene Imperativformen, die du für Ratschläge brauchst. Être: **sois** (tu), **soyons** (nous), **soyez** (vous): « Sois calme! », « Soyons prudents! », « Soyez à l’heure! » Avoir: **aie** (tu), **ayons** (nous), **ayez** (vous): « Aie confiance! », « N’ayez pas peur! » Auch savoir hat eigene Formen: sache, sachons, sachez.",
      "**Verneint** umschließen ne und pas das Verb: « Ne sois pas triste! », « N’aie pas peur! », « Ne soyez pas en retard! » Beliebte Wendungen für Mut und Rat sind: Sois sage! (Sei brav!), Sois sympa! (Sei so lieb!), Aie du courage!, N’aie pas honte! (Schäm dich nicht!), Soyez les bienvenus! (Herzlich willkommen!).",
      "Typische Fehler: « Sois pas triste » ohne ne (umgangssprachlich, im Text falsch), « Es calme! » nach der Präsensform, « Aies confiance! » mit s und « Soyez » ohne y-Laut gesprochen. Sois klingt wie [swa], aie wie [ɛ], soyez wie [swaje]. Höflicher als ein Befehl wirkt oft der conditionnel: « Tu devrais être plus patient. »",
    ],
    terms: [
      { term: "sois, soyons, soyez", text: "Der Imperativ von être: « Sois calme! », « Soyons sérieux! », « Soyez prudents! »" },
      { term: "aie, ayons, ayez", text: "Der Imperativ von avoir: « Aie confiance! », « N’ayez pas peur! »" },
      { term: "verneinter Imperativ", text: "Ne und pas umschließen das Verb: « Ne sois pas en retard! », « N’aie pas peur! »" },
    ],
    takeaway:
      "Imperativ von être: sois, soyons, soyez. Von avoir: aie, ayons, ayez (ohne s). Verneint: Ne sois pas …! N’aie pas peur! Bei -er-Verben ohne s in der tu-Form (Écoute!). Höflicher rät der conditionnel (tu devrais).",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du einem Freund: „Hab keine Angst!“?",
      answer: "N’aie pas peur!",
      wrong: ["N’aies pas peur!", "Ne as pas peur!"],
      explanation:
        "Der Imperativ von avoir für tu ist aie, ohne s. Ne wird vor Vokal zu n’.",
    },
    workshop: {
      kind: "choose",
      title: "Den Imperativ von être und avoir einsetzen",
      instruction: "Wähle die richtige Imperativform. Achte auf die Person (tu, nous, vous) und auf die Verneinung.",
      items: [
        { before: "Tu as un examen demain? ", options: ["Sois", "Es", "Soit"], answer: 0, after: " calme et dors bien!", feedback: "Imperativ von être für tu: sois." },
        { before: "Les enfants, ", options: ["soyez", "êtes", "soyiez"], answer: 0, after: " sages pendant que je téléphone!", feedback: "Imperativ von être für vous: soyez." },
        { before: "", options: ["N’aie", "N’aies", "Ne as"], answer: 0, after: " pas honte, tout le monde fait des erreurs!", feedback: "Imperativ von avoir für tu: aie, ohne s; ne wird zu n’." },
        { before: "Mesdames et messieurs, ", options: ["ayez", "avez", "ayiez"], answer: 0, after: " l’amabilité de couper vos portables.", feedback: "Imperativ von avoir für vous: ayez." },
        { before: "Allez, ", options: ["soyons", "sommes", "soyions"], answer: 0, after: " positifs: on va réussir!", feedback: "Imperativ von être für nous: soyons." },
      ],
      conclusion: "Sois, soyons, soyez und aie, ayons, ayez: sechs Formen, die du für Ratschläge und Ermutigungen immer wieder brauchst.",
    },
    casework: {
      title: "Ein Freund vor dem Vorstellungsgespräch",
      story:
        "Dein französischer Freund Malik schreibt: « Demain, j’ai mon premier entretien d’embauche. Je suis super stressé et j’ai peur de dire des bêtises. Tu as des conseils? »",
      steps: [
        {
          question: "Wie beruhigst du ihn mit einem Imperativ?",
          options: ["Sois calme, tu es bien préparé!", "Es calme, tu es bien préparé!", "Être calme, tu es bien préparé!"],
          answer: 0,
          explanation: "Der Imperativ von être für tu heißt sois.",
        },
        {
          question: "Wie sagst du „Hab keine Angst“?",
          options: ["N’aie pas peur!", "N’as pas peur!", "Pas avoir peur!"],
          answer: 0,
          explanation: "Avoir hat im Imperativ die Form aie, verneint n’aie pas.",
        },
        {
          question: "Welcher Rat ist sprachlich richtig und passend?",
          options: ["Sois à l’heure et aie confiance en toi!", "Sois à l’heure et aies confiance en toi!", "Soit à l’heure et aie confiance en toi!"],
          answer: 0,
          explanation: "Sois ohne t und aie ohne s: So lauten die Imperative für tu.",
        },
      ],
      verdict:
        "Sois calme, n’aie pas peur, sois à l’heure, aie confiance: Mit den Imperativen von être und avoir machst du Malik Mut.",
    },
    tasks: {
      1: {
        prompt:
          "Gib die Ratschläge im Imperativ: 1. an einen Freund: ruhig sein 2. an die Klasse: keine Angst haben 3. an dich und deine Freunde (nous): vorsichtig sein",
        hints: ["Für tu: sois, aie; für vous: soyez, ayez; für nous: soyons, ayons.", "Bei der Verneinung umschließen ne und pas das Verb."],
        model:
          "1. Sois calme! 2. N’ayez pas peur! 3. Soyons prudents! Bei 2 sprichst du mehrere Personen an, deshalb vous: ayez; verneint wird ne vor dem Vokal zu n’. Bei 3 gleichst du prudent an nous an: prudents.",
        criteria: ["Alle drei Formen sind richtig.", "Die Person passt jeweils.", "Die Verneinung ist richtig gebaut."],
      },
      2: {
        prompt:
          "Schreibe eine kurze Rede (sechs bis acht Sätze), mit der du französische Austauschschüler an deiner Schule begrüßt und ihnen Tipps gibst. Verwende mindestens vier Imperative von être und avoir, darunter einen verneinten.",
        hints: ["Beginne mit Soyez les bienvenus!", "Gib Tipps zu Pünktlichkeit, Mut beim Sprechen und Fragen."],
        model:
          "Chers amis, soyez les bienvenus dans notre école! Nous sommes très contents de vous accueillir. Pendant ces deux semaines, ayez le courage de parler allemand, même si c’est difficile. N’ayez pas peur de faire des erreurs: nous en faisons aussi en français! Soyez à l’heure le matin, car les cours commencent à huit heures. Si vous avez une question, demandez-nous. Et surtout, soyons curieux les uns des autres!",
        criteria: ["Mindestens vier Imperative von être und avoir sind richtig.", "Ein verneinter Imperativ ist dabei.", "Die Rede ist freundlich und passend."],
      },
    },
  },
  {
    id: "fr-passiv-ersatz",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.7"],
    title: "Das deutsche Passiv französisch wiedergeben",
    intro:
      "Wo das Deutsche ein Passiv nutzt, sagt das Französische oft on oder ein reflexives Verb: On parle français. Ça s’écrit avec deux l.",
    paragraphs: [
      "Das Deutsche verwendet das **Passiv** sehr häufig: „Hier wird Französisch gesprochen“, „Mir wurde gesagt …“, „Das schreibt man mit zwei l“. Das Französische hat zwar auch ein Passiv mit être + Partizip, verwendet es aber viel seltener. Oft klingt ein **aktiver Satz** natürlicher, und manchmal ist das Passiv im Französischen sogar unmöglich.",
      "Der häufigste Ersatz ist **on** + aktives Verb: „Hier wird Französisch gesprochen“ → « Ici, on parle français. »; „Das Museum wurde 1990 renoviert“ → « On a rénové le musée en 1990. »; „Mir wurde gesagt“ → « On m’a dit. » Notwendig ist on, wenn das französische Verb ein **indirektes Objekt** mit à hat: „Ihm wurde ein Job angeboten“ → « On lui a proposé un job. » (proposer à), „Uns wurde geantwortet“ → « On nous a répondu. » (répondre à). Ein französisches Passiv ist hier nicht möglich.",
      "Der zweite Ersatz ist ein **reflexives Verb** (se + Verb) für allgemeine Regeln und Gewohnheiten: « Ça s’écrit avec deux l. » (Das schreibt man …), « Ce plat se mange froid. » (Das Gericht wird kalt gegessen.), « Les billets se vendent en ligne. » (Die Karten werden online verkauft.), « Ça ne se fait pas. » (Das macht man nicht.)",
      "Typische Fehler: wörtliche Übersetzungen wie « Il a été aidé à lui » oder « Il est parlé français ici ». Frage dich beim Übersetzen: Wer handelt? Ist es egal oder unbekannt, nimm on. Geht es um eine allgemeine Regel zu einer Sache, nimm se + Verb. Das Passiv mit être (« Le château a été construit au XVIᵉ siècle. ») musst du verstehen, wenn es in Sachtexten vorkommt.",
    ],
    terms: [
      { term: "on + Aktiv", text: "Der häufigste Ersatz für das deutsche Passiv: „Hier wird gearbeitet“ → « Ici, on travaille. »" },
      { term: "se + Verb", text: "Reflexive Form für allgemeine Regeln zu Sachen: « Ça s’écrit comment? », « Ce vin se boit frais. »" },
      { term: "indirektes Objekt", text: "„Mir wurde gesagt“: Bei Verben mit à (dire à, répondre à) geht kein französisches Passiv, nur on: « On m’a dit. »" },
    ],
    takeaway:
      "Deutsches Passiv französisch meist aktiv: on + Verb (Ici, on parle français; On m’a dit), bei allgemeinen Regeln se + Verb (Ça s’écrit avec deux l; Ça ne se fait pas). Bei indirektem Objekt ist nur on möglich (On lui a répondu).",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Mir wurde gesagt, dass der Zug Verspätung hat“?",
      answer: "On m’a dit que le train avait du retard.",
      wrong: ["J’ai été dit que le train avait du retard.", "Je suis dit que le train avait du retard."],
      explanation:
        "Dire à quelqu’un hat im Französischen ein indirektes Objekt, deshalb gibt es kein persönliches Passiv: on m’a dit. Die beiden anderen Sätze sind falsch.",
    },
    workshop: {
      kind: "choose",
      title: "Den passenden Ersatz für das Passiv wählen",
      instruction: "Wähle die französische Wiedergabe, die richtig und natürlich ist.",
      items: [
        { before: "„In Québec wird Französisch gesprochen.“ → ", options: ["Au Québec, on parle français.", "Au Québec, il est parlé français.", "Au Québec, français est parlé."], answer: 0, after: "", feedback: "Eine allgemeine Aussage ohne bestimmten Handelnden: on parle." },
        { before: "„Wie schreibt man das?“ → ", options: ["Ça s’écrit comment?", "C’est écrit par qui?", "Ça est écrit comment?"], answer: 0, after: "", feedback: "Eine Regel zu einer Sache: reflexiv, ça s’écrit." },
        { before: "„Ihm wurde ein Praktikum angeboten.“ → ", options: ["On lui a proposé un stage.", "Il a été proposé un stage.", "Il a proposé un stage à lui."], answer: 0, after: "", feedback: "Proposer à quelqu’un hat ein indirektes Objekt: Nur on ergibt einen richtigen Satz." },
        { before: "„Diese Suppe wird kalt gegessen.“ → ", options: ["Cette soupe se mange froide.", "Cette soupe est mangée par froid.", "On est mangé cette soupe froide."], answer: 0, after: "", feedback: "Eine allgemeine Regel zur Sache: reflexiv, se mange." },
        { before: "„Uns wurde nicht geantwortet.“ → ", options: ["On ne nous a pas répondu.", "Nous n’avons pas été répondus.", "Il ne nous est pas répondu."], answer: 0, after: "", feedback: "Répondre à hat ein indirektes Objekt: Nur on ist möglich." },
      ],
      conclusion: "On für Handlungen ohne genannten Täter, se + Verb für Regeln zu Sachen: So klingt das deutsche Passiv auf Französisch natürlich.",
    },
    casework: {
      title: "Ein Schild übersetzen",
      story:
        "Für den französischen Gästeabend an deiner Schule sollst du Schilder und Hinweise übersetzen: „Hier wird nicht geraucht.“ „Die Getränke werden an der Kasse bezahlt.“ „Allen Gästen wird ein Programm gegeben.“",
      steps: [
        {
          question: "Wie übersetzt du „Hier wird nicht geraucht“?",
          options: ["Ici, on ne fume pas.", "Ici, il n’est pas fumé.", "Ici, ce n’est pas fumé."],
          answer: 0,
          explanation: "Eine Regel ohne bestimmten Handelnden: on ne fume pas.",
        },
        {
          question: "Welche Wiedergabe passt für den zweiten Hinweis?",
          options: ["Les boissons se paient à la caisse.", "Les boissons sont payées par la caisse.", "Les boissons paient à la caisse."],
          answer: 0,
          explanation: "Eine allgemeine Regel zu einer Sache: reflexiv, se paient. Die zweite Fassung sagt, die Kasse bezahle.",
        },
        {
          question: "Wie gibst du „Allen Gästen wird ein Programm gegeben“ wieder?",
          options: ["On donne un programme à tous les invités.", "Tous les invités sont donnés un programme.", "Un programme est donné tous les invités."],
          answer: 0,
          explanation: "Donner à quelqu’un hat ein indirektes Objekt; der natürliche Satz nutzt on.",
        },
      ],
      verdict:
        "On ne fume pas, se paient und on donne: Die Schilder sind jetzt nicht wörtlich, sondern französisch übersetzt.",
    },
    tasks: {
      1: {
        prompt:
          "Übersetze mit on oder einem reflexiven Verb: 1. In diesem Restaurant wird gut gegessen. 2. Mir wurde ein Praktikum angeboten. 3. Das sagt man nicht.",
        hints: ["Bei 2 hat proposer à quelqu’un ein indirektes Objekt.", "Bei 3 passt eine allgemeine Regel mit se."],
        model:
          "1. Dans ce restaurant, on mange bien. 2. On m’a proposé un stage. 3. Ça ne se dit pas. Bei 2 ist ein französisches Passiv nicht möglich, weil das deutsche „mir“ ein indirektes Objekt ist.",
        criteria: ["Alle drei Sätze sind aktiv oder reflexiv wiedergegeben.", "Satz 2 nutzt on mit indirektem Objekt.", "Die Sätze klingen natürlich."],
      },
      2: {
        prompt:
          "Übersetze diesen Ausschnitt aus einem deutschen Flyer für französische Besucher natürlich ins Französische: „In unserer Stadt wird viel Rad gefahren. Fahrräder werden am Bahnhof verliehen. Den Gästen wird ein kostenloser Stadtplan gegeben. Der Dom wurde im 13. Jahrhundert begonnen.“ Erkläre bei zwei Sätzen deine Wahl.",
        hints: ["Prüfe bei jedem Satz: allgemeine Regel, unbekannter Täter oder indirektes Objekt?", "Den Satz zum Dom kannst du auch mit dem Passiv être + Partizip wiedergeben."],
        model:
          "« Dans notre ville, on fait beaucoup de vélo. Les vélos se louent à la gare. On donne un plan de la ville gratuit aux visiteurs. La construction de la cathédrale a commencé au XIIIᵉ siècle. » Erklärung: Beim dritten Satz ist nur on möglich, weil donner à un indirektes Objekt hat. Beim zweiten Satz passt die reflexive Form, weil es um eine allgemeine Regel zu einer Sache geht.",
        criteria: ["Die Passivsätze sind natürlich wiedergegeben.", "On und se + Verb sind passend gewählt.", "Zwei Entscheidungen sind richtig erklärt."],
      },
    },
  },
  {
    id: "fr-konnektoren-meme-si",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.8"],
    title: "Logische Zusammenhänge: même si, pendant que, alors que",
    intro:
      "Mit même si, pendant que, alors que, dès que und puisque zeigst du genau, wie zwei Gedanken zusammenhängen.",
    paragraphs: [
      "Neben den Strukturwörtern aus Stufe 1 brauchst du **Konjunktionen**, die einen Nebensatz einleiten. **Même si** heißt „selbst wenn, auch wenn“: « Je vais courir, même s’il pleut. » Danach steht der Indikativ. **Pendant que** heißt „während“ im zeitlichen Sinn: « Pendant que je cuisinais, mon frère mettait la table. »",
      "**Alors que** heißt ebenfalls „während“, aber im Sinn eines **Gegensatzes** (wohingegen): « Mon frère adore le foot, alors que moi, je préfère le basket. » Pendant que ist Zeit, alors que ist Gegensatz. **Dès que** heißt „sobald“: « Dès que j’aurai mon permis, j’achèterai une voiture. » Wie nach quand steht für die Zukunft das futur. **Puisque** heißt „da ja“ und nennt einen Grund, den der andere schon kennt: « Puisque tu es là, aide-moi! »",
      "Mit Präpositionen statt Nebensätzen: **grâce à** (dank, für etwas Positives) und **à cause de** (wegen, für etwas Negatives): « Grâce à mon stage, j’ai trouvé une place. », « À cause de la grève, je suis arrivé en retard. » Mit Infinitiv: **au lieu de** (anstatt zu) und **sans** (ohne zu): « Au lieu de réviser, il a joué. », « Elle est partie sans dire au revoir. »",
      "Typische Fehler: même si mit conditionnel (« même si je serais malade »), pendant que für einen Gegensatz, grâce à für etwas Negatives (« Grâce à la pluie, le match a été annulé » klingt ironisch) und à cause de vor einem ganzen Satz (dann parce que). Diese Wörter machen deine Texte genauer, besonders in Argumentationen.",
    ],
    terms: [
      { term: "même si", text: "Selbst wenn, auch wenn; danach Indikativ: « Je viendrai, même si je suis fatigué. »" },
      { term: "pendant que / alors que", text: "Pendant que heißt während (gleichzeitig), alors que heißt während im Sinn von wohingegen." },
      { term: "dès que", text: "Sobald. Für die Zukunft steht danach das futur: « Dès qu’il arrivera, on partira. »" },
      { term: "grâce à / à cause de", text: "Dank (positiv) und wegen (negativ), jeweils mit einem Nomen: « à cause de la neige »." },
    ],
    takeaway:
      "Même si = selbst wenn (+ Indikativ). Pendant que = während (Zeit), alors que = während (Gegensatz). Dès que = sobald (+ futur für Zukunft). Puisque = da ja. Grâce à (positiv), à cause de (negativ) + Nomen. Au lieu de, sans + Infinitiv.",
    sourceIds: ["lp", "lingolia", "lepointdufle"],
    quiz: {
      question: "Welches Wort verbindet « Ma sœur est très sportive » und « moi, je déteste le sport » am besten?",
      answer: "alors que",
      wrong: ["pendant que", "même si"],
      explanation:
        "Es geht um einen Gegensatz zwischen zwei Personen: alors que. Pendant que wäre zeitlich, même si heißt selbst wenn.",
    },
    workshop: {
      kind: "choose",
      title: "Den logischen Zusammenhang erkennen",
      instruction: "Überlege, welcher Zusammenhang besteht: Zeit, Gegensatz, Einräumung, Grund oder Folge, und wähle das passende Wort.",
      items: [
        { before: "Je vais à l’entraînement, ", options: ["même si", "dès que", "puisque"], answer: 0, after: " je suis un peu fatigué.", feedback: "Trotz der Müdigkeit: selbst wenn, also même si." },
        { before: "", options: ["Pendant que", "Alors que", "Même si"], answer: 0, after: " mes parents faisaient les courses, j’ai rangé ma chambre.", feedback: "Zwei Handlungen zur gleichen Zeit: pendant que." },
        { before: "", options: ["Dès que", "Pendant que", "Alors que"], answer: 0, after: " j’aurai les résultats, je t’appellerai.", feedback: "Sobald, mit futur für die Zukunft: dès que." },
        { before: "Le match a été annulé ", options: ["à cause de", "grâce à", "parce que"], answer: 0, after: " la tempête.", feedback: "Ein negativer Grund mit einem Nomen: à cause de." },
        { before: "", options: ["Grâce à", "À cause de", "Au lieu de"], answer: 0, after: " ton aide, j’ai réussi mon examen. Merci!", feedback: "Ein positiver Grund mit einem Nomen: grâce à." },
        { before: "", options: ["Au lieu de", "Sans", "Grâce à"], answer: 0, after: " regarder la télé, tu pourrais m’aider!", feedback: "Anstatt etwas zu tun: au lieu de + Infinitiv." },
      ],
      conclusion: "Même si räumt ein, pendant que ist Zeit, alors que ist Gegensatz, dès que heißt sobald, grâce à und à cause de nennen positive und negative Gründe.",
    },
    casework: {
      title: "Ein Bericht über einen Spendenlauf",
      story:
        "Für die Schülerzeitung schreibst du: « (1) … il pleuvait, deux cents élèves ont couru pour l’association. (2) … les grands couraient dix kilomètres, les petits en faisaient cinq. (3) … la générosité des parents, nous avons collecté 3 000 euros. » Die Lücken sollst du füllen.",
      steps: [
        {
          question: "Welches Wort passt in die erste Lücke?",
          options: ["Même s’", "Dès qu’", "Grâce à"],
          answer: 0,
          explanation: "Trotz des Regens sind alle gelaufen: Même s’il pleuvait. Vor il wird si zu s’.",
        },
        {
          question: "Welches Wort passt in die zweite Lücke?",
          options: ["Alors que", "Grâce à", "Au lieu de"],
          answer: 0,
          explanation: "Ein Gegensatz zwischen den Großen und den Kleinen: alors que. Pendant que ginge auch zeitlich, alors que betont den Unterschied.",
        },
        {
          question: "Welches Wort passt in die dritte Lücke?",
          options: ["Grâce à", "À cause de", "Même si"],
          answer: 0,
          explanation: "Die Großzügigkeit der Eltern ist ein positiver Grund: grâce à.",
        },
      ],
      verdict:
        "Même si für die Einräumung, alors que für den Gegensatz, grâce à für den positiven Grund: Der Bericht zeigt die Zusammenhänge genau.",
    },
    tasks: {
      1: {
        prompt:
          "Verbinde die Sätze mit dem Wort in Klammern: 1. Il fait froid. Je vais à la plage. (même si) 2. Je lisais. Ma sœur jouait du piano. (pendant que) 3. Paul aime la ville. Sa femme préfère la campagne. (alors que)",
        hints: ["Même si leitet den Satz mit der Einschränkung ein.", "Pendant que ist zeitlich, alors que zeigt einen Gegensatz."],
        model:
          "1. Je vais à la plage, même s’il fait froid. 2. Pendant que je lisais, ma sœur jouait du piano. 3. Paul aime la ville, alors que sa femme préfère la campagne. Bei 1 wird si vor il zu s’.",
        criteria: ["Alle Sätze sind richtig verbunden.", "Die Konjunktionen passen zum Zusammenhang.", "Die Verbformen stimmen."],
      },
      2: {
        prompt:
          "Schreibe einen Absatz (sechs bis acht Sätze) zur Frage « Faut-il travailler pendant les vacances? ». Verwende même si, alors que, grâce à, à cause de und dès que.",
        hints: ["Nenne eigene Erfahrungen und die anderer.", "Prüfe nach dès que die Zeit."],
        model:
          "L’été dernier, j’ai travaillé dans un supermarché, même si j’avais envie de me reposer. Grâce à ce job, j’ai pu payer mon nouveau vélo. Mon meilleur ami, lui, est parti en vacances, alors que moi, je restais à la maison. À cause de la chaleur, le travail était parfois difficile. Mais j’ai appris beaucoup de choses sur le monde du travail. Dès que j’aurai seize ans, je chercherai un job plus intéressant. À mon avis, travailler pendant les vacances, c’est une bonne expérience.",
        criteria: ["Alle fünf Wörter sind richtig verwendet.", "Nach dès que steht für die Zukunft das futur.", "Der Absatz ist zusammenhängend."],
      },
    },
    practice: {
      kind: "choose",
      title: "Logische Zusammenhänge: Übungsrunde",
      instruction: "Wähle das Wort, das den Zusammenhang richtig ausdrückt. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je sors, ", options: ["même s’", "dès qu’"], answer: 0, after: "il neige.", feedback: "Trotz des Schnees: selbst wenn, also même si." },
          { before: "", options: ["Pendant que", "Alors que"], answer: 0, after: " tu dors, je travaille.", feedback: "Zwei Handlungen zur gleichen Zeit: pendant que." },
          { before: "Il aime le thé, ", options: ["alors que", "pendant que"], answer: 0, after: " elle préfère le café.", feedback: "Ein Gegensatz zwischen zwei Personen: alors que." },
          { before: "", options: ["Grâce à", "À cause de"], answer: 0, after: " toi, j’ai compris.", feedback: "Ein positiver Grund mit einem Nomen: grâce à." },
          { before: "", options: ["À cause de", "Grâce à"], answer: 0, after: " la pluie, on reste ici.", feedback: "Ein negativer Grund: à cause de." },
          { before: "", options: ["Dès que", "Même si"], answer: 0, after: " je finirai, je viendrai.", feedback: "Sobald, mit dem futur für die Zukunft: dès que." },
          { before: "Il est parti ", options: ["sans", "au lieu de"], answer: 0, after: " dire merci.", feedback: "Ohne etwas zu tun: sans + Infinitiv." },
          { before: "", options: ["Puisque", "Même si"], answer: 0, after: " tu es là, aide-moi!", feedback: "Ein bekannter Grund: puisque, da ja." },
        ],
        2: [
          { before: "Beaucoup de jeunes continuent à prendre la voiture, ", options: ["même si", "dès que", "grâce à"], answer: 0, after: " les transports en commun sont pratiques dans notre ville.", feedback: "Obwohl Bus und Bahn praktisch sind: même si." },
          { before: "", options: ["Pendant que", "Alors que", "Puisque"], answer: 0, after: " le professeur expliquait l’exercice, deux élèves regardaient leur portable sous la table.", feedback: "Gleichzeitige Handlungen: pendant que." },
          { before: "En France, les élèves mangent souvent à la cantine à midi, ", options: ["alors qu’", "pendant qu’", "dès qu’"], answer: 0, after: "en Allemagne, beaucoup rentrent déjeuner à la maison.", feedback: "Ein Gegensatz zwischen zwei Ländern: alors que." },
          { before: "", options: ["Grâce aux", "À cause des", "Au lieu des"], answer: 0, after: " conseils de ma conseillère d’orientation, j’ai trouvé une formation qui me plaît vraiment.", feedback: "Ein positiver Grund: grâce à, mit les zu aux verschmolzen." },
          { before: "Le vol pour Montréal a été annulé ", options: ["à cause d’", "grâce à", "même si"], answer: 0, after: "un problème technique, et nous avons dû attendre le lendemain.", feedback: "Ein negativer Grund mit einem Nomen: à cause de, vor Vokal d’." },
          { before: "", options: ["Dès que", "Pendant que", "Alors que"], answer: 0, after: " nous arriverons à Bruxelles, nous irons voir l’Atomium et la Grand-Place.", feedback: "Sobald, mit futur für die Zukunft: dès que." },
          { before: "", options: ["Au lieu de", "Sans", "Grâce à"], answer: 0, after: " prendre l’avion pour aller à Paris, notre classe a choisi le train, qui pollue beaucoup moins.", feedback: "Anstatt etwas zu tun: au lieu de + Infinitiv." },
          { before: "", options: ["Puisque", "Même si", "Pendant que"], answer: 0, after: " tu parles déjà bien espagnol, tu pourrais faire ton stage à Madrid, non?", feedback: "Ein Grund, den beide kennen: puisque, da ja." },
        ],
      },
    },
  },
  {
    id: "fr-umschreiben",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.9", "1.2.1.1"],
    title: "Umschreiben: Synonyme, Antonyme und Erklärungen",
    intro:
      "Wenn dir ein Wort fehlt oder du es erklären sollst, hilfst du dir mit Synonymen, Gegenteilen und Sätzen wie « C’est quelqu’un qui … ».",
    paragraphs: [
      "**Umschreiben** brauchst du in zwei Situationen: wenn dir beim Sprechen ein Wort fehlt und wenn du in einer Aufgabe ein Wort auf Französisch erklären sollst. Dabei nutzt du Wörter, die du schon kennst, **in neuen Zusammenhängen**. Vier Wege helfen dir: Synonym, Antonym, Oberbegriff und Erklärung mit einem Relativsatz.",
      "Ein **Synonym** hat eine ähnliche Bedeutung: commencer = débuter, content = heureux, difficile = dur, un boulot (umgangssprachlich) = un travail. Ein **Antonym** ist das Gegenteil; mit einer Verneinung umschreibst du ein Wort: sale = pas propre, ennuyeux = pas intéressant, cher = pas bon marché. Ein **Oberbegriff** ordnet ein: une pomme → c’est un fruit, un marteau → c’est un outil.",
      "Die genaueste Umschreibung ist eine **Erklärung mit Relativsatz**: Für Personen « C’est quelqu’un qui … » (un boulanger: c’est quelqu’un qui fait du pain), für Sachen « C’est une chose qu’on utilise pour … » (un tire-bouchon: c’est une chose qu’on utilise pour ouvrir une bouteille), für Orte « C’est un endroit où … » (une bibliothèque: c’est un endroit où on emprunte des livres). Dazu passen « le contraire de … » und « c’est comme … , mais … ».",
      "Typische Fehler: ein Synonym, das nicht passt (« grand » für « âgé »), ein Antonym ohne Verneinung, das das Gegenteil sagt (« sale » statt « pas propre » gemeint), oder eine Erklärung, die das Wort selbst wiederholt (« Un vendeur, c’est quelqu’un qui vend » ist erlaubt, wenn vend bekannt ist; besser aber « qui travaille dans un magasin et conseille les clients »).",
    ],
    terms: [
      { term: "Synonym", text: "Ein Wort mit ähnlicher Bedeutung: commencer und débuter, content und heureux." },
      { term: "Antonym", text: "Ein Wort mit gegenteiliger Bedeutung. Mit Verneinung umschreibt es: sale = pas propre." },
      { term: "Oberbegriff", text: "Ein allgemeineres Wort, das einordnet: une pomme est un fruit, un marteau est un outil." },
      { term: "Erklärung mit Relativsatz", text: "C’est quelqu’un qui …, c’est une chose qu’on utilise pour …, c’est un endroit où …" },
    ],
    takeaway:
      "Umschreiben mit Synonym (débuter = commencer), Antonym mit Verneinung (sale = pas propre), Oberbegriff (c’est un outil) oder Relativsatz: c’est quelqu’un qui …, c’est une chose qu’on utilise pour …, c’est un endroit où …",
    sourceIds: ["lp", "larousse", "lepointdufle"],
    quiz: {
      question: "Wie erklärst du « une pharmacie » auf Französisch?",
      answer: "C’est un endroit où on achète des médicaments.",
      wrong: ["C’est quelqu’un qui vend des médicaments.", "C’est une chose qu’on utilise pour guérir."],
      explanation:
        "Eine Apotheke ist ein Ort: c’est un endroit où … Quelqu’un qui beschreibt eine Person (le pharmacien), une chose einen Gegenstand.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Umschreibungsstrategie ist das?",
      instruction: "Ordne jede Umschreibung der Strategie zu, die sie verwendet.",
      categories: ["Synonym", "Antonym mit Verneinung", "Erklärung mit Relativsatz"],
      entries: [
        { text: "ennuyeux: ça veut dire que ce n’est pas du tout intéressant", target: 1, feedback: "Pas intéressant beschreibt das Gegenteil von interessant." },
        { text: "un mécanicien: c’est quelqu’un qui répare les voitures", target: 2, feedback: "C’est quelqu’un qui erklärt eine Person mit einem Relativsatz." },
        { text: "débuter: c’est la même chose que commencer, mais plus formel", target: 0, feedback: "Commencer hat eine ähnliche Bedeutung: ein Synonym." },
        { text: "une gare: c’est un endroit où on prend le train ou le bus", target: 2, feedback: "C’est un endroit où erklärt einen Ort." },
        { text: "sale: c’est quand quelque chose n’est pas propre du tout", target: 1, feedback: "Pas propre beschreibt das Gegenteil von sauber." },
        { text: "un boulot: dans la langue familière, ça veut dire un travail", target: 0, feedback: "Travail hat dieselbe Bedeutung, boulot ist umgangssprachlich." },
      ],
      conclusion: "Synonym, Gegenteil mit Verneinung oder Erklärung mit Relativsatz: Mit diesen Strategien sagst du alles, auch wenn dir ein Wort fehlt.",
    },
    casework: {
      title: "Im Baumarkt in Frankreich",
      story:
        "Dein Gastvater bittet dich, im Baumarkt eine Wasserwaage zu besorgen. Du kennst das Wort nicht (le niveau à bulle). Der Verkäufer fragt: « Je peux vous aider? »",
      steps: [
        {
          question: "Wie beginnst du am besten?",
          options: ["Je cherche un outil, mais je ne connais pas le mot.", "Je cherche une Wasserwaage, vous comprenez, monsieur?", "Non merci, je regarde seulement."],
          answer: 0,
          explanation: "Mit dem Oberbegriff outil ordnest du ein und sagst ehrlich, dass dir das Wort fehlt.",
        },
        {
          question: "Welche Erklärung hilft dem Verkäufer am meisten?",
          options: ["C’est une chose qu’on utilise pour voir si un mur est droit.", "C’est quelqu’un qui travaille dans un magasin de bricolage.", "C’est un endroit où on achète des outils."],
          answer: 0,
          explanation: "Die Erklärung beschreibt die Funktion des Werkzeugs. Die anderen beschreiben eine Person und einen Ort.",
        },
        {
          question: "Der Verkäufer sagt: « Ah, un niveau à bulle! » Was machst du mit dem Wort?",
          options: ["Ich wiederhole es und notiere es mir.", "Ich vergesse es sofort wieder.", "Ich sage ihm, dass das Wort falsch ist."],
          answer: 0,
          explanation: "Ein gelerntes Wort wiederholst und notierst du; so wird es Teil deines Wortschatzes.",
        },
      ],
      verdict:
        "Oberbegriff, Erklärung der Funktion und das neue Wort notieren: So kommst du auch ohne das richtige Wort ans Ziel und lernst es dabei.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre auf Französisch mit je einem Satz: 1. un dentiste 2. une piscine 3. une clé 4. généreux (mit einem Synonym oder Antonym)",
        hints: ["Für Personen: c’est quelqu’un qui …; für Orte: c’est un endroit où …", "Für Sachen: c’est une chose qu’on utilise pour …"],
        model:
          "1. Un dentiste, c’est quelqu’un qui soigne les dents. 2. Une piscine, c’est un endroit où on nage. 3. Une clé, c’est une chose qu’on utilise pour ouvrir une porte. 4. Généreux, c’est le contraire d’égoïste: une personne généreuse aime donner et partager.",
        criteria: ["Jede Erklärung nutzt eine passende Strategie.", "Die Relativsätze sind richtig gebaut.", "Die Erklärungen sind verständlich, ohne das Wort selbst zu wiederholen."],
      },
      2: {
        prompt:
          "Stell dir vor, du spielst mit französischen Austauschschülern ein Ratespiel: Du erklärst Wörter, die anderen raten. Schreibe Erklärungen für sechs Wörter aus dem Themenbereich Beruf und Umwelt, mit mindestens drei verschiedenen Strategien. Gib das Lösungswort jeweils in Klammern an.",
        hints: ["Mische Personen, Sachen, Orte und Adjektive.", "Nutze auch le contraire de und c’est comme …, mais …"],
        model:
          "1. C’est quelqu’un qui travaille sans être payé pour aider les autres. (un bénévole) 2. C’est un endroit où on répare les voitures. (un garage) 3. C’est une chose qu’on utilise pour trier le verre. (un conteneur à verre) 4. C’est le contraire de polluer: on garde la nature propre. (protéger l’environnement) 5. C’est comme un job, mais pour apprendre un métier pendant quelques semaines. (un stage) 6. Ça veut dire la même chose que « travail », mais c’est familier. (le boulot)",
        criteria: ["Sechs verständliche Erklärungen liegen vor.", "Mindestens drei verschiedene Strategien sind verwendet.", "Die Lösungswörter passen zu den Erklärungen."],
      },
    },
  },
  {
    id: "fr-wortbildung",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.10", "3.1"],
    title: "Wörter erschließen: Präfixe, Suffixe und Wortfamilien",
    intro:
      "In impossible, recyclage oder protection stecken Wörter, die du kennst. Präfixe und Suffixe verraten dir die Bedeutung.",
    paragraphs: [
      "Viele unbekannte Wörter kannst du **erschließen**: aus dem Zusammenhang, aus dem Deutschen oder Englischen, aus deinem Weltwissen und aus der **Wortbildung**. Im Französischen werden Wörter oft aus einem Stamm und einem **Präfix** (Vorsilbe) oder **Suffix** (Nachsilbe) gebildet. Wer die wichtigsten kennt, versteht ganze Wortfamilien: protéger, la protection, protecteur.",
      "Wichtige **Präfixe**: re-/ré- (wieder: refaire, réécrire, recommencer), in-/im-/il-/ir- (un-, nicht: impossible, inconnu, illégal, irrégulier), dé-/dés- (ent-, un-: défaire, désagréable, déconnecter), mal-/mé- (schlecht, un-: malheureux, malhonnête, mécontent), pré- (vor: prévoir, préparer), sur- (über: surpeuplé, surveiller) und sous- (unter: sous-marin, sous-estimer).",
      "Wichtige **Suffixe**: -eur/-euse und -teur/-trice bilden Personen und Berufe (chanteur, chanteuse, acteur, actrice), -tion und -ment bilden Nomen aus Verben (polluer → la pollution, changer → le changement), -age ebenso (recycler → le recyclage, nettoyer → le nettoyage), -ité bildet Nomen aus Adjektiven (égal → l’égalité, réel → la réalité), -able/-ible heißt -bar (lavable, lisible), -ette verkleinert (une maisonnette).",
      "So gehst du vor: Zerlege das Wort, suche den bekannten Stamm, bestimme die Bedeutung von Präfix oder Suffix und prüfe dann, ob das Ergebnis in den Satz passt. Vorsicht: Nicht jedes re- heißt wieder (regarder, rester), und manche Wörter sehen gebildet aus, sind es aber nicht. Der Zusammenhang hat das letzte Wort.",
    ],
    terms: [
      { term: "Präfix", text: "Eine Vorsilbe, die die Bedeutung ändert: re- (wieder), in-/im- (un-), dé- (ent-), pré- (vor)." },
      { term: "Suffix", text: "Eine Nachsilbe, die die Wortart oder Bedeutung ändert: -tion, -ment, -age (Nomen), -eur (Person), -able (-bar)." },
      { term: "Wortfamilie", text: "Wörter mit demselben Stamm: protéger, la protection, protecteur, protégé." },
    ],
    takeaway:
      "Unbekannte Wörter zerlegen: Stamm finden, dann Präfix (re- wieder, in-/im- un-, dé- ent-, pré- vor, sur- über) oder Suffix (-eur Person, -tion/-ment/-age Nomen, -ité aus Adjektiv, -able -bar) deuten und im Zusammenhang prüfen.",
    sourceIds: ["lp", "larousse", "lingolia"],
    quiz: {
      question: "Was bedeutet wahrscheinlich « illisible »?",
      answer: "unleserlich",
      wrong: ["sehr gut lesbar", "nicht gelesen"],
      explanation:
        "Il- (un-) + lis- (von lire, lesen) + -ible (-bar): nicht lesbar, also unleserlich. Nicht gelesen hieße non lu.",
    },
    workshop: {
      kind: "mark",
      title: "Erschließbare Wörter im Text finden",
      instruction:
        "Wähle oben ein Etikett und klicke die Wörter an, die du über ein Präfix oder ein Suffix erschließen kannst. Unterscheide Präfix und Suffix; Wörter ohne erkennbare Bildung bleiben unmarkiert.",
      labels: ["Präfix", "Suffix"],
      text: [
        { t: "Dans notre collège, le " },
        { t: "recyclage", label: 1, feedback: "Recycl- + -age: Aus dem Verb recycler wird das Nomen." },
        { t: " est obligatoire. Les déchets qui ne sont pas triés, c’est " },
        { t: "inutile", label: 0, feedback: "In- heißt un-: inutile ist das Gegenteil von utile, also unnütz." },
        { t: " pour notre directrice. Chaque mois, un groupe d’élèves fait le " },
        { t: "nettoyage", label: 1, feedback: "Nettoy- + -age: Aus nettoyer (putzen) wird das Putzen." },
        { t: " de la cour. Ceux qui oublient doivent tout " },
        { t: "refaire", label: 0, feedback: "Re- heißt wieder: noch einmal machen." },
        { t: ". La " },
        { t: "protection", label: 1, feedback: "Protég- + -tion: Aus protéger wird der Schutz." },
        { t: " de la nature est importante, et les jeunes sont " },
        { t: "mécontents", label: 0, feedback: "Mé- verneint content: unzufrieden." },
        { t: " quand la cantine jette trop de pain." },
      ],
      conclusion: "Recyclage, nettoyage und protection erschließt du über das Suffix, inutile, refaire und mécontents über das Präfix.",
    },
    casework: {
      title: "Ein Zeitungsartikel mit neuen Wörtern",
      story:
        "Du liest: « Le surtourisme pose problème à Venise. La ville veut limiter le nombre de visiteurs, car les habitants trouvent la situation insupportable. Un réaménagement du centre est prévu. »",
      steps: [
        {
          question: "Was bedeutet wahrscheinlich « le surtourisme »?",
          options: ["Zu viel Tourismus.", "Tourismus unter Wasser.", "Tourismus im Winter."],
          answer: 0,
          explanation: "Sur- heißt über: Übertourismus, also zu viele Touristen.",
        },
        {
          question: "Wie erschließt du « insupportable »?",
          options: ["In- (un-) + supporter + -able: unerträglich.", "Ein Wort aus dem Englischen für Unterstützung.", "Ein Fachwort, das man nicht erschließen kann."],
          answer: 0,
          explanation: "Supporter heißt ertragen, -able -bar, in- un-: unerträglich. Das englische support wäre hier ein falscher Freund.",
        },
        {
          question: "Was steckt in « réaménagement »?",
          options: ["Wieder, gestalten und ein Nomen auf -ment.", "Ein Wort für ein Reisebüro oder eine Agentur.", "Die Verneinung des Verbs aménager."],
          answer: 0,
          explanation: "Ré- (wieder) + aménager (einrichten, gestalten) + -ment (Nomen): Neugestaltung.",
        },
      ],
      verdict:
        "Sur-, in-, -able, ré- und -ment: Mit Wortbildung erschließt du die drei schwierigen Wörter, ohne nachzuschlagen.",
    },
    tasks: {
      1: {
        prompt:
          "Erschließe die Wörter und erkläre, wie du vorgegangen bist: 1. imprévisible 2. une chanteuse 3. désorganisé 4. la rénovation",
        hints: ["Suche zuerst den Stamm: prévoir, chanter, organiser, rénover.", "Bestimme dann Präfix und Suffix."],
        model:
          "1. imprévisible: im- (un-) + prévoir (vorhersehen) + -ible (-bar) = unvorhersehbar. 2. une chanteuse: chanter + -euse (weibliche Person) = Sängerin. 3. désorganisé: dés- (un-) + organisé = unorganisiert, chaotisch. 4. la rénovation: rénover + -tion = die Renovierung.",
        criteria: ["Alle vier Wörter sind richtig erschlossen.", "Stamm, Präfix und Suffix sind benannt.", "Die Bedeutung passt."],
      },
      2: {
        prompt:
          "Bilde zu jedem Stamm zwei Wörter mit Präfix oder Suffix und verwende jedes in einem französischen Satz: 1. lire 2. utile 3. polluer",
        hints: ["Denke an -ible, -tion, -eur, in-, re-.", "Prüfe im Wörterbuch, ob es das Wort wirklich gibt."],
        model:
          "1. relire: Avant d’envoyer ma lettre, je la relis. lisible: Ton écriture n’est pas très lisible. 2. inutile: C’est inutile de crier. l’utilité: Je ne vois pas l’utilité de cette règle. 3. la pollution: La pollution de l’air est un problème en ville. un pollueur: Les grandes usines sont souvent de gros pollueurs.",
        criteria: ["Zu jedem Stamm gibt es zwei richtige Ableitungen.", "Jedes Wort steht in einem passenden Satz.", "Präfixe und Suffixe sind richtig verwendet."],
      },
    },
  },
  {
    id: "fr-aussprache",
    lb: 3,
    unit: "1.2.3",
    covers: ["1.2.3.1", "1.2.3.2"],
    title: "Aussprache: Laut und Schrift, Intonation und digitale Hilfen",
    intro:
      "Mit den Regeln für Laut und Schrift sprichst du neue Wörter richtig aus. Online-Wörterbücher mit Hörproben klären den Rest.",
    paragraphs: [
      "Französisch wird anders gesprochen als geschrieben, aber nach Regeln. **Stumme Endungen**: Am Wortende werden e, s, t, d, x und z meist nicht gesprochen (grand, petits, nez), die Verbendung -ent ist stumm (ils parlent), -ment in Adverbien aber nicht (vraiment). C, r, f und l am Ende hört man dagegen oft (avec, finir, neuf, avril). **Nasale**: an/en [ɑ̃] (enfant), on [ɔ̃] (maison), in/ain/ein [ɛ̃] (vin, pain, plein).",
      "**Liaison** und **enchaînement** verbinden Wörter: Ein stummer Endkonsonant wird vor Vokal gesprochen, wenn die Wörter eng zusammengehören: les‿amis [lezami], vous‿êtes, ils‿ont [ilzɔ̃], ein großer Unterschied zu ils sont [ilsɔ̃]. Nach et gibt es nie eine Liaison. **Intonation**: Aussagen fallen am Ende, Fragen ohne Fragewort steigen (Tu viens?), Aufzählungen steigen bis zum letzten Glied. Betont wird die letzte Silbe einer Wortgruppe.",
      "Für **unbekannte Wörter** nutzt du selbstständig **elektronische Hilfsmittel**: Online-Wörterbücher wie Larousse oder Wiktionnaire bieten Hörproben und die **Lautschrift** in eckigen Klammern. Lerne die wichtigsten Zeichen: [ʃ] wie in chat, [ʒ] wie in jour, [ɥ] wie in huit, [ɛ̃] wie in pain. Sprich das Wort nach, nimm dich mit dem Handy auf und vergleiche.",
      "Typische Fehler: Endkonsonanten sprechen (« petit » mit t), ils ont und ils sont gleich aussprechen, das h aussprechen (es ist im Französischen stumm), deutsche Betonung auf der ersten Silbe (Restaurant). Die App spielt keinen Ton ab und hört dich nicht: Nutze die Hörproben der Wörterbücher und übe mit anderen.",
    ],
    terms: [
      { term: "Liaison", text: "Ein sonst stummer Endkonsonant wird vor Vokal gesprochen: les‿enfants, ils‿ont. Nach et nie." },
      { term: "Nasalvokal", text: "Ein Vokal, bei dem Luft durch die Nase geht: an/en, on, in/ain. Das n wird nicht extra gesprochen." },
      { term: "Lautschrift", text: "Zeichen in eckigen Klammern im Wörterbuch, die die Aussprache zeigen: chat [ʃa], jour [ʒuʁ]." },
      { term: "Intonation", text: "Die Satzmelodie: Aussagen fallen am Ende, Fragen ohne Fragewort steigen." },
    ],
    takeaway:
      "Endungen e, s, t, d, x, z und -ent meist stumm; c, r, f, l oft hörbar. Liaison vor Vokal (ils‿ont ≠ ils sont), nie nach et. Fragen steigen, Aussagen fallen. Bei neuen Wörtern: Hörprobe und Lautschrift im Online-Wörterbuch, nachsprechen, aufnehmen.",
    sourceIds: ["lp", "larousse", "lepointdufle"],
    quiz: {
      question: "Wie unterscheidet man « ils ont » und « ils sont » beim Sprechen?",
      answer: "ils ont mit [z], ils sont mit [s].",
      wrong: ["Man kann sie gar nicht unterscheiden.", "ils ont mit [s], ils sont mit [z]."],
      explanation:
        "Bei ils ont entsteht durch die Liaison ein stimmhaftes [z]: [ilzɔ̃]. Bei ils sont hört man ein stimmloses [s]: [ilsɔ̃].",
    },
    workshop: {
      kind: "classify",
      title: "Gesprochen oder stumm?",
      instruction: "Ordne zu: Wird der markierte Buchstabe am Ende gesprochen, ist er stumm, oder entsteht eine Liaison?",
      categories: ["gesprochen", "stumm", "Liaison"],
      entries: [
        { text: "Das c in « avec mes amis » am Ende von avec", target: 0, feedback: "C am Ende wird meist gesprochen: avec [avɛk]." },
        { text: "Das t in « Il est petit. » am Ende von petit", target: 1, feedback: "T am Satzende ist stumm: petit [pəti]." },
        { text: "Das s in « les enfants » zwischen les und enfants", target: 2, feedback: "Vor Vokal entsteht eine Liaison mit [z]: [lezɑ̃fɑ̃]." },
        { text: "Die Endung -ent in « ils travaillent beaucoup »", target: 1, feedback: "Die Verbendung -ent der 3. Person Plural ist stumm." },
        { text: "Das r in « Je vais finir mon travail. » am Ende von finir", target: 0, feedback: "R am Ende von Verben auf -ir wird gesprochen." },
        { text: "Das s in « vous avez raison » zwischen vous und avez", target: 2, feedback: "Pronomen und Verb gehören eng zusammen: Liaison mit [z]." },
      ],
      conclusion: "C, r, f, l am Ende oft hörbar, t, s, -ent meist stumm, und vor Vokal verbindet die Liaison eng zusammengehörende Wörter.",
    },
    casework: {
      title: "Ein neues Wort für den Vortrag",
      story:
        "Für deine Präsentation über Umweltschutz brauchst du das Wort « l’écosystème ». Du weißt nicht, wie man es ausspricht, und hast nur dein Handy.",
      steps: [
        {
          question: "Wo findest du am schnellsten eine verlässliche Aussprache?",
          options: ["Im Online-Wörterbuch mit Hörprobe.", "Ich spreche es einfach deutsch aus.", "Ich lasse das Wort im Vortrag weg."],
          answer: 0,
          explanation: "Online-Wörterbücher wie Larousse oder Wiktionnaire haben Hörproben und Lautschrift.",
        },
        {
          question: "Im Wörterbuch steht [ekosistɛm]. Was sagt dir das?",
          options: ["Das s ist scharf, das e am Ende ist stumm.", "Das Wort wird wie im Englischen betont.", "Alle Buchstaben werden einzeln gesprochen."],
          answer: 0,
          explanation: "Die Lautschrift zeigt [s] und kein Zeichen für das Schluss-e: Es ist stumm.",
        },
        {
          question: "Wie prüfst du deine eigene Aussprache?",
          options: ["Ich nehme mich auf und vergleiche mit der Hörprobe.", "Ich frage niemanden und hoffe einfach das Beste.", "Ich schreibe die Lautschrift auf meine Folie."],
          answer: 0,
          explanation: "Aufnehmen und vergleichen zeigt dir Unterschiede, die du beim Sprechen selbst nicht hörst.",
        },
      ],
      verdict:
        "Hörprobe anhören, Lautschrift lesen, sich aufnehmen und vergleichen: So klärst du die Aussprache neuer Wörter selbstständig.",
    },
    tasks: {
      1: {
        prompt:
          "Gib für jeden Satz an, wo eine Liaison entsteht und welche Buchstaben am Ende stumm sind: 1. Mes amis sont grands. 2. Nous avons deux chats. 3. Ils ont des enfants.",
        hints: ["Liaison entsteht vor Vokal bei eng zusammengehörenden Wörtern.", "Prüfe s, t, d am Wortende."],
        model:
          "1. Liaison mes‿amis [mezami]; stumm sind das s von amis, das t von sont und das d und s von grands. 2. Liaison nous‿avons [nuzavɔ̃]; stumm sind das s von avons, das x von deux und das t und s von chats. 3. Liaison ils‿ont [ilzɔ̃] und des‿enfants [dezɑ̃fɑ̃]; stumm sind das t von ont und das t und s von enfants.",
        criteria: ["Alle Liaisons sind erkannt.", "Die stummen Endungen sind richtig bestimmt.", "Es ist keine Liaison erfunden."],
      },
      2: {
        prompt:
          "Wähle fünf neue Wörter aus deinem Wunschberuf oder einem Hobby. Schlage sie in einem Online-Wörterbuch nach und notiere zu jedem die Lautschrift, eine Ausspracheregel aus der Lektion, die du daran erkennst, und einen Beispielsatz.",
        hints: ["Achte auf Nasale, stumme Endungen und Akzente.", "Sprich jedes Wort nach und nimm dich auf."],
        model:
          "1. un mécanicien [mekanisjɛ̃]: Nasal -ien am Ende. Le mécanicien répare ma moto. 2. un atelier [atəlje]: -er am Ende wie [e], r stumm. Je travaille dans un atelier. 3. un moteur [mɔtœʁ]: r am Ende gesprochen. Le moteur fait du bruit. 4. le chantier [ʃɑ̃tje]: ch [ʃ] und Nasal an. Il est sur le chantier. 5. un outil [uti]: Hier ist das l ausnahmsweise stumm. J’ai besoin d’un outil.",
        criteria: ["Fünf Wörter mit Lautschrift sind notiert.", "Zu jedem ist eine passende Regel genannt.", "Die Beispielsätze sind richtig."],
      },
    },
  },
];
