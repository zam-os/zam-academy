import {
  arrow,
  barRow,
  expGroup,
  explorerCards,
  explorerChain,
  explorerCompare,
  type ExplorerPart,
  label,
  labels,
  P,
  panel,
  person,
  svg,
} from "./draw";

export interface ExplorerFigureOutput {
  svg: string;
  parts: ExplorerPart[];
}

export function werteVergleich(active = 0): ExplorerFigureOutput {
  const bars = [
    {
      name: "Freundschaft & Vertrauen",
      pct: 82,
      colour: P.teal,
      detail:
        "82 % im Modellbarometer: Persönlicher Rückhalt und Verlässlichkeit stehen bei Jugendlichen meist ganz oben.",
    },
    {
      name: "Familie & Geborgenheit",
      pct: 74,
      colour: P.blue,
      detail:
        "74 % im Modellbarometer: Trotz Wunsch nach Selbstständigkeit bleibt Familie ein zentraler Anker.",
    },
    {
      name: "Umwelt- & Klimaschutz",
      pct: 61,
      colour: P.green,
      detail:
        "61 % im Modellbarometer: Zukunftsfragen wie Klima und Nachhaltigkeit bewegen viele, aber unterschiedlich stark.",
    },
    {
      name: "Politisches Mitreden",
      pct: 48,
      colour: P.amber,
      detail:
        "48 % im Modellbarometer: Fast die Hälfte sucht Einfluss, andere fühlen sich von Parteipolitik weiter entfernt.",
    },
  ];
  const body = `${panel(8, 8, 624, 214, "panel-bg")}
    ${label(24, 32, "Fiktives Klassenbarometer (n = 100): Was ist dir sehr wichtig?", "lbl small strong", "start")}
    ${bars
      .map((b, i) => {
        const y = 58 + i * 38;
        return expGroup(
          i,
          active,
          b.name,
          `<rect class="exp-frame" x="18" y="${y - 20}" width="604" height="34" rx="8" fill="var(--surface)" stroke="var(--line)"/>
           ${barRow(28, y - 2, 584, b.pct / 100, b.colour, b.name, `${b.pct} %`)}`,
        );
      })
      .join("")}`;
  return {
    svg: svg(640, 230, "Maßstäbliches Balkendiagramm eines fiktiven Jugendbarometers zu vier Wertebereichen", body),
    parts: bars.map((b) => ({ label: b.name, detail: b.detail })),
  };
}

export function generationenVergleich(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Jugendphase im Generationenvergleich: Großeltern-, Eltern- und heutige Generation",
    [
      {
        head: "Großeltern (1960er/70er)",
        body: "Oft Haupt-/Volksschule bis 15/16\nFrüher Einstieg in Lehre/Beruf\nKurze Übergangsphase",
        colour: P.amber,
        detail:
          "Wirtschaftliche Eigenständigkeit, Heirat und eigener Haushalt begannen oft schon um das 20. Lebensjahr.",
      },
      {
        head: "Eltern (1990er/2000er)",
        body: "Längere Schulwege\nEigene Jugend- & Musikszene\nMehr Wahl bei Beruf & Freizeit",
        colour: P.blue,
        detail:
          "Die Jugendphase dehnte sich in die frühen Zwanziger aus; Freizeitkultur, frühe Medien und Bildung gewannen Gewicht.",
      },
      {
        head: "Heute (Gegenwart)",
        body: "Vielfältige Bildungswege\nDigitaler Alltag & Netzwerke\nMehr Freiheit, hoher Wahldruck",
        colour: P.teal,
        detail:
          "Übergänge ins Erwachsenenalter liegen oft später; gleichzeitig fordert eine offene Zukunft frühe eigene Orientierung.",
      },
    ],
    active,
  );
}

export function peergroupEinfluss(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Einflussfelder rund um die eigene Identitätsfindung",
    [
      {
        head: "Ich (eigene Werte & Ziele)",
        body: "Eigene Stärken und Grenzen\nSelbstbestimmte Entscheidungen",
        colour: P.teal,
        detail:
          "In der Mitte steht die Frage: Was passt wirklich zu mir und wofür möchte ich einstehen?",
      },
      {
        head: "Peergroup (Gleichaltrige)",
        body: "Anerkennung auf Augenhöhe\nRisiko: Anpassungsdruck",
        colour: P.amber,
        detail:
          "Freundeskreise geben Rückhalt und üben Selbstständigkeit – verlangen aber manchmal ungeschriebene Anpassung.",
      },
      {
        head: "Familie",
        body: "Grundwerte & Verlässlichkeit\nReibung beim Loslösen",
        colour: P.blue,
        detail:
          "Eltern und Geschwister geben Sicherheit, während du schrittweise eigene Positionen aushandelst.",
      },
      {
        head: "Schule & Medien",
        body: "Leistungsregeln & Vorbilder\nVergleichsdruck durch Feeds",
        colour: P.plum,
        detail:
          "Schule fordert Urteilskraft und Können; soziale Medien setzen oft unrealistische Maßstäbe für Aussehen und Erfolg.",
      },
    ],
    active,
  );
}

