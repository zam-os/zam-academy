import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 6: Von der Antike zum Frühmittelalter. */
export const middleAges: Lesson[] = [
  {
    id: "g6-untergang-roms",
    lb: 6,
    title: "Warum zerfiel das Weströmische Reich?",
    period: "Spätantike · 3. Jahrhundert bis 476 n. Chr.",
    span: [235, 476],
    intro:
      "476 n. Chr. setzte ein germanischer Heerführer den letzten weströmischen Kaiser ab. Das Ende hatte viele Ursachen, und manches lebte weiter.",
    paragraphs: [
      "Schon im 3. Jahrhundert n. Chr. geriet das Reich in eine Krise. In rund 50 Jahren riefen Soldaten mehr als zwanzig Kaiser aus, die sich gegenseitig bekämpften. Das Geld verlor an Wert, die Steuern stiegen, Seuchen und Missernten schwächten die Bevölkerung. Das riesige Reich war schwer zu verteidigen. 395 n. Chr. wurde es endgültig in ein Westreich mit Rom und ein Ostreich mit der Hauptstadt Konstantinopel geteilt. Das sind innere Ursachen.",
      "Hinzu kamen äußere Ursachen: Germanische Gruppen drängten über Rhein und Donau ins Reich. Um 375 n. Chr. zogen die Hunnen aus Asien nach Westen und lösten weitere Wanderungen aus; man spricht von der „Völkerwanderung“. Rom nahm Gruppen als Verbündete auf, verlor aber die Kontrolle. 410 n. Chr. plünderten Westgoten unter Alarich die Stadt Rom, 455 n. Chr. die Vandalen. 476 n. Chr. setzte der Heerführer Odoaker den jungen Kaiser Romulus Augustulus ab. Mit diesem Jahr lassen viele das Mittelalter beginnen. Das Oströmische Reich bestand noch fast tausend Jahre bis 1453.",
      "Nicht alles endete 476. Vieles blieb: Großgrundbesitzer mit abhängigen Bauern, die Städte mit ihren Bischöfen, die lateinische Sprache, römisches Recht und das Christentum. Die neuen germanischen Könige übernahmen römische Verwaltung und beriefen sich auf den Kaiser in Konstantinopel. Historiker sprechen deshalb von Kontinuität und Wandel: Auch ein Neuanfang trägt viel vom Alten in sich.",
    ],
    takeaway:
      "Innere Krisen wie Kaiserwechsel, Geldentwertung und Reichsteilung und äußerer Druck durch Germanen und Hunnen führten 476 n. Chr. zum Ende Westroms. Sprache, Recht, Kirche und Grundbesitz blieben.",
    sourceIds: ["pw-rom", "lehrplan"],
    quiz: check(
      "Welche Ursache für das Ende Westroms ist eine innere Ursache?",
      "Häufige Kaiserwechsel und Bürgerkriege im Reich.",
      ["Der Zug der Hunnen aus Asien nach Westen.", "Die Plünderung Roms durch die Westgoten."],
      [
        "Die Hunnen kamen von außen; ihr Zug ist eine äußere Ursache.",
        "Die Westgoten drangen von außen ein; auch das ist eine äußere Ursache.",
      ],
      "Innere Ursachen liegen im Reich selbst: Machtkämpfe, Geldprobleme, hohe Steuern und die Größe des Reiches.",
    ),
    diagram: {
      kind: "compare",
      title: "Ursachen für das Ende Westroms",
      columns: ["Innere Ursachen", "Äußere Ursachen"],
      rows: [
        { aspect: "Herrschaft", values: ["viele Soldatenkaiser, Bürgerkriege", "germanische Heerführer gewinnen Macht"] },
        { aspect: "Wirtschaft", values: ["Geldentwertung, hohe Steuern", "Plünderungen 410 und 455"] },
        { aspect: "Grenzen", values: ["Reich zu groß, Teilung 395", "Druck auf Rhein und Donau, Hunnen ab 375"] },
      ],
      caption: "Erst das Zusammenwirken innerer Schwäche und äußeren Drucks brachte das Westreich zu Fall.",
    },
    workshop: classify(
      "Ursache oder Kontinuität?",
      ["Innere Ursache", "Äußere Ursache", "Das blieb nach 476"],
      [
        [
          "Innerhalb von 50 Jahren gibt es mehr als zwanzig Kaiser.",
          0,
          "Machtkämpfe schwächten das Reich von innen.",
        ],
        [
          "Die Hunnen ziehen aus Asien nach Westen.",
          1,
          "Ihr Zug setzte andere Gruppen in Bewegung.",
        ],
        [
          "In den Städten leiten Bischöfe die Gemeinden weiter.",
          2,
          "Die Kirche überdauerte das Ende Westroms.",
        ],
        [
          "Die Münzen enthalten immer weniger Silber.",
          0,
          "Geldentwertung ist ein inneres Problem.",
        ],
        [
          "Westgoten plündern 410 n. Chr. die Stadt Rom.",
          1,
          "Ein Angriff von außen.",
        ],
        [
          "Gesetze werden weiter auf Latein aufgeschrieben.",
          2,
          "Sprache und Recht lebten in den neuen Reichen fort.",
        ],
      ],
      "Das Ende Westroms hatte viele Ursachen. Zugleich zeigt sich: Vieles Alte lebte im Neuen weiter.",
    ),
    tasks: {
      1: writing(
        "Nenne je zwei innere und äußere Ursachen für das Ende des Weströmischen Reiches.",
        ["Was schwächte das Reich von innen?", "Wer drängte von außen herein?"],
        "Innere Ursachen waren die vielen Kaiserwechsel und Bürgerkriege sowie die Geldentwertung und hohe Steuern. Äußere Ursachen waren der Druck germanischer Gruppen an Rhein und Donau und der Zug der Hunnen, der um 375 n. Chr. weitere Wanderungen auslöste. Zusammen führten sie dazu, dass Odoaker 476 n. Chr. den letzten weströmischen Kaiser absetzte.",
        ["Zwei innere Ursachen", "Zwei äußere Ursachen", "Zusammenhang hergestellt"],
      ),
      2: writing(
        "„476 war alles Römische vorbei.“ Prüfe diese Aussage mit Beispielen für Kontinuität.",
        ["Was geschah mit Sprache, Recht und Kirche?", "Was wurde aus dem Ostreich?"],
        "Die Aussage stimmt nicht. 476 endete nur das Weströmische Reich als Staat. Latein blieb die Sprache von Recht und Kirche, Bischöfe leiteten weiter die Städte, und Großgrundbesitzer mit abhängigen Bauern gab es weiterhin. Die germanischen Könige übernahmen römische Verwaltung. Außerdem bestand das Oströmische Reich bis 1453. Es gab also einen Wandel, aber viel Kontinuität.",
        ["Aussage geprüft", "Beispiele für Kontinuität genannt", "Ostrom berücksichtigt"],
      ),
    },
  },
  {
    id: "g6-dreiteilung",
    lb: 6,
    title: "Wanderungen und die Dreiteilung der Mittelmeerwelt",
    period: "„Völkerwanderung“ um 375 bis 568 · Dreiteilung um 750",
    span: [375, 750],
    intro:
      "Um 400 n. Chr. umschloss das Römische Reich das ganze Mittelmeer. Um 750 teilten sich drei Welten seine Küsten.",
    paragraphs: [
      "Auf Geschichtskarten zur „Völkerwanderung“ siehst du bunte Pfeile quer durch Europa: Westgoten ziehen bis nach Spanien, Vandalen über Spanien nach Nordafrika, Ostgoten nach Italien, Franken nach Gallien, Angeln und Sachsen nach Britannien, 568 n. Chr. die Langobarden nach Italien. Die Pfeile vereinfachen stark. Es zogen keine geschlossenen Völker, sondern Kriegergruppen mit ihren Familien, die sich unterwegs mischten. Oft dauerte eine Wanderung Jahrzehnte. Deshalb steht der Begriff in Anführungszeichen.",
      "Um 750 hatte sich die Mittelmeerwelt dreigeteilt. Im Osten bestand das Byzantinische Reich, das frühere Oströmische Reich, mit der Hauptstadt Konstantinopel, griechischer Sprache und eigener christlicher Kirche. Im Süden und Osten des Mittelmeers, von Spanien bis Persien, herrschten muslimische Kalifen; dort sprach man Arabisch. Im Westen lag das lateinisch-christliche Europa mit dem Papst in Rom und dem Reich der Franken.",
      "Kann man die Wanderungen von damals mit Migration heute vergleichen? Einiges ist ähnlich: Menschen verlassen ihre Heimat wegen Krieg, Hunger oder Bedrohung durch andere, und mit der Zeit mischen sich Zugewanderte und Einheimische. Vieles ist anders: Damals kamen bewaffnete Gruppen, die sich oft mit Gewalt Land nahmen und eigene Reiche gründeten. Heute suchen meist einzelne Menschen oder Familien Schutz und Arbeit, und Staaten regeln mit Gesetzen, wer bleiben darf.",
    ],
    takeaway:
      "Ab etwa 375 n. Chr. wanderten germanische Gruppen ins Römische Reich und gründeten eigene Reiche. Um 750 war die Mittelmeerwelt dreigeteilt: Byzanz, die islamische Welt und das lateinisch-christliche Europa.",
    sourceIds: ["pw-islam", "pw-karl", "lehrplan"],
    quiz: check(
      "Warum setzt man „Völkerwanderung“ oft in Anführungszeichen?",
      "Es wanderten keine geschlossenen Völker, sondern gemischte Gruppen.",
      ["Die Wanderungen haben in Wirklichkeit nie stattgefunden.", "Nur Römer verwendeten diesen Begriff damals."],
      [
        "Die Wanderungen gab es; sie verliefen nur anders, als das Wort nahelegt.",
        "Der Begriff ist viel später entstanden, nicht in der Römerzeit.",
      ],
      "Die Gruppen bildeten sich oft erst unterwegs. Der Begriff vereinfacht einen langen, vielschichtigen Vorgang.",
    ),
    diagram: {
      kind: "steps",
      title: "Vom Römischen Reich zur Dreiteilung",
      steps: [
        { label: "um 375", note: "Hunnen ziehen nach Westen" },
        { label: "410", note: "Westgoten plündern Rom" },
        { label: "476", note: "Ende des Weströmischen Reiches" },
        { label: "568", note: "Langobarden ziehen nach Italien" },
        { label: "um 750", note: "Byzanz, Kalifat und Frankenreich" },
      ],
      repeats: false,
      caption: "Auf Karten dieser Zeitpunkte siehst du, wie aus einem Reich am Mittelmeer drei Welten wurden.",
    },
    workshop: classify(
      "Welche der drei Welten um 750 ist gemeint?",
      ["Byzantinisches Reich", "Islamische Welt", "Lateinisch-christliches Europa"],
      [
        [
          "Der Kaiser regiert in Konstantinopel; man spricht Griechisch.",
          0,
          "Byzanz setzte das Oströmische Reich fort.",
        ],
        [
          "Ein Kalif herrscht; Arabisch ist die Sprache von Glauben und Verwaltung.",
          1,
          "Die Kalifen folgten Mohammed als Herrscher nach.",
        ],
        [
          "Der Papst in Rom und die Könige der Franken arbeiten zusammen.",
          2,
          "Im Westen prägte die lateinische Kirche das Leben.",
        ],
        [
          "Das Reich reicht von Spanien über Nordafrika bis Persien.",
          1,
          "In rund hundert Jahren hatten sich muslimische Heere ausgebreitet.",
        ],
        [
          "Gottesdienste werden auf Latein gefeiert.",
          2,
          "Latein blieb im Westen die Sprache der Kirche.",
        ],
      ],
      "Sprache, Religion und Herrscher unterscheiden die drei Welten, die aus der antiken Mittelmeerwelt hervorgingen.",
    ),
    tasks: {
      1: writing(
        "Beschreibe die Dreiteilung der Mittelmeerwelt um 750: Nenne die drei Bereiche mit je einem Merkmal.",
        ["Wer herrschte wo?", "Welche Sprache und Religion prägten jeden Bereich?"],
        "Im Osten lag das Byzantinische Reich mit dem Kaiser in Konstantinopel und griechischer Sprache. Im Süden und Osten des Mittelmeers herrschten muslimische Kalifen von Spanien bis Persien; dort sprach man Arabisch. Im Westen lag das lateinisch-christliche Europa mit dem Papst in Rom und dem Frankenreich.",
        ["Drei Bereiche genannt", "Je ein Merkmal", "Räumlich richtig eingeordnet"],
      ),
      2: writing(
        "Vergleiche die Wanderungen der Spätantike mit Migration heute: eine Gemeinsamkeit, zwei Unterschiede.",
        ["Warum verließen Menschen damals und heute ihre Heimat?", "Wie kamen sie an, und welche Regeln galten?"],
        "Gemeinsam ist, dass Menschen damals wie heute wegen Krieg, Hunger oder Bedrohung ihre Heimat verlassen. Ein Unterschied: Damals zogen bewaffnete Gruppen, die sich oft mit Gewalt Land nahmen und eigene Reiche gründeten; heute kommen meist Einzelne oder Familien. Ein zweiter Unterschied: Heute regeln Gesetze, wer bleiben darf und welche Rechte jemand hat, damals entschied oft die Macht.",
        ["Gemeinsamkeit genannt", "Zwei Unterschiede genannt", "Sachlich und respektvoll formuliert"],
      ),
    },
  },
  {
    id: "g6-islam",
    lb: 6,
    title: "Die Ausbreitung des Islam",
    period: "Mohammed um 570 bis 632 · Ausbreitung bis 732",
    span: [570, 732],
    intro:
      "Innerhalb von hundert Jahren nach dem Tod Mohammeds reichte die islamische Herrschaft von Spanien bis Indien. Was machte diese schnelle Ausbreitung möglich?",
    paragraphs: [
      "Mohammed wurde um 570 in Mekka geboren, einer Handelsstadt auf der Arabischen Halbinsel. Um 610 begann er zu verkünden, Gott, auf Arabisch Allah, habe ihm Botschaften offenbart; sie wurden später im Koran aufgeschrieben. Er rief dazu auf, nur an den einen Gott zu glauben. Weil er in Mekka verfolgt wurde, zog er 622 nach Medina. Mit dieser Auswanderung, der Hidschra, beginnt die islamische Zeitrechnung. Als Mohammed 632 starb, folgten viele Stämme Arabiens seiner Lehre. Zu den Grundpflichten gehören Glaubensbekenntnis, Gebet, Almosen, Fasten im Ramadan und die Pilgerfahrt nach Mekka.",
      "Nach Mohammeds Tod führten Nachfolger, die Kalifen, die Muslime. Ihre Heere eroberten in wenigen Jahrzehnten Syrien, Ägypten und Persien, später Nordafrika. 711 setzten sie nach Spanien über. 732 hielt ein fränkisches Heer unter Karl Martell sie zwischen Tours und Poitiers in Gallien auf.",
      "Für die schnelle Ausbreitung gab es mehrere Voraussetzungen. Das Byzantinische Reich und das Perserreich hatten sich in einem langen Krieg gegeneinander erschöpft. Der gemeinsame Glaube einte die arabischen Stämme, und ihre Reiterheere waren sehr beweglich. Christen und Juden durften in den eroberten Gebieten ihren Glauben behalten, wenn sie eine besondere Steuer zahlten. Manche lebten so mit weniger Druck als unter ihren früheren Herrschern. Arabisch wurde die gemeinsame Sprache, und Handel verband das große Reich.",
    ],
    takeaway:
      "Der Islam geht auf Mohammed zurück; 622 ist das Jahr der Hidschra. Erschöpfte Nachbarreiche, Einheit durch den Glauben, bewegliche Heere und Duldung von Christen und Juden gegen Steuern ermöglichten die rasche Ausbreitung.",
    sourceIds: ["pw-islam", "lehrplan"],
    quiz: check(
      "Welche Voraussetzung erleichterte die Ausbreitung des Islam?",
      "Byzanz und Persien hatten sich im Krieg erschöpft.",
      ["Die Franken unterstützten die arabischen Heere.", "Alle Eroberten mussten sofort Muslime werden."],
      [
        "Die Franken stellten sich den Heeren 732 in Gallien entgegen.",
        "Christen und Juden durften gegen eine Steuer ihren Glauben behalten.",
      ],
      "Die beiden großen Nachbarreiche waren nach jahrzehntelangem Krieg geschwächt. Das öffnete den Weg für die muslimischen Heere.",
    ),
    diagram: {
      kind: "steps",
      title: "Vom Propheten zum Großreich",
      steps: [
        { label: "um 570", note: "Mohammed wird in Mekka geboren" },
        { label: "622", note: "Hidschra nach Medina" },
        { label: "632", note: "Tod Mohammeds, Beginn der Kalifen" },
        { label: "um 640", note: "Syrien, Ägypten, bald Persien" },
        { label: "711", note: "Übergang nach Spanien" },
        { label: "732", note: "Halt zwischen Tours und Poitiers" },
      ],
      repeats: false,
      caption: "In gut hundert Jahren entstand ein Reich von Spanien bis an den Indus.",
    },
    workshop: classify(
      "Voraussetzungen der Ausbreitung",
      ["Schwäche der Nachbarn", "Stärke der Eroberer", "Umgang mit den Eroberten"],
      [
        [
          "Byzanz und Persien haben jahrzehntelang gegeneinander Krieg geführt.",
          0,
          "Beide Reiche waren erschöpft.",
        ],
        [
          "Ein gemeinsamer Glaube eint die zuvor zerstrittenen arabischen Stämme.",
          1,
          "Der Glaube schuf Zusammenhalt und Antrieb.",
        ],
        [
          "Christen und Juden dürfen gegen eine Steuer ihren Glauben behalten.",
          2,
          "Das verringerte den Widerstand in den eroberten Gebieten.",
        ],
        [
          "Reiter auf Pferden und Kamelen legen große Strecken schnell zurück.",
          1,
          "Beweglichkeit war ein militärischer Vorteil.",
        ],
        [
          "Viele Christen in Ägypten waren mit der Kirche in Konstantinopel zerstritten.",
          0,
          "Innere Spannungen schwächten Byzanz zusätzlich.",
        ],
      ],
      "Nicht ein Grund allein erklärt die Ausbreitung, sondern das Zusammenwirken mehrerer Voraussetzungen.",
    ),
    tasks: {
      1: writing(
        "Erkläre, was die Hidschra ist und warum das Jahr 622 für Muslime wichtig ist.",
        ["Wohin zog Mohammed, und warum?", "Was beginnt mit diesem Jahr?"],
        "Die Hidschra ist die Auswanderung Mohammeds und seiner Anhänger im Jahr 622 von Mekka nach Medina. Mohammed wurde in Mekka verfolgt, weil er nur einen Gott verkündete. In Medina fand er Unterstützung und baute eine Gemeinde auf. Deshalb beginnt mit dem Jahr 622 die islamische Zeitrechnung.",
        ["Hidschra erklärt", "Grund genannt", "Bedeutung für die Zeitrechnung genannt"],
      ),
      2: writing(
        "Erkläre mit drei Voraussetzungen, warum sich der Islam so schnell ausbreiten konnte.",
        ["Wie stand es um die Nachbarreiche?", "Wie gingen die Eroberer mit Christen und Juden um?"],
        "Erstens hatten sich Byzanz und Persien in einem langen Krieg gegeneinander erschöpft. Zweitens einte der gemeinsame Glaube die arabischen Stämme, und ihre beweglichen Reiterheere waren schnell. Drittens durften Christen und Juden gegen eine Steuer ihren Glauben behalten, sodass viele sich nicht wehrten. Zusammen ermöglichten diese Voraussetzungen die rasche Ausbreitung.",
        ["Drei Voraussetzungen genannt", "Jeweils erklärt", "Zusammenwirken betont"],
      ),
    },
  },
  {
    id: "g6-franken",
    lb: 6,
    title: "Das Reich der Franken entsteht",
    period: "Um 500 Reichsbildung der Franken",
    span: [482, 754],
    intro:
      "Von allen germanischen Reichen hatte nur eines lange Bestand: das der Franken. Ein König, eine Taufe und eine kluge Verbindung von Altem und Neuem machten es möglich.",
    paragraphs: [
      "Die Franken lebten am Niederrhein. Chlodwig aus der Familie der Merowinger wurde um 482 König eines fränkischen Teilstammes. Er besiegte 486 den letzten römischen Machthaber in Gallien, schaltete andere fränkische Könige aus und eroberte große Teile Galliens. Um 500 ließ er sich katholisch taufen. Das war ein kluger Schritt: Die Mehrheit der Bevölkerung in Gallien und die Bischöfe waren katholisch, während andere germanische Könige einer anderen christlichen Richtung folgten. So gewann Chlodwig die Unterstützung von Kirche und Einheimischen.",
      "Im Frankenreich verbanden sich drei Traditionen. Germanisch waren das Königtum, das auf Sieg und Gefolgschaft beruhte, und Rechtsbräuche. Römisch waren die lateinische Schriftsprache, Städte, Münzen und Teile der Verwaltung; die Gesetze der Franken wurden auf Latein aufgeschrieben. Christlich war der Glaube, den König und Kirche gemeinsam förderten. Bischöfe wurden zu wichtigen Helfern des Königs.",
      "Im 7. und 8. Jahrhundert zogen Mönche als Missionare durch das Land, etwa der Ire Kilian nach Würzburg oder Emmeram nach Regensburg. Der Angelsachse Bonifatius ordnete die Kirche östlich des Rheins; 739 richtete er die Bistümer Regensburg, Passau, Freising und Salzburg ein. Die Christianisierung verlief meist friedlich, bei den Sachsen später aber mit Gewalt. Mit dem Glauben kamen Klöster, Schulen und die lateinische Schrift in neue Gebiete.",
    ],
    takeaway:
      "Um 500 gründete Chlodwig das Frankenreich und ließ sich katholisch taufen. Germanische, römische und christliche Traditionen verbanden sich; Missionare wie Bonifatius verbreiteten das Christentum.",
    sourceIds: ["pw-karl", "hdbg"],
    quiz: check(
      "Warum war Chlodwigs katholische Taufe politisch klug?",
      "Er gewann damit Kirche und Bevölkerung Galliens.",
      ["Der Papst zahlte ihm dafür einen hohen Lohn.", "Die Taufe machte ihn zum römischen Kaiser."],
      [
        "Ein Lohn des Papstes ist nicht überliefert; der Gewinn war Unterstützung.",
        "Kaiser wurde erst Karl der Große im Jahr 800.",
      ],
      "Die Gallorömer und ihre Bischöfe waren katholisch. Mit dem gleichen Glauben wurde der fränkische König für sie annehmbar.",
    ),
    workshop: classify(
      "Drei Traditionen im Frankenreich",
      ["Germanische Tradition", "Römische Tradition", "Christliche Tradition"],
      [
        [
          "Der König ist Anführer seiner Gefolgschaft, die ihm Treue schwört.",
          0,
          "Gefolgschaft war ein germanisches Prinzip.",
        ],
        [
          "Gesetze werden auf Latein aufgeschrieben.",
          1,
          "Die Schriftsprache übernahmen die Franken von den Römern.",
        ],
        [
          "Bischöfe beraten den König und verwalten Städte.",
          2,
          "Die Kirche wurde zur Stütze der Herrschaft.",
        ],
        [
          "In den Städten werden Münzen nach römischem Vorbild geprägt.",
          1,
          "Geld und Städte stammten aus der Römerzeit.",
        ],
        [
          "Mönche gründen Klöster und taufen die Menschen.",
          2,
          "Mission verbreitete den christlichen Glauben.",
        ],
        [
          "Der König muss seine Macht durch Siege im Kampf beweisen.",
          0,
          "Kriegsglück galt bei den Germanen als Zeichen eines guten Königs.",
        ],
      ],
      "Das Frankenreich war erfolgreich, weil es Altes verband statt es zu zerstören.",
    ),
    tasks: {
      1: writing(
        "Beschreibe die Reichsbildung der Franken unter Chlodwig in drei Schritten.",
        ["Wen besiegte er?", "Welche Rolle spielte seine Taufe?"],
        "Chlodwig wurde um 482 König eines fränkischen Teilstammes. Er besiegte 486 den letzten römischen Machthaber in Gallien und schaltete andere fränkische Könige aus. Um 500 ließ er sich katholisch taufen und gewann dadurch die Unterstützung der Bischöfe und der gallorömischen Bevölkerung. So entstand ein großes, stabiles Frankenreich.",
        ["Drei Schritte genannt", "Rolle der Taufe erklärt", "Zeitangaben richtig"],
      ),
      2: writing(
        "Erkläre, warum die Missionierung für das Frankenreich und für Bayern wichtig war.",
        ["Was kam mit dem Glauben ins Land?", "Was richtete Bonifatius 739 ein?"],
        "Mit der Missionierung verbreitete sich der christliche Glaube, der König und Volk verband. Missionare gründeten Klöster, die Schulen und Bücher in lateinischer Schrift ins Land brachten. In Bayern richtete Bonifatius 739 die Bistümer Regensburg, Passau, Freising und Salzburg ein, die die Kirche dauerhaft ordneten. So stärkte die Mission Glauben, Bildung und Herrschaft zugleich.",
        ["Bedeutung für den Glauben", "Bildung und Klöster genannt", "Bayerisches Beispiel genannt"],
      ),
    },
  },
  {
    id: "g6-karl",
    lb: 6,
    title: "Karl der Große wird Kaiser",
    period: "800 Kaiserkrönung Karls des Großen",
    span: [768, 814],
    intro:
      "Am Weihnachtstag 800 setzte der Papst in Rom dem Frankenkönig Karl eine Krone auf. Was war neu an diesem Kaisertum, und was erinnerte an die Antike?",
    paragraphs: [
      "Karl wurde 768 König der Franken. In über dreißig Jahren Krieg unterwarf er die Sachsen und zwang sie zur Taufe; nach fränkischen Berichten ließ er 782 viele Gefangene hinrichten. Er eroberte das Reich der Langobarden in Italien und setzte 788 den bayerischen Herzog Tassilo ab. Sein Reich reichte von der Nordsee bis Mittelitalien und von den Pyrenäen bis an Elbe und Donau.",
      "Am 25. Dezember 800 krönte Papst Leo III. Karl in der Peterskirche in Rom zum Kaiser. Damit gab es im Westen wieder einen Kaiser, über 300 Jahre nach 476. Neu war, dass der Papst den Kaiser krönte: Kaiser und Kirche waren nun eng verbunden. Karl hatte keine feste Hauptstadt; er reiste mit seinem Hof von Pfalz zu Pfalz, am liebsten nach Aachen. Grafen verwalteten die Landesteile, Königsboten kontrollierten sie. Karl förderte Schulen in Klöstern und eine gut lesbare Schrift, aus der unsere Kleinbuchstaben hervorgingen. Er starb 814.",
      "Vergleiche Karl mit einem antiken Kaiser wie Augustus, um Kontinuität und Wandel zu erkennen. Gleich blieben der Titel Kaiser, der Anspruch, über viele Völker zu herrschen, und die lateinische Sprache. Anders war vieles: Augustus regierte von Rom aus mit bezahlten Beamten, einem stehenden Berufsheer und Steuern. Karl herrschte durch persönliche Treue seiner Gefolgsleute, die er mit Land belohnte, und verstand sich als christlicher Herrscher, der die Kirche schützt.",
    ],
    takeaway:
      "800 krönte Papst Leo III. Karl den Großen in Rom zum Kaiser. Das Kaisertum knüpfte an Rom an, war aber christlich, an den Papst gebunden und auf persönliche Treue statt auf Beamte gestützt.",
    sourceIds: ["pw-karl", "hdbg"],
    quiz: check(
      "Was war bei Karls Kaiserkrönung im Vergleich zur Antike neu?",
      "Der Papst setzte dem Kaiser die Krone auf.",
      ["Der Kaiser trug den lateinischen Titel Imperator.", "Der Kaiser herrschte über viele Völker."],
      [
        "Den Titel Imperator trugen schon die römischen Kaiser: Kontinuität.",
        "Auch Augustus herrschte über viele Völker: Kontinuität.",
      ],
      "Die Krönung durch den Papst verband Kaisertum und Kirche. Das gab es bei den römischen Kaisern nicht.",
    ),
    diagram: {
      kind: "compare",
      title: "Zwei Kaiser im Vergleich",
      columns: ["Augustus (um Christi Geburt)", "Karl der Große (um 800)"],
      rows: [
        { aspect: "Machtbasis", values: ["Berufsheer, Geld, Beamte", "persönliche Treue der Gefolgsleute"] },
        { aspect: "Regierungssitz", values: ["feste Hauptstadt Rom", "Reise von Pfalz zu Pfalz, oft Aachen"] },
        { aspect: "Einnahmen", values: ["Steuern aus den Provinzen", "Erträge aus königlichen Gütern, Abgaben"] },
        { aspect: "Religion", values: ["römische Götter, Verehrung des Kaisers", "christlicher Herrscher, Schutz der Kirche"] },
        { aspect: "Krönung", values: ["keine Krönung", "durch den Papst in Rom"] },
      ],
      caption: "Titel, Latein und Anspruch blieben gleich (Kontinuität). Machtbasis, Religion und Krönung änderten sich (Wandel).",
    },
    workshop: classify(
      "Kontinuität oder Wandel?",
      ["Kontinuität: wie in der Antike", "Wandel: neu im Mittelalter"],
      [
        [
          "Karl trägt den Titel Kaiser und Augustus.",
          0,
          "Er knüpft bewusst an die römischen Kaiser an.",
        ],
        [
          "Der Papst krönt Karl in Rom.",
          1,
          "Die Bindung an die Kirche ist neu.",
        ],
        [
          "Urkunden und Gesetze werden auf Latein geschrieben.",
          0,
          "Latein bleibt die Sprache von Recht und Verwaltung.",
        ],
        [
          "Der Kaiser reist mit seinem Hof von Pfalz zu Pfalz.",
          1,
          "Die Römer regierten von einer festen Hauptstadt aus.",
        ],
        [
          "Gefolgsleute erhalten Land und schulden dafür Treue.",
          1,
          "Statt bezahlter Beamter tragen persönliche Bindungen die Herrschaft.",
        ],
        [
          "Der Kaiser beansprucht, über viele Völker zu herrschen.",
          0,
          "Dieser Anspruch verbindet ihn mit dem Imperium Romanum.",
        ],
      ],
      "Karl erneuerte das Kaisertum im Westen. Er übernahm Titel und Anspruch und füllte sie mit neuen, christlichen und fränkischen Inhalten.",
    ),
    tasks: {
      1: writing(
        "Beschreibe die Kaiserkrönung Karls des Großen: Wann, wo, durch wen, und warum war sie wichtig?",
        ["Welches Datum und welcher Ort?", "Was bedeutete die Krönung durch den Papst?"],
        "Am 25. Dezember 800 krönte Papst Leo III. den Frankenkönig Karl in der Peterskirche in Rom zum Kaiser. Damit gab es im Westen über 300 Jahre nach dem Ende Westroms wieder einen Kaiser. Wichtig war auch, dass der Papst ihn krönte: Kaisertum und Kirche waren seitdem eng verbunden.",
        ["Datum, Ort und Papst genannt", "Bezug zum Ende Westroms", "Bedeutung der päpstlichen Krönung"],
      ),
      2: writing(
        "Vergleiche das Kaisertum Karls mit dem des Augustus. Nenne je ein Beispiel für Kontinuität und für Wandel.",
        ["Was übernahm Karl von den römischen Kaisern?", "Worauf stützte sich seine Herrschaft anders als bei Augustus?"],
        "Eine Kontinuität ist der Titel Kaiser mit dem Anspruch, über viele Völker zu herrschen, und die lateinische Sprache der Urkunden. Ein Wandel ist die Grundlage der Macht: Augustus regierte von Rom aus mit bezahlten Beamten und einem Berufsheer, Karl reiste von Pfalz zu Pfalz und stützte sich auf die persönliche Treue seiner Gefolgsleute. Außerdem verstand sich Karl als christlicher Herrscher, der vom Papst gekrönt wurde.",
        ["Kontinuität genannt", "Wandel genannt", "Vergleich begründet"],
      ),
    },
  },
];
