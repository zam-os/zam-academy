import type { Lesson } from "../model/types";

/**
 * Stufe 1, zweiter Teil: Schreiben und Sprachmittlung (Kompetenzerwartungen 1.1.7, 1.1.9 bis 1.1.13
 * und 3.6): sprachliche Richtigkeit, E-Mails und Briefe, Geschichten, Texte auf Deutsch wiedergeben,
 * Übersetzen und Vermitteln im Alltag. Eigene Texte vergleichst du mit einem Mustertext und schätzt
 * sie selbst ein.
 */
export const S1B: Lesson[] = [
  {
    id: "fr-richtig-schreiben",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.7"],
    title: "Sprachlich richtig schreiben",
    intro:
      "Beim Schreiben achtest du auf Akzente, Kleinschreibung, Angleichung und Zeichensetzung und prüfst deinen Text systematisch.",
    paragraphs: [
      "Im Französischen bestimmen Akzente die Aussprache und manchmal die Bedeutung: é (accent aigu), è und à (accent grave), ê und â (accent circonflexe), ç (cédille) und ë, ï (tréma). Vergleiche « a » (er hat) mit « à » (zu) und « ou » (oder) mit « où » (wo). Schreibe Wörter mit Akzent immer mit, auch in Großbuchstaben nach Möglichkeit: Genève, première, français.",
      "Anders als im Deutschen schreibt man Wochentage, Monate und Sprachen klein: lundi, mai, le français, l’allemand. Nationalitäten als Adjektiv sind klein (un film français), als Person groß (un Français). Nach dem Apostroph steht kein Leerzeichen: l’école, j’aime, c’est. Bei Zeichen wie ?, !, : und ; steht im Französischen ein Leerzeichen davor: « Tu viens ? », « Attention ! ». In deinen Texten kannst du dieses Leerzeichen setzen.",
      "Die **Angleichung** prüfst du bei jedem Satz: Adjektive an Nomen (une grande ville), Partizipien nach être an das Subjekt (elles sont parties), Verben ans Subjekt (ils parlent, nous parlons). Zahlen, Datum und Uhrzeit: le 3 mai, à 8 h 30, vingt-et-un, quatre-vingts.",
      "Gehe beim Überarbeiten in Schritten vor: erst Verben und Subjekt, dann Angleichungen, dann Akzente, dann Zeichensetzung. Typische Fehler: « J’ai allé » statt « Je suis allé », « Elles sont parti » statt « parties », « mardi » mit großem M, « francais » ohne Cédille. Mit einem Fehlerprotokoll siehst du, welche Fehler du oft machst.",
    ],
    terms: [
      { term: "Akzente", text: "Zeichen über Vokalen und die Cédille unter c. Sie bestimmen die Aussprache und manchmal die Bedeutung: a und à, ou und où." },
      { term: "Angleichung", text: "Adjektive, Partizipien und Verben passen sich in Geschlecht und Zahl dem Nomen oder Subjekt an." },
      { term: "Selbstkorrektur", text: "Das Überarbeiten des eigenen Texts in festen Schritten: Verben, Angleichung, Akzente, Zeichensetzung." },
    ],
    takeaway:
      "Achte auf Akzente und Cédille, schreibe Wochentage, Monate und Sprachen klein, prüfe Angleichungen und überarbeite in Schritten: Verben, Angleichung, Akzente, Zeichensetzung.",
    sourceIds: ["lp", "larousse", "cnrtl"],
    quiz: {
      question: "Welche Schreibung ist richtig?",
      answer: "Je vais à Paris mardi prochain.",
      wrong: ["Je vais a Paris Mardi prochain.", "Je vais à Paris Mardi prochain."],
      explanation:
        "Zu (à) hat einen accent grave, und Wochentage schreibt man klein. Bei a ohne Akzent wäre es eine Form von avoir.",
    },
    workshop: {
      kind: "choose",
      title: "Richtig schreiben",
      instruction: "Achte auf Akzente, Kleinschreibung und Angleichung.",
      items: [
        { before: "Je vais à Paris ", options: ["mardi", "Mardi", "mardy"], answer: 0, after: " prochain avec ma classe.", feedback: "Wochentage schreibt man im Französischen klein." },
        { before: "Il parle ", options: ["allemand", "Allemand", "alemand"], answer: 0, after: " très bien et aussi un peu italien.", feedback: "Sprachen schreibt man klein, und allemand hat zwei l." },
        { before: "J’habite à ", options: ["Genève", "Geneve", "Genêve"], answer: 0, after: " depuis un an maintenant.", feedback: "Genève hat einen accent grave auf dem zweiten e." },
        { before: "C’est la ", options: ["première", "premiere", "prémière"], answer: 0, after: " fois que je viens ici.", feedback: "Première hat einen accent grave auf dem zweiten e." },
        { before: "Elles sont ", options: ["parties", "partis", "partie"], answer: 0, after: " hier soir après le dîner.", feedback: "Das Partizip passt sich dem weiblichen Plural an: parties." },
      ],
      conclusion: "Kleinschreibung bei Wochentagen und Sprachen, richtige Akzente und Angleichungen bringen deine Texte auf ein sicheres Niveau.",
    },
    casework: {
      title: "Einen eigenen Text überarbeiten",
      story:
        "Dein Entwurf lautet: « Hier, je suis allé a Genève avec ma sœur. Nous avons visité le musée et elles sont parti tard. Mardi, nous parlons Français. »",
      steps: [
        {
          question: "Was ist an « a Genève » falsch?",
          options: ["Der accent grave auf à fehlt.", "Genève ist hier zu lang geschrieben.", "Hinter Genève fehlt ein Komma."],
          answer: 0,
          explanation: "Zu heißt à mit accent grave. A ohne Akzent ist eine Form von avoir.",
        },
        {
          question: "Was muss in « elles sont parti » geändert werden?",
          options: ["Das Partizip: parties.", "Das Verb: ont statt sont.", "Das Subjekt: ils statt elles."],
          answer: 0,
          explanation: "Nach être richtet sich das Partizip nach dem Subjekt: elles sont parties.",
        },
        {
          question: "Was ist an « parlons Français » falsch?",
          options: ["Français wird klein geschrieben.", "Es fehlt ein Apostroph vor Français.", "Parlons muss hier im Singular stehen."],
          answer: 0,
          explanation: "Sprachen schreibt man klein: parler français.",
        },
      ],
      verdict:
        "Beim Überarbeiten findest du Akzent, Angleichung und Großschreibung. Mit einer festen Reihenfolge übersiehst du weniger.",
    },
    tasks: {
      1: {
        prompt:
          "Korrigiere den Text: « Hier, je suis allé a Lyon. Les filles sont parti lundi. Elles parlent Français. » Schreibe ihn richtig auf.",
        hints: [
          "Achte auf à, Angleichung und Kleinschreibung.",
          "Prüfe jedes Wort einzeln.",
        ],
        model:
          "Hier, je suis allé à Lyon. Les filles sont parties lundi. Elles parlent français. Das fehlende Akzentzeichen bei à, die Angleichung des Partizips an den weiblichen Plural und die Kleinschreibung der Sprache sind die drei Korrekturen.",
        criteria: [
          "À ist mit accent grave geschrieben.",
          "Das Partizip ist an das weibliche Plural-Subjekt angeglichen.",
          "Die Sprache ist klein geschrieben.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Text von sechs bis acht Sätzen über ein Wochenende. Überarbeite ihn danach in vier Schritten (Verben, Angleichung, Akzente, Zeichensetzung) und schreibe eine kurze Liste deiner drei häufigsten Fehler auf.",
        hints: [
          "Lies den Text vier Mal, jedes Mal mit einem anderen Schwerpunkt.",
          "Notiere Fehler in einem Protokoll.",
        ],
        model:
          "Samedi, je suis allé à Munich avec mes parents. Nous avons visité un grand musée. Ma sœur est restée à la maison parce qu’elle était malade. Dimanche, nous avons mangé chez ma grand-mère. Fehlerprotokoll: 1. Akzent bei à. 2. Partizip nach être (restée). 3. Kleinschreibung bei Wochentagen.",
        criteria: [
          "Der Text ist in vier Schritten überarbeitet.",
          "Das Fehlerprotokoll nennt drei konkrete Fehlerarten.",
          "Akzente, Angleichungen und Kleinschreibung sind richtig.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Richtig schreiben: Übungsrunde",
      instruction: "Wähle die richtige Schreibung. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Je vais ", options: ["à", "a"], answer: 0, after: " l’école à pied tous les jours.", feedback: "Zu heißt à mit accent grave, nicht a ohne Akzent." },
          { before: "Elle ", options: ["a", "à"], answer: 0, after: " un chat noir et blanc.", feedback: "Von avoir kommt a ohne Akzent." },
          { before: "Tu veux du thé ", options: ["ou", "où"], answer: 0, after: " du café?", feedback: "Ou ohne Akzent heißt oder, où mit Akzent heißt wo." },
          { before: "Nous parlons ", options: ["français", "Français"], answer: 0, after: " avec nos amis.", feedback: "Sprachen schreibt man im Französischen klein." },
          { before: "Il vient ", options: ["lundi", "Lundi"], answer: 0, after: " soir.", feedback: "Wochentage schreibt man klein." },
          { before: "C’est une ", options: ["grande", "grand"], answer: 0, after: " ville du sud de la France.", feedback: "Das Adjektiv passt sich an ville (feminin) an." },
          { before: "Elles sont ", options: ["arrivées", "arrivé"], answer: 0, after: " ce matin à la gare.", feedback: "Das Partizip passt sich an das weibliche Plural-Subjekt an." },
          { before: "La ", options: ["première", "premiere"], answer: 0, after: " classe commence à huit heures.", feedback: "Première hat den accent grave." },
        ],
        2: [
          { before: "Mes amies sont ", options: ["parties", "partis", "partie"], answer: 0, after: " en vacances en Espagne, et nous irons les voir pendant les vacances de Pâques.", feedback: "Das Partizip passt sich an das weibliche Plural-Subjekt an." },
          { before: "Où est-ce que tu habites? J’habite ", options: ["à", "a", "ã"], answer: 0, after: " Strasbourg, une jolie ville qui se trouve à la frontière entre la France et l’Allemagne.", feedback: "Zu heißt à mit accent grave, nicht a ohne Akzent." },
          { before: "Il m’a demandé ", options: ["où", "ou", "u"], answer: 0, after: " se trouve la gare et à quelle heure part le prochain train pour Marseille.", feedback: "Wo heißt où mit accent grave, oder heißt ou ohne Akzent." },
          { before: "Au cours de ", options: ["français", "Français", "francais"], answer: 0, after: ", nous avons lu un texte sur les jeunes de Paris et nous avons discuté ensemble.", feedback: "Sprachen schreibt man klein, und ç trägt die Cédille." },
          { before: "Cet été, nous allons passer des vacances en ", options: ["Suisse", "suisse", "Suise"], answer: 0, after: " avec toute la famille, car mes grands-parents y habitent depuis longtemps.", feedback: "Ländernamen schreibt man groß, und Suisse hat zwei s." },
          { before: "Ma sœur est très ", options: ["fatiguée", "fatigué", "fatiguées"], answer: 0, after: " ce soir, parce qu’elle a couru un marathon cet après-midi avec ses amis.", feedback: "Das Adjektiv passt sich an ma sœur (feminin Singular) an." },
          { before: "Mes cousins ", options: ["habitent", "habite", "habitons"], answer: 0, after: " à Genève depuis cinq ans, et nous leur rendons visite deux fois par an.", feedback: "Das Verb passt sich an das Plural-Subjekt an: ils habitent." },
          { before: "La ", options: ["première", "premiere", "prémière"], answer: 0, after: " fois que j’ai visité Paris, j’avais douze ans et je n’avais jamais vu la tour Eiffel.", feedback: "Première hat den accent grave auf dem zweiten e." },
        ],
      },
    },
  },
  {
    id: "fr-brief-email",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.9", "3.6"],
    title: "E-Mails und Briefe: persönlich und formell",
    intro:
      "Persönliche und formelle Schreiben haben einen festen Aufbau. Aus Anrede, Hauptteil und Grußformel erkennst du den Ton.",
    paragraphs: [
      "Ein **persönlicher Brief** oder eine E-Mail an Freunde und Familie beginnt mit Ort und Datum (Munich, le 15 mai), einer Anrede (« Cher Paul, », « Chère Léa, », « Salut Max, ») und einem Einstieg (« Merci pour ton message. », « Comment vas-tu? »). Im Hauptteil erzählst du, fragst und antwortest mit tu. Der Schluss enthält einen Wunsch und eine Grußformel: « J’espère te voir bientôt. Amitiés, / Bises, / À bientôt, » und dein Name.",
      "Ein **formelles Schreiben** (Bewerbung, Anfrage, Brief an eine Firma) richtet sich an eine Person oder Stelle: « Madame, Monsieur, » (ohne Namen) oder « Madame Roux, ». Du schreibst mit **vous**. Der Einstieg nennt den Anlass: « Je vous écris pour demander un stage de deux semaines. » Der Hauptteil nennt Informationen und Wünsche sachlich. Der Schluss bedankt sich und enthält die Grußformel: « Je vous remercie de votre attention. Cordialement, » oder « Veuillez agréer, Madame, Monsieur, mes salutations distinguées. »",
      "Die **Analyse des Aufbaus** hilft dir, eigene Texte besser zu schreiben: Welche Teile sehe ich? Wie ist die Anrede? Wird tu oder vous verwendet? Wie ist der Ton (freundlich, sachlich)? In einer E-Mail an eine Firma gehören ein klarer **Betreff** (Objet : demande de stage), Anrede, Anlass, Informationen und Grußformel zusammen. Ein Foto oder Anhang wird im Text erwähnt: « Vous trouverez mon CV en pièce jointe. »",
      "Typische Fehler sind ein Wechsel zwischen tu und vous im selben Brief, eine zu lockere Anrede (« Salut Madame ») und fehlende Grußformeln. Auch Rechtschreibung und Zeichensetzung zählen: Eine Bewerbung mit Fehlern wirkt unprofessionell. Prüfe deshalb den Text vor dem Abschicken.",
    ],
    terms: [
      { term: "tu und vous", text: "Persönliche Briefe schreibst du mit tu, formelle mit vous. Wechsle nicht innerhalb des Briefs." },
      { term: "Anrede und Grußformel", text: "Cher Paul und Amitiés im persönlichen Brief, Madame, Monsieur und Cordialement im formellen Schreiben." },
      { term: "objet, pièce jointe", text: "Betreff und Anhang einer E-Mail: Objet: demande de stage. Vous trouverez mon CV en pièce jointe." },
    ],
    takeaway:
      "Persönliche Briefe: tu, Cher/Chère, Amitiés. Formelle Briefe: vous, Madame/Monsieur, Je vous écris pour …, Cordialement. Beide haben Anrede, Anlass, Hauptteil, Wunsch und Grußformel. Prüfe vor dem Abschicken den Ton und die Rechtschreibung.",
    sourceIds: ["lp", "dfjw", "onisep"],
    quiz: {
      question: "Wie beginnst du eine formelle E-Mail an eine Firma, deren Ansprechperson du nicht kennst?",
      answer: "Madame, Monsieur,",
      wrong: ["Salut les gars,", "Cher ami,"],
      explanation:
        "Bei einem formellen Schreiben ohne bekannte Person verwendest du Madame, Monsieur. Salut und Cher ami gehören zu persönlichen Briefen an Freunde.",
    },
    workshop: {
      kind: "classify",
      title: "Persönlich oder formell?",
      instruction: "Ordne jeden Satz dem Stil zu, zu dem er passt.",
      categories: ["Persönlich", "Formell"],
      entries: [
        { text: "Salut Paul, merci pour ton message!", target: 0, feedback: "Salut und tu zeigen einen persönlichen Stil." },
        { text: "Madame, Monsieur, je vous écris pour demander un stage.", target: 1, feedback: "Madame, Monsieur und vous gehören zu einem formellen Schreiben." },
        { text: "Bises et à bientôt, j’espère te voir vite!", target: 0, feedback: "Bises ist eine freundschaftliche Grußformel." },
        { text: "Veuillez agréer, Madame, Monsieur, mes salutations distinguées.", target: 1, feedback: "Das ist die klassische formelle Grußformel." },
        { text: "Je te raconte mes vacances: c’était génial!", target: 0, feedback: "Du-Form und lockere Sprache zeigen einen persönlichen Brief." },
        { text: "Je vous remercie de votre attention et reste à votre disposition.", target: 1, feedback: "Vous und die Wendung à votre disposition sind formell." },
      ],
      conclusion: "Anrede, tu oder vous und Grußformel zeigen den Stil. Wechsle ihn nicht im selben Brief.",
    },
    casework: {
      title: "Eine Bewerbung um ein Praktikum",
      story:
        "Du schreibst an eine Firma in Lyon: « Objet : demande de stage. Madame, Monsieur, je vous écris pour demander un stage de deux semaines en juillet. Vous trouverez mon CV en pièce jointe. Je vous remercie de votre attention. Cordialement, Anna Weber »",
      steps: [
        {
          question: "Warum beginnt die E-Mail mit « Madame, Monsieur, »?",
          options: ["Die Ansprechperson ist unbekannt.", "Die Firma ist sehr alt.", "Es ist ein Gruß unter Freunden."],
          answer: 0,
          explanation: "Madame, Monsieur ist die formelle Anrede, wenn du den Namen der Person nicht kennst.",
        },
        {
          question: "Welche Anrede passt zu dieser E-Mail?",
          options: ["Vous.", "Tu.", "Nous."],
          answer: 0,
          explanation: "Formelle Schreiben verwenden vous.",
        },
        {
          question: "Was zeigt « en pièce jointe »?",
          options: ["Der CV hängt als Anhang an.", "Der CV liegt auf dem Tisch.", "Der Brief wird verschickt."],
          answer: 0,
          explanation: "Pièce jointe heißt Anhang und wird in formellen E-Mails erwähnt.",
        },
      ],
      verdict:
        "Die E-Mail hat Betreff, formelle Anrede, Anlass, Anhang, Dank und Grußformel. So schreibst du eine sachliche Anfrage.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe eine kurze persönliche E-Mail (vier Sätze) an einen Freund in Frankreich: Anrede, Dank für seine Nachricht, eine Neuigkeit und eine Grußformel.",
        hints: [
          "Beginne mit « Salut Paul, ».",
          "Schließe mit « À bientôt, » und deinem Namen.",
        ],
        model:
          "Salut Paul, merci pour ton message! Cette semaine, j’ai commencé mon stage dans une librairie, c’est très intéressant. J’espère que tu vas bien. À bientôt, Anna. Die E-Mail verwendet tu, Anrede, Dank, Neuigkeit und Gruß.",
        criteria: [
          "Anrede und Grußformel stehen.",
          "Die Du-Form wird durchgehend verwendet.",
          "Dank und eine Neuigkeit kommen vor.",
        ],
      },
      2: {
        prompt:
          "Schreibe eine formelle E-Mail (sechs bis acht Sätze) an ein Hotel in Paris, in der du ein Zimmer für zwei Nächte anfragst. Verwende Betreff, Anrede, Anlass, genaue Angaben (Datum, Personenzahl) und eine formelle Grußformel.",
        hints: [
          "Nutze vous durchgehend.",
          "Beginne den Hauptteil mit « Je vous écris pour … ».",
        ],
        model:
          "Objet : réservation d’une chambre. Madame, Monsieur, je vous écris pour réserver une chambre pour deux personnes du 12 au 14 mai. Pouvez-vous me dire le prix et si le petit déjeuner est compris? Je vous remercie de votre réponse. Cordialement, Anna Weber.",
        criteria: [
          "Betreff, Anrede, Anlass, Angaben und Grußformel stehen.",
          "Die Sie-Form (vous) wird durchgehend verwendet.",
          "Datum und Personenzahl werden genannt.",
        ],
      },
    },
  },
  {
    id: "fr-geschichte-erzaehlen",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.10"],
    title: "Geschichten erzählen: Vergangenheit, Gegenwart, Zukunft",
    intro:
      "Eine gute Geschichte hat Rahmen, Ereignis und Schluss. Mit Zeitformen, Gefühlen und eigener Meinung machst du sie lebendig.",
    paragraphs: [
      "Eine Geschichte hat drei Teile. **Einleitung:** Rahmen mit Ort, Zeit und Personen im imparfait (« Ce jour-là, il faisait beau et nous étions au bord du lac. »). **Hauptteil:** Das Ereignis und die Folgen im passé composé mit Reihenfolgewörtern (« Soudain, … Puis, … Ensuite, … »). **Schluss:** Ausgang und Gefühle (« Finalement, … C’était une belle journée. »).",
      "Für längere, strukturierte Texte nutzt du **Reihenfolgewörter** (d’abord, ensuite, puis, après, enfin, finalement), **Zeitangaben** (ce jour-là, hier, un jour, soudain, tout à coup) und **Konnektoren** (donc, c’est pourquoi, mais, quand même). Mit solchen Wörtern verbindest du Sätze und der Leser sieht den Ablauf.",
      "Persönliche Erfahrungen, Gefühle und Meinungen machen deine Geschichte lebendig: « J’étais très content. », « Moi, j’ai eu peur. », « À mon avis, c’était une bonne idée. » Über die Gegenwart schreibst du im Präsens, über die Zukunft im futur proche oder futur simple: « Maintenant, j’habite à Lyon. », « L’année prochaine, je vais retourner là-bas. »",
      "Typische Fehler sind ein Wechsel der Zeitform ohne Grund, fehlende Reihenfolgewörter und eine Geschichte ohne Ende. Prüfe nach dem Schreiben: Steht der Rahmen im imparfait? Stehen die Ereignisse im passé composé? Ist der Schluss klar? Passt jede Zeitform zu ihrer Rolle?",
    ],
    terms: [
      { term: "Rahmen und Ereignis", text: "Der Rahmen (Ort, Zeit, Zustand) steht im imparfait, die Ereignisse stehen im passé composé." },
      { term: "Reihenfolgewörter", text: "d’abord, ensuite, puis, enfin, finalement: sie ordnen den Ablauf und verbinden Sätze." },
      { term: "persönliche Erfahrung", text: "Gefühle und Meinung machen die Geschichte lebendig: J’étais content. À mon avis, c’était une bonne idée." },
    ],
    takeaway:
      "Eine Geschichte hat Rahmen im imparfait, Ereignisse im passé composé und einen Schluss. Reihenfolgewörter und persönliche Gefühle machen sie lesbar. Gegenwart: Präsens, Zukunft: futur proche oder futur simple.",
    sourceIds: ["lp", "lingolia", "lepointdufle"],
    quiz: {
      question: "Welcher Satz passt in die Einleitung einer Geschichte?",
      answer: "Ce jour-là, il faisait beau au lac.",
      wrong: ["Soudain, un chien a volé notre ballon.", "Finalement, nous avons retrouvé le ballon."],
      explanation:
        "Die Einleitung beschreibt den Rahmen im imparfait. Soudain gehört zum Hauptteil, finalement zum Schluss.",
    },
    workshop: {
      kind: "timeline",
      title: "Eine Geschichte in die richtige Reihenfolge bringen",
      instruction: "Bringe die Sätze der Geschichte in die richtige Reihenfolge: Rahmen, Ereignis, Handlung, Schluss.",
      categories: [],
      entries: [
        { text: "Ce jour-là, il faisait beau et nous étions au bord du lac.", target: 0, feedback: "Der Rahmen steht im imparfait und eröffnet die Geschichte." },
        { text: "Soudain, mon frère a vu un petit chien perdu dans l’herbe.", target: 1, feedback: "Soudain leitet das Ereignis im passé composé ein." },
        { text: "Nous l’avons appelé, puis nous lui avons donné de l’eau.", target: 2, feedback: "Puis führt die Handlung nach dem Ereignis weiter." },
        { text: "Ensuite, nous avons cherché le propriétaire dans le parc.", target: 3, feedback: "Ensuite zeigt den nächsten Schritt der Handlung." },
        { text: "Finalement, une dame est arrivée et elle était très contente.", target: 4, feedback: "Finalement leitet den Schluss ein." },
      ],
      conclusion: "Rahmen, Ereignis, Handlung und Schluss geben einer Geschichte Struktur.",
    },
    casework: {
      title: "Einen Ausflug erzählen",
      story:
        "Du schreibst: « Hier, nous sommes allés au lac. Il faisait beau. Soudain, mon frère est tombé dans l’eau. J’ai eu peur, mais il a ri. À mon avis, c’était le meilleur jour de l’été. »",
      steps: [
        {
          question: "Warum steht « il faisait beau » im imparfait?",
          options: ["Es beschreibt den Rahmen.", "Es zeigt hier ein einzelnes Ereignis.", "Es steht direkt nach dem Wort soudain."],
          answer: 0,
          explanation: "Das Wetter ist der Rahmen, in dem das Ereignis geschieht.",
        },
        {
          question: "Welche Funktion hat « soudain »?",
          options: ["Es leitet das Ereignis ein.", "Es beschreibt hier den Rahmen der Szene.", "Es beendet am Ende die ganze Geschichte."],
          answer: 0,
          explanation: "Soudain kündigt ein plötzliches Ereignis im passé composé an.",
        },
        {
          question: "Was zeigt « À mon avis »?",
          options: ["Eine persönliche Meinung.", "Eine Zeitangabe für den Ablauf.", "Einen Gegensatz zum Rahmen."],
          answer: 0,
          explanation: "À mon avis leitet eine eigene Meinung ein und macht die Geschichte persönlich.",
        },
      ],
      verdict:
        "Rahmen im imparfait, Ereignis im passé composé und persönliche Meinung am Ende: So wirkt die Geschichte lebendig und klar.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe eine kurze Geschichte von fünf Sätzen: Rahmen (imparfait), ein Ereignis (soudain + passé composé), eine Handlung (puis) und ein Schluss (finalement).",
        hints: [
          "Beginne mit « Ce jour-là, il … ».",
          "Setze mindestens zwei Reihenfolgewörter ein.",
        ],
        model:
          "Ce jour-là, il pleuvait et j’étais seul à la maison. Soudain, le téléphone a sonné. J’ai répondu, puis j’ai entendu la voix de ma cousine. Finalement, nous avons décidé d’aller au cinéma ensemble. C’était une bonne surprise.",
        criteria: [
          "Der Rahmen steht im imparfait.",
          "Das Ereignis steht im passé composé mit soudain.",
          "Mindestens zwei Reihenfolgewörter werden verwendet.",
        ],
      },
      2: {
        prompt:
          "Schreibe eine Geschichte von acht bis zehn Sätzen über ein Erlebnis, das etwas Besonderes war. Verwende Rahmen, Ereignis, Handlung und Schluss, dazu Gefühle und deine Meinung, und schließe mit einem Ausblick auf die Zukunft.",
        hints: [
          "Baue Gefühle ein: J’étais, j’ai eu peur, j’étais content.",
          "Der Ausblick kann im futur proche stehen: Je vais retourner là-bas.",
        ],
        model:
          "Ce jour-là, il faisait très chaud et nous étions à la plage. Mon frère voulait faire du surf. Soudain, une grosse vague l’a surpris et il est tombé. J’ai eu très peur, mais un homme l’a aidé. Ensuite, nous avons ri ensemble. À mon avis, c’était une journée inoubliable. L’été prochain, nous allons retourner à la même plage.",
        criteria: [
          "Rahmen, Ereignis und Schluss sind zeitlich passend formuliert.",
          "Gefühle, Meinung und Ausblick kommen vor.",
          "Reihenfolgewörter machen den Ablauf klar.",
        ],
      },
    },
  },
  {
    id: "fr-sprachmittlung-text",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.11"],
    title: "Texte auf Deutsch sinngemäß wiedergeben",
    intro:
      "Bei der Sprachmittlung gibst du den Inhalt eines französischen Texts für einen deutschen Leser zusammen, ohne ihn Wort für Wort zu übersetzen.",
    paragraphs: [
      "**Sprachmittlung** heißt, den Inhalt eines Texts in der anderen Sprache so wiederzugeben, dass jemand ihn versteht, der den Text nicht lesen kann. Du übersetzt nicht Satz für Satz. Du fragst: **Für wen** schreibe ich (Mutter, Freund, Lehrer)? **Wozu** braucht die Person die Information? **Welche** Angaben sind wichtig?",
      "Zuerst liest du den französischen Text und erfasst den Zusammenhang. Dann markierst du die Informationen, die der Leser braucht, zum Beispiel Zeit, Ort, Preis, Bedingungen. Unwichtige Details lässt du weg: Geschichte der Firma, Werbesätze, Beispiele. Zum Schluss formulierst du auf Deutsch kurz und klar, in eigenen Worten.",
      "Wenn du ein Wort nicht kennst, erschließt du es (Kontext, Wortfamilie) oder lässt es weg, wenn es nicht wichtig ist. Das ist die Strategie bei komplexeren Texten. Bei Stellenanzeigen, Reiseinfos und Programmen sind Zahlen, Fristen und Bedingungen besonders wichtig.",
      "Typische Fehler sind Wort-für-Wort-Übersetzungen, zu viele Details, falsche Gewichtung (Nebensache statt Hauptsache) und eigene Meinungen, die nicht im Text stehen. Die gute Sprachmittlung ist kürzer als der Originaltext und enthält trotzdem alle nötigen Informationen.",
    ],
    terms: [
      { term: "Sprachmittlung", text: "Den Inhalt eines Texts für jemanden in der anderen Sprache wiedergeben, ohne Wort für Wort zu übersetzen." },
      { term: "Adressat", text: "Die Person, für die du mittelst. Von ihr hängt ab, welche Informationen wichtig sind." },
      { term: "sinngemäß", text: "Dem Sinn nach, in eigenen Worten und gekürzt, ohne dass Wichtiges fehlt oder dazuerfunden wird." },
    ],
    takeaway:
      "Frage zuerst: Für wen, wozu, was ist wichtig? Gib nur die nötigen Informationen auf Deutsch in eigenen Worten wieder. Lass Unwichtiges weg und übersetze nicht Wort für Wort.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Was ist bei der Sprachmittlung wichtig?",
      answer: "Nur die Informationen, die der Leser braucht.",
      wrong: ["Jedes Wort des Textes genau übersetzen.", "Meine eigene Meinung zum Thema ergänzen."],
      explanation:
        "Bei der Sprachmittlung gibst du sinngemäß nur das wieder, was der Adressat braucht. Wort-für-Wort-Übersetzung und eigene Meinung sind keine Mittlung.",
    },
    workshop: {
      kind: "classify",
      title: "Wichtig oder unwichtig?",
      instruction:
        "Du berichtest deiner Mutter, die kein Französisch kann, über ein Praktikumsangebot. Ordne die Sätze der Anzeige ein: Was musst du weitergeben und was nicht?",
      categories: ["Wichtig", "Unwichtig"],
      entries: [
        { text: "Nous cherchons un stagiaire pour trois semaines en juillet.", target: 0, feedback: "Dauer und Zeitraum sind für die Mutter wichtig." },
        { text: "Notre entreprise a été fondée en 1952 par la famille Martin.", target: 1, feedback: "Die Geschichte der Firma braucht deine Mutter nicht." },
        { text: "Le stage est payé 400 euros par mois.", target: 0, feedback: "Die Bezahlung ist eine wichtige Information." },
        { text: "Notre directeur adore le jazz et organise un concert chaque année.", target: 1, feedback: "Das ist Zusatzinformation ohne Bedeutung für die Entscheidung." },
        { text: "Il faut envoyer un CV avant le 15 mai.", target: 0, feedback: "Frist und Unterlage sind entscheidend." },
        { text: "Notre cantine propose un menu végétarien le jeudi.", target: 1, feedback: "Das Kantinenangebot ist für die Mutter unwichtig." },
      ],
      conclusion: "Zeit, Dauer, Geld und Fristen sind wichtig. Firmengeschichte und Nebensachen lässt du weg.",
    },
    casework: {
      title: "Eine Information für die Oma",
      story:
        "Deine Oma will wissen, was auf dem Plakat im Museum steht: « Le musée est ouvert du mardi au dimanche, de 10 h à 18 h. Entrée: 8 euros, gratuit pour les moins de 18 ans. Fermé le lundi. »",
      steps: [
        {
          question: "Was sagst du auf Deutsch zuerst?",
          options: ["Wann das Museum geöffnet ist.", "Wie alt das Museum insgesamt ist.", "Wie viele Räume es dort gibt."],
          answer: 0,
          explanation: "Die Öffnungszeiten braucht deine Oma, um zu planen. Die anderen Angaben stehen nicht im Text.",
        },
        {
          question: "Was sagst du zum Eintritt?",
          options: ["Acht Euro, unter 18 frei.", "Acht Euro für alle.", "Der Eintritt ist immer frei."],
          answer: 0,
          explanation: "Der Preis und die Regel für unter 18-Jährige gehören zusammen.",
        },
        {
          question: "Was ist wichtig am letzten Satz?",
          options: ["Montag ist geschlossen.", "Montag ist besonders günstig.", "Montag gibt es Führungen."],
          answer: 0,
          explanation: "« Fermé le lundi » heißt, dass montags geschlossen ist.",
        },
      ],
      verdict:
        "Mit Öffnungszeiten, Eintritt und Ruhetag hat die Oma alles, was sie braucht. Der Text ist kürzer als das Original.",
    },
    tasks: {
      1: {
        prompt:
          "Lies: « Notre auberge de jeunesse est située près de la gare. Le prix est de 25 euros par nuit, petit déjeuner inclus. Réservation obligatoire avant le 1er juin. » Gib auf Deutsch in drei Sätzen wieder, was deine Freundin wissen muss.",
        hints: [
          "Nenne Lage, Preis und Frist.",
          "Übersetze nicht Wort für Wort.",
        ],
        model:
          "Die Jugendherberge liegt in der Nähe des Bahnhofs. Eine Nacht kostet 25 Euro mit Frühstück. Man muss bis zum 1. Juni reservieren. Damit stehen Lage, Preis und Frist im Text, mehr braucht die Freundin nicht.",
        criteria: [
          "Lage, Preis und Frist werden genannt.",
          "Der Text ist kürzer als das Original.",
          "Es wird nichts hinzugefügt, was nicht im Text steht.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen kurzen französischen Text (fünf bis sechs Sätze) über einen Sommerkurs mit Zeit, Ort, Preis und Anmeldung. Schreibe dazu eine deutsche Sprachmittlung für einen Mitschüler in drei bis vier Sätzen.",
        hints: [
          "Wähle ein Thema wie Sport, Kunst oder Sprachen.",
          "Die deutsche Fassung enthält nur wichtige Informationen.",
        ],
        model:
          "Französisch: Cet été, notre club organise un cours de théâtre du 10 au 21 juillet. Le cours a lieu au centre culturel de Lyon, de 14 h à 17 h. Le prix est de 90 euros. Inscription avant le 1er juillet. Deutsch: Im Sommer gibt es einen Theaterkurs vom 10. bis 21. Juli im Kulturzentrum Lyon, nachmittags von 14 bis 17 Uhr. Er kostet 90 Euro, die Anmeldung ist bis zum 1. Juli möglich.",
        criteria: [
          "Der französische Text nennt Zeit, Ort, Preis und Anmeldung.",
          "Die deutsche Fassung enthält alle diese Angaben.",
          "Die deutsche Fassung ist deutlich kürzer.",
        ],
      },
    },
  },
  {
    id: "fr-uebersetzen",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.12"],
    title: "Übersetzen: Fallen bei Wort-für-Wort-Gleichungen",
    intro:
      "Viele Wörter sehen deutschen ähnlich, bedeuten aber etwas anderes. Beim Übersetzen zählt der Sinn, nicht das einzelne Wort.",
    paragraphs: [
      "Beim Übersetzen französischer Textvorgaben ins Deutsche arbeitest du mit bekanntem oder leicht erschließbarem Sprachmaterial. Die Grundregel: Übersetze Sinn, nicht Wörter. Viele Ausdrücke haben im Deutschen eine andere Form: « Il fait froid » heißt „Es ist kalt“, nicht „Er macht kalt“. « J’ai faim » heißt „Ich habe Hunger“. « Il y a » heißt „es gibt“, « ça va » „es geht“ oder „wie geht’s“.",
      "**Falsche Freunde** (faux amis) sehen vertraut aus, bedeuten aber etwas anderes: **actuellement** heißt zurzeit, nicht tatsächlich; **un gymnase** ist eine Turnhalle, kein Gymnasium; **demander** heißt fragen oder bitten, nicht verlangen; **la chance** heißt Glück; **rester** heißt bleiben, nicht rasten; **assister à** heißt teilnehmen, nicht assistieren. Auch **un chef** kann Koch oder Chef bedeuten.",
      "Auch Wortgleichungen führen in die Irre: **faire** heißt nicht immer „machen“ (faire du sport = Sport treiben, faire la cuisine = kochen, il fait chaud = es ist warm). **prendre** heißt nicht nur nehmen (prendre le train = den Zug nehmen, prendre un café = einen Kaffee trinken, prendre une décision = eine Entscheidung treffen). Fester Wortschatz wird als Ganzes übersetzt, nicht Wort für Wort.",
      "Gehe so vor: Erst den Satz im Zusammenhang lesen, dann die Bedeutung klären, dann einen natürlichen deutschen Satz formulieren. Typische Fehler sind die Wort-für-Wort-Übersetzung (« Ça fait deux ans que j’habite ici » nicht als „Das macht zwei Jahre, dass ich hier wohne“) und das Übernehmen falscher Freunde.",
    ],
    terms: [
      { term: "faux amis", text: "Falsche Freunde: Wörter, die einem deutschen Wort ähneln, aber etwas anderes bedeuten, zum Beispiel actuellement und gymnase." },
      { term: "Wortgleichung", text: "Die Annahme, ein französisches Wort habe immer dieselbe deutsche Entsprechung. Sie führt bei faire und prendre in die Irre." },
      { term: "feste Wendung", text: "Ein Ausdruck, der als Ganzes übersetzt wird: il y a (es gibt), avoir faim (Hunger haben), il fait froid (es ist kalt)." },
    ],
    takeaway:
      "Übersetze den Sinn, nicht einzelne Wörter. Achte auf falsche Freunde (actuellement = zurzeit, gymnase = Turnhalle, demander = fragen) und auf Verben wie faire und prendre, die viele Bedeutungen haben.",
    sourceIds: ["lp", "cnrtl", "larousse"],
    quiz: {
      question: "Wie übersetzt du « Il habite actuellement à Paris »?",
      answer: "Er wohnt zurzeit in Paris.",
      wrong: ["Er wohnt tatsächlich in Paris.", "Er wohnt aktuell als Paris."],
      explanation:
        "Actuellement ist ein falscher Freund und heißt „zurzeit“. Tatsächlich wäre en fait oder vraiment.",
    },
    workshop: {
      kind: "choose",
      title: "Die richtige Übersetzung wählen",
      instruction: "Wähle die Übersetzung, die den Sinn trifft und nicht in eine Falle tappt.",
      items: [
        { before: "« Il habite actuellement à Paris. » heißt: ", options: ["Er wohnt zurzeit in Paris.", "Er wohnt tatsächlich in Paris.", "Er wohnt aktuell als Paris."], answer: 0, after: "", feedback: "Actuellement heißt zurzeit und nicht tatsächlich." },
        { before: "« Elle demande son chemin. » heißt: ", options: ["Sie fragt nach dem Weg.", "Sie verlangt ihren Weg.", "Sie demonstriert ihren Weg."], answer: 0, after: "", feedback: "Demander heißt fragen oder bitten, nicht verlangen." },
        { before: "« On joue au gymnase. » heißt: ", options: ["Wir spielen in der Turnhalle.", "Wir spielen im Gymnasium.", "Wir spielen im Gymnastikraum."], answer: 0, after: "", feedback: "Un gymnase ist eine Turnhalle, kein Gymnasium." },
        { before: "« Ça fait deux ans que j’habite ici. » heißt: ", options: ["Ich wohne seit zwei Jahren hier.", "Das macht zwei Jahre, dass ich hier wohne.", "Ich mache zwei Jahre hier."], answer: 0, after: "", feedback: "Die Wendung ça fait … que bedeutet „seit“. Wort für Wort wird sie unverständlich." },
        { before: "« Il fait froid. » heißt: ", options: ["Es ist kalt.", "Er macht kalt.", "Er tut kalt."], answer: 0, after: "", feedback: "Beim Wetter ist il unpersönlich: il fait froid heißt es ist kalt." },
      ],
      conclusion: "Falsche Freunde und feste Wendungen übersetzt du nach dem Sinn.",
    },
    casework: {
      title: "Eine Nachricht übersetzen",
      story:
        "Dein Freund schickt dir: « Je prends le train à huit heures. J’assiste à un concert ce soir. Je reste chez mon oncle pendant le week-end. Il a de la chance, il habite près du gymnase. »",
      steps: [
        {
          question: "Wie übersetzt du « j’assiste à un concert »?",
          options: ["Ich besuche ein Konzert.", "Ich assistiere bei einem Konzert.", "Ich helfe dem Konzert."],
          answer: 0,
          explanation: "Assister à heißt teilnehmen, besuchen, nicht assistieren.",
        },
        {
          question: "Wie übersetzt du « Il a de la chance »?",
          options: ["Er hat Glück.", "Er hat eine Chance.", "Er hat Chancen."],
          answer: 0,
          explanation: "La chance heißt Glück. Eine Chance im Sinne einer Möglichkeit heißt une occasion.",
        },
        {
          question: "Wie übersetzt du « il habite près du gymnase »?",
          options: ["Er wohnt in der Nähe der Turnhalle.", "Er wohnt in der Nähe des Gymnasiums.", "Er wohnt im Gymnasium."],
          answer: 0,
          explanation: "Un gymnase ist eine Turnhalle. Das deutsche Gymnasium ist un lycée.",
        },
      ],
      verdict:
        "Die Nachricht enthält drei falsche Freunde. Wer jeden einzelnen erkennt, übersetzt richtig und vermeidet Missverständnisse.",
    },
    tasks: {
      1: {
        prompt:
          "Übersetze ins Deutsche und achte auf falsche Freunde: 1. Il habite actuellement à Lyon. 2. Nous restons à la maison. 3. Elle assiste à un cours.",
        hints: [
          "Denke an zurzeit, bleiben und teilnehmen.",
          "Formuliere natürliche deutsche Sätze.",
        ],
        model:
          "1. Er wohnt zurzeit in Lyon. 2. Wir bleiben zu Hause. 3. Sie nimmt an einem Kurs teil. In Satz 1 heißt actuellement zurzeit, in Satz 2 heißt rester bleiben, in Satz 3 bedeutet assister à teilnehmen.",
        criteria: [
          "Die falschen Freunde werden richtig übersetzt.",
          "Die Sätze klingen natürlich.",
          "Es wird sinngemäß, nicht Wort für Wort übersetzt.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf französische Sätze mit je einem falschen Freund oder einer festen Wendung (actuellement, gymnase, demander, assister à, ça fait … que, il fait chaud) und übersetze sie sinngemäß ins Deutsche.",
        hints: [
          "Wähle fünf verschiedene Fallen.",
          "Gib die deutsche Übersetzung direkt dahinter an.",
        ],
        model:
          "Actuellement, j’habite à Munich. – Zurzeit wohne ich in München. Je demande l’heure. – Ich frage nach der Uhrzeit. Nous jouons au gymnase. – Wir spielen in der Turnhalle. J’assiste à un cours de français. – Ich nehme an einem Französischkurs teil. Ça fait deux ans que j’apprends le français. – Ich lerne seit zwei Jahren Französisch.",
        criteria: [
          "Fünf verschiedene Fallen werden verwendet.",
          "Die Übersetzungen sind sinngemäß und natürlich.",
          "Die falschen Freunde werden nicht übernommen.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Falsche Freunde: Übungsrunde",
      instruction: "Wähle die richtige Übersetzung. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "« Je suis actuellement en stage. » heißt: ", options: ["Ich bin zurzeit im Praktikum.", "Ich bin tatsächlich im Praktikum."], answer: 0, after: "", feedback: "Actuellement heißt zurzeit und nicht tatsächlich." },
          { before: "« Il demande l’heure. » heißt: ", options: ["Er fragt nach der Uhrzeit.", "Er verlangt die Uhrzeit."], answer: 0, after: "", feedback: "Demander heißt fragen oder bitten, nicht verlangen." },
          { before: "« Nous restons ici. » heißt: ", options: ["Wir bleiben hier.", "Wir rasten hier."], answer: 0, after: "", feedback: "Rester heißt bleiben und nicht ausruhen oder rasten." },
          { before: "« Il a de la chance. » heißt: ", options: ["Er hat Glück.", "Er hat Chancen."], answer: 0, after: "", feedback: "La chance heißt Glück und nicht Chance oder Möglichkeit." },
          { before: "« J’ai faim. » heißt: ", options: ["Ich habe Hunger.", "Ich bin Hunger."], answer: 0, after: "", feedback: "Avoir faim heißt Hunger haben." },
          { before: "« Il y a du pain. » heißt: ", options: ["Es gibt Brot.", "Er ist Brot."], answer: 0, after: "", feedback: "Il y a heißt es gibt und nicht er ist." },
          { before: "« Il fait chaud. » heißt: ", options: ["Es ist warm.", "Er macht warm."], answer: 0, after: "", feedback: "Il fait chaud ist ein Wetterausdruck." },
          { before: "« Elle fait du sport. » heißt: ", options: ["Sie treibt Sport.", "Sie macht Sport."], answer: 0, after: "", feedback: "Faire du sport heißt Sport treiben." },
        ],
        2: [
          { before: "Im Text steht: « Mon frère assiste à un match de foot dans le gymnase de l’école. » Übersetzung: ", options: ["Mein Bruder schaut ein Fußballspiel in der Turnhalle der Schule an.", "Mein Bruder assistiert einem Fußballspiel im Gymnasium der Schule.", "Mein Bruder besucht ein Spiel im Gymnastikraum der Schule."], answer: 0, after: "", feedback: "Assister à heißt teilnehmen oder anschauen, und gymnase ist die Turnhalle." },
          { before: "Im Text steht: « Actuellement, nous cherchons un stagiaire pour l’été. » Übersetzung: ", options: ["Zurzeit suchen wir einen Praktikanten für den Sommer.", "Tatsächlich suchen wir einen Praktikanten für den Sommer.", "Aktuell finden wir einen Praktikanten für den Sommer."], answer: 0, after: "", feedback: "Actuellement heißt zurzeit, und chercher heißt suchen." },
          { before: "Im Text steht: « Elle demande à son professeur de répéter la question. » Übersetzung: ", options: ["Sie bittet ihren Lehrer, die Frage zu wiederholen.", "Sie verlangt von ihrem Lehrer die Frage zu wiederholen.", "Sie fragt, ob ihr Lehrer eine Frage hat."], answer: 0, after: "", feedback: "Demander à quelqu’un de + Infinitiv heißt bitten." },
          { before: "Im Text steht: « Il prend une décision importante pour son avenir. » Übersetzung: ", options: ["Er trifft eine wichtige Entscheidung für seine Zukunft.", "Er nimmt eine wichtige Entscheidung für seine Zukunft.", "Er greift eine wichtige Entscheidung für seine Zukunft."], answer: 0, after: "", feedback: "Prendre une décision heißt eine Entscheidung treffen." },
          { before: "Im Text steht: « Ça fait trois ans qu’il apprend le français à l’école. » Übersetzung: ", options: ["Er lernt seit drei Jahren Französisch in der Schule.", "Das macht drei Jahre, dass er Französisch in der Schule lernt.", "Es tut drei Jahre, dass er Französisch lernt."], answer: 0, after: "", feedback: "Die Wendung ça fait … que heißt seit, nicht das macht." },
          { before: "Im Text steht: « Elle a de la chance, car il fait beau ce week-end. » Übersetzung: ", options: ["Sie hat Glück, denn am Wochenende ist schönes Wetter.", "Sie hat eine Chance, denn er macht am Wochenende schön.", "Sie hat Chancen, weil sie schön macht am Wochenende."], answer: 0, after: "", feedback: "La chance heißt Glück, und il fait beau beschreibt das Wetter." },
          { before: "Im Text steht: « Le chef de cuisine prépare un repas pour vingt personnes. » Übersetzung: ", options: ["Der Küchenchef bereitet ein Essen für zwanzig Personen zu.", "Der Chef der Küche setzt ein Essen für zwanzig Personen an.", "Der Küchenchef rastet ein Essen für zwanzig Personen."], answer: 0, after: "", feedback: "Le chef de cuisine ist der Küchenchef, préparer heißt zubereiten." },
          { before: "Im Text steht: « Nous restons à Paris pendant une semaine pour visiter les musées. » Übersetzung: ", options: ["Wir bleiben eine Woche in Paris, um Museen zu besuchen.", "Wir rasten eine Woche in Paris, um Museen zu besuchen.", "Wir ruhen in Paris eine Woche, damit wir Museen besuchen."], answer: 0, after: "", feedback: "Rester heißt bleiben, und pour + Infinitiv heißt um zu." },
        ],
      },
    },
  },
  {
    id: "fr-sprachmittler-alltag",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.13"],
    title: "Als Sprachmittler im Alltag und auf Reisen",
    intro:
      "Auf Reisen vermittelst du zwischen Deutsch und Französisch. Bei Verständnisproblemen helfen Nachfragen, Umschreibungen und kurze Zusammenfassungen.",
    paragraphs: [
      "Als Sprachmittler stehst du zwischen zwei Menschen, die sich nicht direkt verstehen: zum Beispiel am Bahnhof, im Restaurant, in der Gastfamilie oder beim Schüleraustausch. Du hörst, was die eine Person sagt, und gibst den Inhalt der anderen in ihrer Sprache wieder. Du übersetzt nicht jedes Wort, sondern sagst, was die andere Seite wissen muss.",
      "Gute Sprachmittler sprechen die Person direkt an (« Elle dit que le train part à dix heures. » oder im Deutschen: „Sie sagt, der Zug fährt um zehn Uhr“), halten sich kurz und achten auf Zahlen, Zeiten und Bedingungen. Wenn etwas unklar ist, fragen sie nach: « Pardon, pouvez-vous répéter plus lentement, s’il vous plaît? », « Qu’est-ce que ça veut dire, « consigne »? », « Je ne comprends pas. »",
      "Wenn dir ein Wort fehlt, wendest du **Kompensationsstrategien** an: Umschreiben (« C’est un truc pour acheter un billet »), ein Synonym oder Gegenteil (« C’est le contraire de arrivée »), einen Oberbegriff (« un fruit »), Gestik oder Zeigen. Mit diesen Strategien hältst du das Gespräch am Laufen, auch wenn der Wortschatz nicht reicht.",
      "Typische Fehler sind, zu lange zu zögern, jedes Wort zu übersetzen oder eigene Meinungen einzufügen. Bleib sachlich und höflich, nutze s’il vous plaît, merci und pardon, und fasse am Ende die wichtigsten Punkte zusammen: « Alors, le train part à dix heures du quai trois. »",
    ],
    terms: [
      { term: "Sprachmittler", text: "Eine Person, die zwischen zwei Sprachen vermittelt und sinngemäß wiedergibt, was die andere Seite wissen muss." },
      { term: "Kompensationsstrategie", text: "Eine Hilfe, wenn ein Wort fehlt: umschreiben, ein Synonym oder Gegenteil nennen, nachfragen, Gesten benutzen." },
      { term: "Nachfragen", text: "Mit Pardon, pouvez-vous répéter? oder Qu’est-ce que ça veut dire? klärst du Unverstandenes." },
    ],
    takeaway:
      "Als Sprachmittler gibst du das Wesentliche kurz und in der Sprache des Gegenübers wieder. Bei Problemen fragst du nach, umschreibst oder nutzt Synonyme. Zahlen, Zeiten und Bedingungen sind besonders wichtig.",
    sourceIds: ["lp", "dfjw", "lepointdufle"],
    quiz: {
      question: "Wie bittest du höflich um eine Wiederholung?",
      answer: "Pardon, pouvez-vous répéter, s’il vous plaît?",
      wrong: ["Quoi? Répète encore une fois!", "Je ne veux pas comprendre cette phrase du tout."],
      explanation:
        "Pardon und s’il vous plaît machen die Bitte höflich. Die beiden anderen Äußerungen sind unhöflich oder unsinnig.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Strategie ist das?",
      instruction: "Ordne jede Äußerung der Strategie zu, die der Sprachmittler verwendet.",
      categories: ["Nachfragen", "Umschreiben", "Für den Partner zusammenfassen"],
      entries: [
        { text: "Pardon, pouvez-vous répéter plus lentement, s’il vous plaît?", target: 0, feedback: "Er bittet höflich um eine langsamere Wiederholung." },
        { text: "C’est un truc pour acheter un billet, comme une machine.", target: 1, feedback: "Er umschreibt das fehlende Wort über die Funktion." },
        { text: "Sie sagt, dass der Zug um zehn Uhr fährt und dass das Gleis drei ist.", target: 2, feedback: "Er gibt auf Deutsch kurz die wichtigen Informationen wieder." },
        { text: "Qu’est-ce que cela veut dire, « consigne »?", target: 0, feedback: "Er fragt nach der Bedeutung eines Wortes." },
        { text: "C’est le contraire de « arrivée ».", target: 1, feedback: "Er nennt ein Gegenteil, um das gemeinte Wort zu erklären." },
        { text: "Er sagt, wir müssen das Ticket vor der Fahrt entwerten.", target: 2, feedback: "Er fasst die Auskunft für seine Begleiter auf Deutsch zusammen." },
      ],
      conclusion: "Nachfragen, Umschreiben und Zusammenfassen sind die Werkzeuge des Sprachmittlers.",
    },
    casework: {
      title: "Am Bahnhof in Lyon",
      story:
        "Deine Mutter möchte nach Paris fahren und spricht kein Französisch. Der Mann am Schalter sagt: « Le prochain train pour Paris part à dix heures vingt du quai trois. Il faut composter le billet avant de monter. »",
      steps: [
        {
          question: "Was sagst du deiner Mutter?",
          options: ["Zug um 10:20 Uhr von Gleis 3.", "Der Mann am Schalter ist sehr höflich.", "Es gibt viele Züge nach Paris am Tag."],
          answer: 0,
          explanation: "Uhrzeit und Gleis sind die wichtigen Informationen.",
        },
        {
          question: "Was musst du noch weitergeben?",
          options: ["Man muss das Ticket entwerten.", "Man darf im Zug nicht rauchen.", "Man darf im Zug nicht sprechen."],
          answer: 0,
          explanation: "Composter le billet heißt, das Ticket zu entwerten, und das ist eine wichtige Bedingung.",
        },
        {
          question: "Was machst du, wenn du « composter » nicht kennst?",
          options: ["Ich frage höflich nach.", "Ich übersetze irgendetwas Passendes.", "Ich lasse den ganzen Satz einfach weg."],
          answer: 0,
          explanation: "Nachfragen ist eine zuverlässige Strategie, damit nichts falsch weitergegeben wird.",
        },
      ],
      verdict:
        "Mit Uhrzeit, Gleis und Bedingung gibst du das Wesentliche weiter. Bei einem unbekannten Wort fragst du nach, bevor du etwas falsch übermittelst.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe einen kurzen Dialog (vier Zeilen) am Bahnhof: Du fragst nach einem Zug, bittest um Wiederholung und gibst die Auskunft auf Deutsch weiter.",
        hints: [
          "Nutze « Pardon, pouvez-vous répéter ? ».",
          "Nenne in der deutschen Zeile Zeit und Gleis.",
        ],
        model:
          "– Pardon, madame, à quelle heure part le train pour Lyon? – À onze heures dix, quai deux. – Pardon, pouvez-vous répéter, s’il vous plaît? – À onze heures dix, quai deux. Auf Deutsch: Der Zug nach Lyon fährt um 11:10 Uhr von Gleis 2.",
        criteria: [
          "Die Frage und die Bitte um Wiederholung sind höflich formuliert.",
          "Die deutsche Zusammenfassung enthält Zeit und Gleis.",
          "Der Dialog ist sinnvoll aufgebaut.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Dialog von acht bis zehn Zeilen: Deine Eltern möchten in einem französischen Restaurant essen, du vermittelst zwischen ihnen und dem Kellner. Verwende Nachfragen, Umschreibungen und kurze deutsche Zusammenfassungen.",
        hints: [
          "Der Kellner nennt Menü und Preis, du gibst das auf Deutsch weiter.",
          "Wenn dir ein Wort fehlt, umschreibe es.",
        ],
        model:
          "– Bonsoir, vous avez choisi? – Pardon, qu’est-ce que c’est, « le plat du jour »? – C’est le menu du jour, avec du poulet et des légumes pour dix euros. Auf Deutsch: Das Tagesgericht ist Hähnchen mit Gemüse für zehn Euro. – Mes parents veulent de l’eau. – Une carafe ou une bouteille? Auf Deutsch: Eine Karaffe oder eine Flasche? – Une carafe, s’il vous plaît. – Très bien.",
        criteria: [
          "Nachfragen, Umschreiben oder Zusammenfassen kommen vor.",
          "Die deutschen Zusammenfassungen enthalten die wichtigen Angaben.",
          "Der Dialog ist höflich und verständlich.",
        ],
      },
    },
  },
];
