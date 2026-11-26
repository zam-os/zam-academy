import {
  barRow,
  expGroup,
  explorerCards,
  explorerChain,
  explorerCompare,
  label,
  P,
  panel,
  svg,
} from "./draw";
import type { ExplorerFigureOutput } from "./scenes-lb1-3";

export function heimatSechsDimensionen(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Die sechs Dimensionen des Heimatbegriffs und sein politischer Gebrauch",
    [
      {
        head: "Räumlich & biografisch",
        body: "Landschaft, Viertel, Wege\nKindheits- und Lebensorte",
        colour: P.rust,
        detail:
          "Vertraute Orte und persönliche Erinnerungen prägen das Gefühl von Orientierung und Sicherheit.",
      },
      {
        head: "Emotional & sozial",
        body: "Geborgenheit & Vertrauen\nFamilie, Freunde, Nachbarn",
        colour: P.teal,
        detail:
          "Heimat entsteht vor allem zwischen Menschen – deshalb können auch neu Zugezogene rasch soziale Heimat finden.",
      },
      {
        head: "Kulturell & politisch",
        body: "Dialekt, Feste, Küche\nRechte & Mitsprache in der Gemeinde",
        colour: P.blue,
        detail:
          "Wer mitgestalten darf und kulturell respektiert wird, identifiziert sich leichter mit seinem Wohnort.",
      },
      {
        head: "Integration vs. Ausgrenzung",
        body: "Einladend für alle Bewohner\noder Abgrenzung nach Herkunft?",
        colour: P.amber,
        detail:
          "Politik kann mit „Heimat“ Zusammenhalt stärken – oder künstliche Grenzen gegen Minderheiten ziehen.",
      },
    ],
    active,
  );
}

export function fremdbildEigenbild(active = 0): ExplorerFigureOutput {
  return explorerCompare(
    "Tourismus-Fremdbild und vielfältiges Alltagserleben im Vergleich",
    [
      {
        head: "Fremdbild / Klischee",
        colour: P.amber,
        points: [
          "Nur Postkarten-Berge und Seen",
          "Alle tragen angeblich Tracht",
          "Ausblendung von Industrie & Technik",
          "Konflikte und Alltag unsichtbar",
        ],
        detail:
          "Außenansichten und Werbung greifen auffällige Einzelmotive heraus und verallgemeinern sie oft zum Klischee.",
      },
      {
        head: "Eigenes Alltagsbild",
        colour: P.rust,
        points: [
          "Handwerk, Forschung & Betriebe",
          "Volle Pendlerzüge & Wohnungsfragen",
          "Vielfältige Kulturen in Klassen",
          "Lebendige Vereine neben neuen Trends",
        ],
        detail:
          "Das eigene Erleben verbindet Traditionen mit moderner Wirtschaft, Vielfalt und echten Alltagsherausforderungen.",
      },
    ],
    active,
  );
}

export function traditionWandel(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Brauchtum, Sprache und Vereine zwischen Herkunft und Wandel",
    [
      {
        head: "Gewachsene Wurzeln",
        body: "Feste, Ortsdialekt, Ehrenamt\nStiften Begegnung vor Ort",
        colour: P.rust,
        detail:
          "Traditionen verbinden Generationen und geben Gemeinschaftsleben im Ort Struktur.",
      },
      {
        head: "Gesellschaftlicher Wandel",
        body: "Berufspendeln, Medien,\nvielfältige Familien & Zeitdruck",
        colour: P.slate,
        detail:
          "Veränderte Arbeits- und Schulzeiten lassen starre Vereinsämter oder tiefen Ortsdialekt zurückgehen.",
      },
      {
        head: "Lebendige Anpassung",
        body: "Offene Projektmitarbeit, neue\nMitglieder, Dialekt neu entdeckt",
        colour: P.green,
        detail:
          "Vereine und Bräuche bleiben stark, wenn sie sich für Zugezogene öffnen und flexible Beteiligungsformen anbieten.",
      },
    ],
    active,
  );
}

