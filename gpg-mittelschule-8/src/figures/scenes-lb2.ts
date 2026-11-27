/** Interactive explorer diagrams for Lernbereich 2 (Zeit und Wandel). */
import { arrow, label, labels, panel, part, svg } from "./draw";

export function weimarVerfassung(): string {
  const body = `
  ${panel(18, 18, 764, 275, "panel-bg")}
  ${label(400, 44, "Weimarer Reichsverfassung (1919) — Chancen und Risiken", "lbl strong")}
  ${part(
    "volk",
    "Wahlberechtigte Frauen & Männer ab 20",
    "Erstmals in Deutschland durften 1919 auch Frauen wählen und gewählt werden. Das Volk wählte direkt den Reichstag UND den Reichspräsidenten.",
    `<rect x="260" y="64" width="280" height="46" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${label(400, 92, "Volk (Frauen & Männer ab 20 Jahren)", "lbl small strong")}`,
  )}
  ${arrow(320, 112, 200, 152, "arrow")}${arrow(480, 112, 600, 152, "arrow")}
  ${part(
    "reichstag",
    "Reichstag (Verhältniswahl ohne 5-%-Hürde)",
    "Der Reichstag machte Gesetze. Weil es keine Sperrklausel gab, saßen oft viele kleine Parteien im Parlament — Regierungen brachen häufig auseinander.",
    `<rect class="box-blue" x="60" y="156" width="280" height="62" rx="10"/>${labels(200, 181, "Reichstag (Parlament)\nViele Parteien · häufige Neuwahlen", "lbl small", "middle")}`,
  )}
  ${part(
    "praesident",
    "Reichspräsident (Art. 48 & Art. 25)",
    "Der Reichspräsident konnte per Artikel 48 Notverordnungen erlassen, den Reichstag auflösen und den Kanzler ernennen — eine gefährliche Machtfülle („Ersatzkaiser“).",
    `<rect class="box-red" x="460" y="156" width="280" height="62" rx="10"/>${labels(600, 181, "Reichspräsident (7 Jahre)\nArt. 48 Notverordnungen · Auflösung", "lbl small", "middle")}`,
  )}
  ${label(400, 258, "Erste demokratische Verfassung Deutschlands — doch ohne 5-%-Hürde und mit starkem Art. 48.", "lbl tiny")}`;
  return svg(
    800,
    305,
    "Vereinfachtes Verfassungsschema der Weimarer Republik 1919 mit Wahlvolk, Reichstag und der starken Stellung des Reichspräsidenten",
    body,
  );
}

