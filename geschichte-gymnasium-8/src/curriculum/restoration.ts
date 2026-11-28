import { classify, lesson, timeline } from "./helpers";

export const restoration = [
  lesson(2, {
    id: "wiener-kongress", title: "Wer ordnet Europa nach Napoleon?", period: "1813–1815", sourceIds: ["curriculum", "vienna", "territory"],
    intro: "Vergleiche Kartenbilder und erkläre, warum nach den Befreiungskriegen ein Staatenbund entstand.",
    paragraphs: [
      "In den Befreiungskriegen kämpften mehrere Mächte gegen Napoleon. In deutschen Gebieten verstärkten der Widerstand und die gemeinsame Kriegserfahrung bei manchen Menschen die Idee einer deutschen Nation. Die Ziele der Fürsten und der nationalen Bewegung blieben verschieden.",
      "Beim Wiener Kongress 1814/15 wollten die Großmächte ein Gleichgewicht sichern und die Herrschaft rechtmäßiger Dynastien wiederherstellen oder festigen. Diese Politik heißt Restauration. Zugleich gestalteten sie Grenzen um. Preußen gewann unter anderem Gebiete am Rhein. Bayern blieb Königreich.",
      "Der Deutsche Bund war ein Zusammenschluss souveräner Fürstenstaaten und freier Städte. In Frankfurt tagte der Bundestag mit Gesandten der Mitgliedstaaten. Die Karte zeigt etwa, dass nur Teile Österreichs und Preußens zum Bund gehörten. Gerade dieser Unterschied ist für das Kräfteverhältnis wichtig.",
    ],
    takeaway: "Lies bei einer Geschichtskarte Titel, Zeitpunkt und Legende. Staatsgebiet und Mitgliedsgebiet können sich unterscheiden.",
    check: ["Wer saß im Bundestag des Deutschen Bundes?", "Gesandte der Mitgliedstaaten.", ["Eine von der Bevölkerung gewählte Nationalversammlung.", "Nur Minister aus Österreich und Preußen."], "Die Mitgliedstaaten entsandten Vertreter. Der Bund hatte kein gewähltes deutsches Nationalparlament."],
    workshop: classify("Wiener Ordnung auf der Karte lesen", ["Gebiet des Bundes", "Außerhalb des Bundes", "Politisches Ziel"], [
      ["Das Königreich Bayern gehört 1815 zum Deutschen Bund.", 0, "Ein Mitgliedstaat blieb ein eigener Staat."],
      ["Das Königreich Ungarn gehört zur Habsburgermonarchie.", 1, "Diese Herrschaftszugehörigkeit machte Ungarn nicht zum Teil des Deutschen Bundes."],
      ["Die Großmächte versuchen, ein neues Übergewicht zu verhindern.", 2, "Ein Gleichgewicht sollte größere Kriege verhindern."],
      ["Preußens Rheinprovinzen liegen weit vom Osten des Königreichs entfernt.", 0, "Die westlichen Gebiete Preußens gehörten zum Bund. Ihre Lage zeigt die territoriale Neuordnung."],
    ], "Die Karte gibt Auskunft über Gebiete. Politische Absichten erschließt du aus dem Zusammenhang und zusätzlichen Quellen."),
    guided: ["Beschreibe in drei Sätzen die Lage Bayerns und Ungarns auf der Übersicht für 1815 und ziehe einen Schluss über die Grenzen des Bundes.", ["Welche Zeichen gehören zur Legende?", "Wo ist die Grenze einer Herrschaft weiter als die des Bundes?"], "Bayern liegt südlich der deutschen Mitte und gehört zum Bund. Ungarn liegt östlich von Wien und gehört zur Habsburgermonarchie, aber nicht zum Deutschen Bund. Mitgliedsgrenzen und Grenzen der Herrschaft deckten sich nur teilweise.", ["Zeitpunkt genannt", "Zwei Gebiete räumlich zugeordnet", "Schluss aus der Legende gezogen"]],
    transfer: ["Warum waren nationale Aktivisten nach der Niederlage Napoleons vom Wiener Ergebnis enttäuscht? Antworte aus ihrer Perspektive und nenne eine Absicht der Fürsten.", ["Was erwartete die Nationalbewegung?", "Warum wollten Fürsten ihre Selbstständigkeit sichern?"], "Wir hatten auf einen gemeinsamen deutschen Nationalstaat gehofft. Der Bund ließ die Einzelstaaten aber bestehen und gab ihren Regierungen die Stimme in Frankfurt. Viele Fürsten wollten ihre Herrschaft und ein Gleichgewicht in Europa sichern.", ["Nationale Erwartung", "Konkretes Ergebnis", "Perspektive der Fürsten"]],
  }),
  lesson(2, {
    id: "vormaerz", title: "Kritik trotz Zensur", period: "1819–1848", sourceIds: ["curriculum", "weavers", "landbote"],
    intro: "Vergleiche ein politisches Gedicht mit einem Flugblatt und frage, was Zensur mit öffentlicher Kritik macht.",
    paragraphs: [
      "Die Karlsbader Beschlüsse von 1819 ermöglichten unter anderem die Kontrolle von Zeitungen und kleineren Druckschriften. Regierungen wollten liberale und nationale Bewegungen begrenzen. Liberalismus betonte Freiheitsrechte und eine Verfassung. In der Nationalbewegung wollten viele Menschen die politische Einheit der Deutschen.",
      "Georg Büchner und Friedrich Ludwig Weidig griffen im Hessischen Landboten 1834 ungleiche Abgaben und Herrschaft an. Der Text war ein heimlich verbreitetes Flugblatt. Heinrich Heines Gedicht über die schlesischen Weber reagierte 1844 auf einen Aufstand und klagte Elend sowie politische Verhältnisse an.",
      "Beispiel: Eine Parole kann zum Handeln aufrufen. Ein Gedicht kann Empörung mit wiederholten Zeilen ausdrücken. Beide zeigen, wie Autoren wirken wollten. Ob ihre Texte viele Menschen überzeugten, erfährst du erst aus weiteren Zeugnissen.",
    ],
    takeaway: "Untersuche Urheber, Gattung, Adressaten, sprachliche Mittel und mögliche Wirkung. Prüfe anschließend, welche Schlüsse deine Quelle trägt.",
    check: ["Was lässt sich aus einer scharfen Zeile im Flugblatt unmittelbar erschließen?", "Welche Botschaft der Text vermitteln sollte.", ["Wie alle Leserinnen und Leser reagierten.", "Wie viele Exemplare tatsächlich gelesen wurden."], "Für Reichweite und Reaktionen brauchst du zusätzliche Zeugnisse."],
    workshop: {
      ...classify("Gedicht und Flugblatt vergleichen", ["Gedicht", "Flugblatt", "Zusätzlicher Beleg nötig"], [
        ["«Wir weben, wir weben!» wiederholt eine Tätigkeit und verstärkt den Rhythmus.", 0, "Heine verdichtet die Klage in einem wiederkehrenden Vers."],
        ["«Friede den Hütten! Krieg den Palästen!» stellt Arme und Mächtige zugespitzt gegenüber.", 1, "Die Parole eröffnet den Hessischen Landboten."],
        ["Viele Landbewohner traten nach der Lektüre offen gegen die Regierung auf.", 2, "Eine Aussage zur Wirkung erfordert etwa Berichte oder Briefe."],
        ["Der Text spricht aus der Perspektive einer Gruppe von Webern.", 0, "Die literarische Stimme steht für die Weber. Sie ist eine Gestaltung Heines."],
      ], "Die beiden Texte sind Belege für Formen des Protests. Ihre Reichweite erschließt du aus anderen Quellen."),
      sourceExcerpt: { title: "Der Hessische Landbote · Anfang", author: "Georg Büchner und Friedrich Ludwig Weidig", date: "Juli 1834", audience: "Vor allem die ländliche Bevölkerung im Großherzogtum Hessen", text: "Friede den Hütten! Krieg den Palästen!", sourceId: "landbote", context: "Der Aufruf setzt mit einem scharfen Gegensatz ein. Über die Links findest du die ganze Quelle und das Gedicht." },
    },
    guided: ["Vergleiche Parole und Refrain in zwei bis vier Sätzen. Beschreibe ihre jeweilige Wirkung auf dich.", ["Wer wird in der Parole gegenübergestellt?", "Was betont die Wiederholung im Gedicht?"], "Die Parole stellt die Hütten der Armen den Palästen der Mächtigen gegenüber und fordert zur Stellungnahme auf. Der Refrain wiederholt die Arbeit der Weber und lässt ihre Anklage eindringlich wirken. Beide Texte nutzen eine andere Form, um politische Kritik auszudrücken.", ["Beide Texte berücksichtigt", "Sprachliche Mittel erklärt", "Wirkung begründet"]],
    transfer: ["Beurteile, was ein Verbot regierungskritischer Zeitungen mit öffentlichem Streit macht. Vergleiche mit einer heutigen Zeitung, die der Regierung widerspricht.", ["Wie verändert das Verbot den Zugang zu Gegenargumenten?", "Welches demokratische Recht schützt öffentliche Kritik?"], "Ein Verbot erschwert es, Gegenargumente öffentlich zu verbreiten. Im Vormärz griffen Kritiker deshalb auch zu heimlichen Flugblättern oder literarischer Sprache. In einer Demokratie ermöglicht Meinungs- und Pressefreiheit öffentliche Kritik und damit Kontrolle der Regierenden.", ["Wirkung von Zensur", "Historisches Beispiel", "Gegenwartsbezug begründet"]],
  }),
  lesson(2, {
    id: "hambach", title: "Einigkeit und Freiheit in Hambach", period: "1832", sourceIds: ["curriculum", "hambach"],
    intro: "Entscheide, welche Forderungen sich auf Einheit, auf Freiheit oder auf beides beziehen.",
    paragraphs: [
      "1832 kamen Menschen aus verschiedenen deutschen Staaten und aus dem Ausland zum Hambacher Schloss in der bayerischen Pfalz. Reden, Fahnen und ein Festzug machten politische Forderungen öffentlich sichtbar. Schwarz-Rot-Gold wurde ein Symbol der Bewegung.",
      "Nationale Forderungen bezogen sich auf die Einheit der Deutschen. Liberale Forderungen galten etwa der Pressefreiheit, der Verfassung und der Mitbestimmung. Viele Teilnehmende verbanden beides. Auch Frauen beteiligten sich am Fest, obwohl sie politisch nicht gleichberechtigt waren.",
      "Ein Festzug kann Engagement zeigen, auch wenn danach keine Verfassung erlassen wird. Die Regierungen reagierten auf die Bewegung mit Verschärfungen und Verfolgung. Prüfe beim Urteil über das Fest die Sichtbarkeit seiner Forderungen und ihre unmittelbare Umsetzung getrennt.",
    ],
    takeaway: "Politische Einheit und politische Freiheit gehören für viele Menschen zusammen. Eine gemeinsame Regierung allein garantiert keine Grundrechte.",
    check: ["Welche Forderung ist vor allem liberal?", "Zeitungen sollen ohne politische Vorzensur erscheinen können.", ["Die deutschen Staaten sollen sich zusammenschließen.", "Fürsten sollen ihre überlieferte Stellung bewahren."], "Pressefreiheit schützt öffentliche Kritik. Sie war eine liberale Forderung."],
    workshop: classify("Forderungen einordnen", ["Nationale Einheit", "Liberale Rechte", "Beides"], [
      ["Die deutschen Einzelstaaten sollen sich politisch zusammenschließen.", 0, "Hier geht es um einen Nationalstaat."],
      ["Die Menschen sollen öffentlich ihre Meinung sagen dürfen.", 1, "Meinungsfreiheit ist ein Freiheitsrecht."],
      ["Ein gemeinsamer deutscher Staat soll eine Verfassung mit Grundrechten bekommen.", 2, "Einheit und Rechte werden miteinander verbunden."],
      ["Zeitungen sollen politische Missstände öffentlich benennen dürfen.", 1, "Pressefreiheit erleichtert öffentliche Kontrolle."],
    ], "Ordne die Forderung nach ihrem Inhalt. Viele politische Programme verbanden mehrere Ziele."),
    guided: ["Erkläre, wie das Fest politische Beteiligung ohne ein nationales Parlament ermöglichte.", ["Welche sichtbaren Handlungen gab es?", "Welche Forderung wurde so öffentlich?"], "Die Menschen zogen mit Fahnen zum Schloss und hörten Reden. Sie machten zum Beispiel die Forderung nach Pressefreiheit sichtbar. Das war politische Beteiligung außerhalb eines gewählten Nationalparlaments.", ["Formen des Engagements", "Eine Forderung", "Bedeutung erklärt"]],
    transfer: ["Eine Ausstellung zeigt nur die Fahne von Hambach. Ergänze einen Satz, der der Gefahr einer zu engen Deutung begegnet.", ["Wofür stehen die Farben?", "Welche Forderung drückt das Objekt allein nicht aus?"], "Schwarz-Rot-Gold erinnert an die nationale Bewegung. Das Hambacher Fest stand zugleich für Forderungen nach Pressefreiheit und politischer Mitbestimmung. Die Fahne trägt daher nur einen Teil der Geschichte.", ["Symbol erklärt", "Freiheitsforderung ergänzt", "Grenze des Belegs formuliert"]],
  }),
  lesson(2, {
    id: "paulskirche", title: "1848/49: Was blieb von der Revolution?", period: "1848–1849", sourceIds: ["paulskirche", "curriculum"],
    intro: "Verfolge den Weg vom Protest zur Verfassung und beurteile Erfolg und Scheitern nach getrennten Kriterien.",
    paragraphs: [
      "Missernten, Preissteigerungen und Arbeitslosigkeit verschärften soziale Spannungen. Nach der Revolution in Frankreich erhoben Menschen auch in deutschen Staaten Forderungen nach Pressefreiheit, Verfassungen und nationaler Einheit. Im Mai 1848 trat eine gewählte Nationalversammlung in Frankfurt zusammen.",
      "Die Abgeordneten berieten in der Paulskirche über den künftigen deutschen Staat. Sie verabschiedeten Grundrechte und 1849 eine Reichsverfassung. Diese sah eine kleindeutsche Lösung ohne Österreich vor. Frauen konnten an der Wahl zur Nationalversammlung nicht teilnehmen.",
      "Der preußische König Friedrich Wilhelm IV. lehnte die ihm angebotene Kaiserkrone ab. Die Nationalversammlung konnte ihre Verfassung gegen mächtige Fürsten und deren Truppen nicht durchsetzen. Ihre Grundrechtsdebatten und die Praxis eines gewählten Parlaments wurden für spätere demokratische Entwicklungen bedeutsam.",
    ],
    takeaway: "Die Revolution scheiterte an der Durchsetzung. Ihr Parlament und seine Grundrechte sind dennoch bedeutende demokratische Erfahrungen.",
    check: ["Woran scheiterte die Paulskirchenverfassung praktisch?", "Wichtige Fürsten verweigerten die Anerkennung und das Parlament konnte sie nicht durchsetzen.", ["Das Parlament verabschiedete keine Verfassung.", "Die Bevölkerung durfte keine Abgeordneten wählen."], "Die Verfassung wurde beschlossen, hatte aber keine gesicherte Durchsetzungsmacht."],
    workshop: timeline([
      ["Märzforderungen und Proteste erschüttern die Fürstenherrschaft.", "Im Frühjahr 1848 fordern viele Menschen Rechte und Einheit."],
      ["Die Nationalversammlung tritt in Frankfurt zusammen.", "Im Mai 1848 beginnt die parlamentarische Arbeit."],
      ["Die Nationalversammlung beschließt die Reichsverfassung.", "Im März 1849 liegt ein Verfassungsentwurf für den Nationalstaat vor."],
      ["Der preußische König lehnt die Kaiserkrone ab.", "Die Ablehnung im April 1849 nimmt der Verfassung eine wichtige Stütze."],
    ], "Zwischen einem Beschluss und seiner Durchsetzung liegen unterschiedliche politische Schritte."),
    guided: ["Begründe mit einem Beispiel, warum man 1848/49 als Scheitern und als Errungenschaft bewerten kann.", ["Welche Ordnung trat nicht in Kraft?", "Welche neue Erfahrung machten Abgeordnete?"], "Die Reichsverfassung wurde nicht durchgesetzt, unter anderem weil der preußische König die Krone ablehnte. Die gewählte Nationalversammlung beriet aber öffentlich über Grundrechte. Das war in der Geschichte des deutschen Parlamentarismus eine wichtige Errungenschaft.", ["Scheitern belegt", "Errungenschaft belegt", "Bewertungsmaßstäbe unterschieden"]],
    transfer: ["Beurteile den Satz «Politische Beteiligung verändert nur dann etwas, wenn sie sofort gewinnt» am Beispiel der Paulskirche und einem zweiten Fall aus dem Lernbereich.", ["Was blieb nach 1849 als Erfahrung?", "Was bewirkten die öffentlichen Forderungen in Hambach?"], "Die Paulskirche setzte ihre Verfassung nicht durch, lieferte aber Erfahrungen und Ideen für spätere Parlamente. Hambach machte Forderungen und Symbole öffentlich sichtbar, obwohl die Regierungen kurzfristig härter reagierten. Beteiligung kann deshalb auch über längere Zeit wirken.", ["Paulskirche ausgewertet", "Zweiter Fall", "Zeithorizonte begründet"]],
  }),
];
