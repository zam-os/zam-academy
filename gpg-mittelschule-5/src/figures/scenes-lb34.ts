/** Drawn figures for Lernbereich 3 (Politik und Gesellschaft) and 4 (Lebenswelt). */
import { arrow, f1, label, labels, panel, person, svg } from "./draw";

export function egyptWork(): string {
  const parts: Array<[string, string, string]> = [
    ["Bauer", "bestellt die Felder,\ngibt einen Teil der Ernte ab,\narbeitet in der Flutzeit\noft auf Baustellen", "cloth-linen"],
    ["Handwerker", "Steinmetze, Töpfer, Maler:\nbauen Tempel und Gräber\nund stellen Waren her", "cloth-craft"],
    ["Schreiber", "kann lesen und schreiben,\nzählt Ernten und Abgaben\nfür den Pharao", "cloth-scribe"],
  ];
  const tools = [
    (x: number) => `<path class="hoe" d="M${x + 10} 190l20-40M${x + 30} 150l10 4"/><path class="grain" d="M${x - 50} 200v-30M${x - 42} 200v-34M${x - 34} 200v-28"/>`,
    (x: number) => `<rect class="stone-block" x="${x + 14}" y="172" width="34" height="28"/><path class="chisel" d="M${x + 8} 166l12 10"/>`,
    (x: number) => `<rect class="papyrus" x="${x + 12}" y="160" width="36" height="26" rx="3"/><path class="glyph" d="M${x + 18} 170h10M${x + 18} 178h22"/>`,
  ];
  const body = parts
    .map(([title, text, cls], i) => {
      const x = 135 + i * 265;
      return `${panel(x - 125, 10, 250, 330, "scene-bg")}<path class="ground-sand" d="M${x - 125} 200h250v12h-250z"/>${person(x - 10, 200, 1.6, cls, i === 0 ? "out" : "down")}${tools[i](x)}${label(x, 42, title, "lbl strong")}${labels(x, 240, text, "lbl small")}`;
    })
    .join("");
  return svg(
    800,
    350,
    "Drei Menschen im alten Ägypten bei der Arbeit: ein Bauer mit Hacke, ein Handwerker mit Meißel und Steinblock, ein Schreiber mit Papyrus",
    body,
  );
}

export function societyPyramid(): string {
  // Five layers from the Pharao down to the farmers. The farmers' layer is
  // the widest and tallest: they were by far the largest group. Slaves and
  // unfree people were a small group and sit in a narrow box below.
  const layers: Array<[string, string, number]> = [
    ["Pharao", "layer-1", 46],
    ["Wesir, Beamte, Priester", "layer-2", 46],
    ["Schreiber", "layer-3", 46],
    ["Handwerker, Händler, Soldaten", "layer-4", 46],
    ["Bauern: die größte Gruppe", "layer-5", 70],
  ];
  const top = 20,
    cx = 360,
    slope = 1.15;
  let y0 = top;
  const body = layers
    .map(([name, cls, h], i) => {
      const y1 = y0 + h;
      const half0 = (y0 - top) * slope,
        half1 = (y1 - top) * slope;
      const shape = `<path class="${cls}" d="M${f1(cx - half0)} ${y0}L${f1(cx + half0)} ${y0}L${f1(cx + half1)} ${y1}L${f1(cx - half1)} ${y1}Z"/>${label(cx, y0 + (h > 46 ? 44 : 32), name, i === 0 ? "lbl tiny on-layer" : "lbl small on-layer")}`;
      y0 = y1;
      return shape;
    })
    .join("");
  const yEnd = y0;
  const slaves = `<rect class="layer-6" x="285" y="${yEnd + 10}" width="150" height="28" rx="4"/>${label(cx, yEnd + 29, "Sklaven und Unfreie", "lbl tiny on-layer")}${label(446, yEnd + 29, "kleine Gruppe, oft Kriegsgefangene, kaum Rechte", "lbl tiny", "start")}`;
  return svg(
    800,
    350,
    "Gesellschaftspyramide des alten Ägypten von oben nach unten: Pharao; Wesir, hohe Beamte und Priester; Schreiber; Handwerker, Händler und Soldaten; Bauern als größte Gruppe. Darunter in einem schmalen Kasten Sklaven und Unfreie, eine kleine Gruppe mit kaum Rechten. Nach oben nehmen Macht und Ansehen zu.",
    `${body}${slaves}${arrow(710, yEnd, 710, top + 10, "arrow power")}${labels(722, 120, "Macht und\nAnsehen\nnehmen zu", "lbl small", "start")}${arrow(24, top + 10, 24, yEnd, "arrow")}${labels(38, 60, "nach unten:\nmehr\nMenschen", "lbl small", "start")}${label(360, 344, "Modell: Die Wirklichkeit war vielfältiger.", "lbl tiny")}`,
  );
}

