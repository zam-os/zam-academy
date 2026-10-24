import type { Lesson } from "../model/types";

/**
 * Stufe 4: Frankreich erleben (Lernbereich 2, Interkulturelle Kompetenzen, Kompetenzerwartungen 2.1 bis 2.5,
 * mit den Themengebieten 5.1): Reisen planen, Paris, Schule und Ausbildung, Gespräche über Praktikum und
 * Gastaufenthalt. Aussagen über Frankreich gelten für das, was typisch ist, nicht für jeden Einzelfall.
 */
export const S4: Lesson[] = [
  {
    id: "fr-reisen-planen",
    lb: 4,
    unit: "2",
    covers: ["2.1", "5.1"],
    title: "Reisen innerhalb Frankreichs planen",
    intro:
      "Städte und Regionen, Verkehrsmittel, Unterkünfte und Austausch: So planst du eine Reise und fragst nach dem Weg dorthin.",
    paragraphs: [
      "Frankreich hat Städte mit sehr unterschiedlichem Charakter. **Paris** ist die Hauptstadt, **Lyon** bekannt für gutes Essen, **Marseille** eine Hafenstadt am Mittelmeer, **Strasbourg** liegt im Elsass (l’Alsace) an der Grenze zu Deutschland, **Bordeaux** nahe dem Atlantik, **Lille** im Norden, **Nice** an der Côte d’Azur. Bekannte Regionen sind la Bretagne, la Normandie, la Provence, les Alpes und die Insel la Corse.",
      "Für die Reise brauchst du Wortschatz zu Verkehrsmitteln und Fragen: le TGV (Hochgeschwindigkeitszug), le train, l’avion, le car (Reisebus), le métro. « Je voudrais un aller simple pour Lyon. » (einfache Fahrt) « Je voudrais un aller-retour pour Lyon. » (Hin- und Rückfahrt) « Combien de temps dure le trajet? », « À quelle heure part le train? », « Où est-ce qu’on change? »",
      "Unterkünfte sind l’hôtel, l’auberge de jeunesse (Jugendherberge), le camping, la chambre d’hôtes (Pension). Bei einem **Schüleraustausch** (un échange scolaire) wohnst du in einer Gastfamilie (une famille d’accueil) bei deinem Austauschpartner oder deiner Austauschpartnerin (un correspondant / une correspondante). Das Deutsch-Französische Jugendwerk (DFJW, französisch OFAJ) unterstützt solche Begegnungen und Praktika.",
      "Beim Planen sagst du, was du vorhast: « Nous allons visiter Strasbourg. », « Nous partirons en juillet. » Typische Fehler sind die Verwechslung von aller simple und aller-retour, das Fehlen von s’il vous plaît bei Fragen und das Weglassen des Artikels bei Ländern und Regionen (siehe Lektion zu Ländern). Prüfe auch, ob du Zeit, Ort und Verkehrsmittel genannt hast.",
    ],
    terms: [
      { term: "un aller simple, un aller-retour", text: "Eine einfache Fahrkarte nur für die Hinfahrt und eine Fahrkarte für Hin- und Rückfahrt." },
      { term: "une famille d’accueil", text: "Die Gastfamilie, bei der du während eines Austauschs wohnst. Der Austauschpartner heißt un correspondant oder une correspondante." },
      { term: "l’OFAJ", text: "Das Deutsch-Französische Jugendwerk (DFJW), das Austausch, Praktika und Sprachkurse für junge Menschen fördert." },
    ],
    takeaway:
      "Städte und Regionen kennen, Verkehrsmittel und Fragen (aller simple, aller-retour) beherrschen, Unterkunft und Austausch benennen (hôtel, auberge de jeunesse, famille d’accueil) und höflich nachfragen.",
    sourceIds: ["lp", "francefr", "dfjw"],
    quiz: {
      question: "Wie bittest du um eine Hin- und Rückfahrkarte nach Lyon?",
      answer: "Je voudrais un aller-retour pour Lyon.",
      wrong: ["Je voudrais un aller simple pour Lyon.", "Je voudrais un voyage à Lyon pour retour."],
      explanation:
        "Aller-retour bedeutet Hin- und Rückfahrt. Aller simple wäre nur die Hinfahrt, und die dritte Form ist kein französischer Ausdruck.",
    },
    workshop: {
      kind: "classify",
      title: "Verkehr, Unterkunft oder Austausch?",
      instruction: "Ordne jeden Satz dem Themenfeld zu.",
      categories: ["Verkehr", "Unterkunft", "Austausch"],
      entries: [
        { text: "Le TGV pour Strasbourg part à neuf heures du quai quatre.", target: 0, feedback: "TGV, quai und Abfahrt gehören zum Verkehr." },
        { text: "Nous avons réservé deux nuits dans une auberge de jeunesse.", target: 1, feedback: "Auberge de jeunesse und nuits gehören zur Unterkunft." },
        { text: "Pendant l’échange, je vais habiter dans la famille de mon correspondant.", target: 2, feedback: "Échange, famille und correspondant gehören zum Austausch." },
        { text: "Je voudrais un aller-retour pour Bordeaux, s’il vous plaît.", target: 0, feedback: "Aller-retour ist ein Fahrkartenwunsch, also Verkehr." },
        { text: "La chambre d’hôtes est située près de la plage, avec un petit jardin.", target: 1, feedback: "Chambre d’hôtes ist eine Unterkunft." },
        { text: "Le DFJW organise des échanges entre jeunes Allemands et Français.", target: 2, feedback: "Das DFJW fördert Austausch zwischen Jugendlichen." },
      ],
      conclusion: "Verkehr, Unterkunft und Austausch sind drei Bereiche, die du bei jeder Reiseplanung brauchst.",
    },
    casework: {
      title: "Eine Reise nach Strasbourg",
      story:
        "Du planst mit deiner Klasse eine Fahrt: « Nous partons en juillet pour Strasbourg. Nous prenons le TGV, nous dormons dans une auberge de jeunesse et nous visitons la cathédrale. Au retour, nous passons une journée en Alsace. »",
      steps: [
        {
          question: "Welches Verkehrsmittel nimmt die Klasse?",
          options: ["Den TGV.", "Das Flugzeug.", "Den Reisebus."],
          answer: 0,
          explanation: "Im Text steht « Nous prenons le TGV ».",
        },
        {
          question: "Wo übernachtet die Gruppe?",
          options: ["In einer Jugendherberge.", "In einer Gastfamilie.", "Auf einem Campingplatz."],
          answer: 0,
          explanation: "Auberge de jeunesse heißt Jugendherberge.",
        },
        {
          question: "Wie nennst du die Region, in der Strasbourg liegt?",
          options: ["Das Elsass.", "Die Normandie.", "Die Provence."],
          answer: 0,
          explanation: "Strasbourg liegt im Elsass (l’Alsace) an der Grenze zu Deutschland.",
        },
      ],
      verdict:
        "Die Klassenfahrt verbindet Verkehr, Unterkunft und ein Ziel in einer Region. So planst du eine Reise in Frankreich.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe drei Sätze für eine Reise nach Lyon: Wie fährst du (Verkehrsmittel)? Wo übernachtest du? Was möchtest du besuchen?",
        hints: [
          "Nutze nous allons, nous prenons, nous dormons.",
          "Nenne ein konkretes Ziel in Lyon.",
        ],
        model:
          "Nous prenons le train pour Lyon. Nous dormons dans une auberge de jeunesse près de la gare. Nous allons visiter la vieille ville et nous mangerons dans un petit restaurant. Der Text enthält Verkehrsmittel, Unterkunft und ein Ziel.",
        criteria: [
          "Verkehrsmittel, Unterkunft und ein Ziel werden genannt.",
          "Die Sätze verwenden passende Verbformen.",
          "Die Reise wird verständlich beschrieben.",
        ],
      },
      2: {
        prompt:
          "Plane in sechs bis acht Sätzen eine Reise von drei Tagen durch zwei Städte oder Regionen in Frankreich für dich und zwei Freunde. Nenne Verkehrsmittel, Unterkunft, Ziele und eine Frage am Bahnhof oder an der Rezeption.",
        hints: [
          "Verwende aller + Infinitiv und das futur simple.",
          "Eine Frage könnte « À quelle heure part le train pour Marseille? » sein.",
        ],
        model:
          "Cet été, mes amis et moi, nous allons visiter Paris et la Normandie. Nous prendrons le TGV pour Paris et nous dormirons dans une auberge de jeunesse. Nous allons voir la tour Eiffel et le Louvre. Ensuite, nous partirons en car vers la Normandie. À la gare, je demanderai: À quelle heure part le car pour Rouen? Nous voulons rentrer dimanche soir.",
        criteria: [
          "Zwei Ziele, Verkehrsmittel und Unterkunft werden genannt.",
          "Eine höfliche Frage ist enthalten.",
          "Aller + Infinitiv und das futur simple kommen vor.",
        ],
      },
    },
  },
  {
    id: "fr-paris",
    lb: 4,
    unit: "2",
    covers: ["2.2", "5.1"],
    title: "Paris aus Sicht von Touristen und Einheimischen",
    intro:
      "Paris ist Stadt der Kultur und der Mode, aber auch Großstadt mit Verkehr, Lärm und hohen Mieten. Beide Sichten gehören zusammen.",
    paragraphs: [
      "Für Touristen sind die großen Sehenswürdigkeiten wichtig: **la tour Eiffel** (gebaut für die Weltausstellung 1889), **le Louvre** (heute ein berühmtes Museum, früher ein Königspalast), **Notre-Dame**, **l’Arc de triomphe**, **les Champs-Élysées**, **Montmartre** mit der Kirche du Sacré-Cœur und **la Seine**, auf der Ausflugsschiffe fahren. Touristen sagen: « Nous voulons voir la tour Eiffel et prendre des photos. »",
      "Paris ist auch **Stadt der Mode und Kultur**: Bekannt sind die Modehäuser (la haute couture), die Museen, die Theater und das Kino. Viele Menschen kommen, um ein Museum zu besuchen, Mode zu sehen oder in einem Café zu sitzen. Paris ist in 20 Stadtbezirke (arrondissements) eingeteilt, die nummeriert sind.",
      "Für **Einheimische** sieht das Leben anders aus: Sie fahren mit dem métro oder dem RER zur Arbeit (« Je prends le métro tous les jours. »). Typische **Großstadtprobleme** sind die Verkehrsdichte (la circulation, les embouteillages), der Lärm (le bruit), die Menschenmengen (la foule), die Luftverschmutzung (la pollution) und hohe Mieten (le loyer). Viele Menschen wohnen deshalb am Stadtrand, in der banlieue, und pendeln.",
      "Wenn du über Paris sprichst, kannst du Sichtweisen und Meinungen verbinden: « À mon avis, Paris est beau, mais trop bruyant. » Typische Fehler sind Verallgemeinerungen (« Tous les Parisiens sont stressés ») und die Verwechslung von Touristenangeboten mit dem Alltag. Beschreibe, was du belegen kannst, und frage, welche Sicht jemand einnimmt.",
    ],
    terms: [
      { term: "la banlieue", text: "Die Vororte einer Großstadt. Viele Menschen wohnen dort und pendeln nach Paris, weil das Wohnen im Zentrum teuer ist." },
      { term: "les embouteillages, la pollution", text: "Staus und Luftverschmutzung: typische Großstadtprobleme, die Einheimische im Alltag spüren." },
      { term: "la haute couture", text: "Die Mode der großen Pariser Modehäuser. Sie macht Paris zur Stadt der Mode." },
    ],
    takeaway:
      "Touristen sehen Eiffelturm, Louvre, Seine und Montmartre. Einheimische erleben métro, Verkehr, Lärm, Menschenmengen und hohe Mieten. Beide Sichten gehören zu Paris. Formuliere mit à mon avis und belegbaren Beobachtungen.",
    sourceIds: ["lp", "francefr", "larousse"],
    quiz: {
      question: "Welcher Satz beschreibt ein typisches Großstadtproblem?",
      answer: "Il y a beaucoup de circulation et de bruit.",
      wrong: ["Il y a beaucoup de musées intéressants.", "Il y a une belle vue sur la Seine."],
      explanation:
        "Verkehr und Lärm sind Probleme des Alltags. Museen und der Blick auf die Seine sind eher Vorzüge für Besucher.",
    },
    workshop: {
      kind: "classify",
      title: "Sicht der Touristen oder der Einheimischen?",
      instruction: "Ordne jeden Satz der Person zu, die ihn sagen würde.",
      categories: ["Touristen", "Einheimische"],
      entries: [
        { text: "Nous visitons la tour Eiffel et nous prenons beaucoup de photos.", target: 0, feedback: "Sehenswürdigkeiten und Fotos gehören zum Besuch." },
        { text: "Le loyer est très cher, donc beaucoup de gens habitent loin du centre.", target: 1, feedback: "Mieten und Wohnort betreffen Menschen, die in Paris leben." },
        { text: "Je prends le métro tous les jours pour aller au travail.", target: 1, feedback: "Tägliche Fahrten zur Arbeit gehören zum Alltag." },
        { text: "Nous voulons voir le Louvre et faire un tour en bateau sur la Seine.", target: 0, feedback: "Museum und Bootsfahrt sind typische Wünsche von Besuchern." },
        { text: "Il y a trop de circulation et de bruit dans mon quartier.", target: 1, feedback: "Lärm im eigenen Viertel erlebt, wer dort wohnt." },
        { text: "C’est la première fois que nous venons à Paris pour les vacances.", target: 0, feedback: "Erste Reise und Ferien zeigen die Sicht von Touristen." },
      ],
      conclusion: "Touristen schauen auf Sehenswürdigkeiten, Einheimische auf Wohnen, Arbeiten und Alltag.",
    },
    casework: {
      title: "Ein Tag in Paris",
      story:
        "Eine Austauschschülerin schreibt: « Le matin, nous avons visité le Louvre. L’après-midi, j’ai pris le métro avec mon amie parisienne. Elle m’a dit que le loyer est très cher et que le bruit est un problème. Moi, je trouve la ville magnifique. »",
      steps: [
        {
          question: "Welche Sicht zeigt der Besuch im Louvre?",
          options: ["Die Sicht der Touristen.", "Die Sicht der Einheimischen.", "Die Sicht der Journalisten."],
          answer: 0,
          explanation: "Ein Museumsbesuch gehört zum Programm von Besuchern.",
        },
        {
          question: "Welche Probleme nennt die Freundin?",
          options: ["Hohe Mieten und Lärm.", "Zu viele Museen im Zentrum.", "Zu wenig Verkehr in der Stadt."],
          answer: 0,
          explanation: "Sie nennt le loyer und le bruit, also Probleme einer Großstadt.",
        },
        {
          question: "Was drückt « Moi, je trouve la ville magnifique » aus?",
          options: ["Eine persönliche Meinung.", "Eine Frage.", "Eine Tatsache für alle."],
          answer: 0,
          explanation: "Je trouve leitet eine eigene Meinung ein, nicht eine allgemein gültige Aussage.",
        },
      ],
      verdict:
        "Der Text verbindet Besuch, Alltag und Meinung. Paris wirkt, je nach Sicht, magnifique oder anstrengend.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe vier Sätze: zwei aus der Sicht von Touristen (was sie sehen möchten) und zwei aus der Sicht von Einheimischen (was sie im Alltag stört oder freut).",
        hints: [
          "Nutze nous voulons voir … und je prends … tous les jours.",
          "Nenne zwei verschiedene Sehenswürdigkeiten und zwei Alltagsthemen.",
        ],
        model:
          "Nous voulons voir la tour Eiffel et le Louvre. Nous allons aussi faire une promenade sur la Seine. Je prends le métro tous les jours, mais il y a beaucoup de monde. Le loyer est très cher, donc j’habite dans la banlieue. Die ersten zwei Sätze zeigen die Touristensicht, die zwei letzten die Alltagssicht.",
        criteria: [
          "Zwei Sätze aus der Sicht von Touristen.",
          "Zwei Sätze aus der Sicht von Einheimischen.",
          "Die Sätze sind passend formuliert.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Text von acht bis zehn Sätzen: Paris aus der Sicht einer Touristin und eines Einheimischen. Verwende Sehenswürdigkeiten, Großstadtprobleme, Mode und Kultur, und gib am Ende deine eigene Meinung mit à mon avis oder je trouve que.",
        hints: [
          "Nenne konkrete Orte und konkrete Probleme.",
          "Verwende Konnektoren wie mais, donc, c’est pourquoi.",
        ],
        model:
          "Pour les touristes, Paris est la ville de la mode et de la culture. Ils visitent la tour Eiffel, le Louvre et Montmartre. Les touristes adorent aussi les cafés. Pour les Parisiens, la vie est différente. Ils prennent le métro tous les jours et ils trouvent la ville bruyante. Le loyer est cher, c’est pourquoi beaucoup de gens habitent dans la banlieue. À mon avis, Paris est beau, mais je préfère une ville plus calme.",
        criteria: [
          "Beide Sichtweisen werden beschrieben.",
          "Sehenswürdigkeiten und Großstadtprobleme kommen vor.",
          "Eine eigene Meinung ist mit à mon avis oder je trouve que formuliert.",
        ],
      },
    },
  },
  {
    id: "fr-schule-ausbildung",
    lb: 4,
    unit: "2",
    covers: ["2.3", "5.1"],
    title: "Schule und Ausbildung in Frankreich und Bayern",
    intro:
      "Collège, lycée und baccalauréat gegenüber Mittelschule, Realschule und Gymnasium: Du vergleichst Schulwege und berufliche Möglichkeiten.",
    paragraphs: [
      "In Frankreich besuchen alle Kinder zuerst die **école primaire** (fünf Jahre, etwa von sechs bis elf). Danach folgt für alle das **collège** mit vier Jahren (sixième, cinquième, quatrième, troisième). Am Ende steht das **diplôme national du brevet**. Danach geht es ins **lycée** (drei Jahre: seconde, première, terminale) und endet mit dem **baccalauréat**, kurz le bac. Es gibt allgemeine, technologische und berufliche Wege. Noten werden meist von 0 bis 20 vergeben.",
      "In Bayern wechseln die Kinder nach der Grundschule (vier Jahre) auf **Mittelschule**, **Realschule** oder **Gymnasium**. Die Realschule führt bis Klasse 10 zur **Mittleren Reife**, das Gymnasium zum **Abitur**. Der große Unterschied: In Frankreich lernen alle Jugendlichen bis zur troisième im selben Schultyp, in Bayern verteilen sie sich früher auf verschiedene Schularten.",
      "Das Schulleben unterscheidet sich im Alltag: Viele französische Schulen haben lange Schultage, oft bis in den späten Nachmittag, und eine **cantine**, in der viele Schüler mittags essen. Du kennst Wörter wie un élève, un professeur, un cours, l’emploi du temps (Stundenplan), une note, la récréation, les devoirs. « Mon collège commence à huit heures et finit à cinq heures. »",
      "Für die **berufliche Ausbildung** gibt es in Frankreich das lycée professionnel, das CAP (Berufsabschluss) und den apprentissage (Lehre im Betrieb). In Bayern kennst du die duale Ausbildung und Wege über die Realschule zu Fachoberschule oder Ausbildung. So kannst du Wege gegenüberstellen: « En France, on prépare le bac au lycée. En Bavière, on passe l’Abitur au Gymnasium. » Prüfe, was du über das andere Land sicher weißt, und frage nach.",
    ],
    terms: [
      { term: "le collège, le lycée", text: "Le collège ist die gemeinsame Schule für Elf- bis Fünfzehnjährige, das lycée folgt für drei Jahre bis zum bac." },
      { term: "le baccalauréat", text: "Der Abschluss des lycée, kurz le bac. Er berechtigt in der Regel zum Studium." },
      { term: "l’apprentissage", text: "Die Lehre im Betrieb. Wege in die Ausbildung gibt es auch über das lycée professionnel und das CAP." },
    ],
    takeaway:
      "Frankreich: école primaire, collège (alle gemeinsam bis zur troisième), lycée, bac. Bayern: Grundschule, dann Mittelschule, Realschule oder Gymnasium. Wege in die Ausbildung gibt es in beiden Ländern. Vergleiche mit belegbaren Aussagen.",
    sourceIds: ["lp", "onisep", "dfjw"],
    quiz: {
      question: "Wie heißt die Schule für Elf- bis Fünfzehnjährige in Frankreich?",
      answer: "le collège",
      wrong: ["le lycée", "l’école primaire"],
      explanation:
        "Das collège folgt auf die école primaire und dauert vier Jahre. Danach beginnt das lycée, das zum bac führt.",
    },
    workshop: {
      kind: "classify",
      title: "Frankreich oder Bayern?",
      instruction: "Ordne jeden Satz dem Land zu, auf das er zutrifft.",
      categories: ["Frankreich", "Bayern"],
      entries: [
        { text: "Après le collège, on entre au lycée pour préparer le bac.", target: 0, feedback: "Collège, lycée und bac gehören zum französischen System." },
        { text: "Die Realschule endet in Klasse 10 mit der Mittleren Reife.", target: 1, feedback: "Realschule und Mittlere Reife gehören zum bayerischen System." },
        { text: "Alle Schüler gehen bis zur troisième ins collège.", target: 0, feedback: "In Frankreich besuchen alle das collège bis zur troisième." },
        { text: "Nach der vierten Klasse wechseln die Kinder auf Mittelschule, Realschule oder Gymnasium.", target: 1, feedback: "In Bayern verteilen sich die Kinder nach der Grundschule auf verschiedene Schularten." },
        { text: "On note les devoirs souvent sur vingt.", target: 0, feedback: "In Frankreich arbeitet man oft mit Noten von 0 bis 20." },
        { text: "Am Gymnasium führt der Weg zum Abitur.", target: 1, feedback: "Das Abitur ist der Abschluss am Gymnasium." },
      ],
      conclusion: "Frankreich hat ein gemeinsames collège und das bac, Bayern hat mehrere Schularten und führt zu Mittlerer Reife oder Abitur.",
    },
    casework: {
      title: "Ein Gespräch mit der Austauschschülerin",
      story:
        "Emma aus Lyon erzählt: « Je suis en troisième au collège. L’année prochaine, je vais au lycée et je préparerai le bac. Mes cours finissent à cinq heures et je mange à la cantine. Et toi, tu vas à quelle école? »",
      steps: [
        {
          question: "In welcher Klasse ist Emma?",
          options: ["In der letzten Klasse des collège.", "In der terminale des lycée.", "In der ersten Klasse des collège."],
          answer: 0,
          explanation: "Troisième ist das vierte Jahr am collège, danach folgt das lycée.",
        },
        {
          question: "Was macht Emma im nächsten Jahr?",
          options: ["Sie geht ins lycée.", "Sie macht das bac.", "Sie beginnt eine Lehre."],
          answer: 0,
          explanation: "Nach dem collège kommt das lycée, das bac folgt erst nach drei Jahren.",
        },
        {
          question: "Wie antwortest du auf « Et toi, tu vas à quelle école? »?",
          options: ["Je vais à la Realschule.", "Je vais au lycée à Lyon.", "Je ne vais plus à l’école."],
          answer: 0,
          explanation: "Du nennst deine Schule und erklärst sie, denn Realschule gibt es in Frankreich nicht.",
        },
      ],
      verdict:
        "Emmas Bericht zeigt Collège, Lycée und Ganztag. Beim Vergleich erklärst du deine eigene Schulart, statt sie zu übersetzen.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe drei Sätze, in denen du deine Schule und deinen Tag Emma erklärst: Schulart, Klassenstufe und Uhrzeit.",
        hints: [
          "Erkläre die Realschule mit einem Satz, weil es sie in Frankreich nicht gibt.",
          "Nenne die Uhrzeit von Beginn und Ende.",
        ],
        model:
          "Je vais à la Realschule, une école qui existe en Bavière. Elle va de la classe 5 à la classe 10. Je suis en classe 9. Mes cours commencent à huit heures et finissent à treize heures ou plus tard.",
        criteria: [
          "Die Schulart wird erklärt, nicht nur übersetzt.",
          "Klasse und Uhrzeit werden genannt.",
          "Die Sätze sind korrekt gebildet.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Text von acht bis zehn Sätzen, in dem du das Schulsystem in Frankreich und in Bayern gegenüberstellst: Schularten, Abschlüsse, Tagesablauf und berufliche Wege. Nenne zwei Unterschiede und eine Gemeinsamkeit und gib deine Meinung.",
        hints: [
          "Verwende en France … en Bavière … und Konnektoren wie mais, par contre.",
          "Nenne le bac und le Abitur oder die Mittlere Reife.",
        ],
        model:
          "En France, tous les élèves vont au collège jusqu’à la troisième. En Bavière, les enfants vont après quatre ans à la Mittelschule, à la Realschule ou au Gymnasium. En France, on passe le bac après le lycée. En Bavière, on passe l’Abitur ou la Mittlere Reife. Dans les deux pays, on peut aussi faire un apprentissage. À mon avis, le collège commun est juste, mais je préfère mon école.",
        criteria: [
          "Zwei Unterschiede und eine Gemeinsamkeit werden genannt.",
          "Abschlüsse und berufliche Wege kommen vor.",
          "Eine eigene Meinung ist enthalten.",
        ],
      },
    },
  },
  {
    id: "fr-praktikum-gespraech",
    lb: 4,
    unit: "2",
    covers: ["2.4", "2.5", "5.1"],
    title: "Gespräche über Praktikum, Ferienjob und Gastaufenthalt",
    intro:
      "In Gesprächen mit Gastfamilie, Betrieb und neuen Bekannten verhältst du dich höflich und achtest auf kulturelle Unterschiede.",
    paragraphs: [
      "Im Alltag mit einem Praktikum, einem Ferienjob oder in einer Gastfamilie triffst du Menschen, die du nicht gut kennst. Wichtig sind **Höflichkeit und Anrede**. Bei Erwachsenen und im Betrieb benutzt du vous: « Bonjour, madame. Je m’appelle Anna. Je suis la nouvelle stagiaire. » Fragen stellst du freundlich: « Qu’est-ce que je dois faire? », « Je peux vous aider? », « À quelle heure est la pause? »",
      "**Kulturelle Unterschiede** helfen dir, Missverständnisse zu vermeiden. In Frankreich sagt man beim Betreten eines Geschäfts oder Büros in der Regel zuerst « Bonjour » und schaut die Person an. Freunde und Familie begrüßen sich oft mit **la bise** (Wangenküsse), im formellen Kontext gibt man die Hand. Mahlzeiten haben oft einen festen Rhythmus: Das **déjeuner** (Mittagessen) um die Mittagszeit, das **dîner** (Abendessen) eher später als in vielen deutschen Familien.",
      "In der **Gastfamilie** zeigst du Interesse und Dankbarkeit: « Merci pour votre accueil. », « C’est délicieux! », « Je peux vous aider à mettre la table? » Bei Allergien oder Vorlieben sagst du höflich: « Je suis allergique aux noix. », « Je ne mange pas de viande. » Frage nach Regeln: « À quelle heure est le dîner? », « Est-ce que je peux utiliser le téléphone? »",
      "Typische Fehler sind das unhöfliche tu gegenüber Erwachsenen, das Weglassen von Bonjour und s’il vous plaît und die Annahme, dass alles überall gleich ist. Beobachte, frage nach und passe dich an. Der Wechsel von vous zu tu ist erlaubt, wenn dein Gegenüber es vorschlägt: « On peut se tutoyer? »",
    ],
    terms: [
      { term: "vouvoyer und tutoyer", text: "Bei Erwachsenen und im Betrieb sagst du vous, bei Freunden tu. Den Wechsel schlägt oft die ältere Person vor." },
      { term: "la bise", text: "Die Begrüßung mit Wangenküssen unter Freunden und in der Familie. Im formellen Kontext gibt man eher die Hand." },
      { term: "famille d’accueil", text: "Die Gastfamilie. Mit Merci pour votre accueil zeigst du Dank für die Aufnahme." },
    ],
    takeaway:
      "Sage Bonjour, benutze im Betrieb vous, frage freundlich nach Regeln und danke der Gastfamilie. Beobachte kulturelle Unterschiede wie Begrüßung und Essenszeiten, ohne zu bewerten.",
    sourceIds: ["lp", "dfjw", "francefr"],
    quiz: {
      question: "Wie bedankst du dich bei deiner Gastfamilie?",
      answer: "Merci pour votre accueil.",
      wrong: ["Merci de votre accueillir.", "Merci à votre accueil."],
      explanation:
        "Merci pour + Nomen: pour votre accueil. Mit de und dem Verb oder mit à entsteht kein richtiger Satz.",
    },
    workshop: {
      kind: "choose",
      title: "Höflich und passend formulieren",
      instruction: "Wähle die Form, die in der Situation höflich und richtig ist.",
      items: [
        { before: "En entrant dans une boulangerie, on dit d’abord ", options: ["Bonjour", "Salut", "Hello"], answer: 0, after: " à la vendeuse.", feedback: "In Geschäften begrüßt man zuerst höflich mit Bonjour." },
        { before: "Dans un entretien avec la directrice, on dit ", options: ["vous", "tu", "on"], answer: 0, after: " à la directrice.", feedback: "Gegenüber Erwachsenen im Betrieb sagt man vous." },
        { before: "Dans ma famille d’accueil, je demande: À quelle heure est ", options: ["le dîner", "la dîner", "dîner le"], answer: 0, after: ", s’il vous plaît?", feedback: "Le dîner ist männlich. Mit s’il vous plaît bleibt die Frage höflich." },
        { before: "Pour remercier ma famille d’accueil, je dis: Merci ", options: ["pour votre accueil", "de votre accueillir", "à votre accueil"], answer: 0, after: " !", feedback: "Merci pour + Nomen ist die richtige Form." },
        { before: "Si je suis allergique aux noix, je dis: Je suis ", options: ["allergique", "allergie", "allergisé"], answer: 0, after: " aux noix.", feedback: "Allergique ist das Adjektiv: je suis allergique à/aux …" },
      ],
      conclusion: "Bonjour, vous im Betrieb, Merci pour votre accueil und höfliche Fragen: So wirkst du freundlich und aufmerksam.",
    },
    casework: {
      title: "Der erste Abend in der Gastfamilie",
      story:
        "Du kommst in deiner Gastfamilie an. Die Gastmutter sagt: « Bienvenue! Le dîner est à vingt heures. Tu aimes le poisson? » Du antwortest: « Merci pour votre accueil. Je suis allergique aux noix, mais le poisson, c’est parfait. Je peux vous aider? »",
      steps: [
        {
          question: "Welchen Satz sagst du zur Begrüßung?",
          options: ["Bonjour, madame, merci.", "Salut, ça va, toi aussi?", "Hallo, wo ist das Zimmer hier?"],
          answer: 0,
          explanation: "Bonjour und Merci pour votre accueil sind bei der Gastmutter höflich und passend.",
        },
        {
          question: "Warum sagst du « Je suis allergique aux noix »?",
          options: ["Ich nenne eine Allergie früh.", "Ich lehne das Essen grundsätzlich ab.", "Ich möchte heute Abend nichts essen."],
          answer: 0,
          explanation: "Eine Allergie nennst du frühzeitig, damit die Familie darauf achten kann.",
        },
        {
          question: "Was bietest du an?",
          options: ["Meine Hilfe.", "Mein Geld.", "Mein Zimmer."],
          answer: 0,
          explanation: "« Je peux vous aider? » zeigt Interesse und Hilfsbereitschaft.",
        },
      ],
      verdict:
        "Höflich begrüßen, Dank sagen, eine Allergie erwähnen und Hilfe anbieten: So gelingt der erste Abend in der Gastfamilie.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe einen kurzen Dialog (vier Zeilen): Du kommst in einer Gastfamilie an, begrüßt die Gastmutter, bedankst dich und fragst nach der Uhrzeit des Abendessens.",
        hints: [
          "Nutze Bonjour, Merci pour votre accueil, À quelle heure est le dîner?",
          "Verwende vous gegenüber der Gastmutter.",
        ],
        model:
          "– Bonjour, madame, je m’appelle Anna. Merci pour votre accueil. – Bienvenue, Anna! – À quelle heure est le dîner, s’il vous plaît? – À vingt heures, tu as le temps de défaire ta valise. Der Dialog enthält Begrüßung, Dank und eine höfliche Frage.",
        criteria: [
          "Begrüßung und Dank kommen vor.",
          "Die Frage nach dem Abendessen ist höflich.",
          "Vous wird gegenüber der Gastmutter verwendet.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Dialog von acht bis zehn Zeilen: Du beginnst ein Praktikum in einer französischen Firma, stellst dich vor, fragst nach Aufgaben und Pausen und sprichst mit einer Kollegin über Unterschiede zwischen Deutschland und Frankreich (zum Beispiel Mittagessen oder Begrüßung).",
        hints: [
          "Verwende vous mit dem Chef und tu oder vous mit der Kollegin, je nachdem, was sie vorschlägt.",
          "Nenne einen kulturellen Unterschied, ohne zu werten.",
        ],
        model:
          "– Bonjour, monsieur, je suis Anna, la nouvelle stagiaire. – Bonjour, Anna! Bienvenue. – Qu’est-ce que je dois faire aujourd’hui? – Vous allez aider Marie au bureau. – Bonjour Marie, je peux vous aider? – On peut se tutoyer. – Merci. En Allemagne, on déjeune plus tôt, non? – Oui, ici, on déjeune souvent vers treize heures. C’est intéressant!",
        criteria: [
          "Vorstellung, Fragen nach Aufgaben und ein Unterschied kommen vor.",
          "Vous und tu werden situationsgerecht verwendet.",
          "Der Dialog bleibt höflich und wertet nicht.",
        ],
      },
    },
  },
];