export function jugendkulturenVergleich(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Vergleich historischer und aktueller Jugendkulturen anhand von vier Kriterien",
    [
      {
        head: "1950er: Halbstarke",
        body: "Lederjacken & Rock ’n’ Roll\nProteste gegen strenge Sitten",
        colour: P.rust,
        detail:
          "Nachkriegs-Jugendliche nutzten westliche Musik und Mopeds, um aus engen Verhaltensvorgaben auszubrechen.",
      },
      {
        head: "Späte 1970er: Punk",
        body: "DIY-Kleidung & laute Clubs\nProtest gegen Konsum & Normen",
        colour: P.red,
        detail:
          "Schrille Zeichen und selbstgemachte Hefte (Fanzines) grenzten die Szene scharf gegen den Mainstream ab.",
      },
      {
        head: "1990er: Hip-Hop",
        body: "Rap, Breakdance & Graffiti\nStimme aus Stadtvierteln",
        colour: P.amber,
        detail:
          "Sprache, Rhythmus und Straßenkunst formten globale Ausdrucksmittel – wurden aber rasch auch kommerziell vermarktet.",
      },
      {
        head: "Heute: Digitale Szenen",
        body: "Gaming, Cosplay & Streams\nWeltweite Netzwerke & Memes",
        colour: P.teal,
        detail:
          "Aktuelle Szenen verbinden Online-Plattformen mit lokalen Treffen; Firmen greifen Trends binnen Tagen auf.",
      },
    ],
    active,
  );
}

export function medienNutzungReflexion(active = 0): ExplorerFigureOutput {
  const parts = [
    {
      head: "Dauer & Timing",
      body: "Wie viele Minuten täglich?\nWann stört es Schlaf & Lernen?",
      colour: P.teal,
      detail:
        "Im fiktiven Klassenbild nutzen 15 von 25 Jugendlichen Netze über 120 Minuten täglich – häufig auf Kosten der abendlichen Ruhe.",
    },
    {
      head: "Aktiver vs. passiver Zweck",
      body: "Gezielt lernen & chatten\noder endlos weiterscrollen?",
      colour: P.blue,
      detail:
        "Bewusste Recherche oder Verabredungen nutzen dir; endloses Feed-Scrollen wird von Algorithmen gesteuert.",
    },
    {
      head: "Eigene Steuerung",
      body: "Mitteilungen stumm schalten\nQuellen vor dem Teilen prüfen",
      colour: P.green,
      detail:
        "Kleine technische Grenzen geben dir die Kontrolle über Aufmerksamkeit, Schlaf und eigene Stimmung zurück.",
    },
  ];
  return explorerChain("Drei Prüfpunkte für selbstbestimmte Mediennutzung", parts, active);
}

export function sozialisationsMindmap(active = 0): ExplorerFigureOutput {
  const nodes = [
    {
      x: 130,
      y: 72,
      head: "Familie (primär)",
      sub: "Vertrauen & Sprache",
      c: P.teal,
      detail: "Erste Bezugspersonen prägen Geborgenheit, Alltagssprache und Grundregeln von klein auf.",
    },
    {
      x: 510,
      y: 72,
      head: "Schule",
      sub: "Bildung & Leistungsregeln",
      c: P.blue,
      detail: "Vermittelt Fachwissen, faires Miteinander in größeren Gruppen und gesellschaftliche Regeln.",
    },
    {
      x: 130,
      y: 204,
      head: "Peergroup & Verein",
      sub: "Augenhöhe & Teamgeist",
      c: P.amber,
      detail: "Freundeskreise und Vereine eröffnen eigenes Aushandeln von Normen ohne ständige Aufsicht.",
    },
    {
      x: 510,
      y: 204,
      head: "Medien",
      sub: "Weltbilder & Vorbilder",
      c: P.plum,
      detail: "Nachrichten, Serien und Plattformen beeinflussen Werte, Sprache und Konsumwünsche.",
    },
  ];
  const body = `${panel(8, 8, 624, 260, "panel-bg")}
    ${nodes
      .map(
        (n) =>
          `<line x1="320" y1="138" x2="${n.x}" y2="${n.y}" stroke="${n.c}" stroke-width="2.5" stroke-dasharray="4 3"/>`,
      )
      .join("")}
    <circle cx="320" cy="138" r="44" fill="var(--accent)" stroke="var(--f-halo)" stroke-width="3"/>
    ${labels(320, 134, "Aktives\nIch", "lbl small on-dark strong", "middle", 15)}
    ${nodes
      .map((n, i) =>
        expGroup(
          i,
          active,
          n.head,
          `<rect class="exp-frame" x="${n.x - 102}" y="${n.y - 32}" width="204" height="64" rx="12" fill="var(--surface)" stroke="${n.c}" stroke-width="2"/>
           ${label(n.x, n.y - 6, n.head, "lbl small strong")}
           ${label(n.x, n.y + 16, n.sub, "lbl tiny muted")}`,
        ),
      )
      .join("")}`;
  return {
    svg: svg(640, 276, "Mindmap der wichtigsten Sozialisationsinstanzen rund um das aktive Ich", body),
    parts: nodes.map((n) => ({ label: n.head, detail: n.detail })),
  };
}

