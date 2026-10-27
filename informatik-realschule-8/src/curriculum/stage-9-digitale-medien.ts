import { caseLab } from "../lab/case-lab";
import { open, rect, text } from "../lab/svg";
import type { LabDefinition, LabValues, Stage } from "../model/types";
import { cases, cc, lesson } from "./helpers";

const id = "digitale-medien";

// ─── Lab: Geräte-Check ───────────────────────────────────────────────────

const onOff = (off: string, on: string) => [
  { value: 0, label: off },
  { value: 1, label: on },
];

const daten = (v: LabValues) => v.location + v.perms;
const gesundheit = (v: LabValues) => v.limit + v.notify;
const umwelt = (v: LabValues) => v.device + v.waste;

const geraeteLab: LabDefinition = {
  kind: "geraete-check",
  title: "Das eigene Smartphone einstellen",
  intro: "Jede Einstellung schützt Daten, Gesundheit oder Umwelt. Stelle das Smartphone so ein, dass alle drei Bereiche geschützt sind.",
  params: [
    { key: "location", type: "choice", label: "Standortzugriff der Apps", options: onOff("immer erlaubt", "nur beim Nutzen, sonst aus"), value: 0 },
    { key: "perms", type: "choice", label: "App-Berechtigungen (Kamera, Kontakte)", options: onOff("alle erlaubt", "nur die nötigen"), value: 0 },
    { key: "limit", type: "choice", label: "Bildschirmzeit", options: onOff("unbegrenzt, auch nachts", "Tageslimit und Ruhezeit ab 21 Uhr"), value: 0 },
    { key: "notify", type: "choice", label: "Benachrichtigungen", options: onOff("jede sofort mit Ton", "gebündelt, ohne Ton"), value: 0 },
    { key: "device", type: "choice", label: "Altes Gerät", options: onOff("jedes Jahr ein neues", "reparieren und lange nutzen"), value: 0 },
    { key: "waste", type: "choice", label: "Entsorgung", options: onOff("in den Hausmüll", "Wertstoffhof oder Rücknahme"), value: 0 },
  ],
  readouts: [
    { key: "d", label: "Datenschutz", emphasis: true, compute: (v) => `${daten(v)} von 2` },
    { key: "g", label: "Gesundheit", compute: (v) => `${gesundheit(v)} von 2` },
    { key: "u", label: "Umwelt", compute: (v) => `${umwelt(v)} von 2` },
  ],
  goals: [
    { id: "daten", text: "Schütze deine persönlichen Daten: Standort und Berechtigungen.", check: (v) => daten(v) === 2 },
    { id: "gesundheit", text: "Schütze deine Gesundheit: Bildschirmzeit und Benachrichtigungen.", check: (v) => gesundheit(v) === 2 },
    { id: "umwelt", text: "Schone die Umwelt: Nutzungsdauer und Entsorgung.", check: (v) => umwelt(v) === 2 },
  ],
  view: {
    render(v) {
      let out = open("Schutzbereiche des Smartphones");
      const areas = [
        { name: "Daten", score: daten(v), icon: "🔒" },
        { name: "Gesundheit", score: gesundheit(v), icon: "💤" },
        { name: "Umwelt", score: umwelt(v), icon: "🌱" },
      ];
      areas.forEach((a, i) => {
        const x = 30 + i * 160;
        out += rect(x, 40, 140, 200, "lab-shape", 'rx="14"');
        out += rect(x, 240 - a.score * 100, 140, a.score * 100, a.score === 2 ? "lab-fill-ok" : a.score === 1 ? "lab-fill-a" : "lab-fill-b", 'rx="14"');
        out += text(x + 70, 30, `${a.icon} ${a.name}`, "lab-text", "middle");
        out += text(x + 70, 270, `${a.score} von 2`, "lab-text-big", "middle");
      });
      return `${out}</svg>`;
    },
  },
};

// ─── Lab: Datenspuren ────────────────────────────────────────────────────

function methods(v: LabValues): string[] {
  const list: string[] = [];
  if (v.cookies === 0) list.push("Tracking-Cookies");
  if (v.login === 0) list.push("Anmeldung mit Konto");
  if (v.gps === 0) list.push("Standortdaten");
  if (v.fp === 0) list.push("Browser-Fingerprinting");
  return list;
}

const spurenLab: LabDefinition = {
  kind: "datenspuren",
  title: "Wie erkennt mich ein Online-Shop wieder?",
  intro:
    "Ein Online-Shop möchte dich wiedererkennen, um dir gezielt Werbung zu zeigen. Ändere deine Einstellungen und sieh, welche Methoden ihm noch bleiben.",
  params: [
    { key: "cookies", type: "choice", label: "Cookie-Banner", options: onOff("alle akzeptieren", "nur notwendige"), value: 0 },
    { key: "login", type: "choice", label: "Beim Stöbern", options: onOff("mit Konto angemeldet", "nicht angemeldet"), value: 0 },
    { key: "gps", type: "choice", label: "Standortfreigabe", options: onOff("erlaubt", "abgelehnt"), value: 0 },
    { key: "fp", type: "choice", label: "Schutz vor Fingerprinting im Browser", options: onOff("aus", "an"), value: 0 },
  ],
  readouts: [
    { key: "m", label: "Methoden zur Zuordnung", emphasis: true, compute: (v) => methods(v).join(", ") || "keine der gezeigten Methoden" },
    { key: "n", label: "Spuren", compute: (v) => `${methods(v).length} von 4` },
  ],
  goals: [
    { id: "cookies", text: "Lehne Tracking-Cookies ab.", check: (v) => v.cookies === 1 },
    {
      id: "fingerprint",
      text: "Zeige: Ohne Cookies, Konto und Standort erkennt dich Fingerprinting trotzdem wieder.",
      check: (v) => v.cookies === 1 && v.login === 1 && v.gps === 1 && v.fp === 0,
    },
    { id: "sparsam", text: "Hinterlasse keine der vier Spuren.", check: (v) => methods(v).length === 0 },
  ],
  view: {
    render(v) {
      let out = open("Datenspuren beim Online-Shop");
      out += rect(30, 30, 140, 90, "lab-fill-a", 'rx="14"');
      out += text(100, 82, "Du", "lab-text-big", "middle");
      out += rect(350, 30, 140, 90, "lab-fill-c", 'rx="14"');
      out += text(420, 82, "Shop", "lab-text-big", "middle");
      const all = ["Tracking-Cookies", "Anmeldung mit Konto", "Standortdaten", "Browser-Fingerprinting"];
      const active = methods(v);
      all.forEach((name, i) => {
        const y = 150 + i * 42;
        const on = active.includes(name);
        out += rect(60, y, 400, 34, on ? "lab-fill-b" : "lab-shape", 'rx="10"');
        out += text(80, y + 22, `${on ? "👣" : "✓"} ${name}`, on ? "lab-text" : "lab-text-muted");
      });
      return `${out}</svg>`;
    },
  },
};

