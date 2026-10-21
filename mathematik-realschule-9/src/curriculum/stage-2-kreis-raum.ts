import { fmt, fmtUnit, frac, sqrtHtml } from "../exercises/format";
import { coneSlant, spilled, spitzVolume } from "../lab/views-kreis-raum";
import type { ExerciseTask, Lesson, Stage } from "../model/types";
import { choiceField, near, numberField, within, yesNo } from "./helpers";

const STAGE_ID = "stage-2-kreis-raum";
const KREIS = "M9 LB 4 (I) · M9 LB 4 (II/III): Kreis";
const RAUM = "M9 LB 5 (I): Raumgeometrie";
const PI = Math.PI;

// 2.1 Kreiszahl π ────────────────────────────────────────────────────────────

const kreiszahl: Lesson = {
  id: "kr-1-kreiszahl",
  stageId: STAGE_ID,
  stepNumber: 1,
  title: "2.1 Umfang und die Kreiszahl π",
  subtitle: "Ein Rad abrollen und π mit Vielecken einkreisen",
  tracks: ["I", "II_III"],
  lehrplan: `${KREIS}, Kreiszahl π und Kreisumfang`,
  whyItMatters:
    "Jedes Rad, jeder Reifen und jede runde Laufbahn hängt am selben Zusammenhang: Der Umfang ist immer gut dreimal so lang wie der Durchmesser. Diese Zahl heißt π.",
  explanationHtml: `
    <p>Rollt ein Rad einmal ab, legt es genau seinen <strong>Umfang u</strong> zurück. Misst man bei vielen Kreisen Umfang und Durchmesser, ist das Verhältnis immer dasselbe:</p>
    <p class="formula-line">${frac("u", "d")} = π ≈ 3,14159…</p>
    <ul>
      <li>Daraus folgt <strong>u = π · d = 2 · π · r</strong>, denn d = 2r.</li>
      <li>π ist eine <strong>irrationale Zahl</strong>: unendlich viele Nachkommastellen, ohne Periode. Zum Rechnen nimmst du die π-Taste oder 3,14.</li>
      <li><strong>Archimedes</strong> (um 250 v. Chr.) zeichnete Vielecke innerhalb und außerhalb des Kreises. Der Kreisumfang liegt zwischen ihren Umfängen. Mit 96-Ecken fand er 3 ${frac(10, 71)} &lt; π &lt; 3 ${frac(1, 7)}.</li>
    </ul>
    <div class="example">Beispiel: Ein Rad mit d = 60 cm rollt bei einer Umdrehung u = π · 60 cm ≈ 188,5 cm weit.</div>
    <div class="merke"><strong>Merke:</strong> u = π · d = 2πr. Umgekehrt: d = u : π und r = u : (2π).</div>
  `,
  formulas: [
    { name: "Kreisumfang", html: "u = π · d = 2 · π · r", quantities: "d Durchmesser, r Radius, π ≈ 3,14159" },
    { name: "Kreiszahl", html: `π = ${frac("u", "d")}`, quantities: "für jeden Kreis dieselbe Zahl" },
  ],
  quiz: {
    question: "Ein Rad mit 50 cm Durchmesser rollt genau eine Umdrehung. Wie weit kommt es?",
    options: ["50 cm", "etwa 157 cm", "etwa 314 cm"],
    correctIndex: 1,
    explanation: "Bei einer Umdrehung rollt das Rad seinen Umfang ab: u = π · 50 cm ≈ 157 cm.",
  },
  lab: {
    kind: "wheel",
    title: "Labor: Rad und Vielecke",
    intro: "Ziehe das Rad, es rollt ab und hinterlässt seinen Umfang als Strecke. Im zweiten Versuch kreisen Vielecke π ein wie bei Archimedes.",
    params: [
      { type: "choice", key: "exp", label: "Versuch", options: [{ value: 0, label: "Rad abrollen" }, { value: 1, label: "Vielecke (Archimedes)" }], value: 0 },
      { type: "range", key: "d", label: "Durchmesser d", unit: "cm", min: 5, max: 40, step: 0.1, value: 12, digits: 1, showIf: (v) => v.exp === 0 },
      { type: "range", key: "t", label: "Abgerollt", unit: "%", min: 0, max: 100, step: 1, value: 0, showIf: (v) => v.exp === 0 },
      { type: "choice", key: "n", label: "Ecken", options: [6, 12, 24, 48, 96].map((n) => ({ value: n, label: `${n}-Eck` })), value: 6, showIf: (v) => v.exp === 1 },
    ],
    readouts: [
      { key: "u", label: "Umfang u = π · d", unit: "cm", digits: 2, emphasis: true, compute: (v) => PI * v.d },
      { key: "ratio", label: "u : d", digits: 5, compute: () => PI },
      { key: "low", label: "Umfang innen (d = 1)", digits: 5, compute: (v) => v.n * Math.sin(PI / v.n) },
      { key: "high", label: "Umfang außen (d = 1)", digits: 5, compute: (v) => v.n * Math.tan(PI / v.n) },
    ],
    goals: [
      { id: "ein-meter", text: "Baue ein Rad, das bei einer Umdrehung 1 m weit rollt (±0,5 %).", check: (_v, r) => near(Number(r.u), 100, 0.005) },
      { id: "abgerollt", text: "Rolle ein Rad mit d = 10 cm genau einmal ab und lies den Umfang ab.", check: (v) => v.exp === 0 && v.d === 10 && v.t === 100 },
      {
        id: "archimedes",
        text: "Kreise π mit Vielecken so ein, dass die Lücke kleiner als 0,01 ist.",
        check: (v, r) => v.exp === 1 && Number(r.high) - Number(r.low) < 0.01,
      },
    ],
  },
  exercises: [
    {
      id: "umfang",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const useRadius = rng.next() < 0.5;
          const value = rng.stepped(2, 30, 0.5);
          const u = useRadius ? 2 * PI * value : PI * value;
          return {
            prompt: `Ein Kreis hat ${useRadius ? `den Radius r = ${fmt(value, 1)} cm` : `den Durchmesser d = ${fmt(value, 1)} cm`}. Berechne seinen Umfang.`,
            given: [useRadius ? `r = ${fmtUnit(value, "cm", 1)}` : `d = ${fmtUnit(value, "cm", 1)}`],
            formulaHint: useRadius ? "u = 2 · π · r" : "u = π · d",
            fields: [
              numberField("u =", u, "cm", 2, {
                slips: useRadius
                  ? [{ value: PI * value, hint: "Mit dem Radius gilt u = 2πr: Das Doppelte fehlt." }, { value: PI * value * value, hint: "Das ist der Flächeninhalt πr². Gesucht ist der Umfang 2πr." }]
                  : [{ value: 2 * PI * value, hint: "d ist schon der Durchmesser: u = π · d, ohne die 2." }],
              }),
            ],
            steps: [useRadius ? `u = 2 · π · ${fmt(value, 1)} cm` : `u = π · ${fmt(value, 1)} cm`, `u ≈ <strong>${fmtUnit(u, "cm")}</strong>`],
          };
        }
        if (rng.next() < 0.5) {
          const d = rng.pick([50, 55, 60, 65, 70]);
          const km = rng.pick([1, 2, 5]);
          const turns = (km * 100_000) / (PI * d);
          return {
            prompt: `Ein Fahrradreifen hat einen Durchmesser von ${d} cm. Wie oft dreht sich das Rad auf einer ${km} km langen Strecke? Runde auf ganze Umdrehungen.`,
            given: [`d = ${d} cm`, `Strecke ${km} km`],
            fields: [numberField("Umdrehungen ≈", turns, "", 0, { absTolerance: 1.01, slips: [{ value: (km * 100_000) / d, hint: "Pro Umdrehung rollt das Rad seinen Umfang π · d ab, nicht den Durchmesser." }] })],
            steps: [`u = π · ${d} cm ≈ ${fmtUnit(PI * d, "cm", 1)}`, `${km} km = ${fmt(km * 100_000, 0)} cm`, `${fmt(km * 100_000, 0)} cm : ${fmt(PI * d, 2)} cm ≈ <strong>${fmt(turns, 0)} Umdrehungen</strong>`],
          };
        }
        const u = rng.pick([400, 300, 250, 200]);
        const d = u / PI;
        return {
          prompt: `Eine kreisrunde Laufbahn ist auf der Innenkante ${u} m lang. Wie groß ist ihr Durchmesser?`,
          given: [`u = ${u} m`],
          fields: [numberField("d =", d, "m", 1, { slips: [{ value: u / (2 * PI), hint: "Das ist der Radius. Gefragt ist der Durchmesser d = u : π." }] })],
          steps: [`u = π · d, also d = u : π`, `d = ${u} m : π ≈ <strong>${fmtUnit(d, "m", 1)}</strong>`],
        };
      },
    },
    {
      id: "radius-aus-umfang",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const u = rng.stepped(10, 120, 0.5);
          const r = u / (2 * PI);
          return {
            prompt: `Ein Kreis hat den Umfang u = ${fmt(u, 1)} cm. Berechne seinen Radius.`,
            given: [`u = ${fmtUnit(u, "cm", 1)}`],
            formulaHint: "r = u : (2 · π)",
            fields: [numberField("r =", r, "cm", 2, { slips: [{ value: u / PI, hint: "Das ist der Durchmesser. Der Radius ist halb so groß: r = u : (2π)." }] })],
            steps: [`u = 2πr, also r = u : (2π)`, `r = ${fmt(u, 1)} cm : (2π) ≈ <strong>${fmtUnit(r, "cm")}</strong>`],
          };
        }
        const gate = rng.pick([0.7, 0.8, 0.9, 1]);
        // A diameter within 1 cm of the gate would let rounding to cm decide
        // the answer, so draw again until the gap is clear.
        let u = rng.stepped(1.8, 3.2, 0.1);
        while (Math.abs(u / PI - gate) < 0.01) u = rng.stepped(1.8, 3.2, 0.1);
        const d = u / PI;
        return {
          prompt: `Ein Baumstamm hat einen Umfang von ${fmt(u, 1)} m. Er soll durch ein Tor, das ${fmt(gate * 100, 0)} cm breit ist. Wie dick ist der Stamm, und passt er hindurch?`,
          given: [`Umfang ${fmtUnit(u, "m", 1)}`, `Torbreite ${fmt(gate * 100, 0)} cm`],
          fields: [numberField("d =", d, "m", 2), yesNo("passt?", d < gate)],
          steps: [`d = u : π = ${fmt(u, 1)} m : π ≈ ${fmtUnit(d, "m")}`, `<strong>${fmtUnit(d, "m")}</strong>: ${d < gate ? `schmaler als das Tor (${fmt(gate, 2)} m), er passt` : `breiter als das Tor (${fmt(gate, 2)} m), er passt nicht`}.`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weißt, warum u : d immer π ist, und rechnest Umfang, Radius und Durchmesser ineinander um.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=eASZX0ocAc8",
    title: "Kreis - Umfang und Flächeninhalt berechnen",
    author: "Lehrerschmidt",
  },
};

