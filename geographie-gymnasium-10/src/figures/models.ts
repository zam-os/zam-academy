import { arrow, dot, f1, fmtDe, label, labels, svg } from "./draw";

type BarRow = readonly [name: string, value: number, colorIdx?: number];

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTHS_FULL = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export interface ClimateModelStation {
  name: string;
  zone: string;
  temp: readonly number[];
  rain: readonly number[];
  /** Jahresmitteltemperatur in °C (exakt berechnet) und Jahresniederschlag in mm. */
  note: string;
}

export const CLIMATE_STATIONS: Record<
  "tropen" | "savanne" | "wueste" | "gemaessigt",
  ClimateModelStation
> = {
  tropen: {
    name: "Immerfeuchte Tropen (Modellstation)",
    zone: "Immerfeuchte Tropen",
    temp: [26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 26],
    rain: [260, 250, 290, 280, 220, 120, 90, 70, 95, 140, 190, 235],
    note: "Ganzjährig 26–27 °C (Tageszeitenklima), alle 12 Monate humid (Niederschlagskurve über Temperaturkurve).",
  },
  savanne: {
    name: "Wechselfeuchte Tropen (Modellstation Nordhalbkugel)",
    zone: "Wechselfeuchte Tropen",
    temp: [25, 27, 30, 31, 30, 28, 26, 25, 26, 27, 27, 25],
    rain: [4, 6, 18, 45, 95, 150, 210, 240, 165, 65, 12, 5],
    note: "Deutliche hygrische Jahreszeiten: Zenitalregen im Nordsommer (Mai–Okt), Trockenzeit im Winterhalbjahr.",
  },
  wueste: {
    name: "Aride Subtropen (Modellstation Wüste)",
    zone: "Aride Subtropen",
    temp: [13, 15, 19, 24, 28, 32, 34, 33, 30, 25, 19, 14],
    rain: [6, 4, 4, 2, 1, 0, 0, 0, 1, 2, 4, 5],
    note: "Alle 12 Monate arid (Niederschlag überall weit unter 2 · Temperatur); hohe Temperaturspanne.",
  },
  gemaessigt: {
    name: "Gemäßigte Zone (Modellstation Mitteleuropa)",
    zone: "Kühlgemäßigte Zone",
    temp: [-1, 1, 5, 9, 14, 17, 19, 18, 14, 9, 4, 0],
    rain: [52, 48, 56, 62, 85, 105, 110, 98, 72, 60, 58, 54],
    note: "Thermische Jahreszeiten mit Frost im Winter und Sommermaximum; ganzjährig humid.",
  },
};

export type ClimateStationId = keyof typeof CLIMATE_STATIONS;

/**
 * Exact Walter-Lieth climate diagram (10 °C = 20 mm up to 100 mm; compressed above 100 mm at 10 °C = 100 mm).
 */
