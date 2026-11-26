import {
  arrow,
  expGroup,
  explorerCards,
  explorerChain,
  explorerCompare,
  label,
  labels,
  P,
  panel,
  svg,
} from "./draw";
import type { ExplorerFigureOutput } from "./scenes-lb1-3";

export function staatGrundbegriffe(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Grundbegriffe der Politik: Verfassung, Staat, Gewaltmonopol und Gesellschaft",
    [
      {
        head: "Verfassung (Spielregeln)",
        body: "Grundgesetz & Bayerische Verfassung\nBindet alle Staatsorgane",
        colour: P.blue,
        detail:
          "Die Verfassung bildet den obersten rechtlichen Rahmen für Freiheit, Rechte und politische Verfahren.",
      },
      {
        head: "Staat & staatliche Ebenen",
        body: "Staatsgebiet, Staatsvolk, Staatsgewalt\nKommune · Land · Bund · EU",
        colour: P.teal,
        detail:
          "Staatliche Aufgaben verteilen sich von der Gemeinde über den Freistaat Bayern bis zum Bund.",
      },
      {
        head: "Gewaltmonopol",
        body: "Zwang nur durch Polizei & Gerichte\nKeine private Selbstjustiz",
        colour: P.amber,
        detail:
          "Nur der Rechtsstaat darf nach klaren Gesetzen Zwang ausüben, um Frieden und Recht zu sichern.",
      },
      {
        head: "Gesellschaft & Staatsbürger",
        body: "Vereine, Betriebe, Initiativen\nPolitik durch aktive Mitwirkung",
        colour: P.green,
        detail:
          "Bürgerinnen und Bürger prägen durch Engagement, Debatten und Wahlen das Gemeinwesen.",
      },
    ],
    active,
  );
}

export function politikKreislaufSchema(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Der einfache Politikkreislauf in vier Phasen",
    [
      {
        head: "1. Problem",
        body: "Alltagsproblem wird sichtbar\nBürger & Medien berichten",
        colour: P.amber,
        detail:
          "Betroffene oder Medien bringen ein ungelöstes Anliegen (z. B. fehlender Schulbus) auf die Tagesordnung.",
      },
      {
        head: "2. Auseinandersetzung",
        body: "Alternativen & Kosten prüfen\nVerbände & Parteien debattieren",
        colour: P.blue,
        detail:
          "Unterschiedliche Lösungsvorschläge, Haushaltsfolgen und Argumente prallen öffentlich aufeinander.",
      },
      {
        head: "3. Entscheidung",
        body: "Mehrheitsbeschluss im Gremium\nVerbindliche Regel / Budget",
        colour: P.plum,
        detail:
          "Gemeinderat oder Parlament treffen per Abstimmung eine verbindliche politische Entscheidung.",
      },
      {
        head: "4. Umsetzung & Reaktion",
        body: "Verwaltung setzt Beschluss um\nPraxis liefert neue Rückmeldung",
        colour: P.green,
        detail:
          "Im Alltag zeigt sich, ob das Problem gelöst ist – neue Kritik startet den nächsten Kreislauf.",
      },
    ],
    active,
  );
}

