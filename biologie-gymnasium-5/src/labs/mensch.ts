/**
 * Labs of stations 3 to 6: reaction time, the arm model, energy in food,
 * surface enlargement, pulse and breathing, and the simplified female cycle.
 * Physical formulas are exact; physiological numbers are labelled example
 * values (Beispielwerte) and never presented as measurements.
 */
import { f1, label, labels, panel, svg } from "../figures/draw";
import {
  fmtDe,
  type LabDef,
  type LabState,
  num,
  remember,
  seen,
  str,
} from "./core";

/* ---------- Reaktionszeit mit dem Linealtest ---------- */

/** Fallzeit eines frei fallenden Lineals: t = √(2 · s / g). */
export function reactionTime(cm: number): number {
  return Math.sqrt((2 * (cm / 100)) / 9.81);
}

export function reactionWay(cm: number, kmh: number): number {
  return (kmh / 3.6) * reactionTime(cm);
}

export const reaction: LabDef = {
  title: "Reaktionszeit",
  prompt:
    "Ein Partner lässt ein Lineal fallen, du fängst es. Je weiter es fällt, desto länger war deine Reaktionszeit.",
  init: () => ({ cm: 30, speed: "15" }),
  controls: () => [
    {
      type: "range",
      key: "cm",
      label: "Fallstrecke bis zum Fangen",
      min: 5,
      max: 50,
      step: 1,
      format: (v) => `${fmtDe(v)} cm`,
    },
    {
      type: "choice",
      key: "speed",
      label: "Tempo mit dem Fahrrad",
      options: [
        { value: "15", label: "15 km/h" },
        { value: "25", label: "25 km/h" },
      ],
    },
  ],
  goals: (s) => [
    {
      text: "Eine schnelle Reaktion: Reaktionszeit unter 0,2 s",
      met: reactionTime(num(s, "cm")) < 0.2,
    },
    {
      text: "Eine langsame Reaktion über 0,3 s, wie bei Ablenkung oder Müdigkeit",
      met: reactionTime(num(s, "cm")) > 0.3,
    },
    {
      text: "Bei 25 km/h einen Reaktionsweg von mehr als 2 m finden",
      met: str(s, "speed") === "25" && reactionWay(num(s, "cm"), 25) > 2,
    },
  ],
  draw: (s) => {
    const cm = num(s, "cm");
    const kmh = Number(str(s, "speed"));
    const way = reactionWay(cm, kmh);
    const ticks = Array.from({ length: 11 }, (_, i) => i * 5)
      .map(
        (v) =>
          `<line x1="62" y1="${f1(30 + v * 3.6)}" x2="${v % 10 === 0 ? 76 : 70}" y2="${f1(30 + v * 3.6)}" stroke="var(--f-ink)"/>${v % 10 === 0 ? label(80, 34 + v * 3.6, `${v}`, "lbl tiny", "start") : ""}`,
      )
      .join("");
    const scale = 90; // Pixel je Meter
    return svg(
      540,
      232,
      `Linealtest: Fallstrecke ${fmtDe(cm)} Zentimeter, Reaktionsweg mit dem Fahrrad ${fmtDe(way, 1)} Meter`,
      `${panel(8, 8, 150, 216, "panel-bg")}
       <rect x="40" y="26" width="36" height="190" rx="3" fill="var(--f-yellow)" stroke="var(--f-ink)"/>
       <rect x="30" y="${f1(26 + cm * 3.6)}" width="44" height="16" rx="8" fill="var(--f-skin)" stroke="var(--f-ink)" opacity="0.9"/>
       ${ticks}
       ${label(120, 40, "Start", "lbl tiny", "middle")}
       <line x1="90" y1="30" x2="108" y2="30" stroke="var(--f-ink)" stroke-dasharray="3 2"/>
       ${label(118, 40 + cm * 3.6, `${fmtDe(cm)} cm`, "lbl small strong", "start")}
       ${panel(168, 8, 364, 216, "panel-bg")}
       ${label(186, 40, `Reaktionszeit ≈ ${fmtDe(reactionTime(cm), 2)} s`, "lbl strong", "start")}
       ${label(186, 64, `Tempo ${kmh} km/h = ${fmtDe(kmh / 3.6, 1)} m pro Sekunde`, "lbl small", "start")}
       <rect x="186" y="132" width="330" height="40" rx="6" fill="var(--f-stone)" opacity="0.5"/>
       <line x1="186" y1="152" x2="516" y2="152" stroke="var(--f-white)" stroke-width="2" stroke-dasharray="10 8"/>
       <rect x="186" y="140" width="${f1(Math.min(330, way * scale))}" height="24" rx="4" fill="var(--f-orange)" opacity="0.85"/>
       ${[0, 1, 2, 3].map((m) => `<line x1="${186 + m * scale}" y1="176" x2="${186 + m * scale}" y2="184" stroke="var(--f-ink)"/>${label(186 + m * scale, 198, `${m} m`, "lbl tiny", "middle")}`).join("")}
       ${label(186, 116, `Reaktionsweg ≈ ${fmtDe(way, 1)} m, ohne zu bremsen`, "lbl small strong", "start")}`,
    );
  },
  readout: (s) => {
    const cm = num(s, "cm");
    const kmh = Number(str(s, "speed"));
    return `Fallstrecke ${fmtDe(cm)} cm → Reaktionszeit ≈ ${fmtDe(reactionTime(cm), 2)} s. Bei ${kmh} km/h fährst du in dieser Zeit ≈ ${fmtDe(reactionWay(cm, kmh), 1)} m weiter, bevor die Bremse überhaupt wirkt.`;
  },
};

