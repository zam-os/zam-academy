import { fmt } from "../exercises/format";
import { chord, isParallel, isSimilar, scaleText, sortedRatios, triangleExists } from "../lab/views-aehnlichkeit";
import { numberField as num, yesNo } from "./helpers";
import { choice, lab, makeLesson, makeStage, output as o, range as r, task } from "./builders";

const L = (content: Parameters<typeof makeLesson>[1]) => makeLesson(3, content);

/** Cuboid edges (cm) for the scaling tasks: O and V then belong to one real body. */
const CUBOIDS: Array<[number, number, number]> = [
  [1, 2, 3],
  [2, 2, 3],
  [2, 3, 4],
  [2, 3, 5],
  [2, 4, 4],
  [3, 4, 5],
];
const same = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const eq = (value: number, digits = 2) => (same(value, Math.round(value * 10 ** digits) / 10 ** digits) ? "=" : "≈");
const pt = (x: number, y: number) => `(${fmt(x)} | ${fmt(y)})`;

/** Triangles with whole sides that exist (each side shorter than the other two together). */
const TRIANGLES: Array<[number, number, number]> = [
  [3, 4, 5],
  [4, 6, 7],
  [5, 6, 8],
  [2, 3, 4],
  [6, 8, 9],
  [4, 5, 6],
];

// 3.1 Ähnliche Figuren ─────────────────────────────────────────────────────

