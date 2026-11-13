import { choiceField, intField, numberField } from "./helpers";
import { countPhrase, Q, task } from "./builders";
import { makeLessons } from "./make";
import {
  labAxisSym,
  labLineCross,
  labLociModel,
  labMultiCrossing,
  labParallelTransversal,
  labPerpBisectAngle,
  labPointSym,
  labPolygonTriangulation,
  labQuadHouse,
  labTriangleProof,
} from "./labs";
import { polygonAngleSum } from "./math";
import { fmt, fmtUnit, frac, MINUS, paren } from "../exercises/format";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators 2.1 (Achsensymmetrie) ────────────────────────────────────────

const exAxisCoords: ExerciseGenerator = {
  id: "achsenspiegelung-koordinaten",
  make(rng, level) {
    const axisVertical = (rng.sign() > 0);
    const axisPos = level === 1 ? 0 : rng.pick([-2, -1, 1, 2, 3]);
    const px = rng.int(-5, 5);
    const py = rng.int(-5, 5);
    // Avoid point lying directly on the axis so mirror differs cleanly
    const xSafe = axisVertical && px === axisPos ? px + 2 : px;
    const ySafe = !axisVertical && py === axisPos ? py + 2 : py;

    const qx = axisVertical ? 2 * axisPos - xSafe : xSafe;
    const qy = axisVertical ? ySafe : 2 * axisPos - ySafe;
    const dist = Math.abs(qx - xSafe) + Math.abs(qy - ySafe);
    const axisDesc = axisVertical
      ? axisPos === 0
        ? "y-Achse (Gerade x = 0)"
        : `Senkrechten durch x = ${fmt(axisPos, 0)}`
      : axisPos === 0
        ? "x-Achse (Gerade y = 0)"
        : `Waagrechten durch y = ${fmt(axisPos, 0)}`;

    if (level === 1) {
      return task(
        level,
        `Spiegele den Punkt P(${fmt(xSafe, 0)} | ${fmt(ySafe, 0)}) an der ${axisDesc}. Gib die Koordinaten von P' und den Abstand |PP'| an.`,
        "",
        [
          intField("x-Koordinate x'", qx, [
            {
              value: axisVertical ? (axisPos === 0 ? xSafe : -xSafe - axisPos) : xSafe + 1,
              hint: axisVertical
                ? `Die Entfernung zur Achse x = ${fmt(axisPos, 0)} bleibt auf beiden Seiten gleich: x' = 2 · ${fmt(axisPos, 0)} ${MINUS} (${fmt(xSafe, 0)}).`
                : `Bei Spiegelung an einer waagrechten Achse bleibt die x-Koordinate unverändert.`,
            },
          ]),
          intField("y-Koordinate y'", qy, [
            {
              value: !axisVertical ? (axisPos === 0 ? ySafe : -ySafe - axisPos) : ySafe + 1,
              hint: !axisVertical
                ? `Die Entfernung zur Achse y = ${fmt(axisPos, 0)} bleibt gleich: y' = 2 · ${fmt(axisPos, 0)} ${MINUS} (${fmt(ySafe, 0)}).`
                : `Bei Spiegelung an einer senkrechten Achse bleibt die y-Koordinate unverändert.`,
            },
          ]),
        ],
        `Die Verbindungsstrecke [PP'] steht senkrecht auf der Symmetrieachse und wird von ihr halbiert.`,
        axisVertical
          ? `Abstand zur Achse x = ${fmt(axisPos, 0)} ist ${Math.abs(xSafe - axisPos)}, auf der anderen Seite liegt x' = ${fmt(qx, 0)}; y' = ${fmt(ySafe, 0)} bleibt.`
          : `Abstand zur Achse y = ${fmt(axisPos, 0)} ist ${Math.abs(ySafe - axisPos)}, auf der anderen Seite liegt y' = ${fmt(qy, 0)}; x' = ${fmt(xSafe, 0)} bleibt.`,
        `Bildpunkt: <strong>P'(${fmt(qx, 0)} | ${fmt(qy, 0)})</strong> (Streckenlänge |PP'| = ${dist}).`,
        { xSafe, ySafe, qx, qy },
      );
    }

    return task(
      level,
      "",
      `Zwei zueinander achsensymmetrische Punkte sind P(${fmt(xSafe, 0)} | ${fmt(ySafe, 0)}) und P'(${fmt(qx, 0)} | ${fmt(qy, 0)}). An welcher Geraden (${axisVertical ? "x = a" : "y = b"}) wurde gespiegelt, und wie groß ist der Abstand eines jeden Punktes zur Symmetrieachse?`,
      [
        intField(axisVertical ? "Achsenlage a (x = a)" : "Achsenlage b (y = b)", axisPos, [
          {
            value: 2 * axisPos,
            hint: `Die Symmetrieachse geht genau durch die MITTE zwischen P und P': (Koordinate P + Koordinate P') : 2.`,
          },
        ]),
        numberField("Abstand zur Achse", dist / 2, "LE", 1, {
          absTolerance: 0.05,
          slips: [
            {
              value: dist,
              hint: `${fmt(dist, 0)} LE ist der volle Abstand zwischen P und P'; bis zur Achse ist es genau die Hälfte!`,
            },
          ],
        }),
      ],
      "",
      `Die Symmetrieachse halbiert [PP']: Mittelpunkt zwischen ${fmt(axisVertical ? xSafe : ySafe, 0)} und ${fmt(axisVertical ? qx : qy, 0)} ist ${fmt(axisPos, 0)}.`,
      `Achse: <strong>${axisVertical ? `x = ${fmt(axisPos, 0)}` : `y = ${fmt(axisPos, 0)}`}</strong>; Abstand beider Punkte zur Achse: <strong>${fmtUnit(dist / 2, "LE", 1)}</strong>.`,
      { axisPos, dist },
    );
  },
};

const exAxisProperty: ExerciseGenerator = {
  id: "achsensymmetrie-eigenschaft",
  make(rng, level) {
    const d1 = rng.int(4, 9);
    const d2 = rng.int(3, 8);
    const halfSpan = rng.int(2, 6);

    return task(
      level,
      `Der Punkt A liegt auf der Symmetrieachse a, P' ist der Bildpunkt von P. Vom Achsenpunkt A bis P sind es ${fmtUnit(d1, "cm", 0)}. Wie weit ist A von P' entfernt, und welchen Winkel schließen [PP'] und die Achse a ein?`,
      `Bei einer Konstruktion mit Zirkel und Lineal wählst du zwei Punkte A und B auf der Symmetrieachse a und schlägst Kreise mit |AP| = ${fmtUnit(d1, "cm", 0)} bzw. |BP| = ${fmtUnit(d2, "cm", 0)}, um P' zu finden. Wenn die Strecke [PP'] die Länge ${fmtUnit(2 * halfSpan, "cm", 0)} hat, wie groß sind |AP'| und der Abstand von P zur Achse a?`,
      level === 1
        ? [
            intField("Entfernung |AP'|", d1, [
              {
                value: 2 * d1,
                hint: `Jeder Punkt auf der Symmetrieachse ist von Punkt P und Bildpunkt P' exakt gleich weit entfernt!`,
              },
            ], "cm"),
            intField("Winkel zwischen [PP'] und a", 90, [
              {
                value: 180,
                hint: `Die Verbindungsstrecke [PP'] steht senkrecht auf der Symmetrieachse.`,
              },
            ], "°"),
          ]
        : [
            intField("Entfernung |AP'|", d1),
            intField("Abstand von P zur Achse a", halfSpan, [
              {
                value: 2 * halfSpan,
                hint: `Die Symmetrieachse halbiert [PP'], also ist der Abstand von P zur Achse nur die Hälfte von |PP'|.`,
              },
            ], "cm"),
          ],
      `Jeder Punkt der Symmetrieachse besitzt zu P und P' denselben Abstand; [PP'] steht senkrecht auf a.`,
      level === 1
        ? `Weil A auf der Achse liegt, gilt |AP'| = |AP| = ${d1} cm; zwischen [PP'] und a liegt ein rechter Winkel (90°).`
        : `|AP'| = |AP| = ${d1} cm (Kreisradius bleibt gleich); halbe Streckenlänge |PP'| : 2 = ${halfSpan} cm.`,
      level === 1
        ? `|AP'| = <strong>${d1} cm</strong>, Winkel = <strong>90°</strong>.`
        : `|AP'| = <strong>${d1} cm</strong>, Abstand zur Achse = <strong>${halfSpan} cm</strong>.`,
      { d1, d2, halfSpan },
    );
  },
};

// ─── Generators 2.2 (Punktsymmetrie) ─────────────────────────────────────────

const exPointMirror: ExerciseGenerator = {
  id: "punktspiegelung",
  make(rng, level) {
    const zx = rng.int(-2, 3);
    const zy = rng.int(-2, 3);
    const dx = rng.pick([-4, -3, -2, 2, 3, 4]);
    const dy = rng.pick([-4, -3, -2, 2, 3, 4]);
    const px = zx + dx;
    const py = zy + dy;
    const qx = zx - dx;
    const qy = zy - dy;

    if (level === 1) {
      return task(
        level,
        `Spiegele den Punkt P(${fmt(px, 0)} | ${fmt(py, 0)}) am Symmetriezentrum Z(${fmt(zx, 0)} | ${fmt(zy, 0)}). Berechne die Koordinaten des Bildpunkts P'.`,
        "",
        [
          intField("x-Koordinate x'", qx, [
            {
              value: zx === 0 ? px : -px,
              hint: `Am allgemeinen Zentrum Z(${fmt(zx, 0)} | ${fmt(zy, 0)}) liegt Z in der Mitte: x' = 2 · ${fmt(zx, 0)} ${MINUS} (${fmt(px, 0)})!`,
            },
          ]),
          intField("y-Koordinate y'", qy, [
            {
              value: zy === 0 ? py : -py,
              hint: `Berechne y' über den gleichen Schritt über Z hinaus: y' = 2 · ${fmt(zy, 0)} ${MINUS} (${fmt(py, 0)}).`,
            },
          ]),
        ],
        `Z ist der Mittelpunkt von [PP']: Gehe denselben Weg (Z ${MINUS} P) von Z aus noch einmal weiter.`,
        `x-Weg von P nach Z: ${fmt(zx - px, 0)}, weiter bis x' = ${fmt(zx, 0)} + (${fmt(zx - px, 0)}) = ${fmt(qx, 0)}.`,
        `Bildpunkt: <strong>P'(${fmt(qx, 0)} | ${fmt(qy, 0)})</strong>.`,
        { px, py, zx, zy, qx, qy },
      );
    }

    return task(
      level,
      "",
      `Eine Figur wird punktsymmetrisch gespiegelt: Der Punkt P(${fmt(px, 0)} | ${fmt(py, 0)}) landet auf dem Bildpunkt P'(${fmt(qx, 0)} | ${fmt(qy, 0)}). Berechne die Koordinaten des Symmetriezentrums Z und gib die Halbdrehung an.`,
      [
        intField("x-Koordinate von Z", zx, [
          {
            value: px - qx,
            hint: `Der Mittelpunkt von [PP'] hat den Mittelwert beider Koordinaten: (x_P + x_{P'}) : 2.`,
          },
        ]),
        intField("y-Koordinate von Z", zy, [
          {
            value: py - qy,
            hint: `Auch die y-Koordinate von Z ist der Durchschnitt: (y_P + y_{P'}) : 2.`,
          },
        ]),
        choiceField(
          "Drehwinkel um Z",
          ["180°", "90°", "360°"],
          0,
        ),
      ],
      "",
      `Z halbiert [PP']: x_Z = (${fmt(px, 0)} + ${paren(qx, 0)}) : 2 = ${fmt(zx, 0)}, y_Z = (${fmt(py, 0)} + ${paren(qy, 0)}) : 2 = ${fmt(zy, 0)}.`,
      `Symmetriezentrum: <strong>Z(${fmt(zx, 0)} | ${fmt(zy, 0)})</strong> (Punktsymmetrie entspricht einer Drehung um 180°).`,
      { px, py, qx, qy, zx, zy },
    );
  },
};