export function kompromissWaage(active = 0): ExplorerFigureOutput {
  const parts = [
    {
      label: "Mehrheitsprinzip",
      detail:
        "Mehr als die Hälfte der Stimmen entscheidet – notwendig, damit eine vielfältige Demokratie handlungsfähig bleibt.",
    },
    {
      label: "Kompromiss",
      detail:
        "Jede Gruppe verzichtet auf einen Teil ihrer Maximalforderung, sodass ein breit getragener Beschluss entsteht.",
    },
    {
      label: "Minderheitenschutz",
      detail:
        "Grundrechte, Menschenwürde und faires Mitspracherecht einer Minderheit bleiben auch bei klaren Mehrheiten unantastbar.",
    },
  ];
  const body = `${panel(8, 8, 624, 198, "panel-bg")}
    <line x1="320" y1="42" x2="320" y2="152" stroke="var(--f-ink)" stroke-width="3"/>
    <line x1="150" y1="68" x2="490" y2="68" stroke="var(--f-ink)" stroke-width="3"/>
    <rect x="275" y="152" width="90" height="12" rx="6" fill="var(--f-stone)"/>
    ${expGroup(
      0,
      active,
      "Mehrheitsprinzip",
      `<rect class="exp-frame" x="24" y="84" width="190" height="58" rx="10" fill="var(--surface)" stroke="${P.blue}" stroke-width="2"/>
       ${label(119, 108, "Mehrheit (> 50 %)", "lbl small strong")}
       ${label(119, 128, "Schafft Handlungsfähigkeit", "lbl tiny muted")}`,
    )}
    ${expGroup(
      1,
      active,
      "Fairer Kompromiss",
      `<rect class="exp-frame" x="234" y="20" width="172" height="44" rx="10" fill="var(--surface)" stroke="${P.green}" stroke-width="2"/>
       ${label(320, 40, "Kompromiss", "lbl small strong")}
       ${label(320, 56, "Ausgleich statt Diktat", "lbl tiny muted")}`,
    )}
    ${expGroup(
      2,
      active,
      "Minderheitenschutz",
      `<rect class="exp-frame" x="426" y="84" width="190" height="58" rx="10" fill="var(--surface)" stroke="${P.red}" stroke-width="2"/>
       ${label(521, 108, "Minderheitenschutz", "lbl small strong")}
       ${label(521, 128, "Schützt Grundrechte aller", "lbl tiny muted")}`,
    )}
    ${label(320, 188, "Demokratische Stabilität braucht das Gleichgewicht aller drei Prinzipien.", "lbl tiny muted")}`;
  return {
    svg: svg(640, 214, "Waage zwischen Mehrheitsprinzip, Kompromiss und Minderheitenschutz", body),
    parts,
  };
}

export function mitwirkungKommune(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Mitwirkungsmöglichkeiten Jugendlicher auf kommunaler Ebene samt Chancen und Grenzen",
    [
      {
        head: "Jugendparlament / -beirat",
        body: "Regelmäßige Jugendstimme im Ort\nGrenze: meist nur beratend",
        colour: P.blue,
        detail:
          "Chance: Dauerhafter Zugang zu Ausschüssen und eigenem Jugendbudget; Grenze: Verbindliche Satzungen beschließt der Gemeinderat.",
      },
      {
        head: "Gemeinderat & Sprechstunde",
        body: "Öffentliche Sitzungen besuchen\nDirekte Frage an Bürgermeisterin",
        colour: P.teal,
        detail:
          "Chance: Man sieht live, wie Entscheidungen fallen, und platziert Alltagsprobleme; Grenze: Redezeit meist erst nach Anmeldung.",
      },
      {
        head: "SMV & Schüleranträge",
        body: "Schulhof, Buszeiten & Freizeit\nKooperation mit Schulleitung",
        colour: P.green,
        detail:
          "Chance: Schnelle Verbesserungen direkt in der eigenen Lebenswelt; Grenze: Abhängigkeit von Schulträger und Haushaltsmitteln.",
      },
      {
        head: "Schriftliche Anregung / Petition",
        body: "Begründeter Vorschlag ans Rathaus\nGemeinsam mit Unterschriften",
        colour: P.amber,
        detail:
          "Chance: Jedes Thema lässt sich sachlich und belegt einbringen; Grenze: Keine Garantie auf Übernahme gegen Mehrheiten.",
      },
    ],
    active,
  );
}

export function engagementFormen(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Vier Wege lokalen politischen und gesellschaftlichen Engagements",
    [
      {
        head: "Praktisches Ehrenamt",
        body: "Feuerwehr, Verein, Umweltgruppe\nStärkt Zusammenhalt vor Ort",
        colour: P.green,
        detail:
          "Freiwillige Arbeit für andere schafft Vertrauen und hält das Gemeinwesen im Alltag lebendig.",
      },
      {
        head: "Bürgerinitiative / Aktion",
        body: "Punktgenaues lokales Anliegen\nUnterschriften & Infostand",
        colour: P.amber,
        detail:
          "Ideal für ein zeitlich begrenztes Projekt – etwa den Erhalt eines Sportplatzes oder Zebrastreifens.",
      },
      {
        head: "Jugendorganisation & Partei",
        body: "Dauerhaft Programme gestalten\nWeg in Gemeinde- & Stadtrat",
        colour: P.blue,
        detail:
          "Wer über viele Themen hinweg mitentscheiden will, findet in Parteien und ihren Jugendgruppen feste Strukturen.",
      },
      {
        head: "Öffentliche Stellungnahme",
        body: "Leserbrief, Demo, Schulbeitrag\nArgumente in die Debatte tragen",
        colour: P.plum,
        detail:
          "Gut belegte Beiträge in Lokalmedien oder friedliche Versammlungen erhöhen den öffentlichen Druck auf Entscheidungsträger.",
      },
    ],
    active,
  );
}

