import { fmt } from "../exercises/format";
import { caseLab } from "../lab/case-lab";
import { arrow, circle, line, open, path, rect, text } from "../lab/svg";
import type { ExerciseGenerator, LabDefinition, LabValues, Stage } from "../model/types";
import { asciiCode, dualSpellings, LETTERS, MORSE, ones, toDual } from "./codes";
import { cases, cc, choiceField, lesson, numberField, textField, withSlips } from "./helpers";

const id = "informationsaustausch";

// ─── Lab: Kommunikationsmodell ───────────────────────────────────────────

const CODES = ["Morsecode", "ASCII als Bitfolge", "gesprochene Sprache"];
const MESSAGE = "SOS";

function received(v: LabValues): string {
  const sent =
    v.code === 0
      ? [...MESSAGE].map((letter) => MORSE[letter]).join(" ")
      : v.code === 1
        ? [...MESSAGE].map((letter) => toDual(asciiCode(letter), 8)).join(" ")
        : MESSAGE;
  if (v.noise === 0) return sent;
  const chars = [...sent];
  for (let i = 0; i < v.noise; i++) {
    const at = (i * 7 + 3) % chars.length;
    chars[at] = chars[at] === "·" ? "−" : chars[at] === "−" ? "·" : chars[at] === "0" ? "1" : chars[at] === "1" ? "0" : "?";
  }
  return chars.join("");
}

const understood = (v: LabValues) => v.sent === 1 && v.noise === 0 && v.knows === 1;

const kommunikationLab: LabDefinition = {
  kind: "kommunikationsmodell",
  title: "Eine Nachricht übertragen",
  intro:
    "Der Sender codiert die Nachricht „SOS“ und schickt sie über einen Kanal. Wähle Code, Störung und ob der Empfänger den Code kennt, und sende.",
  params: [
    { key: "code", type: "choice", label: "Code", options: CODES.map((label, value) => ({ value, label })), value: 0 },
    { key: "noise", type: "range", label: "gestörte Zeichen im Kanal", unit: "", min: 0, max: 3, step: 1, value: 0 },
    {
      key: "knows",
      type: "choice",
      label: "Empfänger kennt den Code",
      options: [
        { value: 1, label: "ja" },
        { value: 0, label: "nein" },
      ],
      value: 1,
    },
    { key: "sent", type: "state", value: 0, resetOnChange: true },
  ],
  actions: [{ id: "send", label: "📡 Senden", apply: (v) => ({ ...v, sent: 1 }) }],
  readouts: [
    { key: "rx", label: "Empfangene Daten", compute: (v) => (v.sent ? received(v) : "noch nichts gesendet") },
    {
      key: "info",
      label: "Information beim Empfänger",
      emphasis: true,
      compute: (v) =>
        !v.sent
          ? "–"
          : v.knows === 0
            ? "Daten ohne Bedeutung: Der Code fehlt zum Decodieren."
            : v.noise > 0
              ? "verfälscht: Die Störung hat Zeichen verändert."
              : "✓ „SOS“ verstanden: Hilferuf",
    },
  ],
  goals: [
    { id: "ok", text: "Übertrage die Nachricht so, dass der Empfänger sie versteht.", check: (v) => understood(v) },
    { id: "stoerung", text: "Zeige, wie eine Störung im Kanal die Daten verfälscht.", check: (v) => v.sent === 1 && v.noise > 0 && v.knows === 1 },
    {
      id: "ohnecode",
      text: "Zeige: Ungestörte Daten ohne bekannten Code ergeben keine Information.",
      check: (v) => v.sent === 1 && v.noise === 0 && v.knows === 0,
    },
  ],
  witnesses: {
    ok: { code: 0, noise: 0, knows: 1, sent: 1 },
    stoerung: { code: 1, noise: 2, knows: 1, sent: 1 },
    ohnecode: { code: 0, noise: 0, knows: 0, sent: 1 },
  },
  view: {
    render(v) {
      let out = open("Sender, Kanal und Empfänger");
      out += rect(20, 60, 120, 80, "lab-fill-a", 'rx="12"');
      out += text(80, 96, "Sender", "lab-text", "middle");
      out += text(80, 118, "codiert", "lab-text-small", "middle");
      out += rect(380, 60, 120, 80, understood(v) ? "lab-fill-ok" : "lab-fill-c", 'rx="12"');
      out += text(440, 96, "Empfänger", "lab-text", "middle");
      out += text(440, 118, "decodiert", "lab-text-small", "middle");
      out += arrow(146, 100, 374, 100, v.noise > 0 ? "lab-side-b" : "lab-side-a");
      out += text(260, 88, `Kanal (${CODES[v.code]})`, "lab-text-small", "middle");
      if (v.noise > 0) {
        for (let i = 0; i < v.noise; i++) out += text(220 + i * 30, 132, "⚡", "lab-text", "middle");
      }
      out += text(260, 200, v.sent ? received(v) : "Nachricht: SOS", v.code === 1 ? "lab-text-small" : "lab-text-big", "middle");
      out += text(
        260,
        250,
        !v.sent ? "Wähle Code, Störung und Empfänger, dann „Senden“." : understood(v) ? "Information: „SOS“, ein Hilferuf" : v.knows === 0 ? "Empfänger sieht nur Zeichen ohne Bedeutung" : "Empfänger erhält verfälschte Daten",
        understood(v) ? "lab-text-ok" : "lab-text",
        "middle",
      );
      return `${out}</svg>`;
    },
  },
};

// ─── Lab: Dualzahlen ─────────────────────────────────────────────────────

const PLACE = [128, 64, 32, 16, 8, 4, 2, 1];
const dualValue = (v: LabValues) => PLACE.reduce((sum, place, i) => sum + place * v[`b${i}`], 0);