const exSymCompare: ExerciseGenerator = {
  id: "achsen-vs-punkt",
  make(rng, level) {
    const ab = rng.int(4, 11);
    return task(
      level,
      `Ein Dreieck ABC mit Seitenlänge |AB| = ${fmtUnit(ab, "cm", 0)} wird punktgespiegelt auf A'B'C'. Wie lang ist |A'B'|, und wie liegen die Strecken [AB] und [A'B'] zueinander?`,
      `Vergleiche Achsen- und Punktspiegelung einer Figur mit Seitenlänge |AB| = ${fmtUnit(ab, "cm", 0)}: Was passiert bei der Punktspiegelung mit Streckenlänge, Parallelität und dem Umlaufsinn der Ecken A → B → C?`,
      [
        intField("Länge |A'B'|", ab),
        choiceField(
          "Lage von [AB] und [A'B']",
          ["parallel und gleich lang", "immer senkrecht aufeinander", "immer auf derselben Geraden"],
          0,
        ),
        ...(level === 2
          ? [
              choiceField(
                "Umlaufsinn A → B → C zu A' → B' → C'",
                [
                  "bleibt gleich (Gegensatz zur Achsensymmetrie)",
                  "kehrt sich wie bei einem Spiegel um",
                  "verschwindet vollständig",
                ],
                0,
              ),
            ]
          : []),
      ],
      `Sowohl Achsen- als auch Punktspiegelung sind längentreu; Punktsymmetrie entspricht einer 180°-Drehung.`,
      `Wegen der Längentreue gilt |A'B'| = |AB| = ${ab} cm. Eine 180°-Drehung bildet jede Gerade auf eine Parallele ab.`,
      `|A'B'| = <strong>${ab} cm</strong>; Bild- und Urstrecke sind parallel${level === 2 ? ", und der Umlaufsinn bleibt bei Punktspiegelung erhalten" : ""}.`,
      { ab },
    );
  },
};

// ─── Generators 2.3 (Mittelsenkrechte, Kreis & Abstandsgrenzen) ──────────────

const exLociDistance: ExerciseGenerator = {
  id: "ortsgebiet-abstand",
  make(rng, level) {
    const xA = 0;
    const xB = rng.pick([6, 8, 10]);
    const midX = xB / 2;
    const xP = level === 1 ? rng.int(1, xB - 1) : rng.pick([midX - 2, midX + 2, midX]);
    const dA = Math.abs(xP - xA);
    const dB = Math.abs(xP - xB);
    const r = midX;

    const closerChoice =
      dA < dB ? 0 : dA === dB ? 1 : 2;

    return task(
      level,
      `Auf einer geraden Straße liegt Ort A bei x = 0 km und Ort B bei x = ${xB} km. Ein Haus P steht bei x = ${xP} km. Berechne die Abstände zu A und B und entscheide, auf welcher Seite der Mittelsenkrechten m_[AB] das Haus liegt.`,
      `Zwei Sendemasten stehen bei A(0 | 0) und B(${xB} | 0) (1 LE = 1 km). Mast A sendet bis r = ${r} km. Ein Punkt P(${xP} | 0) soll bewertet werden: Gib seine Entfernungen zu A und B an und entscheide, ob er innerhalb des Kreises um A (d < ${r} km) und näher an A als an B liegt.`,
      [
        intField("Abstand |PA|", dA, undefined, "km"),
        intField("Abstand |PB|", dB, undefined, "km"),
        choiceField(
          "Lage bezüglich Mittelsenkrechte m_[AB]",
          [
            "Näher an A (|PA| < |PB|)",
            "Genau auf der Mittelsenkrechten (|PA| = |PB|)",
            "Näher an B (|PA| > |PB|)",
          ],
          closerChoice,
        ),
      ],
      `Die Mittelsenkrechte liegt genau in der Mitte bei x = ${midX} km. Alle Punkte auf ihr sind von A und B gleich weit entfernt.`,
      `|PA| = ${dA} km, |PB| = |${xB} ${MINUS} ${xP}| = ${dB} km; Mittelsenkrechte bei ${midX} km.`,
      `Ergebnis: |PA| = <strong>${dA} km</strong>, |PB| = <strong>${dB} km</strong>${level === 2 ? ` (Kreisbedingung |PA| < ${r} km ist ${dA < r ? "erfüllt" : "nicht erfüllt"})` : ""}.`,
      { xB, xP, dA, dB, r },
    );
  },
};

const exModelLimit: ExerciseGenerator = {
  id: "modellgrenze-abstand",
  make(rng, level) {
    const r = rng.int(4, 8);
    const maxRing = r + rng.int(2, 4);
    const dTest = level === 1 ? r : rng.pick([r - 1, r + 1]);
    const inside = dTest <= r ? 0 : 1;

    return task(
      level,
      `Ein Feuerwehrturm deckt im geometrischen Modell einen Kreis mit Radius r = ${r} km ab. Ein Waldbrand liegt ${dTest} km Luftlinie entfernt. Wie viele Kilometer Abstand bleiben bis zur Kreisgrenze (0 = genau auf der Linie), und welche Grenze hat dieses reine Kreismodell in der Realität?`,
      `Ein Naturpark erlaubt Campen nur im Abstand zwischen ${r} km und ${maxRing} km von einer Quelle Q („Kreisring“). Wie breit ist diese erlaubte Zone in km, liegt ein Zelt bei ${dTest} km Entfernung noch innerhalb der verbotenen Innenzone (d ≤ ${r} km), und was vernachlässigt das geometrische Modell?`,
      [
        intField(level === 1 ? "Abstand bis Kreisgrenze" : "Breite der erlaubten Zone", level === 1 ? Math.abs(r - dTest) : maxRing - r, undefined, "km"),
        choiceField(
          level === 1 ? "Zutreffende Modellgrenze" : "Beurteilung & Modellgrenze",
          level === 1
            ? [
                "Berge, Straßenumwege und Windrichtung werden beim reinen Luftlinienkreis ignoriert",
                "Kreise können in der Natur niemals rund gezeichnet werden",
                "Zirkel sind auf Landkarten nicht anwendbar",
              ]
            : [
                `${inside === 0 ? "Noch in der Verbotszone (≤ " + r + " km)" : "Außerhalb der Innenzone (> " + r + " km)"}; Flüsse/Zäune/Relief fehlen im reinen Kreismodell`,
                "Das Modell gilt metergenau ohne Einschränkungen durch Gelände oder Wege",
                "Abstände in der Karte lassen sich nur mit der Winkelhalbierenden bestimmen",
              ],
          0,
        ),
      ],
      `Im Modell bedeutet „Abstand r“ stets Luftlinie. Vergleiche reale Gegebenheiten (Gelände, Wege, Hindernisse) mit der idealisierten Ebene.`,
      level === 1
        ? `|${r} ${MINUS} ${dTest}| = ${Math.abs(r - dTest)} km Unterschied bis zum Kreisrand r = ${r} km.`
        : `Zonenbreite: ${maxRing} ${MINUS} ${r} = ${maxRing - r} km; der Testabstand ${dTest} km ist ${dTest <= r ? "kleiner/gleich" : "größer als"} ${r} km.`,
      level === 1
        ? `Abstand zur Grenze: <strong>${Math.abs(r - dTest)} km</strong>. Modellgrenze: Luftlinie statt echter Fahrstrecken/Hindernisse.`
        : `Zonenbreite: <strong>${maxRing - r} km</strong>. Ein reales Gelände hat Wege, Hindernisse und Höhenunterschiede, die das reine Kreismodell ausblendet.`,
      { r, maxRing, dTest },
    );
  },
};

// ─── Generators 2.4 (Lote & Winkelhalbierende) ───────────────────────────────

const exAngleBisector: ExerciseGenerator = {
  id: "winkelhalbierende-lot",
  make(rng, level) {
    const alpha = rng.int(2, 7) * 18; // 36..126 even
    const halfA = alpha / 2;
    const adjacent = 180 - alpha;

    if (level === 1) {
      return task(
        level,
        `Ein Winkel α = ${alpha}° wird durch seine Winkelhalbierende w_α in zwei gleiche Teilwinkel zerlegt. Wie groß ist ein Teilwinkel?`,
        "",
        [
          intField("Teilwinkel α : 2", halfA, [
            { value: alpha, hint: `Die Winkelhalbierende halbiert den gesamten Winkel α = ${alpha}°!` },
            { value: adjacent, hint: `180° − α ist der Nebenwinkel, nicht die Hälfte von α.` },
          ], "°"),
          choiceField(
            "Besondere Abstandseigenschaft jedes Punkts P auf w_α",
            [
              "P hat zu beiden Schenkeln des Winkels denselben Abstand",
              "P hat zum Scheitel immer den Abstand 1 cm",
              "P liegt stets auf der Winkelhalbierenden des Nebenwinkels",
            ],
            0,
          ),
        ],
        `Halbiere α: α : 2.`,
        `Die Winkelhalbierende teilt α symmetrisch: ${alpha}° : 2 = ${halfA}°.`,
        `Teilwinkel: <strong>${halfA}°</strong>. Jeder Punkt von w_α ist gleich weit von beiden Schenkeln entfernt.`,
        { alpha, halfA },
      );
    }

    // Level 2: angle between bisector of alpha and bisector of adjacent supplementary angle -> always 90°!
    const distToLeg = rng.int(3, 9);
    return task(
      level,
      "",
      `An einer Geraden liegen die Nebenwinkel α = ${alpha}° und β. Beide Winkel werden durch w_α und w_β halbiert. Ein Punkt P liegt auf w_α und hat zum ersten Schenkel den Abstand ${distToLeg} cm. Wie groß ist der Gesamtwinkel zwischen w_α und w_β, und wie weit ist P vom zweiten Schenkel entfernt?`,
      [
        intField("Winkel zwischen w_α und w_β", 90, [
          {
            value: halfA,
            hint: `Du musst BEIDE Hälften addieren: α : 2 + β : 2 = ${halfA}° + ${adjacent / 2}°!`,
          },
          {
            value: adjacent / 2,
            hint: `Addiere α : 2 und β : 2 zusammen: ${alpha}°/2 + ${adjacent}°/2.`,
          },
        ], "°"),
        intField("Abstand von P zum 2. Schenkel", distToLeg, undefined, "cm"),
      ],
      "",
      `β = 180° ${MINUS} ${alpha}° = ${adjacent}°. Also gilt α/2 + β/2 = ${halfA}° + ${adjacent / 2}° = 90°.`,
      `Winkel zwischen den Halbierenden: <strong>90°</strong> (sie stehen immer senkrecht!); Abstand zum 2. Schenkel: <strong>${distToLeg} cm</strong>.`,
      { alpha, adjacent, distToLeg },
    );
  },
};

