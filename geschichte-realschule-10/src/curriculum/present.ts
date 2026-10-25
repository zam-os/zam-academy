import type { Lesson } from "../model/types";
import { check, classify, timeline, writing } from "./helpers";

export const present: Lesson[] = [
  {
    id: "g10-weltordnung",
    lb: 5,
    title: "Die Welt nach 1990: USA, Russland, China",
    period: "1990 bis heute",
    intro:
      "Nach dem Kalten Krieg schien eine friedliche Weltordnung unter Führung der USA möglich. Heute ringen mehrere Mächte um Einfluss.",
    paragraphs: [
      "Nach dem Zerfall der Sowjetunion 1991 waren die USA die einzige Supermacht. Viele hofften, Demokratie und Marktwirtschaft würden sich weltweit durchsetzen. Die USA führten Bündnisse an, griffen aber auch militärisch ein, etwa 2003 im Irak, mit einer Begründung, die sich als falsch erwies. Ihre Rolle als „Weltpolizist“ ist im eigenen Land wie international umstritten.",
      "Russland erlebte in den 1990er-Jahren eine schwere Wirtschaftskrise und Machtverlust. Unter Wladimir Putin, Präsident seit 2000 mit kurzer Unterbrechung, wurde das Land zunehmend autoritär regiert und versuchte, verlorenen Einfluss zurückzugewinnen: 2008 im Krieg gegen Georgien, 2014 mit der Annexion der Krim und seit dem 24. Februar 2022 mit dem Angriffskrieg gegen die gesamte Ukraine.",
      "China öffnete ab 1978 unter Deng Xiaoping seine Wirtschaft, blieb aber eine Diktatur der Kommunistischen Partei; 1989 ließ die Führung die Demokratiebewegung auf dem Platz des Himmlischen Friedens blutig niederschlagen. Nach dem Beitritt zur Welthandelsorganisation 2001 wurde China zur „Werkbank der Welt“ und seit 2010 zur zweitgrößten Volkswirtschaft. Es baut seine Macht wirtschaftlich und militärisch aus, etwa mit Handelsrouten der „Neuen Seidenstraße“ und Ansprüchen auf Taiwan. Viele sprechen deshalb von einer multipolaren Welt mit mehreren Machtzentren.",
    ],
    takeaway:
      "Nach 1990 waren die USA die einzige Supermacht; heute prägen ein autoritäres Russland, das aufstrebende China und weitere Mächte eine multipolare Welt.",
    sourceIds: ["bpb-china", "bpb-russland", "lemo-welthandel"],
    quiz: check(
      "Was meint der Begriff „multipolare Welt“?",
      "Eine Weltordnung mit mehreren großen Machtzentren.",
      [
        "Eine Weltordnung, in der nur die Polarregionen umkämpft sind.",
        "Eine Weltordnung mit genau zwei Blöcken wie im Kalten Krieg.",
      ],
      [
        "„Pol“ steht hier für ein Machtzentrum, nicht für eine Region der Erde.",
        "Zwei Blöcke nennt man eine bipolare Ordnung.",
      ],
      "Neben den USA beanspruchen China, Russland und weitere Staaten Einfluss; Bündnisse sind beweglicher als im Kalten Krieg.",
    ),
    workshop: classify(
      "Welche Macht passt?",
      ["USA", "Russland", "China"],
      [
        ["Nach 1991 die einzige Supermacht mit weltweitem Bündnissystem.", 0, "Die USA führten NATO und viele Partnerschaften an."],
        ["Annexion der Krim 2014.", 1, "Russland verletzte die Grenzen der Ukraine."],
        ["Wirtschaftsreformen ab 1978 bei fortbestehender Einparteienherrschaft.", 2, "China öffnete die Wirtschaft, nicht die Politik."],
        ["Irakkrieg 2003 mit einer Begründung, die sich als falsch erwies.", 0, "Massenvernichtungswaffen wurden nicht gefunden."],
        ["Seit 2010 zweitgrößte Volkswirtschaft der Welt.", 2, "Chinas Aufstieg verschob Gewichte."],
      ],
      "Die Mächte verfolgen unterschiedliche Ziele mit unterschiedlichen Mitteln. Wer die Gegenwart verstehen will, braucht ihre Vorgeschichte.",
    ),
    tasks: {
      1: writing(
        "Erkläre, wie China zur Großmacht aufstieg.",
        ["Reformen ab 1978.", "Welthandel und Folgen."],
        "Ab 1978 öffnete China unter Deng Xiaoping seine Wirtschaft für Privatunternehmen und ausländische Investoren, während die Kommunistische Partei die Macht behielt. Mit dem Beitritt zur Welthandelsorganisation 2001 wurde es zum wichtigsten Produktionsstandort vieler Güter. Seit 2010 ist es die zweitgrößte Volkswirtschaft und baut auch seine militärische Macht aus.",
        ["Reformen", "Welthandel", "Machtausbau"],
      ),
      2: writing(
        "Beurteile die Hoffnung von 1990 auf eine friedliche Weltordnung aus heutiger Sicht.",
        ["Was trat ein, was nicht?", "Beispiele aus Russland, China, USA."],
        "Teilweise erfüllte sich die Hoffnung: Viele Staaten Osteuropas wurden Demokratien, der Welthandel wuchs. Doch Russland wurde autoritär und führt Krieg gegen die Ukraine, China blieb eine Diktatur, und auch die USA führten umstrittene Kriege. Die Hoffnung war zu optimistisch, weil Macht- und Interessengegensätze nicht verschwanden.",
        ["Erfüllte Erwartungen", "Enttäuschte Erwartungen", "Begründetes Urteil"],
      ),
    },
  },
  {
    id: "g10-uno",
    lb: 5,
    title: "Die Vereinten Nationen: Möglichkeiten und Grenzen",
    period: "1945 bis heute",
    intro:
      "Die UNO soll den Weltfrieden sichern. Ob sie das kann, hängt vom Willen ihrer Mitglieder ab.",
    paragraphs: [
      "Die Charta der Vereinten Nationen wurde am 26. Juni 1945 in San Francisco unterzeichnet und trat am 24. Oktober 1945 in Kraft. Ziel ist, „künftige Geschlechter vor der Geißel des Krieges zu bewahren“, Menschenrechte zu fördern und internationale Zusammenarbeit zu stärken. In der Generalversammlung hat jeder der heute 193 Mitgliedstaaten eine Stimme. Die beiden deutschen Staaten wurden 1973 Mitglieder.",
      "Über Krieg und Frieden entscheidet vor allem der Sicherheitsrat. Er hat 15 Mitglieder, darunter die fünf ständigen: USA, Russland, China, Frankreich und Großbritannien. Jedes ständige Mitglied kann mit seinem Veto einen Beschluss verhindern. Der Rat kann Sanktionen verhängen, Blauhelmtruppen entsenden oder militärische Gewalt erlauben. Unterorganisationen wie das Kinderhilfswerk UNICEF, die Weltgesundheitsorganisation und das Flüchtlingshilfswerk UNHCR helfen weltweit.",
      "Die Grenzen zeigten sich oft schmerzhaft. 1994 wurden in Ruanda in wenigen Monaten etwa 800.000 Menschen ermordet, ohne dass die UNO eingriff; 1995 konnten Blauhelme den Völkermord von Srebrenica nicht verhindern. Wenn ein ständiges Mitglied selbst Konfliktpartei ist, wie Russland im Krieg gegen die Ukraine, blockiert das Veto den Rat. Dennoch vermittelt die UNO in Konflikten, versorgt Millionen Menschen und schafft gemeinsame Regeln, etwa im Klimaschutz.",
    ],
    takeaway:
      "Die UNO sichert Frieden durch Regeln, Vermittlung, Blauhelme und Hilfe; das Veto der fünf ständigen Mitglieder des Sicherheitsrats begrenzt ihre Handlungsfähigkeit.",
    sourceIds: ["un-charta", "un-peacekeeping", "icty"],
    quiz: check(
      "Warum kann der UN-Sicherheitsrat oft nicht handeln, wenn eine Großmacht beteiligt ist?",
      "Jedes ständige Mitglied kann Beschlüsse mit seinem Veto verhindern.",
      [
        "Der Sicherheitsrat darf nur einmal im Jahr tagen.",
        "Die Generalversammlung muss jedem Beschluss einstimmig zustimmen.",
      ],
      [
        "Der Sicherheitsrat kann jederzeit zusammentreten.",
        "Beschlüsse des Sicherheitsrats brauchen keine Zustimmung der Generalversammlung.",
      ],
      "Das Vetorecht sollte 1945 die Großmächte einbinden; es lähmt den Rat, wenn eine von ihnen selbst Konfliktpartei ist.",
    ),
    workshop: classify(
      "Möglichkeit oder Grenze der UNO?",
      ["Möglichkeit", "Grenze"],
      [
        ["Blauhelme überwachen einen Waffenstillstand.", 0, "Friedenstruppen können Konfliktparteien trennen."],
        ["Ein Veto verhindert eine Resolution zu einem Krieg.", 1, "Großmächte können den Rat blockieren."],
        ["Das UNHCR versorgt Geflüchtete in Lagern.", 0, "Humanitäre Hilfe rettet Leben."],
        ["Die UNO hat keine eigene Armee und braucht Truppen der Mitglieder.", 1, "Sie ist auf den Willen der Staaten angewiesen."],
        ["Staaten vereinbaren in der UNO gemeinsame Klimaziele.", 0, "Die UNO schafft Foren für Regeln."],
      ],
      "Die UNO ist so stark, wie ihre Mitglieder sie handeln lassen.",
    ),
    tasks: {
      1: writing(
        "Erkläre den Aufbau des UN-Sicherheitsrats und die Bedeutung des Vetorechts.",
        ["Ständige und nichtständige Mitglieder.", "Wirkung eines Vetos."],
        "Der Sicherheitsrat hat 15 Mitglieder: fünf ständige, nämlich USA, Russland, China, Frankreich und Großbritannien, und zehn auf Zeit gewählte. Jedes ständige Mitglied kann einen Beschluss mit seinem Veto verhindern. So kann eine Großmacht Maßnahmen gegen sich selbst oder ihre Verbündeten blockieren.",
        ["Aufbau", "Veto erklärt", "Folge"],
      ),
      2: writing(
        "Beurteile an zwei Beispielen, ob die UNO den Weltfrieden sichern kann.",
        ["Ein Erfolg und ein Versagen.", "Abhängigkeit von den Mitgliedern."],
        "Die UNO hilft mit Blauhelmen, Vermittlung und humanitärer Hilfe; ihre Organisationen versorgen Millionen Menschen. In Ruanda 1994 und in Srebrenica 1995 konnte sie Völkermord jedoch nicht verhindern, und im Krieg gegen die Ukraine blockiert Russlands Veto den Sicherheitsrat. Die UNO kann Frieden fördern, sichern kann sie ihn nur, wenn die Mitglieder, vor allem die Großmächte, mitziehen.",
        ["Erfolg", "Versagen", "Abwägendes Urteil"],
      ),
    },
  },
  {
    id: "g10-jugoslawien",
    lb: 5,
    title: "Kriege im zerfallenden Jugoslawien",
    period: "1991–1999",
    intro:
      "Mitten in Europa führte der Zerfall eines Vielvölkerstaates zu Kriegen, Vertreibungen und Völkermord.",
    paragraphs: [
      "Jugoslawien war nach 1945 ein sozialistischer Bundesstaat aus sechs Republiken, in dem Serben, Kroaten, Bosniaken, Slowenen, Albaner und andere Gruppen lebten. Der Staatschef Tito hielt den Staat mit einer eigenen Form des Kommunismus zusammen. Nach seinem Tod 1980 verschärften Wirtschaftskrise und Nationalismus die Gegensätze; Politiker wie Slobodan Milošević in Serbien nutzten ihn, um Macht zu gewinnen.",
      "1991 erklärten Slowenien und Kroatien ihre Unabhängigkeit, es folgten Kriege. In Bosnien-Herzegowina, wo Bosniaken, Serben und Kroaten gemischt lebten, kämpften ab 1992 Armeen und Milizen um Gebiete; „ethnische Säuberungen“ vertrieben Menschen, Sarajevo wurde fast vier Jahre belagert. Im Juli 1995 ermordeten bosnisch-serbische Truppen in Srebrenica rund 8.000 bosniakische Männer und Jungen; internationale Gerichte haben dies als Völkermord eingestuft. Das Abkommen von Dayton beendete Ende 1995 den Krieg.",
      "1998/99 eskalierte der Konflikt im Kosovo zwischen serbischen Kräften und der albanischen Mehrheit. Die NATO bombardierte 1999 ohne Mandat des UN-Sicherheitsrats Ziele in Serbien, auch mit deutscher Beteiligung. Ein Internationaler Strafgerichtshof in Den Haag klagte Verantwortliche an. Deutschland nahm Hunderttausende Geflüchtete auf. Die Kriege zeigten, wie schwer ein friedliches Zusammenleben unterschiedlicher Ethnien und Religionen wird, wenn Politiker Hass schüren.",
    ],
    takeaway:
      "Nationalismus beim Zerfall Jugoslawiens führte in den 1990er-Jahren zu Kriegen, Vertreibungen und dem Völkermord von Srebrenica; Europa und die UNO reagierten spät.",
    sourceIds: ["icty", "lemo-kosovo", "bpb-kriege"],
    quiz: check(
      "Was geschah im Juli 1995 in Srebrenica?",
      "Bosnisch-serbische Truppen ermordeten rund 8.000 bosniakische Männer und Jungen.",
      [
        "Das Friedensabkommen für Bosnien-Herzegowina wurde dort unterzeichnet.",
        "Slowenien und Kroatien erklärten dort ihre Unabhängigkeit.",
      ],
      [
        "Das Abkommen von Dayton folgte Ende 1995.",
        "Slowenien erklärte sich bereits 1991 unabhängig.",
      ],
      "Internationale Gerichte stuften das Massaker als Völkermord ein. Niederländische Blauhelme in der UN-Schutzzone konnten es nicht verhindern.",
    ),
    workshop: timeline(
      [
        ["Tod Titos (1980)", "Der Zusammenhalt des Staates schwindet."],
        ["Unabhängigkeitserklärungen Sloweniens und Kroatiens (1991)", "Der Zerfall beginnt mit Krieg."],
        ["Beginn des Krieges in Bosnien-Herzegowina (1992)", "Vertreibung und Belagerung Sarajevos."],
        ["Völkermord von Srebrenica (Juli 1995)", "Das schlimmste Verbrechen in Europa seit 1945."],
        ["Abkommen von Dayton (1995)", "Der Bosnienkrieg endet."],
        ["Kosovo-Krieg und NATO-Luftangriffe (1999)", "Erstmals kämpfen deutsche Soldaten im Ausland."],
      ],
      "Die Kriege folgten aufeinander und hatten gemeinsame Ursachen: Machtpolitik mit Nationalismus in einem zerfallenden Staat.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum Jugoslawien nach 1980 zerfiel.",
        ["Rolle Titos.", "Wirtschaft und Nationalismus."],
        "Tito hatte den Vielvölkerstaat mit seiner Autorität und einer gemeinsamen sozialistischen Ideologie zusammengehalten. Nach seinem Tod fehlte diese Klammer, eine Wirtschaftskrise verschärfte die Konflikte zwischen den Republiken. Politiker wie Milošević setzten auf Nationalismus, um Macht zu gewinnen, und andere Republiken strebten nach Unabhängigkeit.",
        ["Rolle Titos", "Wirtschaftskrise", "Nationalismus"],
      ),
      2: writing(
        "Diskutiere, ob der NATO-Einsatz 1999 ohne UN-Mandat gerechtfertigt war.",
        ["Schutz der Bevölkerung.", "Völkerrecht und Sicherheitsrat."],
        "Befürworter verwiesen auf Vertreibungen und Morde an der albanischen Bevölkerung und auf die Lehre aus Srebrenica, nicht erneut zuzusehen. Kritiker betonten, dass das Völkerrecht einen Beschluss des Sicherheitsrats verlangt, den Russland und China blockierten. Ich halte den Einsatz für politisch nachvollziehbar, aber völkerrechtlich problematisch, weil er einen Präzedenzfall schuf.",
        ["Pro-Argument", "Contra-Argument", "Eigenes Urteil"],
      ),
    },
  },
  {
    id: "g10-nahost-wurzeln",
    lb: 5,
    title: "Nahostkonflikt: Wurzeln und Staatsgründung Israels",
    period: "1897–1949",
    intro:
      "Zwei Völker erheben Anspruch auf dasselbe Land. Die Wurzeln des Konflikts reichen in die Zeit vor dem Ersten Weltkrieg zurück.",
    paragraphs: [
      "Ende des 19. Jahrhunderts entstand als Antwort auf Antisemitismus in Europa der Zionismus: Theodor Herzl forderte einen Staat für das jüdische Volk, der erste Zionistenkongress tagte 1897 in Basel. Jüdische Einwanderer zogen nach Palästina, damals Teil des Osmanischen Reiches, in dem eine arabische Bevölkerungsmehrheit lebte. Auch arabische Nationalbewegungen strebten nach Unabhängigkeit.",
      "Im Ersten Weltkrieg machte Großbritannien widersprüchliche Zusagen: Arabischen Führern stellte es Unabhängigkeit in Aussicht, in der Balfour-Erklärung von 1917 unterstützte es eine „nationale Heimstätte für das jüdische Volk“ in Palästina, ohne die Rechte der nichtjüdischen Bevölkerung zu beeinträchtigen. Ab 1920 verwaltete Großbritannien Palästina als Mandat. Mit der Einwanderung, verstärkt durch die Verfolgung in NS-Deutschland, wuchsen Spannungen und Gewalt zwischen jüdischer und arabischer Bevölkerung.",
      "Nach dem Holocaust beschloss die UN-Generalversammlung am 29. November 1947 einen Teilungsplan: einen jüdischen und einen arabischen Staat, Jerusalem unter internationaler Verwaltung. Die jüdische Seite stimmte zu, die arabischen Staaten und Vertreter der arabischen Palästinenser lehnten ab. Am 14. Mai 1948 rief David Ben-Gurion den Staat Israel aus; am nächsten Tag griffen arabische Staaten an. Israel behauptete sich und kontrollierte am Ende mehr Gebiet als im Teilungsplan. Rund 700.000 arabische Palästinenser flohen oder wurden vertrieben, für sie ist dies die „Nakba“ (Katastrophe). In den folgenden Jahren verließen auch Hunderttausende Juden arabische Länder, viele gingen nach Israel.",
    ],
    takeaway:
      "Zionismus, arabische Nationalbewegung und britische Mandatspolitik bilden die Wurzeln des Nahostkonflikts; mit der Staatsgründung Israels am 14. Mai 1948 und dem folgenden Krieg entstanden Fluchtbewegungen auf beiden Seiten.",
    sourceIds: ["bpb-israel", "un-charta"],
    quiz: check(
      "Was beschloss die UN-Generalversammlung am 29. November 1947 für Palästina?",
      "Einen Teilungsplan mit einem jüdischen und einem arabischen Staat.",
      [
        "Die Gründung eines gemeinsamen arabischen Staates für ganz Palästina.",
        "Die dauerhafte Fortsetzung des britischen Mandats.",
      ],
      [
        "Der Plan sah zwei Staaten vor; die arabischen Staaten lehnten ihn ab.",
        "Großbritannien gab das Mandat 1948 auf.",
      ],
      "Jerusalem sollte international verwaltet werden. Die jüdische Seite stimmte zu, die arabische lehnte ab; auf die Staatsgründung Israels folgte Krieg.",
    ),
    workshop: timeline(
      [
        ["Erster Zionistenkongress in Basel (1897)", "Die Forderung nach einem jüdischen Staat wird organisiert."],
        ["Balfour-Erklärung Großbritanniens (1917)", "Unterstützung für eine jüdische Heimstätte in Palästina."],
        ["Britisches Mandat über Palästina (ab 1920)", "Großbritannien verwaltet das Gebiet."],
        ["UN-Teilungsplan (29. November 1947)", "Zwei Staaten sollen entstehen."],
        ["Ausrufung des Staates Israel (14. Mai 1948)", "Arabische Staaten greifen an."],
        ["Waffenstillstände nach dem Krieg (1949)", "Israel behauptet sich; Hunderttausende Palästinenser sind geflüchtet oder vertrieben."],
      ],
      "Jedes Ereignis wird von Israelis und Palästinensern unterschiedlich erinnert. Das Datum 1948 steht für Unabhängigkeit und für Nakba.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum die britischen Zusagen im Ersten Weltkrieg den Konflikt verschärften.",
        ["Zusagen an arabische Führer.", "Balfour-Erklärung."],
        "Großbritannien stellte arabischen Führern für ihre Unterstützung gegen das Osmanische Reich Unabhängigkeit in Aussicht. Zugleich versprach es mit der Balfour-Erklärung eine nationale Heimstätte für das jüdische Volk in Palästina. Beide Seiten fühlten sich auf dasselbe Land verwiesen, sodass Enttäuschung und Konflikte vorprogrammiert waren.",
        ["Zusage 1", "Zusage 2", "Widerspruch erklärt"],
      ),
      2: writing(
        "Erkläre, warum Israelis und Palästinenser das Jahr 1948 so unterschiedlich erinnern.",
        ["Unabhängigkeit und Nakba.", "Erfahrungen beider Seiten."],
        "Für Israelis bedeutet 1948 die Gründung eines eigenen, sicheren Staates nach dem Holocaust und den Sieg in einem Krieg, in dem ihre Existenz bedroht war. Für Palästinenser bedeutet es Flucht und Vertreibung von rund 700.000 Menschen und den Verlust ihrer Heimat, die Nakba. Beide Erinnerungen beziehen sich auf reale Erfahrungen; wer den Konflikt verstehen will, muss beide kennen.",
        ["Israelische Sicht", "Palästinensische Sicht", "Folgerung"],
      ),
    },
  },
  {
    id: "g10-nahost-seit-1967",
    lb: 5,
    title: "Nahostkonflikt: Kriege, Frieden und Gewalt seit 1967",
    period: "1967 bis heute",
    intro:
      "Kriege, Besatzung, Terror und Friedensabkommen wechselten sich ab. Eine dauerhafte Lösung gibt es bis heute nicht.",
    paragraphs: [
      "Im Sechstagekrieg 1967 eroberte Israel das Westjordanland, Ost-Jerusalem, den Gazastreifen, die Sinai-Halbinsel und die Golanhöhen. Seitdem leben Millionen Palästinenser unter israelischer Besatzung oder Kontrolle; Israel baute Siedlungen in den besetzten Gebieten, die nach Auffassung der UNO gegen das Völkerrecht verstoßen. Die PLO unter Jassir Arafat kämpfte auch mit Terror; 1972 ermordeten palästinensische Terroristen bei den Olympischen Spielen in München elf israelische Sportler.",
      "Nach dem Jom-Kippur-Krieg 1973 schloss Ägypten 1979 Frieden mit Israel und erhielt den Sinai zurück; 1994 folgte Jordanien. Mit den Oslo-Abkommen ab 1993 erkannten Israel und die PLO einander an, eine palästinensische Selbstverwaltung entstand. Die Hoffnung zerbrach: 1995 ermordete ein israelischer Extremist Ministerpräsident Jitzchak Rabin, die zweite Intifada ab 2000 brachte Selbstmordanschläge und harte militärische Antworten. 2007 übernahm die islamistische Hamas, die Israels Existenzrecht bestreitet, die Macht im Gazastreifen.",
      "Am 7. Oktober 2023 überfielen Terroristen der Hamas Israel, ermordeten rund 1.200 Menschen und verschleppten etwa 250 Geiseln; es war der tödlichste Tag für Jüdinnen und Juden seit dem Holocaust. Israel antwortete mit einem Krieg im Gazastreifen, in dem Zehntausende Menschen starben und eine humanitäre Katastrophe entstand. Für Deutschland gilt aus seiner Geschichte eine besondere Verantwortung für die Sicherheit Israels; zugleich verlangt es die Einhaltung des humanitären Völkerrechts und unterstützt eine Zweistaatenlösung. Der Stand dieser Lektion ist Oktober 2026: Informiere dich über aktuelle Entwicklungen in verlässlichen Medien.",
    ],
    takeaway:
      "Seit 1967 prägen Besatzung, Siedlungsbau, Terror und Kriege, aber auch Friedensverträge und die Oslo-Abkommen den Nahostkonflikt; eine Zweistaatenlösung ist bis heute nicht erreicht.",
    sourceIds: ["bpb-israel", "un-peacekeeping"],
    quiz: check(
      "Was vereinbarten Israel und die PLO in den Oslo-Abkommen ab 1993?",
      "Gegenseitige Anerkennung und eine palästinensische Selbstverwaltung.",
      [
        "Die Gründung eines gemeinsamen Staates ohne Grenzen.",
        "Die Rückgabe des Sinai an Ägypten.",
      ],
      [
        "Ein gemeinsamer Staat war nicht Gegenstand der Abkommen.",
        "Den Sinai gab Israel nach dem Friedensvertrag mit Ägypten von 1979 zurück.",
      ],
      "Oslo weckte große Hoffnungen auf Frieden. Ungeklärte Fragen wie Grenzen, Jerusalem, Siedlungen und Flüchtlinge blieben aber offen.",
    ),
    workshop: timeline(
      [
        ["Sechstagekrieg (1967)", "Israel erobert Westjordanland, Gaza, Ost-Jerusalem, Sinai und Golan."],
        ["Olympia-Attentat in München (1972)", "Elf israelische Sportler werden ermordet."],
        ["Friedensvertrag Israel–Ägypten (1979)", "Der Sinai wird zurückgegeben."],
        ["Oslo-Abkommen (1993)", "Gegenseitige Anerkennung von Israel und PLO."],
        ["Ermordung Jitzchak Rabins (1995)", "Ein Gegner des Friedensprozesses tötet den Ministerpräsidenten."],
        ["Hamas übernimmt die Macht im Gazastreifen (2007)", "Die palästinensischen Gebiete sind politisch gespalten."],
        ["Terrorangriff der Hamas auf Israel und Krieg in Gaza (ab Oktober 2023)", "Eine neue Eskalation mit Zehntausenden Toten."],
      ],
      "Phasen der Annäherung und der Gewalt folgten aufeinander. Ungelöste Kernfragen führten immer wieder zu neuen Konflikten.",
    ),
    tasks: {
      1: writing(
        "Nenne die Kernfragen, an denen Friedensverhandlungen im Nahostkonflikt bisher scheiterten.",
        ["Land und Grenzen.", "Jerusalem, Siedlungen, Flüchtlinge, Sicherheit."],
        "Strittig sind die Grenzen eines palästinensischen Staates und die israelischen Siedlungen im Westjordanland. Beide Seiten beanspruchen Jerusalem als Hauptstadt. Palästinenser fordern ein Rückkehrrecht für Flüchtlinge, Israel fordert Sicherheit vor Terror und die Anerkennung als jüdischer Staat. Extremisten auf beiden Seiten lehnen Kompromisse ab.",
        ["Mindestens drei Kernfragen", "Beide Seiten berücksichtigt", "Rolle der Extremisten"],
      ),
      2: writing(
        "Beurteile, welche Verantwortung Deutschland im Nahostkonflikt hat.",
        ["Geschichte und Sicherheit Israels.", "Humanitäres Völkerrecht und Zweistaatenlösung."],
        "Aus dem Holocaust ergibt sich für Deutschland eine besondere Verantwortung für das Existenzrecht und die Sicherheit Israels und für den Kampf gegen Antisemitismus. Zugleich ist Deutschland den Menschenrechten verpflichtet und muss das Leid der palästinensischen Zivilbevölkerung ernst nehmen. Ich meine, Deutschland sollte Israel schützen, humanitäre Hilfe leisten und Verhandlungen über zwei Staaten unterstützen.",
        ["Historische Verantwortung", "Menschenrechte/Zivilbevölkerung", "Eigenes Urteil"],
      ),
    },
  },
  {
    id: "g10-terror-9-11",
    lb: 5,
    title: "11. September 2001 und der moderne Terrorismus",
    period: "2001 bis heute",
    intro:
      "Die Anschläge von New York und Washington veränderten die Weltpolitik und unseren Alltag.",
    paragraphs: [
      "Am 11. September 2001 entführten 19 Terroristen des islamistischen Netzwerks al-Qaida vier Passagierflugzeuge. Zwei steuerten sie in die Türme des World Trade Centers in New York, eines ins Pentagon bei Washington; das vierte stürzte in Pennsylvania ab, nachdem Passagiere sich gewehrt hatten. Fast 3000 Menschen starben. Mehrere Attentäter hatten zuvor in Hamburg gelebt und studiert.",
      "Die NATO rief zum ersten Mal den Bündnisfall aus. Die USA und Verbündete stürzten im Herbst 2001 das Taliban-Regime in Afghanistan, das al-Qaida beherbergte; 2003 folgte der umstrittene Irakkrieg. Im „Krieg gegen den Terror“ kam es auch zu Folter und Gefangenenlagern wie Guantánamo. 2021 übernahmen die Taliban nach dem Abzug der westlichen Truppen erneut die Macht in Afghanistan.",
      "Moderner Terrorismus will durch Schrecken politische Ziele erreichen und trifft bewusst Unbeteiligte. In Europa verübten Islamisten Anschläge, etwa 2015 in Paris und 2016 auf dem Berliner Breitscheidplatz. Auch Rechtsextremisten töteten Menschen, etwa die Terrorgruppe NSU und die Attentäter von Halle 2019 und Hanau 2020. Staaten reagierten mit Sicherheitsgesetzen, Kontrollen an Flughäfen und mehr Überwachung. Seitdem wird darüber gestritten, wie viel Freiheit für Sicherheit eingeschränkt werden darf.",
    ],
    takeaway:
      "Der 11. September 2001 führte zu Kriegen in Afghanistan und Irak und zu mehr Sicherheitsmaßnahmen; Terror unterschiedlicher Richtungen bedroht Staat und Gesellschaft bis heute.",
    sourceIds: ["lemo-911", "lemo-afghanistan", "lemo-sicherheitsgesetze", "lemo-rechtsextremismus"],
    quiz: check(
      "Wie reagierte die NATO auf die Anschläge vom 11. September 2001?",
      "Sie rief zum ersten Mal in ihrer Geschichte den Bündnisfall aus.",
      [
        "Sie löste sich auf, weil sie Terror nicht verhindert hatte.",
        "Sie beschloss, nur noch mit der UNO gemeinsam zu tagen.",
      ],
      [
        "Die NATO besteht weiter; sie erklärte die Anschläge zum Angriff auf alle Mitglieder.",
        "Eine solche Regel gibt es nicht.",
      ],
      "Ein Angriff auf ein Mitglied galt als Angriff auf alle. Danach begann der Einsatz in Afghanistan.",
    ),
    workshop: classify(
      "Folgen des 11. September",
      ["Weltpolitik", "Alltag und Sicherheit", "Gesellschaftliche Debatte"],
      [
        ["Die USA und Verbündete greifen das Taliban-Regime in Afghanistan an.", 0, "Militärische Antwort auf al-Qaida."],
        ["Flüssigkeiten im Handgepäck werden an Flughäfen begrenzt.", 1, "Kontrollen veränderten das Reisen."],
        ["Darf der Staat für mehr Sicherheit mehr Daten speichern?", 2, "Freiheit und Sicherheit müssen abgewogen werden."],
        ["Der Irakkrieg 2003 spaltet die westlichen Verbündeten.", 0, "Deutschland und Frankreich lehnten ihn ab."],
        ["Videoüberwachung an Bahnhöfen nimmt zu.", 1, "Sicherheitsmaßnahmen wurden sichtbar."],
      ],
      "Ein Ereignis wirkte auf Weltpolitik, Alltag und Grundrechtsdebatten. Wer eigene Erfahrungen einbezieht, sieht diese Folgen bis heute.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum Terrorismus bewusst Unbeteiligte trifft.",
        ["Ziel: Schrecken und Aufmerksamkeit.", "Wirkung auf Staat und Gesellschaft."],
        "Terroristen wollen mit möglichst großem Schrecken Aufmerksamkeit für ihre Ziele erzeugen. Indem sie Unbeteiligte töten, soll jeder sich bedroht fühlen. Der Staat soll provoziert werden, überzureagieren, und die Gesellschaft soll gespalten werden. Darum ist Terror eine Bedrohung für Leben und für das Zusammenleben in Freiheit.",
        ["Ziel", "Wirkung auf Menschen", "Wirkung auf Staat/Gesellschaft"],
      ),
      2: writing(
        "Erörtere, wie viel Freiheit eine Demokratie für Schutz vor Terror einschränken darf.",
        ["Beispiele für Sicherheitsmaßnahmen.", "Grundrechte und Verhältnismäßigkeit."],
        "Kontrollen an Flughäfen und gezielte Ermittlungen schützen Leben und schränken Freiheit nur wenig ein. Massenhafte Überwachung aller Menschen dagegen greift tief in Grundrechte ein und trifft vor allem Unschuldige. Ich meine, Maßnahmen müssen verhältnismäßig, befristet und von Gerichten kontrolliert sein. Sonst erreichen Terroristen ihr Ziel, die freie Gesellschaft zu verändern.",
        ["Maßnahme mit geringem Eingriff", "Maßnahme mit starkem Eingriff", "Kriterium für das Urteil"],
      ),
    },
  },
  {
    id: "g10-globalisierung",
    lb: 5,
    title: "Globalisierung: Chancen und Risiken",
    period: "seit den 1990er-Jahren",
    intro:
      "Waren, Geld, Informationen und Menschen bewegen sich heute schneller um die Welt als je zuvor. Das verbindet und macht verwundbar.",
    paragraphs: [
      "Globalisierung meint die zunehmende weltweite Verflechtung von Wirtschaft, Politik, Kommunikation und Kultur. Es gab sie in Ansätzen schon früher, etwa durch Kolonialhandel und Industrialisierung. Nach 1990 beschleunigte sie sich: Der Ostblock öffnete sich, China und Indien wurden Teil des Weltmarkts, Container und Internet senkten Kosten, 1995 entstand die Welthandelsorganisation.",
      "Die Globalisierung brachte vielen Menschen Wohlstand. Waren wurden billiger, der Anteil der Menschen in extremer Armut sank weltweit stark, Austausch und Reisen nahmen zu. Zugleich wanderten Arbeitsplätze in Länder mit niedrigeren Löhnen, Umwelt und Klima wurden belastet, und Krisen verbreiteten sich schnell: Die Finanzkrise 2008 begann in den USA und traf die ganze Welt, die Corona-Pandemie 2020 unterbrach Lieferketten.",
      "Der russische Angriff auf die Ukraine zeigte 2022, wie riskant Abhängigkeit sein kann, etwa von russischem Gas. Viele Staaten wollen ihre Lieferketten breiter aufstellen. Neue Herausforderungen wie Klimawandel, Migration und Terrorismus kann kein Staat allein lösen. Globalisierung ist deshalb kein Schicksal, sondern wird durch politische Entscheidungen gestaltet.",
    ],
    takeaway:
      "Globalisierung verflicht die Welt wirtschaftlich, politisch und kulturell; sie bringt Wohlstand und Austausch, aber auch Abhängigkeiten und weltweite Krisen.",
    sourceIds: ["lemo-welthandel", "lemo-finanzkrise", "lemo-zuwanderer"],
    quiz: check(
      "Was zeigte die Finanzkrise 2008 über die Globalisierung?",
      "Dass sich Krisen in einer verflochtenen Welt schnell weltweit ausbreiten.",
      [
        "Dass der Welthandel seit 2008 vollständig eingestellt wurde.",
        "Dass Banken nur in ihrem eigenen Land tätig sind.",
      ],
      [
        "Der Welthandel ging zurück, wuchs danach aber wieder.",
        "Gerade weil Banken weltweit verflochten waren, breitete sich die Krise aus.",
      ],
      "Die Krise begann am Immobilienmarkt der USA und erfasste über Banken und Handel viele Länder, auch Deutschland.",
    ),
    workshop: classify(
      "Chance oder Risiko?",
      ["Chance", "Risiko"],
      [
        ["Smartphones werden in vielen Ländern gemeinsam produziert und günstig verkauft.", 0, "Arbeitsteilung senkt Preise."],
        ["Eine Fabrik schließt, weil die Produktion ins Ausland verlagert wird.", 1, "Wettbewerb kann Arbeitsplätze kosten."],
        ["Jugendliche können über das Internet mit Menschen weltweit lernen.", 0, "Kommunikation verbindet."],
        ["Ein Lieferstopp aus einem Land legt Fabriken in Europa lahm.", 1, "Abhängigkeit macht verwundbar."],
        ["Der Anteil der Menschen in extremer Armut sinkt weltweit.", 0, "Wachstum hat vielen Menschen genützt."],
      ],
      "Chancen und Risiken treffen Menschen unterschiedlich. Eine Bilanz hängt davon ab, wessen Perspektive man einnimmt.",
    ),
    tasks: {
      1: writing(
        "Erkläre, warum sich die Globalisierung nach 1990 beschleunigte.",
        ["Politische Veränderungen.", "Technik."],
        "Mit dem Ende des Ostblocks öffneten sich neue Märkte, und Staaten wie China wurden Teil des Welthandels. Container machten Transporte billig, das Internet ermöglichte schnelle Kommunikation weltweit. Die Welthandelsorganisation baute Handelshemmnisse ab. So wuchsen Handel und Verflechtung stark.",
        ["Politischer Grund", "Technischer Grund", "Folge"],
      ),
      2: writing(
        "Beurteile die Globalisierung aus zwei unterschiedlichen Perspektiven.",
        ["Zum Beispiel Arbeiterin in Europa und Arbeiter in Asien.", "Gewinne und Verluste."],
        "Für eine Fabrikarbeiterin in Deutschland, deren Arbeitsplatz verlagert wurde, bedeutet Globalisierung vor allem Unsicherheit. Für einen Arbeiter in China, der vom Land in eine Fabrikstadt zog, brachte sie höhere Einkommen, aber oft harte Arbeitsbedingungen. Die Globalisierung hat also Gewinner und Verlierer; ihre Bilanz hängt davon ab, wie Politik sie gestaltet.",
        ["Perspektive 1", "Perspektive 2", "Abgewogenes Urteil"],
      ),
    },
  },
  {
    id: "g10-aktuelle-konflikte",
    lb: 5,
    title: "Einen aktuellen Konflikt historisch erklären: Ukraine",
    period: "1991 bis heute · Stand Oktober 2026",
    intro:
      "Aktuelle Kriege haben eine Vorgeschichte. Wer sie kennt, kann Nachrichten einordnen und Strategien beurteilen.",
    paragraphs: [
      "Ein aktueller Konflikt lässt sich in Schritten untersuchen: historische Ursachen, beteiligte Akteure und ihre Interessen, Verlauf, humanitäre Folgen, Lösungsversuche und die Rolle internationaler Organisationen. Trenne dabei belegte Fakten von Propaganda und Meinungen und nutze mehrere verlässliche Quellen.",
      "Die Ukraine war Teil der Sowjetunion; in der Hungersnot von 1932/33 starben dort Millionen Menschen. Am 1. Dezember 1991 stimmten über 90 Prozent der Wählerinnen und Wähler für die Unabhängigkeit. 1994 gab die Ukraine im Budapester Memorandum die sowjetischen Atomwaffen auf ihrem Gebiet ab, Russland, die USA und Großbritannien sicherten ihre Grenzen zu. Nach Protesten für eine Annäherung an die EU, dem „Euromaidan“ 2013/14, besetzte und annektierte Russland 2014 die Krim und unterstützte Separatisten im Donbass.",
      "Am 24. Februar 2022 begann Russland einen Angriffskrieg gegen die gesamte Ukraine. Die UN-Generalversammlung verurteilte ihn mit großer Mehrheit, der Sicherheitsrat war durch Russlands Veto blockiert. Viele Tausend Zivilisten und eine weit größere Zahl von Soldaten wurden getötet, Städte zerstört; Millionen Menschen flohen, über eine Million davon nach Deutschland. Die russische Führung bestreitet eine eigenständige ukrainische Nation; die Ukraine verteidigt ihre Unabhängigkeit mit westlicher Unterstützung. Diese Lektion hat den Stand Oktober 2026. Prüfe den aktuellen Verlauf in seriösen Nachrichten und vergleiche, wie verschiedene Akteure über den Krieg berichten.",
    ],
    takeaway:
      "Aktuelle Konflikte erklärt man über Ursachen, Akteure, Interessen, Verlauf, Folgen und Lösungsversuche; Russlands Krieg gegen die Ukraine hat eine Vorgeschichte seit 1991.",
    sourceIds: ["bpb-ukraine", "bpb-russland", "un-charta"],
    quiz: check(
      "Was sicherte das Budapester Memorandum von 1994 der Ukraine zu?",
      "Die Achtung ihrer Grenzen als Gegenleistung für ihre Atomwaffen.",
      [
        "Die sofortige Aufnahme in die NATO und in die EU.",
        "Die Rückgabe der Krim an Russland gegen Gaslieferungen.",
      ],
      [
        "Eine NATO-Mitgliedschaft war nicht Teil des Memorandums.",
        "Die Krim gehörte zur Ukraine; das Memorandum sicherte gerade ihre Grenzen zu.",
      ],
      "Russland, die USA und Großbritannien gaben Sicherheitszusicherungen. Die Annexion der Krim 2014 brach diese Zusage.",
    ),
    workshop: classify(
      "Einen Konflikt untersuchen: Was gehört wohin?",
      ["Historische Ursache", "Akteur und Interesse", "Folge", "Lösungsversuch"],
      [
        ["Die Ukraine erklärt sich 1991 nach dem Zerfall der Sowjetunion unabhängig.", 0, "Die staatliche Eigenständigkeit ist der Ausgangspunkt."],
        ["Die russische Führung will die Ukraine wieder unter ihren Einfluss bringen.", 1, "Machtinteressen erklären das Handeln."],
        ["Millionen Menschen fliehen ins Ausland.", 2, "Humanitäre Folge des Krieges."],
        ["Staaten verhandeln über Waffenruhen und Gefangenenaustausch.", 3, "Diplomatische Schritte suchen Auswege."],
        ["Die Ukraine will sich der EU annähern.", 1, "Auch die Ukraine verfolgt Ziele."],
      ],
      "Mit diesen Kategorien kannst du auch andere Konflikte der Gegenwart untersuchen, etwa im Sudan oder im Nahen Osten.",
    ),
    tasks: {
      1: writing(
        "Erkläre zwei historische Hintergründe des russischen Kriegs gegen die Ukraine.",
        ["1991 und 1994.", "2014."],
        "Seit 1991 ist die Ukraine ein unabhängiger Staat, was die Bevölkerung mit großer Mehrheit beschlossen hatte. 1994 gab sie im Budapester Memorandum ihre Atomwaffen ab und erhielt dafür Zusicherungen für ihre Grenzen. 2014 brach Russland diese Zusage, annektierte die Krim und unterstützte Separatisten im Donbass. Der Angriff 2022 setzte diese Entwicklung fort.",
        ["Hintergrund 1", "Hintergrund 2", "Verbindung zu 2022"],
      ),
      2: writing(
        "Beurteile Möglichkeiten und Grenzen internationaler Organisationen in diesem Krieg.",
        ["UNO, EU, NATO.", "Veto, Hilfe, Sanktionen."],
        "Die UN-Generalversammlung verurteilte den Angriff, und UN-Organisationen helfen Geflüchteten, doch der Sicherheitsrat ist durch Russlands Veto blockiert. Die EU verhängte Sanktionen und unterstützt die Ukraine wirtschaftlich, die NATO stärkte den Schutz ihrer Mitglieder, ohne selbst Kriegspartei zu werden. Internationale Organisationen können Folgen mildern und Druck ausüben, den Krieg beenden können sie nur mit den Konfliktparteien.",
        ["Möglichkeiten", "Grenzen", "Urteil"],
      ),
    },
  },
];
