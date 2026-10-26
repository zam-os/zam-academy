import type { Lesson } from "../model/types";

/**
 * Stufe 4: Interkulturelle Kompetenzen (Kompetenzerwartungen 2.1 bis 2.4): Wissen über französischsprachige
 * Länder für das Zeitgeschehen nutzen, die deutsch-französischen Beziehungen für ein friedliches Europa,
 * herausragende französische Persönlichkeiten und Respekt vor anderen Meinungen. Die Lektion zur
 * deutsch-französischen Freundschaft deckt zugleich das gleichnamige Themengebiet aus Lernbereich 5 ab.
 * Sachaussagen beschränken sich auf gesicherte Daten; aktuelle Ereignisse übt die App an erfundenen
 * Beispielen, weil sie veralten.
 */
export const S4: Lesson[] = [
  {
    id: "fr-zeitgeschehen",
    lb: 4,
    unit: "2",
    covers: ["2.1"],
    title: "Zeitgeschehen in französischsprachigen Ländern einordnen",
    intro:
      "Eine Nachricht aus Québec, Dakar oder La Réunion verstehst du besser, wenn du weißt, wo das liegt und wie das Land aufgebaut ist.",
    paragraphs: [
      "Französisch wird nicht nur in Frankreich gesprochen. Wenn du eine Nachricht aus einem **französischsprachigen Land** liest, hilft dir Hintergrundwissen beim Einordnen: In **Belgien** gibt es drei Amtssprachen (Niederländisch, Französisch, Deutsch), in der **Schweiz** vier Landessprachen (Deutsch, Französisch, Italienisch, Rätoromanisch). In **Kanada** ist die Provinz **Québec** mehrheitlich französischsprachig, Montréal ist ihre größte Stadt.",
      "In **Afrika** ist Französisch in vielen Ländern Amtssprache oder wichtige Verkehrssprache, zum Beispiel im **Senegal** (Hauptstadt Dakar), in der **Côte d’Ivoire** und in der **Demokratischen Republik Kongo**. Viele dieser Länder waren französische oder belgische Kolonien und wurden um 1960 unabhängig. Daneben gehören **Überseegebiete** zu Frankreich, etwa **La Réunion** im Indischen Ozean oder **Guadeloupe** und **Martinique** in der Karibik: Dort gelten französische Gesetze und der Euro.",
      "So ordnest du eine Nachricht ein: 1. **Wo** spielt sie? Suche den Ort auf der Karte. 2. **Welcher Status**: unabhängiger Staat, Provinz, Überseegebiet? 3. **Welcher Hintergrund** ist wichtig (Klima, Geschichte, Sprachen)? 4. **Was bedeutet das** für die Menschen dort und vielleicht für Frankreich oder Europa? Ein Wirbelsturm auf La Réunion betrifft zum Beispiel französische Staatsbürger, und Hilfe kommt aus Paris.",
      "Typische Fehler: Québec für ein eigenes Land halten, alle afrikanischen französischsprachigen Länder gleichsetzen oder Nachrichten nur aus deutscher Sicht bewerten. Aktuelle Ereignisse veralten schnell: Die App übt die Methode an erfundenen Meldungen; für echte Nachrichten nutzt du französischsprachige Medien wie die Nachrichtenseiten von Radio France oder TV5Monde.",
    ],
    terms: [
      { term: "francophone", text: "Französischsprachig. Les pays francophones sind Länder, in denen Französisch Amts- oder Verkehrssprache ist." },
      { term: "Québec", text: "Mehrheitlich französischsprachige Provinz Kanadas, größte Stadt Montréal, Hauptstadt Québec." },
      { term: "Überseegebiete", text: "Gebiete außerhalb Europas, die zu Frankreich gehören, zum Beispiel La Réunion, Guadeloupe, Martinique." },
    ],
    takeaway:
      "Eine Nachricht aus einem francophonen Land einordnen: Wo liegt es? Welcher Status (Staat, Provinz, Überseegebiet)? Welcher Hintergrund (Sprachen, Geschichte, Klima)? Was bedeutet es für die Menschen? Québec ist eine Provinz Kanadas, La Réunion gehört zu Frankreich.",
    sourceIds: ["lp", "oif"],
    quiz: {
      question: "Welchen Status hat La Réunion?",
      answer: "Ein Überseegebiet, das zu Frankreich gehört.",
      wrong: ["Ein unabhängiger Staat im Indischen Ozean.", "Eine Provinz Kanadas mit eigener Regierung."],
      explanation:
        "La Réunion ist ein französisches Überseedepartement im Indischen Ozean: Dort gelten französische Gesetze und der Euro.",
    },
    workshop: {
      kind: "classify",
      title: "Orte richtig einordnen",
      instruction: "Ordne jeden Ort seinem Status zu: unabhängiger Staat, Teil Kanadas oder Teil Frankreichs.",
      categories: ["unabhängiger Staat", "Teil Kanadas", "Teil Frankreichs"],
      entries: [
        { text: "Le Sénégal, en Afrique de l’Ouest, avec sa capitale Dakar", target: 0, feedback: "Der Senegal ist seit 1960 ein unabhängiger Staat." },
        { text: "Montréal, la plus grande ville francophone d’Amérique du Nord", target: 1, feedback: "Montréal liegt in der Provinz Québec, also in Kanada." },
        { text: "La Martinique, une île des Caraïbes où on paie en euros", target: 2, feedback: "Die Martinique ist ein Überseegebiet Frankreichs." },
        { text: "La Belgique, un pays européen avec trois langues officielles", target: 0, feedback: "Belgien ist ein unabhängiger Staat in Europa." },
        { text: "La province de Québec, où le français est la langue officielle", target: 1, feedback: "Québec ist eine Provinz Kanadas." },
        { text: "La Réunion, une île de l’océan Indien près de Madagascar", target: 2, feedback: "La Réunion gehört als Überseegebiet zu Frankreich." },
      ],
      conclusion: "Staat, Provinz oder Überseegebiet: Der Status entscheidet, wer zuständig ist und wie eine Nachricht zu verstehen ist.",
    },
    casework: {
      title: "Eine erfundene Meldung einordnen",
      story:
        "Du liest (erfundenes Beispiel): « Cyclone à La Réunion: les écoles sont fermées et l’armée française envoie de l’aide. Le ministre des Outre-mer arrive demain. »",
      steps: [
        {
          question: "Warum schickt die französische Armee Hilfe?",
          options: ["La Réunion gehört zu Frankreich.", "Frankreich hilft jedem Land der Welt zuerst.", "Die Insel liegt direkt bei Paris."],
          answer: 0,
          explanation: "La Réunion ist ein französisches Überseegebiet; der französische Staat ist zuständig.",
        },
        {
          question: "Was bedeutet « Outre-mer »?",
          options: ["Die Überseegebiete Frankreichs.", "Das Meer zwischen Frankreich und England.", "Ein anderes Wort für Ausland."],
          answer: 0,
          explanation: "Les Outre-mer sind die französischen Gebiete außerhalb Europas; es gibt dafür ein eigenes Ministerium.",
        },
        {
          question: "Welches Hintergrundwissen hilft, den Wirbelsturm einzuordnen?",
          options: ["Die Insel liegt in den Tropen.", "Auf der Insel spricht man Englisch.", "Die Insel ist ein Teil Kanadas."],
          answer: 0,
          explanation: "La Réunion liegt in den Tropen des Indischen Ozeans, wo es Wirbelstürme gibt.",
        },
      ],
      verdict:
        "Status (Überseegebiet), Zuständigkeit (französischer Staat) und Lage (Tropen): Mit diesem Wissen versteht man die Meldung vollständig.",
    },
    tasks: {
      1: {
        prompt:
          "Ordne auf Deutsch in drei bis vier Sätzen ein (erfundene Meldung): « Au Québec, une nouvelle loi oblige les entreprises à utiliser le français avec leurs clients. »",
        hints: ["Wo liegt Québec und welchen Status hat es?", "Warum könnte eine solche Regel dort wichtig sein?"],
        model:
          "Québec ist eine Provinz in Kanada, in der die Mehrheit Französisch spricht, während im Rest Kanadas vor allem Englisch gesprochen wird. Die Provinz kann eigene Gesetze machen. Eine Regel, dass Firmen mit Kunden Französisch sprechen müssen, soll die französische Sprache neben dem Englischen schützen. Für Unternehmen aus anderen Ländern bedeutet das, dass sie in Québec Französisch brauchen.",
        criteria: ["Lage und Status von Québec sind richtig genannt.", "Der Hintergrund (Sprachsituation) ist erklärt.", "Die Bedeutung der Meldung ist eingeordnet."],
      },
      2: {
        prompt:
          "Suche dir ein französischsprachiges Land oder Gebiet aus (zum Beispiel Belgien, Senegal, Martinique). Schreibe auf Französisch einen kurzen Steckbrief (sechs bis acht Sätze) mit Lage, Status, Sprachen und einer Besonderheit, die beim Verstehen von Nachrichten hilft.",
        hints: ["Nutze Wendungen wie se trouve en, est un pays / un territoire, on y parle.", "Prüfe Fakten in einer verlässlichen Quelle."],
        model:
          "Le Sénégal se trouve en Afrique de l’Ouest, au bord de l’océan Atlantique. C’est un pays indépendant depuis 1960. Sa capitale est Dakar. La langue officielle est le français, mais beaucoup de Sénégalais parlent aussi le wolof. Le pays a été une colonie française, c’est pourquoi il a encore des liens forts avec la France. Pour comprendre les nouvelles du Sénégal, il faut savoir que la population est très jeune et que beaucoup de jeunes partent travailler à l’étranger.",
        criteria: ["Lage, Status und Sprachen sind richtig.", "Eine hilfreiche Besonderheit ist erklärt.", "Der Steckbrief ist sprachlich richtig."],
      },
    },
  },
  {
    id: "fr-deutsch-franzoesisch",
    lb: 4,
    unit: "2",
    covers: ["2.2", "5.1"],
    title: "Die deutsch-französische Freundschaft und Europa",
    intro:
      "Aus Erbfeinden wurden Partner: Élysée-Vertrag, Jugendwerk, Städtepartnerschaften und die EU zeigen, warum das für ein friedliches Europa zählt.",
    paragraphs: [
      "Deutschland und Frankreich haben zwischen 1870 und 1945 dreimal Krieg gegeneinander geführt. Nach dem Zweiten Weltkrieg wollten Politiker beider Länder einen neuen Weg. Am 9. Mai 1950 schlug der französische Außenminister **Robert Schuman** vor, die Kohle- und Stahlproduktion gemeinsam zu verwalten. Daraus entstand 1951 die Europäische Gemeinschaft für Kohle und Stahl, ein Anfang der heutigen **Europäischen Union**. Der 9. Mai ist deshalb der Europatag.",
      "Am **22. Januar 1963** unterzeichneten der französische Präsident **Charles de Gaulle** und der deutsche Bundeskanzler **Konrad Adenauer** in Paris den **Élysée-Vertrag** (le traité de l’Élysée). Beide Regierungen versprachen, sich regelmäßig zu treffen und vor allem die Jugend zusammenzubringen. Noch im selben Jahr wurde das **Deutsch-Französische Jugendwerk** (DFJW, französisch OFAJ) gegründet, das seitdem Austausche, Praktika und Begegnungen fördert. Der 22. Januar ist heute der Deutsch-Französische Tag.",
      "Die Freundschaft lebt vor allem im Alltag: Es gibt mehr als 2 000 **Städtepartnerschaften** (les jumelages), viele Schulpartnerschaften, den deutsch-französischen Fernsehsender **Arte** und zahlreiche gemeinsame Ausbildungs- und Studiengänge. 2019 erneuerten beide Länder ihre Zusammenarbeit im **Vertrag von Aachen**. Für Europa gelten Deutschland und Frankreich als wichtiges Paar: Wenn sie sich einig sind, kommen in der EU oft Lösungen zustande.",
      "Auf Französisch sprichst du darüber mit Wörtern wie la réconciliation (Versöhnung), l’amitié franco-allemande, un jumelage, une ville jumelée, un échange scolaire, la paix (Frieden), l’Union européenne. Typische Fehler: « franco-allemand » klein und mit Bindestrich, aber « les Français » und « les Allemands » groß; und nicht « la amitié », sondern l’amitié.",
    ],
    terms: [
      { term: "traité de l’Élysée", text: "Der Élysée-Vertrag vom 22. Januar 1963 zwischen de Gaulle und Adenauer: Grundlage der deutsch-französischen Zusammenarbeit." },
      { term: "OFAJ / DFJW", text: "Office franco-allemand pour la Jeunesse, auf Deutsch Deutsch-Französisches Jugendwerk, gegründet 1963; fördert Austausch und Begegnung." },
      { term: "jumelage", text: "Eine Städtepartnerschaft. Zwei Partnerstädte sind des villes jumelées." },
      { term: "réconciliation", text: "Die Versöhnung, hier zwischen Deutschland und Frankreich nach den Kriegen." },
    ],
    takeaway:
      "Nach drei Kriegen (1870–1945) folgten Versöhnung und Zusammenarbeit: Schuman-Plan 1950 (Anfang der EU), Élysée-Vertrag am 22. Januar 1963 (de Gaulle, Adenauer), DFJW/OFAJ 1963, mehr als 2 000 jumelages, Arte, Vertrag von Aachen 2019.",
    sourceIds: ["lp", "elysee", "dfjw"],
    quiz: {
      question: "Wer unterzeichnete 1963 den Élysée-Vertrag?",
      answer: "Charles de Gaulle und Konrad Adenauer",
      wrong: ["Robert Schuman und Konrad Adenauer", "Charles de Gaulle und Willy Brandt"],
      explanation:
        "Den Vertrag unterzeichneten am 22. Januar 1963 Präsident de Gaulle und Bundeskanzler Adenauer. Schuman stand 1950 am Anfang der europäischen Einigung.",
    },
    workshop: {
      kind: "timeline",
      title: "Die Stationen der deutsch-französischen Freundschaft",
      instruction: "Bringe die Ereignisse in die richtige zeitliche Reihenfolge, vom frühesten zum spätesten.",
      categories: [],
      entries: [
        { text: "Fin de la Seconde Guerre mondiale: la France et l’Allemagne sont ennemies.", target: 0, feedback: "1945 endet der dritte Krieg zwischen beiden Ländern innerhalb von 75 Jahren." },
        { text: "Robert Schuman propose de gérer ensemble le charbon et l’acier.", target: 1, feedback: "Am 9. Mai 1950 legt Schuman seinen Plan vor." },
        { text: "De Gaulle et Adenauer signent le traité de l’Élysée à Paris.", target: 2, feedback: "Am 22. Januar 1963 wird der Élysée-Vertrag unterzeichnet." },
        { text: "La chaîne de télévision franco-allemande Arte commence à émettre.", target: 3, feedback: "Arte sendet seit 1992." },
        { text: "Les deux pays signent le traité d’Aix-la-Chapelle pour renforcer leur coopération.", target: 4, feedback: "Der Vertrag von Aachen wird 2019 unterzeichnet." },
      ],
      conclusion: "Von der Feindschaft 1945 über den Schuman-Plan und den Élysée-Vertrag bis zu Arte und dem Vertrag von Aachen: eine Geschichte der Versöhnung.",
    },
    casework: {
      title: "Ein Besuch aus der Partnerstadt",
      story:
        "Eure Stadt feiert 50 Jahre Partnerschaft mit einer Stadt in Burgund. Du sollst bei der Feier auf Französisch zwei Sätze sagen und eine französische Besucherin begrüßen.",
      steps: [
        {
          question: "Wie nennst du die Partnerschaft auf Französisch?",
          options: ["le jumelage entre nos deux villes", "le mariage entre nos deux villes", "la jumelle de nos deux villes"],
          answer: 0,
          explanation: "Eine Städtepartnerschaft heißt un jumelage. Une jumelle ist eine Zwillingsschwester, und das Fernglas heißt des jumelles.",
        },
        {
          question: "Welcher Satz würdigt die Bedeutung für Europa?",
          options: ["Notre amitié montre que la paix en Europe est possible.", "Notre amitié montre que la guerre en Europe était utile.", "Notre amitié montre qu’on n’a pas besoin de l’Europe."],
          answer: 0,
          explanation: "Die Freundschaft steht für Versöhnung und Frieden in Europa.",
        },
        {
          question: "Die Besucherin erzählt, dass sie 1975 über das OFAJ ihren ersten Austausch gemacht hat. Was weißt du dazu?",
          options: ["Das Jugendwerk gibt es seit 1963.", "Das Jugendwerk gibt es erst seit 2019.", "Das Jugendwerk ist ein Fernsehsender."],
          answer: 0,
          explanation: "Das OFAJ, auf Deutsch DFJW, wurde 1963 gegründet; 1975 gab es also schon Austausche.",
        },
      ],
      verdict:
        "Jumelage, paix und OFAJ: Mit diesen Begriffen und dem Wissen um 1963 sprichst du angemessen über die Partnerschaft.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre auf Deutsch in vier Sätzen einem jüngeren Mitschüler, was am 22. Januar 1963 geschah und warum der Tag noch heute gefeiert wird.",
        hints: ["Nenne Personen, Ort und Inhalt des Vertrags.", "Verbinde ihn mit dem Jugendwerk und dem Deutsch-Französischen Tag."],
        model:
          "Am 22. Januar 1963 haben der französische Präsident Charles de Gaulle und der deutsche Bundeskanzler Konrad Adenauer in Paris den Élysée-Vertrag unterzeichnet. Darin versprachen beide Länder, eng zusammenzuarbeiten und besonders die Jugend zusammenzubringen. Kurz darauf entstand das Deutsch-Französische Jugendwerk, das bis heute Austausche organisiert. Deshalb ist der 22. Januar heute der Deutsch-Französische Tag, an dem viele Schulen Aktionen machen.",
        criteria: ["Datum, Personen und Ort sind richtig.", "Inhalt und Folgen des Vertrags sind erklärt.", "Der Bezug zum heutigen Gedenktag ist hergestellt."],
      },
      2: {
        prompt:
          "Schreibe einen Artikel (acht bis zehn Sätze) auf Französisch für die Schülerzeitung eurer Partnerschule zum Deutsch-Französischen Tag: Erkläre kurz die Geschichte, nenne zwei Formen der Freundschaft heute und sage, was sie dir persönlich bedeutet.",
        hints: ["Gliedere: Titel, Geschichte, heute, persönliche Meinung.", "Verwende la réconciliation, le traité de l’Élysée, un jumelage, un échange."],
        model:
          "Le 22 janvier, une journée pour l’amitié. Il y a plus de soixante ans, la France et l’Allemagne étaient des ennemies. Après la Seconde Guerre mondiale, elles ont choisi la réconciliation. Le 22 janvier 1963, Charles de Gaulle et Konrad Adenauer ont signé le traité de l’Élysée. La même année, l’OFAJ a été créé pour les jeunes. Aujourd’hui, il existe plus de 2 000 jumelages entre villes françaises et allemandes. Grâce aux échanges scolaires, beaucoup d’élèves ont des amis dans l’autre pays. Moi, j’ai fait un échange à Dijon l’année dernière, et ma correspondante est devenue une vraie amie. Pour moi, cette amitié est la preuve que la paix en Europe se construit avec les gens.",
        criteria: ["Die geschichtlichen Angaben sind richtig.", "Zwei heutige Formen der Freundschaft sind genannt.", "Eine persönliche Stellungnahme schließt den Artikel ab."],
      },
    },
  },
  {
    id: "fr-persoenlichkeiten",
    lb: 4,
    unit: "2",
    covers: ["2.3"],
    title: "Herausragende französische Persönlichkeiten",
    intro:
      "Von Victor Hugo über Marie Curie bis Simone Veil: Persönlichkeiten zeigen, wofür Frankreich in Kultur, Wissenschaft und Politik steht.",
    paragraphs: [
      "Frankreichs **kulturelle Bedeutung** zeigt sich an Menschen, die Literatur, Wissenschaft, Kunst und Politik geprägt haben. **Victor Hugo** (1802–1885) schrieb « Notre-Dame de Paris » und « Les Misérables » und setzte sich gegen Armut und die Todesstrafe ein. **Antoine de Saint-Exupéry** schrieb 1943 « Le Petit Prince », eines der meistübersetzten Bücher der Welt. **Molière** (17. Jahrhundert) ist so bekannt, dass man Französisch « la langue de Molière » nennt.",
      "In der **Wissenschaft** stehen **Louis Pasteur**, der einen Impfstoff gegen Tollwut entwickelte und die Pasteurisierung erfand, und **Marie Curie**, eine in Polen geborene Forscherin, die in Paris arbeitete und als erste Person zwei Nobelpreise bekam (Physik 1903, Chemie 1911). **Louis Braille** erfand als junger Mann eine Punktschrift, mit der blinde Menschen bis heute lesen.",
      "In **Politik und Gesellschaft** ist **Simone Veil** bedeutend: Sie überlebte das Konzentrationslager Auschwitz, wurde Gesundheitsministerin und 1979 die erste Präsidentin des direkt gewählten Europäischen Parlaments. In der **Musik** ist **Édith Piaf** mit « La vie en rose » weltbekannt, in der **Mode** **Coco Chanel**. Einige von ihnen, etwa Victor Hugo, Marie Curie, Louis Braille und Simone Veil, ruhen im **Panthéon** in Paris, wo Frankreich große Persönlichkeiten ehrt.",
      "Wenn du eine Persönlichkeit vorstellst, nennst du Lebensdaten, Bereich, wichtigste Leistung und warum sie heute noch zählt. Dafür brauchst du das passé composé (Elle a découvert …, Il a écrit …) und Wendungen wie être connu(e) pour (bekannt sein für), se battre pour (sich einsetzen für), recevoir un prix. Typischer Fehler: Lebensdaten falsch übernehmen. Prüfe Fakten in einer verlässlichen Quelle.",
    ],
    terms: [
      { term: "Panthéon", text: "Ein Gebäude in Paris, in dem Frankreich bedeutende Persönlichkeiten ehrt und viele von ihnen bestattet sind." },
      { term: "être connu(e) pour", text: "Bekannt sein für: « Marie Curie est connue pour ses recherches sur la radioactivité. »" },
      { term: "la langue de Molière", text: "Eine übliche Umschreibung für die französische Sprache, nach dem Theaterdichter Molière." },
    ],
    takeaway:
      "Frankreichs kulturelle Bedeutung zeigen Persönlichkeiten wie Victor Hugo, Molière, Saint-Exupéry (Literatur), Pasteur, Marie Curie, Braille (Wissenschaft), Simone Veil (Politik), Édith Piaf und Coco Chanel. Vorstellen: Daten, Bereich, Leistung, Bedeutung heute.",
    sourceIds: ["lp", "larousse"],
    quiz: {
      question: "Wofür ist Louis Braille bekannt?",
      answer: "Für eine Punktschrift für blinde Menschen.",
      wrong: ["Für einen Impfstoff gegen die Tollwut.", "Für den Roman « Les Misérables »."],
      explanation:
        "Louis Braille erfand die Blindenschrift, die nach ihm benannt ist. Den Impfstoff entwickelte Pasteur, « Les Misérables » schrieb Victor Hugo.",
    },
    workshop: {
      kind: "classify",
      title: "Persönlichkeiten ihrem Bereich zuordnen",
      instruction: "Ordne jede Persönlichkeit dem Bereich zu, für den sie vor allem bekannt ist.",
      categories: ["Literatur", "Wissenschaft", "Politik und Gesellschaft"],
      entries: [
        { text: "Victor Hugo, auteur de « Notre-Dame de Paris » et des « Misérables »", target: 0, feedback: "Victor Hugo ist einer der bekanntesten französischen Schriftsteller." },
        { text: "Marie Curie, prix Nobel de physique et de chimie", target: 1, feedback: "Marie Curie erforschte die Radioaktivität und bekam zwei Nobelpreise." },
        { text: "Simone Veil, première présidente du Parlement européen élu", target: 2, feedback: "Simone Veil prägte die französische und europäische Politik." },
        { text: "Louis Pasteur, inventeur du vaccin contre la rage", target: 1, feedback: "Pasteur entwickelte den Impfstoff gegen Tollwut." },
        { text: "Antoine de Saint-Exupéry, auteur du « Petit Prince »", target: 0, feedback: "Saint-Exupéry schrieb « Le Petit Prince » (1943)." },
        { text: "Robert Schuman, père de l’Europe et ministre français", target: 2, feedback: "Schuman legte 1950 den Grundstein für die europäische Einigung." },
      ],
      conclusion: "Literatur, Wissenschaft und Politik: In allen drei Bereichen haben Französinnen und Franzosen Weltgeschichte geschrieben.",
    },
    casework: {
      title: "Ein Referat über Marie Curie",
      story:
        "Du bereitest ein Kurzreferat über Marie Curie vor. Im Internet findest du einen Text, in dem steht: « Marie Curie, née à Varsovie en 1867, a reçu le prix Nobel de physique en 1903 et le prix Nobel de chimie en 1911. »",
      steps: [
        {
          question: "Was bedeutet « née à Varsovie »?",
          options: ["Geboren in Warschau.", "Gestorben in Warschau.", "Studiert in Warschau."],
          answer: 0,
          explanation: "Né(e) ist das Partizip von naître (geboren werden). Varsovie ist Warschau.",
        },
        {
          question: "Warum zählt sie trotzdem zu den französischen Persönlichkeiten?",
          options: ["Sie lebte und forschte in Paris.", "Sie hat nie Polen verlassen.", "Sie schrieb französische Romane."],
          answer: 0,
          explanation: "Marie Curie arbeitete in Paris, wurde Französin und ruht im Panthéon.",
        },
        {
          question: "Wie formulierst du ihre Bedeutung auf Französisch?",
          options: ["Elle est connue pour ses recherches sur la radioactivité.", "Elle est connue par ses recherches sur la radioactivité.", "Elle connaît pour ses recherches sur la radioactivité."],
          answer: 0,
          explanation: "Bekannt sein für heißt être connu(e) pour.",
        },
      ],
      verdict:
        "Geburtsort, Wirkungsort und Leistung genau erfasst und mit être connue pour formuliert: So wird das Referat über Marie Curie richtig.",
    },
    tasks: {
      1: {
        prompt:
          "Stelle auf Französisch in vier Sätzen eine der Persönlichkeiten aus der Lektion vor: Lebenszeit oder Jahrhundert, Bereich, wichtigste Leistung, Bedeutung heute.",
        hints: ["Nutze das passé composé: il a écrit, elle a découvert.", "Être connu(e) pour passt für die Leistung."],
        model:
          "Victor Hugo a vécu au dix-neuvième siècle, de 1802 à 1885. C’est un écrivain français très célèbre. Il est connu pour ses romans « Notre-Dame de Paris » et « Les Misérables ». Aujourd’hui encore, ses livres sont lus dans le monde entier et adaptés au cinéma et en comédie musicale.",
        criteria: ["Zeit, Bereich, Leistung und Bedeutung sind genannt.", "Die Fakten sind richtig.", "Passé composé und être connu pour sind richtig verwendet."],
      },
      2: {
        prompt:
          "Wähle eine französische Persönlichkeit, die nicht in der Lektion vorkommt (zum Beispiel Jules Verne, Claude Monet, Claude Debussy). Recherchiere in einer verlässlichen Quelle und schreibe ein Kurzporträt (acht bis zehn Sätze) für einen Lernplakat-Text. Nenne deine Quelle.",
        hints: ["Prüfe Lebensdaten in zwei Quellen.", "Ende mit einem Satz, warum die Person dich beeindruckt."],
        model:
          "Jules Verne est né à Nantes en 1828 et il est mort à Amiens en 1905. C’est un écrivain français. Il est connu pour ses romans d’aventures et de science-fiction, comme « Vingt mille lieues sous les mers » et « Le Tour du monde en quatre-vingts jours ». Dans ses livres, il a imaginé des voyages sous la mer et vers la Lune à une époque où c’était encore impossible. Ses romans ont été traduits dans de nombreuses langues. Beaucoup de films ont été tournés d’après ses histoires. Il a inspiré des scientifiques et des explorateurs. Ce qui m’impressionne, c’est son imagination. Source: Larousse, encyclopédie en ligne.",
        criteria: ["Die Persönlichkeit ist mit richtigen Fakten vorgestellt.", "Leistung und Bedeutung werden klar.", "Eine Quelle ist genannt."],
      },
    },
  },
  {
    id: "fr-meinungen-respektieren",
    lb: 4,
    unit: "2",
    covers: ["2.4"],
    title: "Andere Meinungen respektieren und die eigene prüfen",
    intro:
      "Bei Themen wie Umweltschutz gehen Meinungen auseinander. Du hörst zu, gehst respektvoll auf andere ein und denkst über deine eigene Sicht nach.",
    paragraphs: [
      "Bei **gesellschaftlichen Themen** wie Umweltschutz oder sozialem Engagement gibt es selten nur eine richtige Meinung. Wer in einer Diskussion **respektvoll** bleibt, hört zu, fasst die andere Meinung fair zusammen und widerspricht sachlich. Wendungen dafür: « Je comprends ton point de vue. », « Tu as raison sur ce point, mais … », « Je respecte ton avis, même si je ne le partage pas. »",
      "**Sachlich widersprechen** heißt: das Argument kritisieren, nicht die Person. Statt « T’es nul, tu n’y connais rien! » sagst du « Je ne suis pas d’accord, parce que … » oder « Je vois les choses autrement: … ». Nachfragen zeigt Interesse: « Pourquoi tu penses ça? », « Qu’est-ce que tu veux dire exactement? » Unterbrich nicht: « Je peux finir ma phrase? » ist eine höfliche Bitte, wenn du selbst unterbrochen wirst.",
      "**Die eigene Meinung reflektieren** heißt: Prüfe, woher sie kommt (Familie, Freunde, soziale Netzwerke?) und ob ein Argument der anderen Seite dich überzeugt. Man darf seine Meinung ändern: « Tu m’as convaincu(e). », « Je n’avais pas pensé à ça. », « Finalement, je suis moins sûr(e) que … » Das ist keine Schwäche, sondern ein Zeichen von Nachdenken.",
      "Auch zwischen Ländern unterscheiden sich Sichtweisen: In Frankreich wird zum Beispiel oft lebhafter und direkter diskutiert, Unterbrechen gilt dort in Gesprächen unter Freunden nicht immer als unhöflich. Solche Unterschiede sind typisch, gelten aber nicht für alle. Typische Fehler: Pauschalurteile (« Les Français sont tous … »), Ironie, die niemand versteht, und Zustimmung ohne Begründung.",
    ],
    terms: [
      { term: "point de vue", text: "Der Standpunkt, die Sichtweise: « Je comprends ton point de vue. »" },
      { term: "sachlich widersprechen", text: "Das Argument kritisieren, nicht die Person: « Je vois les choses autrement, parce que … »" },
      { term: "reflektieren", text: "Über die eigene Meinung nachdenken: Woher kommt sie, überzeugt mich ein Gegenargument?" },
    ],
    takeaway:
      "Respektvoll diskutieren: zuhören, fair zusammenfassen (je comprends ton point de vue), sachlich widersprechen (je vois les choses autrement, parce que), nachfragen und die eigene Meinung prüfen (tu m’as convaincu, je n’avais pas pensé à ça). Keine Pauschalurteile.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Wie widersprichst du respektvoll?",
      answer: "Je comprends ton avis, mais je vois les choses autrement.",
      wrong: ["T’as tort, ton idée est nulle et tu racontes n’importe quoi.", "Tu n’as rien compris, comme d’habitude, alors tais-toi."],
      explanation:
        "Die richtige Antwort erkennt die andere Meinung an und widerspricht sachlich. Die anderen greifen die Person an.",
    },
    workshop: {
      kind: "classify",
      title: "Respektvoll oder verletzend?",
      instruction: "Ordne jede Äußerung aus einer Diskussion über « Faut-il manger moins de viande? » zu.",
      categories: ["respektvoll widersprechen", "nachfragen", "verletzend"],
      entries: [
        { text: "Tu as raison pour le climat, mais je pense aux agriculteurs de ma région.", target: 0, feedback: "Teilweise zustimmen und dann ein eigenes Argument nennen: respektvoll." },
        { text: "Pourquoi tu penses que c’est meilleur pour la santé? Tu peux expliquer?", target: 1, feedback: "Eine echte Frage nach der Begründung: nachfragen." },
        { text: "Les végétariens sont tous des donneurs de leçons, c’est ridicule.", target: 2, feedback: "Ein Pauschalurteil über eine ganze Gruppe: verletzend." },
        { text: "Je respecte ton avis, même si je ne le partage pas du tout.", target: 0, feedback: "Respekt ausdrücken und trotzdem anderer Meinung bleiben." },
        { text: "Qu’est-ce que tu veux dire exactement par « manger mieux »?", target: 1, feedback: "Nach der Bedeutung fragen: nachfragen." },
        { text: "Tais-toi, tu n’y connais rien, tu es trop jeune pour parler.", target: 2, feedback: "Die Person wird angegriffen und zum Schweigen gebracht: verletzend." },
      ],
      conclusion: "Respektvoll ist, wer Argumente prüft, nachfragt und anerkennt; verletzend ist, wer Personen oder ganze Gruppen angreift.",
    },
    casework: {
      title: "Diskussion im Austausch",
      story:
        "Beim Austausch diskutierst du mit Jules über Kurzstreckenflüge. Er sagt: « Moi, je prends l’avion pour aller à Nice, c’est plus rapide. L’écologie, c’est un problème pour les politiques, pas pour moi. »",
      steps: [
        {
          question: "Wie beginnst du deine Antwort respektvoll?",
          options: ["Je comprends que ce soit plus rapide, mais …", "Tu es complètement égoïste, Jules, vraiment.", "Ça ne sert à rien de parler avec toi, Jules."],
          answer: 0,
          explanation: "Du erkennst sein Argument an und leitest dann deinen Einwand ein.",
        },
        {
          question: "Wie fragst du sinnvoll nach?",
          options: ["Pourquoi tu penses que ce n’est pas ton problème?", "Tu ne lis jamais les journaux, toi, hein?", "Tu veux que je t’explique la vie, peut-être?"],
          answer: 0,
          explanation: "Eine offene Frage nach seiner Begründung führt das Gespräch weiter. Die anderen sind herablassend.",
        },
        {
          question: "Jules nennt ein gutes Argument: Der Zug nach Nizza dauert sehr lange. Wie reagierst du?",
          options: ["C’est vrai, je n’avais pas pensé à ça.", "Peu importe, j’ai raison et c’est tout.", "Ce n’est pas un argument, c’est une excuse."],
          answer: 0,
          explanation: "Ein gutes Gegenargument anzuerkennen zeigt, dass du über deine Meinung nachdenkst.",
        },
      ],
      verdict:
        "Anerkennen, nachfragen und ein gutes Gegenargument gelten lassen: So bleibt die Diskussion fair, auch wenn ihr verschiedener Meinung bleibt.",
    },
    tasks: {
      1: {
        prompt:
          "Formuliere respektvoll um: 1. « Ton idée est nulle. » 2. « Tu racontes n’importe quoi. » 3. « Tais-toi, c’est mon tour! »",
        hints: ["Kritisiere das Argument, nicht die Person.", "Für das Unterbrechen passt eine höfliche Bitte."],
        model:
          "1. Je ne suis pas convaincu par ton idée, parce que … 2. Je ne suis pas d’accord avec ce que tu dis. Tu peux m’expliquer pourquoi tu penses ça? 3. Excuse-moi, est-ce que je peux finir ma phrase, s’il te plaît? So bleibt die Kritik sachlich, und niemand wird persönlich angegriffen.",
        criteria: ["Alle drei Sätze sind respektvoll.", "Die Kritik bleibt in der Sache.", "Die Wendungen sind sprachlich richtig."],
      },
      2: {
        prompt:
          "Schreibe einen Dialog (zehn Zeilen) zwischen dir und einem französischen Austauschpartner zur Frage « Faut-il interdire les voitures dans le centre-ville? ». Ihr seid verschiedener Meinung. Zeige respektvolles Widersprechen, Nachfragen und am Ende, wie du deine Meinung ein Stück änderst.",
        hints: ["Lass beide Seiten echte Argumente nennen.", "Ende mit einer Wendung wie je n’avais pas pensé à ça."],
        model:
          "– Moi, je suis pour: les voitures polluent et font du bruit. – Je comprends ton point de vue, mais ma grand-mère ne peut pas marcher longtemps. – Ah, je n’avais pas pensé aux personnes âgées. Qu’est-ce que tu proposes? – Peut-être des navettes électriques gratuites? – C’est une bonne idée! Mais les commerçants ont peur de perdre des clients. – Pourquoi tu penses ça? – Parce que beaucoup de clients viennent en voiture. – Tu as raison sur ce point. Alors, il faudrait de grands parkings à l’entrée de la ville. – Finalement, je suis moins sûr que l’interdiction totale soit la meilleure solution.",
        criteria: ["Beide Seiten widersprechen respektvoll.", "Nachfragen kommen vor.", "Eine Meinungsänderung wird sichtbar und begründet."],
      },
    },
  },
];
