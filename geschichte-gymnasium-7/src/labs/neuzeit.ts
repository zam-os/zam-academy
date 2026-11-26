/**
 * Interactive models for LB 5 (Das konfessionelle Zeitalter), LB 6
 * (Absolutismus und Barock) and LB 7 (Bauwerke als Ausdruck politischen
 * Denkens):
 * - reformationVerlauf: stations 1517–1555 on a map of the Reich
 * - flugblatt: analyse a broadsheet modelled on the Passional (1521)
 * - kriegsphasen: phases of the Thirty Years' War with a religion/power meter
 * - versailles: plan of Versailles with its axis
 * - balanceOfPower: balance scale of European powers around 1701–1713
 * - bauwerkeVergleich: four buildings compared by participation of the people
 */
import { badgePill, crown, dot, f1, label, labels, panel, person, svg } from "../figures/draw";
import { atCrop, frameBase, GERMANY_FRAME } from "../figures/maps";
import { C } from "../figures/scenes-lb1-2";
import { type LabDef, num, remember, seen, str } from "./core";

/* ---------- LB 5: Verlauf der Reformation ---------- */

export const REFORMATION_STEPS = [
  { year: "1517", place: "Wittenberg", lon: 12.65, lat: 51.87, text: "Luther veröffentlicht 95 Thesen gegen den Ablass." },
  { year: "1520", place: "Wittenberg", lon: 12.65, lat: 51.87, text: "Luther verbrennt die Bulle, mit der der Papst ihm den Bann androht." },
  { year: "1521", place: "Worms", lon: 8.36, lat: 49.63, text: "Auf dem Reichstag verweigert Luther vor Kaiser Karl V. den Widerruf; die Reichsacht folgt." },
  { year: "1521/22", place: "Wartburg (Eisenach)", lon: 10.31, lat: 50.97, text: "Versteckt auf der Wartburg übersetzt Luther das Neue Testament ins Deutsche." },
  { year: "1525", place: "Memmingen", lon: 10.18, lat: 47.99, text: "Bauern berufen sich in den Zwölf Artikeln auf die Bibel; der Bauernkrieg wird niedergeschlagen." },
  { year: "1530", place: "Augsburg", lon: 10.9, lat: 48.37, text: "Die evangelischen Stände legen dem Kaiser ihr Bekenntnis vor (Augsburger Bekenntnis)." },
  { year: "1555", place: "Augsburg", lon: 10.9, lat: 48.37, text: "Augsburger Religionsfriede: Der Landesherr bestimmt die Konfession seines Landes." },
];

export const reformationVerlauf: LabDef = {
  title: "Stationen der Reformation 1517–1555",
  prompt:
    "Gehe die Stationen der Reformation durch. Wo geschah was – und wie half der Buchdruck?",
  init: () => ({ step: 0, druck: false }),
  controls: () => [
    { type: "range", key: "step", label: "Station", min: 0, max: REFORMATION_STEPS.length - 1, step: 1, format: (v) => REFORMATION_STEPS[v].year },
    { type: "toggle", key: "druck", label: "Verbreitung durch den Buchdruck zeigen" },
  ],
  goals: (s) => [
    { text: "Den Auftritt Luthers vor dem Kaiser finden", met: num(s, "step") === 2 },
    { text: "Die Regelung von 1555 erreichen", met: num(s, "step") === REFORMATION_STEPS.length - 1 },
    { text: "Zeigen, wie schnell sich die Thesen von 1517 durch den Buchdruck verbreiteten", met: Boolean(s.druck) && num(s, "step") === 0 },
  ],
  draw: (s) => {
    const f = GERMANY_FRAME;
    const st = REFORMATION_STEPS[num(s, "step")];
    const [x, y] = atCrop(f, st.lon, st.lat);
    const [wx, wy] = atCrop(f, 12.65, 51.87);
    const ring = (r: number, o: number) => `<circle cx="${f1(wx)}" cy="${f1(wy)}" r="${r}" fill="none" stroke="${C.red}" stroke-width="3" opacity="${o}"/>`;
    const cities = [
      { n: "Nürnberg", lon: 11.08, lat: 49.45 },
      { n: "Straßburg", lon: 7.75, lat: 48.58 },
      { n: "Leipzig", lon: 12.37, lat: 51.34 },
      { n: "Köln", lon: 6.96, lat: 50.94 },
    ];
    return svg(
      640,
      527,
      `Karte der Reformation: ${st.year} in ${st.place}`,
      `${frameBase(f, true)}
       ${s.druck ? `${ring(60, 0.7)}${ring(130, 0.45)}${ring(210, 0.25)}${cities.map((c) => {
         const [cx, cy] = atCrop(f, c.lon, c.lat);
         return `${dot(cx, cy, "city")}${label(cx + 7, cy + 4, `${c.n}: Nachdruck`, "lbl tiny", "start")}`;
       }).join("")}` : ""}
       <circle cx="${f1(x)}" cy="${f1(y)}" r="16" fill="none" stroke="var(--accent)" stroke-width="4"/>
       ${dot(x, y, "capital", 6)}
       ${label(x + (st.lon > 11 ? -20 : 20), y + 4, st.place, "lbl small strong", st.lon > 11 ? "end" : "start")}
       ${panel(428, 12, 204, 230, "panel-bg")}
       ${badgePill(530, 38, 110, st.year)}
       ${labels(440, 70, st.text.replace(/(.{1,28})(\s|$)/g, "$1\n").trim(), "lbl tiny", "start", 15)}
       ${s.druck ? labels(440, 200, "Drucker in vielen Städten\ndruckten die Thesen nach.", "lbl tiny strong", "start", 14) : ""}`,
    );
  },
  readout: (s) => {
    const st = REFORMATION_STEPS[num(s, "step")];
    return `${st.year}, ${st.place}: ${st.text}${s.druck ? " Drucker in vielen Städten druckten Luthers Schriften nach – nach wenigen Wochen waren die Thesen im ganzen Reich bekannt." : ""}`;
  },
};