export function assembly(): string {
  const citizens = Array.from({ length: 14 }, (_, i) => {
    const x = 210 + (i % 7) * 52,
      y = 190 + Math.floor(i / 7) * 56;
    return person(x, y, 1, i % 2 ? "cloth-citizen" : "cloth-citizen-b", i % 3 === 0 ? "up" : "down");
  }).join("");
  const outside: Array<[number, string, string]> = [
    [620, "Frauen", "cloth-out"],
    [680, "Metöken\n(Zugezogene)", "cloth-out"],
    [740, "Sklaven", "cloth-out"],
  ];
  const body = `<rect class="sky" width="800" height="330"/><path class="hill green" d="M0 120Q300 60 590 110V330H0Z"/>
  <rect class="bema" x="80" y="120" width="70" height="60" rx="4"/>${person(115, 120, 1.3, "cloth-speaker", "out")}${label(115, 200, "Rednerstein", "lbl tiny")}
  ${citizens}${labels(370, 290, "Männer mit athenischem Bürgerrecht:\nreden mit, stimmen per Handzeichen ab", "lbl small")}
  <line class="boundary" x1="590" y1="70" x2="590" y2="320"/>
  ${outside.map(([x, name, cls]) => `${person(x, 200, 1, cls)}${labels(x, 226, name, "lbl tiny")}`).join("")}
  ${person(660, 290, 0.7, "cloth-out")}${label(660, 310, "Kinder", "lbl tiny")}
  ${labels(690, 100, "durften nicht\nmitstimmen", "lbl small strong")}
  ${label(300, 34, "Volksversammlung auf dem Hügel Pnyx in Athen", "lbl strong")}`;
  return svg(
    800,
    330,
    "Die Volksversammlung in Athen auf dem Hügel Pnyx: Männer mit Bürgerrecht hören einem Redner zu und stimmen per Handzeichen ab; Frauen, Metöken, Sklaven und Kinder stehen außerhalb und durften nicht mitstimmen",
    body,
  );
}

export function democracyThenNow(): string {
  const people = (x: number, y: number, n: number, cls: string, arms: "up" | "down" = "up") =>
    Array.from({ length: n }, (_, i) => person(x + i * 30, y, 0.8, cls, arms)).join("");
  const body = `${panel(10, 10, 380, 320, "col-old")}${panel(410, 10, 380, 320, "col-new")}
  ${labels(200, 40, "Athen um 450 v. Chr.\ndirekte Demokratie", "lbl strong")}
  ${people(80, 140, 8, "cloth-citizen")}${arrow(200, 150, 200, 200)}<rect class="decision" x="120" y="204" width="160" height="40" rx="8"/>${label(200, 229, "Beschluss", "lbl small strong on-decision")}
  ${labels(200, 270, "Die Bürger stimmen selbst über jede\nwichtige Frage ab. Nur Männer mit\nBürgerrecht dürfen mitmachen.", "lbl tiny")}
  ${labels(600, 40, "Deutschland heute\nrepräsentative Demokratie", "lbl strong")}
  ${people(480, 120, 8, "cloth-today", "down")}${arrow(600, 128, 600, 158)}${label(608, 148, "wählen", "lbl tiny", "start")}
  ${people(555, 200, 4, "cloth-deputy", "up")}${label(600, 214, "Abgeordnete im Parlament", "lbl tiny")}${arrow(600, 222, 600, 240)}<rect class="decision" x="520" y="244" width="160" height="30" rx="8"/>${label(600, 264, "Gesetz", "lbl small strong on-decision")}
  ${labels(600, 296, "Alle deutschen Staatsbürgerinnen und\n-bürger ab 18 dürfen den Bundestag wählen.", "lbl tiny")}`;
  return svg(
    800,
    340,
    "Vergleich: In Athen stimmten Männer mit Bürgerrecht selbst über Beschlüsse ab, direkte Demokratie. In Deutschland wählen heute alle Staatsbürgerinnen und Staatsbürger ab 18 Abgeordnete, die Gesetze beschließen, repräsentative Demokratie.",
    body,
  );
}

