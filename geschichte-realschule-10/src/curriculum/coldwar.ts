import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const coldwar: Lesson[] = [
  {
    id: "g10-blockbildung",
    lb: 4,
    title: "Zwei Supermächte, zwei Blöcke",
    period: "1945–1956",
    intro:
      "Aus den Verbündeten gegen Hitler wurden Gegner. USA und Sowjetunion teilten die Welt in Einflusssphären.",
    paragraphs: [
      "USA und Sowjetunion hatten gegensätzliche Ideologien: Die USA standen für parlamentarische Demokratie, Grundrechte und Marktwirtschaft, die Sowjetunion für die Herrschaft der Kommunistischen Partei und Planwirtschaft. Dazu kamen Machtinteressen. Die Sowjetunion wollte nach dem Krieg einen Gürtel abhängiger Staaten in Osteuropa als Sicherheitszone; die USA wollten offene Märkte und eine weitere Ausdehnung des Kommunismus verhindern. Churchill sprach 1946 von einem „Eisernen Vorhang“ quer durch Europa.",
      "1947 verkündete Präsident Truman, die USA würden freie Völker gegen Unterwerfung unterstützen; diese Politik der Eindämmung (containment) ergänzte der Marshallplan. Die Sowjetunion antwortete mit dem Rat für gegenseitige Wirtschaftshilfe (1949). 1949 gründeten westliche Staaten die NATO als Verteidigungsbündnis; im selben Jahr zündete die Sowjetunion ihre erste Atombombe. 1955 trat die Bundesrepublik der NATO bei, im selben Jahr entstand der Warschauer Pakt, dem auch die DDR angehörte; 1956 stellte sie die Nationale Volksarmee auf.",
      "Weil beide Seiten Atomwaffen besaßen, vermieden sie einen direkten Krieg gegeneinander: Der Konflikt blieb „kalt“. Er wurde aber in Wettrüsten, Propaganda und Stellvertreterkriegen ausgetragen, etwa in Korea 1950 bis 1953. Die Blockbildung prägte die zweite Hälfte des 20. Jahrhunderts: Deutschland lag an der Grenze der Blöcke, und beide deutsche Staaten waren fest in ihr jeweiliges Lager eingebunden.",
    ],
    takeaway:
      "Ideologische, machtpolitische und wirtschaftliche Gegensätze führten zum Kalten Krieg und zur Blockbildung mit NATO und Warschauer Pakt.",
    sourceIds: ["lemo-kalter-krieg", "lemo-allianzen", "lemo-warschau", "us-truman"],
    quiz: check(
      "Warum blieb der Konflikt zwischen USA und Sowjetunion ein „kalter“ Krieg?",
      "Beide Supermächte vermieden wegen der Atomwaffen einen direkten Krieg gegeneinander.",
      [
        "Er wurde nur in den Polarregionen und auf hoher See ausgetragen.",
        "In dieser Zeit gab es weltweit keine Kriege und keine Kriegstoten.",
      ],
      [
        "„Kalt“ beschreibt die Art des Konflikts, nicht das Klima.",
        "In Stellvertreterkriegen wie in Korea und Vietnam starben Millionen Menschen.",
      ],
      "Die Gefahr gegenseitiger Vernichtung hielt die Supermächte vom direkten Kampf ab; ausgetragen wurde der Konflikt anders.",
    ),
    workshop: classify(
      "Ursachen der Blockbildung",
      ["Ideologischer Gegensatz", "Machtpolitisches Interesse", "Wirtschaftliches Interesse"],
      [
        ["Demokratie mit freien Wahlen gegen Herrschaft einer Partei.", 0, "Zwei Vorstellungen von gerechter Ordnung."],
        ["Die Sowjetunion will einen Gürtel abhängiger Staaten an ihrer Westgrenze.", 1, "Sicherheit durch Einflusszonen."],
        ["Die USA wollen offene Märkte für ihre Waren und Investitionen.", 2, "Der Marshallplan verband Hilfe und Handel."],
        ["Marktwirtschaft mit Privateigentum gegen Planwirtschaft mit Staatseigentum.", 0, "Die Wirtschaftsordnung war Teil der Ideologie."],
        ["Beide Seiten bauen Atomwaffen und Bündnisse auf.", 1, "Militärische Stärke sollte die eigene Sphäre sichern."],
      ],
      "Die Blockbildung hatte mehrere, miteinander verbundene Ursachen. Keine allein erklärt den Kalten Krieg.",
    ),
    tasks: {
      1: writing(
        "Erkläre, wie die beiden deutschen Staaten in die Bündnissysteme eingebunden wurden.",
        ["NATO und Warschauer Pakt.", "Jahreszahlen nennen."],
        "Die Bundesrepublik trat 1955 der NATO bei und stellte die Bundeswehr auf. Im selben Jahr gründete die Sowjetunion den Warschauer Pakt, dem die DDR angehörte; 1956 entstand die Nationale Volksarmee. Damit standen sich deutsche Armeen in feindlichen Bündnissen gegenüber.",
        ["Bundesrepublik", "DDR", "Folge"],
      ),
      2: writing(
        "Beurteile die Aussage: Die Sowjetunion allein trägt die Schuld am Kalten Krieg.",
        ["Handlungen beider Seiten.", "Ideologie, Macht, Misstrauen."],
        "Die Sowjetunion zwang Osteuropa kommunistische Regierungen auf und blockierte Berlin. Die USA setzten aber ebenfalls auf Eindämmung, Wirtschaftsmacht und Atomrüstung. Beide Seiten misstrauten einander und deuteten Schritte der Gegenseite als Bedrohung. Eine Alleinschuld lässt sich nicht begründen, wohl aber unterschiedliche Verantwortung für einzelne Handlungen.",
        ["Sowjetische Handlungen", "Amerikanische Handlungen", "Differenziertes Urteil"],
      ),
    },
  },
  {
    id: "g10-kuba-krise",
    lb: 4,
    title: "Kuba 1962: Am Rand des Atomkriegs",
    period: "1961/62",
    intro:
      "Dreizehn Tage lang stand die Welt im Oktober 1962 kurz vor einem Atomkrieg. Geheime Verhandlungen retteten den Frieden.",
    paragraphs: [
      "1959 kam auf Kuba Fidel Castro an die Macht und näherte sich der Sowjetunion an. Im April 1961 scheiterte eine von den USA unterstützte Landung von Exilkubanern in der Schweinebucht. 1962 ließ der sowjetische Partei- und Regierungschef Chruschtschow heimlich Raketen auf Kuba stationieren, die Atomsprengköpfe tragen konnten und nur rund 150 Kilometer von Florida entfernt waren. Er reagierte damit auch auf amerikanische Raketen in der Türkei.",
      "Mitte Oktober entdeckten US-Aufklärungsflugzeuge die Abschussrampen. Am 22. Oktober forderte Präsident Kennedy öffentlich den Abbau und verhängte eine Seeblockade. Militärs auf beiden Seiten drängten zu Härte, auch in Berlin und Deutschland wurden die Truppen in Alarm versetzt. Kennedy und Chruschtschow verhandelten jedoch über Briefe und geheime Kanäle. Am 28. Oktober sagte Chruschtschow den Abzug der Raketen zu; die USA versprachen, Kuba nicht anzugreifen, und zogen später ihre Raketen aus der Türkei ab.",
      "Die Krise zeigte, wie schnell der Kalte Krieg heiß werden konnte. Beide Seiten lernten daraus: 1963 entstand ein „heißer Draht“ zwischen Washington und Moskau, und ein Vertrag verbot oberirdische Atomtests. Diplomatie, Kompromissbereitschaft und die Möglichkeit, das Gesicht zu wahren, hatten den Frieden gesichert. Diese Erfahrung lässt sich auf heutige Krisen übertragen: Wer verhandelt, braucht Kanäle, Zeit und einen Ausweg für beide Seiten.",
    ],
    takeaway:
      "In der Kuba-Krise 1962 sicherten Diplomatie und ein Kompromiss den Frieden; danach bauten die Supermächte Kommunikation und Rüstungskontrolle auf.",
    sourceIds: ["lemo-kuba", "us-cuba"],
    quiz: check(
      "Wie wurde die Kuba-Krise im Oktober 1962 beendet?",
      "Durch einen Kompromiss: Abzug der sowjetischen Raketen gegen Garantien der USA.",
      [
        "Durch eine amerikanische Invasion Kubas und den Sturz Castros.",
        "Durch einen Beschluss der NATO, Kuba als Mitglied aufzunehmen.",
      ],
      [
        "Eine Invasion wurde erwogen, aber vermieden; die USA sagten zu, Kuba nicht anzugreifen.",
        "Kuba blieb ein Verbündeter der Sowjetunion.",
      ],
      "Chruschtschow zog die Raketen ab, die USA verzichteten auf einen Angriff und zogen später ihre Raketen aus der Türkei ab.",
    ),
    workshop: timeline(
      [
        ["Fidel Castro übernimmt die Macht auf Kuba (1959)", "Kuba nähert sich der Sowjetunion an."],
        ["Gescheiterte Landung in der Schweinebucht (April 1961)", "Die USA blamieren sich, Kuba sucht sowjetischen Schutz."],
        ["US-Aufklärung entdeckt Raketenstellungen (Oktober 1962)", "Die Krise beginnt."],
        ["Kennedy verkündet die Seeblockade (22. Oktober 1962)", "Die Welt hält den Atem an."],
        ["Chruschtschow sagt den Abzug der Raketen zu (28. Oktober 1962)", "Der Kompromiss beendet die Krise."],
        ["„Heißer Draht“ zwischen Washington und Moskau (1963)", "Die Supermächte lernen aus der Krise."],
      ],
      "Die Lehrplanangabe 1961/62 umfasst das Vorspiel in der Schweinebucht und die Raketenkrise.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum die Sowjetunion 1962 Raketen auf Kuba stationierte.",
        ["Schutz für Kuba.", "Machtgleichgewicht und Raketen in der Türkei."],
        "Die Sowjetunion wollte Kuba nach der gescheiterten Invasion in der Schweinebucht vor einem weiteren Angriff schützen. Zugleich wollte sie den Vorsprung der USA ausgleichen, deren Raketen in der Türkei nahe an der Sowjetunion standen. Raketen auf Kuba bedrohten die USA aus kurzer Entfernung.",
        ["Schutzmotiv", "Machtmotiv", "Zusammenhang"],
      ),
      2: writing(
        "Übertrage: Welche Lehren aus der Kuba-Krise helfen, eine heutige Krise zu entschärfen?",
        ["Kommunikation, Kompromiss, Gesicht wahren.", "Ein aktuelles Beispiel nennen."],
        "Die Kuba-Krise zeigt, dass direkte Kommunikation, Zeit für Verhandlungen und ein Kompromiss, bei dem beide Seiten ihr Gesicht wahren, eine Eskalation verhindern können. In heutigen Konflikten helfen deshalb Gesprächskanäle, Vermittler und Rüstungskontrolle. Grenzen hat das, wenn eine Seite gar nicht verhandeln will.",
        ["Lehren benannt", "Übertragung", "Grenzen bedacht"],
      ),
    },
  },
  {
    id: "g10-vietnamkrieg",
    lb: 4,
    title: "Der Vietnamkrieg",
    period: "1955–1975",
    intro:
      "Im Vietnamkrieg kämpften die USA gegen das kommunistische Nordvietnam. Der Krieg kostete Millionen Menschen das Leben und spaltete die amerikanische Gesellschaft.",
    paragraphs: [
      "Vietnam war französische Kolonie. Nach der französischen Niederlage 1954 wurde das Land geteilt: Im Norden herrschten Kommunisten unter Ho Chi Minh, im Süden eine vom Westen unterstützte Regierung. Die USA fürchteten nach der „Dominotheorie“, dass nach Vietnam weitere Staaten Südostasiens kommunistisch würden. Sie unterstützten den Süden erst mit Beratern, ab 1964/65 mit Kampftruppen, zeitweise über 500.000 Soldaten.",
      "Gegen die Guerilla des Vietcong und Truppen aus dem Norden setzten die USA Bombenangriffe, Napalm und das Entlaubungsmittel Agent Orange ein. Die Zivilbevölkerung litt schwer; 1968 töteten US-Soldaten im Dorf My Lai Hunderte Zivilisten. Die Tet-Offensive 1968 zeigte, dass ein Sieg nicht in Sicht war. Fernsehbilder brachten den Krieg in die Wohnzimmer, weltweit, auch in der Bundesrepublik, protestierten vor allem junge Menschen.",
      "1973 zogen die USA nach einem Abkommen ab, 1975 eroberte Nordvietnam den Süden. Mehrere Millionen Vietnamesen und über 58.000 US-Soldaten starben; genaue Zahlen sind umstritten. Der Krieg war ein Stellvertreterkrieg: Sowjetunion und China unterstützten den Norden. Er zeigte die Grenzen militärischer Macht und erschütterte das Vertrauen vieler Amerikaner in ihre Regierung.",
    ],
    takeaway:
      "Im Vietnamkrieg wollten die USA die Ausbreitung des Kommunismus verhindern; der Stellvertreterkrieg endete 1975 mit dem Sieg Nordvietnams und Millionen Toten.",
    sourceIds: ["lemo-vietnam", "us-vietnam"],
    quiz: check(
      "Welche Befürchtung beschreibt die „Dominotheorie“?",
      "Wenn ein Staat kommunistisch wird, folgen ihm die Nachbarstaaten.",
      [
        "Wenn die USA einen Krieg gewinnen, steigt der Dollarkurs.",
        "Kleine Staaten sollten sich zu einem Block zusammenschließen.",
      ],
      [
        "Die Theorie war eine politische, keine wirtschaftliche Annahme.",
        "Sie beschrieb eine Ausbreitung des Kommunismus, kein Bündnis kleiner Staaten.",
      ],
      "Mit dieser Annahme begründeten US-Regierungen ihr Eingreifen in Vietnam.",
    ),
    workshop: timeline(
      [
        ["Französische Niederlage und Teilung Vietnams (1954)", "Das Kolonialreich endet, das Land wird geteilt."],
        ["Die USA schicken Kampftruppen nach Vietnam (1965)", "Aus Beratung wird Krieg."],
        ["Tet-Offensive und Massaker von My Lai (1968)", "Der Krieg verliert in den USA an Rückhalt."],
        ["Abkommen von Paris und Abzug der US-Truppen (1973)", "Die USA beenden ihren Kampfeinsatz."],
        ["Nordvietnam erobert Saigon (1975)", "Vietnam wird unter kommunistischer Führung vereint."],
      ],
      "Der Krieg begann als Folge der Entkolonialisierung und wurde zum Brennpunkt des Kalten Krieges.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum der Vietnamkrieg als Stellvertreterkrieg gilt.",
        ["Wer unterstützte wen?", "Direkter Krieg der Supermächte?"],
        "Die USA kämpften auf der Seite Südvietnams, während die Sowjetunion und China Nordvietnam mit Waffen und Material unterstützten. Die Supermächte kämpften also nicht direkt gegeneinander, sondern über Verbündete. Vietnam wurde so zum Schauplatz des Kalten Krieges.",
        ["Unterstützung USA", "Unterstützung Sowjetunion/China", "Begriff erklärt"],
      ),
      2: writing(
        "Beurteile, warum die USA den Vietnamkrieg trotz militärischer Überlegenheit nicht gewannen.",
        ["Guerillakrieg, Bevölkerung, Medien.", "Rückhalt in den USA."],
        "Die USA hatten mehr Waffen, aber der Vietcong kämpfte als Guerilla und konnte sich auf Teile der Bevölkerung stützen. Bombardierungen und Gewalt gegen Zivilisten trieben weitere Menschen auf die Gegenseite. Fernsehbilder und Proteste ließen den Rückhalt in den USA schwinden. Militärische Stärke allein konnte politische Ziele nicht durchsetzen.",
        ["Militärische Lage", "Rolle der Bevölkerung", "Innenpolitik der USA"],
      ),
    },
  },
  {
    id: "g10-entkolonialisierung",
    lb: 4,
    title: "Entkolonialisierung: Das Beispiel Algerien",
    period: "1954–1962 und Folgen bis heute",
    intro:
      "Nach 1945 wurden fast alle Kolonien unabhängig. In Algerien kostete der Weg in die Unabhängigkeit einen langen, grausamen Krieg.",
    paragraphs: [
      "Nach dem Zweiten Weltkrieg waren die europäischen Kolonialmächte geschwächt, Unabhängigkeitsbewegungen gewannen Kraft, und USA wie Sowjetunion lehnten alte Kolonialreiche ab. Zwischen 1945 und 1975 entstanden in Asien und Afrika Dutzende neue Staaten. Manche wurden auf dem Verhandlungsweg unabhängig, etwa Indien 1947, andere erst nach Kriegen.",
      "Frankreich hatte Algerien ab 1830 erobert und 1848 zum Teil Frankreichs erklärt. Rund eine Million europäischstämmige Siedler lebten dort mit vielen Rechten, die muslimische Mehrheit war benachteiligt. Am 1. November 1954 begann die Befreiungsfront FLN den bewaffneten Kampf. Frankreich führte einen brutalen Krieg mit Folter und Umsiedlungen, die FLN verübte Anschläge auch auf Zivilisten. Die Krise stürzte Frankreich 1958 in eine Staatskrise, aus der die Fünfte Republik unter de Gaulle hervorging. Die Verträge von Évian im März 1962 ebneten den Weg; am 5. Juli 1962 wurde Algerien unabhängig. Schätzungen der Opfer reichen von 250.000 bis 1,5 Millionen.",
      "Die Folgen wirken bis heute. Fast alle europäischstämmigen Algerier und viele Algerier, die für Frankreich gekämpft hatten, die Harkis, flohen nach Frankreich. Algerien wurde ein Einparteienstaat der FLN und erlebte in den 1990er-Jahren einen Bürgerkrieg. In Frankreich leben viele Menschen algerischer Herkunft; über Gewalt und Verantwortung im Krieg wird bis heute politisch gestritten. Entkolonialisierung beendete Fremdherrschaft, sie hinterließ aber Grenzen, Konflikte und Erinnerungen, die nationale und internationale Politik prägen.",
    ],
    takeaway:
      "Die Entkolonialisierung schuf nach 1945 viele neue Staaten; in Algerien führte sie 1954–1962 zu einem grausamen Krieg, dessen Folgen in Algerien und Frankreich bis heute sichtbar sind.",
    sourceIds: ["bpb-algerien", "lehrplan"],
    quiz: check(
      "Wann wurde Algerien unabhängig?",
      "Am 5. Juli 1962.",
      ["Am 1. November 1954.", "Im Jahr 1830."],
      [
        "Am 1. November 1954 begann der Unabhängigkeitskrieg der FLN.",
        "1830 begann die französische Eroberung Algeriens.",
      ],
      "Nach den Verträgen von Évian im März 1962 und einer Volksabstimmung wurde Algerien im Juli 1962 unabhängig.",
    ),
    workshop: classify(
      "Folgen der Entkolonialisierung Algeriens",
      ["Folge in Algerien", "Folge in Frankreich", "Internationale Folge"],
      [
        ["Die FLN errichtet einen Einparteienstaat.", 0, "Die Befreiungsbewegung wurde zur Staatspartei."],
        ["Hunderttausende Siedler und Harkis fliehen 1962 nach Frankreich.", 1, "Ihre Ankunft veränderte Städte und Politik."],
        ["Die Fünfte Republik entsteht mit einem starken Präsidenten.", 1, "Die Algerienkrise beendete 1958 die Vierte Republik."],
        ["Der Krieg ermutigt Unabhängigkeitsbewegungen in anderen Kolonien.", 2, "Algerien wurde zu einem Symbol der Befreiung."],
        ["Über Folter im Krieg wird bis heute gestritten.", 1, "Die Erinnerung bleibt umkämpft."],
      ],
      "Die Unabhängigkeit war ein Ende und ein Anfang: Kolonialherrschaft endete, ihre Folgen wirken weiter.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum die Unabhängigkeit Algeriens für Frankreich besonders schwierig war.",
        ["Status Algeriens seit 1848.", "Die Siedler."],
        "Algerien galt nicht als gewöhnliche Kolonie, sondern seit 1848 als Teil Frankreichs. Rund eine Million europäischstämmige Siedler lebten dort und wollten ihre Vorrechte behalten. Deshalb lehnten viele Franzosen die Unabhängigkeit ab, und Frankreich führte einen langen Krieg.",
        ["Status erklärt", "Siedler", "Folge für den Konflikt"],
      ),
      2: writing(
        "Begründe an Algerien, dass die Auswirkungen der Entkolonialisierung bis heute sichtbar sind.",
        ["Folgen in Algerien und Frankreich.", "Migration und Erinnerung."],
        "In Algerien prägte die Befreiungsbewegung FLN lange den Staat, und der Bürgerkrieg der 1990er-Jahre hatte Wurzeln in diesen Machtverhältnissen. In Frankreich leben viele Menschen algerischer Herkunft, auch Nachkommen der Harkis, und über Verantwortung für Gewalt im Krieg wird weiter gestritten. Die Kolonialgeschichte wirkt also in Politik, Gesellschaft und Erinnerung beider Länder fort.",
        ["Folge in Algerien", "Folge in Frankreich", "Bezug zur Gegenwart"],
      ),
    },
  },
  {
    id: "g10-entspannung",
    lb: 4,
    title: "Entspannung und neue Spannungen",
    period: "1963–1987",
    intro:
      "Nach der Kuba-Krise suchten die Supermächte Regeln für ihren Konflikt. Doch die Entspannung hatte Rückschläge.",
    paragraphs: [
      "Ab 1963 vereinbarten USA und Sowjetunion Schritte zur Rüstungskontrolle: den „heißen Draht“, das Verbot oberirdischer Atomtests (1963), den Atomwaffensperrvertrag (1968) und die Begrenzung strategischer Waffen (SALT I, 1972). In Europa ergänzte die Neue Ostpolitik der Bundesrepublik diese Entspannung. Den Höhepunkt bildete 1975 die Schlussakte der Konferenz über Sicherheit und Zusammenarbeit in Europa (KSZE) in Helsinki.",
      "In Helsinki erkannten die Staaten die Unverletzlichkeit der Grenzen in Europa an; der Westen setzte im Gegenzug Zusagen zu Menschenrechten und Kontakten durch. Bürgerrechtler in Osteuropa und der DDR beriefen sich später auf diese Zusagen und forderten Reisefreiheit und Meinungsfreiheit ein. Was als Absicherung des Ostblocks gedacht war, wurde so zu einem Hebel der Opposition.",
      "Die Entspannung blieb brüchig. 1968 schlugen Truppen des Warschauer Paktes den Reformversuch des „Prager Frühlings“ nieder. 1979 marschierte die Sowjetunion in Afghanistan ein, und die NATO beschloss mit dem Doppelbeschluss, neue Mittelstreckenraketen aufzustellen, wenn Verhandlungen scheiterten. In der Bundesrepublik demonstrierten Hunderttausende der Friedensbewegung dagegen. Erst der INF-Vertrag von 1987 beseitigte diese Raketen.",
    ],
    takeaway:
      "Rüstungskontrolle und KSZE-Schlussakte 1975 brachten Entspannung, Krisen wie 1968 und 1979 neue Spannungen; die Menschenrechtszusagen von Helsinki stärkten die Opposition im Osten.",
    sourceIds: ["lemo-ksze", "lemo-wettruesten", "lemo-kuba"],
    quiz: check(
      "Worauf beriefen sich Bürgerrechtler in Osteuropa nach 1975?",
      "Auf die Menschenrechtszusagen der KSZE-Schlussakte von Helsinki.",
      ["Auf die Truman-Doktrin der USA aus dem Jahr 1947.", "Auf den Vertrag über den Warschauer Pakt von 1955."],
      [
        "Die Truman-Doktrin war eine amerikanische Erklärung, kein Abkommen mit dem Ostblock.",
        "Der Warschauer Pakt war ein Militärbündnis und versprach keine Rechte.",
      ],
      "Auch die Ostblockstaaten hatten in Helsinki unterschrieben. Kritiker konnten sie an ihre eigenen Zusagen erinnern.",
    ),
    workshop: classify(
      "Entspannung oder neue Spannung?",
      ["Entspannung", "Neue Spannung"],
      [
        ["Der Atomwaffensperrvertrag soll die Verbreitung von Atomwaffen begrenzen (1968).", 0, "Rüstungskontrolle schafft Regeln."],
        ["Panzer des Warschauer Paktes beenden den Prager Frühling (1968).", 1, "Reformen im Ostblock wurden gewaltsam gestoppt."],
        ["Die KSZE-Schlussakte wird in Helsinki unterzeichnet (1975).", 0, "Ost und West vereinbaren Grundsätze des Zusammenlebens."],
        ["Die Sowjetunion marschiert in Afghanistan ein (1979).", 1, "Der Einmarsch beendete die Phase der Entspannung."],
        ["Der INF-Vertrag beseitigt die Mittelstreckenraketen (1987).", 0, "Zum ersten Mal wird eine ganze Waffengattung abgerüstet."],
      ],
      "Entspannung war kein gerader Weg. Sie hing vom Willen beider Seiten ab und konnte schnell umschlagen.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum die KSZE-Schlussakte für die Opposition in der DDR wichtig wurde.",
        ["Was unterschrieb die DDR?", "Wie nutzten Kritiker das?"],
        "Auch die DDR unterschrieb 1975 die Schlussakte, die Menschenrechte und menschliche Kontakte über Grenzen hinweg versprach. Kritiker und Ausreisewillige beriefen sich darauf und forderten die zugesagten Rechte ein. Die SED konnte die Forderungen nicht einfach als westliche Propaganda abtun, weil sie selbst zugestimmt hatte.",
        ["Inhalt der Zusagen", "Nutzung durch Kritiker", "Wirkung"],
      ),
      2: writing(
        "Beurteile, ob die Entspannungspolitik den Kalten Krieg verkürzte oder verlängerte.",
        ["Stabilisierung des Ostblocks?", "Hebel für Wandel?"],
        "Kritiker meinten, Entspannung habe die kommunistischen Regierungen anerkannt und stabilisiert. Andererseits schuf sie Kontakte, Handel und Menschenrechtszusagen, auf die sich die Opposition berufen konnte. Weil gerade diese Zusagen den Wandel ab 1989 vorbereiteten, spricht viel dafür, dass Entspannung den Kalten Krieg eher verkürzte.",
        ["Gegenargument", "Argument", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g10-umbruch-ostblock",
    lb: 4,
    title: "1989/90: Der Ostblock bricht zusammen",
    period: "1985–1991",
    intro:
      "Innerhalb weniger Jahre verloren die kommunistischen Parteien in Mittel- und Osteuropa ihre Macht. Der Kalte Krieg ging zu Ende.",
    paragraphs: [
      "1985 wurde Michail Gorbatschow Generalsekretär der KPdSU. Die sowjetische Wirtschaft steckte in der Krise, das Wettrüsten und der Krieg in Afghanistan kosteten viel. Gorbatschow setzte auf Glasnost (Offenheit) und Perestroika (Umbau). Vor allem gab er die Breschnew-Doktrin auf: Die Sowjetunion würde die Regierungen ihrer Verbündeten nicht mehr mit Gewalt schützen.",
      "In Polen erkämpfte die Gewerkschaft Solidarność 1989 Gespräche am Runden Tisch und halbfreie Wahlen, die sie klar gewann. Ungarn begann im Mai 1989, seinen Grenzzaun nach Österreich abzubauen, und ließ im September DDR-Bürger offiziell ausreisen. Im Herbst fielen die Regierungen in der DDR, in der Tschechoslowakei („Samtene Revolution“) und in Bulgarien; in Rumänien endete die Diktatur im Dezember blutig.",
      "1991 lösten sich Warschauer Pakt und Sowjetunion auf, aus ihr gingen fünfzehn Staaten hervor, darunter Russland und die Ukraine. Mit dem Ende der Blockkonfrontation endete eine Epoche, die seit 1945 Europa geteilt hatte: Man spricht von einer Epochenwende. Viele Staaten Mittel- und Osteuropas wurden Demokratien und traten später NATO und EU bei; in Russland und anderen Nachfolgestaaten verlief die Entwicklung anders.",
    ],
    takeaway:
      "Gorbatschows Reformen und der Verzicht auf Gewalt ermöglichten 1989/90 friedliche Revolutionen; 1991 zerfielen Warschauer Pakt und Sowjetunion – eine Epochenwende.",
    sourceIds: ["lemo-glasnost", "lemo-massenflucht", "lemo-kalter-krieg"],
    quiz: check(
      "Welche Entscheidung Gorbatschows war für die Revolutionen von 1989 besonders wichtig?",
      "Die Sowjetunion griff in ihren Verbündetenstaaten nicht mehr militärisch ein.",
      [
        "Die Sowjetunion trat 1989 der NATO und der Europäischen Gemeinschaft bei.",
        "Gorbatschow ließ die Berliner Mauer auf eigenen Befehl öffnen.",
      ],
      [
        "Die Sowjetunion wurde nie Mitglied von NATO oder EG.",
        "Die Öffnung am 9. November ging von einer Pressekonferenz in Ost-Berlin und dem Andrang der Menschen aus, nicht von einem Befehl aus Moskau.",
      ],
      "Anders als 1953, 1956 und 1968 rollten 1989 keine sowjetischen Panzer; so konnten die Proteste Erfolg haben.",
    ),
    workshop: timeline(
      [
        ["Gorbatschow wird Generalsekretär der KPdSU (1985)", "Reformen beginnen in der Sowjetunion."],
        ["Ungarn beginnt, den Grenzzaun zu Österreich abzubauen (Mai 1989)", "Der Eiserne Vorhang bekommt ein Loch."],
        ["Solidarność gewinnt die halbfreien Wahlen in Polen (Juni 1989)", "Die erste nichtkommunistisch geführte Regierung im Ostblock folgt."],
        ["Öffnung der Berliner Mauer (9. November 1989)", "Symbol des Umbruchs."],
        ["Samtene Revolution in der Tschechoslowakei (November/Dezember 1989)", "Ein weiterer friedlicher Machtwechsel."],
        ["Auflösung von Warschauer Pakt und Sowjetunion (1991)", "Der Ostblock existiert nicht mehr."],
      ],
      "Die Ereignisse verstärkten sich gegenseitig. Der Umbruch in der DDR war Teil eines europäischen Umbruchs.",
    ),
    tasks: {
      1: writing(
        "Erkläre zwei Ursachen für den Zusammenbruch des Ostblocks.",
        ["Wirtschaft und Rüstung.", "Gorbatschows Politik und die Bevölkerung."],
        "Die Planwirtschaften steckten in einer tiefen Krise, und Wettrüsten sowie Afghanistankrieg überforderten die Sowjetunion. Gorbatschow reagierte mit Reformen und verzichtete darauf, die Verbündeten mit Gewalt zu stützen. Als die Menschen in Polen, Ungarn und der DDR mehr Freiheit forderten, konnten die Regierungen sich nicht mehr auf sowjetische Panzer verlassen.",
        ["Ursache 1", "Ursache 2", "Zusammenhang"],
      ),
      2: writing(
        "Begründe, warum der Umbruch 1989/90 als Epochenwende bezeichnet wird.",
        ["Was endete?", "Was begann?"],
        "Mit dem Ende des Ostblocks endete die Teilung Europas in zwei Blöcke, die seit 1945 Politik, Wirtschaft und Alltag geprägt hatte. Der Kalte Krieg war vorbei, Deutschland wurde vereint, viele Staaten wurden Demokratien. Weil sich die Ordnung Europas und der Welt grundlegend veränderte, spricht man von einer Epochenwende.",
        ["Ende benannt", "Neuanfang benannt", "Begriff begründet"],
      ),
    },
  },
  {
    id: "g10-friedliche-revolution",
    lb: 4,
    title: "Herbst 1989: Die friedliche Revolution in der DDR",
    period: "Mai bis Dezember 1989",
    intro:
      "Massenflucht und Massenproteste zwangen die SED in die Knie. Am 9. November öffnete sich die Mauer.",
    paragraphs: [
      "Bei den Kommunalwahlen am 7. Mai 1989 wiesen Bürgerrechtler Wahlfälschung nach. Im Sommer flohen Tausende DDR-Bürger über Ungarn oder in die bundesdeutschen Botschaften in Prag und Warschau. Bürgerrechtsgruppen wie das Neue Forum gründeten sich. Während die SED am 7. Oktober den 40. Jahrestag der DDR feierte, demonstrierten in mehreren Städten Menschen und wurden verhaftet.",
      "In Leipzig zogen nach den Friedensgebeten in der Nikolaikirche montags immer mehr Menschen durch die Stadt. Am 9. Oktober waren es etwa 70.000; viele fürchteten, die Staatsmacht würde schießen. Doch Polizei und Armee griffen nicht ein. Die Demonstranten riefen „Wir sind das Volk“ und „Keine Gewalt“. Am 18. Oktober musste Erich Honecker zurücktreten; am 4. November kamen in Ost-Berlin Hunderttausende zu einer Kundgebung.",
      "Am Abend des 9. November 1989 verlas SED-Politbüromitglied Günter Schabowski auf einer Pressekonferenz eine neue Reiseregelung; auf die Frage, ab wann sie gelte, antwortete er, nach seiner Kenntnis sofort. Tausende strömten zu den Grenzübergängen, bis die Grenzer sie öffneten. Danach verhandelten Opposition und alte Kräfte am Runden Tisch, Bürger besetzten Stasi-Dienststellen. Die Revolution war friedlich, weil Demonstrierende auf Gewalt verzichteten und die Machthaber nicht schießen ließen.",
    ],
    takeaway:
      "Fluchtwelle und gewaltfreie Massenproteste wie in Leipzig am 9. Oktober stürzten die SED-Führung; am 9. November 1989 wurde die innerdeutsche Grenze geöffnet.",
    sourceIds: ["lemo-montagsdemo", "lemo-massenflucht", "lemo-mauerfall", "lemo-opposition"],
    quiz: check(
      "Was geschah am 9. November 1989?",
      "Die Grenzübergänge in Berlin wurden geöffnet.",
      ["Die DDR trat der Bundesrepublik bei.", "Honecker wurde zum Rücktritt gezwungen."],
      [
        "Der Beitritt erfolgte am 3. Oktober 1990.",
        "Honecker trat schon am 18. Oktober 1989 zurück.",
      ],
      "Nach Schabowskis missverständlicher Ankündigung drängten Tausende zur Grenze; die Grenzer öffneten in der Nacht die Übergänge.",
    ),
    workshop: {
      ...timeline(
        [
          ["Fälschung der Kommunalwahlen wird nachgewiesen (7. Mai 1989)", "Bürgerrechtler entlarven das Wahlergebnis."],
          ["Fluchtwelle über Ungarn und die Prager Botschaft (Sommer 1989)", "Tausende kehren der DDR den Rücken."],
          ["Montagsdemonstration mit etwa 70.000 Menschen in Leipzig (9. Oktober 1989)", "Die Staatsmacht greift nicht ein."],
          ["Rücktritt Erich Honeckers (18. Oktober 1989)", "Die SED versucht, mit Egon Krenz die Macht zu retten."],
          ["Öffnung der Grenzübergänge (9. November 1989)", "Die Mauer ist offen."],
          ["Zentraler Runder Tisch tagt erstmals (7. Dezember 1989)", "Opposition und alte Kräfte verhandeln über freie Wahlen."],
        ],
        "Flucht und Protest verstärkten sich gegenseitig: Die einen gingen, die anderen riefen „Wir bleiben hier“.",
      ),
      dataTable: {
        title: "Teilnehmende an den Leipziger Montagsdemonstrationen 1989",
        unit: "Menschen, Schätzungen",
        columns: ["Montag", "Teilnehmende"],
        max: 300000,
        suffix: "",
        rows: [
          { label: "2. Oktober", value: 20000 },
          { label: "9. Oktober", value: 70000 },
          { label: "16. Oktober", value: 120000 },
          { label: "23. Oktober", value: 250000 },
          { label: "30. Oktober", value: 300000 },
        ],
        sourceId: "lemo-montagsdemo",
        note: "Teilnehmerzahlen großer Demonstrationen sind Schätzungen. Der 9. Oktober war entscheidend, weil die Staatsmacht nicht eingriff; danach wuchsen die Zahlen schnell.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre, warum der 9. Oktober 1989 in Leipzig als Wendepunkt gilt.",
        ["Was befürchteten die Demonstrierenden?", "Was geschah dann?"],
        "Viele fürchteten am 9. Oktober eine gewaltsame Niederschlagung wie in China im Juni 1989; Krankenhäuser waren vorbereitet. Trotzdem demonstrierten etwa 70.000 Menschen friedlich, und die Staatsmacht griff nicht ein. Danach verloren viele die Angst, und die Proteste wuchsen schnell. Die SED hatte die Kontrolle über die Straße verloren.",
        ["Angst benannt", "Verlauf", "Folge"],
      ),
      2: writing(
        "Beurteile, warum die Revolution von 1989 friedlich verlief.",
        ["Verhalten der Demonstrierenden.", "Verhalten von SED und Sowjetunion."],
        "Die Demonstrierenden setzten bewusst auf Gewaltfreiheit, Kerzen und Gebete. Die SED-Führung war gespalten und befahl keinen Schießbefehl gegen die Massen, und die sowjetischen Truppen blieben in den Kasernen. Weil beide Seiten auf Gewalt verzichteten, blieb die Revolution friedlich. Das war nicht selbstverständlich, wie die Niederschlagung von 1953 zeigt.",
        ["Seite der Bürger", "Seite der Machthaber", "Urteil mit Vergleich"],
      ),
    },
  },
  {
    id: "g10-weg-zur-einheit",
    lb: 4,
    title: "1990: Der Weg zur Einheit",
    period: "November 1989 bis Oktober 1990",
    intro:
      "Nach dem Mauerfall ging es schnell: Innerhalb eines Jahres wurde aus zwei Staaten einer. Dafür brauchte es Zustimmung in Ost und West.",
    paragraphs: [
      "Aus dem Ruf „Wir sind das Volk“ wurde bald „Wir sind ein Volk“. Bundeskanzler Helmut Kohl legte im November 1989 einen Zehn-Punkte-Plan vor. Bei der ersten freien Volkskammerwahl am 18. März 1990 siegte das Bündnis, das eine rasche Einheit versprach; Lothar de Maizière (CDU) wurde Ministerpräsident. Am 1. Juli 1990 trat die Wirtschafts-, Währungs- und Sozialunion in Kraft: Die D-Mark wurde Zahlungsmittel in der DDR.",
      "Die Einheit brauchte auch die Zustimmung der vier Siegermächte. Die USA unterstützten sie, Großbritannien und Frankreich waren anfangs skeptisch, Polen sorgte sich um seine Westgrenze. Im Sommer 1990 stimmte Gorbatschow zu, dass das vereinte Deutschland in der NATO bleiben durfte. Am 12. September 1990 unterzeichneten die beiden deutschen Staaten und die vier Mächte den Zwei-plus-Vier-Vertrag: Deutschland erhielt die volle Souveränität, die Oder-Neiße-Grenze wurde endgültig, die Bundeswehr verkleinert, die sowjetischen Truppen zogen bis 1994 ab.",
      "Der Einigungsvertrag vom 31. August 1990 regelte die innerstaatlichen Fragen. Am 3. Oktober 1990 trat die DDR nach Artikel 23 des Grundgesetzes in seiner damaligen Fassung der Bundesrepublik bei; dieser Beitrittsartikel wurde danach aufgehoben, seit 1992 regelt Artikel 23 die Mitwirkung in der Europäischen Union. die neu gegründeten Länder Brandenburg, Mecklenburg-Vorpommern, Sachsen, Sachsen-Anhalt und Thüringen wurden Teil der Bundesrepublik, Berlin wurde vereint. Der 3. Oktober ist seitdem als „Tag der Deutschen Einheit“ Nationalfeiertag.",
    ],
    takeaway:
      "Freie Volkskammerwahl, Währungsunion, Einigungsvertrag und Zwei-plus-Vier-Vertrag führten zum Beitritt der DDR am 3. Oktober 1990.",
    sourceIds: [
      "lemo-volkskammerwahl",
      "lemo-wwsu",
      "lemo-einigungsvertrag",
      "lemo-2plus4",
      "gg-art23",
      "bpb-einheit",
    ],
    quiz: check(
      "Welcher Vertrag gab dem vereinten Deutschland 1990 die volle Souveränität?",
      "Der Zwei-plus-Vier-Vertrag.",
      ["Der Grundlagenvertrag.", "Der Vertrag von Maastricht."],
      [
        "Der Grundlagenvertrag regelte 1972 das Verhältnis der beiden deutschen Staaten.",
        "Der Vertrag von Maastricht gründete 1992 die Europäische Union.",
      ],
      "Die beiden deutschen Staaten und die vier Siegermächte regelten darin die äußeren Aspekte der Einheit.",
    ),
    workshop: timeline(
      [
        ["Zehn-Punkte-Plan von Helmut Kohl (28. November 1989)", "Die Einheit wird zum politischen Ziel."],
        ["Erste freie Volkskammerwahl (18. März 1990)", "Die Mehrheit stimmt für eine rasche Einheit."],
        ["Wirtschafts-, Währungs- und Sozialunion (1. Juli 1990)", "Die D-Mark kommt in die DDR."],
        ["Einigungsvertrag unterzeichnet (31. August 1990)", "Die innerdeutschen Fragen sind geregelt."],
        ["Zwei-plus-Vier-Vertrag (12. September 1990)", "Die Siegermächte stimmen zu."],
        ["Beitritt der DDR, Tag der Deutschen Einheit (3. Oktober 1990)", "Deutschland ist vereint."],
      ],
      "Innere und äußere Schritte griffen ineinander. Ohne die Zustimmung der Siegermächte wäre die Einheit nicht möglich gewesen.",
    ),
    tasks: {
      1: writing(
        "Erkläre, welche internationalen Voraussetzungen die Einheit 1990 brauchte.",
        ["Rechte der vier Mächte.", "NATO und Grenzen."],
        "Die vier Siegermächte hatten seit 1945 Rechte für Deutschland als Ganzes und mussten zustimmen. Gorbatschow akzeptierte, dass das vereinte Deutschland in der NATO blieb, Großbritannien und Frankreich gaben ihre Bedenken auf. Im Zwei-plus-Vier-Vertrag wurde die Oder-Neiße-Grenze endgültig anerkannt, was Polen Sicherheit gab.",
        ["Rolle der vier Mächte", "NATO-Frage", "Grenzfrage"],
      ),
      2: writing(
        "Erörtere Voraussetzungen und Folgen der schnellen Einheit durch Beitritt nach dem damaligen Artikel 23.",
        ["Warum so schnell?", "Was bedeutete die schnelle Währungsunion für Betriebe?"],
        "Die schnelle Einheit nutzte ein günstiges Zeitfenster, solange Gorbatschow zustimmte, und entsprach dem Wahlergebnis vom März 1990. Die D-Mark brachte den Menschen Kaufkraft, setzte die ostdeutschen Betriebe aber schlagartig dem Weltmarkt aus, viele waren nicht konkurrenzfähig. So waren politische Freiheit und Einheit gewonnen, wirtschaftliche Probleme und Arbeitslosigkeit folgten. Ein langsamerer Weg hätte die Einheit womöglich gefährdet.",
        ["Gründe für die Geschwindigkeit", "Folgen", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g10-innere-einheit",
    lb: 4,
    title: "Innere Einheit: Erfolge und Probleme",
    period: "seit 1990",
    intro:
      "Die staatliche Einheit kam an einem Tag. Das Zusammenwachsen der Menschen dauert bis heute.",
    paragraphs: [
      "Die Treuhandanstalt sollte die volkseigenen Betriebe der DDR mit fast vier Millionen Beschäftigten privatisieren. Viele Betriebe hatten veraltete Anlagen, mit der D-Mark waren ihre Produkte zu teuer, und die Absatzmärkte in Osteuropa brachen weg. Von rund 12.000 Betrieben privatisierte die Treuhand etwa 6.000, rund 1.000 gab sie an frühere Eigentümer zurück, etwa 3.700 wurden abgewickelt. Massenarbeitslosigkeit traf ganze Regionen, vor allem junge Menschen zogen nach Westen.",
      "Zugleich gab es große Erfolge: Freiheit, Reisemöglichkeiten und freie Wahlen; Städte wurden saniert, Straßen, Bahnen und Telefonnetze erneuert, die Umwelt erholte sich deutlich, Renten und Lebenserwartung stiegen. Der Westen zahlte über den Solidaritätszuschlag und Solidarpakte große Summen. Viele Ostdeutsche erlebten aber auch Abwertung ihrer Lebensleistung, und Vorurteile über „Ossis“ und „Wessis“ hielten sich.",
      "Bis heute gibt es Unterschiede, etwa bei Löhnen, Vermögen und in Führungspositionen, aber auch neue Gemeinsamkeiten, vor allem bei Jüngeren, die nach 1990 geboren sind. Wer die innere Einheit beurteilt, sollte Statistiken, persönliche Erfahrungen und Zeitzeugenaussagen nebeneinanderlegen. Seit 1990 ist Deutschland zudem durch Zuwanderung vielfältiger geworden, sodass „Ost“ und „West“ nur zwei von vielen Erfahrungen sind.",
    ],
    takeaway:
      "Die innere Einheit verbindet große Erfolge wie Freiheit und Modernisierung mit Problemen wie Deindustrialisierung, Arbeitslosigkeit und Abwanderung; sie ist ein andauernder Prozess.",
    sourceIds: ["lemo-treuhand", "lemo-ost-west", "zeitzeugen-portal"],
    quiz: check(
      "Welche Aufgabe hatte die Treuhandanstalt nach 1990?",
      "Die DDR-Betriebe zu privatisieren, zu sanieren oder stillzulegen.",
      [
        "Die Akten der Staatssicherheit zu verwalten und zu öffnen.",
        "Die Bundeswehr in den neuen Bundesländern aufzubauen.",
      ],
      [
        "Die Stasi-Akten verwaltete eine eigene Behörde, heute das Bundesarchiv.",
        "Die Treuhand war eine Wirtschaftsbehörde.",
      ],
      "Viele Betriebe waren nicht konkurrenzfähig; die Treuhand wurde für viele Ostdeutsche zum Symbol für Arbeitsplatzverlust.",
    ),
    workshop: {
      ...classify(
        "Erfolg oder Problem der inneren Einheit?",
        ["Erfolg", "Problem"],
        [
          ["Menschen aus Ostdeutschland können frei reisen und wählen.", 0, "Freiheit war das zentrale Ziel von 1989."],
          ["Ganze Industriestandorte werden geschlossen.", 1, "Deindustrialisierung traf viele Regionen."],
          ["Altstädte und Infrastruktur werden saniert.", 0, "Mit viel Geld wurde modernisiert."],
          ["Junge Menschen ziehen auf der Suche nach Arbeit in den Westen.", 1, "Abwanderung schwächte Regionen."],
          ["Flüsse und Luft werden sauberer.", 0, "Die Umweltschäden der DDR gingen zurück."],
        ],
        "Eine Bilanz braucht beide Spalten. Wie Menschen sie gewichten, hängt auch von ihren eigenen Erfahrungen ab.",
      ),
      dataTable: {
        title: "Was die Treuhand mit den Betrieben der DDR tat (bis Ende 1994)",
        unit: "Anzahl der Betriebe, gerundet",
        columns: ["Ergebnis", "Betriebe"],
        max: 12000,
        suffix: "",
        rows: [
          { label: "privatisiert", value: 6000 },
          { label: "an frühere Eigentümer zurückgegeben", value: 1000 },
          { label: "abgewickelt", value: 3700 },
        ],
        sourceId: "lemo-treuhand",
        note: "Von zuletzt rund 12.000 Betrieben; die Restmenge wurde anders behandelt, etwa kommunalisiert. Die Tabelle zählt Betriebe, nicht Arbeitsplätze.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre, warum viele ostdeutsche Betriebe nach 1990 schließen mussten.",
        ["Anlagen und Produktivität.", "Währungsunion und Absatzmärkte."],
        "Viele Betriebe hatten veraltete Maschinen und eine geringe Produktivität. Mit der D-Mark mussten sie höhere Löhne zahlen und ihre Produkte wurden zu teuer. Zugleich brachen die Absatzmärkte in Osteuropa zusammen. Viele fanden keinen Käufer und wurden von der Treuhand abgewickelt.",
        ["Zustand der Betriebe", "Währungsunion", "Absatzmärkte"],
      ),
      2: writing(
        "Diskutiere: Ist die innere Einheit Deutschlands heute erreicht?",
        ["Statistiken und Erfahrungen.", "Unterschiede und Gemeinsamkeiten."],
        "Für die Einheit spricht, dass junge Menschen in Ost und West ähnlich leben, frei reisen und Freiheit selbstverständlich ist. Dagegen sprechen Unterschiede bei Löhnen, Vermögen und Führungspositionen sowie das Gefühl vieler Ostdeutscher, zurückgesetzt zu sein. Ich halte die innere Einheit für weit fortgeschritten, aber nicht abgeschlossen; sie ist ein Prozess.",
        ["Pro-Argument", "Contra-Argument", "Eigenes Urteil"],
      ),
    },
  },
  {
    id: "g10-rolle-deutschlands",
    lb: 4,
    title: "Das vereinte Deutschland in Europa und der Welt",
    period: "seit 1990",
    intro:
      "Mit der Einheit wurde Deutschland größer und souverän. Partner erwarteten mehr Verantwortung, und Deutschland musste seine Rolle neu bestimmen.",
    paragraphs: [
      "Vor 1990 hatte die Bundesrepublik außenpolitisch Zurückhaltung geübt; Soldaten im Ausland einzusetzen, galt als kaum vorstellbar. Nach der Einheit war Deutschland mit rund 80 Millionen Menschen der bevölkerungsreichste Staat der EU und wirtschaftlich stark. 1994 entschied das Bundesverfassungsgericht, dass bewaffnete Einsätze der Bundeswehr im Rahmen von Bündnissen wie UNO oder NATO mit Zustimmung des Bundestags zulässig sind.",
      "1999 beteiligte sich die Bundeswehr an den NATO-Luftangriffen im Kosovo-Krieg, dem ersten Kampfeinsatz deutscher Soldaten seit 1945; die Regierung begründete ihn mit der Verhinderung von Vertreibung und Mord. Ab 2001 war die Bundeswehr in Afghanistan im Einsatz, bis zum Abzug 2021. Deutschland trieb zugleich die europäische Einigung voran, etwa mit dem Euro.",
      "Nach dem russischen Angriff auf die Ukraine im Februar 2022 sprach Bundeskanzler Olaf Scholz von einer „Zeitenwende“: Deutschland erhöhte seine Verteidigungsausgaben und unterstützt die Ukraine. Bis heute wird gestritten, wie viel militärische Verantwortung Deutschland übernehmen soll und wie sich seine Geschichte darauf auswirkt. Die Rolle Deutschlands musste sich verändern, weil sich Europa, die Bündnisse und die Erwartungen der Partner verändert hatten.",
    ],
    takeaway:
      "Nach 1990 wandelte sich Deutschland von außenpolitischer Zurückhaltung zu mehr internationaler Verantwortung, auch mit Auslandseinsätzen der Bundeswehr; ihr Umfang bleibt umstritten.",
    sourceIds: ["lemo-auslandseinsaetze", "lemo-kosovo", "lemo-afghanistan"],
    quiz: check(
      "In welchem Konflikt führte die Bundeswehr 1999 ihren ersten Kampfeinsatz seit 1945?",
      "Im Kosovo-Krieg.",
      ["Im Golfkrieg 1991.", "Im Vietnamkrieg."],
      [
        "Am Golfkrieg 1991 beteiligte sich Deutschland finanziell, nicht mit Kampftruppen.",
        "Am Vietnamkrieg nahm die Bundeswehr nicht teil.",
      ],
      "Die Bundeswehr beteiligte sich an Luftangriffen der NATO gegen Serbien; der Einsatz war heftig umstritten.",
    ),
    workshop: timeline(
      [
        ["Zwei-plus-Vier-Vertrag: volle Souveränität (1990)", "Deutschland entscheidet selbst über seine Außenpolitik."],
        ["Bundesverfassungsgericht erlaubt Einsätze im Bündnis mit Zustimmung des Bundestags (1994)", "Parlamentsvorbehalt für Auslandseinsätze."],
        ["Kampfeinsatz im Kosovo-Krieg (1999)", "Erster Kampfeinsatz deutscher Soldaten seit 1945."],
        ["Beginn des Afghanistan-Einsatzes (2001/02)", "Ein langer Einsatz nach dem 11. September."],
        ["Abzug aus Afghanistan (2021)", "Der Einsatz endet nach zwanzig Jahren."],
        ["„Zeitenwende“ nach dem russischen Angriff auf die Ukraine (2022)", "Sicherheitspolitik wird neu ausgerichtet."],
      ],
      "Die Entwicklung zeigt einen schrittweisen Wandel, begleitet von Debatten im Bundestag und in der Gesellschaft.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum sich die Rolle Deutschlands nach 1990 verändern musste.",
        ["Größe und Souveränität.", "Erwartungen der Partner."],
        "Das vereinte Deutschland war größer, wirtschaftlich stark und voll souverän. Partner in NATO und EU erwarteten, dass es mehr Verantwortung übernimmt, etwa bei Friedenseinsätzen. Mit dem Ende des Kalten Krieges stellten sich neue Konflikte wie in Jugoslawien, auf die Deutschland reagieren musste.",
        ["Größe/Souveränität", "Erwartungen", "Neue Konflikte"],
      ),
      2: writing(
        "Nimm Stellung: Sollte Deutschland wegen seiner Geschichte militärisch zurückhaltend sein?",
        ["Argumente aus der NS-Vergangenheit.", "Verantwortung für Schutz von Menschen."],
        "Wegen der Verbrechen des Zweiten Weltkriegs halten viele Zurückhaltung für eine Lehre der Geschichte. Andere argumentieren, gerade diese Geschichte verpflichte dazu, Völkermord und Vertreibung zu verhindern, wie die Bundesregierung 1999 im Kosovo begründete. Ich meine, Deutschland sollte nur im Bündnis, mit Zustimmung des Bundestags und mit klarem Schutzauftrag handeln. So verbindet es Verantwortung mit den Lehren der Geschichte.",
        ["Argument für Zurückhaltung", "Argument für Verantwortung", "Eigenes Urteil mit Bedingungen"],
      ),
    },
  },
  {
    id: "g10-europa",
    lb: 4,
    title: "Europäische Integration: Von der Montanunion zur EU",
    period: "1950 bis heute",
    intro:
      "Aus ehemaligen Kriegsgegnern wurde eine Gemeinschaft von 27 Staaten. Europa ist ein Projekt, über das bis heute gestritten wird.",
    paragraphs: [
      "Nach zwei Weltkriegen sollte Zusammenarbeit den Frieden sichern. 1950 schlug der französische Außenminister Robert Schuman vor, Kohle und Stahl, die Grundstoffe der Rüstung, gemeinsam zu verwalten. Sechs Staaten gründeten 1951 die Montanunion, 1957 mit den Römischen Verträgen die Europäische Wirtschaftsgemeinschaft (EWG). Am 22. Januar 1963 unterzeichneten Adenauer und de Gaulle den deutsch-französischen Freundschaftsvertrag (Élysée-Vertrag) mit regelmäßigen Treffen und Jugendaustausch; aus „Erbfeinden“ wurden Partner.",
      "Die Gemeinschaft wuchs und vertiefte sich: 1979 wählten die Bürgerinnen und Bürger erstmals das Europäische Parlament direkt. Der Vertrag von Maastricht, unterzeichnet am 7. Februar 1992, gründete die Europäische Union und legte die gemeinsame Währung fest; seit 2002 gibt es Euro-Bargeld. Das Schengener Abkommen schaffte Grenzkontrollen zwischen vielen Mitgliedstaaten ab. 2004 traten zehn Staaten bei, darunter acht aus Mittel- und Osteuropa, 2007 Bulgarien und Rumänien, 2013 Kroatien: die Ost-Erweiterung überwand die Teilung Europas.",
      "Die EU steht auch vor Herausforderungen: Schuldenkrise, Streit über Migration, der Austritt Großbritanniens 2020, der Krieg in der Ukraine und Debatten über weitere Beitritte. Mitgliedstaaten streiten über Rechtsstaatlichkeit und darüber, wie viel Macht Brüssel haben soll. Wer eigene Fragen zur Europapolitik entwickelt, sollte Ziele, Entscheidungswege und Interessen verschiedener Staaten vergleichen.",
    ],
    takeaway:
      "Die europäische Integration begann 1951 mit der Montanunion, führte 1992 in Maastricht zur EU und 2004/07 zur Ost-Erweiterung; sie sichert Frieden und bleibt politisch umstritten.",
    sourceIds: ["lemo-elysee", "lemo-eu", "lemo-eu-erweiterung", "eu-geschichte", "bpb-europa"],
    quiz: check(
      "Welcher Vertrag gründete 1992 die Europäische Union?",
      "Der Vertrag von Maastricht.",
      ["Die Römischen Verträge.", "Der Élysée-Vertrag."],
      [
        "Die Römischen Verträge gründeten 1957 die Europäische Wirtschaftsgemeinschaft.",
        "Der Élysée-Vertrag von 1963 war der deutsch-französische Freundschaftsvertrag.",
      ],
      "In Maastricht wurden auch die Wirtschafts- und Währungsunion und damit der Euro beschlossen.",
    ),
    workshop: timeline(
      [
        ["Schuman-Plan (1950)", "Kohle und Stahl sollen gemeinsam verwaltet werden."],
        ["Gründung der Montanunion (1951)", "Sechs Staaten beginnen die Integration."],
        ["Römische Verträge: EWG (1957)", "Ein gemeinsamer Markt entsteht."],
        ["Élysée-Vertrag (1963)", "Deutschland und Frankreich besiegeln ihre Freundschaft."],
        ["Vertrag von Maastricht (1992)", "Die Europäische Union wird gegründet."],
        ["Ost-Erweiterung um zehn Staaten (2004)", "Die Teilung Europas wird überwunden."],
        ["Austritt Großbritanniens (2020)", "Erstmals verlässt ein Staat die EU."],
      ],
      "Die Integration wuchs in Schritten. Jeder Schritt war eine politische Entscheidung, die umstritten war.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum die europäische Integration mit Kohle und Stahl begann.",
        ["Was brauchte man für Rüstung?", "Deutsch-französisches Verhältnis."],
        "Kohle und Stahl waren die Grundstoffe für Waffen. Wenn Frankreich und Deutschland sie gemeinsam verwalten, kann keiner heimlich gegen den anderen aufrüsten. So sollte nach zwei Kriegen Vertrauen entstehen, und wirtschaftliche Zusammenarbeit sollte Frieden sichern.",
        ["Bedeutung der Rohstoffe", "Friedenssicherung", "Vertrauen"],
      ),
      2: writing(
        "Entwickle eine eigene Fragestellung zur aktuellen Europapolitik und skizziere, wie du sie beantworten würdest.",
        ["Zum Beispiel Erweiterung, Migration, Verteidigung.", "Welche Interessen und Quellen?"],
        "Meine Frage lautet: Sollte die EU die Ukraine aufnehmen? Ich würde die Beitrittskriterien der EU, die Interessen der Ukraine, der östlichen und der westlichen Mitgliedstaaten und die Kosten vergleichen. Dazu nutze ich Seiten der EU, der Bundeszentrale für politische Bildung und Zeitungsberichte aus verschiedenen Ländern. Am Ende wäge ich Sicherheit, Werte und Belastungen gegeneinander ab.",
        ["Klare Frage", "Interessen/Perspektiven", "Vorgehen und Quellen"],
      ),
    },
  },
];