export function walterLiethChart(id: ClimateStationId): string {
  const { name, temp, rain } = CLIMATE_STATIONS[id];
  const x = (i: number) => 64 + i * 40;
  // Base line = 0 °C / 0 mm at y = 216.
  // Scale below 100 mm: 10 °C = 20 mm -> 1 °C = 2,6 px -> 1 mm = 1,3 px (100 mm -> y = 86).
  // Scale above 100 mm: 10 °C = 100 mm -> 100 mm = 26 px -> 1 mm = 0,26 px (250 mm -> y = 47).
  const ty = (t: number) => 216 - t * 2.6;
  const ry = (r: number) =>
    r <= 100 ? 216 - r * 1.3 : 86 - (r - 100) * 0.26;

  const grid = [-10, 0, 10, 20, 30, 40]
    .map(
      (t) =>
        `<line class="geo-axis" x1="50" y1="${f1(ty(t))}" x2="520" y2="${f1(ty(t))}"/>` +
        label(42, ty(t) + 4, fmtDe(t, 0), "lbl tiny", "end"),
    )
    .join("");

  const rightLabels = [
    [0, 216],
    [20, 190],
    [40, 164],
    [60, 138],
    [100, 86],
    [250, 47],
  ]
    .map(([mm, y]) => label(530, y + 4, String(mm), "lbl tiny", "start"))
    .join("");

  const bars = rain
    .map((r, i) => {
      const yTop = ry(r);
      const arid = r < 2 * Math.max(0, temp[i]);
      return `<rect class="${arid ? "geo-arid-bar" : "geo-rain"}" x="${f1(x(i) - 10)}" y="${f1(yTop)}" width="20" height="${f1(216 - yTop)}" rx="2"/>`;
    })
    .join("");

  const tempPoints = temp.map((t, i) => `${f1(x(i))},${f1(ty(t))}`).join(" ");
  const meanT = temp.reduce((a, b) => a + b, 0) / 12;
  const sumR = rain.reduce((a, b) => a + b, 0);

  return svg(
    580,
    274,
    `Klimadiagramm ${name} im Walter-Lieth-Maßstab 10 Grad Celsius gleich 20 Millimeter`,
    label(290, 18, `${name} · Ø ${fmtDe(meanT, 1)} °C · ${sumR} mm/Jahr`, "lbl small strong") +
      label(42, 68, "°C", "lbl tiny strong", "end") +
      label(530, 68, "mm", "lbl tiny strong", "start") +
      grid +
      rightLabels +
      `<line class="geo-zero-line" x1="50" y1="216" x2="520" y2="216"/>` +
      bars +
      `<polyline class="geo-temp" points="${tempPoints}"/>` +
      temp.map((t, i) => `<circle class="geo-temp-dot" cx="${f1(x(i))}" cy="${f1(ty(t))}" r="2.8"/>`).join("") +
      MONTHS.map((m, i) => label(x(i), 254, m, "lbl tiny")).join("") +
      label(290, 268, "Maßstab bis 100 mm: 10 °C = 20 mm (blau = humid, ocker = arid; ab 100 mm 10 °C = 100 mm)", "lbl tiny muted"),
  );
}

export function walterLiethTable(id: ClimateStationId): string {
  const { name, temp, rain } = CLIMATE_STATIONS[id];
  const idx = [0, 3, 6, 9];
  return `<table class="lab-table geo-table"><caption>Vier Monatswerte · ${name}</caption>
    <thead><tr><th scope="col">Monat</th><th scope="col">Temperatur</th><th scope="col">Niederschlag</th><th scope="col">2 · T vs. N</th></tr></thead>
    <tbody>${idx
      .map((i) => {
        const arid = rain[i] < 2 * Math.max(0, temp[i]);
        return `<tr><th scope="row">${MONTHS_FULL[i]}</th><td>${fmtDe(temp[i], 0)} °C</td><td>${rain[i]} mm</td><td>${arid ? "arid" : "humid"}</td></tr>`;
      })
      .join("")}</tbody></table>`;
}

export function comparisonBars(
  title: string,
  rows: readonly BarRow[],
  unit: string,
  maximum: number,
  subtitle = "",
): string {
  const body = rows
    .map(([name, value, colorIdx], i) => {
      const y = 48 + 42 * i;
      const w = Math.max(2, Math.min(286, (286 * value) / maximum));
      const c = colorIdx ?? (i % 4);
      const valText = `${fmtDe(value, Number.isInteger(value) ? 0 : 2)}${unit ? ` ${unit}` : ""}`;
      return (
        label(224, y + 19, name, "lbl small", "end") +
        `<rect class="geo-bar-bg" x="234" y="${y}" width="286" height="28" rx="6"/>` +
        `<rect class="geo-color-${c}" x="234" y="${y}" width="${f1(w)}" height="28" rx="6"/>` +
        label(528, y + 19, valText, "lbl small strong", "start")
      );
    })
    .join("");
  const h = 72 + 42 * rows.length;
  return svg(
    600,
    h,
    title,
    label(300, 26, title, "lbl strong") +
      body +
      (subtitle ? label(300, h - 10, subtitle, "lbl tiny muted") : ""),
  );
}

