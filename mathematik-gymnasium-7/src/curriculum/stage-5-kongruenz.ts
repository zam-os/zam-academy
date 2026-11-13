import { choiceField, intField, numberField } from "./helpers";
import { countPhrase, Q, task } from "./builders";
import { makeLessons } from "./make";
import {
  labCircumInCircle,
  labCongruenceMotion,
  labConverseChecker,
  labHeightConstruction,
  labIsosceles,
  labSssSws,
  labSurveyModeling,
  labTangentThales,
  labThales,
  labWswSsw,
} from "./labs";
import { roundTo, sswSolutions, triangleValid } from "./math";
import { fmt, fmtUnit, MINUS } from "../exercises/format";
import type { ExerciseGenerator } from "../model/types";

// ─── Generators 5.1 (Kongruenz anschaulich) ───────────────────────────────────

const exCongruenceId: ExerciseGenerator = {
  id: "kongruenz-ecken",
  make(rng, level) {
    const a = rng.int(5, 9);
    const b = a === 7 ? 8 : 7;
    let c = Math.min(a + b - 2, rng.int(6, 11));
    if (c === a || c === b) c = a + b - 3;
    const perim = a + b + c;
    const alpha = rng.int(36, 58);
    let beta = rng.int(42, 66);
    if (alpha + beta === 90) beta += 3;
    const gamma = 180 - alpha - beta;

    return task(
      level,
      `Die beiden Dreiecke ABC und DEF sind kongruent (ABC ≅ DEF), wobei D auf A, E auf B und F auf C fällt. Im Dreieck ABC gilt a = |BC| = ${a} cm, b = |AC| = ${b} cm, c = |AB| = ${c} cm sowie β = ${beta}°. Gib |EF| und den Winkel ε bei E an.`,
      `Zwei Schablonen ABC und DEF liegen gedreht und umgeklappt auf dem Tisch, aber es gilt ABC ≅ DEF (A ↔ D, B ↔ E, C ↔ F). Bekannt sind |AB| = ${c} cm, |BC| = ${a} cm, |AC| = ${b} cm sowie α = ${alpha}° und β = ${beta}°. Berechne den Umfang von DEF und den Winkel φ bei Ecke F.`,
      level === 1
        ? [
            intField("Seitenlänge |EF|", a, [
              { value: c, hint: `E entspricht B und F entspricht C, also entspricht [EF] genau [BC] = a = ${a} cm!` },
            ], "cm"),
            intField("Winkel ε bei Ecke E", beta, undefined, "°"),
          ]
        : [
            intField("Umfang von Dreieck DEF", perim, undefined, "cm"),
            intField("Winkel φ bei Ecke F", gamma, [
              { value: alpha + beta, hint: `F entspricht C, also hat φ dieselbe Größe wie γ = 180° ${MINUS} α ${MINUS} β.` },
            ], "°"),
          ],
      `Bei kongruenten Dreiecken stimmen alle entsprechenden Seitenlängen und alle entsprechenden Innenwinkel genau überein.`,
      level === 1
        ? `[EF] entspricht [BC] = ${a} cm; Ecke E entspricht B mit Winkel β = ${beta}°.`
        : `Umfang(DEF) = Umfang(ABC) = ${a} + ${b} + ${c} = ${perim} cm; φ = γ = 180° ${MINUS} ${alpha}° ${MINUS} ${beta}° = ${gamma}°.`,
      level === 1
        ? `|EF| = <strong>${a} cm</strong> und ε = <strong>${beta}°</strong>.`
        : `Umfang = <strong>${perim} cm</strong>, Winkel φ = <strong>${gamma}°</strong>.`,
      { a, b, c, perim, alpha, beta, gamma },
    );
  },
};

const exCongruenceTest: ExerciseGenerator = {
  id: "kongruenz-kriterium",
  make(rng, level) {
    const side1 = 2 * rng.int(2, 4);
    const side2 = side1 + 2;
    const areaSame = side1 * side2; // rectangle vs different rectangle with half base * 2*side2
    return task(
      level,
      `Ein Rechteck hat die Seiten ${side1} cm und ${side2} cm (Flächeninhalt ${areaSame} cm²). Ein zweites Rechteck hat denselben Flächeninhalt ${areaSame} cm², aber die Breite ${side1 / 2} cm und Länge ${2 * side2} cm. Wie groß ist die Differenz ihrer Umfänge, und sind die Rechtecke kongruent?`,
      `Prüfe zwei Dreiecke: Beide besitzen die Innenwinkel 50°, 60° und 70° – eines hat Grundseite ${side1} cm, das andere ${side2} cm. Sind zwei Figuren mit denselben Winkeln (oder demselben Flächeninhalt ${areaSame} cm²) automatisch kongruent?`,
      [
        ...(level === 1
          ? [
              intField(
                "Unterschied der Umfänge",
                Math.abs(2 * (side1 + side2) - 2 * (side1 / 2 + 2 * side2)),
                undefined,
                "cm",
              ),
            ]
          : [intField("Seitenunterschied", side2 - side1, undefined, "cm")]),
        choiceField(
          "Sind die beiden Figuren kongruent?",
          [
            "Nein: Gleicher Flächeninhalt bzw. gleiche Winkel allein genügen nicht für Deckungsgleichheit",
            "Ja, jede Flächengleichheit macht Figuren automatisch deckungsgleich",
            "Ja, durch Drehung werden unterschiedlich lange Seiten gleich lang",
          ],
          0,
        ),
      ],
      `Kongruenz bedeutet: durch Verschieben, Drehen oder Spiegeln (inkl. Umklappen) exakt zur Deckung bringbar – Seitenlängen UND Winkel müssen stimmen!`,
      level === 1
        ? `Umfänge: ${2 * (side1 + side2)} cm vs. ${2 * (side1 / 2 + 2 * side2)} cm (verschiedene Seitenlängen → nicht deckungsgleich!).`
        : `Gleiche Winkel (WWW) machen Dreiecke zwar ähnlich in der Form, vergrößerte oder verkleinerte Kopien (${side2} cm vs. ${side1} cm) sind aber nicht kongruent.`,
      `<strong>Nicht kongruent</strong> – für Kongruenz reicht weder Flächengleichheit allein noch Winkelgleichheit allein.`,
      { side1, side2, areaSame },
    );
  },
};

// ─── Generators 5.2 (SSS, SWS & Dreiecksungleichung) ─────────────────────────

const exSssTriangleIneq: ExerciseGenerator = {
  id: "dreiecksungleichung-sss",
  make(rng, level) {
    const a = rng.int(4, 9);
    const b = rng.int(5, 10);

    if (level === 1) {
      const valid = (rng.sign() > 0);
      const c = valid ? rng.int(Math.abs(a - b) + 2, a + b - 1) : a + b + rng.int(0, 3);
      const isOk = triangleValid(a, b, c);
      return task(
        level,
        `Gegeben sind drei Streckenlängen a = ${a} cm, b = ${b} cm und c = ${c} cm. Berechne a + b und prüfe mit der Dreiecksungleichung, ob nach SSS ein Dreieck entsteht.`,
        "",
        [
          intField("Summe der zwei Seiten a + b", a + b, undefined, "cm"),
          choiceField(
            "Ist ein Dreieck konstruierbar (SSS)?",
            isOk
              ? [`Ja, weil ${a} + ${b} > ${c} (und jede Summe zweier Seiten größer als die dritte ist)`, "Nein, der Zirkel schneidet sich nicht"]
              : [`Nein, weil a + b = ${a + b} ≤ ${c} (Dreiecksungleichung verletzt)`, "Ja, SSS gilt immer für beliebige drei Zahlen"],
            0,
          ),
        ],
        `Dreiecksungleichung: Die Summe zweier beliebiger Seiten muss stets ECHT größer sein als die dritte Seite (a + b > c).`,
        `a + b = ${a} + ${b} = ${a + b} cm im Vergleich zu c = ${c} cm.`,
        `Summe a + b = <strong>${a + b} cm</strong> → <strong>${isOk ? "Dreieck eindeutig nach SSS konstruierbar" : "kein Dreieck möglich"}</strong>.`,
        { a, b, c },
      );
    }

    const minC = Math.abs(a - b) + 1;
    const maxC = a + b - 1;
    return task(
      level,
      "",
      `Zwei Seiten eines Dreiecks messen a = ${a} cm und b = ${b} cm. Die dritte Seite c soll eine ganzzahlige Zentimeterzahl sein. Bestimme nach der Dreiecksungleichung die kleinstmögliche und die größtmögliche ganze Zentimeterzahl für c.`,
      [
        intField("Kleinste ganze Zahl für c", minC, [
          {
            value: Math.abs(a - b),
            hint: `Bei Gleichheit |a ${MINUS} b| liegen die drei Punkte flach auf einer Geraden – c muss ECHT größer als |a ${MINUS} b| sein!`,
          },
        ], "cm"),
        intField("Größte ganze Zahl für c", maxC, [
          {
            value: a + b,
            hint: `c = a + b = ${a + b} cm bildet nur eine zusammengeklappte Strecke – c muss ECHT kleiner als ${a + b} cm sein!`,
          },
        ], "cm"),
      ],
      "",
      `Es muss sowohl |a ${MINUS} b| < c als auch c < a + b gelten → ${Math.abs(a - b)} < c < ${a + b}.`,
      `Ganzzahlige Grenzen: mindestens <strong>${minC} cm</strong> und höchstens <strong>${maxC} cm</strong>.`,
      { a, b, minC, maxC },
    );
  },
};

const exSwsRecognition: ExerciseGenerator = {
  id: "sws-kongruenz",
  make(rng, level) {
    const b = rng.int(5, 9);
    const c = rng.int(6, 11);
    const alpha = rng.int(35, 115);
    const valid = (rng.sign() > 0);
    // SWS requires: sides b, c AND enclosed angle alpha (at A)! If beta given instead, it's NOT enclosed between b and c!
    const givenAngleName = valid ? "α (zwischen b und c)" : "β (liegt NICHT zwischen b und c)";

    return task(
      level,
      `Gegeben sind b = ${b} cm, c = ${c} cm und ${givenAngleName} = ${alpha}°. ${valid ? "Wie groß ist der eingeschlossene Winkel, und warum ist das Dreieck eindeutig bestimmt?" : "Warum greift der Kongruenzsatz SWS hier NICHT unmittelbar?"}`,
      `Überprüfe die Konstruierbarkeit aus b = ${b} cm, c = ${c} cm und ${givenAngleName} = ${alpha}°. Wie groß muss ein zweiter Winkel mindestens unter 180° sein (180° ${MINUS} ${alpha}° als Rest für β + γ), und ist SWS erfüllt?`,
      [
        intField(level === 1 ? "Gegebener Winkel" : "Restwinkelsumme der beiden anderen Winkel", level === 1 ? alpha : 180 - alpha, undefined, "°"),
        choiceField(
          "Anwendung des Satzes SWS",
          valid
            ? [
                "SWS trifft zu: α liegt genau zwischen b = [AC] und c = [AB] → eindeutig konstruierbar",
                "SWS scheitert, weil immer die größte Seite gegeben sein muss",
                "Man braucht zuerst noch die dritte Seite a",
              ]
            : [
                "SWS trifft NICHT zu: β liegt b gegenüber (SSW/ssW) und wird nicht von b und c eingeschlossen",
                "SWS trifft trotzdem immer zu",
                "Ein Dreieck mit b, c und β hat automatisch einen rechten Winkel",
              ],
          0,
        ),
      ],
      `Bei SWS muss der gegebene Winkel genau zwischen den beiden gegebenen Seiten liegen (Skizze/Planfigur zeichnen: b = AC, c = AB → Winkel bei A ist α!).`,
      `Die Seiten b = [AC] und c = [AB] treffen sich in Ecke A; ihr eingeschlossener Winkel ist α.`,
      valid
        ? `α = <strong>${alpha}°</strong> (Rest ${180 - alpha}°): SWS macht das Dreieck eindeutig konstruierbar.`
        : `Nicht SWS! Restwinkelsumme wäre <strong>${180 - alpha}°</strong>, aber β liegt b gegenüber.`,
      { b, c, alpha },
    );
  },
};

