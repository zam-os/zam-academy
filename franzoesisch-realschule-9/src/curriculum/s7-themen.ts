import type { Lesson } from "../model/types";

/**
 * Stufe 7: Themengebiete (Lernbereich 5, Kompetenzerwartungen 5.1 und 5.2): Freundschaft, Medien,
 * Nachbarländer Frankreichs und aktuelle Themen. Schule, Berufsleben, Unterwegs in Frankreich und
 * Paris stehen in Stufe 4. Aktuelle Themen bleiben eine Recherche- und Unterrichtsaufgabe: Die App enthält
 * keine tagesaktuellen Meldungen und übt an einem erfundenen Beispiel.
 */
export const S7: Lesson[] = [
  {
    id: "fr-freundschaft",
    lb: 7,
    unit: "5",
    covers: ["5.1"],
    title: "Freundschaft",
    intro:
      "Du sprichst über Freunde, Streit und Vertrauen und bittest oder gibst Rat. Dazu gehören feste Verben mit ihren Präpositionen.",
    paragraphs: [
      "Für Jugendliche hat Freundschaft einen hohen Stellenwert. Wichtige Wörter sind **un ami / une amie**, **un copain / une copine**, **un meilleur ami / une meilleure amie**, **la confiance** (Vertrauen), **un secret**, **une dispute** (Streit). « Mon meilleur ami est toujours là pour moi. » « On peut compter sur lui. » Beachte: Un copain ist umgangssprachlich und kann auch „Freund“ im Sinne von Partner bedeuten, un ami ist neutraler.",
      "Viele Verben haben feste Präpositionen: **s’entendre bien avec** (sich gut verstehen mit), **se disputer avec** (sich streiten mit), **se réconcilier avec** (sich versöhnen mit), **faire confiance à** (jemandem vertrauen), **compter sur** (sich auf jemanden verlassen), **parler de** (sprechen über), **penser à** (an jemanden denken). « Je m’entends bien avec ma voisine. », « Je lui fais confiance. », « On se dispute rarement. »",
      "Wenn du jemandem **Rat** geben oder um Rat bitten willst, helfen diese Wendungen: « Il vaut mieux parler avec elle. » (es ist besser), « Qu’est-ce que tu en penses? », « Je te conseille de + Infinitiv. », « Tu dois lui dire la vérité. » Bei Streit nutzt du Ich-Botschaften: « Je suis triste quand tu ne réponds pas. » statt Vorwürfen. Mit si-Sätzen machst du Vorschläge: « Si tu veux, on peut en parler. »",
      "Typische Fehler sind falsche Präpositionen (« compter à » statt compter sur, « se disputer de » statt avec) und das Verwechseln von « un ami » mit « un petit ami » (fester Freund). Prüfe das Verb mit seiner Präposition und spreche in Ich-Form, wenn du ein Gefühl benennst.",
    ],
    terms: [
      { term: "la confiance", text: "Das Vertrauen. Man sagt faire confiance à quelqu’un: Je lui fais confiance." },
      { term: "compter sur, s’entendre avec", text: "Feste Verbverbindungen: sich auf jemanden verlassen (compter sur) und sich gut verstehen mit (s’entendre bien avec)." },
      { term: "Je te conseille de …", text: "Eine Wendung, mit der du Rat gibst: Ich rate dir, … zu. Dazu gehören auch il vaut mieux + Infinitiv und tu dois." },
    ],
    takeaway:
      "Freundschaft: ami, copain, confiance, secret, dispute. Feste Verben: s’entendre avec, se disputer avec, se réconcilier avec, faire confiance à, compter sur. Rat geben mit je te conseille de, il vaut mieux, tu dois. Formuliere Gefühle in Ich-Botschaften.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Wie sagst du: „Ich kann mich auf meine Freundin verlassen“?",
      answer: "Je peux compter sur mon amie.",
      wrong: ["Je peux compter à mon amie.", "Je peux compter de mon amie."],
      explanation:
        "Compter sur + Person bedeutet sich verlassen auf. Mit à oder de entsteht eine andere oder gar keine Bedeutung.",
    },
    workshop: {
      kind: "choose",
      title: "Verben mit Präpositionen",
      instruction: "Wähle die Präposition, die zum Verb gehört.",
      items: [
        { before: "Je m’entends bien ", options: ["avec", "à", "de"], answer: 0, after: " ma meilleure amie depuis l’école primaire.", feedback: "S’entendre bien verlangt avec." },
        { before: "Nous nous disputons rarement ", options: ["avec", "à", "sur"], answer: 0, after: " nos amis, mais parfois ça arrive.", feedback: "Se disputer verlangt die Präposition avec, nicht de." },
        { before: "Je fais confiance ", options: ["à", "de", "avec"], answer: 0, after: " mon meilleur ami, il garde mes secrets.", feedback: "Faire confiance verlangt à vor der Person, der man vertraut." },
        { before: "On peut toujours compter ", options: ["sur", "à", "de"], answer: 0, after: " lui quand on a un problème.", feedback: "Compter verlangt sur: sich auf jemanden verlassen heißt compter sur." },
        { before: "Après la dispute, ils se sont réconciliés ", options: ["avec", "à", "de"], answer: 0, after: " leurs amis très vite.", feedback: "Se réconcilier verlangt avec: sich mit jemandem versöhnen." },
      ],
      conclusion: "Zu Freundschaftsverben gehört jeweils eine feste Präposition: avec, à oder sur.",
    },
    casework: {
      title: "Ein Streit unter Freundinnen",
      story:
        "Léa schreibt: « Je me suis disputée avec ma meilleure amie. Elle ne répond plus à mes messages. Il vaut mieux lui parler. – Je ne sais pas. Qu’est-ce que tu en penses? – Je te conseille de lui écrire une carte. Si tu veux, on peut en parler ensemble. »",
      steps: [
        {
          question: "Welche Präposition steht nach « se disputer »?",
          options: ["avec (se disputer avec)", "de (se disputer de)", "sur (se disputer sur)"],
          answer: 0,
          explanation: "Se disputer verlangt avec: Je me suis disputée avec ma meilleure amie.",
        },
        {
          question: "Was ist « Il vaut mieux lui parler »?",
          options: ["Eine Wendung zum Ratgeben.", "Eine Ortsangabe in der Stadt.", "Eine Frage nach dem Weg."],
          answer: 0,
          explanation: "Il vaut mieux + Infinitiv leitet einen Rat ein: Es ist besser, …",
        },
        {
          question: "Wie bietet die Freundin Hilfe an?",
          options: ["Si tu veux, on peut en parler.", "Je ne veux plus rien dire du tout.", "Tu dois te taire maintenant."],
          answer: 0,
          explanation: "Mit si tu veux machst du ein freundliches Angebot.",
        },
      ],
      verdict:
        "Der Austausch zeigt feste Verben mit Präpositionen, eine Bitte um Rat und ein freundliches Angebot. So sprichst du über Freundschaft.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe vier Sätze über deine beste Freundin oder deinen besten Freund. Verwende s’entendre avec, faire confiance à, compter sur und eine Wendung zum Ratgeben.",
        hints: [
          "Beginne mit « Mon meilleur ami … ».",
          "Nutze die Präpositionen avec, à und sur.",
        ],
        model:
          "Je m’entends très bien avec mon meilleur ami, il s’appelle Lukas. Je lui fais confiance parce qu’il garde mes secrets. Je peux toujours compter sur lui quand j’ai un problème. Il vaut mieux lui dire merci plus souvent. Die Sätze nennen Verbindungen mit avec, à und sur sowie eine Rat-Wendung.",
        criteria: [
          "Mindestens drei Verben mit ihren Präpositionen sind richtig verwendet.",
          "Eine Wendung zum Ratgeben kommt vor.",
          "Der Text beschreibt die Freundschaft verständlich.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Dialog von acht bis zehn Zeilen zwischen zwei Freunden, von denen einer Streit mit einem Dritten hat. Der andere gibt Rat, der erste äußert Gefühle in Ich-Botschaften und beide einigen sich auf einen Plan.",
        hints: [
          "Nutze Il vaut mieux, Tu dois, Je te conseille de.",
          "Ich-Botschaften: « Je suis triste quand … ».",
        ],
        model:
          "– Je me suis disputé avec Paul. Je suis triste quand il ne répond pas. – Il vaut mieux lui écrire un message. – Tu penses que je dois m’excuser? – Je te conseille de lui dire que tu regrettes. – Et si je lui propose de faire du sport ensemble? – Bonne idée! Tu dois l’appeler demain. – D’accord, je vais essayer. Merci, je peux toujours compter sur toi.",
        criteria: [
          "Rat, Ich-Botschaft und Einigung kommen vor.",
          "Verben mit Präpositionen sind richtig verwendet.",
          "Der Dialog ist freundlich und logisch aufgebaut.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Freundschaft: Übungsrunde",
      instruction: "Wähle für jede Lücke die richtige Präposition oder Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je m’entends bien ", options: ["avec", "à"], answer: 0, after: " ma voisine depuis longtemps.", feedback: "S’entendre bien verlangt avec." },
          { before: "Tu peux compter ", options: ["sur", "à"], answer: 0, after: " moi quand tu as un problème.", feedback: "Compter verlangt sur: sich auf jemanden verlassen heißt compter sur." },
          { before: "Je fais confiance ", options: ["à", "sur"], answer: 0, after: " mon meilleur ami.", feedback: "Faire confiance verlangt à vor der Person, der man vertraut." },
          { before: "Elle se dispute souvent ", options: ["avec", "de"], answer: 0, after: " son frère le soir.", feedback: "Se disputer verlangt die Präposition avec, nicht de." },
          { before: "Nous parlons ", options: ["de", "à"], answer: 0, after: " nos amis après l’école.", feedback: "Parler de heißt sprechen über." },
          { before: "Ils se sont réconciliés ", options: ["avec", "de"], answer: 0, after: " leurs amis hier soir.", feedback: "Se réconcilier verlangt avec: sich mit jemandem versöhnen." },
          { before: "Il pense ", options: ["à", "de"], answer: 0, after: " sa meilleure amie tous les jours.", feedback: "Penser à heißt an jemanden denken." },
          { before: "On peut toujours compter ", options: ["sur", "avec"], answer: 0, after: " un vrai ami.", feedback: "Compter verlangt sur: sich auf jemanden verlassen heißt compter sur." },
        ],
        2: [
          { before: "Quand j’ai un problème à l’école, je peux toujours compter ", options: ["sur", "à", "de"], answer: 0, after: " ma meilleure amie, car elle m’écoute sans jamais me juger.", feedback: "Compter sur bedeutet sich verlassen auf." },
          { before: "Léa et Marie se sont disputées, mais elles se sont réconciliées ", options: ["avec", "à", "sur"], answer: 0, after: " leurs amis quelques jours plus tard autour d’une pizza.", feedback: "Se réconcilier verlangt avec: sich mit jemandem versöhnen." },
          { before: "Il vaut mieux lui ", options: ["parler", "parlons", "parlé"], answer: 0, after: " demain matin pour savoir pourquoi il est fâché contre toi.", feedback: "Nach il vaut mieux folgt der Infinitiv ohne Präposition." },
          { before: "Mon frère ne ", options: ["fait pas confiance", "fait confiance pas", "ne fait confiance"], answer: 0, after: " à ses camarades, car ils racontent tout aux autres élèves.", feedback: "Faire confiance wird mit ne … pas umschlossen." },
          { before: "Je te conseille ", options: ["de lui écrire", "à lui écrire", "lui écrire de"], answer: 0, after: " un message pour t’excuser, car il attend peut-être ta réponse.", feedback: "Conseiller de + Infinitiv ist die feste Form." },
          { before: "Quand tu es triste, tu peux ", options: ["en parler", "parler en", "y parler"], answer: 0, after: " avec tes amis ou avec tes parents, ça aide souvent beaucoup.", feedback: "En ersetzt de + Nomen: parler de ses soucis, also en parler." },
          { before: "Nous nous entendons très bien et nous ", options: ["nous disputons rarement", "disputons rarement nous", "se disputons rarement"], answer: 0, after: " parce que nous parlons calmement des problèmes quand ils arrivent.", feedback: "Das Reflexivpronomen steht vor dem Verb und passt zu nous." },
          { before: "Si tu veux, ", options: ["on peut en parler", "on peut y parler", "on peut parler en"], answer: 0, after: " demain après les cours, avant d’aller au cinéma avec les autres.", feedback: "Si + Präsens, on peut: ein Vorschlag, en ersetzt de ça." },
        ],
      },
    },
  },
  {
    id: "fr-medien-diskussion",
    lb: 7,
    unit: "5",
    covers: ["5.1"],
    title: "Medien: Vorteile, Nachteile und Regeln",
    intro:
      "Internet, Fernsehen, Radio, Bücher und Filme haben Vorteile und Nachteile. Du wägst ab und sprichst über Regeln.",
    paragraphs: [
      "Zum Thema Medien gehören **Internet**, **la télévision**, **la radio**, **les livres**, **les films**, **les jeux vidéo** und **les réseaux sociaux**. Du sprichst über Nutzung: « Je regarde une série tous les soirs. », « Je lis un livre par mois. », « Je passe deux heures par jour sur mon portable. » Hilfreiche Wörter sind **la durée** (Dauer), **souvent**, **parfois**, **rarement**, **ne … jamais**.",
      "Beim **Abwägen** nennst du Vorteile und Nachteile: **les avantages** und **les inconvénients**. Typische Vorteile: Information, Kontakt zu Freunden, Unterhaltung, Lernen. Typische Nachteile: zu viel Zeit, Ablenkung, Falschmeldungen, Datenschutz, weniger Schlaf. Für das Gegenüberstellen helfen **d’un côté … de l’autre côté** (einerseits … andererseits), **mais**, **pourtant**, **en revanche** (dagegen).",
      "**Regeln** formulierst du mit il faut + Infinitiv, il vaut mieux + Infinitiv und on doit: « Il faut limiter le temps d’écran. », « Il vaut mieux éteindre le portable le soir. » In Diskussionen begründest du mit parce que oder car, stimmst zu (« Je suis d’accord ») oder widersprichst (« Je ne suis pas d’accord, car … »).",
      "Typische Fehler sind einseitige Aussagen (« Les réseaux sociaux sont mauvais ») ohne Begründung, fehlende Konnektoren und Wörter aus dem Englischen ohne französisches Pendant (« le smartphone » ist üblich, aber « l’appli » statt « l’app »). Eine gute Diskussion nennt immer beide Seiten und endet mit einer begründeten Meinung.",
    ],
    terms: [
      { term: "les avantages, les inconvénients", text: "Die Vorteile und Nachteile. Mit ihnen wägst du ein Thema ab, bevor du eine Meinung äußerst." },
      { term: "d’un côté … de l’autre côté", text: "Einerseits … andererseits: Eine Wendung, mit der du zwei Seiten gegenüberstellst." },
      { term: "il faut, il vaut mieux + Infinitiv", text: "Wendungen für Regeln und Ratschläge: Il faut limiter le temps d’écran. Il vaut mieux éteindre le portable le soir." },
    ],
    takeaway:
      "Nenne Nutzung und Dauer, wäge Vorteile und Nachteile ab (d’un côté … de l’autre côté), formuliere Regeln mit il faut oder il vaut mieux und gib am Ende eine begründete Meinung.",
    sourceIds: ["lp", "lepointdufle", "francefr"],
    quiz: {
      question: "Wie leitest du die zweite Seite eines Vergleichs ein?",
      answer: "En revanche, …",
      wrong: ["Premièrement, …", "En résumé, …"],
      explanation:
        "En revanche heißt „dagegen“ und leitet die Gegenseite ein. Premièrement leitet eine Aufzählung ein, en résumé einen Schluss.",
    },
    workshop: {
      kind: "classify",
      title: "Vorteil oder Nachteil?",
      instruction: "Ordne jeden Satz einem Vorteil oder einem Nachteil von Medien zu.",
      categories: ["Vorteil", "Nachteil"],
      entries: [
        { text: "Grâce à Internet, on peut trouver des informations très rapidement.", target: 0, feedback: "Schneller Zugang zu Informationen ist ein Vorteil." },
        { text: "Beaucoup de jeunes passent trop de temps devant leur écran le soir.", target: 1, feedback: "Zu viel Bildschirmzeit ist ein Nachteil." },
        { text: "On peut rester en contact avec ses amis qui habitent loin.", target: 0, feedback: "Kontakt über Distanz ist ein Vorteil." },
        { text: "Sur les réseaux sociaux, il y a parfois de fausses informations.", target: 1, feedback: "Falschmeldungen sind ein Nachteil." },
        { text: "Un bon film ou un livre permet de se détendre après l’école.", target: 0, feedback: "Entspannung ist ein Vorteil." },
        { text: "Le téléphone portable dérange parfois pendant les cours ou le sommeil.", target: 1, feedback: "Ablenkung und weniger Schlaf sind Nachteile." },
      ],
      conclusion: "Medien haben beide Seiten. Eine gute Diskussion nennt Vorteile und Nachteile.",
    },
    casework: {
      title: "Eine Diskussion in der Klasse",
      story:
        "Im Unterricht diskutiert ihr: « D’un côté, Internet aide à faire les devoirs. De l’autre côté, beaucoup d’élèves passent trop de temps sur leur portable. Il vaut mieux limiter l’usage le soir. »",
      steps: [
        {
          question: "Was ist die erste Seite im Text?",
          options: ["Ein Vorteil von Internet.", "Ein Nachteil von Internet.", "Eine Regel."],
          answer: 0,
          explanation: "Internet hilft bei den Hausaufgaben: Das ist ein Vorteil.",
        },
        {
          question: "Was drückt « De l’autre côté » aus?",
          options: ["Die zweite, entgegengesetzte Seite.", "Den Schluss der ganzen Diskussion.", "Eine Zustimmung zum Vorredner."],
          answer: 0,
          explanation: "De l’autre côté führt die Gegenseite ein.",
        },
        {
          question: "Welche Funktion hat « Il vaut mieux limiter l’usage le soir »?",
          options: ["Eine Regel oder ein Rat.", "Eine Frage an die Klasse.", "Eine Beschreibung des Bildes."],
          answer: 0,
          explanation: "Il vaut mieux + Infinitiv gibt einen Rat oder eine Regel.",
        },
      ],
      verdict:
        "Die Diskussion folgt dem Muster Vorteil, Nachteil, Regel. So wägst du ab und kommst zu einem Ergebnis.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe vier Sätze: einen Vorteil, einen Nachteil, eine Regel und deine Meinung zum Thema Smartphones in der Schule.",
        hints: [
          "Nutze d’un côté, de l’autre côté.",
          "Für die Regel: Il faut … oder Il vaut mieux …",
        ],
        model:
          "D’un côté, le smartphone aide à chercher des informations rapidement. De l’autre côté, il peut distraire les élèves pendant les cours. Il faut éteindre le portable pendant les leçons. À mon avis, c’est une bonne règle, parce que tout le monde peut mieux se concentrer.",
        criteria: [
          "Vorteil, Nachteil, Regel und Meinung kommen vor.",
          "D’un côté und de l’autre côté werden richtig verwendet.",
          "Die Meinung ist begründet.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen zusammenhängenden Text von acht bis zehn Sätzen über deine Mediennutzung und Regeln dazu. Verwende Nutzung mit Dauer, zwei Vorteile, zwei Nachteile, eine Regel mit il faut oder il vaut mieux und eine begründete Meinung mit parce que.",
        hints: [
          "Beginne mit « Je passe … par jour sur … ».",
          "Beende mit « À mon avis, … parce que … ».",
        ],
        model:
          "Je passe deux heures par jour sur mon portable, surtout pour parler avec mes amis. D’un côté, c’est pratique pour rester en contact. De l’autre côté, je dors moins quand je regarde trop de vidéos le soir. Un autre avantage, c’est que je trouve vite des informations pour l’école. En revanche, il y a aussi de fausses nouvelles. Il faut vérifier les sources. Il vaut mieux éteindre le portable à vingt-deux heures. À mon avis, une règle simple est utile parce que tout le monde dort mieux.",
        criteria: [
          "Nutzung, zwei Vorteile und zwei Nachteile werden genannt.",
          "Eine Regel mit il faut oder il vaut mieux ist enthalten.",
          "Die Meinung am Schluss ist mit parce que begründet.",
        ],
      },
    },
  },
  {
    id: "fr-nachbarlaender",
    lb: 7,
    unit: "5",
    covers: ["5.1", "5.2"],
    title: "Nachbarländer Frankreichs: Belgien und mehr",
    intro:
      "Belgien, Luxemburg und die Schweiz sprechen auch Französisch. Du erfährst, wo und wie, und vergleichst Sprachen und Kulturen.",
    paragraphs: [
      "Frankreich grenzt an **la Belgique**, **le Luxembourg**, **l’Allemagne**, **la Suisse**, **l’Italie**, **l’Espagne**, **Monaco** und **Andorre**. In **Belgien** (Hauptstadt **Bruxelles**) spricht man Französisch, Niederländisch und in einem kleinen Gebiet Deutsch. In Brüssel haben wichtige Institutionen der Europäischen Union ihren Sitz. Beliebt sind **les frites** (Pommes frites), **les gaufres** (Waffeln) und **le chocolat**.",
      "Die belgische Comic-Tradition ist weltbekannt: **Tintin** (von Hergé) und **les Schtroumpfs** (von Peyo) sind **bandes dessinées** aus Belgien. Das **Luxembourg** hat drei Amtssprachen: luxembourgeois, français und allemand. In der **Schweiz** (la Suisse) gibt es vier Landessprachen: Deutsch, Französisch, Italienisch und Rätoromanisch. Französisch spricht man vor allem in der Westschweiz (la Romandie) mit Städten wie Genève und Lausanne.",
      "Wenn du über ein Land sprichst, nutzt du die Artikel mit Ländern (en Belgique, au Luxembourg, en Suisse, aux Pays-Bas) und die Adjektive der Nationalität (belge, luxembourgeois, suisse), die klein geschrieben werden, solange es Adjektive sind: « un chocolat belge ». Für **Sprachen** gilt: Sie werden klein geschrieben (le français, le néerlandais).",
      "Beim **Vergleichen von Sprachen und Kulturen** sprichst du über Gemeinsames und Unterschiedliches: « En Belgique, on parle français, mais pas comme en France. » Typische Fehler sind Verallgemeinerungen (« Tous les Belges parlent français ») und die Verwechslung von Land und Sprache. Prüfe deine Aussagen an verlässlichen Quellen.",
    ],
    terms: [
      { term: "la Belgique", text: "Das Nachbarland im Norden Frankreichs. Hauptstadt ist Bruxelles, Sprachen sind Französisch, Niederländisch und regional Deutsch." },
      { term: "la Romandie", text: "Die französischsprachige Westschweiz mit Städten wie Genève und Lausanne." },
      { term: "les Schtroumpfs, Tintin", text: "Zwei berühmte belgische Comicreihen: die Schlümpfe von Peyo und Tim und Struppi von Hergé." },
    ],
    takeaway:
      "Frankreichs Nachbarn: Belgien, Luxemburg, Deutschland, Schweiz, Italien, Spanien, Monaco, Andorra. Französisch spricht man in Belgien, Luxemburg und der Westschweiz. Belgien ist bekannt für frites, gaufres, chocolat und BDs wie Tintin.",
    sourceIds: ["lp", "belgium", "francefr"],
    quiz: {
      question: "Wie heißt die Hauptstadt Belgiens?",
      answer: "Bruxelles",
      wrong: ["Anvers (Antwerpen)", "Liège (Lüttich)"],
      explanation:
        "Bruxelles (Brüssel) ist die Hauptstadt Belgiens. Anvers (Antwerpen) und Liège (Lüttich) sind andere belgische Städte.",
    },
    workshop: {
      kind: "choose",
      title: "Nachbarländer erkennen",
      instruction: "Wähle die richtige Antwort zu den Nachbarländern Frankreichs.",
      items: [
        { before: "La capitale de la Belgique s’appelle ", options: ["Bruxelles", "Anvers", "Liège"], answer: 0, after: ", une ville avec beaucoup d’institutions européennes.", feedback: "Bruxelles ist die Hauptstadt Belgiens." },
        { before: "Au Luxembourg, on parle luxembourgeois, français et ", options: ["allemand", "italien", "néerlandais"], answer: 0, after: " dans la vie de tous les jours.", feedback: "Luxemburg hat drei Amtssprachen: luxembourgeois, français und allemand." },
        { before: "Tintin et les Schtroumpfs sont des héros de bandes dessinées ", options: ["belges", "suisses", "luxembourgeois"], answer: 0, after: " très connus dans le monde.", feedback: "Beide Comicreihen stammen aus Belgien." },
        { before: "En Suisse, on parle français surtout à ", options: ["Genève", "Zurich", "Bâle"], answer: 0, after: " et dans la région de la Romandie.", feedback: "Genève liegt in der französischsprachigen Westschweiz." },
        { before: "Le pays au sud-est de la France, célèbre pour la pizza, est ", options: ["l’Italie", "l’Espagne", "la Belgique"], answer: 0, after: " avec la ville de Rome comme capitale.", feedback: "Italien grenzt im Südosten an Frankreich." },
      ],
      conclusion: "Belgien, Luxemburg und die Schweiz sind Nachbarländer, in denen Französisch eine Rolle spielt.",
    },
    casework: {
      title: "Ein Ausflug nach Brüssel",
      story:
        "Eine Klasse reist nach Brüssel. Die Lehrerin sagt: « À Bruxelles, on parle français et néerlandais. Nous allons manger des frites et des gaufres, et visiter le musée de la bande dessinée. Demain, nous mangerons du chocolat belge. »",
      steps: [
        {
          question: "Welche Sprachen spricht man in Brüssel laut Lehrerin?",
          options: ["Französisch und Niederländisch.", "Nur Französisch in allen Stadtteilen.", "Nur Deutsch und Englisch zusammen."],
          answer: 0,
          explanation: "In Brüssel spricht man Französisch und Niederländisch.",
        },
        {
          question: "Was ist ein Beispiel für belgische Küche im Text?",
          options: ["Frites und Waffeln.", "Pizza und Pasta.", "Crêpes und Cidre."],
          answer: 0,
          explanation: "Frites und gaufres sind typisch belgisch, Pizza gehört zu Italien, Crêpes und Cidre zur Bretagne.",
        },
        {
          question: "Warum steht « belge » klein und mit -e?",
          options: ["Als Adjektiv schreibt man es klein.", "Länder-Adjektive schreibt man immer groß.", "Nach chocolat steht immer ein Großbuchstabe."],
          answer: 0,
          explanation: "Als Adjektiv wird belge klein geschrieben und steht hier bei chocolat. Belge endet im Singular auf -e für beide Geschlechter.",
        },
      ],
      verdict:
        "Der Ausflug verbindet Sprache, Essen und Kultur. Die Sprache gehört dazu, aber nicht jede Aussage gilt für das ganze Land.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe vier Sätze über ein Nachbarland Frankreichs deiner Wahl (Belgien, Luxemburg oder die Schweiz): Sprachen, eine Stadt, eine Besonderheit.",
        hints: [
          "Nutze en, au und aux richtig.",
          "Nenne mindestens eine Sprache klein geschrieben.",
        ],
        model:
          "En Belgique, on parle français, néerlandais et un peu allemand. La capitale s’appelle Bruxelles. On y mange des frites et des gaufres. Tintin est un héros de bande dessinée belge. Der Text nennt Sprachen, eine Stadt und eine Besonderheit.",
        criteria: [
          "Sprachen, Stadt und Besonderheit werden genannt.",
          "Länderartikel sind richtig verwendet.",
          "Sprachen und Adjektive stehen kleingeschrieben.",
        ],
      },
      2: {
        prompt:
          "Vergleiche in acht bis zehn Sätzen Belgien mit Deutschland: Sprachen, Hauptstadt, ein Gericht, ein kulturelles Beispiel. Nenne Gemeinsamkeiten und Unterschiede und gib eine Meinung, welches Land du gern besuchen möchtest.",
        hints: [
          "Verwende en Allemagne, en Belgique, aussi, mais, par contre.",
          "Gib eine Begründung mit parce que.",
        ],
        model:
          "En Allemagne, on parle allemand. En Belgique, on parle français, néerlandais et un peu allemand. La capitale de l’Allemagne est Berlin, la capitale de la Belgique est Bruxelles. Dans les deux pays, il y a de la bière et des spécialités locales. En Belgique, on mange des frites et des gaufres. Par contre, en Allemagne, on mange souvent des saucisses. Tintin est belge, et les frères Grimm sont allemands. J’aimerais visiter la Belgique parce que j’adore les bandes dessinées et les gaufres.",
        criteria: [
          "Gemeinsamkeiten und Unterschiede werden genannt.",
          "Sprachen, Hauptstädte und kulturelle Beispiele sind richtig.",
          "Eine begründete Meinung steht am Ende.",
        ],
      },
    },
  },
  {
    id: "fr-aktuelle-themen",
    lb: 7,
    unit: "5",
    covers: ["5.1", "5.2"],
    title: "Aktuelle Themen: Nachrichten verstehen und einordnen",
    intro:
      "Aktuelle Meldungen suchst du selbst. Hier lernst du, wie du eine Nachricht liest, die wichtigsten Fragen beantwortest und die Quelle prüfst.",
    paragraphs: [
      "Der Lehrplan nennt „aktuelle Themen“ als eigenes Themengebiet. Weil die App keine Tagesnachrichten enthalten kann, übst du hier die **Methode**, die du bei jeder Meldung aus französischsprachigen Medien anwendest. Aktuelle Meldungen suchst du selbst, zum Beispiel in einer französischen Tageszeitung, im Radio oder bei einer Nachrichtenseite für Jugendliche, und sprichst im Unterricht darüber. Das ist eine Recherche- und Unterrichtsaufgabe, die die App nicht abnimmt.",
      "Eine Nachricht besteht oft aus **le titre** (Überschrift), **le chapeau** (kurzer Vorspann, der das Wichtigste zusammenfasst) und **l’article** (Text). Du beantwortest die W-Fragen: **Qui?** (Wer), **Quoi?** (Was), **Où?** (Wo), **Quand?** (Wann), **Pourquoi?** (Warum). Dazu markierst du Zahlen, Orte und Namen. Typische Wörter sind **l’actualité** (Aktuelles), **un journal**, **un journaliste**, **selon** (laut), **d’après**, **annoncer**, **déclarer**.",
      "Mit **selon** und der indirekten Rede gibst du wieder, was jemand gesagt hat: « Selon le maire, la route sera fermée. », « Le journaliste dit que le match a lieu samedi. » So trennst du Aussage und Tatsache. Wichtig sind **Datum und Quelle**: Wann wurde die Meldung veröffentlicht? Wer hat sie geschrieben? Gibt es eine zweite Quelle? Eine **Meinung** erkennst du an Wörtern wie à mon avis, je trouve oder an Adjektiven (incroyable, scandaleux).",
      "Zur Übung steht hier ein **erfundenes Beispiel** (« Le village de Beauval ») als Text, damit nichts mit echten Personen verwechselt wird. Typische Fehler sind das Überlesen von Zahlen, das Verwechseln von Fakt und Meinung und das Übernehmen einer Meldung ohne Quelle. Prüfe immer, ob Aussage, Datum und Quelle zusammenpassen.",
    ],
    terms: [
      { term: "le titre, le chapeau", text: "Die Überschrift und der kurze Vorspann einer Meldung. Beide fassen das Wichtigste zusammen." },
      { term: "Qui? Quoi? Où? Quand? Pourquoi?", text: "Die W-Fragen, mit denen du eine Nachricht erschließt: wer, was, wo, wann, warum." },
      { term: "selon, d’après", text: "Mit selon und d’après gibst du an, wessen Aussage wiedergegeben wird: Selon le maire, … Das trennt Aussage und Tatsache." },
    ],
    takeaway:
      "Lies Titel und Chapeau, beantworte Qui, Quoi, Où, Quand, Pourquoi, markiere Zahlen und Orte, gib Aussagen mit selon oder dem Verb dire wieder und prüfe Datum und Quelle. Aktuelle Meldungen suchst du selbst.",
    sourceIds: ["lp", "francefr", "cnrtl"],
    quiz: {
      question: "Womit gibst du eine Aussage aus einer Meldung wieder?",
      answer: "Selon le maire, la route sera fermée samedi.",
      wrong: ["La route sera fermée samedi, c’est sûr, je le sais.", "Je trouve que la route est horrible."],
      explanation:
        "Selon nennt die Quelle der Aussage. Die beiden anderen Sätze geben entweder eine unbelegte Sicherheit oder eine Meinung wieder.",
    },
    workshop: {
      kind: "mark",
      title: "Die W-Fragen in einer Meldung beantworten",
      instruction:
        "Wähle oben eine Frage und klicke im Text die passende Information an. Markiere Wer, Wo und Wann. Nicht jede Angabe im Text beantwortet eine dieser Fragen.",
      labels: ["Wer", "Wo", "Wann"],
      text: [
        { t: "Titre: Un nouveau parc pour les enfants. Chapeau: Le village imaginaire de Beauval ouvre un grand espace de jeux. " },
        { t: "Le maire", label: 0, feedback: "Hier steht, wer handelt: der Bürgermeister." },
        { t: " a annoncé hier que le parc ouvrira " },
        { t: "samedi à dix heures", label: 2, feedback: "Hier steht die Zeit: Samstag um zehn Uhr." },
        { t: " dans le centre du village, près de l’école. Selon " },
        { t: "les habitants", label: 0, feedback: "Hier steht, wer etwas sagt: die Einwohner." },
        { t: ", c’est un projet très attendu. Le parc a une surface de deux mille mètres carrés. L’entrée est gratuite. " },
        { t: "Le centre du village", label: 1, feedback: "Hier steht der Ort: das Dorfzentrum." },
        { t: " sera aussi fermé aux voitures pendant la fête." },
      ],
      conclusion: "Wer, Wo und Wann findest du, wenn du die Überschrift, die Namen und die Zeitangaben gezielt markierst.",
    },
    casework: {
      title: "Eine Meldung einordnen",
      story:
        "Du liest die Meldung über den neuen Park in Beauval (erfunden). Dein Freund sagt: « C’est un scandale, le maire ne sait pas ce qu’il fait. » Du sollst prüfen, was Fakt und was Meinung ist.",
      steps: [
        {
          question: "Welche Information in der Meldung ist ein Fakt?",
          options: ["Der Park öffnet samstags um zehn.", "Der Park ist ein einziger Skandal.", "Der Bürgermeister weiß nicht, was er tut."],
          answer: 0,
          explanation: "Eine Zeitangabe lässt sich nachprüfen, die anderen Sätze sind Bewertungen.",
        },
        {
          question: "Woran erkennst du eine Meinung?",
          options: ["An wertenden Wörtern wie scandale.", "An Zahlen und Namen im Text.", "An den Ortsangaben im Vorspann."],
          answer: 0,
          explanation: "Wörter wie scandale, incroyable oder je trouve que zeigen eine Meinung.",
        },
        {
          question: "Was prüfst du zusätzlich?",
          options: ["Datum und Quelle der Meldung.", "Die Länge und die Schrift der Zeitung.", "Den Namen des Journalisten allein."],
          answer: 0,
          explanation: "Datum und Quelle zeigen, ob eine Meldung aktuell und verlässlich ist.",
        },
      ],
      verdict:
        "Mit Fakten, Meinungen und einem Blick auf Datum und Quelle ordnest du eine Meldung ein, bevor du sie weitergibst.",
    },
    tasks: {
      1: {
        prompt:
          "Lies: « Titre: Un concert à la gare. Chapeau: Le groupe Lumière jouera vendredi à dix-huit heures devant la gare de Strasbourg. Selon l’organisateur, l’entrée est libre. » Beantworte auf Deutsch: Wer, Was, Wo, Wann, und was sagt der Organisator?",
        hints: [
          "Markiere Namen, Orte und Zeiten.",
          "Beachte das Wort selon.",
        ],
        model:
          "Wer: die Gruppe Lumière. Was: ein Konzert. Wo: vor dem Bahnhof von Strasbourg. Wann: am Freitag um 18 Uhr. Laut dem Organisator ist der Eintritt frei. Selon zeigt, dass die Aussage vom Organisator stammt.",
        criteria: [
          "Wer, Was, Wo und Wann sind richtig beantwortet.",
          "Die Aussage des Organisators wird mit selon eingeordnet.",
          "Die Antworten sind knapp.",
        ],
      },
      2: {
        prompt:
          "Suche selbst eine aktuelle französischsprachige Meldung (Zeitung, Radio oder Nachrichtenseite für Jugendliche, mit Datum). Schreibe auf Deutsch zehn Sätze: Quelle und Datum, Titel, die W-Fragen, ein Fakt, eine Meinung, eine Aussage mit selon und deine eigene Einschätzung. Nenne zwei französische Wörter, die du neu gelernt hast.",
        hints: [
          "Notiere Quelle und Datum zuerst.",
          "Trenne Fakt, Meinung und Aussage.",
        ],
        model:
          "Quelle: Seite einer französischen Regionalzeitung, Datum: gestern. Titel: Neue Fahrradwege in der Stadt. Wer: die Stadt Lille. Was: Sie baut neue Fahrradwege. Wo: im Zentrum. Wann: im nächsten Jahr. Fakt: Es sollen 20 Kilometer entstehen. Meinung: Ein Leser findet das « génial ». Aussage: Selon le maire, die Wege sind sicherer. Meine Einschätzung: Ich finde die Idee gut, aber ich möchte noch eine zweite Quelle prüfen. Neue Wörter: une piste cyclable (Radweg), annoncer (ankündigen).",
        criteria: [
          "Quelle, Datum und W-Fragen sind angegeben.",
          "Fakt, Meinung und Aussage mit selon sind getrennt.",
          "Zwei neue französische Wörter werden genannt.",
        ],
      },
    },
  },
];
