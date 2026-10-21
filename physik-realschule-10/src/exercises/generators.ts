import type { CalculationKind, ExerciseTask, Level } from "../model/types";
import { fmt } from "./format";
import type { Rng } from "./rng";

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
    case "speed":
      return level === 1
        ? task(
            `Ein Wagen legt ${a * b} m in ${b} s zurück. Gesucht ist die mittlere Geschwindigkeit.`,
            a,
            "m/s",
            "v = Δs / Δt",
            `${a * b} m / ${b} s = ${a} m/s.`,
          )
        : task(
            `Ein Rad fährt ${fmt(a * 3.6)} km/h. Welche Strecke legt es bei gleicher Geschwindigkeit in ${b} s zurück?`,
            a * b,
            "m",
            "s = v · t",
            `Erst durch 3,6 teilen: ${a} m/s. Dann ${a} · ${b} = ${a * b} m.`,
          );
    case "acceleration":
      return level === 1
        ? task(
            `Start aus Ruhe, a = ${a} m/s², t = ${b} s. Gesucht ist der Weg.`,
            0.5 * a * b * b,
            "m",
            "s = ½ · a · t²",
            `½ · ${a} · ${b}² = ${fmt(0.5 * a * b * b)} m.`,
          )
        : task(
            `Ein Wagen erhöht seine Geschwindigkeit in ${b} s von ${a} m/s auf ${a + b * c} m/s. Wie groß ist die konstante Beschleunigung?`,
            c,
            "m/s²",
            "a = Δv / Δt",
            `(${a + b * c} − ${a}) / ${b} = ${c} m/s².`,
          );
    case "fall":
      return level === 1
        ? task(
            `Ein Körper fällt aus Ruhe ${fmt(b / 10)} s. Berechne den Fallweg mit g = 9,81 m/s² ohne Luftwiderstand.`,
            0.5 * 9.81 * (b / 10) ** 2,
            "m",
            "h = ½ · g · t²",
            `½ · 9,81 · ${fmt(b / 10)}² = ${fmt(0.5 * 9.81 * (b / 10) ** 2, 3)} m.`,
          )
        : task(
            `Kurz vor dem Boden erreicht ein Körper im Fallmodell aus Ruhe ${a} m/s. Aus welcher Höhe fiel er? g = 9,81 m/s².`,
            (a * a) / (2 * 9.81),
            "m",
            "h = v² / (2g)",
            `${a}² / (2 · 9,81) = ${fmt((a * a) / (2 * 9.81), 3)} m.`,
          );
    case "force":
      return level === 1
        ? task(
            `m = ${a} kg, a = ${b} m/s². Bestimme die resultierende Kraft.`,
            a * b,
            "N",
            "F_res = m · a",
            `${a} · ${b} = ${a * b} N.`,
          )
        : task(
            `Auf einen ${a}-kg-Wagen wirken ${a * b + c} N vorwärts und ${c} N rückwärts. Wie groß ist die Beschleunigung?`,
            b,
            "m/s²",
            "a = F_res / m",
            `Die Resultierende ist ${a * b} N; geteilt durch ${a} kg ergibt ${b} m/s².`,
          );
    case "energy":
      return level === 1
        ? task(
            `m = ${a} kg, v = ${b} m/s. Gesucht ist E_kin.`,
            0.5 * a * b * b,
            "J",
            "E_kin = ½ · m · v²",
            `½ · ${a} · ${b}² = ${fmt(0.5 * a * b * b)} J.`,
          )
        : task(
            `Ein ${a}-kg-Körper besitzt ${fmt(0.5 * a * b * b)} J kinetische Energie. Wie schnell ist er?`,
            b,
            "m/s",
            "v = √(2E_kin / m)",
            `√(2 · ${fmt(0.5 * a * b * b)} / ${a}) = ${b} m/s.`,
          );
    case "stopping": {
      const v = a * 3,
        react = b / 10,
        decel = 5,
        brake = (v * v) / (2 * decel);
      return level === 1
        ? task(
            `v₀ = ${v} m/s, Reaktionszeit ${fmt(react)} s, Verzögerungsbetrag 5 m/s². Bestimme den Anhalteweg.`,
            v * react + brake,
            "m",
            "s_A = v₀ · t_R + v₀² / (2a_B)",
            `Reaktionsweg ${fmt(v * react)} m plus Bremsweg ${fmt(brake)} m = ${fmt(v * react + brake)} m.`,
          )
        : task(
            `Nach der Reaktionsphase bremst ein Fahrzeug von ${v} m/s mit konstant 5 m/s². Wie lange dauert nur die Bremsphase?`,
            v / 5,
            "s",
            "t_B = v₀ / a_B",
            `${v} / 5 = ${fmt(v / 5)} s; die Reaktionszeit ist nicht Teil dieser Phase.`,
          );
    }
    case "momentum":
      return level === 1
        ? task(
            `m = ${a} kg, v = −${b} m/s. Bestimme den gerichteten Impuls.`,
            -a * b,
            "kg·m/s",
            "p = m · v",
            `${a} · (−${b}) = −${a * b} kg·m/s.`,
          )
        : task(
            `Ein ${a}-kg-Körper wird in ${b} s von ${c} m/s bis null abgebremst. Gesucht ist der Betrag der mittleren Kraft.`,
            (a * c) / b,
            "N",
            "|F_mittel| = |Δp| / Δt",
            `${a} · ${c} / ${b} = ${fmt((a * c) / b, 3)} N.`,
          );
    case "collision":
      return task(
        level === 1
          ? `Ein ${a}-kg-Wagen mit ${c} m/s trifft einen ruhenden ${b}-kg-Wagen. Beide haften zusammen. Gesucht ist die gemeinsame Geschwindigkeit.`
          : `Zwei Wagen (${a} kg mit +${c} m/s und ${b} kg mit −1 m/s) haften nach einem zentralen Stoß zusammen. Bestimme die gerichtete Endgeschwindigkeit.`,
        (a * c - (level === 2 ? b : 0)) / (a + b),
        "m/s",
        "v = (m₁v₁ + m₂v₂)/(m₁+m₂)",
        `Impulsbilanz mit Vorzeichen: (${a} · ${c}${level === 2 ? ` − ${b}` : ""}) / ${a + b} = ${fmt((a * c - (level === 2 ? b : 0)) / (a + b), 3)} m/s.`,
      );
    case "series":
      return level === 1
        ? task(
            `${a * 100} Ω und ${b * 100} Ω liegen in Reihe an 12 V. Bestimme den Strom.`,
            12 / ((a + b) * 100),
            "A",
            "I = U/(R₁+R₂)",
            `12 / ${100 * (a + b)} = ${fmt(12 / (100 * (a + b)), 3)} A.`,
          )
        : task(
            `Durch ${a * 100} Ω und ${b * 100} Ω in Reihe fließen 0,02 A. Welche Spannung liegt an beiden zusammen?`,
            2 * (a + b),
            "V",
            "U = I(R₁+R₂)",
            `0,02 · ${100 * (a + b)} = ${2 * (a + b)} V.`,
          );
    case "parallel":
      return level === 1
        ? task(
            `${a * 100} Ω und ${b * 100} Ω werden parallel geschaltet. Bestimme R_ges.`,
            (100 * a * b) / (a + b),
            "Ω",
            "R_ges = R₁R₂/(R₁+R₂)",
            `${a * 100} · ${b * 100} / ${100 * (a + b)} = ${fmt((100 * a * b) / (a + b), 3)} Ω.`,
          )
        : task(
            `Zwei parallele Zweige an 12 V haben ${a * 100} Ω und ${b * 100} Ω. Bestimme den Gesamtstrom.`,
            12 / (a * 100) + 12 / (b * 100),
            "A",
            "I_ges = U/R₁ + U/R₂",
            `Die Zweigströme addieren sich: ${fmt(12 / (a * 100) + 12 / (b * 100), 3)} A.`,
          );
    case "meter":
      return level === 1
        ? task(
            `Ein Strommessgerät mit ${b} Ω wird mit ${a * 10} Ω in Reihe an 6 V gelegt. Bestimme den Strom.`,
            6 / (a * 10 + b),
            "A",
            "I = U/(R+R_M)",
            `6 / (${a * 10} + ${b}) = ${fmt(6 / (a * 10 + b), 3)} A.`,
          )
        : task(
            `Ohne Messgerät fließen bei 6 V an ${a * 10} Ω ein Strom von ${fmt(6 / (a * 10), 3)} A. Mit ${b} Ω Messwerkwiderstand: Um wie viel Prozent sinkt der Strom?`,
            (100 * b) / (a * 10 + b),
            "%",
            "Abnahme = (I_ohne − I_mit)/I_ohne",
            `Relative Abnahme = ${b}/(${a * 10}+${b}) = ${fmt((100 * b) / (a * 10 + b), 3)} %.`,
          );
    case "range":
      return level === 1
        ? task(
            `Ein Messwerk hat 100 Ω und 1 mA Endausschlagstrom. Welcher Vorwiderstand erweitert auf ${a} V?`,
            a * 1000 - 100,
            "Ω",
            "R_V = U/I_M − R_M",
            `${a}/0,001 − 100 = ${a * 1000 - 100} Ω.`,
          )
        : task(
            `Dasselbe Messwerk (100 Ω, 1 mA) soll ${a * 10} mA Gesamtstrom messen. Welcher parallele Shunt wird benötigt?`,
            0.1 / (a * 0.01 - 0.001),
            "Ω",
            "R_S = I_M R_M/(I − I_M)",
            `0,1 V / (${fmt(a * 0.01)} − 0,001) A = ${fmt(0.1 / (a * 0.01 - 0.001), 3)} Ω.`,
          );
    case "frequency":
      return level === 1
        ? task(
            `Eine Schwingung dauert ${a * 10} ms. Bestimme die Frequenz.`,
            1000 / (a * 10),
            "Hz",
            "f = 1/T",
            `${a * 10} ms = ${fmt(a / 100)} s; f = ${fmt(100 / a, 3)} Hz.`,
          )
        : task(
            `Ein Generator liefert ${a * 10} Perioden pro Sekunde. Wie lang ist eine Periode in Millisekunden?`,
            1000 / (a * 10),
            "ms",
            "T = 1/f",
            `1/${a * 10} s = ${fmt(100 / a, 3)} ms.`,
          );
    case "transformer":
      return level === 1
        ? task(
            `Idealer Trafo: U₁ = 12 V, N₁ = ${a * 100}, N₂ = ${b * 100}. Gesucht ist U₂.`,
            (12 * b) / a,
            "V",
            "U₂ = U₁N₂/N₁",
            `12 · ${b}/${a} = ${fmt((12 * b) / a, 3)} V.`,
          )
        : task(
            `Ein idealer Trafo gibt 24 W bei ${a * 2} V Sekundärspannung ab. Wie groß ist der Sekundärstrom?`,
            12 / a,
            "A",
            "I₂ = P₂/U₂",
            `24 / ${a * 2} = ${fmt(12 / a, 3)} A.`,
          );
    case "line":
      return level === 1
        ? task(
            `Durch eine Leitung mit insgesamt ${b} Ω fließen ${a} A. Bestimme die ohmsche Verlustleistung.`,
            a * a * b,
            "W",
            "P_V = I²R_L",
            `${a}² · ${b} = ${a * a * b} W.`,
          )
        : task(
            `Eine Leitung überträgt ${a * 1000} W bei ${b * 1000} V. Der Gesamtwiderstand beträgt 2 Ω. Bestimme die Verlustleistung im Modell mit vorgegebener Eingangsleistung.`,
            2 * (a / b) ** 2,
            "W",
            "I = P/U; P_V = I²R_L",
            `I = ${fmt(a / b, 3)} A; Verlust = (${a}/${b})² · 2 = ${fmt(2 * (a / b) ** 2, 3)} W.`,
          );
    case "halfLife":
      return level === 1
        ? task(
            `Eine Probe besitzt ${a * 800} Kerne. Wie viele bleiben im Mittel nach ${b} Halbwertszeiten?`,
            (a * 800) / 2 ** b,
            "Kerne",
            "N = N₀ · (½)^n",
            `${a * 800} / 2^${b} = ${fmt((a * 800) / 2 ** b, 3)} Kerne.`,
          )
        : task(
            `Die Halbwertszeit ist ${a} h. Nach wie vielen Stunden ist im Mittel noch ein Achtel vorhanden?`,
            3 * a,
            "h",
            "Ein Achtel entspricht drei Halbierungen",
            `3 · ${a} h = ${3 * a} h.`,
          );
    case "decay":
      return level === 1
        ? task(
            `Eine reine Quelle beginnt mit ${a * 100} Bq, T½ = 4 h. Bestimme die Aktivität nach 6 h ohne Nachlieferung.`,
            a * 100 * 2 ** -1.5,
            "Bq",
            "A(t) = A₀ · (½)^(t/T½)",
            `${a * 100} · 2^(−6/4) = ${fmt(a * 100 * 2 ** -1.5, 3)} Bq.`,
          )
        : task(
            `Nach ${b} h besitzt eine reine Quelle ein Viertel ihrer Anfangsaktivität. Wie groß ist ihre Halbwertszeit?`,
            b / 2,
            "h",
            "Ein Viertel entspricht zwei Halbwertszeiten",
            `T½ = ${b} h / 2 = ${fmt(b / 2)} h.`,
          );
    case "binding":
      return level === 1
        ? task(
            `Eine Reaktion verringert die Ruhemasse um ${a} · 10⁻²⁹ kg. Bestimme die frei werdende Energie in Picojoule (1 pJ = 10⁻¹² J), mit c = 3 · 10⁸ m/s.`,
            a * 0.9,
            "pJ",
            "E = Δm · c²",
            `${a} · 10⁻²⁹ · 9 · 10¹⁶ J = ${fmt(a * 0.9)} pJ.`,
          )
        : task(
            `Eine Reaktion setzt ${fmt(a * 0.9)} pJ frei (1 pJ = 10⁻¹² J). Wie groß ist die zugehörige Massenabnahme, angegeben in Vielfachen von 10⁻²⁹ kg? c = 3 · 10⁸ m/s.`,
            a,
            "10⁻²⁹ kg",
            "Δm = E/c²",
            `${fmt(a * 0.9)} · 10⁻¹² J / (9 · 10¹⁶ m²/s²) = ${a} · 10⁻²⁹ kg.`,
          );
    case "dose":
      return level === 1
        ? task(
            `${a} mJ werden in ${b} kg absorbiert. Bestimme die Energiedosis in mGy.`,
            a / b,
            "mGy",
            "D = E/m",
            `${a} mJ / ${b} kg = ${fmt(a / b, 3)} mGy.`,
          )
        : task(
            `Eine vereinfachte Rechnung verwendet D = ${a} mGy und w_R = ${b}. Bestimme H in mSv.`,
            a * b,
            "mSv",
            "H = w_R · D",
            `${b} · ${a} = ${a * b} mSv; keine individuelle Risikoprognose.`,
          );
    case "efficiency":
      return level === 1
        ? task(
            `Ein Modellkraftwerk erhält ${a * 100} kWh und gibt ${a * 35} kWh Strom ab. Gesucht ist der elektrische Wirkungsgrad in Prozent.`,
            35,
            "%",
            "η = E_nutz/E_zu",
            `${a * 35}/${a * 100} · 100 % = 35 %.`,
          )
        : task(
            `Zwei Umwandlungsstufen haben 80 % und ${b * 10} % Wirkungsgrad. Bestimme den Gesamtwirkungsgrad.`,
            8 * b,
            "%",
            "η_ges = η₁ · η₂",
            `0,8 · ${fmt(b / 10)} = ${8 * b} %.`,
          );
    case "kwk":
      return level === 1
        ? task(
            `100 kWh werden zu ${a * 5} kWh Strom und ${b * 5} kWh tatsächlich genutzter Wärme. Bestimme den Gesamtnutzungsgrad.`,
            5 * (a + b),
            "%",
            "η_nutz = (E_el + E_Wärme,nutz)/E_zu",
            `(${a * 5} + ${b * 5})/100 = ${5 * (a + b)} %.`,
          )
        : task(
            `100 kWh ergeben ${a * 5} kWh Strom und 40 kWh ausgekoppelte Wärme. Nur die Hälfte der Wärme wird genutzt. Gesucht ist der tatsächliche Gesamtnutzungsgrad.`,
            a * 5 + 20,
            "%",
            "Nur tatsächlich genutzte Wärme mitzählen",
            `(${a * 5} + 20)/100 = ${a * 5 + 20} %.`,
          );
    case "storage":
      return level === 1
        ? task(
            `Ein Speicher lädt ${a * 10} kWh und gibt bei 80 % Gesamteffizienz wie viel Energie zurück?`,
            a * 8,
            "kWh",
            "E_aus = η · E_ein",
            `0,8 · ${a * 10} = ${a * 8} kWh.`,
          )
        : task(
            `Ein Speicher hat ${a * 10} kWh nutzbare Energie und kann die verlangten ${b} kW dauerhaft liefern. Wie lange reicht er ideal?`,
            (a * 10) / b,
            "h",
            "t = E/P",
            `${a * 10}/${b} = ${fmt((a * 10) / b, 3)} h.`,
          );
    case "effective":
      return level === 1
        ? task(
            `Eine reine Sinusspannung hat ${a * 10} V Effektivwert. Bestimme den Scheitelwert.`,
            a * 10 * Math.SQRT2,
            "V",
            "U₀ = √2 · U_eff",
            `${a * 10} · √2 = ${fmt(a * 10 * Math.SQRT2, 3)} V.`,
          )
        : task(
            `Eine reine Sinusspannung hat ${a * 10} V Scheitelwert. Bestimme den Effektivwert.`,
            (a * 10) / Math.SQRT2,
            "V",
            "U_eff = U₀/√2",
            `${a * 10} / √2 = ${fmt((a * 10) / Math.SQRT2, 3)} V.`,
          );
  }
}
