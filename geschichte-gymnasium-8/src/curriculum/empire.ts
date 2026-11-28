import { classify, lesson } from "./helpers";

export const empire = [
  lesson(5, {
    id: "reichsgruendung", title: "Wer gründete das Kaiserreich?", period: "1866–1871 · Gemälde von 1885", sourceIds: ["unification", "painting", "painting-copy"],
    intro: "Untersuche Anton von Werners Historiengemälde und frage, wessen Beitrag sichtbar wird.",
    paragraphs: [
      "Nach dem Krieg von 1866 entstand unter preußischer Führung der Norddeutsche Bund. Im Deutsch-Französischen Krieg 1870/71 vereinbarte Bismarck den Beitritt süddeutscher Staaten. Bayern sicherte sich Sonderrechte, etwa beim Postwesen. Am 18. Januar 1871 wurde Wilhelm I. im Schloss Versailles zum Deutschen Kaiser ausgerufen.",
      "Anton von Werners Friedrichsruher Gemälde entstand 1885, vierzehn Jahre nach dem Ereignis, als Geschenk zu Bismarcks Geburtstag. Bismarck fällt in weißer Uniform auf. Fürsten und Militär umgeben Wilhelm. Das Bild ordnet Personen so an, dass bestimmte Beiträge hervortreten.",
      "Die Proklamation war ein sichtbares Symbol. Die Staatsgründung beruhte auch auf Verträgen, Krieg und den Entscheidungen der Länder. Die Bildmitte zeigt, welchen Eindruck das spätere Gemälde erzeugt. Wer bei den politischen Verhandlungen welche Forderung durchsetzte, erfährst du aus Verträgen und anderen Dokumenten.",
    ],
    takeaway: "Ein Historiengemälde gestaltet ein Ereignis aus einer späteren Perspektive. Unterscheide Ereigniszeit, Entstehungszeit, Auftrag und Bildwirkung.",
    check: ["Welche Angabe ist für die Deutung der weißen Uniform besonders wichtig?", "Die Fassung entstand 1885 als Geschenk für Bismarck.", ["Die Farben des Gemäldes beweisen, dass Bayern kein Mitglied wurde.", "Die Szene fand in Berlin statt."], "Der spätere Auftrag hilft zu erklären, warum der Maler Bismarck hervorhebt."],
    workshop: classify("Bildbeobachtung und Deutung trennen", ["Im Bild sichtbar", "Mit Kontext deutbar", "Anderer Beleg nötig"], [
      ["Unter den vielen dunklen Uniformen fällt eine weiße Uniform auf.", 0, "Die Farbe kannst du direkt beobachten."],
      ["Als Geburtstagsgeschenk rückt das Bild Bismarck in den Vordergrund.", 1, "Der Anlass erklärt eine mögliche Wirkung der Gestaltung."],
      ["Bayern behielt bestimmte Rechte beim Postwesen.", 2, "Ein Vertrag belegt diese Regelung. Die Szene zeigt sie nicht."],
      ["Viele dargestellte Personen tragen Uniform.", 0, "Kleidung lässt sich am Bild beschreiben."],
    ], "Ein Bild kann Erinnerung und politische Botschaft zeigen. Für die Aushandlung der Reichsgründung brauchst du andere Belege."),
    guided: ["Beschreibe zwei Bilddetails und erkläre, wie eines die Bedeutung Bismarcks betont.", ["Wer ist farblich hervorgehoben?", "Wer steht um den Kaiser herum?"], "Viele Personen tragen dunkle Uniformen. Bismarck hebt sich vor ihnen mit einer weißen Uniform ab. Die Aufmerksamkeit wird auf ihn gelenkt, was zum Anlass des Geburtstagsgeschenks passt.", ["Zwei Beobachtungen", "Deutung an ein Detail gebunden", "Entstehungskontext berücksichtigt"]],
    transfer: ["Schreibe eine Bildunterschrift aus Sicht eines Museums in Bayern. Ergänze, was das Bild über Bayerns Beitritt offenlässt.", ["Welches Ereignis zeigt das Bild?", "Wie lassen sich Bayerns Sonderrechte belegen?"], "Das Gemälde von 1885 erinnert an die Ausrufung Wilhelms I. 1871 in Versailles und betont Bismarcks Rolle. Über die Bedingungen des bayerischen Beitritts sagt die Szene wenig. Diese lassen sich an den Beitrittsverträgen prüfen.", ["Ereignis und Entstehungsdatum getrennt", "Bildwirkung erklärt", "Geeigneter weiterer Beleg"]],
  }),
  lesson(5, {
    id: "reichsverfassung", title: "Wer hatte Macht im Kaiserreich?", period: "Reichsverfassung von 1871", sourceIds: ["kaiserreich", "reichstag", "curriculum"],
    intro: "Verfolge im Schaubild den Weg einer Wahl, einer Ernennung und eines Gesetzes.",
    paragraphs: [
      "Das Deutsche Kaiserreich war ein Bundesstaat und eine konstitutionelle Monarchie. Der preußische König war Deutscher Kaiser und ernannte den Reichskanzler. Der Kanzler war für sein Amt nicht auf das Vertrauen des Reichstags angewiesen.",
      "Der Bundesrat vertrat die Regierungen der Bundesstaaten. Der Reichstag wurde von Männern ab 25 Jahren gewählt. Frauen hatten kein Reichstagswahlrecht. Für Reichsgesetze war die Zustimmung von Reichstag und Bundesrat erforderlich.",
      "Beispiel: Lehnt die Mehrheit im Reichstag ein Gesetz ab, fehlt die nötige Zustimmung. Die gleiche Mehrheit kann deshalb aber den Kanzler nicht einfach abwählen. Die Verfassung verband Beteiligung mit starken Rechten von Kaiser und Bundesstaaten.",
    ],
    takeaway: "Kontrolliere jeden Pfeil einzeln. Wahl, Zustimmung zu Gesetzen und Ernennung verschaffen verschiedene Arten politischer Macht.",
    check: ["Was durfte der Reichstag?", "Er konnte einem Reichsgesetz die Zustimmung verweigern.", ["Er ernannte den Reichskanzler.", "Er vertrat als Gesandtenversammlung die Länderregierungen."], "Der Kaiser ernannte den Kanzler. Die Länderregierungen waren im Bundesrat vertreten."],
    workshop: classify("Befugnisse im Schaubild zuordnen", ["Kaiser", "Bundesrat", "Reichstag", "Wahlberechtigte Männer"], [
      ["Ernennt den Reichskanzler.", 0, "Das Amt hängt von der Ernennung durch den Kaiser ab."],
      ["Vertreten durch Gesandte die Regierungen der Bundesstaaten.", 1, "Der Bundesrat war das föderale Organ."],
      ["Gewählte Volksvertretung, deren Zustimmung Reichsgesetze brauchten.", 2, "Der Reichstag konnte über Gesetze mitentscheiden."],
      ["Bestimmen durch Wahl, wer in den Reichstag einzieht.", 3, "Das Wahlrecht beteiligte Männer ab 25 Jahren."],
    ], "Beteiligung im Reichstag bedeutete keine parlamentarische Kontrolle über die Ernennung des Kanzlers."),
    guided: ["Nenne anhand des Schaubilds ein Beteiligungselement und ein Element von Obrigkeitsmacht.", ["Wer wählt wen?", "Wer ernennt den Kanzler?"], "Wahlberechtigte Männer konnten den Reichstag wählen. Der Kaiser ernannte den Reichskanzler unabhängig von einer Mehrheit im Reichstag. Die Verfassung gab Bürgern Mitwirkung und der monarchischen Spitze starke Rechte.", ["Beteiligung am Schaubild belegt", "Obrigkeitsmacht belegt", "Spannung erklärt"]],
    transfer: ["Eine Zeitung urteilt: «Der Reichstag war machtlos.» Prüfe die Aussage an einem Gesetz und an der Stellung des Kanzlers.", ["Was passiert bei einem Nein zum Gesetz?", "Was ändert ein Nein am Amt des Kanzlers?"], "Machtlos war der Reichstag bei Gesetzen nicht, weil seine Zustimmung erforderlich war. Er konnte den Kanzler aber nicht durch den Entzug des Vertrauens aus dem Amt entfernen. Das Urteil muss daher zwischen Gesetzgebung und Regierungsbildung unterscheiden.", ["Gesetzgebung berücksichtigt", "Stellung des Kanzlers erklärt", "Abgewogenes Urteil"]],
  }),
  lesson(5, {
    id: "bismarck-sozialpolitik", title: "Bismarcks Sozialpolitik zwischen Schutz und Kontrolle", period: "1878–1890", sourceIds: ["kaiserreich", "social-laws", "curriculum"],
    intro: "Erkläre, wie sich Sozialversicherungen und der Druck auf die Arbeiterbewegung miteinander verbanden.",
    paragraphs: [
      "Bismarcks Regierung ging ab 1878 mit dem Sozialistengesetz gegen sozialdemokratische Vereine, Versammlungen und Schriften vor. Sozialdemokraten konnten weiterhin als Personen für den Reichstag kandidieren. Staatliche Repression und politische Beteiligung bestanden nebeneinander.",
      "Das Reich führte die Krankenversicherung 1883, die Unfallversicherung 1884 und die Invaliditäts- und Altersversicherung 1889 ein. Der Staat legte den Rahmen gesetzlich fest. Versicherte erhielten einen Anspruch nach festen Regeln. Der Schutz erfasste zunächst nur bestimmte Gruppen.",
      "Beispiel: Ein versicherter Arbeiter konnte bei Krankheit Unterstützung erhalten. Zugleich konnte ein sozialdemokratischer Verein verboten werden. Bismarck wollte soziale Not mindern und Arbeiter an den Staat binden. Ob diese Strategie politische Bindung erreichte, ist eine eigene Frage.",
    ],
    takeaway: "Bewerte Sozialgesetzgebung nach Schutzwirkung und Reichweite. Unterscheide beides von der Absicht, politische Opposition einzudämmen.",
    check: ["Was veränderte die gesetzliche Krankenversicherung für versicherte Arbeiter?", "Ein Anspruch galt nach gesetzlichen Regeln.", ["Unterstützung hing allein von freiwilligen Spenden ab.", "Alle Beschäftigten durften nun jede politische Organisation gründen."], "Versicherungsschutz und politische Rechte wurden durch verschiedene Gesetze geregelt."],
    workshop: classify("Schutz und Repression auseinanderhalten", ["Versicherungsleistung", "Politische Einschränkung", "Politische Absicht"], [
      ["Ein versicherter Arbeiter erhält bei Krankheit Unterstützung.", 0, "Die Krankenversicherung deckt ein Lebensrisiko ab."],
      ["Eine sozialdemokratische Zeitung wird verboten.", 1, "Das Sozialistengesetz schränkt politische Organisation und Öffentlichkeit ein."],
      ["Die Regierung möchte Arbeiter enger an den Staat binden.", 2, "Das ist ein Ziel, dessen Wirkung gesondert geprüft werden muss."],
      ["Bei einem versicherten Arbeitsunfall besteht ein Anspruch.", 0, "Die Unfallversicherung schafft eine geregelte Absicherung."],
    ], "Dass eine Leistung hilft, belegt noch nicht, dass Menschen deswegen die Regierung unterstützen."),
    guided: ["Erkläre, wie Versicherung und Sozialistengesetz zur selben Strategie gehören konnten.", ["Welcher Anreiz sollte Arbeiter an den Staat binden?", "Welches Mittel schwächte Organisationen?"], "Die Versicherungen boten Schutz und sollten Arbeiter an den Staat binden. Das Sozialistengesetz erschwerte zugleich die Organisation der Arbeiterbewegung. Bismarcks Regierung kombinierte damit soziale Maßnahmen und politischen Druck.", ["Leistung erläutert", "Politische Einschränkung", "Strategie verknüpft"]],
    transfer: ["Beurteile die Aussage «Bismarcks Politik löste die Soziale Frage» anhand eines Nutzens und zweier Grenzen.", ["Wer konnte bei Krankheit Hilfe beanspruchen?", "Welche Probleme bleiben beim Wohnen oder bei politischer Mitsprache?"], "Die Versicherung schuf für bestimmte Arbeiter Schutz bei Krankheit. Sie erfasste nicht alle und löste die Wohnungsnot nicht. Politische Einschränkungen bestanden ebenfalls weiter. Sie war somit ein wichtiger Anfang staatlicher Sozialpolitik mit klaren Grenzen.", ["Konkreter Nutzen", "Zwei Grenzen", "Abgewogenes Urteil"]],
  }),
  lesson(5, {
    id: "massengesellschaft", title: "Moderner Alltag und alte Macht", period: "Kaiserreich bis 1914", sourceIds: ["kaiserreich", "society", "curriculum"],
    intro: "Untersuche, wie sich Massenmedien, Frauenbewegung und obrigkeitsstaatliches Denken gleichzeitig entwickelten.",
    paragraphs: [
      "Urbanisierung, Verkehr und Drucktechnik erleichterten gemeinsame Freizeitangebote, Vereinsleben und Zeitungslektüre. Zeitungen und andere Angebote erreichten mehr Menschen. Das ist ein Merkmal der modernen Massengesellschaft.",
      "Die Frauenbewegung setzte sich je nach Strömung für Bildung, Erwerbsmöglichkeiten, Rechte und politische Gleichstellung ein. Viele Frauen organisierten sich. Das Reichstagswahlrecht blieb Männern vorbehalten. Auch Parteien und Vereine mobilisierten immer mehr Menschen.",
      "Militarismus bezeichnet hier die starke gesellschaftliche Geltung militärischer Werte. Obrigkeitsdenken betont Unterordnung unter Autoritäten. Übersteigerter Nationalismus konnte andere Gruppen abwerten. Eine auflagenstarke Zeitung und das hohe Ansehen von Uniformen können in derselben Gesellschaft vorkommen.",
    ],
    takeaway: "Modernisierung beschreibt Veränderungen in Wirtschaft und Alltag. Politische Gleichheit und demokratische Mitsprache beurteilst du anhand eigener Maßstäbe.",
    check: ["Welche Beobachtung belegt zugleich Veränderung und eine politische Grenze?", "Frauen organisierten sich öffentlich, hatten aber kein Reichstagswahlrecht.", ["Zeitungen erschienen in steigender Auflage.", "Ein Offizier genoss hohes Ansehen."], "Organisierte Interessen zeigen gesellschaftlichen Wandel. Das fehlende Wahlrecht zeigt eine Grenze der politischen Beteiligung."],
    workshop: classify("Zeichen einer Gesellschaft im Wandel", ["Moderne Massenkultur", "Frauenbewegung", "Militarismus und Obrigkeit"], [
      ["Eine preisgünstige Zeitung findet in vielen Städten Leser.", 0, "Technik und Verbreitung schaffen ein großes Publikum."],
      ["Ein Verein fordert bessere Bildungsmöglichkeiten für Frauen.", 1, "Organisierte Gruppen verlangen neue Zugänge."],
      ["Militärische Rangzeichen verschaffen auch im zivilen Alltag Ansehen.", 2, "Militärische Normen wirken über die Armee hinaus."],
      ["Ein Sportverein gewinnt durch Stadtwachstum viele Mitglieder.", 0, "Vereine prägen gemeinsame Freizeit und Öffentlichkeit."],
    ], "Verschiedene Merkmale können gleichzeitig typisch für eine Epoche sein."),
    guided: ["Beschreibe einen modernen Zug des Kaiserreichs und eine politische Grenze, die daneben fortbestand.", ["Welche Öffentlichkeit entstand?", "Wer durfte nicht wählen?"], "Zeitungen erreichten ein großes Publikum und Frauen organisierten sich für Bildung und Rechte. Trotzdem durften Frauen den Reichstag nicht wählen. Eine modernere Öffentlichkeit brachte also nicht automatisch gleiche politische Rechte.", ["Modernisierung belegt", "Grenze belegt", "Gleichzeitigkeit erklärt"]],
    transfer: ["Ein Museum will das Kaiserreich nur mit neuen Erfindungen zeigen. Schlage zwei weitere Exponate vor, um ein breiteres Bild zu vermitteln.", ["Was belegt politische oder gesellschaftliche Beteiligung?", "Was macht Obrigkeitsdenken oder Ausschluss sichtbar?"], "Ein Aufruf eines Frauenvereins würde zeigen, wie sich Menschen für Bildung oder Rechte organisierten. Eine Wahlordnung würde zeigen, dass Frauen bei Reichstagswahlen ausgeschlossen blieben. Gemeinsam würden die Exponate gesellschaftlichen Wandel und die Grenzen politischer Rechte zeigen.", ["Zwei konkrete Exponate", "Aussage jedes Exponats", "Bild der Epoche erklärt"]],
  }),
];
