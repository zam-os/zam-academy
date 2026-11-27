/** Interactive explorer diagrams for Lernbereich 4 (Lebenswelt). */
import { label, labels, panel, part, svg } from "./draw";

export function politischeTeilhabe(): string {
  const items: Array<[string, number, number, string, string]> = [
    [
      "wahlen",
      24,
      64,
      "Wahlen\n(Bund, Land, Gemeinde)",
      "Ab 18 (bei manchen Kommunal-/Europawahlen schon ab 16) entscheidest du per geheimer Wahl mit, wer regiert und Gesetze macht.",
    ],
    [
      "parteien",
      212,
      64,
      "Parteien\n(Art. 21 GG)",
      "In Parteien (und Jugendorganisationen) arbeiten Menschen dauerhaft an Programmen mit und stellen Kandidatinnen und Kandidaten auf.",
    ],
    [
      "initiativen",
      400,
      64,
      "Bürgerinitiativen\n& Petitionen",
      "Bei konkreten Vorhaben vor Ort (z. B. Radweg, Schulbus, Lärmschutz) können Menschen sich jederzeit zusammenschließen und Unterschriften sammeln.",
    ],
    [
      "schule-jugend",
      588,
      64,
      "Jugendrat & SMV\n(schon ab heute)",
      "Auch unter 18 kannst du in der SMV, im Jugendparlament oder bei Bürgerversammlungen Anträge stellen und mitdiskutieren.",
    ],
  ];
  const body = items
    .map(([id, x, y, short, info]) =>
      part(
        id,
        short.replace("\n", " "),
        info,
        `<rect x="${x}" y="${y}" width="186" height="148" rx="12" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 93, y + 58, short, "lbl small strong")}`,
      ),
    )
    .join("");
  return svg(
    800,
    245,
    "Vier Möglichkeiten politischer Teilhabe in der Demokratie: Wahlen, Parteien, Bürgerinitiativen und Jugendbeteiligung",
    `${label(400, 36, "Wie Bürgerinnen und Bürger Demokratie mitgestalten können", "lbl strong")}${body}`,
  );
}

export function wahlbeteiligungUrsachen(): string {
  const causes: Array<[string, string, string, string]> = [
    [
      "alltag-umzug",
      "Hürde: Umzug & erster Alltag",
      "Viele 18–24-Jährige ziehen für Ausbildung oder Studium um, achten weniger auf amtliche Briefwahl-Post oder finden Programme zu sperrig.",
      "Lebensumbruch\n• Ausbildung / Umzug\n• Wahlschein übersehen",
    ],
    [
      "wirkung",
      "Gefühl geringer Wirksamkeit",
      "Wer glaubt „Meine eine Stimme ändert sowieso nichts“, bleibt eher zu Hause — überlässt dadurch aber Älteren ein noch größeres Stimmengewicht.",
      "Fehlannahme\n„Eine Stimme zählt\ndoch kaum“",
    ],
    [
      "gegenmittel",
      "Wege zu höherer Beteiligung",
      "Verständliche Jugendformate, Wahlhelfer-Erfahrung, Briefwahl und klare Information vor Ort senken die Hürde für Erstwählende deutlich.",
      "Chancen nutzen\n• Briefwahl nutzen\n• Programme prüfen",
    ],
  ];
  const body = causes
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="240" height="148" rx="12" fill="var(--f-panel)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 114, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Drei Erklärungsansätze für geringere Wahlbeteiligung von Erstwählerinnen und Erstwählern und Gegenmaßnahmen",
    `${label(400, 36, "Warum Erstwählende seltener wählen — und was sich ändert", "lbl strong")}${body}`,
  );
}

export function sozialstaatSaeulen(): string {
  const cards: Array<[string, string, string, string]> = [
    [
      "sozialvers",
      "1. Sozialversicherungen (5 Zweige)",
      "Kranken-, Pflege-, Renten-, Arbeitslosen- und Unfallversicherung sichern Arbeitnehmende gegen große Lebensrisiken gemeinsam ab.",
      "Sozialversicherungen\nBeitragsfinanziert\n(Solidarprinzip)",
    ],
    [
      "grundsicherung",
      "2. Steuerfinanzierte Hilfen",
      "Wer nicht arbeiten kann oder trotz Arbeit zu wenig Einkommen hat, erhält Unterstützung wie Bürgergeld, Wohngeld oder Kindergeld.",
      "Grundsicherung\nSteuerfinanziert\n(Existenzminimum)",
    ],
    [
      "neue-armut",
      "3. Relative & „neue Armut“",
      "Armut in Deutschland bedeutet meist nicht Hunger wie 1946, sondern Teilhabe-Ausschluss: Wer trotz Minijob, Alleinerziehen oder kleiner Rente Rechnungen und Klassenfahrten kaum zahlen kann.",
      "„Neue Armut“\ntrotz Arbeit oder\nkleiner Rente",
    ],
  ];
  const body = cards
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="240" height="148" rx="12" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 114, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Aufbau des Sozialstaats nach Artikel 20 Grundgesetz aus Sozialversicherungen, Grundsicherung und Herausforderung neuer Armut",
    `${label(400, 36, "Sozialstaat Deutschland (Art. 20 GG) und neue Armut", "lbl strong")}${body}`,
  );
}

