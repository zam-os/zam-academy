import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const postwar: Lesson[] = [
  {
    id: "g10-potsdam",
    lb: 2,
    title: "Potsdam 1945: Die Siegermächte entscheiden",
    period: "Juli/August 1945",
    intro:
      "Nach der bedingungslosen Kapitulation lag die Regierungsgewalt bei den Siegermächten. In Potsdam legten sie die Grundzüge ihrer Deutschlandpolitik fest.",
    paragraphs: [
      "Vom 17. Juli bis 2. August 1945 trafen sich Truman (USA), Stalin (Sowjetunion) und Churchill, nach der britischen Wahl Attlee, in Potsdam. Deutschland wurde in vier Besatzungszonen geteilt, auch Frankreich erhielt eine Zone; Berlin wurde in vier Sektoren geteilt. Der Alliierte Kontrollrat sollte Fragen regeln, die Deutschland als Ganzes betrafen. Frankreich war in Potsdam nicht dabei und trug die Beschlüsse nur teilweise mit.",
      "Als Ziele vereinbarten die Mächte Entnazifizierung, Entmilitarisierung, Demokratisierung und Dezentralisierung, dazu Reparationen, vor allem durch Demontage von Fabriken in der eigenen Zone. Die Gebiete östlich von Oder und Neiße kamen unter polnische beziehungsweise sowjetische Verwaltung; die endgültige Grenze sollte ein Friedensvertrag regeln. Die Mächte stimmten der Aussiedlung der Deutschen aus Polen, der Tschechoslowakei und Ungarn zu, die „in ordnungsgemäßer und humaner Weise“ erfolgen sollte; die Wirklichkeit sah oft anders aus.",
      "Entnazifizierung hieß: NS-Organisationen auflösen, Belastete aus Ämtern entfernen und bestrafen. In der US-Zone mussten Erwachsene einen Fragebogen ausfüllen; ab 1946 stuften Spruchkammern sie als Hauptschuldige, Belastete, Minderbelastete, Mitläufer oder Entlastete ein. Die meisten galten am Ende als Mitläufer. In der sowjetischen Zone wurden Belastete rigoroser entlassen, die Entnazifizierung diente aber auch dazu, politische Gegner auszuschalten. Im Nürnberger Prozess 1945/46 verurteilte ein internationales Militärgericht führende Nationalsozialisten, zwölf davon zum Tod.",
    ],
    takeaway:
      "In Potsdam beschlossen die Siegermächte Besatzung und die Ziele Entnazifizierung, Entmilitarisierung, Demokratisierung und Dezentralisierung; ihre Uneinigkeit bereitete die Teilung vor.",
    sourceIds: ["lemo-potsdam", "lemo-entnazifizierung", "lemo-nuernberg"],
    quiz: check(
      "Welche Ziele vereinbarten die Siegermächte 1945 in Potsdam für Deutschland?",
      "Entnazifizierung, Entmilitarisierung, Demokratisierung und Dezentralisierung.",
      [
        "Sofortige Wiedervereinigung, Abzug aller Truppen und volle Souveränität.",
        "Aufbau einer Planwirtschaft und Verstaatlichung der Industrie in allen Zonen.",
      ],
      [
        "Deutschland wurde besetzt; ein Abzug war nicht vorgesehen.",
        "Über die Wirtschaftsordnung entschied jede Besatzungsmacht in ihrer Zone selbst.",
      ],
      "Diese Ziele werden oft als die „vier D“ zusammengefasst. Wie Demokratie aussehen sollte, verstanden Ost und West bald sehr verschieden.",
    ),
    workshop: classify(
      "Beschlüsse von Potsdam zuordnen",
      ["Entnazifizierung", "Entmilitarisierung", "Demokratisierung", "Dezentralisierung"],
      [
        [
          "Die NSDAP und ihre Gliederungen werden aufgelöst, Belastete verlieren ihre Ämter.",
          0,
          "Das richtet sich gegen Personen und Organisationen des NS-Staats.",
        ],
        [
          "Wehrmacht und Rüstungsindustrie werden aufgelöst.",
          1,
          "Deutschland soll keinen Krieg mehr führen können.",
        ],
        [
          "Politische Parteien und Gewerkschaften dürfen sich mit Genehmigung neu gründen.",
          2,
          "Demokratisches Leben soll von unten neu entstehen.",
        ],
        [
          "Große Konzerne und Kartelle sollen entflochten werden.",
          3,
          "Wirtschaftliche Machtballung soll aufgelöst werden.",
        ],
        [
          "Neue Länder wie Bayern übernehmen Verwaltungsaufgaben statt einer Berliner Zentrale.",
          3,
          "Macht wird auf Länder und Gemeinden verteilt.",
        ],
      ],
      "Die Ziele waren gemeinsam beschlossen, ihre Umsetzung unterschied sich je nach Besatzungsmacht.",
    ),
    tasks: {
      1: writing(
        "Erkläre, wie die Entnazifizierung in der amerikanischen Zone ablief und warum viele sie als unvollständig kritisierten.",
        ["Fragebogen und Spruchkammern.", "Welche Einstufung war am häufigsten?"],
        "In der US-Zone füllten Erwachsene einen Fragebogen über ihre Vergangenheit aus. Spruchkammern stuften sie in fünf Gruppen von Hauptschuldigen bis Entlasteten ein. Die meisten wurden als Mitläufer eingestuft und kamen mit geringen Strafen davon; viele Belastete kehrten später in Ämter zurück. Deshalb gilt die Entnazifizierung als unvollständig.",
        ["Ablauf erklärt", "Einstufung genannt", "Kritik begründet"],
      ),
      2: writing(
        "Beurteile die Aussage: Schon in Potsdam war die deutsche Teilung angelegt.",
        ["Was war gemeinsam beschlossen, was nicht?", "Zonen und Kontrollrat bedenken."],
        "Potsdam sah Deutschland noch als wirtschaftliche Einheit unter dem Kontrollrat vor, eine Teilung war nicht beschlossen. Weil aber jede Macht in ihrer Zone eigene Reparationen nahm und Begriffe wie Demokratie verschieden verstand, wuchsen die Zonen auseinander. Angelegt war die Teilung also in der Uneinigkeit, nicht als Ziel der Konferenz.",
        ["Gemeinsames genannt", "Konfliktlinien erkannt", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g10-nachkriegsalltag",
    lb: 2,
    title: "Überleben in Trümmern",
    period: "1945–1948",
    intro:
      "Nach dem Krieg ging es für viele Menschen zuerst ums Überleben: Wohnung, Essen, Wärme und Nachricht von Angehörigen.",
    paragraphs: [
      "Viele Städte waren durch den Luftkrieg schwer zerstört, in Bayern etwa München, Nürnberg und Würzburg. Millionen Menschen waren obdachlos, Familien getrennt, Männer in Kriegsgefangenschaft. Frauen räumten Trümmer und hielten den Alltag aufrecht. Suchdienste halfen, Vermisste zu finden. Dazu kamen Millionen Flüchtlinge und Vertriebene sowie befreite Zwangsarbeiter und KZ-Überlebende, die als Displaced Persons in Lagern lebten.",
      "Lebensmittel gab es nur auf Karten, und die Rationen reichten oft nicht. Im Hungerwinter 1946/47 litten viele unter Kälte und Mangel. Auf dem Schwarzmarkt tauschten Menschen Wertsachen gegen Essen, Zigaretten dienten als Ersatzwährung; auf „Hamsterfahrten“ fuhren Städter aufs Land. Hilfspakete aus den USA, die CARE-Pakete, linderten Not.",
      "Wiederaufbau begann in Ost und West unter verschiedenen Bedingungen. Die Sowjetunion demontierte in ihrer Zone in großem Umfang Industrieanlagen als Reparationen. In den Westzonen half ab 1948 der Marshallplan, und die Währungsreform vom 20. Juni 1948 füllte über Nacht die Schaufenster. Wer den Alltag in deinem Ort untersuchen will, findet Fotos, Zeitungen und Berichte in Stadtarchiven und Heimatmuseen.",
    ],
    takeaway:
      "Zerstörung, Hunger, Wohnungsnot und getrennte Familien prägten die Jahre nach 1945; die Besatzungsmächte bestimmten die Bedingungen des Wiederaufbaus.",
    sourceIds: ["lemo-truemmer", "lemo-ueberleben", "lemo-dp", "lemo-marshall"],
    quiz: check(
      "Was füllte im Juni 1948 in den Westzonen die Schaufenster fast über Nacht?",
      "Die Währungsreform mit der Einführung der D-Mark.",
      ["Die Gründung der Bundesrepublik Deutschland.", "Das Ende der Berlin-Blockade durch die Luftbrücke."],
      [
        "Die Bundesrepublik wurde erst im Mai 1949 gegründet.",
        "Die Blockade begann erst nach der Währungsreform und endete im Mai 1949.",
      ],
      "Mit der neuen Währung lohnte es sich wieder, Waren zu verkaufen statt zu horten. Die Sowjetunion antwortete mit der Berlin-Blockade.",
    ),
    workshop: classify(
      "Not und Neuanfang",
      ["Not des Alltags", "Hilfe und Neuanfang"],
      [
        ["Rationen auf Lebensmittelkarten reichen nicht zum Sattwerden.", 0, "Mangel prägte den Alltag bis 1948."],
        ["Zigaretten werden auf dem Schwarzmarkt zur Ersatzwährung.", 0, "Die Reichsmark hatte ihr Vertrauen verloren."],
        ["CARE-Pakete aus den USA erreichen Familien.", 1, "Private Hilfe aus dem Ausland linderte Hunger."],
        ["Mit der D-Mark kommen gehortete Waren in die Geschäfte.", 1, "Die Währungsreform belebte den Handel."],
        ["Suchdienste vermitteln Nachrichten über vermisste Angehörige.", 1, "Familien fanden so wieder zusammen."],
      ],
      "Not und Neuanfang lagen zeitlich nah beieinander; wer welche Hilfe bekam, hing von Zone, Ort und Lage ab.",
    ),
    tasks: {
      1: writing(
        "Beschreibe drei Probleme, die Menschen in Deutschland nach Kriegsende im Alltag lösen mussten.",
        ["Wohnung, Ernährung, Familie.", "Ein Beispiel aus Bayern einbeziehen."],
        "Viele hatten keine Wohnung, weil Städte wie Würzburg oder München schwer zerstört waren. Lebensmittel waren rationiert, sodass Menschen auf dem Schwarzmarkt tauschten oder aufs Land fuhren. Familien waren getrennt, weil Männer in Gefangenschaft waren oder Angehörige auf der Flucht vermisst wurden; Suchdienste halfen bei der Suche.",
        ["Drei Probleme", "Konkrete Beispiele", "Regionaler Bezug"],
      ),
      2: writing(
        "Erkläre, warum der Wiederaufbau in Ost und West unterschiedlich schnell verlief.",
        ["Reparationen und Demontagen.", "Marshallplan und Währungsreform."],
        "Die Sowjetunion holte sich in ihrer Zone hohe Reparationen und baute viele Fabriken ab, was den Wiederaufbau bremste. In den Westzonen gab es ab 1948 Hilfe aus dem Marshallplan, und die Währungsreform setzte Anreize zur Produktion. Die politischen Entscheidungen der Besatzungsmächte prägten damit die Lebensbedingungen der Menschen.",
        ["Ostseite erklärt", "Westseite erklärt", "Zusammenhang mit der Besatzungspolitik"],
      ),
    },
  },
  {
    id: "g10-flucht-vertreibung",
    lb: 2,
    title: "Flucht, Vertreibung und Neuanfang in Bayern",
    period: "1944–1960er-Jahre",
    intro:
      "Etwa zwölf Millionen Deutsche verloren ihre Heimat. Rund zwei Millionen fanden in Bayern eine neue.",
    paragraphs: [
      "Ab Winter 1944/45 flohen Hunderttausende aus den deutschen Ostgebieten vor der Roten Armee. Nach Kriegsende wurden Deutsche aus Polen, der Tschechoslowakei, Ungarn und weiteren Staaten vertrieben, erst in „wilden“ Vertreibungen, dann in organisierten Transporten. Die Vertreibung folgte auf die Verbrechen des NS-Staats in diesen Ländern, sie traf aber auch Kinder und Menschen ohne jede Schuld. Wie viele dabei starben, ist unsicher; Schätzungen reichen von 400.000 bis zwei Millionen.",
      "1949 lebten in Bayern rund 1,9 Millionen Vertriebene, etwa jeder fünfte Einwohner; ungefähr die Hälfte stammte aus dem Sudetenland, mehr als ein Viertel aus Schlesien. Sie kamen in Lager, Notquartiere und beschlagnahmte Zimmer. Einheimische und Neuankömmlinge gerieten oft in Streit um Wohnraum und Arbeit, auch konfessionelle Unterschiede trennten Dörfer.",
      "Mit der Zeit gelang die Integration erstaunlich gut. Auf ehemaligen Rüstungsgeländen entstanden neue Orte wie Waldkraiburg, Geretsried, Traunreut und Neugablonz bei Kaufbeuren, wo Gablonzer Glas- und Schmuckhersteller ihr Handwerk fortführten. Vertriebene brachten Fachwissen, gründeten Betriebe und trugen zum wirtschaftlichen Aufschwung bei. Politisch engagierten sie sich in Parteien; 1950 verzichteten ihre Verbände in der Charta der deutschen Heimatvertriebenen auf Rache und Vergeltung. Bayern übernahm 1954 die Schirmherrschaft über die Sudetendeutschen.",
    ],
    takeaway:
      "Flucht und Vertreibung waren ein tiefer Einschnitt für Millionen Menschen. Ihre Integration war schwierig, ihre Leistung prägte den Aufbau Bayerns und der Bundesrepublik.",
    sourceIds: ["lemo-vertreibung", "ghdi-vertriebene", "hdbg-zeitzeugen"],
    quiz: check(
      "Woher stammte etwa die Hälfte der Vertriebenen, die 1949 in Bayern lebten?",
      "Aus dem Sudetenland.",
      ["Aus Ostpreußen.", "Aus der sowjetischen Besatzungszone."],
      [
        "Ostpreußen war Herkunftsgebiet vieler Flüchtlinge, die meisten zogen aber nach Norddeutschland.",
        "Wer aus der SBZ oder DDR kam, war kein Vertriebener, sondern Flüchtling aus einem anderen Teil Deutschlands.",
      ],
      "Die Sudetendeutschen wurden oft als „vierter Stamm“ Bayerns neben Altbayern, Franken und Schwaben bezeichnet.",
    ),
    workshop: classify(
      "Integration in Bayern: Schwierigkeit oder Erfolg?",
      ["Schwierigkeit", "Erfolg"],
      [
        [
          "Familien teilen sich jahrelang einen Raum in einem beschlagnahmten Bauernhaus.",
          0,
          "Wohnungsnot belastete das Zusammenleben.",
        ],
        [
          "In Neugablonz entsteht wieder eine Glas- und Schmuckindustrie.",
          1,
          "Mitgebrachtes Wissen schuf Arbeitsplätze.",
        ],
        [
          "Einheimische beschimpfen die Neuankömmlinge als „Flüchtlingspack“.",
          0,
          "Ablehnung und Vorurteile waren verbreitet.",
        ],
        [
          "Auf einem früheren Rüstungsgelände wächst die Stadt Waldkraiburg.",
          1,
          "Neue Orte boten Wohnraum und Arbeit.",
        ],
        [
          "Evangelische Vertriebene kommen in rein katholische Dörfer.",
          0,
          "Konfessionelle Unterschiede trennten anfangs.",
        ],
      ],
      "Integration war ein Prozess über Jahrzehnte. Sie gelang durch Arbeit, Wohnungsbau und politische Beteiligung, nicht ohne Konflikte.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum Flucht und Vertreibung für die Betroffenen ein tiefer Einschnitt in ihre Biografie waren.",
        ["Was verloren sie?", "Wie war der Anfang in der neuen Umgebung?"],
        "Die Menschen verloren Heimat, Besitz, oft Angehörige und ihr gewohntes Umfeld. Viele erlebten auf der Flucht Hunger, Gewalt und Tod. In Bayern begannen sie in Lagern oder Notquartieren und waren zunächst nicht willkommen. Ihr Leben musste fast vollständig neu aufgebaut werden.",
        ["Verluste genannt", "Erfahrungen auf der Flucht", "Neuanfang beschrieben"],
      ),
      2: writing(
        "Beurteile die Leistung der Heimatvertriebenen für den Aufbau Bayerns nach 1945.",
        ["Wirtschaft, Orte, Politik.", "Auch Schwierigkeiten nennen."],
        "Die Vertriebenen brachten Arbeitskraft und Fachwissen mit, gründeten Betriebe und ganze Orte wie Neugablonz oder Waldkraiburg. Sie halfen, Bayern vom Agrarland zum Industriestaat zu entwickeln, und beteiligten sich am demokratischen Leben. Ihre Integration war anfangs von Not und Ablehnung begleitet. Gerade deshalb ist ihr Beitrag als große Leistung zu würdigen.",
        ["Wirtschaftlicher Beitrag", "Gesellschaftlicher/politischer Beitrag", "Abgewogene Würdigung"],
      ),
    },
  },
  {
    id: "g10-verfassung-bayern",
    lb: 2,
    title: "1946: Die Verfassung des Freistaats Bayern",
    period: "1946 bis heute",
    intro:
      "Bayern gab sich eine demokratische Verfassung, noch bevor es die Bundesrepublik gab. Sie gilt bis heute.",
    paragraphs: [
      "Die amerikanische Militärregierung ließ 1946 eine Verfassunggebende Landesversammlung wählen. Wichtigster Verfasser war Wilhelm Hoegner (SPD), der im Exil die Diktatur überlebt hatte. Am 1. Dezember 1946 nahm die bayerische Bevölkerung die Verfassung in einem Volksentscheid an. Die Präambel nennt als Ausgangspunkt das „Trümmerfeld“, zu dem eine Ordnung „ohne Gott, ohne Gewissen und ohne Achtung vor der Würde des Menschen“ geführt habe.",
      "An der Verfassung lässt sich der Aufbau einer modernen Demokratie ablesen. Bayern ist ein Freistaat und ein Volksstaat: Träger der Staatsgewalt ist das Volk, das durch Wahlen und Abstimmungen entscheidet (Art. 2). Der Landtag beschließt Gesetze und wählt den Ministerpräsidenten, der Verfassungsgerichtshof kontrolliert. Die Grundrechte, etwa die unantastbare Würde des Menschen (Art. 100), binden alle Staatsgewalt. Bürgerinnen und Bürger können mit Volksbegehren und Volksentscheid selbst Gesetze anstoßen (Art. 74).",
      "Die Verfassung zieht Lehren aus der NS-Zeit: Der Landtag darf sein Recht der Gesetzgebung nicht übertragen (Art. 70) – eine Antwort auf das Ermächtigungsgesetz von 1933. Sie ist zugleich veränderbar: 1998 schafften die Bürger per Volksentscheid den Senat, die zweite Kammer, ab. Demokratie bringt Chancen wie Mitbestimmung und Schutz der Freiheit, aber auch Herausforderungen: Sie braucht Beteiligung, Kompromisse und Menschen, die ihre Regeln verteidigen.",
    ],
    takeaway:
      "Die Bayerische Verfassung vom 1. Dezember 1946 verbindet Volkssouveränität, Gewaltenteilung, Grundrechte und direkte Demokratie und antwortet auf die NS-Diktatur.",
    sourceIds: ["bayverf", "lemo-laender"],
    quiz: check(
      "Wie wurde die Verfassung des Freistaats Bayern 1946 angenommen?",
      "Durch einen Volksentscheid am 1. Dezember 1946.",
      [
        "Durch einen Befehl der amerikanischen Militärregierung ohne Abstimmung.",
        "Durch den Bundestag in Bonn.",
      ],
      [
        "Die Militärregierung genehmigte das Verfahren, entschieden haben die Wählerinnen und Wähler.",
        "Den Bundestag gab es erst ab 1949.",
      ],
      "Die Bayerische Verfassung ist älter als das Grundgesetz und gilt bis heute.",
    ),
    workshop: {
      ...classify(
        "Bausteine einer demokratischen Grundordnung",
        ["Volkssouveränität", "Grundrechte", "Schutz vor Machtmissbrauch"],
        [
          [
            "Träger der Staatsgewalt ist das Volk. (Art. 2)",
            0,
            "Alle Staatsgewalt geht vom Volk aus.",
          ],
          [
            "Unterstützt ein Zehntel der Stimmberechtigten ein Volksbegehren, muss ein Volksentscheid stattfinden. (Art. 74)",
            0,
            "Das Volk kann so selbst über ein Gesetz abstimmen.",
          ],
          [
            "Die Würde des Menschen ist unantastbar. (Art. 100)",
            1,
            "Ein Grundrecht, das alle staatliche Gewalt bindet.",
          ],
          [
            "Das Recht der Gesetzgebung kann vom Landtag nicht übertragen werden. (Art. 70)",
            2,
            "So soll sich ein Ermächtigungsgesetz wie 1933 nicht wiederholen.",
          ],
        ],
        "Eine Verfassung verteilt Macht, schützt Rechte und verhindert, dass eine Regierung sich selbst unbegrenzte Macht gibt.",
      ),
      sourceExcerpt: {
        title: "Verfassung des Freistaates Bayern · Präambel",
        author: "Bayerische Verfassunggebende Landesversammlung",
        date: "Volksentscheid am 1. Dezember 1946",
        audience: "Das bayerische Volk und alle Staatsorgane",
        text: "Angesichts des Trümmerfeldes, zu dem eine Staats- und Gesellschaftsordnung ohne Gott, ohne Gewissen und ohne Achtung vor der Würde des Menschen die Überlebenden des zweiten Weltkrieges geführt hat, in dem festen Entschlusse, den kommenden deutschen Geschlechtern die Segnungen des Friedens, der Menschlichkeit und des Rechtes dauernd zu sichern, gibt sich das Bayerische Volk, eingedenk seiner mehr als tausendjährigen Geschichte, nachstehende demokratische Verfassung.",
        sourceId: "bayverf",
        context:
          "Die Präambel deutet die NS-Diktatur als Ursache der Zerstörung und begründet daraus die neue Ordnung. Sie ist ein Bekenntnis der Verfassunggeber, keine Beschreibung der damaligen Stimmung aller Menschen.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre an zwei Artikeln, wie die Bayerische Verfassung auf die Erfahrung der NS-Diktatur antwortet.",
        ["Würde des Menschen, Gesetzgebung.", "Welche Erfahrung steht dahinter?"],
        "Artikel 100 stellt die Würde des Menschen unter Schutz, nachdem der NS-Staat Menschen entrechtet und ermordet hatte. Artikel 70 verbietet dem Landtag, sein Gesetzgebungsrecht zu übertragen; 1933 hatte das Ermächtigungsgesetz der Regierung Hitler die Gesetzgebung überlassen. Beide Regeln sollen eine Wiederholung verhindern.",
        ["Zwei Artikel", "NS-Erfahrung zugeordnet", "Schutzfunktion erklärt"],
      ),
      2: writing(
        "Volksbegehren und Volksentscheid: Erörtere eine Chance und eine Herausforderung der direkten Demokratie in Bayern.",
        ["Mitbestimmung der Bürger.", "Beteiligung, Information, Minderheiten."],
        "Eine Chance ist, dass Bürgerinnen und Bürger selbst Gesetze anstoßen können, wie 1998 bei der Abschaffung des Senats. Das stärkt Beteiligung und Vertrauen. Eine Herausforderung ist, dass komplexe Fragen auf Ja oder Nein verkürzt werden und nur wenige abstimmen können. Direkte Demokratie ergänzt das Parlament daher sinnvoll, ersetzt es aber nicht.",
        ["Chance mit Beispiel", "Herausforderung", "Urteil"],
      ),
    },
  },
  {
    id: "g10-zwei-staaten",
    lb: 2,
    title: "1949: Zwei deutsche Staaten",
    period: "1947–1949",
    intro:
      "Aus vier Zonen wurden zwei Staaten. Sie entstanden mit Zustimmung ihrer Besatzungsmächte und mit gegensätzlichen Ordnungen.",
    paragraphs: [
      "Nach 1945 zerbrach die Zusammenarbeit der Siegermächte. Die USA verkündeten 1947 die Eindämmung des Kommunismus (Truman-Doktrin) und boten mit dem Marshallplan Wiederaufbauhilfe an; die Sowjetunion lehnte für ihren Machtbereich ab. Nach der Währungsreform in den Westzonen sperrte die Sowjetunion ab Juni 1948 die Land- und Wasserwege nach West-Berlin. Die Westmächte versorgten die Stadt fast elf Monate lang über eine Luftbrücke, bis die Blockade im Mai 1949 endete.",
      "In den Westzonen arbeitete der Parlamentarische Rat in Bonn ab September 1948 das Grundgesetz aus. Es wurde am 23. Mai 1949 verkündet; die Bundesrepublik Deutschland war gegründet, erster Bundeskanzler wurde Konrad Adenauer. Das Grundgesetz zog Lehren aus Weimar: Die Grundrechte binden unmittelbar, der Kanzler kann nur durch Wahl eines Nachfolgers gestürzt werden (konstruktives Misstrauensvotum), Kernprinzipien wie Demokratie und Menschenwürde sind unabänderlich. Am 7. Oktober 1949 folgte in der sowjetischen Zone die Deutsche Demokratische Republik.",
      "Die Bundesrepublik war eine parlamentarische Demokratie und ein Bundesstaat mit freien Wahlen, Gewaltenteilung und unabhängigen Gerichten. Die DDR hatte eine Verfassung mit demokratischen Begriffen, die Macht lag aber bei der SED. Gewählt wurde über Einheitslisten ohne echte Auswahl, Gerichte und Medien folgten der Partei. Beide Staaten verstanden sich als das bessere Deutschland und als Vorposten ihres Blocks: Der Ost-West-Konflikt war zur deutschen Teilung geworden.",
    ],
    takeaway:
      "1949 entstanden die Bundesrepublik (23. Mai, Grundgesetz) und die DDR (7. Oktober): eine parlamentarische Demokratie und eine Diktatur der SED.",
    sourceIds: ["lemo-grundgesetz", "lemo-ddr-gruendung", "lemo-blockade", "lemo-marshall", "gg"],
    quiz: check(
      "Wann wurde das Grundgesetz verkündet?",
      "Am 23. Mai 1949.",
      ["Am 7. Oktober 1949.", "Am 1. Dezember 1946."],
      [
        "Am 7. Oktober 1949 wurde die DDR gegründet.",
        "Am 1. Dezember 1946 wurde die Bayerische Verfassung angenommen.",
      ],
      "Mit der Verkündung des Grundgesetzes war die Bundesrepublik gegründet.",
    ),
    workshop: timeline(
      [
        ["Marshallplan angekündigt (Juni 1947)", "Wirtschaftshilfe für Europa, verbunden mit Eindämmung."],
        ["Währungsreform in den Westzonen (20. Juni 1948)", "Die D-Mark trennt die Wirtschaftsräume."],
        ["Beginn der Berlin-Blockade (24. Juni 1948)", "Die Sowjetunion sperrt die Zugänge nach West-Berlin."],
        ["Parlamentarischer Rat tritt zusammen (1. September 1948)", "In Bonn beginnt die Arbeit am Grundgesetz."],
        ["Ende der Berlin-Blockade (12. Mai 1949)", "Die Luftbrücke hat die Stadt versorgt."],
        ["Verkündung des Grundgesetzes (23. Mai 1949)", "Die Bundesrepublik ist gegründet."],
        ["Gründung der DDR (7. Oktober 1949)", "Der zweite deutsche Staat entsteht."],
      ],
      "Die Staatsgründungen waren Antworten auf Schritte der Gegenseite. Die Teilung entstand Schritt für Schritt im Kalten Krieg.",
    ),
    tasks: {
      1: writing(
        "Vergleiche die Staatsordnung der Bundesrepublik und der DDR von 1949 an zwei Merkmalen.",
        ["Wahlen und Parteien.", "Gewaltenteilung und Gerichte."],
        "In der Bundesrepublik konnten die Bürger zwischen konkurrierenden Parteien frei wählen; in der DDR stimmten sie über Einheitslisten ab, deren Ergebnis feststand. In der Bundesrepublik kontrollierten unabhängige Gerichte die Regierung, in der DDR folgten Justiz und Verwaltung der SED. Die eine Ordnung war eine Demokratie, die andere eine Diktatur.",
        ["Merkmal Wahlen", "Merkmal Gewaltenteilung", "Einordnung"],
      ),
      2: writing(
        "Diskutiere: Waren die Deutschen 1949 selbst für die Teilung verantwortlich?",
        ["Politik der Alliierten.", "Entscheidungen deutscher Politiker."],
        "Die Teilung ging vor allem auf den Konflikt der Siegermächte zurück: Sie hatten die Macht in ihren Zonen und verfolgten gegensätzliche Ziele. Deutsche Politiker gestalteten die Staatsgründungen aber mit, im Westen im Parlamentarischen Rat, im Osten die SED mit sowjetischer Unterstützung. Die Teilung war also von außen bestimmt, aber nicht ohne deutsche Beteiligung.",
        ["Rolle der Alliierten", "Rolle der Deutschen", "Abgewogenes Urteil"],
      ),
    },
  },
];
