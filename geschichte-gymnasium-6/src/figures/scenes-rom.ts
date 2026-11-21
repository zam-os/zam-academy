/**
 * Figures for LB 5 (Das Imperium Romanum).
 */
import {
  arrow,
  cardGrid,
  chain,
  compare,
  f1,
  label,
  labels,
  panel,
  svg,
} from "./draw";

export function romMythosVsForschung(): string {
  return compare(
    "Gründung Roms: Mythos und Erzählung vs. archäologische Forschung",
    {
      head: "Gründungsmythos (Livius / Sage)",
      colour: "#9e2a2b",
      points: [
        "753 v. Chr.: Romulus und Remus gründen Rom",
        "Zwillinge von einer Wölfin gesäugt (Mars-Söhne)",
        "Streit um die Mauer; Romulus wird erster König",
        "Absicht: Roms besondere Berufung und Macht erklären",
        "Schriftlich erst Jahrhunderte später aufgeschrieben",
      ],
    },
    {
      head: "Archäologische Befunde (Überreste)",
      colour: "#37536e",
      points: [
        "Mehrere Hirtendörfer auf den Hügeln ab 10.–8. Jh. v. Chr.",
        "Günstige Lage an einer Furt durch den Fluss Tiber",
        "Handelskreuzung: Salzstraße und Weg zum Mittelmeer",
        "Zusammenschluss zur Stadt unter etruskischem Einfluss",
        "Zeigt den Unterschied: Erzählung vs. überprüfbare Spuren",
      ],
    },
    620,
  );
}

export function cursusHonorum(): string {
  const steps = [
    {
      title: "4. Konsul (2 Amtsinhaber)",
      desc: "höchstes Amt: leiten Staat & Heer, Veto gegeneinander",
      colour: "#9e2a2b",
      w: 230,
    },
    {
      title: "3. Prätor (Rechtsprechung)",
      desc: "oberste Richter in Rom und Stellvertreter der Konsuln",
      colour: "#73357a",
      w: 270,
    },
    {
      title: "2. Ädil (Stadt & Versorgung)",
      desc: "Märkte, Straßen, Getreide und Spiele in Rom",
      colour: "#1b5e8a",
      w: 310,
    },
    {
      title: "1. Quästor (Staatskasse)",
      desc: "Einstiegsamt: Finanzen und Kassenverwaltung",
      colour: "#1e6b4f",
      w: 350,
    },
  ];
  return svg(
    640,
    270,
    "Die römische Ämterlaufbahn (Cursus honorum) vom Quästor bis zum Konsul sowie die Kontrollprinzipien Annuität und Kollegialität",
    `${panel(8, 8, 624, 254, "panel-bg")}
     ${label(202, 34, "Römische Ämterlaufbahn (Cursus honorum)", "lbl small strong")}
     ${steps
       .map((step, i) => {
         const y = 52 + i * 48;
         const x = 202 - step.w / 2;
         return `<rect x="${f1(x)}" y="${y}" width="${step.w}" height="38" rx="8" fill="${step.colour}"/>
           ${label(202, y + 17, step.title, "lbl tiny on-dark strong")}
           ${label(202, y + 32, step.desc, "lbl tiny on-dark")}`;
       })
       .join("")}
     ${arrow(202, 240, 202, 46, "arrow")}
     ${panel(402, 28, 214, 216, "panel-bg")}
     ${label(416, 54, "Schutz vor Alleinherrschaft", "lbl small strong", "start")}
     ${labels(416, 84, "• Annuität:\n  Jedes Amt dauert nur 1 Jahr.\n• Kollegialität:\n  Mindestens zwei Kollegen\n  kontrollieren sich per Veto.\n• Volkstribune (seit Ständekampf):\n  schützen Plebejer mit Veto.\n• Senat:\n  ca. 300 erfahrene Ex-Beamte\n  beraten dauerhaft.", "lbl tiny", "start", 16)}`,
  );
}

export function expansionFolgen(): string {
  return chain(
    "Wie die Eroberungen rund um das Mittelmeer die Römische Republik veränderten",
    [
      {
        head: "Riesiges Weltreich",
        body: "Siege über Karthago (ab 264)\nund im Osten bringen reiche\nProvinzen bis 146 v. Chr.",
        colour: "#9e2a2b",
      },
      {
        head: "Bauern verarmen",
        body: "Lange Kriegszüge ruinieren\nkleine Höfe; Großgüter\nsetzen viele Sklaven ein",
        colour: "#a16c0e",
      },
      {
        head: "Heeresklientel",
        body: "Soldaten erwarten Land &\nBeute von ihrem Feldherrn\nstatt vom fernen Senat",
        colour: "#73357a",
      },
      {
        head: "Bürgerkriege",
        body: "Mächtige Generäle (Caesar,\nPompeius) kämpfen um die\nMacht im Staat",
        colour: "#37536e",
      },
    ],
    4,
    640,
  );
}

