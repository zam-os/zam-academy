/**
 * Figures for LB 5 (Das konfessionelle Zeitalter), LB 6 (Absolutismus und
 * Barock) and LB 7 (Bauwerke als Ausdruck politischen Denkens).
 */
import {
  arrow,
  badgePill,
  cardGrid,
  chain,
  compare,
  crown,
  f1,
  label,
  labels,
  panel,
  person,
  svg,
} from "./draw";
import { C } from "./scenes-lb1-2";

/* ---------- LB 5 ---------- */

export function umbruchKrisen(): string {
  return cardGrid(
    "Umbruch und Krisen im 16. Jahrhundert: Neues und Bedrohliches zugleich",
    [
      { head: "Buchdruck", body: "Wissen und Meinungen\nverbreiten sich schnell", colour: C.blue, icon: "📖" },
      { head: "Neue Welten", body: "Entdeckungen sprengen\ndas alte Weltbild", colour: C.green, icon: "🌍" },
      { head: "Preise steigen", body: "mehr Menschen, Silber\naus Amerika", colour: C.ochre, icon: "📈" },
      { head: "Kleine Eiszeit", body: "kalte Sommer,\nMissernten, Hunger", colour: C.slate, icon: "❄️" },
      { head: "Kirchenkritik", body: "Ablass, Ämterkauf,\nprunkvolle Geistliche", colour: C.purple, icon: "⛪" },
      { head: "Angst", body: "Osmanen vor Wien (1529),\nHexenglaube, Endzeit", colour: C.red, icon: "⚠️" },
    ],
    3,
    660,
  );
}

export function hexenprozess(): string {
  return chain(
    "Ablauf eines Hexenprozesses: Gerücht, Anklage, Folter, erzwungenes Geständnis, Besagung weiterer Menschen",
    [
      { head: "Gerücht", body: "Nachbarn geben einer\nFrau die Schuld\nan Unglück", colour: C.slate, icon: "🗣️" },
      { head: "Anklage", body: "Anzeige beim\nGericht der\nObrigkeit", colour: C.ochre, icon: "📜" },
      { head: "Folter", body: "Schmerz erzwingt\nein „Geständnis“", colour: C.red, icon: "⛓️" },
      { head: "Besagung", body: "Gefolterte nennen\nweitere Namen –\neine Welle beginnt", colour: C.purple, icon: "🔁" },
    ],
    4,
    660,
  );
}

export function ablassStreit(): string {
  return compare(
    "Streit um den Ablass: Ablassprediger Tetzel und Martin Luther im Vergleich",
    {
      head: "Ablasspredigt (Tetzel, 1517)",
      colour: C.ochre,
      points: [
        "Ablassbrief gegen Geld",
        "verkürzt Strafen im Fegefeuer",
        "auch für Verstorbene erwerbbar",
        "Geld für Petersdom und Schulden",
      ],
    },
    {
      head: "Luthers Kritik (95 Thesen)",
      colour: C.purple,
      points: [
        "Heil allein durch Gottes Gnade",
        "Glaube statt gekaufter Briefe",
        "echte Reue zählt, nicht Zahlung",
        "allein die Bibel ist Maßstab",
      ],
    },
    660,
  );
}

export function medienwandel(): string {
  return chain(
    "Medienwandel von der Handschrift über Buchdruck, Flugblatt und Zeitung bis zum Internet",
    [
      { head: "Handschrift", body: "Mönche schreiben ab,\nwenige teure Bücher", colour: C.slate, icon: "✍️" },
      { head: "Buchdruck (um 1450)", body: "viele gleiche Bücher,\nbilliger, schneller", colour: C.blue, icon: "🖨️" },
      { head: "Flugblatt (ab 1517)", body: "Bild und kurzer Text,\nauf Märkten verbreitet", colour: C.red, icon: "📰" },
      { head: "Zeitung (ab 1605)", body: "regelmäßige\nNachrichten", colour: C.ochre, icon: "🗞️" },
      { head: "Radio und Fernsehen", body: "Nachrichten für\nMillionen zugleich", colour: C.green, icon: "📻" },
      { head: "Internet", body: "jeder veröffentlicht,\nin Sekunden weltweit", colour: C.purple, icon: "📱" },
    ],
    2,
    660,
  );
}

