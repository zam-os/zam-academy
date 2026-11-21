import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

/** Lernbereich 4: Reformation und Konfessionalisierung. */
export const reformation: Lesson[] = [
  {
    id: "g7-luther-und-1517",
    lb: 4,
    title: "1517: Martin Luther und der Beginn der Reformation",
    period: "Konfessionelles Zeitalter · ab 1517",
    span: [1500, 1520],
    intro:
      "Um 1500 fürchteten viele Menschen Höllenstrafen nach dem Tod und zahlten für kirchliche Ablassbriefe. Martin Luthers Protest von 1517 veränderte ganz Europa.",
    paragraphs: [
      "Am Beginn des 16. Jahrhunderts bewegte die Frage nach dem Seelenheil fast alle Menschen. In einer Zeit von Pest, Missernten und Teuerung suchten Gläubige Vergebung ihrer Sünden und Rettung vor dem Fegefeuer. Einige Geistliche – darunter der Dominikaner Johann Tetzel – verkauften sogenannte Ablassbriefe gegen Geld, unter anderem um den Bau des Petersdoms in Rom zu finanzieren.",
      "Der Augustinermönch und Theologieprofessor Martin Luther (1483–1546) hielt diese Praxis für einen schweren Missbrauch. Aus seinem Bibelstudium schloss er, dass kein Mensch sich Gottes Gnade durch Geld oder gute Werke erkaufen könne. Allein der Glaube und Gottes Gnade schenkten Vergebung – und allein die Bibel sei verbindlicher Maßstab des Glaubens, nicht jedes Wort von Papst oder Konzil.",
      "Ende Oktober 1517 fasste Luther seine Kritik in 95 lateinischen Thesen zusammen und leitete damit den Beginn der Reformation ein. Buchdrucker übersetzten den Text sofort ins Deutsche und verbreiteten ihn innerhalb weniger Wochen im ganzen Reich. So wurde aus einer gelehrten Streitfrage eine breite Volksbewegung, die Kirche, Politik und Alltag erfasste.",
    ],
    takeaway:
      "1517 löste Martin Luther mit seinen 95 Thesen gegen den Ablasshandel die Reformation aus; gedruckte Schriften machten seine Kritik rasch im ganzen Reich bekannt.",
    sourceIds: ["lehrplan", "pw-luther", "pw-reformation", "wikisource-95"],
    quiz: check(
      "Womit leitete Martin Luther im Jahr 1517 in Wittenberg die Reformation ein?",
      "Mit seinen 95 Thesen gegen den kirchlichen Ablasshandel.",
      [
        "Mit der Erfindung des modernen Buchdrucks in Mainz.",
        "Mit der Krönung Karls V. zum römisch-deutschen Kaiser.",
      ],
      [
        "Den Buchdruck mit beweglichen Lettern entwickelte Johannes Gutenberg schon um 1450 in Mainz.",
        "Karl V. wurde erst 1519 gewählt und war als streng katholischer Kaiser ein Gegner der Reformation.",
      ],
      "Luthers 95 Thesen richteten sich gegen käufliche Ablassbriefe und betonten Gnade, Glaube und Bibel als alleinige Grundlage.",
    ),
    workshop: {
      ...classify(
        "Religion und Kritik im Jahr 1517",
        ["Praxis des Ablasshandels", "Luthers Grundgedanke", "Wirkung durch Flugschriften"],
        [
          [
            "Gläubige zahlen Geld für einen Brief, der Nachlass zeitlicher Sündenstrafen im Fegefeuer verspricht.",
            0,
            "Der Verkauf von Ablassbriefen sollte unter anderem Schulden von Fürsten und den Petersdom mitfinanzieren.",
          ],
          [
            "Nur wahre Reue und Vertrauen auf Gottes Gnade retten den Menschen, nicht bezahlte Urkunden.",
            1,
            "Die Kernbotschaft lautet: allein aus Gnade (sola gratia) und allein durch Glauben (sola fide).",
          ],
          [
            "Allein die Heilige Schrift gilt als höchster Maßstab für alle Fragen des christlichen Lebens.",
            1,
            "Deshalb übersetzte Luther die Bibel später auf der Wartburg ins Deutsche.",
          ],
          [
            "Spöttische Holzschnitte und kurze Texte in deutscher Sprache erreichen auch Handwerker und Bauern.",
            2,
            "Die rasche Verbreitung durch Druckereien machte den Protest unaufhaltsam.",
          ],
          [
            "Prediger werben auf Marktplätzen lautstark mit klingenden Münzen im Geldkasten.",
            0,
            "Gegen solche marktschreierischen Versprechungen richtete sich Luthers Empörung besonders.",
          ],
        ],
        "Religion bestimmte Denken und Handeln der Menschen um 1517 so stark, dass ein Streit um das Seelenheil das ganze Reich erschütterte.",
      ),
      sourceExcerpt: {
        title: "Martin Luther · Aus den 95 Thesen (These 27 und These 36)",
        author: "Martin Luther (Theologieprofessor in Wittenberg)",
        date: "31. Oktober 1517",
        audience: "Gelehrte Theologen und kirchliche Öffentlichkeit",
        text: "Die predigen Menschenlehre, die vorgeben, sobald der Groschen im Kasten klingt, fahre die Seele sogleich aus dem Fegefeuer. Ein jeder Christ, der wahre Reue hat, hat völlige Vergebung von Strafe und Schuld, die ihm auch ohne Ablassbriefe gehört.",
        sourceId: "wikisource-95",
        context:
          "Sprachlich leicht geglättete Wiedergabe zweier zentraler Thesen nach der frühneuhochdeutschen Übertragung (1517). Luther formulierte ursprünglich auf Latein für ein akademisches Streitgespräch; erst der Druck trug die Kritik in alle Stände.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre mithilfe der Quelle aus den 95 Thesen, was Martin Luther 1517 am Ablasshandel kritisierte und was nach seiner Überzeugung allein zur Vergebung führt.",
        [
          "Beziehe dich auf den Spruch vom Groschen im Kasten (These 27).",
          "Nenne wahre Reue, Glauben und Gottes Gnade (These 36).",
        ],
        "Luther wandte sich scharf gegen Ablassprediger, die behaupteten, allein das Geld im Kasten rette eine Seele sofort aus dem Fegefeuer. Dies bezeichnete er als bloße Menschenlehre ohne Grundlage in der Bibel. Nach seiner Überzeugung erhält jeder Christ völlige Vergebung durch wahre Reue, Glauben und Gottes Gnade – ganz ohne gekauften Ablassbrief.",
        [
          "Kritik am Geldgeschäft aus der Quelle belegt",
          "Reue und Gnade statt Ablassbrief erklärt",
          "Bezug zu 1517 hergestellt",
        ],
      ),
      2: writing(
        "Erkläre am Beispiel der Ablassbriefe und Flugblätter um 1517, wie zentral der Glaube für Denken und Alltag der Menschen im 16. Jahrhundert war.",
        [
          "Überlege, warum Menschen viel Geld für ihr Seelenheil opferten und so heftig über Thesen stritten.",
          "Vergleiche kurz mit der Bedeutung religiöser Fragen in Politik heute.",
        ],
        "Für Menschen um 1500 war die Angst vor ewiger Verdammnis eine ganz reale Sorge des Alltags, weshalb sie hart erarbeitetes Geld für Ablassbriefe ausgaben. Gerade weil das Seelenheil als höchste Lebensfrage galt, lösten Luthers Thesen auf Flugblättern sofort leidenschaftliche Debatten in Kirchen, Wirtshäusern und Ratssälen aus. Religiöse Überzeugung war damals untrennbar mit öffentlichem Handeln verknüpft.",
        [
          "Existenzielle Bedeutung des Seelenheils erklärt",
          "Zusammenhang von Sorge und Flugblattwirkung gezeigt",
          "Unterschied zu heutiger Trennung angedeutet",
        ],
      ),
    },
  },
  {
    id: "g7-bauernkrieg-und-reich",
    lb: 4,
    title: "Wormser Reichstag 1521 und der Bauernkrieg 1525",
    period: "Konfessionelles Zeitalter · 1520 bis 1526",
    span: [1520, 1530],
    intro:
      "Was als Kirchenkritik begann, wurde schnell zur hochpolitischen Machtfrage zwischen Kaiser, Fürsten und aufständischen Bauern.",
    paragraphs: [
      "Der Streit um Luther erreichte bald die höchste politische Ebene. Papst Leo X. drohte Luther den Kirchenbann an; Luther verbrannte die Bannandrohungsbulle öffentlich. Der junge Habsburger Kaiser Karl V. – Herrscher über Spanien, die Niederlande, Österreich und riesige Kolonialgebiete – lud Luther 1521 vor den Reichstag zu Worms, damit er seine Lehren widerrufe. Luther weigerte sich jedoch unter Berufung auf sein Gewissen und die Heilige Schrift.",
      "Daraufhin verhängte Karl V. das Wormser Edikt und sprach die Reichsacht über Luther aus: Niemand durfte ihn beherbergen oder seine Schriften drucken. Doch der sächsische Kurfürst Friedrich der Weise brachte Luther heimlich auf die Wartburg in Sicherheit, wo dieser das Neue Testament ins Deutsche übersetzte. Politik und Religion griffen nun offen ineinander: Mehrere Reichsfürsten und Reichsstädte schützten die Reformation und bauten eigene Landeskirchen auf.",
      "Auch auf dem Land brachen soziale Spannungen auf. Gestützt auf Luthers Botschaft von der „Freiheit eines Christenmenschen“ forderten Bauern in Südwestdeutschland, Schwaben und Franken 1524/25 in ihren „Zwölf Artikeln“ die Abschaffung der Leibeigenschaft, geringere Abgaben und freie Pfarrerwahl. Als bewaffnete Bauernhaufen Klöster und Burgen plünderten, verurteilte Luther den gewaltsamen Aufstand scharf; Fürstenheere schlugen den Bauernkrieg 1525 blutig nieder.",
    ],
    takeaway:
      "Am Wormser Reichstag 1521 wurde Luther geächtet, von Fürsten aber geschützt; im Bauernkrieg 1525 verbanden Bauern religiöse Freiheit mit sozialen Forderungen, scheiterten jedoch gegen Fürstenheere.",
    sourceIds: ["lehrplan", "pw-luther", "pw-bauernkrieg", "pw-reformation"],
    quiz: check(
      "Warum scheiterte das Wormser Edikt Kaiser Karls V. von 1521, die Reformation im Reich rasch zu stoppen?",
      "Einige mächtige Reichsfürsten schützten Luther und führten die Reformation in ihren Ländern ein.",
      [
        "Weil die aufständischen Bauern im selben Jahr Wien eroberten und den Kaiser gefangen nahmen.",
        "Weil der Papst selbst 1521 das Verbot von Luthers Schriften wieder zurücknahm.",
      ],
      [
        "Der Bauernkrieg brach erst 1524/25 aus und wurde von Fürstenheeren niedergeschlagen.",
        "Der Papst hielt an Luthers Exkommunikation fest; gerade die politische Selbstständigkeit der Reichsfürsten sicherte Luthers Schutz.",
      ],
      "Im Reich besaß der Kaiser keine alleinige Durchsetzungsmacht gegen Landesfürsten wie den Kurfürsten von Sachsen.",
    ),
    workshop: timeline(
      [
        [
          "1517 n. Chr.: Martin Luther veröffentlicht seine 95 Thesen gegen den Ablasshandel.",
          "Die kirchliche Debatte wird durch den Buchdruck zum großen öffentlichen Streit.",
        ],
        [
          "1521 n. Chr.: Vor Kaiser Karl V. auf dem Reichstag zu Worms verweigert Luther den Widerruf.",
          "Das Wormser Edikt verhängt die Reichsacht, doch Kurfürst Friedrich der Weise versteckt ihn auf der Wartburg.",
        ],
        [
          "1522 n. Chr.: Luthers deutsche Übersetzung des Neuen Testaments erscheint im Druck.",
          "Viele Menschen können biblische Texte nun erstmals in verständlichem Deutsch selbst lesen.",
        ],
        [
          "1525 n. Chr.: Im Bauernkrieg fordern Aufständische in den Zwölf Artikeln Rechte, unterliegen aber Fürstenheeren.",
          "Zehntausende Bauern kommen ums Leben; der Druck der Grundherren bleibt vielerorts bestehen.",
        ],
      ],
      "Zwischen 1517 und 1525 verwandelte sich eine theologische Frage in tiefe politische und soziale Kämpfe im Reich.",
    ),
    tasks: {
      1: writing(
        "Erkläre, welche Rollen Kaiser Karl V. und die evangelischen Reichsfürsten in der Zeit von 1521 bis 1525 spielten.",
        [
          "Beschreibe Karls Ziel auf dem Wormser Reichstag.",
          "Zeige, warum Landesfürsten für die Ausbreitung der Reformation entscheidend waren.",
        ],
        "Kaiser Karl V. wollte die Einheit der katholischen Kirche wahren und verhängte 1521 im Wormser Edikt die Reichsacht über Martin Luther. Er konnte dies aber nicht gegen eigenständige Reichsfürsten durchsetzen: Kurfürsten und Städte wie Sachsen oder Nürnberg schützten Luther und führten die Reformation in ihren Territorien ein. Damit hing die Religion zunehmend von politischen Machtverhältnissen ab.",
        [
          "Haltung Karls V. und Wormser Edikt genannt",
          "Rolle der Fürsten beim Schutz Luthers erklärt",
          "Verbindung von Politik und Religion deutlich gemacht",
        ],
      ),
      2: writing(
        "Im Jahr 1525 beriefen sich aufständische Bauern auf Luther, obwohl dieser ihre Gewalt verurteilte. Erkläre dieses Missverständnis.",
        [
          "Unterscheide zwischen innerlicher Glaubensfreiheit und sozialer Befreiung von Abgaben.",
          "Nenne zwei konkrete Forderungen aus den Zwölf Artikeln.",
        ],
        "Luther meinte mit der „Freiheit eines Christenmenschen“ vor allem die innere Freiheit des Gewissens vor Gott. Viele Bauern übertrugen diesen Gedanken jedoch auf ihre weltliche Not und forderten in den Zwölf Artikeln das Ende der Leibeigenschaft, gerechtere Abgaben sowie die Wahl eigener Pfarrer. Als Aufständische zu den Waffen griffen, stellte sich Luther auf die Seite der Obrigkeit.",
        [
          "Geistliches Freiheitsverständnis Luthers erklärt",
          "Soziale Forderungen der Bauern genannt",
          "Grund für den Bruch zwischen beiden erklärt",
        ],
      ),
    },
  },
  {
    id: "g7-konfessionalisierung",
    lb: 4,
    title: "Glaubensspaltung, Reform und Religionsfriede 1555",
    period: "Konfessionelles Zeitalter · 1530 bis 1600",
    span: [1529, 1600],
    intro:
      "Die Spaltung der westlichen Christenheit wurde dauerhaft: Neben der katholischen Kirche entstanden evangelische Konfessionen – und ein schwieriger Friede für das Reich.",
    paragraphs: [
      "Nach mehreren gescheiterten Versuchen zur Einigung prallten die Bekenntnisse auch militärisch aufeinander. Evangelische Fürsten und Städte schlossen sich im Schmalkaldischen Bund zusammen, während die bayerischen Herzöge treu katholisch blieben. Erst der Augsburger Religionsfriede von 1555 beendete die ersten Religionskriege im Reich mit einem folgenreichen Grundsatz: „Cuius regio, eius religio“ – der jeweilige Landesherr bestimmte, ob sein Territorium katholisch oder lutherisch war.",
      "Die Reformation blieb auch für die päpstliche Kirche nicht ohne Folgen. Auf dem Konzil von Trient (1545–1563) beseitigte die katholische Kirche viele kritisierte Missstände wie den Ablassverkauf, verbesserte die Ausbildung der Priester und betonte katholische Lehren wie Sakramente und Papstamt neu. Neue Orden wie die Jesuiten gründeten Gymnasien und warben offensiv für den katholischen Glauben.",
      "So prägte die Konfessionalisierung über Generationen hinweg Alltag, Schule und Politik in ganz Europa. In Bayern etwa verfestigte sich durch staatliche Kirchenpolitik ein überwiegend katholisches Profil, während Franken und manche Reichsstädte gemischt oder evangelisch wurden. Das Nebeneinander verschiedener Konfessionen im heutigen Deutschland geht direkt auf diese Entwicklung seit dem 16. Jahrhundert zurück – heute allerdings geschützt durch individuelle Religionsfreiheit statt durch Vorgabe des Fürsten.",
    ],
    takeaway:
      "Der Augsburger Religionsfriede 1555 erkannte Lutheraner neben Katholiken an, band die Konfession aber an den Landesherrn; das heutige Miteinander der Konfessionen entstand aus dieser Spaltung.",
    sourceIds: ["lehrplan", "pw-reformation", "hdbg"],
    quiz: check(
      "Was legte der Augsburger Religionsfriede von 1555 für die Konfession der Bevölkerung im Reich fest?",
      "Der jeweilige Landesherr bestimmte die Konfession seines Landes; Andersgläubige durften auswandern.",
      [
        "Jeder einzelne Bauer und jede Stadtbürgerin durfte schon 1555 die Religion frei selbst wählen.",
        "Alle Kirchen und Klöster im gesamten Reich mussten einheitlich evangelisch werden.",
      ],
      [
        "Individuelle Religionsfreiheit für jeden Untertan gab es 1555 noch nicht; entschieden haben die Fürsten („Cuius regio, eius religio“).",
        "Der Friede erkannte sowohl das katholische als auch das lutherische Bekenntnis nebeneinander an.",
      ],
      "Das Fürstenwahlrecht brachte zwar vorübergehend Frieden im Reich, sicherte aber noch keine persönliche Glaubensfreiheit und schloss Reformierte (Calvinisten) aus.",
    ),
    diagram: {
      kind: "compare",
      title: "Folgen der Konfessionalisierung im 16. Jahrhundert",
      columns: ["Evangelische Gebiete (z. B. Sachsen, Nürnberg)", "Katholische Gebiete (z. B. Herzogtum Bayern)"],
      rows: [
        {
          aspect: "Glaubensgrundlage",
          values: ["Bibel allein in deutscher Sprache, zwei Sakramente", "Bibel und kirchliche Tradition, sieben Sakramente (Konzil von Trient)"],
        },
        {
          aspect: "Leitung & Ordnung",
          values: ["Landesfürst oder Stadtrat als Schirmherr der Landeskirche", "Papst, Bischöfe und Landesfürst; neue Schulen durch Jesuiten"],
        },
        {
          aspect: "Umgang mit Minderheiten",
          values: ["Auswanderungsrecht für Katholiken", "Auswanderungsrecht für Protestanten · Streitpunkt Calvinisten bleibt offen"],
        },
      ],
      caption:
        "Aus dem gemeinsamen Mittelalter entstanden getrennte Konfessionskulturen, die Landschaften Deutschlands bis heute prägen.",
    },
    workshop: classify(
      "Auswirkungen der Reformation im 16. Jahrhundert",
      ["Folge für die päpstliche Kirche", "Folge für Politik & Reich", "Verbindung zur Gegenwart"],
      [
        [
          "Auf dem Konzil von Trient wird der Verkauf von Ablässen verboten und die Priesterausbildung gestärkt.",
          0,
          "Die katholische Reform reagierte innerlich auf frühere Missstände.",
        ],
        [
          "Der Augsburger Religionsfriede 1555 überträgt den Landesfürsten die Wahl zwischen katholisch und lutherisch.",
          1,
          "Die konfessionelle Spaltung vergrößerte die politische Macht der Territorien gegenüber dem Kaiser.",
        ],
        [
          "In Bayern zeigen Altbayern eher katholische und Teile Frankens sowie Reichsstädte evangelische Traditionen.",
          2,
          "Die Konfessionskarte Deutschlands spiegelt noch heute Entscheidungen des 16. Jahrhunderts.",
        ],
        [
          "Der Jesuitenorden gründet Gymnasien und fördert Bildung im Dienst der katholischen Erneuerung.",
          0,
          "Schule und Seelsorge wurden in beiden Konfessionen gezielt ausgebaut.",
        ],
        [
          "Anders als 1555 schützt heute das Grundgesetz die persönliche Gewissensfreiheit jedes Einzelnen.",
          2,
          "Konfessionelles Nebeneinander ohne staatlichen Zwang ist das Ergebnis eines langen Lernprozesses.",
        ],
      ],
      "Erst der Blick ins 16. Jahrhundert erklärt, warum Städte und Regionen in Deutschland bis heute unterschiedliche konfessionelle Prägungen tragen.",
    ),
    tasks: {
      1: writing(
        "Erkläre die Regel „Cuius regio, eius religio“ aus dem Augsburger Religionsfrieden 1555 und beurteile, was daran ein Fortschritt und was noch eine Grenze war.",
        [
          "Übersetze oder umschreibe die lateinische Formel.",
          "Nenne eine positive Wirkung für den Frieden und eine Einschränkung für Untertanen.",
        ],
        "Die Formel bedeutet: Wer das Land regiert, bestimmt dessen Religion. Ein Fortschritt war, dass katholische und lutherische Reichsstände sich erstmals gegenseitig als friedensfähig anerkannten und eine geregelte Auswanderung möglich wurde. Eine Grenze blieb aber, dass die Untertanen ihren Glauben nicht frei selbst wählen durften und andere Bekenntnisse wie die Reformierten ungeschützt blieben.",
        [
          "Formel richtig erklärt",
          "Friedenssicherung als Fortschritt benannt",
          "Fehlende individuelle Glaubensfreiheit als Grenze benannt",
        ],
      ),
      2: writing(
        "Erkläre historisch, warum in Deutschland und auch innerhalb Bayerns bis heute verschiedene christliche Konfessionen nebeneinander bestehen.",
        [
          "Beziehe die Reformation, den Augsburger Religionsfrieden und die Rolle der Reichsstände ein.",
          "Zeige auch die Gegenreform der katholischen Kirche.",
        ],
        "Nach 1517 schlossen sich einige Landesfürsten und Reichsstädte wie Nürnberg der Reformation an, während das Herzogtum Bayern katholisch blieb und die Kirche nach dem Konzil von Trient innerlich erneuerte; Reichsstädte wie Augsburg wurden nach 1555 gemischtkonfessionell (paritätisch). Weil der Augsburger Religionsfriede 1555 diese Aufteilung reichsrechtlich absicherte, entwickelten sich dauerhaft katholische, evangelische und gemischte Regionen nebeneinander – heute verbunden durch gemeinsame Religionsfreiheit.",
        [
          "Spaltung nach 1517 und Territorien erklärt",
          "Augsburger Religionsfrieden als Festschreibung genannt",
          "Heutiges Nebeneinander historisch abgeleitet",
        ],
      ),
    },
  },
  {
    id: "g7-hexenverfolgung",
    lb: 4,
    title: "Hexenverfolgung und Ausgrenzung in Krisenzeiten",
    period: "Frühe Neuzeit · Schwerpunkt 1560 bis 1680",
    span: [1550, 1700],
    intro:
      "Unwetter, Ernteausfälle und Seuchen ließen im 16. und 17. Jahrhundert Ängste wachsen. Tausende unschuldige Frauen – und auch Männer und Kinder – fielen einer grausamen Verfolgungswelle zum Opfer.",
    paragraphs: [
      "Nicht erst im finsteren Mittelalter, sondern ihren traurigen Höhepunkt erlebten Hexenverfolgungen in der Frühen Neuzeit, besonders zwischen 1560 und 1680 – also gleichzeitig mit Renaissance, Glaubensstreit und Dreißigjährigem Krieg. Damals sanken in der sogenannten Kleinen Eiszeit die Temperaturen; Hagel, Frost und Viehsterben vernichteten vielerorts die Lebensgrundlage.",
      "Viele Menschen suchten für solche Katastrophen übernatürliche Schuldige und machten angebliche Hexen für Schadenszauber und Teufelspakt verantwortlich. Auch in Franken und Bayern – etwa in den Hochstiften Würzburg und Bamberg oder in schwäbischen und bayerischen Städten – verfolgten Gerichte Verdächtige systematisch. Wer durch Nachbarschaftsneid oder Gerüchte angeklagt wurde, gestand unter grausamer Folter meist erfundene Taten und musste weitere Namen nennen.",
      "Gemessen an unserem modernen Menschenbild wird hier ein irrationales Phänomen sichtbar: Angst vor Unerklärlichem, Vorurteile gegen Außenseiter und fehlende Rechtsstaatlichkeit zerstörten ganze Familien, bis mutige Kritiker wie der Jesuit Friedrich Spee die Willkür der Folter anprangerten. Auch heute gibt es zwar keine Scheiterhaufen mehr, doch zeigen Verschwörungsgerüchte, Mobbing und Stigmatisierung von Minderheiten ähnliche Muster der Ausgrenzung in Krisen.",
    ],
    takeaway:
      "Hexenverfolgungen erreichten in der Frühen Neuzeit ihren Höhepunkt durch Krisenängste, Aberglaube und Folter; das Wissen über diese Mechanismen schärft den Blick gegen Ausgrenzung heute.",
    sourceIds: ["lehrplan", "pw-hexen", "hdbg"],
    quiz: check(
      "Wann erreichten die großen Hexenverfolgungen in Mitteleuropa ihren zeitlichen Höhepunkt?",
      "In der Frühen Neuzeit, vor allem zwischen etwa 1560 und 1680.",
      [
        "Im Frühmittelalter unter Otto dem Großen vor dem Jahr 1000.",
        "Erst nach dem Ende des Zweiten Weltkriegs in der Mitte des 20. Jahrhunderts.",
      ],
      [
        "Im Frühmittelalter lehnte die Kirche den Hexenglauben vielfach noch als heidnischen Irrglauben ab.",
        "Im 18. Jahrhundert schafften Aufklärung und Gerichtsreformen Hexenprozesse ab; im 20. Jahrhundert gab es sie nicht.",
      ],
      "Gerade wirtschaftliche Krisen, Missernten der Kleinen Eiszeit und das Zusammenspiel von Gerüchten und Folter trieben Prozesse ab 1560 in die Höhe.",
    ),
    workshop: classify(
      "Wie Ausgrenzung damals entstand und was heute dagegen schützt",
      ["Ursache & Ablauf von Hexenprozessen", "Kritik & Schutz im modernen Rechtsstaat"],
      [
        [
          "Nach einem schweren Hagelschlag beschuldigen Nachbarn eine alleinlebende Frau des Wetterzaubers.",
          0,
          "Unerklärliche Krisen und soziale Außenseiterstellung nährten falsche Verdächtigungen.",
        ],
        [
          "Unter schwerer Folter legen Unschuldige jedes gewünschte Geständnis ab und belasten weitere Menschen.",
          0,
          "Folter erzeugt keine Wahrheit, sondern nur die Aussage, die der Schmerz erzwingt.",
        ],
        [
          "Das Grundgesetz verbietet Folter ausdrücklich und schützt die Würde und Unschuldsvermutung jedes Menschen.",
          1,
          "Nur klare Beweise und faire Verfahren ohne Zwang garantieren Gerechtigkeit.",
        ],
        [
          "Friedrich Spee deckt 1631 in seiner Schrift auf, dass durch die Folter fast nur Unschuldige verurteilt werden.",
          1,
          "Aufgeklärte Beobachter widersprachen dem Wahn trotz eigener Gefahr mutig.",
        ],
        [
          "Verleumdungen über Minderheiten verbreiten sich rasch, weil niemand überprüft, ob ein Vorwurf stimmt.",
          0,
          "Ungeprüfte Gerüchte und Stigmatisierung bereiten Ausgrenzung damals wie heute den Boden.",
        ],
      ],
      "Irrationale Verfolgung entsteht, wenn Krisenangst auf Vorurteile trifft und der Schutz durch faire Regeln fehlt.",
    ),
    tasks: {
      1: writing(
        "Erkläre, welche Ursachen die Hexenverfolgungen im 16. und 17. Jahrhundert hatten und warum unter der Folter so viele Menschen „gestanden“.",
        [
          "Nenne Ängste durch Missernten, Unwetter und Seuchen.",
          "Erkläre die Rolle von Nachbarschaftsgerüchten und Folter.",
        ],
        "Missernten, Unwetter der Kleinen Eiszeit und Seuchen stürzten viele Menschen in Angst, für die es noch keine naturwissenschaftliche Erklärung gab. Deshalb suchten Gerichte und Nachbarn oft Sündenböcke, häufig Frauen oder Außenseiter. Weil Folter solange eingesetzt wurde, bis die Angeklagten zugaben, was die Richter hören wollten, legten Unschuldige erfundene Geständnisse ab und nannten neue Namen.",
        [
          "Krisenängste als Hintergrund genannt",
          "Sündenbock-Suche an Außenseitern erklärt",
          "Wirkung der Folter beschrieben",
        ],
      ),
      2: writing(
        "Vergleiche die Mechanismen der frühneuzeitlichen Ausgrenzung bei Hexenverfolgungen mit heutigen Erscheinungen von Stigmatisierung oder Verschwörungsgerüchten.",
        [
          "Achte auf das Muster: komplexe Krise → einfache Schuldzuweisung → fehlende Prüfung von Belegen.",
          "Nenne, was im Rechtsstaat und im Alltag dagegen schützt.",
        ],
        "Während es heute keine Hexenprozesse mit Scheiterhaufen mehr gibt, zeigt sich ein ähnliches Muster in Krisen: Wenn Ängste vor Krankheiten oder wirtschaftlichem Abstieg wachsen, verbreiten sich leicht Sündenbock-Gerüchte über einzelne Gruppen, besonders über soziale Medien. Anders als im 17. Jahrhundert schützen uns heute Unschuldsvermutung, Verbot von Zwang und kritisches Nachfragen nach echten Belegen.",
        [
          "Strukturähnlichkeit (Krise und Schuldzuweisung) erkannt",
          "Unterschied durch modernen Rechtsstaat benannt",
          "Gegenmittel (Prüfen von Belegen) genannt",
        ],
      ),
    },
  },
];
