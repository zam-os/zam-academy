import { fmt } from "../exercises/format";
import type { Lesson, ModelKind } from "../model/types";
import {
  applyScenario,
  atomCharge,
  BUILD_MATERIALS,
  bodyColour,
  CLOTHING,
  circuit,
  COLOUR_NAMES,
  clipsHeld,
  coil,
  colouredShadows,
  compareMaterials,
  compass,
  density,
  eclipse,
  GAP_MATERIALS,
  initialModelState,
  irradiation,
  MATERIALS,
  MODEL_SCENARIOS,
  type ModelState,
  measurement,
  modelReady,
  modelValues,
  moonPhase,
  ordering,
  PARAMS,
  penumbra,
  poles,
  RUB_PAIRS,
  rubbing,
  SCREEN,
  seeing,
  shadowSize,
  STOPPING_50,
  switching,
  TABLE,
  visibility,
} from "../models";
import { esc } from "../workshop";
import { renderFigure } from "./figures";

export { applyScenario, initialModelState, type ModelState };

const table = (heads: string[], rows: (string | number)[][], caption: string, mark = -1) =>
  `<div class="table-scroll"><table><caption>${esc(caption)}</caption><thead><tr>${heads.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row, r) => `<tr${r === mark ? ' class="current"' : ""}>${row.map((c, i) => `<${i === 0 ? 'th scope="row"' : "td"}>${esc(typeof c === "number" ? fmt(c, 2) : c)}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/** Single values as tiles: the name of the quantity above, its value below. */
const kv = (rows: (string | number)[][], caption: string) =>
  `<div class="readouts"><p class="readout-caption">${esc(caption)}</p><dl>${rows.map(([label, value]) => `<div><dt>${esc(String(label))}</dt><dd>${esc(typeof value === "number" ? fmt(value, 2) : value)}</dd></div>`).join("")}</dl></div>`;
const note = (content: string) => `<p class="small model-note">${esc(content)}</p>`;
const verdict = (content: string) => `<p><strong>${esc(content)}</strong></p>`;
const yes = (value: boolean) => (value ? "ja" : "nein");

function modelBody(kind: ModelKind, v: Record<string, number>): string {
  switch (kind) {
    case "einstrahlung": {
      const r = irradiation(v.h);
      return (
        kv(
          [
            ["Winkel zur Fläche", `${fmt(v.h)}°`],
            ["Länge des Flecks im Vergleich zu 90°", `${fmt(r.area, 2)}-fach`],
            ["Licht je Fläche im Vergleich zu 90°", `${fmt(100 * r.share, 0)} %`],
          ],
          "Modellversuch Taschenlampe",
        ) +
        verdict(v.h >= 60 ? "Steiler Einfall: kleiner, heller Fleck." : v.h >= 30 ? "Mittlerer Einfall: Der Fleck wird länger und dunkler." : "Flacher Einfall: Das Licht verteilt sich auf eine große Fläche.") +
        note("Paralleles Lichtbündel gleicher Breite; die Werte beziehen sich auf senkrechten Einfall. So wie hier verteilt sich auch das Sonnenlicht bei tiefer Sonne.")
      );
    }
    case "pole": {
      const r = poles(v.like, v.d, v.between);
      return (
        kv(
          [
            ["Gegenüberliegende Pole", v.like ? "Nordpol – Nordpol" : "Nordpol – Südpol"],
            ["Wirkung", r.kind],
            ["Stärke (Modellwert, 1 cm ohne Zwischenschicht = 100)", fmt(r.strength, 1)],
          ],
          "Zwei Stabmagnete",
        ) +
        note("Modellwerte: Die Wirkung nimmt mit dem Abstand stark ab. Papier und Holz lassen die magnetische Wirkung durch, ein Eisenblech schirmt sie fast ganz ab.")
      );
    }
    case "elementar": {
      const order = ordering(v.material, v.strokes, v.treat);
      return (
        kv(
          [
            ["Geordnete Elementarmagnete", v.material === 1 ? "keine vorhanden" : `${fmt(100 * order, 0)} %`],
            ["Gehaltene Büroklammern (Modellwert)", clipsHeld(order, v.split)],
            ["Pole", order > 0.3 ? (v.split ? "zwei Magnete, je Nord- und Südpol" : "Nordpol rechts, Südpol links") : "kaum Magnetwirkung"],
          ],
          v.material === 1 ? "Kupferdraht" : "Stahlnadel",
        ) +
        note("Modell: Jeder Strich ordnet einen Teil der noch ungeordneten Elementarmagnete. Kräftige Schläge bringen den größten Teil, starkes Erhitzen die ganze Ordnung durcheinander.")
      );
    }
    case "kompass": {
      const r = compass(v.rot, v.target);
      return (
        kv(
          [
            ["Karte eingenordet", yes(r.oriented)],
            ["Abweichung der Karte von Norden", `${fmt(r.offset)}°`],
            [`Richtung zum Ziel ${r.name} im Gelände`, `${r.direction} (${fmt(r.bearing)}°)`],
          ],
          "Karte und Kompass",
        ) +
        verdict(r.oriented ? "Die Richtung auf der Karte stimmt mit der Richtung im Gelände überein." : "Die Karte ist verdreht: Wer jetzt der Richtung auf der Karte folgt, läuft falsch.") +
        note("Die Abweichung zwischen magnetischem und geographischem Norden beträgt in Bayern nur wenige Grad und ist hier nicht eingezeichnet.")
      );
    }
    case "dichte": {
      const r = density(v.material, v.V);
      return (
        kv(
          [
            ["Volumen V", `${fmt(v.V)} cm³`],
            ["Masse m", `${fmt(r.mass, 1)} g`],
            ["Dichte ρ = m / V", `${fmt(r.rho, 2)} g/cm³`],
          ],
          r.name,
        ) +
        table(
          ["Stoff", "Dichte in g/cm³"],
          MATERIALS.map((m) => [m.name, m.range ? `${fmt(m.range[0], 1)} bis ${fmt(m.range[1], 1)}` : fmt(m.rho, 2)]),
          "Dichten einiger Stoffe (gerundet, nach OpenStax)",
          v.material,
        ) +
        note("Verändere das Volumen: Die Masse wächst mit, die Dichte bleibt gleich. Holz hat je nach Sorte und Feuchte verschiedene Dichten.")
      );
    }
    case "messzylinder": {
      const r = measurement(v.sample, v.scale);
      return (
        kv(
          [
            ["Masse (Waage)", `${fmt(r.mass, 1)} g`],
            ["V₁ vorher", `${r.v1} ml`],
            ["V₂ abgelesen", `${r.v2} ml`],
            ["Volumen V = V₂ − V₁", `${r.volume} cm³ ± ${fmt(r.step / 2, 1)} cm³`],
            ["Dichte aus den Ablesewerten", `${fmt(r.rho, 2)} g/cm³`],
            ["Möglicher Bereich", `${fmt(r.rhoMin, 2)} bis ${fmt(r.rhoMax, 2)} g/cm³`],
          ],
          `${r.name} im Messzylinder`,
        ) +
        table(
          ["Stoff", "Dichte in g/cm³", "passt zum Bereich"],
          TABLE.map((t) => [t.name, t.range ? `${fmt(t.range[0], 1)} bis ${fmt(t.range[1], 1)}` : fmt(t.rho, 2), yes(r.matches.includes(t.name))]),
          "Vergleich mit der Dichtetabelle",
        ) +
        verdict(r.matches.length === 1 ? `Eindeutig: ${r.matches[0]}.` : r.matches.length === 0 ? "Kein Stoff der Tabelle passt." : `Nicht eindeutig: ${r.matches.join(", ")} passen.`) +
        note("Annahme: Das Wasser steht vorher genau auf der 50-ml-Marke; der zweite Wasserstand wird auf den nächsten Teilstrich gerundet und kann um einen halben Teilstrich danebenliegen.")
      );
    }
    case "werkstoff": {
      const r = compareMaterials(v.a, v.b, v.V),
        a = BUILD_MATERIALS[v.a],
        b = BUILD_MATERIALS[v.b];
      return (
        kv(
          [
            [`Masse aus ${a.name} (${fmt(a.rho, 1)} g/cm³)`, `${fmt(r.ma, 2)} kg`],
            [`Masse aus ${b.name} (${fmt(b.rho, 1)} g/cm³)`, `${fmt(r.mb, 2)} kg`],
            ["Unterschied", `${fmt(Math.abs(r.difference), 2)} kg`],
          ],
          `Gleiches Materialvolumen: ${fmt(v.V)} cm³`,
        ) +
        note("Nur die Dichte ist berücksichtigt. Leichte Werkstoffe brauchen oft dickere Wände, um gleich fest zu sein; Preis, Aussehen und Wiederverwertung sind außerfachliche Kriterien.")
      );
    }
    case "sehen": {
      const r = seeing(v.lamp, v.wall1, v.wall2);
      return (
        kv(
          [
            ["Licht erreicht das Buch", yes(r.lit)],
            ["Licht vom Buch erreicht das Auge", yes(r.seesBook)],
            ["Die Lampe selbst ist zu sehen", yes(r.seesLamp)],
          ],
          "Der Weg des Lichts",
        ) +
        verdict(r.seesBook ? "Das Auge sieht das Buch." : "Das Auge sieht das Buch nicht.") +
        note("Lichtstrahlen sind ein Modell. Das Buch wirft das Licht in alle Richtungen zurück; gezeichnet ist nur der Strahl, der zum Auge führt.")
      );
    }
    case "farbe": {
      const r = bodyColour(v.light, v.object);
      return (
        kv(
          [
            ["Licht", COLOUR_NAMES[r.incoming]],
            ["Gegenstand im weißen Licht", COLOUR_NAMES[r.reflects]],
            ["reflektiert", r.seen ? COLOUR_NAMES[r.seen] : "nichts"],
            ["absorbiert", r.absorbed ? COLOUR_NAMES[r.absorbed] : "nichts"],
          ],
          "Reflexion und Absorption",
        ) +
        verdict(`Der Gegenstand erscheint ${r.name}.`) +
        note("Vereinfachtes Modell mit drei Anteilen Rot, Grün und Blau. Echte Farbstoffe reflektieren meist von allen Farben ein wenig.")
      );
    }
    case "farbschatten": {
      const r = colouredShadows(v.r, v.g, v.b),
        lampName: Record<number, string> = { 1: "rote", 2: "grüne", 4: "blaue" };
      return (
        table(
          ["Ort", "kommt an", "erscheint"],
          [
            ["Wand", COLOUR_NAMES[r.wall], COLOUR_NAMES[r.wall]],
            ...r.shadows.map((s) => [`Schatten der ${lampName[s.lamp]}n Lampe`, s.colour ? COLOUR_NAMES[s.colour] : "kein Licht", COLOUR_NAMES[s.colour]]),
          ],
          "Additive Farbmischung auf der weißen Wand",
        ) +
        note("Jeder Schatten bekommt das Licht aller anderen eingeschalteten Lampen. Er liegt auf der Seite, die seiner Lampe gegenüberliegt.")
      );
    }
    case "schatten": {
      const r = shadowSize(v.a, v.g);
      return (
        kv(
          [
            ["Abstand Lampe – Gegenstand", `${fmt(v.a)} cm`],
            ["Abstand Lampe – Schirm", `${SCREEN} cm`],
            ["Größe des Gegenstands", `${fmt(v.g)} cm`],
            ["Größe des Schattens", `${fmt(r.size, 1)} cm`],
          ],
          "Schatten einer kleinen Lampe",
        ) +
        verdict(`Der Schatten ist ${fmt(r.factor, 2)}-mal so groß wie der Gegenstand.`) +
        note("Der Schatten ist so viel größer, wie der Weg von der Lampe zum Schirm länger ist als der Weg zum Gegenstand.")
      );
    }
    case "halbschatten": {
      const r = penumbra(v.d, v.a),
        extended = v.source === 1;
      return (
        kv(
          [
            ["Schatten einer einzelnen Lampe", `${fmt(r.each, 1)} cm`],
            ["Kernschatten", r.core > 0 ? `${fmt(r.core, 1)} cm` : "keiner"],
            [extended ? "Übergangsschatten je Seite" : "Halbschatten je Seite", `${fmt(r.half, 1)} cm`],
            ["Ganzer Schattenbereich", `${fmt(r.total, 1)} cm`],
          ],
          extended ? "Ausgedehnte Leuchte" : "Zwei kleine Lampen",
        ) +
        (r.gap > 0 ? verdict("Die beiden Schatten haben sich getrennt: Dazwischen ist der Schirm wieder hell.") : "") +
        note(`Gegenstand ${OBJECT_WIDTH_TEXT} breit, Schirm ${SCREEN} cm von den Lampen entfernt. Bei der ausgedehnten Leuchte wird es vom Kernschatten nach außen allmählich heller.`)
      );
    }
    case "mondphasen": {
      const r = moonPhase(v.theta);
      return (
        kv(
          [
            ["Mondphase", r.name],
            ["Beleuchteter Teil der Scheibe", `${fmt(100 * r.lit, 0)} %`],
            ["Tage nach Neumond", `etwa ${fmt(r.days, 1)}`],
            ["Beleuchtete Seite, von Bayern aus gesehen", r.lit === 0 ? "keine" : r.lit === 1 ? "ganze Scheibe" : r.waxing ? "rechts" : "links"],
          ],
          "Mond auf seiner Bahn",
        ) +
        note("Draufsicht, nicht maßstäblich: In Wirklichkeit ist der Mond etwa 30 Erddurchmesser entfernt. Die Sonne beleuchtet immer die ihr zugewandte Hälfte.")
      );
    }
    case "finsternis": {
      const r = eclipse(v.full, v.offset);
      return (
        kv(
          [
            ["Stellung", v.full ? "Vollmond: Erde zwischen Sonne und Mond" : "Neumond: Mond zwischen Sonne und Erde"],
            ["Ergebnis", r.kind],
            ["Wo zu sehen", r.where],
          ],
          "Finsternis oder nicht?",
        ) +
        note("Schematische Seitenansicht in der Nähe eines Schnittpunkts von Mondbahn und Erdbahnebene, nicht maßstäblich. Abstände von der Ebene in Monddurchmessern; die Mondbahn ist etwa 5° geneigt.")
      );
    }
    case "sichtbarkeit": {
      const r = visibility(v.cloth, v.dist);
      return (
        kv(
          [
            ["Kleidung", CLOTHING[v.cloth].name],
            ["Erkennbar ab", `${r.range} m`],
            ["Anhalteweg aus 50 km/h", `${STOPPING_50} m`],
            ["Fahrerin erkennt die Person", yes(r.seen)],
          ],
          "Nachts am Straßenrand",
        ) +
        verdict(r.inTime ? "Mit dieser Kleidung reicht die Erkennungsweite für eine Notbremsung aus 50 km/h." : "Mit dieser Kleidung reicht die Erkennungsweite nicht für eine Notbremsung aus 50 km/h.") +
        note("Richtwerte für Dunkelheit und schlechte Sicht nach ADAC (dunkel 25 m, Reflektoren bis 140 m, Anhalteweg 28 m) und Stadt Zürich (hell 40 m). Wetter, Licht und Aufmerksamkeit verändern sie.")
      );
    }
    case "atom": {
      const r = atomCharge(v.element, v.e);
      return (
        kv(
          [
            ["Protonen im Kern", r.protons],
            ["Elektronen in der Hülle", v.e],
            ["Ladung", r.charge === 0 ? "0" : `${r.charge > 0 ? "+" : "−"}${Math.abs(r.charge)}`],
          ],
          "Kern-Hülle-Modell",
        ) +
        verdict(`Das Teilchen ist ${r.state}.`) +
        note("Nicht maßstäblich: Wäre der Kern so groß wie ein Stecknadelkopf, wäre die Hülle so groß wie ein Fußballstadion.")
      );
    }
    case "reiben": {
      const r = rubbing(v.pair, v.rubs, v.test),
        pair = RUB_PAIRS[v.pair];
      return (
        kv(
          [
            ["Übertragene Elektronen (Modellwert)", r.moved],
            [pair.body, r.body === 0 ? "neutral" : r.body < 0 ? "negativ" : "positiv"],
            [pair.cloth, r.cloth === 0 ? "neutral" : r.cloth < 0 ? "negativ" : "positiv"],
            ["Wirkung auf den angenäherten Körper", r.effect],
          ],
          "Reibungselektrizität",
        ) +
        note("In Wirklichkeit gehen sehr viel mehr Elektronen über; die Zahl ist ein Modellwert. Welcher Körper Elektronen aufnimmt, hängt von den beiden Stoffen ab.")
      );
    }
    case "stromkreis": {
      const r = circuit(v.switch, v.gap);
      return (
        kv(
          [
            ["Schalter", v.switch ? "geschlossen" : "offen"],
            ["Prüfstrecke", `${GAP_MATERIALS[v.gap].name}: ${r.conducts ? "Leiter" : "Isolator"}`],
            ["Stromkreis geschlossen", yes(r.flowing)],
            ["Lampe leuchtet", yes(r.flowing)],
          ],
          "Einfacher Stromkreis",
        ) +
        note("Die Elektronen sind schon in allen Leitungen. Fließt Strom, bewegen sie sich vom Minuspol durch Prüfstrecke und Lampe zum Pluspol; in der Animation stark vergrößert und beschleunigt.")
      );
    }
    case "spule": {
      const r = coil(v.on, v.dir, v.n, v.core);
      return (
        kv(
          [
            ["Magnetische Wirkung", yes(r.magnetic)],
            ["Rechtes Ende der Spule", r.rightPole],
            ["Gehaltene Nägel (Modellwert)", r.nails],
          ],
          "Elektromagnet",
        ) +
        note("Modellwerte zum Vergleichen: Mehr Windungen verstärken die Wirkung, ein Eisenkern verstärkt sie viel mehr. Umpolen vertauscht Nord- und Südpol.")
      );
    }
    case "schaltung": {
      const names = ["UND-Schaltung (Reihe)", "ODER-Schaltung (parallel)", "Wechselschaltung"],
        row = v.a * 2 + v.b;
      return (
        table(
          ["A", "B", "Lampe"],
          [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ].map(([a, b]) => [String(a), String(b), switching(v.type, a, b) ? "an" : "aus"]),
          `Schaltertabelle: ${names[v.type]}`,
          row,
        ) +
        verdict(`Lampe ${switching(v.type, v.a, v.b) ? "an" : "aus"}.`) +
        note(v.type === 2 ? "Bei der Wechselschaltung bedeutet 1 „Hebel oben“ und 0 „Hebel unten“. Jedes Umlegen ändert den Zustand der Lampe." : "1 bedeutet geschlossen, 0 offen.")
      );
    }
  }
}
const OBJECT_WIDTH_TEXT = "6 cm";
/** Figure and readouts: the part of the lab that follows the controls. */
export function renderModelOutput(kind: ModelKind, v: Record<string, number>, playing = false): string {
  return `<div class="model-output">${renderFigure(kind, v, playing)}${modelBody(kind, v)}</div>`;
}
/** The value of a slider the way its label shows it. */
export const controlValue = (kind: ModelKind, key: string, value: number) => {
  const param = PARAMS[kind].find((x) => x.key === key);
  return `${fmt(value, 2)}${param?.unit ? ` ${param.unit}` : ""}`;
};
export function renderModel(lesson: Lesson, seen: string[], state: ModelState, playing = false): string {
  const kind = lesson.model!,
    v = modelValues(kind, state);
  return `<section class="panel exploration"><div class="panel-heading"><span class="eyebrow">MODELLLABOR</span><span class="done-mark">${modelReady(kind, seen) ? "✓ Vergleiche geöffnet" : `${seen.length} / ${MODEL_SCENARIOS[kind].length} Vergleiche geöffnet`}</span></div><h2>Verändern, vergleichen, erklären</h2><p>Öffne die Vergleichssituationen. Verändere danach selbst eine Einstellung und erkläre die Wirkung. Geöffnete Vergleiche sind noch kein Verständnisnachweis.</p><div class="scenario-buttons">${MODEL_SCENARIOS[kind].map((sc) => `<button type="button" class="button secondary${seen.includes(sc.id) ? " seen" : ""}" data-scenario="${sc.id}" aria-pressed="${state.selected === sc.id}">${seen.includes(sc.id) ? "✓ " : ""}${esc(sc.label)}</button>`).join("")}</div><div class="model-controls">${PARAMS[kind]
    .map((p) =>
      p.options
        ? `<fieldset class="control"><legend>${esc(p.label)}</legend><div class="segmented">${p.options.map((option, i) => `<button type="button" data-model-choice="${p.key}" data-value="${p.min + i * p.step}" aria-pressed="${v[p.key] === p.min + i * p.step}">${esc(option)}</button>`).join("")}</div></fieldset>`
        : `<label class="control"><span class="control-head"><span>${esc(p.label)}</span><output data-value-for="${p.key}">${esc(controlValue(kind, p.key, v[p.key]))}</output></span><input type="range" data-model-range="${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${v[p.key]}"></label>`,
    )
    .join("")}</div>${renderModelOutput(kind, v, playing)}</section>`;
}
