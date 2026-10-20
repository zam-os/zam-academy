import countryData from "../data/countries.json";
import type { Lesson, ModelKind } from "../model/types";
import {
  AGE_LABELS,
  AGE_PROFILES,
  CITY_PLANS,
  CLIMATE_PROFILES,
  climateStats,
  EU_COUNTRIES,
  EUROPE_BOUNDS,
  GERMANY_BOUNDS,
  greenhouse,
  LANDMARKS,
  type MapBounds,
  MODEL_SCENARIOS,
  mapPoint,
  mapSize,
  modelReady,
  NON_EU_COUNTRIES,
  populationBalance,
  runoff,
} from "../models";
import { esc } from "../workshop";

export interface ModelState {
  selected: string;
  rain: number;
  paved: number;
  saturated: boolean;
  absorption: number;
  births: number;
  deaths: number;
  arrivals: number;
  departures: number;
}
export const initialModelState = (kind: ModelKind): ModelState => ({
  selected: MODEL_SCENARIOS[kind][0].id,
  rain: 40,
  paved: 20,
  saturated: false,
  absorption: 0,
  births: 10,
  deaths: 15,
  arrivals: 10,
  departures: 10,
});
export function applyScenario(kind: ModelKind, state: ModelState, id: string): ModelState {
  if (!MODEL_SCENARIOS[kind].some((s) => s.id === id)) return state;
  const next = { ...state, selected: id };
  if (kind === "runoff") {
    next.paved = id === "paved" ? 80 : 20;
    next.saturated = id === "wet";
  }
  if (kind === "greenhouse") next.absorption = id === "high" ? 78 : id === "medium" ? 50 : 0;
  if (kind === "balance") {
    next.births = 10;
    next.deaths = 15;
    next.arrivals = id === "offset" ? 30 : 10;
    next.departures = id === "outflow" ? 30 : id === "offset" ? 20 : 10;
  }
  return next;
}
const fmt = (n: number, digits = 0) => n.toLocaleString("de-DE", { maximumFractionDigits: digits });
function range(key: string, label: string, value: number, max: number, unit: string): string {
  return `<label class="model-range">${label} <output id="value-${key}">${fmt(value)} ${unit}</output><input type="range" data-model-range="${key}" min="0" max="${max}" value="${value}" aria-label="${label} (${unit})" aria-describedby="value-${key}"></label>`;
}
function polygonPath(coordinates: number[][][], bounds: MapBounds): string {
  return coordinates
    .map(
      (ring) =>
        ring
          .map(([lon, lat], i) => {
            const p = mapPoint(lon, lat, bounds);
            return `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
          })
          .join(" ") + "Z",
    )
    .join(" ");
}
function map(bounds: MapBounds, selected: string, europe = false): string {
  const size = mapSize(bounds);
  const members = new Set<string>(EU_COUNTRIES.map((c) => c[0]));
  const paths = countryData
    .filter((c) => europe || c.code === "DEU")
    .map((country) => {
      const polys =
        country.geometry.type === "Polygon"
          ? [country.geometry.coordinates]
          : country.geometry.coordinates;
      const d = (polys as number[][][][]).map((p) => polygonPath(p, bounds)).join(" ");
      return `<path d="${d}" class="${country.code === selected ? "map-selected" : europe && members.has(country.code) ? "map-member" : "map-country"}"><title>${esc(country.name)}</title></path>`;
    })
    .join("");
  const markers = europe
    ? [...EU_COUNTRIES, ...NON_EU_COUNTRIES].map(([code, name, lon, lat]) => ({
        id: code,
        name,
        lon,
        lat,
      }))
    : Object.entries(LANDMARKS).map(([id, p]) => ({ id, ...p }));
  return `<svg class="geo-map ${europe ? "europe-map" : "germany-map"}" viewBox="0 0 ${size.x} ${size.y}" role="img" aria-label="${europe ? "Vereinfachte Europakarte: EU-Mitglieder in Türkis, übrige Länder grau. Auswahl in Orange. Vollständige Liste darunter." : "Vereinfachter Umriss Deutschlands mit Hamburg, Erfurt, München und Oberstdorf. Ortsauswahl über die Schaltflächen."}"><defs><clipPath id="map-clip"><rect width="${size.x}" height="${size.y}"/></clipPath></defs><g clip-path="url(#map-clip)">${paths}${markers
    .map((p) => {
      const point = mapPoint(p.lon, p.lat, bounds);
      return `<circle cx="${point.x}" cy="${point.y}" r="${p.id === selected ? 4 : 2.2}" class="${p.id === selected ? "map-marker active" : "map-marker"}"><title>${esc(p.name)}</title></circle>`;
    })
    .join(
      "",
    )}</g><text x="${size.x - 12}" y="16" text-anchor="end" class="map-north">N ↑</text></svg>`;
}
function climateChart(
  values: number[],
  minimum: number,
  maximum: number,
  unit: string,
  line = false,
): string {
  const height = 140,
    width = 360,
    left = 35,
    top = 12,
    bottom = 112;
  const y = (v: number) => bottom - ((v - minimum) / (maximum - minimum)) * (bottom - top);
  const x = (i: number) => left + 10 + i * 27;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${line ? "Temperaturverlauf" : "Niederschlagsbalken"}; alle Monatswerte stehen zusätzlich in der Tabelle"><text x="3" y="11">${unit}</text>${[minimum, (minimum + maximum) / 2, maximum].map((value) => `<line x1="${left}" x2="355" y1="${y(value)}" y2="${y(value)}" class="chart-grid"/><text x="${left - 5}" y="${y(value) + 4}" text-anchor="end">${value}</text>`).join("")}${line ? `<polyline points="${values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}" class="temperature-line"/>` : values.map((v, i) => `<rect x="${x(i) - 8}" y="${y(v)}" width="16" height="${bottom - y(v)}" class="rain-bar"/>`).join("")}${["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => `<text x="${x(i)}" y="130" text-anchor="middle">${m}</text>`).join("")}</svg>`;
}
export function renderModel(lesson: Lesson, visited: string[], state: ModelState): string {
  const kind = lesson.model!;
  let body = "";
  if (kind === "landscapes") {
    const p = LANDMARKS[state.selected as keyof typeof LANDMARKS] ?? LANDMARKS.hamburg;
    body = `<div class="map-layout">${map(GERMANY_BOUNDS, state.selected)}<div><h3>${esc(p.name)} · ${esc(p.region)}</h3><p>${esc(p.detail)}</p><p>${fmt(p.lat, 2)}° N · ${fmt(p.lon, 2)}° O (gerundet)</p><p class="small">Staatsumriss ohne Relief oder Landschaftsgrenzen. Nord ist oben. Natural Earth 1:110 Mio.; stark vereinfacht, keine Flächen- oder Distanzmessung.</p></div></div>`;
  }
  if (kind === "climate") {
    const p =
      CLIMATE_PROFILES[state.selected as keyof typeof CLIMATE_PROFILES] ??
      CLIMATE_PROFILES.maritime;
    const stats = climateStats(p);
    body = `<h3>${esc(p.label)}</h3><div class="climate-charts"><figure><figcaption>Monatsmitteltemperatur · °C</figcaption>${climateChart(p.temperature, -10, 30, "°C", true)}</figure><figure><figcaption>Mittlerer Monatsniederschlag · mm</figcaption>${climateChart(p.rain, 0, 100, "mm")}</figure></div><p>Jahresmittel ${fmt(stats.mean, 1)} °C · Temperaturamplitude ${fmt(stats.amplitude)} K · Jahresniederschlag ${fmt(stats.rain)} mm</p><details><summary>Alle erfundenen Monatswerte als Tabelle</summary><div class="table-scroll"><table><thead><tr><th>Monat</th>${["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"].map((m) => `<th>${m}</th>`).join("")}</tr></thead><tbody><tr><th>Temperatur °C</th>${p.temperature.map((v) => `<td>${v}</td>`).join("")}</tr><tr><th>Niederschlag mm</th>${p.rain.map((v) => `<td>${v}</td>`).join("")}</tr></tbody></table></div></details><p class="small">Fiktive langjährige Mittel ohne Messort und Bezugsperiode, nur zum Üben der Diagrammdeutung. Zwei getrennte Skalen; kein Walter-Lieth-Diagramm. Vergleiche die Temperaturamplitude beider Profile.</p>`;
  }
  if (kind === "runoff") {
    const r = runoff(state.rain, state.paved, state.saturated);
    body = `${range("rain", "Regen", state.rain, 100, "mm")}${range("paved", "Versiegelte Fläche", state.paved, 100, "%")}<label class="toggle"><input type="checkbox" id="model-saturated" ${state.saturated ? "checked" : ""}>Stark vorbefeuchteter Boden</label><div class="volume-bar" role="img" aria-label="${fmt(r.fast)} Kubikmeter schneller Abfluss, ${fmt(r.remaining)} Kubikmeter übriger Anteil"><span style="width:${r.coefficient * 100}%"></span></div><p><strong>${fmt(r.fast)} m³ schneller Abfluss</strong> von ${fmt(r.total)} m³ Niederschlagsvolumen. Übriger Anteil: ${fmt(r.remaining)} m³.</p><p class="small">Fiktives Gebiet: 10 km². Modellbeiwert versiegelt 0,9, unversiegelt 0,2 beziehungsweise vorbefeuchtet 0,6. Volumen = Regen in mm × Fläche in km² × 1.000. Übriger Anteil umfasst alles außerhalb des schnellen Abflusses und ist nicht gleich Grundwasserneubildung. Kein Abflussgang und keine Hochwasserhöhe.</p>`;
  }
  if (kind === "greenhouse") {
    const g = greenhouse(state.absorption);
    body = `${range("absorption", "Infrarotabsorption der Modellschicht", state.absorption, 100, "%")}<div class="energy-flow"><span>☀️ Aufgenommene Sonnenenergie<br><strong>${fmt(g.absorbedSolar, 1)} W/m²</strong></span><span>🌍 Modell-Oberfläche<br><strong>${fmt(g.surfaceCelsius, 1)} °C</strong></span></div><p class="small">Ein-Schicht-Strahlungsgleichgewicht: Solarkonstante 1.361 W/m², Albedo 0,30, Stefan-Boltzmann-Konstante 5,670374419 × 10⁻⁸ W/(m² K⁴). Effektive Temperatur = [S × (1 − Albedo) ÷ (4σ)] hoch ¼; Oberflächentemperatur = effektive Temperatur ÷ (1 − Absorptionsanteil/2) hoch ¼. Modellschicht für Sonnenlicht transparent; keine Wolken, Konvektion, Rückkopplungen oder Zeitschritte. Der Anteil ist keine CO₂-Konzentration. Die Oberfläche kann wärmer werden, obwohl die aufgenommene Sonnenleistung gleich bleibt.</p>`;
  }
  if (kind === "population") {
    const values = AGE_PROFILES[state.selected as keyof typeof AGE_PROFILES] ?? AGE_PROFILES.young;
    body = `<h3>Fiktiver Ort · 1.000 Personen</h3><div class="age-bars">${values.map((v, i) => `<div><span>${AGE_LABELS[i]}</span><div style="width:${v / 6}%"></div><strong>${v} Personen · ${v / 10} %</strong></div>`).join("")}</div><p class="small">Drei grobe Altersgruppen, keine Aufteilung nach Geschlecht. Balkenmaßstab: 600 Personen entsprechen der vollen Breite. Keine echte Bevölkerungspyramide und keine realen Länderwerte. Vergleiche jüngeren und älteren Aufbau, ohne daraus allein Ursachen abzuleiten.</p>`;
  }
  if (kind === "balance") {
    const b = populationBalance(state.births, state.deaths, state.arrivals, state.departures);
    body = `<div class="model-controls">${range("births", "Geburten", state.births, 200, "Personen/Jahr")}${range("deaths", "Sterbefälle", state.deaths, 200, "Personen/Jahr")}${range("arrivals", "Zuzüge", state.arrivals, 200, "Personen/Jahr")}${range("departures", "Fortzüge", state.departures, 200, "Personen/Jahr")}</div><p>Natürliche Bilanz: <strong>${b.natural}</strong> · Wanderungsbilanz: <strong>${b.migration}</strong> Personen/Jahr</p><p class="balance-equation">1.000 + ${b.births} − ${b.deaths} + ${b.arrivals} − ${b.departures} = <strong>${fmt(b.end)} Personen</strong></p><p class="small">Erfundener Ort, ein Jahr, absolute Zahlen. Ohne statistische Korrekturen oder Altersmodell. Die Reglerwerte sind keine Raten je 1.000 Menschen.</p>`;
  }
  if (kind === "city") {
    const p = CITY_PLANS[state.selected as keyof typeof CITY_PLANS] ?? CITY_PLANS.spread;
    body = `<div class="city-grid" role="img" aria-label="100 Hektar: ${p.housing} Wohnbaufläche, ${p.transport} Verkehr, ${p.green} Grün">${Array.from({ length: 100 }, (_, i) => `<i class="${i < p.housing ? "housing" : i < p.housing + p.transport ? "transport" : "green"}"></i>`).join("")}</div><p>100 ha insgesamt: <strong>${p.housing} ha Wohnbaufläche</strong>, ${p.transport} ha Verkehr, ${p.green} ha Grün.</p><p>${p.dwellingsPerHousingHa} angenommene Wohnungen je ha Wohnbaufläche → <strong>${fmt(p.housing * p.dwellingsPerHousingHa)} Wohnungen</strong>.</p><p class="small">Frei erfundener Flächenplan, ein Kästchen = 1 ha. Wohnbaufläche umfasst auch unversiegelte Anteile und ist nicht gleich vollständig versiegelte Fläche. Kosten, Wohnungsgrößen, Erreichbarkeit, Boden und soziale Verteilung werden nicht berechnet. Es gibt keine automatische Gesamtnote für einen Plan.</p>`;
  }
  if (kind === "europe") {
    const selected =
      [...EU_COUNTRIES, ...NON_EU_COUNTRIES].find((c) => c[0] === state.selected) ??
      EU_COUNTRIES[0];
    body = `${map(EUROPE_BOUNDS, state.selected, true)}<p><strong>${esc(selected[1])}</strong> · ${EU_COUNTRIES.some((c) => c[0] === selected[0]) ? "EU-Mitglied" : "kein EU-Mitglied"} · Stand 20. Oktober 2026</p><p class="small">Türkis: EU-Mitglieder; Grau: übrige Länder des Kartenausschnitts; Orange: Auswahl. Punkte dienen der Orientierung, auch für kleine Inselstaaten. Zyperns EU-Mitgliedschaft wird über den Gesamtstaat und einen Marker dargestellt; der Datensatz unterscheidet auf der Insel Verwaltungsflächen. Keine Aussage über rechtliche Grenzanerkennung. Nord oben, vereinfachte Projektion, Überseegebiete nicht vollständig dargestellt.</p><details><summary>Alle 27 Mitglieder und vier Vergleichsstaaten auswählen</summary><div class="country-list">${[...EU_COUNTRIES, ...NON_EU_COUNTRIES].map((c) => `<button type="button" class="text-button" data-country="${c[0]}" aria-pressed="${state.selected === c[0]}">${esc(c[1])}</button>`).join("")}</div></details>`;
  }
  return `<section class="panel exploration"><span class="eyebrow">ENTDECKEN · MODELL & KARTE</span><h2>Vergleiche die Situationen</h2><p>Wähle jede Vergleichssituation und beschreibe, was sich ändert. Die Häkchen merken deine Auswahl, bewerten deine Erklärung aber nicht.</p><div class="scenario-buttons">${MODEL_SCENARIOS[kind].map((s) => `<button type="button" class="button secondary ${state.selected === s.id ? "chosen" : ""}" data-scenario="${s.id}" aria-pressed="${state.selected === s.id}">${visited.includes(s.id) ? "✓ " : ""}${esc(s.label)}</button>`).join("")}</div><div id="model-output">${body}</div><p class="small" id="model-status" role="status">${modelReady(kind, visited) ? "✓ Alle Vergleichssituationen geöffnet. Begründe deine Beobachtung in deiner Antwort." : `${visited.length} von ${MODEL_SCENARIOS[kind].length} Vergleichssituationen geöffnet.`}</p></section>`;
}
