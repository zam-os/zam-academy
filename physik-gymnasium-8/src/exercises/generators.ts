import type { CalculationKind, ExerciseTask, Level } from "../model/types";
import { fmt } from "./format";
import type { Rng } from "./rng";

export function makeExercise(
  kind: CalculationKind,
  rng: Rng,
  level: Level,
): ExerciseTask {
  const a = rng.int(2, 8);
  const b = rng.int(2, 6);
  const c = rng.int(2, 5);
  const task = (
    prompt: string,
    answer: number,
    unit: string,
    formulaHint: string,
    steps: string,
  ): ExerciseTask => ({
    prompt,
    answer,
    unit,
    digits: 3,
    formulaHint,
    solutionHtml: `${steps} = ${fmt(answer, 3)} ${unit}.`,
  });
  switch (kind) {
    case "stromkreis":
      return level === 1
        ? task(
            `Durch ${10 * b} Ω fließt Strom bei ${a} V. Wie groß ist I?`,
            a / (10 * b),
            "A",
            "I = U / R",
            `${a} V / ${10 * b} Ω`,
          )
        : task(
            `Eine Schulquelle liefert ${a} V. Bei geschlossenem Schalter fließen ${50 * b} mA. Bestimme den Widerstand.`,
            a / (b / 20),
            "Ω",
            "R = U / I",
            `${a} V / ${fmt(b / 20)} A`,
          );
    case "kennlinie":
      return level === 1
        ? task(
            `Lies einen Messpunkt aus: ${a} V und ${25 * b} mA. Welchen Widerstand hat das Bauteil an diesem Punkt?`,
            a / (b / 40),
            "Ω",
            "R = U / I; wandle mA in A um.",
            `${a} V / ${fmt(b / 40, 3)} A`,
          )
        : task(
            `Die Kennlinie eines ohmschen Widerstands enthält ${a} V bei ${20 * b} mA. Wie viele Milliampere erwartest du bei ${2 * a} V?`,
            40 * b,
            "mA",
            "I wächst proportional zu U.",
            `2 · ${20 * b} mA`,
          );
    case "reihenschaltung":
      return level === 1
        ? task(
            `Die Spannungen an zwei Widerständen in Reihe sind ${a} V und ${b} V. Wie groß ist die Quellenspannung?`,
            a + b,
            "V",
            "U = U₁ + U₂",
            `${a} V + ${b} V`,
          )
        : task(
            `In einer Reihe aus drei Widerständen misst du Teilspannungen von ${a} V und ${b} V. Insgesamt liegen ${a + b + c} V an. Der dritte Widerstand hat ${5 * b} Ω. Bestimme die Stromstärke in der Reihe.`,
            c / (5 * b),
            "A",
            "Bestimme erst die fehlende Teilspannung, dann I = U / R.",
            `(${a + b + c} V − ${a} V − ${b} V) / ${5 * b} Ω`,
          );
    case "parallel-haushalt":
      return level === 1
        ? task(
            `Zwei parallele Zweige führen ${10 * a} mA und ${10 * b} mA. Wie groß ist der Gesamtstrom?`,
            10 * (a + b),
            "mA",
            "I = I₁ + I₂",
            `${10 * a} mA + ${10 * b} mA`,
          )
        : task(
            `Drei parallele Zweige führen insgesamt ${fmt((a + b + c) / 10)} A. In den ersten beiden Zweigen misst du ${100 * a} mA und ${100 * b} mA. Wie viele Milliampere fließen im dritten Zweig?`,
            100 * c,
            "mA",
            "Gesamtstrom in mA umrechnen und die bekannten Zweigströme abziehen.",
            `${100 * (a + b + c)} mA − ${100 * a} mA − ${100 * b} mA`,
          );
    case "spiegel":
      return level === 1
        ? task(
            `Ein Gegenstand steht ${5 * a} cm vor dem ebenen Spiegel. Wie weit liegt sein Bild hinter dem Spiegel?`,
            5 * a,
            "cm",
            "Bildabstand = Gegenstandsabstand",
            `Bildabstand`,
          )
        : task(
            `Ein Strahl trifft unter ${5 * a}° zur Spiegelfläche auf. Wie groß ist der Reflexionswinkel zum Lot?`,
            90 - 5 * a,
            "°",
            "Winkel zur Fläche und zum Lot ergänzen sich zu 90°.",
            `90° − ${5 * a}°`,
          );
    case "tempo":
      return level === 1
        ? task(
            `Ein Rad fährt ${3 * a * b} m in ${3 * b} s. Berechne v.`,
            a,
            "m/s",
            "v = Δs / Δt",
            `${3 * a * b} m / ${3 * b} s`,
          )
        : task(
            `Ein Fahrrad fährt gleichförmig und legt ${a * b * 60} m in ${b} min zurück. Bestimme das Tempo in km/h.`,
            3.6 * a,
            "km/h",
            "Minuten in Sekunden umrechnen. v in m/s anschließend mit 3,6 multiplizieren.",
            `(${a * b * 60} m / ${60 * b} s) · 3,6 in km/h`,
          );
    case "vektoren":
      return level === 1
        ? task(
            `Der Pfeil für eine Geschwindigkeit ist ${a} cm lang. Der Maßstab ist 1 cm für ${b} m/s. Bestimme das Tempo.`,
            a * b,
            "m/s",
            "Pfeillänge mal Maßstabswert.",
            `${a} · ${b} m/s`,
          )
        : task(
            `Du willst für eine neue Skizze ${fmt(3.6 * a)} km/h im Maßstab 2 cm für ${b} m/s zeichnen. Wie lang wird der Pfeil?`,
            (2 * a) / b,
            "cm",
            "Zuerst durch 3,6 teilen. Dann den Pfeilmaßstab mit 2 cm anwenden.",
            `(${a} m/s / ${b} m/s) · 2 cm`,
          );
    case "kraftstoss":
      return level === 1
        ? task(
            `Eine resultierende Kraft von ${a} N wirkt ${fmt(b / 40, 3)} s auf einen Puck mit ${fmt(c / 10)} kg. Bestimme den Betrag von Δv.`,
            (a * b) / (4 * c),
            "m/s",
            "Δv = F · Δt / m",
            `${a} · ${fmt(b / 40, 3)} / ${fmt(c / 10)} in m/s`,
          )
        : task(
            `Ein Spielzeug mit ${100 * a} g wird in ${100 * b} ms um ${c} m/s schneller. Wie groß ist die mittlere resultierende Kraft?`,
            (a * c) / b,
            "N",
            "Gramm und Millisekunden umrechnen. F = m · Δv / Δt.",
            `${fmt(a / 10)} · ${c} / ${fmt(b / 10)} in N`,
          );
    case "beschleunigung":
      return level === 1
        ? task(
            `Ein Wagen fährt zunächst mit ${a} m/s und nach ${b} s mit ${a + c} m/s in dieselbe Richtung. Bestimme die mittlere Beschleunigung.`,
            c / b,
            "m/s²",
            "a = (v₂ − v₁) / Δt",
            `(${a + c} − ${a}) / ${b} in m/s²`,
          )
        : task(
            `Ein Wagen mit ${100 * a} kg bremst in ${b} s von ${fmt(3.6 * c)} km/h bis zum Stillstand. Wie groß ist der Betrag der mittleren resultierenden Kraft?`,
            (100 * a * c) / b,
            "N",
            "Rechne km/h in m/s um. F = m · Δv / Δt, gefragt ist der Betrag.",
            `${100 * a} · ${c} / ${b} in N`,
          );
    case "gewichtskraft":
      return level === 1
        ? task(
            `Welche Gewichtskraft hat ein Körper von ${a} kg auf der Erde bei g = 9,81 N/kg?`,
            9.81 * a,
            "N",
            "F_G = m · g",
            `${a} kg · 9,81 N/kg`,
          )
        : task(
            `Auf dem Mond hat ein Körper ${fmt(a * 1.62)} N Gewichtskraft. Welche Masse hat er auf der Erde? Nutze für den Mond g = 1,62 N/kg.`,
            a,
            "kg",
            "m = F_G / g. Die Masse bleibt beim Ortswechsel gleich.",
            `${fmt(a * 1.62)} N / (1,62 N/kg)`,
          );
    case "gleichgewicht":
      return level === 1
        ? task(
            `Auf einen Wagen wirken ${a + b} N vorwärts und ${a} N rückwärts. Wie groß ist die resultierende Kraft?`,
            b,
            "N",
            "Ziehe bei entgegengesetzten Kräften die Beträge voneinander ab.",
            `${a + b} N − ${a} N`,
          )
        : task(
            `Ein Rad fährt geradeaus mit gleichbleibendem Tempo. Luftwiderstand und Rollwiderstand betragen ${a} N und ${b} N. Wie groß ist die vorwärts wirkende Antriebskraft?`,
            a + b,
            "N",
            "Bei gleichbleibender Geschwindigkeit ist die resultierende Kraft null.",
            `${a} N + ${b} N`,
          );
    case "feder":
      return level === 1
        ? task(
            `Eine Feder verlängert sich bei ${a} N um ${a * b} cm. Berechne die Federhärte.`,
            1 / b,
            "N/cm",
            "D = F / Δl",
            `${a} N / ${a * b} cm`,
          )
        : task(
            `Eine Feder ist ohne Last ${a + 10} cm lang. Bei ${fmt(b / 2)} N misst du ${a + 10 + c} cm. Der Hooke’sche Bereich reicht über beide Lasten. Wie lang ist die Feder bei ${b} N?`,
            a + 10 + 2 * c,
            "cm",
            "Nur die Dehnung verdoppelt sich, nicht die Anfangslänge.",
            `${a + 10} cm + 2 · ${c} cm`,
          );
  }
}