/** Stacked proportional 100%-bar comparison (strictly scaled). */
export function stackedBars(
  title: string,
  groups: ReadonlyArray<{
    label: string;
    segments: ReadonlyArray<{ name: string; pct: number; cls: string }>;
  }>,
  captionNote = "",
): string {
  const rowH = 54;
  const barW = 340;
  const x0 = 188;
  const rowsHtml = groups
    .map((g, gi) => {
      const y = 52 + gi * rowH;
      let cursor = x0;
      const segs = g.segments
        .map((s) => {
          const w = (barW * s.pct) / 100;
          const rect = `<rect class="${s.cls}" x="${f1(cursor)}" y="${y}" width="${f1(w)}" height="30"/>`;
          const txt = w >= 42 ? label(cursor + w / 2, y + 19, `${s.pct} %`, "lbl tiny on-bar") : "";
          cursor += w;
          return rect + txt;
        })
        .join("");
      return (
        label(x0 - 12, y + 19, g.label, "lbl small strong", "end") +
        `<g><rect class="geo-bar-bg" x="${x0}" y="${y}" width="${barW}" height="30" rx="5"/>${segs}</g>`
      );
    })
    .join("");
  const legendItems = groups[0].segments;
  const ly = 56 + groups.length * rowH;
  const lxStep = 540 / legendItems.length;
  const legend = legendItems
    .map((s, i) => {
      const lx = 24 + i * lxStep;
      return `<rect class="${s.cls}" x="${f1(lx)}" y="${ly}" width="12" height="12" rx="3"/>` + label(lx + 18, ly + 10, s.name, "lbl tiny", "start");
    })
    .join("");
  const h = ly + 36;
  return svg(
    580,
    h,
    title,
    label(290, 26, title, "lbl strong") +
      rowsHtml +
      legend +
      (captionNote ? label(290, h - 8, captionNote, "lbl tiny muted") : ""),
  );
}

/**
 * Hadley-Zelle / Passatzirkulation SVG reacting live to sun zenith latitude (-23.5 to +23.5) and observation latitude.
 */
export function hadleyDiagram(zenitLat: number, obsLat: number): string {
  // Map latitude -35..+35 to x = 80..500
  const lx = (lat: number) => 290 + (lat / 35) * 210;
  const zx = lx(zenitLat);
  const ox = lx(obsLat);
  const highN = Math.min(33, Number((29 + zenitLat * 0.2).toFixed(1)));
  const highS = Math.max(-33, Number((-29 + zenitLat * 0.2).toFixed(1)));
  const hnX = lx(highN);
  const hsX = lx(highS);

  const groundY = 200;
  const topY = 76;

  return svg(
    580,
    265,
    `Passatzirkulation bei Sonnenzenit ${fmtDe(zenitLat, 1)} Grad und Beobachtung bei ${fmtDe(obsLat, 1)} Grad`,
    // Sky & ground
    `<rect class="geo-sky-band" x="30" y="34" width="520" height="166" rx="10"/>` +
      `<rect class="geo-ground-band" x="30" y="${groundY}" width="520" height="24" rx="4"/>` +
      // Sun zenith
      `<circle class="sun-circle" cx="${f1(zx)}" cy="42" r="14"/>` +
      arrow(zx, 58, zx, 82, "sun-ray") +
      label(zx, 22, `Zenit: ${fmtDe(zenitLat, 1)}°`, "lbl tiny strong") +
      // Equator & Tropics tick marks
      `<line class="geo-axis" x1="290" y1="74" x2="290" y2="${groundY + 24}"/>` +
      label(290, groundY + 40, "0° Äquator", "lbl tiny") +
      label(lx(23.5), groundY + 40, "23,5° N", "lbl tiny") +
      label(lx(-23.5), groundY + 40, "23,5° S", "lbl tiny") +
      // ITC ascending air + convective cloud + rain
      `<path class="geo-rain-curtain" d="M${f1(zx - 18)} 118h36v82h-36z" opacity="0.28"/>` +
      `<ellipse class="geo-cloud" cx="${f1(zx)}" cy="108" rx="34" ry="16"/>` +
      arrow(zx, groundY - 4, zx, 128, "geo-warm-arrow") +
      label(zx, 152, "ITC (Tief)", "lbl tiny strong") +
      label(zx, 166, "Zenitalregen", "lbl tiny") +
      // Upper-level poleward return flow
      arrow(zx + 16, topY + 6, hnX - 10, topY + 6, "geo-warm-arrow") +
      arrow(zx - 16, topY + 6, hsX + 10, topY + 6, "geo-warm-arrow") +
      // Descending subtropical high
      arrow(hnX, topY + 18, hnX, groundY - 12, "geo-dry-arrow") +
      arrow(hsX, topY + 18, hsX, groundY - 12, "geo-dry-arrow") +
      label(hnX, 140, "Hoch\n(Trocken)", "lbl tiny", "start") +
      label(hsX, 140, "Hoch\n(Trocken)", "lbl tiny", "end") +
      // Surface trade winds returning to ITC
      arrow(hnX - 8, groundY - 10, zx + 18, groundY - 10, "geo-wind-arrow") +
      arrow(hsX + 8, groundY - 10, zx - 18, groundY - 10, "geo-wind-arrow") +
      label((hnX + zx) / 2, groundY - 22, "NO-Passat", "lbl tiny strong") +
      label((hsX + zx) / 2, groundY - 22, "SO-Passat", "lbl tiny strong") +
      // Observer station pin (kept inside ground band so wind labels stay untouched)
      `<line class="geo-obs-pin" x1="${f1(ox)}" y1="${groundY - 4}" x2="${f1(ox)}" y2="${groundY + 22}"/>` +
      dot(ox, groundY + 4, "geo-focus-dot") +
      label(ox, groundY + 56, `Beobachtung: ${fmtDe(obsLat, 1)}°`, "lbl small strong"),
  );
}