/* ---------- LB 5: Flugblatt analysieren ---------- */

export const FLUGBLATT_PARTS: Record<string, { label: string; text: string }> = {
  ueberblick: { label: "Überblick", text: "Ein Flugblatt nach dem Vorbild des „Passional Christi und Antichristi“ (Wittenberg 1521), stark vereinfacht nachgezeichnet." },
  links: { label: "Bild links", text: "Christus wäscht seinen Jüngern demütig die Füße – ein Bild des Dienens." },
  rechts: { label: "Bild rechts", text: "Der Papst lässt sich prachtvoll die Füße küssen – ein Bild des Hochmuts." },
  titel: { label: "Überschrift", text: "Die Überschrift stellt die Gegensätze schlagwortartig gegenüber: „Christus“ und „Antichristus“." },
  text: { label: "Text", text: "Kurze Bibelzitate unter den Bildern geben der Botschaft Gewicht – die Bibel als Maßstab." },
  werkstatt: { label: "Hersteller", text: "Hergestellt in der Werkstatt Lucas Cranachs in Wittenberg, mit Texten aus dem Kreis um Luther." },
};

export const flugblatt: LabDef = {
  title: "Ein Flugblatt der Reformationszeit untersuchen",
  prompt:
    "Untersuche die Teile des Flugblatts. Wie überzeugt es – und was hat es mit einem Beitrag in sozialen Medien gemeinsam?",
  init: () => ({ teil: "ueberblick", heute: false, seenTeile: "" }),
  controls: () => [
    { type: "choice", key: "teil", label: "Teil des Flugblatts", options: Object.entries(FLUGBLATT_PARTS).map(([value, p]) => ({ value, label: p.label })) },
    { type: "toggle", key: "heute", label: "Mit einem Beitrag von heute vergleichen" },
  ],
  set: (state, key, value) => {
    state[key] = value;
    if (key === "teil") remember(state, "seenTeile", String(value));
  },
  goals: (s) => [
    { text: "Beide Bilder untersuchen und die Gegenüberstellung erkennen", met: seen(s, "seenTeile", "links") && seen(s, "seenTeile", "rechts") },
    { text: "Herausfinden, wer das Flugblatt hergestellt hat", met: str(s, "teil") === "werkstatt" },
    { text: "Das Flugblatt mit einem heutigen Beitrag vergleichen", met: Boolean(s.heute) },
  ],
  draw: (s) => {
    const t = str(s, "teil");
    const hi = (k: string) => (t === k ? "var(--accent)" : "var(--f-line)");
    const hw = (k: string) => (t === k ? 4 : 1.5);
    const sheet = `<rect x="20" y="16" width="${s.heute ? 380 : 600}" height="268" fill="#fbf4e2" stroke="var(--f-ink)"/>`;
    const w = s.heute ? 160 : 260;
    const lx = 36;
    const rx = lx + w + 24;
    const scene = (x: number, kneel: boolean) => `
      <rect x="${x}" y="64" width="${w}" height="150" fill="#efe2c0" stroke="${hi(kneel ? "links" : "rechts")}" stroke-width="${hw(kneel ? "links" : "rechts")}"/>
      ${kneel ? `${person(x + w * 0.35, 200, 1.4, "cloth-linen")}${person(x + w * 0.7, 200, 1.1, "cloth-c")}<circle cx="${f1(x + w * 0.35)}" cy="146" r="12" fill="none" stroke="#f2cf3d" stroke-width="3"/>` : `${person(x + w * 0.4, 200, 1.5, "cloth-scribe")}${crown(x + w * 0.4, 140, 0.6)}${person(x + w * 0.75, 206, 0.9, "cloth-a")}`}`;
    return svg(
      640,
      300,
      `Flugblatt nach dem Vorbild des Passional Christi und Antichristi, ausgewählt: ${FLUGBLATT_PARTS[t].label}`,
      `${panel(8, 8, 624, 284, "panel-bg")}
       ${sheet}
       <rect x="${lx}" y="26" width="${2 * w + 24}" height="30" fill="none" stroke="${hi("titel")}" stroke-width="${hw("titel")}"/>
       ${label(lx + w / 2, 47, "Passional Christi", "lbl small strong")}
       ${label(rx + w / 2, 47, "und Antichristi", "lbl small strong")}
       ${scene(lx, true)}${scene(rx, false)}
       <rect x="${lx}" y="220" width="${2 * w + 24}" height="34" fill="none" stroke="${hi("text")}" stroke-width="${hw("text")}"/>
       ${[0, 1].map((i) => `<line x1="${lx + 10}" y1="${230 + i * 12}" x2="${lx + w - 10}" y2="${230 + i * 12}" stroke="var(--f-ink)"/><line x1="${rx + 10}" y1="${230 + i * 12}" x2="${rx + w - 10}" y2="${230 + i * 12}" stroke="var(--f-ink)"/>`).join("")}
       <rect x="${lx}" y="260" width="${2 * w + 24}" height="18" fill="none" stroke="${hi("werkstatt")}" stroke-width="${hw("werkstatt")}"/>
       ${label(lx + w + 12, 273, "Gedruckt zu Wittenberg", "lbl tiny")}
       ${s.heute ? `<rect x="420" y="16" width="200" height="268" rx="22" fill="var(--surface)" stroke="var(--f-ink)" stroke-width="2"/>
         <rect x="436" y="44" width="168" height="110" rx="8" fill="var(--f-sky)"/>
         ${person(480, 146, 1, "cloth-today")}${person(560, 146, 1, "cloth-b")}
         ${label(520, 176, "„Die da oben lügen!“", "lbl tiny strong")}
         ${labels(440, 204, "👍 12 000   🔁 3 400\nBild + Schlagzeile\nTeilen in Sekunden", "lbl tiny", "start", 16)}
         ${label(520, 272, "Beitrag heute (erfunden)", "lbl tiny muted")}` : ""}`,
    );
  },
  readout: (s) => {
    const base = FLUGBLATT_PARTS[str(s, "teil")].text;
    return s.heute ? `${base} Wie ein Beitrag in sozialen Medien arbeitet das Flugblatt mit starkem Bild, kurzer Botschaft und klarer Gut-Böse-Einteilung; neu sind heute Tempo, Reichweite und dass jeder selbst veröffentlichen kann.` : base;
  },
};