const aehnlich = L({
  id: "ae-1-aehnliche-figuren",
  title: "Ähnliche Figuren",
  subtitle: "Gleiche Winkel, gleiche Seitenverhältnisse",
  whyItMatters:
    "Ein Foto auf dem Handy und derselbe Ausdruck als Poster sehen gleich aus, nur größer. Solche Figuren heißen ähnlich. Ob zwei Figuren ähnlich sind, entscheidest du mit Winkeln und Seitenverhältnissen, nicht nach Augenmaß.",
  explanationHtml: `
    <p>Zwei Figuren sind <strong>ähnlich</strong>, wenn sie in allen Winkeln übereinstimmen <strong>und</strong> alle einander entsprechenden Seiten im gleichen Verhältnis k stehen. Die eine Figur ist dann eine maßstäbliche Vergrößerung oder Verkleinerung der anderen.</p>
    <p>Bei <strong>Dreiecken</strong> genügt eine der beiden Bedingungen: Stimmen zwei Winkel überein, stimmt auch der dritte (Winkelsumme 180°), und die Dreiecke sind ähnlich. Ebenso sind Dreiecke ähnlich, wenn alle drei Seitenverhältnisse gleich sind.</p>
    <p>Bei <strong>Vierecken</strong> reichen gleiche Winkel nicht: Alle Rechtecke haben vier rechte Winkel, sind aber nicht alle ähnlich.</p>
    <div class="example"><strong>Beispiel:</strong> Dreieck 1 hat die Seiten 3 cm, 4 cm, 5 cm, Dreieck 2 hat 4,5 cm, 6 cm, 7,5 cm. 4,5 : 3 = 1,5; 6 : 4 = 1,5; 7,5 : 5 = 1,5. Alle Verhältnisse sind gleich: ähnlich mit k = 1,5.<br>
    Ein Rechteck 4 cm × 2 cm und ein Rechteck 6 cm × 4 cm: 6 : 4 = 1,5, aber 4 : 2 = 2. Nicht ähnlich, obwohl alle Winkel 90° sind.</div>
    <div class="merke"><strong>Merke:</strong> Ähnlich heißt: gleiche Winkel und gleiche Verhältnisse entsprechender Seiten. Bei Dreiecken genügen zwei gleiche Winkel. Vergleiche immer die kürzeste mit der kürzesten und die längste mit der längsten Seite.</div>
  `,
  formulas: [
    { name: "Ähnlichkeit", html: "a' : a = b' : b = c' : c = k", quantities: "gleiche Winkel, k Ähnlichkeitsfaktor" },
  ],
  quiz: {
    question: "Dreieck 1 hat Winkel von 50° und 70°, Dreieck 2 hat Winkel von 70° und 60°. Sind die Dreiecke ähnlich?",
    options: [
      "Ja, beide haben die Winkel 50°, 60° und 70°.",
      "Nein, die Winkel stehen in anderer Reihenfolge.",
      "Das lässt sich ohne Seitenlängen nicht sagen.",
      "Nur, wenn beide auch gleich groß sind.",
    ],
    correctIndex: 0,
    explanation: "Der dritte Winkel ist 180° − 50° − 70° = 60° bzw. 180° − 70° − 60° = 50°. Beide Dreiecke haben dieselben drei Winkel, also sind sie ähnlich. Die Reihenfolge spielt keine Rolle.",
  },
  lab: lab(
    "similar-triangles",
    "Ähnlich oder nicht?",
    "Links steht ein festes Dreieck. Verändere rechts die Winkel (Ecke C' ziehen) und die Seite c' (Ecke B' ziehen). Die Tabelle vergleicht die kürzesten, mittleren und längsten Seiten.",
    [r("alpha2", "Winkel bei A'", 30, 70, 50, 5, "°"), r("beta2", "Winkel bei B'", 30, 70, 60, 5, "°"), r("c2", "Seite c'", 2, 8, 6, 0.5, "cm")],
    [
      o("gamma2", "Winkel bei C'", (v) => 180 - v.alpha2 - v.beta2, "°", 0),
      o("k3", "längste : längste", (v) => sortedRatios(v)[2], "", 2),
      o("sim", "ähnlich?", (v) => (isSimilar(v) ? "ja" : "nein"), "", 0, true),
    ],
    [
      { id: "vergroessert", text: "Stelle ein Bild ein, das zum Original ähnlich und 1,5-mal so groß ist.", check: (v) => isSimilar(v) && same(sortedRatios(v)[2], 1.5) },
      { id: "verkleinert", text: "Stelle ein Bild ein, das zum Original ähnlich und halb so groß ist.", check: (v) => isSimilar(v) && same(sortedRatios(v)[2], 0.5) },
      { id: "gedreht", text: "Finde ein ähnliches Bild, bei dem der Winkel bei A' nicht 40° beträgt.", check: (v) => isSimilar(v) && v.alpha2 !== 40 },
    ],
  ),
  exercises: [
    {
      id: "seiten-pruefen",
      make: (rng, level) => {
        if (level === 1) {
          const [a, b, c] = rng.pick(TRIANGLES);
          const k = rng.pick([0.5, 1.5, 2, 2.5, 3]);
          const similar = rng.next() < 0.5;
          const shortest = a * k + (similar ? 0 : ((b - a) * k) / 2);
          const sides = [shortest, b * k, c * k];
          return task(
            level,
            `Dreieck 1 hat die Seiten ${a} cm, ${b} cm und ${c} cm. Dreieck 2 hat die Seiten ${sides.map((s) => fmt(s, 2)).join(" cm, ")} cm. Berechne die Verhältnisse der kürzesten und der längsten Seiten. Sind die Dreiecke ähnlich?`,
            [num("kürzeste : kürzeste =", shortest / a, "", 2), num("längste : längste =", k, "", 2), yesNo("ähnlich?", similar)],
            "Teile jede Seite von Dreieck 2 durch die entsprechende Seite von Dreieck 1. Ähnlich nur, wenn alle Verhältnisse gleich sind.",
            [`${fmt(shortest, 2)} : ${a} ${eq(shortest / a)} ${fmt(shortest / a, 2)}`, `${fmt(b * k, 2)} : ${b} = ${fmt(k, 2)}`, `${fmt(c * k, 2)} : ${c} = ${fmt(k, 2)}`],
            similar ? `alle Verhältnisse ${fmt(k, 2)}: ähnlich` : "Verhältnisse ungleich: nicht ähnlich",
            { a, b, c, k, similar: similar ? 1 : 0 },
            [`Dreieck 1: ${a} cm, ${b} cm, ${c} cm`],
          );
        }
        const [w, h] = rng.pick([
          [10, 15],
          [9, 13],
          [13, 18],
          [20, 30],
          [15, 20],
        ]);
        const k = rng.pick([2, 2.5, 3, 4]);
        const similar = rng.next() < 0.5;
        const H = h * k + (similar ? 0 : rng.pick([5, 10]));
        return task(
          level,
          `Ein Foto ist ${w} cm breit und ${h} cm hoch. Ein Poster ist ${fmt(w * k)} cm breit und ${fmt(H)} cm hoch. Ist das Poster eine ähnliche Vergrößerung des Fotos, sodass nichts verzerrt wird? Berechne die Verhältnisse der Breiten und der Höhen.`,
          [num("Breiten:", k, "", 2), num("Höhen:", H / h, "", 2), yesNo("ähnlich?", similar)],
          "Poster : Foto für die Breiten und für die Höhen. Nur bei gleichen Verhältnissen ist das Bild nicht verzerrt.",
          [`${fmt(w * k)} : ${w} = ${fmt(k, 2)}`, `${fmt(H)} : ${h} ${eq(H / h)} ${fmt(H / h, 2)}`],
          similar ? `beide Verhältnisse ${fmt(k, 2)}: ähnlich` : "verschiedene Verhältnisse: nicht ähnlich, das Bild wird verzerrt",
          { w, h, k, similar: similar ? 1 : 0 },
        );
      },
    },
    {
      id: "winkel-pruefen",
      make: (rng, level) => {
        if (level === 1) {
          let alpha = 50;
          let beta = 70;
          do {
            alpha = rng.pick([30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]);
            beta = rng.pick([40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]);
          } while (alpha + beta > 150);
          const gamma = 180 - alpha - beta;
          const similar = rng.next() < 0.5;
          const given = similar ? rng.pick([[gamma, alpha], [beta, gamma], [alpha, beta]]) : [gamma, alpha + 10];
          const third = 180 - given[0] - given[1];
          const fits = [given[0], given[1], third].sort((x, y) => x - y).join() === [alpha, beta, gamma].sort((x, y) => x - y).join();
          return task(
            level,
            `Dreieck ABC hat α = ${alpha}° und β = ${beta}°. Dreieck DEF hat bei D einen Winkel von ${given[0]}° und bei E einen Winkel von ${given[1]}°. Berechne die fehlenden Winkel γ und den Winkel bei F. Sind die Dreiecke ähnlich?`,
            [num("γ =", gamma, "°", 0), num("Winkel bei F:", third, "°", 0), yesNo("ähnlich?", fits)],
            "Winkelsumme im Dreieck: 180°. Ähnlich, wenn beide Dreiecke dieselben drei Winkel haben.",
            [`γ = 180° − ${alpha}° − ${beta}° = ${gamma}°`, `F: 180° − ${given[0]}° − ${given[1]}° = ${third}°`, `ABC: ${[alpha, beta, gamma].join("°, ")}°; DEF: ${[given[0], given[1], third].join("°, ")}°`],
            fits ? "gleiche Winkel: ähnlich" : "verschiedene Winkel: nicht ähnlich",
            { alpha, beta, similar: fits ? 1 : 0 },
          );
        }
        const base = rng.pick([30, 35, 40, 45, 50, 55, 60, 65, 70, 75]);
        const similar = rng.next() < 0.5;
        const apex = 180 - 2 * base + (similar ? 0 : rng.pick([-10, 10]));
        const base2 = (180 - apex) / 2;
        return task(
          level,
          `Ein gleichschenkliges Dreieck hat einen Basiswinkel von ${base}°. Ein zweites gleichschenkliges Dreieck hat an der Spitze einen Winkel von ${apex}°. Berechne die Basiswinkel des zweiten Dreiecks. Sind die beiden Dreiecke ähnlich?`,
          [num("Basiswinkel:", base2, "°", 1, { slips: [{ value: 180 - apex, hint: "Es gibt zwei gleich große Basiswinkel: (180° − Spitze) : 2." }] }), yesNo("ähnlich?", similar)],
          "Im gleichschenkligen Dreieck sind die Basiswinkel gleich: (180° − Winkel an der Spitze) : 2.",
          [`(180° − ${apex}°) : 2 = ${fmt(base2, 1)}°`, `erstes Dreieck: ${base}°, ${base}°, ${180 - 2 * base}°`],
          similar ? "gleiche Winkel: ähnlich" : "verschiedene Basiswinkel: nicht ähnlich",
          { base, similar: similar ? 1 : 0 },
        );
      },
    },
  ],
});

// 3.2 Zentrische Streckung und Maßstab ─────────────────────────────────────