export function regionTrends(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Entwicklungstrends und Beteiligung in der bayerischen Kommune",
    [
      {
        head: "Demografischer Wandel",
        body: "Alterung vs. Zuzug junger Familien\nFolgen für Kitas, Schulen & Ärzte",
        colour: P.rust,
        detail:
          "Abwanderung junger Erwachsener und steigendes Durchschnittsalter verändern Infrastrukturbedarf grundlegend.",
      },
      {
        head: "Infrastruktur",
        body: "Bus- und Bahnverbindungen\nRadwege, Glasfaser & Jugendräume",
        colour: P.blue,
        detail:
          "Gute Mobilität und digitale Netze entscheiden mit, ob Jugendliche gern in der Region bleiben.",
      },
      {
        head: "Ökologie & Klima",
        body: "Hochwasserschutz & Grünflächen\nErneuerbare Energie vs. Flächenverbrauch",
        colour: P.green,
        detail:
          "Kommunen müssen Naturräume schützen und zugleich Wohnen und Gewerbe nachhaltig planen.",
      },
      {
        head: "Mitwirkung vor Ort",
        body: "Vereine, Ehrenamt, Zukunftswerkstatt\nPolitiker & Lokalmedien befragen",
        colour: P.amber,
        detail:
          "Befragungen von Kommunalpolitikern und eigenes Engagement bringen Jugendinteressen in die Zukunftsplanung ein.",
      },
    ],
    active,
  );
}

export function medienLandschaftVergleich(active = 0): ExplorerFigureOutput {
  const rows = [
    {
      name: "Öffentlich-rechtliche Nachricht",
      score: 88,
      colour: P.blue,
      detail: "Hohe Faktendichte, mehrere Stimmen und überregionale Einordnung – weniger Fokus auf das einzelne Dorf.",
    },
    {
      name: "Regional- / Lokalzeitung",
      score: 82,
      colour: P.teal,
      detail: "Starker Bezug zum eigenen Landkreis, Interviews mit Betroffenen vor Ort und Ratsberichte.",
    },
    {
      name: "Boulevard-Angebot",
      score: 48,
      colour: P.amber,
      detail: "Sehr emotionale, zugespitzte Überschriften; Hintergrund und Gegenargumente kommen oft zu kurz.",
    },
    {
      name: "Kurzer Social-Media-Clip",
      score: 36,
      colour: P.red,
      detail: "Hohe Reichweite in Sekunden, aber extreme Verkürzung – Quellenangabe fehlt häufig.",
    },
  ];
  const body = `${panel(8, 8, 624, 214, "panel-bg")}
    ${label(24, 32, "Modellvergleich zur Informationstiefe & Quellenprüfung (Skala 0 bis 100)", "lbl small strong", "start")}
    ${rows
      .map((r, i) => {
        const y = 58 + i * 38;
        return expGroup(
          i,
          active,
          r.name,
          `<rect class="exp-frame" x="18" y="${y - 20}" width="604" height="34" rx="8" fill="var(--surface)" stroke="var(--line)"/>
           ${barRow(28, y - 2, 584, r.score / 100, r.colour, r.name, `${r.score} Pkt.`)}`,
        );
      })
      .join("")}`;
  return {
    svg: svg(640, 230, "Maßstäblicher Vergleich von vier Medienformaten nach Informationstiefe", body),
    parts: rows.map((r) => ({ label: r.name, detail: r.detail })),
  };
}

export function seriositaetCheck(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Qualität und Seriosität von Berichterstattung in vier Schritten prüfen",
    [
      {
        head: "1. Impressum & Autor",
        body: "Wer verantwortet den Text?\nUnabhängige Redaktion erkennbar?",
        colour: P.slate,
        detail: "Fehlendes Impressum oder anonyme „Insider“ sind ein erstes Warnsignal.",
      },
      {
        head: "2. Belege & Zahlen",
        body: "Studien, Daten & Bezugsgröße\nOriginalquelle nachschlagbar?",
        colour: P.blue,
        detail: "Seriöse Berichte nennen Jahr, Quelle und Grundgesamtheit jeder Statistik.",
      },
      {
        head: "3. Sprache & Textsorte",
        body: "Sachlicher Bericht oder\nmarkierter Kommentar?",
        colour: P.amber,
        detail: "Nachrichten berichten nüchtern; Meinungen gehören erkennbar in den Kommentar.",
      },
      {
        head: "4. Gegenperspektive",
        body: "Kommen Betroffene und\nKritiker fair zu Wort?",
        colour: P.green,
        detail: "Einseitige Berichte blenden wichtige Einwände aus – Zweiseitigkeit stärkt Glaubwürdigkeit.",
      },
    ],
    active,
  );
}