/* ---------- LB 5: Phasen des Dreißigjährigen Krieges ---------- */

export const WAR_PHASES: Record<
  string,
  { label: string; years: string; religion: number; events: Array<{ n: string; lon: number; lat: number }>; text: string }
> = {
  "1": { label: "Böhmisch-pfälzischer Krieg", years: "1618–1623", religion: 85, events: [{ n: "Prag 1618/1620", lon: 14.42, lat: 50.09 }, { n: "Heidelberg 1622", lon: 8.69, lat: 49.41 }], text: "Evangelische Adlige in Böhmen erheben sich; Kaiser und Liga siegen 1620 am Weißen Berg, Bayern erhält die Kurwürde." },
  "2": { label: "Dänisch-niedersächsischer Krieg", years: "1625–1629", religion: 65, events: [{ n: "Lutter 1626", lon: 10.27, lat: 51.98 }, { n: "Stralsund 1628", lon: 13.09, lat: 54.31 }], text: "Der König von Dänemark greift ein und wird besiegt; Wallenstein wird zum mächtigsten Heerführer des Kaisers." },
  "3": { label: "Schwedischer Krieg", years: "1630–1635", religion: 45, events: [{ n: "Magdeburg 1631", lon: 11.63, lat: 52.13 }, { n: "Lützen 1632", lon: 12.14, lat: 51.26 }, { n: "München 1632", lon: 11.58, lat: 48.14 }, { n: "Nördlingen 1634", lon: 10.49, lat: 48.85 }], text: "Gustav II. Adolf von Schweden landet 1630, zieht bis München und fällt 1632 bei Lützen; Magdeburg wird 1631 zerstört." },
  "4": { label: "Schwedisch-französischer Krieg", years: "1635–1648", religion: 15, events: [{ n: "Zusmarshausen 1648", lon: 10.6, lat: 48.4 }, { n: "Wittstock 1636", lon: 12.49, lat: 53.16 }], text: "Das katholische Frankreich kämpft offen an der Seite Schwedens gegen den katholischen Kaiser – jetzt geht es vor allem um Macht." },
};