const streckung = L({
  id: "ae-2-zentrische-streckung",
  title: "Zentrische Streckung und Maßstab",
  subtitle: "Streckungszentrum Z, Streckungsfaktor k",
  whyItMatters:
    "Landkarten, Baupläne und Modellautos sind maßstäbliche Verkleinerungen, eine Lupe oder ein Beamer vergrößert. Die zentrische Streckung erklärt, was eine Maßstabsangabe wie 1 : 25.000 bedeutet.",
  explanationHtml: `
    <p>Bei einer <strong>zentrischen Streckung</strong> mit dem <strong>Streckungszentrum Z</strong> und dem <strong>Streckungsfaktor k</strong> (k &gt; 0) liegt jeder Bildpunkt P' auf dem Strahl von Z durch P, und es gilt ZP' = k · ZP.</p>
    <ul>
      <li>k &gt; 1: Vergrößerung, 0 &lt; k &lt; 1: Verkleinerung, k = 1: alles bleibt, wie es ist.</li>
      <li>Jede Strecke wird k-mal so lang, alle Winkel bleiben gleich. Bild und Original sind ähnlich.</li>
      <li>Das Zentrum Z selbst bleibt liegen.</li>
    </ul>
    <p>Eine <strong>Maßstabsangabe</strong> nennt das Verhältnis Bild : Wirklichkeit. 1 : 25.000 heißt k = 1/25.000: 1 cm auf der Karte sind 25.000 cm = 250 m in der Natur. 5 : 1 heißt: fünffach vergrößert.</p>
    <div class="example"><strong>Beispiel:</strong> Z ist das Zentrum, ZA = 2 cm, k = 3. Dann ist ZA' = 3 · 2 cm = 6 cm. Ist AB = 1,5 cm, so ist A'B' = 3 · 1,5 cm = 4,5 cm.<br>
    Auf einer Karte im Maßstab 1 : 25.000 sind zwei Orte 8 cm voneinander entfernt: 8 cm · 25.000 = 200.000 cm = 2 km.</div>
    <div class="merke"><strong>Merke:</strong> ZP' = k · ZP; Bildstrecke = k · Originalstrecke. Maßstab 1 : n heißt k = 1/n, Länge in der Wirklichkeit = Länge im Bild · n.</div>
  `,
  formulas: [
    { name: "Zentrische Streckung", html: "ZP' = k · ZP, A'B' = k · AB", quantities: "Z Streckungszentrum, k Streckungsfaktor" },
    { name: "Maßstab", html: "1 : n bedeutet k = 1/n", quantities: "Wirklichkeit = Bild · n" },
  ],
  quiz: {
    question: "Ein Modellauto im Maßstab 1 : 18 ist 25 cm lang. Wie lang ist das echte Auto?",
    options: ["4,5 m", "1,39 m", "43 cm", "45 m"],
    correctIndex: 0,
    explanation: "Wirklichkeit = Modell · 18 = 25 cm · 18 = 450 cm = 4,5 m. 25 : 18 würde das Modell noch kleiner machen.",
  },
  lab: lab(
    "center-stretch",
    "Strecken vom Zentrum aus",
    "Ziehe das Streckungszentrum Z und den Bildpunkt B'. Die gestrichelten Strahlen laufen von Z durch jede Ecke und ihren Bildpunkt.",
    [r("k", "Streckungsfaktor k", 0.25, 3, 1.5, 0.25), r("zx", "Zentrum Z: x", 0, 12, 2, 1), r("zy", "Zentrum Z: y", 0, 8, 1, 1)],
    [
      o("ab2", "A'B'", (v) => 3 * v.k, "cm", 2),
      o("scale", "Maßstab Bild : Original", (v) => scaleText(v.k), "", 0),
      o("area", "Fläche des Bildes", (v) => 3 * v.k * v.k, "cm²", 2, true),
    ],
    [
      { id: "doppelt", text: "Vergrößere das Dreieck so, dass jede Seite doppelt so lang wird.", check: (v) => v.k === 2 },
      { id: "halb", text: "Verkleinere das Dreieck im Maßstab 1 : 2.", check: (v) => v.k === 0.5 },
      { id: "fixpunkt", text: "Lege Z so, dass die Ecke A beim Strecken liegen bleibt, und wähle k ≠ 1.", check: (v) => v.zx === 4 && v.zy === 2 && v.k !== 1 },
    ],
  ),
  exercises: [
    {
      id: "streckung",
      make: (rng, level) => {
        if (level === 1) {
          const za = rng.pick([2, 3, 4, 5, 6]);
          const k = rng.pick([0.5, 1.5, 2, 2.5, 3]);
          const ab = rng.pick([2, 2.5, 3, 4, 5]);
          return task(
            level,
            `Eine zentrische Streckung hat das Zentrum Z und den Faktor k = ${fmt(k)}. Es ist ZA = ${fmt(za)} cm und AB = ${fmt(ab)} cm. Berechne ZA' und A'B'.`,
            [num("ZA' =", k * za, "cm", 2, { slips: [{ value: k * za - za, hint: "Das ist AA'. ZA' wird vom Zentrum Z aus gemessen." }] }), num("A'B' =", k * ab, "cm", 2)],
            "ZA' = k · ZA und A'B' = k · AB",
            [`ZA' = ${fmt(k)} · ${fmt(za)} cm`, `A'B' = ${fmt(k)} · ${fmt(ab)} cm`],
            `ZA' = ${fmt(k * za)} cm, A'B' = ${fmt(k * ab)} cm`,
            { za, k, ab },
          );
        }
        const zx = rng.int(0, 3);
        const zy = rng.int(0, 3);
        const dx = rng.pick([1, 2]);
        const dy = rng.pick([1, 2]);
        const k = rng.pick([2, 3, 0.5]);
        let ex = 0;
        let ey = 0;
        while (ex === 0 && ey === 0) {
          ex = rng.int(-2, 3);
          ey = rng.int(-2, 3);
        }
        const A = { x: zx + dx * (k === 0.5 ? 2 : 1), y: zy + dy * (k === 0.5 ? 2 : 1) };
        const A2 = { x: zx + k * (A.x - zx), y: zy + k * (A.y - zy) };
        const B = { x: zx + ex, y: zy + ey };
        const B2 = { x: zx + k * ex, y: zy + k * ey };
        return task(
          level,
          `Eine zentrische Streckung mit dem Zentrum Z${pt(zx, zy)} bildet A${pt(A.x, A.y)} auf A'${pt(A2.x, A2.y)} ab. Berechne den Streckungsfaktor k und den Bildpunkt B' von B${pt(B.x, B.y)}.`,
          [
            num("k =", k, "", 2, { slips: zx !== 0 && A.x !== 0 ? [{ value: A2.x / A.x, hint: "Miss vom Zentrum Z aus: k = ZA' : ZA, nicht A' : A." }] : [] }),
            num("B': x =", B2.x, "", 2),
            num("B': y =", B2.y, "", 2),
          ],
          "Von Z nach A und von Z nach A' gehen: k = Weg zu A' : Weg zu A. Den Weg von Z nach B mit k malnehmen.",
          [`Z → A: ${fmt(A.x - zx)} nach rechts, ${fmt(A.y - zy)} nach oben; Z → A': ${fmt(A2.x - zx)} und ${fmt(A2.y - zy)}`, `k = ${fmt(A2.x - zx)} : ${fmt(A.x - zx)} = ${fmt(k)}`, `Z → B: (${fmt(ex)} | ${fmt(ey)}), mal ${fmt(k)}: (${fmt(k * ex)} | ${fmt(k * ey)})`],
          `k = ${fmt(k)}, B'${pt(B2.x, B2.y)}`,
          { zx, zy, k, ex, ey },
        );
      },
    },
    {
      id: "massstab",
      make: (rng, level) => {
        if (level === 1) {
          const n = rng.pick([25000, 50000, 100000, 200000]);
          const d = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 12]);
          const km = rng.pick([1, 2, 3, 5, 8]);
          return task(
            level,
            `Eine Karte hat den Maßstab 1 : ${fmt(n)}. Zwei Orte sind auf der Karte ${d} cm voneinander entfernt. Wie weit ist das in Wirklichkeit? Wie lang ist auf der Karte eine Strecke von ${km} km?`,
            [num("Wirklichkeit:", (d * n) / 100000, "km", 2, { slips: [{ value: (d * n) / 100, hint: "1 km = 1.000 m = 100.000 cm." }] }), num("auf der Karte:", (km * 100000) / n, "cm", 2)],
            "Wirklichkeit = Karte · n. Umrechnen: 1 km = 100.000 cm.",
            [`${d} cm · ${fmt(n)} = ${fmt(d * n)} cm = ${fmt((d * n) / 100000, 2)} km`, `${km} km = ${fmt(km * 100000)} cm; ${fmt(km * 100000)} cm : ${fmt(n)} = ${fmt((km * 100000) / n, 2)} cm`],
            `${fmt((d * n) / 100000, 2)} km und ${fmt((km * 100000) / n, 2)} cm`,
            { n, d, km },
          );
        }
        const n = rng.pick([25, 50, 75, 100, 150]);
        const height = rng.pick([6, 7.5, 9, 12, 15]);
        const model = (height * 100) / n;
        const width = rng.pick([12, 16, 18, 20, 24]);
        return task(
          level,
          `Ein Architekt baut das Modell eines ${fmt(height)} m hohen Hauses. Im Modell ist das Haus ${fmt(model, 2)} cm hoch. Gib den Maßstab in der Form 1 : n an. Das Modell ist ${width} cm breit. Wie breit ist das echte Haus?`,
          [num("n =", n, "", 0, { slips: [{ value: height / model, hint: "Rechne beide Längen zuerst in dieselbe Einheit um: 1 m = 100 cm." }] }), num("Breite:", (width * n) / 100, "m", 2)],
          "n = Wirklichkeit : Modell in derselben Einheit; Breite = Modellbreite · n.",
          [`${fmt(height)} m = ${fmt(height * 100)} cm`, `n = ${fmt(height * 100)} : ${fmt(model, 2)} = ${n}`, `${width} cm · ${n} = ${fmt(width * n)} cm`],
          `Maßstab 1 : ${n}, Breite ${fmt((width * n) / 100, 2)} m`,
          { n, height, width },
        );
      },
    },
  ],
});

