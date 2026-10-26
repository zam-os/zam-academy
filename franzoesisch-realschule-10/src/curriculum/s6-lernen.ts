import type { Lesson } from "../model/types";

/**
 * Stufe 6: Methodische Kompetenzen (Kompetenzerwartungen 4.1 bis 4.6): Wortschatz mit Vokabelnetzen
 * festigen, Sprachen vergleichen (zum Beispiel Adjektiv und Adverb), Strategien für Verstehen und
 * Sprachproduktion, Hilfsmittel zur Prüfungsvorbereitung, Quellen zur Informationsbeschaffung und
 * Fehlerprotokolle mit fiches d’écriture.
 */
export const S6: Lesson[] = [
  {
    id: "fr-vokabelnetze",
    lb: 6,
    unit: "4",
    covers: ["4.1"],
    title: "Wortschatz nachhaltig festigen: Vokabelnetze",
    intro:
      "Wörter bleiben, wenn du sie vernetzt: nach Thema, Wortfamilie und Gegenteil, mit Beispielsätzen und regelmäßiger Wiederholung.",
    paragraphs: [
      "Etwa 600 neue Wörter und Wendungen kommen in Klasse 10 dazu. Einzelne Vokabeln vergisst man schnell; **vernetzte** Wörter bleiben. Ein **Vokabelnetz** (une carte mentale, un réseau de mots) ordnet Wörter um ein Thema: In der Mitte steht zum Beispiel « l’environnement », drumherum Äste für Probleme (la pollution, les déchets), Lösungen (recycler, économiser) und Akteure (une association, les citoyens).",
      "Netze werden **detaillierter**, wenn du verschiedene Verbindungen nutzt: **Wortfamilien** (protéger, la protection, protecteur), **Synonyme und Gegenteile** (polluer ↔ protéger), **Kollokationen**, also Wörter, die oft zusammen vorkommen (trier les déchets, faire du bénévolat, poser sa candidature), und **Beispielsätze**. Je mehr Verbindungen, desto leichter findest du ein Wort wieder.",
      "Wähle die Methode, die zu **deinem Lerntyp** passt: Netze zeichnen, Karteikarten oder eine App mit Wiederholung in Abständen, Wörter laut sprechen, Sätze schreiben, Zettel in der Wohnung aufhängen. Wichtig ist das **Wiederholen in wachsenden Abständen**: nach einem Tag, nach drei Tagen, nach einer Woche, nach einem Monat. Genau das macht auch ZAM mit den Karten zu dieser App.",
      "Typische Fehler: Wörter ohne Artikel lernen (dann weißt du das Genus nicht), nur Deutsch → Französisch üben und nicht umgekehrt, alles am Vorabend lernen oder Listen ohne Zusammenhang. Lerne Nomen mit Artikel, Verben mit ihrer Ergänzung (aider qn, téléphoner à qn) und jedes Wort mit einem Satz.",
    ],
    terms: [
      { term: "Vokabelnetz", text: "Eine Darstellung, die Wörter um ein Thema ordnet und miteinander verbindet (carte mentale)." },
      { term: "Kollokation", text: "Wörter, die oft zusammen vorkommen: trier les déchets, poser sa candidature, faire du bénévolat." },
      { term: "Wiederholen in Abständen", text: "Wörter nach wachsenden Pausen wiederholen: nach einem Tag, drei Tagen, einer Woche, einem Monat." },
    ],
    takeaway:
      "Wörter vernetzen: nach Thema, Wortfamilie, Synonym und Gegenteil, Kollokation und Beispielsatz. Nomen mit Artikel, Verben mit Ergänzung lernen. Methode nach Lerntyp wählen und in wachsenden Abständen wiederholen.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Was ist eine Kollokation?",
      answer: "Wörter, die oft zusammen vorkommen.",
      wrong: ["Ein Wort mit gegenteiliger Bedeutung.", "Eine Liste von Wörtern ohne jede Ordnung."],
      explanation:
        "Kollokationen sind feste Paare wie trier les déchets. Sie helfen, Wörter richtig zu verwenden.",
    },
    workshop: {
      kind: "classify",
      title: "Ein Vokabelnetz zum Thema Arbeit ordnen",
      instruction: "Ordne jeden Eintrag dem Ast des Netzes zu, zu dem er gehört.",
      categories: ["Wortfamilie travailler", "Kollokation", "Gegenteil"],
      entries: [
        { text: "le travailleur, la travailleuse: une personne qui travaille", target: 0, feedback: "Travailleur gehört zur Wortfamilie von travailler." },
        { text: "poser sa candidature pour un poste dans une entreprise", target: 1, feedback: "Poser sa candidature ist eine feste Verbindung: sich bewerben." },
        { text: "être au chômage, c’est le contraire d’avoir un emploi", target: 2, feedback: "Arbeitslos sein ist das Gegenteil von einen Job haben." },
        { text: "travailleur comme adjectif: une élève travailleuse et sérieuse", target: 0, feedback: "Auch das Adjektiv travailleur (fleißig) gehört zur Wortfamilie." },
        { text: "faire un stage de trois semaines dans un hôtel", target: 1, feedback: "Faire un stage ist eine typische Verbindung: ein Praktikum machen." },
        { text: "paresseux, le contraire de travailleur et de motivé", target: 2, feedback: "Paresseux (faul) ist das Gegenteil von travailleur." },
      ],
      conclusion: "Wortfamilie, Kollokationen und Gegenteile machen aus einer Liste ein Netz, in dem du Wörter schnell wiederfindest.",
    },
    casework: {
      title: "Lernen vor der Prüfung",
      story:
        "Lukas hat noch drei Wochen bis zur Prüfung. Er schreibt sich jeden Abend 50 Wörter ohne Artikel auf eine Liste und lernt sie nur Deutsch → Französisch. In Tests vergisst er viele wieder.",
      steps: [
        {
          question: "Was sollte Lukas bei Nomen ändern?",
          options: ["Er lernt sie mit Artikel.", "Er lernt nur noch Verben.", "Er lernt sie nur auf Englisch."],
          answer: 0,
          explanation: "Mit Artikel weiß er das Genus, das er für Adjektive und Pronomen braucht.",
        },
        {
          question: "Wie kann er die Wörter besser behalten?",
          options: ["Er wiederholt sie in wachsenden Abständen.", "Er lernt alle am Abend vor der Prüfung.", "Er schreibt jedes Wort zwanzigmal ab."],
          answer: 0,
          explanation: "Wiederholen nach einem Tag, drei Tagen und einer Woche festigt Wörter dauerhaft.",
        },
        {
          question: "Was hilft ihm, Wörter in der Prüfung richtig zu verwenden?",
          options: ["Ein Beispielsatz zu jedem Wort.", "Eine noch längere Liste von Wörtern.", "Wörter nur einmal laut vorlesen."],
          answer: 0,
          explanation: "Ein Satz zeigt die Verwendung: Ergänzungen, Präpositionen, typische Verbindungen.",
        },
      ],
      verdict:
        "Mit Artikel, in wachsenden Abständen und mit Beispielsätzen: So bleiben Lukas’ Wörter bis zur Prüfung und darüber hinaus.",
    },
    tasks: {
      1: {
        prompt:
          "Erstelle ein kleines Vokabelnetz zum Thema « le bénévolat »: Notiere drei Äste (zum Beispiel Personen, Tätigkeiten, Orte) mit je drei Einträgen, Nomen mit Artikel, Verben mit Ergänzung.",
        hints: ["Personen: un bénévole …; Tätigkeiten: aider qn …; Orte: une association …", "Ergänze eine Kollokation."],
        model:
          "Personen: un(e) bénévole, une personne âgée, un(e) sans-abri. Tätigkeiten: aider qn, collecter des dons, distribuer des repas. Orte: une association, une maison de retraite, un refuge pour animaux. Kollokation: faire du bénévolat.",
        criteria: ["Drei Äste mit je drei Einträgen liegen vor.", "Nomen stehen mit Artikel, Verben mit Ergänzung.", "Die Einträge passen zum Thema."],
      },
      2: {
        prompt:
          "Plane dein Wortschatzlernen für die nächsten vier Wochen bis zu einem Test: Welche Methode passt zu dir und warum? Wann wiederholst du? Wie prüfst du dich selbst? Schreibe sechs bis acht Sätze auf Deutsch.",
        hints: ["Denke an deinen Lerntyp: sehen, hören, schreiben, bewegen.", "Plane feste Wiederholungstermine."],
        model:
          "Ich lerne am besten, wenn ich Dinge sehe und aufschreibe. Deshalb zeichne ich für jedes Thema ein Vokabelnetz und schreibe zu jedem Wort einen Satz. Neue Wörter wiederhole ich am nächsten Tag, nach drei Tagen und nach einer Woche mit Karteikarten oder mit ZAM. Ich übe in beide Richtungen, also auch Französisch → Deutsch. Jeden Sonntag teste ich mich selbst mit zehn zufälligen Wörtern. Wörter, die ich nicht weiß, kommen in eine eigene Box, die ich öfter wiederhole. In der letzten Woche vor dem Test schreibe ich einen kurzen Text mit möglichst vielen neuen Wörtern.",
        criteria: ["Die Methode ist begründet.", "Die Wiederholung ist konkret geplant.", "Eine Selbstüberprüfung ist vorgesehen."],
      },
    },
  },
  {
    id: "fr-sprachvergleich",
    lb: 6,
    unit: "4",
    covers: ["4.2", "1.2.2.1"],
    title: "Sprachen vergleichen: Adjektiv und Adverb in Deutsch, Englisch, Französisch",
    intro:
      "Wo Deutsch eine Form hat, unterscheiden Englisch und Französisch zwei. Wer die Sprachen vergleicht, vermeidet typische Fehler.",
    paragraphs: [
      "Beim **Sprachvergleich** suchst du Gemeinsamkeiten und Unterschiede zwischen Sprachen, die du kennst, und nutzt sie für dein Lernen. Ein gutes Beispiel ist **Adjektiv und Adverb**. Im Deutschen sehen beide oft gleich aus: „Sie ist **schnell**.“ (Adjektiv) und „Sie läuft **schnell**.“ (Adverb). Im Englischen und Französischen unterscheiden sich die Formen.",
      "**Englisch**: Adjektiv quick, Adverb quick**ly**; good → well. **Französisch**: Adjektiv rapide, Adverb rapide**ment**; bon → bien, mauvais → mal. Die Endung -ly im Englischen entspricht also oft der Endung -ment im Französischen: slowly – lentement, really – vraiment, happily – heureusement. Auch die Ausnahmen ähneln sich: good/well wie bon/bien.",
      "Ein zweiter Unterschied: Im Französischen wird das **Adjektiv angeglichen** (une voiture rapide, des voitures rapides), das Adverb nie. Im Englischen wird auch das Adjektiv nicht angeglichen. Im Deutschen wird das Adjektiv nur vor dem Nomen gebeugt („ein schnelles Auto“), nach „sein“ nicht („das Auto ist schnell“). Solche Regeln findest du selbstständig, wenn du Beispielsätze nebeneinanderstellst.",
      "Der Vergleich hilft auch bei anderen Themen: **Wortschatz** (environment – environnement – Umwelt), **Wortstellung** (Französisch und Englisch stellen das Verb nicht ans Ende) und **falsche Freunde** (actually ≠ aktuell, actuellement ≠ aktuell). Typische Fehler aus dem Deutschen: « Il parle bon » statt bien, « Elle conduit rapide » statt rapidement.",
    ],
    terms: [
      { term: "Sprachvergleich", text: "Gemeinsamkeiten und Unterschiede zwischen Sprachen suchen und für das Lernen nutzen." },
      { term: "-ly und -ment", text: "Die typischen Adverbendungen im Englischen und Französischen: slowly – lentement." },
      { term: "good/well – bon/bien", text: "Die unregelmäßigen Paare von Adjektiv und Adverb sind im Englischen und Französischen ähnlich." },
    ],
    takeaway:
      "Deutsch hat oft eine Form für Adjektiv und Adverb, Englisch und Französisch zwei: quick/quickly, rapide/rapidement; good/well, bon/bien. -ly entspricht oft -ment. Französisch gleicht das Adjektiv an, nie das Adverb.",
    sourceIds: ["lp", "lingolia"],
    quiz: {
      question: "Welches französische Wort entspricht dem englischen « well » in « She sings well »?",
      answer: "bien",
      wrong: ["bon", "bonne"],
      explanation:
        "Well ist das Adverb zu good, bien das Adverb zu bon. Bon und bonne sind Adjektive.",
    },
    workshop: {
      kind: "choose",
      title: "Mit dem Englischen vergleichen",
      instruction: "Der englische Satz zeigt dir, ob ein Adjektiv oder ein Adverb gebraucht wird. Wähle die passende französische Form.",
      items: [
        { before: "He drives carefully. → Il conduit ", options: ["prudemment", "prudent", "prudente"], answer: 0, after: ".", feedback: "Carefully ist ein Adverb (-ly), also auch im Französischen ein Adverb: prudemment." },
        { before: "She is careful. → Elle est ", options: ["prudente", "prudemment", "prudent"], answer: 0, after: ".", feedback: "Careful ist ein Adjektiv nach be; im Französischen wird es angeglichen: prudente." },
        { before: "They play well. → Ils jouent ", options: ["bien", "bons", "bon"], answer: 0, after: ".", feedback: "Well ist das Adverb zu good, also bien." },
        { before: "It is a good idea. → C’est une ", options: ["bonne", "bien", "bon"], answer: 0, after: " idée.", feedback: "Good ist hier Adjektiv vor einem Nomen: bonne, angeglichen an idée." },
        { before: "He answered politely. → Il a répondu ", options: ["poliment", "poli", "polie"], answer: 0, after: ".", feedback: "Politely ist ein Adverb, also poliment." },
      ],
      conclusion: "Wo das Englische -ly oder well hat, steht im Französischen meist -ment oder bien. Das Deutsche zeigt den Unterschied nicht.",
    },
    casework: {
      title: "Eine Regel selbst entdecken",
      story:
        "Du stellst Sätze nebeneinander: „Das Lied ist laut. – The song is loud. – La chanson est forte.“ und „Sie singt laut. – She sings loudly. – Elle chante fort.“",
      steps: [
        {
          question: "Was zeigt der Vergleich mit dem Englischen?",
          options: ["Im zweiten Satz ist „laut“ ein Adverb.", "„Laut“ ist in beiden Sätzen ein Adjektiv.", "Das Englische hat kein Adverb."],
          answer: 0,
          explanation: "Loudly mit -ly zeigt, dass „laut“ im zweiten Satz das Verb näher bestimmt.",
        },
        {
          question: "Warum steht im ersten französischen Satz « forte »?",
          options: ["Das Adjektiv wird an chanson angeglichen.", "Weil das Adverb im Französischen immer -e bekommt.", "Weil es ein englisches Wort ist."],
          answer: 0,
          explanation: "La chanson ist weiblich, das Adjektiv fort wird zu forte.",
        },
        {
          question: "Was fällt bei « Elle chante fort » auf?",
          options: ["Fort ist hier ein Adverb ohne -ment.", "Fort ist hier ein weibliches Adjektiv.", "Der Satz ist falsch, es muss fortement heißen."],
          answer: 0,
          explanation: "Bei einigen Verben steht das kurze Adjektiv als Adverb, unverändert: chanter fort, parler fort, coûter cher. Das ist eine Ausnahme.",
        },
      ],
      verdict:
        "Der Vergleich zeigt die Wortart, die Angleichung zeigt das Adjektiv, und chanter fort ist eine der wenigen Ausnahmen ohne -ment.",
    },
    tasks: {
      1: {
        prompt:
          "Übersetze ins Französische und erkläre mit dem Englischen, warum Adjektiv oder Adverb: 1. Der Test ist leicht. 2. Ich habe den Test leicht bestanden. 3. Sie spricht gut Englisch.",
        hints: ["Denke an easy/easily und good/well.", "Prüfe die Angleichung beim Adjektiv."],
        model:
          "1. Le test est facile. (easy: Adjektiv nach être) 2. J’ai réussi le test facilement. (easily: Adverb, es beschreibt das Bestehen) 3. Elle parle bien anglais. (well: Adverb zu good, also bien)",
        criteria: ["Die Übersetzungen sind richtig.", "Adjektiv und Adverb sind richtig unterschieden.", "Der Vergleich mit dem Englischen ist erklärt."],
      },
      2: {
        prompt:
          "Wähle ein anderes Grammatikthema (zum Beispiel Stellung des Adjektivs, Verneinung, Fragestellung oder das Passiv) und vergleiche Deutsch, Englisch und Französisch mit je zwei Beispielsätzen. Formuliere daraus eine Regel und einen Tipp für dein Lernen.",
        hints: ["Stelle die Sätze in einer kleinen Tabelle nebeneinander.", "Achte auf Gemeinsamkeiten zweier Sprachen gegen die dritte."],
        model:
          "Thema Passiv: Deutsch „Hier wird Französisch gesprochen“ – Englisch „French is spoken here“ – Französisch « Ici, on parle français ». Deutsch „Mir wurde geholfen“ – Englisch „I was helped“ – Französisch « On m’a aidé ». Regel: Deutsch und Englisch nutzen oft das Passiv, Französisch meist on mit einem aktiven Verb. Tipp: Wenn ich auf Deutsch ein Passiv denke, frage ich mich zuerst, ob ich auf Französisch on verwenden kann.",
        criteria: ["Drei Sprachen werden mit Beispielen verglichen.", "Eine richtige Regel ist abgeleitet.", "Ein nützlicher Lerntipp folgt aus dem Vergleich."],
      },
    },
  },
  {
    id: "fr-strategien",
    lb: 6,
    unit: "4",
    covers: ["4.3"],
    title: "Strategien für Verstehen, Sprechen und Schreiben",
    intro:
      "Vor, während und nach der Aufgabe: Mit festen Strategien gehst du Hör- und Lesetexte und eigene Texte selbstständig an.",
    paragraphs: [
      "Für jede Fertigkeit gibt es Strategien, die du **selbstständig** einsetzt, ohne dass jemand sie dir vorgibt. Beim **Hören und Lesen** gilt: vorher Aufgabe lesen und Erwartungen bilden, beim ersten Durchgang global verstehen, beim zweiten gezielt Details suchen, unbekannte Wörter erschließen oder überspringen, danach Antworten prüfen.",
      "Beim **Schreiben** gehst du in drei Schritten vor. **Planen**: Aufgabe in Teile zerlegen (Welche Punkte muss ich behandeln?), Ideen sammeln, Gliederung festlegen. **Schreiben**: Absätze mit je einem Gedanken, Strukturwörter, Wörter, die du sicher beherrschst. **Überarbeiten**: Inhalt prüfen (alle Punkte?), dann Sprache (Verben, Angleichung, Akzente). Plane dafür Zeit ein.",
      "Beim **Sprechen** hilft dir: Stichpunkte statt ganzer Sätze, Wendungen zum Zeitgewinnen (Alors…, Comment dire…, Bon, en fait…), Umschreiben, wenn ein Wort fehlt, und Nachfragen, wenn du etwas nicht verstanden hast. Lieber einfach und richtig als kompliziert und unverständlich.",
      "Eine wichtige **Prüfungsstrategie**: Zeit einteilen. Lies zuerst alle Aufgaben, beginne mit dem, was du sicher kannst, und lass keine Aufgabe ganz leer. Bei Schreibaufgaben zählen Inhalt (alle Punkte bearbeitet), Aufbau und Sprache. Typische Fehler: ohne Plan losschreiben, deutsche Sätze im Kopf Wort für Wort übersetzen und keine Zeit zum Korrekturlesen lassen.",
    ],
    terms: [
      { term: "Planen, Schreiben, Überarbeiten", text: "Die drei Schritte beim Verfassen eines Textes, jeder mit eigenen Fragen." },
      { term: "Zeitgewinn", text: "Wendungen, mit denen du beim Sprechen Zeit zum Nachdenken gewinnst: Alors…, Comment dire…, En fait…" },
      { term: "Zeiteinteilung", text: "In der Prüfung alle Aufgaben zuerst lesen, mit Sicherem beginnen und Zeit zum Korrigieren einplanen." },
    ],
    takeaway:
      "Hören/Lesen: Aufgabe zuerst, global, dann Details, danach prüfen. Schreiben: planen (Punkte, Gliederung), schreiben (Absätze, Strukturwörter), überarbeiten (Inhalt, dann Sprache). Sprechen: Stichpunkte, Zeitgewinn, Umschreiben. Prüfung: Zeit einteilen.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Was tust du beim Überarbeiten eines Textes zuerst?",
      answer: "Prüfen, ob alle Punkte der Aufgabe bearbeitet sind.",
      wrong: ["Jedes einzelne Wort im Wörterbuch nachschlagen.", "Den ganzen Text noch einmal von vorn neu schreiben."],
      explanation:
        "Zuerst prüfst du den Inhalt, dann die Sprache. Fehlt ein Punkt der Aufgabe, nützt die beste Grammatik wenig.",
    },
    workshop: {
      kind: "timeline",
      title: "Eine Schreibaufgabe Schritt für Schritt",
      instruction: "Bringe die Schritte für eine Schreibaufgabe in der Prüfung in eine sinnvolle Reihenfolge.",
      categories: [],
      entries: [
        { text: "Lire la consigne et souligner tous les points à traiter.", target: 0, feedback: "Zuerst die Aufgabe genau lesen und die Punkte markieren." },
        { text: "Noter des idées et des mots utiles pour chaque point.", target: 1, feedback: "Dann Ideen und Wörter sammeln." },
        { text: "Faire un plan: introduction, paragraphes, conclusion.", target: 2, feedback: "Eine Gliederung gibt dem Text Struktur." },
        { text: "Écrire le texte avec des mots de liaison.", target: 3, feedback: "Erst jetzt wird geschrieben, mit Strukturwörtern." },
        { text: "Relire: d’abord le contenu, ensuite les verbes et les accords.", target: 4, feedback: "Am Ende wird überarbeitet: Inhalt, dann Sprache." },
      ],
      conclusion: "Aufgabe lesen, sammeln, gliedern, schreiben, überarbeiten: Diese Reihenfolge spart Zeit und verhindert, dass ein Punkt fehlt.",
    },
    casework: {
      title: "Über ein Bild sprechen",
      story:
        "In einer mündlichen Leistungsfeststellung sollst du über ein Bild sprechen. Dir fällt das Wort für „Solaranlage“ nicht ein, und du brauchst einen Moment zum Nachdenken.",
      steps: [
        {
          question: "Wie gewinnst du Zeit, ohne zu schweigen?",
          options: ["Alors… comment dire…", "Ähm, also, wie heißt das?", "Ich schweige, bis es mir einfällt."],
          answer: 0,
          explanation: "Französische Füllwendungen geben dir Zeit und zeigen, dass du im Gespräch bleibst.",
        },
        {
          question: "Wie umschreibst du „Solaranlage“?",
          options: ["Des panneaux qui produisent de l’électricité avec le soleil.", "Une Solaranlage, vous savez, sur le toit de la maison.", "Je ne sais pas ce mot, désolé, on peut passer à autre chose?"],
          answer: 0,
          explanation: "Du erklärst, was das Ding tut. So versteht man dich, auch ohne das Fachwort (les panneaux solaires).",
        },
        {
          question: "Die Prüferin stellt eine Frage, die du nicht ganz verstehst. Was tust du?",
          options: ["Pardon, vous pouvez répéter?", "Ich antworte einfach irgendetwas.", "Ich wechsle das Thema."],
          answer: 0,
          explanation: "Nachfragen ist erlaubt und besser, als an der Frage vorbei zu antworten.",
        },
      ],
      verdict:
        "Zeit gewinnen, umschreiben und nachfragen: Mit diesen Strategien bleibst du auch in schwierigen Momenten im Gespräch.",
    },
    tasks: {
      1: {
        prompt:
          "Lies die Aufgabe und zerlege sie in die Punkte, die dein Text behandeln muss: « Tu as fait un stage dans une entreprise. Écris un article pour le journal de ton école: présente l’entreprise, décris une journée typique, raconte un moment difficile et donne ton avis sur cette expérience. »",
        hints: ["Suche die Verben der Aufgabe: présente, décris, raconte, donne.", "Notiere zu jedem Punkt die passende Zeit."],
        model:
          "1. Das Unternehmen vorstellen (Präsens). 2. Einen typischen Tag beschreiben (Präsens oder imparfait für Gewohnheiten). 3. Einen schwierigen Moment erzählen (passé composé und imparfait). 4. Meine Meinung zur Erfahrung geben (Präsens, Meinungswendungen). Dazu passt die Form eines Artikels mit Titel und Absätzen.",
        criteria: ["Alle vier Punkte sind erkannt.", "Zu jedem Punkt ist eine passende Zeit genannt.", "Die Textsorte ist berücksichtigt."],
      },
      2: {
        prompt:
          "Schreibe für dich eine persönliche Strategiekarte (fiche) für die Französischprüfung: je zwei bis drei Strategien für Hörverstehen, Leseverstehen, Schreiben und Sprechen sowie eine Regel zur Zeiteinteilung. Begründe eine Strategie, die dir besonders hilft.",
        hints: ["Formuliere kurz und konkret, als Liste.", "Denke an deine eigenen Schwächen."],
        model:
          "Hören: Aufgaben vorher lesen · erst global, dann Details · bei Zahlen genau hinhören. Lesen: überfliegen, dann gründlich · Belege genau abschreiben · unbekannte Wörter erschließen. Schreiben: Punkte der Aufgabe abhaken · Gliederung vorher · am Ende Verben und Akzente prüfen. Sprechen: Stichpunkte · Alors, comment dire · nachfragen. Zeit: alles zuerst lesen, mit Sicherem beginnen, zehn Minuten zum Korrigieren. Besonders hilft mir das Abhaken der Punkte, weil ich sonst oft einen Teil der Aufgabe vergesse.",
        criteria: ["Alle vier Fertigkeiten haben Strategien.", "Eine Regel zur Zeiteinteilung ist enthalten.", "Eine Strategie ist persönlich begründet."],
      },
    },
  },
  {
    id: "fr-pruefungsvorbereitung",
    lb: 6,
    unit: "4",
    covers: ["4.4"],
    title: "Hilfsmittel zum Lernen und Nachschlagen nutzen",
    intro:
      "Übungshefte, Grammatik, Wörterbücher und Apps helfen dir, wenn du sie gezielt einsetzt: zum Nachschlagen und zur Prüfungsvorbereitung.",
    paragraphs: [
      "Zur **Prüfungsvorbereitung** gibt es Übungshefte mit Aufgaben im Stil der Abschlussprüfung und Lösungen, oft mit Hörtexten zum Download. Sie zeigen dir, welche Aufgabentypen vorkommen, und lassen dich unter Zeitdruck üben. Arbeite sie nicht von vorn bis hinten durch, sondern **gezielt**: zuerst eine Probeprüfung, dann die Teile üben, die dir schwerfallen.",
      "Zum **Nachschlagen** nutzt du eine **Grammatik** (im Schulbuch oder als eigenes Heft), wenn du eine Regel klären willst, und ein **zweisprachiges Wörterbuch** für die Bedeutung eines Wortes. Im Wörterbuch liest du den ganzen Eintrag: Wortart, Genus (m./f.), mehrere Bedeutungen mit Beispielen, feste Wendungen. Die erste Bedeutung ist nicht immer die richtige: « la note » kann Note, Rechnung oder Notiz heißen.",
      "**Digitale Hilfsmittel** wie Online-Wörterbücher, Konjugationstabellen und Lern-Apps sind schnell und haben oft Hörproben. Übersetzungsprogramme liefern ganze Sätze, aber nicht immer richtige: Sie verwechseln tu und vous, übersehen den Zusammenhang und machen Fehler bei Wortspielen. Nutze sie zum Prüfen einzelner Wörter, nicht zum Schreiben ganzer Texte, die du selbst verfassen sollst.",
      "Prüfe, welche Hilfsmittel in deiner Prüfung **erlaubt** sind; das legt die Schule fest. Typische Fehler: im Wörterbuch nur die erste Bedeutung nehmen, Lösungen im Übungsheft vor dem eigenen Versuch anschauen, eine Übersetzung aus dem Internet ungeprüft übernehmen.",
    ],
    terms: [
      { term: "zweisprachiges Wörterbuch", text: "Ein Wörterbuch Deutsch–Französisch mit Wortart, Genus, Bedeutungen, Beispielen und Wendungen." },
      { term: "Übungsheft zur Prüfungsvorbereitung", text: "Ein Heft mit Aufgaben im Stil der Abschlussprüfung, Lösungen und oft Hörtexten." },
      { term: "Wörterbucheintrag", text: "Alle Angaben zu einem Wort: Wortart, Genus, Bedeutungen mit Beispielen, Wendungen." },
    ],
    takeaway:
      "Übungshefte gezielt nutzen (Probeprüfung, dann Schwächen üben), Grammatik für Regeln, zweisprachiges Wörterbuch mit ganzem Eintrag lesen, digitale Hilfen zum Prüfen einzelner Wörter, nicht zum Schreiben ganzer Texte. Erlaubte Hilfsmittel klären.",
    sourceIds: ["lp", "larousse"],
    quiz: {
      question: "Du schlägst « la note » nach. Was musst du tun?",
      answer: "Die Bedeutung wählen, die in den Satz passt.",
      wrong: ["Immer die erste Bedeutung im Eintrag nehmen.", "Das Wort ins Englische übersetzen lassen."],
      explanation:
        "La note kann Note, Rechnung oder Notiz heißen. Erst der Zusammenhang zeigt, welche Bedeutung passt.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Hilfsmittel passt?",
      instruction: "Ordne jede Situation dem Hilfsmittel zu, das am besten hilft.",
      categories: ["Grammatik", "Wörterbuch", "Übungsheft"],
      entries: [
        { text: "Du weißt nicht mehr, wann man nach si das imparfait verwendet.", target: 0, feedback: "Eine Regel klärst du in einer Grammatik." },
        { text: "Du suchst das französische Wort für „Ausbildungsvertrag“.", target: 1, feedback: "Ein Wort suchst du im zweisprachigen Wörterbuch." },
        { text: "Du willst eine Hörverstehensaufgabe im Stil der Prüfung üben.", target: 2, feedback: "Prüfungsnahe Aufgaben findest du im Übungsheft." },
        { text: "Du bist unsicher, ob « problème » männlich oder weiblich ist.", target: 1, feedback: "Das Genus steht im Wörterbucheintrag." },
        { text: "Du möchtest testen, wie lange du für eine Schreibaufgabe brauchst.", target: 2, feedback: "Eine Probeprüfung unter Zeitdruck bietet das Übungsheft." },
        { text: "Du fragst dich, wo die Objektpronomen im passé composé stehen.", target: 0, feedback: "Die Stellung der Pronomen erklärt die Grammatik." },
      ],
      conclusion: "Regeln in der Grammatik, Wörter und Genus im Wörterbuch, prüfungsnahe Aufgaben im Übungsheft: Jedes Hilfsmittel hat seine Aufgabe.",
    },
    casework: {
      title: "Ein Satz aus dem Übersetzungsprogramm",
      story:
        "Für eine E-Mail an deine Gastmutter lässt du „Kannst du mich vom Bahnhof abholen?“ übersetzen. Das Programm schlägt vor: « Pouvez-vous venir me chercher à la gare? »",
      steps: [
        {
          question: "Was solltest du an dem Vorschlag prüfen?",
          options: ["Ob tu oder vous zur Gastmutter passt.", "Ob das Programm kostenlos oder teuer war.", "Ob der Satz kurz genug für eine E-Mail ist."],
          answer: 0,
          explanation: "Übersetzungsprogramme wählen oft vous. Ob du deine Gastmutter duzt, weiß nur du.",
        },
        {
          question: "Sie hat dir das Du angeboten. Wie lautet der Satz dann?",
          options: ["Tu peux venir me chercher à la gare?", "Pouvez-tu venir me chercher à la gare?", "Peux-vous venir me chercher à la gare?"],
          answer: 0,
          explanation: "Mit tu heißt es tu peux. Die anderen mischen tu- und vous-Formen.",
        },
        {
          question: "Wie überprüfst du die Wendung « venir chercher »?",
          options: ["Im Wörterbuch unter chercher nachsehen.", "Gar nicht, das Programm hat immer recht.", "Ich frage eine Suchmaschine nach Bildern."],
          answer: 0,
          explanation: "Im Wörterbucheintrag von chercher findest du venir chercher qn: jemanden abholen.",
        },
      ],
      verdict:
        "Programm nutzen, aber prüfen: Anrede anpassen und die Wendung im Wörterbuch bestätigen. So wird der Satz richtig und passend.",
    },
    tasks: {
      1: {
        prompt:
          "Schlage in einem zweisprachigen Wörterbuch das Wort « le stage » nach und notiere: Wortart und Genus, zwei Bedeutungen, eine feste Wendung mit Beispielsatz.",
        hints: ["Lies den ganzen Eintrag, nicht nur die erste Zeile.", "Feste Wendungen stehen oft am Ende des Eintrags."],
        model:
          "Le stage: Nomen, männlich (m.). Bedeutungen: 1. Praktikum (faire un stage en entreprise), 2. Lehrgang, Kurs (un stage de voile = ein Segelkurs). Feste Wendung: effectuer un stage = ein Praktikum absolvieren; Beispiel: J’ai effectué un stage de deux semaines dans une banque.",
        criteria: ["Wortart und Genus sind richtig.", "Zwei verschiedene Bedeutungen sind genannt.", "Eine feste Wendung mit Beispiel ist notiert."],
      },
      2: {
        prompt:
          "Erstelle deinen Plan für die letzten sechs Wochen vor der Französischprüfung: Welche Hilfsmittel nutzt du wann und wofür? Schreibe sechs bis acht Sätze und nenne mindestens drei verschiedene Hilfsmittel.",
        hints: ["Beginne mit einer Probeprüfung, um deine Schwächen zu finden.", "Plane Wörterbuch- und Grammatikarbeit gezielt ein."],
        model:
          "In der ersten Woche mache ich eine vollständige Probeprüfung aus meinem Übungsheft unter echten Zeitbedingungen. Danach schaue ich, wo ich die meisten Punkte verloren habe. Weil ich bei der Mediation schwach bin, übe ich in den Wochen zwei bis vier jede Woche zwei Mediationsaufgaben aus dem Heft. Grammatikfehler, die ich dabei mache, kläre ich in der Grammatik im Schulbuch. Unbekannte Wörter schlage ich im zweisprachigen Wörterbuch nach und lerne sie mit ZAM. In Woche fünf übe ich Hörverstehen mit den Hörtexten zum Heft. In der letzten Woche mache ich noch eine Probeprüfung und vergleiche das Ergebnis mit der ersten.",
        criteria: ["Mindestens drei Hilfsmittel sind sinnvoll eingeplant.", "Der Plan geht gezielt von den eigenen Schwächen aus.", "Die Wochen sind konkret geplant."],
      },
    },
  },
  {
    id: "fr-quellen",
    lb: 6,
    unit: "4",
    covers: ["4.5"],
    title: "Quellen zur Informationsbeschaffung nutzen",
    intro:
      "Für ein Referat oder eine Diskussion suchst du Informationen auf Französisch: in verlässlichen Quellen, geprüft und mit Angabe.",
    paragraphs: [
      "Für Präsentationen, Projekte und Diskussionen brauchst du **Informationen**. Auf Französisch findest du sie in **Nachschlagewerken** (Larousse, Wikipédia als erster Überblick), auf **offiziellen Seiten** (Ministerien, Städte, Organisationen wie das OFAJ oder die OIF), in **Medien** für Jugendliche (Jugendzeitschriften, Nachrichtenseiten für junge Leser) und in Sachbüchern.",
      "**Verlässlichkeit** prüfst du mit Fragen: Wer steht hinter der Seite (Impressum, mentions légales)? Ist die Information aktuell (Datum)? Wird eine Quelle genannt? Finde ich dieselbe Information in einer zweiten, unabhängigen Quelle? Werbung, anonyme Foren und Beiträge in sozialen Netzwerken sind keine sicheren Quellen für Fakten.",
      "**Suchen** auf Französisch: Verwende französische Suchbegriffe (« chiffres jumelages franco-allemands », « service civique conditions »), damit du französische Seiten findest. Lies zuerst überfliegend, ob die Seite passt. Notiere die wichtigsten Informationen in eigenen Worten, nicht kopiert, und schreibe die **Quelle** dazu: Titel oder Seite, Adresse, Datum des Abrufs.",
      "In der Präsentation oder im Text nennst du deine Quellen: « Selon le site de l’OFAJ, … », « D’après un article du Monde, … », am Ende eine kurze Quellenliste. Typische Fehler: ganze Absätze kopieren, nur eine Quelle nutzen, veraltete Zahlen übernehmen oder eine Meinung aus einem Forum als Tatsache ausgeben.",
    ],
    terms: [
      { term: "verlässliche Quelle", text: "Eine Quelle mit erkennbarem Urheber, Datum und Belegen, deren Inhalt eine zweite Quelle bestätigt." },
      { term: "mentions légales", text: "Das Impressum einer französischen Webseite: Wer ist verantwortlich?" },
      { term: "selon / d’après", text: "Laut, nach: « Selon l’OIF, … », « D’après cet article, … ». Damit nennst du eine Quelle im Text." },
    ],
    takeaway:
      "Informationen in verlässlichen Quellen suchen (Nachschlagewerke, offizielle Seiten, Medien), mit französischen Suchbegriffen. Prüfen: Urheber, Datum, Belege, zweite Quelle. In eigenen Worten notieren und Quellen nennen (selon, d’après, Quellenliste).",
    sourceIds: ["lp", "oif", "dfjw"],
    quiz: {
      question: "Wie prüfst du, ob eine Zahl aus dem Internet stimmt?",
      answer: "Ich suche sie in einer zweiten, unabhängigen Quelle.",
      wrong: ["Ich nehme die Zahl, die am häufigsten geteilt wird.", "Ich vertraue der ersten Seite, die ich finde."],
      explanation:
        "Eine zweite unabhängige Quelle bestätigt eine Information. Häufiges Teilen sagt nichts über die Richtigkeit.",
    },
    workshop: {
      kind: "classify",
      title: "Quellen einschätzen",
      instruction: "Du recherchierst über den service civique. Ordne jede Quelle ein: verlässlich, als erster Überblick geeignet, oder unsicher.",
      categories: ["verlässlich", "erster Überblick", "unsicher"],
      entries: [
        { text: "Le site officiel du service civique, géré par l’État français", target: 0, feedback: "Eine offizielle Seite des Staates mit erkennbarem Urheber: verlässlich." },
        { text: "Un article de Wikipédia sur le service civique avec des références", target: 1, feedback: "Wikipédia gibt einen Überblick; Zahlen prüfst du an den genannten Quellen." },
        { text: "Un commentaire anonyme sous une vidéo: « Le service civique, c’est payé 2 000 euros! »", target: 2, feedback: "Anonym und ohne Beleg: unsicher." },
        { text: "Une brochure de l’OFAJ sur l’engagement des jeunes en France", target: 0, feedback: "Eine Organisation mit klarer Verantwortung: verlässlich." },
        { text: "Une page d’un dictionnaire encyclopédique qui définit le terme", target: 1, feedback: "Ein Nachschlagewerk erklärt Begriffe, für aktuelle Details brauchst du weitere Quellen." },
        { text: "Un post sur un réseau social sans auteur ni date", target: 2, feedback: "Ohne Urheber und Datum kannst du den Post nicht prüfen." },
      ],
      conclusion: "Offizielle Seiten und Organisationen sind verlässlich, Nachschlagewerke geben einen Überblick, anonyme Beiträge sind unsicher.",
    },
    casework: {
      title: "Recherche für ein Referat über die Frankophonie",
      story:
        "Für dein Referat suchst du, wie viele Menschen weltweit Französisch sprechen. Ein Blog schreibt « 500 millions », die Seite der Organisation internationale de la Francophonie nennt rund 320 Millionen.",
      steps: [
        {
          question: "Welcher Zahl vertraust du eher?",
          options: ["Der Zahl der OIF.", "Der höheren Zahl im Blog.", "Dem Mittelwert aus beiden."],
          answer: 0,
          explanation: "Die OIF ist eine internationale Organisation, die solche Zahlen regelmäßig erhebt und ihre Methode nennt.",
        },
        {
          question: "Wie nennst du die Quelle im Referat?",
          options: ["Selon l’OIF, environ 320 millions de personnes parlent français.", "Tout le monde sait que 320 millions de gens parlent français.", "Il y a 320 millions de francophones, c’est sûr et certain."],
          answer: 0,
          explanation: "Selon l’OIF nennt die Quelle; environ zeigt, dass es eine gerundete Zahl ist.",
        },
        {
          question: "Was gehört auf deine Quellenliste?",
          options: ["Seite, Adresse und Datum des Abrufs.", "Nur das Wort Internet, das genügt.", "Nur der Name meines Browsers und Handys."],
          answer: 0,
          explanation: "Seite, Adresse und Abrufdatum machen deine Quelle nachprüfbar.",
        },
      ],
      verdict:
        "Die Zahl der Organisation, mit selon genannt und mit Abrufdatum belegt: So ist dein Referat nachprüfbar.",
    },
    tasks: {
      1: {
        prompt:
          "Du willst herausfinden, wie viele deutsch-französische Städtepartnerschaften es gibt. Nenne drei französische Suchbegriffe, zwei Quellen, denen du vertrauen würdest, und wie du die Zahl prüfst.",
        hints: ["Nutze Wörter wie jumelage, villes jumelées, franco-allemand.", "Denke an offizielle Stellen und Organisationen."],
        model:
          "Suchbegriffe: « nombre de jumelages franco-allemands », « villes jumelées France Allemagne », « jumelages chiffres ». Quellen: die Seite des OFAJ und die Seite des Auswärtigen Amts oder der französischen Botschaft. Prüfung: Ich vergleiche die Zahlen beider Quellen und achte auf das Datum; meist heißt es „mehr als 2 000“.",
        criteria: ["Drei passende französische Suchbegriffe sind genannt.", "Zwei verlässliche Quellen sind gewählt.", "Eine sinnvolle Prüfung ist beschrieben."],
      },
      2: {
        prompt:
          "Recherchiere zu einem frankophonen Land oder Gebiet deiner Wahl zwei Fakten (zum Beispiel Einwohnerzahl, Sprachen, Hauptstadt). Schreibe auf Französisch drei bis vier Sätze, in denen du die Quellen mit selon oder d’après nennst, und füge eine kurze Quellenliste an.",
        hints: ["Prüfe jede Zahl in zwei Quellen.", "Notiere Adresse und Abrufdatum."],
        model:
          "Selon le site officiel du gouvernement belge, la Belgique a trois langues officielles: le néerlandais, le français et l’allemand. D’après l’encyclopédie Larousse, la capitale, Bruxelles, est aussi le siège de nombreuses institutions européennes. Ces deux informations sont confirmées par le site de l’Union européenne. Sources: belgium.be (consulté le 26 octobre 2026); larousse.fr, article « Belgique » (consulté le 26 octobre 2026).",
        criteria: ["Zwei Fakten sind richtig und geprüft.", "Die Quellen sind mit selon oder d’après genannt.", "Eine Quellenliste mit Abrufdatum ist vorhanden."],
      },
    },
  },
  {
    id: "fr-fehlerprotokoll",
    lb: 6,
    unit: "4",
    covers: ["4.6", "1.2.2.4"],
    title: "Fehler erkennen: Fehlerprotokoll und fiches d’écriture",
    intro:
      "Wer seine typischen Fehler kennt, kann sie gezielt vermeiden. Ein Fehlerprotokoll zeigt sie dir, eine fiche d’écriture hilft beim Überarbeiten.",
    paragraphs: [
      "Jeder macht Fehler, aber nicht jeder dieselben. Ein **Fehlerprotokoll** (un journal d’erreurs) hilft dir, deine **Stärken und Schwächen** zu erkennen. Nach jeder korrigierten Arbeit trägst du deine Fehler ein: Was habe ich geschrieben? Wie ist es richtig? Welche Art von Fehler ist es (Verb, Angleichung, Akzent, Wortschatz, Satzbau)? Welche Regel gilt?",
      "Nach einigen Wochen siehst du **Muster**: Vielleicht vergisst du oft die Angleichung des Partizips, verwechselst a und à oder setzt nach si den conditionnel. Für deine häufigsten Fehler wählst du gezielte **Strategien**: eine Übung zu diesem Thema, eine Merkregel auf einer Karte, eine feste Prüfroutine am Ende jedes Textes.",
      "Eine **fiche d’écriture** ist eine persönliche Checkliste zum Überarbeiten. Sie enthält deine typischen Fehlerquellen als Fragen: « Ai-je accordé les adjectifs? », « Après si: imparfait, pas de conditionnel? », « Les verbes avec être: accord du participe? », « a ou à? » Du gehst sie nach dem Schreiben Punkt für Punkt durch, für jeden Punkt einmal durch den ganzen Text.",
      "**Selbstkorrektur** gelingt besser mit etwas Abstand: Lies den Text laut oder in Gedanken langsam, Satz für Satz, und prüfe zuerst die Verben. Typische Fehler beim Fehlerprotokoll: nur die richtige Lösung abschreiben ohne Regel, alles auf einmal verbessern wollen oder das Protokoll nach zwei Wochen vergessen. Konzentriere dich auf drei Fehlerarten gleichzeitig.",
    ],
    terms: [
      { term: "Fehlerprotokoll", text: "Eine Tabelle mit eigenen Fehlern, ihrer Korrektur, der Fehlerart und der Regel (journal d’erreurs)." },
      { term: "fiche d’écriture", text: "Eine persönliche Checkliste mit Fragen zu den eigenen typischen Fehlern, für das Überarbeiten von Texten." },
      { term: "Selbstkorrektur", text: "Den eigenen Text gezielt prüfen und verbessern, am besten mit Abstand und Punkt für Punkt." },
    ],
    takeaway:
      "Fehlerprotokoll: Fehler, Korrektur, Fehlerart, Regel. Muster erkennen und für die drei häufigsten Fehler gezielte Strategien wählen. Fiche d’écriture als persönliche Checkliste: nach dem Schreiben Punkt für Punkt durch den ganzen Text.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Was gehört in eine Zeile des Fehlerprotokolls?",
      answer: "Fehler, Korrektur, Fehlerart und Regel.",
      wrong: ["Nur die Note der ganzen Arbeit.", "Nur die richtige Lösung ohne Erklärung."],
      explanation:
        "Erst mit Fehlerart und Regel erkennst du Muster und kannst gezielt üben.",
    },
    workshop: {
      kind: "classify",
      title: "Fehler nach ihrer Art ordnen",
      instruction: "Ordne jeden Fehler aus Mias Texten der Fehlerart zu. So wird ihr Fehlerprotokoll übersichtlich.",
      categories: ["Verbform", "Angleichung", "Rechtschreibung"],
      entries: [
        { text: "« Si j’aurais le temps » statt « Si j’avais le temps »", target: 0, feedback: "Nach si steht das imparfait: ein Fehler in der Verbform." },
        { text: "« Elles sont parti » statt « Elles sont parties »", target: 1, feedback: "Das Partizip nach être wird an elles angeglichen." },
        { text: "« Il a été a Paris » statt « Il a été à Paris »", target: 2, feedback: "Die Präposition à braucht einen Akzent: Rechtschreibung." },
        { text: "« Il faut que tu fais » statt « Il faut que tu fasses »", target: 0, feedback: "Nach il faut que steht der Subjonctif: Verbform." },
        { text: "« une idée intéressant » statt « une idée intéressante »", target: 1, feedback: "Das Adjektiv wird an idée angeglichen." },
        { text: "« le francais » statt « le français »", target: 2, feedback: "Die Cédille fehlt: Rechtschreibung." },
      ],
      conclusion: "Verbformen, Angleichungen und Rechtschreibung: Wer seine Fehler so ordnet, sieht, wo er üben muss.",
    },
    casework: {
      title: "Mias Fehlerprotokoll nach drei Arbeiten",
      story:
        "In Mias Protokoll stehen nach drei Arbeiten: sechsmal fehlende Angleichung nach être, viermal conditionnel nach si, zweimal ein falscher Artikel, einmal ein fehlender Akzent.",
      steps: [
        {
          question: "Worauf sollte Mia sich zuerst konzentrieren?",
          options: ["Auf die Angleichung nach être und si-Sätze.", "Auf alle Fehler gleichzeitig und sofort.", "Auf den einen Akzentfehler am Ende."],
          answer: 0,
          explanation: "Die häufigsten Fehler zuerst: Dort bringt gezieltes Üben am meisten.",
        },
        {
          question: "Welche Frage gehört auf ihre fiche d’écriture?",
          options: ["Verbe avec être: participe accordé?", "Est-ce que mon texte est long?", "Ai-je utilisé assez de mots très difficiles?"],
          answer: 0,
          explanation: "Die fiche enthält Fragen zu den eigenen typischen Fehlern, hier die Angleichung nach être.",
        },
        {
          question: "Wie nutzt Mia die fiche am besten?",
          options: ["Für jede Frage einmal durch den ganzen Text.", "Einmal schnell über den ganzen Text schauen.", "Nur bei langen Texten in der Prüfung benutzen."],
          answer: 0,
          explanation: "Wer für jeden Punkt den ganzen Text prüft, findet die Fehler zuverlässiger.",
        },
      ],
      verdict:
        "Häufigste Fehler zuerst, passende Fragen auf der fiche und Punkt für Punkt prüfen: So wird Mias Fehlerprotokoll zum Werkzeug.",
    },
    tasks: {
      1: {
        prompt:
          "Lege für drei eigene Fehler (aus einer korrigierten Arbeit oder aus der Lektion) je eine Zeile eines Fehlerprotokolls an: Fehler, Korrektur, Fehlerart, Regel.",
        hints: ["Die Regel formulierst du kurz in eigenen Worten.", "Ordne den Fehler einer Art zu: Verb, Angleichung, Rechtschreibung, Wortschatz, Satzbau."],
        model:
          "1. « Je l’ai vu » (über eine Frau) → « Je l’ai vue »; Angleichung; vorangestelltes direktes Objekt bei avoir: Partizip angleichen. 2. « Il faut que tu viens » → « que tu viennes »; Verbform; nach il faut que Subjonctif. 3. « Je téléphone ma mère » → « Je téléphone à ma mère »; Satzbau; téléphoner verlangt à.",
        criteria: ["Drei vollständige Zeilen liegen vor.", "Die Korrekturen sind richtig.", "Fehlerart und Regel sind passend."],
      },
      2: {
        prompt:
          "Erstelle deine persönliche fiche d’écriture mit sechs Prüffragen auf Französisch zu deinen typischen Fehlerquellen. Wende sie danach auf diesen Text an und korrigiere ihn: « Hier, ma sœur et moi, nous sommes allé au cinéma. Le film était nul et les acteurs pas bon. Si on aurait le choix, on regarderait plutôt une série à la maison. »",
        hints: ["Formuliere jede Frage kurz: « Après si: imparfait? »", "Prüfe den Text Frage für Frage."],
        model:
          "Fiche: 1. Verbes avec être: participe accordé? 2. Après si: imparfait, pas de conditionnel? 3. Adjectifs accordés? 4. a ou à? 5. Pronoms objets: direct ou indirect? 6. Accents? Korrigierter Text: « Hier, ma sœur et moi, nous sommes allés au cinéma. Le film était nul et les acteurs n’étaient pas bons. Si on avait le choix, on regarderait plutôt une série à la maison. » Gefunden über die Fragen 1 (allés), 3 (bons) und 2 (avait).",
        criteria: ["Die fiche enthält sechs sinnvolle Prüffragen.", "Alle Fehler im Text sind gefunden und korrigiert.", "Die Korrekturen sind den Prüffragen zugeordnet."],
      },
    },
  },
];