export function weimarKrise(): string {
  const steps: Array<[string, string, string, string]> = [
    [
      "crash-1929",
      "1929: Weltwirtschaftskrise",
      "Nach dem New Yorker Börsencrash 1929 zogen US-Banken Kredite aus Deutschland ab. Fabriken schlossen, bis 1932 waren über 6 Millionen Menschen arbeitslos.",
      "1929\nWeltwirtschaftskrise",
    ],
    [
      "notverordnung",
      "Notverordnungen & Verelendung",
      "Demokratische Regierungen zerbrachen; Kanzler regierten ab 1930 mithilfe von Notverordnungen des Reichspräsidenten am Parlament vorbei.",
      "1930–1932\nNotverordnungen",
    ],
    [
      "radikal",
      "Radikalisierung links & rechts",
      "Viele Unzufriedene wandten sich extremen Parteien zu: links der KPD, vor allem aber rechts der NSDAP, die einfache Schuldige und Arbeit versprach.",
      "1932\nRadikalisierung",
    ],
  ];
  const body = steps
    .map(([id, title, info, short], i) => {
      const x = 25 + i * 255;
      return `${i > 0 ? arrow(x - 25, 128, x - 4, 128, "arrow power") : ""}${part(
        id,
        title,
        info,
        `<rect x="${x}" y="58" width="225" height="140" rx="12" fill="var(--f-panel)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 112, 114, short, "lbl small strong")}`,
      )}`;
    })
    .join("");
  return svg(
    800,
    245,
    "Dreistufige Krisenspirale 1929 bis 1932 von der Weltwirtschaftskrise über Notverordnungen bis zur politischen Radikalisierung",
    `${label(400, 34, "Vom Börsencrash zur politischen Krise (1929–1932)", "lbl strong")}${body}`,
  );
}

export function machtuebertragung1933(): string {
  const steps: Array<[string, string, string, string]> = [
    [
      "jan30",
      "30. Januar 1933",
      "Reichspräsident Hindenburg ernannte Hitler zum Reichskanzler einer Koalitionsregierung — die Demokratie wurde legalistisch von innen ausgehöhlt.",
      "30. Jan. 1933\nErnennung Hitlers",
    ],
    [
      "feb28",
      "28. Februar 1933",
      "Nach dem Reichstagsbrand setzte die Notverordnung Grundrechte wie Meinungs-, Presse- und Versammlungsfreiheit außer Kraft.",
      "28. Feb. 1933\nGrundrechte ausgesetzt",
    ],
    [
      "mar24",
      "24. März 1933",
      "Mit dem „Ermächtigungsgesetz“ (unter Terror gegen Abgeordnete; nur die SPD stimmte dagegen, KPD-Mandate waren bereits annulliert) konnte die Regierung ohne Reichstag Gesetze erlassen.",
      "24. März 1933\nErmächtigungsgesetz",
    ],
    [
      "gleichschaltung",
      "Sommer 1933",
      "Gewerkschaften wurden zerschlagen, alle anderen Parteien verboten oder aufgelöst, Länder gleichgeschaltet — die Diktatur war errichtet.",
      "Sommer 1933\nEinparteiendiktatur",
    ],
  ];
  const body = steps
    .map(([id, title, info, short], i) => {
      const x = 18 + i * 195;
      return `${i > 0 ? arrow(x - 16, 130, x - 3, 130, "arrow power") : ""}${part(
        id,
        title,
        info,
        `<rect x="${x}" y="68" width="176" height="124" rx="10" fill="var(--surface)" stroke="#c62f2f" stroke-width="2"/>${labels(x + 88, 122, short, "lbl small strong")}`,
      )}`;
    })
    .join("");
  return svg(
    800,
    240,
    "Vier Schritte von der Machtübertragung am 30. Januar 1933 bis zur Einparteiendiktatur im Sommer 1933",
    `${label(400, 36, "Wie aus der Republik in sechs Monaten eine Diktatur wurde (1933)", "lbl strong")}${body}`,
  );
}

export function wendepunkteKapitulation(): string {
  const points: Array<[string, string, string, string]> = [
    [
      "1941",
      "1941: Ausweitung zum Weltkrieg",
      "Im Juni 1941 überfiel Deutschland die Sowjetunion (Vernichtungskrieg im Osten); im Dezember traten die USA nach Pearl Harbor in den Krieg ein.",
      "1941\nVernichtungskrieg &\nUSA im Krieg",
    ],
    [
      "1943",
      "1942/43: Stalingrad & „totaler Krieg“",
      "Nach der Niederlage in Stalingrad Anfang 1943 verlor Deutschland die Initiative. Goebbels rief den „totalen Krieg“ aus; Bomben trafen auch deutsche Städte.",
      "1942/43\nWende Stalingrad &\n„totaler Krieg“",
    ],
    [
      "1944",
      "Juni 1944: Landung in der Normandie",
      "Westalliierte Truppen landeten am 6. Juni 1944 in Frankreich (D-Day) — Deutschland geriet nun von Westen, Süden und Osten unter Druck.",
      "1944\nNormandie &\nZangengriff",
    ],
    [
      "1945",
      "8. Mai 1945: Bedingungslose Kapitulation",
      "Mit der bedingungslosen Kapitulation endete der Zweite Weltkrieg in Europa. Millionen Tote und zerstörte Länder blieben zurück.",
      "8. Mai 1945\nKapitulation &\nKriegsende",
    ],
  ];
  const body = points
    .map(([id, title, info, short], i) => {
      const x = 18 + i * 195;
      return `${i > 0 ? arrow(x - 16, 130, x - 3, 130, "arrow") : ""}${part(
        id,
        title,
        info,
        `<rect x="${x}" y="68" width="176" height="124" rx="10" fill="var(--f-panel)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 88, 114, short, "lbl small strong")}`,
      )}`;
    })
    .join("");
  return svg(
    800,
    235,
    "Vier Wendepunkte und Stationen des Zweiten Weltkriegs von 1941 bis zur Kapitulation am 8. Mai 1945",
    `${label(400, 36, "Wendepunkte des Zweiten Weltkriegs bis zur Kapitulation", "lbl strong")}${body}`,
  );
}

export function verfolgungNs(): string {
  const groups: Array<[string, string, string, string]> = [
    [
      "rassisch",
      "Rassistische Verfolgung",
      "Die NS-Ideologie erfand eine „Rassenhierarchie“: Über 6 Millionen europäische Jüdinnen und Juden sowie Hunderttausende Sinti und Roma wurden systematisch entrechtet, deportiert und im Holocaust (Shoah) ermordet.",
      "Rassistische Motive\n• Juden (Shoah)\n• Sinti und Roma",
    ],
    [
      "behinderung",
      "Menschen mit Behinderungen & Ausgegrenzte",
      "Kranke und Menschen mit Behinderungen galten den Nationalsozialisten als „unwert“ (Mordaktion „T4“). Auch Homosexuelle und „Zeugen Jehovas“ wurden in KZ verschleppt.",
      "„Unwert“-Ideologie\n• Kranke & Behinderte\n• weitere Minderheiten",
    ],
    [
      "politisch",
      "Politische Verfolgung",
      "Sozialdemokraten, Kommunisten, Gewerkschafter, Regimekritiker und Geistliche wurden aus politischen oder Gewissensgründen verhaftet, ins KZ gesperrt oder hingerichtet.",
      "Politische Motive\n• SPD, KPD, Gewerkschaften\n• Widerstand & Kirchen",
    ],
  ];
  const body = groups
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="64" width="240" height="156" rx="12" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 108, short, "lbl small")}`,
      );
    })
    .join("");
  return svg(
    800,
    250,
    "Unterscheidung rassistischer und politischer Verfolgungsmotive während der NS-Gewaltherrschaft",
    `${label(400, 36, "Motive nationalsozialistischer Verfolgung und Vernichtung", "lbl strong")}${body}`,
  );
}

