import type { Lesson } from "../model/types";

/**
 * Stufe 2, erster Teil: Grammatik zum differenzierten Beschreiben und Werten (Kompetenzerwartung 1.2.2.1):
 * ne … pas non plus und ne … que, die Relativpronomen ce qui und ce que, die Adverbien auf -ment und
 * einige unregelmäßige Adverbien (vraiment, gentiment, constamment, bien, mal).
 */
export const S2A: Lesson[] = [
  {
    id: "fr-ne-pas-non-plus-ne-que",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "ne … pas non plus und ne … que",
    intro:
      "Mit ne … pas non plus sagst du „auch nicht“, mit ne … que „nur“. Beide umschließen das Verb wie andere Verneinungen.",
    paragraphs: [
      "**Ne … pas non plus** heißt „auch nicht“. Es ist die verneinte Form von aussi: « J’aime le sport. – Moi aussi. » aber « Je n’aime pas le sport. – Moi non plus. » Im ganzen Satz umschließen ne und pas das konjugierte Verb, non plus steht dahinter: « Paul ne vient pas non plus. » Im passé composé: « Je ne suis pas allé au cinéma non plus. » Kurz antwortest du mit moi non plus, toi non plus, lui non plus.",
      "**Ne … que** heißt „nur“, wie seulement. Ne steht vor dem konjugierten Verb, que direkt vor dem Satzteil, der eingeschränkt wird: « Je n’ai que dix euros. » (nur zehn Euro), « Il ne travaille que le samedi. » (nur samstags), « Elle n’a lu que deux chapitres. » Im passé composé steht que also meist hinter dem Partizip. Vor Vokal wird que zu qu’: « Il n’a qu’une sœur. »",
      "Wichtig: **Ne … que ist keine echte Verneinung**. Deshalb bleiben un, une, du, de la und des stehen: « Je ne bois que de l’eau. », « Nous n’avons que des questions simples. » Bei ne … pas würden sie zu de: « Je ne bois pas d’eau. » Wer bei ne … que de schreibt, ändert den Sinn oder macht den Satz falsch.",
      "Typische Fehler: non plus und aussi verwechseln (« Je n’aime pas ça. – Moi aussi. » heißt eigentlich das Gegenteil), que an die falsche Stelle setzen (« Je ne que mange … ») oder ne vergessen. In der gesprochenen Sprache fällt ne oft weg (« J’ai que dix euros »), in Texten schreibst du es immer.",
    ],
    terms: [
      { term: "ne … pas non plus", text: "Auch nicht. Die verneinte Entsprechung zu aussi: « Moi non plus. », « Il ne vient pas non plus. »" },
      { term: "ne … que", text: "Nur, wie seulement. Que steht direkt vor dem eingeschränkten Satzteil: « Je n’ai que dix euros. »" },
      { term: "Artikel nach ne … que", text: "Un, une, du, de la, des bleiben stehen, weil ne … que keine echte Verneinung ist: « Je ne bois que du lait. »" },
    ],
    takeaway:
      "Ne … pas non plus = auch nicht (zustimmend zu einer Verneinung: moi non plus). Ne … que = nur; que steht direkt vor dem eingeschränkten Teil, und der Artikel bleibt (je ne bois que de l’eau).",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Ich habe nur eine Schwester“?",
      answer: "Je n’ai qu’une sœur.",
      wrong: ["Je n’ai pas qu’une sœur.", "Je n’ai que de sœur."],
      explanation:
        "Ne … que heißt nur; vor une wird que zu qu’, und der Artikel bleibt. Ne … pas que hieße „nicht nur“, de ist hier falsch.",
    },
    workshop: {
      kind: "choose",
      title: "Auch nicht oder nur?",
      instruction: "Wähle die passende Form. Achte auf die Stellung von non plus und que und auf den Artikel nach ne … que.",
      items: [
        { before: "– Je n’aime pas les films d’horreur. – Moi ", options: ["non plus", "aussi", "ne plus"], answer: 0, after: ".", feedback: "Zustimmung zu einem verneinten Satz: moi non plus." },
        { before: "Il ne travaille ", options: ["que", "pas", "non plus"], answer: 0, after: " le week-end, du vendredi soir au dimanche.", feedback: "Er arbeitet nur am Wochenende: ne … que." },
        { before: "Nous ne buvons que ", options: ["de l’eau", "d’eau", "eau"], answer: 0, after: " pendant le match.", feedback: "Nach ne … que bleibt der Teilungsartikel: de l’eau." },
        { before: "Sophie n’est pas venue et Marc ", options: ["n’est pas venu non plus", "n’est venu pas non plus", "est pas venu aussi non plus"], answer: 0, after: ".", feedback: "Auch Marc ist nicht gekommen: ne … pas … non plus umschließt das Hilfsverb, non plus steht am Ende." },
        { before: "Le stage ne dure ", options: ["que", "pas que", "non plus"], answer: 0, after: " deux semaines, c’est court.", feedback: "Das Praktikum dauert nur zwei Wochen: ne … que." },
      ],
      conclusion: "Non plus stimmt einer Verneinung zu, ne … que schränkt ein. Nach ne … que bleibt der Artikel stehen.",
    },
    casework: {
      title: "Ein Gespräch über das Wochenende",
      story:
        "Hugo und Lisa sprechen: « – Je ne suis pas sorti ce week-end. – Moi non plus. Je n’ai fait que mes devoirs. – Moi, je n’ai vu que des séries. Et je n’ai mangé que des pizzas! »",
      steps: [
        {
          question: "Was bedeutet Lisas « Moi non plus »?",
          options: ["Sie ist auch nicht ausgegangen.", "Sie ist dafür ausgegangen.", "Sie ist nur kurz ausgegangen."],
          answer: 0,
          explanation: "Moi non plus stimmt einem verneinten Satz zu: Auch sie ist nicht ausgegangen.",
        },
        {
          question: "Was sagt « Je n’ai fait que mes devoirs »?",
          options: ["Sie hat nur ihre Hausaufgaben gemacht.", "Sie hat ihre Hausaufgaben nicht gemacht.", "Sie hat auch ihre Hausaufgaben gemacht."],
          answer: 0,
          explanation: "Ne … que heißt nur. Que steht direkt vor mes devoirs, dem eingeschränkten Teil.",
        },
        {
          question: "Warum heißt es « que des pizzas » und nicht « que de pizzas »?",
          options: ["Ne … que ist keine echte Verneinung.", "Pizza ist ein weibliches Wort.", "Nach manger steht immer der Artikel des."],
          answer: 0,
          explanation: "Bei ne … que bleibt der Artikel stehen. De statt des gilt nur bei echten Verneinungen wie ne … pas.",
        },
      ],
      verdict:
        "Moi non plus stimmt zu, ne … que schränkt ein, und der Artikel bleibt: Das Gespräch ist grammatisch genau.",
    },
    tasks: {
      1: {
        prompt:
          "Antworte auf Französisch: 1. Je ne parle pas italien. Et toi? (auch nicht) 2. Tu as beaucoup d’argent? (nur fünf Euro) 3. Tu bois du café? (nur Tee)",
        hints: ["Für „auch nicht“ brauchst du non plus.", "Für „nur“ brauchst du ne … que; der Artikel bleibt."],
        model:
          "1. Moi non plus, je ne parle pas italien. 2. Non, je n’ai que cinq euros. 3. Non, je ne bois que du thé. Bei 3 bleibt du stehen, weil ne … que keine echte Verneinung ist.",
        criteria: ["Non plus ist richtig verwendet.", "Ne … que steht an der richtigen Stelle.", "Der Artikel nach ne … que bleibt."],
      },
      2: {
        prompt:
          "Schreibe fünf bis sechs Sätze für einen Forumsbeitrag über einen Tag, an dem alles schiefging. Verwende zweimal ne … que und zweimal ne … pas non plus, davon einmal im passé composé.",
        hints: ["Im passé composé umschließen ne und pas das Hilfsverb, non plus steht am Ende.", "Prüfe bei ne … que, vor welchem Teil que steht."],
        model:
          "Hier, rien n’a marché! Mon réveil n’a pas sonné et mon frère ne m’a pas réveillé non plus. Je n’ai eu que dix minutes pour me préparer. Au collège, je n’avais pas mon livre et ma voisine ne l’avait pas non plus. À midi, il n’y avait que des épinards à la cantine. Heureusement, ce soir, je ne pense qu’à mon lit!",
        criteria: ["Ne … que kommt zweimal richtig vor.", "Ne … pas non plus kommt zweimal vor, einmal im passé composé.", "Der Beitrag ist zusammenhängend."],
      },
    },
    practice: {
      kind: "choose",
      title: "Auch nicht und nur: Übungsrunde",
      instruction: "Wähle die richtige Form. Eine Runde zählt, wenn alle drei Sätze richtig sind.",
      pool: {
        1: [
          { before: "– Je n’ai pas faim. – Moi ", options: ["non plus", "aussi"], answer: 0, after: ".", feedback: "Zustimmung zu einer Verneinung: moi non plus." },
          { before: "– J’adore le chocolat. – Moi ", options: ["aussi", "non plus"], answer: 0, after: "!", feedback: "Zustimmung zu einem bejahten Satz: moi aussi." },
          { before: "Je n’ai ", options: ["que", "pas"], answer: 0, after: " cinq minutes.", feedback: "Ich habe nur fünf Minuten: ne … que." },
          { before: "Elle ne mange que ", options: ["des légumes", "de légumes"], answer: 0, after: ".", feedback: "Nach ne … que bleibt der Artikel des." },
          { before: "Il n’a ", options: ["qu’un", "que un"], answer: 0, after: " frère.", feedback: "Vor einem Vokal wird que zu qu’: qu’un." },
          { before: "Tu ne viens pas? Nous ne venons pas ", options: ["non plus", "aussi"], answer: 0, after: ".", feedback: "Auch wir kommen nicht: ne … pas non plus." },
          { before: "Je ne bois ", options: ["que", "non plus"], answer: 0, after: " du jus d’orange.", feedback: "Ich trinke nur Orangensaft: ne … que." },
          { before: "Lui ", options: ["non plus", "aussi"], answer: 0, after: ", il ne comprend pas.", feedback: "Er versteht auch nicht: lui non plus." },
        ],
        2: [
          { before: "Mon frère n’a pas réussi son examen et ma cousine ", options: ["ne l’a pas réussi non plus", "ne l’a réussi pas non plus", "ne l’a pas réussi aussi"], answer: 0, after: ", malheureusement.", feedback: "Auch die Cousine hat es nicht geschafft: ne … pas umschließt das Hilfsverb, non plus steht am Ende." },
          { before: "Pendant tout le séjour à Paris, nous n’avons visité ", options: ["que", "pas", "plus"], answer: 0, after: " deux musées, parce qu’il faisait trop beau.", feedback: "Nur zwei Museen: ne … que; que steht direkt vor deux musées." },
          { before: "Dans ce petit village, il n’y a ", options: ["qu’une", "pas une", "que d’une"], answer: 0, after: " boulangerie et une pharmacie, rien d’autre.", feedback: "Nur eine Bäckerei: ne … que; vor une wird que zu qu’, der Artikel bleibt." },
          { before: "Pour mon stage, l’entreprise ne cherche ", options: ["que des", "pas de", "que de"], answer: 0, after: " élèves qui parlent déjà un peu français.", feedback: "Sie sucht nur Schüler, die schon etwas Französisch sprechen: ne … que + des." },
          { before: "– Je ne suis jamais allée en Afrique. – Moi ", options: ["non plus", "aussi", "plus"], answer: 0, after: ", mais j’aimerais beaucoup visiter le Sénégal un jour.", feedback: "Zustimmung zu einer Verneinung (ne … jamais): moi non plus." },
          { before: "Le magasin est ouvert, mais on ne peut payer ", options: ["qu’en", "pas en", "non plus en"], answer: 0, after: " espèces, parce que la machine à cartes est en panne.", feedback: "Man kann nur bar zahlen: ne … que, vor en wird que zu qu’." },
          { before: "Léa n’a pas aimé le film et ses parents ", options: ["ne l’ont pas aimé non plus", "ne l’ont aimé pas non plus", "ne l’ont pas aimé aussi"], answer: 0, after: ", ils sont partis avant la fin.", feedback: "Auch die Eltern mochten ihn nicht: ne … pas … non plus." },
          { before: "Cette semaine, je ne travaille ", options: ["que le matin", "pas le matin que", "le matin que"], answer: 0, after: ", alors je peux t’aider l’après-midi.", feedback: "Nur vormittags: ne vor dem Verb, que direkt vor le matin." },
        ],
      },
    },
  },
  {
    id: "fr-ce-qui-ce-que",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "Die Relativpronomen ce qui und ce que",
    intro:
      "Ce qui und ce que heißen beide „was“. Ce qui ist Subjekt des Relativsatzes, ce que ist Objekt.",
    paragraphs: [
      "**Ce qui** und **ce que** leiten einen Relativsatz ein, der sich nicht auf ein Nomen bezieht, sondern auf eine ganze Sache: „das, was“. « Ce qui m’intéresse, c’est la musique. » (Das, was mich interessiert, ist die Musik.) « Ce que j’aime, c’est voyager. » (Das, was ich mag, ist Reisen.) Du kennst den Unterschied schon von qui und que aus Klasse 9.",
      "**Ce qui** ist das **Subjekt** des Relativsatzes: Direkt danach folgt meist das Verb (oder ein Objektpronomen vor dem Verb): « ce qui se passe », « ce qui me plaît », « ce qui est important ». **Ce que** ist das **Objekt**: Danach folgt ein eigenes Subjekt: « ce que tu dis », « ce que mes parents pensent », « ce qu’il veut ». Vor Vokal wird ce que zu ce qu’.",
      "Typisch sind zwei Verwendungen. Erstens zum **Hervorheben** am Satzanfang mit c’est: « Ce qui me fait peur, c’est l’examen. », « Ce que je trouve injuste, c’est … ». So wirken Meinungen und Bewertungen präziser. Zweitens in der **indirekten Frage**: Aus « Qu’est-ce qui se passe? » wird « Il demande ce qui se passe. », aus « Qu’est-ce que tu veux? » wird « Je ne sais pas ce que tu veux. »",
      "Die Probe: Steht nach dem Pronomen ein Subjekt (je, tu, il, Paul, mes amis)? Dann ce que. Steht direkt das Verb da? Dann ce qui. Typische Fehler: « Ce que se passe » (es fehlt ein Subjekt, also ce qui) oder « ce qu’il me plaît » statt ce qui me plaît. Beachte: Bezieht sich der Relativsatz auf ein Nomen, nimmst du qui oder que ohne ce: « le film que j’ai vu ».",
    ],
    terms: [
      { term: "ce qui", text: "Das, was (Subjekt). Danach folgt direkt das Verb: « ce qui m’intéresse », « ce qui se passe »." },
      { term: "ce que / ce qu’", text: "Das, was (Objekt). Danach folgt ein Subjekt: « ce que tu dis », « ce qu’elle veut »." },
      { term: "Hervorhebung", text: "Ce qui / ce que … , c’est … rückt das Wichtigste nach hinten: « Ce que j’aime, c’est la mer. »" },
    ],
    takeaway:
      "Ce qui = das, was als Subjekt: direkt danach das Verb (ce qui me plaît). Ce que = das, was als Objekt: danach ein Subjekt (ce que tu dis). Gebrauch: Hervorheben mit c’est und indirekte Fragen.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welche Form ergänzt den Satz « Dis-moi … tu veux pour ton anniversaire »?",
      answer: "ce que",
      wrong: ["ce qui", "qu’est-ce que"],
      explanation:
        "Nach der Lücke folgt das Subjekt tu, also ist das Pronomen Objekt: ce que. Qu’est-ce que gehört in die direkte Frage, nicht in die indirekte.",
    },
    workshop: {
      kind: "choose",
      title: "ce qui oder ce que?",
      instruction: "Prüfe, was nach der Lücke folgt: ein Subjekt (dann ce que) oder direkt das Verb (dann ce qui).",
      items: [
        { before: "", options: ["Ce qui", "Ce que"], answer: 0, after: " m’intéresse, c’est le cinéma français.", feedback: "Direkt danach kommt m’intéresse, ohne eigenes Subjekt: ce qui ist das Subjekt." },
        { before: "", options: ["Ce que", "Ce qui"], answer: 0, after: " je préfère, c’est passer du temps avec mes amis.", feedback: "Danach folgt das Subjekt je: ce que." },
        { before: "Je ne comprends pas ", options: ["ce qui", "ce que"], answer: 0, after: " se passe.", feedback: "Se passe hat kein eigenes Subjekt: ce qui." },
        { before: "Il ne sait pas ", options: ["ce qu’", "ce qui", "qu’est-ce qu’"], answer: 0, after: "il veut faire après le collège.", feedback: "Danach folgt das Subjekt il; vor Vokal wird ce que zu ce qu’." },
        { before: "Voilà ", options: ["ce qui", "ce que"], answer: 0, after: " est important pour moi: l’amitié.", feedback: "Est hat kein eigenes Subjekt, ce qui ist es: ce qui." },
        { before: "Raconte-moi ", options: ["ce que", "ce qui"], answer: 0, after: " vous avez fait à Lyon.", feedback: "Danach folgt das Subjekt vous: ce que." },
      ],
      conclusion: "Subjekt nach der Lücke: ce que. Verb direkt nach der Lücke: ce qui. Diese Probe klappt fast immer.",
    },
    casework: {
      title: "Ein Interview für die Schülerzeitung",
      story:
        "Eine französische Austauschschülerin antwortet: « Ce qui me plaît en Bavière, c’est la nature. Ce que je trouve difficile, c’est le dialecte! Je ne comprends pas toujours ce que les gens disent. Et je me demande ce qui se passe à la fête de la bière. »",
      steps: [
        {
          question: "Warum steht « Ce qui me plaît »?",
          options: ["Ce qui ist hier das Subjekt von plaît.", "Nach ce steht am Satzanfang immer qui.", "Me ist das Subjekt des Satzes."],
          answer: 0,
          explanation: "Plaire hat hier kein anderes Subjekt; me ist das Objekt. Also ist ce qui das Subjekt.",
        },
        {
          question: "Warum steht « ce que les gens disent »?",
          options: ["Les gens ist das Subjekt, ce que das Objekt.", "Weil disent ein unregelmäßiges Verb ist.", "Weil der Satz verneint ist."],
          answer: 0,
          explanation: "Nach dem Pronomen folgt ein eigenes Subjekt (les gens): ce que.",
        },
        {
          question: "Wie lautet die direkte Frage zu « je me demande ce qui se passe »?",
          options: ["Qu’est-ce qui se passe?", "Qu’est-ce que se passe?", "Ce qui se passe?"],
          answer: 0,
          explanation: "Die direkte Frage nach einem Subjekt lautet qu’est-ce qui. In der indirekten Frage wird daraus ce qui.",
        },
      ],
      verdict:
        "Zweimal Hervorhebung, zweimal indirekte Frage: ce qui steht, wo das Verb folgt, ce que, wo ein eigenes Subjekt folgt.",
    },
    tasks: {
      1: {
        prompt:
          "Ergänze ce qui oder ce que und übersetze: 1. … me fait peur, c’est le bac. 2. … j’adore, c’est le chocolat. 3. Elle demande … tu fais ce soir.",
        hints: ["Prüfe, was nach der Lücke folgt.", "Bei 3 handelt es sich um eine indirekte Frage."],
        model:
          "1. Ce qui me fait peur, c’est le bac. (Was mir Angst macht, ist das Abitur.) 2. Ce que j’adore, c’est le chocolat. (Was ich liebe, ist Schokolade.) 3. Elle demande ce que tu fais ce soir. (Sie fragt, was du heute Abend machst.)",
        criteria: ["Alle drei Pronomen sind richtig.", "Die Wahl ist mit der Subjektprobe erklärbar.", "Die Übersetzungen treffen den Sinn."],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Text (fünf bis sechs Sätze) über deinen Wunschberuf oder ein Hobby. Verwende zweimal ce qui … , c’est und zweimal ce que … , c’est, außerdem eine indirekte Frage mit ce qui oder ce que.",
        hints: ["Hervorhebung: Ce qui me plaît, c’est …; Ce que je fais, c’est …", "Indirekte Frage: Je me demande ce que …"],
        model:
          "Plus tard, je voudrais devenir cuisinière. Ce qui me plaît dans ce métier, c’est la créativité. Ce que j’aime surtout, c’est inventer de nouveaux desserts. Ce qui est difficile, c’est le rythme: on travaille le soir et le week-end. Ce que mes parents pensent, c’est que c’est un métier fatigant. Mais je me demande ce qui pourrait me rendre plus heureuse!",
        criteria: ["Ce qui und ce que sind je zweimal richtig in der Hervorhebung verwendet.", "Eine indirekte Frage ist richtig gebaut.", "Der Text ist zusammenhängend."],
      },
    },
    practice: {
      kind: "choose",
      title: "ce qui und ce que: Übungsrunde",
      instruction: "Wähle ce qui oder ce que. Eine Runde zählt, wenn alle drei Sätze richtig sind.",
      pool: {
        1: [
          { before: "", options: ["Ce qui", "Ce que"], answer: 0, after: " est bien, c’est la musique.", feedback: "Est hat kein eigenes Subjekt: ce qui." },
          { before: "", options: ["Ce que", "Ce qui"], answer: 0, after: " tu dis est vrai.", feedback: "Danach folgt das Subjekt tu: ce que." },
          { before: "Je sais ", options: ["ce que", "ce qui"], answer: 0, after: " je veux.", feedback: "Danach folgt das Subjekt je: ce que." },
          { before: "Dis-moi ", options: ["ce qui", "ce que"], answer: 0, after: " ne va pas.", feedback: "Ne va pas hat kein eigenes Subjekt: ce qui." },
          { before: "", options: ["Ce qui", "Ce que"], answer: 0, after: " m’énerve, c’est le bruit.", feedback: "M’énerve folgt direkt, ohne Subjekt: ce qui." },
          { before: "Voilà ", options: ["ce qu’", "ce qui"], answer: 0, after: "il a acheté.", feedback: "Danach folgt das Subjekt il, vor Vokal ce qu’." },
          { before: "Fais ", options: ["ce que", "ce qui"], answer: 0, after: " tu veux.", feedback: "Danach folgt das Subjekt tu: ce que." },
          { before: "Je regarde ", options: ["ce qui", "ce que"], answer: 0, after: " se passe dehors.", feedback: "Se passe hat kein eigenes Subjekt: ce qui." },
        ],
        2: [
          { before: "", options: ["Ce qui", "Ce que", "Qu’est-ce qui"], answer: 0, after: " m’a le plus étonné pendant l’échange, c’est l’heure du dîner en France.", feedback: "M’a étonné hat kein eigenes Subjekt, und es ist eine Hervorhebung: ce qui." },
          { before: "Le directeur nous a expliqué ", options: ["ce que", "ce qui", "qu’est-ce que"], answer: 0, after: " nous devions faire en cas d’incendie dans le bâtiment.", feedback: "Indirekte Frage mit dem Subjekt nous: ce que." },
          { before: "", options: ["Ce que", "Ce qui", "Que"], answer: 0, after: " les jeunes attendent d’un employeur, c’est du respect et un bon salaire.", feedback: "Danach folgt das Subjekt les jeunes: ce que." },
          { before: "Personne ne sait exactement ", options: ["ce qui", "ce que", "qu’est-ce qui"], answer: 0, after: " s’est passé hier soir devant la gare.", feedback: "Indirekte Frage, s’est passé hat kein eigenes Subjekt: ce qui." },
          { before: "Je ne suis pas d’accord avec ", options: ["ce qu’", "ce qui", "qu’"], answer: 0, after: "il a écrit dans son article sur les réseaux sociaux.", feedback: "Danach folgt das Subjekt il, vor Vokal ce qu’." },
          { before: "", options: ["Ce qui", "Ce que", "Qui"], answer: 0, after: " rend ce métier intéressant, c’est le contact avec les clients de toute l’Europe.", feedback: "Rend hat kein eigenes Subjekt: ce qui." },
          { before: "Ma correspondante m’a demandé ", options: ["ce que", "ce qui", "qu’est-ce que"], answer: 0, after: " je voulais faire pendant les vacances de Pâques.", feedback: "Indirekte Frage mit dem Subjekt je: ce que." },
          { before: "Explique-moi ", options: ["ce qui", "ce que", "qu’est-ce qui"], answer: 0, after: " te pose problème dans cet exercice de grammaire.", feedback: "Te pose problème hat kein eigenes Subjekt: ce qui." },
        ],
      },
    },
  },
  {
    id: "fr-adverbes",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "Adverbien auf -ment und unregelmäßige Adverbien",
    intro:
      "Ein Adverb sagt, wie jemand etwas tut. Meist bildest du es aus dem Adjektiv mit -ment, einige Formen sind unregelmäßig.",
    paragraphs: [
      "Ein **Adjektiv** beschreibt ein Nomen (une voiture rapide), ein **Adverb** beschreibt ein Verb, ein Adjektiv oder einen ganzen Satz (Elle conduit prudemment. C’est vraiment bien.). Im Deutschen sehen beide oft gleich aus („Sie ist schnell“, „Sie fährt schnell“), im Französischen nicht. Deshalb musst du entscheiden, wozu das Wort gehört.",
      "Die meisten Adverbien bildest du aus der **weiblichen Form + -ment**: lent → lente → lentement, heureux → heureuse → heureusement, sérieux → sérieusement, doux → douce → doucement. Endet die männliche Form auf einen **Vokal**, hängst du -ment direkt an: vrai → vraiment, poli → poliment, absolu → absolument. Bei einigen steht -ément: précis → précisément, énorme → énormément.",
      "Adjektive auf **-ant** bilden **-amment**, Adjektive auf **-ent** bilden **-emment**, beide gesprochen wie [amɑ̃]: constant → constamment, élégant → élégamment, évident → évidemment, prudent → prudemment, récent → récemment. Merke dir die **Ausnahme** gentil → gentiment und die **unregelmäßigen** Formen: bon → **bien**, mauvais → **mal**, meilleur → **mieux**, rapide → vite (oder rapidement).",
      "**Stellung**: Das Adverb steht meist hinter dem konjugierten Verb: « Il parle bien. » In zusammengesetzten Zeiten stehen kurze Adverbien zwischen Hilfsverb und Partizip (« J’ai bien dormi. », « Elle a vite compris. »), lange auf -ment meist dahinter (« Il a répondu poliment. »). Typische Fehler: « Il parle bon français » ist richtig (bon gehört zu français), aber « Il parle bon » ist falsch, richtig ist bien. Auch « constantement » und « gentilement » gibt es nicht.",
    ],
    terms: [
      { term: "Adverb", text: "Ein Wort, das ein Verb, Adjektiv oder einen Satz näher bestimmt: Il chante bien. C’est vraiment drôle." },
      { term: "-ment", text: "Die Endung der meisten Adverbien: weibliche Form + -ment (lentement); nach Vokal direkt (vraiment)." },
      { term: "-amment / -emment", text: "Aus Adjektiven auf -ant und -ent: constamment, évidemment. Beide klingen wie [amɑ̃]." },
      { term: "bien, mal, mieux", text: "Unregelmäßige Adverbien zu bon, mauvais und meilleur." },
    ],
    examples: [
      {
        title: "Adjektiv oder Adverb?",
        text: "« Ce restaurant est bon. On y mange bien. » · « Ma sœur est gentille. Elle m’aide gentiment. »",
        analysis:
          "Bon und gentille beschreiben Nomen (restaurant, ma sœur) und richten sich nach ihnen. Bien und gentiment beschreiben, wie man isst und hilft; sie sind unveränderlich.",
      },
    ],
    takeaway:
      "Adverb = weibliche Form + -ment (lentement); nach Vokal direkt (vraiment); -ant → -amment, -ent → -emment (constamment, évidemment). Ausnahmen: gentiment, bien, mal, mieux, vite. Adverbien sind unveränderlich.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie lautet das Adverb zu constant?",
      answer: "constamment",
      wrong: ["constantement", "constemment"],
      explanation:
        "Adjektive auf -ant bilden das Adverb auf -amment: constant → constamment. Constantement gibt es nicht, -emment gehört zu Adjektiven auf -ent.",
    },
    workshop: {
      kind: "choose",
      title: "Adjektiv oder Adverb, regelmäßig oder nicht?",
      instruction: "Entscheide zuerst, ob ein Adjektiv (zum Nomen) oder ein Adverb (zum Verb) gebraucht wird, und wähle dann die richtige Form.",
      items: [
        { before: "Mon grand-père conduit très ", options: ["prudemment", "prudent", "prudentement"], answer: 0, after: ".", feedback: "Es geht darum, wie er fährt: Adverb. Prudent endet auf -ent, also prudemment." },
        { before: "Elle parle ", options: ["bien", "bon", "bonne"], answer: 0, after: " allemand et anglais.", feedback: "Bien beschreibt, wie sie spricht: das unregelmäßige Adverb zu bon." },
        { before: "Ce gâteau est vraiment ", options: ["bon", "bien", "bonnement"], answer: 0, after: "!", feedback: "Nach être beschreibt das Wort den Kuchen: Adjektiv bon." },
        { before: "Le professeur nous a expliqué l’exercice ", options: ["gentiment", "gentillement", "gentil"], answer: 0, after: ".", feedback: "Gentil bildet unregelmäßig gentiment." },
        { before: "Il pleut ", options: ["constamment", "constantement", "constant"], answer: 0, after: " depuis lundi.", feedback: "Constant endet auf -ant: constamment." },
        { before: "Parle plus ", options: ["lentement", "lent", "lentment"], answer: 0, after: ", s’il te plaît!", feedback: "Weibliche Form lente + -ment: lentement." },
      ],
      conclusion: "Zuerst Adjektiv oder Adverb bestimmen, dann bilden: weibliche Form + -ment, -amment oder -emment, oder die unregelmäßigen Formen.",
    },
    casework: {
      title: "Eine Bewertung im Internet",
      story:
        "Jemand schreibt über ein Hotel: « Le personnel nous a accueillis très gentiment. La chambre était vraiment propre. Malheureusement, le wifi marchait mal. Évidemment, on y retournera! »",
      steps: [
        {
          question: "Warum steht « gentiment » und nicht « gentil »?",
          options: ["Es beschreibt, wie man sie empfangen hat.", "Es beschreibt das Personal als Nomen.", "Gentil hat keine weibliche Form."],
          answer: 0,
          explanation: "Das Wort bestimmt das Verb accueillir näher: Adverb. Gentil bildet unregelmäßig gentiment.",
        },
        {
          question: "Zu welchem Adjektiv gehört « mal »?",
          options: ["Zu mauvais.", "Zu malade.", "Zu malheureux."],
          answer: 0,
          explanation: "Mal ist das unregelmäßige Adverb zu mauvais, wie bien zu bon.",
        },
        {
          question: "Wie ist « évidemment » gebildet?",
          options: ["Évident endet auf -ent, also -emment.", "Weibliche Form évidente + -ment.", "Évident endet auf -ant, also -amment."],
          answer: 0,
          explanation: "Adjektive auf -ent bilden -emment. Gesprochen wird es trotzdem [evidamɑ̃].",
        },
      ],
      verdict:
        "Gentiment und mal sind unregelmäßig, vraiment hängt -ment an den Vokal, évidemment folgt der Regel -ent → -emment.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde die Adverbien und schreibe je einen kurzen Satz: 1. sérieux 2. vrai 3. récent 4. bon",
        hints: ["Prüfe die männliche Form: Vokal oder Konsonant am Ende?", "Denke an -ent → -emment und an die unregelmäßigen Formen."],
        model:
          "1. sérieusement: Il travaille sérieusement pour son examen. 2. vraiment: C’est vraiment génial! 3. récemment: J’ai récemment commencé un stage. 4. bien: Tu parles bien français.",
        criteria: ["Alle vier Adverbien sind richtig gebildet.", "Jedes Adverb bestimmt in seinem Satz ein Verb oder Adjektiv.", "Die Sätze sind richtig."],
      },
      2: {
        prompt:
          "Beschreibe in sechs bis acht Sätzen einen Mitschüler, eine Mitschülerin oder eine erfundene Person: wie sie ist (Adjektive) und wie sie Dinge tut (Adverbien). Verwende mindestens fünf verschiedene Adverbien, darunter bien oder mal und eines auf -amment oder -emment.",
        hints: ["Stelle Adjektiv und Adverb einander gegenüber: Elle est calme. Elle parle calmement.", "Achte auf die Stellung im passé composé."],
        model:
          "Mon ami Malik est très calme et toujours poli. Il parle calmement, même quand il est en colère. En classe, il écoute attentivement et il comprend vite. Il dessine bien, mais il chante mal, et il le sait! Il répond toujours poliment aux professeurs. Récemment, il a gagné un concours de dessin. Évidemment, nous étions tous fiers de lui.",
        criteria: ["Mindestens fünf Adverbien sind richtig gebildet.", "Adjektive und Adverbien sind richtig unterschieden.", "Bien oder mal und eine Form auf -amment/-emment kommen vor."],
      },
    },
    practice: {
      kind: "choose",
      title: "Adverbien: Übungsrunde",
      instruction: "Wähle die richtige Form. Eine Runde zählt, wenn alle drei Sätze richtig sind.",
      pool: {
        1: [
          { before: "Mon frère court ", options: ["vite", "rapide"], answer: 0, after: ".", feedback: "Es geht darum, wie er läuft: das Adverb vite." },
          { before: "C’est ", options: ["vraiment", "vrai"], answer: 0, after: " intéressant.", feedback: "Das Wort verstärkt ein Adjektiv: Adverb vraiment." },
          { before: "Elle chante ", options: ["bien", "bonne"], answer: 0, after: ".", feedback: "Es geht darum, wie sie singt: Adverb bien." },
          { before: "Réponds ", options: ["poliment", "polie"], answer: 0, after: " au directeur!", feedback: "Poli endet auf Vokal: poliment." },
          { before: "Il a ", options: ["mal", "mauvais"], answer: 0, after: " dormi.", feedback: "Wie er geschlafen hat: Adverb mal." },
          { before: "", options: ["Heureusement", "Heureux"], answer: 0, after: ", il fait beau.", feedback: "Das Wort bewertet den ganzen Satz: Adverb heureusement." },
          { before: "Elle parle ", options: ["doucement", "doux"], answer: 0, after: " au bébé.", feedback: "Weibliche Form douce + -ment: doucement." },
          { before: "Ils travaillent ", options: ["sérieusement", "sérieux"], answer: 0, after: ".", feedback: "Wie sie arbeiten: Adverb aus sérieuse + -ment." },
        ],
        2: [
          { before: "Pendant l’entretien d’embauche, il a répondu ", options: ["calmement", "calme", "calmment"], answer: 0, after: " à toutes les questions du chef d’entreprise.", feedback: "Wie er geantwortet hat: Adverb; weibliche Form calme + -ment." },
          { before: "Le bébé de nos voisins pleure ", options: ["constamment", "constantement", "constant"], answer: 0, after: " la nuit, alors nous dormons mal.", feedback: "Constant endet auf -ant: constamment." },
          { before: "Après trois mois en France, ma sœur parle ", options: ["mieux", "meilleur", "bien meilleur"], answer: 0, after: " français que moi, c’est un peu énervant.", feedback: "Der Vergleich beim Verb parler braucht das Adverb mieux." },
          { before: "Le guide nous a expliqué l’histoire du château ", options: ["patiemment", "patientement", "patient"], answer: 0, after: ", même quand les enfants faisaient du bruit.", feedback: "Patient endet auf -ent: patiemment." },
          { before: "Notre équipe a ", options: ["vraiment bien", "vraie bonne", "vrai bien"], answer: 0, after: " joué pendant la deuxième mi-temps du match.", feedback: "Beide Wörter bestimmen das Verb: die Adverbien vraiment und bien, zwischen Hilfsverb und Partizip." },
          { before: "Les résultats de l’enquête montrent ", options: ["clairement", "clair", "clairment"], answer: 0, after: " que les jeunes utilisent de plus en plus leur portable.", feedback: "Wie es gezeigt wird: Adverb aus claire + -ment." },
          { before: "Ma grand-mère nous a ", options: ["gentiment", "gentillement", "gentille"], answer: 0, after: " invités à passer tout le mois d’août chez elle en Provence.", feedback: "Gentil bildet unregelmäßig gentiment." },
          { before: "", options: ["Évidemment", "Évidentement", "Évident"], answer: 0, after: ", personne n’avait pensé à prendre un parapluie pour l’excursion.", feedback: "Évident endet auf -ent: évidemment; es bewertet den ganzen Satz." },
        ],
      },
    },
  },
];
