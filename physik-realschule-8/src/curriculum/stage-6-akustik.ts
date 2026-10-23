import { fmt, fmtUnit } from "../exercises/format";
import { V_SOUND_AIR } from "../lab/engine";
import { hearingRange, pitchWord } from "../lab/physics";
import type { Lesson, Stage } from "../model/types";
import { near } from "./helpers";

const STAGE_ID = "stage-6-akustik";

const FREQUENCIES = [10, 50, 100, 220, 440, 880, 2000, 10_000, 20_000, 25_000];

// 6.1 Schall, Frequenz und Amplitude ───────────────────────────────────────

const schall: Lesson = {
  id: "ak-1-schall",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "6.1 Schall, Frequenz und Amplitude (Wahl: Akustik)",
  subtitle: "Tonhöhe und Lautstärke aus der Schwingung",
  tracks: ["I"],
  lehrplan: "Ph8 LB 4.2 (I, Wahlbereich Akustik): Entstehung von Schall, Frequenz und Amplitude, Zusammenhang mit Tonhöhe und Lautstärke, Hörbereich",
  whyItMatters:
    "Jedes Instrument, jede Stimme und jeder Knall beginnt mit etwas, das schwingt. Mit zwei Größen, Frequenz und Amplitude, lässt sich beschreiben, wie ein Ton klingt.",
  explanationHtml: `
    <p><strong>Schall entsteht durch Schwingungen</strong>: Eine Stimmgabel, eine Gitarrensaite oder die Membran eines Lautsprechers bewegt sich schnell hin und her um ihre Ruhelage.</p>
    <ul>
      <li>Die <strong>Frequenz f</strong> ist die Zahl der Schwingungen pro Sekunde. Einheit: <strong>Hertz (Hz)</strong>, 1 Hz = 1/s. Hohe Frequenz bedeutet <strong>hohen Ton</strong>, niedrige einen tiefen. Die <strong>Periodendauer</strong> ist T = 1 / f.</li>
      <li>Die <strong>Amplitude</strong> ist die größte Auslenkung aus der Ruhelage. Große Amplitude bedeutet <strong>laut</strong>, kleine leise.</li>
      <li>Der <strong>Hörbereich</strong> des Menschen reicht von etwa 16 Hz bis 20 000 Hz. Darunter spricht man von <strong>Infraschall</strong>, darüber von <strong>Ultraschall</strong>. Viele Tiere hören mehr (Hunde bis etwa 40 kHz, Fledermäuse über 100 kHz).</li>
      <li><strong>Ton</strong> (eine einzige, gleichmäßige Schwingung, Stimmgabel), <strong>Klang</strong> (mehrere Töne gemeinsam, Instrumente), <strong>Geräusch</strong> (unregelmäßig), <strong>Knall</strong> (kurz und heftig).</li>
      <li>Das eingestrichene a (Kammerton) hat <strong>440 Hz</strong>. Eine <strong>Oktave</strong> höher hat die <strong>doppelte Frequenz</strong> (880 Hz).</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Frequenz bestimmt die Tonhöhe, Amplitude die Lautstärke.</div>
  `,
  formulas: [
    { name: "Frequenz", html: "f = n / t", quantities: "n Schwingungen in der Zeit t; f in Hz = 1/s" },
    { name: "Periodendauer", html: "T = 1 / f", quantities: "T in s, f in Hz" },
    { name: "Oktave", html: "f<sub>2</sub> = 2 · f<sub>1</sub>", quantities: "eine Oktave höher: doppelte Frequenz" },
  ],
  quiz: {
    question: "Ein Ton wird eine Oktave höher gespielt. Was ändert sich?",
    options: [
      "Die Frequenz verdoppelt sich",
      "Die Amplitude verdoppelt sich",
      "Die Schallgeschwindigkeit verdoppelt sich",
    ],
    correctIndex: 0,
    explanation: "Eine Oktave ist ein Frequenzverhältnis 2 : 1. Lautstärke und Schallgeschwindigkeit hängen davon nicht ab.",
  },
  lab: {
    kind: "sound-wave",
    title: "Labor: Schwingungsbild eines Tons",
    intro: "Wähle Frequenz und Amplitude. Das Bild zeigt drei Schwingungen: Je höher die Frequenz, desto kürzer ist eine Periode.",
    params: [
      { type: "choice", key: "f", label: "Frequenz", options: FREQUENCIES.map((f) => ({ value: f, label: `${fmt(f, 0)} Hz` })), value: 220 },
      { type: "range", key: "A", label: "Amplitude (relativ)", unit: "", min: 1, max: 10, step: 1, value: 5 },
    ],
    readouts: [
      { key: "T", label: "Periodendauer T = 1 / f", unit: "ms", digits: 3, emphasis: true, compute: (v) => 1000 / v.f },
      { key: "range", label: "Hörbarkeit", emphasis: true, compute: (v) => hearingRange(v.f) },
      { key: "pitch", label: "Tonhöhe", compute: (v) => pitchWord(v.f) },
      { key: "loud", label: "Lautstärke", compute: (v) => (v.A <= 3 ? "leise" : v.A <= 7 ? "mittellaut" : "laut") },
    ],
    goals: [
      { id: "kammerton", text: "Stelle den Kammerton a' mit 440 Hz ein.", check: (v) => v.f === 440 },
      { id: "ultraschall", text: "Stelle eine Frequenz ein, die kein Mensch hören kann, zum Beispiel Ultraschall bei 25 000 Hz.", check: (_v, r) => String(r.range).startsWith("Ultraschall") },
      { id: "laut", text: "Mache einen hörbaren Ton richtig laut (Amplitude mindestens 9).", check: (v, r) => v.A >= 9 && r.range === "hörbar" },
    ],
  },
  exercises: [
    {
      id: "frequenz",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.pick([200, 440, 1000, 1760, 3000]);
          const t = rng.pick([1, 2, 5, 10]);
          return {
            prompt: `Eine Stimmgabel schwingt in ${fmtUnit(t, "s", 0)} genau ${fmtUnit(n * t, "", 0).trim()}-mal. Wie groß ist ihre Frequenz?`,
            given: [`n = ${fmt(n * t, 0)} Schwingungen`, `t = ${fmtUnit(t, "s", 0)}`],
            formulaHint: "f = n / t",
            answer: n,
            unit: "Hz",
            digits: 0,
            solutionHtml: `f = n / t = ${fmt(n * t, 0)} / ${fmt(t, 0)} s = <strong>${fmtUnit(n, "Hz", 0)}</strong>`,
          };
        }
        const T = rng.pick([0.5, 1, 2, 2.5, 4]);
        return {
          prompt: `Auf einem Oszilloskop dauert eine Schwingung eines Tons ${fmtUnit(T, "ms", 1)}. Welche Frequenz hat der Ton in Hertz? Liegt er im Hörbereich?`,
          given: [`T = ${fmtUnit(T, "ms", 1)} = ${fmt(T / 1000, 4)} s`],
          answer: 1000 / T,
          unit: "Hz",
          digits: 0,
          solutionHtml: `f = 1 / T = 1 / ${fmt(T / 1000, 4)} s = <strong>${fmtUnit(1000 / T, "Hz", 0)}</strong>. Das liegt im Hörbereich (16 Hz bis 20 000 Hz).`,
        };
      },
    },
    {
      id: "oktave",
      make: (rng, level) => {
        if (level === 1) {
          const f = rng.pick([110, 220, 440, 523]);
          const up = rng.int(0, 1) === 0;
          return {
            prompt: `Ein Ton hat die Frequenz ${fmtUnit(f, "Hz", 0)}. Welche Frequenz hat der Ton eine Oktave ${up ? "höher" : "tiefer"}?`,
            given: [`f = ${fmtUnit(f, "Hz", 0)}`],
            formulaHint: up ? "eine Oktave höher: f · 2" : "eine Oktave tiefer: f / 2",
            answer: up ? f * 2 : f / 2,
            unit: "Hz",
            digits: 1,
            solutionHtml: `${up ? `${fmt(f, 0)} Hz · 2` : `${fmt(f, 0)} Hz / 2`} = <strong>${fmtUnit(up ? f * 2 : f / 2, "Hz", 1)}</strong>`,
          };
        }
        const k = rng.int(2, 5);
        const f1 = rng.pick([55, 110, 220]);
        return {
          prompt: `Ein Basston hat ${fmtUnit(f1, "Hz", 0)}. Ein Piccolo spielt denselben Ton ${k} Oktaven höher. Welche Frequenz hat er?`,
          given: [`f = ${fmtUnit(f1, "Hz", 0)}`, `${k} Oktaven höher`],
          answer: f1 * 2 ** k,
          unit: "Hz",
          digits: 0,
          solutionHtml: `Jede Oktave verdoppelt: ${fmt(f1, 0)} Hz · 2<sup>${k}</sup> = ${fmt(f1, 0)} Hz · ${2 ** k} = <strong>${fmtUnit(f1 * 2 ** k, "Hz", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  optional: true,
  celebrationMessage: "Du ordnest Frequenz der Tonhöhe und Amplitude der Lautstärke zu und kennst den Hörbereich.",
};

// 6.2 Schallausbreitung, Hören und Lärm ────────────────────────────────────

const ausbreitung: Lesson = {
  id: "ak-2-ausbreitung",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "6.2 Schallausbreitung, Hören und Lärm (Wahl: Akustik)",
  subtitle: "Wie schnell Schall ist und warum Lärm krank machen kann",
  tracks: ["I"],
  lehrplan: "Ph8 LB 4.2 (I, Wahlbereich Akustik): Modell der Schallausbreitung, Sender-Empfänger-Modell, Schallgeschwindigkeiten; Empfang von Schall; Anwendungen; Lärm",
  whyItMatters:
    "Beim Gewitter kannst du die Entfernung zum Blitz abschätzen, Fledermäuse und Schiffe orten mit Echo, und dauerhafter Lärm schädigt das Gehör. Alles folgt aus der Ausbreitung von Schall.",
  explanationHtml: `
    <p>Schall braucht einen <strong>Stoff</strong> (Luft, Wasser, Festkörper), um sich auszubreiten. Im <strong>Vakuum</strong> gibt es keinen Schall. <strong>Modell:</strong> Der Sender (zum Beispiel die Membran) stößt die Teilchen an, diese stoßen ihre Nachbarn an. Es entsteht eine Folge von Verdichtungen und Verdünnungen, die sich ausbreitet. Die Teilchen schwingen dabei nur um ihre Ruhelage, <strong>Energie</strong> wird transportiert, <strong>Stoff</strong> nicht. Das Ohr (der Empfänger) nimmt diese Druckschwankungen auf.</p>
    <ul>
      <li><strong>Schallgeschwindigkeit:</strong> in Luft (20 °C) etwa <strong>343 m/s</strong> (1235 km/h), in Wasser etwa 1480 m/s, in Stahl etwa 5100 m/s. In Luft wächst sie mit der Temperatur.</li>
      <li><strong>Weg:</strong> s = v · t. <strong>Gewitter:</strong> Der Donner kommt nach etwa 3 s pro Kilometer. <strong>Echo:</strong> Der Schall läuft hin und zurück, deshalb ist die Entfernung s = v · t / 2.</li>
      <li><strong>Anwendungen:</strong> Echolot und Sonar, Ultraschall-Bildgebung in der Medizin, Ortung der Fledermäuse, Kommunikation der Wale, Doppler-Effekt (Sirene klingt beim Vorbeifahren erst höher, dann tiefer).</li>
      <li><strong>Lärm:</strong> Die Lautstärke misst man in Dezibel (dB): Flüstern 30 dB, Gespräch 60 dB, Straßenverkehr 80 dB, Rockkonzert 110 dB. Ab etwa 85 dB über längere Zeit droht Hörschaden. Ruhe dient der Erholung. Du kannst selbst Lärm vermeiden: Kopfhörer nicht zu laut, Musik rücksichtsvoll.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Schall braucht Stoff, im Vakuum herrscht Stille. Beim Echo hin und zurück: s = v · t / 2.</div>
  `,
  formulas: [
    { name: "Schallweg", html: "s = v · t", quantities: "Luft: v ≈ 343 m/s, Wasser ≈ 1480 m/s, Stahl ≈ 5100 m/s" },
    { name: "Echo", html: "s = v · t / 2", quantities: "t Laufzeit hin und zurück" },
    { name: "Gewitter", html: "s ≈ 340 m · t / 1 s", quantities: "etwa 1 km je 3 s" },
  ],
  quiz: {
    question: "Warum ist im Weltraum ein Knall nicht zu hören?",
    options: [
      "Dort ist es zu kalt für Schall",
      "Schall braucht einen Stoff zur Ausbreitung, im Vakuum gibt es keinen",
      "Das Ohr funktioniert im Weltraum nicht",
    ],
    correctIndex: 1,
    explanation: "Ohne Teilchen, die sich gegenseitig anstoßen, kann keine Schallwelle laufen.",
  },
  lab: {
    kind: "sound-speed",
    title: "Labor: Schall unterwegs",
    intro: "Ein Knall breitet sich in Luft, Wasser oder Stahl aus. Wähle Stoff und Entfernung und lies ab, wann er ankommt.",
    params: [
      { type: "choice", key: "v", label: "Stoff", options: [{ value: 343, label: "Luft, 343 m/s" }, { value: 1480, label: "Wasser, 1480 m/s" }, { value: 5100, label: "Stahl, 5100 m/s" }], value: 343 },
      { type: "range", key: "s", label: "Entfernung s", unit: "m", min: 100, max: 5000, step: 100, value: 500 },
    ],
    readouts: [
      { key: "t", label: "Laufzeit t = s / v", unit: "s", digits: 2, emphasis: true, compute: (v) => v.s / v.v },
      { key: "echo", label: "Echo (hin und zurück)", unit: "s", digits: 2, compute: (v) => (2 * v.s) / v.v },
    ],
    goals: [
      { id: "gewitter", text: "Ein Blitz schlägt 1000 m entfernt ein: Der Donner braucht in Luft fast 3 s.", check: (v) => v.v === 343 && v.s === 1000 },
      { id: "wasser-sekunde", text: "Im Wasser braucht der Schall für 1500 m etwa 1 s.", check: (v, r) => v.v === 1480 && near(Number(r.t), 1, 0.03) },
      { id: "stahl-schnell", text: "Durch 5000 m Stahl läuft der Schall in etwa 1 s.", check: (v, r) => v.v === 5100 && v.s === 5000 && near(Number(r.t), 1, 0.03) },
    ],
  },
  exercises: [
    {
      id: "gewitter",
      make: (rng, level) => {
        if (level === 1) {
          const t = rng.pick([2, 3, 4, 5, 6, 8]);
          return {
            prompt: `Zwischen Blitz und Donner vergehen ${fmtUnit(t, "s", 0)}. Wie weit ist das Gewitter entfernt? (Schallgeschwindigkeit 343 m/s, das Licht kommt praktisch sofort an.)`,
            given: [`t = ${fmtUnit(t, "s", 0)}`, "v = 343 m/s"],
            formulaHint: "s = v · t",
            answer: V_SOUND_AIR * t,
            unit: "m",
            digits: 0,
            solutionHtml: `s = v · t = 343 m/s · ${fmt(t, 0)} s = <strong>${fmtUnit(V_SOUND_AIR * t, "m", 0)}</strong>`,
          };
        }
        const t = rng.pick([7, 9, 12, 15]);
        const km = (V_SOUND_AIR * t) / 1000;
        return {
          prompt: `Du zählst ${fmtUnit(t, "s", 0)} zwischen Blitz und Donner. Wie viele Kilometer ist das Gewitter entfernt? Gib den genauen Wert mit 343 m/s an.`,
          given: [`t = ${fmtUnit(t, "s", 0)}`, "v = 343 m/s"],
          answer: km,
          unit: "km",
          digits: 2,
          solutionHtml: `s = 343 m/s · ${fmt(t, 0)} s = ${fmt(V_SOUND_AIR * t, 0)} m = <strong>${fmtUnit(km, "km", 2)}</strong> (Faustregel: etwa ein Drittel Kilometer je Sekunde)`,
        };
      },
    },
    {
      id: "echolot",
      make: (rng, level) => {
        if (level === 1) {
          const t = rng.pick([0.2, 0.4, 0.8, 1.2]);
          const s = (1480 * t) / 2;
          return {
            prompt: `Ein Echolot sendet einen Ultraschallpuls zum Meeresgrund. Das Echo kommt nach ${fmtUnit(t, "s", 1)} zurück. Wie tief ist das Wasser? (Schallgeschwindigkeit im Wasser 1480 m/s)`,
            given: [`t = ${fmtUnit(t, "s", 1)}`, "v = 1480 m/s"],
            formulaHint: "s = v · t / 2 (hin und zurück)",
            answer: s,
            unit: "m",
            digits: 0,
            solutionHtml: `Der Schall läuft hin und zurück: s = v · t / 2 = 1480 m/s · ${fmt(t, 1)} s / 2 = <strong>${fmtUnit(s, "m", 0)}</strong>`,
          };
        }
        const t = rng.pick([0.01, 0.02, 0.03, 0.05]);
        const s = (V_SOUND_AIR * t) / 2;
        return {
          prompt: `Eine Fledermaus sendet einen Ultraschallruf aus und hört das Echo von einem Insekt nach ${fmtUnit(t * 1000, "ms", 0)}. Wie weit ist das Insekt entfernt (in Zentimetern, Schallgeschwindigkeit 343 m/s)?`,
          given: [`t = ${fmtUnit(t * 1000, "ms", 0)} = ${fmt(t, 3)} s`, "v = 343 m/s"],
          answer: s * 100,
          unit: "cm",
          digits: 0,
          solutionHtml: `s = v · t / 2 = 343 m/s · ${fmt(t, 3)} s / 2 = ${fmt(s, 3)} m = <strong>${fmtUnit(s * 100, "cm", 0)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  optional: true,
  celebrationMessage: "Du nutzt Schalllaufzeiten für Gewitter und Echolot und erklärst, warum es im Vakuum still ist.",
};

export const STAGE_AKUSTIK: Stage = {
  id: STAGE_ID,
  stageNumber: 6,
  title: "Wahlbereich Akustik",
  subtitle: "Schall, Frequenz, Schallgeschwindigkeit und Lärm",
  icon: "🔊",
  accent: "#0891b2",
  badgeTitle: "Schall-Experte",
  lehrplanLabel: "Ph8 LB 4.2 (I, Wahlbereich)",
  lessons: [schall, ausbreitung],
};
