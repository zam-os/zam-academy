import type { Lesson } from "../model/types";
import { check, classify, writing } from "./helpers";

/** Lernbereich 7: Warenaustausch und Kulturtransfer (Längsschnitt). */
export const trade: Lesson[] = [
  {
    id: "g7-handel-am-limes",
    lb: 7,
    title: "Handel und Kulturkontakt am Limes",
    period: "Längsschnitt · Antike (1. bis 3. Jh. n. Chr.)",
    span: [80, 260],
    intro:
      "Wo Güter Grenzen überschreiten, wandern nicht nur Waren mit, sondern auch Wörter, Bauweisen und Gewohnheiten – schon vor fast zweitausend Jahren in Bayern.",
    paragraphs: [
      "Im 1. bis 3. Jahrhundert n. Chr. bildete der Obergermanisch-Rätische Limes quer durch Süddeutschland – von Rheinbrohl über Franken bis zur Donau bei Eining – die befestigte Außengrenze der römischen Provinzen Obergermanien und Raetien gegen die germanischen Gebiete außerhalb des Reiches. Diese Grenze war keine undurchlässige Mauer, sondern eine staatlich überwachte Kontroll- und Zollzone mit Wachtürmen, Kastellen und Durchlässen für Händler.",
      "Der römische Staat steuerte den Handel genau. Kaufleute mussten zugelassene Grenzübergänge nutzen, Waren anmelden und Zölle zahlen; bestimmte Güter wie Waffen durften nicht an germanische Stämme verkauft werden. Dafür tauschten Römer in die eine Richtung feine rote Tongefäße (Terra Sigillata), Glas, Wein, Öl und Metallwaren, während aus Germanien Vieh, Felle, Honig, Bernstein und auch Arbeitskräfte oder Söldner in das Reich gelangten.",
      "Mit den Handelskarren verbreiteten sich Lebensgewohnheiten und Technik. In den Provinzen und im Grenzraum setzte sich die Romanisierung durch: Germanen lernten römische Geldmünzen, Steinbau, Fußbodenheizung, Obstsorten wie Kirschen und Pflaumen sowie lateinische Wörter wie „Mauer“, „Fenster“, „Wein“ oder „Straße“ kennen. Warenaustausch veränderte also dauerhaft Sprache und Alltag auf beiden Seiten.",
    ],
    takeaway:
      "Am Obergermanisch-Rätischen Limes steuerte Rom den Grenzhandel durch Zoll und Kontrollen; durch Romanisierung prägten römische Güter, Technik und Wörter auch germanische Gebiete.",
    sourceIds: ["lehrplan", "limes", "hdbg"],
    quiz: check(
      "Welche Aufgabe erfüllte der Obergermanisch-Rätische Limes für den Handel zwischen Römern und Germanen?",
      "Er diente als kontrollierte Grenze mit festen Übergängen, Zollstationen und Handelsverboten für Waffen.",
      [
        "Er verhinderte über zweihundert Jahre lang jeden Kontakt oder Warentausch zwischen den Nachbarn.",
        "Er war eine reine Wasserleitung, über die Getreide aus Germanien nach Rom verschifft wurde.",
      ],
      [
        "Gerade zahlreiche römische Funde weit nördlich des Limes beweisen regen, aber überwachten Handel.",
        "Der Limes bestand aus Wall, Graben, Palisade, Mauer und Kastellen zur Grenzüberwachung, nicht aus einem Aquädukt.",
      ],
      "Grenzschutz und staatlich gelenkter Handel gingen am Limes Hand in Hand und ermöglichten starken kulturellen Austausch.",
    ),
    diagram: {
      kind: "steps",
      title: "Vom Grenzhandel zum Kulturtransfer am Limes",
      steps: [
        { label: "1 · Staatliche Kontrolle", note: "feste Limes-Durchlässe, Zölle und Ausfuhrverbote (z. B. Waffen)" },
        { label: "2 · Warenaustausch", note: "Glas, Wein und Keramik gegen Felle, Vieh und Bernstein" },
        { label: "3 · Kulturelle Prägung", note: "Romanisierung bringt Geld, Steinbau, Obst und lateinische Lehnwörter" },
      ],
      repeats: false,
      caption:
        "Handel in einer römischen Provinz veränderte nicht nur den Besitz, sondern Alltag, Sprache und Technik.",
    },
    workshop: classify(
      "Politik, Wirtschaft und Kultur am Limes",
      ["Staatliche Steuerung am Limes", "Gehandelte Waren", "Dauerhafter Kulturkontakt (Romanisierung)"],
      [
        [
          "Händler müssen an einem bewachten Limestor anhalten, ihre Fracht zeigen und Zoll entrichten.",
          0,
          "Rom überwachte den Warenverkehr an der Provinzgrenze genau.",
        ],
        [
          "Aus Raetien gelangt rote Terra-Sigillata-Keramik in glänzender Qualität bis weit nach Norden.",
          1,
          "Römische Töpferware war ein begehrtes Handelsgut jenseits der Grenze.",
        ],
        [
          "Unsere heutigen deutschen Wörter „Fenster“ (fenestra), „Mauer“ (murus) und „Wein“ (vinum) stammen aus dem Lateinischen.",
          2,
          "Lehnwörter belegen bis heute die lange Nachwirkung des römisch-germanischen Kontakts.",
        ],
        [
          "Aus den Gebieten nördlich der Donau kommen Tierhäute, Pelze, Vieh und Ostsee-Bernstein.",
          1,
          "Auch das Römische Reich war an Rohstoffen aus germanischen Regionen interessiert.",
        ],
        [
          "Bewohner lernen Steinbau mit Mörtel, Geldwirtschaft und neue Gartenfrüchte kennen.",
          2,
          "Technik und Ernährungsgewohnheiten überdauerten das Ende der römischen Herrschaft.",
        ],
      ],
      "Der Limes zeigt schon in der Antike, wie eng politische Grenzpolitik, Handel und kultureller Austausch zusammenhängen.",
    ),
    tasks: {
      1: writing(
        "Erkläre am Beispiel des Obergermanisch-Rätischen Limes, wie der römische Staat den Handel steuerte und welche dauerhaften Spuren der Kulturkontakt hinterließ.",
        [
          "Nenne Zölle, Übergänge und Waren in beide Richtungen.",
          "Erkläre den Begriff Romanisierung mit Beispielen aus Alltag oder Sprache.",
        ],
        "Der Limes sicherte als Außengrenze die römischen Provinzen Obergermanien und Raetien, schottete das Römische Reich aber nicht völlig ab, sondern diente als kontrollierte Zoll- und Sicherheitsgrenze mit festen Durchlässen und Waffenausfuhrverbot. Über ihn tauschten Römer Keramik, Glas, Wein und Metallwaren gegen Felle, Vieh und Bernstein ein. Durch diese Romanisierung blieben Steinbautechnik, Geldnutzung, neue Obstsorten und lateinische Wörter wie „Mauer“ oder „Straße“ langfristig erhalten.",
        [
          "Staatliche Steuerung am Limes erklärt",
          "Warenaustausch in beide Richtungen genannt",
          "Romanisierung mit Alltags- oder Sprachbeispiel belegt",
        ],
      ),
      2: writing(
        "Beurteile die Behauptung: „Eine Staatsgrenze wie der Limes hat nur die Aufgabe, Kulturen voneinander abzuschotten.“",
        [
          "Prüfe anhand von Kontrollfunktion, Warenaustausch und Sprachspuren.",
          "Beziehe auch ein Beispiel für geregelte Grenzen heute ein.",
        ],
        "Diese Behauptung greift zu kurz. Zwar diente der Limes militärisch der Sicherheit der Provinzen vor Überfällen, gleichzeitig wirkte er jedoch wie ein Filter und Treffpunkt für Handel und Kontakte. An den Kastellen entstanden Zivilsiedlungen, und Güter wie Sprache wanderten über die Grenze hinweg. Auch heute regeln Zoll- und Außengrenzen meist sowohl Sicherheit als auch Austausch.",
        [
          "Militärische Schutzfunktion anerkannt",
          "Kontakt- und Austauschfunktion am Limes belegt",
          "Urteil mit Bezug auf geregelten Austausch begründet",
        ],
      ),
    },
  },
  {
    id: "g7-hanse-und-fugger",
    lb: 7,
    title: "Hanse und Fugger: Handelsnetze und Kulturtransfer",
    period: "Längsschnitt · Mittelalter und Frühe Neuzeit",
    span: [1200, 1600],
    intro:
      "Im Norden prägte der Städtebund der Hanse den Ost- und Nordseehandel; im Süden stieg die Augsburger Familie Fugger zu Geldgebern von Kaisern und zu großen Kunststiftern auf.",
    paragraphs: [
      "Zwischen dem 13. und 16. Jahrhundert verband die Hanse bis zu 200 Städte rund um Nord- und Ostsee – von Brügge und London über Lübeck und Hamburg bis nach Nowgorod. Ursprünglich ein Zusammenschluss von Kaufleuten zum Schutz vor Seeräubern und hohen Zöllen, unterhielten die Hansestädte feste Handelsniederlassungen im Ausland (Kontore), sicherten sich gemeinsame Handelsprivilegien, stimmten sich auf Hansetagen ab und nutzten leistungsfähige Schiffstypen wie die Kogge (viele Ostseestädte galten zudem nach lübischem Stadtrecht, ohne dass die Hanse ein eigenes Bundesgesetzbuch oder Einheitsmaß besaß). Der wirtschaftliche Erfolg prägte über Ländergrenzen hinweg Backsteingotik, Rathäuser und städtische Kultur in Nordeuropa.",
      "Zur selben Zeit im Übergang vom Mittelalter zur Neuzeit entstand in Süddeutschland der Frühkapitalismus – besonders sichtbar am Aufstieg der Familie Fugger in Augsburg. Jakob Fugger „der Reiche“ (1459–1525) handelte mit Barchentstoffen, sicherte sich Kupfer- und Silberbergwerke in Tirol und Ungarn und baute ein europaweites Bank- und Nachrichtennetz bis nach Lissabon, Rom und Antwerpen auf.",
      "Die Fugger verknüpften Wirtschaft direkt mit Politik und Kultur. Als Bankiers liehen sie Kaiser Maximilian I. und vor allem Karl V. 1519 riesige Summen zur Bezahlung der Kurfürsten und wirkten so als „Königsmacher“ der Reichspolitik. Zugleich traten sie in Augsburg als bedeutende Mäzene der Renaissance und soziale Stifter hervor – etwa mit prachtvollen Kunstwerken und der bis heute bestehenden Sozialsiedlung Fuggerei für bedürftige Bürger.",
    ],
    takeaway:
      "Hanse im Norden und Fugger in Augsburg zeigen die enge Wechselwirkung von erfolgreichem Fernhandel, politischem Einfluss und bleibender Prägung von Architektur, Kunst und Stadtkultur.",
    sourceIds: ["lehrplan", "pw-hanse", "hanse", "fugger"],
    quiz: check(
      "Wie nutzten die Augsburger Fugger um 1500 ihren riesigen Reichtum aus Bergbau und Bankgeschäften über den reinen Handel hinaus?",
      "Sie beeinflussten durch Kredite Königswahlen und wirkten als Kunstmäzene sowie soziale Stifter in Augsburg.",
      [
        "Sie gründeten alle Hansestädte an der Ostsee und verboten dort jede andere Münzart.",
        "Sie verteilten ihren gesamten Gewinn sofort an alle Leibeigenen in ganz Frankreich.",
      ],
      [
        "Die Hanse war ein selbstständiger Städtebund im Nord- und Ostseeraum, nicht eine Gründung der Augsburger Fugger.",
        "Die Fugger handelten als süddeutsche Kaufleute und Bankiers in ganz Europa und stifteten etwa die Augsburger Fuggerei.",
      ],
      "An der Hanse wie an den Fuggern lässt sich ablesen, wie wirtschaftliche Netze politische Macht und kulturelle Leistungen miteinander verbinden.",
    ),
    diagram: {
      kind: "compare",
      title: "Zwei große Handelsmächte im Vergleich",
      columns: ["Hanse (Nord- & Ostsee)", "Fugger (Augsburg & Europa)"],
      rows: [
        {
          aspect: "Organisation",
          values: ["Bund vieler Städte mit Kontoren im Ausland", "einzelnes Familienunternehmen (Handels- und Bankhaus)"],
        },
        {
          aspect: "Güter & Geschäfte",
          values: ["Hering, Salz, Holz, Pelze, Getreide und Tuche", "Textilien, Kupfer- und Silberbergbau, Staatskredite"],
        },
        {
          aspect: "Politik & Kultur",
          values: ["Handelsprivilegien, Seeräuberabwehr, Backsteingotik", "„Königsmacher“ bei Karl V., Renaissancekunst und Fuggerei"],
        },
      ],
      caption:
        "Ob Städtebund oder Familienkonzern: Überregionaler Erfolg veränderte Bauwerke, Kunst und Politik in vielen Städten.",
    },
    workshop: classify(
      "Hanse und Fugger: Wirtschaft, Politik und Kulturtransfer",
      ["Handelsnetz der Hanse", "Wirken der Fugger (Wirtschaft & Politik)", "Kulturelle Leistung / Transfer"],
      [
        [
          "Kaufleute aus Lübeck und Hamburg unterhalten in Brügge, Bergen und Nowgorod feste Kontore.",
          0,
          "Gemeinsame Auslandsniederlassungen sicherten der Hanse Schutz und Vorrechte.",
        ],
        [
          "Jakob Fugger finanziert 1519 mit riesigen Krediten die Wahl Kaiser Karls V. bei den Kurfürsten.",
          1,
          "Wirtschaftsmacht verschaffte den Fuggern direkten Einfluss auf höchste Reichspolitik.",
        ],
        [
          "Entlang der gesamten Ostseeküste entstehen prachtvolle Rathäuser und Kirchen im Stil der Backsteingotik.",
          2,
          "Mit dem Handelsnetz der Hanse wanderten auch Bauformen und städtische Lebensweisen mit.",
        ],
        [
          "In Augsburg gründen die Fugger die Fuggerei als Sozialsiedlung und fördern Künstler der Renaissance.",
          2,
          "Als Mäzene und Stifter brachten die Fugger italienische Kunstformen nach Süddeutschland.",
        ],
        [
          "Koggen transportieren sperrige Güter wie Salz, Getreide und Holz kostengünstig über das Meer.",
          0,
          "Die leistungsfähige Schifffahrt bildete das wirtschaftliche Rückgrat des Hansebundes.",
        ],
      ],
      "Fernhandel verbindet weit entfernte Märkte mit Ideen, Architektur und politischem Gewicht.",
    ),
    tasks: {
      1: writing(
        "Erkläre entweder am Beispiel der Hanse oder am Beispiel der Fugger, wie wirtschaftlicher Erfolg, politische Macht und kulturelle Leistungen zusammenhingen.",
        [
          "Nenne zuerst die geschäftliche Grundlage (Städtebund/Kontore bzw. Bergbau/Bankhaus).",
          "Belege dann den politischen Einfluss und ein kulturelles Ergebnis (z. B. Backsteingotik bzw. Mäzenatentum/Fuggerei).",
        ],
        "Die Augsburger Familie Fugger erwarb durch Tuchhandel, Kupfer- und Silberbergwerke sowie europaweite Bankgeschäfte enormen Reichtum. Politisch wirkten sie als „Königsmacher“, indem sie etwa 1519 die Wahl Kaiser Karls V. durch hohe Kredite ermöglichten. Kulturell zeigten sie diesen Einfluss als Mäzene neuer Renaissance-Kunst in Augsburg und als Stifter der bis heute bestehenden Fuggerei für bedürftige Bürger.",
        [
          "Wirtschaftliche Grundlage korrekt beschrieben",
          "Politischen Einfluss belegt",
          "Kulturellen Transfer oder Stiftung benannt",
        ],
      ),
      2: writing(
        "Vergleiche das Handelsnetz der mittelalterlichen Hanse kurz mit dem Familienunternehmen der Fugger in der Frühen Neuzeit.",
        [
          "Nenne je eine gemeinsame Wirkung auf Städte und Kultur.",
          "Nenne einen klaren Unterschied in der Organisationsform.",
        ],
        "Beide verknüpften weiträumigen Handel über Landesgrenzen hinweg mit politischer Durchsetzungskraft und prägten durch Reichtum die Architektur und Kultur ihrer Städte, etwa die Backsteingotik im Norden oder Renaissancebauten in Augsburg. Während die Hanse jedoch ein breiter Verbund vieler selbstverwalteter Städte auf Genossenschaftsbasis war, steuerte bei den Fuggern eine einzige Familie zentral Bergwerke, Kredite und politische Geschäfte.",
        [
          "Gemeinsamkeit bei Raumwirkung und Kultur genannt",
          "Unterschied (Städtebund vs. Familienunternehmen) herausgearbeitet",
          "Historische Epochen richtig eingeordnet",
        ],
      ),
    },
  },
  {
    id: "g7-welthandel-heute",
    lb: 7,
    title: "Vom Fernhandel zur Globalisierung heute",
    period: "Längsschnitt · Antike bis Gegenwart",
    span: [1500, 2026],
    intro:
      "Früher brauchten Gewürze oder Nachrichten Monate per Kogge oder Postreiter. Heute treffen Waren, Daten und Trends aus aller Welt täglich auf unserem Tisch und Smartphone ein.",
    paragraphs: [
      "Der Blick durch die Epochen von der Antike über das Mittelalter bis zur Neuzeit zeigt eine durchgehende Konstante: Wirtschaftlicher Austausch bringt stets politischen Regelungsbedarf und kulturellen Transfer mit sich. Am Limes reisten Keramik und Wörter noch auf Ochsenkarren oder Flussschiffen; in der Hanse und bei den Fuggern vernetzten Kontore und Kuriernetze ganz Europa; ab 1492 verband der Atlantikhandel erstmals alle Kontinente.",
      "Heute sprechen wir von Globalisierung. Containerschiffe, Flugfracht und das Internet senken Transportzeiten und Informationskosten auf einen Bruchteil früherer Jahrhunderte. Ein Smartphone oder Kleidungsstück vereinigt Rohstoffe aus Südamerika oder Afrika, Entwicklung in den USA oder Europa und Fertigung in Asien. Mit den Produkten reisen auch Musik, Sprachen, Esskultur und Ideen rund um die Erde.",
      "Zugleich zeigen sich klare Unterschiede zu früher. Während am Limes und in der Hanse wenige Luxus- oder Massengüter reisten und lokale Krisen oft begrenzt blieben, greifen globale Lieferketten heute bis in den Alltag jedes Menschen ein – einschließlich weltweiter Umweltfolgen, Arbeitsstandards in fernen Fabriken und internationaler Handelsregeln. Wer frühere Handelsnetze kennt, erkennt hinter heutigen Debatten über fairen Handel oder Lieferabhängigkeiten dieselbe Grundfrage nach gerechtem Ausgleich.",
    ],
    takeaway:
      "Von der Antike bis zur heutigen Globalisierung sind Wirtschaft, Politik und Kultur verflochten – gestiegen sind vor allem Tempo, Reichweite und weltweite Abhängigkeit.",
    sourceIds: ["lehrplan", "bpb-global", "hanse"],
    quiz: check(
      "Worin liegt ein zentraler Unterschied zwischen dem Fernhandel der Vormoderne und der heutigen Globalisierung?",
      "Tempo, tägliche Alltagsverflechtung und weltweite Lieferketten für Alltagsprodukte sind heute ungleich größer.",
      [
        "In der Antike und im Mittelalter gab es überhaupt keinen kulturellen Austausch zwischen verschiedenen Regionen.",
        "Heute haben politische Entscheidungen, Zölle und Verträge keinerlei Einfluss mehr auf den Welthandel.",
      ],
      [
        "Schon am Limes und über die Hanse wanderten neben Waren auch Sprache, Bauformen und Alltagsgewohnheiten.",
        "Gerade heute bestimmen internationale Abkommen, Zölle und Menschenrechtsregeln den Welthandel maßgeblich mit.",
      ],
      "Während das Grundprinzip von Handel und Kulturkontakt alt ist, verbinden digitale Netze und Containerschiffe heute jeden Kontinent binnen Stunden oder Tagen.",
    ),
    workshop: classify(
      "Damals und heute: Konstante oder Wandel?",
      ["Schon früher (Antike bis Frühe Neuzeit)", "Neu in der heutigen Globalisierung", "Durchgehender Zusammenhang"],
      [
        [
          "Karren und Segelschiffe transportieren ausgewählte Güter wie Wein, Salz oder Gewürze über Wochen und Monate.",
          0,
          "Langsame Transporte begrenzten früher die Menge an leicht verderblichen Alltagswaren.",
        ],
        [
          "Ein einziges Produkt entsteht arbeitsteilig über fünf Kontinente hinweg und wird digital in Echtzeit bestellt.",
          1,
          "Sekundenschnelle Kommunikation und weltweite Arbeitsteilung prägen das 21. Jahrhundert.",
        ],
        [
          "Wo Länder miteinander handeln, wandern Speisen, Wörter, Mode und Kulturtechniken mit den Waren mit.",
          2,
          "Von der Romanisierung bis zu heutiger Popkultur bleibt Handel ein Motor des Kulturkontakts.",
        ],
        [
          "Staaten oder Bündnisse verhandeln über Zölle, Sicherheitsregeln und Handelsrechte entlang wichtiger Routen.",
          2,
          "Politik und Wirtschaft greifen am Limes genauso ineinander wie in heutigen Handelsabkommen.",
        ],
        [
          "Klima- und Umweltfolgen weltweiter Transporte betreffen die gesamte Erde gleichzeitig.",
          1,
          "Die Größenordnung moderner Produktion stellt globale Fragen an Nachhaltigkeit und Verantwortung.",
        ],
      ],
      "Der historische Längsschnitt zeigt: Globalisierung fiel nicht vom Himmel, sondern wuchs Schritt für Schritt aus alten Handelsnetzen.",
    ),
    tasks: {
      1: writing(
        "Nenne je zwei Gemeinsamkeiten und zwei Unterschiede zwischen dem Fernhandel in Antike/Mittelalter (z. B. Limes, Hanse) und der heutigen Globalisierung.",
        [
          "Denke bei Gemeinsamkeiten an politische Regeln und Kulturkontakt.",
          "Denke bei Unterschieden an Tempo, Reichweite und Alltagsprodukte.",
        ],
        "Gemeinsam ist damals wie heute, dass Handel stets Kulturkontakt mitbringt – etwa neue Wörter oder Gerichte – und von Staaten oder Städten durch Zölle und Verträge politisch geregelt wird. Unterschiedlich sind vor allem das Tempo durch Flugzeuge, Containerschiffe und Internet sowie die globale Arbeitsteilung: Während früher meist wenige Waren über Wochen reisten, hängen heute fast alle Alltagsprodukte von weltweiten Lieferketten ab.",
        [
          "Zwei Gemeinsamkeiten genannt",
          "Zwei Unterschiede benannt",
          "Konkretes Beispiel aus früheren Epochen eingebaut",
        ],
      ),
      2: writing(
        "Erkläre am Beispiel eines Produkts aus deinem Alltag (z. B. Smartphone, T-Shirt oder Schokolade), wie Wirtschaft, Politik und Kultur darin wie in früheren Epochen zusammenwirken.",
        [
          "Verfolge Herkunft der Rohstoffe/Herstellung (Wirtschaft) und politische Regeln (Zölle, Arbeits- und Umweltgesetze).",
          "Zeige auch einen kulturellen Aspekt (Marke, Sprache, Gewohnheit).",
        ],
        "Bei einer Tafel Schokolade kommen Kakaobohnen oft aus Westafrika oder Südamerika – eine Nutzpflanze, die erst nach 1492 nach Europa gelangte und heute zur Alltagskultur gehört. Wirtschaftlich verknüpft die Herstellung Anbaugebiete, Transportwege und Fabriken weltweit. Politisch entscheiden Handelsabkommen, Zölle sowie Lieferketten- und Kinderschutzgesetze darüber, wie fair die Bauern bezahlt und wie streng Umweltstandards eingehalten werden.",
        [
          "Alltagsprodukt konkret analysiert",
          "Wirtschaftliche und politische Ebene verbunden",
          "Kulturellen oder historischen Bezug eingebaut",
        ],
      ),
    },
  },
];