export function umfragePraesentation(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Von der eigenen Umfrage zur freien Rede und fairen Klassendiskussion",
    [
      {
        head: "1. Sauber erheben",
        body: "Neutrale Fragen ohne Druck\nStichprobengröße offen nennen",
        colour: P.teal,
        detail: "Absolute Zahlen (z. B. 12 von 20) plus Prozentangabe verhindern Täuschungen bei kleinen Gruppen.",
      },
      {
        head: "2. Klar präsentieren",
        body: "Fragestellung → Diagramm →\nbegründeter eigener Standpunkt",
        colour: P.blue,
        detail: "Schautafeln und maßstäbliche Balken machen Ergebnisse für Zuhörer in Sekunden verständlich.",
      },
      {
        head: "3. Fair diskutieren",
        body: "Ausreden lassen, auf Argumente\neingehen, eigene Position prüfen",
        colour: P.green,
        detail: "Respektvolle Kommunikationsregeln helfen, neue Argumente aufzunehmen und eigene Urteile zu verfeinern.",
      },
    ],
    active,
  );
}

export function soziogrammLesen(active = 0): ExplorerFigureOutput {
  const parts = [
    {
      label: "Star (zentrale Figur)",
      detail: "Mitglied A erhält vier eingehende Wahlen – zentrale Ansprechperson mit hohem Status.",
    },
    {
      label: "Brückenperson",
      detail: "Mitglied C verbindet Teilgruppe links mit Teilgruppe rechts und hält das Gesamtteam zusammen.",
    },
    {
      label: "Feste Teilgruppe (Clique)",
      detail: "B und D wählen sich gegenseitig stark, haben aber kaum Kontakte nach außen.",
    },
    {
      label: "Randposition (Außenseiter)",
      detail: "Mitglied E erhält im Moment keine eingehende Wahl – Signal für gezielte Einbindung.",
    },
  ];
  const body = `${panel(8, 8, 624, 214, "panel-bg")}
    <!-- Connections -->
    <line x1="120" y1="68" x2="210" y2="112" stroke="${P.red}" stroke-width="2.5"/>
    <line x1="120" y1="164" x2="210" y2="112" stroke="${P.red}" stroke-width="2.5"/>
    <line x1="210" y1="112" x2="340" y2="112" stroke="${P.blue}" stroke-width="2.5"/>
    <line x1="340" y1="112" x2="450" y2="74" stroke="${P.blue}" stroke-width="2.5"/>
    <line x1="450" y1="74" x2="450" y2="156" stroke="${P.amber}" stroke-width="2.5"/>
    <line x1="120" y1="68" x2="120" y2="164" stroke="${P.amber}" stroke-width="2"/>
    <line x1="556" y1="156" x2="450" y2="156" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="4 4"/>
    ${expGroup(
      0,
      active,
      "Star A",
      `<circle class="exp-frame" cx="210" cy="112" r="28" fill="${P.red}" stroke="var(--f-halo)" stroke-width="2"/>
       ${label(210, 117, "A · Star", "lbl tiny on-dark strong")}`,
    )}
    ${expGroup(
      1,
      active,
      "Brücke C",
      `<circle class="exp-frame" cx="340" cy="112" r="28" fill="${P.blue}" stroke="var(--f-halo)" stroke-width="2"/>
       ${label(340, 117, "C · Brücke", "lbl tiny on-dark strong")}`,
    )}
    ${expGroup(
      2,
      active,
      "Paar / Clique B & D",
      `<circle class="exp-frame" cx="120" cy="68" r="23" fill="${P.amber}" stroke="var(--f-halo)" stroke-width="2"/>
       ${label(120, 72, "B", "lbl tiny on-dark strong")}
       <circle class="exp-frame" cx="120" cy="164" r="23" fill="${P.amber}" stroke="var(--f-halo)" stroke-width="2"/>
       ${label(120, 168, "D", "lbl tiny on-dark strong")}`,
    )}
    ${expGroup(
      3,
      active,
      "Randposition E",
      `<circle class="exp-frame" cx="556" cy="156" r="25" fill="var(--surface)" stroke="${P.slate}" stroke-width="2.5"/>
       ${label(556, 160, "E · Rand", "lbl tiny strong")}`,
    )}
    <circle cx="450" cy="74" r="21" fill="${P.green}" stroke="var(--f-halo)" stroke-width="2"/>
    ${label(450, 78, "F", "lbl tiny on-dark strong")}
    <circle cx="450" cy="156" r="21" fill="${P.green}" stroke="var(--f-halo)" stroke-width="2"/>
    ${label(450, 160, "G", "lbl tiny on-dark strong")}
    ${label(320, 206, "Momentaufnahme von Gruppenbeziehungen (durchgezogen: gegenseitig; gestrichelt: einseitig)", "lbl tiny muted")}`;
  return {
    svg: svg(640, 230, "Beispiel-Soziogramm mit Star, Brücke, Teilgruppe und Randposition", body),
    parts,
  };
}

