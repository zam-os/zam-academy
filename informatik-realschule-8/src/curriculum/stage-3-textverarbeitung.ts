import { fmt } from "../exercises/format";
import { caseLab } from "../lab/case-lab";
import { line, open, rect, text } from "../lab/svg";
import type { ExerciseGenerator, LabDefinition, LabValues, Stage } from "../model/types";
import { cases, cc, lesson, numberField, withSlips } from "./helpers";

const id = "textverarbeitung";

// ─── Lab: Schreibtempo ───────────────────────────────────────────────────

const tempo = (v: LabValues) => v.strokes / v.minutes;
const quote = (v: LabValues) => (v.errors / v.strokes) * 100;

const tempoLab: LabDefinition = {
  kind: "schreibtempo",
  title: "Schreibtempo messen",
  intro:
    "Stelle ein, wie viele Anschläge in welcher Zeit mit wie vielen Fehlern geschrieben wurden. Am Ende des Anfangsunterrichts sind mindestens 80 Anschläge pro Minute das Ziel.",
  params: [
    { key: "strokes", type: "range", label: "Anschläge", unit: "", min: 100, max: 1500, step: 50, value: 100 },
    { key: "minutes", type: "range", label: "Schreibzeit", unit: "min", min: 1, max: 10, step: 1, value: 2 },
    { key: "errors", type: "range", label: "Fehler", unit: "", min: 0, max: 20, step: 1, value: 5 },
  ],
  readouts: [
    { key: "tempo", label: "Anschläge pro Minute", digits: 1, emphasis: true, compute: tempo },
    { key: "quote", label: "Fehlerquote", unit: "%", digits: 2, compute: quote },
  ],
  goals: [
    { id: "ziel80", text: "Erreiche mindestens 80 Anschläge pro Minute.", check: (v) => tempo(v) >= 80 },
    {
      id: "zehn",
      text: "Erreiche in einer 10-Minuten-Abschrift genau 80 Anschläge pro Minute.",
      check: (v) => v.minutes === 10 && tempo(v) === 80,
    },
    {
      id: "sicher",
      text: "Schreibe mindestens 80 Anschläge pro Minute bei höchstens 0,5 % Fehlern.",
      check: (v) => tempo(v) >= 80 && quote(v) <= 0.5,
    },
  ],
  witnesses: {
    ziel80: { strokes: 400, minutes: 5, errors: 2 },
    zehn: { strokes: 800, minutes: 10, errors: 4 },
    sicher: { strokes: 1000, minutes: 10, errors: 5 },
  },
  view: {
    render(v) {
      const t = tempo(v);
      const width = Math.min(1, t / 200) * 400;
      let out = open("Tempoanzeige");
      out += rect(60, 80, 400, 50, "lab-shape", 'rx="10"');
      out += rect(60, 80, width, 50, t >= 80 ? "lab-fill-ok" : "lab-fill-a", 'rx="10"');
      const mark = 60 + (80 / 200) * 400;
      out += line(mark, 64, mark, 146, "lab-axis");
      out += text(mark, 58, "80", "lab-text-small", "middle");
      out += text(60, 166, "0", "lab-text-tick");
      out += text(460, 166, "200 Anschläge/min", "lab-text-tick", "end");
      out += text(260, 220, `${v.strokes} Anschläge ÷ ${v.minutes} min = ${fmt(t, 1)} Anschläge/min`, "lab-text", "middle");
      out += text(260, 256, `Fehlerquote: ${v.errors} ÷ ${v.strokes} · 100 % = ${fmt(quote(v), 2)} %`, "lab-text", "middle");
      out += text(260, 300, t >= 80 ? "Kompetenzniveau I erreicht: mindestens 80 Anschläge/min" : "Ziel: 80 Anschläge pro Minute", t >= 80 ? "lab-text-ok" : "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
};

const tempoTask: ExerciseGenerator = {
  id: "tempo-rechnen",
  make(rng, level) {
    if (level === 1) {
      const minutes = rng.pick([2, 4, 5, 8, 10]);
      const rate = rng.pick([60, 70, 75, 80, 90, 100, 120]);
      const strokes = rate * minutes;
      return {
        prompt: `Eine Abschrift hat ${fmt(strokes, 0)} Anschläge und dauert ${minutes} Minuten. Wie viele Anschläge pro Minute sind das?`,
        given: [`Anschläge: ${fmt(strokes, 0)}`, `Zeit: ${minutes} min`],
        formulaHint: "Anschläge pro Minute = Anschläge ÷ Minuten",
        fields: [withSlips(numberField("Tempo =", rate, "Anschläge/min"), [strokes * minutes, "Teile durch die Minuten, statt zu multiplizieren."])],
        steps: [`${fmt(strokes, 0)} ÷ ${minutes}`, `= ${rate}`, `<strong>${rate} Anschläge pro Minute</strong>`],
      };
    }
    const rate = rng.pick([80, 100, 120, 150]);
    const strokes = rate * rng.pick([5, 6, 8, 12, 15]);
    const minutes = strokes / rate;
    return {
      prompt: `Dein Tempo liegt bei ${rate} Anschlägen pro Minute. Wie viele Minuten brauchst du für einen Brief mit ${fmt(strokes, 0)} Anschlägen?`,
      given: [`Tempo: ${rate} Anschläge/min`, `Brief: ${fmt(strokes, 0)} Anschläge`],
      fields: [withSlips(numberField("Zeit =", minutes, "min"), [strokes * rate, "Teile die Anschläge durch das Tempo."], [rate / strokes, "Anschläge ÷ Tempo, nicht umgekehrt."])],
      steps: ["Zeit = Anschläge ÷ Anschläge pro Minute", `${fmt(strokes, 0)} ÷ ${rate} = ${fmt(minutes, 2)}`, `<strong>${fmt(minutes, 2)} min</strong>`],
    };
  },
};

// ─── Lab: Layout ─────────────────────────────────────────────────────────

const WRAPS = ["Mit Text in Zeile", "Quadratisch", "Oben und unten", "Hinter den Text"];

const layoutLab: LabDefinition = {
  kind: "layout",
  title: "Objekte im Dokument anordnen",
  intro:
    "Füge dem Schülerzeitungsartikel ein Bild, eine Fußzeile und eine Tabelle hinzu. Wähle Textumbruch, Skalierung und Gestaltung.",
  params: [
    { key: "wrap", type: "choice", label: "Textumbruch des Bildes", options: WRAPS.map((label, value) => ({ value, label })), value: 0 },
    {
      key: "scale",
      type: "choice",
      label: "Bildgröße geändert",
      options: [
        { value: 0, label: "am seitlichen Anfasser gezogen" },
        { value: 1, label: "am Eckanfasser gezogen (proportional)" },
      ],
      value: 0,
    },
    {
      key: "footer",
      type: "choice",
      label: "Fußzeile",
      options: [
        { value: 0, label: "leer" },
        { value: 1, label: "Seitenzahl" },
      ],
      value: 0,
    },
    {
      key: "head",
      type: "choice",
      label: "Tabelle",
      options: [
        { value: 0, label: "alle Zeilen gleich" },
        { value: 1, label: "Kopfzeile fett und schattiert" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "flow",
      label: "Textfluss",
      emphasis: true,
      compute: (v) =>
        ["Bild steht wie ein großer Buchstabe in der Zeile", "Text umfließt das Bild rechteckig", "Text steht nur über und unter dem Bild", "Bild liegt hinter dem Text (Wasserzeichen)"][v.wrap],
    },
    { key: "ratio", label: "Seitenverhältnis", compute: (v) => (v.scale === 1 ? "✓ erhalten" : "verzerrt") },
  ],
  goals: [
    { id: "umfliessen", text: "Lass den Text das Bild rechteckig umfließen.", check: (v) => v.wrap === 1 },
    {
      id: "proportional",
      text: "Das Bild wird umflossen und ist proportional, also unverzerrt, skaliert.",
      check: (v) => v.wrap === 1 && v.scale === 1,
    },
    {
      id: "fertig",
      text: "Setze die Seitenzahl in die Fußzeile und hebe die Kopfzeile der Tabelle hervor.",
      check: (v) => v.footer === 1 && v.head === 1,
    },
  ],
  view: {
    render(v) {
      let out = open("Dokumentseite mit Bild, Tabelle und Fußzeile");
      out += rect(110, 10, 300, 320, "lab-panel", 'rx="4"');
      out += text(130, 36, "Unsere neue Schulbibliothek", "lab-text");
      const imgW = v.scale === 1 ? 90 : 130;
      const imgH = v.scale === 1 ? 64 : 40;
      const imgY = 52;
      const lineAt = (y: number, x0: number, x1: number) => rect(x0, y, x1 - x0, 6, "lab-shape", 'rx="3"');
      if (v.wrap === 3) out += rect(150, 120, 220, 120, "lab-fill-c", 'opacity="0.5" rx="6"');
      if (v.wrap !== 3) out += rect(130, imgY, imgW, imgH, "lab-fill-a", 'rx="4"');
      if (v.wrap !== 3) out += text(130 + imgW / 2, imgY + imgH / 2 + 4, "Bild", "lab-text-small", "middle");
      for (let i = 0; i < 9; i++) {
        const y = 56 + i * 14;
        const besideImage = y < imgY + imgH;
        if (v.wrap === 1 && besideImage) out += lineAt(y, 140 + imgW, 390);
        else if ((v.wrap === 0 || v.wrap === 2) && besideImage) continue;
        else out += lineAt(y, 130, 390);
      }
      const tableY = 200;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          out += rect(130 + c * 86, tableY + r * 22, 86, 22, r === 0 && v.head === 1 ? "lab-fill-a" : "lab-shape");
        }
      }
      out += text(173, tableY + 15, "Titel", v.head === 1 ? "lab-text" : "lab-text-small", "middle");
      out += line(130, 300, 390, 300, "lab-grid");
      if (v.footer === 1) out += text(260, 318, "Seite 1 von 2", "lab-text-small", "middle");
      return `${out}</svg>`;
    },
  },
};

const skalieren: ExerciseGenerator = {
  id: "bild-proportional",
  make(rng, level) {
    const w = rng.pick([12, 15, 16, 18]);
    const h = rng.pick([8, 9, 10, 12]);
    if (level === 1) {
      const newW = rng.pick([6, 9, 10, 4].filter((n) => n < w));
      const newH = (h * newW) / w;
      return {
        prompt: `Ein Bild ist ${w} cm breit und ${h} cm hoch. Du ziehst es am Eckanfasser auf ${newW} cm Breite. Wie hoch wird es?`,
        given: [`Breite ${w} cm, Höhe ${h} cm`, `neue Breite ${newW} cm`],
        formulaHint: "Proportional: neue Höhe = Höhe · neue Breite ÷ Breite",
        fields: [withSlips(numberField("neue Höhe =", newH, "cm", 2), [h, "Am Eckanfasser ändert sich auch die Höhe."], [h - (w - newW), "Proportional heißt: mit demselben Faktor multiplizieren, nicht dieselbe Zahl abziehen."])],
        steps: [`Faktor = ${newW} ÷ ${w} = ${fmt(newW / w, 4)}`, `${h} cm · ${fmt(newW / w, 4)}`, `<strong>${fmt(newH, 2)} cm</strong>`],
      };
    }
    const percent = rng.pick([50, 75, 125, 150]);
    const newH = (h * percent) / 100;
    return {
      prompt: `Ein Foto (${w} cm × ${h} cm) soll im Layout der Schülerzeitung proportional auf ${percent} % skaliert werden. Welche Höhe hat es danach?`,
      given: [`${w} cm breit, ${h} cm hoch`, `Skalierung ${percent} %`],
      fields: [withSlips(numberField("Höhe =", newH, "cm", 2), [h + percent / 100, "Prozent heißt mal Anteil, nicht plus."], [(w * percent) / 100, "Gefragt ist die Höhe, nicht die Breite."])],
      steps: [`${percent} % = ${fmt(percent / 100, 2)}`, `${h} cm · ${fmt(percent / 100, 2)}`, `<strong>${fmt(newH, 2)} cm</strong>`],
    };
  },
};

export const STAGE_TEXTVERARBEITUNG: Stage = {
  id,
  stageNumber: 3,
  title: "Einführung in die Textverarbeitung",
  subtitle: "Tempo, Schreibregeln, Textobjekte und ansprechendes Layout",
  icon: "📝",
  accent: "#2563eb",
  badgeTitle: "Layout-Profi",
  lehrplanLabel: "IT 1.3 · ca. 14 Std.",
  module: "1.3",
  lessons: [
    lesson(id, "1.3", 1, {
      id: "it8-schreibtempo",
      title: "Schreibtempo, Sonderzeichen und Tastenkombinationen",
      subtitle: "80 Anschläge pro Minute, Ziffern und Zeichen, Kopieren und Einfügen",
      why: "Am Ende des Anfangsunterrichts schreibst du nach Vorlage mindestens 80 Anschläge pro Minute. Tastenkombinationen sparen bei jeder Abschrift Zeit.",
      html: `<p>Jeder Tastendruck, der ein Zeichen erzeugt, ist ein <strong>Anschlag</strong>, auch Leerzeichen und Satzzeichen. Für Großbuchstaben hältst du die <strong>Umschalttaste</strong> mit dem kleinen Finger der anderen Hand. Ziffern liegen in der Ziffernreihe über den Buchstaben, Sonderzeichen erreichst du mit Umschalt oder <strong>AltGr</strong>: Auf der deutschen Tastatur ist <strong>@ = AltGr + Q</strong> und <strong>€ = AltGr + E</strong>.</p>
<p><strong>Tastenkombinationen</strong> beschleunigen die Arbeit: <strong>Strg + C</strong> kopieren, <strong>Strg + X</strong> ausschneiden, <strong>Strg + V</strong> einfügen, <strong>Strg + Z</strong> rückgängig, <strong>Strg + A</strong> alles markieren, <strong>Strg + S</strong> speichern. Dein <strong>Schreibtempo</strong> berechnest du als Anschläge pro Minute; das Ziel für Kompetenzniveau I sind mindestens <strong>80 Anschläge pro Minute</strong>. Nach jeder Abschrift prüfst du sie mit den Korrektur- und Rechtschreibhilfen.</p>
<div class="example"><strong>Beispiel:</strong> In einer 10-Minuten-Abschrift schreibst du 850 Anschläge. 850 ÷ 10 = 85 Anschläge pro Minute: Das Ziel ist erreicht.</div>
<div class="merke"><strong>Merke:</strong> Anschläge pro Minute = Anschläge ÷ Minuten. Leerzeichen zählen mit. Ziel: mindestens 80 Anschläge pro Minute.</div>`,
      rule: "Anschläge pro Minute = Anschläge ÷ Minuten; Ziel am Ende des Anfangsunterrichts: mindestens <strong>80</strong>",
      terms: [
        ["Tastenkombinationen", "Strg + C · Strg + X · Strg + V · Strg + Z · Strg + A · Strg + S", "kopieren · ausschneiden · einfügen · rückgängig · alles markieren · speichern"],
        ["Sonderzeichen", "@ = AltGr + Q · € = AltGr + E · Großbuchstabe = Umschalt + Buchstabe", "deutsche Tastatur (QWERTZ)"],
      ],
      quiz: [
        "Mit welcher Tastenkombination fügst du einen kopierten Text ein?",
        "Strg + V",
        "Strg + C",
        "Strg + Z",
        "Strg + C kopiert, Strg + V fügt ein, Strg + Z macht den letzten Schritt rückgängig.",
      ],
      lab: tempoLab,
      exercises: [
        tempoTask,
        cases(
          "tastenkombinationen",
          [
            cc("Du hast versehentlich einen Absatz gelöscht. Welche Tastenkombination hilft sofort?", "Strg + Z", ["Strg + S", "Strg + A"], "Strg + Z macht den letzten Arbeitsschritt rückgängig.", "Z wie „zurück“."),
            cc("Wie schreibst du auf der deutschen Tastatur das Zeichen @?", "AltGr + Q", ["Umschalt + 2", "Strg + A"], "Das @ steht klein unten rechts auf der Q-Taste; erreichbar mit AltGr.", "Schau auf die kleine Beschriftung der Q-Taste."),
            cc("Welche Tastenkombination markiert den ganzen Text?", "Strg + A", ["Strg + X", "Strg + P"], "A steht für „alles“.", "A wie alles."),
          ],
          [
            cc(
              "Ein Satz steht im Dokument an der falschen Stelle. Mit welcher Folge verschiebst du ihn am schnellsten?",
              "Satz markieren, Strg + X, an der neuen Stelle klicken, Strg + V",
              ["Satz markieren, Strg + C, Strg + V", "Satz neu abtippen und den alten mit Entf löschen"],
              "Ausschneiden entfernt den Satz und legt ihn in die Zwischenablage; Einfügen setzt ihn neu ein.",
              "Soll der Satz an der alten Stelle bleiben?",
            ),
            cc(
              "In einer Rechnung steht „120 EUR“. Wie schreibst du das Eurozeichen direkt?",
              "AltGr + E",
              ["Umschalt + E", "Strg + E"],
              "Das €-Zeichen liegt auf der E-Taste und wird mit AltGr erreicht.",
              "Gleiche Taste wie der Buchstabe E.",
            ),
            cc(
              "Lisa schreibt 600 Anschläge in 10 Minuten. Was sagt das über ihr Ziel für Kompetenzniveau I?",
              "Mit 60 Anschlägen pro Minute liegt sie noch unter dem Ziel von 80.",
              ["Mit 6 000 Anschlägen pro Minute hat sie das Ziel weit übertroffen.", "Sie hat das Ziel genau erreicht."],
              "600 ÷ 10 = 60; das Ziel sind mindestens 80 Anschläge pro Minute.",
              "Rechne Anschläge ÷ Minuten.",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.3", 2, {
      id: "it8-din-5008",
      title: "Schreib- und Gestaltungsregeln nach DIN 5008",
      subtitle: "Datum, Uhrzeit, Telefonnummern, Zahlen, Prozent und Abkürzungen normgerecht",
      why: "Briefe, Bewerbungen und Protokolle wirken professionell, wenn Daten, Zahlen und Zeichen einheitlich geschrieben sind. Die Regeln dafür stehen in der Norm DIN 5008.",
      html: `<p>Die <strong>DIN 5008</strong> legt Schreib- und Gestaltungsregeln für Texte fest. Einige wichtige Regeln:</p>
<p><strong>Datum</strong> numerisch als <strong>2026-10-27</strong> (international) oder <strong>27.10.2026</strong>, alphanumerisch als <strong>27. Oktober 2026</strong>. <strong>Uhrzeit</strong> mit Doppelpunkt: <strong>14:30 Uhr</strong>. <strong>Telefonnummern</strong> werden mit Leerzeichen gegliedert: Vorwahl, Leerzeichen, Rufnummer, Durchwahl mit Bindestrich, z. B. <strong>0911 123456-12</strong> oder international <strong>+49 911 123456-12</strong>. Große <strong>Zahlen</strong> gliederst du von rechts in Dreiergruppen mit Leerzeichen (<strong>12 500</strong>), Geldbeträge auch mit Punkt (<strong>1.250,00 EUR</strong>). Vor <strong>%</strong> und Einheiten steht ein Leerzeichen (<strong>25 %</strong>, <strong>5 kg</strong>). Abkürzungen aus mehreren Wörtern bekommen ein Leerzeichen: <strong>z. B.</strong>, <strong>d. h.</strong> Satzzeichen stehen ohne Leerzeichen direkt am Wort, danach folgt ein Leerzeichen. Rechenzeichen stehen zwischen Leerzeichen: <strong>4 + 5 = 9</strong>.</p>
<div class="example"><strong>Beispiel:</strong> Aus „Treffen am 3.11.2026 um 9.00h, Tel. 0911/1234, Rabatt 10%, z.B. für Klasse 8b“ wird normgerecht „Treffen am 03.11.2026 um 09:00 Uhr, Tel. 0911 1234, Rabatt 10 %, z. B. für Klasse 8b“.</div>
<div class="merke"><strong>Merke:</strong> Leerzeichen vor % und Einheiten, in „z. B.“ und zwischen Vorwahl und Rufnummer; Doppelpunkt in der Uhrzeit; Datum 2026-10-27 oder 27.10.2026.</div>`,
      rule: "<strong>27.10.2026</strong> · <strong>14:30 Uhr</strong> · <strong>0911 123456-12</strong> · <strong>25 %</strong> · <strong>z. B.</strong> · <strong>12 500</strong>",
      terms: [
        ["DIN 5008", "Norm für Schreib- und Gestaltungsregeln", "Datum, Uhrzeit, Zahlen, Zeichen, Briefaufbau"],
        ["Leerzeichen-Regeln", "vor % und Einheiten · in mehrteiligen Abkürzungen · um Rechenzeichen", "kein Leerzeichen vor Satzzeichen"],
      ],
      quiz: [
        "Welche Schreibweise entspricht der DIN 5008?",
        "Der Rabatt beträgt 15 %.",
        "Der Rabatt beträgt 15%.",
        "Der Rabatt beträgt 15 v.H..",
        "Zwischen Zahl und Prozentzeichen steht ein Leerzeichen; „v.H..“ hat zudem zwei Punkte.",
      ],
      lab: caseLab({
        kind: "din-5008",
        title: "Normgerecht oder nicht?",
        intro: "Prüfe jede Schreibweise nach DIN 5008.",
        categories: ["normgerecht", "nicht normgerecht"],
        cases: [
          { short: "27.10.2026", text: "Datum: 27.10.2026", answer: 0, why: "Numerisches Datum mit Punkten ist zulässig.", hint: "TT.MM.JJJJ ist eine erlaubte Form." },
          { short: "2026-10-27", text: "Datum: 2026-10-27", answer: 0, why: "Internationale Form Jahr-Monat-Tag.", hint: "Diese Form empfiehlt die Norm sogar." },
          { short: "Tel. 0911/123456", text: "Telefon: 0911/123456", answer: 1, why: "Richtig: 0911 123456 mit Leerzeichen.", hint: "Wird die Vorwahl mit Schrägstrich abgetrennt?" },
          { short: "25%", text: "Anteil: 25%", answer: 1, why: "Richtig: 25 % mit Leerzeichen.", hint: "Steht vor dem % ein Leerzeichen?" },
          { short: "z.B.", text: "Abkürzung: z.B.", answer: 1, why: "Richtig: z. B. mit Leerzeichen.", hint: "Mehrteilige Abkürzungen bekommen ein Leerzeichen." },
          { short: "14:30 Uhr", text: "Uhrzeit: 14:30 Uhr", answer: 0, why: "Stunden und Minuten mit Doppelpunkt.", hint: "Doppelpunkt zwischen Stunden und Minuten ist richtig." },
        ],
        goals: [
          { text: "Erkenne beide zulässigen Datumsformen.", cases: [0, 1] },
          { text: "Finde alle drei Verstöße gegen die Norm.", cases: [2, 3, 4] },
          { text: "Beurteile alle sechs Schreibweisen richtig.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "din-schreibweise",
          [
            cc("Welche Uhrzeit ist nach DIN 5008 geschrieben?", "09:15 Uhr", ["9,15 h", "9h15"], "Stunden und Minuten werden mit Doppelpunkt gegliedert, dahinter „Uhr“.", "Doppelpunkt zwischen Stunde und Minute."),
            cc("Welche Telefonnummer ist normgerecht gegliedert?", "089 456789-0", ["089/456789-0", "(089) 456 789 0"], "Vorwahl und Rufnummer trennt ein Leerzeichen, die Durchwahl ein Bindestrich.", "Leerzeichen nach der Vorwahl."),
            cc("Wie wird die Zahl zwölftausendfünfhundert normgerecht gegliedert?", "12 500", ["12,500", "1 2500"], "Von rechts in Dreiergruppen mit Leerzeichen; ein Komma wäre ein Dezimaltrennzeichen.", "Dreiergruppen von rechts."),
          ],
          [
            cc(
              "Welche Zeile eines Elternbriefs ist vollständig normgerecht?",
              "Elternabend am 12.11.2026 um 19:00 Uhr, z. B. zur Klassenfahrt.",
              ["Elternabend am 12.11.2026 um 19.00h, z.B. zur Klassenfahrt.", "Elternabend am 12.11.2026 um 19:00 Uhr , z. B. zur Klassenfahrt."],
              "Doppelpunkt und „Uhr“ in der Zeit, Leerzeichen in „z. B.“, kein Leerzeichen vor dem Komma.",
              "Prüfe Uhrzeit, Abkürzung und Satzzeichen einzeln.",
            ),
            cc(
              "Welche Preisangabe passt in eine normgerechte Rechnung?",
              "1.250,00 EUR",
              ["EUR1250,-", "1250.00 EUR"],
              "Bei Beträgen ist der Punkt als Tausendertrennzeichen erlaubt, das Komma trennt die Cent; die Währung steht dahinter.",
              "Komma vor den Cent, Währung hinter dem Betrag.",
            ),
            cc(
              "Ein Plakat nennt die Rechnung „4+5=9“. Wie schreibt man sie normgerecht?",
              "4 + 5 = 9",
              ["4+ 5 =9", "4 +5= 9"],
              "Rechenzeichen und Gleichheitszeichen stehen zwischen Leerzeichen.",
              "Leerzeichen vor und nach jedem Rechenzeichen.",
            ),
          ],
        ),
        cases(
          "din-datum",
          [
            cc("Welche alphanumerische Datumsangabe ist richtig?", "3. Mai 2026", ["3 Mai 2026", "Mai 3. 2026"], "Tag mit Punkt, Monat ausgeschrieben, Jahr vierstellig.", "Tag mit Punkt zuerst."),
            cc("Wie schreibst du den 5. März 2026 in der internationalen Form?", "2026-03-05", ["2026-3-5", "05-03-2026"], "Jahr-Monat-Tag, Monat und Tag zweistellig.", "Jahr zuerst, zweistellig mit führender Null."),
            cc("Welche Schreibweise des 7. Juni 2026 mit Punkten ist richtig?", "07.06.2026", ["7.6.26.", "07/06/2026"], "Tag und Monat zweistellig, Punkte als Trenner, Jahr vierstellig.", "TT.MM.JJJJ"),
          ],
          [
            cc(
              "Ein Schülerprotokoll beginnt mit „Datum: 2026-11-04, 13.45h“. Welche Korrektur ist normgerecht?",
              "Datum: 2026-11-04, 13:45 Uhr",
              ["Datum: 4.11.26, 13.45h", "Datum: 2026-11-4, 13:45 h"],
              "Das internationale Datum stimmt schon; die Uhrzeit braucht Doppelpunkt und „Uhr“.",
              "Was stimmt bereits, was nicht?",
            ),
            cc(
              "Welche Datumsangabe ist eindeutig, auch für Leser in anderen Ländern?",
              "2026-01-02",
              ["01/02/2026", "1.2."],
              "Die Form Jahr-Monat-Tag wird international gleich gelesen; 01/02 kann 1. Februar oder 2. Januar heißen.",
              "Welche Form liest jeder gleich?",
            ),
            cc(
              "Du schreibst einen Brief am 31. Dezember 2026. Welche Datumszeile ist nach DIN 5008 möglich?",
              "31.12.2026",
              ["31.12.2026.", "31-12-2026"],
              "TT.MM.JJJJ ohne Schlusspunkt; die Bindestrich-Form steht nur in der Reihenfolge Jahr-Monat-Tag.",
              "Bindestriche nur bei Jahr-Monat-Tag.",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.3", 3, {
      id: "it8-textobjekte",
      title: "Objekte der Textverarbeitung: Zeichen, Absatz, Abschnitt, Dokument",
      subtitle: "Objekte, Attribute und Attributwerte unterscheiden und gezielt ändern",
      why: "Wer weiß, zu welchem Objekt eine Einstellung gehört, findet sie sofort und formatiert ganze Dokumente sauber statt Zeile für Zeile.",
      html: `<p>Ein Textdokument besteht aus <strong>Objekten</strong>, die ineinander liegen: Ein <strong>Dokument</strong> enthält einen oder mehrere <strong>Abschnitte</strong>, ein Abschnitt enthält <strong>Absätze</strong>, ein Absatz enthält <strong>Zeichen</strong>. Jedes Objekt hat <strong>Attribute</strong> (Eigenschaften) mit <strong>Attributwerten</strong>. Alle Attributwerte eines Objekts zusammen beschreiben seinen <strong>Zustand</strong>.</p>
<p><strong>Zeichen</strong>: Schriftart, Schriftgrad, Schriftfarbe, Schriftschnitt. <strong>Absatz</strong> (Text bis zur Absatzmarke ¶, die die Eingabetaste erzeugt): Ausrichtung (linksbündig, zentriert, rechtsbündig, Blocksatz), Zeilenabstand, Einzug, Abstand vor und nach. <strong>Abschnitt</strong>: Seitenränder, Seitenausrichtung (Hoch- oder Querformat), Spaltenanzahl. <strong>Dokument</strong>: Dateiname, Speicherort, Dateiformat. In der <strong>Punktnotation</strong> schreibst du Objekt.Attribut = Wert, z. B. <code>absatz2.ausrichtung = zentriert</code>.</p>
<div class="example"><strong>Beispiel:</strong> Die Überschrift soll in der Mitte stehen. Die Ausrichtung gehört zum Absatz: <code>absatz1.ausrichtung = zentriert</code>. Soll nur ein Wort fett werden, änderst du ein Attribut der Zeichen: <code>zeichen12.schriftschnitt = fett</code>.</div>
<div class="merke"><strong>Merke:</strong> Zeichen → Schrift. Absatz → Ausrichtung, Zeilenabstand, Einzug. Abschnitt → Seitenränder, Hoch-/Querformat. Dokument → Dateiname. Objekt.Attribut = Attributwert.</div>`,
      rule: "<code>Objekt.Attribut = Attributwert</code>; Dokument ⊃ Abschnitt ⊃ Absatz ⊃ Zeichen",
      terms: [
        ["Objekt · Attribut · Attributwert", "z. B. absatz1 · ausrichtung · zentriert", "Zustand = alle Attributwerte eines Objekts"],
        ["Absatz", "Text bis zur Absatzmarke ¶ (Eingabetaste)", "Attribute: Ausrichtung, Zeilenabstand, Einzug, Abstand vor/nach"],
      ],
      quiz: [
        "Zu welchem Objekt gehört das Attribut Zeilenabstand?",
        "Absatz",
        "Zeichen",
        "Dokument",
        "Der Zeilenabstand gilt für einen ganzen Absatz bis zur Absatzmarke, nicht für einzelne Zeichen.",
      ],
      lab: caseLab({
        kind: "textobjekte",
        title: "Welches Objekt hat dieses Attribut?",
        intro: "Ordne jede Einstellung dem Objekt zu, zu dem sie als Attribut gehört.",
        categories: ["Zeichen", "Absatz", "Abschnitt", "Dokument"],
        cases: [
          { short: "Schriftgrad 12 pt", text: "Schriftgrad = 12 pt", answer: 0, why: "Die Größe der Schrift ist ein Zeichenattribut.", hint: "Betrifft es einzelne Buchstaben?" },
          { short: "Zeilenabstand 1,5", text: "Zeilenabstand = 1,5-fach", answer: 1, why: "Er gilt für den ganzen Absatz.", hint: "Gilt es für mehrere Zeilen bis zur Absatzmarke?" },
          { short: "Blocksatz", text: "Ausrichtung = Blocksatz", answer: 1, why: "Ausrichtung ist ein Absatzattribut.", hint: "Kann ein einzelnes Wort Blocksatz haben?" },
          { short: "Seitenrand 2,5 cm", text: "Seitenrand links = 2,5 cm", answer: 2, why: "Seitenränder gelten für einen Abschnitt.", hint: "Betrifft es die ganze Seite?" },
          { short: "Querformat", text: "Seitenausrichtung = Querformat", answer: 2, why: "Hoch- oder Querformat legt der Abschnitt fest.", hint: "Betrifft es die ganze Seite?" },
          { short: "Referat.docx", text: "Dateiname = Referat.docx", answer: 3, why: "Den Namen hat das ganze Dokument.", hint: "Welches Objekt wird gespeichert?" },
        ],
        goals: [
          { text: "Ordne Schriftgrad und Zeilenabstand richtig zu.", cases: [0, 1] },
          { text: "Ordne beide Seiteneinstellungen dem richtigen Objekt zu.", cases: [3, 4] },
          { text: "Ordne alle sechs Attribute richtig zu.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "objekt-attribut",
          [
            cc("Zu welchem Objekt gehört das Attribut Schriftfarbe?", "Zeichen", ["Absatz", "Abschnitt"], "Jedes Zeichen kann eine eigene Farbe haben.", "Kann ein einzelner Buchstabe rot sein?"),
            cc("Zu welchem Objekt gehört das Attribut Erstzeileneinzug?", "Absatz", ["Zeichen", "Dokument"], "Ein Einzug rückt die erste Zeile eines Absatzes ein.", "Was hat eine erste Zeile?"),
            cc("Wie nennt man alle Attributwerte eines Objekts zu einem Zeitpunkt zusammen?", "Zustand", ["Klasse", "Methode"], "Der Zustand ändert sich, wenn ein Attributwert geändert wird.", "Wie ist das Objekt gerade?"),
          ],
          [
            cc(
              "Nur die letzte Seite eines Berichts soll im Querformat erscheinen. Was brauchst du?",
              "Einen eigenen Abschnitt für die letzte Seite mit seitenausrichtung = Querformat.",
              ["Einen neuen Absatz mit ausrichtung = quer.", "Ein neues Dokument mit anderem Dateinamen."],
              "Seitenausrichtung ist ein Abschnittsattribut; ein neuer Abschnitt kann andere Werte haben.",
              "Welches Objekt legt das Format einer Seite fest?",
            ),
            cc(
              "Ein Mitschüler markiert in jeder Zeile einzeln den Text, um den Absatz zu zentrieren. Was geht schneller?",
              "Den Cursor in den Absatz setzen und die Absatzausrichtung ändern.",
              ["Jedes Zeichen einzeln fett machen.", "Leerzeichen vor jede Zeile tippen."],
              "Absatzattribute gelten für den ganzen Absatz; der Cursor darin genügt.",
              "Für welches Objekt gilt die Ausrichtung?",
            ),
            cc(
              "Welche Punktnotation beschreibt: „Der zweite Absatz wird rechtsbündig“?",
              "absatz2.ausrichtung = rechtsbündig",
              ["zeichen2.ausrichtung = rechtsbündig", "absatz2.rechtsbündig = ausrichtung"],
              "Objekt.Attribut = Attributwert; die Ausrichtung ist ein Absatzattribut.",
              "Erst Objekt, dann Attribut, dann Wert.",
            ),
          ],
        ),
        cases(
          "punktnotation",
          [
            cc("Was bedeutet zeichen5.schriftschnitt = fett?", "Das fünfte Zeichen wird fett.", ["Der fünfte Absatz wird fett.", "Fünf Zeichen werden kursiv."], "Objekt zeichen5, Attribut schriftschnitt, Wert fett.", "Lies Objekt, Attribut, Wert."),
            cc("In absatz1.zeilenabstand = 1,5 ist „1,5“ …", "der Attributwert", ["das Attribut", "das Objekt"], "Hinter dem Gleichheitszeichen steht der Attributwert.", "Was steht rechts vom =?"),
            cc("Welches Objekt enthält die anderen Objekte der Textverarbeitung?", "Das Dokument", ["Das Zeichen", "Der Absatz"], "Dokument ⊃ Abschnitt ⊃ Absatz ⊃ Zeichen.", "Welches ist das größte?"),
          ],
          [
            cc(
              "Die Überschrift soll 16 pt groß und zentriert sein. Welche zwei Objekte ändern sich?",
              "Die Zeichen (schriftgrad = 16 pt) und der Absatz (ausrichtung = zentriert).",
              ["Nur der Absatz (schriftgrad = 16 pt, ausrichtung = zentriert).", "Nur das Dokument (dateiname = Überschrift)."],
              "Schriftgrad ist ein Zeichenattribut, Ausrichtung ein Absatzattribut.",
              "Ordne jedes Attribut einzeln zu.",
            ),
            cc(
              "Vor der Änderung war absatz3.ausrichtung = linksbündig, danach zentriert. Was hat sich geändert?",
              "Der Zustand des Objekts absatz3.",
              ["Das Objekt absatz3 wurde gelöscht.", "Das Attribut ausrichtung gibt es nicht mehr."],
              "Ein neuer Attributwert ändert den Zustand; Objekt und Attribut bleiben.",
              "Welcher Teil hat sich verändert: Objekt, Attribut oder Wert?",
            ),
            cc(
              "Ein Dokument hat zwei Abschnitte. Im ersten ist seitenrand.links = 2,5 cm, im zweiten 4 cm. Ist das möglich?",
              "Ja, jeder Abschnitt hat eigene Attributwerte.",
              ["Nein, ein Dokument hat immer nur einen Seitenrand.", "Nur, wenn beide Abschnitte gleich lang sind."],
              "Abschnitte sind eigene Objekte und können verschiedene Werte haben.",
              "Sind Abschnitte eigene Objekte?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.3", 4, {
      id: "it8-layout-objekte",
      title: "Grafiken, Tabellen, Kopf- und Fußzeilen einfügen",
      subtitle: "Weitere Objekte einfügen, Textumbruch und Wirkung des Layouts",
      why: "Ein Bild an der richtigen Stelle, eine klare Tabelle und Seitenzahlen machen aus einem Text ein Dokument, das man gern liest.",
      html: `<p>Neben Zeichen und Absätzen kannst du <strong>weitere Objekte</strong> einfügen: <strong>Grafiken</strong> (Bilder, Formen), <strong>Tabellen</strong> und <strong>Kopf- und Fußzeilen</strong>. Kopf- und Fußzeilen erscheinen auf jeder Seite; dort stehen Seitenzahl, Name oder Datum.</p>
<p>Der <strong>Textumbruch</strong> legt fest, wie Text und Bild zusammenwirken: <strong>Mit Text in Zeile</strong> (das Bild steht wie ein großer Buchstabe in der Zeile), <strong>Quadratisch</strong> (der Text umfließt das Bild rechteckig), <strong>Oben und unten</strong> (Text nur über und unter dem Bild), <strong>Hinter den Text</strong> (wie ein Wasserzeichen). Ein Bild vergrößerst oder verkleinerst du am <strong>Eckanfasser</strong>, damit das Seitenverhältnis erhalten bleibt. Das <strong>Layout</strong> wirkt: Weißraum, wenige Schriften und eine hervorgehobene Tabellenkopfzeile machen eine Seite übersichtlich.</p>
<div class="example"><strong>Beispiel:</strong> Ein Foto 12 cm × 8 cm wird am Eckanfasser auf 9 cm Breite verkleinert. Der Faktor ist 9 ÷ 12 = 0,75, also wird es 8 cm · 0,75 = 6 cm hoch. Mit „Quadratisch“ läuft der Artikel rechts daneben weiter.</div>
<div class="merke"><strong>Merke:</strong> Textumbruch bestimmt, wie Text ein Bild umfließt. Am Eckanfasser skalieren erhält das Seitenverhältnis. Kopf- und Fußzeile wiederholen sich auf jeder Seite.</div>`,
      rule: "Eckanfasser: neue Höhe = Höhe · neue Breite ÷ Breite; Textumbruch „Quadratisch“ = Text umfließt rechteckig",
      terms: [
        ["Textumbruch", "Mit Text in Zeile · Quadratisch · Oben und unten · Hinter den Text", "Wie Text und Bild zusammenwirken"],
        ["Kopf- und Fußzeile", "Bereiche am oberen und unteren Seitenrand", "wiederholen sich auf jeder Seite, z. B. Seitenzahl"],
      ],
      quiz: [
        "Ein Schullogo soll blass hinter dem ganzen Text eines Briefes liegen. Welchen Textumbruch wählst du?",
        "Hinter den Text",
        "Quadratisch",
        "Mit Text in Zeile",
        "„Hinter den Text“ legt die Grafik in eine Ebene unter den Text, wie ein Wasserzeichen.",
      ],
      lab: layoutLab,
      exercises: [
        skalieren,
        cases(
          "layout-entscheiden",
          [
            cc("Auf jeder Seite soll unten die Seitenzahl stehen. Wo fügst du sie ein?", "In der Fußzeile", ["Im letzten Absatz jeder Seite", "In der Kopfzeile der Tabelle"], "Die Fußzeile wiederholt sich automatisch auf jeder Seite.", "Was erscheint auf jeder Seite unten?"),
            cc("Der Text soll ein Bild auf der linken Seite rechteckig umfließen. Welcher Textumbruch passt?", "Quadratisch", ["Oben und unten", "Mit Text in Zeile"], "Bei „Quadratisch“ fließt der Text um den Bildrahmen.", "Rechteckig umfließen."),
            cc("Wie vergrößerst du ein Foto, ohne es zu verzerren?", "Am Eckanfasser ziehen.", ["Am seitlichen Anfasser ziehen.", "Den Schriftgrad erhöhen."], "Am Eckanfasser ändern sich Breite und Höhe im gleichen Verhältnis.", "Wo ändern sich beide Seiten gleichzeitig?"),
          ],
          [
            cc(
              "In einer Vereinszeitung zerreißt ein großes Bild „Mit Text in Zeile“ den Zeilenabstand. Was verbessert das Layout?",
              "Textumbruch „Quadratisch“ oder „Oben und unten“ wählen.",
              ["Das Bild am seitlichen Anfasser schmaler ziehen.", "Den ganzen Text kursiv setzen."],
              "Ein Bild in der Zeile wirkt wie ein riesiger Buchstabe; ein anderer Umbruch löst es aus der Zeile.",
              "Warum wird die Zeile so hoch?",
            ),
            cc(
              "Eine Tabelle mit 30 Zeilen geht über zwei Seiten. Was hilft den Lesern auf der zweiten Seite?",
              "Die hervorgehobene Kopfzeile auf jeder Seite wiederholen.",
              ["Die Tabelle in eine Grafik umwandeln.", "Auf der zweiten Seite die Schrift verkleinern."],
              "Mit wiederholter Überschriftenzeile wissen Leser auch auf Seite 2, was in jeder Spalte steht.",
              "Was fehlt auf Seite 2 sonst?",
            ),
            cc(
              "Ein Flyer wirkt überladen: sechs Bilder, vier Schriftarten, kein Rand. Welche Änderung verbessert die Wirkung am meisten?",
              "Wenige Bilder, höchstens zwei Schriftarten und genügend Weißraum.",
              ["Mehr Farben, damit alles auffällt.", "Alle Bilder hinter den Text legen."],
              "Weißraum und Einheitlichkeit lenken den Blick; Überladung verwirrt.",
              "Was macht eine Seite übersichtlich?",
            ),
          ],
        ),
      ],
    }),
  ],
};
