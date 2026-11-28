import { fmt } from "../exercises/format";
import type { Lesson, ModelKind } from "../model/types";
import {
  extension,
  fallFactor,
  focalLength,
  lampCurrent,
  lensImage,
  MODEL_SCENARIOS,
  modelValues,
  PARAMS,
  radians,
  ray,
  sourceCurrent,
  type ModelState,
} from "../models";
import { esc } from "../workshop";
import {
  arrow,
  diagram,
  dot,
  graph,
  label,
  line,
  path,
  type Point,
} from "./figures";

export { initialModelState, type ModelState } from "../models";

function readouts(...rows: [string, string][]): string {
  return `<div class="readouts"><dl>${rows.map(([name, value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl></div>`;
}
const quantity = (value: number, unit: string) =>
  `${fmt(value, 3)}${unit === "°" ? "" : " "}${unit}`;
const component = (x: number, y: number, name: string, active = true) =>
  `<rect class="ph8-${active ? "blue" : "muted"} ph8-box" x="${x - 24}" y="${y - 11}" width="48" height="22" rx="3"/>` +
  label(name, x - 12, y + 4);

function circuit(
  u: number,
  r: number[],
  mode: "series" | "parallel",
  open: number | null,
  meter = false,
): string {
  const currents =
    mode === "series"
      ? r.map(() => (open === null ? u / r.reduce((a, b) => a + b, 0) : 0))
      : r.map((resistance, i) => (i === open ? 0 : u / resistance));
  const total =
    mode === "series" ? currents[0] : currents.reduce((a, b) => a + b, 0);
  const sourceWires =
    mode === "series"
      ? path([
          [62, 89],
          [62, 45],
          [410, 45],
          [410, 175],
          [62, 175],
          [62, 122],
        ])
      : path([
          [62, 89],
          [62, 45],
          [150 + (r.length - 1) * 90, 45],
        ]) +
        path([
          [62, 122],
          [62, 175],
          [150 + (r.length - 1) * 90, 175],
        ]);
  const source =
    sourceWires +
    line([39, 89], [85, 89], "green") +
    line([48, 122], [76, 122], "green") +
    label("+", 94, 93, "green") +
    label("−", 94, 127, "green") +
    label(quantity(u, "V"), 17, 209);
  const branchDrawing =
    mode === "series"
      ? r
          .map((_, i) => {
            const x = 140 + i * 103;
            return (
              component(x, 45, `R${["₁", "₂", "₃"][i]}`, total > 0) +
              label(quantity(currents[i] * r[i], "V"), x - 20, 83, "green")
            );
          })
          .join("") +
        (open === null
          ? arrow([240, 175], [180, 175], "blue")
          : `<rect class="ph8-mask" x="195" y="154" width="65" height="38"/>` +
            dot(195, 175, "ink") +
            dot(259, 175, "ink") +
            line([195, 175], [250, 153]))
      : r
          .map((_, i) => {
            const x = 150 + i * 90;
            const isOpen = open === i;
            return (
              path(
                [
                  [x, 45],
                  [x, 68],
                  [x, 92],
                ],
                isOpen ? "muted" : "ink",
              ) +
              line([x, 114], [x, 127], isOpen ? "muted" : "ink") +
              (isOpen
                ? line([x, 127], [x + 16, 145], "muted") +
                  line([x, 149], [x, 175], "muted")
                : arrow([x, 114], [x, 175], "blue")) +
              component(x, 104, `R${["₁", "₂", "₃"][i]}`, !isOpen) +
              dot(x, 45, "ink") +
              dot(x, 175, "ink") +
              label(quantity(currents[i], "A"), x - 23, 207, "blue")
            );
          })
          .join("");
  const instruments = meter
    ? path(
        [
          [112, 45],
          [112, 112],
          [168, 112],
          [168, 45],
        ],
        "green",
      ) +
      `<circle class="ph8-mask ph8-meter" cx="140" cy="112" r="14"/><circle class="ph8-mask ph8-meter" cx="305" cy="45" r="14"/>` +
      label("V", 135, 117, "green") +
      label("A", 300, 50, "blue")
    : "";
  const description =
    mode === "series"
      ? `Ein Stromweg. Die Stromstärke ist überall ${quantity(total, "A")}.`
      : `Parallele Zweige an derselben Spannung: ${quantity(u, "V")}. Die Stromstärken addieren sich zu ${quantity(total, "A")}.`;
  return (
    diagram("Schaltbild", description, source + branchDrawing + instruments) +
    readouts(
      ["Quellenspannung", quantity(u, "V")],
      ["Gesamtstrom", quantity(total, "A")],
      ...currents.map((i, n): [string, string] => [
        `Widerstand ${n + 1}`,
        quantity(
          mode === "series" ? i * r[n] : i,
          mode === "series" ? "V" : "A",
        ),
      ]),
    )
  );
}