export function normenSanktionen(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Wie soziale Normen durch Struktur und Sanktionen in Primärgruppen wirken",
    [
      {
        head: "Soziale Norm",
        body: "Ungeschriebene Erwartung:\n„Verabredungen einhalten“",
        colour: P.blue,
        detail: "Normen legen fest, welches Verhalten in Familie oder Clique als fair und selbstverständlich gilt.",
      },
      {
        head: "Verhalten im Alltag",
        body: "Mitglied hält Regel ein\noder verstößt dagegen",
        colour: P.slate,
        detail: "Im täglichen Miteinander zeigt sich, ob sich jemand an gemeinsame Absprachen hält.",
      },
      {
        head: "Positive Sanktion",
        body: "Lob, Vertrauen, Einladung\n→ Norm wird gestärkt",
        colour: P.green,
        detail: "Anerkennung belohnt verlässliches Handeln und festigt den Zusammenhalt in der Gruppe.",
      },
      {
        head: "Negative Sanktion",
        body: "Tadel, Enttäuschung, Ausschluss\n→ Druck zur Anpassung",
        colour: P.red,
        detail: "Ablehnende Reaktionen sollen künftige Verstöße verhindern – müssen aber fair und verhältnismäßig bleiben.",
      },
    ],
    active,
  );
}

export function gruppenVerhaltenKriterien(active = 0): ExplorerFigureOutput {
  return explorerCompare(
    "Gegenüberstellung: Gruppenförderliches vs. gruppenschädliches Verhalten",
    [
      {
        head: "Gruppenförderlich",
        colour: P.green,
        points: [
          "Absprachen verlässlich einhalten",
          "Ausreden lassen & nachfragen",
          "Sachlich kritisieren ohne Spott",
          "Eigene Fehler offen ansprechen",
        ],
        detail:
          "Gruppenförderliches Verhalten schafft psychologische Sicherheit, sodass alle sich einbringen und gute Lösungen entstehen.",
      },
      {
        head: "Gruppenschädlich",
        colour: P.red,
        points: [
          "Aufgaben auf andere abwälzen",
          "Im Parallelchat über andere lästern",
          "Ruhigere Mitglieder übergehen",
          "Mit Ausschluss bei Widerspruch drohen",
        ],
        detail:
          "Gruppenschädliches Verhalten sät Misstrauen, verhindert ehrliche Kritik und lässt Teams zerfallen.",
      },
    ],
    active,
  );
}

export function konfliktAnalyseKreis(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Vier Schritte zur Konfliktanalyse und gewaltfreien Regelung",
    [
      {
        head: "1. Entstehung klären",
        body: "Auslöser vs. Vorgeschichte\nWas ist konkret passiert?",
        colour: P.amber,
        detail: "Trennt unmittelbaren Anlass von älteren, ungelösten Spannungen.",
      },
      {
        head: "2. Interessen trennen",
        body: "Forderung vs. Bedürfnis\nWarum will jede Seite das?",
        colour: P.blue,
        detail: "Hinter harten Positionen liegen oft verhandelbare Grundbedürfnisse nach Ruhe, Fairness oder Platz.",
      },
      {
        head: "3. Recht & Macht prüfen",
        body: "Welche Regeln gelten?\nWer hat mehr Einfluss?",
        colour: P.plum,
        detail: "Schulordnung und Recht setzen Grenzen gegen das Recht des Stärkeren.",
      },
      {
        head: "4. Gewaltfrei regeln",
        body: "Ich-Botschaften, Kompromiss\noder neutrale Mediation",
        colour: P.green,
        detail: "Respektvoller Austausch oder Streitschlichter helfen zu Lösungen, die beide Seiten mittragen.",
      },
    ],
    active,
  );
}