/* ---------- Armmodell: Gegenspieler ---------- */

export const armLever: LabDef = {
  title: "Armmodell",
  prompt:
    "Beuge und strecke den Arm. Beobachte, welcher Muskel sich jeweils verkürzt und welcher gedehnt wird.",
  init: () => ({ armAngle: 110, showTendons: false }),
  controls: () => [
    {
      type: "range",
      key: "armAngle",
      label: "Ellbogenwinkel",
      min: 40,
      max: 170,
      step: 1,
      format: (v) => `${fmtDe(v)}°`,
    },
    {
      type: "toggle",
      key: "showTendons",
      label: "Knochen, Sehnen und Gelenk beschriften",
    },
  ],
  goals: (s) => [
    {
      text: "Arm stark beugen (Ellbogenwinkel bis 60°): Der Bizeps verkürzt sich",
      met: num(s, "armAngle") <= 60,
    },
    {
      text: "Arm fast ganz strecken (ab 155°): Der Trizeps verkürzt sich",
      met: num(s, "armAngle") >= 155,
    },
    {
      text: "Knochen, Sehnen und Scharniergelenk beschriften lassen",
      met: s.showTendons === true,
    },
  ],
  draw: (s) => drawArmLever(num(s, "armAngle"), s.showTendons === true),
  readout: (s) => {
    const angle = num(s, "armAngle");
    return angle < 90
      ? "Der Bizeps (Beuger) verkürzt sich und zieht über seine Sehne den Unterarm nach oben. Der Trizeps wird gedehnt."
      : angle > 140
        ? "Der Trizeps (Strecker) verkürzt sich und zieht den Unterarm nach unten. Der Bizeps wird gedehnt."
        : "Ein Muskel kann nur ziehen, nicht schieben. Deshalb braucht jede Bewegung einen Gegenspieler für die Rückbewegung.";
  },
};

