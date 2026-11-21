import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 2: Leben und Herrschaft im Mittelalter. */
export const middleAges: Lesson[] = [
  {
    id: "g7-christentum-und-herrschaft",
    lb: 2,
    title: "Christlicher Glaube und politische Herrschaft",
    period: "Mittelalter · Grundlagen Europas",
    span: [500, 1500],
    intro:
      "Im Mittelalter griffen Religion, Recht und Politik eng ineinander. Ein Blick auf unseren heutigen Staat zeigt, wie stark sich das Verhältnis gewandelt hat.",
    paragraphs: [
      "Im mittelalterlichen Europa prägte der christliche Glaube nahezu jeden Lebensbereich. Taufe, Kirchenjahr, Glockenklang und das Streben nach dem Seelenheil bestimmten den Alltag von Bauern, Bürgern und Adligen. Für das politische Denken war selbstverständlich, dass alle irdische Ordnung von Gott eingesetzt sei und Könige ihre Macht „von Gottes Gnaden“ empfingen.",
      "Darum unterstützten weltliche Herrscher die Kirche mit Land und Schutz, während Bischöfe und Äbte zugleich wichtige Aufgaben im Reich übernahmen. Sie berieten den König, stellten Schreibkundige für die Verwaltung und führten oft auch eigene Herrschaftsgebiete. Weil kaum jemand außerhalb der Kirche lesen und schreiben konnte, lag auch die Überlieferung von Gesetzen und Wissen weitgehend in geistlicher Hand.",
      "Ein moderner demokratischer Rechtsstaat wie die Bundesrepublik Deutschland trennt dagegen Staat und Kirche. Gesetze entstehen durch gewählte Parlamente, und das Grundgesetz schützt Religions- und Gewissensfreiheit für alle Menschen unabhängig von ihrem Bekenntnis. Dennoch wirken mittelalterliche Spuren weiter, etwa in Städtenamen, Kirchenbauten, Klöstern, Feiertagen und dem Gedanken einer europäischen Wertegemeinschaft.",
    ],
    takeaway:
      "Im Mittelalter waren christliche Kirche und politische Herrschaft eng verflochten; im modernen Rechtsstaat sind beide getrennt und Religionsfreiheit gilt für alle.",
    sourceIds: ["lehrplan", "pw-mittelalter", "pw-christentum"],
    quiz: check(
      "Worin unterscheidet sich die Stellung von Religion und Herrschaft im Mittelalter grundlegend vom modernen Staat?",
      "Im Mittelalter stützte Religion die Königsmacht, heute gilt Religionsfreiheit ohne Staatskirche.",
      [
        "Im Mittelalter durften nur Stadtbürger eine Kirche besuchen, auf dem Land gab es keine Pfarreien.",
        "Heute wählt die Kirche gemeinsam mit den Gerichten die Mitglieder des Bundestags.",
      ],
      [
        "Gerade auch auf dem Land bestimmten Dorfkirche und Pfarrei Alltag, Taufe und Abgaben der Menschen.",
        "Im modernen Rechtsstaat wählt allein das Volk das Parlament; Kirchen haben keine staatliche Gesetzgebungsmacht.",
      ],
      "Im Mittelalter legitimierte das Christentum die politische Ordnung unmittelbar; im demokratischen Verfassungsstaat ruht die Macht auf dem Volk und der Gewissensfreiheit.",
    ),
    diagram: {
      kind: "compare",
      title: "Religion und Staat im Vergleich",
      columns: ["Mittelalterliche Ordnung", "Moderner Verfassungsstaat"],
      rows: [
        {
          aspect: "Begründung der Macht",
          values: ["Herrschaft „von Gottes Gnaden“", "Volkssouveränität durch Wahlen"],
        },
        {
          aspect: "Rolle der Kirche",
          values: ["Geistliche beraten, verwalten und schreiben", "Trennung von Staat und Religionsgemeinschaften"],
        },
        {
          aspect: "Glaubensfreiheit",
          values: ["christliche Einheit als Norm, Minderheiten bedrängt", "Recht auf freie Religionsausübung für alle"],
        },
      ],
      caption:
        "Europäische Kultur und Staatlichkeit bauten auf mittelalterlichen Traditionen auf, entwickelten aber Schritt für Schritt weltliche Rechtsordnungen.",
    },
    workshop: classify(
      "Mittelalter oder moderner Staat?",
      ["Mittelalterliches Verständnis", "Moderner Rechtsstaat"],
      [
        [
          "Ein König wird vom Papst oder Erzbischof gesalbt und gekrönt, um Gottes Schutz zu zeigen.",
          0,
          "Die religiöse Krönung verband weltliches Amt und göttlichen Auftrag.",
        ],
        [
          "Bürgerinnen und Bürger wählen frei, wer Gesetze im Parlament beschließt.",
          1,
          "Demokratische Legitimation geht vom Volk aus, nicht von einem geistlichen Amt.",
        ],
        [
          "Bischöfe und Äbte verwalten königliche Kanzleien, weil kaum andere lesen können.",
          0,
          "Das Bildungsmonopol der Kirche machte Geistliche zu unentbehrlichen Staatsdienern.",
        ],
        [
          "Verschiedene Religionen genießen denselben verfassungsrechtlichen Schutz vor dem Gesetz.",
          1,
          "Religionsfreiheit und weltanschauliche Neutralität gehören zum modernen Staat.",
        ],
        [
          "Klosterglocken und kirchliche Feste geben den Rhythmus von Arbeit und Ruhe im Jahr vor.",
          0,
          "Kirchliche Zeitordnung durchdrang den Alltag des gesamten Gemeinwesens.",
        ],
      ],
      "Der Vergleich schärft den Blick dafür, was im Mittelalter selbstverständlich war und was erst moderne Verfassungen durchsetzten.",
    ),
    tasks: {
      1: writing(
        "Erkläre an zwei Beispielen, wie eng christliche Religion und politische Herrschaft im Mittelalter verbunden waren.",
        [
          "Denke an die Begründung der Königsherrschaft (Gottesgnadentum) und die Aufgaben von Geistlichen.",
          "Vergleiche kurz mit der heutigen Ordnung.",
        ],
        "Könige ließen sich salben und krönen, weil ihre Herrschaft als von Gott gewollt galt. Außerdem arbeiteten Bischöfe und Mönche in der Verwaltung und führten Urkunden, weil meist nur sie lesen und schreiben konnten. Heute sind Staat und Kirche getrennt und Gesetze werden von gewählten Parlamenten beschlossen.",
        [
          "Zwei historische Beispiele erklärt",
          "Rolle der Kirche als Stütze der Herrschaft benannt",
          "Unterschied zum modernen Staat erwähnt",
        ],
      ),
      2: writing(
        "Beurteile die Aussage: „Mittelalterliche Religion bremste jede staatliche Entwicklung.“",
        [
          "Nenne sowohl Leistungen kirchlicher Einrichtungen für Schriftlichkeit und Ordnung als auch Grenzen wie Intoleranz.",
          "Fälle ein abwägendes Urteil.",
        ],
        "Die Aussage greift zu kurz. Einerseits stützte eine einheitliche christliche Ordnung Vorrechte weniger Stände und grenzte Andersgläubige oft aus. Andererseits bewahrten Klöster und Geistliche Schrift, Rechtstexte und Verwaltungswissen und legten dadurch Grundlagen für spätere europäische Staaten.",
        [
          "Einseitigkeit der Aussage erkannt",
          "Aufbauende und begrenzende Folgen abgewogen",
          "Begründetes Schlussurteil formuliert",
        ],
      ),
    },
  },
  {
    id: "g7-ottonen-und-reisekoenigtum",
    lb: 2,
    title: "962: Otto der Große und das Reisekönigtum",
    period: "Früh- und Hochmittelalter · 10. Jahrhundert",
    span: [919, 1024],
    intro:
      "Im 10. Jahrhundert gab es weder eine Hauptstadt noch ein modernes Telefonnetz. Ein König musste selbst durch sein Reich reisen, um Herrschaft sichtbar auszuüben.",
    paragraphs: [
      "Nach dem Zerfall des Frankenreichs stieg im Ostfrankenreich das sächsische Geschlecht der Ottonen auf. Heinrich I. gewann 919 die Königswürde und stärkte das Bündnis mit den Herzögen. Sein Sohn Otto I. sicherte das Reich nach außen durch den Sieg über die Ungarn auf dem Lechfeld bei Augsburg im Jahr 955 und festigte im Inneren die Königsmacht.",
      "Am 2. Februar 962 krönte Papst Johannes XII. Otto I. in Rom zum Kaiser. Mit dieser Kaiserkrönung Ottos des Großen knüpfte das ostfränkisch-deutsche Königtum bewusst an Karl den Großen und das antike Römische Reich an. Bildquellen zeigen den Herrscher oft thronend mit Krone, Zepter und Reichsapfel oder auf dem Siegelring – Zeichen dafür, dass er als höchster christlicher Schutzherr galt.",
      "Weil es keine feste Hauptstadt gab, regierte Otto als Reisekönig. Mit Hofstaat, Kanzlei und Gefolge zog er Monat für Monat von Königspfalz zu Königspfalz – wie etwa nach Regensburg, Ingelheim oder Magdeburg – sowie zu Bischofssitzen und Reichsklöstern. Dort sprach er Recht, feierte hohe Kirchenfeste, versammelte Fürsten und lebte von den Vorräten der königlichen Güter.",
    ],
    takeaway:
      "962 wurde Otto der Große in Rom zum Kaiser gekrönt; als Reisekönig hielt er das Reich durch persönliche Gegenwart in Pfalzen und Klöstern zusammen.",
    sourceIds: ["lehrplan", "klexikon-otto", "pw-mittelalter"],
    quiz: check(
      "Warum regierten die ostfränkisch-deutschen Könige im 10. Jahrhundert als Reisekönige?",
      "Ohne feste Hauptstadt sicherten persönliche Präsenz, Rechtsprechung vor Ort und Pfalzvorräte die Macht.",
      [
        "Weil Könige nach den Gesetzen des Reiches höchstens eine Woche in derselben Burg wohnen durften.",
        "Weil erst ab 1356 steinerne Straßen den Bau einer festen Residenz in der Mitte Europas erlaubten.",
      ],
      [
        "Es gab kein Verbot eines festen Sitzes, sondern praktische Gründe für das Umherziehen durch ein großes Reich.",
        "Nicht mangelnde Straßen verhinderten eine Hauptstadt, sondern fehlende Geldsteuern und zentrale Ämter.",
      ],
      "Durch regelmäßige Umritte blieb der König für Herzöge sichtbar, konnte Streit schlichten und die Erträge verstreuter Königsgüter nutzen.",
    ),
    diagram: {
      kind: "steps",
      title: "Wie Reisekönigtum funktioniert",
      steps: [
        { label: "Ankunft an der Pfalz", note: "Vorratsspeicher von Königsgütern oder Klöstern versorgen den Hof" },
        { label: "Hoftag & Rechtsprechung", note: "Fürsten beraten, König schlichtet Streit und vergibt Urkunden" },
        { label: "Weiterzug im Reich", note: "Der Hof reist zur nächsten Region, um dort Präsenz zu zeigen" },
      ],
      repeats: true,
      caption:
        "Ohne ständige Zentralbehörde bedeutete die Anwesenheit des Königs vor Ort ganz konkret Herrschaft.",
    },
    workshop: timeline(
      [
        [
          "919 n. Chr.: Heinrich I. aus Sachsen wird zum König im ostfränkischen Reich erhoben.",
          "Mit Heinrich I. beginnt die Herrschaft der Ottonen.",
        ],
        [
          "936 n. Chr.: Otto I. lässt sich in Aachen in der Tradition Karls des Großen krönen.",
          "Die Wahl des Krönungsorts betont das karolingische Erbe.",
        ],
        [
          "955 n. Chr.: Ottos Heer besiegt die Ungarn auf dem Lechfeld bei Augsburg.",
          "Der Sieg beendet die Ungarneinfälle und stärkt Ottos Ansehen enorm.",
        ],
        [
          "962 n. Chr.: Papst Johannes XII. krönt Otto den Großen in Rom zum Kaiser.",
          "Die Kaiserkrönung 962 verbindet das ostfränkische Reich fest mit Italien und dem Kaisertum.",
        ],
      ],
      "Vom Königstitel 919 über den Sieg auf dem Lechfeld bis zur Kaiserkrönung 962 festigten die Ottonen ihre Stellung in Europa.",
    ),
    tasks: {
      1: writing(
        "Erkläre, welche Bedeutung die Kaiserkrönung Ottos des Großen im Jahr 962 hatte und wie das Reisekönigtum seinen Alltag prägte.",
        [
          "Nenne den Bezug zu Karl dem Großen und dem Papsttum.",
          "Erkläre zwei Aufgaben des Königs beim Besuch einer Pfalz.",
        ],
        "Mit der Kaiserkrönung 962 in Rom durch den Papst rückte Otto der Große als höchster weltlicher Schutzherr der Christenheit in die Nachfolge Karls des Großen. Weil das Reich keine feste Hauptstadt besaß, zog Otto mit seinem Hof von Pfalz zu Pfalz. Vor Ort sprach er Recht, beriet sich mit den Fürsten und nutzte die Nahrungsvorräte der Königsgüter.",
        [
          "Bedeutung von 962 erklärt",
          "Reisekönigtum mit Pfalzen beschrieben",
          "Zwei konkrete Aufgaben vor Ort genannt",
        ],
      ),
      2: writing(
        "Auf einer Geschichtskarte der Ottonenzeit liegen besonders viele Pfalzen in Sachsen, am Mittelrhein und um Regensburg, kaum welche im hohen Norden. Erkläre, was diese Verteilung über die Königsmacht verrät.",
        [
          "Überlege, wo sich die Königsgüter und Hausmacht der Ottonen befanden.",
          "Schließe daraus auf Regionen mit starker und schwächerer Königsnähe.",
        ],
        "Die Häufung von Pfalzen in Sachsen und entlang von Rhein und Donau zeigt, dass der König sich vor allem auf seine eigenen Hausgüter und verkehrsgünstige Flusswege stützte. In Gebieten ohne Pfalzen erschien er selten, sodass dort einheimische Herzöge und Grafen weitgehend selbstständig regierten. Königsmacht war also räumlich ungleich verteilt.",
        [
          "Kartenbefund auf Hausmacht und Verkehrswege bezogen",
          "Unterschied zwischen königsnahen und königsfernen Räumen erkannt",
          "Folgerung zur begrenzten Zentralmacht gezogen",
        ],
      ),
    },
  },
  {
    id: "g7-grundherrschaft-und-staende",
    lb: 2,
    title: "Grundherrschaft und Ständeordnung",
    period: "Mittelalter · Agrargesellschaft",
    span: [750, 1450],
    intro:
      "Über 90 Prozent der Menschen im Mittelalter arbeiteten auf dem Land. Ihr Leben bestimmte die Grundherrschaft – gerechtfertigt durch das Bild der drei Stände.",
    paragraphs: [
      "Die mittelalterliche Gesellschaft verstand sich als gottgewollte Ständeordnung mit drei großen Gruppen. Der erste Stand war die Geistlichkeit (Klerus) als Lehr- und Betstand, der für das Seelenheil sorgte. Der zweite Stand war der Adel als Wehrstand, der Schutz und Rechtsprechung übernahm. Der dritte Stand umfasste die arbeitende Bevölkerung auf dem Land und später auch Bürger in den Städten als Nährstand.",
      "Die Grundlage des Landlebens bildete die Grundherrschaft. Ein Grundherr – etwa ein Adliger, ein Bischof oder ein Kloster – war Eigentümer von Grund und Boden. Einen Teil des Landes, den Fronhof, bewirtschaftete er selbst; den Rest, die sogenannten Hufen, verlieh er an abhängige Bauern zur Nutzung. Weil es keinen sozialen Aufstieg durch Leistung gab, blieben die Grenzen zwischen den Ständen meist lebenslang fest.",
      "Als Gegenleistung für Schutz und Land schuldeten die Hörigen oder Leibeigenen dem Grundherrn regelmäßige Abgaben wie Getreide, Eier, Vieh und den Zehnten an die Kirche. Hinzu kamen Frondienste, also unbezahlte Arbeit auf den Feldern, beim Wald- oder Wegebau des Herrn. Dafür gewährte der Grundherr Schutz vor Überfällen und regelte Streitigkeiten vor seinem Hofgericht.",
    ],
    takeaway:
      "In der Grundherrschaft erhielten abhängige Bauern Land und Schutz gegen Abgaben und Frondienste; die Drei-Stände-Ordnung wies jedem Stand feste Rechte und Pflichten zu.",
    sourceIds: ["lehrplan", "pw-mittelalter", "pw-kloster"],
    quiz: check(
      "Welcher Stand umfasste im mittelalterlichen Ständemodell über 90 Prozent der Bevölkerung und trug durch Frondienste und Abgaben die materielle Last?",
      "Der dritte Stand der Bauern und Handwerker (Nährstand).",
      [
        "Der zweite Stand des Adels und der Ritter (Wehrstand).",
        "Der erste Stand der Geistlichkeit in Kirche und Kloster (Lehrstand).",
      ],
      [
        "Der Adel bildete eine kleine führende Minderheit; er nahm Abgaben entgegen und leistete Kriegsdienst.",
        "Die Geistlichkeit bildete den kleinen ersten Stand und erhielt selbst Abgaben wie den Zehnten.",
      ],
      "Fast die gesamte Bevölkerung gehörte zum dritten Stand und erwirtschaftete mit ihrer Arbeit die Versorgung für alle Stände.",
    ),
    diagram: {
      kind: "pyramid",
      title: "Aufbau der mittelalterlichen Ständegesellschaft",
      layers: [
        { label: "1. Stand · Geistlichkeit (Klerus)", note: "beten und lehren · Bischöfe, Priester, Mönche und Nonnen" },
        { label: "2. Stand · Adel (Ritter und Fürsten)", note: "kämpfen, schützen und richten · Grundherren und Landesfürsten" },
        { label: "3. Stand · Stadtbürger (Minderheit)", note: "handeln und produzieren · eigenes Stadtrecht seit dem Hochmittelalter" },
        { label: "3. Stand · Abhängige Bauern (über 90 %)", note: "ernähren alle · Hufenwirtschaft gegen Abgaben und Frondienste" },
      ],
      caption:
        "Rechte hingen von der Geburt ab: Adel und hoher Klerus genossen Vorrechte, während die breite Mehrheit Abgaben leistete.",
    },
    workshop: classify(
      "Wer leistet was in der Grundherrschaft?",
      ["Pflicht des Bauern", "Leistung des Grundherrn", "Merkmal der Ständeordnung"],
      [
        [
          "Unbezahlte Ernte- und Spanndienste auf den Feldern des Fronhofs.",
          0,
          "Frondienste gehörten zu den schwersten Arbeitsbelastungen abhängiger Bauern.",
        ],
        [
          "Militärischer Schutz des Dorfes bei Fehden und Raubzügen.",
          1,
          "Schutz und Schirm waren die zentrale Gegenleistung des adligen Grundherrn.",
        ],
        [
          "Abgabe von Getreide, Geflügel und dem zehnten Teil des Ertrags.",
          0,
          "Naturalabgaben sicherten die Versorgung des herrschaftlichen Haushalts und der Kirche.",
        ],
        [
          "Überlassung einer Bauernstelle (Hufe) zur Selbstversorgung der Familie.",
          1,
          "Der Grundherr blieb Eigentümer des Bodens, verlieh aber das Nutzungsrecht.",
        ],
        [
          "Die Zugehörigkeit zu Adel oder Bauernstand ist durch Geburt festgelegt und gilt als gottgewollt.",
          2,
          "Ungleichheit galt im Mittelalter als feste Ordnung, nicht als veränderbares Unrecht.",
        ],
      ],
      "Grundherrschaft verband wirtschaftliche Abhängigkeit mit Schutz und Rechtsprechung auf lokaler Ebene.",
    ),
    tasks: {
      1: writing(
        "Beschreibe das Verhältnis zwischen Grundherr und abhängigen Bauern in der mittelalterlichen Grundherrschaft.",
        [
          "Nenne, was der Grundherr zur Verfügung stellt.",
          "Nenne zwei Pflichten der Bauern als Gegenleistung.",
        ],
        "Der Grundherr besaß Grund und Boden, verlieh den Bauern eine Hufe zum Wirtschaften, schützte sie vor Überfällen und sprach im Hofgericht Recht. Dafür mussten die abhängigen Bauern Naturalabgaben wie Getreide sowie den Zehnten abliefern und unbezahlte Frondienste auf den Feldern des Fronhofs leisten.",
        [
          "Leistungen des Grundherrn genannt",
          "Abgaben und Frondienste der Bauern erklärt",
          "Gegenseitige Abhängigkeit beschrieben",
        ],
      ),
      2: writing(
        "Vergleiche das Denken der Ständeordnung mit dem Grundsatz moderner Verfassungen „Alle Menschen sind vor dem Gesetz gleich“.",
        [
          "Erkläre, wovon Rechte im Mittelalter abhingen.",
          "Zeige, wie grundlegend sich Rechtsgleichheit davon unterscheidet.",
        ],
        "In der Ständeordnung bestimmte die Geburt über Rechte, Pflichten, Steuern und Gerichtsstand: Adel und Geistlichkeit besaßen Vorrechte, während Bauern gebunden waren. Im modernen Rechtsstaat gelten dagegen für alle Bürgerinnen und Bürger dieselben Grundrechte und Gesetze, unabhängig von Herkunft oder Beruf.",
        [
          "Geburtsrechte in der Ständeordnung erklärt",
          "Rechtsgleichheit im modernen Staat dargestellt",
          "Gegensatz klar herausgearbeitet",
        ],
      ),
    },
  },
  {
    id: "g7-lehnswesen",
    lb: 2,
    title: "Das Lehnswesen: Treue, Rat und Heeresfolge",
    period: "Mittelalter · Politische Ordnung des Adels",
    span: [800, 1300],
    intro:
      "Während die Grundherrschaft das Verhältnis zum Bauern regelte, band das Lehnswesen den König und den Adel durch persönliche Treueeide aneinander.",
    paragraphs: [
      "Weil ein mittelalterlicher König keine Beamtenschaft mit Monatsgehalt bezahlen konnte, vergab er Land oder wichtige Ämter als Lehen an mächtige Adlige, die sogenannten Kronvasallen. Im Gegenzug legte der Vasall bei der feierlichen Belehnung seine gefalteten Hände in die Hände des Herrn und schwor ihm lebenslange Treue.",
      "Dieses politische Treueverhältnis verpflichtete beide Seiten. Der Lehnsherr schuldete dem Vasallen Schutz vor Feinden und den Erhalt des Lehens. Der Vasall schuldete dem Herrn „Rat und Hilfe“: Er beriet ihn auf Hoftagen und leistete im Kriegsfall als schwer bewaffneter Ritter mit eigenen Reitern Heeresfolge.",
      "Die Kronvasallen – wie Herzöge, Markgrafen oder Bischöfe – konnten große Lehen ihrerseits an kleinere Adlige und Ritter als Untervasallen weiterverleihen. So entstand die Lehnspyramide. Im Laufe der Jahrhunderte wurden Lehen jedoch faktisch erblich: Aus persönlichen Dienstgütern wuchsen eigene Fürstentümer, was die zentrale Königsmacht allmählich schwächte.",
    ],
    takeaway:
      "Das Lehnswesen verband König und Adel über Lehen und Treueeid: Schutz gegen Rat und Heeresfolge; die Erblichkeit von Lehen stärkte später die Fürsten.",
    sourceIds: ["lehrplan", "pw-mittelalter", "pw-ritter"],
    quiz: check(
      "Worin liegt der genaue Unterschied zwischen Lehnswesen und Grundherrschaft?",
      "Das Lehnswesen regelte Politik und Kriegsdienst im Adel, die Grundherrschaft die Agrararbeit der Bauern.",
      [
        "Das Lehnswesen galt nur in Italien, die Grundherrschaft dagegen nur nördlich der Alpen.",
        "Im Lehnswesen zahlten Herzöge jedes Jahr einen Zehnten aus Weizen an ihre Leibeigenen.",
      ],
      [
        "Beide Ordnungen prägten das gesamte mittelalterliche Mitteleuropa gleichzeitig auf unterschiedlichen Ebenen.",
        "Der Zehnte und Naturalabgaben gehörten in die Grundherrschaft und an die Kirche, nicht in das adlige Lehnsverhältnis.",
      ],
      "Lehnsherr und Vasall standen beide innerhalb des Adels oder hohen Klerus; abhängige Bauern lebten in der Grundherrschaft.",
    ),
    diagram: {
      kind: "steps",
      title: "Gegenseitigkeit im Lehnswesen",
      steps: [
        { label: "1 · Lehnsherr (König / Fürst)", note: "verleiht Land oder Amt (Lehen) und verspricht Schutz und Schirm" },
        { label: "2 · Belehnung & Treueeid", note: "Handgang und Schwur begründen ein persönliches Treueverhältnis" },
        { label: "3 · Vasall (Fürst / Ritter)", note: "leistet Heeresfolge als Panzerreiter und gibt Rat am Hof" },
      ],
      repeats: false,
      caption:
        "Anders als bei einer heutigen Anstellung gründete das Lehnswesen auf einem persönlichen Eid zwischen Adligen.",
    },
    workshop: classify(
      "Lehnswesen oder Grundherrschaft?",
      ["Lehnswesen (Adel & König)", "Grundherrschaft (Grundherr & Bauern)"],
      [
        [
          "Ein Herzog empfängt ein Fahnenlehen vom König und verspricht dafür Treue und Heerfolge.",
          0,
          "Die Vergabe eines Herzogtums an einen Kronvasallen gehört ins politische Lehnswesen.",
        ],
        [
          "Eine Bauernfamilie bestellt eine Hufe und liefert nach der Ernte Roggen an das Gutshaus.",
          1,
          "Landleihe an Bauern gegen Naturalabgaben ist Kern der Grundherrschaft.",
        ],
        [
          "Ein Ritter schwört seinem Grafen den Treueeid und rückt im Kriegsfall gerüstet aus.",
          0,
          "Untervasallen schuldeten ihrem adligen Herrn militärische Hilfe.",
        ],
        [
          "Dorfbewohner leisten dreimal pro Woche Hand- und Spanndienste auf den Feldern des Herrn.",
          1,
          "Frondienste auf dem Fronhof betreffen abhängige Bauern.",
        ],
        [
          "Große Lehen werden nach dem Tod des Vaters regelmäßig an den Sohn weitergegeben.",
          0,
          "Die Erblichkeit adliger Lehen schwächte langfristig die direkte Kontrolle des Königs.",
        ],
      ],
      "Wer Lehnswesen und Grundherrschaft trennt, verwechselt nicht mehr Rittervasallen mit abgabepflichtigen Bauern.",
    ),
    tasks: {
      1: writing(
        "Erkläre einem Mitschüler, was ein Lehen war und welche Pflichten Lehnsherr und Vasall beim Lehnseid eingingen.",
        [
          "Nenne Beispiele dafür, was als Lehen vergeben wurde.",
          "Unterscheide klar die Pflichten beider Seiten.",
        ],
        "Ein Lehen war meist ein Stück Land mit Einkünften oder ein hohes Amt, das ein Lehnsherr einem adligen Vasallen zur Nutzung überließ. Der Lehnsherr verpflichtete sich dafür zu Schutz und Erhalt des Lehens. Der Vasall schwor im Treueeid, dem Herrn mit Rat am Hof und militärischer Heeresfolge beizustehen.",
        [
          "Begriff Lehen erklärt",
          "Schutzpflicht des Herrn genannt",
          "Rat und Heeresfolge des Vasallen genannt",
        ],
      ),
      2: writing(
        "Begründe, warum die Erblichkeit der Lehen für den deutschen König auf Dauer zu einem Problem werden konnte.",
        [
          "Überlege, was passiert, wenn der König ein Lehen nach dem Tod eines Vasallen nicht mehr frei neu vergeben kann.",
          "Denke an die Entstehung mächtiger Fürstentümer.",
        ],
        "Solange der König ein erledigtes Lehen neu vergeben durfte, konnte er Treue belohnen und Macht lenken. Sobald Kronvasallen ihre Lehen jedoch selbstverständlich an ihre Söhne vererbten, betrachteten sie die Gebiete wie eigenen Familienbesitz. Dadurch verloren die Könige Einfluss, während die Landesfürsten ihre eigene Herrschaft ausbauten.",
        [
          "Verlust des freien Vergaberechts erklärt",
          "Übergang zu erblicher Fürstenmacht gezeigt",
          "Folge für die Königsmacht abgeleitet",
        ],
      ),
    },
  },
  {
    id: "g7-kloester",
    lb: 2,
    title: "Klöster: Beten, arbeiten und Wissen bewahren",
    period: "Mittelalter · Kirche und Alltag",
    span: [700, 1500],
    intro:
      "Hinter Klostermauern entstanden Handschriften, Heilkräuter und Musterhöfe. Klöster prägten Religion, Wirtschaft und Bildung weit über ihre Umgebung hinaus.",
    paragraphs: [
      "Mönche und Nonnen lebten nach strengen Ordensregeln wie der Regel des heiligen Benedikt: „Ora et labora“ – bete und arbeite. Der Tag war streng nach Gebetszeiten geordnet, von der Nachtmette bis zur Vesper. Männer und Frauen verzichteten auf eigenen Besitz, heirateten nicht und ordneten sich dem Abt oder der Äbtissin unter.",
      "Zugleich bildeten große Abteien wie Reichenau, St. Gallen, Tegernsee oder Prüfening wahre Wissens- und Versorgungszentren. Im Skriptorium schrieben Mönche antike Werke, Chroniken und Bibeltexte von Hand ab und malten prachtvolle Initialen hinein. In Klosterschulen lernten künftige Geistliche und Adlige Latein, Rechnen und Musik.",
      "Auch wirtschaftlich und sozial waren Klöster unentbehrlich. Sie betrieben Mühlen, Brauereien, Fischteiche und erprobten neue Anbaumethoden, rodeten Wälder und vergaben Hufen als Grundherren. Zudem pflegten sie Kranke in eigenen Hospizen, nahmen Reisende auf und verteilten Almosen an Arme – wodurch sie für die Menschen oft wie ein soziales Netz wirkten.",
    ],
    takeaway:
      "Klöster waren geistliche Gemeinschaften und zugleich Zentren von Bildung, Buchkunst, Heilkunde, Armenfürsorge und Grundherrschaft.",
    sourceIds: ["lehrplan", "pw-kloster", "pw-christentum"],
    quiz: check(
      "Welche drei Aufgaben erfüllte ein mittelalterliches Kloster über das Gebet hinaus?",
      "Schule und Buchabschrift, Krankenpflege für Gäste sowie Landwirtschaft und Grundherrschaft.",
      [
        "Ausbildung von Fernhändlern, Vergabe von Stadtrechten und Wahl der Kurfürsten.",
        "Aufstellung schwerer Ritterheere und Bau von großen Hochseeschiffen.",
      ],
      [
        "Stadtrechte vergaben Stadtherren, die Kurfürsten wählten den König; das waren keine Klosteraufgaben.",
        "Schwere Ritterheere und Hochseeflotten gehörten zu Adel und Seestädten, nicht zum Klosterleben.",
      ],
      "In Skriptorium, Klosterschule, Kräutergarten, Hospital und eigenen Werkstätten vereinten Klöster Kultur und Wirtschaft.",
    ),
    diagram: {
      kind: "layers",
      title: "Bereiche eines mittelalterlichen Klosters",
      layers: [
        { label: "Klosterkirche & Kreuzgang", note: "Mittelpunkt des täglichen Gebets nach der Ordensregel" },
        { label: "Skriptorium & Bibliothek", note: "Abschreiben und Bewahren antiker und christlicher Bücher" },
        { label: "Krankenhaus & Kräutergarten", note: "Heilkunde, Armenfürsorge und Unterkunft für Reisende" },
        { label: "Werkstätten & Gutshof", note: "Handwerk, Mühle, Landwirtschaft und Grundherrschaft" },
      ],
      caption:
        "Wie der berühmte St. Galler Klosterplan aus dem 9. Jahrhundert zeigt, waren Abteien fast wie kleine Städte organisiert.",
    },
    workshop: classify(
      "Aufgaben eines mittelalterlichen Klosters",
      ["Glaube & Ordnung", "Bildung & Wissen", "Wirtschaft & Fürsorge"],
      [
        [
          "Mönche und Nonnen versammeln sich siebenmal am Tag und nachts zum Chorgebet.",
          0,
          "Der feste Gebetsrhythmus bildete das geistliche Herz des Ordenslebens.",
        ],
        [
          "Schreiber kopieren mühsam auf Pergament römische Texte und Chroniken.",
          1,
          "Ohne klösterliche Skriptorien wären viele antike Schriften verloren gegangen.",
        ],
        [
          "In der Klosterschule erhalten Knaben Unterricht in lateinischer Grammatik und Gesang.",
          1,
          "Klöster waren über Jahrhunderte die wichtigsten Schulträger Europas.",
        ],
        [
          "Im Spital werden Pilger und Kranke mit Heilpflanzen aus dem Klostergarten versorgt.",
          2,
          "Klöster übernahmen eine frühe medizinische und soziale Versorgung.",
        ],
        [
          "Das Kloster verpachtet Höfe an Bauern, betreibt eine Wassermühle und verkauft Überschüsse.",
          2,
          "Viele Abteien waren wohlhabende Grundherren und Wirtschaftsbetriebe.",
        ],
      ],
      "Klöster hielten Schriftkultur, Krankenpflege und Agrarwissen über unsichere Jahrhunderte hinweg lebendig.",
    ),
    tasks: {
      1: writing(
        "Erkläre anhand dreier Bereiche, warum Klöster für das Leben der Menschen im Mittelalter so prägend waren.",
        [
          "Nenne neben dem Gebet zwei weltliche oder kulturelle Aufgaben (z. B. Schrift, Medizin, Wirtschaft).",
          "Schreibe ganze Sätze mit klaren Beispielen.",
        ],
        "Klöster prägten das Mittelalter erstens als Orte des Gebets nach festen Ordensregeln. Zweitens bewahrten sie im Skriptorium und in der Klosterschule Schrift, Latein und Wissen. Drittens halfen sie durch Krankenpflege, Gästehäuser, Kräutergärten und eigene Werkstätten der umliegenden Bevölkerung.",
        [
          "Geistliche Funktion genannt",
          "Bildung oder Buchkultur erklärt",
          "Wirtschaftliche oder soziale Rolle belegt",
        ],
      ),
      2: writing(
        "Viele bayerische Klöster wurden vor über tausend Jahren gegründet und prägen Orte bis heute. Begründe am Beispiel deiner Umgebung oder Bayerns, welche Spuren geblieben sind.",
        [
          "Denke an Ortsnamen auf „-münster“, „-zell“ oder „-kloster“, Gebäude, Brauereien oder Bibliotheken.",
          "Beziehe dich auf den kulturellen Wert dieser Relikte.",
        ],
        "Klöster wie Tegernsee, Benediktbeuern, Niederaltaich oder Prüfening prägen Bayern bis heute durch barock überformte Kirchen, wertvolle Handschriften in Bibliotheken, alte Teiche und Brauereien. Auch Schulen oder Krankenhäuser in kirchlicher Trägerschaft knüpfen oft an diese lange Tradition an. Solche Relikte zeigen, wie stark Bildung und Alltag aus dem Mittelalter hervorgegangen sind.",
        [
          "Konkretes Beispiel oder Merkmal aus Bayern genannt",
          "Bleibende kulturelle Spuren erklärt",
          "Bezug zur Gegenwart hergestellt",
        ],
      ),
    },
  },
  {
    id: "g7-investiturstreit",
    lb: 2,
    title: "Reichskirche und Investiturstreit",
    period: "Hochmittelalter · 1050 bis 1122",
    span: [1046, 1122],
    intro:
      "Wer darf in Bischofsstädten das Sagen haben: der König, weil Bischöfe Reichsgebiet verwalten – oder der Papst, weil es um ein geistliches Amt geht?",
    paragraphs: [
      "Seit Otto dem Großen stützten sich die Könige auf die sogenannte Reichskirche. Sie setzten zuverlässige Bischöfe und Äbte ein und übergaben ihnen nicht nur Ring und Stab als geistliche Zeichen, sondern auch Grafschaften, Zölle und Städte als Lehen. Anders als weltliche Fürsten konnten Bischöfe keine ehelichen Söhne haben, sodass ihre Lehen nach dem Tod an den König zurückfielen.",
      "Im 11. Jahrhundert forderte eine kirchliche Reformbewegung jedoch die Freiheit der Kirche vom Einfluss weltlicher Herrscher. Papst Gregor VII. verbot 1075 die Investitur durch Laien – also die Einsetzung von Bischöfen durch König oder Herzog. König Heinrich IV. wollte auf diese wichtige Machtstütze nicht verzichten, erklärte Gregor VII. für abgesetzt und wurde daraufhin 1076 vom Papst mit dem Kirchenbann belegt.",
      "Ohne Rückhalt bei den eigenen Fürsten musste Heinrich IV. im Winter 1077 im Büßergewand zur Burg Canossa ziehen, um die Lösung vom Bann zu erbitten. Der Konflikt dauerte dennoch Jahrzehnte, bis 1122 das Wormser Konkordat einen Kompromiss fand: Der Papst verlieh fortan Ring und Stab für das geistliche Amt, der König das Zepter für die weltlichen Güter.",
    ],
    takeaway:
      "Im Investiturstreit rangen König und Papst um die Einsetzung der Bischöfe; das Wormser Konkordat 1122 trennte geistliches Amt und weltliche Lehen.",
    sourceIds: ["lehrplan", "pw-salier", "pw-mittelalter"],
    quiz: check(
      "Wie löste das Wormser Konkordat im Jahr 1122 den Investiturstreit zwischen König und Papst?",
      "Der Papst vergab das geistliche Amt mit Ring und Stab, der König die weltlichen Rechte mit dem Zepter.",
      [
        "Der König behielt allein das Recht, jeden neuen Papst in Rom auf Lebenszeit zu bestimmen.",
        "Die Bischöfe verzichteten freiwillig auf alle Städte, Länder und Abgaben im Heiligen Römischen Reich.",
      ],
      [
        "Umgekehrt hatte die Reformpartei das Ernennungsrecht des Königs über das Papsttum bereits zurückgedrängt.",
        "Bischöfe blieben wichtige Reichsfürsten mit großen weltlichen Gebieten, empfingen diese aber getrennt vom geistlichen Amt.",
      ],
      "Die Zweiteilung der Symbole (Ring und Stab versus Zepter) trennte geistliche Weihe und weltliches Reichslehen.",
    ),
    diagram: {
      kind: "compare",
      title: "Wie König und Papst Herrschaft rechtfertigten",
      columns: ["König Heinrich IV.", "Papst Gregor VII."],
      rows: [
        {
          aspect: "Anspruch auf Bischöfe",
          values: ["setzt Bischöfe ein, weil sie Reichsämter tragen", "nur die Kirche darf geistliche Ämter verleihen"],
        },
        {
          aspect: "Begründung",
          values: ["König als von Gott eingesetzter Schirmherr der Kirche", "Papst als Stellvertreter Christi steht über Königen"],
        },
        {
          aspect: "Machtmittel",
          values: ["Absetzungserklärung auf Hoftagen, Heerzug", "Kirchenbann und Lösung der Untertanen vom Treueeid"],
        },
      ],
      caption:
        "Schrift- und Bildquellen des 11. Jahrhunderts zeigen zwei unvereinbare Antworten auf die Frage, wem die letzte Entscheidung zusteht.",
    },
    workshop: timeline(
      [
        [
          "962 n. Chr.: Otto I. baut die Reichskirche aus und vergibt weltliche Rechte an Bischöfe.",
          "Damit beginnt die enge Abhängigkeit der Königsmacht von Reichsbischöfen.",
        ],
        [
          "1075 n. Chr.: Papst Gregor VII. verbietet die Einsetzung von Bischöfen durch weltliche Herrscher.",
          "Das Verbot der Laieninvestitur löst den offenen Machtkampf aus.",
        ],
        [
          "1077 n. Chr.: König Heinrich IV. bittet in Canossa um die Aufhebung des Kirchenbanns.",
          "Der Gang nach Canossa rettet Heinrichs Krone, schwächt aber sein göttliches Ansehen.",
        ],
        [
          "1122 n. Chr.: Kaiser Heinrich V. und Papst Calixt II. schließen das Wormser Konkordat.",
          "Geistliche Investitur durch den Papst und weltliche Belehnung durch den König werden getrennt.",
        ],
      ],
      "Vom Ausbau der Reichskirche bis 1122 veränderte der Investiturstreit das Verhältnis zwischen geistlicher und weltlicher Gewalt dauerhaft.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum der Streit um die Bischofsernennung für König Heinrich IV. so gefährlich war und was der Kirchenbann 1076 bewirkte.",
        [
          "Denke an die Rolle der Bischöfe als Reichsfürsten und Stützen des Königs.",
          "Erkläre, wie der Kirchenbann auf den Treueeid der Fürsten wirkte.",
        ],
        "Für Heinrich IV. waren Bischöfe als verlässliche Verwalter und Truppensteller unentbehrlich, weil ihre Lehen nicht an Söhne vererbt wurden. Als Papst Gregor VII. ihn 1076 mit dem Kirchenbann belegte, entband er zugleich die Fürsten von ihrem Treueeid. Viele deutsche Adlige drohten Heinrich daraufhin mit der Absetzung, weshalb er nach Canossa reisen musste.",
        [
          "Bedeutung der Bischöfe für den König erklärt",
          "Wirkung des Kirchenbanns auf Treueeid benannt",
          "Folge für Canossa 1077 gezogen",
        ],
      ),
      2: writing(
        "Vergleiche anhand zweier gegensätzlicher Behauptungen – „Der König steht als Gesalbter über Bischöfen“ und „Der Papst darf selbst Könige absetzen“ –, wie beide Seiten Herrschaft rechtfertigten.",
        [
          "Ordne beide Sätze Heinrich IV. und Gregor VII. zu.",
          "Erkläre, warum der Kompromiss von 1122 langfristig auch die Entstehung getrennter Bereiche förderte.",
        ],
        "Heinrich IV. berief sich auf das hergebrachte Königtum von Gottes Gnaden, das den Schutz und die Leitung der Reichskirche einschloss. Gregor VII. leitete aus dem Petrusamt des Papstes hingegen eine Überordnung der geistlichen über jede weltliche Gewalt ab. Das Wormser Konkordat trennte beide Sphären erstmals symbolisch und bereitete so langfristig das Verständnis getrennter weltlicher und geistlicher Aufgaben vor.",
        [
          "Beide Begründungsweisen zugeordnet",
          "Gegensatz der Herrschaftsrechtfertigung erklärt",
          "Langfristige Bedeutung von 1122 beurteilt",
        ],
      ),
    },
  },
  {
    id: "g7-koenig-reich-kurfuersten",
    lb: 2,
    title: "König, Kurfürsten und Goldene Bulle 1356",
    period: "Hoch- und Spätmittelalter · 13. und 14. Jahrhundert",
    span: [1220, 1450],
    intro:
      "Im Heiligen Römischen Reich erbte kein Kronprinz automatisch die Krone. Ein festes Wahlrecht musste Doppelwahlen verhindern – zugleich erstarkten die Landesfürsten.",
    paragraphs: [
      "Anders als etwa in Frankreich blieb das Heilige Römische Reich (erst seit dem späten 15. Jahrhundert mit dem Zusatz „Deutscher Nation“) eine Wahlmonarchie. Nach dem Ende der Stauferzeit stritten mehrere Fürstenparteien oft jahrelang um den Thron, sodass zeitweise sogar zwei Könige gleichzeitig gewählt wurden. Gleichzeitig wuchsen die Gebiete der Fürsten durch Burgenbau, eigene Gerichte und Steuern zu geschlossenen Landesherrschaften zusammen – diesen Vorgang nennt man Territorialisierung.",
      "Um Doppelwahlen und Einmischungen des Papstes endgültig zu beenden, erließ Kaiser Karl IV. im Jahr 1356 das Reichsgrundgesetz der Goldenen Bulle. Darin legte er genau sieben Kurfürsten fest, die den römisch-deutschen König künftig per Mehrheitsbeschluss in Frankfurt wählten: drei geistliche Erzbischöfe (Mainz, Köln, Trier) und vier weltliche Fürsten (König von Böhmen, Pfalzgraf bei Rhein, Herzog von Sachsen, Markgraf von Brandenburg).",
      "Mit dem Reichsgesetz gewann das Reich feste Wahlregeln, aber keinen starken Zentralstaat. Neben den Kurfürsten vertraten auch die übrigen Fürsten sowie später Reichsstädte ihre Interessen als Reichsstände auf Reichstagen. Viele kleine und große Territorien, darunter das Herzogtum Bayern, entwickelten ihre eigene Verwaltung und Rechtsprechung weiter.",
    ],
    takeaway:
      "Die Goldene Bulle von 1356 regelte die Wahl des Königs durch sieben Kurfürsten; durch Territorialisierung entwickelten sich eigenständige Landesfürstentümer wie Bayern.",
    sourceIds: ["lehrplan", "hlb-kurfuersten", "pw-staufer"],
    quiz: check(
      "Wie viele Kurfürsten hatten nach der Goldenen Bulle von 1356 das Recht, den römisch-deutschen König zu wählen?",
      "Sieben Kurfürsten: drei geistliche und vier weltliche Fürsten.",
      [
        "Zwölf Kurfürsten: sechs Bischöfe und sechs städtische Bürgermeister.",
        "Drei Kurfürsten: der Papst, der König von Frankreich und ein Herzog.",
      ],
      [
        "Städte hatten kein Königswahlrecht, und es waren exakt sieben geistliche und weltliche Fürsten.",
        "Weder der Papst noch ausländische Könige besaßen ein Stimmrecht in der Frankfurter Kurfürstenversammlung.",
      ],
      "Karl IV. bestimmte 1356 die Erzbischöfe von Mainz, Köln und Trier sowie die Herrscher von Böhmen, Pfalz, Sachsen und Brandenburg.",
    ),
    diagram: {
      kind: "pyramid",
      title: "Machtverteilung im Spätmittelalter (Heiliges Römisch-Deutsches Reich)",
      layers: [
        { label: "Römisch-deutscher König / Kaiser", note: "gewähltes Reichsoberhaupt ohne zentrale Reichssteuer" },
        { label: "Die 7 Kurfürsten (seit 1356)", note: "Mainz, Köln, Trier · Böhmen, Pfalz, Sachsen, Brandenburg" },
        { label: "Weitere Reichsstände", note: "geistliche und weltliche Fürsten, Grafen sowie Reichsstädte" },
        { label: "Untertanen in Territorien und Städten", note: "unterstehen dem jeweiligen Landesherrn oder Stadtrat" },
      ],
      caption:
        "Das Reich war kein zentral regierter Einheitsstaat, sondern ein Flickenteppich aus Kurfürstentümern, Herzogtümern, Bistümern und Reichsstädten.",
    },
    workshop: classify(
      "Wahlmonarchie und Territorialisierung",
      ["Wahlkönigtum & Goldene Bulle", "Territorialisierung & Landesfürsten"],
      [
        [
          "In Frankfurt entscheidet die einfache Mehrheit der sieben Kurfürsten über den neuen König.",
          0,
          "Das Mehrheitsprinzip von 1356 verhinderte künftige Doppelwahlen.",
        ],
        [
          "Der bayerische Herzog baut eigene Ämter, Landgerichte und Zölle in seinem Gebiet auf.",
          1,
          "Landesherren festigten geschlossene Herrschaftsräume unter eigener Verwaltung.",
        ],
        [
          "Der Papst verliert durch das Reichsgesetz seinen Anspruch, die Königswahl erst genehmigen zu müssen.",
          0,
          "Die Goldene Bulle stärkte die Unabhängigkeit der deutschen Königswahl von Rom.",
        ],
        [
          "Auf dem Land gehört der Gerichtssitz nicht mehr wandernden Königen, sondern dem Landesfürsten.",
          1,
          "Das alte Reisekönigtum wich schrittweise festen fürstlichen Residenzen.",
        ],
        [
          "Zu den drei geistlichen Wählern zählen die Erzbischöfe von Mainz, Köln und Trier.",
          0,
          "Diese drei Erzkanzler bildeten den geistlichen Teil des Kurfürstenkollegiums.",
        ],
      ],
      "1356 sicherte den Frieden bei Königswahlen, bestätigte aber zugleich die Eigenständigkeit der großen Fürstentümer.",
    ),
    tasks: {
      1: writing(
        "Erkläre, welches Problem die Goldene Bulle von 1356 lösen sollte und wer nach diesem Gesetz den König wählte.",
        [
          "Denke an frühere Doppelwahlen und den Streit mit dem Papst.",
          "Nenne Anzahl und Gruppen der Kurfürsten.",
        ],
        "Vor 1356 kam es öfter zu Doppelwahlen und Kämpfen um den Thron, weil nicht eindeutig geregelt war, wessen Stimme zählte. Kaiser Karl IV. bestimmte deshalb in der Goldenen Bulle genau sieben Kurfürsten – die drei Erzbischöfe von Mainz, Köln und Trier sowie vier weltliche Fürsten –, die den König mehrheitlich wählten. Eine päpstliche Zustimmung war damit für das Königtum nicht mehr nötig.",
        [
          "Problem vor 1356 genannt",
          "Sieben Kurfürsten richtig beschrieben",
          "Mehrheitswahl oder Ausschaltung päpstlicher Mitsprache erwähnt",
        ],
      ),
      2: writing(
        "Begründe, warum das Heilige Römische Reich auf Geschichtskarten um 1400 aus sehr vielen kleinen und großen Gebieten bestand statt aus einem einzigen einheitlichen Königreich.",
        [
          "Verwende den Begriff Territorialisierung.",
          "Beziehe die Macht der Landesfürsten und Reichsstädte mit ein.",
        ],
        "Anders als in Frankreich oder England setzten im Heiligen Römischen Reich die Landesfürsten durch, dass Lehen erblich blieben und königliche Rechte an sie übergingen. Durch diese Territorialisierung bauten Herzöge, Bischöfe und freie Reichsstädte eigene Gerichte, Verwaltungen und Zölle auf. Auf Karten zeigt sich daher ein Mosaik zahlreicher eigenständiger Territorien unter einem gemeinsamen König.",
        [
          "Begriff Territorialisierung sachgerecht angewandt",
          "Rolle der Fürsten und Reichsstädte erklärt",
          "Kartenbild als Flickenteppich gedeutet",
        ],
      ),
    },
  },
  {
    id: "g7-staufer-ritter-architektur",
    lb: 2,
    title: "Um 1200: Höfische Kultur und Rittertum",
    period: "Hochmittelalter · Stauferzeit um 1200",
    span: [1152, 1250],
    intro:
      "Um das Jahr 1200 erlebte das Reich unter den Staufern eine kulturelle Blüte: Ritterturniere, Minnelieder und gewaltige Dome prägten das Selbstbild des Adels.",
    paragraphs: [
      "Unter den Kaisern aus dem Geschlecht der Staufer – wie Friedrich I. Barbarossa und Friedrich II. – erreichte die ritterlich-höfische Kultur um 1200 einen Höhepunkt. Zunächst waren Ritter einfache berittene Krieger im Dienst eines Herrn gewesen. Nun schlossen sie sich zu einem angesehenen Berufs- und Geburtsstand mit eigenem Ehrenkodex zusammen.",
      "Auf prächtigen Hoffesten und Turnieren zeigten junge Adlige nicht nur Kampfkunst und Wappen, sondern auch Bildung und höfische Umgangsformen wie „Mäßigung“, Treue, Großzügigkeit und den Schutz von Schwachen. Dichter und Sänger wie Walther von der Vogelweide oder Wolfram von Eschenbach trugen an Fürstenhöfen Minnelieder und Ritterepen auf Mittelhochdeutsch vor.",
      "Auch die Baukunst wandelte sich: Neben festungsartigen Höhenburgen und romanischen Domen mit dicken Mauern und Rundbögen wie dem Bamberger Dom drangen ab dem späten 12. Jahrhundert spitzbogige Formen der Gotik ein. In Skulpturen wie dem berühmten Bamberger Reiter oder kunstvollen Buchmalereien spiegeln sich das christliche Weltbild und das ritterliche Ideal jener Zeit bis heute wider.",
    ],
    takeaway:
      "Um 1200 prägte unter den Staufern eine kulturelle Blüte mit Rittertum, Minnesang, Burgen sowie Romanik und beginnender Gotik Adel und Baukunst.",
    sourceIds: ["lehrplan", "pw-staufer", "pw-ritter", "pw-burg", "bamberg"],
    quiz: check(
      "Welche drei Elemente gehörten zur höfischen Kultur um 1200 neben der ritterlichen Kampfkunst?",
      "Gutes Benehmen am Hof, Minnegesang auf Deutsch und prächtige Feste oder Turniere.",
      [
        "Das freie Wahlrecht aller Bauern und das Verbot jeder kirchlichen Kunst.",
        "Gedruckte Tageszeitungen aus Mainz und steinerne Stadttheater nach griechischem Vorbild.",
      ],
      [
        "Bauern besaßen keine Mitbestimmung am Fürstenhof, und das Christentum prägte Dichtung wie Skulptur tief.",
        "Der Buchdruck wurde erst um 1450 von Gutenberg erfunden; mittelalterliche Epen wurden mündlich vorgetragen oder von Hand abgeschrieben.",
      ],
      "Höfische Kultur verband militärische Fertigkeiten mit dichterischer Sprache, christlichen Tugenden und glanzvoller Selbstdarstellung.",
    ),
    workshop: classify(
      "Ideal und Wirklichkeit der Stauferzeit",
      ["Höfisches Ideal & Kultur", "Harte Alltagswirklichkeit"],
      [
        [
          "Ein Minnesänger lobt am Hof die ritterlichen Tugenden Treue, Güte und Schutz der Wehrlosen.",
          0,
          "Lieder und Epen entwarfen ein leuchtendes Vorbild für edles Verhalten.",
        ],
        [
          "Zugige, kalte Steinburgen waren im Winter feucht und nur mühsam über einzelne Kamine beheizbar.",
          1,
          "Abseits der Feste verlangte das Leben auf einer Burg Verzicht auf Bequemlichkeit.",
        ],
        [
          "Im Jahr 1184 feiert Kaiser Friedrich Barbarossa in Mainz ein riesiges Hoffest mit tausenden Rittern.",
          0,
          "Solche Feste zeigten den Glanz der staufischen Kaiserherrschaft in ganz Europa.",
        ],
        [
          "Bei Fehden zwischen Adelsfamilien litten vor allem die Dörfer durch Plünderung und verbrannte Ernten.",
          1,
          "Die Schutzpflicht aus dem Ritterideal wurde im Kriegsalltag oft gebrochen.",
        ],
        [
          "Steinmetze gestalten am Dom Figuren, die christliche Heilige und königliche Vorbilder zeigen.",
          0,
          "In Kirchen und Pfalzen blieb das christliche Symbolprogramm bis heute sichtbar.",
        ],
      ],
      "Gedichte und Bildwerke zeigen, wie der Adel um 1200 sein wollte – nicht immer, wie hart das Leben tatsächlich war.",
    ),
    tasks: {
      1: writing(
        "Beschreibe, was man unter der „kulturellen Blüte zur Zeit der Staufer“ um 1200 versteht, und nenne drei sichtbare Zeugnisse, die bis heute erhalten sind.",
        [
          "Erkläre die Veränderung vom einfachen Reiterkrieger zum höfischen Ritter.",
          "Nenne Beispiele aus Dichtung, Burgenbau oder Kirchenkunst.",
        ],
        "Um 1200 entwickelte sich an den Höfen unter den Staufern eine eigene Ritterkultur mit Turnieren, höfischen Regeln, Minnesang und ersten Werken in mittelhochdeutscher Sprache. Bis heute sichtbar sind zahlreiche Burgen, romanische und frühgotische Dome wie der Bamberger Dom samt Skulpturen sowie kunstvoll ausgemalte Handschriften.",
        [
          "Wandel des Rittertums erklärt",
          "Höfische Dichtung oder Feste erwähnt",
          "Drei erhaltene Zeugnisse genannt",
        ],
      ),
      2: writing(
        "Warum sollte man die Darstellungen von Rittern in heutigen Filmen kritisch prüfen, bevor man sie für Geschichte hält?",
        [
          "Vergleiche das Ideal des Turnierritters mit der Wirklichkeit von Fehde, Kälte auf Burgen und Rüstungskosten.",
          "Verweise auch auf die Entstehungszeit moderner Bilder.",
        ],
        "Filme zeigen oft strahlende Einzelkämpfer in riesigen Festungen und mischen Baustile oder Rüstungen aus mehreren Jahrhunderten. Historische Quellen belegen dagegen, dass nur reiche Adlige sich teure Rüstungen leisten konnten, Burgen im Winter feucht und eng waren und Fehden oft grausam geführt wurden. Spätere Filme sind moderne Geschichtsbilder, keine Quellen.",
        [
          "Unterscheidung Ideal/Film und Realität",
          "Historische Lebensbedingungen belegt",
          "Medienkritisches Urteil begründet",
        ],
      ),
    },
  },
  {
    id: "g7-stadt-und-buerger",
    lb: 2,
    title: "Aufschwung der Städte: Stadtrecht, Bürger und Zünfte",
    period: "Hoch- und Spätmittelalter · 11. bis 15. Jahrhundert",
    span: [1050, 1500],
    intro:
      "Ab dem 11. Jahrhundert entstanden in Mitteleuropa Hunderte neue Städte. Hinter schützenden Mauern entwickelten sich Freiheit, Marktverkehr und Selbstverwaltung.",
    paragraphs: [
      "Mit dem Bevölkerungswachstum und neuen Anbaumethoden auf dem Land stiegen ab dem 11. Jahrhundert die Erträge. Überschüsse lockten Kaufleute und Handwerker an günstige Flussübergänge, Kreuzungen oder Bischofssitze. Landesfürsten, Könige oder Bischöfe förderten diesen Aufschwung gezielt und verliehen einem Ort das Stadtrecht: Dieses Privileg umfasste meist das Recht auf einen regelmäßigen Markt, eigene Münze und Zölle, eine schützende Stadtmauer sowie eigene Gerichtsbarkeit.",
      "Für die Menschen auf dem Land bot die Stadt neue Freiheit. Nach dem Rechtsgrundsatz „Stadtluft macht frei nach Jahr und Tag“ wurde ein geflohener Höriger frei von der Abhängigkeit seines Grundherrn, wenn er ein Jahr und einen Tag unbeanstandet in der Stadt gelebt hatte. Wer ein Haus besaß und Steuern zahlte, konnte Bürger werden und an der Verteidigung der Stadt sowie der Selbstverwaltung durch den Stadtrat mitwirken.",
      "Die Stadtgesellschaft war jedoch keineswegs gleich. An der Spitze regierten wohlhabende Fernhandelsfamilien, die Patrizier, meist allein den Stadtrat. Darunter organisierten sich Handwerksmeister in Zünften, etwa für Bäcker, Schmiede oder Tuchmacher: Die Zunft regelte Preise, Warenqualität, Ausbildung und Unterstützung für Witwen, schrieb aber auch streng vor, wer ein Handwerk ausüben durfte (Zunftzwang). Mehr als ein Drittel der Bewohner – Gesellen, Mägde und Tagelöhner – besaß gar kein volles Bürgerrecht.",
    ],
    takeaway:
      "Stadtrechte gaben Städten Markt und Selbstverwaltung; Bürger waren in Patrizier und Zünfte gegliedert, während Unterschichten ohne volles Bürgerrecht lebten.",
    sourceIds: ["lehrplan", "pw-stadtarch", "pw-mittelalter"],
    quiz: check(
      "Was bedeutete der mittelalterliche Rechtsgrundsatz „Stadtluft macht frei nach Jahr und Tag“ für geflohene Hörige?",
      "Wer ein Jahr und einen Tag unbeanstandet in der Stadt lebte, wurde von der Abhängigkeit seines Grundherrn frei.",
      [
        "Wer in die Stadt zog, war ab dem ersten Tag sofort von jeder städtischen Steuer befreit.",
        "Wer vor die Stadtmauer floh, erhielt automatisch ein kostenloses Grundstück am Marktplatz.",
      ],
      [
        "Städte verlangten gerade Steuern, Wachdienst und ein Aufnahmegeld für das Bürgerrecht.",
        "Grundbesitz in der Stadt musste gekauft oder gepachtet werden; arme Zuwanderer blieben oft Mieter oder Tagelöhner.",
      ],
      "Wenn der Grundherr einen geflohenen Hörigen innerhalb eines Jahres und eines Tages nicht erfolgreich zurückforderte, erlosch die Leibeigenschaft.",
    ),
    diagram: {
      kind: "pyramid",
      title: "Soziale Gruppen in einer mittelalterlichen Stadt",
      layers: [
        { label: "Patrizier (Ratsgeschlechter)", note: "reiche Großkaufleute · besetzen den Stadtrat und hohe Ämter" },
        { label: "Zunfthandwerker und Kleinhändler", note: "Bürger mit Hausbesitz · organisiert in strengen Zünften" },
        { label: "Gesellen, Lehrlinge und Dienstboten", note: "arbeiten in Werkstätten und Haushalten · meist ohne Bürgerrecht" },
        { label: "Tagelöhner, Bettler und Randgruppen", note: "arme Bewohner und verachtete Berufe ohne Bürgerrecht (jüdische Gemeinden standen unter eigenem Schutzrecht außerhalb der christlichen Ständeordnung)" },
      ],
      caption:
        "Stadtfreiheit bedeutete nicht Gleichheit: Politische Rechte lagen bei den Bürgern, in vielen Reichsstädten vor allem bei den Patriziern.",
    },
    workshop: classify(
      "Rechte und Alltag in der Stadt",
      ["Stadtrecht & Selbstverwaltung", "Aufgabe einer Zunft", "Grenze der Stadtfreiheit"],
      [
        [
          "Eine Stadt darf wöchentlich einen Markt abhalten, Zölle erheben und ein eigenes Gericht führen.",
          0,
          "Markt-, Zoll- und Gerichtsrechte gehörten zu den wichtigsten Privilegien des Stadtherrn.",
        ],
        [
          "Ein Bäcker, der zu leichte Brote verkauft, wird bestraft und vor dem Rathaus bloßgestellt.",
          1,
          "Zünfte sicherten feste Qualität, Maße und Gewichte für alle Kunden.",
        ],
        [
          "Eine Dienstmagd leistet Hausarbeit gegen Kost und Lohn, darf aber im Rat nicht mitbestimmen.",
          2,
          "Abhängige Arbeitskräfte besaßen in der Regel kein politisches Bürgerrecht.",
        ],
        [
          "Alle Schuhmacher müssen derselben Genossenschaft beitreten, um ihr Handwerk ausüben zu dürfen.",
          1,
          "Der Zunftzwang sicherte das Auskommen der Mitglieder, schloss aber Konkurrenz aus.",
        ],
        [
          "In einer freien Reichsstadt untersteht der Rat keinem Landesfürsten mehr, sondern direkt dem Kaiser.",
          0,
          "Reichsstädte wie Nürnberg, Augsburg oder Regensburg genossen besonders große Eigenständigkeit.",
        ],
      ],
      "Die mittelalterliche Stadt brachte wirtschaftlichen Aufschwung und bürgerliche Freiheiten, blieb aber eine abgestufte Ordnung.",
    ),
    tasks: {
      1: writing(
        "Nenne drei Gründe, warum im Hochmittelalter viele neue Städte aufblühten, und erkläre die Rolle der Zünfte.",
        [
          "Denke an wachsende Ernten auf dem Land, Handelswege und die Förderung durch Stadtherren.",
          "Erkläre zwei Aufgaben einer Zunft für Handwerker und Kunden.",
        ],
        "Städte wuchsen, weil bessere Ernten Überschüsse für Märkte brachten, der Fernhandel an Flüssen und Straßenkreuzungen zunahm und Fürsten oder Könige gezielt Stadtrechte verliehen. Die Zünfte schlossen alle Meister eines Handwerks zusammen: Sie kontrollierten Preise und Qualität, regelten die Ausbildung und sorgten bei Krankheit oder für Witwen, verhinderten durch den Zunftzwang aber auch Wettbewerb.",
        [
          "Gründe für Städteaufschwung genannt",
          "Rechte oder Rolle der Zünfte erklärt",
          "Vorteil und Einschränkung der Zunft genannt",
        ],
      ),
      2: writing(
        "Überprüfe das Sprichwort „Stadtluft macht frei“ kritisch anhand der gesellschaftlichen Gruppen einer mittelalterlichen Stadt.",
        [
          "Erkläre zuerst, was tatsächlich frei wurde (Befreiung von der Grundherrschaft).",
          "Zeige dann, welche Gruppen dennoch wenig Rechte besaßen.",
        ],
        "Das Sprichwort stimmt für geflohene Hörige, weil sie nach Jahr und Tag von den Abgaben und Diensten für ihren früheren Grundherrn befreit waren. Innerhalb der Stadt gab es jedoch keine Gleichheit: Nur wer sich ein Haus und das Bürgerrecht leisten konnte, genoss volle Rechte, und im Rat dominierten oft reiche Patrizier. Gesellen, Mägde, Tagelöhner und Minderheiten blieben politisch weitgehend ausgeschlossen.",
        [
          "Richtiger Kern des Satzes erklärt",
          "Einschränkungen beim Bürgerrecht genannt",
          "Abwägendes Urteil formuliert",
        ],
      ),
    },
  },
  {
    id: "g7-juedisches-leben-mittelalter",
    lb: 2,
    title: "Jüdisches Leben zwischen Schutz und Ghetto",
    period: "Mittelalter · Stadtgesellschaft",
    span: [1096, 1520],
    intro:
      "Jüdische Gemeinden gehörten in vielen Städten wie Regensburg, Augsburg oder Speyer seit Jahrhunderten dazu – und standen doch unter einer gefährdeten Sonderstellung.",
    paragraphs: [
      "In zahlreichen mittelalterlichen Städten bereicherten jüdische Familien das wirtschaftliche und kulturelle Leben. Sie unterhielten eigene Synagogen, Schulen und rituelle Bäder (Mikwen), pflegten gelehrte Studien und brachten durch Fernkontakte wichtige Kenntnisse in Handel, Medizin und Geldwesen ein. Gleichzeitig schlossen christliche Zünfte sie vom Handwerk und vom Besitz landwirtschaftlicher Güter aus.",
      "Deshalb arbeiteten viele Juden als Händler oder im Geldverleih gegen Zinsen, der Christen nach kirchlichem Recht lange verboten war. Rechtlich standen sie als „Kammerknechte“ unter dem direkten Schutz des Königs oder eines Stadtherrn und mussten dafür hohe Schutzsteuern zahlen. Sie genossen zwar Schutzbriefe, besaßen aber kein gleichberechtigtes christliches Bürgerrecht.",
      "Sobald Seuchen, Schuldenkrisen oder religiöser Hass aufflammten – etwa beim ersten Kreuzzug 1096 oder während der großen Pest 1348/49 –, wurden Juden häufig als Sündenböcke beschuldigt und Gemeinden in grausamen Übergriffen (Pogromen) verfolgt oder vertrieben. Während jüdische Familien im Mittelalter meist in eigenen Judenvierteln oder Judengassen lebten, sperrten manche Städte sie am Übergang zur Frühen Neuzeit (erstmals 1516 in Venedig) in ummauerte, nachts verschlossene Zwangsviertel ein: die Ghettos. Die Sicht der jüdischen Gemeinden erinnert daran, dass christliche Stadtfreiheit Minderheiten keineswegs einschloss.",
    ],
    takeaway:
      "Jüdische Gemeinden trugen viel zu Handel, Bildung und Stadtkultur bei, lebten aber trotz königlicher Schutzbriefe in einer gefährdeten Sonderstellung in Judenvierteln – ab der Frühen Neuzeit teils in abgeschlossenen Ghettos – und waren von Verfolgung bedroht.",
    sourceIds: ["lehrplan", "pw-judentum", "pw-pest"],
    quiz: check(
      "Warum übten viele jüdische Stadtbewohner im Mittelalter Berufe im Handel und Geldverleih aus?",
      "Christliche Zünfte schlossen sie vom Handwerk und Grundbesitz weitgehend aus.",
      [
        "Weil der Kaiser Christen verbot, auf Wochenmärkten Waren oder Lebensmittel zu verkaufen.",
        "Weil nur jüdische Familien in der Stadt Steuern an den Stadtrat zahlen mussten.",
      ],
      [
        "Christliche Bürger beherrschten gerade die Wochenmärkte und das Zunfthandwerk in den Städten.",
        "Schutzsteuern mussten jüdische Bewohner zusätzlich an den König oder Stadtherrn zahlen, nicht statt anderer.",
      ],
      "Ausschluss aus den Zünften und das kirchliche Zinsverbot für Christen drängten jüdische Familien in bestimmte Nischenberufe.",
    ),
    workshop: classify(
      "Schutz, Leistung und Ausgrenzung",
      ["Beitrag & Gemeindeleben", "Rechtliche Sonderstellung", "Ausgrenzung & Bedrohung"],
      [
        [
          "In Regensburg oder Speyer unterhalten Gemeinden eigene Synagogen, Lehrhäuser und Friedhöfe.",
          0,
          "Jüdische Gemeinden pflegten eine eigene religiöse und gelehrte Stadtkultur.",
        ],
        [
          "Gegen hohe Abgaben stellt der König oder Stadtherr einen zeitlich begrenzten Schutzbrief aus.",
          1,
          "Der Schutz war käuflich und konnte jederzeit widerrufen werden.",
        ],
        [
          "Während der Pest 1348/49 verbreiten Gerüchte die Lüge von vergifteten Brunnen und führen zu Pogromen.",
          2,
          "In Krisenzeiten wurden Minderheiten schutzlos zu Sündenböcken gemacht.",
        ],
        [
          "Am Übergang zur Frühen Neuzeit (wie ab 1516 in Venedig) zwingt ein ummauertes Ghetto jüdische Familien in ein nachts verschlossenes Viertel.",
          2,
          "Während mittelalterliche Judenviertel meist offen lagen, schuf das frühneuzeitliche Ghetto räumliche Zwangsabschottung.",
        ],
        [
          "Jüdische Gelehrte und Ärzte vermitteln Schriften aus dem arabischen Raum weiter nach Europa.",
          0,
          "Weitreichende Netzwerke förderten Medizin, Sprachen und Wissenschaft.",
        ],
      ],
      "Jüdische Geschichte im Mittelalter zeigt beides: vielfältige Beiträge zur Stadtkultur und die Gefahren rechtlicher Ungleichheit.",
    ),
    tasks: {
      1: writing(
        "Erkläre, was man unter der „Sonderstellung“ jüdischer Bewohner in der mittelalterlichen Stadt versteht und was ein Ghetto war.",
        [
          "Beschreibe Rechte über Schutzbriefe und Berufe außerhalb der Zünfte.",
          "Erkläre den Begriff Ghetto und Gefahren in Krisenzeiten.",
        ],
        "Jüdische Familien waren vom Handwerk in christlichen Zünften ausgeschlossen und standen gegen hohe Schutzsteuern unter dem unsicheren Schutz eines Königs oder Stadtherrn. Viele arbeiteten deshalb im Handel oder Geldverleih und wohnten im Mittelalter in Judenvierteln oder Judengassen, in Krisen wie der Pestzeit 1348/49 oft bedroht von Pogromen und Vertreibung. Ein Ghetto war dagegen ein ummauertes, abgeschlossenes Zwangsviertel, wie es ab der Frühen Neuzeit (Venedig 1516) eingerichtet wurde.",
        [
          "Berufliche und rechtliche Sonderstellung erklärt",
          "Begriff Ghetto korrekt definiert",
          "Bedrohung durch Verfolgung benannt",
        ],
      ),
      2: writing(
        "Stell dir vor, du schreibst für ein Schulprojekt eine kurze Chronik über die Pestjahre 1348/49 aus der Perspektive eines jüdischen Stadtbewohners. Nenne drei Punkte, die auf belegten Fakten beruhen müssen.",
        [
          "Verbinde methodisches Wissen aus Lernbereich 1 (Perspektivwechsel) mit der Realität der jüdischen Gemeinde.",
          "Achte darauf, keine heutigen Vorstellungen in die Figur zu legen.",
        ],
        "Erstens muss der Text zeigen, dass die Gemeinde nicht im Rat saß, sondern vom unsicheren Schutzbrief des Stadtherrn abhing. Zweitens muss deutlich werden, wie sich Angst vor der tödlichen Seuche schnell mit falschen Gerüchten und Hass gegen Juden verband. Drittens gehört dazu, dass viele Bewohner trotz Unschuld um ihr Leben bangten oder in andere Städte fliehen mussten.",
        [
          "Rechtliche Abhängigkeit vom Schutzbrief genannt",
          "Zusammenhang von Krise und Sündenbock-Suche erklärt",
          "Sachliche Perspektive ohne moderne Zusätze gewählt",
        ],
      ),
    },
  },
  {
    id: "g7-seuchen-und-krisen",
    lb: 2,
    title: "Missernten und Pest: Leben mit Bedrohungen",
    period: "Spätmittelalter · 14. Jahrhundert",
    span: [1315, 1400],
    intro:
      "Kältejahre, Hungersnöte und die große Pest von 1348 trafen Europa mit voller Wucht. Ohne heutiges Wissen über Bakterien suchten die Menschen eigene Wege zum Überleben.",
    paragraphs: [
      "Im 14. Jahrhundert kühlte sich das Klima in Europa ab, und Starkregen verdarb wiederholt das Getreide. Da kaum Reserven für mehrere Jahre lagerten und Transporte langsam waren, stiegen nach einer Missernte die Brotpreise sprunghaft an. Unterernährung schwächte die Menschen besonders in dicht gedrängten Städten und auf dem Land.",
      "Ab 1347/48 erreichte über Handelsschiffe aus dem Mittelmeerraum eine verheerende Seuche Europa: der „Schwarze Tod“, die Pest. Binnen weniger Jahre starb schätzungsweise ein Drittel der europäischen Bevölkerung. Ganze Dörfer fielen wüst, Handwerksbetriebe verloren ihre Meister, und der Alltag brach vielerorts zusammen.",
      "Weil niemand Flöhe und Bakterien als Überträger kannte, deuteten viele Menschen die Seuche als Strafe Gottes oder vermuteten „vergiftete Luft“. Sie reagierten sehr unterschiedlich: Manche beteten in Prozessionen oder geißelten sich öffentlich; andere flohen auf Landgüter. In den folgenden Jahrzehnten des Spätmittelalters entwickelten Hafen- und Handelsstädte bei neuen Pestwellen aber auch wirksame Schutzmaßnahmen: Ab 1377 führte Ragusa (Dubrovnik) die Absonderung ankommender Schiffe und Reisender ein (zunächst für 30 Tage, später auf 40 Tage erweitert: Quarantäne), dazu kamen strengere Sauberkeitsordnungen, Pestspitäler außerhalb der Mauern und geschlossene Märkte.",
    ],
    takeaway:
      "Missernten und die Pest um 1348 kosteten Millionen Menschen das Leben; die Reaktionen reichten von Verzweiflung und Verfolgung bis zu frühen Quarantäneregeln.",
    sourceIds: ["lehrplan", "pw-pest", "pw-mittelalter"],
    quiz: check(
      "Welche Maßnahme gegen die Ausbreitung späterer Pestwellen entwickelten Hafen- und Handelsstädte im Spätmittelalter (ab 1377 in Ragusa)?",
      "Die Quarantäne, also eine mehrwöchige Absonderung ankommender Schiffe und Reisender.",
      [
        "Die gezielte Impfung aller Einwohner durch Ärzte der kaiserlichen Reichskammer.",
        "Den Einsatz moderner Antibiotika, die in Klöstern aus Penicillin gewonnen wurden.",
      ],
      [
        "Impfstoffe entstanden erst Jahrhunderte später in der Neuzeit; das mittelalterliche Wissen kannte keine Erreger.",
        "Antibiotika wurden erst im 20. Jahrhundert entdeckt.",
      ],
      "Auch ohne Kenntnis von Bakterien beobachteten städtische Räte die Ansteckung über Reisende und führten ab 1377 Wartezeiten von zunächst 30 und später 40 Tagen (italienisch quaranta = vierzig) ein.",
    ),
    workshop: classify(
      "Wie Menschen im Mittelalter auf Seuchen reagierten",
      ["Religiöse Deutung & Panik", "Medizinische Vermutung & Schutz"],
      [
        [
          "Büßerzüge ziehen von Stadt zu Stadt, um Gottes Zorn durch Gebet und Geißelung abzuwenden.",
          0,
          "Viele Zeitgenossen deuteten die Seuche religiös als Prüfung oder Strafe.",
        ],
        [
          "Ab 1377 müssen ankommende Handelsschiffe und Reisende in Hafenstädten wie Ragusa vor dem Einlaufen wochenlang abgesondert warten.",
          1,
          "Aus der zunächst 30- und später 40-tägigen Absonderung entstand im Spätmittelalter die Quarantäne.",
        ],
        [
          "Menschen verbrennen Wacholderholz und aromatische Kräuter in den Stuben, um vermeintlich giftige Dämpfe aus der Luft zu vertreiben.",
          1,
          "Nach der mittelalterlichen Miasmenlehre hielt man üble Dämpfe für die Ursache; erst im 17. Jahrhundert kamen Schnabelmasken auf.",
        ],
        [
          "Gerüchte beschuldigen Randgruppen oder jüdische Gemeinden der Brunnenvergiftung.",
          0,
          "Angst und Unwissen führten leider immer wieder zu grausamen Verfolgungen Unschuldiger.",
        ],
        [
          "Der Stadtrat verbietet offene Abfälle auf den Gassen und richtet ein Siechenhaus vor dem Tor ein.",
          1,
          "Frühe Stadthygiene und räumliche Trennung senkten die Ansteckungsgefahr.",
        ],
      ],
      "Neben Verzweiflung und falscher Schuldzuweisung entstanden im Spätmittelalter bereits praktische Regeln des Gesundheitsschutzes.",
    ),
    tasks: {
      1: writing(
        "Erkläre am Beispiel von Missernten und der Pest von 1348, wie sich die Bevölkerung in Europa im 14. Jahrhundert veränderte und welche Folgen das für Überlebende hatte.",
        [
          "Nenne den großen Bevölkerungsverlust.",
          "Überlege, was weniger Arbeitskräfte für Löhne und verlassene Dörfer bedeuteten.",
        ],
        "Klimaverschlechterung, Hungersnöte und der Schwarze Tod ab 1348 rafften schätzungsweise rund ein Drittel der Menschen in Europa dahin. Viele Dörfer fielen wüst. Für Überlebende brachte der starke Mangel an Arbeitskräften in den Städten und auf dem Land oft steigende Löhne und bessere Bedingungen bei neu vergebenen Höfen.",
        [
          "Bevölkerungsverlust genannt",
          "Folgen für Dörfer oder Wirtschaft beschrieben",
          "Auswirkung auf Löhne oder Überlebende erklärt",
        ],
      ),
      2: writing(
        "Vergleiche kurz den Umgang mit der Pest im 14. Jahrhundert mit dem Umgang einer modernen Gesellschaft bei einer Epidemie.",
        [
          "Nenne eine Ähnlichkeit (z. B. Quarantäne oder Abstandsregeln) und einen großen Unterschied im Wissen.",
          "Beziehe auch Gefahren durch Gerüchte mit ein.",
        ],
        "Sowohl im Spätmittelalter als auch heute versuchte man, Ansteckung durch Absonderung von Reisenden (Quarantäne ab 1377) und geschlossene Versammlungen einzudämmen. Während heute jedoch Viren und Bakterien mikroskopisch erforscht, Medikamente und Impfstoffe entwickelt werden, kannte man 1348 keine Erreger und deutete die Krankheit oft als Gottesstrafe. Zudem zeigt ein Vergleich, wie gefährlich Sündenbock-Gerüchte in jeder Krise sind.",
        [
          "Gemeinsame Schutzmaßnahme Quarantäne genannt",
          "Unterschied im medizinischen Wissen erklärt",
          "Gefahr durch Falschgerüchte reflektiert",
        ],
      ),
    },
  },
  {
    id: "g7-kreuzzuege",
    lb: 2,
    title: "Die Kreuzzüge: Krieg, Austausch und Dialog",
    period: "Hochmittelalter · 1095 bis 1291",
    span: [1095, 1291],
    intro:
      "Fast zweihundert Jahre lang zogen christliche Heere nach Jerusalem. Die Kreuzzüge brachten Gewalt und Leid, veränderten aber auch Europas Wissen, Handel und Alltag tiefgreifend.",
    paragraphs: [
      "Im Jahr 1095 rief Papst Urban II. die Ritterschaft Europas zum ersten Kreuzzug auf, um Jerusalem und die heiligen Stätten des Christentums unter christliche Herrschaft zu bringen. Zugleich spielten vielfältige Motive zusammen: religiöser Eifer und das Versprechen auf Sündenvergebung ebenso wie Abenteuerlust, Landhunger jüngerer Adelssöhne und Handelsinteressen italienischer Seestädte.",
      "Die Begegnung war zuerst eine brutale militärische Konfrontation. Bereits auf dem Zug durch das Rheinland ermordeten aufgehetzte Gruppen 1096 ganze jüdische Gemeinden; 1099 richteten Kreuzfahrer bei der Eroberung Jerusalems ein Blutbad unter Muslimen und Juden an. Aus muslimischen Quellentexten wird deutlich, wie schockierend dieser Überfall wirkte – aber auch, dass sich spätere Herrscher wie Sultan Saladin bemühten, durch Verträge friedliche Regelungen für Pilger zu finden.",
      "Paradoxerweise erweiterten die Kreuzzüge zugleich das mittelalterliche Weltbild Europas enorm. Über Handel und Kontakte im Mittelmeerraum lernten Europäer verfeinerte Webkunst (Damast, Seide), neue Gewürze, Zucker, Papier, den Kompass, die überlegene arabische Medizin und Astronomie sowie verlorene Schriften der griechischen Antike kennen. Die Lehre aus diesem blutigen Aufeinandertreffen für heute lautet, Konflikte zwischen Religionen und Kulturen durch friedfertigen Dialog zu lösen.",
    ],
    takeaway:
      "Die Kreuzzüge führten zu schwerer religiöser Gewalt, erweiterten aber geographisch, wirtschaftlich und wissenschaftlich das Weltbild Europas.",
    sourceIds: ["lehrplan", "pw-kreuzzuege", "pw-islam"],
    quiz: check(
      "Wie veränderten die Kreuzzüge langfristig das Wissen und die Wirtschaft in Europa?",
      "Handel und Kulturkontakt brachten neue Güter, arabische Wissenschaft und antike Texte nach Europa.",
      [
        "Alle europäischen Kreuzfahrerstaaten blieben bis in das 19. Jahrhundert dauerhaft im Nahen Osten bestehen.",
        "Durch den Fernhandel verschwanden alle italienischen Hafenstädte wie Venedig und Genua.",
      ],
      [
        "Die letzte Festung der Kreuzfahrer im Heiligen Land fiel schon im Jahr 1291.",
        "Im Gegenteil: Seestädte wie Venedig und Genua stiegen durch den Transport und Gewürzhandel zu Weltmächten auf.",
      ],
      "Gerade die Berührung mit der damals wissenschaftlich und städtisch hochentwickelten islamischen Welt prägte Europas Kultur nachhaltig.",
    ),
    diagram: {
      kind: "compare",
      title: "Zwei Seiten der Kreuzzüge",
      columns: ["Gewalt und Konfrontation", "Wissen und Kulturkontakt"],
      rows: [
        {
          aspect: "Auslöser & Krieg",
          values: ["Aufruf 1095, blutige Eroberung Jerusalems 1099", "Gespräche, Waffenstillstände und Pilgerabkommen (z. B. 1192)"],
        },
        {
          aspect: "Minderheiten",
          values: ["schwere Verfolgungen jüdischer Gemeinden ab 1096", "Begegnung von Christen, Muslimen und Juden im Mittelmeerraum"],
        },
        {
          aspect: "Langfristige Folgen",
          values: ["tiefe Verletzungen zwischen religiösen Erinnerungen", "neue Gewürze, Seide, Papier, Kompass, Medizin und Algebra"],
        },
      ],
      caption:
        "Christliche und muslimische Quellen berichten dasselbe Geschehen grundlegend verschieden.",
    },
    workshop: classify(
      "Folge von Konfrontation oder Kulturbegegnung?",
      ["Geographische / wirtschaftliche Erweiterung", "Wissenschaftlicher Austausch", "Religiöse Gewalt & Perspektivbruch"],
      [
        [
          "Über Venedig gelangen Pfeffer, Zimt, Rohrzucker und feine Baumwolle regelmäßig auf europäische Märkte.",
          0,
          "Der Fernhandel rund um das östliche Mittelmeer weitete das Warenangebot stark aus.",
        ],
        [
          "Europäische Gelehrte übersetzen in Spanien und Sizilien arabische Medizin- und Mathematikbücher ins Lateinische.",
          1,
          "Ohne arabische Bewahrung und Kommentare wären viele Schriften des Aristoteles oder Galens verloren geblieben.",
        ],
        [
          "Ein muslimischer Chronist berichtet entsetzt vom Massenmord nach der Erstürmung Jerusalems 1099.",
          2,
          "Dieselbe Eroberung, die europäische Chronisten als Triumph feierten, war für Einheimische ein Trauma.",
        ],
        [
          "Der Magnetkompass und genauere Seekarten helfen Seefahrern bei Fahrten weitab der Küste.",
          0,
          "Nautisches Wissen aus Asien und der arabischen Welt erweiterte den geographischen Horizont.",
        ],
        [
          "Kreuzfahrerheere überfallen bereits beim Aufbruch durch Städte am Rhein jüdische Nachbarn.",
          2,
          "Religiöser Fanatismus richtete sich schon vor dem Erreichen des Orients gegen Minderheiten zu Hause.",
        ],
      ],
      "Aus dem Vergleich christlicher und muslimischer Berichte wird verständlich, warum heutige Gesellschaften auf friedfertigen Dialog angewiesen sind.",
    ),
    tasks: {
      1: writing(
        "Belege an je einem geographischen, wirtschaftlichen und wissenschaftlichen Beispiel, wie die Kreuzzüge das mittelalterliche Weltbild erweiterten.",
        [
          "Nenne neue Handelswege oder Länderkenntnisse, neue Waren und neue Wissensgebiete.",
          "Schreibe klar und geordnet.",
        ],
        "Geographisch lernten viele Europäer den gesamten Mittelmeerraum und genauere Seekarten mit dem Kompass kennen. Wirtschaftlich blühte der Fernhandel über Städte wie Venedig mit Waren wie Gewürzen, Zucker und feinen Stoffen auf. Wissenschaftlich gelangten durch Kontakte zur islamischen Welt bedeutende Fortschritte in Medizin, Mathematik und übersetzte Werke der griechischen Antike nach Europa.",
        [
          "Geographisches Beispiel genannt",
          "Wirtschaftliches Beispiel genannt",
          "Wissenschaftliches Beispiel genannt",
        ],
      ),
      2: writing(
        "Leite aus dem Vergleich eines begeisterten christlichen Kreuzfahrerberichts und der Klage eines muslimischen Chronisten über 1099 ab, warum ein friedfertiger Dialog zwischen Kulturen heute notwendig ist.",
        [
          "Zeige, wie schnell einseitige Feindbilder zu Gewalt gegen ganze Gruppen führen.",
          "Begründe, was echte Begegnung und Gespräch statt Krieg leisten können.",
        ],
        "Während der christliche Autor Gewalt als vermeintlichen Dienst an Gott rechtfertigte, sah der muslimische Chronist grausame Eroberer, die Heiligtümer und Unschuldige zerstörten. Wenn Menschen andere Religionen nur über Feindbilder kennen, rechtfertigen sie schnell Ausgrenzung und Krieg. Deshalb braucht es heute verlässliche Informationen, Perspektivwechsel und friedfertigen Dialog auf Augenhöhe.",
        [
          "Gegensatz der Quellen benannt",
          "Gefahr einseitiger Feindbilder erklärt",
          "Notwendigkeit des friedfertigen Dialogs begründet",
        ],
      ),
    },
  },
];
