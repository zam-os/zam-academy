import type { Lesson } from "../model/types";

/**
 * Stufe 2, erster Teil: Grammatik, Personen, Gegenstände, Orte und Sachverhalte beschreiben
 * (Kompetenzerwartung 1.2.2.1): Relativsatz, Steigerung der Adjektive, Verneinung mit
 * personne ne und rien ne, Artikel mit Ländernamen.
 */
export const S2A: Lesson[] = [
  {
    id: "fr-relatif-qui-que",
    lb: 2,
    unit: "1.2.2",
    covers: ["1.2.2.1"],
    title: "Relativsätze mit qui und que",
    intro:
      "Mit qui und que fügst du zu einem Nomen eine Beschreibung hinzu. Welches Wort du brauchst, hängt von der Aufgabe im Relativsatz ab.",
    paragraphs: [
      "Ein Relativsatz ergänzt ein Nomen und spart eine Wiederholung. Aus « J’ai un ami. Cet ami habite à Lyon. » wird « J’ai un ami qui habite à Lyon. » Das Relativpronomen steht direkt hinter dem Nomen, auf das es sich bezieht. Dieses Nomen heißt Bezugswort. Anders als im Deutschen (der, die, das) verändern sich qui und que nie nach Geschlecht oder Zahl des Bezugsworts.",
      "Welches der beiden Wörter du brauchst, entscheidet die Aufgabe des Bezugsworts im Relativsatz. **qui** steht, wenn das Bezugswort das Subjekt des Relativsatzes ist. Danach folgt sofort das Verb: « la fille qui parle » (la fille parle). **que** steht, wenn das Bezugswort das direkte Objekt ist. Danach folgt ein neues Subjekt: « le film que je regarde » (je regarde le film).",
      "Eine einfache Probe hilft: Setze das Bezugswort in den Relativsatz zurück. Ist es dort das Subjekt, wähle qui. Ist es das direkte Objekt, wähle que. Merke dir auch: Nach qui steht ein Verb, nach que ein Subjekt, also ein Pronomen oder ein Nomen. Vor einem Vokal wird que zu qu’ (« le livre qu’elle lit »), qui bleibt dagegen immer qui.",
      "Typische Fehler entstehen durch den Vergleich mit dem Deutschen. « Le garçon que parle anglais » ist falsch, denn le garçon ist Subjekt von parle. Richtig ist « Le garçon qui parle anglais ». Auch « Le film qui j’ai vu » ist falsch, denn le film ist das Objekt von j’ai vu. Richtig ist « Le film que j’ai vu ».",
    ],
    terms: [
      { term: "Bezugswort (antécédent)", text: "Das Nomen, auf das sich der Relativsatz bezieht und das er genauer beschreibt." },
      { term: "qui", text: "Relativpronomen für das Subjekt. Direkt danach steht das Verb des Relativsatzes." },
      { term: "que, qu’", text: "Relativpronomen für das direkte Objekt. Danach folgt ein Subjekt und dann das Verb; vor einem Vokal wird es zu qu’." },
    ],
    examples: [
      {
        title: "Zwei Relativsätze in einer Nachricht (eigens verfasst)",
        text: "J’ai une copine qui habite à Nice. Elle m’a envoyé les photos que nous avons prises pendant les vacances.",
        analysis:
          "Das erste Bezugswort une copine ist Subjekt von habite, deshalb **qui**. Im zweiten Satz ist les photos das direkte Objekt von nous avons prises, deshalb **que**. Zwischen que und dem Verb steht das Subjekt nous.",
      },
    ],
    takeaway:
      "Setze das Bezugswort in den Relativsatz zurück: Ist es dort Subjekt, nimmst du qui, ist es direktes Objekt, nimmst du que. Nach qui folgt ein Verb, nach que ein Subjekt. Vor einem Vokal wird que zu qu’; qui bleibt immer qui.",
    sourceIds: ["lp", "larousse"],
    quiz: {
      question: "Welcher Satz ist richtig?",
      answer: "Voilà le garçon que j’ai rencontré hier.",
      wrong: ["Voilà le garçon qui j’ai rencontré hier.", "Voilà le garçon que a rencontré Marie hier."],
      explanation:
        "Le garçon ist das direkte Objekt von j’ai rencontré, danach steht das Subjekt j’. Im zweiten Satz folgt auf qui das Subjekt j’, im dritten steht que direkt vor einem Verb.",
    },
    workshop: {
      kind: "choose",
      title: "qui oder que?",
      instruction:
        "Setze das Bezugswort in Gedanken in den Relativsatz zurück. Ist es dort Subjekt, wählst du qui, ist es direktes Objekt, wählst du que oder qu’.",
      items: [
        { before: "C’est le prof ", options: ["qui", "que"], answer: 0, after: " enseigne l’espagnol.", feedback: "Le prof enseigne l’espagnol: Das Bezugswort ist Subjekt des Relativsatzes, also qui." },
        { before: "Où est le livre ", options: ["qui", "que"], answer: 1, after: " tu lis?", feedback: "Tu lis le livre: Das Bezugswort ist direktes Objekt und danach steht das Subjekt tu, also que." },
        { before: "J’aime les chansons ", options: ["qui", "que"], answer: 0, after: " passent à la radio.", feedback: "Les chansons passent à la radio: Das Bezugswort ist Subjekt, danach folgt das Verb passent, also qui." },
        { before: "La pizza ", options: ["qu’", "qui"], answer: 0, after: "elle a commandée est énorme.", feedback: "Elle a commandé la pizza: Das Bezugswort ist Objekt, danach steht das Subjekt elle. Vor einem Vokal wird que zu qu’." },
        { before: "Ce sont les amis ", options: ["que", "qui"], answer: 1, after: " viennent samedi.", feedback: "Les amis viennent samedi: Das Bezugswort ist Subjekt von viennent, also qui." },
      ],
      conclusion:
        "Nach qui steht ein Verb, nach que ein Subjekt. Die Probe mit dem Rücksetzen des Bezugsworts löst jede Lücke.",
    },
    casework: {
      title: "Eine Nachricht aus Lyon",
      story:
        "Dein Austauschpartner Louis schreibt dir: « J’ai un frère qui joue au foot. Il a un copain que tu connais déjà. Voilà la photo que j’ai faite hier. »",
      steps: [
        {
          question: "Warum steht im ersten Satz qui?",
          options: [
            "Un frère ist das Subjekt von joue.",
            "Un frère ist das direkte Objekt von joue.",
            "Weil das Bezugswort männlich ist.",
          ],
          answer: 0,
          explanation: "Le frère joue au foot: Das Bezugswort ist Subjekt. Das Geschlecht des Bezugsworts spielt bei qui und que keine Rolle.",
        },
        {
          question: "Warum steht im zweiten Satz que und kein qui?",
          options: [
            "Un copain ist das Objekt von connais.",
            "Weil davor ein Vokal steht.",
            "Un copain ist das Subjekt von connais.",
          ],
          answer: 0,
          explanation: "Tu connais un copain: Das Bezugswort ist Objekt, danach folgt das Subjekt tu. Das Vokal-Argument gilt nur für die Schreibung qu’ und nicht für die Wahl zwischen qui und que.",
        },
        {
          question: "Wie schreibst du « le sac » + « tu as acheté le sac » richtig?",
          options: ["le sac que tu as acheté", "le sac qui tu as acheté", "le sac qu’tu as acheté"],
          answer: 0,
          explanation: "Le sac ist Objekt, danach folgt das Subjekt tu. Vor tu steht kein Vokal, deshalb bleibt que unverkürzt.",
        },
      ],
      verdict:
        "Louis nutzt qui für das Subjekt und que für das Objekt. Du erkennst das daran, was nach dem Pronomen folgt: ein Verb oder ein Subjekt.",
    },
    tasks: {
      1: {
        prompt:
          "Verbinde die Sätze mit qui oder que: 1. J’ai une copine. Elle habite à Nice. 2. Voilà le sac. J’ai acheté ce sac. 3. Tu connais le garçon? Il joue au tennis.",
        hints: [
          "Prüfe jedes Mal: Ist das Bezugswort im zweiten Satz Subjekt oder Objekt?",
          "Streiche im zweiten Satz das wiederholte Nomen oder Pronomen weg und setze qui oder que an die Stelle.",
        ],
        model:
          "1. J’ai une copine qui habite à Nice. 2. Voilà le sac que j’ai acheté. 3. Tu connais le garçon qui joue au tennis? Im ersten und dritten Satz ist das Bezugswort Subjekt (elle, il), deshalb qui. Im zweiten Satz ist le sac das Objekt von j’ai acheté, deshalb que, mit dem Subjekt j’ danach.",
        criteria: [
          "Jeder Relativsatz beginnt mit dem passenden Pronomen.",
          "Das doppelte Nomen oder Pronomen wurde weggelassen.",
          "Die Wortstellung nach que (Subjekt vor Verb) ist richtig.",
        ],
      },
      2: {
        prompt:
          "Beschreibe in vier bis fünf Sätzen eine Freundin oder einen Freund. Verwende mindestens einmal qui und einmal que, zum Beispiel für Hobbys, Musik oder Orte.",
        hints: [
          "Beginne mit « J’ai un ami / une amie qui … » und füge dann etwas hinzu, das du über die Person weißt.",
          "Für que brauchst du ein Objekt: ein Lied, ein Spiel oder ein Buch, das die Person mag oder das ihr gemeinsam kennt.",
        ],
        model:
          "J’ai une amie qui s’appelle Lea. Elle habite près de chez moi et elle joue de la guitare. Elle écoute souvent la musique que j’aime aussi. Voilà aussi le film que nous regardons ensemble le samedi. Avec Lea, il y a toujours quelque chose qui est amusant.",
        criteria: [
          "Mindestens ein Relativsatz mit qui und einer mit que, jeweils korrekt.",
          "Nach qui steht ein Verb, nach que ein Subjekt.",
          "Der Text beschreibt die Person verständlich und ist in sich stimmig.",
        ],
      },
    },
    practice: {
      kind: "choose",
      title: "qui oder que? Übungsrunde",
      instruction:
        "Wähle für jeden Satz das richtige Relativpronomen. Eine Runde zählt, wenn alle drei richtig sind.",
      pool: {
        1: [
          { before: "J’ai une amie ", options: ["qui", "que"], answer: 0, after: " parle français.", feedback: "Une amie ist Subjekt von parle, also qui." },
          { before: "Voilà le livre ", options: ["que", "qui"], answer: 0, after: " j’aime.", feedback: "Le livre ist Objekt von j’aime, danach steht das Subjekt j’, also que." },
          { before: "C’est la fille ", options: ["qui", "que"], answer: 0, after: " chante bien.", feedback: "La fille chante: Das Bezugswort ist Subjekt, also qui." },
          { before: "Tu vois le chat ", options: ["que", "qui"], answer: 0, after: " je cherche?", feedback: "Je cherche le chat: Das Bezugswort ist Objekt, danach steht je, also que." },
          { before: "Voici le prof ", options: ["qui", "que"], answer: 0, after: " aide tout le monde.", feedback: "Le prof aide: Das Bezugswort ist Subjekt von aide, also qui." },
          { before: "Où est le stylo ", options: ["que", "qui"], answer: 0, after: " tu as pris?", feedback: "Tu as pris le stylo: Das Bezugswort ist Objekt, danach steht tu, also que." },
          { before: "J’ai un frère ", options: ["qui", "que"], answer: 0, after: " étudie à Paris.", feedback: "Un frère étudie: Das Bezugswort ist Subjekt, also qui." },
          { before: "La robe ", options: ["que", "qui"], answer: 0, after: " tu portes est belle.", feedback: "Tu portes la robe: Das Bezugswort ist Objekt und danach folgt tu, also que." },
        ],
        2: [
          { before: "Le film ", options: ["que", "qui"], answer: 0, after: " nous avons regardé hier soir était très long.", feedback: "Nous avons regardé le film: Das Bezugswort ist direktes Objekt, danach folgt das Subjekt nous, also que." },
          { before: "Mon voisin, ", options: ["qui", "que"], answer: 0, after: " travaille dans une banque, part tôt le matin.", feedback: "Mon voisin travaille dans une banque: Das Bezugswort ist Subjekt, also qui." },
          { before: "Les photos ", options: ["qu’", "qui"], answer: 0, after: "elle a postées sur Internet sont superbes.", feedback: "Elle a posté les photos: Das Bezugswort ist Objekt, danach steht elle. Vor einem Vokal wird que zu qu’." },
          { before: "C’est une ville ", options: ["qui", "que"], answer: 0, after: " attire beaucoup de touristes chaque été.", feedback: "Une ville attire des touristes: Das Bezugswort ist Subjekt von attire, also qui." },
          { before: "Voilà le cadeau ", options: ["que", "qui"], answer: 0, after: " mes parents m’ont offert pour mon anniversaire.", feedback: "Mes parents m’ont offert le cadeau: Das Bezugswort ist Objekt, danach steht das Subjekt mes parents, also que." },
          { before: "Les élèves ", options: ["qui", "que"], answer: 0, after: " arrivent en retard doivent passer par le secrétariat.", feedback: "Les élèves arrivent en retard: Das Bezugswort ist Subjekt von arrivent, also qui." },
          { before: "La chanson ", options: ["qu’", "qui"], answer: 0, after: "il chante en ce moment est très célèbre.", feedback: "Il chante la chanson: Das Bezugswort ist Objekt, danach steht il. Vor einem Vokal wird que zu qu’." },
          { before: "J’ai perdu le portable ", options: ["que", "qui"], answer: 0, after: " ma tante m’a offert pour Noël.", feedback: "Ma tante m’a offert le portable: Das Bezugswort ist Objekt, danach steht das Subjekt ma tante, also que." },
        ],
      },
    },
  },
];