// ─── Generators 5.3 (WSW, SWW & SsW) ─────────────────────────────────────────

const exWswThirdAngle: ExerciseGenerator = {
  id: "wsw-sww-konstruktion",
  make(rng, level) {
    const a1 = rng.int(40, 85);
    const tooLarge = (rng.sign() < 0) && level === 2;
    const a2 = tooLarge ? 180 - a1 + rng.int(5, 25) : rng.int(30, 145 - a1);
    const sum = a1 + a2;
    const ok = sum < 180;
    const third = ok ? 180 - sum : 0;

    return task(
      level,
      `Bekannt sind eine Seite c = 7 cm sowie die beiden anliegenden Winkel α = ${a1}° und β = ${a2}°. Berechne den dritten Winkel γ und nenne den passenden Kongruenzsatz.`,
      `Ein Dreieck soll aus Seite c = 8 cm, α = ${a1}° und γ = ${a2}° konstruiert werden (SWW). Prüfe rechnerisch anhand der Winkelsumme ${a1}° + ${a2}°, ob sich die beiden freien Schenkel überhaupt schneiden (Winkel < 180°), und gib ggf. den fehlenden Winkel β (oder 0 bei „unmöglich“) an.`,
      [
        intField(ok ? "Fehlender dritter Winkel" : "Dritter Winkel (0 falls unmöglich)", ok ? third : 0, [
          ...(ok && sum !== third
            ? [{ value: sum, hint: `Du hast ${a1}° + ${a2}° = ${sum}° gerechnet – ziehe die Summe noch von 180° ab!` }]
            : []),
        ], "°"),
        choiceField(
          "Beurteilung der Konstruktion",
          ok
            ? [
                level === 1
                  ? "Eindeutig konstruierbar nach WSW (α + β < 180°)"
                  : `Eindeutig nach SWW/WSW: β = ${third}° lässt sich antragen`,
                "Nicht konstruierbar, da keine Seite gegeben ist",
                "Mehrdeutig mit zwei verschiedenen Dreiecken",
              ]
            : [
                `Unmöglich: ${a1}° + ${a2}° = ${sum}° ≥ 180°, die freien Schenkel laufen auseinander bzw. parallel`,
                "Eindeutig konstruierbar nach WSW",
                "Es entstehen genau zwei kongruente Dreiecke",
              ],
          0,
        ),
      ],
      `Prüfe immer α + β < 180° (bzw. Summe zweier Winkel < 180°), damit sich die Schenkel über der Seite noch treffen!`,
      `Winkelsumme der beiden gegebenen Winkel: ${a1}° + ${a2}° = ${sum}°.`,
      ok
        ? `Dritter Winkel = 180° ${MINUS} ${sum}° = <strong>${third}°</strong> → eindeutig konstruierbar.`
        : `<strong>Unmöglich (0°)</strong>, da ${sum}° ≥ 180°!`,
      { a1, a2, sum, third },
    );
  },
};

const exSswCases: ExerciseGenerator = {
  id: "ssw-mehrdeutig",
  make(rng, level) {
    // Clean geometric cases avoiding trig: alpha = 30° -> height = b / 2, or alpha >= 90°, or a > b!
    if (level === 1) {
      const b = rng.int(5, 8);
      const isUnique = (rng.sign() > 0);
      const a = isUnique ? b + rng.int(2, 5) : b - rng.int(2, 3);
      const alpha = isUnique ? rng.int(35, 70) : 105; // if not unique & alpha = 105° & a < b => 0 triangles!
      return task(
        level,
        `Gegeben sind b = ${b} cm, a = ${a} cm und der Winkel α = ${alpha}° (α liegt der Seite a gegenüber!). Entscheide anhand des Vergleichs von a und b (SsW-Bedingung), wie groß die Differenz (a ${MINUS} b) ist und ob eindeutig ein Dreieck entsteht.`,
        "",
        [
          intField("Differenz a − b", a - b, undefined, "cm"),
          choiceField(
            "Konstruierbarkeit",
            isUnique
              ? [
                  `Eindeutig nach SsW (1 Dreieck), da α der längeren Seite a > b gegenüberliegt`,
                  `Mehrdeutig mit zwei Dreiecken`,
                  `Unmöglich, weil α spitz ist`,
                ]
              : [
                  `Kein Dreieck (0 Lösungen): gegenüber einem stumpfen Winkel (${alpha}°) müsste a länger als b sein`,
                  `Eindeutig nach SsW`,
                  `Unendlich viele Dreiecke`,
                ],
            0,
          ),
        ],
        `SsW gilt nur dann eindeutig, wenn der gegebene Winkel der LÄNGEREN der beiden gegebenen Seiten gegenüberliegt (hier a > b)!`,
        `a ${MINUS} b = ${a} ${MINUS} ${b} = ${fmt(a - b, 0)} cm; ${isUnique ? "a ist die längere Seite (SsW)" : "a < b bei stumpfem α = 105° unmöglich"}.`,
        `a ${MINUS} b = <strong>${fmt(a - b, 0)} cm</strong> → <strong>${isUnique ? "1 eindeutiges Dreieck (SsW)" : "0 Dreiecke"}</strong>.`,
        { a, b, alpha },
      );
    }

    // Level 2: Exact alpha = 30° so height h = b / 2! Show all 3 geometric possibilities cleanly!
    const b = rng.pick([6, 8, 10, 12]);
    const h = b / 2; // because opposite cathetus of 30° is half the side b!
    const subcase = rng.int(0, 2); // 0 -> 0 triangles (a < h), 1 -> 2 triangles (h < a < b), 2 -> 1 triangle (a > b)
    const a = subcase === 0 ? h - 1 : subcase === 1 ? h + 1 : b + 2;
    const count = sswSolutions(b, a, 30).count;

    return task(
      level,
      "",
      `Sonderfall „kleine Seite gegenüber“ (ssW): Gegeben ist b = |AC| = ${b} cm und α = 30° an A. Der Abstand von C zur Grundgeraden (Höhe auf c) beträgt bei 30° exakt die Hälfte von b, also h = ${h} cm. Wie viele nicht kongruente Dreiecke entstehen beim Kreis um C mit Radius a = ${a} cm?`,
      [
        intField("Abstandshöhe h von C zur Geraden AB", h, undefined, "cm"),
        intField("Anzahl möglicher Dreiecke", count, [
          {
            value: count === 2 ? 1 : 2,
            hint: `Der Kreis um C mit Radius a = ${a} cm ${subcase === 0 ? `erreicht die Gerade nicht (a < h = ${h})` : subcase === 1 ? `schneidet den Strahl AB in ZWEI Punkten (h < a < b)` : `trifft den Strahl AB nur einmal (a > b = SsW)`}!`,
          },
        ]),
      ],
      "",
      `Die Höhe beträgt h = ${h} cm. Der Kreis mit Radius a = ${a} cm schneidet den freien Strahl von A aus genau ${countPhrase(count, "-mal", "-mal")}.`,
      `Abstand h = <strong>${h} cm</strong>; es entstehen genau <strong>${countPhrase(count, "Dreieck", "Dreiecke")}</strong>.`,
      { b, h, a, count },
    );
  },
};

// ─── Generators 5.4 (Gleichschenklige & gleichseitige Dreiecke) ───────────────

const exIsoscelesAngles: ExerciseGenerator = {
  id: "gleichschenklig-winkel",
  make(rng, level) {
    if (level === 1) {
      const baseAngle = rng.int(32, 76);
      const tip = 180 - 2 * baseAngle;
      return task(
        level,
        `In einem gleichschenkligen Dreieck sind die Basiswinkel jeweils α = β = ${baseAngle}°. Berechne den Winkel γ an der Spitze.`,
        "",
        [
          intField("Spitzenwinkel γ", tip, [
            { value: 180 - baseAngle, hint: `Beide Basiswinkel zusammen betragen 2 · ${baseAngle}° = ${2 * baseAngle}°!` },
          ], "°"),
        ],
        `Basiswinkelsatz: Im gleichschenkligen Dreieck sind beide Basiswinkel gleich groß, zusammen α + α + γ = 180°.`,
        `2 · ${baseAngle}° = ${2 * baseAngle}°.`,
        `γ = 180° ${MINUS} ${2 * baseAngle}° = <strong>${tip}°</strong>.`,
        { baseAngle, tip },
      );
    }

    // Level 2: given ONE angle x < 80 -> two cases (either vertex or base angle)!
    const w = rng.pick([40, 50, 64, 70, 80]);
    const otherIfTip = (180 - w) / 2;
    const tipIfBase = 180 - 2 * w;
    return task(
      level,
      "",
      `Ein gleichschenkliges Dreieck besitzt einen Innenwinkel von ${w}° (es wird nicht gesagt, ob es sich um einen Basiswinkel oder den Winkel an der Spitze handelt). Berechne den Winkel an der Spitze für den Fall, dass ${w}° ein Basiswinkel ist, UND den Basiswinkel für den Fall, dass ${w}° an der Spitze liegt.`,
      [
        intField(`Spitzenwinkel (falls ${w}° Basiswinkel ist)`, tipIfBase, [
          { value: 180 - w, hint: `Zwei Basiswinkel à ${w}° zusammenziehen: 180° ${MINUS} 2 · ${w}°.` },
        ], "°"),
        intField(`Basiswinkel (falls ${w}° an der Spitze liegt)`, otherIfTip, [
          { value: 180 - w, hint: `Die verbleibenden ${180 - w}° teilen sich auf ZWEI gleiche Basiswinkel auf!` },
        ], "°"),
      ],
      "",
      `Fall 1 (Basiswinkel ${w}°): Spitze = 180° ${MINUS} 2 · ${w}° = ${tipIfBase}°. Fall 2 (Spitze ${w}°): Basis = (180° ${MINUS} ${w}°) : 2 = ${otherIfTip}°.`,
      `Fall 1: Spitzenwinkel = <strong>${tipIfBase}°</strong>; Fall 2: Basiswinkel = <strong>${otherIfTip}°</strong>.`,
      { w, tipIfBase, otherIfTip },
    );
  },
};

const exIsoscelesConstruct: ExerciseGenerator = {
  id: "gleichschenklig-konstruieren",
  make(rng, level) {
    const leg = rng.int(5, 11);
    const base = rng.int(4, Math.min(2 * leg - 2, 10));
    const perim = 2 * leg + base;
    const eqSide = rng.int(4, 9);

    return task(
      level,
      `Ein gleichschenkliges Dreieck ABC hat die Basis c = ${base} cm und Schenkel der Länge a = b = ${leg} cm. Wie schlägst du die Zirkelkreise ab A und B zur Spitze C, und wie groß ist der Umfang?`,
      `Ein gleichseitiges Dreieck hat den Umfang ${3 * eqSide} cm. Berechne eine Seitenlänge und die Größe jedes Innenwinkels, und begründe die Konstruktion der drei Ecken allein mit Zirkel und Lineal.`,
      [
        intField(level === 1 ? "Umfang des Dreiecks" : "Seitenlänge", level === 1 ? perim : eqSide, undefined, "cm"),
        intField(level === 1 ? "Zirkelradius um A und B" : "Jeder Innenwinkel", level === 1 ? leg : 60, undefined, level === 1 ? "cm" : "°"),
        choiceField(
          "Symmetrie- und Konstruktionsmerkmal",
          level === 1
            ? [
                "C liegt auf der Mittelsenkrechten der Basis [AB] (Symmetrieachse halbiert auch γ)",
                "Man muss zuerst willkürlich drei verschiedene Winkel raten",
                "Die Basiswinkel betragen immer 90°",
              ]
            : [
                "Basis c abtragen, zwei gleich große Kreise mit Radius c um A und B schneiden sich in C (3·60° = 180°)",
                "Ein gleichseitiges Dreieck besitzt nur eine einzige Symmetrieachse",
                "Man braucht zwingend drei verschiedene Zirkelradien",
              ],
          0,
        ),
      ],
      level === 1
        ? `Beide Schenkel sind gleich lang (${leg} cm): Zwei Zirkelkreise um A und B mit Radius ${leg} cm treffen sich in C.`
        : `Beim gleichseitigen Dreieck sind alle drei Seiten gleich (${3 * eqSide} : 3) und alle drei Innenwinkel gleich groß (180° : 3).`,
      level === 1
        ? `Umfang = ${base} + 2 · ${leg} = ${perim} cm; Radius ab A und B jeweils ${leg} cm.`
        : `Seitenlänge = ${3 * eqSide} : 3 = ${eqSide} cm; jeder Winkel = 180° : 3 = 60°.`,
      level === 1
        ? `Umfang = <strong>${perim} cm</strong>, Radius = <strong>${leg} cm</strong> (Symmetrieachse auf [AB]).`
        : `Seite = <strong>${eqSide} cm</strong>, jeder Winkel = <strong>60°</strong>.`,
      { leg, base, perim, eqSide },
    );
  },
};

