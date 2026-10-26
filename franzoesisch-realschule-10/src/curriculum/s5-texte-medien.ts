import type { Lesson } from "../model/types";

/**
 * Stufe 5: Text- und Medienkompetenzen (Kompetenzerwartungen 3.1 bis 3.7): Texte mit Strategien
 * erschließen und Fragen zum Global- und Detailverstehen beantworten, Textpassagen zusammenfassen,
 * problembehaftete Situationen im Rollenspiel, kreative Chatbeiträge mit Bildern, Aufbau formeller und
 * persönlicher Schreiben und Argumentationsstränge analysieren und selbst schreiben.
 */
export const S5: Lesson[] = [
  {
    id: "fr-textfragen",
    lb: 5,
    unit: "3",
    covers: ["3.1", "3.2"],
    title: "Längere Texte erschließen und Fragen beantworten",
    intro:
      "Mit Strategien erschließt du längere Texte selbstständig, beantwortest Fragen zum Global- und Detailverstehen und sagst, was du selbst denkst.",
    paragraphs: [
      "Bei längeren, anspruchsvolleren Texten wählst du die **Strategie** passend zur Aufgabe. Für einen Überblick liest du **überfliegend** (Überschrift, erster und letzter Absatz, Bilder). Für eine bestimmte Information liest du **suchend** (Namen, Zahlen, Schlüsselwörter). Für das genaue Verstehen liest du **gründlich**, Absatz für Absatz. Unbekannte Wörter erschließt du über Zusammenhang, andere Sprachen und Wortbildung.",
      "Typische **Aufgaben** in der Prüfung: Fragen zum Globalverstehen (Quel est le sujet du texte? Quelle est l’intention de l’auteur?), richtig/falsch mit Beleg (vrai ou faux? Justifiez avec une phrase du texte), Zuordnungen (Überschriften zu Absätzen) und offene Fragen zum Detail. Bei Belegen schreibst du die Textstelle genau ab, mit Zeilenangabe, wenn verlangt.",
      "Bei **offenen Fragen** antwortest du in eigenen Worten und in ganzen Sätzen, außer Stichpunkte sind erlaubt. Wiederhole die Frage nicht wörtlich, aber nutze ihre Wörter: « Pourquoi Léa a-t-elle quitté Paris? » → « Elle a quitté Paris parce qu’elle … ». Achte auf die Zeit der Frage: Eine Frage im passé composé beantwortest du im passé composé.",
      "Am Ende steht oft eine Frage nach **deiner Meinung** (Et vous, qu’en pensez-vous?). Hier drückst du eigene Gedanken klar und detailliert aus: Meinung, Begründung, Beispiel. Typische Fehler: ganze Textabschnitte abschreiben statt antworten, eine richtig/falsch-Aufgabe ohne Beleg lassen oder in der Meinungsfrage nur « Je suis d’accord. » schreiben.",
    ],
    terms: [
      { term: "überfliegendes Lesen", text: "Schnell einen Überblick gewinnen: Überschrift, Anfang, Ende, Bilder (lecture globale)." },
      { term: "suchendes Lesen", text: "Gezielt eine Information finden: Namen, Zahlen, Schlüsselwörter (lecture sélective)." },
      { term: "Beleg", text: "Eine genau abgeschriebene Textstelle, die eine Antwort stützt (justifier avec le texte)." },
    ],
    takeaway:
      "Strategie zur Aufgabe wählen: überfliegend (Überblick), suchend (Information), gründlich (Verstehen). Richtig/falsch immer mit genauem Beleg, offene Fragen in eigenen Worten und ganzen Sätzen, Meinungsfragen mit Begründung und Beispiel.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Was gehört zu einer Antwort bei « Vrai ou faux? Justifiez. »?",
      answer: "Die Entscheidung und eine genaue Textstelle als Beleg.",
      wrong: ["Nur die Entscheidung vrai oder faux, ohne Beleg.", "Eine eigene Meinung zum Thema des ganzen Textes."],
      explanation:
        "Justifiez verlangt einen Beleg: die genau abgeschriebene Textstelle, die zeigt, warum die Aussage stimmt oder nicht.",
    },
    workshop: {
      kind: "mark",
      title: "Belege im Text finden",
      instruction:
        "Lies die drei Aussagen: A „Malik hat seine Lehre schon beendet.“ (falsch), B „Malik arbeitet am Wochenende.“ (richtig), C „Maliks Eltern waren zuerst dagegen.“ (richtig). Wähle oben die Aussage und klicke die Textstelle an, die sie belegt oder widerlegt.",
      labels: ["Beleg zu A", "Beleg zu B", "Beleg zu C"],
      text: [
        { t: "Malik a dix-sept ans. " },
        { t: "Il est en deuxième année d’apprentissage", label: 0, feedback: "Er ist im zweiten Lehrjahr, also noch nicht fertig: Aussage A ist falsch." },
        { t: " dans une boulangerie de Lyon. Il se lève à trois heures du matin et " },
        { t: "il travaille aussi le samedi et le dimanche", label: 1, feedback: "Samstag und Sonntag: Er arbeitet am Wochenende, Aussage B stimmt." },
        { t: ". Au début, " },
        { t: "ses parents ne voulaient pas qu’il quitte le lycée", label: 2, feedback: "Die Eltern wollten nicht, dass er das Gymnasium verlässt: Aussage C stimmt." },
        { t: ". Aujourd’hui, ils sont fiers de lui. Malik rêve d’ouvrir sa propre boulangerie." },
      ],
      conclusion: "Ein guter Beleg ist kurz und genau: genau die Stelle, die die Aussage bestätigt oder widerlegt.",
    },
    casework: {
      title: "Ein Text aus einer Jugendzeitschrift",
      story:
        "« Depuis un an, Chloé, 16 ans, ne prend plus l’avion. “J’ai vu un reportage sur le climat et j’ai décidé de changer”, explique-t-elle. Pour aller voir sa tante à Rome, elle a pris le train: quinze heures de voyage! “C’était long, mais j’ai rencontré des gens incroyables.” »",
      steps: [
        {
          question: "Was ist das Thema des Textes?",
          options: ["Eine Jugendliche fliegt dem Klima zuliebe nicht mehr.", "Ein Reisebericht über die Stadt Rom und ihre Sehenswürdigkeiten.", "Die Preise der Züge in Europa im Vergleich."],
          answer: 0,
          explanation: "Der Text handelt davon, dass Chloé wegen des Klimas nicht mehr fliegt. Rom ist nur ein Beispiel.",
        },
        {
          question: "Stimmt die Aussage « Chloé a trouvé le voyage en train trop long et ennuyeux »?",
          options: ["Faux, weil sie unglaubliche Leute getroffen hat.", "Vrai, weil die Reise fünfzehn Stunden gedauert hat.", "Vrai, weil sie nie wieder Zug fahren will."],
          answer: 0,
          explanation: "Sie sagt zwar, es war lang, aber mais j’ai rencontré des gens incroyables: Langweilig war es nicht.",
        },
        {
          question: "Wie beantwortest du « Pourquoi Chloé a-t-elle changé? » am besten?",
          options: ["Elle a changé parce qu’elle a vu un reportage sur le climat.", "Parce que. C’est tout ce que le texte dit sur elle, je crois.", "Chloé a 16 ans et elle a une tante qui habite à Rome."],
          answer: 0,
          explanation: "Ein ganzer Satz in eigenen Worten mit dem Grund aus dem Text, in der Zeit der Frage.",
        },
      ],
      verdict:
        "Thema erfasst, die Falle „lang heißt langweilig“ mit dem Beleg widerlegt und die Warum-Frage in einem ganzen Satz beantwortet.",
    },
    tasks: {
      1: {
        prompt:
          "Lies: « Au collège Jean-Jaurès, les élèves peuvent emprunter des vélos gratuitement. Le projet a été lancé par trois élèves de troisième. » Beantworte auf Französisch: 1. Qu’est-ce que les élèves peuvent faire? 2. Qui a eu l’idée? 3. Vrai ou faux: Les vélos coûtent deux euros. Justifiez.",
        hints: ["Antworte in ganzen Sätzen.", "Bei 3 schreibst du die Textstelle genau ab."],
        model:
          "1. Les élèves peuvent emprunter des vélos sans payer. 2. Ce sont trois élèves de troisième qui ont lancé le projet. 3. Faux: « les élèves peuvent emprunter des vélos gratuitement ». Gratuitement heißt kostenlos, also kosten die Fahrräder nichts.",
        criteria: ["Die Antworten sind ganze Sätze.", "Die Antworten treffen den Text.", "Der Beleg bei 3 ist genau abgeschrieben."],
      },
      2: {
        prompt:
          "Beantworte zum Text über Chloé die Frage « Et vous, est-ce que vous seriez prêt(e) à ne plus prendre l’avion? Pourquoi? » in sechs bis acht Sätzen. Nenne deine Meinung, zwei Gründe und ein Beispiel.",
        hints: ["Der conditionnel passt zu einer Frage mit seriez.", "Gib ein Beispiel aus deinem Leben."],
        model:
          "Personnellement, je serais prêt à prendre moins souvent l’avion, mais pas à arrêter complètement. D’un côté, je trouve que Chloé a raison: l’avion pollue beaucoup. Pour aller à Paris, je prendrais le train, parce que c’est presque aussi rapide. De l’autre, ma famille habite en partie en Turquie. Si je ne prenais plus l’avion, je ne verrais presque plus mes grands-parents. À mon avis, chacun peut faire des efforts, mais il faut trouver un équilibre. Par exemple, on pourrait voyager moins souvent, mais plus longtemps.",
        criteria: ["Die Meinung ist klar ausgedrückt.", "Zwei Gründe und ein Beispiel sind genannt.", "Der conditionnel ist richtig verwendet."],
      },
    },
  },
  {
    id: "fr-zusammenfassen",
    lb: 5,
    unit: "3",
    covers: ["3.3"],
    title: "Textpassagen auf Französisch zusammenfassen",
    intro:
      "Eine Zusammenfassung gibt das Wichtigste kurz und in eigenen Worten wieder, im Präsens und ohne eigene Meinung.",
    paragraphs: [
      "Eine **Zusammenfassung** (un résumé) gibt die wichtigsten Informationen eines Textes kurz wieder, mündlich oder schriftlich. Sie ist viel kürzer als das Original, steht im **Präsens** und enthält **keine eigene Meinung** und keine wörtlichen Zitate. Sie beginnt mit einem Einleitungssatz: Textsorte, Titel, Autor (wenn bekannt) und Thema.",
      "**Einleitungssatz**: « Le texte « … » est un article qui parle de … », « Dans cet extrait, il s’agit de … », « L’article présente … ». Danach folgen die **Hauptpunkte** in der Reihenfolge des Textes oder nach Sinn geordnet. Strukturwörter helfen: d’abord, ensuite, de plus, enfin, en conclusion. Am Ende kann ein Satz zum Ergebnis oder zur Absicht des Textes stehen.",
      "So gehst du vor: 1. Text lesen und das Thema in einem Satz notieren. 2. Pro Absatz die Hauptaussage unterstreichen. 3. Beispiele, Zahlen im Detail, Zitate und Wiederholungen weglassen. 4. In eigenen Worten formulieren: direkte Rede wird zu indirekter (« Il explique que … »), lange Aufzählungen zu einem Oberbegriff. 5. Prüfen: Ist alles Wichtige drin, nichts Erfundenes?",
      "Typische Fehler: den Text nacherzählen statt zusammenfassen, im passé composé schreiben, Sätze wörtlich abschreiben, die eigene Meinung einmischen (« C’est un texte très intéressant ») oder Nebensächliches aufnehmen. Eine Zusammenfassung eines Absatzes hat oft nur zwei bis drei Sätze.",
    ],
    terms: [
      { term: "résumé", text: "Eine Zusammenfassung: kurz, im Präsens, in eigenen Worten, ohne Meinung und ohne Zitate." },
      { term: "Einleitungssatz", text: "Nennt Textsorte, Titel, Autor und Thema: « Cet article parle de … »" },
      { term: "indirekte Rede", text: "Direkte Rede wird zusammengefasst wiedergegeben: « Elle dit qu’elle … », « Il explique que … »" },
    ],
    takeaway:
      "Résumé: Einleitungssatz (Textsorte, Titel, Thema), dann die Hauptpunkte in eigenen Worten, im Präsens, mit Strukturwörtern, ohne Beispiele, Zitate und eigene Meinung. Direkte Rede wird zu il explique que …",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Welcher Satz gehört nicht in eine Zusammenfassung?",
      answer: "À mon avis, cet article est vraiment génial.",
      wrong: ["L’article parle du gaspillage alimentaire.", "Ensuite, l’auteur présente deux solutions."],
      explanation:
        "In einer Zusammenfassung steht keine eigene Meinung. Die anderen Sätze nennen Thema und Hauptpunkte.",
    },
    workshop: {
      kind: "classify",
      title: "Was kommt in die Zusammenfassung?",
      instruction: "Ein Artikel berichtet über ein Repair-Café in Lille. Ordne jede Information zu: Hauptpunkt (rein), Detail (weglassen) oder Meinung (weglassen).",
      categories: ["Hauptpunkt", "Detail", "Meinung"],
      entries: [
        { text: "Dans un café à Lille, des bénévoles réparent gratuitement des objets cassés.", target: 0, feedback: "Das ist das Thema des Artikels: ein Hauptpunkt." },
        { text: "Le café se trouve au 12, rue Nationale, à côté d’une boulangerie.", target: 1, feedback: "Die genaue Adresse ist ein Detail für die Zusammenfassung." },
        { text: "Le but est de réduire les déchets et de transmettre des savoir-faire.", target: 0, feedback: "Das Ziel des Projekts gehört in die Zusammenfassung." },
        { text: "Moi, je trouve que c’est la meilleure idée de l’année!", target: 2, feedback: "Eine persönliche Meinung gehört nicht hinein." },
        { text: "Monsieur Dupont, 72 ans, porte une veste bleue et des lunettes rondes.", target: 1, feedback: "Aussehen einer Person ist ein Detail." },
        { text: "Le projet a tellement de succès que deux autres cafés vont ouvrir.", target: 0, feedback: "Der Erfolg und die Folgen sind ein Hauptpunkt." },
      ],
      conclusion: "Thema, Ziel und Ergebnis gehören hinein; Adressen, Aussehen und eigene Meinung bleiben draußen.",
    },
    casework: {
      title: "Ein Interview zusammenfassen",
      story:
        "In einem Interview sagt die Sportlerin Inès: « J’ai commencé le judo à six ans. Aujourd’hui, je m’entraîne vingt heures par semaine. Je rêve des Jeux olympiques, mais je veux aussi finir mes études d’infirmière. Ce n’est pas facile, mais mon club m’aide beaucoup. »",
      steps: [
        {
          question: "Welcher Einleitungssatz passt?",
          options: ["Dans cet interview, la judokate Inès parle de sa vie de sportive.", "« J’ai commencé le judo à six ans », dit Inès dans l’interview.", "Inès est une sportive très sympathique et très courageuse."],
          answer: 0,
          explanation: "Der Einleitungssatz nennt Textsorte, Person und Thema. Das Zitat und die Meinung gehören nicht hinein.",
        },
        {
          question: "Wie gibst du ihren Traum in eigenen Worten wieder?",
          options: ["Elle explique qu’elle rêve des Jeux olympiques.", "« Je rêve des Jeux olympiques », dit-elle.", "Elle a rêvé des Jeux olympiques quand elle était petite."],
          answer: 0,
          explanation: "Indirekte Rede im Präsens: elle explique qu’elle … Kein Zitat, kein passé composé.",
        },
        {
          question: "Welche Information kannst du am ehesten weglassen?",
          options: ["Dass sie mit sechs Jahren angefangen hat.", "Dass sie Sport und Studium verbinden will.", "Dass sie von Olympia träumt."],
          answer: 0,
          explanation: "Das Anfangsalter ist ein Detail; das Ziel und der Konflikt zwischen Sport und Studium sind der Kern.",
        },
      ],
      verdict:
        "Einleitungssatz mit Thema, indirekte Rede im Präsens und Konzentration auf den Kern: Sport und Studium verbinden, Olympia als Traum.",
    },
    tasks: {
      1: {
        prompt:
          "Fasse in zwei bis drei französischen Sätzen zusammen: « Le lycée Victor-Duruy a décidé d’éteindre les lumières des salles vides. Les élèves de la classe verte vérifient chaque soir les couloirs. En six mois, le lycée a économisé 15 % d’électricité. Le directeur est très content et veut continuer. »",
        hints: ["Beginne mit L’article parle de …", "Lass Einzelheiten weg und schreibe im Präsens."],
        model:
          "L’article parle d’un lycée qui veut économiser de l’énergie. Des élèves contrôlent chaque soir que les lumières des salles vides sont éteintes. Grâce à ce projet, le lycée consomme beaucoup moins d’électricité et veut continuer.",
        criteria: ["Ein Einleitungssatz nennt das Thema.", "Die Hauptpunkte sind in eigenen Worten im Präsens wiedergegeben.", "Details und Meinung fehlen."],
      },
      2: {
        prompt:
          "Wähle einen französischen Artikel (zum Beispiel aus einer Jugendzeitschrift oder von einer Nachrichtenseite für Jugendliche) von etwa einer halben Seite. Schreibe einen résumé von fünf bis sieben Sätzen und notiere darunter in einem Satz, was du weggelassen hast und warum.",
        hints: ["Unterstreiche pro Absatz die Hauptaussage.", "Nutze d’abord, ensuite, enfin."],
        model:
          "Beispiel zu einem Artikel über Schulgärten: L’article « Des potagers dans les écoles » présente un projet de jardins dans des écoles de Bordeaux. D’abord, il explique que les élèves cultivent des légumes pendant les cours de sciences. Ensuite, une enseignante raconte que les enfants mangent plus de légumes depuis le début du projet. De plus, les légumes récoltés sont utilisés à la cantine. Enfin, la ville veut créer des potagers dans toutes ses écoles d’ici trois ans. Weggelassen habe ich die Namen der Schulen und die Liste aller Gemüsesorten, weil sie für das Verständnis nicht nötig sind.",
        criteria: ["Der résumé hat einen Einleitungssatz und die Hauptpunkte.", "Er steht im Präsens, in eigenen Worten und ohne Meinung.", "Das Weggelassene ist begründet."],
      },
    },
  },
  {
    id: "fr-rollenspiel",
    lb: 5,
    unit: "3",
    covers: ["3.4"],
    title: "Rollenspiel: Problemsituationen simulieren",
    intro:
      "Mit einer Rollenkarte versetzt du dich in eine Person, planst deine Sätze und reagierst flexibel auf dein Gegenüber.",
    paragraphs: [
      "Im **Rollenspiel** (le jeu de rôle) simulierst du eine Situation, oft eine mit einem Problem: Ein Paket kommt nicht an, im Ferienlager gibt es Streit, der Zimmernachbar ist zu laut. Du bekommst eine **Rollenkarte** (une fiche de rôle) mit Person, Situation und Ziel. Deine Aufgabe ist, in dieser Rolle zu bleiben und dein Ziel zu erreichen.",
      "**Vorbereitung**: Lies die Rollenkarte genau. Wer bist du? Was willst du erreichen? Was könnte die andere Person sagen? Notiere Stichpunkte für Einstieg, Argumente und mögliche Reaktionen, keine ganzen Sätze. Lege dir Wendungen zurecht: Problem schildern (Il y a un problème: …), Vorschläge machen (On pourrait …, Et si on …?), Kompromisse finden (D’accord, si tu …, moi, je …).",
      "**Im Gespräch** reagierst du auf das, was dein Gegenüber wirklich sagt, nicht nur auf deinen Plan. Du fragst nach (Qu’est-ce que tu veux dire?), zeigst Verständnis (Je comprends, mais …), schlägst Lösungen vor und einigst dich (Alors, on fait comme ça?). Bleibe in der Rolle, auch wenn die Person etwas anderes ist als du: ein wütender Kunde, eine Mutter, ein Hotelchef.",
      "Typische Fehler: einen auswendig gelernten Text aufsagen, ohne zuzuhören, aus der Rolle fallen (lachen, Deutsch sprechen), nur Ja oder Nein sagen. Die App spielt nicht mit: Übe mit einem Partner, tauscht danach die Rollen, und nehmt euch auf, um die Sprache zu prüfen.",
    ],
    terms: [
      { term: "fiche de rôle", text: "Die Rollenkarte: Wer bist du, in welcher Situation, mit welchem Ziel?" },
      { term: "Kompromiss", text: "Eine Lösung, bei der beide Seiten etwas nachgeben: « D’accord, si tu fais la vaisselle, je range le salon. »" },
      { term: "in der Rolle bleiben", text: "Wie die Person auf der Karte sprechen und handeln, auch wenn sie anders ist als du." },
    ],
    takeaway:
      "Rollenspiel: Rollenkarte lesen (Person, Situation, Ziel), Stichpunkte und Wendungen vorbereiten, im Gespräch zuhören und reagieren (je comprends, mais; on pourrait), Lösung oder Kompromiss finden und in der Rolle bleiben.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Was ist im Rollenspiel am wichtigsten?",
      answer: "Auf das Gegenüber reagieren und in der Rolle bleiben.",
      wrong: ["Einen auswendig gelernten Text genau aufsagen.", "Möglichst schnell eine eigene Meinung durchsetzen."],
      explanation:
        "Ein Rollenspiel ist ein Gespräch: Du hörst zu, reagierst passend und bleibst in deiner Rolle.",
    },
    workshop: {
      kind: "timeline",
      title: "Ein Streit in der WG lösen",
      instruction: "Zwei Austauschschüler teilen ein Zimmer. Bringe die Gesprächsschritte in eine sinnvolle Reihenfolge: Problem, Reaktion, Nachfrage, Vorschlag, Einigung.",
      categories: [],
      entries: [
        { text: "– Écoute, Paul, il y a un problème: tu écoutes de la musique très tard le soir.", target: 0, feedback: "Das Problem wird direkt, aber ruhig angesprochen." },
        { text: "– Ah bon? Désolé, je ne savais pas que ça te dérangeait.", target: 1, feedback: "Die andere Person reagiert und entschuldigt sich." },
        { text: "– Si, je n’arrive pas à dormir. Tu ne pourrais pas mettre des écouteurs?", target: 2, feedback: "Erklärung und eine Bitte im conditionnel." },
        { text: "– D’accord, mais alors toi, tu éteins la lumière avant onze heures.", target: 3, feedback: "Ein Gegenvorschlag: Beide geben etwas." },
        { text: "– Ça marche, on fait comme ça. Merci, Paul!", target: 4, feedback: "Einigung und Dank schließen das Gespräch." },
      ],
      conclusion: "Problem ansprechen, zuhören, bitten, einen Kompromiss finden und sich einigen: So wird aus einem Streit eine Lösung.",
    },
    casework: {
      title: "Die Rollenkarte",
      story:
        "Deine Rollenkarte: « Tu as commandé un sweat sur Internet il y a trois semaines. Il n’est toujours pas arrivé. Tu appelles le service client. Ton but: recevoir le sweat avant samedi ou être remboursé(e). »",
      steps: [
        {
          question: "Was notierst du dir zur Vorbereitung?",
          options: ["Stichpunkte: commande, trois semaines, samedi, remboursement.", "Einen ganzen Text, den ich vorher Wort für Wort auswendig lerne.", "Nichts, ich improvisiere am Telefon einfach alles."],
          answer: 0,
          explanation: "Stichpunkte helfen, frei zu sprechen und trotzdem nichts zu vergessen.",
        },
        {
          question: "Der Mitarbeiter sagt: « Le colis est perdu, je suis désolé. » Wie reagierst du in deiner Rolle?",
          options: ["Je comprends, mais j’en ai besoin samedi. Que proposez-vous?", "Ah, d’accord, tant pis, ce n’est pas grave. Au revoir, monsieur.", "C’est votre faute, vous êtes vraiment nuls dans cette entreprise!"],
          answer: 0,
          explanation: "Du zeigst Verständnis, nennst dein Ziel und fragst nach einer Lösung, so wie es die Rollenkarte verlangt.",
        },
        {
          question: "Er kann bis samstags nicht liefern. Welche Lösung erfüllt dein Ziel?",
          options: ["Alors, je voudrais être remboursé, s’il vous plaît.", "Alors, j’attends encore un mois sans rien dire.", "Alors, je commande un deuxième sweat."],
          answer: 0,
          explanation: "Die Rollenkarte nennt als zweites Ziel die Rückerstattung.",
        },
      ],
      verdict:
        "Mit Stichpunkten vorbereitet, auf das Problem reagiert und die zweite Lösung der Rollenkarte verlangt: So erreichst du dein Ziel im Rollenspiel.",
    },
    tasks: {
      1: {
        prompt:
          "Bereite die Rolle vor: « Tu es en colonie de vacances. Ton voisin de chambre prend toujours la douche pendant quarante minutes le matin et tu es en retard au petit déjeuner. Ton but: trouver une solution sans te disputer. » Notiere Stichpunkte für Einstieg, zwei Vorschläge und eine Reaktion, falls er nein sagt.",
        hints: ["Einstieg: das Problem ruhig schildern.", "Für Vorschläge: on pourrait, et si …?"],
        model:
          "Einstieg: Salut · petit problème · douche le matin · moi en retard. Vorschlag 1: On pourrait se lever à tour de rôle plus tôt. Vorschlag 2: Et si tu prenais ta douche le soir? Falls nein: Je comprends, mais trouvons une solution ensemble · dix minutes chacun?",
        criteria: ["Einstieg, zwei Vorschläge und eine Reaktion sind vorbereitet.", "Die Notizen sind Stichpunkte mit nützlichen Wendungen.", "Das Ziel, eine Lösung ohne Streit, bleibt im Blick."],
      },
      2: {
        prompt:
          "Schreibe das Rollenspiel zur Situation aus Niveau 1 als Dialog von zehn bis zwölf Zeilen. Der Nachbar ist zuerst wenig einsichtig. Am Ende findet ihr einen Kompromiss.",
        hints: ["Lass den Nachbarn zuerst ablehnen.", "Nutze je comprends, mais und einen Vorschlag im conditionnel."],
        model:
          "– Salut Hugo, je peux te parler deux minutes? – Oui, qu’est-ce qu’il y a? – Le matin, tu prends ta douche pendant quarante minutes, et moi, je suis toujours en retard au petit déjeuner. – Ben, j’ai besoin de temps, moi. – Je comprends, mais on n’a qu’une salle de bains. – Et alors? Lève-toi plus tôt! – Je pourrais, mais toi aussi, tu pourrais faire un petit effort. Et si tu prenais ta douche le soir? – Le soir? Hmm… pas tous les jours. – D’accord. Alors, un jour sur deux, tu la prends le soir? – Bon, ça marche. – Super, merci!",
        criteria: ["Beide Rollen sprechen glaubwürdig.", "Der Sprecher reagiert auf das Nein mit Verständnis und Vorschlag.", "Am Ende steht ein Kompromiss."],
      },
    },
  },
  {
    id: "fr-chat-kreativ",
    lb: 5,
    unit: "3",
    covers: ["3.5"],
    title: "Kreativ schreiben: Chatbeiträge mit Bildern",
    intro:
      "Nach einem Impuls gestaltest du einen Chatverlauf oder Post: mit passendem Ton, Bildern und wenigen gestalterischen Mitteln.",
    paragraphs: [
      "Beim **kreativen Schreiben** arbeitest du einen Text nach einem **Impuls** aus: Ein Foto, eine Situation oder ein Satz ist vorgegeben, du gestaltest daraus zum Beispiel einen **Chatverlauf** (une conversation sur une messagerie), einen Post in sozialen Netzwerken oder eine Bildergeschichte. Dabei setzt du ein begrenztes Repertoire an **gestalterischen Mitteln** ein: Fotos, Bilder, Emojis, Hashtags, kurze Bildunterschriften.",
      "Chatsprache ist **locker und kurz**: Salut! Coucou! Ça va? On se voit? Trop bien! Sinon, … (ansonsten), Bisous! Typische Abkürzungen verstehst du, nutzt sie aber sparsam: mdr (mort de rire, lol), stp (s’il te plaît), bcp (beaucoup), pk (pourquoi), slt (salut). In einer Schulaufgabe zählt trotzdem richtige Rechtschreibung; schreibe deshalb die Wörter meist aus.",
      "Ein **Bild** im Chat braucht eine Funktion: Es zeigt etwas, das der Text kommentiert (« Regarde la vue depuis ma chambre! »), oder es löst eine Reaktion aus. Beschreibe in einer Schreibaufgabe in Klammern, welches Bild an welcher Stelle steht: [photo: la plage au coucher du soleil]. Ein Verlauf wirkt lebendig, wenn mehrere Personen antworten, nachfragen und reagieren.",
      "Typische Fehler: zu lange Nachrichten wie ein Brief, ein Ton, der nicht zur Beziehung passt (Vous unter Freunden), lauter Abkürzungen, die niemand versteht, oder Bilder ohne Bezug zum Text. Für den Impuls gilt: Bleib beim Thema und erfülle alle Punkte der Aufgabe.",
    ],
    terms: [
      { term: "Impuls", text: "Ein Ausgangspunkt für einen kreativen Text: ein Foto, eine Situation, ein Satzanfang." },
      { term: "Chatsprache", text: "Lockere, kurze Sprache mit Ausrufen und wenigen Abkürzungen: Coucou! Trop bien! mdr." },
      { term: "gestalterische Mittel", text: "Bilder, Fotos, Emojis, Hashtags und Bildunterschriften, die einen Text ergänzen." },
    ],
    takeaway:
      "Kreativer Chatbeitrag: Impuls und alle Punkte der Aufgabe erfüllen, lockerer und kurzer Ton (Coucou! Trop bien!), wenige verständliche Abkürzungen, Bilder mit klarer Funktion, mehrere Personen, die aufeinander reagieren. Rechtschreibung zählt trotzdem.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Was bedeutet « mdr » in einem französischen Chat?",
      answer: "Ich lache mich tot (wie lol).",
      wrong: ["Bis morgen, wir sehen uns.", "Danke für die Nachricht."],
      explanation:
        "Mdr steht für mort de rire, also „tot vor Lachen“, ähnlich wie lol.",
    },
    workshop: {
      kind: "classify",
      title: "Passt das in einen Chat unter Freunden?",
      instruction: "Ordne jede Nachricht zu: passend für einen Chat unter Freunden, zu förmlich oder unverständlich.",
      categories: ["passend", "zu förmlich", "unverständlich"],
      entries: [
        { text: "Coucou Léa! Regarde, je suis à la plage avec ma famille! Trop beau, non?", target: 0, feedback: "Locker, kurz, mit Ausruf und Frage: passend." },
        { text: "Madame, je me permets de vous informer de mon arrivée à la plage.", target: 1, feedback: "Siezen und förmliche Wendungen passen nicht unter Freunden." },
        { text: "slt cv jsp pk g pa rpd mdr tkt lol", target: 2, feedback: "Nur Abkürzungen ohne Zusammenhang: niemand versteht das sicher." },
        { text: "Trop cool ta photo! Tu rentres quand? On se fait un ciné ce week-end?", target: 0, feedback: "Reaktion auf das Bild, Nachfrage und Vorschlag: passend." },
        { text: "Je vous prie d’agréer l’expression de mes sentiments distingués.", target: 1, feedback: "Eine Grußformel aus formellen Briefen: viel zu förmlich." },
        { text: "Haha mdr, c’est trop drôle! Envoie-moi la vidéo stp!", target: 0, feedback: "Locker, mit zwei bekannten Abkürzungen: passend." },
      ],
      conclusion: "Locker, kurz und verständlich: Ein guter Chatbeitrag reagiert, fragt nach und nutzt Abkürzungen nur, wo jeder sie kennt.",
    },
    casework: {
      title: "Ein Foto als Impuls",
      story:
        "Aufgabe: « Tu es en vacances à Québec. Tu envoies une photo à ton groupe d’amis. Écris la conversation (au moins trois personnes, une photo). » Du hast ein Foto vom Château Frontenac im Schnee.",
      steps: [
        {
          question: "Womit beginnst du den Verlauf am besten?",
          options: ["[photo: le Château Frontenac sous la neige] Coucou! Regardez!", "Chers amis, je vous écris cette lettre pour vous dire où je suis.", "Bonjour. Voici une photo de mon voyage. Fin du message."],
          answer: 0,
          explanation: "Das Bild steht am Anfang und wird mit einem lockeren Ausruf kommentiert.",
        },
        {
          question: "Was macht den Verlauf lebendig?",
          options: ["Die Freunde reagieren, fragen nach und erzählen.", "Nur eine Person schreibt sehr lange Nachrichten.", "Alle schreiben nur Emojis, ganz ohne Text."],
          answer: 0,
          explanation: "Mehrere Personen, die aufeinander reagieren, machen einen Chat glaubwürdig.",
        },
        {
          question: "Welche Antwort einer Freundin passt?",
          options: ["Trop beau!! Il fait froid? Tu as mangé de la poutine?", "Veuillez agréer, cher ami, mes salutations distinguées.", "La photo est bien arrivée. Merci beaucoup pour votre envoi."],
          answer: 0,
          explanation: "Begeisterung, Nachfrage zum Wetter und zu einer Spezialität aus Québec: passend und interessiert.",
        },
      ],
      verdict:
        "Bild mit Kommentar am Anfang, mehrere Stimmen und lockere Nachfragen: So erfüllt der Chatverlauf den Impuls.",
    },
    tasks: {
      1: {
        prompt:
          "Antworte in einem Chat auf diese Nachricht deiner französischen Freundin, mit drei bis vier kurzen Nachrichten und einem Bild in Klammern: « Coucou! Ça fait longtemps! Qu’est-ce que tu as fait ce week-end? »",
        hints: ["Beginne locker und reagiere auf ihre Frage.", "Beschreibe dein Bild in eckigen Klammern."],
        model:
          "Coucou Inès! Oui, trop longtemps! Ce week-end, je suis allée à un concert à Munich avec ma cousine. [photo: la scène avec des lumières bleues] C’était génial, l’ambiance était folle! Et toi, quoi de neuf?",
        criteria: ["Die Antwort ist locker und kurz.", "Ein Bild ist sinnvoll eingebunden.", "Die Nachricht endet mit einer Frage zurück."],
      },
      2: {
        prompt:
          "Gestalte nach diesem Impuls einen Chatverlauf (zehn bis zwölf Nachrichten, drei Personen, mindestens zwei Bilder in Klammern): « Ton groupe organise une action de nettoyage dans un parc. Le jour J, il pleut. »",
        hints: ["Lass die Personen Probleme ansprechen und Lösungen vorschlagen.", "Nutze Chatsprache, aber schreibe die meisten Wörter aus."],
        model:
          "Tom: Coucou tout le monde! [photo: la pluie sur la fenêtre] Euh… on fait quoi pour le nettoyage? 😅 Lisa: Oh non, il pleut des cordes! Mehdi: Moi, j’ai des imperméables pour tout le monde! Tom: Trop bien! Mais les gens vont venir? Lisa: Je fais un post: « Même sous la pluie, on nettoie! » Mehdi: Bonne idée, mets la photo du parc plein de déchets. Lisa: [photo: des bouteilles et des papiers sous un banc] Voilà, c’est posté! Tom: 15 likes déjà mdr! Mehdi: Rendez-vous à 14 h devant l’entrée? Lisa: Ça marche, à tout à l’heure!",
        criteria: ["Drei Personen schreiben im passenden Chatton.", "Zwei Bilder sind sinnvoll eingebunden.", "Der Verlauf erfüllt den Impuls und hat eine kleine Handlung."],
      },
    },
  },
  {
    id: "fr-formelle-briefe",
    lb: 5,
    unit: "3",
    covers: ["3.6"],
    title: "Formelle Schreiben: Beschwerde, Anfrage, Leserbrief",
    intro:
      "Formelle Schreiben haben einen festen Aufbau: Absender, Ort und Datum, Betreff, Anrede, klare Absätze und eine Grußformel.",
    paragraphs: [
      "Ein **persönlicher Brief** oder eine E-Mail an Freunde beginnt mit Cher/Chère … oder Salut, duzt und endet mit Bises, À bientôt oder Je t’embrasse. Ein **formelles Schreiben** an ein Unternehmen, eine Behörde oder eine Zeitung hat einen festen Aufbau: Absender oben links, Empfänger darunter rechts, **Ort und Datum** (« Augsburg, le 12 mars 2027 »), **Betreff** (Objet: …), **Anrede** (Madame, Monsieur,), Text in Absätzen und **Grußformel**.",
      "Typische formelle Schreiben sind die **Anfrage** (une demande de renseignements: « Je voudrais savoir si … », « Pourriez-vous m’envoyer … ? »), die **Beschwerde** (une lettre de réclamation: Problem genau schildern, Belege nennen, Forderung stellen: « Je vous demande de me rembourser. ») und der **Leserbrief** (Bezug auf einen Artikel, eigene Meinung mit Argumenten: « Suite à votre article du 5 mai sur … »).",
      "Die **Grußformeln** sind fest: « Je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées. » oder kürzer in E-Mails « Cordialement » oder « Bien cordialement ». Davor steht oft ein Satz, der eine Antwort erwartet: « Dans l’attente de votre réponse, … », « Je vous remercie par avance. » Man siezt immer und nutzt den conditionnel für Bitten.",
      "Typische Fehler: Cher Monsieur ohne Namen (besser Madame, Monsieur), Salut in einem formellen Brief, Duzen, Beschwerden ohne genaue Angaben (Datum, Bestellnummer) und Drohungen statt sachlicher Forderungen. Lies vor dem Schreiben ein Musterschreiben und übernimm seinen Aufbau.",
    ],
    terms: [
      { term: "Objet", text: "Der Betreff eines formellen Schreibens: « Objet: réclamation, commande n° 4521 »." },
      { term: "lettre de réclamation", text: "Ein Beschwerdebrief: Problem genau schildern, Belege nennen, sachlich eine Lösung fordern." },
      { term: "demande de renseignements", text: "Eine Anfrage nach Informationen: « Pourriez-vous m’indiquer … ? »" },
      { term: "formule de politesse", text: "Die Grußformel am Ende: « Je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées. »" },
    ],
    takeaway:
      "Formell: Absender, Empfänger, Ort und Datum, Objet, Madame, Monsieur, Absätze (Anlass, Anliegen, Bitte oder Forderung), Satz mit Erwartung (Dans l’attente de votre réponse), Grußformel. Immer siezen, Bitten im conditionnel. Persönlich: Cher/Chère, tu, Bises.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "Wie beginnst du einen Beschwerdebrief an eine Firma, deren Ansprechpartner du nicht kennst?",
      answer: "Madame, Monsieur,",
      wrong: ["Cher Monsieur,", "Salut l’équipe,"],
      explanation:
        "Wenn du den Namen nicht kennst, ist Madame, Monsieur die übliche Anrede. Cher Monsieur ohne Namen wirkt seltsam, Salut ist zu locker.",
    },
    workshop: {
      kind: "timeline",
      title: "Den Aufbau einer Beschwerde ordnen",
      instruction: "Bringe die Teile einer Beschwerde-E-Mail in die richtige Reihenfolge.",
      categories: [],
      entries: [
        { text: "Objet: réclamation pour la commande n° 7810 du 2 avril", target: 0, feedback: "Der Betreff steht vor der Anrede." },
        { text: "Madame, Monsieur, le 2 avril, j’ai commandé une veste sur votre site.", target: 1, feedback: "Anrede und Anlass: Was ist wann passiert?" },
        { text: "J’ai reçu la veste hier, mais elle est déchirée sur la manche gauche.", target: 2, feedback: "Das Problem wird genau beschrieben." },
        { text: "Je vous demande donc de m’envoyer une nouvelle veste ou de me rembourser.", target: 3, feedback: "Die sachliche Forderung folgt auf das Problem." },
        { text: "Dans l’attente de votre réponse, je vous adresse mes salutations distinguées.", target: 4, feedback: "Erwartung einer Antwort und Grußformel bilden den Schluss." },
      ],
      conclusion: "Betreff, Anlass, Problem, Forderung, Grußformel: Dieser Aufbau macht eine Beschwerde klar und wirksam.",
    },
    casework: {
      title: "Ein Leserbrief an die Lokalzeitung",
      story:
        "In der Zeitung deiner französischen Partnerstadt steht ein Artikel: « Les jeunes ne s’intéressent plus à la politique. » Du willst mit einem Leserbrief widersprechen.",
      steps: [
        {
          question: "Wie beginnst du den Leserbrief?",
          options: ["Suite à votre article du 3 mai, je voudrais réagir.", "Salut! J’ai lu votre truc sur les jeunes, c’est vraiment nul.", "Cher journal, comment ça va aujourd’hui? Moi, ça va bien."],
          answer: 0,
          explanation: "Ein Leserbrief beginnt mit dem Bezug auf den Artikel und kündigt die Reaktion an.",
        },
        {
          question: "Was gehört in den Hauptteil?",
          options: ["Deine Meinung mit Argumenten und Beispielen.", "Eine Bestellnummer und eine Rechnungsnummer.", "Eine Liste deiner Lieblingsfilme und Serien."],
          answer: 0,
          explanation: "Im Leserbrief begründest du deine Meinung, zum Beispiel mit Jugendlichen, die sich engagieren.",
        },
        {
          question: "Welcher Schluss passt?",
          options: ["Veuillez agréer, Madame, Monsieur, mes salutations distinguées.", "Gros bisous à toute la rédaction et à plus tard sur les réseaux!", "C’est tout pour aujourd’hui, merci, salut et bonne nuit à vous."],
          answer: 0,
          explanation: "Ein Leserbrief ist ein formelles Schreiben: Er endet mit einer formellen Grußformel.",
        },
      ],
      verdict:
        "Bezug auf den Artikel, begründete Meinung und formelle Grußformel: So wird der Leserbrief ernst genommen.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe eine kurze Anfrage (fünf bis sechs Sätze) per E-Mail an das Office de tourisme in Annecy: Du möchtest Informationen über günstige Unterkünfte für eine Schülergruppe im Juli.",
        hints: ["Betreff, Anrede, Anliegen, Bitte im conditionnel, Dank, Grußformel.", "Nenne Gruppengröße und Datum."],
        model:
          "Objet: demande de renseignements, séjour de groupe en juillet. Madame, Monsieur, nous sommes une classe de 24 élèves allemands de 16 ans et nous voudrions passer trois jours à Annecy du 8 au 10 juillet. Pourriez-vous nous envoyer une liste d’hébergements pas chers pour les groupes? Nous aimerions aussi savoir s’il y a des activités gratuites au bord du lac. Je vous remercie par avance. Cordialement, Lena Weiß",
        criteria: ["Aufbau und Grußformel sind formell.", "Das Anliegen ist genau (Gruppe, Datum).", "Die Bitte steht im conditionnel."],
      },
      2: {
        prompt:
          "Schreibe einen vollständigen Beschwerdebrief (acht bis zehn Sätze): Du hast für einen Sprachkurs in Montpellier 450 Euro bezahlt, aber der Kurs fand nur an drei statt an fünf Tagen statt, und das Zimmer in der Gastfamilie war nicht wie versprochen ein Einzelzimmer.",
        hints: ["Schildere jedes Problem genau, mit Daten und Beträgen.", "Fordere sachlich eine teilweise Rückerstattung."],
        model:
          "Objet: réclamation, cours de langue du 3 au 7 juillet. Madame, Monsieur, du 3 au 7 juillet, j’ai participé à votre cours de français à Montpellier, pour lequel j’ai payé 450 euros. Malheureusement, le cours n’a eu lieu que trois jours sur cinq, parce que le professeur était absent mercredi et jeudi. On ne nous a proposé aucun remplacement. De plus, votre brochure promettait une chambre individuelle dans la famille d’accueil, mais j’ai dû partager ma chambre avec une autre élève. Je suis très déçue, car j’avais choisi votre école pour sa bonne réputation. Je vous demande donc de me rembourser une partie du prix, c’est-à-dire au moins 180 euros. Dans l’attente de votre réponse, je vous prie d’agréer, Madame, Monsieur, mes salutations distinguées. Sophie Lang",
        criteria: ["Beide Probleme sind genau geschildert.", "Die Forderung ist sachlich und konkret.", "Aufbau, Ton und Grußformel sind formell."],
      },
    },
  },
  {
    id: "fr-argumentation",
    lb: 5,
    unit: "3",
    covers: ["3.7"],
    title: "Argumentieren: Pro und Contra abwägen",
    intro:
      "In einem argumentativen Text folgst du einem roten Faden: These, Argumente mit Beispielen, Gegenargumente und eine begründete Entscheidung.",
    paragraphs: [
      "Ein **argumentativer Text** (un texte argumentatif) beantwortet eine Frage, zu der es verschiedene Meinungen gibt. Der **Argumentationsstrang** ist sein roter Faden: Einleitung mit der Frage, Argumente dafür (pour), Argumente dagegen (contre) und am Ende eine **begründete Entscheidung**. Ein Argument besteht aus einer Behauptung, einer Begründung und einem Beispiel.",
      "Beim **Analysieren** eines Textes fragst du: Welche Frage wird gestellt? Welche Argumente stehen auf welcher Seite? Wie sind sie verbunden (d’abord, de plus, par contre, cependant)? Welche Seite überwiegt, und wo steht die Meinung des Autors? Oft steht das stärkste Argument am Ende der eigenen Seite, direkt vor dem Schluss.",
      "Beim **Schreiben** nutzt du einen klaren Aufbau. **Einleitung**: Thema und Frage (« Aujourd’hui, beaucoup de jeunes se demandent si … »). **Hauptteil**: zuerst die Seite, die du nicht vertrittst, dann deine eigene, damit dein Text auf deine Meinung zuläuft (« Certes, … Cependant, … »). **Schluss**: Abwägung und Entscheidung (« En conclusion, je pense que …, car … »).",
      "Hilfreiche Wendungen: Certes (zwar), il est vrai que, d’un côté … de l’autre, cependant, pourtant, de plus, en outre, par exemple, c’est pourquoi, tout bien considéré (alles in allem). Typische Fehler: nur eine Seite, Argumente ohne Beispiele, ein Schluss, der nicht zu den Argumenten passt, oder neue Argumente erst im Schluss.",
    ],
    terms: [
      { term: "Argumentationsstrang", text: "Der rote Faden eines argumentativen Textes: Frage, Argumente pour und contre, Entscheidung." },
      { term: "Argument", text: "Behauptung + Begründung + Beispiel. Erst das Beispiel macht es überzeugend." },
      { term: "certes … cependant", text: "Zwar … jedoch: räumt ein Gegenargument ein und führt zur eigenen Seite." },
      { term: "tout bien considéré", text: "Alles in allem: leitet die abwägende Entscheidung im Schluss ein." },
    ],
    takeaway:
      "Argumentativer Text: Einleitung (Frage), Gegenseite, dann eigene Seite (certes … cependant), Argumente = Behauptung + Begründung + Beispiel, Schluss mit Abwägung und Entscheidung (en conclusion, tout bien considéré). Keine neuen Argumente im Schluss.",
    sourceIds: ["lp", "lepointdufle"],
    quiz: {
      question: "In welcher Reihenfolge stehen die Seiten, wenn dein Text auf deine Meinung zulaufen soll?",
      answer: "Erst die Gegenseite, dann die eigene Seite.",
      wrong: ["Erst die eigene Seite, dann die Gegenseite.", "Beide Seiten in einem einzigen Absatz gemischt."],
      explanation:
        "Steht die eigene Seite zuletzt, führt der Text direkt zum Schluss mit deiner Entscheidung.",
    },
    workshop: {
      kind: "classify",
      title: "Den Argumentationsstrang eines Textes erkennen",
      instruction: "Der Text fragt: « Faut-il un smartphone à 11 ans? » Ordne jeden Satz zu: These/Einleitung, Argument pour, Argument contre oder Schluss.",
      categories: ["Einleitung", "pour", "contre", "Schluss"],
      entries: [
        { text: "Aujourd’hui, de plus en plus d’enfants reçoivent un smartphone dès l’entrée au collège.", target: 0, feedback: "Hinführung zum Thema: Einleitung." },
        { text: "Un smartphone permet aux parents de joindre leur enfant en cas de problème.", target: 1, feedback: "Ein Argument dafür: Sicherheit." },
        { text: "Cependant, les écrans peuvent nuire au sommeil et à la concentration des enfants.", target: 2, feedback: "Cependant leitet ein Argument dagegen ein." },
        { text: "De plus, les enfants risquent d’être confrontés trop tôt au harcèlement en ligne.", target: 2, feedback: "Ein weiteres Argument dagegen: Cybermobbing." },
        { text: "Par exemple, on peut appeler ses parents quand le bus ne vient pas.", target: 1, feedback: "Ein Beispiel für das Argument der Erreichbarkeit." },
        { text: "Tout bien considéré, un simple téléphone sans Internet suffit à cet âge.", target: 3, feedback: "Tout bien considéré leitet die abwägende Entscheidung ein." },
      ],
      conclusion: "Einleitung, Argumente beider Seiten mit Beispielen und ein abwägender Schluss: So erkennst du den roten Faden.",
    },
    casework: {
      title: "Einen argumentativen Text planen",
      story:
        "Die Aufgabe lautet: « Les élèves devraient-ils choisir eux-mêmes leurs matières à l’école? Écrivez un texte argumentatif. » Du bist eher dafür.",
      steps: [
        {
          question: "Womit beginnt dein Hauptteil?",
          options: ["Mit den Argumenten dagegen.", "Mit deiner Entscheidung.", "Mit einem Beispiel ohne Argument."],
          answer: 0,
          explanation: "Du bist dafür, also kommt zuerst die Gegenseite, damit der Text auf deine Meinung zuläuft.",
        },
        {
          question: "Welcher Satz verbindet die beiden Seiten am besten?",
          options: ["Certes, certaines matières sont nécessaires. Cependant, …", "Donc, certaines matières sont nécessaires. Alors, …", "En conclusion, certaines matières sont nécessaires."],
          answer: 0,
          explanation: "Certes räumt das Gegenargument ein, cependant leitet zur eigenen Seite über.",
        },
        {
          question: "Welches Argument ist vollständig?",
          options: ["Par intérêt, on travaille mieux: ma sœur a progressé en théâtre.", "On travaille mieux par intérêt, c’est évident pour tout le monde.", "Ma sœur fait du théâtre depuis deux ans dans un club de la ville."],
          answer: 0,
          explanation: "Behauptung, Begründung und Beispiel sind enthalten. Die anderen sind nur Behauptung oder nur Beispiel.",
        },
      ],
      verdict:
        "Gegenseite zuerst, Übergang mit certes … cependant und vollständige Argumente mit Beispiel: Der Plan führt zu einem überzeugenden Text.",
    },
    tasks: {
      1: {
        prompt:
          "Analysiere den kurzen Text: « Faut-il supprimer les devoirs? Certes, les devoirs prennent du temps libre. Pourtant, ils aident à mémoriser les leçons: sans répétition, on oublie vite. En conclusion, il faut des devoirs, mais pas trop. » Nenne Frage, Argument dagegen, Argument dafür und die Meinung des Autors.",
        hints: ["Achte auf certes und pourtant.", "Die Meinung steht im Schluss."],
        model:
          "Frage: Soll man Hausaufgaben abschaffen? Argument dagegen (für die Abschaffung): Hausaufgaben kosten Freizeit (eingeleitet mit certes). Argument dafür (gegen die Abschaffung): Sie helfen beim Einprägen, weil man ohne Wiederholung schnell vergisst (eingeleitet mit pourtant). Meinung des Autors: Hausaufgaben sind nötig, aber nicht zu viele.",
        criteria: ["Frage und beide Argumente sind richtig erkannt.", "Die Rolle von certes und pourtant ist erkannt.", "Die Meinung des Autors ist richtig wiedergegeben."],
      },
      2: {
        prompt:
          "Schreibe einen argumentativen Text (zwölf bis fünfzehn Sätze) zur Frage « Faut-il interdire les portables au collège? ». Gliedere in Einleitung, Gegenseite, eigene Seite und Schluss. Jedes Argument braucht ein Beispiel.",
        hints: ["Plane zuerst zwei Argumente pro Seite.", "Nutze certes, cependant, de plus, par exemple, tout bien considéré."],
        model:
          "Aujourd’hui, presque tous les élèves ont un portable. C’est pourquoi beaucoup de collèges se demandent s’il faut l’interdire. Certes, le portable peut être utile. Par exemple, on peut chercher un mot dans un dictionnaire en ligne pendant le cours. De plus, il permet d’appeler ses parents en cas de problème, quand le bus a du retard par exemple. Cependant, le portable distrait beaucoup les élèves. Dans ma classe, certains regardent des vidéos sous la table au lieu d’écouter. En outre, les réseaux sociaux favorisent le harcèlement: des photos prises en cachette circulent parfois en quelques minutes. Enfin, pendant la récréation, les élèves ne se parlent plus, parce que chacun regarde son écran. Tout bien considéré, je pense qu’il faut interdire le portable pendant les cours et la récréation. On pourrait cependant l’autoriser pour des exercices précis avec le professeur.",
        criteria: ["Der Text hat Einleitung, beide Seiten und einen Schluss.", "Jedes Argument hat ein Beispiel.", "Der Schluss passt zu den Argumenten und bringt nichts Neues."],
      },
    },
  },
];
