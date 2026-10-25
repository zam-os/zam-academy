import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const migration: Lesson[] = [
  {
    id: "g10-migration-epochen",
    lb: 6,
    title: "Migration durch die Epochen",
    period: "Längsschnitt · Antike bis Gegenwart",
    intro:
      "Menschen haben zu allen Zeiten ihre Heimat verlassen. Ihre Gründe und die Folgen lassen sich über Epochen hinweg vergleichen.",
    paragraphs: [
      "Migration bedeutet, dass Menschen ihren Lebensmittelpunkt dauerhaft über eine Grenze verlegen. Sie kann freiwillig sein, etwa auf der Suche nach Arbeit, oder erzwungen durch Krieg, Verfolgung und Vertreibung. Man unterscheidet Gründe, die wegtreiben (Push-Faktoren wie Hunger, Gewalt, Unterdrückung), und Gründe, die anziehen (Pull-Faktoren wie Arbeit, Sicherheit, Freiheit oder Familie).",
      "Beispiele finden sich in allen Epochen, die du kennst: Germanische Gruppen zogen in der Spätantike ins Römische Reich. Jüdische Gemeinden erlebten im Mittelalter Ansiedlung, Verfolgung und Vertreibung, viele zogen nach Osteuropa. Im 17. Jahrhundert flohen Glaubensflüchtlinge wie die Hugenotten, im 19. Jahrhundert wanderten Millionen nach Amerika aus. Im 20. Jahrhundert erzwangen Diktaturen und Kriege Flucht, Deportation und Vertreibung in nie gekanntem Ausmaß.",
      "Für den Einzelnen bedeutet Migration oft Verlust der Heimat, Neuanfang, Sprachlernen und die Frage, wo man dazugehört. Für Gesellschaften bringt sie Arbeitskräfte, Wissen und Vielfalt, aber auch Konflikte um Wohnraum, Arbeit und Werte. Migration betrifft dabei alle Gruppen, Schichten und Ethnien: Bauern und Gelehrte, Arme und Wohlhabende, Deutsche und Nichtdeutsche. Sie ist kein Ausnahmezustand, sondern ein Grundzug der Geschichte.",
    ],
    takeaway:
      "Migration zieht sich durch alle Epochen. Push- und Pull-Faktoren, freiwillige und erzwungene Formen sowie Folgen für Einzelne und Gesellschaften lassen sich vergleichen.",
    sourceIds: ["bpb-migration", "dah", "lehrplan"],
    quiz: check(
      "Welcher Grund für Migration ist ein Pull-Faktor?",
      "Bessere Arbeitsmöglichkeiten im Zielland.",
      ["Krieg im Herkunftsland.", "Eine Hungersnot im Herkunftsland."],
      [
        "Krieg treibt Menschen weg; das ist ein Push-Faktor.",
        "Hunger treibt Menschen weg; das ist ein Push-Faktor.",
      ],
      "Pull-Faktoren ziehen Menschen an einen Ort, Push-Faktoren treiben sie fort. Oft wirken beide zusammen.",
    ),
    workshop: classify(
      "Migrationsbewegungen vergleichen",
      ["Vor allem erzwungen", "Vor allem freiwillig"],
      [
        ["Hugenotten fliehen 1685 vor Verfolgung aus Frankreich.", 0, "Religiöse Verfolgung zwang zur Flucht."],
        ["Eine Familie wandert 1850 auf der Suche nach Land nach Amerika aus.", 1, "Not spielte mit, die Entscheidung war aber freiwillig."],
        ["Deutsche werden 1946 aus der Tschechoslowakei ausgewiesen.", 0, "Vertreibung ließ keine Wahl."],
        ["Ein Arbeiter aus Italien nimmt 1960 eine Stelle in einer bayerischen Fabrik an.", 1, "Arbeitsmigration nach einem Anwerbeabkommen."],
        ["Jüdische Familien fliehen 1938 aus dem Deutschen Reich.", 0, "Verfolgung bedrohte ihr Leben."],
      ],
      "Die Grenze zwischen freiwillig und erzwungen ist nicht immer scharf. Auch wer wegen Armut geht, hat oft wenig Wahl.",
    ),
    tasks: {
      1: writing(
        "Vergleiche zwei Migrationsbewegungen aus verschiedenen Epochen nach Beweggründen und Folgen.",
        ["Zum Beispiel Hugenotten und „Gastarbeiter“.", "Gründe und Auswirkungen für Einzelne und Gesellschaft."],
        "Die Hugenotten flohen im 17. Jahrhundert vor religiöser Verfolgung, die „Gastarbeiter“ kamen ab 1955 vor allem wegen Arbeit und Lohn. Beide Gruppen mussten sich in einer fremden Umgebung neu einrichten und stießen auf Vorbehalte. Für die aufnehmenden Gesellschaften brachten beide Arbeitskraft und Fachwissen, die Hugenotten etwa im Handwerk, die Angeworbenen in der Industrie.",
        ["Gründe verglichen", "Folgen für Einzelne", "Folgen für Gesellschaft"],
      ),
      2: writing(
        "Begründe die Aussage: Migration ist kein Ausnahmezustand, sondern ein Grundzug der Geschichte.",
        ["Beispiele aus mindestens drei Epochen.", "Unterschiedliche Gruppen und Schichten."],
        "Schon in der Spätantike zogen germanische Gruppen ins Römische Reich, im Mittelalter siedelten Deutsche im Osten, im 17. Jahrhundert flohen Hugenotten, im 19. Jahrhundert wanderten Millionen nach Amerika aus, und nach 1945 kamen Vertriebene und Arbeitsmigranten. Betroffen waren Bauern und Handwerker ebenso wie Gelehrte und Verfolgte. Weil Migration in allen Epochen und Schichten vorkommt, ist sie ein Grundzug der Geschichte.",
        ["Drei Epochen", "Verschiedene Gruppen", "Schlussfolgerung"],
      ),
    },
  },
  {
    id: "g10-auswanderung",
    lb: 6,
    title: "Deutsche wandern aus",
    period: "Mittelalter bis Gegenwart",
    intro:
      "Deutsche waren über Jahrhunderte selbst Auswanderer: nach Osteuropa, nach Amerika und auf der Flucht vor dem NS-Staat.",
    paragraphs: [
      "Vom 12. bis 14. Jahrhundert zogen Bauern, Handwerker und Kaufleute aus dem Westen des Reiches in Gebiete östlich der Elbe, nach Böhmen, Schlesien und bis Siebenbürgen. Slawische und ungarische Fürsten warben sie an, weil sie Land urbar machen und Städte gründen sollten. Die Siedler erhielten Land und Freiheiten, neue Städte oft deutsches Stadtrecht. Im 18. Jahrhundert holten die Habsburger Siedler an die Donau, Zarin Katharina II. an die Wolga; ihre Nachkommen kamen später zum Teil als Spätaussiedler zurück.",
      "Im 19. Jahrhundert wanderten über fünf Millionen Deutsche nach Nordamerika aus. Gründe waren Missernten und Hunger, etwa 1816/17 und in den 1840er-Jahren, die Not der Industrialisierung, die Soziale Frage, aber auch politische Verfolgung nach der Revolution von 1848. Über Häfen wie Bremerhaven und Hamburg fuhren sie in wochenlanger Überfahrt nach New York. In den USA erhofften sie Land und Freiheit; viele erlebten harte Arbeit, Heimweh und Ablehnung, manche großen Erfolg.",
      "Nach 1933 flohen rund 280.000 Jüdinnen und Juden aus Deutschland, dazu politische Gegner des Regimes, oft unter Verlust ihres Vermögens. Viele Staaten nahmen nur wenige auf. Heute verlassen Deutsche ihr Land meist freiwillig, etwa für Studium oder Beruf in der Schweiz, in Österreich oder in den USA. Auch sie erleben, was Migranten in Deutschland erleben: Sprache lernen, Arbeit finden, Anerkennung suchen.",
    ],
    takeaway:
      "Deutsche wanderten im Mittelalter nach Osten, im 19. Jahrhundert millionenfach nach Amerika aus und flohen ab 1933 vor dem NS-Staat; Ursachen und Erfahrungen ähneln denen heutiger Migranten.",
    sourceIds: ["dah", "lemo-ns", "bpb-migration"],
    quiz: check(
      "Welcher Grund trieb im 19. Jahrhundert viele Deutsche zur Auswanderung nach Amerika?",
      "Missernten, Hunger und soziale Not.",
      [
        "Die Anwerbung als „Gastarbeiter“ durch die USA.",
        "Die Vertreibung durch die Siegermächte.",
      ],
      [
        "Anwerbeabkommen gab es erst im 20. Jahrhundert, und zwar für die Einwanderung nach Deutschland.",
        "Vertreibungen durch Siegermächte folgten nach 1945, nicht im 19. Jahrhundert.",
      ],
      "Hinzu kamen politische Gründe nach 1848 und die Hoffnung auf Land und Freiheit in Amerika.",
    ),
    workshop: timeline(
      [
        ["Deutsche Ostsiedlung (12.–14. Jahrhundert)", "Siedler gründen Dörfer und Städte im Osten."],
        ["Ansiedlung an der Wolga unter Katharina II. (ab 1763)", "Deutsche Kolonisten ziehen nach Russland."],
        ["Hungerjahr ohne Sommer (1816/17)", "Missernten lösen eine Auswanderungswelle aus."],
        ["Politische Flüchtlinge nach der Revolution (1848/49)", "Demokraten gehen ins Exil nach Amerika."],
        ["Flucht von Jüdinnen und Juden aus dem NS-Staat (ab 1933)", "Verfolgung zwingt zur Emigration."],
      ],
      "Die Gründe wandelten sich von Land und Arbeit zu Verfolgung; viele Bewegungen verbanden beides.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum Fürsten im Mittelalter deutsche Siedler in ihre Länder holten.",
        ["Land, Städte, Abgaben.", "Was erhielten die Siedler?"],
        "Die Fürsten wollten wenig besiedeltes Land urbar machen, Städte gründen und dadurch mehr Abgaben einnehmen. Die Siedler brachten Kenntnisse in Landwirtschaft und Handwerk mit. Dafür erhielten sie Land, persönliche Freiheiten und Städte oft deutsches Stadtrecht. Beide Seiten hatten also Vorteile.",
        ["Interesse der Fürsten", "Leistung der Siedler", "Rechte der Siedler"],
      ),
      2: writing(
        "Vergleiche die Lage deutscher Auswanderer in den USA im 19. Jahrhundert mit der Lage von Migranten in Deutschland heute.",
        ["Gründe, Hoffnungen, Probleme.", "Gemeinsamkeiten und Unterschiede."],
        "Wie deutsche Auswanderer im 19. Jahrhundert kommen heute viele Menschen wegen Not oder auf der Suche nach Arbeit und Sicherheit. Beide müssen eine neue Sprache lernen, Arbeit finden und erleben Vorurteile, manche aber auch Erfolg. Ein Unterschied ist, dass es heute Asylrecht, Integrationskurse und Regeln für Einwanderung gibt, die damals fehlten. Der Vergleich zeigt, dass Migrationserfahrungen sich über Zeiten hinweg ähneln.",
        ["Gemeinsamkeiten", "Unterschiede", "Schlussfolgerung"],
      ),
    },
  },
  {
    id: "g10-einwanderung",
    lb: 6,
    title: "Einwanderung und Integration in Deutschland",
    period: "1685 bis heute",
    intro:
      "Seit Jahrhunderten kamen Menschen in die deutschen Länder. Ihre Integration war Chance und Herausforderung.",
    paragraphs: [
      "Nach der Aufhebung des Toleranzedikts von Nantes flohen ab 1685 Hugenotten, französische Protestanten, aus Frankreich. Der Kurfürst von Brandenburg lud sie mit dem Edikt von Potsdam ein und gewährte Glaubensfreiheit, Steuervorteile und eigene Gemeinden; rund 20.000 kamen nach Brandenburg. Auch in Franken siedelten sie, für sie entstand ab 1686 die Neustadt von Erlangen. Die Fürsten des Absolutismus wollten ihre nach dem Dreißigjährigen Krieg entvölkerten Länder wirtschaftlich stärken, die Hugenotten brachten Handwerk und Handel.",
      "Im 19. Jahrhundert zogen Hunderttausende polnischsprachige Arbeiter ins Ruhrgebiet. Nach 1945 kamen Millionen Flüchtlinge und Vertriebene, deren Integration in Bayern trotz anfänglicher Ablehnung und Wohnungsnot gelang. Ab 1955 folgten „Gastarbeiter“, seit 1950 kamen Millionen Aussiedler und Spätaussiedler aus Osteuropa und der Sowjetunion, oft Nachfahren früherer deutscher Auswanderer.",
      "Seit den 1980er-Jahren suchen Menschen in Deutschland Asyl vor Krieg und Verfolgung. Anfang der 1990er-Jahre, während der Kriege in Jugoslawien, stiegen die Zahlen stark; 1993 wurde das Asylrecht eingeschränkt. 2015 und 2016 kamen mehr als eine Million Schutzsuchende, vor allem aus Syrien, Afghanistan und dem Irak, ab 2022 über eine Million Menschen aus der Ukraine. Integration verlangt Sprachkurse, Arbeit, Wohnraum, Schulen und gegenseitige Offenheit; es gibt Erfolge ebenso wie Probleme, Ängste und fremdenfeindliche Gewalt.",
    ],
    takeaway:
      "Von den Hugenotten bis zu heutigen Schutzsuchenden kamen Menschen nach Deutschland; Integration gelang dort am besten, wo Arbeit, Rechte und Akzeptanz zusammenkamen.",
    sourceIds: ["hugenotten", "lemo-vertreibung", "lemo-gastarbeiter", "lemo-zuwanderer"],
    quiz: check(
      "Warum holte der Kurfürst von Brandenburg 1685 Hugenotten ins Land?",
      "Um sein entvölkertes Land wirtschaftlich zu stärken.",
      [
        "Um sie zum katholischen Glauben zu bekehren.",
        "Um sie als Soldaten gegen Frankreich einzusetzen.",
      ],
      [
        "Die Hugenotten erhielten gerade Glaubensfreiheit als Protestanten.",
        "Sie kamen als Handwerker, Kaufleute und Siedler, nicht als angeworbene Armee.",
      ],
      "Nach dem Dreißigjährigen Krieg fehlten Menschen; Fachleute sollten Gewerbe und Steuereinnahmen stärken.",
    ),
    workshop: classify(
      "Chance oder Herausforderung der Integration?",
      ["Chance", "Herausforderung"],
      [
        ["Hugenottische Handwerker bauen in Erlangen neue Gewerbe auf.", 0, "Wissen und Arbeitskraft stärkten die Wirtschaft."],
        ["Kinder geflüchteter Familien brauchen Plätze in Schulen und Sprachkurse.", 1, "Integration kostet Geld und Personal."],
        ["Vertriebene gründen in Bayern neue Betriebe.", 0, "Sie trugen zum Aufschwung bei."],
        ["Anschläge auf Unterkünfte von Asylsuchenden.", 1, "Fremdenfeindliche Gewalt bedroht Menschen und den Zusammenhalt."],
        ["Pflegekräfte aus dem Ausland arbeiten in deutschen Kliniken.", 0, "Zuwanderung gleicht Fachkräftemangel aus."],
      ],
      "Chancen und Herausforderungen treten zusammen auf. Wie gut Integration gelingt, hängt auch von politischen Entscheidungen ab.",
    ),
    tasks: {
      1: writing(
        "Erläutere Schwierigkeiten und Erfolge bei der Integration der Flüchtlinge und Vertriebenen in Bayern nach 1945.",
        ["Wohnraum, Ablehnung, Konfession.", "Neue Orte und Betriebe."],
        "Anfangs fehlte Wohnraum, Flüchtlinge lebten in Lagern oder beschlagnahmten Zimmern, Einheimische lehnten sie oft ab, auch Konfessionen trennten. Mit der Zeit gelang die Integration: Neue Orte wie Waldkraiburg oder Neugablonz entstanden, Vertriebene gründeten Betriebe und wurden in Politik und Gesellschaft heimisch. Arbeit und Wohnungsbau waren dabei entscheidend.",
        ["Schwierigkeiten", "Erfolge", "Gründe für den Erfolg"],
      ),
      2: writing(
        "Vergleiche die Aufnahme der Hugenotten 1685 mit der Aufnahme von Schutzsuchenden heute.",
        ["Gründe der Aufnahme, Rechte, Reaktionen.", "Gemeinsamkeiten und Unterschiede."],
        "Die Hugenotten wurden aus wirtschaftlichem Interesse des Fürsten eingeladen und erhielten Sonderrechte. Heute nimmt Deutschland Schutzsuchende auf, weil Grundgesetz und internationales Recht Asyl garantieren, nicht weil ein Herrscher es wünscht. In beiden Fällen gab es Vorbehalte in der Bevölkerung und Chancen für die Wirtschaft. Ein Unterschied ist, dass Integration heute eine Aufgabe der ganzen demokratischen Gesellschaft ist.",
        ["Gemeinsamkeit", "Unterschied", "Urteil"],
      ),
    },
  },
  {
    id: "g10-einwanderungsland",
    lb: 6,
    title: "Deutschland als Einwanderungsland",
    period: "1990 bis heute",
    intro:
      "Lange sagten Politiker, Deutschland sei kein Einwanderungsland. Heute ist es eines der wichtigsten Zielländer der Welt.",
    paragraphs: [
      "Bis in die 1990er-Jahre galt in der Politik oft der Satz, Deutschland sei kein Einwanderungsland, obwohl Millionen Zugewanderte hier lebten. Das änderte sich schrittweise. Seit 2000 erhalten in Deutschland geborene Kinder ausländischer Eltern unter Bedingungen die deutsche Staatsangehörigkeit. Das Zuwanderungsgesetz von 2005 regelte Einwanderung und Integrationskurse, spätere Gesetze erleichterten die Einwanderung von Fachkräften, seit 2024 ist die mehrfache Staatsangehörigkeit grundsätzlich erlaubt.",
      "Heute hat mehr als ein Viertel der Menschen in Deutschland einen Migrationshintergrund. Viele Betriebe, Krankenhäuser und Pflegeheime sind auf Zugewanderte angewiesen. Zugleich wird heftig über Grenzen der Aufnahme, Abschiebungen, Integration und Zusammenhalt gestritten; rechtsextreme Gewalt richtet sich gegen Menschen mit Einwanderungsgeschichte.",
      "Weltweit waren nach Angaben des UN-Flüchtlingshilfswerks Ende 2024 rund 123 Millionen Menschen auf der Flucht, die meisten innerhalb ihres eigenen Landes oder in Nachbarstaaten; die größte Fluchtkrise herrschte im Sudan. Neben Flucht gibt es Arbeits-, Bildungs- und Familienmigration. Zahlen ändern sich jedes Jahr: Prüfe neueste Angaben und frage, wie sie erhoben wurden.",
    ],
    takeaway:
      "Deutschland hat sich seit 2000 rechtlich als Einwanderungsland verstanden; Migration ist weltweit und in Deutschland Alltag und politischer Streitpunkt zugleich.",
    sourceIds: ["lemo-einwanderungsland", "lemo-zuwanderer", "unhcr", "bpb-migration"],
    quiz: check(
      "Was regelte das Zuwanderungsgesetz von 2005 unter anderem?",
      "Einwanderung nach Deutschland und Integrationskurse.",
      [
        "Die Anwerbung von „Gastarbeitern“ aus Italien.",
        "Die Aufnahme der Hugenotten.",
      ],
      [
        "Das Anwerbeabkommen mit Italien stammt von 1955.",
        "Die Hugenotten nahm Brandenburg 1685 auf.",
      ],
      "Mit dem Gesetz erkannte die Politik an, dass Deutschland Einwanderung regeln und Integration fördern muss.",
    ),
    workshop: timeline(
      [
        ["Erstes Anwerbeabkommen mit Italien (1955)", "Arbeitsmigration beginnt."],
        ["Anwerbestopp (1973)", "Familiennachzug prägt die Zuwanderung."],
        ["Einschränkung des Asylrechts (1993)", "Reaktion auf hohe Antragszahlen."],
        ["Reform des Staatsangehörigkeitsrechts (2000)", "In Deutschland Geborene können Deutsche werden."],
        ["Zuwanderungsgesetz (2005)", "Einwanderung und Integration werden gesetzlich geregelt."],
        ["Mehrfache Staatsangehörigkeit grundsätzlich erlaubt (2024)", "Einbürgerung ohne Aufgabe der alten Staatsangehörigkeit."],
      ],
      "Das Recht folgte der Wirklichkeit oft mit Verspätung: Einwanderung gab es lange, bevor die Politik sie so nannte.",
    ),
    tasks: {
      1: writing(
        "Erkläre, woran man erkennt, dass Deutschland ein Einwanderungsland ist.",
        ["Bevölkerung und Arbeitswelt.", "Gesetze."],
        "Mehr als ein Viertel der Bevölkerung hat einen Migrationshintergrund, und viele Bereiche wie Pflege und Industrie sind auf Zugewanderte angewiesen. Gesetze wie die Reform des Staatsangehörigkeitsrechts 2000 und das Zuwanderungsgesetz 2005 regeln Einwanderung und Einbürgerung. Deutschland ist also in Wirklichkeit und im Recht ein Einwanderungsland.",
        ["Bevölkerung", "Arbeitswelt", "Gesetze"],
      ),
      2: writing(
        "Erörtere die gegenwärtige Situation von Migrantinnen und Migranten in Deutschland.",
        ["Chancen und Hindernisse.", "Perspektiven der Aufnehmenden und der Zugewanderten."],
        "Viele Zugewanderte finden Arbeit, gründen Unternehmen und gestalten die Gesellschaft mit; Sprachkurse und Einbürgerung erleichtern Teilhabe. Hindernisse sind fehlende Anerkennung von Abschlüssen, lange Verfahren, Wohnungsmangel und Diskriminierung. Auch aufnehmende Gemeinden stehen vor Herausforderungen bei Schulen und Wohnraum. Ich meine, Integration gelingt, wenn Rechte und Pflichten für alle klar sind und Vorurteilen widersprochen wird.",
        ["Chancen", "Hindernisse", "Eigenes Urteil"],
      ),
    },
  },
];

