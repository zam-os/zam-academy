/** Interactive explorer diagrams for Lernbereich 1 (Lebensraum Erde). */
import { arrow, label, labels, panel, part, person, svg } from "./draw";

export function nordamerikaKlima(): string {
  const body = `
  ${panel(16, 16, 360, 275, "panel-bg")}
  ${label(196, 42, "Nordamerika: Nord-Süd-Gebirge", "lbl strong")}
  ${part(
    "rockies",
    "Rocky Mountains & Appalachen",
    "Die Gebirge verlaufen von Nord nach Süd. Sie blockieren Luftmassen aus Nord oder Süd nicht.",
    `<path class="mountain" d="M55 215L90 120L125 215Z"/><path class="mountain" d="M275 215L305 145L335 215Z"/>${label(90, 232, "Rocky Mountains", "lbl tiny")}${label(305, 232, "Appalachen", "lbl tiny")}`,
  )}
  ${part(
    "arctic-air",
    "Kalte Polarluft von Norden",
    "Aus der Arktis strömt eiskalte Luft ungehindert bis weit in die Great Plains nach Süden (Blizzards).",
    `${arrow(196, 65, 196, 128, "arrow")}${labels(196, 86, "kalte Polarluft\n(Norden)", "lbl tiny strong")}`,
  )}
  ${part(
    "gulf-air",
    "Warme feuchte Golf-Luft & Tornados",
    "Vom Golf von Mexiko strömt feuchtwarme Luft nach Norden. Beim Aufeinandertreffen entstehen Gewitter und Tornados.",
    `${arrow(196, 222, 196, 152, "arrow power")}${labels(196, 245, "feuchtwarme Luft\n(Golf von Mexiko)", "lbl tiny strong")}<circle cx="196" cy="140" r="14" fill="#f09a2e" opacity="0.55"/>${label(224, 144, "Tornado-Zone", "lbl tiny", "start")}`,
  )}
  ${panel(404, 16, 380, 275, "panel-bg")}
  ${label(594, 42, "Europa: West-Ost-Gebirge (Alpen)", "lbl strong")}
  ${part(
    "alpen-barrier",
    "Alpen als West-Ost-Riegel",
    "In Europa verlaufen die Alpen von West nach Ost. Sie bremsen kalte Nordluft und trennen Mitteleuropa vom milden Mittelmeer.",
    `<path class="mountain" d="M475 200L545 125L615 200L660 140L720 200Z"/>${label(594, 220, "Alpen (West → Ost)", "lbl small strong")}${arrow(594, 65, 594, 118, "arrow")}${label(594, 88, "Polare Luft gebremst", "lbl tiny")}${label(594, 255, "Süden: mildes Mittelmeerklima", "lbl tiny")}`,
  )}`;
  return svg(
    800,
    305,
    "Vergleich der Gebirgsrichtung und Luftmassen: Nordamerika mit Nord-Süd-Gebirgen und Tornado-Zone, Europa mit den Alpen als West-Ost-Barriere",
    body,
  );
}

export function usaVergleich(): string {
  // Schematic structural comparison (no unverified live year statistics, clearly labelled)
  const cards: Array<[string, string, string, string]> = [
    [
      "wirtschaft",
      "Wirtschaft & Innovation",
      "USA: größter Binnenmarkt westlicher Prägung, starke Tech-/Dienstleistungszentren; Deutschland: starker Export & Mittelstand.",
      "Wirtschaft\n& Arbeit",
    ],
    [
      "soziales",
      "Soziale Sicherung & Ungleichheit",
      "Deutschland: breite gesetzliche Pflichtversicherungen; USA: stärker auf private Vorsorge und betriebliche Leistungen gestützt, größere Einkommensunterschiede.",
      "Sozialstaat\n& Bildung",
    ],
    [
      "ressourcen",
      "Ressourcen & Energieverbrauch",
      "Große Entfernungen, Klimaunterschiede und Lebensstil führen in den USA historisch zu einem sehr hohen Pro-Kopf-Energieverbrauch im Vergleich zu vielen europäischen Ländern.",
      "Fläche &\nVerbrauch",
    ],
  ];
  const body = cards
    .map(([id, title, info, short], i) => {
      const x = 20 + i * 260;
      return part(
        id,
        title,
        info,
        `${panel(x, 20, 240, 215, "panel-bg")}<rect x="${x + 20}" y="40" width="200" height="44" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>${labels(x + 120, 59, short, "lbl small strong")}${
          i === 0
            ? `<rect x="${x + 36}" y="110" width="70" height="72" rx="6" fill="#2f7fd0"/><rect x="${x + 134}" y="128" width="70" height="54" rx="6" fill="#1f7a3a"/>${label(x + 71, 204, "USA (Tech)", "lbl tiny")}${label(x + 169, 204, "DE (Export)", "lbl tiny")}`
            : i === 1
              ? `<rect class="box-blue" x="${x + 36}" y="108" width="168" height="24" rx="5"/><rect class="box-green" x="${x + 36}" y="144" width="168" height="24" rx="5"/>${label(x + 120, 124, "USA: stärker privat", "lbl tiny")}${label(x + 120, 160, "DE: gesetzlich abgesichert", "lbl tiny")}`
              : `<rect x="${x + 36}" y="115" width="168" height="20" rx="5" fill="#f09a2e"/><rect x="${x + 36}" y="150" width="84" height="20" rx="5" fill="#4e9d3c"/>${label(x + 120, 110, "Verbrauch je Person (Schema)", "lbl tiny")}${label(x + 120, 194, "USA höher · DE niedriger", "lbl tiny")}`
        }`,
      );
    })
    .join("");
  return svg(
    800,
    255,
    "Dreiteiliges Schaubild zum Vergleich der USA mit Deutschland in Wirtschaft, sozialer Sicherung und Energieverbrauch (schematisch)",
    body,
  );
}

