import { caseLab } from "../lab/case-lab";
import { open, rect, text } from "../lab/svg";
import type { LabDefinition, LabValues, Stage } from "../model/types";
import { cases, cc, lesson } from "./helpers";

const id = "praesentation";

// ─── Lab: Suchanfrage ────────────────────────────────────────────────────

const RESULTS = [
  { title: "Warum Bienen sterben: Ursachen", site: "umweltbundesamt.de", phrase: true, rezept: false },
  { title: "Bienen sterben: Was Bayern tut", site: "stmuv.bayern.de", phrase: true, rezept: false },
  { title: "Sterben die Bienen? Ein Faktencheck", site: "br.de", phrase: false, rezept: false },
  { title: "Bienen sterben im Winter: Futterrezept", site: "imker-verein.de", phrase: true, rezept: true },
  { title: "Wenn Bienen sterben: Blühflächen in Bayern", site: "lfl.bayern.de", phrase: true, rezept: false },
  { title: "Bienenstich: Rezept, falls die Gäste sterben vor Hunger", site: "backblog.de", phrase: false, rezept: true },
];

function hits(v: LabValues) {
  return RESULTS.filter(
    (r) =>
      (v.phrase === 0 || r.phrase) && (v.minus === 0 || !r.rezept) && (v.site === 0 || r.site.endsWith("bayern.de")),
  );
}

function query(v: LabValues): string {
  return `${v.phrase ? "„Bienen sterben“" : "Bienen sterben"}${v.minus ? " -Rezept" : ""}${v.site ? " site:bayern.de" : ""}`;
}