// ─── Generators 5.5 (Satz, Kehrsatz & Gegenbeispiel) ──────────────────────────

const exPremiseConverse: ExerciseGenerator = {
  id: "satz-und-kehrsatz",
  make(rng, level) {
    const items = [
      {
        satz: "Wenn ein Viereck ein Quadrat ist, dann hat es vier rechte Winkel.",
        kehrsatz: "Wenn ein Viereck vier rechte Winkel hat, dann ist es ein Quadrat.",
        trueConverse: false,
        counter: "Ein nicht-quadratisches Rechteck (z. B. 6 cm mal 2 cm) hat vier rechte Winkel, ist aber kein Quadrat.",
        rectSum: 16,
        rectSide: 6,
      },
      {
        satz: "Wenn es draußen regnet, dann wird die Straße nass.",
        kehrsatz: "Wenn die Straße nass ist, dann regnet es draußen.",
        trueConverse: false,
        counter: "Ein Rasensprenger oder ein Reinigungswagen macht die Straße ebenfalls nass, ohne dass es regnet.",
        rectSum: 20,
        rectSide: 5,
      },
      {
        satz: "Wenn ein Dreieck gleichseitig ist, dann ist es auch gleichschenklig.",
        kehrsatz: "Wenn ein Dreieck gleichschenklig ist, dann ist es auch gleichseitig.",
        trueConverse: false,
        counter: "Ein gleichschenkliges Dreieck mit Seiten 5 cm, 5 cm und 3 cm ist nicht gleichseitig.",
        rectSum: 13,
        rectSide: 5,
      },
      {
        satz: "Wenn ein Dreieck gleichschenklig ist, dann hat es zwei gleich große Innenwinkel.",
        kehrsatz: "Wenn ein Dreieck zwei gleich große Innenwinkel hat, dann ist es gleichschenklig.",
        trueConverse: true,
        counter: "Beide Richtungen (Satz und Kehrsatz) gelten hier genau dann, wenn Symmetrie vorliegt!",
        rectSum: 18,
        rectSide: 6,
      },
    ];
    const item = items[level === 1 ? rng.int(0, 2) : rng.int(0, 3)];
    const wrongDiff = rng.int(1, 3);

    return task(
      level,
      `Betrachte die wahre Aussage: „${item.satz}“ Bilde im Kopf den Kehrsatz (Voraussetzung und Behauptung tauschen) und entscheide, ob der Kehrsatz wahr oder falsch ist.`,
      `Prüfe Satz und Umkehrung: „${item.satz}“ Ein Gegenbeispiel-Viereck/Dreieck hat Summe der gegebenen Seiten ${item.rectSum} cm (eine Seite ${item.rectSide} cm). Wie lautet der korrekte Kehrsatz, und stimmt er immer?`,
      [
        choiceField(
          "Richtig formulierter Kehrsatz",
          [
            item.kehrsatz,
            item.satz,
            "Wenn ein Rechteck rund ist, dann bleibt der Radius gleich",
          ],
          0,
        ),
        choiceField(
          "Ist der Kehrsatz wahr?",
          item.trueConverse
            ? [
                `Ja, in diesem besonderen Fall ist auch der Kehrsatz wahr (${item.counter})`,
                "Nein, eine Umkehrung ist grundsätzlich immer falsch",
              ]
            : [
                `Nein, der Kehrsatz ist FALSCH – Gegenbeispiel: ${item.counter}`,
                "Ja, weil aus einer wahren „Wenn-dann“-Aussage immer auch die Umkehrung folgt",
              ],
          0,
        ),
        ...(level === 2
          ? [
              intField("Kontrollzahl (Umfang/Seitensumme minus " + `${wrongDiff}` + ")", item.rectSum - wrongDiff),
            ]
          : []),
      ],
      `Vertausche „Wenn … (Voraussetzung)“ und „dann … (Behauptung)“ für den Kehrsatz und suche aktiv ein Gegenbeispiel.`,
      `Voraussetzung und Behauptung getauscht: „${item.kehrsatz}“`,
      `${item.trueConverse ? "Hier wahr!" : "Hier FALSCH!"} Begründung: <strong>${item.counter}</strong>`,
      { trueConverse: item.trueConverse ? 1 : 0 },
    );
  },
};

const exCounterexampleLogic: ExerciseGenerator = {
  id: "gegenbeispiel-umkehrung",
  make(rng, level) {
    const a = rng.int(4, 8);
    const diff = rng.int(2, 4);
    const b = a + diff;
    const perim = 2 * (a + b);

    return task(
      level,
      `Satz: „Wenn ein Viereck ein Quadrat ist, dann beträgt seine Innenwinkelsumme 360° und alle Winkel sind 90°.“ Ein Rechteck mit den Seiten a = ${a} cm und b = ${b} cm hat den Umfang ${perim} cm. Warum widerlegt es den Kehrsatz?`,
      `Ein Dreieck hat die Basiswinkel α = β = ${rng.pick([45, 55, 65])}° (damit ist es gleichschenklig), aber nicht 60°. Prüfe die Implikation „Wenn alle Seiten gleich lang sind (gleichseitig), dann hat das Dreieck eine Symmetrieachse“ vs. deren Kehrsatz mit Basis ${a} cm und Schenkeln ${b} cm (Umfang = ${a + 2 * b} cm).`,
      [
        intField(level === 1 ? "Umfang des Gegenbeispiel-Rechtecks" : "Umfang des Gegenbeispiel-Dreiecks", level === 1 ? perim : a + 2 * b, undefined, "cm"),
        choiceField(
          "Welche Rolle spielt das Gegenbeispiel logisch?",
          [
            "Es erfüllt die Voraussetzung des Kehrsatzes (z. B. 4·90° bzw. Symmetrieachse), verletzt aber dessen Behauptung",
            "Es widerlegt auch die ursprüngliche Hinrichtung (den Ausgangssatz)",
            "Ein einziges Gegenbeispiel reicht nie zur Widerlegung",
          ],
          0,
        ),
      ],
      `Ein einzelnes Gegenbeispiel, bei dem die Voraussetzung des Kehrsatzes gilt, seine Behauptung aber nicht, widerlegt den Kehrsatz endgültig!`,
      level === 1
        ? `Das Rechteck (${a} cm mal ${b} cm, Umfang ${perim} cm) hat vier 90°-Winkel, aber verschieden lange Seiten (${a} ≠ ${b}).`
        : `Das gleichschenklige Dreieck (${a}, ${b}, ${b} cm, Umfang ${a + 2 * b} cm) hat eine Symmetrieachse, ist aber nicht gleichseitig.`,
      `Umfang = <strong>${level === 1 ? perim : a + 2 * b} cm</strong>: Es widerlegt den Kehrsatz sauber, lässt den Originalsatz aber gültig.`,
      { a, b, perim },
    );
  },
};

// ─── Generators 5.6 (Umkreis & Inkreis) ──────────────────────────────────────

const exCircumVsIncircle: ExerciseGenerator = {
  id: "umkreis-vs-inkreis",
  make(rng, level) {
    const r = rng.int(4, 8);
    const rho = rng.int(2, 4);
    const obtuse = (rng.sign() > 0);
    const angleC = obtuse ? rng.int(102, 130) : rng.int(48, 78);

    return task(
      level,
      `Ein Dreieck ABC hat den Umkreisradius R = ${r} cm (Mittelpunkt M_U) und den Inkreisradius ρ = ${rho} cm (Mittelpunkt M_I). Wie weit ist Ecke B von M_U entfernt, wie weit ist Seite [AB] (im Lot) von M_I entfernt, und mit welchen Konstruktionslinien entsteht M_U?`,
      `Du erforschst in einer dynamischen Geometriesoftware (DGS) ein Dreieck ABC mit größtem Winkel γ = ${angleC}° sowie Umkreisradius R = ${r} cm. Wo liegt der Umkreismittelpunkt M_U, wo liegt der Inkreismittelpunkt M_I, und wie weit liegen die drei Ecken von M_U entfernt?`,
      [
        intField(level === 1 ? "Abstand |M_U B| zur Ecke" : "Abstand |M_U A| = |M_U B| = |M_U C|", r, undefined, "cm"),
        ...(level === 1 ? [intField("Abstand von M_I zur Seite [AB]", rho, undefined, "cm")] : []),
        choiceField(
          level === 1 ? "Konstruktionslinien für Umkreis & Inkreis" : `Lage von M_U und M_I bei γ = ${angleC}°`,
          level === 1
            ? [
                "Umkreis = Mittelsenkrechten (gleicher Eckenabstand R); Inkreis = Winkelhalbierende (gleicher Seitenabstand ρ)",
                "Umkreis = Winkelhalbierende; Inkreis = Mittelsenkrechten",
                "Beide Kreise entstehen stets durch die Seitenhalbierenden",
              ]
            : obtuse
              ? [
                  `M_U liegt AUSSERHALB des stumpfwinkligen Dreiecks (${angleC}° > 90°); M_I liegt immer im Inneren`,
                  "Sowohl M_U als auch M_I wandern nach außerhalb",
                  "M_U liegt genau auf Ecke C, M_I außerhalb",
                ]
              : [
                  `M_U und M_I liegen beide im INNEREN des spitzwinkligen Dreiecks (alle Winkel < 90°)`,
                  "M_U liegt außerhalb, M_I auf dem Rand",
                  "M_U fällt genau auf die längste Seite, obwohl kein Winkel 90° misst",
                ],
          0,
        ),
      ],
      `Mittelsenkrechten sichern gleichen Abstand zu allen Ecken (Umkreis); Winkelhalbierende sichern gleichen Abstand zu allen Seiten (Inkreis).`,
      `Jeder Eckpunkt liegt auf der Kreislinie des Umkreises (Radius R = ${r} cm); bei einem Winkel > 90° liegt M_U außerhalb.`,
      `Abstand zu M_U = <strong>${r} cm</strong>${level === 1 ? `, Abstand zu M_I = <strong>${rho} cm</strong>` : ` (${obtuse ? "stumpfwinklig → M_U außerhalb" : "spitzwinklig → M_U im Inneren"}, M_I stets innen)`}.`,
      { r, rho, angleC },
    );
  },
};

