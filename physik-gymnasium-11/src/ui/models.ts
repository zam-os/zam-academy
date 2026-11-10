import { fmt } from "../exercises/format";
import type { Lesson, ModelKind } from "../model/types";
import {
  applyScenario,
  centripetal,
  centriSeries,
  chain,
  circular,
  colourHex,
  colourName,
  curve,
  EARTH_MASS,
  EARTH_RADIUS,
  eulerFall,
  eulerOscillation,
  FEED_IN_CT,
  fringeSpacing,
  G_EARTH,
  gamma,
  gravityForce,
  harmonic,
  hubble,
  initialModelState,
  interference,
  kepler,
  logistic,
  MODEL_SCENARIOS,
  type ModelState,
  modelReady,
  modelValues,
  muon,
  orbit,
  PARAMS,
  pendulumPeriod,
  PLACES,
  platformSpeed,
  pvPlant,
  ride,
  saving,
  solarCurrent,
  solarMpp,
  solarPoint,
  spring,
  standing,
  superpose,
  terminalSpeed,
  timingSample,
  UTILITY_CRITERIA,
  UTILITY_OPTIONS,
  utility,
  wave,
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
  // Scale to the data, so small readouts such as 0,5 A fill the plot.
  const maxX = Math.max(0, ...points.map((p) => p[0])) || 1,
    maxY = Math.max(0, ...points.map((p) => p[1])) || 1,
    minY = Math.min(0, ...points.map((p) => p[1])),
    span = maxY - minY;
  const x = (n: number) => 60 + (550 * n) / maxX,
    y = (n: number) => 210 - (160 * (n - minY)) / span;
  return `<svg class="physics-figure" viewBox="0 0 660 270" role="img" aria-label="${esc(yLabel)} in Abhängigkeit von ${esc(xLabel)}"><path d="M60 40V210H620" class="axis"/><path d="M60 ${y(0)}H620" class="base-link"/><polyline points="${points.map((p) => `${x(p[0])},${y(p[1])}`).join(" ")}" class="data-line"/><text x="60" y="24">${esc(yLabel)} · ${fmt(minY)} bis ${fmt(maxY)}</text><text x="60" y="232">0</text><text x="610" y="232" text-anchor="end">${fmt(maxX)}</text><text x="300" y="260">${esc(xLabel)}</text></svg>`;
}
const kv = (rows: (string | number)[][], caption: string) =>
  table(["Größe", "Wert"], rows, caption);
