import type { Lesson } from "../model/types";

/**
 * Stufe 1, zweiter Teil: Schreiben und Sprachmittlung (Kompetenzerwartungen 1.1.7 bis 1.1.14):
 * Rechtschreibung, Strukturwörter und komplexe Sätze, längere Texte für Forum, Schülerzeitung und
 * Reisebericht, Stellungnahme, Wiedergabe auf Deutsch, Übersetzen und Sprachmittlung in Problemsituationen.
 */
export const S1B: Lesson[] = [
  {
    id: "fr-rechtschreibung",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.7"],
    title: "Rechtschreibung: Akzente, Angleichung und gleich klingende Wörter",
    intro:
      "Viele französische Fehler hört man nicht, man sieht sie nur: Akzente, stumme Endungen und Wörter, die gleich klingen.",
    paragraphs: [
      "Französisch schreibt viel, was man nicht hört. Deshalb prüfst du deine Texte gezielt. **Akzente** verändern Aussprache und Bedeutung: é (été, café), è (père, très), ê (fête, être), à als Präposition (à Paris), où als Fragewort (Où habites-tu?), ç vor a, o, u (français, ça, reçu). Ein fehlender Akzent ist ein Fehler, auch wenn man das Wort versteht.",
      "**Angleichung** heißt, dass Endungen zum Bezugswort passen. Adjektive richten sich nach dem Nomen: une amie sérieuse, des projets intéressants. Das Partizip nach être richtet sich nach dem Subjekt: Elles sont parties. Die Verbendung -ent der 3. Person Plural ist stumm: ils parlent, elles travaillent. Bei Verben auf -er hört man oft nicht, ob -er, -é oder -ez gemeint ist.",
      "Die häufigsten Fehler sind **gleich klingende Wörter**: a (il a, Verb avoir) und à (Präposition), ou (oder) und où (wo), et (und) und est (il est), son (sein) und sont (ils sont), ces (diese) und ses (seine), ce (dieses) und se (sich). Ein Trick: Ersetze das Wort in Gedanken. Passt avait statt a, ist es das Verb; passt étaient statt sont, ist es das Verb.",
      "Für -er, -é oder -ez hilft der Ersatz durch ein Verb wie vendre: « Je vais acheter » → je vais vendre (Infinitiv -er); « J’ai acheté » → j’ai vendu (Partizip -é). Lies deinen Text am Ende einmal nur auf Akzente, einmal nur auf Endungen. Ein **Fehlerprotokoll** zeigt dir, welche Fehler du immer wieder machst; mehr dazu in der Lektion zum Fehlerprotokoll.",
    ],
    terms: [
      { term: "Akzent", text: "Zeichen über einem Buchstaben, das Aussprache oder Bedeutung ändert: é, è, ê, à, où, ç." },
      { term: "Angleichung", text: "Die Endung passt sich dem Bezugswort an: Adjektiv an das Nomen, Partizip nach être an das Subjekt." },
      { term: "Homophone", text: "Wörter, die gleich klingen und anders geschrieben werden: a und à, et und est, son und sont." },
      { term: "Ersatzprobe", text: "Ein Wort in Gedanken ersetzen, um die Schreibung zu prüfen: a → avait, sont → étaient, -er → vendre." },
    ],
    takeaway:
      "Prüfe drei Dinge: Akzente (é, è, ê, à, où, ç), Angleichung (Adjektiv, Partizip nach être, stummes -ent) und gleich klingende Wörter mit der Ersatzprobe (a → avait, et → et puis, sont → étaient, -er → vendre).",
    sourceIds: ["lp", "larousse", "lingolia"],
    quiz: {
      question: "Welcher Satz ist richtig geschrieben?",
      answer: "Où est-ce qu’elles sont allées à midi?",
      wrong: ["Ou est-ce qu’elles sont allé a midi?", "Où est-ce qu’elles son allées à midi?"],
      explanation:
        "Où als Fragewort hat einen Akzent, sont ist das Verb (ils sont), allées ist an das weibliche Plural-Subjekt angeglichen, und à ist die Präposition.",
    },
    workshop: {
      kind: "choose",
      title: "Gleich klingende Wörter unterscheiden",
      instruction: "Wähle die richtige Schreibung. Nutze die Ersatzprobe: a → avait, sont → étaient, est → était.",
      items: [
        { before: "Mon frère ", options: ["a", "à"], answer: 0, after: " trouvé un stage dans une banque.", feedback: "Hier passt avait: il avait trouvé. Also das Verb a ohne Akzent." },
        { before: "Je ne sais pas ", options: ["où", "ou"], answer: 0, after: " se trouve la gare.", feedback: "Gefragt ist der Ort: où mit Akzent heißt wo." },
        { before: "Mes cousins ", options: ["sont", "son"], answer: 0, after: " venus de Lyon pour le week-end.", feedback: "Hier passt étaient: mes cousins étaient venus. Also das Verb sont." },
        { before: "Elle ", options: ["est", "et"], answer: 0, after: " très fière de son diplôme.", feedback: "Hier passt était: elle était fière. Also est, das Verb être." },
        { before: "Il range ", options: ["ses", "ces", "c’est"], answer: 0, after: " affaires dans son sac.", feedback: "Es sind seine Sachen: ses ist der Possessivbegleiter für den Plural." },
        { before: "Nous allons ", options: ["visiter", "visité", "visitez"], answer: 0, after: " le musée demain.", feedback: "Nach aller steht der Infinitiv; die Ersatzprobe vendre (nous allons vendre) bestätigt -er." },
      ],
      conclusion: "Mit der Ersatzprobe entscheidest du sicher zwischen a und à, sont und son, est und et, -er und -é.",
    },
    casework: {
      title: "Eine E-Mail vor dem Abschicken prüfen",
      story:
        "Jonas schreibt an seine Gastfamilie: « Merci pour le séjour! Les journées a Nantes étaient super. Ma sœur et moi, nous sommes rentrés lundi. Mes parents son très contents et ils vous remercient. »",
      steps: [
        {
          question: "Was ist an « a Nantes » falsch?",
          options: ["Die Präposition braucht einen Akzent: à.", "Nantes muss hier kleingeschrieben werden.", "Vor Städten steht immer en."],
          answer: 0,
          explanation: "Die Ersatzprobe avait passt nicht, also ist es die Präposition à. Vor Städten steht à, nicht en.",
        },
        {
          question: "Warum ist « nous sommes rentrés » richtig?",
          options: ["Mit être wird an das Subjekt angeglichen.", "Rentrer wird immer mit -és geschrieben.", "Nach nous steht nie ein Partizip im Plural."],
          answer: 0,
          explanation: "Rentrer bildet das passé composé mit être, das Partizip passt sich an nous (Jonas und seine Schwester) an.",
        },
        {
          question: "Wie korrigierst du « Mes parents son très contents »?",
          options: ["sont, weil hier étaient passen würde.", "sons, weil das Subjekt im Plural steht.", "son bleibt, weil es nach Mes steht."],
          answer: 0,
          explanation: "Die Ersatzprobe mes parents étaient zeigt das Verb être: sont.",
        },
      ],
      verdict:
        "Zwei Fehler, die man nicht hört: à und sont. Die Ersatzprobe findet beide, die Angleichung bei rentrés war richtig.",
    },
    tasks: {
      1: {
        prompt:
          "Korrigiere die drei Fehler und erkläre jede Korrektur kurz auf Deutsch: « Ma cousine a commencé sont apprentissage ou Lyon et elle et très contente. »",
        hints: ["Prüfe sont, ou und et mit der Ersatzprobe.", "Frage dich bei jedem Wort: Verb, Begleiter oder Präposition?"],
        model:
          "Richtig: « Ma cousine a commencé son apprentissage à Lyon et elle est très contente. » 1. son statt sont: Es ist ihre Lehre, ein Possessivbegleiter, kein Verb. 2. à statt ou: Vor einer Stadt steht die Präposition à. 3. est statt et: Hier passt était, also das Verb être.",
        criteria: ["Alle drei Fehler sind gefunden.", "Die Korrekturen sind richtig.", "Jede Korrektur ist kurz begründet."],
      },
      2: {
        prompt:
          "Schreibe fünf französische Sätze über dein Wochenende, in denen je ein Paar vorkommt: a und à, et und est, son und sont, ou und où, -er und -é. Markiere danach selbst, welches Wort welches ist, und begründe mit der Ersatzprobe.",
        hints: ["Schreibe kurze, klare Sätze.", "Prüfe jedes Paar am Ende einzeln."],
        model:
          "1. Samedi, mon père a conduit ma sœur à la gare (a → avait, à = Präposition). 2. Mon ami est venu et nous avons joué aux cartes (est → était, et = und). 3. Mes voisins sont partis avec son chien (sont → étaient, son = sein). 4. On ne savait pas où aller: au cinéma ou au parc? (où = wo, ou = oder). 5. Je vais regarder le film que tu as regardé (-er → vendre, -é → vendu).",
        criteria: ["Jedes Paar kommt richtig vor.", "Die Ersatzprobe ist für jedes Paar angegeben.", "Die Sätze sind auch sonst richtig."],
      },
    },
    practice: {
      kind: "choose",
      title: "Rechtschreibung: Übungsrunde",
      instruction: "Wähle die richtige Schreibung. Eine Runde zählt, wenn alle drei Sätze richtig sind.",
      pool: {
        1: [
          { before: "Il ", options: ["a", "à"], answer: 0, after: " trois sœurs.", feedback: "Ersatzprobe: il avait trois sœurs. Also das Verb a." },
          { before: "Je vais ", options: ["à", "a"], answer: 0, after: " Marseille.", feedback: "Vor einer Stadt steht die Präposition à." },
          { before: "Tu veux du thé ", options: ["ou", "où"], answer: 0, after: " du café?", feedback: "Hier heißt es oder: ou ohne Akzent." },
          { before: "Elles ", options: ["sont", "son"], answer: 0, after: " en retard.", feedback: "Ersatzprobe: elles étaient en retard. Also sont." },
          { before: "Léa ", options: ["est", "et"], answer: 0, after: " malade.", feedback: "Ersatzprobe: Léa était malade. Also est." },
          { before: "Il aime ", options: ["son", "sont"], answer: 0, after: " travail.", feedback: "Sein Beruf: der Possessivbegleiter son." },
          { before: "J’ai ", options: ["mangé", "manger"], answer: 0, after: " une crêpe.", feedback: "Nach j’ai steht das Partizip: j’ai vendu, also -é." },
          { before: "C’est un garçon très ", options: ["français", "francais"], answer: 0, after: " et très drôle.", feedback: "Vor a steht ç, damit das c weich bleibt: français." },
        ],
        2: [
          { before: "Quand elle ", options: ["a", "à", "as"], answer: 0, after: " reçu la lettre de l’entreprise, elle a tout de suite appelé sa mère.", feedback: "Ersatzprobe: quand elle avait reçu. Also das Verb a." },
          { before: "Nous ne savons pas encore ", options: ["où", "ou", "d’où"], answer: 0, after: " nous allons passer nos vacances cet été avec les cousins.", feedback: "Gefragt ist der Ort: où mit Akzent." },
          { before: "Mes amies sont ", options: ["parties", "parti", "partis"], answer: 0, after: " très tôt ce matin pour aller voir le match à Lyon.", feedback: "Partir bildet das passé composé mit être; mes amies ist weiblich Plural: parties." },
          { before: "Les élèves de la classe ", options: ["travaillent", "travaille", "travaillant"], answer: 0, after: " depuis trois semaines sur un projet pour la fête de l’école.", feedback: "Subjekt im Plural (les élèves): stumme Endung -ent." },
          { before: "Il a oublié ", options: ["ses", "ces", "c’est"], answer: 0, after: " clés chez sa grand-mère et il a dû retourner la chercher.", feedback: "Seine Schlüssel: der Possessivbegleiter ses." },
          { before: "Après le cours, nous voulons ", options: ["aller", "allé", "allez"], answer: 0, after: " au centre-ville pour acheter un cadeau pour notre professeur.", feedback: "Nach vouloir steht der Infinitiv: Ersatzprobe nous voulons vendre." },
          { before: "Ma mère ", options: ["s’est", "c’est", "ces"], answer: 0, after: " levée à cinq heures pour préparer le repas de la fête de famille.", feedback: "Se lever ist reflexiv: elle s’est levée. C’est wäre „das ist“." },
          { before: "Les résultats de l’examen ont été très ", options: ["décevants", "décevant", "décevante"], answer: 0, after: " pour toute la classe, mais personne n’a abandonné.", feedback: "Das Adjektiv passt sich an les résultats an: männlich Plural, décevants." },
        ],
      },
    },
  },
  {
    id: "fr-strukturwoerter",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.8"],
    title: "Strukturwörter und komplexe Sätze",
    intro:
      "Mit d’un côté … de l’autre, de plus, d’ailleurs und en conclusion verbindest du Gedanken zu einem zusammenhängenden Text.",
    paragraphs: [
      "**Strukturwörter** (mots de liaison) zeigen, wie Gedanken zusammenhängen. Sie machen aus einzelnen Sätzen einen **kohärenten Text**. Für eine Aufzählung: d’abord, ensuite, de plus (außerdem), enfin. Für einen Gegensatz: mais, par contre, pourtant (trotzdem), cependant (jedoch). Zum Abwägen: **d’un côté … de l’autre** (einerseits … andererseits). Für einen Grund: parce que, car, comme (am Satzanfang). Für eine Folge: donc, c’est pourquoi, alors.",
      "**D’ailleurs** heißt „übrigens, im Übrigen“ und fügt einen Gedanken hinzu, der die Aussage stützt: « Le vélo est rapide en ville. D’ailleurs, beaucoup de mes amis l’utilisent. » **En conclusion** (abschließend) leitet den Schluss ein, ebenso pour conclure. **De plus** fügt ein weiteres Argument an: « De plus, c’est bon pour la santé. »",
      "**Komplexe Sätze** entstehen, wenn du Hauptsatz und Nebensatz verbindest. Du kennst schon Relativsätze (qui, que, où, ce qui, ce que), si-Sätze (« Si j’avais le temps, je ferais du sport. ») und die indirekte Rede (« Il dit qu’il viendra demain. »). Statt drei kurzer Sätze schreibst du einen: « J’ai un ami. Il habite à Lyon. Je le vois souvent. » wird zu « J’ai un ami qui habite à Lyon et que je vois souvent. »",
      "Typische Fehler: dasselbe Strukturwort immer wieder (et … et … et), ein Strukturwort, das nicht zur Beziehung passt (donc für einen Gegensatz), oder ein fehlendes Komma nach einem Strukturwort am Satzanfang. Im Französischen steht nach d’abord, de plus, d’ailleurs, par contre und en conclusion am Satzanfang meist ein Komma.",
    ],
    terms: [
      { term: "d’un côté … de l’autre", text: "Einerseits … andererseits. Damit wägst du zwei Seiten einer Frage ab." },
      { term: "d’ailleurs", text: "Übrigens, im Übrigen. Fügt einen Gedanken hinzu, der die Aussage stützt." },
      { term: "de plus", text: "Außerdem. Fügt ein weiteres Argument in dieselbe Richtung an." },
      { term: "en conclusion", text: "Abschließend, zum Schluss. Leitet die Zusammenfassung am Ende eines Textes ein." },
    ],
    takeaway:
      "Strukturwörter zeigen die Beziehung: Aufzählung (d’abord, de plus, enfin), Gegensatz (mais, par contre, pourtant), Abwägen (d’un côté … de l’autre), Stütze (d’ailleurs), Folge (donc, c’est pourquoi), Schluss (en conclusion). Komplexe Sätze verbinden mit qui, que, si und indirekter Rede.",
    sourceIds: ["lp", "lingolia", "lepointdufle"],
    quiz: {
      question: "Welches Strukturwort verbindet « Le train est cher. » und « Il est souvent en retard. » am besten?",
      answer: "De plus",
      wrong: ["Par contre", "En conclusion"],
      explanation:
        "Der zweite Satz fügt ein weiteres Argument gegen den Zug hinzu: de plus. Par contre würde einen Gegensatz einleiten, en conclusion den Schluss.",
    },
    workshop: {
      kind: "choose",
      title: "Das passende Strukturwort wählen",
      instruction: "Lies jeden Satz und überlege, welche Beziehung besteht: weiteres Argument, Gegensatz, Abwägen, Stütze, Folge oder Schluss.",
      items: [
        { before: "", options: ["D’un côté", "D’ailleurs", "Donc"], answer: 0, after: ", les réseaux sociaux nous informent, de l’autre, ils nous font perdre du temps.", feedback: "Zwei Seiten werden abgewogen: d’un côté … de l’autre." },
        { before: "Il pleuvait beaucoup. ", options: ["Pourtant", "De plus", "D’ailleurs"], answer: 0, after: ", nous sommes allés à la plage.", feedback: "Trotz des Regens: ein Gegensatz, pourtant heißt trotzdem." },
        { before: "Les transports publics sont pratiques. ", options: ["D’ailleurs", "Par contre", "Pourtant"], answer: 0, after: ", la plupart de mes amis prennent le bus.", feedback: "Der zweite Satz stützt die Aussage: d’ailleurs." },
        { before: "J’ai raté le bus, ", options: ["c’est pourquoi", "par contre", "d’un côté"], answer: 0, after: " je suis arrivé en retard.", feedback: "Die Verspätung ist die Folge: c’est pourquoi." },
        { before: "", options: ["En conclusion", "D’abord", "De plus"], answer: 0, after: ", je pense que l’uniforme scolaire n’est pas une bonne idée.", feedback: "Hier wird das Ergebnis am Schluss formuliert: en conclusion." },
      ],
      conclusion: "Erst die Beziehung bestimmen, dann das Strukturwort wählen: So wird der Text zusammenhängend und logisch.",
    },
    casework: {
      title: "Einen Absatz verbessern",
      story:
        "Lina schreibt für die Schülerzeitung: « Le collège veut interdire les portables. C’est une bonne idée. Les élèves se parlent plus. Les élèves ont besoin du portable pour les urgences. Je suis plutôt pour l’interdiction. »",
      steps: [
        {
          question: "Wie verbindest du die Sätze 2 und 3 am besten?",
          options: ["C’est une bonne idée, car les élèves se parlent plus.", "C’est une bonne idée, donc les élèves se parlent plus.", "C’est une bonne idée, pourtant les élèves se parlent plus."],
          answer: 0,
          explanation: "Satz 3 begründet Satz 2: car. Donc würde eine Folge behaupten, pourtant einen Gegensatz.",
        },
        {
          question: "Welches Strukturwort leitet den Einwand mit den Notfällen ein?",
          options: ["Par contre", "De plus", "D’ailleurs"],
          answer: 0,
          explanation: "Die Notfälle sprechen gegen das Verbot: ein Gegensatz, also par contre.",
        },
        {
          question: "Wie beginnt der Schlusssatz am besten?",
          options: ["En conclusion, je suis plutôt pour l’interdiction.", "D’abord, je suis plutôt pour l’interdiction.", "De plus, je suis plutôt pour l’interdiction."],
          answer: 0,
          explanation: "En conclusion zeigt, dass hier das Ergebnis der Abwägung steht.",
        },
      ],
      verdict:
        "Mit car, par contre und en conclusion wird aus fünf losen Sätzen ein Absatz, der begründet, abwägt und zu einem Ergebnis kommt.",
    },
    tasks: {
      1: {
        prompt:
          "Verbinde die Sätze auf Französisch mit einem passenden Strukturwort oder zu einem komplexen Satz: 1. J’ai une tante. Elle habite à Genève. 2. Le stage était fatigant. J’ai beaucoup appris. 3. Il n’a pas révisé. Il a raté l’examen.",
        hints: ["Bei 1 hilft ein Relativsatz mit qui.", "Bei 2 brauchst du einen Gegensatz, bei 3 eine Folge."],
        model:
          "1. J’ai une tante qui habite à Genève. 2. Le stage était fatigant, pourtant j’ai beaucoup appris. 3. Il n’a pas révisé, c’est pourquoi il a raté l’examen. Bei 2 passt auch mais, bei 3 auch donc.",
        criteria: ["Satz 1 ist ein richtiger Relativsatz.", "Satz 2 drückt einen Gegensatz aus.", "Satz 3 drückt eine Folge aus."],
      },
      2: {
        prompt:
          "Schreibe einen Absatz von sechs bis acht Sätzen zum Thema « Faut-il apprendre une deuxième langue étrangère? ». Verwende d’un côté … de l’autre, de plus, d’ailleurs, en conclusion und mindestens einen si-Satz oder Relativsatz.",
        hints: ["Lege dir zuerst je zwei Argumente dafür und dagegen fest.", "Prüfe, ob jedes Strukturwort zur Beziehung passt."],
        model:
          "Beaucoup d’élèves se demandent s’il faut apprendre une deuxième langue étrangère. D’un côté, c’est beaucoup de travail, de l’autre, cela ouvre des portes. Une langue qu’on parle bien est un avantage pour trouver un travail. De plus, on peut communiquer pendant les vacances. D’ailleurs, beaucoup d’entreprises en Bavière travaillent avec la France. Si je ne parlais pas français, je ne pourrais pas faire mon stage à Lyon. En conclusion, je pense que l’effort en vaut la peine.",
        criteria: ["Alle vier geforderten Strukturwörter sind passend verwendet.", "Ein si-Satz oder Relativsatz ist richtig gebaut.", "Der Absatz wägt ab und kommt zu einem Ergebnis."],
      },
    },
    practice: {
      kind: "choose",
      title: "Strukturwörter: Übungsrunde",
      instruction: "Wähle das Strukturwort, das zur Beziehung zwischen den Gedanken passt. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "J’aime le sport. ", options: ["De plus", "Pourtant"], answer: 0, after: ", je fais de la musique.", feedback: "Eine weitere Vorliebe in dieselbe Richtung: de plus." },
          { before: "Il est malade, ", options: ["donc", "pourtant"], answer: 0, after: " il reste à la maison.", feedback: "Zu Hause bleiben ist die Folge der Krankheit: donc." },
          { before: "Paris est cher. ", options: ["Par contre", "De plus"], answer: 0, after: ", la campagne est moins chère.", feedback: "Ein Gegensatz zwischen Stadt und Land: par contre." },
          { before: "", options: ["D’abord", "En conclusion"], answer: 0, after: ", je vais vous présenter le problème.", feedback: "Am Anfang einer Reihe steht d’abord." },
          { before: "", options: ["En conclusion", "D’abord"], answer: 0, after: ", ce projet est une réussite.", feedback: "Das Ergebnis am Ende: en conclusion." },
          { before: "Je suis fatigué, ", options: ["mais", "donc"], answer: 0, after: " je vais quand même au cours.", feedback: "Trotz der Müdigkeit: ein Gegensatz, mais." },
          { before: "", options: ["Comme", "Donc"], answer: 0, after: " il pleut, nous restons ici.", feedback: "Comme am Satzanfang nennt den Grund." },
          { before: "Le film est long. ", options: ["D’ailleurs", "Par contre"], answer: 0, after: ", il dure trois heures.", feedback: "Der zweite Satz stützt die Aussage mit einem Detail: d’ailleurs." },
        ],
        2: [
          { before: "", options: ["D’un côté", "De plus", "Donc"], answer: 0, after: ", travailler pendant les vacances rapporte de l’argent, de l’autre, on a moins de temps pour se reposer.", feedback: "Zwei Seiten werden gegenübergestellt: d’un côté … de l’autre." },
          { before: "Notre ville a construit de nouvelles pistes cyclables. ", options: ["D’ailleurs", "Pourtant", "Par contre"], answer: 0, after: ", le nombre de cyclistes a beaucoup augmenté cette année.", feedback: "Die zweite Aussage stützt die erste: d’ailleurs." },
          { before: "Les billets pour le concert étaient très chers. ", options: ["Pourtant", "De plus", "C’est pourquoi"], answer: 0, after: ", la salle était pleine et l’ambiance était géniale.", feedback: "Trotz der Preise war der Saal voll: pourtant." },
          { before: "Le stage m’a permis de découvrir le métier de cuisinier. ", options: ["De plus", "Par contre", "Pourtant"], answer: 0, after: ", j’ai pu améliorer mon français avec mes collègues.", feedback: "Ein weiterer Vorteil in dieselbe Richtung: de plus." },
          { before: "Beaucoup de jeunes ne trouvent pas de place d’apprentissage, ", options: ["c’est pourquoi", "d’ailleurs", "par contre"], answer: 0, after: " la région organise un salon des métiers en mars.", feedback: "Die Messe ist die Folge des Problems: c’est pourquoi." },
          { before: "Les avantages et les inconvénients sont nombreux. ", options: ["En conclusion", "D’abord", "De plus"], answer: 0, after: ", je pense que chacun doit décider pour lui-même.", feedback: "Nach der Abwägung kommt das Ergebnis: en conclusion." },
          { before: "Mon correspondant parle très bien allemand. ", options: ["Par contre", "De plus", "D’ailleurs"], answer: 0, after: ", il a encore des difficultés avec l’anglais.", feedback: "Ein Gegensatz zwischen den beiden Sprachen: par contre." },
          { before: "", options: ["Comme", "Donc", "Pourtant"], answer: 0, after: " le musée était fermé le lundi, nous avons visité la cathédrale à la place.", feedback: "Comme am Satzanfang nennt den Grund für die Änderung." },
        ],
      },
    },
  },
  {
    id: "fr-forum-schuelerzeitung",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.9", "1.1.10"],
    title: "Längere Texte für Forum, Schülerzeitung und Reisebericht",
    intro:
      "Ein Forumsbeitrag, ein Artikel und ein Reisebericht haben verschiedene Leser. Du passt Aufbau, Ton und Wortwahl an.",
    paragraphs: [
      "Ein guter Text ist **situations- und adressatengerecht**: Er passt zum Anlass und zu den Lesern. Bevor du schreibst, klärst du: Für wen schreibe ich (Jugendliche, Lehrkräfte, eine Zeitung)? Warum (informieren, erzählen, Meinung sagen)? Welche Textsorte ist verlangt? Daraus folgen Anrede, Ton und Aufbau.",
      "Ein **Beitrag für ein Internetforum** (un message sur un forum) antwortet auf eine Frage oder einen anderen Beitrag. Er duzt meist (Salut tout le monde!), ist persönlich und eher kurz, nennt eine Meinung mit Begründung und endet oft mit einer Frage an die anderen (Et vous, qu’est-ce que vous en pensez?). Ein **Artikel für die Schülerzeitung** (un article pour le journal du collège) hat einen Titel, einen kurzen Einleitungssatz, mehrere Absätze und einen sachlicheren Ton. Er informiert über ein Ereignis oder ein Thema.",
      "Ein **Reisebericht** (un récit de voyage) erzählt in der Vergangenheit, in zeitlicher Reihenfolge, mit Eindrücken und Gefühlen: passé composé für Ereignisse, imparfait für Beschreibungen, dazu Zeitangaben (le premier jour, le lendemain, à la fin du séjour). Am Ende steht oft eine Bewertung oder ein Ausblick (Je reviendrai sûrement!).",
      "Für alle drei gilt: Gliedere in **Absätze**, jeder mit einem Gedanken. Verbinde mit Strukturwörtern. Typische Fehler: ein Forumsbeitrag im Stil eines Geschäftsbriefs, ein Artikel ohne Titel und Absätze, ein Reisebericht als bloße Liste (« Lundi, musée. Mardi, plage. ») ohne Eindrücke.",
    ],
    terms: [
      { term: "adressatengerecht", text: "Passend für die Leser: Anrede, Ton und Wortwahl richten sich danach, wer den Text liest." },
      { term: "message sur un forum", text: "Ein Forumsbeitrag: persönlich, meist geduzt, mit Meinung, Begründung und oft einer Frage an die anderen." },
      { term: "article", text: "Ein Zeitungsartikel mit Titel, Einleitungssatz und Absätzen, eher sachlich im Ton." },
      { term: "récit de voyage", text: "Ein Reisebericht: Erlebnisse in zeitlicher Reihenfolge mit Eindrücken, Gefühlen und Bewertung." },
    ],
    takeaway:
      "Vor dem Schreiben klären: Leser, Absicht, Textsorte. Forum: persönlich, Meinung, Frage an andere. Artikel: Titel, Einleitung, sachliche Absätze. Reisebericht: Reihenfolge, passé composé und imparfait, Eindrücke und Bewertung.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Welcher Satz passt am besten als Ende eines Forumsbeitrags?",
      answer: "Et vous, qu’est-ce que vous en pensez?",
      wrong: ["Veuillez agréer mes salutations distinguées.", "Le lendemain, nous avons visité le château."],
      explanation:
        "Ein Forumsbeitrag lädt oft die anderen zur Antwort ein. Die Grußformel gehört in einen formellen Brief, der Satz mit le lendemain in einen Reisebericht.",
    },
    workshop: {
      kind: "classify",
      title: "Merkmale der richtigen Textsorte zuordnen",
      instruction: "Ordne jeden Satz der Textsorte zu, in die er am besten passt.",
      categories: ["Forumsbeitrag", "Artikel", "Reisebericht"],
      entries: [
        { text: "Salut tout le monde! Moi aussi, j’ai ce problème avec mes parents et le portable.", target: 0, feedback: "Die lockere Anrede und der persönliche Bezug auf andere Beiträge zeigen das Forum." },
        { text: "Vendredi dernier, quarante élèves de notre collège ont participé à la journée de l’environnement.", target: 1, feedback: "Wer, was, wann in sachlichem Ton: der Anfang eines Artikels." },
        { text: "Le deuxième jour, nous avons pris le bateau pour l’île. La mer était magnifique.", target: 2, feedback: "Zeitangabe, Ereignis im passé composé und Eindruck im imparfait: Reisebericht." },
        { text: "Qu’est-ce que vous en pensez? Répondez-moi vite, j’ai besoin de vos conseils!", target: 0, feedback: "Die Frage an die Gemeinschaft beendet typisch einen Forumsbeitrag." },
        { text: "Selon la directrice, le projet sera répété l’année prochaine dans toutes les classes.", target: 1, feedback: "Eine zitierte Quelle und ein Ausblick: Artikel." },
        { text: "À la fin du séjour, j’étais triste de partir, mais je reviendrai sûrement!", target: 2, feedback: "Gefühle am Ende der Reise und ein Ausblick: Reisebericht." },
      ],
      conclusion: "Persönliche Anrede und Fragen an andere: Forum. Fakten, Quellen und sachlicher Ton: Artikel. Zeitfolge mit Eindrücken: Reisebericht.",
    },
    casework: {
      title: "Ein Artikel für die Schülerzeitung",
      story:
        "Deine Klasse hat einen Flohmarkt (un vide-grenier) für ein Tierheim organisiert. Du sollst für die Schülerzeitung eurer Partnerschule in Frankreich darüber schreiben. Deine Notizen: samedi 12 mai, 350 euros, 15 élèves, beaucoup de visiteurs, refuge pour animaux.",
      steps: [
        {
          question: "Welcher Titel passt zu einem Artikel?",
          options: ["Un vide-grenier pour les animaux", "Salut, je m’appelle Paul!", "Mon plus beau voyage en Bretagne"],
          answer: 0,
          explanation: "Ein Artikel hat einen kurzen, informativen Titel zum Thema. Die anderen passen zu Forum und Reisebericht.",
        },
        {
          question: "Was gehört in den ersten Satz?",
          options: ["Wer, was, wann und wofür.", "Eine Frage an die Leser im Forum.", "Wie du dich am Abend gefühlt hast."],
          answer: 0,
          explanation: "Der Einleitungssatz eines Artikels nennt die wichtigsten Fakten. Gefühle können später kommen.",
        },
        {
          question: "Welcher Ton passt für die Partnerschule?",
          options: ["Sachlich, aber freundlich.", "Sehr locker, wie unter Freunden.", "Streng förmlich, wie bei Behörden."],
          answer: 0,
          explanation: "Die Leser sind Schülerinnen und Schüler und Lehrkräfte: ein sachlicher, freundlicher Ton passt.",
        },
      ],
      verdict:
        "Titel, Einleitungssatz mit den Fakten, sachlich-freundlicher Ton: So wird aus den Notizen ein Artikel, den die Partnerschule gern liest.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe einen Forumsbeitrag von vier bis fünf Sätzen als Antwort auf die Frage « Vous faites un job d’été? »: Anrede, deine Erfahrung, deine Meinung mit Grund, Frage an die anderen.",
        hints: ["Beginne locker, zum Beispiel mit Salut à tous!", "Ende mit einer Frage an die anderen."],
        model:
          "Salut à tous! Moi, l’été dernier, j’ai travaillé trois semaines dans un camping au bord du lac. C’était parfois fatigant, mais j’ai rencontré des gens sympas et j’ai gagné de l’argent pour mon permis. À mon avis, un job d’été, c’est une bonne expérience avant de commencer à travailler. Et vous, vous avez déjà travaillé pendant les vacances?",
        criteria: ["Anrede und Frage an die anderen passen zum Forum.", "Erfahrung und Meinung mit Grund sind enthalten.", "Der Ton ist persönlich und locker."],
      },
      2: {
        prompt:
          "Schreibe einen Reisebericht von acht bis zehn Sätzen über eine echte oder erfundene Reise in eine französischsprachige Region für die Website eurer Partnerschule. Erzähle in zeitlicher Reihenfolge, beschreibe Eindrücke und Gefühle und ende mit einer Bewertung.",
        hints: ["Nutze Zeitangaben: le premier jour, le lendemain, à la fin.", "Wechsle zwischen passé composé (Ereignisse) und imparfait (Beschreibung)."],
        model:
          "En juillet, je suis parti une semaine en Belgique avec ma famille. Le premier jour, nous avons visité Bruxelles. La Grand-Place était magnifique et il y avait beaucoup de touristes. Le lendemain, nous avons pris le train pour Bruges, une petite ville avec des canaux. Il faisait chaud, alors nous avons fait une promenade en bateau. Le soir, j’ai goûté les fameuses frites belges: elles étaient délicieuses! À la fin du séjour, j’étais un peu triste de partir. C’était un voyage génial, et je recommande la Belgique à tout le monde.",
        criteria: ["Die Ereignisse folgen einer klaren Zeitfolge.", "Passé composé und imparfait sind passend verwendet.", "Eindrücke, Gefühle und eine Bewertung sind enthalten."],
      },
    },
  },
  {
    id: "fr-stellung-nehmen",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.11"],
    title: "Stellung nehmen: Gründe, Vor- und Nachteile",
    intro:
      "Zu einer Frage von allgemeinem Interesse nennst du Vor- und Nachteile, gewichtest sie und sagst begründet, was du denkst.",
    paragraphs: [
      "Wenn du **Stellung nimmst** (donner son opinion, prendre position), antwortest du auf eine Frage wie « Faut-il porter un uniforme à l’école? » oder « Est-ce que les jeunes doivent faire un stage à l’étranger? ». In einfacher Form gehst du so vor: Frage aufgreifen, Vorteile nennen, Nachteile nennen, eigene Meinung begründen.",
      "Für **Vorteile und Nachteile** brauchst du feste Wendungen: « Un avantage, c’est que … », « Le grand avantage de …, c’est … », « Un inconvénient, c’est que … », « Le problème, c’est que … ». Für deine Haltung: « Je suis pour / contre … parce que … », « Je pense qu’il faut … », « Je ne pense pas qu’il faille … » ist zu schwierig, einfacher ist « Je pense qu’il ne faut pas … ».",
      "Jedes Argument wird stärker durch ein **Beispiel**: « Un avantage de l’uniforme, c’est l’égalité: par exemple, personne ne se moque des vêtements des autres. » Wichtig ist, dass deine Meinung am Ende zu den Argumenten passt. Wenn du mehr Nachteile nennst, kannst du trotzdem dafür sein, aber dann musst du sagen, warum ein Vorteil schwerer wiegt.",
      "Typische Fehler: nur eine Seite nennen, keine Begründung geben (« Je suis contre. Point. ») oder Argumente nur aufzählen, ohne zu sagen, was daraus folgt. Ausführlicher übst du das Abwägen in der Lektion zur Argumentation.",
    ],
    terms: [
      { term: "un avantage", text: "Ein Vorteil. « Un avantage, c’est que … » leitet ein Argument dafür ein." },
      { term: "un inconvénient", text: "Ein Nachteil. « Un inconvénient, c’est que … » leitet ein Argument dagegen ein." },
      { term: "prendre position", text: "Stellung nehmen: zu einer Frage sagen, wofür oder wogegen man ist, und es begründen." },
    ],
    takeaway:
      "Stellung nehmen: Frage aufgreifen, Vorteile (un avantage, c’est que), Nachteile (un inconvénient, c’est que), je ein Beispiel, dann eine begründete Meinung (je suis pour/contre … parce que), die zu den Argumenten passt.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Welcher Satz nennt einen Nachteil des Handys im Unterricht?",
      answer: "Un inconvénient, c’est que les élèves sont distraits.",
      wrong: ["Un avantage, c’est qu’on peut chercher des informations.", "Je suis pour, parce que c’est pratique pour tout le monde."],
      explanation:
        "Un inconvénient leitet einen Nachteil ein: Die Schüler werden abgelenkt. Der zweite Satz nennt einen Vorteil, der dritte eine Meinung dafür.",
    },
    workshop: {
      kind: "classify",
      title: "Argumente zur Schuluniform ordnen",
      instruction: "Ordne jedes Argument zu « l’uniforme à l’école »: Vorteil, Nachteil oder eigene Meinung.",
      categories: ["Vorteil", "Nachteil", "Meinung"],
      entries: [
        { text: "Un avantage, c’est que personne ne se moque des vêtements des autres.", target: 0, feedback: "Ein Argument dafür: Gleichheit unter den Schülern." },
        { text: "Le problème, c’est qu’on ne peut plus montrer sa personnalité.", target: 1, feedback: "Le problème, c’est que leitet einen Nachteil ein." },
        { text: "Personnellement, je suis contre, parce que la liberté est plus importante.", target: 2, feedback: "Personnellement und je suis contre zeigen die eigene Haltung." },
        { text: "De plus, les parents dépensent moins d’argent pour les vêtements de marque.", target: 0, feedback: "Ein weiteres Argument dafür: Die Familien sparen Geld." },
        { text: "Un inconvénient, c’est que l’uniforme coûte cher au début de l’année.", target: 1, feedback: "Un inconvénient leitet einen Nachteil ein: hohe Kosten am Anfang." },
        { text: "À mon avis, il faut laisser chaque école décider avec les élèves.", target: 2, feedback: "À mon avis und eine Forderung: die eigene Meinung." },
      ],
      conclusion: "Erst Vor- und Nachteile sammeln, dann die eigene Meinung so formulieren, dass sie die Argumente aufgreift.",
    },
    casework: {
      title: "Ein Praktikum im Ausland?",
      story:
        "Im Forum eurer Partnerschule steht die Frage: « Un stage à l’étranger après le collège: bonne ou mauvaise idée? » Du willst in einfacher Form Stellung nehmen.",
      steps: [
        {
          question: "Welches Argument ist ein Vorteil?",
          options: ["On améliore une langue étrangère.", "On est loin de sa famille et de ses amis.", "Le voyage et le logement coûtent cher."],
          answer: 0,
          explanation: "Eine Sprache verbessern spricht für das Praktikum. Die anderen sind Nachteile.",
        },
        {
          question: "Wie machst du den Nachteil „Heimweh“ überzeugender?",
          options: ["Mit einem Beispiel aus deinem Umfeld.", "Indem du ihn dreimal wiederholst.", "Indem du ihn ganz ohne Grund nennst."],
          answer: 0,
          explanation: "Ein Beispiel macht ein Argument anschaulich: « Mon cousin est rentré après deux semaines, il avait le mal du pays. »",
        },
        {
          question: "Welcher Schlusssatz passt zu deinen Argumenten?",
          options: ["Je suis pour, car l’expérience compte plus que les difficultés.", "Je suis pour, c’est tout, je n’ai pas besoin de donner de raison.", "Je ne sais pas, c’est compliqué, tant pis pour moi."],
          answer: 0,
          explanation: "Die Meinung ist begründet und sagt, warum der Vorteil schwerer wiegt. Die anderen begründen nichts.",
        },
      ],
      verdict:
        "Vorteil und Nachteil benennen, ein Beispiel geben und die Meinung so begründen, dass sie die Gewichtung zeigt: So überzeugt auch eine kurze Stellungnahme.",
    },
    tasks: {
      1: {
        prompt:
          "Nimm in vier Sätzen Stellung zu « Faut-il interdire les fast-foods près des écoles? »: ein Vorteil, ein Nachteil, deine Meinung, ein Grund.",
        hints: ["Nutze un avantage, c’est que und un inconvénient, c’est que.", "Deine Meinung braucht parce que oder car."],
        model:
          "Un avantage, c’est que les élèves mangeraient plus sainement à la cantine. Un inconvénient, c’est que les jeunes ont moins de liberté. Personnellement, je suis pour l’interdiction près des écoles, parce que la santé des enfants est plus importante que le choix d’un burger.",
        criteria: ["Ein Vorteil und ein Nachteil sind genannt.", "Die Meinung ist begründet.", "Die Wendungen für Vor- und Nachteile sind richtig verwendet."],
      },
      2: {
        prompt:
          "Schreibe eine Stellungnahme von acht bis zehn Sätzen für die Schülerzeitung zu « Les élèves devraient faire un stage dans une association. »: Einleitung, zwei Vorteile mit Beispiel, ein Nachteil, begründete Meinung.",
        hints: ["Greife die Frage in der Einleitung auf.", "Erkläre am Ende, warum deine Seite schwerer wiegt."],
        model:
          "Faut-il obliger les élèves à faire un stage dans une association? La question divise. Un premier avantage, c’est qu’on découvre des réalités qu’on ne connaît pas. Par exemple, aux Restos du Cœur, on rencontre des familles qui ont du mal à se nourrir. De plus, on apprend à travailler en équipe, ce qui sera utile plus tard. Un inconvénient, c’est que les élèves ont déjà beaucoup de travail à l’école. Le problème, c’est aussi que l’engagement forcé n’est pas vraiment un engagement. Personnellement, je suis pour un stage court, parce que l’expérience peut donner envie de s’engager vraiment.",
        criteria: ["Zwei Vorteile mit Beispiel und ein Nachteil sind genannt.", "Die Meinung ist begründet und passt zu den Argumenten.", "Der Text ist in Einleitung, Argumente und Schluss gegliedert."],
      },
    },
  },
  {
    id: "fr-mediation-deutsch",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.12"],
    title: "Französische Texte auf Deutsch sinngemäß wiedergeben",
    intro:
      "Bei der Sprachmittlung gibst du nur wieder, was jemand wissen muss: sinngemäß, zusammengefasst und passend für die Person.",
    paragraphs: [
      "Bei der **Sprachmittlung** (Mediation) gibst du einen französischen Text auf Deutsch wieder, zum Beispiel einen Artikel, eine Informationsbroschüre oder ein Interview. Du übersetzt nicht Wort für Wort, sondern **sinngemäß** und **zusammenfassend**: Du wählst die Informationen aus, die zur Aufgabe passen, und sagst sie in eigenen Worten.",
      "Der wichtigste Schritt ist die **Aufgabe**: Wer will was wissen und warum? Deine Mutter will wissen, was das Ferienprojekt kostet und wann es stattfindet; dein Freund will wissen, ob er ohne gute Französischkenntnisse teilnehmen kann. Markiere im Text nur, was diese Fragen beantwortet. Alles andere lässt du weg, auch wenn es interessant ist.",
      "Unbekannte Wörter erschließt du selbstständig: aus dem Zusammenhang, aus dem Deutschen und Englischen (environnement, bénévole), aus der Wortfamilie (le logement von loger) oder aus Zahlen und Bildern. Wenn ein Wort für die Aufgabe nicht wichtig ist, überspringst du es. **Adressatengerecht** heißt: Für deine kleine Schwester erklärst du einfacher als für deine Lehrerin.",
      "Typische Fehler: den ganzen Text übersetzen, französische Wörter übernehmen, die die Person nicht versteht (« Das ist ein chantier »), oder Informationen hinzuerfinden. Gib Zahlen, Daten und Bedingungen genau wieder. Schreibe vollständige deutsche Sätze, keine Stichwortliste, wenn ein Text verlangt ist.",
    ],
    terms: [
      { term: "Sprachmittlung", text: "Inhalte von einer Sprache in eine andere übertragen, sinngemäß und passend zur Situation, nicht Wort für Wort." },
      { term: "sinngemäß", text: "Dem Sinn nach: Du gibst die Aussage richtig wieder, aber mit eigenen Worten." },
      { term: "adressatengerecht", text: "Passend für die Person, für die du mittelst: Wortwahl, Ausführlichkeit und Ton richten sich nach ihr." },
    ],
    takeaway:
      "Sprachmittlung: Aufgabe lesen (wer will was wissen?), nur passende Informationen markieren, unbekannte Wörter erschließen oder überspringen, auf Deutsch sinngemäß und zusammengefasst wiedergeben. Zahlen und Bedingungen genau.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Deine Mutter fragt nur nach dem Preis eines französischen Sprachkurses. Was tust du?",
      answer: "Ich nenne den Preis und was darin enthalten ist.",
      wrong: ["Ich übersetze die ganze Broschüre Satz für Satz.", "Ich erzähle ihr alles über die Stadt Montpellier."],
      explanation:
        "Bei der Sprachmittlung gibst du nur die gefragte Information wieder, hier Preis und Leistungen. Alles andere lenkt ab.",
    },
    workshop: {
      kind: "mark",
      title: "Die Informationen für deinen Freund markieren",
      instruction:
        "Dein Freund Max will wissen, wann das Projekt stattfindet, was es kostet und welche Bedingungen gelten. Wähle oben ein Etikett und klicke die passenden Stellen an. Was ihn nicht interessiert, bleibt unmarkiert.",
      labels: ["Zeit", "Kosten", "Bedingung"],
      text: [
        { t: "Chantier de jeunes au château de Murol. Depuis vingt ans, notre association restaure ce château du Moyen Âge. Le chantier a lieu " },
        { t: "du 8 au 22 juillet", label: 0, feedback: "Das ist der Zeitraum: vom 8. bis 22. Juli." },
        { t: ". Le matin, vous travaillez sur les murs, l’après-midi est libre. La participation coûte " },
        { t: "180 euros", label: 1, feedback: "Das ist der Preis der Teilnahme." },
        { t: ", " },
        { t: "logement et repas compris", label: 1, feedback: "Wichtig für die Kosten: Unterkunft und Essen sind im Preis enthalten." },
        { t: ". Le château offre une vue magnifique sur les volcans d’Auvergne. Pour participer, il faut " },
        { t: "avoir entre 16 et 18 ans", label: 2, feedback: "Eine Bedingung: das Alter zwischen 16 und 18." },
        { t: " et " },
        { t: "parler un peu français", label: 2, feedback: "Eine zweite Bedingung: ein wenig Französisch sprechen." },
        { t: ". Inscription sur notre site." },
      ],
      conclusion: "Zeit, Kosten mit Leistungen und Bedingungen: Mehr braucht Max nicht. Die Geschichte des Schlosses und die Aussicht lässt du weg.",
    },
    casework: {
      title: "Ein Interview für die Großeltern",
      story:
        "In einer Jugendzeitschrift liest du ein Interview: « Lucie, 17 ans, est pompière volontaire. “Je fais des gardes deux week-ends par mois. Au début, ma mère avait peur. Maintenant, elle est fière. Pour devenir pompier volontaire, il faut avoir 16 ans et suivre une formation.” » Dein Opa war früher bei der freiwilligen Feuerwehr und fragt, was da steht.",
      steps: [
        {
          question: "Womit beginnst du deine Wiedergabe?",
          options: ["Mit dem Thema: eine junge Feuerwehrfrau.", "Mit dem ersten Wort des Textes: Lucie.", "Mit der Übersetzung der Überschrift."],
          answer: 0,
          explanation: "Ein kurzer Satz zum Thema hilft dem Zuhörer, alles Weitere einzuordnen.",
        },
        {
          question: "Wie gibst du « deux week-ends par mois » wieder?",
          options: ["Sie hat zwei Wochenenden im Monat Dienst.", "Sie arbeitet an zwei Wochenenden im Jahr.", "Sie hat jedes Wochenende Dienst."],
          answer: 0,
          explanation: "Par mois heißt pro Monat. Zahlen und Zeitangaben gibst du genau wieder.",
        },
        {
          question: "Was ist für deinen Opa wohl besonders interessant?",
          options: ["Die Voraussetzungen: 16 Jahre und eine Ausbildung.", "Wie alt die Zeitschrift ist und wer sie herausgibt.", "Wie das französische Wort für Garde lautet."],
          answer: 0,
          explanation: "Weil er selbst bei der Feuerwehr war, interessieren ihn die Bedingungen in Frankreich. Das ist adressatengerecht.",
        },
      ],
      verdict:
        "Thema zuerst, Zahlen genau, und das auswählen, was den Zuhörer interessiert: So wird aus dem Interview eine gute Wiedergabe für den Opa.",
    },
    tasks: {
      1: {
        prompt:
          "Gib auf Deutsch in zwei bis drei Sätzen wieder, was deine Mutter über die Öffnungszeiten wissen muss: « Le musée est ouvert tous les jours de 10 h à 18 h, sauf le lundi. Le jeudi, il ferme à 21 h. L’entrée est gratuite le premier dimanche du mois. »",
        hints: ["Nenne zuerst die normale Öffnungszeit, dann die Ausnahmen.", "Sauf heißt außer."],
        model:
          "Das Museum ist täglich von 10 bis 18 Uhr geöffnet, außer montags, da ist es geschlossen. Donnerstags hat es länger offen, bis 21 Uhr. Am ersten Sonntag im Monat ist der Eintritt außerdem kostenlos.",
        criteria: ["Die Öffnungszeiten sind genau wiedergegeben.", "Beide Ausnahmen (Montag, Donnerstag) sind genannt.", "Der Text ist in vollständigen deutschen Sätzen geschrieben."],
      },
      2: {
        prompt:
          "Deine Klasse plant eine Aktion zum Umweltschutz. Gib für die Klassenlehrerin auf Deutsch zusammenfassend wieder, was in diesem Text steht und was eure Klasse übernehmen könnte (fünf bis sieben Sätze): « Au collège Victor-Hugo, les élèves ont créé un “club zéro déchet”. Chaque mardi, ils récupèrent le pain non mangé à la cantine pour nourrir les poules d’une ferme voisine. Ils ont aussi installé des bacs de tri dans chaque classe. En un an, les déchets du collège ont baissé de 30 %. Le club cherche maintenant des partenaires en Allemagne. »",
        hints: ["Gliedere: Projekt, zwei Maßnahmen, Ergebnis, Angebot.", "Erkläre Wörter wie poules nur, wenn sie wichtig sind, und gib die Prozentzahl genau an."],
        model:
          "An einer französischen Schule, dem Collège Victor-Hugo, haben Schüler einen Club gegründet, der Abfall vermeiden will. Jeden Dienstag sammeln sie das Brot, das in der Kantine übrig bleibt, und bringen es zu einem Bauernhof in der Nähe, wo es die Hühner bekommen. Außerdem stehen in jedem Klassenzimmer Behälter zur Mülltrennung. Innerhalb eines Jahres ist der Abfall der Schule um 30 Prozent zurückgegangen. Der Club sucht jetzt Partner in Deutschland. Wir könnten die Mülltrennung im Klassenzimmer übernehmen und uns als Partnerklasse melden.",
        criteria: ["Die wichtigsten Informationen sind sinngemäß und genau wiedergegeben.", "Der Text ist für die Lehrerin gegliedert und verständlich.", "Ein Vorschlag für die eigene Klasse ist enthalten."],
      },
    },
  },
  {
    id: "fr-uebersetzen",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.13"],
    title: "Übersetzen: Wortgleichungen und ihre Grenzen",
    intro:
      "Eine gute Übersetzung ist richtig und klingt deutsch. Falsche Freunde, feste Wendungen und der Satzbau zeigen, wo Wortgleichungen versagen.",
    paragraphs: [
      "Beim **Übersetzen** gibst du einen französischen Text vollständig und genau auf Deutsch wieder, anders als bei der Sprachmittlung, wo du auswählst. Trotzdem übersetzt du nicht Wort für Wort: Der deutsche Text muss richtig und natürlich klingen. « Il y a deux ans » heißt „vor zwei Jahren“, nicht „es gibt zwei Jahre“.",
      "**Falsche Freunde** (faux amis) sehen deutschen Wörtern ähnlich, bedeuten aber etwas anderes: actuellement heißt „zurzeit“ (nicht „aktuell“ im Sinne von neu), sensible heißt „empfindlich“, le collège ist die Schule für Elf- bis Fünfzehnjährige, la chance heißt „Glück“, rester heißt „bleiben“, le gymnase ist die Turnhalle (nicht das Gymnasium), une veste ist eine Jacke (keine Weste).",
      "**Feste Wendungen** übersetzt du als Ganzes: avoir faim → Hunger haben, avoir besoin de → brauchen, ça me plaît → das gefällt mir, faire la queue → Schlange stehen, venir de faire → gerade getan haben. Auch die **Zeiten** übertragen sich nicht eins zu eins: das passé composé wird im Deutschen oft Perfekt oder Präteritum, das imparfait meist Präteritum. On kann „man“ oder „wir“ heißen.",
      "Beim **Satzbau** steht im Deutschen das Verb oft am Ende oder an zweiter Stelle: « Hier, nous sommes allés au cinéma » → „Gestern sind wir ins Kino gegangen“. Prüfe am Ende: Ist alles übersetzt? Klingt der Satz deutsch? Stimmen Zeit, Person und Zahlen? Typische Fehler sind wörtliche Übersetzungen fester Wendungen und falsche Freunde.",
    ],
    terms: [
      { term: "faux amis", text: "Falsche Freunde: Wörter, die einem deutschen Wort ähneln, aber etwas anderes bedeuten, zum Beispiel actuellement = zurzeit." },
      { term: "Wortgleichung", text: "Die Annahme, ein Wort entspreche immer genau einem Wort der anderen Sprache. Sie stimmt oft nicht." },
      { term: "feste Wendung", text: "Eine Wortgruppe, die als Ganzes übersetzt wird, zum Beispiel faire la queue = Schlange stehen." },
    ],
    takeaway:
      "Übersetzen heißt vollständig und genau, aber nicht wörtlich: falsche Freunde erkennen (actuellement = zurzeit), feste Wendungen als Ganzes übertragen (il y a deux ans = vor zwei Jahren), deutsche Zeiten und deutschen Satzbau verwenden.",
    sourceIds: ["lp", "larousse", "lepointdufle"],
    quiz: {
      question: "Wie übersetzt du « Actuellement, mon frère est en stage »?",
      answer: "Zurzeit macht mein Bruder ein Praktikum.",
      wrong: ["Aktuell ist mein Bruder in einer Stage.", "Eigentlich macht mein Bruder ein Praktikum."],
      explanation:
        "Actuellement ist ein falscher Freund: Es heißt zurzeit. Être en stage heißt ein Praktikum machen. Eigentlich wäre en fait.",
    },
    workshop: {
      kind: "choose",
      title: "Die beste deutsche Übersetzung wählen",
      instruction: "Wähle für jeden französischen Ausdruck die deutsche Übersetzung, die richtig und natürlich ist.",
      items: [
        { before: "« Il y a trois ans, j’habitais à Lille. » → ", options: ["Vor drei Jahren wohnte ich in Lille.", "Es gibt drei Jahre, ich wohnte in Lille.", "Seit drei Jahren wohne ich in Lille."], answer: 0, after: "", feedback: "Il y a + Zeitangabe heißt vor; das imparfait wird zum Präteritum." },
        { before: "« Elle est très sensible. » → ", options: ["Sie ist sehr empfindlich.", "Sie ist sehr sinnvoll.", "Sie ist sehr vernünftig."], answer: 0, after: "", feedback: "Sensible ist ein falscher Freund: empfindlich. Vernünftig wäre raisonnable." },
        { before: "« Nous avons fait la queue pendant une heure. » → ", options: ["Wir haben eine Stunde Schlange gestanden.", "Wir haben eine Stunde den Schwanz gemacht.", "Wir haben eine Stunde Kegel gespielt."], answer: 0, after: "", feedback: "Faire la queue ist eine feste Wendung: Schlange stehen." },
        { before: "« Je viens de recevoir ta lettre. » → ", options: ["Ich habe gerade deinen Brief bekommen.", "Ich komme, um deinen Brief zu bekommen.", "Ich werde deinen Brief bald bekommen."], answer: 0, after: "", feedback: "Venir de + Infinitiv heißt gerade etwas getan haben." },
        { before: "« Tu as de la chance! » → ", options: ["Du hast Glück!", "Du hast eine Chance!", "Du hast Recht!"], answer: 0, after: "", feedback: "Avoir de la chance heißt Glück haben. Une chance kann auch Chance heißen, hier passt Glück." },
      ],
      conclusion: "Feste Wendungen und falsche Freunde zeigen, wo Wortgleichungen versagen. Die deutsche Übersetzung muss sinngemäß richtig und natürlich klingen.",
    },
    casework: {
      title: "Eine Postkarte übersetzen",
      story:
        "Deine Tante bekommt eine Karte aus Frankreich und bittet dich zu übersetzen: « Chère Anna, nous sommes à Annecy depuis lundi. Il fait beau et le lac est magnifique. Hier, on a fait du vélo. Ça m’a beaucoup plu! Je pense à toi. Bises, Sophie »",
      steps: [
        {
          question: "Wie übersetzt du « nous sommes à Annecy depuis lundi »?",
          options: ["Wir sind seit Montag in Annecy.", "Wir waren am Montag in Annecy.", "Wir sind ab Montag in Annecy."],
          answer: 0,
          explanation: "Depuis + Präsens heißt seit und beschreibt etwas, das noch andauert.",
        },
        {
          question: "Was bedeutet « on a fait du vélo » hier?",
          options: ["Wir sind Fahrrad gefahren.", "Man hat ein Fahrrad gebaut.", "Wir haben das Fahrrad repariert."],
          answer: 0,
          explanation: "On heißt hier wir, und faire du vélo heißt Fahrrad fahren.",
        },
        {
          question: "Wie gibst du « Ça m’a beaucoup plu! » natürlich wieder?",
          options: ["Das hat mir sehr gefallen!", "Das hat mich viel geregnet!", "Es hat mir viel gepasst!"],
          answer: 0,
          explanation: "Plaire heißt gefallen; plu ist sein Partizip, nicht das von pleuvoir in diesem Satz.",
        },
      ],
      verdict:
        "Depuis, on und plaire zeigen, dass man Bedeutung und Zusammenhang übersetzt, nicht einzelne Wörter. Die Karte klingt dann auf Deutsch ganz natürlich.",
    },
    tasks: {
      1: {
        prompt:
          "Übersetze ins Deutsche: « Il y a deux semaines, je suis allé au collège de mon correspondant. Actuellement, il fait un stage dans une banque. »",
        hints: ["Achte auf il y a, collège und actuellement.", "Wähle für das passé composé Perfekt oder Präteritum."],
        model:
          "Vor zwei Wochen bin ich in die Schule meines Austauschpartners gegangen. Zurzeit macht er ein Praktikum in einer Bank. Collège kann man mit Schule übersetzen oder erklären (eine Schule für Elf- bis Fünfzehnjährige); College wäre falsch.",
        criteria: ["Il y a und actuellement sind richtig übersetzt.", "Collège ist nicht mit College übersetzt.", "Die deutschen Sätze klingen natürlich."],
      },
      2: {
        prompt:
          "Übersetze den Text ins Deutsche und erkläre danach zwei Stellen, an denen eine Wort-für-Wort-Übersetzung falsch wäre: « Quand j’avais quinze ans, j’ai eu la chance de passer un mois au Québec. On faisait la queue partout à cause des touristes, mais les gens étaient très sympas. Je viens de retrouver les photos de ce voyage. »",
        hints: ["Finde die festen Wendungen und falschen Freunde.", "Prüfe die Zeiten: imparfait meist Präteritum."],
        model:
          "„Als ich fünfzehn war, hatte ich das Glück, einen Monat in Québec zu verbringen. Wegen der Touristen standen wir überall Schlange, aber die Leute waren sehr nett. Ich habe gerade die Fotos von dieser Reise wiedergefunden.“ Erklärung: 1. Avoir la chance heißt Glück haben, nicht eine Chance haben. 2. Faire la queue heißt Schlange stehen; wörtlich wäre es „den Schwanz machen“. Auch je viens de heißt gerade und nicht ich komme.",
        criteria: ["Der Text ist vollständig und richtig übersetzt.", "Zwei Stellen sind treffend erklärt.", "Zeiten und Satzbau sind deutsch."],
      },
    },
  },
  {
    id: "fr-sprachmittler-probleme",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.14"],
    title: "Als Sprachmittler in Problemsituationen",
    intro:
      "Bei einer Reklamation zwischen deinen Eltern und einer französischen Angestellten fasst du zusammen, umschreibst und fragst nach.",
    paragraphs: [
      "Manchmal vermittelst du mündlich zwischen zwei Seiten, zum Beispiel bei einer **Reklamation**: Deine Eltern sprechen kein Französisch, der Kellner kein Deutsch. Du gibst die Inhalte **zusammenfassend** weiter, in beide Richtungen, und bleibst dabei höflich. Du sagst nicht « Er sagt, er sagt … », sondern fasst den Kern zusammen: „Er sagt, das Gericht ist aus, wir können ein anderes wählen.“",
      "Wenn dir ein Wort fehlt, nutzt du **Kompensationsstrategien**: umschreiben (« la chose pour ouvrir les bouteilles » statt le tire-bouchon), einen Oberbegriff nehmen (un appareil, un document), ein Synonym oder Gegenteil verwenden (pas propre statt sale), mit Gestik zeigen. Wichtig ist, dass die Botschaft ankommt.",
      "Wenn du etwas nicht verstanden hast, nutzt du **Reparaturtechniken**: « Pardon, vous pouvez répéter, s’il vous plaît? », « Vous pouvez parler plus lentement? », « Qu’est-ce que vous voulez dire par … ? », « Si j’ai bien compris, … ». Nachfragen ist kein Fehler, sondern sorgt dafür, dass du nichts Falsches weitergibst.",
      "Situations- und adressatengerecht heißt: Du übersetzt Ärger nicht wörtlich. Sagt dein Vater wütend „Das ist eine Frechheit!“, sagst du höflich « Mon père n’est pas content, parce que … ». Typische Fehler: alles wörtlich weitergeben, raten statt nachfragen oder eigene Meinungen hinzufügen. Die App hört nicht zu: Übe solche Gespräche zu dritt.",
    ],
    terms: [
      { term: "Kompensationsstrategie", text: "Ein Weg, ein fehlendes Wort zu ersetzen: umschreiben, Oberbegriff, Synonym, Gegenteil oder Gestik." },
      { term: "Reparaturtechnik", text: "Nachfragen, wenn etwas unklar ist: vous pouvez répéter?, qu’est-ce que vous voulez dire par …?, si j’ai bien compris." },
      { term: "réclamation", text: "Eine Reklamation, eine Beschwerde über ein Produkt oder eine Leistung." },
    ],
    takeaway:
      "Als Sprachmittler fasst du den Kern zusammen, in beide Richtungen und höflich. Fehlt ein Wort, umschreibst du (Kompensation). Verstehst du etwas nicht, fragst du nach (Reparatur). Ärger übersetzt du nicht wörtlich.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Dir fällt das Wort für „Fernbedienung“ nicht ein. Was sagst du im Hotel?",
      answer: "La petite chose pour changer de chaîne ne marche pas.",
      wrong: ["Je ne sais pas le mot, alors je ne dis rien du tout.", "La Fernbedienung ne marche pas, vous comprenez?"],
      explanation:
        "Du umschreibst, wofür das Ding da ist (pour changer de chaîne). Schweigen löst das Problem nicht, ein deutsches Wort versteht die Angestellte nicht.",
    },
    workshop: {
      kind: "classify",
      title: "Strategien beim Sprachmitteln erkennen",
      instruction: "Ordne jede Äußerung zu: Kompensation (ein Wort ersetzen), Reparatur (nachfragen) oder Zusammenfassung (den Kern weitergeben).",
      categories: ["Kompensation", "Reparatur", "Zusammenfassung"],
      entries: [
        { text: "C’est le truc qu’on met sur la valise pour la fermer, avec des chiffres.", target: 0, feedback: "Ein fehlendes Wort (le cadenas) wird umschrieben." },
        { text: "Pardon, vous pouvez parler un peu plus lentement, s’il vous plaît?", target: 1, feedback: "Eine Bitte, langsamer zu sprechen: Reparatur." },
        { text: "Mama, er sagt, das Zimmer ist morgen frei, heute nur ein kleineres.", target: 2, feedback: "Der Kern der Antwort wird kurz auf Deutsch weitergegeben." },
        { text: "Si j’ai bien compris, on peut être remboursés seulement avec le ticket?", target: 1, feedback: "Si j’ai bien compris sichert das Verständnis: Reparatur." },
        { text: "La chambre n’est pas propre: il y a des cheveux dans la salle de bains.", target: 0, feedback: "Pas propre ersetzt das fehlende Wort sale: Kompensation durch Verneinung des Gegenteils." },
        { text: "Mon père dit que la soupe est froide et il voudrait un autre plat.", target: 2, feedback: "Der Ärger des Vaters wird sachlich und kurz auf Französisch zusammengefasst." },
      ],
      conclusion: "Umschreiben hilft, wenn ein Wort fehlt, Nachfragen, wenn du etwas nicht verstehst, und Zusammenfassen bringt den Kern in die andere Sprache.",
    },
    casework: {
      title: "Ärger im Restaurant",
      story:
        "Im Urlaub in Nizza wartet deine Familie seit 45 Minuten auf das Essen. Dein Vater sagt laut: „Das ist doch unmöglich! Frag mal, wo unser Essen bleibt, und sag, dass wir so nicht wiederkommen!“ Der Kellner antwortet schnell etwas von « la cuisine », « un problème avec le four » und « dix minutes ».",
      steps: [
        {
          question: "Wie gibst du die Beschwerde deines Vaters weiter?",
          options: ["Excusez-moi, nous attendons depuis 45 minutes. Mon père s’inquiète.", "Mon père dit: c’est impossible et nous ne reviendrons jamais ici!", "Rien, je ne veux pas me disputer avec le serveur."],
          answer: 0,
          explanation: "Du gibst den Kern (Wartezeit) höflich weiter. Die wörtliche Drohung würde das Gespräch verschlechtern, schweigen löst nichts.",
        },
        {
          question: "Du hast den Kellner nicht ganz verstanden. Was sagst du?",
          options: ["Si j’ai bien compris, il y a un problème avec le four?", "D’accord, merci, monsieur, bonne soirée à vous!", "Le four? C’est un mot que je ne connais pas du tout, désolé."],
          answer: 0,
          explanation: "Mit si j’ai bien compris prüfst du, was du verstanden hast. So gibst du nichts Falsches weiter.",
        },
        {
          question: "Wie fasst du die Antwort für deinen Vater zusammen?",
          options: ["Der Ofen war kaputt, das Essen kommt in zehn Minuten.", "Er hat sehr schnell und sehr viel über die Küche gesprochen.", "Er sagt, wir sollen nicht wiederkommen, Papa."],
          answer: 0,
          explanation: "Du nennst Grund und Zeit, also den Kern. Die anderen Antworten sind ungenau oder falsch.",
        },
      ],
      verdict:
        "Höflich statt wörtlich weitergeben, bei Unklarheit nachfragen und den Kern zusammenfassen: So wird aus Ärger eine Lösung in zehn Minuten.",
    },
    tasks: {
      1: {
        prompt:
          "Deine Mutter sagt an der Hotelrezeption: „Im Zimmer funktioniert die Heizung nicht und es ist eiskalt. Können wir ein anderes Zimmer bekommen?“ Gib das in zwei höflichen französischen Sätzen weiter. Dir fehlt das Wort für Heizung: Umschreibe es.",
        hints: ["Umschreibe zum Beispiel mit l’appareil pour chauffer la chambre.", "Für die Bitte passt est-ce qu’on pourrait."],
        model:
          "Excusez-moi, dans notre chambre, l’appareil pour chauffer la pièce ne marche pas et il fait très froid. Est-ce qu’on pourrait avoir une autre chambre, s’il vous plaît? (Das Wort wäre le chauffage, die Umschreibung macht die Botschaft trotzdem klar.)",
        criteria: ["Problem und Bitte sind vollständig weitergegeben.", "Das fehlende Wort ist verständlich umschrieben.", "Der Ton ist höflich."],
      },
      2: {
        prompt:
          "Schreibe einen Dialog von acht bis zehn Zeilen zu dritt: Dein Bruder hat in einem Geschäft in Straßburg Kopfhörer gekauft, die nicht funktionieren. Er spricht kein Französisch, die Verkäuferin kein Deutsch. Verwende eine Kompensationsstrategie, eine Reparaturtechnik und zwei Zusammenfassungen.",
        hints: ["Lass die Verkäuferin eine Bedingung nennen, die du nachfragst.", "Fasse für deinen Bruder auf Deutsch kurz zusammen."],
        model:
          "Bruder: Sag ihr, dass die Kopfhörer nach einem Tag kaputt waren! Du: Bonjour madame, mon frère a acheté ce casque hier, mais il ne marche plus. On entend seulement d’un côté. Verkäuferin: Vous avez le ticket? Sans ticket, on ne peut pas faire d’échange. Du: Pardon, vous pouvez répéter plus lentement? Verkäuferin: Il faut le ticket de caisse pour l’échanger. Du (zum Bruder): Sie braucht den Kassenzettel, sonst kein Umtausch. Bruder: Hier ist er. Du: Voilà le petit papier de la caisse. Verkäuferin: Parfait, je vous donne un nouveau casque. Du (zum Bruder): Du bekommst neue Kopfhörer.",
        criteria: ["Eine Kompensation und eine Reparatur sind enthalten.", "Zwei Zusammenfassungen geben den Kern weiter.", "Der Dialog ist höflich und führt zu einer Lösung."],
      },
    },
  },
];
