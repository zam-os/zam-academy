import { fmt, fmtUnit } from "../exercises/format";
import { LIGHT_MINUTES_PER_AU, marsLongitude, marsMotion, MILLION_KM_PER_AU, PLANETS } from "../lab/physics";
import type { Lesson, Stage } from "../model/types";

const STAGE_ID = "stage-7-astronomie";

// 7.1 Weltbilder ───────────────────────────────────────────────────────────

const weltbilder: Lesson = {
  id: "as-1-weltbilder",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "7.1 Vom geozentrischen zum heliozentrischen Weltbild (Wahl: Astronomie)",
  subtitle: "Warum Mars am Himmel Schleifen zieht und wie Eratosthenes die Erde maß",
  tracks: ["I"],
  lehrplan: "Ph8 LB 4.1 (I, Wahlbereich Astronomie): Entwicklung vom geozentrischen über das heliozentrische zum modernen Weltbild; Orientierung am Himmel",
  whyItMatters:
    "Jahrtausendelang schien die Erde im Mittelpunkt zu ruhen. Wie kam es zu dem Weltbild, das heute in jedem Schulbuch steht, und wer hat es mit welchen Beobachtungen durchgesetzt?",
  explanationHtml: `
    <p><strong>Geozentrisches Weltbild</strong> (Antike, Aristoteles, Ptolemäus): Die Erde ruht im Mittelpunkt, Mond, Sonne und Planeten kreisen um sie, außen sitzen die Fixsterne. Es passt zum Alltag, denn wir spüren die Erdbewegung nicht, und erklärt den Lauf von Sonne und Mond. Die <strong>Planetenschleifen</strong> (Mars bewegt sich zeitweise rückwärts) erklärte man mit zusätzlichen Kreisen (Epizykeln).</p>
    <p><strong>Heliozentrisches Weltbild</strong> (Aristarch, <strong>Kopernikus 1543</strong>): Die Sonne steht im Mittelpunkt, die Erde ist ein Planet. Die Schleifen entstehen ganz einfach, weil die schnellere Erde den äußeren Planeten überholt (wie ein Auto auf der Innenspur). <strong>Kepler</strong> (um 1609) erkannte elliptische Bahnen. <strong>Galilei</strong> (1610) sah mit dem Fernrohr Jupitermonde, Venusphasen und Mondkrater: Beobachtungen, die nicht zum geozentrischen Bild passten. Das führte zum Konflikt mit der Kirche (Prozess 1633).</p>
    <ul>
      <li><strong>Modernes Weltbild:</strong> Die Sonne ist ein Stern am Rand der Milchstraße, die Milchstraße eine von über 100 Milliarden Galaxien. Das Weltall dehnt sich aus und ist etwa 13,8 Milliarden Jahre alt. Raumfahrt (Sputnik 1957, Mondlandung 1969, Voyager, Hubble) liefert neue Daten.</li>
      <li><strong>Eratosthenes</strong> (um 240 v. Chr.) bestimmte den Erdumfang: Zur Sonnenwende fiel in Syene Licht senkrecht in einen Brunnen, in Alexandria warf ein Stab einen Schatten unter 7,2°. Der Winkel 7,2° ist der 50. Teil von 360°, also ist der Erdumfang das 50-fache des Abstands (800 km): etwa 40 000 km.</li>
      <li><strong>Orientierung:</strong> Die Himmelskugel dreht sich scheinbar in 24 Stunden um die Himmelsachse: 15° pro Stunde. Der Polarstern steht fast auf dieser Achse und zeigt nach Norden. Sternkarten und Apps helfen beim Finden von Sternbildern.</li>
    </ul>
    <div class="merke"><strong>Merke:</strong> Neue Beobachtungen (Fernrohr, Raumfahrt) veränderten das Weltbild und damit die Geschichte.</div>
  `,
  formulas: [
    { name: "Erdumfang nach Eratosthenes", html: "U = 360° / α · s", quantities: "α Schattenwinkel, s Abstand der beiden Orte" },
    { name: "Scheinbare Himmelsdrehung", html: "15° pro Stunde", quantities: "360° in 24 h" },
  ],
  quiz: {
    question: "Wodurch unterscheidet sich das heliozentrische vom geozentrischen Weltbild?",
    options: [
      "Im heliozentrischen steht die Sonne im Mittelpunkt, die Erde umkreist sie",
      "Im heliozentrischen steht der Mond im Mittelpunkt",
      "Beide sagen dasselbe und unterscheiden sich nur im Namen",
    ],
    correctIndex: 0,
    explanation: "Geozentrisch heißt: Die Erde ist der Mittelpunkt. Heliozentrisch heißt: Die Sonne ist der Mittelpunkt und die Erde einer der Planeten.",
  },
  lab: {
    kind: "retrograde",
    title: "Labor: Mars am Himmel",
    intro: "Links siehst du die Bahnen von Erde und Mars um die Sonne. Rechts die Richtung, in der Mars am Sternenhimmel erscheint. Um die Opposition (Tag 0) scheint er rückwärts zu laufen.",
    params: [{ type: "range", key: "day", label: "Tage um die Opposition", unit: "d", min: -100, max: 100, step: 10, value: -100 }],
    readouts: [
      { key: "lon", label: "Scheinbare Richtung von Mars", unit: "°", digits: 1, compute: (v) => marsLongitude(v.day) },
      { key: "motion", label: "Bewegung am Himmel", emphasis: true, compute: (v) => marsMotion(v.day) },
    ],
    goals: [
      { id: "rueckwaerts", text: "Finde eine Stellung, in der Mars am Himmel rückläufig erscheint.", check: (_v, r) => r.motion === "rückläufig" },
      { id: "opposition", text: "Stelle die Opposition ein (Tag 0): Die Erde steht zwischen Sonne und Mars, Mars ist uns am nächsten.", check: (v) => v.day === 0 },
      { id: "wieder-vorwaerts", text: "Nach der Schleife (Tag 100) läuft Mars wieder rechtläufig.", check: (v, r) => v.day === 100 && r.motion === "rechtläufig" },
    ],
  },
  exercises: [
    {
      id: "eratosthenes",
      make: (rng, level) => {
        if (level === 1) {
          const [alpha, s] = rng.pick<[number, number]>([[7.2, 800], [9, 1000], [8, 900], [6, 700], [10, 1100]]);
          const U = (360 / alpha) * s;
          return {
            prompt: `Zwei Orte liegen ${fmtUnit(s, "km", 0)} auseinander (auf einem Nord-Süd-Kreis). Zur gleichen Zeit wirft ein senkrechter Stab am einen Ort keinen Schatten, am anderen unter ${fmtUnit(alpha, "°", 1)}. Berechne den Erdumfang nach Eratosthenes.`,
            given: [`s = ${fmtUnit(s, "km", 0)}`, `α = ${fmtUnit(alpha, "°", 1)}`],
            formulaHint: "U = 360° / α · s",
            answer: U,
            unit: "km",
            digits: 0,
            solutionHtml: `360° / ${fmt(alpha, 1)}° = ${fmt(360 / alpha, 1)}<br>U = ${fmt(360 / alpha, 1)} · ${fmt(s, 0)} km = <strong>${fmtUnit(U, "km", 0)}</strong>`,
          };
        }
        const s = rng.pick([500, 800, 1000, 1500]);
        const U = 40_000;
        const alpha = (360 * s) / U;
        return {
          prompt: `Der Erdumfang beträgt etwa ${fmtUnit(U, "km", 0)}. Zwei Orte liegen ${fmtUnit(s, "km", 0)} auseinander. Welchen Winkel zeigen die Schatten senkrechter Stäbe zur gleichen Zeit am Ende dieser Strecke?`,
          given: [`U = ${fmtUnit(U, "km", 0)}`, `s = ${fmtUnit(s, "km", 0)}`],
          answer: alpha,
          unit: "°",
          digits: 1,
          solutionHtml: `α = 360° · s / U = 360° · ${fmt(s, 0)} km / ${fmt(U, 0)} km = <strong>${fmtUnit(alpha, "°", 1)}</strong>`,
        };
      },
    },
    {
      id: "sternspur",
      make: (rng, level) => {
        if (level === 1) {
          const t = rng.pick([1, 2, 3, 4, 6, 8]);
          return {
            prompt: `Die Himmelskugel dreht sich scheinbar in 24 Stunden einmal um 360°. Um wie viele Grad dreht sie sich in ${fmtUnit(t, "h", 0)}?`,
            given: [`t = ${fmtUnit(t, "h", 0)}`, "360° in 24 h"],
            formulaHint: "Winkel = 15° pro Stunde · t",
            answer: 15 * t,
            unit: "°",
            digits: 0,
            solutionHtml: `360° / 24 h = 15° pro Stunde. In ${fmt(t, 0)} h: ${fmt(t, 0)} · 15° = <strong>${fmtUnit(15 * t, "°", 0)}</strong>`,
          };
        }
        const angle = rng.pick([30, 45, 60, 90, 135]);
        return {
          prompt: `Auf einem Langzeitfoto vom Polarstern-Himmel haben die Sterne Spuren von ${fmtUnit(angle, "°", 0)} gezogen. Wie viele Stunden war die Kamera belichtet?`,
          given: [`Spurwinkel ${fmtUnit(angle, "°", 0)}`, "15° pro Stunde"],
          answer: angle / 15,
          unit: "h",
          digits: 1,
          solutionHtml: `t = Winkel / 15° pro Stunde = ${fmt(angle, 0)}° / 15° = <strong>${fmtUnit(angle / 15, "h", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  optional: true,
  celebrationMessage: "Du erklärst die Planetenschleifen mit der überholenden Erde und kennst die Entwicklung der Weltbilder.",
};

// 7.2 Sonnensystem und Milchstraße ─────────────────────────────────────────

const sonnensystem: Lesson = {
  id: "as-2-sonnensystem",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "7.2 Sonnensystem und Milchstraße (Wahl: Astronomie)",
  subtitle: "Abstände in Astronomischen Einheiten, Lichtminuten und Lichtjahren",
  tracks: ["I"],
  lehrplan: "Ph8 LB 4.1 (I, Wahlbereich Astronomie): Aufbau und Phänomene unseres Sonnensystems; Galaxien, insbesondere unsere Milchstraße, Weltall",
  whyItMatters:
    "Das Sonnensystem ist riesig und fast leer. Erst im Modell mit Maßstab wird klar, wie weit die Planeten voneinander entfernt sind und warum Raumsonden Jahre unterwegs sind.",
  explanationHtml: `
    <p><strong>Das Sonnensystem:</strong> Im Mittelpunkt steht die <strong>Sonne</strong>, ein Stern (Durchmesser 1,39 Millionen km, Oberfläche etwa 5500 °C). Sie enthält 99,9 % der Masse des Systems. Um sie kreisen auf fast kreisförmigen Bahnen acht Planeten: die erdähnlichen <strong>Merkur, Venus, Erde, Mars</strong> und die Gasriesen <strong>Jupiter, Saturn, Uranus, Neptun</strong>. Dazu kommen Zwergplaneten (zum Beispiel Pluto), Monde, Asteroiden und Kometen.</p>
    <ul>
      <li>Die <strong>Astronomische Einheit (AE)</strong> ist der mittlere Abstand Erde–Sonne: 1 AE ≈ 150 Millionen km. Das Licht braucht dafür etwa <strong>8,3 Minuten</strong> (Lichtminuten). Jupiter ist 5,2 AE von der Sonne entfernt, Neptun 30 AE.</li>
      <li><strong>Modell mit Maßstab:</strong> Wählt man 1 AE ≙ 1 m (Planetenweg), steht Neptun 30 m von der Sonne, die Erde nur 1 m, die Sonne selbst ist dabei nur ein Ball von 1,4 cm.</li>
      <li><strong>Milchstraße:</strong> unsere Galaxie aus etwa 100 bis 300 Milliarden Sternen, eine Scheibe von etwa <strong>100 000 Lichtjahren</strong> Durchmesser. Die Sonne ist etwa 26 000 Lichtjahre vom Zentrum entfernt und braucht rund 230 Millionen Jahre für einen Umlauf. Die Andromedagalaxie ist 2,5 Millionen Lichtjahre entfernt.</li>
      <li><strong>Sterne:</strong> Sie entstehen aus Gas, leuchten Millionen bis Milliarden Jahre durch Kernfusion. Es gibt Rote Zwerge, Sonnen, Riesen und Weiße Zwerge. Die Sonne ist etwa 4,6 Milliarden Jahre alt.</li>
    </ul>
    <p><strong>Orientierung:</strong> Mit Sternkarten oder Apps findest du Sternbilder, Planeten und den Polarstern.</p>
    <div class="merke"><strong>Merke:</strong> 1 AE ≈ 150 Millionen km ≈ 8,3 Lichtminuten. Im Weltall misst man Entfernungen in Lichtlaufzeit.</div>
  `,
  formulas: [
    { name: "Lichtlaufzeit", html: "t = d / c", quantities: "1 AE ≙ 8,3 Lichtminuten; c = 300 000 km/s" },
    { name: "Modellabstand", html: "Modell = Abstand in AE · Maßstab", quantities: "z. B. 1 AE ≙ 1 m" },
    { name: "Lichtjahr", html: "1 Lichtjahr ≈ 9,5 · 10<sup>12</sup> km", quantities: "" },
  ],
  quiz: {
    question: "Was ist die Milchstraße?",
    options: [
      "Ein Nebel innerhalb unseres Sonnensystems",
      "Unsere Galaxie aus etwa 100 bis 300 Milliarden Sternen, zu der auch die Sonne gehört",
      "Ein anderer Name für das Sonnensystem",
    ],
    correctIndex: 1,
    explanation: "Die Milchstraße ist die Galaxie, in der wir leben. Als helles Band am Nachthimmel sehen wir ihre Scheibe von innen.",
  },
  lab: {
    kind: "solar-scale",
    title: "Labor: Planetenweg",
    intro: "Wähle einen Planeten und einen Maßstab für ein Modell. Das Bild ist nicht maßstäblich (Wurzelskala), die Zahlen stimmen.",
    params: [
      { type: "choice", key: "planet", label: "Planet", options: PLANETS.map((p) => ({ value: p.au, label: `${p.name}, ${fmt(p.au, 2)} AE` })), value: 0.39 },
      { type: "choice", key: "scale", label: "Maßstab", options: [{ value: 1, label: "1 AE ≙ 1 cm" }, { value: 10, label: "1 AE ≙ 10 cm" }, { value: 100, label: "1 AE ≙ 1 m" }], value: 10 },
    ],
    readouts: [
      { key: "mkm", label: "Abstand zur Sonne", unit: "Mio. km", digits: 0, compute: (v) => v.planet * MILLION_KM_PER_AU },
      { key: "lmin", label: "Lichtlaufzeit von der Sonne", unit: "min", digits: 1, emphasis: true, compute: (v) => v.planet * LIGHT_MINUTES_PER_AU },
      { key: "model", label: "Abstand im Modell", unit: "cm", digits: 0, emphasis: true, compute: (v) => v.planet * v.scale },
    ],
    goals: [
      { id: "erde", text: "Wähle die Erde: 1 AE, das Licht braucht 8,3 Minuten.", check: (v) => v.planet === 1 },
      { id: "neptun", text: "Stelle Neptun im Maßstab 1 AE ≙ 1 m ein: Er steht etwa 30 m von der Sonne.", check: (v) => v.planet === 30.1 && v.scale === 100 },
      { id: "jupiter", text: "Wähle Jupiter: Sein Licht braucht gut 43 Minuten von der Sonne.", check: (v, r) => v.planet === 5.2 && Number(r.lmin) > 43 },
    ],
  },
  exercises: [
    {
      id: "modell-massstab",
      make: (rng, level) => {
        if (level === 1) {
          const p = rng.pick(PLANETS.slice(3));
          return {
            prompt: `Beim Planetenweg entspricht 1 AE genau 1 m. In welchem Abstand von der Sonne steht ${p.name} (${fmtUnit(p.au, "AE", 2)})?`,
            given: [`d = ${fmtUnit(p.au, "AE", 2)}`, "1 AE ≙ 1 m"],
            formulaHint: "Modellabstand = Abstand in AE · 1 m",
            answer: p.au,
            unit: "m",
            digits: 2,
            solutionHtml: `${fmt(p.au, 2)} AE · 1 m pro AE = <strong>${fmtUnit(p.au, "m", 2)}</strong>`,
          };
        }
        const scaleCm = rng.pick([10, 20, 25]);
        const p = rng.pick(PLANETS.slice(4));
        const m = (p.au * scaleCm) / 100;
        return {
          prompt: `Du baust ein Modell, in dem 1 AE genau ${fmtUnit(scaleCm, "cm", 0)} entspricht. Wie weit (in Metern) steht ${p.name} (${fmtUnit(p.au, "AE", 2)}) von der Sonne?`,
          given: [`d = ${fmtUnit(p.au, "AE", 2)}`, `1 AE ≙ ${fmtUnit(scaleCm, "cm", 0)}`],
          answer: m,
          unit: "m",
          digits: 2,
          solutionHtml: `${fmt(p.au, 2)} · ${fmt(scaleCm, 0)} cm = ${fmt(p.au * scaleCm, 1)} cm = <strong>${fmtUnit(m, "m", 2)}</strong>`,
        };
      },
    },
    {
      id: "lichtlaufzeit-planet",
      make: (rng, level) => {
        if (level === 1) {
          const p = rng.pick(PLANETS.slice(3));
          const t = p.au * LIGHT_MINUTES_PER_AU;
          return {
            prompt: `Wie viele Lichtminuten ist ${p.name} von der Sonne entfernt (${fmtUnit(p.au, "AE", 2)}; 1 AE entspricht 8,3 Lichtminuten)?`,
            given: [`d = ${fmtUnit(p.au, "AE", 2)}`, "1 AE ≙ 8,3 Lichtminuten"],
            formulaHint: "Lichtminuten = AE · 8,3",
            answer: t,
            unit: "Lichtminuten",
            digits: 1,
            solutionHtml: `${fmt(p.au, 2)} · 8,3 = <strong>${fmtUnit(t, "Lichtminuten", 1)}</strong>`,
          };
        }
        const au = rng.pick([5.2, 9.54, 19.2, 30.1]);
        const h = (2 * au * LIGHT_MINUTES_PER_AU) / 60;
        return {
          prompt: `Eine Raumsonde ist ${fmtUnit(au, "AE", 2)} von der Erde entfernt (vereinfacht). Wie viele Stunden dauert es, bis ihre Antwort auf einen Funkbefehl (hin und zurück, mit Lichtgeschwindigkeit) bei uns eintrifft? 1 AE entspricht 8,3 Lichtminuten.`,
          given: [`d = ${fmtUnit(au, "AE", 2)}`, "1 AE ≙ 8,3 Lichtminuten"],
          answer: h,
          unit: "h",
          digits: 1,
          solutionHtml: `Hinweg: ${fmt(au, 2)} · 8,3 min = ${fmt(au * LIGHT_MINUTES_PER_AU, 1)} min; hin und zurück das Doppelte: ${fmt(2 * au * LIGHT_MINUTES_PER_AU, 1)} min = <strong>${fmtUnit(h, "h", 1)}</strong>`,
        };
      },
    },
  ],
  requiredCorrect: 3,
  optional: true,
  celebrationMessage: "Du rechnest mit Astronomischen Einheiten, Lichtminuten und Modellmaßstäben und ordnest die Milchstraße ein.",
};

export const STAGE_ASTRONOMIE: Stage = {
  id: STAGE_ID,
  stageNumber: 7,
  title: "Wahlbereich Astronomie",
  subtitle: "Weltbilder, Sonnensystem und Milchstraße",
  icon: "🔭",
  accent: "#4f46e5",
  badgeTitle: "Sternenforscher",
  lehrplanLabel: "Ph8 LB 4.1 (I, Wahlbereich)",
  lessons: [weltbilder, sonnensystem],
};
