import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const division: Lesson[] = [
  {
    id: "g10-sed-diktatur",
    lb: 3,
    title: "Staat und Alltag in der SED-Diktatur",
    period: "1949–1989",
    intro:
      "Die SED beanspruchte, Staat, Wirtschaft und Gesellschaft zu lenken. Der Alltag bewegte sich zwischen Anpassung, Nischen und Mangel.",
    paragraphs: [
      "Die SED entstand 1946 aus der Zwangsvereinigung von KPD und SPD in der sowjetischen Zone. Sie verstand sich als führende Partei, die Wahrheit und Ziele der Geschichte kenne; die Verfassung von 1968 schrieb ihre Führungsrolle ausdrücklich fest. Andere Parteien waren in der „Nationalen Front“ eingebunden, Wahlen boten keine Auswahl. Schule, Medien und Massenorganisationen sollten die „sozialistische Persönlichkeit“ formen: Kinder waren Junge Pioniere, Jugendliche in der FDJ, die Jugendweihe ersetzte für viele die Konfirmation.",
      "Die Wirtschaft war eine zentrale Planwirtschaft. Eine Plankommission legte in Fünfjahrplänen fest, was Volkseigene Betriebe (VEB) produzieren und was Waren kosten. Die Landwirtschaft wurde bis 1960 in Landwirtschaftliche Produktionsgenossenschaften (LPG) gezwungen. Grundnahrungsmittel und Mieten waren billig und Arbeitsplätze sicher, aber viele Konsumgüter knapp: Auf einen Trabant wartete man oft mehr als zehn Jahre, Südfrüchte und Ersatzteile gab es selten.",
      "Viele Menschen arrangierten sich, zogen sich ins Private zurück oder nutzten Freiräume in Kirchen und Freundeskreisen. Wer sich offen widersetzte, riskierte Nachteile bei Ausbildung und Beruf oder Haft. Die SED rechtfertigte ihre Herrschaft mit sozialer Sicherheit und Antifaschismus; ihr fehlte aber die Zustimmung in freien Wahlen. Dass Hunderttausende das Land verließen, zeigte, wie begrenzt die Akzeptanz des Systems war.",
    ],
    takeaway:
      "Die DDR war eine Diktatur der SED mit Planwirtschaft: soziale Sicherheit und Indoktrination standen neben Mangel, Unfreiheit und fehlender Legitimation durch freie Wahlen.",
    sourceIds: ["lemo-planwirtschaft", "lemo-mangel", "lemo-ddr-gruendung"],
    quiz: check(
      "Wer entschied in der Planwirtschaft der DDR, was produziert wurde?",
      "Staatliche Planbehörden unter Führung der SED.",
      [
        "Die Käufer durch Angebot und Nachfrage auf dem Markt.",
        "Die Gewerkschaften in freien Tarifverhandlungen.",
      ],
      [
        "Angebot und Nachfrage steuern die Marktwirtschaft, nicht die Planwirtschaft der DDR.",
        "Der FDGB war eine Massenorganisation der SED, freie Tarifverhandlungen gab es nicht.",
      ],
      "Produktion, Preise und Löhne wurden zentral geplant. Das sicherte Grundversorgung, führte aber oft zu Mangel.",
    ),
    workshop: classify(
      "Alltag in der DDR einordnen",
      ["Staatliche Lenkung", "Planwirtschaft im Alltag", "Freiraum und Rückzug"],
      [
        [
          "In der Schule lernen alle das Fach Staatsbürgerkunde.",
          0,
          "Die Schule sollte sozialistische Überzeugungen vermitteln.",
        ],
        [
          "Eine Familie meldet ihr Auto an und wartet jahrelang auf die Lieferung.",
          1,
          "Knappe Konsumgüter waren typisch für die Planwirtschaft.",
        ],
        [
          "Jugendliche treffen sich in einer Kirchengemeinde zu offenen Gesprächen.",
          2,
          "Kirchen boten begrenzte Freiräume.",
        ],
        [
          "Die Volkskammer wird über eine Einheitsliste gewählt.",
          0,
          "Die Wahl bestätigte nur die Vorgaben der SED.",
        ],
        [
          "Brot und Miete sind sehr billig, weil der Staat die Preise festlegt.",
          1,
          "Subventionierte Preise sollten Grundversorgung sichern.",
        ],
      ],
      "Lenkung, Versorgung und Rückzug gehörten zusammen. Wer nur eine Seite betrachtet, versteht die Akzeptanz und die Krise der DDR nicht.",
    ),
    tasks: {
      1: writing(
        "Erkläre an zwei Beispielen, wie die SED Kinder und Jugendliche beeinflussen wollte.",
        ["Organisationen und Rituale.", "Unterricht."],
        "Kinder sollten als Junge Pioniere und Jugendliche in der FDJ sozialistisch erzogen werden; wer nicht mitmachte, hatte oft Nachteile. Die Jugendweihe band Jugendliche mit einem Gelöbnis an den Staat. In der Schule vermittelte Staatsbürgerkunde die Sicht der SED. So sollte eine Generation im Sinne der Partei heranwachsen.",
        ["Zwei Beispiele", "Ziel der SED", "Folgen für Abweichende"],
      ),
      2: writing(
        "Beurteile, wie sich Wirtschaftsordnung und Lebensverhältnisse auf die Akzeptanz der DDR auswirkten.",
        ["Soziale Sicherheit und Mangel.", "Vergleich mit dem Westen."],
        "Billige Grundversorgung und sichere Arbeitsplätze verschafften der DDR bei manchen Zustimmung. Der Mangel an Konsumgütern, fehlende Reisefreiheit und der sichtbare Wohlstand im Westen untergruben sie jedoch. Weil die SED sich keiner freien Wahl stellte, blieb ihre Herrschaft von Zwang abhängig. Die Akzeptanz war deshalb begrenzt und brach 1989 zusammen.",
        ["Positive Faktoren", "Negative Faktoren", "Zusammenhang Wirtschaft und Politik"],
      ),
    },
  },
  {
    id: "g10-17-juni-1953",
    lb: 3,
    title: "17. Juni 1953: Aufstand gegen das SED-Regime",
    period: "Juni 1953",
    intro:
      "Aus einem Streik gegen höhere Arbeitsnormen wurde ein Aufstand in der ganzen DDR. Sowjetische Panzer schlugen ihn nieder.",
    paragraphs: [
      "1952 verkündete die SED den „planmäßigen Aufbau des Sozialismus“. Schwerindustrie wurde bevorzugt, Bauern in Genossenschaften gedrängt, die Versorgung verschlechterte sich, Zehntausende flohen. Im Mai 1953 erhöhte die Regierung die Arbeitsnormen: Für denselben Lohn sollte mehr geleistet werden. Als Bauarbeiter in der Ost-Berliner Stalinallee am 16. Juni die Arbeit niederlegten, verbreitete sich die Nachricht auch über westliche Radiosender.",
      "Am 17. Juni streikten und demonstrierten in mehr als 700 Orten der DDR Hunderttausende, auch in Leipzig, Halle, Magdeburg und Jena. Aus der Forderung nach niedrigeren Normen wurden politische Forderungen: Rücktritt der Regierung, freie Wahlen, Einheit Deutschlands. Die sowjetische Besatzungsmacht verhängte den Ausnahmezustand und setzte Panzer ein. Mindestens 55 Menschen kamen ums Leben, Tausende wurden verhaftet, einige hingerichtet.",
      "Die SED nannte den Aufstand einen vom Westen gesteuerten „faschistischen Putschversuch“. Sie nahm die Normerhöhung zurück, baute aber die Staatssicherheit aus. In der Bundesrepublik war der 17. Juni von 1954 bis 1990 als „Tag der deutschen Einheit“ gesetzlicher Feiertag. Der Aufstand zeigte, dass die SED nur mit sowjetischer Militärgewalt herrschen konnte; viele Menschen schlossen daraus, dass offener Widerstand aussichtslos sei.",
    ],
    takeaway:
      "Am 17. Juni 1953 erhoben sich Menschen in der ganzen DDR gegen die SED; sowjetische Truppen schlugen den Aufstand nieder.",
    sourceIds: ["lemo-17juni", "bpb-teilung"],
    quiz: check(
      "Wodurch wurde der Aufstand vom 17. Juni 1953 niedergeschlagen?",
      "Durch sowjetische Truppen mit Panzern.",
      [
        "Durch Truppen der NATO.",
        "Durch einen freiwilligen Rückzug der Streikenden nach Gesprächen.",
      ],
      [
        "Die Westmächte griffen nicht ein; die DDR lag im sowjetischen Machtbereich.",
        "Es gab keine Verhandlungslösung; die Besatzungsmacht verhängte den Ausnahmezustand.",
      ],
      "Ohne sowjetische Panzer hätte sich die SED-Führung nicht halten können.",
    ),
    workshop: timeline(
      [
        ["SED verkündet den „planmäßigen Aufbau des Sozialismus“ (1952)", "Schwerindustrie und Kollektivierung verschärfen die Versorgungslage."],
        ["Erhöhung der Arbeitsnormen (Mai 1953)", "Mehr Leistung für den gleichen Lohn."],
        ["Streik der Bauarbeiter in der Stalinallee (16. Juni 1953)", "Der Protest beginnt in Ost-Berlin."],
        ["Aufstand in über 700 Orten und Ausnahmezustand (17. Juni 1953)", "Aus sozialen werden politische Forderungen; Panzer rollen."],
        ["Der 17. Juni wird in der Bundesrepublik Feiertag (1954)", "Der Westen erinnert an den Aufstand als Ruf nach Einheit."],
      ],
      "Der Aufstand hatte wirtschaftliche Auslöser und wurde schnell politisch. Seine Niederschlagung prägte das Verhältnis von Bevölkerung und Staat für Jahrzehnte.",
    ),
    tasks: {
      1: writing(
        "Erkläre, wie aus einem Protest gegen Arbeitsnormen ein politischer Aufstand wurde.",
        ["Auslöser und Verbreitung.", "Welche Forderungen kamen hinzu?"],
        "Auslöser war die Erhöhung der Arbeitsnormen, die die ohnehin schlechte Lage verschärfte. Über Radio und Mundpropaganda verbreitete sich der Streik vom 16. Juni rasch. Am 17. Juni forderten die Menschen dann Rücktritt der Regierung, freie Wahlen und Einheit. Der wirtschaftliche Unmut richtete sich damit gegen das ganze System.",
        ["Auslöser", "Ausbreitung", "Politische Forderungen"],
      ),
      2: writing(
        "Vergleiche, wie SED und Bundesrepublik den 17. Juni deuteten, und beurteile beide Deutungen.",
        ["„Faschistischer Putsch“ und „Tag der deutschen Einheit“.", "Was belegen die Quellen?"],
        "Die SED sprach von einem vom Westen gesteuerten Putsch, um den Protest der eigenen Bevölkerung zu leugnen. Die Bundesrepublik machte den Tag zum Feiertag der Einheit und betonte die Forderung nach freien Wahlen. Die Quellen zeigen spontane Streiks mit sozialen und politischen Zielen, die SED-Deutung ist deshalb nicht haltbar. Auch die westliche Deutung vereinfachte, weil sie vor allem den Wunsch nach Einheit hervorhob.",
        ["SED-Deutung", "West-Deutung", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g10-stasi",
    lb: 3,
    title: "Stasi, Unterdrückung und Zivilcourage",
    period: "1950–1989",
    intro:
      "Das Ministerium für Staatssicherheit überwachte die eigene Bevölkerung. Trotzdem gab es Menschen, die widersprachen.",
    paragraphs: [
      "Das Ministerium für Staatssicherheit (MfS), die „Stasi“, wurde 1950 gegründet und verstand sich als „Schild und Schwert der Partei“. Es war Geheimpolizei, Nachrichtendienst und Untersuchungsorgan zugleich. 1989 hatte es rund 91.000 hauptamtliche Mitarbeiter und etwa 189.000 inoffizielle Mitarbeiter (IM), die Nachbarn, Kollegen oder sogar Familienangehörige ausspähten. Die Stasi öffnete Briefe, hörte Telefone ab und legte Akten über Millionen Menschen an.",
      "In den ersten Jahrzehnten setzte sie vor allem auf Verhaftungen und Haft, etwa im Untersuchungsgefängnis Berlin-Hohenschönhausen. Später nutzte sie verstärkt verdeckte „Zersetzung“: Sie streute Gerüchte, sorgte für Misserfolge im Beruf oder zerstörte Beziehungen, um Kritiker zu verunsichern, ohne sichtbar Gewalt anzuwenden. Viele Menschen erfuhren erst nach 1990 aus ihren Akten, wer sie verraten hatte.",
      "Wenn ein politisches System so in das Leben eingreift, ziehen Menschen unterschiedliche Konsequenzen: Manche passen sich an, manche arbeiten mit, manche fliehen, manche widersprechen. Kirchliche Friedensgruppen trugen in den 1980er-Jahren den Aufnäher „Schwerter zu Pflugscharen“, Umweltgruppen dokumentierten Schäden, Bürgerrechtler verbreiteten verbotene Schriften. Sie riskierten Ausbildung, Beruf und Freiheit. Seit 1992 können Betroffene ihre Akten einsehen; heute verwahrt das Bundesarchiv die Stasi-Unterlagen.",
    ],
    takeaway:
      "Die Stasi sicherte die SED-Herrschaft durch Überwachung, Haft und Zersetzung; Zivilcourage bedeutete in der DDR ein hohes persönliches Risiko.",
    sourceIds: ["lemo-mfs", "stasi-archiv", "bpb-stasi", "lemo-opposition"],
    quiz: check(
      "Was verstand die Stasi unter „Zersetzung“?",
      "Verdeckte Maßnahmen, die Kritiker beruflich und privat zermürben sollten.",
      [
        "Die öffentliche Verurteilung von Kritikern in Schauprozessen.",
        "Die Ausweisung aller Kritiker in die Bundesrepublik.",
      ],
      [
        "Schauprozesse gab es vor allem in den frühen Jahren; Zersetzung arbeitete verdeckt.",
        "Ausbürgerungen kamen vor, etwa bei Biermann, sie waren aber nicht die Regel.",
      ],
      "Zersetzung sollte Widerstand brechen, ohne dass Gewalt sichtbar wurde; die Opfer wussten oft nicht, wer hinter ihren Problemen stand.",
    ),
    workshop: classify(
      "Wie reagieren Menschen auf Überwachung?",
      ["Anpassung", "Mitwirkung am System", "Widerspruch und Zivilcourage"],
      [
        [
          "Ein Lehrer äußert seine Meinung nur noch in der eigenen Küche.",
          0,
          "Rückzug ins Private war eine häufige Reaktion.",
        ],
        [
          "Eine Kollegin berichtet regelmäßig als IM über ihre Abteilung.",
          1,
          "Inoffizielle Mitarbeiter machten die Überwachung erst möglich.",
        ],
        [
          "Eine Jugendgruppe trägt trotz Verbot den Aufnäher „Schwerter zu Pflugscharen“.",
          2,
          "Sie riskierte Schulverweis und Nachteile.",
        ],
        [
          "Ein Pfarrer öffnet seine Kirche für eine Umweltbibliothek.",
          2,
          "Kirchen boten Schutzräume für Kritik.",
        ],
      ],
      "Urteile über Menschen in einer Diktatur brauchen Kenntnis ihrer Lage. Zivilcourage verdient Anerkennung, gerade weil sie viel kostete.",
    ),
    tasks: {
      1: writing(
        "Erkläre, mit welchen Mitteln die Stasi die Bevölkerung überwachte.",
        ["Hauptamtliche und inoffizielle Mitarbeiter.", "Post, Telefon, Akten."],
        "Die Stasi hatte 1989 rund 91.000 hauptamtliche und etwa 189.000 inoffizielle Mitarbeiter, die aus dem Umfeld der Menschen berichteten. Sie öffnete Briefe, hörte Telefone ab und legte Akten an. Mit diesen Informationen konnte sie Menschen verhaften oder durch Zersetzung verunsichern.",
        ["Personal", "Methoden", "Zweck"],
      ),
      2: writing(
        "Fälle ein Sach- und ein Werturteil zur Bedeutung von Zivilcourage in der DDR.",
        ["Sachurteil: Was bewirkte Widerspruch?", "Werturteil: Wie bewertest du ihn heute?"],
        "Sachurteil: Kirchliche Gruppen und Bürgerrechtler konnten die SED lange nicht gefährden, sie schufen aber Netzwerke, aus denen 1989 die friedliche Revolution hervorging. Werturteil: Ich halte ihren Mut für vorbildlich, weil sie Freiheit und Menschenwürde verteidigten, obwohl sie Beruf und Freiheit riskierten. Das heißt nicht, dass ich Menschen pauschal verurteile, die sich anpassten.",
        ["Sachurteil", "Werturteil mit Maßstab", "Differenzierung"],
      ),
    },
  },
  {
    id: "g10-mauerbau",
    lb: 3,
    title: "13. August 1961: Die Mauer",
    period: "1958–1989",
    intro:
      "Um die Massenflucht zu stoppen, riegelte die DDR West-Berlin ab. Die Mauer wurde zum Symbol der Teilung.",
    paragraphs: [
      "Von 1949 bis August 1961 flohen rund 2,8 Millionen Menschen aus der DDR in die Bundesrepublik, viele davon jung und gut ausgebildet. Seit 1952 war die innerdeutsche Grenze befestigt, Berlin blieb der letzte offene Weg. 1958 verlangte der sowjetische Partei- und Regierungschef Chruschtschow ultimativ den Abzug der Westmächte aus Berlin; die Westmächte lehnten ab. Allein vom 1. bis 13. August 1961 flohen über 47.000 Menschen.",
      "In der Nacht zum 13. August 1961 begannen Volkspolizei, Grenzpolizei und Kampfgruppen, die Sektorengrenze abzuriegeln, zuerst mit Stacheldraht, dann mit einer Mauer. Wenige Wochen zuvor hatte Walter Ulbricht noch erklärt, niemand habe die Absicht, eine Mauer zu errichten. Die Westmächte protestierten, griffen aber nicht ein, solange ihre Rechte in West-Berlin unangetastet blieben. Präsident Kennedy besuchte die Stadt 1963.",
      "Die Grenzanlagen um West-Berlin wurden rund 155 Kilometer lang und immer weiter ausgebaut. An der Mauer wurden mindestens 140 Menschen getötet oder kamen in Zusammenhang mit dem Grenzregime ums Leben; der 18-jährige Peter Fechter verblutete 1962 vor den Augen vieler Zuschauer. Familien blieben jahrzehntelang getrennt. Für die SED stabilisierte der Mauerbau die DDR wirtschaftlich, er bewies aber auch, dass sie ihre Bürger nur durch Einsperren halten konnte.",
    ],
    takeaway:
      "Ab dem 13. August 1961 sperrte die Mauer die Fluchtbewegung über Berlin; sie stabilisierte die DDR durch Zwang und wurde zum Symbol der deutschen Teilung.",
    sourceIds: ["lemo-mauerbau", "lemo-flucht", "mauer-stiftung"],
    quiz: check(
      "Warum ließ die SED-Führung 1961 die Mauer bauen?",
      "Um die Massenflucht ihrer Bürger über West-Berlin zu stoppen.",
      [
        "Um einen Angriff der Bundeswehr auf Ost-Berlin abzuwehren.",
        "Weil die Westmächte den Bau der Mauer verlangt hatten.",
      ],
      [
        "Das behauptete die SED-Propaganda; die Anlagen richteten sich gegen Flucht.",
        "Die Westmächte protestierten gegen den Bau, sie hatten ihn nicht verlangt.",
      ],
      "Bis 1961 hatten rund 2,8 Millionen Menschen die DDR verlassen; das gefährdete Wirtschaft und Ansehen des Staates.",
    ),
    workshop: {
      ...classify(
        "Ursachen und Folgen des Mauerbaus",
        ["Ursache", "Folge"],
        [
          ["Fachkräfte und junge Menschen verlassen die DDR in großer Zahl.", 0, "Die Abwanderung schwächte die Wirtschaft."],
          ["Berlin ist nach 1952 der letzte offene Weg in den Westen.", 0, "Darum setzte die Abriegelung in Berlin an."],
          ["Familien und Freunde sind über Jahrzehnte getrennt.", 1, "Die Mauer trennte Menschen bis 1989."],
          ["Die Zahl der Flüchtlinge sinkt drastisch.", 1, "Flucht wurde lebensgefährlich."],
          ["Menschen sterben bei Fluchtversuchen an der Grenze.", 1, "Mindestens 140 Todesopfer an der Berliner Mauer sind dokumentiert."],
        ],
        "Der Mauerbau löste das Fluchtproblem der SED mit Gewalt. Das kostete Menschenleben und Glaubwürdigkeit.",
      ),
      dataTable: {
        title: "Flucht aus der DDR vor dem Mauerbau",
        unit: "Menschen, gerundet",
        columns: ["Zeitraum", "Geflüchtete"],
        max: 3000000,
        suffix: "",
        rows: [
          { label: "September 1949 bis August 1961", value: 2800000 },
          { label: "1. bis 13. August 1961", value: 47000 },
        ],
        sourceId: "lemo-flucht",
        note: "Die Zeiträume sind sehr unterschiedlich lang: Zwölf Jahre stehen dreizehn Tagen gegenüber. Rechne die Augustzahl auf einen Tag um, um die Beschleunigung zu sehen.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre, warum die Mauer gerade in Berlin gebaut wurde.",
        ["Lage Berlins und Grenze ab 1952.", "Viermächtestatus."],
        "Die innerdeutsche Grenze war seit 1952 abgeriegelt, in Berlin aber konnten Menschen zwischen den Sektoren noch wechseln. Wegen des Viermächtestatus konnte die DDR die Grenze dort nicht einfach schließen, ohne einen Konflikt mit den Westmächten zu riskieren. Mit sowjetischer Zustimmung schloss sie 1961 dieses letzte Schlupfloch.",
        ["Grenze ab 1952", "Sonderstatus Berlins", "Zusammenhang mit der Flucht"],
      ),
      2: writing(
        "Beurteile: Der Mauerbau rettete die DDR.",
        ["Kurzfristige Stabilisierung.", "Langfristige Folgen für Ansehen und Akzeptanz."],
        "Kurzfristig stoppte die Mauer die Abwanderung, und die Wirtschaft der DDR stabilisierte sich. Langfristig zeigte sie aber, dass die SED ihre Bürger nur durch Einsperren halten konnte, und kostete Menschenleben und Ansehen. Die Mauer verlängerte die DDR um fast drei Jahrzehnte, retten konnte sie den Staat nicht.",
        ["Kurzfristige Wirkung", "Langfristige Folgen", "Urteil"],
      ),
    },
  },
  {
    id: "g10-aera-adenauer",
    lb: 3,
    title: "Ära Adenauer: Westintegration und Wirtschaftswunder",
    period: "1949–1963",
    intro:
      "Die junge Bundesrepublik band sich fest an den Westen und erlebte einen raschen Aufschwung. Beides stärkte das Vertrauen in die Demokratie.",
    paragraphs: [
      "Konrad Adenauer (CDU) war von 1949 bis 1963 erster Bundeskanzler. Sein Ziel war die Westintegration: Die Bundesrepublik sollte durch enge Bindung an die westlichen Demokratien Sicherheit, Gleichberechtigung und Souveränität gewinnen. Sie wurde 1951 Mitglied der Montanunion, 1955 der NATO und gründete die Bundeswehr; 1957 war sie Gründungsmitglied der Europäischen Wirtschaftsgemeinschaft. Die SPD kritisierte, dass diese Politik die Einheit Deutschlands erschwere. Adenauer lehnte 1952 die Stalin-Note ab, die ein neutrales Gesamtdeutschland anbot, weil er ihr misstraute.",
      "Wirtschaftsminister Ludwig Erhard setzte auf die Soziale Marktwirtschaft: freier Wettbewerb und Privateigentum, verbunden mit sozialem Ausgleich durch Staat und Sozialversicherung. In den 1950er-Jahren wuchs die Wirtschaft schnell, die Arbeitslosigkeit sank, viele Familien leisteten sich Kühlschrank, Fernseher und Urlaub. Dieses „Wirtschaftswunder“ hatte mehrere Ursachen: Marshallplan, Währungsreform, Nachfrage durch den Koreakrieg, gut ausgebildete Arbeitskräfte, darunter Vertriebene und DDR-Flüchtlinge.",
      "Die demokratischen Parteien gewannen an Zustimmung, 1957 erreichten CDU und CSU sogar die absolute Mehrheit. Lastenausgleich (1952) und dynamische Rente (1957) verteilten Lasten und Wohlstand. Anders als in Weimar verband sich die Demokratie für viele Menschen mit Sicherheit und Aufstieg. Kritiker sahen die Zeit als restaurativ: Alte Rollenbilder hielten sich, und die NS-Vergangenheit wurde oft verschwiegen.",
    ],
    takeaway:
      "Westintegration, Soziale Marktwirtschaft und Wirtschaftswunder verschafften der Bundesrepublik unter Adenauer Sicherheit, Wohlstand und Akzeptanz der Demokratie.",
    sourceIds: ["lemo-adenauer", "lemo-westen", "lemo-marktwirtschaft", "lemo-wirtschaftswunder"],
    quiz: check(
      "Was meint der Begriff Westintegration?",
      "Die Einbindung der Bundesrepublik in westliche Bündnisse und Gemeinschaften.",
      [
        "Die Aufnahme der DDR und der Ostgebiete in die Bundesrepublik.",
        "Die Ansiedlung von Vertriebenen und Flüchtlingen in Westdeutschland.",
      ],
      [
        "Die Einheit kam erst 1990 und war nicht Teil der Westintegration.",
        "Das war die Integration der Vertriebenen, ein anderes Thema.",
      ],
      "Mit NATO, Montanunion und EWG gewann die Bundesrepublik Sicherheit und Gleichberechtigung, die Einheit rückte in die Ferne.",
    ),
    workshop: classify(
      "Warum fand die Demokratie Zustimmung?",
      ["Wirtschaft und Wohlstand", "Sicherheit und Westbindung", "Soziale Absicherung"],
      [
        ["Die Arbeitslosigkeit sinkt in den 1950er-Jahren deutlich.", 0, "Arbeit und Einkommen schufen Vertrauen."],
        ["Die Bundesrepublik tritt 1955 der NATO bei.", 1, "Das Bündnis versprach Schutz vor der Sowjetunion."],
        ["Mit der dynamischen Rente steigen die Renten mit den Löhnen.", 2, "Ältere Menschen profitierten vom Aufschwung."],
        ["Familien kaufen sich Kühlschrank und Fernseher.", 0, "Konsum wurde zum Zeichen des Aufstiegs."],
        ["Der Lastenausgleich entschädigt Vertriebene teilweise.", 2, "Kriegsfolgen wurden gemeinsam getragen."],
      ],
      "Anders als in Weimar war die Demokratie mit Erfolgserfahrungen verbunden. Das erklärt ihre Stabilität, nicht aber jede ihrer Schwächen.",
    ),
    tasks: {
      1: writing(
        "Erkläre zwei Ursachen des Wirtschaftswunders.",
        ["Hilfe von außen und Reformen.", "Arbeitskräfte."],
        "Der Marshallplan und die Währungsreform von 1948 schufen Kapital und eine stabile Währung, sodass Produktion sich wieder lohnte. Zugleich standen viele gut ausgebildete Arbeitskräfte zur Verfügung, darunter Vertriebene und Flüchtlinge aus der DDR. Die Soziale Marktwirtschaft setzte Anreize und sicherte sozialen Ausgleich.",
        ["Ursache 1", "Ursache 2", "Erklärung des Zusammenhangs"],
      ),
      2: writing(
        "Diskutiere, ob Adenauers Westintegration die deutsche Einheit verhinderte.",
        ["Stalin-Note 1952.", "Was hätte Neutralität bedeutet?"],
        "Kritiker meinten, Adenauer habe mit der Ablehnung der Stalin-Note 1952 eine Chance auf Einheit verpasst. Adenauer misstraute dem Angebot und fürchtete ein neutrales Deutschland unter sowjetischem Einfluss. Ob die Sowjetunion freie Wahlen zugelassen hätte, ist bis heute umstritten. Die Westintegration sicherte Freiheit und Wohlstand, verschob die Einheit aber in eine unbestimmte Zukunft.",
        ["Argument der Kritiker", "Adenauers Begründung", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g10-ns-vergangenheit",
    lb: 3,
    title: "Umgang mit der NS-Vergangenheit",
    period: "1949–1979",
    intro:
      "Nach Kriegsende wollten viele vergessen. Erst nach und nach stellte sich die Bundesrepublik den Verbrechen.",
    paragraphs: [
      "In den 1950er-Jahren schwiegen viele Deutsche über die NS-Zeit. Amnestiegesetze von 1949 und 1954 erließen Strafen, ein Gesetz von 1951 ermöglichte vielen früheren Beamten die Rückkehr in den Staatsdienst. Belastete Juristen, Ärzte und Beamte machten Karriere; Hans Globke, Kommentator der Nürnberger Gesetze, leitete das Bundeskanzleramt. Zugleich schloss die Bundesrepublik 1952 mit Israel und der Jewish Claims Conference das Luxemburger Abkommen über Entschädigungszahlungen.",
      "Ende der 1950er-Jahre änderte sich der Umgang. Nach dem Ulmer Einsatzgruppen-Prozess 1958 wurde in Ludwigsburg die Zentrale Stelle zur Aufklärung von NS-Verbrechen gegründet. Der Prozess gegen Adolf Eichmann in Jerusalem 1961 und die Frankfurter Auschwitz-Prozesse 1963 bis 1965, die der hessische Generalstaatsanwalt Fritz Bauer anstieß, machten die Verbrechen öffentlich. Der Bundestag stritt mehrfach über die Verjährung von Mord; 1979 hob er sie auf.",
      "Die DDR verstand sich als antifaschistischer Staat und verwies auf belastete Westdeutsche. Sie bestrafte viele NS-Täter, nutzte Prozesse aber auch politisch und sah sich selbst nicht in der Verantwortung. Ab 1968 fragten junge Westdeutsche ihre Eltern offen nach deren Rolle. Der Umgang mit der Vergangenheit war damit kein Schlusspunkt, sondern ein langer Prozess, der bis heute andauert.",
    ],
    takeaway:
      "In der frühen Bundesrepublik standen Schweigen und Wiedereingliederung Belasteter neben Entschädigung; ab 1958 brachten Prozesse die Verbrechen in die Öffentlichkeit.",
    sourceIds: ["lemo-vergangenheit", "lemo-nuernberg", "bpb-erinnerung"],
    quiz: check(
      "Welche Prozesse machten 1963 bis 1965 die Verbrechen in einem Vernichtungslager in der Bundesrepublik öffentlich?",
      "Die Frankfurter Auschwitz-Prozesse.",
      ["Die Nürnberger Prozesse der Alliierten.", "Der Prozess gegen Adolf Eichmann."],
      [
        "Die Nürnberger Prozesse führten 1945 bis 1949 die Alliierten.",
        "Eichmann stand 1961 in Jerusalem vor einem israelischen Gericht.",
      ],
      "In Frankfurt standen Angehörige des Lagerpersonals vor einem deutschen Gericht; Zeugen berichteten öffentlich über Auschwitz.",
    ),
    workshop: timeline(
      [
        ["Erstes Straffreiheitsgesetz des Bundestags (1949)", "Viele Strafen für frühere Taten werden erlassen."],
        ["Luxemburger Abkommen mit Israel (1952)", "Die Bundesrepublik leistet Entschädigung."],
        ["Ulmer Einsatzgruppen-Prozess und Zentrale Stelle in Ludwigsburg (1958)", "Die Justiz beginnt systematisch zu ermitteln."],
        ["Eichmann-Prozess in Jerusalem (1961)", "Ein Organisator des Holocaust steht vor Gericht."],
        ["Frankfurter Auschwitz-Prozess beginnt (1963)", "Deutsche Richter verhandeln über Auschwitz."],
        ["Bundestag hebt die Verjährung für Mord auf (1979)", "NS-Morde können weiter verfolgt werden."],
      ],
      "Der Umgang mit der Vergangenheit wandelte sich vom Schweigen zur Aufklärung, angestoßen von Einzelnen wie Fritz Bauer und von Prozessen.",
    ),
    tasks: {
      1: writing(
        "Nenne zwei Beispiele dafür, dass die frühe Bundesrepublik mit NS-Belasteten nachsichtig umging.",
        ["Gesetze der frühen 1950er-Jahre.", "Karrieren Belasteter."],
        "Amnestiegesetze 1949 und 1954 erließen vielen Tätern Strafen, und ein Gesetz von 1951 holte frühere Beamte in den Staatsdienst zurück. Hans Globke, der die Nürnberger Gesetze kommentiert hatte, leitete Adenauers Kanzleramt. Viele wollten die Vergangenheit ruhen lassen, um die Gesellschaft zu integrieren.",
        ["Beispiel 1", "Beispiel 2", "Motiv erklärt"],
      ),
      2: writing(
        "Beurteile, warum die Auseinandersetzung mit der NS-Vergangenheit erst Jahre nach Kriegsende in Gang kam.",
        ["Interessen der Gesellschaft nach 1945.", "Rolle von Prozessen und Generationen."],
        "Nach 1945 waren viele selbst verstrickt, und Wiederaufbau sowie Integration hatten Vorrang; Schweigen schien bequemer. Erst Prozesse wie in Ulm, Jerusalem und Frankfurt zeigten die Verbrechen öffentlich, und eine junge Generation fragte nach. Die späte Aufarbeitung war ein Versäumnis gegenüber den Opfern, sie zeigt aber auch, dass Demokratie aus Druck und Debatte lernen kann.",
        ["Gründe für Schweigen", "Anstöße zur Aufarbeitung", "Werturteil"],
      ),
    },
  },
  {
    id: "g10-gastarbeiter",
    lb: 3,
    title: "Arbeitskräfte für den Aufschwung",
    period: "1945–1973",
    intro:
      "Vertriebene, DDR-Flüchtlinge und angeworbene „Gastarbeiter“ trugen das Wirtschaftswunder mit.",
    paragraphs: [
      "Bis 1961 standen der westdeutschen Wirtschaft Millionen Vertriebene und Flüchtlinge aus der DDR zur Verfügung, oft gut ausgebildet. Mit dem Mauerbau versiegte dieser Zustrom. Schon seit 1955 hatte die Bundesrepublik Anwerbeabkommen geschlossen: mit Italien (1955), Spanien und Griechenland (1960), der Türkei (1961), Marokko (1963), Portugal (1964), Tunesien (1965) und Jugoslawien (1968). Arbeitsämter in den Herkunftsländern vermittelten Menschen an deutsche Firmen.",
      "Die Angeworbenen arbeiteten meist in Industrie und Bergbau, oft in Schicht und in Tätigkeiten, für die sich kaum Deutsche fanden. Viele wohnten zunächst in Baracken oder Wohnheimen. Der Begriff „Gastarbeiter“ zeigt die Erwartung, dass sie nach einigen Jahren zurückkehren. 1964 wurde der millionste „Gastarbeiter“ in Köln mit einem Moped begrüßt. Viele blieben jedoch, holten ihre Familien nach und wurden Teil der Gesellschaft. Der Schriftsteller Max Frisch schrieb dazu: „Man hat Arbeitskräfte gerufen, und es kommen Menschen.“",
      "Während der Wirtschaftskrise 1973 verhängte die Bundesregierung einen Anwerbestopp. Integration wurde lange kaum gefördert, Sprachkurse und Mitbestimmung kamen spät. Die DDR holte später ebenfalls Vertragsarbeiter, etwa aus Vietnam und Mosambik, und trennte sie streng von der Bevölkerung. Die Arbeitsmigration der Nachkriegszeit veränderte Deutschland dauerhaft.",
    ],
    takeaway:
      "Ab 1955 warb die Bundesrepublik Arbeitskräfte im Ausland an; viele „Gastarbeiter“ blieben und prägten zusammen mit Vertriebenen und DDR-Flüchtlingen Wirtschaft und Gesellschaft.",
    sourceIds: ["lemo-gastarbeiter", "domid", "lemo-wirtschaftswunder"],
    quiz: check(
      "Mit welchem Land schloss die Bundesrepublik 1955 das erste Anwerbeabkommen?",
      "Mit Italien.",
      ["Mit der Türkei.", "Mit Jugoslawien."],
      [
        "Das Abkommen mit der Türkei folgte 1961.",
        "Jugoslawien kam 1968 als letztes Land hinzu.",
      ],
      "Bis Mitte der 1960er-Jahre kamen die meisten Angeworbenen aus Italien, danach stieg besonders die Zahl der Menschen aus der Türkei.",
    ),
    workshop: {
      ...classify(
        "Die Tabelle deuten",
        ["Durch die Tabelle gedeckt", "Braucht andere Quellen"],
        [
          ["Die Zahl ausländischer Arbeitnehmer stieg von 1960 bis 1973 auf fast das Achtfache.", 0, "330.000 und 2,6 Millionen: Das Verhältnis ist ablesbar."],
          ["Die meisten Angeworbenen wollten für immer bleiben.", 1, "Absichten zeigt eine Zahl nicht; viele planten zunächst die Rückkehr."],
          ["Nach 1973 kamen keine Menschen mehr aus dem Ausland.", 1, "Die Tabelle endet 1973; Familiennachzug ging weiter."],
          ["Zwischen 1960 und 1969 war der Anstieg besonders stark.", 0, "Von 330.000 auf 1,5 Millionen in neun Jahren."],
        ],
        "Statistiken zeigen Entwicklungen. Motive und Lebenswege erschließen Interviews, Briefe und Fotos, etwa in den Sammlungen von DOMiD.",
      ),
      dataTable: {
        title: "Ausländische Arbeitnehmer in der Bundesrepublik",
        unit: "Beschäftigte, gerundet",
        columns: ["Jahr", "Beschäftigte"],
        max: 3000000,
        suffix: "",
        rows: [
          { label: "1960", value: 330000 },
          { label: "1969", value: 1500000 },
          { label: "1973", value: 2600000 },
        ],
        sourceId: "lemo-gastarbeiter",
        note: "Die Zahlen zählen Arbeitnehmer, nicht ihre Familien. Die Jahresabstände sind ungleich.",
      },
    },
    tasks: {
      1: writing(
        "Erkläre, warum die Bundesrepublik nach 1961 verstärkt Arbeitskräfte im Ausland anwarb.",
        ["Wirtschaftswachstum.", "Folgen des Mauerbaus."],
        "Die Wirtschaft wuchs stark und brauchte mehr Arbeitskräfte, als es im Inland gab. Bis 1961 hatten Flüchtlinge aus der DDR die Lücke teilweise gefüllt. Nach dem Mauerbau fiel dieser Zustrom weg, darum schloss die Bundesrepublik weitere Anwerbeabkommen, etwa 1961 mit der Türkei.",
        ["Wachstum", "Mauerbau als Wendepunkt", "Anwerbeabkommen"],
      ),
      2: writing(
        "Erläutere das Zitat von Max Frisch „Man hat Arbeitskräfte gerufen, und es kommen Menschen“.",
        ["Was erwartete der Staat, was geschah?", "Familie, Wohnen, Zugehörigkeit."],
        "Staat und Wirtschaft sahen in den Angeworbenen vor allem Arbeitskräfte, die nach einigen Jahren zurückkehren sollten. Doch sie hatten Familien, Wünsche und Bedürfnisse nach Wohnung, Bildung und Anerkennung. Viele blieben und holten Angehörige nach. Frisch kritisiert, dass Politik und Gesellschaft das zu lange nicht wahrhaben wollten.",
        ["Erwartung erklärt", "Wirklichkeit erklärt", "Kritik gedeutet"],
      ),
    },
  },
  {
    id: "g10-1968",
    lb: 3,
    title: "1968: Protest, Aufbruch und Terror",
    period: "1966–1977",
    intro:
      "Junge Menschen stellten Autoritäten, Krieg und Schweigen in Frage. Aus einer kleinen Gruppe ging später der Terror der RAF hervor.",
    paragraphs: [
      "Ab 1966 regierte eine Große Koalition aus CDU/CSU und SPD, im Bundestag gab es kaum Opposition. Studierende und andere junge Menschen bildeten eine Außerparlamentarische Opposition (APO). Sie protestierten gegen den Vietnamkrieg, gegen die Notstandsgesetze von 1968, gegen überkommene Hochschulen und gegen das Schweigen der Elterngeneration über die NS-Zeit. Am 2. Juni 1967 erschoss ein Polizist in West-Berlin den Studenten Benno Ohnesorg; 1968 wurde der Studentenführer Rudi Dutschke bei einem Attentat schwer verletzt.",
      "Die Bewegung veränderte die Gesellschaft auch jenseits der Politik: Erziehung, Rollen von Frauen und Männern, Mode und Musik wurden freier. Frauen-, Friedens- und Umweltbewegungen der 1970er-Jahre knüpften daran an. Kritiker werfen der Bewegung Intoleranz und Nähe zu Diktaturen wie der in China vor. Ob „1968“ die Bundesrepublik demokratisiert hat oder vor allem einen ohnehin laufenden Wandel beschleunigte, ist umstritten.",
      "Eine kleine Gruppe radikalisierte sich. Die 1970 gegründete Rote Armee Fraktion (RAF) wollte den Staat mit Anschlägen bekämpfen. Im „Deutschen Herbst“ 1977 ermordete sie Generalbundesanwalt Siegfried Buback, den Bankier Jürgen Ponto und den entführten Arbeitgeberpräsidenten Hanns Martin Schleyer; ein Kommando entführte das Flugzeug „Landshut“, das eine Spezialeinheit in Mogadischu befreite. Insgesamt tötete die RAF über 30 Menschen. Der Staat reagierte mit strengeren Sicherheitsgesetzen und blieb doch ein Rechtsstaat; die RAF erklärte sich 1998 für aufgelöst.",
    ],
    takeaway:
      "Die 1968er-Bewegung forderte mehr Demokratie und Aufarbeitung und veränderte die Gesellschaft; der RAF-Terror der 1970er-Jahre stellte den Rechtsstaat auf die Probe.",
    sourceIds: ["lemo-apo", "lemo-raf", "bpb-raf"],
    quiz: check(
      "Wogegen richteten sich die Proteste der 1968er-Bewegung unter anderem?",
      "Gegen den Vietnamkrieg, die Notstandsgesetze und das Schweigen über die NS-Zeit.",
      [
        "Gegen die Westintegration und für den Beitritt zum Warschauer Pakt.",
        "Gegen das Frauenwahlrecht und für mehr Autorität der Eltern.",
      ],
      [
        "Die Bewegung war kein Programm für den Wechsel ins östliche Bündnis.",
        "Sie forderte mehr Gleichberechtigung und weniger Autorität, nicht weniger.",
      ],
      "Die APO nannte sich so, weil sie außerhalb des Parlaments agierte, in dem die Große Koalition kaum Opposition hatte.",
    ),
    workshop: classify(
      "Protest, Wandel oder Terror?",
      ["Politischer Protest", "Gesellschaftlicher Wandel", "Terror"],
      [
        ["Studierende demonstrieren gegen die Notstandsgesetze.", 0, "Ein Protest im Rahmen der Versammlungsfreiheit."],
        ["Paare leben zusammen, ohne verheiratet zu sein.", 1, "Lebensformen wurden freier."],
        ["Die RAF entführt und ermordet Hanns Martin Schleyer.", 2, "Gewalt gegen Menschen, um Angst zu verbreiten."],
        ["Kinderläden erproben eine Erziehung ohne Strafen.", 1, "Erziehungsideale wandelten sich."],
        ["Eine Sitzblockade protestiert gegen den Vietnamkrieg.", 0, "Ziviler Ungehorsam als Protestform."],
      ],
      "Der Protest der Vielen und der Terror der Wenigen müssen unterschieden werden: Gewalt gegen Menschen ist keine Form politischer Auseinandersetzung.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum sich in den 1960er-Jahren eine Außerparlamentarische Opposition bildete.",
        ["Große Koalition.", "Themen des Protests."],
        "Ab 1966 regierte die Große Koalition, und im Bundestag gab es kaum noch Opposition. Viele junge Menschen fühlten sich nicht vertreten. Sie protestierten auf der Straße gegen den Vietnamkrieg, gegen die Notstandsgesetze und gegen das Schweigen über die NS-Zeit.",
        ["Politische Lage", "Themen", "Zusammenhang"],
      ),
      2: writing(
        "Beurteile, wie die Bundesrepublik auf den Terror der RAF reagierte.",
        ["Sicherheit und Freiheit.", "Was zeigt der Deutsche Herbst über den Rechtsstaat?"],
        "Der Staat verschärfte Gesetze, baute Polizei und Fahndung aus und verweigerte sich den Forderungen der Entführer. Kritiker fürchteten, dass Freiheitsrechte zu stark eingeschränkt würden. Der Rechtsstaat blieb jedoch bestehen: Täter wurden vor Gericht gestellt, nicht ohne Verfahren bestraft. Die Reaktion war hart, aber im Rahmen der Verfassung.",
        ["Maßnahmen", "Kritik", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g10-sozialliberale-reformen",
    lb: 3,
    title: "„Mehr Demokratie wagen“: Die sozial-liberale Koalition",
    period: "1969–1982",
    intro:
      "Mit Willy Brandt regierte 1969 erstmals ein Sozialdemokrat. Seine Koalition mit der FDP reformierte Recht, Bildung und Außenpolitik.",
    paragraphs: [
      "Nach der Bundestagswahl 1969 bildeten SPD und FDP die Regierung, Willy Brandt wurde Kanzler. In seiner Regierungserklärung kündigte er an: „Wir wollen mehr Demokratie wagen.“ Damit nahm er Forderungen auf, die seit den 1960er-Jahren laut geworden waren. Der Machtwechsel selbst bewies, dass die Demokratie funktionierte: Erstmals ging die CDU in die Opposition.",
      "Die Koalition setzte zahlreiche Reformen durch. 1970 wurde das Wahlalter von 21 auf 18 Jahre gesenkt. Das BAföG von 1971 unterstützte Schülerinnen, Schüler und Studierende aus ärmeren Familien, neue Hochschulen entstanden. Betriebsverfassung (1972) und Mitbestimmungsgesetz (1976) stärkten Beschäftigte in Betrieben. Die Reform des Ehe- und Familienrechts (1977) machte die Ehe zur Partnerschaft Gleichberechtigter: Das gesetzliche Leitbild der Hausfrauenehe entfiel, beide Partner dürfen erwerbstätig sein und regeln den Haushalt gemeinsam. Auch das Strafrecht wurde liberalisiert.",
      "Außenpolitisch begann Brandt die Neue Ostpolitik mit Verträgen mit der Sowjetunion, Polen und der DDR; 1971 erhielt er den Friedensnobelpreis. 1974 trat er nach der Enttarnung eines DDR-Spions in seinem Büro zurück, Nachfolger wurde Helmut Schmidt. Ölkrise, steigende Arbeitslosigkeit und RAF-Terror begrenzten nun den Spielraum für Reformen. 1982 endete die Koalition, als Helmut Kohl durch ein konstruktives Misstrauensvotum Kanzler wurde.",
    ],
    takeaway:
      "Die SPD-FDP-Regierungen ab 1969 senkten das Wahlalter, erweiterten Bildungschancen und Mitbestimmung, reformierten das Familienrecht und begannen die Neue Ostpolitik.",
    sourceIds: ["lemo-reformen", "lemo-ostpolitik", "nobel-brandt"],
    quiz: check(
      "Welche Reform setzte die sozial-liberale Koalition 1970 durch?",
      "Die Senkung des Wahlalters von 21 auf 18 Jahre.",
      ["Die Einführung des Frauenwahlrechts.", "Die Gründung der Bundeswehr."],
      [
        "Frauen wählen in Deutschland seit 1918/19.",
        "Die Bundeswehr wurde 1955/56 unter Adenauer aufgebaut.",
      ],
      "Jüngere Menschen sollten früher politisch mitentscheiden; das passte zu Brandts Ziel, mehr Demokratie zu wagen.",
    ),
    workshop: classify(
      "Reformbereiche zuordnen",
      ["Politische Teilhabe", "Bildung und Arbeit", "Familie und Recht", "Außenpolitik"],
      [
        ["Achtzehnjährige dürfen den Bundestag wählen.", 0, "Mehr Menschen entscheiden mit."],
        ["Das BAföG fördert Ausbildung unabhängig vom Geldbeutel der Eltern.", 1, "Bildung sollte nicht vom Einkommen abhängen."],
        ["Das Gesetz schreibt nicht mehr vor, dass die Frau den Haushalt führt.", 2, "Seit 1977 regeln Ehepartner die Haushaltsführung im gegenseitigen Einvernehmen."],
        ["Verträge mit Moskau und Warschau sollen Spannungen abbauen.", 3, "Teil der Neuen Ostpolitik."],
        ["Beschäftigte großer Unternehmen erhalten mehr Mitbestimmung.", 1, "Mitbestimmungsgesetz 1976."],
      ],
      "Die Reformen zielten auf Teilhabe in vielen Lebensbereichen. Ihr Umfang war groß, aber auch umstritten und teuer.",
    ),
    tasks: {
      1: writing(
        "Erkläre an zwei Reformen, was Willy Brandt mit „mehr Demokratie wagen“ meinte.",
        ["Teilhabe in Politik und Gesellschaft.", "Konkrete Gesetze nennen."],
        "Brandt wollte mehr Menschen an Entscheidungen beteiligen. Die Senkung des Wahlalters auf 18 Jahre gab Jugendlichen eine Stimme bei Bundestagswahlen. Das BAföG und mehr Mitbestimmung in Betrieben sollten Chancen und Mitsprache unabhängig von Herkunft und Stellung verbessern. Demokratie sollte also nicht nur Staatsform, sondern Lebensform sein.",
        ["Reform 1", "Reform 2", "Bezug zum Leitwort"],
      ),
      2: writing(
        "Beurteile, warum der Regierungswechsel 1969 für die Demokratie der Bundesrepublik wichtig war.",
        ["Was zeigt ein friedlicher Machtwechsel?", "Vergleich mit Weimar."],
        "1969 übernahm nach zwanzig Jahren CDU-geführter Regierungen die SPD mit der FDP die Macht, und die bisherige Regierung ging friedlich in die Opposition. Das zeigte, dass Wahlen tatsächlich über die Regierung entschieden. Anders als in Weimar akzeptierten alle großen Parteien die Regeln. Der Wechsel stärkte deshalb das Vertrauen in die Demokratie.",
        ["Machtwechsel erklärt", "Bedeutung für Demokratie", "Vergleich oder Begründung"],
      ),
    },
  },
  {
    id: "g10-juedisches-leben",
    lb: 3,
    title: "Jüdisches Leben in Deutschland nach 1945",
    period: "1945 bis heute",
    intro:
      "Nach dem Holocaust schien ein jüdisches Leben in Deutschland kaum vorstellbar. Dennoch entstanden Gemeinden neu.",
    paragraphs: [
      "Nach der Befreiung lebten in Deutschland nur wenige Tausend deutsche Jüdinnen und Juden, die überlebt hatten oder zurückkehrten. Dazu kamen Zehntausende jüdische Displaced Persons aus Osteuropa, vor allem in der amerikanischen Zone und in Bayern, etwa im Lager Föhrenwald bei Wolfratshausen, das erst 1957 geschlossen wurde. Die meisten wanderten nach der Gründung Israels 1948 oder in die USA aus. Wer blieb, lebte oft „auf gepackten Koffern“.",
      "1950 gründete sich der Zentralrat der Juden in Deutschland. Die Gemeinden waren klein und überaltert. Antisemitismus verschwand nicht: 1959 beschmierten Täter die Kölner Synagoge, 1970 starben bei einem Brandanschlag auf ein jüdisches Gemeindehaus in München sieben Menschen. Die DDR hatte nur sehr kleine Gemeinden und verfolgte eine israelfeindliche Politik.",
      "Ab 1990/91 nahm Deutschland jüdische Zuwanderer aus der früheren Sowjetunion auf; die Gemeinden wuchsen deutlich. Neue Synagogen entstanden, 2006 die Hauptsynagoge Ohel Jakob in München. Zugleich bleibt jüdisches Leben bedroht: Am 9. Oktober 2019, dem Feiertag Jom Kippur, versuchte ein Rechtsextremist in die Synagoge von Halle einzudringen und tötete zwei Menschen. Viele jüdische Einrichtungen stehen unter Polizeischutz. Jüdisches Leben ist Teil der Gegenwart, nicht nur der Geschichte.",
    ],
    takeaway:
      "Nach 1945 entstand jüdisches Leben in Deutschland klein und unsicher neu, wuchs ab 1990 durch Zuwanderung und ist bis heute durch Antisemitismus bedroht.",
    sourceIds: ["lemo-dp", "zentralrat", "bpb-juedisch"],
    quiz: check(
      "Wodurch wuchsen die jüdischen Gemeinden in Deutschland ab 1990 deutlich?",
      "Durch die Zuwanderung aus der früheren Sowjetunion.",
      [
        "Durch die Rückkehr der Displaced Persons aus Israel.",
        "Durch die Zusammenlegung mit Gemeinden aus Österreich.",
      ],
      [
        "Die meisten DPs waren nach 1948 dauerhaft ausgewandert.",
        "Eine solche Zusammenlegung gab es nicht.",
      ],
      "Ab 1990/91 kamen jüdische Kontingentflüchtlinge; heute stammen viele Gemeindemitglieder aus diesen Familien.",
    ),
    workshop: timeline(
      [
        ["Jüdische Displaced Persons leben in Lagern wie Föhrenwald (ab 1945)", "Überlebende warten auf Auswanderung."],
        ["Gründung des Zentralrats der Juden (1950)", "Die Gemeinden schaffen eine gemeinsame Vertretung."],
        ["Lager Föhrenwald wird geschlossen (1957)", "Das letzte DP-Lager in Deutschland endet."],
        ["Diplomatische Beziehungen zwischen Bundesrepublik und Israel (1965)", "Ein Zeichen der Annäherung zwanzig Jahre nach dem Holocaust."],
        ["Zuwanderung aus der früheren Sowjetunion beginnt (1990/91)", "Die Gemeinden wachsen stark."],
        ["Einweihung der Hauptsynagoge Ohel Jakob in München (2006)", "Jüdisches Leben wird in der Stadtmitte sichtbar."],
        ["Anschlag auf die Synagoge in Halle (2019)", "Antisemitismus bleibt eine tödliche Bedrohung."],
      ],
      "Die Entwicklung zeigt Neubeginn und Bedrohung zugleich; beides gehört zur Geschichte jüdischen Lebens nach 1945.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum viele jüdische Überlebende nach 1945 Deutschland verließen.",
        ["Erfahrungen und Bedingungen in den Lagern.", "Neue Möglichkeiten ab 1948."],
        "Die Überlebenden hatten ihre Familien und Gemeinden durch den Holocaust verloren und lebten unter den Menschen, die die Verfolgung unterstützt oder hingenommen hatten. In den DP-Lagern warteten sie auf eine Zukunft. Mit der Gründung Israels 1948 und offeneren Einreisemöglichkeiten in die USA wanderten die meisten aus.",
        ["Verlust und Misstrauen", "Lage in den Lagern", "Neue Möglichkeiten"],
      ),
      2: writing(
        "Beurteile, warum jüdisches Leben in Deutschland heute Schutz braucht, und was die Gesellschaft dafür tun kann.",
        ["Beispiele für Antisemitismus.", "Staat und Zivilgesellschaft."],
        "Anschläge wie in Halle 2019 und antisemitische Angriffe zeigen, dass Jüdinnen und Juden bedroht sind; deshalb stehen viele Einrichtungen unter Polizeischutz. Der Staat muss Täter verfolgen und Einrichtungen schützen. Die Gesellschaft kann widersprechen, wenn Antisemitismus auftritt, und jüdisches Leben als Teil der Gegenwart kennenlernen, nicht nur als Geschichte.",
        ["Bedrohung belegt", "Aufgabe des Staates", "Aufgabe der Gesellschaft"],
      ),
    },
  },
  {
    id: "g10-deutsche-frage",
    lb: 3,
    title: "Die deutsche Frage und der Grundlagenvertrag",
    period: "1949–1990",
    intro:
      "Ob und wie Deutschland wieder eins werden könnte, hing vor allem von der Weltpolitik ab. Die Bonner Politik änderte darum ihren Weg.",
    paragraphs: [
      "Die „deutsche Frage“ fragte nach Einheit, Grenzen und Status Deutschlands. Die Präambel des Grundgesetzes forderte, „die Einheit und Freiheit Deutschlands zu vollenden“. Die Bundesrepublik beanspruchte, allein für alle Deutschen zu sprechen. Nach der Hallstein-Doktrin von 1955 brach sie Beziehungen zu Staaten ab, die die DDR anerkannten. Die DDR sprach ab den 1970er-Jahren von zwei deutschen Nationen.",
      "Mit dem Mauerbau zeigte sich, dass Einheit auf absehbare Zeit nicht erreichbar war. Willy Brandt und Egon Bahr setzten auf „Wandel durch Annäherung“: Verträge sollten Spannungen mindern und Menschen Erleichterungen bringen. Es folgten der Moskauer und der Warschauer Vertrag 1970, das Viermächteabkommen über Berlin 1971 und am 21. Dezember 1972 der Grundlagenvertrag mit der DDR. Beide Staaten vereinbarten „gutnachbarliche Beziehungen“ und Ständige Vertretungen statt Botschaften; die Bundesrepublik erkannte die DDR nicht als Ausland an. 1973 traten beide den Vereinten Nationen bei.",
      "Die bayerische Staatsregierung klagte gegen den Vertrag. Das Bundesverfassungsgericht billigte ihn 1973, betonte aber, dass das Ziel der Wiedervereinigung verbindlich bleibe. Die Ostpolitik war nur möglich, weil auch die Supermächte Entspannung suchten. Ebenso wurde die Einheit 1990 erst möglich, als sich die Sowjetunion unter Gorbatschow veränderte. Deutsch-deutsche Geschichte war immer Teil der Weltpolitik.",
    ],
    takeaway:
      "Der Grundlagenvertrag von 1972 regelte das Nebeneinander der beiden deutschen Staaten, ohne die Einheit aufzugeben; die deutsche Frage blieb von der Weltpolitik abhängig.",
    sourceIds: ["lemo-deutsche-frage", "lemo-ostpolitik", "lemo-grundlagenvertrag", "gg"],
    quiz: check(
      "Was regelte der Grundlagenvertrag von 1972?",
      "Gutnachbarliche Beziehungen und Ständige Vertretungen.",
      [
        "Die Wiedervereinigung der beiden deutschen Staaten.",
        "Den Beitritt der DDR zur NATO und zur EWG.",
      ],
      [
        "Die Einheit kam erst 1990; der Vertrag regelte das Nebeneinander.",
        "Die DDR blieb bis 1990 im Warschauer Pakt und gehörte nie zur EWG.",
      ],
      "Statt Botschaften gab es Ständige Vertretungen, weil die Bundesrepublik die DDR nicht als Ausland betrachtete.",
    ),
    workshop: timeline(
      [
        ["Grundgesetz fordert die Vollendung der Einheit (1949)", "Die Einheit ist Verfassungsauftrag."],
        ["Hallstein-Doktrin (1955)", "Bonn will die DDR international isolieren."],
        ["Mauerbau (1961)", "Die Teilung wird zementiert."],
        ["Moskauer und Warschauer Vertrag (1970)", "Die Neue Ostpolitik beginnt."],
        ["Grundlagenvertrag mit der DDR (1972)", "Beide Staaten regeln ihr Verhältnis."],
        ["Beide deutschen Staaten werden UN-Mitglieder (1973)", "Die Teilung ist international anerkannt."],
      ],
      "Die Bonner Politik wandelte sich von Isolation zu Annäherung. Das Ziel der Einheit blieb, der Weg dorthin änderte sich.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Grundsatz „Wandel durch Annäherung“ an einem Beispiel.",
        ["Wer prägte ihn?", "Was sollte sich für die Menschen ändern?"],
        "Egon Bahr und Willy Brandt wollten durch Verträge und Gespräche mit dem Osten die Lage der Menschen verbessern, statt die DDR zu isolieren. Ein Beispiel ist der Grundlagenvertrag von 1972: Er brachte Ständige Vertretungen und erleichterte Reisen und Kontakte. Langfristig sollte die Annäherung auch einen Wandel im Osten ermöglichen.",
        ["Urheber genannt", "Beispiel", "Ziel erklärt"],
      ),
      2: writing(
        "Begründe, warum es keine isolierte deutsche Nationalgeschichte zwischen 1945 und 1990 gibt.",
        ["Abhängigkeit von den Supermächten.", "Beispiele: 1949, 1961, 1972, 1990."],
        "Die Teilung 1949 folgte aus dem Konflikt zwischen USA und Sowjetunion. Der Mauerbau 1961 war nur mit sowjetischer Zustimmung möglich, die Ostpolitik nur in der Zeit der Entspannung, und die Einheit 1990 erst durch den Wandel in der Sowjetunion und die Zustimmung der Siegermächte. Deutsche Entscheidungen hingen also stets von der Weltpolitik ab.",
        ["Zwei Beispiele", "Bezug zu Supermächten", "Schlussfolgerung"],
      ),
    },
  },
];