export function zwoelfArtikel(): string {
  return cardGrid(
    "Auswahl aus den Zwölf Artikeln der Bauern von Memmingen 1525",
    [
      { head: "Art. 1: Pfarrerwahl", body: "Die Gemeinde wählt\nihren Pfarrer selbst.", colour: C.purple },
      { head: "Art. 2: Zehnt", body: "nur für Pfarrer und Arme,\nder „kleine Zehnt“ fällt weg", colour: C.ochre },
      { head: "Art. 3: Leibeigenschaft", body: "abschaffen – „Christus\nhat uns alle erlöst“", colour: C.red },
      { head: "Art. 4–5: Jagd, Holz", body: "Wild, Fisch und Wald\nfür alle nutzbar", colour: C.green },
      { head: "Art. 6–8: Dienste", body: "Frondienste und Abgaben\nauf gerechtes Maß", colour: C.brown },
      { head: "Art. 12: Bibel", body: "Was der Bibel wider-\nspricht, wird gestrichen.", colour: C.blue },
    ],
    3,
    660,
  );
}

export function religionsfriede1555(): string {
  return cardGrid(
    "Bestimmungen des Augsburger Religionsfriedens von 1555",
    [
      { head: "Landesherr entscheidet", body: "katholisch oder lutherisch\nfür sein ganzes Land", colour: C.red, icon: "👑" },
      { head: "Auswandern erlaubt", body: "Andersgläubige Untertanen\ndürfen fortziehen", colour: C.ochre, icon: "🧳" },
      { head: "Reichsstädte", body: "in gemischten Städten\nbeide Konfessionen", colour: C.blue, icon: "🏙️" },
      { head: "Nicht eingeschlossen", body: "Reformierte und andere\nevangelische Richtungen", colour: C.slate, icon: "⛔" },
    ],
    2,
    660,
  );
}

export function kriegsparteien(): string {
  return compare(
    "Die Kriegsparteien des Dreißigjährigen Krieges: Kaiser und Liga gegen evangelische Fürsten, Dänemark, Schweden und Frankreich",
    {
      head: "Kaiser und Katholische Liga",
      colour: C.red,
      points: [
        "Kaiser aus dem Haus Habsburg",
        "Liga unter Maximilian von Bayern",
        "Spanien (ebenfalls Habsburger)",
        "Heerführer Tilly und Wallenstein",
      ],
    },
    {
      head: "Gegner des Kaisers",
      colour: C.blue,
      points: [
        "evangelische Reichsfürsten (Union)",
        "Dänemark ab 1625, Schweden ab 1630",
        "Frankreich ab 1635 – katholisch!",
        "Niederlande gegen Spanien",
      ],
    },
    660,
  );
}

export function kriegsfolgen(): string {
  const people = Array.from({ length: 30 }, (_, i) => {
    const x = 78 + (i % 15) * 36;
    const y = 120 + Math.floor(i / 15) * 70;
    const lost = i % 3 === 2;
    return `<g opacity="${lost ? 0.28 : 1}">${person(x, y, 0.9, lost ? "cloth-out" : "cloth-linen")}</g>`;
  }).join("");
  return svg(
    660,
    260,
    "Bevölkerungsverlust im Reich durch den Dreißigjährigen Krieg: nach Schätzungen etwa ein Drittel, regional sehr unterschiedlich",
    `${panel(8, 8, 644, 244, "panel-bg")}
     ${label(330, 32, "Nach Schätzungen fehlte nach 1648 etwa jeder dritte Mensch im Reich", "lbl small strong")}
     ${people}
     ${labels(330, 218, "Blass: Menschen, die durch Krieg, Hunger und Seuchen starben oder flohen.\nManche Regionen verloren mehr als die Hälfte, andere blieben fast verschont.", "lbl tiny", "middle", 15)}`,
  );
}

export function friedenBestimmungen(): string {
  return cardGrid(
    "Wichtige Bestimmungen des Westfälischen Friedens von 1648",
    [
      { head: "Drei Konfessionen", body: "katholisch, lutherisch\nund reformiert anerkannt", colour: C.purple, icon: "✝️" },
      { head: "Stichjahr 1624", body: "entscheidet über Kirchen-\nbesitz und Konfession", colour: C.ochre, icon: "📅" },
      { head: "Reichsstände", body: "dürfen Bündnisse schließen,\nnicht gegen den Kaiser", colour: C.red, icon: "🤝" },
      { head: "Neue Grenzen", body: "Gebiete für Frankreich\nund Schweden", colour: C.blue, icon: "🗺️" },
      { head: "Unabhängig", body: "Schweiz und Niederlande\nverlassen das Reich", colour: C.green, icon: "🏳️" },
      { head: "Bayern", body: "behält Kurwürde\nund Oberpfalz", colour: C.slate, icon: "🦁" },
    ],
    3,
    660,
  );
}