const exConstructionReason: ExerciseGenerator = {
  id: "konstruktion-begruenden",
  make(rng, level) {
    const radius = rng.int(3, 7);
    const kind = rng.int(0, 2); // 0: Lot fällen, 1: Lot errichten, 2: Mittelsenkrechte
    const labels = ["Lot fällen (P ∉ g)", "Lot errichten (P ∈ g)", "Mittelsenkrechte auf [AB]"];
    const correctReasons = [
      `Kreis um P schneidet g in A und B (gleich weit von P), sodass die Mittelsenkrechte von [AB] durch P geht und senkrecht auf g steht`,
      `Kreis um P schneidet g in A und B, sodass P der Mittelpunkt von [AB] ist und seine Mittelsenkrechte senkrecht durch P läuft`,
      `Zwei gleich große Kreise um A und B schneiden sich in Punkten, die jeweils von A und B exakt gleich weit entfernt sind`,
    ];

    return task(
      level,
      `Bei der Konstruktion „${labels[kind]}“ schlägst du zuerst einen Zirkelkreis mit Radius r = ${radius} cm. Wie groß ist der Durchmesser dieses Hilfskreises, und warum führt die Konstruktion sicher zum rechten Winkel?`,
      `Erkläre den Symmetriegedanken beim „${labels[kind]}“: Du wählst auf dem Hilfskreis vom Radius r = ${radius} cm die Punkte A und B. Wie groß ist die Hilfsstrecke |PA| (bzw. |AB| bei A↔B), und warum garantiert dies die Rechtwinkligkeit bzw. Halbierung?`,
      [
        intField(kind === 2 ? "Abstand |AC| = |BC|" : "Durchmesser des Hilfskreises", kind === 2 ? radius : 2 * radius, undefined, "cm"),
        choiceField(
          "Mathematische Begründung",
          [
            correctReasons[kind],
            "Weil ein Geodreieck bereits eine 90°-Linie aufgedruckt hat",
            "Weil jeder Zirkelkreis exakt drei Ecken verbindet",
          ],
          0,
        ),
      ],
      `Alle Punkte eines Kreises haben denselben Abstand zum Mittelpunkt; diese Gleichabständigkeit erzwingt Symmetrie.`,
      kind === 2
        ? `Beide Kreise haben den gleichen Radius ${radius} cm, sodass jeder Schnittpunkt gleich weit von A und B entfernt ist.`
        : `Ein Kreis mit Radius ${radius} cm hat den Durchmesser 2 · ${radius} = ${2 * radius} cm und markiert auf g zwei symmetrische Punkte zu P.`,
      `Ergebnis: <strong>${kind === 2 ? radius : 2 * radius} cm</strong>. ${correctReasons[kind]}.`,
      { radius, kind },
    );
  },
};

// ─── Generators 2.5 (Haus der symmetrischen Vierecke) ────────────────────────

const exQuadSym: ExerciseGenerator = {
  id: "viereck-symmetrie",
  make(rng, level) {
    const cases = [
      { name: "Quadrat", axes: 4, point: "ja", a: rng.int(4, 9), b: 0, angle: 90 },
      { name: "Rechteck (nicht quadratisch)", axes: 2, point: "ja", a: rng.int(5, 9), b: rng.int(2, 4), angle: 90 },
      { name: "Raute (nicht quadratisch)", axes: 2, point: "ja", a: rng.int(4, 9), b: 0, angle: rng.pick([60, 70, 80]) },
      { name: "allgemeines Parallelogramm", axes: 0, point: "ja", a: rng.int(5, 9), b: rng.int(3, 4), angle: rng.pick([55, 65, 75]) },
      { name: "gleichschenkliges Trapez (kein Rechteck)", axes: 1, point: "nein", a: rng.int(6, 10), b: rng.int(3, 5), angle: rng.pick([65, 75]) },
      { name: "symmetrisches Drachenviereck (keine Raute)", axes: 1, point: "nein", a: rng.int(3, 6), b: rng.int(7, 10), angle: rng.pick([80, 95]) },
    ];
    const item = cases[level === 1 ? rng.int(0, 3) : rng.int(2, 5)];
    const adj = item.name.startsWith("Quadrat") || item.name.startsWith("Rechteck")
      ? 90
      : 180 - item.angle;

    return task(
      level,
      `Untersuche die Symmetrieeigenschaften der Figur „${item.name}“. Wie viele Symmetrieachsen hat sie, und ist sie punktsymmetrisch?`,
      `Ein ${item.name} besitzt einen spitzen Innenwinkel α = ${item.angle}°. Wie viele Spiegelachsen hat diese Vierecksart, ist sie punktsymmetrisch, und wie groß ist der Nachbarwinkel β an derselben parallelen Seite (oder beim Drachen: beim gegebenen Schenkelpaar mit Symmetrieachse)?`,
      [
        intField("Anzahl der Symmetrieachsen", item.axes, [
          {
            value: item.axes === 4 ? 2 : item.axes === 0 ? 2 : item.axes + 1,
            hint: `Prüfe im Kopf beide Diagonalen und beide Seitenmittelsenkrechten als mögliche Klappachsen!`,
          },
        ]),
        choiceField(
          "Ist diese Vierecksart punktsymmetrisch?",
          item.point === "ja" ? ["Ja, punktsymmetrisch", "Nein, nicht punktsymmetrisch"] : ["Nein, nicht punktsymmetrisch", "Ja, punktsymmetrisch"],
          0,
        ),
        ...(level === 2
          ? [
              intField(
                item.name.includes("Drachen") ? "Gegenüberliegender Winkel bei gleicher Achsenlage" : "Nachbarwinkel β (zu α = " + `${item.angle}°` + ")",
                item.name.includes("Drachen") ? item.angle : adj,
                undefined,
                "°",
              ),
            ]
          : []),
      ],
      `Unterscheide genau zwischen Seitenmittenachsen (Rechteck/Gleichsch. Trapez), Diagonalachsen (Raute/Drachen) und Punktsymmetrie (Parallelogramm, Rechteck, Raute, Quadrat).`,
      `Ein ${item.name} hat ${countPhrase(item.axes, "Symmetrieachse", "Symmetrieachsen")} und ist ${item.point === "ja" ? "" : "nicht "}punktsymmetrisch.`,
      `Achsen: <strong>${item.axes}</strong>, punktsymmetrisch: <strong>${item.point}</strong>${level === 2 ? `, zugehöriger Winkel: <strong>${item.name.includes("Drachen") ? item.angle : adj}°</strong>` : ""}.`,
      { axes: item.axes, angle: item.angle },
    );
  },
};

const exQuadHierarchy: ExerciseGenerator = {
  id: "viereck-spezialfall",
  make(rng, level) {
    const a = rng.int(5, 10);
    const b = rng.int(3, 8);
    const p = 2 * (a + b);

    if (level === 1) {
      return task(
        level,
        `Welches Viereck ist gleichzeitig ein Rechteck UND eine Raute, und welchen Umfang hat ein solches Viereck bei Seitenlänge a = ${a} cm?`,
        "",
        [
          choiceField(
            "Name des Vierecks",
            ["Quadrat", "Gleichschenkliges Trapez", "Drachenviereck"],
            0,
          ),
          intField("Umfang", 4 * a, [
            { value: a * a, hint: `Für den Umfang addierst du alle vier Seiten (4 · a), statt sie zu quadrieren.` },
          ], "cm"),
        ],
        `Rechteck (4 rechte Winkel) + Raute (4 gleich lange Seiten) ergibt genau das Quadrat.`,
        `Vier gleiche Seiten à ${a} cm mit vier 90°-Winkeln bilden ein Quadrat.`,
        `Gesucht ist das <strong>Quadrat</strong> mit Umfang 4 · ${a} cm = <strong>${4 * a} cm</strong>.`,
        { a },
      );
    }

    return task(
      level,
      "",
      `Prüfe Spezialfall-Beziehungen im Haus der Vierecke und berechne den Umfang eines Drachenvierecks mit unterschiedlich langen Seitenpaaren a = ${a} cm und b = ${b} cm.`,
      [
        intField("Umfang des Drachenvierecks", p, [
          { value: a + b, hint: `Im Drachenviereck kommen beide Längen a und b je ZWEIMAL vor: u = 2a + 2b.` },
        ], "cm"),
        choiceField(
          "Welche Spezialfall-Aussage ist immer wahr?",
          [
            "Jede Raute ist ein Parallelogramm (und zugleich ein symmetrisches Drachenviereck)",
            "Jedes Parallelogramm ist ein Rechteck",
            "Jedes symmetrische Trapez ist punktsymmetrisch",
          ],
          0,
        ),
      ],
      "",
      `Bei der Raute sind alle Seiten gleich lang, daher sind Gegenüberliegende parallel (Parallelogramm) und Diagonalen stehen senkrecht aufeinander (Drachenviereck).`,
      `Umfang: 2 · (${a} + ${b}) = <strong>${p} cm</strong>. Jede Raute ist ein Parallelogramm und ein Drachenviereck!`,
      { a, b, p },
    );
  },
};

// ─── Generators 2.6 (Geradenkreuzung: Scheitel- & Nebenwinkel) ────────────────

const exCrossAngles: ExerciseGenerator = {
  id: "scheitel-nebenwinkel",
  make(rng, level) {
    let alpha = rng.int(25, 145);
    if (alpha === 90) alpha = 75;
    const neben = 180 - alpha;

    if (level === 1) {
      return task(
        level,
        `Zwei Geraden schneiden sich unter einem Winkel α = ${alpha}°. Wie groß sind sein Scheitelwinkel α* und sein Nebenwinkel β?`,
        "",
        [
          intField("Scheitelwinkel α*", alpha, [
            { value: neben, hint: `Der Scheitelwinkel liegt genau gegenüber und ist exakt gleich groß wie α!` },
          ], "°"),
          intField("Nebenwinkel β", neben, [
            { value: 360 - alpha, hint: `Nebenwinkel bilden zusammen eine Gerade (gestreckter Winkel = 180°), nicht 360°.` },
          ], "°"),
        ],
        `Scheitelwinkel sind gleich groß; Nebenwinkel ergänzen sich zu 180°.`,
        `Scheitelwinkel α* = α = ${alpha}°; Nebenwinkel β = 180° ${MINUS} ${alpha}° = ${neben}°.`,
        `Ergebnisse: <strong>α* = ${alpha}°</strong> und <strong>β = ${neben}°</strong>.`,
        { alpha, neben },
      );
    }

    const diff = rng.int(5, 25) * 2; // even difference 10..50
    const small = (180 - diff) / 2;
    const large = small + diff;
    return task(
      level,
      "",
      `An einer Geradenkreuzung ist der größere Nebenwinkel β genau um ${diff}° größer als sein Nebenwinkel α. Berechne beide Winkel α und β.`,
      [
        intField("Kleinerer Winkel α", small, [
          {
            value: 90 - diff,
            hint: `Du musst den Unterschied von ${diff}° gleichmäßig verteilen: α + (α + ${diff}°) = 180°!`,
          },
        ], "°"),
        intField("Größerer Winkel β", large, undefined, "°"),
      ],
      "",
      `Nebenwinkel ergeben zusammen 180°: α + (α + ${diff}°) = 180° → 2α = ${180 - diff}°.`,
      `α = ${small}°, β = ${small}° + ${diff}° = <strong>${large}°</strong> (Probe: ${small}° + ${large}° = 180°).`,
      { diff, small, large },
    );
  },
};