export function dreiGrundhaltungen(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Drei Grundlagen des Zusammenlebens in Schulklasse und Gesellschaft",
    [
      {
        head: "Fairness",
        body: "Gleiche Chancen für alle\nRegeln auch bei Nachteil achten",
        colour: P.blue,
        detail: "Fairness verhindert Bevorzugung und macht Klassenregeln für alle glaubwürdig.",
      },
      {
        head: "Teamfähigkeit",
        body: "Aufgaben teilen & absprechen\nVerantwortung gemeinsam tragen",
        colour: P.green,
        detail: "Teams kommen weiter, wenn Stärken zusammenwirken und niemand allein gelassen wird.",
      },
      {
        head: "Toleranz (mit klarer Grenze)",
        body: "Vielfalt respektvoll aushalten\nGrenze: Würde & Rechte anderer",
        colour: P.amber,
        detail: "Toleranz achtet andere Lebensweisen und Meinungen, zieht aber bei Mobbing und Diskriminierung eine klare Grenze.",
      },
    ],
    active,
    3,
  );
}

export function wertschaetzungPersonenkult(active = 0): ExplorerFigureOutput {
  return explorerCompare(
    "Wertschätzung vs. Personenkult im Vergleich",
    [
      {
        head: "Sachliche Wertschätzung",
        colour: P.teal,
        points: [
          "Anerkennt konkrete Leistung",
          "Erlaubt sachliche Kritik",
          "Sieht Stärken und Schwächen",
          "Bewahrt eigene Entscheidungsfreiheit",
        ],
        detail:
          "Bei Wertschätzung bleibt das Urteil nüchtern: Man schätzt eine Leistung oder Haltung, ohne eine Person zu vergöttern.",
      },
      {
        head: "Personenkult",
        colour: P.red,
        points: [
          "Erklärt eine Person für unfehlbar",
          "Unterdrückt jeden Widerspruch",
          "Wertet Kritiker als Feinde ab",
          "Erwartet blinde Gefolgschaft",
        ],
        detail:
          "Personenkult schaltet kritisches Denken aus – gefährlich sowohl im extremen Starkult als auch in der Politik.",
      },
    ],
    active,
  );
}

export function vorbildIdolInfluencer(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Drei Orientierungsrollen im Vergleich: Vorbild, Idol und Influencer",
    [
      {
        head: "Vorbild",
        body: "Erreichbare Person oder Tat\nÜberprüfbare Werte im Alltag",
        colour: P.green,
        detail:
          "Trainerinnen, Angehörige oder engagierte Persönlichkeiten zeigen konkretes Verhalten, an dem man sich in Teilen orientiert.",
      },
      {
        head: "Idol",
        body: "Stark idealisierte Starfigur\nGroße Distanz zum Privatalltag",
        colour: P.plum,
        detail:
          "Popstars oder Sportikonen verkörpern Träume von Erfolg, zeigen aber selten ihre alltäglichen Rückschläge.",
      },
      {
        head: "Influencer",
        body: "Große Plattform-Reichweite\nAlltagsnähe + Vermarktung",
        colour: P.amber,
        detail:
          "Creator teilen scheinbar persönliche Tipps, verdienen aber meist über Werbung, Codes oder eigene Marken.",
      },
    ],
    active,
    3,
  );
}

export function medienProduktionSchema(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Wie Identifikationsfiguren medial aufgebaut und vermarktet werden",
    [
      {
        head: "1. Inszenierung",
        body: "Licht, Schnitt, Musik & Story\nAlltag wirkt spontan & perfekt",
        colour: P.plum,
        detail: "Professionelle Gestaltung versteckt Aufwand und Fehlschläge hinter scheinbarer Leichtigkeit.",
      },
      {
        head: "2. Parasoziale Nähe",
        body: "Direkte Kameraansprache\nGefühl einseitiger Freundschaft",
        colour: P.teal,
        detail: "„Hey ihr Lieben“ und private Einblicke erzeugen Vertrauen, obwohl der Kanal ein Millionenpublikum anspricht.",
      },
      {
        head: "3. Verdecktes Interesse",
        body: "Anzeige, Rabattcode, Marke\noder politische Imagepflege",
        colour: P.amber,
        detail: "Kommerzielle und politische Absichten nutzen das aufgebaute Vertrauen gezielt für Reichweite oder Kaufentscheidungen.",
      },
      {
        head: "4. Kritische Prüfung",
        body: "Werbekennzeichnung prüfen\nAusgeblendetes mitdenken",
        colour: P.green,
        detail: "Wer die vier Prüfschritte anwendet, genießt Unterhaltung ohne Manipulation.",
      },
    ],
    active,
  );
}

