/**
 * Interactive 3-part explorer diagrams (three selectable SVG groups with a brief
 * explanation per part). Works with buttons and direct clicks on SVG groups.
 */
import { esc } from "../workshop";
import { arrow, label, labels } from "./draw";

export interface ExplorerPart {
  label: string;
  detail: string;
}

export interface ExplorerSpec {
  id: string;
  title: string;
  caption: string;
  parts: [ExplorerPart, ExplorerPart, ExplorerPart];
  draw: (active: number) => string;
}

function partGroup(index: number, active: number, labelText: string, inner: string): string {
  const stateClass = active === index ? "geo-part is-active" : "geo-part is-muted";
  return `<g class="${stateClass}" data-explore-part="${index}" tabindex="0" role="button" aria-pressed="${active === index}" aria-label="${esc(labelText)}">${inner}</g>`;
}

function threeColumnCards(
  active: number,
  cards: readonly [
    { head: string; sub: string; motif: string },
    { head: string; sub: string; motif: string },
    { head: string; sub: string; motif: string },
  ],
  arrows = true,
): string {
  const w = 166;
  const h = 148;
  const y = 34;
  return cards
    .map((c, i) => {
      const x = 22 + i * 184;
      const body =
        `<rect class="geo-card-box geo-color-${i}" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>` +
        `<g transform="translate(${x + 12}, ${y + 42})">${c.motif}</g>` +
        label(x + w / 2, y + 24, c.head, "lbl small strong") +
        labels(x + w / 2, y + 116, c.sub, "lbl tiny", "middle", 14) +
        (arrows && i < 2 ? arrow(x + w + 2, y + h / 2, x + w + 16, y + h / 2) : "");
      return partGroup(i, active, c.head, body);
    })
    .join("");
}