function drawArmLever(armAngle: number, showLabels: boolean): string {
  const elbow = { x: 168, y: 122 };
  const shoulder = { x: 168, y: 28 };
  const thetaRad = (armAngle * Math.PI) / 180;
  // Vorderseite (Bizeps) rechts (+x), Rückseite (Trizeps) links (−x).
  const vx = Math.sin(thetaRad);
  const vy = -Math.cos(thetaRad);
  const hand = { x: elbow.x + 96 * vx, y: elbow.y + 96 * vy };
  const flex = (170 - armAngle) / 130;
  const bicepRx = 8 + flex * 7;
  const bicepRy = 33 - flex * 8;
  const tricepRx = 7.5 + (1 - flex) * 7.5;
  const tricepRy = 25 + flex * 8;
  const bicepAttach = { x: elbow.x + 28 * vx, y: elbow.y + 28 * vy };
  const forearmMid = { x: elbow.x + 58 * vx, y: elbow.y + 58 * vy };
  const arcR = 22;
  const arcEnd = { x: elbow.x + arcR * vx, y: elbow.y + arcR * vy };
  const tendon = (x1: number, y1: number, x2: number, y2: number) =>
    `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="var(--f-ink)" stroke-width="5" stroke-linecap="round"/><line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="#fbf7ef" stroke-width="2.8" stroke-linecap="round"/>`;
  const pointer = (x1: number, y1: number, x2: number, y2: number) =>
    `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="var(--f-ink)" stroke-width="1" opacity="0.65"/>`;
  const labelsSvg = showLabels
    ? `${pointer(130, 44, 162, 44)}${label(126, 48, "Oberarmknochen", "lbl small", "end")}
       ${pointer(130, 78, 152 - tricepRx, 78)}${label(126, 82, "Trizeps (Strecker)", "lbl small", "end")}
       ${pointer(130, 138, 161, 124)}${label(126, 142, "Scharniergelenk", "lbl small", "end")}
       ${pointer(184 + bicepRx, 78, 302, 78)}${label(306, 82, "Bizeps (Beuger)", "lbl small", "start")}
       ${pointer(bicepAttach.x, bicepAttach.y, 302, 122)}${label(306, 126, "Sehne", "lbl small", "start")}
       ${pointer(forearmMid.x, forearmMid.y, 302, 166)}${label(306, 170, "Unterarmknochen", "lbl small", "start")}`
    : labels(
        390,
        100,
        flex > 0.55
          ? "Bizeps verkürzt sich\nTrizeps wird gedehnt"
          : flex < 0.25
            ? "Trizeps verkürzt sich\nBizeps wird gedehnt"
            : "Bizeps vorn: Beuger\nTrizeps hinten: Strecker",
        "lbl small",
        "middle",
        18,
      );
  return svg(
    500,
    236,
    `Armmodell mit Bizeps und Trizeps, Ellbogenwinkel ${fmtDe(armAngle)} Grad`,
    `${panel(8, 8, 484, 220, "panel-bg")}
     <path d="M ${elbow.x} ${elbow.y - arcR} A ${arcR} ${arcR} 0 0 1 ${f1(arcEnd.x)} ${f1(arcEnd.y)}" fill="none" stroke="var(--f-orange)" stroke-width="2" stroke-dasharray="3 2"/>
     <line x1="${shoulder.x}" y1="${shoulder.y}" x2="${elbow.x}" y2="${elbow.y}" stroke="#e7dfd0" stroke-width="14" stroke-linecap="round"/>
     <line x1="${shoulder.x}" y1="${shoulder.y}" x2="${elbow.x}" y2="${elbow.y}" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="${elbow.x}" y1="${elbow.y}" x2="${f1(hand.x)}" y2="${f1(hand.y)}" stroke="#e7dfd0" stroke-width="12" stroke-linecap="round"/>
     <line x1="${elbow.x}" y1="${elbow.y}" x2="${f1(hand.x)}" y2="${f1(hand.y)}" stroke="var(--f-ink)" stroke-width="2"/>
     ${tendon(shoulder.x + 6, shoulder.y + 8, 184, 74 - bicepRy + 4)}
     ${tendon(184, 74 + bicepRy - 4, bicepAttach.x, bicepAttach.y)}
     <ellipse cx="184" cy="74" rx="${f1(bicepRx)}" ry="${f1(bicepRy)}" fill="var(--f-red)" opacity="${f1(0.55 + flex * 0.45)}"/>
     ${tendon(shoulder.x - 6, shoulder.y + 8, 152, 74 - tricepRy + 4)}
     ${tendon(152, 74 + tricepRy - 4, elbow.x - 9, elbow.y + 5)}
     <ellipse cx="152" cy="74" rx="${f1(tricepRx)}" ry="${f1(tricepRy)}" fill="var(--f-blue)" opacity="${f1(0.95 - flex * 0.4)}"/>
     <circle cx="${elbow.x}" cy="${elbow.y}" r="9" fill="var(--f-orange)" stroke="var(--f-ink)" stroke-width="2"/>
     <circle cx="${f1(hand.x)}" cy="${f1(hand.y)}" r="8" fill="var(--f-skin)" stroke="var(--f-ink)"/>
     ${label(390, 50, `Ellbogenwinkel: ${fmtDe(armAngle)}°`, "lbl strong", "middle")}
     ${labelsSvg}`,
  );
}