const exCirclePointTest: ExerciseGenerator = {
  id: "umkreis-lage-winkel",
  make(rng, level) {
    const a = rng.int(25, 42);
    const b = rng.pick([38, 48, 52, 55, 65]);
    const c = 180 - a - b;
    const caseChoice = c > 90 ? 2 : c === 90 ? 1 : 0; // 0: spitz (innen), 1: recht (auf c), 2: stumpf (außen)

    return task(
      level,
      `Ein Dreieck hat die Innenwinkel α = ${a}° und β = ${b}°. Berechne den dritten Winkel γ und bestimme daraus, wo der Umkreismittelpunkt M_U im Dreieck liegt.`,
      `Für die DGS-Vermutung prüfst du zwei Winkel: α = ${a}° und β = ${b}°. Berechne den fehlenden Winkel γ und entscheide, ob der Umkreismittelpunkt M_U innerhalb, genau auf der Seite [AB] (= Thales-Fall!) oder außerhalb liegt.`,
      [
        intField("Innenwinkel γ", c, undefined, "°"),
        choiceField(
          "Lage des Umkreismittelpunkts M_U",
          [
            "Im Inneren des Dreiecks (spitzwinklig: alle Winkel < 90°)",
            "Genau auf dem Mittelpunkt der längsten Seite [AB] (rechtwinklig: γ = 90°)",
            "Außerhalb des Dreiecks (stumpfwinklig: γ > 90°)",
          ],
          caseChoice,
        ),
      ],
      `Berechne γ = 180° ${MINUS} α ${MINUS} β und schaue auf den größten Winkel: < 90° innen, = 90° auf Seitenmitte, > 90° außen.`,
      `γ = 180° ${MINUS} ${a}° ${MINUS} ${b}° = ${c}° (${c > 90 ? "größer als 90° → stumpfwinklig" : c === 90 ? "genau 90° → rechtwinklig" : "kleiner als 90° → spitzwinklig"}).`,
      `γ = <strong>${c}°</strong> → M_U liegt <strong>${caseChoice === 0 ? "im Inneren" : caseChoice === 1 ? "genau auf der Mitte von [AB]" : "außerhalb des Dreiecks"}</strong>.`,
      { a, b, c },
    );
  },
};

// ─── Generators 5.7 (Satz des Thales & Umkehrung) ────────────────────────────

const exThalesAngles: ExerciseGenerator = {
  id: "thales-winkel",
  make(rng, level) {
    let alpha = rng.int(22, 68);
    if (alpha === 30 || alpha === 45) alpha += 2;
    const beta = 90 - alpha;
    const centralBmc = 2 * alpha;

    if (level === 1) {
      return task(
        level,
        `Der Punkt C liegt auf dem Thaleskreis über dem Durchmesser [AB] (Mittelpunkt M). Bei A beträgt der Winkel α = ${alpha}°. Berechne γ bei C und β bei B.`,
        "",
        [
          intField("Winkel γ bei C", 90, undefined, "°"),
          intField("Winkel β bei B", beta, [
            { value: alpha, hint: `Das ganze Dreieck ABC ist i. Allg. nicht gleichschenklig! Rechne β = 90° ${MINUS} α = ${beta}°.` },
          ], "°"),
        ],
        `Nach dem Satz des Thales gilt am Halbkreis über dem Durchmesser [AB] immer γ = 90°, und mit α + β + 90° = 180° folgt β = 90° ${MINUS} α.`,
        `γ = 90° (Thales), β = 180° ${MINUS} 90° ${MINUS} ${alpha}° = ${beta}°.`,
        `<strong>γ = 90°</strong> und <strong>β = ${beta}°</strong>.`,
        { alpha, beta },
      );
    }

    return task(
      level,
      "",
      `Beim Beweis des Satzes von Thales verbindet man den Kreismittelpunkt M von [AB] mit dem Kreisbogenpunkt C. Wegen |MA| = |MC| = |MB| = r zerfällt ABC in zwei gleichschenklige Dreiecke AMC und MBC. Im Dreieck ABC misst α = ${alpha}°. Berechne den Winkel ∠AMC an M (Stichwort gleichschenklig!) und dessen Nebenwinkel ∠BMC.`,
      [
        intField("Mittelpunktswinkel ∠AMC", 180 - 2 * alpha, [
          {
            value: 180 - alpha,
            hint: `Im gleichschenkligen Dreieck AMC sind BEIDE Basiswinkel gleich α = ${alpha}°!`,
          },
        ], "°"),
        intField("Nebenwinkel ∠BMC", centralBmc, [
          {
            value: beta,
            hint: `∠BMC ist der Spitzenwinkel des gleichschenkligen Dreiecks MBC (= 2 · α = 180° ${MINUS} 2 · β)!`,
          },
        ], "°"),
      ],
      "",
      `Im gleichschenkligen Dreieck AMC gelten die Basiswinkel α = ${alpha}° und α = ${alpha}° → ∠AMC = 180° ${MINUS} 2 · ${alpha}° = ${180 - 2 * alpha}°; Nebenwinkel ∠BMC = 2 · ${alpha}° = ${centralBmc}°.`,
      `∠AMC = <strong>${180 - 2 * alpha}°</strong>, ∠BMC = <strong>${centralBmc}°</strong>.`,
      { alpha, beta, centralBmc },
    );
  },
};

const exThalesProofConverse: ExerciseGenerator = {
  id: "thales-umkehrung",
  make(rng, level) {
    const r = rng.int(3, 8);
    const diam = 2 * r;
    const alpha = rng.int(26, 62);
    const beta = 90 - alpha;

    return task(
      level,
      `Ein rechtwinkliges Dreieck ABC hat bei C einen rechten Winkel (γ = 90°) und die Hypotenusenlänge |AB| = ${diam} cm. Nach der Umkehrung des Thales-Satzes liegt C auf dem Kreis um den Mittelpunkt M von [AB]. Wie weit ist C genau von M entfernt?`,
      `Ein rechter Winkel mit Schenkeln durch A und B öffnet sich an einer Ecke C; dabei hat die Strecke [MC] zum Mittelpunkt M von [AB] die Länge ${r} cm, und bei A gilt α = ${alpha}°. Wie lang ist die gesamte Seite [AB] (Durchmesser), wie groß ist β, und wie lautet die Umkehrung des Satzes von Thales?`,
      [
        intField(level === 1 ? "Abstand |MC|" : "Hypotenusenlänge |AB|", level === 1 ? r : diam, [
          {
            value: level === 1 ? diam : r,
            hint: `M ist der Mittelpunkt des Durchmessers [AB]: Radius = ${r} cm und Durchmesser |AB| = 2 · ${r} = ${diam} cm!`,
          },
        ], "cm"),
        ...(level === 2 ? [intField("Winkel β bei B", beta, undefined, "°")] : []),
        choiceField(
          "Aussage und Beweisidee der Umkehrung",
          [
            "Jeder rechte Winkel γ = 90° bei C erzwingt, dass C auf dem Thaleskreis über [AB] liegt (|MC| = r)",
            "Jedes Dreieck über [AB] hat automatisch γ = 90°, auch wenn C weit außerhalb des Kreises liegt",
            "Der Satz des Thales gilt überhaupt nicht rückwärts",
          ],
          0,
        ),
      ],
      `Umkehrung des Thales-Satzes: Hat ein Dreieck ABC bei C einen 90°-Winkel, ist M (Mitte von [AB]) der Umkreismittelpunkt mit |MA| = |MB| = |MC|.`,
      level === 1
        ? `|MC| ist der Thaleskreisradius: |AB| : 2 = ${diam} : 2 = ${r} cm.`
        : `|AB| = 2 · |MC| = ${diam} cm; wegen γ = 90° folgt β = 90° ${MINUS} ${alpha}° = ${beta}°.`,
      `Ergebnis: <strong>${level === 1 ? r : diam} cm</strong>${level === 2 ? `, β = <strong>${beta}°</strong>` : ""} (Umkehrung sichert Lage auf dem Thaleskreis!).`,
      { r, diam, alpha, beta },
    );
  },
};

// ─── Generators 5.8 (Kreistangente konstruieren & begründen) ──────────────────

const exTangentAngles: ExerciseGenerator = {
  id: "tangente-winkel",
  make(rng, level) {
    const phiHalf = rng.int(18, 42); // angle at P between MP and tangent PB
    const central = 90 - phiHalf; // angle at M between MP and MB
    const fullSpread = 2 * phiHalf; // angle between both tangents at P

    return task(
      level,
      `Durch einen Punkt P außerhalb eines Kreises k(M; r) ist die Tangente PB an den Kreis gezeichnet (B ist der Berührpunkt). Wie groß ist der Winkel ∠MBP am Berührpunkt, und wie groß ist der Mittelpunktswinkel ∠BMP, wenn die Tangente mit [MP] bei P den Winkel ${phiHalf}° einschließt?`,
      `Von einem Punkt P außerhalb konstruierst du mithilfe des Thaleskreises über [MP] beide Tangenten PB₁ und PB₂ an k(M; r). Jede Tangente schließt mit der Verbindungsachse [MP] bei P denselben Winkel ${phiHalf}° ein. Bestimme den gesamten Öffnungswinkel ∠B₁PB₂ zwischen beiden Tangenten sowie den Mittelpunktswinkel ∠B₁MB₂ am Kreis!`,
      [
        intField(level === 1 ? "Berührwinkel ∠MBP" : "Öffnungswinkel ∠B₁PB₂ bei P", level === 1 ? 90 : fullSpread, undefined, "°"),
        intField(level === 1 ? "Winkel ∠BMP bei M" : "Mittelpunktswinkel ∠B₁MB₂", level === 1 ? central : 2 * central, [
          {
            value: level === 1 ? phiHalf : central,
            hint: `Im rechtwinkligen Dreieck MBP (90° bei B) ist ∠BMP = 90° ${MINUS} ${phiHalf}° = ${central}°; das Viereck MB₁PB₂ besteht aus zwei symmetrischen solchen Dreiecken!`,
          },
        ], "°"),
      ],
      `Im rechtwinkligen Dreieck MBP liegt der rechte Winkel immer am Berührpunkt B (∠MBP = 90°, nach dem Satz des Thales!).`,
      `In jedem Teildreieck MBᵢP ist ∠Bᵢ = 90° und ∠BMP = 90° ${MINUS} ${phiHalf}° = ${central}°.`,
      level === 1
        ? `∠MBP = <strong>90°</strong>, ∠BMP = <strong>${central}°</strong>.`
        : `Öffnungswinkel = 2 · ${phiHalf}° = <strong>${fullSpread}°</strong>, Mittelpunktswinkel = 2 · ${central}° = <strong>${2 * central}°</strong>.`,
      { phiHalf, central, fullSpread },
    );
  },
};

const exTangentProofSteps: ExerciseGenerator = {
  id: "tangente-thaleskreis",
  make(rng, level) {
    const pmHalf = rng.int(4, 9);
    const pm = 2 * pmHalf;

    return task(
      level,
      `Ein Punkt P liegt ${pm} cm vom Kreismittelpunkt M entfernt. Um die Tangenten an den Kreis k zu konstruieren, zeichnest du den Thaleskreis über die Strecke [MP]. Wie groß ist der Radius des Thaleskreises, und warum steht PB im Schnittpunkt B sicher senkrecht auf [MB]?`,
      `Ein Kreis um M hat Radius r = ${Math.max(2, pmHalf - 1)} cm, Punkt P liegt |MP| = ${pm} cm entfernt. Welchen Radius muss der Hilfs-Thaleskreis über [MP] haben, wie viele Schnittpunkte (= Tangenten) liefert er mit k, und auf welchem Satz beruht der rechte Winkel bei B?`,
      [
        intField("Radius des Thaleskreises", pmHalf, [
          { value: pm, hint: `Der Thaleskreis hat [MP] als DURCHMESSER – sein Radius um den Mittelpunkt H von [MP] ist |MP| : 2 = ${pmHalf} cm!` },
        ], "cm"),
        choiceField(
          "Begründung der Tangentenkonstruktion",
          [
            "Jeder Schnittpunkt B beider Kreise liegt auf k und auf dem Thaleskreis über [MP] → ∠MBP = 90° nach Thales → PB ⊥ Radius = Tangente",
            "Weil der Thaleskreis automatisch genau gleich groß ist wie der ursprüngliche Kreis k",
            "Weil die Mittelsenkrechte von [MP] durch alle möglichen Punkte B verläuft",
          ],
          0,
        ),
      ],
      `Radius des Thaleskreises über [MP] = |MP| : 2 (Mittelpunkt H von [MP] per Mittelsenkrechte konstruiert).`,
      `Radius = ${pm} : 2 = ${pmHalf} cm; an den zwei Schnittpunkten B₁, B₂ garantiert der Satz des Thales den 90°-Winkel zum Radius.`,
      `Thaleskreisradius = <strong>${pmHalf} cm</strong>. Wegen ∠MBP = 90° (Thales) steht PB senkrecht auf [MB] und berührt k als Tangente!`,
      { pm, pmHalf },
    );
  },
};

// ─── Generators 5.9 (Planfigur, Höhen & Konstruktionsberichte) ───────────────

