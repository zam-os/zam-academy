import type { Lesson } from "../model/types";
import {
  dihybrid,
  divisionStates,
  dnaComplement,
  ecosystemSeries,
  MODEL_SCENARIOS,
  type ModelState,
  modelReady,
  monohybrid,
  screeningTable,
  translateCodingDNA,
} from "../models";
import { esc } from "../workshop";

export { applyScenario, initialModelState, type ModelState } from "../models";

const percent = (n: number) =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(n);
const table = (head: string[], rows: string[][], caption: string) =>
  `<div class="table-scroll"><table><caption>${esc(caption)}</caption><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, i) => `<${i === 0 ? 'th scope="row"' : "td"}>${esc(cell)}</${i === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</tbody></table></div>`;

function dna(state: ModelState): string {
  const opposite = dnaComplement(state.sequence);
  // dnaComplement trims, so the drawn strand must too or the pairs shift.
  const sequence = state.sequence.trim().toUpperCase();
  const shown = sequence.slice(0, 16);
  return `<label class="model-field">DNA-Folge, angezeigt in 5′–3′-Richtung<input data-model-text="sequence" value="${esc(state.sequence)}" maxlength="60" spellcheck="false" autocapitalize="characters"></label><button type="button" class="button secondary" data-model-update>Basen zuordnen</button>${
    opposite === null
      ? '<p class="feedback hint" role="status">Bitte 1 bis 60 Basen eingeben: nur A, T, G und C.</p>'
      : `<svg class="bio-figure" role="img" aria-label="Vereinfachte komplementäre Basenpaarung mit gegenläufigen Strängen" viewBox="0 0 660 175"><text x="10" y="28">5′</text><text x="10" y="143">3′</text>${[
          ...shown,
        ]
          .map((base, i) => {
            const x = 43 + i * (570 / Math.max(1, shown.length));
            return `<path d="M${x + 12} 62V110" class="base-link"/><rect x="${x}" y="35" width="25" height="28" rx="5" class="base-${base}"/><text x="${x + 12}" y="55" text-anchor="middle">${base}</text><rect x="${x}" y="110" width="25" height="28" rx="5" class="base-${opposite[i]}"/><text x="${x + 12}" y="130" text-anchor="middle">${opposite[i]}</text>`;
          })
          .join(
            "",
          )}<text x="635" y="55">3′</text><text x="635" y="133">5′</text><text x="30" y="169">Schema ohne Maßstab${sequence.length > 16 ? " · erster Ausschnitt mit 16 Basen" : ""}</text></svg><p class="sequence">5′–${esc(sequence)}–3′<br>3′–${esc(opposite)}–5′</p><p>Bei semikonservativer Replikation bekommt jeder alte Strang einen neuen komplementären Partner. Beide neuen Doppelstränge enthalten je einen alten und einen neuen Strang.</p>`
  }`;
}
function division(state: ModelState): string {
  const rows = divisionStates(state.division);
  return `<p>Üblicher diploider menschlicher Ausgangskern. Alle Chromosomen- und Chromatidenzahlen gelten <strong>pro Kern</strong>.</p>${table(
    ["Zustand", "Kernzahl", "Chromosomen", "Chromatiden", "Satz"],
    rows.map((r) => [
      r.label,
      String(r.nuclei),
      String(r.chromosomes),
      String(r.chromatids),
      r.ploidy,
    ]),
    "DNA kopieren und Kerne teilen",
  )}
  <svg class="bio-figure" viewBox="0 0 660 150" role="img" aria-label="Schematische Darstellung der Ergebnis-Kerne"><text x="20" y="30">${state.division === "mitosis" ? "Zwei Tochterkerne · 2n" : "Vier haploide Kernprodukte · 1n"}</text>${Array.from({ length: rows.at(-1)!.nuclei }, (_, i) => `<circle cx="${80 + i * 155}" cy="90" r="42" class="nucleus"/><text x="${80 + i * 155}" y="98" text-anchor="middle">${rows.at(-1)!.chromosomes}</text>`).join("")}</svg><p class="small">Gezeigt sind ausgewählte Zustände, keine maßstäbliche Chromosomenbewegung. Die Befruchtung ist nicht dargestellt. Vier Kernprodukte bedeuten bei der Eizellbildung nicht vier gleichwertige Eizellen; Polkörperchen gehören zur Einordnung.</p>`;
}
function inheritance(state: ModelState): string {
  const select = (key: "parentA" | "parentB", label: string) =>
    `<label>${label}<select data-model-select="${key}" ${state.dihybrid ? "disabled" : ""}>${["AA", "Aa", "aa"].map((value) => `<option ${state[key] === value ? "selected" : ""}>${value}</option>`).join("")}</select></label>`;
  const result = state.dihybrid ? dihybrid() : monohybrid(state.parentA, state.parentB);
  const cols = state.dihybrid ? ["AB", "Ab", "aB", "ab"] : [...state.parentB];
  const rows = state.dihybrid ? ["AB", "Ab", "aB", "ab"] : [...state.parentA];
  return `<div class="model-controls">${select("parentA", "Elternteil 1 (ein Genort)")}${select("parentB", "Elternteil 2 (ein Genort)")}<label><input type="checkbox" id="model-dihybrid" ${state.dihybrid ? "checked" : ""}>Zwei unabhängige Genorte: festes AaBb × AaBb</label></div><div class="table-scroll"><table class="punnett"><caption>${state.dihybrid ? "AaBb × AaBb · 16 gleich wahrscheinliche Felder" : `${state.parentA} × ${state.parentB} · 4 gleich wahrscheinliche Felder`}</caption><thead><tr><th scope="col">Keimzellen</th>${cols.map((g) => `<th scope="col">${g}</th>`).join("")}</tr></thead><tbody>${rows.map((g, r) => `<tr><th scope="row">${g}</th>${cols.map((_, c) => `<td>${result.squares[r * cols.length + c]}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${
    state.dihybrid
      ? `<p>Bei vollständiger Dominanz an beiden Genorten: <strong>9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb</strong>.</p><p class="small">Die vier Keimzelltypen werden gleich wahrscheinlich angenommen. Enge Kopplung, abweichende Dominanz oder andere Auswahlprozesse können das Ergebnis ändern. Die Ein-Gen-Auswahl wirkt erst wieder nach Abschalten dieses Vergleichs.</p>`
      : (
          () => {
            const mono = result as ReturnType<typeof monohybrid>;
            return `<p>Genotypen: <strong>${mono.counts.AA} AA : ${mono.counts.Aa} Aa : ${mono.counts.aa} aa</strong>.<br>Bei vollständiger Dominanz: ${mono.dominant} dominant : ${mono.recessive} rezessiv.</p><p class="small">Ein Feld entspricht 25 % Modellwahrscheinlichkeit. Das ist keine Garantie für eine feste Verteilung in vier echten Nachkommen und keine individuelle Risikoberechnung.</p>`;
          }
        )()
  }`;
}
function code(state: ModelState): string {
  const value = translateCodingDNA(state.sequence);
  return `<label class="model-field">Codierender DNA-Strang · 5′–3′ · ganze Codons<input data-model-text="sequence" value="${esc(state.sequence)}" maxlength="60" spellcheck="false"></label><button type="button" class="button secondary" data-model-update>Modellausschnitt übersetzen</button>${value ? `<p class="sequence">DNA: ${esc(state.sequence.toUpperCase())}<br>mRNA: ${value.codons.join(" · ")}</p><div class="amino-chain" aria-label="Aminosäurefolge">${value.amino.map((aa) => `<span>${aa}</span>`).join('<span aria-hidden="true">→</span>')}${value.stopped ? "<strong>Stopp</strong>" : ""}</div><p class="small">Standardcode, festgelegter Leserahmen ab dem ersten Codon. Stopp liefert keine Aminosäure; spätere Codons werden nicht mehr übersetzt. Die reale Startwahl, RNA-Verarbeitung, Faltung und Genregulation sind nicht simuliert. Ein codierender Strang hat hier bis auf T/U dieselbe Folge wie die mRNA; er ist nicht der komplementäre Vorlagenstrang.</p>` : '<p class="feedback hint" role="status">Bitte 3 bis 60 DNA-Basen in vollständigen Dreiergruppen eingeben.</p>'}`;
}
function ecosystem(state: ModelState): string {
  const rows = ecosystemSeries(state.load, state.retention);
  const max = Math.max(15, ...rows.map((r) => r.store));
  const points = rows.map((row, i) => `${45 + i * 52},${210 - (160 * row.store) / max}`).join(" ");
  return `<div class="model-controls"><label>Eintrag in den ersten sechs Schritten: ${state.load}<input data-model-range="load" type="range" min="0" max="10" step="1" value="${state.load}"></label><label>Grundanteil, der im Speicher bleibt: ${state.retention} %<input data-model-range="retention" type="range" min="0" max="100" step="10" value="${state.retention}"></label></div><svg class="bio-figure" role="img" aria-label="Modell eines Stoffspeichers über zwölf Zeitschritte; nach Schritt sechs endet der Eintrag" viewBox="0 0 660 270"><path d="M45 35V210H630" class="axis"/><polyline points="${points}" class="data-line"/>${rows.map((row, i) => `<circle cx="${45 + i * 52}" cy="${210 - (160 * row.store) / max}" r="4" class="data-point"/><text x="${45 + i * 52}" y="232" text-anchor="middle">${i + 1}</text>`).join("")}<path d="M331 35V210" class="base-link"/><text x="340" y="45">Ab Schritt 7: kein Eintrag</text><text x="45" y="20">Speicher · frei gewählte Einheiten · Maximum ${percent(max)}</text><text x="245" y="260">Modell-Zeitschritt</text></svg><p>Speicher nach Schritt 6: <strong>${percent(rows[5].store)}</strong>; nach Schritt 12: <strong>${percent(rows[11].store)}</strong>. Entfernte Gesamtmenge: ${percent(rows[11].totalRemoved)}.</p><p class="small">Erfundenes Lernmodell: Eintrag plus Speicher, dann anteilige Entfernung. Oberhalb von 12 Einheiten setzt eine fiktive Rückkopplung ein, die mindestens 95 % zurückhält; unter 4 endet sie. Diese frei gewählten Schwellen zeigen Nichtlinearität und einen verzögerten Rückweg. Sie sind keine Messwerte und keine Vorhersage für einen realen See.</p>`;
}
function screening(state: ModelState): string {
  const r = screeningTable(state.prevalence);
  const share = r.positivePredictiveValue;
  return `<label>Ausgangshäufigkeit: ${state.prevalence} %<input data-model-range="prevalence" type="range" min="0" max="20" value="${state.prevalence}" step="1"></label><p>Erfundene Gruppe mit 10.000 Personen, Sensitivität 90 %, Spezifität 95 %. Diese Werte gehören zu <strong>keinem realen Test</strong>.</p>${table(
    ["Zustand im Modell", "Test positiv", "Test negativ", "Insgesamt"],
    [
      ["Eigenschaft vorhanden", String(r.tp), String(r.fn), String(r.affected)],
      ["Eigenschaft nicht vorhanden", String(r.fp), String(r.tn), String(r.unaffected)],
    ],
    "Vierfeldertafel mit gerundeten Personenanzahlen",
  )}
  <p>Unter den ${r.tp + r.fp} positiven Ergebnissen liegen ${r.tp} tatsächliche Fälle: <strong>${share === null ? "kein positiver Test vorhanden" : `${percent(share)} %`}</strong>.</p><p class="small">Sensitivität bezieht sich auf die Gruppe mit Eigenschaft, Spezifität auf die Gruppe ohne Eigenschaft. Der Anteil tatsächlicher Fälle unter positiven Tests benutzt eine andere Bezugsgruppe. Die Modellzahlen dienen nur der Erklärung von Wahrscheinlichkeiten.</p>`;
}
const TITLES = {
  dna: "DNA-Werkbank",
  division: "Chromosomen und Kernteilungen",
  inheritance: "Kreuzungslabor",
  code: "Vom Code zur Aminosäurefolge",
  ecosystem: "Speicher und Rückkopplung",
  screening: "Suchtest und Grundhäufigkeit",
};
export function renderModel(lesson: Lesson, seen: string[], state: ModelState): string {
  const kind = lesson.model!;
  const views = { dna, division, inheritance, code, ecosystem, screening };
  return `<section class="panel exploration"><div class="panel-heading"><span class="eyebrow">VERGLEICHEN UND ERKLÄREN</span><span>${modelReady(kind, seen) ? "✓ Vergleiche geöffnet" : `${seen.length} / ${MODEL_SCENARIOS[kind].length} Vergleiche geöffnet`}</span></div><h2>${TITLES[kind]}</h2><p>Öffne die Vergleichssituationen und beschreibe, was sich verändert und was gleich bleibt. Du kannst die beschrifteten Modellgrößen anschließend selbst verändern.</p><div class="scenario-buttons">${MODEL_SCENARIOS[kind].map((s) => `<button type="button" class="button secondary ${state.selected === s.id ? "selected" : ""}" data-scenario="${s.id}" aria-pressed="${state.selected === s.id}">${seen.includes(s.id) ? "✓ " : ""}${s.label}</button>`).join("")}</div>${views[kind](state)}</section>`;
}
