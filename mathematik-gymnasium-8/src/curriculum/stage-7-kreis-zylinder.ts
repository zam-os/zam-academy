import { fmt, frac } from "../exercises/format";
import { CONCEPT_DIAGRAMS } from "./concept-diagrams";
import { Q, task } from "./builders";
import { numberField } from "./helpers";
import {
  labBodyModeling,
  labCircleAreaSectors,
  labCircleParts,
  labCirclePiUnroll,
  labCylinderPrismNet,
  labPrismToCylinder,
} from "./labs-4-7";
import { makeLessons } from "./make";
import {
  annulusArea,
  circleArea,
  circleCircumference,
  cylinderLateral,
  cylinderSurface,
  cylinderVolume,
  prismSurface,
  prismVolume,
  sectorArc,
  sectorArea,
} from "./math";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators LB 7 ────────────────────────────────────────────────────────

const exCircleCircumference: ExerciseGenerator = {
  id: "kz-umfang-rechnen",
  make(rng, level) {
    const r = rng.int(3, 12);
    const d = 2 * r;
    const u = circleCircumference(r);
    const useDiameter = level === 2;

    return task(
      level,
      `Berechne den Umfang U eines Kreises mit dem Radius r = ${fmt(r, 0)} cm (auf 2 Dezimalen runden).`,
      `Ein Fahrradreifen hat den Durchmesser d = ${fmt(d, 0)} cm. Welche Strecke legt er bei genau einer vollen Umdrehung zurück?`,
      [
        numberField("Umfang U =", u, "cm", 2, {
          slips: [
            { value: Math.PI * r, hint: `Bei gegebenem Radius r lautet die Formel U = 2 · π · r (nicht nur π · r).` },
            { value: circleArea(r), hint: `π · r² ist der Flächeninhalt, für den Umfang gilt 2 · π · r = π · d.` },
          ],
        }),
      ],
      `U = 2 · π · r = π · d.`,
      useDiameter
        ? `U = π · d = π · ${fmt(d, 0)} cm.`
        : `U = 2 · π · ${fmt(r, 0)} cm.`,
      `U ≈ <strong>${fmt(u, 2)} cm</strong> (= ${fmt(d, 0)}π cm).`,
      { r, d, u },
    );
  },
};

const exCircumferenceInvert: ExerciseGenerator = {
  id: "kz-umfang-sach",
  make(rng, level) {
    const r = rng.int(4, 15);
    const d = 2 * r;
    const u = Number((Math.PI * d).toFixed(2));
    const askRadius = level === 1;

    return task(
      level,
      `Ein Kreis hat den Umfang U = ${fmt(u, 2)} cm. Berechne seinen Durchmesser d und seinen Radius r (auf 1 Dezimale).`,
      `Ein Baumstamm hat einen gemessenen Umfang von U = ${fmt(u, 2)} cm. Wie groß ist sein Durchmesser d (auf 1 Dezimale gerundet)?`,
      [
        ...(askRadius ? [numberField("Radius r =", r, "cm", 1, { absTolerance: 0.15 })] : []),
        numberField("Durchmesser d =", d, "cm", 1, {
          absTolerance: 0.15,
          slips: [{ value: u * Math.PI, hint: `Um d aus U = π · d zu erhalten, teilst du U durch π.` }],
        }),
      ],
      `U = π · d ⇒ d = U / π und r = d / 2.`,
      `d = ${fmt(u, 2)} / π ≈ ${fmt(d, 1)} cm.`,
      `Ergebnis: <strong>d = ${fmt(d, 1)} cm</strong>${askRadius ? ` und <strong>r = ${fmt(r, 1)} cm</strong>` : ""}.`,
      { r, d, u },
    );
  },
};

const exCircleAreaCalc: ExerciseGenerator = {
  id: "kz-flaeche-rechnen",
  make(rng, level) {
    const r = level === 1 ? rng.int(3, 10) : rng.pick([4, 6, 8, 10, 12]);
    const d = 2 * r;
    const area = circleArea(r);

    if (level === 1) {
      return task(
        level,
        `Berechne den Flächeninhalt A eines Kreises mit dem Radius r = ${fmt(r, 0)} cm (auf 2 Dezimalen).`,
        "",
        [
          numberField("Fläche A =", area, "cm²", 2, {
            slips: [
              { value: circleCircumference(r), hint: `2 · π · r ist der Umfang; der Flächeninhalt ist A = π · r².` },
              { value: Math.PI * r, hint: `Quadriere den Radius r: r² = ${fmt(r * r, 0)}.` },
            ],
          }),
        ],
        `A = π · r².`,
        `A = π · (${fmt(r, 0)} cm)² = ${fmt(r * r, 0)} · π cm².`,
        `A ≈ <strong>${fmt(area, 2)} cm²</strong>.`,
        { r, area },
      );
    }

    // Level 2: from smooth square A = r^2 * pi (written as decimal or diameter given)
    const sq = r;
    const areaSq = circleArea(sq);
    return task(
      level,
      "",
      `Eine runde Pizza hat einen Durchmesser von d = ${fmt(d, 0)} cm. Berechne ihren Flächeninhalt A in cm² (auf 2 Dezimalen).`,
      [
        numberField("Fläche A =", areaSq, "cm²", 2, {
          slips: [
            { value: Math.PI * d * d, hint: `Setze in A = π · r² den Radius r = d/2 = ${fmt(r, 0)} cm ein, nicht d.` },
          ],
        }),
      ],
      "",
      `Radius r = d / 2 = ${fmt(r, 0)} cm.`,
      `A = π · ${fmt(r, 0)}² = ${fmt(r * r, 0)}π ≈ <strong>${fmt(areaSq, 2)} cm²</strong>.`,
      { d, r, areaSq },
    );
  },
};

