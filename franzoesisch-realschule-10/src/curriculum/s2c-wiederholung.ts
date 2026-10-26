import type { Lesson } from "../model/types";

/**
 * Stufe 2, dritter Teil: Texte selbstständig sprachlich optimieren (Kompetenzerwartung 1.2.2.4). Der Plan
 * nennt dafür die Wiederholung wichtiger Grammatikinhalte: regelmäßige und unregelmäßige Verben, Zeiten und
 * Modi, Stellung und Angleichung des Adjektivs, Objektpronomen mit ihrer Stellung, die Verneinungen und
 * komplexe Sätze (die komplexen Sätze übt die Lektion zu den Strukturwörtern in Stufe 1).
 */
export const S2C: Lesson[] = [
  {
    id: "fr-wdh-zeiten-modi",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Wiederholung: Zeiten und Modi sicher wählen",
    intro:
      "Présent, passé composé, imparfait, futur, conditionnel und impératif: Signalwörter und Sinn zeigen dir, welche Form passt.",
    paragraphs: [
      "Für die Prüfung und für eigene Texte musst du die Zeiten sicher wählen. Das **présent** beschreibt Gegenwart und Gewohnheiten. Achtung: Mit **depuis** steht im Französischen das Präsens, wenn etwas noch andauert: « J’apprends le français depuis quatre ans. » (Ich lerne seit vier Jahren Französisch.) Das deutsche Perfekt wäre hier falsch.",
      "Für die Vergangenheit hast du das **passé composé** für einzelne, abgeschlossene Handlungen (hier, l’année dernière, tout à coup) und das **imparfait** für Zustände, Hintergrund und Gewohnheiten (autrefois, souvent, chaque été). Das passé composé bilden die Verben der Bewegung und des Zustandswechsels (aller, venir, partir, arriver, rester, tomber, naître, mourir …) und alle reflexiven Verben mit **être**, mit Angleichung: « Elles sont arrivées. », « Nous nous sommes levés. »",
      "Für die Zukunft nimmst du das **futur composé** (aller + Infinitiv) für Nahes und Geplantes und das **futur simple** für Ferneres, Vorhersagen und nach quand, wenn es um die Zukunft geht: « Quand j’aurai mon diplôme, je chercherai du travail. » (Im Deutschen steht hier Präsens.) Der **conditionnel** steht für Wünsche, höfliche Bitten, Ratschläge und im Hauptsatz einer gedachten Bedingung.",
      "Der **impératif** gibt Aufforderungen: Viens! Venez! Allons-y! Bei Verben auf -er fällt in der tu-Form das s weg: Regarde! Mange! Die Reihe der Modi ergänzen feste Wendungen mit Subjonctif (il faut que tu fasses), die du in Stufe 3 lernst. Typische Fehler: depuis mit passé composé, quand + Präsens für die Zukunft, « je suis allé » für eine Gewohnheit statt « j’allais ».",
    ],
    terms: [
      { term: "depuis + Präsens", text: "Für etwas, das bis jetzt andauert: « Il habite ici depuis 2020. » = Er wohnt seit 2020 hier." },
      { term: "quand + futur", text: "Für die Zukunft steht nach quand das futur simple: « Quand il viendra, on mangera. »" },
      { term: "passé composé mit être", text: "Verben der Bewegung und des Zustandswechsels sowie reflexive Verben; das Partizip richtet sich nach dem Subjekt." },
      { term: "impératif", text: "Die Befehlsform: Viens! Venez! Allons-y! Bei Verben auf -er ohne s in der tu-Form: Regarde!" },
    ],
    takeaway:
      "Présent auch mit depuis (andauernd). Passé composé für Handlungen, imparfait für Hintergrund und Gewohnheit; mit être bei Bewegung und reflexiv. Futur nach quand für Zukünftiges. Conditionnel für Wünsche, Rat, gedachte Folgen. Impératif ohne s bei -er.",
    sourceIds: ["lp", "lp9", "lingolia"],
    quiz: {
      question: "Wie sagst du: „Ich wohne seit drei Jahren in Augsburg“?",
      answer: "J’habite à Augsburg depuis trois ans.",
      wrong: ["J’ai habité à Augsburg depuis trois ans.", "J’habitais à Augsburg depuis trois ans."],
      explanation:
        "Etwas, das bis heute andauert, steht mit depuis im Präsens. Passé composé und imparfait würden heißen, dass es vorbei ist.",
    },
    workshop: {
      kind: "choose",
      title: "Die passende Zeit oder den passenden Modus wählen",
      instruction: "Achte auf Signalwörter (depuis, hier, souvent, quand, si) und auf den Sinn des Satzes.",
      items: [
        { before: "Ma sœur ", options: ["travaille", "a travaillé", "travaillera"], answer: 0, after: " dans cette entreprise depuis 2022.", feedback: "Depuis + andauernde Handlung: Präsens." },
        { before: "Quand j’", options: ["aurai", "ai", "aurais"], answer: 0, after: " dix-huit ans, je passerai mon permis.", feedback: "Quand mit Zukunftsbezug: futur simple j’aurai." },
        { before: "Hier, nous ", options: ["sommes partis", "avons parti", "partions"], answer: 0, after: " à six heures du matin.", feedback: "Hier + einzelne Handlung: passé composé; partir bildet es mit être." },
        { before: "Autrefois, mon grand-père ", options: ["allait", "est allé", "ira"], answer: 0, after: " à l’école à pied.", feedback: "Autrefois zeigt eine Gewohnheit: imparfait." },
        { before: "", options: ["Regarde", "Regardes", "Regarder"], answer: 0, after: " ce message, c’est important!", feedback: "Impératif in der tu-Form bei -er: ohne s, regarde." },
        { before: "Si tu étais plus prudent, tu ", options: ["aurais", "as", "auras"], answer: 0, after: " moins d’accidents.", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel tu aurais." },
      ],
      conclusion: "Signalwörter helfen, aber der Sinn entscheidet: andauernd mit depuis, Zukunft nach quand, Gewohnheit im imparfait, gedachte Folge im conditionnel.",
    },
    casework: {
      title: "Einen Bewerbungsbrief überarbeiten",
      story:
        "In Paulas Entwurf steht: « J’ai appris le français depuis quatre ans. L’été dernier, je faisais un stage dans un hôtel. Quand je finis l’école, je voudrai travailler dans le tourisme. »",
      steps: [
        {
          question: "Wie verbesserst du den ersten Satz?",
          options: ["J’apprends le français depuis quatre ans.", "J’apprenais le français depuis quatre ans.", "J’apprendrai le français depuis quatre ans."],
          answer: 0,
          explanation: "Paula lernt immer noch: depuis + Präsens.",
        },
        {
          question: "Welche Form passt für das Praktikum?",
          options: ["j’ai fait un stage", "je faisais un stage", "je ferai un stage"],
          answer: 0,
          explanation: "L’été dernier und ein abgeschlossenes Praktikum: passé composé.",
        },
        {
          question: "Wie lautet der letzte Satz richtig?",
          options: ["Quand je finirai l’école, je voudrais travailler dans le tourisme.", "Quand je finis l’école, je voudrai travailler dans le tourisme.", "Quand je finissais l’école, je voudrai travailler dans le tourisme."],
          answer: 0,
          explanation: "Nach quand steht für die Zukunft das futur (je finirai). Für den höflichen Wunsch passt je voudrais mit s.",
        },
      ],
      verdict:
        "Depuis mit Präsens, passé composé für das abgeschlossene Praktikum, futur nach quand und je voudrais mit s: Paulas Brief ist jetzt fehlerfrei.",
    },
    tasks: {
      1: {
        prompt:
          "Setze die Verben in die passende Form: 1. Nous (attendre) le bus depuis vingt minutes. 2. Quand tu (arriver) à Paris, appelle-moi! 3. Hier, elles (rentrer) tard.",
        hints: ["Prüfe die Signalwörter depuis, quand und hier.", "Achte bei rentrer auf das Hilfsverb und die Angleichung."],
        model:
          "1. Nous attendons le bus depuis vingt minutes (depuis + Präsens, wir warten noch). 2. Quand tu arriveras à Paris, appelle-moi! (quand + futur für die Zukunft) 3. Hier, elles sont rentrées tard (passé composé mit être, Angleichung an elles).",
        criteria: ["Alle drei Formen sind richtig.", "Die Wahl ist mit dem Signalwort begründet.", "Hilfsverb und Angleichung bei rentrer stimmen."],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Text (acht Sätze) über deinen bisherigen Weg mit der französischen Sprache und deine Pläne. Verwende depuis + Präsens, passé composé, imparfait, futur simple nach quand, einen conditionnel und einen Imperativ.",
        hints: ["Plane zuerst: Was dauert an, was war einmal, was war oft, was kommt?", "Der Imperativ kann ein Tipp an die Leser sein."],
        model:
          "J’apprends le français depuis quatre ans. Au début, je trouvais la prononciation très difficile. Il y a deux ans, j’ai fait un échange avec une école à Dijon, et tout a changé. Je parlais français toute la journée avec ma famille d’accueil. Maintenant, je regarde souvent des séries en français. Quand j’aurai fini l’école, je ferai peut-être un stage en France. J’aimerais bien travailler un jour pour une entreprise franco-allemande. Si vous hésitez encore, essayez un échange: ça change tout!",
        criteria: ["Alle geforderten Formen kommen richtig vor.", "Die Zeiten passen zum Sinn.", "Der Text ist zusammenhängend."],
      },
    },
    practice: {
      kind: "choose",
      title: "Zeiten und Modi: Übungsrunde",
      instruction: "Wähle die Form, die zu Signalwort und Sinn passt. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Il ", options: ["joue", "a joué"], answer: 0, after: " au foot depuis cinq ans.", feedback: "Depuis + andauernde Handlung: Präsens il joue." },
          { before: "Hier, je ", options: ["suis allé", "allais"], answer: 0, after: " au cinéma.", feedback: "Hier + einzelne Handlung: passé composé." },
          { before: "Avant, nous ", options: ["habitions", "avons habité"], answer: 0, after: " à Rome.", feedback: "Ein Zustand von früher: imparfait nous habitions." },
          { before: "Quand il ", options: ["viendra", "vient"], answer: 0, after: ", on mangera.", feedback: "Quand mit Zukunftsbezug: futur il viendra." },
          { before: "", options: ["Mange", "Manges"], answer: 0, after: " ta soupe, s’il te plaît!", feedback: "Impératif bei -er in der tu-Form: ohne s, mange." },
          { before: "Elles se sont ", options: ["levées", "levé"], answer: 0, after: " tôt.", feedback: "Reflexive Verben: Angleichung an elles, also levées." },
          { before: "Je ", options: ["voudrais", "voudrai"], answer: 0, after: " un renseignement, s’il vous plaît.", feedback: "Höfliche Bitte im conditionnel: je voudrais mit s." },
          { before: "Demain, il ", options: ["va pleuvoir", "pleuvait"], answer: 0, after: " toute la journée.", feedback: "Demain und eine Vorhersage: futur composé." },
        ],
        2: [
          { before: "Mon correspondant ", options: ["apprend", "a appris", "apprenait"], answer: 0, after: " l’allemand depuis trois ans et il le parle déjà très bien.", feedback: "Er lernt immer noch: depuis + Präsens." },
          { before: "Pendant que nous ", options: ["regardions", "avons regardé", "regarderons"], answer: 0, after: " le film, quelqu’un a sonné à la porte de l’appartement.", feedback: "Die Hintergrundhandlung, die unterbrochen wird: imparfait." },
          { before: "Quand tu ", options: ["auras", "as", "aurais"], answer: 0, after: " reçu les résultats de l’examen, envoie-moi un message tout de suite.", feedback: "Quand mit Zukunftsbezug: futur, hier tu auras reçu." },
          { before: "L’année dernière, ma cousine ", options: ["est partie", "a parti", "partait"], answer: 0, after: " six mois en Australie pour améliorer son anglais.", feedback: "Einmaliges, abgeschlossenes Ereignis: passé composé mit être, Angleichung an ma cousine." },
          { before: "Si la ville construisait une piscine, les jeunes du quartier ", options: ["seraient", "sont", "seront"], answer: 0, after: " vraiment contents.", feedback: "Hauptsatz einer gedachten Bedingung: conditionnel." },
          { before: "Chaque dimanche de notre enfance, nous ", options: ["allions", "sommes allés", "irons"], answer: 0, after: " déjeuner chez nos grands-parents à la campagne.", feedback: "Chaque dimanche zeigt eine Gewohnheit: imparfait." },
          { before: "N’oubliez pas votre passeport et ", options: ["arrivez", "arriverez", "arriviez"], answer: 0, after: " à l’aéroport deux heures avant le départ du vol.", feedback: "Eine Aufforderung im impératif: arrivez." },
          { before: "Les élèves se sont ", options: ["inscrits", "inscrit", "inscrite"], answer: 0, after: " au concours de théâtre organisé par l’Institut français.", feedback: "Reflexives Verb mit être: Angleichung an les élèves, männlich Plural." },
        ],
      },
    },
  },
  {
    id: "fr-wdh-adjektiv",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Wiederholung: Stellung und Angleichung des Adjektivs",
    intro:
      "Die meisten Adjektive stehen nach dem Nomen, einige kurze davor. Immer passen sie sich in Geschlecht und Zahl an.",
    paragraphs: [
      "**Angleichung**: Das Adjektiv richtet sich nach dem Nomen. Weiblich meist mit -e (grand → grande), Plural mit -s (grands, grandes). Merke die Muster: -eux → -euse (heureux, heureuse), -if → -ive (sportif, sportive), -el → -elle (naturel, naturelle), -en → -enne (européen, européenne), -er → -ère (cher, chère), blanc → blanche, long → longue. Im Plural: -eau → -eaux (beaux), -al → -aux (sociaux, internationaux).",
      "**Stellung**: Die meisten Adjektive stehen **nach** dem Nomen, besonders Farben, Herkunft, Formen und lange Adjektive: une veste noire, un film français, une idée intéressante. Einige kurze, häufige Adjektive stehen **vor** dem Nomen: beau, joli, bon, mauvais, grand, petit, gros, jeune, vieux, nouveau, long. Eine Merkhilfe: Schönheit, Alter, Güte, Größe stehen vorn.",
      "Beau, nouveau und vieux haben vor einem männlichen Nomen mit Vokal oder stummem h eine **Sonderform**: un bel appartement, un nouvel ami, un vieil hôtel. Weiblich heißen sie belle, nouvelle, vieille. Steht im Plural ein Adjektiv vor dem Nomen, wird des in der Schriftsprache zu **de**: de jolies maisons, de nouveaux projets.",
      "Bei einigen Adjektiven ändert die Stellung die Bedeutung: un grand homme (ein bedeutender Mann), un homme grand (ein großer Mann); mon ancien collège (meine frühere Schule), un bâtiment ancien (ein altes Gebäude). Typische Fehler: fehlende Angleichung (« une idée intéressant »), falsche Stellung (« une noire veste ») und « un nouveau appartement » statt un nouvel appartement.",
    ],
    terms: [
      { term: "Angleichung", text: "Das Adjektiv passt sich in Geschlecht und Zahl an das Nomen an: des amies sportives." },
      { term: "vorangestellte Adjektive", text: "Kurze, häufige Adjektive wie beau, bon, grand, petit, jeune, vieux, nouveau stehen vor dem Nomen." },
      { term: "bel, nouvel, vieil", text: "Sonderformen vor männlichen Nomen mit Vokal oder stummem h: un bel endroit, un nouvel élève, un vieil arbre." },
    ],
    takeaway:
      "Adjektiv immer angleichen (-e, -s; -eux → -euse, -if → -ive, -el → -elle, -al → -aux). Meist nach dem Nomen; beau, bon, grand, petit, jeune, vieux, nouveau davor. Vor Vokal: bel, nouvel, vieil. Plural mit vorangestelltem Adjektiv: de statt des.",
    sourceIds: ["lp", "lp9", "lingolia"],
    quiz: {
      question: "Welche Wendung ist richtig?",
      answer: "un nouvel appartement lumineux",
      wrong: ["un nouveau appartement lumineux", "un appartement nouvel lumineux"],
      explanation:
        "Nouveau steht vor dem Nomen und wird vor Vokal zu nouvel. Lumineux steht danach.",
    },
    workshop: {
      kind: "choose",
      title: "Das Adjektiv richtig stellen und angleichen",
      instruction: "Wähle die richtige Form und Stellung. Prüfe Geschlecht und Zahl des Nomens.",
      items: [
        { before: "Ma tante a acheté ", options: ["une voiture électrique", "une électrique voiture", "une voiture électriques"], answer: 0, after: ".", feedback: "Électrique steht nach dem Nomen und bleibt im Singular." },
        { before: "Nous avons visité ", options: ["un vieil hôtel", "un vieux hôtel", "un hôtel vieil"], answer: 0, after: " au centre de Rouen.", feedback: "Vieux steht vorn und wird vor stummem h zu vieil." },
        { before: "C’est une fille très ", options: ["sportive", "sportif", "sportife"], answer: 0, after: " et très drôle.", feedback: "-if wird weiblich zu -ive: sportive." },
        { before: "Ce sont des problèmes ", options: ["sociaux", "socials", "sociales"], answer: 0, after: " importants.", feedback: "-al wird im männlichen Plural zu -aux: sociaux." },
        { before: "Il y a ", options: ["de belles plages", "des plages belles", "de beaux plages"], answer: 0, after: " en Bretagne.", feedback: "Belle steht vorn, weiblich Plural; davor wird des zu de." },
        { before: "Mes cousines sont très ", options: ["heureuses", "heureux", "heureuse"], answer: 0, after: " de venir.", feedback: "-eux wird weiblich zu -euse, Plural -euses." },
      ],
      conclusion: "Erst Stellung (vor oder nach dem Nomen), dann Angleichung (Geschlecht, Zahl) und die Sonderformen bel, nouvel, vieil.",
    },
    casework: {
      title: "Eine Wohnungsanzeige verbessern",
      story:
        "Du hilfst deinem Onkel, eine Anzeige für Austauschschüler zu schreiben. Sein Entwurf: « Nous louons une chambre grande dans un nouveau appartement. La cuisine est moderne et les voisins sont gentil. »",
      steps: [
        {
          question: "Wie verbesserst du « une chambre grande »?",
          options: ["une grande chambre", "une grand chambre", "une chambre grandes"],
          answer: 0,
          explanation: "Grand gehört zu den vorangestellten Adjektiven und wird weiblich zu grande.",
        },
        {
          question: "Was ist an « un nouveau appartement » falsch?",
          options: ["Vor Vokal heißt es nouvel.", "Nouveau muss nach dem Nomen stehen.", "Appartement ist ein weibliches Nomen."],
          answer: 0,
          explanation: "Vor einem männlichen Nomen mit Vokal wird nouveau zu nouvel: un nouvel appartement.",
        },
        {
          question: "Wie lautet « les voisins sont gentil » richtig?",
          options: ["les voisins sont gentils", "les voisins sont gentilles", "les voisins sont gentille"],
          answer: 0,
          explanation: "Les voisins ist männlich Plural: gentils.",
        },
      ],
      verdict:
        "Grande vor das Nomen, nouvel vor Vokal und gentils mit Plural-s: Die Anzeige ist jetzt richtig.",
    },
    tasks: {
      1: {
        prompt:
          "Stelle und gleiche an: 1. une maison (petit, blanc) 2. des amis (vieux, fidèle) 3. un hôtel (beau, international)",
        hints: ["Prüfe für jedes Adjektiv: vor oder nach dem Nomen?", "Achte auf Sonderformen vor Vokal und den Plural von -al."],
        model:
          "1. une petite maison blanche (petit vorn, blanc hinten und weiblich blanche) 2. de vieux amis fidèles (vieux vorn, deshalb de statt des) 3. un bel hôtel international (beau wird vor stummem h zu bel).",
        criteria: ["Die Stellung ist richtig.", "Alle Adjektive sind angeglichen.", "Sonderformen und de statt des sind beachtet."],
      },
      2: {
        prompt:
          "Beschreibe in sechs bis acht Sätzen eine Stadt oder ein Viertel, das du magst, für französische Austauschschüler. Verwende mindestens acht Adjektive, darunter drei vorangestellte und eine Sonderform (bel, nouvel oder vieil).",
        hints: ["Mische Farben, Herkunft und Bewertungen.", "Prüfe am Ende jede Angleichung."],
        model:
          "Ratisbonne est une belle ville ancienne au bord du Danube. Dans le vieux centre, il y a de petites rues étroites et des maisons colorées. On peut voir un vieux pont en pierre, très célèbre, et un vieil hôtel de ville. Près de la gare, il y a un nouvel espace culturel avec un cinéma moderne. Les cafés italiens sont très agréables en été. Les gens sont souvent sympathiques et accueillants. C’est une ville idéale pour un séjour linguistique.",
        criteria: ["Mindestens acht Adjektive sind richtig angeglichen.", "Drei vorangestellte Adjektive und eine Sonderform kommen vor.", "Die Beschreibung ist anschaulich."],
      },
    },
    practice: {
      kind: "choose",
      title: "Adjektive: Übungsrunde",
      instruction: "Wähle die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "C’est une ", options: ["belle", "beau"], answer: 0, after: " journée.", feedback: "Beau wird weiblich zu belle und steht vorn." },
          { before: "J’ai un ", options: ["nouvel", "nouveau"], answer: 0, after: " ordinateur.", feedback: "Vor einem Vokal heißt es nouvel: un nouvel ordinateur." },
          { before: "Elle porte une robe ", options: ["blanche", "blanc"], answer: 0, after: " pour la fête.", feedback: "Blanc wird weiblich zu blanche." },
          { before: "Ce sont des films ", options: ["français", "françaises"], answer: 0, after: " pour toute la famille.", feedback: "Films ist männlich: français bleibt im Plural gleich." },
          { before: "Ma sœur est très ", options: ["créative", "créatif"], answer: 0, after: " en cuisine.", feedback: "-if wird weiblich zu -ive: créative." },
          { before: "Il habite dans une ", options: ["petite maison", "maison petite"], answer: 0, after: " près du lac.", feedback: "Petit steht vor dem Nomen: une petite maison." },
          { before: "Ils ont des ", options: ["idées originales", "originales idées"], answer: 0, after: " pour la fête.", feedback: "Original steht nach dem Nomen und wird weiblich Plural." },
          { before: "Les journaux ", options: ["régionaux", "régionals"], answer: 0, after: " parlent du projet.", feedback: "-al wird im männlichen Plural zu -aux: régionaux." },
        ],
        2: [
          { before: "Pendant notre séjour, nous avons logé dans ", options: ["un bel hôtel", "un beau hôtel", "un hôtel bel"], answer: 0, after: " avec une vue magnifique sur le port de Marseille.", feedback: "Beau steht vorn und wird vor stummem h zu bel." },
          { before: "Les élèves de la classe ont présenté des projets très ", options: ["créatifs", "créatives", "créatif"], answer: 0, after: " pendant la journée portes ouvertes du collège.", feedback: "Projets ist männlich Plural: créatifs." },
          { before: "Ma grand-mère garde ", options: ["de vieilles photos", "des photos vieilles", "de vieux photos"], answer: 0, after: " de sa jeunesse dans une boîte en carton.", feedback: "Vieux steht vorn, weiblich Plural vieilles; davor wird des zu de." },
          { before: "La France et l’Allemagne ont signé des accords ", options: ["internationaux", "internationals", "internationales"], answer: 0, after: " importants pour la protection du climat.", feedback: "Accords ist männlich Plural, -al wird zu -aux." },
          { before: "Après le stage, la cheffe m’a écrit une lettre ", options: ["très positive", "très positif", "positive très"], answer: 0, after: " que je vais joindre à ma candidature.", feedback: "Positif wird weiblich zu positive und steht nach dem Nomen." },
          { before: "Notre école a accueilli ", options: ["un nouvel élève", "un nouveau élève", "un élève nouvel"], answer: 0, after: " qui vient de Belgique et qui parle trois langues.", feedback: "Nouveau steht vorn und wird vor Vokal zu nouvel." },
          { before: "Les rues de ce quartier sont ", options: ["étroites et sombres", "étroits et sombres", "étroite et sombre"], answer: 0, after: ", mais les habitants les trouvent charmantes.", feedback: "Les rues ist weiblich Plural: étroites; sombre hat im Plural nur -s." },
          { before: "Victor Hugo est considéré comme ", options: ["un grand écrivain", "un écrivain grand", "une grande écrivain"], answer: 0, after: " du dix-neuvième siècle.", feedback: "Grand vor dem Nomen heißt hier bedeutend: un grand écrivain." },
        ],
      },
    },
  },
  {
    id: "fr-wdh-objektpronomen",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Wiederholung: direkte und indirekte Objektpronomen",
    intro:
      "Le, la, les ersetzen direkte Objekte, lui und leur indirekte mit à. Sie stehen vor dem konjugierten Verb oder vor dem Infinitiv.",
    paragraphs: [
      "**Direkte Objektpronomen** ersetzen ein Objekt ohne Präposition: le, la, l’, les. « Tu connais Paul? – Oui, je le connais. », « Les photos, je les regarde. » **Indirekte Objektpronomen** ersetzen ein Objekt mit à (bei Personen): lui (ihm, ihr), leur (ihnen). « Je téléphone à ma mère. → Je lui téléphone. » Me, te, nous, vous sind direkt und indirekt gleich.",
      "Ob ein Objekt direkt oder indirekt ist, entscheidet das französische Verb, nicht das deutsche. **Direkt** sind zum Beispiel aider qn, écouter qn, attendre qn, appeler qn, remercier qn: « Je l’aide. » (Ich helfe ihm!) **Indirekt** mit à sind parler à, téléphoner à, répondre à, demander à, écrire à, donner à, ressembler à: « Je lui réponds. » Lerne die Verben mit ihrer Ergänzung.",
      "**Stellung**: Das Pronomen steht vor dem konjugierten Verb (« Je la vois. »), in der Verneinung zwischen ne und Verb (« Je ne la vois pas. »), im passé composé vor dem Hilfsverb (« Je l’ai vue. », « Je ne lui ai pas écrit. »), bei Verb + Infinitiv vor dem Infinitiv (« Je vais les appeler. », « Tu peux lui parler? »). Im bejahten Imperativ steht es hinter dem Verb mit Bindestrich: « Aide-moi! », « Appelle-la! », im verneinten davor: « Ne l’appelle pas! »",
      "Im passé composé mit avoir richtet sich das Partizip nach einem **vorangestellten direkten Objekt**: « Ta lettre, je l’ai lue. », « Les filles, je les ai vues. » Bei lui und leur gibt es keine Angleichung. Typische Fehler: « Je lui aide » (aider ist direkt), « Je le téléphone » (téléphoner ist indirekt), « J’ai la vue » statt je l’ai vue und « leurs » als Pronomen (leur bleibt ohne s).",
    ],
    terms: [
      { term: "direktes Objektpronomen", text: "Le, la, l’, les ersetzen ein Objekt ohne Präposition: « Je le connais. »" },
      { term: "indirektes Objektpronomen", text: "Lui und leur ersetzen à + Person: « Je lui parle. », « Je leur écris. »" },
      { term: "Stellung", text: "Vor dem konjugierten Verb, im passé composé vor dem Hilfsverb, bei Verb + Infinitiv vor dem Infinitiv; im bejahten Imperativ dahinter." },
      { term: "Angleichung", text: "Mit avoir passt sich das Partizip an ein vorangestelltes direktes Objekt an: « Les clés, je les ai prises. »" },
    ],
    takeaway:
      "Direkt: le, la, les (aider, écouter, attendre, appeler qn). Indirekt: lui, leur (parler, téléphoner, répondre, écrire à qn). Pronomen vor dem konjugierten Verb, vor dem Hilfsverb oder vor dem Infinitiv; im bejahten Imperativ dahinter. Angleichung nur bei direktem Objekt.",
    sourceIds: ["lp", "lp9", "lingolia"],
    quiz: {
      question: "Wie sagst du: „Ich helfe ihr jeden Tag“?",
      answer: "Je l’aide tous les jours.",
      wrong: ["Je lui aide tous les jours.", "J’aide la tous les jours."],
      explanation:
        "Aider hat im Französischen ein direktes Objekt: aider quelqu’un. Also l’ (la) vor dem Verb, nicht lui wie im Deutschen „ihr“.",
    },
    workshop: {
      kind: "choose",
      title: "Das richtige Pronomen an der richtigen Stelle",
      instruction: "Prüfe zuerst, ob das Verb ein direktes oder ein indirektes Objekt hat, dann die Stellung.",
      items: [
        { before: "– Tu as appelé ta grand-mère? – Oui, je ", options: ["l’ai appelée", "lui ai appelé", "ai l’appelée"], answer: 0, after: " hier soir.", feedback: "Appeler ist direkt: l’ vor dem Hilfsverb, Angleichung an la grand-mère." },
        { before: "– Tu réponds à tes parents? – Oui, je ", options: ["leur réponds", "les réponds", "leurs réponds"], answer: 0, after: " tout de suite.", feedback: "Répondre à ist indirekt: leur, ohne s." },
        { before: "Ce film, je vais ", options: ["le regarder", "regarder le", "lui regarder"], answer: 0, after: " ce soir.", feedback: "Bei Verb + Infinitiv steht das Pronomen vor dem Infinitiv: le regarder." },
        { before: "Ton frère est triste. ", options: ["Parle-lui", "Parle-le", "Lui parle"], answer: 0, after: " un peu!", feedback: "Parler à ist indirekt; im bejahten Imperativ steht lui hinter dem Verb." },
        { before: "Les clés? Je ne ", options: ["les ai pas vues", "les ai pas vu", "ai pas les vues"], answer: 0, after: ".", feedback: "Les vor dem Hilfsverb, Angleichung an les clés (weiblich Plural): vues." },
        { before: "– Tu attends Sarah? – Oui, je ", options: ["l’attends", "lui attends", "attends la"], answer: 0, after: " devant le cinéma.", feedback: "Attendre ist direkt: l’attends." },
      ],
      conclusion: "Erst direkt oder indirekt (das französische Verb entscheidet), dann die Stellung und im passé composé die Angleichung.",
    },
    casework: {
      title: "Nachrichten an die Gastfamilie",
      story:
        "Tim schreibt: « J’ai écrit à ma famille d’accueil. Je lui ai envoyé des photos. Madame Martin? Je l’aide souvent dans le jardin. Ses enfants, je les ai rencontrés hier. Je vais leur offrir un cadeau. »",
      steps: [
        {
          question: "Warum steht « je l’aide » und nicht « je lui aide »?",
          options: ["Aider hat ein direktes Objekt.", "Weil Madame Martin weiblich ist.", "Weil aider mit einem Vokal beginnt."],
          answer: 0,
          explanation: "Aider quelqu’un: Das Objekt ist direkt, also l’. Das deutsche „ihr helfen“ täuscht.",
        },
        {
          question: "Warum endet « rencontrés » auf -és?",
          options: ["Les steht als direktes Objekt davor.", "Weil das Subjekt je im Plural steht.", "Weil rencontrer mit être gebildet wird."],
          answer: 0,
          explanation: "Das direkte Objekt les (ses enfants) steht vor avoir, also wird das Partizip angeglichen.",
        },
        {
          question: "Warum steht « leur » vor offrir?",
          options: ["Bei Verb + Infinitiv steht es vor dem Infinitiv.", "Leur steht immer direkt hinter dem Subjekt.", "Weil aller ein Bewegungsverb mit être ist."],
          answer: 0,
          explanation: "Bei je vais + Infinitiv gehört das Pronomen zum Infinitiv: leur offrir.",
        },
      ],
      verdict:
        "Lui für à + Person, l’ für das direkte Objekt von aider, Angleichung bei les, Stellung vor dem Infinitiv: Tims Text ist richtig.",
    },
    tasks: {
      1: {
        prompt:
          "Ersetze das unterstrichene Objekt durch ein Pronomen: 1. Je téléphone à mon oncle. 2. Nous attendons nos amis. 3. J’ai acheté la veste. 4. Elle va écrire à ses grands-parents.",
        hints: ["Prüfe: Steht à vor der Person?", "Achte im passé composé auf die Angleichung."],
        model:
          "1. Je lui téléphone (téléphoner à: indirekt). 2. Nous les attendons (attendre: direkt). 3. Je l’ai achetée (direkt, vor dem Hilfsverb, Angleichung an la veste). 4. Elle va leur écrire (écrire à: indirekt, vor dem Infinitiv).",
        criteria: ["Direkte und indirekte Pronomen sind richtig unterschieden.", "Die Stellung ist richtig.", "Die Angleichung bei 3 ist beachtet."],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Dialog (acht Zeilen) zwischen zwei Freunden, die eine Abschiedsfeier für ihre Lehrerin vorbereiten. Verwende mindestens sechs Objektpronomen, darunter lui und leur, ein Pronomen im passé composé und eines im Imperativ.",
        hints: ["Fragen wie Tu as invité …? und Tu as parlé à …? helfen.", "Prüfe bei jedem Verb, ob es direkt oder indirekt ist."],
        model:
          "– Tu as invité les parents? – Oui, je les ai invités hier. – Et Madame Weber, tu lui as dit que c’est une surprise? – Non, je ne lui ai rien dit! – Les élèves de l’autre classe, tu leur as écrit? – Oui, je vais les appeler ce soir aussi. – Et le gâteau? – Je l’achète demain. Aide-moi à le porter, il est énorme! – D’accord, je t’attends devant la boulangerie.",
        criteria: ["Mindestens sechs Pronomen sind richtig verwendet.", "Lui und leur stehen bei indirekten Verben.", "Passé composé und Imperativ mit Pronomen sind richtig."],
      },
    },
    practice: {
      kind: "choose",
      title: "Objektpronomen: Übungsrunde",
      instruction: "Wähle das richtige Pronomen an der richtigen Stelle. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Paul? Je ", options: ["le", "lui"], answer: 0, after: " vois demain.", feedback: "Voir hat ein direktes Objekt: le." },
          { before: "Ma mère? Je ", options: ["lui", "la"], answer: 0, after: " téléphone ce soir.", feedback: "Téléphoner à ist indirekt: lui." },
          { before: "Mes amis? Je ", options: ["les", "leur"], answer: 0, after: " aide souvent.", feedback: "Aider hat ein direktes Objekt: les." },
          { before: "Les profs? Je ", options: ["leur", "les"], answer: 0, after: " parle après le cours.", feedback: "Parler à ist indirekt: leur, ohne s am Ende." },
          { before: "Cette chanson? Je ", options: ["l’adore", "lui adore"], answer: 0, after: " vraiment.", feedback: "Adorer hat ein direktes Objekt: l’." },
          { before: "Ta sœur? Tu peux ", options: ["l’appeler", "lui appeler"], answer: 0, after: " maintenant?", feedback: "Appeler ist direkt, das Pronomen steht vor dem Infinitiv." },
          { before: "Le livre? Je ne ", options: ["l’ai pas lu", "lui ai pas lu"], answer: 0, after: " encore.", feedback: "Lire hat ein direktes Objekt: l’ vor dem Hilfsverb." },
          { before: "Ton père? ", options: ["Écris-lui", "Écris-le"], answer: 0, after: " une carte!", feedback: "Écrire à ist indirekt; im Imperativ steht lui hinter dem Verb." },
        ],
        2: [
          { before: "Les étudiants étrangers sont arrivés hier. Le directeur ", options: ["les a accueillis", "leur a accueillis", "les a accueilli"], answer: 0, after: " personnellement à l’entrée du lycée.", feedback: "Accueillir ist direkt; les steht vor avoir, also Angleichung: accueillis." },
          { before: "Ma correspondante m’a envoyé un long message, mais je ne ", options: ["lui ai pas encore répondu", "l’ai pas encore répondu", "lui ai pas encore répondue"], answer: 0, after: ", je n’ai pas eu le temps.", feedback: "Répondre à ist indirekt: lui; bei lui gibt es keine Angleichung." },
          { before: "Mes grands-parents habitent loin, alors je ", options: ["leur écris", "les écris", "leurs écris"], answer: 0, after: " souvent des cartes postales pendant les vacances.", feedback: "Écrire à ist indirekt: leur, ohne s." },
          { before: "Cette entreprise cherche des stagiaires. Tu devrais ", options: ["l’appeler", "lui appeler", "appeler la"], answer: 0, after: " dès demain matin pour demander un rendez-vous.", feedback: "Appeler ist direkt; das Pronomen steht vor dem Infinitiv." },
          { before: "Les lettres de motivation? Je ", options: ["les ai écrites", "les ai écrit", "leur ai écrites"], answer: 0, after: " hier soir et je les ai envoyées ce matin.", feedback: "Direktes Objekt les vor avoir: Angleichung an les lettres, écrites." },
          { before: "Le petit garçon pleurait, alors la vendeuse ", options: ["lui a donné", "l’a donné", "lui a donnée"], answer: 0, after: " un bonbon pour le consoler.", feedback: "Donner à quelqu’un ist indirekt: lui, ohne Angleichung." },
          { before: "Ces conseils sont importants: ", options: ["ne les oublie pas", "ne oublie les pas", "oublie-les pas"], answer: 0, after: " pendant l’entretien d’embauche!", feedback: "Im verneinten Imperativ steht das Pronomen vor dem Verb: ne les oublie pas." },
          { before: "Ma voisine a besoin d’aide pour déménager. Nous allons ", options: ["l’aider", "lui aider", "aider lui"], answer: 0, after: " samedi avec toute la famille.", feedback: "Aider ist direkt, auch wenn man im Deutschen „ihr helfen“ sagt: l’aider." },
        ],
      },
    },
  },
  {
    id: "fr-wdh-verneinung",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.4"],
    title: "Wiederholung: Verneinungen und ihre Stellung",
    intro:
      "Ne … pas, plus, jamais, rien, personne, pas encore: Die Verneinung umschließt das Verb, und un, une, des werden zu de.",
    paragraphs: [
      "Die französische Verneinung hat zwei Teile, die das konjugierte Verb umschließen: **ne … pas** (nicht), **ne … plus** (nicht mehr), **ne … jamais** (nie), **ne … rien** (nichts), **ne … personne** (niemand), **ne … pas encore** (noch nicht). Vor Vokal wird ne zu n’: « Je n’ai jamais vu la mer. » Dazu kommen ne … que (nur) und ne … pas non plus (auch nicht) aus dieser Stufe.",
      "**Stellung im passé composé**: ne … pas, plus, jamais, rien und pas encore umschließen das Hilfsverb: « Je n’ai rien compris. », « Elle n’est jamais allée à Paris. » **Personne** steht hinter dem Partizip: « Je n’ai vu personne. » Beim Infinitiv stehen beide Teile davor: « Il est important de ne pas fumer. », « Je préfère ne rien dire. » Mit Pronomen: « Je ne le vois pas. »",
      "**Rien** und **personne** können auch Subjekt sein; dann stehen sie vorn, und pas fällt weg: « Rien ne marche. », « Personne n’est venu. » Nach einer Verneinung werden **un, une, du, de la, des** zu **de**: « Je n’ai pas de voiture. », « Il ne boit plus de café. » Ausnahme: nach être bleibt der Artikel (« Ce n’est pas un problème. »), und bei ne … que bleibt er ohnehin.",
      "Typische Fehler: ne vergessen (in Texten immer schreiben), pas zusätzlich zu rien oder jamais setzen (« Je n’ai pas rien fait »), personne falsch stellen (« Je n’ai personne vu ») und « Je n’ai pas une voiture » statt de. In der gesprochenen Sprache hörst du oft « J’ai rien compris »; in der Prüfung schreibst du ne.",
    ],
    terms: [
      { term: "ne … plus / jamais / rien / personne", text: "Nicht mehr, nie, nichts, niemand. Ne steht vor dem konjugierten Verb, der zweite Teil dahinter." },
      { term: "personne im passé composé", text: "Personne steht hinter dem Partizip: « Je n’ai rencontré personne. »" },
      { term: "ne pas + Infinitiv", text: "Beim Infinitiv stehen beide Teile vor dem Verb: « Essaie de ne pas oublier. »" },
      { term: "de nach Verneinung", text: "Un, une, du, de la, des werden zu de: « Il n’a plus de temps. » Nach être nicht." },
    ],
    takeaway:
      "Ne + Verb + pas/plus/jamais/rien/pas encore; im passé composé um das Hilfsverb, personne hinter dem Partizip; beim Infinitiv ne pas davor. Rien ne, personne ne als Subjekt ohne pas. Nach Verneinung de statt un, des, du (außer nach être).",
    sourceIds: ["lp", "lp9", "lingolia"],
    quiz: {
      question: "Wie sagst du: „Ich habe niemanden getroffen“?",
      answer: "Je n’ai rencontré personne.",
      wrong: ["Je n’ai personne rencontré.", "Je n’ai pas rencontré personne."],
      explanation:
        "Personne steht im passé composé hinter dem Partizip und ersetzt pas. Pas und personne zusammen sind falsch.",
    },
    workshop: {
      kind: "choose",
      title: "Die Verneinung richtig bauen",
      instruction: "Wähle die richtige Verneinung. Achte auf die Stellung und auf de nach der Verneinung.",
      items: [
        { before: "Malheureusement, je n’ai ", options: ["rien compris", "compris rien", "pas rien compris"], answer: 0, after: " pendant le cours.", feedback: "Rien umschließt mit ne das Hilfsverb und ersetzt pas." },
        { before: "Nous n’avons vu ", options: ["personne", "pas personne", "rien personne"], answer: 0, after: " dans la rue.", feedback: "Personne steht hinter dem Partizip und ersetzt pas." },
        { before: "Mon frère n’a plus ", options: ["de", "du", "un"], answer: 0, after: " vélo depuis l’accident.", feedback: "Nach der Verneinung wird un zu de." },
        { before: "Il est important de ", options: ["ne pas", "pas ne", "ne"], answer: 0, after: " arriver en retard à l’entretien.", feedback: "Beim Infinitiv stehen ne pas beide davor." },
        { before: "", options: ["Personne n’a", "Personne a", "Pas personne a"], answer: 0, after: " répondu à mon message.", feedback: "Personne als Subjekt mit ne, ohne pas." },
        { before: "Elle n’est ", options: ["pas encore", "encore pas", "jamais pas"], answer: 0, after: " arrivée à la gare.", feedback: "Noch nicht heißt ne … pas encore und umschließt das Hilfsverb." },
      ],
      conclusion: "Ne vor dem Verb, der zweite Teil an seinem Platz, personne hinter dem Partizip, beim Infinitiv ne pas zusammen davor, und de statt un oder des.",
    },
    casework: {
      title: "Ein enttäuschter Bericht",
      story:
        "Léo schreibt im Forum: « Ce camping, c’était nul. Je n’ai rien aimé. Il n’y avait pas de piscine et personne ne parlait anglais. Je n’ai jamais vu de toilettes aussi sales. Je n’y retournerai plus! »",
      steps: [
        {
          question: "Warum steht « pas de piscine »?",
          options: ["Nach einer Verneinung wird une zu de.", "Piscine ist ein Nomen, das nie einen Artikel hat.", "Weil der Satz im imparfait steht."],
          answer: 0,
          explanation: "Nach ne … pas werden un, une, des zu de: il n’y avait pas de piscine.",
        },
        {
          question: "Warum fehlt pas in « personne ne parlait »?",
          options: ["Personne ist Subjekt und ersetzt pas.", "Pas fällt im imparfait immer weg.", "Weil parler ein regelmäßiges Verb ist."],
          answer: 0,
          explanation: "Personne als Subjekt steht vorn, mit ne und ohne pas.",
        },
        {
          question: "Wo steht die Verneinung in « je n’ai jamais vu »?",
          options: ["Ne … jamais umschließt das Hilfsverb ai.", "Jamais steht hinter dem Partizip vu.", "Ne und jamais stehen beide vor ai."],
          answer: 0,
          explanation: "Im passé composé umschließen ne und jamais das Hilfsverb. Nur personne steht hinter dem Partizip.",
        },
      ],
      verdict:
        "Rien, pas de, personne ne, jamais de und plus: Léo nutzt fünf Verneinungen, jede an ihrem Platz und mit de nach der Verneinung.",
    },
    tasks: {
      1: {
        prompt:
          "Verneine mit dem Wort in Klammern: 1. J’ai vu quelqu’un. (personne) 2. Elle mange de la viande. (plus) 3. Nous avons fini. (pas encore) 4. Il faut oublier ton passeport. (ne pas + Infinitiv)",
        hints: ["Personne steht im passé composé hinter dem Partizip.", "Nach der Verneinung wird de la zu de."],
        model:
          "1. Je n’ai vu personne. 2. Elle ne mange plus de viande. 3. Nous n’avons pas encore fini. 4. Il faut ne pas oublier ton passeport. Natürlicher klingt bei 4: Il ne faut pas oublier ton passeport.",
        criteria: ["Alle Verneinungen stehen an der richtigen Stelle.", "De statt de la ist beachtet.", "Bei 4 stehen ne pas vor dem Infinitiv."],
      },
      2: {
        prompt:
          "Schreibe eine kurze Beschwerde-E-Mail (sechs bis acht Sätze) an ein Jugendhotel, in dem nichts geklappt hat. Verwende fünf verschiedene Verneinungen, davon eine mit personne, eine mit rien ne oder personne ne als Subjekt und eine mit ne pas + Infinitiv.",
        hints: ["Bleibe höflich: Madame, Monsieur, … Cordialement.", "Prüfe nach jeder Verneinung den Artikel."],
        model:
          "Madame, Monsieur, nous avons passé trois nuits dans votre auberge et nous sommes très déçus. À notre arrivée, nous n’avons trouvé personne à la réception. Dans la chambre, il n’y avait pas de serviettes et le wifi ne marchait plus. Rien n’était propre dans la salle de bains. Nous n’avons jamais eu de réponse à nos demandes. Nous vous demandons de ne pas ignorer cette lettre et de nous rembourser une nuit. Cordialement, Lena Huber",
        criteria: ["Fünf verschiedene Verneinungen sind richtig verwendet.", "Personne, rien ne oder personne ne und ne pas + Infinitiv kommen vor.", "Die E-Mail ist höflich und klar."],
      },
    },
    practice: {
      kind: "choose",
      title: "Verneinungen: Übungsrunde",
      instruction: "Wähle die richtige Verneinung. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je n’ai ", options: ["pas de", "pas des"], answer: 0, after: " frères.", feedback: "Nach der Verneinung wird des zu de: pas de frères." },
          { before: "Il ne ", options: ["vient jamais", "jamais vient"], answer: 0, after: " le lundi.", feedback: "Ne vor dem Verb, jamais dahinter." },
          { before: "Je n’ai ", options: ["rien", "pas rien"], answer: 0, after: " dit.", feedback: "Rien ersetzt pas und steht vor dem Partizip." },
          { before: "Elle n’a vu ", options: ["personne", "pas personne"], answer: 0, after: " au parc.", feedback: "Personne steht hinter dem Partizip, ohne pas." },
          { before: "Nous ne mangeons ", options: ["plus de", "plus du"], answer: 0, after: " viande.", feedback: "Nach ne … plus wird du zu de: plus de viande." },
          { before: "Aujourd’hui, ", options: ["rien ne", "rien"], answer: 0, after: " marche!", feedback: "Rien als Subjekt braucht ne, aber kein pas." },
          { before: "Ce n’est pas ", options: ["un", "de"], answer: 0, after: " problème.", feedback: "Nach être bleibt der Artikel: ce n’est pas un problème." },
          { before: "Je préfère ", options: ["ne pas", "pas ne"], answer: 0, after: " sortir ce soir.", feedback: "Beim Infinitiv stehen ne pas beide davor." },
        ],
        2: [
          { before: "Pendant tout le voyage en Bretagne, nous n’avons ", options: ["jamais eu", "eu jamais", "pas jamais eu"], answer: 0, after: " de pluie, c’était incroyable.", feedback: "Jamais umschließt mit ne das Hilfsverb: n’avons jamais eu." },
          { before: "Quand nous sommes arrivés à la fête, il n’y avait ", options: ["plus personne", "personne plus", "pas plus personne"], answer: 0, after: ", tout le monde était déjà parti.", feedback: "Nicht mehr niemand: plus personne, ohne pas." },
          { before: "Le médecin m’a conseillé de ", options: ["ne plus manger", "ne manger plus", "manger ne plus"], answer: 0, after: " de sucre le soir avant de dormir.", feedback: "Beim Infinitiv stehen ne plus beide davor." },
          { before: "Mes parents n’ont ", options: ["pas encore", "encore pas", "jamais encore"], answer: 0, after: " décidé où nous allons passer les vacances cet été.", feedback: "Noch nicht: ne … pas encore umschließt das Hilfsverb." },
          { before: "Dans ce petit village, il n’y a ", options: ["pas de", "pas des", "pas une"], answer: 0, after: " cinéma, mais il y a une très belle salle des fêtes.", feedback: "Nach der Verneinung wird un zu de: pas de cinéma." },
          { before: "", options: ["Personne ne", "Personne", "Pas personne"], answer: 0, after: " m’a expliqué comment fonctionne la machine à café dans le bureau.", feedback: "Personne als Subjekt braucht ne, aber kein pas." },
          { before: "Malgré mes efforts, je n’ai ", options: ["trouvé personne", "personne trouvé", "pas trouvé personne"], answer: 0, after: " pour m’aider à porter les cartons.", feedback: "Personne steht hinter dem Partizip und ersetzt pas." },
          { before: "Depuis son accident, mon oncle ", options: ["ne fait plus de", "ne fait plus du", "fait ne plus de"], answer: 0, after: " moto, il a vendu la sienne.", feedback: "Ne … plus umschließt das Verb, danach de statt de la." },
        ],
      },
    },
  },
];
