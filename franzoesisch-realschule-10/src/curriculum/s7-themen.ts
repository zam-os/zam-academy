import type { Lesson } from "../model/types";

/**
 * Stufe 7: Themengebiete (Kompetenzerwartungen 5.1 und 5.2). Der Plan nennt soziales Engagement (15 Stunden),
 * französischsprachige Persönlichkeiten aus Kultur, Sport und Medien (15), französische Errungenschaften (10),
 * deutsch-französische Freundschaft (15, in Stufe 4), Berufs- und Arbeitswelt (15), Frankophonie (10) und
 * aktuelle Themen. Aussagen über lebende Personen beschränken sich auf lange bekannte Leistungen;
 * aktuelle Themen übt die App an einem erfundenen Beispiel.
 */
export const S7: Lesson[] = [
  {
    id: "fr-soziales-engagement",
    lb: 7,
    unit: "5",
    covers: ["5.1", "5.2"],
    title: "Soziales Engagement in Frankreich",
    intro:
      "Restos du Cœur, Téléthon, service civique: In Frankreich engagieren sich viele Menschen. Du lernst Beispiele kennen und sprichst über dich.",
    paragraphs: [
      "In Frankreich spielt das **bénévolat** eine große Rolle. Viele Menschen arbeiten in **associations** ehrenamtlich mit. Die bekannteste ist wohl **les Restos du Cœur**: 1985 gründete der Komiker **Coluche** sie, um im Winter kostenlos Mahlzeiten an Bedürftige zu verteilen. Heute helfen dort jedes Jahr sehr viele Freiwillige. Älter ist **Emmaüs**, 1949 vom Priester Abbé Pierre gegründet, die Obdachlosen Arbeit und Unterkunft gibt.",
      "Jedes Jahr im Dezember sammelt der **Téléthon** im Fernsehen und in vielen Orten Spenden für die Erforschung seltener Krankheiten. Schulen, Vereine und Feuerwehren organisieren dafür Läufe, Kuchenverkäufe und Konzerte. Für Jugendliche gibt es seit 2010 den **service civique**: Junge Menschen von 16 bis 25 Jahren engagieren sich sechs bis zwölf Monate für eine Aufgabe im Allgemeininteresse, zum Beispiel in Umweltschutz, Bildung oder Gesundheit, und bekommen eine monatliche Entschädigung.",
      "Engagement gibt es auch in Deutschland: das Freiwillige Soziale Jahr (FSJ), Jugendfeuerwehr, Tafeln, Sportvereine. Im Vergleich zeigen sich ähnliche Ideen in beiden Ländern: Solidarität, Hilfe vor Ort, Engagement junger Menschen. Für den Austausch sind solche Vergleiche ein gutes Gesprächsthema: « En Allemagne, il y a les Tafeln, qui ressemblent aux Restos du Cœur. »",
      "Über eigenes Engagement sprichst du mit Wendungen wie je fais du bénévolat dans …, je m’engage pour …, j’aide … une fois par semaine, ça me permet de …, je me sens utile. Bénévolat und volontariat sind nicht ganz dasselbe: Beim volontariat, zum Beispiel im service civique, gibt es eine Entschädigung, beim bénévolat nicht. Ein typischer Fehler ist « je suis bénévolat » statt je suis bénévole.",
    ],
    terms: [
      { term: "les Restos du Cœur", text: "Eine 1985 von Coluche gegründete Organisation, die Mahlzeiten und Hilfe an Bedürftige verteilt." },
      { term: "le Téléthon", text: "Eine jährliche Spendenaktion im Dezember für die Erforschung seltener Krankheiten." },
      { term: "le service civique", text: "Ein freiwilliger Dienst für 16- bis 25-Jährige: sechs bis zwölf Monate Engagement mit Entschädigung." },
    ],
    takeaway:
      "Engagement in Frankreich: bénévolat in associations, Restos du Cœur (Coluche, 1985), Emmaüs (Abbé Pierre, 1949), Téléthon im Dezember, service civique für 16- bis 25-Jährige seit 2010. Vergleich mit Deutschland: FSJ, Tafeln, Jugendfeuerwehr.",
    sourceIds: ["lp", "servicecivique", "larousse"],
    quiz: {
      question: "Was ist der service civique?",
      answer: "Ein freiwilliger Dienst für junge Menschen.",
      wrong: ["Ein Pflichtdienst bei der französischen Armee.", "Eine große Spendenaktion im Fernsehen."],
      explanation:
        "Der service civique ist freiwillig, für 16- bis 25-Jährige, mit einer Aufgabe im Allgemeininteresse. Die Spendenaktion im Fernsehen ist der Téléthon.",
    },
    workshop: {
      kind: "classify",
      title: "Organisationen und Aktionen zuordnen",
      instruction: "Ordne jede Beschreibung der passenden Organisation oder Aktion zu.",
      categories: ["Restos du Cœur", "Téléthon", "service civique"],
      entries: [
        { text: "Créés en 1985 par l’humoriste Coluche pour distribuer des repas gratuits", target: 0, feedback: "Coluche gründete 1985 die Restos du Cœur." },
        { text: "Chaque année en décembre, on collecte des dons pour la recherche médicale", target: 1, feedback: "Der Téléthon sammelt jedes Jahr im Dezember Spenden." },
        { text: "Un engagement de six à douze mois pour les jeunes de 16 à 25 ans", target: 2, feedback: "Das beschreibt den service civique." },
        { text: "Des bénévoles distribuent de la nourriture aux familles qui en ont besoin", target: 0, feedback: "Lebensmittel für Bedürftige: die Aufgabe der Restos du Cœur." },
        { text: "Des écoles organisent des courses et des ventes de gâteaux à la télé et en ville", target: 1, feedback: "Läufe und Kuchenverkäufe für die Spendensammlung: Téléthon." },
        { text: "Une jeune aide pendant huit mois dans une école et reçoit une indemnité", target: 2, feedback: "Ein Einsatz mit Entschädigung für eine junge Person: service civique." },
      ],
      conclusion: "Mahlzeiten für Bedürftige, Spenden für die Forschung und ein freiwilliger Dienst für junge Menschen: drei Formen von Engagement in Frankreich.",
    },
    casework: {
      title: "Ein Gespräch beim Austausch",
      story:
        "Deine Gastschwester Camille erzählt: « Le samedi, je suis bénévole aux Restos du Cœur. Après le bac, je voudrais faire un service civique dans une association pour l’environnement. Et toi, tu t’engages? »",
      steps: [
        {
          question: "Was macht Camille samstags?",
          options: ["Sie hilft ehrenamtlich bei den Restos du Cœur.", "Sie arbeitet bezahlt in einem Restaurant in der Stadt.", "Sie geht samstags mit Freunden essen."],
          answer: 0,
          explanation: "Bénévole heißt ehrenamtlich; die Restos du Cœur verteilen Essen an Bedürftige.",
        },
        {
          question: "Was plant Camille nach dem bac?",
          options: ["Einen freiwilligen Dienst im Umweltschutz.", "Ein Studium der Umweltwissenschaften.", "Einen bezahlten Job im Ausland."],
          answer: 0,
          explanation: "Un service civique ist ein freiwilliger Dienst, hier in einer Umweltorganisation.",
        },
        {
          question: "Wie antwortest du passend über eigenes Engagement?",
          options: ["Oui, je suis chez les jeunes pompiers de ma ville.", "Oui, je suis bénévolat dans un club de foot depuis deux ans.", "Non, l’engagement, ça ne sert à rien du tout, à mon avis."],
          answer: 0,
          explanation: "Du nennst ein konkretes Engagement richtig. Je suis bénévolat ist falsch, die dritte Antwort beendet das Gespräch.",
        },
      ],
      verdict:
        "Bénévole, service civique und ein eigenes Beispiel: So wird aus Camilles Frage ein echtes Gespräch über Engagement in beiden Ländern.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre auf Französisch in vier Sätzen, was die Restos du Cœur sind: wer sie gegründet hat, wann, was sie tun und wer dort hilft.",
        hints: ["Nutze das passé composé für die Gründung.", "Für die Tätigkeit passt das Präsens."],
        model:
          "Les Restos du Cœur sont une association française. Ils ont été créés en 1985 par l’humoriste Coluche. Ils distribuent des repas et de la nourriture aux personnes qui en ont besoin, surtout en hiver. Ce sont surtout des bénévoles qui y travaillent, souvent aussi des jeunes.",
        criteria: ["Gründer, Jahr, Tätigkeit und Helfer sind genannt.", "Die Fakten sind richtig.", "Die Zeiten sind passend gewählt."],
      },
      2: {
        prompt:
          "Vergleiche in einem Text für die Website eurer Partnerschule (acht bis zehn Sätze) das Engagement junger Menschen in Deutschland und Frankreich: je ein Beispiel aus beiden Ländern, Gemeinsamkeiten, Unterschiede und dein eigenes Engagement oder Interesse.",
        hints: ["Nutze alors que für Unterschiede und comme für Gemeinsamkeiten.", "Ende mit einem persönlichen Satz."],
        model:
          "En France comme en Allemagne, beaucoup de jeunes s’engagent pour les autres. En France, les jeunes de 16 à 25 ans peuvent faire un service civique de six à douze mois. En Allemagne, il existe le FSJ, une année de volontariat dans le social ou l’environnement. Les deux ressemblent beaucoup. Pour l’aide alimentaire, il y a les Restos du Cœur en France et les Tafeln en Allemagne. Une différence: en France, le Téléthon est une très grande action nationale, alors qu’en Allemagne, les collectes sont plus régionales. Moi, je suis membre de la jeunesse des pompiers dans mon village. Après la Realschule, j’aimerais bien faire un FSJ dans un hôpital.",
        criteria: ["Je ein Beispiel aus beiden Ländern ist richtig dargestellt.", "Gemeinsamkeiten und Unterschiede sind benannt.", "Ein persönlicher Bezug schließt den Text ab."],
      },
    },
  },
  {
    id: "fr-stars",
    lb: 7,
    unit: "5",
    covers: ["5.1", "1.2.1.3"],
    title: "Französischsprachige Stars aus Kultur, Sport und Medien",
    intro:
      "Ob Fußballer, Sängerin oder Schauspieler: Du stellst eine französischsprachige Persönlichkeit vor und sagst, warum sie dich interessiert.",
    paragraphs: [
      "Viele **Stars** aus Sport, Musik und Film sprechen Französisch, nicht nur aus Frankreich. Im **Sport** kennt man Fußballer wie **Zinédine Zidane**, Weltmeister 1998, und **Kylian Mbappé**, Weltmeister 2018, den Judoka **Teddy Riner** mit mehreren olympischen Goldmedaillen oder den Schwimmer **Léon Marchand**, der bei den Spielen in Paris 2024 vier Einzel-Goldmedaillen gewann.",
      "In der **Musik** sind der belgische Sänger **Stromae** (« Alors on danse », « Papaoutai ») und die kanadische Sängerin **Céline Dion** aus Québec weltbekannt; **Aya Nakamura** ist eine der meistgehörten französischsprachigen Sängerinnen. Im **Film** wurde **Omar Sy** mit « Intouchables » (2011) und der Serie « Lupin » international bekannt.",
      "Für ein **Porträt** brauchst du individuellen Wortschatz: un footballeur, une chanteuse, un acteur, une réalisatrice; marquer un but, remporter une médaille, sortir un album, jouer le rôle de; être né(e) à, avoir grandi en banlieue, devenir célèbre. Du baust es so auf: wer, woher, wofür bekannt, ein wichtiger Moment, was dich beeindruckt.",
      "Lies Informationen über lebende Personen in **aktuellen, verlässlichen Quellen** nach, weil sich Vereine, Rekorde und Projekte schnell ändern. Typische Fehler: « Il est un footballeur » statt « C’est un footballeur » oder « Il est footballeur », Gerüchte aus sozialen Netzwerken als Tatsache, fehlende Angleichung bei Berufen (une actrice, une chanteuse).",
    ],
    terms: [
      { term: "c’est un / il est", text: "C’est un footballeur célèbre. Il est footballeur. Nach il est steht der Beruf ohne Artikel." },
      { term: "remporter", text: "Gewinnen, erringen: remporter une médaille, remporter un match, remporter un prix." },
      { term: "devenir célèbre", text: "Berühmt werden: « Il est devenu célèbre grâce à ce film. »" },
    ],
    takeaway:
      "Ein Star-Porträt: wer, woher, wofür bekannt, ein wichtiger Moment, warum er oder sie dich beeindruckt. Wortschatz: remporter une médaille, sortir un album, jouer le rôle de, devenir célèbre. C’est un acteur / il est acteur. Fakten aktuell prüfen.",
    sourceIds: ["lp", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "C’est une chanteuse belge très connue.",
      wrong: ["Elle est une chanteuse belge très connue.", "C’est un chanteuse belge très connue."],
      explanation:
        "Mit Artikel und Adjektiv heißt es c’est une. Elle est une … ist falsch, und chanteuse ist weiblich: une.",
    },
    workshop: {
      kind: "choose",
      title: "Ein Porträt sprachlich richtig schreiben",
      instruction: "Wähle die Form, die in das Porträt passt.",
      items: [
        { before: "Zinédine Zidane ", options: ["est devenu", "a devenu", "devenait"], answer: 0, after: " champion du monde en 1998.", feedback: "Devenir bildet das passé composé mit être: il est devenu." },
        { before: "", options: ["C’est", "Il est", "Elle est"], answer: 0, after: " un acteur français connu dans le monde entier.", feedback: "Vor un + Nomen steht c’est, nicht il est." },
        { before: "Léon Marchand a ", options: ["remporté", "remportée", "remporter"], answer: 0, after: " quatre médailles d’or aux Jeux de Paris.", feedback: "Passé composé mit avoir, ohne Angleichung: il a remporté." },
        { before: "Stromae est un chanteur ", options: ["belge", "Belge", "belgique"], answer: 0, after: " qui écrit des textes profonds.", feedback: "Nationalitätsadjektive schreibt man klein: belge." },
        { before: "Céline Dion est ", options: ["née", "né", "naît"], answer: 0, after: " au Québec en 1968.", feedback: "Naître mit être, angeglichen an Céline Dion: née." },
      ],
      conclusion: "Devenir und naître mit être, c’est vor un + Nomen, kleine Nationalitätsadjektive: Damit klingt dein Porträt richtig.",
    },
    casework: {
      title: "Ein Porträt in einer Jugendzeitschrift",
      story:
        "Du liest: « Né en 1998 près de Paris, Kylian Mbappé a grandi à Bondy. À 19 ans, il a remporté la Coupe du monde avec l’équipe de France. Il est aussi connu pour son association, qui aide des enfants. »",
      steps: [
        {
          question: "Wo ist Mbappé aufgewachsen?",
          options: ["In Bondy, bei Paris.", "In einem Dorf in der Bretagne.", "In Marseille am Mittelmeer."],
          answer: 0,
          explanation: "Il a grandi à Bondy: Er ist in Bondy aufgewachsen, einem Vorort von Paris.",
        },
        {
          question: "Was hat er mit 19 Jahren gewonnen?",
          options: ["Die Fußballweltmeisterschaft.", "Eine olympische Goldmedaille.", "Einen Musikpreis für ein Album."],
          answer: 0,
          explanation: "La Coupe du monde ist die Weltmeisterschaft. 2018 war er 19 Jahre alt.",
        },
        {
          question: "Was zeigt der letzte Satz über ihn?",
          options: ["Er engagiert sich auch für Kinder.", "Er möchte später Lehrer werden.", "Er spielt heute nicht mehr Fußball."],
          answer: 0,
          explanation: "Son association, qui aide des enfants: Er hat eine Organisation für Kinder.",
        },
      ],
      verdict:
        "Herkunft, sportlicher Erfolg und Engagement: Das Porträt zeigt mehr als nur den Fußballer.",
    },
    tasks: {
      1: {
        prompt:
          "Stelle auf Französisch in vier bis fünf Sätzen einen französischsprachigen Star vor, den du magst: wer, woher, wofür bekannt, ein wichtiger Moment.",
        hints: ["Nutze c’est un/une … und il/elle est né(e) à …", "Prüfe Fakten in einer aktuellen Quelle."],
        model:
          "Stromae, c’est un chanteur belge. Il est né à Bruxelles en 1985. Il est devenu célèbre en 2009 avec la chanson « Alors on danse ». Ses textes parlent souvent de sujets sérieux, comme la famille ou la santé mentale. Moi, j’aime sa musique parce qu’on peut danser et réfléchir en même temps.",
        criteria: ["Wer, woher, wofür bekannt und ein Moment sind genannt.", "C’est und il est sind richtig verwendet.", "Die Fakten sind richtig."],
      },
      2: {
        prompt:
          "Bereite eine Kurzpräsentation (zehn bis zwölf Sätze) über eine französischsprachige Persönlichkeit aus Sport, Musik oder Film vor. Erkläre, warum sie für viele junge Menschen ein Vorbild ist oder nicht, und nenne deine Quelle.",
        hints: ["Gliedere: Einleitung, Leben, Erfolge, Vorbild?, Schluss.", "Verwende Strukturwörter und deine persönliche Wortliste."],
        model:
          "Aujourd’hui, je vais vous présenter Teddy Riner. C’est un judoka français. Il est né en 1989 en Guadeloupe et il a grandi à Paris. Il mesure plus de deux mètres et il est devenu champion du monde très jeune. Il a remporté plusieurs médailles d’or aux Jeux olympiques. Ce qui m’impressionne, c’est sa discipline: il s’entraîne tous les jours depuis des années. De plus, il parle souvent du respect, une valeur importante du judo. Pour beaucoup de jeunes, c’est un modèle, parce qu’il montre que le travail paie. Certains disent qu’un sportif ne doit pas être un modèle, mais je pense qu’il donne un bon exemple. Merci de votre attention! Source: site de la Fédération française de judo.",
        criteria: ["Die Präsentation ist gegliedert und hat richtige Fakten.", "Die Frage nach dem Vorbild ist begründet beantwortet.", "Eine Quelle ist genannt."],
      },
    },
  },
  {
    id: "fr-errungenschaften",
    lb: 7,
    unit: "5",
    covers: ["5.1", "5.2"],
    title: "Französische Errungenschaften in Kunst und Wissenschaft",
    intro:
      "Kino, Fotografie, Heißluftballon, Impressionismus, TGV: Viele Erfindungen und Ideen aus Frankreich prägen unser Leben bis heute.",
    paragraphs: [
      "Viele **Erfindungen** kamen aus Frankreich. 1783 stiegen die ersten Menschen mit einem Heißluftballon der Brüder **Montgolfier** auf. In den 1820er- und 1830er-Jahren entwickelten **Nicéphore Niépce** und **Louis Daguerre** die Fotografie. Am 28. Dezember 1895 zeigten die Brüder **Lumière** in Paris den ersten öffentlichen Kinofilm gegen Eintritt. Der Arzt **René Laennec** erfand 1816 das Stethoskop.",
      "In der **Kunst** entstand in Frankreich der **Impressionismus**: Maler wie **Claude Monet** malten im Freien und hielten das Licht und den Augenblick fest. Sein Bild « Impression, soleil levant » gab der Bewegung ihren Namen. Auch Architektur prägt das Bild Frankreichs: Der **Eiffelturm** wurde 1889 für eine Weltausstellung gebaut und war damals das höchste Bauwerk der Welt.",
      "In **Technik und Gesellschaft** stehen der Hochgeschwindigkeitszug **TGV** (seit 1981 zwischen Paris und Lyon), die europäische Rakete **Ariane**, die vom Weltraumbahnhof Kourou in Französisch-Guayana startet, und Ideen wie die **Erklärung der Menschen- und Bürgerrechte** von 1789. Viele Projekte entstehen heute europäisch, zum Beispiel Airbus oder Ariane mit deutschen und französischen Partnern.",
      "Darüber sprichst du mit Wörtern wie inventer (erfinden), une invention, découvrir (entdecken), une découverte, un chef-d’œuvre (Meisterwerk), être à l’origine de (der Ursprung sein von). Typische Fehler: inventer und découvrir verwechseln (man erfindet eine Maschine, man entdeckt ein Naturgesetz) und Jahreszahlen ungeprüft übernehmen.",
    ],
    terms: [
      { term: "inventer / découvrir", text: "Inventer heißt erfinden (eine Maschine), découvrir heißt entdecken (etwas, das es schon gibt)." },
      { term: "le cinématographe", text: "Das Gerät der Brüder Lumière, mit dem 1895 der erste öffentliche Kinofilm gezeigt wurde." },
      { term: "l’impressionnisme", text: "Eine Kunstrichtung aus Frankreich, die Licht und Augenblick festhält; benannt nach einem Bild von Monet." },
    ],
    takeaway:
      "Französische Errungenschaften: Heißluftballon (Montgolfier, 1783), Fotografie (Niépce, Daguerre), Kino (Lumière, 1895), Stethoskop (Laennec), Impressionismus (Monet), Eiffelturm (1889), TGV (1981), Ariane, Menschenrechtserklärung (1789). Inventer ≠ découvrir.",
    sourceIds: ["lp", "larousse"],
    quiz: {
      question: "Was zeigten die Brüder Lumière 1895 in Paris?",
      answer: "Den ersten öffentlichen Kinofilm.",
      wrong: ["Den ersten bemannten Heißluftballon.", "Das allererste Foto der Welt."],
      explanation:
        "Am 28. Dezember 1895 führten die Brüder Lumière ihre Filme öffentlich gegen Eintritt vor. Den Ballon bauten die Montgolfiers 1783.",
    },
    workshop: {
      kind: "timeline",
      title: "Erfindungen in ihre zeitliche Reihenfolge bringen",
      instruction: "Ordne die Errungenschaften von der frühesten zur spätesten.",
      categories: [],
      entries: [
        { text: "Les frères Montgolfier font voler le premier ballon avec des passagers.", target: 0, feedback: "1783: der erste bemannte Heißluftballon." },
        { text: "La Déclaration des droits de l’homme et du citoyen est adoptée.", target: 1, feedback: "1789, im Jahr der Französischen Revolution." },
        { text: "Le médecin René Laennec invente le stéthoscope.", target: 2, feedback: "1816 erfand Laennec das Stethoskop." },
        { text: "Les frères Lumière présentent le cinéma au public à Paris.", target: 3, feedback: "1895: die erste öffentliche Filmvorführung." },
        { text: "Le premier TGV relie Paris et Lyon à grande vitesse.", target: 4, feedback: "1981 nahm der TGV den Betrieb auf." },
      ],
      conclusion: "Ballon, Menschenrechte, Stethoskop, Kino und TGV: Über zwei Jahrhunderte hat Frankreich Technik und Gesellschaft geprägt.",
    },
    casework: {
      title: "Ein Museumsbesuch in Paris",
      story:
        "Im Musée d’Orsay liest du: « Claude Monet a peint de nombreuses séries, comme les Nymphéas. Avec ses amis, il a inventé une nouvelle manière de peindre: en plein air, avec des touches rapides, pour saisir la lumière. »",
      steps: [
        {
          question: "Was bedeutet « en plein air »?",
          options: ["Im Freien, draußen.", "Mit sehr viel Luft im Bild.", "In einem großen Atelier."],
          answer: 0,
          explanation: "En plein air heißt draußen. Die Impressionisten malten oft im Freien.",
        },
        {
          question: "Welcher Kunstrichtung gehört Monet an?",
          options: ["Dem Impressionismus.", "Der frühen Fotografie.", "Der modernen Architektur."],
          answer: 0,
          explanation: "Monet gilt als einer der wichtigsten Maler des Impressionismus.",
        },
        {
          question: "Warum steht hier « inventer » und nicht « découvrir »?",
          options: ["Die Malweise ist neu, sie haben sie geschaffen.", "Weil inventer und découvrir genau dasselbe bedeuten.", "Weil Monet etwas in der Natur gefunden hat."],
          answer: 0,
          explanation: "Eine neue Art zu malen wird erfunden, nicht entdeckt.",
        },
      ],
      verdict:
        "En plein air, Impressionismus und inventer: Mit diesem Wissen verstehst du den Museumstext und kannst darüber sprechen.",
    },
    tasks: {
      1: {
        prompt:
          "Stelle auf Französisch in drei bis vier Sätzen eine Errungenschaft aus der Lektion vor: was, wer, wann und warum sie wichtig ist.",
        hints: ["Nutze inventer oder être à l’origine de.", "Begründe die Bedeutung mit parce que."],
        model:
          "En 1895, les frères Lumière ont présenté le premier film au public à Paris. Avec leur cinématographe, ils sont à l’origine du cinéma. Cette invention est importante parce qu’aujourd’hui, des millions de personnes regardent des films dans le monde entier.",
        criteria: ["Was, wer, wann und Bedeutung sind genannt.", "Die Fakten sind richtig.", "Der Wortschatz (inventer, être à l’origine de) ist passend."],
      },
      2: {
        prompt:
          "Schreibe einen Beitrag (acht bis zehn Sätze) für eine deutsch-französische Schülerzeitung: Welche französische Errungenschaft ist für dein Leben am wichtigsten und warum? Vergleiche mit einer deutschen Erfindung.",
        hints: ["Nenne Fakten und deine persönliche Begründung.", "Für den Vergleich passt alors que oder comme."],
        model:
          "Pour moi, l’invention française la plus importante est le cinéma. En 1895, les frères Lumière ont présenté leurs films au public à Paris. Sans eux, je ne pourrais pas regarder mes séries préférées. Le cinéma permet de rêver, de rire et de découvrir d’autres pays. De plus, il réunit les gens dans une salle. En Allemagne, Karl Benz a construit l’une des premières voitures en 1886. Comme le cinéma, la voiture a changé la vie des gens. Mais alors que la voiture pose aujourd’hui des problèmes pour le climat, le cinéma reste une invention plutôt écologique. C’est pourquoi je choisis le cinéma!",
        criteria: ["Eine Errungenschaft ist richtig dargestellt.", "Die persönliche Bedeutung ist begründet.", "Ein Vergleich mit einer deutschen Erfindung ist enthalten."],
      },
    },
  },
  {
    id: "fr-berufswelt",
    lb: 7,
    unit: "5",
    covers: ["5.1"],
    title: "Berufs- und Arbeitswelt in Frankreich",
    intro:
      "Ausbildung, Arbeitszeit, Praktikum: Wie man in Frankreich einen Beruf lernt und arbeitet, und wie du dich dort um ein Praktikum bewirbst.",
    paragraphs: [
      "In Frankreich lernen viele Jugendliche einen Beruf am **lycée professionnel**: Sie machen dort ein **CAP** (certificat d’aptitude professionnelle, nach etwa zwei Jahren) oder ein **bac professionnel** (nach drei Jahren), mit Praktika in Betrieben. Daneben gibt es die **apprentissage**: Lehrlinge arbeiten in einem Betrieb und lernen in einem **CFA** (centre de formation d’apprentis). Das ähnelt der dualen Ausbildung in Deutschland; lange war die apprentissage in Frankreich weniger verbreitet, heute wächst sie stark.",
      "Die gesetzliche **Arbeitszeit** liegt in Frankreich bei 35 Stunden pro Woche; wer mehr arbeitet, macht Überstunden oder bekommt freie Tage. Die **Mittagspause** ist oft länger als in Deutschland, und man isst gern gemeinsam. Im Arbeitsalltag siezt man Vorgesetzte und Kunden meist; unter Kollegen ist das Duzen in vielen Betrieben üblich, das hängt von der Firma ab.",
      "Ein **Praktikum** in Frankreich findest du über Schulpartnerschaften, das **DFJW/OFAJ** (es fördert Praktika und Austausche für junge Leute) oder eigene Bewerbungen. Du brauchst einen CV, eine lettre de motivation und für Minderjährige eine Vereinbarung zwischen Schule und Betrieb (une convention de stage). Im Gespräch fragst du nach Aufgaben, Arbeitszeiten und dem Ansprechpartner (le tuteur, la tutrice).",
      "Wörter für den Arbeitsalltag: un employeur, un(e) salarié(e), un(e) collègue, le chef / la cheffe, le salaire, les horaires, les congés (Urlaub), une entreprise, un atelier, un bureau. Typische Fehler: « le chef » für eine Frau (la cheffe ist üblich), « faire un apprentissage chez un lycée » (im lycée gibt es keine Lehre im Betrieb) und « les vacances » für Urlaubstage im Job (dafür sagt man les congés).",
    ],
    terms: [
      { term: "lycée professionnel", text: "Eine berufsbildende Schule mit Abschlüssen wie CAP oder bac professionnel und Praktika im Betrieb." },
      { term: "apprentissage / CFA", text: "Die Lehre im Betrieb; den theoretischen Teil lernt der Lehrling im centre de formation d’apprentis." },
      { term: "convention de stage", text: "Die schriftliche Vereinbarung zwischen Schule, Betrieb und Praktikant für ein Praktikum." },
      { term: "les congés", text: "Die Urlaubstage im Beruf. Les vacances sind eher Ferien." },
    ],
    takeaway:
      "Berufsausbildung in Frankreich: lycée professionnel (CAP, bac pro) oder apprentissage mit CFA. 35-Stunden-Woche, oft lange Mittagspause. Praktikum über Partnerschulen oder OFAJ, mit CV, lettre de motivation und convention de stage. Les congés = Urlaub.",
    sourceIds: ["lp", "onisep", "dfjw"],
    quiz: {
      question: "Wo lernen französische Lehrlinge den theoretischen Teil ihrer Ausbildung?",
      answer: "Im centre de formation d’apprentis (CFA).",
      wrong: ["Im lycée général mit dem normalen bac.", "Nur im Betrieb, ganz ohne Unterricht."],
      explanation:
        "Lehrlinge arbeiten im Betrieb und lernen im CFA, ähnlich wie in Deutschland in der Berufsschule.",
    },
    workshop: {
      kind: "choose",
      title: "Wortschatz der Arbeitswelt",
      instruction: "Wähle das passende Wort für den Satz.",
      items: [
        { before: "Pour mon stage, l’école, l’entreprise et moi devons signer une ", options: ["convention de stage", "lettre de motivation", "offre d’emploi"], answer: 0, after: ".", feedback: "Die Vereinbarung zwischen Schule, Betrieb und Praktikant heißt convention de stage." },
        { before: "En août, ma mère prend trois semaines de ", options: ["congés", "vacances scolaires", "chômage"], answer: 0, after: " pour partir en Bretagne.", feedback: "Urlaubstage im Beruf heißen les congés." },
        { before: "Pendant le stage, ma ", options: ["tutrice", "cliente", "voisine"], answer: 0, after: " m’explique mes tâches et répond à mes questions.", feedback: "Die Betreuerin im Praktikum heißt la tutrice." },
        { before: "Mon frère prépare un bac ", options: ["professionnel", "professionnelle", "profession"], answer: 0, after: " de cuisine.", feedback: "Bac ist männlich: un bac professionnel." },
        { before: "En France, la durée légale du travail est de 35 heures par ", options: ["semaine", "jour", "mois"], answer: 0, after: ".", feedback: "Die gesetzliche Arbeitszeit beträgt 35 Stunden pro Woche." },
      ],
      conclusion: "Convention de stage, congés, tuteur oder tutrice, bac professionnel und 35 heures par semaine: Wortschatz und Wissen für ein Praktikum in Frankreich.",
    },
    casework: {
      title: "Ein Praktikum in Lyon vorbereiten",
      story:
        "Du hast über das OFAJ ein dreiwöchiges Praktikum in einer Autowerkstatt in Lyon bekommen. Der Chef schreibt: « Bienvenue! Les horaires sont de 8 h à 12 h et de 14 h à 17 h. Votre tuteur s’appelle Karim. Merci d’apporter la convention signée. »",
      steps: [
        {
          question: "Was fällt an den Arbeitszeiten auf?",
          options: ["Die Mittagspause dauert zwei Stunden.", "Man arbeitet den ganzen Tag ohne Pause.", "Man arbeitet dort nur am Vormittag."],
          answer: 0,
          explanation: "Von 12 bis 14 Uhr ist Pause: eine typisch lange französische Mittagspause.",
        },
        {
          question: "Wer ist Karim?",
          options: ["Dein Betreuer im Praktikum.", "Der Kunde, dessen Auto du reparierst.", "Ein anderer Praktikant aus Deutschland."],
          answer: 0,
          explanation: "Le tuteur ist die Person, die dich im Praktikum betreut.",
        },
        {
          question: "Was musst du mitbringen?",
          options: ["Die unterschriebene Vereinbarung.", "Eine neue lettre de motivation.", "Dein Zeugnis der letzten fünf Jahre."],
          answer: 0,
          explanation: "La convention signée ist die unterschriebene Vereinbarung zwischen Schule, Betrieb und dir.",
        },
      ],
      verdict:
        "Lange Mittagspause, ein tuteur als Ansprechpartner und die convention de stage: Mit diesem Wissen startest du gut vorbereitet.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre auf Deutsch in vier Sätzen einem Mitschüler die zwei Wege zu einem Beruf in Frankreich (lycée professionnel und apprentissage) und einen Unterschied zu Deutschland.",
        hints: ["Nenne CAP, bac professionnel und CFA.", "Vergleiche mit der dualen Ausbildung."],
        model:
          "In Frankreich kann man einen Beruf am lycée professionnel lernen und dort ein CAP oder ein bac professionnel machen, mit Praktika in Betrieben. Der zweite Weg ist die apprentissage: Man arbeitet in einem Betrieb und lernt die Theorie in einem CFA. Das ähnelt unserer dualen Ausbildung mit Betrieb und Berufsschule. Ein Unterschied ist, dass in Frankreich der schulische Weg am lycée professionnel lange viel häufiger war als die Lehre im Betrieb.",
        criteria: ["Beide Wege sind richtig erklärt.", "CAP, bac professionnel und CFA sind genannt.", "Ein Unterschied zu Deutschland ist benannt."],
      },
      2: {
        prompt:
          "Du hast ein Praktikum in Frankreich gemacht (echt oder erfunden). Schreibe einen Bericht (zehn bis zwölf Sätze) für die Website des OFAJ: Betrieb, Aufgaben, Arbeitszeiten, Unterschiede zu Deutschland, was du gelernt hast und ob du es weiterempfiehlst.",
        hints: ["Nutze passé composé und imparfait.", "Nenne mindestens zwei Unterschiede in der Arbeitswelt."],
        model:
          "L’été dernier, j’ai fait un stage de trois semaines dans une agence de voyages à Bordeaux. Ma tutrice s’appelait Sophie; elle était très patiente. Le matin, je répondais aux e-mails des clients, et l’après-midi, je préparais des brochures. Je travaillais de 9 h à 12 h 30 et de 14 h à 17 h 30. La pause de midi était longue, et nous mangions souvent ensemble dans un petit restaurant. Ce qui m’a étonné, c’est que tous les collègues se tutoyaient, même avec la cheffe. En Allemagne, dans mon stage précédent, tout le monde se vouvoyait. J’ai beaucoup amélioré mon français, surtout au téléphone. J’ai aussi appris à être plus autonome. Je recommande cette expérience à tous ceux qui hésitent: on apprend plus en trois semaines qu’en un an de cours!",
        criteria: ["Betrieb, Aufgaben und Arbeitszeiten sind beschrieben.", "Zwei Unterschiede zu Deutschland sind genannt.", "Der Bericht nutzt die Vergangenheitszeiten richtig."],
      },
    },
  },
  {
    id: "fr-frankophonie",
    lb: 7,
    unit: "5",
    covers: ["5.1", "5.2"],
    title: "Die Frankophonie: Französisch in Afrika und in Übersee",
    intro:
      "Rund 320 Millionen Menschen sprechen Französisch, die meisten nicht in Europa. Die Frankophonie verbindet Länder auf allen Kontinenten.",
    paragraphs: [
      "**La Francophonie** bezeichnet zweierlei: alle Menschen und Länder, die Französisch sprechen, und die **Organisation internationale de la Francophonie (OIF)**, in der sich viele Staaten und Regierungen zusammengeschlossen haben. Nach Angaben der OIF sprechen weltweit rund **320 Millionen Menschen** Französisch. Die Mehrheit derer, die Französisch täglich verwenden, lebt in **Afrika**. Am **20. März** wird der Internationale Tag der Frankophonie gefeiert.",
      "In vielen afrikanischen Ländern ist Französisch Amtssprache oder Bildungssprache, oft neben afrikanischen Sprachen wie Wolof im Senegal oder Lingala im Kongo. **Kinshasa** in der Demokratischen Republik Kongo gehört zu den größten französischsprachigen Städten der Welt. Ein wichtiger Name ist **Léopold Sédar Senghor**, Dichter und erster Präsident des Senegal, der die Idee einer Gemeinschaft französischsprachiger Länder mitprägte.",
      "Zu Frankreich gehören die **départements et régions d’outre-mer**: **Guadeloupe** und **Martinique** in der Karibik, **Guyane** in Südamerika (mit dem Weltraumbahnhof Kourou), **La Réunion** und **Mayotte** im Indischen Ozean. Dort leben französische Staatsbürger, man zahlt mit dem Euro und wählt das französische Parlament mit. Daneben gibt es weitere Gebiete wie Neukaledonien im Pazifik mit eigenem Status.",
      "Die Frankophonie zeigt, dass Französisch eine **Weltsprache** ist, die überall etwas anders klingt: In Québec sagt man « faire du magasinage » für einkaufen, in Belgien und der Schweiz « septante » für 70. Diese Vielfalt bereichert die Sprache. Typische Fehler: Französisch nur mit Frankreich gleichsetzen, afrikanische Länder als ein Land behandeln oder Überseegebiete für unabhängige Staaten halten.",
    ],
    terms: [
      { term: "la Francophonie", text: "Die Gemeinschaft der französischsprachigen Menschen und Länder; mit großem F auch die Organisation OIF." },
      { term: "OIF", text: "Organisation internationale de la Francophonie: Zusammenschluss von Staaten und Regierungen mit französischer Sprache." },
      { term: "DROM", text: "Départements et régions d’outre-mer: Guadeloupe, Martinique, Guyane, La Réunion, Mayotte." },
      { term: "20 mars", text: "Der Internationale Tag der Frankophonie (Journée internationale de la Francophonie)." },
    ],
    takeaway:
      "Rund 320 Millionen Menschen sprechen Französisch, die Mehrheit der täglichen Sprecher lebt in Afrika. OIF, Tag der Frankophonie am 20. März, Senghor. Überseegebiete (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte) gehören zu Frankreich. Französisch klingt regional verschieden.",
    sourceIds: ["lp", "oif", "larousse"],
    quiz: {
      question: "Auf welchem Kontinent lebt die Mehrheit der Menschen, die täglich Französisch sprechen?",
      answer: "In Afrika.",
      wrong: ["In Europa.", "In Nordamerika."],
      explanation:
        "Nach Angaben der OIF lebt die Mehrheit derer, die Französisch täglich verwenden, in Afrika.",
    },
    workshop: {
      kind: "classify",
      title: "Frankophone Orte einordnen",
      instruction: "Ordne jeden Ort seiner Region in der Frankophonie zu.",
      categories: ["Afrika", "Amerika", "Indischer Ozean"],
      entries: [
        { text: "Dakar, capitale du Sénégal, où on parle français et wolof", target: 0, feedback: "Dakar liegt in Westafrika." },
        { text: "Kourou, en Guyane, d’où partent les fusées Ariane", target: 1, feedback: "Französisch-Guayana liegt in Südamerika." },
        { text: "Saint-Denis, chef-lieu de l’île de La Réunion", target: 2, feedback: "La Réunion liegt im Indischen Ozean." },
        { text: "Kinshasa, l’une des plus grandes villes francophones du monde", target: 0, feedback: "Kinshasa ist die Hauptstadt der Demokratischen Republik Kongo." },
        { text: "Montréal, la grande ville francophone du Québec", target: 1, feedback: "Montréal liegt in Kanada, in Nordamerika." },
        { text: "Mamoudzou, sur l’île de Mayotte, entre Madagascar et l’Afrique", target: 2, feedback: "Mayotte liegt im Indischen Ozean." },
      ],
      conclusion: "Von Dakar über Kourou bis La Réunion: Die Frankophonie reicht über Afrika, Amerika und den Indischen Ozean.",
    },
    casework: {
      title: "Ein Videotelefonat mit Martinique",
      story:
        "Über ein Schulprojekt telefonierst du mit Léna aus Fort-de-France auf der Martinique. Sie sagt: « Ici, on parle français et créole. On est en France, mais il fait 30 degrés toute l’année! »",
      steps: [
        {
          question: "Warum sagt Léna « On est en France »?",
          options: ["Die Martinique gehört zu Frankreich.", "Sie macht gerade Urlaub in Paris.", "Die Martinique liegt bei Marseille."],
          answer: 0,
          explanation: "Die Martinique ist ein französisches Überseegebiet in der Karibik.",
        },
        {
          question: "Welche Sprachen spricht man dort laut Léna?",
          options: ["Französisch und Kreolisch.", "Nur Englisch und Spanisch.", "Nur Französisch, sonst gar nichts."],
          answer: 0,
          explanation: "Neben Französisch spricht man auf der Martinique Kreolisch (le créole).",
        },
        {
          question: "Was erklärt die Temperatur von 30 Grad?",
          options: ["Die Insel liegt in den Tropen der Karibik.", "In ganz Frankreich ist es das ganze Jahr so warm.", "Léna wohnt direkt neben einer Fabrik."],
          answer: 0,
          explanation: "Die Martinique liegt in der Karibik in den Tropen, deshalb ist es das ganze Jahr warm.",
        },
      ],
      verdict:
        "Französisch, Kreolisch und Tropen: Lénas Satz zeigt, wie vielfältig Frankreich und die Frankophonie sind.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre auf Französisch in vier Sätzen, was die Frankophonie ist: wie viele Menschen Französisch sprechen, wo die meisten leben, welche Organisation es gibt und wann der Tag der Frankophonie ist.",
        hints: ["Nutze environ für die Zahl.", "Nenne die OIF und den 20 mars."],
        model:
          "La Francophonie, c’est l’ensemble des personnes et des pays qui parlent français. Selon l’OIF, environ 320 millions de personnes parlent français dans le monde. La majorité des personnes qui l’utilisent tous les jours vit en Afrique. La Journée internationale de la Francophonie a lieu le 20 mars.",
        criteria: ["Zahl, Kontinent, Organisation und Datum sind richtig.", "Die Zahl ist als ungefähr gekennzeichnet.", "Die Sätze sind sprachlich richtig."],
      },
      2: {
        prompt:
          "Stell dir vor, du bereitest eine Ausstellung zum 20. März an deiner Schule vor. Schreibe den französischen Text für ein Plakat (acht bis zehn Sätze) über ein frankophones Land oder Gebiet außerhalb Europas: Lage, Status, Sprachen, eine Besonderheit, eine Person oder Tradition. Nenne deine Quelle.",
        hints: ["Prüfe alle Angaben in einer verlässlichen Quelle.", "Wähle eine Besonderheit, die Mitschüler überrascht."],
        model:
          "Le Sénégal se trouve en Afrique de l’Ouest, au bord de l’océan Atlantique. C’est un pays indépendant depuis 1960. Sa capitale est Dakar. La langue officielle est le français, mais la plupart des gens parlent aussi le wolof. Le premier président du pays, Léopold Sédar Senghor, était aussi un grand poète. Il a écrit en français et il est entré à l’Académie française. Au Sénégal, la « teranga », c’est l’hospitalité: on accueille toujours bien les invités. Le plat national s’appelle le thiéboudienne, du riz au poisson. Venez découvrir ce pays fascinant! Source: Larousse, encyclopédie en ligne; site de l’OIF.",
        criteria: ["Lage, Status und Sprachen sind richtig.", "Eine Besonderheit und eine Person oder Tradition sind vorgestellt.", "Eine Quelle ist genannt."],
      },
    },
  },
  {
    id: "fr-aktuelle-themen",
    lb: 7,
    unit: "5",
    covers: ["5.1", "5.2"],
    title: "Aktuelle Themen: Nachrichten verstehen und diskutieren",
    intro:
      "Was gerade in Frankreich und der Frankophonie diskutiert wird, verstehst du mit Nachrichten für junge Leser und einer festen Methode.",
    paragraphs: [
      "Der Lehrplan nennt **aktuelle Themen** ohne festen Inhalt, weil sie sich ständig ändern. Du übst deshalb eine **Methode**: Nachricht finden, verstehen, einordnen und darüber sprechen. Gute Quellen für junge Leser sind Nachrichtenseiten und Sendungen für Jugendliche, die Seiten von Radio France oder TV5Monde mit Lernangeboten und Jugendzeitschriften.",
      "**Verstehen**: Lies Überschrift und ersten Absatz (le chapeau): Dort stehen die wichtigsten W-Fragen (qui, quoi, où, quand, pourquoi). Unterstreiche Schlüsselwörter, erschließe unbekannte Wörter und fasse die Meldung in zwei Sätzen zusammen. **Einordnen**: Wo spielt das? Wer ist beteiligt? Ist es eine Tatsache oder eine Meinung? Welche Seiten gibt es?",
      "**Darüber sprechen**: Stelle die Nachricht kurz vor (« J’ai lu un article sur … », « Il s’agit de … »), nenne verschiedene Meinungen (« Certains pensent que …, d’autres … ») und deine eigene, begründet. Höre anderen zu und respektiere andere Sichtweisen. Vergleiche, wenn möglich, mit der Lage in Deutschland: « Chez nous, c’est différent, parce que … »",
      "Typische Fehler: nur die Überschrift lesen und daraus eine Meinung bilden, eine einzige Quelle für die ganze Wahrheit halten, Meinungen und Tatsachen vermischen oder Wörter aus dem Artikel unverstanden übernehmen. Die App übt die Methode an einem erfundenen Beispiel; echte aktuelle Themen bringen du und deine Lehrkraft in den Unterricht.",
    ],
    terms: [
      { term: "le chapeau", text: "Der kurze Einleitungsabsatz unter der Überschrift eines Artikels, der die wichtigsten Informationen enthält." },
      { term: "il s’agit de", text: "Es geht um: « Dans cet article, il s’agit de la réforme du bac. »" },
      { term: "certains … d’autres", text: "Manche … andere: damit stellst du verschiedene Meinungen dar." },
    ],
    takeaway:
      "Aktuelle Themen mit Methode: verstehen (Überschrift, chapeau, W-Fragen, Zusammenfassung), einordnen (Ort, Beteiligte, Tatsache oder Meinung), darüber sprechen (il s’agit de, certains … d’autres, eigene begründete Meinung, Vergleich mit Deutschland).",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Wo findest du in einem Zeitungsartikel die wichtigsten Informationen auf einen Blick?",
      answer: "Im chapeau unter der Überschrift.",
      wrong: ["Im letzten Satz des Artikels.", "In der Bildunterschrift unten."],
      explanation:
        "Der chapeau ist der Einleitungsabsatz und beantwortet die wichtigsten W-Fragen.",
    },
    workshop: {
      kind: "mark",
      title: "Die W-Fragen in einer Meldung finden",
      instruction:
        "Lies die erfundene Meldung. Wähle oben ein Etikett und markiere, wer handelt, was passiert und warum. Nicht jede Information beantwortet eine dieser Fragen.",
      labels: ["Wer?", "Was?", "Warum?"],
      text: [
        { t: "Lundi, à Nantes, " },
        { t: "plusieurs centaines de lycéens", label: 0, feedback: "Das sind die Handelnden: mehrere hundert Gymnasiasten." },
        { t: " " },
        { t: "ont manifesté devant la mairie", label: 1, feedback: "Das ist das Ereignis: Sie haben vor dem Rathaus demonstriert." },
        { t: ". Ils protestaient " },
        { t: "contre la fermeture de deux lignes de bus", label: 2, feedback: "Das ist der Grund: die Schließung zweier Buslinien." },
        { t: " qui desservent leurs établissements. Il faisait froid, mais l’ambiance était calme. Selon " },
        { t: "le maire", label: 0, feedback: "Eine zweite handelnde Person: der Bürgermeister, der reagiert." },
        { t: ", " },
        { t: "une réunion aura lieu la semaine prochaine", label: 1, feedback: "Ein weiteres Ereignis: Nächste Woche gibt es ein Treffen." },
        { t: " pour trouver une solution." },
      ],
      conclusion: "Wer, was und warum: Mit diesen Fragen verstehst du eine Meldung schnell. Wetter und Stimmung sind Nebeninformationen.",
    },
    casework: {
      title: "Ein Thema in der Klasse vorstellen",
      story:
        "Du sollst die erfundene Meldung über die Buslinien in Nantes in der Klasse kurz vorstellen und eine Diskussion anregen.",
      steps: [
        {
          question: "Wie beginnst du die Vorstellung?",
          options: ["J’ai lu un article sur une manifestation à Nantes.", "Les lycéens ont raison, c’est vraiment scandaleux!", "Il faisait très froid lundi matin à Nantes."],
          answer: 0,
          explanation: "Du stellst zuerst die Nachricht sachlich vor. Meinung und Nebeninformationen kommen später oder gar nicht.",
        },
        {
          question: "Wie stellst du verschiedene Meinungen dar?",
          options: ["Certains pensent que les bus coûtent cher, d’autres …", "Tout le monde pense exactement la même chose sur ce sujet.", "Il n’y a qu’une seule bonne opinion possible ici."],
          answer: 0,
          explanation: "Certains … d’autres zeigt, dass es verschiedene Sichtweisen gibt.",
        },
        {
          question: "Welche Frage regt eine gute Diskussion an?",
          options: ["Et chez nous, comment allez-vous au collège?", "Qui a écrit cet article, à votre avis?", "Combien de lycéens étaient là exactement?"],
          answer: 0,
          explanation: "Der Bezug zur eigenen Lage bringt alle ins Gespräch.",
        },
      ],
      verdict:
        "Sachlich vorstellen, verschiedene Meinungen zeigen und den Bezug zur eigenen Lage herstellen: So wird aus einer Meldung eine Diskussion.",
    },
    tasks: {
      1: {
        prompt:
          "Fasse die erfundene Meldung über die Buslinien in Nantes in zwei bis drei französischen Sätzen zusammen und nenne eine Tatsache und eine mögliche Meinung dazu.",
        hints: ["Beantworte qui, quoi, où, quand, pourquoi.", "Kennzeichne die Meinung mit certains pensent que."],
        model:
          "Lundi, à Nantes, des centaines de lycéens ont manifesté devant la mairie contre la fermeture de deux lignes de bus. Le maire a annoncé une réunion pour la semaine prochaine. Tatsache: Zwei Buslinien sollen geschlossen werden. Meinung: Certains pensent que la ville doit d’abord penser aux élèves qui n’ont pas d’autre moyen de transport.",
        criteria: ["Die Zusammenfassung beantwortet die W-Fragen.", "Tatsache und Meinung sind getrennt.", "Die Sätze sind sprachlich richtig."],
      },
      2: {
        prompt:
          "Wähle eine echte aktuelle Nachricht aus einem französischsprachigen Medium für junge Leser. Schreibe eine kurze Vorstellung (acht bis zehn Sätze) für die Klasse: Quelle und Datum, Zusammenfassung, verschiedene Meinungen, deine Meinung, eine Frage an die Klasse.",
        hints: ["Notiere Quelle und Datum gleich am Anfang.", "Trenne Tatsachen und Meinungen sprachlich."],
        model:
          "Beispiel mit erfundenem Inhalt: J’ai lu un article sur le site d’un journal pour les jeunes, publié le 20 octobre. Il s’agit d’un collège à Lille qui a installé des casiers pour les portables. Les élèves déposent leur téléphone le matin et le récupèrent le soir. Selon la directrice, les élèves se parlent plus pendant la récréation. Certains parents trouvent l’idée excellente, d’autres ont peur de ne pas pouvoir joindre leurs enfants. Les élèves sont aussi divisés. Moi, je pense que c’est une bonne idée, parce qu’on se concentre mieux. Mais il faudrait un téléphone pour les urgences. Et vous, est-ce que vous aimeriez avoir ces casiers dans notre école?",
        criteria: ["Quelle und Datum sind genannt.", "Zusammenfassung und verschiedene Meinungen sind klar getrennt.", "Die eigene Meinung ist begründet und eine Frage regt die Diskussion an."],
      },
    },
  },
];