/**
 * Live greenhouse effect radiation balance SVG.
 */
export function greenhouseDiagram(
  co2Factor: number,
  ch4Factor: number,
  albedoLoss: number,
  tempDelta: number,
): string {
  const glassThickness = 14 + co2Factor * 8 + ch4Factor * 6;
  const reflectedW = Math.max(12, 34 - albedoLoss * 12);
  const backHeatW = 10 + co2Factor * 9 + ch4Factor * 6;

  return svg(
    580,
    244,
    `Strahlungshaushalt der Atmosphäre bei plus ${fmtDe(tempDelta, 1)} Grad Celsius Erwärmung`,
    `<rect class="geo-space-band" x="20" y="16" width="540" height="58" rx="10"/>` +
      `<rect class="geo-sky-band" x="20" y="74" width="540" height="114"/>` +
      `<rect class="geo-ghg-band" x="20" y="${f1(122 - glassThickness / 2)}" width="540" height="${f1(glassThickness)}" opacity="0.55"/>` +
      `<rect class="geo-ground-band" x="20" y="188" width="540" height="40" rx="6"/>` +
      label(290, 38, "Weltraum · Energiebilanz der Erde", "lbl small on-dark") +
      // Incoming shortwave solar
      arrow(82, 48, 82, 184, "sun-ray") +
      labels(82, 92, "Kurzwellige\nSonnenstrahlung", "lbl tiny strong") +
      // Albedo reflection (depends on ice cover)
      arrow(150, 184, 186, 48, "geo-albedo-arrow") +
      `<rect class="geo-ice-patch" x="132" y="182" width="${f1(reflectedW)}" height="12" rx="3"/>` +
      labels(194, 88, `Eis-Albedo\n(${albedoLoss > 0.5 ? "geschwächt" : "stark"})`, "lbl tiny", "start") +
      // Center GHG label kept completely clear of arrows
      labels(282, 122, "Treibhausgase:\nabsorbieren Wärme", "lbl tiny strong") +
      // Outgoing infrared
      arrow(372, 184, 372, 52, "geo-ir-arrow") +
      labels(372, 162, "Langwellige\nAbstrahlung", "lbl tiny strong") +
      // Back radiation (proportional thickness indicator)
      `<rect class="geo-back-bar" x="452" y="128" width="${f1(backHeatW)}" height="54" rx="4"/>` +
      arrow(452 + backHeatW / 2, 128, 452 + backHeatW / 2, 184, "geo-ir-arrow") +
      labels(490, 152, `Gegenstrahlung\n+${fmtDe(tempDelta, 1)} °C`, "lbl tiny strong", "start") +
      label(290, 212, "Erdoberfläche erwärmt sich → gibt langwellige Wärmestrahlung ab", "lbl tiny"),
  );
}

