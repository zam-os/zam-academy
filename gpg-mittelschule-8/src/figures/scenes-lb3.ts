/** Interactive explorer diagrams for Lernbereich 3 (Politik und Gesellschaft). */
import { arrow, label, labels, panel, part, svg } from "./draw";

export function menschenrechteGrundrechte(): string {
  const body = `
  ${panel(18, 18, 764, 240, "panel-bg")}
  ${label(400, 46, "Menschenrechte, Grundrechte und Minderheitenschutz", "lbl strong")}
  ${part(
    "wuerde",
    "Art. 1 GG: Menschenwürde (unantastbar)",
    "Die Würde jedes Menschen bildet das Fundament. Sie gilt unabhängig von Herkunft, Geschlecht, Religion oder Behinderung — und ist durch die Ewigkeitsklausel geschützt.",
    `<rect x="40" y="76" width="225" height="148" rx="12" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${labels(152, 122, "Menschenwürde\nArt. 1 Grundgesetz\nfür alle Menschen", "lbl small strong")}`,
  )}
  ${part(
    "grundrechte",
    "Freiheits- & Gleichheitsrechte",
    "Meinungsfreiheit (Art. 5), Gleichheit vor dem Gesetz (Art. 3), Versammlungsfreiheit (Art. 8) und Religionsfreiheit schützen Bürger vor staatlicher Willkür.",
    `<rect x="288" y="76" width="225" height="148" rx="12" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(400, 118, "Grundrechte\n• Meinungsfreiheit\n• Gleichbehandlung\n• Versammlungsrecht", "lbl small")}`,
  )}
  ${part(
    "minderheiten",
    "Minderheitenschutz",
    "Demokratie ist keine „Diktatur der Mehrheit“: Auch wenn eine Gruppe zahlenmäßig kleiner ist, bleiben ihre Grundrechte geschützt (Lehre aus der NS-Zeit).",
    `<rect x="536" y="76" width="225" height="148" rx="12" fill="var(--surface)" stroke="var(--gold)" stroke-width="2"/>${labels(648, 122, "Minderheitenschutz\nMehrheit entscheidet,\nschützt aber Minderheiten", "lbl small strong")}`,
  )}`;
  return svg(
    800,
    275,
    "Zusammenhang von Menschenwürde, Grundrechten und Minderheitenschutz im Grundgesetz",
    body,
  );
}

export function propagandaMedien(): string {
  const body = `
  ${part(
    "ns-zensur",
    "NS-Diktatur: Gleichschaltung & Zensur",
    "Ab 1933 übernahm das Propagandaministerium (Goebbels) Presse, Rundfunk, Film und Schule. Kritische Zeitungen wurden verboten, Bücher verbrannt.",
    `${panel(18, 18, 370, 245, "col-old")}${label(203, 46, "Diktatur: gelenkte Medien", "lbl strong")}<rect class="box-red" x="52" y="72" width="300" height="68" rx="10"/>${labels(202, 98, "Volksempfänger & Wochenschau\nNur eine Staatsmeinung erlaubt", "lbl small")}`,
  )}
  ${part(
    "ns-techniken",
    "Manipulationstechniken entschlüsseln",
    "Typische Mittel der NS-Propaganda waren Wiederholung kurzer Parolen, emotionale Bilder/Fackelzüge, Verschweigen von Fakten und Ausgrenzung von „Feindbildern“.",
    `<rect x="52" y="156" width="300" height="82" rx="10" fill="var(--surface)" stroke="#c62f2f" stroke-width="1.5"/>${labels(202, 184, "Techniken:\n• Feindbilder & Ausgrenzung\n• Parolen statt Argumente", "lbl tiny")}`,
  )}
  ${part(
    "demokratie-art5",
    "Demokratie: Pressefreiheit (Art. 5 GG)",
    "Im Grundgesetz garantiert Art. 5 die Meinungs- und Pressefreiheit: „Eine Zensur findet nicht statt.“ Verschiedene Medien dürfen die Regierung kritisieren.",
    `${panel(412, 18, 370, 245, "col-new")}${label(597, 46, "Demokratie: freie Medien", "lbl strong")}<rect class="box-green" x="446" y="72" width="300" height="68" rx="10"/>${labels(596, 98, "Artikel 5 Grundgesetz\nVielfalt & Kontrolle der Macht", "lbl small")}`,
  )}
  ${part(
    "objektiv",
    "Qualitätsmerkmale seriöser Medien",
    "Objektive Berichterstattung trennt Nachricht und Kommentar, prüft mehrere Quellen und berichtigt Fehler öffentlich.",
    `<rect x="446" y="156" width="300" height="82" rx="10" fill="var(--surface)" stroke="#1f7a3a" stroke-width="1.5"/>${labels(596, 184, "Qualitätsprüfung:\n• Quellen belegen\n• Fakten & Meinung trennen", "lbl tiny")}`,
  )}`;
  return svg(
    800,
    280,
    "Gegenüberstellung der manipulativen NS-Propaganda und der Pressefreiheit nach Artikel 5 Grundgesetz in einer Demokratie",
    body,
  );
}