export const kriegsphasen: LabDef = {
  title: "Die Phasen des Dreißigjährigen Krieges",
  prompt:
    "Wähle eine Phase. Wo wurde gekämpft – und ging es eher um Religion oder um Macht?",
  init: () => ({ phase: "0", frieden: false }),
  controls: () => [
    {
      type: "choice",
      key: "phase",
      label: "Phase",
      options: [{ value: "0", label: "Überblick" }, ...Object.entries(WAR_PHASES).map(([value, p]) => ({ value, label: `${p.years}` }))],
    },
    { type: "toggle", key: "frieden", label: "Friedensorte 1648 einblenden" },
  ],
  goals: (s) => [
    { text: "Den Beginn des Krieges in Prag finden", met: str(s, "phase") === "1" },
    { text: "Die Phase finden, in der Frankreich offen eingreift", met: str(s, "phase") === "4" },
    { text: "Die Orte des Friedensschlusses einblenden", met: Boolean(s.frieden) },
  ],
  draw: (s) => {
    const f = GERMANY_FRAME;
    const p = str(s, "phase");
    const phase = p === "0" ? null : WAR_PHASES[p];
    const rel = phase ? phase.religion : 50;
    const peace = [
      { n: "Münster", lon: 7.63, lat: 51.96 },
      { n: "Osnabrück", lon: 8.05, lat: 52.28 },
    ];
    return svg(
      640,
      527,
      `Karte des Dreißigjährigen Krieges: ${phase ? `${phase.label} ${phase.years}` : "Überblick"}`,
      `${frameBase(f, true)}
       ${(phase ? phase.events : Object.values(WAR_PHASES).flatMap((x) => x.events)).map((e) => {
         const [x, y] = atCrop(f, e.lon, e.lat);
         return `<path d="M${f1(x - 7)} ${f1(y - 7)}L${f1(x + 7)} ${f1(y + 7)}M${f1(x + 7)} ${f1(y - 7)}L${f1(x - 7)} ${f1(y + 7)}" stroke="${C.red}" stroke-width="3.5"/>${phase ? label(x + 10, y + 4, e.n, "lbl tiny strong", "start") : ""}`;
       }).join("")}
       ${s.frieden ? peace.map((e) => {
         const [x, y] = atCrop(f, e.lon, e.lat);
         return `<circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="${C.green}" stroke="var(--f-halo)" stroke-width="2"/>${label(x - 12, y + 4, e.n, "lbl tiny strong", "end")}`;
       }).join("") : ""}
       ${panel(428, 12, 204, 330, "panel-bg")}
       ${label(530, 36, phase ? phase.years : "1618–1648", "lbl small strong")}
       ${labels(530, 56, phase ? phase.label.replace("-", "-\n") : "Überblick", "lbl tiny strong", "middle", 13)}
       ${label(530, 112, "Worum ging es?", "lbl tiny strong")}
       <rect x="446" y="124" width="168" height="16" rx="8" fill="var(--f-stone)"/>
       <rect x="446" y="124" width="${f1(rel * 1.68)}" height="16" rx="8" fill="${C.purple}"/>
       ${label(446, 156, "Religion", "lbl tiny strong", "start")}${label(614, 156, "Macht", "lbl tiny strong", "end")}
       ${labels(440, 182, phase ? phase.text.replace(/(.{1,30})(\s|$)/g, "$1\n").trim() : "Wähle eine Phase.\nRote Kreuze: Schlachten\nund Zerstörungen.", "lbl tiny", "start", 14)}
       ${label(530, 334, "Einschätzung, keine Messung", "lbl tiny muted")}`,
    );
  },
  readout: (s) => {
    const p = str(s, "phase");
    const base = p === "0" ? "1618 bis 1648: vier Phasen, in denen immer mehr Mächte eingriffen." : `${WAR_PHASES[p].label} (${WAR_PHASES[p].years}): ${WAR_PHASES[p].text}`;
    return s.frieden ? `${base} In Münster und Osnabrück wurde ab 1643 verhandelt und 1648 der Westfälische Friede geschlossen.` : base;
  },
};