export function tafelnGemeinnuetzig(): string {
  const cards: Array<[string, string, string, string]> = [
    [
      "spenden",
      "Lebensmittel retten",
      "Tafeln sammeln überschüssige, einwandfreie Lebensmittel von Supermärkten und Bäckereien ein, bevor sie weggeworfen werden.",
      "1. Einsammeln\nSupermärkte & Bäcker\nspenden Überschüsse",
    ],
    [
      "ehrenamt",
      "Ehrenamt & Verteilung",
      "Freiwillige Helferinnen und Helfer sortieren die Waren und geben sie gegen geringes Entgelt oder kostenlos an bedürftige Menschen aus.",
      "2. Ehrenamt\nSortieren & Ausgeben\nan Bedürftige",
    ],
    [
      "grenze",
      "Wichtig — aber kein Staatsersatz",
      "Tafeln lindern Not direkt vor Ort und vermeiden Verschwendung. Dennoch gilt: Sie ergänzen den Sozialstaat, können eine auskömmliche Rente oder Lohn aber nicht ersetzen.",
      "3. Einordnung\nWichtige Nothilfe,\nersetzt keinen Staat",
    ],
  ];
  const body = cards
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="240" height="148" rx="12" fill="var(--f-panel)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 114, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Arbeitsweise und sozialstaatliche Einordnung gemeinnütziger Tafeln zwischen Lebensmittelrettung, Ehrenamt und staatlicher Aufgabe",
    `${label(400, 36, "Gemeinnützige Einrichtungen am Beispiel der Tafeln", "lbl strong")}${body}`,
  );
}

export function generationenvertragBild(): string {
  const body = `
  ${panel(18, 18, 764, 240, "panel-bg")}
  ${label(400, 46, "Der Generationenvertrag (Umlageverfahren) und demographischer Wandel", "lbl strong")}
  ${part(
    "erwerbs",
    "Erwerbstätige zahlen Beiträge ein",
    "Wer heute arbeitet, zahlt monatlich Rentenbeiträge (je zur Hälfte Arbeitnehmer und Arbeitgeber). Das Geld wird nicht angespart, sondern sofort umgelegt.",
    `<rect class="box-blue" x="44" y="76" width="220" height="146" rx="12"/>${labels(154, 124, "Heute Berufstätige\nzahlen Beiträge in die\nRentenkasse ein", "lbl small strong")}`,
  )}
  ${part(
    "rentner",
    "Rentnerinnen und Rentner erhalten Rente",
    "Aus den laufenden Beiträgen (plus Steuerzuschuss des Bundes) werden die aktuellen Renten gezahlt. Im Gegenzug erwerben Jüngere Ansprüche für später.",
    `<rect class="box-green" x="290" y="76" width="220" height="146" rx="12"/>${labels(400, 124, "Heute im Ruhestand\nerhalten monatliche\nRentenzahlungen", "lbl small strong")}`,
  )}
  ${part(
    "wandel",
    "Demographischer Wandel verschiebt Verhältnis",
    "Weil Menschen länger leben und weniger Kinder geboren werden, kommen auf eine Rente immer weniger Beitragszahlende — das macht zusätzliche Vorsorge wichtig.",
    `<rect class="box-amber" x="536" y="76" width="220" height="146" rx="12"/>${labels(646, 118, "Demographischer Wandel\n• 1960er: viele Zahler\n• heute: immer weniger\n  pro Rentenbezug", "lbl small")}`,
  )}`;
  return svg(
    800,
    275,
    "Funktionsweise des Generationenvertrags im Umlageverfahren und Auswirkungen des demographischen Wandels",
    body,
  );
}

