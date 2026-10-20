import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const imperialism: Lesson[] = [
  {
    id: "g-imperialismus",
    lb: 2,
    title: "Warum Kolonien?",
    period: "spätes 19. Jahrhundert",
    intro:
      "Großmächte wollten Gebiete beherrschen. Ihre Rechtfertigungen verdeckten Herrschaft und Ungleichheit.",
    paragraphs: [
      "Imperialismus bedeutet die Ausweitung von Herrschaft über andere Gebiete und Gesellschaften. Rohstoffe, Absatzmärkte, strategische Stützpunkte und internationales Prestige waren wichtige Motive. Wirtschaftliche Erwartungen erfüllten sich nicht überall; Kolonialbesitz war kein sicherer Gewinn.",
      "Nationalismus und rassistische Überlegenheitsvorstellungen dienten als Rechtfertigung. Behauptete Zivilisierung verdeckte Zwang, Enteignung und Gewalt. Eine historische Erklärung untersucht die Motive der Kolonialmächte und die Folgen für die kolonisierten Menschen.",
    ],
    takeaway:
      "Wirtschaft, Machtpolitik und rassistische Ideologie verbanden sich im Imperialismus.",
    sourceIds: ["kolonien", "herero"],
    quiz: check(
      "Welcher Begriff bezeichnet die Ausweitung von Herrschaft über andere Länder und Gesellschaften?",
      "Imperialismus",
      ["Parlamentarismus", "Isolationismus"],
      "Imperialismus verbindet Herrschaftsausweitung mit wirtschaftlichen, politischen und ideologischen Zielen.",
    ),
    workshop: classify(
      "Motive auseinanderhalten",
      ["Wirtschaftliches Motiv", "Machtpolitisches Motiv", "Ideologische Rechtfertigung"],
      [
        [
          "Zugriff auf Rohstoffe und neue Absatzmärkte",
          0,
          "Das betrifft wirtschaftliche Interessen.",
        ],
        [
          "Ein Flottenstützpunkt soll weltweiten Einfluss sichern.",
          1,
          "Hier geht es um strategische Macht.",
        ],
        [
          "Eine angebliche Überlegenheit soll Fremdherrschaft rechtfertigen.",
          2,
          "Die rassistische Behauptung ist keine wissenschaftliche Tatsache.",
        ],
      ],
      "Ein Motiv erklärt ein Handeln; es rechtfertigt Gewalt nicht.",
    ),
    tasks: {
      1: writing(
        "Erkläre zwei Motive des Imperialismus und unterscheide sie von einer Rechtfertigung.",
        [
          "Rohstoffe und Stützpunkte sind Interessen.",
          "Überlegenheitsbehauptungen verschleiern Ungleichheit.",
        ],
        "Rohstoffe sollten wirtschaftlichen Nutzen bringen, Stützpunkte politischen Einfluss sichern. Rassistische Überlegenheitsbehauptungen dienten dazu, diese Herrschaft als berechtigt erscheinen zu lassen. Sie waren Ideologie und rechtfertigten weder Enteignung noch Gewalt.",
        ["Zwei Interessen", "Ideologie erklärt", "Erklärung und Rechtfertigung getrennt"],
      ),
      2: writing(
        "Eine Darstellung nennt Kolonialismus ausschließlich ein Geschäft mit sicheren Gewinnen. Prüfe das Urteil.",
        [
          "Auch Prestige und Konkurrenz beachten.",
          "Nutzen und Kosten aus verschiedenen Perspektiven prüfen.",
        ],
        "Wirtschaftliche Interessen waren wichtig, aber nicht die einzige Triebkraft. Prestige und strategische Konkurrenz spielten ebenfalls eine Rolle; Kolonien waren nicht durchweg profitabel. Kosten für Kolonialstaaten sagen zudem wenig über Enteignung und Ausbeutung der dortigen Bevölkerung aus.",
        ["Mehrere Motive", "Kein sicherer Gewinn behauptet", "Kolonisierte Perspektive"],
      ),
    },
  },
  {
    id: "g-kolonialherrschaft",
    lb: 2,
    title: "Kolonialherrschaft aus mehreren Perspektiven",
    period: "Afrika · 1884–1908",
    intro:
      "Grenzen auf einer Karte zeigen Machtansprüche. Sie erzählen noch nicht, was Herrschaft für die Menschen bedeutete.",
    paragraphs: [
      "Europäische Mächte teilten große Teile Afrikas unter sich auf. Auf der Berliner Konferenz 1884/85 verhandelten sie Regeln ihrer kolonialen Konkurrenz ohne gleichberechtigte Vertretung afrikanischer Gesellschaften. Landnahme, Zwangsarbeit und ungleiche Rechte veränderten Lebensbedingungen.",
      "Herero und Nama widersetzten sich der deutschen Herrschaft im heutigen Namibia. Deutsche Kolonialtruppen verübten 1904–1908 einen Völkermord. Die Betroffenen handelten selbst, leisteten Widerstand und entwickelten eigene Formen des Erinnerns. Nachwirkungen kolonialer Herrschaft sind auch heute Gegenstand historischer Verantwortung.",
    ],
    takeaway:
      "Koloniale Karten müssen um Erfahrungen, Widerstand und Folgen für die kolonisierten Gesellschaften ergänzt werden.",
    sourceIds: ["kolonien", "herero", "nama"],
    quiz: check(
      "Welche Gruppen wurden im heutigen Namibia Opfer des deutschen kolonialen Völkermords?",
      "Herero und Nama",
      ["Buren und Briten", "Franzosen und Belgier"],
      "Die deutsche Kolonialherrschaft eskalierte gegen Herero und Nama zum Völkermord.",
    ),
    workshop: classify(
      "Welche Perspektive wird sichtbar?",
      [
        "Perspektive der Kolonialmacht",
        "Perspektive der Betroffenen",
        "Quellenkritische Ergänzung",
      ],
      [
        [
          "Eine Verwaltung meldet zusätzliche Landflächen als Besitz.",
          0,
          "Der Bericht beschreibt Herrschaftsansprüche.",
        ],
        [
          "Eine Familienüberlieferung berichtet vom Verlust von Vieh und Land.",
          1,
          "Die Folgen werden aus Sicht einer betroffenen Familie greifbar.",
        ],
        [
          "Beide Berichte werden auf Entstehung, Zweck und Reichweite geprüft.",
          2,
          "Keine Quellenart ersetzt automatisch die Prüfung.",
        ],
      ],
      "Mehrere Perspektiven machen Gewalt nicht zu einer bloßen Meinungsfrage.",
    ),
    tasks: {
      1: writing(
        "Warum reicht eine Karte europäischer Kolonien zur Beurteilung der Kolonialherrschaft nicht aus?",
        [
          "Herrschaftsgebiete sind noch keine Lebenserfahrungen.",
          "Nenne eine ergänzende Perspektive.",
        ],
        "Die Karte zeigt vor allem europäische Besitzansprüche. Sie belegt weder Zustimmung der Bevölkerung noch alltägliche Folgen. Überlieferungen der kolonisierten Gesellschaften und weitere Quellen erschließen Enteignung, Gewalt und Widerstand.",
        ["Kartenbefund", "Grenze erklärt", "Betroffene einbezogen"],
      ),
      2: writing(
        "Begründe einen Maßstab für den heutigen Umgang mit kolonialen Denkmälern.",
        [
          "Historische Tätigkeit und Entstehungszeit prüfen.",
          "Erinnerung auch aus Sicht der Verfolgten denken.",
        ],
        "Ich prüfe belegte Tätigkeit und damalige Absicht der Ehrung. Ein heutiges Urteil muss koloniale Gewalt und Perspektiven der Betroffenen einbeziehen. Menschenrechte und genaue historische Information sind begründbare Kriterien, um etwa eine Kontextualisierung oder Änderung zu diskutieren.",
        ["Belege verlangt", "Betroffene berücksichtigt", "Kriterium begründet"],
      ),
    },
  },
  {
    id: "g-julikrise",
    lb: 2,
    title: "Der Weg in den Ersten Weltkrieg",
    period: "1914",
    intro:
      "Das Attentat von Sarajevo war der Anlass. Zum Krieg führten weitere Bedingungen und Entscheidungen.",
    paragraphs: [
      "Nationalistische Rivalität, Wettrüsten, Bündnisse und Konflikte auf dem Balkan verschärften die Lage. Am 28. Juni 1914 wurde der österreichisch-ungarische Thronfolger in Sarajevo ermordet. In der Julikrise eskalierten Ultimaten, Unterstützungserklärungen und Mobilmachungen.",
      "Am 28. Juli erklärte Österreich-Ungarn Serbien den Krieg. Weitere Kriegserklärungen und der deutsche Einmarsch in das neutrale Belgien weiteten ihn aus. Bündnisse handelten nicht selbst: Regierungen trafen Entscheidungen. Begeisterung war sichtbar, aber Angst und Ablehnung gehörten ebenfalls zu den Reaktionen.",
    ],
    takeaway:
      "Anlass, längerfristige Bedingungen und politische Entscheidungen müssen unterschieden werden.",
    sourceIds: ["wk1", "lehrplan"],
    quiz: check(
      "Wie lässt sich das Attentat von Sarajevo im Verhältnis zum Kriegsausbruch einordnen?",
      "Als Anlass innerhalb einer länger entstandenen Konfliktlage.",
      [
        "Als alleinige Ursache ohne weitere politische Entscheidungen.",
        "Als Folge der bereits abgeschlossenen Friedensverhandlungen.",
      ],
      "Eine mehrschichtige Erklärung vermeidet die Vorstellung eines automatischen Kriegsbeginns.",
    ),
    workshop: classify(
      "Anlass, Bedingung oder Entscheidung?",
      ["Längerfristige Bedingung", "Unmittelbarer Anlass", "Politische Entscheidung"],
      [
        [
          "Nationalistische Rivalitäten und Wettrüsten",
          0,
          "Diese Entwicklungen bestanden vor dem Juni 1914.",
        ],
        ["Das Attentat von Sarajevo", 1, "Es löste die akute Krise aus."],
        [
          "Eine Regierung erklärt einem anderen Staat den Krieg.",
          2,
          "Akteure nutzten Handlungsspielräume; sie waren keine Automaten.",
        ],
      ],
      "Bündnisse erleichterten die Ausweitung, machten Krieg aber nicht naturgesetzlich unvermeidlich.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Kriegsausbruch mit je einem Beispiel für Anlass, Bedingung und Entscheidung.",
        [
          "Sarajevo – Wettrüsten – Kriegserklärung.",
          "Verbinde die Beispiele, statt nur aufzuzählen.",
        ],
        "Das Attentat von Sarajevo löste die Julikrise aus. Wettrüsten und Rivalitäten hatten Misstrauen verstärkt. Die österreichisch-ungarische Kriegserklärung an Serbien und weitere Regierungsentscheidungen ließen daraus einen europäischen Krieg werden.",
        ["Anlass korrekt", "Bedingung erläutert", "Entscheidung benannt"],
      ),
      2: writing(
        "Prüfe die Behauptung, ganz Europa sei 1914 einheitlich kriegsbegeistert gewesen.",
        [
          "Welche Menschen sind in Quellen sichtbar?",
          "Öffentliche Kundgebungen sind keine Vollerhebung.",
        ],
        "Bilder jubelnder Menschen belegen sichtbare Begeisterung an bestimmten Orten. Sie erfassen weder alle Gruppen noch alle Reaktionen. Angst, Unsicherheit und Protest müssen mit weiteren Quellen untersucht werden; eine einheitliche Stimmung lässt sich daraus nicht ableiten.",
        ["Beleg eingegrenzt", "Andere Reaktionen", "Pauschalisierung vermieden"],
      ),
    },
  },
  {
    id: "g-materialschlacht",
    lb: 2,
    title: "Ein Krieg der Industriegesellschaft",
    period: "1914–1918",
    intro:
      "Industrie und moderne Waffen machten den Krieg zerstörerischer. Die Zivilbevölkerung war mitbetroffen.",
    paragraphs: [
      "An der Westfront entwickelte sich ein Stellungskrieg. Artillerie, Maschinengewehre und weitere industrielle Waffen führten zu massenhaften Verlusten; große Materialschlachten brachten oft nur geringe Geländegewinne. Das Beispiel Verdun steht für diese Erfahrung.",
      "Die Wirtschaft wurde auf Krieg umgestellt. Arbeitskräftemangel, Rationierung, Hunger und Trauer prägten den Alltag vieler Menschen. Frauen übernahmen zusätzliche Erwerbsarbeit, ohne damit automatisch volle politische Gleichberechtigung zu erlangen.",
    ],
    takeaway:
      "Materialschlachten verbanden industriellen Waffeneinsatz mit massenhaften Verlusten an Front und Heimat.",
    sourceIds: ["wk1"],
    quiz: check(
      "Was kennzeichnet den Stellungskrieg an der Westfront?",
      "Befestigte Fronten und hohe Verluste bei geringen Geländegewinnen.",
      [
        "Schnelle Frontverschiebungen und dauerhaft geringe Verluste.",
        "Ein Krieg ohne industrielle Waffen und ohne Nachschubbedarf.",
      ],
      "Die Materialmenge und die Verluste standen häufig in keinem Verhältnis zum Geländegewinn.",
    ),
    workshop: classify(
      "Front und Alltag verbinden",
      ["Front", "Zivilbevölkerung", "Verbindung beider Bereiche"],
      [
        [
          "Ein Soldat beschreibt tagelangen Artilleriebeschuss.",
          0,
          "Der Bericht betrifft unmittelbare Kampferfahrung.",
        ],
        [
          "Eine Familie muss mit zugeteilten Lebensmitteln auskommen.",
          1,
          "Rationierung prägte den Alltag.",
        ],
        [
          "Fabriken stellen Waffen her und ziehen Arbeitskräfte an.",
          2,
          "Produktion und Nachschub verbinden Krieg und Gesellschaft.",
        ],
      ],
      "Krieg lässt sich nicht allein aus militärischen Karten verstehen.",
    ),
    tasks: {
      1: writing(
        "Warum ist der Erste Weltkrieg mehr als eine Folge einzelner Schlachten?",
        ["Industrie und Versorgung beachten.", "Mindestens eine zivile Folge erläutern."],
        "Industrielle Produktion und Nachschub ermöglichten Materialschlachten. Gleichzeitig beanspruchte der Krieg die Wirtschaft und verknappte Lebensmittel. Hunger, Arbeit und Verlust von Angehörigen betrafen auch Menschen fern der Front.",
        ["Industrie erklärt", "Front beschrieben", "Zivile Folgen"],
      ),
      2: writing(
        "Ein Schulbuch zeigt nur Frontverläufe. Entwirf zwei Ergänzungen, die ein umfassenderes Kriegsbild ermöglichen.",
        [
          "Erfahrungsquellen und Versorgungsdaten kombinieren.",
          "Reichweite beider Quellen prüfen.",
        ],
        "Ein zeitgenössisches Tagebuch könnte den Alltag an der Front oder in einer Familie erschließen. Daten zur Lebensmittelversorgung könnten Veränderungen sichtbar machen. Beide ergänzen die Karte, bleiben aber hinsichtlich Ort, Zeitraum und Aussagekraft zu prüfen.",
        ["Zwei Ergänzungen", "Erkenntnisgewinn", "Quellenkritik"],
      ),
    },
  },
  {
    id: "g-kriegspropaganda",
    lb: 2,
    title: "Kriegsbild und Kriegserfahrung",
    period: "1914–1918",
    intro:
      "Staaten warben um Unterstützung. Ein Vergleich mit Alltagserfahrungen macht Auslassungen sichtbar.",
    paragraphs: [
      "Propaganda stellte den eigenen Krieg häufig als notwendige Verteidigung dar, idealisierte Opfer und schuf Feindbilder. Zensur begrenzte, welche Berichte öffentlich wurden. Die beteiligten Staaten setzten unterschiedliche Medien zur Mobilisierung ein.",
      "Vergleiche Botschaften mit Briefen, Tagebüchern und Versorgungsdaten. Gegensätze sind Hinweise für eine Prüfung, nicht automatisch der Beweis, dass eine einzelne Quelle alles richtig zeigt. Unterschiedliche Zeiten und Orte müssen mitgedacht werden.",
    ],
    takeaway: "Propagandabotschaften mit unabhängigen Erfahrungsquellen und Daten abgleichen.",
    sourceIds: ["wk1", "lehrplan"],
    quiz: check(
      "Welche Methode eignet sich zur Prüfung von Kriegspropaganda?",
      "Botschaft, Absender und unabhängige Erfahrungsbelege vergleichen.",
      [
        "Häufige Wiederholung als Beweis der Richtigkeit verwenden.",
        "Nur die Wortwahl prüfen und alle anderen Quellen ausblenden.",
      ],
      "Der Vergleich erschließt sowohl Absichten als auch verschwiegene Erfahrungen.",
    ),
    workshop: classify(
      "Befund oder unbelegte Verallgemeinerung?",
      ["Absicht erschließbar", "Einzelerfahrung belegt", "Verallgemeinerung nicht belegt"],
      [
        [
          "Ein Aufruf soll neue Unterstützung für den Krieg gewinnen.",
          0,
          "Ein Aufruf richtet sich auf gewünschtes Handeln.",
        ],
        [
          "Ein datierter Brief berichtet von Lebensmittelknappheit in einer Familie.",
          1,
          "Die Erfahrung ist konkret, aber nicht für alle Haushalte repräsentativ.",
        ],
        [
          "Daher dachten alle Familien gleich über den Krieg.",
          2,
          "Eine Familienquelle trägt diese Aussage nicht.",
        ],
      ],
      "Die Werkstatt verwendet beschreibende Übungssätze, keine nachgebildeten Originalplakate.",
    ),
    tasks: {
      1: writing(
        "Ein öffentlicher Aufruf verspricht baldigen Erfolg, ein Brief berichtet Erschöpfung. Wie wertest du beide aus?",
        ["Absender und Adressaten prüfen.", "Zeit und Situation vergleichen."],
        "Der Aufruf will Unterstützung erzeugen; der Brief zeigt eine persönliche Erfahrung. Ich prüfe Entstehungszeit, Adressaten und Lage beider Texte. Der Gegensatz kann Auslassungen zeigen, beweist aber weder die Wirkung des Aufrufs noch die Erfahrung aller Soldaten.",
        ["Absichten getrennt", "Kontext verglichen", "Grenze benannt"],
      ),
      2: writing(
        "Übertrage das Prüfverfahren auf eine heutige historische Videodarstellung, ohne sie vorschnell als Propaganda zu bezeichnen.",
        [
          "Belege und Auswahl prüfen.",
          "Unterschied zwischen Fehler und gezielter Manipulation beachten.",
        ],
        "Ich prüfe Urheber, Quellenangaben, Schnitte und ausgelassene Perspektiven. Ich vergleiche zentrale Behauptungen mit verlässlichen Belegen. Fehler oder Einseitigkeit allein zeigen noch nicht jede Absicht; ein Urteil über Manipulation braucht eine begründete Analyse.",
        ["Prüfkriterien", "Gegenprüfung", "Absicht vorsichtig beurteilt"],
      ),
    },
  },
  {
    id: "g-1917",
    lb: 2,
    title: "1917: Ein Jahr verändert die Welt",
    period: "1917",
    intro:
      "Der Kriegseintritt der USA und die Revolutionen in Russland veränderten die politische Ordnung.",
    paragraphs: [
      "Die USA traten 1917 auf Seiten der Entente in den Krieg ein. Damit gewann die Gegenseite der Mittelmächte zusätzliche wirtschaftliche und militärische Unterstützung. In Russland stürzte die Februarrevolution die Zarenherrschaft; in der Oktoberrevolution übernahmen die Bolschewiki die Macht.",
      "Unter kommunistischem Anspruch entstand eine neue, zunehmend diktatorische Ordnung. Russland schied 1918 durch den Frieden von Brest-Litowsk aus dem Krieg aus. Die unterschiedlichen Entwicklungen von Demokratie und Kommunismus prägten das 20. Jahrhundert; das Jahr 1917 beendete den Weltkrieg jedoch noch nicht.",
    ],
    takeaway: "1917: Kriegseintritt der USA und Russische Revolution; der Krieg endete erst 1918.",
    sourceIds: ["wk1", "lehrplan"],
    quiz: check(
      "Welche Kombination gehört zum Epochenjahr 1917?",
      "Kriegseintritt der USA und Russische Revolution.",
      [
        "Versailler Vertrag und deutsche Novemberrevolution.",
        "Weimarer Verfassung und deutsche Hyperinflation.",
      ],
      "Versailles und Weimarer Verfassung gehören zu 1919, die Novemberrevolution zu 1918 und die Hyperinflation zu 1923.",
    ),
    workshop: timeline(
      [
        [
          "Beginn des Ersten Weltkriegs",
          "1914: Der Krieg beginnt ohne amerikanische Kriegsteilnahme.",
        ],
        [
          "US-Kriegseintritt und Russische Revolution",
          "1917: Beide Entwicklungen verändern die Kräfteverhältnisse.",
        ],
        [
          "Russland schließt den Frieden von Brest-Litowsk",
          "März 1918: Russland scheidet aus dem Krieg aus.",
        ],
        ["Waffenstillstand an der Westfront", "November 1918: Der Weltkrieg endet militärisch."],
      ],
      "Ein Epochenjahr bezeichnet eine weitreichende Veränderung, keinen sofortigen Abschluss.",
    ),
    tasks: {
      1: writing(
        "Warum gilt 1917 als Epochenjahr? Nenne die beiden zentralen Entwicklungen und ihre Bedeutung.",
        [
          "USA und Russland getrennt erklären.",
          "Kurzfristige und langfristige Folgen unterscheiden.",
        ],
        "Die USA stärkten mit ihrem Kriegseintritt die Entente. In Russland beendeten Revolutionen die Zarenherrschaft und brachten die Bolschewiki an die Macht. Damit verschoben sich Kriegsverlauf und politische Ordnung weit über das Jahr hinaus.",
        ["USA", "Russland", "Bedeutung erläutert"],
      ),
      2: writing(
        "Prüfe die Aussage: Mit der Russischen Revolution begann unmittelbar eine freiheitliche Demokratie.",
        [
          "Anspruch und Herrschaftspraxis unterscheiden.",
          "Die Machtübernahme der Bolschewiki einordnen.",
        ],
        "Die Revolutionen beseitigten die Zarenherrschaft, hatten aber unterschiedliche Phasen und Ziele. Nach der bolschewistischen Machtübernahme entstand keine dauerhaft pluralistische Demokratie, sondern eine zunehmend diktatorische Ordnung. Der Begriff Revolution sagt allein nichts über die spätere Freiheit aus.",
        ["Phasen unterschieden", "Herrschaft eingeordnet", "Pauschale Folgerung geprüft"],
      ),
    },
  },
  {
    id: "g-versailles",
    lb: 2,
    title: "Frieden mit schweren Belastungen",
    period: "1918–1919",
    intro:
      "Der Waffenstillstand beendete Kämpfe. Friedensverträge sollten die Nachkriegsordnung regeln.",
    paragraphs: [
      "Nach der Niederlage der Mittelmächte zerfielen Großreiche; neue Staaten und Grenzen entstanden. Der Vertrag von Versailles 1919 regelte den Frieden mit Deutschland: Gebietsverluste, militärische Beschränkungen und Reparationen belasteten die neue Republik.",
      "Artikel 231 begründete die Haftung Deutschlands und seiner Verbündeten für Kriegsschäden. Seine politische Deutung als Alleinschuldzuweisung wurde zur Belastung. Die antidemokratische Dolchstoßlegende leugnete die militärische Niederlage und schob Demokraten und weiteren angefeindeten Gruppen die Schuld zu. Diese Legende ist keine historische Erklärung.",
    ],
    takeaway:
      "Versailles belastete die Republik; antidemokratische Deutungen verstärkten die Konflikte.",
    sourceIds: ["wk1", "demokratie", "weimar"],
    quiz: check(
      "Welcher Vertrag regelte 1919 den Frieden mit Deutschland?",
      "Der Vertrag von Versailles.",
      ["Der Frieden von Brest-Litowsk.", "Das Münchner Abkommen."],
      "Brest-Litowsk regelte 1918 den Frieden mit Russland; das Münchner Abkommen gehört zu 1938.",
    ),
    workshop: classify(
      "Vertragsinhalt oder politische Legende?",
      ["Vertragsregelung", "Unzutreffende politische Legende"],
      [
        ["Beschränkung der deutschen Streitkräfte", 0, "Das gehörte zu den Friedensbedingungen."],
        [
          "Die Armee sei im Feld unbesiegt gewesen und von Demokraten verraten worden.",
          1,
          "Diese Dolchstoßlegende verdeckte die militärische Niederlage.",
        ],
        [
          "Deutschland musste Gebiete abtreten und Reparationen leisten.",
          0,
          "Die Regelungen hatten politische und wirtschaftliche Folgen.",
        ],
      ],
      "Belastungen erklären die Angriffe auf die Republik, entschuldigen sie aber nicht.",
    ),
    tasks: {
      1: writing(
        "Unterscheide zwei Folgen des Vertrags von Versailles von der Dolchstoßlegende.",
        [
          "Gebietsverluste und Reparationen benennen.",
          "Die Legende als falsche Behauptung kennzeichnen.",
        ],
        "Gebietsverluste und Reparationspflichten waren Vertragsfolgen. Die Dolchstoßlegende war dagegen eine falsche Behauptung, die Niederlage sei durch Verrat demokratischer Kräfte entstanden. Sie wurde gegen die Republik eingesetzt.",
        ["Zwei Vertragsfolgen", "Legende als falsch benannt", "Politische Funktion"],
      ),
      2: writing(
        "Warum ist die Kurzformel Versailles führte zwangsläufig zu Hitler historisch unzureichend?",
        [
          "Belastung ist keine Zwangsläufigkeit.",
          "Weitere Bedingungen und Entscheidungen einbeziehen.",
        ],
        "Versailles belastete die Republik, bestimmte aber nicht automatisch ihren Ausgang. Es gab demokratische Stabilisierung und politische Handlungsmöglichkeiten. Weltwirtschaftskrise, antidemokratische Kräfte und Entscheidungen konservativer Eliten müssen ebenfalls erklärt werden.",
        ["Belastung anerkannt", "Zwangsläufigkeit verworfen", "Weitere Faktoren"],
      ),
    },
  },
  {
    id: "g-novemberrevolution",
    lb: 2,
    title: "1918: Monarchien enden, Republiken entstehen",
    period: "November 1918 · Bayern und Deutschland",
    intro: "Kriegsmüdigkeit, Protest und revolutionäres Handeln veränderten die Staatsordnung.",
    paragraphs: [
      "Matrosenaufstände und Arbeiter- und Soldatenräte trugen die Revolution in viele Städte. Am 9. November 1918 wurde in Berlin die Republik ausgerufen; konkurrierende Vorstellungen von parlamentarischer Demokratie und Räteordnung trafen aufeinander.",
      "In Bayern erklärte Kurt Eisner in der Nacht vom 7. auf den 8. November den Freistaat. Die Wittelsbacher Monarchie endete. Die Revolution eröffnete demokratische Chancen, war aber auch von politischen Konflikten und Gewalt geprägt. Frauen konnten bei den Wahlen 1919 erstmals reichsweit wählen und gewählt werden.",
    ],
    takeaway:
      "Die Novemberrevolution 1918 beendete die Monarchie und eröffnete den Weg zur Republik, auch in Bayern.",
    sourceIds: ["wk1", "demokratie", "lehrplan"],
    quiz: check(
      "Welche grundlegende Veränderung brachte die Novemberrevolution 1918?",
      "Das Ende der Monarchie und den Übergang zur Republik.",
      [
        "Die Wiederherstellung der absoluten Königsherrschaft.",
        "Den Beginn des Deutschen Kaiserreichs unter Wilhelm I.",
      ],
      "Die konkrete Ausgestaltung der Republik war anschließend umkämpft.",
    ),
    workshop: timeline(
      [
        ["Erster Weltkrieg beginnt", "1914: Die Monarchien bestehen noch."],
        [
          "Bayern wird Freistaat; in Berlin wird die Republik ausgerufen",
          "November 1918: Revolutionäre Veränderungen erreichen Bayern und das Reich.",
        ],
        [
          "Wahl zur Nationalversammlung",
          "Januar 1919: Frauen können erstmals an einer gesamtdeutschen Wahl teilnehmen.",
        ],
        [
          "Weimarer Verfassung tritt in Kraft",
          "August 1919: Die demokratische Verfassung ordnet den neuen Staat.",
        ],
      ],
      "Die politische Beteiligung der Bevölkerung gehört zur Erklärung der Staatsgründung.",
    ),
    tasks: {
      1: writing(
        "Verbinde die Novemberrevolution im Reich mit dem bayerischen Beispiel.",
        ["Ende der Monarchie als Gemeinsamkeit.", "Eisner und Freistaat einordnen."],
        "Im November 1918 führten Protest und revolutionäres Handeln zum Ende der Monarchien. In Bayern erklärte Kurt Eisner den Freistaat; in Berlin wurde die Republik ausgerufen. Welche Form die neue Ordnung haben sollte, blieb politisch umstritten.",
        ["Gemeinsamkeit", "Bayerisches Beispiel", "Offener Konflikt"],
      ),
      2: writing(
        "Warum darf eine Geschichte der Revolution nicht nur aus Entscheidungen bekannter Politiker bestehen?",
        [
          "Wer protestierte und organisierte sich?",
          "Handeln und unterschiedliche Interessen betrachten.",
        ],
        "Matrosen, Arbeitende und weitere Teile der Bevölkerung trugen die Revolution. Räte, Versammlungen und Proteste veränderten Handlungsmöglichkeiten politischer Akteure. Eine Erklärung berücksichtigt deshalb gesellschaftliche Beteiligung und unterschiedliche Vorstellungen von Demokratie.",
        ["Gesellschaftliche Akteure", "Handeln erklärt", "Mehrere Ziele"],
      ),
    },
  },
];
