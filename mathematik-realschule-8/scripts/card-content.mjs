// Authoring source. Formulas use card-text segments with speech, including
// the fast-check alternatives. Stable ULIDs live separately in card-ids.json.
const math = (tex, speech) => [{ type: "math", tex, speech }];
const segments = (...parts) =>
  parts.flatMap((p) => (typeof p === "string" ? [{ type: "text", text: p }] : p));
const cards = [];
const group = (lesson, entries) =>
  entries.forEach(([slug, question, answer, wrong]) => {
    cards.push({ lesson, slug: `m8-${slug}`, question, answer, wrong });
  });

group("dv-1-dreiecksungleichung", [
  [
    "dreieck-existenz",
    "Welche Bedingung genügt bei drei positiven Seitenlängen nach dem Sortieren für die Existenz eines echten Dreiecks?",
    "Die längste Seite ist kürzer als die Summe der beiden anderen.",
    "Die längste Seite ist gleich der Summe der beiden anderen.",
  ],
  [
    "dreieck-grenzfall",
    "Welche Figur entsteht, wenn die längste Seite genau die Summe der beiden anderen ist?",
    "Eine gerade Strecke, kein echtes Dreieck.",
    "Ein rechtwinkliges Dreieck.",
  ],
  [
    "dreieck-gegenwinkel",
    "Welcher Seite eines Dreiecks liegt der größte Winkel gegenüber?",
    "Der längsten Seite.",
    "Der kürzesten Seite.",
  ],
]);
group("dv-2-dreieckskonstruktion", [
  [
    "sss-radius-a",
    "Mit welcher Seitenlänge als Radius zeichnest du bei der SSS-Konstruktion von ABC den Kreis um A?",
    "Mit b, der Länge von AC.",
    "Mit a, der Länge von BC.",
  ],
  [
    "sws-winkellage",
    "Wo liegt der gegebene Winkel beim Kongruenzsatz SWS?",
    "Zwischen den beiden gegebenen Seiten.",
    "Gegenüber der kürzeren gegebenen Seite.",
  ],
  [
    "wsw-plan",
    "Wie konstruierst du ein Dreieck aus einer Seite und den beiden anliegenden Winkeln?",
    "Die Seite zeichnen, an ihren Enden die Winkel abtragen und die Schenkel schneiden.",
    "Zwei Kreise mit beliebigen Radien zeichnen und ihre Schnittpunkte verbinden.",
  ],
]);
group("dv-3-kongruenz", [
  [
    "kongruent",
    "Was bedeutet es, dass zwei Dreiecke kongruent sind?",
    "Sie lassen sich durch Verschieben, Drehen oder Spiegeln zur Deckung bringen.",
    "Sie haben nur gleiche Winkel, dürfen aber verschieden groß sein.",
  ],
  [
    "ssw-bedingung",
    "Welche Lagebedingung gilt für den gegebenen Winkel beim sicheren Kongruenzsatz SsW?",
    "Er liegt der längeren der beiden gegebenen Seiten gegenüber.",
    "Er liegt immer der kürzeren der beiden gegebenen Seiten gegenüber.",
  ],
  [
    "www",
    "Warum legen drei Winkel allein kein Dreieck bis auf Kongruenz fest?",
    "Die Größe bleibt frei.",
    "Die Form bleibt trotz dreier Winkel völlig frei.",
  ],
]);
group("dv-4-vierecke", [
  [
    "raute-erkennen",
    "Welches Viereck besitzt vier gleich lange Seiten und Diagonalen, die sich senkrecht halbieren?",
    "Die Raute, auch Rhombus genannt.",
    "Jedes Rechteck.",
  ],
  [
    "quadrat-hierarchie",
    "Zu welchen beiden speziellen Parallelogrammfamilien gehört jedes Quadrat zugleich?",
    "Zu den Rechtecken und den Rauten.",
    "Nur zu den Rechtecken, niemals zu den Rauten.",
  ],
  [
    "rechteck-diagonalen",
    "Welche Längen- und Teilungseigenschaft haben die Diagonalen jedes Rechtecks?",
    "Sie sind gleich lang und halbieren sich.",
    "Sie stehen immer senkrecht aufeinander.",
  ],
]);
group("dv-5-viereckskonstruktion", [
  [
    "trapez-flaeche",
    segments(
      "Wie lautet die Flächenformel des Trapezes mit parallelen Seiten ",
      math("a", "a"),
      " und ",
      math("c", "c"),
      " sowie Höhe ",
      math("h", "h"),
      "?",
    ),
    math("A=\\frac{a+c}{2}\\cdot h", "A gleich a plus c, geteilt durch zwei, mal h"),
    math("A=(a+c)\\cdot h", "A gleich a plus c mal h"),
  ],
  [
    "drache-flaeche",
    "Wie berechnest du die Fläche eines Drachenvierecks aus den senkrechten Diagonalen e und f?",
    math("A=\\frac{ef}{2}", "A gleich e mal f geteilt durch zwei"),
    math("A=ef", "A gleich e mal f"),
  ],
  [
    "hoehe",
    "Was ist die Höhe eines Parallelogramms zu einer gewählten Grundseite?",
    "Der senkrechte Abstand der beiden zugehörigen parallelen Seiten.",
    "Immer die Länge einer schrägen Seitenkante.",
  ],
]);
group("dr-1-drehung", [
  [
    "drehung-vorschrift",
    "Welche zwei Angaben bestimmen eine Drehung in der Ebene?",
    "Drehzentrum und gerichteter Drehwinkel.",
    "Nur Anfangs- und Endfarbe der Figur.",
  ],
  [
    "drehung-drehsinn",
    "In welchem Drehsinn wird ein positiver Drehwinkel abgetragen?",
    "Gegen den Uhrzeigersinn.",
    "Im Uhrzeigersinn.",
  ],
  [
    "drehung-kongruenz",
    "Warum ist die Drehung eine Kongruenzabbildung?",
    "Sie erhält Streckenlängen und Winkelmaße.",
    "Sie erhält nur Winkel und verändert alle Längen.",
  ],
]);
group("dr-2-drehsymmetrie", [
  [
    "punktspiegelung",
    "Welcher Drehwinkel beschreibt eine Punktspiegelung?",
    math("180^\\circ", "hundertachtzig Grad"),
    math("90^\\circ", "neunzig Grad"),
  ],
  [
    "regelmaessiges-vieleck",
    "Wie berechnest du den kleinsten positiven Symmetriewinkel eines regelmäßigen n-Ecks?",
    math("\\varphi=\\frac{360^\\circ}{n}", "Phi gleich dreihundertsechzig Grad geteilt durch n"),
    math("\\varphi=\\frac{180^\\circ}{n}", "Phi gleich hundertachtzig Grad geteilt durch n"),
  ],
  [
    "fuenfeck-punktsymmetrie",
    "Ist ein regelmäßiges Fünfeck punktsymmetrisch?",
    "Nein, eine halbe Drehung bringt es nicht auf sich selbst.",
    "Ja, jedes regelmäßige Vieleck ist punktsymmetrisch.",
  ],
]);
group("dr-3-vektoren", [
  [
    "vektor-links",
    "Wie ändern sich die Koordinaten eines Vektors bei einer Drehung um plus neunzig Grad?",
    math("(x,y)\\mapsto(-y,x)", "x, y wird zu minus y, x"),
    math("(x,y)\\mapsto(y,-x)", "x, y wird zu y, minus x"),
  ],
  [
    "vektor-rechts",
    "Wie ändern sich die Koordinaten eines Vektors bei einer Drehung um minus neunzig Grad?",
    math("(x,y)\\mapsto(y,-x)", "x, y wird zu y, minus x"),
    math("(x,y)\\mapsto(-y,x)", "x, y wird zu minus y, x"),
  ],
  [
    "vektor-halb",
    "Wie ändern sich die Koordinaten eines Vektors bei einer Drehung um hundertachtzig Grad?",
    math("(x,y)\\mapsto(-x,-y)", "x, y wird zu minus x, minus y"),
    math("(x,y)\\mapsto(y,x)", "x, y wird zu y, x"),
  ],
]);
group("rg-1-koerpersymmetrie", [
  [
    "quader-ebenen",
    "Wie viele Symmetrieebenen besitzt ein Quader mit drei verschiedenen Kantenlängen?",
    "Drei mittige Ebenen parallel zu den Flächenpaaren.",
    "Neun Ebenen wie jeder Würfel.",
  ],
  [
    "wuerfel-ebenen",
    "Wie viele Symmetrieebenen besitzt ein Würfel?",
    "Neun: drei mittige und sechs diagonale Ebenen.",
    "Nur drei mittige Ebenen.",
  ],
  [
    "kegel-zentrum",
    "Besitzt ein gerader Kreiskegel ein Symmetriezentrum?",
    "Nein, die Punktspiegelung bildet ihn nicht auf sich selbst ab.",
    "Ja, jede Rotationsachse liefert auch ein Symmetriezentrum.",
  ],
]);
group("rg-2-axialschnitte", [
  [
    "axialschnitt-definition",
    "Welche Lage hat die Schnittebene bei einem Axialschnitt eines Rotationskörpers?",
    "Sie enthält die Rotationsachse.",
    "Sie ist stets senkrecht zur Rotationsachse.",
  ],
  [
    "kegel-schnitt",
    "Welche ebene Figur ist der vollständige Axialschnitt eines geraden Kreiskegels?",
    "Ein gleichschenkliges Dreieck.",
    "Ein Rechteck.",
  ],
  [
    "zylinder-schnitt",
    "Welche Maße hat der rechteckige Axialschnitt eines Kreiszylinders mit Radius r und Höhe h?",
    segments("Breite ", math("2r", "zwei r"), " und Höhe ", math("h", "h"), "."),
    segments("Breite ", math("r", "r"), " und Höhe ", math("2h", "zwei h"), "."),
  ],
]);
group("rg-3-raumkoordinaten", [
  [
    "xy-ebene",
    "Welche Koordinate ist bei jedem Punkt der xy-Ebene null?",
    "Die z-Koordinate.",
    "Die x-Koordinate.",
  ],
  [
    "yz-ebene",
    "Welche Koordinate ist bei jedem Punkt der yz-Ebene null?",
    "Die x-Koordinate.",
    "Die y-Koordinate.",
  ],
  [
    "quader-oberer-punkt",
    "Welche Koordinate ändert sich beim senkrechten Weg von einer waagerechten Quadergrundfläche zu der darüberliegenden Ecke?",
    "Nur die z-Koordinate, also die Höhe.",
    "Immer alle drei Koordinaten.",
  ],
]);
group("rg-4-schraegbilder", [
  [
    "schraegbild-tiefe",
    "Wie berechnest du die gezeichnete Tiefenlänge aus wahrer Tiefe d und Verzerrungsmaßstab q?",
    math("d_{Bild}=qd", "d Bild gleich q mal d"),
    math("d_{Bild}=d/q", "d Bild gleich d geteilt durch q"),
  ],
  [
    "schraegbild-vorderflaeche",
    "Welche Fläche wird beim hier verwendeten Schrägbild eines Prismas unverzerrt gezeichnet?",
    "Die Vorderfläche.",
    "Jede räumliche Fläche zugleich.",
  ],
  [
    "pyramide-spitze",
    "Über welchem Punkt der quadratischen Grundfläche liegt die Spitze einer geraden quadratischen Pyramide?",
    "Über dem Diagonalenschnittpunkt.",
    "Über einem beliebigen Eckpunkt.",
  ],
]);
group("rg-5-wahre-groesse", [
  [
    "wahre-tiefe",
    "Wie erhältst du die wahre Tiefe aus Bildtiefe und Verzerrungsmaßstab q?",
    math("d=d_{Bild}/q", "d gleich d Bild geteilt durch q"),
    math("d=qd_{Bild}", "d gleich q mal d Bild"),
  ],
  [
    "schraegbild-winkel",
    "Darfst du einen gemessenen Winkel einer verzerrten Grundfläche unmittelbar als wahren Körperwinkel übernehmen?",
    "Nein, die Schrägprojektion kann Winkel verändern.",
    "Ja, alle Bildwinkel sind wahre Körperwinkel.",
  ],
  [
    "wahre-rechteckflaeche",
    "Welchen Innenwinkel zeichnest du beim Rekonstruieren einer im Körper rechteckigen Grundfläche in wahrer Größe?",
    math("90^\\circ", "neunzig Grad"),
    math("45^\\circ", "fünfundvierzig Grad"),
  ],
]);
group("tg-1-termoperationen", [
  [
    "gleichartige-glieder",
    "Welche Termglieder darfst du durch Addition ihrer Koeffizienten zusammenfassen?",
    "Glieder mit genau demselben Variablenteil und denselben Exponenten.",
    "Alle Glieder, in denen irgendwo dieselbe Variable vorkommt.",
  ],
  [
    "summenterme-produkt",
    "Wie multiplizierst du zwei Summenterme aus?",
    "Jedes Glied der ersten Klammer mit jedem Glied der zweiten multiplizieren und sammeln.",
    "Nur die jeweils ersten und die jeweils letzten Glieder multiplizieren.",
  ],
  [
    "potenzen-produkt",
    "Was geschieht mit den Exponenten beim Multiplizieren von Potenzen derselben Basis?",
    "Die Exponenten werden addiert.",
    "Die Exponenten werden miteinander multipliziert.",
  ],
]);
group("tg-2-binomische-formeln", [
  [
    "binom-plus",
    "Wie lautet die erste binomische Formel?",
    math(
      "(a+b)^2=a^2+2ab+b^2",
      "a plus b in Klammern zum Quadrat gleich a Quadrat plus zwei a b plus b Quadrat",
    ),
    math("(a+b)^2=a^2+b^2", "a plus b in Klammern zum Quadrat gleich a Quadrat plus b Quadrat"),
  ],
  [
    "binom-minus",
    "Wie lautet die zweite binomische Formel?",
    math(
      "(a-b)^2=a^2-2ab+b^2",
      "a minus b in Klammern zum Quadrat gleich a Quadrat minus zwei a b plus b Quadrat",
    ),
    math("(a-b)^2=a^2-b^2", "a minus b in Klammern zum Quadrat gleich a Quadrat minus b Quadrat"),
  ],
  [
    "binom-differenz",
    "Wie lautet die dritte binomische Formel?",
    math("(a+b)(a-b)=a^2-b^2", "a plus b mal a minus b gleich a Quadrat minus b Quadrat"),
    math(
      "(a+b)(a-b)=a^2-2ab+b^2",
      "a plus b mal a minus b gleich a Quadrat minus zwei a b plus b Quadrat",
    ),
  ],
]);
group("tg-3-faktorisieren", [
  [
    "ausklammern",
    "Was bedeutet Ausklammern eines gemeinsamen Faktors?",
    "Jeden Summanden durch diesen Faktor teilen und den Faktor vor die Klammer schreiben.",
    "Nur den ersten Summanden durch den Faktor teilen.",
  ],
  [
    "quadratdifferenz",
    "Welche Produktform entspricht einer Differenz zweier Quadrate?",
    math("a^2-b^2=(a-b)(a+b)", "a Quadrat minus b Quadrat gleich a minus b mal a plus b"),
    math("a^2-b^2=(a-b)^2", "a Quadrat minus b Quadrat gleich a minus b in Klammern zum Quadrat"),
  ],
  [
    "vollstaendiges-quadrat",
    segments(
      "Wie faktorisiert man ",
      math("x^2+8x+16", "x Quadrat plus acht x plus sechzehn"),
      "?",
    ),
    math("(x+4)^2", "x plus vier in Klammern zum Quadrat"),
    math("(x+8)^2", "x plus acht in Klammern zum Quadrat"),
  ],
]);
group("tg-4-extremwerte", [
  [
    "quadrat-minimum",
    segments(
      "Welchen kleinsten Wert hat ",
      math("(x-h)^2", "x minus h in Klammern zum Quadrat"),
      " für reelle x?",
    ),
    "Null, erreicht bei x gleich h.",
    "Eins, erreicht bei x gleich null.",
  ],
  [
    "term-minimum",
    segments(
      "Welches Minimum hat ",
      math("a(x-h)^2+k", "a mal x minus h in Klammern zum Quadrat plus k"),
      " für positives a?",
    ),
    "Den Wert k bei x gleich h.",
    "Den Wert h bei x gleich k.",
  ],
  [
    "term-maximum",
    segments(
      "Welche Art Extremwert hat ",
      math("a(x-h)^2+k", "a mal x minus h in Klammern zum Quadrat plus k"),
      " für negatives a?",
    ),
    "Ein Maximum mit Wert k bei x gleich h.",
    "Ein Minimum mit Wert k bei x gleich h.",
  ],
]);
group("tg-5-gleichungen", [
  [
    "aequivalenz-null",
    "Welche Rechenoperation ist keine zulässige allgemeine Äquivalenzumformung einer Gleichung, weil sie Information verlieren kann oder undefiniert ist?",
    "Mit null multiplizieren oder durch null dividieren.",
    "Auf beiden Seiten dieselbe Zahl addieren.",
  ],
  [
    "gleichung-alle",
    "Welche Lösungsmenge folgt über der Grundmenge der rationalen Zahlen aus der Endzeile null gleich null?",
    "Alle rationalen Zahlen.",
    "Nur die Zahl null.",
  ],
  [
    "gleichung-keine",
    "Welche Lösungsmenge folgt aus einer falschen Endaussage wie null gleich fünf?",
    "Die leere Menge.",
    "Alle Zahlen der Grundmenge.",
  ],
]);
group("tg-6-sachaufgaben", [
  [
    "kostenmodell",
    "Wie setzt sich ein Preis mit Grundbetrag und konstantem Stückpreis zusammen?",
    "Grundbetrag plus Stückpreis mal Anzahl.",
    "Grundbetrag mal Anzahl plus Stückpreis.",
  ],
  [
    "modell-probe",
    "Wo prüfst du die gefundene Lösung einer Sachaufgabe abschließend?",
    "Im ursprünglichen Text und im dort erlaubten Zahlenbereich.",
    "Nur in einer beliebigen späteren Rechenzeile.",
  ],
  [
    "seitenlaenge-modell",
    "Ist eine negative berechnete Seitenlänge eine zulässige Lösung einer geometrischen Sachaufgabe?",
    "Nein, die Lösung muss zum Größenmodell passen.",
    "Ja, jede algebraisch berechnete Zahl passt automatisch.",
  ],
]);
group("tg-7-ungleichungen", [
  [
    "ungleichung-negativ",
    "Was geschieht mit dem Relationszeichen, wenn beide Seiten einer Ungleichung mit einer negativen Zahl multipliziert oder durch sie dividiert werden?",
    "Die Richtung des Relationszeichens kehrt sich um.",
    "Die Richtung des Relationszeichens bleibt immer gleich.",
  ],
  [
    "ungleichung-rand",
    "Gehört der Randwert bei einer nicht strengen Ungleichung mit kleiner gleich zur Lösungsmenge?",
    "Ja, Gleichheit ist eingeschlossen.",
    "Nein, ein Randwert ist immer ausgeschlossen.",
  ],
  [
    "ungleichung-beispiel",
    segments("Was folgt aus ", math("-3x\\geq12", "minus drei x größer oder gleich zwölf"), "?"),
    math("x\\leq-4", "x kleiner oder gleich minus vier"),
    math("x\\geq-4", "x größer oder gleich minus vier"),
  ],
]);
group("br-1-definitionsmenge", [
  [
    "bruchterm-nenner",
    "Welche Bedingung muss der Nenner eines Bruchterms bei einer erlaubten Eingabe erfüllen?",
    "Er darf nicht null werden.",
    "Er muss immer positiv sein.",
  ],
  [
    "definition-vier",
    segments(
      "Welche Zahl ist bei ",
      math("T(x)=\\frac{x+3}{2x-8}", "T von x gleich x plus drei geteilt durch zwei x minus acht"),
      " über den rationalen Zahlen ausgeschlossen?",
    ),
    "Die Zahl vier, weil dort der Nenner null wird.",
    "Die Zahl minus drei, weil dort der Zähler null wird.",
  ],
  [
    "kuerzen-ausschluss",
    "Was geschieht beim Kürzen eines gemeinsamen Faktors mit den Ausschlüssen des ursprünglichen Bruchterms?",
    "Sie bleiben bestehen.",
    "Alle Ausschlüsse verschwinden.",
  ],
]);
group("br-2-verhaeltnisgleichungen", [
  [
    "bruchgleichung-erster-schritt",
    "Was bestimmst du vor dem Beseitigen der Nenner einer Bruchgleichung?",
    "Die Definitionsmenge aus allen ursprünglichen Nennern.",
    "Nur die Nullstellen der Zähler.",
  ],
  [
    "bruchgleichung-hauptnenner",
    "Warum darfst du innerhalb der Definitionsmenge mit dem Hauptnenner multiplizieren?",
    "Weil er dort nicht null ist.",
    "Weil Multiplikation mit null immer äquivalent ist.",
  ],
  [
    "bruchgleichung-kandidat",
    "Wie behandelst du einen rechnerischen Lösungskandidaten außerhalb der Definitionsmenge?",
    "Verwerfen; er ist keine Lösung der ursprünglichen Gleichung.",
    "Übernehmen und nachträglich die Definitionsmenge erweitern.",
  ],
]);
group("br-3-formeln", [
  [
    "zeitformel",
    "Wie berechnest du die Zeit aus Weg und konstanter, von null verschiedener Geschwindigkeit?",
    math("t=\\frac{s}{v}", "t gleich s geteilt durch v"),
    math("t=sv", "t gleich s mal v"),
  ],
  [
    "formel-divisor",
    "Welche Bedingung ist vor dem Dividieren einer Formel durch eine Variable zu prüfen?",
    "Die Variable muss von null verschieden sein.",
    "Die Variable muss genau null sein.",
  ],
  [
    "gleicher-weg",
    "Wie ändert sich bei gleichem Weg die Fahrzeit, wenn die konstante Geschwindigkeit verdoppelt wird?",
    "Die Fahrzeit halbiert sich.",
    "Die Fahrzeit verdoppelt sich.",
  ],
]);
group("fu-1-zuordnungen", [
  [
    "funktion-eindeutig",
    "Wie viele Funktionswerte muss eine Funktion jedem x ihrer Definitionsmenge zuordnen?",
    "Genau einen.",
    "Mindestens zwei verschiedene.",
  ],
  [
    "funktion-gleicher-wert",
    "Dürfen verschiedene Eingaben einer Funktion denselben Ausgabewert liefern?",
    "Ja, das ist erlaubt.",
    "Nein, jeder Ausgabewert darf nur einmal vorkommen.",
  ],
  [
    "wertemenge",
    "Welche Werte stehen in der Wertemenge einer Funktion?",
    "Alle tatsächlich angenommenen Funktionswerte, jeweils nur einmal.",
    "Immer alle denkbaren Zahlen, auch nie angenommene.",
  ],
]);
group("fu-2-darstellungen", [
  [
    "graphenpunkt",
    "Welche Koordinaten hat der Graphenpunkt zur erlaubten Eingabe x?",
    math("(x,f(x))", "x, f von x"),
    math("(f(x),x)", "f von x, x"),
  ],
  [
    "nullstelle",
    "Was ist eine Nullstelle einer Funktion?",
    "Eine erlaubte Eingabe, deren Funktionswert null ist.",
    "Jeder Funktionswert, der positiv ist.",
  ],
  [
    "endliche-definitionsmenge",
    "Was zeichnet man als Graphen, wenn die Definitionsmenge ausdrücklich nur fünf einzelne Zahlen enthält?",
    "Nur die fünf zugehörigen Punkte.",
    "Immer zusätzlich eine durchgehende Kurve zwischen allen Punkten.",
  ],
]);
group("fu-3-ursprungsgeraden", [
  [
    "ursprungsgerade",
    "Welche Gleichungsform beschreibt eine Ursprungsgerade?",
    math("y=mx", "y gleich m mal x"),
    math("y=m+x^2", "y gleich m plus x Quadrat"),
  ],
  [
    "steigungsdreieck",
    "Wie berechnest du die Steigung aus einem Steigungsdreieck mit von null verschiedener Änderung in x-Richtung?",
    math("m=\\frac{\\Delta y}{\\Delta x}", "m gleich Delta y geteilt durch Delta x"),
    math("m=\\frac{\\Delta x}{\\Delta y}", "m gleich Delta x geteilt durch Delta y"),
  ],
  [
    "steigung-vorzeichen",
    "Was bedeutet eine negative Steigung im üblichen Koordinatensystem?",
    "Der Graph fällt beim Gehen nach rechts.",
    "Der Graph steigt beim Gehen nach rechts.",
  ],
]);
group("fu-4-geradenlagen", [
  [
    "orthogonal-steigungen",
    "Welche Beziehung gilt für die endlichen Steigungen zweier nicht achsenparalleler, senkrechter Geraden?",
    math("m_1m_2=-1", "m eins mal m zwei gleich minus eins"),
    math("m_1m_2=1", "m eins mal m zwei gleich eins"),
  ],
  [
    "orthogonal-kehrwert",
    "Wie erhältst du aus einer von null verschiedenen Steigung die Steigung einer senkrechten Geraden?",
    "Den negativen Kehrwert bilden.",
    "Nur das Vorzeichen ändern, ohne den Kehrwert zu bilden.",
  ],
  [
    "senkrechte-achse",
    "Warum lässt sich die Produktregel für endliche Steigungen nicht auf das Paar x-Achse und y-Achse anwenden?",
    "Die y-Achse hat keine endliche Steigung.",
    "Die beiden Achsen stehen nicht senkrecht aufeinander.",
  ],
]);
group("fu-5-achsenabschnitt", [
  [
    "gerade-steigung",
    segments(
      "Was gibt ",
      math("m", "m"),
      " in der Geradengleichung ",
      math("y=mx+t", "y gleich m x plus t"),
      " an?",
    ),
    segments(
      "Die Steigung ",
      math("m=\\frac{\\Delta y}{\\Delta x}", "m gleich Delta y geteilt durch Delta x"),
      ".",
    ),
    "Den y-Achsenabschnitt.",
  ],
  [
    "gerade-startwert",
    segments("Was gibt ", math("t", "t"), " in ", math("y=mx+t", "y gleich m x plus t"), " an?"),
    "Den y-Achsenabschnitt, also den Wert bei x gleich null.",
    "Die Steigung der Geraden.",
  ],
  [
    "vertikale-keine-funktion",
    "Warum ist eine senkrechte Gerade keine Funktion y von x auf der reellen x-Achse?",
    "Zu einem x gehören mehrere y-Werte; zu den übrigen x keine.",
    "Weil ihre Steigung genau null ist.",
  ],
]);
group("fu-6-geraden-bestimmen", [
  [
    "zwei-punkte-steigung",
    "Wie berechnest du die Steigung einer Geraden durch zwei Punkte mit verschiedenen x-Koordinaten?",
    math(
      "m=\\frac{y_2-y_1}{x_2-x_1}",
      "m gleich y zwei minus y eins geteilt durch x zwei minus x eins",
    ),
    math(
      "m=\\frac{x_2-x_1}{y_2-y_1}",
      "m gleich x zwei minus x eins geteilt durch y zwei minus y eins",
    ),
  ],
  [
    "achsenabschnitt-punkt",
    "Wie berechnest du den Achsenabschnitt aus bekannter Steigung m und einem Punkt P?",
    math("t=y_P-mx_P", "t gleich y P minus m mal x P"),
    math("t=mx_P-y_P", "t gleich m mal x P minus y P"),
  ],
  [
    "echt-parallel",
    "Welche Parameterbeziehung haben zwei echt parallele Funktionsgeraden?",
    "Gleiche Steigung und verschiedene y-Achsenabschnitte.",
    "Gleiche Steigung und gleicher y-Achsenabschnitt.",
  ],
]);
group("fu-7-flaechenmodelle", [
  [
    "determinante",
    "Wie lautet die zweireihige Determinante der Vektoren u und v in der Ebene?",
    math(
      "\\det(u,v)=u_1v_2-u_2v_1",
      "Determinante von u und v gleich u eins mal v zwei minus u zwei mal v eins",
    ),
    math(
      "\\det(u,v)=u_1v_2+u_2v_1",
      "Determinante von u und v gleich u eins mal v zwei plus u zwei mal v eins",
    ),
  ],
  [
    "determinante-dreieck",
    "Wie erhältst du aus zwei Verbindungsvektoren vom selben Eckpunkt den Dreiecksinhalt?",
    math(
      "A=\\frac{|\\det(u,v)|}{2}",
      "A gleich Betrag der Determinante von u und v geteilt durch zwei",
    ),
    math("A=|\\det(u,v)|", "A gleich Betrag der Determinante von u und v"),
  ],
  [
    "modellbereich",
    "Warum muss bei einem linearen Kostenmodell der erlaubte Eingabebereich gesondert festgelegt werden?",
    "Weil der Sachzusammenhang etwa negative Stückzahlen ausschließt.",
    "Weil jede Formel automatisch nur sinnvolle Stückzahlen annimmt.",
  ],
]);
group("dz-1-ergebnis-ereignis", [
  [
    "ergebnis",
    "Was bezeichnet ein Ergebnis eines Zufallsexperiments?",
    "Einen einzelnen möglichen Ausgang.",
    "Immer die Menge aller möglichen Ausgänge.",
  ],
  [
    "ereignis",
    "Was bezeichnet ein Ereignis eines Zufallsexperiments?",
    "Eine Teilmenge der Ergebnismenge.",
    "Die Anzahl der bereits ausgeführten Versuche.",
  ],
  [
    "muenzen-reihenfolge",
    "Sind Kopf–Zahl und Zahl–Kopf beim zweimaligen geordneten Münzwurf dasselbe Ergebnis?",
    "Nein, die Reihenfolge unterscheidet die Ergebnisse.",
    "Ja, die Reihenfolge spielt bei einem geordneten Versuch keine Rolle.",
  ],
]);
group("dz-2-baum-tafel", [
  [
    "baum-pfad",
    "Was entspricht beim geordneten zweistufigen Münzexperiment einem vollständigen Pfad im Baumdiagramm?",
    "Genau einem Ergebnis des gesamten Experiments.",
    "Nur dem Ergebnis des ersten Wurfs.",
  ],
  [
    "tafel-zeile",
    "Welche Ergebnisse zählt die Randzahl erster Wurf Kopf beim zweimaligen Münzwurf?",
    "Kopf–Kopf und Kopf–Zahl.",
    "Kopf–Kopf und Zahl–Kopf.",
  ],
  [
    "tafel-spalte",
    "Welche Ergebnisse zählt die Randzahl zweiter Wurf Kopf beim zweimaligen Münzwurf?",
    "Kopf–Kopf und Zahl–Kopf.",
    "Kopf–Kopf und Kopf–Zahl.",
  ],
]);
group("dz-3-haeufigkeiten", [
  [
    "absolute-haeufigkeit",
    "Was ist die absolute Häufigkeit eines Ereignisses?",
    "Die Anzahl seiner beobachteten Treffer.",
    "Sein Trefferanteil in Prozent.",
  ],
  [
    "relative-haeufigkeit",
    "Wie berechnest du die relative Häufigkeit aus Trefferzahl H und positiver Versuchszahl n?",
    math("h=\\frac{H}{n}", "h gleich H geteilt durch n"),
    math("h=\\frac{n}{H}", "h gleich n geteilt durch H"),
  ],
  [
    "haeufigkeit-schwankung",
    "Garantiert ein beobachteter Trefferanteil, welcher Ausgang im nächsten Versuch eintritt?",
    "Nein, der Anteil ist keine Garantie für einen einzelnen nächsten Ausgang.",
    "Ja, nach einer längeren Serie ist der nächste Ausgang sicher festgelegt.",
  ],
]);

export { cards };