function refraction(
  angle: number,
  indices: [number, number],
  medium: string,
): string {
  const bent = ray(angle, ...indices);
  const tip = (a: number, y: number): Point => [
    230 + y * 92 * Math.sin(radians(a)),
    112 + y * 92 * Math.cos(radians(a)),
  ];
  const description =
    bent === null
      ? `${medium}. Bei ${angle}° zum Lot wird der Strahl vollständig zurückgeworfen.`
      : `${medium}. Einfall ${angle}°, Brechung etwa ${fmt(bent, 1)}°, jeweils zum Lot.`;
  return diagram(
    "Strahlengang an der Grenzfläche",
    description,
    `<rect class="ph8-medium" x="18" y="112" width="424" height="100" rx="8"/>` +
      line([18, 112], [442, 112]) +
      line([230, 12], [230, 212], "muted", true) +
      label("Lot", 240, 23) +
      label(medium.split(" → ")[0], 24, 92) +
      label(medium.split(" → ")[1], 24, 136) +
      arrow(tip(angle, -1), [230, 112], "gold") +
      (bent === null
        ? arrow([230, 112], tip(-angle, -1), "pink")
        : arrow([230, 112], tip(bent, 1), "blue")),
  );
}

function lens(g: number): string {
  const b = lensImage(g);
  const scale = Math.min(5, 190 / Math.max(g, Math.abs(b ?? 0), 10));
  const h = Math.min((29 * scale) / 5, 76 / Math.max(1, Math.abs(b ?? 0) / g));
  const xG = 230 - g * scale;
  const xB = 230 + (b ?? 0) * scale;
  const obj: Point = [xG, 117 - h];
  const image: Point = [xB, 117 + ((b ?? 0) * h) / g];
  const right = b === null ? 408 : Math.min(408, Math.max(310, xB + 18));
  const parallelSlope = h / (focalLength * scale);
  const centerSlope = h / (g * scale);
  const text =
    b === null
      ? "Die Strahlen verlaufen hinter der Linse parallel."
      : b > 0
        ? `Reelles, umgekehrtes Bild etwa ${fmt(b, 1)} cm rechts der Linse.`
        : `Virtuelles, aufrechtes Bild etwa ${fmt(-b, 1)} cm links der Linse.`;
  const end = Math.min(right, 230 + 96 / Math.max(parallelSlope, centerSlope));
  return (
    diagram(
      "Bildkonstruktion an der Sammellinse",
      text,
      line([14, 117], [446, 117], "muted") +
        line([230, 25], [230, 208], "blue") +
        label("Linse", 205, 19) +
        [230 - focalLength * scale, 230 + focalLength * scale]
          .map((x) => dot(x, 117, "blue") + label("F", x - 4, 136))
          .join("") +
        arrow([xG, 117], obj, "pink") +
        label("G", xG - 20, 113, "pink") +
        line(obj, [230, 117 - h], "gold") +
        arrow(
          [230, 117 - h],
          [end, 117 - h + parallelSlope * (end - 230)],
          "gold",
        ) +
        line(obj, [230, 117], "green") +
        arrow([230, 117], [end, 117 + centerSlope * (end - 230)], "green") +
        (b === null
          ? ""
          : arrow([xB, 117], image, "blue", b < 0) +
            label("B", xB + 6, 111, "blue") +
            (b < 0
              ? line([230, 117 - h], image, "gold", true) +
                line([230, 117], image, "green", true)
              : "")),
    ) +
    readouts(
      ["Brennweite", "10 cm"],
      ["Gegenstandsweite", quantity(g, "cm")],
      ["Bildweite (Abstand)", b === null ? "–" : quantity(Math.abs(b), "cm")],
    )
  );
}