/* ---------- Energie in Nährstoffen ---------- */

export const KJ_PER_G = { kh: 17, fett: 37, eiweiss: 17 } as const;

export function energy(s: LabState) {
  const kh = num(s, "kh") * KJ_PER_G.kh;
  const fett = num(s, "fett") * KJ_PER_G.fett;
  const eiweiss = num(s, "eiweiss") * KJ_PER_G.eiweiss;
  return { kh, fett, eiweiss, total: kh + fett + eiweiss };
}

export const foodEnergy: LabDef = {
  title: "Energie in Nährstoffen",
  prompt:
    "Stelle eine Mahlzeit aus Kohlenhydraten, Fett und Eiweiß zusammen. Welcher Nährstoff liefert pro Gramm am meisten Energie?",
  init: () => ({ kh: 10, fett: 5, eiweiss: 5 }),
  controls: () => [
    {
      type: "range",
      key: "kh",
      label: "Kohlenhydrate",
      min: 0,
      max: 100,
      step: 5,
      format: (v) => `${fmtDe(v)} g`,
    },
    {
      type: "range",
      key: "fett",
      label: "Fett",
      min: 0,
      max: 50,
      step: 5,
      format: (v) => `${fmtDe(v)} g`,
    },
    {
      type: "range",
      key: "eiweiss",
      label: "Eiweiß",
      min: 0,
      max: 50,
      step: 5,
      format: (v) => `${fmtDe(v)} g`,
    },
  ],
  goals: (s) => {
    const e = energy(s);
    return [
      { text: "Eine Mahlzeit mit mehr als 1 000 kJ zusammenstellen", met: e.total > 1000 },
      {
        text: "Zeigen, dass Fett mindestens die Hälfte der Energie liefern kann",
        met: e.total > 0 && e.fett >= e.total / 2,
      },
      {
        text: "Wie empfohlen verteilen: Kohlenhydrate mehr als die Hälfte, Fett höchstens ein Drittel, Eiweiß dabei",
        met:
          e.total > 0 &&
          e.kh > e.total / 2 &&
          e.fett <= e.total / 3 &&
          num(s, "eiweiss") > 0,
      },
    ];
  },
  draw: (s) => {
    const e = energy(s);
    const width = 440;
    const part = (v: number) => (e.total > 0 ? (v / e.total) * width : 0);
    const bars = [
      ["Kohlenhydrate", num(s, "kh"), e.kh, "var(--f-yellow)"],
      ["Fett", num(s, "fett"), e.fett, "var(--f-orange)"],
      ["Eiweiß", num(s, "eiweiss"), e.eiweiss, "var(--f-red)"],
    ] as const;
    let x = 30;
    const stack = bars
      .map(([, , kj, colour]) => {
        const w = part(kj);
        const rect = `<rect x="${f1(x)}" y="168" width="${f1(w)}" height="30" fill="${colour}"/>`;
        x += w;
        return rect;
      })
      .join("");
    return svg(
      500,
      226,
      `Energie der Mahlzeit: ${fmtDe(e.total)} Kilojoule aus Kohlenhydraten, Fett und Eiweiß`,
      `${panel(8, 8, 484, 210, "panel-bg")}
       ${bars
         .map(
           ([name, grams, kj, colour], i) =>
             `<rect x="${30 + i * 150}" y="${f1(130 - Math.min(100, kj / 20))}" width="40" height="${f1(Math.min(100, kj / 20))}" rx="4" fill="${colour}" stroke="var(--f-ink)"/>
              ${label(50 + i * 150, 30, name, "lbl small strong", "middle")}
              ${label(78 + i * 150, 110, `${fmtDe(grams)} g`, "lbl small", "start")}
              ${label(78 + i * 150, 128, `${fmtDe(kj)} kJ`, "lbl small strong", "start")}`,
         )
         .join("")}
       <rect x="30" y="168" width="${width}" height="30" fill="none" stroke="var(--f-ink)"/>
       ${stack}
       ${label(30, 160, `Gesamt: ${fmtDe(e.total)} kJ`, "lbl small strong", "start")}
       ${label(470, 160, "Anteile an der Energie", "lbl tiny", "end")}`,
    );
  },
  readout: (s) => {
    const e = energy(s);
    const pct = (v: number) => (e.total > 0 ? fmtDe((v / e.total) * 100) : "0");
    return `1 g Kohlenhydrate ≈ 17 kJ, 1 g Eiweiß ≈ 17 kJ, 1 g Fett ≈ 37 kJ. Deine Mahlzeit: ${fmtDe(e.total)} kJ, davon ${pct(e.kh)} % aus Kohlenhydraten, ${pct(e.fett)} % aus Fett und ${pct(e.eiweiss)} % aus Eiweiß.`;
  },
};