export function alltagStadtLand(): string {
  const body = `
  ${part(
    "grossstadt",
    "Alltag in der Großstadt",
    "Kurze Wege zu weiterführenden Schulen, Kinos, Vereinen und ÖPNV (U-Bahn/Bus) — dafür höhere Mieten, dichterer Verkehr und weniger Platz im Freien.",
    `${panel(18, 18, 370, 250, "panel-bg")}${label(203, 46, "Großstadt (z. B. München / Chicago)", "lbl strong")}<rect x="52" y="76" width="54" height="110" class="tower"/><rect x="114" y="62" width="60" height="124" class="tower"/><rect x="182" y="92" width="52" height="94" class="tower"/><rect x="244" y="132" width="110" height="24" rx="6" fill="#2f7fd0"/>${label(299, 148, "U-Bahn / Bus", "lbl tiny on-bar")}${labels(203, 212, "Vorteil: viele Freizeit- & Jobangebote\nNachteil: Lärm, hohe Mieten, Enge", "lbl tiny")}`,
  )}
  ${part(
    "land",
    "Alltag auf dem Land",
    "Viel Natur, ruhigere Nachbarschaft und oft mehr Wohnraum — dafür lange Bus- oder Autofahrten zu Schule, Ausbildung und Freizeit.",
    `${panel(412, 18, 370, 250, "panel-bg")}${label(597, 46, "Ländlicher Raum (z. B. Oberbayern / Plains)", "lbl strong")}<path class="hill green" d="M432 186Q510 135 595 168T762 186Z"/><rect x="515" y="138" width="68" height="48" class="house"/><path class="roof" d="M508 138L549 108L590 138Z"/>${person(635, 186, 1.0, "cloth-d", "out")}${labels(597, 212, "Vorteil: Platz, Natur, Gemeinschaft\nNachteil: weite Wege, seltener Bus", "lbl tiny")}`,
  )}`;
  return svg(
    800,
    285,
    "Gegenüberstellung von Jugendalltag in der Großstadt und auf dem Land mit Vor- und Nachteilen",
    body,
  );
}

export function energietraegerBild(): string {
  const body = `
  ${part(
    "fossil",
    "Fossile Primärenergieträger",
    "Kohle, Erdöl und Erdgas liefern jederzeit planbare Energie, stoßen aber viel CO₂ aus und sind endlich (Kohlekraftwerk nutzt nur ca. 35–45 % der Wärme als Strom).",
    `${panel(18, 18, 370, 240, "panel-bg")}${label(203, 46, "Fossile Energieträger", "lbl strong")}<rect x="56" y="96" width="106" height="68" rx="6" fill="#7d7a73"/><rect x="124" y="66" width="18" height="32" fill="#5c6670"/><path class="smoke" d="M133 62q8-9 18-10t16-6"/>${labels(275, 96, "Kohle, Öl, Erdgas\n• speicherbar\n• hoher CO₂-Ausstoß\n• Vorräte begrenzt", "lbl tiny", "middle")}${label(203, 218, "Wirkungsgrad Kraftwerk: ~35–45 % (Schema)", "lbl tiny")}`,
  )}
  ${part(
    "erneuerbar",
    "Erneuerbare Energieträger",
    "Wind, Sonne, Wasser und Biomasse erzeugen nahezu CO₂-freien Strom und erneuern sich ständig — Wind und Sonne schwanken jedoch nach Wetter und Tageszeit.",
    `${panel(412, 18, 370, 240, "panel-bg")}${label(597, 46, "Erneuerbare Energieträger", "lbl strong")}<circle cx="485" cy="94" r="22" class="sun"/><line x1="540" y1="154" x2="540" y2="82" class="mast"/><path d="M540 82L518 62M540 82L566 82M540 82L534 108" stroke="var(--f-ink)" stroke-width="4" stroke-linecap="round"/>${labels(675, 96, "Wind, Solar, Wasser\n• klimaschonend\n• unerschöpflich\n• braucht Speicher", "lbl tiny", "middle")}${label(597, 218, "Direkte Stromerzeugung ohne Verbrennung", "lbl tiny")}`,
  )}`;
  return svg(
    800,
    275,
    "Vergleich von fossilen und erneuerbaren Energieträgern bei Verfügbarkeit, CO₂-Ausstoß und Speicherbedarf",
    body,
  );
}