const exAreaNonlinear: ExerciseGenerator = {
  id: "kz-skalierung-nichtlinear",
  make(rng, level) {
    const k = level === 1 ? 2 : rng.pick([2, 3, 4]);
    const factor = k * k;
    const r0 = rng.pick([2, 3]);
    const a0 = circleArea(r0);
    const aNew = circleArea(k * r0);

    return task(
      level,
      `Ein Kreis mit Radius r = ${fmt(r0, 0)} cm hat die Fläche A₁ ≈ ${fmt(a0, 2)} cm². Der Radius wird auf das ${fmt(k, 0)}-Fache vergrößert. Mit welchem Faktor vervielfacht sich A?`,
      `Bei der Flächenformel A(r) = π · r² wird der Radius einer kreisförmigen Bühne von ${fmt(r0, 0)} m auf ${fmt(k * r0, 0)} m vergrößert (${fmt(k, 0)}-facher Radius). Berechne den neuen Flächeninhalt A₂ und den Vergrößerungsfaktor.`,
      [
        numberField("Vergrößerungsfaktor", factor, "", 0, {
          slips: [{ value: k, hint: `Die Fläche wächst quadratisch mit r²: (${fmt(k, 0)}r)² = ${fmt(factor, 0)} · r².` }],
        }),
        ...(level === 2 ? [numberField("Fläche A₂ =", aNew, "m²", 2)] : []),
      ],
      `Ersetze r in A = π · r² durch (${fmt(k, 0)} · r): π · (${fmt(k, 0)}r)² = ${fmt(factor, 0)} · π · r².`,
      `Da r quadratisch in die Formel eingeht, wächst A mit dem Quadrat von ${fmt(k, 0)}.`,
      `Der Flächeninhalt ver-${fmt(factor, 0)}-facht sich (<strong>Faktor ${fmt(factor, 0)}</strong>${level === 2 ? `, A₂ ≈ <strong>${fmt(aNew, 2)} m²</strong>` : ""}).`,
      { k, factor, r0, aNew },
    );
  },
};

const exSectorCalc: ExerciseGenerator = {
  id: "kz-sektor-bogen",
  make(rng, level) {
    const r = rng.pick([4, 6, 8, 9, 10]);
    const alpha = level === 1 ? rng.pick([60, 90, 120, 180]) : rng.pick([45, 72, 135, 150, 240]);
    const arc = sectorArc(r, alpha);
    const area = sectorArea(r, alpha);

    return task(
      level,
      `Berechne für einen Kreissektor mit Radius r = ${fmt(r, 0)} cm und Mittelpunktswinkel α = ${fmt(alpha, 0)}° die Bogenlänge b und den Flächeninhalt A_Sektor.`,
      `Ein Scheibenwischer oder Tortenausschnitt überstreicht bei Radius r = ${fmt(r, 0)} cm einen Winkel von α = ${fmt(alpha, 0)}°. Berechne Bogenlänge b und Fläche A_Sektor (auf 2 Dezimalen).`,
      [
        numberField("Bogenlänge b =", arc, "cm", 2),
        numberField("Sektorfläche A =", area, "cm²", 2),
      ],
      `Anteil am Vollkreis: ${fmt(alpha, 0)}° / 360°. Multipliziere damit U bzw. A.`,
      `b = 2π · ${fmt(r, 0)} · (${fmt(alpha, 0)}/360) ≈ ${fmt(arc, 2)} cm.`,
      `A_Sektor = π · ${fmt(r, 0)}² · (${fmt(alpha, 0)}/360) ≈ <strong>${fmt(area, 2)} cm²</strong> (<strong>b ≈ ${fmt(arc, 2)} cm</strong>).`,
      { r, alpha, arc, area },
    );
  },
};