export function fluchtVertreibung(): string {
  const cols: Array<[string, string, string, string]> = [
    [
      "flucht",
      "1944/45: Flucht vor der Front",
      "Millionen Menschen flohen bei Winterkälte aus Ostpreußen, Pommern und Schlesien vor der vorrückenden Front — oft nur mit Handwagen und wenigen Habseligkeiten.",
      "1. Flucht\nvor der Front\n(ab Ende 1944)",
    ],
    [
      "vertreibung",
      "Ab 1945: Ausweisung & Vertreibung",
      "Nach den Beschlüssen von Potsdam wurden rund 12 Millionen Deutsche aus Gebieten östlich von Oder und Neiße sowie dem Sudetenland ausgewiesen.",
      "2. Vertreibung\naus der Heimat\n(ab 1945)",
    ],
    [
      "ankunft",
      "Ankunft in den Besatzungszonen",
      "Viele Familien verloren Angehörige. In Bayern und den übrigen Zonen wurden Vertriebene oft zunächst zwangsweise einquartiert — Integration dauerte Jahre.",
      "3. Ankunft &\nneue Heimat\n(Integration)",
    ],
  ];
  const body = cols
    .map(([id, title, info, short], i) => {
      const x = 22 + i * 260;
      return `${i > 0 ? arrow(x - 20, 140, x - 3, 140, "arrow") : ""}${part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="236" height="148" rx="12" fill="var(--f-panel)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 118, 114, short, "lbl small strong")}`,
      )}`;
    })
    .join("");
  return svg(
    800,
    245,
    "Dreischritt von Flucht vor der Front, Vertreibung nach 1945 und schwieriger Ankunft in den Besatzungszonen",
    `${label(400, 36, "Flucht, Vertreibung und Migration ab 1944/45", "lbl strong")}${body}`,
  );
}

export function nachkriegsalltag(): string {
  const items: Array<[string, string, string, string]> = [
    [
      "wohnen",
      "Trümmer & Wohnungsnot",
      "Zerbombte Städte und Millionen Vertriebene führten zu extremer Enge: Wohnungsämter wiesen mehrere Familien in eine einzige Wohnung ein.",
      "Wohnungsnot\nin Ruinenstädten",
    ],
    [
      "essen",
      "Lebensmittelkarten & Hunger",
      "Brot, Fett und Kohlen gab es nur auf Marken. Viele Städter unternahmen „Hamsterfahrten“ aufs Land, um Hausrat gegen Kartoffeln zu tauschen.",
      "Lebensmittelkarten\n& Schwarzmarkt",
    ],
    [
      "heimkehr",
      "„Trümmerfrauen“ & Heimkehrer",
      "Frauen trugen einen Großteil des Wiederaufbaus und der Familienversorgung; Kriegsheimkehrer kamen oft körperlich und seelisch gezeichnet aus Gefangenschaft zurück.",
      "Heimkehrer &\nWiederaufbau",
    ],
  ];
  const body = items
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="240" height="148" rx="12" fill="var(--surface)" stroke="var(--gold)" stroke-width="2"/>${labels(x + 120, 126, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Drei Lebensbereiche der Nachkriegsjahre 1945 bis 1948: Wohnungsnot, Lebensmittelkarten und Wiederaufbau",
    `${label(400, 36, "Alltag in der „Stunde Null“ (1945–1948)", "lbl strong")}${body}`,
  );
}

export function nuernbergerProzesse(): string {
  const body = `
  ${panel(18, 18, 764, 240, "panel-bg")}
  ${label(400, 46, "Die Nürnberger Prozesse (1945/46) — neues Völkerstrafrecht", "lbl strong")}
  ${part(
    "gericht",
    "Internationaler Militärgerichtshof (4 Siegermächte)",
    "Richter und Ankläger aus den USA, Großbritannien, Frankreich und der Sowjetunion führten in Nürnberg rechtsstaatliche Prozesse mit Verteidigern und Beweisen.",
    `<rect x="44" y="76" width="220" height="146" rx="10" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(154, 124, "4 Siegermächte\nals Gericht\nin Nürnberg", "lbl small strong")}`,
  )}
  ${part(
    "anklage",
    "4 Anklagepunkte",
    "Erstmals wurden Angriffskrieg, Kriegsverbrechen und „Verbrechen gegen die Menschlichkeit“ vor Gericht verfolgt.",
    `<rect x="290" y="76" width="220" height="146" rx="10" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(400, 118, "Neue Tatbestände\n• Angriffskrieg\n• Verbrechen gegen\n  die Menschlichkeit", "lbl small")}`,
  )}
  ${part(
    "verantwortung",
    "Persönliche Verantwortung",
    "Die Ausrede „Ich habe nur Befehle befolgt“ galt nicht mehr — jede Einzelperson haftet für Verbrechen. Das wirkt bis heute im Internationalen Strafgerichtshof fort.",
    `<rect x="536" y="76" width="220" height="146" rx="10" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(646, 124, "Wirkung bis heute\n„Befehl“ schützt\nnicht vor Strafe", "lbl small strong")}`,
  )}`;
  return svg(
    800,
    275,
    "Aufbau und historische Bedeutung der Nürnberger Prozesse 1945 und 1946",
    body,
  );
}

export function kriegsfolgenHeute(): string {
  const cards: Array<[string, string, string, string]> = [
    [
      "persoenlich",
      "Familiengeschichten & Traumata",
      "Verlust von Angehörigen, Traumata aus Bombennächten, Flucht oder Vertreibung wirken oft über Kinder und Enkel bis in die Gegenwart fort.",
      "Persönliche Folgen\n• Traumata & Verlust\n• Familienerinnerung",
    ],
    [
      "umwelt-stadt",
      "Spuren in Städten & Böden",
      "Bis heute werden bei Bauarbeiten in Bayern und Deutschland Blindgänger entschärft; zugleich erinnern Stolpersteine und Mahnmale mitten in den Straßen.",
      "Spuren vor Ort\n• Blindgängerfunde\n• Stolpersteine",
    ],
    [
      "frieden",
      "Lehren für Gegenwart & Völkerrecht",
      "Menschenrechte, Völkerstrafrecht und Versöhnung zwischen früheren Feinden sind die Antwort darauf — auch bei heutigen Kriegen zählen Opferschutz und Aufklärung.",
      "Verantwortung heute\n• Menschenrechte\n• Völkerrecht",
    ],
  ];
  const body = cards
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="240" height="150" rx="12" fill="var(--f-panel)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 114, short, "lbl small")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Langfristige Folgen von Krieg und Verbrechen bis heute: persönliche Traumata, Spuren vor Ort und Verantwortung für Menschenrechte",
    `${label(400, 36, "Warum Krieg und Unrecht über Generationen nachwirken", "lbl strong")}${body}`,
  );
}