export function republikZumPrinzipat(): string {
  return compare(
    "Umbruch im 1. Jh. v. Chr.: Von der Republik zum Prinzipat unter Augustus",
    {
      head: "Römische Republik (bis 27 v. Chr.)",
      colour: "#1b5e8a",
      points: [
        "Macht aufgeteilt auf zwei Konsuln, Senat und Volk",
        "Ämter auf 1 Jahr begrenzt (Annuität)",
        "44 v. Chr.: Caesar wird Diktator auf Lebenszeit",
        "Folge: Ermordung Caesars an den Iden des März",
        "Danach: neuer Bürgerkrieg bis 31 v. Chr.",
      ],
    },
    {
      head: "Prinzipat des Augustus (um Christi Geburt)",
      colour: "#9e2a2b",
      points: [
        "Senat und Ämter bleiben dem Namen nach erhalten",
        "Faktisch bündelt Augustus als „Erster“ die Macht",
        "Lebenslanger Oberbefehl über Heer und Provinzen",
        "Volkstribun-Gewalt und höchstes Priesteramt vereint",
        "Beginn einer langen Friedenszeit (Pax Romana)",
      ],
    },
    620,
  );
}

export function romanisierungAlltag(): string {
  return cardGrid(
    "Romanisierung in Bayern: Wie Rom das Leben in den Provinzen Raetien und Noricum prägte",
    [
      {
        head: "Grenze: Der Limes & die Donau",
        body: "Der Obergermanisch-Raetische Limes\n(ca. 550 km) kontrollierte Handel, Zoll\nund Bewegungen mit Türmen & Kastellen.",
        colour: "#9e2a2b",
        icon: "🏰",
      },
      {
        head: "Straßen & Städte in Bayern",
        body: "Befestigte Fernstraßen (Via Claudia\nAugusta), Augsburg (Augusta Vindelicum)\nund Legionslager Regensburg (Castra Regina).",
        colour: "#a16c0e",
        icon: "🛣️",
      },
      {
        head: "Bäder, Heizung & Gutshöfe",
        body: "Steinhäuser, Fußbodenheizung (Hypo-\nkausten), Thermen, Wasserleitungen und\nrömische Gutshöfe (Villae rusticae).",
        colour: "#1b5e8a",
        icon: "🏛️",
      },
      {
        head: "Sprache & Kultur bis heute",
        body: "Latein als Schrift- und Rechtssprache;\nLehnwörter im Deutschen wie Fenster,\nMauer, Straße, Keller, Ziegel und Wein.",
        colour: "#1e6b4f",
        icon: "📜",
      },
    ],
    2,
    620,
  );
}

export function diasporaWandel(): string {
  return chain(
    "Judentum im Römischen Reich: Zerstörung des Tempels und Diaspora",
    [
      {
        head: "Sonderstellung zuerst",
        body: "Juden in Judäa dürfen ihren\neinigen Gott verehren und\nbleiben vom Kaiserkult frei",
        colour: "#1b5e8a",
      },
      {
        head: "Aufstand & Jahr 70 n. Chr.",
        body: "Unmut über hohe Steuern;\nRom erobert Jerusalem und\nzerstört den Tempel (70 n. Chr.)",
        colour: "#9e2a2b",
      },
      {
        head: "Leben in der Diaspora",
        body: "Viele Jüdinnen und Juden\nleben verstreut in Städten\nrund ums Mittelmeer",
        colour: "#73357a",
      },
      {
        head: "Synagoge & Tora",
        body: "Ohne Tempel wird das Gebet\nin der Synagoge und das\nStudium der Tora zum Halt",
        colour: "#1e6b4f",
      },
    ],
    4,
    640,
  );
}

export function christentumZeitleiste(): string {
  const milestones = [
    { x: 76, date: "um 30 n. Chr.", text: "Wirken Jesu\nin Judäa;\nKreuzigung", colour: "#a16c0e" },
    { x: 204, date: "1.–3. Jh.", text: "Ausbreitung &\nzeitweise\nVerfolgung", colour: "#9e2a2b" },
    { x: 332, date: "313 n. Chr.", text: "Mailänder\nVereinbarung:\nDuldung", colour: "#1b5e8a" },
    { x: 460, date: "380/391", text: "Theodosius:\nChristentum wird\nStaatsreligion", colour: "#1e6b4f" },
    { x: 568, date: "bis heute", text: "Prägende\nKirchen Europas", colour: "#73357a" },
  ];
  return svg(
    640,
    220,
    "Entwicklung des Christentums im Römischen Reich von einer verfolgten Minderheit über die Duldung 313 n. Chr. zur Staatsreligion um 380/391 n. Chr.",
    `${panel(8, 8, 624, 204, "panel-bg")}
     ${label(320, 34, "Vom verfolgten Glauben zur Staatsreligion im Römischen Reich", "lbl small strong")}
     <line class="axis" x1="36" y1="88" x2="604" y2="88"/>
     ${arrow(584, 88, 612, 88)}
     ${milestones
       .map(
         (m) => `<circle cx="${m.x}" cy="88" r="10" fill="${m.colour}" stroke="var(--f-halo)" stroke-width="2.5"/>
           ${label(m.x, 66, m.date, "lbl tiny strong")}
           ${labels(m.x, 118, m.text, "lbl tiny", "middle", 15)}`,
       )
       .join("")}`,
  );
}