export function oeffentlichkeitPrivatheit(active = 0): ExplorerFigureOutput {
  const body = `${panel(8, 8, 624, 206, "panel-bg")}
    ${person(320, 128, 1.15, "cloth-a", "up")}
    ${expGroup(
      0,
      active,
      "Chancen von Öffentlichkeit",
      `<rect class="exp-frame" x="24" y="28" width="218" height="78" rx="12" fill="var(--surface)" stroke="${P.green}" stroke-width="2"/>
       ${label(133, 52, "Öffentliche Reichweite", "lbl small strong")}
       ${labels(133, 72, "Gehör finden, Themen setzen,\nAnerkennung & Einkommen", "lbl tiny", "middle", 15)}`,
    )}
    ${expGroup(
      1,
      active,
      "Druck auf Privatheit",
      `<rect class="exp-frame" x="398" y="28" width="218" height="78" rx="12" fill="var(--surface)" stroke="${P.red}" stroke-width="2"/>
       ${label(507, 52, "Schutz der Privatheit", "lbl small strong")}
       ${labels(507, 72, "Dauerbeobachtung, Shitstorms,\nVerlust von Rückzugsräumen", "lbl tiny", "middle", 15)}`,
    )}
    ${expGroup(
      2,
      active,
      "Stilisierung und Mythisierung",
      `<rect class="exp-frame" x="150" y="138" width="340" height="62" rx="12" fill="var(--surface)" stroke="${P.plum}" stroke-width="2"/>
       ${label(320, 160, "Stilisierung & Mythisierung", "lbl small strong")}
       ${label(320, 180, "Aus realen Menschen mit Krisen werden makellose Heldenbilder", "lbl tiny")}`,
    )}
    ${arrow(244, 67, 294, 88)}
    ${arrow(396, 67, 346, 88)}`;
  return {
    svg: svg(640, 222, "Spannungsfeld von Popularität zwischen Reichweite, Privatheit und Mythisierung", body),
    parts: [
      {
        label: "Öffentliche Reichweite",
        detail:
          "Bekanntheit ermöglicht es, gesellschaftliche Anliegen sichtbar zu machen und von eigener Kunst oder Sport zu leben.",
      },
      {
        label: "Schutz der Privatheit",
        detail:
          "Paparazzi, Dauer-Kommentare und digitale Hetze rauben oft den geschützten Rückzugsraum für sich und die Familie.",
      },
      {
        label: "Stilisierung & Mythisierung",
        detail:
          "Glatte Heldengeschichten verschweigen Rückschläge und Teamhilfe – das verzerrt den Blick der Zuschauer auf eigenen Erfolg.",
      },
    ],
  };
}

export function schutzStrategienVorbilder(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Gefahren übertriebener Bindung erkennen und mit Gegenstrategien entschärfen",
    [
      {
        head: "Gefahr: Individualitätsverlust",
        body: "Aussehen & Meinung blind kopieren\nSchutz: Eigene Stärken pflegen",
        colour: P.amber,
        detail:
          "Nimm verschiedene Vorbilder für einzelne Stärken statt eine Figur komplett nachzuahmen.",
      },
      {
        head: "Gefahr: Übertriebene Bindung",
        body: "Reale Freunde vernachlässigen\nSchutz: Offline-Zeit & Gespräche",
        colour: P.plum,
        detail:
          "Vertraute Rückmeldungen aus Familie und Freundeskreis schützen vor einseitiger Abhängigkeit.",
      },
      {
        head: "Gefahr: Fanatismus",
        body: "Kritik an Idolen feindselig bekämpfen\nSchutz: Mehrere Quellen prüfen",
        colour: P.red,
        detail:
          "Wer Gegenstimmen und unabhängige Berichte zulässt, bleibt immun gegen blinde Gefolgschaft.",
      },
      {
        head: "Gefahr: Kauf- & Meinungsdruck",
        body: "Spontankäufe durch Rabattcodes\nSchutz: 48-Stunden-Bedenkzeit",
        colour: P.green,
        detail:
          "Zeitlicher Abstand entlarvt künstliche Verknappung und schützt Geldbeutel wie eigene Haltung.",
      },
    ],
    active,
  );
}
