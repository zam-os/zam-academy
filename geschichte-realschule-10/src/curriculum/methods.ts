import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

export const methods: Lesson[] = [
  {
    id: "g10-karikatur",
    lb: 1,
    title: "Karikaturen entschlüsseln",
    period: "Methode · 1945 bis heute",
    intro:
      "Eine Karikatur übertreibt mit Absicht. Wer sie deuten will, braucht ihre Zeichensprache und ihren Entstehungszusammenhang.",
    paragraphs: [
      "Karikaturen sind gezeichnete Kommentare. Sie vereinfachen, überzeichnen und verwenden Symbole: Der Bär steht oft für Russland oder die Sowjetunion, Uncle Sam für die USA, der deutsche Michel mit Zipfelmütze für die Deutschen. Eine Karikatur behauptet nicht, wie etwas wirklich aussah. Sie zeigt, wie die Zeichnerin oder der Zeichner eine Lage bewertet.",
      "Gehe in vier Schritten vor. Form: Wer hat wann wo veröffentlicht, welche Figuren, Symbole und Texte sind zu sehen? Inhalt: Welche Situation stellt die Karikatur dar? Perspektive: Wessen Sicht vertritt sie, und wen kritisiert sie? Kontext: Welche ideologischen, sozialen oder politischen Zusammenhänge der Entstehungszeit braucht man zum Verständnis? Erst danach beurteilst du, ob die Aussage treffend, einseitig oder irreführend ist.",
      "Eine Karikatur aus einer westdeutschen Zeitung von 1961 kann den Mauerbau anders deuten als eine Zeichnung in einer SED-Zeitung. Beide sind wertvolle Quellen, aber jeweils für die Sicht ihrer Entstehungsgruppe. Über die Wirkung auf Leserinnen und Leser sagt eine einzelne Karikatur nichts Sicheres aus.",
    ],
    takeaway:
      "Form, Inhalt, Perspektive, Kontext: Eine Karikatur ist ein Kommentar ihrer Zeit, kein Abbild der Wirklichkeit.",
    sourceIds: ["lehrplan", "lemo-kalter-krieg"],
    quiz: check(
      "Was zeigt eine politische Karikatur vor allem?",
      "Die zugespitzte Bewertung einer Lage aus der Sicht ihres Zeichners.",
      [
        "Eine genaue Abbildung dessen, was tatsächlich geschah.",
        "Die Meinung der gesamten Bevölkerung zu einem Ereignis.",
      ],
      [
        "Karikaturen übertreiben mit Absicht; sie sind Deutungen, keine Abbildungen.",
        "Eine einzelne Zeichnung vertritt eine Sicht, nicht die Meinung aller.",
      ],
      "Karikaturen kommentieren. Sie sind Quellen für Sichtweisen und Wertungen ihrer Entstehungszeit.",
    ),
    workshop: classify(
      "Eine Karikatur in vier Schritten untersuchen",
      ["Form", "Inhalt", "Perspektive", "Kontext"],
      [
        [
          "Die Zeichnung erschien im August 1961 in einer westdeutschen Tageszeitung.",
          0,
          "Erscheinungsort und -datum gehören zur formalen Beschreibung.",
        ],
        [
          "Ein Soldat mauert eine Tür zu, durch die Menschen nach Westen gehen wollten.",
          1,
          "Das beschreibt die dargestellte Situation.",
        ],
        [
          "Die Zeichnung verurteilt die SED-Führung als Gefängniswärter ihres eigenen Volkes.",
          2,
          "Hier geht es um die Wertung und um die Sicht, aus der gezeichnet wurde.",
        ],
        [
          "Bis August 1961 flohen über Berlin Hunderttausende Menschen aus der DDR.",
          3,
          "Dieses Wissen über die Entstehungszeit braucht man, um die Zeichnung zu verstehen.",
        ],
      ],
      "Beschreibe zuerst, deute dann. Wer Form und Kontext überspringt, liest die eigene Meinung in die Karikatur hinein.",
      "Beschriebene Karikatur: Ein Soldat mit Kelle mauert eine Tür zu. Vor der Tür drängen sich Menschen mit Koffern. Auf einem Schild steht „Arbeiter-und-Bauern-Staat“. Im Hintergrund schaut ein Bär zufrieden zu.",
      "Für diese Übung beschriebene Karikatur · keine historische Originalquelle",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum du bei einer Karikatur zum Mauerbau wissen musst, wer sie wann veröffentlicht hat.",
        ["Denke an Ost- und Westperspektive.", "Was sagt der Zeitpunkt über das Wissen der Zeichner?"],
        "Eine westdeutsche Karikatur von 1961 kritisiert den Mauerbau meist als Einsperren der Bevölkerung. Eine Zeichnung in einer SED-Zeitung stellte die Mauer dagegen als Schutz vor dem Westen dar. Ohne Urheber und Datum kann ich die Perspektive nicht bestimmen und deute die Aussage falsch.",
        ["Urheber als Perspektive", "Zeitpunkt als Kontext", "Folge für die Deutung"],
      ),
      2: writing(
        "Eine Mitschülerin sagt: Karikaturen sind übertrieben und deshalb als Quelle wertlos. Nimm Stellung.",
        ["Was kann eine Karikatur belegen, was nicht?", "Unterscheide Sachaussage und Werturteil."],
        "Eine Karikatur belegt keine Tatsachen wie Zahlen oder Abläufe. Sie ist aber eine gute Quelle für Meinungen, Ängste und Wertungen ihrer Entstehungszeit. Wer Form, Perspektive und Kontext prüft, kann daraus erschließen, wie eine Gruppe ein Ereignis gedeutet hat. Wertlos ist sie also nicht, nur für andere Fragen geeignet.",
        ["Grenzen genannt", "Erkenntniswert genannt", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g10-bild-und-lied",
    lb: 1,
    title: "Fotos und politische Lieder als Quellen",
    period: "Methode · 1945 bis 1990",
    intro:
      "Ein Foto wirkt wie ein Beweis, ein Lied wie ein Gefühl. Beide wurden gemacht, ausgewählt und verbreitet.",
    paragraphs: [
      "Ein Foto hält einen Augenblick fest, aber jemand hat den Ausschnitt, den Moment und oft auch die Veröffentlichung gewählt. Manche Bilder wurden gestellt, nachgestellt oder retuschiert. Frage deshalb: Wer hat fotografiert, in wessen Auftrag, und wo erschien das Bild? Das berühmte Foto des Soldaten Conrad Schumann, der am 15. August 1961 in Berlin über den Stacheldraht nach West-Berlin springt, wurde im Westen zum Symbol. Die Bildunterschrift entscheidet mit darüber, was Betrachter darin sehen.",
      "Historisch-politische Lieder drücken Haltungen aus und sollen oft mobilisieren. Wolf Biermann sang in der DDR kritische Lieder; nach einem Konzert in Köln bürgerte ihn die DDR 1976 aus. Viele Künstlerinnen und Künstler protestierten dagegen, einige verließen danach die DDR. Ein Lied ist damit eine Quelle für Kritik, für staatliche Reaktionen und für die Wirkung auf Hörerinnen und Hörer.",
      "Untersuche Lieder wie Texte: Wer singt für wen, wann und wo? Welche Bilder und Gegensätze verwendet der Text? Wie wurde das Lied verbreitet, verboten oder gefeiert? Ein Lied belegt die Haltung des Liedermachers und die Reaktionen darauf, nicht die Meinung einer ganzen Bevölkerung.",
    ],
    takeaway:
      "Fotos und Lieder sind gestaltete Quellen. Prüfe Urheber, Auswahl, Verbreitung und Absicht, bevor du daraus Schlüsse ziehst.",
    sourceIds: ["lemo-mauerbau", "lemo-opposition", "lehrplan"],
    quiz: check(
      "Warum ist ein Foto kein vollständiger Beweis für ein Ereignis?",
      "Ausschnitt, Moment und Bildunterschrift wurden von Menschen gewählt.",
      [
        "Fotos aus dem 20. Jahrhundert sind grundsätzlich gefälscht.",
        "Ein Foto zeigt immer nur die Meinung der Regierung.",
      ],
      [
        "Nicht jedes Foto ist gefälscht; es muss aber geprüft werden.",
        "Auch private Fotografen und Presseagenturen fotografieren; die Frage ist, wer auswählt.",
      ],
      "Ein Foto bildet etwas ab, aber Auswahl und Präsentation lenken die Deutung.",
    ),
    workshop: classify(
      "Was kann diese Quelle belegen?",
      ["Wird durch die Quelle belegt", "Braucht weitere Belege"],
      [
        [
          "Ein Soldat sprang am 15. August 1961 an einer Absperrung in Berlin über Stacheldraht.",
          0,
          "Das Foto und die Begleitumstände halten diesen Augenblick fest.",
        ],
        [
          "Alle Grenzsoldaten wollten 1961 in den Westen fliehen.",
          1,
          "Ein Einzelfall belegt keine Haltung einer ganzen Gruppe.",
        ],
        [
          "Die DDR-Führung reagierte 1976 auf Biermanns Kritik mit der Ausbürgerung.",
          0,
          "Die Ausbürgerung ist eine dokumentierte staatliche Reaktion.",
        ],
        [
          "Biermanns Lieder sprachen die Meinung der Mehrheit in der DDR aus.",
          1,
          "Dafür bräuchte man zum Beispiel Umfragen, Berichte oder Zeitzeugen.",
        ],
      ],
      "Eine Quelle kann einen Einzelfall gut belegen. Verallgemeinerungen verlangen weitere Quellen.",
    ),
    tasks: {
      1: writing(
        "Nenne zwei Fragen, die du an ein Foto vom Mauerbau stellst, und begründe sie.",
        ["Wer hat fotografiert und veröffentlicht?", "Was zeigt der Ausschnitt nicht?"],
        "Ich frage, wer das Foto gemacht und wo es veröffentlicht wurde, weil westliche und östliche Medien den Mauerbau gegensätzlich darstellten. Außerdem frage ich, was außerhalb des Bildausschnitts lag, denn ein Moment zeigt nicht den ganzen Ablauf. Erst dann kann ich beurteilen, wofür das Foto ein Beleg ist.",
        ["Frage nach Urheber/Verbreitung", "Frage nach Ausschnitt", "Begründung"],
      ),
      2: writing(
        "Beurteile, was ein verbotenes Protestlied über die Gesellschaft verrät, in der es entstand.",
        ["Denke an Kritik und staatliche Reaktion.", "Wofür ist das Lied kein Beleg?"],
        "Das Lied zeigt, welche Kritik Einzelne äußerten und welche Themen sie für wichtig hielten. Das Verbot zeigt, dass der Staat diese Kritik fürchtete und Meinungsfreiheit einschränkte. Ob viele Menschen so dachten, belegt das Lied allein nicht; dafür brauche ich weitere Quellen.",
        ["Kritik erschlossen", "Staatliche Reaktion gedeutet", "Grenze benannt"],
      ),
    },
  },
  {
    id: "g10-perspektiven",
    lb: 1,
    title: "Ein Ereignis, zwei Erzählungen",
    period: "Methode · Kalter Krieg",
    intro:
      "USA und Sowjetunion, Bundesrepublik und DDR erzählten dieselben Ereignisse sehr verschieden.",
    paragraphs: [
      "Eine Narration ist eine Erzählung über die Vergangenheit, die Ereignisse auswählt, verknüpft und deutet. Im Kalten Krieg standen sich solche Erzählungen gegenüber. Die SED nannte die Berliner Mauer einen „antifaschistischen Schutzwall“ gegen den Westen. In der Bundesrepublik sprach man von der „Schandmauer“, die Menschen einsperrt. Der Bau an sich ist unstrittig; strittig war seine Deutung.",
      "Unterschiedliche Erzählungen sind nicht beliebig. Prüfe, ob sie mit belegbaren Tatsachen vereinbar sind: Die Grenzanlagen der DDR waren nach Osten gegen Flucht gerichtet, an der Grenze wurde auf Flüchtende geschossen. Eine Erzählung, die das verschweigt, ist einseitig oder propagandistisch. Zugleich kann auch eine westliche Darstellung eigene Interessen verfolgen, etwa im Vietnamkrieg.",
      "Vergleiche deshalb: Wer erzählt, für wen, mit welchem Ziel? Welche Tatsachen kommen vor, welche fehlen? Welche Begriffe werten? So kannst du Perspektiven verstehen, ohne jede Deutung für gleich gut belegt zu halten.",
    ],
    takeaway:
      "Narrationen deuten Tatsachen aus einer Perspektive. Vergleiche sie und prüfe, ob sie mit den Belegen vereinbar sind.",
    sourceIds: ["lemo-mauerbau", "mauer-stiftung", "lemo-kalter-krieg"],
    quiz: check(
      "Wie bezeichnete die SED-Führung die Berliner Mauer?",
      "Als „antifaschistischen Schutzwall“.",
      ["Als „Eisernen Vorhang“ gegen den Westen.", "Als „Schandmauer“ der Teilung."],
      [
        "Den Ausdruck „Eiserner Vorhang“ prägte Churchill 1946 für die Trennung Europas, aus westlicher Sicht.",
        "„Schandmauer“ war eine westdeutsche Bezeichnung.",
      ],
      "Die Bezeichnung sollte die Mauer als Schutz vor dem Westen rechtfertigen; tatsächlich richtete sie sich gegen die Flucht der eigenen Bevölkerung.",
    ),
    workshop: classify(
      "Wessen Erzählung?",
      ["Deutung der SED", "Westdeutsche Deutung", "Belegbare Tatsache"],
      [
        [
          "Die Mauer schützt den Frieden vor westlichen Kriegstreibern.",
          0,
          "So rechtfertigte die SED den Mauerbau.",
        ],
        [
          "Die Mauer macht die DDR zu einem Gefängnis für ihre Bürger.",
          1,
          "So deuteten westdeutsche Politiker und Medien die Grenze.",
        ],
        [
          "Ab dem 13. August 1961 wurden die Sektorengrenzen in Berlin abgeriegelt.",
          2,
          "Das ist ein datierbares, von beiden Seiten nicht bestrittenes Ereignis.",
        ],
        [
          "An der Mauer und an der innerdeutschen Grenze wurden Flüchtende getötet.",
          2,
          "Die Todesfälle sind namentlich dokumentiert, etwa von der Gedenkstätte Berliner Mauer.",
        ],
      ],
      "Deutungen unterscheiden sich, Tatsachen sind der Prüfstein. Eine Erzählung, die belegte Todesfälle verschweigt, ist nicht gleichwertig.",
    ),
    tasks: {
      1: writing(
        "Vergleiche die Bezeichnungen „antifaschistischer Schutzwall“ und „Schandmauer“: Was will jede bewirken?",
        ["Wer benutzte welchen Begriff?", "Welche Tatsache betont oder verschweigt er?"],
        "Die SED wollte mit „antifaschistischer Schutzwall“ die Mauer als Abwehr eines angeblich faschistischen Westens rechtfertigen und verschwieg, dass sie Flucht verhindern sollte. Der westdeutsche Begriff „Schandmauer“ betonte das Unrecht und sollte Empörung wecken. Beide werten; die SED-Deutung widerspricht aber den belegten Zwecken der Grenzanlagen.",
        ["Beide Absichten", "Verschwiegenes genannt", "Abgleich mit Belegen"],
      ),
      2: writing(
        "Wähle ein Ereignis des Kalten Krieges und erkläre, wie US-amerikanische und sowjetische Darstellungen es unterschiedlich deuten konnten.",
        ["Zum Beispiel Kuba-Krise oder Marshallplan.", "Begriffe und Ziele vergleichen."],
        "Den Marshallplan stellten die USA als Hilfe zum Wiederaufbau und als Schutz der Freiheit dar. Die Sowjetunion deutete ihn als Versuch, Europa wirtschaftlich von den USA abhängig zu machen, und verbot den Staaten in ihrem Machtbereich die Teilnahme. Beide Darstellungen folgten eigenen Interessen; die Hilfe war real, sie diente aber auch der Eindämmung des Kommunismus.",
        ["Ereignis gewählt", "Zwei Deutungen", "Interessen erkannt"],
      ),
    },
  },
  {
    id: "g10-schaubild",
    lb: 1,
    title: "Recherchieren und im Schaubild zeigen",
    period: "Methode · Karten, Diagramme, Statistiken",
    intro:
      "Zahlen, Karten und Texte ergänzen sich. Ein Schaubild verbindet sie zu einer überprüfbaren Aussage.",
    paragraphs: [
      "Eine Statistik nennt Größen, aber keine Gründe. Prüfe bei jeder Zahl: Wer hat erhoben, wann, mit welcher Abgrenzung, und in welcher Einheit? „Flüchtlinge“ konnte 1946 etwas anderes umfassen als 1950. Eine Geschichtskarte zeigt Räume, Grenzen und Bewegungen, ist aber selbst eine Darstellung mit Auswahl und Vereinfachung.",
      "Für ein Schaubild sammelst du zuerst Informationen aus Quellen und Darstellungen, aus Karten und Diagrammen. Dann entscheidest du, welche Beziehungen du zeigen willst: Ursachen und Folgen, Vergleiche oder Abläufe. Pfeile brauchen eine Bedeutung, etwa „führt zu“ oder „reagiert auf“. Ein gutes Schaubild nennt seine Quellen und trennt belegte Angaben von eigenen Schlussfolgerungen.",
      "Beispiel: Laut Volkszählung vom Oktober 1946 lebten 9,6 Millionen Flüchtlinge in den vier Besatzungszonen. Um 1950 waren es etwa 8 Millionen in der Bundesrepublik und 4 Millionen in der DDR. Die Zahlen sind nicht direkt vergleichbar, weil Zeitpunkt und Zählweise verschieden sind. Sie zeigen aber: Beide deutschen Staaten mussten Millionen Menschen aufnehmen.",
    ],
    takeaway:
      "Zahlen brauchen Herkunft, Zeitpunkt und Einheit. Ein Schaubild verknüpft belegte Angaben mit klar benannten Beziehungen.",
    sourceIds: ["lemo-vertreibung", "lehrplan"],
    quiz: check(
      "Was musst du bei einer historischen Statistik zuerst prüfen?",
      "Herkunft, Zeitpunkt, Erhebungsweise und Einheit.",
      [
        "Ob die Zahlen möglichst groß und eindrucksvoll sind.",
        "Ob die Statistik farbig und übersichtlich gestaltet ist.",
      ],
      [
        "Die Größe einer Zahl sagt nichts über ihre Zuverlässigkeit.",
        "Die Gestaltung ändert nichts an der Herkunft der Daten.",
      ],
      "Herkunft, Zeitpunkt, Abgrenzung und Einheit entscheiden, was eine Zahl aussagen kann.",
    ),
    workshop: {
      ...classify(
        "Daten aus der Tabelle richtig deuten",
        ["Durch die Tabelle gedeckt", "Nicht durch die Tabelle gedeckt"],
        [
          [
            "Um 1950 lebten in der Bundesrepublik etwa doppelt so viele Flüchtlinge und Vertriebene wie in der DDR.",
            0,
            "8 und 4 Millionen: Das Verhältnis ist aus der Tabelle ablesbar.",
          ],
          [
            "Zwischen 1946 und 1950 sind 1,6 Millionen Flüchtlinge gestorben.",
            1,
            "Die Zahlen beruhen auf unterschiedlichen Zählungen; Gründe für Unterschiede nennt die Tabelle nicht.",
          ],
          [
            "Die Aufnahme verlief in beiden Staaten ohne Konflikte.",
            1,
            "Über das Zusammenleben sagt eine Bevölkerungszahl nichts aus.",
          ],
          [
            "Beide deutschen Staaten nahmen Millionen Menschen auf.",
            0,
            "Das ist die vorsichtige Aussage, die die Daten tragen.",
          ],
        ],
        "Eine Tabelle beantwortet Wie-viel-Fragen. Warum-Fragen brauchen Texte und Quellen.",
      ),
      dataTable: {
        title: "Flüchtlinge und Vertriebene in Deutschland",
        unit: "Millionen Menschen, gerundet",
        columns: ["Zählung", "Anzahl"],
        max: 10,
        suffix: " Mio.",
        rows: [
          { label: "Oktober 1946 · vier Besatzungszonen", value: 9.6 },
          { label: "1950 · Bundesrepublik", value: 8 },
          { label: "1950 · DDR", value: 4 },
        ],
        sourceId: "lemo-vertreibung",
        note: "Zeitpunkte und Zählweisen unterscheiden sich; die Zeilen sind nicht direkt vergleichbar.",
      },
    },
    tasks: {
      1: writing(
        "Plane ein Schaubild zur Aufnahme der Vertriebenen in Bayern: Welche drei Elemente gehören hinein, und wie verbindest du sie?",
        ["Ursache, Aufnahme, Folgen.", "Was bedeuten deine Pfeile?"],
        "Links stehen die Ursachen: Flucht vor der Front 1944/45 und Vertreibung nach dem Krieg. In der Mitte steht die Aufnahme in Bayern mit Notunterkünften und Wohnungsnot. Rechts stehen Folgen wie neue Siedlungen und Arbeitskräfte für den Wiederaufbau. Pfeile bedeuten „führt zu“, die Zahlen nenne ich mit Quelle und Jahr.",
        ["Drei sinnvolle Elemente", "Beziehungen benannt", "Quellenangabe"],
      ),
      2: writing(
        "Eine Grafik zeigt steigende Zahlen ausländischer Arbeitnehmer 1960 bis 1973. Welche Schlüsse darfst du ziehen, welche nicht?",
        ["Wie viel und wann gegenüber warum.", "Welche Quellen ergänzen die Grafik?"],
        "Ich darf schließen, dass die Zahl stark stieg und wann der Anstieg am größten war. Warum Menschen kamen und wie sie lebten, zeigt die Grafik nicht. Dafür ziehe ich Anwerbeabkommen, Berichte und Zeitzeugenaussagen heran. Die Einheit und die Herkunft der Zahlen nenne ich mit.",
        ["Zulässiger Schluss", "Unzulässiger Schluss", "Ergänzende Quellen"],
      ),
    },
  },
  {
    id: "g10-zeitzeugen",
    lb: 1,
    title: "Zeitzeugen befragen und einordnen",
    period: "Methode · Erinnerung an 1989/90",
    intro:
      "Wer dabei war, erzählt lebendig. Erinnerung ist aber subjektiv und verändert sich mit der Zeit.",
    paragraphs: [
      "Zeitzeuginnen und Zeitzeugen berichten aus eigener Erfahrung. Das macht Geschichte anschaulich und zeigt Gefühle, die in Akten fehlen. Erinnerungen werden aber im Rückblick erzählt: Spätere Erfahrungen, Medienbilder und Gespräche prägen sie mit. Ein Bericht von 2019 über den Herbst 1989 ist eine Quelle für das Erlebte und für die heutige Deutung zugleich.",
      "Prüfe deshalb: Wo war die Person, welche Rolle hatte sie, wie alt war sie damals? Wann und für wen erzählt sie? Vergleiche Aussagen aus verschiedenen Perspektiven. Eine Leipzigerin, die 1989 demonstrierte, erinnert die Wende anders als ein Arbeiter, der 1991 seinen Arbeitsplatz verlor, oder als eine Familie in Bayern, die Verwandte aus Thüringen erstmals besuchen konnte.",
      "Unterschiedliche Erinnerungen widersprechen sich nicht unbedingt. Sie zeigen, dass dasselbe Ereignis verschiedene Folgen für verschiedene Menschen hatte. Prüfe Fakten wie Daten und Orte an anderen Quellen, und behandle die Deutung als persönliche Sicht. Zeitzeugenportale, etwa der Stiftung Haus der Geschichte, sammeln solche Berichte.",
    ],
    takeaway:
      "Zeitzeugen geben Einblick in Erfahrungen. Ordne ihre Aussagen nach Rolle, Zeitpunkt und Perspektive ein und prüfe Fakten gegen.",
    sourceIds: ["zeitzeugen-portal", "hdbg-zeitzeugen", "lemo-ost-west"],
    quiz: check(
      "Warum musst du einen Zeitzeugenbericht quellenkritisch prüfen?",
      "Erinnerungen sind subjektiv und werden von späteren Erfahrungen geprägt.",
      [
        "Zeitzeugen sagen grundsätzlich bewusst die Unwahrheit.",
        "Zeitzeugen kennen die Ereignisse schlechter als Schulbücher.",
      ],
      [
        "Es geht nicht um Lügen, sondern um die Eigenart von Erinnerung.",
        "Zeitzeugen kennen ihr Erleben oft sehr genau; sie sehen aber einen Ausschnitt.",
      ],
      "Erinnerung ist wertvoll und zugleich Deutung aus heutiger Sicht.",
    ),
    workshop: classify(
      "Erleben oder spätere Deutung?",
      ["Bericht über das damalige Erleben", "Deutung aus heutiger Sicht"],
      [
        [
          "Am 9. Oktober 1989 hatten wir in Leipzig Angst, dass geschossen wird.",
          0,
          "Die Person beschreibt ein Gefühl in der damaligen Situation.",
        ],
        [
          "Heute weiß ich, dass dieser Abend die Revolution entschieden hat.",
          1,
          "Hier deutet sie das Ereignis mit späterem Wissen.",
        ],
        [
          "1991 wurde mein Betrieb geschlossen, und ich war arbeitslos.",
          0,
          "Ein konkretes Erlebnis nach der Einheit.",
        ],
        [
          "Die Einheit hat uns Ostdeutschen mehr genommen als gegeben.",
          1,
          "Ein Gesamturteil, das durch spätere Erfahrungen geprägt ist.",
        ],
      ],
      "Trenne Erlebtes von Deutung. Beides ist wichtig, aber es belegt Verschiedenes.",
    ),
    tasks: {
      1: writing(
        "Stelle drei Fragen zusammen, die du einer Person stellst, die den Herbst 1989 in der DDR erlebt hat.",
        ["Frage nach Ort, Rolle und Alter.", "Frage nach damals und heute getrennt."],
        "Wo hast du im Herbst 1989 gelebt, und wie alt warst du? Was hast du am 9. Oktober oder am 9. November selbst erlebt? Wie siehst du diese Zeit heute, und hat sich deine Sicht seit 1990 verändert? So kann ich Rolle, Erleben und spätere Deutung unterscheiden.",
        ["Frage zur Rolle", "Frage zum Erleben", "Frage zur heutigen Sicht"],
      ),
      2: writing(
        "Zwei Zeitzeugen beurteilen die Einheit gegensätzlich. Erkläre, wie das sein kann, und wie du damit umgehst.",
        ["Unterschiedliche Lebenslagen.", "Was prüfst du an anderen Quellen?"],
        "Die Folgen der Einheit waren ungleich verteilt: Manche gewannen Freiheit, Reisemöglichkeiten und neue Berufe, andere verloren ihre Arbeit oder ihre Sicherheit. Deshalb können beide Aussagen ehrlich sein. Ich prüfe Daten und Fakten an Statistiken und Darstellungen und behandle die Urteile als Perspektiven, die ich nebeneinanderstelle.",
        ["Unterschiedliche Erfahrungen", "Faktenprüfung", "Perspektiven nebeneinander"],
      ),
    },
  },
  {
    id: "g10-film",
    lb: 1,
    title: "Geschichte im Film kritisch sehen",
    period: "Methode · Spiel- und Dokumentarfilme",
    intro:
      "Filme erzählen Geschichte mit Bildern, Musik und Figuren. Sie unterhalten und deuten zugleich.",
    paragraphs: [
      "Ein historischer Spielfilm erfindet Figuren, Dialoge und Szenen, auch wenn er auf wahren Ereignissen beruht. Er will Zuschauer bewegen und braucht Spannung, Helden und Konflikte. Ein Dokumentarfilm verwendet Archivbilder, Zeitzeugen und Kommentar, wählt aber ebenfalls aus und ordnet. Beide sind Darstellungen von Geschichte, keine Quellen aus der dargestellten Zeit.",
      "Untersuche einen Film unter drei Gesichtspunkten. Intention: Wer hat ihn wann gedreht und mit welchem Ziel? Aufbau: Welche Figuren stehen im Mittelpunkt, welche Handlung, welche Wendepunkte? Wirkung: Welche Mittel lenken Gefühle, etwa Musik, Kameraperspektive, Farbe oder Schnitt? Vergleiche wichtige Fakten mit Darstellungen der Geschichtswissenschaft.",
      "Ein Film über die Stasi von 2006 sagt viel über die Sicht des wiedervereinigten Deutschland auf die DDR. Er ist damit auch Teil der Geschichtskultur: Er zeigt, wie eine Gesellschaft sich erinnern will. Begleitmaterial zur Filmbildung bietet etwa kinofenster.de der Bundeszentrale für politische Bildung.",
    ],
    takeaway:
      "Filme sind Darstellungen. Frage nach Intention, Aufbau und Wirkung und prüfe Fakten an der Forschung.",
    sourceIds: ["kinofenster", "lehrplan"],
    quiz: check(
      "Wozu zählt ein Spielfilm von 2006 über die DDR, wenn du Geschichte untersuchst?",
      "Zu den Darstellungen und zur Geschichtskultur ihrer Zeit.",
      ["Zu den Quellen aus der Zeit der DDR selbst.", "Zu den neutralen, sachlichen Tatsachenberichten."],
      [
        "Er entstand erst nach dem Ende der DDR und ist keine Quelle aus der dargestellten Zeit.",
        "Ein Spielfilm gestaltet und erfindet, um zu wirken.",
      ],
      "Der Film deutet die DDR aus heutiger Sicht und verrät viel über seine eigene Zeit.",
    ),
    workshop: classify(
      "Filmanalyse ordnen",
      ["Intention", "Aufbau", "Wirkung"],
      [
        [
          "Der Regisseur wollte zeigen, wie Überwachung das Leben Einzelner zerstört.",
          0,
          "Das ist das Ziel des Filmemachers.",
        ],
        [
          "Im Mittelpunkt steht ein Stasi-Offizier, der eine Wende durchlebt.",
          1,
          "Figuren und Handlungsbogen gehören zum Aufbau.",
        ],
        [
          "Leise Musik und Nahaufnahmen wecken Mitgefühl mit dem Überwachten.",
          2,
          "Filmische Mittel lenken die Gefühle der Zuschauer.",
        ],
        [
          "Die Geschichte gipfelt in einer Entscheidung, die alles verändert.",
          1,
          "Wendepunkte strukturieren die Handlung.",
        ],
      ],
      "Wer Intention, Aufbau und Wirkung trennt, erkennt, wie ein Film seine Deutung erzeugt.",
    ),
    tasks: {
      1: writing(
        "Erkläre an einem Beispiel, warum ein historischer Spielfilm Figuren und Szenen erfindet.",
        ["Was braucht eine Spielfilmhandlung?", "Was bedeutet das für die Glaubwürdigkeit?"],
        "Ein Spielfilm braucht Hauptfiguren, Spannung und einen Höhepunkt, damit Zuschauer mitfühlen. Deshalb verdichtet er viele Erfahrungen in eine erfundene Person oder erfindet Gespräche. Der Film kann so eine Zeit anschaulich machen, einzelne Szenen sind aber kein Beleg; ich prüfe sie an Darstellungen.",
        ["Grund für Erfindung", "Beispiel", "Folge für die Prüfung"],
      ),
      2: writing(
        "Beurteile, ob ein Dokumentarfilm mit Archivbildern objektiver ist als ein Spielfilm.",
        ["Auch Dokumentarfilme wählen aus.", "Kommentar, Schnitt und Musik bedenken."],
        "Ein Dokumentarfilm zeigt echte Aufnahmen und Zeitzeugen, das macht ihn näher an den Quellen. Doch auch er wählt Bilder aus, setzt sie in eine Reihenfolge und deutet sie durch Kommentar und Musik. Er ist deshalb nicht automatisch objektiv, sondern ebenfalls eine Darstellung, die ich auf Intention und Belege prüfe.",
        ["Stärke erkannt", "Gestaltung erkannt", "Begründetes Urteil"],
      ),
    },
  },
];
