import { fmt } from "../exercises/format";
import type { ExerciseGenerator } from "../model/types";
import { task } from "./builders";
import { numberField } from "./helpers";

const words = [
  "null",
  "eine",
  "zwei",
  "drei",
  "vier",
  "fünf",
  "sechs",
  "sieben",
  "acht",
  "neun",
];
export const wordForm: ExerciseGenerator = {
  id: "wortform-milliarden",
  make(rng, level) {
    const billions = rng.int(2, 9),
      millions = rng.int(2, 9),
      thousands = level === 1 ? 0 : rng.int(2, 9);
    const value = billions * 1e9 + millions * 1e6 + thousands * 1e3;
    const name = `${words[billions]} Milliarden ${words[millions]} Millionen${thousands ? ` ${words[thousands]} Tausend` : ""}`;
    return task(
      level,
      `Schreibe die Wortform „${name}“ als Zahl im Dezimalsystem.`,
      `Eine fiktive Statistik nennt „${name}“ Zähleinheiten. Schreibe die Zahl und gib zusätzlich an, wie viele vollständige Millionen sie enthält.`,
      [
        numberField("Zahl:", value, "", 0),
        ...(level === 2
          ? [
              numberField(
                "Vollständige Millionen:",
                Math.floor(value / 1e6),
                "",
                0,
              ),
            ]
          : []),
      ],
      "Ordne die Angaben in Dreiergruppen: Milliarden | Millionen | Tausender | Einer.",
      `${billions} · 1.000.000.000 + ${millions} · 1.000.000${thousands ? ` + ${thousands} · 1.000` : ""} = ${fmt(value, 0)}. Leere Gruppen werden mit Nullen gefüllt.`,
      `Die Zahl ist ${fmt(value, 0)}${level === 2 ? `; sie enthält ${fmt(Math.floor(value / 1e6), 0)} vollständige Millionen` : ""}.`,
      { billions, millions, thousands, value },
    );
  },
};