export function fuehrungsstileVergleich(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Drei Führungsstile und ihre Wirkung auf Selbst- und Fremdbestimmung",
    [
      {
        head: "Autoritär",
        body: "Leitung bestimmt alles allein\nAnpassungsdruck, kaum Initiative",
        colour: P.red,
        detail:
          "Schnell in akuten Notfällen, im Projektalltag jedoch stark fremdbestimmt und demotivierend.",
      },
      {
        head: "Demokratisch (kooperativ)",
        body: "Gemeinsame Planung & klare Regeln\nHohe Motivation & Selbstbestimmung",
        colour: P.green,
        detail:
          "Fördert Verantwortung, faires Zuhören und langlebige Ergebnisse im Team.",
      },
      {
        head: "Laissez-faire",
        body: "Kaum Vorgaben oder Rückmeldung\nGefahr: Chaos & heimliche Machtkämpfe",
        colour: P.amber,
        detail:
          "Ohne Orientierung verliert eine Gruppe Zeit, und wenige Laute übernehmen informell das Kommando.",
      },
    ],
    active,
    3,
  );
}

export function rollenkonfliktTeam(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Rollenkonflikte verstehen und durch Teamarbeit produktiv auflösen",
    [
      {
        head: "Inter-Rollenkonflikt",
        body: "Zwei verschiedene Rollen kollidieren\n(z. B. Verein vs. Familie)",
        colour: P.red,
        detail:
          "Zeit- oder Pflichtkonflikte zwischen zwei unterschiedlichen Lebensbereichen verlangen klare Prioritäten.",
      },
      {
        head: "Intra-Rollenkonflikt",
        body: "Widerspruch innerhalb einer Rolle\n(z. B. Klassensprecherin)",
        colour: P.amber,
        detail:
          "Mitschüler und Lehrkraft erwarten von derselben Funktion Gegensätzliches – Transparenz hilft.",
      },
      {
        head: "Stärken von Teamarbeit",
        body: "Arbeitsökonomie & Wissensaustausch\nKomplexe Aufgaben meistern",
        colour: P.green,
        detail:
          "Verschiedene Talente teilen sich Aufgaben klug und kontrollieren Fehler gegenseitig.",
      },
      {
        head: "Grenzen von Teamarbeit",
        body: "Hoher Abstimmungsbedarf\nGefahr des Trittbrettfahrens",
        colour: P.slate,
        detail:
          "Ohne klare Fristen und Zuständigkeiten verliert ein Team mehr Zeit durch Reden als durch Arbeiten.",
      },
    ],
    active,
  );
}

