import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 5: Das Imperium Romanum. */
export const rome: Lesson[] = [
  {
    id: "g6-rom-anfaenge",
    lb: 5,
    title: "Von der Sage zur Weltmacht",
    period: "753 v. Chr. mythische Gründung Roms · Aufstieg bis 117 n. Chr.",
    span: [-753, 117],
    intro:
      "Eine Wölfin, zwei Zwillinge und ein Brudermord: So erzählten die Römer ihre Anfänge. Aus einem Dorf am Tiber wurde ein Weltreich.",
    paragraphs: [
      "Nach der Sage setzte man die Zwillinge Romulus und Remus, Söhne des Kriegsgottes Mars, am Tiber aus. Eine Wölfin säugte sie. Als Erwachsene gründeten sie eine Stadt; im Streit erschlug Romulus seinen Bruder und gab der Stadt seinen Namen. Römische Gelehrte errechneten später das Jahr 753 v. Chr. als Gründungsjahr. Archäologen fanden auf dem Palatinhügel Reste von Hütten, die noch älter sind. Die Sage ist also keine Quelle für die Gründung, wohl aber dafür, wie die Römer sich selbst sahen.",
      "Zuerst herrschten in Rom Könige, zuletzt aus etruskischen Familien. Um 509 v. Chr. vertrieben die Römer, so die Überlieferung, ihren letzten König und gründeten eine Republik. In Kriegen und Bündnissen beherrschte Rom bis etwa 270 v. Chr. fast ganz Italien. Danach kämpfte es in drei Kriegen gegen Karthago in Nordafrika um die Vorherrschaft im westlichen Mittelmeer; 218 v. Chr. zog der Karthager Hannibal mit Elefanten über die Alpen. 146 v. Chr. zerstörten die Römer Karthago.",
      "Rom gewann Gebiet um Gebiet und machte es zu Provinzen. Die Römer nannten das Mittelmeer bald „unser Meer“. Auf Geschichtskarten verschiedener Zeitpunkte siehst du, wie das Reich wuchs: Unter Kaiser Augustus reichte es bis an Rhein und Donau, im Jahr 117 n. Chr. unter Kaiser Trajan hatte es seine größte Ausdehnung, von Britannien bis Mesopotamien. Stelle an jede Karte dieselben Fragen: Welcher Zeitpunkt? Welche Gebiete sind neu? Was liegt außerhalb?",
    ],
    takeaway:
      "753 v. Chr. ist das sagenhafte Gründungsjahr Roms. Nach der Königszeit wurde Rom um 509 v. Chr. Republik und eroberte Italien und den Mittelmeerraum; 117 n. Chr. war das Reich am größten.",
    sourceIds: ["pw-rom", "lehrplan"],
    quiz: check(
      "Was zeigt die Sage von Romulus und Remus vor allem?",
      "Wie die Römer ihre eigene Herkunft deuteten.",
      ["Wann genau die Stadt Rom gegründet wurde.", "Dass Wölfe im alten Italien Kinder aufzogen."],
      [
        "Das Jahr 753 v. Chr. wurde erst viel später errechnet; Funde sind älter.",
        "Die Sage ist eine Erzählung mit Botschaft, kein Bericht über Wölfe.",
      ],
      "Die Römer sahen sich als Nachkommen des Kriegsgottes Mars. Für die Frühzeit sind Funde verlässlicher als die Sage.",
    ),
    workshop: timeline(
      [
        [
          "753 v. Chr.: Romulus gründet nach der Sage die Stadt Rom.",
          "Das Datum wurde später errechnet; die Sage erzählt vom Selbstbild der Römer.",
        ],
        [
          "509 v. Chr.: Die Römer vertreiben ihren letzten König.",
          "Damit beginnt der Überlieferung nach die Republik.",
        ],
        [
          "270 v. Chr.: Rom beherrscht fast ganz Italien.",
          "Mit Siegen und Bündnissen wächst Rom über die Stadt hinaus.",
        ],
        [
          "218 v. Chr.: Hannibal zieht mit Elefanten über die Alpen.",
          "Der Krieg gegen Karthago wird zur größten Gefahr für Rom.",
        ],
        [
          "146 v. Chr.: Die Römer zerstören Karthago.",
          "Rom beherrscht nun das westliche Mittelmeer.",
        ],
        [
          "15 v. Chr.: Römische Truppen erobern das Alpenvorland.",
          "Das heutige Südbayern wird Teil des Reiches.",
        ],
        [
          "117 n. Chr.: Das Reich hat seine größte Ausdehnung.",
          "Unter Kaiser Trajan reicht es von Britannien bis Mesopotamien.",
        ],
      ],
      "Rom wuchs über Jahrhunderte: erst Italien, dann das Mittelmeer, schließlich Gebiete bis Britannien und Mesopotamien.",
    ),
    tasks: {
      1: writing(
        "Erzähle die Sage von der Gründung Roms in drei Sätzen und erkläre, warum sie keine verlässliche Quelle für das Gründungsjahr ist.",
        ["Wer waren Romulus und Remus?", "Wann und von wem wurde das Jahr 753 berechnet?"],
        "Die Zwillinge Romulus und Remus wurden am Tiber ausgesetzt und von einer Wölfin gesäugt. Später gründeten sie eine Stadt, Romulus tötete im Streit seinen Bruder und nannte die Stadt Rom. Die Sage entstand aber erst Jahrhunderte später, und das Jahr 753 v. Chr. haben römische Gelehrte nachträglich errechnet. Funde auf dem Palatin sind sogar älter.",
        ["Sage richtig wiedergegeben", "Spätere Entstehung genannt", "Funde als Gegenbeleg genannt"],
      ),
      2: writing(
        "Schlage in deinem Schulbuch oder Geschichtsatlas zwei Karten auf: Rom um 270 v. Chr. und das Reich im Jahr 117 n. Chr. Um 270 v. Chr. beherrschte Rom Mittel- und Süditalien, 117 n. Chr. reichte das Reich von Britannien bis Mesopotamien. Beschreibe die Veränderung und nenne zwei Ursachen.",
        ["Welche Gebiete kamen dazu?", "Wie gewann Rom diese Gebiete?"],
        "Um 270 v. Chr. beherrschte Rom fast nur Italien. 117 n. Chr. reichte das Reich von Britannien bis Mesopotamien und umfasste alle Küsten des Mittelmeers. Ursachen waren erfolgreiche Kriege, etwa gegen Karthago, und Bündnisse mit anderen Städten und Völkern. Eroberte Gebiete wurden als Provinzen verwaltet und durch Legionen gesichert.",
        ["Veränderung beschrieben", "Zwei Ursachen genannt", "Fachbegriff Provinz verwendet"],
      ),
    },
  },
  {
    id: "g6-republik",
    lb: 5,
    title: "Die römische Republik: Senat, Konsuln und Volk",
    period: "Römische Republik · 509 bis 27 v. Chr.",
    span: [-509, -27],
    intro:
      "Nie wieder ein König: Die Römer verteilten die Macht so, dass kein Einzelner alles bestimmen konnte. Doch wer hatte in der Republik wirklich das Sagen?",
    paragraphs: [
      "Res publica heißt „öffentliche Sache“: Der Staat sollte allen Bürgern gehören, nicht einem König. Die Macht teilten sich mehrere Einrichtungen. An der Spitze standen zwei Konsuln, die das Heer führten und die Regierung leiteten. Wie alle hohen Beamten wurden sie für genau ein Jahr gewählt, und jedes Amt hatten mindestens zwei Männer zugleich. So konnten sie sich gegenseitig kontrollieren. Für einen Notfall durften die Konsuln einen Diktator ernennen, der für höchstens sechs Monate allein entschied.",
      "Am mächtigsten war der Senat, der Rat der ehemaligen Beamten. Seine Mitglieder blieben ein Leben lang Senatoren und stammten meist aus reichen, alten Familien, den Patriziern. Der Senat beriet die Beamten, lenkte die Außenpolitik und die Staatsfinanzen. Die Volksversammlungen wählten die Beamten und stimmten über Gesetze ab, doch die Stimmen der Reichen zählten dort mehr.",
      "Die Mehrheit der Bürger waren Plebejer: Bauern, Handwerker und Händler. In langen Ständekämpfen erstritten sie mehr Rechte. Um 450 v. Chr. wurden die Gesetze auf zwölf Tafeln aufgeschrieben, sodass jeder sie kennen konnte. Volkstribunen schützten die Plebejer: Mit ihrem Einspruch, dem Veto, konnten sie Entscheidungen der Beamten stoppen. Später durften auch Plebejer Konsul werden. Frauen und Sklaven blieben von allen Ämtern ausgeschlossen.",
    ],
    takeaway:
      "In der Republik wurden die Beamten für ein Jahr gewählt und kontrollierten sich gegenseitig; der Senat lenkte die Politik. Plebejer erkämpften Rechte wie geschriebene Gesetze und Volkstribunen.",
    sourceIds: ["pw-rom", "lehrplan"],
    quiz: check(
      "Warum gab es in Rom immer zwei Konsuln, die nur ein Jahr im Amt blieben?",
      "Damit keiner allein und dauerhaft herrschen konnte.",
      ["Damit sie sich Arbeit und Lohn teilen konnten.", "Weil das Heer zwei Anführer verlangte."],
      [
        "Hohe Ämter waren in Rom unbezahlt; es ging um Macht, nicht um Lohn.",
        "Der Grund war politisch: Machtteilung sollte einen neuen König verhindern.",
      ],
      "Kollegialität und kurze Amtszeit sollten verhindern, dass wieder ein König herrschte.",
    ),
    diagram: {
      kind: "pyramid",
      title: "Die Ämterlaufbahn in der Republik",
      layers: [
        { label: "Konsuln", note: "zwei: führen Heer und Regierung" },
        { label: "Prätoren", note: "sprechen Recht, vertreten die Konsuln" },
        { label: "Ädilen", note: "Märkte, Straßen, Spiele" },
        { label: "Quästoren", note: "Staatskasse; Einstieg in die Laufbahn" },
      ],
      caption:
        "Jedes Amt galt für ein Jahr und wurde von mehreren zugleich ausgeübt. Nach den Ämtern zog man in den Senat ein.",
    },
    workshop: classify(
      "Wer macht was in der Republik?",
      ["Senat", "Konsuln", "Volksversammlung", "Volkstribunen"],
      [
        [
          "Berät über Krieg und Frieden und verwaltet die Staatsfinanzen.",
          0,
          "Der Senat lenkte die Außenpolitik und das Geld.",
        ],
        [
          "Führen das Heer und leiten die Regierung für ein Jahr.",
          1,
          "Die beiden Konsuln waren die höchsten Beamten.",
        ],
        [
          "Wählt die Beamten und stimmt über Gesetze ab.",
          2,
          "In der Volksversammlung entschieden die Bürger.",
        ],
        [
          "Können mit einem Veto eine Entscheidung gegen die Plebejer stoppen.",
          3,
          "Die Tribunen waren die Schutzherren der Plebejer.",
        ],
        [
          "Besteht aus ehemaligen Beamten, die lebenslang Mitglied bleiben.",
          0,
          "Erfahrung und Herkunft gaben dem Senat großes Ansehen.",
        ],
      ],
      "Die Macht war verteilt, aber nicht gleich verteilt: Senat und reiche Familien hatten das größte Gewicht.",
    ),
    tasks: {
      1: writing(
        "Erkläre, wie die Römer in der Republik verhindern wollten, dass wieder ein König herrschte. Nenne zwei Regeln.",
        ["Wie lange blieb ein Konsul im Amt?", "Wie viele hatten dasselbe Amt?"],
        "Die Römer wählten alle hohen Beamten nur für ein Jahr, sodass niemand lange an der Macht blieb. Außerdem hatte jedes Amt mindestens zwei Inhaber, die sich gegenseitig kontrollierten, zum Beispiel zwei Konsuln. Ein Diktator durfte nur im Notfall und höchstens sechs Monate allein herrschen.",
        ["Jährliche Amtszeit genannt", "Kollegialität genannt", "Zweck erklärt"],
      ),
      2: writing(
        "Ein Plebejer sagt: „Die Republik gehört nicht uns allen, sondern den Senatoren.“ Hat er recht? Wäge ab.",
        ["Welche Rechte hatten Plebejer erkämpft?", "Wer hatte trotzdem das größte Gewicht?"],
        "Teilweise hat er recht: Der Senat bestand aus reichen Familien und lenkte die Politik, und in der Volksversammlung zählten die Stimmen der Reichen mehr. Andererseits hatten die Plebejer viel erreicht: geschriebene Gesetze auf den zwölf Tafeln, Volkstribunen mit Vetorecht und den Zugang zum Konsulat. Die Republik gehörte also nicht nur den Senatoren, aber die Macht war ungleich verteilt.",
        ["Macht des Senats beschrieben", "Rechte der Plebejer genannt", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g6-caesar-augustus",
    lb: 5,
    title: "Caesar, Augustus und das Ende der Republik",
    period: "1. Jh. v. Chr. · Zeitalter des Augustus um Christi Geburt",
    span: [-100, 14],
    intro:
      "Bürgerkriege, ein Mord im Senat und ein Kaiser, der sich „erster Bürger“ nannte: Im 1. Jahrhundert v. Chr. wurde aus der Republik ein Kaiserreich.",
    paragraphs: [
      "Die Eroberungen machten einige Senatoren sehr reich, viele Kleinbauern aber arm. Feldherren stellten Berufsheere auf, deren Soldaten mehr ihrem Anführer als dem Staat folgten. Im 1. Jahrhundert v. Chr. kämpften solche Feldherren in Bürgerkriegen um die Macht. Gaius Julius Caesar eroberte von 58 bis 50 v. Chr. Gallien, das heutige Frankreich. 49 v. Chr. überschritt er mit seinem Heer den Grenzfluss Rubikon und siegte im Bürgerkrieg. 44 v. Chr. ließ er sich zum Diktator auf Lebenszeit ernennen. Senatoren, die die Republik retten wollten, ermordeten ihn am 15. März 44 v. Chr.",
      "Caesars Großneffe und Adoptivsohn Octavian setzte sich in neuen Bürgerkriegen durch und besiegte 31 v. Chr. seinen Rivalen Antonius. 27 v. Chr. gab er dem Senat feierlich die Macht zurück und erhielt dafür den Ehrennamen Augustus, „der Erhabene“. Er nannte sich Princeps, „erster Bürger“; seine Herrschaft heißt deshalb Prinzipat. Senat, Konsuln und Volksversammlung blieben bestehen. Tatsächlich aber befehligte Augustus die meisten Legionen, verfügte über riesige Geldmittel und bestimmte, wer Ämter erhielt.",
      "Nach Jahrzehnten der Bürgerkriege brachte Augustus Frieden im Inneren, die Pax Augusta. Er ließ Straßen, Tempel und Wasserleitungen bauen und Rom mit Marmor verschönern. Um Christi Geburt lebten die Menschen im Zeitalter des Augustus, der bis zu seinem Tod 14 n. Chr. herrschte. Aus dem Namen Caesar wurde ein Titel für die Herrscher; davon kommt unser Wort „Kaiser“.",
    ],
    takeaway:
      "Im 1. Jahrhundert v. Chr. zerstörten Bürgerkriege die Republik. Caesar wurde Diktator auf Lebenszeit, Augustus begründete 27 v. Chr. als Princeps die Kaiserzeit, hinter einer republikanischen Fassade.",
    sourceIds: ["pw-rom", "res-gestae"],
    quiz: check(
      "Warum nannte sich Augustus „Princeps“, also „erster Bürger“, und nicht König?",
      "Er wollte den Anschein der Republik wahren.",
      ["Der Senat hatte ihm den Königstitel verweigert.", "Er hatte tatsächlich nicht mehr Macht als andere."],
      [
        "Augustus strebte den Königstitel gar nicht an; Könige waren in Rom verhasst.",
        "Er befehligte die meisten Legionen und hatte die eigentliche Macht.",
      ],
      "Nach Caesars Ermordung wusste Augustus: Ein König wäre unerträglich. Er herrschte, ohne es so zu nennen.",
    ),
    workshop: {
      ...classify(
        "Was sagt Augustus, und was wissen wir?",
        ["Steht in der Quelle", "Wissen wir aus anderen Belegen", "Folgt daraus nicht"],
        [
          [
            "Augustus schreibt, er habe alle an Ansehen übertroffen.",
            0,
            "So steht es in seinem Tatenbericht.",
          ],
          [
            "Augustus schreibt, er habe nicht mehr Amtsgewalt gehabt als seine Kollegen.",
            0,
            "Das behauptet er ausdrücklich.",
          ],
          [
            "Augustus befehligte die meisten Legionen des Reiches.",
            1,
            "Das zeigen andere Quellen über die Verteilung der Provinzen und Heere.",
          ],
          [
            "Alle Römer hielten Augustus für einen bescheidenen Mann.",
            2,
            "Die Selbstdarstellung belegt nicht, was andere dachten.",
          ],
          [
            "Senat und Konsuln bestanden unter Augustus weiter.",
            1,
            "Das ist durch viele Quellen belegt; die Einrichtungen blieben, ihre Macht schrumpfte.",
          ],
        ],
        "Augustus stellt sich als Bürger unter Bürgern dar. Andere Belege zeigen, wie groß seine Macht wirklich war.",
      ),
      sourceExcerpt: {
        title: "Tatenbericht des Augustus (Res Gestae), Kapitel 34, Auszug",
        author: "Augustus",
        date: "verfasst bis 14 n. Chr., nach seinem Tod öffentlich aufgestellt",
        audience: "Bürger Roms und der Provinzen; in Erz und Stein öffentlich ausgestellt",
        text: "Seit dieser Zeit übertraf ich alle an Ansehen, an Amtsgewalt aber besaß ich nicht mehr als die anderen, die auch mit mir zusammen ein Amt innehatten.",
        sourceId: "res-gestae",
        context:
          "Übersetzung für diese App aus dem Lateinischen. Augustus ließ seinen Tatenbericht vor seinem Grab aufstellen; Abschriften fand man in Kleinasien. Er zeigt, wie Augustus gesehen werden wollte.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre den Unterschied zwischen dem Diktator Caesar und dem Princeps Augustus.",
        ["Welches Amt ließ Caesar sich geben, und was folgte daraus?", "Wie trat Augustus nach außen auf?"],
        "Caesar ließ sich 44 v. Chr. zum Diktator auf Lebenszeit machen und zeigte offen, dass er allein herrschte. Viele Senatoren sahen darin das Ende der Republik und ermordeten ihn. Augustus herrschte ebenso allein, nannte sich aber nur erster Bürger und ließ Senat und Ämter bestehen. So wahrte er den Anschein der Republik und blieb bis zu seinem Tod an der Macht.",
        ["Caesars offene Alleinherrschaft erklärt", "Augustus’ Auftreten erklärt", "Folge des Unterschieds genannt"],
      ),
      2: writing(
        "Augustus schreibt, er habe nicht mehr Amtsgewalt gehabt als seine Kollegen. Prüfe diese Aussage.",
        ["Wer hat den Text geschrieben und wozu?", "Was wissen wir über seine Legionen und sein Geld?"],
        "Augustus schrieb den Bericht selbst, um der Nachwelt ein gutes Bild von sich zu hinterlassen. Formal stimmt die Aussage teilweise, weil er seine Ämter mit Kollegen teilte. Tatsächlich befehligte er aber die meisten Legionen, hatte riesige Geldmittel und bestimmte, wer Ämter bekam. Die Aussage ist also geschönt: Augustus war der eigentliche Herrscher Roms.",
        ["Absicht des Verfassers erkannt", "Andere Belege herangezogen", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g6-stadt-rom",
    lb: 5,
    title: "Leben in der Großstadt Rom",
    period: "Rom zur Zeit des Augustus",
    span: [-27, 80],
    intro:
      "Enge Mietshäuser, Lärm in der Nacht und Wasser aus den Bergen: Rom war die größte Stadt der antiken Welt. Ihre Probleme kommen dir vielleicht bekannt vor.",
    paragraphs: [
      "Um Christi Geburt lebten in Rom nach Schätzungen rund eine Million Menschen. Die Reichen wohnten in Stadthäusern mit Innenhof, die meisten aber in Insulae, mehrstöckigen Mietshäusern. Unten lagen Läden und Werkstätten, oben enge Wohnungen ohne Wasser und Toilette. Die oberen Stockwerke waren am billigsten und am gefährlichsten, denn Brände und Einstürze waren häufig. Augustus begrenzte die Höhe der Häuser auf etwa 20 Meter und schuf eine Feuerwehr.",
      "In den engen Gassen drängten sich Fußgänger, Sänften und Lasttiere. Weil das Gedränge so groß war, durften Lastkarren tagsüber nicht in die Stadt; nachts lärmten sie dafür durch die Straßen. Für Wasser sorgten Aquädukte, lange Wasserleitungen, die frisches Wasser aus den Bergen in die Stadt brachten: zu öffentlichen Brunnen, Thermen und den Häusern der Reichen. Ein großer Abwasserkanal, die Cloaca Maxima, leitete Schmutzwasser in den Tiber, doch viel Abfall landete einfach auf der Straße.",
      "Damit die Bevölkerung ruhig blieb, verteilte der Staat kostenloses Getreide an arme Bürger und veranstaltete große Spiele, später im Kolosseum. Rauch aus Herden, Werkstätten und Bädern verschmutzte die Luft. Vergleichst du Rom mit heutigen Großstädten, findest du ähnliche Herausforderungen: knapper Wohnraum, Verkehr, Wasser, Müll und schlechte Luft. Die Lösungen und die Technik sind heute andere, und die Rechte der Bewohner sind gesetzlich geschützt.",
    ],
    takeaway:
      "Rom war eine Millionenstadt mit engen Mietshäusern, Verkehrslärm, Brandgefahr und Schmutz. Aquädukte, Kanäle, Feuerwehr und Bauvorschriften waren Antworten darauf.",
    sourceIds: ["pw-rom", "pw-roemerstaedte"],
    quiz: check(
      "Warum war Rom nachts besonders laut?",
      "Lastkarren durften nur nachts in die Stadt fahren.",
      ["In den Thermen fanden nachts große Feste statt.", "Die Feuerwehr übte jede Nacht in den Gassen."],
      [
        "Die Thermen waren vor allem nachmittags geöffnet.",
        "Die Feuerwehr patrouillierte, aber das erklärt den Lärm nicht.",
      ],
      "Das Fahrverbot am Tag sollte die Gassen entlasten. Dafür rumpelten die Wagen nachts über das Pflaster.",
    ),
    diagram: {
      kind: "compare",
      title: "Großstadt damals und heute",
      columns: ["Rom um Christi Geburt", "Großstadt heute"],
      rows: [
        { aspect: "Wohnen", values: ["enge Insulae, Brandgefahr", "hohe Mieten, knapper Wohnraum"] },
        { aspect: "Verkehr", values: ["Gedränge, Karrenverbot am Tag", "Staus, Bahnen, Fahrradwege"] },
        { aspect: "Wasser", values: ["Aquädukte und öffentliche Brunnen", "Wasserwerke und Leitungen bis in jede Wohnung"] },
        { aspect: "Abwasser und Müll", values: ["Cloaca Maxima, Abfall auf der Straße", "Kanalisation, Kläranlagen, Müllabfuhr"] },
        { aspect: "Luft", values: ["Rauch von Herden und Werkstätten", "Abgase von Verkehr und Heizungen"] },
      ],
      caption: "Die Herausforderungen ähneln sich, die Mittel und Rechte sind heute andere.",
    },
    workshop: classify(
      "Herausforderungen der Großstadt Rom",
      ["Wohnen", "Verkehr", "Wasser und Hygiene", "Versorgung und Ruhe"],
      [
        [
          "In den oberen Stockwerken der Insulae brechen oft Brände aus.",
          0,
          "Holz, offene Feuer und Enge machten die Mietshäuser gefährlich.",
        ],
        [
          "Lastkarren dürfen tagsüber nicht in die Stadt.",
          1,
          "Ein Fahrverbot sollte das Gedränge mindern.",
        ],
        [
          "Aquädukte bringen frisches Wasser zu Brunnen und Thermen.",
          2,
          "Wasserleitungen über viele Kilometer versorgten die Stadt.",
        ],
        [
          "Arme Bürger erhalten kostenloses Getreide.",
          3,
          "Die Versorgung sollte Hunger und Unruhen verhindern.",
        ],
        [
          "Augustus begrenzt die Höhe der Häuser.",
          0,
          "Eine Bauvorschrift gegen Einstürze.",
        ],
        [
          "Die Cloaca Maxima leitet Abwasser in den Tiber.",
          2,
          "Ein früher Abwasserkanal.",
        ],
      ],
      "Rom löste viele Probleme mit Technik und Vorschriften. Manche, wie Lärm und Schmutz, blieben ungelöst.",
    ),
    tasks: {
      1: writing(
        "Beschreibe das Wohnen in einer Insula. Nenne zwei Gefahren und eine Maßnahme dagegen.",
        ["Wie waren die Wohnungen ausgestattet?", "Was tat Augustus?"],
        "Die meisten Römer wohnten in Insulae, mehrstöckigen Mietshäusern mit Läden im Erdgeschoss und engen Wohnungen darüber, meist ohne Wasser und Toilette. Gefährlich waren Brände, weil man mit offenem Feuer kochte und heizte, und Einstürze schlecht gebauter Häuser. Augustus begrenzte die Höhe der Häuser und gründete eine Feuerwehr.",
        ["Insula beschrieben", "Zwei Gefahren genannt", "Passende Maßnahme genannt"],
      ),
      2: writing(
        "Vergleiche Rom mit einer heutigen Großstadt wie München in zwei Bereichen. Wo ist die Lage heute besser, wo ähnlich?",
        ["Denke an Wasser, Verkehr, Wohnen oder Luft.", "Was ist gleich geblieben?"],
        "Beim Wasser ist die Lage heute besser: In München kommt sauberes Wasser in jede Wohnung, und Kläranlagen reinigen das Abwasser, während in Rom viele Menschen an öffentlichen Brunnen Wasser holten und Abfall auf der Straße lag. Ähnlich ist das Wohnen: Damals wie heute ist Wohnraum in der Großstadt knapp und teuer. Insgesamt sind die Herausforderungen ähnlich, die Lösungen heute wirksamer.",
        ["Zwei Bereiche verglichen", "Verbesserung benannt", "Ähnlichkeit benannt"],
      ),
    },
  },
  {
    id: "g6-familie",
    lb: 5,
    title: "Die römische Familie und ihre Werte",
    period: "Römische Republik und Kaiserzeit",
    span: [-300, 200],
    intro:
      "Im alten Rom hatte ein Vater Macht über seine Kinder, solange er lebte. Welche Werte prägten die römische Familie, und was hat sich geändert?",
    paragraphs: [
      "Zur römischen Familie, der familia, gehörten Eltern, Kinder, oft Großeltern und auch die Sklaven des Haushalts. An der Spitze stand der pater familias, der Familienvater. Er hatte die väterliche Gewalt über alle: Er entschied über Heiraten, verwaltete das Vermögen und durfte seine Kinder bestrafen. Auch erwachsene Söhne besaßen nichts Eigenes, solange ihr Vater lebte.",
      "Die Ehefrau, die matrona, leitete den Haushalt, erzog die kleinen Kinder und genoss Ansehen. Anders als in Athen durften römische Frauen mit zum Gastmahl und in der Stadt unterwegs sein. Politische Rechte hatten sie aber nicht, und rechtlich standen sie unter der Aufsicht des Vaters, des Ehemanns oder eines Vormunds. Mädchen wurden oft schon mit zwölf bis fünfzehn Jahren verheiratet; die Ehe vereinbarten die Väter.",
      "Wichtige Werte waren pietas, das Pflichtgefühl gegenüber Göttern, Familie und Staat, fides, die Treue zum gegebenen Wort, und virtus, Tüchtigkeit und Tapferkeit. Vorbild war die Sitte der Vorfahren. Heute gilt in Deutschland: Männer und Frauen sind gleichberechtigt, Kinder haben eigene Rechte, und Gewalt in der Erziehung ist verboten. Familien sind vielfältig, mit einem oder zwei Elternteilen, mit Geschwistern aus verschiedenen Familien oder mit zwei Müttern oder zwei Vätern.",
    ],
    takeaway:
      "Der pater familias hatte Gewalt über die ganze familia. Pietas, fides und virtus prägten die römischen Werte; heute sind Gleichberechtigung und Kinderrechte gesetzlich geschützt.",
    sourceIds: ["pw-rom", "lehrplan"],
    quiz: check(
      "Wer entschied in der römischen Familie, wen eine Tochter heiratete?",
      "Der pater familias, also ihr Vater.",
      ["Die Tochter selbst nach ihrem Wunsch.", "Der Senat in einer Abstimmung."],
      [
        "Eigene Wahl war für Töchter die Ausnahme; die Väter vereinbarten die Ehen.",
        "Der Senat kümmerte sich um den Staat, nicht um Familienangelegenheiten.",
      ],
      "Die väterliche Gewalt umfasste auch die Heirat der Kinder. Ehen verbanden Familien und Vermögen.",
    ),
    diagram: {
      kind: "compare",
      title: "Familie im alten Rom und heute",
      columns: ["Römische familia", "Familie heute in Deutschland"],
      rows: [
        { aspect: "Wer gehört dazu?", values: ["Eltern, Kinder, Großeltern, Sklaven", "vielfältig: ein oder zwei Elternteile, Patchwork"] },
        { aspect: "Wer entscheidet?", values: ["der pater familias", "beide Eltern gemeinsam, Kinder reden mit"] },
        { aspect: "Rechte der Frau", values: ["unter Aufsicht, keine politischen Rechte", "gleichberechtigt"] },
        { aspect: "Heirat", values: ["von den Vätern vereinbart, oft sehr jung", "freie Wahl, ab 18 Jahren"] },
        { aspect: "Erziehung", values: ["Strafen durch den Vater erlaubt", "Gewalt in der Erziehung verboten"] },
      ],
      caption: "Werte wie Verlässlichkeit und Zusammenhalt sind geblieben, die Machtverteilung hat sich grundlegend verändert.",
    },
    workshop: classify(
      "Welcher römische Wert zeigt sich hier?",
      ["Pietas: Pflichtgefühl", "Fides: Treue", "Virtus: Tüchtigkeit und Tapferkeit"],
      [
        [
          "Ein Sohn opfert an den Hausaltar für die Götter und die Ahnen.",
          0,
          "Pflicht gegenüber Göttern und Vorfahren ist pietas.",
        ],
        [
          "Ein Kaufmann hält ein Versprechen, obwohl es ihm schadet.",
          1,
          "Wer zu seinem Wort steht, zeigt fides.",
        ],
        [
          "Ein Soldat kämpft mutig für Rom.",
          2,
          "Tapferkeit im Dienst für den Staat ist virtus.",
        ],
        [
          "Eine Tochter pflegt ihren alten Vater.",
          0,
          "Fürsorge für die Familie gehört zur pietas.",
        ],
        [
          "Ein Patron hilft seinem Schützling vor Gericht, wie er es ihm zugesagt hat.",
          1,
          "Die Treue zwischen Patron und Klient beruhte auf fides.",
        ],
      ],
      "Römische Werte verbanden Familie, Religion und Staat. Viele davon, wie Verlässlichkeit, schätzen wir bis heute.",
    ),
    tasks: {
      1: writing(
        "Beschreibe die Stellung des pater familias mit drei Beispielen seiner Rechte.",
        ["Worüber entschied er?", "Was durften erwachsene Söhne nicht?"],
        "Der pater familias stand an der Spitze der römischen Familie. Er entschied, wen seine Kinder heirateten, verwaltete das ganze Vermögen und durfte seine Kinder bestrafen. Selbst erwachsene Söhne besaßen kein eigenes Vermögen, solange ihr Vater lebte. Seine Gewalt reichte über die ganze familia, auch über die Sklaven.",
        ["Stellung beschrieben", "Drei Rechte genannt", "Fachbegriff richtig verwendet"],
      ),
      2: writing(
        "Vergleiche die Rolle der Frau in der römischen Familie mit heute. Nenne eine Gemeinsamkeit und zwei Unterschiede.",
        ["Welche Aufgaben und welches Ansehen hatte die matrona?", "Welche Rechte haben Frauen heute?"],
        "Gemeinsam ist, dass Frauen damals wie heute oft Haushalt und Erziehung prägten und Ansehen in der Familie genossen. Ein Unterschied: Römische Frauen hatten keine politischen Rechte, heute dürfen Frauen wählen und gewählt werden. Ein zweiter Unterschied: Damals standen Frauen rechtlich unter der Aufsicht eines Mannes und wurden verheiratet, heute sind sie gleichberechtigt und entscheiden selbst, wen sie heiraten.",
        ["Gemeinsamkeit genannt", "Zwei Unterschiede genannt", "Heutige Rechtslage richtig"],
      ),
    },
  },
  {
    id: "g6-provinzen",
    lb: 5,
    title: "Die Römer in Bayern: Provinz, Limes und Romanisierung",
    period: "Provinz Raetien · 15 v. Chr. bis um 260 n. Chr. am Limes",
    span: [-15, 260],
    intro:
      "Augsburg, Regensburg, Passau: Viele bayerische Städte gehen auf die Römer zurück. Was brachten sie mit, und was blieb?",
    paragraphs: [
      "15 v. Chr. eroberten römische Truppen unter Drusus und Tiberius, den Stiefsöhnen des Augustus, das Alpenvorland. Das Gebiet zwischen Alpen und Donau wurde zur Provinz Raetien mit der Hauptstadt Augusta Vindelicum, dem heutigen Augsburg. Östlich des Inns begann die Provinz Noricum. Eine Provinz war ein erobertes Gebiet außerhalb Italiens, das ein Statthalter verwaltete. Die Bewohner zahlten Steuern, Soldaten sicherten das Land.",
      "Um 100 n. Chr. schoben die Römer ihre Grenze über die Donau nach Norden vor und bauten den Limes. Der Obergermanisch-Raetische Limes war rund 550 Kilometer lang und reichte vom Rhein bis zur Donau bei Eining in Niederbayern. Er bestand aus Wachtürmen, einer Palisade und in Raetien später aus einer Steinmauer. Dahinter lagen Kastelle wie Weißenburg. Der Limes war keine undurchlässige Mauer, sondern kontrollierte Handel und Verkehr. Heute ist er UNESCO-Welterbe. 179 n. Chr. entstand in Regensburg ein Legionslager, Castra Regina; sein Nordtor steht noch heute. Um 260 n. Chr. gaben die Römer den Limes auf und zogen sich wieder an die Donau zurück.",
      "Mit den Römern kamen Straßen wie die Via Claudia Augusta über die Alpen, Städte, Gutshöfe, Bäder, Münzen und Weinbau. Die Bewohner übernahmen nach und nach Latein, römische Kleidung, Bauweise und Götter; man nennt das Romanisierung. Ab 212 n. Chr. erhielten fast alle freien Bewohner des Reiches das römische Bürgerrecht. Im Deutschen erinnern Wörter wie Mauer, Fenster, Keller, Straße und Wein an lateinische Vorbilder. Bei einer Exkursion zum Limes oder in ein Römermuseum kannst du diese Spuren selbst entdecken.",
    ],
    takeaway:
      "Südbayern gehörte ab 15 v. Chr. zur Provinz Raetien mit der Hauptstadt Augsburg. Der Limes sicherte die Grenze; Straßen, Städte, Latein und Bürgerrecht zeigen die Romanisierung.",
    sourceIds: ["limes", "archaeologie-bayern", "pw-roemerstaedte"],
    quiz: check(
      "Welche heutige Stadt war die Hauptstadt der Provinz Raetien?",
      "Augsburg, damals Augusta Vindelicum.",
      ["Regensburg, damals Castra Regina.", "München, damals Monacum Romanum."],
      [
        "Castra Regina war ein wichtiges Legionslager, aber nicht die Hauptstadt.",
        "München wurde erst im Mittelalter gegründet; „Monacum Romanum“ gab es nicht.",
      ],
      "Augusta Vindelicum trägt den Namen des Augustus. Dort saß der Statthalter der Provinz Raetien.",
    ),
    diagram: {
      kind: "steps",
      title: "Wie aus Eroberung Romanisierung wurde",
      steps: [
        { label: "Eroberung", note: "15 v. Chr. Alpenvorland" },
        { label: "Militär", note: "Lager, Kastelle, später der Limes" },
        { label: "Straßen und Handel", note: "Via Claudia Augusta, Münzen, Märkte" },
        { label: "Städte und Gutshöfe", note: "Augsburg, Kempten, Villen mit Bädern" },
        { label: "Sprache und Recht", note: "Latein, römische Götter, Bürgerrecht 212" },
      ],
      repeats: false,
      caption: "Romanisierung war kein Befehl, sondern ein Prozess über Generationen, in dem sich römische und einheimische Lebensweise mischten.",
    },
    workshop: classify(
      "Spuren der Römer in Bayern",
      ["Militär und Grenze", "Wirtschaft und Verkehr", "Alltag und Kultur"],
      [
        [
          "Reste von Wachtürmen und einer Steinmauer nördlich der Donau",
          0,
          "Das sind Reste des Limes.",
        ],
        [
          "Eine gepflasterte Straße über die Alpen nach Augsburg",
          1,
          "Die Via Claudia Augusta verband Italien mit der Provinz.",
        ],
        [
          "Ein Bad mit Fußbodenheizung in einem Gutshof",
          2,
          "Römischer Komfort zog in die Provinz ein.",
        ],
        [
          "Das Nordtor des Legionslagers in Regensburg",
          0,
          "Die Porta Praetoria gehörte zum Lager Castra Regina.",
        ],
        [
          "Römische Münzen in einem Händlerhaus",
          1,
          "Mit dem Geld kam der Handel.",
        ],
        [
          "Deutsche Wörter wie Fenster und Keller",
          2,
          "Sie gehen auf lateinische Wörter zurück.",
        ],
      ],
      "Militär, Wirtschaft und Alltag griffen ineinander. Zusammen veränderten sie das Leben in der Provinz.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Begriff Romanisierung an zwei Beispielen aus Bayern.",
        ["Was übernahmen die Bewohner von den Römern?", "Welche Spuren findest du heute?"],
        "Romanisierung bedeutet, dass die Bewohner einer Provinz nach und nach die römische Lebensweise übernahmen. In Bayern entstanden römische Städte wie Augusta Vindelicum, das heutige Augsburg, und Gutshöfe mit Bädern. Außerdem sprach man zunehmend Latein; Wörter wie Mauer, Fenster und Wein stammen daher.",
        ["Begriff erklärt", "Zwei bayerische Beispiele", "Spur in der Gegenwart genannt"],
      ),
      2: writing(
        "Ein Freund sagt: „Der Limes war eine Mauer, die Römer und Germanen völlig trennte.“ Stimmt das?",
        ["Woraus bestand der Limes?", "Was geschah an den Übergängen?"],
        "Das stimmt nicht ganz. Der Limes bestand aus Wachtürmen, einer Palisade und in Raetien teilweise aus einer Mauer, aber er war keine undurchlässige Grenze. An bewachten Übergängen kamen Händler hindurch, und es gab Austausch von Waren. Der Limes sollte vor allem kontrollieren, wer kam und ging, und kleinere Überfälle abwehren.",
        ["Aussage geprüft", "Aufbau des Limes beschrieben", "Kontrollfunktion erklärt"],
      ),
    },
  },
  {
    id: "g6-juden",
    lb: 5,
    title: "Juden im Römischen Reich",
    period: "63 v. Chr. bis 321 n. Chr.",
    span: [-63, 321],
    intro:
      "Ohne Land und ohne Tempel bewahrten Juden über Jahrtausende ihren Glauben. Wie kam es zur Zerstreuung, der Diaspora?",
    paragraphs: [
      "Das Judentum ist die älteste der Religionen, die an einen einzigen Gott glauben. Grundlage ist die Tora, die fünf Bücher Mose. Juden halten den Sabbat als Ruhetag, feiern Feste wie Pessach und beachten Speisegebote. Ihr religiöses Zentrum war der Tempel in Jerusalem. Schon vor der Römerzeit lebten jüdische Gemeinden in vielen Städten am Mittelmeer, etwa in Alexandria und in Rom.",
      "63 v. Chr. eroberte der römische Feldherr Pompeius Jerusalem. Judäa wurde zunächst von Königen beherrscht, die von Rom abhängig waren, wie Herodes, der den Tempel prächtig ausbauen ließ, später von römischen Statthaltern. Rom erlaubte den Juden, ihre Religion auszuüben, und befreite sie vom Opfer für den Kaiser. Hohe Steuern und Statthalter, die den Glauben missachteten, führten aber zu Spannungen. 66 n. Chr. begann ein Aufstand. 70 n. Chr. eroberten römische Truppen Jerusalem und zerstörten den Tempel. Der Titusbogen in Rom zeigt bis heute, wie Soldaten den siebenarmigen Leuchter als Beute tragen.",
      "Nach einem weiteren Aufstand von 132 bis 135 n. Chr. durften Juden Jerusalem nicht mehr betreten. Immer mehr Juden lebten nun verstreut im ganzen Reich, in der Diaspora. Ohne Tempel wurden die Synagoge als Ort des Gebets und des Lernens und die Rabbiner als Lehrer wichtig. Glaube, Tora, Feste und Gemeinschaft hielten die jüdische Identität lebendig. Ein Erlass Kaiser Konstantins von 321 n. Chr. nennt Juden in Köln; er gilt als ältestes schriftliches Zeugnis jüdischen Lebens im heutigen Deutschland.",
    ],
    takeaway:
      "Rom duldete das Judentum, zerstörte aber nach einem Aufstand 70 n. Chr. den Tempel in Jerusalem. In der Diaspora bewahrten Synagoge, Tora und Gemeinschaft die jüdische Identität.",
    sourceIds: ["pw-rom", "lehrplan"],
    quiz: check(
      "Was geschah 70 n. Chr. in Jerusalem?",
      "Römische Truppen zerstörten den jüdischen Tempel.",
      ["Kaiser Augustus ließ den Tempel neu errichten.", "Die Juden erhielten das Bürgerrecht der Stadt Rom."],
      [
        "Den prächtigen Ausbau des Tempels ließ König Herodes beginnen, nicht Augustus; 70 n. Chr. wurde er zerstört.",
        "Mit dem Bürgerrecht hat das Jahr 70 nichts zu tun; es war das Ende eines Aufstands.",
      ],
      "Nach dem Aufstand ab 66 n. Chr. eroberte Titus Jerusalem. Mit dem Tempel verloren die Juden ihr religiöses Zentrum.",
    ),
    workshop: timeline(
      [
        [
          "63 v. Chr.: Pompeius erobert Jerusalem.",
          "Judäa gerät unter römischen Einfluss.",
        ],
        [
          "37 v. Chr.: Herodes wird mit römischer Hilfe König von Judäa.",
          "Er baut den Tempel in Jerusalem prächtig aus.",
        ],
        [
          "66 n. Chr.: In Judäa beginnt ein Aufstand gegen Rom.",
          "Steuern und Missachtung des Glaubens hatten die Spannungen verschärft.",
        ],
        [
          "70 n. Chr.: Die Römer zerstören den Tempel in Jerusalem.",
          "Der Titusbogen in Rom erinnert an den Sieg.",
        ],
        [
          "135 n. Chr.: Nach einem weiteren Aufstand wird Juden der Zutritt zu Jerusalem verboten.",
          "Die Diaspora wird für die meisten Juden zur Lebenswirklichkeit.",
        ],
        [
          "321 n. Chr.: Ein Erlass Konstantins nennt Juden in Köln.",
          "Ältestes schriftliches Zeugnis jüdischen Lebens im heutigen Deutschland.",
        ],
      ],
      "In rund 400 Jahren veränderte sich jüdisches Leben grundlegend: vom Tempel in Jerusalem zu Gemeinden im ganzen Reich.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Begriff Diaspora und wie Juden ohne Tempel ihren Glauben bewahrten.",
        ["Was bedeutet Diaspora wörtlich?", "Welche Orte und Menschen wurden wichtig?"],
        "Diaspora heißt Zerstreuung: Juden lebten verstreut außerhalb ihres Herkunftslandes, in vielen Städten des Römischen Reiches. Nach der Zerstörung des Tempels 70 n. Chr. wurden Synagogen zu Orten des Gebets und des Lernens. Rabbiner lehrten die Tora, und gemeinsame Feste wie Pessach und der Sabbat hielten die Gemeinschaft zusammen.",
        ["Begriff erklärt", "Synagoge und Tora genannt", "Bedeutung der Gemeinschaft erklärt"],
      ),
      2: writing(
        "Beurteile den Umgang Roms mit den Juden. Berücksichtige Duldung und Gewalt.",
        ["Was erlaubte Rom den Juden?", "Wie reagierte Rom auf die Aufstände?"],
        "Rom duldete das Judentum lange: Juden durften ihren Glauben ausüben, den Sabbat halten und mussten dem Kaiser nicht opfern. Als sie sich aber gegen hohe Steuern und Missachtung erhoben, reagierte Rom mit großer Gewalt, zerstörte 70 n. Chr. den Tempel und verbot später den Zutritt zu Jerusalem. Rom war also tolerant, solange seine Herrschaft nicht infrage stand; Widerstand bestrafte es hart.",
        ["Duldung beschrieben", "Gewalt beschrieben", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g6-christentum",
    lb: 5,
    title: "Vom verfolgten Glauben zur Staatsreligion",
    period: "Christentum im Römischen Reich · um 30 bis 380 n. Chr.",
    span: [30, 380],
    intro:
      "Erst wurden Christen verfolgt, knapp 300 Jahre später war ihr Glaube Staatsreligion. Wie kam es zu diesem Umbruch?",
    paragraphs: [
      "Jesus von Nazareth war ein jüdischer Wanderprediger in Galiläa. Um 30 n. Chr. ließ ihn der römische Statthalter Pontius Pilatus in Jerusalem kreuzigen. Seine Anhänger glaubten, dass er auferstanden sei, und nannten ihn Christus, den Gesalbten. Der Apostel Paulus verbreitete den Glauben auf Reisen in Städten rund um das Mittelmeer. Bald gab es christliche Gemeinden auch in Rom.",
      "Die Römer verehrten viele Götter und duldeten fremde Kulte, verlangten aber Opfer für die Staatsgötter und den Kaiser. Christen lehnten das ab, weil sie nur an einen Gott glaubten. Viele hielten sie deshalb für staatsfeindlich. Nach dem Brand Roms 64 n. Chr. ließ Kaiser Nero Christen hinrichten. Um 250 und ab 303 n. Chr. ordneten die Kaiser reichsweite Verfolgungen an. Trotzdem wuchs die Zahl der Christen, auch weil die Gemeinden Arme, Kranke und Witwen versorgten.",
      "Kaiser Konstantin förderte die Christen. 313 n. Chr. vereinbarte er mit seinem Mitkaiser die Religionsfreiheit für alle. 380 n. Chr. erklärte Kaiser Theodosius das Christentum zur Staatsreligion; wenige Jahre später wurden die alten Opferkulte verboten. Nun wurden Andersgläubige benachteiligt. Der Umbruch prägte Europa: Kirchen, Bischöfe und christliche Feste wurden Teil des Staates und überdauerten das Ende des Weströmischen Reiches.",
    ],
    takeaway:
      "Weil Christen das Kaiseropfer verweigerten, wurden sie verfolgt. 313 n. Chr. erhielten sie Religionsfreiheit, 380 n. Chr. wurde das Christentum Staatsreligion.",
    sourceIds: ["plinius", "pw-rom"],
    quiz: check(
      "Warum wurden Christen im Römischen Reich verfolgt?",
      "Sie verweigerten das Opfer für Götter und Kaiser.",
      ["Sie weigerten sich, Latein zu sprechen.", "Sie hatten Rom 64 n. Chr. angezündet."],
      [
        "Viele Christen sprachen Latein oder Griechisch; die Sprache war kein Grund.",
        "Nero gab ihnen die Schuld am Brand, Belege dafür gibt es nicht.",
      ],
      "Das Opfer galt als Zeichen der Treue zum Staat. Wer es verweigerte, geriet in Verdacht.",
    ),
    diagram: {
      kind: "steps",
      title: "Der Weg des Christentums im Römischen Reich",
      steps: [
        { label: "um 30 n. Chr.", note: "Kreuzigung Jesu in Jerusalem" },
        { label: "64 n. Chr.", note: "Verfolgung unter Nero" },
        { label: "250 und ab 303 n. Chr.", note: "reichsweite Verfolgungen" },
        { label: "313 n. Chr.", note: "Religionsfreiheit unter Konstantin" },
        { label: "380 n. Chr.", note: "Staatsreligion unter Theodosius" },
      ],
      repeats: false,
      caption: "Aus einer kleinen verfolgten Gemeinschaft wurde in knapp 350 Jahren die Religion des Staates.",
    },
    workshop: {
      ...classify(
        "Was berichtet der Statthalter Plinius?",
        ["Steht im Brief", "Deutung aus dem Brief", "Steht nicht im Brief"],
        [
          [
            "Plinius fragte Beschuldigte mehrmals, ob sie Christen seien.",
            0,
            "So beschreibt er sein Verfahren.",
          ],
          [
            "Wer bei seinem Bekenntnis blieb, wurde abgeführt.",
            0,
            "Auch das steht ausdrücklich im Brief.",
          ],
          [
            "Plinius bestrafte schon das Christsein selbst, nicht ein Verbrechen.",
            1,
            "Das schließt man daraus, dass er die Hartnäckigkeit bestrafte.",
          ],
          [
            "Alle Bewohner der Provinz verlangten die Bestrafung der Christen.",
            2,
            "Darüber sagt der Auszug nichts.",
          ],
          [
            "Plinius war sich unsicher, wie er rechtlich vorgehen sollte.",
            1,
            "Er fragt den Kaiser um Rat; das spricht für Unsicherheit.",
          ],
        ],
        "Ein Brief zeigt die Sicht des Schreibers. Was er nicht berichtet, müssen andere Quellen klären.",
      ),
      sourceExcerpt: {
        title: "Brief des Plinius an Kaiser Trajan (Briefe 10, 96), Auszug",
        author: "Plinius der Jüngere, Statthalter einer Provinz in Kleinasien",
        date: "um 112 n. Chr.",
        audience: "Kaiser Trajan",
        text: "Ich habe sie selbst gefragt, ob sie Christen seien. Wer es zugab, den habe ich ein zweites und drittes Mal gefragt und ihm die Todesstrafe angedroht. Wer dabei blieb, den ließ ich abführen. Denn ich zweifelte nicht: Was auch immer sie gestehen, ihre Hartnäckigkeit und ihr unbeugsamer Starrsinn müssen bestraft werden.",
        sourceId: "plinius",
        context:
          "Übersetzung für diese App aus dem Lateinischen. Plinius schreibt, er sei nie bei Prozessen gegen Christen dabei gewesen, und bittet den Kaiser um Rat. Trajan antwortet, man solle Christen nicht aufspüren, Angezeigte aber bestrafen, wenn sie nicht opfern.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre, warum Christen im Römischen Reich verfolgt wurden, obwohl die Römer viele Religionen duldeten.",
        ["Was verlangten die Römer von allen Religionen?", "Warum lehnten Christen das ab?"],
        "Die Römer duldeten fremde Götter, solange alle auch für die Staatsgötter und den Kaiser opferten. Das galt als Zeichen der Treue zum Staat. Christen glaubten nur an einen Gott und verweigerten diese Opfer. Deshalb hielten viele Römer sie für staatsfeindlich, und Kaiser wie Nero oder später Diokletian ließen sie verfolgen.",
        ["Duldung mit Bedingung erklärt", "Verweigerung begründet", "Folge Verfolgung genannt"],
      ),
      2: writing(
        "Was erfährst du aus dem Brief des Plinius über den Umgang mit Christen? Nenne zwei Aussagen und eine Grenze der Quelle.",
        ["Wie ging Plinius vor?", "Was sagt der Brief nicht?"],
        "Plinius fragte die Beschuldigten mehrmals, ob sie Christen seien, und drohte mit der Todesstrafe. Wer bei seinem Glauben blieb, wurde abgeführt; bestraft wurde also schon das Bekenntnis. Der Brief zeigt aber nur die Sicht eines Statthalters in einer Provinz. Wie die Christen selbst das erlebten und wie es anderswo war, verrät er nicht.",
        ["Zwei Aussagen genannt", "Grenze der Quelle erkannt", "Sachlich formuliert"],
      ),
    },
  },
  {
    id: "g6-erbe-roms",
    lb: 5,
    title: "Das Erbe Roms in Europa",
    period: "Antike bis heute",
    span: [-27, 2026],
    intro:
      "Italienisch, Französisch, Spanisch: Diese Sprachen sind Nachkommen des Lateins. Was hat Rom Europa noch hinterlassen?",
    paragraphs: [
      "Aus dem Latein der Römer entstanden die romanischen Sprachen: Italienisch, Französisch, Spanisch, Portugiesisch und Rumänisch. Auch das Deutsche hat viele lateinische Wörter aufgenommen. Das lateinische Alphabet nutzen heute die meisten Sprachen Europas. Im Mittelalter und noch lange danach war Latein die gemeinsame Sprache der Kirche, der Wissenschaft und der Gelehrten.",
      "Die Römer schrieben ihr Recht genau auf und entwickelten Regeln für Verträge, Eigentum und Erbschaften. Kaiser Justinian ließ es im 6. Jahrhundert n. Chr. sammeln. Diese Sammlung beeinflusste später viele Gesetzbücher in Europa, auch das heutige Recht in Deutschland. Begriffe wie Senat, Republik, Diktator und Kaiser stammen aus der römischen Geschichte. Unser Kalender geht auf Caesar zurück; die Monate Juli und August tragen die Namen von Caesar und Augustus.",
      "Römische Straßen, Städte, Brücken und Bauformen wie Bogen und Kuppel prägen Europa bis heute, und über das Römische Reich verbreitete sich das Christentum. Diese gemeinsamen Wurzeln verbinden viele Länder. Doch Vorsicht beim Erörtern: Nicht ganz Europa gehörte zum Römischen Reich, zum Beispiel Skandinavien und der größte Teil des heutigen Norddeutschlands nicht. Europas Kultur hat auch andere Wurzeln, etwa griechische, jüdische, germanische, slawische und arabische.",
    ],
    takeaway:
      "Latein, römisches Recht, Begriffe der Politik, Kalender, Bauweise und das Christentum sind gemeinsame Wurzeln vieler europäischer Länder. Europa hat aber noch weitere Wurzeln.",
    sourceIds: ["pw-rom", "lehrplan"],
    quiz: check(
      "Welche Sprache ist eine Nachfahrin des Lateins?",
      "Spanisch.",
      ["Englisch.", "Polnisch."],
      [
        "Englisch ist eine germanische Sprache, hat aber viele lateinische Wörter übernommen.",
        "Polnisch ist eine slawische Sprache.",
      ],
      "Spanisch, Italienisch, Französisch, Portugiesisch und Rumänisch gehören zu den romanischen Sprachen.",
    ),
    workshop: classify(
      "Was hat Rom Europa hinterlassen?",
      ["Sprache und Schrift", "Recht und Politik", "Bauen und Alltag"],
      [
        [
          "Das Wort „Fenster“ kommt vom lateinischen fenestra.",
          0,
          "Ein lateinisches Lehnwort im Deutschen.",
        ],
        [
          "Viele Regeln über Verträge und Eigentum gehen auf römisches Recht zurück.",
          1,
          "Justinians Sammlung beeinflusste Gesetzbücher in ganz Europa.",
        ],
        [
          "Brücken und Tore mit Rundbögen",
          2,
          "Der Rundbogen war ein Kennzeichen römischer Baukunst.",
        ],
        [
          "Der Monat August trägt den Namen des ersten Kaisers.",
          2,
          "Der Kalender ordnet bis heute unseren Alltag.",
        ],
        [
          "Der Begriff „Republik“ für einen Staat ohne König",
          1,
          "Res publica bedeutete „öffentliche Sache“.",
        ],
        [
          "Die Buchstaben, mit denen du schreibst",
          0,
          "Das lateinische Alphabet ist in Europa am weitesten verbreitet.",
        ],
      ],
      "Rom verbindet viele Länder Europas über Sprache, Recht und Alltag. Diese Gemeinsamkeiten kannst du in deiner Umgebung finden.",
    ),
    tasks: {
      1: writing(
        "Nenne drei Beispiele für das Erbe Roms in deinem Alltag und erkläre eines genauer.",
        ["Denke an Sprache, Kalender und Gebäude.", "Woher stammt das Beispiel genau?"],
        "Erstens benutze ich das lateinische Alphabet, wenn ich schreibe. Zweitens heißen die Monate Juli und August nach Caesar und Augustus. Drittens stammen Wörter wie Fenster oder Mauer aus dem Latein. Der Kalender geht auf Caesar zurück, der ein Jahr mit 365 Tagen und einem Schaltjahr einführte; unser heutiger Kalender ist eine spätere Verbesserung davon.",
        ["Drei Beispiele genannt", "Ein Beispiel erklärt", "Bezug zum Alltag"],
      ),
      2: writing(
        "Erörtere: „Rom ist die Wurzel Europas.“ Nenne Argumente dafür und eine Einschränkung.",
        ["Was verbindet viele Länder Europas über Rom?", "Welche Gebiete und Kulturen gehören nicht dazu?"],
        "Dafür spricht, dass viele Länder Europas über Rom verbunden sind: durch romanische Sprachen und das lateinische Alphabet, durch das römische Recht und durch das Christentum, das sich im Reich verbreitete. Eine Einschränkung ist, dass nicht ganz Europa römisch war, etwa Skandinavien und Norddeutschland. Außerdem hat Europa weitere Wurzeln, zum Beispiel in Griechenland und im Judentum. Rom ist also eine wichtige Wurzel, aber nicht die einzige.",
        ["Argumente genannt", "Einschränkung genannt", "Abgewogenes Fazit"],
      ),
    },
  },
];
