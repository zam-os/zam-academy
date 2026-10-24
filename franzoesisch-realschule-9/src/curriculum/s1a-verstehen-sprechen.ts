import type { Lesson } from "../model/types";

/**
 * Stufe 1, erster Teil: Kommunikative Fertigkeiten (Kompetenzerwartungen 1.1.1 bis 1.1.5 und 3.2):
 * Hör- und Hörsehverstehen, Leseverstehen, Alltagsgespräche und kurze Vorträge. Die App spielt keinen Ton
 * ab und nimmt keine Sprache auf: Hören und Sprechen übst du mit Transkripten, Dialogvorlagen und
 * schriftlichen Planungen.
 */
export const S1A: Lesson[] = [
  {
    id: "fr-hoeren-strategien",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.1", "3.2"],
    title: "Hörtexte erfassen: Strategien und Transkripte",
    intro:
      "Mit Strategien vor, beim und nach dem Hören erfasst du den Gesamtzusammenhang und entnimmst gezielt Informationen.",
    paragraphs: [
      "Hör- und Hörsehtexte (Radiointerviews, Gespräche über Berufe, Ausbildung, Erklärungen im Video) wirken schnell, weil du nicht jedes Wort verstehen musst. Die Strategie **vor dem Hören**: Überlege, worum es geht (Titel, Bild, Thema), und notiere, was du erwartest und welche Fragen du beantworten sollst. Das Gehirn sucht dann gezielt nach passenden Wörtern.",
      "**Beim ersten Hören** erfasst du den Gesamtzusammenhang: Wer spricht? Worüber? Wo und wann? Du achtest auf Schlüsselwörter, Namen, Zahlen und Zeiten (quatre heures, deux cents, lundi). Unbekannte Wörter überspringst du und hörst weiter. **Beim zweiten Hören** suchst du die Informationen, nach denen gefragt wurde, und notierst Stichwörter statt ganzer Sätze.",
      "**Nach dem Hören** prüfst du deine Notizen: Passen sie zusammen? Hast du alle Fragen beantwortet? Bei Interviews helfen die Fragewörter qui, où, quand, combien, pourquoi. Die App kann keinen Ton abspielen. Trainiere deshalb mit Transkripten, also aufgeschriebenen Gesprächen, und höre Beispiele aus dem Unterricht, aus Mediatheken oder Radiosendungen zusätzlich an.",
      "Typische Hürden: Das Sprechtempo ist hoch, Wörter werden gebunden und Endungen verschluckt. Hilfreich ist es, nicht auf einzelnen Wörtern hängen zu bleiben, sondern den Sinn zusammenzusetzen. Typische Fehler: Man übersetzt Wort für Wort im Kopf und verpasst darüber den nächsten Satz, oder man notiert zu viel und versteht dann den Zusammenhang nicht mehr.",
    ],
    terms: [
      { term: "Gesamtzusammenhang", text: "Worum es insgesamt geht: Thema, Personen, Ort und Zeit. Du erfasst ihn beim ersten Hören." },
      { term: "Schlüsselwort", text: "Ein Wort, das für die Aussage besonders wichtig ist, zum Beispiel Zahlen, Zeiten, Namen und Berufe." },
      { term: "Transkript", text: "Der aufgeschriebene Text eines Hörtexts. Mit ihm übst du, Informationen zu entnehmen, wenn kein Ton verfügbar ist." },
    ],
    takeaway:
      "Vor dem Hören: Thema und Fragen klären. Beim ersten Hören: Gesamtzusammenhang erfassen. Beim zweiten: gezielt Informationen suchen und Stichwörter notieren. Danach: Notizen prüfen. Ohne Ton übst du mit Transkripten.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Was tust du beim ersten Hören eines Interviews?",
      answer: "Ich erfasse, worum es geht und wer spricht.",
      wrong: ["Ich übersetze jeden Satz Wort für Wort.", "Ich suche ein einziges unbekanntes Wort im Wörterbuch."],
      explanation:
        "Beim ersten Hören erfasst du den Gesamtzusammenhang. Wort-für-Wort-Übersetzen und Nachschlagen nehmen dir die Zeit, den nächsten Satz zu verstehen.",
    },
    workshop: {
      kind: "mark",
      title: "Informationen im Transkript finden",
      instruction:
        "Wähle oben ein Etikett und klicke im Text die passende Information an. Markiere den Beruf, jede Uhrzeit und jede Menge oder Dauer. Nicht alles im Text ist eine gesuchte Information.",
      labels: ["Beruf", "Uhrzeit", "Menge oder Dauer"],
      text: [
        { t: "Journaliste: Bonjour Camille, vous êtes " },
        { t: "apprentie boulangère", label: 0, feedback: "Hier steht der Beruf: Camille ist Auszubildende in einer Bäckerei." },
        { t: ". Pourquoi ce métier? Camille: J’adore le pain! Je me lève à " },
        { t: "quatre heures du matin", label: 1, feedback: "Das ist eine Uhrzeit: Sie steht um vier Uhr morgens auf." },
        { t: " et je commence le travail à " },
        { t: "cinq heures", label: 1, feedback: "Das ist die Uhrzeit, zu der die Arbeit beginnt." },
        { t: ". Nous préparons " },
        { t: "deux cents baguettes", label: 2, feedback: "Hier steht eine Menge: Sie backen zweihundert Baguettes." },
        { t: " chaque jour. J’ai choisi cette voie après un stage de " },
        { t: "deux semaines", label: 2, feedback: "Hier steht eine Dauer: Das Praktikum dauerte zwei Wochen." },
        { t: ". Mes collègues sont sympas et le patron est très gentil." },
      ],
      conclusion: "Berufe, Uhrzeiten, Mengen und Dauer sind typische Schlüsselinformationen. Sie findest du, ohne alles zu übersetzen.",
    },
    casework: {
      title: "Ein Radiointerview verstehen",
      story:
        "Im Radio hörst du ein Interview mit einer Pflegekraft. Du sollst später sagen, was ihr an ihrer Arbeit gefällt und wie lange ihre Ausbildung gedauert hat.",
      steps: [
        {
          question: "Was machst du, bevor du das Interview hörst?",
          options: ["Ich überlege Thema und Fragen.", "Ich lerne das Transkript auswendig.", "Ich schalte das Radio ab."],
          answer: 0,
          explanation: "Vor dem Hören stellst du dich auf das Thema ein und notierst, welche Informationen du suchst.",
        },
        {
          question: "Wie gehst du beim ersten Hören vor?",
          options: ["Ich erfasse den Gesamtzusammenhang.", "Ich schreibe jedes gehörte Wort mit.", "Ich übersetze den Text Satz für Satz."],
          answer: 0,
          explanation: "Beim ersten Hören erfasst du, worum es geht. Genaue Informationen suchst du erst beim zweiten Hören.",
        },
        {
          question: "Wonach hörst du beim zweiten Mal gezielt?",
          options: ["Nach Dauer und Gründen.", "Nach allen Zahlen im gesamten Text.", "Nach allen Wörtern, die ich nicht kenne."],
          answer: 0,
          explanation: "Du hörst gezielt nach den Angaben, nach denen die Aufgabe fragt: Dauer und Gründe.",
        },
      ],
      verdict:
        "Mit klaren Fragen vorab, erstem Überblick und gezieltem zweiten Hören kommst du an die gesuchten Informationen, auch wenn nicht jedes Wort klar ist.",
    },
    tasks: {
      1: {
        prompt:
          "Lies das Transkript: « Bonjour, je m’appelle Paul. J’ai seize ans et j’habite à Strasbourg. Samedi à dix heures, je vais à la piscine avec trois amis. » Beantworte auf Deutsch: Wie alt ist Paul? Wo wohnt er? Wann geht er schwimmen und mit wem?",
        hints: [
          "Suche Zahlen, Orte und Zeiten.",
          "Notiere Stichwörter, keine ganzen Sätze.",
        ],
        model:
          "Paul ist sechzehn Jahre alt und wohnt in Straßburg. Am Samstag um zehn Uhr geht er mit drei Freunden ins Schwimmbad. Die Zahl seiner Jahre, der Ort, die Uhrzeit und die Zahl der Freunde sind die Schlüsselinformationen im Transkript.",
        criteria: [
          "Alter und Wohnort sind richtig genannt.",
          "Uhrzeit, Tag und Zahl der Freunde sind richtig genannt.",
          "Die Antworten sind knapp und nennen nur, was gefragt war.",
        ],
      },
      2: {
        prompt:
          "Schreibe ein kurzes Transkript (fünf bis sechs Sätze) einer Durchsage oder eines Interviews, das du einem Partner vorlesen könntest. Es soll mindestens eine Uhrzeit, eine Zahl und einen Ort enthalten. Schreibe danach drei Fragen dazu.",
        hints: [
          "Wähle ein Thema wie Bahnhof, Schule oder Praktikum.",
          "Die Fragen sollen mit qui, où, quand oder combien beginnen.",
        ],
        model:
          "Attention, mesdames et messieurs. Le train pour Lyon part du quai trois à neuf heures quinze. Il y a vingt minutes de retard. Merci de votre attention. Fragen: Où part le train? À quelle heure? Combien de minutes de retard? Das Transkript enthält Ort, Uhrzeit und Zahl, die Fragen zielen darauf.",
        criteria: [
          "Uhrzeit, Zahl und Ort kommen im Transkript vor.",
          "Die drei Fragen lassen sich anhand des Texts beantworten.",
          "Der Text ist verständlich und in sich stimmig.",
        ],
      },
    },
  },
  {
    id: "fr-lesen-textsorten",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.2", "3.2"],
    title: "Texte lesen und erschließen",
    intro:
      "Mit Textsorte, Überschrift und Schlüsselwörtern erschließt du Prospekte, Rezepte, Blogs und Briefe, auch wenn du nicht jedes Wort kennst.",
    paragraphs: [
      "Du liest erzählende, beschreibende, berichtende und dialogische Texte, zum Beispiel aus Jugendzeitschriften, Blogs oder Briefen, und Gebrauchstexte wie Reiseprospekte, Anleitungen und Rezepte. Der erste Schritt ist immer, die **Textsorte** zu erkennen: Wer schreibt? Für wen? Mit welchem Ziel? Ein Reiseprospekt will werben, ein Rezept anleiten, ein Blog erzählen und persönlich berichten.",
      "Lies zuerst Überschrift, Zwischentitel und Bilder und stelle Vermutungen an (**Globalverstehen**). Dann liest du den Text einmal ganz durch, ohne an unbekannten Wörtern hängen zu bleiben. Anschließend suchst du gezielt Informationen (**Detailverstehen**) und unterstreichst Schlüsselwörter. Ein Wort, das häufig vorkommt oder in der Überschrift steht, ist meist wichtig. Zahlen, Namen und Ortsangaben sind leicht zu finden.",
      "Für unbekannte Wörter nutzt du Wortfamilien, Kontext und ähnliche Wörter (siehe Lektion zu Wortbildung). Bei Rezepten erkennst du den Imperativ (mélangez, ajoutez), bei Prospekten Aufforderungen (venez découvrir, réservez maintenant) und Aufzählungen. Texte über Berufe und das Leben in Frankreich nennen oft Zeiten, Preise und Orte.",
      "Typische Fehler: den Text Wort für Wort übersetzen statt den Sinn zu erfassen, und aus einzelnen Wörtern vorschnell auf die Aussage schließen. Prüfe immer an mehreren Stellen, ob dein Verständnis zum ganzen Text passt.",
    ],
    terms: [
      { term: "Textsorte", text: "Die Art des Texts, zum Beispiel Rezept, Prospekt, Blog oder Brief. Sie sagt dir, was du vom Text erwarten kannst." },
      { term: "Globalverstehen", text: "Das Verstehen des Gesamtzusammenhangs aus Überschrift, Bildern und einmaligem Überfliegen." },
      { term: "Detailverstehen", text: "Das gezielte Suchen von einzelnen Informationen wie Zahlen, Orten und Zeiten." },
    ],
    takeaway:
      "Erkenne zuerst die Textsorte, lies dann Überschrift und Bilder, erfasse den Gesamtzusammenhang und suche erst danach Details. Unbekannte Wörter erschließt du über Kontext und Wortfamilie.",
    sourceIds: ["lp", "lepointdufle", "francefr"],
    quiz: {
      question: "Woran erkennst du, dass es ein Rezept ist?",
      answer: "Am Imperativ und an Mengenangaben.",
      wrong: ["An der Anrede und der Grußformel.", "An der Werbung für ein Reiseziel."],
      explanation:
        "Rezepte enthalten Anweisungen im Imperativ (mélangez, ajoutez) und Mengenangaben. Anrede und Grußformel gehören zu Briefen, Werbung für Reiseziele zu Prospekten.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Textsorte ist das?",
      instruction: "Ordne jeden Ausschnitt der Textsorte zu, aus der er stammt.",
      categories: ["Rezept", "Reiseprospekt", "Blog", "Anleitung"],
      entries: [
        { text: "Mélangez la farine et le sucre, puis ajoutez deux œufs.", target: 0, feedback: "Imperativ und Zutaten sind typisch für ein Rezept." },
        { text: "Venez découvrir la Provence: soleil, plage et petits villages!", target: 1, feedback: "Werbende Aufforderung und Schlagwörter passen zu einem Prospekt." },
        { text: "Salut tout le monde! Aujourd’hui, je vous raconte mon premier jour de stage.", target: 2, feedback: "Persönliche Anrede und Erzählung sind typisch für einen Blog." },
        { text: "Pour utiliser le distributeur, insérez votre carte, puis tapez votre code.", target: 3, feedback: "Schritte im Imperativ ohne Zutaten gehören zu einer Anleitung." },
        { text: "Ajoutez une pincée de sel et laissez cuire dix minutes.", target: 0, feedback: "Zutat, Menge und Zeit gehören zu einem Rezept." },
        { text: "Réservez maintenant votre séjour au bord de la mer et profitez de nos offres!", target: 1, feedback: "Aufforderung zur Buchung und Angebote sind typisch für einen Prospekt." },
      ],
      conclusion: "Imperativ und Mengen: Rezept. Werbende Aufforderung: Prospekt. Persönliche Erzählung: Blog. Schritte: Anleitung.",
    },
    casework: {
      title: "Ein Blog über das Praktikum",
      story:
        "Du liest im Blog einer Schülerin: « Salut! Cette semaine, je fais un stage dans une librairie à Lyon. Le patron est sympa. Je commence à neuf heures et je finis à dix-sept heures. Hier, j’ai aidé une cliente à trouver un livre. »",
      steps: [
        {
          question: "Welche Textsorte liegt vor?",
          options: ["Ein Blog.", "Ein Rezept für Gäste.", "Eine Anleitung zum Gerät."],
          answer: 0,
          explanation: "Anrede mit Salut, Ich-Erzählung und persönliche Erfahrungen zeigen einen Blog.",
        },
        {
          question: "Wann beginnt und endet der Arbeitstag?",
          options: ["Um neun und um siebzehn Uhr.", "Um sieben und um fünf Uhr.", "Um acht und um sechzehn Uhr."],
          answer: 0,
          explanation: "Im Text stehen « neuf heures » und « dix-sept heures ». Zahlen und Zeiten sind leicht zu finden.",
        },
        {
          question: "Was hat die Schülerin gestern getan?",
          options: ["Sie half einer Kundin.", "Sie hat ein Buch geschrieben.", "Sie hat den Chef gefragt."],
          answer: 0,
          explanation: "« J’ai aidé une cliente » heißt „Ich habe einer Kundin geholfen“.",
        },
      ],
      verdict:
        "Aus Textsorte, Zahlen und einem Satz im passé composé verstehst du den Blog, auch wenn dir einzelne Wörter fehlen.",
    },
    tasks: {
      1: {
        prompt:
          "Lies: « Venez à Annecy! Louez un vélo et faites le tour du lac. Réservez dès maintenant pour 15 euros par jour. » Beantworte auf Deutsch: Welche Textsorte ist es? Was wird angeboten? Wie viel kostet es?",
        hints: [
          "Achte auf den Imperativ und auf Zahlen.",
          "Beantworte jede Frage mit einem Satz.",
        ],
        model:
          "Es ist ein Reiseprospekt oder eine Werbung. Angeboten wird ein Fahrrad, mit dem man um den See radeln kann. Es kostet fünfzehn Euro pro Tag. Erkennbar ist die Textsorte an den werbenden Aufforderungen (venez, louez, réservez) und dem Preis.",
        criteria: [
          "Die Textsorte ist richtig erkannt und begründet.",
          "Das Angebot wird richtig wiedergegeben.",
          "Der Preis ist richtig genannt.",
        ],
      },
      2: {
        prompt:
          "Wähle einen kurzen französischen Text aus einer Zeitschrift oder dem Internet (Blog, Prospekt oder Rezept, 5 bis 8 Zeilen). Schreibe auf Deutsch fünf Sätze: Textsorte, Thema, drei Informationen und welche Wörter du erschlossen hast.",
        hints: [
          "Lies zuerst Überschrift und Bilder.",
          "Notiere, wie du unbekannte Wörter erschlossen hast.",
        ],
        model:
          "Der Text ist ein Rezept für Crêpes. Es geht um Zutaten und Zubereitung. Man braucht Mehl, Eier und Milch und lässt den Teig zehn Minuten ruhen. Das Wort « pincée » habe ich aus dem Zusammenhang erschlossen: Es steht bei Salz und bedeutet eine Prise.",
        criteria: [
          "Textsorte und Thema sind richtig erkannt.",
          "Mindestens drei Informationen aus dem Text werden genannt.",
          "Ein erschlossenes Wort wird mit Begründung genannt.",
        ],
      },
    },
  },
  {
    id: "fr-alltag-sprechen",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.3"],
    title: "Alltagsgespräche: sich einigen, Vorlieben nennen, begründen",
    intro:
      "In Gesprächen über Wochenende und Feiern einigst du dich, nennst Vorlieben und Abneigungen und begründest sie.",
    paragraphs: [
      "In Alltagsgesprächen planst du etwas mit anderen, zum Beispiel das Wochenende oder eine Feier. Typische Sprechabsichten sind **vorschlagen** (« On va au cinéma? », « Tu as envie de sortir? », « Ça te dit de + Infinitiv? »), **zustimmen** (« D’accord. », « Pourquoi pas? », « Bonne idée! ») und **widersprechen** (« Je ne suis pas d’accord. », « Moi, je préfère… »).",
      "**Vorlieben und Abneigungen** drückst du mit j’aime, j’adore, je préfère, je n’aime pas, je déteste aus. « J’adore le cinéma, mais je n’aime pas les films d’horreur. » Mit **parce que** oder **car** begründest du: « Je préfère le cinéma parce que je n’aime pas le bruit. » So wirkt dein Beitrag nachvollziehbar und das Gespräch kommt voran.",
      "**Sich einigen** heißt, einen gemeinsamen Plan zu finden: « On fait comme ça? », « Ça te va? », « Alors, c’est décidé! », « On se retrouve à quelle heure? » Gehe auf den Gesprächspartner ein: « Tu as raison. », « C’est vrai. », « Qu’est-ce que tu en penses? » Das zeigt, dass du zuhörst.",
      "Beim Sprechen übst du mit einem Partner oder mit einem Dialog auf Papier. Die App prüft keine gesprochene Sprache, aber hier hilft sie dir mit Mustern, Reihenfolgen und eigenen Entwürfen. Typische Fehler sind fehlende Begründungen und zu knappe Antworten (« Oui. » oder « Non. »). Sage lieber einen vollständigen Satz und nenne einen Grund.",
    ],
    terms: [
      { term: "vorschlagen", text: "Du machst einen Vorschlag: On va au cinéma? Tu as envie de sortir? Ça te dit de + Infinitiv?" },
      { term: "sich einigen", text: "Du findest mit dem Partner einen gemeinsamen Plan: Ça te va? C’est décidé! On se retrouve à quelle heure?" },
      { term: "begründen", text: "Du nennst einen Grund mit parce que oder car: Je préfère le cinéma parce que je n’aime pas le bruit." },
    ],
    takeaway:
      "Ein Alltagsgespräch hat Vorschlag, Zustimmung oder Widerspruch, Vorlieben mit Begründung und Einigung. Antworte mit vollständigen Sätzen und gehe auf den Partner ein.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Wie sagst du: „Ich bevorzuge das Kino, weil ich Lärm nicht mag“?",
      answer: "Je préfère le cinéma parce que je n’aime pas le bruit.",
      wrong: ["Je préfère le cinéma donc je n’aime pas le bruit.", "Je préfère le cinéma pour que je n’aime pas le bruit."],
      explanation:
        "Die Begründung steht mit parce que. Donc zeigt eine Folge, pour que ein Ziel und passt hier nicht.",
    },
    workshop: {
      kind: "timeline",
      title: "Ein Gespräch in die richtige Reihenfolge bringen",
      instruction: "Bringe die Zeilen eines Gesprächs in eine sinnvolle Reihenfolge: Vorschlag, Zustimmung, Auswahl, Begründung, Einigung.",
      categories: [],
      entries: [
        { text: "– Salut Léa, qu’est-ce que tu fais samedi? Tu as envie de sortir?", target: 0, feedback: "Das Gespräch beginnt mit Begrüßung und Frage nach dem Plan." },
        { text: "– Oui, pourquoi pas? Tu as une idée?", target: 1, feedback: "Zustimmung und Rückfrage folgen auf den Vorschlag." },
        { text: "– On peut aller au cinéma, ou on peut faire du bowling. Tu préfères quoi?", target: 2, feedback: "Es werden zwei Möglichkeiten genannt und der Partner wird gefragt." },
        { text: "– Je préfère le cinéma parce que je n’aime pas le bruit. Ça te va?", target: 3, feedback: "Die Vorliebe wird begründet und es wird nach Zustimmung gefragt." },
        { text: "– D’accord, c’est décidé! On se retrouve à quelle heure?", target: 4, feedback: "Am Ende steht die Einigung und die Frage nach der Zeit." },
      ],
      conclusion: "Vorschlag, Zustimmung, Auswahl, Begründung und Einigung bilden den Weg eines Alltagsgesprächs.",
    },
    casework: {
      title: "Eine Feier planen",
      story:
        "Zwei Freunde planen eine Party: « Et si on organisait une fête samedi? – Bonne idée! Mais je n’aime pas la musique trop forte, car j’habite près d’une voisine âgée. – Alors, on invite quatre amis. D’accord? – D’accord, c’est décidé. »",
      steps: [
        {
          question: "Welche Sprechabsicht hat « Bonne idée! »?",
          options: ["Zustimmung.", "Widerspruch.", "Begründung."],
          answer: 0,
          explanation: "Bonne idée! zeigt, dass der Partner mit dem Vorschlag einverstanden ist.",
        },
        {
          question: "Welcher Teil nennt eine Begründung?",
          options: ["« car j’habite près d’une voisine »", "« Alors, on invite quatre amis »", "« D’accord, c’est décidé, alors »"],
          answer: 0,
          explanation: "Car leitet die Begründung ein: Der Sprecher will wegen der Nachbarin nicht zu laut feiern.",
        },
        {
          question: "Womit endet das Gespräch?",
          options: ["Mit einer Einigung.", "Mit einem Widerspruch.", "Mit einer neuen Frage."],
          answer: 0,
          explanation: "« D’accord, c’est décidé » beendet das Gespräch mit einer gemeinsamen Entscheidung.",
        },
      ],
      verdict:
        "Das Gespräch führt über Vorschlag, Bedenken mit Begründung und Gegenvorschlag zur Einigung. So planst du in der Praxis gemeinsam.",
    },
    tasks: {
      1: {
        prompt:
          "Ergänze den Dialog mit drei vollständigen Sätzen: « – Tu as envie de faire quelque chose ce week-end? – (Zustimmung). – Tu préfères le cinéma ou la piscine? – (Vorliebe mit Begründung). – (Einigung). »",
        hints: [
          "Nutze pourquoi pas, je préfère … parce que …, d’accord.",
          "Schreibe vollständige Sätze statt Ja oder Nein.",
        ],
        model:
          "– Oui, pourquoi pas? – Je préfère la piscine parce que j’adore nager. – D’accord, c’est décidé! On se retrouve à deux heures. Der Dialog enthält Zustimmung, Vorliebe mit Begründung und Einigung.",
        criteria: [
          "Zustimmung, Vorliebe mit Begründung und Einigung kommen vor.",
          "Es werden vollständige Sätze verwendet.",
          "Die Begründung ist mit parce que oder car angeschlossen.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Dialog von acht bis zehn Zeilen, in dem zwei Personen eine Geburtstagsfeier planen: Ort, Gäste, Essen und Zeit. Sie sind sich nicht sofort einig und begründen ihre Meinung.",
        hints: [
          "Baue Vorschlag, Widerspruch, Begründung, Gegenvorschlag und Einigung ein.",
          "Nutze j’aime, je préfère, je n’aime pas, parce que, car.",
        ],
        model:
          "– On fête mon anniversaire chez moi? – Pourquoi pas, mais je préfère le parc parce qu’il y a plus de place. – Je n’aime pas le parc, car il peut pleuvoir. – Alors, on décide au dernier moment. – Bonne idée! On invite combien d’amis? – Dix, c’est bien. – Et on mange quoi? – De la pizza, j’adore ça! – D’accord, c’est décidé.",
        criteria: [
          "Vorschlag, Widerspruch, Begründung und Einigung kommen vor.",
          "Mindestens zwei Vorlieben oder Abneigungen werden genannt.",
          "Der Dialog ist logisch aufgebaut.",
        ],
      },
    },
  },
  {
    id: "fr-kurzvortrag",
    lb: 1,
    unit: "1.1",
    covers: ["1.1.4", "1.1.5"],
    title: "Kurze Vorträge, Beschreibungen und Berichte",
    intro:
      "Mit Stichpunkten hältst du einen sehr kurzen Vortrag und beschreibst Dinge, Orte, Abläufe sowie Vergangenes und Künftiges.",
    paragraphs: [
      "Ein sehr kurzer Vortrag zu einem Alltagsthema (Tagesablauf, Berufswahl, Wochenende) hat drei Teile. **Einleitung:** Begrüßung und Thema: « Bonjour, aujourd’hui je vais parler de mon métier de rêve. » **Hauptteil:** Die wichtigsten Informationen in logischer Reihenfolge mit d’abord, ensuite, puis, enfin. **Schluss:** Zusammenfassung und Dank: « Voilà, c’est tout. Merci de votre attention! »",
      "**Stichpunkte** helfen dir, den Faden zu behalten: Notiere Schlüsselwörter, nicht ganze Sätze, zum Beispiel « 7h: se lever; 8h: bus; 17h: sport ». Beim Sprechen formulierst du daraus vollständige Sätze. Das macht deine Rede natürlicher und verhindert, dass du vom Blatt abliest.",
      "Beim **Beschreiben** nennst du Gegenstände, Orte, Personen und Abläufe: « C’est un grand parc avec un lac. », « Ma sœur est petite et elle a les cheveux longs. » Für Abläufe nutzt du die Reihenfolgewörter. Über Vergangenes sprichst du im passé composé und imparfait (« Hier, je suis allé au cinéma. »), über Künftiges im futur proche oder futur simple (« Demain, je vais travailler. », « Plus tard, je serai médecin. »).",
      "Typische Fehler sind ein Vortrag ohne Einleitung und Schluss, zu viele Informationen in einem Satz und Wörter, die nicht zum Thema gehören. Prüfe nach dem Entwurf: Hat mein Vortrag drei Teile? Verwende ich mindestens zwei Zeitformen sinnvoll? Zu kurz ist ein Vortrag nicht, wenn er die Aufgabe erfüllt.",
    ],
    terms: [
      { term: "Einleitung, Hauptteil, Schluss", text: "Die drei Teile eines Vortrags: Thema nennen, Informationen in Reihenfolge bringen, zusammenfassen und danken." },
      { term: "Stichpunkte", text: "Kurze Schlüsselwörter, die dich beim Sprechen leiten. Du formulierst daraus vollständige Sätze." },
      { term: "d’abord, ensuite, enfin", text: "Reihenfolgewörter für den Hauptteil: zuerst, dann, schließlich. Sie machen Abläufe klar." },
    ],
    takeaway:
      "Ein kurzer Vortrag hat Einleitung, Hauptteil und Schluss. Notiere Stichpunkte, beschreibe klar und nutze Zeitformen passend zu Vergangenem, Gegenwärtigem und Zukünftigem.",
    sourceIds: ["lp", "lepointdufle", "dfjw"],
    quiz: {
      question: "Wie beginnst du einen kurzen Vortrag über deinen Berufswunsch?",
      answer: "Bonjour, aujourd’hui je vais parler de mon métier de rêve.",
      wrong: ["D’abord, je me lève à six heures du matin chaque jour.", "Voilà, c’est tout pour mon exposé, merci beaucoup."],
      explanation:
        "Die Einleitung begrüßt und nennt das Thema. D’abord gehört in den Hauptteil, voilà und merci in den Schluss.",
    },
    workshop: {
      kind: "classify",
      title: "Einleitung, Hauptteil oder Schluss?",
      instruction: "Ordne jeden Satz dem Teil eines Vortrags zu.",
      categories: ["Einleitung", "Hauptteil", "Schluss"],
      entries: [
        { text: "Bonjour, aujourd’hui, je vais parler de mon métier de rêve.", target: 0, feedback: "Begrüßung und Themenangabe gehören an den Anfang." },
        { text: "D’abord, je me lève à sept heures, ensuite je prends le bus.", target: 1, feedback: "Reihenfolgewörter beschreiben einen Ablauf im Hauptteil." },
        { text: "Voilà, c’est tout pour mon exposé. Merci de votre attention!", target: 2, feedback: "Zusammenfassung und Dank stehen am Schluss." },
        { text: "Je voudrais vous présenter mon projet de stage.", target: 0, feedback: "Hier wird das Thema angekündigt, also Einleitung." },
        { text: "Mon père travaille à l’hôpital et il est médecin depuis dix ans.", target: 1, feedback: "Hier steht eine Information zum Thema, also Hauptteil." },
        { text: "Pour conclure, je veux devenir infirmière parce que j’aime aider.", target: 2, feedback: "Pour conclure leitet den Schluss ein." },
      ],
      conclusion: "Einleitung kündigt an, Hauptteil informiert, Schluss fasst zusammen und dankt.",
    },
    casework: {
      title: "Den Tagesablauf vortragen",
      story:
        "Du bereitest einen Vortrag über deinen Tag vor. Deine Stichpunkte lauten: « 7h: se lever; 8h: bus; midi: cantine; 17h: sport; 22h: se coucher ».",
      steps: [
        {
          question: "Womit beginnst du?",
          options: ["Mit Begrüßung und Thema.", "Mit der Uhrzeit des Aufstehens.", "Mit einem Dank an die Zuhörer."],
          answer: 0,
          explanation: "Die Einleitung begrüßt die Zuhörer und nennt das Thema.",
        },
        {
          question: "Wie machst du aus den Stichpunkten Sätze?",
          options: ["Mit Reihenfolgewörtern.", "Ich lese die Stichpunkte nur vor.", "Ich lasse einige Zeiten einfach weg."],
          answer: 0,
          explanation: "Du formulierst mit d’abord, ensuite, puis und passenden Verben vollständige Sätze.",
        },
        {
          question: "Wie schließt du den Vortrag?",
          options: ["Mit Zusammenfassung und Dank.", "Mit einer weiteren neuen Information.", "Mit einer Frage an die ganze Klasse."],
          answer: 0,
          explanation: "Der Schluss fasst zusammen und dankt für die Aufmerksamkeit.",
        },
      ],
      verdict:
        "Aus Stichpunkten wird ein dreiteiliger Vortrag. Einleitung, Hauptteil mit Reihenfolge und Schluss geben ihm Struktur.",
    },
    tasks: {
      1: {
        prompt:
          "Schreibe einen sehr kurzen Vortrag von fünf Sätzen über deinen Tagesablauf mit Einleitung, zwei Sätzen für den Hauptteil (d’abord, ensuite) und Schluss.",
        hints: [
          "Beginne mit « Bonjour, aujourd’hui je vais parler de … ».",
          "Schließe mit « Voilà, merci! ».",
        ],
        model:
          "Bonjour, aujourd’hui je vais parler de mon quotidien. D’abord, je me lève à sept heures et je prends le petit déjeuner. Ensuite, je prends le bus pour aller à l’école. Voilà, c’est ma journée. Merci de votre attention!",
        criteria: [
          "Einleitung, Hauptteil und Schluss sind erkennbar.",
          "Reihenfolgewörter sind eingesetzt.",
          "Die Sätze sind vollständig und verständlich.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen kurzen Vortrag (acht bis zehn Sätze) über deinen Berufswunsch mit Beschreibung des Berufs, einem Rückblick (was du schon getan hast) und einem Ausblick (was du tun wirst). Verwende passé composé, imparfait und futur.",
        hints: [
          "Rückblick: « Hier, j’ai fait un stage. » oder « Quand j’étais petit, je … ».",
          "Ausblick: « Plus tard, je serai … » oder « Je vais … ».",
        ],
        model:
          "Bonjour, aujourd’hui je vais parler de mon métier de rêve: infirmière. C’est un métier utile qui aide les gens malades. Quand j’étais petite, j’aimais jouer au docteur avec mes poupées. L’année dernière, j’ai fait un stage dans un hôpital et j’ai beaucoup aimé. Plus tard, je serai infirmière dans un grand hôpital. Pour cela, je vais d’abord finir l’école. Voilà, c’est mon rêve, merci de votre attention!",
        criteria: [
          "Der Vortrag hat Einleitung, Hauptteil und Schluss.",
          "Rückblick und Ausblick verwenden passende Zeitformen.",
          "Der Beruf wird verständlich beschrieben.",
        ],
      },
    },
  },
];