const exAnnulusCalc: ExerciseGenerator = {
  id: "kz-kreisring",
  make(rng, level) {
    const rIn = rng.int(2, 6);
    const rOut = rIn + (level === 1 ? rng.int(2, 4) : rng.int(3, 6));
    const area = annulusArea(rOut, rIn);

    return task(
      level,
      `Berechne den Flächeninhalt eines Kreisrings mit Außenradius R = ${fmt(rOut, 0)} cm und Innenradius r = ${fmt(rIn, 0)} cm.`,
      `Um ein rundes Blumenbeet mit Radius r = ${fmt(rIn, 0)} m verläuft ein Weg, sodass der gesamte Außenkreis den Radius R = ${fmt(rOut, 0)} m hat. Welche Fläche besitzt der Weg (Kreisring)?`,
      [
        numberField("Ringfläche A =", area, level === 1 ? "cm²" : "m²", 2, {
          slips: [
            { value: circleArea(rOut - rIn), hint: `Man darf nicht erst R − r rechnen: A = π·R² − π·r² = π·(R² − r²), nicht π·(R − r)²!` },
          ],
        }),
      ],
      `A_Ring = π · (R² − r²).`,
      `A_Ring = π · (${fmt(rOut, 0)}² − ${fmt(rIn, 0)}²) = π · (${fmt(rOut * rOut, 0)} − ${fmt(rIn * rIn, 0)}) = ${fmt(rOut * rOut - rIn * rIn, 0)}π.`,
      `A_Ring ≈ <strong>${fmt(area, 2)} ${level === 1 ? "cm²" : "m²"}</strong>.`,
      { rIn, rOut, area },
    );
  },
};

const exCylinderSurface: ExerciseGenerator = {
  id: "kz-mantel-oberflaeche",
  make(rng, level) {
    const r = rng.int(2, 5);
    const h = rng.int(3, 7);
    const m = cylinderLateral(r, h);
    const o = cylinderSurface(r, h);

    return task(
      level,
      `Ein gerader Kreiszylinder hat den Radius r = ${fmt(r, 0)} cm und die Höhe h = ${fmt(h, 0)} cm. Berechne Mantelfläche M und Oberflächeninhalt O (auf 2 Dezimalen).`,
      `Eine Konservendose hat den Radius r = ${fmt(r, 0)} cm und die Höhe h = ${fmt(h, 0)} cm. Wie groß sind das Etikett (Mantelfläche M) und der gesamte Blechbedarf O (Deckel, Boden und Mantel)?`,
      [
        numberField("Mantelfläche M =", m, "cm²", 2),
        numberField("Oberfläche O =", o, "cm²", 2, {
          slips: [
            { value: circleArea(r) + m, hint: `Ein Zylinder hat ZWEI Grundflächen (Boden und Deckel): O = 2 · πr² + M.` },
          ],
        }),
      ],
      `M = 2 · π · r · h (aufgerolltes Rechteck); O = 2 · G + M = 2 · π · r² + 2 · π · r · h.`,
      `M = 2 · π · ${fmt(r, 0)} · ${fmt(h, 0)} ≈ ${fmt(m, 2)} cm², 2 · G = 2 · π · ${fmt(r * r, 0)} ≈ ${fmt(2 * circleArea(r), 2)} cm².`,
      `O ≈ <strong>${fmt(o, 2)} cm²</strong> (bei <strong>M ≈ ${fmt(m, 2)} cm²</strong>).`,
      { r, h, m, o },
    );
  },
};

const exPrismNetSurface: ExerciseGenerator = {
  id: "kz-prisma-netz",
  make(rng, level) {
    // Right triangular prism (3-4-5 right triangle or equilateral base? Right triangle 3-4-5 or 6-8-10 gives exact integers!)
    const scale = level === 1 ? 1 : rng.pick([1, 2]);
    const a = 3 * scale;
    const b = 4 * scale;
    const c = 5 * scale;
    const h = rng.int(4, 10);
    const G = (a * b) / 2;
    const U = a + b + c;
    const M = U * h;
    const O = prismSurface(G, U, h);

    return task(
      level,
      `Ein gerades Dreiecksprisma hat als Grundfläche ein rechtwinkliges Dreieck mit den Seiten a = ${fmt(a, 0)} cm, b = ${fmt(b, 0)} cm (rechter Winkel zwischen a und b), c = ${fmt(c, 0)} cm und die Höhe h = ${fmt(h, 0)} cm. Berechne Grundfläche G und Oberfläche O.`,
      `Im Netz eines geraden Prismas mit der Höhe h = ${fmt(h, 0)} cm bilden die drei Seitenflächen ein langes Mantelrechteck der Breite U = ${fmt(a, 0)} + ${fmt(b, 0)} + ${fmt(c, 0)} cm. Die Grundfläche ist ein rechtwinkliges Dreieck mit Katheten ${fmt(a, 0)} cm und ${fmt(b, 0)} cm. Berechne die Gesamtoberfläche O.`,
      [
        ...(level === 1 ? [numberField("Grundfläche G =", G, "cm²", 0)] : []),
        numberField("Oberfläche O =", O, "cm²", 0, {
          slips: [
            { value: G + M, hint: `Addiere BEIDE Grundflächen (Deck- und Grundfläche): O = 2 · G + M.` },
          ],
        }),
      ],
      `G = (a · b) / 2; Mantelrechteck M = (a + b + c) · h; O = 2 · G + M.`,
      `G = (${fmt(a, 0)} · ${fmt(b, 0)}) / 2 = ${fmt(G, 0)} cm², U = ${fmt(U, 0)} cm ⇒ M = ${fmt(U, 0)} · ${fmt(h, 0)} = ${fmt(M, 0)} cm².`,
      `O = 2 · ${fmt(G, 0)} + ${fmt(M, 0)} = <strong>${fmt(O, 0)} cm²</strong>.`,
      { a, b, c, h, G, M, O },
    );
  },
};

