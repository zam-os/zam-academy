import { classify, lesson, timeline } from "./helpers";

export const revolution = [
  lesson(1, {
    id: "aufklaerung", title: "Wer gibt dem Staat seine Macht?", period: "18. Jahrhundert · 1789", sourceIds: ["curriculum", "rights"],
    intro: "Prüfe, welche Ideen der Aufklärung eine Herrschaft mit festen Grenzen möglich machten.",
    paragraphs: [
      "Wiederholung aus Klasse 7: Im Absolutismus beanspruchte der König eine besonders weitreichende Macht und begründete sie unter anderem mit Gottes Willen. Aufklärer forderten, Regeln mit der eigenen Vernunft zu prüfen. Herrschaft sollte sich vor den Menschen begründen lassen.",
      "Menschenrechte stehen jedem Menschen zu. Volkssouveränität bedeutet, dass die politische Macht vom Volk ausgeht. Nach Artikel 3 der französischen Erklärung von 1789 lag der Ursprung der Souveränität bei der Nation. Viele Bürgerliche, etwa Kaufleute und Juristen, forderten Mitsprache.",
      "Wenn eine Obrigkeit etwa einen Kritiker willkürlich festnehmen lässt, schützen ihn verbindliche Gesetze und unabhängige Gerichte. So zeigen sich Rechtsstaatlichkeit und Gewaltenteilung im Alltag. Der Anspruch auf Rechte war 1789 weiter als die politische Wirklichkeit: Frauen hatten keine gleichberechtigte politische Mitsprache.",
    ],
    takeaway: "Die Aufklärung prüft Herrschaft mit Vernunft. Menschenrechte, vom Volk abgeleitete Macht und Gewaltenteilung begrenzen Willkür.",
    check: ["Welche Frage beantwortet der Begriff Volkssouveränität?", "Von wem geht die politische Macht aus?", ["Welche Rechte gelten für alle Menschen?", "Wie werden staatliche Aufgaben verteilt?"], "Volkssouveränität bestimmt den Ursprung der Macht. Die anderen Fragen betreffen Menschenrechte und Gewaltenteilung."],
    workshop: {
      ...classify("Ideen am Quellentext erkennen", ["Menschenrechte", "Souveränität", "Gewaltenteilung"], [
        ["Gleiche Rechte kommen Menschen von Geburt an zu.", 0, "Artikel 1 formuliert einen allgemeinen Anspruch."],
        ["Die Nation ist Ursprung legitimer politischer Macht.", 1, "Artikel 3 beantwortet die Frage nach dem Ursprung der Herrschaft."],
        ["Eine Verfassung braucht eine festgelegte Teilung der Gewalten.", 2, "Artikel 16 nennt die Gewaltenteilung neben der Sicherung der Rechte."],
      ], "Eine Erklärung setzt einen Maßstab. Für ihre Umsetzung brauchst du weitere Quellen."),
      sourceExcerpt: { title: "Erklärung der Menschen- und Bürgerrechte · Artikel 1, erster Satz", author: "Französische Nationalversammlung", date: "26. August 1789", audience: "Französische Öffentlichkeit und staatliche Organe", text: "Die Menschen werden frei und gleich an Rechten geboren und bleiben es.", sourceId: "rights", context: "Eigene Übersetzung. Der Text formuliert Rechte. Wer wählen durfte, ergibt sich aus den Wahlregeln und späteren Verfassungen." },
    },
    guided: ["Erkläre mit Artikel 1, warum Vorrechte nach Geburt kritisiert wurden.", ["Was bedeutet gleich an Rechten?", "Woran hingen Vorrechte der Stände?"], "Artikel 1 formuliert gleiche Rechte von Geburt an. Vorrechte bestimmter Stände hingen hingegen an der Herkunft. Diese Ungleichbehandlung widersprach dem Anspruch der Erklärung.", ["Artikel 1 wiedergegeben", "Ständische Vorrechte erklärt", "Widerspruch begründet"]],
    transfer: ["Eine Behörde verbietet regierungskritische Texte. Begründe, warum sowohl Meinungsfreiheit als auch unabhängige Gerichte wichtig sind.", ["Welches Recht wird eingeschränkt?", "Wer kann das Verbot prüfen?"], "Die Meinungsfreiheit schützt Kritik an der Regierung. Ein unabhängiges Gericht kann prüfen, ob das Verbot eine rechtliche Grundlage hat. Dadurch entscheidet die Behörde über die Grenzen ihrer Macht nicht allein.", ["Betroffenes Recht benannt", "Gericht erklärt", "Zusammenhang mit Willkür begründet"]],
  }),
  lesson(1, {
    id: "franzoesische-revolution", title: "Warum geriet Frankreich 1789 in Revolution?", period: "1789–1794", sourceIds: ["curriculum", "rights"],
    intro: "Verfolge, wie soziale Spannungen, Staatsverschuldung und neue Ideen zusammenwirkten.",
    paragraphs: [
      "Der französische Staat war hoch verschuldet. Adlige und Geistliche genossen Vorrechte, während der Dritte Stand einen großen Teil der Abgaben trug. Missernten und steigende Brotpreise verschärften die Not. Aufklärerische Ideen gaben der Kritik an den alten Regeln eine Sprache.",
      "Als der König 1789 die Generalstände einberief, erklärten sich Abgeordnete des Dritten Standes zur Nationalversammlung. Der Sturm auf die Bastille am 14. Juli wurde zum Symbol des Bruchs. Die Nationalversammlung schaffte ständische Vorrechte ab und erklärte Menschen- und Bürgerrechte.",
      "1791 wurde Frankreich eine konstitutionelle Monarchie, 1792 eine Republik. Krieg und innere Konflikte radikalisierten die Revolution. Während der Schreckensherrschaft 1793/94 wurden zahlreiche Menschen als vermeintliche Gegner verfolgt und hingerichtet. Langfristig blieben Menschenrechte und Verfassung wichtige Maßstäbe.",
    ],
    takeaway: "Eine Revolution hat mehrere Ursachen. Unterscheide Ursachen, auslösende Ereignisse sowie kurz- und langfristige Folgen.",
    check: ["Was erklärt den Umbruch am besten?", "Finanznot, soziale Spannungen und neue politische Ideen wirkten zusammen.", ["Die Brotpreise allein erklären die Gründung der Nationalversammlung.", "Frankreich wurde schon im Juli 1789 eine Republik."], "Die Finanzkrise führte zur Einberufung der Stände. Soziale Konflikte und neue Ansprüche prägten, wie die Beteiligten handelten."],
    workshop: timeline([
      ["Die Generalstände treten zusammen.", "Mai 1789: Die Finanzkrise zwingt den König, die Stände einzuberufen."],
      ["Eine Menge stürmt die Bastille.", "Juli 1789: Der Sturm wird zum Symbol der Revolution."],
      ["Die Nationalversammlung verabschiedet die Menschen- und Bürgerrechte.", "August 1789: Gleiche Rechte werden zum politischen Maßstab."],
      ["Frankreich wird zur Republik.", "1792: Das Königtum wird abgeschafft."],
      ["Robespierre wird gestürzt und hingerichtet.", "Juli 1794: Die Schreckensherrschaft endet."],
    ], "Die politischen Ziele und Formen der Revolution änderten sich mehrfach."),
    guided: ["Erkläre an zwei Ursachen, warum der Streit 1789 eskalierte. Nenne eine Folge.", ["Welche Not zwang den König zum Handeln?", "Warum wollten Abgeordnete die Abstimmung ändern?"], "Die Schulden zwangen den König zur Einberufung der Generalstände. Die ungleiche Stellung der Stände machte die Abstimmungsregeln zum Streitpunkt. Die Gründung der Nationalversammlung veränderte daraufhin den Anspruch, wer Frankreich vertreten durfte.", ["Zwei Ursachen", "Verknüpfung erklärt", "Folge genannt"]],
    transfer: ["Auf einer Gedenktafel steht: «Am 14. Juli begann die Freiheit.» Schreibe einen Museumstext, der erklärt, wofür das Datum steht und was die Tafel auslässt.", ["Was macht ein Datum zum Symbol?", "Welche spätere Entwicklung widerspricht einer geradlinigen Erfolgsgeschichte?"], "Der Bastillesturm steht für die Beteiligung der Pariser Bevölkerung und den Bruch mit königlicher Willkür. Die Nationalversammlung war bereits vorher entstanden. Die Erklärung der Rechte im August und die spätere Schreckensherrschaft zeigen, dass Freiheit erkämpft und zugleich gefährdet war.", ["Symbolwert erklärt", "Früheres Ereignis eingeordnet", "Spätere Entwicklung berücksichtigt"]],
  }),
  lesson(1, {
    id: "verfassung-1791", title: "Wie begrenzte die Verfassung den König?", period: "Frankreich 1791", sourceIds: ["constitution", "rights"],
    intro: "Lies die Pfeile im Verfassungsschaubild und finde heraus, wer entscheidet und wer mitbestimmen darf.",
    paragraphs: [
      "Eine konstitutionelle Monarchie besitzt einen Monarchen, dessen Rechte eine Verfassung festlegt und begrenzt. In Frankreich erließ 1791 eine gewählte gesetzgebende Versammlung Gesetze. Der König und seine Minister übten die vollziehende Gewalt aus. Gewählte Richter übten die Rechtsprechung aus.",
      "Der König konnte viele Gesetze vorübergehend aufhalten. Ein solcher Aufschub war etwas anderes als ein endgültiges Verbot. Am Pfeil von den Wahlmännern zur Versammlung erkennst du eine indirekte Wahl. Als Aktivbürger durften nur Männer wählen, die unter anderem eine bestimmte Steuer entrichteten.",
      "Beispiel: Die Versammlung beschließt ein Gesetz. Der König kann es verzögern, während das Urteil in einem Rechtsstreit bei Richtern liegt. Prüfe beim Lesen eines Schaubilds Beteiligte, Pfeilrichtung, Befugnis und ausgeschlossene Gruppen.",
    ],
    takeaway: "Verfassung, getrennte Gewalten und politische Beteiligung sind verschiedene Merkmale. Eine Verfassung kann Macht begrenzen und zugleich Wahlrechte einschränken.",
    check: ["Was konnte der König gegenüber vielen Gesetzen tun?", "Er konnte sie vorübergehend aufhalten.", ["Er konnte sie endgültig verhindern.", "Er konnte sie allein erlassen."], "Das königliche Veto hatte aufschiebende Wirkung. Die gesetzgebende Versammlung beschloss die Gesetze."],
    workshop: classify("Verfassungspfeile lesen", ["Gesetzgebung", "Vollziehung", "Rechtsprechung", "Wahlrecht"], [
      ["Die Versammlung beschließt ein Gesetz.", 0, "Die Versammlung besitzt die gesetzgebende Gewalt."],
      ["Minister führen gesetzliche Entscheidungen aus.", 1, "König und Minister vollziehen Gesetze."],
      ["Ein Gericht entscheidet einen Streitfall.", 2, "Die Entscheidung fällt im Bereich der Rechtsprechung."],
      ["Aktivbürger bestimmen Wahlmänner.", 3, "Hier geht es um Teilnahme an einer indirekten Wahl."],
    ], "Ein Recht zur politischen Beteiligung sagt noch nichts darüber, wie viele Menschen es nutzen dürfen."),
    guided: ["Erstelle eine kurze Beschreibung des Schaubilds mit drei Gewalten. Ergänze, wer vom Wahlrecht ausgeschlossen blieb.", ["Wer beschließt, wer vollzieht, wer urteilt?", "Wer zählt als Aktivbürger?"], "Die Versammlung beschließt Gesetze, König und Minister vollziehen sie und Richter sprechen Recht. Frauen und ärmere Männer blieben vom politischen Wahlrecht ausgeschlossen.", ["Drei Gewalten benannt", "Organe zugeordnet", "Wahlrechtsgrenze erklärt"]],
    transfer: ["Entwirf in Worten ein Gegenschaubild, in dem der Monarch Gesetze alleine erlässt. Vergleiche die Kontrolle mit 1791.", ["Welcher Pfeil verändert sich?", "Warum zählt die Dauer eines Vetos?"], "Im Gegenschaubild ginge der Gesetzespfeil vom Monarchen aus. 1791 beschloss eine Versammlung die Gesetze. Der König konnte den Beschluss zeitweise verzögern, war dadurch jedoch an eine Verfassung gebunden.", ["Eigenes Schema entworfen", "Befugnisse verglichen", "Grenze königlicher Macht erklärt"]],
  }),
  lesson(1, {
    id: "napoleon", title: "Napoleon und die Neuordnung Europas", period: "1799–1815", sourceIds: ["curriculum", "napoleon", "territory"],
    intro: "Entschlüssele Napoleons Herrschaftsanspruch und untersuche die Veränderungen auf der Karte.",
    paragraphs: [
      "Nach dem Staatsstreich 1799 wurde Napoleon Erster Konsul. 1804 krönte er sich zum Kaiser. Das Kaisertum verband persönlichen Machtanspruch mit Ansprüchen der neuen Zeit. Der Code civil sicherte beispielsweise rechtliche Gleichheit und Eigentum, während die Macht auf Napoleon konzentriert blieb und Frauen rechtlich benachteiligt waren.",
      "Ein Lorbeerkranz erinnert an römische Kaiser. Die Anwesenheit des Papstes erinnert an Karl den Großen, der 800 in Rom zum Kaiser gekrönt wurde. Napoleon setzte sich die Krone selbst auf. So griff er ältere Herrschaftszeichen auf und formte sie für seinen eigenen Anspruch um.",
      "Frankreich beherrschte um 1812 große Teile Europas direkt oder über abhängige Staaten und Bündnisse. 1806 traten Bayern und andere Fürsten dem Rheinbund unter Napoleons Schutz bei. Kaiser Franz II. legte die römisch-deutsche Kaiserkrone nieder. Das Heilige Römische Reich endete.",
    ],
    takeaway: "Unterscheide direkte Herrschaft, abhängige Staaten und Bündnisse. Herrschaftsbilder zeigen, wie ein Kaiser gesehen werden wollte.",
    check: ["Was geschah 1806 in Mitteleuropa?", "Der Rheinbund entstand und das Heilige Römische Reich endete.", ["Frankreich wurde erstmals zur Republik.", "Der Wiener Kongress gründete den Deutschen Bund."], "1806 schlossen sich Fürsten dem Rheinbund an. Daraufhin legte Franz II. die römisch-deutsche Kaiserkrone nieder."],
    workshop: classify("Karte und Kaiserzeichen deuten", ["Herrschaftsinszenierung", "Direkte Herrschaft", "Bündnis unter Einfluss"], [
      ["Napoleons Bildnis zeigt ihn mit Lorbeerkranz.", 0, "Das Bild spielt auf römische Herrschaft an."],
      ["Paris liegt im französischen Kernland.", 1, "Frankreich beherrscht das eigene Staatsgebiet unmittelbar."],
      ["Das Königreich Bayern gehört zum Rheinbund.", 2, "Bayern steht als eigener Staat unter Napoleons Einfluss."],
      ["Der Papst ist bei Napoleons Krönung anwesend.", 0, "Die Anwesenheit lässt sich mit älteren Kaiserkrönungen vergleichen."],
    ], "Ein Bündnis unter französischem Einfluss war etwas anderes als die Eingliederung in Frankreich."),
    guided: ["Vergleiche das französische Kernland und Bayern auf der Übersicht. Verwende die Legende.", ["Welche Farbe steht für direkte Herrschaft?", "Welches Bündnis verbindet Bayern mit Napoleon?"], "Frankreich beherrschte sein Kernland direkt. Bayern war ein eigener Staat im Rheinbund und dadurch an Napoleon gebunden. Die Legende trennt die beiden Arten von Macht.", ["Legende verwendet", "Bayern verortet", "Herrschaftsformen unterschieden"]],
    transfer: ["Vergleiche Napoleons Krönung mit der Kaiserkrönung Karls des Großen. Begründe an einem Unterschied, welche Botschaft Napoleon setzte.", ["Welche Rolle hatte der Papst bei beiden?", "Wer setzte Napoleon die Krone auf?"], "Karl wurde im Jahr 800 vom Papst gekrönt. Bei Napoleon war der Papst anwesend, doch Napoleon setzte sich die Krone selbst auf. Er knüpfte an das Kaisertum an und demonstrierte zugleich eigenen Anspruch auf Autorität.", ["Beide Krönungen eingeordnet", "Konkreter Unterschied", "Botschaft begründet"]],
  }),
  lesson(1, {
    id: "montgelas", title: "Montgelas verändert Bayern", period: "1799–1817", sourceIds: ["montgelas", "territory"],
    intro: "Untersuche, wie aus unterschiedlich verwalteten Gebieten ein modernerer Staat wurde.",
    paragraphs: [
      "Unter Maximilian Joseph und seinem Minister Maximilian von Montgelas wurde Bayern 1806 zum Königreich. Der neue Staat umfasste Gebiete mit verschiedenen Regeln, Konfessionen und Abgaben. Die Regierung baute einheitliche Behörden auf und besetzte Ämter stärker nach Qualifikation.",
      "Säkularisation bezeichnet hier die Aufhebung vieler Klöster und die Übertragung kirchlichen Besitzes an weltliche Träger. Dadurch gewann der Staat Vermögen und Handlungsspielraum. Zugleich verloren Klöster ihre bisherige Rolle, etwa in Bildung und Fürsorge.",
      "Die Reformen stärkten auch die Gleichstellung der drei anerkannten christlichen Konfessionen. In einer neu hinzugekommenen evangelischen Stadt konnte das die Eingliederung erleichtern. Für jüdische Menschen bestanden weiterhin Sonderbeschränkungen. Die Konstitution von 1808 legte eine neue Ordnung fest, eine wirksame Volksvertretung kam unter ihr jedoch nicht zustande.",
    ],
    takeaway: "Montgelas vereinheitlichte den Staat. Beurteile eine Reform nach ihren Folgen für verschiedene betroffene Gruppen.",
    check: ["Wozu trugen einheitliche Behörden bei?", "Gebiete mit unterschiedlichen Regeln konnten leichter gemeinsam verwaltet werden.", ["Die Klöster erhielten mehr politische Macht.", "Bayern führte das allgemeine Wahlrecht ein."], "Einheitliche Verwaltung stärkte den Staat. Politische Beteiligung blieb eng begrenzt."],
    workshop: classify("Reformen und ihre Folgen", ["Verwaltung", "Säkularisation", "Konfessionen"], [
      ["Beamte werden stärker nach Ausbildung und Leistung berufen.", 0, "Berufliche Qualifikation wird wichtiger."],
      ["Der Staat zieht Besitz aufgehobener Klöster ein.", 1, "Kirchliches Eigentum gelangt in weltliche Hand."],
      ["Katholiken, Lutheraner und Reformierte werden rechtlich gleichgestellt.", 2, "Die Reform betrifft drei christliche Konfessionen."],
    ], "Die Vorstellungen von Gleichheit und die Möglichkeiten politischer Mitsprache entwickelten sich unterschiedlich."),
    guided: ["Beurteile die Säkularisation aus Sicht des Staates und einer Gemeinde mit Klosterschule.", ["Was gewinnt der Staat?", "Was verliert der Ort möglicherweise?"], "Der Staat gewinnt Besitz und Einnahmen. Für die Gemeinde kann die Schließung das Ende eines Schulangebots bedeuten. Das Urteil fällt deshalb verschieden aus, je nachdem, ob Staatseinnahmen oder örtliche Versorgung den Maßstab bilden.", ["Staatliche Sicht", "Örtliche Sicht", "Maßstab erklärt"]],
    transfer: ["Ein Minister sagt, einheitliche Regeln machten Bayern bereits demokratisch. Prüfe seine Behauptung an einer Reform und an einer Grenze.", ["Was erleichtert eine gemeinsame Verwaltung?", "Woran erkennst du politische Mitbestimmung?"], "Einheitliche Behörden erleichterten die Verwaltung der neuen Gebiete. Die Konstitution von 1808 führte aber zu keiner wirksamen Volksvertretung. Verwaltungsmodernisierung allein genügt deshalb nicht als Beleg für Demokratie.", ["Reform erläutert", "Grenze benannt", "Begründetes Urteil"]],
  }),
];