// 3.3 Ähnliche Figuren und Körper berechnen ────────────────────────────────

const berechnen = L({
  id: "ae-3-flaechen-volumen",
  title: "Längen, Flächen und Volumen ähnlicher Figuren",
  subtitle: "Längen mal k, Flächen mal k², Volumen mal k³",
  whyItMatters:
    "Ein doppelt so großer Würfel braucht nicht doppelt so viel Farbe, sondern viermal so viel, und er fasst achtmal so viel. Wer das weiß, schätzt Material, Gewicht und Kosten bei Modellen und Vergrößerungen richtig.",
  explanationHtml: `
    <p>Sind zwei Figuren oder Körper mit dem Faktor k ähnlich, dann gilt:</p>
    <ul>
      <li><strong>Längen</strong> werden k-mal so groß.</li>
      <li><strong>Flächeninhalte</strong> (auch Oberflächen) werden k²-mal so groß, denn Länge und Breite wachsen beide um k.</li>
      <li><strong>Volumen</strong> werden k³-mal so groß, denn Länge, Breite und Höhe wachsen um k.</li>
    </ul>
    <p>Fehlende Seiten berechnest du so: Zuerst k aus einem Paar entsprechender Seiten, k = Bildseite : Originalseite, dann jede andere Seite mal k.</p>
    <div class="example"><strong>Beispiel:</strong> Ein Dreieck hat die Seiten 4 cm, 5 cm und 6 cm. Ein ähnliches Dreieck hat als längste Seite 9 cm. k = 9 : 6 = 1,5. Die anderen Seiten: 4 cm · 1,5 = 6 cm und 5 cm · 1,5 = 7,5 cm. Der Flächeninhalt wird 1,5² = 2,25-mal so groß.<br>
    Ein Modell im Maßstab 1 : 10 hat ein Volumen von 2 Litern. Das Original hat 2 L · 10³ = 2.000 L.</div>
    <div class="merke"><strong>Merke:</strong> k = Bildlänge : Originallänge. Längen · k, Flächen · k², Volumen · k³.</div>
  `,
  formulas: [
    { name: "Ähnlichkeitsfaktor", html: "k = Bildlänge : Originallänge", quantities: "aus entsprechenden Seiten" },
    { name: "Flächen und Volumen", html: "A' = k² · A, V' = k³ · V", quantities: "bei ähnlichen Figuren und Körpern" },
  ],
  quiz: {
    question: "Ein Würfel wird mit dem Faktor k = 3 vergrößert. Wie verändert sich sein Volumen?",
    options: ["Es wird 27-mal so groß.", "Es wird 9-mal so groß.", "Es wird 3-mal so groß.", "Es wird 6-mal so groß."],
    correctIndex: 0,
    explanation: "Länge, Breite und Höhe werden jeweils 3-mal so groß: 3 · 3 · 3 = 3³ = 27. 9-mal so groß wird die Oberfläche.",
  },
  lab: lab(
    "scale-solid",
    "Würfel vergrößern",
    "Ziehe die Kante des rechten Würfels. Die Kästchen zeigen, wie viele 1-cm-Quadrate auf eine Fläche passen.",
    [r("k", "Streckungsfaktor k", 0.5, 4, 1.5, 0.5)],
    [
      o("edge", "Kante", (v) => 2 * v.k, "cm", 1),
      o("area", "Oberfläche mal", (v) => v.k ** 2, "", 2),
      o("vol", "Volumen mal", (v) => v.k ** 3, "", 3, true),
    ],
    [
      { id: "achtfach", text: "Mache das Volumen achtmal so groß wie beim Original.", check: (v) => v.k === 2 },
      { id: "neunfach", text: "Mache die Oberfläche neunmal so groß wie beim Original.", check: (v) => v.k === 3 },
      { id: "achtel", text: "Verkleinere so, dass der Würfel nur noch ein Achtel des Volumens hat.", check: (v) => v.k === 0.5 },
    ],
  ),
  exercises: [
    {
      id: "seiten",
      make: (rng, level) => {
        if (level === 1) {
          const [a, b, c] = rng.pick(TRIANGLES);
          const k = rng.pick([0.5, 1.5, 2, 2.5, 3]);
          return task(
            level,
            `Ein Dreieck hat die Seiten a = ${a} cm, b = ${b} cm und c = ${c} cm. Ein ähnliches Dreieck hat a' = ${fmt(a * k, 2)} cm. Berechne k, b' und c'.`,
            [num("k =", k, "", 2, { slips: [{ value: a / (a * k), hint: "k = Bildseite : Originalseite, also a' : a." }] }), num("b' =", b * k, "cm", 2), num("c' =", c * k, "cm", 2)],
            "k = a' : a, dann b' = k · b und c' = k · c.",
            [`k = ${fmt(a * k, 2)} : ${a} = ${fmt(k, 2)}`, `b' = ${fmt(k, 2)} · ${b} cm`, `c' = ${fmt(k, 2)} · ${c} cm`],
            `k = ${fmt(k, 2)}, b' = ${fmt(b * k, 2)} cm, c' = ${fmt(c * k, 2)} cm`,
            { a, b, c, k },
          );
        }
        const s = rng.pick([3, 4, 5, 6]);
        const longest = rng.pick([5, 6, 7.5, 10]);
        const leg1 = (3 * longest) / 5;
        const leg2 = (4 * longest) / 5;
        return task(
          level,
          `Das Modell eines dreieckigen Segels hat die Seiten ${3 * s} cm, ${4 * s} cm und ${5 * s} cm und einen rechten Winkel zwischen den beiden kürzeren Seiten. Das echte Segel ist ähnlich, seine längste Seite ist ${fmt(longest)} m lang. Berechne die beiden anderen Seiten und den Flächeninhalt des echten Segels.`,
          [num("kürzeste Seite:", leg1, "m", 2), num("mittlere Seite:", leg2, "m", 2), num("Fläche:", (leg1 * leg2) / 2, "m²", 2, { slips: [{ value: leg1 * leg2, hint: "Das Segel ist ein rechtwinkliges Dreieck: Fläche = Kathete · Kathete : 2." }] })],
          "k = echte längste Seite : Modellseite (gleiche Einheit). Die anderen Seiten mal k; Fläche eines rechtwinkligen Dreiecks: Kathete · Kathete : 2.",
          [`k = ${fmt(longest * 100)} cm : ${5 * s} cm = ${fmt((longest * 100) / (5 * s), 2)}`, `${3 * s} cm · k = ${fmt(leg1 * 100)} cm; ${4 * s} cm · k = ${fmt(leg2 * 100)} cm`, `A = ${fmt(leg1, 2)} m · ${fmt(leg2, 2)} m : 2`],
          `${fmt(leg1, 2)} m und ${fmt(leg2, 2)} m, A = ${fmt((leg1 * leg2) / 2, 2)} m²`,
          { s, longest },
        );
      },
    },
    {
      id: "flaeche-volumen",
      make: (rng, level) => {
        if (level === 1) {
          // O and V belong to one real body: a cuboid with these edges.
          const [a, b, c] = rng.pick(CUBOIDS);
          const area = 2 * (a * b + a * c + b * c);
          const volume = a * b * c;
          const k = rng.pick([2, 3, 1.5, 0.5]);
          return task(
            level,
            `Ein Quader mit den Kanten ${a} cm, ${b} cm und ${c} cm hat die Oberfläche O = ${area} cm² und das Volumen V = ${volume} cm³. Er wird mit k = ${fmt(k)} ähnlich ${k > 1 ? "vergrößert" : "verkleinert"}. Berechne Oberfläche und Volumen des neuen Quaders.`,
            [num("O' =", area * k * k, "cm²", 2, { slips: [{ value: area * k, hint: "Flächen ändern sich mit k², nicht mit k." }] }), num("V' =", volume * k ** 3, "cm³", 3, { slips: [{ value: volume * k * k, hint: "Volumen ändern sich mit k³." }] })],
            "O' = k² · O und V' = k³ · V",
            [`k² = ${fmt(k * k, 2)}, k³ = ${fmt(k ** 3, 3)}`, `O' = ${fmt(k * k, 2)} · ${area} cm²`, `V' = ${fmt(k ** 3, 3)} · ${volume} cm³`, `Probe mit den neuen Kanten: ${fmt(a * k, 1)} cm · ${fmt(b * k, 1)} cm · ${fmt(c * k, 1)} cm = ${fmt(volume * k ** 3, 3)} cm³`],
            `O' = ${fmt(area * k * k, 2)} cm², V' = ${fmt(volume * k ** 3, 3)} cm³`,
            { a, b, c, k },
          );
        }
        const n = rng.pick([10, 20, 25, 50]);
        const base = rng.pick([50, 80, 100, 150]);
        const h = rng.pick([12, 16, 20, 24]);
        const litres = (base * h) / 1000;
        const real = (base * h * n ** 3) / 1e6;
        return task(
          level,
          `Das Modell eines Wassertanks im Maßstab 1 : ${n} ist ${h} cm hoch und fasst ${fmt(litres, 2)} Liter. Wie hoch ist der echte Tank? Wie viele Kubikmeter fasst er?`,
          [num("Höhe:", (h * n) / 100, "m", 2), num("Volumen:", real, "m³", 2, { slips: [{ value: (litres * n * n) / 1000, hint: "Volumen wachsen mit k³, nicht mit k²." }, { value: litres * n ** 3, hint: "Das sind Liter. 1 m³ = 1.000 L." }] })],
          "Höhe · n; Volumen · n³; 1 m³ = 1.000 L",
          [`${h} cm · ${n} = ${fmt(h * n)} cm`, `${fmt(litres, 2)} L · ${n}³ = ${fmt(litres * n ** 3)} L`, `${fmt(litres * n ** 3)} L : 1.000`],
          `${fmt((h * n) / 100, 2)} m hoch, ${fmt(real, 2)} m³`,
          { n, base, h },
        );
      },
    },
  ],
});