export function greekLegacy(): string {
  const cards: Array<[string, string, (x: number, y: number) => string]> = [
    ["Demokratie", "„dēmos“ = Volk,\n„kratein“ = herrschen", (x, y) => `${person(x - 16, y + 22, 0.7, "cloth-citizen", "up")}${person(x, y + 22, 0.7, "cloth-citizen-b", "up")}${person(x + 16, y + 22, 0.7, "cloth-citizen", "up")}`],
    ["Theater", "Tragödie und Komödie", (x, y) => `<path class="mask" d="M${x - 24} ${y - 18}h22v20q0 14-11 14t-11-14z"/><path class="mask b" d="M${x + 2} ${y - 14}h22v20q0 14-11 14t-11-14z"/>`],
    ["Olympische Spiele", "seit 776 v. Chr.\nin Olympia", (x, y) => `<path class="laurel" d="M${x - 20} ${y + 10}q-6-26 20-34M${x + 20} ${y + 10}q6-26-20-34"/><path class="leaf" d="M${x - 22} ${y - 4}l-8-4M${x - 18} ${y - 14}l-8-6M${x + 22} ${y - 4}l8-4M${x + 18} ${y - 14}l8-6"/>`],
    ["Säulen", "Vorbild für Bauten\nbis heute", (x, y) => `<rect class="column" x="${x - 10}" y="${y - 22}" width="20" height="44"/><rect class="column" x="${x - 18}" y="${y - 28}" width="36" height="8"/><rect class="column" x="${x - 18}" y="${y + 20}" width="36" height="8"/>`],
    ["Alphabet", "Alpha + Beta", (x) => `<text class="lbl greek" x="${x}" y="98" text-anchor="middle">Α Β Γ</text>`],
    ["Mathematik", "Satz des Pythagoras", (x, y) => `<path class="triangle" d="M${x - 24} ${y + 18}h48v-36z"/><rect class="right-angle" x="${x + 16}" y="${y + 10}" width="8" height="8"/>`],
  ];
  const body = cards
    .map(([title, text, icon], i) => {
      const x = 70 + i * 132;
      return `${panel(x - 62, 16, 124, 220)}${icon(x, 84)}${label(x, 150, title, "lbl small strong")}${labels(x, 176, text, "lbl tiny")}`;
    })
    .join("");
  return svg(
    800,
    250,
    "Sechs Dinge, die wir von den alten Griechen übernommen haben: Demokratie, Theater, Olympische Spiele, Säulen, das Alphabet und Mathematik",
    body,
  );
}

export function conflictStairs(): string {
  const steps = [
    "Meinungen gehen\nauseinander",
    "Streit mit\nVorwürfen",
    "Beleidigen und\nAusgrenzen",
    "Drohen",
    "Gewalt",
  ];
  const body = steps
    .map((text, i) => {
      const x = 40 + i * 140,
        y = 260 - i * 44;
      return `<rect class="stair-${i + 1}" x="${x}" y="${y}" width="140" height="${300 - y}"/>${labels(x + 70, y + 22, text, "lbl small on-stair")}`;
    })
    .join("");
  return svg(
    800,
    310,
    "Konflikttreppe mit fünf Stufen: Meinungen gehen auseinander, Streit mit Vorwürfen, Beleidigen und Ausgrenzen, Drohen, Gewalt. Je höher die Stufe, desto schwerer die Lösung.",
    `${body}${arrow(90, 170, 520, 90, "arrow")}${labels(60, 40, "Je früher ihr einen Streit klärt,\ndesto leichter findet ihr eine Lösung.", "lbl small strong", "start")}`,
  );
}

export function iMessage(): string {
  const bubble = (x: number, y: number, w: number, h: number, cls: string) =>
    `<path class="${cls}" d="M${x} ${y}h${w}a14 14 0 0 1 14 14v${h - 28}a14 14 0 0 1-14 14h${-w + 40}l-20 18 2-18h-22a14 14 0 0 1-14-14v${-(h - 28)}a14 14 0 0 1 14-14z"/>`;
  const body = `${bubble(40, 30, 300, 110, "bubble-you")}${labels(190, 70, "„Du nimmst immer\nmeine Sachen!“", "lbl small strong")}${label(190, 196, "Du-Botschaft: greift an", "lbl small")}
  ${bubble(440, 30, 320, 110, "bubble-i")}${labels(600, 64, "„Ich ärgere mich, wenn mein Stift\nfehlt. Ich wünsche mir,\ndass du mich vorher fragst.“", "lbl small strong")}${label(600, 196, "Ich-Botschaft: erklärt und wünscht", "lbl small")}
  ${person(120, 260, 1.2, "cloth-a", "out")}${person(640, 260, 1.2, "cloth-b", "out")}
  ${panel(240, 214, 320, 80)}${labels(400, 240, "Ich-Botschaft in drei Teilen:\nWas ich sehe · Wie ich mich fühle · Was ich mir wünsche", "lbl tiny")}`;
  return svg(
    800,
    300,
    "Zwei Sprechblasen: Die Du-Botschaft greift an, die Ich-Botschaft nennt, was passiert ist, wie man sich fühlt und was man sich wünscht",
    body,
  );
}