// 2.2 Kreisfläche ────────────────────────────────────────────────────────────

const kreisflaeche: Lesson = {
  id: "kr-2-kreisflaeche",
  stageId: STAGE_ID,
  stepNumber: 2,
  title: "2.2 Flächeninhalt des Kreises",
  subtitle: "Eine Pizza in ein Rechteck verwandeln",
  tracks: ["I", "II_III"],
  lehrplan: `${KREIS}, Flächeninhalt von Kreis und Kreisring`,
  whyItMatters:
    "Wie viel Pizza bekommst du fürs Geld, wie viel Rasen deckt ein Sprenger ab, wie viel Farbe braucht ein rundes Schild? Immer geht es um den Flächeninhalt πr².",
  explanationHtml: `
    <p>Schneidet man einen Kreis in viele gleiche Stücke und legt sie abwechselnd nach oben und unten nebeneinander, entsteht fast ein Rechteck: Seine <strong>Breite ist der halbe Umfang π · r</strong>, seine <strong>Höhe der Radius r</strong>. Je mehr Stücke, desto genauer. Daraus folgt:</p>
    <p class="formula-line"><strong>A = π · r · r = π · r²</strong></p>
    <ul>
      <li>Ist der Durchmesser gegeben, zuerst halbieren: r = d : 2.</li>
      <li>Der Radius steht im Quadrat: <strong>doppelter Radius, vierfache Fläche</strong>.</li>
      <li>Ein <strong>Kreisring</strong> (zwischen den Radien R und r) hat A = π · (R² − r²).</li>
    </ul>
    <div class="example">Beispiel: Eine Pizza mit 30 cm Durchmesser hat r = 15 cm und A = π · 15² cm² ≈ 707 cm².</div>
    <div class="merke"><strong>Merke:</strong> Umfang 2πr (Länge, cm), Fläche πr² (cm²). Nicht verwechseln.</div>
  `,
  formulas: [
    { name: "Kreisfläche", html: "A = π · r²", quantities: "r Radius; mit Durchmesser: r = d : 2" },
    { name: "Kreisring", html: "A = π · (R² − r²)", quantities: "R äußerer, r innerer Radius" },
  ],
  quiz: {
    question: "Wie ändert sich der Flächeninhalt eines Kreises, wenn der Radius verdoppelt wird?",
    options: ["Er verdoppelt sich", "Er vervierfacht sich", "Er verachtfacht sich"],
    correctIndex: 1,
    explanation: "A = πr²: Mit 2r wird (2r)² = 4r², die Fläche also viermal so groß.",
  },
  lab: {
    kind: "pizza",
    title: "Labor: Die Pizza wird zum Rechteck",
    intro: "Schneide den Kreis in Stücke und lege sie um. Am Rand des Kreises kannst du den Radius ziehen; oben links ist zum Vergleich ein Kreis mit r = 2 cm.",
    params: [
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 1, max: 6, step: 0.5, value: 2.5, digits: 1 },
      { type: "choice", key: "n", label: "Stücke", options: [4, 8, 16, 32, 64].map((n) => ({ value: n, label: `${n} Stücke` })), value: 8 },
      { type: "range", key: "t", label: "Umlegen", unit: "%", min: 0, max: 100, step: 1, value: 0 },
    ],
    readouts: [
      { key: "A", label: "Flächeninhalt A = πr²", unit: "cm²", digits: 2, emphasis: true, compute: (v) => PI * v.r * v.r },
      { key: "width", label: "Breite des Rechtecks ≈ πr", unit: "cm", digits: 2, compute: (v) => PI * v.r },
      { key: "ratio", label: "A im Vergleich zum Kreis mit r = 2", digits: 2, compute: (v) => (v.r * v.r) / 4 },
    ],
    goals: [
      { id: "fast-rechteck", text: "Lege mindestens 32 Stücke ganz um: Die Form ist fast ein Rechteck mit Breite πr und Höhe r.", check: (v) => v.n >= 32 && v.t === 100 },
      { id: "vierfach", text: "Mache die Fläche genau viermal so groß wie die des grauen Vergleichskreises.", check: (_v, r) => within(Number(r.ratio), 4, 1e-9) },
      { id: "achtundzwanzig", text: "Stelle einen Kreis mit etwa 28 cm² Fläche ein (±0,5 cm²).", check: (_v, r) => within(Number(r.A), 28, 0.5) },
    ],
  },
  exercises: [
    {
      id: "kreisflaeche",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const useDiameter = rng.next() < 0.5;
          const value = rng.stepped(2, 24, 0.5);
          const r = useDiameter ? value / 2 : value;
          const A = PI * r * r;
          return {
            prompt: `Berechne den Flächeninhalt eines Kreises mit ${useDiameter ? `dem Durchmesser d = ${fmt(value, 1)} cm` : `dem Radius r = ${fmt(value, 1)} cm`}.`,
            given: [useDiameter ? `d = ${fmtUnit(value, "cm", 1)}` : `r = ${fmtUnit(value, "cm", 1)}`],
            formulaHint: useDiameter ? "r = d : 2, dann A = π · r²" : "A = π · r²",
            fields: [
              numberField("A =", A, "cm²", 2, {
                slips: [
                  ...(useDiameter ? [{ value: PI * value * value, hint: "Du hast mit dem Durchmesser gerechnet. Halbiere zuerst: r = d : 2." }] : []),
                  { value: 2 * PI * r, hint: "Das ist der Umfang. Für die Fläche wird r quadriert: A = πr²." },
                ],
              }),
            ],
            steps: [useDiameter ? `r = ${fmt(value, 1)} cm : 2 = ${fmtUnit(r, "cm", 2)}` : `A = π · r² = π · (${fmt(r, 2)} cm)²`, `A = π · ${fmt(r * r, 4)} cm² ≈ <strong>${fmtUnit(A, "cm²")}</strong>`],
          };
        }
        const small = rng.pick([24, 26, 28, 30]);
        const big = small + rng.pick([6, 8, 10]);
        const priceSmall = rng.pick([7, 7.5, 8, 8.5]);
        const priceBig = Number((priceSmall * ((big / small) ** 2) * rng.pick([0.85, 0.95, 1.08, 1.2])).toFixed(1));
        const more = ((big / small) ** 2 - 1) * 100;
        const cheaperBig = priceBig / (big * big) < priceSmall / (small * small);
        return {
          prompt: `Eine Pizza mit ${small} cm Durchmesser kostet ${fmt(priceSmall, 2)} €, eine mit ${big} cm Durchmesser kostet ${fmt(priceBig, 2)} €. Wie viel Prozent mehr Fläche hat die große Pizza? Welche ist pro cm² günstiger?`,
          given: [`klein: d = ${small} cm, ${fmt(priceSmall, 2)} €`, `groß: d = ${big} cm, ${fmt(priceBig, 2)} €`],
          fields: [
            numberField("mehr Fläche:", more, "%", 1, { slips: [{ value: (big / small - 1) * 100, hint: "So viel größer ist der Durchmesser. Die Fläche wächst mit dem Quadrat: (d₂ : d₁)²." }] }),
            choiceField("günstiger pro cm²", ["klein", "groß"], cheaperBig ? 1 : 0),
          ],
          steps: [
            `A klein = π · ${small / 2}² ≈ ${fmtUnit(PI * (small / 2) ** 2, "cm²", 0)}, A groß = π · ${big / 2}² ≈ ${fmtUnit(PI * (big / 2) ** 2, "cm²", 0)}`,
            `Verhältnis (${big} : ${small})² ≈ ${fmt((big / small) ** 2, 3)}, also ${fmt(more, 1)} % mehr.`,
            `Preis je 100 cm²: klein ${fmt((priceSmall / (PI * (small / 2) ** 2)) * 100, 3)} €, groß ${fmt((priceBig / (PI * (big / 2) ** 2)) * 100, 3)} €.`,
            `<strong>${fmt(more, 1)} % mehr Fläche, die ${cheaperBig ? "große" : "kleine"} ist günstiger</strong>.`,
          ],
        };
      },
    },
    {
      id: "kreisring",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 8, 0.5);
          const R = r + rng.stepped(1, 6, 0.5);
          const A = PI * (R * R - r * r);
          return {
            prompt: `Ein Kreisring hat den Außenradius R = ${fmt(R, 1)} cm und den Innenradius r = ${fmt(r, 1)} cm. Berechne seinen Flächeninhalt.`,
            given: [`R = ${fmtUnit(R, "cm", 1)}`, `r = ${fmtUnit(r, "cm", 1)}`],
            formulaHint: "A = π · (R² − r²)",
            fields: [numberField("A =", A, "cm²", 2, { slips: [{ value: PI * (R - r) ** 2, hint: "Nicht (R − r)², sondern R² − r²: große Kreisfläche minus kleine Kreisfläche." }] })],
            steps: [`A = π · (${fmt(R, 1)}² − ${fmt(r, 1)}²) = π · ${fmt(R * R - r * r, 2)}`, `A ≈ <strong>${fmtUnit(A, "cm²")}</strong>`],
          };
        }
        const pond = rng.stepped(2, 6, 0.5);
        const path = rng.pick([0.8, 1, 1.2, 1.5]);
        const A = PI * ((pond + path) ** 2 - pond ** 2);
        return {
          prompt: `Ein kreisrunder Teich mit ${fmt(pond * 2, 0)} m Durchmesser bekommt rundherum einen ${fmt(path, 1)} m breiten Kiesweg. Wie viel Fläche hat der Weg?`,
          given: [`Teich: d = ${fmt(pond * 2, 0)} m`, `Wegbreite ${fmtUnit(path, "m", 1)}`],
          fields: [numberField("A =", A, "m²", 2, { slips: [{ value: PI * ((2 * pond + path) ** 2 - (2 * pond) ** 2), hint: "Rechne mit den Radien, nicht mit dem Durchmesser des Teichs." }] })],
          steps: [`Innenradius r = ${fmt(pond, 1)} m, Außenradius R = ${fmt(pond, 1)} m + ${fmt(path, 1)} m = ${fmt(pond + path, 1)} m`, `A = π · (${fmt(pond + path, 1)}² − ${fmt(pond, 1)}²) ≈ <strong>${fmtUnit(A, "m²")}</strong>`],
        };
      },
    },
    {
      id: "radius-aus-flaeche",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const A = rng.int(10, 400);
          const r = Math.sqrt(A / PI);
          return {
            prompt: `Ein Kreis hat den Flächeninhalt A = ${A} cm². Wie groß ist sein Radius?`,
            given: [`A = ${A} cm²`],
            formulaHint: `r = ${sqrtHtml("A : π")}`,
            fields: [numberField("r =", r, "cm", 2, { slips: [{ value: A / PI, hint: "Das ist r². Ziehe noch die Wurzel." }] })],
            steps: [`r² = A : π = ${A} : π ≈ ${fmt(A / PI, 3)}`, `r = ${sqrtHtml(fmt(A / PI, 3))} ≈ <strong>${fmtUnit(r, "cm")}</strong>`],
          };
        }
        const A = rng.pick([0.8, 1, 1.2, 1.5, 2]);
        const d = 2 * Math.sqrt(A / PI);
        return {
          prompt: `Ein runder Esstisch soll eine Tischfläche von ${fmt(A, 1)} m² haben. Welchen Durchmesser muss die Platte haben?`,
          given: [`A = ${fmtUnit(A, "m²", 1)}`],
          fields: [numberField("d =", d, "m", 2, { slips: [{ value: d / 2, hint: "Das ist der Radius. Der Durchmesser ist doppelt so groß." }] })],
          steps: [`r = ${sqrtHtml(`${fmt(A, 1)} : π`)} ≈ ${fmtUnit(d / 2, "m", 3)}`, `d = 2r ≈ <strong>${fmtUnit(d, "m")}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du siehst, warum A = πr² ist, und rechnest mit Kreisen, Kreisringen und Durchmessern.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=LyZaNUNkNQI",
    title: "Flächeninhalt Kreis berechnen",
    author: "Daniel Jung",
  },
};

// 2.3 Kreissektor ────────────────────────────────────────────────────────────

const sektor: Lesson = {
  id: "kr-3-sektor",
  stageId: STAGE_ID,
  stepNumber: 3,
  title: "2.3 Kreisbogen und Kreissektor",
  subtitle: "Ein Tortenstück genau berechnen",
  tracks: ["I", "II_III"],
  lehrplan: `${KREIS}, Kreisbogen und Kreissektor`,
  whyItMatters:
    "Tortenstücke, Scheibenwischer, Rasensprenger und Uhrzeiger überstreichen nur einen Teil des Kreises. Welchen Teil, sagt der Mittelpunktswinkel.",
  explanationHtml: `
    <p>Ein <strong>Kreissektor</strong> (Kreisausschnitt) ist ein Tortenstück des Kreises mit dem <strong>Mittelpunktswinkel α</strong>. Er ist der Anteil ${frac("α", "360°")} des ganzen Kreises, deshalb gilt:</p>
    <ul>
      <li><strong>Bogenlänge:</strong> b = 2πr · ${frac("α", "360°")}</li>
      <li><strong>Sektorfläche:</strong> A = πr² · ${frac("α", "360°")} = ½ · b · r</li>
    </ul>
    <div class="example">Beispiel: α = 90° ist ${frac(90, 360)} = ¼ des Kreises. Bei r = 4 cm: b = 2π · 4 cm · ¼ ≈ 6,28 cm und A = π · 16 cm² · ¼ ≈ 12,57 cm².</div>
    <p>Im Labor findest du einen besonderen Winkel: Ist der Bogen genau so lang wie der Radius, ist α ≈ 57,3°. Diesen Winkel nennt man <strong>1 Radiant</strong>; auf RAD rechnet der Taschenrechner mit dieser Einheit.</p>
    <div class="merke"><strong>Merke:</strong> Erst den Anteil α : 360° bestimmen, dann Umfang oder Fläche des ganzen Kreises damit malnehmen.</div>
  `,
  formulas: [
    { name: "Kreisbogen", html: `b = 2πr · ${frac("α", "360°")}`, quantities: "α Mittelpunktswinkel" },
    { name: "Kreissektor", html: `A = πr² · ${frac("α", "360°")} = ½ · b · r`, quantities: "Anteil α : 360° der Kreisfläche" },
  ],
  quiz: {
    question: "Ein Kreissektor hat den Mittelpunktswinkel 120°. Welcher Anteil der Kreisfläche ist das?",
    options: ["ein Viertel", "ein Drittel", "die Hälfte"],
    correctIndex: 1,
    explanation: "120° : 360° = 1/3. Der Sektor ist ein Drittel des Kreises.",
  },
  lab: {
    kind: "sector",
    title: "Labor: Das Tortenstück",
    intro: "Ziehe den Rand des Sektors. Rechts stehen Anteil, Bogenlänge und Sektorfläche.",
    params: [
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 1, max: 6, step: 0.5, value: 3, digits: 1 },
      { type: "range", key: "alpha", label: "Mittelpunktswinkel α", unit: "°", min: 0, max: 360, step: 1, value: 45 },
    ],
    readouts: [
      { key: "b", label: "Bogenlänge b", unit: "cm", digits: 2, emphasis: true, compute: (v) => 2 * PI * v.r * (v.alpha / 360) },
      { key: "A", label: "Sektorfläche", unit: "cm²", digits: 2, compute: (v) => PI * v.r * v.r * (v.alpha / 360) },
      { key: "share", label: "Anteil α : 360°", digits: 3, compute: (v) => v.alpha / 360 },
    ],
    goals: [
      { id: "viertel", text: "Schneide genau ein Viertel des Kreises aus.", check: (v) => v.alpha === 90 },
      {
        id: "radiant",
        text: "Mache den Bogen genau so lang wie den Radius (±1 %). Wie groß ist α dann?",
        check: (v, r) => v.alpha > 0 && near(Number(r.b) / v.r, 1, 0.01),
      },
      { id: "zehn", text: "Schneide aus einem Kreis mit r = 4 cm ein Stück mit 10 cm² Fläche aus (±1 %).", check: (v, r) => v.r === 4 && near(Number(r.A), 10, 0.01) },
    ],
  },
  exercises: [
    {
      id: "bogen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(2, 15, 0.5);
          const alpha = rng.pick([30, 45, 60, 72, 75, 100, 120, 135, 150, 210, 240, 270]);
          const b = 2 * PI * r * (alpha / 360);
          return {
            prompt: `Ein Kreisbogen hat den Radius r = ${fmt(r, 1)} cm und den Mittelpunktswinkel α = ${alpha}°. Berechne die Bogenlänge.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `α = ${alpha}°`],
            formulaHint: `b = 2πr · ${frac("α", "360°")}`,
            fields: [numberField("b =", b, "cm", 2, { slips: [{ value: PI * r * r * (alpha / 360), hint: "Das ist die Sektorfläche. Für den Bogen nimm den Umfang 2πr." }, { value: PI * r * (alpha / 360), hint: "Der ganze Umfang ist 2πr, nicht πr." }] })],
            steps: [`Anteil: ${alpha}° : 360° = ${fmt(alpha / 360, 4)}`, `b = 2π · ${fmt(r, 1)} cm · ${fmt(alpha / 360, 4)} ≈ <strong>${fmtUnit(b, "cm")}</strong>`],
          };
        }
        const L = rng.stepped(0.8, 3, 0.1);
        const minutes = rng.pick([5, 10, 15, 20, 25, 40, 45]);
        const b = 2 * PI * L * (minutes / 60);
        return {
          prompt: `Der Minutenzeiger einer Turmuhr ist ${fmt(L, 1)} m lang. Welchen Weg legt seine Spitze in ${minutes} Minuten zurück?`,
          given: [`Zeigerlänge ${fmtUnit(L, "m", 1)}`, `${minutes} Minuten`],
          fields: [numberField("Weg =", b, "m", 2, { slips: [{ value: 2 * PI * L, hint: "Das ist eine ganze Runde. In einer Stunde dreht sich der Zeiger einmal, also ist der Anteil Minuten : 60." }] })],
          steps: [`In 60 min dreht sich der Zeiger um 360°, in ${minutes} min um ${minutes * 6}°: Anteil ${minutes}/60.`, `b = 2π · ${fmt(L, 1)} m · ${minutes}/60 ≈ <strong>${fmtUnit(b, "m")}</strong>`],
        };
      },
    },
    {
      id: "sektorflaeche",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(2, 12, 0.5);
          const alpha = rng.pick([20, 36, 40, 45, 60, 80, 90, 120, 144, 160, 200, 300]);
          const A = PI * r * r * (alpha / 360);
          return {
            prompt: `Berechne den Flächeninhalt eines Kreissektors mit r = ${fmt(r, 1)} cm und α = ${alpha}°.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `α = ${alpha}°`],
            formulaHint: `A = πr² · ${frac("α", "360°")}`,
            fields: [numberField("A =", A, "cm²", 2, { slips: [{ value: PI * r * r, hint: "Das ist der ganze Kreis. Nimm nur den Anteil α : 360°." }, { value: 2 * PI * r * (alpha / 360), hint: "Das ist die Bogenlänge. Die Fläche braucht r²." }] })],
            steps: [`Anteil: ${alpha}° : 360° = ${fmt(alpha / 360, 4)}`, `A = π · ${fmt(r * r, 2)} cm² · ${fmt(alpha / 360, 4)} ≈ <strong>${fmtUnit(A, "cm²")}</strong>`],
          };
        }
        const outer = rng.pick([45, 50, 55, 60]);
        const inner = rng.pick([8, 10, 12, 15]);
        const alpha = rng.pick([100, 110, 120, 130]);
        const A = PI * (outer * outer - inner * inner) * (alpha / 360);
        return {
          prompt: `Ein Scheibenwischer dreht sich um ${alpha}°. Sein Wischerblatt reicht von ${inner} cm bis ${outer} cm Abstand vom Drehpunkt. Wie viel Fläche der Scheibe wischt er?`,
          given: [`Drehwinkel ${alpha}°`, `Blatt von ${inner} cm bis ${outer} cm`],
          fields: [numberField("A =", A, "cm²", 0, { slips: [{ value: PI * outer * outer * (alpha / 360), hint: "Innen, nahe am Drehpunkt, wischt das Blatt nicht: Ziehe den kleinen Sektor ab." }] })],
          steps: [
            `Gewischt wird ein Stück Kreisring: großer Sektor minus kleiner Sektor.`,
            `A = π · (${outer}² − ${inner}²) · ${alpha}/360 = π · ${outer * outer - inner * inner} · ${fmt(alpha / 360, 4)}`,
            `A ≈ <strong>${fmtUnit(A, "cm²", 0)}</strong>`,
          ],
        };
      },
    },
    {
      id: "winkel-aus-bogen",
      make: (rng, level): ExerciseTask => {
        const r = rng.int(5, 15);
        const b = rng.stepped(2, 2 * r, 0.5);
        const alpha = (b / (2 * PI * r)) * 360;
        if (level === 1) {
          return {
            prompt: `Ein Kreisbogen mit dem Radius r = ${r} cm ist b = ${fmt(b, 1)} cm lang. Wie groß ist der Mittelpunktswinkel?`,
            given: [`r = ${r} cm`, `b = ${fmtUnit(b, "cm", 1)}`],
            formulaHint: "α = b : (2πr) · 360°",
            fields: [numberField("α =", alpha, "°", 1, { slips: [{ value: b / r, hint: "Das ist der Winkel im Bogenmaß (Radiant). Rechne in Grad: α = b : (2πr) · 360°." }] })],
            steps: [`Anteil: b : (2πr) = ${fmt(b, 1)} : ${fmt(2 * PI * r, 3)} ≈ ${fmt(b / (2 * PI * r), 4)}`, `α ≈ ${fmt(b / (2 * PI * r), 4)} · 360° ≈ <strong>${fmt(alpha, 1)}°</strong>`],
          };
        }
        return {
          prompt: `Eine runde Torte hat ${2 * r} cm Durchmesser. Ein Stück hat am Rand eine ${fmt(b, 1)} cm lange Kruste. Wie groß ist sein Winkel an der Spitze, und wie viele solche Stücke ergäbe die ganze Torte ungefähr?`,
          given: [`d = ${2 * r} cm`, `Krustenlänge ${fmtUnit(b, "cm", 1)}`],
          fields: [numberField("α =", alpha, "°", 1), numberField("Stücke ≈", 360 / alpha, "", 1, { tolerance: 0.03 })],
          steps: [`r = ${r} cm, Umfang 2π · ${r} cm ≈ ${fmtUnit(2 * PI * r, "cm")}`, `α = ${fmt(b, 1)} : ${fmt(2 * PI * r, 2)} · 360° ≈ ${fmt(alpha, 1)}°`, `<strong>α ≈ ${fmt(alpha, 1)}°, also etwa ${fmt(360 / alpha, 1)} Stücke</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest mit dem Anteil α : 360° Bogenlänge und Sektorfläche aus, und du kennst den Radiant.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=lxD29WFIxlM",
    title: "Kreissektor und Bogenlänge berechnen",
    author: "Daniel Jung",
  },
};