export function widerstandNs(): string {
  const groups: Array<[string, string, string, string]> = [
    [
      "weisse-rose",
      "Weiße Rose (München, 1942/43)",
      "Studierende um Hans und Sophie Scholl verteilten Flugblätter gegen Krieg und Diktatur. Sie riefen aus moralischem Gewissen zu passivem Widerstand auf.",
      "Weiße Rose\nFlugblätter\n(1942/43)",
    ],
    [
      "zwanzig-juli",
      "20. Juli 1944 (Stauffenberg)",
      "Offiziere und Zivilisten um Claus Schenk Graf von Stauffenberg wollten durch ein Attentat auf Hitler den Krieg und das Morden beenden.",
      "20. Juli 1944\nMilitärischer\nUmsturzversuch",
    ],
    [
      "bonhoeffer",
      "Dietrich Bonhoeffer",
      "Der evangelische Theologe half Verfolgten, lehnte die Gleichschaltung der Kirche ab und unterstützte den politischen Widerstand gegen das NS-Regime.",
      "Dietrich Bonhoeffer\nBekennende Kirche\n& Rettungshilfe",
    ],
    [
      "mayer",
      "Pater Rupert Mayer (München)",
      "Der Jesuit und Feldseelsorger widersprach öffentlich dem Redeverbot der Nationalsozialisten und sprach mutig gegen die Verfolgung der Kirche und Unrecht.",
      "Pater Rupert Mayer\nÖffentliches\nWort in Bayern",
    ],
  ];
  const body = groups
    .map(([id, title, info, short], i) => {
      const x = 18 + i * 195;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="176" height="148" rx="12" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 88, 122, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Vier Beispiele für Widerstand gegen den Nationalsozialismus: Weiße Rose, 20. Juli 1944, Dietrich Bonhoeffer und Pater Rupert Mayer",
    `${label(400, 36, "Formen und Motive des Widerstands im „Dritten Reich“", "lbl strong")}${body}`,
  );
}

export function zivilcourageDemokratie(): string {
  const cols: Array<[string, string, string, string]> = [
    [
      "hinsehen",
      "Alltag: Hinsehen & Hilfe holen",
      "Zivilcourage heißt, bei Mobbing, Ausgrenzung oder Hass nicht wegzuschauen — aber ohne sich selbst unnötig in Gefahr zu bringen (z. B. Umstehende ansprechen, 110 rufen).",
      "1. Im Alltag\n• widersprechen\n• andere einbinden",
    ],
    [
      "mittel",
      "Demokratische Mittel nutzen",
      "In einer Demokratie stehen friedliche Wege offen: Demonstrationen anmelden, Petitionen einreichen, Leserbriefe schreiben oder vor Gericht klagen.",
      "2. Rechtsstaatliche\nWege nutzen\n(Demo, Petition)",
    ],
    [
      "grenzen",
      "Grenzen im Rechtsstaat",
      "Zivilcourage verteidigt Menschenrechte mit legalen und gewaltfreien Mitteln. Selbstjustiz oder Gewalt gegen Menschen sind in einer Demokratie nicht zulässig.",
      "3. Klare Grenze\n• keine Gewalt\n• Recht gilt für alle",
    ],
  ];
  const body = cols
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="240" height="148" rx="12" fill="var(--f-panel)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 116, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Drei Aspekte von Zivilcourage in der Demokratie: Eingreifen im Alltag, rechtliche Mittel und Gewaltfreiheit als Grenze",
    `${label(400, 36, "Zivilcourage und demokratische Grenzen", "lbl strong")}${body}`,
  );
}