const exCylinderVolume: ExerciseGenerator = {
  id: "kz-zylinder-volumen",
  make(rng, level) {
    const r = rng.int(3, 5);
    const h = rng.int(3, 6);
    const v = cylinderVolume(r, h);

    return task(
      level,
      `Berechne das Volumen V eines geraden Kreiszylinders mit Radius r = ${fmt(r, 0)} cm und Höhe h = ${fmt(h, 0)} cm (auf 2 Dezimalen).`,
      `Ein zylindrischer Messbecher hat den Innendurchmesser d = ${fmt(2 * r, 0)} cm und ist bis zur Höhe h = ${fmt(h, 0)} cm mit Wasser gefüllt. Wie viel cm³ Wasser befinden sich darin?`,
      [
        numberField("Volumen V =", v, "cm³", 2, {
          slips: [
            { value: cylinderLateral(r, h), hint: `2 · π · r · h ist die Mantelfläche; für das Volumen gilt V = π · r² · h.` },
            ...(level === 2 ? [{ value: Math.PI * (2 * r) * (2 * r) * h, hint: `Setze den Radius r = d/2 = ${fmt(r, 0)} cm ein, nicht den Durchmesser d.` }] : []),
          ],
        }),
      ],
      `V = G · h = π · r² · h.`,
      `G = π · ${fmt(r, 0)}² = ${fmt(r * r, 0)}π cm².`,
      `V = ${fmt(r * r, 0)}π · ${fmt(h, 0)} ≈ <strong>${fmt(v, 2)} cm³</strong>.`,
      { r, h, v },
    );
  },
};

const exPrismVolume: ExerciseGenerator = {
  id: "kz-prisma-volumen",
  make(rng, level) {
    const g = rng.int(8, 25);
    const h = rng.int(4, 11);
    const v = prismVolume(g, h);

    if (level === 1) {
      return task(
        level,
        `Ein gerades Sechseckprisma hat die Grundfläche G = ${fmt(g, 0)} cm² und die Höhe h = ${fmt(h, 0)} cm. Berechne sein Volumen V.`,
        "",
        [
          numberField("Volumen V =", v, "cm³", 0),
        ],
        `Für jedes gerade Prisma gilt unabhängig von der Grundflächen-Form: V = G · h.`,
        `V = ${fmt(g, 0)} cm² · ${fmt(h, 0)} cm.`,
        `V = <strong>${fmt(v, 0)} cm³</strong>.`,
        { g, h, v },
      );
    }

    // Level 2: height from volume and base area
    const b1 = rng.int(4, 8);
    const b2 = rng.int(3, 6);
    const baseTri = (b1 * b2) / 2;
    const hPrism = rng.int(5, 10);
    const vTri = baseTri * hPrism;
    return task(
      level,
      "",
      `Ein gerades Dreiecksprisma hat ein rechtwinkliges Dreieck (Katheten ${fmt(b1, 0)} cm und ${fmt(b2, 0)} cm) als Grundfläche und ein Volumen von V = ${fmt(vTri, 0)} cm³. Berechne seine Höhe h.`,
      [
        numberField("Grundfläche G =", baseTri, "cm²", 1),
        numberField("Höhe h =", hPrism, "cm", 1),
      ],
      "",
      `G = (${fmt(b1, 0)} · ${fmt(b2, 0)}) / 2 = ${fmt(baseTri, 1)} cm².`,
      `Aus V = G · h folgt h = ${fmt(vTri, 0)} / ${fmt(baseTri, 1)} = <strong>${fmt(hPrism, 1)} cm</strong>.`,
      { b1, b2, baseTri, hPrism, vTri },
    );
  },
};

const exBodyStoryVolume: ExerciseGenerator = {
  id: "kz-sach-volumen",
  make(rng, level) {
    // 1 liter = 1000 cm^3; cylindrical tank with r in cm, h in cm -> liters
    const r = rng.pick([10, 15, 20]);
    const h = rng.pick([20, 25, 30, 40]);
    const vCm3 = cylinderVolume(r, h);
    const liters = vCm3 / 1000;

    return task(
      level,
      `Ein zylindrisches Gefäß hat Radius r = ${fmt(r, 0)} cm und Höhe h = ${fmt(h, 0)} cm. Wie viele Liter (1 l = 1000 cm³) fasst es maximal?`,
      `Ein runder Regenwassertank misst innen d = ${fmt(2 * r, 0)} cm im Durchmesser und h = ${fmt(h, 0)} cm in der Höhe. Berechne das Fassungsvermögen in Litern (auf 2 Dezimalen runden).`,
      [
        numberField("Fassungsvermögen =", liters, "l", 2, {
          slips: [
            { value: vCm3, hint: `Rechne das Ergebnis von cm³ durch Teilen durch 1000 noch in Liter (dm³) um.` },
          ],
        }),
      ],
      `Zuerst V = π · r² · h in cm³ berechnen, danach durch 1000 teilen.`,
      `V = π · ${fmt(r, 0)}² · ${fmt(h, 0)} ≈ ${fmt(vCm3, 1)} cm³.`,
      `In Litern: ${fmt(vCm3, 1)} : 1000 ≈ <strong>${fmt(liters, 2)} l</strong>.`,
      { r, h, vCm3, liters },
    );
  },
};