/* ---------- LB 6 ---------- */

export function absolutismusSaeulen(): string {
  const cols = [
    { t: "Stehendes", t2: "Heer", c: C.red },
    { t: "Beamte und", t2: "Intendanten", c: C.blue },
    { t: "Merkan-", t2: "tilismus", c: C.ochre },
    { t: "Hofleben", t2: "bindet Adel", c: C.purple },
    { t: "Kirche", t2: "(ein Glaube)", c: C.green },
  ];
  return svg(
    660,
    320,
    "Säulen der absolutistischen Herrschaft Ludwigs XIV.: stehendes Heer, Beamte, Merkantilismus, Hof und Kirche, darüber das Gottesgnadentum",
    `${panel(8, 8, 644, 304, "panel-bg")}
     <path d="M60 92L330 30L600 92Z" fill="${C.ochre}" stroke="var(--f-ink)" stroke-width="2"/>
     ${crown(330, 80, 1.1)}
     <rect x="60" y="92" width="540" height="28" fill="var(--surface)" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(330, 112, "König von Gottes Gnaden – „Sonnenkönig“ Ludwig XIV.", "lbl small strong")}
     ${cols
       .map((c, i) => {
         const x = 84 + i * 104;
         return `<rect x="${x}" y="120" width="76" height="140" fill="${c.c}" stroke="var(--f-ink)" stroke-width="1.5"/>
         <rect x="${x - 6}" y="120" width="88" height="10" fill="var(--f-stone)"/>
         <rect x="${x - 6}" y="252" width="88" height="10" fill="var(--f-stone)"/>
         ${labels(x + 38, 180, `${c.t}\n${c.t2}`, "lbl tiny on-dark strong", "middle", 15)}`;
       })
       .join("")}
     <rect x="40" y="262" width="580" height="22" fill="var(--f-stone)" stroke="var(--f-ink)"/>
     ${label(330, 278, "Fundament: Steuern der Bauern und Bürger", "lbl tiny strong")}
     ${label(330, 304, "Schaubild (vereinfacht): Was trägt die Macht des Königs?", "lbl tiny muted")}`,
  );
}

export function merkantilismusKreislauf(): string {
  const nodes = [
    { x: 120, y: 80, t: "Rohstoffe", s: "billig aus Kolonien\nund dem Inland", c: C.green },
    { x: 330, y: 60, t: "Manufakturen", s: "Spiegel, Teppiche,\nSeide, Porzellan", c: C.blue },
    { x: 540, y: 80, t: "Ausfuhr", s: "Fertigwaren teuer\nins Ausland", c: C.red },
    { x: 440, y: 210, t: "Schutzzölle", s: "fremde Waren\nwerden teuer", c: C.purple },
    { x: 220, y: 210, t: "Staatskasse", s: "zahlt Hof, Heer\nund Verwaltung", c: C.ochre },
  ];
  return svg(
    660,
    280,
    "Kreislauf des Merkantilismus: Rohstoffe, Manufakturen, Ausfuhr, Schutzzölle, Staatskasse",
    `${panel(8, 8, 644, 264, "panel-bg")}
     ${arrow(200, 72, 246, 66)}
     ${arrow(416, 66, 460, 72)}
     ${arrow(530, 118, 470, 176)}
     ${arrow(354, 214, 306, 214)}
     ${arrow(170, 176, 130, 118)}
     ${nodes
       .map(
         (n) => `<rect x="${n.x - 82}" y="${n.y - 30}" width="164" height="62" rx="12" fill="var(--surface)" stroke="${n.c}" stroke-width="2.4"/>
         <rect x="${n.x - 82}" y="${n.y - 30}" width="164" height="22" rx="12" fill="${n.c}"/>
         ${label(n.x, n.y - 14, n.t, "lbl tiny on-dark strong")}
         ${labels(n.x, n.y + 8, n.s, "lbl tiny", "middle", 14)}`,
       )
       .join("")}
     ${label(330, 262, "Ziel: Mehr Geld soll ins Land fließen als hinaus.", "lbl tiny strong")}`,
  );
}