export function vorurteileAbbau(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Vom Gruppendenken zum bewussten Abbau von Vorurteilen",
    [
      {
        head: "1. Eigengruppe vs. Fremde",
        body: "Schnelle Schubladen im Kopf\nFavorisierung der eigenen Gruppe",
        colour: P.amber,
        detail:
          "Verhaltensexperimente zeigen, wie leicht bloße Gruppenzuweisung „Wir gegen Die“ auslöst.",
      },
      {
        head: "2. Risiko: Diskriminierung",
        body: "Gerüchte & Machtgefälle\nUngleiche Behandlung anderer",
        colour: P.red,
        detail:
          "Ohne Kontrolle und Empathie führt Vorurteilsbildung zu Ausgrenzung und Machtmissbrauch.",
      },
      {
        head: "3. Weg: Fakten & Kontakt",
        body: "Geprüfte Information einholen\nPersönliches Gespräch suchen",
        colour: P.blue,
        detail:
          "Konkretes Wissen über Einzelpersonen ersetzt pauschale Gruppenbilder.",
      },
      {
        head: "4. Gemeinsame Ziele",
        body: "Zusammenarbeit auf Augenhöhe\nSelbstkritische Reflexion",
        colour: P.green,
        detail:
          "Geteilte Aufgaben (wie im Ferienlager-Experiment) bauen Misstrauen durch gemeinsame Erfolge ab.",
      },
    ],
    active,
  );
}

export function mobbingMassenpsychologie(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Schutz der Menschenwürde gegen Mobbing und Massensog",
    [
      {
        head: "Unantastbare Würde (Art. 1 GG)",
        body: "Gleicher Wert jedes Menschen\nSchutz vor Demütigung & Gewalt",
        colour: P.blue,
        detail:
          "Niemand darf zum Ziel systematischer Herabwürdigung gemacht werden – weder offline noch im Klassenchat.",
      },
      {
        head: "Systematisches Mobbing",
        body: "Wiederholt, gezielt, überlegen\nSchikane oder Ausgrenzung",
        colour: P.red,
        detail:
          "Anders als ein kurzer Streit zermürbt dauerhaftes Mobbing die Betroffenen oft über Monate.",
      },
      {
        head: "Massenpsychologie",
        body: "Verantwortungsdiffusion & Symbole\nKonformitätsdruck in Großgruppen",
        colour: P.amber,
        detail:
          "In großen Mengen sinkt das persönliche Schuldbewusstsein; einheitliche Zeichen verstärken Mitläufertum.",
      },
      {
        head: "Gegenmittel: Zivilcourage",
        body: "Nicht mitlachen, klar widersprechen\nBetroffene stärken, Hilfe holen",
        colour: P.green,
        detail:
          "Schon ein bis zwei mutige Gegenstimmen brechen das Gefühl vermeintlicher Einigkeit in der Gruppe.",
      },
    ],
    active,
  );
}

export function gesundheitsDimensionen(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Die drei Dimensionen von Gesundheit und typische Gefährdungen",
    [
      {
        head: "Physische Gesundheit",
        body: "Schlaf, Bewegung, Ernährung\nGefahr: Mangel, Sucht, Überlastung",
        colour: P.olive,
        detail:
          "Körperliche Fitness hängt von ausreichend Schlaf, Alltagsbewegung und nährstoffreicher Kost ab.",
      },
      {
        head: "Psychische Gesundheit",
        body: "Ausgeglichenheit & Selbstwert\nGefahr: Dauerstress & Vergleichsdruck",
        colour: P.teal,
        detail:
          "Erholungszeiten, realistische Erwartungen und offene Gespräche schützen vor seelischer Erschöpfung.",
      },
      {
        head: "Soziale Gesundheit",
        body: "Vertrauensvolle Beziehungen\nGefahr: Isolation & Ausgrenzung",
        colour: P.blue,
        detail:
          "Freundschaften, Familie und ein respektvolles Schulklima tragen Körper und Psyche gemeinsam.",
      },
    ],
    active,
    3,
  );
}