const exMultiRayCross: ExerciseGenerator = {
  id: "dreifachkreuzung-winkel",
  make(rng, level) {
    const a = rng.int(30, 65);
    const b = rng.int(25, 55);
    const c = 180 - a - b;

    return task(
      level,
      `Drei Geraden schneiden sich in genau einem gemeinsamen Punkt S. Zwei nebeneinanderliegende Winkel an einer Geraden betragen ${a}° und ${b}°. Wie groß ist der dritte Winkel γ, der sie zum gestreckten Winkel ergänzt, und wie groß ist der Scheitelwinkel zu γ?`,
      `Drei Geraden schneiden sich in einem Punkt S. Zwischen ihnen entstehen um den Punkt S herum sechs Winkel (paarweise Scheitelwinkel). Zwei verschiedene benachbarte Teilwinkel messen ${a}° und ${b}°. Bestimme den dritten Teilwinkel γ und die Summe eines Winkeltrios aus je einem Vertreter der drei Paare.`,
      [
        intField("Dritter Winkel γ", c, [
          {
            value: 360 - a - b,
            hint: `Je drei verschiedene Teilwinkel nebeneinander füllen genau eine Gerade (= 180°), erst alle sechs zusammen ergeben 360°!`,
          },
        ], "°"),
        intField(level === 1 ? "Scheitelwinkel zu γ" : "Winkelsumme aus 3 Paaren (= Vollwinkel : 2)", level === 1 ? c : 180, undefined, "°"),
      ],
      `Alle Winkel entlang einer Seite einer geraden Linie addieren sich zu 180°.`,
      `180° ${MINUS} ${a}° ${MINUS} ${b}° = ${c}°. Gegenüber liegt derselbe Scheitelwinkel ${c}°.`,
      `γ = <strong>${c}°</strong>; der gesuchte Wert beträgt <strong>${level === 1 ? c : 180}°</strong>.`,
      { a, b, c },
    );
  },
};

// ─── Generators 2.7 (Doppelkreuzung: Stufen- & Wechselwinkel) ────────────────

const exParallelAngles: ExerciseGenerator = {
  id: "stufen-wechselwinkel",
  make(rng, level) {
    const rawAlpha = rng.int(40, 130);
    const alpha = rawAlpha === 90 ? 75 : rawAlpha;
    const altSupp = 180 - alpha;

    if (level === 1) {
      return task(
        level,
        `Zwei parallele Geraden g und h werden von einer Geraden k geschnitten. Am Schnittpunkt mit g beträgt der Winkel α = ${alpha}°. Wie groß sind sein Stufenwinkel α' und sein Wechselwinkel β' am Schnittpunkt mit h, und wie groß ist der Nebenwinkel dazu?`,
        "",
        [
          intField("Stufenwinkel bzw. Wechselwinkel", alpha, undefined, "°"),
          intField("Nebenwinkel am zweiten Schnittpunkt", altSupp, [
            { value: alpha, hint: `Der Nebenwinkel bildet mit dem Stufenwinkel zusammen 180°!` },
          ], "°"),
        ],
        `Bei parallelen Geraden (g ∥ h) sind sowohl Stufenwinkel (F-Winkel) als auch Wechselwinkel (Z-Winkel) gleich groß.`,
        `Wegen g ∥ h gilt α' = β' = ${alpha}°; der zugehörige Nebenwinkel ist 180° ${MINUS} ${alpha}° = ${altSupp}°.`,
        `Stufen-/Wechselwinkel = <strong>${alpha}°</strong>, Nebenwinkel = <strong>${altSupp}°</strong>.`,
        { alpha, altSupp },
      );
    }

    const step = rng.int(10, 24);
    const evenStep = step % 2 === 0 ? step : step + 1;
    const xAns = (180 - evenStep) / 2;
    const largeAngle = xAns + evenStep;
    return task(
      level,
      "",
      `An einer Doppelkreuzung paralleler Geraden (g ∥ h) ist der Stufenwinkel zu α so groß wie x, während sein Nachbar-/Nebenwinkel am selben Schnittpunkt genau x + ${evenStep}° misst. Berechne die Winkel x und x + ${evenStep}°.`,
      [
        intField("Winkel x", xAns, [
          { value: 180 - evenStep, hint: `Addiere beide Winkel entlang der Geraden zu 180°: x + (x + ${evenStep}°) = 180°.` },
        ], "°"),
        intField(`Größerer Winkel (x + ${evenStep}°)`, largeAngle, undefined, "°"),
      ],
      "",
      `Da g ∥ h, gilt der Stufenwinkelsatz (F-Winkel = x), und mit dem Nebenwinkel zusammen ergeben sich 180°: 2x + ${evenStep}° = 180°.`,
      `x = <strong>${xAns}°</strong> und Nebenwinkel = <strong>${largeAngle}°</strong>.`,
      { evenStep, xAns, largeAngle },
    );
  },
};

const exCheckParallelCriterion: ExerciseGenerator = {
  id: "parallelitaet-pruefen",
  make(rng, level) {
    const a1 = rng.int(48, 125);
    const isParallel = (rng.sign() > 0);
    const diff = isParallel ? 0 : rng.pick([-5, -3, 3, 6]);
    const a2 = a1 + diff;

    return task(
      level,
      `Eine Gerade k schneidet g unter einem Winkel α₁ = ${a1}° und h beim zugehörigen Stufenwinkel unter α₂ = ${a2}°. Wie groß ist die Differenz |α₁ ${MINUS} α₂|, und sind g und h parallel?`,
      `An einer Doppelkreuzung misst ein Winkel an g genau ${a1}°. Am anderen Schnittpunkt auf h beträgt der Nebenwinkel des zugehörigen Wechselwinkels ${180 - a2}°. Berechne den Wechselwinkel an h und entscheide, ob g und h parallel sind.`,
      [
        intField(
          level === 1 ? "Differenz |α₁ − α₂|" : "Berechneter Wechselwinkel an h",
          level === 1 ? Math.abs(diff) : a2,
          undefined,
          "°",
        ),
        choiceField(
          "Sind g und h parallel?",
          isParallel
            ? ["Ja, die Stufen-/Wechselwinkel sind gleich groß", "Nein, sie weichen voneinander ab"]
            : ["Nein, weil Stufen-/Wechselwinkel verschieden sind", "Ja, sie sind immer parallel"],
          0,
        ),
      ],
      `g ∥ h gilt genau dann, wenn Stufenwinkel (oder Wechselwinkel) am anderen Schnittpunkt exakt übereinstimmen.`,
      level === 1
        ? `|${a1}° ${MINUS} ${a2}°| = ${Math.abs(diff)}° (${isParallel ? "identisch" : "verschieden"}).`
        : `Der Wechselwinkel beträgt 180° ${MINUS} ${180 - a2}° = ${a2}° (im Vergleich zu ${a1}°: ${isParallel ? "gleich" : "nicht gleich"}).`,
      `${level === 1 ? `Abweichung = <strong>${Math.abs(diff)}°</strong>` : `Wechselwinkel = <strong>${a2}°</strong>`} → g und h sind <strong>${isParallel ? "parallel" : "nicht parallel"}</strong>.`,
      { a1, a2, diff },
    );
  },
};

// ─── Generators 2.8 (Innenwinkelsumme im Dreieck beweisen) ────────────────────

const exTriangleAngle: ExerciseGenerator = {
  id: "dreieck-winkelsumme",
  make(rng, level) {
    const a = rng.int(32, 75);
    const b = rng.int(28, 72);
    const c = 180 - a - b;

    if (level === 1) {
      return task(
        level,
        `In einem Dreieck ABC messen zwei Innenwinkel α = ${a}° und β = ${b}°. Berechne den dritten Innenwinkel γ.`,
        "",
        [
          intField("Innenwinkel γ", c, [
            { value: 360 - a - b, hint: `Die Innenwinkelsumme im Dreieck ist 180°, nicht 360°!` },
            { value: a + b, hint: `Du hast α + β berechnet; ziehe diese Summe noch von 180° ab!` },
          ], "°"),
        ],
        `Innenwinkelsumme im Dreieck: α + β + γ = 180°.`,
        `Summe der bekannten Winkel: ${a}° + ${b}° = ${a + b}°.`,
        `γ = 180° ${MINUS} ${a + b}° = <strong>${c}°</strong>.`,
        { a, b, c },
      );
    }

    const extBeta = 180 - b;
    return task(
      level,
      "",
      `Bei einem Dreieck ABC ist α = ${a}° bekannt, und der Außenwinkel neben β (also der Nebenwinkel zu β) beträgt ${extBeta}°. Berechne zuerst β und dann γ.`,
      [
        intField("Innenwinkel β", b, [
          { value: extBeta, hint: `Der Außenwinkel neben β ergänzt β zu 180°: β = 180° ${MINUS} ${extBeta}°.` },
        ], "°"),
        intField("Innenwinkel γ", c, [
          { value: 180 - a - extBeta, hint: `Rechne mit dem Innenwinkel β = ${b}°, nicht mit dem Außenwinkel ${extBeta}°!` },
        ], "°"),
      ],
      "",
      `Nebenwinkel an B: β = 180° ${MINUS} ${extBeta}° = ${b}° (Hinweis: Außenwinkel = α + γ!).`,
      `γ = 180° ${MINUS} ${a}° ${MINUS} ${b}° = <strong>${c}°</strong>.`,
      { a, extBeta, b, c },
    );
  },
};

const exProofStepCheck: ExerciseGenerator = {
  id: "dreieck-beweis",
  make(rng, level) {
    const a = rng.int(35, 70);
    const b = rng.int(35, 70);
    const c = 180 - a - b;

    return task(
      level,
      `Zum Beweis der Innenwinkelsumme zeichnet man durch die Spitze C eine parallele Hilfslinie p zur Seite [AB]. In dem Dreieck gilt α = ${a}° und β = ${b}°. Wie groß sind die beiden Winkel auf p links und rechts neben γ?`,
      `Bewerte die logische Struktur des Beweises „α + β + γ = 180°“ (hier mit α = ${a}° und γ = ${c}°): Wie groß ist der Wechselwinkel rechts neben γ an der Hilfslinie durch C, und was ist hier der Fundamentalsatz gegenüber dem abgeleiteten Satz?`,
      level === 1
        ? [
            intField("Linker Wechselwinkel zu α", a, undefined, "°"),
            intField("Rechter Wechselwinkel zu β", b, undefined, "°"),
            choiceField(
              "Warum entsteht oben 180°?",
              [
                "Die drei Winkel auf der Geraden p bilden zusammen einen gestreckten Winkel",
                "Weil alle Dreiecke immer gleichseitig sind",
                "Weil Hilfslinien immer senkrecht auf [AB] stehen",
              ],
              0,
            ),
          ]
        : [
            intField("Rechter Wechselwinkel (= β)", b, undefined, "°"),
            choiceField(
              "Fundamentalsatz vs. abgeleiteter Satz",
              [
                "Wechselwinkelsatz (an Parallelen) als Ausgangspunkt; Winkelsumme 180° ist der abgeleitete Satz",
                "Winkelsumme ist zufällig gemessen; ein Satz folgt nie aus einem anderen",
                "Eine Hilfslinie darf nur verwendet werden, wenn der Umfang gleich bleibt",
              ],
              0,
            ),
          ],
      `Die Hilfslinie p ∥ AB erzeugt an C Z-Winkel (Wechselwinkel) gleich α und β.`,
      `An der Geraden p liegen links der Wechselwinkel zu α (${a}°), in der Mitte γ (${c}°) und rechts der Wechselwinkel zu β (${b}°).`,
      `Zusammen bilden alle drei einen gestreckten Winkel von 180° (<strong>${a}° + ${c}° + ${b}° = 180°</strong>).`,
      { a, b, c },
    );
  },
};

