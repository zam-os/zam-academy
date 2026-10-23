import { fmt, fmtUnit } from "../exercises/format";
import { G } from "../lab/engine";
import { F_ELASTIC, frictionLimits, readScale, springExtension } from "../lab/physics";
import type { Lesson, Stage } from "../model/types";
import { near } from "./helpers";

const STAGE_ID = "stage-1-mechanik";

// 1.1 Länge und Zeit messen ────────────────────────────────────────────────

const messen: Lesson = {
  id: "kr-1-messen",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "1.1 Länge und Zeit messen",
  subtitle: "Messbereich, Genauigkeit und Messfehler",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Länge, Längenmessung (Messbereich, Messgenauigkeit, Messfehler), Zeit, Zeitmessung",
  whyItMatters:
    "Physik beginnt mit Messen. Wer misst, muss auch sagen können, wie genau das Ergebnis ist und ob es überhaupt sinnvoll sein kann: 3 mm in einer Sekunde ist keine Radfahrergeschwindigkeit.",
  explanationHtml: `
    <p>Länge und Zeit sind <strong>Grundgrößen</strong>. Die Einheiten sind <strong>Meter (m)</strong> und <strong>Sekunde (s)</strong>. Gemessen wird mit Lineal, Maßband, Messschieber und Stoppuhr.</p>
    <ul>
      <li><strong>Messbereich:</strong> der größte Wert, den das Gerät anzeigen kann (ein 30-cm-Lineal misst keine 2 m).</li>
      <li><strong>Skalenteilung:</strong> der Abstand zweier Striche. Beim Ablesen schätzt man höchstens eine halbe Teilung, der <strong>Ablesefehler</strong> beträgt also etwa Teilung / 2.</li>
      <li><strong>Messfehler:</strong> Es gibt Zufallsfehler (Ablesen, Reaktionszeit von etwa 0,2 s beim Stoppen) und systematische Fehler (Nullpunkt verschoben, falsch geeichtes Gerät).</li>
      <li><strong>Mehrfach messen:</strong> Der Mittelwert x̄ = (x₁ + x₂ + … + xₙ) / n gleicht Zufallsfehler aus.</li>
      <li>Gib ein Ergebnis nur so genau an, wie das Gerät es hergibt, und prüfe, ob es <strong>physikalisch sinnvoll</strong> ist.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> 1 m = 100 cm = 1000 mm und 1 h = 60 min = 3600 s. Je kleiner die Skalenteilung, desto kleiner der Ablesefehler.</div>
  `,
  formulas: [
    { name: "Mittelwert", html: "x̄ = (x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub>) / n", quantities: "x<sub>i</sub> Einzelmessungen, n Anzahl" },
    { name: "Ablesefehler", html: "Δx ≈ Skalenteilung / 2", quantities: "in der Einheit des Geräts" },
    { name: "Relativer Fehler", html: "Δx / x", quantities: "mal 100 gibt Prozent" },
    { name: "Umrechnen", html: "1 m = 100 cm = 1000 mm; 1 h = 60 min = 3600 s", quantities: "" },
  ],
  quiz: {
    question: "Du misst dieselbe Strecke mit einem Lineal (Teilung 1 mm) viermal: 12,3 cm; 12,4 cm; 12,3 cm; 12,2 cm. Was ist das beste Ergebnis?",
    options: [
      "Der größte gemessene Wert, 12,4 cm",
      "Der Mittelwert aus allen vier Messungen, 12,3 cm",
      "Eine Angabe auf vier Stellen, 12,3141 cm",
    ],
    correctIndex: 1,
    explanation: "Der Mittelwert gleicht zufällige Abweichungen aus. Mehr Stellen, als das Lineal hergibt, täuschen eine Genauigkeit vor, die es nicht gibt.",
  },
  lab: {
    kind: "measure-length",
    title: "Labor: Lineal ablesen",
    intro: "Wähle die Länge des Gegenstands und die Teilung des Lineals. Lies ab, wie groß der Ablesefehler ist, und vergleiche ihn mit der Länge.",
    params: [
      { type: "range", key: "L", label: "Länge des Gegenstands", unit: "cm", min: 1, max: 20, step: 0.1, value: 8.3, digits: 1 },
      {
        type: "choice",
        key: "scale",
        label: "Teilung des Lineals",
        options: [
          { value: 1, label: "1 cm (grob)" },
          { value: 0.5, label: "0,5 cm" },
          { value: 0.1, label: "1 mm (fein)" },
        ],
        value: 1,
      },
    ],
    readouts: [
      { key: "reading", label: "Abgelesener Wert", unit: "cm", digits: 1, emphasis: true, compute: (v) => readScale(v.L, v.scale) },
      { key: "dx", label: "Ablesefehler Δx ≈ Teilung / 2", unit: "cm", digits: 2, compute: (v) => v.scale / 2 },
      { key: "rel", label: "Relativer Fehler Δx / x", unit: "%", digits: 1, emphasis: true, compute: (v) => (v.scale / 2 / v.L) * 100 },
    ],
    goals: [
      { id: "zwei-cm", text: "Miss einen 2,0 cm langen Gegenstand mit weniger als 3 % relativem Fehler.", check: (v, r) => near(v.L, 2, 0.001) && Number(r.rel) < 3 },
      { id: "millimeter", text: "Lies 14,7 cm mit dem Millimeter-Lineal ab.", check: (v) => near(v.L, 14.7, 0.001) && v.scale === 0.1 },
      { id: "grob-genug", text: "Finde eine Länge, bei der selbst das grobe 1-cm-Lineal weniger als 3 % relativen Fehler liefert.", check: (v, r) => v.scale === 1 && Number(r.rel) < 3 },
    ],
  },
  exercises: [
    {
      id: "mittelwert",
      make: (rng, level) => {
        if (level === 1) {
          const base = rng.int(120, 180) / 10;
          const values = Array.from({ length: 5 }, () => Number((base + rng.int(-3, 3) / 10).toFixed(1)));
          const mean = values.reduce((a, b) => a + b, 0) / values.length;
          return {
            prompt: `Eine Strecke wird fünfmal mit dem Maßband gemessen. Berechne den Mittelwert der Messreihe.`,
            given: [`Messwerte: ${values.map((x) => fmtUnit(x, "cm", 1)).join("; ")}`],
            formulaHint: "x̄ = (x₁ + x₂ + x₃ + x₄ + x₅) / 5",
            answer: mean,
            unit: "cm",
            digits: 2,
            solutionHtml: `Summe = ${fmt(values.reduce((a, b) => a + b, 0), 1)} cm<br>x̄ = Summe / 5 = <strong>${fmtUnit(mean, "cm", 2)}</strong>`,
          };
        }
        const T = rng.int(120, 170) / 100;
        const times = Array.from({ length: 3 }, () => Number((10 * T + rng.int(-4, 4) / 10).toFixed(1)));
        const period = times.reduce((a, b) => a + b, 0) / times.length / 10;
        return {
          prompt: `Eine Schaukel wird gestoppt: Jeweils 10 vollständige Schwingungen dauern ${times.map((x) => fmtUnit(x, "s", 1)).join("; ")}. Wie lange dauert eine Schwingung im Mittel? (Man stoppt gleich 10 Schwingungen, damit der Stoppfehler kleiner wird.)`,
          given: [`Messwerte für 10 Schwingungen: ${times.map((x) => fmtUnit(x, "s", 1)).join("; ")}`],
          answer: period,
          unit: "s",
          digits: 3,
          solutionHtml: `Mittelwert der drei Messungen = ${fmtUnit(times.reduce((a, b) => a + b, 0) / 3, "s", 2)}<br>Eine Schwingung: ${fmt(times.reduce((a, b) => a + b, 0) / 3, 2)} s / 10 = <strong>${fmtUnit(period, "s", 3)}</strong>. Der Fehler beim Stoppen von etwa 0,2 s verteilt sich auf 10 Schwingungen und wird dadurch zehnmal kleiner.`,
        };
      },
    },
    {
      id: "umrechnen",
      make: (rng, level) => {
        if (level === 1) {
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const m = rng.int(12, 480) / 100;
            return {
              prompt: `Ein Tisch ist ${fmtUnit(m, "m", 2)} breit. Rechne die Breite in Zentimeter um.`,
              given: [`${fmtUnit(m, "m", 2)}`],
              formulaHint: "1 m = 100 cm",
              answer: m * 100,
              unit: "cm",
              digits: 0,
              solutionHtml: `${fmt(m, 2)} m · 100 = <strong>${fmtUnit(m * 100, "cm", 0)}</strong>`,
            };
          }
          if (kind === 1) {
            const mm = rng.int(15, 950) * 10;
            return {
              prompt: `Ein Flur ist ${fmtUnit(mm, "mm", 0)} lang. Rechne die Länge in Meter um.`,
              given: [`${fmtUnit(mm, "mm", 0)}`],
              formulaHint: "1 m = 1000 mm",
              answer: mm / 1000,
              unit: "m",
              digits: 2,
              solutionHtml: `${fmt(mm, 0)} mm / 1000 = <strong>${fmtUnit(mm / 1000, "m", 2)}</strong>`,
            };
          }
          const h = rng.int(5, 40) / 10;
          return {
            prompt: `Ein Film dauert ${fmtUnit(h, "h", 1)}. Rechne die Dauer in Sekunden um.`,
            given: [`${fmtUnit(h, "h", 1)}`],
            formulaHint: "1 h = 3600 s",
            answer: h * 3600,
            unit: "s",
            digits: 0,
            solutionHtml: `${fmt(h, 1)} h · 3600 = <strong>${fmtUnit(h * 3600, "s", 0)}</strong>`,
          };
        }
        const n = rng.pick([200, 250, 400, 500]);
        const hCm = rng.pick([2, 2.5, 4, 5]);
        const dMm = (hCm * 10) / n;
        return {
          prompt: `Ein Papierstapel aus ${n} Blatt ist ${fmtUnit(hCm, "cm", 1)} hoch. Wie dick ist ein einzelnes Blatt? (Ein Lineal könnte ein Blatt allein nicht genau genug messen.)`,
          given: [`${n} Blatt`, `Stapelhöhe ${fmtUnit(hCm, "cm", 1)}`],
          answer: dMm,
          unit: "mm",
          digits: 3,
          solutionHtml: `${fmt(hCm, 1)} cm = ${fmt(hCm * 10, 0)} mm<br>${fmt(hCm * 10, 0)} mm / ${n} = <strong>${fmtUnit(dMm, "mm", 3)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du misst mit Köpfchen: Mittelwert, Ablesefehler und sinnvolle Einheiten sitzen.",
};

// 1.2 Gleichförmige Bewegung ───────────────────────────────────────────────

const geschwindigkeit: Lesson = {
  id: "kr-2-geschwindigkeit",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "1.2 Gleichförmige Bewegung und Geschwindigkeit",
  subtitle: "Weg und Zeit sind direkt proportional",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): (geradlinig) gleichförmige Bewegung, Geschwindigkeit",
  whyItMatters:
    "Ob Fahrradtacho, Blitzer oder Navi: Geschwindigkeit ist überall. Sie entsteht aus zwei Messungen, Weg und Zeit, und aus einer einzigen Idee: gleiche Wege in gleichen Zeiten.",
  explanationHtml: `
    <p>Bei einer <strong>(geradlinig) gleichförmigen Bewegung</strong> legt ein Körper in gleichen Zeiten gleiche Wege zurück. Im Weg-Zeit-Diagramm ergibt sich eine <strong>Ursprungsgerade</strong>: Der Weg s ist <strong>direkt proportional</strong> zur Zeit t (doppelte Zeit, doppelter Weg).</p>
    <p class="formula-line">v = s / t</p>
    <ul>
      <li>Der Quotient s / t ist konstant. Er heißt <strong>Geschwindigkeit</strong> v und gibt an, wie viel Weg pro Zeit zurückgelegt wird.</li>
      <li>Einheiten: <strong>m/s</strong> und <strong>km/h</strong>. Es gilt 1 m/s = 3,6 km/h, denn 1 m/s sind 3600 m in 3600 s, also 3,6 km in 1 h.</li>
      <li>Umgestellt: <strong>s = v · t</strong> und <strong>t = s / v</strong>.</li>
      <li>Zum Vergleich: Fußgänger etwa 1,4 m/s (5 km/h), Radfahrer 5 m/s (18 km/h), Auto in der Stadt 50 km/h (14 m/s), Schall 343 m/s, Licht 300 000 km/s.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Gleichförmig heißt: Die Geschwindigkeit ändert sich nicht. Die Steigung der Weg-Zeit-Geraden ist die Geschwindigkeit.</div>
  `,
  formulas: [
    { name: "Geschwindigkeit", html: "v = s / t", quantities: "v in m/s oder km/h, s in m oder km, t in s oder h" },
    { name: "Weg", html: "s = v · t", quantities: "" },
    { name: "Zeit", html: "t = s / v", quantities: "" },
    { name: "Umrechnung", html: "1 m/s = 3,6 km/h", quantities: "÷ 3,6 von km/h zu m/s" },
  ],
  quiz: {
    question: "Ein Körper legt in 2 s genau 6 m zurück, in 4 s genau 12 m und in 6 s genau 18 m. Was gilt?",
    options: [
      "Die Geschwindigkeit wächst von Sekunde zu Sekunde",
      "Der Weg ist proportional zur Zeit, die Geschwindigkeit ist konstant 3 m/s",
      "Die Messwerte reichen nicht, um etwas zu sagen",
    ],
    correctIndex: 1,
    explanation: "Der Quotient s / t ist immer 3 m/s. Weg und Zeit sind direkt proportional: eine gleichförmige Bewegung.",
  },
  lab: {
    kind: "uniform-motion",
    title: "Labor: Auto auf gerader Strecke",
    intro: "Stelle Geschwindigkeit und Fahrzeit ein. Beobachte die Strecke und die Gerade im Weg-Zeit-Diagramm.",
    params: [
      { type: "range", key: "v", label: "Geschwindigkeit v", unit: "m/s", min: 1, max: 40, step: 1, value: 5 },
      { type: "range", key: "t", label: "Fahrzeit t", unit: "s", min: 1, max: 20, step: 0.5, value: 4, digits: 1 },
    ],
    readouts: [
      { key: "s", label: "Weg s = v · t", unit: "m", digits: 1, emphasis: true, compute: (v) => v.v * v.t },
      { key: "kmh", label: "Geschwindigkeit in km/h", unit: "km/h", digits: 1, compute: (v) => v.v * 3.6 },
      { key: "q", label: "Quotient s / t", unit: "m/s", digits: 1, compute: (v) => (v.v * v.t) / v.t },
    ],
    goals: [
      { id: "hundert-meter", text: "Lege in 10 s genau 100 m zurück.", check: (v, r) => v.t === 10 && near(Number(r.s), 100, 0.001) },
      { id: "fuenfzig", text: "Erreiche etwa 50 km/h (±2 %).", check: (_v, r) => near(Number(r.kmh), 50, 0.02) },
      { id: "doppelte-zeit", text: "Fahre mit 6 m/s doppelt so lange wie 5 s: 10 s. Der Weg verdoppelt sich auf 60 m.", check: (v) => v.v === 6 && v.t === 10 },
    ],
  },
  exercises: [
    {
      id: "geschwindigkeit",
      make: (rng, level) => {
        if (level === 1) {
          const v = rng.int(2, 30);
          const t = rng.int(3, 20);
          const s = v * t;
          return {
            prompt: `Ein Körper bewegt sich gleichförmig und legt in ${fmtUnit(t, "s", 0)} den Weg ${fmtUnit(s, "m", 0)} zurück. Wie groß ist seine Geschwindigkeit?`,
            given: [`s = ${fmtUnit(s, "m", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "v = s / t",
            answer: v,
            unit: "m/s",
            digits: 1,
            solutionHtml: `v = s / t = ${fmt(s, 0)} m / ${fmt(t, 0)} s = <strong>${fmtUnit(v, "m/s", 1)}</strong>`,
          };
        }
        const sKm = rng.pick([18, 27, 36, 45, 54]);
        const tH = rng.pick([1, 1.5, 2, 2.5, 3]);
        const vKmh = sKm / tH;
        return {
          prompt: `Eine Radfahrerin fährt gleichmäßig ${fmtUnit(sKm, "km", 0)} in ${fmtUnit(tH, "h", 1)}. Gib ihre Geschwindigkeit in m/s an.`,
          given: [`s = ${fmtUnit(sKm, "km", 0)}`, `t = ${fmtUnit(tH, "h", 1)}`],
          answer: vKmh / 3.6,
          unit: "m/s",
          digits: 2,
          solutionHtml: `v = ${fmt(sKm, 0)} km / ${fmt(tH, 1)} h = ${fmtUnit(vKmh, "km/h", 1)}<br>${fmt(vKmh, 1)} km/h / 3,6 = <strong>${fmtUnit(vKmh / 3.6, "m/s", 2)}</strong>`,
        };
      },
    },
    {
      id: "weg-zeit",
      make: (rng, level) => {
        if (level === 1) {
          const v = rng.int(3, 25);
          const t = rng.int(4, 30);
          return {
            prompt: `Ein Skateboarder fährt mit konstant ${fmtUnit(v, "m/s", 0)}. Welchen Weg legt er in ${fmtUnit(t, "s", 0)} zurück?`,
            given: [`v = ${fmtUnit(v, "m/s", 0)}`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "s = v · t",
            answer: v * t,
            unit: "m",
            digits: 0,
            solutionHtml: `s = v · t = ${fmt(v, 0)} m/s · ${fmt(t, 0)} s = <strong>${fmtUnit(v * t, "m", 0)}</strong>`,
          };
        }
        const vKmh = rng.pick([120, 150, 180, 200, 240]);
        const sKm = rng.pick([30, 45, 60, 75, 90]);
        const tMin = (sKm / vKmh) * 60;
        return {
          prompt: `Ein Hochgeschwindigkeitszug fährt gleichmäßig mit ${fmtUnit(vKmh, "km/h", 0)}. Wie viele Minuten braucht er für ${fmtUnit(sKm, "km", 0)}?`,
          given: [`v = ${fmtUnit(vKmh, "km/h", 0)}`, `s = ${fmtUnit(sKm, "km", 0)}`],
          answer: tMin,
          unit: "min",
          digits: 1,
          solutionHtml: `t = s / v = ${fmt(sKm, 0)} km / ${fmt(vKmh, 0)} km/h = ${fmt(sKm / vKmh, 3)} h<br>${fmt(sKm / vKmh, 3)} h · 60 = <strong>${fmtUnit(tMin, "min", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Weg, Zeit und Geschwindigkeit hängen für dich zusammen, auch beim Umrechnen von km/h.",
};

// 1.3 Kraft und Kraftwirkungen ─────────────────────────────────────────────

const kraft: Lesson = {
  id: "kr-3-kraft",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "1.3 Kraft und Kraftwirkungen",
  subtitle: "Verformen, beschleunigen, ablenken: Kraftpfeile im Maßstab",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Kraft, Kraftwirkungen (statisch und dynamisch), Einheit der Kraft, Kraftmessgeräte",
  whyItMatters:
    "Im Alltag sagt man „Kraft“, wenn man Muskeln, Energie oder Stärke meint. In der Physik ist Kraft eine messbare Größe mit Richtung, die man nur an ihren Wirkungen erkennt.",
  explanationHtml: `
    <p>Eine <strong>Kraft</strong> erkennt man an ihren Wirkungen:</p>
    <ul>
      <li><strong>Statische Wirkung:</strong> Ein Körper wird <em>verformt</em> (Feder wird gedehnt, Knete eingedrückt).</li>
      <li><strong>Dynamische Wirkung:</strong> Der <em>Bewegungszustand</em> ändert sich: schneller, langsamer oder in anderer Richtung.</li>
    </ul>
    <p>Eine Kraft ist durch drei <strong>Bestimmungsstücke</strong> festgelegt: <strong>Angriffspunkt</strong>, <strong>Richtung</strong> und <strong>Betrag</strong>. Man zeichnet sie als <strong>Kraftpfeil</strong>: Der Pfeil beginnt am Angriffspunkt, zeigt in die Richtung und ist im vereinbarten <strong>Maßstab</strong> so lang wie der Betrag, zum Beispiel 1 cm ≙ 10 N.</p>
    <ul>
      <li>Die Einheit ist das <strong>Newton (N)</strong>. Etwa 1 N ist die Gewichtskraft einer Tafel Schokolade (100 g).</li>
      <li>Mit einem <strong>Kraftmesser</strong> (Federwaage) misst man Kräfte über die Dehnung einer Feder.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Kraft ist kein Vorrat, den ein Körper „hat“. Eine Kraft wirkt zwischen zwei Körpern und hat Betrag, Richtung und Angriffspunkt.</div>
  `,
  formulas: [
    { name: "Kraftpfeil im Maßstab", html: "Pfeillänge = F : Maßstab", quantities: "z. B. Maßstab 1 cm ≙ 10 N: 50 N sind 5 cm" },
    { name: "Einheit", html: "1 N ≈ Gewichtskraft von 100 g", quantities: "Kraftmesser messen in N" },
  ],
  quiz: {
    question: "Ein Fußball prallt gegen die Latte und wird dabei etwas eingedrückt und zurückgeworfen. Welche Wirkungen der Kraft siehst du?",
    options: [
      "Nur eine statische Wirkung: Verformung",
      "Nur eine dynamische Wirkung: Richtungsänderung",
      "Eine statische (Eindellung) und eine dynamische Wirkung (Richtungsänderung)",
    ],
    correctIndex: 2,
    explanation: "Verformung ist die statische Kraftwirkung, die Änderung der Bewegungsrichtung die dynamische. Beides kann gleichzeitig auftreten.",
  },
  lab: {
    kind: "force-arrow",
    title: "Labor: Kraftpfeil zeichnen",
    intro: "Wähle Betrag, Richtung und Maßstab der Kraft auf den Klotz. Der Pfeil beginnt am Angriffspunkt.",
    params: [
      { type: "range", key: "F", label: "Kraft F", unit: "N", min: 5, max: 50, step: 5, value: 40 },
      {
        type: "choice",
        key: "dir",
        label: "Richtung",
        options: [
          { value: 0, label: "nach rechts" },
          { value: 45, label: "schräg nach oben rechts" },
          { value: 90, label: "nach oben" },
          { value: 180, label: "nach links" },
        ],
        value: 0,
      },
      {
        type: "choice",
        key: "scale",
        label: "Maßstab",
        options: [
          { value: 5, label: "1 cm ≙ 5 N" },
          { value: 10, label: "1 cm ≙ 10 N" },
          { value: 20, label: "1 cm ≙ 20 N" },
        ],
        value: 10,
      },
    ],
    readouts: [
      { key: "len", label: "Pfeillänge = F : Maßstab", unit: "cm", digits: 1, emphasis: true, compute: (v) => v.F / v.scale },
    ],
    goals: [
      { id: "fuenf-cm", text: "Zeichne 50 N im Maßstab 1 cm ≙ 10 N: Der Pfeil ist 5 cm lang.", check: (v, r) => v.F === 50 && v.scale === 10 && near(Number(r.len), 5, 0.001) },
      { id: "nach-links", text: "Lass die Kraft nach links wirken.", check: (v) => v.dir === 180 },
      { id: "vier-cm-schraeg", text: "Zeichne einen 4 cm langen Pfeil schräg nach oben rechts.", check: (v, r) => v.dir === 45 && near(Number(r.len), 4, 0.001) },
    ],
  },
  exercises: [
    {
      id: "pfeil-laenge",
      make: (rng, level) => {
        const scale = rng.pick([5, 10, 20]);
        if (level === 1) {
          const cm = rng.int(2, 10);
          const F = cm * scale;
          return {
            prompt: `Eine Kraft von ${fmtUnit(F, "N", 0)} soll im Maßstab 1 cm ≙ ${fmtUnit(scale, "N", 0)} gezeichnet werden. Wie lang wird der Kraftpfeil?`,
            given: [`F = ${fmtUnit(F, "N", 0)}`, `Maßstab: 1 cm ≙ ${fmtUnit(scale, "N", 0)}`],
            formulaHint: "Pfeillänge = F : Maßstab",
            answer: cm,
            unit: "cm",
            digits: 1,
            solutionHtml: `${fmt(F, 0)} N : ${fmt(scale, 0)} N pro cm = <strong>${fmtUnit(cm, "cm", 1)}</strong>`,
          };
        }
        const cm = rng.pick([2.5, 3.5, 4.5, 6.5]);
        const F = cm * scale;
        return {
          prompt: `Im Plan eines Ingenieurs ist die Kraft eines Seils als ${fmtUnit(cm, "cm", 1)} langer Pfeil gezeichnet. Der Maßstab lautet 1 cm ≙ ${fmtUnit(scale, "N", 0)}. Wie groß ist die Kraft?`,
          given: [`Pfeillänge ${fmtUnit(cm, "cm", 1)}`, `Maßstab: 1 cm ≙ ${fmtUnit(scale, "N", 0)}`],
          answer: F,
          unit: "N",
          digits: 1,
          solutionHtml: `F = ${fmt(cm, 1)} cm · ${fmt(scale, 0)} N pro cm = <strong>${fmtUnit(F, "N", 1)}</strong>`,
        };
      },
    },
    {
      id: "kraftmesser",
      make: (rng, level) => {
        if (level === 1) {
          const range = rng.pick([2, 5, 10]);
          const ticks = rng.pick([20, 25, 50]);
          const k = rng.int(Math.ceil(ticks * 0.2), Math.floor(ticks * 0.9));
          const F = (k * range) / ticks;
          return {
            prompt: `Ein Kraftmesser hat den Messbereich 0 bis ${fmtUnit(range, "N", 0)} mit ${ticks} gleichen Teilstrichen. Der Zeiger steht beim ${k}. Teilstrich. Welche Kraft wirkt?`,
            given: [`Messbereich ${fmtUnit(range, "N", 0)}`, `${ticks} Teilstriche`, `Zeiger bei ${k}`],
            formulaHint: "F = Teilstriche · Messbereich / Gesamtzahl",
            answer: F,
            unit: "N",
            digits: 2,
            solutionHtml: `Ein Teilstrich: ${fmt(range, 0)} N / ${ticks} = ${fmt(range / ticks, 3)} N<br>F = ${k} · ${fmt(range / ticks, 3)} N = <strong>${fmtUnit(F, "N", 2)}</strong>`,
          };
        }
        const grams = rng.pick([150, 200, 250, 350, 500]);
        const F = (grams / 1000) * G;
        return {
          prompt: `An einen Kraftmesser wird ein Körper mit ${fmtUnit(grams, "g", 0)} Masse gehängt (g = 9,81 N/kg). Welche Kraft zeigt das Gerät an?`,
          given: [`m = ${fmtUnit(grams, "g", 0)} = ${fmtUnit(grams / 1000, "kg", 3)}`, "g = 9,81 N/kg"],
          answer: F,
          unit: "N",
          digits: 2,
          solutionHtml: `F = m · g = ${fmt(grams / 1000, 3)} kg · 9,81 N/kg = <strong>${fmtUnit(F, "N", 2)}</strong><br>(Das ist die Gewichtskraft, mehr dazu in Lektion 1.6.)`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erkennst Kräfte an ihren Wirkungen und zeichnest sie mit Betrag, Richtung und Angriffspunkt.",
};

// 1.4 Wechselwirkung und Kräftegleichgewicht ───────────────────────────────

const wechselwirkung: Lesson = {
  id: "kr-4-wechselwirkung",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "1.4 Wechselwirkung und Kräftegleichgewicht",
  subtitle: "Zwei Körper, zwei Kräfte: wo greifen sie an?",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Wechselwirkungsprinzip, Wechselwirkungskräfte von Kräften im Gleichgewicht unterscheiden",
  whyItMatters:
    "Wenn du gegen eine Wand drückst, drückt die Wand genauso stark zurück. Warum bewegt sich dann trotzdem etwas? Die Antwort hängt davon ab, an welchem Körper die Kräfte angreifen.",
  explanationHtml: `
    <p><strong>Wechselwirkungsprinzip:</strong> Übt ein Körper A auf einen Körper B eine Kraft aus, so übt B auch auf A eine Kraft aus. Beide Kräfte sind <strong>gleich groß</strong> und <strong>entgegengesetzt gerichtet</strong>, aber sie greifen an <strong>verschiedenen Körpern</strong> an.</p>
    <p><strong>Kräftegleichgewicht:</strong> Zwei Kräfte greifen am <strong>selben</strong> Körper an, sind gleich groß und entgegengesetzt. Ihre Wirkung hebt sich auf: Der Körper bleibt in Ruhe oder bewegt sich gleichförmig geradeaus.</p>
    <ul>
      <li>Hand drückt gegen die Wand (Kraft auf die Wand) und Wand drückt gegen die Hand (Kraft auf die Hand): Wechselwirkung.</li>
      <li>Buch auf dem Tisch: Die Gewichtskraft (Erde zieht am Buch) und die Stützkraft des Tisches (Tisch trägt das Buch) greifen beide am Buch an: Gleichgewicht.</li>
      <li>Der Wechselwirkungspartner der Gewichtskraft des Buches ist die Kraft, mit der das Buch die Erde anzieht.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Wechselwirkung: gleich groß, entgegengesetzt, <em>verschiedene</em> Körper. Gleichgewicht: gleich groß, entgegengesetzt, <em>derselbe</em> Körper.</div>
  `,
  formulas: [
    { name: "Wechselwirkung", html: "F<sub>A→B</sub> = F<sub>B→A</sub> (Betrag), entgegengesetzt", quantities: "greifen an verschiedenen Körpern an" },
    { name: "Gleichgewicht", html: "F<sub>1</sub> = F<sub>2</sub> (Betrag), entgegengesetzt", quantities: "greifen am selben Körper an; die Summe ist null" },
  ],
  quiz: {
    question: "Ein Buch liegt ruhig auf dem Tisch. Welche Kraft ist der Wechselwirkungspartner der Gewichtskraft des Buches?",
    options: [
      "Die Kraft, mit der der Tisch das Buch nach oben stützt",
      "Die Kraft, mit der das Buch die Erde anzieht",
      "Der Luftdruck auf das Buch",
    ],
    correctIndex: 1,
    explanation: "Die Stützkraft des Tisches greift am selben Buch an: Sie steht mit der Gewichtskraft im Gleichgewicht. Der Wechselwirkungspartner greift an einem anderen Körper an, der Erde.",
  },
  lab: {
    kind: "interaction",
    title: "Labor: Wo greifen die Kräfte an?",
    intro: "Wähle einen Fall. Rot sind die Kräfte auf den jeweils betrachteten Körper, grün die Gegenkräfte auf den Partner.",
    params: [
      {
        type: "choice",
        key: "case",
        label: "Fall",
        options: [
          { value: 0, label: "Hand drückt gegen die Wand" },
          { value: 1, label: "Buch liegt auf dem Tisch" },
        ],
        value: 0,
      },
      { type: "range", key: "F", label: "Kraft F", unit: "N", min: 10, max: 200, step: 10, value: 50 },
    ],
    readouts: [
      { key: "kind", label: "Art des Kräftepaars", compute: (v) => (v.case === 0 ? "Wechselwirkung (verschiedene Körper)" : "Gleichgewicht (derselbe Körper)") },
      { key: "onA", label: "Kraft auf Körper A (Hand beziehungsweise Buch)", unit: "N", digits: 0, compute: (v) => v.F },
      { key: "onB", label: "Kraft auf Körper B (Wand beziehungsweise Tisch)", unit: "N", digits: 0, compute: (v) => v.F },
      { key: "sum", label: "Summe der Kräfte auf das Buch", unit: "N", digits: 0, compute: (v) => (v.case === 1 ? 0 : v.F) },
    ],
    goals: [
      { id: "wand-achtzig", text: "Hand drückt mit 80 N gegen die Wand: Wähle den Fall und zeige, dass auch die Wand mit 80 N zurückdrückt.", check: (v) => v.case === 0 && v.F === 80 },
      { id: "buch-dreissig", text: "Ein Buch mit 30 N Gewichtskraft liegt auf dem Tisch: Der Tisch stützt mit 30 N, die Summe auf das Buch ist 0 N.", check: (v, r) => v.case === 1 && v.F === 30 && Number(r.sum) === 0 },
      { id: "wand-maximal", text: "Drücke mit 200 N gegen die Wand: Die Gegenkraft ist genauso groß.", check: (v) => v.case === 0 && v.F === 200 },
    ],
  },
  exercises: [
    {
      id: "gleichgewicht",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(2, 40);
          const FG = m * G;
          return {
            prompt: `Eine Kiste mit ${fmtUnit(m, "kg", 0)} Masse steht ruhig auf dem Boden. Mit welcher Kraft stützt der Boden die Kiste? (g = 9,81 N/kg)`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, "g = 9,81 N/kg"],
            formulaHint: "Gleichgewicht: Stützkraft = Gewichtskraft = m · g",
            answer: FG,
            unit: "N",
            digits: 1,
            solutionHtml: `Die Kiste ruht: Die Kräfte auf sie sind im Gleichgewicht.<br>F = F<sub>G</sub> = m · g = ${fmt(m, 0)} kg · 9,81 N/kg = <strong>${fmtUnit(FG, "N", 1)}</strong>`,
          };
        }
        const F1 = rng.int(30, 60);
        const F2 = rng.int(10, F1 - 5);
        return {
          prompt: `Auf einen ruhenden Wagen wirken waagerecht drei Kräfte: Nach links ziehen ${fmtUnit(F1, "N", 0)}, nach rechts ziehen ${fmtUnit(F2, "N", 0)}. Mit welcher dritten Kraft (Betrag) und in welche Richtung muss er festgehalten werden, damit er in Ruhe bleibt? Gib den Betrag an.`,
          given: [`nach links: ${fmtUnit(F1, "N", 0)}`, `nach rechts: ${fmtUnit(F2, "N", 0)}`],
          answer: F1 - F2,
          unit: "N",
          digits: 0,
          solutionHtml: `Im Gleichgewicht muss die Summe aller Kräfte null sein.<br>Es fehlen ${fmt(F1, 0)} N − ${fmt(F2, 0)} N = <strong>${fmtUnit(F1 - F2, "N", 0)}</strong> nach rechts.`,
        };
      },
    },
    {
      id: "wechselwirkung",
      make: (rng, level) => {
        if (level === 1) {
          const F = rng.int(4, 40) * 5;
          return {
            prompt: `Eine Schülerin drückt mit ${fmtUnit(F, "N", 0)} gegen eine Wand. Mit welcher Kraft drückt die Wand auf die Schülerin?`,
            given: [`Kraft der Hand auf die Wand: ${fmtUnit(F, "N", 0)}`],
            formulaHint: "Wechselwirkungsprinzip: F(Wand auf Hand) = F(Hand auf Wand)",
            answer: F,
            unit: "N",
            digits: 0,
            solutionHtml: `Wechselwirkung: Die Kraft auf die Hand ist gleich groß wie die auf die Wand. <strong>${fmtUnit(F, "N", 0)}</strong>, aber in die Gegenrichtung.`,
          };
        }
        const F = rng.int(6, 30) * 5;
        return {
          prompt: `Zwei Eisläufer stehen sich gegenüber. Anna schiebt Ben mit ${fmtUnit(F, "N", 0)} von sich weg. Mit welcher Kraft schiebt Ben dabei Anna?`,
          given: [`Kraft von Anna auf Ben: ${fmtUnit(F, "N", 0)}`],
          answer: F,
          unit: "N",
          digits: 0,
          solutionHtml: `Die Kräfte greifen an verschiedenen Körpern an und sind gleich groß: Ben schiebt Anna mit <strong>${fmtUnit(F, "N", 0)}</strong> zurück, nur der andere Körper ist betroffen. Deshalb bewegen sich beide voneinander weg.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du trennst Wechselwirkung (zwei Körper) und Gleichgewicht (ein Körper) sicher.",
};

// 1.5 Feder und Gesetz von Hooke ───────────────────────────────────────────

const hooke: Lesson = {
  id: "kr-5-hooke",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "1.5 Feder und Gesetz von Hooke",
  subtitle: "Doppelte Kraft, doppelte Dehnung, aber nur bis zur Grenze",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Gesetz von Hooke, Kraftmessgeräte; elastischer und plastischer Verformungszustand",
  whyItMatters:
    "Jeder Federkraftmesser, jede Fahrradfederung und jedes Trampolin nutzt, dass sich Federn gesetzmäßig dehnen. Und jeder weiß: Biegt man eine Büroklammer zu weit, bleibt sie krumm.",
  explanationHtml: `
    <p>Hängt man an eine Schraubenfeder Körper, so wird sie länger. Die <strong>Dehnung</strong> ist <em>s = l − l₀</em> (neue Länge minus Anfangslänge).</p>
    <p><strong>Gesetz von Hooke:</strong> Im elastischen Bereich ist die Dehnung <strong>direkt proportional</strong> zur wirkenden Kraft: doppelte Kraft, doppelte Dehnung.</p>
    <p class="formula-line">F = D · s</p>
    <ul>
      <li>Die <strong>Federkonstante</strong> D = F / s (in N/m oder N/cm) ist ein Maß für die Härte der Feder: harte Feder, großes D.</li>
      <li>Im F-s-Diagramm ist der elastische Bereich eine <strong>Ursprungsgerade</strong>.</li>
      <li>Bis zur <strong>Elastizitätsgrenze</strong> geht die Feder nach dem Entlasten in die Ausgangslänge zurück (<strong>elastische Verformung</strong>). Darüber bleibt sie dauerhaft verformt (<strong>plastische Verformung</strong>), und das Gesetz von Hooke gilt nicht mehr.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Ein Federkraftmesser darf nie über seinen Messbereich belastet werden, sonst wird die Feder plastisch verformt und das Gerät zeigt falsch an.</div>
  `,
  formulas: [
    { name: "Gesetz von Hooke", html: "F = D · s", quantities: "F in N, s in m, D in N/m (nur im elastischen Bereich)" },
    { name: "Federkonstante", html: "D = F / s", quantities: "z. B. 4 N / 0,10 m = 40 N/m" },
    { name: "Dehnung", html: "s = l − l<sub>0</sub>", quantities: "Länge belastet minus Länge unbelastet" },
  ],
  quiz: {
    question: "Eine Feder dehnt sich bei 2 N um 4 cm und bei 4 N um 8 cm. Bei 20 N misst man statt 40 cm sogar 70 cm. Was ist passiert?",
    options: [
      "Die Elastizitätsgrenze wurde überschritten, die Verformung ist plastisch",
      "Das Gesetz von Hooke gilt immer, die Messung ist falsch",
      "Die Feder ist leichter geworden",
    ],
    correctIndex: 0,
    explanation: "Hooke gilt nur im elastischen Bereich. Darüber wird die Dehnung größer als proportional, und die Feder bleibt dauerhaft verformt.",
  },
  lab: {
    kind: "spring",
    title: "Labor: Feder belasten",
    intro: "Hänge verschieden große Kräfte an eine Feder. Die Elastizitätsgrenze liegt bei 6 N. Beobachte das F-s-Diagramm.",
    params: [
      { type: "range", key: "F", label: "Zugkraft F", unit: "N", min: 0.5, max: 10, step: 0.5, value: 2, digits: 1 },
      {
        type: "choice",
        key: "D",
        label: "Feder",
        options: [
          { value: 20, label: "weich, D = 20 N/m" },
          { value: 40, label: "mittel, D = 40 N/m" },
          { value: 80, label: "hart, D = 80 N/m" },
        ],
        value: 20,
      },
    ],
    readouts: [
      { key: "s", label: "Dehnung s", unit: "cm", digits: 1, emphasis: true, compute: (v) => springExtension(v.F, v.D) * 100 },
      { key: "state", label: "Zustand", emphasis: true, compute: (v) => (v.F <= F_ELASTIC ? "elastisch" : "plastisch") },
      { key: "ratio", label: "Quotient F / s", unit: "N/m", digits: 1, compute: (v) => v.F / springExtension(v.F, v.D) },
    ],
    goals: [
      { id: "zehn-cm", text: "Dehne die mittlere Feder (D = 40 N/m) um genau 10 cm.", check: (v, r) => v.D === 40 && near(Number(r.s), 10, 0.001) },
      { id: "plastisch", text: "Überschreite die Elastizitätsgrenze: Die Verformung wird plastisch.", check: (_v, r) => r.state === "plastisch" },
      { id: "doppelt", text: "Verdopple an der weichen Feder (D = 20 N/m) die Kraft von 2 N auf 4 N: Die Dehnung verdoppelt sich von 10 cm auf 20 cm.", check: (v) => v.D === 20 && v.F === 4 },
    ],
  },
  exercises: [
    {
      id: "dehnung",
      make: (rng, level) => {
        if (level === 1) {
          const D = rng.pick([20, 25, 40, 50, 80]);
          const F = rng.pick([1, 1.5, 2, 2.5, 3, 4]);
          const s = (F / D) * 100;
          return {
            prompt: `Eine Schraubenfeder mit der Federkonstante ${fmtUnit(D, "N/m", 0)} wird mit ${fmtUnit(F, "N", 1)} belastet (elastischer Bereich). Um wie viel Zentimeter wird sie gedehnt?`,
            given: [`D = ${fmtUnit(D, "N/m", 0)}`, `F = ${fmtUnit(F, "N", 1)}`],
            formulaHint: "F = D · s, also s = F / D",
            answer: s,
            unit: "cm",
            digits: 1,
            solutionHtml: `s = F / D = ${fmt(F, 1)} N / ${fmt(D, 0)} N/m = ${fmt(F / D, 3)} m = <strong>${fmtUnit(s, "cm", 1)}</strong>`,
          };
        }
        const D = rng.pick([25, 40, 50]);
        const gram = rng.pick([150, 200, 250, 300, 400]);
        const F = (gram / 1000) * G;
        const s = (F / D) * 100;
        return {
          prompt: `An einer Feder (D = ${fmtUnit(D, "N/m", 0)}) hängt ein Körper mit ${fmtUnit(gram, "g", 0)} Masse. Wie weit dehnt sich die Feder (g = 9,81 N/kg, elastischer Bereich)?`,
          given: [`D = ${fmtUnit(D, "N/m", 0)}`, `m = ${fmtUnit(gram, "g", 0)}`, "g = 9,81 N/kg"],
          answer: s,
          unit: "cm",
          digits: 1,
          solutionHtml: `F = m · g = ${fmt(gram / 1000, 3)} kg · 9,81 N/kg = ${fmt(F, 2)} N<br>s = F / D = ${fmt(F, 2)} N / ${fmt(D, 0)} N/m = <strong>${fmtUnit(s, "cm", 1)}</strong>`,
        };
      },
    },
    {
      id: "federkonstante",
      make: (rng, level) => {
        if (level === 1) {
          const D = rng.pick([20, 25, 40, 50, 80]);
          const sCm = rng.pick([4, 5, 8, 10, 12.5]);
          const F = (D * sCm) / 100;
          return {
            prompt: `Eine Feder wird mit ${fmtUnit(F, "N", 2)} um ${fmtUnit(sCm, "cm", 1)} gedehnt. Wie groß ist ihre Federkonstante?`,
            given: [`F = ${fmtUnit(F, "N", 2)}`, `s = ${fmtUnit(sCm, "cm", 1)} = ${fmtUnit(sCm / 100, "m", 3)}`],
            formulaHint: "D = F / s",
            answer: D,
            unit: "N/m",
            digits: 1,
            solutionHtml: `D = F / s = ${fmt(F, 2)} N / ${fmt(sCm / 100, 3)} m = <strong>${fmtUnit(D, "N/m", 1)}</strong>`,
          };
        }
        const D = rng.pick([30, 40, 50, 60]);
        const l0 = rng.pick([10, 12, 15]);
        const m = rng.pick([0.2, 0.3, 0.5, 0.6]);
        const F = m * G;
        const s = F / D;
        return {
          prompt: `Eine Feder ist unbelastet ${fmtUnit(l0, "cm", 0)} lang. Hängt man ${fmtUnit(m, "kg", 1)} an, ist sie ${fmtUnit(l0 + s * 100, "cm", 1)} lang (elastischer Bereich, g = 9,81 N/kg). Bestimme die Federkonstante.`,
          given: [`l₀ = ${fmtUnit(l0, "cm", 0)}`, `l = ${fmtUnit(l0 + s * 100, "cm", 1)}`, `m = ${fmtUnit(m, "kg", 1)}`],
          answer: D,
          unit: "N/m",
          digits: 1,
          tolerance: 0.03,
          solutionHtml: `s = l − l₀ = ${fmt(s * 100, 1)} cm = ${fmt(s, 3)} m<br>F = m · g = ${fmt(F, 2)} N<br>D = F / s = <strong>${fmtUnit(D, "N/m", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du nutzt Hooke sicher und weißt, wo das Gesetz endet: an der Elastizitätsgrenze.",
};

// 1.6 Masse und Gewichtskraft ──────────────────────────────────────────────

const masseGewicht: Lesson = {
  id: "kr-6-masse-gewicht",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "1.6 Masse und Gewichtskraft",
  subtitle: "Die Masse bleibt, das Gewicht wechselt den Ort",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Gravitation, Gewichtskraft, Masse, Ortsfaktor",
  whyItMatters:
    "Auf dem Mond könntest du sechsmal so hoch springen. Dein Körper ist dort aber nicht leichter geworden, nur die Anziehung ist schwächer. Masse und Gewichtskraft sind zwei verschiedene Größen.",
  explanationHtml: `
    <p>Die <strong>Masse m</strong> (Einheit kg) ist ein Maß für die Trägheit und für die Schwere eines Körpers; sie hängt davon ab, wie viel Materie der Körper enthält. Sie ist <strong>ortsunabhängig</strong>. Man misst sie mit der Balkenwaage durch Vergleich mit Massestücken.</p>
    <p>Die <strong>Gewichtskraft F<sub>G</sub></strong> (Einheit N) ist die Kraft, mit der ein Himmelskörper (<strong>Gravitation</strong>) einen Körper anzieht. Sie zeigt zum Mittelpunkt des Himmelskörpers und hängt vom Ort ab. Man misst sie mit dem Kraftmesser.</p>
    <p class="formula-line">F<sub>G</sub> = m · g</p>
    <ul>
      <li>Der <strong>Ortsfaktor g</strong> sagt, wie viel Gewichtskraft pro Kilogramm wirkt: Erde 9,81 N/kg (etwa 10), Mond 1,62 N/kg, Mars 3,71 N/kg, Jupiter 24,8 N/kg.</li>
      <li>Auf der Erde wiegen 100 g etwa 1 N.</li>
      <li>Umgekehrt: m = F<sub>G</sub> / g.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Die Balkenwaage zeigt überall dieselbe Masse. Der Kraftmesser zeigt die Gewichtskraft, und die ändert sich mit dem Ortsfaktor.</div>
  `,
  formulas: [
    { name: "Gewichtskraft", html: "F<sub>G</sub> = m · g", quantities: "F in N, m in kg, g in N/kg" },
    { name: "Masse", html: "m = F<sub>G</sub> / g", quantities: "" },
    { name: "Ortsfaktor Erde", html: "g = 9,81 N/kg ≈ 10 N/kg", quantities: "Mond 1,62; Mars 3,71; Jupiter 24,8 N/kg" },
  ],
  quiz: {
    question: "Ein Astronaut fliegt von der Erde zum Mond. Was ändert sich?",
    options: [
      "Seine Masse sinkt auf etwa ein Sechstel",
      "Seine Gewichtskraft sinkt auf etwa ein Sechstel, seine Masse bleibt gleich",
      "Weder Masse noch Gewichtskraft ändern sich",
    ],
    correctIndex: 1,
    explanation: "Der Ortsfaktor auf dem Mond beträgt 1,62 N/kg statt 9,81 N/kg: F_G = m · g wird kleiner, die Masse m bleibt.",
  },
  lab: {
    kind: "weight-places",
    title: "Labor: Wiegen auf anderen Himmelskörpern",
    intro: "Wähle Masse und Ort. Die Balkenwaage links vergleicht Massen, der Kraftmesser rechts zeigt die Gewichtskraft.",
    params: [
      { type: "range", key: "m", label: "Masse m", unit: "kg", min: 1, max: 100, step: 1, value: 10 },
      {
        type: "choice",
        key: "g",
        label: "Ort (Ortsfaktor g)",
        options: [
          { value: 9.81, label: "Erde, 9,81 N/kg" },
          { value: 1.62, label: "Mond, 1,62 N/kg" },
          { value: 3.71, label: "Mars, 3,71 N/kg" },
          { value: 24.79, label: "Jupiter, 24,79 N/kg" },
        ],
        value: 9.81,
      },
    ],
    readouts: [
      { key: "FG", label: "Gewichtskraft F_G = m · g", unit: "N", digits: 1, emphasis: true, compute: (v) => v.m * v.g },
      { key: "mbalance", label: "Balkenwaage zeigt Masse", unit: "kg", digits: 0, compute: (v) => v.m },
      { key: "rel", label: "Gewichtskraft im Vergleich zur Erde", unit: "%", digits: 0, compute: (v) => (v.g / 9.81) * 100 },
    ],
    goals: [
      { id: "mars", text: "Ein 50-kg-Körper wird auf dem Mars mit 185,5 N angezogen: Stelle Mars und 50 kg ein.", check: (v, r) => v.g === 3.71 && near(Number(r.FG), 185.5, 0.01) },
      { id: "gleich-wie-erde", text: "Finde eine Masse, die auf dem Mond die Gewichtskraft von 10 kg auf der Erde hat (98 N, ±3 %).", check: (v, r) => v.g === 1.62 && near(Number(r.FG), 98.1, 0.03) },
      { id: "jupiter", text: "Wiege 1 kg auf Jupiter: mehr als 24 N.", check: (v, r) => v.g === 24.79 && v.m === 1 && Number(r.FG) > 24 },
    ],
  },
  exercises: [
    {
      id: "gewichtskraft",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(2, 90);
          const FG = m * G;
          return {
            prompt: `Berechne die Gewichtskraft eines Körpers mit ${fmtUnit(m, "kg", 0)} Masse auf der Erde.`,
            given: [`m = ${fmtUnit(m, "kg", 0)}`, "g = 9,81 N/kg"],
            formulaHint: "F_G = m · g",
            answer: FG,
            unit: "N",
            digits: 1,
            solutionHtml: `F<sub>G</sub> = m · g = ${fmt(m, 0)} kg · 9,81 N/kg = <strong>${fmtUnit(FG, "N", 1)}</strong>`,
          };
        }
        const place = rng.pick([
          { name: "dem Mond", g: 1.62 },
          { name: "dem Mars", g: 3.71 },
          { name: "dem Jupiter", g: 24.79 },
        ]);
        const m = rng.pick([55, 70, 80, 90]);
        const FG = m * place.g;
        return {
          prompt: `Ein Astronaut hat mitsamt Ausrüstung eine Masse von ${fmtUnit(m, "kg", 0)}. Mit welcher Gewichtskraft wird er auf ${place.name} angezogen (Ortsfaktor ${fmtUnit(place.g, "N/kg", 2)})?`,
          given: [`m = ${fmtUnit(m, "kg", 0)}`, `g = ${fmtUnit(place.g, "N/kg", 2)}`],
          answer: FG,
          unit: "N",
          digits: 0,
          solutionHtml: `F<sub>G</sub> = m · g = ${fmt(m, 0)} kg · ${fmt(place.g, 2)} N/kg = <strong>${fmtUnit(FG, "N", 0)}</strong>`,
        };
      },
    },
    {
      id: "masse-aus-gewicht",
      make: (rng, level) => {
        if (level === 1) {
          const m = rng.int(3, 80);
          const FG = m * G;
          return {
            prompt: `Ein Kraftmesser zeigt für einen Körper auf der Erde ${fmtUnit(FG, "N", 1)}. Welche Masse hat der Körper?`,
            given: [`F_G = ${fmtUnit(FG, "N", 1)}`, "g = 9,81 N/kg"],
            formulaHint: "m = F_G / g",
            answer: m,
            unit: "kg",
            digits: 1,
            solutionHtml: `m = F<sub>G</sub> / g = ${fmt(FG, 1)} N / 9,81 N/kg = <strong>${fmtUnit(m, "kg", 1)}</strong>`,
          };
        }
        const m = rng.pick([5, 8, 12, 20, 30]);
        const FG = m * 1.62;
        return {
          prompt: `Eine Sonde auf dem Mond (Ortsfaktor 1,62 N/kg) wird mit einem Kraftmesser gewogen: ${fmtUnit(FG, "N", 2)}. Welche Masse hat die Sonde? (Die Masse ist an jedem Ort gleich.)`,
          given: [`F_G = ${fmtUnit(FG, "N", 2)}`, "g(Mond) = 1,62 N/kg"],
          answer: m,
          unit: "kg",
          digits: 1,
          solutionHtml: `m = F<sub>G</sub> / g = ${fmt(FG, 2)} N / 1,62 N/kg = <strong>${fmtUnit(m, "kg", 1)}</strong>. Die Masse ist überall gleich, auch auf der Erde.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Masse in Kilogramm, Gewichtskraft in Newton: Du hältst beide auseinander.",
};

// 1.7 Teilchenmodell und Aggregatzustände ──────────────────────────────────

const teilchenmodell: Lesson = {
  id: "kr-7-teilchenmodell",
  stageId: STAGE_ID,
  stepNumber: 7,
  title: "1.7 Teilchenmodell und Aggregatzustände",
  subtitle: "Warum Festes fest, Wasser flüssig und Luft überall ist",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Teilchenmodell, Eigenschaften von Materie bei verschiedenen Aggregatzuständen",
  whyItMatters:
    "Niemand hat je ein Wasserteilchen gesehen. Trotzdem erklärt die Vorstellung kleinster Teilchen, warum Parfüm sich im Raum ausbreitet, warum Eis hart ist und warum sich Luft zusammendrücken lässt.",
  explanationHtml: `
    <p><strong>Teilchenmodell:</strong> Alle Stoffe bestehen aus kleinsten Teilchen (Atome, Moleküle). Zwischen ihnen ist Leerraum. Die Teilchen bewegen sich ständig (je wärmer, desto schneller) und ziehen sich gegenseitig an.</p>
    <ul>
      <li><strong>Fest:</strong> Teilchen dicht gepackt auf festen Plätzen (Gitter), sie schwingen nur. Feste Form, festes Volumen.</li>
      <li><strong>Flüssig:</strong> Teilchen dicht, aber gegeneinander <em>verschiebbar</em>. Das Volumen ist fest, die Form passt sich dem Gefäß an.</li>
      <li><strong>Gasförmig:</strong> Teilchen weit voneinander entfernt und frei beweglich. Gase füllen jeden Raum aus und lassen sich zusammendrücken.</li>
    </ul>
    <p><strong>Beobachtungen, die das Modell erklärt:</strong> Diffusion (Duft verbreitet sich), 50 mL Wasser plus 50 mL Alkohol ergeben weniger als 100 mL (kleine Teilchen füllen Lücken), Ölfleck-Versuch: Die Schichtdicke d = V / A einer einlagigen Ölschicht ist etwa der Moleküldurchmesser.</p>
    <div class="merke"><strong>Merke:</strong> Ein Modell erklärt Beobachtungen und sagt neue voraus. Es ist ein Bild, keine Fotografie der Wirklichkeit.</div>
  `,
  formulas: [
    { name: "Schichtdicke (Ölfleck)", html: "d = V / A", quantities: "V Ölvolumen, A Fläche des Flecks; d ≈ Moleküldurchmesser" },
    { name: "1 mm³ auf 1 m²", html: "1 mm³ / 1 m² = 1 nm", quantities: "Ölvolumen in mm³ geteilt durch Fläche in m² gibt d in nm" },
  ],
  quiz: {
    question: "Warum füllt ein Gas jeden Behälter vollständig aus?",
    options: [
      "Die Teilchen sitzen auf festen Plätzen und schwingen",
      "Die Teilchen sind weit voneinander entfernt und bewegen sich frei in alle Richtungen",
      "Gase sind schwerer als Flüssigkeiten",
    ],
    correctIndex: 1,
    explanation: "Zwischen den Gasteilchen wirken kaum Kräfte. Sie fliegen geradeaus, bis sie an eine Wand oder ein anderes Teilchen stoßen, und verteilen sich so im ganzen Raum.",
  },
  lab: {
    kind: "particle-states",
    title: "Labor: Teilchen im Behälter",
    intro: "Wähle den Aggregatzustand und die Temperatur. Beobachte Anordnung, Abstand und Beweglichkeit der Teilchen.",
    params: [
      {
        type: "choice",
        key: "state",
        label: "Aggregatzustand",
        options: [
          { value: 0, label: "fest" },
          { value: 1, label: "flüssig" },
          { value: 2, label: "gasförmig" },
        ],
        value: 0,
      },
      { type: "range", key: "temp", label: "Temperatur (relativ)", unit: "%", min: 0, max: 100, step: 10, value: 30 },
    ],
    readouts: [
      { key: "order", label: "Anordnung", compute: (v) => (v.state === 0 ? "regelmäßig, feste Plätze" : v.state === 1 ? "dicht, ungeordnet" : "ungeordnet, weit auseinander") },
      { key: "move", label: "Bewegung", compute: (v) => (v.state === 0 ? "Schwingen um den Platz" : v.state === 1 ? "Gleiten aneinander vorbei" : "freies Fliegen mit Stößen") },
      { key: "shape", label: "Form und Volumen", compute: (v) => (v.state === 0 ? "feste Form, festes Volumen" : v.state === 1 ? "Form variabel, Volumen fest" : "füllt den ganzen Behälter") },
    ],
    goals: [
      { id: "gas", text: "Stelle den gasförmigen Zustand ein: Die Teilchen füllen den ganzen Behälter.", check: (v) => v.state === 2 },
      { id: "fest-heiss", text: "Erhitze den Festkörper (Temperatur ≥ 80 %): Die Teilchen schwingen stark, bleiben aber auf ihren Plätzen.", check: (v) => v.state === 0 && v.temp >= 80 },
      { id: "fluessig-kalt", text: "Kühle die Flüssigkeit stark ab (Temperatur ≤ 20 %): Die Teilchen gleiten nur noch langsam.", check: (v) => v.state === 1 && v.temp <= 20 },
    ],
  },
  exercises: [
    {
      id: "oelfleck",
      make: (rng, level) => {
        if (level === 1) {
          const dNm = rng.pick([1.5, 2, 2.5, 3]);
          const A = rng.pick([0.04, 0.05, 0.06, 0.08]);
          const V = dNm * A;
          return {
            prompt: `Beim Ölfleck-Versuch breitet sich ${fmtUnit(V, "mm³", 3)} Öl zu einem Fleck der Fläche ${fmtUnit(A, "m²", 2)} aus, der nur ein Molekül dick ist. Wie dick ist die Schicht?`,
            given: [`V = ${fmtUnit(V, "mm³", 3)}`, `A = ${fmtUnit(A, "m²", 2)}`, "1 mm³ auf 1 m² gibt 1 nm"],
            formulaHint: "d = V / A (V in mm³, A in m², d in nm)",
            answer: dNm,
            unit: "nm",
            digits: 2,
            solutionHtml: `d = V / A = ${fmt(V, 3)} mm³ / ${fmt(A, 2)} m² = <strong>${fmtUnit(dNm, "nm", 2)}</strong> (1 nm = 10⁻⁹ m)`,
          };
        }
        const diameterCm = rng.pick([20, 24, 28, 30]);
        const V = rng.pick([0.08, 0.1, 0.12]);
        const A = Math.PI * (diameterCm / 100 / 2) ** 2;
        const dNm = V / A;
        return {
          prompt: `Ein Ölfleck auf Wasser hat den Durchmesser ${fmtUnit(diameterCm, "cm", 0)}. Das Öl hatte ein Volumen von ${fmtUnit(V, "mm³", 2)}. Berechne zuerst die Fläche (Kreis) und dann die Schichtdicke.`,
          given: [`Durchmesser ${fmtUnit(diameterCm, "cm", 0)}`, `V = ${fmtUnit(V, "mm³", 2)}`],
          answer: dNm,
          unit: "nm",
          digits: 2,
          tolerance: 0.03,
          solutionHtml: `A = π · r² = π · (${fmt(diameterCm / 200, 3)} m)² = ${fmt(A, 4)} m²<br>d = V / A = ${fmt(V, 2)} mm³ / ${fmt(A, 4)} m² = <strong>${fmtUnit(dNm, "nm", 2)}</strong>`,
        };
      },
    },
    {
      id: "dampf-volumen",
      make: (rng, level) => {
        const factor = 1700;
        if (level === 1) {
          const L = rng.pick([0.1, 0.2, 0.25, 0.5]);
          return {
            prompt: `Wenn ${fmtUnit(L, "L", 2)} Wasser bei 100 °C vollständig verdampft, nimmt der Wasserdampf etwa das 1700-fache Volumen ein. Wie viele Liter Dampf entstehen?`,
            given: [`V(Wasser) = ${fmtUnit(L, "L", 2)}`, "Faktor 1700"],
            formulaHint: "V(Dampf) = 1700 · V(Wasser)",
            answer: L * factor,
            unit: "L",
            digits: 0,
            solutionHtml: `V(Dampf) = ${fmt(L, 2)} L · 1700 = <strong>${fmtUnit(L * factor, "L", 0)}</strong><br>Die Teilchen sind im Dampf sehr weit voneinander entfernt.`,
          };
        }
        const mL = rng.pick([20, 40, 50, 75]);
        return {
          prompt: `Aus ${fmtUnit(mL, "mL", 0)} Wasser entsteht bei 100 °C Dampf mit dem 1700-fachen Volumen. Wie viele Liter nimmt der Dampf ein? Erkläre im Kopf mit dem Teilchenmodell, warum so viel Platz nötig ist.`,
          given: [`V(Wasser) = ${fmtUnit(mL, "mL", 0)}`, "Faktor 1700"],
          answer: (mL * factor) / 1000,
          unit: "L",
          digits: 1,
          solutionHtml: `V(Dampf) = ${fmt(mL, 0)} mL · 1700 = ${fmt(mL * factor, 0)} mL = <strong>${fmtUnit((mL * factor) / 1000, "L", 1)}</strong>. Im Gas sind die Abstände zwischen den Teilchen groß.`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du erklärst fest, flüssig und gasförmig mit Anordnung, Abstand und Bewegung der Teilchen.",
};

// 1.8 Volumen und Dichte ───────────────────────────────────────────────────

const dichte: Lesson = {
  id: "kr-8-dichte",
  stageId: STAGE_ID,
  stepNumber: 8,
  title: "1.8 Volumen und Dichte",
  subtitle: "Aus Masse und Volumen den Stoff erkennen",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Volumen, Dichte; Zusammenhang von Masse und Volumen homogener Körper",
  whyItMatters:
    "Eine Goldmünze, ein Stück Blei und ein Stein können gleich aussehen. Wiegst du sie und misst ihr Volumen, verrät die Dichte, woraus sie bestehen.",
  explanationHtml: `
    <p>Das <strong>Volumen V</strong> misst man in m³, dm³ (= 1 L) und cm³ (= 1 mL). Quader: V = a · b · c. Unregelmäßige Körper: mit Messzylinder oder Überlaufgefäß (Wasserverdrängung).</p>
    <p>Bei <strong>homogenen</strong> Körpern aus einem Stoff ist die Masse <strong>proportional zum Volumen</strong>. Der Quotient ist eine Stoffeigenschaft, die <strong>Dichte</strong>:</p>
    <p class="formula-line">ρ = m / V</p>
    <ul>
      <li>Einheiten: <strong>g/cm³</strong>, <strong>kg/dm³</strong> oder <strong>kg/m³</strong>. 1 g/cm³ = 1000 kg/m³.</li>
      <li>Dichten: Wasser 1,00 g/cm³; Aluminium 2,70; Eisen 7,87; Kupfer 8,96; Blei 11,34; Gold 19,3; Holz (Fichte) etwa 0,5; Luft 0,0012.</li>
      <li>Umgestellt: <strong>m = ρ · V</strong> und <strong>V = m / ρ</strong>.</li>
      <li>Teilchenmodell: Die Dichte hängt von der Masse der Teilchen und ihrem Abstand ab. Deshalb sind Gase viel weniger dicht als Flüssigkeiten und Feststoffe.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Gleiches Volumen, verschiedene Stoffe: verschiedene Massen. Die Dichte unterscheidet die Stoffe.</div>
  `,
  formulas: [
    { name: "Dichte", html: "ρ = m / V", quantities: "ρ in g/cm³ oder kg/m³, m in g oder kg, V in cm³ oder m³" },
    { name: "Masse", html: "m = ρ · V", quantities: "" },
    { name: "Volumen", html: "V = m / ρ", quantities: "1 L = 1000 cm³, 1 g/cm³ = 1000 kg/m³" },
  ],
  quiz: {
    question: "Zwei gleich große Würfel: einer aus Aluminium (2,7 g/cm³), einer aus Blei (11,3 g/cm³). Was gilt?",
    options: [
      "Beide haben dieselbe Masse, weil sie gleich groß sind",
      "Der Aluminiumwürfel hat die größere Masse",
      "Der Bleiwürfel hat die größere Masse, weil Blei die größere Dichte hat",
    ],
    correctIndex: 2,
    explanation: "m = ρ · V: Bei gleichem Volumen hat der Stoff mit der größeren Dichte die größere Masse.",
  },
  lab: {
    kind: "density",
    title: "Labor: Masse aus Volumen und Stoff",
    intro: "Wähle Stoff und Volumen. Die Waage zeigt die Masse. Beobachte, wie sie mit der Dichte wächst.",
    params: [
      {
        type: "choice",
        key: "rho",
        label: "Stoff (Dichte in g/cm³)",
        options: [
          { value: 0.03, label: "Styropor, 0,03" },
          { value: 0.5, label: "Fichtenholz, 0,5" },
          { value: 1, label: "Wasser, 1,0" },
          { value: 2.7, label: "Aluminium, 2,7" },
          { value: 7.87, label: "Eisen, 7,87" },
          { value: 8.96, label: "Kupfer, 8,96" },
          { value: 11.34, label: "Blei, 11,34" },
          { value: 19.3, label: "Gold, 19,3" },
        ],
        value: 7.87,
      },
      { type: "range", key: "V", label: "Volumen V", unit: "cm³", min: 1, max: 200, step: 1, value: 20 },
    ],
    readouts: [
      { key: "m", label: "Masse m = ρ · V", unit: "g", digits: 1, emphasis: true, compute: (v) => v.rho * v.V },
      { key: "mkg", label: "Masse in kg", unit: "kg", digits: 3, compute: (v) => (v.rho * v.V) / 1000 },
      { key: "rhoSI", label: "Dichte in kg/m³", unit: "kg/m³", digits: 0, compute: (v) => v.rho * 1000 },
    ],
    goals: [
      { id: "kupfer-90", text: "Stelle einen Kupferblock mit etwa 90 g Masse ein (±3 %).", check: (v, r) => v.rho === 8.96 && near(Number(r.m), 90, 0.03) },
      { id: "gold-kilo", text: "Gold ist so dicht, dass schon 100 cm³ fast 2 kg wiegen: Stelle Gold und mindestens 100 cm³ ein.", check: (v) => v.rho === 19.3 && v.V >= 100 },
      { id: "alu-fuenfzig", text: "50 cm³ Aluminium wiegen nur 135 g: Stelle es ein.", check: (v, r) => v.rho === 2.7 && v.V === 50 && near(Number(r.m), 135, 0.001) },
    ],
  },
  exercises: [
    {
      id: "dichte-berechnen",
      make: (rng, level) => {
        if (level === 1) {
          const rho = rng.pick([0.8, 2.7, 7.87, 8.96, 11.34]);
          const V = rng.pick([10, 20, 25, 40, 50]);
          const m = rho * V;
          return {
            prompt: `Ein Körper hat die Masse ${fmtUnit(m, "g", 1)} und das Volumen ${fmtUnit(V, "cm³", 0)}. Berechne seine Dichte.`,
            given: [`m = ${fmtUnit(m, "g", 1)}`, `V = ${fmtUnit(V, "cm³", 0)}`],
            formulaHint: "ρ = m / V",
            answer: rho,
            unit: "g/cm³",
            digits: 2,
            solutionHtml: `ρ = m / V = ${fmt(m, 1)} g / ${fmt(V, 0)} cm³ = <strong>${fmtUnit(rho, "g/cm³", 2)}</strong>`,
          };
        }
        const rho = rng.pick([2.7, 7.87, 8.96, 11.34]);
        const V = rng.pick([30, 40, 50, 60]);
        const m = rho * V;
        const Vstart = 200;
        return {
          prompt: `Ein Stein mit ${fmtUnit(m, "g", 1)} Masse wird in einen Messzylinder mit ${fmtUnit(Vstart, "mL", 0)} Wasser getaucht. Der Wasserstand steigt auf ${fmtUnit(Vstart + V, "mL", 0)}. Welche Dichte hat der Stein?`,
          given: [`m = ${fmtUnit(m, "g", 1)}`, `Wasserstand vorher ${fmtUnit(Vstart, "mL", 0)}, nachher ${fmtUnit(Vstart + V, "mL", 0)}`, "1 mL = 1 cm³"],
          answer: rho,
          unit: "g/cm³",
          digits: 2,
          solutionHtml: `V = ${fmt(Vstart + V, 0)} mL − ${fmt(Vstart, 0)} mL = ${fmt(V, 0)} mL = ${fmt(V, 0)} cm³<br>ρ = m / V = ${fmt(m, 1)} g / ${fmt(V, 0)} cm³ = <strong>${fmtUnit(rho, "g/cm³", 2)}</strong>`,
        };
      },
    },
    {
      id: "masse-volumen",
      make: (rng, level) => {
        if (level === 1) {
          const rho = rng.pick([2.7, 7.87, 8.96, 11.34, 19.3]);
          const V = rng.pick([15, 20, 30, 40, 100]);
          const m = rho * V;
          return {
            prompt: `Wie groß ist die Masse eines Körpers mit ${fmtUnit(V, "cm³", 0)} Volumen aus einem Stoff der Dichte ${fmtUnit(rho, "g/cm³", 2)}?`,
            given: [`ρ = ${fmtUnit(rho, "g/cm³", 2)}`, `V = ${fmtUnit(V, "cm³", 0)}`],
            formulaHint: "m = ρ · V",
            answer: m,
            unit: "g",
            digits: 1,
            solutionHtml: `m = ρ · V = ${fmt(rho, 2)} g/cm³ · ${fmt(V, 0)} cm³ = <strong>${fmtUnit(m, "g", 1)}</strong>`,
          };
        }
        const rho = rng.pick([0.74, 0.8, 0.92]);
        const L = rng.pick([40, 50, 60, 70]);
        const m = rho * L;
        return {
          prompt: `Ein Tank fasst ${fmtUnit(L, "L", 0)} Kraftstoff mit der Dichte ${fmtUnit(rho, "kg/L", 2)}. Wie viele Kilogramm sind das? Rechne zuerst mit der Einheit Liter.`,
          given: [`V = ${fmtUnit(L, "L", 0)}`, `ρ = ${fmtUnit(rho, "kg/L", 2)} (= ${fmtUnit(rho, "g/cm³", 2)})`],
          answer: m,
          unit: "kg",
          digits: 1,
          solutionHtml: `m = ρ · V = ${fmt(rho, 2)} kg/L · ${fmt(L, 0)} L = <strong>${fmtUnit(m, "kg", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Mit ρ = m / V erkennst du Stoffe und rechnest Masse, Volumen und Dichte ineinander um.",
};

// 1.9 Reibung ──────────────────────────────────────────────────────────────

const reibung: Lesson = {
  id: "kr-9-reibung",
  stageId: STAGE_ID,
  stepNumber: 9,
  title: "1.9 Reibung",
  subtitle: "Haften, gleiten, rollen: was Bremsen und Schuhe möglich macht",
  tracks: ["II_III"],
  lehrplan: "Ph8 LB 1 (II/III): Reibung (qualitativ), Bedeutung für Alltag, Technik und Straßenverkehr",
  whyItMatters:
    "Ohne Reibung könntest du weder gehen noch bremsen. Mit zu viel Reibung verschleißen Maschinen. Im Straßenverkehr entscheidet Reibung über Bremsweg und Sicherheit.",
  explanationHtml: `
    <p><strong>Reibungskräfte</strong> wirken in der Berührungsfläche zweier Körper <em>entgegen</em> der Bewegung oder dem Versuch, sie zu bewegen. Man unterscheidet drei Arten:</p>
    <ul>
      <li><strong>Haftreibung</strong>: hält einen ruhenden Körper fest. Sie wächst mit der Zugkraft bis zu einem Höchstwert.</li>
      <li><strong>Gleitreibung</strong>: wirkt auf einen gleitenden Körper. Sie ist kleiner als der Höchstwert der Haftreibung.</li>
      <li><strong>Rollreibung</strong>: wirkt auf rollende Körper und ist meist viel kleiner als die Gleitreibung.</li>
    </ul>
    <p><strong>Modell:</strong> Auch glatte Flächen sind unter dem Mikroskop rau. Die Unebenheiten verhaken sich, und die Teilchen der Flächen ziehen einander an. Je stärker die Flächen aufeinandergedrückt werden (größere Gewichtskraft), desto größer die Reibungskraft: <strong>F<sub>R</sub> ist proportional zur Anpresskraft F<sub>N</sub></strong>.</p>
    <ul>
      <li><strong>Nützlich:</strong> Gehen, Bremsen, Reifen, Schrauben, Knoten.</li>
      <li><strong>Schädlich:</strong> Verschleiß und Erwärmung in Maschinen. Man verringert sie durch Schmieren, Rollen, Luftkissen.</li>
      <li><strong>Straßenverkehr:</strong> Auf Nässe, Schnee und Eis ist die Reibung klein, der Bremsweg lang. Profil und Abstand halten sind keine Kleinigkeit.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> F<sub>Haft, max</sub> &gt; F<sub>Gleit</sub> &gt; F<sub>Roll</sub>. Reibung wirkt immer der Bewegung entgegen.</div>
  `,
  formulas: [
    { name: "Reihenfolge der Reibungskräfte", html: "F<sub>Haft, max</sub> &gt; F<sub>Gleit</sub> &gt; F<sub>Roll</sub>", quantities: "bei gleicher Anpresskraft und gleichen Flächen" },
    { name: "Proportionalität", html: "F<sub>R</sub> ~ F<sub>N</sub>", quantities: "doppelte Anpresskraft, doppelte Reibungskraft" },
  ],
  quiz: {
    question: "Eine schwere Kiste lässt sich nur mit großer Kraft ins Rutschen bringen. Ist sie in Bewegung, genügt eine kleinere Kraft. Warum?",
    options: [
      "Die Kiste wird beim Rutschen leichter",
      "Die Haftreibung ist größer als die Gleitreibung",
      "Die Gleitreibung ist größer als die Haftreibung",
    ],
    correctIndex: 1,
    explanation: "Im Stillstand verhaken sich die Unebenheiten stärker. Der Höchstwert der Haftreibung liegt über der Gleitreibung.",
  },
  lab: {
    kind: "friction",
    title: "Labor: Kiste ziehen",
    intro: "Ziehe eine Kiste mit wachsender Kraft. Wähle Masse, Untergrund und ob sie gleitet oder auf Rollen steht. Beobachte, wann sie sich löst.",
    params: [
      { type: "range", key: "m", label: "Masse der Kiste m", unit: "kg", min: 10, max: 100, step: 10, value: 40 },
      {
        type: "choice",
        key: "surf",
        label: "Untergrund",
        options: [
          { value: 0.05, label: "Eis" },
          { value: 0.4, label: "Holz auf Holz" },
          { value: 0.8, label: "Gummi auf Asphalt" },
        ],
        value: 0.4,
      },
      {
        type: "choice",
        key: "mode",
        label: "Auflage",
        options: [
          { value: 0, label: "Kiste liegt (Gleiten)" },
          { value: 1, label: "Kiste steht auf Rollen (Rollen)" },
        ],
        value: 0,
      },
      { type: "range", key: "F", label: "Zugkraft F", unit: "N", min: 0, max: 600, step: 10, value: 100 },
    ],
    readouts: [
      { key: "FN", label: "Anpresskraft F_N = m · g", unit: "N", digits: 0, compute: (v) => frictionLimits(v).FN },
      { key: "haftMax", label: "Höchstwert der Haftreibung", unit: "N", digits: 0, compute: (v) => frictionLimits(v).haftMax },
      { key: "FR", label: "Reibungskraft jetzt", unit: "N", digits: 0, emphasis: true, compute: (v) => { const l = frictionLimits(v); return v.F <= l.haftMax ? v.F : l.moving; } },
      { key: "state", label: "Zustand", emphasis: true, compute: (v) => { const l = frictionLimits(v); return v.F <= l.haftMax ? "haftet" : v.mode === 1 ? "rollt" : "gleitet"; } },
    ],
    goals: [
      { id: "holz-rutscht", text: "Bringe die Kiste auf Holz zum Gleiten.", check: (v, r) => v.surf === 0.4 && v.mode === 0 && r.state === "gleitet" },
      { id: "eis-leicht", text: "Auf Eis rutscht die Kiste schon bei höchstens 30 N.", check: (v, r) => v.surf === 0.05 && v.mode === 0 && v.F <= 30 && r.state === "gleitet" },
      { id: "rollen-leicht", text: "Auf Rollen genügen höchstens 30 N, damit die Kiste rollt.", check: (v, r) => v.mode === 1 && v.F <= 30 && r.state === "rollt" },
    ],
  },
  exercises: [
    {
      id: "reibung-proportional",
      make: (rng, level) => {
        if (level === 1) {
          const m1 = rng.pick([10, 20, 25, 40]);
          const k = rng.pick([2, 3, 4]);
          const F1 = rng.pick([20, 30, 40, 50]);
          const m2 = m1 * k;
          return {
            prompt: `Ein Schlitten mit ${fmtUnit(m1, "kg", 0)} Last gleitet bei einer Zugkraft von ${fmtUnit(F1, "N", 0)} gleichförmig. Wie groß muss die Zugkraft auf demselben Schnee bei ${fmtUnit(m2, "kg", 0)} Last sein?`,
            given: [`m₁ = ${fmtUnit(m1, "kg", 0)}, F₁ = ${fmtUnit(F1, "N", 0)}`, `m₂ = ${fmtUnit(m2, "kg", 0)}`],
            formulaHint: "F_R ist proportional zur Masse: F₂ = F₁ · m₂ / m₁",
            answer: F1 * k,
            unit: "N",
            digits: 0,
            solutionHtml: `Die Anpresskraft wächst auf das ${k}-fache, also auch die Reibungskraft.<br>F₂ = ${fmt(F1, 0)} N · ${k} = <strong>${fmtUnit(F1 * k, "N", 0)}</strong>`,
          };
        }
        const mEmpty = rng.pick([10, 15, 20]);
        const load = rng.pick([30, 45, 60]);
        const F1 = rng.pick([20, 30, 40]);
        const F2 = (F1 * (mEmpty + load)) / mEmpty;
        return {
          prompt: `Eine leere Schubkarre (${fmtUnit(mEmpty, "kg", 0)}) wird bei ${fmtUnit(F1, "N", 0)} Zugkraft gleichförmig über den Hof gezogen. Wie groß ist die Zugkraft, wenn zusätzlich ${fmtUnit(load, "kg", 0)} Sand geladen sind (gleicher Untergrund, gleiche Art der Reibung)?`,
          given: [`leer: ${fmtUnit(mEmpty, "kg", 0)} bei ${fmtUnit(F1, "N", 0)}`, `Last: ${fmtUnit(load, "kg", 0)}`],
          answer: F2,
          unit: "N",
          digits: 0,
          solutionHtml: `Gesamtmasse ${fmt(mEmpty + load, 0)} kg, das ist das ${fmt((mEmpty + load) / mEmpty, 2)}-fache.<br>F₂ = ${fmt(F1, 0)} N · ${fmt(mEmpty + load, 0)} / ${fmt(mEmpty, 0)} = <strong>${fmtUnit(F2, "N", 0)}</strong>`,
        };
      },
    },
    {
      id: "reibung-gleichgewicht",
      make: (rng, level) => {
        if (level === 1) {
          const F = rng.int(4, 40) * 5;
          return {
            prompt: `Ein Schlitten wird mit der Zugkraft ${fmtUnit(F, "N", 0)} gleichförmig, also mit konstanter Geschwindigkeit, über Schnee gezogen. Wie groß ist die Reibungskraft?`,
            given: [`Zugkraft ${fmtUnit(F, "N", 0)}`, "konstante Geschwindigkeit"],
            formulaHint: "Gleichförmig bedeutet Kräftegleichgewicht: F_R = F_Zug",
            answer: F,
            unit: "N",
            digits: 0,
            solutionHtml: `Konstante Geschwindigkeit heißt: Die Kräfte sind im Gleichgewicht. F<sub>R</sub> = F<sub>Zug</sub> = <strong>${fmtUnit(F, "N", 0)}</strong>`,
          };
        }
        const F1 = rng.int(4, 12) * 5;
        const F2 = rng.int(3, 10) * 5;
        return {
          prompt: `Zwei Kinder ziehen einen Schlitten, das eine mit ${fmtUnit(F1, "N", 0)}, das andere mit ${fmtUnit(F2, "N", 0)}, beide in Fahrtrichtung. Der Schlitten fährt mit konstanter Geschwindigkeit. Wie groß ist die Reibungskraft?`,
          given: [`F₁ = ${fmtUnit(F1, "N", 0)}`, `F₂ = ${fmtUnit(F2, "N", 0)}`, "konstante Geschwindigkeit"],
          answer: F1 + F2,
          unit: "N",
          digits: 0,
          solutionHtml: `Gleichgewicht: Die Reibungskraft ist so groß wie die Summe der Zugkräfte.<br>F<sub>R</sub> = ${fmt(F1, 0)} N + ${fmt(F2, 0)} N = <strong>${fmtUnit(F1 + F2, "N", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du unterscheidest Haft-, Gleit- und Rollreibung und kennst ihre Bedeutung für Technik und Verkehr.",
};

export const STAGE_MECHANIK: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Mechanik",
  subtitle: "Messen, Bewegung, Kraft, Masse, Dichte und Reibung",
  icon: "⚖️",
  accent: "#2563eb",
  badgeTitle: "Mechanik-Profi",
  lehrplanLabel: "Ph8 LB 1 (II/III)",
  lessons: [messen, geschwindigkeit, kraft, wechselwirkung, hooke, masseGewicht, teilchenmodell, dichte, reibung],
};
