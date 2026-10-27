import { fmt } from "../exercises/format";
import { caseLab } from "../lab/case-lab";
import { line, open, rect, text } from "../lab/svg";
import type { ExerciseGenerator, LabDefinition, LabValues, Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, textField, withSlips } from "./helpers";

const id = "edv";

// ─── Lab: Ordnerbaum ─────────────────────────────────────────────────────

const LEVEL1 = ["Dokumente", "Bilder", "Schule"];
const LEVEL2 = ["IT", "Mathe", "Ferien"];
const FILES = ["Referat.docx", "Noten.xlsx", "Ausflug.jpg"];
/** Which files really exist, as "Ordner/Unterordner/Datei". */
const TREE = new Set(["Schule/IT/Referat.docx", "Schule/Mathe/Noten.xlsx", "Bilder/Ferien/Ausflug.jpg", "Dokumente/IT/Lebenslauf.docx"]);

const pathOf = (v: LabValues) => `C:\\${LEVEL1[v.l1]}\\${LEVEL2[v.l2]}\\${FILES[v.file]}`;
const exists = (v: LabValues) => TREE.has(`${LEVEL1[v.l1]}/${LEVEL2[v.l2]}/${FILES[v.file]}`);

const dateiLab: LabDefinition = {
  kind: "ordnerbaum",
  title: "Pfade im Ordnerbaum",
  intro: "Das Laufwerk C: ist die Wurzel des Ordnerbaums. Wähle Ordner, Unterordner und Datei und prüfe, ob der absolute Pfad zu einer vorhandenen Datei führt.",
  params: [
    { key: "l1", type: "choice", label: "Ordner", options: LEVEL1.map((label, value) => ({ value, label })), value: 0 },
    { key: "l2", type: "choice", label: "Unterordner", options: LEVEL2.map((label, value) => ({ value, label })), value: 0 },
    { key: "file", type: "choice", label: "Datei", options: FILES.map((label, value) => ({ value, label })), value: 0 },
  ],
  readouts: [
    { key: "path", label: "absoluter Pfad", emphasis: true, compute: pathOf },
    { key: "found", label: "Ergebnis", compute: (v) => (exists(v) ? "✓ Datei gefunden" : "Datei nicht gefunden: Der Pfad stimmt nicht.") },
  ],
  goals: [
    { id: "referat", text: "Finde das Referat für IT.", check: (v) => exists(v) && v.file === 0 },
    { id: "noten", text: "Finde die Notentabelle für Mathe.", check: (v) => exists(v) && v.file === 1 },
    { id: "foto", text: "Finde das Foto vom Ausflug.", check: (v) => exists(v) && v.file === 2 },
  ],
  view: {
    render(v) {
      let out = open("Ordnerbaum von Laufwerk C:");
      out += rect(20, 20, 70, 30, "lab-fill-c", 'rx="6"');
      out += text(55, 40, "C:\\", "lab-text", "middle");
      const tree: Record<string, string[]> = {
        Dokumente: ["IT: Lebenslauf.docx"],
        Bilder: ["Ferien: Ausflug.jpg"],
        Schule: ["IT: Referat.docx", "Mathe: Noten.xlsx"],
      };
      let y = 70;
      LEVEL1.forEach((folder, i) => {
        const active = v.l1 === i;
        out += line(55, 50, 55, y + 15, "lab-grid");
        out += line(55, y + 15, 100, y + 15, "lab-grid");
        out += rect(100, y, 140, 30, active ? "lab-fill-a" : "lab-shape", 'rx="6"');
        out += text(110, y + 20, `📁 ${folder}`, "lab-text-small");
        tree[folder].forEach((entry, k) => {
          const yy = y + 36 + k * 30;
          const [sub] = entry.split(":");
          const subActive = active && LEVEL2[v.l2] === sub;
          out += line(170, y + 30, 170, yy + 12, "lab-grid");
          out += line(170, yy + 12, 260, yy + 12, "lab-grid");
          out += rect(260, yy, 240, 26, subActive ? (exists(v) ? "lab-fill-ok" : "lab-fill-a") : "lab-shape", 'rx="6"');
          out += text(270, yy + 17, `📁 ${entry.replace(":", " → 📄")}`, "lab-text-small");
        });
        y += 40 + tree[folder].length * 30;
      });
      out += text(260, 330, pathOf(v), exists(v) ? "lab-text-ok" : "lab-text", "middle");
      return `${out}</svg>`;
    },
  },
};

// ─── Lab: Passwortstärke ─────────────────────────────────────────────────

const POOLS = [
  { size: 10, label: "nur Ziffern (10)" },
  { size: 26, label: "Kleinbuchstaben (26)" },
  { size: 52, label: "Groß- und Kleinbuchstaben (52)" },
  { size: 62, label: "Buchstaben und Ziffern (62)" },
  { size: 94, label: "mit Sonderzeichen (94)" },
];
/** Model assumption: an attacker tries ten billion passwords per second offline. */
const GUESSES_PER_SECOND = 1e10;

const combos = (v: LabValues) => POOLS[v.pool].size ** v.len;

/** "≈ 4,6 · 10^5" for large values, plain digits up to a million. */
export function sci(value: number): string {
  if (value < 1e6) return fmt(value, 0);
  const exp = Math.floor(Math.log10(value));
  return `≈ ${fmt(value / 10 ** exp, 1)} · 10^${exp}`;
}

export function duration(seconds: number): string {
  if (seconds < 1) return "unter 1 Sekunde";
  if (seconds < 3600) return `≈ ${fmt(seconds / 60, 1)} Minuten`;
  if (seconds < 86400 * 365) return `≈ ${fmt(seconds / 86400, 1)} Tage`;
  return `≈ ${sci(seconds / (86400 * 365))} Jahre`;
}