// 3.4 Strahlensätze ────────────────────────────────────────────────────────

const strahlen = L({
  id: "ae-4-strahlensaetze",
  title: "Strahlensätze",
  subtitle: "Zwei Strahlen, zwei Parallelen",
  whyItMatters:
    "Wie hoch ist ein Baum, wie breit ein Fluss? Mit einem Stab, einem Schatten und den Strahlensätzen misst du Längen, an die du nicht herankommst.",
  explanationHtml: `
    <p>Zwei Strahlen beginnen im Punkt Z. Zwei <strong>parallele</strong> Geraden schneiden den ersten Strahl in A und A', den zweiten in B und B'. Das Dreieck ZA'B' ist dann die zentrische Streckung von ZAB mit dem Zentrum Z und k = ZA' : ZA.</p>
    <ul>
      <li><strong>1. Strahlensatz:</strong> Die Abschnitte auf den Strahlen stehen im gleichen Verhältnis: ZA' : ZA = ZB' : ZB.</li>
      <li><strong>2. Strahlensatz:</strong> Die Parallelenabschnitte stehen im gleichen Verhältnis wie die Strahlenabschnitte von Z aus: A'B' : AB = ZA' : ZA.</li>
    </ul>
    <p>Achtung: Beim 2. Strahlensatz müssen die Strahlenabschnitte im Zentrum Z beginnen. AA' : ZA ist nicht dasselbe wie A'B' : AB.</p>
    <div class="example"><strong>Beispiel:</strong> Ein 1,5 m langer Stab wirft einen 2 m langen Schatten. Zur gleichen Zeit wirft ein Baum einen 12 m langen Schatten. Sonnenstrahlen sind parallel: Baumhöhe : 1,5 m = 12 m : 2 m = 6. Der Baum ist 6 · 1,5 m = 9 m hoch.</div>
    <div class="merke"><strong>Merke:</strong> Bei Parallelen gilt ZA' : ZA = ZB' : ZB = A'B' : AB = k. Alle Strecken auf den Strahlen werden von Z aus gemessen.</div>
  `,
  formulas: [
    { name: "1. Strahlensatz", html: "ZA' : ZA = ZB' : ZB", quantities: "nur wenn AB ∥ A'B'" },
    { name: "2. Strahlensatz", html: "A'B' : AB = ZA' : ZA", quantities: "Strahlenabschnitte von Z aus" },
  ],
  quiz: {
    question: "Es ist AB ∥ A'B', ZA = 4 cm, AA' = 2 cm und AB = 3 cm. Wie lang ist A'B'?",
    options: ["4,5 cm", "1,5 cm", "6 cm", "5 cm"],
    correctIndex: 0,
    explanation: "ZA' = 4 cm + 2 cm = 6 cm, also k = 6 : 4 = 1,5 und A'B' = 1,5 · 3 cm = 4,5 cm. Mit AA' : ZA = 0,5 erhält man fälschlich 1,5 cm.",
  },
  lab: lab(
    "intercept",
    "Parallelen zwischen zwei Strahlen",
    "Ziehe A, A', B und B' auf den Strahlen. Werden AB und A'B' grün, sind sie parallel, und die Verhältnisse stimmen überein.",
    [r("a", "ZA", 2, 6, 4, 0.5, "cm"), r("a2", "ZA'", 1, 13, 8, 0.5, "cm"), r("b", "ZB", 2, 6, 3, 0.5, "cm"), r("b2", "ZB'", 1, 13, 5, 0.5, "cm")],
    [
      o("ka", "ZA' : ZA", (v) => v.a2 / v.a, "", 2),
      o("kb", "ZB' : ZB", (v) => v.b2 / v.b, "", 2),
      o("seg", "A'B' : AB", (v) => chord(v.a2, v.b2) / chord(v.a, v.b), "", 2, true),
    ],
    [
      { id: "parallel", text: "Verschiebe die Punkte so, dass A'B' parallel zu AB ist.", check: (v) => isParallel(v) },
      { id: "dreifach", text: "Stelle Parallelen ein, bei denen A'B' dreimal so lang ist wie AB.", check: (v) => isParallel(v) && same(v.a2, 3 * v.a) },
      { id: "halb", text: "Stelle Parallelen ein, bei denen A'B' halb so lang ist wie AB.", check: (v) => isParallel(v) && same(2 * v.a2, v.a) },
    ],
  ),
  exercises: [
    {
      id: "strahlensatz",
      make: (rng, level) => {
        if (level === 1) {
          const za = rng.pick([2, 3, 4, 5]);
          const k = rng.pick([1.5, 2, 2.5, 3]);
          // ZA, ZB and AB must form a real triangle ZAB.
          let zb: number;
          let ab: number;
          do {
            zb = rng.pick([2, 3, 4, 6]);
            ab = rng.pick([1.5, 2, 2.5, 3]);
          } while (!triangleExists(za, zb, ab));
          return task(
            level,
            `Zwei Strahlen von Z werden von den Parallelen AB und A'B' geschnitten. Es ist ZA = ${za} cm, ZA' = ${fmt(za * k)} cm, ZB = ${zb} cm und AB = ${fmt(ab)} cm. Berechne ZB' und A'B'.`,
            [num("ZB' =", zb * k, "cm", 2), num("A'B' =", ab * k, "cm", 2)],
            "1. Strahlensatz: ZB' : ZB = ZA' : ZA. 2. Strahlensatz: A'B' : AB = ZA' : ZA.",
            [`k = ZA' : ZA = ${fmt(za * k)} : ${za} = ${fmt(k)}`, `ZB' = ${fmt(k)} · ${zb} cm`, `A'B' = ${fmt(k)} · ${fmt(ab)} cm`],
            `ZB' = ${fmt(zb * k)} cm, A'B' = ${fmt(ab * k)} cm`,
            { za, k, zb, ab },
          );
        }
        const a = rng.pick([2, 3, 4, 5, 6]);
        const d = rng.pick([1, 2, 3, 4]);
        // ZA, ZB and AB must form a real triangle ZAB.
        let b: number;
        let s: number;
        do {
          b = rng.pick([3, 4, 5]);
          s = rng.pick([2, 3, 4, 5]);
        } while (!triangleExists(a, b, s));
        const k = (a + d) / a;
        return task(
          level,
          `In einer Strahlensatzfigur mit dem Zentrum Z ist AB ∥ A'B'. Gegeben sind ZA = ${a} cm, AA' = ${d} cm, ZB = ${b} cm und AB = ${s} cm. Berechne BB' und A'B'.`,
          [num("BB' =", (b * d) / a, "cm", 2), num("A'B' =", s * k, "cm", 2, { slips: [{ value: (s * d) / a, hint: "Beim 2. Strahlensatz zählen die Strecken ab Z: ZA' = ZA + AA'." }] })],
          "Zuerst ZA' = ZA + AA'. Dann k = ZA' : ZA.",
          [`ZA' = ${a} cm + ${d} cm = ${a + d} cm, k = ${a + d} : ${a} ${eq(k)} ${fmt(k, 2)}`, `ZB' = ${b} cm · ${a + d} : ${a} ${eq((b * (a + d)) / a)} ${fmt((b * (a + d)) / a, 2)} cm, BB' = ZB' − ZB`, `A'B' = ${s} cm · ${a + d} : ${a}`],
          `BB' ${eq((b * d) / a)} ${fmt((b * d) / a, 2)} cm, A'B' ${eq(s * k)} ${fmt(s * k, 2)} cm`,
          { a, d, b, s },
        );
      },
    },
    {
      id: "sachaufgabe",
      make: (rng, level) => {
        if (level === 1) {
          const stick = rng.pick([1, 1.5, 2]);
          const shadow = rng.pick([0.8, 1.2, 1.5, 2, 2.5]);
          const tree = rng.pick([6, 9, 12, 15, 18, 24]);
          const height = (stick * tree) / shadow;
          return task(
            level,
            `Ein ${fmt(stick)} m langer Stab wirft einen ${fmt(shadow)} m langen Schatten. Zur selben Zeit wirft ein Baum einen ${tree} m langen Schatten. Wie hoch ist der Baum?`,
            [num("Baumhöhe:", height, "m", 2, { slips: [{ value: (shadow * tree) / stick, hint: "Höhe : Schatten ist bei Stab und Baum gleich: Baum = Stab · Baumschatten : Stabschatten." }] })],
            "Baumhöhe : Stablänge = Baumschatten : Stabschatten",
            [`k = ${tree} m : ${fmt(shadow)} m ${eq(tree / shadow)} ${fmt(tree / shadow, 2)}`, `Baumhöhe = ${fmt(stick)} m · ${tree} : ${fmt(shadow)}`],
            `Baumhöhe ${eq(height)} ${fmt(height, 2)} m`,
            { stick, shadow, tree },
            [`Stab ${fmt(stick)} m, Schatten ${fmt(shadow)} m`, `Baumschatten ${tree} m`],
          );
        }
        const lamp = rng.pick([4, 4.5, 5, 6]);
        const person = rng.pick([1.5, 1.6, 1.75, 1.8]);
        const dist = rng.pick([2, 3, 4, 5]);
        const shadow = (person * dist) / (lamp - person);
        return task(
          level,
          `Eine Straßenlaterne ist ${fmt(lamp)} m hoch. Eine ${fmt(person)} m große Person steht ${dist} m vom Fuß der Laterne entfernt. Wie lang ist ihr Schatten? Fertige zuerst eine Skizze an.`,
          [num("Schatten:", shadow, "m", 2, { slips: [{ value: (person * dist) / lamp, hint: "Der große Strahlenabschnitt reicht von der Schattenspitze bis zur Laterne: Schatten + Abstand." }] })],
          "Die Schattenspitze ist das Zentrum. Person : Laterne = Schatten : (Schatten + Abstand).",
          [`${fmt(person)} : ${fmt(lamp)} = x : (x + ${dist})`, `${fmt(lamp)} · x = ${fmt(person)} · x + ${fmt(person * dist, 2)}`, `x = ${fmt(person * dist, 2)} : ${fmt(lamp - person, 2)}`],
          `Schatten ${eq(shadow)} ${fmt(shadow, 2)} m`,
          { lamp, person, dist },
        );
      },
    },
  ],
});