const dualLab: LabDefinition = {
  kind: "bitschalter",
  title: "Acht Bits, ein Byte",
  intro: "Schalte die Bits an (1) oder aus (0). Jede Stelle hat ihren Stellenwert, eine Zweierpotenz.",
  params: PLACE.map((place, i) => ({
    key: `b${i}`,
    type: "choice" as const,
    label: `Stelle ${place} (2${"⁰¹²³⁴⁵⁶⁷"[7 - i]})`,
    options: [
      { value: 0, label: "0" },
      { value: 1, label: "1" },
    ],
    value: 0,
  })),
  readouts: [
    { key: "bits", label: "Dualzahl", compute: (v) => PLACE.map((_, i) => v[`b${i}`]).join("") },
    { key: "dec", label: "Dezimalwert", emphasis: true, compute: dualValue },
    {
      key: "sum",
      label: "Rechnung",
      compute: (v) => PLACE.filter((_, i) => v[`b${i}`] === 1).join(" + ") || "0",
    },
  ],
  goals: [
    { id: "dreizehn", text: "Stelle die Dezimalzahl 13 dar.", check: (v) => dualValue(v) === 13 },
    { id: "hundert", text: "Stelle die Dezimalzahl 100 dar.", check: (v) => dualValue(v) === 100 },
    { id: "max", text: "Stelle die größte Zahl dar, die in ein Byte passt.", check: (v) => dualValue(v) === 255 },
  ],
  view: {
    render(v) {
      let out = open("Acht Bitschalter");
      PLACE.forEach((place, i) => {
        const x = 34 + i * 58;
        const on = v[`b${i}`] === 1;
        out += text(x + 24, 44, String(place), "lab-text-small", "middle");
        out += rect(x, 56, 48, 70, on ? "lab-fill-ok" : "lab-shape", 'rx="8"');
        out += text(x + 24, 102, on ? "1" : "0", "lab-text-big", "middle");
        out += circle(x + 24, 150, 8, on ? "lab-fill-a" : "lab-shape");
      });
      out += text(260, 210, `${PLACE.map((_, i) => v[`b${i}`]).join("")} (dual) = ${dualValue(v)} (dezimal)`, "lab-text-big", "middle");
      out += text(260, 250, `8 Bit = 1 Byte: 256 Werte von 0 bis 255`, "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
};

const dualZuDezimal: ExerciseGenerator = {
  id: "dual-zu-dezimal",
  make(rng, level) {
    const value = level === 1 ? rng.int(5, 15) : rng.int(40, 250);
    const bits = toDual(value);
    const places = [...bits].map((_, i) => 2 ** (bits.length - 1 - i));
    const reversed = Number.parseInt([...bits].reverse().join(""), 2);
    return {
      prompt:
        level === 1
          ? `Rechne die Dualzahl <strong>${bits}</strong> in eine Dezimalzahl um.`
          : `Ein Sensor schickt das Byte <strong>${toDual(value, 8)}</strong>. Welche Dezimalzahl ist das?`,
      given: [level === 1 ? `Dualzahl: ${bits}` : `Byte: ${toDual(value, 8)}`],
      formulaHint: `Stellenwerte von rechts: 1, 2, 4, 8${level === 1 ? "" : ", 16, 32, 64, 128"}. Addiere die Stellenwerte, an denen eine 1 steht.`,
      fields: [withSlips(numberField("Dezimalwert =", value), [reversed, "Die Stelle ganz rechts hat den Wert 1, nicht die ganz links."], [ones(bits), "Du hast nur die Einsen gezählt. Jede 1 zählt ihren Stellenwert."])],
      steps: [
        `Stellenwerte: ${places.join(", ")}`,
        places.filter((_, i) => bits[i] === "1").join(" + "),
        `<strong>${bits} (dual) = ${value} (dezimal)</strong>`,
      ],
    };
  },
};

const dezimalZuDual: ExerciseGenerator = {
  id: "dezimal-zu-dual",
  make(rng, level) {
    const value = level === 1 ? rng.int(5, 15) : rng.int(33, 200);
    const bits = toDual(value);
    const steps: string[] = [];
    let n = value;
    while (n > 0) {
      steps.push(`${n} : 2 = ${Math.floor(n / 2)} Rest ${n % 2}`);
      n = Math.floor(n / 2);
    }
    return {
      prompt:
        level === 1
          ? `Wandle die Dezimalzahl <strong>${value}</strong> in eine Dualzahl um.`
          : `Im Speicher soll die Zahl <strong>${value}</strong> als Dualzahl abgelegt werden. Wie lautet sie? Nutze das Restwertverfahren.`,
      given: [`Dezimalzahl: ${value}`],
      formulaHint: level === 1 ? "Zerlege in 8, 4, 2, 1: Welche Stellenwerte ergeben zusammen die Zahl?" : "Teile immer wieder durch 2 und lies die Reste von unten nach oben.",
      fields: [
        textField("Dualzahl =", dualSpellings(value), "z. B. 1011", [
          [[...bits].reverse().join(""), "Die Reste werden von unten nach oben gelesen."],
          [String(value), "Gesucht ist die Dualzahl aus Nullen und Einsen."],
        ]),
      ],
      steps: [steps.join("; "), "Reste von unten nach oben lesen", `<strong>${value} = ${bits} (dual)</strong>`],
    };
  },
};

// ─── Lab: Codierung ──────────────────────────────────────────────────────

const codeLab: LabDefinition = {
  kind: "ascii-morse",
  title: "ASCII und Morsecode",
  intro: "Wähle einen Buchstaben. Die Codetabelle zeigt seinen ASCII-Wert, das Byte im Speicher und sein Morsezeichen.",
  params: [
    { key: "letter", type: "choice", label: "Buchstabe", options: LETTERS.map((label, value) => ({ value, label })), value: 0 },
  ],
  readouts: [
    { key: "ascii", label: "ASCII (dezimal)", emphasis: true, compute: (v) => asciiCode(LETTERS[v.letter]) },
    { key: "byte", label: "Byte im Speicher", compute: (v) => toDual(asciiCode(LETTERS[v.letter]), 8) },
    { key: "morse", label: "Morsezeichen", compute: (v) => MORSE[LETTERS[v.letter]] },
  ],
  goals: [
    { id: "h", text: "Finde den Buchstaben mit dem ASCII-Code 72.", check: (v) => asciiCode(LETTERS[v.letter]) === 72 },
    { id: "s", text: "Finde den Buchstaben mit dem Morsezeichen ···.", check: (v) => MORSE[LETTERS[v.letter]] === "···" },
    {
      id: "drei",
      text: "Finde einen Buchstaben, dessen Byte genau drei Einsen enthält.",
      check: (v) => ones(toDual(asciiCode(LETTERS[v.letter]), 8)) === 3,
    },
  ],
  view: {
    render(v) {
      const letter = LETTERS[v.letter];
      const byte = toDual(asciiCode(letter), 8);
      let out = open("Codetabelle");
      out += rect(30, 24, 120, 120, "lab-fill-a", 'rx="14"');
      out += text(90, 102, letter, "lab-text-big", "middle");
      out += text(180, 60, `ASCII: ${asciiCode(letter)}`, "lab-text-big");
      out += text(180, 100, `Morse: ${MORSE[letter]}`, "lab-text-big");
      [...byte].forEach((bit, i) => {
        out += rect(40 + i * 56, 180, 48, 56, bit === "1" ? "lab-fill-ok" : "lab-shape", 'rx="6"');
        out += text(64 + i * 56, 214, bit, "lab-text-big", "middle");
      });
      out += text(260, 270, "1 Zeichen = 1 Byte = 8 Bit", "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
};

const asciiTask: ExerciseGenerator = {
  id: "ascii-codieren",
  make(rng, level) {
    const letter = rng.pick(LETTERS.slice(1));
    const code = asciiCode(letter);
    if (level === 1) {
      return {
        prompt: `Im ASCII-Code hat A den Wert 65, die Buchstaben folgen in alphabetischer Reihenfolge. Welchen Code hat <strong>${letter}</strong>?`,
        given: ["A = 65, B = 66, C = 67, …"],
        formulaHint: `Code = 65 + Platz im Alphabet − 1; ${letter} ist der ${code - 64}. Buchstabe.`,
        fields: [withSlips(numberField("ASCII =", code), [code - 64, "Das ist der Platz im Alphabet. Der Code beginnt bei A mit 65."], [code + 1, "A ist 65, also ist B 66: Zähle ab 65."])],
        steps: [`${letter} ist der ${code - 64}. Buchstabe.`, `65 + ${code - 65}`, `<strong>${letter} = ${code}</strong>`],
      };
    }
    const byte = toDual(code, 8);
    return {
      prompt: `Im Speicher steht das Byte <strong>${byte}</strong>. Welcher Großbuchstabe ist nach ASCII gespeichert?`,
      given: [`Byte: ${byte}`, "A = 65"],
      fields: [textField("Buchstabe =", [letter], "z. B. Q", [[String(code), `Das ist der Dezimalwert. Welcher Buchstabe hat den Code ${code}?`]], true)],
      steps: [`${byte} = ${code} (dezimal)`, `${code} − 65 = ${code - 65}: ${code - 64}. Buchstabe`, `<strong>${letter}</strong>`],
    };
  },
};

const datenmenge: ExerciseGenerator = {
  id: "datenmenge-text",
  make(rng, level) {
    if (level === 1) {
      const word = rng.pick(["INFORMATIK", "BYTE", "COMPUTER", "DATEN", "SPEICHER", "TASTATUR"]);
      const bits = word.length * 8;
      return {
        prompt: `Wie viele Bit braucht das Wort <strong>${word}</strong> im ASCII-Code, wenn jedes Zeichen ein Byte belegt?`,
        given: [`${word}: ${word.length} Zeichen`],
        formulaHint: "1 Zeichen = 1 Byte = 8 Bit",
        fields: [withSlips(numberField("Datenmenge =", bits, "Bit"), [word.length, "Das sind Byte. Ein Byte hat 8 Bit."])],
        steps: [`${word.length} Zeichen = ${word.length} Byte`, `${word.length} · 8 Bit`, `<strong>${bits} Bit</strong>`],
      };
    }
    const chars = rng.pick([1500, 2400, 3200, 4500, 12000]);
    const kb = chars / 1000;
    return {
      prompt: `Ein Text hat ${fmt(chars, 0)} Zeichen, jedes Zeichen belegt ein Byte. Wie groß ist die Datei in Kilobyte (1 kB = 1 000 Byte)?`,
      given: [`${fmt(chars, 0)} Zeichen`, "1 kB = 1 000 Byte"],
      fields: [withSlips(numberField("Datenmenge =", kb, "kB", 2), [chars * 8, "Das wären Bit. Gefragt sind Kilobyte."], [(chars * 8) / 1000, "Ein Zeichen ist 1 Byte; du musst nicht mit 8 multiplizieren."])],
      steps: [`${fmt(chars, 0)} Zeichen = ${fmt(chars, 0)} Byte`, `${fmt(chars, 0)} Byte ÷ 1 000`, `<strong>${fmt(kb, 2)} kB</strong>`],
    };
  },
};

// ─── Lab: Digitalisierung ────────────────────────────────────────────────

/** Sample-and-hold of one sine period with `rate` samples, quantised to 2^bits levels in [−1; 1]. */
export function digitize(rate: number, bits: number): { samples: number[]; maxError: number } {
  const levels = 2 ** bits;
  const quantize = (y: number) => {
    const step = 2 / (levels - 1);
    return Math.round((y + 1) / step) * step - 1;
  };
  const samples = Array.from({ length: rate }, (_, i) => quantize(Math.sin((2 * Math.PI * i) / rate)));
  let maxError = 0;
  for (let k = 0; k <= 400; k++) {
    const t = k / 400;
    const held = samples[Math.min(rate - 1, Math.floor(t * rate))];
    maxError = Math.max(maxError, Math.abs(Math.sin(2 * Math.PI * t) - held));
  }
  return { samples, maxError };
}

const digitalLab: LabDefinition = {
  kind: "digitalisierung",
  title: "Ein analoges Signal digitalisieren",
  intro:
    "Die Kurve ist ein analoges Signal, zum Beispiel ein Ton. Beim Digitalisieren wird es in festen Abständen abgetastet und jeder Wert auf eine von 2^n Stufen gerundet.",
  params: [
    { key: "rate", type: "range", label: "Abtastungen pro Schwingung", unit: "", min: 2, max: 32, step: 2, value: 8 },
    { key: "bits", type: "range", label: "Bits pro Messwert", unit: "Bit", min: 1, max: 5, step: 1, value: 2 },
  ],
  readouts: [
    { key: "levels", label: "Stufen", compute: (v) => 2 ** v.bits },
    { key: "err", label: "größte Abweichung", digits: 2, emphasis: true, compute: (v) => digitize(v.rate, v.bits).maxError },
    { key: "data", label: "Daten je Schwingung", unit: "Bit", digits: 0, compute: (v) => v.rate * v.bits },
  ],
  goals: [
    { id: "acht", text: "Stelle genau 8 Stufen ein.", check: (v) => v.bits === 3 },
    { id: "genau", text: "Digitalisiere so fein, dass die größte Abweichung höchstens 0,3 beträgt.", check: (v) => digitize(v.rate, v.bits).maxError <= 0.3 },
    { id: "grob", text: "Zeige ein zu grobes Signal: nur 2 Stufen und höchstens 4 Abtastungen.", check: (v) => v.bits === 1 && v.rate <= 4 },
  ],
  view: {
    render(v) {
      const { samples } = digitize(v.rate, v.bits);
      const x = (t: number) => 40 + t * 440;
      const y = (s: number) => 170 - s * 120;
      let out = open("Analoges und digitales Signal");
      out += line(40, 170, 480, 170, "lab-axis");
      let d = "";
      for (let k = 0; k <= 200; k++) {
        const t = k / 200;
        d += `${k === 0 ? "M" : "L"}${x(t).toFixed(1)} ${y(Math.sin(2 * Math.PI * t)).toFixed(1)} `;
      }
      out += path(d.trim(), "lab-curve");
      let step = "";
      samples.forEach((s, i) => {
        const t0 = i / v.rate;
        const t1 = (i + 1) / v.rate;
        step += `${i === 0 ? "M" : "L"}${x(t0).toFixed(1)} ${y(s).toFixed(1)} L${x(t1).toFixed(1)} ${y(s).toFixed(1)} `;
        out += circle(x(t0), y(s), 4, "lab-fill-b");
      });
      out += path(step.trim(), "lab-side-b");
      out += text(260, 316, `${v.rate} Abtastungen · ${2 ** v.bits} Stufen (${v.bits} Bit)`, "lab-text", "middle");
      return `${out}</svg>`;
    },
  },
};

const stufenTask: ExerciseGenerator = {
  id: "stufen-bits",
  make(rng, level) {
    if (level === 1) {
      const bits = rng.int(2, 8);
      return {
        prompt: `Ein Messwert wird mit ${bits} Bit gespeichert. Wie viele verschiedene Stufen kann er annehmen?`,
        given: [`${bits} Bit`],
        formulaHint: "Mit n Bit gibt es 2^n verschiedene Werte.",
        fields: [withSlips(numberField("Stufen =", 2 ** bits), [2 * bits, "Nicht 2 · n, sondern 2 hoch n."], [2 ** bits - 1, "Gefragt ist die Anzahl der Werte (0 mitgezählt), nicht der größte Wert."])],
        steps: [`2^${bits}`, Array.from({ length: bits }, () => "2").join(" · "), `<strong>${2 ** bits} Stufen</strong>`],
      };
    }
    const needed = rng.pick([5, 10, 20, 50, 100, 200, 1000]);
    const bits = Math.ceil(Math.log2(needed));
    return {
      prompt: `Ein Thermometer soll mindestens ${needed} verschiedene Temperaturwerte unterscheiden. Wie viele Bit braucht jeder Messwert mindestens?`,
      given: [`mindestens ${needed} Werte`],
      fields: [withSlips(numberField("mindestens", bits, "Bit"), [bits - 1, `Mit ${bits - 1} Bit gibt es nur ${2 ** (bits - 1)} Werte.`])],
      steps: [`2^${bits - 1} = ${2 ** (bits - 1)} reicht nicht`, `2^${bits} = ${2 ** bits} ≥ ${needed}`, `<strong>${bits} Bit</strong>`],
    };
  },
};

const audioTask: ExerciseGenerator = {
  id: "audio-datenmenge",
  make(rng, level) {
    if (level === 1) {
      const rate = rng.pick([8000, 16000]);
      const seconds = rng.pick([2, 5, 10]);
      const bytes = rate * seconds;
      return {
        prompt: `Ein Sprachrekorder tastet ${fmt(rate, 0)}-mal pro Sekunde ab und speichert jeden Messwert mit 8 Bit = 1 Byte. Wie viele Byte entstehen in ${seconds} Sekunden?`,
        given: [`${fmt(rate, 0)} Abtastungen pro Sekunde`, "1 Byte je Abtastung", `${seconds} s`],
        formulaHint: "Datenmenge = Abtastungen pro Sekunde · Byte je Abtastung · Sekunden",
        fields: [withSlips(numberField("Datenmenge =", bytes, "Byte"), [bytes * 8, "Das sind Bit. Jede Abtastung ist 1 Byte."])],
        steps: [`${fmt(rate, 0)} · 1 Byte · ${seconds}`, `= ${fmt(bytes, 0)}`, `<strong>${fmt(bytes, 0)} Byte</strong>`],
      };
    }
    const seconds = rng.pick([10, 30, 60]);
    const bytes = 44100 * 2 * 2 * seconds;
    const mb = bytes / 1_000_000;
    return {
      prompt: `Musik in CD-Qualität wird 44 100-mal pro Sekunde abgetastet, je Messwert mit 16 Bit (2 Byte), und in Stereo (2 Kanäle) gespeichert. Wie viele Megabyte (1 MB = 1 000 000 Byte) belegen ${seconds} Sekunden unkomprimiert?`,
      given: ["44 100 Abtastungen/s", "2 Byte je Messwert", "2 Kanäle", `${seconds} s`],
      fields: [withSlips(numberField("Datenmenge =", mb, "MB", 2), [mb / 2, "Stereo hat zwei Kanäle."], [mb * 8, "16 Bit sind 2 Byte; rechne in Byte, nicht in Bit."])],
      steps: [`44 100 · 2 Byte · 2 · ${seconds} s`, `= ${fmt(bytes, 0)} Byte`, `<strong>≈ ${fmt(mb, 2)} MB</strong>`],
    };
  },
};

export const STAGE_INFORMATIONSAUSTAUSCH: Stage = {
  id,
  stageNumber: 4,
  title: "Informationsaustausch",
  subtitle: "Kommunikation, Dualzahlen, Codes, Digitalisierung, Sicherheit und Datenschutz",
  icon: "📡",
  accent: "#0d9488",
  badgeTitle: "Codeknackerin",
  lehrplanLabel: "IT 1.4 · ca. 14 Std.",
  module: "1.4",
  lessons: [
    lesson(id, "1.4", 1, {
      id: "it8-kommunikationsmodell",
      title: "Kommunikationsmodell: Sender, Kanal, Empfänger",
      subtitle: "Codieren, übertragen, decodieren und aus Daten Information gewinnen",
      why: "Ob Chatnachricht, Funkspruch oder Klick auf einen Button: Jede Kommunikation folgt demselben Grundmodell. Wer es kennt, findet heraus, warum eine Nachricht nicht ankommt.",
      html: `<p>Im <strong>Kommunikationsmodell</strong> will ein <strong>Sender</strong> einem <strong>Empfänger</strong> eine Nachricht übermitteln. Dazu <strong>codiert</strong> er sie: Er stellt sie nach einer festen Vorschrift (einem <strong>Code</strong>) als Zeichen oder Signale dar, z. B. als Morsezeichen, Bitfolge oder Sprache. Die Signale laufen über einen <strong>Kanal</strong> (Funk, Kabel, Luft). Der Empfänger <strong>decodiert</strong> sie mit demselben Code.</p>
<p>Was übertragen wird, sind <strong>Daten</strong>: Zeichen nach festen Regeln. <strong>Information</strong> entsteht erst, wenn der Empfänger die Daten in einem Zusammenhang deutet. Ohne den passenden Code bleiben die Daten bedeutungslos. <strong>Störungen</strong> im Kanal (Rauschen, Funklöcher) können Zeichen verfälschen. Auch die Kommunikation zwischen Mensch und Maschine folgt dem Modell: Ein Tastendruck wird als Code an den Computer gesendet.</p>
<div class="example"><strong>Beispiel:</strong> Ein Schiff funkt „··· −−− ···“. Wer den Morsecode kennt, decodiert „SOS“ und versteht den Hilferuf. Für jemanden ohne Code sind es nur kurze und lange Töne: Daten ohne Information.</div>
<div class="merke"><strong>Merke:</strong> Sender codiert → Kanal überträgt → Empfänger decodiert. Information = Daten + Deutung im Zusammenhang; dafür müssen beide denselben Code kennen.</div>`,
      rule: "Sender → (codieren) → Kanal → (decodieren) → Empfänger; Information = Daten + Interpretation",
      terms: [
        ["Code · Codierung", "feste Vorschrift, wie Zeichen dargestellt werden · das Umwandeln danach", "z. B. Morsecode, ASCII"],
        ["Daten · Information", "Zeichen nach Regeln · ihre Bedeutung im Zusammenhang", "Daten ohne bekannten Code tragen für den Empfänger keine Information"],
      ],
      quiz: [
        "Was unterscheidet Information von Daten?",
        "Information entsteht erst, wenn Daten in einem Zusammenhang gedeutet werden.",
        "Information und Daten sind dasselbe.",
        "Daten sind immer Zahlen, Information immer Text.",
        "Die Zeichenfolge 0815 kann Uhrzeit, Postleitzahlteil oder Artikelnummer sein; erst der Zusammenhang macht daraus Information.",
      ],
      lab: kommunikationLab,
      exercises: [
        cases(
          "modell-anwenden",
          [
            cc("Du schreibst deiner Freundin eine Chatnachricht. Was ist im Modell der Kanal?", "Das Internet bzw. die Funkverbindung", ["Deine Freundin", "Die Tastatur deines Handys"], "Über den Kanal laufen die Signale vom Sender zum Empfänger.", "Wo läuft die Nachricht entlang?"),
            cc("Ein Computer erhält beim Tastendruck A den Code 65. Wer ist hier der Empfänger?", "Der Computer", ["Die Taste A", "Die Person, die tippt"], "Mensch–Maschine-Kommunikation: Die Person sendet, der Computer empfängt und decodiert.", "Wer erhält den Code?"),
            cc("Was tut der Empfänger im Kommunikationsmodell?", "Er decodiert die Signale mit dem vereinbarten Code.", ["Er codiert die Nachricht neu.", "Er verstärkt die Störung."], "Codieren beim Sender, Decodieren beim Empfänger.", "Gegenteil von codieren."),
          ],
          [
            cc(
              "Eine Sprachnachricht kommt nur abgehackt an, weil der Zug durch einen Tunnel fährt. Wo liegt das Problem im Modell?",
              "Im Kanal: Eine Störung verfälscht die Signale.",
              ["Beim Code: Deutsch ist ungeeignet.", "Beim Empfänger: Er kennt die Sprache nicht."],
              "Der Tunnel unterbricht die Funkverbindung, also den Kanal.",
              "Was ändert sich im Tunnel?",
            ),
            cc(
              "Ein Tourist bekommt eine Nachricht auf Japanisch und versteht nichts, obwohl jedes Zeichen richtig ankommt. Was fehlt?",
              "Der gemeinsame Code: Er kann die Zeichen nicht decodieren.",
              ["Ein besserer Kanal.", "Ein lauterer Sender."],
              "Die Daten sind fehlerfrei; ohne Code entsteht keine Information.",
              "Kommen die Zeichen richtig an?",
            ),
            cc(
              "Die Zeichenfolge „1200“ steht auf einem Zettel. Wann wird daraus Information?",
              "Wenn der Zusammenhang klar ist, z. B. „Abfahrt um 12:00 Uhr“.",
              ["Sobald man sie laut vorliest.", "Wenn man sie ins Dualsystem umrechnet."],
              "Daten bekommen ihre Bedeutung erst durch den Zusammenhang.",
              "Was bedeuten die Ziffern ohne Zusammenhang?",
            ),
          ],
        ),
        {
          id: "morse-decodieren",
          make(rng, level) {
            if (level === 1) {
              const letter = rng.pick(["E", "T", "A", "N", "I", "M", "S", "O"]);
              const others = ["E", "T", "A", "N", "I", "M", "S", "O"].filter((l) => l !== letter);
              return {
                prompt: `Welchen Buchstaben bedeutet das Morsezeichen <strong>${MORSE[letter]}</strong>?`,
                given: ["E = ·  T = −  A = ·−  N = −·  I = ··  M = −−  S = ···  O = −−−"],
                formulaHint: "Vergleiche Punkt für Punkt mit der Tabelle.",
                fields: [choiceField(rng, "Buchstabe", letter, rng.shuffle(others).slice(0, 2))],
                steps: ["Zähle kurze (·) und lange (−) Zeichen.", `${MORSE[letter]} steht in der Tabelle bei ${letter}.`, `<strong>${letter}</strong>`],
              };
            }
            const words = ["SOS", "OMA", "TEE", "MAI", "NASE", "TOR"];
            const word = rng.pick(words);
            return {
              prompt: `Decodiere den Funkspruch <strong>${[...word].map((l) => MORSE[l]).join(" / ")}</strong> mit der Morsetabelle.`,
              given: ["A = ·−  E = ·  I = ··  M = −−  N = −·  O = −−−  R = ·−·  S = ···  T = −"],
              fields: [textField("Wort =", [word], "z. B. OMA", [[[...word].reverse().join(""), "Lies die Zeichen in der gesendeten Reihenfolge von links nach rechts."]])],
              steps: [[...word].map((l) => `${MORSE[l]} = ${l}`).join(", "), "Buchstaben der Reihe nach zusammensetzen", `<strong>${word}</strong>`],
            };
          },
        },
      ],
    }),
    lesson(id, "1.4", 2, {
      id: "it8-dualsystem",
      title: "Dezimalsystem und Dualsystem",
      subtitle: "Stellenwertsysteme, Bit und Byte, Umrechnen in beide Richtungen",
      why: "Computer speichern alles mit zwei Zuständen: Strom an oder aus, 1 oder 0. Mit dem Dualsystem verstehst du, wie daraus Zahlen werden.",
      html: `<p>Im <strong>Dezimalsystem</strong> gibt es zehn Ziffern (0–9); jede Stelle ist zehnmal so viel wert wie die rechts daneben: Einer, Zehner, Hunderter. Das <strong>Dualsystem</strong> (Binärsystem) hat nur die Ziffern <strong>0 und 1</strong>; jede Stelle ist doppelt so viel wert: <strong>1, 2, 4, 8, 16, 32, 64, 128</strong> (Zweierpotenzen). Beides sind <strong>Stellenwertsysteme</strong>: Der Wert einer Ziffer hängt von ihrer Stelle ab.</p>
<p>Eine Dualstelle heißt <strong>Bit</strong>, die kleinste Dateneinheit. <strong>8 Bit = 1 Byte</strong>; ein Byte kann 2⁸ = <strong>256</strong> verschiedene Werte von 0 bis 255 darstellen. <strong>Dual → dezimal:</strong> Stellenwerte addieren, an denen eine 1 steht. <strong>Dezimal → dual:</strong> immer wieder durch 2 teilen und die Reste von unten nach oben lesen (Restwertverfahren), oder die Zahl in Zweierpotenzen zerlegen.</p>
<div class="example"><strong>Beispiel:</strong> 1011 (dual) = 1 · 8 + 0 · 4 + 1 · 2 + 1 · 1 = 11 (dezimal). Umgekehrt: 13 : 2 = 6 Rest 1; 6 : 2 = 3 Rest 0; 3 : 2 = 1 Rest 1; 1 : 2 = 0 Rest 1. Von unten gelesen: 1101.</div>
<div class="merke"><strong>Merke:</strong> Stellenwerte im Dualsystem von rechts: 1, 2, 4, 8, 16, 32, 64, 128. 8 Bit = 1 Byte = 256 Werte (0 bis 255).</div>`,
      rule: "Dual → dezimal: Stellenwerte der Einsen addieren; dezimal → dual: Restwertverfahren, Reste von unten nach oben",
      terms: [
        ["Stellenwerte dual", "2⁷ 2⁶ 2⁵ 2⁴ 2³ 2² 2¹ 2⁰ = 128 64 32 16 8 4 2 1", "von links nach rechts"],
        ["Bit · Byte", "eine Dualstelle · 8 Bit", "1 Byte: 2⁸ = 256 Werte"],
      ],
      quiz: [
        "Welchen Dezimalwert hat die Dualzahl 1011?",
        "11",
        "13",
        "1011",
        "1011 = 8 + 0 + 2 + 1 = 11. Die 13 entsteht, wenn man die Stellen von der falschen Seite liest (1101).",
      ],
      lab: dualLab,
      exercises: [dualZuDezimal, dezimalZuDual],
    }),
    lesson(id, "1.4", 3, {
      id: "it8-codierung",
      title: "Codierungsvorschriften: ASCII und Morsecode",
      subtitle: "Zeichen als Zahlen und Bitmuster, Datenmengen in Bit, Byte und Kilobyte",
      why: "Wenn du eine Taste drückst, speichert der Computer keinen Buchstaben, sondern eine Zahl. Codes legen fest, welche Zahl für welches Zeichen steht.",
      html: `<p>Eine <strong>Codierungsvorschrift</strong> ordnet jedem Zeichen eindeutig ein Codewort zu. Der <strong>Morsecode</strong> verwendet kurze (·) und lange (−) Signale: E = ·, T = −, S = ···, O = −−−. Häufige Buchstaben haben kurze Codewörter. Der <strong>ASCII-Code</strong> ordnet jedem Zeichen eine Zahl zu: <strong>A = 65</strong>, B = 66, …, Z = 90, a = 97, Ziffer 0 = 48, Leerzeichen = 32. Der ursprüngliche ASCII-Code hat 128 Zeichen und keine Umlaute.</p>
<p>Im Speicher steht die Zahl als Bitfolge: Ein Zeichen belegt <strong>1 Byte = 8 Bit</strong>. So kannst du die <strong>Datenmenge</strong> eines Textes abschätzen: Anzahl der Zeichen = Anzahl Byte. Größere Einheiten: <strong>1 Kilobyte (kB) = 1 000 Byte</strong>, 1 Megabyte (MB) = 1 000 000 Byte. Manche Programme rechnen mit 1 024 statt 1 000 (geschrieben KiB, MiB).</p>
<div class="example"><strong>Beispiel:</strong> „HI“ ist im ASCII-Code 72 und 73. Im Speicher steht 01001000 01001001: zwei Byte, also 16 Bit. Ein Brief mit 2 500 Zeichen belegt etwa 2 500 Byte = 2,5 kB.</div>
<div class="merke"><strong>Merke:</strong> Code = eindeutige Zuordnung Zeichen ↔ Codewort. ASCII: A = 65. 1 Zeichen = 1 Byte = 8 Bit; 1 kB = 1 000 Byte.</div>`,
      rule: "ASCII: A = 65 … Z = 90; 1 Zeichen = 1 Byte = 8 Bit; 1 kB = 1 000 Byte",
      terms: [
        ["Morsecode", "E = · · T = − · S = ··· · O = −−−", "kurze und lange Signale"],
        ["Datenmengen", "Bit · Byte (8 Bit) · kB (1 000 Byte) · MB (1 000 000 Byte)", "KiB = 1 024 Byte, wenn mit Zweierpotenzen gerechnet wird"],
      ],
      quiz: [
        "Wie viele verschiedene Zeichen lassen sich mit genau einem Byte codieren?",
        "256",
        "128",
        "8",
        "Ein Byte hat 8 Bit, also 2⁸ = 256 verschiedene Bitmuster von 00000000 bis 11111111.",
      ],
      lab: codeLab,
      exercises: [asciiTask, datenmenge],
    }),
    lesson(id, "1.4", 4, {
      id: "it8-digitalisierung",
      title: "Analog und digital: Digitalisierung",
      subtitle: "Abtasten und Runden auf Stufen an konkreten Beispielen",
      why: "Musik, Fotos und Sprache sind von Natur aus analog. Damit ein Handy sie speichern kann, müssen sie in Zahlen verwandelt werden.",
      html: `<p>Eine <strong>analoge</strong> Darstellung ist stufenlos: Der Zeiger einer Uhr gleitet über alle Zwischenwerte, die Lautstärke eines Tons ändert sich fließend. Eine <strong>digitale</strong> Darstellung kennt nur endlich viele Werte, die als Zahlen (Bits) gespeichert werden: Die Digitaluhr springt von 12:01 auf 12:02.</p>
<p><strong>Digitalisierung</strong> wandelt ein analoges Signal in digitale Daten um. Dazu wird es in festen Zeitabständen <strong>abgetastet</strong>, und jeder Messwert wird auf eine von endlich vielen <strong>Stufen</strong> gerundet. Mit n Bit gibt es <strong>2ⁿ Stufen</strong>. Je öfter abgetastet wird und je mehr Bits ein Messwert hat, desto genauer ist das Ergebnis, aber desto größer wird die <strong>Datenmenge</strong> = Abtastungen pro Sekunde · Bits je Messwert · Sekunden.</p>
<div class="example"><strong>Beispiel:</strong> Ein Sprachrekorder tastet 8 000-mal pro Sekunde ab und speichert jeden Wert mit 8 Bit (256 Stufen). Eine Minute ergibt 8 000 · 60 = 480 000 Byte. Mit nur 1 Bit (2 Stufen) wäre die Sprache kaum zu verstehen.</div>
<div class="merke"><strong>Merke:</strong> Analog = stufenlos, digital = endlich viele Werte. Digitalisieren = abtasten + auf 2ⁿ Stufen runden. Feiner heißt genauer, aber mehr Daten.</div>`,
      rule: "Stufen = 2ⁿ (n Bit); Datenmenge = Abtastrate · Bits je Wert · Zeit",
      terms: [
        ["Analog · digital", "stufenlos · in endlich vielen Stufen als Zahlen", "Zeigeruhr · Digitaluhr"],
        ["Abtasten · Quantisieren", "in festen Zeitabständen messen · auf eine Stufe runden", "Abtastrate in Hertz (Hz) = Messungen pro Sekunde"],
      ],
      quiz: [
        "Was passiert beim Digitalisieren eines Tons?",
        "Er wird in festen Abständen gemessen und jeder Messwert auf eine Stufe gerundet.",
        "Er wird lauter, damit der Computer ihn hört.",
        "Er wird stufenlos auf eine Schallplatte geritzt.",
        "Abtasten und Runden auf Stufen machen aus einem stufenlosen Signal endlich viele Zahlen.",
      ],
      lab: digitalLab,
      exercises: [stufenTask, audioTask],
    }),
    lesson(id, "1.4", 5, {
      id: "it8-kommunikation-sicher",
      title: "Digitale Kommunikation: Gefahren erkennen, fair bleiben",
      subtitle: "Schadsoftware, Phishing, Belästigung, Diskreditierung und Ausgrenzung",
      why: "E-Mail, Messenger und Lernplattform verbinden dich mit anderen. Wer Gefahren erkennt und fair kommuniziert, schützt sich und andere.",
      html: `<p>Digitale Kommunikationsmittel wie <strong>E-Mail</strong>, <strong>soziale Netzwerke</strong>, Messenger und <strong>Lernplattformen</strong> bieten viele Möglichkeiten: schnell, weltweit, gemeinsam lernen. Sie haben aber Risiken. <strong>Schadsoftware</strong> versteckt sich oft in Anhängen oder Links (z. B. „Rechnung.pdf.exe“). Beim <strong>Phishing</strong> fordern gefälschte Nachrichten dazu auf, Passwörter oder Daten einzugeben. <strong>Belästigung</strong> sind unerwünschte, aufdringliche oder sexuelle Nachrichten.</p>
<p><strong>Diskreditierung</strong> heißt, jemanden herabzusetzen oder schlechtzumachen: Gerüchte, Beleidigungen, peinliche oder bearbeitete Bilder. <strong>Ausgrenzung</strong> heißt, jemanden absichtlich aus Gruppen oder Gesprächen auszuschließen. Beides ist <strong>Cybermobbing</strong>, wenn es wiederholt und gezielt geschieht; es verletzt Menschen und kann strafbar sein. Vorbeugen: Absender und Links prüfen, keine unbekannten Anhänge öffnen, nichts Verletzendes weiterleiten. Wer betroffen ist: nicht antworten, <strong>Beweise sichern</strong> (Screenshots), blockieren, melden und sich einer <strong>Vertrauensperson</strong> anvertrauen.</p>
<div class="example"><strong>Beispiel:</strong> In der Klassengruppe taucht ein bearbeitetes Foto von Tom auf, darunter Spott. Du leitest es nicht weiter, sicherst einen Screenshot, meldest den Beitrag und sprichst mit der Klassenleitung. Tom sagst du, dass du zu ihm hältst.</div>
<div class="merke"><strong>Merke:</strong> Unbekannte Anhänge und Links nicht öffnen, nie Passwörter auf Anfrage eingeben. Bei Cybermobbing: nicht weiterleiten, Beweise sichern, melden, Hilfe holen.</div>`,
      rule: "Vorbeugen: Absender prüfen, keine Anhänge/Links unbekannter Herkunft. Reagieren: nicht antworten, Beweise sichern, blockieren, melden, Vertrauensperson",
      terms: [
        ["Phishing · Schadsoftware", "gefälschte Nachricht, die Daten abgreift · Programm, das schadet", "z. B. „Konto gesperrt, Passwort bestätigen“ · Trojaner im Anhang"],
        ["Diskreditierung · Ausgrenzung", "jemanden herabsetzen · jemanden absichtlich ausschließen", "wiederholt und gezielt: Cybermobbing"],
      ],
      quiz: [
        "Eine E-Mail deiner „Bank“ fordert dich auf, über einen Link dein Passwort zu bestätigen. Was ist das wahrscheinlich?",
        "Phishing",
        "Eine normale Sicherheitsabfrage",
        "Ausgrenzung",
        "Seriöse Anbieter fragen nie per E-Mail nach Passwörtern; der Link führt meist auf eine gefälschte Seite.",
      ],
      lab: caseLab({
        kind: "kommunikation-gefahren",
        title: "Was ist hier los?",
        intro: "Ordne jede Situation ein. Achte auf Absender, Absicht und Wirkung.",
        categories: ["Phishing", "Schadsoftware", "Diskreditierung", "Ausgrenzung", "unbedenklich"],
        cases: [
          { short: "„Konto gesperrt, Passwort …“", text: "Mail: „Ihr Konto wird gesperrt. Bestätigen Sie hier Ihr Passwort.“", answer: 0, why: "Gefälschte Aufforderung, Zugangsdaten einzugeben.", hint: "Will die Nachricht an deine Daten?" },
          { short: "Anhang Rechnung.pdf.exe", text: "Unbekannter Absender schickt „Rechnung.pdf.exe“.", answer: 1, why: ".exe ist ein Programm, getarnt als PDF.", hint: "Welche Endung steht ganz hinten?" },
          { short: "Bearbeitetes Foto mit Spott", text: "Ein bearbeitetes Foto von Tom wird mit Spott in der Klassengruppe geteilt.", answer: 2, why: "Tom wird bloßgestellt und herabgesetzt.", hint: "Wird jemand schlechtgemacht?" },
          { short: "Neue Gruppe ohne Mia", text: "Alle aus der Klasse kommen in eine neue Gruppe, nur Mia absichtlich nicht.", answer: 3, why: "Mia wird gezielt ausgeschlossen.", hint: "Wird jemand absichtlich ausgeschlossen?" },
          { short: "Arbeitsblatt auf Lernplattform", text: "Die Lehrerin lädt ein Arbeitsblatt auf die Lernplattform der Schule.", answer: 4, why: "Bekannter Absender, sinnvolle Nutzung.", hint: "Gibt es hier ein Risiko?" },
          { short: "Gerücht über Jan", text: "Jemand verbreitet im Netzwerk ein erfundenes Gerücht über Jan.", answer: 2, why: "Ein Gerücht schadet Jans Ruf.", hint: "Was macht das Gerücht mit Jans Ansehen?" },
        ],
        goals: [
          { text: "Erkenne Phishing und Schadsoftware.", cases: [0, 1] },
          { text: "Unterscheide Diskreditierung und Ausgrenzung.", cases: [2, 3, 5] },
          { text: "Beurteile alle sechs Situationen richtig.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "gefahr-erkennen",
          [
            cc("Ein unbekannter Absender schickt einen Link „Du hast ein Handy gewonnen!“. Was tust du?", "Nicht anklicken und die Nachricht löschen.", ["Schnell klicken, bevor das Angebot abläuft.", "Den Link an Freunde weiterleiten."], "Gewinnversprechen sind ein typischer Köder für Phishing und Schadsoftware.", "Wer verschenkt Handys an Fremde?"),
            cc("Woran erkennst du einen gefährlichen Anhang am ehesten?", "An einer Programmendung wie .exe hinter einer harmlosen Endung.", ["An einer bunten Betreffzeile.", "Daran, dass er klein ist."], "„.pdf.exe“ ist ein Programm, das sich als Dokument tarnt.", "Schau auf die letzte Endung."),
            cc("Was bedeutet Ausgrenzung in einer Klassengruppe?", "Jemand wird absichtlich nicht aufgenommen oder ignoriert.", ["Jemand verlässt freiwillig die Gruppe.", "Jemand schickt zu viele Nachrichten."], "Ausgrenzung ist ein absichtlicher Ausschluss.", "Geschieht es absichtlich?"),
          ],
          [
            cc(
              "Du wirst in einem Chat wiederholt beleidigt. Welche Reaktion ist am sinnvollsten?",
              "Nicht antworten, Screenshots sichern, blockieren, melden und mit einer Vertrauensperson sprechen.",
              ["Genauso zurückbeleidigen.", "Alles löschen und niemandem etwas sagen."],
              "Beweise helfen beim Melden; Hilfe holen ist kein Petzen. Zurückschlagen verschärft den Streit.",
              "Was brauchst du, um dich zu wehren?",
            ),
            cc(
              "Ein Freund leitet ein peinliches Video eines Mitschülers „nur zum Spaß“ weiter. Wie bewertest du das?",
              "Es ist Diskreditierung; jede Weiterleitung vergrößert den Schaden.",
              ["Harmlos, solange er es nicht selbst gedreht hat.", "Erlaubt, weil das Video schon im Umlauf ist."],
              "Wer weiterleitet, verbreitet die Bloßstellung weiter und macht mit.",
              "Was erlebt der Mitschüler?",
            ),
            cc(
              "Auf der Lernplattform bekommst du eine Nachricht vom „Admin“: Dein Zugang laufe ab, du sollst dein Passwort antworten. Was ist richtig?",
              "Nicht antworten und die Lehrkraft oder den echten Administrator informieren.",
              ["Das Passwort schicken, weil es von der Schule kommt.", "Ein neues Passwort ausdenken und das schicken."],
              "Echte Administratoren fragen nie nach Passwörtern; das ist Phishing, auch auf Schulplattformen.",
              "Wer braucht dein Passwort wirklich?",
            ),
          ],
        ),
        cases(
          "fair-kommunizieren",
          [
            cc("Was ist ein typischer Vorteil einer Lernplattform?", "Material und Aufgaben sind jederzeit an einem Ort erreichbar.", ["Man muss nie mehr selbst lernen.", "Sie schützt automatisch vor jedem Betrug."], "Lernplattformen bündeln Material und Kommunikation der Schule.", "Wofür nutzt deine Schule sie?"),
            cc("Wann wird aus einem Streit im Netz Cybermobbing?", "Wenn jemand wiederholt und gezielt herabgesetzt oder ausgeschlossen wird.", ["Sobald zwei verschiedener Meinung sind.", "Wenn eine Nachricht Rechtschreibfehler hat."], "Wiederholung und Absicht machen das Mobbing aus.", "Einmaliger Streit oder gezielt immer wieder?"),
            cc("Warum ist ein Gerücht im Netz schlimmer als auf dem Schulhof?", "Es verbreitet sich schnell an viele und lässt sich kaum löschen.", ["Es ist im Netz immer wahr.", "Im Netz liest es niemand."], "Digitale Inhalte werden kopiert und bleiben auffindbar.", "Wer sieht es und wie lange?"),
          ],
          [
            cc(
              "Mia wird aus jeder Gruppe herausgehalten. Du willst helfen, ohne selbst angegriffen zu werden. Was ist sinnvoll?",
              "Mia privat unterstützen und die Situation einer Lehrkraft oder Vertrauensperson schildern.",
              ["Nichts tun, es betrifft dich nicht.", "Eine eigene Gruppe gegen die anderen gründen und sie dort beschimpfen."],
              "Unterstützen und Erwachsene einbeziehen hilft, ohne den Konflikt anzuheizen.",
              "Wie hilfst du Mia, ohne neuen Streit zu erzeugen?",
            ),
            cc(
              "Ein Mitschüler postet einen ironischen Kommentar über dich, den du verletzend findest. Was hilft beim Klären?",
              "Ruhig und direkt sagen, wie der Kommentar ankommt, und um Löschung bitten.",
              ["Öffentlich einen noch gemeineren Kommentar schreiben.", "Seine Fotos sammeln und verbreiten."],
              "Ironie kommt schriftlich oft falsch an; ein ruhiges Gespräch klärt Missverständnisse.",
              "Weiß er, wie es bei dir ankommt?",
            ),
            cc(
              "Deine Klasse will Regeln für den Klassenchat festlegen. Welche Regel schützt am meisten vor Ausgrenzung?",
              "Alle sind Mitglied, und niemand wird ohne Absprache entfernt.",
              ["Nur die Beliebtesten dürfen schreiben.", "Wer nicht antwortet, fliegt raus."],
              "Eine Gruppe für alle verhindert, dass jemand gezielt ausgeschlossen wird.",
              "Wer könnte sonst draußen bleiben?",
            ),
          ],
        ),
      ],
    }),
    lesson(id, "1.4", 6, {
      id: "it8-persoenliche-daten",
      title: "Persönliche Daten, Recht am eigenen Bild, Datenschutz",
      subtitle: "Sensibel mit Daten umgehen und rechtliche Aspekte in Netzwerken beachten",
      why: "Ein Foto ist schnell geteilt und kaum zurückzuholen. Wer die Rechte der anderen kennt, schützt sie und sich vor Ärger.",
      html: `<p><strong>Personenbezogene Daten</strong> sind alle Angaben, die sich einer Person zuordnen lassen: Name, Adresse, Telefonnummer, Geburtstag, Fotos, Standort. Die <strong>Datenschutz-Grundverordnung (DSGVO)</strong> regelt, dass solche Daten nur mit einem Grund oder mit <strong>Einwilligung</strong> verarbeitet werden dürfen. Für viele Online-Dienste brauchen Jugendliche unter 16 Jahren in Deutschland die Zustimmung der Eltern.</p>
<p>Das <strong>Persönlichkeitsrecht</strong> schützt jeden Menschen. Dazu gehört das <strong>Recht am eigenen Bild</strong>: Fotos und Videos, auf denen jemand erkennbar ist, dürfen nur mit dessen <strong>Einwilligung</strong> veröffentlicht werden (bei Kindern und Jugendlichen meist auch mit der der Eltern). Heimliche Aufnahmen von Gesprächen zu verbreiten ist verboten. Schütze deine <strong>Privatsphäre</strong>: Profile auf privat stellen, Standort nicht teilen, nur nötige Daten angeben, vor dem Posten nachdenken.</p>
<div class="example"><strong>Beispiel:</strong> Nach dem Sportfest willst du ein Foto mit drei Freundinnen posten. Du fragst vorher alle drei. Eine will nicht: Du schneidest sie heraus oder postest das Bild nicht.</div>
<div class="merke"><strong>Merke:</strong> Wer erkennbar ist, entscheidet selbst über das Bild. Erst fragen, dann posten. Persönliche Daten sparsam preisgeben.</div>`,
      rule: "Erkennbare Personen nur mit Einwilligung veröffentlichen; persönliche Daten nur mit Grund oder Einwilligung verarbeiten (DSGVO)",
      terms: [
        ["Personenbezogene Daten", "Name, Adresse, Telefonnummer, Foto, Standort, …", "lassen sich einer Person zuordnen"],
        ["Recht am eigenen Bild", "Teil des Persönlichkeitsrechts", "Veröffentlichung nur mit Einwilligung der erkennbaren Person"],
      ],
      quiz: [
        "Du willst ein Foto, auf dem deine Freundin gut zu erkennen ist, öffentlich posten. Was brauchst du?",
        "Ihre Einwilligung",
        "Nichts, weil du das Foto gemacht hast",
        "Nur einen lustigen Text dazu",
        "Das Recht am eigenen Bild schützt die abgebildete Person; wer fotografiert, darf das Bild nicht einfach veröffentlichen.",
      ],
      lab: caseLab({
        kind: "datenschutz-faelle",
        title: "Darf ich das posten?",
        intro: "Entscheide für jeden Fall, ob du ihn so veröffentlichen darfst.",
        categories: ["erlaubt", "nur mit Einwilligung", "nicht erlaubt"],
        cases: [
          { short: "Eigenes Urlaubsfoto, allein", text: "Ein Urlaubsfoto, auf dem nur du selbst zu sehen bist, im eigenen Status.", answer: 0, why: "Über das eigene Bild entscheidest du selbst.", hint: "Wer ist auf dem Bild?" },
          { short: "Foto der Freundin in Gruppe", text: "Ein gut erkennbares Foto deiner Freundin in der Klassengruppe.", answer: 1, why: "Sie muss vorher zustimmen.", hint: "Wer entscheidet über ihr Bild?" },
          { short: "Heimlich gefilmter Lehrer", text: "Ein heimlich im Unterricht gefilmtes Video eines Lehrers.", answer: 2, why: "Heimliche Aufnahmen zu verbreiten ist verboten.", hint: "Wusste er von der Aufnahme?" },
          { short: "Adresse eines Mitschülers", text: "Adresse und Handynummer eines Mitschülers in einem öffentlichen Kommentar.", answer: 1, why: "Ohne Einwilligung tabu; mit Einwilligung möglich.", hint: "Sind das personenbezogene Daten?" },
          { short: "Klassenfoto auf Homepage", text: "Das Klassenfoto auf der Schulhomepage.", answer: 1, why: "Die Schule holt dafür Einwilligungen ein.", hint: "Sind Personen erkennbar?" },
          { short: "Foto vom Rathaus", text: "Ein Foto vom Rathaus, keine Person erkennbar.", answer: 0, why: "Gebäude von der Straße aus dürfen gezeigt werden.", hint: "Ist jemand erkennbar?" },
        ],
        goals: [
          { text: "Erkenne, wann du keine Einwilligung brauchst.", cases: [0, 5] },
          { text: "Erkenne die Fälle, die eine Einwilligung brauchen.", cases: [1, 3, 4] },
          { text: "Beurteile alle sechs Fälle richtig.", cases: [0, 1, 2, 3, 4, 5] },
        ],
      }),
      exercises: [
        cases(
          "daten-erkennen",
          [
            cc("Welche Angabe ist ein personenbezogenes Datum?", "Deine Handynummer", ["Die Hauptstadt von Frankreich", "Die Uhrzeit des Sonnenaufgangs"], "Sie lässt sich dir eindeutig zuordnen.", "Kann man damit dich finden?"),
            cc("Was regelt die DSGVO?", "Den Schutz personenbezogener Daten", ["Die Rechtschreibung im Internet", "Die Preise für Handyverträge"], "DSGVO = Datenschutz-Grundverordnung der EU.", "D wie Datenschutz."),
            cc("Wie schützt du deine Privatsphäre in einem sozialen Netzwerk am einfachsten?", "Das Profil auf privat stellen und den Standort nicht teilen.", ["Möglichst viele Fremde als Freunde annehmen.", "Die Handynummer im Profil veröffentlichen."], "Privat-Einstellungen begrenzen, wer deine Daten sieht.", "Wer soll deine Beiträge sehen?"),
          ],
          [
            cc(
              "Für ein Gewinnspiel einer App sollst du Name, Adresse, Geburtstag und Schule angeben. Wie gehst du vor?",
              "Prüfen, wer die Daten wozu braucht, und im Zweifel nicht teilnehmen.",
              ["Alles angeben, weil es nur ein Spiel ist.", "Die Daten eines Freundes eintragen."],
              "Daten sparsam preisgeben: Gewinnspiele sammeln oft Daten für Werbung.",
              "Wofür braucht ein Gewinnspiel deine Schule?",
            ),
            cc(
              "Lena ist 14 und will sich bei einem Online-Dienst anmelden, der ihre Einwilligung in die Datenverarbeitung verlangt. Was gilt in Deutschland?",
              "Unter 16 Jahren müssen die Eltern zustimmen.",
              ["Ab 12 Jahren darf sie allein zustimmen.", "Eine Einwilligung ist nie nötig."],
              "Nach der DSGVO gilt in Deutschland für solche Dienste die Altersgrenze 16.",
              "Welche Altersgrenze gilt in Deutschland?",
            ),
            cc(
              "Jemand hat ohne zu fragen ein Foto von dir gepostet, das dir unangenehm ist. Was darfst du verlangen?",
              "Dass das Foto gelöscht wird; notfalls meldest du es beim Netzwerk.",
              ["Nichts, das Foto gehört dem Fotografen.", "Nur, dass es kleiner gezeigt wird."],
              "Ohne deine Einwilligung durfte es nicht veröffentlicht werden.",
              "Wer entscheidet über dein Bild?",
            ),
          ],
        ),
        cases(
          "bild-rechte",
          [
            cc("Was schützt das Recht am eigenen Bild?", "Dass niemand Bilder von dir ohne Einwilligung veröffentlicht.", ["Dass du jedes Foto im Internet kostenlos nutzen darfst.", "Dass Fotos immer farbig sein müssen."], "Es ist Teil des Persönlichkeitsrechts.", "Wessen Bild ist geschützt?"),
            cc("Du filmst beim Schulfest die Band. Wen musst du fragen, bevor du das Video veröffentlichst?", "Die erkennbaren Bandmitglieder", ["Niemanden, weil es ein Fest war", "Nur den Hausmeister"], "Erkennbare Personen müssen zustimmen.", "Wer ist im Video erkennbar?"),
            cc("Darf man einen Screenshot eines privaten Chats mit Namen veröffentlichen?", "Nur mit Einwilligung der Beteiligten.", ["Ja, Screenshots sind immer erlaubt.", "Ja, wenn er lustig ist."], "Private Nachrichten und Namen sind geschützt.", "War das Gespräch öffentlich?"),
          ],
          [
            cc(
              "Auf einem Gruppenfoto von der Klassenfahrt will Ben nicht zu sehen sein. Die anderen sind einverstanden. Was tust du?",
              "Ben unkenntlich machen oder herausschneiden, oder das Bild nicht posten.",
              ["Posten, weil die Mehrheit zustimmt.", "Posten und Ben später fragen."],
              "Die Einwilligung gilt für jede Person einzeln, nicht per Mehrheit.",
              "Gilt eine Mehrheit für Bens Bild?",
            ),
            cc(
              "Dein Video vom Pausenhof zeigt im Hintergrund kleine, nicht erkennbare Personen. Brauchst du von ihnen eine Einwilligung?",
              "Nein, wenn sie wirklich nicht erkennbar sind.",
              ["Ja, von jeder Person auf dem ganzen Schulgelände.", "Nein, Pausenhöfe sind rechtsfrei."],
              "Geschützt ist, wer erkennbar ist; unkenntliche Personen sind nicht betroffen.",
              "Kann man die Personen erkennen?",
            ),
            cc(
              "Eine Freundin erlaubt dir, ein Foto in eurer Freundesgruppe zu teilen. Darfst du es danach öffentlich posten?",
              "Nein, die Einwilligung galt nur für die Freundesgruppe.",
              ["Ja, einmal erlaubt ist immer erlaubt.", "Ja, wenn du ihren Namen weglässt."],
              "Eine Einwilligung gilt für einen bestimmten Zweck; für eine öffentliche Veröffentlichung musst du neu fragen.",
              "Wofür genau hat sie zugestimmt?",
            ),
          ],
        ),
      ],
    }),
  ],
};