export function verfassungsorgane(): string {
  const organs: Array<[string, number, number, string, string, string]> = [
    [
      "bundestag",
      32,
      70,
      "Bundestag\n(Legislative)",
      "Vom Volk auf 4 Jahre gewählt. Beschließt Bundesgesetze, verabschiedet den Haushalt, wählt den Bundeskanzler und kontrolliert die Regierung.",
      "box-blue",
    ],
    [
      "bundesrat",
      288,
      70,
      "Bundesrat\n(Länderkammer)",
      "Vertritt die 16 Bundesländer (z. B. Bayern). Wirkt bei allen Bundesgesetzen mit und muss Zustimmungsgesetzen ausdrücklich zustimmen.",
      "box-purple",
    ],
    [
      "regierung",
      544,
      70,
      "Bundesregierung\n(Exekutive)",
      "Bundeskanzler/in und Ministerien. Leitet die Politik, bringt häufig Gesetzesentwürfe ein und führt beschlossene Gesetze aus.",
      "box-green",
    ],
    [
      "praesident",
      150,
      176,
      "Bundespräsident\n(Staatsoberhaupt)",
      "Repräsentiert Deutschland, unterzeichnet (fertigt aus) verfassungsmäßig zustande gekommene Gesetze und prüft sie formal.",
      "box-amber",
    ],
    [
      "bverfg",
      424,
      176,
      "Bundesverfassungsgericht\n(Judikative)",
      "Hütet das Grundgesetz in Karlsruhe. Kann Gesetze für verfassungswidrig erklären, wenn sie Grundrechte oder Kompetenzen verletzen.",
      "box-red",
    ],
  ];
  const body = organs
    .map(([id, x, y, short, info, cls]) =>
      part(
        id,
        short.replace("\n", " "),
        info,
        `<rect class="${cls}" x="${x}" y="${y}" width="224" height="72" rx="10"/>${labels(x + 112, y + 32, short, "lbl small strong")}`,
      ),
    )
    .join("");
  return svg(
    800,
    275,
    "Die fünf obersten Verfassungsorgane der Bundesrepublik Deutschland und die Gewaltenteilung",
    `${label(400, 36, "Fünf Verfassungsorgane kontrollieren und ergänzen sich (Gewaltenteilung)", "lbl strong")}${body}`,
  );
}

export function gesetzgebungSchema(): string {
  const pillars: Array<[string, string, string, string]> = [
    [
      "legitimitaet",
      "Legitimität (demokratische Berechtigung)",
      "Nur vom Volk gewählte Abgeordnete im Bundestag (plus Länderregierungen im Bundesrat) dürfen verbindliche Gesetze beschließen.",
      "Legitimität\nGewählte Volksvertretung\nbeschließt Gesetze",
    ],
    [
      "effizienz",
      "Effizienz vs. Gründlichkeit",
      "Drei Lesungen und Ausschussberatungen kosten Zeit — genau das schützt vor überhasteten Fehlern und ermöglicht fachliche Anhörungen.",
      "Gründlichkeit\n3 Lesungen & Ausschüsse\nprüfen Folgen",
    ],
    [
      "allgemeinwohl",
      "Allgemeinwohl & Interessenausgleich",
      "Durch Beteiligung von Opposition, Bundesrat und Öffentlichkeit werden unterschiedliche Interessen abgewogen, bevor eine Regelung für alle gilt.",
      "Allgemeinwohl\nÖffentliche Debatte &\nAusgleich",
    ],
  ];
  const body = pillars
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return `${i > 0 ? arrow(x - 18, 140, x - 3, 140, "arrow") : ""}${part(
        id,
        title,
        info,
        `<rect x="${x}" y="68" width="240" height="144" rx="12" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 114, short, "lbl small strong")}`,
      )}`;
    })
    .join("");
  return svg(
    800,
    240,
    "Warum das Gesetzgebungsverfahren auf Legitimität, gründliche Prüfung und Allgemeinwohl zielt",
    `${label(400, 36, "Sinn der Gesetzgebungsregeln im demokratischen Rechtsstaat", "lbl strong")}${body}`,
  );
}