/**
 * Live oasis cross-section SVG reacting to irrigation method & irrigated area.
 */
export function oasisCrossSection(
  method: "furche" | "fossil" | "tropf",
  area: number,
  withdrawal: number,
  groundwaterDepthPct: number,
  salinityRisk: "hoch" | "mittel" | "gering",
): string {
  const waterY = 140 + groundwaterDepthPct * 0.52;
  const fieldW = 120 + area * 12;
  const evapFactor = method === "furche" ? 3 : method === "fossil" ? 2 : 1;
  return svg(
    580,
    240,
    `Querschnitt einer Bewässerungsoase mit Grundwasserspiegel und Verdunstung`,
    `<rect class="geo-sky-band" x="20" y="16" width="540" height="104" rx="8"/>` +
      `<rect class="geo-sand" x="20" y="120" width="540" height="104" rx="6"/>` +
      // Groundwater layer
      `<rect class="sea" x="20" y="${f1(waterY)}" width="540" height="${f1(224 - waterY)}" rx="4"/>` +
      // Irrigated crop strip
      `<rect class="geo-crop-strip" x="70" y="114" width="${f1(fieldW)}" height="12" rx="3"/>` +
      // Salinity crust when high risk
      (salinityRisk === "hoch"
        ? `<rect class="geo-salt-crust" x="70" y="110" width="${f1(fieldW)}" height="5" rx="2"/>`
        : "") +
      // Evaporation arrows
      Array.from({ length: evapFactor }, (_, i) => arrow(110 + i * 48, 108, 110 + i * 48, 62, "geo-dry-arrow")).join("") +
      label(130, 50, `Verdunstung (${method === "furche" ? "hoch" : method === "fossil" ? "mittel" : "gering"})`, "lbl tiny strong") +
      // Pump well
      `<line class="geo-obs-pin" x1="56" y1="100" x2="56" y2="${f1(waterY + 12)}"/>` +
      label(64, 185, `Grundwasserspiegel · Entnahme ${withdrawal} Einh.`, "lbl small strong", "start") +
      label(440, 95, `Versalzungsrisiko: ${salinityRisk}`, "lbl small strong") +
      label(70 + fieldW / 2, 138, `Nutzfläche: ${area} ha`, "lbl tiny strong"),
  );
}

/**
 * Altitudinal zonation profile (Andes at Equator vs. Bavarian Alps at 47° N) for Lesson 27 & Lab 10.
 */
