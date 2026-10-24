import type { Lesson } from "../model/types";

/**
 * Stufe 5: Texte und Medien (Lernbereich 3, Kompetenzerwartungen 3.3 bis 3.5; 3.1, 3.2 und 3.6 stehen
 * in den Lektionen zu Wortbildung, Hören, Lesen und E-Mails): Bilder und Bandes dessinées beschreiben,
 * Rollenspiele und kreatives Schreiben.
 */
export const S5: Lesson[] = [
  {
    id: "fr-bilder-bd",
    lb: 5,
    unit: "3",
    covers: ["3.3"],
    title: "Bilder, Fotos und Bandes dessinées beschreiben",
    intro:
      "Du beschreibst Fotos, Comics und Werbung, sagst, was du siehst, und nennst deine eigenen Eindrücke und Bewertungen.",
    paragraphs: [
      "Bei der Beschreibung eines Bildes gehst du in drei Schritten vor. Zuerst nennst du, was es ist: « C’est une photo », « C’est une publicité », « C’est une bande dessinée. » Dann beschreibst du, was du siehst: « On voit … », « Il y a … » und den Ort der Dinge: **au premier plan** (im Vordergrund), **à l’arrière-plan** (im Hintergrund), **au milieu**, **à gauche**, **à droite**, **en haut**, **en bas**. Zuletzt sagst du, was die Personen tun und wie das Bild auf dich wirkt.",
      "Bei einer **bande dessinée** (BD, Comic) kennst du die Teile: **une case** (Bildfeld), **une bulle** (Sprechblase), **un personnage**, **une légende** (Bildunterschrift) und **un dessin**. Du beschreibst die Handlung Bild für Bild: « Dans la première case, le garçon regarde la vitrine. Dans la deuxième, il entre dans le magasin. » Auch bei Werbeprospekten helfen Wörter wie **un slogan** (Werbespruch), **un prix**, **une offre**.",
      "Deine **Eindrücke und Bewertungen** formulierst du in einfachen Sätzen: « J’aime cette photo parce que les couleurs sont belles. », « Ça me fait penser à mes vacances. », « À mon avis, la publicité est drôle. », « Je trouve que le dessin est très clair. » Nutze Adjektive (joyeux, triste, calme, drôle, étrange) und Begründungen mit parce que. Auch Fragen können Eindrücke zeigen: « Pourquoi est-ce que le personnage est surpris? »",
      "Typische Fehler: nur aufzählen, was auf dem Bild ist, ohne Ort oder Bewertung zu nennen; im Präsens und im Passé composé zu mischen (Beschreibung im Präsens, Handlung im Präsens); « Il y a » ohne Plural-Angleichung. Strukturiere deine Beschreibung: Überblick, Details, Eindruck.",
    ],
    terms: [
      { term: "au premier plan, à l’arrière-plan", text: "Ortsangaben auf einem Bild: im Vordergrund und im Hintergrund. Dazu à gauche, à droite, au milieu, en haut, en bas." },
      { term: "une case, une bulle", text: "Bei einem Comic das Bildfeld und die Sprechblase. Mit ihnen beschreibst du die Handlung Bild für Bild." },
      { term: "une légende", text: "Die Bildunterschrift. Sie erklärt kurz, was auf einem Foto oder einem Bild zu sehen ist." },
    ],
    takeaway:
      "Nenne zuerst die Art des Bildes, dann Orte und Dinge (au premier plan, à gauche, il y a), dann die Handlung im Präsens und zuletzt deinen Eindruck mit parce que. Bei BDs beschreibst du Case für Case.",
    sourceIds: ["lp", "lepointdufle", "francefr"],
    quiz: {
      question: "Wie sagst du: „Im Hintergrund sieht man ein Haus“?",
      answer: "À l’arrière-plan, on voit une maison.",
      wrong: ["Au premier plan, on voit une maison.", "À l’arrière, on voit une maison au plan."],
      explanation:
        "Im Hintergrund heißt à l’arrière-plan. Au premier plan meint den Vordergrund, und die dritte Form ist keine feste Wendung.",
    },
    workshop: {
      kind: "classify",
      title: "Ort, Beschreibung oder Eindruck?",
      instruction: "Ordne jeden Satz der Rolle in einer Bildbeschreibung zu.",
      categories: ["Ort", "Handlung", "Eindruck"],
      entries: [
        { text: "Au premier plan, il y a deux enfants qui jouent au ballon.", target: 0, feedback: "Au premier plan nennt den Ort auf dem Bild." },
        { text: "Dans la deuxième case, le garçon entre dans le magasin.", target: 1, feedback: "Dieser Satz beschreibt, was in der Case passiert." },
        { text: "J’aime cette photo parce que les couleurs sont très belles.", target: 2, feedback: "J’aime … parce que drückt einen Eindruck mit Begründung aus." },
        { text: "À l’arrière-plan, on voit une grande montagne avec de la neige.", target: 0, feedback: "À l’arrière-plan nennt den Ort." },
        { text: "La femme regarde un livre et elle sourit à son fils.", target: 1, feedback: "Hier wird beschrieben, was die Personen tun." },
        { text: "À mon avis, cette publicité est drôle mais un peu étrange.", target: 2, feedback: "À mon avis leitet eine Bewertung ein." },
      ],
      conclusion: "Ort, Handlung und Eindruck gehören zu einer vollständigen Bildbeschreibung.",
    },
    casework: {
      title: "Ein Comic in drei Bildern",
      story:
        "Ein Comic zeigt in der ersten Case ein Mädchen vor einem Kino, in der zweiten kauft sie ein Ticket, in der dritten sitzt sie im Saal. In der Sprechblase der dritten Case steht: « Quel film génial! »",
      steps: [
        {
          question: "Wie beginnst du die Beschreibung?",
          options: ["C’est une bande dessinée.", "La fille est très grande.", "Je trouve la fin triste."],
          answer: 0,
          explanation: "Du nennst zuerst die Art des Bildes, dann beschreibst du Details.",
        },
        {
          question: "Wie beschreibst du die zweite Case?",
          options: ["Dans la deuxième case, elle achète un ticket.", "Dans la deuxième case, elle est assise dans la salle.", "Dans la deuxième case, il pleut devant le cinéma."],
          answer: 0,
          explanation: "In der zweiten Case kauft sie ein Ticket. Sitzen passt zur dritten Case.",
        },
        {
          question: "Was zeigt die Sprechblase « Quel film génial! »?",
          options: ["Ihre Begeisterung.", "Ihre Enttäuschung.", "Eine Frage an den Leser."],
          answer: 0,
          explanation: "Quel film génial! ist ein Ausruf und zeigt, dass sie den Film mag.",
        },
      ],
      verdict:
        "Von der Art des Bildes über die einzelnen Cases bis zur Sprechblase beschreibst du einen Comic Schritt für Schritt.",
    },
    tasks: {
      1: {
        prompt:
          "Beschreibe in vier Sätzen dieses Foto (stelle es dir vor): Im Vordergrund spielen zwei Kinder Fußball. Im Hintergrund sieht man Bäume und ein Haus. Es scheint die Sonne. Nenne Ort, Handlung und einen Eindruck.",
        hints: [
          "Nutze au premier plan und à l’arrière-plan.",
          "Beende mit « J’aime cette photo parce que … ».",
        ],
        model:
          "C’est une photo d’un parc. Au premier plan, deux enfants jouent au football. À l’arrière-plan, on voit des arbres et une maison. J’aime cette photo parce que le soleil brille et que les enfants sont heureux. Der Text nennt die Art des Bildes, Orte, Handlung und einen begründeten Eindruck.",
        criteria: [
          "Ortsangaben wie au premier plan und à l’arrière-plan kommen vor.",
          "Die Handlung wird im Präsens beschrieben.",
          "Ein begründeter Eindruck steht am Ende.",
        ],
      },
      2: {
        prompt:
          "Beschreibe in acht bis zehn Sätzen einen Comicstrip mit vier Cases (eigene Idee oder aus einem Comic). Nenne Art, Handlung Case für Case, eine Sprechblase und deine Bewertung, und stelle eine Frage zum Bild.",
        hints: [
          "Verwende dans la première case, dans la deuxième case und so weiter.",
          "Nenne eine Sprechblase wörtlich.",
        ],
        model:
          "C’est une bande dessinée en quatre cases. Dans la première case, un garçon cherche son chat dans le jardin. Dans la deuxième, il regarde sous un arbre et il voit une petite bulle: « Miaou! » Dans la troisième case, le chat monte dans l’arbre. Dans la quatrième, le garçon rit et il prend le chat dans ses bras. À mon avis, l’histoire est drôle et les dessins sont très clairs. Pourquoi est-ce que le chat est monté dans l’arbre?",
        criteria: [
          "Jede Case wird kurz beschrieben.",
          "Eine Sprechblase wird zitiert und eine Bewertung genannt.",
          "Eine Frage zum Bild ist enthalten.",
        ],
      },
    },
  },
  {
    id: "fr-rollenspiel",
    lb: 5,
    unit: "3",
    covers: ["3.4"],
    title: "Rollenspiele für Alltagssituationen vorbereiten",
    intro:
      "Mit Rollenkarten, Redemitteln und Reaktionen bereitest du Gespräche im Geschäft, im Hotel oder im Restaurant vor und spielst sie mit anderen.",
    paragraphs: [
      "In einem Rollenspiel stellst du eine Alltagssituation nach, zum Beispiel im Restaurant, an der Hotelrezeption, im Geschäft oder am Fundbüro. Oft hast du eine **Textvorlage** oder eine **Rollenkarte**: Sie sagt, wer du bist, was du willst und welche Informationen du hast. « Rôle A: Vous êtes le client. Vous voulez une chambre pour deux nuits. Rôle B: Vous êtes le réceptionniste. »",
      "Zur Vorbereitung sammelst du **Redemittel**: Begrüßung (Bonjour, madame), Wunsch (Je voudrais …, Je cherche …), Frage (Combien coûte …?, Est-ce que vous avez …?), Reaktion (D’accord, Très bien, Pardon?), Verabschiedung (Merci, au revoir). Dazu passende Zahlen, Zeitangaben und Wörter des Themas. Schreibe einen kurzen Ablauf mit Stichwörtern auf.",
      "Im Spiel **reagierst du** auf das, was dein Partner sagt, und liest nicht nur ab. Wenn du etwas nicht verstehst, fragst du nach: « Pardon, pouvez-vous répéter? ». Wenn dir ein Wort fehlt, umschreibst du es. Nutze Mimik, Gestik und eine klare Aussprache. Nach dem Spiel gibst du dem Partner kurz Rückmeldung: Was war gut? Was kannst du verbessern?",
      "Typische Fehler sind das Ablesen des Textes ohne Rücksicht auf den Partner, fehlende Höflichkeitsformeln und zu knappe Antworten (« Oui. », « Non. »). Üben kannst du mit einem Skript: Schreibe den Dialog zuerst auf, lies ihn mit verteilten Rollen und improvisiere danach Varianten.",
    ],
    terms: [
      { term: "Rollenkarte", text: "Eine Karte, die deine Rolle, dein Ziel und deine Informationen im Rollenspiel beschreibt." },
      { term: "Redemittel", text: "Feste Wendungen für typische Absichten: Wunsch (je voudrais), Frage (est-ce que vous avez), Reaktion (d’accord), Dank (merci)." },
      { term: "reagieren", text: "Auf die Äußerung des Partners eingehen, statt nur Text abzulesen, und bei Unklarheiten nachfragen." },
    ],
    takeaway:
      "Lies deine Rollenkarte, sammle Redemittel, plane Ablauf und Zahlen, reagiere auf deinen Partner, frage bei Problemen nach und gib am Ende Rückmeldung.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Was machst du im Rollenspiel, wenn du etwas nicht verstehst?",
      answer: "Ich frage höflich nach: Pardon, pouvez-vous répéter?",
      wrong: ["Ich lese einfach meinen Text weiter vor.", "Ich schweige, bis der Partner ein neues Thema beginnt."],
      explanation:
        "Nachfragen hält das Gespräch am Laufen. Weiterlesen oder Schweigen unterbrechen die Verständigung.",
    },
    workshop: {
      kind: "timeline",
      title: "Ein Rollenspiel in die richtige Reihenfolge bringen",
      instruction: "Bringe die Zeilen eines Hotel-Gesprächs in die passende Reihenfolge.",
      categories: [],
      entries: [
        { text: "– Bonjour, madame. Je voudrais une chambre pour deux nuits, s’il vous plaît.", target: 0, feedback: "Das Gespräch beginnt mit der Begrüßung und dem Wunsch." },
        { text: "– Bonjour. Pour combien de personnes, et à partir de quelle date?", target: 1, feedback: "Der Empfang fragt nach Personen und Datum." },
        { text: "– Pour deux personnes, du douze au quatorze mai.", target: 2, feedback: "Der Gast gibt die Angaben." },
        { text: "– Très bien. La chambre coûte soixante-dix euros la nuit, petit déjeuner inclus.", target: 3, feedback: "Der Empfang nennt den Preis." },
        { text: "– D’accord, je la prends. Merci beaucoup, au revoir!", target: 4, feedback: "Der Gast entscheidet sich und verabschiedet sich." },
      ],
      conclusion: "Begrüßung, Wunsch, Rückfrage, Angaben, Preis und Verabschiedung: So verläuft ein typisches Rollenspiel.",
    },
    casework: {
      title: "Im Restaurant",
      story:
        "Du spielst mit einem Partner eine Szene im Restaurant. Deine Rollenkarte sagt: « Sie sind Gast. Sie möchten einen Tisch für drei Personen, ein vegetarisches Gericht und die Rechnung. »",
      steps: [
        {
          question: "Wie beginnst du?",
          options: ["Bonjour, une table pour trois, s’il vous plaît.", "Je veux une table pour trois, tout de suite.", "Donnez-moi une table pour trois, vite!"],
          answer: 0,
          explanation: "Bonjour und s’il vous plaît machen die Bitte höflich.",
        },
        {
          question: "Wie fragst du nach dem vegetarischen Gericht?",
          options: ["Est-ce que vous avez un plat végétarien?", "Vous avez de la viande pour trois personnes?", "Je ne veux pas de viande, vite!"],
          answer: 0,
          explanation: "Mit Est-ce que vous avez … fragst du höflich und vollständig.",
        },
        {
          question: "Wie bittest du am Ende um die Rechnung?",
          options: ["L’addition, s’il vous plaît.", "Donnez-moi l’addition, tout de suite!", "Je ne paie jamais dans ce restaurant."],
          answer: 0,
          explanation: "L’addition, s’il vous plaît ist die übliche höfliche Bitte.",
        },
      ],
      verdict:
        "Mit passenden Redemitteln und Höflichkeitsformeln spielst du eine Restaurantszene überzeugend.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe einen Dialog von sechs Zeilen für ein Rollenspiel im Geschäft: Du suchst ein T-Shirt, fragst nach der Größe und dem Preis und entscheidest dich.",
        hints: [
          "Nutze Je cherche …, Quelle taille?, Combien ça coûte?",
          "Beginne und beende höflich.",
        ],
        model:
          "– Bonjour, madame, je cherche un T-shirt bleu. – Quelle taille? – M, s’il vous plaît. – Voilà. – Combien ça coûte? – Quinze euros. – D’accord, je le prends. Merci, au revoir!",
        criteria: [
          "Begrüßung, Wunsch, Frage nach Größe und Preis kommen vor.",
          "Die Entscheidung und der Abschluss sind höflich.",
          "Der Dialog ist verständlich und in sich stimmig.",
        ],
      },
      2: {
        prompt:
          "Schreibe zwei Rollenkarten (A und B) und einen Dialog von zehn Zeilen für eine Situation deiner Wahl, bei der etwas schiefgeht (zum Beispiel Verlust eines Koffers). Verwende Nachfragen, eine Umschreibung und eine Einigung.",
        hints: [
          "Rolle A hat ein Problem, Rolle B bietet eine Lösung.",
          "Baue « Pardon, pouvez-vous répéter? » und eine Umschreibung ein.",
        ],
        model:
          "Rôle A: Vous avez perdu votre valise à la gare. Rôle B: Vous travaillez au bureau des objets trouvés. – Bonjour, j’ai perdu ma valise. – Comment est-elle? – Elle est bleue, c’est un truc avec des roues. – Pardon, pouvez-vous répéter la couleur? – Bleue, avec un ruban rouge. – Je vais chercher. Vous pouvez venir demain? – Oui, d’accord. Merci beaucoup!",
        criteria: [
          "Zwei Rollenkarten und ein Dialog sind vorhanden.",
          "Nachfragen, Umschreibung und Einigung kommen vor.",
          "Der Ton bleibt höflich.",
        ],
      },
    },
  },
  {
    id: "fr-kreativ-schreiben",
    lb: 5,
    unit: "3",
    covers: ["3.5"],
    title: "Kreativ schreiben: Geschichten fortführen und gestalten",
    intro:
      "Du führst Erzählungen weiter, schreibst E-Mails mit Anregungen und gestaltest Texte mit einem begrenzten Repertoire an Mitteln.",
    paragraphs: [
      "Kreatives Schreiben bedeutet, einen Text nach Vorgaben selbst auszuarbeiten: eine Erzählung **fortführen**, eine E-Mail an eine Figur schreiben, zu einem Foto eine Geschichte erfinden. Wichtig ist, dass dein Text zur Vorlage passt: Person, Zeitform und Stimmung bleiben gleich, wenn du eine Geschichte weiterschreibst. Wenn der Anfang im passé composé steht (« Hier, j’ai trouvé un portefeuille. »), führst du im passé composé und imparfait weiter.",
      "Du kannst mit einem **begrenzten Repertoire an gestalterischen Mitteln** arbeiten, ohne dass der Text überladen wird: Dialog mit wörtlicher Rede (« Qu’est-ce que c’est? », dit-il), Ausrufe (« Quelle surprise! »), Adjektive (mystérieux, joyeux), Vergleiche mit comme (« rapide comme le vent ») und Fotos oder Bilder mit Bildunterschrift (une légende). Weniger ist mehr: Wähle zwei oder drei Mittel und setze sie gezielt ein.",
      "Zum Fortführen gibst du dem Text einen **Anschluss** (Puis, Ensuite, Le lendemain), einen **Wendepunkt** (Soudain, Mais) und ein **Ende** (Finalement, À la fin). Bei einer E-Mail verwendest du Anrede, Bezug auf die Vorlage und Grußformel. Bei einem Blogbeitrag mit Foto kommen Titel, Bild, Bildunterschrift und kurze Absätze dazu.",
      "Typische Fehler sind ein Bruch mit der Vorlage (neue Namen, andere Zeitform), zu viele Stilmittel auf einmal und fehlende Schlüsse. Prüfe nach dem Schreiben: Passt der Text zur Vorlage? Hat er Anschluss, Wendepunkt und Ende? Sind höchstens drei Gestaltungsmittel eingesetzt?",
    ],
    terms: [
      { term: "fortführen", text: "Eine vorgegebene Erzählung weiterschreiben und Person, Zeitform und Stimmung beibehalten." },
      { term: "gestalterische Mittel", text: "Dialog, Ausruf, Adjektive, Vergleich mit comme und Bilder mit Bildunterschrift. Sie machen einen Text lebendig." },
      { term: "Anschluss und Wendepunkt", text: "Ein Anschluss wie puis, ensuite, le lendemain verbindet, ein Wendepunkt wie soudain, mais bringt die Wende." },
    ],
    takeaway:
      "Führe Geschichten in derselben Person und Zeitform weiter, nutze zwei oder drei Mittel (Dialog, Ausruf, Vergleich, Foto mit légende) und gib dem Text Anschluss, Wendepunkt und Ende.",
    sourceIds: ["lp", "lepointdufle", "lingolia"],
    quiz: {
      question: "Wie führst du « Hier, j’ai trouvé un portefeuille dans la rue. » richtig fort?",
      answer: "Je l’ai apporté à la police.",
      wrong: ["Je l’apporte à la police demain.", "Il apportait à la police."],
      explanation:
        "Der Anfang steht im passé composé und in der ersten Person. Die Fortsetzung bleibt dabei. Futur und dritte Person würden den Text brechen.",
    },
    workshop: {
      kind: "choose",
      title: "Die passende Fortsetzung wählen",
      instruction: "Wähle die Fortsetzung, die zu Person, Zeitform und Stimmung der Vorlage passt.",
      items: [
        { before: "Début: « Hier, j’ai trouvé un portefeuille dans la rue. » Suite: « ", options: ["Je l’ai apporté à la police.", "Je l’apporte à la police demain.", "Il apportait à la police."], answer: 0, after: " »", feedback: "Der Anfang steht im passé composé und in der ersten Person, die Fortsetzung bleibt dabei." },
        { before: "Début: « Ce jour-là, il pleuvait et nous étions à la maison. » Suite: « ", options: ["Soudain, quelqu’un a sonné à la porte.", "Soudain, quelqu’un sonne à la porte demain.", "Soudain, il sonnera à la porte."], answer: 0, after: " »", feedback: "Nach dem Rahmen im imparfait folgt das Ereignis im passé composé." },
        { before: "Début: « Je suis fatigué, mais je vais finir cette lettre. » Suite: « ", options: ["Ensuite, je vais la poster.", "Ensuite, il l’a postée.", "Ensuite, nous la postons demain."], answer: 0, after: " »", feedback: "Die Fortsetzung bleibt in der ersten Person Singular und im futur proche." },
        { before: "Dans un blog: « Voilà ma nouvelle école! » Suite: « ", options: ["Voici ma classe et mes professeurs.", "Voici leur classe et ses professeurs.", "Voici ta classe et mes professeurs."], answer: 0, after: " »", feedback: "Die Person bleibt ich: ma, mes." },
        { before: "Début: « Le chat est monté sur le toit. » Suite: « ", options: ["Les enfants ont crié: « Descends! »", "Les enfants criaient: « Monte! », demain.", "Le chat criera: « Descends! »"], answer: 0, after: " »", feedback: "Die Geschichte bleibt im passé composé und enthält einen kurzen Dialog." },
      ],
      conclusion: "Person, Zeitform und Stimmung der Vorlage bleiben erhalten, wenn du weiterschreibst.",
    },
    casework: {
      title: "Eine Geschichte weiterschreiben",
      story:
        "Der Anfang einer Erzählung: « Samedi, j’ai pris mon vélo pour aller au lac. Il faisait beau. Au bout du chemin, j’ai vu une boîte bleue. » Du sollst die Geschichte fortführen.",
      steps: [
        {
          question: "In welcher Zeitform schreibst du die Fortsetzung?",
          options: ["Im passé composé und imparfait.", "Im futur simple für das Ende.", "Im Präsens, weil es lebendiger ist."],
          answer: 0,
          explanation: "Der Anfang erzählt in der Vergangenheit, die Fortsetzung bleibt in dieser Zeitform.",
        },
        {
          question: "Mit welchem Wort führst du einen Wendepunkt ein?",
          options: ["Soudain.", "Demain.", "Toujours."],
          answer: 0,
          explanation: "Soudain kündigt eine plötzliche Wendung an.",
        },
        {
          question: "Wie viele gestalterische Mittel nutzt du am besten?",
          options: ["Zwei oder drei.", "Alle, die ich kenne.", "Keines."],
          answer: 0,
          explanation: "Mit wenigen gezielten Mitteln wirkt ein Text lebendig und bleibt klar.",
        },
      ],
      verdict:
        "Mit gleicher Person und Zeitform, einem Wendepunkt und wenigen Mitteln führst du die Geschichte glaubwürdig fort.",
    },
    tasks: {
      1: {
        prompt:
          "Führe diese Geschichte in drei Sätzen fort: « Hier soir, j’ai entendu un bruit étrange dans le jardin. J’ai pris ma lampe et je suis sorti. »",
        hints: [
          "Bleibe in der ersten Person und im passé composé.",
          "Nutze soudain und finalement.",
        ],
        model:
          "Soudain, j’ai vu une ombre derrière un arbre. J’ai eu très peur, mais j’ai avancé doucement. Finalement, j’ai découvert un petit chat noir qui avait faim. Die Fortsetzung bleibt im passé composé, nutzt soudain und finalement und endet mit einer Auflösung.",
        criteria: [
          "Person und Zeitform bleiben wie in der Vorlage.",
          "Soudain und finalement kommen vor.",
          "Die Geschichte hat eine Auflösung.",
        ],
      },
      2: {
        prompt:
          "Schreibe zu einem Foto deiner Wahl (eigener Schnappschuss oder Idee) eine kurze Geschichte von acht bis zehn Sätzen mit Titel, légende, einem Dialog und einem Vergleich mit comme. Die Geschichte hat Anschluss, Wendepunkt und Ende.",
        hints: [
          "Wähle höchstens drei gestalterische Mittel.",
          "Beginne mit dem Rahmen im imparfait.",
        ],
        model:
          "Titre: Le chien du lac. Légende: Un chien qui nage. Ce matin-là, il faisait froid et le lac était calme comme un miroir. Un petit chien a sauté dans l’eau. « Reviens! », a crié une petite fille. Puis un homme est arrivé en bateau et il a sorti le chien. Finalement, tout le monde a ri. C’était une belle surprise.",
        criteria: [
          "Titel, légende, Dialog und Vergleich sind vorhanden.",
          "Anschluss, Wendepunkt und Ende sind erkennbar.",
          "Zeitformen passen zusammen.",
        ],
      },
    },
  },
];
