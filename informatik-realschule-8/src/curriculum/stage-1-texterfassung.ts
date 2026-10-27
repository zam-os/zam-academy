import { fmt } from "../exercises/format";
import { caseLab } from "../lab/case-lab";
import { circle, line, open, rect, text } from "../lab/svg";
import type { ExerciseGenerator, LabDefinition, Stage } from "../model/types";
import { cases, cc, choiceField, lesson, numberField, withSlips } from "./helpers";
import { FINGERS, fingerOf, HOME_KEYS, KEY_ROWS, KEYS, leftHandStrokes } from "./keyboard";

const id = "texterfassung";

// ─── Lab: Griffwege ───────────────────────────────────────────────────────

const LAB_KEYS = KEYS.map((entry) => entry.key);

const griffwegeLab: LabDefinition = {
  kind: "griffwege",
  title: "Griffwege auf der Tastatur",
  intro:
    "Wähle eine Taste und den Finger, der sie im Zehnfingersystem tippt. Die Tastmarken auf F und J zeigen die Grundstellung.",
  params: [
    {
      key: "key",
      type: "choice",
      label: "Taste",
      options: LAB_KEYS.map((key, index) => ({ value: index, label: key })),
      value: LAB_KEYS.indexOf("F"),
    },
    {
      key: "finger",
      type: "choice",
      label: "Finger",
      options: [
        { value: 0, label: "– Finger wählen –" },
        ...FINGERS.map((name, index) => ({ value: index + 1, label: name })),
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "row",
      label: "Tastenreihe",
      compute: (v) =>
        ({ oben: "obere Buchstabenreihe", grund: "Grundreihe", unten: "untere Buchstabenreihe" })[
          KEYS[v.key].row
        ],
    },
    {
      key: "check",
      label: "Zuordnung",
      emphasis: true,
      compute: (v) =>
        v.finger === 0
          ? "noch kein Finger gewählt"
          : v.finger - 1 === KEYS[v.key].finger
            ? "✓ richtiger Finger"
            : "✗ anderer Finger: Geh von der Grundstellung aus.",
    },
  ],
  goals: [
    {
      id: "grund",
      text: "Ordne einer Taste der Grundreihe den richtigen Finger zu.",
      check: (v) => KEYS[v.key].row === "grund" && v.finger - 1 === KEYS[v.key].finger,
    },
    {
      id: "oben",
      text: "Ordne einer Taste der oberen Reihe den richtigen Finger zu.",
      check: (v) => KEYS[v.key].row === "oben" && v.finger - 1 === KEYS[v.key].finger,
    },
    {
      id: "unten",
      text: "Ordne einer Taste der unteren Reihe den richtigen Finger zu.",
      check: (v) => KEYS[v.key].row === "unten" && v.finger - 1 === KEYS[v.key].finger,
    },
  ],
  view: {
    render(v) {
      const chosen = KEYS[v.key];
      const right = v.finger - 1 === chosen.finger;
      let out = open("Tastatur mit Griffwegen");
      const offsets = { oben: 34, grund: 48, unten: 70 };
      (["oben", "grund", "unten"] as const).forEach((row, r) => {
        KEY_ROWS[row].forEach((key, column) => {
          const x = offsets[row] + column * 40;
          const y = 40 + r * 54;
          const info = KEYS.find((entry) => entry.key === key);
          const zone = right && info?.finger === chosen.finger;
          const cls = key === chosen.key ? (right ? "lab-fill-ok" : "lab-fill-a") : zone ? "lab-fill-c" : "lab-shape";
          out += rect(x, y, 36, 44, cls, 'rx="6"');
          out += text(x + 18, y + 28, key, HOME_KEYS.includes(key) ? "lab-text-big" : "lab-text", "middle");
          if (key === "F" || key === "J") out += line(x + 12, y + 38, x + 24, y + 38, "lab-axis");
        });
      });
      out += rect(150, 210, 220, 30, "lab-shape", 'rx="6"');
      out += text(260, 230, "Leertaste (Daumen)", "lab-text-small", "middle");
      out += text(
        260,
        280,
        v.finger === 0
          ? `Taste ${chosen.key}: Welcher Finger tippt sie?`
          : right
            ? `${chosen.key} tippt der ${FINGERS[chosen.finger]}.`
            : `${chosen.key}: nicht der ${FINGERS[v.finger - 1]}.`,
        right ? "lab-text-ok" : "lab-text",
        "middle",
      );
      out += text(260, 310, "Grundstellung: A S D F – J K L Ö", "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
  witnesses: {
    grund: { key: LAB_KEYS.indexOf("D"), finger: 3 },
    oben: { key: LAB_KEYS.indexOf("U"), finger: 5 },
    unten: { key: LAB_KEYS.indexOf("C"), finger: 3 },
  },
};

const WORDS = ["datei", "drucker", "maus", "tastatur", "bildschirm", "programm", "tabelle", "speicher", "computer", "netzwerk"];

const fingerTask: ExerciseGenerator = {
  id: "finger-zuordnen",
  make(rng, level) {
    if (level === 1) {
      const entry = rng.pick(KEYS.filter((k) => !HOME_KEYS.includes(k.key)));
      const answer = FINGERS[entry.finger];
      const others = FINGERS.map((name, index) => ({ name, d: Math.abs(index - entry.finger) }))
        .filter((f) => f.d > 0)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .map((f) => f.name);
      const home = KEYS.find((k) => k.row === "grund" && k.finger === entry.finger && HOME_KEYS.includes(k.key));
      return {
        prompt: `Mit welchem Finger tippst du im Zehnfingersystem die Taste <strong>${entry.key}</strong>?`,
        given: [`Taste: ${entry.key} (${entry.row === "oben" ? "obere Reihe" : entry.row === "unten" ? "untere Reihe" : "Grundreihe"})`],
        formulaHint: "Grundstellung: A S D F | J K L Ö. Jeder Finger tippt die Tasten schräg über und unter seiner Grundtaste.",
        fields: [choiceField(rng, "Finger", answer, others)],
        steps: [
          "Suche die Grundtaste in derselben Tastenspalte.",
          `Über bzw. unter ${entry.key} liegt in der Grundreihe die Taste ${home?.key ?? "G oder H"}.`,
          `<strong>${answer}</strong>`,
        ],
      };
    }
    const word = rng.pick(WORDS);
    const left = leftHandStrokes(word);
    return {
      prompt: `Du tippst das kleingeschriebene Wort <strong>„${word}“</strong> im Zehnfingersystem. Wie viele Anschläge macht dabei die linke Hand?`,
      given: [`Wort: ${word} (${word.length} Buchstaben)`],
      formulaHint: "Links: Q W E R T, A S D F G, Y X C V B.",
      fields: [
        withSlips(
          numberField("Anschläge der linken Hand =", left),
          [word.length - left, "Das ist die Zahl der rechten Hand. Links liegen Q–T, A–G und Y–B."],
          [word.length, "Zähle nur die Buchstaben, die die linke Hand tippt."],
        ),
      ],
      steps: [
        "Links liegen die Tasten Q W E R T, A S D F G und Y X C V B.",
        [...word].map((letter) => `${letter}: ${fingerOf(letter) <= 3 ? "links" : "rechts"}`).join(", "),
        `<strong>${left} Anschläge mit der linken Hand</strong>`,
      ],
    };
  },
};

const grundstellungTask = cases(
  "grundstellung",
  [
    cc(
      "Woran findest du die Grundstellung, ohne auf die Tastatur zu sehen?",
      "An den fühlbaren Tastmarken auf F und J.",
      ["An der Farbe der Leertaste.", "An der Umschalttaste links unten."],
      "Die Zeigefinger ertasten die Erhebungen auf F und J; die anderen Finger legen sich daneben.",
      "Welche zwei Tasten haben eine kleine Erhebung?",
    ),
    cc(
      "Auf welcher Taste liegt in der Grundstellung der rechte kleine Finger?",
      "Auf Ö.",
      ["Auf Ä.", "Auf L."],
      "Rechts liegen J K L Ö unter Zeige-, Mittel-, Ring- und kleinem Finger.",
      "Rechte Hand: J K L Ö.",
    ),
    cc(
      "Womit tippst du im Zehnfingersystem die Leertaste?",
      "Mit einem Daumen.",
      ["Mit dem rechten kleinen Finger.", "Mit dem linken Zeigefinger."],
      "Die Daumen ruhen über der Leertaste, damit die Finger in der Grundstellung bleiben.",
      "Welche Finger liegen nicht auf den Buchstabentasten?",
    ),
  ],
  [
    cc(
      "Lea tippt „fjfj“ und bekommt „gkgk“. Was ist passiert?",
      "Beide Hände liegen eine Taste zu weit rechts.",
      ["Die Rechtschreibprüfung hat die Wörter verändert.", "Die Umschalttaste ist eingerastet."],
      "Jede Taste ist um genau eine Spalte nach rechts versetzt: Die Hände haben die Grundstellung verlassen.",
      "Vergleiche f → g und j → k.",
    ),
    cc(
      "Warum sollen die Finger nach jedem Anschlag in die Grundstellung zurückkehren?",
      "Weil jeder Griffweg von der Grundtaste aus geübt ist und so ohne Hinsehen sicher bleibt.",
      ["Weil die Tastatur sonst nicht reagiert.", "Weil dadurch Großbuchstaben entstehen."],
      "Blindschreiben beruht auf festen Wegen von der Grundtaste aus; ohne Rückkehr stimmen die Wege nicht mehr.",
      "Von wo aus hast du die Griffwege gelernt?",
    ),
    cc(
      "Tim schaut beim Schreiben ständig auf die Tasten. Was hilft ihm am meisten beim Zehnfingersystem?",
      "Langsam üben, Blick auf Vorlage oder Bildschirm, Tasten über die Tastmarken finden.",
      ["Schneller tippen, damit sich die Finger die Wege merken.", "Nur mit zwei Fingern schreiben, bis er sicher ist."],
      "Sicherheit kommt vor Tempo: Wer die Griffwege blind übt, wird später schneller und macht weniger Fehler.",
      "Was kommt zuerst: Sicherheit oder Tempo?",
    ),
  ],
);

// ─── Lab: Arbeitsplatz ────────────────────────────────────────────────────

const WINDOW = ["seitlich zum Fenster", "Fenster hinter dem Bildschirm", "Fenster im Rücken"];

const ergonomieLab: LabDefinition = {
  kind: "arbeitsplatz",
  title: "Bildschirmarbeitsplatz einstellen",
  intro:
    "Stelle Abstand und Höhe des Bildschirms, die Sitzhöhe und den Platz zum Fenster ein. Den Bildschirm kannst du auch ziehen.",
  params: [
    { key: "dist", type: "range", label: "Abstand Auge–Bildschirm", unit: "cm", min: 30, max: 100, step: 5, value: 35 },
    { key: "top", type: "range", label: "Oberkante Bildschirm über Augenhöhe", unit: "cm", min: -20, max: 20, step: 5, value: 15 },
    { key: "knee", type: "range", label: "Kniewinkel", unit: "°", min: 60, max: 130, step: 10, value: 70 },
    {
      key: "window",
      type: "choice",
      label: "Lage zum Fenster",
      options: WINDOW.map((label, value) => ({ value, label })),
      value: 1,
    },
  ],
  readouts: [
    {
      key: "distNote",
      label: "Abstand",
      compute: (v) => (v.dist < 50 ? "zu nah: Augen ermüden" : v.dist > 70 ? "zu weit: Du beugst dich vor" : "✓ etwa eine Armlänge"),
    },
    {
      key: "topNote",
      label: "Blickrichtung",
      compute: (v) =>
        v.top > 0 ? "Kopf im Nacken: Nacken verspannt" : v.top < -10 ? "zu tief: Du beugst den Kopf stark" : "✓ Blick leicht nach unten",
    },
    {
      key: "kneeNote",
      label: "Sitzhaltung",
      compute: (v) => (v.knee === 90 ? "✓ Füße flach, Oberschenkel waagerecht" : v.knee < 90 ? "Stuhl zu tief" : "Stuhl zu hoch"),
    },
    {
      key: "light",
      label: "Licht",
      compute: (v) => (v.window === 0 ? "✓ keine Spiegelung, keine Blendung" : v.window === 1 ? "Blendung durch Gegenlicht" : "Spiegelung auf dem Bildschirm"),
    },
  ],
  goals: [
    { id: "abstand", text: "Stelle einen Sehabstand von 50 bis 70 cm ein.", check: (v) => v.dist >= 50 && v.dist <= 70 },
    {
      id: "hoehe",
      text: "Stelle die Oberkante auf oder bis 10 cm unter Augenhöhe, bei passendem Abstand.",
      check: (v) => v.top <= 0 && v.top >= -10 && v.dist >= 50 && v.dist <= 70,
    },
    {
      id: "alles",
      text: "Richte den ganzen Arbeitsplatz ergonomisch ein: Abstand, Höhe, Kniewinkel 90° und Licht von der Seite.",
      check: (v) => v.dist >= 50 && v.dist <= 70 && v.top <= 0 && v.top >= -10 && v.knee === 90 && v.window === 0,
    },
  ],
  view: {
    render(v) {
      let out = open("Seitenansicht eines Bildschirmarbeitsplatzes");
      const eyeX = 120;
      const eyeY = 120;
      const monX = eyeX + v.dist * 3;
      const topY = eyeY - v.top * 3;
      out += rect(40, 296, 440, 6, "lab-shape");
      out += rect(Math.min(monX - 30, 420), 230, 120, 8, "lab-shape");
      out += circle(eyeX - 20, eyeY, 22, "lab-fill-a");
      out += circle(eyeX - 10, eyeY - 4, 3, "lab-dot-small");
      const seatY = 296 - 24 - (v.knee - 60) * 0.6;
      out += line(eyeX - 30, eyeY + 22, eyeX - 40, seatY, "lab-curve");
      out += line(eyeX - 40, seatY, eyeX + 30, seatY, "lab-curve");
      out += line(eyeX + 30, seatY, eyeX + 30 + Math.cos(((v.knee - 90) * Math.PI) / 180) * 2, 296, "lab-curve");
      out += rect(eyeX - 60, seatY + 4, 80, 8, "lab-shape");
      out += rect(monX, topY, 10, 70, v.top <= 0 && v.top >= -10 ? "lab-fill-ok" : "lab-fill-b");
      out += line(monX + 5, topY + 70, monX + 5, 230, "lab-axis");
      out += line(eyeX, eyeY, monX, eyeY, "lab-grid");
      out += line(eyeX, eyeY, monX, topY + 20, "lab-side-a");
      out += text((eyeX + monX) / 2, eyeY - 8, `${fmt(v.dist, 0)} cm`, "lab-text-small", "middle");
      if (v.window === 0) out += text(470, 40, "Fenster seitlich", "lab-text-small", "end");
      else if (v.window === 1) out += rect(Math.min(monX + 30, 470), 40, 30, 160, "lab-fill-c");
      else out += rect(30, 40, 20, 160, "lab-fill-c");
      out += `<g class="lab-handle" data-handle="monitor" tabindex="0" role="button" aria-label="Bildschirm (ziehen oder Pfeiltasten)"><circle cx="${monX + 5}" cy="${topY + 35}" r="16" class="lab-handle-hit" /><circle cx="${monX + 5}" cy="${topY + 35}" r="7.5" class="lab-handle-dot" /></g>`;
      return `${out}</svg>`;
    },
    handles: {
      monitor: {
        x: "dist",
        y: "top",
        drag: (p) => ({ dist: Math.round((p.x - 125) / 3 / 5) * 5, top: Math.round((120 - (p.y - 35)) / 3 / 5) * 5 }),
      },
    },
  },
};

// ─── Stage ────────────────────────────────────────────────────────────────

export const STAGE_TEXTERFASSUNG: Stage = {
  id,
  stageNumber: 1,
  title: "Texterfassung",
  subtitle: "Zehnfingersystem, Tippfehler, Grundfunktionen und gesundes Arbeiten",
  icon: "⌨️",
  accent: "#0284c7",
  badgeTitle: "Blindschreib-Profi",
  lehrplanLabel: "IT 1.1 · ca. 14 Std.",
  module: "1.1",
  lessons: [
    lesson(id, "1.1", 1, {
      id: "it8-zehnfingersystem",
      title: "Zehnfingersystem: Grundstellung und Griffwege",
      subtitle: "Tastaturbereiche kennen, jede Buchstabentaste mit dem richtigen Finger tippen",
      why: "Wer blind mit zehn Fingern schreibt, schaut auf Vorlage und Bildschirm statt auf die Tasten und schreibt schneller und mit weniger Fehlern.",
      html: `<p>Die Tastatur hat mehrere <strong>Tastaturbereiche</strong>: das Schreibfeld mit den Buchstaben-, Ziffern- und Zeichentasten, die Funktionstasten F1 bis F12, die Steuertasten (Pfeile, Entf, Pos1) und rechts den Ziffernblock.</p>
<p>Im <strong>Zehnfingersystem</strong> liegt jeder Finger auf einer festen <strong>Grundtaste</strong>. Die <strong>Grundstellung</strong> ist links A S D F, rechts J K L Ö. Die Zeigefinger finden F und J über kleine <strong>Tastmarken</strong>, die Daumen ruhen über der Leertaste. Von der Grundtaste aus erreicht jeder Finger die Tasten schräg darüber und darunter; die Zeigefinger tippen zusätzlich die Spalte zur Mitte hin (links G, T, B, rechts H, Z, N, U, M). Nach jedem Anschlag kehrt der Finger in die Grundstellung zurück.</p>
<div class="example"><strong>Beispiel:</strong> Das E liegt über dem D. Also tippt es der <strong>linke Mittelfinger</strong>: von D schräg nach oben links, anschlagen, zurück auf D. Das N liegt unter dem J, deshalb tippt es der rechte Zeigefinger.</div>
<div class="merke"><strong>Merke:</strong> Grundstellung A S D F – J K L Ö. Jeder Finger tippt seine Grundtaste und die Tasten seiner Spalte; danach geht er zurück in die Grundstellung.</div>`,
      rule: "Grundstellung <strong>A S D F – J K L Ö</strong>, Tastmarken auf <strong>F</strong> und <strong>J</strong>, Daumen auf der Leertaste",
      terms: [
        ["Tastaturbereiche", "Schreibfeld · Funktionstasten · Steuertasten · Ziffernblock", "Das Schreibfeld enthält Buchstaben-, Ziffern- und Zeichentasten."],
        ["Griffweg", "Weg eines Fingers von der Grundtaste zur Zieltaste und zurück", "Zeigefinger: zusätzlich die Spalte zur Tastaturmitte"],
      ],
      quiz: [
        "Welcher Finger tippt im Zehnfingersystem das R?",
        "Der linke Zeigefinger",
        "Der linke Mittelfinger",
        "Der rechte Zeigefinger",
        "Das R liegt über dem F. Der linke Zeigefinger tippt F, R, T, G, V und B.",
      ],
      lab: griffwegeLab,
      exercises: [fingerTask, grundstellungTask],
    }),
    lesson(id, "1.1", 2, {
      id: "it8-tippfehler",
      title: "Tippfehler erkennen und vermeiden",
      subtitle: "Fehlerarten, ihre Ursachen und Korrektur- und Rechtschreibhilfen",
      why: "Ein Bewerbungsschreiben mit Tippfehlern wirkt unsorgfältig. Wer seine typischen Fehler kennt, kann sie gezielt vermeiden.",
      html: `<p>Typische <strong>Tastfehler</strong> sind: eine <strong>Nachbartaste</strong> getroffen (Griffweg ungenau), zwei Buchstaben <strong>vertauscht</strong> (Finger der beiden Hände im falschen Takt), ein Buchstabe <strong>ausgelassen</strong> oder <strong>doppelt</strong> angeschlagen, und ganze Wörter <strong>versetzt</strong>, weil die Hände aus der Grundstellung gerutscht sind. Ursachen sind meist zu hohes Tempo, fehlende Konzentration oder ein falscher Griffweg.</p>
<p>Fehler vermeidest du, indem du die Grundstellung über die Tastmarken prüfst, nur so schnell schreibst, wie du sicher bist, und den Text danach liest. Die <strong>Rechtschreibprüfung</strong> markiert Wörter, die sie nicht kennt, mit einer roten Wellenlinie. Sie findet aber keinen Fehler, der wieder ein echtes Wort ergibt („Mund“ statt „Hund“). Deshalb liest du jeden Text noch selbst <strong>Korrektur</strong>.</p>
<div class="example"><strong>Beispiel:</strong> Statt „Tastatur“ steht „Tasattur“. Das t und das a sind vertauscht: ein Buchstabendreher. Die Rechtschreibprüfung findet ihn. „Haus“ statt „Maus“ findet sie nicht, weil beide Wörter existieren.</div>
<div class="merke"><strong>Merke:</strong> Sicherheit vor Tempo. Die Rechtschreibprüfung hilft, ersetzt aber nicht das eigene Korrekturlesen.</div>`,
      rule: "Fehlerquote = Fehler ÷ Anschläge · 100 %; Rechtschreibprüfung findet keine Fehler, die ein echtes Wort ergeben",
      terms: [
        ["Fehlerarten", "Nachbartaste · Buchstabendreher · Auslassung · Doppelanschlag · versetzte Hände", "Jede Art hat eine eigene Ursache."],
        ["Korrekturhilfen", "Rechtschreibprüfung (rote Wellenlinie) · AutoKorrektur · Rückgängig (Strg + Z)", "Eigenes Korrekturlesen bleibt nötig."],
      ],
      quiz: [
        "Welchen Fehler findet die automatische Rechtschreibprüfung nicht?",
        "„Wald“ statt „Wand“",
        "„Fenstre“ statt „Fenster“",
        "„Comptuer“ statt „Computer“",
        "„Wald“ ist ein echtes Wort. Die Prüfung kennt es und markiert es nicht, obwohl es im Satz falsch ist.",
      ],
      lab: caseLab({
        kind: "fehleranalyse",
        title: "Fehleranalyse",
        intro: "Vergleiche Vorlage und getippten Text und ordne jedem Fall die Fehlerart zu.",
        categories: ["Nachbartaste", "Buchstabendreher", "Auslassung", "Doppelanschlag", "Hände versetzt"],
        cases: [
          { short: "Drucker → Drucjer", text: "Vorlage „Drucker“, getippt „Drucjer“", answer: 0, why: "j liegt neben k: Griffweg ungenau.", hint: "Liegen k und j nebeneinander?" },
          { short: "Maus → Muas", text: "Vorlage „Maus“, getippt „Muas“", answer: 1, why: "a und u haben die Plätze getauscht.", hint: "Sind alle Buchstaben da, nur in anderer Reihenfolge?" },
          { short: "Speicher → Specher", text: "Vorlage „Speicher“, getippt „Specher“", answer: 2, why: "Das i fehlt.", hint: "Zähle die Buchstaben." },
          { short: "Datei → Dateii", text: "Vorlage „Datei“, getippt „Dateii“", answer: 3, why: "Das i wurde zweimal angeschlagen.", hint: "Ist ein Buchstabe zu viel da?" },
          { short: "fall → gsöö", text: "Vorlage „fall“, getippt „gsöö“", answer: 4, why: "Jede Taste liegt eine Spalte zu weit rechts.", hint: "Vergleiche f → g, a → s, l → ö." },
          { short: "Tabelle → Tbaelle", text: "Vorlage „Tabelle“, getippt „Tbaelle“", answer: 1, why: "a und b sind vertauscht.", hint: "Die Buchstaben stimmen, die Reihenfolge nicht." },
        ],
        goals: [
          { text: "Erkenne den Nachbartasten-Fehler und den versetzten Anschlag.", cases: [0, 4] },
          { text: "Erkenne beide Buchstabendreher.", cases: [1, 5] },
          { text: "Ordne alle sechs Fälle richtig zu.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        {
          id: "fehlerquote",
          make(rng, level) {
            if (level === 1) {
              const strokes = rng.pick([200, 250, 400, 500, 800, 1000]);
              const errors = rng.int(1, 8);
              const quote = (errors / strokes) * 100;
              return {
                prompt: `Eine Abschrift hat ${strokes} Anschläge und ${errors} Fehler. Berechne die Fehlerquote.`,
                given: [`Anschläge: ${strokes}`, `Fehler: ${errors}`],
                formulaHint: "Fehlerquote = Fehler ÷ Anschläge · 100 %",
                fields: [
                  withSlips(
                    numberField("Fehlerquote =", quote, "%", 2),
                    [errors / strokes, "Du hast noch nicht mit 100 % multipliziert."],
                    [(strokes / errors) * 100, "Teile die Fehler durch die Anschläge, nicht umgekehrt."],
                  ),
                ],
                steps: [
                  `Fehler ÷ Anschläge = ${errors} ÷ ${strokes} = ${fmt(errors / strokes, 4)}`,
                  `${fmt(errors / strokes, 4)} · 100 % = ${fmt(quote, 2)} %`,
                  `<strong>Fehlerquote = ${fmt(quote, 2)} %</strong>`,
                ],
              };
            }
            const strokes = rng.pick([600, 800, 1200, 1500, 2000]);
            const limit = rng.pick([0.5, 1]);
            const max = Math.floor((strokes * limit) / 100);
            return {
              prompt: `Für eine Leistungskontrolle schreibst du einen Text mit ${strokes} Anschlägen. Die Fehlerquote darf höchstens ${fmt(limit, 1)} % betragen. Wie viele Fehler darfst du höchstens machen?`,
              given: [`Anschläge: ${strokes}`, `Höchstens ${fmt(limit, 1)} % Fehler`],
              fields: [
                withSlips(
                  numberField("höchstens", max, "Fehler"),
                  [strokes * limit, "Du hast nicht durch 100 geteilt: Prozent heißt „von Hundert“."],
                ),
              ],
              steps: [
                `${fmt(limit, 1)} % von ${strokes} = ${strokes} · ${fmt(limit, 1)} ÷ 100`,
                `= ${fmt((strokes * limit) / 100, 1)}`,
                `<strong>höchstens ${max} Fehler</strong>`,
              ],
            };
          },
        },
        cases(
          "fehler-vermeiden",
          [
            cc(
              "Ganze Wörter erscheinen um eine Taste verschoben. Was ist die Ursache?",
              "Die Hände haben die Grundstellung verlassen.",
              ["Die Rechtschreibprüfung ist ausgeschaltet.", "Der Bildschirm ist zu weit entfernt."],
              "Rutschen die Hände eine Spalte zur Seite, ist jeder Anschlag gleich versetzt.",
              "Prüfe die Tastmarken auf F und J.",
            ),
            cc(
              "Du vertauschst oft Buchstaben, die mit zwei Händen getippt werden. Was hilft?",
              "Langsamer und gleichmäßig im Takt schreiben.",
              ["Die Tastatur schräg stellen.", "Nur noch mit einer Hand schreiben."],
              "Buchstabendreher entstehen, wenn eine Hand der anderen vorauseilt.",
              "Was passiert, wenn eine Hand schneller ist?",
            ),
            cc(
              "Was bedeutet eine rote Wellenlinie unter einem Wort?",
              "Die Rechtschreibprüfung kennt das Wort nicht.",
              ["Das Wort ist fett formatiert.", "Das Wort wurde gespeichert."],
              "Die Prüfung vergleicht mit ihrem Wörterbuch und markiert unbekannte Wörter.",
              "Welches Werkzeug markiert Wörter?",
            ),
          ],
          [
            cc(
              "In deinem Brief steht „Ich freue mich auf Ihre Antwort und verbleibe mir freundlichen Grüßen.“ Die Rechtschreibprüfung meldet nichts. Warum?",
              "„mir“ ist ein echtes Wort; den Tippfehler findest du nur beim Korrekturlesen.",
              ["Der Satz ist fehlerfrei.", "Die Rechtschreibprüfung findet nur Fehler in Überschriften."],
              "„mir“ statt „mit“ ergibt ein vorhandenes Wort. Nur wer den Sinn liest, bemerkt es.",
              "Ist „mir“ ein Wort, das im Wörterbuch steht?",
            ),
            cc(
              "Die AutoKorrektur ersetzt beim Tippen „IT“ jedes Mal durch „Es“. Was tust du?",
              "Die Änderung rückgängig machen (Strg + Z) und die Regel in der AutoKorrektur anpassen.",
              ["Das Dokument ohne Prüfung abgeben.", "Alle Wörter großschreiben."],
              "Korrekturhilfen können auch Fehler erzeugen; du kontrollierst sie und passt sie an.",
              "Wer entscheidet am Ende über den Text?",
            ),
            cc(
              "Mia schreibt schnell, macht aber auf 500 Anschläge 15 Fehler. Was ist der beste Übungsplan?",
              "Tempo senken, bis die Fehlerquote klein ist, und erst dann wieder steigern.",
              ["Noch schneller schreiben, damit es sich einschleift.", "Fehler stehen lassen, weil das Tempo zählt."],
              "Falsche Bewegungen schleifen sich ebenso ein wie richtige. Sicherheit kommt vor Tempo.",
              "Was soll sich einschleifen: richtige oder falsche Griffe?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.1", 3, {
      id: "it8-text-grundfunktionen",
      title: "Grundfunktionen der Textverarbeitung",
      subtitle: "Öffnen, speichern, drucken und Fließtext einfach formatieren",
      why: "Ein Text, der nicht gespeichert ist, geht beim Absturz verloren; ein gut formatierter Text ist leichter zu lesen.",
      html: `<p>Jedes Textverarbeitungsprogramm hat dieselben <strong>Grundfunktionen</strong>: Ein <strong>neues Dokument</strong> anlegen, ein vorhandenes <strong>öffnen</strong>, <strong>speichern</strong> und <strong>drucken</strong>. „Speichern“ überschreibt die vorhandene Datei, „<strong>Speichern unter</strong>“ legt eine Datei mit neuem Namen, Ort oder Format an. Vor dem Drucken zeigt die <strong>Druckvorschau</strong>, wie die Seiten aussehen.</p>
<p>Einfache <strong>Formatierungen</strong> wirken auf markierte Zeichen: <strong>Schriftart</strong> (mit Serifen wie Times New Roman, serifenlos wie Arial), <strong>Schriftgrad</strong> in Punkt (pt, Fließtext meist 11 oder 12 pt), <strong>Schriftfarbe</strong> und <strong>Schriftschnitt</strong> (fett, kursiv, unterstrichen). Du markierst zuerst den Text und wählst dann das Format.</p>
<div class="example"><strong>Beispiel:</strong> Du willst das Original deines Referats behalten und eine gekürzte Fassung anlegen. Du öffnest „Referat.docx“ und wählst <strong>Speichern unter</strong> mit dem Namen „Referat-kurz.docx“. Die Überschrift markierst du und stellst 16 pt und fett ein.</div>
<div class="merke"><strong>Merke:</strong> Erst markieren, dann formatieren. „Speichern“ überschreibt, „Speichern unter“ legt eine neue Datei an. Oft speichern schützt vor Datenverlust.</div>`,
      rule: "Markieren → formatieren; <strong>Speichern</strong> überschreibt, <strong>Speichern unter</strong> legt eine neue Datei an",
      terms: [
        ["Zeichenformate", "Schriftart · Schriftgrad (pt) · Schriftfarbe · Schriftschnitt (fett, kursiv, unterstrichen)", "Sie wirken auf die markierten Zeichen."],
        ["Grundfunktionen", "Neu · Öffnen · Speichern (Strg + S) · Speichern unter · Drucken (Strg + P)", "Druckvorschau vor dem Drucken"],
      ],
      quiz: [
        "Du hast „Bewerbung.docx“ geöffnet und möchtest eine Fassung für eine zweite Firma anlegen, ohne die erste zu verlieren. Was wählst du?",
        "Speichern unter, mit neuem Dateinamen",
        "Speichern",
        "Drucken",
        "„Speichern unter“ legt eine neue Datei an; die erste Bewerbung bleibt unverändert erhalten.",
      ],
      lab: {
        kind: "formatieren",
        title: "Überschrift formatieren",
        intro: "Die Überschrift ist markiert. Stelle Schriftart, Schriftgrad, Schriftschnitt und Farbe ein und beobachte die Wirkung.",
        params: [
          {
            key: "font",
            type: "choice",
            label: "Schriftart",
            options: [
              { value: 0, label: "Arial (serifenlos)" },
              { value: 1, label: "Times New Roman (mit Serifen)" },
              { value: 2, label: "Courier New (Schreibmaschine)" },
            ],
            value: 2,
          },
          { key: "size", type: "range", label: "Schriftgrad", unit: "pt", min: 8, max: 28, step: 1, value: 22 },
          {
            key: "style",
            type: "choice",
            label: "Schriftschnitt",
            options: [
              { value: 0, label: "normal" },
              { value: 1, label: "fett" },
              { value: 2, label: "kursiv" },
              { value: 3, label: "unterstrichen" },
            ],
            value: 2,
          },
          {
            key: "color",
            type: "choice",
            label: "Schriftfarbe",
            options: [
              { value: 0, label: "Schwarz" },
              { value: 1, label: "Blau" },
              { value: 2, label: "Rot" },
            ],
            value: 2,
          },
        ],
        readouts: [
          { key: "size", label: "Schriftgrad", compute: (v) => `${v.size} pt` },
          {
            key: "effect",
            label: "Wirkung",
            emphasis: true,
            compute: (v) =>
              v.size < 11
                ? "zu klein für eine Überschrift"
                : v.style === 1 && v.size >= 14
                  ? "✓ hebt sich deutlich vom Fließtext ab"
                  : "hebt sich kaum ab",
          },
        ],
        goals: [
          { id: "fett16", text: "Formatiere die Überschrift mit 16 pt und fett.", check: (v) => v.size === 16 && v.style === 1 },
          {
            id: "komplett",
            text: "Formatiere die Überschrift serifenlos (Arial), 16 pt, fett und blau.",
            check: (v) => v.font === 0 && v.size === 16 && v.style === 1 && v.color === 1,
          },
          { id: "serifen", text: "Stelle eine Schrift mit Serifen ein.", check: (v) => v.font === 1 },
        ],
        view: {
          render(v) {
            const family = ["Arial, Helvetica, sans-serif", "'Times New Roman', Times, serif", "'Courier New', monospace"][v.font];
            const fill = ["#111827", "#2563eb", "#dc2626"][v.color];
            const weight = v.style === 1 ? "700" : "400";
            const italic = v.style === 2 ? "italic" : "normal";
            const deco = v.style === 3 ? "underline" : "none";
            let out = open("Dokument mit formatierter Überschrift");
            out += `<rect x="80" y="20" width="360" height="300" rx="4" style="fill:#ffffff;stroke:#94a3b8" />`;
            out += `<text x="104" y="${60 + v.size * 0.6}" style="font-family:${family};font-size:${v.size * 1.4}px;font-weight:${weight};font-style:${italic};text-decoration:${deco};fill:${fill}">Mein Referat</text>`;
            for (let i = 0; i < 8; i++) out += `<rect x="104" y="${120 + i * 22}" width="${i === 7 ? 180 : 312}" height="8" rx="3" style="fill:#cbd5e1" />`;
            out += `<text x="104" y="308" style="font-size:12px;fill:#475569">Fließtext 11 pt</text>`;
            return `${out}</svg>`;
          },
        },
      },
      exercises: [
        cases(
          "grundfunktion-waehlen",
          [
            cc(
              "Du hast an deinem Aufsatz weitergeschrieben und willst die Änderungen in derselben Datei sichern.",
              "Speichern",
              ["Speichern unter", "Druckvorschau"],
              "„Speichern“ schreibt den neuen Stand in die vorhandene Datei.",
              "Soll eine neue Datei entstehen oder die alte aktualisiert werden?",
            ),
            cc(
              "Bevor du 30 Seiten druckst, willst du prüfen, ob die Tabelle auf eine Seite passt.",
              "Druckvorschau",
              ["Speichern unter", "Neues Dokument"],
              "Die Druckvorschau zeigt die Seiten so, wie sie gedruckt werden.",
              "Welche Funktion zeigt die Seiten vor dem Drucken?",
            ),
            cc(
              "Du willst ein Dokument aus dem Ordner „Schule“ weiterbearbeiten.",
              "Öffnen",
              ["Neues Dokument", "Drucken"],
              "Mit „Öffnen“ lädst du eine gespeicherte Datei in das Programm.",
              "Die Datei existiert schon.",
            ),
          ],
          [
            cc(
              "Deine Lehrerin will dein Referat als PDF, du willst die bearbeitbare Fassung behalten. Was tust du?",
              "„Speichern unter“ mit dem Dateityp PDF wählen; die .docx-Datei bleibt erhalten.",
              ["„Speichern“ wählen und die Endung im Namen auf .pdf ändern.", "Das Referat ausdrucken und abfotografieren."],
              "„Speichern unter“ kann Name, Ort und Format ändern. Eine umbenannte Endung ändert das Format nicht.",
              "Welche Funktion kann das Dateiformat wählen?",
            ),
            cc(
              "Mitten im Schreiben stürzt der Computer ab. Was hätte den Verlust am besten verhindert?",
              "Regelmäßig mit Strg + S speichern.",
              ["Den Text größer formatieren.", "Die Druckvorschau öffnen."],
              "Nur gespeicherte Änderungen liegen auf dem Datenträger; der Arbeitsspeicher verliert sie beim Absturz.",
              "Wo liegt ein ungespeicherter Text?",
            ),
            cc(
              "Ein Wort soll fett werden. Du klickst auf „F“, aber nichts ändert sich. Was fehlt?",
              "Das Wort war nicht markiert.",
              ["Die Datei war nicht gespeichert.", "Fett geht nur bei Überschriften."],
              "Zeichenformate wirken auf die Markierung bzw. auf das, was du danach tippst.",
              "Was kommt vor dem Formatieren?",
            ),
          ],
        ),
        cases(
          "formatierung",
          [
            cc(
              "In welcher Einheit gibt man den Schriftgrad an?",
              "In Punkt (pt).",
              ["In Pixel pro Zoll (ppi).", "In Zeilen pro Seite."],
              "Der Schriftgrad wird in typografischen Punkt angegeben, z. B. 12 pt.",
              "Abkürzung „pt“.",
            ),
            cc(
              "Welche Schriftart ist serifenlos?",
              "Arial",
              ["Times New Roman", "Garamond"],
              "Serifen sind kleine Querstriche an den Buchstabenenden; Arial hat keine.",
              "„sans serif“ heißt „ohne Serifen“.",
            ),
            cc(
              "Welche Formatierung gehört zum Schriftschnitt?",
              "kursiv",
              ["Schriftgrad 14 pt", "Schriftfarbe Blau"],
              "Schriftschnitte sind normal, fett, kursiv und ihre Kombinationen.",
              "Schnitt = Form der Buchstaben, nicht Größe oder Farbe.",
            ),
          ],
          [
            cc(
              "Ein Flyer enthält fünf Schriftarten, drei Farben und viel Unterstrichenes. Wie verbesserst du ihn?",
              "Höchstens zwei Schriftarten, wenige Farben und Hervorhebungen gezielt einsetzen.",
              ["Noch eine Schriftart für die Überschrift ergänzen.", "Alles fett setzen, damit es auffällt."],
              "Zu viele Hervorhebungen heben nichts mehr hervor; ein ruhiges Schriftbild ist leichter lesbar.",
              "Was bleibt hervorgehoben, wenn alles hervorgehoben ist?",
            ),
            cc(
              "Unterstreichen sieht im Internet wie ein Link aus. Womit hebst du ein Wort im Fließtext stattdessen hervor?",
              "Mit Fett- oder Kursivschrift.",
              ["Mit Großbuchstaben im ganzen Absatz.", "Mit einer anderen Schriftart je Wort."],
              "Fett und kursiv sind übliche, gut lesbare Hervorhebungen.",
              "Welche Schriftschnitte bleiben übrig?",
            ),
            cc(
              "Dein Fließtext ist in 8 pt gesetzt und schwer zu lesen. Welche Einstellung ist üblich?",
              "11 oder 12 pt",
              ["4 pt", "28 pt"],
              "Für Fließtext auf Papier sind 11 bis 12 pt gut lesbar; Überschriften sind größer.",
              "Wie groß ist üblicher Fließtext?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.1", 4, {
      id: "it8-ergonomie",
      title: "Ergonomie am Computerarbeitsplatz",
      subtitle: "Haltung, Bildschirm, Licht und Bewegungspausen",
      why: "Wer stundenlang falsch sitzt, bekommt Nacken-, Rücken- und Kopfschmerzen und müde Augen. Ein gut eingestellter Platz erhält deine Leistungsfähigkeit.",
      html: `<p><strong>Ergonomie</strong> heißt: Der Arbeitsplatz passt sich dem Menschen an. Am Bildschirm sitzt du aufrecht, die Füße stehen flach auf dem Boden, Ober- und Unterschenkel bilden etwa einen <strong>rechten Winkel</strong>. Die Unterarme liegen locker, die Handgelenke knicken nicht ab.</p>
<p>Der Bildschirm steht etwa eine <strong>Armlänge (50 bis 70 cm)</strong> entfernt; seine <strong>Oberkante</strong> liegt auf oder etwas unter Augenhöhe, so dass du leicht nach unten blickst. Das Fenster liegt <strong>seitlich</strong>: Licht von hinten spiegelt sich im Bildschirm, Licht von vorne blendet. Kurze <strong>Pausen</strong> mit Lockerungsübungen (Schultern kreisen, in die Ferne schauen) beugen Verspannungen vor.</p>
<div class="example"><strong>Beispiel:</strong> Jonas hat Nackenschmerzen. Sein Bildschirm steht auf einem Bücherstapel, die Oberkante 15 cm über den Augen. Er stellt den Bildschirm tiefer, bis die Oberkante etwas unter Augenhöhe liegt. Jetzt muss er den Kopf nicht mehr in den Nacken legen.</div>
<div class="merke"><strong>Merke:</strong> Abstand eine Armlänge, Oberkante auf oder unter Augenhöhe, Knie etwa 90°, Fenster seitlich, regelmäßig kurze Pausen.</div>`,
      rule: "Sehabstand <strong>50–70 cm</strong>, Oberkante auf oder unter Augenhöhe, Kniewinkel etwa <strong>90°</strong>, Licht von der Seite",
      terms: [
        ["Ergonomie", "Anpassung der Arbeitsbedingungen an den Menschen", "Haltung, Arbeitsplatzgestaltung, Bewegung"],
        ["Gymnastische Übungen", "Schultern kreisen · Nacken dehnen · Blick in die Ferne", "kurze Pausen lockern Muskeln und Augen"],
      ],
      quiz: [
        "Wo sollte das Fenster an einem Bildschirmarbeitsplatz liegen?",
        "Seitlich zum Bildschirm",
        "Direkt hinter dem Bildschirm",
        "Im Rücken der arbeitenden Person",
        "Seitliches Licht blendet nicht und spiegelt sich nicht im Bildschirm.",
      ],
      lab: ergonomieLab,
      exercises: [
        cases(
          "beschwerden",
          [
            cc(
              "Paula legt beim Lesen am Bildschirm den Kopf in den Nacken. Was stellt sie um?",
              "Den Bildschirm tiefer, bis die Oberkante auf oder unter Augenhöhe liegt.",
              ["Den Bildschirm höher stellen.", "Die Schrift kleiner stellen."],
              "Liegt die Oberkante zu hoch, kippt der Kopf nach hinten und der Nacken verspannt.",
              "Wo soll die Oberkante liegen?",
            ),
            cc(
              "Auf dem Bildschirm spiegelt sich das Fenster. Was hilft?",
              "Den Tisch so drehen, dass das Fenster seitlich liegt.",
              ["Den Bildschirm heller stellen und weiterarbeiten.", "Mit dem Rücken zum Fenster sitzen."],
              "Licht im Rücken spiegelt sich; seitliches Licht nicht.",
              "Woher soll das Licht kommen?",
            ),
            cc(
              "Deine Füße baumeln über dem Boden. Was ist falsch eingestellt?",
              "Der Stuhl ist zu hoch.",
              ["Der Bildschirm ist zu weit weg.", "Die Tastatur ist zu klein."],
              "Die Füße sollen flach auf dem Boden stehen, die Knie etwa im rechten Winkel.",
              "Welcher Teil des Arbeitsplatzes bestimmt die Höhe deiner Beine?",
            ),
          ],
          [
            cc(
              "Nach zwei Stunden am Laptop auf dem Sofa schmerzen Ole Nacken und Augen. Welche Änderung hilft am meisten?",
              "Am Tisch arbeiten, den Bildschirm auf Augenhöhe bringen und kurze Bewegungspausen einlegen.",
              ["Den Laptop auf die Knie legen und heller stellen.", "Länger am Stück arbeiten, um schneller fertig zu werden."],
              "Haltung, Bildschirmhöhe und Pausen wirken zusammen; jede Maßnahme allein reicht oft nicht.",
              "Prüfe Haltung, Bildschirm und Pausen.",
            ),
            cc(
              "Zwei Schüler unterschiedlicher Größe teilen sich einen Arbeitsplatz. Was muss jeder vor Beginn einstellen?",
              "Stuhlhöhe und Bildschirmposition passend zur eigenen Körpergröße.",
              ["Nichts, ein Platz passt für alle.", "Nur die Bildschirmhelligkeit."],
              "Ergonomie heißt Anpassung an den Menschen; die richtige Höhe hängt von der Körpergröße ab.",
              "Passt sich der Mensch an den Platz an oder der Platz an den Menschen?",
            ),
            cc(
              "Mila sitzt 35 cm vor dem Bildschirm und beugt sich vor, weil die Schrift klein ist. Was ist die bessere Lösung?",
              "Abstand auf etwa eine Armlänge vergrößern und die Anzeige vergrößern.",
              ["Noch näher an den Bildschirm rücken.", "Den Kopf auf die Hand stützen."],
              "Die Darstellung lässt sich vergrößern; der Abstand von 50 bis 70 cm schont Augen und Rücken.",
              "Was lässt sich am Bildschirm statt am Körper ändern?",
            ),
          ],
        ),
        {
          id: "arbeitsplatz-pruefen",
          make(rng, level) {
            const dist = rng.pick([35, 40, 45, 75, 80, 90]);
            const top = rng.pick([10, 15, 20]);
            if (level === 1) {
              const answer = dist < 50 ? "Bildschirm weiter wegrücken" : "Bildschirm näher heranholen";
              return {
                prompt: `Der Bildschirm steht ${dist} cm von den Augen entfernt. Was änderst du?`,
                given: [`Abstand: ${dist} cm`, "Empfohlen: 50 bis 70 cm"],
                formulaHint: "Sehabstand etwa eine Armlänge: 50 bis 70 cm.",
                fields: [
                  choiceField(rng, "Änderung", answer, [
                    dist < 50 ? "Bildschirm näher heranholen" : "Bildschirm weiter wegrücken",
                    "Nichts, der Abstand passt",
                  ]),
                ],
                steps: [
                  "Vergleiche mit 50 bis 70 cm.",
                  dist < 50 ? `${dist} cm ist kleiner als 50 cm.` : `${dist} cm ist größer als 70 cm.`,
                  `<strong>${answer}</strong>`,
                ],
              };
            }
            const knee = rng.pick([70, 110, 120]);
            const fixes = [
              dist < 50 ? "Bildschirm weiter weg" : "Bildschirm näher heran",
              "Bildschirm tiefer",
              knee < 90 ? "Stuhl höher" : "Stuhl tiefer",
            ];
            const answer = fixes.join(", ");
            return {
              prompt: `Prüfe den Arbeitsplatz: Sehabstand ${dist} cm, Oberkante des Bildschirms ${top} cm über Augenhöhe, Kniewinkel ${knee}°. Welche Änderungen sind nötig?`,
              given: [`Abstand ${dist} cm`, `Oberkante +${top} cm`, `Kniewinkel ${knee}°`],
              fields: [
                choiceField(rng, "Änderungen", answer, [
                  [fixes[0], "Bildschirm höher", fixes[2]].join(", "),
                  [dist < 50 ? "Bildschirm näher heran" : "Bildschirm weiter weg", "Bildschirm tiefer", knee < 90 ? "Stuhl tiefer" : "Stuhl höher"].join(", "),
                ]),
              ],
              steps: [
                `Abstand: ${dist} cm liegt ${dist < 50 ? "unter 50" : "über 70"} cm → ${fixes[0]}.`,
                `Oberkante ${top} cm über Augenhöhe → ${fixes[1]}; Kniewinkel ${knee}° statt 90° → ${fixes[2]}.`,
                `<strong>${answer}</strong>`,
              ],
            };
          },
        },
      ],
    }),
  ],
};
