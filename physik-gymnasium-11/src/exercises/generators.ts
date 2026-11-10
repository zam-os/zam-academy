import type { CalculationKind, ExerciseTask, Level } from "../model/types";
import { fmt } from "./format";
import type { Rng } from "./rng";

const G_EARTH = 9.81;
const G = 6.674e-11;
const PI2 = 2 * Math.PI;
/** Speeds with a Lorentz factor that is easy to check: 0,6 c gives 1,25 and 0,8 c gives 5/3. */
const BETAS = [0.6, 0.8, 0.9, 0.95];
const lorentz = (beta: number) => 1 / Math.sqrt(1 - beta * beta);

/**
 * Level 1 is guided: the values and the formula fit directly. Level 2 is a
 * transfer task: a unit has to be converted, a formula rearranged or two
 * steps combined. Every task draws three integers a, b and c.
 */
export function makeExercise(
  kind: CalculationKind,
  rng: Rng,
  level: Level,
): ExerciseTask {
  const a = rng.int(2, 8),
    b = rng.int(2, 6),
    c = rng.int(2, 5);
  const task = (
    prompt: string,
    answer: number,
    unit: string,
    formula: string,
    solution: string,
  ): ExerciseTask => ({
    prompt,
    answer,
    unit,
    digits: 3,
    tolerance: 0.01,
    formulaHint: formula,
    solutionHtml: solution,
  });
  switch (kind) {
    case "circular": {
      const v1 = (PI2 * a) / (2 * b),
        r2 = a * 0.05,
        v2 = PI2 * r2 * b;
      return level === 1
        ? task(
            `Ein Karussellsitz läuft auf einer Kreisbahn mit r = ${a} m und braucht für einen Umlauf ${2 * b} s. Berechne die Bahngeschwindigkeit.`,
            v1,
            "m/s",
            "v = 2π · r / T",
            `2π · ${a} m / ${2 * b} s = ${fmt(v1, 3)} m/s.`,
          )
        : task(
            `Ein Rad mit dem Durchmesser ${a * 10} cm dreht sich ${b * 60}-mal pro Minute. Wie schnell bewegt sich ein Punkt am Rand?`,
            v2,
            "m/s",
            "v = 2π · r · f",
            `r = ${fmt(r2)} m und f = ${b} Hz. 2π · ${fmt(r2)} · ${b} = ${fmt(v2, 3)} m/s.`,
          );
    }
    case "centripetal": {
      const m = a / 10,
        r = c / 2,
        f1 = (m * b * b) / r,
        mass2 = b / 10,
        fMax = a * 10,
        v2 = Math.sqrt((fMax * r) / mass2);
      return level === 1
        ? task(
            `Ein Körper mit m = ${fmt(m)} kg läuft mit v = ${b} m/s auf einer Kreisbahn mit r = ${fmt(r)} m. Berechne die Zentripetalkraft.`,
            f1,
            "N",
            "F_Z = m · v² / r",
            `${fmt(m)} · ${b}² / ${fmt(r)} = ${fmt(f1, 3)} N.`,
          )
        : task(
            `Ein Faden reißt bei ${fMax} N. An ihm kreist ein Körper mit ${fmt(mass2)} kg waagrecht auf einer Bahn mit r = ${fmt(r)} m. Bis zu welcher Bahngeschwindigkeit hält der Faden?`,
            v2,
            "m/s",
            "v = √(F_Z · r / m)",
            `√(${fMax} · ${fmt(r)} / ${fmt(mass2)}) = ${fmt(v2, 3)} m/s.`,
          );
    }
    case "centriexp": {
      const f1 = a / 2,
        m = a * 0.05,
        r = b / 10,
        period = 0.4 * c,
        f2 = (m * PI2 * PI2 * r) / (period * period);
      return level === 1
        ? task(
            `Im Experiment misst du bei einer festen Winkelgeschwindigkeit die Zentripetalkraft ${fmt(f1)} N. Welche Kraft erwartest du bei ${c}-facher Winkelgeschwindigkeit, wenn Masse und Radius gleich bleiben?`,
            f1 * c * c,
            "N",
            "F_Z = m · ω² · r",
            `F ist proportional zu ω²: ${fmt(f1)} N · ${c}² = ${fmt(f1 * c * c)} N.`,
          )
        : task(
            `Ein Körper mit ${a * 50} g kreist auf einer Bahn mit r = ${fmt(r)} m. Für 10 Umläufe stoppst du ${4 * c} s. Welche Zentripetalkraft sollte der Kraftsensor anzeigen?`,
            f2,
            "N",
            "F_Z = m · (2π / T)² · r",
            `T = ${fmt(period)} s, m = ${fmt(m)} kg. ${fmt(m)} · (2π / ${fmt(period)})² · ${fmt(r)} = ${fmt(f2, 3)} N.`,
          );
    }
    case "curve": {
      const m = a * 300,
        v = b * 5,
        r = c * 25,
        f1 = (m * v * v) / r,
        mu = a / 10,
        r2 = b * 20,
        v2 = Math.sqrt(mu * G_EARTH * r2) * 3.6;
      return level === 1
        ? task(
            `Ein Auto (m = ${m} kg) fährt mit ${b * 18} km/h durch eine Kurve mit r = ${r} m. Wie groß ist die nötige Zentripetalkraft?`,
            f1,
            "N",
            "F_Z = m · v² / r",
            `${b * 18} km/h = ${v} m/s. ${m} · ${v}² / ${r} = ${fmt(f1, 1)} N.`,
          )
        : task(
            `Auf einer ebenen Kurve mit r = ${r2} m beträgt die Haftreibungszahl ${fmt(mu)}. Mit welcher Geschwindigkeit kann ein Auto höchstens fahren, ohne zu rutschen? g = 9,81 m/s².`,
            v2,
            "km/h",
            "μ · m · g = m · v² / r",
            `Die Masse kürzt sich: v = √(${fmt(mu)} · 9,81 · ${r2}) = ${fmt(v2 / 3.6, 3)} m/s = ${fmt(v2, 2)} km/h.`,
          );
    }
    case "gravity": {
      const g1 = (G * a * 1e24) / (b * 1e6) ** 2,
        f = a * 100;
      return level === 1
        ? task(
            `Ein Planet hat die Masse ${a} · 10²⁴ kg und den Radius ${b * 1000} km. Berechne die Fallbeschleunigung an seiner Oberfläche. G = 6,674 · 10⁻¹¹ m³/(kg·s²).`,
            g1,
            "m/s²",
            "g = G · M / r²",
            `6,674 · 10⁻¹¹ · ${a} · 10²⁴ / (${b} · 10⁶)² = ${fmt(g1, 3)} m/s².`,
          )
        : task(
            `Auf einen Satelliten wirkt im Abstand r vom Erdmittelpunkt die Gravitationskraft ${f} N. Wie groß ist sie im ${c}-fachen Abstand?`,
            f / (c * c),
            "N",
            "F ~ 1 / r²",
            `${c}-facher Abstand bedeutet 1 / ${c * c} der Kraft: ${f} N / ${c * c} = ${fmt(f / (c * c), 3)} N.`,
          );
    }
    case "orbit": {
      const r1 = (a + 5) * 1e6,
        v1 = Math.sqrt(3.986e14 / r1) / 1000,
        r2 = a * 1e7,
        period = b * 2 * 3600,
        mass = (PI2 * PI2 * r2 ** 3) / (G * period * period) / 1e24;
      return level === 1
        ? task(
            `Ein Satellit umkreist die Erde auf einer Bahn mit r = ${(a + 5) * 1000} km (vom Erdmittelpunkt). Berechne seine Bahngeschwindigkeit. G · M_Erde = 3,986 · 10¹⁴ m³/s².`,
            v1,
            "km/s",
            "v = √(G · M / r)",
            `√(3,986 · 10¹⁴ / ${a + 5} · 10⁶) m/s = ${fmt(v1, 3)} km/s.`,
          )
        : task(
            `Ein Mond umrundet einen Planeten auf einer Kreisbahn mit r = ${a * 10000} km in ${b * 2} h. Bestimme die Masse des Planeten als Vielfaches von 10²⁴ kg. G = 6,674 · 10⁻¹¹ m³/(kg·s²).`,
            mass,
            "· 10²⁴ kg",
            "G · M · m / r² = m · (2π / T)² · r",
            `M = 4π² · r³ / (G · T²) mit r = ${a} · 10⁷ m und T = ${period} s: ${fmt(mass, 3)} · 10²⁴ kg.`,
          );
    }
    case "oscillation": {
      const period = (4 * b) / (5 * a),
        fraction = [12, 8, 6, 4][c - 2],
        y = a * Math.sin(PI2 / fraction);
      return level === 1
        ? task(
            `Ein Pendel führt ${5 * a} vollständige Schwingungen in ${4 * b} s aus. Berechne die Periodendauer.`,
            period,
            "s",
            "T = t / n",
            `${4 * b} s / ${5 * a} = ${fmt(period, 3)} s.`,
          )
        : task(
            `Eine harmonische Schwingung hat die Amplitude ${a} cm und die Periodendauer ${b} s. Sie startet im Nulldurchgang nach oben. Wie groß ist die Auslenkung nach ${fmt(b / fraction, 3)} s?`,
            y,
            "cm",
            "y(t) = A · sin(2π · t / T)",
            `t / T = 1 / ${fraction}. ${a} cm · sin(2π / ${fraction}) = ${fmt(y, 3)} cm. Achte auf das Bogenmaß.`,
          );
    }
    case "spring": {
      const m = a / 10,
        D = b * 10,
        period = PI2 * Math.sqrt(m / D),
        vMax = (c / 100) * Math.sqrt(D / m);
      return level === 1
        ? task(
            `An einer Feder mit D = ${D} N/m schwingt ein Körper mit m = ${a * 100} g. Berechne die Periodendauer.`,
            period,
            "s",
            "T = 2π · √(m / D)",
            `2π · √(${fmt(m)} / ${D}) = ${fmt(period, 3)} s.`,
          )
        : task(
            `Ein Federpendel (D = ${D} N/m, m = ${a * 100} g) schwingt mit der Amplitude ${c} cm. Mit welcher Geschwindigkeit geht der Körper durch die Ruhelage?`,
            vMax,
            "m/s",
            "½ · D · A² = ½ · m · v²",
            `v = A · √(D / m) = ${fmt(c / 100)} · √(${D} / ${fmt(m)}) = ${fmt(vMax, 3)} m/s.`,
          );
    }
    case "pendulum": {
      const l1 = a * 0.25,
        t1 = PI2 * Math.sqrt(l1 / G_EARTH),
        l2 = b * 0.5,
        place = [
          { name: "dem Mond", g: 1.62 },
          { name: "dem Mars", g: 3.71 },
          { name: "der Venus", g: 8.87 },
          { name: "der Erde", g: 9.81 },
        ][c - 2],
        t10 = Math.round(100 * PI2 * Math.sqrt(l2 / place.g)) / 10,
        g2 = (PI2 * PI2 * l2) / (t10 / 10) ** 2;
      return level === 1
        ? task(
            `Ein Fadenpendel hat die Länge ${fmt(l1)} m. Berechne die Periodendauer für kleine Auslenkungen. g = 9,81 m/s².`,
            t1,
            "s",
            "T = 2π · √(l / g)",
            `2π · √(${fmt(l1)} / 9,81) = ${fmt(t1, 3)} s.`,
          )
        : task(
            `Auf ${place.name} braucht ein Fadenpendel der Länge ${fmt(l2)} m für 10 Schwingungen ${fmt(t10, 1)} s. Bestimme daraus die Fallbeschleunigung.`,
            g2,
            "m/s²",
            "g = 4π² · l / T²",
            `T = ${fmt(t10 / 10, 2)} s. 4π² · ${fmt(l2)} / ${fmt(t10 / 10, 2)}² = ${fmt(g2, 3)} m/s².`,
          );
    }
    case "uncertainty": {
      const base = 1 + a / 10,
        values = [base, base + 0.02 * b, base - 0.01 * c, base + 0.01, base + 0.04],
        mean = values.reduce((x, y) => x + y, 0) / 5,
        rel = (0.1 * b * 100) / (3 * a);
      return level === 1
        ? task(
            `Fünf Messungen einer Periodendauer ergeben ${values.map((v) => fmt(v, 2)).join(" s; ")} s. Berechne den Mittelwert.`,
            mean,
            "s",
            "Mittelwert = Summe / Anzahl",
            `Summe ${fmt(mean * 5, 2)} s geteilt durch 5 = ${fmt(mean, 3)} s.`,
          )
        : task(
            `Du stoppst für 10 Schwingungen ${3 * a} s; deine Stoppuhrbedienung ist auf ±${fmt(0.1 * b)} s genau. Wie groß ist die relative Messunsicherheit der Periodendauer in Prozent?`,
            rel,
            "%",
            "relative Unsicherheit = Δt / t",
            `${fmt(0.1 * b)} s / ${3 * a} s = ${fmt(rel, 3)} %. Beim Teilen durch 10 bleibt die relative Unsicherheit gleich.`,
          );
    }
    case "wave": {
      const lambda = a / 2,
        f = a * 250,
        l2 = 34000 / f;
      return level === 1
        ? task(
            `Eine Seilwelle hat die Wellenlänge ${fmt(lambda)} m und die Frequenz ${b} Hz. Berechne die Ausbreitungsgeschwindigkeit.`,
            lambda * b,
            "m/s",
            "c = λ · f",
            `${fmt(lambda)} m · ${b} Hz = ${fmt(lambda * b)} m/s.`,
          )
        : task(
            `Ein Lautsprecher sendet einen Ton mit ${fmt(f, 0)} Hz. Wie groß ist die Wellenlänge in Luft in Zentimetern? Schallgeschwindigkeit 340 m/s.`,
            l2,
            "cm",
            "λ = c / f",
            `340 m/s / ${fmt(f, 0)} Hz = ${fmt(l2 / 100, 4)} m = ${fmt(l2, 3)} cm.`,
          );
    }
    case "interference": {
      const lambda = c / 4,
        ratio = (0.5 * b) / lambda,
        ds = a / 10,
        f = 340 / (2 * ds);
      return level === 1
        ? task(
            `Ein Punkt ist ${a} m vom ersten und ${fmt(a + 0.5 * b)} m vom zweiten Wellenzentrum entfernt. Die Wellenlänge beträgt ${fmt(lambda)} m. Wie viele Wellenlängen beträgt der Gangunterschied?`,
            ratio,
            "λ",
            "Δs = |s₂ − s₁|",
            `Δs = ${fmt(0.5 * b)} m. ${fmt(0.5 * b)} / ${fmt(lambda)} = ${fmt(ratio, 3)} Wellenlängen. Ganzzahlig bedeutet Verstärkung, halbzahlig Auslöschung.`,
          )
        : task(
            `Zwei Lautsprecher schwingen gleichphasig. Am Mikrofon beträgt der Gangunterschied ${fmt(ds)} m. Bei welcher kleinsten Frequenz löschen sich die Schallwellen dort aus? c = 340 m/s.`,
            f,
            "Hz",
            "Δs = λ / 2",
            `λ = 2 · ${fmt(ds)} m = ${fmt(2 * ds)} m. f = 340 / ${fmt(2 * ds)} = ${fmt(f, 2)} Hz.`,
          );
    }
    case "standing": {
      const L = a / 10,
        lambda = (2 * L) / c,
        speed = b * 100,
        f = (c * speed) / (2 * L);
      return level === 1
        ? task(
            `Auf einer ${fmt(L)} m langen, beidseitig eingespannten Saite bildet sich eine stehende Welle mit ${c} Schwingungsbäuchen. Berechne die Wellenlänge.`,
            lambda,
            "m",
            "L = n · λ / 2",
            `λ = 2 · ${fmt(L)} m / ${c} = ${fmt(lambda, 3)} m.`,
          )
        : task(
            `Eine Saite ist ${a * 10} cm lang; Wellen laufen auf ihr mit ${speed} m/s. Welche Frequenz hat die Eigenschwingung mit ${c} Schwingungsbäuchen?`,
            f,
            "Hz",
            "f = n · c / (2 · L)",
            `${c} · ${speed} / (2 · ${fmt(L)}) = ${fmt(f, 2)} Hz.`,
          );
    }
    case "light": {
      const nm = 350 + a * 50,
        f1 = 3e8 / (nm * 1e-9) / 1e14,
        f2 = b + 3,
        l2 = (3e8 / (f2 * 1e14)) * 1e9;
      return level === 1
        ? task(
            `Licht hat im Vakuum die Wellenlänge ${nm} nm. Berechne seine Frequenz als Vielfaches von 10¹⁴ Hz. c = 3,00 · 10⁸ m/s.`,
            f1,
            "· 10¹⁴ Hz",
            "f = c / λ",
            `3,00 · 10⁸ / (${nm} · 10⁻⁹) Hz = ${fmt(f1, 3)} · 10¹⁴ Hz.`,
          )
        : task(
            `Ein Laser sendet Licht der Frequenz ${f2} · 10¹⁴ Hz aus. Welche Wellenlänge in Nanometern hat es im Vakuum? c = 3,00 · 10⁸ m/s.`,
            l2,
            "nm",
            "λ = c / f",
            `3,00 · 10⁸ / (${f2} · 10¹⁴) m = ${fmt(l2, 2)} nm.`,
          );
    }
    case "kepler":
      return level === 1
        ? task(
            `Ein Kleinplanet umläuft die Sonne mit der großen Halbachse ${b} AE. Berechne seine Umlaufdauer in Jahren.`,
            b ** 1.5,
            "a",
            "T² / a³ = 1 a²/AE³",
            `T = √(${b}³) a = ${fmt(b ** 1.5, 3)} a.`,
          )
        : task(
            `Ein Komet braucht für einen Umlauf um die Sonne ${a * a} Jahre. Wie groß ist die große Halbachse seiner Bahn in AE?`,
            (a * a) ** (2 / 3),
            "AE",
            "T² / a³ = 1 a²/AE³",
            `a = ∛(${a * a}²) AE = ${fmt((a * a) ** (2 / 3), 3)} AE.`,
          );
    case "hubble":
      return level === 1
        ? task(
            `Eine Galaxie ist ${a * 50} Mpc entfernt. Welche Fluchtgeschwindigkeit erwartest du mit H₀ = 70 km/(s·Mpc)?`,
            a * 3500,
            "km/s",
            "v = H₀ · d",
            `70 · ${a * 50} = ${fmt(a * 3500, 0)} km/s.`,
          )
        : task(
            `Aus der Rotverschiebung einer Galaxie folgt die Fluchtgeschwindigkeit ${fmt(b * 7000, 0)} km/s. Schätze ihre Entfernung in Megaparsec ab. H₀ = 70 km/(s·Mpc).`,
            b * 100,
            "Mpc",
            "d = v / H₀",
            `${fmt(b * 7000, 0)} / 70 = ${b * 100} Mpc.`,
          );
    case "lorentz": {
      const beta = BETAS[c - 2],
        g = lorentz(beta),
        beta2 = BETAS[b % 2],
        shown = Math.round(a * lorentz(beta2) * 100) / 100,
        solved = Math.sqrt(1 - (a / shown) ** 2);
      return level === 1
        ? task(
            `In einem Raumschiff, das mit ${fmt(beta)} c an der Erde vorbeifliegt, vergehen ${a} s. Welche Zeit vergeht währenddessen für Beobachter auf der Erde?`,
            a * g,
            "s",
            "Δt = Δt₀ / √(1 − v² / c²)",
            `γ = 1 / √(1 − ${fmt(beta)}²) = ${fmt(g, 3)}. ${a} s · ${fmt(g, 3)} = ${fmt(a * g, 3)} s.`,
          )
        : task(
            `Eine Borduhr zeigt ${a} Jahre Flugzeit, auf der Erde sind ${fmt(shown)} Jahre vergangen. Mit welchem Anteil der Lichtgeschwindigkeit flog das Raumschiff?`,
            solved,
            "c",
            "γ = Δt / Δt₀ und v = c · √(1 − 1 / γ²)",
            `γ = ${fmt(shown)} / ${a} = ${fmt(shown / a, 3)}. √(1 − 1 / γ²) = ${fmt(solved, 3)}, also v = ${fmt(solved, 3)} c.`,
          );
    }
    case "contraction": {
      const beta = BETAS[c - 2],
        g = lorentz(beta),
        beta2 = [0.98, 0.99, 0.995, 0.999][c - 2],
        g2 = lorentz(beta2),
        km = (beta2 * 3e8 * g2 * a * 1e-6) / 1000;
      return level === 1
        ? task(
            `Ein Raumschiff hat die Eigenlänge ${a * 25} m und fliegt mit ${fmt(beta)} c an dir vorbei. Welche Länge misst du?`,
            (a * 25) / g,
            "m",
            "l = l₀ · √(1 − v² / c²)",
            `${a * 25} m · √(1 − ${fmt(beta)}²) = ${fmt((a * 25) / g, 3)} m.`,
          )
        : task(
            `Ein Teilchen hat in seinem Ruhesystem die mittlere Lebensdauer ${a} µs und fliegt mit ${fmt(beta2, 3)} c. Wie weit kommt es im Erdsystem im Mittel? Rechne mit c = 3,00 · 10⁸ m/s und gib Kilometer an.`,
            km,
            "km",
            "s = v · γ · Δt₀",
            `γ = ${fmt(g2, 3)}. Lebensdauer im Erdsystem ${fmt(g2 * a, 3)} µs. ${fmt(beta2, 3)} · 3,00 · 10⁸ m/s · ${fmt(g2 * a, 3)} · 10⁻⁶ s = ${fmt(km, 3)} km.`,
          );
    }
    case "efficiency": {
      const input = a * 100,
        eta1 = 30 + 5 * c,
        eta3 = b * 10,
        need = a / ((eta1 / 100) * 0.95 * (eta3 / 100));
      return level === 1
        ? task(
            `Ein Motor nimmt ${input} kJ auf und gibt ${input - a * b * 10} kJ als Abwärme an die Umgebung ab. Berechne seinen Wirkungsgrad in Prozent.`,
            b * 10,
            "%",
            "η = E_nutz / E_zu",
            `Genutzt werden ${a * b * 10} kJ. ${a * b * 10} / ${input} = ${b * 10} %.`,
          )
        : task(
            `Ein Kraftwerk (η = ${eta1} %) versorgt über das Netz (η = 95 %) eine Lampe (η = ${eta3} %). Wie viel Primärenergie braucht es für ${a} kWh Licht?`,
            need,
            "kWh",
            "η_gesamt = η₁ · η₂ · η₃",
            `η_gesamt = ${fmt(eta1 / 100)} · 0,95 · ${fmt(eta3 / 100)} = ${fmt((eta1 / 100) * 0.95 * (eta3 / 100), 4)}. ${a} kWh / η_gesamt = ${fmt(need, 3)} kWh.`,
          );
    }
    case "fullload": {
      const hours = 800 + 50 * c,
        power = (a * 10000) / hours;
      return level === 1
        ? task(
            `Eine Windenergieanlage hat die Nennleistung ${a} MW und erreicht ${b * 500} Volllaststunden im Jahr. Wie viel Energie liefert sie pro Jahr?`,
            a * b * 500,
            "MWh",
            "E = P · t",
            `${a} MW · ${b * 500} h = ${fmt(a * b * 500, 0)} MWh.`,
          )
        : task(
            `Eine Stadt braucht ${a * 10} GWh elektrische Energie im Jahr. Photovoltaik erreicht dort ${hours} Volllaststunden. Welche Leistung in Megawatt müsste installiert sein, um diese Jahresenergie zu liefern?`,
            power,
            "MW",
            "P = E / t",
            `${a * 10} GWh = ${fmt(a * 10000, 0)} MWh. ${fmt(a * 10000, 0)} / ${hours} = ${fmt(power, 3)} MW. Die Rechnung sagt nichts über den Zeitpunkt der Lieferung.`,
          );
    }
    case "saving": {
      const e1 = (a * 10 * b * 365) / 1000,
        led = a + 4,
        price = 25 + 5 * c,
        euro = (((60 - led) * b * 365) / 1000) * (price / 100);
      return level === 1
        ? task(
            `Ein Gerät mit ${a * 10} W läuft täglich ${b} h. Wie viel elektrische Energie braucht es in einem Jahr (365 Tage)?`,
            e1,
            "kWh",
            "E = P · t",
            `${fmt((a * 10) / 1000)} kW · ${b} h · 365 = ${fmt(e1, 3)} kWh.`,
          )
        : task(
            `Eine 60-W-Glühlampe wird durch eine LED mit ${led} W ersetzt. Sie leuchtet täglich ${b} h; der Strompreis beträgt ${price} ct/kWh. Wie viel Geld spart das in einem Jahr?`,
            euro,
            "€",
            "ΔE = ΔP · t",
            `ΔP = ${60 - led} W. ${fmt((60 - led) / 1000, 3)} kW · ${b} h · 365 = ${fmt(((60 - led) * b * 365) / 1000, 3)} kWh; mal ${fmt(price / 100)} €/kWh = ${fmt(euro, 2)} €.`,
          );
    }
    case "euler": {
      const dt1 = c / 10,
        D = b * 10,
        dt2 = c * 0.05,
        acc = (-D * (a / 100)) / 0.5,
        v2 = acc * dt2;
      return level === 1
        ? task(
            `Ein Körper hat die Geschwindigkeit ${a} m/s. Im nächsten Zeitschritt Δt = ${fmt(dt1)} s gilt die Beschleunigung ${b} m/s² als konstant. Welche Geschwindigkeit hat er danach?`,
            a + b * dt1,
            "m/s",
            "v_neu = v + a · Δt",
            `${a} + ${b} · ${fmt(dt1)} = ${fmt(a + b * dt1, 3)} m/s.`,
          )
        : task(
            `Ein Federpendel (m = 0,5 kg, D = ${D} N/m) ruht bei der Auslenkung x = +${a} cm und wird losgelassen. Welche Geschwindigkeit liefert die Methode der kleinen Schritte nach einem Schritt mit Δt = ${fmt(dt2)} s? Achte auf das Vorzeichen.`,
            v2,
            "m/s",
            "a = −D · x / m, dann v_neu = v + a · Δt",
            `a = −${D} · ${fmt(a / 100)} / 0,5 = ${fmt(acc, 3)} m/s². v_neu = 0 + (${fmt(acc, 3)}) · ${fmt(dt2)} = ${fmt(v2, 3)} m/s.`,
          );
    }
    case "airfall": {
      const m = a * 10,
        k = b / 10,
        v = 2 * c,
        acc = G_EARTH - (k * v * v) / m,
        end = Math.sqrt((m * G_EARTH) / k);
      return level === 1
        ? task(
            `Ein Körper (m = ${m} kg) fällt mit Luftwiderstand F_L = k · v², k = ${fmt(k)} kg/m. Wie groß ist seine Beschleunigung, wenn er gerade ${v} m/s schnell ist? g = 9,81 m/s².`,
            acc,
            "m/s²",
            "a = g − k · v² / m",
            `9,81 − ${fmt(k)} · ${v}² / ${m} = ${fmt(acc, 3)} m/s².`,
          )
        : task(
            `Ein Körper (m = ${m} kg) fällt mit Luftwiderstand F_L = k · v², k = ${fmt(k)} kg/m. Welche Endgeschwindigkeit erreicht er? g = 9,81 m/s².`,
            end,
            "m/s",
            "m · g = k · v²",
            `Im Gleichgewicht ist a = 0: v = √(${m} · 9,81 / ${fmt(k)}) = ${fmt(end, 3)} m/s.`,
          );
    }
    case "solar": {
      const u = 0.4 + a / 100,
        i = b / 10,
        eta = 14 + b,
        area = a / 2,
        irr = c * 200,
        power = (area * irr * eta) / 100;
      return level === 1
        ? task(
            `An einer Solarzelle misst du im Arbeitspunkt U = ${fmt(u)} V und I = ${fmt(i)} A. Berechne die abgegebene elektrische Leistung.`,
            u * i,
            "W",
            "P = U · I",
            `${fmt(u)} V · ${fmt(i)} A = ${fmt(u * i, 3)} W.`,
          )
        : task(
            `Ein Solarmodul mit der Fläche ${fmt(area)} m² gibt bei der Bestrahlungsstärke ${irr} W/m² im Maximum-Power-Point ${fmt(power, 0)} W ab. Berechne seinen Wirkungsgrad in Prozent.`,
            eta,
            "%",
            "η = P_MPP / (E · A)",
            `Eingestrahlte Leistung: ${irr} · ${fmt(area)} = ${fmt(area * irr, 0)} W. ${fmt(power, 0)} / ${fmt(area * irr, 0)} = ${eta} %.`,
          );
    }
    case "pvplant": {
      const spec = 850 + 50 * c,
        perKwh = (b / 10) * 0.35 + (1 - b / 10) * 0.08,
        years = (1500 * a) / (1000 * a * perKwh);
      return level === 1
        ? task(
            `Eine Photovoltaikanlage mit ${a} kWp steht an einem Ort mit dem spezifischen Ertrag ${spec} kWh/kWp im Jahr. Schätze ihren Jahresertrag ab.`,
            a * spec,
            "kWh",
            "E = P_peak · spezifischer Ertrag",
            `${a} · ${spec} = ${fmt(a * spec, 0)} kWh.`,
          )
        : task(
            `Eine Anlage kostet ${fmt(a * 1500, 0)} € und liefert ${fmt(a * 1000, 0)} kWh im Jahr. ${b * 10} % werden selbst verbraucht (das spart 35 ct/kWh), der Rest wird für 8 ct/kWh eingespeist. Nach wie vielen Jahren hat sie ihre Kosten eingespielt?`,
            years,
            "a",
            "Zeit = Kosten / jährlicher Geldwert",
            `Je kWh im Mittel ${fmt(b / 10)} · 0,35 € + ${fmt(1 - b / 10)} · 0,08 € = ${fmt(perKwh, 3)} €. Jährlich ${fmt(a * 1000 * perKwh, 2)} €. ${fmt(a * 1500, 0)} / ${fmt(a * 1000 * perKwh, 2)} = ${fmt(years, 3)} Jahre.`,
          );
    }
    case "ride": {
      const r = a + 2,
        period = b + 1,
        factor = (PI2 * PI2 * r) / (period * period) / G_EARTH,
        v2 = Math.sqrt(G_EARTH * a) * 3.6;
      return level === 1
        ? task(
            `Ein Karussell hat den Bahnradius ${r} m und die Umlaufdauer ${period} s. Gib die Zentripetalbeschleunigung als Vielfaches von g = 9,81 m/s² an.`,
            factor,
            "g",
            "a_Z = (2π / T)² · r",
            `(2π / ${period})² · ${r} = ${fmt(factor * G_EARTH, 3)} m/s²; geteilt durch 9,81 = ${fmt(factor, 3)} g.`,
          )
        : task(
            `Ein Looping hat oben den Bahnradius ${a} m. Wie schnell muss der Wagen im höchsten Punkt mindestens sein, damit er ohne Halterung auf der Bahn bleibt? Gib km/h an. g = 9,81 m/s².`,
            v2,
            "km/h",
            "m · g = m · v² / r",
            `Im Grenzfall liefert allein die Gewichtskraft die Zentripetalkraft: v = √(9,81 · ${a}) = ${fmt(v2 / 3.6, 3)} m/s = ${fmt(v2, 2)} km/h.`,
          );
    }
  }
}