export function naehrstoffBausteine(active = 0): ExplorerFigureOutput {
  const rows = [
    {
      name: "Wasser & ungesüßter Tee",
      pct: 100,
      colour: P.teal,
      detail: "Mindestens 1,5 Liter pro Tag: Basis für Konzentration, Kreislauf und Stoffwechsel ohne leeren Zucker.",
    },
    {
      name: "Gemüse, Obst & Vollkorn",
      pct: 75,
      colour: P.olive,
      detail: "Liefern komplexe Kohlenhydrate, Ballaststoffe, Vitamine und Mineralstoffe für langanhaltende Sättigung.",
    },
    {
      name: "Eiweißreiche Kost (Milch, Hülsenfrüchte, Fisch)",
      pct: 42,
      colour: P.blue,
      detail: "Baustoffe für Muskeln, Enzyme und Immunsystem – sinnvoll verteilt auf Hauptmahlzeiten und Pausenbrot.",
    },
    {
      name: "Hochwertige Fette & sparsamer Zucker",
      pct: 18,
      colour: P.amber,
      detail: "Pflanzliche Öle und Nüsse in kleinen Mengen sind wertvoll; Süßwaren und Softdrinks bleiben bewusste Ausnahme.",
    },
  ];
  const body = `${panel(8, 8, 624, 214, "panel-bg")}
    ${label(24, 32, "DGE-Orientierung: Verhältnis der Lebensmittelgruppen am Tag (Schema)", "lbl small strong", "start")}
    ${rows
      .map((r, i) => {
        const y = 58 + i * 38;
        return expGroup(
          i,
          active,
          r.name,
          `<rect class="exp-frame" x="18" y="${y - 20}" width="604" height="34" rx="8" fill="var(--surface)" stroke="var(--line)"/>
           ${barRow(28, y - 2, 584, r.pct / 100, r.colour, r.name, `${r.pct} % Rel.`)}`,
        );
      })
      .join("")}`;
  return {
    svg: svg(640, 230, "Schematischer Größenvergleich der Lebensmittelgruppen nach DGE-Empfehlung", body),
    parts: rows.map((r) => ({ label: r.name, detail: r.detail })),
  };
}

export function prophylaxeTherapie(active = 0): ExplorerFigureOutput {
  return explorerCompare(
    "Ernährungsbedingte Krankheiten vs. Essstörungen – Prophylaxe und Therapie",
    [
      {
        head: "Ernährungsbedingte Krankheiten",
        colour: P.amber,
        points: [
          "Beispiele: Karies, Adipositas, Typ-2-Diabetes",
          "Ursache: dauerhaft zu viel Zucker/Fett/Salz",
          "Prophylaxe: frisches Kochen & Bewegung",
          "Wichtig: medizinische Begleitung & Alltagswandel",
        ],
        detail:
          "Körperliche Folgeerkrankungen entwickeln sich oft schleichend und lassen sich durch gesunde Alltagsroutinen stark verringern.",
      },
      {
        head: "Essstörungen (psychosomatisch)",
        colour: P.red,
        points: [
          "Beispiele: Magersucht, Bulimie, Binge-Eating",
          "Ursache: seelischer Druck, Körperideale",
          "Prophylaxe: Medienkritik & Selbstwertstärkung",
          "Therapie: Ärztin, Psychotherapie & Beratung",
        ],
        detail:
          "Essstörungen sind ernsthafte psychische Erkrankungen, die verständnisvolle Entlastung und professionelle Therapie brauchen.",
      },
    ],
    active,
  );
}

export function etikettPruefen(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Vier Prüffelder auf Lebensmittelverpackungen für klugen Verbraucherschutz",
    [
      {
        head: "1. Zutatenreihenfolge",
        body: "Größter Gewichtsanteil steht vorn\nVersteckte Zuckerarten erkennen",
        colour: P.amber,
        detail:
          "Stehen Zucker, Sirup oder Palmfett weit vorn, ist das Produkt stark gesüßt oder fettig – auch wenn die Front „Fit“ verspricht.",
      },
      {
        head: "2. Nährwert pro 100 g / ml",
        body: "Ehrlicher Vergleich zwischen Marken\nTricks mit Mini-Portionen umgehen",
        colour: P.blue,
        detail:
          "Nur der Blick auf 100 g oder 100 ml erlaubt faire Vergleiche zwischen ähnlichen Produkten.",
      },
      {
        head: "3. MHD vs. Verbrauchsdatum",
        body: "MHD: prüfen statt blind wegwerfen\nVerbrauch: abgelaufen nicht mehr essen",
        colour: P.olive,
        detail:
          "Die richtige Unterscheidung schützt gleichzeitig die Gesundheit bei Frischfleisch und spart unnötigen Müll bei Joghurt.",
      },
      {
        head: "4. Amtliche Kontrollen & Siegel",
        body: "Allergene fett markiert\nStaatliches Bio-Siegel vs. Eigenwerbung",
        colour: P.green,
        detail:
          "Lebensmittelüberwachung und Verbraucherzentralen prüfen Deklarationen und decken irreführende Werbung auf.",
      },
    ],
    active,
  );
}