export function akteureZusammenwirken(active = 0): ExplorerFigureOutput {
  const body = `${panel(8, 8, 624, 214, "panel-bg")}
    ${expGroup(
      0,
      active,
      "Gesellschaftliche Akteure",
      `<rect class="exp-frame" x="20" y="28" width="176" height="156" rx="12" fill="var(--surface)" stroke="${P.green}" stroke-width="2"/>
       <rect x="20" y="28" width="176" height="28" rx="10" fill="${P.green}"/>
       ${label(108, 47, "Gesellschaft", "lbl small on-dark")}
       ${labels(108, 78, "Bürgerinnen & Initiativen\nVerbände & Gewerkschaften\nUnabhängige Medien", "lbl tiny", "middle", 22)}`,
    )}
    ${expGroup(
      1,
      active,
      "Brücke: Parteien & Wahlen",
      `<rect class="exp-frame" x="234" y="64" width="172" height="84" rx="12" fill="var(--surface)" stroke="${P.amber}" stroke-width="2"/>
       <rect x="234" y="64" width="172" height="26" rx="10" fill="${P.amber}"/>
       ${label(320, 82, "Vermittlung", "lbl small on-dark")}
       ${labels(320, 108, "Parteien & Programme\nWahlen & Öffentlichkeit", "lbl tiny", "middle", 18)}`,
    )}
    ${expGroup(
      2,
      active,
      "Staatliche Organe",
      `<rect class="exp-frame" x="444" y="28" width="176" height="156" rx="12" fill="var(--surface)" stroke="${P.blue}" stroke-width="2"/>
       <rect x="444" y="28" width="176" height="28" rx="10" fill="${P.blue}"/>
       ${label(532, 47, "Staat", "lbl small on-dark")}
       ${labels(532, 78, "Parlament / Gemeinderat\nRegierung & Verwaltung\nUnabhängige Gerichte", "lbl tiny", "middle", 22)}`,
    )}
    ${arrow(198, 106, 232, 106)}
    ${arrow(408, 106, 442, 106)}
    ${label(320, 206, "Rückwirkung über Gesetze, Haushalt, öffentliche Kontrolle und Rechtsschutz", "lbl tiny muted")}`;
  return {
    svg: svg(640, 230, "Zusammenspiel von Akteuren in Gesellschaft, Parteien und Staat", body),
    parts: [
      {
        label: "Gesellschaftliche Akteure",
        detail:
          "Bürger, Vereine, Verbände und Medien greifen Probleme auf, bündeln Interessen und beobachten staatliche Entscheidungen kritisch.",
      },
      {
        label: "Brücke: Parteien & Wahlen",
        detail:
          "Parteien übersetzen gesellschaftliche Wünsche in Programme und stellen Kandidatinnen für Räte und Parlamente auf.",
      },
      {
        label: "Staatliche Organe",
        detail:
          "Parlament und Gemeinderat beschließen Gesetze und Budgets, Verwaltung setzt um und Gerichte kontrollieren die Rechtmäßigkeit.",
      },
    ],
  };
}

export function kontakteVorOrt(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Internationale Kontakte auf lokaler und regionaler Ebene",
    [
      {
        head: "Städtepartnerschaften",
        body: "Kommunale Besuche & Feste\nFeuerwehr, Vereine & Rat",
        colour: P.green,
        detail:
          "Direkte Partnerschaften zwischen bayerischen Gemeinden und Partnerstädten in Europa bauen langfristiges Vertrauen auf.",
      },
      {
        head: "Schule & Austausch",
        body: "Partnerschulen & Erasmus+\nGastfamilien in Europa & weltweit",
        colour: P.blue,
        detail:
          "Schüleraustausche in Europa, den USA oder weltweit lassen Jugendliche fremden Alltag unmittelbar miterleben.",
      },
      {
        head: "Wirtschaft & Beruf",
        body: "Regionale Betriebe im Export\nInternationale Lieferketten",
        colour: P.amber,
        detail:
          "Viele heimische Firmen arbeiten täglich mit Partnern im Ausland zusammen und bieten Praktika oder Azubi-Austausche.",
      },
      {
        head: "Kultur & Hilfsprojekte",
        body: "Chöre, Sport, globale Projekte\nZ. B. Schulpartnerschaft in Afrika/Asien",
        colour: P.plum,
        detail:
          "Kulturtreffen und solidarische Schul- oder Gemeindehilfen verbinden die Region mit Partnern weit über Europa hinaus.",
      },
    ],
    active,
  );
}

