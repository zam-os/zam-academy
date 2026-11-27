import type { Lesson } from "../model/types";
import { check, decide, sort, term, write } from "./lesson-parts";

export const LB5: Lesson[] = [
  {
    id: "ab-arbeit",
    lb: 5,
    unit: "5",
    title: "Arbeit als Lebensgrundlage",
    intro: "Arbeit sichert das Einkommen und gibt dem Alltag Sinn. Wovon hängt ab, welche Arbeit man tut?",
    paragraphs: [
      "Wer „Arbeit“ hört, denkt oft an einen Job mit Lohn. Doch Arbeit hat mehrere Gesichter. Bei der **abhängigen Erwerbsarbeit** arbeitet man für einen Arbeitgeber, folgt dessen Weisungen und erhält dafür Lohn oder Gehalt. Wer **selbstständig** ist, führt einen eigenen Betrieb, entscheidet selbst und trägt das Risiko. Das **Ehrenamt**, etwa in der Jugendfeuerwehr, ist freiwillig, in der Regel unbezahlt (höchstens gibt es eine kleine Aufwandsentschädigung) und nützt der Gemeinschaft. Auch **Haus- und Familienarbeit** wie Kochen, Pflegen und Kinderbetreuung bleibt unbezahlt, ist aber für Familien unverzichtbar.",
      "Die Motive, warum Menschen arbeiten, sind verschieden. Für die meisten ist Arbeit die **Lebensgrundlage**: Sie sichert Wohnung, Essen und Freizeit. Dazu kommen Sicherheit, Anerkennung, Kontakt zu anderen und die Freude, etwas zu können. Das Recht gibt der Arbeit einen Rahmen: Das Grundgesetz schützt die **Berufsfreiheit** aller Deutschen, also die freie Wahl von Beruf und Arbeitsplatz; für Ausländerinnen und Ausländer gelten EU- und Aufenthaltsrecht. Bei Ausbildung und Beruf müssen Eltern auf Eignung und Neigung ihres Kindes Rücksicht nehmen (§ 1631a BGB). Im **Arbeitsvertrag** verpflichten sich Beschäftigte zu weisungsgebundener Arbeit, und der Arbeitgeber zahlt dafür die vereinbarte Vergütung.",
      "Welche Arbeit jemand tut, hängt von vielen **Einflussgrößen** ab. Man kann sie in vier Gruppen ordnen. **Persönlich** sind Interessen, Fähigkeiten, Gesundheit und Werte. **Gesellschaftlich** sind das Ansehen von Berufen, Rollenbilder und der Rat von Familie und Freunden. **Wirtschaftlich** sind die Lage am Arbeitsmarkt, neue Technik und das Angebot in der Region. **Rechtlich** sind Gesetze wie das Jugendarbeitsschutzgesetz, Tarifverträge und der Arbeitsvertrag.",
      "Vor der Berufswahl lohnt sich eine Tabelle mit vier Spalten, in die du zu jeder Gruppe ein bis zwei eigene Punkte schreibst. Schnell zeigt sich, dass die Gruppen zusammenhängen: Ein angesehener Beruf wird vielleicht stark nachgefragt, verlangt aber eine gesetzlich geregelte Ausbildung und muss zu den eigenen Stärken passen. Keine Gruppe entscheidet allein. Erst das Zusammenspiel ergibt ein vollständiges Bild und zeigt, was du selbst beeinflussen kannst.",
    ],
    terms: [
      { term: "Erwerbsarbeit", text: "Arbeit, die gegen Bezahlung geleistet wird, entweder als Beschäftigte oder als Selbstständige." },
      { term: "Ehrenamt", text: "Eine freiwillige, in der Regel unbezahlte Tätigkeit zum Nutzen anderer oder der Gemeinschaft." },
      { term: "Berufsfreiheit", text: "Das Grundrecht aller Deutschen, Beruf, Arbeitsplatz und Ausbildungsstätte frei zu wählen." },
      {
        term: "Einflussgrößen",
        text: "Umstände, die Berufswahl und Berufsleben prägen: persönliche, gesellschaftliche, wirtschaftliche und rechtliche.",
      },
    ],
    law: [
      {
        ref: "Art. 12 GG",
        text: "Alle Deutschen dürfen Beruf, Arbeitsplatz und Ausbildungsstätte frei wählen. Das Gesetz darf die Berufsausübung regeln, aber niemand darf zu einer bestimmten Arbeit gezwungen werden, außer bei herkömmlichen öffentlichen Dienstleistungspflichten, die für alle gleich gelten.",
      },
      {
        ref: "§ 611a BGB",
        text: "Im Arbeitsvertrag verpflichtet sich der Arbeitnehmer zu weisungsgebundener, fremdbestimmter Arbeit in persönlicher Abhängigkeit. Der Arbeitgeber muss dafür die vereinbarte Vergütung zahlen.",
        url: "https://www.gesetze-im-internet.de/bgb/__611a.html",
      },
    ],
    takeaway:
      "Arbeit gibt es als abhängige oder selbstständige Erwerbsarbeit, als Ehrenamt und als Haus- und Familienarbeit. Welche man wählt, hängt von persönlichen, gesellschaftlichen, wirtschaftlichen und rechtlichen Einflussgrößen ab.",
    sourceIds: ["lp", "gg", "bgb"],
    quiz: {
      question: "Was kennzeichnet abhängige Erwerbsarbeit im Unterschied zur selbstständigen?",
      answer: "Beschäftigte arbeiten nach den Weisungen ihres Arbeitgebers und erhalten dafür die vereinbarte Vergütung.",
      wrong: [
        "Beschäftigte entscheiden allein über Ziele und Arbeitszeit und tragen das unternehmerische Risiko.",
        "Beschäftigte arbeiten freiwillig und unbezahlt für einen gemeinnützigen Zweck in der Gemeinschaft.",
      ],
      explanation:
        "Abhängig arbeitet, wer Weisungen folgt und dafür Lohn oder Gehalt erhält. Wer selbst entscheidet und das Risiko trägt, ist selbstständig; die unbezahlte, freiwillige Tätigkeit nennt man Ehrenamt.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Einflussgröße wirkt hier?",
      instruction: "Ordne jeden Fall der Gruppe zu, aus der der Einfluss auf die Berufswahl stammt.",
      categories: ["persönlich", "gesellschaftlich", "wirtschaftlich", "rechtlich"],
      entries: [
        {
          text: "Hannah arbeitet gern mit Tieren und möchte deshalb einen Beruf mit Tierkontakt.",
          target: 0,
          feedback: "Eigene Interessen sind eine persönliche Einflussgröße.",
        },
        {
          text: "In Marcos Umfeld gilt ein Handwerksberuf als wenig angesehen, deshalb raten ihm alle zu einer Arbeit im Büro.",
          target: 1,
          feedback: "Das Ansehen von Berufen und die Meinung des Umfelds sind gesellschaftliche Einflüsse.",
        },
        {
          text: "In Dilaras Region suchen viele Betriebe Elektronikfachkräfte, aber kaum jemand stellt Bürokräfte ein.",
          target: 2,
          feedback: "Das Stellenangebot in der Region ist ein wirtschaftlicher Einfluss.",
        },
        {
          text: "Ein Betrieb darf Jugendliche unter 18 Jahren nur nach den Regeln des Jugendarbeitsschutzgesetzes beschäftigen.",
          target: 3,
          feedback: "Gesetze legen fest, wie und wie lange Jugendliche arbeiten dürfen: ein rechtlicher Einfluss.",
        },
        {
          text: "Weil Jonas schwere Lasten gesundheitlich nicht heben kann, scheiden körperlich harte Berufe für ihn aus.",
          target: 0,
          feedback: "Die eigene Gesundheit gehört zu den persönlichen Einflussgrößen.",
        },
        {
          text: "Durch neue Software entfallen in Büros viele einfache Schreibarbeiten, dafür entstehen andere Aufgaben.",
          target: 2,
          feedback: "Technischer Wandel verändert die Nachfrage nach Arbeit und ist ein wirtschaftlicher Einfluss.",
        },
      ],
      conclusion: "Wer Einflüsse nach diesen vier Gruppen sortiert, sieht besser, was er selbst beeinflussen kann und was nicht.",
    },
    casework: {
      title: "Die Bäckerei der Eltern",
      story:
        "Selin (15) soll nach der Schule die **Bäckerei ihrer Eltern** übernehmen. Ihre Mutter führt den Betrieb als **Selbstständige**, ihr Vater ist dort als **Bäcker angestellt**, und ihre Großmutter arbeitet **ehrenamtlich** im Pfarrgemeinderat. Selin würde lieber Mediengestalterin werden. Außerdem verliert die Bäckerei zunehmend Kunden an einen neuen Discounter.",
      steps: [
        {
          question: "Wie ist die Arbeit von Selins Vater einzuordnen?",
          options: [
            "Abhängige Erwerbsarbeit: Er arbeitet nach Weisungen und erhält dafür Lohn.",
            "Selbstständige Erwerbsarbeit: Er trägt das Risiko des Betriebs selbst.",
            "Ehrenamt: Er hilft freiwillig und ohne Bezahlung im Familienbetrieb.",
          ],
          answer: 0,
          explanation: "Er ist angestellt. Wer Weisungen folgt und Lohn erhält, übt abhängige Erwerbsarbeit aus.",
        },
        {
          question: "Wie ist die Tätigkeit der Großmutter im Pfarrgemeinderat einzuordnen?",
          options: [
            "Haus- und Familienarbeit, weil sie für die Gemeinschaft sorgt.",
            "Ehrenamt: Sie arbeitet freiwillig, unbezahlt und für die Gemeinschaft.",
            "Selbstständige Erwerbsarbeit, weil sie ihre Zeit selbst einteilt.",
          ],
          answer: 1,
          explanation: "Freiwillig, unbezahlt und zum Nutzen der Gemeinschaft: Das kennzeichnet das Ehrenamt.",
        },
        {
          question: "Was gilt rechtlich für den Wunsch der Eltern, Selin solle die Bäckerei übernehmen?",
          options: [
            "Selin hat das Recht auf freie Berufswahl; aus dem Wunsch der Eltern folgt keine Pflicht zur Übernahme.",
            "Selin muss den Betrieb übernehmen, wenn die Eltern ihn mühsam aufgebaut haben.",
            "Bis zum 18. Geburtstag entscheiden allein die Eltern, auf Selins Neigung kommt es nicht an.",
          ],
          answer: 0,
          explanation:
            "Die Berufsfreiheit (Art. 12 GG) schützt die freie Wahl des Berufs, niemand darf zu einer bestimmten Arbeit gezwungen werden. Im Verhältnis zu den Eltern gilt § 1631a BGB: Sie entscheiden als gesetzliche Vertreter bei der Ausbildung mit, müssen aber auf Eignung und Neigung Rücksicht nehmen. Eine Pflicht zur Übernahme gibt es nicht.",
        },
        {
          question: "Zu welcher Gruppe von Einflussgrößen gehört der Kundenverlust an den Discounter?",
          options: ["Wirtschaftlich", "Persönlich", "Rechtlich"],
          answer: 0,
          explanation: "Wettbewerb und Marktlage sind wirtschaftliche Einflüsse. Sie beeinflussen, wie sicher der Betrieb für Selin wäre.",
        },
      ],
      verdict:
        "Selin kann die Arbeit in ihrer Familie richtig einordnen und weiß: Die Bäckerei zu übernehmen ist eine Möglichkeit, aber keine Pflicht. Bei ihrer Entscheidung wägt sie persönliche, gesellschaftliche und wirtschaftliche Einflüsse ab.",
    },
    tasks: {
      1: {
        prompt: "Erkläre, welche vier Arten von Arbeit man unterscheidet, und nenne zu jeder Art ein Beispiel aus deinem Umfeld.",
        hints: [
          "Was unterscheidet bezahlte von unbezahlter Arbeit?",
          "Wer gibt bei abhängiger Arbeit die Weisungen, und wer trägt bei selbstständiger Arbeit das Risiko?",
        ],
        model:
          "Abhängige Erwerbsarbeit leistet zum Beispiel ein Verkäufer, der nach den Weisungen seines Arbeitgebers arbeitet und Gehalt bekommt. Selbstständig ist etwa eine Friseurin mit eigenem Salon, die selbst entscheidet und das Risiko trägt. Das Ehrenamt, etwa als Jugendtrainer im Sportverein, ist freiwillig und unbezahlt. Haus- und Familienarbeit wie Kochen und Kinderbetreuung bleibt ebenfalls ohne Lohn, ist aber für die Familie wichtig.",
        criteria: [
          "Nennt alle vier Arten von Arbeit",
          "Gibt zu jeder Art ein passendes Beispiel",
          "Erklärt, was Erwerbsarbeit von unbezahlter Arbeit unterscheidet",
        ],
      },
      2: {
        prompt:
          "Mehmet (15) überlegt, Pflegefachmann zu werden. Er mag den Umgang mit Menschen, einige Freunde halten den Beruf für „nichts für Jungen“, in seiner Region fehlen Pflegekräfte, und für die Ausbildung gelten gesetzlich geregelte Zugangsvoraussetzungen. Ordne diese vier Punkte den vier Gruppen von Einflussgrößen zu und beurteile, welche davon Mehmet selbst beeinflussen kann.",
        hints: [
          "Welcher Punkt hat mit Mehmets Neigungen zu tun, welcher mit der Meinung anderer?",
          "Wo kann Mehmet selbst etwas verändern, und wo nicht?",
        ],
        model:
          "Das Interesse am Umgang mit Menschen ist eine persönliche Einflussgröße, die Meinung der Freunde eine gesellschaftliche. Der Mangel an Pflegekräften ist wirtschaftlich, die Zugangsvoraussetzungen sind rechtlich. Am stärksten beeinflussen kann Mehmet seine eigenen Stärken und seine Vorbereitung, etwa durch ein Praktikum. Die Meinung anderer kann er nicht ändern, muss sich ihr aber nicht beugen.",
        criteria: [
          "Ordnet jeden der vier Punkte der richtigen Gruppe zu",
          "Unterscheidet, was Mehmet beeinflussen kann und was nicht",
          "Begründet seine Einschätzung mit einem Beispiel",
        ],
      },
    },
  },

  {
    id: "ab-arbeitsmarkt",
    lb: 5,
    unit: "5",
    title: "Der Arbeitsmarkt",
    intro: "Auch Arbeit hat einen Markt mit Angebot, Nachfrage und einem Preis, dem Lohn. Doch hier gelten Besonderheiten.",
    paragraphs: [
      "Am **Arbeitsmarkt** treffen sich zwei Seiten. Unternehmen fragen Arbeitskräfte nach, weil sie Stellen besetzen wollen. Menschen bieten ihre Arbeitskraft an, weil sie ein Einkommen brauchen. Der „Preis“ für Arbeit ist der **Lohn** oder das Gehalt. Bei hohen Löhnen können Betriebe weniger Stellen bezahlen, aber mehr Menschen wollen arbeiten. Bei niedrigen Löhnen ist es umgekehrt. Dieses Bild kennt man vom Markt für Waren.",
      "Trotzdem ist Arbeit keine Ware wie ein Brötchen. **Erstens** sind es Menschen: Sie haben Würde, Gesundheit und Familie. Deshalb schützen Gesetze, Tarifverträge und der Mindestlohn sie, und der Lohn sinkt nicht einfach, bis alle Arbeit haben. **Zweitens** zählt die **Qualifikation**: Eine Bäckerin wird nicht von heute auf morgen Softwareentwicklerin, der Markt besteht aus vielen Teilmärkten. **Drittens** spielt die **Region** eine Rolle: Wer Wohnung, Familie und Freunde an einem Ort hat, zieht nicht für jede Stelle um.",
      "Das Modell hilft beim Einordnen. Suchen bei einem Lohn **mehr Menschen Arbeit, als Stellen frei sind**, liegt ein Angebotsüberhang an Arbeit vor, in der Wirklichkeit ähnelt das der **Arbeitslosigkeit**. Sind **mehr Stellen offen, als Menschen sie zu diesem Lohn besetzen wollen**, liegt ein Nachfrageüberhang nach Arbeit vor, ähnlich einem **Fachkräftemangel**. Die Grenzen: Löhne reagieren langsam, es gibt viele Teilmärkte, und Arbeitslose und offene Stellen können zugleich vorkommen, wenn Qualifikation oder Wohnort nicht passen. Achte im Modell darauf, was mit dem Lohn passiert, wenn Nachfrage oder Angebot wachsen.",
      "Der Arbeitsmarkt verändert sich ständig. Die **Digitalisierung** lässt manche Tätigkeiten verschwinden, schafft neue und verlangt öfter digitale Kenntnisse. Beim **demografischen Wandel** altert die Gesellschaft: Die geburtenstarken Jahrgänge gehen in den Ruhestand, und weniger junge Menschen rücken nach. Deshalb fehlen in manchen Berufen und Regionen **Fachkräfte**. Wie stark, schwankt mit der Konjunktur. Gute Qualifikation und Weiterlernen erhöhen die Chancen, doch die Berufswahl sollte nicht nur der Nachfrage folgen.",
    ],
    terms: [
      { term: "Arbeitsmarkt", text: "Der Markt, auf dem Arbeitgeber Arbeitskräfte nachfragen und Menschen ihre Arbeitskraft zum Lohn anbieten." },
      {
        term: "Angebotsüberhang an Arbeit",
        text: "Zum geltenden Lohn suchen mehr Menschen Arbeit, als Stellen angeboten werden; ähnlich der Arbeitslosigkeit.",
      },
      {
        term: "Nachfrageüberhang nach Arbeit",
        text: "Zum geltenden Lohn sind mehr Stellen offen, als Menschen sie besetzen wollen; ähnlich einem Fachkräftemangel.",
      },
      { term: "Fachkräftemangel", text: "Es gibt zu wenige Beschäftigte mit der nötigen Qualifikation, um offene Stellen zu besetzen." },
    ],
    takeaway:
      "Am Arbeitsmarkt bieten Menschen Arbeit an und Betriebe fragen sie nach. Das Modell erklärt Arbeitslosigkeit und Fachkräftemangel nur grob, weil Menschen, Qualifikation und Region eine Rolle spielen.",
    sourceIds: ["lp", "ba", "sgb3"],
    quiz: {
      question: "Warum gibt es manchmal gleichzeitig viele Arbeitsuchende und viele unbesetzte Stellen?",
      answer: "Qualifikation oder Wohnort der Arbeitsuchenden passen nicht zu den offenen Stellen, weil es viele Teilmärkte gibt.",
      wrong: [
        "Das Modell von Angebot und Nachfrage gilt am Arbeitsmarkt nicht, deshalb gleicht sich dort nichts aus.",
        "Betriebe schreiben Stellen oft nur zum Schein aus und wollen sie in Wirklichkeit gar nicht besetzen.",
      ],
      explanation:
        "Arbeitskräfte sind keine gleichartige Ware: Wer nicht die passende Ausbildung hat oder nicht umziehen kann, besetzt die Stelle nicht. Das Modell gilt grob weiter, muss aber um Teilmärkte ergänzt werden.",
    },
    lab: "arbeitsmarkt",
    labGoals: ["ueberschuss", "knappheit", "nachfrage-steigt", "angebot-steigt"],
    workshop: {
      kind: "classify",
      title: "Was zeigt dieser Arbeitsmarkt?",
      instruction: "Ordne jede Lage der passenden Beschreibung zu.",
      categories: ["Angebotsüberhang an Arbeit", "Nachfrageüberhang nach Arbeit", "Qualifikation oder Region passt nicht"],
      entries: [
        {
          text: "In einem Landkreis suchen 300 Menschen eine Stelle, aber nur 120 Stellen sind gemeldet.",
          target: 0,
          feedback: "Es suchen mehr Menschen Arbeit, als Stellen frei sind.",
        },
        {
          text: "Ein Pflegeheim schreibt seit Monaten 15 Stellen aus und erhält nur 4 Bewerbungen.",
          target: 1,
          feedback: "Es sind mehr Stellen offen, als Bewerbungen eingehen.",
        },
        {
          text: "Eine Softwarefirma sucht Entwickler, obwohl in der Stadt viele Menschen mit einer ganz anderen Ausbildung Arbeit suchen.",
          target: 2,
          feedback: "Die Qualifikation der Arbeitsuchenden passt nicht zu den offenen Stellen.",
        },
        {
          text: "Nach der Schließung eines großen Werks stehen viele Beschäftigte ohne Stelle da, und neue Arbeitsplätze fehlen in der Gegend.",
          target: 0,
          feedback: "Plötzlich suchen viele Menschen Arbeit, während Stellen fehlen.",
        },
        {
          text: "Ein Dachdeckerbetrieb auf dem Land sucht Gesellen, während in einer weit entfernten Großstadt Dachdecker Arbeit suchen.",
          target: 2,
          feedback: "Die Region passt nicht, denn die Menschen bleiben an ihrem Wohnort.",
        },
        {
          text: "Seit Monaten sind in vielen Betrieben der Region Stellen offen, und kaum jemand ist noch arbeitslos gemeldet.",
          target: 1,
          feedback: "Es sind mehr Stellen offen, als sich Menschen finden: ein Nachfrageüberhang, ähnlich einem Fachkräftemangel.",
        },
      ],
      conclusion: "Wer Lage und Ursache unterscheidet, versteht, warum Arbeitslosigkeit und Fachkräftemangel nebeneinander bestehen können.",
    },
    casework: {
      title: "Nachwuchs für die Bäckerei Hollerbusch",
      story:
        "In einer ländlichen Gemeinde sucht die Bäckerei Hollerbusch seit einem Jahr **zwei Verkäufer** und einen **Bäckergesellen**. Es melden sich kaum Bewerbungen. Viele junge Leute sind in die **Stadt** gezogen, und die Einwohner der Gemeinde werden im Durchschnitt **älter**.",
      steps: [
        {
          question: "Wer fragt hier Arbeit nach, und wer bietet sie an?",
          options: [
            "Die Bäckerei fragt Arbeitskraft nach, die Bewerber bieten ihre Arbeitskraft an.",
            "Die Bäckerei bietet Arbeitskraft an, die Bewerber fragen sie nach.",
            "Beide Seiten fragen Arbeit nach, weil beide Geld verdienen wollen.",
          ],
          answer: 0,
          explanation: "Der Betrieb will Stellen besetzen, also fragt er Arbeit nach. Die Bewerber bieten ihre Arbeitskraft an.",
        },
        {
          question: "Welche Lage am Arbeitsmarkt beschreibt die Geschichte?",
          options: [
            "Angebotsüberhang an Arbeit: Es gibt mehr Bewerber als Stellen.",
            "Nachfrageüberhang nach Arbeit: Es gibt mehr offene Stellen als Bewerber.",
            "Gleichgewicht: Jede Stelle ist besetzt, und jeder findet Arbeit.",
          ],
          answer: 1,
          explanation: "Seit einem Jahr bleiben Stellen unbesetzt, es fehlen Bewerber. Das ist ein Nachfrageüberhang nach Arbeit.",
        },
        {
          question: "Welche Entwicklung erklärt den Mangel an Nachwuchs hier am besten?",
          options: [
            "Digitalisierung: Roboter haben die Arbeit in der Bäckerei übernommen.",
            "Demografischer Wandel und Abwanderung: Es rücken weniger junge Menschen nach.",
            "Eine Wirtschaftskrise: Die Bäckerei hat zu wenig Aufträge.",
          ],
          answer: 1,
          explanation: "Die Einwohner altern, junge Menschen ziehen weg. Das senkt das Angebot an Arbeitskräften vor Ort.",
        },
        {
          question: "Was erwartet das Modell von Angebot und Nachfrage als Reaktion der Bäckerei?",
          options: [
            "Sie muss den Lohn senken, damit mehr Bewerber kommen.",
            "Sie kann nichts tun, weil Löhne am Arbeitsmarkt nicht verändert werden dürfen.",
            "Sie muss einen höheren Lohn oder bessere Bedingungen bieten, um mehr Bewerber zu gewinnen.",
          ],
          answer: 2,
          explanation: "Bei einem Nachfrageüberhang steigt der Preis. Am Arbeitsmarkt heißt das: höherer Lohn oder bessere Bedingungen.",
        },
      ],
      verdict:
        "Die Bäckerei steht einem Nachfrageüberhang nach Arbeit gegenüber, ausgelöst durch demografischen Wandel und Abwanderung. Das Modell nennt Lohn und Bedingungen als Hebel; zusätzlich helfen Ausbildung im eigenen Betrieb und Weiterbildung.",
    },
    tasks: {
      1: {
        prompt: "Erkläre, warum Arbeit keine Ware wie jede andere ist, und nenne zwei Besonderheiten des Arbeitsmarkts.",
        hints: [
          "Wer bietet Arbeit an, und was hängt an dieser Person?",
          "Was hindert viele Arbeitsuchende daran, für eine Stelle in einer anderen Branche oder Stadt einfach zu wechseln?",
        ],
        model:
          "Am Arbeitsmarkt bieten Menschen ihre Arbeitskraft an, keine Sachen. Deshalb gelten Schutzregeln wie Tarifverträge oder der Mindestlohn, und der Lohn sinkt nicht einfach, bis alle eine Stelle haben. Außerdem müssen Qualifikation und Wohnort zur Stelle passen: Wer eine bestimmte Ausbildung hat oder Familie am Ort, kann nicht beliebig wechseln. Darum gleicht sich dieser Markt langsamer aus als ein Markt für Waren.",
        criteria: [
          "Erklärt, dass am Arbeitsmarkt Menschen und keine Sachen angeboten werden",
          "Nennt zwei Besonderheiten, zum Beispiel Qualifikation und Region",
          "Erklärt, warum sich der Arbeitsmarkt dadurch langsamer ausgleicht",
        ],
      },
      2: {
        prompt:
          "Ein Politiker sagt: „Wegen des Fachkräftemangels findet jeder Jugendliche sofort einen Ausbildungsplatz im Wunschberuf.“ Beurteile die Aussage mit dem Modell von Angebot und Nachfrage und seinen Grenzen.",
        hints: [
          "Was sagt das Modell über eine Lage mit mehr offenen Stellen als Bewerbern?",
          "Welche Besonderheiten wie Beruf, Qualifikation oder Region können trotzdem zu Problemen führen?",
        ],
        model:
          "Das Modell passt teilweise: Wo mehr Stellen offen sind, als Bewerbungen eingehen, haben Bewerber gute Chancen. Doch der Arbeitsmarkt besteht aus vielen Teilmärkten. Ein Mangel in der Pflege hilft niemandem, der Mediengestalter werden will, und eine freie Stelle in einer fernen Region passt nicht zum eigenen Wohnort. Außerdem schwankt der Mangel mit der Konjunktur. Die Aussage ist also zu allgemein.",
        criteria: [
          "Wendet Angebot und Nachfrage auf die Aussage an",
          "Nennt mindestens eine Grenze des Modells, etwa Teilmärkte, Region oder Qualifikation",
          "Kommt zu einem begründeten Urteil",
        ],
      },
    },
  },

  {
    id: "ab-arbeitslosigkeit",
    lb: 5,
    unit: "5",
    title: "Formen und Folgen der Arbeitslosigkeit",
    intro: "Warum Menschen ohne Arbeit sind, hat verschiedene Ursachen. Und es gibt unterschiedliche Wege, ihnen zu helfen.",
    paragraphs: [
      "Arbeitslos ist, wer keine Beschäftigung hat, sich um Arbeit bemüht und für die Vermittlung zur Verfügung steht. Die Ursachen sind verschieden und liegen oft in der Wirtschaft, nicht nur bei der Person; Qualifikation, Alter und Gesundheit beeinflussen aber die Chancen. Man unterscheidet vier Formen. **Friktionelle** Arbeitslosigkeit ist kurz: Jemand wechselt die Stelle oder beendet die Ausbildung und sucht Neues. **Saisonale** Arbeitslosigkeit folgt den Jahreszeiten, etwa im Bau, in der Landwirtschaft oder im Tourismus.",
      "**Konjunkturelle** Arbeitslosigkeit hängt vom Auf und Ab der Wirtschaft ab: Läuft sie schlecht, kaufen Menschen weniger, Betriebe brauchen weniger Personal und stellen weniger ein. **Strukturelle** Arbeitslosigkeit entsteht, wenn sich die Wirtschaft dauerhaft verändert, zum Beispiel durch Digitalisierung oder verlagerte Produktion. Dann passen Qualifikation oder Wohnort nicht mehr zu den neuen Stellen. Sie dauert oft am längsten, weil Umlernen Zeit braucht.",
      "Zu jeder Form passen andere **Gegenmaßnahmen**. Gegen friktionelle Arbeitslosigkeit helfen schnelle Information und Vermittlung. Bei saisonaler helfen Arbeitsangebote außerhalb der Saison. Gegen konjunkturelle setzt der Staat auf Investitionen und das Kurzarbeitergeld der Bundesagentur, mit dem Betriebe Beschäftigte trotz Auftragsmangel halten. Gegen strukturelle helfen Weiterbildung und Umschulung. Bewerten kann man jede Maßnahme nach Wirkung, Kosten, Dauer und Nebenwirkungen: Konjunkturprogramme können Aufträge bringen, wirken aber oft erst spät und verursachen Schulden. Umschulung wirkt langsamer, verbessert die Chancen aber dauerhaft.",
      "Arbeitslosigkeit trifft Menschen in mehreren Bereichen. Das **Einkommen** sinkt, denn Arbeitslosengeld ersetzt nur einen Teil des früheren Verdienstes. Der **Selbstwert** leidet, weil viele sich nicht mehr gebraucht fühlen. **Soziale Kontakte** gehen verloren, wenn Kolleginnen und Kollegen wegfallen und Geld für gemeinsame Unternehmungen fehlt. Auch die **Gesundheit** kann durch Stress, Sorgen und Schlafprobleme leiden. Je länger es dauert, desto größer wird die Belastung. Verständnis und Unterstützung aus dem Umfeld helfen mehr als Vorwürfe.",
    ],
    terms: [
      { term: "Friktionelle Arbeitslosigkeit", text: "Kurze Arbeitslosigkeit beim Wechsel zwischen zwei Stellen oder nach der Ausbildung." },
      { term: "Saisonale Arbeitslosigkeit", text: "Arbeitslosigkeit, die mit den Jahreszeiten schwankt, etwa im Bau oder im Tourismus." },
      {
        term: "Konjunkturelle Arbeitslosigkeit",
        text: "Arbeitslosigkeit, die in einem Abschwung der Wirtschaft entsteht, weil weniger gekauft und produziert wird.",
      },
      {
        term: "Strukturelle Arbeitslosigkeit",
        text: "Arbeitslosigkeit durch dauerhaften Wandel der Wirtschaft, bei dem Qualifikation oder Region nicht mehr zu den Stellen passen.",
      },
    ],
    law: [
      {
        ref: "§ 138 SGB III",
        text: "Arbeitslos im Sinne des Gesetzes ist, wer als Arbeitnehmerin oder Arbeitnehmer keine Beschäftigung hat, sich um Arbeit bemüht und den Vermittlungsbemühungen der Agentur für Arbeit zur Verfügung steht.",
      },
    ],
    takeaway:
      "Man unterscheidet friktionelle, saisonale, konjunkturelle und strukturelle Arbeitslosigkeit nach ihren Ursachen. Jede Form verlangt andere Gegenmaßnahmen, und für die Betroffenen sinken Einkommen, Selbstwert, Kontakte und oft die Gesundheit.",
    sourceIds: ["lp", "sgb3"],
    quiz: {
      question:
        "Ein Werk stellt auf neue Technik um, und die Qualifikation der entlassenen Beschäftigten passt nicht zu den neuen Stellen. Welche Form liegt vor und was hilft am ehesten?",
      answer: "Strukturelle Arbeitslosigkeit; Weiterbildung und Umschulung verbessern die Chancen am ehesten.",
      wrong: [
        "Konjunkturelle Arbeitslosigkeit; ein staatliches Investitionsprogramm löst das Problem am ehesten.",
        "Saisonale Arbeitslosigkeit; neue Aufträge im nächsten Sommer lösen das Problem am ehesten.",
      ],
      explanation:
        "Hier fehlt nicht die Nachfrage nach Gütern, sondern die passende Qualifikation für den dauerhaften Wandel. Deshalb helfen Weiterbildung und Umschulung. Konjunkturprogramme und die nächste Saison ändern daran wenig.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Form der Arbeitslosigkeit liegt vor?",
      instruction: "Ordne jeden Fall nach der Ursache der Arbeitslosigkeit zu.",
      categories: ["friktionell", "saisonal", "konjunkturell", "strukturell"],
      entries: [
        {
          text: "Nach der Abschlussprüfung bewirbt sich Lena bei mehreren Betrieben und fängt drei Wochen später an.",
          target: 0,
          feedback: "Kurze Suchzeit beim Übergang: Das ist friktionell.",
        },
        {
          text: "Ein Skilift-Betreiber entlässt im Frühjahr seine Aushilfen und stellt im Winter wieder neue ein.",
          target: 1,
          feedback: "Die Beschäftigung schwankt mit den Jahreszeiten: Das ist saisonal.",
        },
        {
          text: "In einem wirtschaftlichen Abschwung kaufen die Menschen weniger Möbel, und mehrere Schreinereien bauen Personal ab.",
          target: 2,
          feedback: "Die Nachfrage sinkt mit der Konjunktur, die Stellen gehen vorübergehend verloren: konjunkturell.",
        },
        {
          text: "Online-Shops ersetzen viele Schuhgeschäfte, und die entlassenen Verkäuferinnen haben keine IT-Kenntnisse.",
          target: 3,
          feedback: "Dauerhafter Wandel der Wirtschaft, und die Qualifikation passt nicht mehr: strukturell.",
        },
        {
          text: "Ein Zeltverleih an einem Badesee braucht im Winter kaum Personal und kündigt den Saisonkräften.",
          target: 1,
          feedback: "Auch hier bestimmt die Jahreszeit die Nachfrage nach Arbeit: saisonal.",
        },
        {
          text: "Eine Fabrik verlagert die Produktion ins Ausland, und in der Region gibt es keinen anderen großen Arbeitgeber.",
          target: 3,
          feedback: "Die Arbeitsplätze fallen dauerhaft weg und die Region kann sie nicht ersetzen: strukturell.",
        },
      ],
      conclusion: "Die Ursache zeigt, welche Maßnahme sinnvoll ist: Information, Saisonangebote, Konjunkturhilfe oder Umschulung.",
    },
    casework: {
      title: "Der Auftragseinbruch",
      story:
        "Herr Brandt (45) arbeitet seit 20 Jahren als **Zerspanungsmechaniker** bei einem Maschinenbauer. Wegen einer **weltweiten Wirtschaftskrise** brechen die Aufträge ein, und der Betrieb entlässt 80 von 400 Beschäftigten. Herr Brandt ist betroffen und findet in der Region kaum Stellen, weil alle ähnlichen Betriebe gerade **weniger einstellen**.",
      steps: [
        {
          question: "Welche Form der Arbeitslosigkeit liegt bei Herrn Brandt vor?",
          options: [
            "Konjunkturelle: Die schwache Wirtschaft senkt die Nachfrage nach Arbeit.",
            "Strukturelle: Seine Qualifikation wird dauerhaft nicht mehr gebraucht.",
            "Friktionelle: Er sucht nur kurz nach einem Wechsel eine neue Stelle.",
          ],
          answer: 0,
          explanation:
            "Auslöser ist die Krise der Wirtschaft: weniger Aufträge, weniger Personal. Seine Qualifikation ist weiter gefragt, sobald es wieder aufwärts geht.",
        },
        {
          question: "Welche Maßnahme hätte Entlassungen vorher am ehesten vermeiden können?",
          options: [
            "Umschulung aller Beschäftigten, damit sie in einer anderen Branche arbeiten können.",
            "Kurzarbeit: Die Beschäftigten bleiben im Betrieb, Arbeitszeit und Lohn sinken vorübergehend.",
            "Saisonarbeit: Der Betrieb stellt nur noch für den Sommer Aushilfen ein.",
          ],
          answer: 1,
          explanation:
            "Bei einem vorübergehenden Einbruch sichert Kurzarbeit Arbeitsplätze, ohne dass Wissen verloren geht; die Bundesagentur zahlt Kurzarbeitergeld für einen Teil des Lohnausfalls. Das kostet aber Geld und hilft nur, wenn die Krise nicht dauerhaft ist.",
        },
        {
          question: "Ein Bekannter meint: „Herr Brandt ist selbst schuld, er hätte sich eben besser qualifizieren sollen.“ Wie ist das zu bewerten?",
          options: [
            "Das stimmt, denn wer gut qualifiziert ist, verliert nie seine Stelle.",
            "Das ist nicht stimmig: Die Ursache liegt in der Wirtschaftskrise, nicht bei ihm.",
            "Das stimmt, denn nur schlecht arbeitende Beschäftigte werden entlassen.",
          ],
          answer: 1,
          explanation:
            "Konjunkturelle Arbeitslosigkeit trifft auch gut qualifizierte Menschen. Schuldzuweisungen übersehen die wirtschaftlichen Ursachen und belasten Betroffene zusätzlich.",
        },
      ],
      verdict:
        "Herr Brandt ist konjunkturell arbeitslos: Die Ursache liegt in der Wirtschaftskrise, nicht in seiner Person. Kurzarbeit hätte helfen können, und wenn es wieder aufwärts geht, ist seine Qualifikation gefragt.",
    },
    tasks: {
      1: {
        prompt:
          "Erkläre die Unterschiede zwischen konjunktureller und struktureller Arbeitslosigkeit und nenne zu jeder eine passende Gegenmaßnahme.",
        hints: [
          "Ist die Ursache vorübergehend oder dauerhaft?",
          "Was fehlt bei struktureller Arbeitslosigkeit: die Nachfrage nach Gütern oder die passende Qualifikation?",
        ],
        model:
          "Konjunkturelle Arbeitslosigkeit entsteht, wenn die Wirtschaft schwächelt und Betriebe weniger Personal brauchen; sie ist meist vorübergehend. Dagegen helfen zum Beispiel staatliche Investitionen oder Kurzarbeit. Strukturelle Arbeitslosigkeit entsteht, wenn sich die Wirtschaft dauerhaft ändert und Qualifikation oder Wohnort nicht mehr zu den Stellen passen. Hier helfen Weiterbildung und Umschulung, weil nicht die Nachfrage fehlt, sondern die passende Qualifikation.",
        criteria: [
          "Erklärt die Ursache der konjunkturellen Arbeitslosigkeit (schwache Wirtschaft, sinkende Nachfrage)",
          "Erklärt die Ursache der strukturellen Arbeitslosigkeit (dauerhafter Wandel, Qualifikation passt nicht)",
          "Ordnet jeder Form eine passende Gegenmaßnahme zu",
        ],
      },
      2: {
        prompt:
          "Oksana (52) wurde nach 25 Jahren im Betrieb entlassen und ist seit einem halben Jahr arbeitslos. Beschreibe mindestens drei Bereiche, in denen sie das belastet, und beurteile, welche Hilfen sinnvoll sind.",
        hints: [
          "Denke an Geld, Selbstwert, Kontakte und Gesundheit.",
          "Welche Hilfen gibt es von der Agentur für Arbeit, aus dem Umfeld und vom Staat?",
        ],
        model:
          "Oksana verliert zuerst Einkommen, denn das Arbeitslosengeld ist niedriger als ihr Gehalt, und das zwingt sie zum Sparen. Ihr Selbstwert kann leiden, wenn sie sich nach 25 Jahren plötzlich nicht mehr gebraucht fühlt, und Kontakte zu Kolleginnen gehen verloren. Dauert die Suche lange, können Stress und Schlafprobleme die Gesundheit belasten. Hilfreich sind Beratung und Weiterbildung durch die Agentur für Arbeit, Gespräche mit Familie und Freunden und Verständnis statt Vorwürfen.",
        criteria: [
          "Nennt mindestens drei Bereiche der Auswirkungen, etwa Einkommen, Selbstwert, Kontakte oder Gesundheit",
          "Beschreibt für Oksana zu jedem Bereich eine konkrete Folge",
          "Begründet, welche Hilfen sinnvoll sind",
        ],
      },
    },
  },

  {
    id: "ab-ba",
    lb: 5,
    unit: "5",
    title: "Die Bundesagentur für Arbeit",
    intro: "Die Bundesagentur für Arbeit hilft bei Berufswahl, Stellensuche und Arbeitslosigkeit. Was sie tut und was sie dir bietet.",
    paragraphs: [
      "Die **Bundesagentur für Arbeit** (BA) ist eine Körperschaft des öffentlichen Rechts mit Selbstverwaltung und Sitz in Nürnberg. Vor Ort sind die **Agenturen für Arbeit** die Anlaufstellen; für die Grundsicherung Arbeitsuchender sind meist die Jobcenter zuständig. Vier Schwerpunkte prägen die Arbeit der BA. Sie **berät** zu Beruf und Weiterbildung, sie **vermittelt** Ausbildungs- und Arbeitsstellen, sie zahlt bei Arbeitslosigkeit Arbeitslosengeld und **fördert** berufliche Weiterbildung, und sie **beobachtet den Arbeitsmarkt** und veröffentlicht Statistiken.",
      "Für die Gesellschaft ist die BA wichtig, weil sie Angebot und Nachfrage am Arbeitsmarkt zusammenbringt, Arbeitslosigkeit verkürzen soll und Menschen bei Arbeitslosigkeit finanziell absichert. Auch für den eigenen Werdegang hat sie Bedeutung: Vor der Berufswahl hilft die Berufsberatung bei der Orientierung, bei der Suche nach einem Ausbildungsplatz die Vermittlung, und später bei Jobverlust oder Neuorientierung die Beratung zu Weiterbildung und Umschulung.",
      "Das regionale Angebot kannst du schon jetzt nutzen. Die **Berufsberatung** der Agentur für Arbeit führt persönliche Gespräche, oft auch an Schulen, und ist für Ratsuchende kostenlos. Das **Berufsinformationszentrum (BiZ)** bietet Medien, Computerplätze und Veranstaltungen zu Berufen. **BERUFENET** ist das Online-Nachschlagewerk der BA: Es beschreibt Berufe mit Tätigkeiten, Anforderungen, Ausbildungswegen und Perspektiven. Auch Stellen- und Ausbildungsangebote findest du online bei der BA.",
      "Die BA zeigt auch Möglichkeiten in Europa auf. **EURES** ist ein europäisches Netzwerk der Arbeitsverwaltungen. Es informiert über Stellen sowie Lebens- und Arbeitsbedingungen in anderen europäischen Ländern und hilft bei der Suche. Wer später im Ausland arbeiten oder sich dort ausbilden lassen möchte, findet dort Anlaufstellen. Entscheidend ist, die Angebote früh zu nutzen: Je früher du dich informierst, desto mehr Möglichkeiten hast du für deine Berufsentscheidung.",
    ],
    terms: [
      {
        term: "Bundesagentur für Arbeit",
        text: "Die Körperschaft des öffentlichen Rechts mit Selbstverwaltung, die Arbeit und Ausbildung vermittelt, berät, bei Arbeitslosigkeit absichert und den Arbeitsmarkt beobachtet.",
      },
      { term: "Berufsberatung", text: "Das persönliche Beratungsangebot der Agentur für Arbeit zu Berufswahl, Ausbildung und Weiterbildung." },
      { term: "BERUFENET", text: "Das Online-Nachschlagewerk der Bundesagentur mit Beschreibungen von Berufen, Anforderungen und Ausbildungswegen." },
      {
        term: "EURES",
        text: "Das europäische Netzwerk der Arbeitsverwaltungen, das über Stellen und Arbeiten in anderen europäischen Ländern informiert.",
      },
    ],
    law: [
      {
        ref: "§ 1 SGB III",
        text: "Die Arbeitsförderung soll dem Entstehen von Arbeitslosigkeit entgegenwirken, ihre Dauer verkürzen und den Ausgleich von Angebot und Nachfrage auf dem Ausbildungs- und Arbeitsmarkt unterstützen.",
        url: "https://www.gesetze-im-internet.de/sgb_3/__1.html",
      },
      {
        ref: "§§ 29 und 35 SGB III",
        text: "Die Agentur für Arbeit muss jungen Menschen und Erwachsenen Berufsberatung anbieten und Ausbildungs- und Arbeitsuchenden sowie Arbeitgebern Vermittlung anbieten.",
        url: "https://www.gesetze-im-internet.de/sgb_3/__29.html",
      },
    ],
    takeaway:
      "Die Bundesagentur für Arbeit berät, vermittelt, sichert bei Arbeitslosigkeit ab und fördert Weiterbildung; außerdem beobachtet sie den Arbeitsmarkt. Berufsberatung, Berufsinformationszentrum, BERUFENET und EURES helfen schon bei der eigenen Berufsentscheidung.",
    sourceIds: ["lp", "sgb3", "ba", "berufenet", "eures"],
    quiz: {
      question: "Welche Aufgabe gehört zu den Schwerpunkten der Bundesagentur für Arbeit?",
      answer: "Sie berät zur Berufswahl und führt Ausbildungs- und Arbeitsuchende mit Betrieben zusammen.",
      wrong: [
        "Sie legt für alle Branchen und Betriebe verbindlich Löhne und Arbeitsbedingungen fest.",
        "Sie stellt Arbeitsverträge aus und kündigt sie, wenn Betriebe in wirtschaftliche Not geraten.",
      ],
      explanation:
        "Beraten und Vermitteln gehören zum Kern der BA. Löhne handeln die Tarifparteien aus, und Arbeitsverträge schließen Betrieb und Beschäftigte miteinander.",
    },
    workshop: {
      kind: "classify",
      title: "Welche Aufgabe der BA ist das?",
      instruction: "Ordne jeden Fall dem passenden Schwerpunkt der Bundesagentur für Arbeit zu.",
      categories: ["Berufsberatung", "Vermittlung", "Leistungen und Förderung", "Arbeitsmarktbeobachtung"],
      entries: [
        {
          text: "Eine Schülerin spricht mit einer Berufsberaterin über ihre Stärken und mögliche Ausbildungsberufe.",
          target: 0,
          feedback: "Das persönliche Gespräch zur Berufswahl ist Berufsberatung.",
        },
        {
          text: "Ein Betrieb meldet eine freie Ausbildungsstelle, und die Agentur schlägt ihm passende Bewerber vor.",
          target: 1,
          feedback: "Stellen und Bewerber zusammenzubringen ist Vermittlung.",
        },
        {
          text: "Ein Mann hat seine Stelle verloren und erhält Arbeitslosengeld, solange er die Voraussetzungen erfüllt.",
          target: 2,
          feedback: "Die Absicherung bei Arbeitslosigkeit gehört zu den Leistungen.",
        },
        {
          text: "Die Agentur veröffentlicht jeden Monat, wie viele Menschen in der Region arbeitslos sind und welche Stellen gesucht werden.",
          target: 3,
          feedback: "Zahlen zur Lage am Arbeitsmarkt entstehen durch Arbeitsmarktbeobachtung.",
        },
        {
          text: "Eine Beschäftigte möchte eine Weiterbildung machen, und die Agentur prüft, ob sie diese finanziell fördern kann.",
          target: 2,
          feedback: "Die Förderung beruflicher Weiterbildung gehört zu den Leistungen und zur Förderung.",
        },
        {
          text: "Ein Jugendlicher bewirbt sich auf eine Stelle, die ihm im Online-Portal der Agentur vorgeschlagen wurde.",
          target: 1,
          feedback: "Das Portal bringt Ausbildungsuchende und Betriebe zusammen: Vermittlung.",
        },
      ],
      conclusion: "Beraten, Vermitteln, Absichern und Fördern, Beobachten: So lassen sich die Aufgaben der BA merken.",
    },
    casework: {
      title: "Neles Berufswahl",
      story:
        "Nele (15) besucht die 8. Klasse und hat noch keine klare Idee für ihre Ausbildung. Sie interessiert sich für Technik und möchte wissen, was man im Beruf **Mechatronik** tut. Ihr Onkel arbeitet inzwischen in **Wien**, und Nele überlegt, später auch einmal im Ausland zu arbeiten. In der Schule kündigt die Lehrerin einen **Besuch der Berufsberatung** an.",
      steps: [
        {
          question: "Wo findet Nele schnell Informationen zu Tätigkeiten, Anforderungen und Ausbildung in diesem Beruf?",
          options: [
            "In BERUFENET, dem Online-Nachschlagewerk der Bundesagentur.",
            "In der Arbeitsmarktstatistik der Bundesagentur, die monatlich die Zahl der Arbeitslosen angibt.",
            "Bei EURES, das Berufe in Deutschland mit ihren Anforderungen beschreibt.",
          ],
          answer: 0,
          explanation:
            "BERUFENET beschreibt Berufe mit Tätigkeiten, Anforderungen und Ausbildungswegen. Die Statistik zeigt nur Zahlen, EURES richtet sich auf Arbeit in Europa.",
        },
        {
          question: "Was ist ein sinnvoller nächster Schritt, um herauszufinden, welche Berufe zu ihr passen?",
          options: [
            "Erst nach der Ausbildung zur Beratung gehen, weil vorher niemand zuständig ist.",
            "Einen Beratungstermin vereinbaren und ihre Interessen und Stärken besprechen.",
            "Auf die Arbeitslosmeldung warten, weil danach die Beratung automatisch beginnt.",
          ],
          answer: 1,
          explanation: "Die Berufsberatung richtet sich schon an Schülerinnen und Schüler und hilft bei der Orientierung vor der Entscheidung.",
        },
        {
          question: "Neles Onkel arbeitet in Wien. Wohin kann sie sich später wenden, wenn sie in Europa arbeiten möchte?",
          options: [
            "An die Botschaft des Ziellandes, denn die Bundesagentur ist für Stellen im Ausland nie zuständig.",
            "An die Industrie- und Handelskammer, die alle Stellen im Ausland verteilt.",
            "An EURES, das über Stellen und Arbeitsbedingungen in europäischen Ländern informiert.",
          ],
          answer: 2,
          explanation: "EURES ist das europäische Netzwerk der Arbeitsverwaltungen. Die BA weist dort auf Möglichkeiten in Europa hin.",
        },
      ],
      verdict:
        "Nele nutzt das regionale Angebot der BA: BERUFENET zum Nachlesen, die Berufsberatung für das persönliche Gespräch und EURES für Möglichkeiten in Europa. So bereitet sie ihre Berufsentscheidung gut vor.",
    },
    tasks: {
      1: {
        prompt:
          "Stelle die vier Schwerpunktaktivitäten der Bundesagentur für Arbeit dar und erkläre, welche davon für dich in der 8. Klasse am wichtigsten sind.",
        hints: ["Denke an Beraten, Vermitteln, Absichern und Fördern sowie Beobachten.", "Was brauchst du jetzt für deine Berufswahl?"],
        model:
          "Die BA berät zu Beruf und Weiterbildung und vermittelt Ausbildungs- und Arbeitsstellen. Sie zahlt bei Arbeitslosigkeit Arbeitslosengeld, fördert berufliche Weiterbildung und beobachtet den Arbeitsmarkt. Für mich sind jetzt die Berufsberatung und die Vermittlung am wichtigsten, weil ich Ausbildungsberufe kennenlernen und später einen Ausbildungsplatz finden möchte.",
        criteria: [
          "Nennt die vier Schwerpunktaktivitäten",
          "Wählt eine oder zwei Aufgaben für sich aus",
          "Begründet die Wahl mit der eigenen Berufswahl",
        ],
      },
      2: {
        prompt:
          "Viele Betriebe suchen Fachkräfte, und gleichzeitig sind Menschen arbeitslos. Beurteile, warum die Bundesagentur für Arbeit für die Gesellschaft wichtig ist.",
        hints: ["Welche Aufgabe verbindet Stellen und Bewerber?", "Wie kann Weiterbildung helfen, wenn Qualifikation und Stelle nicht zusammenpassen?"],
        model:
          "Wenn Betriebe Stellen nicht besetzen können und zugleich Menschen Arbeit suchen, hilft die BA beim Zusammenführen: Sie vermittelt und prüft, wer zu welcher Stelle passt. Passt die Qualifikation nicht, kann sie zur Weiterbildung beraten und diese fördern, damit Menschen neue Chancen bekommen. So verkürzt sie Arbeitslosigkeit und hilft Betrieben, Fachkräfte zu finden. Zusätzlich sichert sie Arbeitslose finanziell ab, damit sie in Ruhe suchen können.",
        criteria: [
          "Nennt Vermittlung und Weiterbildung als Beitrag der BA",
          "Erklärt, wie das Arbeitslosigkeit und Fachkräftemangel zugleich verringern kann",
          "Begründet ein Urteil zur Bedeutung der BA für die Gesellschaft",
        ],
      },
    },
  },

  {
    id: "bw-wege",
    lb: 5,
    unit: "5",
    title: "Aus- und Weiterbildungswege",
    intro: "Nach dem Mittleren Schulabschluss stehen viele Wege offen. Wie man sie nach eigenen Kriterien vergleicht.",
    paragraphs: [
      "Nach dem Mittleren Schulabschluss gibt es mehrere Wege. In der **dualen Ausbildung** lernt man im Betrieb und in der Berufsschule, erhält eine Ausbildungsvergütung und schließt mit einem anerkannten Beruf ab. Sie dauert meist zwei bis drei Jahre, in einigen Berufen dreieinhalb. Bei der **schulischen Ausbildung**, etwa an einer Berufsfachschule, lernt man überwiegend in der Schule und macht Praktika im Betrieb. Eine Vergütung gibt es dabei oft nicht.",
      "Wer studieren möchte, kann nach der Mittleren Reife die **Fachoberschule (FOS)** besuchen. Nach der 12. Jahrgangsstufe erreicht man die Fachhochschulreife für Hochschulen für angewandte Wissenschaften, mit der 13. Klasse auch die fachgebundene oder allgemeine Hochschulreife. Wer schon eine Ausbildung hat, kann an der **Berufsoberschule (BOS)** zur Hochschulreife kommen. Beim **dualen Studium** wechseln sich Hochschule und Praxisphasen im Betrieb ab, meist mit Vergütung. Meister, Fachwirte und Techniker dürfen in Bayern nach einem Beratungsgespräch an der Hochschule studieren, auch mit Ausbildung und Berufserfahrung ist ein Studium unter weiteren Bedingungen möglich.",
      "Lernen endet nicht mit dem Abschluss. **Weiterbildung** hält das Wissen aktuell oder führt weiter nach oben. Eine Anpassungsfortbildung erweitert das Können im Beruf, etwa für eine neue Maschine. Eine **Aufstiegsfortbildung**, etwa zur Meisterin, zum Fachwirt oder zum staatlich geprüften Techniker, führt zu höherer Qualifikation, mehr Verantwortung und oft besseren Verdienstmöglichkeiten. Viele Wege sind nicht endgültig: Wer mit einer Ausbildung beginnt, kann später weiterlernen oder aufsteigen.",
      "Wie vergleicht man die Wege? Hilfreich sind **Kriterien**. **Sicherheit**: Wie krisenfest ist der Beruf, wie gut sind die Übernahmechancen? **Anforderungsprofil**: Welchen Abschluss und welche Fähigkeiten verlangt der Weg, und passen sie zu mir? **Zukunftsperspektive**: Wird der Beruf gebraucht, wie verändert ihn die Digitalisierung, welche Aufstiegsmöglichkeiten gibt es? **Einkommen**: Was verdient man während und nach der Ausbildung, und wie lange dauert es bis dahin? In BERUFENET findest du Angaben dazu. Jeder gewichtet anders, wichtig ist die Begründung.",
    ],
    terms: [
      { term: "Duale Ausbildung", text: "Ausbildung an zwei Lernorten, im Betrieb und in der Berufsschule, mit Ausbildungsvergütung." },
      { term: "Fachoberschule (FOS)", text: "Eine Schule nach dem Mittleren Schulabschluss, die nach der 12. Jahrgangsstufe zur Fachhochschulreife führt." },
      { term: "Duales Studium", text: "Ein Studium, das Lernphasen an der Hochschule mit Praxisphasen in einem Betrieb verbindet." },
      {
        term: "Aufstiegsfortbildung",
        text: "Eine Weiterbildung nach der Ausbildung, die zu einem höheren Abschluss führt, zum Beispiel Meister, Fachwirt oder Techniker.",
      },
    ],
    law: [
      {
        ref: "§ 1 BBiG",
        text: "Berufsbildung umfasst die Berufsausbildungsvorbereitung, die Berufsausbildung, die berufliche Fortbildung und die Umschulung. Fortbildung soll das berufliche Können erhalten, anpassen oder zum Aufstieg führen.",
        url: "https://www.gesetze-im-internet.de/bbig_2005/__1.html",
      },
    ],
    takeaway:
      "Nach dem Mittleren Schulabschluss führen duale und schulische Ausbildung, weiterführende Schulen und später Studium oder Weiterbildung zu Berufen. Man bewertet sie nach Sicherheit, Anforderungsprofil, Zukunftsperspektive und Einkommen.",
    sourceIds: ["lp", "bbig", "berufenet"],
    quiz: {
      question: "Was kennzeichnet die duale Ausbildung?",
      answer: "Die Auszubildenden lernen im Betrieb und in der Berufsschule und erhalten eine Ausbildungsvergütung.",
      wrong: [
        "Die Auszubildenden lernen überwiegend in einer Vollzeitschule und erhalten meist keine Vergütung.",
        "Die Auszubildenden studieren an einer Hochschule und arbeiten in den Semesterferien im Betrieb.",
      ],
      explanation:
        "Dual heißt zwei Lernorte: Betrieb und Berufsschule, mit Vergütung. Die Vollzeitschule beschreibt die schulische Ausbildung, das Studium mit Praxisphasen das duale Studium.",
    },
    workshop: {
      kind: "classify",
      title: "Welcher Weg ist das?",
      instruction: "Ordne jede Beschreibung dem passenden Aus- oder Weiterbildungsweg zu.",
      categories: ["Duale Ausbildung", "Schulische Ausbildung", "Weiterführende Schule", "Studium (auch dual)"],
      entries: [
        {
          text: "Ben lernt drei Tage pro Woche in einer Schreinerei und zwei Tage in der Berufsschule und erhält jeden Monat eine Vergütung.",
          target: 0,
          feedback: "Betrieb und Berufsschule mit Vergütung: Das ist duale Ausbildung.",
        },
        {
          text: "Aylin besucht in Vollzeit eine Berufsfachschule, macht Praktika und schließt als staatlich geprüfte Kinderpflegerin ab.",
          target: 1,
          feedback: "Überwiegend Schule mit Praktika: Das ist eine schulische Ausbildung.",
        },
        {
          text: "Nach der Mittleren Reife besucht Tom die Fachoberschule, um die Fachhochschulreife zu erwerben.",
          target: 2,
          feedback: "Die Fachoberschule ist eine weiterführende Schule und führt zur Fachhochschulreife.",
        },
        {
          text: "Lea wechselt zwischen Vorlesungen an der Hochschule und Praxisphasen in einem Unternehmen, das sie bezahlt.",
          target: 3,
          feedback: "Hochschule im Wechsel mit Praxis im Betrieb: Das ist ein duales Studium.",
        },
        {
          text: "Mia hat eine abgeschlossene Ausbildung und besucht die Berufsoberschule, um die Hochschulreife zu erreichen.",
          target: 2,
          feedback: "Die Berufsoberschule baut auf einer Ausbildung auf und ist eine weiterführende Schule.",
        },
        {
          text: "Jonas studiert an einer Universität Mathematik und hat keine Praxisphasen im Betrieb.",
          target: 3,
          feedback: "Ein Studium an der Universität setzt eine Hochschulzugangsberechtigung voraus.",
        },
      ],
      conclusion: "Jeder Weg hat andere Lernorte, Dauer und Abschlüsse. Deshalb lohnt sich der Vergleich nach Kriterien.",
    },
    casework: {
      title: "Linas Entscheidung",
      story:
        "Lina (16) steht kurz vor dem **Mittleren Schulabschluss**. Sie arbeitet gern am Computer, möchte bald **eigenes Geld verdienen** und vielleicht später **studieren**. Zur Wahl stehen eine **duale Ausbildung zur Fachinformatikerin** und die **Fachoberschule**.",
      steps: [
        {
          question: "Welcher Weg bringt Lina am schnellsten ein eigenes Einkommen?",
          options: [
            "Die duale Ausbildung, weil sie dort schon eine Vergütung erhält.",
            "Die Fachoberschule, weil Schülerinnen dort ein Gehalt bekommen.",
            "Beide gleich, denn Einkommen gibt es in jeder Ausbildungsform.",
          ],
          answer: 0,
          explanation: "In der dualen Ausbildung wird eine Vergütung gezahlt. Wer die Fachoberschule besucht, verdient in dieser Zeit in der Regel nichts.",
        },
        {
          question: "Welches Kriterium spricht für die Fachoberschule, wenn Lina später studieren möchte?",
          options: [
            "Sicherheit: Sie erhält dort einen Arbeitsvertrag und ist abgesichert.",
            "Zukunftsperspektive: Sie erwirbt die Fachhochschulreife und damit den Zugang zu Hochschulen für angewandte Wissenschaften.",
            "Einkommen: Schülerinnen der Fachoberschule verdienen mehr als Auszubildende.",
          ],
          answer: 1,
          explanation: "Die Fachhochschulreife öffnet den Weg ins Studium. Das ist ein Argument für die Zukunftsperspektive.",
        },
        {
          question: "Lina entscheidet sich für die Ausbildung. Ist ein späteres Studium damit ausgeschlossen?",
          options: [
            "Ja, wer eine Ausbildung macht, kann nie mehr studieren.",
            "Ja, ein Studium ist nur direkt nach der Schule möglich.",
            "Nein, sie kann später weiterlernen, etwa über Fortbildung oder mit Hochschulzugang auch im Studium.",
          ],
          answer: 2,
          explanation:
            "Viele Wege sind nicht endgültig. Nach der Ausbildung gibt es Fortbildungen, und mit entsprechendem Hochschulzugang, etwa über die Berufsoberschule, auch ein Studium.",
        },
      ],
      verdict:
        "Für schnelles Einkommen und Praxis spricht die duale Ausbildung, für den direkten Weg zu den Hochschulen die Fachoberschule. Lina gewichtet ihre Kriterien selbst, und die Entscheidung bleibt nicht endgültig.",
    },
    tasks: {
      1: {
        prompt: "Erkläre den Unterschied zwischen dualer und schulischer Ausbildung und nenne zu jeder Form einen Vorteil.",
        hints: ["An welchen Lernorten wird gelernt?", "Wie ist es bei Vergütung und Praxisanteil?"],
        model:
          "In der dualen Ausbildung lernt man im Betrieb und in der Berufsschule und erhält dafür eine Vergütung. Ein Vorteil ist der hohe Praxisanteil mit eigenem Einkommen. In der schulischen Ausbildung lernt man überwiegend in der Schule, zum Beispiel an einer Berufsfachschule, und macht Praktika im Betrieb. Ein Vorteil ist, dass man nicht auf einen Ausbildungsbetrieb angewiesen ist und den Beruf systematisch in der Schule lernt.",
        criteria: [
          "Nennt die Lernorte beider Ausbildungsformen",
          "Erklärt den Unterschied bei Vergütung oder Praxisanteil",
          "Nennt für jede Form einen Vorteil",
        ],
      },
      2: {
        prompt:
          "Max (15) interessiert sich für Elektrotechnik und überlegt, entweder eine duale Ausbildung als Elektroniker zu machen oder zur Fachoberschule zu gehen. Beurteile beide Wege nach Sicherheit, Anforderungsprofil, Zukunftsperspektive und Einkommen und gib eine begründete Empfehlung.",
        hints: ["Gehe die vier Kriterien einzeln durch.", "Welches Kriterium könnte für Max besonders wichtig sein, und warum?"],
        model:
          "Die Ausbildung bietet oft gute Sicherheit, weil technische Berufe gefragt sind, und Max verdient früh. Das Anforderungsprofil verlangt technisches Verständnis, das er mitbringt. Die Fachoberschule verlängert den Weg ohne Einkommen, öffnet aber den Weg zum Studium. Will Max schnell Geld verdienen und praktisch lernen, empfehle ich die Ausbildung; die Weiterbildung zum Techniker oder Meister bleibt später möglich. Will er direkt studieren, ist die Fachoberschule der kürzere Weg.",
        criteria: [
          "Wendet alle vier Kriterien auf beide Wege an",
          "Gewichtet ein Kriterium und begründet das",
          "Spricht eine begründete Empfehlung aus",
        ],
      },
    },
  },

  {
    id: "bw-entscheidung",
    lb: 5,
    unit: "5",
    title: "Berufswahl als Entscheidungsprozess",
    intro: "Berufswahl ist keine Bauchentscheidung. Mit Kriterien und der Nutzwertanalyse kann man sie vorbereiten.",
    paragraphs: [
      "Berufswahl ist kein Zufall, sondern ein **Entscheidungsprozess** in Schritten. Zuerst erkundet man sich selbst: Was interessiert mich, was kann ich, was ist mir wichtig? Dabei helfen Zeugnisse, Rückmeldungen von Lehrkräften und Familie, Hobbys und Erfahrungen aus einem **Betriebspraktikum**. Dann informiert man sich über Berufe, etwa in BERUFENET, im Berufsinformationszentrum oder im Gespräch mit Beschäftigten. Erst danach vergleicht man und entscheidet. Wer eine Etappe überspringt, entscheidet oft aus dem Bauch.",
      "Ein wichtiges Hilfsmittel sind **Stellenanzeigen**. Sie zeigen das **Anforderungsprofil**: Welchen Abschluss, welche Noten, Fähigkeiten und **Schlüsselqualifikationen** wünscht sich der Betrieb? Schlüsselqualifikationen sind Fähigkeiten, die in vielen Berufen gebraucht werden, etwa Teamfähigkeit, Kommunikationsfähigkeit und Lernbereitschaft. Vergleiche das Profil mit deinem eigenen: Wo passt es schon, wo gibt es eine Lücke? Aus einer Lücke wird ein **Entwicklungsziel**, etwa: „Bis zum Halbjahr verbessere ich meine Note in Mathematik um eine Stufe.“",
      "Um mehrere Möglichkeiten fair zu vergleichen, eignet sich die **Nutzwertanalyse**. Man legt Kriterien fest und **gewichtet** sie: Was ist mir wie wichtig? Dann **bewertet** man jede Möglichkeit je Kriterium mit Punkten, multipliziert mit dem Gewicht und addiert zum **Gesamtwert**. Erfundenes Beispiel (Beispielwerte, keine Statistik): Interesse zählt 2, Einkommen 1. Beruf A erhält 4 und 1 Punkte: 2·4 + 1·1 = 9. Beruf B erhält 2 und 4 Punkte: 2·2 + 1·4 = 8. A liegt knapp vorn.",
      "Die Nutzwertanalyse hat **Grenzen**. Gewichte und Punkte sind persönliche Schätzungen, und wer andere Gewichte wählt, bekommt ein anderes Ergebnis. Nicht alles lässt sich in Zahlen fassen, und wichtige Kriterien können fehlen. Das Ergebnis wirkt genauer, als es ist, und ist deshalb eine Denkhilfe, keine Entscheidung. In der Simulation mit erfundenen Berufsfeldern siehst du den gewichteten Durchschnitt, also den Gesamtwert geteilt durch die Summe der Gewichte. Setze zuerst alle Gewichte gleich und ändere dann nur eines. Prüfe dein Ergebnis anschließend in der Wirklichkeit, etwa mit einem Praktikum.",
    ],
    terms: [
      {
        term: "Anforderungsprofil",
        text: "Die Abschlüsse, Fähigkeiten und Eigenschaften, die ein Betrieb für eine Stelle oder einen Ausbildungsplatz verlangt.",
      },
      { term: "Schlüsselqualifikation", text: "Eine Fähigkeit, die in vielen Berufen gebraucht wird, zum Beispiel Teamfähigkeit oder Kommunikationsfähigkeit." },
      {
        term: "Nutzwertanalyse",
        text: "Ein Verfahren, bei dem Möglichkeiten nach gewichteten Kriterien bewertet und über einen Gesamtwert verglichen werden.",
      },
      {
        term: "Entwicklungsziel",
        text: "Ein konkretes, überprüfbares Ziel, mit dem man eine eigene Lücke zum Anforderungsprofil schließen will.",
      },
    ],
    takeaway:
      "Berufswahl läuft in Schritten ab: sich erkunden, informieren, Kriterien gewichten, bewerten und entscheiden. Die Nutzwertanalyse hilft dabei, ist aber nur so gut wie die persönlichen Gewichte und Punkte.",
    sourceIds: ["lp", "berufenet", "ba"],
    quiz: {
      question: "Warum können zwei Personen mit denselben Punkten bei einer Nutzwertanalyse verschiedene Sieger bekommen?",
      answer: "Sie gewichten die Kriterien verschieden: Was einem wichtiger ist, zählt im Gesamtwert stärker.",
      wrong: [
        "Das Einkommen zählt bei jeder Person am meisten und entscheidet allein über den Sieger.",
        "Jede Person rechnet mit einer anderen Formel, deshalb kommen unterschiedliche Ergebnisse heraus.",
      ],
      explanation:
        "Die Rechenregel ist für alle gleich, die Gewichte aber nicht. Wer das Interesse stärker gewichtet als das Einkommen, kommt zu einem anderen Sieger als jemand mit umgekehrten Prioritäten.",
    },
    lab: "nutzwert",
    workshop: {
      kind: "classify",
      title: "Was gehört wohin im Entscheidungsprozess?",
      instruction: "Ordne jede Aussage dem passenden Baustein der Berufswahl zu.",
      categories: ["Eigenes Interesse", "Eigene Kompetenz", "Anforderung der Stelle", "Entwicklungsziel"],
      entries: [
        {
          text: "Ich schaue in meiner Freizeit am liebsten Videos über Motoren und finde Technik spannend.",
          target: 0,
          feedback: "Was einen begeistert und womit man sich freiwillig beschäftigt, zeigt die eigenen Interessen.",
        },
        {
          text: "In Mathematik stehe ich seit zwei Schuljahren auf einer Zwei, und Zahlen fallen mir leicht.",
          target: 1,
          feedback: "Das beschreibt eine Fähigkeit, die sich in Noten belegen lässt: eine Kompetenz.",
        },
        {
          text: "Gesucht: Auszubildende mit mittlerem Schulabschluss, Teamfähigkeit und technischem Verständnis.",
          target: 2,
          feedback: "Das verlangt der Betrieb in der Stellenanzeige: das Anforderungsprofil.",
        },
        {
          text: "Bis zum Halbjahr absolviere ich ein Praktikum in einer Werkstatt und verbessere meine Note in Physik.",
          target: 3,
          feedback: "Das Ziel ist konkret, hat einen Termin und lässt sich überprüfen: ein Entwicklungsziel.",
        },
        {
          text: "Die Stellenanzeige verlangt Kundenfreundlichkeit und Sorgfalt im Umgang mit Zahlen.",
          target: 2,
          feedback: "Auch das sind Erwartungen des Betriebs und gehören zum Anforderungsprofil.",
        },
        {
          text: "Als Klassensprecherin habe ich gelernt, Streit zu schlichten und Gruppen zu organisieren.",
          target: 1,
          feedback: "Durch Erfahrung erworbene Fähigkeiten gehören zu den eigenen Kompetenzen.",
        },
      ],
      conclusion: "Wer Interessen und Kompetenzen kennt und mit dem Anforderungsprofil vergleicht, kann Entwicklungsziele gezielt formulieren.",
    },
    casework: {
      title: "Felix und die Gewichte",
      story:
        "Felix (15) schwankt zwischen einer Ausbildung im **Gartenbau** und in der **Informatik**. Er bewertet beide von 1 bis 5 Punkten: Gartenbau erhält Interesse **5** und Einkommen **2**, Informatik erhält Interesse **3** und Einkommen **5**. Für Felix zählt das Interesse mit Gewicht **4** und das Einkommen mit Gewicht **1**.",
      steps: [
        {
          question: "Welchen Gesamtwert erreicht der Gartenbau mit Felix’ Gewichten?",
          options: ["22 (4·5 + 1·2)", "7 (5 + 2)", "10 (5·2)"],
          answer: 0,
          explanation: "Jedes Kriterium wird mit seinem Gewicht multipliziert: 4·5 = 20 und 1·2 = 2, zusammen 22.",
        },
        {
          question: "Welcher Beruf liegt mit Felix’ Gewichten vorn?",
          options: [
            "Informatik, weil sie das höhere Einkommen hat.",
            "Gartenbau mit 22 gegen 17 Punkten für die Informatik.",
            "Beide liegen gleichauf, weil sie gleich viele Punkte vergeben haben.",
          ],
          answer: 1,
          explanation: "Informatik erreicht 4·3 + 1·5 = 17, Gartenbau 22. Das Interesse zählt bei Felix stärker.",
        },
        {
          question: "Felix’ Eltern gewichten das Einkommen mit 4 und das Interesse mit 1. Was ergibt sich?",
          options: [
            "Der Gartenbau liegt weiter vorn, weil sich seine Bewertungen nicht ändern.",
            "Es gibt keinen Sieger, weil Gesamtwerte verschiedener Personen nicht verglichen werden dürfen.",
            "Die Informatik liegt vorn (23 gegen 13): Der Sieger hängt von den Gewichten ab.",
          ],
          answer: 2,
          explanation:
            "Informatik: 1·3 + 4·5 = 23, Gartenbau: 1·5 + 4·2 = 13. Dieselben Punkte führen mit anderen Gewichten zu einem anderen Sieger.",
        },
        {
          question: "Was sollte Felix nach der Rechnung tun?",
          options: [
            "Das Ergebnis als endgültig ansehen, weil Zahlen nicht irren.",
            "Das Ergebnis als Denkhilfe nehmen, seine Gewichte überprüfen und möglichst in beiden Bereichen ein Praktikum machen.",
            "Die Gewichte so lange ändern, bis der Beruf gewinnt, den die Eltern wollen.",
          ],
          answer: 1,
          explanation: "Punkte und Gewichte sind Schätzungen. Ein Praktikum zeigt, ob der Beruf im Alltag wirklich passt.",
        },
      ],
      verdict:
        "Mit Felix’ Gewichten gewinnt der Gartenbau, mit denen seiner Eltern die Informatik. Die Nutzwertanalyse macht Prioritäten sichtbar, ersetzt aber weder eigenes Urteil noch ein Praktikum.",
    },
    tasks: {
      1: {
        prompt: "Beschreibe die Schritte einer Nutzwertanalyse für die Berufswahl und erkläre, wozu das Gewichten der Kriterien dient.",
        hints: ["Welche Schritte folgen auf das Festlegen der Kriterien?", "Warum bekommen nicht alle Kriterien dasselbe Gewicht?"],
        model:
          "Zuerst legt man Kriterien fest, zum Beispiel Interesse, Einkommen und Sicherheit. Dann gewichtet man sie nach der persönlichen Wichtigkeit und bewertet jeden Beruf je Kriterium mit Punkten. Die Punkte werden mit dem Gewicht multipliziert und addiert, und der Beruf mit dem höchsten Gesamtwert liegt vorn. Das Gewichten sorgt dafür, dass wichtige Kriterien stärker zählen als unwichtige, denn nicht jedem ist dasselbe wichtig.",
        criteria: [
          "Nennt die Schritte Kriterien festlegen, gewichten, bewerten und zusammenrechnen",
          "Erklärt, dass der höchste Gesamtwert den Sieger bestimmt",
          "Begründet, wozu das Gewichten dient",
        ],
      },
      2: {
        prompt:
          "Eine Mitschülerin sagt: „Meine Nutzwertanalyse hat ergeben, dass ich Bürokauffrau werden muss.“ Nimm Stellung und nenne mindestens zwei Grenzen des Verfahrens.",
        hints: ["Wer legt Kriterien, Gewichte und Punkte fest?", "Was lässt sich schwer in Zahlen fassen, und wie kann man das Ergebnis prüfen?"],
        model:
          "Die Aussage geht zu weit. Das Ergebnis ist nur so gut wie die Kriterien, Gewichte und Punkte, die sie selbst geschätzt hat, und mit anderen Gewichten könnte ein anderer Beruf vorn liegen. Außerdem können wichtige Kriterien fehlen, und manches, etwa ob die Arbeit im Alltag Freude macht, lässt sich schwer in Zahlen fassen. Sie sollte die Rechnung als Denkhilfe nutzen und mit einem Praktikum prüfen, ob der Beruf wirklich passt.",
        criteria: [
          "Nennt mindestens zwei Grenzen der Nutzwertanalyse",
          "Erklärt, wie die Gewichte das Ergebnis beeinflussen",
          "Schlägt einen Weg vor, das Ergebnis zu überprüfen",
        ],
      },
    },
  },

  {
    id: "bw-praktikum", lb: 5, unit: "5", title: "Ein Betriebspraktikum vorbereiten",
    intro: "Plane die Suche vom Berufsfeld bis zum ersten Tag und formuliere eine kurze, passende Anfrage an einen Betrieb.",
    paragraphs: [
      "Beginne mit einem **Erkundungsziel**: Was willst du über einen Beruf erfahren? Wenn dich Fahrradtechnik interessiert, kannst du beispielsweise wissen wollen, wie ein Reparaturauftrag von der Annahme zur Kontrolle gelangt. Kläre mit der Schule Zeitraum, Formulare und Vorgaben. Suche dann Betriebe, bei denen du die gesuchte Tätigkeit beobachten kannst.",
      "Recherchiere Kontaktperson und Aufgaben. Frage höflich, ob ein **Schülerbetriebspraktikum** im gewünschten Zeitraum möglich ist. In eine Kurzbewerbung gehören Anlass, Zeitraum, ein konkreter Grund für diesen Betrieb und Angaben zu verlangten Anlagen. Gib nur notwendige Daten über einen geeigneten Weg weiter und speichere den Stand deiner Anfragen.",
      "Kläre vor Beginn Ansprechperson, Arbeitsort, Ankunftszeit, Kleidung und Sicherheitsregeln. Für ein Schulpraktikum gelten die einschlägigen Schutzvorschriften. § 5 Abs. 2 JArbSchG erlaubt das Betriebspraktikum während der Vollzeitschulpflicht unter Bedingungen. Die Beschäftigung muss für Kinder leicht und geeignet sein und darf dabei höchstens sieben Stunden täglich und 35 Stunden wöchentlich dauern (§ 7 Satz 1 Nr. 2 entsprechend).",
    ],
    terms: [term("Erkundungsziel", "Eine konkrete Frage, die du durch Beobachtung oder ein Gespräch klären möchtest."), term("Kurzbewerbung", "Knappes Anschreiben mit Wunschtermin, begründetem Interesse und erforderlichen Angaben.")],
    visual: { title: "Dein Weg zum Praktikum", steps: ["Ziel und Schultage klären", "Betriebe vergleichen", "Gezielt anfragen", "Ersten Tag und Sicherheit klären"] },
    takeaway: "Wähle einen Betrieb passend zu deinem Erkundungsziel. Kläre Termin und Anforderungen früh und bestätige die Absprachen vor dem ersten Tag.",
    sourceIds: ["lp", "ba", "berufenet", "jarbschg"],
    law: [{ ref: "§ 5 Abs. 2 in Verbindung mit § 7 Satz 1 Nr. 2 JArbSchG", text: "Ein Betriebspraktikum während der Vollzeitschulpflicht ist mit besonderen Schutzbedingungen möglich." }],
    quiz: check("Welche Information gehört in die erste gezielte Anfrage?", "Zeitraum des Praktikums und konkreter Grund für die Wahl des Betriebs", ["Private Ausweisdaten und die vollständigen Schulnoten", "Nur die Bitte um einen Platz ohne Zeitraum oder Angabe zum Interesse"], "Ein Betrieb braucht den Zeitraum und sollte erkennen, warum seine Tätigkeiten zur Anfrage passen."),
    workshop: sort("Vor oder nach einer Zusage?", "Ordne nach dem sinnvollsten Zeitpunkt im beschriebenen Ablauf.", ["Vor der Anfrage", "Nach der Zusage"], [
      ["Bei der Schule die Praktikumswoche und Vorgaben erfragen.", 0, "Der Betrieb braucht in der Anfrage den richtigen Zeitraum."],
      ["Die Uhrzeit und den Treffpunkt für den ersten Tag bestätigen.", 1, "Diese Details klärst du, wenn der Platz vereinbart ist."],
      ["Prüfen, welche Arbeiten der ausgewählte Betrieb anbietet.", 0, "Die Tätigkeit sollte zu deiner Frage und deinen Interessen passen."],
      ["Erfragen, welche Kleidung und Schutzausrüstung vor Ort nötig sind.", 1, "So bereitest du dich konkret auf den ersten Tag vor."],
    ], "Kläre zuerst, wohin und warum du möchtest. Stimme danach die Durchführung ab."),
    casework: { title: "Anfrage in der Fahrradwerkstatt", story: "Jona bastelt gern an Fahrrädern und will wissen, wie Mechaniker Fehler suchen. Die Schule hat die Praktikumswoche festgelegt. Eine Werkstatt im Ort bietet Reparaturen und Wartungen an.", steps: [
      decide("Welches Ziel passt zu Jonas Interesse?", "Am Beispiel einer Wartung beobachten, wie die Werkstatt einen Fehler findet.", "Allgemein herausfinden, ob irgendein Betrieb ausbildet.", "Das konkrete Ziel kann er im Betrieb durch Fragen und Beobachtung verfolgen."),
      decide("Was gehört in die Kurzanfrage?", "Zeitraum, Interesse an der Fehlersuche und die höfliche Bitte um Rückmeldung.", "Eine unpersönliche Nachricht ohne Angaben zur Praktikumswoche.", "Eine präzise Anfrage erleichtert der Werkstatt die Entscheidung."),
      decide("Was klärt Jona nach der Zusage?", "Treffpunkt, Ansprechperson und Sicherheitsregeln.", "Dass er ohne Einweisung jede Maschine bedienen darf.", "Vor dem Einsatz müssen geeignete Tätigkeiten und Sicherheitsregeln feststehen."),
    ], verdict: "Jonas Anfrage erklärt, was er lernen möchte. Die tatsächliche Recherche und verbindliche Vereinbarung trifft er mit Betrieb und Schule." },
    tasks: {
      1: write("Schreibe eine kurze Anfrage an die Fahrradwerkstatt für die fiktive Praktikumswoche vom 3. bis 7. Mai.", ["Nenne Zeitraum und Klasse.", "Begründe die Wahl mit einer Tätigkeit der Werkstatt."], "Guten Tag, ich gehe in die 8. Klasse einer Realschule und suche vom 3. bis 7. Mai einen Platz für mein Schulpraktikum. Ich repariere gern Fahrräder und möchte erfahren, wie Ihre Werkstatt Fehler bei Wartungen findet. Ist in dieser Woche ein Praktikum möglich? Über eine Rückmeldung freue ich mich.", ["Zeitraum und Anlass", "Bezug zur Werkstatt", "Höfliche Anfrage"]),
      2: write("Wähle für dich zwei mögliche Betriebe und erstelle einen Platzsuchplan mit einem Ersatztermin für die Rückfrage.", ["Vergleiche Tätigkeit und Erreichbarkeit.", "Formuliere eine Frage, die du vor dem ersten Tag klärst."], "Muster für ein Erkundungsziel: Ich möchte Reparatur und Kundenkontakt kennenlernen. Ich vergleiche einen Fahrradladen mit einer Elektrogerätewerkstatt nach Aufgaben und Anfahrt. Nach Bestätigung der Schulwoche frage ich zuerst im Fahrradladen an. Ohne Rückmeldung hake ich nach einer Woche höflich nach und prüfe dann die zweite Möglichkeit.", ["Zwei verglichene Möglichkeiten", "Reihenfolge und Rückfrage", "Eigenes Erkundungsziel"]),
    },
  },
];
