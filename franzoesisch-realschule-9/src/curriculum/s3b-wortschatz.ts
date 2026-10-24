import type { Lesson } from "../model/types";

/**
 * Stufe 3, zweiter Teil: Wortschatz und Aussprache (Kompetenzerwartungen 1.2.1.7 bis 1.2.1.10,
 * 1.2.3.1 und 1.2.3.2 sowie 1.1.8 und 3.1): Konnektoren, unbestimmte Begleiter, Umschreibungen,
 * Wörter erschließen und Aussprache.
 */
export const S3B: Lesson[] = [
  {
    id: "fr-konnektoren",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.7", "1.1.8"],
    title: "Konnektoren: donc, c’est pourquoi, comme, pour und mehr",
    intro:
      "Konnektoren verbinden Sätze und zeigen Grund, Folge, Zweck und Gegensatz. Mit ihnen werden deine Texte flüssiger.",
    paragraphs: [
      "**Folge:** donc (also) und c’est pourquoi (deshalb) zeigen, was aus etwas folgt. « Il pleut, donc je prends mon parapluie. », « Elle est fatiguée, c’est pourquoi elle se couche tôt. » Nach donc steht der normale Satz, nach c’est pourquoi ebenfalls: Es folgt Subjekt und Verb. **Grund:** parce que, car und comme geben die Ursache an. Comme (da, weil) steht oft am Satzanfang: « Comme il est malade, il reste à la maison. »",
      "**Zweck:** pour + Infinitiv (um zu): « Il étudie beaucoup pour réussir son examen. » **Gegensatz:** mais (aber) und **quand même** (trotzdem): « Il fait froid, mais je sors quand même. » **Steigerung:** même (sogar) steht vor dem Wort, das es betont: « Tout le monde est venu, même le professeur. »",
      "**Zeit und Bedingung:** quand (wenn, als) beschreibt einen Zeitpunkt, si (wenn, falls) eine Bedingung. « Quand je serai libre, je t’appellerai. », « Si tu viens, nous irons au cinéma. » Beachte die Wahl der Zeit nach quand und si (Lektionen zum futur simple und zur Bedingung). Mit si und quand gestaltest du zusammengesetzte Sätze mit mehr als einem Gedanken.",
      "Typische Fehler sind « Pour que partir » (richtig ist pour + Infinitiv), « Il pleut, donc prendre mon parapluie » (nach donc folgt ein vollständiger Satz mit Subjekt) und das Vermischen von comme (Grund) und comme (wie): « Comme il est malade » heißt „da er krank ist“, « fort comme un lion » heißt „stark wie ein Löwe“.",
    ],
    terms: [
      { term: "donc, c’est pourquoi", text: "Konnektoren der Folge: also, deshalb. Danach steht ein normaler Satz mit Subjekt und Verb." },
      { term: "pour + Infinitiv", text: "Der Zweck einer Handlung: um zu. Das Verb nach pour steht im Infinitiv." },
      { term: "quand même, même", text: "Quand même heißt trotzdem und steht im Satz nach dem Verb. Même heißt sogar und steht vor dem betonten Wort." },
    ],
    takeaway:
      "Folge: donc, c’est pourquoi. Grund: parce que, car, comme. Zweck: pour + Infinitiv. Gegensatz: mais, quand même. Steigerung: même. Zeit und Bedingung: quand, si.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie sagst du: „Er lernt viel, um die Prüfung zu bestehen“?",
      answer: "Il étudie beaucoup pour réussir son examen.",
      wrong: ["Il étudie beaucoup pour qu’il réussit son examen.", "Il étudie beaucoup donc réussir son examen."],
      explanation:
        "Der Zweck steht mit pour und dem Infinitiv, wenn das Subjekt gleich bleibt. Pour que verlangt einen anderen Modus, donc passt nicht zu einem Zweck.",
    },
    workshop: {
      kind: "choose",
      title: "Den passenden Konnektor wählen",
      instruction: "Frage dich: Geht es um Folge, Grund, Zweck, Gegensatz oder Steigerung?",
      items: [
        { before: "Il pleut, ", options: ["donc", "mais", "pour"], answer: 0, after: " je prends mon parapluie.", feedback: "Das Mitnehmen des Schirms folgt aus dem Regen, also donc." },
        { before: "", options: ["Comme", "Pour", "Même"], answer: 0, after: " il est malade, il reste à la maison aujourd’hui.", feedback: "Der Satz gibt einen Grund an: Comme am Satzanfang heißt „da“." },
        { before: "Il étudie beaucoup ", options: ["pour", "donc", "même"], answer: 0, after: " réussir son examen final.", feedback: "Ein Zweck wird mit pour + Infinitiv ausgedrückt." },
        { before: "Il fait froid, mais je sors ", options: ["quand même", "donc", "comme"], answer: 0, after: " avec mes amis.", feedback: "Quand même heißt „trotzdem“ und passt zum Gegensatz mit mais." },
        { before: "Tous les élèves sont venus, ", options: ["même", "donc", "pour"], answer: 0, after: " le prof de maths!", feedback: "Même vor dem Nomen heißt „sogar“." },
        { before: "Elle est fatiguée, ", options: ["c’est pourquoi", "pour que", "même"], answer: 0, after: " elle se couche tôt ce soir.", feedback: "C’est pourquoi leitet die Folge ein und steht vor einem normalen Satz." },
      ],
      conclusion: "Mit Konnektoren zeigst du Folge, Grund, Zweck, Gegensatz und Steigerung.",
    },
    casework: {
      title: "Eine E-Mail an die Gastfamilie",
      story:
        "Léa schreibt: « Comme je suis malade, je ne peux pas venir samedi. J’étudie quand même pour mon test. Je vous appelle donc dimanche, c’est pourquoi je reste à la maison. »",
      steps: [
        {
          question: "Was drückt « comme » am Satzanfang aus?",
          options: ["Einen Grund.", "Eine Frage.", "Einen Vergleich mit wie."],
          answer: 0,
          explanation: "Am Satzanfang bedeutet comme „da“ oder „weil“ und nennt eine Ursache.",
        },
        {
          question: "Was bedeutet « quand même »?",
          options: ["Trotzdem.", "Sogar jetzt.", "Immer noch."],
          answer: 0,
          explanation: "Quand même heißt „trotzdem“, auch wenn die Lage schwierig ist.",
        },
        {
          question: "Welche Funktion hat « donc »?",
          options: ["Es zeigt eine Folge.", "Es zeigt einen Zweck.", "Es zeigt einen Gegensatz."],
          answer: 0,
          explanation: "Donc heißt „also“ und zeigt, was aus dem Vorherigen folgt.",
        },
      ],
      verdict:
        "Die E-Mail verbindet mit comme, quand même, donc und c’est pourquoi Grund, Gegensatz und Folge. So entsteht ein zusammenhängender Text.",
    },
    tasks: {
      1: {
        prompt:
          "Verbinde die Sätze mit einem passenden Konnektor: 1. Il pleut. Je prends mon parapluie. 2. Elle travaille beaucoup. Elle veut réussir. 3. Il fait froid. Nous sortons.",
        hints: [
          "Frage dich, ob Folge, Zweck oder Gegensatz vorliegt.",
          "Für Zweck brauchst du pour + Infinitiv.",
        ],
        model:
          "1. Il pleut, donc je prends mon parapluie. 2. Elle travaille beaucoup pour réussir. 3. Il fait froid, mais nous sortons quand même. Satz 1 zeigt eine Folge (donc), Satz 2 einen Zweck (pour + Infinitiv), Satz 3 einen Gegensatz (mais, quand même).",
        criteria: [
          "Der Konnektor passt zur Beziehung zwischen den Sätzen.",
          "Pour steht mit Infinitiv.",
          "Die Sätze sind korrekt verbunden.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen zusammenhängenden Text von sechs bis acht Sätzen über einen Tag, an dem etwas schiefging. Verwende mindestens fünf verschiedene Konnektoren (donc, c’est pourquoi, comme, pour, quand même, même, quand, si).",
        hints: [
          "Plane Ursache, Folge und Gegensatz.",
          "Setze jeden Konnektor so, dass er einen Gedanken verbindet.",
        ],
        model:
          "Hier, comme il pleuvait, j’ai pris mon parapluie. Mais le vent était si fort que je l’ai perdu, c’est pourquoi je suis arrivé mouillé. J’ai couru pour ne pas arriver en retard, donc j’étais très fatigué. Même mon professeur a souri. Si je pars plus tôt demain, je serai sec. Je sors quand même avec mon ami.",
        criteria: [
          "Mindestens fünf verschiedene Konnektoren kommen vor.",
          "Jeder Konnektor verbindet zwei zusammengehörige Gedanken.",
          "Der Text ist als Ganzes verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Konnektoren: Übungsrunde",
      instruction: "Wähle für jede Lücke den passenden Konnektor. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Il est malade, ", options: ["donc", "pour"], answer: 0, after: " il reste au lit.", feedback: "Die Folge der Krankheit steht mit donc." },
          { before: "Il travaille ", options: ["pour", "donc"], answer: 0, after: " gagner de l’argent.", feedback: "Der Zweck steht mit pour + Infinitiv." },
          { before: "Elle est fatiguée, ", options: ["mais", "donc"], answer: 0, after: " elle sort avec ses amis.", feedback: "Hier steht ein Gegensatz zur Müdigkeit." },
          { before: "", options: ["Comme", "Même"], answer: 0, after: " il pleut, nous restons à la maison.", feedback: "Comme am Satzanfang nennt den Grund." },
          { before: "Tout le monde danse, ", options: ["même", "donc"], answer: 0, after: " le directeur de l’école.", feedback: "Même heißt hier „sogar“ und steht vor le directeur." },
          { before: "Il a froid, ", options: ["c’est pourquoi", "pour que"], answer: 0, after: " il met son manteau.", feedback: "C’est pourquoi leitet die Folge ein." },
          { before: "Je sors ", options: ["quand même", "donc"], answer: 0, after: " sous la pluie.", feedback: "Quand même heißt „trotzdem“ und passt zu einem Gegensatz." },
          { before: "", options: ["Si", "Comme"], answer: 0, after: " tu viens, nous irons au cinéma.", feedback: "Si leitet eine Bedingung ein, nach si steht das Präsens." },
        ],
        2: [
          { before: "Mon frère doit se lever très tôt demain, ", options: ["c’est pourquoi", "pour que", "même"], answer: 0, after: " il se couche déjà à neuf heures ce soir, avant tout le monde.", feedback: "C’est pourquoi leitet die Folge ein." },
          { before: "Nous avons pris le train de six heures ", options: ["pour", "donc", "comme"], answer: 0, after: " arriver à temps à Lyon, parce que la réunion commençait à neuf heures.", feedback: "Ein Zweck steht mit pour + Infinitiv." },
          { before: "Il faisait très mauvais temps, mais nous sommes sortis ", options: ["quand même", "donc", "parce que"], answer: 0, after: " et nous avons fait une longue promenade au bord du lac.", feedback: "Quand même drückt hier den Gegensatz aus." },
          { before: "", options: ["Comme", "Même", "Pour"], answer: 0, after: " le train avait du retard, nous avons attendu plus d’une heure sur le quai.", feedback: "Comme am Satzanfang nennt den Grund." },
          { before: "Tous mes amis sont venus à la fête, ", options: ["même", "donc", "pour"], answer: 0, after: " ceux qui habitent loin de la ville et qui ont peu de temps.", feedback: "Même betont, dass auch die Fernsten kamen." },
          { before: "Il n’a pas fini ses devoirs, ", options: ["donc", "même", "pour"], answer: 0, after: " il ne peut pas sortir ce soir avec ses amis avant d’avoir terminé.", feedback: "Donc zeigt die Folge: Weil er nicht fertig ist, darf er nicht gehen." },
          { before: "Nous mangerons dehors ", options: ["si", "comme", "même"], answer: 0, after: " le temps reste beau jusqu’à ce soir, sinon nous resterons dans la cuisine.", feedback: "Si leitet eine Bedingung ein, nach si steht das Präsens." },
          { before: "Je t’appellerai ", options: ["quand", "donc", "même"], answer: 0, after: " je serai arrivé chez mes grands-parents et que j’aurai posé mes affaires.", feedback: "Quand leitet hier einen Zeitpunkt in der Zukunft ein." },
        ],
      },
    },
  },
  {
    id: "fr-indefinis",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.8"],
    title: "chaque, chacun, quelques, plusieurs, certains",
    intro:
      "Diese unbestimmten Begleiter und Pronomen geben Mengen an. Du musst wissen, ob sie vor einem Nomen stehen und wie sie sich anpassen.",
    paragraphs: [
      "**chaque** (jeder, jede) steht vor einem Nomen im Singular und verändert sich nicht: « chaque élève », « chaque jour ». Das Verb steht im Singular: « Chaque élève a un ordinateur. » **chacun / chacune** (jeder, jede einzelne) steht allein ohne Nomen: « Chacun a son avis. », « Chacune des filles a gagné. » Es richtet sich nach dem Geschlecht der Person.",
      "**quelques** (einige, ein paar) steht vor einem Nomen im Plural: « quelques amis », « quelques minutes ». Es bedeutet eine kleine Anzahl. **plusieurs** (mehrere) steht ebenfalls vor einem Plural und ändert sich nie, auch nicht im Femininum: « plusieurs films », « plusieurs filles ». Es klingt nach einer größeren Zahl als quelques.",
      "**certain(e)s** (manche, gewisse) steht im Plural vor einem Nomen und richtet sich nach ihm: « certains élèves » (männlich), « certaines filles » (weiblich). Es kann auch allein stehen: « Certains aiment ça, d’autres non. » Beim Vergleich der Mengen helfen dir Gruppen: quelques (wenige), plusieurs (mehrere), certains (manche, aber nicht alle).",
      "Typische Fehler sind « chaque élèves » (Singular nach chaque), « plusieures » (plusieurs hat keine weibliche Form) und « chaque a » statt « chacun a » (chaque braucht ein Nomen, chacun steht allein).",
    ],
    terms: [
      { term: "chaque und chacun", text: "Chaque steht vor einem Singular-Nomen: chaque élève. Chacun steht allein: Chacun a son avis." },
      { term: "quelques und plusieurs", text: "Beide stehen vor einem Plural. Quelques meint eine kleine Zahl, plusieurs mehrere. Plusieurs ändert sich nie." },
      { term: "certains, certaines", text: "Manche, aber nicht alle. Es richtet sich nach dem Geschlecht des Nomens: certains élèves, certaines filles." },
    ],
    takeaway:
      "Chaque + Singular, chacun allein. Quelques und plusieurs + Plural, plusieurs bleibt unverändert. Certains und certaines richten sich nach dem Nomen. Das Verb steht bei chaque und chacun im Singular.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "Chaque élève a un ordinateur.",
      wrong: ["Chaque élèves a un ordinateur.", "Chacun élève a un ordinateur."],
      explanation:
        "Chaque steht vor einem Nomen im Singular, und das Verb bleibt im Singular. Chacun steht dagegen allein, ohne Nomen.",
    },
    workshop: {
      kind: "choose",
      title: "Den passenden Begleiter wählen",
      instruction: "Achte darauf, ob ein Nomen folgt, ob Singular oder Plural nötig ist und ob das Nomen männlich oder weiblich ist.",
      items: [
        { before: "", options: ["Chaque", "Chacun", "Plusieurs"], answer: 0, after: " élève a un ordinateur dans cette classe.", feedback: "Vor einem Singular-Nomen steht chaque." },
        { before: "Nous avons invité ", options: ["quelques", "chaque", "chacun"], answer: 0, after: " amis à la fête, pas tous.", feedback: "Quelques steht vor einem Plural und meint eine kleine Zahl." },
        { before: "Les enfants sont contents: ", options: ["chacun", "chaque", "plusieurs"], answer: 0, after: " a reçu un livre.", feedback: "Chacun steht allein und meint jeden Einzelnen." },
        { before: "", options: ["Certaines", "Certains", "Chacune"], answer: 0, after: " filles de ma classe font du judo.", feedback: "Filles ist weiblich im Plural, also certaines." },
        { before: "J’ai vu ", options: ["plusieurs", "plusieures", "chaque"], answer: 0, after: " films cette semaine au cinéma.", feedback: "Plusieurs ändert sich nie und steht vor einem Plural." },
      ],
      conclusion: "Chaque braucht ein Singular-Nomen, chacun steht allein, quelques und plusieurs nehmen einen Plural, certains richtet sich nach dem Nomen.",
    },
    casework: {
      title: "Ein Bericht über die Klasse",
      story:
        "Im Bericht steht: « Chaque élève a choisi un thème. Certains travaillent seuls, d’autres en groupe. Quelques élèves ont déjà fini et plusieurs ont besoin d’aide. Chacun présentera son travail vendredi. »",
      steps: [
        {
          question: "Warum steht « a » (Singular) nach « chaque élève »?",
          options: ["Chaque verlangt Singular.", "Élève ist hier ein Verb.", "Weil a immer im Singular steht."],
          answer: 0,
          explanation: "Chaque + Nomen im Singular verlangt auch ein Verb im Singular.",
        },
        {
          question: "Was bedeutet « certains travaillent seuls »?",
          options: ["Manche, aber nicht alle.", "Alle ohne jede Ausnahme.", "Niemand in der ganzen Gruppe."],
          answer: 0,
          explanation: "Certains meint einen Teil der Gruppe, nicht alle.",
        },
        {
          question: "Warum steht in « Chacun présentera » kein Nomen?",
          options: ["Chacun steht allein.", "Chacun ersetzt das Verb.", "Weil présentera ein Nomen ist."],
          answer: 0,
          explanation: "Chacun ist ein Pronomen und steht ohne Nomen.",
        },
      ],
      verdict:
        "Der Bericht nutzt chaque, certains, quelques, plusieurs und chacun und beschreibt so Mengen in der Klasse.",
    },
    tasks: {
      1: {
        prompt:
          "Ergänze: 1. … élève a un livre. 2. J’ai invité … amis. 3. … des filles a gagné.",
        hints: [
          "Prüfe, ob ein Nomen folgt und ob Singular oder Plural gemeint ist.",
          "Chacune richtet sich nach dem Geschlecht.",
        ],
        model:
          "1. Chaque élève a un livre. 2. J’ai invité quelques amis. 3. Chacune des filles a gagné. Chaque steht vor einem Singular, quelques vor einem Plural, und chacune steht allein, weil von Mädchen die Rede ist.",
        criteria: [
          "Chaque steht vor einem Singular-Nomen.",
          "Quelques oder plusieurs stehen vor einem Plural.",
          "Chacun oder chacune steht allein und passt zum Geschlecht.",
        ],
      },
      2: {
        prompt:
          "Schreibe fünf bis sechs Sätze über deine Klasse oder deine Freunde. Verwende chaque, chacun oder chacune, quelques, plusieurs und certains oder certaines.",
        hints: [
          "Denke an Mengen: wenige, mehrere, manche, jeder.",
          "Achte auf Singular und Plural.",
        ],
        model:
          "Dans ma classe, chaque élève joue d’un instrument ou fait du sport. Quelques élèves jouent du piano et plusieurs font du football. Certains préfèrent le basket, d’autres le judo. Chacun a un hobby différent, et chacune des filles est très motivée.",
        criteria: [
          "Chaque, chacun, quelques, plusieurs und certains kommen vor.",
          "Singular und Plural sind richtig gesetzt.",
          "Der Text beschreibt die Gruppe verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Unbestimmte Begleiter: Übungsrunde",
      instruction: "Wähle für jede Lücke die richtige Form. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "", options: ["Chaque", "Plusieurs"], answer: 0, after: " matin, je prends le bus.", feedback: "Vor einem Singular-Nomen steht chaque." },
          { before: "J’ai acheté ", options: ["quelques", "chaque"], answer: 0, after: " livres hier.", feedback: "Vor einem Plural steht quelques." },
          { before: "", options: ["Chacun", "Chaque"], answer: 0, after: " a son propre avis sur ce film.", feedback: "Chacun steht allein, ohne Nomen danach." },
          { before: "Elle a vu ", options: ["plusieurs", "plusieures"], answer: 0, after: " films ce mois-ci.", feedback: "Plusieurs ändert sich nie, auch nicht im Femininum." },
          { before: "", options: ["Certains", "Chaque"], answer: 0, after: " élèves aiment le sport.", feedback: "Certains steht vor einem männlichen Plural." },
          { before: "", options: ["Certaines", "Certains"], answer: 0, after: " filles jouent au foot.", feedback: "Filles ist weiblich, also certaines." },
          { before: "Chacune des filles ", options: ["a gagné", "ont gagné"], answer: 0, after: " une médaille.", feedback: "Chacune verlangt das Verb im Singular." },
          { before: "Nous avons ", options: ["quelques", "chaque"], answer: 0, after: " amis à Lyon.", feedback: "Quelques steht vor einem Plural." },
        ],
        2: [
          { before: "Dans notre école, ", options: ["chaque", "chacun", "plusieurs"], answer: 0, after: " classe organise une excursion à la fin de l’année scolaire.", feedback: "Vor einem Singular-Nomen steht chaque." },
          { before: "Mes parents ont invité ", options: ["quelques", "chaque", "chacun"], answer: 0, after: " voisins pour fêter l’anniversaire de ma sœur, mais pas tout le quartier.", feedback: "Quelques steht vor einem Plural und meint eine kleine Zahl." },
          { before: "J’ai lu ", options: ["plusieurs", "plusieures", "chaque"], answer: 0, after: " livres pendant les vacances, et j’en ai aimé presque tous.", feedback: "Plusieurs ändert sich nie und steht vor einem Plural." },
          { before: "Les élèves ont reçu une carte de bibliothèque: ", options: ["chacun", "chaque", "plusieurs"], answer: 0, after: " pourra emprunter trois livres par semaine pendant toute l’année.", feedback: "Chacun steht allein und meint jeden Einzelnen." },
          { before: "", options: ["Certaines", "Certains", "Chaque"], answer: 0, after: " filles de ma classe font de la danse, tandis que d’autres préfèrent le théâtre.", feedback: "Filles ist weiblich im Plural, also certaines." },
          { before: "", options: ["Chacune", "Chacun", "Chaque"], answer: 0, after: " des filles a présenté son projet devant la classe avec beaucoup de confiance.", feedback: "Chacune steht allein und richtet sich nach filles." },
          { before: "Nous avons visité ", options: ["plusieurs", "chaque", "chacune"], answer: 0, after: " musées à Paris pendant le voyage scolaire, mais nous n’avons pas tout vu.", feedback: "Plusieurs steht vor einem Plural." },
          { before: "", options: ["Certains", "Certaine", "Chacun"], answer: 0, after: " élèves préfèrent travailler seuls, d’autres aiment les travaux en groupe.", feedback: "Certains steht vor einem männlichen Plural." },
        ],
      },
    },
  },
  {
    id: "fr-umschreiben",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.9"],
    title: "Umschreiben, Synonyme und Antonyme",
    intro:
      "Wenn dir ein Wort fehlt, hilft eine Umschreibung oder ein Gegenteil. Das macht dich in Gesprächen sicher.",
    paragraphs: [
      "Wenn du ein Wort nicht kennst, umschreibst du es: « C’est un objet qui sert à ouvrir une bouteille. » (ein Flaschenöffner) « C’est quelqu’un qui travaille à l’hôpital. » (ein Arzt oder eine Pflegekraft) « C’est le contraire de grand. » (klein) Nützliche Muster sind **c’est un truc qui …**, **c’est une personne qui …**, **ça sert à …**, **c’est comme …**, **c’est le contraire de …**.",
      "**Synonyme** haben eine ähnliche Bedeutung: content – heureux – ravi, grand – énorme, beau – joli, commencer – débuter, parler – dire. **Antonyme** sind Gegensätze: grand – petit, facile – difficile, ouvrir – fermer, monter – descendre, arriver – partir, tôt – tard, plein – vide, jeune – âgé. Mit ihnen weichst du aus, wenn dir ein Wort nicht einfällt: « Pas facile » statt « difficile ».",
      "Oberbegriffe helfen ebenfalls: Statt des genauen Wortes sagst du ein allgemeineres: « Un fruit » statt « une pomme », « un instrument » statt « un violon ». Das nennt man Kompensationsstrategie. Für Unterbegriffe nennst du ein typisches Beispiel: « C’est un animal, comme un chien, mais plus petit. »",
      "Typische Fehler sind Synonyme, die nicht überall passen (« content » und « heureux » sind nicht immer austauschbar), und Umschreibungen, die zu lang werden. Halte sie einfach: Ein Satz reicht, um verstanden zu werden.",
    ],
    terms: [
      { term: "Umschreibung", text: "Ein Satz, der ein fehlendes Wort erklärt: C’est un objet qui sert à ouvrir une bouteille." },
      { term: "Synonym und Antonym", text: "Ein Synonym hat eine ähnliche Bedeutung (content – heureux), ein Antonym die gegenteilige (facile – difficile)." },
      { term: "Oberbegriff", text: "Ein allgemeineres Wort, das ein genaues ersetzt: un fruit statt une pomme." },
    ],
    takeaway:
      "Fehlt dir ein Wort, umschreibe es (c’est un truc qui …, ça sert à …), nutze ein Synonym oder das Gegenteil (c’est le contraire de …) oder einen Oberbegriff. Halte es kurz und einfach.",
    sourceIds: ["lp", "lepointdufle", "cnrtl"],
    quiz: {
      question: "Wie umschreibst du „Flaschenöffner“, wenn dir das Wort fehlt?",
      answer: "C’est un objet qui sert à ouvrir une bouteille.",
      wrong: ["C’est un objet qui sert à fermer une fenêtre.", "C’est un objet que sert à ouvrir une bouteille."],
      explanation:
        "Die Umschreibung nennt die Funktion mit qui sert à + Infinitiv. Nur qui passt, weil der Gegenstand das Subjekt des Relativsatzes ist.",
    },
    workshop: {
      kind: "classify",
      title: "Synonym, Antonym oder Umschreibung?",
      instruction: "Ordne jeden Satz seiner Strategie zu.",
      categories: ["Synonym", "Antonym", "Umschreibung"],
      entries: [
        { text: "Pour « content », on peut aussi dire « heureux ».", target: 0, feedback: "Content und heureux haben eine ähnliche Bedeutung." },
        { text: "Le contraire de « facile », c’est « difficile ».", target: 1, feedback: "Facile und difficile sind Gegensätze." },
        { text: "Je ne trouve pas le mot: c’est un objet qui sert à ouvrir une bouteille.", target: 2, feedback: "Hier wird das fehlende Wort mit einer Funktion erklärt." },
        { text: "Au lieu de « commencer », tu peux dire « débuter ».", target: 0, feedback: "Commencer und débuter bedeuten dasselbe." },
        { text: "Pour « arriver », le contraire est « partir ».", target: 1, feedback: "Arriver und partir sind Gegensätze." },
        { text: "C’est quelqu’un qui travaille à l’hôpital et qui soigne les malades.", target: 2, feedback: "Hier wird ein Beruf umschrieben, statt ihn zu nennen." },
      ],
      conclusion: "Synonyme sind ähnlich, Antonyme gegensätzlich, Umschreibungen erklären, was das fehlende Wort bedeutet.",
    },
    casework: {
      title: "Im Restaurant ohne Vokabeln",
      story:
        "Ein Schüler im Restaurant: « Excusez-moi, je ne sais pas le mot. C’est un truc qui sert à couper la viande. C’est le contraire de la cuillère: ce n’est pas pour la soupe. »",
      steps: [
        {
          question: "Welche Strategie nutzt « un truc qui sert à couper la viande »?",
          options: ["Eine Umschreibung über die Funktion.", "Ein Synonym für das fehlende Wort.", "Ein Gegenteil des fehlenden Worts."],
          answer: 0,
          explanation: "Die Funktion des Gegenstands wird erklärt, das Wort selbst fehlt.",
        },
        {
          question: "Wofür steht « c’est le contraire de »?",
          options: ["Ein Gegenteil.", "Ein Synonym des Worts.", "Eine Frage zum Wort."],
          answer: 0,
          explanation: "C’est le contraire de leitet ein Gegenwort ein.",
        },
        {
          question: "Welches Wort ist gemeint?",
          options: ["Un couteau.", "Une fourchette.", "Un verre."],
          answer: 0,
          explanation: "Ein Messer schneidet. Mit einer Gabel steckt man Dinge auf, ein Glas dient zum Trinken.",
        },
      ],
      verdict:
        "Auch ohne das Wort kommt der Schüler ans Ziel: mit Umschreibung und Gegensatz. Das ist eine wichtige Strategie in echten Gesprächen.",
    },
    tasks: {
      1: {
        prompt:
          "Umschreibe auf Französisch in je einem Satz: 1. eine Brille 2. ein Lehrer 3. ein Fahrrad. Verwende ça sert à, c’est quelqu’un qui oder c’est un truc qui.",
        hints: [
          "Nenne Funktion oder Tätigkeit, nicht das Wort selbst.",
          "Halte jeden Satz kurz.",
        ],
        model:
          "1. C’est un objet qui sert à mieux voir. 2. C’est quelqu’un qui enseigne à l’école. 3. C’est un truc avec deux roues qui sert à se déplacer. Jede Umschreibung nennt eine Funktion oder Tätigkeit, ohne das gesuchte Wort selbst zu verwenden.",
        criteria: [
          "Das gesuchte Wort wird nicht genannt.",
          "Mindestens ein Muster wie ça sert à oder c’est quelqu’un qui kommt vor.",
          "Die Umschreibung ist verständlich.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Dialog (fünf bis sechs Zeilen), in dem du in einem Geschäft etwas suchst, dessen Namen du nicht kennst. Verwende eine Umschreibung, ein Gegenteil und ein Synonym.",
        hints: [
          "Beginne mit « Bonjour, je cherche un truc qui … ».",
          "Nutze « C’est le contraire de … » und « ou plutôt … ».",
        ],
        model:
          "– Bonjour, je cherche un truc qui sert à écrire. – Un stylo? – Non, c’est le contraire d’un stylo: ça s’efface. – Un crayon? – Oui, c’est ça! Je voudrais un crayon, ou plutôt une gomme aussi. – Voilà, c’est joli et pratique.",
        criteria: [
          "Eine Umschreibung, ein Gegenteil und ein Synonym kommen vor.",
          "Der Dialog ist sinnvoll und verständlich.",
          "Das fehlende Wort wird erschlossen, nicht übersetzt.",
        ],
      },
    },
  },
  {
    id: "fr-erschliessen-wortbildung",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.10", "3.1"],
    title: "Wörter erschließen: Wortfamilie, Präfix und Suffix",
    intro:
      "Mit Wortfamilien, Vor- und Nachsilben und ähnlichen Wörtern in anderen Sprachen erschließt du viele unbekannte Wörter selbst.",
    paragraphs: [
      "Viele französische Wörter erkennst du an ihrer **Wortfamilie**: travail – travailler – travailleur – travailleuse; un jardin – jardiner – un jardinier; la musique – un musicien. Wenn du den Stamm kennst, verstehst du die Verwandten. Außerdem helfen **ähnliche Wörter in anderen Sprachen**: information, problème, restaurant, important sind Deutsch, Englisch und Französisch ähnlich. Vorsicht bei falschen Freunden: Eine bibliothèque ist eine Bücherei, kein Buchladen.",
      "**Präfixe** (Vorsilben) verändern die Bedeutung: **re-** (wieder): refaire, relire; **dé-** (Gegenteil): défaire, déplacer; **in-/im-** (un-): impossible, inutile; **pré-** (vor): prévoir; **sur-** (über): surprendre. **Suffixe** (Nachsilben) bilden neue Wortarten: **-eur / -euse** (Person): travailleur; **-tion** (Nomen): information; **-ment** (Adverb): rapidement, lentement; **-able** (möglich): faisable.",
      "Auch Kontext und Bilder erschließen Bedeutung: Steht « une gare » neben « un train » und « un billet », ahnst du, was gemeint ist. Texte mit Abbildungen, Symbolen und Überschriften helfen dir ebenfalls. Strategie: Zuerst das Wort im Satz lesen, dann Stamm und Endung zerlegen, dann überlegen, welche Wörter du kennst, die ähnlich aussehen.",
      "Typische Fehler sind das Verwechseln ähnlich aussehender Wörter (la chance heißt Glück, actuellement heißt zurzeit und nicht „tatsächlich“, un gymnase ist eine Turnhalle) und das Bilden von Wörtern, die es nicht gibt: « informement » existiert nicht, richtig ist information.",
    ],
    terms: [
      { term: "Wortfamilie", text: "Wörter mit demselben Stamm: travail, travailler, travailleur. Wer den Stamm kennt, erschließt den Rest." },
      { term: "Präfix", text: "Eine Vorsilbe wie re-, dé-, in- oder pré-, die die Bedeutung ändert: refaire, défaire, impossible." },
      { term: "Suffix", text: "Eine Nachsilbe wie -eur, -tion, -ment oder -able, die oft die Wortart ändert: information, rapidement." },
    ],
    takeaway:
      "Erschließe Wörter über Wortfamilie, Präfix (re-, dé-, in-, pré-), Suffix (-eur, -tion, -ment, -able), Kontext und ähnliche Wörter. Achte auf falsche Freunde.",
    sourceIds: ["lp", "cnrtl", "lepointdufle"],
    quiz: {
      question: "Wie heißt das Gegenteil von « possible »?",
      answer: "impossible",
      wrong: ["dépossible", "malpossible"],
      explanation:
        "Das Präfix in- (vor p: im-) bildet das Gegenteil: impossible. Dé- und mal- sind andere Präfixe, die mit possible keine Form bilden.",
    },
    workshop: {
      kind: "choose",
      title: "Wörter erschließen und bilden",
      instruction: "Nutze Präfix, Suffix und Wortfamilie, um das passende Wort zu wählen.",
      items: [
        { before: "Le contraire de « possible » est ", options: ["impossible", "dépossible", "malpossible"], answer: 0, after: ", comme dans « mission impossible ».", feedback: "Vor p wird das Präfix in- zu im-: impossible." },
        { before: "Quelqu’un qui travaille, c’est un ", options: ["travailleur", "travailment", "travailtion"], answer: 0, after: " ou une travailleuse.", feedback: "Das Suffix -eur bildet aus travailler die Person." },
        { before: "Faire quelque chose encore une fois, on dit ", options: ["refaire", "défaire", "surfaire"], answer: 0, after: " dans la langue de tous les jours.", feedback: "Das Präfix re- bedeutet „wieder“: refaire." },
        { before: "Le nom de l’action « informer » est une ", options: ["information", "informement", "informeur"], answer: 0, after: " dans un journal ou à la radio.", feedback: "Das Suffix -tion bildet aus informer das Nomen information." },
        { before: "Pour l’adverbe de « rapide », on ajoute -ment: ", options: ["rapidement", "rapidation", "rapideur"], answer: 0, after: ", comme dans « il court rapidement ».", feedback: "Das Suffix -ment bildet aus dem Adjektiv rapide das Adverb rapidement." },
      ],
      conclusion: "Präfix und Suffix helfen, neue Wörter zu bilden und fremde zu verstehen.",
    },
    casework: {
      title: "Ein unbekanntes Wort im Text",
      story:
        "In einem Text liest du: « Le jardinier a replanté les fleurs. Cette tâche est impossible à terminer en un jour. »",
      steps: [
        {
          question: "Was bedeutet « jardinier »?",
          options: ["Gärtner.", "Gartentor.", "Garten."],
          answer: 0,
          explanation: "Jardin ist der Garten, das Suffix -ier bildet die Berufsbezeichnung: jardinier.",
        },
        {
          question: "Was bedeutet das Präfix in « replanté »?",
          options: ["Wieder.", "Gegenteil.", "Vor."],
          answer: 0,
          explanation: "Re- heißt „wieder“: replanter bedeutet erneut pflanzen.",
        },
        {
          question: "Was bedeutet « impossible »?",
          options: ["Unmöglich.", "Möglich.", "Nützlich."],
          answer: 0,
          explanation: "Das Präfix im- bildet das Gegenteil von possible.",
        },
      ],
      verdict:
        "Aus Stamm, Präfix und Suffix erschließt der Text drei Bedeutungen, ohne ein Wörterbuch zu brauchen.",
    },
    tasks: {
      1: {
        prompt:
          "Bilde Wörter: 1. das Gegenteil von « utile » 2. die Person zu « chanter » 3. das Nomen zu « décider ».",
        hints: [
          "Denke an in-/im-, -eur/-euse und -tion.",
          "Prüfe, ob das Wort im Französischen existiert.",
        ],
        model:
          "1. inutile 2. un chanteur oder une chanteuse 3. la décision. Das Präfix in- bildet das Gegenteil, das Suffix -eur oder -euse bezeichnet die Person, und -ion bildet das Nomen décision aus décider.",
        criteria: [
          "Das Gegenteil wird mit in- gebildet.",
          "Die Person wird mit -eur oder -euse bezeichnet.",
          "Das Nomen ist richtig gebildet.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Text von vier bis fünf Sätzen, in dem du mindestens fünf Wörter verwendest, die du aus Wortfamilie, Präfix oder Suffix gebildet hast (zum Beispiel refaire, impossible, un travailleur, une information, rapidement).",
        hints: [
          "Schreibe die gebildeten Wörter am Rand auf und prüfe ihre Bedeutung.",
          "Nutze verschiedene Wortbildungen.",
        ],
        model:
          "Je dois refaire mon exposé parce que mon professeur trouve mon plan impossible à suivre. J’ai besoin d’une bonne information sur le sujet. Mon frère est un grand travailleur, il fait ses devoirs rapidement. Je vais relire mon texte et le corriger avant demain.",
        criteria: [
          "Mindestens fünf gebildete Wörter kommen vor.",
          "Präfix und Suffix sind richtig eingesetzt.",
          "Der Text ist verständlich.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "Wortbildung: Übungsrunde",
      instruction: "Wähle das richtig gebildete Wort. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "Le contraire de « utile » est ", options: ["inutile", "déutile"], answer: 0, after: " dans ce cas.", feedback: "Das Präfix in- bildet das Gegenteil von utile." },
          { before: "Quelqu’un qui chante est un ", options: ["chanteur", "chantation"], answer: 0, after: " de rock.", feedback: "Das Suffix -eur bezeichnet die Person." },
          { before: "Lire encore une fois: ", options: ["relire", "délire"], answer: 0, after: " le texte.", feedback: "Re- heißt „wieder“: relire heißt noch einmal lesen." },
          { before: "Le nom de « décider » est ", options: ["décision", "déciment"], answer: 0, after: " du groupe.", feedback: "Das Suffix -ion bildet das Nomen." },
          { before: "L’adverbe de « lent » est ", options: ["lentement", "lentation"], answer: 0, after: " dans cette phrase.", feedback: "Das Suffix -ment bildet das Adverb." },
          { before: "Le contraire de « heureux » est ", options: ["malheureux", "déheureux"], answer: 0, after: " ou triste.", feedback: "Das Präfix mal- bildet hier das Gegenteil." },
          { before: "Le contraire de « faire » est ", options: ["défaire", "refaire"], answer: 0, after: " quand on vide sa valise.", feedback: "Das Präfix dé- bildet das Gegenteil: défaire." },
          { before: "Quelqu’un qui travaille: ", options: ["un travailleur", "un travailment"], answer: 0, after: " du bâtiment.", feedback: "Das Suffix -eur bezeichnet die Person." },
        ],
        2: [
          { before: "Pour dire le contraire de « possible » dans cette phrase, on écrit: Il est ", options: ["impossible", "dépossible", "malpossible"], answer: 0, after: " de terminer ce travail avant midi sans l’aide de nos collègues.", feedback: "Vor p wird in- zu im-: impossible." },
          { before: "Dans le journal, on lit toujours une ", options: ["information", "informement", "informeur"], answer: 0, after: " sur la vie des gens de la région et sur l’actualité du monde.", feedback: "Das Suffix -tion bildet aus informer das Nomen information." },
          { before: "Mon professeur de sport est un grand ", options: ["entraîneur", "entraînation", "entraînement"], answer: 0, after: " et nos résultats de l’année dernière sont excellents.", feedback: "Das Suffix -eur bezeichnet die Person, die jemanden trainiert." },
          { before: "Quand il a fini son dessin, il l’a ", options: ["recommencé", "décommencé", "précommencé"], answer: 0, after: " parce qu’il n’était pas satisfait du résultat, et il a travaillé deux heures de plus.", feedback: "Re- heißt „wieder“: recommencer bedeutet noch einmal anfangen." },
          { before: "Le train arrive ", options: ["rapidement", "rapideur", "rapidation"], answer: 0, after: " à la gare de Lyon, car il n’y a pas d’arrêt entre les deux villes.", feedback: "Das Suffix -ment bildet aus rapide das Adverb." },
          { before: "Ce travail est trop ", options: ["difficile", "difficulté", "difficilement"], answer: 0, after: " pour moi, je demanderai de l’aide à mon professeur après la classe.", feedback: "Hier steht ein Adjektiv zu ce travail." },
          { before: "Ce sont des jeunes très ", options: ["travailleurs", "travaillements", "travaillations"], answer: 0, after: " qui font toujours leurs devoirs avant d’aller jouer dehors avec leurs amis.", feedback: "Das Suffix -eur bildet hier das Adjektiv travailleurs im Plural." },
          { before: "Avant de partir en voyage, il faut bien ", options: ["préparer", "déparer", "reparer"], answer: 0, after: " sa valise et vérifier que tous les papiers sont dans le sac à dos.", feedback: "Préparer heißt vorbereiten, mit dem Präfix pré- (vor)." },
        ],
      },
    },
  },
  {
    id: "fr-aussprache",
    lb: 3,
    unit: "1.2.3",
    covers: ["1.2.3.1", "1.2.3.2"],
    title: "Aussprache und Intonation: Liaison, stumme Buchstaben und Hilfsmittel",
    intro:
      "Viele französische Buchstaben bleiben stumm, und manche Laute entstehen erst durch die Bindung. Mit Hilfsmitteln klärst du Aussprache selbst.",
    paragraphs: [
      "Im Französischen werden viele Endbuchstaben nicht gesprochen: petit [pəti], grand [grɑ̃], trois [trwa], ils parlent [il parl]. Aber vor einem Vokal oder stummen h werden manche Endkonsonanten gebunden (**liaison**): « les amis » [le zami], « un petit ami » [œ̃ pəti tami], « chez eux » [ʃe zø], « ils ont » [il zɔ̃]. Bei einem **aspirierten h** gibt es keine Bindung: « les haricots », « les héros ».",
      "Auch ohne Bindung wird eine Aussprache fließend durch den **enchaînement**: Der Endkonsonant eines Wortes wird zum Anfang der nächsten Silbe: « il arrive » [i la riv]. Nasale Laute entstehen durch an, en (ã), on (õ), in, ain, un (ɛ̃, œ̃): « maison », « enfant », « pain », « un ». Das stumme **-e** am Wortende wird nicht gesprochen, macht aber den davor stehenden Konsonanten hörbar: petit – petite.",
      "Die Satzmelodie hilft dir, Aussagen und Fragen zu unterscheiden. Bei einer Aussage fällt die Stimme am Ende: « Tu viens. » Bei einer Frage steigt sie: « Tu viens? » Bei Aufzählungen bleibt sie oben und fällt erst beim letzten Glied. So erkennst du auch ohne est-ce que, ob eine Frage gestellt wird.",
      "Bei unbekannten Wörtern schließt du aus der Schreibung auf die Aussprache, soweit es Regeln gibt (ch = [ʃ], ou = [u], eau = [o]). Für den Rest nutzt du elektronische Hilfsmittel: Online-Wörterbücher wie Larousse oder das CNRTL zeigen Lautschrift, viele bieten eine Hörprobe, und Sprachprogramme lassen dich Wörter wiederholen und vergleichen. Dort prüfst du, ob du ein Wort so aussprichst, wie es klingt.",
    ],
    terms: [
      { term: "liaison", text: "Die Bindung eines sonst stummen Endkonsonanten an einen folgenden Vokal: les amis [le zami]. Vor aspiriertem h gibt es keine Bindung." },
      { term: "enchaînement", text: "Der gesprochene Endkonsonant wandert zur nächsten Silbe: il arrive [i la riv]." },
      { term: "Intonation", text: "Die Satzmelodie: Aussagen fallen am Ende, Fragen steigen. Sie zeigt, ob jemand eine Frage stellt." },
    ],
    takeaway:
      "Endkonsonanten sind oft stumm, vor Vokal und stummem h binden manche (les amis). Bei aspiriertem h gibt es keine Bindung. Aussagen fallen, Fragen steigen. Unbekannte Aussprache klärst du mit Online-Wörterbuch und Hörprobe.",
    sourceIds: ["lp", "larousse", "cnrtl"],
    quiz: {
      question: "Was gilt für « les haricots »?",
      answer: "Es gibt keine Bindung, das h ist aspiriert.",
      wrong: ["Das s wird als z gebunden: [le zaʁiko].", "Das h wird deutlich wie im Deutschen gesprochen."],
      explanation:
        "Bei einem aspirierten h gibt es keine Bindung, obwohl das h nicht gesprochen wird. Les haricots klingt deshalb [le aʁiko] ohne z.",
    },
    workshop: {
      kind: "classify",
      title: "Liaison oder keine Bindung?",
      instruction: "Entscheide, ob an der markierten Stelle gebunden wird oder nicht.",
      categories: ["Bindung", "Keine Bindung"],
      entries: [
        { text: "Bei « les amis » spricht man das s wie ein z.", target: 0, feedback: "Vor einem Vokal wird das s als z gebunden." },
        { text: "Bei « les haricots » spricht man kein z, das h ist aspiriert.", target: 1, feedback: "Bei aspiriertem h gibt es keine Bindung." },
        { text: "Bei « un petit ami » spricht man das t deutlich mit.", target: 0, feedback: "Vor einem Vokal wird das t gebunden." },
        { text: "Bei « les héros » bindet man das s nicht an das h.", target: 1, feedback: "Héros hat ein aspiriertes h, daher keine Bindung." },
        { text: "Bei « des hommes » spricht man das s wie ein z.", target: 0, feedback: "Hommes hat ein stummes h, das s wird als z gebunden." },
        { text: "Vor « et » in « petit et grand » bindet man das t nicht.", target: 1, feedback: "Nach dem Wort et gibt es nie eine Bindung." },
      ],
      conclusion: "Vor Vokal und stummem h bindest du, vor aspiriertem h und nach et nicht.",
    },
    casework: {
      title: "Ein unbekanntes Wort aussprechen",
      story:
        "Du liest den Satz « Les enfants ont mangé des haricots ». Du fragst dich, wie man ihn ausspricht, und schlägst in einem Online-Wörterbuch nach.",
      steps: [
        {
          question: "Wie sprichst du « les enfants » aus?",
          options: ["Mit z: [le zɑ̃fɑ̃].", "Ohne z: [le ɑ̃fɑ̃].", "Mit t: [le tɑ̃fɑ̃]."],
          answer: 0,
          explanation: "Vor dem Vokal in enfants wird das s als z gebunden.",
        },
        {
          question: "Wie sprichst du « des haricots » aus?",
          options: ["Ohne Bindung: [de aʁiko].", "Mit z gebunden: [de zaʁiko].", "Mit t gebunden: [de taʁiko]."],
          answer: 0,
          explanation: "Das h in haricots ist aspiriert, deshalb gibt es keine Bindung.",
        },
        {
          question: "Welches Hilfsmittel prüft die Aussprache?",
          options: ["Ein Online-Wörterbuch mit Hörprobe.", "Nur das genaue Lesen der Schreibung.", "Ein Rechtschreibprogramm am Computer."],
          answer: 0,
          explanation: "Online-Wörterbücher mit Hörprobe zeigen die Lautschrift und lassen dich hören, wie das Wort klingt.",
        },
      ],
      verdict:
        "Bindung bei enfants, keine Bindung bei haricots, und ein Online-Wörterbuch als Hilfsmittel: So klärst du die Aussprache unbekannter Wörter selbst.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe drei Beispiele für Bindung und zwei Beispiele für keine Bindung (mit aspiriertem h). Erkläre in einem Satz, woran du den Unterschied erkennst.",
        hints: [
          "Denke an les amis, un petit ami, des hommes und an les haricots, les héros.",
          "Benenne, ob das h stumm oder aspiriert ist.",
        ],
        model:
          "Mit Bindung: les amis, un petit ami, des hommes. Ohne Bindung: les haricots, les héros. Ich erkenne den Unterschied am h: Bei stummem h wird gebunden, bei aspiriertem h nicht. Im Wörterbuch steht bei aspiriertem h oft ein Hinweis.",
        criteria: [
          "Drei Beispiele mit Bindung sind richtig gewählt.",
          "Zwei Beispiele ohne Bindung mit aspiriertem h.",
          "Der Unterschied wird richtig erklärt.",
        ],
      },
      2: {
        prompt:
          "Wähle fünf Wörter aus dem Text dieser Lektion oder einem Lied, die du nicht sicher aussprechen kannst. Schlage die Aussprache in einem Online-Wörterbuch nach und beschreibe in fünf bis sechs Sätzen, was dir aufgefallen ist (stumme Buchstaben, Bindung, Nasale).",
        hints: [
          "Nutze die Lautschrift und die Hörprobe des Wörterbuchs.",
          "Beschreibe, welche Buchstaben stumm sind.",
        ],
        model:
          "Ich habe petit, enfant, haricot, ils ont und maison nachgeschlagen. Bei petit ist das t stumm, bei enfant sind en und an Nasale und das t am Ende ist stumm. Haricot hat ein aspiriertes h, deshalb keine Bindung. Bei ils ont hört man ein z, weil gebunden wird. Maison klingt wie [mɛzɔ̃] mit nasalem on.",
        criteria: [
          "Fünf Wörter werden besprochen.",
          "Stumme Buchstaben, Bindung und Nasale werden benannt.",
          "Ein Online-Wörterbuch wird als Hilfsmittel genannt.",
        ],
      },
    },
  },
];