export function hofzeremoniell(): string {
  return chain(
    "Das Lever, das Aufstehen Ludwigs XIV., als Beispiel des Hofzeremoniells",
    [
      { head: "Erweckung", body: "Kammerdiener weckt\nden König", colour: C.slate, icon: "🛏️" },
      { head: "Erste Gruppe", body: "Familie und Arzt\ndürfen eintreten", colour: C.blue, icon: "🚪" },
      { head: "Hemd reichen", body: "der ranghöchste\nAnwesende reicht es", colour: C.ochre, icon: "👔" },
      { head: "Großes Lever", body: "Höflinge schauen zu,\nhoffen auf Gunst", colour: C.purple, icon: "👑" },
    ],
    4,
    660,
  );
}

export function herrschaftsformenVergleich(): string {
  return cardGrid(
    "Herrschaftsformen im Vergleich: Pharao, Augustus, Otto I. und Ludwig XIV.",
    [
      { head: "Pharao (Ägypten)", body: "Legitimation: Gottkönig\nMittel: Beamte, Priester\nMitsprache: keine", colour: C.ochre },
      { head: "Augustus (Rom)", body: "Legitimation: „erster Bürger“\nMittel: Heer, Beamte, Steuern\nMitsprache: Senat formal", colour: C.red },
      { head: "Otto I. (Reich)", body: "Legitimation: Wahl, Salbung\nMittel: Vasallen, Bischöfe\nMitsprache: Fürsten", colour: C.blue },
      { head: "Ludwig XIV. (Frankreich)", body: "Legitimation: Gottes Gnade\nMittel: Heer, Intendanten\nMitsprache: keine Stände", colour: C.purple },
    ],
    2,
    660,
  );
}

export function anspruchWirklichkeit(): string {
  return compare(
    "Absolutismus zwischen Anspruch und Wirklichkeit",
    {
      head: "Anspruch",
      colour: C.purple,
      points: [
        "König nur Gott verantwortlich",
        "Gesetze gelten für ihn nicht",
        "ein König, ein Glaube, ein Gesetz",
        "Adel ohne politische Macht",
      ],
    },
    {
      head: "Wirklichkeit",
      colour: C.slate,
      points: [
        "auf Beamte und Geldgeber angewiesen",
        "an Gottes Gebote und alte Rechte gebunden",
        "Befehle setzen sich langsam durch",
        "Kriege und Hof sehr teuer",
      ],
    },
    660,
  );
}

export function schleissheimVersailles(): string {
  return compare(
    "Rezeption des französischen Vorbilds: Versailles und das Neue Schloss Schleißheim im Vergleich",
    {
      head: "Versailles (Ludwig XIV.)",
      colour: C.blue,
      points: [
        "Hof zieht 1682 ein",
        "Achse von der Stadt zum Kanal",
        "Spiegelsaal feiert Siege",
        "größter Hof Europas",
      ],
    },
    {
      head: "Schleißheim (Max Emanuel)",
      colour: C.green,
      points: [
        "Bau ab 1701, lange Pause im Krieg",
        "Mittelachse mit Kanal im Garten",
        "Festsäle feiern den Kurfürsten",
        "aus Geldmangel unvollendet",
      ],
    },
    660,
  );
}

export function ludwigsKriege(): string {
  const events = [
    { y: 1667, t: "Devolutionskrieg" },
    { y: 1672, t: "Krieg gegen die Niederlande" },
    { y: 1681, t: "Straßburg besetzt" },
    { y: 1688, t: "Pfälzischer Erbfolgekrieg" },
    { y: 1701, t: "Spanischer Erbfolgekrieg" },
    { y: 1713, t: "Frieden von Utrecht" },
  ];
  const x = (year: number) => 40 + ((year - 1660) / 60) * 580;
  return svg(
    660,
    220,
    "Zeitleiste der Kriege Ludwigs XIV. von 1667 bis zum Frieden von Utrecht 1713",
    `${panel(8, 8, 644, 204, "panel-bg")}
     ${label(330, 24, "Kriege um die Vorherrschaft (Hegemonie)", "lbl small strong")}
     <line x1="40" y1="110" x2="620" y2="110" stroke="var(--f-line)" stroke-width="3"/>
     ${[1660, 1680, 1700, 1720].map((y) => `<line x1="${f1(x(y))}" y1="104" x2="${f1(x(y))}" y2="116" stroke="var(--f-line)"/>${label(x(y), 132, String(y), "lbl tiny muted")}`).join("")}
     ${events
       .map((e, i) => {
         const up = i % 2 === 0;
         const ex = x(e.y);
         return `<circle cx="${f1(ex)}" cy="110" r="8" fill="${e.y === 1713 ? C.green : C.red}" stroke="var(--f-halo)" stroke-width="2"/>
           <line x1="${f1(ex)}" y1="${up ? 100 : 120}" x2="${f1(ex)}" y2="${up ? 76 : 150}" stroke="var(--f-line)"/>
           ${label(ex, up ? 70 : 166, String(e.y), "lbl tiny strong")}
           ${labels(ex, up ? (/ gegen| Erbfolge/.test(e.t) ? 40 : 52) : 182, e.t.replace(" gegen", "\ngegen").replace(" Erbfolge", "\nErbfolge"), "lbl tiny", "middle", 13)}`;
       })
       .join("")}`,
  );
}