// 2.4 Zylinder ───────────────────────────────────────────────────────────────

const zylinder: Lesson = {
  id: "rg-1-zylinder",
  stageId: STAGE_ID,
  stepNumber: 4,
  title: "2.4 Zylinder: abrollen und füllen",
  subtitle: "Die sparsamste Form für eine Dose",
  tracks: ["I"],
  lehrplan: `${RAUM}, Zylinder: Netz, Oberflächeninhalt, Volumen`,
  whyItMatters:
    "Dosen, Rohre, Regenfässer und Litfaßsäulen sind Zylinder. Mit zwei Maßen, Radius und Höhe, kennst du Blechbedarf und Füllmenge.",
  explanationHtml: `
    <p>Ein gerader Kreiszylinder hat zwei gleiche Kreise als <strong>Grundfläche G = πr²</strong> und Deckfläche und dazwischen den <strong>Mantel</strong>. Rollt man den Mantel ab, entsteht ein <strong>Rechteck</strong> mit den Seiten 2πr (Umfang) und h.</p>
    <ul>
      <li><strong>Volumen:</strong> V = G · h = πr² · h</li>
      <li><strong>Mantelfläche:</strong> M = 2πr · h</li>
      <li><strong>Oberfläche:</strong> O = 2 · G + M = 2πr² + 2πrh</li>
    </ul>
    <div class="example">Einheiten: 1 Liter = 1 dm³ = 1000 cm³. Eine Dose mit r = 4 cm und h = 10 cm fasst π · 16 · 10 cm³ ≈ 503 cm³, also gut einen halben Liter.</div>
    <p>Im Labor kannst du suchen, welche 1-Liter-Dose am wenigsten Blech braucht. Es ist die, bei der die Höhe genau so groß ist wie der Durchmesser.</p>
    <div class="merke"><strong>Merke:</strong> Volumen in cm³, Flächen in cm². Für Liter durch 1000 teilen.</div>
  `,
  formulas: [
    { name: "Volumen Zylinder", html: "V = π · r² · h", quantities: "Grundfläche mal Höhe" },
    { name: "Mantel Zylinder", html: "M = 2 · π · r · h", quantities: "abgerollt ein Rechteck 2πr × h" },
    { name: "Oberfläche Zylinder", html: "O = 2πr² + 2πrh", quantities: "zwei Kreise und der Mantel" },
  ],
  quiz: {
    question: "Welche Figur entsteht, wenn man den Mantel eines geraden Kreiszylinders abrollt?",
    options: ["ein Kreis", "ein Rechteck", "ein Kreissektor"],
    correctIndex: 1,
    explanation: "Der Mantel wird zu einem Rechteck: eine Seite ist der Umfang 2πr, die andere die Höhe h.",
  },
  lab: {
    kind: "can",
    title: "Labor: Die Dose",
    intro: "Ziehe den Deckel nach oben oder die Seite nach außen. Wickle die Dose ab, rechts entsteht ihr Netz.",
    params: [
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 1, max: 10, step: 0.1, value: 4, digits: 1 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 1, max: 25, step: 0.1, value: 8, digits: 1 },
      { type: "range", key: "t", label: "Abwickeln", unit: "%", min: 0, max: 100, step: 1, value: 0 },
    ],
    readouts: [
      { key: "V", label: "Volumen V", unit: "cm³", digits: 1, emphasis: true, compute: (v) => PI * v.r * v.r * v.h },
      { key: "M", label: "Mantel M", unit: "cm²", digits: 1, compute: (v) => 2 * PI * v.r * v.h },
      { key: "O", label: "Oberfläche O", unit: "cm²", digits: 1, compute: (v) => 2 * PI * v.r * v.r + 2 * PI * v.r * v.h },
      { key: "litre", label: "Inhalt", unit: "l", digits: 3, compute: (v) => (PI * v.r * v.r * v.h) / 1000 },
    ],
    goals: [
      { id: "liter", text: "Baue eine Dose mit 1 Liter Inhalt (±1 %).", check: (_v, r) => near(Number(r.V), 1000, 0.01) },
      {
        id: "sparsam",
        text: "Baue eine 1-Liter-Dose (±1 %), die höchstens 1 % mehr Blech braucht als die sparsamste: O ≤ 559 cm².",
        check: (_v, r) => near(Number(r.V), 1000, 0.01) && Number(r.O) <= 559.1,
      },
      { id: "quadratisch", text: "Wickle eine Dose ganz ab, deren Mantel ein Quadrat ist (±1 %).", check: (v) => v.t === 100 && near(2 * PI * v.r, v.h, 0.01) },
    ],
  },
  exercises: [
    {
      id: "volumen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 12, 0.5);
          const h = rng.stepped(2, 30, 0.5);
          const V = PI * r * r * h;
          return {
            prompt: `Ein Zylinder hat den Radius r = ${fmt(r, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne sein Volumen.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: "V = π · r² · h",
            fields: [numberField("V =", V, "cm³", 1, { slips: [{ value: 2 * PI * r * h, hint: "Das ist der Mantel. Für das Volumen: Grundfläche πr² mal Höhe." }, { value: PI * (2 * r) ** 2 * h, hint: "Du hast mit dem Durchmesser gerechnet. In πr² steht der Radius." }] })],
            steps: [`G = π · ${fmt(r, 1)}² cm² ≈ ${fmtUnit(PI * r * r, "cm²")}`, `V = G · h ≈ ${fmt(PI * r * r, 2)} cm² · ${fmt(h, 1)} cm ≈ <strong>${fmtUnit(V, "cm³", 1)}</strong>`],
          };
        }
        const d = rng.pick([50, 60, 70, 80]);
        const h = rng.pick([80, 90, 100, 110]);
        const litres = (PI * (d / 2) ** 2 * h) / 1000;
        return {
          prompt: `Ein zylindrisches Regenfass hat innen ${d} cm Durchmesser und ist ${h} cm hoch. Wie viele Liter Wasser fasst es?`,
          given: [`d = ${d} cm`, `h = ${h} cm`, "1 l = 1000 cm³"],
          fields: [numberField("V =", litres, "l", 1, { slips: [{ value: litres * 1000, hint: "Das sind cm³. 1 Liter sind 1000 cm³." }, { value: (PI * d * d * h) / 1000, hint: "Du hast mit dem Durchmesser gerechnet. r = d : 2." }] })],
          steps: [`r = ${d / 2} cm, V = π · ${d / 2}² · ${h} cm³ ≈ ${fmtUnit(litres * 1000, "cm³", 0)}`, `${fmt(litres * 1000, 0)} cm³ : 1000 ≈ <strong>${fmtUnit(litres, "l", 1)}</strong>`],
        };
      },
    },
    {
      id: "oberflaeche",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 10, 0.5);
          const h = rng.stepped(2, 20, 0.5);
          const M = 2 * PI * r * h;
          const O = 2 * PI * r * r + M;
          return {
            prompt: `Ein Zylinder hat r = ${fmt(r, 1)} cm und h = ${fmt(h, 1)} cm. Berechne Mantelfläche und Oberfläche.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: "M = 2πrh, O = 2πr² + M",
            fields: [numberField("M =", M, "cm²", 1), numberField("O =", O, "cm²", 1, { slips: [{ value: PI * r * r + M, hint: "Ein Zylinder hat zwei Kreisflächen, Boden und Deckel: 2πr²." }] })],
            steps: [`M = 2π · ${fmt(r, 1)} · ${fmt(h, 1)} cm² ≈ ${fmtUnit(M, "cm²", 1)}`, `2G = 2π · ${fmt(r, 1)}² cm² ≈ ${fmtUnit(2 * PI * r * r, "cm²", 1)}`, `<strong>M ≈ ${fmtUnit(M, "cm²", 1)}, O ≈ ${fmtUnit(O, "cm²", 1)}</strong>`],
          };
        }
        const d = rng.pick([6.6, 7.4, 8.4, 9.9]);
        const h = rng.pick([9.5, 11, 11.6, 12.2]);
        const M = PI * d * h;
        const O = 2 * PI * (d / 2) ** 2 + M;
        return {
          prompt: `Eine Konservendose ist ${fmt(d, 1)} cm breit und ${fmt(h, 1)} cm hoch. Wie groß ist das Papieretikett, das den Mantel genau umhüllt, und wie viel Blech braucht die ganze Dose (ohne Falze)?`,
          given: [`d = ${fmtUnit(d, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
          fields: [numberField("Etikett =", M, "cm²", 1), numberField("Blech =", O, "cm²", 1)],
          steps: [`Etikett = Mantel = π · d · h = π · ${fmt(d, 1)} · ${fmt(h, 1)} ≈ ${fmtUnit(M, "cm²", 1)}`, `Blech = Mantel + 2 Kreise mit r = ${fmt(d / 2, 2)} cm`, `<strong>Etikett ≈ ${fmtUnit(M, "cm²", 1)}, Blech ≈ ${fmtUnit(O, "cm²", 1)}</strong>`],
        };
      },
    },
    {
      id: "hoehe",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(2, 10, 0.5);
          const V = rng.int(100, 3000);
          const h = V / (PI * r * r);
          return {
            prompt: `Ein Zylinder mit dem Radius r = ${fmt(r, 1)} cm hat das Volumen V = ${V} cm³. Wie hoch ist er?`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `V = ${V} cm³`],
            formulaHint: "h = V : (π · r²)",
            fields: [numberField("h =", h, "cm", 2, { slips: [{ value: V / (PI * r), hint: "Teile durch die ganze Grundfläche π · r², also auch durch r²." }] })],
            steps: [`G = π · ${fmt(r, 1)}² ≈ ${fmtUnit(PI * r * r, "cm²")}`, `h = V : G = ${V} : ${fmt(PI * r * r, 2)} ≈ <strong>${fmtUnit(h, "cm")}</strong>`],
          };
        }
        const d = rng.pick([6, 7, 8, 9]);
        const litres = rng.pick([0.25, 0.3, 0.4, 0.5]);
        const h = (litres * 1000) / (PI * (d / 2) ** 2);
        return {
          prompt: `Ein zylindrisches Glas hat innen ${d} cm Durchmesser. Wie hoch muss es mindestens sein, damit ${fmt(litres, 2)} l hineinpassen?`,
          given: [`d = ${d} cm`, `V = ${fmtUnit(litres, "l", 2)} = ${fmt(litres * 1000, 0)} cm³`],
          fields: [numberField("h =", h, "cm", 1)],
          steps: [`G = π · ${d / 2}² cm² ≈ ${fmtUnit(PI * (d / 2) ** 2, "cm²")}`, `h = ${fmt(litres * 1000, 0)} cm³ : ${fmt(PI * (d / 2) ** 2, 2)} cm² ≈ <strong>${fmtUnit(h, "cm", 1)}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du wickelst Zylinder ab und berechnest Mantel, Oberfläche und Volumen, auch in Litern.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=ZcHfje2Ojo8",
    title: "Zylinder, Kegel, Kugel Körperberechnungen",
    author: "Daniel Jung",
  },
};

// 2.5 Kegel und Pyramide ─────────────────────────────────────────────────────

const kegel: Lesson = {
  id: "rg-2-kegel-pyramide",
  stageId: STAGE_ID,
  stepNumber: 5,
  title: "2.5 Pyramide und Kegel: ein Drittel",
  subtitle: "Dreimal umschütten, dann ist der Zylinder voll",
  tracks: ["I"],
  lehrplan: `${RAUM}, Pyramide und Kegel`,
  whyItMatters:
    "Kirchturmdächer, Eiswaffeln, Zelte und Sandhaufen sind Spitzkörper. Ihr Volumen ist nur ein Drittel der Säule darunter, ihr Mantel lässt sich wieder mit Pythagoras berechnen.",
  explanationHtml: `
    <p><strong>Spitzkörper</strong> wie Pyramide und Kegel laufen von einer Grundfläche G auf eine Spitze zu. Füllt man einen Kegel mit Wasser und schüttet es in einen Zylinder mit gleicher Grundfläche und Höhe, braucht man <strong>genau drei Füllungen</strong>:</p>
    <p class="formula-line"><strong>V = ⅓ · G · h</strong></p>
    <ul>
      <li><strong>Kegel:</strong> V = ⅓ πr²h. Die <strong>Mantellinie</strong> s läuft vom Rand zur Spitze: s = ${sqrtHtml("r² + h²")}. Abgewickelt ist der Mantel ein Kreissektor mit dem Radius s und dem Bogen 2πr, deshalb <strong>M = π · r · s</strong>.</li>
      <li><strong>Quadratische Pyramide</strong> (Grundkante a): V = ⅓ a²h. Die Seitenflächen sind vier Dreiecke mit der <strong>Seitenhöhe</strong> h<sub>s</sub> = ${sqrtHtml("h² + (a/2)²")}, also M = 4 · ½ · a · h<sub>s</sub> = 2a · h<sub>s</sub>.</li>
    </ul>
    <div class="example">Beispiel: Kegel mit r = 5 cm und h = 12 cm: s = ${sqrtHtml("25 + 144")} cm = 13 cm, M = π · 5 · 13 cm² ≈ 204 cm², V = ⅓ π · 25 · 12 cm³ ≈ 314 cm³.</div>
    <div class="merke"><strong>Merke:</strong> Spitzkörper = ⅓ der Säule. Für s und h<sub>s</sub> hilft Pythagoras im Schnitt durch die Spitze.</div>
  `,
  formulas: [
    { name: "Spitzkörper", html: "V = ⅓ · G · h", quantities: "Pyramide und Kegel" },
    { name: "Kegel", html: `V = ⅓ πr²h; s = ${sqrtHtml("r² + h²")}; M = πrs`, quantities: "s Mantellinie" },
    { name: "Quadratische Pyramide", html: `V = ⅓ a²h; h<sub>s</sub> = ${sqrtHtml("h² + (a/2)²")}; M = 2a · h<sub>s</sub>`, quantities: "a Grundkante, h_s Seitenhöhe" },
  ],
  quiz: {
    question: "Ein Kegel und ein Zylinder haben dieselbe Grundfläche und dieselbe Höhe. Wie oft passt der Inhalt des Kegels in den Zylinder?",
    options: ["zweimal", "dreimal", "π-mal"],
    correctIndex: 1,
    explanation: "Das Volumen eines Spitzkörpers ist ⅓ · G · h, ein Drittel der Säule. Also passt er genau dreimal hinein.",
  },
  lab: {
    kind: "cone",
    title: "Labor: Umschütten und Abwickeln",
    intro: "Schütte den Spitzkörper in die Säule daneben. Im zweiten Versuch wickelst du den Mantel ab. Die Spitze kannst du nach oben ziehen.",
    params: [
      { type: "choice", key: "body", label: "Körper", options: [{ value: 0, label: "Kegel und Zylinder" }, { value: 1, label: "Pyramide und Prisma" }], value: 0 },
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 1, max: 6, step: 0.5, value: 3, digits: 1, showIf: (v) => v.body === 0 },
      { type: "range", key: "a", label: "Grundkante a", unit: "cm", min: 1, max: 10, step: 0.5, value: 4, digits: 1, showIf: (v) => v.body === 1 },
      { type: "range", key: "h", label: "Höhe h", unit: "cm", min: 1, max: 12, step: 0.1, value: 6, digits: 1 },
      { type: "range", key: "pours", label: "Füllungen", unit: "×", min: 0, max: 4, step: 1, value: 1, showIf: (v) => v.view === 0 },
      { type: "choice", key: "view", label: "Versuch", options: [{ value: 0, label: "Umschütten" }, { value: 1, label: "Mantel abwickeln" }], value: 0 },
    ],
    readouts: [
      { key: "V", label: "Volumen Spitzkörper ⅓ · G · h", unit: "cm³", digits: 1, emphasis: true, compute: (v) => spitzVolume(v) },
      { key: "Vs", label: "Volumen Säule G · h", unit: "cm³", digits: 1, compute: (v) => 3 * spitzVolume(v) },
      { key: "s", label: "Mantellinie s bzw. Seitenhöhe", unit: "cm", digits: 2, compute: (v) => coneSlant(v) },
      { key: "angle", label: "Winkel des Mantelsektors (Kegel)", unit: "°", digits: 1, compute: (v) => (v.body === 0 ? (360 * v.r) / Math.hypot(v.r, v.h) : "nur beim Kegel") },
    ],
    goals: [
      { id: "voll", text: "Fülle die Säule randvoll, ohne dass etwas überläuft.", check: (v) => v.view === 0 && v.pours === 3 },
      {
        id: "halbkreis",
        text: "Wickle einen Kegelmantel ab, der ein Halbkreis ist (Winkel 180° ± 1°).",
        check: (v, r) => v.body === 0 && v.view === 1 && within(Number(r.angle), 180, 1),
      },
      { id: "eiswaffel", text: "Baue eine Eiswaffel: einen Kegel mit r = 5 cm und der Mantellinie s = 13 cm.", check: (v) => v.body === 0 && v.r === 5 && within(coneSlant(v), 13, 0.01) },
    ],
  },
  exercises: [
    {
      id: "kegel-volumen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 10, 0.5);
          const h = rng.stepped(2, 20, 0.5);
          const V = (PI * r * r * h) / 3;
          return {
            prompt: `Ein Kegel hat den Radius r = ${fmt(r, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne sein Volumen.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: "V = ⅓ · π · r² · h",
            fields: [numberField("V =", V, "cm³", 1, { slips: [{ value: 3 * V, hint: "Das ist der Zylinder. Ein Spitzkörper hat nur ⅓ davon." }] })],
            steps: [`G = π · ${fmt(r, 1)}² ≈ ${fmtUnit(PI * r * r, "cm²")}`, `V = ⅓ · ${fmt(PI * r * r, 2)} · ${fmt(h, 1)} ≈ <strong>${fmtUnit(V, "cm³", 1)}</strong>`],
          };
        }
        const d = rng.pick([3, 4, 5, 6]);
        const h = rng.pick([1.2, 1.5, 1.8, 2]);
        const V = (PI * (d / 2) ** 2 * h) / 3;
        const tons = V * 1.6;
        return {
          prompt: `Ein kegelförmiger Sandhaufen hat unten ${d} m Durchmesser und ist ${fmt(h, 1)} m hoch. Wie viel Sand ist das, und wie schwer ist er (1 m³ Sand wiegt etwa 1,6 t)?`,
          given: [`d = ${d} m`, `h = ${fmtUnit(h, "m", 1)}`, "1 m³ ≈ 1,6 t"],
          fields: [numberField("V =", V, "m³", 2), numberField("Masse =", tons, "t", 2)],
          steps: [`r = ${fmt(d / 2, 1)} m, V = ⅓ · π · ${fmt(d / 2, 1)}² · ${fmt(h, 1)} ≈ ${fmtUnit(V, "m³")}`, `m ≈ ${fmt(V, 2)} · 1,6 t`, `<strong>V ≈ ${fmtUnit(V, "m³")}, m ≈ ${fmtUnit(tons, "t")}</strong>`],
        };
      },
    },
    {
      id: "mantellinie",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 8, 0.5);
          const h = rng.stepped(2, 15, 0.5);
          const s = Math.hypot(r, h);
          const M = PI * r * s;
          return {
            prompt: `Ein Kegel hat r = ${fmt(r, 1)} cm und h = ${fmt(h, 1)} cm. Berechne die Mantellinie s und die Mantelfläche M.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: `s = ${sqrtHtml("r² + h²")}, M = π · r · s`,
            fields: [numberField("s =", s, "cm", 2), numberField("M =", M, "cm²", 1, { slips: [{ value: PI * r * h, hint: "In M = πrs steht die Mantellinie s, nicht die Höhe h." }] })],
            steps: [`s = ${sqrtHtml(`${fmt(r, 1)}² + ${fmt(h, 1)}²`)} ≈ ${fmtUnit(s, "cm")}`, `<strong>s ≈ ${fmtUnit(s, "cm")}, M = π · ${fmt(r, 1)} · ${fmt(s, 2)} ≈ ${fmtUnit(M, "cm²", 1)}</strong>`],
          };
        }
        const r = rng.stepped(2, 5, 0.5);
        const h = rng.stepped(4, 12, 0.5);
        const s = Math.hypot(r, h);
        const M = PI * r * s;
        return {
          prompt: `Ein kegelförmiges Turmdach hat unten ${fmt(2 * r, 0)} m Durchmesser und ist ${fmt(h, 1)} m hoch. Wie viele Quadratmeter Schindeln braucht man, um es zu decken?`,
          given: [`d = ${fmt(2 * r, 0)} m`, `h = ${fmtUnit(h, "m", 1)}`],
          fields: [numberField("M =", M, "m²", 1, { slips: [{ value: PI * r * h, hint: "Die Dachfläche hängt an der schrägen Mantellinie s = √(r² + h²), nicht an h." }, { value: M + PI * r * r, hint: "Den Dachboden deckt man nicht: Nur der Mantel bekommt Schindeln." }] })],
          steps: [`r = ${fmt(r, 1)} m, s = ${sqrtHtml(`${fmt(r, 1)}² + ${fmt(h, 1)}²`)} ≈ ${fmtUnit(s, "m")}`, `M = π · ${fmt(r, 1)} · ${fmt(s, 2)} ≈ <strong>${fmtUnit(M, "m²", 1)}</strong>`],
        };
      },
    },
    {
      id: "pyramide",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const a = rng.stepped(2, 12, 0.5);
          const h = rng.stepped(2, 15, 0.5);
          const V = (a * a * h) / 3;
          return {
            prompt: `Eine quadratische Pyramide hat die Grundkante a = ${fmt(a, 1)} cm und die Höhe h = ${fmt(h, 1)} cm. Berechne ihr Volumen.`,
            given: [`a = ${fmtUnit(a, "cm", 1)}`, `h = ${fmtUnit(h, "cm", 1)}`],
            formulaHint: "V = ⅓ · a² · h",
            fields: [numberField("V =", V, "cm³", 1, { slips: [{ value: a * a * h, hint: "Das ist das Prisma. Eine Pyramide hat ⅓ davon." }] })],
            steps: [`G = a² = ${fmt(a * a, 2)} cm²`, `V = ⅓ · ${fmt(a * a, 2)} · ${fmt(h, 1)} ≈ <strong>${fmtUnit(V, "cm³", 1)}</strong>`],
          };
        }
        const a = rng.pick([2, 2.4, 3, 3.6]);
        const h = rng.pick([1.8, 2, 2.4, 2.8]);
        const hs = Math.hypot(h, a / 2);
        const V = (a * a * h) / 3;
        const M = 2 * a * hs;
        return {
          prompt: `Ein Zelt hat die Form einer quadratischen Pyramide mit ${fmt(a, 1)} m Grundkante und ${fmt(h, 1)} m Höhe. Wie viel Luft ist darin, und wie viel Stoff brauchen die vier Seitenwände?`,
          given: [`a = ${fmtUnit(a, "m", 1)}`, `h = ${fmtUnit(h, "m", 1)}`],
          fields: [numberField("V =", V, "m³", 2), numberField("Stoff =", M, "m²", 2, { slips: [{ value: 2 * a * h, hint: "Die Seitenwände sind schräg: Ihre Höhe ist die Seitenhöhe h_s = √(h² + (a/2)²)." }] })],
          steps: [`V = ⅓ · ${fmt(a, 1)}² · ${fmt(h, 1)} ≈ ${fmtUnit(V, "m³")}`, `h_s = ${sqrtHtml(`${fmt(h, 1)}² + ${fmt(a / 2, 1)}²`)} ≈ ${fmtUnit(hs, "m")}`, `<strong>V ≈ ${fmtUnit(V, "m³")}, Stoff = 2 · ${fmt(a, 1)} · ${fmt(hs, 2)} ≈ ${fmtUnit(M, "m²")}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du weißt, warum ein Spitzkörper ein Drittel der Säule hat, und berechnest Mantellinie und Mantel.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=7KDWxSPxeJ8",
    title: "Kegel - Oberfläche und Mantellinie berechnen",
    author: "Lehrerschmidt",
  },
};

// 2.6 Kugel ──────────────────────────────────────────────────────────────────

const kugel: Lesson = {
  id: "rg-3-kugel",
  stageId: STAGE_ID,
  stepNumber: 6,
  title: "2.6 Kugel: Oberfläche und Volumen",
  subtitle: "Was Archimedes auf seinem Grabstein haben wollte",
  tracks: ["I"],
  lehrplan: `${RAUM}, Kugel`,
  whyItMatters:
    "Bälle, Tropfen, Planeten und Kugellager: Für die Kugel genügt ein einziges Maß, der Radius. Und schon kleine Änderungen am Radius ändern das Volumen kräftig.",
  explanationHtml: `
    <p>Für eine Kugel mit dem Radius r gilt:</p>
    <ul>
      <li><strong>Volumen:</strong> V = ${frac(4, 3)} · π · r³</li>
      <li><strong>Oberfläche:</strong> O = 4 · π · r², so viel wie vier Kreise mit demselben Radius (eine Orangenschale bedeckt vier „Großkreise“).</li>
    </ul>
    <p><strong>Archimedes</strong> fand: Passt eine Kugel genau in einen Zylinder (gleicher Radius, Höhe 2r), dann hat sie <strong>⅔ seines Volumens</strong>, und ihre Oberfläche ist so groß wie sein Mantel. Diese Figur soll er sich für seinen Grabstein gewünscht haben. Im Labor versenkst du die Kugel im randvollen Zylinder: ⅔ des Wassers laufen über, ⅓ bleibt.</p>
    <div class="example">Weil r hoch drei im Volumen steht, hat eine Kugel mit doppeltem Radius das 2³ = <strong>8-fache</strong> Volumen, aber nur die 2² = 4-fache Oberfläche.</div>
    <div class="merke"><strong>Merke:</strong> V = ${frac(4, 3)}πr³ (cm³), O = 4πr² (cm²). Ist der Durchmesser gegeben: erst halbieren.</div>
  `,
  formulas: [
    { name: "Volumen Kugel", html: `V = ${frac(4, 3)} · π · r³`, quantities: "r Radius" },
    { name: "Oberfläche Kugel", html: "O = 4 · π · r²", quantities: "vier Großkreise" },
  ],
  quiz: {
    question: "Wie ändert sich das Volumen einer Kugel, wenn ihr Radius verdoppelt wird?",
    options: ["Es verdoppelt sich", "Es vervierfacht sich", "Es verachtfacht sich"],
    correctIndex: 2,
    explanation: "V = 4/3 πr³: Mit 2r wird (2r)³ = 8r³, das Volumen also achtmal so groß.",
  },
  lab: {
    kind: "sphere",
    title: "Labor: Kugel im Zylinder",
    intro: "Ziehe die Kugel nach unten in den randvollen Zylinder. Das übergelaufene Wasser landet rechts im Messbecher. Oben rechts ist eine Kugel mit r = 2 cm zum Vergleich.",
    params: [
      { type: "range", key: "r", label: "Radius r", unit: "cm", min: 1, max: 8, step: 0.1, value: 3, digits: 1 },
      { type: "range", key: "sink", label: "Eintauchen", unit: "%", min: 0, max: 100, step: 1, value: 0, showIf: (v) => v.view === 0 },
      { type: "choice", key: "view", label: "Ansicht", options: [{ value: 0, label: "Kugel im Zylinder" }, { value: 1, label: "Orangenschale (Oberfläche)" }], value: 0 },
    ],
    readouts: [
      { key: "V", label: "Volumen Kugel", unit: "cm³", digits: 1, emphasis: true, compute: (v) => (4 / 3) * PI * v.r ** 3 },
      { key: "O", label: "Oberfläche Kugel", unit: "cm²", digits: 1, compute: (v) => 4 * PI * v.r ** 2 },
      { key: "spill", label: "übergelaufen", unit: "cm³", digits: 1, compute: (v) => spilled(v.r, v.sink) },
      { key: "ratio", label: "V im Vergleich zur Kugel mit r = 2", digits: 3, compute: (v) => (v.r / 2) ** 3 },
    ],
    goals: [
      { id: "zwei-drittel", text: "Versenke die Kugel ganz: Wie viel des Zylinderwassers läuft über?", check: (v) => v.view === 0 && v.sink === 100 },
      { id: "achtfach", text: "Mache das Volumen genau achtmal so groß wie das der Vergleichskugel.", check: (_v, r) => within(Number(r.ratio), 8, 1e-6) },
      { id: "liter", text: "Stelle eine Kugel mit etwa 1 Liter Volumen ein (±3 %).", check: (_v, r) => near(Number(r.V), 1000, 0.03) },
    ],
  },
  exercises: [
    {
      id: "kugel",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const r = rng.stepped(1, 12, 0.5);
          const V = (4 / 3) * PI * r ** 3;
          const O = 4 * PI * r * r;
          return {
            prompt: `Eine Kugel hat den Radius r = ${fmt(r, 1)} cm. Berechne Volumen und Oberfläche.`,
            given: [`r = ${fmtUnit(r, "cm", 1)}`],
            formulaHint: `V = ${frac(4, 3)} π r³, O = 4πr²`,
            fields: [
              numberField("V =", V, "cm³", 1, { slips: [{ value: (4 / 3) * PI * r * r, hint: "Im Volumen steht r³, nicht r²." }] }),
              numberField("O =", O, "cm²", 1, { slips: [{ value: PI * r * r, hint: "Das ist ein Großkreis. Die Oberfläche ist viermal so groß." }] }),
            ],
            steps: [`r³ = ${fmt(r ** 3, 3)}, r² = ${fmt(r * r, 2)}`, `<strong>V = ${frac(4, 3)}π · ${fmt(r ** 3, 3)} ≈ ${fmtUnit(V, "cm³", 1)}, O = 4π · ${fmt(r * r, 2)} ≈ ${fmtUnit(O, "cm²", 1)}</strong>`],
          };
        }
        const u = rng.pick([68, 69, 70]);
        const r = u / (2 * PI);
        const V = (4 / 3) * PI * r ** 3;
        return {
          prompt: `Ein Fußball hat einen Umfang von ${u} cm. Welches Volumen hat er (in Litern), und wie viel Lederfläche bedeckt seine Oberfläche?`,
          given: [`Umfang ${u} cm`, "1 l = 1000 cm³"],
          fields: [numberField("V =", V / 1000, "l", 2), numberField("O =", 4 * PI * r * r, "cm²", 0)],
          steps: [`r = u : (2π) = ${u} : (2π) ≈ ${fmtUnit(r, "cm", 3)}`, `V = ${frac(4, 3)}π · ${fmt(r, 3)}³ ≈ ${fmtUnit(V, "cm³", 0)}`, `<strong>V ≈ ${fmtUnit(V / 1000, "l")}, O = 4π · ${fmt(r, 3)}² ≈ ${fmtUnit(4 * PI * r * r, "cm²", 0)}</strong>`],
        };
      },
    },
    {
      id: "radius-aus-volumen",
      make: (rng, level): ExerciseTask => {
        if (level === 1) {
          const V = rng.int(30, 5000);
          const r = Math.cbrt((3 * V) / (4 * PI));
          return {
            prompt: `Eine Kugel hat das Volumen V = ${V} cm³. Berechne ihren Radius.`,
            given: [`V = ${V} cm³`],
            formulaHint: `r³ = 3V : (4π), r = ∛(3V : (4π))`,
            fields: [numberField("r =", r, "cm", 2, { slips: [{ value: (3 * V) / (4 * PI), hint: "Das ist r³. Ziehe noch die dritte Wurzel (∛)." }, { value: Math.sqrt((3 * V) / (4 * PI)), hint: "Hier braucht es die dritte Wurzel, nicht die Quadratwurzel." }] })],
            steps: [`r³ = 3 · ${V} : (4π) ≈ ${fmt((3 * V) / (4 * PI), 3)}`, `r = ∛${fmt((3 * V) / (4 * PI), 3)} ≈ <strong>${fmtUnit(r, "cm")}</strong>`],
          };
        }
        const grams = rng.pick([100, 250, 500, 1000, 2000]);
        const density = 7.85;
        const V = grams / density;
        const r = Math.cbrt((3 * V) / (4 * PI));
        return {
          prompt: `Eine Stahlkugel wiegt ${grams} g. Stahl hat die Dichte 7,85 g/cm³. Welchen Durchmesser hat die Kugel?`,
          given: [`m = ${grams} g`, "ρ = 7,85 g/cm³"],
          fields: [numberField("d =", 2 * r, "cm", 2, { slips: [{ value: r, hint: "Das ist der Radius. Der Durchmesser ist doppelt so groß." }] })],
          steps: [`V = m : ρ = ${grams} : 7,85 ≈ ${fmtUnit(V, "cm³", 2)}`, `r = ∛(3V : (4π)) ≈ ${fmtUnit(r, "cm", 3)}`, `<strong>d = 2r ≈ ${fmtUnit(2 * r, "cm")}</strong>`],
        };
      },
    },
  ],
  requiredCorrect: 3,
  celebrationMessage: "Du rechnest Volumen und Oberfläche der Kugel und kennst den Zusammenhang mit dem Zylinder.",
  teacherVideo: {
    url: "https://www.youtube.com/watch?v=ZcHfje2Ojo8",
    title: "Kugel Volumen und Oberflächeninhalt",
    author: "Daniel Jung",
  },
};

export const STAGE_KREIS_RAUM: Stage = {
  id: STAGE_ID,
  stageNumber: 2,
  title: "Kreis und Körper",
  subtitle: "Kreiszahl π, Kreisfläche, Kreissektor; Zylinder, Kegel, Pyramide, Kugel",
  icon: "⭕",
  accent: "#0d9488",
  badgeTitle: "Kreis-und-Körper-Profi",
  lehrplanLabel: "LB 4 Kreis (I und II/III) · LB 5 Raumgeometrie (I)",
  lessons: [kreiszahl, kreisflaeche, sektor, zylinder, kegel, kugel],
};
