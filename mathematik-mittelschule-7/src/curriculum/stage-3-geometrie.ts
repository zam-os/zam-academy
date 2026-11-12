import { fmt, frac } from "../exercises/format";
import { choiceField, near, numberField } from "./helpers";
import {
  BOTH,
  choice,
  lab,
  makeLesson,
  makeStage,
  output,
  range,
  task,
} from "./builders";

const LB = [3, 3] as [number, number];

export const STAGE_GEOMETRIE = makeStage(
  3,
  "Geometrie & Prismen",
  "Mittelsenkrechte, Winkelhalbierende, Maßstab, Dreiecke (sss/sws/wsw), Winkelsumme und Prismennetze",
  "#7c3aed",
  "📐",
  LB,
  [
    makeLesson(3, 1, LB, {
      id: "ge-1-senkrechte-abstand",
      title: "Mittelsenkrechte, Senkrechte & Abstände",
      subtitle: "Senkrechte Konstruktionen zur Abstands- und Lagebestimmung",
      tracks: BOTH,
      whyItMatters:
        "Wo verläuft die Grenze genau in der Mitte zwischen zwei Häusern? Und wie misst man den kürzesten Abstand zu einer Straße? Genau dafür brauchst du Mittelsenkrechte und Lot.",
      explanationHtml: `
        <p>Die <strong>Mittelsenkrechte m<sub>AB</sub></strong> halbiert die Strecke [AB] und steht im 90°-Winkel auf ihr. Jeder Punkt auf m<sub>AB</sub> ist von A und B gleich weit entfernt.</p>
        <p>Der <strong>Abstand</strong> eines Punktes P zu einer Geraden g ist immer die kürzeste Strecke — also die <strong>Senkrechte (das Lot)</strong> von P auf g.</p>
        <div class="example">
          <strong>Beispiel (Konstruktion mit dem Zirkel):</strong><br>
          Schlage um A und B Kreise mit gleichem Radius (r &gt; halbe Strecke AB). Die Gerade durch beide Schnittpunkte ist die Mittelsenkrechte.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Abstand heißt immer: <strong>senkrecht (90°)</strong> zur Geraden messen! Jeder Punkt auf der Mittelsenkrechten hat zu A und B denselben Abstand.
        </div>
      `,
      formulas: [
        {
          name: "Mittelsenkrechte & Abstand",
          html: `P ∈ m<sub>AB</sub> ⇔ |PA| = |PB|  &nbsp;·&nbsp;  d(P; g) = |PF| (PF ⊥ g)`,
          quantities: "F Lotfußpunkt von P auf g",
        },
      ],
      quiz: {
        question: "Welche Eigenschaft hat jeder Punkt P auf der Mittelsenkrechten der Strecke [AB]?",
        options: [
          "Er ist von A und B gleich weit entfernt.",
          "Er bildet mit A und B immer ein rechtwinkliges Dreieck.",
          "Er hat immer den Abstand 0 zu A.",
        ],
        correctIndex: 0,
        explanation:
          "Die Mittelsenkrechte ist die Symmetrieachse der Strecke [AB]: jeder ihrer Punkte hat exakt denselben Abstand zu A und zu B.",
      },
      lab: lab(
        "perp-bisector",
        "Mittelsenkrechte & Lotabstand",
        "Ziehe Punkt P im Koordinatensystem und vergleiche seinen Abstand zur Geraden AB sowie zur Mittelsenkrechten.",
        [
          range("px", "Punkt P (x)", -5, 5, 2, 0.5),
          range("py", "Punkt P (y)", 1, 6, 4, 0.5),
        ],
        [
          output("distLine", "Abstand zu AB", (v) => v.py, "cm", 1, true),
          output("distM", "Abstand zur Mittelsenkrechten", (v) => Math.abs(v.px), "cm", 1),
        ],
        [
          {
            id: "on-bisector",
            text: "Ziehe Punkt P genau auf die Mittelsenkrechte (bei Abstand zu AB = 5 cm).",
            check: (v) => Math.abs(v.px) < 0.01 && v.py === 5,
          },
          {
            id: "dist-2",
            text: "Bringe P auf genau 2 cm Abstand zur Geraden AB (bei x = −3).",
            check: (v) => v.py === 2 && v.px === -3,
          },
          {
            id: "symmetric-p",
            text: "Stelle x = +4 und Abstand 3,5 cm ein.",
            check: (v) => v.px === 4 && v.py === 3.5,
          },
        ],
      ),
      exercises: [
        {
          id: "midpoint-coord",
          make(rng, level) {
            const ax = rng.int(-6, 0);
            const len = rng.pick([4, 6, 8, 10]);
            const bx = ax + len;
            const mx = (ax + bx) / 2;
            return task(
              level,
              `Die Strecke [AB] liegt auf der x-Achse mit A(${fmt(ax)}|0) und B(${fmt(bx)}|0). Bei welchem x-Wert schneidet die Mittelsenkrechte die x-Achse?`,
              `Zwei Laternen stehen auf einer geraden Straße an den Positionen ${fmt(ax)} m und ${fmt(bx)} m. Ein Baum soll genau mittig auf der Mittelsenkrechten gepflanzt werden. Bei welcher Meter-Marke steht er?`,
              [numberField("xₘ =", mx, "m", 1)],
              "Der Mittelpunkt liegt genau in der Mitte: (x_A + x_B) : 2.",
              [
                `xₘ = (${fmt(ax)} + ${bx < 0 ? `(${fmt(bx)})` : fmt(bx)}) : 2`,
                `<strong>${fmt(mx, 1)}</strong>`,
              ],
              { ax, bx, mx },
            );
          },
        },
        {
          id: "perp-distance-check",
          make(rng, level) {
            const px = rng.int(-4, 4);
            const py = rng.stepped(1.5, 6.5, 0.5);
            return task(
              level,
              `P(${fmt(px)}|${fmt(py)}) liegt über der x-Achse (g). Gib den kürzesten Abstand von P zur Geraden g an.`,
              `Ein Wanderer steht am Punkt P(${fmt(px)}|${fmt(py)}) (1 Einheit = 1 km). Die geradlinige Autobahn verläuft entlang der x-Achse. Wie lang ist der kürzeste (senkrechte) Weg bis zur Autobahn?`,
              [numberField("Abstand =", py, "km", 1, {
                slips: [{ value: Math.abs(px), hint: "Der senkrechte Abstand zur x-Achse entspricht der y-Koordinate!" }],
              })],
              "Das Lot von P auf die x-Achse hat genau die Länge der y-Koordinate.",
              [
                `Lotfußpunkt F(${fmt(px)}|0) → senkrechte Strecke = y-Wert`,
                `<strong>${fmt(py, 1)}</strong>`,
              ],
              { py },
            );
          },
        },
      ],
    }),

    makeLesson(3, 2, [null, 3], {
      id: "ge-2-winkelhalbierende",
      title: "Winkelhalbierende konstruieren",
      subtitle: "Winkel exakt mit Zirkel und Lineal halbieren und Schenkelabstände prüfen",
      tracks: ["M"],
      whyItMatters:
        "Alle Punkte, die von zwei zusammenlaufenden Wänden gleich weit entfernt sind, liegen genau auf der Winkelhalbierenden — wichtig auch beim Inkreis von Dreiecken.",
      explanationHtml: `
        <p>Die <strong>Winkelhalbierende w<sub>α</sub></strong> teilt einen Winkel α in zwei gleich große Teilwinkel (${frac("α", 2)}). Jeder Punkt auf ihr hat zu beiden Schenkeln denselben senkrechten Abstand.</p>
        <div class="example">
          <strong>Beispiel (Konstruktion):</strong><br>
          1. Stich am Scheitel S ein und schneide beide Schenkel.<br>
          2. Stich in beide Schnittpunkte mit gleichem Radius ein → Schnittpunkt K.<br>
          3. Die Halbgerade von S durch K ist w<sub>α</sub>. Bei α = 70° entstehen zwei <strong>35°</strong>-Winkel.
        </div>
        <div class="merke">
          <strong>Merke:</strong> w<sub>α</sub> halbiert den Winkel und hält immer gleichen Abstand zu beiden Schenkeln.
        </div>
      `,
      formulas: [
        {
          name: "Winkelhalbierende",
          html: `Teilwinkel = ${frac("α", 2)}`,
          quantities: "α gesamter Winkel am Scheitel S",
        },
      ],
      quiz: {
        question: "Du halbierst einen gestreckten Winkel (180°) mit der Winkelhalbierenden. Was entsteht?",
        options: [
          "Zwei rechte Winkel zu je 90°",
          "Zwei spitze Winkel zu je 45°",
          "Ein rechter und ein stumpfer Winkel",
        ],
        correctIndex: 0,
        explanation:
          "180° : 2 = 90°. Die Winkelhalbierende eines gestreckten Winkels steht also genau senkrecht!",
      },
      lab: lab(
        "angle-bisector",
        "Winkelhalbierende & Schenkelabstand",
        "Verändere den Winkel α und ziehe Punkt P auf der Winkelhalbierenden.",
        [
          range("alpha", "Winkel α", 30, 140, 70, 5, "°"),
          range("r", "Entfernung S−P", 2, 6, 4, 0.5, "cm"),
        ],
        [
          output("half", "Teilwinkel α/2", (v) => v.alpha / 2, "°", 1, true),
          output("dist", "Schenkelabstand", (v) => v.r * Math.sin(((v.alpha / 2) * Math.PI) / 180), "cm", 2),
        ],
        [
          {
            id: "right-bisect",
            text: "Halbiere einen 90°-Winkel (Teilwinkel = 45°).",
            check: (v, r) => v.alpha === 90 && near(Number(r.half), 45, 0.01),
          },
          {
            id: "half-30",
            text: "Stelle α = 60° ein und ziehe P auf r = 5 cm — lies den genauen Schenkelabstand ab!",
            check: (v, r) => v.alpha === 60 && v.r === 5 && near(Number(r.dist), 2.5, 0.02),
          },
          {
            id: "obtuse-120",
            text: "Untersuche einen stumpfen Winkel von α = 120°.",
            check: (v) => v.alpha === 120,
          },
        ],
      ),
      exercises: [
        {
          id: "bisect-half",
          make(rng, level) {
            const alpha = rng.int(4, 30) * 5;
            const half = alpha / 2;
            return task(
              level,
              `Berechne den Teilwinkel der Winkelhalbierenden zu α = ${alpha}°.`,
              `Eine Straße teilt sich an einer Gabelung im Winkel von ${alpha}°. Ein Radweg soll genau mittig auf der Winkelhalbierenden verlaufen. Welchen Winkel schließt er mit jedem Straßenrand ein?`,
              [numberField("α/2 =", half, "°", 1)],
              "Teile den gegebenen Winkel durch 2.",
              [
                `${alpha}° : 2`,
                `<strong>${fmt(half, 1)}°</strong>`,
              ],
              { alpha, half },
            );
          },
        },
        {
          id: "double-from-half",
          make(rng, level) {
            const half = rng.int(12, 65);
            const alpha = half * 2;
            return task(
              level,
              `Eine Winkelhalbierende erzeugt zwei Teilwinkel von je ${half}°. Wie groß war der ganze Winkel α?`,
              `Ein Dachsparren liegt genau auf der Winkelhalbierenden des Dachfirsts und bildet mit jeder Dachseite ${half}°. Wie groß ist der gesamte Firstwinkel?`,
              [numberField("α =", alpha, "°", 0)],
              "Der gesamte Winkel ist doppelt so groß wie ein Teilwinkel.",
              [
                `2 · ${half}°`,
                `<strong>${alpha}°</strong>`,
              ],
              { half, alpha },
            );
          },
        },
      ],
    }),

    makeLesson(3, 3, LB, {
      id: "ge-3-massstab-koordinaten",
      title: "Maßstab & Koordinatensystem",
      subtitle: "Figuren vergrößern, verkleinern und Kartenmaße umrechnen",
      tracks: BOTH,
      whyItMatters:
        "Auf Wanderkarten oder Bauplänen wird die Wirklichkeit stark verkleinert dargestellt. Mit dem Maßstab rechnest du echte Entfernungen exakt aus.",
      explanationHtml: `
        <p>Ein <strong>Maßstab</strong> vergleicht die Bildlänge mit der Wirklichkeit:</p>
        <ul>
          <li><strong>1 : 50 000</strong> (Verkleinerung): 1 cm auf der Karte sind 50 000 cm = <strong>500 m</strong> in echt.</li>
          <li><strong>3 : 1</strong> (Vergrößerung): 3 cm im Bild entsprechen 1 cm in echt.</li>
        </ul>
        <div class="example">
          <strong>Beispiel (Wanderkarte 1 : 25 000):</strong> Auf der Karte misst du 4 cm.<br>
          Wirklichkeit: 4 · 25 000 cm = 100 000 cm = 1 000 m = <strong>1 km</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> Immer in derselben Einheit multiplizieren bzw. teilen und erst am Schluss cm → m (÷ 100) → km (÷ 1 000) umrechnen!
        </div>
      `,
      formulas: [
        {
          name: "Maßstab (Bild : Wirklichkeit)",
          html: `Maßstab 1 : n ⇒ Wirklichkeit = Bild · n`,
          quantities: "gleiche Längeneinheit (meist cm)",
        },
      ],
      quiz: {
        question: "Auf einem Bauplan im Maßstab 1 : 100 ist eine Wand 4,5 cm lang gezeichnet. Wie lang ist sie in Wirklichkeit?",
        options: ["4,5 m", "45 m", "0,45 m"],
        correctIndex: 0,
        explanation:
          "4,5 cm · 100 = 450 cm = 4,5 m.",
      },
      lab: lab(
        "scale-coord",
        "Maßstab im Koordinatensystem",
        "Ziehe die Ecke der vergrößerten Figur oder stelle den Faktor k ein.",
        [
          range("k", "Streckfaktor k", 0.5, 3, 1.5, 0.5),
          range("w", "Breite Original", 1, 4, 3, 1, "cm"),
          range("h", "Höhe Original", 1, 3, 2, 1, "cm"),
        ],
        [
          output("wNew", "Breite Bild", (v) => v.w * v.k, "cm", 1, true),
          output("hNew", "Höhe Bild", (v) => v.h * v.k, "cm", 1),
        ],
        [
          {
            id: "double-fig",
            text: "Vergrößere ein 3 cm × 2 cm Rechteck auf 6 cm × 4 cm (Maßstab 2 : 1).",
            check: (v, r) => v.w === 3 && v.h === 2 && v.k === 2 && near(Number(r.wNew), 6, 0.01),
          },
          {
            id: "shrink-half",
            text: "Verkleinere ein 4 cm × 2 cm Rechteck im Maßstab 1 : 2 (k = 0,5).",
            check: (v) => v.w === 4 && v.h === 2 && v.k === 0.5,
          },
          {
            id: "triple-12",
            text: "Erreiche eine Bildbreite von 12 cm.",
            check: (_v, r) => near(Number(r.wNew), 12, 0.01),
          },
        ],
      ),
      exercises: [
        {
          id: "map-to-real-m",
          make(rng, level) {
            const cm = rng.stepped(2, 12, 0.5);
            const scale = rng.pick([100, 200, 500, 1000]);
            const meters = (cm * scale) / 100;
            return task(
              level,
              `Bildlänge ${fmt(cm, 1)} cm im Maßstab 1 : ${scale}. Berechne die wirkliche Länge in Metern.`,
              `Auf dem Schulhofplan (Maßstab 1 : ${scale}) misst der Pausenhof ${fmt(cm, 1)} cm. Wie viele Meter ist er in Wirklichkeit lang?`,
              [numberField("Länge =", meters, "m", 2, {
                slips: [{ value: cm * scale, hint: "Nicht bei cm stehen bleiben — teile durch 100 für Meter!" }],
              })],
              `Erst mit ${scale} multiplizieren (ergibt cm), dann durch 100 in Meter umrechnen.`,
              [
                `${fmt(cm, 1)} cm · ${scale} = ${fmt(cm * scale, 1)} cm`,
                `${fmt(cm * scale, 1)} cm : 100 = <strong>${fmt(meters, 2)} m</strong>`,
              ],
              { cm, scale, meters },
            );
          },
        },
        {
          id: "real-to-map-cm",
          make(rng, level) {
            const km = rng.int(1, 8);
            const scale = rng.pick([25000, 50000, 100000]);
            const cm = (km * 100000) / scale;
            return task(
              level,
              `Wirklichkeit ${km} km, Maßstab 1 : ${scale}. Wie lang ist die Strecke auf der Karte (in cm)?`,
              `Die Radtour ist in echt ${km} km lang. Wie viele Zentimeter misst sie auf einer Karte im Maßstab 1 : ${scale}?`,
              [numberField("Karte =", cm, "cm", 1)],
              "1 km = 100 000 cm. Teile diese Zentimeter durch die Maßstabszahl.",
              [
                `${km} km = ${km * 100000} cm`,
                `${km * 100000} : ${scale} = <strong>${fmt(cm, 1)} cm</strong>`,
              ],
              { km, scale, cm },
            );
          },
        },
      ],
    }),

    makeLesson(3, 4, LB, {
      id: "ge-4-dreiecke-einteilung",
      title: "Dreiecke einteilen & beschriften",
      subtitle: "Allgemeine, gleichschenklige, gleichseitige und rechtwinklige Dreiecke erkennen",
      tracks: BOTH,
      whyItMatters:
        "Dachstühle und Brückenfachwerke nutzen gezielt spezielle Dreiecke: Gleichseitige verteilen Lasten symmetrisch, rechtwinklige bilden saubere Ecken.",
      explanationHtml: `
        <p>Dreiecke werden gegen den Uhrzeigersinn beschriftet: Ecken <strong>A, B, C</strong>, gegenüberliegende Seiten <strong>a, b, c</strong> und Innenwinkel <strong>α, β, γ</strong>.</p>
        <div class="example">
          <strong>Einteilung nach Seiten &amp; Winkeln:</strong><br>
          • <strong>Gleichseitig:</strong> alle 3 Seiten gleich lang (alle Winkel 60°)<br>
          • <strong>Gleichschenklig:</strong> mindestens 2 Seiten (Schenkel) gleich lang; Basiswinkel sind gleich groß<br>
          • <strong>Rechtwinklig:</strong> genau ein Winkel beträgt 90° (gegenüber liegt die Hypotenuse)
        </div>
        <div class="merke">
          <strong>Merke:</strong> Seite <em>a</em> liegt immer gegenüber von Eckpunkt <em>A</em>, Winkel <em>α</em> immer am Eckpunkt <em>A</em>!
        </div>
      `,
      formulas: [
        {
          name: "Gleichseitiges Dreieck",
          html: `a = b = c  ⇒  α = β = γ = 60°`,
          quantities: "alle Seiten und Winkel gleich",
        },
      ],
      quiz: {
        question: "Welche Aussage trifft auf jedes gleichschenklige Dreieck zu?",
        options: [
          "Zwei Seiten und die zugehörigen Basiswinkel sind gleich groß.",
          "Alle drei Winkel betragen 60°.",
          "Es besitzt zwingend einen rechten Winkel.",
        ],
        correctIndex: 0,
        explanation:
          "Im gleichschenkligen Dreieck sind die beiden Schenkel gleich lang und damit auch die beiden an der Basis anliegenden Winkel gleich groß.",
      },
      lab: lab(
        "triangle-classify",
        "Dreieck-Typen erkunden",
        "Ziehe Punkt C und beobachte, wann das Dreieck gleichschenklig, gleichseitig oder rechtwinklig wird.",
        [
          range("cx", "x-Koordinate C", -4, 4, 1.5, 0.5),
          range("cy", "Höhe y von C", 1, 6, 4, 0.5),
        ],
        [
          output("type", "Klassifikation", (v) => {
            const a = Math.hypot(3 - v.cx, v.cy);
            const b = Math.hypot(-3 - v.cx, v.cy);
            const c = 6;
            const eqSide = Math.abs(a - b) < 0.25 && Math.abs(a - c) < 0.25;
            const iso = Math.abs(a - b) < 0.1 || Math.abs(a - c) < 0.25 || Math.abs(b - c) < 0.25;
            const right =
              Math.abs(v.cx * v.cx + v.cy * v.cy - 9) < 0.4 ||
              Math.abs((v.cx + 3) < 0.01 ? 0 : 1) === 0;
            if (eqSide) return "gleichseitig";
            if (iso && right) return "gleichschenklig-rechtw.";
            if (iso) return "gleichschenklig";
            return "allgemein";
          }, "", 0, true),
          output("gamma", "Winkel γ", (v) => {
            const a = Math.hypot(3 - v.cx, v.cy);
            const b = Math.hypot(-3 - v.cx, v.cy);
            const cosG = (a * a + b * b - 36) / (2 * a * b);
            return (Math.acos(Math.max(-1, Math.min(1, cosG))) * 180) / Math.PI;
          }, "°", 1),
        ],
        [
          {
            id: "isosceles-cx0",
            text: "Ziehe C auf die Symmetrieachse x = 0 (gleichschenkliges Dreieck mit a = b).",
            check: (v) => Math.abs(v.cx) < 0.01 && v.cy >= 2,
          },
          {
            id: "thales-right",
            text: "Erzeuge ein rechtwinkliges Dreieck bei C (γ = 90°) mit x = 0 und y = 3!",
            check: (_v, r) => near(Number(r.gamma), 90, 0.02),
          },
          {
            id: "equilateral",
            text: "Finde ein nahezu gleichseitiges Dreieck (alle Seiten ca. 6,0 cm → x = 0, y = 5).",
            check: (v) => v.cx === 0 && v.cy === 5,
          },
        ],
      ),
      exercises: [
        {
          id: "isosceles-angle",
          make(rng, level) {
            const top = rng.pick([40, 50, 70, 80, 100]);
            const base = (180 - top) / 2;
            return task(
              level,
              `Ein gleichschenkliges Dreieck hat an der Spitze γ = ${top}°. Berechne einen Basiswinkel α (= β).`,
              `Ein gleichschenkliger Giebel hat oben an der Spitze einen Winkel von ${top}°. Wie steil steigt jedes Dach auf beiden Seiten an (Basiswinkel)?`,
              [numberField("α =", base, "°", 1, {
                slips: [{ value: 180 - top, hint: "Die restlichen Grad verteilen sich auf BEIDE Basiswinkel — noch durch 2 teilen!" }],
              })],
              "Ziehe den Spitzenwinkel von 180° ab und teile durch 2.",
              [
                `(180° − ${top}°) : 2 = ${180 - top}° : 2`,
                `<strong>${fmt(base, 1)}°</strong>`,
              ],
              { top, base },
            );
          },
        },
        {
          id: "triangle-naming",
          make(rng, level) {
            const sides = rng.pick([
              [5, 5, 5, 0],
              [6, 6, 4, 1],
              [3, 4, 5, 2],
            ]);
            const idx = sides[3];
            return task(
              level,
              `Ordne das Dreieck mit a = ${sides[0]} cm, b = ${sides[1]} cm, c = ${sides[2]} cm richtig ein.`,
              `Beim Bau eines Regals misst eine dreieckige Halterung ${sides[0]} cm, ${sides[1]} cm und ${sides[2]} cm (Hinweis: 3² + 4² = 5² ergibt 90°). Welche Bezeichnung passt am genauesten?`,
              [
                choiceField(
                  "Dreieckstyp",
                  ["gleichseitig", "gleichschenklig", "rechtwinklig (3-4-5)"],
                  idx,
                ),
              ],
              "Prüfe, wie viele Seiten gleich lang sind (3 = gleichseitig, 2 = gleichschenklig, 3-4-5 = rechtwinklig).",
              [
                `Seitenvergleich: ${sides[0]} cm, ${sides[1]} cm, ${sides[2]} cm`,
                `<strong>${["gleichseitig", "gleichschenklig", "rechtwinklig (3-4-5)"][idx]}</strong>`,
              ],
              { idx },
            );
          },
        },
      ],
    }),

    makeLesson(3, 5, LB, {
      id: "ge-5-dreieck-konstruktion",
      title: "Dreiecke konstruieren (sss, sws, wsw)",
      subtitle: "Dreiecke aus Seiten und Winkeln mit Zirkel und Geodreieck eindeutig zeichnen",
      tracks: BOTH,
      whyItMatters:
        "Damit aus vorgegebenen Längen und Winkeln genau ein passendes Werkstück entsteht, nutzt man die Konstruktionssätze sss, sws und wsw.",
      explanationHtml: `
        <p>Nicht jede Angabe ergibt ein Dreieck — prüfe zuerst immer, ob das Dreieck existiert:</p>
        <div class="example">
          <strong>Die drei Konstruktionswege:</strong><br>
          • <strong>sss</strong> (3 Seiten): Zirkelbögen um A und B — möglich, wenn je zwei Seiten zusammen größer als die dritte sind (z. B. 4 + 5 &gt; 7).<br>
          • <strong>sws</strong> (2 Seiten + eingeschlossener Winkel): erst eine Seite, dann Winkel anlegen, zweite Seite abtragen.<br>
          • <strong>wsw</strong> (1 Seite + 2 anliegende Winkel): nur möglich, wenn beide Winkel zusammen kleiner als 180° sind!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Immer zuerst eine kleine Planfigur skizzieren und die gegebenen Stücke farbig markieren!
        </div>
      `,
      formulas: [
        {
          name: "Dreiecksungleichung (sss)",
          html: `a + b &gt; c , &nbsp; a + c &gt; b , &nbsp; b + c &gt; a`,
          quantities: "Seitenlängen a, b, c eines Dreiecks",
        },
      ],
      quiz: {
        question: "Warum lässt sich aus a = 3 cm, b = 4 cm und c = 8 cm KEIN Dreieck konstruieren?",
        options: [
          "Weil 3 cm + 4 cm = 7 cm kleiner als 8 cm ist (Kreise schneiden sich nicht).",
          "Weil man immer mindestens einen Winkel braucht.",
          "Weil c nur höchstens 5 cm lang sein darf.",
        ],
        correctIndex: 0,
        explanation:
          "Zwei Seiten zusammen müssen länger als die dritte Seite sein. 3 + 4 = 7 < 8 → geht nicht!",
      },
      lab: lab(
        "triangle-construct",
        "Konstruktions-Labor (sss, sws, wsw)",
        "Teste verschiedene Kombinationen für sss, sws und wsw und prüfe die Konstruierbarkeit.",
        [
          choice("mode", "Satz", ["sss (3 Seiten)", "sws (Seite-Winkel-Seite)", "wsw (Winkel-Seite-Winkel)"], 0),
          range("a", "Seite a", 2, 9, 5, 1, "cm"),
          range("b", "Seite b", 2, 9, 4, 1, "cm"),
          range("c", "Seite c", 4, 10, 6, 1, "cm"),
          range("alpha", "Winkel α", 30, 120, 60, 10, "°"),
          range("beta", "Winkel β", 30, 120, 50, 10, "°"),
        ],
        [
          output(
            "possible",
            "Konstruierbar?",
            (v) => {
              if (v.mode === 0) return v.a + v.b > v.c && v.a + v.c > v.b && v.b + v.c > v.a ? "ja" : "nein";
              if (v.mode === 1) return "ja";
              return v.alpha + v.beta < 180 ? "ja" : "nein";
            },
            "",
            0,
            true,
          ),
        ],
        [
          {
            id: "sss-fail",
            text: "Probiere im Modus sss eine Kombination aus, bei der KEIN Dreieck entsteht!",
            check: (v, r) => v.mode === 0 && r.possible === "nein",
          },
          {
            id: "sws-set",
            text: "Wechsle zu sws und stelle c = 7 cm, b = 5 cm, α = 70° ein.",
            check: (v) => v.mode === 1 && v.c === 7 && v.b === 5 && v.alpha === 70,
          },
          {
            id: "wsw-fail",
            text: "Finde im Modus wsw Winkel α und β, die zusammen kein Dreieck mehr ergeben.",
            check: (v, r) => v.mode === 2 && r.possible === "nein",
          },
        ],
      ),
      exercises: [
        {
          id: "triangle-existence-sss",
          make(rng, level) {
            const ok = rng.next() < 0.55;
            const c = rng.int(7, 11);
            const a = rng.int(2, 5);
            const b = ok ? c - a + rng.int(2, 4) : c - a - rng.int(0, 1);
            const bSafe = Math.max(2, b);
            const valid = a + bSafe > c && a + c > bSafe && bSafe + c > a;
            return task(
              level,
              `Prüfe die Seiten a = ${a} cm, b = ${bSafe} cm, c = ${c} cm. Entsteht ein Dreieck?`,
              `Du hast drei Holzleisten mit ${a} cm, ${bSafe} cm und ${c} cm Länge vor dir. Lässt sich daraus ein geschlossenes Dreieck legen?`,
              [choiceField("Konstruierbar?", ["ja", "nein"], valid ? 0 : 1)],
              "Prüfe, ob die zwei kürzeren Seiten zusammen echt länger als die längste Seite sind.",
              [
                `Kürzeste Summe vs. längste Seite prüfen (Dreiecksungleichung)`,
                `<strong>${valid ? "ja" : "nein"}</strong>`,
              ],
              { a, bSafe, c },
            );
          },
        },
        {
          id: "wsw-third-angle",
          make(rng, level) {
            const alpha = rng.int(4, 11) * 10;
            const beta = rng.int(3, 12) * 5;
            const gamma = 180 - alpha - beta;
            return task(
              level,
              `Konstruktion wsw: c = 6 cm, α = ${alpha}°, β = ${beta}°. Berechne vorher den dritten Winkel γ.`,
              `Für einen wsw-Zuschnitt sind zwei anliegende Winkel ${alpha}° und ${beta}° gegeben. Wie groß wird der dritte Winkel an der Spitze?`,
              [numberField("γ =", gamma, "°", 0)],
              "Die Innenwinkelsumme jedes Dreiecks beträgt 180°.",
              [
                `γ = 180° − (${alpha}° + ${beta}°)`,
                `<strong>${gamma}°</strong>`,
              ],
              { alpha, beta, gamma },
            );
          },
        },
      ],
    }),

    makeLesson(3, 6, LB, {
      id: "ge-6-innenwinkelsumme",
      title: "Innenwinkelsumme im Dreieck",
      subtitle: "Die 180°-Regel anschaulich begründen und fehlende Winkel berechnen",
      tracks: BOTH,
      whyItMatters:
        "Kennt man zwei Winkel eines Dreiecks, ist der dritte eindeutig festgelegt — ganz ohne Messen.",
      explanationHtml: `
        <p>Reißt man bei einem beliebigen Papierdreieck die drei Ecken ab und legt sie nebeneinander an eine Gerade, ergeben sie zusammen immer einen <strong>gestreckten Winkel (180°)</strong>.</p>
        <div class="example">
          <strong>Beispiel:</strong> In einem rechtwinkligen Dreieck ist α = 90° und β = 38°.<br>
          Dann ist γ = 180° − 90° − 38° = <strong>52°</strong>.
        </div>
        <div class="merke">
          <strong>Merke:</strong> In jedem Dreieck gilt: <strong>α + β + γ = 180°</strong>.
        </div>
      `,
      formulas: [
        {
          name: "Innenwinkelsumme im Dreieck",
          html: `α + β + γ = 180°`,
          quantities: "α, β, γ die drei Innenwinkel eines Dreiecks",
        },
      ],
      quiz: {
        question: "Zwei Winkel im Dreieck messen 55° und 65°. Wie groß ist der dritte Winkel?",
        options: ["60°", "70°", "50°"],
        correctIndex: 0,
        explanation:
          "55° + 65° = 120°. Bis 180° fehlen genau 60°.",
      },
      lab: lab(
        "triangle-classify",
        "Innenwinkelsumme prüfen",
        "Ziehe Eckpunkt C in jede Richtung und überprüfe, ob α + β + γ stets 180° bleibt.",
        [
          range("cx", "x-Koordinate C", -4, 4, -1.5, 0.5),
          range("cy", "Höhe y von C", 1, 6, 4.5, 0.5),
        ],
        [
          output(
            "sum",
            "α + β + γ",
            () => 180,
            "°",
            0,
            true,
          ),
          output(
            "alpha",
            "α",
            (v) => {
              const a = Math.hypot(3 - v.cx, v.cy);
              const b = Math.hypot(-3 - v.cx, v.cy);
              return (Math.acos(Math.max(-1, Math.min(1, (b * b + 36 - a * a) / (12 * b)))) * 180) / Math.PI;
            },
            "°",
            1,
          ),
        ],
        [
          {
            id: "alpha-60",
            text: "Bewege C so, dass α ungefähr 60° (innerhalb ±2°) beträgt.",
            check: (_v, r) => Math.abs(Number(r.alpha) - 60) <= 2,
          },
          {
            id: "flat-triangle",
            text: "Ziehe C ganz flach auf y = 1 (beachte: Summe bleibt 180°!).",
            check: (v) => v.cy === 1,
          },
          {
            id: "right-x",
            text: "Verschiebe C ganz nach rechts auf x = 4 und y = 3.",
            check: (v) => v.cx === 4 && v.cy === 3,
          },
        ],
      ),
      exercises: [
        {
          id: "find-third-angle",
          make(rng, level) {
            const a = rng.int(25, 95);
            const b = rng.int(25, 145 - a);
            const c = 180 - a - b;
            return task(
              level,
              `Berechne den fehlenden Winkel γ für α = ${a}° und β = ${b}°.`,
              `Beim Vermessen eines dreieckigen Grundstücks misst das Messgerät an zwei Ecken ${a}° und ${b}°. Welcher Winkel liegt an der dritten Ecke?`,
              [numberField("γ =", c, "°", 0)],
              "Ziehe beide bekannten Winkel von 180° ab.",
              [
                `180° − ${a}° − ${b}° = 180° − ${a + b}°`,
                `<strong>${c}°</strong>`,
              ],
              { a, b, c },
            );
          },
        },
        {
          id: "right-triangle-angle",
          make(rng, level) {
            const w = rng.int(15, 72);
            const other = 90 - w;
            return task(
              level,
              `In einem rechtwinkligen Dreieck (γ = 90°) ist α = ${w}°. Berechne β.`,
              `Eine Leiter lehnt an einer senkrechten Hauswand (90°-Winkel am Boden) und bildet mit dem Boden einen Winkel von ${w}°. Wie groß ist der obere Winkel zwischen Leiter und Wand?`,
              [numberField("β =", other, "°", 0)],
              "Da ein Winkel schon 90° hat, ergänzen sich α und β auf 90°.",
              [
                `180° − 90° − ${w}° = 90° − ${w}°`,
                `<strong>${other}°</strong>`,
              ],
              { w, other },
            );
          },
        },
      ],
    }),

    makeLesson(3, 7, LB, {
      id: "ge-7-prismen-erkennen-netze",
      title: "Prismen: Merkmale, Schrägbilder & Netze",
      subtitle: "Rechteck-, Parallelogramm- und Dreiecksprismen unterscheiden und darstellen",
      tracks: BOTH,
      whyItMatters:
        "Verpackungen, Dachbalken und Toblerone-Schachteln sind Prismen. Wer zwischen Schrägbild und aufgeklapptem Netz wechseln kann, versteht Konstruktionszeichnungen sofort.",
      explanationHtml: `
        <p>Ein gerades <strong>Prisma</strong> hat zwei deckungsgleiche, parallele Vielecke als <strong>Grund- und Deckfläche</strong>. Die Seitenflächen bilden zusammen den Mantel und sind immer <strong>Rechtecke</strong>.</p>
        <div class="example">
          <strong>Beispiel (Dreiecksprisma):</strong><br>
          Grundfläche: Dreieck (3 Seiten) → 2 Grundflächen + 3 Rechtecks-Seitenflächen = <strong>5 Flächen</strong>, <strong>6 Ecken</strong>, <strong>9 Kanten</strong>.<br>
          Im aufgeklappten <strong>Netz</strong> müssen alle Mantelkanten genau so lang sein wie die zugehörige Seite der Grundfläche!
        </div>
        <div class="merke">
          <strong>Merke:</strong> Hat die Grundfläche <em>n</em> Ecken, so besitzt das Prisma <strong>2n Ecken</strong>, <strong>3n Kanten</strong> und <strong>n + 2 Flächen</strong>.
        </div>
      `,
      formulas: [
        {
          name: "Bestimmungsstücke am Prisma",
          html: `Ecken = 2 · n &nbsp;·&nbsp; Kanten = 3 · n &nbsp;·&nbsp; Flächen = n + 2`,
          quantities: "n Eckenzahl der Grundfläche",
        },
      ],
      quiz: {
        question: "Woraus besteht der Mantel eines geraden Prismas immer?",
        options: [
          "Aus Rechtecken (so viele wie die Grundfläche Seiten hat)",
          "Aus lauter Dreiecken, die sich oben treffen",
          "Aus zwei Kreisen und einer gekrümmten Fläche",
        ],
        correctIndex: 0,
        explanation:
          "Zwischen der Grund- und der parallelen Deckfläche liegen bei jedem geraden Prisma lauter Rechtecke als Seitenflächen.",
      },
      lab: lab(
        "prism-net",
        "Prismen: Schrägbild ↔ Netz",
        "Wechsle die Grundfläche zwischen Rechteck, Parallelogramm und Dreieck und klappe das Netz auf.",
        [
          choice("shape", "Grundfläche", ["Rechteck", "Parallelogramm", "Dreieck"], 2),
          range("g", "Grundseite g", 3, 7, 5, 1, "cm"),
          range("h", "Grundflächenhöhe h", 2, 5, 3, 1, "cm"),
          range("hk", "Körperhöhe hₖ", 3, 7, 4, 1, "cm"),
          choice("fold", "Ansicht", ["Schrägbild", "Netz"], 0),
        ],
        [
          output("faces", "Flächenzahl", (v) => (v.shape === 2 ? 5 : 6), "", 0, true),
          output("edges", "Kantenanzahl", (v) => (v.shape === 2 ? 9 : 12), "", 0),
        ],
        [
          {
            id: "unfold-tri",
            text: "Klappe das Dreiecksprisma zum Netz auf!",
            check: (v) => v.shape === 2 && v.fold === 1,
          },
          {
            id: "para-prism",
            text: "Zeige das Schrägbild eines Parallelogrammprismas mit hₖ = 6 cm.",
            check: (v) => v.shape === 1 && v.fold === 0 && v.hk === 6,
          },
          {
            id: "rect-net",
            text: "Vergleiche mit dem Netz eines Rechteckprismas (Quader: 6 Flächen, 12 Kanten).",
            check: (v, r) => v.shape === 0 && v.fold === 1 && Number(r.edges) === 12,
          },
        ],
      ),
      exercises: [
        {
          id: "prism-count-parts",
          make(rng, level) {
            const n = rng.pick([3, 4, 5, 6]);
            const names = { 3: "Dreieck", 4: "Viereck/Parallelogramm", 5: "Fünfeck", 6: "Sechseck" } as const;
            return task(
              level,
              `Ein gerades Prisma hat als Grundfläche ein ${names[n as 3 | 4 | 5 | 6]}. Wie viele Ecken und Kanten hat es?`,
              `Eine Verpackungsdose hat die Form eines geraden Prismas mit ${names[n as 3 | 4 | 5 | 6]}s-Grundfläche. Wie viele Eckpunkte und Gesamtkanten musst du am Modell zählen?`,
              [
                numberField("Ecken =", 2 * n, "", 0),
                numberField("Kanten =", 3 * n, "", 0),
              ],
              "Unten n Ecken + oben n Ecken = 2n; Kanten: n unten + n oben + n senkrecht = 3n.",
              [
                `Ecken: 2 · ${n} = ${2 * n}`,
                `Kanten: 3 · ${n} = <strong>${3 * n}</strong>`,
              ],
              { n },
            );
          },
        },
        {
          id: "prism-net-fault",
          make(rng, level) {
            const side = rng.int(3, 8);
            const wrong = rng.next() < 0.5;
            const seam = wrong ? side + 2 : side;
            return task(
              level,
              `Beim Netz eines gleichseitigen Dreiecksprismas (Dreiecksseite ${side} cm) hat das angeschlossene Mantelrechteck die Breite ${seam} cm. Passt das Netz?`,
              `Beim Basteln einer Schachtel klebst du ein gleichseitiges Dreieck (Seitenlänge ${side} cm) an ein Mantelrechteck der Breite ${seam} cm. Lässt sich daraus ein geschlossenes Prisma falten?`,
              [choiceField("Netz passt?", ["ja", "nein"], wrong ? 1 : 0)],
              "Zusammengehörige Klebekanten von Grundfläche und Mantelrechteck müssen exakt gleich lang sein.",
              [
                `Dreiecksseite ${side} cm vs. Mantelbreite ${seam} cm`,
                `<strong>${wrong ? "nein" : "ja"}</strong>`,
              ],
              { side, seam },
            );
          },
        },
      ],
    }),
  ],
);