export function classRules(): string {
  const body = `${panel(60, 10, 420, 300, "poster")}${label(270, 50, "Unsere Klassenregeln", "lbl strong")}
  ${labels(90, 96, "1. Wir lassen andere ausreden.\n2. Wir fragen, bevor wir etwas ausleihen.\n3. Wir lösen Streit mit Worten.\n4. Wer einen Fehler macht,\n    sucht eine Wiedergutmachung.", "lbl small", "start", 30)}
  ${labels(270, 286, "Unterschriften der ganzen Klasse", "lbl tiny")}
  ${panel(510, 10, 270, 300)}${label(645, 46, "Gute Regeln sind …", "lbl strong")}
  ${labels(530, 90, "✓ positiv formuliert:\n    was wir tun\n✓ klar und überprüfbar\n✓ für alle gleich\n✓ gemeinsam beschlossen\n✓ mit fairer Folge,\n    wenn jemand sie bricht", "lbl small", "start", 26)}`;
  return svg(
    800,
    320,
    "Plakat mit vier Klassenregeln und eine Liste, woran man gute Regeln erkennt: positiv formuliert, klar, für alle gleich, gemeinsam beschlossen, mit fairer Folge",
    body,
  );
}

export function classElection(): string {
  const badges: Array<[string, string]> = [
    ["geheim", "Niemand sieht,\nwen du wählst."],
    ["frei", "Niemand darf dich\nunter Druck setzen."],
    ["gleich", "Jede Stimme\nzählt gleich viel."],
  ];
  const body = `<rect class="ballot-box" x="80" y="140" width="180" height="130" rx="8"/><rect class="slot" x="130" y="136" width="80" height="8" rx="3"/><path class="ballot" d="M150 70h50v60h-50z"/><path class="cross" d="M162 92l12 12M174 92l-12 12"/>${label(170, 300, "Wahlurne", "lbl small")}
  ${badges.map(([title, text], i) => `<circle class="badge" cx="${400 + i * 140}" cy="110" r="52"/>${label(400 + i * 140, 117, title, "lbl strong on-badge")}${labels(400 + i * 140, 196, text, "lbl small")}`).join("")}
  ${labels(540, 270, "In Bayern wählt ab der 5. Klasse jede Klasse eine Klassensprecherin\noder einen Klassensprecher und eine Vertretung.", "lbl tiny")}`;
  return svg(
    800,
    310,
    "Eine Wahlurne mit einem Stimmzettel und drei Wahlgrundsätze: geheim, frei und gleich",
    body,
  );
}

export function classCouncil(): string {
  const roles = ["Leitung", "Protokoll", "Zeit", "Regeln"];
  const chairs = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x = 220 + 150 * Math.cos(a),
      y = 165 + 110 * Math.sin(a);
    const role = i % 3 === 0 ? roles[i / 3] : "";
    return `<circle class="${role ? "chair role" : "chair"}" cx="${f1(x)}" cy="${f1(y)}" r="16"/>${role ? label(x, y + (y > 165 ? 34 : -22), role, "lbl tiny strong") : ""}`;
  }).join("");
  const body = `<ellipse class="rug" cx="220" cy="165" rx="110" ry="72"/>${label(220, 170, "Klassenrat", "lbl strong")}${chairs}
  ${panel(430, 14, 350, 290)}${label(605, 44, "Ablauf", "lbl strong")}
  ${labels(450, 80, "1. Anliegen aus dem Briefkasten vorlesen\n2. Alle sagen ihre Sicht, die anderen\n    hören aktiv zu\n3. Lösungen sammeln und abwägen\n4. Kompromiss suchen\n5. abstimmen und Beschluss notieren\n6. beim nächsten Mal überprüfen", "lbl small", "start", 28)}`;
  return svg(
    800,
    320,
    "Stuhlkreis für den Klassenrat mit den Rollen Leitung, Protokoll, Zeitwächter und Regelwächter; daneben der Ablauf vom Anliegen bis zum überprüften Beschluss",
    body,
  );
}