export const EXPLORERS: Record<string, ExplorerSpec> = {
  kartenschichten: {
    id: "kartenschichten",
    title: "Karten und Satellitenbilder in drei Ebenen lesen",
    caption: "Klicke auf einen Teilbereich oder eine Taste, um die Auswertungsebene hervorzuheben.",
    parts: [
      { label: "1. Gradnetz & Lage", detail: "Breiten- und Längengrade ordnen einen Raum eindeutig ein (z. B. 0° Äquator, 23,5° N/S Wendekreise) und erlauben den globalen Vergleich." },
      { label: "2. Thematische Ebene", detail: "Klima- und Vegetationskarten bündeln Messreihen zu Mustern – etwa tropische Regenwälder entlang des Äquators und Wüstengürtel an den Wendekreisen." },
      { label: "3. Satelliten-Zeitreihe", detail: "Aktuelle und frühere Satellitenaufnahmen machen Landnutzungswandel (Rodungsstraßen, Stauseen, Städtewachstum) direkt sichtbar." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Drei Ebenen moderner Karten und Satellitenbilder" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Karten- und Satellitenauswertung in drei Schritten", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Lage & Gradnetz",
          sub: "Äquator, Wendekreise\nund Maßstab klären",
          motif: '<circle class="geo-globe-fill" cx="71" cy="24" r="24"/><ellipse class="geo-wire" cx="71" cy="24" rx="11" ry="24"/><line class="geo-equator" x1="47" y1="24" x2="95" y2="24"/>',
        },
        {
          head: "2. Themenkarte",
          sub: "Klima- und Vegetations-\nmuster vergleichen",
          motif: '<rect class="geo-band-tropic" x="34" y="4" width="74" height="14" rx="3"/><rect class="geo-band-desert" x="34" y="20" width="74" height="14" rx="3"/><rect class="geo-band-temp" x="34" y="36" width="74" height="12" rx="3"/>',
        },
        {
          head: "3. Satellitenbild",
          sub: "Veränderungen über\nZeit erfassen",
          motif: '<rect class="geo-veg-rain" x="34" y="4" width="74" height="44" rx="5"/><path class="geo-sand" d="M34 26h74v6H34zm18-10h6v24h-6zm22-6h6v30h-6z"/>',
        },
      ]) +
      `</svg>`,
  },

  kausalprofil: {
    id: "kausalprofil",
    title: "Blockbild und Kausalprofil verknüpfen",
    caption: "Ein Kausalprofil ordnet Raumfaktoren von den Naturgrundlagen bis zur menschlichen Nutzung.",
    parts: [
      { label: "1. Relief & Meer", detail: "Höhenlage, Gebirgsketten (Luv/Lee) und kalte oder warme Meeresströmungen steuern die Luftfeuchte und Temperaturverteilung." },
      { label: "2. Klima & Wasser", detail: "Aus Einstrahlung, Luftbewegung und Niederschlag ergeben sich humide oder aride Monate und der Wasserhaushalt des Standorts." },
      { label: "3. Boden & Nutzung", detail: "Bodenfruchtbarkeit, Erosionsempfindlichkeit und Wasserverfügbarkeit bestimmen die angepasste Landwirtschaft oder das Risiko von Degradierung." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 218" role="img" aria-label="Kausalprofil vom Relief über Klima zur Nutzung" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Aufbau eines Kausalprofils (Relief → Klima → Boden & Nutzung)", "lbl strong") +
      partGroup(0, active, "Relief und Gebirge",
        `<path class="geo-sand" d="M24 166 L90 112 L154 62 L216 122 L280 156 L556 166 V186 H24 Z"/>` +
        `<rect class="sea" x="24" y="166" width="52" height="20"/>` +
        label(154, 52, "1. Relief & Höhenlage", "lbl small strong") +
        label(112, 178, "Meer / Luv-Anstieg", "lbl tiny")) +
      partGroup(1, active, "Klima und Niederschlag",
        `<ellipse class="geo-cloud" cx="115" cy="64" rx="30" ry="14"/>` +
        `<path class="geo-rain" d="M100 84h3v22h-3zm14-4h3v24h-3zm14 4h3v20h-3z"/>` +
        arrow(56, 130, 120, 82, "geo-wind-arrow") +
        arrow(195, 76, 265, 134, "geo-dry-arrow") +
        label(290, 52, "2. Klima, Wind & Regen", "lbl small strong") +
        label(248, 108, "Abregnen / Lee-Trockenheit", "lbl tiny")) +
      partGroup(2, active, "Boden und Nutzung",
        `<rect class="geo-veg-rain" x="292" y="150" width="120" height="16" rx="3"/>` +
        `<rect class="geo-crop-strip" x="424" y="150" width="124" height="16" rx="3"/>` +
        label(426, 52, "3. Boden & Landnutzung", "lbl small strong") +
        labels(420, 132, "Bodenart · Wasserbilanz\n→ Weide, Feld oder Schutz", "lbl tiny") +
        label(290, 204, "Jede Stufe greift in die nächste ein: Naturfaktoren und Nutzung werden mit Pfeilen verknüpft.", "lbl tiny muted")) +
      `</svg>`,
  },

  "methoden-trias": {
    id: "methoden-trias",
    title: "Hypothese, Stadtmodell und digitale Recherche",
    caption: "In Lernbereich 1 übst du naturgeographische Hypothesen, räumliche Stadtmodelle und Quellenkritik.",
    parts: [
      { label: "1. Experiment & Hypothese", detail: "Formuliere eine überprüfbare Vermutung (z. B. Wasserdurchlässigkeit von Sand vs. Lehm), führe einen Kontrollversuch durch und werte die Messwerte aus." },
      { label: "2. Stadtmodell & Luftbild", detail: "Ein Stadtmodell vereinfacht die Wirklichkeit (z. B. Altstadt, CBD, Viertel). Im Luftbild überprüfst du, wo reale Straßenzüge oder Nutzungen abweichen." },
      { label: "3. Recherche bewerten", detail: "Prüfe digitale Quellen auf Urheber, Datum, Belege und Interessen: Behauptungen ohne Datengrundlage oder ohne klare Herkunft erkennst du sofort." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Experimente, Stadtmodelle und digitale Recherche" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Drei geographische Arbeitsweisen im Überblick", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Hypothese testen",
          sub: "Vermutung → Versuch\n→ Messdaten prüfen",
          motif: '<rect class="jar" x="46" y="4" width="22" height="40" rx="4"/><rect class="jar" x="76" y="4" width="22" height="40" rx="4"/><rect class="geo-rain" x="48" y="24" width="18" height="18"/><rect class="geo-sand" x="78" y="30" width="18" height="12"/>',
        },
        {
          head: "2. Modell vs. Luftbild",
          sub: "Stadtmodell am realen\nGrundriss überprüfen",
          motif: '<circle class="geo-color-1" cx="71" cy="24" r="22"/><circle class="geo-color-0" cx="71" cy="24" r="11"/><line class="geo-axis" x1="42" y1="24" x2="100" y2="24"/>',
        },
        {
          head: "3. Quellen prüfen",
          sub: "Autor, Datum, Methode\nund Gegenbeleg checken",
          motif: '<rect class="paper" x="42" y="4" width="58" height="44" rx="5"/><path class="geo-shore" d="M52 16h38M52 26h28M52 36h18"/><circle class="geo-focus-dot" cx="88" cy="36" r="7"/>',
        },
      ], false) +
      `</svg>`,
  },

  lebensrealitaeten: {
    id: "lebensrealitaeten",
    title: "Lebensrealitäten von Kindern und Jugendlichen vergleichen",
    caption: "Auch innerhalb eines Landes unterscheiden sich Alltag, Bildungschancen und Versorgung zwischen Stadt, Land und Einkommensgruppen.",
    parts: [
      { label: "1. Schule & Bildung", detail: "Schulwege, Gebühren, Lernmittel und die Frage, ob Kinder nebenher arbeiten müssen, entscheiden über Abschlüsse und Berufswege." },
      { label: "2. Wasser & Gesundheit", detail: "Sicherer Zugang zu sauberem Trinkwasser, Strom und medizinischer Versorgung spart täglich Stunden an Zeit und senkt Krankheitsrisiken." },
      { label: "3. Arbeit & Alltag", detail: "In Ländern niedrigen Entwicklungsstandes arbeiten viele Jugendliche früh im informellen Sektor oder in der Landwirtschaft, während Städte Chancen und Härten bündeln." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Lebensrealitäten von Jugendlichen in drei Alltagsfeldern" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Alltag von Jugendlichen: drei Dimensionen im Vergleich", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Bildung & Weg",
          sub: "Erreichbarkeit, Kosten,\nZeit für Hausaufgaben",
          motif: '<rect class="geo-color-1" x="40" y="10" width="62" height="34" rx="4"/><path class="geo-shore" d="M71 10v34M48 20h16M78 20h16"/>',
        },
        {
          head: "2. Wasser & Praxis",
          sub: "Trinkwasserqualität,\nWegezeit & Impfschutz",
          motif: '<path class="geo-rain" d="M71 6 C86 22 86 38 71 46 C56 38 56 22 71 6 Z"/>',
        },
        {
          head: "3. Arbeit & Zukunft",
          sub: "Formelle Ausbildung vs.\ninformelle Mithilfe",
          motif: '<rect class="geo-color-2" x="42" y="14" width="24" height="30" rx="3"/><rect class="geo-color-0" x="74" y="6" width="24" height="38" rx="3"/>',
        },
      ], false) +
      `</svg>`,
  },

  "ez-und-flucht": {
    id: "ez-und-flucht",
    title: "Entwicklungszusammenarbeit und Fluchtursachen im Heimatraum",
    caption: "Zusammenarbeit zielt auf eigenständige Strukturen vor Ort; Fluchtursachen verbinden globale Krisen mit dem Heimatraum.",
    parts: [
      { label: "1. Formen der EZ", detail: "Staatliche (bilaterale/multilaterale) und zivilgesellschaftliche Projekte arbeiten zusammen – über Kredite, Fachberatung, Bildung und Handelspolitik." },
      { label: "2. Hilfe zur Selbsthilfe", detail: "Nachhaltige Projekte stärken lokale Betriebe, Frauengenossenschaften, Ausbildung und Wassersicherung, statt dauerhafte Abhängigkeit zu schaffen." },
      { label: "3. Spurensuche hier", detail: "Geflüchtete im eigenen Landkreis oder faire Lieferketten im Supermarkt zeigen, wie eng weltweite Konflikte, Klima und Alltag in Bayern verknüpft sind." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Entwicklungszusammenarbeit und globaler Bezug im Heimatraum" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Von der Entwicklungszusammenarbeit bis in den Heimatraum", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Akteure der EZ",
          sub: "Staatlich, UNO/EU\nund NGOs vor Ort",
          motif: '<circle class="geo-color-0" cx="56" cy="24" r="14"/><circle class="geo-color-1" cx="86" cy="24" r="14"/>',
        },
        {
          head: "2. Selbsthilfe stärken",
          sub: "Bildung, Infrastruktur\nund faire Wertschöpfung",
          motif: '<path class="geo-crop-strip" d="M36 38h70v10H36z"/><path class="geo-ridge" d="M52 38v-20M71 38v-26M90 38v-16"/>',
        },
        {
          head: "3. Heimatraum-Bezug",
          sub: "Integration vor Ort &\nFluchtursachen mindern",
          motif: '<path class="geo-color-2" d="M44 26 L71 8 L98 26 V46 H44 Z"/>',
        },
      ]) +
      `</svg>`,
  },

  "sonderfaelle-trockenheit": {
    id: "sonderfaelle-trockenheit",
    title: "Warum Wüsten nicht nur an den Wendekreisen entstehen",
    caption: "Neben der Passatzirkulation erzeugen kalte Meeresströmungen, Gebirgsbarrieren und extreme Binnenlagen eigene Wüstentypen.",
    parts: [
      { label: "1. Wendekreiswüste", detail: "Im Subtropenhoch um ca. 30° N/S sinkt trockene Luft großflächig ab und erwärmt sich adiabatisch – Wolken lösen sich auf (z. B. Sahara)." },
      { label: "2. Kalte Strömung (Nebel)", detail: "Vor der Atacama (Humboldtstrom) oder Namib (Benguelastrom) kühlt kaltes Wasser die Luft ab: Küstennebel entsteht, aber kein Aufstieg und kaum Regen." },
      { label: "3. Regenschatten (Lee)", detail: "Hohe Gebirge zwingen Luft auf der Luvseite zum Abregnen. Im Lee sinkt die Luft trocken ab (z. B. Patagonien hinter den Anden)." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 212" role="img" aria-label="Drei Entstehungstypen von Trockenräumen und Wüsten" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Drei Entstehungsursachen arider Räume (Besonderheiten)", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Passathoch (~30°)",
          sub: "Absinkende Luft erwärmt\nsich (z. B. Sahara)",
          motif: '<rect class="geo-sand" x="34" y="34" width="74" height="14" rx="3"/>' + arrow(58, 4, 58, 30, "geo-dry-arrow") + arrow(84, 4, 84, 30, "geo-dry-arrow"),
        },
        {
          head: "2. Kalter Meeresstrom",
          sub: "Inversion + Nebel, kaum\nRegen (z. B. Atacama)",
          motif: '<rect class="sea" x="34" y="28" width="38" height="20"/><rect class="geo-sand" x="72" y="22" width="36" height="26"/><ellipse class="geo-cloud" cx="62" cy="18" rx="22" ry="7"/>',
        },
        {
          head: "3. Lee-Regenschatten",
          sub: "Feuchte fällt im Luv,\nLee bleibt trocken",
          motif: '<polygon class="geo-mountain-sil" points="36,46 66,8 92,46"/><rect class="geo-sand" x="90" y="38" width="22" height="8"/>' + arrow(76, 12, 104, 34, "geo-dry-arrow"),
        },
      ], false) +
      label(290, 198, "Zusätzlich verstärkt große Meeresferne (Kontinentalität) die Trockenheit im Landesinneren.", "lbl tiny muted") +
      `</svg>`,
  },

  "klimapositionen-check": {
    id: "klimapositionen-check",
    title: "Positionen zum Klimawandel wissenschaftlich prüfen",
    caption: "Unterscheide natürliche Klimaschwankungen von dem seit der Industrialisierung messbaren anthropogenen Antrieb.",
    parts: [
      { label: "1. Extraterrestrisch", detail: "Sonnenaktivität und langfristige Erdbahnparameter (Milanković-Zyklen über zehntausende Jahre) verändern die Einstrahlung, erklären aber nicht die rasche Erwärmung der letzten Jahrzehnte." },
      { label: "2. Terrestrisch & CO₂", detail: "Vulkanismus, Albedoänderungen und vor allem menschliche Treibhausgasemissionen (CO₂, CH₄, N₂O) verändern den Strahlungshaushalt unmittelbar und messbar." },
      { label: "3. Aussagen prüfen", detail: "Typische Trugschlüsse verwechseln lokales Wetter („kalter Wintertag“) mit globalem Klima oder greifen einzelne Jahre ohne langfristigen Trend heraus." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Antriebskräfte und Prüfkriterien in der Klimadebatte" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Ursachen prüfen und Positionen sachlich hinterfragen", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Extraterrestrisch",
          sub: "Sonne & Erdbahn\n(langsame Zyklen)",
          motif: '<circle class="sun-circle" cx="71" cy="24" r="14"/><ellipse class="geo-wire" cx="71" cy="24" rx="30" ry="20"/>',
        },
        {
          head: "2. Terrestrisch",
          sub: "Treibhausgase, Vulkane,\nAlbedo-Rückkopplung",
          motif: '<rect class="geo-ghg-band" x="34" y="10" width="74" height="22" rx="6" opacity="0.65"/>' + arrow(71, 44, 71, 16, "geo-ir-arrow"),
        },
        {
          head: "3. Kritisch prüfen",
          sub: "Wetter ≠ Klima · Trends\n& Quellen belegen",
          motif: '<polyline class="geo-temp" points="38,40 52,32 66,35 80,20 98,10"/><line class="geo-axis" x1="38" y1="44" x2="104" y2="44"/>',
        },
      ], false) +
      `</svg>`,
  },

  "klimaschutz-anpassung": {
    id: "klimaschutz-anpassung",
    title: "Klimaschutz (Mitigation), Anpassung und Heimatraum",
    caption: "Globaler Klimaschutz bremst die Erwärmung; Anpassung vor Ort verringert die Schäden bereits unvermeidbarer Extremwetter.",
    parts: [
      { label: "1. Mitigation (Schutz)", detail: "Emissionen senken durch erneuerbare Energien, Verkehrswende, Gebäudesanierung, Moore- und Waldschutz." },
      { label: "2. Adaptation (Anpassung)", detail: "Schäden abfedern durch Schwammstädte, Entsiegelung, Hitzeschutzpläne, Hochwasserrückhalteräume und trockenheitsverträglichen Mischwald." },
      { label: "3. Heimatraum Bayern", detail: "In Bayern steigt im Berg- und Alpenraum das Risiko von Starkregen, Muren und Trockenstress im Wald – Klimaschutz und Anpassung greifen direkt vor der Haustür." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Klimaschutz und Klimaanpassung bis in den Heimatraum" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Zwei Antworten auf den Klimawandel – vom Globus bis Bayern", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Klimaschutz",
          sub: "Ursachen mindern:\nCO₂ & CH₄ senken",
          motif: '<circle class="geo-color-3" cx="71" cy="24" r="20"/><path class="geo-wire" d="M71 8v32M58 24h26"/>',
        },
        {
          head: "2. Anpassung",
          sub: "Schwammstadt, Deiche,\nMischwald & Hitzeschutz",
          motif: '<rect class="geo-veg-rain" x="38" y="28" width="66" height="16" rx="4"/><path class="geo-rain" d="M52 8v16M71 6v18M90 10v14"/>',
        },
        {
          head: "3. Vor Ort in Bayern",
          sub: "Kommune, Schulweg,\nSchutzwald & Energie",
          motif: '<polygon class="geo-mountain-sil" points="36,44 62,12 86,44"/><rect class="geo-color-1" x="80" y="22" width="24" height="22" rx="3"/>',
        },
      ], false) +
      `</svg>`,
  },

  "orientalische-stadt": {
    id: "orientalische-stadt",
    title: "Die orientalische Stadt und ihre moderne Entwicklung",
    caption: "Historische Grundmuster wie Medina und Suq treffen heute auf moderne Geschäftsbezirke und oft auch auf starke Kontraste zu deutschen Städten.",
    parts: [
      { label: "1. Altstadt (Medina)", detail: "Um die Hauptmoschee gruppieren sich branchensortierte Basare (Suqs). Sackgassen und nach innen gerichtete Innenhofhäuser (Riads/Patios) schützen vor Hitze und Einblicken." },
      { label: "2. Moderne Neustadt", detail: "Breite Achsen, Hochhäuser, internationale Einkaufszentren und Vorstädte (teilweise aus dem Erdölboom) setzen eigene Wachstumszentren neben die Altstadt." },
      { label: "3. Vergleich Deutschland", detail: "Während deutsche Altstädte oft offene Plätze und Straßenraster rund um Rathaus und Kirche zeigen, trennte die traditionelle orientalische Stadt Wohnruhe und öffentlichen Handel schärfer." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 212" role="img" aria-label="Grundrissmodell einer orientalischen Stadt mit Altstadt und Neustadt" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Strukturwandel der orientalischen Stadt im Modell", "lbl strong") +
      partGroup(0, active, "Altstadt (Medina und Suq)",
        `<rect class="geo-sand" x="26" y="38" width="210" height="134" rx="14"/>` +
        `<rect class="geo-color-1" x="104" y="76" width="54" height="44" rx="6"/>` +
        `<path class="geo-shore" d="M72 56h118M72 146h90M60 80v60M184 72v74"/>` +
        label(131, 62, "1. Medina · Sackgassen", "lbl small strong") +
        label(131, 102, "Moschee & Suq", "lbl tiny strong") +
        label(131, 162, "Innenhofhäuser (Schatten)", "lbl tiny")) +
      partGroup(1, active, "Moderne Neustadt und CBD",
        `<rect class="geo-color-2" x="258" y="38" width="160" height="134" rx="14"/>` +
        `<rect class="tower" x="278" y="84" width="26" height="68" rx="3"/>` +
        `<rect class="tower" x="314" y="64" width="32" height="88" rx="3"/>` +
        `<rect class="tower" x="356" y="78" width="36" height="74" rx="3"/>` +
        label(338, 56, "2. Moderne Stadt", "lbl small strong") +
        label(338, 164, "Breite Achsen & CBD", "lbl tiny")) +
      partGroup(2, active, "Vergleich mit deutscher Stadt",
        `<rect class="geo-color-0" x="436" y="38" width="122" height="134" rx="14"/>` +
        `<rect class="paper" x="458" y="78" width="78" height="58" rx="5"/>` +
        `<line class="geo-axis" x1="458" y1="107" x2="536" y2="107"/>` +
        `<line class="geo-axis" x1="497" y1="78" x2="497" y2="136"/>` +
        label(497, 56, "3. Vergleich", "lbl small strong") +
        labels(497, 152, "Offener Marktplatz\n& Straßenraster", "lbl tiny")) +
      label(290, 198, "Historische Altstadt und autogerechte Neustadt bestehen nebeneinander (Bipolarität).", "lbl tiny muted") +
      `</svg>`,
  },

  "mena-konflikte-migration": {
    id: "mena-konflikte-migration",
    title: "Konflikte, Wassermangel und Migration in MENA",
    caption: "Gewaltsame Konflikte, Wasserknappheit und wirtschaftliche Unterschiede lösen sehr verschiedene Wanderungsbewegungen aus.",
    parts: [
      { label: "1. Raumkonflikte", detail: "Grenzüberschreitende Flüsse (Nil, Euphrat/Tigris), Staudämme, Rohstoffe und politische Konflikte prägen Infrastruktur, Grenzen und Siedlungsräume." },
      { label: "2. Flucht & Binnenmigration", detail: "Bürgerkriege, Verfolgung und Ernteausfälle zwingen Millionen Menschen innerhalb der Region (Nachbarländer, Binnenvertriebene) und darüber hinaus zur Flucht." },
      { label: "3. Arbeitsmigration", detail: "In ölreiche Golfstaaten wandern zahlreiche Arbeitskräfte aus Süd- und Südostasien sowie Nachbarländern zu – oft mit befristeten Verträgen und ohne volle Bürgerrechte." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Konflikte und Migrationsformen in Nordafrika und Nahost" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Raumwirksame Konflikte und vielfältige Migration in MENA", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Wasser & Konflikt",
          sub: "Staudämme, Flüsse &\npolitische Spannungen",
          motif: '<path class="river" d="M36 32 Q60 12 72 28 T108 20"/><rect class="geo-stone" x="68" y="14" width="8" height="24" rx="2"/>',
        },
        {
          head: "2. Fluchtbewegungen",
          sub: "Krieg & Existenznot:\nBinnen- & Nachbarländer",
          motif: arrow(38, 28, 102, 18, "geo-ir-arrow") + '<circle class="geo-focus-dot" cx="44" cy="28" r="6"/>',
        },
        {
          head: "3. Arbeitsmigration",
          sub: "Zuzug in Golfmetropolen\n(z. B. Bau & Dienste)",
          motif: arrow(42, 34, 86, 16, "geo-warm-arrow") + '<rect class="tower" x="86" y="6" width="14" height="36" rx="2"/>',
        },
      ], false) +
      `</svg>`,
  },

  "sahel-system": {
    id: "sahel-system",
    title: "Desertifikation als Mensch-Umwelt-System",
    caption: "Nicht eine Ursache allein, sondern die Rückkopplung aus Dürrejahren und Bodendruck löst Desertifikation aus – und lässt sich gezielt bremsen.",
    parts: [
      { label: "1. Klimaschwankung", detail: "Im Sahel schwanken die jährlichen Monsun- und Zenitalregen stark. Einzelne Dürrejahre gehören zum natürlichen Klima dieser Übergangszone." },
      { label: "2. Menschlicher Druck", detail: "Zu viele Weidetiere auf kleiner Fläche, Brennholzrodung und verkürzte Brachezeiten legen den Boden bloß – Wind und Starkregen tragen die Krume ab." },
      { label: "3. Nachhaltige Maßnahmen", detail: "Kontur-Steinwälle, Zaï-Pflanzgruben mit Kompost und Agroforst bremsen Oberflächenabfluss, fangen Samen und bauen schützende Humusschichten wieder auf." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Ursachen und Gegenmaßnahmen der Desertifikation" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Sahelzone: Vom Teufelskreis zur Bodenregeneration", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Dürreschwankung",
          sub: "Variable Regenzeit\nim Übergang zur Sahara",
          motif: '<circle class="sun-circle" cx="71" cy="18" r="12"/><line class="geo-dry-arrow" x1="42" y1="40" x2="100" y2="40"/>',
        },
        {
          head: "2. Übernutzung",
          sub: "Überweidung, Rodung,\nErosion durch Wind/Regen",
          motif: '<path class="geo-sand" d="M36 28 Q56 18 76 28 T108 26 V46 H36 Z"/>' + arrow(40, 14, 96, 14, "geo-dry-arrow"),
        },
        {
          head: "3. Gegenmaßnahmen",
          sub: "Steinwälle, Zaï-Gruben\n& angepasster Agroforst",
          motif: '<rect class="geo-crop-strip" x="36" y="28" width="72" height="16" rx="4"/><circle class="geo-veg-rain" cx="56" cy="20" r="9"/><circle class="geo-veg-rain" cx="86" cy="20" r="9"/>',
        },
      ]) +
      `</svg>`,
  },

  "subsahara-hemmnisse": {
    id: "subsahara-hemmnisse",
    title: "Endogene Entwicklungshemmnisse und Schlüsselprobleme",
    caption: "Innere Hemmnisse und strukturelle Aufgaben lassen sich nicht pauschal auf ganz Afrika übertragen, sondern an konkreten Beispielen verstehen.",
    parts: [
      { label: "1. Endogene Hemmnisse", detail: "Schwache Verkehrsnetze, Korruption oder mangelnde Rechtssicherheit, innerstaatliche Konflikte und einseitige Exportabhängigkeit bremsen eigene Wertschöpfung." },
      { label: "2. Zwei Schlüsselprobleme", detail: "Beispiele sind die Versorgung einer jungen, stark wachsenden Bevölkerung mit Bildung/Gesundheit sowie Ernährungs- und Energiesicherheit im ländlichen Raum." },
      { label: "3. Nachhaltige Ansätze", detail: "Dezentrale Solarenergie, lokale Verarbeitung agrarischer Rohstoffe (statt Roh-Export), verbesserte Ausbildung und Regionalhandel schaffen tragfähige Perspektiven." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Endogene Entwicklungshemmnisse und nachhaltige Lösungsansätze" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Afrika südlich der Sahara: Hemmnisse & Lösungswege", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Endogene Hemmnisse",
          sub: "Governance, Infrastruktur,\nKonflikte, Binnenlage",
          motif: '<rect class="geo-color-1" x="42" y="10" width="58" height="32" rx="4"/><line class="geo-ir-arrow" x1="48" y1="40" x2="94" y2="12"/>',
        },
        {
          head: "2. Schlüsselprobleme",
          sub: "Bildung/Gesundheit &\nErnährungssicherheit",
          motif: '<circle class="geo-color-2" cx="54" cy="24" r="14"/><rect class="geo-color-0" x="76" y="10" width="24" height="28" rx="4"/>',
        },
        {
          head: "3. Eigene Lösungen",
          sub: "Lokale Verarbeitung,\nSolarstrom & Bildung",
          motif: '<rect class="solar" x="42" y="12" width="58" height="26" rx="4"/><path class="geo-wire" d="M56 12v26M86 12v26"/>',
        },
      ]) +
      `</svg>`,
  },

  "fdi-und-projekt": {
    id: "fdi-und-projekt",
    title: "Ausländische Direktinvestitionen und Entwicklungsprojekte",
    caption: "Direktinvestitionen bringen Kapital und Infrastruktur, werfen aber Fragen nach Schulden, Arbeitsbedingungen und lokaler Wertschöpfung auf.",
    parts: [
      { label: "1. Direktinvestitionen", detail: "Unternehmen oder Staatsfonds (z. B. aus China, Europa oder den Golfstaaten) investieren in Häfen, Bahnen, Bergbau, Fabriken oder Agrarflächen." },
      { label: "2. Chancen & Risiken", detail: "Chancen sind Straßen, Stromnetze und Arbeitsplätze; Risiken sind Verschuldung, Landnutzungskonflikte, Umweltschäden und der Abfluss von Gewinnen." },
      { label: "3. Deutsches Projekt", detail: "Deutsche Entwicklungsprojekte (z. B. berufliche Bildung, Trinkwasserversorgung oder erneuerbare Energie) setzen auf Partnerschaft, Umweltstandards und lokale Trägerschaft." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Ausländische Direktinvestitionen und deutsches Entwicklungsprojekt" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Globale Verflechtung: Direktinvestitionen & Partnerschaft", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. FDI-Bereiche",
          sub: "Häfen, Eisenbahn,\nRohstoffe & Industrie",
          motif: '<rect class="geo-color-2" x="36" y="16" width="32" height="28" rx="3"/><rect class="geo-color-1" x="74" y="8" width="32" height="36" rx="3"/>',
        },
        {
          head: "2. Chancen & Risiken",
          sub: "Infrastruktur vs.\nSchulden & Landkonflikt",
          motif: '<line class="geo-shore" x1="38" y1="26" x2="104" y2="26"/><circle class="geo-veg-rain" cx="48" cy="20" r="8"/><circle class="geo-tip-dot" cx="94" cy="30" r="8"/>',
        },
        {
          head: "3. Projektbeispiel",
          sub: "Ausbildung, Wasser &\nKlimapartnerschaft",
          motif: '<rect class="geo-veg-rain" x="40" y="10" width="62" height="34" rx="8"/><path class="geo-wire" d="M56 26l10 10 20-18"/>',
        },
      ], false) +
      `</svg>`,
  },

  "hurrikan-vulnerabilitaet": {
    id: "hurrikan-vulnerabilitaet",
    title: "Hurrikane und Verwundbarkeit im karibischen Raum",
    caption: "Ein Naturereignis wird zur Katastrophe, wenn extreme Wind- und Wassermassen auf ungeschützte Siedlungen und Inselinfrastruktur treffen.",
    parts: [
      { label: "1. Entstehung über Meer", detail: "Über warmem Tropenmeer (über 26,5 °C) steigt feuchte Luft massiv auf; ab ca. 5° Abstand vom Äquator setzt die Corioliskraft die Luftmasse in Rotation." },
      { label: "2. Dreifache Wucht", detail: "Sturmflut an flachen Küsten, extreme Windböen und tagelanger Starkregen (mit Erdrutschen an steilen Inselhängen) treffen oft mehrere Staaten hintereinander." },
      { label: "3. Hohe Verwundbarkeit", detail: "Kleine Inselstaaten haben wenig Ausweichraum, leicht gebaute Küstensiedlungen und hohe Abhängigkeit von Tourismus oder Agrarexport; Frühwarnung rettet Leben." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Entstehung und Verwundbarkeit bei karibischen Hurrikanen" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Karibik: Warum Hurrikane dort so hohe Schäden verursachen", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Antrieb ab 26,5 °C",
          sub: "Warmes Meerwasser +\nCoriolis-Rotation",
          motif: '<circle class="geo-tip-ring" cx="71" cy="24" r="18"/><circle class="geo-tip-dot" cx="71" cy="24" r="5"/>',
        },
        {
          head: "2. Sturm, Flut & Regen",
          sub: "Küstenüberflutung &\nErdrutsche am Hang",
          motif: '<rect class="sea" x="36" y="28" width="70" height="18" rx="3"/><path class="geo-rain" d="M48 6v18M70 6v18M92 6v18"/>',
        },
        {
          head: "3. Vulnerabilität",
          sub: "Enge Insellage, Bauweise\n& Schutzsysteme",
          motif: '<polygon class="geo-sand" points="38,44 71,14 104,44"/><rect class="geo-color-0" x="60" y="28" width="22" height="16" rx="2"/>',
        },
      ]) +
      `</svg>`,
  },

  "amazonas-satellit": {
    id: "amazonas-satellit",
    title: "Amazonien im Satellitenbild und Konzepte nachhaltiger Nutzung",
    caption: "Digitale Globen und Satellitenbilder zeigen typische Fischgrätenmuster entlang neuer Straßen – und Alternativen ohne Kahlschlag.",
    parts: [
      { label: "1. Erschließungsstraße", detail: "Zuerst durchschneidet eine Hauptstraße den geschlossenen Regenwald – im Satellitenbild eine helle gerade Linie durch dichtes Dunkelgrün." },
      { label: "2. Fischgrätenmuster", detail: "Rechtwinklig zur Straße entstehen Seitenwege: Weideflächen, Brandrodung, Sojafelder und Holzeinschlag zerschneiden den Wald und lösen Trockenstress und CO₂-Freisetzung aus." },
      { label: "3. Nachhaltige Nutzung", detail: "Schutzgebiete, Agroforstsysteme (Kombination aus Bäumen, Paranuss, Kakao) und streng kontrollierte Waldwirtschaft erhalten den geschlossenen Kreislauf." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 212" role="img" aria-label="Satellitenschema des Fischgrätenmusters in Amazonien" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Amazonien im Satellitenblick: Eingriff und nachhaltige Alternative", "lbl strong") +
      partGroup(0, active, "Geschlossener Wald mit Straße",
        `<rect class="geo-veg-rain" x="26" y="40" width="166" height="130" rx="10"/>` +
        `<line class="geo-sand" x1="40" y1="105" x2="178" y2="105" stroke="var(--f-sand)" stroke-width="7"/>` +
        label(109, 58, "1. Straße im Wald", "lbl small on-dark") +
        label(109, 152, "Erster Zugangskorridor", "lbl tiny on-dark")) +
      partGroup(1, active, "Fischgrätenmuster der Abholzung",
        `<rect class="geo-veg-rain" x="206" y="40" width="166" height="130" rx="10"/>` +
        `<rect class="geo-sand" x="220" y="102" width="138" height="7"/>` +
        `<rect class="geo-sand" x="236" y="72" width="14" height="66"/>` +
        `<rect class="geo-sand" x="266" y="66" width="16" height="76"/>` +
        `<rect class="geo-sand" x="298" y="70" width="16" height="70"/>` +
        `<rect class="geo-sand" x="330" y="76" width="14" height="58"/>` +
        label(289, 58, "2. Fischgrätenmuster", "lbl small on-dark") +
        label(289, 156, "Weide · Soja · Fragmentierung", "lbl tiny on-dark")) +
      partGroup(2, active, "Nachhaltige Nutzung und Agroforst",
        `<rect class="geo-veg-rain" x="386" y="40" width="168" height="130" rx="10"/>` +
        `<rect class="geo-crop-strip" x="404" y="84" width="132" height="52" rx="8"/>` +
        `<circle class="geo-veg-rain" cx="428" cy="110" r="12"/><circle class="geo-veg-rain" cx="470" cy="110" r="12"/><circle class="geo-veg-rain" cx="512" cy="110" r="12"/>` +
        label(470, 58, "3. Nachhaltige Nutzung", "lbl small on-dark") +
        label(470, 156, "Agroforst · Schutzgebiete", "lbl tiny on-dark")) +
      label(290, 196, "Reale historische und aktuelle Satellitenbilder wertest du auf digitalen Globen (z. B. Copernicus) aus.", "lbl tiny muted") +
      `</svg>`,
  },

  "latam-stadt-tourismus": {
    id: "latam-stadt-tourismus",
    title: "Megastädte, Weltmarkt-Plantagen und Ferntourismus",
    caption: "Extreme soziale Gegensätze in Metropolen, exportorientierte Landwirtschaft und Massentourismus fordern gerechte und ökologische Leitlinien.",
    parts: [
      { label: "1. Megastadt & Segregation", detail: "Starke Metropolisierung und Landflucht lassen Marginalsiedlungen (z. B. Favelas) und abgeschottete Gated Communities unmittelbar nebeneinander wachsen." },
      { label: "2. Informell & Plantage", detail: "Viele Menschen sichern ihr Einkommen im informellen Sektor ohne Absicherung; ländliche Regionen hängen stark von Exportplantagen (Bananen, Soja, Kaffee) ab." },
      { label: "3. Nachhaltiges Reisen", detail: "Massentourismus bringt Devisen, belastet aber Wasser, Küsten und Kulturräume. Faire Entlohnung, Klimaschutz und lokale Wertschöpfung geben Leitlinien." },
    ],
    draw: (active) =>
      `<svg class="figure-svg" viewBox="0 0 580 202" role="img" aria-label="Sozialräumliche Stadtstruktur, Plantagen und Ferntourismus in Lateinamerika" xmlns="http://www.w3.org/2000/svg">` +
      label(290, 20, "Städte, Weltmarkt-Integration und Tourismus in Lateinamerika", "lbl strong") +
      threeColumnCards(active, [
        {
          head: "1. Stadtfragmentierung",
          sub: "Marginalsiedlung neben\nGated Community",
          motif: '<rect class="geo-color-1" x="36" y="22" width="32" height="22" rx="2"/><rect class="tower" x="78" y="6" width="28" height="38" rx="2"/><line class="geo-ir-arrow" x1="73" y1="6" x2="73" y2="46"/>',
        },
        {
          head: "2. Sektor & Plantage",
          sub: "Informelle Arbeit &\nWeltmarkt-Monokultur",
          motif: '<rect class="geo-crop-strip" x="36" y="14" width="70" height="30" rx="4"/><path class="geo-wire" d="M36 24h70M36 34h70"/>',
        },
        {
          head: "3. Ferntourismus",
          sub: "Devisen vs. Umwelt &\neigene Reise-Leitlinien",
          motif: '<rect class="sea" x="36" y="26" width="70" height="18" rx="3"/><circle class="sun-circle" cx="56" cy="14" r="9"/><rect class="geo-sand" x="76" y="16" width="26" height="12" rx="2"/>',
        },
      ], false) +
      `</svg>`,
  },
};

export function isExplorerFigure(id: string): boolean {
  return id in EXPLORERS;
}

export function renderExplorer(id: string, activePart = 0): string {
  const spec = EXPLORERS[id];
  const active = Math.max(0, Math.min(2, activePart));
  const part = spec.parts[active];
  const buttons = spec.parts
    .map(
      (p, i) =>
        `<button type="button" class="geo-explore-btn" data-explore-set="${i}" aria-pressed="${i === active}">${esc(p.label)}</button>`,
    )
    .join("");
  return `<figure class="lesson-figure geo-explorer" data-explore-fig="${esc(id)}">` +
    `<div class="geo-explore-bar" role="group" aria-label="Bereiche des Schaubilds auswählen">${buttons}</div>` +
    spec.draw(active) +
    `<div class="geo-explore-panel" role="status"><strong>${esc(part.label)}:</strong> ${esc(part.detail)}</div>` +
    `<figcaption><strong>${esc(spec.title)}</strong> · ${esc(spec.caption)}</figcaption>` +
    `</figure>`;
}