const sucheLab: LabDefinition = {
  kind: "suchanfrage",
  title: "Eine Suchanfrage verfeinern",
  intro:
    "Du recherchierst für ein Referat zum Bienensterben. Verfeinere die Suchanfrage mit Operatoren und beobachte die Trefferliste.",
  params: [
    { key: "phrase", type: "choice", label: "Anführungszeichen (genaue Wortfolge)", options: [{ value: 0, label: "aus" }, { value: 1, label: "an" }], value: 0 },
    { key: "minus", type: "choice", label: "Minus vor „Rezept“ (ausschließen)", options: [{ value: 0, label: "aus" }, { value: 1, label: "an" }], value: 0 },
    { key: "site", type: "choice", label: "site:bayern.de (nur diese Domain)", options: [{ value: 0, label: "aus" }, { value: 1, label: "an" }], value: 0 },
  ],
  readouts: [
    { key: "q", label: "Suchanfrage", emphasis: true, compute: query },
    { key: "n", label: "Treffer", compute: (v) => hits(v).length },
  ],
  goals: [
    { id: "phrase", text: "Finde nur Seiten mit der genauen Wortfolge „Bienen sterben“.", check: (v) => v.phrase === 1 && v.site === 0 },
    { id: "minus", text: "Schließe Seiten mit Rezepten aus.", check: (v) => v.minus === 1 },
    { id: "bayern", text: "Beschränke die Suche auf Seiten des Freistaats Bayern mit der genauen Wortfolge.", check: (v) => v.site === 1 && v.phrase === 1 },
  ],
  view: {
    render(v) {
      let out = open("Trefferliste einer Suchmaschine");
      out += rect(30, 16, 460, 34, "lab-panel", 'rx="17"');
      out += text(50, 38, `🔍 ${query(v)}`, "lab-text");
      const list = hits(v);
      list.forEach((r, i) => {
        const y = 66 + i * 44;
        out += rect(30, y, 460, 38, "lab-shape", 'rx="8"');
        out += text(44, y + 17, r.title.length > 52 ? `${r.title.slice(0, 50)}…` : r.title, "lab-text-small");
        out += text(44, y + 32, r.site, "lab-text-muted");
      });
      if (list.length === 0) out += text(260, 120, "keine Treffer", "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
};

// ─── Lab: Creative Commons ───────────────────────────────────────────────

const USES = ["unverändert in der Schulpräsentation", "bearbeitet in der Online-Schülerzeitung", "unverändert auf verkauften T-Shirts"];

function ccName(v: LabValues): string {
  return `CC BY${v.nc ? "-NC" : ""}${v.nd ? "-ND" : ""}${v.sa ? "-SA" : ""}`;
}

function allowed(v: LabValues): string {
  if (v.nd && v.sa) return "Diese Kombination gibt es nicht: ND verbietet Bearbeitungen, SA regelt Bearbeitungen.";
  if (v.use === 1 && v.nd) return "✗ nicht erlaubt: ND verbietet Bearbeitungen.";
  if (v.use === 2 && v.nc) return "✗ nicht erlaubt: NC verbietet kommerzielle Nutzung.";
  if (v.use === 1 && v.sa) return "✓ erlaubt, mit Namensnennung; deine Fassung muss wieder unter dieselbe Lizenz.";
  return "✓ erlaubt, mit Namensnennung (Titel, Urheber, Lizenz, Link, Ursprungsort).";
}

const ccLab: LabDefinition = {
  kind: "cc-lizenz",
  title: "Creative-Commons-Lizenzen prüfen",
  intro:
    "Ein Foto steht unter einer CC-Lizenz. BY (Namensnennung) ist immer dabei. Kombiniere die Bausteine und prüfe, ob deine geplante Nutzung erlaubt ist.",
  params: [
    { key: "nc", type: "choice", label: "NC: nicht kommerziell", options: [{ value: 0, label: "nein" }, { value: 1, label: "ja" }], value: 1 },
    { key: "nd", type: "choice", label: "ND: keine Bearbeitung", options: [{ value: 0, label: "nein" }, { value: 1, label: "ja" }], value: 1 },
    { key: "sa", type: "choice", label: "SA: Weitergabe unter gleichen Bedingungen", options: [{ value: 0, label: "nein" }, { value: 1, label: "ja" }], value: 0 },
    { key: "use", type: "choice", label: "Deine Nutzung", options: USES.map((label, value) => ({ value, label })), value: 0 },
  ],
  readouts: [
    { key: "name", label: "Lizenz", emphasis: true, compute: ccName },
    { key: "ok", label: "Nutzung", compute: allowed },
  ],
  goals: [
    { id: "shirt", text: "Wähle eine Lizenz, unter der du das Foto auf verkaufte T-Shirts drucken darfst.", check: (v) => v.use === 2 && v.nc === 0 && !(v.nd && v.sa) },
    { id: "nd", text: "Zeige: Unter einer ND-Lizenz darfst du keine bearbeitete Fassung veröffentlichen.", check: (v) => v.use === 1 && v.nd === 1 && v.sa === 0 },
    { id: "sa", text: "Finde eine Lizenz, bei der deine bearbeitete Fassung wieder unter derselben Lizenz stehen muss.", check: (v) => v.use === 1 && v.sa === 1 && v.nd === 0 },
  ],
  view: {
    render(v) {
      let out = open("Lizenzbausteine");
      const blocks = [
        { label: "BY", on: true, note: "Namen nennen" },
        { label: "NC", on: v.nc === 1, note: "nicht kommerziell" },
        { label: "ND", on: v.nd === 1, note: "nicht bearbeiten" },
        { label: "SA", on: v.sa === 1, note: "gleiche Lizenz" },
      ];
      blocks.forEach((b, i) => {
        const x = 40 + i * 116;
        out += rect(x, 30, 100, 80, b.on ? "lab-fill-a" : "lab-shape", 'rx="12"');
        out += text(x + 50, 70, b.label, "lab-text-big", "middle");
        out += text(x + 50, 96, b.note, "lab-text-small", "middle");
      });
      out += text(260, 160, ccName(v), "lab-text-big", "middle");
      out += text(260, 196, `Nutzung: ${USES[v.use]}`, "lab-text", "middle");
      const verdict = allowed(v);
      out += rect(30, 220, 460, 60, verdict.startsWith("✓") ? "lab-fill-ok" : "lab-fill-b", 'rx="12"');
      out += text(260, 256, verdict.length > 70 ? `${verdict.slice(0, 68)}…` : verdict, "lab-text-small", "middle");
      return `${out}</svg>`;
    },
  },
};

// ─── Lab: Foliengestaltung ───────────────────────────────────────────────

const CONTRASTS = ["dunkle Schrift auf hellem Grund", "helle Schrift auf dunklem Grund", "gelbe Schrift auf weißem Grund"];

const readable = (v: LabValues) => v.size >= 24 && v.contrast !== 2;
const compact = (v: LabValues) => v.lines <= 6 && v.style === 0;

const folieLab: LabDefinition = {
  kind: "foliengestaltung",
  title: "Eine Folie gestalten",
  intro: "Stelle Schriftgrad, Zeilenzahl, Farbkontrast und Textform ein. Kann man die Folie aus der letzten Reihe lesen?",
  params: [
    { key: "size", type: "range", label: "Schriftgrad", unit: "pt", min: 12, max: 40, step: 2, value: 14 },
    { key: "lines", type: "range", label: "Textzeilen", unit: "", min: 2, max: 14, step: 1, value: 12 },
    { key: "contrast", type: "choice", label: "Farbkontrast", options: CONTRASTS.map((label, value) => ({ value, label })), value: 2 },
    { key: "style", type: "choice", label: "Textform", options: [{ value: 0, label: "Stichpunkte" }, { value: 1, label: "ganze Sätze" }], value: 1 },
  ],
  readouts: [
    { key: "read", label: "Lesbarkeit", emphasis: true, compute: (v) => (readable(v) ? "✓ aus der letzten Reihe lesbar" : v.size < 24 ? "Schrift zu klein" : "zu wenig Kontrast") },
    { key: "load", label: "Textmenge", compute: (v) => (compact(v) ? "✓ übersichtlich" : v.style === 1 ? "Vorlesetext statt Stichpunkte" : "zu viele Zeilen") },
  ],
  goals: [
    { id: "lesbar", text: "Mache die Folie aus der letzten Reihe lesbar.", check: readable },
    { id: "knapp", text: "Beschränke dich auf höchstens sechs Zeilen in Stichpunkten.", check: compact },
    { id: "alles", text: "Erfülle alle Gestaltungsregeln: lesbar, kontrastreich, knapp.", check: (v) => readable(v) && compact(v) },
  ],
  view: {
    render(v) {
      let out = open("Präsentationsfolie");
      const bg = v.contrast === 1 ? "#1e293b" : "#ffffff";
      out += `<rect x="40" y="20" width="440" height="290" rx="8" style="fill:${bg};stroke:#94a3b8" />`;
      const fill = v.contrast === 2 ? "#facc15" : v.contrast === 1 ? "#ffffff" : "#111827";
      out += `<text x="64" y="58" style="font-size:22px;font-weight:700;fill:${fill}">Bienen in Gefahr</text>`;
      const lineH = Math.max(12, v.size * 0.55);
      const shown = Math.min(v.lines, Math.floor(220 / lineH));
      for (let i = 0; i < shown; i++) {
        const words = v.style === 0 ? "• Stichpunkt" : "Dies ist ein ganzer Satz, den man vorliest.";
        out += `<text x="64" y="${(84 + i * lineH).toFixed(1)}" style="font-size:${(v.size * 0.5).toFixed(1)}px;fill:${fill}">${words}</text>`;
      }
      if (shown < v.lines) out += text(260, 302, `… ${v.lines - shown} Zeilen passen nicht mehr auf die Folie`, "lab-text-bad", "middle");
      return `${out}</svg>`;
    },
  },
};

export const STAGE_PRAESENTATION: Stage = {
  id,
  stageNumber: 7,
  title: "Informationsbeschaffung und -präsentation",
  subtitle: "Recherchieren, Quellen bewerten, Urheberrecht beachten, präsentieren",
  icon: "🎤",
  accent: "#ea580c",
  badgeTitle: "Präsentationsprofi",
  lehrplanLabel: "IT 1.7 · ca. 14 Std.",
  module: "1.7",
  lessons: [
    lesson(id, "1.7", 1, {
      id: "it8-recherche",
      title: "Gezielt recherchieren und Quellen bewerten",
      subtitle: "Suchstrategien, Beurteilungskriterien und Stoffsammlung mit Quellenangaben",
      why: "Eine Suchmaschine liefert Millionen Treffer. Wer gezielt sucht und Quellen prüft, findet in kurzer Zeit verlässliche Informationen.",
      html: `<p>Gute <strong>Suchstrategien</strong> sparen Zeit: Wähle wenige, treffende <strong>Suchbegriffe</strong>. Mit <strong>Anführungszeichen</strong> („Bienen sterben“) suchst du die genaue Wortfolge, ein <strong>Minus</strong> vor einem Wort (−Rezept) schließt Seiten mit diesem Wort aus, <strong>site:</strong> beschränkt die Suche auf eine Domain (site:bayern.de). In einem langen Text findest du ein Wort mit der <strong>Textsuche</strong> (Strg + F).</p>
<p>Nicht jede Quelle ist verlässlich. Prüfe den <strong>Wahrheitsgehalt und die Qualität</strong>: Wer ist der Urheber (Impressum, Fachleute, Behörde)? Wie <strong>aktuell</strong> ist die Seite? Werden <strong>Belege</strong> und Quellen genannt? Will die Seite informieren oder etwas verkaufen? Bestätigen <strong>andere unabhängige Quellen</strong> die Aussage? Sammle die Ergebnisse in einer <strong>strukturierten Stoffsammlung</strong> und notiere zu jeder Information die <strong>Quellenangabe</strong>: Autor, Titel, Adresse (URL) und Abrufdatum.</p>
<div class="example"><strong>Beispiel:</strong> Ein Blog behauptet ohne Belege, Handystrahlung töte Bienen. Das Umweltbundesamt nennt mit Studien andere Hauptursachen. Du übernimmst die belegte Aussage und notierst: Umweltbundesamt, „Bienen und Insekten“, umweltbundesamt.de, abgerufen am 27.10.2026.</div>
<div class="merke"><strong>Merke:</strong> „…“ genaue Wortfolge, − ausschließen, site: eine Domain. Quelle prüfen: Urheber, Aktualität, Belege, Absicht, Vergleich. Jede Information mit Quelle notieren.</div>`,
      rule: "Suche: „genaue Wortfolge“ · −ausschließen · site:domain; Quelle prüfen: Urheber, Aktualität, Belege, Absicht, Vergleich",
      terms: [
        ["Suchoperatoren", "„…“ · − · site:", "genaue Wortfolge · Wort ausschließen · nur eine Domain"],
        ["Quellenangabe", "Autor, Titel, URL, Abrufdatum", "zu jeder Information in der Stoffsammlung"],
      ],
      quiz: [
        "Woran erkennst du am ehesten, ob eine Internetseite verlässlich ist?",
        "Am erkennbaren Urheber, an Belegen und daran, dass andere Quellen die Aussage bestätigen",
        "Daran, dass sie bei der Suche ganz oben steht",
        "An vielen Bildern und Ausrufezeichen",
        "Die Reihenfolge der Treffer sagt nichts über die Qualität; Urheber, Belege und Vergleich schon.",
      ],
      lab: sucheLab,
      exercises: [
        cases(
          "suchoperator",
          [
            cc("Du suchst Seiten, auf denen genau „Grüner Wasserstoff“ steht. Was gibst du ein?", "„Grüner Wasserstoff“ in Anführungszeichen", ["Grüner −Wasserstoff", "site:Wasserstoff"], "Anführungszeichen erzwingen die genaue Wortfolge.", "Wie hält man Wörter zusammen?"),
            cc("Du suchst Jaguar, das Tier, und bekommst nur Autos. Was hilft?", "Jaguar −Auto", ["„Jaguar Auto“", "Jaguar site:auto.de"], "Das Minus schließt Seiten mit „Auto“ aus.", "Welches Wort soll nicht vorkommen?"),
            cc("Wie findest du in einem langen Webtext schnell das Wort „Pestizid“?", "Mit der Textsuche Strg + F", ["Mit Strg + Z", "Indem du die Seite ausdruckst"], "Strg + F markiert jede Stelle, an der das Wort vorkommt.", "F wie finden."),
          ],
          [
            cc(
              "Für dein Referat suchst du nur Informationen des Bayerischen Kultusministeriums zum Schulsport. Welche Anfrage passt?",
              "Schulsport site:km.bayern.de",
              ["„Schulsport Kultusministerium“ −Bayern", "Schulsport −site"],
              "site: beschränkt die Treffer auf die Domain des Ministeriums.",
              "Wie beschränkt man die Suche auf eine Website?",
            ),
            cc(
              "Eine Seite behauptet: „Forscher beweisen: Schokolade macht schlank!“, ohne Studie und mit Kauflink. Wie bewertest du sie?",
              "Unglaubwürdig: keine Belege, Verkaufsabsicht, Aussage mit anderen Quellen prüfen.",
              ["Glaubwürdig, weil Forscher genannt werden.", "Glaubwürdig, weil sie viele Besucher hat."],
              "Ohne Belege und mit Kaufinteresse ist Vorsicht geboten; erst der Vergleich zeigt, was stimmt.",
              "Wer verdient an der Aussage?",
            ),
            cc(
              "In deiner Stoffsammlung steht ein Zitat ohne Herkunft. Was fehlt, damit du es später nutzen kannst?",
              "Die Quellenangabe mit Urheber, Titel, Adresse und Abrufdatum.",
              ["Eine größere Schrift.", "Ein passendes Bild."],
              "Ohne Quelle kannst du die Aussage weder belegen noch prüfen.",
              "Woher stammt das Zitat?",
            ),
          ],
        ),
        cases(
          "quelle-pruefen",
          [
            cc("Wo findest du auf einer deutschen Webseite, wer für sie verantwortlich ist?", "Im Impressum", ["Im Cookie-Banner", "In der Suchleiste"], "Das Impressum nennt den Anbieter der Seite.", "Pflichtangabe auf deutschen Seiten."),
            cc("Warum ist das Datum eines Artikels wichtig?", "Weil Informationen veralten können.", ["Weil alte Artikel immer falsch sind.", "Weil das Datum die Schriftgröße bestimmt."], "Gerade bei Technik und Zahlen ändert sich viel; prüfe die Aktualität.", "Stimmen Zahlen von 2010 heute noch?"),
            cc("Was ist ein Beleg für eine Aussage?", "Eine nachprüfbare Quelle, z. B. eine Studie oder Statistik.", ["Eine besonders laute Überschrift.", "Viele Likes unter dem Beitrag."], "Belege lassen sich überprüfen; Likes nicht.", "Kann man es nachprüfen?"),
          ],
          [
            cc(
              "Zwei Seiten widersprechen sich bei der Einwohnerzahl Münchens. Wie gehst du vor?",
              "Eine amtliche Quelle wie das Statistische Landesamt prüfen und das Datum vergleichen.",
              ["Die höhere Zahl nehmen.", "Die Zahl weglassen und raten."],
              "Amtliche Statistiken sind verlässlich; unterschiedliche Stände erklären oft den Widerspruch.",
              "Wer zählt die Einwohner offiziell?",
            ),
            cc(
              "Ein Video mit vielen Aufrufen erklärt das Bienensterben. Der Kanal verkauft Nahrungsergänzungsmittel. Was bedeutet das für deine Recherche?",
              "Die Verkaufsabsicht ist ein Warnzeichen; die Aussagen mit unabhängigen Quellen vergleichen.",
              ["Viele Aufrufe beweisen, dass es stimmt.", "Videos sind grundsätzlich unbrauchbar."],
              "Beliebtheit ist kein Qualitätsmerkmal; wer verkaufen will, hat ein Interesse.",
              "Welches Interesse hat der Kanal?",
            ),
            cc(
              "Für eine Stoffsammlung willst du Informationen ordnen. Was ist ein sinnvoller Aufbau?",
              "Nach Unterthemen gliedern und jede Information mit Quelle notieren.",
              ["Alle Texte ohne Ordnung in ein Dokument kopieren.", "Nur Überschriften sammeln, ohne Inhalte."],
              "Eine strukturierte Sammlung macht die spätere Gliederung der Präsentation leicht.",
              "Wie findest du später, was wohin gehört?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.7", 2, {
      id: "it8-urheberrecht-lizenzen",
      title: "Urheberrecht und Lizenzen",
      subtitle: "Fremde Werke in Präsentationen rechtmäßig nutzen, Creative Commons verstehen",
      why: "Ein Bild aus dem Internet ist nicht automatisch frei. Wer die Regeln kennt, darf mehr nutzen, als viele denken, und vermeidet teure Abmahnungen.",
      html: `<p>Das <strong>Urheberrecht</strong> schützt eigene geistige Schöpfungen wie Texte, Fotos, Grafiken, Musik und Videos automatisch, ohne Anmeldung. Wer ein Werk geschaffen hat, entscheidet, wer es nutzen darf. Ein Werk aus dem Internet darfst du deshalb nur verwenden, wenn der Urheber es erlaubt, etwa durch eine <strong>Lizenz</strong>. Kurze Ausschnitte darfst du <strong>zitieren</strong>, wenn du dich damit auseinandersetzt und die Quelle angibst.</p>
<p><strong>Creative-Commons-Lizenzen</strong> (CC) erlauben die Nutzung unter Bedingungen: <strong>BY</strong> Namen des Urhebers nennen (immer dabei), <strong>NC</strong> nur nicht kommerziell, <strong>ND</strong> nicht bearbeiten, <strong>SA</strong> Bearbeitungen unter derselben Lizenz weitergeben. <strong>CC0</strong> verzichtet auf alle Rechte. Für die Quellenangabe hilft die <strong>TULLU-Regel</strong>: Titel, Urheber, Lizenz, Link zur Lizenz, Ursprungsort.</p>
<div class="example"><strong>Beispiel:</strong> Ein Foto „Honigbiene“ von A. Weber steht unter CC BY-SA 4.0. Du darfst es zuschneiden und in deiner Präsentation zeigen. Auf die Folie schreibst du: „Honigbiene“, A. Weber, CC BY-SA 4.0, mit Link zur Lizenz und zur Fundstelle. Dein zugeschnittenes Bild steht dann ebenfalls unter CC BY-SA.</div>
<div class="merke"><strong>Merke:</strong> Fremde Werke nur mit Erlaubnis oder als Zitat mit Quelle. CC: BY nennen, NC nicht kommerziell, ND nicht bearbeiten, SA gleiche Lizenz. Quellenangabe nach TULLU.</div>`,
      rule: "CC-Bausteine: <strong>BY</strong> Namen nennen · <strong>NC</strong> nicht kommerziell · <strong>ND</strong> nicht bearbeiten · <strong>SA</strong> gleiche Lizenz; Angabe nach TULLU",
      terms: [
        ["Urheberrecht", "schützt Werke automatisch; der Urheber bestimmt die Nutzung", "Zitat: kurzer Ausschnitt, Auseinandersetzung, Quelle"],
        ["TULLU", "Titel · Urheber · Lizenz · Link zur Lizenz · Ursprungsort", "Quellenangabe für CC-Material"],
      ],
      quiz: [
        "Ein Bild steht unter CC BY-NC. Darfst du es in deiner Schulpräsentation zeigen?",
        "Ja, mit Namensnennung, weil die Präsentation nicht kommerziell ist.",
        "Nein, CC-Bilder darf man nie verwenden.",
        "Ja, und auch ohne Namensnennung.",
        "BY verlangt die Namensnennung, NC verbietet nur die kommerzielle Nutzung; eine Schulpräsentation ist nicht kommerziell.",
      ],
      lab: ccLab,
      exercises: [
        cases(
          "cc-bausteine",
          [
            cc("Was verlangt der CC-Baustein BY?", "Den Namen des Urhebers zu nennen.", ["Das Werk zu kaufen.", "Das Werk nicht zu verändern."], "BY heißt „by“: von wem das Werk ist.", "Von wem ist das Werk?"),
            cc("Was verbietet der CC-Baustein ND?", "Bearbeitungen des Werks zu veröffentlichen.", ["Die Nutzung in der Schule.", "Die Namensnennung."], "ND = No Derivatives, keine Bearbeitungen.", "No Derivatives."),
            cc("Wie lange musst du warten, bis ein selbst gemachtes Foto urheberrechtlich geschützt ist?", "Gar nicht, der Schutz entsteht automatisch.", ["Bis es angemeldet ist.", "Ein Jahr."], "Das Urheberrecht entsteht mit der Schöpfung, ohne Anmeldung.", "Muss man sein Werk anmelden?"),
          ],
          [
            cc(
              "Du willst ein Foto unter CC BY-ND farblich bearbeiten und in der Online-Schülerzeitung zeigen. Ist das erlaubt?",
              "Nein, ND verbietet die Veröffentlichung einer Bearbeitung; unverändert wäre es erlaubt.",
              ["Ja, weil die Zeitung nicht kommerziell ist.", "Ja, wenn du den Namen weglässt."],
              "ND schließt jede veröffentlichte Bearbeitung aus, unabhängig vom Zweck.",
              "Welcher Baustein regelt Bearbeitungen?",
            ),
            cc(
              "Euer Klassenverein verkauft Kalender mit Fotos. Welche Lizenz erlaubt die Nutzung eines fremden Fotos?",
              "CC BY oder CC BY-SA (ohne NC), mit Namensnennung.",
              ["CC BY-NC, weil der Verein klein ist.", "Jede Lizenz, solange der Kalender schön ist."],
              "Der Verkauf ist kommerziell; NC verbietet das.",
              "Ist ein Verkauf kommerziell?",
            ),
            cc(
              "Du hast ein CC-BY-SA-Bild bearbeitet. Unter welcher Lizenz darfst du deine Fassung weitergeben?",
              "Unter CC BY-SA, also derselben Lizenz.",
              ["Unter jeder beliebigen Lizenz.", "Gar nicht, Bearbeitungen sind verboten."],
              "SA (Share Alike) verlangt dieselbe Lizenz für Bearbeitungen.",
              "Share Alike = gleich teilen.",
            ),
          ],
        ),
        cases(
          "urheberrecht-anwenden",
          [
            cc("Was bedeutet die TULLU-Regel?", "Titel, Urheber, Lizenz, Link zur Lizenz, Ursprungsort angeben", ["Text, Umfang, Layout, Länge, Umbruch", "Tabellen und Listen lesbar umsetzen"], "TULLU fasst die Angaben einer Quellenangabe für CC-Material zusammen.", "Die Buchstaben stehen für die Angaben."),
            cc("Darfst du einen Satz aus einem Buch in deinem Referat zitieren?", "Ja, wörtlich mit Anführungszeichen und Quellenangabe.", ["Nein, Zitate sind verboten.", "Ja, als wären es deine Worte."], "Das Zitatrecht erlaubt kurze Ausschnitte mit Quelle, wenn du dich damit auseinandersetzt.", "Was muss beim Zitat dabei sein?"),
            cc("Was bedeutet CC0?", "Der Urheber verzichtet auf seine Rechte; das Werk ist frei nutzbar.", ["Die Nutzung kostet 0 Cent pro Kopie.", "Man darf das Werk null Mal verwenden."], "CC0 stellt ein Werk so frei wie möglich zur Verfügung.", "Null Bedingungen."),
          ],
          [
            cc(
              "Ein Bild in der Google-Bildersuche hat keinen Lizenzhinweis. Darfst du es in deine öffentliche Präsentation auf der Schulwebsite stellen?",
              "Nein, ohne Erlaubnis oder Lizenz nicht; besser ein Bild mit freier Lizenz suchen.",
              ["Ja, was im Internet steht, ist frei.", "Ja, wenn du es verkleinerst."],
              "Auch ohne Hinweis ist ein Werk urheberrechtlich geschützt.",
              "Gilt das Urheberrecht nur mit Hinweis?",
            ),
            cc(
              "Für deine Präsentation willst du ein Lied als Hintergrundmusik in einem Video auf einer Videoplattform veröffentlichen. Was beachtest du?",
              "Nur Musik mit passender Lizenz verwenden, z. B. CC-Musik mit Namensnennung.",
              ["Jedes Lied ist erlaubt, wenn es kürzer als 30 Sekunden ist.", "Musik ist nicht urheberrechtlich geschützt."],
              "Musik ist geschützt; eine Veröffentlichung braucht eine Lizenz.",
              "Wer hat das Lied geschaffen?",
            ),
            cc(
              "Eine Mitschülerin übernimmt eine ganze Seite aus einem Online-Artikel in ihr Referat, ohne Quelle. Was ist das Problem?",
              "Sie gibt fremde Arbeit als eigene aus und verletzt das Urheberrecht; nötig wären eigene Worte oder ein kurzes Zitat mit Quelle.",
              ["Kein Problem, solange die Seite kostenlos war.", "Kein Problem, wenn sie es vorliest."],
              "Ohne Quelle ist es ein Plagiat; ein Zitat ist auf kurze Ausschnitte beschränkt.",
              "Wessen Text ist es?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.7", 3, {
      id: "it8-praesentation-gestalten",
      title: "Präsentationen planen und gestalten",
      subtitle: "Gliederung mit Mindmap, Funktionen des Präsentationsprogramms, Gestaltungsregeln",
      why: "Eine gute Präsentation ist geplant, bevor die erste Folie entsteht. Klare Folien helfen dem Publikum, statt es abzulenken.",
      html: `<p>Plane deine Präsentation <strong>systematisch</strong>, im Team mit klar verteilten Aufgaben. Sammle Ideen in einer <strong>Mindmap</strong>, ordne sie zu einer <strong>Grobgliederung</strong> (Einleitung, Hauptteil, Schluss) und verfeinere sie zur <strong>Feingliederung</strong> (Folie für Folie). Ein <strong>Präsentationsprogramm</strong> arbeitet mit <strong>Folien</strong>; Layouts und der <strong>Folienmaster</strong> legen Schrift, Farben und Logo für alle Folien einheitlich fest. Übergänge, Animationen und Verknüpfungen (Links zu anderen Folien oder Dateien) strukturieren den Ablauf.</p>
<p><strong>Gestaltungsregeln:</strong> Schrift groß genug (Text mindestens etwa 24 pt), serifenlos, höchstens zwei Schriftarten; starker <strong>Kontrast</strong> (dunkel auf hell oder hell auf dunkel); wenige Farben; <strong>Stichpunkte statt ganzer Sätze</strong>, als Faustregel höchstens sechs bis sieben Zeilen; ein Gedanke pro Folie; Bilder und Diagramme statt Textwüsten; Animationen sparsam.</p>
<div class="example"><strong>Beispiel:</strong> Thema „Bienen in Gefahr“. Mindmap: Ursachen, Folgen, Was wir tun können. Grobgliederung: Einleitung (Bild einer Blühwiese), drei Hauptteile, Schluss mit Appell. Jede Folie hat einen Titel und höchstens fünf Stichpunkte in 28 pt, dunkle Schrift auf hellem Grund.</div>
<div class="merke"><strong>Merke:</strong> Mindmap → Grobgliederung → Feingliederung. Folien: groß, kontrastreich, knapp, einheitlich (Folienmaster).</div>`,
      rule: "Mindmap → Grob- → Feingliederung; Folie: ≥ 24 pt, starker Kontrast, Stichpunkte, höchstens ca. 6 Zeilen",
      terms: [
        ["Folienmaster", "Vorlage, die Schrift, Farben und Logo für alle Folien festlegt", "einheitliches Aussehen mit einer Änderung"],
        ["Grob- und Feingliederung", "Einleitung, Hauptteil, Schluss · Folie für Folie", "entsteht aus der Mindmap"],
      ],
      quiz: [
        "Was macht eine Folie am ehesten gut lesbar?",
        "Große serifenlose Schrift, starker Kontrast und wenige Stichpunkte",
        "Ganze Absätze in kleiner Schrift, damit nichts fehlt",
        "Gelbe Schrift auf weißem Hintergrund",
        "Schriftgröße, Kontrast und Kürze bestimmen, ob das Publikum die Folie in Sekunden erfasst.",
      ],
      lab: folieLab,
      exercises: [
        cases(
          "planen",
          [
            cc("Womit sammelst du zu Beginn Ideen zu einem Thema?", "Mit einer Mindmap", ["Mit dem Folienmaster", "Mit der Druckvorschau"], "Die Mindmap ordnet Ideen um das Thema herum.", "Ideen sammeln und ordnen."),
            cc("Was legt der Folienmaster fest?", "Schrift, Farben und Elemente, die auf allen Folien gleich sind", ["Die Reihenfolge der Vortragenden", "Die Länge des Vortrags"], "Änderungen am Master wirken auf alle Folien.", "Was haben alle Folien gemeinsam?"),
            cc("Welche Teile hat eine Grobgliederung?", "Einleitung, Hauptteil, Schluss", ["Titel, Bild, Fußzeile", "Schriftart, Farbe, Größe"], "Die Grobgliederung ordnet den Vortrag in große Abschnitte.", "Anfang, Mitte, Ende."),
          ],
          [
            cc(
              "Ihr seid zu dritt und habt eine Woche Zeit. Wie plant ihr die Präsentation sinnvoll?",
              "Gemeinsam gliedern, Teilthemen verteilen, einen Folienmaster festlegen und vor dem Termin zusammen proben.",
              ["Jeder macht eigene Folien im eigenen Stil, ohne Absprache.", "Einer macht alles, die anderen lesen vor."],
              "Gemeinsame Gliederung und Master sorgen für einen roten Faden und ein einheitliches Bild.",
              "Wie entsteht ein roter Faden?",
            ),
            cc(
              "Eine Folie enthält einen ganzen Absatz aus dem Lexikon. Wie verbesserst du sie?",
              "Auf wenige Stichpunkte kürzen und den Rest frei erzählen.",
              ["Die Schrift kleiner machen, damit alles passt.", "Den Absatz auf zwei Folien verteilen und vorlesen."],
              "Folien unterstützen den Vortrag; das Publikum soll zuhören, nicht lesen.",
              "Wer soll den Inhalt erzählen: die Folie oder du?",
            ),
            cc(
              "Auf jeder Folie fliegt der Text mit Geräusch herein. Wie wirkt das?",
              "Es lenkt vom Inhalt ab; Animationen nur sparsam und gezielt einsetzen.",
              ["Es hält das Publikum wach und ist immer gut.", "Es ist vorgeschrieben."],
              "Effekte sollen den Ablauf strukturieren, nicht unterhalten.",
              "Worauf achtet das Publikum dann?",
            ),
          ],
        ),
        cases(
          "gestalten",
          [
            cc("Welche Schriftgröße ist für Text auf einer Folie als Faustregel mindestens sinnvoll?", "etwa 24 pt", ["8 pt", "11 pt"], "So ist der Text auch aus der letzten Reihe lesbar.", "Größer als im Heft."),
            cc("Welche Farbkombination ist gut lesbar?", "Dunkelblaue Schrift auf hellem Grund", ["Hellgelbe Schrift auf Weiß", "Rote Schrift auf Grün"], "Starker Hell-Dunkel-Kontrast macht Text lesbar.", "Hell gegen dunkel."),
            cc("Wie viele Gedanken sollte eine Folie zeigen?", "Einen Hauptgedanken", ["Möglichst viele", "Genau zehn"], "Ein Gedanke pro Folie hält die Folie übersichtlich.", "Weniger ist mehr."),
          ],
          [
            cc(
              "Eine Folie nutzt vier Schriftarten und sechs Farben. Was ist die beste Überarbeitung?",
              "Höchstens zwei Schriftarten und ein ruhiges Farbschema über den Folienmaster festlegen.",
              ["Noch eine Schriftart für den Titel ergänzen.", "Jede Zeile in einer anderen Farbe setzen."],
              "Einheitliche Gestaltung wirkt professionell und lenkt nicht ab.",
              "Was macht Folien einheitlich?",
            ),
            cc(
              "Du willst zeigen, wie viel Honig deutsche Imker pro Jahr ernten. Wie stellst du es auf der Folie dar?",
              "Als Diagramm mit kurzer Überschrift statt als Zahlentabelle mit vielen Zeilen.",
              ["Als Absatz mit allen Zahlen.", "Gar nicht, Zahlen gehören nicht auf Folien."],
              "Ein Diagramm macht Zahlen auf einen Blick verständlich.",
              "Was erfasst das Publikum schneller?",
            ),
            cc(
              "Am Ende der Präsentation willst du auf eine Quellenfolie springen, wenn Fragen kommen. Welche Funktion hilft?",
              "Eine Verknüpfung (Link) auf die Quellenfolie.",
              ["Ein Folienübergang mit Drehung.", "Ein größerer Schriftgrad."],
              "Verknüpfungen strukturieren den Ablauf und führen direkt zu anderen Folien.",
              "Wie springt man direkt zu einer Folie?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.7", 4, {
      id: "it8-vortragen",
      title: "Sach- und adressatengerecht präsentieren",
      subtitle: "Vortragstechniken, freies Sprechen, Zeit, Fragen und Rückmeldung",
      why: "Die besten Folien helfen nichts, wenn der Vortrag nicht ankommt. Mit ein paar Techniken sprichst du sicher und überzeugend.",
      html: `<p>Ein Vortrag ist <strong>sachgerecht</strong>, wenn die Inhalte stimmen, belegt und logisch geordnet sind. Er ist <strong>adressatengerecht</strong>, wenn Sprache, Beispiele und Tiefe zum Publikum passen: Für Grundschüler erklärst du anders als für deine Klasse; Fachbegriffe erklärst du beim ersten Auftreten.</p>
<p><strong>Vortragstechniken:</strong> frei sprechen mit <strong>Stichwortkarten</strong> statt ablesen; <strong>Blickkontakt</strong> mit dem Publikum, nicht mit der Wand; laut, deutlich und nicht zu schnell sprechen, Pausen machen; aufrecht stehen und ruhige Gesten; die <strong>Zeit</strong> einhalten (vorher proben); zur Folie zeigen statt sie vorzulesen. Am Ende fasst du zusammen und gibst Raum für <strong>Fragen</strong>. Beim <strong>Feedback</strong> sagst du konkret und freundlich, was gelungen ist und was besser werden kann.</p>
<div class="example"><strong>Beispiel:</strong> Lena erklärt der 5. Klasse das Dualsystem. Sie beginnt mit einer Frage („Wie zählt ein Lichtschalter?“), zeigt Fingerzählen mit zwei Zuständen, spricht langsam und erklärt „Bit“ sofort, als das Wort fällt. Nach acht Minuten fasst sie zusammen und fragt: „Was ist noch unklar?“</div>
<div class="merke"><strong>Merke:</strong> Stichwortkarten statt Ablesen, Blickkontakt, laut und langsam, Zeit einhalten, Fachbegriffe erklären, zum Schluss zusammenfassen und Fragen zulassen.</div>`,
      rule: "frei mit Stichwortkarten · Blickkontakt · laut, langsam, Pausen · Zeit einhalten · adressatengerecht erklären",
      terms: [
        ["Adressatengerecht", "Sprache, Beispiele und Tiefe passen zum Publikum", "Fachbegriffe beim ersten Auftreten erklären"],
        ["Feedback", "konkret, freundlich, mit Verbesserungsvorschlag", "z. B. „Dein Beispiel war anschaulich; sprich am Anfang langsamer.“"],
      ],
      quiz: [
        "Was hilft am meisten, frei vorzutragen?",
        "Stichwortkarten mit den wichtigsten Begriffen",
        "Den ganzen Text wörtlich auf die Folien schreiben",
        "Schnell sprechen, damit man nichts vergisst",
        "Stichworte geben Halt, ohne dass man abliest; so bleibt Blickkontakt mit dem Publikum.",
      ],
      lab: caseLab({
        kind: "vortragsverhalten",
        title: "Hilft das dem Vortrag?",
        intro: "Beurteile jedes Verhalten während einer Präsentation.",
        categories: ["hilft dem Publikum", "stört den Vortrag"],
        cases: [
          { short: "Blickkontakt mit der Klasse", text: "Ben schaut beim Sprechen abwechselnd verschiedene Leute an.", answer: 0, why: "Blickkontakt bindet das Publikum ein.", hint: "Fühlt sich das Publikum angesprochen?" },
          { short: "Folien wörtlich ablesen", text: "Mia liest jede Folie Wort für Wort vor, mit dem Rücken zur Klasse.", answer: 1, why: "Ablesen und Rücken zum Publikum langweilen.", hint: "Wohin schaut Mia?" },
          { short: "Fachbegriff sofort erklären", text: "Tim erklärt „Pixel“ in einem Satz, als das Wort zum ersten Mal fällt.", answer: 0, why: "So können alle folgen.", hint: "Kennt jeder das Wort?" },
          { short: "10 Minuten überzogen", text: "Die Gruppe braucht 20 statt 10 Minuten.", answer: 1, why: "Zeit einhalten heißt: vorher proben.", hint: "Wie lange war geplant?" },
          { short: "Zusammenfassung am Schluss", text: "Lea fasst am Ende die drei wichtigsten Punkte zusammen.", answer: 0, why: "Das sichert das Wichtigste.", hint: "Was bleibt im Kopf?" },
          { short: "Sehr schnell und leise", text: "Ole spricht schnell und leise, um fertig zu werden.", answer: 1, why: "Laut, deutlich, mit Pausen sprechen.", hint: "Versteht man ihn hinten?" },
        ],
        goals: [
          { text: "Erkenne zwei Verhaltensweisen, die dem Publikum helfen.", cases: [0, 2] },
          { text: "Erkenne die drei Störungen.", cases: [1, 3, 5] },
          { text: "Beurteile alle sechs Verhaltensweisen richtig.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "vortragstechnik",
          [
            cc("Wohin schaust du während eines Vortrags vor allem?", "Ins Publikum", ["Auf die Projektionsfläche", "Auf den Boden"], "Blickkontakt zeigt, dass du mit den Zuhörern sprichst.", "Mit wem sprichst du?"),
            cc("Wie bereitest du dich darauf vor, die Zeit einzuhalten?", "Den Vortrag vorher mit Uhr proben.", ["Möglichst schnell sprechen.", "Folien weglassen, wenn die Zeit knapp wird, ohne Plan."], "Nur eine Probe zeigt, wie lange du wirklich brauchst.", "Woher weißt du, wie lange du brauchst?"),
            cc("Was machst du am Ende eines Vortrags?", "Zusammenfassen und Fragen zulassen.", ["Sofort gehen.", "Neue Themen beginnen."], "Die Zusammenfassung sichert das Wichtigste, Fragen klären Unklares.", "Was soll im Gedächtnis bleiben?"),
          ],
          [
            cc(
              "Du stellst dein Informatikreferat Grundschülern vor. Was änderst du gegenüber dem Vortrag in der Klasse?",
              "Einfachere Sprache, alltagsnahe Beispiele und weniger Fachbegriffe, jeder erklärt.",
              ["Mehr Fachbegriffe, damit sie viel lernen.", "Schneller sprechen, weil Kinder ungeduldig sind."],
              "Adressatengerecht heißt: Sprache und Beispiele an das Publikum anpassen.",
              "Wer sitzt vor dir?",
            ),
            cc(
              "Ein Mitschüler fragt etwas, das du nicht weißt. Wie reagierst du sachgerecht?",
              "Ehrlich sagen, dass du es nicht weißt, und anbieten, es nachzuschlagen.",
              ["Irgendetwas erfinden, damit es kompetent wirkt.", "Die Frage ignorieren."],
              "Sachgerecht heißt auch: nur sagen, was stimmt.",
              "Was ist ehrlicher: raten oder nachschlagen?",
            ),
            cc(
              "Nach einem Vortrag sollst du Feedback geben. Welche Rückmeldung ist hilfreich?",
              "„Dein Diagramm war gut verständlich; am Anfang hast du zu schnell gesprochen.“",
              ["„War schlecht.“", "„Alles super“, obwohl du kaum etwas verstanden hast."],
              "Hilfreiches Feedback ist konkret, freundlich und enthält einen Verbesserungsvorschlag.",
              "Kann der Vortragende damit etwas anfangen?",
            ),
          ],
        ),
        cases(
          "nervositaet",
          [
            cc("Was hilft gegen Nervosität vor dem Vortrag?", "Gut vorbereiten und mehrmals laut proben.", ["Erst kurz vorher anfangen zu lernen.", "Den Vortrag auswendig im Kopf durchgehen, nie laut."], "Wer den Ablauf kennt, ist sicherer.", "Was gibt Sicherheit?"),
            cc("Wie stehst du beim Präsentieren?", "Aufrecht, dem Publikum zugewandt", ["Mit verschränkten Armen hinter dem Pult", "Mit dem Rücken zur Klasse"], "Eine offene Haltung wirkt sicher und freundlich.", "Wohin zeigt dein Körper?"),
            cc("Wozu dienen Pausen beim Sprechen?", "Das Publikum kann das Gesagte aufnehmen.", ["Sie verlängern nur den Vortrag.", "Sie zeigen, dass man nichts weiß."], "Kurze Pausen geben Zeit zum Nachdenken und betonen Wichtiges.", "Wer braucht Zeit zum Mitdenken?"),
          ],
          [
            cc(
              "Während deines Vortrags fällt der Beamer aus. Was tust du?",
              "Mit den Stichwortkarten frei weitersprechen und Wichtiges an der Tafel skizzieren.",
              ["Den Vortrag abbrechen.", "Warten, bis jemand den Beamer repariert, und schweigen."],
              "Wer frei spricht, ist von der Technik unabhängig.",
              "Was brauchst du wirklich für deinen Vortrag?",
            ),
            cc(
              "Deine Gruppe hat 10 Minuten, aber bei der Probe 16 Minuten gebraucht. Was ist die beste Lösung?",
              "Inhalte auf das Wichtigste kürzen und erneut proben.",
              ["Beim echten Vortrag schneller sprechen.", "Hoffen, dass niemand auf die Uhr schaut."],
              "Kürzen erhält die Verständlichkeit; schneller sprechen nicht.",
              "Was lässt sich weglassen, ohne dass der rote Faden fehlt?",
            ),
            cc(
              "Ein Teil der Klasse wirkt bei einem Fachbegriff verwirrt. Wie reagierst du?",
              "Kurz innehalten und den Begriff mit einem Beispiel erklären.",
              ["Einfach weitermachen, um die Zeit zu halten.", "Den Begriff schneller wiederholen."],
              "Adressatengerecht vortragen heißt, auf das Publikum zu reagieren.",
              "Woran merkst du, dass etwas unklar ist?",
            ),
          ],
        ),
      ],
    }),
  ],
};