export function energieVerbund(): string {
  const body = `
  ${panel(18, 18, 764, 240, "panel-bg")}
  ${label(400, 44, "Staatenübergreifendes Stromnetz (Beispiel Europa)", "lbl strong")}
  ${part(
    "nordsee",
    "Nordsee-Windkraft (Norden)",
    "Offshore-Windparks in Norddeutschland, Dänemark und den Niederlanden produzieren bei starkem Wind große Strommengen.",
    `<rect x="44" y="82" width="190" height="122" rx="12" fill="var(--f-sea)" stroke="var(--f-river)" stroke-width="2"/>${labels(139, 128, "Nordsee / Küste\nViel Windstrom\n(Norden)", "lbl small strong")}`,
  )}
  ${arrow(242, 143, 305, 143, "arrow power")}
  ${part(
    "verbundnetz",
    "Europäisches Verbundnetz",
    "Grenzüberschreitende Leitungen gleichen Überschüsse und Engpässe zwischen Ländern in Echtzeit aus.",
    `<rect x="312" y="82" width="176" height="122" rx="12" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>${labels(400, 128, "Verbundnetz\nLeitungen über\nLändergrenzen", "lbl small strong")}`,
  )}
  ${arrow(495, 143, 558, 143, "arrow")}
  ${part(
    "alpen-speicher",
    "Alpen-Pumpspeicher (Österreich/Schweiz/Bayern)",
    "Bei Windüberschuss wird Wasser in hochgelegene Stauseen gepumpt; bei Flaute fließt es wieder durch Turbinen bergab.",
    `<rect x="566" y="82" width="190" height="122" rx="12" fill="var(--f-grass)" opacity="0.85" stroke="var(--f-forest)" stroke-width="2"/>${labels(661, 128, "Alpenraum\nPumpspeicher &\nWasserkraft", "lbl small strong")}`,
  )}`;
  return svg(
    800,
    275,
    "Schema einer staatenübergreifenden Energieversorgung zwischen Windstrom im Norden, europäischem Verbundnetz und Pumpspeichern in den Alpen",
    body,
  );
}

export function energieAlltag(): string {
  // Proportional bar of typical German private household final energy uses (schematic rounding: ~70 % Raumwärme, ~14 % Warmwasser, ~16 % Strom/Geräte)
  const body = `
  ${panel(18, 18, 764, 225, "panel-bg")}
  ${label(400, 46, "Wofür ein Haushalt Energie braucht (typisches Verhältnis, gerundet)", "lbl strong")}
  ${part(
    "heizen",
    "Raumwärme (~70 %)",
    "Der weitaus größte Teil entfällt aufs Heizen: 1 °C weniger Raumtemperatur und kurzes Stoßlüften sparen am meisten Energie.",
    `<rect x="50" y="76" width="490" height="44" fill="#d4483b"/>${label(295, 103, "Raumwärme ~70 %", "lbl strong on-bar")}`,
  )}
  ${part(
    "warmwasser",
    "Warmwasser (~14 %)",
    "Kürzer duschen und Sparduschköpfe senken Energie- und Wasserverbrauch direkt.",
    `<rect x="540" y="76" width="98" height="44" fill="#f09a2e"/>${label(589, 103, "14 %", "lbl small on-bar")}`,
  )}
  ${part(
    "geraete",
    "Strom & Geräte (~16 %)",
    "LED-Lampen, echte Ausschalter statt Standby und Deckel beim Kochen sparen teuren Strom.",
    `<rect x="638" y="76" width="112" height="44" fill="#2f7fd0"/>${label(694, 103, "16 %", "lbl small on-bar")}`,
  )}
  ${labels(400, 162, "Klicke auf einen Balkenabschnitt, um passende Sparhebel zu sehen.\n(Richtwerte für Haushalte; genaue Anteile hängen von Gebäude und Personenanzahl ab.)", "lbl tiny")}`;
  return svg(
    800,
    260,
    "Maßstäbliches Balkendiagramm typischer Energieanteile im Haushalt: rund 70 Prozent Raumwärme, 14 Prozent Warmwasser, 16 Prozent Strom und Geräte",
    body,
  );
}