export function dreiSaeulenRente(): string {
  const pillars: Array<[string, string, string, string, string]> = [
    [
      "gesetzlich",
      "1. Gesetzliche Rentenversicherung",
      "Pflichtversicherung für die meisten Beschäftigten über den Generationenvertrag — bildet die breite Basis, reicht im Alter allein oft nicht für den gewohnten Lebensstandard.",
      "1. Säule\nGesetzliche Rente\n(Umlage-Basis)",
      "box-blue",
    ],
    [
      "betrieblich",
      "2. Betriebliche Altersvorsorge",
      "Arbeitgeber und Beschäftigte bauen gemeinsam über den Betrieb eine Zusatzrente auf (oft staatlich bzw. steuerlich gefördert).",
      "2. Säule\nBetriebliche\nAltersvorsorge",
      "box-purple",
    ],
    [
      "privat",
      "3. Private Vorsorge",
      "Eigene regelmäßige Rücklagen über viele Berufsjahre schließen Versorgungslücken. Früher Start nutzt lange Laufzeiten; Angebote und Kosten genau prüfen.",
      "3. Säule\nPrivate Vorsorge\n(langfristiger Aufbau)",
      "box-green",
    ],
  ];
  const body = pillars
    .map(([id, title, info, short, cls], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect class="${cls}" x="${x}" y="66" width="240" height="148" rx="12"/>${labels(x + 120, 116, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Drei-Säulen-Modell der Altersvorsorge: gesetzliche, betriebliche und private Vorsorge",
    `${label(400, 36, "Die drei Säulen der Altersvorsorge", "lbl strong")}${body}`,
  );
}

export function landbauVergleich(): string {
  const body = `
  ${part(
    "konventionell",
    "Konventionelle Landwirtschaft",
    "Setzt gezielt Mineraldünger und zugelassene Pflanzenschutzmittel ein. Vorteil: höhere Erträge je Hektar und meist niedrigere Ladenpreise. Risiko: Belastung von Grundwasser und Insektenvielfalt.",
    `${panel(18, 18, 370, 235, "panel-bg")}${label(203, 46, "Konventioneller Landbau", "lbl strong")}${labels(203, 98, "• hoher Flächenertrag\n• Mineraldünger & Pflanzenschutz\n• günstigerer Endpreis\n• Risiko für Boden & Artenvielfalt", "lbl small", "middle", 22)}`,
  )}
  ${part(
    "oekologisch",
    "Ökologischer Landbau (Bio)",
    "Verzichtet auf chemisch-synthetische Pestizide und leichtlöslichen Mineraldünger, nutzt weite Fruchtfolgen und schreibt mehr Auslauf/Platz für Tiere vor.",
    `${panel(412, 18, 370, 235, "panel-bg")}${label(597, 46, "Ökologischer Landbau (Bio)", "lbl strong")}${labels(597, 98, "• Schutz von Boden, Wasser & Bienen\n• tiergerechtere Haltungsvorgaben\n• geringerer Ertrag je Hektar\n• höherer Handarbeits- & Preisbedarf", "lbl small", "middle", 22)}`,
  )}`;
  return svg(
    800,
    270,
    "Gegenüberstellung von konventionellem und ökologischem Landbau nach Ertrag, Umweltschutz und Kosten",
    body,
  );
}

export function oekolandbauKostenBild(): string {
  const cards: Array<[string, string, string, string]> = [
    [
      "arbeit",
      "Mehr Handarbeit je Hektar",
      "Mechanisches Unkrauthacken und Pflege ohne chemische Mittel kosten deutlich mehr Arbeitsstunden auf dem Feld.",
      "Arbeitszeit\n+40–50 % mehr\nStunden auf dem Feld",
    ],
    [
      "ertrag",
      "Geringerer Flächenertrag",
      "Ohne chemisch-synthetischen Schutz fällt die Ernte pro Hektar meist kleiner aus — dieselben Grundkosten verteilen sich auf weniger Kilogramm.",
      "Erntemenge\nkleinerer Ertrag\npro Hektar (ha)",
    ],
    [
      "kontrolle",
      "Bio-Futter & Zertifizierung",
      "Staatlich geprüfte Öko-Kontrollen und Bio-Futtermittel erhöhen die Betriebskosten, senken aber versteckte Folgekosten für Grundwasser und Arten.",
      "Kontrolle & Qualität\nÖko-Prüfung und\nBio-Futter",
    ],
  ];
  const body = cards
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `<rect x="${x}" y="66" width="240" height="148" rx="12" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>${labels(x + 120, 114, short, "lbl small strong")}`,
      );
    })
    .join("");
  return svg(
    800,
    245,
    "Drei Kostentreiber des ökologischen Anbaus: Arbeitsstunden, geringerer Flächenertrag und Bio-Kontrolle",
    `${label(400, 36, "Warum nachhaltige regionale Bio-Lebensmittel mehr kosten (M-Zug)", "lbl strong")}${body}`,
  );
}
