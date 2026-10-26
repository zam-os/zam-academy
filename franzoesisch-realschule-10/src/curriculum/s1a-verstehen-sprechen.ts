import type { Lesson } from "../model/types";

/**
 * Stufe 1, erster Teil: Kommunikative Fertigkeiten (Kompetenzerwartungen 1.1.1 bis 1.1.6): längere Hör-
 * und Hörsehtexte, anspruchsvollere Lesetexte, Konflikt- und Dienstleistungsgespräche, Kurzpräsentation,
 * Erfahrungen und Pläne, Meinungen und Gefühle. Die App spielt keinen Ton ab und nimmt keine Sprache auf:
 * Hören und Sprechen übst du mit Transkripten, Gesprächsbausteinen und schriftlichen Planungen.
 */
export const S1A: Lesson[] = [
  {
    id: "fr-hoeren-global-detail",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.1"],
    title: "Längere Hörtexte global und im Detail verstehen",
    intro:
      "Radiosendungen, Kurznachrichten und Umfragen verstehst du, wenn du zuerst den Zusammenhang und dann gezielt die Details suchst.",
    paragraphs: [
      "In Klasse 10 werden die Hör- und Hörsehtexte länger: Radiosendungen, **flash info** (Kurznachrichten), Umfragen auf der Straße (**micro-trottoir**) und Gespräche, in denen etwas schiefgeht. Du verstehst sie in zwei Schritten. **Global** heißt: Worum geht es, wer spricht, was ist die Absicht (informieren, überzeugen, sich beschweren)? **Im Detail** heißt: Welche Zahl, welcher Ort, welcher Grund, welche Meinung genau?",
      "Lies vor dem Hören die Aufgaben und unterstreiche die Fragewörter. So weißt du, worauf du achten musst. Beim ersten Hören achtest du auf das Thema und die Sprecher, beim zweiten auf die gefragten Details. Wörter, die den Text gliedern, helfen dir: d’abord, ensuite, enfin für Reihenfolgen, mais, par contre, pourtant für Gegensätze, parce que, c’est pourquoi für Gründe und Folgen.",
      "In Umfragen sagen mehrere Personen ihre Meinung. Notiere für jede Person ein Plus oder Minus und ein Stichwort zum Grund. Achte auf Verneinungen und Einschränkungen: « Je ne suis pas contre, mais … » ist keine Zustimmung ohne Bedingung. In Nachrichten zählen Zahlen und Zeitangaben: « un train sur deux », « à partir de demain », « jusqu’à vingt heures ».",
      "Typische Fallen in Prüfungsaufgaben: Ein Wort aus dem Text steht in einer falschen Antwort (der Sprecher erwähnt es, aber verneint es), oder eine Antwort ist allgemein richtig, aber nicht das, was der Sprecher sagt. Entscheide immer nach dem Hörtext, nicht nach deinem Weltwissen. Die App spielt keinen Ton ab: Du übst mit Transkripten und hörst echte Sendungen im Unterricht oder in Mediatheken.",
    ],
    terms: [
      { term: "Globalverstehen", text: "Du erfasst Thema, Sprecher und Absicht eines Hörtexts, ohne jedes Wort zu verstehen." },
      { term: "Detailverstehen", text: "Du entnimmst gezielt einzelne Informationen: Zahlen, Orte, Gründe und genaue Meinungen." },
      { term: "micro-trottoir", text: "Eine Straßenumfrage im Radio oder Fernsehen, in der mehrere Personen kurz ihre Meinung sagen." },
      { term: "flash info", text: "Kurznachrichten im Radio: wenige Sätze zu mehreren Themen, mit vielen Zahlen und Zeitangaben." },
    ],
    takeaway:
      "Erst global (Thema, Sprecher, Absicht), dann im Detail (Zahlen, Gründe, Meinungen). Aufgaben vorher lesen, Gliederungswörter nutzen, auf Verneinungen achten und nach dem Hörtext entscheiden, nicht nach dem Weltwissen.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Eine Sprecherin sagt: « Je ne suis pas contre, mais c’est trop cher. » Was meint sie?",
      answer: "Sie hat Bedenken wegen des Preises.",
      wrong: ["Sie ist ohne Einschränkung dafür.", "Sie lehnt die Idee grundsätzlich ab."],
      explanation:
        "Je ne suis pas contre heißt „ich bin nicht dagegen“, mais schränkt das ein: Der Preis ist ihr Einwand. Weder volle Zustimmung noch Ablehnung trifft zu.",
    },
    workshop: {
      kind: "mark",
      title: "Meinungen in einer Umfrage finden",
      instruction:
        "Wähle oben ein Etikett und klicke im Transkript die passende Stelle an. Markiere jede zustimmende Haltung, jede ablehnende Haltung und jede Zahl oder Dauer. Nicht jede Stelle ist gesucht.",
      labels: ["zustimmend", "ablehnend", "Zahl oder Dauer"],
      text: [
        { t: "Journaliste: Aujourd’hui, on parle du bénévolat. Inès, 16 ans: Moi, je " },
        { t: "trouve ça super important", label: 0, feedback: "Inès bewertet das Ehrenamt ausdrücklich positiv." },
        { t: ". Je donne des cours de maths à des enfants " },
        { t: "deux heures par semaine", label: 2, feedback: "Das ist eine Dauer: zwei Stunden pro Woche." },
        { t: ". Hugo, 17 ans: Franchement, " },
        { t: "je n’ai pas envie de travailler sans être payé", label: 1, feedback: "Hugo lehnt unbezahlte Arbeit für sich ab." },
        { t: ", avec le lycée et mon job, c’est déjà assez. Léa, 15 ans: J’aide aux Restos du Cœur depuis " },
        { t: "un an", label: 2, feedback: "Seit einem Jahr: eine Dauer." },
        { t: ". C’est fatigant, mais " },
        { t: "ça me rend heureuse", label: 0, feedback: "Trotz der Mühe sagt Léa, dass es sie glücklich macht: zustimmend." },
        { t: ". Journaliste: Dans notre petit sondage, " },
        { t: "un jeune sur trois", label: 2, feedback: "Eine Zahl aus der eigenen kleinen Straßenumfrage: einer von drei Jugendlichen." },
        { t: " fait du bénévolat." },
      ],
      conclusion: "In einer Umfrage notierst du für jede Person Haltung und Grund. Ein mais kann eine Aussage umdrehen, wie bei Léa.",
    },
    casework: {
      title: "Kurznachrichten am Morgen",
      story:
        "Du hörst im Radio: « Flash info de huit heures. Grève à la SNCF: aujourd’hui, un TGV sur deux circule entre Paris et Lyon. Le trafic reprendra normalement demain matin. Météo: il pleuvra sur la Bretagne, mais le soleil reviendra dans l’après-midi. »",
      steps: [
        {
          question: "Worum geht es global in der ersten Meldung?",
          options: ["Um einen Streik bei der Bahn.", "Um neue Strecken für den TGV.", "Um das Wetter in Lyon."],
          answer: 0,
          explanation: "Grève heißt Streik, SNCF ist die französische Bahngesellschaft. Das Wetter ist die zweite Meldung.",
        },
        {
          question: "Wie viele TGV fahren heute zwischen Paris und Lyon?",
          options: ["Die Hälfte der Züge.", "Kein einziger Zug.", "Nur zwei Züge am ganzen Tag."],
          answer: 0,
          explanation: "Un TGV sur deux heißt „einer von zwei“, also die Hälfte.",
        },
        {
          question: "Wann fährt die Bahn wieder normal?",
          options: ["Ab morgen früh.", "Heute Nachmittag.", "Erst in einer Woche."],
          answer: 0,
          explanation: "Le trafic reprendra normalement demain matin: morgen früh. Am Nachmittag kommt nur die Sonne zurück, das betrifft das Wetter.",
        },
      ],
      verdict:
        "Global: Bahnstreik und Wetter. Im Detail: die Hälfte der TGV, normal ab morgen früh. Die Falle „Nachmittag“ gehört zur Wettermeldung.",
    },
    tasks: {
      1: {
        prompt:
          "Lies das Transkript und notiere auf Deutsch Thema, Meinung und Grund: « Moi, le portable au collège, je suis pour. On peut chercher des infos en cours. Mais pendant la récré, il faut le ranger, sinon on ne se parle plus. »",
        hints: ["Beginne mit dem Thema: Worum geht es?", "Achte auf mais: Wo schränkt die Sprecherin ihre Meinung ein?"],
        model:
          "Thema: das Handy in der Schule. Meinung: Die Sprecherin ist dafür, aber mit Einschränkung. Grund dafür: Man kann im Unterricht Informationen suchen. Einschränkung: In der Pause soll man es weglegen, sonst redet man nicht mehr miteinander.",
        criteria: ["Das Thema ist richtig genannt.", "Die Meinung samt Einschränkung ist erfasst.", "Beide Gründe sind sinngemäß wiedergegeben."],
      },
      2: {
        prompt:
          "Stell dir eine Radiosendung über einen deutsch-französischen Schüleraustausch vor. Schreibe vier Fragen auf Deutsch, mit denen du sie verstehen willst: zwei zum Globalverstehen und zwei zum Detailverstehen. Begründe kurz, warum jede Frage global oder detailliert ist.",
        hints: ["Globale Fragen fragen nach Thema, Sprechern und Absicht.", "Detailfragen fragen nach Zahlen, Orten, Gründen oder genauen Meinungen."],
        model:
          "Global: 1. Wer spricht in der Sendung, Schüler, Lehrer oder Eltern? (Sprecher) 2. Will die Sendung über den Austausch informieren oder für ihn werben? (Absicht) Detail: 3. Wie lange dauert der Austausch? (eine Zahl) 4. Was hat einer Schülerin am besten gefallen und warum? (eine genaue Meinung mit Grund)",
        criteria: ["Zwei Fragen zielen auf das Globalverstehen.", "Zwei Fragen zielen auf einzelne Details.", "Jede Zuordnung ist begründet."],
      },
    },
  },
  {
    id: "fr-lesen-textsorte-absicht",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.2"],
    title: "Texte lesen: Textsorte und Aussageabsicht erkennen",
    intro:
      "Erzählung, Bericht, Sachtext oder Leserbrief: Wer die Textsorte und die Absicht erkennt, versteht längere Texte schneller und genauer.",
    paragraphs: [
      "Längere Texte erschließt du leichter, wenn du zuerst die **Textsorte** bestimmst. Eine **Kurzgeschichte** (nouvelle) erzählt, oft im passé composé und imparfait, mit Figuren und einer Wendung. Ein **Bericht** (article, reportage) informiert über Fakten: wer, was, wann, wo. Ein **Sachtext** erklärt einen Zusammenhang. Ein **Leserbrief** (courrier des lecteurs) oder ein Forumsbeitrag nimmt Stellung und will überzeugen.",
      "Die **Aussageabsicht** zeigt, was der Text erreichen will: informieren, unterhalten, überzeugen, sich beschweren oder um etwas bitten. Hinweise geben Überschrift, Quelle und Wortwahl. Wörter wie à mon avis, je trouve que, il faut absolument zeigen eine Meinung. Zahlen, Daten und Zitate von Fachleuten deuten auf einen informierenden Text. Fragen an den Leser und Ausrufezeichen wollen oft überzeugen.",
      "Lies zuerst überfliegend (global): Überschrift, erster und letzter Absatz, Bilder. Dann liest du gezielt im Detail, Absatz für Absatz, und notierst zu jedem ein Stichwort. Unbekannte Wörter erschließt du aus dem Zusammenhang, aus dem Englischen oder Deutschen und aus der Wortfamilie: in « les déchets plastiques » hilft plastique, in « le réchauffement » steckt chaud.",
      "Typische Fehler: Man hält eine Meinung für eine Tatsache, weil sie in einem Text steht, oder man verwechselt die Meinung einer zitierten Person mit der des Autors. Prüfe deshalb: Wer sagt das? Steht es in Anführungszeichen? Ein Leserbrief kann einen Bericht kritisieren, also zwei Meinungen enthalten.",
    ],
    terms: [
      { term: "Textsorte", text: "Die Art eines Textes, zum Beispiel Kurzgeschichte, Bericht, Sachtext oder Leserbrief, mit typischem Aufbau und typischer Sprache." },
      { term: "Aussageabsicht", text: "Was ein Text erreichen will: informieren, unterhalten, überzeugen, sich beschweren oder um etwas bitten." },
      { term: "courrier des lecteurs", text: "Die Leserbriefe einer Zeitung oder Zeitschrift; Leser nehmen darin Stellung zu einem Thema oder Artikel." },
    ],
    examples: [
      {
        title: "Ein Leserbrief erkennen",
        text: "« J’ai lu votre article sur les trottinettes électriques. À mon avis, il faut les interdire dans le centre-ville: elles sont dangereuses pour les piétons. »",
        analysis:
          "Der Bezug auf einen Artikel und die Anrede votre zeigen einen Leserbrief. À mon avis und il faut zeigen die Meinung des Schreibers, die Begründung folgt nach dem Doppelpunkt. Die Absicht ist überzeugen.",
      },
    ],
    takeaway:
      "Zuerst Textsorte und Absicht bestimmen (informieren, unterhalten, überzeugen, sich beschweren), dann global und im Detail lesen. Prüfe immer, wer eine Meinung äußert: der Autor oder eine zitierte Person.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Ein Text enthält « À mon avis », « il faut absolument » und viele Ausrufezeichen. Welche Absicht ist am wahrscheinlichsten?",
      answer: "Er will den Leser überzeugen.",
      wrong: ["Er will neutral informieren.", "Er will eine Geschichte erzählen."],
      explanation:
        "À mon avis und il faut absolument zeigen eine Meinung und eine Forderung. Ein neutral informierender Text verzichtet darauf, eine Erzählung hat Figuren und Handlung.",
    },
    workshop: {
      kind: "classify",
      title: "Textanfänge ihrer Absicht zuordnen",
      instruction: "Ordne jeden Textanfang seiner wichtigsten Absicht zu. Achte auf Wortwahl, Zahlen und Anrede.",
      categories: ["informieren", "überzeugen", "erzählen"],
      entries: [
        { text: "Selon une étude publiée lundi, 40 % des adolescents passent plus de trois heures par jour sur leur portable.", target: 0, feedback: "Eine Studie, ein Datum und eine Zahl: Der Text informiert." },
        { text: "À mon avis, chaque collège devrait avoir un potager. Pensez-y: c’est bon pour la planète et pour nous!", target: 1, feedback: "À mon avis, eine Aufforderung an den Leser und ein Ausrufezeichen: Der Text will überzeugen." },
        { text: "Ce matin-là, Julien est sorti de chez lui sans son sac. Il ne savait pas encore que cette journée allait tout changer.", target: 2, feedback: "Eine Figur, eine Handlung in der Vergangenheit und Spannung: eine Erzählung." },
        { text: "La mairie de Lyon a annoncé l’ouverture de trois nouvelles pistes cyclables pour le mois de mars.", target: 0, feedback: "Wer, was, wann: ein Bericht, der informiert." },
        { text: "Nous devons arrêter de jeter nos vêtements après un an. Achetez d’occasion, réparez, échangez!", target: 1, feedback: "Nous devons und Imperative fordern zum Handeln auf: überzeugen." },
        { text: "Quand Amira est arrivée à Marseille, elle ne connaissait personne et le bruit de la ville lui faisait peur.", target: 2, feedback: "Eine Figur, ihre Gefühle, Imparfait und passé composé: eine Erzählung." },
      ],
      conclusion: "Zahlen und Fakten informieren, Meinungswörter und Aufforderungen überzeugen, Figuren und Handlung erzählen.",
    },
    casework: {
      title: "Ein Text aus einer Jugendzeitschrift",
      story:
        "Du liest: « Le gaspillage alimentaire au lycée. Chaque jour, la cantine du lycée Jean-Moulin jette environ trente kilos de nourriture. "
        + "Pour Lucas, délégué de classe, “c’est un scandale”. La directrice explique que les élèves ne s’inscrivent pas toujours à temps. "
        + "Depuis septembre, une application permet de réserver son repas la veille. »",
      steps: [
        {
          question: "Welche Textsorte liegt vor?",
          options: ["Ein informierender Bericht.", "Ein persönlicher Leserbrief.", "Eine erfundene Kurzgeschichte."],
          answer: 0,
          explanation: "Der Text nennt Fakten (Ort, Menge, Zeit) und zitiert zwei Personen: ein Bericht.",
        },
        {
          question: "Wessen Meinung ist « c’est un scandale »?",
          options: ["Die von Lucas.", "Die der Autorin des Artikels.", "Die der Direktorin."],
          answer: 0,
          explanation: "Die Worte stehen in Anführungszeichen und werden Lucas zugeschrieben. Der Bericht selbst wertet nicht.",
        },
        {
          question: "Was ist seit September neu?",
          options: ["Man kann das Essen am Vortag reservieren.", "Die Kantine kocht nur noch vegetarisch.", "Übrig gebliebenes Essen wird verkauft."],
          answer: 0,
          explanation: "Une application permet de réserver son repas la veille: eine App zur Reservierung am Vortag.",
        },
      ],
      verdict:
        "Ein Bericht informiert und zitiert Meinungen, ohne selbst zu werten. Das Detail steht im letzten Satz: die Reservierung am Vortag.",
    },
    tasks: {
      1: {
        prompt:
          "Bestimme Textsorte und Absicht und begründe mit zwei Hinweisen aus dem Text: « Chers lecteurs, je suis choquée par votre article sur les zoos. Les animaux ne sont pas faits pour vivre en cage. Il faut fermer ces prisons! »",
        hints: ["Wer schreibt an wen? Achte auf die Anrede.", "Welche Wörter zeigen eine Meinung oder Forderung?"],
        model:
          "Es ist ein Leserbrief: Die Schreiberin spricht die Leser an (Chers lecteurs) und bezieht sich auf einen Artikel der Zeitung (votre article). Die Absicht ist überzeugen: Sie zeigt ihre Gefühle (je suis choquée) und stellt eine Forderung (Il faut fermer ces prisons!).",
        criteria: ["Die Textsorte ist richtig bestimmt.", "Die Absicht ist richtig benannt.", "Zwei passende Textstellen belegen die Antwort."],
      },
      2: {
        prompt:
          "Schreibe auf Französisch zwei kurze Textanfänge (je zwei Sätze) zum Thema « le vélo en ville »: einen, der informiert, und einen, der überzeugen will. Erkläre auf Deutsch, woran man den Unterschied erkennt.",
        hints: ["Ein informierender Anfang nennt Fakten: wer, was, wann, wo.", "Ein überzeugender Anfang nutzt Meinungswörter und spricht die Leser an."],
        model:
          "Informieren: « Depuis janvier, la ville de Strasbourg compte 50 kilomètres de pistes cyclables en plus. Selon la mairie, le nombre de cyclistes a augmenté de dix pour cent. » Überzeugen: « À mon avis, tout le monde devrait aller au travail à vélo. Essayez une semaine, vous verrez la différence! » Der erste nennt Ort, Zeit und Zahlen, der zweite eine Meinung und eine Aufforderung.",
        criteria: ["Ein Anfang informiert sachlich.", "Ein Anfang will mit Meinung und Aufforderung überzeugen.", "Der Unterschied ist erklärt."],
      },
    },
  },
  {
    id: "fr-dienstleistung-konflikt",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.3"],
    title: "Konflikt- und Dienstleistungsgespräche führen",
    intro:
      "Am Bahnschalter, im Hotel oder im Geschäft: Du beschreibst ein Problem höflich, reagierst auf dein Gegenüber und findest eine Lösung.",
    paragraphs: [
      "Ein **Dienstleistungsgespräch** führst du, wenn du etwas brauchst: eine Fahrkarte, ein Zimmer, eine Auskunft. Ein **Konfliktgespräch** beginnt, wenn etwas nicht stimmt: Der Zug fällt aus, das Zimmer ist nicht reserviert, das gekaufte Handy ist kaputt. Beide folgen einem Weg: höflich begrüßen, Anliegen oder Problem schildern, auf die Antwort eingehen, eine Lösung verlangen oder vorschlagen, sich bedanken oder verabschieden.",
      "Höflich bleibst du mit dem conditionnel und festen Wendungen: « Je voudrais … », « Pourriez-vous … ? », « Excusez-moi, il y a un problème avec … ». Das Problem beschreibst du genau: « J’ai réservé une chambre pour deux nuits, mais vous n’avez pas ma réservation. » Wenn du eine Lösung willst: « Est-ce que je peux être remboursé(e)? », « Je voudrais échanger ce pull. », « Est-ce qu’il y a une autre solution? »",
      "**Auf den Gesprächspartner eingehen** heißt: zuhören, nachfragen und reagieren. « Si je comprends bien, le prochain train part à 15 heures? » fasst zusammen. « Je comprends, mais … » zeigt Verständnis und hält trotzdem am Anliegen fest. « Ce n’est pas possible? Alors, qu’est-ce que vous me proposez? » führt das Gespräch weiter, wenn die erste Antwort nein ist.",
      "Typische Fehler: zu direkt sein (« Je veux mon argent! » statt « Je voudrais être remboursé »), das Problem nur ungenau beschreiben oder die Antwort des Gegenübers überhören. Die App nimmt keine Sprache auf: Plane das Gespräch schriftlich und spiele es dann mit einem Partner.",
    ],
    terms: [
      { term: "Dienstleistungsgespräch", text: "Ein Gespräch, in dem du etwas brauchst: kaufen, reservieren, eine Auskunft bekommen." },
      { term: "Konfliktgespräch", text: "Ein Gespräch über ein Problem, zum Beispiel eine Reklamation, mit dem Ziel einer Lösung." },
      { term: "rembourser", text: "Geld zurückzahlen. Être remboursé(e) heißt, sein Geld zurückbekommen." },
      { term: "échanger", text: "Umtauschen: « Je voudrais échanger ce pull contre une autre taille. »" },
    ],
    takeaway:
      "Gesprächsweg: höflich begrüßen, Problem genau schildern, auf die Antwort eingehen (si je comprends bien, je comprends, mais), Lösung verlangen oder vorschlagen, sich bedanken. Höflich mit je voudrais und pourriez-vous.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Wie reklamierst du höflich, dass dein neuer Kopfhörer nicht funktioniert?",
      answer: "Excusez-moi, ce casque ne marche pas. Je voudrais l’échanger.",
      wrong: ["Votre casque est nul, rendez-moi mon argent tout de suite!", "Bonjour, je voudrais acheter un casque qui marche bien."],
      explanation:
        "Die richtige Antwort entschuldigt sich, nennt das Problem genau und bittet mit je voudrais um Umtausch. Die zweite ist unhöflich, die dritte beschreibt gar kein Problem.",
    },
    workshop: {
      kind: "timeline",
      title: "Ein Gespräch am Bahnschalter ordnen",
      instruction: "Bringe die Zeilen in eine sinnvolle Reihenfolge: Begrüßung und Problem, Antwort, Nachfrage, Lösung, Abschluss.",
      categories: [],
      entries: [
        { text: "– Bonjour madame. Mon train pour Bordeaux est annulé. Qu’est-ce que je peux faire?", target: 0, feedback: "Das Gespräch beginnt mit Begrüßung und genauer Beschreibung des Problems." },
        { text: "– Je suis désolée, il y a une grève. Le prochain train part à 16 heures.", target: 1, feedback: "Die Angestellte erklärt den Grund und nennt eine Alternative." },
        { text: "– Si je comprends bien, je peux prendre le train de 16 heures avec mon billet?", target: 2, feedback: "Mit si je comprends bien fasst der Reisende zusammen und fragt nach." },
        { text: "– Oui, c’est ça. Et vous pouvez demander un remboursement partiel sur notre site.", target: 3, feedback: "Die Angestellte bestätigt und nennt eine weitere Lösung." },
        { text: "– Parfait, merci beaucoup pour votre aide. Au revoir!", target: 4, feedback: "Am Ende bedankt sich der Reisende und verabschiedet sich." },
      ],
      conclusion: "Problem, Antwort, Nachfrage, Lösung, Dank: So bleibt auch ein ärgerliches Gespräch höflich und führt zu einem Ergebnis.",
    },
    casework: {
      title: "Das Hotelzimmer ist nicht reserviert",
      story:
        "Du kommst mit deiner Familie in Nantes an. An der Rezeption sagt man dir: « Désolé, je ne trouve pas votre réservation et l’hôtel est complet ce soir. » Du hast eine Bestätigungs-E-Mail auf dem Handy.",
      steps: [
        {
          question: "Wie schilderst du das Problem am besten?",
          options: ["J’ai réservé deux chambres pour ce soir. Voici la confirmation.", "Ce n’est pas mon problème, monsieur, trouvez vite une solution!", "Ah bon? Tant pis, alors nous allons chercher un autre hôtel."],
          answer: 0,
          explanation: "Du beschreibst genau, was du reserviert hast, und zeigst den Beweis. Die zweite Antwort ist unhöflich, die dritte gibt sofort auf.",
        },
        {
          question: "Der Angestellte sagt: « L’hôtel est complet. » Wie gehst du darauf ein?",
          options: ["Je comprends, mais qu’est-ce que vous nous proposez?", "Complet? Je ne comprends pas ce mot, vous pouvez répéter?", "D’accord, pas de problème, nous dormirons dans la voiture."],
          answer: 0,
          explanation: "Je comprends, mais zeigt Verständnis und hält am Anliegen fest. Die Frage nach einem Vorschlag führt weiter.",
        },
        {
          question: "Er bietet ein Zimmer in einem Partnerhotel an. Was fragst du sinnvoll nach?",
          options: ["C’est loin et est-ce que c’est le même prix?", "Est-ce que vous aimez travailler dans cet hôtel?", "Quel temps fera-t-il demain matin à Nantes?"],
          answer: 0,
          explanation: "Entfernung und Preis entscheiden, ob die Lösung passt. Die anderen Fragen gehören nicht zum Problem.",
        },
      ],
      verdict:
        "Problem mit Beleg schildern, Verständnis zeigen und trotzdem eine Lösung verlangen, dann die Lösung prüfen: So endet das Gespräch mit einem Zimmer.",
    },
    tasks: {
      1: {
        prompt:
          "Du hast in einem Geschäft in Paris einen Pullover gekauft, er ist zu klein. Schreibe auf Französisch vier Sätze, die du an der Kasse sagst: Begrüßung, Problem, Wunsch, Dank.",
        hints: ["Für den Wunsch passt je voudrais und échanger.", "Nenne das Problem genau: c’est trop petit."],
        model:
          "Bonjour monsieur. J’ai acheté ce pull hier, mais il est trop petit pour moi. Je voudrais l’échanger contre une taille plus grande, s’il vous plaît. Voici mon ticket de caisse. Merci beaucoup!",
        criteria: ["Begrüßung, Problem, Wunsch und Dank sind enthalten.", "Das Problem ist genau beschrieben.", "Der Ton ist höflich (je voudrais, s’il vous plaît)."],
      },
      2: {
        prompt:
          "Schreibe einen Dialog von acht bis zehn Zeilen: Dein Fahrrad aus dem Verleih (location de vélos) in Lyon hat nach zehn Minuten einen Platten. Die Angestellte will zuerst nichts zurückzahlen. Ihr findet eine Lösung.",
        hints: ["Lass die Angestellte zuerst nein sagen und reagiere mit je comprends, mais.", "Schlage selbst eine Lösung vor: un autre vélo, un remboursement partiel."],
        model:
          "– Bonjour, j’ai loué ce vélo il y a dix minutes, mais le pneu est crevé. – Désolée, mais nous ne remboursons pas les locations commencées. – Je comprends, mais je n’ai presque pas utilisé le vélo. – C’est la règle, monsieur. – Alors, est-ce que je peux avoir un autre vélo sans payer? – Bon, d’accord, je vous donne un autre vélo. – Merci, c’est très gentil. – Je vous en prie, bonne journée!",
        criteria: ["Das Problem ist klar beschrieben.", "Der Sprecher geht auf das Nein ein und bleibt höflich.", "Am Ende steht eine Lösung."],
      },
    },
  },
  {
    id: "fr-kurzpraesentation",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.4"],
    title: "Eine Kurzpräsentation vorbereiten und halten",
    intro:
      "Einen Film, ein Buch oder ein Projekt stellst du in drei bis fünf Minuten vor: mit klarem Aufbau, Stichpunkten und eigenen Worten.",
    paragraphs: [
      "Eine **Kurzpräsentation** dauert wenige Minuten und folgt einem klaren Aufbau. **Einleitung**: Thema nennen und Interesse wecken (« Aujourd’hui, je vais vous présenter … », « Avez-vous déjà entendu parler de … ? »). **Hauptteil**: zwei oder drei Punkte, zum Beispiel Inhalt, Personen, Bewertung. **Schluss**: kurze Zusammenfassung, eigene Meinung, Dank (« Pour conclure, … », « Merci de votre attention. »).",
      "Für die Gliederung nutzt du Wendungen, die den Zuhörern zeigen, wo du bist: « D’abord, je vais parler de … », « Ensuite, … », « Passons maintenant à … », « Enfin, … ». Bei einem Film sagst du « Le film raconte l’histoire de … », « Ça se passe à … », « Le personnage principal s’appelle … ». Bei einem Projekt nennst du Ziel, Personen und Ergebnis.",
      "Sprich frei mit **Stichpunkten**: Schreib keine ganzen Sätze auf die Karte, sondern Schlüsselwörter und die Gliederungswörter. Übe laut und stoppe die Zeit. Ein Bild oder eine Folie mit wenigen Wörtern hilft den Zuhörern. Plane eine Frage an das Publikum ein, das macht den Vortrag lebendig.",
      "Typische Fehler: den Text ablesen, zu viele Details zum Inhalt erzählen und keine eigene Bewertung geben, oder Sätze aus dem Internet übernehmen, die du selbst nicht verstehst. Nutze Wörter, die du sicher aussprechen kannst. Die App hört dich nicht: Halte den Vortrag vor Mitschülern oder nimm dich mit dem Handy auf.",
    ],
    terms: [
      { term: "Gliederungswörter", text: "Wendungen, die den Aufbau zeigen: d’abord, ensuite, passons maintenant à, enfin, pour conclure." },
      { term: "Stichpunkte", text: "Schlüsselwörter auf einer Karte statt ganzer Sätze. Sie helfen dir, frei zu sprechen." },
      { term: "le personnage principal", text: "Die Hauptfigur eines Films oder Buchs." },
    ],
    takeaway:
      "Einleitung (Thema, Interesse wecken), Hauptteil (zwei bis drei Punkte), Schluss (Zusammenfassung, Meinung, Dank). Gliederungswörter zeigen den Weg, Stichpunkte statt Sätze helfen beim freien Sprechen.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Welcher Satz passt am besten als Einstieg in eine Präsentation über ein Buch?",
      answer: "Aujourd’hui, je vais vous présenter un livre qui m’a beaucoup touché.",
      wrong: ["Pour conclure, je vous recommande vraiment ce livre très touchant.", "Ensuite, le personnage principal part en voyage avec son frère."],
      explanation:
        "Aujourd’hui, je vais vous présenter nennt das Thema und weckt Interesse. Pour conclure gehört an den Schluss, ensuite in den Hauptteil.",
    },
    workshop: {
      kind: "classify",
      title: "Sätze dem Teil der Präsentation zuordnen",
      instruction: "Ordne jeden Satz der Einleitung, dem Hauptteil oder dem Schluss einer Präsentation über einen Film zu.",
      categories: ["Einleitung", "Hauptteil", "Schluss"],
      entries: [
        { text: "Avez-vous déjà vu un film qui vous a fait rire et pleurer en même temps?", target: 0, feedback: "Eine Frage an das Publikum weckt zu Beginn Interesse." },
        { text: "Le film raconte l’histoire d’un homme riche et de son aide-soignant.", target: 1, feedback: "Hier wird der Inhalt erzählt: Hauptteil." },
        { text: "Passons maintenant aux acteurs: ils jouent de manière très naturelle.", target: 1, feedback: "Passons maintenant à führt zum nächsten Punkt im Hauptteil." },
        { text: "Pour conclure, je vous conseille ce film, surtout si vous aimez les comédies.", target: 2, feedback: "Pour conclure und eine Empfehlung bilden den Schluss." },
        { text: "Aujourd’hui, je vais vous présenter un film français que j’adore.", target: 0, feedback: "Das Thema wird angekündigt: Einleitung." },
        { text: "Merci de votre attention. Est-ce que vous avez des questions?", target: 2, feedback: "Dank und Fragen stehen am Ende." },
      ],
      conclusion: "Frage und Ankündigung öffnen, Inhalt und weitere Punkte füllen den Hauptteil, Empfehlung und Dank schließen.",
    },
    casework: {
      title: "Ein Projekt vorstellen",
      story:
        "Deine Klasse hat Kleidung für eine Hilfsorganisation gesammelt. Du sollst das Projekt in drei Minuten auf Französisch vorstellen. Deine Notizen: « but: aider les familles · 3 semaines · 200 vêtements · problème: tri · résultat: fiers ».",
      steps: [
        {
          question: "Womit beginnst du?",
          options: ["Mit dem Ziel und einer Frage an die Klasse.", "Mit der genauen Zahl der gesammelten Kleidungsstücke.", "Mit dem Problem beim Sortieren der Kleidung."],
          answer: 0,
          explanation: "Die Einleitung nennt das Thema und weckt Interesse. Zahlen und Probleme gehören in den Hauptteil.",
        },
        {
          question: "Wie schreibst du die Notizen auf deine Karte?",
          options: ["Als Stichpunkte mit Gliederungswörtern.", "Als vollständigen Text zum Ablesen.", "Gar nicht, ich improvisiere einfach alles."],
          answer: 0,
          explanation: "Stichpunkte helfen beim freien Sprechen. Ablesen wirkt steif, ganz ohne Notizen verlierst du leicht den Faden.",
        },
        {
          question: "Welcher Satz passt in den Schluss?",
          options: ["Pour conclure, nous sommes fiers de ce projet.", "D’abord, nous avons collecté des vêtements.", "Le but était d’aider des familles."],
          answer: 0,
          explanation: "Pour conclure und die eigene Bewertung bilden den Schluss. Die anderen Sätze gehören in Einleitung und Hauptteil.",
        },
      ],
      verdict:
        "Ziel und Frage zu Beginn, Ablauf, Zahlen und Probleme im Hauptteil, Bewertung am Schluss: So wird aus Notizen eine klare Präsentation.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe die Stichpunktkarte für eine Präsentation über einen Film, den du magst: je eine Zeile für Einleitung, zwei Punkte im Hauptteil und Schluss, mit französischen Gliederungswörtern.",
        hints: ["Schreibe nur Schlüsselwörter, keine ganzen Sätze.", "Jede Zeile beginnt mit einem Gliederungswort."],
        model:
          "Einleitung: Aujourd’hui · film « Intouchables » · question au public. Hauptteil: D’abord · histoire: Philippe, riche, handicapé + Driss, aide · amitié. Ensuite · acteurs naturels · humour. Schluss: Pour conclure · à voir · merci · questions?",
        criteria: ["Alle drei Teile sind vorhanden.", "Die Karte enthält Stichpunkte, keine ganzen Sätze.", "Gliederungswörter zeigen den Aufbau."],
      },
      2: {
        prompt:
          "Schreibe den vollständigen Text einer Kurzpräsentation (acht bis zehn Sätze) über ein Buch, eine Serie oder ein soziales Projekt. Er soll eine Frage an das Publikum, zwei Punkte im Hauptteil und eine begründete Bewertung enthalten.",
        hints: ["Nutze d’abord, ensuite, pour conclure.", "Begründe deine Bewertung mit parce que oder car."],
        model:
          "Bonjour à tous! Est-ce que vous lisez des BD? Aujourd’hui, je vais vous présenter « Le Petit Prince » d’Antoine de Saint-Exupéry. D’abord, l’histoire: un pilote tombe en panne dans le désert et rencontre un petit garçon qui vient d’une autre planète. Ensuite, les personnages: le renard, la rose et le roi montrent les défauts des adultes. Le livre est court, mais il fait réfléchir. Pour conclure, je vous le conseille, car il parle de l’amitié d’une manière très simple. Merci de votre attention!",
        criteria: ["Der Text hat Einleitung mit Frage, Hauptteil mit zwei Punkten und Schluss.", "Die Bewertung ist begründet.", "Gliederungswörter verbinden die Teile."],
      },
    },
  },
  {
    id: "fr-erfahrungen-plaene",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.5", "1.1.10"],
    title: "Erfahrungen, Träume, Hoffnungen und Pläne beschreiben",
    intro:
      "Was du erlebt hast, was du dir erhoffst und was du vorhast: Mit den passenden Zeiten erzählst du klar und detailliert.",
    paragraphs: [
      "Für **Erfahrungen** und **Ereignisse in der Vergangenheit** brauchst du zwei Zeiten: das **passé composé** für einzelne, abgeschlossene Handlungen (« L’été dernier, j’ai fait un stage à Lyon. ») und das **imparfait** für Hintergrund, Gefühle und Gewohnheiten (« J’étais nerveuse, mais mes collègues étaient très gentils. »). Erzählst du von gerade Geschehenem, hilft **venir de**: « Je viens de rentrer. »",
      "Für **Pläne** nutzt du das **futur composé** (aller + Infinitiv) für Nahes und Sicheres (« Après le bac, je vais faire un apprentissage. ») und das **futur simple** für fernere Pläne und Vorhersagen (« Plus tard, je travaillerai à l’étranger. »). Wendungen für Pläne sind avoir l’intention de, compter + Infinitiv, prévoir de.",
      "**Träume und Hoffnungen** drückst du mit Verben und Wendungen aus: « J’espère que je trouverai un bon travail. » (nach espérer steht der Indikativ, oft im Futur), « Je rêve de vivre au bord de la mer. », « Mon rêve, ce serait de … », « J’aimerais bien … ». Mit dem conditionnel klingen Wünsche vorsichtiger: « Je voudrais voyager en Afrique. »",
      "Detailliert wird ein Bericht durch Ort, Zeit, Personen und Gefühle: nicht nur « C’était bien », sondern « C’était une expérience géniale, parce que j’ai pu parler français tous les jours. » Typische Fehler: das imparfait für eine einmalige Handlung (« Hier, je visitais le musée »), nach j’espère que ein Subjonctif oder fehlendes de nach rêver (« je rêve vivre »).",
    ],
    terms: [
      { term: "passé composé und imparfait", text: "Das passé composé erzählt einzelne Handlungen, das imparfait beschreibt Hintergrund, Gefühle und Gewohnheiten." },
      { term: "futur composé", text: "aller + Infinitiv: für nahe, sichere Pläne. « Je vais commencer mon stage lundi. »" },
      { term: "espérer que", text: "Hoffen, dass. Danach steht der Indikativ, oft das futur simple: « J’espère qu’il viendra. »" },
      { term: "rêver de", text: "Davon träumen, etwas zu tun. Nach rêver steht de + Infinitiv: « Je rêve de devenir pilote. »" },
    ],
    takeaway:
      "Vergangenes: passé composé für Handlungen, imparfait für Hintergrund und Gefühle. Pläne: futur composé (nah) und futur simple (fern). Hoffnungen und Träume: espérer que + Indikativ, rêver de + Infinitiv, j’aimerais bien.",
    sourceIds: ["lp", "lp9", "lingolia"],
    quiz: {
      question: "Wie sagst du: „Ich hoffe, dass ich eine Lehrstelle finde“?",
      answer: "J’espère que je trouverai une place d’apprentissage.",
      wrong: ["J’espère que je trouvais une place d’apprentissage.", "J’espère de trouver une place d’apprentissage."],
      explanation:
        "Nach espérer que steht der Indikativ, für die Zukunft das futur simple: je trouverai. Das imparfait gehört in die Vergangenheit, und espérer de + Infinitiv gibt es nicht.",
    },
    workshop: {
      kind: "choose",
      title: "Die passende Zeit wählen",
      instruction: "Wähle für jede Lücke die Form, die zur Zeitangabe und zur Bedeutung passt.",
      items: [
        { before: "L’été dernier, j’", options: ["ai fait", "faisais", "ferai"], answer: 0, after: " un stage dans un hôtel à Nice.", feedback: "L’été dernier und eine einzelne, abgeschlossene Handlung: passé composé." },
        { before: "Le premier jour, j’", options: ["étais", "ai été", "serai"], answer: 0, after: " très nerveux.", feedback: "Ein Gefühl als Hintergrund steht im imparfait: j’étais nerveux." },
        { before: "Lundi prochain, je ", options: ["vais commencer", "commençais", "ai commencé"], answer: 0, after: " mon nouveau job.", feedback: "Ein naher, sicherer Plan: futur composé mit aller + Infinitiv." },
        { before: "Plus tard, j’espère que je ", options: ["travaillerai", "travaillais", "travailler"], answer: 0, after: " au Canada.", feedback: "Nach j’espère que steht für die Zukunft das futur simple." },
        { before: "Je rêve ", options: ["de", "à", "que"], answer: 0, after: " faire le tour du monde.", feedback: "Rêver verlangt vor dem Infinitiv die Präposition de." },
      ],
      conclusion: "Zeitangabe und Bedeutung entscheiden: Handlung oder Hintergrund, naher oder ferner Plan, Hoffnung mit Indikativ, Traum mit de.",
    },
    casework: {
      title: "Ein Bericht über den Austausch",
      story:
        "Mia schreibt: « En mars, j’ai passé deux semaines à Rennes chez ma correspondante. Au début, je ne comprenais pas grand-chose, mais après quelques jours, c’était plus facile. L’année prochaine, Chloé va venir chez nous. Un jour, j’aimerais bien faire mes études en France. »",
      steps: [
        {
          question: "Warum steht « je ne comprenais pas » im imparfait?",
          options: ["Es beschreibt einen Zustand am Anfang.", "Es ist eine einmalige, abgeschlossene Handlung.", "Es ist ein Plan für die Zukunft."],
          answer: 0,
          explanation: "Das Nicht-Verstehen dauerte an und bildet den Hintergrund: imparfait.",
        },
        {
          question: "Welche Form drückt einen sicheren Plan aus?",
          options: ["Chloé va venir chez nous.", "J’ai passé deux semaines.", "J’aimerais bien faire mes études."],
          answer: 0,
          explanation: "Va venir ist futur composé: Der Gegenbesuch ist geplant. J’aimerais bien ist ein Wunsch.",
        },
        {
          question: "Was drückt « j’aimerais bien » aus?",
          options: ["Einen vorsichtigen Wunsch.", "Eine Gewohnheit in der Vergangenheit.", "Eine sichere Tatsache."],
          answer: 0,
          explanation: "Aimer im conditionnel klingt vorsichtig: Mia wünscht es sich, sicher ist es nicht.",
        },
      ],
      verdict:
        "Mia erzählt mit passé composé und imparfait, plant mit dem futur composé und wünscht mit dem conditionnel. So wird ihr Bericht klar und lebendig.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe auf Französisch je einen Satz: 1. eine Erfahrung vom letzten Sommer, 2. wie du dich dabei gefühlt hast, 3. einen Plan für das nächste Jahr, 4. einen Traum.",
        hints: ["Für 1 das passé composé, für 2 das imparfait.", "Für 3 aller + Infinitiv, für 4 rêver de oder j’aimerais."],
        model:
          "1. L’été dernier, j’ai travaillé dans une boulangerie. 2. J’étais fatigué, mais j’étais content de gagner un peu d’argent. 3. L’année prochaine, je vais commencer une formation de mécanicien. 4. Je rêve d’ouvrir un jour mon propre garage.",
        criteria: ["Jeder Satz nutzt die passende Zeit.", "Rêver de oder j’aimerais ist richtig gebaut.", "Die vier Sätze ergeben ein stimmiges Bild."],
      },
      2: {
        prompt:
          "Schreibe einen Text von acht bis zehn Sätzen für einen französischen Blog: Erzähle von einer Erfahrung, die dich verändert hat, beschreibe deine Gefühle und sage, welche Pläne und Hoffnungen du daraus hast.",
        hints: ["Wechsle zwischen passé composé (Handlungen) und imparfait (Gefühle, Hintergrund).", "Ende mit Plänen (futur) und einer Hoffnung (espérer que)."],
        model:
          "L’année dernière, j’ai fait du bénévolat dans une maison de retraite. Au début, j’avais un peu peur, parce que je ne savais pas comment parler avec les personnes âgées. Mais une dame, Madame Roux, m’a raconté sa vie pendant la guerre. Ses histoires étaient passionnantes. Depuis, je vais la voir chaque samedi. Cette expérience m’a montré que j’aime aider les autres. L’année prochaine, je vais commencer une formation d’aide-soignant. J’espère que je trouverai un poste près de chez moi. Mon rêve, ce serait de travailler un jour dans un hôpital en Afrique.",
        criteria: ["Erfahrung und Gefühle stehen in den passenden Vergangenheitszeiten.", "Pläne und Hoffnungen sind richtig ausgedrückt.", "Der Text ist detailliert und zusammenhängend."],
      },
    },
    practice: {
      kind: "choose",
      title: "Vergangenheit, Pläne und Träume: Übungsrunde",
      instruction: "Wähle die Form, die zur Bedeutung passt. Eine Runde zählt, wenn alle drei Sätze richtig sind.",
      pool: {
        1: [
          { before: "Hier, j’", options: ["ai rencontré", "rencontrais"], answer: 0, after: " mon nouveau chef.", feedback: "Hier und eine einzelne Handlung: passé composé." },
          { before: "Il ", options: ["faisait", "a fait"], answer: 0, after: " très beau ce jour-là.", feedback: "Das Wetter als Hintergrund steht im imparfait." },
          { before: "Demain, nous ", options: ["allons partir", "partions"], answer: 0, after: " à Lyon.", feedback: "Ein naher Plan: aller + Infinitiv." },
          { before: "J’espère qu’elle ", options: ["viendra", "venait"], answer: 0, after: " à ma fête.", feedback: "Nach j’espère que steht für die Zukunft das futur simple." },
          { before: "Je rêve ", options: ["de", "à"], answer: 0, after: " devenir acteur.", feedback: "Rêver de + Infinitiv: Nach rêver steht de." },
          { before: "Quand j’étais petit, je ", options: ["voulais", "ai voulu"], answer: 0, after: " être pompier.", feedback: "Ein Wunsch, der lange bestand, steht im imparfait." },
          { before: "Plus tard, je ", options: ["vivrai", "vivais"], answer: 0, after: " à la campagne.", feedback: "Ein ferner Plan: futur simple." },
          { before: "Je viens ", options: ["de", "à"], answer: 0, after: " finir mon stage.", feedback: "Venir de + Infinitiv heißt „gerade etwas getan haben“." },
        ],
        2: [
          { before: "Pendant mon séjour à Québec, j’", options: ["ai découvert", "découvrais", "découvrirai"], answer: 0, after: " un festival de musique incroyable au centre-ville.", feedback: "Eine einzelne, abgeschlossene Entdeckung während des Aufenthalts: passé composé." },
          { before: "Au début du stage, je ne ", options: ["savais", "ai su", "saurai"], answer: 0, after: " pas encore utiliser la caisse, alors une collègue m’aidait.", feedback: "Ein Zustand am Anfang, der andauerte: imparfait." },
          { before: "Après mon examen en juin, je ", options: ["vais chercher", "cherchais", "ai cherché"], answer: 0, after: " un job d’été pour gagner un peu d’argent.", feedback: "Ein geplanter, naher Schritt nach der Prüfung: futur composé." },
          { before: "Mes parents espèrent que je ", options: ["réussirai", "réussissais", "ai réussi"], answer: 0, after: " mon examen final et que je trouverai vite du travail.", feedback: "Nach espérer que steht für die Zukunft das futur simple: je réussirai." },
          { before: "Depuis toujours, ma sœur rêve ", options: ["d’", "à", "qu’"], answer: 0, after: "ouvrir un petit restaurant de spécialités bretonnes à Berlin.", feedback: "Rêver de + Infinitiv; vor ouvrir wird de zu d’." },
          { before: "Quand nous ", options: ["sommes arrivés", "arrivions", "arriverons"], answer: 0, after: " à la gare, le train était déjà parti depuis dix minutes.", feedback: "Die Ankunft ist ein einzelnes Ereignis: passé composé. Der Zug war schon weg: Hintergrund." },
          { before: "Dans dix ans, j’", options: ["aurai", "avais", "ai eu"], answer: 0, after: " peut-être ma propre entreprise et beaucoup de collègues sympas.", feedback: "Eine Vorstellung von der fernen Zukunft: futur simple von avoir." },
          { before: "Chaque matin du séjour, nous ", options: ["prenions", "avons pris", "prendrons"], answer: 0, after: " le petit déjeuner avec la famille avant d’aller au collège.", feedback: "Chaque matin zeigt eine Gewohnheit: imparfait." },
        ],
      },
    },
  },
  {
    id: "fr-meinung-gefuehle",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.6", "1.2.1.4"],
    title: "Meinungen und Gefühle differenziert ausdrücken",
    intro:
      "Statt nur « c’est bien » sagst du genau, was du denkst und fühlst: mit abgestuften Wendungen, Begründungen und Rat wie « à ta place ».",
    paragraphs: [
      "Eine **Meinung** leitest du mit Wendungen ein: à mon avis, selon moi, je pense que, je trouve que, il me semble que. Differenziert wird sie, wenn du **abstufst**: « Je suis tout à fait d’accord », « Je suis plutôt d’accord », « Je ne suis pas vraiment convaincu », « Je ne suis pas du tout d’accord ». Mit « D’un côté … de l’autre … » zeigst du, dass du beide Seiten siehst.",
      "Präzise bewertest du mit **il est important de / il est essentiel de / il est inutile de + Infinitiv**: « Il est important de trier ses déchets. » Einen Rat gibst du mit **à ta place** (an deiner Stelle) und dem conditionnel: « À ta place, je parlerais avec ton professeur. » Höflicher und vorsichtiger klingt « Tu devrais … » (du solltest).",
      "**Gefühle** drückst du mit Adjektiven und Verben aus: je suis content(e), déçu(e), inquiet/inquiète, fier/fière de; ça m’énerve, ça me fait peur, ça me rend triste, j’en ai marre (umgangssprachlich: ich habe genug). Nach einem Gefühlsausdruck folgt am besten der Grund: « Je suis déçue, parce que le concert a été annulé. »",
      "Typische Fehler: nach je pense que fehlt der Grund, oder « Je suis d’accord avec » steht ohne Ergänzung. Bei Adjektiven auf Angleichung achten: « Elle est inquiète. » Il est important de steht vor einem Infinitiv; vor einem ganzen Satz steht il est important que mit Subjonctif, das lernst du in der Lektion zu den Wendungen mit Subjonctif.",
    ],
    terms: [
      { term: "abgestufte Meinung", text: "Zustimmung oder Ablehnung in Stufen: tout à fait, plutôt, pas vraiment, pas du tout d’accord." },
      { term: "il est important de", text: "Es ist wichtig, etwas zu tun. Danach steht ein Infinitiv: « Il est important de dormir assez. »" },
      { term: "à ta place", text: "An deiner Stelle. Danach steht meist der conditionnel: « À ta place, je dirais la vérité. »" },
      { term: "j’en ai marre", text: "Umgangssprachlich: Ich habe genug davon, es nervt mich. Nur unter Freunden verwenden." },
    ],
    takeaway:
      "Meinung einleiten (à mon avis, je trouve que), abstufen (tout à fait, plutôt, pas vraiment, pas du tout), bewerten mit il est important de + Infinitiv, raten mit à ta place + conditionnel. Gefühle immer begründen.",
    sourceIds: ["lp", "lingolia", "larousse"],
    quiz: {
      question: "Wie rätst du einer Freundin: „An deiner Stelle würde ich mit dem Lehrer sprechen“?",
      answer: "À ta place, je parlerais avec le prof.",
      wrong: ["À ta place, je parle avec le professeur.", "Dans ta place, je parlerais avec le prof."],
      explanation:
        "À ta place ist die feste Wendung, danach steht der conditionnel je parlerais. Das Präsens klingt nicht wie ein Rat, dans ta place gibt es nicht.",
    },
    workshop: {
      kind: "timeline",
      title: "Von voller Zustimmung bis zur Ablehnung",
      instruction: "Ordne die Aussagen zu « Il faut interdire les voitures en ville » von der stärksten Zustimmung bis zur stärksten Ablehnung.",
      categories: [],
      entries: [
        { text: "Je suis tout à fait d’accord: les voitures n’ont rien à faire en ville.", target: 0, feedback: "Tout à fait d’accord ist die stärkste Zustimmung." },
        { text: "Je suis plutôt d’accord, mais il faut de bons transports en commun.", target: 1, feedback: "Plutôt d’accord stimmt zu, mit einer Bedingung." },
        { text: "D’un côté, c’est bon pour l’air, de l’autre, c’est difficile pour les artisans.", target: 2, feedback: "D’un côté … de l’autre wägt ab und legt sich nicht fest: die Mitte." },
        { text: "Je ne suis pas vraiment convaincu, car beaucoup de gens en ont besoin.", target: 3, feedback: "Pas vraiment convaincu ist eine vorsichtige Ablehnung." },
        { text: "Je ne suis pas du tout d’accord: c’est une idée complètement absurde.", target: 4, feedback: "Pas du tout d’accord und absurde: die stärkste Ablehnung." },
      ],
      conclusion: "Tout à fait, plutôt, d’un côté … de l’autre, pas vraiment, pas du tout: Mit diesen Stufen sagst du genau, wie stark du zustimmst.",
    },
    casework: {
      title: "Eine Freundin braucht Rat",
      story:
        "Deine Brieffreundin Zoé schreibt: « Je suis triste. Ma meilleure amie ne me parle plus depuis une semaine et je ne sais pas pourquoi. Qu’est-ce que tu ferais à ma place? »",
      steps: [
        {
          question: "Wie zeigst du zuerst Verständnis für ihr Gefühl?",
          options: ["Je comprends que tu sois triste, c’est dur.", "Ce n’est pas grave, oublie-la vite et sors!", "Moi, je suis très content aujourd’hui, tu sais."],
          answer: 0,
          explanation: "Du gehst auf ihr Gefühl ein. Die zweite Antwort wischt es weg, die dritte spricht nur von dir.",
        },
        {
          question: "Welcher Rat ist sprachlich richtig?",
          options: ["À ta place, je lui demanderais ce qui se passe.", "À ta place, je lui demande ce qui se passe.", "À ta place, je lui demandais ce qui se passe."],
          answer: 0,
          explanation: "Nach à ta place steht der conditionnel: je demanderais. Präsens und imparfait passen nicht.",
        },
        {
          question: "Wie begründest du deinen Rat am besten?",
          options: ["Il est important de parler: c’est peut-être un malentendu.", "Il est important que parler, parce que c’est très important.", "C’est comme ça, voilà, tu ne peux rien y faire de toute façon."],
          answer: 0,
          explanation: "Il est important de + Infinitiv ist richtig, und der Grund (un malentendu, ein Missverständnis) überzeugt.",
        },
      ],
      verdict:
        "Verständnis zeigen, mit à ta place und dem conditionnel raten und mit il est important de begründen: So wird aus einer Antwort ein echter Rat.",
    },
    tasks: {
      1: {
        prompt:
          "Gib auf Französisch zu « Les devoirs sont inutiles » deine Meinung in drei Sätzen: abgestufte Meinung, Begründung, ein Satz mit il est important de.",
        hints: ["Wähle eine Stufe: tout à fait, plutôt, pas vraiment, pas du tout d’accord.", "Il est important de steht vor einem Infinitiv."],
        model:
          "Je ne suis pas vraiment d’accord. Les devoirs nous aident à répéter ce que nous avons appris en classe, mais il y en a parfois trop. À mon avis, il est important de faire des devoirs courts et réguliers.",
        criteria: ["Die Meinung ist abgestuft formuliert.", "Sie ist begründet.", "Il est important de + Infinitiv ist richtig verwendet."],
      },
      2: {
        prompt:
          "Ein französischer Freund schreibt dir, dass er seine Lehre abbrechen will, weil er sich mit seinem Chef nicht versteht. Antworte in sechs bis acht Sätzen: Zeige deine Gefühle, gib eine differenzierte Meinung und zwei Ratschläge mit à ta place und tu devrais.",
        hints: ["Beginne mit einem Gefühl und seinem Grund.", "Wäge mit d’un côté … de l’autre ab, bevor du rätst."],
        model:
          "Salut Théo, je suis vraiment désolé que ça se passe mal avec ton chef. Je comprends que tu en aies marre. D’un côté, tu as le droit de travailler dans une bonne ambiance, de l’autre, il ne te reste qu’un an avant ton diplôme. À ta place, je parlerais d’abord calmement avec lui. Tu devrais aussi demander conseil à ton professeur au centre de formation. Il est important de ne pas abandonner trop vite. Courage, je pense à toi!",
        criteria: ["Gefühle sind ausgedrückt und begründet.", "Die Meinung wägt beide Seiten ab.", "Zwei Ratschläge mit à ta place und tu devrais sind richtig gebildet."],
      },
    },
  },
];