// 3.5 Kathetensatz und Höhensatz ───────────────────────────────────────────

/** Right triangles (c, a) with whole sides: c hypotenuse, a a leg. */
const RIGHT: Array<[number, number]> = [
  [10, 6],
  [10, 8],
  [13, 5],
  [13, 12],
  [15, 9],
  [15, 12],
  [20, 12],
  [20, 16],
  [25, 15],
  [25, 20],
];

const katheten = L({
  id: "ae-5-kathetensatz-hoehensatz",
  title: "Kathetensatz und Höhensatz",
  subtitle: "Flächengleiche Quadrate und Rechtecke",
  whyItMatters:
    "Die Höhe eines Dachgiebels oder einer Rampe liegt oft im Inneren der Figur und lässt sich schlecht messen. Mit Kathetensatz und Höhensatz berechnest du sie aus den Abschnitten der Hypotenuse.",
  explanationHtml: `
    <p>Im rechtwinkligen Dreieck ABC mit dem rechten Winkel bei C teilt die Höhe h die Hypotenuse c in zwei <strong>Hypotenusenabschnitte</strong>: p liegt unter der Kathete a (bei B), q unter der Kathete b (bei A). Es gilt c = p + q.</p>
    <ul>
      <li><strong>Kathetensatz:</strong> a² = c · p und b² = c · q. Das Quadrat über einer Kathete hat denselben Flächeninhalt wie das Rechteck aus der Hypotenuse und dem anliegenden Abschnitt.</li>
      <li><strong>Höhensatz:</strong> h² = p · q. Das Quadrat über der Höhe hat denselben Flächeninhalt wie das Rechteck aus den beiden Abschnitten.</li>
    </ul>
    <p>Die Buchstaben hängen von der Beschriftung ab. Liegt der rechte Winkel bei F im Dreieck DEF, ist DE die Hypotenuse, und die Höhe von F teilt sie in zwei Abschnitte. Eine Skizze zeigt, welcher Abschnitt an welcher Kathete liegt.</p>
    <div class="example"><strong>Beispiel:</strong> p = 9 cm und q = 4 cm. h² = 9 · 4 = 36, also h = 6 cm. c = 13 cm, a² = 13 · 9 = 117, a ≈ 10,82 cm; b² = 13 · 4 = 52, b ≈ 7,21 cm.<br>
    Probe mit Pythagoras: a² + b² = 117 + 52 = 169 = 13² = c².</div>
    <div class="merke"><strong>Merke:</strong> Kathetensatz: a² = c · p, b² = c · q. Höhensatz: h² = p · q. Der Abschnitt gehört zur Kathete, an der er anliegt.</div>
  `,
  formulas: [
    { name: "Kathetensatz", html: "a² = c · p, b² = c · q", quantities: "p, q Hypotenusenabschnitte unter a bzw. b" },
    { name: "Höhensatz", html: "h² = p · q", quantities: "h Höhe auf die Hypotenuse" },
  ],
  quiz: {
    question: "In einem rechtwinkligen Dreieck sind die Hypotenusenabschnitte p = 8 cm und q = 2 cm. Wie lang ist die Höhe h?",
    options: ["4 cm", "16 cm", "10 cm", "6 cm"],
    correctIndex: 0,
    explanation: "Höhensatz: h² = p · q = 8 · 2 = 16, also h = 4 cm. 16 ist h², 10 cm ist die Hypotenuse c = p + q.",
  },
  lab: lab(
    "thales-height",
    "Quadrat gleich Rechteck",
    "Ziehe C über den Thaleskreis. Rechts siehst du ein Quadrat und ein Rechteck mit gleichem Flächeninhalt. Wähle, welchen Satz das Bild zeigt.",
    [r("c", "Hypotenuse c", 4, 10, 8, 0.5, "cm"), r("s", "Lage von C (Anteil q an c)", 2, 98, 35, 1, "%"), choice("show", "Zeige", ["Höhensatz", "Kathetensatz für a", "Kathetensatz für b"], 0)],
    [
      o("p", "Abschnitt p", (v) => v.c - (v.c * v.s) / 100, "cm", 2),
      o("q", "Abschnitt q", (v) => (v.c * v.s) / 100, "cm", 2),
      o("h", "Höhe h = √(p · q)", (v) => Math.sqrt((v.c - (v.c * v.s) / 100) * ((v.c * v.s) / 100)), "cm", 2, true),
    ],
    [
      { id: "gleich", text: "Mache p und q gleich lang. Wie hoch ist h dann im Vergleich zu c?", check: (v) => v.s === 50 },
      { id: "hoehe-vier", text: "Stelle bei c = 10 cm den Punkt C so ein, dass die Höhe genau 4 cm ist.", check: (v) => v.c === 10 && same((v.c - (v.c * v.s) / 100) * ((v.c * v.s) / 100), 16) },
      { id: "dreimal", text: "Mache das Quadrat über a genau dreimal so groß wie das Quadrat über b.", check: (v) => same(100 - v.s, 3 * v.s) },
    ],
  ),
  exercises: [
    {
      id: "hoehensatz",
      make: (rng, level) => {
        const p = rng.pick([2, 3, 4, 5, 6, 8, 9]);
        const q = rng.pick([1, 2, 3, 4, 5, 6]);
        const c = p + q;
        const h = Math.sqrt(p * q);
        if (level === 1) {
          const a = Math.sqrt(c * p);
          return task(
            level,
            `Im rechtwinkligen Dreieck ABC mit dem rechten Winkel bei C ist p = ${p} cm und q = ${q} cm. Berechne die Höhe h und die Kathete a.`,
            [num("h =", h, "cm", 2, { slips: [{ value: p * q, hint: "p · q ist h². Ziehe noch die Wurzel." }] }), num("a =", a, "cm", 2, { slips: [{ value: Math.sqrt(c * q), hint: "a liegt am Abschnitt p: a² = c · p." }] })],
            "h² = p · q; c = p + q; a² = c · p",
            [`h² = ${p} · ${q} = ${p * q}`, `c = ${p} cm + ${q} cm = ${c} cm`, `a² = ${c} · ${p} = ${c * p}`],
            `h ${eq(h)} ${fmt(h, 2)} cm, a ${eq(a)} ${fmt(a, 2)} cm`,
            { p, q },
            [`p = ${p} cm, q = ${q} cm`],
          );
        }
        const df = Math.sqrt(c * p);
        return task(
          level,
          `Im Dreieck DEF liegt der rechte Winkel bei F. Die Höhe von F trifft die Hypotenuse DE im Punkt H, mit DH = ${p} cm und HE = ${q} cm. Berechne die Höhe FH und die Kathete DF.`,
          [num("FH =", h, "cm", 2), num("DF =", df, "cm", 2, { slips: [{ value: Math.sqrt(c * q), hint: "DF liegt am Abschnitt DH: DF² = DE · DH." }] })],
          "Skizze: Hypotenuse DE = DH + HE. Höhensatz FH² = DH · HE, Kathetensatz DF² = DE · DH.",
          [`FH² = ${p} · ${q} = ${p * q}`, `DE = ${p} cm + ${q} cm = ${c} cm`, `DF² = ${c} · ${p} = ${c * p}`],
          `FH ${eq(h)} ${fmt(h, 2)} cm, DF ${eq(df)} ${fmt(df, 2)} cm`,
          { p, q },
        );
      },
    },
    {
      id: "kathetensatz",
      make: (rng, level) => {
        const [c, a] = rng.pick(RIGHT);
        const p = (a * a) / c;
        const q = c - p;
        const h = Math.sqrt(p * q);
        if (level === 1) {
          return task(
            level,
            `Im rechtwinkligen Dreieck ABC mit dem rechten Winkel bei C ist die Hypotenuse c = ${c} cm und die Kathete a = ${a} cm lang. Berechne den Abschnitt p und die Höhe h.`,
            [num("p =", p, "cm", 2, { slips: [{ value: c / (a * a), hint: "a² = c · p, also p = a² : c." }] }), num("h =", h, "cm", 2)],
            "Kathetensatz a² = c · p; q = c − p; Höhensatz h² = p · q",
            [`p = ${a}² : ${c} = ${a * a} : ${c} = ${fmt(p, 2)} cm`, `q = ${c} − ${fmt(p, 2)} = ${fmt(q, 2)} cm`, `h² = ${fmt(p, 2)} · ${fmt(q, 2)} = ${fmt(p * q, 2)}`],
            `p = ${fmt(p, 2)} cm, h ${eq(h)} ${fmt(h, 2)} cm`,
            { c, a },
            [`c = ${c} cm, a = ${a} cm`],
          );
        }
        const width = c / 2;
        const scale = width / c;
        const side = a * scale;
        const other = Math.sqrt(c * c - a * a) * scale;
        const gable = h * scale;
        return task(
          level,
          `Ein Dachgiebel ist ein rechtwinkliges Dreieck mit dem rechten Winkel am First. Der Dachboden ist ${fmt(width, 2)} m breit, eine Dachseite ist ${fmt(side, 2)} m lang. Wie hoch ist der Giebel? Wie lang ist die andere Dachseite?`,
          [num("Giebelhöhe:", gable, "m", 2), num("andere Dachseite:", other, "m", 2)],
          "Der Dachboden ist die Hypotenuse. Mit dem Kathetensatz den Abschnitt unter der bekannten Dachseite, dann Höhensatz.",
          [`p = ${fmt(side, 2)}² : ${fmt(width, 2)} = ${fmt(p * scale, 2)} m`, `q = ${fmt(width, 2)} − ${fmt(p * scale, 2)} = ${fmt(q * scale, 2)} m`, `h² = p · q = ${fmt(p * q * scale * scale, 4)}`, `andere Seite² = ${fmt(width, 2)} · ${fmt(q * scale, 2)}`],
          `Giebel ${eq(gable)} ${fmt(gable, 2)} m hoch, andere Dachseite ${eq(other)} ${fmt(other, 2)} m`,
          { c, a },
        );
      },
    },
  ],
});

export const STAGE = makeStage(
  3,
  "Ähnlichkeit, zentrische Streckung, Strahlensätze, Kathetensatz und Höhensatz",
  "#c2410c",
  "△",
  [aehnlich, streckung, berechnen, strahlen, katheten],
);