export function gesundheitSozialStaat(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Gesundheit zwischen sozialer Lebenslage und staatlicher Vorsorge",
    [
      {
        head: "Soziale Einflussfaktoren",
        body: "Einkommen, Zeitdruck, Wohnumfeld\nZugang zu Sport & Beratung",
        colour: P.amber,
        detail:
          "Statistiken zeigen, dass ärmere Stadtteile oft weniger Grünflächen und höhere Alltagsbelastungen aufweisen.",
      },
      {
        head: "Staatliche Vorsorge",
        body: "Impfungen, U-/J-Untersuchungen\nSchulstandards & Kassenleistungen",
        colour: P.blue,
        detail:
          "Gesetzliche Vorsorge und öffentliche Infrastruktur schaffen verlässliche Gesundheitschancen unabhängig vom Geldbeutel.",
      },
      {
        head: "Grenze zur Freiheit",
        body: "Aufklärung & faire Angebote vs.\nSteuern oder Konsumverbote",
        colour: P.olive,
        detail:
          "Demokratien müssen stets neu abwägen, wie stark der Staat in persönliche Konsumfreiheit eingreifen darf.",
      },
    ],
    active,
  );
}

export function regionalGlobalTrends(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Ernährungstrends sowie regionale und globale Lebensmittelproduktion",
    [
      {
        head: "Fast Food",
        body: "Schnell & günstig unterwegs\nOft viel Salz, Fett & Müll",
        colour: P.red,
        detail:
          "Spart im Alltag Zeit, sollte aber wegen geringer Nährstoffdichte und hoher Kalorien nicht zur Hauptkost werden.",
      },
      {
        head: "Slow Food & Saisonal",
        body: "Bewusst kochen & genießen\nRegionale Ernte, kurze Wege",
        colour: P.olive,
        detail:
          "Fördert Esskultur, heimische Landwirtschaft und spart meist Transportenergie in der Erntesaison.",
      },
      {
        head: "Vegetarisch & Vegan",
        body: "Tier- & Klimaschutz im Blick\nBei vegan: Vitamin B12 beachten",
        colour: P.green,
        detail:
          "Pflanzenbetonte Ernährung schont Ressourcen; rein vegane Kost verlangt sorgfältige Nährstoffplanung.",
      },
      {
        head: "Globale Lieferketten",
        body: "Vielfalt & Einkommen im Süden\nRisiko: Flugware & Wasserverbrauch",
        colour: P.blue,
        detail:
          "Fairer Handel sichert Arbeitsbedingungen in Anbauländern; beim Einkauf hilft der Verzicht auf Flugobst.",
      },
    ],
    active,
  );
}

export function esskulturBerufe(active = 0): ExplorerFigureOutput {
  return explorerCompare(
    "Esskultur im gesellschaftlichen Wandel & Berufsfelder Gesundheit und Ernährung",
    [
      {
        head: "Wandel der Esskultur",
        colour: P.rust,
        points: [
          "Früher: Erntezyklus, Vorrat, Festtage",
          "Heute: Ganztagsschule, Kantine, Vielfalt",
          "Verschiedene Tischsitten & Religionen",
          "Gemeinsames Essen stiftet Gemeinschaft",
        ],
        detail:
          "Essgewohnheiten spiegeln Geschichte, Technik und Kultur wider – und verbinden bei gemeinsamen Mahlzeiten.",
      },
      {
        head: "Berufe in Gesundheit & Ernährung",
        colour: P.olive,
        points: [
          "Ernährungsberatung & Diätassistenz",
          "Ökotrophologie (Forschung & Kassen)",
          "Lebensmittelkontrolle & Sicherheit",
          "Verbindung aus Naturwissenschaft & Sozialem",
        ],
        detail:
          "Wer sich für Biologie, Verbraucherschutz und beratende Gespräche interessiert, findet vielfältige Ausbildungs- und Studienwege.",
      },
    ],
    active,
  );
}