const exHeightAuxTriangle: ExerciseGenerator = {
  id: "dreieck-hoehen",
  make(rng, level) {
    const alpha = rng.int(34, 68);
    let beta = rng.int(36, 70);
    if (alpha + beta === 90) beta += 3;
    const gamma1 = 90 - alpha;
    const gamma2 = 90 - beta;
    const c = rng.int(6, 12);
    const hc = rng.int(3, 7);

    return task(
      level,
      `In einer Planfigur zum Dreieck ABC (mit gegebener Grundseite c = ${c} cm, Höhe h_c = ${hc} cm und Winkel α = ${alpha}°) teilt die Höhe h_c = [CF] das spitzwinklige Dreieck in zwei rechtwinklige Teildreiecke bei F (∠AFC = 90°). Wie groß ist der linke Teilwinkel ∠ACF an der Spitze C?`,
      `In einem spitzwinkligen Dreieck ABC stehen beide Basiswinkel α = ${alpha}° und β = ${beta}° fest, und h_c steht senkrecht auf [AB] (Fußpunkt F). Berechne den gesamten Spitzenwinkel γ = ∠ACB sowie die Höhe-Abstandslinie (Parallele zu AB im Abstand ${hc} cm für eine Konstruktion aus c, b, h_c): Abstand in cm und γ.`,
      [
        intField(
          level === 1 ? "Teilwinkel ∠ACF in Teildreieck AFC" : "Gesamter Spitzenwinkel γ",
          level === 1 ? gamma1 : gamma1 + gamma2,
          [
            {
              value: level === 1 ? 180 - alpha : alpha + beta,
              hint: level === 1
                ? `Das Teildreieck AFC hat bei F einen 90°-Winkel, also ∠ACF = 180° ${MINUS} 90° ${MINUS} ${alpha}°!`
                : `Im gesamten Dreieck gilt γ = 180° ${MINUS} ${alpha}° ${MINUS} ${beta}° (auch gleich (90° ${MINUS} α) + (90° ${MINUS} β))!`,
            },
          ],
          "°",
        ),
        ...(level === 2
          ? [intField("Abstand der Höhen-Parallele zu AB", hc, undefined, "cm")]
          : [
              choiceField(
                "Erstes Konstruktions-Teildreieck bei gegebenem c, h_c, α",
                [
                  "Erst auf AB den Strahl unter α abtragen, gleichzeitig Parallele zu AB im Abstand h_c zeichnen → Schnittpunkt liefert C",
                  "Zuerst den Umkreis mit Radius c um C zeichnen",
                  "Man beginnt immer mit den drei Höhen ohne Seite",
                ],
                0,
              ),
            ]),
      ],
      `Die Höhe h_c bildet zu AB einen 90°-Winkel; alle Punkte mit Abstand h_c zu AB liegen auf einer Parallelen im Abstand h_c!`,
      level === 1
        ? `Im rechtwinkligen Hilfsdreieck AFC: ∠ACF = 90° ${MINUS} ${alpha}° = ${gamma1}°.`
        : `γ = 180° ${MINUS} ${alpha}° ${MINUS} ${beta}° = ${gamma1 + gamma2}°; alle Punkte mit Höhe ${hc} cm liegen im Abstand ${hc} cm parallel zu AB.`,
      level === 1
        ? `Teilwinkel ∠ACF = <strong>${gamma1}°</strong> (Planfigur zeigt das Hilfsdreieck AFC oder Parallelstreifen!).`
        : `<strong>γ = ${gamma1 + gamma2}°</strong>, Parallelenabstand = <strong>${hc} cm</strong>.`,
      { alpha, beta, gamma1, gamma2, c, hc },
    );
  },
};

const exConstructionDoc: ExerciseGenerator = {
  id: "konstruktionsbericht",
  make(rng, level) {
    const c = rng.int(6, 10);
    const hc = rng.int(3, 5);
    const a = hc + rng.int(1, 3); // strictly > hc so circle cuts parallel line!
    return task(
      level,
      `Aus gegebenem c = ${c} cm, a = ${a} cm und h_c = ${hc} cm willst du ein Dreieck ABC konstruieren. Nach Zeichnen der Strecke c = [AB] ziehst du im Abstand h_c = ${hc} cm eine Parallele p zu AB und schlägst einen Kreis um B mit Radius r = ${a} cm. Wie lang ist [AB], und warum schneidet der Kreis um B die Parallele p überhaupt?`,
      `Ordne einen lückenlosen Konstruktionsbericht für das Dreieck aus c = ${c} cm, h_c = ${hc} cm und Seitenhalbierender/Seite a = ${a} cm > ${hc} cm: Mit welchem Abstand verläuft p parallel zu [AB], wie viele Schnittpunkte ergeben sich im Regelfall (daher Planfigur / Zusatzangabe spitz- vs. stumpfwinklig prüfen!), und warum nennt man p eine geometrische Ortslinie?`,
      [
        intField(level === 1 ? "Streckenlänge |AB| = c" : "Abstand Parallele p zu [AB]", level === 1 ? c : hc, undefined, "cm"),
        choiceField(
          "Richtige Begründung im Konstruktionsbericht",
          level === 1
            ? [
                `Weil r = a = ${a} cm echt größer als der senkrechte Abstand h_c = ${hc} cm ist, schneidet k(B; a) die Parallele p in C`,
                "Ein Kreis um A mit Radius c bestimmt immer alle drei Winkel sofort",
                "Die Parallele darf einen beliebigen anderen Abstand als h_c haben",
              ]
            : [
                `p sammelt alle Punkte mit senkrechtem Abstand h_c = ${hc} cm zu AB; k(B; ${a} cm) schneidet p in bis zu 2 möglichen Ecken C (je nach Winkel spitz/stumpf)`,
                "Eine Planfigur ist erst nach der Konstruktion erlaubt",
                "Parallele Linien und Kreise schneiden sich grundsätzlich nie",
              ],
          0,
        ),
      ],
      `In einer Planfigur erkennst du zwei Ortslinien für C: (1) Abstand h_c von AB → Parallele p; (2) Abstand a von B → Kreis k(B; a).`,
      `Weil a = ${a} cm > h_c = ${hc} cm gilt, überbrückt der Radius den Abstand bis zur Parallelen p.`,
      `${level === 1 ? `|AB| = <strong>${c} cm</strong>` : `Abstand = <strong>${hc} cm</strong>`}: Im Konstruktionsbericht hältst du jede Ortslinie mit Schnittbedingung nachvollziehbar fest.`,
      { c, hc, a },
    );
  },
};

// ─── Generators 5.10 (Anwendungsaufgaben & Landvermessung) ────────────────────

const exScaleConstruction: ExerciseGenerator = {
  id: "vermessung-massstab",
  make(rng, level) {
    const scale = rng.pick([200, 500, 1000]);
    const metersPerCm = scale / 100; // 2 m, 5 m, or 10 m per cm!
    const basePlanCm = rng.int(5, 10);
    const baseRealM = basePlanCm * metersPerCm;
    const distPlanCm = roundTo(rng.int(6, 14) / 2, 1); // .0 or .5 cm!
    const distRealM = roundTo(distPlanCm * metersPerCm, 1);

    return task(
      level,
      `Zur Vermessung einer Flussbreite im Maßstab 1 : ${scale} (also 1 cm im Plan ≙ ${metersPerCm} m in Wirklichkeit) wählt man am Ufer eine Standlinie von ${baseRealM} m und peilt ein Baumziel am anderen Ufer an. Wie lang zeichnest du die Standlinie auf dem Papier in cm?`,
      `Ein Teich kann nicht direkt durchquert werden. Im Maßstab 1 : ${scale} (1 cm ≙ ${metersPerCm} m) misst du eine ufernahe Standlinie von ${baseRealM} m, konstruierst das Dreieck nach WSW maßstabsgetreu auf Papier und misst dort die gesuchte Teichbreite ${fmt(distPlanCm, 1)} cm ab. Wie lang ist die Standlinie im Plan (in cm) und wie breit ist der Teich in Wirklichkeit (in m)?`,
      [
        intField("Standlinie auf dem Papier", basePlanCm, [
          {
            value: baseRealM,
            hint: `Teile die echte Strecke (${baseRealM} m) durch ${metersPerCm} m pro cm, um die Zeichnungszentimeter zu erhalten!`,
          },
        ], "cm"),
        ...(level === 2
          ? [
              numberField("Wirkliche Teichbreite", distRealM, "m", 1, {
                absTolerance: 0.1,
                slips: [
                  {
                    value: distPlanCm,
                    hint: `Multipliziere die gemessenen ${fmt(distPlanCm, 1)} cm mit ${metersPerCm} m/cm zurück in die Wirklichkeit!`,
                  },
                ],
              }),
            ]
          : []),
      ],
      `1 cm in der Konstruktion entspricht ${metersPerCm} m in der Realität (Maßstab 1 : ${scale}).`,
      `Papierlänge = ${baseRealM} : ${metersPerCm} = ${basePlanCm} cm${level === 2 ? `; wirkliche Breite = ${fmt(distPlanCm, 1)} · ${metersPerCm} = ${fmt(distRealM, 1)} m` : ""}.`,
      `Planstandlinie: <strong>${basePlanCm} cm</strong>${level === 2 ? `; reale Breite: <strong>${fmtUnit(distRealM, "m", 1)}</strong>` : ""}.`,
      { scale, metersPerCm, basePlanCm, baseRealM, distPlanCm, distRealM },
    );
  },
};

const exSurveyCongruence: ExerciseGenerator = {
  id: "vermessung-kongruenz",
  make(rng, level) {
    const a1 = rng.int(40, 68);
    const a2 = rng.int(45, 72);
    const third = 180 - a1 - a2;
    const abDist = rng.int(35, 85);

    return task(
      level,
      `Ein Seilbahnmast C auf einer Bergspitze wird von zwei Talpunkten A und B aus angepeilt (Abstand |AB| = ${abDist} m, Peilwinkel α = ${a1}° und β = ${a2}°). Welcher Kongruenzsatz sichert, dass ein maßstabsgetreues Papierdreieck die Entfernung exakt wiedergibt, und wie groß ist der Winkel oben am Mast C?`,
      `Um die unzugängliche Entfernung |BC| quer über einen See zu finden, schlägst du auf der Wiese einen gemeinsamen Punkt P auf einer Verlängerung (SWS-Spiegelmethode mit Scheitelwinkeln!) oder peilst über die Winkel α = ${a1}° und β = ${a2}° an einer ${abDist} m langen Standlinie. Bestimme den Peilwinkel γ oben am Zielpunkt und bewerte die passende Modellierungs- und Kongruenzaussage.`,
      [
        intField("Zielwinkel γ", third, undefined, "°"),
        choiceField(
          "Kongruenzsatz & Modellierung",
          [
            "WSW (Seite |AB| und beide anliegenden Winkel α, β bestimmen das Dreieck eindeutig bis auf Maßstab)",
            "WWW (nur zwei Winkel genügen auch ganz ohne bekannte Standlinienlänge)",
            "Bei der Modellierung darf man niemals Peilwinkel messen",
          ],
          0,
        ),
      ],
      `Eine gemessene Standlinie |AB| und zwei gemessene Peilwinkel α, β bestimmen das Zieldreieck eindeutig nach WSW.`,
      `Winkelsumme im Zieldreieck: γ = 180° ${MINUS} ${a1}° ${MINUS} ${a2}° = ${third}°.`,
      `Zielwinkel γ = <strong>${third}°</strong> (eindeutig durch <strong>WSW</strong> und Maßstabsübertragung modelliert!).`,
      { a1, a2, third, abDist },
    );
  },
};

// ─── Stage 5 Lessons (10 Lektionen) ───────────────────────────────────────────

