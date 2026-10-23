import type { Lesson } from "../model/types";

/** Lernbereich 3, zweiter Teil: Texte planen, schreiben und überarbeiten (3.2 und 3.3). */
export const LB3B: Lesson[] = [
  {
    id: "de-stoffsammlung",
    lb: 3,
    unit: "3.2",
    covers: ["3.2.1"],
    title: "Stoff sammeln: Quellen und Verfahren nutzen",
    intro:
      "Vor dem Schreiben sammelst du Material. Quellen und Verfahren wie Brainstorming, W-Fragen und Cluster füllen dein Thema mit Inhalt.",
    paragraphs: [
      "Ein guter Text beginnt nicht mit dem ersten Satz, sondern mit dem Material. Bei einem Schreibauftrag klärst du zuerst, **worüber** du schreibst, **wozu** und **für wen**. Danach stellst du zusammen, was du für den Text brauchst: eigenes Wissen, Beobachtungen, Zahlen, Aussagen anderer und Beispiele. Aus Klasse 8 kennst du den nächsten Schritt: gesammeltes Material auf seine Verwertbarkeit prüfen und nach Bedeutung ordnen. Jetzt geht es um den Schritt davor, auch für umfangreichere Texte: Wie kommst du an das Material?",
      "Informationen findest du in **kontinuierlichen Texten**. Das sind Texte aus fortlaufenden Sätzen wie ein Zeitungsartikel, ein Lexikoneintrag oder eine Reportage. Ebenso wichtig sind **diskontinuierliche Texte**: Sie zeigen Informationen in Zeilen, Spalten, Linien oder Bildern, zum Beispiel als Tabelle, Diagramm, Karte oder Schaubild. Aus einem Diagramm liest du Zahlen und Entwicklungen ab, ein Artikel erklärt oft die Gründe dahinter. Nutze beide Arten und prüfe jede Quelle: Wer hat den Text veröffentlicht? Wie aktuell ist er? Werden Aussagen belegt? Notiere dir bei jeder Information die Quelle: wer sie geschrieben hat, den Titel und das Datum. So kannst du später genau angeben, woher etwas stammt.",
      "Zur Stoffsammlung gibt es bewährte Verfahren. Beim **Brainstorming** schreibst du in kurzer Zeit alle Einfälle zu einem Schlüsselbegriff auf, ohne sie zu bewerten. Mit **W-Fragen** (Wer? Was? Wann? Wo? Wie? Warum?) findest du Aspekte, die du sonst übersehen hättest, und erkennst, wo dir noch Wissen fehlt. Beim **Cluster** schreibst du den Schlüsselbegriff in die Mitte, ordnest deine Einfälle in Kreisen darum herum an und verbindest Zusammengehöriges mit Linien. So entstehen Teilthemen. Bei der **Definition von Schlüsselbegriffen** klärst du genau, was ein zentrales Wort bedeutet und was nicht dazugehört. Dafür helfen Wörterbuch und Lexikon.",
      "Welches Verfahren du wählst, hängt vom Auftrag ab. Weißt du noch wenig, hilft ein Brainstorming, überhaupt Ideen zu finden. Kennst du das Thema schon grob, zeigen W-Fragen die Lücken, und ein Cluster sortiert die Teilthemen. Ist ein Begriff unklar, definierst du ihn zuerst, sonst schreibst du am Thema vorbei. Nach dem Sammeln wählst du aus: Was passt zu Thema, Schreibabsicht und Leserschaft, was nicht? Das Aussortierte ist kein Verlust, sondern Teil der Planung.",
    ],
    terms: [
      {
        term: "Kontinuierlicher Text",
        text: "Ein Text aus fortlaufenden Sätzen, zum Beispiel ein Zeitungsartikel oder ein Lexikoneintrag.",
      },
      {
        term: "Diskontinuierlicher Text",
        text: "Ein Text, der Informationen in Zeilen, Spalten, Linien oder Bildern zeigt, zum Beispiel eine Tabelle oder ein Diagramm.",
      },
      {
        term: "Brainstorming",
        text: "Eine schnelle, ungeordnete Sammlung aller Einfälle zu einem Schlüsselbegriff, ohne etwas zu bewerten.",
      },
      {
        term: "W-Fragen",
        text: "Fragen wie Wer, Was, Wann, Wo, Wie und Warum, die ein Thema aus mehreren Richtungen öffnen.",
      },
      {
        term: "Cluster",
        text: "Eine Ideenlandkarte: Der Schlüsselbegriff steht in der Mitte, Einfälle und Teilthemen sind darum angeordnet und verbunden.",
      },
      {
        term: "Schlüsselbegriff",
        text: "Ein zentrales Wort des Themas, dessen Bedeutung du klären musst, bevor du darüber schreibst.",
      },
    ],
    examples: [
      {
        title: "Stoffsammlung zum Schulweg (eigens verfasst)",
        text: "Auftrag: Schreibe für die Schülerzeitung einen Artikel über den Schulweg mit dem Fahrrad.\nW-Fragen: Wer fährt Rad? Wo ist es gefährlich? Wann ist am meisten los? Warum nehmen manche lieber den Bus?\nTabelle (erfunden), Klasse 9b, 24 Befragte: Rad 9, Bus 11, zu Fuß 4.",
        analysis:
          "Die **W-Fragen** öffnen vier Aspekte für den Artikel. Die Tabelle ist ein **diskontinuierlicher Text**: Sie liefert Zahlen, erklärt aber nicht, warum jemand Rad oder Bus wählt. Die Warum-Frage zeigt deshalb eine Lücke. Dafür braucht der Artikel noch einen **kontinuierlichen Text**, zum Beispiel einen Bericht oder ein Gespräch mit Betroffenen. So führt die Sammlung direkt zur nächsten Recherche.",
      },
    ],
    takeaway:
      "Sammle erst Material, bevor du schreibst: aus kontinuierlichen und diskontinuierlichen Texten mit notierter Quelle. Brainstorming sammelt Einfälle, W-Fragen zeigen Lücken, ein Cluster ordnet Teilthemen, und Schlüsselbegriffe definierst du vorab.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welche Quelle ist ein diskontinuierlicher Text?",
      answer: "Ein Säulendiagramm mit den Besucherzahlen des Schwimmbads im Jahresverlauf",
      wrong: [
        "Ein Zeitungsbericht, der die Besucherzahlen des Schwimmbads im Jahresverlauf erklärt",
        "Ein Interview mit der Leiterin des Schwimmbads über die Besucherzahlen im Jahr",
      ],
      explanation:
        "Ein Säulendiagramm zeigt Informationen in Säulen und Achsen statt in fortlaufenden Sätzen und ist deshalb diskontinuierlich. Bericht und Interview bestehen aus fortlaufenden Sätzen. Sie sind kontinuierliche Texte, auch wenn sie dieselben Zahlen nennen.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Verfahren ist das?",
      instruction:
        "Jan soll einen Text zum Thema „Ehrenamt“ schreiben und sammelt dafür Material. Ordne jede Handlung dem Verfahren zu, das sie zeigt.",
      categories: ["Brainstorming", "W-Fragen", "Cluster", "Definition eines Schlüsselbegriffs"],
      entries: [
        {
          text: "Er schreibt zwei Minuten lang alles auf, was ihm zu „Ehrenamt“ einfällt, ohne es zu sortieren oder zu bewerten.",
          target: 0,
          feedback: "Alle Einfälle werden zunächst ungeordnet und ohne Bewertung gesammelt.",
        },
        {
          text: "Er fragt: Wer arbeitet ehrenamtlich? Wo? Wann? Warum? Mit welchen Folgen für andere?",
          target: 1,
          feedback: "Die Fragewörter öffnen das Thema aus mehreren Richtungen und zeigen Wissenslücken.",
        },
        {
          text: "Er schreibt „Ehrenamt“ in die Mitte, zeichnet Kreise für Feuerwehr, Sportverein und Tafel und verbindet verwandte Ideen.",
          target: 2,
          feedback: "Der Schlüsselbegriff steht in der Mitte, die Teilthemen sind darum angeordnet und verbunden.",
        },
        {
          text: "Er schlägt nach, was „Ehrenamt“ genau bedeutet, und grenzt es von bezahlter Arbeit ab.",
          target: 3,
          feedback: "Hier wird ein zentraler Begriff geklärt und abgegrenzt, bevor der Text entsteht.",
        },
        {
          text: "Er schreibt drei Minuten lang jeden Einfall zu „Ehrenamt“ auf, auch ungewöhnliche, und streicht noch nichts durch.",
          target: 0,
          feedback: "Schnelles Sammeln ohne Bewertung ist ein Brainstorming zu einem Schlüsselbegriff.",
        },
        {
          text: "Er legt eine Tabelle an und trägt zu jeder Frage (Wer? Wann? Wo?) Stichworte ein.",
          target: 1,
          feedback: "Die Tabelle ordnet Stichworte den W-Fragen zu und macht Lücken sichtbar.",
        },
      ],
      conclusion:
        "Brainstorming sammelt Einfälle, W-Fragen zeigen Aspekte und Lücken, das Cluster verbindet Teilthemen, und die Definition klärt zentrale Wörter. Oft nutzt du mehrere nacheinander.",
    },
    casework: {
      title: "Quellen für einen Artikel prüfen",
      story:
        "Mara schreibt einen Artikel über Energiesparen an ihrer Schule. Sie hat vier Quellen gesammelt: **einen Zeitungsbericht über Stromsparen an Schulen, ein Säulendiagramm mit dem Stromverbrauch ihrer Schule in den letzten fünf Jahren, einen anonymen Beitrag in einem Forum und ein Interview mit dem Hausmeister.**",
      steps: [
        {
          question: "Welche der Quellen ist ein diskontinuierlicher Text?",
          options: ["Das Säulendiagramm", "Der Zeitungsbericht", "Das Interview mit dem Hausmeister"],
          answer: 0,
          explanation:
            "Das Diagramm zeigt seine Informationen in Säulen und Achsen, nicht in fortlaufenden Sätzen. Bericht und Interview sind kontinuierliche Texte.",
        },
        {
          question: "Welche Quelle muss Mara besonders kritisch prüfen, bevor sie Aussagen daraus übernimmt?",
          options: [
            "Den anonymen Forumsbeitrag, weil sich seine Angaben nicht prüfen lassen",
            "Das Interview, weil der Hausmeister die Schule aus eigener Erfahrung kennt",
            "Das Diagramm, weil Zahlen darin grundsätzlich vorsichtig zu lesen sind",
          ],
          answer: 0,
          explanation:
            "Bei einem anonymen Beitrag lässt sich nicht prüfen, wer schreibt und woher die Angaben stammen. Der Hausmeister spricht aus eigener Erfahrung, und die Zahlen des Diagramms lassen sich über ihre Quelle nachprüfen.",
        },
        {
          question:
            "Das Diagramm zeigt, dass der Verbrauch seit zwei Jahren sinkt. Welche Frage sollte Mara dem Hausmeister im Interview stellen?",
          options: [
            "Warum ist der Verbrauch gesunken?",
            "Wie viele Schülerinnen und Schüler besuchen die Schule?",
            "Wann wurde das Schulhaus gebaut?",
          ],
          answer: 0,
          explanation:
            "Das Diagramm zeigt, was geschieht, aber nicht, warum. Die Warum-Frage füllt diese Lücke und liefert Material für den Artikel.",
        },
        {
          question: "Was sollte Mara bei jeder Information zusätzlich notieren?",
          options: [
            "Die Quelle: wer sie geschrieben hat, den Titel und das Datum",
            "Nur das Datum, an dem sie die Information gefunden hat",
            "Nur ihre eigene Meinung dazu",
          ],
          answer: 0,
          explanation:
            "Mit der Quelle kann Mara später belegen, woher eine Aussage stammt, und Angaben noch einmal nachprüfen.",
        },
      ],
      verdict:
        "Mara nutzt kontinuierliche und diskontinuierliche Texte gemeinsam, prüft jede Quelle und notiert, woher eine Information stammt. Fehlende Gründe holt sie sich mit einer gezielten W-Frage.",
    },
    tasks: {
      1: {
        prompt:
          "Du sollst einen Text zum Thema „Ein Schülercafé an unserer Schule“ schreiben. Sammle Material: Notiere fünf Einfälle als Brainstorming, stelle drei W-Fragen mit Antworten in Stichworten und definiere „Schülercafé“ in einem Satz.",
        hints: [
          "Schreibe beim Brainstorming alles auf, auch Ungewöhnliches, und sortiere erst danach.",
          "Eine Definition nennt einen Oberbegriff und Merkmale, zum Beispiel „Ein Schülercafé ist ein Raum, in dem …“.",
        ],
        model:
          "Brainstorming: Getränke, Kuchenverkauf, Sitzecke, Spielekiste, Geld für die Klassenkasse. W-Fragen: Wer betreibt das Café? Eine Gruppe aus Klasse 9 mit einer Lehrkraft. Wann hat es geöffnet? In den großen Pausen. Wo könnte es liegen? Im leeren Raum neben der Aula. Definition: Ein Schülercafé ist ein Raum in der Schule, in dem Schülerinnen und Schüler in den Pausen Getränke und Snacks anbieten und gemeinsam Zeit verbringen.",
        criteria: [
          "Nennt mindestens fünf verschiedene Einfälle im Brainstorming.",
          "Stellt drei W-Fragen zum Thema und beantwortet sie in Stichworten.",
          "Definiert den Schlüsselbegriff mit Oberbegriff und Merkmalen.",
        ],
      },
      2: {
        prompt:
          "Du schreibst für die Schülerzeitung über „Lärm in der Pause“. Dir liegen drei Quellen vor: ein Zeitungsartikel über Lärm an Schulen, eine Tabelle mit Messwerten aus der Klasse 9a (für diese Aufgabe erfunden) und ein anonymer Forumsbeitrag. Schreibe einen Materialplan in fünf bis sechs Sätzen: Wofür nutzt du jede Quelle, welche prüfst du besonders kritisch und warum, und welche zwei Fragen musst du noch klären?",
        hints: [
          "Ordne jeder Quelle einen Zweck zu, zum Beispiel Hintergrund, Zahlen oder Meinung.",
          "Begründe die kritische Prüfung mit Fragen an die Quelle: Wer schreibt? Woher stammen die Angaben?",
        ],
        model:
          "Den Zeitungsartikel nutze ich für den Hintergrund, etwa dafür, warum Lärm die Konzentration stören kann. Aus der Tabelle der Klasse 9a übernehme ich die Messwerte als Zahlen, gebe aber an, dass sie nur aus einer Klasse stammen. Den anonymen Forumsbeitrag prüfe ich kritisch, weil ich nicht weiß, wer ihn geschrieben hat und ob die Angaben stimmen. Ich verwende ihn höchstens als Stimme, nicht als Beleg. Offen bleiben zwei Fragen: Wann ist es auf dem Schulhof am lautesten? Und was sagen Lehrkräfte und andere Klassen dazu?",
        criteria: [
          "Ordnet jeder der drei Quellen eine Verwendung zu.",
          "Begründet, warum eine Quelle kritisch geprüft werden muss.",
          "Nennt zwei Fragen, die noch zu klären sind.",
        ],
      },
    },
  },
  {
    id: "de-eindruecke-schildern",
    lb: 3,
    unit: "3.2",
    covers: ["3.2.2"],
    title: "Eindrücke und Stimmungen schildern",
    intro:
      "Eine Schilderung zeigt, was ein Anlass bei jemandem auslöst. Du nutzt Sinneseindrücke, genaue Wörter und verschiedene Perspektiven.",
    paragraphs: [
      "Wer schildert, berichtet nicht nur, **was** geschehen ist, sondern zeigt, **wie** es auf jemanden wirkt. Derselbe Anlass kann ganz verschiedene Eindrücke und Stimmungen auslösen: Ein Schulfest ist für eine Schülerin ein Höhepunkt, für den Hausmeister viel Arbeit und für die Lehrerin ein Moment des Stolzes. In einer Schilderung stellst du solche Eindrücke so dar, dass die Lesenden sie nachempfinden können. Du zeigst dabei deine **Gedanken**, deine **Gefühle** und, wenn du magst, eine **Wertung**, also ein Urteil wie „Das war ungerecht“.",
      "Das wichtigste Werkzeug sind **Sinneseindrücke** von außen: Was siehst, hörst, riechst und schmeckst du, was ertastest du? „Es war unangenehm“ sagt wenig. „Im Raum roch es nach nassen Jacken, und irgendwo tickte eine Uhr“ lässt die Lesenden dabei sein. Genaue **Verben** und **Adjektive** machen den Unterschied: „schlurfen“, „hasten“ und „spazieren“ sind alle „gehen“, aber jedes Wort zeigt eine andere Stimmung. Ein **Vergleich** („still wie ein Spiegel“) macht etwas anschaulich. Übertreibe aber nicht: Zu viele Bilder in einem Absatz wirken schnell gekünstelt.",
      "Gefühle schilderst du am besten, indem du sie **zeigst**, statt sie nur zu nennen. „Ich hatte Angst“ benennt das Gefühl. „Meine Hände wurden feucht, und ich hörte mein Herz im Ohr“ zeigt es über den Körper, und die Lesenden schließen selbst auf die Angst. Benennen darfst du ein Gefühl trotzdem, besonders wenn es kurz und treffend ist. Wichtig ist, dass dein Text nicht nur aus solchen Sätzen besteht. Bleibe außerdem bei einer Zeitform, meist beim Präteritum oder beim Präsens, und halte Ton und Wortwahl einheitlich.",
      "Einen Anlass kannst du aus **eigener** und aus **fremder Perspektive** schildern. In der eigenen Perspektive schreibst du in der Ich-Form und zeigst, was du selbst wahrnimmst und denkst. Für die fremde Perspektive versetzt du dich in eine andere Person, ein Tier oder sogar einen Gegenstand und fragst: Was nimmt sie wahr? Was ist ihr wichtig, was hofft oder befürchtet sie? Du schreibst dann in der dritten Person oder in der Ich-Form dieser Rolle. Der **Perspektivwechsel** zeigt, dass kein Anlass für alle gleich ist, und er hilft dir, auch Menschen zu verstehen, die anders denken als du.",
    ],
    terms: [
      {
        term: "Schilderung",
        text: "Ein Text, der Eindrücke, Stimmungen und Gefühle anschaulich darstellt, damit die Lesenden sie nachempfinden.",
      },
      {
        term: "Sinneseindruck",
        text: "Etwas, das du von außen siehst, hörst, riechst, schmeckst oder ertastest und das einen Anlass lebendig macht.",
      },
      {
        term: "Perspektive",
        text: "Der Blickwinkel, aus dem ein Anlass dargestellt wird, zum Beispiel aus der Sicht einer beteiligten Person.",
      },
      {
        term: "Perspektivwechsel",
        text: "Derselbe Anlass wird aus der Sicht einer anderen Person geschildert, sodass andere Eindrücke sichtbar werden.",
      },
      {
        term: "Zeigen statt benennen",
        text: "Ein Gefühl über Körper, Handlung oder Sinneseindruck sichtbar machen, statt nur das Gefühlswort zu schreiben.",
      },
    ],
    examples: [
      {
        title: "Der erste Schultag aus zwei Sichten (eigens verfasst)",
        text: "Eigene Perspektive: Meine Schuhe quietschen auf dem frisch gewischten Flur. Es riecht nach Bohnerwachs und Neuanfang. Mein Magen zieht sich zusammen, als würde jemand einen nassen Lappen auswringen.\nFremde Perspektive: Hausmeister Albers schiebt den Wischeimer an die Wand und lächelt. Jedes Jahr dasselbe: Die Kleinen drücken sich an die Wände, die Großen tun, als wäre nichts. Er kennt dieses Gewimmel und mag es.",
        analysis:
          "Im ersten Teil schildert jemand den Anlass aus eigener Sicht: **Sinneseindrücke** (das Quietschen, der Geruch) und das Gefühl im Magen zeigen die Aufregung, ohne dass das Wort „Angst“ fällt. Der **Vergleich** mit dem nassen Lappen macht dieses Gefühl spürbar. Im zweiten Teil wechselt die **Perspektive**: Der Hausmeister erlebt dieselbe Szene gelassen und sogar freundlich. So wird sichtbar, dass der erste Schultag nicht für alle dasselbe bedeutet.",
      },
    ],
    takeaway:
      "Eine Schilderung zeigt, was ein Anlass bei jemandem auslöst. Nutze Sinneseindrücke, genaue Verben, Adjektive und Vergleiche, zeige Gefühle, statt sie nur zu nennen, und schildere denselben Anlass auch aus fremder Perspektive.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welcher Satz zeigt ein Gefühl, ohne es zu benennen?",
      answer: "Meine Hände zitterten so stark, dass ich die Klinke zweimal verfehlte.",
      wrong: [
        "Ich hatte furchtbare Angst und traute mich nicht, die Tür zu öffnen.",
        "Mich überkam eine riesige Angst, die mich völlig lähmte.",
      ],
      explanation:
        "Im ersten Satz sehen die Lesenden das Zittern und schließen selbst auf die Angst. In den anderen beiden Sätzen steht das Wort „Angst“ ausdrücklich: Das Gefühl wird benannt, aber nicht gezeigt.",
    },
    workshop: {
      kind: "mark",
      title: "Eindrücke in einer Schilderung finden",
      instruction:
        "Wähle oben eine Art von Eindruck und klicke dann im Text die Stelle an, die sie zeigt. Ein Sinneseindruck kommt von außen, ein Körperzeichen von innen. Angaben zu Zeit, Ort und Ablauf sind keine Eindrücke.",
      labels: ["Sinneseindruck", "Vergleich", "Körperzeichen für ein Gefühl", "Gedanke oder Wertung"],
      text: [
        { t: "Montag, kurz vor acht. " },
        {
          t: "Im Klassenzimmer riecht es nach Kreide und feuchten Jacken. ",
          label: 0,
          feedback: "Das ist ein Geruch von außen. Die Lesenden riechen den Raum mit, und der Ort wird lebendig.",
        },
        { t: "Die Klasse 9b schreibt heute die erste Arbeit nach den Ferien. " },
        {
          t: "Irgendwo tickt eine Uhr. ",
          label: 0,
          feedback: "Ein Geräusch, das die Stille hörbar macht, also ein Sinneseindruck des Hörens.",
        },
        {
          t: "Die Minuten schleichen wie Schnecken. ",
          label: 1,
          feedback: "Mit „wie“ wird die Zeit mit Schnecken verglichen. Der Vergleich zeigt, wie zäh die Wartezeit wirkt.",
        },
        {
          t: "Mein Mund ist trocken, meine Finger zittern. ",
          label: 2,
          feedback: "Das Wort „Angst“ fällt nicht, doch der Körper verrät das Gefühl, und die Lesenden schließen selbst darauf.",
        },
        { t: "Ich sitze in der dritten Reihe am Fenster. " },
        {
          t: "Hoffentlich kommt etwas dran, das ich geübt habe. ",
          label: 3,
          feedback: "Das ist ein Gedanke der Erzählerin, der ihre Hoffnung und ihre Sorge zeigt.",
        },
        {
          t: "Das ist ungerecht, so früh am Morgen eine Arbeit zu schreiben. ",
          label: 3,
          feedback: "Eine Wertung: Die Erzählerin urteilt, dass etwas ungerecht ist.",
        },
        { t: "Dann dürfen wir beginnen." },
      ],
      conclusion:
        "Sinneseindrücke machen den Ort lebendig, Vergleiche machen Gefühle anschaulich, Körperzeichen zeigen Gefühle ohne Gefühlswort, und Gedanken oder Wertungen zeigen, wie jemand das Erlebte sieht.",
    },
    casework: {
      title: "Ein Abschied aus zwei Sichten",
      story:
        "Lena reist für ein Austauschjahr ins Ausland, ihr Vater bringt sie zum Zug. Für die Schülerzeitung schildert sie den Abschied zweimal. **Aus ihrer Sicht: „Mein Koffer ist schwer, doch mein Herz ist merkwürdig leicht. Ich winke, bis der Bahnsteig im Dunst verschwimmt.“** **Aus der Sicht ihres Vaters: „Er steht noch am Gleis, lange nachdem der Zug abgefahren ist. Der Kaffee in seiner Hand ist kalt geworden. Er hebt die Hand, obwohl niemand mehr winkt.“**",
      steps: [
        {
          question: "Aus welcher Perspektive ist der erste Text geschildert?",
          options: [
            "Aus der eigenen Perspektive in der Ich-Form",
            "Aus der fremden Perspektive des Vaters",
            "Aus der Sicht einer Beobachterin, die niemanden kennt",
          ],
          answer: 0,
          explanation:
            "Lena schreibt „mein Koffer“, „mein Herz“ und „ich winke“. Sie schildert den Abschied also aus ihrer eigenen Sicht.",
        },
        {
          question: "Wie zeigt der zweite Text die Gefühle des Vaters, ohne sie zu nennen?",
          options: [
            "Durch den kalten Kaffee und die erhobene Hand, obwohl niemand mehr winkt",
            "Durch ein Gefühlswort wie „traurig“ oder „einsam“ gleich im ersten Satz",
            "Durch genaue Angaben zur Abfahrtszeit und zum Gleis des Zuges",
          ],
          answer: 0,
          explanation:
            "Der kalt gewordene Kaffee und die Geste zeigen, wie lange er noch dasteht und wie schwer ihm der Abschied fällt. Ein Gefühlswort kommt im Text nicht vor.",
        },
        {
          question: "Welche Änderung würde den zweiten Text schwächer machen?",
          options: [
            "Der Satz mit der erhobenen Hand wird durch „Er ist sehr traurig.“ ersetzt.",
            "Das Wort „Gleis“ wird durch das Wort „Bahnsteig“ ersetzt, das auch in Lenas Text vorkommt.",
            "Der Satz über den Kaffee wird vor den ersten Satz gestellt, sonst bleibt alles gleich.",
          ],
          answer: 0,
          explanation:
            "Dann würde das Gefühl nur noch benannt statt gezeigt, und die Lesenden sähen den Vater nicht mehr vor sich. Die anderen Änderungen tauschen nur ein Wort oder die Reihenfolge.",
        },
        {
          question: "Was bewirkt es, den Abschied auch aus der Sicht des Vaters zu schildern?",
          options: [
            "Man sieht, dass der Abschied für Lena und ihren Vater Unterschiedliches bedeutet.",
            "Der Text wird sachlicher, weil nur noch Tatsachen und keine Gefühle mehr übrig bleiben.",
            "Der Text wird kürzer, weil die Gefühle des Vaters wegfallen und nichts Neues dazukommt.",
          ],
          answer: 0,
          explanation:
            "Der Perspektivwechsel zeigt, dass derselbe Anlass für verschiedene Menschen etwas anderes bedeutet. Sachlicher oder kürzer wird der Text dadurch nicht.",
        },
      ],
      verdict:
        "Lenas Doppelschilderung zeigt Gefühle über Körper, Gesten und Dinge, nicht über Gefühlswörter. Der Perspektivwechsel macht sichtbar, dass derselbe Abschied für beide etwas anderes bedeutet.",
    },
    tasks: {
      1: {
        prompt:
          "Anlass: dein erster Morgen auf einer Klassenfahrt in der Jugendherberge. Schildere in vier bis fünf Sätzen aus eigener Sicht, was du wahrnimmst. Nutze mindestens zwei Sinneseindrücke, ein treffendes Verb und einen Vergleich, und zeige ein Gefühl, ohne es zu benennen.",
        hints: [
          "Frage dich: Was hörst, riechst und siehst du als Erstes? Notiere zwei Dinge und baue sie in die ersten Sätze ein.",
          "Ersetze Wörter wie „schön“, „komisch“ oder „toll“ durch genaue Beobachtungen und zeige das Gefühl über eine Geste oder den Körper.",
        ],
        model:
          "Ein Klappern weckt mich: Irgendwo schlagen Türen, Schritte poltern über den Flur. Es riecht nach Kakao und frischem Brot, und mein Magen knurrt. Ich schäle mich aus dem fremden Schlafsack, tapse barfuß über den kalten Boden und spähe aus dem Fenster. Draußen liegt der See glatt wie eine Glasplatte. Ich grinse, bevor ich es merke.",
        criteria: [
          "Enthält mindestens zwei verschiedene Sinneseindrücke.",
          "Enthält ein treffendes Verb und einen Vergleich.",
          "Zeigt ein Gefühl über Körper oder Handlung, ohne das Gefühlswort zu nennen.",
        ],
      },
      2: {
        prompt:
          "Anlass: die Zeugnisausgabe am letzten Schultag. Schildere ihn zuerst aus der Sicht einer Schülerin in der Ich-Form und dann aus der Sicht der Lehrerin in der dritten Person, je drei bis vier Sätze. Zeige in jeder Sicht einen Gedanken oder eine Wertung.",
        hints: [
          "Frage dich bei jeder Person: Was nimmt sie wahr, was ist ihr wichtig, was hofft oder befürchtet sie?",
          "Wechsle in der zweiten Sicht auch Wortwahl und Ton, damit man erkennt, dass jemand anderes den Anlass erlebt.",
        ],
        model:
          "Schülerin: Mein Name wird aufgerufen, und plötzlich ist der Weg nach vorn endlos. Ich nehme den Umschlag mit zwei Fingern, als könnte er zerbrechen. Hoffentlich steht keine Überraschung darin, denke ich, und schiebe das Öffnen bis zur Pause auf. Lehrerin: Frau Keller sieht in die Klasse und lächelt. Das Verteilen der Umschläge kennt sie seit vielen Jahren, und doch kribbelt es jedes Mal in ihren Fingern. Sie weiß, dass ein Zeugnis nur einen Ausschnitt zeigt, und wünscht sich, dass keiner den Raum mit gesenktem Kopf verlässt.",
        criteria: [
          "Schildert den Anlass einmal in der Ich-Form und einmal aus der Sicht einer anderen Person.",
          "Zeigt in beiden Sichten ein Gefühl über Körper, Handlung oder Sinneseindruck.",
          "Enthält in jeder Sicht einen Gedanken oder eine Wertung.",
        ],
      },
    },
  },
  {
    id: "de-kreatives-schreiben",
    lb: 3,
    unit: "3.2",
    covers: ["3.2.3"],
    title: "Kreative Schreibformen nutzen",
    intro:
      "Du kannst Texte fortsetzen, umschreiben oder ihnen etwas entgegensetzen. So bringst du eigene Gedanken und Vorstellungen zum Ausdruck.",
    paragraphs: [
      "Kreatives Schreiben heißt nicht, dass alles erlaubt ist. Du gehst meist von einer **Vorlage** aus, einem Text, einem Bild oder einer Figur, und machst etwas Eigenes daraus. Dabei erfährst du, wie ein Text gebaut ist, und du bringst deine Gedanken und Vorstellungen ins Spiel: Wie würde ich handeln? Was ist mir an der Figur fremd? Was fehlt mir in der Geschichte? Gerade weil du an die Vorlage anknüpfst, musst du sie genau verstehen. Kreative Schreibformen sind deshalb auch eine Art, einen Text zu erschließen.",
      "Vier Formen sind besonders hilfreich. Beim **Fortsetzen** schreibst du dort weiter, wo die Vorlage endet, oder fügst eine Szene ein. Beim **Umschreiben** erzählst du denselben Inhalt noch einmal, aber verändert, zum Beispiel aus der Sicht einer anderen Figur, in einer anderen Zeit oder als Tagebucheintrag oder Zeitungsbericht. Beim **Füllen von Leerstellen** schreibst du auf, was im Text nicht steht: die Gedanken einer Figur, eine ausgelassene Szene oder die Vorgeschichte. Beim **Variieren des Handlungsstrangs** fragst du „Was wäre, wenn …?“ und lässt die Geschichte anders verlaufen, etwa weil eine Figur anders entscheidet.",
      "Eine weitere Möglichkeit sind **Parallel- und Gegentexte**. Den Paralleltext kennst du schon aus Klasse 8, die Begriffe werden aber nicht überall gleich gebraucht. Hier gilt: Beim Paralleltext übernimmst du meist Aufbau und Form der Vorlage, etwa die Wiederholungen oder den Satzbau eines Gedichts, und füllst sie mit einem eigenen Inhalt. Beim Gegentext behältst du den Aufbau ebenfalls bei, kehrst aber die Aussage um und stellst der Vorlage eine Gegenposition entgegen. Beide Formen funktionieren besonders gut bei kurzen Texten mit klarem Aufbau, und sie zeigen dir, wie viel die Form zur Wirkung beiträgt.",
      "Woran erkennst du, ob ein kreativer Text gelungen ist? Vier **Gütekriterien** helfen dir bei der Prüfung, deine Lehrkraft kann sie anders benennen. Erstens der **Bezug**: Knüpft dein Text erkennbar an die Vorlage an, etwa an Figuren, Ort, Handlung oder Form? Zweitens die **Stimmigkeit**: Passen Verhalten der Figuren, Zeit und Ton zusammen, und ist eine überraschende Wendung nachvollziehbar? Drittens die **Eigenständigkeit**: Bringt dein Text eine eigene Idee ein, statt die Vorlage nur abzuschreiben? Viertens die **Gestaltung**: Sind Wortwahl und Aufbau passend und sorgfältig, und kannst du erklären, warum du etwas so gestaltet hast?",
    ],
    terms: [
      {
        term: "Vorlage",
        text: "Der Text, das Bild oder die Figur, von der ein kreativer Text ausgeht.",
      },
      {
        term: "Umschreiben",
        text: "Denselben Inhalt verändert noch einmal schreiben, zum Beispiel aus anderer Sicht oder in einer anderen Textsorte.",
      },
      {
        term: "Leerstelle",
        text: "Etwas, das im Text nicht steht, etwa die Gedanken einer Figur, und das du erfinden kannst.",
      },
      {
        term: "Paralleltext",
        text: "Ein Text, der den Aufbau der Vorlage meist übernimmt und mit einem eigenen Inhalt füllt.",
      },
      {
        term: "Gegentext",
        text: "Ein Text mit dem Aufbau der Vorlage, der ihre Aussage umkehrt.",
      },
      {
        term: "Gütekriterien",
        text: "Prüffragen für kreative Texte: Bezug zur Vorlage, Stimmigkeit, Eigenständigkeit und Gestaltung.",
      },
    ],
    examples: [
      {
        title: "Parallel- und Gegentext zu einer Vorlage (eigens verfasst)",
        text: "Vorlage:\nIch mag Montage nicht.\nSie beginnen mit einem Wecker, der zu früh klingelt.\nSie enden mit Hausaufgaben, die ich nie schaffe.\nParalleltext:\nIch mag den Winter nicht.\nEr beginnt mit Frost, der in die Handschuhe kriecht.\nEr endet mit Matsch, der an den Schuhen klebt.\nGegentext:\nIch mag Montage.\nSie beginnen mit einem Wecker, der mir einen neuen Anfang schenkt.\nSie enden mit Aufgaben, die ich geschafft habe.",
        analysis:
          "Der **Paralleltext** übernimmt den Aufbau der Vorlage: dieselbe Eingangszeile, je eine Zeile mit „beginnt“ und „endet“ und je einen Relativsatz. Nur der Inhalt ist neu, denn es geht jetzt um den Winter. Der **Gegentext** behält Aufbau und Thema bei, kehrt aber die Aussage um: Aus „Ich mag Montage nicht“ wird „Ich mag Montage“, und aus dem Scheitern wird Erfolg. In beiden Fällen erkennt man die Vorlage sofort, und trotzdem steckt in jedem Text eine eigene Idee.",
      },
    ],
    takeaway:
      "Kreative Schreibformen gehen von einer Vorlage aus: fortsetzen, umschreiben, Leerstellen füllen, den Handlungsstrang variieren oder Parallel- und Gegentexte schreiben. Gelungen ist ein Text, der an die Vorlage anknüpft, stimmig ist, eine eigene Idee hat und sorgfältig gestaltet ist.",
    sourceIds: ["lp", "wikisource"],
    quiz: {
      question: "Woran erkennst du einen gelungenen kreativen Text zu einer Vorlage?",
      answer: "Er knüpft erkennbar an die Vorlage an und bringt zugleich eine eigene Idee ein.",
      wrong: [
        "Er wiederholt die Vorlage fast wörtlich und ändert nur einzelne Wörter.",
        "Er löst sich völlig von der Vorlage, damit er möglichst neu wirkt.",
      ],
      explanation:
        "Gelungen ist ein Text, der Bezug zur Vorlage hat und etwas Eigenes hinzufügt. Wer die Vorlage nur abschreibt, bringt keine eigene Idee ein, und wer sich ganz löst, schreibt keinen Text mehr zu dieser Vorlage.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Schreibform ist das?",
      instruction:
        "Alle Aufgaben gehören zum Märchen „Rotkäppchen“ der Brüder Grimm. Ordne jede Aufgabe der kreativen Schreibform zu, die sie verlangt. Beim Umschreiben bleibt der Inhalt, nur die Form ändert sich, zum Beispiel Sicht, Zeit oder Textsorte.",
      categories: ["Fortsetzen", "Umschreiben", "Leerstelle füllen", "Handlungsstrang variieren"],
      entries: [
        {
          text: "Du schreibst auf, wie es Rotkäppchen und der Großmutter am Tag nach der Rettung geht.",
          target: 0,
          feedback: "Die Vorlage ist zu Ende, und du schreibst danach weiter.",
        },
        {
          text: "Du erzählst das Märchen mit demselben Verlauf noch einmal, diesmal aus der Sicht des Wolfs in der Ich-Form.",
          target: 1,
          feedback: "Derselbe Inhalt wird verändert erzählt, hier mit einer anderen Perspektive.",
        },
        {
          text: "Im Märchen steht nicht, was die Großmutter denkt, als der Wolf an die Tür klopft. Du schreibst ihre Gedanken auf.",
          target: 2,
          feedback: "Du ergänzt, was im Text nicht steht, nämlich die Gedanken einer Figur.",
        },
        {
          text: "Du fragst: Was wäre, wenn Rotkäppchen den Wolf im Wald durchschaut? Du schreibst den anderen Verlauf bis zum Schluss.",
          target: 3,
          feedback: "Wegen einer anderen Entscheidung nimmt die Handlung einen neuen Weg.",
        },
        {
          text: "Du verfasst aus dem Märchen einen Zeitungsbericht, wie ihn eine Lokalzeitung schreiben könnte. Der Inhalt bleibt, die Textsorte ändert sich.",
          target: 1,
          feedback: "Derselbe Inhalt erscheint in einer anderen Textsorte, er wird also umgeschrieben.",
        },
        {
          text: "Du erfindest, was die Mutter tut, während Rotkäppchen im Wald Blumen pflückt. Der Verlauf des Märchens bleibt dabei unverändert.",
          target: 2,
          feedback: "Diese Szene wird im Märchen nicht erzählt. Du füllst die Lücke mit einer eigenen Idee.",
        },
      ],
      conclusion:
        "Fortsetzen schreibt über das Ende hinaus, Umschreiben erzählt Gleiches verändert, Leerstellen füllen ergänzt Fehlendes, und beim Variieren nimmt die Handlung einen anderen Weg.",
    },
    casework: {
      title: "Zwei Fortsetzungen im Vergleich",
      story:
        "Vorlage: **Jonas findet auf einer Bank am Bahnhof einen alten Rucksack. An einem Zettel steht: „Bitte nicht öffnen.“ Jonas zögert und sieht sich um.** Mia schreibt weiter: **Jonas trägt den Rucksack zum Fundbüro. Dort fragt gerade ein Mann aufgeregt nach seinen Noten.** Ben schreibt: **Plötzlich landet ein Ufo auf dem Bahnsteig, und Max, der König der Sterne, steigt aus.**",
      steps: [
        {
          question: "Welche kreative Schreibform haben Mia und Ben gewählt?",
          options: ["Fortsetzen", "Gegentext schreiben", "Umschreiben"],
          answer: 0,
          explanation: "Beide schreiben dort weiter, wo die Vorlage aufhört. Das ist eine Fortsetzung.",
        },
        {
          question: "Welches Gütekriterium erfüllt Mias Text besonders gut?",
          options: [
            "Bezug: Sie knüpft an Figur, Gegenstand und Ort an und führt die Handlung weiter.",
            "Eigenständigkeit: Sie ändert Figur, Ort und Handlung der Vorlage vollständig.",
            "Gestaltung: Sie nutzt Reime, Strophen und eine besonders dichte Sprache.",
          ],
          answer: 0,
          explanation:
            "Jonas, der Rucksack und der Bahnhof bleiben erhalten, und die Handlung geht logisch weiter. Das ist der Bezug zur Vorlage.",
        },
        {
          question: "Warum passt Bens Fortsetzung schlecht zur Vorlage?",
          options: [
            "Jonas und der Rucksack kommen nicht mehr vor, und der Ton wechselt ohne Grund.",
            "Eine Fortsetzung darf grundsätzlich keine Fantasiefigur enthalten, weil sie realistisch bleiben muss.",
            "Sie hat nur einen einzigen Satz und ist zu kurz, um überhaupt als Fortsetzung zu gelten.",
          ],
          answer: 0,
          explanation:
            "Eine fantastische Wendung ist erlaubt, wenn sie sich aus der Vorlage ergibt. Bei Ben fehlen der Bezug (Jonas, Rucksack) und die Stimmigkeit, denn Figur und Ton wechseln plötzlich.",
        },
        {
          question: "Wie könnte Ben seine Idee retten?",
          options: [
            "Er lässt Jonas den Rucksack öffnen und darin ein Gerät finden, das das Ufo ruft.",
            "Er streicht den Rucksack und schreibt nur noch über das Ufo und den König der Sterne.",
            "Er schreibt dazu, dass in einer Fortsetzung jede Idee erlaubt ist, auch ohne Bezug zur Vorlage.",
          ],
          answer: 0,
          explanation:
            "So bleiben Figur und Gegenstand der Vorlage erhalten, und die Ufo-Idee wird nachvollziehbar eingebunden. Sie bleibt eigenständig und hat doch Bezug.",
        },
      ],
      verdict:
        "Eine Fortsetzung lebt davon, dass sie an die Vorlage anknüpft und etwas Neues hinzufügt. Mia verbindet beides, Ben verliert die Vorlage aus den Augen. Eine fantastische Wendung ist möglich, wenn sie aus Figur und Gegenstand der Vorlage entsteht.",
    },
    tasks: {
      1: {
        prompt:
          "Vorlage: „Leonie steht vor der Tür des Probenraums. Sie hört die Band spielen und legt die Hand auf die Klinke. Dann dreht sie sich um und geht nach Hause.“ Fülle die Leerstelle: Schreibe in vier bis fünf Sätzen auf, was Leonie auf dem Heimweg denkt. Bleibe in der dritten Person und im Präsens.",
        hints: [
          "Frage dich: Warum geht sie, obwohl sie die Hand schon auf der Klinke hatte? Sammle zwei mögliche Gründe und wähle einen.",
          "Knüpfe an die Vorlage an: Probenraum, Band und Heimweg sollen vorkommen.",
        ],
        model:
          "Leonie geht langsam und tritt gegen einen Kieselstein. Die Band hat so sicher geklungen, dass sie sich neben den anderen plötzlich klein fühlt. „Vielleicht bin ich noch nicht gut genug“, denkt sie. Dann fällt ihr ein, dass die anderen auch einmal angefangen haben. Sie bleibt stehen, sieht zurück und nimmt sich vor, nächste Woche wiederzukommen.",
        criteria: [
          "Knüpft erkennbar an Figur, Ort und Handlung der Vorlage an.",
          "Nennt einen nachvollziehbaren Grund, warum Leonie geht.",
          "Bleibt in dritter Person und Präsens, wie die Vorlage.",
        ],
      },
      2: {
        prompt:
          "Vorlage: „Ich bin zu laut. / Zu laut für die Bibliothek, / zu laut für den Bus, / zu laut für alle, die Ruhe wollen.“ Schreibe dazu einen Gegentext mit derselben Struktur (vier Zeilen) und erkläre in zwei Sätzen, was dein Text aussagen soll und woran man ihn als Gegentext erkennt.",
        hints: [
          "Behalte die Wiederholung „zu laut für …“ als Muster bei und kehre die Aussage um.",
          "Überlege, was das Gegenteil von „zu laut“ für dich bedeutet: Ist es nur leise oder etwas anderes?",
        ],
        model:
          "Ich bin laut genug. / Laut genug für die Bühne, / laut genug für den Chor, / laut genug für alle, die mich hören wollen. Mein Gegentext kehrt die Aussage um: Das Laute ist keine Last mehr, sondern eine Stärke. Man erkennt ihn daran, dass Aufbau und Wiederholungen der Vorlage bleiben, die Aussage aber das Gegenteil sagt.",
        criteria: [
          "Behält Aufbau und Wiederholungen der Vorlage bei.",
          "Kehrt die Aussage der Vorlage erkennbar um.",
          "Erklärt in zwei Sätzen Aussage und Merkmale des Gegentextes.",
        ],
      },
    },
  },
  {
    id: "de-textverstaendnis-darstellen",
    lb: 3,
    unit: "3.2",
    covers: ["3.2.4"],
    title: "Textverständnis schriftlich darstellen",
    intro:
      "Wer einen Text verstanden hat, kann ihn zusammenhängend darstellen: Inhalt, Textsorte und Funktion, dazu eine begründete Wertung.",
    paragraphs: [
      "Ein Text ist verstanden, wenn du ihn anderen erklären kannst. Dafür stellst du drei Dinge schriftlich und zusammenhängend dar: den **Inhalt**, die **Textsorte** mit der **vorherrschenden Textfunktion** und eine **weitere Fragestellung** zum Text, zum Beispiel nach dem Verhalten einer Figur, nach sprachlichen Auffälligkeiten oder nach der Wirkung. Die Textsorte benennt die Art des Textes, etwa Bericht, Kommentar, Reportage oder Kurzgeschichte. Die Textfunktion sagt, was der Text bei den Lesenden bewirken soll, zum Beispiel informieren, unterhalten, argumentieren (überzeugen) oder appellieren (auffordern). Viele Texte mischen mehrere Funktionen, dann suchst du die vorherrschende.",
      "Die Textwiedergabe, in der Schule oft auch Inhaltsangabe oder Inhaltszusammenfassung genannt, beginnt mit einem **Einleitungssatz**, der Titel, Textsorte und Thema nennt: „In dem Zeitungsbericht ‚Neue Mensa‘ geht es um …“. Bei Sachtexten gehören oft der Name der Autorin oder des Autors und die Quelle dazu. Danach gibst du den Inhalt wieder. Dabei gelten die üblichen Regeln: Du schreibst im **Präsens**, auch wenn der Text in der Vergangenheit erzählt. Du formulierst mit **eigenen Worten** und übernimmst keine ganzen Sätze. Du beschränkst dich auf das Wesentliche und folgst dem Gang des Textes. Was vorher geschehen ist, steht im Perfekt. Aussagen anderer gibst du in indirekter Rede wieder, wie du es aus Klasse 8 kennst, und lässt wörtliche Rede weg.",
      "Zur weiteren Fragestellung gehört, dass du **Belege** nennst und **Wertungen** vom Inhalt trennst. Bewertest du das Verhalten einer Figur, sagst du zuerst, was sie tut, und begründest dann dein Urteil: „Ich halte Toms Verhalten für leichtsinnig, weil …“. Bei sprachlichen Auffälligkeiten nennst du die Stelle, benennst das Mittel und erklärst die Wirkung. Über die Wirkung des Textes schreibst du, was er bei den Lesenden auslöst und wodurch. Stehen Inhalt und eigene Meinung durcheinander, erkennen die Lesenden nicht mehr, was im Text steht und was von dir kommt. Deshalb steht die Wertung in einem eigenen Absatz oder am Schluss und ist als deine Sicht erkennbar, zum Beispiel mit „meiner Meinung nach“.",
      "So entsteht ein klarer Aufbau: Einleitung mit Titel, Textsorte und Thema, Hauptteil mit dem Inhalt, danach die Antwort auf die weitere Fragestellung und zum Schluss, wenn gefordert, eine begründete Wertung. Achte auf die Verbindung der Sätze („zunächst“, „daraufhin“, „schließlich“), damit der Text zusammenhängend wirkt und nicht wie eine Liste von Einzelsätzen. Bleibe sachlich und kurz: Die Wiedergabe soll dem Text nichts hinzufügen, sondern ihn für andere verständlich machen.",
    ],
    terms: [
      {
        term: "Textwiedergabe",
        text: "Die zusammenhängende Darstellung des Inhalts eines Textes in eigenen Worten und im Präsens.",
      },
      {
        term: "Einleitungssatz",
        text: "Der erste Satz einer Textwiedergabe, der Titel, Textsorte und Thema des Textes nennt.",
      },
      {
        term: "Textsorte",
        text: "Die Art eines Textes mit typischen Merkmalen, zum Beispiel Bericht, Kommentar, Reportage oder Kurzgeschichte.",
      },
      {
        term: "Textfunktion",
        text: "Das, was ein Text bei den Lesenden bewirken soll, etwa informieren, unterhalten, argumentieren oder appellieren.",
      },
      {
        term: "Wertung",
        text: "Dein begründetes Urteil über Verhalten, Sprache oder Wirkung eines Textes, getrennt vom Inhalt dargestellt.",
      },
    ],
    examples: [
      {
        title: "Ein Erzähltext und seine Wiedergabe (eigens verfasst)",
        text: "Die Mutprobe\nNach dem Training wollte Tom noch schnell auf das Dach der Sporthalle klettern. Die anderen aus seiner Mannschaft feuerten ihn an. Nur Selin sagte leise, sie halte das für keine gute Idee. Tom lachte und kletterte los. Auf halber Höhe rutschte er ab und blieb mit einer Schürfwunde am Arm im Gras liegen. Plötzlich waren alle still. Nur Selin saß schon neben ihm und reichte ihm ein Taschentuch.",
        analysis:
          "So könnte die Wiedergabe lauten: **Einleitung:** In dem kurzen Erzähltext „Die Mutprobe“ geht es um einen Jungen, der sich vor seiner Mannschaft beweisen will. **Inhalt:** Tom klettert nach dem Training auf das Hallendach, obwohl Selin davon abrät. Er rutscht ab und verletzt sich leicht, und Selin hilft ihm als Einzige. **Wertung:** Ich halte Toms Verhalten für leichtsinnig, weil er der Gruppe folgt und die Warnung übergeht. Die Wiedergabe steht im Präsens, obwohl der Text im Präteritum erzählt, sie gibt Selins Warnung in eigenen Worten wieder, und die Wertung ist klar vom Inhalt getrennt.",
      },
    ],
    takeaway:
      "Eine Textwiedergabe beginnt mit einem Einleitungssatz aus Titel, Textsorte und Thema. Den Inhalt gibst du im Präsens und mit eigenen Worten wieder, Wertungen und Belege zu weiteren Fragen stellst du getrennt davon dar.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welcher Satz eignet sich als Einleitungssatz einer Textwiedergabe?",
      answer: "In dem Kommentar „Mehr Platz für den Skatepark“ wird gefordert, dass die Stadt eine neue Anlage baut.",
      wrong: [
        "Ich finde, dass der Kommentar überzeugend ist, weil er klare Argumente nennt.",
        "Zuerst beschreibt die Autorin den alten Skatepark, dann nennt sie drei Gründe für einen Neubau.",
      ],
      explanation:
        "Der Einleitungssatz nennt Titel, Textsorte und Thema. Die Wertung gehört nicht an den Anfang, sondern in einen eigenen Teil, und die Einzelheiten des Inhalts folgen erst danach.",
    },
    workshop: {
      kind: "classify",
      title: "Welcher Teil der Textwiedergabe ist das?",
      instruction:
        "Die folgenden Sätze gehören zu einer Wiedergabe des (erfundenen) Zeitungsberichts „Neue Mensa für die Realschule“. Ordne jeden Satz dem Teil zu, zu dem er gehört.",
      categories: ["Einleitung", "Inhalt", "Sprachliche Auffälligkeit", "Wirkung und Wertung"],
      entries: [
        {
          text: "In dem Zeitungsbericht „Neue Mensa für die Realschule“ wird darüber informiert, dass eine Schule ihr Essensangebot ausbaut.",
          target: 0,
          feedback: "Der Satz nennt Titel, Textsorte und Thema und eröffnet die Wiedergabe.",
        },
        {
          text: "Der Bericht nennt, dass die Mensa im Herbst eröffnet wird und täglich zwei Gerichte anbietet.",
          target: 1,
          feedback: "Der Satz gibt eine Sachinformation des Textes im Präsens und mit eigenen Worten wieder.",
        },
        {
          text: "Der Schulleiter erklärt, die Stadt übernehme einen Teil der Kosten.",
          target: 1,
          feedback: "Die Aussage wird in indirekter Rede wiedergegeben, ohne sie zu bewerten.",
        },
        {
          text: "Sprachlich fällt auf, dass der Text sachlich bleibt: Er nennt Zahlen und Aussagen, aber kaum wertende Wörter.",
          target: 2,
          feedback: "Der Satz beschreibt die Sprache des Textes und nicht seinen Inhalt.",
        },
        {
          text: "Sprachlich fällt auch die Überschrift auf: Sie ist sehr kurz und nüchtern formuliert, ohne wertende Wörter.",
          target: 2,
          feedback: "Hier wird eine Auffälligkeit der sprachlichen Gestaltung benannt.",
        },
        {
          text: "Ich finde die Entscheidung richtig, weil viele von uns bisher kein warmes Mittagessen bekommen haben.",
          target: 3,
          feedback: "Das ist ein eigenes, begründetes Urteil. Es gehört getrennt vom Inhalt in einen eigenen Teil.",
        },
      ],
      conclusion:
        "Einleitung, Inhalt, Beobachtungen zur Sprache und eigene Wertung haben jeweils ihren eigenen Platz. So bleibt erkennbar, was im Text steht und was von dir kommt.",
    },
    casework: {
      title: "Eine Textwiedergabe prüfen",
      story:
        "Mia soll den Erzähltext „Der Schlüssel“ (eigens verfasst) wiedergeben und am Schluss das Verhalten des Jungen bewerten. In dem Text findet der Junge Elias am Bahnhof einen Schlüssel und gibt ihn zurück. Ihr Entwurf lautet: **„Elias ging nach der Schule zum Bahnhof und fand dort einen Schlüssel. ‚Das ist bestimmt wichtig‘, sagte er zu sich. Er gab ihn der Besitzerin zurück, und sie freute sich sehr. Ich finde, Elias war richtig nett.“**",
      steps: [
        {
          question: "Was fehlt am Anfang von Mias Entwurf?",
          options: [
            "Ein Einleitungssatz mit Titel, Textsorte und Thema",
            "Eine wörtliche Rede, die den Text lebendig macht",
            "Eine Wertung, die den Text einordnet",
          ],
          answer: 0,
          explanation:
            "Eine Textwiedergabe beginnt damit, den Text vorzustellen: Titel, Textsorte und Thema. Erst danach folgt der Inhalt.",
        },
        {
          question: "In welcher Zeitform sollte Mia den Inhalt wiedergeben?",
          options: [
            "Im Präsens",
            "Im Präteritum, passend zur Handlung des Textes",
            "Im Perfekt, weil alles schon geschehen ist",
          ],
          answer: 0,
          explanation:
            "Eine Textwiedergabe steht üblicherweise im Präsens, auch wenn der Text selbst in der Vergangenheit erzählt. Vorzeitiges steht im Perfekt.",
        },
        {
          question: "Wie sollte Mia den Satz mit der wörtlichen Rede behandeln?",
          options: [
            "In indirekter Rede wiedergeben, etwa: Elias vermutet, der Schlüssel sei wichtig",
            "Wörtlich in Anführungszeichen übernehmen, damit nichts verfälscht wird oder verloren geht",
            "Ganz durch einen eigenen Kommentar ersetzen, was sie von dem Gedanken hält",
          ],
          answer: 0,
          explanation:
            "Eine Wiedergabe formuliert mit eigenen Worten. Wörtliche Rede wird nicht übernommen, und eine eigene Meinung gehört nicht in den Inhalt.",
        },
        {
          question: "Was ist an dem Satz „Ich finde, Elias war richtig nett.“ zu verbessern?",
          options: [
            "Er braucht eine Begründung und sollte als eigener Teil am Schluss stehen.",
            "Er muss gestrichen werden, weil eine Wiedergabe nie eine Meinung enthält.",
            "Er gehört in den Einleitungssatz, damit die Lesenden die Meinung gleich kennen.",
          ],
          answer: 0,
          explanation:
            "Mias Aufgabe verlangt eine Bewertung, deshalb darf sie bleiben. Sie wird aber begründet und steht getrennt vom Inhalt, damit erkennbar bleibt, was im Text steht und was Mias Urteil ist.",
        },
      ],
      verdict:
        "Mias Entwurf braucht einen Einleitungssatz, das Präsens, indirekte statt wörtliche Rede und eine begründete Wertung am Schluss. Dann zeigt er, dass sie den Text verstanden hat.",
    },
    tasks: {
      1: {
        prompt:
          "Lies den Erzähltext „Das Stichwort“ (eigens verfasst): „Am Montag soll Luisa vor der Klasse ein Referat halten. Sie hat die ganze Nacht geübt und ist trotzdem so nervös, dass ihre Karteikarten zittern. Als sie vorn steht, vergisst sie den ersten Satz. Da lächelt ihr Sitznachbar Paul ihr zu und flüstert das Stichwort. Luisa atmet durch und beginnt. Am Ende klatschen alle.“ Schreibe eine Textwiedergabe in vier bis fünf Sätzen: Einleitungssatz mit Titel, Textsorte und Thema, danach der Inhalt im Präsens in eigenen Worten, ohne wörtliche Rede.",
        hints: [
          "Nenne im ersten Satz den Titel, die Textsorte (kurzer Erzähltext) und das Thema.",
          "Lass Nebensächliches weg und achte darauf, dass jeder Satz im Präsens steht.",
        ],
        model:
          "In dem kurzen Erzähltext „Das Stichwort“ geht es um ein Mädchen, das bei einem Referat die Nerven verliert. Luisa soll am Montag vor der Klasse vortragen und ist trotz langer Vorbereitung sehr aufgeregt. Als sie vorn steht, vergisst sie ihren ersten Satz. Ihr Sitznachbar Paul hilft ihr mit einem geflüsterten Stichwort, sodass sie ihr Referat beginnen kann. Am Ende bekommt sie Applaus von der Klasse.",
        criteria: [
          "Nennt im Einleitungssatz Titel, Textsorte und Thema.",
          "Gibt den Inhalt im Präsens und mit eigenen Worten wieder.",
          "Verzichtet auf wörtliche Rede und eigene Wertung im Inhalt.",
        ],
      },
      2: {
        prompt:
          "Lies diese Zeitungsmeldung (für diese Aufgabe erfunden): „Der Stadtrat hat gestern beschlossen, das Hallenbad im Sommer drei Wochen länger zu schließen. Als Grund nannte Bürgermeisterin Kranz die Sanierung der Lüftungsanlage. Der Schwimmverein kritisierte die Entscheidung als zu kurzfristig.“ Schreibe drei bis vier zusammenhängende Sätze zum Textverständnis: Nenne Textsorte und vorherrschende Funktion, belege eine sprachliche Auffälligkeit mit einem Zitat und bewerte das Verhalten des Schwimmvereins mit einer Begründung.",
        hints: [
          "Frage dich, was der Text bei den Lesenden bewirken soll: informieren, unterhalten, argumentieren oder appellieren?",
          "Zitiere genau und setze die Stelle in Anführungszeichen. Kennzeichne deine Bewertung als eigene Sicht, zum Beispiel mit „Ich halte …“.",
        ],
        model:
          "Der Text ist eine Zeitungsmeldung, deren vorherrschende Funktion das Informieren ist. Sprachlich fällt auf, dass er sachlich bleibt: Er sagt nur, der Stadtrat habe „beschlossen“, und nennt als Grund die „Sanierung der Lüftungsanlage“, ohne zu bewerten. Die Kritik des Schwimmvereins halte ich für nachvollziehbar, weil Kurse und Trainingsgruppen bei einer kurzfristigen Schließung schwer neu zu planen sind. Dass der Verein seine Kritik öffentlich äußert, finde ich angemessen, denn so können die Verantwortlichen darauf reagieren.",
        criteria: [
          "Nennt Textsorte und vorherrschende Funktion des Textes.",
          "Belegt eine sprachliche Auffälligkeit mit einem genauen Zitat.",
          "Begründet die Bewertung und kennzeichnet sie als eigene Sicht.",
        ],
      },
    },
  },
  {
    id: "de-kommentar-schreiben",
    lb: 3,
    unit: "3.2",
    covers: ["3.2.5"],
    title: "Einen einfachen Kommentar schreiben",
    intro:
      "Ein Kommentar vertritt eine Meinung und begründet sie. Mit geprüften Argumenten, klarer Reihenfolge und einem Schluss überzeugst du.",
    paragraphs: [
      "Ein **Kommentar** ist ein Text, in dem jemand zu einem aktuellen Thema offen seine Meinung sagt und sie begründet. Anders als ein Bericht informiert er nicht nur, sondern will die Lesenden überzeugen. Damit das gelingt, reicht es nicht, zu behaupten, dass etwas richtig oder falsch ist. Du brauchst eine klare **These**, also deine Meinung in einem Satz, und **Argumente**, die sie stützen. Manchmal gibt dir die Aufgabe Material und Fragen vor, zum Beispiel Zahlen, Aussagen oder einen Text, der eine Frage aufwirft. Dann belegst du deine Argumente daraus und nennst die Quelle. Das Material ergänzt deine eigenen Gedanken, es ersetzt sie nicht. Manchmal ist die Aufgabe offener gestellt: Dann wählst du Beispiele und Aufbau selbst.",
      "Ein vollständiges **Argument** besteht aus drei Teilen: der **Behauptung** („Die Schule braucht mehr Fahrradständer“), der **Begründung** („weil sonst die Räder den Gehweg versperren“) und einem **Beispiel** oder Beleg („Morgens liegen vor dem Eingang oft zwanzig Räder auf dem Boden“). Ohne Begründung ist eine Behauptung nur eine Meinung. Prüfe deshalb jedes Argument: Stimmt es? Passt es zu meiner These? Kann ich es belegen? „Das finden doch alle“ ist kein Argument, denn dass viele etwas meinen, zeigt nicht, dass es stimmt. Aussagen, die du nicht belegen kannst, streichst du oder formulierst sie vorsichtiger.",
      "Dann **wägst** du die Argumente **ab**: Welche sind stark, weil sie viele Menschen betreffen oder schwer wiegen? Welche sind schwächer? Meist ordnest du sie so, dass sie sich steigern: Du beginnst mit dem schwächeren Argument und stellst das stärkste ans Ende, bevor das Fazit kommt. Verknüpfe die Argumente zu einer **Argumentationskette**, in der ein Gedanke zum nächsten führt. Dafür helfen Wörter wie „erstens“, „außerdem“, „vor allem aber“, „deshalb“ und „denn“. Sie zeigen, wie die Argumente zusammenhängen, und verhindern, dass der Text wie eine Liste wirkt.",
      "So baust du einen einfachen Kommentar auf: Der **Aufhänger** nennt den Anlass oder die Frage und weckt Interesse, zum Beispiel mit einer Beobachtung aus dem Schulalltag. Es folgt die **These**. Im Hauptteil stehen meist zwei bis drei Argumente in der geplanten Reihenfolge, jeweils mit Begründung und Beispiel. Den Schluss bildet ein **Fazit** oder ein **Appell**: Du fasst die Meinung zusammen oder forderst die Lesenden zu etwas auf. Der Ton bleibt sachlich, du darfst aber klar Stellung beziehen und auch Stilmittel wie eine rhetorische Frage nutzen. Eine Überschrift, die das Thema neugierig macht, rundet den Text ab.",
    ],
    terms: [
      {
        term: "Kommentar",
        text: "Ein Text, in dem jemand zu einem aktuellen Thema seine Meinung äußert und begründet.",
      },
      {
        term: "These",
        text: "Die Meinung des Textes in einem klaren Satz, die durch Argumente gestützt wird.",
      },
      {
        term: "Argument",
        text: "Eine Behauptung mit Begründung und mit einem Beispiel oder Beleg.",
      },
      {
        term: "Argumentationskette",
        text: "Mehrere Argumente, die so geordnet und verknüpft sind, dass ein Gedanke zum nächsten führt.",
      },
      {
        term: "Aufhänger",
        text: "Der Einstieg eines Kommentars, der Anlass oder Frage nennt und Interesse weckt.",
      },
      {
        term: "Appell",
        text: "Die Aufforderung am Schluss eines Textes, etwas zu tun oder zu ändern.",
      },
    ],
    examples: [
      {
        title: "Ein Kommentar für die Schülerzeitung (eigens verfasst)",
        text: "Wasser für alle\nSeit dem Sommer ist an der Wand im Foyer ein leerer Fleck: Dort sollte ein Trinkwasserspender hängen. Die Schule sollte ihn endlich anschaffen. Erstens spart ein Spender Müll, denn wer seine Flasche füllt, kauft keine Einwegflasche, und die Container im Hof laufen seltener über. Zweitens entlastet er das Taschengeld: Ein Becher Wasser kostet nichts, ein Getränk am Kiosk dagegen jeden Tag Geld. Vor allem aber nützt er allen, auch denen, die in der Pause gar nichts dabeihaben. Deshalb sollte die Schulleitung nicht länger zögern!",
        analysis:
          "Der **Aufhänger** ist der leere Fleck im Foyer. Die **These** folgt gleich danach: „Die Schule sollte ihn endlich anschaffen.“ Jedes Argument hat eine Begründung („denn …“) und einen Beleg aus dem Schulalltag, und die Argumente steigern sich bis zum stärksten („Vor allem aber …“). Wörter wie „erstens“, „zweitens“ und „deshalb“ verknüpfen sie zu einer **Argumentationskette**. Der Schlusssatz ist ein **Appell** an die Schulleitung.",
      },
    ],
    takeaway:
      "Ein Kommentar besteht aus Aufhänger, These, einer Kette geprüfter Argumente und Fazit oder Appell. Jedes Argument hat Behauptung, Begründung und Beispiel, und die Argumente steigern sich meist bis zum stärksten.",
    sourceIds: ["lp"],
    quiz: {
      question: "Welcher Satz ist ein Argument und nicht nur eine Behauptung?",
      answer: "Die Bibliothek sollte nachmittags länger öffnen, weil viele von uns dort nach dem Unterricht lernen.",
      wrong: [
        "Die Bibliothek sollte unbedingt nachmittags länger öffnen, das ist doch völlig klar und selbstverständlich.",
        "Alle in meiner Klasse finden, dass die Bibliothek nachmittags länger öffnen sollte.",
      ],
      explanation:
        "Nur im ersten Satz folgt auf die Behauptung eine Begründung. Der zweite Satz wiederholt die Behauptung nur, der dritte beruft sich auf die Meinung vieler, was nichts darüber sagt, ob sie stimmt.",
    },
    workshop: {
      kind: "mark",
      title: "Bausteine eines Kommentars finden",
      instruction:
        "Wähle oben einen Baustein und klicke im Text die Stelle an, die ihn bildet. Die These sagt in einem Satz, was gefordert wird, der Appell fordert am Schluss ausdrücklich zum Handeln auf. Der Aufhänger und Überleitungen, die nur zum nächsten Gedanken führen, gehören zu keinem dieser Bausteine und bleiben unmarkiert.",
      labels: ["These", "Begründung", "Beispiel", "Appell"],
      text: [
        { t: "Am Freitagmittag packen viele von uns die schwerste Schultasche der Woche. " },
        {
          t: "Die Schule sollte am Wochenende keine Hausaufgaben mehr aufgeben. ",
          label: 0,
          feedback: "Das ist die These: Sie sagt in einem Satz, was gefordert wird, und wird danach begründet.",
        },
        { t: "Dafür sprechen zwei Gründe. " },
        {
          t: "Erstens brauchen wir die freien Tage zur Erholung, denn wer durchlernt, ist am Montag müde. ",
          label: 1,
          feedback: "Die Begründung mit „denn“ erklärt, warum die These stimmt.",
        },
        {
          t: "Lena aus meiner Klasse etwa paukt jeden Samstag Vokabeln und sitzt am Montag übermüdet im Unterricht. ",
          label: 2,
          feedback: "Ein konkreter Fall aus dem Schulalltag, der die Begründung belegt, also ein Beispiel.",
        },
        { t: "Der zweite Grund ist ebenso wichtig. " },
        {
          t: "Zweitens brauchen wir Zeit für Verein und Familie, weil beides zu unserer Entwicklung gehört. ",
          label: 1,
          feedback: "Auch hier erklärt „weil“, warum die These stimmt: eine zweite Begründung.",
        },
        {
          t: "Jonas trainiert zum Beispiel jeden Samstag mit seiner Handballmannschaft und ist danach zu erschöpft für Aufgaben. ",
          label: 2,
          feedback: "Ein konkreter Fall, der die zweite Begründung belegt: ein Beispiel.",
        },
        { t: "Die Entscheidung liegt jetzt bei den Lehrkräften. " },
        {
          t: "Gebt uns das Wochenende zurück und verzichtet künftig auf Hausaufgaben von Freitag auf Montag!",
          label: 3,
          feedback: "Der Schluss fordert die Lehrkräfte direkt zum Handeln auf. Das ist ein Appell.",
        },
      ],
      conclusion:
        "Die These nennt die Meinung, Begründungen und Beispiele stützen sie, und der Appell fordert am Schluss zum Handeln auf. Überleitungen und Hinführungen gehören zum Text, bilden aber keinen dieser Bausteine.",
    },
    casework: {
      title: "Ein Kommentarentwurf zum Überarbeiten",
      story:
        "Mia schreibt einen Kommentar für die Schülerzeitung. Ihr Entwurf lautet: **„Ich finde, dass Schuluniformen blöd sind. Alle finden das. Außerdem sieht man in Uniform schlecht aus. Deshalb sollte man sie nicht einführen.“**",
      steps: [
        {
          question: "Was fehlt am Anfang des Entwurfs?",
          options: [
            "Ein Aufhänger, der den Anlass nennt und Interesse weckt",
            "Ein Fazit, das die Meinung am Schluss noch einmal zusammenfasst",
            "Ein Beispiel, das die erste Behauptung belegt und veranschaulicht",
          ],
          answer: 0,
          explanation:
            "Der Entwurf springt sofort in die Meinung. Ein Aufhänger würde zeigen, warum das Thema gerade jetzt wichtig ist, zum Beispiel mit einer Beobachtung aus dem Schulalltag.",
        },
        {
          question: "Warum ist „Alle finden das.“ kein tragfähiges Argument?",
          options: [
            "Es nennt keinen Grund: Dass viele etwas finden, zeigt nicht, dass es stimmt.",
            "Es ist zu kurz, denn ein Argument muss mindestens drei Sätze lang sein.",
            "Es ist zu sachlich und passt deshalb nicht in einen Kommentar.",
          ],
          answer: 0,
          explanation:
            "Ein Argument braucht eine Begründung. Zustimmung vieler Menschen ist keine, denn auch viele können sich irren.",
        },
        {
          question: "Wie lässt sich „Außerdem sieht man in Uniform schlecht aus.“ zu einem vollständigen Argument ausbauen?",
          options: [
            "Mit Begründung und Beispiel, etwa: Einheitliche Kleidung lässt wenig Raum für Stil, denn alle tragen dasselbe.",
            "Mit mehr Ausrufezeichen und Übertreibungen, damit die Behauptung noch stärker und lauter wirkt als bisher.",
            "Mit einem zweiten Satz, der dieselbe Behauptung mit anderen Worten noch einmal wiederholt und betont.",
          ],
          answer: 0,
          explanation:
            "Ein Argument wird durch eine Begründung und einen Beleg stark. Ausrufezeichen und Wiederholungen machen eine Behauptung nicht überzeugender.",
        },
        {
          question: "Mia will, dass ihr Kommentar auf einen überzeugenden Höhepunkt zuläuft. Wie ordnet sie ihre Argumente?",
          options: [
            "Das schwächere zuerst und das stärkste zuletzt, vor dem Fazit",
            "Das stärkste zuerst und danach immer schwächere bis zum Schluss",
            "Die Reihenfolge ist egal, wenn alle Argumente vorkommen",
          ],
          answer: 0,
          explanation:
            "Eine Steigerung führt auf das stärkste Argument zu und bleibt den Lesenden am Schluss im Kopf. Eine beliebige Reihenfolge nimmt dem Text diese Kraft.",
        },
      ],
      verdict:
        "Mias Entwurf hat eine These, aber keinen Aufhänger, keine geprüften Argumente und kein Beispiel. Mit Begründungen, Beispielen und einer Steigerung wird daraus ein überzeugender Kommentar.",
    },
    tasks: {
      1: {
        prompt:
          "Thema: Der Schulhof soll mehr Sitzgelegenheiten bekommen. Stichworte: viele stehen in der Pause; Gespräche sind im Sitzen entspannter; Beispiel: Die Klasse 9b sitzt im Winter auf den kalten Treppenstufen. Schreibe aus den Stichworten ein vollständiges Argument in drei bis vier Sätzen mit Behauptung, Begründung und Beispiel.",
        hints: [
          "Beginne mit der Behauptung: Was soll geschehen?",
          "Verknüpfe die Teile mit „denn“, „weil“ und „zum Beispiel“.",
        ],
        model:
          "Der Schulhof sollte mehr Sitzgelegenheiten bekommen. In der Pause stehen die meisten von uns, und Gespräche sind im Sitzen entspannter, denn wer sitzt, muss nicht mit dem Rucksack auf dem Rücken von einem Fuß auf den anderen treten. Zum Beispiel sitzt die Klasse 9b im Winter auf den kalten Treppenstufen, weil es keine Bänke gibt.",
        criteria: [
          "Formuliert eine klare Behauptung.",
          "Begründet sie mit einem erkennbaren Grund.",
          "Stützt die Begründung mit einem konkreten Beispiel.",
        ],
      },
      2: {
        prompt:
          "Schreibe einen Kommentar für die Schülerzeitung (sechs bis acht Sätze) zu der Frage „Sollte die Mittagspause länger dauern?“ Nutze dieses Material: In einer Umfrage der Klasse 9c (für diese Aufgabe erfunden) wünschten sich 21 von 26 Befragten eine längere Mittagspause. Eine Schülerin berichtet, dass sie in 30 Minuten kaum zum Essen kommt, weil die Schlange vor der Mensa so lang ist. Gliedere in Aufhänger, These, mindestens zwei Argumente und Fazit oder Appell.",
        hints: [
          "Ordne die beiden Argumente so, dass das stärkere zuletzt steht.",
          "Gib die Umfrage als Quelle an, zum Beispiel mit „laut einer Umfrage der Klasse 9c …“.",
        ],
        model:
          "Wer in der Mensa ansteht, schaut auf die Uhr und isst am Ende im Stehen. Unsere Mittagspause sollte deshalb länger dauern. Erstens bleibt vielen zu wenig Zeit zum Essen: Eine Schülerin berichtet, dass sie in 30 Minuten kaum etwas isst, weil die Schlange vor der Mensa so lang ist. Vor allem aber ist das kein Einzelfall, denn laut einer Umfrage der Klasse 9c wünschen sich 21 von 26 Befragten eine längere Pause. Wenn die große Mehrheit dasselbe will, sollte die Schulleitung ihr zuhören. Verlängert die Pause um eine Viertelstunde!",
        criteria: [
          "Beginnt mit einem Aufhänger und einer klaren These.",
          "Verknüpft zwei Argumente mit Begründung und Beleg aus dem Material in sinnvoller Reihenfolge.",
          "Schließt mit einem Fazit oder einem Appell.",
        ],
      },
    },
  },
  {
    id: "de-fehler-finden",
    lb: 3,
    unit: "3.3",
    covers: ["3.3.1"],
    title: "Fehler finden und gezielt verbessern",
    intro:
      "Wer seine Fehlerschwerpunkte kennt und seinen Text gezielt prüft, findet Fehler schneller. Dabei helfen Korrekturzeichen und feste Durchgänge.",
    paragraphs: [
      "Nicht jeder macht dieselben Fehler. Bei den einen sind es Kommas, bei anderen „das“ und „dass“ oder die Groß- und Kleinschreibung. Deine **Fehlerschwerpunkte** findest du, wenn du die Fehler aus mehreren Texten sammelst, zum Beispiel in einem **Fehlertagebuch**. Dort trägst du ein, welche Fehlerart wie oft vorkam und wie das Wort oder der Satz richtig heißt. Eine **Fehlerkartei** geht einen Schritt weiter: Auf jeder Karte steht ein Fehlerwort richtig geschrieben, dazu die Regel, die du dir merken willst. Mit diesem Wissen richtest du dein Prüfen auf die Stellen, an denen dir am ehesten etwas unterläuft.",
      "Eine Lehrkraft markiert Fehler oft mit **Korrekturzeichen**. Häufig steht R für Rechtschreibung, Sz für Satzzeichen, G oder Gr für Grammatik, A für Ausdruck und T für Tempus, also die Zeitform. Eine einheitliche Liste gibt es nicht: Manche schreiben Z für die Zeichensetzung, andere für den Zeitfehler. Lass dir deshalb die Zeichen deiner Lehrkraft erklären. Sie zeigen dir, **welche Art** von Fehler vorliegt. Danach suchst du die Regel: Bei einem R-Fehler fragst du, welche Schreibstrategie hilft, bei einem Fehler in den Satzzeichen, wo ein Teilsatz beginnt und endet, bei einem Gr-Fehler, welches Wort sich nach welchem richten muss. Trage den Fehler in dein Tagebuch ein und verbessere ihn selbst.",
      "Beim Überprüfen deines Textes liest du in **Kontrolldurchgängen**: Pro Durchgang achtest du auf eine Fehlerart. Wer alles gleichzeitig prüfen will, liest vor allem auf den Inhalt und übersieht Fehler. Bei der Rechtschreibung hilft es, den Text **rückwärts** zu lesen, Wort für Wort von hinten nach vorn: Dann folgt dein Blick nicht mehr dem Sinn, sondern jedes Wort steht für sich. Bei der Zeichensetzung unterstreichst du die gebeugten Verben und prüfst die Grenzen zwischen den Teilsätzen, denn jeder Teilsatz hat in der Regel ein gebeugtes Verb. Bei der Grammatik fragst du: Passt das Verb zum Subjekt, stimmt die Zeitform, steht der Fall richtig? Beginne mit der Fehlerart, die bei dir am häufigsten vorkommt.",
      "Für unsichere Stellen gibt es Proben. Bei „das“ oder „dass“ ersetzt du das Wort durch „dieses“, „jenes“ oder „welches“: Geht das, schreibst du „das“, sonst „dass“. Bei der Groß- und Kleinschreibung fragst du, ob ein Artikel oder ein Wort wie „etwas“ davorstehen kann: „das Lesen“, „etwas Neues“. Bei unsicheren Endbuchstaben verlängerst du das Wort: „Hund“ schreibst du mit „d“ wegen „Hunde“. Wie ein Wort geschrieben wird, schlägst du im Wörterbuch nach. Bei Kommas nutzt du die Regeln, die du zur Zeichensetzung gelernt hast.",
    ],
    terms: [
      {
        term: "Fehlerschwerpunkt",
        text: "Eine Fehlerart, die bei dir besonders oft vorkommt, zum Beispiel Kommas oder „das“ und „dass“.",
      },
      {
        term: "Fehlertagebuch",
        text: "Eine Sammlung deiner Fehler mit Fehlerart und richtiger Schreibung, die dir zeigt, wo du üben musst.",
      },
      {
        term: "Fehlerkartei",
        text: "Karteikarten mit richtig geschriebenen Fehlerwörtern und der passenden Regel zum Wiederholen.",
      },
      {
        term: "Korrekturzeichen",
        text: "Kurze Zeichen am Rand wie R, Sz oder Gr, die zeigen, welche Art von Fehler vorliegt.",
      },
      {
        term: "Kontrolldurchgang",
        text: "Ein Durchgang durch den Text, bei dem du nur auf eine Fehlerart achtest.",
      },
    ],
    examples: [
      {
        title: "Ein Satz mit drei Fehlern (eigens verfasst)",
        text: "Falsch: Ich weiß das wir gestern abend viel gelacht haben.\nRichtig: Ich weiß, dass wir gestern Abend viel gelacht haben.",
        analysis:
          "In dem Satz stecken drei Fehler, die in getrennten Durchgängen auffallen. **Rechtschreibung:** Nach „gestern“ ist „Abend“ ein Nomen und wird großgeschrieben, und „das“ muss „dass“ heißen, weil es sich nicht durch „dieses“ ersetzen lässt. **Zeichensetzung:** Vor dem Nebensatz mit „dass“ fehlt das Komma. Mit den Zeichen R und Sz am Rand wüsstest du sofort, wonach du suchen musst.",
      },
    ],
    takeaway:
      "Sammle deine Fehler in einem Tagebuch oder einer Kartei, um Schwerpunkte zu erkennen. Prüfe deinen Text in Durchgängen mit jeweils einer Fehlerart, lies zur Rechtschreibung rückwärts und nutze Proben und Wörterbuch.",
    sourceIds: ["lp", "regelwerk", "duden", "isb-leistung"],
    quiz: {
      question: "Was ist beim Überprüfen deines Textes am sinnvollsten?",
      answer: "Ich lese den Text mehrmals und achte bei jedem Durchgang auf eine Fehlerart.",
      wrong: [
        "Ich lese den Text einmal langsam und achte dabei auf alle Fehlerarten zugleich.",
        "Ich lese den Text einmal zügig durch, weil Fehler beim schnellen Lesen auffallen.",
      ],
      explanation:
        "Wer auf alles gleichzeitig achtet, liest vor allem auf den Inhalt und übersieht Fehler. Mit einer Fehlerart pro Durchgang suchst du gezielter. Zügiges Lesen lässt den Blick über Fehler hinweggleiten, besonders über Wörter, die du für richtig hältst.",
    },
    workshop: {
      kind: "mark",
      title: "Fehler in einem Schülertext finden",
      instruction:
        "Der Bericht über einen Zoobesuch enthält sieben Fehler. Wähle oben eine Fehlerart und klicke die Stelle an, an der der Fehler steckt. Bei einem fehlenden Komma markierst du die Wörter um die Stelle herum. „das“ und „dass“ gehören zur Rechtschreibung, der Fall (Kasus) und die Verbform zur Grammatik. Richtige Stellen bleiben unmarkiert.",
      labels: ["Rechtschreibung", "Zeichensetzung", "Grammatik"],
      text: [
        { t: "Am Dienstag war die Klasse 9c im Zoo. " },
        { t: "Wir sind früh aufgestanden und mit dem Zug gefahren. " },
        { t: "Vom Bahnhof aus liefen wir die " },
        {
          t: "Strasse",
          label: 0,
          feedback: "Nach dem langen Vokal „a“ steht „ß“, also „Straße“.",
        },
        { t: " entlang bis zum Eingang. " },
        { t: "Mein Freund Jonas, der gern " },
        {
          t: "fotografiert hat",
          label: 1,
          feedback: "Der Relativsatz „der gern fotografiert“ ist eingeschoben. Das Komma davor steht schon, es fehlt das zweite hinter „fotografiert“.",
        },
        { t: " viele Bilder gemacht. " },
        { t: "Ich glaube, " },
        {
          t: "das",
          label: 0,
          feedback: "Das Wort leitet einen Nebensatz ein und lässt sich nicht durch „dieses“ ersetzen. Es muss „dass“ heißen.",
        },
        { t: " wir dort viel gelernt haben. " },
        { t: "Ich habe " },
        {
          t: "dem Tierpfleger",
          label: 2,
          feedback: "„fragen“ verlangt den Akkusativ: „den Tierpfleger“. Mit dem Dativ „dem“ ist die Grammatik falsch.",
        },
        { t: " gefragt, wie alt die Elefanten werden. " },
        { t: "Die Pinguine " },
        {
          t: "war",
          label: 2,
          feedback: "Das Verb muss zum Subjekt passen: „Die Pinguine“ steht im Plural, also „waren“.",
        },
        { t: " am lustigsten. " },
        { t: "Am Abend war ich " },
        {
          t: "müde weil",
          label: 1,
          feedback: "Vor dem Nebensatz mit „weil“ steht ein Komma: „müde, weil“.",
        },
        { t: " wir so früh aufgestanden waren. " },
        { t: "Zum Schluss gab es Eis, es war das erste " },
        {
          t: "mal",
          label: 0,
          feedback: "In „das erste Mal“ ist „Mal“ ein Nomen und wird großgeschrieben.",
        },
        { t: " in diesem Jahr." },
      ],
      conclusion:
        "Fehler lassen sich nach ihrer Art sortieren: Rechtschreibung, Zeichensetzung und Grammatik brauchen jeweils eine eigene Frage. Wer sie in getrennten Durchgängen stellt, übersieht weniger.",
    },
    casework: {
      title: "Bens Fehlertagebuch",
      story:
        "Ben hat die Fehler aus seinen letzten drei Aufsätzen in sein Fehlertagebuch eingetragen: **Zeichensetzung 14 Fehler, „das“ statt „dass“ 3 Fehler, Groß- und Kleinschreibung 2 Fehler, Grammatik 1 Fehler.** Für den nächsten Aufsatz will er sich vorbereiten.",
      steps: [
        {
          question: "Was ist Bens Fehlerschwerpunkt?",
          options: [
            "Die Zeichensetzung, denn dort liegen die meisten Fehler",
            "Die Grammatik, weil sie am schwierigsten ist",
            "Die Groß- und Kleinschreibung, weil sie in jedem Satz vorkommt",
          ],
          answer: 0,
          explanation:
            "Der Schwerpunkt ist die Fehlerart, die bei Ben am häufigsten vorkommt. Mit 14 von 20 Fehlern ist das die Zeichensetzung.",
        },
        {
          question: "Welche Vorbereitung passt zu seinem Schwerpunkt am besten?",
          options: [
            "Er wiederholt die Kommaregeln und prüft im Text jeden Teilsatz in einem eigenen Durchgang.",
            "Er lernt eine lange Liste schwieriger Wörter auswendig und übt sie bis zum Aufsatz.",
            "Er liest den Text einmal schnell durch und hofft, dass ihm Fehler auffallen.",
          ],
          answer: 0,
          explanation:
            "Gegen Kommafehler helfen die Regeln und ein eigener Durchgang, in dem er Teilsätze zählt und ihre Grenzen prüft. Das Auswendiglernen von Wörtern löst dieses Problem nicht.",
        },
        {
          question: "Wie kann Ben bei einem unsicheren „das“ oder „dass“ entscheiden?",
          options: [
            "Er versucht, das Wort durch „dieses“ oder „welches“ zu ersetzen. Geht das, schreibt er „das“.",
            "Er schreibt im Zweifel immer „dass“, weil ein Fehler dort weniger auffällt und selten bewertet wird.",
            "Er schreibt „das“ vor Nomen und „dass“ nach einem Komma, so passt es in den meisten Sätzen.",
          ],
          answer: 0,
          explanation:
            "Die Ersatzprobe funktioniert zuverlässig. Eine Regel wie „nach dem Komma steht dass“ führt in die Irre, denn auch ein Relativsatz wie „das Buch, das ich lese“ steht nach einem Komma.",
        },
        {
          question: "Warum trägt Ben jeden gefundenen Fehler in sein Fehlertagebuch ein?",
          options: [
            "So sieht er nach einiger Zeit, ob sich seine Schwerpunkte verändern, und kann gezielt üben.",
            "So kann die Lehrkraft seine Fehler beim Korrigieren leichter zählen und die Note schneller berechnen.",
            "So muss er den nächsten Text nicht mehr gründlich überprüfen, weil er seine Fehler schon kennt.",
          ],
          answer: 0,
          explanation:
            "Das Tagebuch macht Fortschritte und neue Schwerpunkte sichtbar. Prüfen muss Ben seine Texte trotzdem, aber er weiß, wonach er suchen muss.",
        },
      ],
      verdict:
        "Ben erkennt seinen Schwerpunkt an den Zahlen im Fehlertagebuch und bereitet sich gezielt vor: ein eigener Durchgang für die Kommas, die Ersatzprobe für „das“ und „dass“. Wer seine Fehler kennt, findet sie schneller.",
    },
    practice: {
      kind: "choose",
      title: "Richtig oder falsch geschrieben: drei Sätze pro Runde",
      instruction:
        "Wähle in jedem Satz die richtige Schreibung oder Form für die Lücke. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "Ich glaube, ",
            options: ["das", "dass"],
            answer: 1,
            after: " du recht hast.",
            feedback: "Das Wort leitet einen Nebensatz ein und lässt sich nicht durch „dieses“ ersetzen, deshalb heißt es „dass“.",
          },
          {
            before: "Mia liest ein Buch, ",
            options: ["das", "dass"],
            answer: 0,
            after: " sie von Lena bekommen hat.",
            feedback: "Das Wort bezieht sich auf „Buch“ und lässt sich durch „welches“ ersetzen, deshalb heißt es „das“.",
          },
          {
            before: "Wir sind gestern ",
            options: ["Abend", "abend"],
            answer: 0,
            after: " ins Kino gegangen.",
            feedback: "Nach „gestern“ ist die Tageszeit ein Nomen und wird großgeschrieben: „gestern Abend“.",
          },
          {
            before: "Beim ",
            options: ["Lesen", "lesen"],
            answer: 0,
            after: " habe ich die Zeit vergessen.",
            feedback: "„beim“ bedeutet „bei dem“, also steht danach ein Nomen. Das Verb wird zum Nomen und großgeschrieben.",
          },
          {
            before: "Das war das erste ",
            options: ["Mal", "mal"],
            answer: 0,
            after: " in diesem Jahr.",
            feedback: "In „das erste Mal“ ist „Mal“ ein Nomen und wird großgeschrieben.",
          },
          {
            before: "Er hat sich den ",
            options: ["Fuß", "Fuss"],
            answer: 0,
            after: " verletzt.",
            feedback: "Nach dem langen Vokal „u“ steht „ß“, wie auch in „Füße“.",
          },
          {
            before: "Hilfst du ",
            options: ["mir", "mich"],
            answer: 0,
            after: " bei den Hausaufgaben?",
            feedback: "„helfen“ verlangt den Dativ. Probe: Wem hilfst du? Also heißt es „mir“.",
          },
          {
            before: "Mia und Jonas ",
            options: ["gehen", "geht"],
            answer: 0,
            after: " zusammen zur Schule.",
            feedback: "Zwei Personen bilden gemeinsam das Subjekt, deshalb steht das Verb im Plural: „gehen“.",
          },
          {
            before: "Sie fragt ",
            options: ["den", "dem"],
            answer: 0,
            after: " Lehrer nach dem Weg.",
            feedback: "„fragen“ verlangt den Akkusativ. Probe: Wen fragt sie? Also „den Lehrer“.",
          },
          {
            before: "Ich bin ",
            options: ["seit", "seid"],
            answer: 0,
            after: " gestern erkältet.",
            feedback: "„seit“ nennt den Beginn einer Zeitspanne. „seid“ gehört zu „sein“ und passt nur zu „ihr“.",
          },
        ],
        2: [
          {
            before: "Die Klasse wusste nicht, ",
            options: ["das", "dass"],
            answer: 1,
            after: " der Ausflug wegen des Regens ausfallen würde.",
            feedback: "Der Nebensatz wird mit „dass“ eingeleitet. „dieses“ ließe sich an dieser Stelle nicht einsetzen.",
          },
          {
            before: "Das Buch, ",
            options: ["das", "dass"],
            answer: 0,
            after: " ich gestern gelesen habe, war sehr spannend.",
            feedback: "Das Wort bezieht sich auf „Buch“ und lässt sich durch „welches“ ersetzen. Es ist ein Relativpronomen: „das“.",
          },
          {
            before: "Im Unterricht haben wir heute viel ",
            options: ["Neues", "neues"],
            answer: 0,
            after: " über das Mittelalter gelernt.",
            feedback: "Nach „viel“ wird das Adjektiv zum Nomen und großgeschrieben: „viel Neues“.",
          },
          {
            before: "Die Lehrerin hat ",
            options: ["den Kindern", "die Kinder"],
            answer: 0,
            after: " die Aufgabe noch einmal erklärt.",
            feedback: "„erklären“ verlangt für die Person den Dativ. Probe: Wem hat sie es erklärt? Also „den Kindern“.",
          },
          {
            before: "Am Sonntag blieben wir den ganzen Tag zu Hause, weil ",
            options: ["es heftig regnete", "regnete es heftig"],
            answer: 0,
            after: ".",
            feedback: "In der Standardsprache steht das gebeugte Verb in einem Nebensatz mit „weil“ am Ende: „weil es heftig regnete“. Die Verbindung mit Verb an zweiter Stelle gehört zur gesprochenen Sprache.",
          },
          {
            before: "Jonas wartete lange am Bahnsteig, ",
            options: ["denn", "den"],
            answer: 0,
            after: " sein Zug hatte fast eine Stunde Verspätung.",
            feedback: "„denn“ mit zwei „n“ verbindet zwei Hauptsätze und begründet. „den“ ist ein Artikel oder Pronomen und passt hier nicht.",
          },
          {
            before: "Meine Eltern und mein Bruder ",
            options: ["fahren", "fährt"],
            answer: 0,
            after: " im Sommer für drei Wochen nach Italien.",
            feedback: "Drei Personen bilden das Subjekt, deshalb steht das Verb im Plural: „fahren“.",
          },
          {
            before: "Ich habe ",
            options: ["heute Morgen", "heute morgen"],
            answer: 0,
            after: " den Bus verpasst und kam deshalb zu spät zur Schule.",
            feedback: "Nach „heute“ wird die Tageszeit als Nomen großgeschrieben: „heute Morgen“.",
          },
          {
            before: "Schon beim ersten Versuch war etwas schiefgegangen, und obwohl wir alles genau vorbereitet hatten, ist das Experiment ",
            options: ["wieder", "wider"],
            answer: 0,
            after: " misslungen.",
            feedback: "„wieder“ bedeutet „erneut“. „wider“ bedeutet „gegen“, wie in „Widerspruch“.",
          },
          {
            before: "Ihr ",
            options: ["seid", "seit"],
            answer: 0,
            after: " alle herzlich zu unserer Abschlussfeier am Freitag eingeladen.",
            feedback: "„ihr seid“ ist eine Form von „sein“. Probe: Passt „wir sind“, schreibst du „seid“.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "Im folgenden Text stecken vier Fehler: „Gestern hat mir meine Schwester geholfen weil ich nicht weiter wuste. Sie sagte, das ich den Text zuerst lesen soll. Dem Lehrer habe ich später nach der Lösung gefragt.“ Schreibe den Text fehlerfrei auf und nenne zu jedem Fehler die Fehlerart (Rechtschreibung, Zeichensetzung oder Grammatik).",
        hints: [
          "Lies den Text dreimal: einmal auf die Rechtschreibung, einmal auf die Kommas und einmal auf die Grammatik.",
          "Bei „das“ und „dass“ hilft die Ersatzprobe mit „dieses“ oder „welches“.",
        ],
        model:
          "Gestern hat mir meine Schwester geholfen, weil ich nicht weiter wusste. Sie sagte, dass ich den Text zuerst lesen soll. Den Lehrer habe ich später nach der Lösung gefragt. Die Fehler: Vor „weil“ fehlte das Komma (Zeichensetzung). „wuste“ muss „wusste“ heißen (Rechtschreibung). „das“ muss „dass“ heißen, weil es einen Nebensatz einleitet (Rechtschreibung). „fragen“ verlangt den Akkusativ, also „den Lehrer“ (Grammatik).",
        criteria: [
          "Schreibt den Text vollständig fehlerfrei auf.",
          "Nennt zu jedem der vier Fehler die Fehlerart.",
          "Begründet mindestens zwei Verbesserungen mit einer Regel oder Probe.",
        ],
      },
      2: {
        prompt:
          "Aus deinen letzten drei Aufsätzen hast du diese Fehler gesammelt: 9 Kommafehler, 5 Fehler bei der Groß- und Kleinschreibung und 2 Fehler bei „das“ und „dass“. Schreibe in fünf bis sechs Sätzen einen Plan, wie du deinen nächsten Aufsatz überprüfst: Reihenfolge der Durchgänge, eine Probe oder Strategie für jeden Schwerpunkt und ein Hilfsmittel zum Nachschlagen.",
        hints: [
          "Beginne mit dem Schwerpunkt, bei dem du die meisten Fehler gemacht hast.",
          "Nenne zu jedem Schwerpunkt, worauf du genau achtest, zum Beispiel auf gebeugte Verben oder auf Artikel.",
        ],
        model:
          "Zuerst prüfe ich die Kommas, weil dort die meisten meiner Fehler liegen. Dazu unterstreiche ich alle gebeugten Verben, zähle die Teilsätze und prüfe, ob zwischen ihnen ein Komma steht. Im zweiten Durchgang achte ich auf die Groß- und Kleinschreibung: Ich frage bei jedem Wort, ob ein Artikel oder „etwas“ davorstehen kann. Im dritten Durchgang suche ich alle „das“ und „dass“ und wende die Ersatzprobe mit „dieses“ an. Bei Unsicherheit schlage ich im Wörterbuch nach und trage neue Fehler in mein Fehlertagebuch ein.",
        criteria: [
          "Legt eine Reihenfolge von Durchgängen mit je einer Fehlerart fest.",
          "Nennt für jeden der drei Schwerpunkte eine passende Probe oder Strategie.",
          "Nennt ein Hilfsmittel zum Nachschlagen oder zum Festhalten der Fehler.",
        ],
      },
    },
  },
  {
    id: "de-text-ueberarbeiten",
    lb: 3,
    unit: "3.3",
    covers: ["3.3.2"],
    title: "Texte kriteriengeleitet überarbeiten",
    intro:
      "Ein erster Entwurf ist selten fertig. Mit Kriterien, bewährten Verfahren und Rückmeldungen anderer machst du ihn verständlicher und wirksamer.",
    paragraphs: [
      "Beim Überarbeiten verbesserst du Inhalt und Sprache deines Textes. Das ist mehr als Fehlerkorrektur, denn du prüfst, ob dein Text das erreicht, was du mit ihm willst. Dafür helfen fünf **Kriterien**. **Verständlichkeit:** Können die Lesenden dir folgen, sind die Sätze klar und Fachwörter erklärt? **Vollständigkeit:** Steht alles darin, was die Lesenden wissen müssen, zum Beispiel Zeit, Ort und Grund? **Richtigkeit:** Stimmen Angaben, Zusammenhänge und Schreibweisen? **Abwechslungsreichtum:** Variierst du Wortwahl, Satzanfänge und Satzbau? **Wirksamkeit und Angemessenheit:** Passen die sprachlichen Mittel zu Schreibabsicht, Format und Adressat?",
      "Die letzte Frage entscheidet oft über den Ton. Eine Nachricht an die Lehrerin braucht eine andere Anrede und Wortwahl als eine Nachricht an eine Freundin, ein Kommentar darf klarer Stellung beziehen als ein Bericht, und eine Einladung muss vor allem vollständig sein. Der **Adressat** ist die Person oder Gruppe, für die du schreibst. Lies deinen Text deshalb mit den Augen der Lesenden: Wer liest ihn? Was will ich erreichen? In welchem Format steht er? Überarbeite erst, wenn du etwas Abstand hast, zum Beispiel nach einer Pause, und lies den Text einmal laut.",
      "Zum Verändern nutzt du mehrere Verfahren. Beim **Ersatz** tauschst du ein Wort oder eine Wortgruppe aus, zum Beispiel „machen“ gegen „basteln“. Bei der **Umstellung** änderst du die Reihenfolge von Satzgliedern oder Sätzen, um Wiederholungen zu vermeiden oder etwas zu betonen. Die **Paraphrase** formuliert eine Aussage mit anderen Worten noch einmal, etwa wenn ein Satz zu verschachtelt ist. Mit einer **Ergänzung** fügst du etwas Fehlendes hinzu, mit einer Streichung nimmst du Überflüssiges heraus. Verändere immer nur so viel, wie das Kriterium verlangt, und prüfe danach, ob der Text noch zusammenpasst.",
      "Rückmeldungen anderer zeigen dir, was du selbst nicht mehr siehst. Bei der **Fragelawine** (auch Fragen- oder Kommentarlawine) wird dein Text weitergegeben, und die Lesenden schreiben Fragen, Kommentare und Verbesserungsvorschläge dazu. Jede Frage, die offen bleibt, zeigt dir, was du ergänzen musst. Bei der **Textwanderung** geht der Text nacheinander durch eine kleine Gruppe, und jede Person prüft ihn und ergänzt Verbesserungsvorschläge. In einer **Schreibkonferenz** liest du deinen Text meist einer kleinen Gruppe vor, und alle sagen anhand von Kriterien, was gut ist und was besser werden kann. Du entscheidest selbst, welche Hinweise du aufnimmst: Prüfe jeden Hinweis und nutze ihn für Ergänzungen, Umstellungen und Korrekturen.",
    ],
    terms: [
      {
        term: "Überarbeiten",
        text: "Das Verbessern eines Entwurfs in Inhalt und Sprache, damit er zu Absicht, Format und Adressat passt.",
      },
      {
        term: "Adressat",
        text: "Die Person oder Gruppe, für die ein Text geschrieben ist und nach der du Ton und Wortwahl richtest.",
      },
      {
        term: "Ersatz",
        text: "Ein Wort oder eine Wortgruppe wird durch eine passendere ersetzt.",
      },
      {
        term: "Umstellung",
        text: "Satzglieder oder Sätze erhalten eine andere Reihenfolge, ohne dass sich der Inhalt ändert.",
      },
      {
        term: "Paraphrase",
        text: "Eine Aussage wird mit anderen Worten noch einmal formuliert.",
      },
      {
        term: "Fragelawine",
        text: "Ein Feedbackverfahren, bei dem ein Text weitergegeben wird und andere Fragen, Kommentare und Verbesserungsvorschläge dazuschreiben.",
      },
    ],
    examples: [
      {
        title: "Ein Absatz vor und nach der Überarbeitung (eigens verfasst)",
        text: "Vorher: Ich bin dann in die Stadt gegangen. Dann habe ich einen Laden gesehen. Dann bin ich da reingegangen. Dort war es toll.\nNachher: Am Nachmittag schlenderte ich durch die Innenstadt. Neben dem Bahnhof entdeckte ich einen kleinen Plattenladen. Als ich eintrat, empfing mich der Duft von Staub und altem Papier.",
        analysis:
          "**Abwechslungsreichtum:** Das dreimal wiederholte „dann“ ist verschwunden, weil Zeit und Ort an den Satzanfang gerückt sind (**Umstellung**). **Ersatz:** „gegangen“ wurde zu „schlenderte“, und die Umgangssprache „da reingegangen“ wurde durch „als ich eintrat“ ersetzt. **Ergänzung:** Der Laden ist jetzt genauer beschrieben und hat einen Ort. Der Satz „Dort war es toll“ wurde durch einen Sinneseindruck ersetzt, der zeigt, statt zu bewerten. So wird der Text anschaulicher und wirksamer.",
      },
    ],
    takeaway:
      "Überarbeite kriteriengeleitet: Verständlichkeit, Vollständigkeit, Richtigkeit, Abwechslung und Angemessenheit für Absicht, Format und Adressat. Nutze Ersatz, Umstellung, Paraphrase, Ergänzung und Streichung und prüfe Rückmeldungen, bevor du sie übernimmst.",
    sourceIds: ["lp", "isb-methoden", "isb-ueberarbeiten"],
    quiz: {
      question: "Welche Änderung ist eine Umstellung?",
      answer: "Aus „Wir haben am Samstag gespielt“ wird „Am Samstag haben wir gespielt“.",
      wrong: [
        "Aus „Wir haben am Samstag gespielt“ wird „Wir haben am Samstag gekickt“.",
        "Aus „Wir haben am Samstag gespielt“ wird „Wir haben am Samstag im Park gespielt“.",
      ],
      explanation:
        "Bei der Umstellung ändert sich nur die Reihenfolge der Satzglieder. Im zweiten Satz wird ein Wort ersetzt, im dritten eine Ortsangabe ergänzt.",
    },
    workshop: {
      kind: "classify",
      title: "Welches Verfahren wurde genutzt?",
      instruction:
        "Jeder Eintrag zeigt eine Änderung an einem Entwurf. Ordne sie dem Überarbeitungsverfahren zu, das sie beschreibt.",
      categories: ["Ersatz", "Umstellung", "Paraphrase", "Ergänzung"],
      entries: [
        {
          text: "Aus „Die Suppe war gut“ wird „Die Suppe war würzig“.",
          target: 0,
          feedback: "Ein einzelnes Wort wird durch ein genaueres ersetzt.",
        },
        {
          text: "Aus „Wir feierten den ganzen Abend im Garten“ wird „Den ganzen Abend feierten wir im Garten“.",
          target: 1,
          feedback: "Nur die Reihenfolge der Satzglieder ändert sich, der Inhalt bleibt gleich.",
        },
        {
          text: "Der umständliche Satz „Die Veranstaltung wurde aufgrund der Witterungsverhältnisse abgesagt“ wird mit anderen Worten und anderem Satzbau noch einmal gesagt: „Weil das Wetter schlecht war, fiel die Veranstaltung aus.“",
          target: 2,
          feedback: "Dieselbe Aussage wird mit anderen Worten und einfacher noch einmal formuliert.",
        },
        {
          text: "Aus „Wir trafen uns“ wird „Wir trafen uns um 15 Uhr vor dem Kino“.",
          target: 3,
          feedback: "Zeit und Ort fehlten und werden hinzugefügt.",
        },
        {
          text: "Aus „Er machte ein Plakat“ wird „Er zeichnete ein Plakat“.",
          target: 0,
          feedback: "Das Verb „machen“ wird durch ein genaueres Verb ersetzt.",
        },
        {
          text: "Aus „Der Hund bellte“ wird „Der Hund bellte laut, weil jemand klingelte“.",
          target: 3,
          feedback: "Der Satz wird um eine Angabe und einen Grund erweitert.",
        },
      ],
      conclusion:
        "Ersatz tauscht Wörter aus, Umstellung ändert die Reihenfolge, Paraphrase formuliert neu und Ergänzung fügt Fehlendes hinzu. Welches Verfahren passt, hängt vom Kriterium ab, das du verbessern willst.",
    },
    casework: {
      title: "Eine Einladung mit Rückmeldung",
      story:
        "Aylin schreibt für die Eltern der Klasse 9a eine Einladung zum Schulfest. Ihr Entwurf lautet: **„Hallo Leute! Es gibt bald ein Fest. Kommt vorbei, es wird total cool.“** Ben liest den Entwurf und stellt Fragen dazu: **„Wann und wo ist das Fest? Was soll ich mitbringen?“**",
      steps: [
        {
          question: "Welches Kriterium verletzt der Satz „Es gibt bald ein Fest.“ vor allem?",
          options: ["Vollständigkeit", "Abwechslungsreichtum", "Richtigkeit"],
          answer: 0,
          explanation:
            "Wichtige Angaben wie Datum, Uhrzeit und Ort fehlen. Die Lesenden wissen nicht, wann und wo sie sein sollen.",
        },
        {
          question: "Welches Kriterium verletzt „Hallo Leute!“ in einer Einladung an Eltern?",
          options: [
            "Die Angemessenheit für den Adressaten",
            "Die Verständlichkeit der Satzstruktur",
            "Die Vollständigkeit der Angaben",
          ],
          answer: 0,
          explanation:
            "Anrede und Ton passen nicht zu den Eltern. Eine Einladung an Erwachsene braucht eine höflichere Anrede wie „Liebe Eltern“.",
        },
        {
          question: "Was an Bens Rückmeldung ist typisch für eine Fragelawine?",
          options: [
            "Er stellt Fragen an den Text, und offene Fragen zeigen Aylin, was sie ergänzen muss.",
            "Er korrigiert alle Fehler selbst und gibt Aylin den fertigen, fehlerfreien Text zurück.",
            "Er schreibt eine eigene Einladung und ersetzt damit ihren Entwurf vollständig.",
          ],
          answer: 0,
          explanation:
            "Bei der Fragelawine schreiben die Lesenden Fragen und Kommentare zum Text. Offene Fragen wie „Wann und wo?“ zeigen, was Aylin ergänzen muss. Die Verfasserin entscheidet danach selbst, was sie übernimmt.",
        },
        {
          question: "Wie nutzt Aylin Bens Rückmeldung am sinnvollsten?",
          options: [
            "Sie prüft die Fragen, ergänzt Datum, Uhrzeit, Ort und Mitbringliste und ändert die Anrede.",
            "Sie übernimmt alle Fragen unbesehen als Sätze in die Einladung, ohne sie zu prüfen.",
            "Sie lässt den Text unverändert, weil Fragen keine Kritik an der Einladung sind.",
          ],
          answer: 0,
          explanation:
            "Aylin entscheidet selbst, welche Hinweise sie aufnimmt. Die Fragen zeigen, was fehlt, und sie ergänzt es in der passenden Form.",
        },
      ],
      verdict:
        "Aylin prüft ihren Entwurf nach Kriterien: Er ist unvollständig und im Ton unpassend für die Eltern. Bens Fragen zeigen, was fehlt, und sie ergänzt und ändert gezielt, statt alles zu übernehmen.",
    },
    tasks: {
      1: {
        prompt:
          "Überarbeite den folgenden Text in vier bis fünf Sätzen: „Gestern war ich im Zoo. Dann habe ich einen Affen gesehen. Dann habe ich noch einen Affen gesehen. Der war toll.“ Beseitige die Wiederholungen durch Umstellung, ersetze „toll“ durch genauere Wörter und ergänze eine Angabe, die den Lesenden fehlt. Nenne danach in einem Satz, welche Verfahren du genutzt hast.",
        hints: [
          "Beginne nicht mehr jeden Satz mit „dann“: Stelle Zeit- oder Ortsangaben an den Anfang.",
          "Frage dich bei „toll“: Was war an dem Affen besonders? Beschreibe es.",
        ],
        model:
          "Gestern besuchte ich den Zoo. Zuerst entdeckte ich einen Affen, der sich an einem Seil entlanghangelte. Kurz darauf sah ich einen zweiten, der einem Tierpfleger einen Apfel aus der Tasche zog. Dieser Affe war besonders frech und brachte alle in der Nähe zum Lachen. Genutzt habe ich Umstellung (Zeitangaben am Satzanfang), Ersatz (genaue Verben statt „toll“) und Ergänzung (was die Affen taten).",
        criteria: [
          "Beginnt nicht mehr mehrere Sätze mit „dann“.",
          "Ersetzt „toll“ durch genauere Wörter oder Beschreibungen.",
          "Nennt die genutzten Verfahren.",
        ],
      },
      2: {
        prompt:
          "Du hast an deine Lehrerin diese Nachricht geschickt: „Hey! Komm morgen nicht, hab Bauchweh. Bis dann.“ Überarbeite sie für diese Adressatin in vier bis fünf Sätzen und nenne danach in zwei Sätzen, nach welchen Kriterien du überarbeitet hast.",
        hints: [
          "Prüfe Anrede, Wortwahl und Gruß: Passen sie zu einer Lehrerin?",
          "Prüfe die Vollständigkeit: Was muss die Lehrerin wissen, zum Beispiel Wer? Wann? Warum? Und was ist mit dem Unterrichtsstoff?",
        ],
        model:
          "Sehr geehrte Frau Krämer, ich kann morgen nicht am Unterricht teilnehmen, weil ich Bauchschmerzen habe. Die Hausaufgaben hole ich bei meiner Sitznachbarin ab, sobald ich wieder gesund bin. Ich bitte Sie, mein Fehlen zu entschuldigen. Mit freundlichen Grüßen Lina Vogt. Ich habe nach Angemessenheit überarbeitet, denn Anrede, Wortwahl und Gruß passen jetzt zu einer Lehrerin, und nach Vollständigkeit, denn Grund und Umgang mit dem Stoff stehen nun im Text.",
        criteria: [
          "Passt Anrede, Ton und Gruß an die Lehrerin an.",
          "Ergänzt Grund und Umgang mit dem Unterrichtsstoff.",
          "Nennt zwei Kriterien, nach denen überarbeitet wurde.",
        ],
      },
    },
  },
  {
    id: "de-nachschlagen-tools",
    lb: 3,
    unit: "3.3",
    covers: ["3.3.3"],
    title: "Nachschlagewerke und Programme überlegt nutzen",
    intro:
      "Wörterbuch, Rechtschreibprüfung und Thesaurus helfen beim Überarbeiten. Du musst aber wissen, was sie können und wo ihre Grenzen liegen.",
    paragraphs: [
      "Beim Überarbeiten sind Nachschlagewerke dein wichtigstes Werkzeug. Ein **Rechtschreibwörterbuch** zeigt, wie ein Wort geschrieben und getrennt wird und welche Form es hat. Ein **Synonymwörterbuch** (Thesaurus) nennt bedeutungsähnliche Wörter, ein **Fremdwörterbuch** erklärt Wörter aus anderen Sprachen, und ein Grammatikbuch zeigt Regeln. Online hilft dir zum Beispiel das DWDS mit Bedeutung, Beispielen und bedeutungsverwandten Ausdrücken. Zum Nachschlagen suchst du meist die Grundform: das Verb im Infinitiv („gesehen“ findest du unter „sehen“), das Nomen im Singular und das Adjektiv ohne Endung. Findest du ein Wort nicht, probiere mögliche Schreibungen aus.",
      "Programme zur Überarbeitung sind schnelle Helfer. Eine einfache **Rechtschreibprüfung** vergleicht jedes Wort mit einer Wortliste und markiert, was dort fehlt. Das fängt viele Tippfehler und Buchstabendreher. Ein **Thesaurus** im Textprogramm schlägt bedeutungsähnliche Wörter vor, wenn du ein Wort ersetzen möchtest. Beide Werkzeuge sparen Zeit, aber sie verstehen deinen Text nicht. Sie sehen nur einzelne Wörter, nicht den Zusammenhang. Darum gilt: Du entscheidest, die Programme schlagen nur vor.",
      "Eine Rechtschreibprüfung hat klare Grenzen. Eine einfache Prüfung merkt nicht, wenn ein **richtig geschriebenes Wort an der falschen Stelle** steht. Beispiele sind „Wir fahren ans Mehr“ statt „Meer“ oder „den“ statt „denn“: Beide Wörter gibt es, und sie stehen in der Wortliste. Bei der **Groß- und Kleinschreibung** und bei **Kommas** sind Programme nicht immer zuverlässig, weil es dafür auf den Sinn und den Satzbau ankommt. Umgekehrt markiert sie manchmal **richtig Geschriebenes**, etwa Eigennamen und Fachwörter, die nicht in ihrer Wortliste stehen. Und ein automatischer Korrekturvorschlag kann einen Fehler erst erzeugen. Lies deshalb jeden Text nach dem Prüfen noch einmal selbst, mit den Kontrolldurchgängen, die du kennst.",
      "Auch ein Thesaurus liefert nicht immer passende Wörter. Synonyme sind selten völlig gleichbedeutend: Sie unterscheiden sich in Bedeutung, Ton und Gebrauch. Zu „alt“ nennt ein Thesaurus zum Beispiel „betagt“, „antik“ und „vorsintflutlich“. „Betagt“ ist gehoben und passt für einen Menschen, „antik“ meint etwas aus dem Altertum oder Altertümliches, und „vorsintflutlich“ ist umgangssprachlich, scherzhaft und meint „völlig veraltet“. Außerdem hat manches Wort mehrere Bedeutungen, und der Thesaurus nennt Vorschläge für alle. Prüfe deshalb jeden Vorschlag: Passt die Bedeutung? Passt der Ton? Passt er grammatisch in den Satz? Im Zweifel schlägst du das Wort im Wörterbuch nach.",
    ],
    terms: [
      {
        term: "Rechtschreibprüfung",
        text: "Ein Programm, das Wörter mit einer Wortliste vergleicht und Unbekanntes markiert, den Sinn aber nicht versteht.",
      },
      {
        term: "Thesaurus",
        text: "Eine Sammlung bedeutungsähnlicher Wörter, aus der du Ersatzwörter wählen kannst, die aber nicht immer passen.",
      },
      {
        term: "Synonym",
        text: "Ein Wort mit ähnlicher Bedeutung wie ein anderes, das sich in Ton und Gebrauch unterscheiden kann.",
      },
      {
        term: "Grundform",
        text: "Die Form, unter der ein Wort im Wörterbuch steht: Infinitiv, Nominativ Singular oder Adjektiv ohne Endung.",
      },
      {
        term: "Nachschlagewerk",
        text: "Ein Buch oder Onlineangebot, in dem du Schreibung, Bedeutung oder Regeln eines Wortes nachsehen kannst.",
      },
    ],
    examples: [
      {
        title: "Was die Rechtschreibprüfung übersieht (eigens verfasst)",
        text: "Entwurf: Im Sommer fahren wir ans Mehr und bauen ein Zeit auf, den wir wollen draußen schlafen.\nKorrigiert: Im Sommer fahren wir ans Meer und bauen ein Zelt auf, denn wir wollen draußen schlafen.",
        analysis:
          "Alle drei Fehler sind richtig geschriebene Wörter: „Mehr“, „Zeit“ und „den“ stehen in der Wortliste. Eine einfache Rechtschreibprüfung, die einzelne Wörter vergleicht, markiert deshalb nichts. Du findest die Fehler nur, wenn du den Satz liest und fragst, ob jedes Wort in den Zusammenhang passt: Ans Meer fährt man, ein Zelt baut man auf, und „denn“ begründet.",
      },
    ],
    takeaway:
      "Nachschlagewerke und Programme helfen, ersetzen aber dein Lesen nicht. Eine Rechtschreibprüfung übersieht richtig geschriebene, aber falsche Wörter und markiert manchmal Richtiges. Ein Thesaurus liefert Vorschläge, deren Bedeutung und Ton du selbst prüfen musst.",
    sourceIds: ["lp", "dwds"],
    quiz: {
      question: "Welchen Fehler übersieht eine einfache Rechtschreibprüfung, die jedes Wort mit einer Wortliste vergleicht?",
      answer: "Ich treffe dich am Bahnhof, wen du Zeit hast.",
      wrong: [
        "Ich treffe dich am Banhof, wenn du Zeit hast.",
        "Ich treffe dich am Bahnhof, wenn du Zeitt hast.",
      ],
      explanation:
        "„wen“ ist ein vorhandenes Wort und steht in der Wortliste, nur an dieser Stelle ist es falsch: Es muss „wenn“ heißen. „Banhof“ und „Zeitt“ gibt es nicht, deshalb werden sie markiert.",
    },
    workshop: {
      kind: "classify",
      title: "Was merkt die Rechtschreibprüfung?",
      instruction:
        "Eine einfache Rechtschreibprüfung vergleicht jedes Wort mit einer Wortliste. Ordne jeden Fall dem Verhalten zu, das du von ihr erwartest.",
      categories: [
        "Sie merkt den Fehler",
        "Sie übersieht den Fehler",
        "Sie markiert Richtiges als Fehler",
      ],
      entries: [
        {
          text: "In „Ich habe mein Handy im Bus vergesen“ steht „vergesen“ statt „vergessen“.",
          target: 0,
          feedback: "„vergesen“ gibt es als Wort nicht. Ein Vergleich mit der Wortliste findet es sofort.",
        },
        {
          text: "In „Das Wasser im See war eiskaltt“ ist „eiskaltt“ mit zwei „t“ geschrieben.",
          target: 0,
          feedback: "Auch „eiskaltt“ steht in keiner Wortliste und wird deshalb markiert.",
        },
        {
          text: "In „Wir fahren im Sommer an das Mehr“ steht „Mehr“ statt „Meer“.",
          target: 1,
          feedback: "„Mehr“ ist ein richtiges Wort. Dass es hier nicht passt, erkennt nur, wer den Satz liest.",
        },
        {
          text: "In „Er hat seine Hausaufgaben vergessen, den er hatte keine Zeit“ steht „den“ statt „denn“.",
          target: 1,
          feedback: "„den“ gibt es in der Wortliste, deshalb fällt der Fehler einem Wortvergleich nicht auf.",
        },
        {
          text: "Der ausgedachte Nachname „Quendelbrink“ in „Frau Quendelbrink leitet die AG“ ist richtig geschrieben, fehlt aber in der Wortliste.",
          target: 2,
          feedback: "Namen fehlen oft in der Wortliste. Das Programm unterstreicht sie, obwohl nichts falsch ist.",
        },
        {
          text: "Der ausgedachte Ortsname „Niederschlipfingen“ in „Wir wohnen in Niederschlipfingen“ ist richtig geschrieben, fehlt aber in der Wortliste.",
          target: 2,
          feedback: "Ein unbekannter Name wird als Fehler angezeigt, obwohl er richtig ist. Du musst selbst entscheiden.",
        },
      ],
      conclusion:
        "Ein Wortlistenvergleich findet Wörter, die es nicht gibt, aber keine richtigen Wörter am falschen Platz. Außerdem unterstreicht er Namen und Fachwörter, die ihm unbekannt sind. Deshalb liest du selbst nach.",
    },
    casework: {
      title: "Mias Thesaurus und ihre Rechtschreibprüfung",
      story:
        "Mia schreibt einen Text über ihren Opa und möchte in dem Satz **„Mein Großvater ist ein alter Mann.“** das Wort „alter“ ersetzen. Der Thesaurus ihres Textprogramms schlägt vor: **betagt, antik, vorsintflutlich.**",
      steps: [
        {
          question: "Welcher Vorschlag passt am besten in den Satz über den Großvater?",
          options: ["betagt", "antik", "vorsintflutlich"],
          answer: 0,
          explanation:
            "„betagt“ bezeichnet ältere Menschen und klingt gehoben. „antik“ meint etwas aus dem Altertum oder Altertümliches wie antike Möbel. „vorsintflutlich“ ist umgangssprachlich und scherzhaft und würde den Großvater lächerlich machen.",
        },
        {
          question: "Was hilft Mia am meisten, wenn sie unsicher ist, ob „betagt“ zu ihrem Text passt?",
          options: [
            "Das Wort im Wörterbuch nachschlagen und Bedeutung und Beispiele lesen",
            "Das Wort einfach nehmen, denn Vorschläge des Programms sind immer richtig",
            "Die Vorschläge der Reihe nach ausprobieren, bis einer gut klingt",
          ],
          answer: 0,
          explanation:
            "Ein Wörterbuch zeigt Bedeutung, Ton und Beispiele. Ein Thesaurus schlägt nur vor und versteht den Satz nicht, deshalb prüft Mia selbst.",
        },
        {
          question:
            "Mia tippt später: „Ich habe meinen Opa letzten Sommer oft besucht, den er wohnt allein.“ Die Rechtschreibprüfung markiert nichts. Was bedeutet das?",
          options: [
            "Der Satz kann trotzdem falsch sein: „den“ muss „denn“ heißen, und das merkt das Programm nicht.",
            "Der Satz ist fehlerfrei, denn sonst hätte die Rechtschreibprüfung etwas markiert.",
            "Die Rechtschreibprüfung ist defekt und muss neu installiert werden, damit sie funktioniert.",
          ],
          answer: 0,
          explanation:
            "„den“ steht in der Wortliste, deshalb markiert das Programm es nicht. Dass hier „denn“ gemeint ist, erkennt nur, wer den Satz liest.",
        },
        {
          question: "Was sollte Mia nach dem Einsatz beider Werkzeuge noch tun?",
          options: [
            "Den Text selbst noch einmal in Kontrolldurchgängen lesen",
            "Nichts mehr, denn die Programme haben alles geprüft",
            "Alle unterstrichenen Wörter durch Synonyme ersetzen",
          ],
          answer: 0,
          explanation:
            "Programme finden nur einen Teil der Fehler. Mia liest ihren Text selbst, Durchgang für Durchgang, und entscheidet, was sie übernimmt.",
        },
      ],
      verdict:
        "Mia wählt mit „betagt“ das Wort, das zu Bedeutung und Ton passt, und prüft es im Wörterbuch. Sie weiß, dass die Rechtschreibprüfung Fehler wie „den“ statt „denn“ nicht findet, und liest ihren Text deshalb selbst noch einmal.",
    },
    practice: {
      kind: "choose",
      title: "Welches Wort passt? Drei Sätze pro Runde",
      instruction:
        "Beide Wörter sind richtig geschrieben, doch nur eines passt in den Satz. Wähle es aus. Eine Runde zählt, wenn alle drei Sätze stimmen.",
      pool: {
        1: [
          {
            before: "Im Urlaub schwimmen wir gern im ",
            options: ["Meer", "Mehr"],
            answer: 0,
            after: ".",
            feedback: "Das „Meer“ ist ein Gewässer. „Mehr“ bedeutet eine größere Menge.",
          },
          {
            before: "Bei der ",
            options: ["Wahl", "Wal"],
            answer: 0,
            after: " der Klassensprecherin gab es nur eine Gegenstimme.",
            feedback: "Die „Wahl“ ist eine Abstimmung. Der „Wal“ ist ein Meerestier.",
          },
          {
            before: "Ich komme mit, ",
            options: ["wenn", "wen"],
            answer: 0,
            after: " du mich abholst.",
            feedback: "„wenn“ leitet hier eine Bedingung ein. „wen“ ist das Fragewort im Akkusativ, wie in „Wen siehst du?“.",
          },
          {
            before: "Ich bleibe zu Hause, ",
            options: ["denn", "den"],
            answer: 0,
            after: " ich bin erkältet.",
            feedback: "„denn“ verbindet zwei Hauptsätze und begründet. „den“ ist ein Artikel oder Pronomen.",
          },
          {
            before: "Er fährt jeden Morgen mit dem ",
            options: ["Rad", "Rat"],
            answer: 0,
            after: " zur Schule.",
            feedback: "Das „Rad“ ist ein Fahrzeug. Ein „Rat“ ist ein Ratschlag oder ein Gremium.",
          },
          {
            before: "Zum Frühstück trinke ich ein ",
            options: ["Glas", "Gras"],
            answer: 0,
            after: " Milch.",
            feedback: "Ein „Glas“ Milch ist ein Trinkgefäß mit Inhalt. „Gras“ wächst auf der Wiese.",
          },
          {
            before: "Mein Bruder spielt ein ",
            options: ["Lied", "Lid"],
            answer: 0,
            after: " auf der Gitarre.",
            feedback: "Ein „Lied“ wird gesungen oder gespielt. Das „Lid“ ist das Augenlid.",
          },
          {
            before: "Sie liest die ",
            options: ["Seite", "Saite"],
            answer: 0,
            after: " im Buch noch einmal.",
            feedback: "Ein Buch hat Seiten. Eine „Saite“ gehört zu einer Gitarre oder Geige.",
          },
          {
            before: "Wir warten schon ",
            options: ["seit", "seid"],
            answer: 0,
            after: " einer Stunde auf den Bus.",
            feedback: "„seit“ nennt den Beginn einer Zeitspanne. „seid“ ist eine Form von „sein“ und passt nur zu „ihr“.",
          },
          {
            before: "Meine Schwester ",
            options: ["malt", "mahlt"],
            answer: 0,
            after: " gern Bilder von Tieren.",
            feedback: "„malen“ heißt, mit Farben ein Bild herzustellen. „mahlen“ heißt, Feststoffe wie Getreide oder Kaffeebohnen fein zu zerkleinern.",
          },
        ],
        2: [
          {
            before: "Am Sonntag fahren wir an die Nordsee und gehen, wenn das Wetter hält, auch im ",
            options: ["Meer", "Mehr"],
            answer: 0,
            after: " schwimmen.",
            feedback: "Man schwimmt im „Meer“. „Mehr“ bedeutet eine größere Menge und passt hier nicht.",
          },
          {
            before: "Der Wahlleiter zählte die Stimmen, und schon nach einer Stunde stand das Ergebnis der ",
            options: ["Wahl", "Wal"],
            answer: 0,
            after: " fest.",
            feedback: "Das Ergebnis einer Abstimmung ist das Ergebnis der „Wahl“. Ein „Wal“ ist ein Tier.",
          },
          {
            before: "Die Gitarristin zupfte vorsichtig an jeder ",
            options: ["Saite", "Seite"],
            answer: 0,
            after: ", bevor das Konzert begann.",
            feedback: "Eine Gitarre hat „Saiten“. „Seite“ meint zum Beispiel die Seite eines Buches.",
          },
          {
            before: "Als sie das Ergebnis sah, verzog sie keine ",
            options: ["Miene", "Mine"],
            answer: 0,
            after: " und sagte kein Wort.",
            feedback: "„keine Miene verziehen“ heißt, den Gesichtsausdruck nicht zu verändern. Eine „Mine“ ist ein Bergwerk oder die Füllung eines Stifts.",
          },
          {
            before: "Der Maler beherrschte den impressionistischen ",
            options: ["Stil", "Stiel"],
            answer: 0,
            after: " so gut, dass man seine Bilder kaum von denen seines Vorbilds unterscheiden konnte.",
            feedback: "Ein Kunststil heißt „Stil“. Ein „Stiel“ gehört zu einer Blume, einem Besen oder einem Glas.",
          },
          {
            before: "Nach dem Umzug stand in dem großen Zimmer lange nur gähnende ",
            options: ["Leere", "Lehre"],
            answer: 0,
            after: ".",
            feedback: "„gähnende Leere“ beschreibt einen leeren Raum. Eine „Lehre“ ist eine Ausbildung oder eine Erfahrung, aus der man etwas lernt.",
          },
          {
            before: "Der Bäcker schnitt den frisch gebackenen ",
            options: ["Laib", "Leib"],
            answer: 0,
            after: " Brot in dicke Scheiben.",
            feedback: "Ein „Laib“ ist ein rund oder oval geformtes, oft ganzes Stück Brot oder Käse. Der „Leib“ ist der Körper.",
          },
          {
            before: "Die Suppe köchelte seit einer Stunde leise auf dem ",
            options: ["Herd", "Heer"],
            answer: 0,
            after: ".",
            feedback: "Töpfe stehen auf dem „Herd“. Das „Heer“ sind die bewaffneten Streitkräfte eines Staates.",
          },
          {
            before: "Ich komme gern zu deiner Feier, ",
            options: ["wenn", "wen"],
            answer: 0,
            after: " ich bis dahin meine Prüfung geschafft habe.",
            feedback: "„wenn“ leitet eine Bedingung ein. „wen“ ist das Fragewort im Akkusativ und passt hier nicht.",
          },
          {
            before: "Die Eltern sahen ihre Tochter nach dem langen Auslandsjahr endlich ",
            options: ["wieder", "wider"],
            answer: 0,
            after: " und fielen sich in die Arme.",
            feedback: "„wieder“ bedeutet „erneut“. „wider“ bedeutet „gegen“, wie in „Widerspruch“.",
          },
        ],
      },
    },
    tasks: {
      1: {
        prompt:
          "In diesem Text steckt dreimal ein richtig geschriebenes, aber falsches Wort: „Gestern hat meine Klasse eine neue Sprecherin gewählt. Die Wal war eindeutig: Mia hat gewonnen. Sie fährt jeden Tag mit dem Rat zur Schule, wen es nicht regnet.“ Schreibe den Text richtig auf und erkläre in zwei Sätzen, warum eine Rechtschreibprüfung die Fehler übersieht und wie du sie trotzdem findest.",
        hints: [
          "Lies jeden Satz laut und frage bei jedem Wort, ob es in den Zusammenhang passt.",
          "Eine Rechtschreibprüfung vergleicht einzelne Wörter mit einer Wortliste. Wann findet sie dabei nichts?",
        ],
        model:
          "Gestern hat meine Klasse eine neue Sprecherin gewählt. Die Wahl war eindeutig: Mia hat gewonnen. Sie fährt jeden Tag mit dem Rad zur Schule, wenn es nicht regnet. Die Rechtschreibprüfung übersieht „Wal“, „Rat“ und „wen“, weil alle drei Wörter in der Wortliste stehen und nur an dieser Stelle falsch sind. Ich finde solche Fehler, indem ich den Text laut lese und bei jedem Wort frage, ob es zum Zusammenhang passt.",
        criteria: [
          "Findet alle drei richtig geschriebenen, aber falschen Wörter.",
          "Schreibt den Text mit den richtigen Wörtern auf.",
          "Erklärt, warum die Rechtschreibprüfung diese Fehler nicht markiert.",
        ],
      },
      2: {
        prompt:
          "Dein Thesaurus schlägt für „schön“ diese Wörter vor: hübsch, herrlich, ansehnlich, prächtig. Ersetze das Wort in den Sätzen „Das war ein schöner Abend.“ und „Sie trägt ein schönes Kleid.“ durch jeweils ein passendes Wort aus der Liste. Begründe jede Wahl in einem Satz und nenne ein Nachschlagewerk, mit dem du die Bedeutung eines Wortes prüfst.",
        hints: [
          "Frage dich bei jedem Vorschlag: Passt die Bedeutung zu dem, was beschrieben wird, einem Erlebnis oder einem Aussehen?",
          "Prüfe auch den Ton: Klingt das Wort übertrieben oder steif?",
        ],
        model:
          "Das war ein herrlicher Abend. „Herrlich“ passt, weil es ein angenehmes Erlebnis beschreibt und nicht nur ein Aussehen. Sie trägt ein hübsches Kleid. „Hübsch“ beschreibt, wie etwas aussieht, und klingt alltäglich, während „prächtig“ für ein Alltagskleid übertrieben wäre. Bevor ich ein Wort übernehme, schlage ich es im Wörterbuch oder im DWDS nach und lese Bedeutung und Beispiele.",
        criteria: [
          "Wählt für beide Sätze ein Wort, das zu Bedeutung und Zusammenhang passt.",
          "Begründet jede Wahl mit Bedeutung oder Ton.",
          "Nennt ein Nachschlagewerk, mit dem die Bedeutung geprüft wird.",
        ],
      },
    },
  },
];