function motion(bend: number, speed: number): string {
  const x = 218,
    y = 174;
  const dx = Math.cos(radians(bend));
  const dy = -Math.sin(radians(bend));
  const spacing = speed * 5;
  const before: Point[] = [3, 2, 1, 0].map((i) => [x - spacing * i, y]);
  const after: Point[] = [1, 2, 3].map((i) => [
    x + dx * spacing * i,
    y + dy * spacing * i,
  ]);
  return diagram(
    "Stroboskopbilder und Geschwindigkeitspfeile",
    `Punktabstände sind gleich, Tempo ${speed} m/s. Die Richtung ändert sich am markierten Punkt um ${bend}°.`,
    path([...before, ...after], "muted") +
      [...before, ...after].map((p) => dot(...p)).join("") +
      arrow(before[0], [before[0][0] + 11 * speed, y], "gold") +
      arrow([x, y], [x + dx * 11 * speed, y + dy * 11 * speed], "pink") +
      label("v davor", 37, 148, "gold") +
      label("v danach", 268, 112, "pink"),
  );
}

function modelBody(kind: ModelKind, v: ModelState): string {
  switch (kind) {
    case "stromkreis":
      return circuit(v.u, [v.r], "series", v.closed ? null : 0);
    case "kennlinie": {
      const current = (u: number) => (v.lamp ? lampCurrent(u) : u / 20);
      return (
        graph(
          "U-I-Kennlinie",
          v.lamp
            ? "Modellwerte der Glühlampe: Die Kurve flacht ab."
            : "Modellwerte des ohmschen Widerstands: I wächst proportional zu U.",
          "Spannung U in V",
          "Stromstärke I in mA",
          8,
          400,
          Array.from({ length: 9 }, (_, u) => [u, 1000 * current(u)]),
          [v.u, 1000 * current(v.u)],
        ) +
        readouts(
          [
            "Messpunkt",
            `${quantity(v.u, "V")} · ${quantity(1000 * current(v.u), "mA")}`,
          ],
          ["Widerstand U / I", quantity(v.u / current(v.u), "Ω")],
        ) +
        `<details><summary>Messgeräte im Schaltbild</summary>${circuit(v.u, [v.u / current(v.u)], "series", null, true).replaceAll("lab-svg-", "meter-svg-")}</details>`
      );
    }
    case "reihenschaltung":
      return circuit(6, v.third ? [10, v.r2, 10] : [10, v.r2], "series", null);
    case "parallel-haushalt":
      return circuit(
        6,
        v.mode === 2 ? [20, v.r2, 60] : [20, v.r2],
        "parallel",
        v.mode ? null : 1,
      );
    case "spiegel": {
      const x = 230,
        y = 58;
      const d = Math.min(v.distance * 2.6, 95 / Math.tan(radians(v.angle)));
      const rise = d * Math.tan(radians(v.angle));
      // Exactly one reflection angle is selected. The second ray hits the lot and returns.
      const point: Point = [x, y + rise];
      const object: Point = [x - d, y];
      const image: Point = [x + d, y];
      return diagram(
        "Reflexion am ebenen Spiegel",
        `Das virtuelle Bild entsteht ${v.distance} cm hinter dem Spiegel. Einfalls- und Reflexionswinkel betragen ${v.angle}° zum Lot.`,
        line([x, 20], [x, 207], "blue") +
          label("Spiegel", x + 9, 30, "blue") +
          line([28, point[1]], [420, point[1]], "muted", true) +
          label("Lot", 371, point[1] - 7) +
          arrow(object, point, "gold") +
          arrow(point, [x - d * 0.4, point[1] + rise * 0.4], "gold") +
          arrow(object, [x, y], "green") +
          line([x, y], image, "green", true) +
          line(point, image, "gold", true) +
          dot(...object, "pink", 6) +
          dot(...image, "blue", 6) +
          label("Gegenstand", x - d - 69, y - 12) +
          label("Virtuelles Bild", x + d - 9, y - 12),
      );
    }
    case "brechung":
      return refraction(
        v.angle,
        [
          [1, 1.33],
          [1.33, 1],
          [1, 1.5],
        ][v.medium] as [number, number],
        ["Luft → Wasser", "Wasser → Luft", "Luft → Glas"][v.medium],
      );
    case "totalreflexion": {
      const pair = [
        [1.5, 1],
        [1, 1.5],
        [1.5, 1.45],
      ][v.medium] as [number, number];
      const limit =
        pair[0] > pair[1]
          ? (Math.asin(pair[1] / pair[0]) * 180) / Math.PI
          : null;
      return (
        refraction(
          v.angle,
          pair,
          ["Glas → Luft", "Luft → Glas", "Faserkern → Mantel"][v.medium],
        ) +
        (v.medium === 2 && ray(v.angle, ...pair) === null
          ? diagram(
              "Lichtweg im Faserkern",
              "Der Strahl wird im Faserkern an beiden Grenzen wiederholt totalreflektiert.",
              `<rect class="ph8-medium" x="23" y="64" width="414" height="98" rx="8"/>` +
                line([23, 84], [437, 84], "blue") +
                line([23, 140], [437, 140], "blue") +
                arrow([32, 121], [126, 84], "gold") +
                arrow([126, 84], [268, 140], "gold") +
                arrow([268, 140], [408, 84], "gold") +
                label("Mantel", 28, 56) +
                label("Kern", 28, 190),
            ).replaceAll("lab-svg-", "fiber-svg-")
          : "") +
        readouts([
          "Grenzwinkel",
          limit === null
            ? "Keiner bei diesem Übergang"
            : `ca. ${fmt(limit, 1)}°`,
        ])
      );
    }
    case "sammellinse":
      return lens(v.g);
    case "auge": {
      const farFocus = [340, 294, 386][v.eye];
      const focus = farFocus + [0, 46, -46][v.glass];
      const light = [64, 101, 138]
        .map((y) => {
          const afterGlass =
            y + [0, (y - 101) * 0.18, (101 - y) * 0.18][v.glass];
          const slope = (101 - afterGlass) / (focus - 232);
          const end = Math.min(
            433,
            232 +
              (slope < 0
                ? (afterGlass - 22) / -slope
                : (180 - afterGlass) / slope),
          );
          return path(
            [
              [19, y],
              [103, y],
              [232, afterGlass],
              [end, afterGlass + slope * (end - 232)],
            ],
            "gold",
          );
        })
        .join("");
      return diagram(
        "Strahlengang im Augenmodell",
        `Der Fokus liegt ${focus === 340 ? "auf" : focus < 340 ? "vor" : "hinter"} der Netzhaut.`,
        `<ellipse class="ph8-medium" cx="280" cy="101" rx="76" ry="71"/>` +
          line([340, 45], [340, 161], "pink") +
          label("Netzhaut", 315, 186, "pink") +
          line([232, 43], [232, 161], "blue") +
          label("Augenlinse", 196, 211) +
          (v.glass
            ? line([103, 48], [103, 153], "green") +
              label("Brillenglas", 69, 186, "green")
            : "") +
          light +
          dot(focus, 101, "blue", 6),
      );
    }
    case "tempo": {
      const spacing = v.speed * v.time;
      const positions = [0, 1, 2, 3, 4].map((i) => 46 + i * spacing * 22);
      return (
        diagram(
          "Stroboskopbilder des Rollers",
          `Zwischen zwei Aufnahmen liegen ${quantity(spacing, "m")} und ${quantity(v.time, "s")}.`,
          arrow([34, 152], [421, 152], "ink") +
            positions
              .map(
                (x, i) =>
                  dot(x, 152, "blue", 6) + label(String(i + 1), x - 4, 132),
              )
              .join("") +
            path(
              [
                [0, 4],
                [0, 0],
                [spacing * 22, 0],
                [spacing * 22, 4],
              ].map(([x, y]) => [46 + x, 172 + y]),
              "green",
            ) +
            label(quantity(spacing, "m"), 46, 198, "green") +
            label("Richtung der Fahrt", 46, 66),
        ) +
        readouts(
          ["Tempo", quantity(v.speed, "m/s")],
          ["Umgerechnet", quantity(v.speed * 3.6, "km/h")],
        )
      );
    }
    case "vektoren":
    case "forschungsauftrag":
      return motion(v.bend, v.speed);
    case "kraftstoss": {
      const change = (2 * v.time) / v.m;
      const dx = [change, 0, -change][v.direction];
      const dy = v.direction === 1 ? change : 0;
      const x = 130,
        y = 166,
        scale = 36;
      const before: Point = [x + 3 * scale, y];
      const end: Point = [before[0] + dx * scale, y - dy * scale];
      return (
        diagram(
          "Vektoraddition beim Stoß",
          `Der Puck startet mit 3 m/s nach rechts. Δv beträgt ${quantity(change, "m/s")} ${["in Fahrtrichtung", "seitwärts", "entgegen der Fahrt"][v.direction]}.`,
          arrow([x, y], before, "blue") +
            arrow(before, end, "gold") +
            arrow([x, y - 6], [end[0], end[1] - 6], "pink") +
            label("v davor", 45, 209, "blue") +
            label("Δv", 180, 209, "gold") +
            label("v danach", 287, 209, "pink"),
        ) +
        readouts(
          ["Kraftbetrag", "2 N"],
          ["Betrag der Änderung", quantity(change, "m/s")],
          ["Betrag danach", quantity(Math.hypot(3 + dx, dy), "m/s")],
        )
      );
    }
    case "beschleunigung": {
      const a = (v.end - 8) / v.time;
      return (
        graph(
          "Geschwindigkeits-Zeit-Diagramm",
          `Start mit 8 m/s, Ende mit ${quantity(v.end, "m/s")}. Die Steigung ist ${quantity(a, "m/s²")}.`,
          "Zeit t in s",
          "Geschwindigkeit v in m/s",
          5,
          12,
          [
            [0, 8],
            [v.time, v.end],
          ],
          [v.time, v.end],
        ) +
        readouts(
          ["Beschleunigung", quantity(a, "m/s²")],
          ["Kraft auf 500 kg", quantity(a * 500, "N")],
        )
      );
    }
    case "gewichtskraft": {
      const g = fallFactor(v.place),
        weight = v.m * g;
      const arrows = [fallFactor(0), fallFactor(1)]
        .map((factor, i) => {
          const x = 121 + 215 * i;
          return (
            `<rect class="ph8-box ph8-blue" x="${x - 30}" y="50" width="60" height="30" rx="6"/>` +
            label(quantity(v.m, "kg"), x - 17, 70) +
            arrow([x, 80], [x, 80 + 1.35 * v.m * factor], "pink") +
            label(
              i ? "Mond" : "Erde",
              x - 18,
              211,
              i === v.place ? "blue" : "muted",
            )
          );
        })
        .join("");
      return (
        diagram(
          "Derselbe Körper auf Erde und Mond",
          "Die Klötze stellen dieselbe Masse dar. Die Länge der Pfeile zeigt die Gewichtskraft im selben Maßstab.",
          arrows,
        ) +
        readouts(
          ["Ortsfaktor am gewählten Ort", quantity(g, "N/kg")],
          ["Gewichtskraft dort", quantity(weight, "N")],
        )
      );
    }
    case "gleichgewicht": {
      const sum = v.drive - v.drag;
      return diagram(
        "Kräftebilanz eines Fahrzeugs",
        sum === 0
          ? "Die resultierende horizontale Kraft ist null. Die Geschwindigkeit bleibt gleich."
          : `Die resultierende horizontale Kraft beträgt ${quantity(Math.abs(sum), "N")} ${sum > 0 ? "nach vorn" : "nach hinten"}.`,
        line([30, 169], [431, 169], "muted") +
          `<rect class="ph8-box ph8-blue" x="185" y="104" width="90" height="42" rx="7"/>` +
          dot(203, 153, "ink", 10) +
          dot(258, 153, "ink", 10) +
          arrow([230, 104], [230 + v.drive * 12, 104], "blue") +
          arrow([230, 104], [230 - v.drag * 12, 104], "pink") +
          arrow([230, 53], [230 + sum * 12, 53], "green") +
          label("Resultierende", 183, 30, "green") +
          label("Widerstand", 35, 205, "pink") +
          label("Antrieb", 351, 205, "blue"),
      );
    }
    case "schiefe-ebene": {
      const a = radians(v.angle),
        x = 230,
        y = 86,
        size = 95;
      const parallel: Point = [
        x - size * Math.sin(a) * Math.cos(a),
        y + size * Math.sin(a) ** 2,
      ];
      const normal: Point = [
        x + size * Math.cos(a) * Math.sin(a),
        y + size * Math.cos(a) ** 2,
      ];
      return (
        diagram(
          "Kräftezerlegung an einer Rampe",
          `Bei ${v.angle}° zeigt eine Komponente hangabwärts und die andere senkrecht in die Unterlage. Die Gewichtskraft beträgt 10 N.`,
          `<g transform="rotate(${-v.angle} 230 86)">${line([126, 101], [333, 101], "ink")}<rect class="ph8-box ph8-blue" x="211" y="71" width="38" height="30" rx="3"/></g>` +
            arrow([x, y], [x, y + size], "pink") +
            arrow([x, y], parallel, "blue") +
            arrow([x, y], normal, "green") +
            line(parallel, [x, y + size], "muted", true) +
            line(normal, [x, y + size], "muted", true) +
            label("Hangabtrieb", 16, 211, "blue") +
            label("Gewichtskraft", 166, 211, "pink") +
            label("Senkrechte Komponente", 309, 211, "green"),
        ) +
        readouts(
          ["Hangabtrieb", quantity(10 * Math.sin(a), "N")],
          ["Senkrechte Komponente", quantity(10 * Math.cos(a), "N")],
        )
      );
    }
    case "feder": {
      const s = extension(v.f, v.hard);
      const points: Point[] = Array.from({ length: 7 }, (_, f) => [
        extension(f, v.hard),
        f,
      ]);
      return (
        graph(
          "Kraft-Dehnungs-Diagramm",
          "Blaue Punkte zeigen Modellmessungen; die graue Linie zeigt die Verlängerung des geraden Abschnitts.",
          "Dehnung Δl in cm",
          "Kraft F in N",
          17,
          6,
          points,
          [s, v.f],
          [
            [0, 0],
            [v.hard ? 6 : 12, 6],
          ],
        ) +
        readouts(
          ["Dehnung", quantity(s, "cm")],
          ["F / Δl", quantity(v.f / s, "N/cm")],
        )
      );
    }
    case "solarmodule": {
      const light = Math.cos(radians(v.angle));
      const limited = light * (1 - v.shade / 100);
      return (
        diagram(
          "Zwei beleuchtete Solarmodule",
          `Einfallswinkel ${v.angle}° zum Lot. Modul 2 ist zu ${v.shade} % beschattet; Verschaltung ${v.parallel ? "parallel" : "in Reihe"}.`,
          [95, 260]
            .map(
              (x, i) =>
                `<g transform="rotate(${-v.angle} ${x + 45} 132)">` +
                `<rect class="ph8-box ph8-blue" x="${x}" y="105" width="90" height="55" rx="3"/>` +
                (i === 1
                  ? `<rect class="ph8-shade" x="${x}" y="106" width="${0.9 * v.shade}" height="53"/>`
                  : "") +
                [1, 2, 3]
                  .map((n) =>
                    line([x + 22.5 * n, 105], [x + 22.5 * n, 160], "blue"),
                  )
                  .join("") +
                "</g>" +
                [15, 45, 75]
                  .map((dx) => arrow([x + dx, 21], [x + dx, 79], "gold"))
                  .join("") +
                label(`Modul ${i + 1}`, x + 18, 207),
            )
            .join(""),
        ) +
        readouts(
          ["Leerlaufspannung (Modell)", v.parallel ? "ca. 3 V" : "ca. 6 V"],
          [
            "Geschätzte Kurzschlussstromstärke",
            quantity(0.3 * (v.parallel ? light + limited : limited), "A"),
          ],
        ) +
        '<p class="small">Vereinfachtes Modell bei Restbeleuchtung: Leerlaufspannung näherungsweise konstant, Kurzschlussstrom abhängig von der Einstrahlung. Beide Grenzwerte treten bei verschiedenen Lasten auf.</p>'
      );
    }
    case "stromquellen": {
      const u = v.cell ? 1.1 : 4.5;
      const r = v.cell ? 8 : 2;
      const i = sourceCurrent(u, r, v.load, v.closed);
      return (
        circuit(u, [r, v.load], "series", v.closed ? null : 0) +
        '<p class="small">R₁ steht für den Innenwiderstand in der Quelle. R₂ ist die äußere Last.</p>' +
        readouts(
          ["Klemmenspannung der Quelle", quantity(u - i * r, "V")],
          ["Stromstärke", quantity(i, "A")],
        )
      );
    }
  }
}