const exCompositeBody: ExerciseGenerator = {
  id: "kz-zusammengesetzt",
  make(rng, level) {
    const a = rng.pick([4, 6]);
    const hBox = rng.int(2, 4);
    const rTop = a / 2 - 1;
    const hTop = rng.int(2, 4);
    const vBox = a * a * hBox;
    const vCyl = cylinderVolume(rTop, hTop);
    const vTotal = vBox + vCyl;
    const oTotal = 2 * a * a + 4 * a * hBox + cylinderLateral(rTop, hTop);

    return task(
      level,
      `Auf einem quadratischen Quader (${fmt(a, 0)} cm × ${fmt(a, 0)} cm × ${fmt(hBox, 0)} cm) steht zentriert ein Zylinder (r = ${fmt(rTop, 0)} cm, h = ${fmt(hTop, 0)} cm). Berechne das Gesamtvolumen V.`,
      `Eine Trophäe besteht aus einem Quadersockel (${fmt(a, 0)} cm × ${fmt(a, 0)} cm × ${fmt(hBox, 0)} cm) und einer aufgesetzten Zylindersäule (r = ${fmt(rTop, 0)} cm, h = ${fmt(hTop, 0)} cm). Berechne Gesamtvolumen V und die sichtbare Außenoberfläche O (die Klebefläche entfällt!).`,
      [
        numberField("Gesamtvolumen V =", vTotal, "cm³", 2),
        ...(level === 2 ? [numberField("Außenfläche O =", oTotal, "cm²", 2)] : []),
      ],
      `V_ges = V_Quader + V_Zylinder = a² · h₁ + π · r² · h₂.`,
      `V_Quader = ${fmt(vBox, 0)} cm³, V_Zylinder = π · ${fmt(rTop, 0)}² · ${fmt(hTop, 0)} ≈ ${fmt(vCyl, 2)} cm³.`,
      level === 1
        ? `V_ges = <strong>${fmt(vTotal, 2)} cm³</strong>.`
        : `V_ges = <strong>${fmt(vTotal, 2)} cm³</strong>; Außenfläche O = O_Quader + M_Zylinder = <strong>${fmt(oTotal, 2)} cm²</strong>.`,
      { a, hBox, rTop, hTop, vBox, vCyl, vTotal, oTotal },
    );
  },
};