const passwortLab: LabDefinition = {
  kind: "passwortstaerke",
  title: "Wie stark ist ein Passwort?",
  intro:
    "Die Zahl der möglichen Passwörter ist Zeichenvorrat hoch Länge. Im Modell probiert ein Angreifer zehn Milliarden Passwörter pro Sekunde aus.",
  params: [
    { key: "len", type: "range", label: "Länge", unit: "Zeichen", min: 4, max: 16, step: 1, value: 4 },
    { key: "pool", type: "choice", label: "Zeichenvorrat", options: POOLS.map((p, value) => ({ value, label: p.label })), value: 1 },
  ],
  readouts: [
    { key: "combos", label: "mögliche Passwörter", emphasis: true, compute: (v) => sci(combos(v)) },
    { key: "time", label: "alle durchprobieren", compute: (v) => duration(combos(v) / GUESSES_PER_SECOND) },
  ],
  goals: [
    { id: "billion", text: "Erreiche mehr als eine Billion (10^12) mögliche Passwörter.", check: (v) => combos(v) > 1e12 },
    { id: "stark", text: "Stelle ein starkes Passwort ein: mindestens 12 Zeichen aus allen Zeichenarten.", check: (v) => v.len >= 12 && v.pool === 4 },
    { id: "pin", text: "Zeige, wie schnell eine 8-stellige Ziffern-PIN durchprobiert ist.", check: (v) => v.pool === 0 && v.len === 8 },
  ],
  view: {
    render(v) {
      const exp = Math.log10(combos(v));
      let out = open("Passwortstärke");
      out += rect(40, 60, 440, 40, "lab-shape", 'rx="20"');
      const width = Math.min(440, (exp / 32) * 440);
      out += rect(40, 60, width, 40, exp > 15 ? "lab-fill-ok" : exp > 12 ? "lab-fill-a" : "lab-fill-b", 'rx="20"');
      out += text(260, 40, `${POOLS[v.pool].size}^${v.len} = ${sci(combos(v))}`, "lab-text-big", "middle");
      out += text(260, 140, `Durchprobieren: ${duration(combos(v) / GUESSES_PER_SECOND)}`, "lab-text", "middle");
      out += text(260, 190, "•".repeat(v.len), "lab-text-big", "middle");
      out += text(260, 240, exp > 15 ? "stark" : exp > 12 ? "mittel" : "schwach", exp > 15 ? "lab-text-ok" : "lab-text-bad", "middle");
      return `${out}</svg>`;
    },
  },
};

const kombinationen: ExerciseGenerator = {
  id: "passwort-kombinationen",
  make(rng, level) {
    if (level === 1) {
      const [pool, len] = rng.pick([
        [10, 3],
        [10, 4],
        [10, 6],
        [26, 2],
        [26, 3],
        [2, 8],
      ]);
      const n = pool ** len;
      return {
        prompt: `Ein Code besteht aus ${len} Zeichen, für jedes Zeichen gibt es ${pool} Möglichkeiten. Wie viele verschiedene Codes gibt es?`,
        given: [`Zeichenvorrat: ${pool}`, `Länge: ${len}`],
        formulaHint: "Anzahl = Zeichenvorrat hoch Länge",
        fields: [withSlips(numberField("Anzahl =", n), [pool * len, "Nicht multiplizieren, sondern potenzieren: für jede Stelle wieder alle Möglichkeiten."])],
        steps: [`${pool}^${len}`, Array.from({ length: len }, () => String(pool)).join(" · "), `<strong>${fmt(n, 0)}</strong>`],
      };
    }
    const len = rng.pick([4, 5, 6]);
    const rate = rng.pick([1000, 100]);
    const seconds = 10 ** len / rate;
    return {
      prompt: `Ein Fahrradschloss-Programm akzeptiert eine Ziffern-PIN mit ${len} Stellen. Ein Angreifer probiert ${fmt(rate, 0)} PINs pro Sekunde. Wie viele Sekunden braucht er höchstens, um alle PINs durchzuprobieren?`,
      given: [`${len} Ziffern`, `${fmt(rate, 0)} Versuche pro Sekunde`],
      fields: [withSlips(numberField("Zeit =", seconds, "s"), [10 ** len, "Das ist die Anzahl der PINs. Teile durch die Versuche pro Sekunde."], [(10 * len) / rate, "Anzahl der PINs = 10 hoch Stellenzahl, nicht 10 mal Stellenzahl."])],
      steps: [`Anzahl PINs: 10^${len} = ${fmt(10 ** len, 0)}`, `${fmt(10 ** len, 0)} ÷ ${fmt(rate, 0)}`, `<strong>${fmt(seconds, 0)} s</strong>`],
    };
  },
};