/* ---------- Oberflächenvergrößerung ---------- */

/** A cube of 4 cm cut into n pieces per edge: surface 6 · (4/n)² · n³ = 96 · n cm². */
export const cubeSurface = (n: number): number => 6 * (4 / n) ** 2 * n ** 3;

/**
 * All n³ pieces of the cut clay cube in oblique projection (depth drawn at
 * half length up and to the right). The whole stack keeps the 120 px edge of
 * the uncut cube; gaps show the cuts. Drawn back to front, bottom to top and
 * left to right, so nearer pieces cover farther ones.
 */
export function cubePieces(n: number): string[] {
  const gap = n === 1 ? 0 : 6;
  const size = (120 - gap * (n - 1)) / n;
  const pitch = size + gap;
  const e = size / 2;
  const pieces: string[] = [];
  for (let layer = n - 1; layer >= 0; layer--)
    for (let row = n - 1; row >= 0; row--)
      for (let col = 0; col < n; col++) {
        const x = 40 + col * pitch + (layer * pitch) / 2;
        const y = 80 + row * pitch - (layer * pitch) / 2;
        pieces.push(
          `<g data-piece><path d="M${f1(x)} ${f1(y)} l${f1(e)} ${f1(-e)} h${f1(size)} l${f1(-e)} ${f1(e)} Z" fill="#f7b267" stroke="var(--f-ink)" stroke-width="0.6"/><path d="M${f1(x + size)} ${f1(y)} l${f1(e)} ${f1(-e)} v${f1(size)} l${f1(-e)} ${f1(e)} Z" fill="#d9822b" stroke="var(--f-ink)" stroke-width="0.6"/><rect x="${f1(x)}" y="${f1(y)}" width="${f1(size)}" height="${f1(size)}" fill="#f4a259" stroke="var(--f-ink)" stroke-width="1"/></g>`,
        );
      }
  return pieces;
}