export const historyCulture: Lesson[] = [
  {
    id: "g10-geschichtskultur-frueher",
    lb: 7,
    title: "Mit Geschichte Politik machen: Rom und das 19. Jahrhundert",
    period: "Längsschnitt · Antike und 19. Jahrhundert",
    intro:
      "Schon immer haben Menschen Geschichte genutzt, um sich selbst zu deuten. Vorbilder und Denkmäler zeigen das.",
    paragraphs: [
      "Römische Feldherren und Kaiser verehrten Alexander den Großen als Vorbild. Pompeius trug den Beinamen „Magnus“, der Große; Caesar soll vor einer Statue Alexanders geklagt haben, dass er in diesem Alter noch nichts Vergleichbares erreicht habe, Augustus besuchte sein Grab in Alexandria. Wer sich auf Alexander berief, wollte als großer Eroberer gelten. Die Erinnerung an eine historische Gestalt diente der eigenen Macht.",
      "Im 19. Jahrhundert entstanden viele Denkmäler, die eine gemeinsame nationale Geschichte zeigen sollten, als es noch keinen deutschen Nationalstaat gab oder er gerade gegründet war. König Ludwig I. ließ bei Regensburg die Walhalla bauen (1842 eröffnet), eine Ruhmeshalle für „rühmlich ausgezeichnete Teutsche“, und bei Kelheim die Befreiungshalle (1863) zur Erinnerung an die Kriege gegen Napoleon. Im Teutoburger Wald entstand das Hermannsdenkmal (1875), am Rhein das Niederwalddenkmal (1883).",
      "Solche Denkmäler sagen mehr über ihre Erbauer als über die gefeierte Zeit. Die Walhalla zeigt das Bild einer deutschen Kulturnation, wie Ludwig I. sie sah. Wer ein Denkmal untersucht, fragt: Wer ließ es wann bauen, wen ehrt es, wen lässt es aus, und welche Botschaft sollte es senden? Heute sind diese Bauten selbst Zeugnisse der Geschichtskultur ihrer Zeit.",
    ],
    takeaway:
      "Von Alexander-Vorbildern in Rom bis zu Nationaldenkmälern des 19. Jahrhunderts: Geschichte wurde genutzt, um Macht und Zugehörigkeit zu begründen; Denkmäler zeigen die Sicht ihrer Erbauer.",
    sourceIds: ["walhalla", "bpb-erinnerung"],
    quiz: check(
      "Was sagt ein Denkmal des 19. Jahrhunderts vor allem aus?",
      "Wie seine Erbauer Geschichte deuteten und welche Botschaft sie senden wollten.",
      [
        "Wie die dargestellte Person tatsächlich ausgesehen und gelebt hat.",
        "Was alle Menschen der dargestellten Zeit über die Ereignisse dachten.",
      ],
      [
        "Viele Figuren wie Hermann sind frei gestaltete Idealbilder.",
        "Ein Denkmal spiegelt die Sicht seiner Auftraggeber.",
      ],
      "Denkmäler sind Quellen für die Geschichtskultur ihrer Entstehungszeit.",
    ),
    workshop: classify(
      "Ein Denkmal befragen",
      ["Auftraggeber und Zeit", "Botschaft", "Was fehlt?"],
      [
        ["Ludwig I. lässt die Walhalla bauen, sie wird 1842 eröffnet.", 0, "Auftraggeber und Datum ordnen das Denkmal ein."],
        ["Große Deutsche sollen das Gefühl einer gemeinsamen Nation stärken.", 1, "Das Denkmal will Zugehörigkeit stiften."],
        ["Frauen sind unter den Geehrten anfangs nur wenige.", 2, "Auswahl zeigt die Maßstäbe der Zeit."],
        ["Die Befreiungshalle erinnert an die Kriege gegen Napoleon.", 1, "Ein Sieg wird als nationale Leistung gedeutet."],
      ],
      "Ein Denkmal ist eine Auswahl. Wer fragt, wer fehlt, erkennt seine Perspektive.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum sich römische Herrscher auf Alexander den Großen beriefen.",
        ["Was verkörperte Alexander?", "Welchen Nutzen hatten sie davon?"],
        "Alexander galt als unbesiegter Eroberer, der ein riesiges Reich geschaffen hatte. Wer sich auf ihn berief, wie Pompeius mit dem Beinamen „Magnus“, wollte als ebenso großer Feldherr erscheinen. Die Erinnerung an Alexander sollte also das eigene Ansehen und den Machtanspruch stärken.",
        ["Bild Alexanders", "Beispiel", "Zweck"],
      ),
      2: writing(
        "Untersuche ein Denkmal deiner Umgebung oder die Walhalla mit vier Fragen und deute seine Botschaft.",
        ["Wer, wann, wen, wen nicht?", "Welche Botschaft für die Zeitgenossen?"],
        "Die Walhalla ließ König Ludwig I. bauen, eröffnet wurde sie 1842, also vor der Gründung des deutschen Nationalstaats. Sie ehrt bedeutende Persönlichkeiten deutscher Sprache und Kultur, anfangs kaum Frauen. Ihre Botschaft war, dass die Deutschen eine große Kulturnation sind, auch ohne gemeinsamen Staat. Heute ist sie selbst ein Zeugnis der Geschichtskultur des 19. Jahrhunderts.",
        ["Vier Fragen beantwortet", "Botschaft gedeutet", "Einordnung als Geschichtskultur"],
      ),
    },
  },
  {
    id: "g10-instrumentalisierung",
    lb: 7,
    title: "Geschichte als Waffe: NS-Staat und DDR",
    period: "1933–1989",
    intro:
      "Diktaturen schreiben sich ihre Geschichte. Sie wählen aus, verfälschen und nutzen Vergangenheit, um Herrschaft zu rechtfertigen.",
    paragraphs: [
      "Instrumentalisierung heißt: Geschichte wird für politische Zwecke benutzt und dafür verzerrt. Der NS-Staat inszenierte am 21. März 1933 den „Tag von Potsdam“ als Bund zwischen dem alten Preußen und der neuen Bewegung. Er feierte Germanen und mittelalterliche Kaiser als Vorbilder, deutete Geschichte als Kampf von „Rassen“ und nutzte Nürnberg als alte Reichsstadt für seine Parteitage. Schulbücher und Filme sollten diese Sicht verbreiten.",
      "Die DDR stellte sich als antifaschistischen Staat dar, der aus dem Widerstand gegen Hitler hervorgegangen sei. Die Gedenkstätte Buchenwald (1958) betonte vor allem den Widerstand kommunistischer Häftlinge, andere Opfergruppen traten zurück. Der Kommunist Ernst Thälmann wurde zum Helden verklärt, der Bauernkrieg als frühe Revolution gedeutet. In den 1980er-Jahren entdeckte die SED auch Luther und Friedrich den Großen für sich, um ihre Herrschaft in der deutschen Geschichte zu verankern.",
      "In Demokratien wird Geschichte ebenfalls politisch genutzt, aber Wissenschaft, Medien und Bürger können widersprechen; Deutungen werden öffentlich gestritten. Auch heute instrumentalisieren Regierungen Geschichte, etwa wenn Russlands Führung der Ukraine eine eigene Nation abspricht. Prüfe deshalb: Wer erzählt Geschichte, mit welchem Ziel, und welche Fakten werden weggelassen?",
    ],
    takeaway:
      "NS-Staat und DDR wählten und verzerrten Geschichte, um ihre Herrschaft zu rechtfertigen; in Demokratien kann man Deutungen offen widersprechen.",
    sourceIds: ["lemo-ns", "lemo-aufarbeitung", "bpb-erinnerung"],
    quiz: check(
      "Welches Bild von sich verbreitete die DDR, um ihre Herrschaft zu rechtfertigen?",
      "Das Bild eines antifaschistischen Staates, der aus dem Widerstand entstanden sei.",
      [
        "Das Bild eines Nachfolgers des Kaiserreichs von 1871.",
        "Das Bild einer parlamentarischen Demokratie nach westlichem Vorbild.",
      ],
      [
        "Das Kaiserreich galt der SED als Staat der Fürsten und Kapitalisten.",
        "Die DDR lehnte die parlamentarische Demokratie des Westens ab.",
      ],
      "Der Antifaschismus war ein Gründungsmythos: Er stellte die Bundesrepublik als Erbin des NS-Staats dar und die DDR als die bessere Seite der Geschichte.",
    ),
    workshop: classify(
      "Wer nutzt Geschichte wie?",
      ["NS-Staat", "DDR"],
      [
        ["Der „Tag von Potsdam“ verbindet 1933 Preußen und die neue Regierung.", 0, "Inszenierte Kontinuität sollte Vertrauen schaffen."],
        ["Ernst Thälmann wird als Held der Arbeiterklasse verehrt.", 1, "Ein kommunistischer Märtyrerkult."],
        ["Germanen werden als „arische“ Vorfahren verherrlicht.", 0, "Rassenideologie wurde in die Vergangenheit verlegt."],
        ["Die Gedenkstätte Buchenwald stellt den kommunistischen Widerstand in den Vordergrund.", 1, "Erinnerung diente der Legitimation der SED."],
        ["Der Bauernkrieg wird als frühe Revolution gefeiert.", 1, "Geschichte wurde marxistisch gedeutet."],
      ],
      "Beide Diktaturen wählten Vorbilder und Feinde aus der Geschichte. Ihre Deutungen sagen viel über ihre Ziele.",
    ),
    tasks: {
      1: writing(
        "Erkläre an einem Beispiel, wie der NS-Staat Geschichte instrumentalisierte.",
        ["Tag von Potsdam oder Germanenkult.", "Ziel der Inszenierung."],
        "Am 21. März 1933 inszenierte der NS-Staat den „Tag von Potsdam“: Hindenburg und Hitler traten an einem Ort preußischer Tradition gemeinsam auf. So sollte die neue Regierung als Fortsetzung der preußischen Geschichte erscheinen und konservative Bürger gewinnen. Geschichte diente damit der Legitimation der Diktatur.",
        ["Beispiel", "Darstellung", "Ziel"],
      ),
      2: writing(
        "Vergleiche den Umgang mit Geschichte in Diktatur und Demokratie.",
        ["Wer bestimmt die Deutung?", "Widerspruch und Wissenschaft."],
        "In einer Diktatur gibt die Führung eine verbindliche Deutung vor und unterdrückt Widerspruch; Schulbücher, Medien und Gedenkstätten folgen ihr. In einer Demokratie gibt es ebenfalls politische Deutungen, aber Historiker, Medien und Bürger können frei widersprechen und streiten. Deshalb wird Geschichte in Demokratien zwar auch genutzt, kann aber korrigiert werden.",
        ["Diktatur", "Demokratie", "Schlussfolgerung"],
      ),
    },
  },
  {
    id: "g10-geschichte-unterhaltung",
    lb: 7,
    title: "Geschichte als Erlebnis: Märkte, Reenactment, Filme",
    period: "Gegenwart",
    intro:
      "Mittelaltermärkte, nachgespielte Schlachten, Filme und Spiele machen Geschichte zum Erlebnis. Was sie zeigen, ist oft eine Mischung aus Wissen und Vorstellung.",
    paragraphs: [
      "Geschichte ist ein großer Unterhaltungsmarkt. Auf Mittelaltermärkten gibt es Gaukler, Met und Gewandungen, beim Reenactment stellen Menschen Ereignisse in historischer Kleidung nach. In Bayern spielen Bürgerinnen und Bürger seit 1903 die „Landshuter Hochzeit“ von 1475 nach. Historische Filme, Serien und Computerspiele erreichen Millionen Menschen und prägen deren Bild von der Vergangenheit stärker als Schulbücher.",
      "Solche Angebote wecken Interesse und machen Alltag anschaulich. Sie folgen aber den Regeln der Unterhaltung: Spannung, Abenteuer und Gefühl. Dabei entstehen imaginative Geschichtsvorstellungen, die nicht der historischen Wirklichkeit entsprechen. Wikinger mit Hörnerhelmen sind eine Erfindung des 19. Jahrhunderts, die vor allem durch Bühnenkostüme bekannt wurde. Auch die Vorstellung, die Menschen im Mittelalter hätten die Erde für eine Scheibe gehalten, ist ein Mythos: Gebildete wussten, dass sie eine Kugel ist.",
      "Neben realen Geschichtsvorstellungen, die sich auf Quellen stützen, existieren also imaginative, die Fantasie, Klischees und Wünsche spiegeln. Beide wirken auf das Geschichtsbewusstsein. Prüfe bei einem Angebot: Was ist belegt, was erfunden, und warum wird es so gezeigt? Wer Geschichte erlebt, darf sie genießen, sollte sie aber nicht mit der Vergangenheit verwechseln.",
    ],
    takeaway:
      "Geschichte im Unterhaltungssektor weckt Interesse, mischt aber belegtes Wissen mit imaginativen Vorstellungen; prüfe, was belegt und was erfunden ist.",
    sourceIds: ["bpb-erinnerung", "kinofenster"],
    quiz: check(
      "Welche Vorstellung über die Vergangenheit ist ein Mythos?",
      "Dass Wikinger Helme mit Hörnern trugen.",
      [
        "Dass im Mittelalter Märkte in Städten stattfanden.",
        "Dass die Landshuter Hochzeit 1475 gefeiert wurde.",
      ],
      [
        "Märkte waren ein wichtiger Teil mittelalterlicher Städte; das ist belegt.",
        "Die Hochzeit von 1475 ist historisch belegt; das Fest stellt sie seit 1903 nach.",
      ],
      "Hörnerhelme wurden im 19. Jahrhundert populär, unter anderem durch Bühnenkostüme; archäologisch sind sie für Wikinger nicht belegt.",
    ),
    workshop: classify(
      "Real oder imaginativ?",
      ["Durch Quellen gestützt", "Imaginative Vorstellung"],
      [
        ["Ritter trugen in Schlachten Rüstungen und Schilde.", 0, "Das ist durch Funde und Bilder belegt."],
        ["Wikinger zogen mit Hörnerhelmen in den Kampf.", 1, "Eine Erfindung des 19. Jahrhunderts."],
        ["Im Mittelalter glaubten alle, die Erde sei eine Scheibe.", 1, "Gebildete wussten, dass die Erde eine Kugel ist."],
        ["Herzog Georg der Reiche heiratete 1475 in Landshut die polnische Königstochter Hedwig.", 0, "Die Hochzeit ist durch Quellen belegt."],
        ["Alle Menschen im Mittelalter waren schmutzig und dumm.", 1, "Ein Klischee, das die Vielfalt der Epoche übersieht."],
      ],
      "Imaginative Vorstellungen sind nicht harmlos: Sie prägen, wie wir über frühere Menschen und andere Kulturen denken.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum historische Unterhaltungsangebote Geschichte oft verzerren.",
        ["Ziele der Anbieter.", "Erwartungen des Publikums."],
        "Anbieter wollen Zuschauer und Besucher begeistern und Geld verdienen, deshalb zeigen sie Spannung, Helden und eindrucksvolle Bilder. Das Publikum erwartet oft vertraute Klischees, etwa Hörnerhelme bei Wikingern. Langweiliger Alltag, Widersprüche und Lücken in den Quellen passen schlecht dazu und werden weggelassen oder ausgeschmückt.",
        ["Ziele der Anbieter", "Erwartungen", "Folge"],
      ),
      2: writing(
        "Beurteile den Wert eines Mittelaltermarkts oder Reenactments für das Geschichtsverständnis.",
        ["Chancen: Anschauung, Interesse.", "Grenzen: Klischees, Vereinfachung."],
        "Ein Mittelaltermarkt oder ein Reenactment macht Kleidung, Handwerk und Feste anschaulich und weckt Interesse an der Vergangenheit. Zugleich vermischt er Belegtes mit Fantasie und zeigt kaum Not, Krankheit oder Ungleichheit. Er ist deshalb ein guter Anlass, Fragen zu stellen, aber kein Ersatz für die Arbeit mit Quellen und Darstellungen.",
        ["Chancen", "Grenzen", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g10-gedenkkultur",
    lb: 7,
    title: "Gedenktage und Welterbe: offizielle Geschichtskultur",
    period: "Gegenwart",
    intro:
      "Woran ein Staat erinnert, zeigt, was ihm heute wichtig ist. Gedenktage und Welterbestätten sind dafür Beispiele.",
    paragraphs: [
      "In der Bundesrepublik gibt es feste Gedenk- und Feiertage. Der 3. Oktober ist als Tag der Deutschen Einheit Nationalfeiertag. Am 27. Januar, dem Tag der Befreiung des Lagers Auschwitz 1945, wird seit 1996 der Opfer des Nationalsozialismus gedacht. Der 9. November erinnert an mehrere Ereignisse: die Ausrufung der Republik 1918, die Novemberpogrome 1938 und die Öffnung der Mauer 1989. Auch der 17. Juni und der 20. Juli, der Tag des Attentats auf Hitler 1944, sind Gedenktage.",
      "Gedenkkultur verändert sich mit der Gegenwart. In den 1950er-Jahren standen eigene Leiden wie Bombenkrieg und Vertreibung im Vordergrund. 1985 nannte Bundespräsident Richard von Weizsäcker den 8. Mai einen Tag der Befreiung, was damals viele Menschen ablehnten. 2005 wurde in Berlin das Denkmal für die ermordeten Juden Europas eröffnet, seit den 1990er-Jahren erinnern Stolpersteine vor Wohnhäusern an einzelne Opfer. Heute wird auch über die Erinnerung an die Kolonialzeit gestritten. So spiegeln sich Interessen, Positionen und Werte der Gegenwart in der Geschichtskultur.",
      "Auch das UNESCO-Welterbe ist Teil offizieller Geschichtskultur: Staaten schlagen Stätten vor, die sie für herausragend halten. Bayern hat elf Welterbestätten, darunter die Würzburger Residenz, die Wieskirche, die Altstädte von Bamberg und Regensburg, den Limes, das Augsburger Wassermanagement und seit 2025 die Schlösser König Ludwigs II. Solche Titel schützen Denkmäler, stärken Tourismus und regionale Identität und zeigen, welche Geschichte als gemeinsames Erbe der Menschheit gilt.",
    ],
    takeaway:
      "Gedenktage und Welterbe zeigen, woran eine Gesellschaft erinnern will; die Geschichtskultur der Bundesrepublik hat sich mit den Werten der Gegenwart gewandelt.",
    sourceIds: ["bpb-erinnerung", "unesco"],
    quiz: check(
      "Warum gilt der 9. November als besonderer Tag der deutschen Geschichte?",
      "An ihm fanden 1918, 1938 und 1989 sehr unterschiedliche Ereignisse statt.",
      [
        "Er ist seit 1990 der Nationalfeiertag des vereinten Deutschland.",
        "An ihm wurde 1949 das Grundgesetz der Bundesrepublik verkündet.",
      ],
      [
        "Nationalfeiertag ist der 3. Oktober.",
        "Das Grundgesetz wurde am 23. Mai 1949 verkündet.",
      ],
      "Ausrufung der Republik, Novemberpogrome und Öffnung der Mauer: Ein Gedenktag verbindet Freude und Schuld. Darum wurde er nicht Nationalfeiertag.",
    ),
    workshop: classify(
      "Woran erinnert der Tag?",
      ["Opfer des Nationalsozialismus", "Demokratie und Freiheit", "Deutsche Einheit"],
      [
        ["27. Januar", 0, "Befreiung des Lagers Auschwitz 1945; Gedenktag seit 1996."],
        ["17. Juni", 1, "Aufstand von 1953 für Freiheit und freie Wahlen."],
        ["3. Oktober", 2, "Tag der Deutschen Einheit seit 1990."],
        ["20. Juli", 1, "Attentat auf Hitler 1944 und Widerstand gegen die Diktatur."],
      ],
      "Gedenktage wählen Ereignisse aus und geben ihnen eine Bedeutung für die Gegenwart.",
    ),
    tasks: {
      1: writing(
        "Erkläre an einem Beispiel, wie sich die Gedenkkultur der Bundesrepublik verändert hat.",
        ["8. Mai oder Holocaust-Gedenken.", "Früher und heute."],
        "In den 1950er-Jahren sahen viele Deutsche den 8. Mai 1945 vor allem als Tag der Niederlage. 1985 nannte Bundespräsident von Weizsäcker ihn einen Tag der Befreiung, auch für die Deutschen. Heute ist diese Deutung weit verbreitet, weil die Verbrechen des NS-Staats und das Leid der Opfer im Mittelpunkt der Erinnerung stehen.",
        ["Früherer Umgang", "Wandel", "Begründung"],
      ),
      2: writing(
        "Beurteile, was die Auswahl von Welterbestätten über die Gegenwart verrät.",
        ["Wer schlägt vor?", "Tourismus, Identität, Schutz."],
        "Welterbestätten werden von Staaten vorgeschlagen, die sich davon Schutz, Ansehen und Tourismus erhoffen. Die Auswahl zeigt deshalb, welche Geschichte ein Land heute für besonders und vorzeigbar hält, etwa Schlösser, Kirchen und Altstädte. Orte von Unrecht und Leid sind seltener vertreten. Welterbe ist damit nicht nur Schutz der Vergangenheit, sondern Ausdruck heutiger Interessen.",
        ["Verfahren", "Interessen", "Urteil"],
      ),
    },
  },
];