export const STAGE_EDV: Stage = {
  id,
  stageNumber: 8,
  title: "Grundlagen elektronischer Datenverarbeitung",
  subtitle: "Computermodell, Betriebssystem, Dateien, Lizenzen und Datensicherheit",
  icon: "🖥️",
  accent: "#4f46e5",
  badgeTitle: "Systemkennerin",
  lehrplanLabel: "IT 1.8 · ca. 14 Std.",
  module: "1.8",
  lessons: [
    lesson(id, "1.8", 1, {
      id: "it8-eva-computermodell",
      title: "EVA-Prinzip und Computermodell",
      subtitle: "Eingabe, Verarbeitung, Ausgabe, Von-Neumann-Architektur und Entwicklung des Computers",
      why: "Ob Smartphone, Spielkonsole oder Waschmaschine: Alle verarbeiten Daten nach demselben Prinzip. Wer es kennt, versteht jedes Gerät besser.",
      html: `<p>Jede elektronische Datenverarbeitung folgt dem <strong>EVA-Prinzip</strong>: <strong>Eingabe</strong> (Daten kommen herein), <strong>Verarbeitung</strong> (Daten werden berechnet), <strong>Ausgabe</strong> (Ergebnisse gehen hinaus). Dazu kommt die <strong>Speicherung</strong>. Geräte rund um den Computer heißen <strong>Peripherie</strong>: Eingabegeräte (Tastatur, Maus, Mikrofon, Kamera, Scanner), Ausgabegeräte (Monitor, Drucker, Lautsprecher), Speicher (SSD, Festplatte, USB-Stick).</p>
<p>Das vereinfachte <strong>Computermodell nach John von Neumann</strong> (1945) besteht aus dem <strong>Prozessor (CPU)</strong> mit <strong>Steuerwerk</strong> und <strong>Rechenwerk</strong>, dem <strong>Arbeitsspeicher</strong> für Programme <em>und</em> Daten, der <strong>Ein- und Ausgabeeinheit</strong> und dem <strong>Bus</strong>, der alles verbindet. Den ersten funktionsfähigen, programmgesteuerten Digitalrechner, die <strong>Z3</strong>, baute <strong>Konrad Zuse</strong> 1941 in Berlin; er rechnete schon im Dualsystem. Heute achtet man auf <strong>Green IT</strong>: Geräte, die wenig Energie verbrauchen und lange genutzt werden.</p>
<div class="example"><strong>Beispiel:</strong> Du fotografierst mit der Webcam (Eingabe), das Bildprogramm setzt einen Filter (Verarbeitung im Prozessor, das Bild liegt im Arbeitsspeicher), das Ergebnis erscheint auf dem Monitor (Ausgabe) und wird auf der SSD gespeichert.</div>
<div class="merke"><strong>Merke:</strong> EVA: Eingabe → Verarbeitung → Ausgabe, dazu Speicher. Von Neumann: CPU (Steuerwerk + Rechenwerk), Arbeitsspeicher für Programme und Daten, Ein-/Ausgabe, Bus.</div>`,
      rule: "EVA: Eingabe → Verarbeitung → Ausgabe (+ Speicher); Von-Neumann-Rechner: CPU, Arbeitsspeicher, Ein-/Ausgabe, Bus",
      terms: [
        ["Peripherie", "Eingabe: Tastatur, Maus, Mikrofon · Ausgabe: Monitor, Drucker, Lautsprecher · Speicher: SSD, USB-Stick", "Geräte rund um den Rechner"],
        ["Konrad Zuse · Green IT", "Z3 (1941), erster funktionsfähiger programmgesteuerter Digitalrechner · energiesparende, langlebige IT", "Entwicklungsschritte"],
      ],
      quiz: [
        "Welches Bauteil führt im Von-Neumann-Modell die Berechnungen aus?",
        "Das Rechenwerk im Prozessor",
        "Der Monitor",
        "Der Bus",
        "Das Rechenwerk rechnet, das Steuerwerk steuert den Ablauf; der Bus transportiert nur Daten.",
      ],
      lab: caseLab({
        kind: "eva-geraete",
        title: "Eingabe, Verarbeitung, Ausgabe oder Speicher?",
        intro: "Ordne jedes Bauteil seiner Aufgabe im EVA-Prinzip zu.",
        categories: ["Eingabe", "Verarbeitung", "Ausgabe", "Speicherung"],
        cases: [
          { short: "Tastatur", text: "Tastatur", answer: 0, why: "Über sie gibst du Zeichen ein.", hint: "Kommen Daten herein oder hinaus?" },
          { short: "Mikrofon", text: "Mikrofon", answer: 0, why: "Es nimmt Schall auf und gibt ihn als Daten ein.", hint: "Nimmt es auf oder gibt es wieder?" },
          { short: "Prozessor (CPU)", text: "Prozessor (CPU)", answer: 1, why: "Er rechnet und steuert.", hint: "Wo wird gerechnet?" },
          { short: "Monitor", text: "Monitor", answer: 2, why: "Er zeigt Ergebnisse an.", hint: "Siehst du darauf etwas?" },
          { short: "Drucker", text: "Drucker", answer: 2, why: "Er gibt Daten auf Papier aus.", hint: "Kommt etwas heraus?" },
          { short: "SSD", text: "SSD (Datenträger)", answer: 3, why: "Sie speichert Daten dauerhaft.", hint: "Behält es Daten nach dem Ausschalten?" },
        ],
        goals: [
          { text: "Ordne die beiden Eingabegeräte zu.", cases: [0, 1] },
          { text: "Ordne Prozessor und Datenträger richtig zu.", cases: [2, 5] },
          { text: "Ordne alle sechs Bauteile richtig zu.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "eva-zuordnen",
          [
            cc("Zu welchem Teil des EVA-Prinzips gehört ein Scanner?", "Eingabe", ["Ausgabe", "Verarbeitung"], "Ein Scanner liest eine Vorlage ein.", "Kommen Daten herein?"),
            cc("Wo liegen nach dem Von-Neumann-Modell Programme und Daten während der Arbeit?", "Im Arbeitsspeicher", ["Im Drucker", "Im Bildschirm"], "Programme und Daten teilen sich den Arbeitsspeicher.", "Wo merkt sich der Rechner, woran er arbeitet?"),
            cc("Wer baute 1941 mit der Z3 den ersten funktionsfähigen programmgesteuerten Digitalrechner?", "Konrad Zuse", ["Bill Gates", "John von Neumann"], "Zuse baute die Z3 in Berlin; sie rechnete im Dualsystem.", "Ein deutscher Ingenieur."),
          ],
          [
            cc(
              "Du sprichst eine Frage in den Sprachassistenten, er antwortet laut. Ordne EVA richtig zu.",
              "Mikrofon (E) → Prozessor wertet aus (V) → Lautsprecher (A)",
              ["Lautsprecher (E) → Mikrofon (V) → Prozessor (A)", "Prozessor (E) → Lautsprecher (V) → Mikrofon (A)"],
              "Die Sprache kommt über das Mikrofon herein, wird verarbeitet und als Ton ausgegeben.",
              "Was passiert zuerst?",
            ),
            cc(
              "Ein Touchscreen zeigt Bilder an und nimmt Berührungen auf. Wie ordnest du ihn ein?",
              "Er ist Eingabe- und Ausgabegerät zugleich.",
              ["Er ist nur ein Ausgabegerät.", "Er ist ein Speicher."],
              "Berühren ist Eingabe, Anzeigen ist Ausgabe.",
              "Was tut ein Touchscreen alles?",
            ),
            cc(
              "Die Schule will 30 neue Computer anschaffen und auf Green IT achten. Was ist ein passendes Kriterium?",
              "Geringer Energieverbrauch, lange Nutzungsdauer und reparierbare Geräte.",
              ["Die neueste Grafikkarte, auch wenn sie viel Strom braucht.", "Möglichst billige Geräte, die nach einem Jahr ersetzt werden."],
              "Green IT spart Energie und Ressourcen über die ganze Lebensdauer.",
              "Was schont Umwelt und Strombudget?",
            ),
          ],
        ),
        cases(
          "von-neumann",
          [
            cc("Was verbindet im Von-Neumann-Modell Prozessor, Speicher und Ein-/Ausgabe?", "Der Bus", ["Der Monitor", "Die Maus"], "Über den Bus laufen Daten, Adressen und Steuersignale.", "Eine Art Datenstraße."),
            cc("Welche zwei Werke bilden den Prozessor im Von-Neumann-Modell?", "Steuerwerk und Rechenwerk", ["Druckwerk und Laufwerk", "Mausrad und Tastenfeld"], "Das Steuerwerk steuert den Ablauf, das Rechenwerk rechnet.", "Steuern und rechnen."),
            cc("Was bedeutet Peripherie beim Computer?", "Geräte, die an den Rechner angeschlossen sind", ["Das Innere des Prozessors", "Die Programme"], "Peripherie liegt „um den Rechner herum“.", "Rund um den Computer."),
          ],
          [
            cc(
              "Der Computer startet ein Spiel. Wohin wird das Spielprogramm zuerst von der SSD geladen, damit der Prozessor es ausführen kann?",
              "In den Arbeitsspeicher",
              ["In den Drucker", "In die Tastatur"],
              "Der Prozessor arbeitet mit dem, was im Arbeitsspeicher liegt; die SSD speichert dauerhaft.",
              "Wo liegen Programme während sie laufen?",
            ),
            cc(
              "Was ist der Unterschied zwischen Arbeitsspeicher und SSD?",
              "Der Arbeitsspeicher verliert beim Ausschalten seinen Inhalt, die SSD speichert dauerhaft.",
              ["Beide speichern dauerhaft.", "Die SSD verarbeitet Daten, der Arbeitsspeicher druckt sie."],
              "Ungesicherte Arbeit im Arbeitsspeicher geht beim Stromausfall verloren.",
              "Was bleibt nach dem Ausschalten?",
            ),
            cc(
              "Warum war die Z3 von Konrad Zuse ein wichtiger Entwicklungsschritt?",
              "Sie war der erste funktionsfähige, frei programmierbare Digitalrechner und rechnete im Dualsystem.",
              ["Sie war das erste Smartphone.", "Sie konnte schon im Internet surfen."],
              "Mit der Z3 (1941) begann die Geschichte programmgesteuerter Digitalrechner.",
              "Was konnte sie als Erste?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.8", 2, {
      id: "it8-betriebssystem-dateien",
      title: "Hardware, Software, Betriebssystem und Dateisystem",
      subtitle: "Aufgaben zuordnen, Ordnerstruktur und Dateioperationen, einfache Computerprobleme lösen",
      why: "Wenn der Drucker streikt oder eine Datei verschwunden ist, hilft es zu wissen, welcher Teil des Systems wofür zuständig ist.",
      html: `<p><strong>Hardware</strong> sind die Geräte, die man anfassen kann. <strong>Software</strong> sind die Programme. Das <strong>Betriebssystem</strong> (z. B. Windows, macOS, Linux, Android) ist die <strong>Schnittstelle</strong> zwischen <strong>Anwendungsprogramm</strong> und Hardware: Es verwaltet Prozessor, Speicher und Geräte (mit <strong>Treibern</strong>), startet Programme, verwaltet Dateien und bietet die Benutzeroberfläche. Ein Anwendungsprogramm wie die Textverarbeitung greift nie direkt auf den Drucker zu, sondern über das Betriebssystem.</p>
<p>Das <strong>Dateisystem</strong> ordnet Dateien in einem <strong>Ordnerbaum</strong>. Die Wurzel ist das Laufwerk (z. B. <code>C:\\</code>). Ein <strong>absoluter Pfad</strong> beginnt an der Wurzel: <code>C:\\Schule\\IT\\Referat.docx</code>. Die <strong>Dateiendung</strong> (.docx, .xlsx, .jpg) zeigt das Format. <strong>Dateioperationen</strong>: anlegen, umbenennen, <strong>kopieren</strong> (Original bleibt), <strong>verschieben</strong> (Original wandert), löschen (meist zuerst in den Papierkorb). Bei <strong>Computerproblemen</strong> prüfst du die Ebene: Hängt ein Programm, beendest du es über den Task-Manager; erkennt das System ein Gerät nicht, prüfst du Kabel und Treiber.</p>
<div class="example"><strong>Beispiel:</strong> Lea findet ihr Referat nicht. Die Suche zeigt <code>C:\\Dokumente\\Referat.docx</code>: Sie hatte es beim Speichern im falschen Ordner abgelegt. Sie verschiebt es nach <code>C:\\Schule\\IT</code>.</div>
<div class="merke"><strong>Merke:</strong> Anwendung → Betriebssystem → Hardware. Absoluter Pfad beginnt an der Wurzel. Kopieren lässt das Original stehen, Verschieben nicht.</div>`,
      rule: "Anwendungsprogramm ↔ Betriebssystem (Schnittstelle) ↔ Hardware; absoluter Pfad: Wurzel\\Ordner\\…\\Datei.endung",
      terms: [
        ["Aufgaben des Betriebssystems", "Geräte und Speicher verwalten · Programme starten · Dateien verwalten · Benutzeroberfläche", "Treiber steuern einzelne Geräte"],
        ["Dateioperationen", "anlegen · umbenennen · kopieren · verschieben · löschen", "Kopieren: Original bleibt; Verschieben: Original wandert"],
      ],
      quiz: [
        "Womit beginnt ein absoluter Pfad?",
        "Mit dem Wurzelverzeichnis, z. B. C:\\",
        "Mit dem Dateinamen",
        "Mit der Dateiendung",
        "Ein absoluter Pfad beschreibt den ganzen Weg ab der Wurzel des Ordnerbaums.",
      ],
      lab: dateiLab,
      exercises: [
        cases(
          "ebenen",
          [
            cc("Welche Ebene schickt den Druckauftrag der Textverarbeitung an den Drucker?", "Das Betriebssystem mit dem Druckertreiber", ["Die Tastatur", "Die Textverarbeitung direkt ohne Zwischenstufe"], "Anwendungen sprechen Geräte über das Betriebssystem an.", "Wer ist die Schnittstelle?"),
            cc("Was ist ein Beispiel für ein Betriebssystem?", "Android", ["Tabellenkalkulation", "Grafikkarte"], "Android verwaltet Hardware und Apps eines Smartphones.", "Es läuft, bevor jede App startet."),
            cc("Was ist Hardware?", "Die Geräte und Bauteile, die man anfassen kann", ["Alle Programme", "Nur das Internet"], "Prozessor, Speicher, Tastatur und Bildschirm sind Hardware.", "Kann man es anfassen?"),
          ],
          [
            cc(
              "Ein Programm reagiert nicht mehr, der Rest des Computers läuft. Was ist der sinnvollste erste Schritt?",
              "Das Programm über den Task-Manager beenden und neu starten.",
              ["Den Stecker ziehen.", "Das Betriebssystem neu installieren."],
              "Das Problem liegt in der Anwendung; das Betriebssystem kann sie gezielt beenden.",
              "Welche Ebene hat das Problem?",
            ),
            cc(
              "Ein neuer Drucker druckt nicht, obwohl er eingeschaltet und angeschlossen ist. Was prüfst du?",
              "Ob der passende Druckertreiber installiert ist.",
              ["Ob die Schriftart gefällt.", "Ob die Datei die Endung .jpg hat."],
              "Der Treiber übersetzt zwischen Betriebssystem und Gerät.",
              "Was braucht das Betriebssystem, um ein Gerät zu steuern?",
            ),
            cc(
              "Du willst eine Datei auf den USB-Stick bringen und sie auch auf dem Computer behalten. Welche Dateioperation wählst du?",
              "Kopieren",
              ["Verschieben", "Löschen"],
              "Beim Kopieren bleibt das Original erhalten.",
              "Soll das Original bleiben?",
            ),
          ],
        ),
        {
          id: "pfad",
          make(rng, level) {
            const drive = "C:";
            const folders = rng.pick([
              ["Schule", "Deutsch"],
              ["Schule", "Englisch"],
              ["Bilder", "Sport"],
              ["Musik", "Band"],
            ]);
            const file = rng.pick(["Aufsatz.docx", "Vokabeln.xlsx", "Turnier.jpg", "Probe.mp3"]);
            const answer = `${drive}\\${folders.join("\\")}\\${file}`;
            if (level === 1) {
              return {
                prompt: `Im Laufwerk ${drive} liegt der Ordner ${folders[0]}, darin der Ordner ${folders[1]}, darin die Datei ${file}. Wie lautet der absolute Pfad?`,
                given: [`${drive} → ${folders[0]} → ${folders[1]} → ${file}`],
                formulaHint: "Wurzel zuerst, dann jeder Ordner, zum Schluss die Datei, getrennt durch \\",
                fields: [textField("Pfad:", [answer, answer.replace(/\\/g, "/")], "C:\\Ordner\\Datei.docx", [[`${folders.join("\\")}\\${file}`, "Ein absoluter Pfad beginnt an der Wurzel."], [`${drive}\\${file}`, "Die Ordner fehlen."]])],
                steps: ["Beginne an der Wurzel C:\\", `${folders[0]}\\${folders[1]}\\`, `<strong>${answer}</strong>`],
              };
            }
            const moved = `${drive}\\Archiv\\${file}`;
            const op = rng.next() < 0.5;
            return {
              prompt: `Die Datei <code>${answer}</code> wird ${op ? "kopiert" : "verschoben"} nach <code>${drive}\\Archiv</code>. Wo liegt die Datei danach?`,
              given: [`vorher: ${answer}`, `${op ? "Kopieren" : "Verschieben"} nach ${drive}\\Archiv`],
              fields: [
                choiceField(rng, "Danach", op ? `In ${answer} und in ${moved}` : `Nur in ${moved}`, [
                  op ? `Nur in ${moved}` : `In ${answer} und in ${moved}`,
                  `Nur in ${answer}`,
                ]),
              ],
              steps: [op ? "Kopieren erzeugt ein Duplikat; das Original bleibt." : "Verschieben nimmt die Datei vom alten Ort weg.", `Neuer Ort: ${moved}`, `<strong>${op ? "an beiden Orten" : `nur in ${moved}`}</strong>`],
            };
          },
        },
      ],
    }),
    lesson(id, "1.8", 3, {
      id: "it8-softwarelizenzen",
      title: "Lizenzbestimmungen bei Software",
      subtitle: "Kommerzielle und freie Software rechtmäßig auswählen und verwenden",
      why: "Ein Programm einfach weiterzugeben kann teuer werden. Wer Lizenzen kennt, findet oft gute freie Alternativen.",
      html: `<p>Wer Software nutzt, braucht ein <strong>Nutzungsrecht</strong>, die <strong>Lizenz</strong>. Ihre Bedingungen stehen in den Lizenzbestimmungen, denen man bei der Installation zustimmt. <strong>Kommerzielle (proprietäre) Software</strong> kaufst oder abonnierst du; der Quellcode ist geheim, Weitergeben und Kopieren für andere sind verboten, oft gilt die Lizenz nur für eine bestimmte Zahl von Geräten.</p>
<p><strong>Freeware</strong> darf kostenlos genutzt werden, aber meist nicht verändert, manchmal nur privat. <strong>Shareware</strong> darfst du eine Zeit lang oder mit eingeschränkten Funktionen testen; danach musst du kaufen. <strong>Freie Software / Open-Source-Software</strong> legt den Quellcode offen; du darfst sie nutzen, untersuchen, verändern und weitergeben, unter den Bedingungen ihrer Lizenz (z. B. GPL: Veränderte Versionen müssen wieder frei sein). Beispiele: LibreOffice, Firefox, GIMP. Eine unerlaubte Kopie (<strong>Raubkopie</strong>) ist strafbar.</p>
<div class="example"><strong>Beispiel:</strong> Ole will ein Bildprogramm für die Schülerzeitung, darf aber nichts kaufen. Statt eine gekaufte Lizenz vom Nachbarn zu kopieren, nimmt er das Open-Source-Programm GIMP: kostenlos und legal, auch für den ganzen Computerraum.</div>
<div class="merke"><strong>Merke:</strong> Kommerziell: kaufen, nicht weitergeben. Freeware: kostenlos nutzen. Shareware: testen, dann kaufen. Open Source: Quellcode offen, nutzen, ändern, weitergeben nach Lizenz.</div>`,
      rule: "Kommerziell: kaufen · Freeware: kostenlos nutzen · Shareware: testen, dann kaufen · Open Source: Quellcode offen, ändern und weitergeben nach Lizenz",
      terms: [
        ["Lizenz", "Nutzungsrecht und seine Bedingungen", "steht in den Lizenzbestimmungen"],
        ["Freie Software / Open Source", "offener Quellcode: nutzen, untersuchen, verändern, weitergeben", "z. B. LibreOffice, Firefox, GIMP; GPL"],
      ],
      quiz: [
        "Welche Software darfst du verändern und verändert weitergeben?",
        "Open-Source-Software nach ihren Lizenzbedingungen",
        "Freeware",
        "Gekaufte kommerzielle Software",
        "Nur bei freier Software ist der Quellcode offen und das Verändern ausdrücklich erlaubt.",
      ],
      lab: caseLab({
        kind: "softwarelizenzen",
        title: "Welche Lizenzart ist das?",
        intro: "Lies die Lizenzbedingungen und ordne jedes Programm einer Lizenzart zu.",
        categories: ["kommerzielle Software", "Freeware", "Shareware", "Open-Source-Software"],
        cases: [
          { short: "Kauf, 1 Gerät, Code geheim", text: "Kostet 89 €, gilt für ein Gerät, Weitergabe verboten, Quellcode geheim.", answer: 0, why: "Gekauftes Nutzungsrecht mit Einschränkungen.", hint: "Muss man dafür bezahlen?" },
          { short: "Gratis, Änderung verboten", text: "Kostenlos zu nutzen, darf aber nicht verändert oder verkauft werden.", answer: 1, why: "Kostenlos, aber kein offener Code.", hint: "Kostenlos, aber darf man es ändern?" },
          { short: "30 Tage Test, dann zahlen", text: "30 Tage kostenlos testen, danach Lizenz kaufen.", answer: 2, why: "Erst testen, dann kaufen.", hint: "Was passiert nach 30 Tagen?" },
          { short: "Code offen, Änderung erlaubt", text: "Quellcode veröffentlicht, Ändern und Weitergeben unter der GPL erlaubt.", answer: 3, why: "Offener Quellcode, Ändern erlaubt.", hint: "Ist der Quellcode einsehbar?" },
          { short: "Abo 7 € im Monat", text: "Monatliches Abo für 7 €, Nutzung nur solange bezahlt wird.", answer: 0, why: "Nutzungsrecht gegen Bezahlung.", hint: "Wird bezahlt?" },
          { short: "LibreOffice", text: "LibreOffice: freie Bürosoftware einer Stiftung, Quellcode öffentlich.", answer: 3, why: "Ein bekanntes Open-Source-Programm.", hint: "Ist der Code öffentlich?" },
        ],
        goals: [
          { text: "Unterscheide Freeware und Shareware.", cases: [1, 2] },
          { text: "Erkenne beide Open-Source-Fälle.", cases: [3, 5] },
          { text: "Ordne alle sechs Programme richtig zu.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "lizenzart",
          [
            cc("Was ist typisch für Shareware?", "Man darf sie testen und muss sie danach kaufen.", ["Man darf den Quellcode ändern.", "Sie ist für immer kostenlos und vollständig."], "Shareware ist eine Testversion mit späterer Kaufpflicht.", "Share = zum Ausprobieren weitergeben."),
            cc("Was bedeutet „Quellcode offen“?", "Jeder kann den Programmtext lesen.", ["Das Programm hat keine Fehler.", "Das Programm ist besonders teuer."], "Der Quellcode ist der Programmtext; offen heißt öffentlich einsehbar.", "Was ist der Quellcode?"),
            cc("Was ist eine Raubkopie?", "Eine unerlaubte Kopie lizenzpflichtiger Software", ["Eine Sicherungskopie deiner eigenen Fotos", "Ein freies Programm"], "Wer Software ohne Lizenz kopiert oder weitergibt, macht sich strafbar.", "Unerlaubt."),
          ],
          [
            cc(
              "Dein Freund bietet dir seine gekaufte Lizenz für ein Schnittprogramm an, die nur für ein Gerät gilt. Was tust du?",
              "Ablehnen und z. B. ein Open-Source-Programm nutzen.",
              ["Annehmen, weil er sie bezahlt hat.", "Annehmen, wenn ihr euch die Kosten teilt."],
              "Eine Einzelplatzlizenz darf nicht auf weitere Geräte übertragen werden.",
              "Für wie viele Geräte gilt die Lizenz?",
            ),
            cc(
              "Ein Verein will ein Programm für alle 20 Vereinscomputer, kostenlos und anpassbar. Welche Lizenzart passt?",
              "Open-Source-Software",
              ["Shareware", "eine einzelne kommerzielle Lizenz"],
              "Freie Software darf auf beliebig vielen Geräten genutzt und angepasst werden.",
              "Welche Software darf man ändern und verbreiten?",
            ),
            cc(
              "Ein Programm ist als Freeware „nur für private Nutzung“ gekennzeichnet. Darf eine Firma es einsetzen?",
              "Nein, die Lizenz erlaubt nur private Nutzung.",
              ["Ja, Freeware ist immer für alle frei.", "Ja, wenn die Firma klein ist."],
              "Auch kostenlose Software hat Bedingungen; maßgeblich ist die Lizenz.",
              "Was steht in den Bedingungen?",
            ),
          ],
        ),
        cases(
          "lizenz-pruefen",
          [
            cc("Wann stimmst du meist den Lizenzbestimmungen zu?", "Bei der Installation", ["Beim Ausschalten des Computers", "Beim Drucken"], "Vor der Installation erscheint der Lizenzvertrag zum Bestätigen.", "Vor der ersten Nutzung."),
            cc("Welches Programm ist Open-Source-Software?", "Firefox", ["Ein gekauftes Abo-Programm mit geheimem Code", "Eine Testversion für 14 Tage"], "Firefox wird mit offenem Quellcode entwickelt.", "Offener Code."),
            cc("Was verlangt die GPL von veränderten Versionen?", "Sie müssen wieder unter der GPL frei weitergegeben werden.", ["Sie müssen verkauft werden.", "Sie dürfen nie veröffentlicht werden."], "Die GPL sichert, dass Software frei bleibt.", "frei bleibt frei"),
          ],
          [
            cc(
              "Nach 30 Tagen meldet ein Programm: „Testzeitraum abgelaufen“. Ein Forum bietet einen Code zum Freischalten an. Wie handelst du richtig?",
              "Lizenz kaufen oder das Programm deinstallieren und eine freie Alternative nutzen.",
              ["Den Code aus dem Forum nutzen.", "Die Uhrzeit des Computers zurückstellen."],
              "Das Umgehen einer Lizenz ist verboten; solche Codes enthalten oft Schadsoftware.",
              "Was erlaubt die Shareware-Lizenz nach dem Test?",
            ),
            cc(
              "Für den Computerraum werden 25 Arbeitsplätze mit Bürosoftware gebraucht. Was spricht für LibreOffice statt einzelner gekaufter Lizenzen?",
              "Es ist frei, legal auf allen Geräten installierbar und kostenlos.",
              ["Es läuft ohne Betriebssystem.", "Es ist nur für einen Computer erlaubt."],
              "Freie Software spart Lizenzkosten und erlaubt beliebig viele Installationen.",
              "Wie viele Installationen erlaubt die Lizenz?",
            ),
            cc(
              "Wie prüfst du vor dem Herunterladen eines Programms, ob du es nutzen darfst?",
              "Lizenzbedingungen auf der offiziellen Seite des Herstellers lesen.",
              ["Nur auf die Bewertungen achten.", "Es spielt keine Rolle, Hauptsache kostenlos."],
              "Die Lizenz legt fest, was erlaubt ist; offizielle Quellen schützen zusätzlich vor Schadsoftware.",
              "Wo stehen die Bedingungen?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.8", 4, {
      id: "it8-datensicherheit",
      title: "Datensicherheit: Risiken, Regeln und Maßnahmen",
      subtitle: "Schadsoftware, sichere Passwörter, Backup und Virenschutz",
      why: "Ein verlorenes Handy, ein Trojaner oder ein kaputter Stick: Wer vorsorgt, verliert keine Daten und schützt sie vor Missbrauch.",
      html: `<p>Daten sind durch <strong>Risiken</strong> bedroht: <strong>Schadsoftware</strong> wie Viren, Würmer, <strong>Trojaner</strong> (getarnte Programme, die heimlich Daten ausspähen) und Erpressungstrojaner (verschlüsseln Daten), <strong>Phishing</strong>, aber auch Defekte, Diebstahl und eigene Fehler. <strong>Sicherheitsregeln</strong>: ein <strong>sicheres Passwort</strong> ist lang (mindestens 12 Zeichen), enthält verschiedene Zeichenarten, ist kein Wort aus dem Wörterbuch und wird für <strong>jeden Dienst einzeln</strong> verwendet; ein Passwortmanager hilft beim Merken, eine Zwei-Faktor-Anmeldung schützt zusätzlich.</p>
<p><strong>Maßnahmen</strong>: regelmäßige <strong>Backups</strong> (Sicherungskopien) auf einem getrennten Datenträger oder in der Cloud, <strong>Virenschutz</strong> und eine Firewall, <strong>Updates</strong> sofort installieren (sie schließen Sicherheitslücken), Programme nur aus offiziellen Quellen, Sperrbildschirm am Handy. Die Stärke eines Passworts kannst du abschätzen: <strong>Anzahl möglicher Passwörter = Zeichenvorrat<sup>Länge</sup></strong>.</p>
<div class="example"><strong>Beispiel:</strong> Eine 4-stellige PIN hat 10⁴ = 10 000 Möglichkeiten. Ein Passwort aus 12 Zeichen mit 94 möglichen Zeichen hat 94¹² ≈ 4,8 · 10²³ Möglichkeiten. Selbst bei zehn Milliarden Versuchen pro Sekunde bräuchte man über eine Million Jahre.</div>
<div class="merke"><strong>Merke:</strong> Lange, verschiedene Passwörter; Updates und Virenschutz; regelmäßig Backup auf getrenntem Datenträger. Möglichkeiten = Zeichenvorrat hoch Länge.</div>`,
      rule: "Möglichkeiten = Zeichenvorrat<sup>Länge</sup>; Passwort ≥ 12 Zeichen, alle Zeichenarten, je Dienst eines; Backup getrennt aufbewahren",
      terms: [
        ["Trojaner · Erpressungstrojaner", "getarntes Schadprogramm, das Daten ausspäht · verschlüsselt Daten und fordert Geld", "Schutz: offizielle Quellen, Updates, Virenschutz, Backup"],
        ["Backup", "Sicherungskopie auf getrenntem Datenträger oder in der Cloud", "regelmäßig, mindestens für alles Wichtige"],
      ],
      quiz: [
        "Welches Passwort ist am sichersten?",
        "Rabe!Tanzt7Mal_imRegen",
        "passwort123",
        "Lea2012",
        "Lang, mit Groß- und Kleinbuchstaben, Ziffer und Sonderzeichen und kein einfaches Wort; die anderen stehen in jeder Angriffsliste.",
      ],
      lab: passwortLab,
      exercises: [
        kombinationen,
        cases(
          "schutzmassnahme",
          [
            cc("Was ist ein Trojaner?", "Ein getarntes Programm, das heimlich Schaden anrichtet oder Daten ausspäht", ["Ein Programm zum Schutz vor Viren", "Ein besonders sicheres Passwort"], "Wie das Trojanische Pferd tarnt es sich als harmlos.", "Denk an das Trojanische Pferd."),
            cc("Warum installiert man Updates?", "Sie schließen Sicherheitslücken.", ["Sie machen den Computer nur bunter.", "Sie löschen alle Daten."], "Angreifer nutzen bekannte Lücken; Updates schließen sie.", "Was reparieren Updates?"),
            cc("Wo bewahrst du ein Backup sinnvoll auf?", "Auf einem getrennten Datenträger oder in der Cloud", ["Im selben Ordner wie die Originale", "Auf dem Desktop"], "Geht der Computer kaputt, ist sonst auch das Backup weg.", "Was passiert bei einem Defekt?"),
          ],
          [
            cc(
              "Ein Erpressungstrojaner verschlüsselt alle Dateien auf deinem Laptop. Was rettet deine Daten am sichersten?",
              "Ein aktuelles Backup auf einem Datenträger, der nicht dauerhaft angeschlossen war.",
              ["Das geforderte Lösegeld zahlen.", "Den Laptop neu starten."],
              "Ein getrenntes Backup bleibt unverschlüsselt; Zahlen garantiert nichts.",
              "Was hat der Trojaner nicht erreicht?",
            ),
            cc(
              "Tom nutzt für Schulplattform, Spiele-Account und E-Mail dasselbe Passwort. Ein Spieleanbieter wird gehackt. Was droht?",
              "Angreifer probieren das Passwort bei allen Diensten aus und kommen überall hinein.",
              ["Nur das Spiel ist betroffen.", "Nichts, weil das Passwort lang ist."],
              "Ein Passwort für jeden Dienst verhindert, dass ein Datenleck alle Konten öffnet.",
              "Wo funktioniert das gestohlene Passwort noch?",
            ),
            cc(
              "Ein Pop-up meldet „Virus gefunden! Hier Reinigungsprogramm herunterladen“. Was tust du?",
              "Nichts herunterladen, das Fenster schließen und den eigenen Virenschutz prüfen lassen.",
              ["Sofort herunterladen.", "Die Kreditkartennummer eingeben, um das Programm zu kaufen."],
              "Solche Warnungen sind oft selbst Schadsoftware oder Betrug.",
              "Woher kommt die Warnung?",
            ),
          ],
        ),
      ],
    }),
  ],
};