// ─── Generators 2.9 (Innenwinkelsumme im Vieleck) ────────────────────────────

const exPolyAngleSum: ExerciseGenerator = {
  id: "vieleck-winkelsumme",
  make(rng, level) {
    const n = rng.pick([5, 6, 8, 9, 10, 12]);
    const sum = polygonAngleSum(n);
    const oneReg = sum / n;

    if (level === 1) {
      return task(
        level,
        `In wie viele Teildreiecke zerfällt ein ${n}-Eck durch Diagonalen von genau einer Ecke aus, und wie groß ist damit seine Innenwinkelsumme?`,
        "",
        [
          intField("Anzahl Teildreiecke (n − 2)", n - 2, [
            { value: n, hint: `Die Anzahl der Dreiecke ist nicht n, sondern n ${MINUS} 2.` },
          ]),
          intField("Innenwinkelsumme", sum, [
            { value: n * 180, hint: `Multipliziere (n ${MINUS} 2) = ${n - 2} mit 180°, nicht n mit 180°!` },
          ], "°"),
        ],
        `Von einer Ecke gehen Diagonalen zu (n ${MINUS} 3) anderen Ecken und zerschneiden das ${n}-Eck in (n ${MINUS} 2) Dreiecke.`,
        `Anzahl der Dreiecke: ${n} ${MINUS} 2 = ${n - 2}.`,
        `Innenwinkelsumme: ${n - 2} · 180° = <strong>${sum}°</strong>.`,
        { n, sum },
      );
    }

    return task(
      level,
      "",
      `Ein regelmäßiges Vieleck besitzt eine Innenwinkelsumme von ${sum}° (es hat genau ${n - 2} Teildreiecke ab einer Ecke). Bestimme die Eckenzahl n und die Größe eines einzelnen Innenwinkels.`,
      [
        intField("Eckenzahl n", n, [
          {
            value: n - 2,
            hint: `Du hast (n ${MINUS} 2) berechnet! Addiere 2 dazu: n = ${n - 2} + 2 = ${n}.`,
          },
        ]),
        intField("Ein einzelner Innenwinkel", oneReg, undefined, "°"),
      ],
      "",
      `${sum}° : 180° = ${n - 2} Teildreiecke → also n = ${n - 2} + 2 = ${n} Ecken.`,
      `Ein Innenwinkel im regelmäßigen ${n}-Eck: ${sum}° : ${n} = <strong>${oneReg}°</strong>.`,
      { n, sum, oneReg },
    );
  },
};

const exPolyMissingAngle: ExerciseGenerator = {
  id: "vieleck-restwinkel",
  make(rng, level) {
    const n = level === 1 ? 4 : rng.pick([5, 6]);
    const sum = polygonAngleSum(n);
    const angles: number[] = [];
    let running = 0;
    for (let i = 0; i < n - 1; i++) {
      const val = rng.int(75, 130);
      angles.push(val);
      running += val;
    }
    const last = sum - running;
    // Ensure valid interior angle 25..170 by fallback tuning if needed
    const safeAngles =
      last >= 25 && last <= 170
        ? angles
        : n === 4
          ? [85, 95, 110]
          : n === 5
            ? [100, 112, 98, 120]
            : [115, 125, 110, 130, 120];
    const safeSum = safeAngles.reduce((acc, v) => acc + v, 0);
    const ans = sum - safeSum;

    return task(
      level,
      `In einem ${n}-Eck sind die ersten ${n - 1} Innenwinkel gegeben: ${safeAngles.map((v) => `${v}°`).join(", ")}. Berechne den fehlenden Innenwinkel.`,
      `Ein unregelmäßiges ${n}-Eck (z. B. ein Grundstücksplan) hat ${n - 1} vermessene Ecken: ${safeAngles.map((v) => `${v}°`).join(", ")}. Leite zuerst die Gesamt-Innenwinkelsumme her und berechne den letzten fehlenden Innenwinkel.`,
      [
        ...(level === 2
          ? [intField(`Innenwinkelsumme des ${n}-Ecks`, sum, undefined, "°")]
          : []),
        intField("Fehlender Innenwinkel", ans, [
          {
            value: safeSum,
            hint: `Du hast nur die ${n - 1} bekannten Winkel addiert. Ziehe diese Summe noch von ${fmt(sum, 0)}° ab!`,
          },
        ], "°"),
      ],
      `Das ${n}-Eck zerfällt in ${n - 2} Dreiecke → Gesamtsumme = (${n} ${MINUS} 2) · 180° = ${fmt(sum, 0)}°.`,
      `Summe der gegebenen ${n - 1} Winkel = ${safeSum}°.`,
      `Fehlender Winkel = ${fmt(sum, 0)}° ${MINUS} ${safeSum}° = <strong>${ans}°</strong>.`,
      { n, sum, ans },
    );
  },
};

// ─── Generators 2.10 (Mehrfache Kreuzungen & Parallelität) ────────────────────

const exParallelTestMulti: ExerciseGenerator = {
  id: "mehrfach-parallelitaet",
  make(rng, level) {
    const triA = rng.int(40, 75);
    const triB = rng.int(40, 70);
    const triC = 180 - triA - triB;
    const isPar = (rng.sign() > 0);
    const offset = isPar ? 0 : rng.pick([-6, 5]);
    const extAngleAtH = triC + offset;

    return task(
      level,
      `Eine Gerade schneidet g und ein Dreieck mit α = ${triA}° und β = ${triB}°. Der dritte Dreieckswinkel γ teilt eine Ecke an g. An der zweiten Geraden h beträgt der zugehörige Wechselwinkel zu γ exakt ${extAngleAtH}°. Berechne γ und beurteile, ob g und h parallel sein können.`,
      `In einer Figur liegt ein Dreieck zwischen zwei Geraden g und h: Im Dreieck sind α = ${triA}° und β = ${triB}° bekannt, sodass γ zwischen dem Dreiecksschenkel und g entsteht. Weiter oben an h misst der Stufenwinkel zu γ genau ${extAngleAtH}°. Bestimme γ und entscheide begründet über g ∥ h.`,
      [
        intField("Dreieckswinkel γ", triC, undefined, "°"),
        choiceField(
          "Sind g und h parallel?",
          isPar
            ? [`Ja, weil Stufen-/Wechselwinkel beide ${triC}° messen`, "Nein, die Winkel unterscheiden sich"]
            : [`Nein, weil ${triC}° ≠ ${extAngleAtH}°`, "Ja, sie schneiden dieselbe Hilfslinie"],
          0,
        ),
      ],
      `Bestimme zuerst den fehlenden Dreieckswinkel γ über 180° ${MINUS} α ${MINUS} β und vergleiche ihn mit dem Winkel an h.`,
      `Winkelsumme im Dreieck: γ = 180° ${MINUS} ${triA}° ${MINUS} ${triB}° = ${triC}°.`,
      `Vergleich mit ${extAngleAtH}°: Da ${triC}° ${isPar ? "=" : "≠"} ${extAngleAtH}°, sind g und h <strong>${isPar ? "parallel" : "nicht parallel"}</strong>.`,
      { triA, triB, triC, extAngleAtH },
    );
  },
};

const exZigZagAngle: ExerciseGenerator = {
  id: "zickzack-hilfslinie",
  make(rng, level) {
    const a1 = rng.int(24, 62);
    const a2 = rng.int(22, 58);
    const mid = a1 + a2;

    return task(
      level,
      `Zwischen zwei parallelen Geraden g und h verläuft ein Zickzack-Knick: Oben beträgt der spitze Winkel zu g genau ${a1}°, unten zu h genau ${a2}°. Zeichne gedanklich durch den Knick eine Parallele zu g und h und berechne den Innenwinkel am Knick.`,
      `Zwischen zwei parallelen Bahngleisen g und h knickt ein Gleisstück ein: Oben an g misst der Winkel ${a1}°, der gesamte Knickwinkel innen beträgt ${mid}°. Berechne mithilfe einer parallelen Hilfslinie durch den Knick den unteren Winkel an h.`,
      [
        intField(level === 1 ? "Knickwinkel gesamt" : "Unterer Winkel an h", level === 1 ? mid : a2, [
          {
            value: level === 1 ? Math.abs(a1 - a2) : mid + a1,
            hint: `Die parallele Hilfslinie teilt den Knickwinkel durch zwei Wechselwinkel in α₁ + α₂!`,
          },
        ], "°"),
        choiceField(
          "Welcher Winkelsatz liefert die Teilwinkel an der Hilfslinie?",
          [
            "Wechselwinkelsatz an parallelen Geraden (Z-Winkel)",
            "Innenwinkelsumme im Viereck",
            "Gleichseitiges Dreieck",
          ],
          0,
        ),
      ],
      `Eine Parallele zu g und h durch den Knickpunkt teilt den Knickwinkel in zwei Wechselwinkel.`,
      `Die Hilfslinie durch den Knick zerlegt den Knickwinkel in den oberen Wechselwinkel ${a1}° und den unteren ${a2}°.`,
      level === 1
        ? `Gesamter Knickwinkel = ${a1}° + ${a2}° = <strong>${mid}°</strong>.`
        : `Unterer Winkel = ${mid}° ${MINUS} ${a1}° = <strong>${a2}°</strong>.`,
      { a1, a2, mid },
    );
  },
};

// ─── Stage 2 Lessons (10 Lektionen) ───────────────────────────────────────────