export function projektAugenhoehe(active = 0): ExplorerFigureOutput {
  return explorerCompare(
    "Internationale Projekte vor Ort: Kooperation auf Augenhöhe vs. Einbahnstraße",
    [
      {
        head: "Kooperation auf Augenhöhe",
        colour: P.green,
        points: [
          "Ziele gemeinsam festlegen",
          "Bedarf der Partner vor Ort fragen",
          "Kultur und Sprache beiderseits teilen",
          "Langfristig selbst tragfähig planen",
        ],
        detail:
          "Echte Völkerverständigung entsteht, wenn beide Partner gleichermaßen geben, lernen und über Themen mitentscheiden.",
      },
      {
        head: "Problematische Einbahnstraße",
        colour: P.red,
        points: [
          "Ohne Rücksprache Dinge schicken",
          "Nur eigene Kultur präsentieren",
          "Partner als passive Empfänger sehen",
          "Nach kurzem Event abbrechen",
        ],
        detail:
          "Unabgestimmte Hilfe verletzt oft Eigenverantwortung und löst Probleme vor Ort nicht nachhaltig.",
      },
    ],
    active,
  );
}

export function grenzKonfliktLoesungen(active = 0): ExplorerFigureOutput {
  return explorerCards(
    "Lösungsansätze für grenzüberschreitende Konflikte in Europa",
    [
      {
        head: "1. Nationaler Alleingang",
        body: "Schnell allein beschlossen\nRisiko: Gegenblockade & Verschiebung",
        colour: P.red,
        detail:
          "Einseitige Grenzschließungen oder Sonderregeln helfen selten dauerhaft, weil Flüsse, Luft und Verkehr Grenzen ignorieren.",
      },
      {
        head: "2. Bilaterales Abkommen",
        body: "Vertrag zwischen zwei Nachbarn\nGezielte Lösung für Fluss/Bahn",
        colour: P.amber,
        detail:
          "Zwei Nachbarstaaten vereinbaren passgenaue Regeln vor Ort – etwa für eine Bahnlinie oder einen Grenzfluss.",
      },
      {
        head: "3. Gemeinsamer EU-Rahmen",
        body: "Einheitliche Standards für alle\nVerhindert Unterbieten bei Umwelt",
        colour: P.green,
        detail:
          "Verbindliche EU-Richtlinien schaffen Verlässlichkeit für alle Mitgliedstaaten, dauern in der Verhandlung aber länger.",
      },
    ],
    active,
    3,
  );
}

export function euregioModell(active = 0): ExplorerFigureOutput {
  return explorerChain(
    "Wie regionale Kooperation in einer Euregio Alltagsprobleme löst",
    [
      {
        head: "Regionale Nähe",
        body: "Nachbarkommunen beiderseits\nder Staatsgrenze verbinden sich",
        colour: P.green,
        detail:
          "Gemeinden, Landkreise und Vereine kennen gemeinsame Alltagsprobleme über die Grenze hinweg aus erster Hand.",
      },
      {
        head: "Konkrete Projekte",
        body: "Nahverkehr, Hochwasserschutz,\nRettungsdienst & Jugendaustausch",
        colour: P.blue,
        detail:
          "Abgestimmte Bus-Tarife, grenzüberschreitende Notarzteinsätze und Naturschutz verbessern das tägliche Leben.",
      },
      {
        head: "Offene Hürden",
        body: "Verschiedene Behördenregeln,\nSprache & Anerkennung von Berufen",
        colour: P.amber,
        detail:
          "Unterschiedliche Gesetze und Sprachbarrieren verlangen Geduld und feste zweisprachige Koordinierungsstellen.",
      },
    ],
    active,
  );
}
