import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 8: Menschen machen Geschichte (Längsschnitt). */
export const people: Lesson[] = [
  {
    id: "g6-hatschepsut",
    lb: 8,
    title: "Hatschepsut: eine Frau als Pharao",
    period: "Längsschnitt · Neues Reich, etwa 1479 bis 1458 v. Chr.",
    span: [-1479, -1458],
    intro:
      "Ein Pharao mit Königsbart, der eine Frau war: Hatschepsut regierte Ägypten rund zwanzig Jahre. Danach versuchte man, sie aus der Erinnerung zu tilgen.",
    paragraphs: [
      "Hatschepsut war die Tochter eines Pharaos und die Ehefrau des Pharaos Thutmosis II. Als ihr Mann starb, war der Thronfolger, ihr Stiefsohn Thutmosis III., noch ein Kind. Zuerst regierte sie für ihn, dann ließ sie sich selbst zum Pharao krönen. Weil ein Pharao nach ägyptischer Vorstellung ein Mann war, ließ sie sich auf Bildern und Statuen oft mit männlichem Körper und dem künstlichen Königsbart darstellen.",
      "Hatschepsut herrschte etwa von 1479 bis 1458 v. Chr. Sie ließ einen prächtigen Tempel in Deir el-Bahari bauen und schickte eine Handelsexpedition in das ferne Land Punt, die Weihrauch, Myrrhenbäume und Gold zurückbrachte. Unterstützt wurde sie von hohen Beamten und Priestern. Ihre königliche Herkunft und diese Helfer machten ihre Herrschaft möglich.",
      "Lange nach ihrem Tod ließ man ihre Namen und Bilder an vielen Bauwerken entfernen. Wer das anordnete und warum, ist umstritten: Vielleicht wollte Thutmosis III. die Thronfolge seines Sohnes sichern, vielleicht passte eine Frau als Pharao nicht in die gewohnte Ordnung. An Hatschepsut siehst du Möglichkeiten und Grenzen einer einzelnen Person: Sie nutzte Herkunft, Helfer und Bilder geschickt, stieß aber an feste Vorstellungen davon, wer herrschen darf.",
    ],
    takeaway:
      "Hatschepsut regierte als Frau etwa 1479 bis 1458 v. Chr. als Pharao. Herkunft, Helfer und eine männliche Selbstdarstellung ermöglichten ihre Herrschaft; feste Rollenbilder begrenzten sie.",
    sourceIds: ["pw-pharaonen", "smaek"],
    quiz: check(
      "Warum ließ sich Hatschepsut mit Königsbart darstellen?",
      "Ein Pharao galt in Ägypten als Mann.",
      ["Frauen trugen damals in Ägypten Bärte.", "Ihr Stiefsohn hatte es ihr befohlen."],
      [
        "Der Königsbart war künstlich und ein Herrschaftszeichen, kein Zeichen der Mode.",
        "Ihr Stiefsohn war noch ein Kind und hatte keine Macht über sie.",
      ],
      "Der Bart war ein Zeichen des Königtums. Hatschepsut zeigte sich so, wie ein Pharao aussehen musste.",
    ),
    diagram: {
      kind: "compare",
      title: "Möglichkeiten und Grenzen einer Herrscherin",
      columns: ["Was ihr half", "Was sie begrenzte"],
      rows: [
        { aspect: "Herkunft", values: ["Tochter und Ehefrau eines Pharaos", "der Thron war für einen Sohn vorgesehen"] },
        { aspect: "Unterstützung", values: ["hohe Beamte und Priester", "die Ordnung erwartete einen Mann als Pharao"] },
        { aspect: "Darstellung", values: ["Bilder mit Königsbart und Krone", "nach ihrem Tod wurden Bilder entfernt"] },
      ],
      caption: "Eine einzelne Person kann viel bewegen, aber immer innerhalb der Grenzen ihrer Zeit.",
    },
    workshop: classify(
      "Hatschepsuts Möglichkeiten und Grenzen",
      ["Was ihre Herrschaft ermöglichte", "Was ihre Herrschaft begrenzte", "Wie sie sich darstellte"],
      [
        [
          "Sie ist Tochter eines Pharaos.",
          0,
          "Königliche Herkunft gab ihr einen Anspruch.",
        ],
        [
          "Nach ägyptischer Vorstellung muss ein Pharao ein Mann sein.",
          1,
          "Dieses Rollenbild stand ihr entgegen.",
        ],
        [
          "Statuen zeigen sie mit männlichem Körper und Königsbart.",
          2,
          "So passte sie sich dem Bild des Pharaos an.",
        ],
        [
          "Hohe Beamte unterstützen ihre Herrschaft.",
          0,
          "Ohne Helfer hätte sie nicht regieren können.",
        ],
        [
          "Nach ihrem Tod werden ihre Namen an Bauwerken entfernt.",
          1,
          "Die Erinnerung an sie sollte begrenzt werden.",
        ],
        [
          "Ihr Tempel in Deir el-Bahari zeigt die Expedition nach Punt.",
          2,
          "Bauten und Bilder verkündeten ihre Erfolge.",
        ],
      ],
      "Herkunft, Helfer und Bilder öffneten Hatschepsut den Weg; Rollenbilder und das spätere Auslöschen zeigen die Grenzen.",
    ),
    tasks: {
      1: writing(
        "Stelle Hatschepsut in einem kurzen Porträt vor: Herkunft, Herrschaft, Leistungen.",
        ["Wer waren ihr Vater und ihr Ehemann?", "Was ließ sie bauen, wohin schickte sie Schiffe?"],
        "Hatschepsut war die Tochter eines Pharaos und die Witwe von Thutmosis II. Zuerst regierte sie für ihren jungen Stiefsohn, dann ließ sie sich selbst zum Pharao krönen und herrschte etwa von 1479 bis 1458 v. Chr. Sie ließ den Tempel in Deir el-Bahari bauen und schickte eine Handelsexpedition nach Punt, die Weihrauch und Myrrhenbäume brachte.",
        ["Herkunft genannt", "Weg zur Herrschaft beschrieben", "Leistungen genannt"],
      ),
      2: writing(
        "Beurteile, welche Möglichkeiten und Grenzen Hatschepsut als Frau in ihrer Zeit hatte.",
        ["Was half ihr, Pharao zu werden?", "Welche Vorstellungen standen ihr entgegen?"],
        "Hatschepsut hatte gute Möglichkeiten: Sie stammte aus der Königsfamilie, wurde von Beamten und Priestern unterstützt und nutzte Bilder geschickt, um als Pharao anerkannt zu werden. Ihre Grenze war die feste Vorstellung, dass ein Pharao ein Mann sein muss; deshalb ließ sie sich männlich darstellen. Dass später ihre Bilder entfernt wurden, zeigt, wie stark diese Vorstellung war. Sie hat viel erreicht, aber nur, indem sie sich der Rolle anpasste.",
        ["Möglichkeiten genannt", "Grenzen genannt", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g6-alexander",
    lb: 8,
    title: "Alexander der Große: Eroberer und Städtegründer",
    period: "Längsschnitt · 356 bis 323 v. Chr.",
    span: [-356, -301],
    intro:
      "In elf Jahren eroberte Alexander ein Reich von Griechenland bis Indien. Nach seinem Tod zerfiel es. Verdient er den Beinamen „der Große“?",
    paragraphs: [
      "Alexander wurde 356 v. Chr. in Makedonien geboren, nördlich der griechischen Poleis. Sein Lehrer war der Philosoph Aristoteles. Sein Vater Philipp II. hatte ein schlagkräftiges Heer aufgebaut und die griechischen Poleis unter seine Führung gebracht. Nach Philipps Ermordung wurde Alexander 336 v. Chr. mit zwanzig Jahren König. 334 v. Chr. zog er gegen das Perserreich, besiegte den Perserkönig 333 v. Chr. bei Issos und 331 v. Chr. bei Gaugamela. Er eroberte Ägypten und zog über den Indus bis nach Indien. Dort weigerten sich seine erschöpften Soldaten weiterzuziehen. 323 v. Chr. starb Alexander mit 32 Jahren in Babylon.",
      "Alexander gründete viele Städte, die meisten nannte er Alexandria. Die berühmteste in Ägypten wurde ein Zentrum von Handel und Wissenschaft. Griechische Sprache und Kultur verbreiteten sich bis nach Asien und mischten sich mit persischen und ägyptischen Traditionen; diese Zeit nennt man Hellenismus. Alexander übernahm selbst persische Bräuche und ließ in Susa Tausende seiner Soldaten persische Frauen heiraten.",
      "Seine Eroberungen kosteten viele Menschen das Leben. Die Stadt Theben ließ er 335 v. Chr. zerstören, die persische Königsstadt Persepolis ging in Flammen auf. In persischen Überlieferungen erscheint er nicht als „der Große“, sondern als Zerstörer. Nach seinem Tod gab es keinen erwachsenen Erben; seine Feldherren kämpften um die Macht und teilten das Reich in mehrere Königreiche, etwa das der Ptolemäer in Ägypten. Ein Einzelner konnte ein Weltreich erobern, aber nicht allein zusammenhalten.",
    ],
    takeaway:
      "Alexander eroberte von 334 bis 323 v. Chr. das Perserreich und verbreitete die griechische Kultur. Ob er „groß“ war, hängt vom Standpunkt ab; ohne Erben und feste Ordnung zerfiel sein Reich.",
    sourceIds: ["pw-alexander", "lehrplan"],
    quiz: check(
      "Warum zerbrach Alexanders Reich nach seinem Tod?",
      "Es fehlte ein erwachsener Erbe, die Feldherren stritten.",
      ["Die Perser eroberten ihr Reich sofort zurück.", "Die Römer besiegten seine Armee in Babylon."],
      [
        "Das Perserreich bestand nicht mehr; die Nachfolger waren Makedonen.",
        "Rom war damals noch eine Macht in Italien und kämpfte nicht in Babylon.",
      ],
      "Alexanders Feldherren, die Diadochen, teilten das Reich in mehrere Königreiche auf.",
    ),
    diagram: {
      kind: "compare",
      title: "Ein Mann, zwei Sichtweisen",
      columns: ["Aus Sicht der Griechen und Makedonen", "Aus Sicht vieler Besiegter"],
      rows: [
        { aspect: "Eroberungen", values: ["Sieg über den mächtigen Perserkönig", "Krieg, Zerstörung und Tod"] },
        { aspect: "Städte", values: ["neue Zentren für Handel und Wissen", "fremde Herren und Siedler im Land"] },
        { aspect: "Kultur", values: ["griechische Bildung verbreitet sich", "Persepolis brennt, alte Ordnung endet"] },
      ],
      caption: "Ob eine Person „groß“ genannt wird, hängt davon ab, wer urteilt.",
    },
    workshop: timeline(
      [
        [
          "356 v. Chr.: Alexander wird in Makedonien geboren.",
          "Sein Vater Philipp II. baut ein starkes Heer auf.",
        ],
        [
          "336 v. Chr.: Mit zwanzig Jahren wird Alexander König.",
          "Sein Vater war ermordet worden.",
        ],
        [
          "333 v. Chr.: Sieg über den Perserkönig bei Issos.",
          "Der Weg nach Syrien und Ägypten ist frei.",
        ],
        [
          "331 v. Chr.: Gründung von Alexandria in Ägypten.",
          "Die Stadt wird ein Zentrum von Handel und Wissenschaft.",
        ],
        [
          "326 v. Chr.: In Indien verweigern die Soldaten den Weitermarsch.",
          "Auch ein großer Feldherr braucht seine Armee.",
        ],
        [
          "323 v. Chr.: Alexander stirbt in Babylon.",
          "Seine Feldherren beginnen, um das Reich zu kämpfen.",
        ],
      ],
      "In nur dreizehn Jahren als König veränderte Alexander die Welt vom Mittelmeer bis Indien. Sein Reich überlebte ihn nicht.",
    ),
    tasks: {
      1: writing(
        "Nenne drei Leistungen Alexanders und erkläre, warum sein Reich nach seinem Tod zerfiel.",
        ["Denke an Eroberungen, Städte und Kultur.", "Wer sollte nach ihm herrschen?"],
        "Alexander eroberte in elf Jahren das Perserreich und zog bis an den Indus. Er gründete viele Städte, darunter Alexandria in Ägypten. Durch seine Züge verbreiteten sich griechische Sprache und Kultur bis nach Asien. Nach seinem Tod 323 v. Chr. gab es keinen erwachsenen Erben, seine Feldherren kämpften um die Macht und teilten das Reich unter sich auf.",
        ["Drei Leistungen genannt", "Grund für den Zerfall", "Richtige Zeitangaben"],
      ),
      2: writing(
        "Verdient Alexander den Beinamen „der Große“? Beurteile aus historischer und heutiger Sicht.",
        ["Wie sahen ihn Griechen, wie die Besiegten?", "Welche Maßstäbe legen wir heute an?"],
        "Aus Sicht der Griechen und Makedonen war Alexander groß, weil er das mächtige Perserreich besiegte, Städte gründete und die griechische Kultur verbreitete. Für viele Besiegte war er ein Zerstörer, der Theben und Persepolis vernichten ließ. Aus heutiger Sicht beeindrucken seine Leistungen, aber Eroberungskriege mit so vielen Toten halte ich nicht für groß. Der Beiname zeigt also eine bestimmte Sicht, keine Wahrheit für alle.",
        ["Historische Sicht dargestellt", "Gegenperspektive genannt", "Eigenes begründetes Urteil"],
      ),
    },
  },
  {
    id: "g6-staatsmaenner",
    lb: 8,
    title: "Augustus und Karl: Selbstdarstellung und Erinnerung",
    period: "Längsschnitt · Augustus, Caesar und Karl der Große",
    span: [-44, 814],
    intro:
      "Münzen, Statuen, Paläste, Straßennamen: Mächtige Menschen sorgten dafür, wie man sie sah. Wie erinnern wir uns heute an sie?",
    paragraphs: [
      "Augustus nutzte Bilder und Bauten, um seine Herrschaft zu zeigen. Münzen mit seinem Kopf und seinem Ehrennamen liefen durch das ganze Reich. Seine Statuen zeigen ihn immer jung, ruhig und als Feldherrn, auch als er schon alt war. Der Friedensaltar in Rom feierte die Pax Augusta, und sein Tatenbericht wurde öffentlich aufgestellt. Auch Caesar ließ sich als Erster zu Lebzeiten auf römischen Münzen abbilden.",
      "Karl der Große ließ in Aachen eine prächtige Pfalzkapelle bauen, deren Säulen zum Teil aus Italien herbeigeschafft wurden; so knüpfte er an Rom an. Auf Münzen nannte er sich Kaiser und Augustus. Sein Vertrauter Einhard schrieb nach seinem Tod eine Lebensbeschreibung, die Karl als gerechten, frommen und tapferen Herrscher zeigt. Solche Quellen zeigen, wie die Herrscher gesehen werden wollten, nicht unbedingt, wie sie waren.",
      "Heute erinnern Städtenamen wie Augsburg an Augustus, und die Stadt Aachen verleiht einen Karlspreis an Menschen, die sich um die Einigung Europas verdient machen. Karl gilt manchen als „Vater Europas“. Für die Sachsen dagegen bedeutete er dreißig Jahre Krieg, Zwangstaufe und Hinrichtungen. Caesar wird als genialer Feldherr bewundert, doch sein Krieg in Gallien kostete sehr viele Menschen das Leben. Eine Person kann also je nach Standpunkt sehr unterschiedlich beurteilt werden.",
    ],
    takeaway:
      "Herrscher wie Augustus und Karl inszenierten sich mit Münzen, Statuen, Bauten und Texten. Die Erinnerung heute ehrt sie oft, doch aus anderer Sicht fällt das Urteil kritisch aus.",
    sourceIds: ["res-gestae", "pw-karl", "pw-rom"],
    quiz: check(
      "Was zeigt eine Statue, auf der Augustus stets jung und kraftvoll erscheint?",
      "Wie Augustus gesehen werden wollte.",
      ["Wie Augustus im Alter wirklich aussah.", "Dass Augustus nie älter als dreißig wurde."],
      [
        "Augustus wurde 75 Jahre alt; die Statuen zeigen ihn bewusst nicht alt.",
        "Augustus starb erst mit 75 Jahren im Jahr 14 n. Chr.",
      ],
      "Die Statuen sind Selbstdarstellung: Sie sollten Stärke, Ruhe und Dauer der Herrschaft vermitteln.",
    ),
    workshop: classify(
      "Selbstdarstellung, Erinnerung oder Kritik?",
      ["Selbstdarstellung zu Lebzeiten", "Erinnerung heute", "Kritische Sicht"],
      [
        [
          "Münzen zeigen den Kopf des Augustus mit seinem Ehrennamen.",
          0,
          "Augustus ließ sein Bild im ganzen Reich verbreiten.",
        ],
        [
          "Die Stadt Aachen verleiht jedes Jahr den Karlspreis.",
          1,
          "Heutige Erinnerung ehrt Karl als Europäer.",
        ],
        [
          "Sächsische Familien verlieren im Krieg Karls ihre Angehörigen.",
          2,
          "Aus Sicht der Sachsen war Karl ein Eroberer.",
        ],
        [
          "Karl lässt Säulen aus Italien für seine Kapelle in Aachen holen.",
          0,
          "Der Bau sollte zeigen, dass er an Rom anknüpft.",
        ],
        [
          "Die Stadt Augsburg trägt den Namen des Augustus.",
          1,
          "Der Name erinnert bis heute an den Kaiser.",
        ],
        [
          "Caesars Krieg in Gallien tötete sehr viele Menschen.",
          2,
          "Bewunderung für den Feldherrn verdeckt oft die Opfer.",
        ],
      ],
      "Wer eine Person beurteilt, prüft ihre Selbstdarstellung, die spätere Erinnerung und die Sicht derer, die unter ihr litten.",
    ),
    tasks: {
      1: writing(
        "Erkläre an zwei Beispielen, wie sich Augustus oder Karl der Große selbst darstellte.",
        ["Was zeigten Münzen und Statuen?", "Welche Bauten oder Texte ließen sie anfertigen?"],
        "Augustus ließ Münzen mit seinem Kopf und seinem Ehrennamen prägen, die im ganzen Reich umliefen. Seine Statuen zeigten ihn immer jung und als siegreichen Feldherrn, auch als er alt war. So wollte er als starker Friedensbringer erscheinen. Auch sein öffentlich aufgestellter Tatenbericht diente diesem Ziel.",
        ["Zwei Beispiele genannt", "Absicht erklärt", "Richtige Zuordnung zur Person"],
      ),
      2: writing(
        "„Karl der Große war der Vater Europas.“ Beurteile diese Aussage aus mindestens zwei Blickwinkeln.",
        ["Was verband sein Reich?", "Wie erlebten die Sachsen seine Herrschaft?"],
        "Für die Aussage spricht, dass Karls Reich große Teile des heutigen Frankreich, Deutschland und Italien verband und er Bildung, Schrift und Kirche förderte; deshalb ehrt ihn heute etwa der Karlspreis. Aus Sicht der Sachsen war Karl jedoch ein Eroberer, der über dreißig Jahre Krieg führte und Menschen zur Taufe zwang. Außerdem gehörten große Teile Europas nicht zu seinem Reich. Der Titel ist also eine ehrende Deutung, die nicht alle teilen.",
        ["Positiver Blickwinkel", "Kritischer Blickwinkel", "Abgewogenes Urteil"],
      ),
    },
  },
];