export function familyForms(): string {
  const groups: Array<[string, Array<[number, string]>]> = [
    ["Eltern mit Kindern", [[1, "cloth-a"], [1, "cloth-b"], [0.65, "cloth-c"]]],
    ["Ein-Eltern-Familie", [[1, "cloth-b"], [0.65, "cloth-c"], [0.65, "cloth-a"]]],
    ["Patchworkfamilie", [[1, "cloth-a"], [1, "cloth-b"], [0.65, "cloth-c"], [0.65, "cloth-d"]]],
    ["Regenbogenfamilie", [[1, "cloth-b"], [1, "cloth-b"], [0.65, "cloth-c"]]],
    ["drei Generationen", [[1.05, "cloth-old"], [1, "cloth-a"], [0.65, "cloth-c"]]],
    ["Pflege- oder\nAdoptivfamilie", [[1, "cloth-a"], [1, "cloth-d"], [0.65, "cloth-c"]]],
  ];
  const body = groups
    .map(([name, members], i) => {
      const x = 70 + (i % 3) * 260,
        y = 30 + Math.floor(i / 3) * 160;
      return `${panel(x - 55, y, 230, 145)}${members.map(([s, cls], k) => person(x + k * 40, y + 105, s, cls)).join("")}<path class="heart" d="M${x + 150} ${y + 40}c-10-12-26 0-14 14l14 12 14-12c12-14-4-26-14-14z"/>${labels(x + 60, y + 128, name, "lbl small strong")}`;
    })
    .join("");
  return svg(
    800,
    340,
    "Sechs Formen von Familie: Eltern mit Kindern, Ein-Eltern-Familie, Patchworkfamilie, Regenbogenfamilie, drei Generationen unter einem Dach und Pflege- oder Adoptivfamilie",
    body,
  );
}

export function familyChange(): string {
  const causes: Array<[number, number, string]> = [
    [140, 60, "Frauen und Männer\nsind gleichberechtigt"],
    [400, 40, "oft arbeiten\nbeide Eltern"],
    [660, 60, "Gesetze ändern sich:\nEhe für alle seit 2017"],
    [140, 260, "Trennungen und\nneue Partnerschaften"],
    [400, 290, "mehr Akzeptanz für\nverschiedene Lebensformen"],
    [660, 260, "Umzüge für Arbeit\nund Ausbildung"],
  ];
  const body = `${causes.map(([x, y]) => `<line class="spoke" x1="400" y1="165" x2="${x}" y2="${y}"/>`).join("")}<ellipse class="center-bubble" cx="400" cy="165" rx="130" ry="50"/>${labels(400, 160, "Warum Familien\nheute vielfältiger sind", "lbl strong on-center")}
  ${causes.map(([x, y, text]) => `<rect class="cause" x="${x - 105}" y="${y - 26}" width="210" height="56" rx="12"/>${labels(x, y - 4, text, "lbl small")}`).join("")}`;
  return svg(
    800,
    330,
    "Gründe, warum Familien heute vielfältiger sind: Gleichberechtigung, oft arbeiten beide Eltern, Ehe für alle seit 2017, Trennungen und neue Partnerschaften, mehr Akzeptanz, Umzüge für Arbeit und Ausbildung",
    body,
  );
}

export function inclusion(): string {
  const pairs: Array<[string, string]> = [
    ["Treppe", "Rampe oder Aufzug"],
    ["Durchsage", "Text auf dem Bildschirm,\nGebärdensprache"],
    ["schwerer Text", "Leichte Sprache"],
    ["nur gedrucktes Schild", "Brailleschrift (Punktschrift),\nVorlesefunktion"],
  ];
  const body = pairs
    .map(([barrier, solution], i) => {
      const y = 30 + i * 72;
      return `<rect class="barrier" x="40" y="${y}" width="250" height="54" rx="10"/>${label(165, y + 33, barrier, "lbl small strong")}${arrow(300, y + 27, 370, y + 27)}<rect class="solution" x="380" y="${y}" width="380" height="54" rx="10"/>${labels(570, y + (solution.includes("\n") ? 22 : 33), solution, "lbl small strong")}`;
    })
    .join("");
  return svg(
    800,
    330,
    "Barrieren und Lösungen: Treppe zu Rampe oder Aufzug, Durchsage zu Text und Gebärdensprache, schwerer Text zu Leichter Sprache, gedrucktes Schild zu Brailleschrift oder Vorlesefunktion",
    `${label(165, 20, "Barriere", "lbl small muted")}${label(570, 20, "Lösung: alle können teilnehmen", "lbl small muted")}${body}`,
  );
}