/* ---------- LB 7 ---------- */

export function theaterGrundriss(): string {
  const rows = Array.from({ length: 7 }, (_, i) => {
    const r = 70 + i * 16;
    return `<path d="M${330 - r} 230A${r} ${r} 0 0 1 ${330 + r} 230" fill="none" stroke="var(--f-stone)" stroke-width="10"/>`;
  }).join("");
  const wedges = Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI + (i * Math.PI) / 8;
    return `<line x1="${f1(330 + 66 * Math.cos(a))}" y1="${f1(230 + 66 * Math.sin(a))}" x2="${f1(330 + 174 * Math.cos(a))}" y2="${f1(230 + 174 * Math.sin(a))}" stroke="var(--f-line)" stroke-width="1.5"/>`;
  }).join("");
  return svg(
    660,
    300,
    "Grundriss des Dionysostheaters in Athen mit Zuschauerraum (Theatron), Orchestra und Bühnengebäude (Skene)",
    `${panel(8, 8, 644, 284, "panel-bg")}
     ${rows}${wedges}
     <circle cx="330" cy="230" r="52" fill="var(--f-sand)" stroke="var(--f-line)" stroke-width="2"/>
     ${label(330, 234, "Orchestra", "lbl tiny strong")}
     <rect x="230" y="262" width="200" height="22" fill="${C.brown}"/>
     ${label(330, 278, "Skene (Bühnengebäude)", "lbl tiny on-dark strong")}
     ${labels(330, 46, "Theatron: Tausende Bürger,\nnach Stadtbezirken (Keilen) geordnet", "lbl tiny strong", "middle", 14)}
     ${labels(40, 60, "Kein Herrschersitz\nin der Mitte –\nalle sehen und hören", "lbl tiny", "start", 14)}
     ${labels(520, 60, "Am Hang der\nAkropolis gebaut", "lbl tiny", "start", 14)}`,
  );
}

export function aachenPfalz(): string {
  return svg(
    660,
    320,
    "Plan der Aachener Pfalz mit Königshalle im Norden, Verbindungsgang und achteckiger Pfalzkapelle im Süden sowie Schnitt mit dem Thron auf der Empore",
    `${panel(8, 8, 644, 304, "panel-bg")}
     ${badgePill(150, 28, 220, "Plan der Pfalz (vereinfacht)", C.slate)}
     <rect x="70" y="50" width="160" height="40" fill="${C.red}"/>
     ${label(150, 75, "Königshalle", "lbl tiny on-dark strong")}
     <rect x="140" y="90" width="20" height="120" fill="var(--f-stone)"/>
     ${labels(170, 150, "Verbindungs-\ngang", "lbl tiny", "start", 13)}
     <polygon points="${Array.from({ length: 8 }, (_, i) => {
       const a = (i * Math.PI) / 4 + Math.PI / 8;
       return `${f1(150 + 46 * Math.cos(a))},${f1(256 + 46 * Math.sin(a))}`;
     }).join(" ")}" fill="${C.purple}"/>
     ${labels(150, 252, "Pfalz-\nkapelle", "lbl tiny on-dark strong", "middle", 13)}
     ${label(150, 300, "heute: Rathaus (Norden) und Dom (Süden)", "lbl tiny muted")}
     ${badgePill(470, 28, 260, "Schnitt durch die Kapelle", C.purple)}
     <path d="M330 280V140L380 100H560L610 140V280Z" fill="var(--surface)" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M380 100Q470 40 560 100" fill="var(--f-sky)" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(470, 60, "Kuppel = Himmel", "lbl tiny strong")}
     <line x1="330" y1="190" x2="610" y2="190" stroke="var(--f-ink)" stroke-width="3"/>
     <rect x="560" y="166" width="26" height="24" fill="${C.ochre}" stroke="var(--f-ink)"/>
     ${labels(548, 158, "Thron auf\nder Empore", "lbl tiny strong", "end", 13)}
     <rect x="344" y="248" width="20" height="32" fill="${C.ochre}"/>
     ${label(354, 242, "Altar", "lbl tiny", "middle")}
     ${person(430, 278, 0.8, "cloth-linen")}${person(460, 278, 0.8, "cloth-linen")}${person(490, 278, 0.8, "cloth-linen")}
     ${label(470, 300, "Volk unten · Herrscher oben · Gott darüber", "lbl tiny strong")}`,
  );
}