/* ---------- LB 6: Versailles ---------- */

export const VERSAILLES_PARTS: Record<string, { label: string; text: string }> = {
  ueberblick: { label: "Überblick", text: "Stadt, Schloss und Garten bilden eine einzige, streng geordnete Anlage." },
  strassen: { label: "Drei Straßen", text: "Drei breite Straßen der Stadt Versailles laufen sternförmig auf das Schloss zu – alles führt zum König." },
  hof: { label: "Ehrenhof", text: "Durch immer engere Höfe nähert sich der Besucher dem Zentrum der Macht." },
  schlafzimmer: { label: "Schlafzimmer des Königs", text: "Seit 1701 liegt das Schlafzimmer genau in der Mitte der Hauptachse – hier fand das Lever statt." },
  spiegelsaal: { label: "Spiegelsaal", text: "Hunderte Spiegel und Deckengemälde mit den Siegen Ludwigs XIV. feiern den König." },
  garten: { label: "Garten", text: "Le Nôtre ordnete die Natur in Beete, Achsen und Wasserspiele: Der König beherrscht sogar die Natur." },
  kanal: { label: "Großer Kanal", text: "Die Achse endet erst am Großen Kanal und setzt sich optisch bis zum Horizont fort." },
};

export const versailles: LabDef = {
  title: "Der Plan von Versailles",
  prompt:
    "Untersuche die Teile der Anlage und blende die Hauptachse ein. Wo liegt der Mittelpunkt der Macht?",
  init: () => ({ teil: "ueberblick", achse: false }),
  controls: () => [
    { type: "choice", key: "teil", label: "Teil der Anlage", options: Object.entries(VERSAILLES_PARTS).map(([value, p]) => ({ value, label: p.label })) },
    { type: "toggle", key: "achse", label: "Hauptachse einblenden" },
  ],
  goals: (s) => [
    { text: "Den Mittelpunkt der Anlage finden", met: str(s, "teil") === "schlafzimmer" },
    { text: "Der Hauptachse bis zum Großen Kanal folgen", met: Boolean(s.achse) && str(s, "teil") === "kanal" },
    { text: "Den Raum finden, der die Siege des Königs feiert", met: str(s, "teil") === "spiegelsaal" },
  ],
  draw: (s) => {
    const t = str(s, "teil");
    const hi = (k: string) => (t === k ? "var(--accent)" : "var(--f-ink)");
    const hw = (k: string) => (t === k ? 4 : 1.2);
    return svg(
      640,
      300,
      `Plan von Versailles, ausgewählt: ${VERSAILLES_PARTS[t].label}`,
      `${panel(8, 8, 624, 284, "panel-bg")}
       <path d="M20 60L170 150M20 150H170M20 240L170 150" stroke="var(--f-stone)" stroke-width="10"/>
       <path d="M20 60L170 150M20 150H170M20 240L170 150" stroke="${hi("strassen")}" stroke-width="${t === "strassen" ? 3 : 0}" fill="none"/>
       ${label(60, 40, "Stadt Versailles", "lbl tiny strong")}
       <path d="M170 110H230V130H250V170H230V190H170Z" fill="#f4e6c8" stroke="${hi("hof")}" stroke-width="${hw("hof")}"/>
       ${label(205, 205, "Höfe", "lbl tiny strong")}
       <path d="M250 70H290V130H300V170H290V230H250Z" fill="#e8d3a0" stroke="var(--f-ink)" stroke-width="1.2"/>
       <rect x="262" y="140" width="22" height="20" fill="${C.red}" stroke="${hi("schlafzimmer")}" stroke-width="${hw("schlafzimmer")}"/>
       <rect x="290" y="70" width="10" height="160" fill="#c9d6df" stroke="${hi("spiegelsaal")}" stroke-width="${hw("spiegelsaal")}"/>
       ${label(270, 62, "Schloss", "lbl tiny strong")}
       <rect x="300" y="60" width="180" height="180" fill="var(--f-grass)" opacity="0.5" stroke="${hi("garten")}" stroke-width="${hw("garten")}"/>
       ${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect x="${320 + c * 90}" y="${76 + r * 56}" width="60" height="36" rx="4" fill="var(--f-forest)" opacity="0.6"/>`).join("")).join("")}
       <circle cx="390" cy="150" r="10" fill="var(--f-river)"/>
       <path d="M480 140H600V160H480Z" fill="var(--f-river)" stroke="${hi("kanal")}" stroke-width="${hw("kanal")}"/>
       <path d="M560 110V190H580V110Z" fill="var(--f-river)" stroke="${hi("kanal")}" stroke-width="${hw("kanal")}"/>
       ${label(540, 210, "Großer Kanal", "lbl tiny strong")}
       ${s.achse ? `<line x1="20" y1="150" x2="620" y2="150" stroke="#f2cf3d" stroke-width="3" stroke-dasharray="8 4"/>${label(400, 270, "Hauptachse: Stadt → Schloss → Garten → Kanal", "lbl tiny strong")}` : ""}
       <circle cx="273" cy="150" r="5" fill="#f2cf3d"/>
       ${label(330, 288, "Grundriss stark vereinfacht", "lbl tiny muted")}`,
    );
  },
  readout: (s) => `${VERSAILLES_PARTS[str(s, "teil")].text}${s.achse ? " Die Achse führt mitten durch das Schlafzimmer des Königs – wie die Sonne im Mittelpunkt der Planeten." : ""}`,
};

/* ---------- LB 6: balance of power ---------- */

export const POWERS = {
  frankreich: 4,
  spanien: 3,
  bayern: 1,
  england: 3,
  niederlande: 2,
  kaiser: 3,
};

export function balance(s: Record<string, unknown>): { france: number; allies: number } {
  const united = Boolean(s.spanien) && !s.utrecht;
  const france = POWERS.frankreich + (united ? POWERS.spanien : 0) + (s.bayern ? POWERS.bayern : 0);
  const allies =
    (s.england ? POWERS.england : 0) + (s.niederlande ? POWERS.niederlande : 0) + (s.kaiser ? POWERS.kaiser : 0);
  return { france, allies };
}

export const balanceOfPower: LabDef = {
  title: "Gleichgewicht der Mächte um 1700",
  prompt:
    "Lege die Gewichte auf die Waage. Wann droht eine Übermacht – und wie stellen Bündnisse das Gleichgewicht her? (Gewichte sind vereinfachte Annahmen.)",
  init: () => ({ spanien: false, bayern: true, england: false, niederlande: false, kaiser: false, utrecht: false }),
  controls: () => [
    { type: "toggle", key: "spanien", label: "Ein Enkel Ludwigs erbt Spanien (Kronen vereint)" },
    { type: "toggle", key: "bayern", label: "Bayern verbündet mit Frankreich" },
    { type: "toggle", key: "england", label: "England in der Allianz" },
    { type: "toggle", key: "niederlande", label: "Niederlande in der Allianz" },
    { type: "toggle", key: "kaiser", label: "Kaiser in der Allianz" },
    { type: "toggle", key: "utrecht", label: "Frieden von Utrecht 1713: Kronen bleiben getrennt" },
  ],
  goals: (s) => {
    const b = balance(s);
    const alliesAll = Boolean(s.england && s.niederlande && s.kaiser);
    return [
      { text: "Erkennen, wie übermächtig eine französisch-spanische Verbindung wäre", met: Boolean(s.spanien) && !s.utrecht && b.allies === 0 },
      { text: "Mit der Großen Allianz das Gleichgewicht herstellen", met: Boolean(s.spanien) && !s.utrecht && alliesAll && b.france === b.allies },
      { text: "Die Lösung von Utrecht ausprobieren: Spanien bourbonisch, aber getrennt", met: Boolean(s.spanien) && Boolean(s.utrecht) },
    ];
  },
  draw: (s) => {
    const b = balance(s);
    const diff = b.france - b.allies;
    const tilt = Math.max(-18, Math.min(18, diff * 3));
    const blocks = (n: number, x: number, colour: string) =>
      Array.from({ length: n }, (_, i) => `<rect x="${x + (i % 4) * 22}" y="${150 - Math.floor(i / 4) * 18}" width="20" height="16" rx="3" fill="${colour}" stroke="var(--f-ink)" stroke-width="0.8"/>`).join("");
    const status = diff === 0 ? "Gleichgewicht" : diff > 0 ? "Übermacht Frankreichs" : "Übermacht der Allianz";
    return svg(
      640,
      300,
      `Waage der Mächte: Frankreich ${b.france}, Allianz ${b.allies} – ${status}`,
      `${panel(8, 8, 624, 284, "panel-bg")}
       <polygon points="320,104 296,250 344,250" fill="var(--f-wood)"/>
       <g transform="rotate(${f1(-tilt)} 320 104)">
         <rect x="110" y="98" width="420" height="10" rx="4" fill="var(--f-ink)"/>
         <line x1="160" y1="108" x2="160" y2="168" stroke="var(--f-ink)"/>
         <line x1="480" y1="108" x2="480" y2="168" stroke="var(--f-ink)"/>
         <path d="M100 168H220L206 184H114Z" fill="${C.blue}"/>
         <path d="M420 168H540L526 184H434Z" fill="${C.red}"/>
         ${blocks(b.france, 116, C.blue)}
         ${blocks(b.allies, 436, C.red)}
         ${label(160, 206, `Frankreich und Verbündete: ${b.france}`, "lbl tiny strong")}
         ${label(480, 206, `Große Allianz: ${b.allies}`, "lbl tiny strong")}
       </g>
       ${badgePill(320, 40, 240, status, diff === 0 ? C.green : C.slate)}
       ${s.utrecht ? labels(320, 270, "Utrecht 1713: Philipp V. behält Spanien,\ndie Kronen Frankreichs und Spaniens bleiben getrennt.", "lbl tiny strong", "middle", 14) : labels(320, 270, "Blau: Frankreich (4), Spanien (3), Bayern (1)\nRot: England (3), Niederlande (2), Kaiser (3) – vereinfachte Gewichte", "lbl tiny muted", "middle", 14)}`,
    );
  },
  readout: (s) => {
    const b = balance(s);
    if (b.france === b.allies) return "Gleichgewicht: Keine Seite kann die andere beherrschen – genau das meint „balance of power“.";
    if (b.france > b.allies) return `Frankreich und seine Verbündeten wiegen ${b.france - b.allies} Punkte mehr: Eine Hegemonie droht, andere Staaten müssten sich verbünden.`;
    return `Die Allianz wiegt ${b.allies - b.france} Punkte mehr. Auch eine Übermacht der Gegner kann das Gleichgewicht stören – Bündnisse wechselten deshalb immer wieder.`;
  },
};

/* ---------- LB 7: Bauwerke im Vergleich ---------- */

export const BUILDINGS: Record<
  string,
  { label: string; epoch: string; form: string; teilhabe: number; zugang: string; mitte: string; blick: string }
> = {
  theater: { label: "Dionysostheater Athen", epoch: "Antike, 5. Jh. v. Chr.", form: "Demokratie (Polis)", teilhabe: 60, zugang: "Tausende Bürger; Frauen, Sklaven und Fremde ohne politische Rechte.", mitte: "In der Mitte die Orchestra für den Chor – kein Herrschersitz.", blick: "Alle blicken gemeinsam auf die Bühne; niemand thront über den anderen." },
  aachen: { label: "Pfalzkapelle Aachen", epoch: "Mittelalter, um 800", form: "Monarchie (König, Kaiser)", teilhabe: 10, zugang: "Hof, Geistliche und Große; das Volk unten im Erdgeschoss.", mitte: "Unter der Kuppel als Bild des Himmels; der Thron auf der Empore.", blick: "Das Volk blickt zum Herrscher hinauf, der Herrscher zu Gott." },
  wuerzburg: { label: "Residenz Würzburg", epoch: "Neuzeit, 18. Jh.", form: "Absolutismus im Kleinen, Aristokratie", teilhabe: 15, zugang: "Hofstaat und geladene Gäste; die Untertanen zahlten den Bau.", mitte: "Prunkräume und das Bildnis des Fürstbischofs im Zentrum des Freskos.", blick: "Der Gast steigt empor und schaut zum Bild des Landesherrn auf." },
  reichstag: { label: "Reichstagsgebäude Berlin", epoch: "Gegenwart, seit 1999", form: "parlamentarische Demokratie", teilhabe: 90, zugang: "Alle Menschen können die Kuppel nach Anmeldung kostenlos besuchen.", mitte: "Im Zentrum sitzen die gewählten Abgeordneten im Plenarsaal.", blick: "Die Besucher schauen von oben auf ihre Vertreter herab." },
};

export const bauwerkeVergleich: LabDef = {
  title: "Bauwerke als Ausdruck politischen Denkens",
  prompt:
    "Wähle ein Bauwerk und ein Kriterium. Wo steht das Volk – und welches Verständnis von Herrschaft zeigt der Bau?",
  init: () => ({ bau: "ueberblick", kriterium: "zugang", seenBauten: "" }),
  controls: () => [
    { type: "choice", key: "bau", label: "Bauwerk", options: [{ value: "ueberblick", label: "Überblick" }, ...Object.entries(BUILDINGS).map(([value, b]) => ({ value, label: b.label }))] },
    { type: "choice", key: "kriterium", label: "Kriterium", options: [{ value: "zugang", label: "Wer darf hinein?" }, { value: "mitte", label: "Was ist im Zentrum?" }, { value: "blick", label: "Wer blickt zu wem auf?" }] },
  ],
  set: (state, key, value) => {
    state[key] = value;
    if (key === "bau") remember(state, "seenBauten", String(value));
  },
  goals: (s) => [
    { text: "Antike und Gegenwart vergleichen: Theater und Reichstag ansehen", met: seen(s, "seenBauten", "theater") && seen(s, "seenBauten", "reichstag") },
    { text: "Den Bau finden, in dem der Herrscher zwischen Volk und Gott steht", met: str(s, "bau") === "aachen" && str(s, "kriterium") === "blick" },
    { text: "Alle vier Bauwerke untersuchen", met: Object.keys(BUILDINGS).every((k) => seen(s, "seenBauten", k)) },
  ],
  draw: (s) => {
    const sel = str(s, "bau");
    const keys = Object.keys(BUILDINGS);
    const icon = (k: string, x: number) => {
      const on = sel === k;
      const stroke = on ? "var(--accent)" : "var(--f-line)";
      const art =
        k === "theater"
          ? `<path d="M${x - 40} 120A40 40 0 0 1 ${x + 40} 120Z" fill="var(--f-stone)"/><path d="M${x - 24} 120A24 24 0 0 1 ${x + 24} 120Z" fill="var(--f-sand)"/>`
          : k === "aachen"
            ? `<polygon points="${x - 30},120 ${x - 30},90 ${x - 18},74 ${x + 18},74 ${x + 30},90 ${x + 30},120" fill="${C.purple}"/><path d="M${x - 18} 74Q${x} 50 ${x + 18} 74" fill="var(--f-sky)"/>`
            : k === "wuerzburg"
              ? `<rect x="${x - 44}" y="84" width="88" height="36" fill="#f4e6c8" stroke="var(--f-ink)"/><path d="M${x - 16} 84L${x} 68L${x + 16} 84Z" fill="var(--f-stone)"/>`
              : `<rect x="${x - 44}" y="90" width="88" height="30" fill="var(--f-stone)" stroke="var(--f-ink)"/><path d="M${x - 22} 90Q${x} 56 ${x + 22} 90" fill="var(--f-sky)" stroke="var(--f-ink)"/>`;
      return `<rect x="${x - 70}" y="40" width="140" height="110" rx="12" fill="var(--surface)" stroke="${stroke}" stroke-width="${on ? 4 : 1.5}"/>${art}${labels(x, 136, BUILDINGS[k].label.replace(" ", "\n"), "lbl tiny strong", "middle", 11)}`;
    };
    const scale = keys
      .map((k) => {
        const x = 80 + (BUILDINGS[k].teilhabe / 100) * 480;
        const on = sel === k;
        return `<circle cx="${f1(x)}" cy="200" r="${on ? 11 : 7}" fill="${on ? "var(--accent)" : C.slate}" stroke="var(--f-halo)" stroke-width="2"/>`;
      })
      .join("");
    const info = sel === "ueberblick" ? null : BUILDINGS[sel];
    return svg(
      640,
      300,
      `Vergleich von vier Bauwerken, ausgewählt: ${info ? info.label : "Überblick"}`,
      `${panel(8, 8, 624, 284, "panel-bg")}
       ${keys.map((k, i) => icon(k, 90 + i * 153)).join("")}
       <rect x="80" y="194" width="480" height="12" rx="6" fill="var(--f-stone)"/>
       ${scale}
       ${label(80, 226, "wenig Teilhabe des Volkes", "lbl tiny", "start")}
       ${label(560, 226, "viel Teilhabe", "lbl tiny", "end")}
       ${info ? `${label(320, 252, `${info.epoch} · ${info.form}`, "lbl small strong")}` : label(320, 252, "Wähle ein Bauwerk.", "lbl small strong")}
       ${label(320, 278, "Skala: Einschätzung im Vergleich, keine Messung", "lbl tiny muted")}`,
    );
  },
  readout: (s) => {
    const sel = str(s, "bau");
    if (sel === "ueberblick") return "Vier Bauwerke aus Antike, Mittelalter, Neuzeit und Gegenwart – jedes zeigt ein anderes Verhältnis von Herrschern und Volk.";
    const b = BUILDINGS[sel];
    const k = str(s, "kriterium") as "zugang" | "mitte" | "blick";
    return `${b.label} (${b.epoch}): ${b[k]}`;
  },
};