export const STAGE_5_LESSONS = makeLessons([
  {
    id: "ko-1-kongruenz",
    section: "5",
    title: "5.1 Kongruenz: Deckungsgleichheit anschaulich",
    subtitle: "Deckungsgleiche Figuren erkennen, Ecken zuordnen und von Flächengleichheit trennen",
    whyItMatters:
      "Serienproduktion, Baukästen und Spiegelungen basieren auf exakt form- und größengleichen Teilen – in der Mathematik heißt diese exakte Deckungsgleichheit Kongruenz.",
    explanationHtml: `
      <p>Zwei ebene Figuren <em>F</em> und <em>G</em> heißen <strong>kongruent</strong> (geschrieben <code>F ≅ G</code>), wenn sie <strong>deckungsgleich</strong> sind: Man kann <em>F</em> durch <strong>Verschieben, Drehen oder Spiegeln</strong> (also auch Umklappen!) lückenlos auf <em>G</em> legen.</p>
      <p><strong>Folge:</strong> Bei kongruenten Figuren stimmen <em>alle</em> einander entsprechenden Seitenlängen, <em>alle</em> einander entsprechenden Winkel sowie Umfang und Flächeninhalt überein.</p>
      <div class="example">
        <strong>Achtung – zwei häufige Verwechslungen:</strong><br>
        • Zwei Rechtecke <code>2 cm × 6 cm</code> und <code>3 cm × 4 cm</code> haben beide den Flächeninhalt <code>12 cm²</code>, sind aber <strong>nicht kongruent</strong> (sie lassen sich nicht aufeinanderlegen!).<br>
        • Zwei Dreiecke mit gleichen Winkeln (<code>40°, 60°, 80°</code>), aber doppelter Seitenlänge sind nur <em>ähnlich</em>, nicht kongruent!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Achte beim Symbol <code>△ABC ≅ △DEF</code> exakt auf die Reihenfolge der Ecken: <code>A ↔ D</code>, <code>B ↔ E</code>, <code>C ↔ F</code> – dann liegt auch <code>[BC]</code> genau auf <code>[EF]</code>!
      </div>
    `,
    formulas: [
      {
        name: "Kongruenz von Figuren",
        html: "F ≅ G &nbsp;⇔&nbsp; F und G sind deckungsgleich",
        quantities: "Übereinstimmung in allen entsprechenden Längen, Winkeln, Umfang und Fläche",
      },
    ],
    quiz: Q(
      "Es gilt △ABC ≅ △PRQ (Reihenfolge beachten!). Welche Seite im zweiten Dreieck ist garantiert genauso lang wie a = |BC|?",
      "|RQ|",
      "|PR|",
      "|PQ|",
      "In △ABC ≅ △PRQ entspricht B dem Punkt R und C dem Punkt Q. Daher gehört die Strecke [BC] exakt zur Strecke [RQ].",
    ),
    lab: labCongruenceMotion,
    exercises: [exCongruenceId, exCongruenceTest],
    celebrationMessage:
      "Glasklar erkannt! Kongruenz heißt exakte Deckungsgleichheit mit passender Eckenzuordnung.",
  },
  {
    id: "ko-2-sss-sws",
    section: "5",
    title: "5.2 Kongruenzsätze SSS & SWS + Dreiecksungleichung",
    subtitle: "Wann drei Seiten oder zwei Seiten mit Zwischenwinkel ein Dreieck festlegen",
    whyItMatters:
      "Mit Zirkel und Lineal baust du aus festen Bauteilen ein stabiles Fachwerk – die Dreiecksungleichung verrät dir vorher, wann Stäbe überhaupt bis zur Ecke reichen.",
    explanationHtml: `
      <p>Wann legen wenige Angaben die Form und Größe eines Dreiecks schon <em>eindeutig</em> (bis auf Kongruenz) fest? Die ersten beiden <strong>Kongruenzsätze</strong> lauten:</p>
      <ul>
        <li><strong>SSS (Seite–Seite–Seite):</strong> Alle drei Seiten <code>a, b, c</code> sind bekannt. Konstruierbar genau dann, wenn die <strong>Dreiecksungleichung</strong> gilt: Je zwei Seiten zusammen sind stets <em>echt länger</em> als die dritte (<code>a + b &gt; c</code>, <code>a + c &gt; b</code>, <code>b + c &gt; a</code>).</li>
        <li><strong>SWS (Seite–Winkel–Seite):</strong> Zwei Seiten und der von ihnen <strong>eingeschlossene Zwischenwinkel</strong> (mit <code>0° &lt; Winkel &lt; 180°</code>) sind bekannt – dann sind Start- und Endpunkte beider Seiten festgelegt, also auch die dritte Seite eindeutig!</li>
      </ul>
      <div class="example">
        <strong>Beispiel – Dreiecksungleichung testen:</strong><br>
        • <code>a = 4 cm, b = 5 cm, c = 8 cm</code>: <code>4 + 5 = 9 &gt; 8</code> ✓ (die beiden anderen Summen sind automatisch auch größer) → eindeutiges Dreieck nach SSS.<br>
        • <code>a = 4 cm, b = 5 cm, c = 9 cm</code>: <code>4 + 5 = 9</code> (nicht echt größer!) → C klapppt platt auf die Strecke [AB], <strong>kein Dreieck</strong>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Bei <strong>SWS</strong> muss der Winkel wirklich <em>zwischen</em> den beiden Seiten liegen (z. B. <code>b, c, α</code> oder <code>a, c, β</code>).
      </div>
    `,
    formulas: [
      {
        name: "Dreiecksungleichung (Bedingung für SSS)",
        html: "a + b &gt; c &nbsp;∧&nbsp; a + c &gt; b &nbsp;∧&nbsp; b + c &gt; a",
        quantities: "Kurztest: Summe der zwei kürzesten Seiten muss echt größer als die längste Seite sein",
      },
      {
        name: "Kongruenzsätze SSS und SWS",
        html: "SSS (a, b, c) &nbsp;|&nbsp; SWS (z. B. b, α, c)",
        quantities: "Legen das Dreieck bis auf Kongruenz eindeutig fest",
      },
    ],
    quiz: Q(
      "Für welche drei Seitenlängen lässt sich ein nicht ausgeartetes Dreieck nach SSS konstruieren?",
      "4 cm, 6 cm und 9 cm",
      "3 cm, 5 cm und 8 cm",
      "2 cm, 4 cm und 7 cm",
      "Nur bei 4 + 6 = 10 > 9 gilt die Dreiecksungleichung echt! Bei 3 + 5 = 8 und 2 + 4 = 6 < 7 schneiden sich die Kreise nicht zu einer Ecke C.",
    ),
    lab: labSssSws,
    exercises: [exSssTriangleIneq, exSwsRecognition],
    celebrationMessage:
      "Stabil konstruiert! Dreiecksungleichung, SSS und SWS wendest du zielsicher an.",
  },
  {
    id: "ko-3-wsw-ssw",
    section: "5",
    title: "5.3 Kongruenzsätze WSW/SWW und SsW",
    subtitle: "Winkellage prüfen und den gefährlichen Fall ssW (kleine Seite gegenüber) meistern",
    whyItMatters:
      "Fast alle konstruktiven Fehler passieren bei „zwei Seiten und ein Winkel“: Entweder man verwechselt SWS mit SsW, oder der Kreis schneidet den Strahl zweimal.",
    explanationHtml: `
      <p>Auch bei diesen Angaben gilt Eindeutigkeit – sofern die geometrische Bedingung stimmt:</p>
      <ul>
        <li><strong>WSW / SWW:</strong> Eine Seite und zwei Winkel (liegen beide an der Seite an: WSW; oder einer gegenüber: über <code>180° − α − β</code> den zweiten anliegenden Winkel berechnen → SWW!). Bedingung: <strong>Summe der beiden gegebenen Winkel &lt; 180°</strong>.</li>
        <li><strong>SsW (große Seite gegenüber!):</strong> Zwei Seiten und der Winkel, der der <strong>längeren</strong> der beiden gegebenen Seiten gegenüberliegt (z. B. <code>a, b, α</code> mit <code>a &gt; b</code>).</li>
      </ul>
      <div class="example">
        <strong>Warum heißt es genau „SsW“ (großes S vor kleinem s)?</strong><br>
        Liegt der gegebene Winkel α der <em>kürzeren</em> Seite gegenüber (<strong>ssW</strong>, also <code>a &lt; b</code>), kann der Zirkelkreis um C mit Radius <code>a</code> den freien Strahl ab A:<br>
        • gar nicht treffen (<strong>0 Dreiecke</strong>, wenn <code>a &lt; h_c</code>),<br>
        • genau berühren (<strong>1 rechtwinkliges Dreieck</strong> bei <code>a = h_c</code>) oder<br>
        • <strong>zweimal schneiden (2 nicht kongruente Dreiecke!)</strong> für <code>h_c &lt; a &lt; b</code>.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Bei zwei Seiten und einem nicht eingeschlossenen Winkel immer sofort fragen: Liegt der Winkel gegenüber der <em>längeren</em> gegebenen Seite (SsW → eindeutig!)? Wenn nein → Kreis schneidet eventuell 0-, 1- oder 2-mal!
      </div>
    `,
    formulas: [
      {
        name: "Bedingungen für WSW / SWW und SsW",
        html: "WSW/SWW: Winkel₁ + Winkel₂ &lt; 180° &nbsp;|&nbsp; SsW: a &gt; b (für gegebene a, b, α)",
        quantities: "Nur wenn diese Zusatzbedingungen stimmen, entsteht genau 1 Dreieck",
      },
    ],
    quiz: Q(
      "Gegeben sind a = 5 cm, b = 7 cm und α = 40°. Greift hier sicher ein Kongruenzsatz?",
      "Nein: α liegt der kürzeren Seite a < b gegenüber (ssW) – der Kreis um C kann den Strahl zweimal schneiden",
      "Ja, das ist eindeutig der Satz SWS",
      "Ja, weil 5 + 7 > 40",
      "α liegt gegenüber a = 5 cm, während b = 7 cm länger ist (ssW). Deshalb liegt hier kein gültiges SsW vor – es entstehen 2 verschiedene Dreiecke!",
    ),
    lab: labWswSsw,
    exercises: [exWswThirdAngle, exSswCases],
    celebrationMessage:
      "Messerscharf! WSW, SWW, SsW und das mehrdeutige ssW hältst du nun jederzeit sicher auseinander.",
  },
  {
    id: "ko-4-gleichschenklig",
    section: "5",
    title: "5.4 Gleichschenklige & gleichseitige Dreiecke",
    subtitle: "Basiswinkelsatz, Symmetrieachse und besondere Konstruktionen nutzen",
    whyItMatters:
      "Giebelfelder, Fachwerke und Zeltformen sind symmetrische Dreiecke – schon zwei Angaben (Basis + ein Winkel oder Basis + Schenkel) genügen komplett.",
    explanationHtml: `
      <p>Symmetrische Dreiecke haben zusätzliche Gratis-Eigenschaften, die beim Konstruieren sofort weitere Stücke verraten:</p>
      <ul>
        <li><strong>Gleichschenkliges Dreieck:</strong> Zwei Seiten (Schenkel, z. B. <code>a = b</code>) sind gleich lang. Die Symmetrieachse durch die Spitze C ist gleichzeitig <strong>Höhe auf c</strong>, <strong>Mittelsenkrechte von [AB]</strong> und <strong>Winkelhalbierende w<sub>γ</sub></strong>. Beide <strong>Basiswinkel</strong> sind gleich groß (<code>α = β</code>).</li>
        <li><strong>Gleichseitiges Dreieck:</strong> Alle drei Seiten sind gleich lang (<code>a = b = c</code>), es hat 3 Symmetrieachsen und alle drei Innenwinkel messen exakt <strong>60°</strong>.</li>
      </ul>
      <div class="example">
        <strong>Beispiel – Konstruktion eines gleichschenkligen Dreiecks (Basis c = 6 cm, Basiswinkel 50°):</strong><br>
        1. Strecke <code>[AB]</code> mit <code>6 cm</code> zeichnen.<br>
        2. Weil das Dreieck gleichschenklig über Basis c ist, gilt automatisch <code>α = β = 50°</code>.<br>
        3. Beide 50°-Winkel in A und B antragen → nach <strong>WSW</strong> eindeutig konstruiert!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Im gleichschenkligen Dreieck muss man genau prüfen, ob ein gegebener Winkel an der <strong>Basis</strong> liegt (kommt zweimal vor!) oder an der <strong>Spitze</strong>!
      </div>
    `,
    formulas: [
      {
        name: "Winkel im gleichschenkligen Dreieck (Basis c)",
        html: "α = β &nbsp;und&nbsp; 2α + γ = 180°",
        quantities: "γ Spitzenwinkel zwischen den beiden gleich langen Schenkeln a = b",
      },
      {
        name: "Gleichseitiges Dreieck",
        html: "a = b = c &nbsp;⇒&nbsp; α = β = γ = 60°",
        quantities: "Besitzt drei Symmetrieachsen; Konstruktion über zwei Kreise mit Radius a",
      },
    ],
    quiz: Q(
      "In einem gleichschenkligen Dreieck beträgt der Spitzenwinkel γ = 44°. Wie groß ist jeder der beiden Basiswinkel?",
      "68°",
      "44°",
      "136°",
      "Die beiden gleichen Basiswinkel teilen sich den Rest zu 180°: (180° − 44°) : 2 = 136° : 2 = 68°.",
    ),
    lab: labIsosceles,
    exercises: [exIsoscelesAngles, exIsoscelesConstruct],
    celebrationMessage:
      "Stark konstruiert! Symmetrieachse und Basiswinkelsatz nutzt du jetzt geschickt als Konstruktionshelfer.",
  },
  {
    id: "ko-5-kehrsatz",
    section: "5",
    title: "5.5 Satz, Kehrsatz und Gegenbeispiel",
    subtitle: "Voraussetzung und Behauptung tauschen und Umkehrungen logisch testen",
    whyItMatters:
      "Einer der größten logischen Fehlschlüsse lautet: „Wenn A zu B führt, muss B auch zu A führen!“ Hier lernst du, Sätze und ihre Kehrsätze sauber zu prüfen.",
    explanationHtml: `
      <p>Jeder mathematische „Wenn–dann“-Satz besteht aus einer <strong>Voraussetzung</strong> (hinter <em>Wenn</em>) und einer <strong>Behauptung</strong> (hinter <em>dann</em>). Vertauschst du beide Teile, entsteht der <strong>Kehrsatz</strong> (die <em>Umkehrung</em>):</p>
      <ul>
        <li><strong>Satz:</strong> Wenn <em>Voraussetzung</em>, dann <em>Behauptung</em>.</li>
        <li><strong>Kehrsatz:</strong> Wenn <em>Behauptung</em>, dann <em>Voraussetzung</em>.</li>
      </ul>
      <p><strong>Wichtig:</strong> Aus einem wahren Satz folgt <em>nicht automatisch</em>, dass auch sein Kehrsatz wahr ist! Reicht schon <strong>ein einziges Gegenbeispiel</strong>, bei dem zwar die neue Voraussetzung stimmt, die neue Behauptung aber verletzt ist, so ist der Kehrsatz <strong>falsch</strong>.</p>
      <div class="example">
        <strong>Alltags- vs. Mathebeispiel:</strong><br>
        • <em>Alltag:</em> „Wenn ich in München stehe, dann bin ich in Bayern.“ (Wahr!)<br>
        &nbsp;&nbsp;<em>Kehrsatz:</em> „Wenn ich in Bayern bin, stehe ich in München.“ (Falsch! Gegenbeispiel: Nürnberg oder Regensburg.)<br>
        • <em>Geometrie:</em> „Jedes Quadrat hat vier 90°-Winkel.“ (Wahr!) → Kehrsatz: „Jedes Viereck mit vier 90°-Winkeln ist ein Quadrat.“ (Falsch! Gegenbeispiel: Rechteck <code>3 cm × 5 cm</code>.)<br>
        • <em>Gegenfall:</em> „Gleichschenklig ⇔ zwei Basiswinkel gleich“ – hier sind sogar beide Richtungen wahr!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Satz und Kehrsatz sind zwei verschiedene Aussagen. Prüfe den Kehrsatz stets eigenständig – entweder beweisen oder mit einem einzigen Gegenbeispiel widerlegen!
      </div>
    `,
    formulas: [
      {
        name: "Satz und Kehrsatz (Implikation vs. Umkehrung)",
        html: "Satz: V ⇒ B &nbsp;|&nbsp; Kehrsatz: B ⇒ V",
        quantities: "V Voraussetzung, B Behauptung; ein wahrer Satz garantieren keinen wahren Kehrsatz",
      },
    ],
    quiz: Q(
      "Der Satz „Wenn eine Zahl durch 4 teilbar ist, dann ist sie gerade“ ist wahr. Was gilt für seinen Kehrsatz?",
      "Der Kehrsatz „Wenn eine Zahl gerade ist, dann ist sie durch 4 teilbar“ ist falsch (Gegenbeispiel: 6)",
      "Der Kehrsatz muss ebenfalls wahr sein, weil die Hinrichtung wahr ist",
      "Der Kehrsatz lautet: „Wenn eine Zahl nicht durch 4 teilbar ist, ist sie ungerade“",
      "Beim Kehrsatz tauscht man Voraussetzung und Behauptung. Für 6 gilt die neue Voraussetzung (gerade), aber nicht die Behauptung (6 nicht durch 4 teilbar)!",
    ),
    lab: labConverseChecker,
    exercises: [exPremiseConverse, exCounterexampleLogic],
    celebrationMessage:
      "Logisch messerscharf! Du trennst Satz und Kehrsatz und widerlegst falsche Umkehrungen präzise.",
  },
  {
    id: "ko-6-umkreis-inkreis",
    section: "5",
    title: "5.6 Umkreis und Inkreis mit DGS entdecken",
    subtitle: "Die Mittelpunkte über Mittelsenkrechten und Winkelhalbierende finden und erforschen",
    whyItMatters:
      "Mit einer dynamischen Geometriesoftware (DGS) ziehst du Ecken eines Dreiecks frei umher und entdeckst sofort Muster – etwa wann der Umkreismittelpunkt das Dreieck verlässt!",
    explanationHtml: `
      <p>Bewegt man ein Dreieck ABC interaktiv in einer <strong>dynamischen Geometriesoftware (DGS)</strong>, treten zwei faszinierende Kreise zutage:</p>
      <ul>
        <li><strong>Umkreis (Mittelpunkt M<sub>U</sub>):</strong> Alle drei <strong>Mittelsenkrechten</strong> der Seiten schneiden sich genau in einem Punkt <code>M<sub>U</sub></code>. Da er auf jeder Mittelsenkrechten liegt, hat er denselben Abstand <code>R</code> zu allen drei <strong>Ecken</strong> (<code>|M<sub>U</sub>A| = |M<sub>U</sub>B| = |M<sub>U</sub>C|</code>).</li>
        <li><strong>Inkreis (Mittelpunkt M<sub>I</sub>):</strong> Alle drei <strong>Winkelhalbierenden</strong> schneiden sich in einem Punkt <code>M<sub>I</sub></code>. Er hat zu allen drei <strong>Seiten</strong> denselben senkrechten Abstand <code>ρ</code> (Berührkreis von innen).</li>
      </ul>
      <div class="example">
        <strong>DGS-Entdeckung zur Lage der Mittelpunkte:</strong><br>
        • <code>M<sub>I</sub></code> liegt ausnahmslos <strong>immer im Inneren</strong> jedes Dreiecks.<br>
        • <code>M<sub>U</sub></code> wandert beim Ziehen der Ecke C:<br>
        &nbsp;&nbsp;– <em>spitzwinklig</em> → <code>M<sub>U</sub></code> <strong>innen</strong>;<br>
        &nbsp;&nbsp;– <em>rechtwinklig</em> → <code>M<sub>U</sub></code> liegt exakt auf der <strong>Mitte der Hypotenuse</strong> (Thales!);<br>
        &nbsp;&nbsp;– <em>stumpfwinklig</em> → <code>M<sub>U</sub></code> wandert <strong>nach außerhalb</strong>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> <strong>Um</strong>kreis = Mittel<strong>senkrechten</strong> (durch die <em>Ecken</em>). <strong>In</strong>kreis = <strong>Winkel</strong>halbierende (berührt die <em>Seiten</em> innen).
      </div>
    `,
    formulas: [
      {
        name: "Umkreis & Inkreis",
        html: "M<sub>U</sub> = Schnitt der Mittelsenkrechten · M<sub>I</sub> = Schnitt der Winkelhalbierenden",
        quantities: "R = Abstand von M_U zu allen 3 Ecken; ρ = Lotabstand von M_I zu allen 3 Seiten",
      },
    ],
    quiz: Q(
      "Beim Ziehen in einer DGS bemerkst du, dass der Umkreismittelpunkt M_U weit außerhalb des Dreiecks liegt. Was muss für dieses Dreieck gelten?",
      "Es ist stumpfwinklig (ein Innenwinkel ist größer als 90°)",
      "Es ist gleichseitig",
      "Es hat drei Winkel unter 60°",
      "Nur bei stumpfwinkligen Dreiecken verlässt M_U das Innere (bei 90° sitzt er exakt auf der längsten Seite).",
    ),
    lab: labCircumInCircle,
    exercises: [exCircumVsIncircle, exCirclePointTest],
    celebrationMessage:
      "Entdeckung geglückt! Umkreis- und Inkreis-Eigenschaften beherrschst du inklusive der DGS-Sonderfälle.",
  },
  {
    id: "ko-7-thales",
    section: "5",
    title: "5.7 Satz des Thales & Umkehrung beweisen",
    subtitle: "Den rechten Winkel über gleichschenklige Teildreiecke beweisen und umkehren",
    whyItMatters:
      "Der über 2500 Jahre alte Satz des Thales ist das schönste Zusammenspiel aus Winkelbetrachtung, Symmetrie und Kreis – und liefert dir sofort die Tangentenkonstruktion.",
    explanationHtml: `
      <p><strong>Satz des Thales:</strong> Konstruierst du über einer Strecke <code>[AB]</code> den Halbkreis (Mittelpunkt <em>M</em>, Durchmesser <code>[AB]</code>) – den sogenannten <strong>Thaleskreis</strong> – und wählst darauf einen beliebigen Punkt <em>C</em> (≠ A, B), so hat das Dreieck ABC bei <em>C</em> stets einen <strong>rechten Winkel (γ = 90°)</strong>!</p>
      <p><strong>Der Beweis (mit Hilfsstrecke [MC]):</strong></p>
      <ol>
        <li>Da A, B, C auf demselben Kreis um M liegen, gilt <code>|MA| = |MB| = |MC| = r</code>.</li>
        <li>Also sind <code>△AMC</code> und <code>△MBC</code> beide <strong>gleichschenklige Dreiecke</strong> mit den gleichen Basiswinkeln <code>α</code> (bei A und C) bzw. <code>β</code> (bei B und C).</li>
        <li>Damit zerfällt der Winkel bei C in <code>γ = α + β</code>.</li>
        <li>Aus der Dreieckswinkelsumme folgt: <code>α + (α + β) + β = 180°</code> → <code>2(α + β) = 180°</code> → <code>γ = α + β = 90°</code>!</li>
      </ol>
      <div class="example">
        <strong>Die Umkehrung gilt auch!</strong><br>
        Ist umgekehrt bei einem Dreieck ABC bekannt, dass <code>γ = 90°</code> misst, so liegt C garantiert auf dem Thaleskreis über der Hypotenuse <code>[AB]</code> (Begründung: Spiegelt man das Dreieck durch Punktspiegelung am Hypotenusenmittelpunkt M, entsteht ein Rechteck – seine Diagonalen sind gleich lang und halbieren sich, also <code>|MC| = |MA| = |MB|</code>!).
      </div>
      <div class="merke">
        <strong>Merke:</strong> Satz des Thales <em>und</em> seine Umkehrung sind wahr: <code>C ∈ Thaleskreis(AB) ⇔ ∠ACB = 90°</code>!
      </div>
    `,
    formulas: [
      {
        name: "Satz des Thales (inkl. Umkehrung)",
        html: "C auf Thaleskreis über [AB] &nbsp;⇔&nbsp; γ = ∠ACB = 90°",
        quantities: "M = Mittelpunkt von [AB], es gilt |MA| = |MB| = |MC| = r",
      },
    ],
    quiz: Q(
      "Warum teilt die Hilfsstrecke [MC] zum Thaleskreis-Mittelpunkt M das Dreieck ABC beim Beweis in zwei gleichschenklige Dreiecke?",
      "Weil A, B und C denselben Abstand r zu M haben (|MA| = |MB| = |MC| = r)",
      "Weil [MC] immer senkrecht auf [AB] steht",
      "Weil jede Strecke zum Kreisrand den Winkel bei C halbiert",
      "Als Radien desselben Kreises sind [MA], [MB] und [MC] alle gleich lang (= r); damit entstehen die gleichschenkligen Dreiecke AMC und MBC!",
    ),
    lab: labThales,
    exercises: [exThalesAngles, exThalesProofConverse],
    celebrationMessage:
      "Thales gemeistert! Sowohl der Winkelbeweis als auch die Umkehrung für rechtwinklige Dreiecke sitzen.",
  },
  {
    id: "ko-8-tangente",
    section: "5",
    title: "5.8 Kreistangenten mit Thales konstruieren",
    subtitle: "Die Berührpunkte von außen konstruieren und die Rechtwinkligkeit begründen",
    whyItMatters:
      "Eine Tangente „schmiegt“ sich genau senkrecht zum Radius an einen Kreis – ohne Thaleskreis könntest du den exakten Berührpunkt von außen nur raten!",
    explanationHtml: `
      <p>Eine Gerade <em>t</em> berührt einen Kreis <code>k(M; r)</code> genau dann als <strong>Tangente</strong> im Berührpunkt <em>B</em>, wenn sie dort <strong>senkrecht auf dem Radius [MB] steht</strong> (<code>∠MBP = 90°</code>).</p>
      <p><strong>Konstruktion der Tangenten von einem Punkt P außerhalb des Kreises:</strong></p>
      <ol>
        <li>Verbinde <em>M</em> mit <em>P</em> und konstruiere den Mittelpunkt <em>H</em> von <code>[MP]</code> (Mittelsenkrechte).</li>
        <li>Schlage den <strong>Thaleskreis</strong> über dem Durchmesser <code>[MP]</code> (um <em>H</em> mit Radius <code>|MP| : 2</code>).</li>
        <li>Er schneidet <em>k</em> in den beiden Punkten <strong>B₁</strong> und <strong>B₂</strong>.</li>
        <li>Ziehe die Geraden <code>PB₁</code> und <code>PB₂</code> – das sind die beiden gesuchten Tangenten!</li>
      </ol>
      <div class="example">
        <strong>Warum funktioniert das exakt? (Begründung!)</strong><br>
        Jeder Schnittpunkt <em>Bᵢ</em> liegt gleichzeitig auf <em>k</em> und auf dem Thaleskreis über <code>[MP]</code>. Nach dem <strong>Satz des Thales</strong> gilt daher zwangsläufig <code>∠MBᵢP = 90°</code>.<br>
        Eine Gerade durch einen Kreispunkt <em>Bᵢ</em>, die auf dem Radius <code>[MBᵢ]</code> senkrecht steht, ist per Definition eine <strong>Tangente</strong> an <em>k</em>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Tangente von außen = Thaleskreis über <code>[MP]</code> mit <code>k</code> schneiden. Von außerhalb gibt es stets <strong>zwei</strong> zur Achse <code>MP</code> symmetrische Tangenten!
      </div>
    `,
    formulas: [
      {
        name: "Tangenteneigenschaft & Konstruktionsidee",
        html: "PBᵢ ⊥ MBᵢ (90°) &nbsp;durch Schnitt von k(M; r) mit Thaleskreis über [MP]",
        quantities: "Die Strecke [MP] dient als Durchmesser des Hilfs-Thaleskreises",
      },
    ],
    quiz: Q(
      "Welcher Kreis wird bei der Tangentenkonstruktion von Punkt P außerhalb an den Kreis k(M; r) zusätzlich geschlagen?",
      "Der Thaleskreis mit Durchmesser [MP] (um die Mitte H von [MP])",
      "Ein Kreis um P mit Radius |MP|",
      "Ein Kreis um M mit doppeltem Radius 2r",
      "Der Thaleskreis über [MP] schneidet k in B₁ und B₂, wo nach dem Satz des Thales sofort ∠MBᵢP = 90° entsteht.",
    ),
    lab: labTangentThales,
    exercises: [exTangentAngles, exTangentProofSteps],
    celebrationMessage:
      "Ausgezeichnet begründet! Du konstruierst beide Kreistangenten sauber über den Satz des Thales.",
  },
  {
    id: "ko-9-hoehen",
    section: "5",
    title: "5.9 Planfigur, Höhen & Konstruktionsberichte",
    subtitle: "Mit Planfiguren Lösungswege mit Höhen entwickeln und schrittweise dokumentieren",
    whyItMatters:
      "Sobald neben Seiten auch eine Höhe h_c gegeben ist, hilft kein Ausprobieren mehr – erst eine farbige Planfigur verrät dir das passende Hilfsdreieck oder die Parallele.",
    explanationHtml: `
      <p>Bei anspruchsvollen Dreieckskonstruktionen mit <strong>Höhen</strong> (z. B. <code>c, h<sub>c</sub>, α</code> oder <code>c, a, h<sub>c</sub></code>) folgt deine Arbeit immer zwei festen Werkzeugen:</p>
      <ol>
        <li><strong>Planfigur:</strong> Skizziere ein allgemeines Dreieck ABC, trage die gegebene Höhe als Lot ein (rechter Winkel!) und hebe alle bekannten Stücke farbig hervor.</li>
        <li><strong>Hilfsidee ablesen:</strong> Alle Punkte im senkrechten Abstand <code>h<sub>c</sub></code> zur Grundseite <code>c = [AB]</code> liegen auf der <strong>Parallelen p</strong> im Abstand <code>h<sub>c</sub></code> – oder du konstruierst zuerst ein <strong>rechtwinkliges Teildreieck</strong> (z. B. <code>△FBC</code> aus <code>a, h<sub>c</sub>, 90°</code>)!</li>
      </ol>
      <div class="example">
        <strong>Beispiel – Konstruktionsbeschreibung für c, h<sub>c</sub>, a (mit a &gt; h<sub>c</sub>):</strong><br>
        1. Strecke <code>c = [AB]</code> zeichnen.<br>
        2. Zu <code>AB</code> eine Parallele <em>p</em> im Abstand <code>h<sub>c</sub></code> konstruieren (alle möglichen Lagen für C).<br>
        3. Kreis um <em>B</em> mit Radius <em>a</em> schneidet <em>p</em> (i. Allg. in bis zu zwei Punkten <em>C₁, C₂</em>; Planfigur/Zusatzangabe entscheidet!).<br>
        4. Ecken <em>A, B, C</em> verbinden.
      </div>
      <div class="merke">
        <strong>Merke:</strong> Eine saubere <strong>Konstruktionsbeschreibung</strong> hält jeden Punkt eindeutig durch den Schnitt zweier geometrischer Linien (Gerade, Strahl, Parallele, Kreis) fest.
      </div>
    `,
    formulas: [
      {
        name: "Ortslinie der Höhe h_c",
        html: "C liegt auf Parallelen zu AB im Abstand h<sub>c</sub>",
        quantities: "Bei stumpfen Winkeln fällt der Höhenfußpunkt auf die Verlängerung der Grundseite",
      },
    ],
    quiz: Q(
      "Du sollst ein spitzwinkliges Dreieck ABC aus c = 7 cm, a = 5 cm und Höhe h_c = 4 cm konstruieren. Wozu zeichnet man eine Parallele p im Abstand 4 cm zu [AB]?",
      "Jeder Punkt mit senkrechtem Abstand h_c = 4 cm zur Grundlinie AB liegt genau auf dieser Parallelen p",
      "Weil die Höhe h_c immer parallel zur Seite [AB] verläuft",
      "Weil der Umkreismittelpunkt auf der Parallelen p liegt",
      "Die Höhe h_c ist der senkrechte Abstand der Ecke C von AB; genau alle Punkte mit Abstand 4 cm zu AB bilden die Parallele p.",
    ),
    lab: labHeightConstruction,
    exercises: [exHeightAuxTriangle, exConstructionDoc],
    celebrationMessage:
      "Strukturiert gedacht! Mit Planfigur, Höhenparallelen und klarem Bericht löst du jede Dreieckskonstruktion.",
  },
  {
    id: "ko-10-modellieren",
    section: "5",
    title: "5.10 Anwendungsaufgaben mit Dreiecken modellieren",
    subtitle: "Unzugängliche Entfernungen vermessen, maßstabsgerecht zeichnen und prüfen",
    whyItMatters:
      "Wie bestimmt man die Breite eines Flusses oder die Höhe eines Turms, ohne hinüberzuschwimmen? Mit Standlinie, Peilwinkeln und kongruenten Dreiecken!",
    explanationHtml: `
      <p>Bei Geländevermessungen (See, Fluss, Bergspitze) lässt sich die gesuchte Strecke nicht direkt mit dem Maßband ablaufen. Dann hilft <strong>geometrisches Modellieren</strong> in vier Schritten:</p>
      <ol>
        <li><strong>Skizze / Planfigur:</strong> Gelände in Punkte und Dreiecke übersetzen (z. B. begehbare Standlinie <code>[AB]</code> am Ufer + Zielpunkt <em>C</em> am anderen Ufer).</li>
        <li><strong>Messbare Stücke wählen:</strong> Standlinie <code>|AB|</code> und beide Peilwinkel <code>α</code> und <code>β</code> messen → nach <strong>WSW</strong> eindeutig festgelegt!</li>
        <li><strong>Maßstabsgetreu konstruieren:</strong> Z. B. Maßstab <code>1 : 1000</code> (<code>1 cm ≙ 10 m</code>), Strecke in cm abmessen und mit dem Maßstab zurückrechnen.</li>
        <li><strong>Genauigkeit bewerten:</strong> Kleine Zeichen- oder Winkelfehler vergrößern sich um den Maßstabsfaktor!</li>
      </ol>
      <div class="example">
        <strong>Beispiel – Teichbreite über Maßstab 1 : 500:</strong><br>
        Im Maßstab <code>1 : 500</code> entspricht <code>1 cm</code> im Heft genau <code>500 cm = 5 m</code> in der Natur.<br>
        Standlinie <code>35 m</code> → im Heft <code>35 : 5 = 7 cm</code>. Nach Konstruktion mit den gemessenen Peilwinkeln misst du bis <em>C</em> genau <code>6,4 cm</code>.<br>
        Reale Breite: <code>6,4 · 5 m = 32 m</code>!
      </div>
      <div class="merke">
        <strong>Merke:</strong> Kongruenzsätze garantieren erst, dass das verkleinerte Zieldreieck auf dem Papier exakt die wahren Verhältnisse des Geländes abbildet!
      </div>
    `,
    formulas: [
      {
        name: "Umrechnung im Maßstab 1 : M",
        html: "Naturmaß = Kartenmaß · M &nbsp;|&nbsp; Kartenmaß = Naturmaß : M",
        quantities: "Typische Umrechnung: 1 : 1000 bedeutet 1 cm ≙ 10 m, 1 : 500 bedeutet 1 cm ≙ 5 m",
      },
    ],
    quiz: Q(
      "Im Maßstab 1 : 2000 (1 cm ≙ 20 m) wird ein Flussdreieck konstruiert. Die Entfernung auf dem Papier beträgt 4,5 cm. Wie breit ist der Fluss in Wirklichkeit?",
      "90 m",
      "9 m",
      "45 m",
      "1 cm entspricht 2000 cm = 20 m. Also entsprechen 4,5 cm genau 4,5 · 20 m = 90 m.",
    ),
    lab: labSurveyModeling,
    exercises: [exScaleConstruction, exSurveyCongruence],
    celebrationMessage:
      "Herzlichen Glückwunsch! Alle fünf Lernbereiche von Mathematik 7 Gymnasium sind vollständig gemeistert!",
  },
]);