export function treppenhausWuerzburg(): string {
  const steps = Array.from({ length: 10 }, (_, i) => `<rect x="${120 + i * 26}" y="${270 - i * 12}" width="${400 - i * 26}" height="12" fill="var(--f-stone)" stroke="var(--f-line)" stroke-width="0.8"/>`).join("");
  return svg(
    660,
    300,
    "Treppenhaus der Würzburger Residenz: Gäste steigen hinauf, darüber Tiepolos Deckengemälde mit den vier Erdteilen und dem Bildnis des Fürstbischofs",
    `${panel(8, 8, 644, 284, "panel-bg")}
     <path d="M40 150Q330 10 620 150Z" fill="var(--f-sky)" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(110, 140, "Amerika", "lbl tiny strong")}
     ${label(550, 140, "Asien", "lbl tiny strong")}
     ${label(200, 92, "Afrika", "lbl tiny strong")}
     ${label(460, 92, "Europa", "lbl tiny strong")}
     <circle cx="330" cy="86" r="22" fill="#f2cf3d" stroke="var(--f-ink)" stroke-width="2"/>
     ${labels(330, 82, "Fürst-\nbischof", "lbl tiny strong", "middle", 11)}
     <rect x="40" y="150" width="580" height="8" fill="var(--f-ink)"/>
     ${steps}
     ${person(150, 266, 0.9, "cloth-a")}${person(240, 230, 0.9, "cloth-b")}
     ${arrow(170, 250, 330, 172)}
     ${labels(470, 196, "Beim Hinaufsteigen\nöffnet sich der Blick\nauf das Gewölbe", "lbl tiny strong", "start", 14)}
     ${label(330, 290, "Tiepolo 1752/53: Die vier Erdteile huldigen dem Landesherrn", "lbl tiny muted")}`,
  );
}

export function reichstagKuppel(): string {
  return svg(
    660,
    320,
    "Schnitt durch das Reichstagsgebäude: Besucher gehen auf Rampen in der Glaskuppel über dem Plenarsaal, ein Spiegelkegel lenkt Licht nach unten",
    `${panel(8, 8, 644, 304, "panel-bg")}
     <rect x="80" y="170" width="500" height="120" fill="var(--surface)" stroke="var(--f-ink)" stroke-width="2"/>
     ${label(330, 282, "„Dem deutschen Volke“", "lbl tiny strong")}
     <path d="M210 170Q330 20 450 170" fill="var(--f-sky)" opacity="0.6" stroke="var(--f-ink)" stroke-width="2"/>
     <path d="M232 150Q330 120 428 150M250 124Q330 96 410 124M270 98Q330 74 390 98" fill="none" stroke="${C.blue}" stroke-width="3"/>
     <path d="M310 170L330 70L350 170Z" fill="#c9d6df" stroke="var(--f-line)"/>
     ${person(260, 148, 0.6, "cloth-today")}${person(400, 122, 0.6, "cloth-b")}${person(300, 96, 0.6, "cloth-c")}
     <rect x="160" y="210" width="340" height="50" rx="20" fill="${C.slate}"/>
     ${label(330, 240, "Plenarsaal: gewählte Abgeordnete", "lbl tiny on-dark strong")}
     ${arrow(520, 110, 470, 140)}
     ${labels(526, 92, "Besucher auf\nden Rampen", "lbl tiny strong", "start", 13)}
     ${arrow(150, 90, 314, 110)}
     ${labels(30, 70, "Spiegelkegel lenkt\nTageslicht hinunter", "lbl tiny strong", "start", 13)}
     ${label(330, 306, "Das Volk steht symbolisch über seinen Vertretern – Glas steht für Transparenz.", "lbl tiny muted")}`,
  );
}
