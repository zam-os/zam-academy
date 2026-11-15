import type { LabDefinition, LabValues, Stage } from "../model/types";
import { caseLab } from "../lab/case-lab";
import { clamp, esc, H, open, rect, text, line, circle, W } from "../lab/svg";
import { cases, cc, lesson, numberField, withSlips } from "./helpers";

const STAGE_ID = "stage-2-praesentation-projekt";

// ─── Lab 1: Qualitätskriterien einer Multimediapräsentation ──────────────────

const praesentationLab: LabDefinition = {
  kind: "inf6-praesentation-qualitaet",
  title: "Folien-Prüfer im Klassenzimmer",
  intro:
    "Stelle Textmenge, Schriftgröße, Farbkontrast und Animation so ein, dass die Folie auch in der letzten Reihe klar lesbar und ruhig bleibt.",
  params: [
    {
      key: "words",
      type: "range",
      label: "Wörter auf der Folie",
      unit: "Wörter",
      min: 12,
      max: 96,
      step: 6,
      value: 78,
    },
    {
      key: "fontSize",
      type: "range",
      label: "Schriftgröße (Stichpunkte)",
      unit: "pt",
      min: 12,
      max: 32,
      step: 2,
      value: 14,
    },
    {
      key: "contrast",
      type: "choice",
      label: "Farbkombination (Text / Hintergrund)",
      options: [
        { value: 0, label: "Hellgrau auf Weiß (zu flau)" },
        { value: 1, label: "Neongrün auf Rot (grell)" },
        { value: 2, label: "Dunkelblau auf Hellcreme (starker Kontrast)" },
      ],
      value: 0,
    },
    {
      key: "animMode",
      type: "choice",
      label: "Animationseinsatz",
      options: [
        { value: 0, label: "Jedes Wort dreht und hüpft einzeln" },
        { value: 1, label: "Stichpunkte einzeln ruhig einblenden" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "textmenge",
      label: "Textanteil",
      compute: (v) =>
        v.words <= 36
          ? `Kompakt (${v.words} Wörter · gute Stichpunkte)`
          : `Überladen (${v.words} Wörter · zu viel Fließtext)`,
    },
    {
      key: "lesbarkeit",
      label: "Lesbarkeit (letzte Reihe)",
      compute: (v) => {
        if (v.fontSize < 20) return `Zu klein (${v.fontSize} pt < 20 pt)`;
        if (v.contrast !== 2) return "Schlechter Farbkontrast";
        return `Sehr gut (${v.fontSize} pt, klarer Kontrast)`;
      },
    },
    {
      key: "bewertung",
      label: "Gesamturteil",
      emphasis: true,
      compute: (v) =>
        v.words <= 36 && v.fontSize >= 22 && v.contrast === 2 && v.animMode === 1
          ? "Überzeugende Präsentationsfolie"
          : "Noch nachbessern",
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Begrenze den Text auf höchstens 36 Wörter und stelle mindestens 22 pt Schriftgröße ein.",
      check: (v) => v.words <= 36 && v.fontSize >= 22,
    },
    {
      id: "g2",
      text: "Wähle eine kontrastreiche Farbkombination und einen zielgerichteten Animationseinsatz.",
      check: (v) => v.contrast === 2 && v.animMode === 1,
    },
    {
      id: "g3",
      text: "Erfülle alle vier Qualitätskriterien gleichzeitig (≤ 30 Wörter, ≥ 24 pt, hoher Kontrast, ruhige Animation).",
      check: (v) => v.words <= 30 && v.fontSize >= 24 && v.contrast === 2 && v.animMode === 1,
    },
  ],
  witnesses: {
    g1: { words: 24, fontSize: 24, contrast: 0, animMode: 0 },
    g2: { words: 78, fontSize: 14, contrast: 2, animMode: 1 },
    g3: { words: 24, fontSize: 24, contrast: 2, animMode: 1 },
  },
  view: {
    handles: {
      wordsHandle: {
        x: "words",
        drag(point: { x: number; y: number }): Partial<LabValues> {
          const t = (point.x - 40) / 440;
          const raw = Math.round((12 + clamp(t, 0, 1) * 84) / 6) * 6;
          return { words: clamp(raw, 12, 96) };
        },
      },
      sizeHandle: {
        y: "fontSize",
        drag(point: { x: number; y: number }): Partial<LabValues> {
          const t = (268 - point.y) / 170;
          const raw = Math.round((12 + clamp(t, 0, 1) * 20) / 2) * 2;
          return { fontSize: clamp(raw, 12, 32) };
        },
      },
    },
    render(v) {
      const words = v.words;
      const fontSize = v.fontSize;
      const contrast = v.contrast;
      const animOk = v.animMode === 1;

      const bgFill = contrast === 0 ? "#f8fafc" : contrast === 1 ? "#dc2626" : "#fffdf7";
      const textColor = contrast === 0 ? "#cbd5e1" : contrast === 1 ? "#39ff14" : "#0f274a";
      const titleColor = contrast === 0 ? "#94a3b8" : contrast === 1 ? "#fde047" : "#1d58c9";

      const samplePx = Math.round(9 + ((fontSize - 12) / 20) * 10);
      const numBullets = Math.min(7, Math.max(2, Math.round(words / 14)));
      const wordsPerBullet = Math.round(words / numBullets);

      const handleWordX = 40 + ((words - 12) / 84) * 440;
      const handleSizeY = 268 - ((fontSize - 12) / 20) * 170;

      const bulletsSvg = Array.from({ length: numBullets }, (_, idx) => {
        const lineY = 148 + idx * (samplePx + 5);
        if (lineY > 258) return "";
        const txt =
          words <= 36
            ? `• Stichpunkt ${idx + 1}: Kernbegriff (${wordsPerBullet} W.)`
            : `• Langer Absatzeintrag ${idx + 1} mit zu viel Fließtext ...`;
        return `<text x="58" y="${lineY}" font-size="${samplePx}" fill="${textColor}" font-weight="500">${esc(txt.slice(0, 44))}</text>`;
      }).join("");

      const animBadgeCls = animOk ? "lab-fill-ok" : "lab-bad";
      const animLabel = animOk ? "Animation: gezielt (Stichpunkte nacheinander)" : "Animation: unruhig (lenkt vom Vortrag ab)";

      return [
        open("Folien-Prüfer im Klassenzimmer"),
        rect(20, 14, W - 40, 22, "lab-panel", `rx="6"`),
        line(40, 25, 480, 25, "lab-thin"),
        rect(40, 21, ((36 - 12) / 84) * 440, 8, "lab-fill-ok", `rx="4"`),
        `<g class="lab-handle lab-handle-a" data-handle="wordsHandle" role="slider" aria-label="Wörter je Folie" aria-valuemin="12" aria-valuemax="96" aria-valuenow="${words}">`,
        circle(handleWordX, 25, 16, "lab-handle-hit"),
        circle(handleWordX, 25, 7, "lab-handle-dot"),
        text(handleWordX, 49, `${words} Wörter`, words <= 36 ? "lab-text-ok" : "lab-text-bad", "middle"),
        "</g>",
        `<rect x="36" y="72" width="424" height="202" rx="10" fill="${bgFill}" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.5" />`,
        `<text x="58" y="108" font-size="${Math.min(24, samplePx + 5)}" fill="${titleColor}" font-weight="700">Aufbau einer Pflanzenzelle</text>`,
        `<line x1="58" y1="118" x2="438" y2="118" stroke="${titleColor}" stroke-opacity="0.35" stroke-width="1.5" />`,
        bulletsSvg,
        rect(36, 286, 424, 28, animBadgeCls, `rx="8"`),
        text(248, 304, animLabel, animOk ? "lab-text-ok" : "lab-text-bad", "middle"),
        line(482, 98, 482, 268, "lab-thin"),
        `<g class="lab-handle lab-handle-b" data-handle="sizeHandle" role="slider" aria-label="Schriftgröße in Punkt" aria-valuemin="12" aria-valuemax="32" aria-valuenow="${fontSize}">`,
        circle(482, handleSizeY, 16, "lab-handle-hit"),
        circle(482, handleSizeY, 7, "lab-handle-dot"),
        text(482, handleSizeY - 12, `${fontSize} pt`, fontSize >= 22 ? "lab-text-ok" : "lab-text-bad", "middle"),
        "</g>",
        text(260, H - 6, "Ziehe oben (Wörter), rechts (pt) oder nutze die Regler.", "lab-text-muted", "middle"),
        "</svg>",
      ].join("");
    },
  },
};

// ─── Lab 2: Urheberrecht & Quellenangaben (Sortier-Werkstatt) ────────────────

const urheberrechtLab = caseLab({
  kind: "inf6-urheberrecht-quellen",
  title: "Urheberrechts-Werkstatt für Präsentationen",
  intro: "Ordne jeden Praxisfall aus einem Schulprojekt der passenden rechtlichen Bewertung zu.",
  categories: [
    "Eigenes Werk (erlaubt, ohne Lizenz)",
    "Fremdes Werk mit freier Lizenz + Quelle (erlaubt)",
    "Nicht erlaubt oder unzureichende Quelle",
  ],
  cases: [
    {
      short: "Selbst im Schulgarten fotografiert",
      text: "Du fotografierst eine Blüte im Schulgarten selbst und fügst dein eigenes Foto in die Folie ein.",
      answer: 0,
      why: "Du bist selbst Urheberin oder Urheber des Fotos und darfst es direkt verwenden.",
      hint: "Wer hat das Bild aufgenommen? Bei eigenen Fotos hältst du selbst die Rechte.",
    },
    {
      short: "CC-BY-Grafik + vollständige Quelle",
      text: "Du nutzt eine Grafik unter freier CC-BY-Lizenz und gibst Urheber, Titel, Lizenz und Link genau an.",
      answer: 1,
      why: "Freie Lizenzen erlauben die Nutzung, wenn Bedingungen wie Namensnennung und Link erfüllt sind.",
      hint: "Prüfe, ob die Lizenzbedingungen (Urheber, Lizenzname, Fundort) komplett erfüllt werden.",
    },
    {
      short: "Bild aus Suche + Quelle ‚Google‘",
      text: "Du lädst ein beliebiges Bild aus der Bildersuche herunter und schreibst als Quelle nur ‚Google‘.",
      answer: 2,
      why: "Eine Suchmaschine ist kein Urheber und keine Quelle; außerdem fehlt die Erlaubnis des Rechteinhabers.",
      hint: "Suchmaschinen zeigen Bilder fremder Seiten an – sie geben selbst keine Nutzungsrechte.",
    },
    {
      short: "Popsong im öffentlichen Upload",
      text: "Du hinterlegst ein ganzes aktuelles Chart-Lied und lädst die Präsentation öffentlich auf der Schulwebseite hoch.",
      answer: 2,
      why: "Musikstücke sind urheberrechtlich geschützt; öffentliche Wiedergabe im Internet braucht Erlaubnis oder Lizenz.",
      hint: "Sobald Dateien öffentlich im Internet stehen, greifen strenge Schranken des Urheberrechts.",
    },
    {
      short: "Selbst gezeichnete Vektorgrafik",
      text: "Du zeichnest einen Versuchsaufbau selbst aus Rechtecken und Pfeilen im Vektorgrafikprogramm.",
      answer: 0,
      why: "Selbst erstellte Zeichnungen und Diagramme sind eigene Werke – fremde Rechte werden nicht berührt.",
      hint: "Eigenleistung schützt zuverlässig vor Urheberrechtsproblemen.",
    },
    {
      short: "Gemeinfreie Grafik (CC0) + Fundstelle",
      text: "Du wählst ein gemeinfreies Foto (CC0) aus einem freien Medienarchiv und nennst die Fundstelle korrekt.",
      answer: 1,
      why: "Gemeinfreie / CC0-Medien dürfen genutzt werden, und eine saubere Quellenangabe belegt ihre Herkunft.",
      hint: "Es handelt sich um ein fremdes Werk, das aber unter einer freien Freigabe steht.",
    },
  ],
  goals: [
    {
      text: "Ordne die beiden eigenen Werke (Fall 1 und Fall 5) richtig ein.",
      cases: [0, 4],
    },
    {
      text: "Erkenne beide Verstöße bzw. mangelhaften Quellen (Fall 3 und Fall 4).",
      cases: [2, 3],
    },
    {
      text: "Ordne alle sechs Praxisfälle korrekt ein.",
      cases: [0, 1, 2, 3, 4, 5],
    },
  ],
});

// ─── Stage 2 Definition ───────────────────────────────────────────────────────

export const STAGE_PRAESENTATION_PROJEKT: Stage = {
  id: STAGE_ID,
  stageNumber: 2,
  title: "Projekt: Multimediapräsentation",
  subtitle: "Qualitätskriterien guter Folien, Zeitplanung sowie Urheberrecht und saubere Quellenangaben",
  icon: "🎬",
  accent: "#0b7265",
  badgeTitle: "Souveräner Medienprofi",
  lehrplanLabel: "NT6 2.2 · ca. 4 Std.",
  module: "2.2",
  lessons: [
    lesson(STAGE_ID, "2.2", 1, {
      id: "inf6-praesentation-qualitaet",
      title: "Präsentationen planen und gestalten",
      subtitle: "Textanteil, Schriftgröße, Farbwahl, zielgerichtete Animationen und Zeitrahmen",
      why: "Selbst das beste Wissen geht unter, wenn das Publikum auf zu kleine oder überladene Folien starrt.",
      html: `<p>Eine <strong>Multimediapräsentation</strong> unterstützt deinen freien Vortrag – sie ist kein Ableseskript. Gute Folien richten sich nach festen <strong>Qualitätskriterien</strong>:</p>
<ul>
<li><strong>Textanteil je Folie:</strong> Nutze knappe Stichpunkte (höchstens etwa fünf bis sieben Zeilen mit wenigen Wörtern), keine langen Absätze im Fließtext.</li>
<li><strong>Schriftgröße:</strong> Auch in der letzten Reihe muss jeder Buchstabe klar lesbar sein (Fließtext mindestens <code>20 pt</code> bis <code>24 pt</code>, Überschriften etwa <code>32 pt</code> bis <code>40 pt</code>).</li>
<li><strong>Farbwahl und Kontrast:</strong> Wähle einen ruhigen Hintergrund mit hohem Hell-Dunkel-Kontrast (z. B. dunkle Schrift auf hellem Grund) und beschränke dich auf höchstens zwei bis drei aufeinander abgestimmte Farben.</li>
<li><strong>Zielgerichtete Animationen:</strong> Blende Stichpunkte oder Teilschritte nacheinander ein, damit das Publikum mitdenkt. Wilde Dreheffekte lenken nur ab.</li>
<li><strong>Zeitrahmen:</strong> Plane für Titel- und Quellenfolie kurz Zeit ein und berechne realistisch <code>45 s</code> bis <code>90 s</code> pro Inhaltsfolie.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Für einen <code>6</code> Minuten dauernden Vortrag (<code>360 s</code>) reserviert eine Gruppe <code>60 s</code> für Begrüßung, Titelfolie und Schlussfolie. Für die verbleibenden <code>300 s</code> entwirft sie <code>5</code> Inhaltsfolien zu je <code>60 s</code> – jede Folie trägt maximal <code>25</code> bis <code>30</code> Wörter in <code>24 pt</code> dunkelblauer Schrift auf hellem Hintergrund.</div>
<div class="merke"><strong>Merke:</strong> Kurz, groß, kontrastreich und ruhig: Folien zeigen Stichpunkte und Bilder, nicht den ganzen Vortragstext – und ihre Anzahl muss zum Zeitrahmen passen.</div>`,
      rule: "Wenige Stichpunkte, große Schrift (≥ 20–24 pt), starker Kontrast und gezielte Animationen",
      terms: [
        ["Textanteil je Folie", "Kurze Stichpunkte statt langer Sätze (ca. 5–7 Zeilen)", "Entlastet das Publikum beim Zuhören"],
        ["Schriftgröße", "Mindestens ca. 20–24 pt für Text, ≥ 32 pt für Überschriften", "Auch von ganz hinten lesbar"],
        ["Farbwahl & Kontrast", "Ruhiger Hintergrund, hoher Kontrast, max. 2–3 Farben", "Sorgt für Klarheit ohne Ablenkung"],
        ["Zielgerichtete Animation", "Stichpunkte einzeln passend zum Sprechen einblenden", "Unterstützt den roten Faden statt zu stören"],
      ],
      quiz: [
        "Welche Gestaltung entspricht den Qualitätskriterien einer guten Präsentationsfolie am besten?",
        "Maximal fünf knappe Stichpunkte in 24 pt, hoher Hell-Dunkel-Kontrast und gezieltes Einblenden",
        "Ein ganzer Aufsatz in 12 pt Schriftgröße, damit man nichts auswendig lernen muss",
        "Sieben verschiedene Schriftarten und jedes Wort einzeln mit Hüpf-Effekt einfliegen lassen",
        "Knappe Stichpunkte in großer, kontrastreicher Schrift sind schnell erfassbar und lenken den Blick auf das Wesentliche.",
      ],
      lab: praesentationLab,
      exercises: [
        cases(
          "inf6-praes-kriterien",
          [
            cc(
              "Eine Gruppenfolie enthält drei kurze Absätze Fließtext mit zusammen 95 Wörtern in Schriftgröße 14 pt.",
              "Text radikal auf knappe Stichpunkte kürzen und die Schriftgröße auf mindestens 20–24 pt erhöhen",
              [
                "Die Schrift auf 10 pt verkleinern, damit noch ein weiterer Absatz auf dieselbe Folie passt",
                "Alle Wörter rot einfärben und blinken lassen, ohne den Text zu kürzen",
              ],
              "Fließtext in 14 pt überfordert die Augen aus der letzten Reihe; Stichpunkte und größere Schrift schaffen Überblick.",
              "Wie müssen Textanteil und Schriftgröße geändert werden, damit man sofort folgen kann?",
            ),
            cc(
              "Wann ist eine Animation beim Einblenden von vier Stichpunkten sinnvoll eingesetzt?",
              "Wenn jeder Stichpunkt genau dann erscheint, wenn er im Vortrag angesprochen wird",
              [
                "Wenn alle Buchstaben einzeln zehn Sekunden lang über die Folie wirbeln",
                "Wenn auf einer leeren Deko-Folie dauerhaft ein Blitz animiert wird",
              ],
              "Schrittweises Einblenden verhindert, dass Zuhörer vorab alles lesen, und unterstützt den Gedankengang.",
              "Zielgerichtete Animationen dienen dem Verstehen, nicht der Show.",
            ),
            cc(
              "Welche Farbkombination bietet im Klassenraum die zuverlässigste Lesbarkeit?",
              "Sehr dunkle Schrift (z. B. Dunkelblau) auf einem hellen, ruhigen Hintergrund",
              [
                "Hellgelbe Schrift auf einem grell weißen Hintergrund",
                "Hellrote Schrift direkt über einem bunten Urlaubsfoto ohne Rahmen",
              ],
              "Hoher Helligkeitskontrast auf ruhigem Hintergrund bleibt auch bei Tageslicht im Klassenzimmer scharf.",
              "Achte auf möglichst großen Helligkeitsunterschied zwischen Text und Fläche.",
            ),
          ],
          [
            cc(
              "Jonas erstellt zehn vollgeschriebene Folien für ein Drei-Minuten-Referat. Im Probelauf muss er nach der Hälfte abbrechen. Welcher Planungsfehler liegt vor?",
              "Folienzahl und Textmenge je Folie passten nicht zum vorgegebenen Zeitrahmen",
              [
                "Er hat zu wenige blinkende Folienübergänge verwendet",
                "Seine Schrift war mit 24 pt viel zu groß gewählt",
              ],
              "Für drei Minuten (180 s) reichen meist drei bis vier klare Folien mit rund 45–60 s je Folie.",
              "Vergleiche die zur Verfügung stehende Gesamtzeit mit der Zahl der Folien.",
            ),
            cc(
              "Auf einer Beamerfläche ist ein hellgraues Diagramm auf weißem Hintergrund aus der fünften Reihe kaum zu erkennen. Was bessert dies am wirksamsten?",
              "Kräftige Farben mit hohem Kontrast zum Hintergrund und stärkere Linien wählen",
              [
                "Einen schnellen Wirbel-Übergang vor der Diagrammfolie einstellen",
                "Den erklärenden Satz dreimal unter das Diagramm schreiben",
              ],
              "Beamer schwächen helle Töne oft zusätzlich ab; deutlicher Farbkontrast stellt die Erkennbarkeit wieder her.",
              "Warum verschwinden blasse Farbtöne über den Beamer schnell?",
            ),
            cc(
              "Für einen fünfstufigen Wasserkreislauf möchtest du auf einer Folie schrittweise erklären, was nacheinander passiert. Welche Lösung ist am überzeugendsten?",
              "Ein übersichtliches Schaubild, bei dem die einzelnen Pfeile und Beschriftungen Schritt für Schritt eingeblendet werden",
              [
                "Fünf lange Absätze ohne Abbildung mit einer sehr kleinen Schriftgröße",
                "Jede Beschriftung mit einer anderen lauten Sound- und Drehanimation versehen",
              ],
              "Gezieltes schrittweises Einblenden entlang einer Skizze verbindet Information mit der passenden Reihenfolge.",
              "Welche Kombination aus Darstellung und Animation unterstützt einen schrittweisen Ablauf?",
            ),
          ],
        ),
        {
          id: "inf6-praes-zeitplanung",
          make(rng, level) {
            if (level === 1) {
              const slides = rng.pick([4, 5, 6]);
              const secPerSlide = rng.pick([45, 50, 60, 75, 90]);
              const totalSec = slides * secPerSlide;
              return {
                prompt: `Ein kurzer Vortrag hat genau ${totalSec} Sekunden Zeitbudget und umfasst ${slides} gleich lange Folien. Wie viele Sekunden bleiben im Schnitt pro Folie?`,
                given: [
                  `Gesamtzeit: ${totalSec} s`,
                  `Anzahl Folien: ${slides}`,
                ],
                formulaHint: "Teile die Gesamtzeit durch die Anzahl der Folien.",
                fields: [
                  withSlips(
                    numberField("Zeit pro Folie", secPerSlide, "s", 0),
                    [totalSec / 60, "Das sind die Gesamtminuten – teile noch durch die Folienzahl."],
                    [slides * totalSec, "Teile die Zeit durch die Folienzahl, multipliziere nicht."],
                  ),
                ],
                steps: [
                  `Formel für gleichmäßig aufgeteilte Folien: Gesamtzeit : Folienanzahl`,
                  `Einsetzen: ${totalSec} s : ${slides}`,
                  `Ergebnis: ${secPerSlide} s pro Folie`,
                ],
              };
            }
            const mins = rng.pick([5, 6, 7, 8]);
            const introOptions = mins === 5 ? [60, 120] : [60, 90, 120];
            const frameSec = rng.pick(introOptions);
            const restSec = mins * 60 - frameSec;
            const validSlides = [3, 4, 5, 6].filter((s) => restSec % s === 0 && restSec / s >= 40 && restSec / s <= 100);
            const slides = rng.pick(validSlides);
            const perSlide = restSec / slides;
            return {
              prompt: `Für eure Multimediapräsentation gilt ein fester Zeitrahmen von ${mins} Minuten. Für Begrüßung, Titelfolie und Quellenfolie plant ihr zusammen ${frameSec} Sekunden ein. Die restliche Zeit verteilt ihr gleichmäßig auf ${slides} Inhaltsfolien. Wie viele Sekunden bleiben je Inhaltsfolie?`,
              given: [
                `Zeitrahmen: ${mins} Minuten`,
                `Rahmenfolien: ${frameSec} s`,
                `Inhaltsfolien: ${slides}`,
              ],
              formulaHint: "Rechne zuerst die Minuten in Sekunden um, ziehe die Rahmenfolien ab und teile dann durch die Inhaltsfolien.",
              fields: [
                withSlips(
                  numberField("Zeit je Inhaltsfolie", perSlide, "s", 0),
                  [Math.round((mins * 60) / slides), "Vergiss nicht, zuerst die Zeit für Begrüßung, Titel- und Quellenfolie abzuziehen!"],
                  [restSec, "Das ist die gesamte verbleibende Zeit – teile sie noch durch die Anzahl der Inhaltsfolien."],
                ),
              ],
              steps: [
                `${mins} Minuten in Sekunden: ${mins} · 60 s = ${mins * 60} s`,
                `Zeit für Inhaltsfolien: ${mins * 60} s − ${frameSec} s = ${restSec} s`,
                `Je Inhaltsfolie: ${restSec} s : ${slides} = ${perSlide} s`,
              ],
            };
          },
        },
      ],
    }),

    lesson(STAGE_ID, "2.2", 2, {
      id: "inf6-urheberrecht-quellen",
      title: "Urheberrecht und Quellenangaben",
      subtitle: "Schutz fremder Werke bei Text, Bild und Musik sowie vollständige Quellenangaben",
      why: "Wer fremde Fotos oder Musik ohne Rechte hochlädt oder ‚Google‘ als Quelle nennt, verstößt gegen Regeln und riskiert Ärger.",
      html: `<p>Sobald eine Person ein Foto aufnimmt, eine Grafik zeichnet, einen Text schreibt oder ein Musikstück einspielt, schützt das <strong>Urheberrecht</strong> dieses Werk automatisch – auch ohne kleines ©-Symbol. Du darfst fremde Werke aus dem Internet nicht einfach kopieren und beliebig weiterverbreiten.</p>
<p>Am sichersten verwendest du <strong>eigene</strong> Fotos, Skizzen und selbst geschriebene Stichpunkte. Möchtest du fremdes Material nutzen, achte auf <strong>freie Lizenzen</strong> wie <strong>Creative Commons</strong> (z. B. <code>CC0</code> als gemeinfrei oder <code>CC BY</code> mit Namensnennung) und halte deren Bedingungen genau ein. Für den reinen Einsatz innerhalb des Klassenzimmers gelten eng begrenzte gesetzliche Ausnahmen für den Unterricht – sobald eine Arbeit aber öffentlich auf einer Schulwebseite erscheint, greift der volle Schutz.</p>
<p>Zu jedem übernommenen Bild, Zitat und Zahlenwert gehört eine <strong>vollständige Quellenangabe</strong>. Eine Suchmaschine wie „Google“ oder „Bing“ hat das Bild nicht erstellt und ist niemals eine gültige Quelle. Nenne stets: <strong>Urheber bzw. Rechteinhaber</strong>, <strong>Titel</strong>, <strong>genaue Internetadresse (URL) oder Buchtitel</strong>, <strong>Abrufdatum</strong> und bei freien Lizenzen den <strong>Lizenznamen</strong>.</p>
<div class="example"><strong>Beispiel:</strong><br/>Unzureichend: <em>Quelle: Google Bilder</em><br/>Vollständig: <em>Foto „Honigbiene auf Apfelblüte“ von Anna Beispiel, Wikimedia Commons (Lizenz CC BY-SA), abgerufen am 14. November 2026 unter de.wikipedia.org/wiki/Honigbiene</em>.</div>
<div class="merke"><strong>Merke:</strong> Fremde Medien gehören ihren Urhebern: Verwende eigene Werke oder Medien mit freier Lizenz und gib immer Urheber, Titel, genaue Fundstelle, Abrufdatum und Lizenz an – niemals bloß eine Suchmaschine.</div>`,
      rule: "Suchmaschinen sind keine Quellen: eigene Werke oder freie Lizenzen wählen und vollständige Quellenangabe notieren",
      terms: [
        ["Urheberrecht", "Schützt automatisch Texte, Bilder, Grafiken, Ton und Videos", "Gilt auch ohne ausdrücklichen Vermerk"],
        ["Freie Lizenz (z. B. Creative Commons)", "CC0 (frei ohne Namensnennung), CC BY (mit Namensnennung)", "Erlaubt die Nutzung unter klaren Bedingungen"],
        ["Vollständige Quellenangabe", "Urheber · Titel · genaue URL / Buch · Abrufdatum · Lizenz", "Suchmaschinen wie Google sind keine Quelle"],
      ],
      quiz: [
        "Welche Angabe genügt unter einem Foto aus dem Internet auf einer Präsentationsfolie sicher NICHT als Quellenangabe?",
        "„Quelle: Google Bilder“ ohne Urheber, Link und Lizenz",
        "Name der Fotografin, genauer Titel, Lizenz ‚CC BY‘ und komplette Webseite mit Abrufdatum",
        "„Eigenes Foto, aufgenommen am 10. Oktober im Schulgarten“",
        "Google ist nur eine Suchmaschine, kein Rechteinhaber und kein Fundort des Originalbildes.",
      ],
      lab: urheberrechtLab,
      exercises: [
        cases(
          "inf6-urh-regeln",
          [
            cc(
              "Du findest über eine Suchmaschine ein schönes Tierfoto ohne Lizenzhinweis auf der Seite eines Profifotografen. Darfst du es einfach in eine öffentlich verfügbare Schul-Präsentation kopieren?",
              "Nein, fremde Fotos sind automatisch urheberrechtlich geschützt und brauchen Erlaubnis oder eine freie Lizenz",
              [
                "Ja, denn alles im Internet ohne ©-Zeichen ist automatisch frei für jeden",
                "Ja, solange du unter das Bild schreibst: ‚Aus dem Internet‘",
              ],
              "Das Urheberrecht gilt sofort mit der Erstellung des Fotos, auch ohne besonderes Symbol.",
              "Schützt das Urheberrecht ein Werk erst nach Anmeldung oder automatisch?",
            ),
            cc(
              "Was bedeutet die Lizenzbezeichnung ‚CC BY‘ bei einer Grafik aus einem freien Medienarchiv?",
              "Du darfst das Werk nutzen und einbinden, musst aber den Urheber und die Lizenz korrekt nennen",
              [
                "Das Bild darf nur gegen hohe Bezahlung beim Verlag gedruckt werden",
                "Das Bild gehört niemandem und man muss gar keine Quelle angeben",
              ],
              "Das Kürzel ‚BY‘ steht im Creative-Commons-System für die verpflichtende Namensnennung des Urhebers.",
              "Überlege, wofür ‚BY‘ (englisch ‚by‘ = ‚von‘) bei Creative Commons steht.",
            ),
            cc(
              "Welche Möglichkeit umgeht fremde Urheberrechte bei Grafiken und Fotos von Anfang an am zuverlässigsten?",
              "Selbst fotografieren oder Vektorgrafiken und Schaubilder selbst zeichnen",
              [
                "Von fremden Bildern lediglich die weißen Ränder abschneiden",
                "Eine Grafik abfotografieren und als eigenes Foto ausgeben",
              ],
              "Am eigenen Foto und an der eigenen Zeichnung hältst du alle Nutzungsrechte selbst.",
              "Wann bist du selbst Urheberin oder Urheber eines Mediums?",
            ),
          ],
          [
            cc(
              "Marie möchte ihre Präsentation für das Schulfest auf der öffentlichen Schulhomepage veröffentlichen. Sie enthält fünf fremde Grafiken aus alten Lehrbüchern ohne freie Lizenz. Was muss passieren?",
              "Die unlizenzierten Grafiken müssen entfernt und durch eigene Zeichnungen oder frei lizenzierte Bilder mit Lizenzangabe ersetzt werden",
              [
                "Es reicht, ‚Für ein Schulprojekt‘ auf die Titelfolie zu schreiben",
                "Sie muss lediglich eine andere Schriftart unter den Bildern verwenden",
              ],
              "Die gesetzliche Unterrichts-Ausnahme gilt nur für geschlossene Lerngruppen, nicht für die freie Veröffentlichung im Internet.",
              "Beachte den Unterschied zwischen geschlossenem Klassenraum und öffentlichem Internet.",
            ),
            cc(
              "Ein Mitschüler schlägt vor, einfach einen kleinen aktuellen Popsong per MP3 in eure Video-Präsentation zu schneiden und auf der Klassen-Cloud hochzuladen, wenn man den Bandnamen nennt. Stimmt das?",
              "Nein, bloßes Nennen des Bandnamens ersetzt bei geschützter Musik keine Nutzungserlaubnis",
              [
                "Ja, sobald die Quellenangabe vollständig ist, darf man jede Musik einbauen",
                "Ja, solange der Song kürzer als die gesamte Präsentation ist",
              ],
              "Eine korrekte Quellenangabe macht ein unfreies Werk nicht frei nutzbar – es braucht eine passende Lizenz oder gemeinfreie Musik.",
              "Trennen zwischen Zitier-/Quellenpflicht und der eigentlichen Erlaubnis zur Nutzung!",
            ),
            cc(
              "Warum darfst du in einer Vektorgrafik einen einfachen Sonnenverlauf selbst nachbauen, solltest aber kein fremdes Comic-Maskottchen abzeichnen und veröffentlichen?",
              "Weil stark geprägte kreative Figuren selbst urheberrechtlich geschützt sind, einfache Sachinformationen dagegen nicht",
              [
                "Weil Vektorgrafikprogramme keine gelbe Farbe speichern können",
                "Weil Sonnen keine Urheber haben, Comics aber immer nur als Pixelgrafik vorliegen",
              ],
              "Fakten und einfache Naturphänomene sind frei; geschützte künstlerische Gestaltungen bleiben auch bei Bearbeitung geschützt.",
              "Denke an den Unterschied zwischen frei darstellbaren Fakten und geschützten fremden Schöpfungen.",
            ),
          ],
        ),
        cases(
          "inf6-urh-quellen",
          [
            cc(
              "Welche Bestandteile gehören zu einer vollständigen Quellenangabe für ein Online-Foto?",
              "Urheber/Rechteinhaber, Bildtitel, genaue Webseite (URL), Abrufdatum und gegebenenfalls Lizenz",
              [
                "Nur das Wort ‚Wikipedia‘ oder ‚Internet‘ in kleiner Schrift",
                "Ausschließlich die Dateigröße in Megabyte und das Dateiformat",
              ],
              "Erst mit Urheber, Titel, genauer Adresse, Datum und Lizenz kann jede nachprüfen, woher das Bild stammt und warum es genutzt werden darf.",
              "Welche Angaben braucht eine Leserin, um genau dieses Bild wiederzufinden?",
            ),
            cc(
              "Wo notierst du die Quellenangaben in einer Multimediapräsentation am sinnvollsten?",
              "Direkt klein am jeweiligen Bild oder kompakt gesammelt und zugeordnet auf einer Schluss- bzw. Quellenfolie",
              [
                "Gar nicht in der Präsentation, sondern versteckt als Kommentar in einer leeren Datei",
                "Als sehr großes Wasserzeichen quer über jede Grafik, damit niemand es übersehen kann",
              ],
              "Direkt am Bild oder sauber sortiert pro Folie am Ende bleibt die Quelle erkennbar, ohne die Folie zu überladen.",
              "Wie bleiben Folien übersichtlich und Quellen trotzdem eindeutig zugeordnet?",
            ),
            cc(
              "Warum ist das Abrufdatum in der Internet-Quellenangabe wichtig?",
              "Weil Webseiten später geändert, aktualisiert oder gelöscht werden können",
              [
                "Weil das Präsentationsprogramm Dateien sonst nach dem Tag löscht",
                "Weil der Kontrast einer Folie vom Kalenderdatum abhängt",
              ],
              "Das Abrufdatum dokumentiert den Stand der Internetseite an genau dem Tag, an dem du sie eingesehen hast.",
              "Bleibt eine Webseite über Jahre immer exakt gleich?",
            ),
          ],
          [
            cc(
              "Welche der drei Quellenangaben unter einem Foto aus Wikimedia Commons ist fachlich vollständig?",
              "Foto: ‚Sonnenblume‘ von Lukas Bauer, CC BY, commons.wikimedia.org/wiki/File:Sonnenblume.jpg (abgerufen am 14. November 2026)",
              [
                "Foto: ‚Sonnenblume‘ – gefunden im Internet",
                "commons.wikimedia.org, abgerufen irgendwann im November",
              ],
              "Die vollständige Angabe vereint Motiv/Titel, Urheber, Lizenz, konkreten Pfad und genaues Abrufdatum.",
              "Prüfe jede Angabe darauf, ob alle fünf Bausteine (Urheber, Titel, Lizenz, genaue URL, Datum) vorkommen.",
            ),
            cc(
              "In einem gedruckten Lexikon schlägst du eine Zahl für die Einwohnerzahl Münchens nach. Wie gibst du diese Quelle richtig an?",
              "Autor/Herausgeber, Buchtitel, Erscheinungsjahr und Seitenzahl nennen",
              [
                "Schreiben: ‚Aus einem blauen Buch in der Schulbibliothek‘",
                "Eine beliebige Internetadresse erfinden, die ähnlich klingt",
              ],
              "Auch bei gedruckten Büchern muss die genaue Fundstelle eindeutig benannt werden.",
              "Welche Angaben ermöglichen das exakte Wiederauffinden in einem gedruckten Buch?",
            ),
            cc(
              "Du passt eine fremde CC-BY-Grafik leicht farblich an, um den Kontrast auf deiner dunklen Folie zu erhöhen. Was gilt für die Quellenangabe?",
              "Urheber, Titel, Link und Lizenz bleiben angegeben – ergänzt um den Hinweis, dass du die Farben bearbeitet hast",
              [
                "Durch das Umfärben erlischt das fremde Urheberrecht sofort und es braucht keine Quelle",
                "Du darfst dich selbst als alleinigen ursprünglichen Ersteller der Grafik ausgeben",
              ],
              "Eine bloße Farbanpassung macht ein fremdes Werk nicht komplett zu deinem; Ursprung und Änderung werden transparent angegeben.",
              "Wird eine Grafik durch Umfärben komplett zu einer Neuschöpfung?",
            ),
          ],
        ),
      ],
    }),
  ],
};