export const STAGE_7_LESSONS = makeLessons([
  {
    id: "kz-1-pi-umfang",
    section: "7",
    title: "Kreiszahl π und Kreisumfang",
    subtitle: "Vom Messen am Abrollkreis zur Formel U = 2 · π · r = π · d",
    whyItMatters: "Die Kreiszahl π verbindet Durchmesser und Umfang jedes runden Rades, Rohrs oder Planeten auf der Welt.",
    explanationHtml: `<p>Rollt man einen beliebigen Kreis genau einmal ab, stellt man fest: Das Verhältnis aus <strong>Kreisumfang U</strong> und <strong>Durchmesser d</strong> ist bei jedem Kreis gleich groß! Diese Konstante heißt <strong>Kreiszahl π</strong> (Pi ≈ 3,14159…).</p>
<p class="formula-line">U = π · d = 2 · π · r</p>
${CONCEPT_DIAGRAMS.kz1}
<div class="example"><strong>Beispiel:</strong> Ein Kreis hat den Durchmesser d = 2 cm (also r = 1 cm).<br>Umfang: U = π · 2 cm ≈ 3,1416 · 2 cm ≈ 6,28 cm.<br>Umgekehrt: Kennt man U = 31,42 cm, liefert d = U / π ≈ 10,0 cm.</div>
<div class="merke"><strong>Merke:</strong> U = 2 · π · r (mit Radius) bzw. U = π · d (mit Durchmesser d = 2r). Die Zahl π ≈ 3,14 ist eine feste Naturkonstante der Geometrie.</div>`,
    formulas: [
      { name: "Kreisumfang", html: "U = 2 · π · r = π · d", quantities: "π ≈ 3,14159; d = 2 · r" },
    ],
    quiz: Q(
      "Welcher Quotient ist bei allen Kreisen unabhängig von ihrer Größe immer gleich π?",
      "Umfang U geteilt durch Durchmesser d (U / d)",
      "Durchmesser d geteilt durch Umfang U (d / U)",
      "Radius r geteilt durch Umfang U (r / U)",
      "Der Umfang ist direkt proportional zum Durchmesser mit Proportionalitätsfaktor π: U = π · d.",
    ),
    lab: labCirclePiUnroll,
    exercises: [exCircleCircumference, exCircumferenceInvert],
    celebrationMessage: "Du verstehst die Kreiszahl π und berechnest Kreisumfänge sicher.",
  },
  {
    id: "kz-2-kreisflaeche",
    section: "7",
    title: "Flächeninhalt des Kreises",
    subtitle: "Die Formel A = π · r² plausibel machen und als nicht lineare Zuordnung deuten",
    whyItMatters: "Ob Pizza-Preisvergleich oder Rohrquerschnitt: Weil r quadratisch eingeht, bringt ein doppelter Durchmesser gleich die vierfache Fläche!",
    explanationHtml: `<p>Schneidet man einen Kreis in viele schmale Tortenstücke (Sektoren) und legt diese abwechselnd nach oben und unten nebeneinander, entsteht näherungsweise ein Rechteck mit der Breite „halber Umfang“ (π · r) und der Höhe r:</p>
<p class="formula-line">A = (π · r) · r = π · r²</p>
<p>Im Unterschied zum Umfang (linear) ist <strong>r ↦ π · r²</strong> eine <strong>nicht lineare Zuordnung</strong>: Verdoppelt sich der Radius r, vervierfacht (2² = 4) sich der Flächeninhalt!</p>
${CONCEPT_DIAGRAMS.kz2}
<div class="example"><strong>Beispiel:</strong> r = 3 cm → A = π · 3² = 9π ≈ 28,27 cm².<br>Verdoppelter Radius r = 6 cm → A = π · 6² = 36π ≈ 113,10 cm² (= 4 · 28,27 cm²!).</div>
<div class="merke"><strong>Merke:</strong> Umfang U = 2πr (Einheit cm), Flächeninhalt A = πr² (Einheit cm²). Achte bei gegebenem Durchmesser d immer darauf, zuerst r = d / 2 zu halbieren!</div>`,
    formulas: [
      { name: "Kreisfläche", html: `A = π · r² = ${frac("1", "4")} · π · d²`, quantities: "nicht lineare Zuordnung: r ↦ π·r²" },
    ],
    quiz: Q(
      "Ein runder Tisch hat doppelt so großen Radius wie ein kleiner Beistelltisch. Wie viel größer ist seine Tischfläche?",
      "4-mal so groß (2² = 4)",
      "2-mal so groß",
      "8-mal so groß",
      "Da der Radius in A = π · r² quadriert wird, vervierfacht sich bei doppeltem Radius der Flächeninhalt.",
    ),
    lab: labCircleAreaSectors,
    exercises: [exCircleAreaCalc, exAreaNonlinear],
    celebrationMessage: "Du verstehst A = π · r² und ihre quadratische Abhängigkeit.",
  },
  {
    id: "kz-3-kreisteile",
    section: "7",
    title: "Kreissektor, Kreisbogen und Kreisring",
    subtitle: "Einfache Kreisteile anteilig am Vollkreis berechnen",
    whyItMatters: "Gebogene Wege, Tortendiagramme und Scheibenwischer oder Ringe sind genau Bruchteile ganzer Kreise.",
    explanationHtml: `<p>Ein <strong>Kreissektor</strong> mit dem Mittelpunktswinkel α nimmt genau den Anteil <strong>α / 360°</strong> des Vollkreises ein. Damit gelten für Bogenlänge b und Sektorfläche:</p>
<ul><li><strong>Bogenlänge:</strong> b = 2 · π · r · ${frac("α", "360°")}</li><li><strong>Sektorfläche:</strong> A<sub>Sektor</sub> = π · r² · ${frac("α", "360°")}</li><li><strong>Kreisring</strong> (Außenradius R, Innenradius r): A<sub>Ring</sub> = π · R² − π · r² = π · (R² − r²).</li></ul>
${CONCEPT_DIAGRAMS.kz3}
<div class="example"><strong>Beispiel:</strong><br>• Sektor mit r = 4 cm, α = 90° (Viertelkreis): b = 2π·4 · 1/4 = 2π ≈ 6,28 cm; A = π·16 · 1/4 = 4π ≈ 12,57 cm².<br>• Kreisring mit R = 5 cm, r = 3 cm: A = π · (5² − 3²) = 16π ≈ 50,27 cm².</div>
<div class="merke"><strong>Merke:</strong> Beim Kreisring niemals erst R − r rechnen: π · (R − r)² ist falsch, richtig ist π · (R² − r²)!</div>`,
    formulas: [
      { name: "Kreisbogen & Sektor", html: `b = 2πr · ${frac("α", "360°")} &nbsp;|&nbsp; A = πr² · ${frac("α", "360°")}`, quantities: "α Mittelpunktswinkel in Grad" },
      { name: "Kreisring", html: "A<sub>Ring</sub> = π · (R² − r²)", quantities: "R Außenradius, r Innenradius" },
    ],
    quiz: Q(
      "Wie groß ist die Fläche eines Halbkreises (α = 180°) mit Radius r = 6 cm?",
      "18π cm² (≈ 56,55 cm²)",
      "36π cm² (≈ 113,10 cm²)",
      "6π cm² (≈ 18,85 cm²)",
      "Halbkreisfläche = (1/2) · π · 6² = (1/2) · 36π = 18π cm².",
    ),
    lab: labCircleParts,
    exercises: [exSectorCalc, exAnnulusCalc],
    celebrationMessage: "Du berechnest Bogenlängen, Kreissektoren und Kreisringe sicher.",
  },
  {
    id: "kz-4-schraegbild-netz",
    section: "7",
    title: "Schrägbilder, Netze und Oberfläche von Prisma & Zylinder",
    subtitle: "Körper fachsprachlich beschreiben und O = 2·G + M begründen",
    whyItMatters: "Vom Blechverbrauch einer Dose bis zur Kartonverpackung: Das Netz zerlegt jeden geraden Körper in einfache Flächen.",
    explanationHtml: `<p>Ein <strong>gerades Prisma</strong> hat zwei parallele, kongruente Vielecke als <strong>Grund- und Deckfläche (G)</strong> und Rechtecke als Seitenflächen. Beim <strong>geraden Kreiszylinder</strong> sind Grund- und Deckfläche zwei kongruente Kreise mit Radius r.</p>
<p>Klappt man die gekrümmte <strong>Mantelfläche M</strong> des Zylinders zu einem Netz auf, entsteht ein <strong>Rechteck</strong> mit Breite = Kreisumfang 2πr und Höhe h. Deshalb gilt für die Oberfläche:</p>
<p class="formula-line">O = 2 · G + M = 2 · π · r² + 2 · π · r · h</p>
${CONCEPT_DIAGRAMS.kz4}
<div class="example"><strong>Beispiel Zylinder (r = 3 cm, h = 5 cm):</strong><br>2 · G = 2 · π · 3² = 18π ≈ 56,55 cm².<br>M = 2 · π · 3 · 5 = 30π ≈ 94,25 cm².<br>O = 48π ≈ 150,80 cm².</div>
<div class="merke"><strong>Merke:</strong> Im Schrägbild erscheinen verdeckte Kanten gestrichelt und Grundkreise als Ellipsen; im Netz siehst du die wahren Längen U und h der Mantelfläche.</div>`,
    formulas: [
      { name: "Zylinder-Mantelfläche", html: "M = U · h = 2 · π · r · h", quantities: "aufgerollt ein Rechteck der Breite 2πr und Höhe h" },
      { name: "Oberfläche (Prisma & Zylinder)", html: "O = 2 · G + M", quantities: "G Grundfläche, M Mantelfläche" },
    ],
    quiz: Q(
      "Welche geometrische Form besitzt die abgewickelte Mantelfläche eines geraden Kreiszylinders?",
      "Ein Rechteck mit den Seitenlängen 2πr (Umfang) und h (Höhe).",
      "Einen Halbkreis mit Radius h.",
      "Ein Dreieck mit Grundlinie 2r.",
      "Schneidet man den Mantel senkrecht auf und rollt ihn glatt ab, entsteht ein Rechteck mit Breite U = 2πr und Höhe h.",
    ),
    lab: labCylinderPrismNet,
    exercises: [exCylinderSurface, exPrismNetSurface],
    celebrationMessage: "Du beschreibst Schrägbilder, Netze und Oberflächen sicher.",
  },
  {
    id: "kz-5-volumen",
    section: "7",
    title: "Volumen von Prismen und Zylindern",
    subtitle: "Warum V = G · h für jedes gerade Prisma und als Grenzfall für den Zylinder gilt",
    whyItMatters: "Sobald du V = G · h verinnerlicht hast, brauchst du für Dreiecks-, Sechseckprismen und Zylinder nur eine einzige Grundidee.",
    explanationHtml: `<p>Jedes gerade Prisma lässt sich in gleich hohe Schichten (wie Münz- oder Kartonstapel) der Grundfläche G zerlegen — oder aus Dreiecksprismen zusammensetzen. Deshalb hängt sein Volumen unabhängig von der Form der Grundfläche immer nur von G und Höhe h ab: <strong>V = G · h</strong>.</p>
<p>Erhöht man bei einem einem Kreis einbeschriebenen regelmäßigen n-Eck-Prisma die Eckenzahl n immer weiter (4-Eck → 8-Eck → 16-Eck → …), nähert sich das Prisma beliebig genau dem <strong>geraden Kreiszylinder</strong> an (G<sub>n</sub> → π·r²):</p>
<p class="formula-line">V<sub>Zylinder</sub> = G · h = π · r² · h</p>
${CONCEPT_DIAGRAMS.kz5}
<div class="example"><strong>Beispiel:</strong> Gerader Kreiszylinder mit r = 3 cm und h = 4 cm.<br>Grundfläche G = π · 3² = 9π ≈ 28,27 cm².<br>Volumen V = G · h = 36π ≈ 113,10 cm³.</div>
<div class="merke"><strong>Merke:</strong> V = G · h gilt sowohl für alle geraden Prismen als auch (im Grenzfall) für den geraden Kreiszylinder!</div>`,
    formulas: [
      { name: "Prismavolumen", html: "V = G · h", quantities: "G beliebige Vieleck-Grundfläche, h Körperhöhe" },
      { name: "Zylindervolumen", html: "V = π · r² · h", quantities: "Grenzfall des Prismas mit G = π·r²" },
    ],
    quiz: Q(
      "Warum lässt sich die Formel V = π · r² · h für den geraden Kreiszylinder durch Prismen begründen?",
      "Weil sich ein Kreis durch regelmäßige n-Ecke mit großem n beliebig genau annähern lässt und V_Prisma = G_n · h stets gilt.",
      "Weil jeder Zylinder genau sechs rechteckige Seitenflächen hat.",
      "Weil der Umfang eines Kreises gleich seinem Volumen ist.",
      "Für n → ∞ strebt die Grundfläche G_n des einbeschriebenen regelmäßigen Prismas gegen π · r², sodass G · h zu π · r² · h wird.",
    ),
    lab: labPrismToCylinder,
    exercises: [exCylinderVolume, exPrismVolume],
    celebrationMessage: "Du begründest und berechnest Prismen- und Zylindervolumina sicher.",
  },
  {
    id: "kz-6-modellieren",
    section: "7",
    title: "Körper in Sachzusammenhängen modellieren",
    subtitle: "Annahmen treffen, zusammengesetzte Körper zerlegen und Ergebnisse prüfen",
    whyItMatters: "Reale Tanks, Rohre, Türme oder Verpackungen kombinieren Quader, Prismen und Zylinder — kluges Zerlegen spart Arbeit.",
    explanationHtml: `<p>Bei Anwendungsaufgaben überträgst du zuerst die reale Situation in ein klares <strong>mathematisches Modell</strong>:</p>
<ol class="steps"><li><strong>Skizze &amp; Annahmen:</strong> Welche Grundkörper (Quader, Prisma, Zylinder) setzen die Figur zusammen? Welche Maße sind gegeben oder sinnvoll abzuschätzen?</li><li><strong>Einheiten angleichen:</strong> Alles vor dem Rechnen auf cm oder dm (= Liter!) bringen (1 l = 1 dm³ = 1000 cm³).</li><li><strong>Rechnen &amp; Dokumentieren:</strong> Volumina addieren/subtrahieren; bei Oberflächen Klebeflächen weglassen und das Ergebnis sinnvoll runden!</li></ol>
${CONCEPT_DIAGRAMS.kz6}
<div class="example"><strong>Beispiel:</strong> Ein Tank besteht aus einem Quader (6 × 6 × 4 cm → 144 cm³) und einem aufgesetzten Zylinder (r = 2 cm, h = 3 cm → 12π ≈ 37,70 cm³).<br>Gesamtvolumen V = 144 + 37,70 = 181,70 cm³.<br>Bei der Außenfläche entfällt die Kreisfläche zwischen beiden Teilen!</div>
<div class="merke"><strong>Merke:</strong> Immer zuerst Einheiten vereinheitlichen, Skizze beschriften, rechenbare Teilkörper trennen und die Größenordnung am Schluss auf Plausibilität prüfen!</div>`,
    formulas: [
      { name: "Volumeneinheit Liter", html: "1 l = 1 dm³ = 1000 cm³", quantities: "1 m³ = 1000 l" },
      { name: "Zusammengesetzte Körper", html: "V<sub>ges</sub> = V₁ + V₂ &nbsp;|&nbsp; Klebeflächen nicht mitzählen", quantities: "bei O nur sichtbare Außenflächen addieren" },
    ],
    quiz: Q(
      "Auf einem Würfel klebt ein Zylinder mit Grundfläche G_Z. Wie wirkt sich die Klebefläche auf die Gesamtoberfläche aus?",
      "Sie wird verdeckt und zählt nicht zur sichtbaren Außenfläche, sodass O_ges = O_Quader + M_Zylinder gilt.",
      "Man addiert die volle Oberfläche beider Körper einfach zusammen.",
      "Die Klebefläche verdoppelt das Gesamtvolumen.",
      "Da die Unterseite des Zylinders einen genauso großen Teil der Würfeloberseite verdeckt, bleibt O_ges = O_Würfel + M_Zylinder.",
    ),
    lab: labBodyModeling,
    exercises: [exBodyStoryVolume, exCompositeBody],
    celebrationMessage: "Etappe 7 geschafft: Du meisterst alle sieben Lernbereiche von Mathematik 8 Gymnasium!",
  },
]);
