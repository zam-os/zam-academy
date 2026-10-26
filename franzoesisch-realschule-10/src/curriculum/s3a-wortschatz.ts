import type { Lesson } from "../model/types";

/**
 * Stufe 3, erster Teil: Wortschatz (Kompetenzerwartungen 1.2.1.1 bis 1.2.1.3): bekannten Wortschatz in
 * neuen Zusammenhängen anwenden, themenbezogener Wortschatz für Bewerbung, Umweltschutz und soziales
 * Engagement und individueller Wortschatz zu Berufswünschen und eigenen Interessen.
 */
export const S3A: Lesson[] = [
  {
    id: "fr-wortschatz-bewerbung",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.1", "1.2.1.2"],
    title: "Wortschatz: Bewerbung und Vorstellungsgespräch",
    intro:
      "Stellenanzeige, Lebenslauf, Anschreiben und Gespräch: Mit den passenden Wörtern bewirbst du dich auf Französisch.",
    paragraphs: [
      "Rund um die **Bewerbung** (la candidature) brauchst du einen festen Wortschatz. Eine **offre d’emploi** oder **offre de stage** ist eine Stellen- oder Praktikumsanzeige. Du schickst einen **CV** (curriculum vitae, Lebenslauf) und eine **lettre de motivation** (Anschreiben). Wenn es klappt, wirst du zu einem **entretien d’embauche** (Vorstellungsgespräch) eingeladen. Ein **stage** ist ein Praktikum, ein **apprentissage** eine Lehre, un **job d’été** ein Ferienjob.",
      "Im **Lebenslauf** stehen die Rubriken état civil (Name, Adresse, Geburtsdatum), formation (Schulbildung), expérience professionnelle (Berufserfahrung, auch Praktika), compétences (Fähigkeiten, zum Beispiel langues: allemand langue maternelle, anglais courant, français niveau B1) und centres d’intérêt (Hobbys). Im **Anschreiben** sagst du, warum du dich bewirbst und was du mitbringst: « Je suis motivé(e), sérieux/sérieuse et j’aime travailler en équipe. »",
      "Im **Gespräch** wirst du nach dir, deinen Stärken und Schwächen und deiner Motivation gefragt: « Parlez-moi de vous. », « Quelles sont vos qualités? », « Pourquoi voulez-vous travailler chez nous? » Antworten bereitest du vor: « Je suis quelqu’un de ponctuel et de curieux. », « Mon point faible, c’est que je suis parfois impatient(e), mais j’y travaille. » Am Ende fragst du selbst etwas: « Quels seraient mes horaires? »",
      "Hier wendest du bekannten Wortschatz **in neuen Zusammenhängen** an: Adjektive für Charakter, Zeiten für Erfahrungen, den conditionnel für Höflichkeit. Typische Fehler: tu statt vous im Gespräch, « Je suis 16 ans » statt j’ai 16 ans, « Je cherche un stage chez Siemens dans juillet » statt en juillet und das falsche Wort für Ausbildung: formation ist Ausbildung allgemein, apprentissage die Lehre im Betrieb.",
    ],
    terms: [
      { term: "lettre de motivation", text: "Das Anschreiben einer Bewerbung: warum man sich bewirbt und was man mitbringt." },
      { term: "entretien d’embauche", text: "Das Vorstellungsgespräch. Man siezt und bereitet Antworten zu Stärken und Motivation vor." },
      { term: "apprentissage", text: "Die Lehre: Ausbildung im Betrieb mit Berufsschule. Un apprenti, une apprentie ist ein Lehrling." },
      { term: "compétences", text: "Fähigkeiten im Lebenslauf, zum Beispiel Sprachen, Computerkenntnisse, Führerschein." },
    ],
    takeaway:
      "Bewerbung: offre de stage oder d’emploi, CV (formation, expérience, compétences, centres d’intérêt), lettre de motivation, entretien d’embauche mit vous. Stage = Praktikum, apprentissage = Lehre, formation = Ausbildung allgemein.",
    sourceIds: ["lp", "onisep", "dfjw"],
    quiz: {
      question: "Wie heißt das Anschreiben einer Bewerbung auf Französisch?",
      answer: "la lettre de motivation",
      wrong: ["la lettre de candidat", "le curriculum vitae"],
      explanation:
        "Das Anschreiben heißt lettre de motivation. Der CV ist der Lebenslauf, lettre de candidat gibt es so nicht.",
    },
    workshop: {
      kind: "classify",
      title: "Die Teile des Lebenslaufs",
      instruction: "Ordne jede Angabe der passenden Rubrik eines französischen Lebenslaufs zu.",
      categories: ["formation", "expérience professionnelle", "compétences"],
      entries: [
        { text: "2021–2027: Realschule Am Stadtpark, Kempten (diplôme de fin d’études prévu)", target: 0, feedback: "Schulbildung gehört zur formation." },
        { text: "Stage de deux semaines dans une boulangerie, mars 2025: vente et service", target: 1, feedback: "Ein Praktikum zählt als Berufserfahrung." },
        { text: "Langues: allemand (langue maternelle), anglais (B2), français (B1)", target: 2, feedback: "Sprachkenntnisse sind Fähigkeiten: compétences." },
        { text: "Job d’été au camping municipal: accueil des clients, juillet 2026", target: 1, feedback: "Ein Ferienjob ist ebenfalls Berufserfahrung." },
        { text: "Informatique: traitement de texte, tableur, création de présentations", target: 2, feedback: "Computerkenntnisse gehören zu den compétences." },
        { text: "Cours de secourisme de la Croix-Rouge (16 heures), certificat obtenu", target: 0, feedback: "Ein Kurs mit Zertifikat gehört zur (Weiter-)Bildung, also formation." },
      ],
      conclusion: "Schule und Kurse unter formation, Praktika und Jobs unter expérience professionnelle, Sprachen und Computer unter compétences.",
    },
    casework: {
      title: "Im Vorstellungsgespräch",
      story:
        "Du bewirbst dich um ein Praktikum in einem Hotel in Straßburg. Die Chefin fragt: « Bonjour, asseyez-vous. Parlez-moi un peu de vous. Pourquoi voulez-vous faire un stage chez nous? »",
      steps: [
        {
          question: "Wie stellst du dich passend vor?",
          options: ["J’ai seize ans et je suis en dixième classe d’une Realschule.", "Je suis seize ans et je vais dans une école en Bavière.", "Salut! Moi, c’est Max, et toi, tu t’appelles comment?"],
          answer: 0,
          explanation: "Alter mit avoir, dazu die Schule. Je suis seize ans ist falsch, salut und toi sind zu locker.",
        },
        {
          question: "Wie begründest du deine Bewerbung?",
          options: ["Je voudrais travailler dans l’hôtellerie et améliorer mon français.", "Parce que mes parents veulent absolument que je fasse un stage.", "Je ne sais pas trop, c’était la seule offre que j’ai trouvée en ligne."],
          answer: 0,
          explanation: "Du nennst ein eigenes Ziel und einen Nutzen. Die anderen Antworten wirken unmotiviert.",
        },
        {
          question: "Was fragst du am Ende des Gesprächs?",
          options: ["Quels seraient mes horaires de travail?", "Est-ce que je peux partir plus tôt le vendredi?", "Combien de vacances j’aurai, au juste?"],
          answer: 0,
          explanation: "Eine sachliche Frage nach den Arbeitszeiten zeigt Interesse. Die anderen wirken, als wolle man wenig arbeiten.",
        },
      ],
      verdict:
        "Richtig vorstellen, eine eigene Motivation nennen und eine sachliche Frage stellen: So hinterlässt du im Gespräch einen guten Eindruck.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe auf Französisch die Rubrik compétences und centres d’intérêt deines Lebenslaufs mit je zwei bis drei Angaben.",
        hints: ["Bei Sprachen gibst du das Niveau an: langue maternelle, B1, courant.", "Hobbys nennst du mit Nomen: la natation, la lecture, le théâtre."],
        model:
          "Compétences: allemand (langue maternelle), anglais (B2), français (B1); informatique: traitement de texte et tableur; permis AM (scooter). Centres d’intérêt: le handball en club, la photographie, le bénévolat dans une association de quartier.",
        criteria: ["Beide Rubriken sind vorhanden.", "Die Angaben sind knapp und passend formuliert.", "Sprachniveaus sind angegeben."],
      },
      2: {
        prompt:
          "Schreibe eine kurze lettre de motivation (acht bis zehn Sätze) für ein vierwöchiges Praktikum in einer Buchhandlung in Lyon: Anrede, Bezug auf die Anzeige, Motivation, zwei Stärken, Verfügbarkeit, höflicher Schluss.",
        hints: ["Beginne mit Madame, Monsieur und beziehe dich auf l’offre parue sur votre site.", "Schließe mit Je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées."],
        model:
          "Madame, Monsieur, j’ai lu avec intérêt votre offre de stage parue sur votre site. Je suis élève en dixième classe dans une Realschule en Bavière et j’apprends le français depuis quatre ans. J’adore les livres et je voudrais découvrir le métier de libraire. Je suis curieuse et j’aime conseiller les gens. De plus, je suis ponctuelle et je travaille bien en équipe. Ce stage me permettrait aussi d’améliorer mon français. Je suis disponible du 1er au 28 août. Je serais très heureuse de vous rencontrer pour un entretien. Je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées. Anna Berger",
        criteria: ["Alle Teile eines Anschreibens sind vorhanden.", "Motivation und zwei Stärken sind konkret.", "Ton und Formeln sind formell."],
      },
    },
  },
  {
    id: "fr-wortschatz-umwelt-engagement",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.2"],
    title: "Wortschatz: Umweltschutz und soziales Engagement",
    intro:
      "Recyceln, Müll vermeiden, ehrenamtlich helfen: Mit diesem Wortschatz sprichst und schreibst du über gesellschaftliche Themen.",
    paragraphs: [
      "Zum **Umweltschutz** (la protection de l’environnement) gehören Wörter wie le changement climatique / le réchauffement climatique (Klimawandel, Erderwärmung), la pollution (Verschmutzung), les déchets (Abfall), trier les déchets (Müll trennen), recycler, le gaspillage (Verschwendung), les énergies renouvelables (erneuerbare Energien), économiser l’eau / l’énergie (sparen), les transports en commun (öffentliche Verkehrsmittel) und l’empreinte carbone (CO₂-Fußabdruck).",
      "Zum **sozialen Engagement** (l’engagement social) gehören s’engager pour / dans (sich einsetzen für / in), le bénévolat (Ehrenamt), un(e) bénévole (Ehrenamtliche/r), une association (Verein, Organisation), aider les personnes âgées / sans-abri / handicapées, collecter des dons (Spenden sammeln), la solidarité. In Frankreich gibt es den **service civique**, einen freiwilligen Dienst für junge Menschen, und bekannte Organisationen wie die **Restos du Cœur**, die Essen an Bedürftige verteilen.",
      "Diese Wörter nutzt du **situations- und adressatengerecht**: In einem Forum schreibst du « Moi, je fais du bénévolat dans un refuge pour animaux », in einem Artikel « De nombreux jeunes s’engagent dans des associations ». Für Meinungen verbindest du sie mit Wendungen: « Il est important de réduire nos déchets. », « À mon avis, chacun peut faire quelque chose. »",
      "Typische Fehler: « le déchet » im Singular für Müll allgemein (meist les déchets), « faire de l’engagement » statt s’engager, « l’environment » nach englischem Muster (richtig environnement mit zwei n), und « bénévole » als Verb (es ist ein Nomen oder Adjektiv: travailler comme bénévole).",
    ],
    terms: [
      { term: "trier les déchets", text: "Den Müll trennen. Le tri ist die Mülltrennung, la poubelle die Mülltonne." },
      { term: "le gaspillage", text: "Die Verschwendung, zum Beispiel le gaspillage alimentaire (Lebensmittelverschwendung)." },
      { term: "le bénévolat", text: "Das Ehrenamt. Un(e) bénévole arbeitet unbezahlt, zum Beispiel in einer association." },
      { term: "s’engager", text: "Sich einsetzen, sich engagieren: s’engager pour l’environnement, s’engager dans une association." },
    ],
    takeaway:
      "Umwelt: le réchauffement climatique, la pollution, les déchets, trier, recycler, le gaspillage, les énergies renouvelables. Engagement: s’engager, le bénévolat, un(e) bénévole, une association, collecter des dons, le service civique.",
    sourceIds: ["lp", "servicecivique", "larousse"],
    quiz: {
      question: "Wie sagst du: „Ich engagiere mich in einem Verein“?",
      answer: "Je m’engage dans une association.",
      wrong: ["Je fais de l’engagement dans un club.", "Je bénévole dans une association."],
      explanation:
        "Sich engagieren heißt s’engager, Verein im Sinn von Organisation heißt association. Bénévole ist kein Verb.",
    },
    workshop: {
      kind: "choose",
      title: "Das passende Wort einsetzen",
      instruction: "Wähle das Wort, das zum Satz passt. Achte auf Bedeutung und Form.",
      items: [
        { before: "Chez nous, on ", options: ["trie", "jette", "gaspille"], answer: 0, after: " les déchets: le plastique, le papier et le verre.", feedback: "Plastik, Papier und Glas getrennt: trier les déchets." },
        { before: "Le ", options: ["gaspillage", "recyclage", "tri"], answer: 0, after: " alimentaire est un grand problème: on jette trop de nourriture.", feedback: "Zu viel weggeworfenes Essen ist Verschwendung: le gaspillage." },
        { before: "Ma sœur travaille comme ", options: ["bénévole", "bénévolat", "bénévoler"], answer: 0, after: " aux Restos du Cœur.", feedback: "Eine Person, die unbezahlt hilft: une bénévole." },
        { before: "Pour protéger le climat, il faut utiliser des énergies ", options: ["renouvelables", "renouvelées", "nouvelles"], answer: 0, after: " comme le soleil et le vent.", feedback: "Erneuerbare Energien heißen énergies renouvelables." },
        { before: "Beaucoup de jeunes ", options: ["s’engagent", "engagent", "se gagnent"], answer: 0, after: " pour protéger la nature.", feedback: "Sich einsetzen heißt s’engager, reflexiv." },
      ],
      conclusion: "Trier, le gaspillage, un(e) bénévole, renouvelable und s’engager: Mit diesen Wörtern sprichst du genau über Umwelt und Engagement.",
    },
    casework: {
      title: "Ein Projekt für die Partnerschule",
      story:
        "Eure Partnerschule in Dijon fragt in einer E-Mail: « Qu’est-ce que vous faites pour l’environnement et pour les autres dans votre collège? » In eurer Schule gibt es eine Mülltrennung, einen Tauschmarkt für Kleidung und eine Gruppe, die Senioren besucht.",
      steps: [
        {
          question: "Wie beschreibst du die Mülltrennung?",
          options: ["Dans chaque classe, nous trions les déchets.", "Dans chaque classe, nous gaspillons les déchets.", "Dans chaque classe, nous recyclons les classes."],
          answer: 0,
          explanation: "Müll trennen heißt trier les déchets. Gaspiller heißt verschwenden.",
        },
        {
          question: "Wie nennst du den Tauschmarkt passend?",
          options: ["Un marché d’échange de vêtements.", "Un magasin de vêtements très chers.", "Une collecte de déchets plastiques."],
          answer: 0,
          explanation: "Échanger heißt tauschen: un marché d’échange. So vermeidet man neue Käufe.",
        },
        {
          question: "Wie beschreibst du die Gruppe, die Senioren besucht?",
          options: ["Des bénévoles rendent visite aux personnes âgées.", "Des bénévoles visitent les personnes âgées au musée.", "Des personnes âgées font du bénévolat chez nous."],
          answer: 0,
          explanation: "Rendre visite à quelqu’un heißt jemanden besuchen; visiter benutzt man für Orte.",
        },
      ],
      verdict:
        "Trier les déchets, un marché d’échange und rendre visite aux personnes âgées: Mit genauem Wortschatz versteht die Partnerschule eure Projekte.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe auf Französisch fünf Sätze darüber, was du persönlich für die Umwelt tust oder tun könntest. Verwende mindestens fünf Wörter aus der Lektion.",
        hints: ["Denke an Müll, Verkehr, Energie und Essen.", "Für Möglichkeiten passt der conditionnel: je pourrais …"],
        model:
          "Chez moi, je trie les déchets et je recycle les bouteilles en verre. Je vais au collège à vélo ou en transports en commun. J’essaie d’économiser l’énergie: j’éteins la lumière quand je quitte une pièce. Je pourrais manger moins de viande pour réduire mon empreinte carbone. Je voudrais aussi lutter contre le gaspillage alimentaire à la cantine.",
        criteria: ["Mindestens fünf Wörter aus der Lektion sind richtig verwendet.", "Die Sätze sind konkret.", "Grammatik und Rechtschreibung stimmen."],
      },
      2: {
        prompt:
          "Schreibe einen Forumsbeitrag (acht bis zehn Sätze) auf eine Frage einer französischen Jugendseite: « Faut-il obliger les jeunes à faire du bénévolat? ». Nutze den Wortschatz zu Engagement und gib eine begründete Meinung.",
        hints: ["Nenne ein eigenes Beispiel für Engagement.", "Wäge ab: Vorteile, Nachteile, Meinung."],
        model:
          "Salut à tous! Moi, je fais du bénévolat dans un refuge pour animaux depuis un an. J’y vais le samedi matin et j’adore ça. D’un côté, le bénévolat est une expérience géniale: on aide les autres, on rencontre des gens et on se sent utile. De l’autre, s’engager, c’est un choix personnel. Si on oblige les jeunes, ils ne seront pas vraiment motivés. À mon avis, il faudrait plutôt présenter les associations dans les écoles. Comme ça, chacun peut trouver un engagement qui lui plaît. Et vous, vous êtes bénévoles?",
        criteria: ["Wortschatz zu Engagement ist passend verwendet.", "Die Meinung ist begründet und wägt ab.", "Ton und Form passen zu einem Forumsbeitrag."],
      },
    },
  },
  {
    id: "fr-wortschatz-berufswunsch",
    lb: 3,
    unit: "1.2.1",
    covers: ["1.2.1.3"],
    title: "Eigener Wortschatz: Berufswünsche und Interessen",
    intro:
      "Für deinen Wunschberuf und deine Interessen brauchst du eigene Wörter. Du suchst sie gezielt und baust dir eine persönliche Liste.",
    paragraphs: [
      "Kein Lehrbuch enthält alle Wörter, die **du** brauchst. Wenn du über deinen Berufswunsch, dein Hobby oder deinen Lieblingsstar sprichst, brauchst du **individuellen Wortschatz**. Lege dir eine persönliche Liste an: zuerst die Berufsbezeichnung (männlich und weiblich), dann typische Tätigkeiten, Orte und Eigenschaften.",
      "**Berufsbezeichnungen** haben oft eine männliche und eine weibliche Form: un infirmier / une infirmière (Pfleger/in), un vendeur / une vendeuse (Verkäufer/in), un électricien / une électricienne, un acteur / une actrice, un mécanicien / une mécanicienne. Einige sind gleich: un / une architecte, un / une journaliste, un / une photographe. Nach être steht der Beruf **ohne Artikel**: « Ma mère est infirmière. », « Je voudrais devenir électricien. »",
      "Zu jedem Beruf gehören **Tätigkeiten und Orte**: travailler dans un atelier, dans un hôpital, dans un bureau, en plein air; réparer, soigner, conseiller, vendre, construire. Und **Eigenschaften**: être patient(e), habile de ses mains (geschickt), créatif/créative, à l’écoute (ein offenes Ohr haben). Für **Interessen** brauchst du Wörter für dein Hobby: jouer de la guitare, faire du skate, le montage vidéo (Videoschnitt), un fan de, une chanteuse que j’admire.",
      "Neue Wörter findest du im zweisprachigen Wörterbuch, auf französischen Seiten zur Berufsorientierung wie Onisep oder in Interviews mit deinem Star. Prüfe Genus und Aussprache und schreibe einen Beispielsatz dazu. Typische Fehler: « Je suis un infirmier » (ohne un), « Je veux devenir une actrice » (ohne une) und das deutsche Wort einfach französisch auszusprechen.",
    ],
    terms: [
      { term: "individueller Wortschatz", text: "Wörter, die du für deine eigenen Themen brauchst: Wunschberuf, Hobby, Lieblingsstar." },
      { term: "Beruf ohne Artikel", text: "Nach être und devenir steht der Beruf ohne Artikel: « Il est boulanger. », « Je veux devenir infirmière. »" },
      { term: "männliche und weibliche Form", text: "Viele Berufe haben zwei Formen: vendeur/vendeuse, acteur/actrice, infirmier/infirmière." },
    ],
    takeaway:
      "Baue dir eine persönliche Liste: Beruf (männlich und weiblich), Tätigkeiten, Orte, Eigenschaften, Wörter zu Hobbys. Nach être und devenir steht der Beruf ohne Artikel. Neue Wörter mit Genus, Aussprache und Beispielsatz notieren.",
    sourceIds: ["lp", "onisep", "larousse"],
    quiz: {
      question: "Wie sagst du: „Ich möchte Krankenpflegerin werden“?",
      answer: "Je voudrais devenir infirmière.",
      wrong: ["Je voudrais devenir une infirmière.", "Je voudrais devenir infirmier."],
      explanation:
        "Nach devenir steht der Beruf ohne Artikel. Eine Frau spricht von sich mit der weiblichen Form infirmière.",
    },
    workshop: {
      kind: "classify",
      title: "Eine persönliche Wortliste ordnen",
      instruction: "Ordne die Wörter für den Beruf „Mechatroniker/in“ der passenden Spalte deiner Liste zu.",
      categories: ["Tätigkeit", "Ort", "Eigenschaft"],
      entries: [
        { text: "réparer des machines et contrôler des systèmes électroniques", target: 0, feedback: "Reparieren und kontrollieren sind Tätigkeiten." },
        { text: "dans un atelier ou directement chez le client dans une usine", target: 1, feedback: "Werkstatt und Fabrik sind Arbeitsorte." },
        { text: "être habile de ses mains et aimer la technique moderne", target: 2, feedback: "Geschickt sein und Technik mögen sind Eigenschaften." },
        { text: "installer de nouveaux appareils et les programmer correctement", target: 0, feedback: "Installieren und programmieren sind Tätigkeiten." },
        { text: "être précis, patient et capable de travailler en équipe", target: 2, feedback: "Genau, geduldig und teamfähig: Eigenschaften." },
        { text: "dans une grande entreprise industrielle près de Munich", target: 1, feedback: "Ein Unternehmen bei München ist ein Ort." },
      ],
      conclusion: "Tätigkeiten, Orte und Eigenschaften: Mit diesen drei Spalten wird aus einem Berufswunsch ein Thema, über das du sprechen kannst.",
    },
    casework: {
      title: "Ein Interview über Berufswünsche",
      story:
        "Eine französische Schülerzeitung fragt dich: « Qu’est-ce que tu voudrais faire plus tard? » Du möchtest Tierpfleger oder Tierpflegerin werden, das Wort kennst du noch nicht.",
      steps: [
        {
          question: "Wie findest du das Wort am zuverlässigsten?",
          options: ["Im zweisprachigen Wörterbuch, dann Beispiele prüfen.", "Das deutsche Wort einfach französisch aussprechen.", "Einfach das englische Wort nehmen."],
          answer: 0,
          explanation: "Im Wörterbuch findest du soigneur/soigneuse animalier/animalière und prüfst es an Beispielen. Deutsch oder Englisch helfen hier nicht sicher.",
        },
        {
          question: "Welcher Satz ist richtig?",
          options: ["Je voudrais devenir soigneur animalier.", "Je voudrais devenir un soigneur animalier.", "Je voudrais être un soigneur d’animaux."],
          answer: 0,
          explanation: "Nach devenir steht der Beruf ohne Artikel.",
        },
        {
          question: "Was ergänzt du, um die Antwort persönlicher zu machen?",
          options: ["Tätigkeiten und warum der Beruf zu dir passt.", "Eine Liste aller Tiere, die es auf der Welt gibt.", "Das Gehalt aller Tierpfleger in Frankreich."],
          answer: 0,
          explanation: "Tätigkeiten (nourrir, soigner les animaux) und eigene Eigenschaften machen die Antwort persönlich und interessant.",
        },
      ],
      verdict:
        "Wort nachschlagen und prüfen, ohne Artikel nach devenir verwenden und mit Tätigkeiten und Eigenschaften ergänzen: So sprichst du über deinen eigenen Berufswunsch.",
    },
    tasks: {
      1: {
        prompt:
          "Lege eine persönliche Wortliste zu deinem Wunschberuf oder Hobby an: die Bezeichnung (männlich und weiblich, falls möglich), drei Tätigkeiten, ein Ort, zwei Eigenschaften, je mit Artikel oder Infinitiv.",
        hints: ["Verben notierst du im Infinitiv, Nomen mit Artikel.", "Prüfe im Wörterbuch das Genus."],
        model:
          "Beruf: un électricien / une électricienne. Tätigkeiten: installer des câbles, réparer une panne, contrôler une installation. Ort: sur un chantier (Baustelle). Eigenschaften: être prudent(e), être habile de ses mains.",
        criteria: ["Die Liste enthält alle verlangten Teile.", "Nomen stehen mit Artikel, Verben im Infinitiv.", "Die Wörter passen zum gewählten Beruf oder Hobby."],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Text (acht Sätze) für eine französische Schülerzeitung: Welchen Beruf möchtest du später ausüben, was macht man dort, warum passt er zu dir? Verwende mindestens sechs Wörter aus deiner persönlichen Liste.",
        hints: ["Beginne mit Plus tard, je voudrais devenir …", "Nenne Tätigkeiten, Ort, Eigenschaften und einen Grund."],
        model:
          "Plus tard, je voudrais devenir pâtissière. Une pâtissière prépare des gâteaux, des tartes et des desserts. Elle travaille dans une pâtisserie ou dans la cuisine d’un restaurant. Il faut se lever très tôt, parfois à quatre heures du matin. Pour ce métier, on doit être créatif, précis et patient. Moi, j’adore décorer des gâteaux pour ma famille. L’année dernière, j’ai fait un stage dans une pâtisserie et j’ai appris à faire des macarons. Après la Realschule, je vais commencer un apprentissage.",
        criteria: ["Mindestens sechs eigene Wörter sind richtig verwendet.", "Tätigkeiten, Ort, Eigenschaften und Grund sind enthalten.", "Der Beruf steht nach être oder devenir ohne Artikel."],
      },
    },
  },
];