export const STAGE_2_LESSONS = makeLessons([
  {
    id: "sy-1-achse",
    section: "2.1",
    title: "2.1 Achsensymmetrie: Zirkel & Lineal",
    subtitle: "Spiegelachse und Bildpunkte nur mit Zirkel und Lineal konstruieren",
    whyItMatters:
      "Schon die griechischen Mathematiker lösten Konstruktionsrätsel allein mit Zirkel und unbeschriftetem Lineal – weil Kreise gleiche Abstände exakt ohne Messfehler übertragen.",
    explanationHtml: `
      <p>Zwei Punkte <strong>P</strong> und <strong>P'</strong> liegen genau dann <strong>achsensymmetrisch</strong> zur Symmetrieachse <em>a</em>, wenn gilt:</p>
      <ul>
        <li>Die Verbindungsstrecke <code>[PP']</code> steht <strong>senkrecht</strong> auf der Achse <em>a</em>.</li>
        <li>Die Achse <em>a</em> <strong>halbiert</strong> <code>[PP']</code> (P und P' haben denselben Abstand zu <em>a</em>).</li>
        <li>Jeder Punkt <em>X</em> auf der Achse <em>a</em> ist von <em>P</em> und <em>P'</em> gleich weit entfernt (<code>|XP| = |XP'|</code>).</li>
      </ul>
      <p><strong>Kulturhistorischer Hintergrund:</strong> Seit Euklid (ca. 300 v. Chr.) gelten Zirkel und unbeschriftetes Lineal als „reine Werkzeuge“ der Geometrie: Kreise übertragen Abstände fehlerfrei, ohne an einem Lineal ungenau abzulesen.</p>
      <div class="example">
        <strong>Beispiel – Bildpunkt P' mit Zirkel konstruieren:</strong><br>
        1. Wähle zwei beliebige Punkte <em>A</em> und <em>B</em> auf der Achse <em>a</em>.<br>
        2. Schlage einen Kreis um <em>A</em> mit Radius <code>|AP|</code> und einen Kreis um <em>B</em> mit Radius <code>|BP|</code>.<br>
        3. Beide Kreise schneiden sich auf der anderen Seite der Achse genau im Spiegelpunkt <strong>P'</strong>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Im Koordinatensystem ergibt die Spiegelung an der y-Achse (<code>x = 0</code>): <code>P(x | y) → P'(−x | y)</code>; allgemein an der Achse <code>x = c</code> gilt <code>x' = 2c − x</code>. Der Umlaufsinn kehrt sich um!
      </div>
    `,
    formulas: [
      {
        name: "Haupteigenschaft achsensymmetrischer Punkte",
        html: "[PP'] ⊥ a &nbsp;und&nbsp; |PM| = |MP'| &nbsp; (|XP| = |XP'| für alle X ∈ a)",
        quantities: "a Symmetrieachse, M Mittelpunkt von [PP'], X Punkt auf a",
      },
      {
        name: "Spiegelung an Senkrechter x = c",
        html: "P(x | y) → P'(2c − x | y)",
        quantities: "Für c = 0 (y-Achse) einfach x' = −x",
      },
    ],
    quiz: Q(
      "Warum schneidet ein Kreis um einen Achsenpunkt A mit Radius |AP| auch den Spiegelpunkt P'?",
      "Weil jeder Punkt der Symmetrieachse gleich weit von P und P' entfernt ist (|AP| = |AP'|)",
      "Weil alle Kreise durch P auch durch den Ursprung gehen",
      "Weil der Radius sich beim Spiegeln halbiert",
      "Aus der Achsensymmetrie folgt |AP| = |AP'| für jeden Punkt A auf der Symmetrieachse.",
    ),
    lab: labAxisSym,
    exercises: [exAxisCoords, exAxisProperty],
    celebrationMessage:
      "Perfekt konstruiert! Du begründest Achsenspiegelungen sicher über Zirkelkreise.",
  },
  {
    id: "sy-2-punkt",
    section: "2.1",
    title: "2.2 Punktsymmetrie: Zentrum & Spiegelpunkt",
    subtitle: "Halbdrehungen konstruieren, Zentrum finden und von Achsensymmetrie abgrenzen",
    whyItMatters:
      "Windräder, Spielkarten und Kristallgitter sind punktsymmetrisch – anders als ein Spiegel dreht Punktspiegelung das Bild um 180°, ohne links und rechts zu vertauschen.",
    explanationHtml: `
      <p>Zwei Punkte <strong>P</strong> und <strong>P'</strong> sind <strong>punktsymmetrisch</strong> zum Symmetriezentrum <em>Z</em>, wenn <em>Z</em> genau der <strong>Mittelpunkt</strong> der Strecke <code>[PP']</code> ist: <code>P, Z, P'</code> liegen auf einer Geraden und es gilt <code>|PZ| = |ZP'|</code>.</p>
      <p>Anschaulich entspricht eine Punktspiegelung einer <strong>Drehung um 180°</strong> um das Zentrum <em>Z</em>.</p>
      <div class="example">
        <strong>Beispiel – Zirkelkonstruktion & Koordinaten:</strong><br>
        • <em>Zirkel & Lineal:</em> Ziehe den Strahl von P durch Z und schlage einen Kreis um Z mit Radius <code>|PZ|</code> → Schnittpunkt ist <strong>P'</strong>.<br>
        • <em>Umgekehrt (Z gesucht):</em> Sind P und P' gegeben, konstruierst du die Mittelsenkrechte von <code>[PP']</code>; ihr Schnittpunkt mit <code>[PP']</code> ist das Zentrum <strong>Z</strong>.<br>
        • <em>Koordinaten:</em> Für <code>P(4 | 1)</code> und <code>Z(1 | 2)</code> ist <code>P'(2·1 − 4 | 2·2 − 1) = P'(−2 | 3)</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Bei einer Punktspiegelung sind Bildstrecke <code>[A'B']</code> und Urstrecke <code>[AB]</code> stets <strong>parallel und gleich lang</strong>, und der Umlaufsinn (z. B. A → B → C gegen den Uhrzeigersinn) <strong>bleibt erhalten</strong>!
      </div>
    `,
    formulas: [
      {
        name: "Haupteigenschaft punktsymmetrischer Punkte",
        html: "Z = Mittelpunkt von [PP'], &nbsp; |PZ| = |ZP'|, &nbsp; [A'B'] ∥ [AB]",
        quantities: "Drehung um 180° um das Symmetriezentrum Z",
      },
      {
        name: "Koordinatenformel der Punktspiegelung",
        html: "x' = 2x<sub>Z</sub> − x, &nbsp; y' = 2y<sub>Z</sub> − y",
        quantities: "Z(x_Z | y_Z) liegt exakt mittig zwischen P(x | y) und P'(x' | y')",
      },
    ],
    quiz: Q(
      "Woran erkennst du auf den ersten Blick, ob ein gekipptes Dreieck eher punktgespiegelt als achsengespiegelt wurde?",
      "Der Umlaufsinn der Ecken (z. B. A → B → C) bleibt gleich und entsprechende Seiten sind parallel",
      "Der Umfang verdoppelt sich bei Punktspiegelung",
      "Die Innenwinkel verändern sich auf 180°",
      "Achsensymmetrie kehrt den Umlaufsinn um (wie im Spiegel); Punktspiegelung dreht nur um 180°, erhält also den Umlaufsinn und die Parallelität aller Seiten.",
    ),
    lab: labPointSym,
    exercises: [exPointMirror, exSymCompare],
    celebrationMessage:
      "Sehr gut! Du spiegelst Punkte um beliebige Zentren und unterscheidest beide Symmetrien exakt.",
  },
  {
    id: "sy-3-abstand",
    section: "2.1",
    title: "2.3 Mittelsenkrechte, Kreis & Abstandsgrenzen",
    subtitle: "Ortslinien nutzen, reale Probleme modellieren und Modellgrenzen erkennen",
    whyItMatters:
      "Wo steht der nächste Sendemast, wer erreicht einen Treffpunkt zuerst? Geometrische Ortslinien lösen solche Raumprobleme – sofern man ihre Annahmen kritisch prüft.",
    explanationHtml: `
      <p>Alle Punkte <em>P</em> mit einer bestimmten Abstandseigenschaft bilden eine geometrische Menge:</p>
      <ul>
        <li><strong>Mittelsenkrechte m<sub>[AB]</sub>:</strong> genau alle Punkte <em>P</em> mit <code>|PA| = |PB|</code> (gleich weit von A und B entfernt). Links davon gilt <code>|PA| &lt; |PB|</code>, rechts <code>|PA| &gt; |PB|</code>.</li>
        <li><strong>Kreis k(M; r):</strong> alle Punkte mit <code>|PM| = r</code>. Im Inneren gilt <code>|PM| &lt; r</code>, außerhalb <code>|PM| &gt; r</code>.</li>
      </ul>
      <div class="example">
        <strong>Beispiel – Standortsuche & Modellgrenzen:</strong><br>
        Ein Paketdepot soll näher an Stadt A als an Stadt B liegen (Halbebene links von <code>m<sub>[AB]</sub></code>) und höchstens 15 km von A entfernt sein (Kreis um A mit r = 15 km).<br>
        <strong>Grenze des Modells:</strong> Das geometrische Modell misst nur ebene <em>Luftlinie</em> – Autobahnkurven, Flüsse oder Gebirgspässe bleiben dabei unberücksichtigt!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Zum Modellieren übersetzt du Alltagsbedingungen („näher an…“, „höchstens…“) in Kreise und Mittelsenkrechten und bewertest am Schluss ehrlich, was das ideale Modell vereinfacht.
      </div>
    `,
    formulas: [
      {
        name: "Ortslinieneigenschaft der Mittelsenkrechten",
        html: "P ∈ m<sub>[AB]</sub> &nbsp;⇔&nbsp; |PA| = |PB|",
        quantities: "Trennt die Ebene in Punkte näher an A und Punkte näher an B",
      },
      {
        name: "Kreislinie und Kreisinneres",
        html: "|PM| = r (Linie), &nbsp; |PM| &lt; r (Inneres), &nbsp; |PM| &gt; r (Äußeres)",
        quantities: "M Mittelpunkt, r Radius (im Sachkontext meist Luftlinie)",
      },
    ],
    quiz: Q(
      "Ein Dorf P hat zum Brunnen A 3 km und zum Brunnen B 4 km Luftlinie. Welche Aussage trifft sicher zu?",
      "P liegt auf der A-Seite der Mittelsenkrechten m_[AB] und innerhalb eines Kreises um A mit Radius 3,5 km",
      "P liegt direkt auf der Mittelsenkrechten m_[AB]",
      "P liegt außerhalb jedes Kreises um A",
      "Da |PA| = 3 km < 4 km = |PB|, liegt P näher an A (diesseits von m_[AB]), und 3 km < 3,5 km.",
    ),
    lab: labLociModel,
    exercises: [exLociDistance, exModelLimit],
    celebrationMessage:
      "Klasse! Du übersetzt Abstandsprobleme in Kreise sowie Mittelsenkrechten und erkennst deren Modellgrenzen.",
  },
  {
    id: "sy-4-lot-winkel",
    section: "2.1",
    title: "2.4 Lote und Winkelhalbierende konstruieren",
    subtitle: "Rechte Winkel fällen/errichten und Winkel symmetrisch halbieren",
    whyItMatters:
      "Ohne Lot kein exakter Abstand zu einer Straße oder Geraden (z. B. Höhen im Dreieck!), und die Winkelhalbierende liefert später direkt den Inkreismittelpunkt.",
    explanationHtml: `
      <p>Alle drei Grundkonstruktionen nutzen geschickt die Symmetrieeigenschaften gleichschenkliger bzw. achsensymmetrischer Punkte aus:</p>
      <ol>
        <li><strong>Lot fällen</strong> (P liegt <em>nicht</em> auf g): Kreis um P schneidet g in zwei Punkten A und B (<code>|PA| = |PB|</code>). Die Mittelsenkrechte von <code>[AB]</code> verläuft durch P und steht senkrecht auf g!</li>
        <li><strong>Lot errichten</strong> (P liegt <em>auf</em> g): Kreis um P schneidet g in A und B, sodass P genau mittig liegt. Zwei gleiche größere Kreise um A und B liefern die Senkrechte durch P.</li>
        <li><strong>Winkelhalbierende w<sub>α</sub>:</strong> Kreis um den Scheitel S schneidet beide Schenkel in A und B (<code>|SA| = |SB|</code>). Die Achse der entstehenden achsensymmetrischen Figur (Kreise um A und B) ist <code>w<sub>α</sub></code>!</li>
      </ol>
      <div class="example">
        <strong>Beispiel – zwei Nebenwinkel halbieren:</strong><br>
        Am gestreckten Winkel liegen α = 70° und β = 110°. Die Winkelhalbierende w<sub>α</sub> schließt mit der Geraden 35° ein, w<sub>β</sub> schließt 55° ein.<br>
        Zwischen w<sub>α</sub> und w<sub>β</sub> entsteht daher exakt: <code>35° + 55° = 90°</code> – die beiden Winkelhalbierenden von Nebenwinkeln stehen immer senkrecht aufeinander!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Jeder Punkt auf der Winkelhalbierenden <code>w<sub>α</sub></code> besitzt zu <strong>beiden Schenkeln</strong> exakt den gleichen Abstand (gemessen jeweils im Lot!).
      </div>
    `,
    formulas: [
      {
        name: "Abstandseigenschaft der Winkelhalbierenden",
        html: "P ∈ w<sub>α</sub> &nbsp;⇔&nbsp; d(P, Schenkel 1) = d(P, Schenkel 2)",
        quantities: "d bezeichnet den senkrechten Abstand (Länge des Lots)",
      },
      {
        name: "Winkelhalbierende bei Nebenwinkeln",
        html: "∠ (w<sub>α</sub>, w<sub>β</sub>) = α/2 + β/2 = 90°",
        quantities: "Die Winkelhalbierenden von Nebenwinkeln stehen immer senkrecht aufeinander",
      },
    ],
    quiz: Q(
      "Womit beginnt man beim „Lot fällen“ von einem Punkt P außerhalb der Geraden g?",
      "Man schlägt einen Kreis um P, der g in zwei Punkten A und B schneidet",
      "Man verbindet P mit einem beliebigen Randpunkt der Zeichnung",
      "Man zeichnet einen Winkel von 60° an P",
      "Die Schnittpunkte A und B sind gleich weit von P entfernt; damit liegt P automatisch auf der Mittelsenkrechten von [AB], dem gesuchten Lot!",
    ),
    lab: labPerpBisectAngle,
    exercises: [exAngleBisector, exConstructionReason],
    celebrationMessage:
      "Sauber konstruiert! Lot fällen, Lot errichten und Winkelhalbierende sitzen mit Begründung.",
  },
  {
    id: "sy-5-vierecke",
    section: "2.1",
    title: "2.5 Haus der symmetrischen Vierecke",
    subtitle: "Vierecke über Symmetrie ordnen und Spezialfall-Beziehungen begründen",
    whyItMatters:
      "Wer einmal verstanden hat, warum jedes Quadrat ein Rechteck UND eine Raute ist, braucht keine zehn getrennten Formeln auswendig zu lernen.",
    explanationHtml: `
      <p>Vierecke lassen sich übersichtlich über ihre <strong>Spiegelachsen</strong> (Seitenmittenachsen vs. Diagonalachsen) und <strong>Punktsymmetrie</strong> ordnen:</p>
      <ul>
        <li><strong>Quadrat:</strong> 4 Spiegelachsen (2 Diagonalen + 2 Seitenmitten) und punktsymmetrisch.</li>
        <li><strong>Rechteck:</strong> 2 Seitenmittenachsen, punktsymmetrisch (alle Winkel 90°).</li>
        <li><strong>Raute (Rhombus):</strong> 2 Diagonalachsen, punktsymmetrisch (alle 4 Seiten gleich lang).</li>
        <li><strong>Parallelogramm:</strong> i. Allg. 0 Spiegelachsen, aber <strong>punktsymmetrisch</strong>!</li>
        <li><strong>Gleichschenkliges Trapez:</strong> genau 1 Seitenmittenachse, nicht punktsymmetrisch.</li>
        <li><strong>Symmetrisches Drachenviereck:</strong> genau 1 Diagonalachse, nicht punktsymmetrisch.</li>
      </ul>
      <div class="example">
        <strong>Beispiel – warum ist jedes Rechteck ein gleichschenkliges Trapez und ein Parallelogramm?</strong><br>
        Ein Parallelogramm verlangt zwei Paare paralleler Gegenseiten; beim Rechteck sind alle Winkel 90°, also sind gegenüberliegende Seiten automatisch parallel (→ Parallelogramm) und es existiert sogar mindestens eine Seitenmitten-Symmetrieachse (→ gleichschenkliges Trapez).<br>
        In Natur, Architektur und Design (Bienenwaben, Fachwerk, Mosaike) schaffen solche Symmetrien Stabilität und Harmonie.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Ein Typ A ist genau dann ein <strong>Spezialfall</strong> von Typ B, wenn A <em>alle</em> definierenden Eigenschaften von B erfüllt (und noch weitere dazu!).
      </div>
    `,
    formulas: [
      {
        name: "Spezialfall-Kette (A ⊂ B)",
        html: "Quadrat ⊂ (Rechteck &amp; Raute) ⊂ Parallelogramm",
        quantities: "Rechteck hat zudem die Symmetrieachse des gleichschenkligen Trapezes; Raute die des Drachenvierecks",
      },
    ],
    quiz: Q(
      "Welche Aussage zur Viereckshierarchie stimmt immer?",
      "Jede Raute ist ein Parallelogramm, weil durch ihre zwei Diagonal-Spiegelachsen gegenüberliegende Seiten stets parallel sind",
      "Jedes Parallelogramm besitzt zwei Spiegelachsen",
      "Jedes symmetrische Drachenviereck ist punktsymmetrisch",
      "Rauten haben vier gleich lange Seiten, daher sind gegenüberliegende Seiten immer parallel (Parallelogramm) und gleich lang (symmetr. Drachen). Ein allg. Parallelogramm hat jedoch 0 Spiegelachsen!",
    ),
    lab: labQuadHouse,
    exercises: [exQuadSym, exQuadHierarchy],
    celebrationMessage:
      "Perfekt geordnet! Das Haus der Vierecke und seine Spezialfall-Beziehungen sind nun glasklar.",
  },
  {
    id: "wi-1-kreuzung",
    section: "2.2",
    title: "2.6 Winkel an der Geradenkreuzung",
    subtitle: "Scheitelwinkel und Nebenwinkel sicher berechnen",
    whyItMatters:
      "Scheitel- und Nebenwinkel sind das tägliche Handwerkszeug beim Weiterrechnen in geometrischen Figuren und späteren Winkelbeweisen.",
    explanationHtml: `
      <p>Schneiden sich zwei Geraden in einem Punkt, entstehen vier Winkel. Jeweils zwei davon stehen in einer festen Beziehung:</p>
      <ul>
        <li><strong>Nebenwinkel:</strong> liegen nebeneinander an derselben Geraden und bilden zusammen einen gestreckten Winkel → <code>α + β = 180°</code>.</li>
        <li><strong>Scheitelwinkel:</strong> liegen einander gegenüber (am Scheitelpunkt) und sind <strong>immer gleich groß</strong> → <code>α = α*</code> (Begründung: beide haben denselben Nebenwinkel β, also <code>180° − β</code>!).</li>
      </ul>
      <div class="example">
        <strong>Beispiel – Nebenwinkel mit Unterschied bestimmen:</strong><br>
        An einer Kreuzung ist der Nebenwinkel β um 36° größer als α.<br>
        Ansatz: <code>α + (α + 36°) = 180°</code> → <code>2α = 144°</code> → <code>α = 72°</code>.<br>
        Damit gilt <code>β = 72° + 36° = 108°</code> (Probe: <code>72° + 108° = 180°</code> ✓).
      </div>
      <div class="merke">
        <strong>Merke:</strong> Scheitelwinkel = gleich groß; Nebenwinkel = Summe <code>180°</code>; alle vier Winkel zusammen = Vollwinkel <code>360°</code>.
      </div>
    `,
    formulas: [
      {
        name: "Nebenwinkelsatz",
        html: "α + β = 180°",
        quantities: "Benachbarte Winkel an einer geraden Linie",
      },
      {
        name: "Scheitelwinkelsatz",
        html: "α = α*",
        quantities: "Gegenüberliegende Winkel an einer Geradenkreuzung sind gleich groß",
      },
    ],
    quiz: Q(
      "Warum müssen zwei Scheitelwinkel α und α* stets exakt gleich groß sein?",
      "Weil beide denselben Nebenwinkel β haben und daher beide 180° − β messen",
      "Weil sich alle Winkel einer Kreuzung zu 180° addieren",
      "Weil zwei Geraden sich immer unter 90° schneiden",
      "Sowohl α + β = 180° als auch α* + β = 180° gelten; damit folgt sofort α = 180° − β = α*.",
    ),
    lab: labLineCross,
    exercises: [exCrossAngles, exMultiRayCross],
    celebrationMessage:
      "Sicher gelöst! Scheitel- und Nebenwinkel erkennst du ab sofort auf einen Blick.",
  },
  {
    id: "wi-2-parallelen",
    section: "2.2",
    title: "2.7 Stufenwinkel & Wechselwinkel an Parallelen",
    subtitle: "Doppelkreuzungen mit F- und Z-Winkeln meistern und Parallelität prüfen",
    whyItMatters:
      "Stufen- und Wechselwinkel verbinden zwei weit auseinanderliegende Punkte einer Figur – sie bilden das Fundament für den Beweis der Innenwinkelsumme.",
    explanationHtml: `
      <p>Werden zwei Geraden <em>g</em> und <em>h</em> von einer dritten Geraden <em>k</em> geschnitten, entsteht eine <strong>Doppelkreuzung</strong>:</p>
      <ul>
        <li><strong>Stufenwinkel (F-Winkel):</strong> liegen an derselben Seite der schneidenden Geraden <em>k</em> und auf derselben Seite von <em>g</em> bzw. <em>h</em> (wie im Buchstaben F).</li>
        <li><strong>Wechselwinkel (Z-Winkel):</strong> liegen auf entgegengesetzten Seiten von <em>k</em> und auf verschiedenen Seiten von <em>g</em> bzw. <em>h</em> (wie im Buchstaben Z; gleichbedeutend mit Scheitelwinkel eines Stufenwinkels).</li>
      </ul>
      <div class="example">
        <strong>Beispiel – Doppelrichtung des Satzes:</strong><br>
        • Wenn <code>g ∥ h</code> gilt und oben ein Winkel <code>65°</code> misst, messen alle zugehörigen Stufen- und Wechselwinkel ebenfalls <code>65°</code>, ihre Nebenwinkel <code>180° − 65° = 115°</code>.<br>
        • <em>Umgekehrt:</em> Misst ein Stufenwinkel <code>65°</code> und unten <code>68°</code>, sind <em>g</em> und <em>h</em> <strong>nicht parallel</strong>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> <code>g ∥ h</code> genau dann, wenn Stufenwinkel (F) gleich groß sind bzw. Wechselwinkel (Z) gleich groß sind!
      </div>
    `,
    formulas: [
      {
        name: "Stufen- und Wechselwinkelsatz",
        html: "g ∥ h &nbsp;⇔&nbsp; Stufenwinkel gleich groß &nbsp;⇔&nbsp; Wechselwinkel gleich groß",
        quantities: "F-Winkel (Stufenwinkel) und Z-Winkel (Wechselwinkel) an einer Doppelkreuzung",
      },
    ],
    quiz: Q(
      "Zwei Geraden g und h werden von k geschnitten. Ein Stufenwinkelpaar misst 72° und 74°. Was folgt daraus?",
      "g und h sind nicht parallel, sondern schneiden sich irgendwann",
      "Die zugehörigen Wechselwinkel sind trotzdem gleich groß",
      "Der Nebenwinkel zu 72° muss 74° groß sein",
      "Bei parallelen Geraden wären Stufenwinkel exakt gleich groß. 72° ≠ 74° zeigt, dass g und h sich schneiden.",
    ),
    lab: labParallelTransversal,
    exercises: [exParallelAngles, exCheckParallelCriterion],
    celebrationMessage:
      "Stark! Du findest F- und Z-Winkel sicher und testest mit ihnen jede Parallelität.",
  },
  {
    id: "wi-3-dreiecksumme",
    section: "2.2",
    title: "2.8 Innenwinkelsumme im Dreieck beweisen",
    subtitle: "Mehrschrittig über Hilfslinie argumentieren & Fundament von Ableitung unterscheiden",
    whyItMatters:
      "Hier erlebst du einen der berühmtesten Beweise der Mathematik: Warum 180° keine Messzufälligkeit ist, sondern zwingend aus den Parallelen-Gesetzen folgt.",
    explanationHtml: `
      <p>Messen mit dem Geodreieck liefert immer kleine Messfehler (mal 179°, mal 181°). Ein mathematischer <strong>Beweis</strong> zeigt dagegen für <em>jedes denkbare Dreieck</em>: <code>α + β + γ = 180°</code>.</p>
      <p><strong>Der mehrschrittige Beweis über eine Hilfslinie:</strong></p>
      <ol>
        <li>Zeichne durch die Ecke <em>C</em> eine <strong>Hilfslinie <em>p</em></strong> parallel zur Seite <code>[AB]</code> (<code>p ∥ AB</code>).</li>
        <li>Links von γ entsteht zwischen <em>p</em> und <code>[AC]</code> ein Winkel <code>α*</code>; rechts von γ entsteht zwischen <em>p</em> und <code>[BC]</code> ein Winkel <code>β*</code>.</li>
        <li>Nach dem <strong>Wechselwinkelsatz</strong> an den Parallelen <em>p</em> und <em>AB</em> gilt <code>α* = α</code> und <code>β* = β</code>.</li>
        <li>An der Geraden <em>p</em> füllen <code>α*</code>, <code>γ</code> und <code>β*</code> zusammen genau einen gestreckten Winkel: <code>α* + γ + β* = 180°</code>, also <code>α + β + γ = 180°</code>!</li>
      </ol>
      <div class="example">
        <strong>Fundamentalsatz vs. abgeleiteter Satz:</strong><br>
        In diesem Aufbau nutzen wir den <strong>Wechselwinkelsatz an Parallelen</strong> (der eng am Parallelenaxiom hängt) als <em>Fundamentalsatz</em> und folgern die Dreieckswinkelsumme als <em>abgeleiteten Satz</em>. (Bemerkenswert: Man könnte umgekehrt auch die Winkelsumme voraussetzen und den Wechselwinkelsatz daraus herleiten – jede Theorie wählt ihren Ausgangspunkt bewusst!)
      </div>
      <div class="merke">
        <strong>Merke:</strong> Geschickt gesetzte <strong>Hilfslinien</strong> machen verborgene Winkelbeziehungen sichtbar – hier verwandelt die Parallele durch C die drei Dreieckswinkel in einen gestreckten Winkel.
      </div>
    `,
    formulas: [
      {
        name: "Innenwinkelsumme im Dreieck",
        html: "α + β + γ = 180°",
        quantities: "Gilt in jedem Dreieck; bewiesen durch Parallele durch C und Wechselwinkel",
      },
    ],
    quiz: Q(
      "Welche entscheidende Aufgabe hat die Hilfslinie p parallel zu AB durch die Ecke C beim Beweis der Dreieckswinkelsumme?",
      "Sie überträgt α und β als Wechselwinkel neben γ an eine gerade Linie (180°)",
      "Sie halbiert den Winkel γ in zwei genau gleich große Hälften",
      "Sie macht aus jedem beliebigen Dreieck ein rechtwinkliges Dreieck",
      "Erst durch p ∥ AB werden die Wechselwinkel α* = α und β* = β erzeugt, die zusammen mit γ an der Geraden p 180° ergeben.",
    ),
    lab: labTriangleProof,
    exercises: [exTriangleAngle, exProofStepCheck],
    celebrationMessage:
      "Beeindruckend! Du verstehst nicht nur die Formel α + β + γ = 180°, sondern auch den Beweis und die Rolle der Hilfslinie.",
  },
  {
    id: "wi-4-vielecksumme",
    section: "2.2",
    title: "2.9 Innenwinkelsumme im Vieleck",
    subtitle: "Vielecke von einer Ecke aus in Dreiecke zerlegen und Winkel herleiten",
    whyItMatters:
      "Statt neue Formeln für Fünf-, Sechs- oder Zehnecke auswendig zu lernen, führst du jedes Vieleck mit einem Blick auf bekannte Dreiecke zurück.",
    explanationHtml: `
      <p>Wie groß ist die Summe aller Innenwinkel in einem Viereck, Fünfeck oder allgemein in einem <strong>n-Eck</strong> (<em>n ≥ 3</em>)?</p>
      <p><strong>Die Idee (Triangulierung):</strong> Ziehe von <em>einer einzigen Ecke</em> aus alle möglichen Diagonalen zu nicht benachbarten Ecken. Das n-Eck wird dabei lückenlos in <strong>(n − 2) Dreiecke</strong> zerlegt, deren Winkel zusammen exakt die Innenwinkel des n-Ecks bilden!</p>
      <div class="example">
        <strong>Beispiel – vom Dreieck zum Achteck:</strong><br>
        • Viereck (n = 4): 1 Diagonale → <code>4 − 2 = 2</code> Dreiecke → <code>2 · 180° = 360°</code>.<br>
        • Sechseck (n = 6): 3 Diagonalen → <code>6 − 2 = 4</code> Dreiecke → <code>4 · 180° = 720°</code>.<br>
        • Ist das Sechseck <strong>regelmäßig</strong>, sind alle 6 Innenwinkel gleich groß: <code>720° : 6 = 120°</code> (bekannt von Bienenwaben!).
      </div>
      <div class="merke">
        <strong>Merke:</strong> Innenwinkelsumme im n-Eck = <code>(n − 2) · 180°</code>. Von <em>n</em> Ecken geht jede Diagonale an die eigenen beiden Nachbarn und an sich selbst nicht – daher bleiben <code>n − 3</code> Diagonalen und <code>n − 2</code> Dreiecke.
      </div>
    `,
    formulas: [
      {
        name: "Innenwinkelsumme im n-Eck",
        html: "S<sub>n</sub> = (n − 2) · 180°",
        quantities: "n Anzahl der Ecken (n ≥ 3); Zerlegung in (n − 2) Dreiecke ab einer Ecke",
      },
      {
        name: "Innenwinkel im regelmäßigen n-Eck",
        html: `α = ${frac("(n − 2) · 180°", "n")}`,
        quantities: "Alle n Seiten und alle n Innenwinkel sind gleich groß",
      },
    ],
    quiz: Q(
      "Wie viele Dreiecke entstehen durch alle Diagonalen ab EINER Ecke eines Siebenecks, und wie groß ist seine Innenwinkelsumme?",
      "5 Dreiecke → 5 · 180° = 900°",
      "7 Dreiecke → 7 · 180° = 1260°",
      "4 Dreiecke → 4 · 180° = 720°",
      "n = 7 liefert n − 2 = 5 Dreiecke ab einer Ecke; somit beträgt die Winkelsumme 5 · 180° = 900°.",
    ),
    lab: labPolygonTriangulation,
    exercises: [exPolyAngleSum, exPolyMissingAngle],
    celebrationMessage:
      "Klasse hergeleitet! Jedes n-Eck führst du sicher auf (n − 2) Dreiecke zurück.",
  },
  {
    id: "wi-5-mehrfach",
    section: "2.2",
    title: "2.10 Mehrfache Geradenkreuzungen & Parallelitätsprüfung",
    subtitle: "Kombinierte Winkelaufgaben Schritt für Schritt lösen und begründen",
    whyItMatters:
      "Bei technischen Skizzen, Dachstühlen oder Beweisfiguren greifen Scheitelwinkel, Dreieckssumme und Wechselwinkel ineinander – hier trainierst du den Überblick.",
    explanationHtml: `
      <p>Bei Figuren mit <strong>mehrfachen Geradenkreuzungen</strong> lässt sich ein fehlender Winkel selten in einem einzigen Schritt ablesen. Arbeite dich schrittweise von bekannten Winkeln weiter und schreibe die Begründung (z. B. <em>NW = Nebenwinkel</em>, <em>SW = Scheitelwinkel</em>, <em>WW = Wechselwinkel</em>, <em>DWS = Dreieckswinkelsumme</em>) direkt dazu!</p>
      <div class="example">
        <strong>Beispiel – Zickzack-Strecke zwischen zwei Parallelen:</strong><br>
        Zwischen zwei parallelen Geraden <em>g ∥ h</em> knickt ein Weg um einen spitzen Winkel an <em>g</em> (<code>35°</code>) und an <em>h</em> (<code>42°</code>).<br>
        Zeichne durch den Knick eine <strong>parallele Hilfslinie</strong> zu <em>g</em> und <em>h</em>:<br>
        Oberer Teil des Knickwinkels = <code>35°</code> (Wechselwinkel zu g), unterer Teil = <code>42°</code> (Wechselwinkel zu h) → Gesamtwinkel = <code>35° + 42° = 77°</code>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Wenn du beweisen sollst, ob <code>g ∥ h</code> gilt, berechne am Ende ein Paar aus Stufen- oder Wechselwinkeln: Nur bei exakter Gleichheit sind die Geraden wirklich parallel!
      </div>
    `,
    formulas: [
      {
        name: "Werkzeugkasten Winkeljagd",
        html: "NW: α + β = 180° · SW: α = α* · DWS: α + β + γ = 180° · WW/StW bei g ∥ h",
        quantities: "Jeden Zwischenwinkel benennen und seine Regel angeben",
      },
    ],
    quiz: Q(
      "In einer komplexen Figur berechnest du für zwei Stufenwinkel an den Geraden g und h über eine Dreieckssumme 58° bzw. über einen Nebenwinkel 59°. Was beweist das?",
      "g und h sind sicher nicht parallel, weil gleich gelegene Stufenwinkel nicht gleich groß sind",
      "Man muss das Dreieck falsch gezeichnet haben",
      "Scheitelwinkel gelten nur bei parallelen Geraden",
      "Wären g und h parallel, müssten beide Stufenwinkel exakt gleich groß sein. 58° ≠ 59° widerlegt g ∥ h.",
    ),
    lab: labMultiCrossing,
    exercises: [exParallelTestMulti, exZigZagAngle],
    celebrationMessage:
      "Lernbereich 2 gemeistert! Symmetrie, Konstruktionen, Vierecke und Winkelbeweise sitzen felsenfest.",
  },
]);
