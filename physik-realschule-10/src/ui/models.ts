import { fmt } from "../exercises/format";
import type { Lesson, ModelKind } from "../model/types";
import {
  applyScenario,
  circuit,
  collision,
  daughter,
  decaySample,
  induction,
  initialModelState,
  MODEL_SCENARIOS,
  type ModelState,
  modelReady,
  modelValues,
  motion,
  PARAMS,
  plant,
  remaining,
  storage,
  transformer,
} from "../models";
import { esc } from "../workshop";

export { applyScenario, initialModelState, type ModelState };

const table = (heads: string[], rows: (string | number)[][], caption: string) =>
  `<div class="table-scroll"><table><caption>${esc(caption)}</caption><thead><tr>${heads.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((c, i) => `<${i === 0 ? 'th scope="row"' : "td"}>${esc(typeof c === "number" ? fmt(c, 3) : c)}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table></div>`;
function graph(
  points: [number, number][],
  xLabel: string,
  yLabel: string,
): string {
  const maxX = Math.max(1, ...points.map((p) => p[0])),
    maxY = Math.max(1, ...points.map((p) => p[1])),
    minY = Math.min(0, ...points.map((p) => p[1])),
    span = maxY - minY;
  const x = (n: number) => 60 + (550 * n) / maxX,
    y = (n: number) => 210 - (160 * (n - minY)) / span;
  return `<svg class="physics-figure" viewBox="0 0 660 270" role="img" aria-label="${esc(yLabel)} in Abhängigkeit von ${esc(xLabel)}"><path d="M60 40V210H620" class="axis"/><path d="M60 ${y(0)}H620" class="base-link"/><polyline points="${points.map((p) => `${x(p[0])},${y(p[1])}`).join(" ")}" class="data-line"/><text x="60" y="24">${esc(yLabel)} · ${fmt(minY)} bis ${fmt(maxY)}</text><text x="60" y="232">0</text><text x="610" y="232" text-anchor="end">${fmt(maxX)}</text><text x="300" y="260">${esc(xLabel)}</text></svg>`;
}
function circuitDiagram(parallel: boolean): string {
  return `<svg class="physics-figure" viewBox="0 0 660 210" role="img" aria-label="${parallel ? "Parallelschaltung mit zwei Zweigen" : "Reihenschaltung mit zwei Widerständen"}"><path class="axis" d="M80 95V50H580V190H80V145"/><circle class="nucleus" cx="80" cy="120" r="25"/><text x="80" y="128" text-anchor="middle">U</text>${parallel ? '<path class="axis" d="M200 50V110H500V50"/><rect class="nucleus" x="270" y="35" width="140" height="30"/><rect class="nucleus" x="270" y="95" width="140" height="30"/><text x="340" y="57" text-anchor="middle">R₁</text><text x="340" y="117" text-anchor="middle">R₂</text>' : '<rect class="nucleus" x="180" y="35" width="130" height="30"/><rect class="nucleus" x="390" y="35" width="130" height="30"/><text x="245" y="57" text-anchor="middle">R₁</text><text x="455" y="57" text-anchor="middle">R₂</text>'}</svg>`;
}
function modelBody(kind: ModelKind, v: Record<string, number>): string {
  switch (kind) {
    case "motion": {
      const rows = Array.from({ length: 11 }, (_, t) => ({
        t,
        ...motion(v.v0, v.a, t),
      }));
      return (
        graph(
          rows.map((r) => [r.t, r.x]),
          "Zeit in s",
          "Ort in m",
        ) +
        table(
          ["Zeit in s", "Ort in m", "Geschwindigkeit in m/s"],
          rows.filter((r) => r.t % 2 === 0).map((r) => [r.t, r.x, r.v]),
          "Bewegung ab Startort null",
        ) +
        `<p>Bei ${fmt(v.t)} s: Ort <strong>${fmt(motion(v.v0, v.a, v.t).x)} m</strong>, Geschwindigkeit <strong>${fmt(motion(v.v0, v.a, v.t).v)} m/s</strong>.</p><p class="small">Eindimensionales Modell mit konstanter Beschleunigung, ohne Luft- oder Rollwiderstand. Die Achsenskalierung passt sich an; zum Vergleich die Zahlen mitlesen.</p>`
      );
    }
    case "collision": {
      const r = collision(v.m1, v.m2, v.v1, v.v2, v.e);
      return (
        table(
          ["Größe", "Vorher", "Nachher"],
          [
            ["v₁ in m/s", v.v1, r.v1],
            ["v₂ in m/s", v.v2, r.v2],
            ["Gesamtimpuls in kg·m/s", r.pBefore, r.pAfter],
            ["Kinetische Energie in J", r.eBefore, r.eAfter],
          ],
          "Zentraler Stoß · positive Richtung nach rechts",
        ) +
        `<p>Umgewandelte kinetische Energie: <strong>${fmt(r.eBefore - r.eAfter)} J</strong>.</p><p class="small">Isoliertes eindimensionales System. e = 1: elastisch; 0 &lt; e &lt; 1: teilelastisch; e = 0: gemeinsame Endgeschwindigkeit. Der zeitliche Kontaktverlauf ist nicht modelliert.</p>`
      );
    }
    case "circuit": {
      const r = circuit(v.u, v.r1, v.r2, v.parallel === 1);
      return (
        circuitDiagram(v.parallel === 1) +
        table(
          ["Größe", "Wert"],
          [
            ["Gesamtwiderstand in Ω", r.r],
            ["Gesamtstrom in A", r.i],
            ["Spannung 1 in V", r.u1],
            ["Spannung 2 in V", r.u2],
            ["Strom 1 in A", r.i1],
            ["Strom 2 in A", r.i2],
          ],
          "Ideale Quelle und ohmsche Widerstände",
        ) +
        '<p class="small">Leitungen haben hier keinen Widerstand, die Quelle keinen Innenwiderstand. Die Bauteile erwärmen sich im Modell nicht. Eine reale Messung kann davon abweichen.</p>'
      );
    }
    case "induction": {
      const r = induction(v.n, v.area, v.db, v.dt, v.closed === 1);
      return (
        table(
          ["Größe", "Wert"],
          [
            ["Flussänderung pro Windung in Wb", v.area * v.db],
            ["Induktionsspannung in V", r.u],
            ["Induktionsstrom bei 100 Ω in A", r.i],
          ],
          "Fest ausgerichtete Fläche · gleichmäßige Feldänderung",
        ) +
        `<p>${v.db === 0 ? "Unveränderter Fluss: keine dauerhafte Induktionsspannung." : v.closed ? "Geschlossener Kreis: Induktionsstrom mit Gegenwirkung gemäß Lenz." : "Offener Kreis: Spannung vorhanden, kein geschlossener Induktionsstrom."}</p><p class="small">Fest gewählte Fluss- und Umlauforientierung: U = −N · Fläche · Feldänderung / Zeit. Das Vorzeichen folgt dieser Orientierung; diese Modellrechnung vertieft die qualitativ geforderte Lehrplanbeziehung. Widerstand konstant 100 Ω, Selbstinduktion vernachlässigt.</p>`
      );
    }
    case "generator": {
      const u = v.peak * Math.sin(2 * Math.PI * v.f * v.t),
        power = v.loaded ? v.peak ** 2 / 20 : 0;
      return (
        graph(
          Array.from({ length: 81 }, (_, i) => {
            const t = i / (40 * v.f);
            return [t, v.peak * Math.sin(2 * Math.PI * v.f * t)];
          }),
          "Zeit in s",
          "Spannung in V",
        ) +
        table(
          ["Größe", "Wert"],
          [
            ["Momentanspannung in V", u],
            ["Periodendauer in s", 1 / v.f],
            ["Mittlere elektrische Lastleistung in W", power],
          ],
          "Idealer Sinusgenerator",
        ) +
        `<p>${v.loaded ? "Die mechanische Antriebsleistung muss mindestens die elektrische Lastleistung decken." : "Offene Last: Spannung vorhanden, keine elektrische Lastleistung."}</p><p class="small">Der Antrieb hält die vorgegebenen Kurvenwerte trotz Last konstant. Reale Leerlaufverluste sind nicht enthalten. Die Grafik zeigt zwei Perioden; die Zeitachse skaliert mit der Frequenz.</p>`
      );
    }
    case "transformer": {
      const r = transformer(v.n1, v.n2, v.u1, v.r, v.eta);
      return (
        table(
          ["Größe", "Wert"],
          [
            ["Sekundärspannung in V", r.u2],
            ["Sekundärstrom in A", r.i2],
            ["Primärstrom in A", r.i1],
            ["Abgegebene Leistung in W", r.p2],
            ["Zugeführte Leistung in W", r.p1],
            ["Verlustleistung in W", r.loss],
          ],
          "Transformator an ohmscher Last",
        ) +
        '<p class="small">Wechselspannungen als Effektivwerte. Das Windungsverhältnis gibt hier auch unter Last die angenäherte Spannung vor; innere Spannungsabfälle sind nicht modelliert. Der Wirkungsgrad ergänzt nur die Leistungsbilanz. Die exakte inverse Stromübersetzung gilt bei 100 %.</p>'
      );
    }
    case "decay": {
      const expected = remaining(v.n0, v.t, v.half),
        sample = decaySample(v.n0, 6);
      return (
        graph(
          Array.from({ length: 41 }, (_, i) => [i, remaining(v.n0, i, v.half)]),
          "Zeit in h",
          "Erwartete Kernanzahl",
        ) +
        `<p>Nach ${fmt(v.t)} h: <strong>${fmt(expected)} Kerne im statistischen Mittel</strong>.</p>` +
        table(
          [
            "Halbwertszeiten",
            "Erwartungswert",
            "Ein diskreter Zufallsdurchlauf",
          ],
          sample.map((n, i) => [i, v.n0 / 2 ** i, n]),
          "Vergleich mit einer Münzanalogie · fester reproduzierbarer Zufallsstart",
        ) +
        '<p class="small">Die glatte Kurve ist ein kontinuierlicher Erwartungswert. Die Zufallsspalte ist ein einzelnes diskretes Halbierungsmodell, keine Vorhersage echter Zerfallszeitpunkte. Keine Nachlieferung und kein Zerfall von Tochterkernen berücksichtigt.</p>'
      );
    }
    case "nucleus": {
      const r = daughter(v.a, v.z, v.mode),
        names = ["Alpha", "Beta-Minus", "Gamma"];
      return (
        table(
          ["Bilanz", "Vorher", "Nachher"],
          [
            ["Massenzahl A", v.a, r.a],
            ["Protonenzahl Z", v.z, r.z],
            ["Neutronenzahl A − Z", v.a - v.z, r.a - r.z],
          ],
          `${names[v.mode]} · Kernzahlenbilanz`,
        ) +
        `<p>${v.mode === 0 ? "Ein Helium-4-Kern wird emittiert." : v.mode === 1 ? "Ein Neutron wird zum Proton; Elektron und Elektron-Antineutrino werden emittiert." : "Der angeregte Kern gibt ein Gammaquant ab; A und Z bleiben unverändert."}</p><p class="small">Bekannte Beispielumwandlungen, keine maßstäbliche Darstellung, keine Berechnung von Lebensdauer oder Übergangswahrscheinlichkeit. Weitere Zerfallszweige sind nicht enthalten.</p>`
      );
    }
    case "plant": {
      const r = plant(v.input, v.electric, v.recovery);
      const bar = (label: string, n: number, color: string) =>
        `<div class="energy-row"><span>${label}</span><span class="energy-bar" style="--bar:${(100 * n) / v.input}%;--bar-color:${color}"></span><strong>${fmt(n)} kWh</strong></div>`;
      return `<div class="energy-flow" role="img" aria-label="Energiebilanz: ${fmt(r.el)} Kilowattstunden Strom, ${fmt(r.heat)} genutzte Wärme und ${fmt(r.loss)} ungenutzte Abgabe">${bar("Strom", r.el, "var(--accent)")}${bar("Genutzte Wärme", r.heat, "#cc892f")}${bar("Abgabe", r.loss, "var(--muted)")}</div><p>Elektrischer Wirkungsgrad: <strong>${v.electric} %</strong>. Gesamtnutzungsgrad: <strong>${fmt((100 * r.useful) / v.input)} %</strong>.</p><p class="small">Frei gewählte Bilanzwerte eines Wärmekraftwerks, keine realen Kraftwerksdaten. Wärmenutzung verändert hier nur den genutzten Anteil, nicht den elektrischen Prozess. Die gesamte Eingangsenergie bleibt bilanziert.</p>`;
    }
    case "storage": {
      const r = storage(v.input, v.eta, v.power, v.maxPower);
      return (
        table(
          ["Größe", "Wert"],
          [
            ["Zurückgewonnene Energie in kWh", r.energy],
            ["Nicht zurückgewonnene Energie in kWh", r.loss],
            ["Maximale Leistung in kW", v.maxPower],
          ],
          "Frei gewählte Speicherbilanz",
        ) +
        `<p>${r.hours === null ? "Die verlangte Leistung überschreitet die Abgabegrenze. Diese Last ist so nicht versorgbar." : `Bei ${v.power} kW reicht die Energie ideal <strong>${fmt(r.hours)} h</strong>.`}</p><p class="small">Gesamteffizienz der Ladungs- und Entladungskette; kein zusätzliches erneutes Multiplizieren beim Entladen. Alterung, Ladezustandsgrenzen und Selbstentladung sind nicht modelliert. Werte sind keine Produktempfehlung.</p>`
      );
    }
  }
}
export function renderModel(
  lesson: Lesson,
  seen: string[],
  state: ModelState,
): string {
  const kind = lesson.model!,
    v = modelValues(kind, state);
  return `<section class="panel exploration"><div class="panel-heading"><span class="eyebrow">MODELLLABOR</span><span>${modelReady(kind, seen) ? "✓ Vergleiche geöffnet" : `${seen.length} / ${MODEL_SCENARIOS[kind].length} Vergleiche geöffnet`}</span></div><h2>Verändern, vergleichen, erklären</h2><p>Öffne die Vergleichssituationen. Verändere danach eine Größe und begründe die Wirkung. Geöffnete Vergleiche sind noch kein Verständnisnachweis.</p><div class="scenario-buttons">${MODEL_SCENARIOS[kind].map((s) => `<button type="button" class="button secondary" data-scenario="${s.id}" aria-pressed="${state.selected === s.id}">${seen.includes(s.id) ? "✓ " : ""}${esc(s.label)}</button>`).join("")}</div><div class="model-controls">${PARAMS[kind].map((p) => `<label>${esc(p.label)}: ${fmt(v[p.key])} ${esc(p.unit)}<input type="range" data-model-range="${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${v[p.key]}"></label>`).join("")}</div>${modelBody(kind, v)}</section>`;
}