export function altitudinalProfile(
  range: "anden" | "alpen",
  elevationM: number,
): string {
  const zones =
    range === "anden"
      ? [
          { min: 0, max: 1000, name: "Tierra caliente (Tropenwald / Kakao)", cls: "geo-zone-0" },
          { min: 1000, max: 2000, name: "Tierra templada (Kaffee / Bergwald)", cls: "geo-zone-1" },
          { min: 2000, max: 3500, name: "Tierra fría (Kartoffeln / Getreide)", cls: "geo-zone-2" },
          { min: 3500, max: 4500, name: "Tierra helada (Páramo / Puna)", cls: "geo-zone-3" },
          { min: 4500, max: 5200, name: "Tierra nevada (Eis & Schnee)", cls: "geo-zone-4" },
        ]
      : [
          { min: 0, max: 600, name: "Kolline Stufe (Ackerbau & Siedlung)", cls: "geo-zone-0" },
          { min: 600, max: 1500, name: "Montane Stufe (Misch- & Nadelwald)", cls: "geo-zone-1" },
          { min: 1500, max: 2000, name: "Subalpine Stufe (Krummholz / Alm)", cls: "geo-zone-2" },
          { min: 2000, max: 2800, name: "Alpine Stufe (Alpine Matten / Fels)", cls: "geo-zone-3" },
          { min: 2800, max: 3200, name: "Nivale Stufe (Schnee & Gletscher)", cls: "geo-zone-4" },
        ];
  const maxAlt = range === "anden" ? 5200 : 3200;
  const baseTemp = range === "anden" ? 27 : 10;
  const tempAtElev = baseTemp - (elevationM / 100) * 0.6;
  const yOf = (m: number) => 224 - (m / maxAlt) * 184;

  const bands = zones
    .map((z) => {
      const yTop = yOf(z.max);
      const yBot = yOf(z.min);
      const mid = (yTop + yBot) / 2;
      return (
        `<rect class="${z.cls}" x="70" y="${f1(yTop)}" width="470" height="${f1(yBot - yTop)}" opacity="0.65"/>` +
        label(288, mid + 4, `${z.name} (${z.min}–${z.max} m)`, "lbl tiny strong", "start")
      );
    })
    .join("");

  // Mountain silhouette on left side
  const peakY = yOf(maxAlt);
  const mountain = `<polygon class="geo-mountain-sil" points="70,224 235,${f1(peakY)} 280,224" opacity="0.72"/>`;
  const markerY = yOf(Math.min(maxAlt, elevationM));

  return svg(
    580,
    254,
    `Höhenstufen im Profil: ${range === "anden" ? "Tropische Anden" : "Bayerische Alpen"} bei ${elevationM} Metern`,
    label(290, 22, `${range === "anden" ? "Tropische Anden (ca. 0°)" : "Bayerische Alpen (ca. 47° N)"} · Höhenprofil`, "lbl strong") +
      bands +
      mountain +
      `<line class="geo-obs-line" x1="65" y1="${f1(markerY)}" x2="282" y2="${f1(markerY)}"/>` +
      dot(155, markerY, "geo-focus-dot") +
      label(62, markerY + 4, `${elevationM} m`, "lbl tiny strong", "end") +
      label(290, 244, `Ausgangstemperatur Tal: ${fmtDe(baseTemp, 0)} °C · Höhe ${elevationM} m → Modelltemperatur ca. ${fmtDe(tempAtElev, 1)} °C`, "lbl tiny strong"),
  );
}

/**
 * Simple helper so labs can read current elevation zone text cleanly.
 */
export function currentAltitudinalZone(range: "anden" | "alpen", elevationM: number): string {
  if (range === "anden") {
    if (elevationM < 1000) return "Tierra caliente";
    if (elevationM < 2000) return "Tierra templada";
    if (elevationM < 3500) return "Tierra fría";
    if (elevationM < 4500) return "Tierra helada";
    return "Tierra nevada";
  }
  if (elevationM < 600) return "Kolline Stufe";
  if (elevationM < 1500) return "Montane Stufe";
  if (elevationM < 2000) return "Subalpine Stufe";
  if (elevationM < 2800) return "Alpine Stufe";
  return "Nivale Stufe";
}

export function processDiagram(
  title: string,
  names: readonly string[],
  subtitles: readonly string[],
  ordered = true,
): string {
  const n = names.length;
  const step = 532 / n;
  const w = step - 14;
  const body = names
    .map((name, i) => {
      const x = 24 + i * step;
      return (
        `<rect class="geo-step geo-color-${i % 4}" x="${f1(x)}" y="46" width="${f1(w)}" height="92" rx="12"/>` +
        labels(x + w / 2, 70, name, "lbl strong") +
        labels(x + w / 2, 108, subtitles[i], "lbl small") +
        (ordered && i < n - 1 ? arrow(x + w + 2, 92, x + w + 12, 92) : "")
      );
    })
    .join("");
  return svg(580, 158, title, label(290, 24, title, "lbl strong") + body);
}