export const surface: LabDef = {
  title: "Oberflächenvergrößerung",
  prompt:
    "Zerteile einen Würfel aus Knete (Kantenlänge 4 cm). Die Menge bleibt gleich, aber was passiert mit der Oberfläche?",
  init: () => ({ n: "1", example: "", examples: "" }),
  controls: () => [
    {
      type: "choice",
      key: "n",
      label: "Teile pro Kante",
      options: [
        { value: "1", label: "1 Würfel" },
        { value: "2", label: "8 Würfel" },
        { value: "3", label: "27 Würfel" },
        { value: "4", label: "64 Würfel" },
      ],
    },
    {
      type: "choice",
      key: "example",
      label: "Das Prinzip im Körper",
      options: [
        { value: "zotten", label: "Dünndarm" },
        { value: "lunge", label: "Lunge" },
      ],
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    if (key === "example") remember(s, "examples", String(value));
  },
  goals: (s) => [
    { text: "Den Würfel so teilen, dass sich die Oberfläche verdoppelt", met: str(s, "n") === "2" },
    {
      text: "Eine Oberfläche von mindestens 384 cm² erreichen",
      met: cubeSurface(Number(str(s, "n"))) >= 384,
    },
    {
      text: "Das Prinzip im Dünndarm und in der Lunge ansehen",
      met: seen(s, "examples", "zotten") && seen(s, "examples", "lunge"),
    },
  ],
  draw: (s) => {
    const n = Number(str(s, "n"));
    const cubes = cubePieces(n);
    const example = str(s, "example");
    const right =
      example === "zotten"
        ? `<path d="M300 190 ${Array.from({ length: 7 }, (_, i) => `L${310 + i * 26} 190 L${310 + i * 26} 110 Q${323 + i * 26} 92 ${336 + i * 26} 110 L${336 + i * 26} 190`).join(" ")} L490 190" fill="#f6c1b5" stroke="#b5544a" stroke-width="2"/>
           ${labels(395, 70, "Darmzotten falten die\nDünndarmwand vielfach", "lbl small", "middle", 15)}`
        : example === "lunge"
          ? `${Array.from({ length: 9 }, (_, i) => `<circle cx="${350 + (i % 3) * 34}" cy="${120 + Math.floor(i / 3) * 30}" r="17" fill="#f6c1b5" stroke="#b5544a" stroke-width="2"/>`).join("")}
             <path d="M384 40 L384 96" stroke="#b5544a" stroke-width="8"/>
             ${labels(395, 214, "Viele kleine Lungenbläschen\nstatt eines großen Sacks", "lbl small", "middle", 15)}`
          : labels(395, 120, "Wähle ein Beispiel\naus dem Körper.", "lbl small muted", "middle", 16);
    return svg(
      520,
      236,
      `${n ** 3} Würfel mit zusammen ${fmtDe(cubeSurface(n))} Quadratzentimetern Oberfläche`,
      `${panel(8, 8, 256, 220, "panel-bg")}${cubes.join("")}
       ${label(136, 218, `${n ** 3} Würfel · ${fmtDe(cubeSurface(n))} cm²`, "lbl small strong", "middle")}
       ${panel(272, 8, 240, 220, "panel-bg")}${right}`,
    );
  },
  readout: (s) => {
    const n = Number(str(s, "n"));
    return `${n ** 3} Würfel mit je ${fmtDe(4 / n, n === 3 ? 2 : 0)} cm Kantenlänge: Oberfläche ${fmtDe(cubeSurface(n))} cm², das Volumen bleibt 64 cm³. Mehr Oberfläche bedeutet mehr Fläche für den Stoffaustausch.`;
  },
};

/* ---------- Puls und Atmung bei Bewegung ---------- */

/** Beispielwerte eines elfjährigen Kindes; eigene Werte weichen ab. */
export const ACTIVITY: Record<
  string,
  { label: string; pulse: number; breath: number }
> = {
  ruhe: { label: "Ruhe", pulse: 80, breath: 18 },
  gehen: { label: "Gehen", pulse: 100, breath: 24 },
  treppe: { label: "Treppensteigen", pulse: 130, breath: 32 },
  rennen: { label: "Rennen", pulse: 170, breath: 45 },
  erholung: { label: "Eine Minute danach", pulse: 120, breath: 28 },
};

export const activity: LabDef = {
  title: "Puls und Atmung",
  prompt:
    "Wähle eine Tätigkeit. Beobachte, wie sich Herzschlag und Atmung verändern, und überlege, was die Muskelzellen brauchen.",
  init: () => ({ level: "gehen", tried: "" }),
  controls: () => [
    {
      type: "choice",
      key: "level",
      label: "Tätigkeit",
      options: Object.entries(ACTIVITY).map(([value, a]) => ({
        value,
        label: a.label,
      })),
    },
  ],
  set: (s, key, value) => {
    s[key] = value;
    remember(s, "tried", String(value));
  },
  goals: (s) => [
    { text: "Beim Rennen einen Puls über 150 Schläge pro Minute sehen", met: seen(s, "tried", "rennen") },
    { text: "Ruhe und Treppensteigen vergleichen", met: seen(s, "tried", "ruhe") && seen(s, "tried", "treppe") },
    { text: "Nach dem Rennen die Erholung beobachten", met: seen(s, "tried", "rennen") && seen(s, "tried", "erholung") },
  ],
  draw: (s) => {
    const a = ACTIVITY[str(s, "level")];
    const effort = (a.pulse - 80) / 90;
    const flow = 2 + effort * 8;
    return svg(
      520,
      236,
      `${a.label}: Puls ${a.pulse} Schläge und ${a.breath} Atemzüge pro Minute`,
      `${panel(8, 8, 250, 220, "panel-bg")}
       ${label(133, 34, a.label, "lbl strong", "middle")}
       <g transform="translate(76 104) scale(${f1(0.8 + effort * 0.25)})"><path d="M0 -14 C 0 -38, -32 -42, -40 -20 C -48 4, -20 24, 0 42 C 20 24, 48 4, 40 -20 C 32 -42, 0 -38, 0 -14 Z" fill="var(--f-red)"/></g>
       ${labels(76, 172, `Puls\n${a.pulse} pro Minute`, "lbl small strong", "middle", 17)}
       <ellipse cx="190" cy="100" rx="${f1(16 + effort * 6)}" ry="${f1(30 + effort * 6)}" fill="#f6c1b5" stroke="#b5544a"/>
       ${labels(196, 172, `Atmung\n${a.breath} pro Minute`, "lbl small strong", "middle", 17)}
       ${label(133, 214, "Beispielwerte, deine können abweichen", "lbl tiny muted", "middle")}
       ${panel(266, 8, 246, 220, "panel-bg")}
       ${label(389, 34, "Muskelzelle", "lbl strong", "middle")}
       <rect x="360" y="66" width="60" height="78" rx="16" fill="#f4a3a3" stroke="#b5544a" stroke-width="2"/>
       <line x1="278" y1="90" x2="354" y2="90" stroke="var(--f-blue)" stroke-width="${f1(flow)}"/>
       ${label(280, 78, "Sauerstoff", "lbl tiny", "start")}
       <line x1="278" y1="128" x2="354" y2="128" stroke="var(--f-yellow)" stroke-width="${f1(flow)}"/>
       ${label(280, 116, "Traubenzucker", "lbl tiny", "start")}
       <line x1="426" y1="112" x2="504" y2="112" stroke="var(--f-stone)" stroke-width="${f1(flow)}"/>
       ${labels(466, 84, "Kohlenstoff-\ndioxid", "lbl tiny", "middle", 13)}
       ${labels(389, 176, `Zellatmung: ${effort > 0.5 ? "sehr viel" : effort > 0.15 ? "mehr" : "wenig"}\nEnergie wird umgewandelt`, "lbl small strong", "middle", 17)}`,
    );
  },
  readout: (s) => {
    const a = ACTIVITY[str(s, "level")];
    return `${a.label}: etwa ${a.pulse} Herzschläge und ${a.breath} Atemzüge pro Minute (Beispielwerte). Arbeitende Muskelzellen brauchen mehr Sauerstoff und Traubenzucker für die Zellatmung; Herz und Lunge arbeiten schneller, um sie zu versorgen.`;
  },
};

/* ---------- Vereinfachter weiblicher Zyklus ---------- */

export function cyclePhase(day: number, fertilized: boolean): string {
  if (fertilized && day >= 20)
    return "Einnistung: Die befruchtete Eizelle hat sich in die Gebärmutterschleimhaut eingenistet. Eine Schwangerschaft beginnt, die Menstruation bleibt aus.";
  if (fertilized && day >= 15)
    return "Die befruchtete Eizelle teilt sich und wandert durch den Eileiter zur Gebärmutter.";
  if (day <= 5)
    return "Menstruation: Die Gebärmutterschleimhaut löst sich und wird mit etwas Blut ausgeschieden.";
  if (day <= 13)
    return `In einem Eierstock reift eine Eizelle heran. Die Gebärmutterschleimhaut wird neu aufgebaut.${fertilized ? " Eine Befruchtung ist erst nach dem Eisprung möglich." : ""}`;
  if (day === 14)
    return "Eisprung: Die reife Eizelle wird aus dem Eierstock in den Eileiter entlassen.";
  return "Die Eizelle wandert durch den Eileiter. Wird sie nicht befruchtet, geht sie zugrunde; die dicke Schleimhaut wird mit der nächsten Menstruation abgestoßen.";
}

export const cycle: LabDef = {
  title: "Der weibliche Zyklus",
  prompt:
    "Fahre durch einen Zyklus von 28 Tagen. Zyklen sind unterschiedlich lang, besonders in den ersten Jahren nach der ersten Menstruation.",
  init: () => ({ day: 8, fertilized: false }),
  controls: () => [
    {
      type: "range",
      key: "day",
      label: "Zyklustag",
      min: 1,
      max: 28,
      step: 1,
      format: (v) => `Tag ${fmtDe(v)}`,
    },
    {
      type: "toggle",
      key: "fertilized",
      label: "Befruchtung nach dem Eisprung",
    },
  ],
  goals: (s) => [
    { text: "Den Eisprung finden", met: num(s, "day") === 14 },
    { text: "Die Tage der Menstruation finden", met: num(s, "day") <= 5 },
    {
      text: "Befruchtung einschalten und die Einnistung beobachten",
      met: s.fertilized === true && num(s, "day") >= 20,
    },
  ],
  draw: (s) => {
    const day = num(s, "day");
    const fert = s.fertilized === true;
    const lining =
      day <= 5 ? 10 - day * 1.2 : day <= 14 ? 4 + (day - 5) * 1.1 : 14 + Math.min(4, (day - 14) * 0.3);
    const angle = ((day - 1) / 28) * Math.PI * 2 - Math.PI / 2;
    const segment = (from: number, to: number, colour: string) => {
      const a0 = ((from - 1) / 28) * Math.PI * 2 - Math.PI / 2;
      const a1 = (to / 28) * Math.PI * 2 - Math.PI / 2;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      return `<path d="M${f1(110 + 80 * Math.cos(a0))} ${f1(118 + 80 * Math.sin(a0))} A80 80 0 ${large} 1 ${f1(110 + 80 * Math.cos(a1))} ${f1(118 + 80 * Math.sin(a1))}" fill="none" stroke="${colour}" stroke-width="18"/>`;
    };
    // Weg der Eizelle: Eierstock (links) → Eileiter → Gebärmutter (Mitte).
    const egg =
      day < 14
        ? { x: 262, y: 120 }
        : day === 14
          ? { x: 282, y: 100 }
          : fert && day >= 20
            ? { x: 384, y: 150 - lining }
            : { x: 290 + Math.min(70, (day - 14) * 12), y: 92 };
    const eggVisible = fert || day <= 24;
    return svg(
      520,
      236,
      `Zyklustag ${day}${fert ? " mit Befruchtung" : ""}: Gebärmutterschleimhaut und Weg der Eizelle`,
      `${panel(8, 8, 214, 220, "panel-bg")}
       ${segment(1, 5, "var(--f-red)")}${segment(6, 13, "var(--f-pink)")}${segment(14, 14, "var(--f-orange)")}${segment(15, 28, "var(--f-purple)")}
       <circle cx="${f1(110 + 80 * Math.cos(angle))}" cy="${f1(118 + 80 * Math.sin(angle))}" r="11" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
       ${label(110, 114, `Tag ${day}`, "lbl strong", "middle")}
       ${label(110, 134, day <= 5 ? "Menstruation" : day === 14 ? "Eisprung" : day < 14 ? "Reifung" : fert ? "Befruchtet" : "Eileiter", "lbl small", "middle")}
       ${panel(230, 8, 282, 220, "panel-bg")}
       <path d="M330 70 Q384 60 438 70 L420 160 Q384 190 348 160 Z" fill="#f9d3d0" stroke="#b5544a" stroke-width="2"/>
       <path d="M${f1(338 + lining * 0.2)} ${f1(80)} Q384 ${f1(74 + lining * 0.3)} ${f1(430 - lining * 0.2)} 80 L${f1(414 - lining * 0.3)} ${f1(156 - lining * 0.4)} Q384 ${f1(178 - lining)} ${f1(354 + lining * 0.3)} ${f1(156 - lining * 0.4)} Z" fill="${day <= 5 ? "var(--f-red)" : "#e88b8b"}" opacity="0.75"/>
       <path d="M330 74 Q300 70 286 96" fill="none" stroke="#b5544a" stroke-width="6" stroke-linecap="round"/>
       <path d="M438 74 Q468 70 482 96" fill="none" stroke="#b5544a" stroke-width="6" stroke-linecap="round"/>
       <ellipse cx="262" cy="120" rx="18" ry="12" fill="#f3c6a5" stroke="#b5544a"/>
       <ellipse cx="506" cy="120" rx="18" ry="12" fill="#f3c6a5" stroke="#b5544a" transform="translate(-14 0)"/>
       ${eggVisible ? `<circle cx="${f1(egg.x)}" cy="${f1(egg.y)}" r="${fert && day >= 15 ? 7 : 5}" fill="var(--f-yellow)" stroke="var(--f-ink)"/>` : ""}
       ${label(262, 150, "Eierstock", "lbl tiny", "middle")}
       ${label(300, 64, "Eileiter", "lbl tiny", "middle")}
       ${label(384, 206, "Gebärmutter mit Schleimhaut", "lbl tiny", "middle")}`,
    );
  },
  readout: (s) => cyclePhase(num(s, "day"), s.fertilized === true),
};