export const STAGE_DIGITALE_MEDIEN: Stage = {
  id,
  stageNumber: 9,
  title: "Digitale Medien",
  subtitle: "Werkzeuge wählen, fair interagieren, sich schützen, Datenspuren verstehen",
  icon: "📱",
  accent: "#a16207",
  badgeTitle: "Medienprofi",
  lehrplanLabel: "IT 1.9 · ca. 14 Std.",
  module: "1.9",
  lessons: [
    lesson(id, "1.9", 1, {
      id: "it8-digitale-werkzeuge",
      title: "Digitale Werkzeuge zum Kommunizieren, Zusammenarbeiten und Lernen",
      subtitle: "Cloud, Kollaborationsplattform, E-Learning und künstliche Intelligenz zielgerichtet wählen",
      why: "Ein gemeinsames Referat, eine Videokonferenz, ein Lernvideo, ein KI-Chatbot: Wer das passende Werkzeug wählt und seine Grenzen kennt, arbeitet besser.",
      html: `<p><strong>Cloud-Computing</strong> heißt: Daten und Programme liegen auf Servern im Internet. Vorteil: von jedem Gerät erreichbar, Geräteverlust kostet keine Daten. Konsequenzen: Du brauchst Internet und gibst Daten an einen Anbieter. <strong>Kollaborationsplattformen</strong> (gemeinsame Online-Dokumente, Tafeln, Chats) erlauben, gleichzeitig an einem Dokument zu arbeiten; der Versionsverlauf zeigt, wer was geändert hat. <strong>E-Learning-Angebote</strong> (Lernplattform, Lernvideos, Übungsprogramme) erlauben Lernen im eigenen Tempo.</p>
<p><strong>Künstliche Intelligenz</strong> wie Chatbots kann Texte formulieren, Ideen liefern und erklären. Sie kann aber überzeugend <strong>falsche Antworten</strong> erzeugen, nennt oft keine verlässlichen Quellen und verarbeitet deine Eingaben. Darum gilt: Ergebnisse prüfen, keine persönlichen Daten eingeben, eigene Leistung und KI-Hilfe offen kennzeichnen, wie es die Schule verlangt. Wähle das Werkzeug <strong>zielgerichtet</strong>: Was ist die Aufgabe, wer arbeitet mit, welche Daten sind betroffen?</p>
<div class="example"><strong>Beispiel:</strong> Vier Schülerinnen schreiben ein Referat. Sie gliedern es in einem gemeinsamen Online-Dokument auf der Schulplattform, besprechen sich per Videokonferenz und lassen sich von einem Chatbot drei Ideen für einen Einstieg geben. Die Fakten prüfen sie in zwei seriösen Quellen.</div>
<div class="merke"><strong>Merke:</strong> Werkzeug nach Aufgabe wählen. Cloud: überall verfügbar, aber abhängig von Internet und Anbieter. KI-Antworten immer prüfen, keine persönlichen Daten eingeben, KI-Hilfe kennzeichnen.</div>`,
      rule: "Aufgabe → passendes Werkzeug; Vorteile und Konsequenzen abwägen; KI-Ergebnisse prüfen und kennzeichnen",
      terms: [
        ["Cloud-Computing", "Daten und Programme auf Servern im Internet", "überall verfügbar; abhängig von Internet und Anbieter"],
        ["Kollaboration · E-Learning · KI", "gemeinsam bearbeiten · digital lernen · Programme, die z. B. Texte erzeugen", "KI kann falsche Antworten überzeugend formulieren"],
      ],
      quiz: [
        "Ein KI-Chatbot nennt dir eine Jahreszahl für dein Referat. Was tust du?",
        "Die Angabe in einer verlässlichen Quelle prüfen",
        "Sie ungeprüft übernehmen, weil KI nicht irrt",
        "Den Chatbot so lange fragen, bis er dieselbe Zahl zweimal nennt",
        "KI-Antworten können falsch sein; erst eine unabhängige Quelle macht die Angabe verlässlich.",
      ],
      lab: caseLab({
        kind: "werkzeugwahl",
        title: "Welches Werkzeug passt?",
        intro: "Wähle für jede Aufgabe das passende digitale Werkzeug.",
        categories: ["gemeinsames Online-Dokument", "Videokonferenz", "Cloud-Speicher", "Lernplattform", "KI-Chatbot"],
        cases: [
          { short: "Zu viert am Referat schreiben", text: "Vier Personen schreiben gleichzeitig an einem Referat.", answer: 0, why: "Alle bearbeiten dasselbe Dokument, mit Verlauf.", hint: "Wer arbeitet gleichzeitig woran?" },
          { short: "Krank: Gruppe live sprechen", text: "Ein Gruppenmitglied ist krank und will mit den anderen sprechen und sie sehen.", answer: 1, why: "Bild und Ton in Echtzeit.", hint: "Sehen und hören in Echtzeit?" },
          { short: "Fotos auf allen Geräten", text: "Deine Fotos sollen auf Handy und Laptop verfügbar sein.", answer: 2, why: "Daten liegen zentral, überall abrufbar.", hint: "Wo liegen die Dateien?" },
          { short: "Aufgaben der Lehrkraft abrufen", text: "Die Lehrkraft stellt Aufgaben und Lernvideos für die Woche bereit.", answer: 3, why: "Material und Abgaben der Schule an einem Ort.", hint: "Wo verteilt die Schule Material?" },
          { short: "Ideen für einen Einstieg", text: "Du suchst drei Ideen für den Einstieg in einen Vortrag.", answer: 4, why: "Ideen liefern kann KI; prüfen musst du selbst.", hint: "Welches Werkzeug formuliert Vorschläge?" },
          { short: "Gemeinsames Protokoll", text: "Die Klasse sammelt während einer Exkursion gemeinsam Notizen.", answer: 0, why: "Alle schreiben in ein Dokument.", hint: "Viele schreiben zusammen." },
        ],
        goals: [
          { text: "Wähle die Werkzeuge für Zusammenarbeit und Gespräch.", cases: [0, 1] },
          { text: "Wähle die Werkzeuge für Dateien und Unterrichtsmaterial.", cases: [2, 3] },
          { text: "Ordne alle sechs Aufgaben richtig zu.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "werkzeug-bewerten",
          [
            cc("Was ist ein Vorteil von Cloud-Speicher?", "Dateien sind von jedem Gerät mit Internet erreichbar.", ["Er funktioniert ohne Internet.", "Niemand außer dir kann je darauf zugreifen."], "Die Daten liegen auf Servern, nicht nur auf einem Gerät.", "Wo liegen die Daten?"),
            cc("Was zeigt der Versionsverlauf eines gemeinsamen Dokuments?", "Wer wann was geändert hat", ["Wie viele Seiten gedruckt wurden", "Welche Schriftart die schönste ist"], "So lassen sich Änderungen nachvollziehen und zurücknehmen.", "Was hat sich geändert?"),
            cc("Was ist eine typische Schwäche von KI-Chatbots?", "Sie können falsche Angaben überzeugend formulieren.", ["Sie können keine Sätze bilden.", "Sie antworten immer mit Quellen."], "Die Antwort klingt sicher, ist aber nicht geprüft.", "Klingt sicher heißt nicht stimmt."),
          ],
          [
            cc(
              "Du willst einem KI-Chatbot deinen vollständigen Namen, deine Adresse und dein Zeugnis geben, damit er eine Bewerbung schreibt. Wie bewertest du das?",
              "Keine persönlichen Daten eingeben; Platzhalter nutzen und den Text selbst anpassen.",
              ["Unproblematisch, Chatbots vergessen alles sofort.", "Nötig, sonst funktioniert KI nicht."],
              "Eingaben werden beim Anbieter verarbeitet; Datensparsamkeit gilt auch hier.",
              "Wohin gehen deine Eingaben?",
            ),
            cc(
              "Deine Gruppe speichert das Referat nur in der Cloud. Am Präsentationstag ist das Schul-WLAN gestört. Was hätte geholfen?",
              "Zusätzlich eine Kopie offline auf USB-Stick oder Laptop mitnehmen.",
              ["Nichts, Cloud ist immer erreichbar.", "Das Referat ausdrucken und abfotografieren."],
              "Cloud-Daten brauchen Internet; eine Offline-Kopie macht unabhängig.",
              "Was braucht man, um die Cloud zu erreichen?",
            ),
            cc(
              "Für eine Hausaufgabe lässt Mia einen Chatbot den ganzen Aufsatz schreiben und gibt ihn als eigenen ab. Wie bewertest du das?",
              "Unredlich: Sie gibt fremde Leistung als eigene aus; KI-Hilfe muss gekennzeichnet werden, wie die Schule es regelt.",
              ["In Ordnung, KI ist ein Werkzeug wie ein Taschenrechner.", "In Ordnung, wenn der Aufsatz gut ist."],
              "Die Hausaufgabe soll deine Leistung zeigen; Täuschung bleibt Täuschung.",
              "Wessen Leistung wird bewertet?",
            ),
          ],
        ),
        cases(
          "lernen-online",
          [
            cc("Was ist ein Vorteil von E-Learning-Angeboten?", "Man kann im eigenen Tempo lernen und wiederholen.", ["Man muss nie mehr üben.", "Sie ersetzen jeden Unterricht."], "Lernvideos und Übungen lassen sich anhalten und wiederholen.", "Wer bestimmt das Tempo?"),
            cc("Welches Werkzeug eignet sich, um mit einer Austauschklasse in Frankreich live zu sprechen?", "Videokonferenz", ["Cloud-Speicher", "Tabellenkalkulation"], "Ton und Bild in Echtzeit über das Internet.", "Live sprechen und sehen."),
            cc("Worauf achtest du beim Teilen eines Cloud-Ordners?", "Nur die Personen freigeben, die wirklich Zugriff brauchen.", ["Den Link öffentlich posten.", "Allen Bearbeitungsrechte geben."], "Freigaben sparsam setzen schützt deine Daten.", "Wer soll hinein?"),
          ],
          [
            cc(
              "Euer gemeinsames Dokument wurde versehentlich zur Hälfte gelöscht. Was hilft?",
              "Über den Versionsverlauf eine frühere Fassung wiederherstellen.",
              ["Alles neu schreiben.", "Die Plattform kündigen."],
              "Kollaborationsplattformen speichern frühere Versionen.",
              "Gibt es eine ältere Fassung?",
            ),
            cc(
              "Ein Mitschüler erklärt dir per Videokonferenz die Hausaufgabe und will das Gespräch aufzeichnen. Was gilt?",
              "Nur aufzeichnen, wenn alle Beteiligten vorher zustimmen.",
              ["Aufzeichnen ist immer erlaubt.", "Aufzeichnen ist nur bei Lehrkräften erlaubt."],
              "Gespräch und Bild sind geschützt; ohne Zustimmung keine Aufzeichnung.",
              "Wessen Stimme und Bild werden gespeichert?",
            ),
            cc(
              "Du lernst mit einer kostenlosen Lern-App, die dafür Zugriff auf deine Kontakte verlangt. Was tust du?",
              "Den Zugriff verweigern oder eine App wählen, die nur nötige Daten verlangt.",
              ["Zustimmen, weil die App kostenlos ist.", "Den Kontakten Bescheid sagen und zustimmen."],
              "Eine Lern-App braucht keine Kontakte; kostenlose Apps verdienen oft mit Daten.",
              "Wozu braucht eine Lern-App deine Kontakte?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.9", 2, {
      id: "it8-netiquette",
      title: "Netiquette und Privatsphäre bei digitalen Interaktionen",
      subtitle: "Gesellschaftlich-ethische Normen und Verhaltensregeln für Chats und Netzwerke",
      why: "Im Chat fehlen Stimme und Gesicht. Gemeinsame Regeln sorgen dafür, dass Nachrichten richtig ankommen und niemand verletzt wird.",
      html: `<p>Die <strong>Netiquette</strong> (Netz + Etikette) sind Regeln für respektvollen Umgang im Netz. Dazu gehören: freundlich und höflich bleiben, auch bei Streit; nicht in GROSSBUCHSTABEN schreiben (das wirkt wie Schreien); Ironie kennzeichnen, weil sie schriftlich leicht missverstanden wird; keine Kettenbriefe und keine Nachrichtenflut (Spam); erst denken, dann senden. Viele Klassen erstellen eigene <strong>Verhaltensregeln</strong> für ihren Chat, z. B. Ruhezeiten.</p>
<p>Zu den <strong>gesellschaftlich-ethischen Normen</strong> gehört auch die <strong>Privatsphäre</strong> anderer: Private Nachrichten, Fotos und Sprachnachrichten leitest du nur mit Einverständnis weiter; persönliche Daten anderer veröffentlichst du nicht. Hinter jedem Profil steht ein Mensch: Was du im Gesicht nicht sagen würdest, schreibst du auch nicht.</p>
<div class="example"><strong>Beispiel:</strong> Im Klassenchat schreibt jemand um 23 Uhr „WER HAT DIE MATHEAUFGABEN????“. Besser: am Nachmittag, in normaler Schrift: „Hallo, kann mir jemand sagen, welche Mathe-Aufgaben wir aufhaben? Danke!“</div>
<div class="merke"><strong>Merke:</strong> Freundlich, klar, nicht schreien, Ironie kennzeichnen, keine Kettenbriefe, Ruhezeiten achten. Private Inhalte anderer nur mit Einverständnis weitergeben.</div>`,
      rule: "Netiquette: höflich, keine Großbuchstaben, Ironie kennzeichnen, kein Spam; Privates anderer nur mit Einverständnis weitergeben",
      terms: [
        ["Netiquette", "Regeln für respektvollen Umgang im Netz", "Netz + Etikette"],
        ["Klassenchat-Regeln", "z. B. Ruhezeiten, Thema der Gruppe, kein Weiterleiten privater Inhalte", "gemeinsam vereinbart"],
      ],
      quiz: [
        "Warum sollte man in Chats nicht in GROSSBUCHSTABEN schreiben?",
        "Weil es wie Schreien wirkt",
        "Weil das Programm sonst abstürzt",
        "Weil Großbuchstaben mehr Speicher brauchen als die Nachricht wert ist",
        "Durchgehende Großbuchstaben gelten im Netz als lautes, unhöfliches Schreien.",
      ],
      lab: caseLab({
        kind: "netiquette",
        title: "Netiquette-Check",
        intro: "Prüfe jede Nachricht oder Handlung im Klassenchat.",
        categories: ["hält die Netiquette ein", "verletzt die Netiquette", "verletzt die Privatsphäre anderer"],
        cases: [
          { short: "Freundliche Frage am Nachmittag", text: "„Hallo, weiß jemand, ob morgen Sport ist? Danke!“ um 16 Uhr", answer: 0, why: "Höflich, klar, passende Uhrzeit.", hint: "Ist die Nachricht höflich und passend?" },
          { short: "„DU BIST SO DUMM!!!“", text: "„DU BIST SO DUMM!!!“ als Antwort auf eine Frage", answer: 1, why: "Beleidigend und geschrien.", hint: "Wie wirkt Großschrift mit Beleidigung?" },
          { short: "Privatchat-Screenshot weitergeleitet", text: "Ein Screenshot aus einem privaten Chat mit Lea wird ohne Frage in die Gruppe gestellt.", answer: 2, why: "Leas private Nachricht wird ohne Einverständnis geteilt.", hint: "Wollte Lea das öffentlich machen?" },
          { short: "Kettenbrief „Schick das an 10 …“", text: "„Schick das an 10 Leute, sonst passiert dir was!“", answer: 1, why: "Kettenbriefe setzen unter Druck und fluten Chats.", hint: "Was bewirkt so ein Druck?" },
          { short: "Ironie mit Zwinkersmiley", text: "„Super, schon wieder Mathe ;-)“", answer: 0, why: "Die Ironie ist gekennzeichnet.", hint: "Erkennt man, wie es gemeint ist?" },
          { short: "Handynummer weitergegeben", text: "Jemand postet die Handynummer eines Mitschülers in einer fremden Gruppe.", answer: 2, why: "Persönliche Daten ohne Einverständnis.", hint: "Wem gehört die Nummer?" },
        ],
        goals: [
          { text: "Erkenne die beiden Nachrichten, die die Netiquette einhalten.", cases: [0, 4] },
          { text: "Erkenne beide Verletzungen der Privatsphäre.", cases: [2, 5] },
          { text: "Beurteile alle sechs Fälle richtig.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "netiquette-regeln",
          [
            cc("Wie kennzeichnest du Ironie in einer Chatnachricht?", "Mit einem passenden Emoji oder einem Hinweis", ["Mit Großbuchstaben", "Gar nicht, jeder versteht sie"], "Schriftlich fehlen Tonfall und Mimik; ein Zeichen hilft beim Verstehen.", "Was fehlt im Chat im Vergleich zum Gespräch?"),
            cc("Was tust du mit einem Kettenbrief, der dir Unglück androht?", "Nicht weiterleiten und löschen.", ["An alle Kontakte schicken.", "In jede Gruppe stellen."], "Kettenbriefe sind Druckmittel und Spam; die Drohung ist leer.", "Was passiert, wenn alle weiterleiten?"),
            cc("Was bedeutet das Wort Netiquette?", "Regeln für respektvolles Verhalten im Netz", ["Ein Programm zum Chatten", "Eine Abkürzung für Netzwerkkabel"], "Netz + Etikette = Benimmregeln im Netz.", "Netz + Etikette."),
          ],
          [
            cc(
              "Im Klassenchat entbrennt ein Streit über ein Fußballspiel, die Nachrichten werden beleidigend. Was ist eine gute Reaktion?",
              "Sachlich bleiben, zum Ende des Streits aufrufen und an die vereinbarten Chatregeln erinnern.",
              ["Mit noch schärferen Beleidigungen antworten.", "Allen Beteiligten private Fotos der anderen schicken."],
              "Netiquette heißt, auch im Streit fair zu bleiben; Regeln geben einen Bezugspunkt.",
              "Was beruhigt die Lage?",
            ),
            cc(
              "Deine Klasse will Regeln für den Klassenchat. Welche Regel ist sinnvoll?",
              "Keine Nachrichten zwischen 21 und 7 Uhr, außer in Notfällen.",
              ["Wer nicht innerhalb von 5 Minuten antwortet, wird entfernt.", "Jeder muss jede Nachricht kommentieren."],
              "Ruhezeiten schützen Schlaf und Freizeit aller.",
              "Welche Regel tut allen gut?",
            ),
            cc(
              "Ein Freund schickt dir eine lustige Sprachnachricht. Darfst du sie in die Klassengruppe stellen?",
              "Nur, wenn er vorher zustimmt.",
              ["Ja, weil sie lustig ist.", "Ja, weil er sie dir geschickt hat."],
              "Eine private Nachricht ist für dich bestimmt; die Privatsphäre des Absenders bleibt geschützt.",
              "Für wen war die Nachricht gedacht?",
            ),
          ],
        ),
        cases(
          "werte-im-netz",
          [
            cc("Was bedeutet „Erst denken, dann senden“?", "Vor dem Absenden prüfen, wie die Nachricht bei anderen ankommt.", ["Schnell senden und später löschen.", "Nur nachts senden."], "Einmal gesendet, lässt sich eine Nachricht kaum zurückholen.", "Kann man Gesendetes zurückholen?"),
            cc("Wie reagierst du, wenn du eine Nachricht falsch verstanden hast?", "Nachfragen, wie sie gemeint war.", ["Sofort beleidigt antworten.", "Die Person blockieren, ohne zu fragen."], "Missverständnisse sind im Chat häufig; Nachfragen klärt sie.", "Wie war es gemeint?"),
            cc("Warum gelten im Netz dieselben Werte wie im echten Leben?", "Hinter jedem Profil steht ein echter Mensch mit Gefühlen.", ["Weil das Internet sie verlangt.", "Sie gelten im Netz nicht."], "Worte verletzen auch digital.", "Wer liest deine Nachricht?"),
          ],
          [
            cc(
              "In einem Forum fragt jemand etwas Einfaches. Andere antworten „Google doch selbst, du Noob“. Wie verhältst du dich nach der Netiquette?",
              "Freundlich helfen oder auf eine gute Quelle verweisen.",
              ["Mitlachen und einen weiteren Spruch posten.", "Den Fragenden melden."],
              "Netiquette verlangt Respekt, gerade gegenüber Anfängern.",
              "Wie würdest du behandelt werden wollen?",
            ),
            cc(
              "Bei einem Online-Spiel beleidigt ein Mitspieler dich wiederholt im Chat. Was ist richtig?",
              "Nicht zurückbeleidigen, den Spieler melden und stummschalten oder blockieren.",
              ["Zurückbeleidigen, damit er aufhört.", "Seine echte Adresse herausfinden und posten."],
              "Melden und Blockieren schützen dich, ohne selbst Regeln zu brechen.",
              "Was hält die Regeln ein?",
            ),
            cc(
              "Im Gruppenchat wird über eine Mitschülerin gelästert, die nicht in der Gruppe ist. Wie verhältst du dich?",
              "Nicht mitmachen und deutlich sagen, dass Lästern nicht in Ordnung ist.",
              ["Mitlästern, weil sie es nicht liest.", "Screenshots machen und an die Mitschülerin schicken, um zu provozieren."],
              "Respekt gilt auch gegenüber Abwesenden; Schweigen bestärkt das Lästern.",
              "Würde sie das so wollen?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.9", 3, {
      id: "it8-schutzmassnahmen",
      title: "Daten, Gesundheit und Umwelt schützen",
      subtitle: "Einstellungen an Geräten und Diensten, problematische Aspekte digitaler Umgebungen",
      why: "Digitale Medien können süchtig machen, betrügen und Ressourcen verschwenden. Mit wenigen Einstellungen und Gewohnheiten schützt du dich und die Umwelt.",
      html: `<p><strong>Persönliche Daten</strong> schützt du durch Einstellungen an Geräten, Betriebssystemen, Apps und Diensten: Standortzugriff nur beim Nutzen, nur die nötigen App-Berechtigungen, Sperrbildschirm, private Profile, Updates. <strong>Gesundheit</strong>: Bildschirmzeit begrenzen, Ruhezeiten (vor allem vor dem Schlafen), Benachrichtigungen bündeln, Pausen und Bewegung. Warnzeichen für eine <strong>Sucht</strong> sind etwa: an nichts anderes denken, Schlaf und Freunde vernachlässigen, gereizt ohne Handy.</p>
<p><strong>Umwelt</strong>: Herstellung und Betrieb von Geräten verbrauchen Rohstoffe und Energie (<strong>Ressourcenverschwendung</strong>). Geräte lange nutzen und reparieren, gebraucht kaufen, Altgeräte beim Wertstoffhof oder Händler zurückgeben (nie in den Hausmüll), Streaming-Qualität anpassen. Weitere <strong>problematische Aspekte</strong> sind Gewalt, Betrug (z. B. Fake-Shops), Belästigung, Manipulation und <strong>Desinformation</strong>. Schutz: Angebote kritisch prüfen, Hilfe holen, melden.</p>
<div class="example"><strong>Beispiel:</strong> Ben merkt, dass er nachts aufs Handy schaut und morgens müde ist. Er stellt eine Ruhezeit ab 21 Uhr ein, lädt das Handy außerhalb des Zimmers und bündelt Benachrichtigungen. Sein altes Handy mit Sprung im Display lässt er reparieren statt ein neues zu kaufen.</div>
<div class="merke"><strong>Merke:</strong> Daten: nur nötige Berechtigungen, Standort aus. Gesundheit: Bildschirmzeit und Ruhezeiten. Umwelt: lange nutzen, reparieren, richtig entsorgen.</div>`,
      rule: "Daten: Berechtigungen und Standort sparsam · Gesundheit: Bildschirmzeit, Ruhezeiten · Umwelt: lange nutzen, reparieren, Wertstoffhof",
      terms: [
        ["Problematische Aspekte", "Gewalt · Betrug · Belästigung · Sucht · Manipulation · Desinformation · Ressourcenverschwendung", "erkennen, sich schützen, Hilfe holen"],
        ["Fake-Shop", "gefälschter Online-Shop, der Geld nimmt und nicht liefert", "Warnzeichen: extrem billig, nur Vorkasse, kein Impressum"],
      ],
      quiz: [
        "Wohin gehört ein altes, kaputtes Smartphone?",
        "Zum Wertstoffhof oder in eine Rücknahmestelle des Handels",
        "In den Hausmüll",
        "In die Papiertonne",
        "Altgeräte enthalten wertvolle Rohstoffe und Schadstoffe; sie werden getrennt gesammelt und recycelt.",
      ],
      lab: geraeteLab,
      exercises: [
        cases(
          "massnahme-bereich",
          [
            cc("Welche Einstellung schützt vor allem deine Daten?", "Standortzugriff nur während der Nutzung erlauben", ["Displayhelligkeit erhöhen", "Klingelton ändern"], "So zeichnen Apps nicht ständig auf, wo du bist.", "Was verrät dein Standort?"),
            cc("Was schützt vor allem deine Gesundheit?", "Eine Ruhezeit am Abend", ["Alle App-Berechtigungen erlauben", "Jedes Jahr ein neues Handy"], "Ruhezeiten verbessern den Schlaf.", "Was tut deinem Körper gut?"),
            cc("Was schont vor allem die Umwelt?", "Das Handy reparieren und länger nutzen", ["Jede Nachricht sofort mit Ton anzeigen", "Den Standort immer freigeben"], "Jedes neue Gerät verbraucht Rohstoffe und Energie.", "Was spart Rohstoffe?"),
          ],
          [
            cc(
              "Ein Online-Shop verkauft neue Spielkonsolen für ein Drittel des üblichen Preises, nur gegen Vorkasse, ohne Impressum. Was ist wahrscheinlich?",
              "Ein Fake-Shop: nicht kaufen.",
              ["Ein seriöses Sonderangebot.", "Ein Fehler des Shops, schnell zuschlagen."],
              "Extrem niedriger Preis, nur Vorkasse und fehlendes Impressum sind typische Warnzeichen.",
              "Wer steckt hinter dem Shop?",
            ),
            cc(
              "Ein Video behauptet, ein Lebensmittel heile alle Krankheiten, und wird tausendfach geteilt. Welcher problematische Aspekt liegt vor?",
              "Desinformation",
              ["Ressourcenverschwendung", "Belästigung"],
              "Falsche Informationen, die sich schnell verbreiten, sind Desinformation.",
              "Stimmt die Aussage?",
            ),
            cc(
              "Lena vergisst wegen eines Spiels Hausaufgaben, schläft schlecht und wird ohne Handy schnell gereizt. Was ist ein sinnvoller Schritt?",
              "Feste Spielzeiten vereinbaren und mit Eltern oder einer Beratungsstelle sprechen.",
              ["Nachts weiterspielen, um schneller fertig zu werden.", "Nichts tun, das geht von allein vorbei."],
              "Das sind Warnzeichen einer Sucht; Regeln und Hilfe von außen wirken am besten.",
              "Was zeigen die Warnzeichen?",
            ),
          ],
        ),
        cases(
          "einstellungen",
          [
            cc("Was ist ein Sperrbildschirm mit PIN?", "Ein Schutz, damit Fremde das Handy nicht benutzen können", ["Ein Bildschirmschoner ohne Funktion", "Eine Einstellung für hellere Farben"], "Ohne PIN hat jeder Zugriff auf Fotos und Chats.", "Wer kommt ohne PIN an deine Daten?"),
            cc("Warum bündelt man Benachrichtigungen?", "Damit man nicht ständig abgelenkt wird", ["Damit mehr Werbung kommt", "Damit der Akku schneller leer wird"], "Jede Unterbrechung kostet Konzentration.", "Was passiert bei jedem Piepton?"),
            cc("Was ist eine sparsame Einstellung bei Video-Streaming unterwegs?", "Eine niedrigere Bildqualität wählen", ["Immer höchste Qualität laufen lassen", "Videos im Hintergrund weiterlaufen lassen"], "Weniger Daten heißen weniger Energie und weniger Datenvolumen.", "Brauchst du auf dem Handy 4K?"),
          ],
          [
            cc(
              "Eine Taschenlampen-App will Zugriff auf Kontakte, Mikrofon und Standort. Wie entscheidest du?",
              "Ablehnen, denn eine Taschenlampe braucht diese Daten nicht; notfalls eine andere App nehmen.",
              ["Allem zustimmen, sonst funktioniert sie nicht richtig.", "Zustimmen, weil die App kostenlos ist."],
              "Berechtigungen nur erteilen, wenn sie für die Funktion nötig sind.",
              "Was braucht eine Taschenlampe?",
            ),
            cc(
              "Dein Handy ist drei Jahre alt und funktioniert, nur der Akku hält nicht mehr lange. Was ist die umweltfreundlichste Lösung?",
              "Den Akku tauschen lassen und das Handy weiter nutzen.",
              ["Ein neues Handy kaufen und das alte in den Hausmüll werfen.", "Das alte Handy in der Schublade liegen lassen und ein neues kaufen."],
              "Reparieren verlängert die Nutzungsdauer und spart Rohstoffe.",
              "Was spart Rohstoffe?",
            ),
            cc(
              "Ein Fremder schreibt dir in einem Spiel ständig private Nachrichten und will Fotos. Was tust du?",
              "Nicht antworten, keine Fotos schicken, blockieren, melden und einer Vertrauensperson Bescheid sagen.",
              ["Fotos schicken, damit er aufhört.", "Ihm deine Adresse geben, damit ihr das klären könnt."],
              "Das ist Belästigung; Schutz und Hilfe von Erwachsenen gehen vor.",
              "Was schützt dich?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.9", 4, {
      id: "it8-datenspuren",
      title: "Datenspuren, Datensparsamkeit und digitale Dienstleister",
      subtitle: "Welche Daten du preisgibst, warum Dienste sie auswerten und wie sie dich wiedererkennen",
      why: "Jeder Klick, jeder Standort, jeder Kauf hinterlässt Spuren. Wer weiß, wer sie sammelt und warum, entscheidet bewusster, was er preisgibt.",
      html: `<p>Bei der Nutzung digitaler Angebote gibst du Daten preis: <strong>Konsumgewohnheiten</strong> (was du ansiehst und kaufst), <strong>Standortdaten</strong>, Suchanfragen, Likes, Kontakte. <strong>Datensparsamkeit</strong> heißt, situativ zu entscheiden, welche Daten wirklich nötig sind, und nur diese anzugeben.</p>
<p><strong>Digitale Dienstleister</strong> werten Daten aus und verknüpfen sie. Die <strong>Motivationen</strong> sind unterschiedlich: nützlich, z. B. <strong>optimierte Verkehrsführung</strong> durch anonyme Standortdaten vieler Nutzer (Stauwarnung); geschäftlich, z. B. gezielte Werbung und Beeinflussung des <strong>Kaufverhaltens</strong>; bis hin zur Beeinflussung der <strong>politischen Meinung</strong>. Um Daten einem Nutzer zuzuordnen, nutzen sie <strong>Methoden</strong> wie die Auswertung von <strong>Seitenbesuchen</strong>, das Setzen von <strong>Cookies</strong> (kleine Dateien im Browser mit einer Kennung, die beim nächsten Besuch wieder gesendet wird), die Anmeldung mit einem Konto und <strong>Browser-Fingerprinting</strong>: Aus Merkmalen wie Browserversion, Bildschirmgröße, Schriftarten und Spracheinstellung entsteht ein fast eindeutiger „Fingerabdruck“, auch ohne Cookies.</p>
<div class="example"><strong>Beispiel:</strong> Mia sucht Laufschuhe und lehnt alle Cookies außer den notwendigen ab. Trotzdem sieht sie später Laufschuh-Werbung, weil sie im Shop angemeldet war. Beim nächsten Mal stöbert sie ohne Anmeldung und schaltet den Fingerprinting-Schutz ihres Browsers ein.</div>
<div class="merke"><strong>Merke:</strong> Datensparsam handeln: nur nötige Daten angeben. Dienste ordnen Daten über Cookies, Konten, Seitenbesuche und Fingerprinting zu, zum Nutzen, für Werbung oder zur Beeinflussung.</div>`,
      rule: "Zuordnungsmethoden: Cookies · Anmeldung · Seitenbesuche · Browser-Fingerprinting; Datensparsamkeit: nur Nötiges preisgeben",
      terms: [
        ["Cookie", "kleine Datei im Browser mit einer Kennung", "Tracking-Cookies von Drittanbietern verfolgen dich über viele Seiten"],
        ["Browser-Fingerprinting", "Wiedererkennung über Merkmale von Browser und Gerät", "funktioniert auch ohne Cookies"],
      ],
      quiz: [
        "Wie kann ein Dienst dich wiedererkennen, obwohl du alle Cookies gelöscht hast?",
        "Über Browser-Fingerprinting aus den Merkmalen deines Browsers und Geräts",
        "Gar nicht, ohne Cookies ist man im Netz unsichtbar",
        "Nur über deine Schuhgröße",
        "Browserversion, Bildschirmgröße, Schriftarten und Spracheinstellung ergeben zusammen einen fast eindeutigen Fingerabdruck.",
      ],
      lab: spurenLab,
      exercises: [
        cases(
          "zuordnung",
          [
            cc("Was ist ein Cookie?", "Eine kleine Datei im Browser mit einer Kennung", ["Ein Virus, der Daten löscht", "Ein Bild auf einer Webseite"], "Beim nächsten Besuch wird die Kennung mitgesendet; so erkennt die Seite dich wieder.", "Was speichert der Browser?"),
            cc("Wie wählst du im Cookie-Banner datensparsam?", "Nur notwendige Cookies zulassen", ["Alle akzeptieren", "Das Banner ignorieren und alle Häkchen setzen"], "Notwendige Cookies braucht die Seite zum Funktionieren, Tracking nicht.", "Welche Cookies braucht die Seite wirklich?"),
            cc("Welche Daten verraten deine Konsumgewohnheiten?", "Was du ansiehst und kaufst", ["Dein Lieblingsschulfach im Zeugnis", "Die Farbe deines Rucksacks"], "Klicks und Käufe zeigen, wofür du dich interessierst.", "Was tust du in einem Shop?"),
          ],
          [
            cc(
              "Eine Navi-App nutzt die Standortdaten vieler Fahrer, um Staus zu erkennen. Welche Motivation steckt dahinter?",
              "Optimierte Verkehrsführung, ein Nutzen für alle Fahrer",
              ["Politische Meinungsmache", "Verkauf von Laufschuhen"],
              "Ausgewertete Bewegungsdaten zeigen, wo der Verkehr stockt.",
              "Was hat der Fahrer davon?",
            ),
            cc(
              "Vor einer Wahl siehst du immer wieder Anzeigen, die genau zu deinen Sorgen passen. Was kann dahinterstecken?",
              "Ausgewertete Daten werden genutzt, um deine politische Meinung gezielt zu beeinflussen.",
              ["Reiner Zufall.", "Eine Störung des Bildschirms."],
              "Aus Likes und Seitenbesuchen lassen sich Interessen und Ängste ableiten.",
              "Woher kennt die Anzeige deine Sorgen?",
            ),
            cc(
              "Du lehnst alle Cookies ab, bist aber im sozialen Netzwerk angemeldet, während du andere Seiten besuchst. Was gilt?",
              "Das Netzwerk kann dich trotzdem über deine Anmeldung zuordnen.",
              ["Ohne Cookies kann niemand dich zuordnen.", "Die Anmeldung schützt vor Werbung."],
              "Ein angemeldetes Konto ordnet Aktivitäten eindeutig deiner Person zu.",
              "Weiß der Dienst, wer du bist?",
            ),
          ],
        ),
        cases(
          "datensparsam",
          [
            cc("Was bedeutet Datensparsamkeit?", "Nur die Daten angeben, die wirklich nötig sind", ["Gar keine Geräte nutzen", "Daten auf möglichst viele Dienste verteilen"], "Je weniger Daten, desto weniger kann ausgewertet werden.", "Wie viel ist nötig?"),
            cc("Ein Newsletter verlangt Name, Geburtstag, Adresse und Telefonnummer. Was ist nötig?", "Nur die E-Mail-Adresse", ["Alle Angaben", "Zusätzlich die Ausweisnummer"], "Für einen Newsletter genügt die E-Mail-Adresse.", "Wohin wird der Newsletter geschickt?"),
            cc("Warum sind kostenlose Apps oft nicht wirklich kostenlos?", "Sie verdienen mit den Daten ihrer Nutzer, z. B. für Werbung.", ["Sie werden vom Staat bezahlt.", "Sie kosten nachträglich immer Geld."], "Daten sind für Werbung wertvoll.", "Womit bezahlst du?"),
          ],
          [
            cc(
              "Bei einem Gewinnspiel sollst du Name, Adresse, Geburtsdatum und deine Hobbys angeben. Was ist wahrscheinlich das Ziel?",
              "Ein Profil für gezielte Werbung zu erstellen.",
              ["Nur den Gewinner zu benachrichtigen.", "Dein Geburtsdatum zu feiern."],
              "Für die Benachrichtigung würde eine E-Mail genügen; die Hobbys dienen der Werbung.",
              "Wofür braucht man deine Hobbys?",
            ),
            cc(
              "Eine Wetter-App will dauerhaft deinen Standort. Wie entscheidest du situativ?",
              "Standort nur bei Nutzung erlauben oder die Stadt von Hand eingeben.",
              ["Dauerhaft erlauben, sonst gibt es kein Wetter.", "Die App den Standort an Werbefirmen geben lassen."],
              "Für das Wetter reicht der ungefähre Ort beim Öffnen.",
              "Braucht die App deinen Standort rund um die Uhr?",
            ),
            cc(
              "Der Browser bietet „Schutz vor Fingerprinting“ an. Was bewirkt das?",
              "Er verschleiert Merkmale, damit dein Browser schwerer wiederzuerkennen ist.",
              ["Er löscht alle deine Dateien.", "Er macht Webseiten schneller."],
              "Gleich aussehende Merkmale vieler Nutzer erschweren die eindeutige Zuordnung.",
              "Was nutzt Fingerprinting?",
            ),
          ],
        ),
      ],
    }),
  ],
};