export const controlValue = (
  kind: ModelKind,
  key: string,
  value: number,
): string => {
  const unit = PARAMS[kind].find((p) => p.key === key)?.unit;
  return unit ? quantity(value, unit) : fmt(value);
};

export function renderModelOutput(kind: ModelKind, values: ModelState): string {
  return `<div class="model-output">${modelBody(kind, values)}</div>`;
}

export function renderModel(
  lesson: Lesson,
  reached: string[],
  state: ModelState,
): string {
  const kind = lesson.model!;
  const v = modelValues(kind, state);
  const goals = MODEL_SCENARIOS[kind];
  return `<section class="panel exploration"><div class="panel-heading"><span class="eyebrow">MODELLLABOR</span><span class="done-mark" role="status">${reached.length} / ${goals.length} Ziele</span></div>
  <h2>Verändern und beobachten</h2><ul class="lab-goals">${goals
    .map(
      (goal) =>
        `<li>${reached.includes(goal.id) ? "✓ Erreicht" : "○ Offen"} · ${esc(goal.label)}</li>`,
    )
    .join("")}</ul>
  <div class="model-controls">${PARAMS[kind]
    .map((p) =>
      p.options
        ? `<fieldset class="control"><legend>${esc(p.label)}</legend><div class="segmented">${p.options
            .map(
              (option, i) =>
                `<button type="button" data-model-choice="${p.key}" data-value="${i}" aria-pressed="${v[p.key] === i}">${esc(option)}</button>`,
            )
            .join("")}</div></fieldset>`
        : `<label class="control"><span class="control-head"><span>${esc(p.label)}</span><output data-value-for="${p.key}">${esc(controlValue(kind, p.key, v[p.key]))}</output></span><input type="range" data-model-range="${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${v[p.key]}"></label>`,
    )
    .join("")}</div>
  ${renderModelOutput(kind, v)}</section>`;
}