const note = (text: string) => `<p class="small">${text}</p>`;
/** Bright and dark fringes of a double slit, spacing in mm on a 60-mm screen strip. */
function fringes(spacing: number, colour: string, name: string): string {
  const stripes: string[] = [];
  for (let k = -40; k <= 40; k++) {
    const centre = 330 + (k * spacing * 600) / 60;
    if (centre < 30 || centre > 630) continue;
    const width = Math.max(2, (spacing * 600) / 60 / 2);
    stripes.push(
      `<rect x="${centre - width / 2}" y="40" width="${width}" height="90" fill="${colour}" opacity="${k === 0 ? 1 : 0.8}"/>`,
    );
  }
  return `<svg class="physics-figure" viewBox="0 0 660 170" role="img" aria-label="Schirmbild am Doppelspalt: helle Streifen in ${esc(name)} im Abstand ${fmt(spacing)} Millimeter"><rect x="30" y="40" width="600" height="90" fill="#101018"/>${stripes.join("")}<text x="30" y="24">Schirmausschnitt · 60 mm breit</text><text x="330" y="156" text-anchor="middle">Maximum 0. Ordnung in der Mitte</text></svg>`;
}
function modelBody(kind: ModelKind, v: Record<string, number>): string {
  switch (kind) {
    case "circular": {
      const r = circular(v.r, v.T);
      return (
        table(
          ["Geradlinige Bewegung", "Kreisbewegung", "Wert"],
          [
            ["Weg s", "Drehwinkel φ pro Umlauf", "2π ≈ 6,283"],
            ["Geschwindigkeit v = Δs / Δt", "Winkelgeschwindigkeit ω = Δφ / Δt in 1/s", r.omega],
            ["", "Frequenz f in Hz", r.f],
            ["", "Bahngeschwindigkeit v = ω · r in m/s", r.v],
          ],
          "Größen im Vergleich",
        ) +
        `<p>Umfang ${fmt(2 * Math.PI * v.r)} m in ${fmt(v.T)} s: <strong>v = ${fmt(r.v)} m/s</strong>, ω = ${fmt(r.omega)} 1/s.</p>` +
        note("Kreisbewegung mit konstanter Winkelgeschwindigkeit. Der Betrag der Bahngeschwindigkeit bleibt gleich, ihre Richtung ändert sich ständig.")
      );
    }
    case "centripetal": {
      const r = centripetal(v.m, v.v, v.r);
      return (
        kv(
          [
            ["Winkelgeschwindigkeit in 1/s", r.omega],
            ["Zentripetalbeschleunigung in m/s²", r.a],
            ["Zentripetalkraft in N", r.f],
          ],
          "Kraft zum Kreismittelpunkt",
        ) +
        `<p>F_Z = m · v² / r = <strong>${fmt(r.f)} N</strong>, gerichtet zum Mittelpunkt der Bahn.</p>` +
        note("Die Zentripetalkraft ist keine zusätzliche Kraft. Eine vorhandene Kraft wie Fadenkraft, Haftreibung oder Gravitation übernimmt diese Rolle.")
      );
    }
    case "centriexp": {
      const rows = centriSeries(v.vary, v.noise),
        names = ["Masse in kg", "Radius in m", "Winkelgeschwindigkeit in 1/s"],
        quotients = ["F / m in N/kg", "F / r in N/m", "F / ω² in N·s²"],
        fixed = [
          "r = 0,4 m und ω = 5 1/s bleiben fest",
          "m = 0,2 kg und ω = 5 1/s bleiben fest",
          "m = 0,2 kg und r = 0,4 m bleiben fest",
        ];
      return (
        table(
          [names[v.vary], "Gemessene Kraft in N", quotients[v.vary]],
          rows.map((row) => [row.x, row.f, row.quotient]),
          `Messreihe · ${fixed[v.vary]}`,
        ) +
        `<p>${v.vary === 2 ? "Der Quotient F / ω² bleibt nahezu gleich: F ist proportional zu ω²." : `Der Quotient bleibt nahezu gleich: F ist proportional zu${v.vary === 0 ? "r Masse" : "m Radius (bei fester Winkelgeschwindigkeit)"}.`}</p>` +
        note("Nachgebildete Messwerte mit einstellbarer Abweichung, keine echten Messdaten. Im Experiment variierst du immer nur eine Größe und hältst die anderen fest.")
      );
    }
    case "curve": {
      const r = curve(v.m, v.v, v.r, v.mu);
      return (
        kv(
          [
            ["Nötige Zentripetalkraft in N", r.need],
            ["Größtmögliche Haftreibungskraft in N", r.max],
            ["Höchstgeschwindigkeit für diese Kurve in km/h", r.vMaxKmh],
          ],
          "Kurvenfahrt auf ebener Fahrbahn",
        ) +
        `<p><strong>${r.safe ? "Die Haftreibung reicht aus." : "Die Haftreibung reicht nicht aus: Das Fahrzeug rutscht nach außen weg."}</strong></p>` +
        note("Ebene Kurve ohne Überhöhung, g = 9,81 m/s². Die Masse kürzt sich aus der Höchstgeschwindigkeit heraus. Beispielwerte für μ, keine Angaben für eine bestimmte Straße.")
      );
    }
    case "gravity": {
      const f = gravityForce(EARTH_MASS, v.m, v.n * EARTH_RADIUS),
        surface = gravityForce(EARTH_MASS, v.m, EARTH_RADIUS);
      return (
        kv(
          [
            ["Abstand vom Erdmittelpunkt in km", (v.n * EARTH_RADIUS) / 1000],
            ["Gravitationskraft in N", f],
            ["Anteil der Kraft an der Oberfläche in %", (100 * f) / surface],
            ["Ortsfaktor in N/kg", f / v.m],
          ],
          "Erde und ein Körper",
        ) +
        `<p>Bei ${fmt(v.n)}-fachem Abstand bleibt 1 / ${fmt(v.n * v.n)} der Kraft.</p>` +
        note("F = G · m₁ · m₂ / r² mit Erdmasse 5,972 · 10²⁴ kg und Erdradius 6371 km. Der Abstand zählt vom Erdmittelpunkt, nicht von der Oberfläche.")
      );
    }
    case "orbit": {
      const radius = EARTH_RADIUS + v.h * 1000,
        r = orbit(EARTH_MASS, radius);
      return (
        kv(
          [
            ["Bahnradius in km", radius / 1000],
            ["Bahngeschwindigkeit in km/s", r.v / 1000],
            ["Umlaufdauer in h", r.T / 3600],
            ["Umläufe pro Tag", 86164 / r.T],
          ],
          "Kreisbahn um die Erde",
        ) +
        `<p>Die Gravitationskraft wirkt als Zentripetalkraft: G · M · m / r² = m · v² / r. ${Math.abs(r.T / 3600 - 23.93) < 0.3 ? "<strong>Etwa ein Umlauf pro Erddrehung: Über dem Äquator steht der Satellit scheinbar still.</strong>" : ""}</p>` +
        note("Die Masse des Satelliten kürzt sich heraus. Kreisbahn ohne Reibung an Resten der Atmosphäre.")
      );
    }
    case "oscillation": {
      const y = harmonic(v.A, v.T, v.t);
      return (
        graph(
          Array.from({ length: 161 }, (_, i) => [i / 20, harmonic(v.A, v.T, i / 20)]),
          "Zeit in s",
          "Auslenkung in cm",
        ) +
        kv(
          [
            ["Frequenz in Hz", 1 / v.T],
            ["Schwingungen in 8 s", 8 / v.T],
            [`Auslenkung bei ${fmt(v.t)} s in cm`, y],
          ],
          "Harmonische Schwingung y(t) = A · sin(2π · t / T)",
        ) +
        note("Start im Nulldurchgang nach oben, ohne Dämpfung. Die Achsenskalierung passt sich an; lies die Zahlen mit.")
      );
    }
    case "spring": {
      const r = spring(v.m, v.D, v.A);
      return (
        kv(
          [
            ["Periodendauer in s", r.T],
            ["Frequenz in Hz", r.f],
            ["Schwingungsenergie in J", r.energy],
            ["Größte Geschwindigkeit in m/s", r.vMax],
          ],
          "Federpendel",
        ) +
        graph(
          Array.from({ length: 121 }, (_, i) => [i / 30, v.A * Math.cos((2 * Math.PI * (i / 30)) / r.T)]),
          "Zeit in s",
          "Auslenkung in cm",
        ) +
        note("Ideale Feder ohne Reibung: T = 2π · √(m / D). Die Amplitude ändert die Energie, aber nicht die Periodendauer.")
      );
    }
    case "pendulum": {
      const place = PLACES[v.ort],
        T = pendulumPeriod(v.l, place.g);
      return (
        `<p>${esc(place.name)} · g = ${fmt(place.g)} m/s² · <strong>T = ${fmt(T, 3)} s</strong> bei l = ${fmt(v.l)} m und m = ${fmt(v.m)} kg.</p>` +
        table(
          ["Pendellänge l in m", "Periodendauer T in s", "T² in s²", "T² / l in s²/m"],
          [0.25, 0.5, 1, 1.5, 2].map((l) => {
            const t = pendulumPeriod(l, place.g);
            return [l, t, t * t, (t * t) / l];
          }),
          "Grafische Auswertung: T² über l ergibt eine Ursprungsgerade",
        ) +
        note("Gilt für kleine Auslenkungen. Die Masse kommt in T = 2π · √(l / g) nicht vor; die Länge zählt bis zum Schwerpunkt des Pendelkörpers.")
      );
    }
    case "uncertainty": {
      const r = timingSample(v.n, v.periods, v.spread);
      return (
        table(
          ["Messung", "Periodendauer in s"],
          r.values.map((value, i) => [`Nr. ${i + 1}`, value]),
          `Je ${fmt(v.periods)} Schwingung(en) gestoppt und durch ${fmt(v.periods)} geteilt`,
        ) +
        kv(
          [
            ["Mittelwert in s", r.mean],
            ["Halbe Spannweite in s", r.halfRange],
            ["Standardabweichung in s", r.deviation],
          ],
          "Kenngrößen der Messreihe",
        ) +
        `<p>Ergebnis: T = (${fmt(r.mean)} ± ${fmt(Math.max(r.halfRange, 0.01))}) s.</p>` +
        note("Nachgebildete Stoppuhrwerte mit fester, reproduzierbarer Streuung. Der Stoppfehler verteilt sich auf alle gestoppten Schwingungen.")
      );
    }
    case "wave": {
      const r = wave(v.lambda, v.f);
      return (
        graph(
          Array.from({ length: 161 }, (_, i) => [i / 20, v.A * Math.sin((2 * Math.PI * (i / 20)) / v.lambda)]),
          "Ort in m",
          "Auslenkung in cm",
        ) +
        kv(
          [
            ["Ausbreitungsgeschwindigkeit c = λ · f in m/s", r.c],
            ["Periodendauer in s", r.T],
            ["Wellenlängen auf 8 m", 8 / v.lambda],
          ],
          "Momentbild einer Welle",
        ) +
        note("Das Bild zeigt alle Oszillatoren zu einem Zeitpunkt. Jeder schwingt an seinem Ort; transportiert wird Energie, kein Stoff.")
      );
    }
    case "superposition": {
      const amplitude = superpose(v.a1, v.a2, v.shift);
      return (
        graph(
          Array.from({ length: 121 }, (_, i) => {
            const x = i / 60;
            return [x, v.a1 * Math.sin(2 * Math.PI * x) + v.a2 * Math.sin(2 * Math.PI * (x - v.shift))];
          }),
          "Ort in Wellenlängen",
          "Summe der Auslenkungen in cm",
        ) +
        `<p>Amplitude der Überlagerung: <strong>${fmt(amplitude)} cm</strong>. ${amplitude < 1e-9 ? "Die Wellen löschen sich aus." : amplitude > v.a1 + v.a2 - 1e-9 ? "Die Wellen verstärken sich maximal." : "Teilweise Verstärkung oder Abschwächung."}</p>` +
        note("Superpositionsprinzip: An jedem Ort addieren sich die Auslenkungen mit Vorzeichen. Zwei Wellen gleicher Frequenz und Wellenlänge.")
      );
    }
    case "interference": {
      const r = interference(v.s1, v.s2, v.lambda);
      return (
        kv(
          [
            ["Gangunterschied Δs in m", r.ds],
            ["Δs in Wellenlängen", r.ratio],
          ],
          "Zwei gleichphasig schwingende Wellenzentren",
        ) +
        `<p><strong>${r.kind === "konstruktiv" ? "Konstruktive Interferenz: Δs ist ein ganzzahliges Vielfaches von λ." : r.kind === "destruktiv" ? "Destruktive Interferenz: Δs ist ein ungeradzahliges Vielfaches von λ / 2." : "Zwischen Maximum und Minimum: teilweise Verstärkung oder Abschwächung."}</strong></p>` +
        note("Gleiche Frequenz, gleiche Amplitude am Beobachtungsort angenommen. Bei ungleichen Amplituden bleibt im Minimum ein Rest.")
      );
    }
    case "standing": {
      const r = standing(v.L, v.n, v.c);
      return (
        graph(
          Array.from({ length: 101 }, (_, i) => {
            const x = (v.L * i) / 100;
            return [x, Math.abs(Math.sin((v.n * Math.PI * x) / v.L))];
          }),
          "Ort in m",
          "Schwingungsweite (relativ)",
        ) +
        kv(
          [
            ["Wellenlänge in m", r.lambda],
            ["Frequenz in Hz", r.f],
            ["Knoten einschließlich der Enden", r.nodes],
          ],
          "Stehende Welle mit zwei festen Enden",
        ) +
        note("Auf die Länge passen n halbe Wellenlängen: L = n · λ / 2. Benachbarte Knoten liegen λ / 2 auseinander.")
      );
    }
    case "doubleslit": {
      const spacing = fringeSpacing(v.lambda, v.b, v.a);
      return (
        fringes(spacing, colourHex(v.lambda), colourName(v.lambda)) +
        `<p>${esc(colourName(v.lambda))} · λ = ${fmt(v.lambda)} nm · Abstand benachbarter heller Streifen: <strong>${fmt(spacing)} mm</strong>.</p>` +
        note("Größere Wellenlänge oder kleinerer Spaltabstand: Die Streifen rücken auseinander. Der Lehrplan verlangt in Jahrgangsstufe 11 die qualitative Deutung; die Zahl dient nur dem Vergleich. Gleich helle Streifen sind eine Vereinfachung.")
      );
    }
    case "kepler": {
      const r = kepler(v.a, v.e);
      return (
        kv(
          [
            ["Umlaufdauer in Jahren", r.T],
            ["T² / a³ in a²/AE³", (r.T * r.T) / v.a ** 3],
            ["Kleinster Sonnenabstand (Perihel) in AE", r.perihel],
            ["Größter Sonnenabstand (Aphel) in AE", r.aphel],
            ["Geschwindigkeit im Perihel : im Aphel", r.speedRatio],
          ],
          "Bahn um die Sonne",
        ) +
        `<p>${v.e === 0 ? "Kreisbahn: Der Abstand und der Betrag der Geschwindigkeit bleiben gleich." : "Ellipse: In Sonnennähe läuft der Körper schneller als in Sonnenferne (2. Kepler’sches Gesetz)."}</p>` +
        note("Für alle Körper, die dieselbe Sonne umlaufen, hat T² / a³ denselben Wert (3. Kepler’sches Gesetz). In Jahren und Astronomischen Einheiten ist er 1.")
      );
    }
    case "hubble": {
      const r = hubble(v.d, v.h0);
      return (
        kv(
          [
            ["Fluchtgeschwindigkeit in km/s", r.v],
            ["Anteil der Lichtgeschwindigkeit in %", 100 * r.fraction],
            ["Grobe Altersabschätzung 1 / H₀ in Milliarden Jahren", r.ageGyr],
          ],
          "Hubble-Beziehung v = H₀ · d",
        ) +
        note("Gilt als Näherung für nicht zu große Entfernungen. Die Galaxien fliegen nicht durch den Raum davon: Der Raum zwischen ihnen dehnt sich. Messungen von H₀ liegen je nach Methode etwa zwischen 67 und 74 km/(s·Mpc).")
      );
    }
    case "frames": {
      const w = v.obj === 0 ? 1 : 0.5,
        r = platformSpeed(v.beta, w);
      return (
        table(
          ["Bezugssystem", "Geschwindigkeit in c"],
          [
            ["Im Zug gemessen", w],
            ["Vom Bahnsteig: klassische Erwartung (Addition)", r.classical],
            ["Vom Bahnsteig: Messung", r.measured],
          ],
          v.obj === 0 ? "Lichtblitz nach vorn" : "Körper nach vorn",
        ) +
        `<p>${v.obj === 0 ? "<strong>Licht hat in beiden Bezugssystemen dieselbe Geschwindigkeit c.</strong>" : "Auch der Körper bleibt unter c; die einfache Addition gilt nur für Geschwindigkeiten weit unter c."}</p>` +
        note("Zug und Bahnsteig sind Inertialsysteme. Die Messwerte folgen der relativistischen Geschwindigkeitsaddition; ihre Formel ist nicht Teil des Lehrplans.")
      );
    }
    case "lorentz": {
      const g = gamma(v.beta);
      return (
        kv(
          [
            ["Lorentzfaktor γ", g],
            ["Zeit im Ruhesystem des Beobachters in s", g * v.t0],
            ["Länge eines 100-m-Raumschiffs für den Beobachter in m", 100 / g],
          ],
          "Bewegte Uhr",
        ) +
        graph(
          Array.from({ length: 96 }, (_, i) => [i / 100, gamma(i / 100)]),
          "Geschwindigkeit in c",
          "Lorentzfaktor γ",
        ) +
        note("Δt = γ · Δt₀ mit γ = 1 / √(1 − v² / c²). Bei Alltagsgeschwindigkeiten ist γ praktisch 1: Dort stimmt die klassische Mechanik.")
      );
    }
    case "muon": {
      const r = muon(v.beta, v.h);
      return (
        kv(
          [
            ["Lorentzfaktor γ", r.gamma],
            ["Lebensdauer im Erdsystem in µs", r.labLifetime * 1e6],
            ["Mittlere Flugstrecke klassisch in km", r.classicalReach / 1000],
            ["Mittlere Flugstrecke mit Zeitdilatation in km", r.reach / 1000],
            ["Höhe der Atmosphäre im Myonensystem in km", r.contractedHeight / 1000],
            ["Am Boden erwarteter Anteil klassisch in %", 100 * r.classicalShare],
            ["Am Boden erwarteter Anteil relativistisch in %", 100 * r.share],
          ],
          "Myonen aus der Höhenstrahlung",
        ) +
        note("Mittlere Lebensdauer ruhender Myonen 2,2 µs. Vereinfachtes Modell: eine einzige Geschwindigkeit, senkrechter Flug, kein Energieverlust in der Luft.")
      );
    }
    case "chain": {
      const r = chain(100, [v.e1, v.e2, v.e3]);
      const bar = (label: string, n: number, color: string) =>
        `<div class="energy-row"><span>${label}</span><span class="energy-bar" style="--bar:${n}%;--bar-color:${color}"></span><strong>${fmt(n)} kWh</strong></div>`;
      return `<div class="energy-flow" role="img" aria-label="Von 100 Kilowattstunden werden ${fmt(r.useful)} genutzt und ${fmt(r.devalued)} entwertet">${bar("Genutzt", r.useful, "var(--accent)")}${bar("Entwertet", r.devalued, "var(--muted)")}</div><p>Gesamtwirkungsgrad: <strong>${fmt(r.total)} %</strong> von 100 kWh zugeführter Energie.</p>${note("Wirkungsgrade einer Kette multiplizieren sich. Die entwertete Energie ist nicht verschwunden; sie verteilt sich als innere Energie in der Umgebung. Frei gewählte Beispielwerte.")}`;
    }
    case "utility": {
      const weights = [v.w1, v.w2, v.w3],
        values = UTILITY_OPTIONS.map((o) => utility(weights, o.scores)),
        sum = v.w1 + v.w2 + v.w3;
      return (
        table(
          ["Kriterium", "Gewicht", ...UTILITY_OPTIONS.map((o) => o.name)],
          [
            ...UTILITY_CRITERIA.map((c, i) => [c, weights[i], ...UTILITY_OPTIONS.map((o) => o.scores[i])]),
            ["Nutzwert (gewichteter Mittelwert)", sum, ...values],
          ],
          "Nutzwertanalyse · Punkte von 1 (schwach) bis 5 (stark)",
        ) +
        `<p><strong>${sum === 0 ? "Ohne Gewichte gibt es kein Ergebnis." : Math.abs(values[0] - values[1]) < 1e-9 ? "Beide Optionen liegen gleichauf." : `Vorn liegt: ${esc(UTILITY_OPTIONS[values[0] > values[1] ? 0 : 1].name)}.`}</strong></p>` +
        note("Die Punkte sind frei gewählte Beispielbewertungen, keine Messdaten. Die Gewichte sind eine Wertentscheidung und gehören offen genannt; die Physik liefert die Daten für die Punkte.")
      );
    }
    case "saving": {
      const r = saving(v.pOld, v.pNew, v.h, v.price);
      return (
        kv(
          [
            ["Jahresenergie bisher in kWh", r.oldKwh],
            ["Jahresenergie neu in kWh", r.newKwh],
            ["Eingesparte Energie pro Jahr in kWh", r.savedKwh],
            ["Eingesparte Kosten pro Jahr in €", r.savedEuro],
          ],
          "E = P · t über 365 Tage",
        ) +
        note("Gleicher Nutzen bei kleinerer Leistung ist Energieeffizienz; kürzere Betriebsdauer ist Einsparen durch Verhalten. Strompreis frei wählbar.")
      );
    }
    case "euler": {
      const rows = eulerFall(1, v.k, v.dt, 6);
      return (
        table(
          ["Zeit in s", "Geschwindigkeit in m/s", "Beschleunigung in m/s²", "Δv = a · Δt in m/s"],
          rows.map((row) => [row.t, row.v, row.a, row.a * v.dt]),
          "Fall aus der Ruhe · m = 1 kg · Schritt für Schritt",
        ) +
        `<p>${v.k === 0 ? "Ohne Luftwiderstand bleibt a = g: Die Schritte liefern genau v = g · t." : "Mit Luftwiderstand sinkt die Beschleunigung von Schritt zu Schritt."}</p>` +
        note("In jedem Zeitabschnitt gilt die Kraft als konstant: a = g − k · v² / m, dann v_neu = v + a · Δt. Kleinere Schritte nähern die wirkliche Bewegung besser an.")
      );
    }
    case "airfall": {
      const steps = Math.round(20 / v.dt),
        rows = eulerFall(v.m, v.k, v.dt, steps),
        end = terminalSpeed(v.m, v.k);
      return (
        graph(
          rows.map((row) => [row.t, row.v]),
          "Zeit in s",
          "Geschwindigkeit in m/s",
        ) +
        kv(
          [
            ["Geschwindigkeit nach 5 s in m/s", rows[Math.round(5 / v.dt)].v],
            ["Geschwindigkeit nach 20 s in m/s", rows[steps].v],
            ["Anzahl der Rechenschritte", steps],
          ],
          "Simulation mit der Methode der kleinen Schritte",
        ) +
        `<p>${end === null ? "Ohne Luftwiderstand gibt es keine Endgeschwindigkeit: v wächst gleichmäßig." : `Endgeschwindigkeit aus dem Kräftegleichgewicht: <strong>${fmt(end)} m/s</strong>.`}</p>` +
        note("Luftwiderstand F_L = k · v². Ein grober Zeitschritt lässt die Kurve eckig werden und kann über die Endgeschwindigkeit hinausschießen.")
      );
    }
    case "eulerosc": {
      const r = eulerOscillation(v.m, v.D, v.dt);
      return (
        graph(
          r.points.map(([t, x]) => [t, x * 100]),
          "Zeit in s",
          "Auslenkung in cm",
        ) +
        kv(
          [
            ["Periodendauer aus der Simulation in s", r.simulated ?? "–"],
            ["Periodendauer nach T = 2π · √(m / D) in s", r.exact],
            ["Rechenschritte für 4 s", Math.round(4 / v.dt)],
          ],
          "Federpendel, losgelassen bei 5 cm",
        ) +
        note("Rechenvorschrift je Schritt: a = −D · x / m, v_neu = v + a · Δt, x_neu = x + v_neu · Δt. Reibung ist nicht modelliert.")
      );
    }
    case "solar": {
      const point = solarPoint(v.irr, v.r),
        mpp = solarMpp(v.irr);
      return (
        graph(
          Array.from({ length: 66 }, (_, i) => [i / 100, Math.max(0, solarCurrent(v.irr, i / 100))]),
          "Spannung in V",
          "Stromstärke in A",
        ) +
        kv(
          [
            ["Spannung am Lastwiderstand in V", point.u],
            ["Stromstärke in A", point.i],
            ["Abgegebene Leistung in W", point.p],
            ["Leistung im Maximum-Power-Point in W", mpp.p],
            ["Spannung im MPP in V", mpp.u],
            ["Passender Lastwiderstand im MPP in Ω", mpp.r],
          ],
          "Arbeitspunkt auf der U-I-Kennlinie",
        ) +
        `<p>Du nutzt <strong>${fmt((100 * point.p) / mpp.p)} %</strong> der möglichen Leistung.</p>` +
        note("Modellzelle mit Kurzschlussstromstärke 0,5 A bei 1000 W/m² und Leerlaufspannung etwa 0,6 V. Temperatur konstant. Die Achsenskalierung passt sich an.")
      );
    }
    case "pvplant": {
      const r = pvPlant(v.kwp, v.spec, v.self, v.price);
      return (
        kv(
          [
            ["Jahresertrag in kWh", r.energy],
            ["Selbst verbraucht in kWh", r.own],
            ["Eingespeist in kWh", r.fed],
            ["Geldwert pro Jahr in €", r.euro],
          ],
          "Abschätzung für eine Dachanlage",
        ) +
        note(`Jahresertrag = installierte Leistung · spezifischer Ertrag. Einspeisevergütung hier fest ${FEED_IN_CT} ct/kWh als Rechenbeispiel; echte Vergütungen und Preise ändern sich. Ohne Anschaffungskosten, Alterung und Speicherverluste.`)
      );
    }
    case "ride": {
      const r = ride(v.r, v.T);
      return (
        kv(
          [
            ["Bahngeschwindigkeit in m/s", r.v],
            ["Bahngeschwindigkeit in km/h", r.v * 3.6],
            ["Zentripetalbeschleunigung in m/s²", r.a],
            ["Als Vielfaches von g", r.gFactor],
          ],
          "Waagrechte Kreisbahn eines Fahrgeschäfts",
        ) +
        `<p>${r.gFactor > 3 ? "Solche Werte hält der Körper nur kurz aus; Fahrgeschäfte begrenzen Dauer und Richtung der Belastung." : "Im mitbewegten Sitz spürst du diese Beschleunigung als Kraft nach außen: eine Scheinkraft."}</p>` +
        note(`g = ${fmt(G_EARTH)} m/s². Nur die Kreisbewegung, ohne das Kippen der Sitze und ohne Anfahr- und Bremsphasen.`)
      );
    }
    case "chaos": {
      const first = logistic(v.r, v.x0, 30),
        second = logistic(v.r, v.x0 + v.d / 1000, 30),
        gap = Math.abs(first[30] - second[30]);
      return (
        table(
          ["Schritt", "Lauf 1", "Lauf 2", "Unterschied"],
          [0, 5, 10, 15, 20, 25, 30].map((i) => [`${i}`, first[i], second[i], Math.abs(first[i] - second[i])]),
          `Zwei Läufe · Startwerte ${fmt(v.x0, 3)} und ${fmt(v.x0 + v.d / 1000, 3)}`,
        ) +
        `<p><strong>${gap < 0.01 ? "Ähnliche Ursachen, ähnliche Wirkungen: starke Kausalität. Eine Vorhersage ist möglich." : "Der winzige Unterschied wächst an: Die starke Kausalität ist verletzt. Eine Langzeitvorhersage ist nicht möglich."}</strong></p>` +
        note("Einfache Rechenregel x_neu = r · x · (1 − x) als Beispiel für ein Modell, dessen Verhalten vom Parameter abhängt. Jeder Schritt ist eindeutig festgelegt; unvorhersagbar wird es durch die Empfindlichkeit gegenüber dem Startwert.")
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
