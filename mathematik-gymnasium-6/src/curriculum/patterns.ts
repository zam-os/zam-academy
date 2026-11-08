import type { ExerciseGenerator } from "../model/types";
import { fmt, fracText, paren } from "../exercises/format";
import { choiceField as pick, numberField as num } from "./helpers";
import { task } from "./builders";
import {
  boxSurface,
  boxVolume,
  convertVolume,
  interest,
  gcd,
  isTerminating,
  lcm,
  paraArea,
  roundTo,
  periodOne,
  reduce,
  trapArea,
  triArea,
} from "./math";

const count = (value: number, one: string, many: string) =>
  `${fmt(value, 0)} ${Math.abs(value) === 1 ? one : many}`;

/** Anteil von einer Menge. */
export function partOf(id: string, thing: string, one: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.int(2, 8);
      const n = rng.int(1, d - 1);
      const groups = rng.int(3, 12);
      const whole = d * groups;
      const answer = n * groups;
      const hint = "Teile die Menge durch den Nenner und nimm dann so viele Teile, wie der Zähler sagt.";
      return task(
        level,
        `Berechne den Anteil ${fracText(n, d)} von ${count(whole, one, thing)}.`,
        `Von ${count(whole, one, thing)} gehört der Anteil ${fracText(n, d)} zu einer Gruppe. Wie viele ${thing} sind das?`,
        [num("Anzahl", answer, "", 0, { slips: [{ value: groups, hint: "Das ist ein einzelner Bruchteil. Multipliziere noch mit dem Zähler." }, { value: n / d, hint: "Das ist nur der Anteil, noch nicht die Anzahl." }] })],
        hint,
        `${fmt(whole, 0)} : ${fmt(d, 0)} = ${fmt(groups, 0)}. ${fmt(groups, 0)} · ${fmt(n, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} ${thing}.`,
        { n, d, whole },
      );
    },
  };
}

/** Aus dem Bruchteil das Ganze bestimmen. */
export function findWhole(id: string, thing: string, one: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.int(2, 8);
      const n = rng.int(1, d - 1);
      const groups = rng.int(3, 10);
      const part = n * groups;
      const whole = d * groups;
      const hint = "Ein Bruchteil ist bekannt. Teile ihn durch den Zähler und vervielfache mit dem Nenner.";
      return task(
        level,
        `${fracText(n, d)} einer Menge ${thing} sind ${fmt(part, 0)}. Wie groß ist die ganze Menge?`,
        `${count(part, one, thing)} sind genau ${fracText(n, d)} des Vorrats. Wie viele ${thing} gehören zum ganzen Vorrat?`,
        [num("Ganzes", whole, "", 0, { slips: [{ value: part * d, hint: "Teile zuerst durch den Zähler. Der Bruchteil besteht aus mehreren Stücken." }] })],
        hint,
        `${fmt(part, 0)} : ${fmt(n, 0)} = ${fmt(groups, 0)}. ${fmt(groups, 0)} · ${fmt(d, 0)} = ${fmt(whole, 0)}.`,
        `Das Ganze sind ${fmt(whole, 0)} ${thing}.`,
        { n, d, part },
      );
    },
  };
}

export function extendFrac(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.int(2, 6);
      const n = rng.int(1, d - 1);
      const k = rng.int(2, 6);
      const hint = "Zähler und Nenner werden mit derselben Zahl multipliziert. Der Wert bleibt gleich.";
      return task(
        level,
        `Erweitere ${fracText(n, d)} mit ${fmt(k, 0)}. Welchen Zähler erhältst du?`,
        `Ein Bruch ${fracText(n, d)} soll den Nenner ${fmt(d * k, 0)} bekommen, ohne seinen Wert zu ändern. Welcher Zähler gehört dazu?`,
        [num("Zähler", n * k, "", 0, { slips: [{ value: n + k, hint: "Erweitern ist Malnehmen, nicht Addieren." }] })],
        hint,
        `${fmt(n, 0)} · ${fmt(k, 0)} = ${fmt(n * k, 0)}, der Nenner wird ${fmt(d * k, 0)}.`,
        `Der neue Zähler ist ${fmt(n * k, 0)}.`,
        { n, d, k },
      );
    },
  };
}

export function reduceFrac(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.int(2, 8);
      const n = rng.int(1, d - 1);
      const k = rng.int(2, 5);
      const { n: rn, d: rd } = reduce(n, d);
      const hint = "Teile Zähler und Nenner durch denselben Teiler, bis nur noch 1 übrig ist.";
      return task(
        level,
        `Kürze ${fracText(n * k, d * k)} vollständig. Gib den Nenner des gekürzten Bruchs an.`,
        `In einem Bericht steht der Anteil ${fracText(n * k, d * k)}. Wie heißt derselbe Anteil vollständig gekürzt im Nenner?`,
        [num("Nenner", rd, "", 0, { slips: [{ value: d * k, hint: "Der Bruch ist noch nicht gekürzt." }] })],
        hint,
        `Gemeinsamer Teiler ${fmt(k * (n / rn), 0)}. Gekürzt: ${fracText(rn, rd)}.`,
        `Der Nenner ist ${fmt(rd, 0)}.`,
        { n, d, k },
      );
    },
  };
}

export function compareFrac(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d1 = rng.int(2, 8);
      const n1 = rng.int(1, d1 - 1);
      const same = rng.int(0, 4) === 0;
      const d2 = same ? d1 * rng.int(2, 3) : rng.int(2, 9);
      const n2 = same ? n1 * (d2 / d1) : rng.int(1, d2 - 1);
      const left = n1 / d1;
      const right = n2 / d2;
      const names = ["der linke Bruch", "der rechte Bruch", "beide sind gleich groß"];
      const index = left > right ? 0 : right > left ? 1 : 2;
      const hint = "Ein gemeinsamer Nenner oder das Kürzen auf denselben Bruch zeigt die Ordnung.";
      return task(
        level,
        `Welcher Bruch ist größer: ${fracText(n1, d1)} oder ${fracText(n2, d2)}?`,
        `Lia vergleicht die Anteile ${fracText(n1, d1)} und ${fracText(n2, d2)} an zwei gleichen Vorräten. Welcher Anteil ist größer?`,
        [pick("Größer ist …", names, index)],
        hint,
        `${fracText(n1, d1)} = ${fmt(left, 3)} und ${fracText(n2, d2)} = ${fmt(right, 3)}.`,
        names[index],
        { n1, d1, n2, d2 },
      );
    },
  };
}

export function percentName(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const p = rng.pick([10, 20, 25, 50, 75]);
      const { n, d } = reduce(p, 100);
      const hint = "Prozent heißt Hundertstel. Kürze p/100.";
      return task(
        level,
        `Schreibe ${fmt(p, 0)} % als vollständig gekürzten Bruch und gib den Nenner an.`,
        `Auf einem Schild steht „${fmt(p, 0)} % Rabatt“. Welcher Nenner gehört zum vollständig gekürzten Bruch dieses Anteils?`,
        [num("Nenner", d, "", 0, { slips: [{ value: 100, hint: "100 ist der Nenner vor dem Kürzen." }] })],
        hint,
        `${fmt(p, 0)} % = ${fracText(p, 100)} = ${fracText(n, d)}.`,
        `Der Nenner ist ${fmt(d, 0)}.`,
        { p },
      );
    },
  };
}

export function orderRational(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      let a = rng.int(-8, 8);
      let b = rng.int(-8, 8);
      if (a === b) b = a + (a < 8 ? 1 : -1);
      const larger = Math.max(a, b);
      const hint = "Auf der Zahlengeraden liegt die größere Zahl weiter rechts. Bei negativen Zahlen ist die näher an null die größere.";
      return task(
        level,
        `Welche Zahl ist größer: ${fmt(a / 2, 1)} oder ${fmt(b / 2, 1)}?`,
        `Zwei Pegelstände liegen bei ${fmt(a / 2, 1)} m und ${fmt(b / 2, 1)} m, jeweils gegenüber der Nullmarke. Welcher Stand ist der höhere?`,
        [num("größere Zahl", larger / 2, "", 1)],
        hint,
        `Weiter rechts liegt ${fmt(larger / 2, 1)}.`,
        `Die größere Zahl ist ${fmt(larger / 2, 1)}.`,
        { a, b },
      );
    },
  };
}

export function placeDigit(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const ones = rng.int(0, 9);
      const tenths = rng.int(0, 9);
      const hundredths = rng.int(1, 9);
      const value = ones + tenths / 10 + hundredths / 100;
      const hint = "Die erste Stelle nach dem Komma sind Zehntel, die zweite Hundertstel.";
      return task(
        level,
        `Welchen Wert hat die Ziffer an der Hundertstelstelle in der Zahl ${fmt(value, 2)}?`,
        `Ein Messwert steht als ${fmt(value, 2)} da. Welchen Wert hat allein die Ziffer an der Hundertstelstelle?`,
        [num("Wert", hundredths / 100, "", 2, { slips: [{ value: hundredths, hint: "Die Ziffer steht zwei Stellen nach dem Komma, ihr Wert ist Hundertstel." }] })],
        hint,
        `Hundertstel: ${fmt(hundredths, 0)} · 0,01 = ${fmt(hundredths / 100, 2)}.`,
        `Der Wert ist ${fmt(hundredths / 100, 2)}.`,
        { ones, tenths, hundredths },
      );
    },
  };
}

export function roundDecimal(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const tick = rng.int(-29, 29);
      const toOnes = rng.int(0, 1) === 0;
      const value = tick / 10;
      const answer = toOnes ? roundTo(value, 0) : value;
      const digits = toOnes ? 0 : 1;
      const place = toOnes ? "Einer" : "Zehntel";
      const hint = "Sieh auf die Stelle direkt rechts von der Rundungsstelle. Ab 5 wird aufgerundet.";
      return task(
        level,
        `Runde die Dezimalzahl ${fmt(value, 1)} auf ${place}.`,
        `Ein Wiegeergebnis von ${fmt(value, 1)} kg soll auf ${place} gerundet in eine Liste. Welcher Wert kommt in die Liste?`,
        [num("gerundet", answer, "", digits)],
        hint,
        toOnes
          ? `Die Zehntelstelle ist ${fmt(Math.abs(tick % 10), 0)}. Gerundet: ${fmt(answer, 0)}.`
          : `Die Zahl ist schon auf Zehntel angegeben: ${fmt(value, 1)}.`,
        `Gerundet: ${fmt(answer, digits)}.`,
        { tick },
      );
    },
  };
}

export function terminating(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 15, 16, 20, 25, 40]);
      const finite = isTerminating(1, d);
      const options = ["Er bricht ab.", "Er wird periodisch."];
      const hint = "Kürze zuerst. Der Dezimalbruch bricht ab, wenn der Nenner nur noch 2 und 5 als Primfaktoren hat.";
      return task(
        level,
        `Bricht der Dezimalbruch von ${fracText(1, d)} ab, oder wird er periodisch?`,
        `Jemand teilt 1 durch ${fmt(d, 0)} mit einem Taschenrechner. Bricht die Anzeige irgendwann mit Nullen ab, oder läuft eine Periode?`,
        [pick("Der Dezimalbruch …", options, finite ? 0 : 1)],
        hint,
        `Der Nenner ${fmt(d, 0)} ${finite ? "hat nach dem Kürzen nur die Primfaktoren 2 und 5" : "hat noch einen anderen Primfaktor"}.`,
        options[finite ? 0 : 1],
        { d },
      );
    },
  };
}

export function fracToDec(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.pick([2, 4, 5, 8, 10, 20, 25]);
      const n = rng.int(1, d - 1);
      const answer = n / d;
      const hint = "Erweitere auf 10, 100 oder 1.000 oder teile Zähler durch Nenner.";
      return task(
        level,
        `Schreibe den Bruch ${fracText(n, d)} als Dezimalbruch.`,
        `Ein Anteil ${fracText(n, d)} einer Strecke soll als Dezimalbruch in eine Tabelle. Welcher Dezimalbruch ist das?`,
        [num("Dezimalbruch", answer, "", 3)],
        hint,
        `${fracText(n, d)} = ${fmt(answer, 3)}.`,
        fmt(answer, 3),
        { n, d },
      );
    },
  };
}

export function decPeriod(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const digit = rng.int(1, 9);
      const { n, d } = periodOne(digit);
      const hint = "Eine reine Periode aus einer Ziffer ist diese Ziffer geteilt durch 9. Kürze danach.";
      return task(
        level,
        `Die Zahl mit der einen Periode ${fmt(digit, 0)} direkt nach dem Komma soll als vollständig gekürzter Bruch geschrieben werden. Welchen Nenner hat er?`,
        `Ein Messgerät zeigt nach dem Komma immer wieder nur die Ziffer ${fmt(digit, 0)}, ohne Vorperiode. Welchen Nenner hat der vollständig gekürzte Bruch?`,
        [num("Nenner", d, "", 0, { slips: [{ value: 9, hint: "9 ist der Nenner vor dem Kürzen." }] })],
        hint,
        `0 Periode ${fmt(digit, 0)} = ${fracText(digit, 9)} = ${fracText(n, d)}.`,
        `Der Nenner ist ${fmt(d, 0)}.`,
        { digit },
      );
    },
  };
}

export function addSame(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.int(2, 12);
      const n1 = rng.int(0, d);
      const n2 = rng.int(0, d - Math.min(d, n1));
      const { n, d: rd } = reduce(n1 + n2, d);
      const hint = "Gleichnamige Brüche: Zähler addieren, Nenner behalten, danach kürzen.";
      return task(
        level,
        `Berechne ${fracText(n1, d)} + ${fracText(n2, d)} und gib den Nenner des gekürzten Ergebnisses an.`,
        `Zwei gleichnamige Anteile ${fracText(n1, d)} und ${fracText(n2, d)} werden zusammengelegt. Welcher Nenner bleibt nach dem Kürzen?`,
        [num("Nenner", rd, "", 0)],
        hint,
        `Zähler ${fmt(n1 + n2, 0)}, Nenner ${fmt(d, 0)}. Gekürzt ${fracText(n, rd)}.`,
        `Der Nenner ist ${fmt(rd, 0)}.`,
        { n1, n2, d },
      );
    },
  };
}

export function addDifferent(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d1 = rng.int(2, 6);
      const d2 = rng.int(2, 6);
      const n1 = rng.int(1, d1 - 1);
      const n2 = rng.int(1, d2 - 1);
      const { n, d } = reduce(n1 * d2 + n2 * d1, d1 * d2);
      const hint = "Mache die Brüche gleichnamig. Der Hauptnenner ist ein gemeinsames Vielfaches der Nenner.";
      return task(
        level,
        `Berechne ${fracText(n1, d1)} + ${fracText(n2, d2)}. Gib den Zähler des vollständig gekürzten Ergebnisses an.`,
        `Ein Rezept braucht ${fracText(n1, d1)} L und danach noch ${fracText(n2, d2)} L. Welcher Zähler beschreibt die Summe vollständig gekürzt?`,
        [num("Zähler", n, "", 0, { slips: [{ value: n1 + n2, hint: "Zähler darf man nur addieren, wenn die Nenner gleich sind." }] })],
        hint,
        `Hauptnenner ${fmt(lcm(d1, d2), 0)}. Gekürzt ${fracText(n, d)}.`,
        `Der Zähler ist ${fmt(n, 0)}.`,
        { n1, d1, n2, d2 },
      );
    },
  };
}

export function addMixed(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const w = rng.int(1, 4);
      const d = rng.int(2, 6);
      const n = rng.int(1, d - 1);
      const answer = w * d + n;
      const hint = "Wandle die gemischte Zahl in einen unechten Bruch: Ganze mal Nenner plus Zähler.";
      return task(
        level,
        `Schreibe ${fmt(w, 0)} und ${fracText(n, d)} als unechten Bruch. Welchen Zähler erhältst du?`,
        `Eine Strecke ist ${fmt(w, 0)} m und noch ${fracText(n, d)} m lang. Welcher Zähler beschreibt dieselbe Länge als unechten Bruch mit Nenner ${fmt(d, 0)}?`,
        [num("Zähler", answer, "", 0, { slips: [{ value: w + n, hint: "Die Ganzen müssen zuerst in Bruchteile verwandelt werden." }] })],
        hint,
        `${fmt(w, 0)} · ${fmt(d, 0)} + ${fmt(n, 0)} = ${fmt(answer, 0)}.`,
        `Der Zähler ist ${fmt(answer, 0)}.`,
        { w, n, d },
      );
    },
  };
}

export function addDecimal(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(-20, 30);
      const b = rng.int(-20, 30);
      const answer = (a + b) / 10;
      const hint = "Gleiche Stellen untereinander: Zehntel zu Zehnteln. Das Komma bleibt in seiner Spalte.";
      return task(
        level,
        `Berechne schriftlich die Summe ${fmt(a / 10, 1)} + ${paren(b / 10, 1)}.`,
        `Ein Konto ändert sich um ${fmt(a / 10, 1)} € und danach um ${fmt(b / 10, 1)} €. Wie lautet der neue Stand gegenüber dem Anfang, in Euro?`,
        [num("Summe", answer, "€", 1, { slips: [{ value: a + b, hint: "Die Zahlen sind Zehntel. Das Komma darf nicht verschwinden." }] })],
        hint,
        `${fmt(a / 10, 1)} + ${paren(b / 10, 1)} = ${fmt(answer, 1)}.`,
        `${fmt(answer, 1)} €.`,
        { a, b },
      );
    },
  };
}

export function addSmart(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(1, 8);
      const b = 10 - a;
      const c = rng.int(-6, 6);
      const answer = (a + b + c) / 10;
      const hint = "Paare, die zusammen 1 ergeben, rechnest du zuerst. Die Reihenfolge der Summanden darfst du ändern.";
      return task(
        level,
        `Berechne geschickt ${fmt(a / 10, 1)} + ${paren(c / 10, 1)} + ${fmt(b / 10, 1)}.`,
        `Drei Korrekturen an einem Messwert lauten ${fmt(a / 10, 1)}, ${fmt(c / 10, 1)} und ${fmt(b / 10, 1)}. Welcher Wert bleibt zusammen?`,
        [num("Summe", answer, "", 1)],
        hint,
        `${fmt(a / 10, 1)} + ${fmt(b / 10, 1)} = 1. Dazu ${fmt(c / 10, 1)} ergibt ${fmt(answer, 1)}.`,
        fmt(answer, 1),
        { a, b, c },
      );
    },
  };
}

export function termAdd(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const x = rng.int(-5, 8);
      const y = rng.int(1, 7);
      const z = rng.int(1, 6);
      const mode = rng.int(0, 2);
      const answer = mode === 1 ? x - (y + z) : x + y - z;
      const shown =
        mode === 0
          ? `${fmt(x, 0)} + ${fmt(y, 0)} − ${fmt(z, 0)}`
          : mode === 1
            ? `${fmt(x, 0)} − (${fmt(y, 0)} + ${fmt(z, 0)})`
            : `(${fmt(x, 0)} + ${fmt(y, 0)}) − ${fmt(z, 0)}`;
      const hint = "Klammern zuerst. Ohne Klammern rechnest du von links nach rechts, Plus und Minus sind gleichrangig.";
      return task(
        level,
        `Berechne den Wert des Terms ${shown}.`,
        `Ein Spielstand beginnt bei ${fmt(x, 0)} Punkten. Die weiteren Schritte stehen in ${shown}. Welcher Stand bleibt?`,
        [num("Wert", answer, "", 0, { slips: [{ value: x - y + z, hint: "Eine Klammer oder das Vorzeichen vor der Klammer ändert die Rechnung." }] })],
        hint,
        `${shown} = ${fmt(answer, 0)}.`,
        fmt(answer, 0),
        { x, y, z, mode },
      );
    },
  };
}

export function estimateSum(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(11, 89);
      const b = rng.int(11, 89);
      const answer = Math.round(a / 10) + Math.round(b / 10);
      const hint = "Runde jeden Summanden auf Einer und addiere die gerundeten Zahlen. Das ist der Überschlag, nicht die genaue Summe.";
      return task(
        level,
        `Gib einen Überschlag auf Einer für ${fmt(a / 10, 1)} + ${fmt(b / 10, 1)} an.`,
        `Reicht ein Überschlag auf Einer, um ${fmt(a / 10, 1)} kg und ${fmt(b / 10, 1)} kg ungefähr zusammenzunehmen? Welchen Überschlag erhältst du?`,
        [num("Überschlag", answer, "", 0, { slips: [{ value: (a + b) / 10, hint: "Das ist die genaue Summe. Für den Überschlag rundest du zuerst." }] })],
        hint,
        `${fmt(a / 10, 1)} wird ${fmt(Math.round(a / 10), 0)}, ${fmt(b / 10, 1)} wird ${fmt(Math.round(b / 10), 0)}. Summe ${fmt(answer, 0)}.`,
        `Der Überschlag ist ${fmt(answer, 0)}.`,
        { a, b },
      );
    },
  };
}

export function mulFrac(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d1 = rng.int(2, 6);
      const n1 = rng.int(1, d1 - 1);
      const d2 = rng.int(2, 6);
      const n2 = rng.int(1, d2 - 1);
      const { n, d } = reduce(n1 * n2, d1 * d2);
      const hint = "Von einem Bruch einen Anteil nehmen: Zähler mal Zähler, Nenner mal Nenner, danach kürzen.";
      return task(
        level,
        `Berechne ${fracText(n1, d1)} · ${fracText(n2, d2)} und gib den Zähler des gekürzten Produkts an.`,
        `Von einem Vorrat ist noch ${fracText(n2, d2)} da, und davon wird der Anteil ${fracText(n1, d1)} gebraucht. Welcher Zähler beschreibt das Produkt vollständig gekürzt?`,
        [num("Zähler", n, "", 0)],
        hint,
        `${fmt(n1, 0)} · ${fmt(n2, 0)} im Zähler, ${fmt(d1, 0)} · ${fmt(d2, 0)} im Nenner. Gekürzt ${fracText(n, d)}.`,
        `Der Zähler ist ${fmt(n, 0)}.`,
        { n1, d1, n2, d2 },
      );
    },
  };
}

export function divFrac(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d1 = rng.int(2, 6);
      const n1 = rng.int(1, d1 - 1);
      const d2 = rng.int(2, 6);
      const n2 = rng.int(1, d2 - 1);
      const { n, d } = reduce(n1 * d2, d1 * n2);
      const hint = "Durch einen Bruch teilen heißt mit dem Kehrbruch malnehmen.";
      return task(
        level,
        `Berechne ${fracText(n1, d1)} : ${fracText(n2, d2)} und gib den Nenner des gekürzten Quotienten an.`,
        `${fracText(n1, d1)} L Saft werden in Becher zu je ${fracText(n2, d2)} L gefüllt. Welcher Nenner beschreibt den Quotienten vollständig gekürzt?`,
        [num("Nenner", d, "", 0, { slips: [{ value: reduce(n1 * n2, d1 * d2).d, hint: "Der zweite Bruch wird nicht malgenommen, sondern umgekehrt." }] })],
        hint,
        `Kehrbruch ${fracText(d2, n2)}. Ergebnis ${fracText(n, d)}.`,
        `Der Nenner ist ${fmt(d, 0)}.`,
        { n1, d1, n2, d2 },
      );
    },
  };
}

export function mulDec(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 9);
      const b = rng.int(1, 9);
      const answer = (a * b) / 10;
      const hint = "Rechne zuerst ohne Komma und setze so viele Nachkommastellen, wie beide Faktoren zusammen haben.";
      return task(
        level,
        `Berechne das Produkt der Zahlen ${fmt(a, 0)} · ${fmt(b / 10, 1)}.`,
        `${count(a, "Band", "Bänder")} kostet jedes ${fmt(b / 10, 1)} €. Welchen Preis haben sie zusammen?`,
        [num("Produkt", answer, "€", 1, { slips: [{ value: a * b, hint: "Im Produkt bleibt eine Nachkommastelle." }] })],
        hint,
        `${fmt(a, 0)} · ${fmt(b, 0)} = ${fmt(a * b, 0)}, eine Stelle nach dem Komma: ${fmt(answer, 1)}.`,
        `${fmt(answer, 1)} €.`,
        { a, b },
      );
    },
  };
}

export function divDec(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const divisor = rng.int(2, 9);
      const quotient = rng.int(2, 12);
      const dividend = (quotient * divisor) / 10;
      const hint = "Verschiebe das Komma im Divisor und im Dividenden um gleich viele Stellen, bis der Divisor ganz ist.";
      return task(
        level,
        `Berechne den Quotienten ${fmt(dividend, 1)} : ${fmt(divisor / 10, 1)}.`,
        `${fmt(dividend, 1)} m Band werden in Stücke zu ${fmt(divisor / 10, 1)} m geschnitten. Wie viele Stücke entstehen?`,
        [num("Quotient", quotient, "", 0, { slips: [{ value: dividend / divisor, hint: "Das Komma im Divisor muss mitwandern." }] })],
        hint,
        `${fmt(dividend, 1)} : ${fmt(divisor / 10, 1)} = ${fmt(dividend * 10, 0)} : ${fmt(divisor, 0)} = ${fmt(quotient, 0)}.`,
        fmt(quotient, 0),
        { divisor, quotient },
      );
    },
  };
}

export function powerNat(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const base = rng.int(2, 9);
      const exp = rng.int(2, 4);
      const answer = base ** exp;
      const hint = "Die Basis wird genau so oft als Faktor genommen, wie der Exponent angibt.";
      return task(
        level,
        `Welchen Wert hat die Potenz ${fmt(base, 0)} hoch ${fmt(exp, 0)}?`,
        `${fmt(base, 0)} wird ${fmt(exp, 0)}-mal als Faktor genommen. Welchen Wert hat diese Potenz?`,
        [num("Wert", answer, "", 0, { slips: [{ value: base * exp, hint: "Hoch ist kein Malnehmen des Exponenten." }] })],
        hint,
        Array.from({ length: exp }, () => fmt(base, 0)).join(" · ") + ` = ${fmt(answer, 0)}.`,
        fmt(answer, 0),
        { base, exp },
      );
    },
  };
}

export function powerNeg(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const base = rng.int(2, 9);
      const exp = rng.int(1, 4);
      const answerDen = base ** exp;
      const hint = "Eine Potenz mit negativem Exponenten ist 1 geteilt durch die Potenz mit positivem Exponenten.";
      return task(
        level,
        `Schreibe ${fmt(base, 0)} hoch ${fmt(-exp, 0)} als Bruch und gib den Nenner an.`,
        `Eine Länge ist als ${fmt(base, 0)} hoch ${fmt(-exp, 0)} Meter notiert. Welcher Nenner gehört zu diesem Stammbruch?`,
        [num("Nenner", answerDen, "", 0, { slips: [{ value: base * exp, hint: "Der negative Exponent macht einen Bruch, keinen negativen Wert der Basis." }] })],
        hint,
        `${fmt(base, 0)} hoch ${fmt(-exp, 0)} = 1/${fmt(answerDen, 0)}.`,
        `Der Nenner ist ${fmt(answerDen, 0)}.`,
        { base, exp },
      );
    },
  };
}

export function mulSmart(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.pick([2, 4, 5, 8]);
      const b = rng.pick([25, 50]);
      const c = rng.int(2, 8);
      const answer = a * b * c;
      const hint = "Vertausche Faktoren so, dass 4 · 25 oder 2 · 50 zuerst 100 ergeben.";
      return task(
        level,
        `Berechne das Produkt geschickt: ${fmt(c, 0)} · ${fmt(a, 0)} · ${fmt(b, 0)}.`,
        `Ein Stapel enthält ${fmt(c, 0)} Lagen zu je ${fmt(a, 0)} Päckchen mit je ${fmt(b, 0)} Blatt. Wie viele Blätter sind das?`,
        [num("Produkt", answer, "", 0)],
        hint,
        `${fmt(a, 0)} · ${fmt(b, 0)} = ${fmt(a * b, 0)}. Mal ${fmt(c, 0)} ergibt ${fmt(answer, 0)}.`,
        fmt(answer, 0),
        { a, b, c },
      );
    },
  };
}

export function orderOps(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 9);
      const b = rng.int(2, 6);
      const c = rng.int(2, 8);
      const answer = a + b * c;
      const hint = "Punkt vor Strich: zuerst malnehmen, dann addieren.";
      return task(
        level,
        `Berechne den Term ${fmt(a, 0)} + ${fmt(b, 0)} · ${fmt(c, 0)} schrittweise.`,
        `Mia startet mit ${count(a, "Punkt", "Punkten")} und gewinnt ${count(b, "Runde", "Runden")} mit je ${count(c, "Punkt", "Punkten")}. Welcher Stand ergibt sich?`,
        [num("Wert", answer, "", 0, { slips: [{ value: (a + b) * c, hint: "Zuerst wird multipliziert, nicht die Summe." }] })],
        hint,
        `${fmt(b, 0)} · ${fmt(c, 0)} = ${fmt(b * c, 0)}. Dazu ${fmt(a, 0)} ergibt ${fmt(answer, 0)}.`,
        fmt(answer, 0),
        { a, b, c },
      );
    },
  };
}

export function mentalTerm(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 5);
      const b = rng.int(2, 5);
      const answer = a * b - a;
      const hint = "Kleine Zahlen kannst du im Kopf lassen. Klammere den gemeinsamen Faktor, wenn es hilft: a · b − a = a · (b − 1).";
      return task(
        level,
        `Berechne im Kopf den Term ${fmt(a, 0)} · ${fmt(b, 0)} − ${fmt(a, 0)}.`,
        `Ein Heftstapel hat ${fmt(a, 0)} Reihen zu je ${fmt(b, 0)} Heften, eine Reihe wird weggenommen. Wie viele Hefte bleiben?`,
        [num("Wert", answer, "", 0)],
        hint,
        `${fmt(a, 0)} · (${fmt(b, 0)} − 1) = ${fmt(a, 0)} · ${fmt(b - 1, 0)} = ${fmt(answer, 0)}.`,
        fmt(answer, 0),
        { a, b },
      );
    },
  };
}

export function distributive(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 9);
      const b = rng.int(4, 20);
      const c = rng.int(2, 9);
      const answer = a * (b + c);
      const hint = "a · (b + c) = a · b + a · c. Du darfst zuerst die Klammer ausrechnen.";
      return task(
        level,
        `Berechne das Produkt ${fmt(a, 0)} · (${fmt(b, 0)} + ${fmt(c, 0)}).`,
        `${count(a, "Person", "Personen")} kauft je ein Heft zu ${fmt(b, 0)} € und einen Stift zu ${fmt(c, 0)} €. Welchen Betrag zahlen sie zusammen?`,
        [num("Wert", answer, "€", 0, { slips: [{ value: a * b + c, hint: "Der Faktor gilt für beide Summanden." }] })],
        hint,
        `${fmt(a, 0)} · ${fmt(b, 0)} + ${fmt(a, 0)} · ${fmt(c, 0)} = ${fmt(a * b, 0)} + ${fmt(a * c, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} €.`,
        { a, b, c },
      );
    },
  };
}

export function partOfPart(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d1 = rng.pick([2, 3, 4, 5]);
      const n1 = 1;
      const d2 = rng.pick([2, 3, 4, 5]);
      const n2 = rng.int(1, d2 - 1);
      const { n, d } = reduce(n1 * n2, d1 * d2);
      const hint = "Ein Anteil von einem Anteil ist das Produkt der beiden Brüche.";
      return task(
        level,
        `Wie viel ist ${fracText(n1, d1)} von ${fracText(n2, d2)}? Gib den Nenner des gekürzten Bruchs an.`,
        `Eine Flasche ist zu ${fracText(n2, d2)} gefüllt, und davon wird ${fracText(n1, d1)} ausgeschenkt. Welcher Nenner beschreibt den Anteil an der ganzen Flasche, vollständig gekürzt?`,
        [num("Nenner", d, "", 0)],
        hint,
        `${fracText(n1, d1)} · ${fracText(n2, d2)} = ${fracText(n, d)}.`,
        `Der Nenner ist ${fmt(d, 0)}.`,
        { d1, n2, d2 },
      );
    },
  };
}

export function wordMix(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const d = rng.pick([2, 4, 5]);
      const n = rng.int(1, d - 1);
      const p = rng.pick([10, 20, 25, 50]);
      const groups = (100 / gcd(p, 100)) * rng.int(1, 3);
      const whole = d * groups;
      const part = n * groups;
      const answer = (part * p) / 100;
      const hint = "Zuerst den Bruchteil der Menge, danach den Prozentsatz von diesem Zwischenergebnis.";
      return task(
        level,
        `Von ${fmt(whole, 0)} Schülerinnen und Schülern fahren ${fracText(n, d)} mit. ${fmt(p, 0)} % davon kommen zu spät. Wie viele sind das?`,
        `Eine Gruppe von ${count(whole, "Person", "Personen")} teilt sich. ${fracText(n, d)} gehen in die Werkstatt, und ${fmt(p, 0)} % dieser Werkstattgruppe brauchen noch Material. Wie viele Personen brauchen Material?`,
        [num("Anzahl", answer, "", 0, { slips: [{ value: (whole * p) / 100, hint: "Der Prozentsatz bezieht sich auf den Bruchteil, nicht auf die ganze Gruppe." }] })],
        hint,
        `${fracText(n, d)} von ${fmt(whole, 0)} ist ${fmt(part, 0)}. ${fmt(p, 0)} % davon sind ${fmt(answer, 0)}.`,
        fmt(answer, 0),
        { whole, n, d, p },
      );
    },
  };
}

export function paraTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const g = rng.int(4, 18);
      const h = rng.int(3, 12);
      const side = h + rng.int(1, 4);
      const answer = paraArea(g, h);
      const hint = "Zum Flächeninhalt gehören Grundlinie und die senkrecht dazu gemessene Höhe, nicht die schräge Seite.";
      return task(
        level,
        `Ein Parallelogramm hat die Grundlinie ${fmt(g, 0)} cm und die zugehörige Höhe ${fmt(h, 0)} cm. Wie groß ist der Flächeninhalt?`,
        `Ein Beet hat die Form eines Parallelogramms. Die lange Seite ist ${fmt(g, 0)} m, die schräge Seite ${fmt(side, 0)} m, die Höhe senkrecht zur langen Seite ${fmt(h, 0)} m. Wie groß ist der Flächeninhalt?`,
        [num("Flächeninhalt", answer, level === 1 ? "cm²" : "m²", 0, { slips: [{ value: g * side, hint: "Die schräge Seite ist nicht die Höhe." }] })],
        hint,
        `${fmt(g, 0)} · ${fmt(h, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} ${level === 1 ? "cm²" : "m²"}.`,
        { g, h, side },
      );
    },
  };
}

export function triTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const g = rng.int(2, 9) * 2;
      const h = rng.int(3, 12);
      const answer = triArea(g, h);
      const hint = "Dreieck: Grundlinie mal zugehörige Höhe, danach durch 2. Ein Dreieck ist die Hälfte eines Parallelogramms.";
      return task(
        level,
        `Ein Dreieck hat die Grundseite ${fmt(g, 0)} cm und die zugehörige Höhe ${fmt(h, 0)} cm. Wie groß ist der Flächeninhalt?`,
        `Ein Segel ist ein Dreieck. Die Unterkante misst ${fmt(g, 0)} dm, die Höhe senkrecht dazu ${fmt(h, 0)} dm. Welchen Flächeninhalt hat das Segel?`,
        [num("Flächeninhalt", answer, level === 1 ? "cm²" : "dm²", 0, { slips: [{ value: g * h, hint: "Das wäre das Parallelogramm. Das Dreieck ist die Hälfte." }] })],
        hint,
        `${fmt(g, 0)} · ${fmt(h, 0)} : 2 = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} ${level === 1 ? "cm²" : "dm²"}.`,
        { g, h },
      );
    },
  };
}

export function trapTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(3, 10) * 2;
      const c = rng.int(1, a / 2 - 1) * 2;
      const h = rng.int(2, 9);
      const answer = trapArea(a, c, h);
      const hint = "Trapez: die beiden parallelen Seiten addieren, durch 2 teilen, mit der Höhe malnehmen.";
      return task(
        level,
        `Ein Trapez hat die parallelen Seiten ${fmt(a, 0)} cm und ${fmt(c, 0)} cm und die Höhe ${fmt(h, 0)} cm. Wie groß ist der Flächeninhalt?`,
        `Ein Grundstück ist ein Trapez. Die parallelen Zäune sind ${fmt(a, 0)} m und ${fmt(c, 0)} m lang, der Abstand dazwischen ${fmt(h, 0)} m. Welchen Flächeninhalt hat das Grundstück?`,
        [num("Flächeninhalt", answer, level === 1 ? "cm²" : "m²", 0, { slips: [{ value: a * c * h, hint: "Die parallelen Seiten werden addiert, nicht multipliziert." }] })],
        hint,
        `(${fmt(a, 0)} + ${fmt(c, 0)}) : 2 · ${fmt(h, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} ${level === 1 ? "cm²" : "m²"}.`,
        { a, c, h },
      );
    },
  };
}

export function whichLength(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      let base = rng.int(6, 14);
      const height = rng.int(3, 8);
      if (base === height) base += 1;
      const slant = height + rng.int(2, 5);
      const options = [`${fmt(base, 0)} cm`, `${fmt(height, 0)} cm`, `${fmt(slant, 0)} cm`];
      const hint = "Die Höhe steht senkrecht auf der Grundlinie. Eine schräge Seite ist meist länger als die Höhe.";
      return task(
        level,
        `Zum Flächeninhalt eines Parallelogramms mit Grundlinie ${fmt(base, 0)} cm gehört welche Strecke als Höhe, wenn die schräge Seite ${fmt(slant, 0)} cm misst und der senkrechte Abstand ${fmt(height, 0)} cm beträgt?`,
        `In einer Skizze sind drei Längen beschriftet: die Grundlinie ${fmt(base, 0)} cm, eine Schräge ${fmt(slant, 0)} cm und der senkrechte Abstand der Gegenseite ${fmt(height, 0)} cm. Welche Länge ist die Höhe zur Grundlinie?`,
        [pick("Die Höhe ist …", options, 1)],
        hint,
        `Senkrecht zur Grundlinie steht der Abstand ${fmt(height, 0)} cm.`,
        `Die Höhe ist ${fmt(height, 0)} cm.`,
        { base, height, slant },
      );
    },
  };
}

export function compareAreas(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const g1 = rng.int(4, 12);
      const h1 = rng.int(3, 9);
      let g2 = rng.int(4, 12);
      let h2 = rng.int(3, 9);
      let tri = triArea(g1, h1);
      let para = paraArea(g2, h2);
      if (tri === para) {
        h2 += 1;
        para = paraArea(g2, h2);
      }
      const options = ["das Dreieck", "das Parallelogramm"];
      const index = tri > para ? 0 : 1;
      const hint = "Rechne beide Flächeninhalte. Gleiche Grundlinie und gleiche Höhe würden das Dreieck zur Hälfte des Parallelogramms machen; hier können die Maße verschieden sein.";
      return task(
        level,
        `Ein Dreieck hat die Grundlinie ${fmt(g1, 0)} cm und die Höhe ${fmt(h1, 0)} cm. Ein Parallelogramm hat die Grundlinie ${fmt(g2, 0)} cm und die Höhe ${fmt(h2, 0)} cm. Welche Figur hat den größeren Flächeninhalt?`,
        `Zwei Beete: das dreieckige misst ${fmt(g1, 0)} m an der Basis und ${fmt(h1, 0)} m in der Höhe, das parallelogrammförmige ${fmt(g2, 0)} m an der Basis und ${fmt(h2, 0)} m in der Höhe. Welches Beet ist größer?`,
        [pick("Größer ist …", options, index)],
        hint,
        `Dreieck ${fmt(tri, 1)}, Parallelogramm ${fmt(para, 0)}.`,
        options[index] === "das Dreieck" ? "Das Dreieck ist größer." : "Das Parallelogramm ist größer.",
        { g1, h1, g2, h2 },
      );
    },
  };
}

export function surfaceTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 8);
      const b = rng.int(2, 6);
      const c = rng.int(2, 6);
      const answer = boxSurface(a, b, c);
      const hint = "Ein Quader hat drei Paare gleicher Rechtecke: 2 · (a·b + a·c + b·c).";
      return task(
        level,
        `Ein Quader ist ${fmt(a, 0)} cm lang, ${fmt(b, 0)} cm breit und ${fmt(c, 0)} cm hoch. Wie groß ist die Oberfläche?`,
        `Eine Schachtel von ${fmt(a, 0)} cm mal ${fmt(b, 0)} cm mal ${fmt(c, 0)} cm wird außen vollständig beklebt. Welche Fläche hat das Papier, ohne Verschnitt?`,
        [num("Oberfläche", answer, "cm²", 0, { slips: [{ value: boxVolume(a, b, c), hint: "Das ist das Volumen. Die Oberfläche zählt die Rechtecke außen." }] })],
        hint,
        `2 · (${fmt(a * b, 0)} + ${fmt(a * c, 0)} + ${fmt(b * c, 0)}) = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} cm².`,
        { a, b, c },
      );
    },
  };
}

export function volumeTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 9);
      const b = rng.int(2, 7);
      const c = rng.int(2, 6);
      const answer = boxVolume(a, b, c);
      const hint = "Volumen eines Quaders: Länge mal Breite mal Höhe. Die Einheit ist eine Raummaßeinheit.";
      return task(
        level,
        `Ein Quader misst ${fmt(a, 0)} cm, ${fmt(b, 0)} cm und ${fmt(c, 0)} cm. Welches Volumen hat er?`,
        `Ein Aquarium ist ${fmt(a, 0)} dm lang, ${fmt(b, 0)} dm breit und ${fmt(c, 0)} dm hoch. Wie viele Kubikdezimeter fasst es, wenn es ganz gefüllt ist?`,
        [num("Volumen", answer, level === 1 ? "cm³" : "dm³", 0, { slips: [{ value: boxSurface(a, b, c), hint: "Das ist die Oberfläche, nicht der Rauminhalt." }] })],
        hint,
        `${fmt(a, 0)} · ${fmt(b, 0)} · ${fmt(c, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} ${level === 1 ? "cm³" : "dm³"}.`,
        { a, b, c },
      );
    },
  };
}

export function convertVol(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const row = rng.pick([
        { from: "dm3", to: "cm3", fromText: "dm³", toText: "cm³", value: rng.int(2, 9) },
        { from: "l", to: "ml", fromText: "l", toText: "ml", value: rng.int(2, 9) },
        { from: "m3", to: "l", fromText: "m³", toText: "l", value: rng.int(2, 6) },
        { from: "cm3", to: "ml", fromText: "cm³", toText: "ml", value: rng.int(2, 40) },
      ]);
      const answer = convertVolume(row.value, row.from, row.to);
      const hint = "Benachbarte Raummaßeinheiten unterscheiden sich um den Faktor 1.000. Ein Liter ist ein Kubikdezimeter, ein Milliliter ein Kubikzentimeter.";
      return task(
        level,
        `Rechne die Volumenangabe ${fmt(row.value, 0)} ${row.fromText} in ${row.toText} um.`,
        `Ein Gefäß fasst ${fmt(row.value, 0)} ${row.fromText}. Wie viele ${row.toText} sind das?`,
        [num("Wert", answer, row.toText, 0, { slips: [{ value: row.value * 100, hint: "Bei Flächen ist der Faktor 100. Bei Volumen ist er 1.000, außer bei l und dm³ sowie ml und cm³." }] })],
        hint,
        `${fmt(row.value, 0)} ${row.fromText} = ${fmt(answer, 0)} ${row.toText}.`,
        `${fmt(answer, 0)} ${row.toText}.`,
        { value: row.value },
      );
    },
  };
}

export function approxVol(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 6) * 10;
      const b = rng.int(2, 5) * 10;
      const c = rng.int(2, 4) * 10;
      const answer = boxVolume(a, b, c);
      const hint = "Ersetze den Körper durch einen passenden Quader und rechne dessen Volumen. Das ist ein Näherungswert.";
      return task(
        level,
        `Ein Karton wird als Quader ${fmt(a, 0)} cm mal ${fmt(b, 0)} cm mal ${fmt(c, 0)} cm genähert. Welchen Näherungswert hat das Volumen?`,
        `Ein Rucksack wird außen ungefähr als Quader gemessen: ${fmt(a, 0)} cm hoch, ${fmt(b, 0)} cm breit, ${fmt(c, 0)} cm tief. Welchen Näherungswert erhältst du für das Volumen?`,
        [num("Näherung", answer, "cm³", 0)],
        hint,
        `${fmt(a, 0)} · ${fmt(b, 0)} · ${fmt(c, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} cm³.`,
        { a, b, c },
      );
    },
  };
}

export function splitVol(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(5, 9);
      const b = rng.int(3, 6);
      const c = rng.int(2, 5);
      const cut = rng.int(2, a - 2);
      const left = cut * b * c;
      const right = (a - cut) * b * c;
      const answer = left + right;
      const hint = "Zerlege den Körper in zwei Quader, rechne beide Volumen und addiere. Zusammen ist das die ganze Länge mal Breite mal Höhe.";
      return task(
        level,
        `Ein Quader von ${fmt(a, 0)} cm mal ${fmt(b, 0)} cm mal ${fmt(c, 0)} cm wird nach ${fmt(cut, 0)} cm zerschnitten. Welches Volumen haben beide Stücke zusammen?`,
        `Eine Stufe besteht aus zwei Quadern derselben Breite ${fmt(b, 0)} cm und Höhe ${fmt(c, 0)} cm. Die Längen sind ${fmt(cut, 0)} cm und ${fmt(a - cut, 0)} cm. Welches Volumen hat die Stufe?`,
        [num("Volumen", answer, "cm³", 0, { slips: [{ value: left, hint: "Das ist nur eines der beiden Stücke." }] })],
        hint,
        `${fmt(left, 0)} + ${fmt(right, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} cm³.`,
        { a, b, c, cut },
      );
    },
  };
}

export function compoundVol(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(6, 10);
      const b = rng.int(5, 8);
      const h = rng.int(2, 4);
      const holeA = rng.int(2, a - 2);
      const holeB = rng.int(2, b - 2);
      const answer = (a * b - holeA * holeB) * h;
      const hint = "Vom großen Quader ziehst du den fehlenden Quader ab. Beide haben hier dieselbe Höhe.";
      return task(
        level,
        `Ein Quader ${fmt(a, 0)} cm mal ${fmt(b, 0)} cm mal ${fmt(h, 0)} cm hat eine quaderförmige Aussparung ${fmt(holeA, 0)} cm mal ${fmt(holeB, 0)} cm über die ganze Höhe. Welches Volumen bleibt?`,
        `Eine Platte ist ${fmt(a, 0)} cm lang, ${fmt(b, 0)} cm breit und ${fmt(h, 0)} cm dick. Eine Ecke von ${fmt(holeA, 0)} cm mal ${fmt(holeB, 0)} cm ist über die ganze Dicke ausgeschnitten. Welches Volumen hat die Platte?`,
        [num("Volumen", answer, "cm³", 0, { slips: [{ value: a * b * h, hint: "Die Aussparung ist noch nicht abgezogen." }] })],
        hint,
        `(${fmt(a * b, 0)} − ${fmt(holeA * holeB, 0)}) · ${fmt(h, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} cm³.`,
        { a, b, h },
      );
    },
  };
}

export function percentOf(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const p = rng.pick([5, 10, 20, 25, 50]);
      const g = rng.int(2, 16) * 20;
      const answer = (g * p) / 100;
      const hint = "Prozentwert = Grundwert mal Prozentsatz geteilt durch 100.";
      return task(
        level,
        `Welcher Prozentwert gehört zu ${fmt(p, 0)} % von ${fmt(g, 0)} €?`,
        `Ein Fahrrad kostet ${fmt(g, 0)} €. Der Händler gibt ${fmt(p, 0)} % Rabatt. Wie viele Euro beträgt der Rabatt?`,
        [num("Prozentwert", answer, "€", 0, { slips: [{ value: g / p, hint: "Teile durch 100 und nimm den Prozentsatz mal, nicht den Grundwert geteilt durch den Prozentsatz." }] })],
        hint,
        `${fmt(g, 0)} · ${fmt(p, 0)} : 100 = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} €.`,
        { g, p },
      );
    },
  };
}

export function percentRate(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const p = rng.pick([5, 10, 20, 25, 40, 50]);
      const g = rng.int(2, 12) * 20;
      const w = (g * p) / 100;
      const hint = "Prozentsatz = Prozentwert geteilt durch Grundwert, mal 100.";
      return task(
        level,
        `${fmt(w, 0)} € von ${fmt(g, 0)} € sind wie viel Prozent?`,
        `Von ${count(g, "Stimme", "Stimmen")} entfallen ${fmt(w, 0)} auf einen Vorschlag. Wie viel Prozent sind das?`,
        [num("Prozentsatz", p, "%", 0, { slips: [{ value: w, hint: "Das ist der Prozentwert in Euro oder Stimmen, noch nicht der Prozentsatz." }] })],
        hint,
        `${fmt(w, 0)} : ${fmt(g, 0)} · 100 = ${fmt(p, 0)}.`,
        `${fmt(p, 0)} %.`,
        { g, p },
      );
    },
  };
}

export function percentBase(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const p = rng.pick([10, 20, 25, 50]);
      const g = rng.int(2, 12) * 20;
      const w = (g * p) / 100;
      const hint = "Grundwert = Prozentwert geteilt durch den Prozentsatz, mal 100.";
      return task(
        level,
        `${fmt(w, 0)} € sind ${fmt(p, 0)} %. Wie groß ist der Grundwert?`,
        `${fmt(w, 0)} € sind ${fmt(p, 0)} % eines Preises. Wie hoch war der ganze Preis?`,
        [num("Grundwert", g, "€", 0, { slips: [{ value: w * p, hint: "Der Prozentsatz steht im Nenner, nicht als weiterer Faktor ohne die 100." }] })],
        hint,
        `${fmt(w, 0)} : ${fmt(p, 0)} · 100 = ${fmt(g, 0)}.`,
        `${fmt(g, 0)} €.`,
        { g, p },
      );
    },
  };
}

export function discountTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const p = rng.pick([10, 20, 25, 50]);
      const g = rng.int(2, 16) * 20;
      const off = (g * p) / 100;
      const answer = g - off;
      const hint = "Zuerst den Rabatt als Prozentwert, dann vom Grundwert abziehen. Der neue Preis ist nicht der Rabatt.";
      return task(
        level,
        `Ein Preis von ${fmt(g, 0)} € wird um ${fmt(p, 0)} % gesenkt. Welcher Preis bleibt?`,
        `Im Schlussverkauf kostet eine Jacke von ${fmt(g, 0)} € jetzt ${fmt(p, 0)} % weniger. Welchen Preis zahlst du?`,
        [num("neuer Preis", answer, "€", 0, { slips: [{ value: off, hint: "Das ist der Rabatt, nicht der neue Preis." }] })],
        hint,
        `Rabatt ${fmt(off, 0)} €. ${fmt(g, 0)} − ${fmt(off, 0)} = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} €.`,
        { g, p },
      );
    },
  };
}

export function interestTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const p = rng.pick([1, 2, 3, 4, 5]);
      const capital = rng.int(2, 12) * 100;
      const answer = interest(capital, p);
      const hint = "Zinsen für ein Jahr: Kapital mal Zinssatz geteilt durch 100. Das Kapital selbst kommt nicht dazu, wenn nach den Zinsen gefragt ist.";
      return task(
        level,
        `Wie viele Euro Zinsen bringt ein Kapital von ${fmt(capital, 0)} € in einem Jahr bei ${fmt(p, 0)} %?`,
        `Auf einem Sparbuch liegen ${fmt(capital, 0)} €. Der Zinssatz für ein Jahr beträgt ${fmt(p, 0)} %. Wie viele Euro Zinsen schreibt die Bank gut?`,
        [num("Zinsen", answer, "€", 0, { slips: [{ value: capital + answer, hint: "Das wäre das Kapital samt Zinsen. Gefragt sind nur die Zinsen." }] })],
        hint,
        `${fmt(capital, 0)} · ${fmt(p, 0)} : 100 = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} €.`,
        { capital, p },
      );
    },
  };
}

export function percentPoints(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const from = rng.pick([10, 20, 25, 40, 50]);
      const delta = rng.pick([5, 10, 15]);
      const to = from + delta;
      const hint = "Prozentpunkte sind die Differenz der beiden Prozentsätze. Der relative Zuwachs wäre diese Differenz geteilt durch den alten Satz.";
      return task(
        level,
        `Ein Anteil steigt von ${fmt(from, 0)} % auf ${fmt(to, 0)} %. Um wie viele Prozentpunkte steigt er?`,
        `In einer Zeitung steht: Der Anteil lag bei ${fmt(from, 0)} % und liegt jetzt bei ${fmt(to, 0)} %. Um wie viele Prozentpunkte hat er sich verändert?`,
        [num("Prozentpunkte", delta, "", 0, { slips: [{ value: (delta / from) * 100, hint: "Das wäre die relative Änderung in Prozent, nicht die Differenz in Prozentpunkten." }] })],
        hint,
        `${fmt(to, 0)} − ${fmt(from, 0)} = ${fmt(delta, 0)}.`,
        `${fmt(delta, 0)} Prozentpunkte.`,
        { from, to },
      );
    },
  };
}

export function everyKth(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const k = rng.int(3, 8);
      const groups = rng.int(3, 9);
      const total = k * groups;
      const hint = "„Jeder k-te“ bedeutet den Anteil 1/k. Teile die Anzahl durch k.";
      return task(
        level,
        `Jeder ${fmt(k, 0)}. von ${count(total, "Person", "Personen")} wird ausgelost. Wie viele Personen sind das?`,
        `Eine Meldung sagt: „Jede ${fmt(k, 0)}. Person von ${fmt(total, 0)} hat zugestimmt.“ Wie viele Personen sind das?`,
        [num("Anzahl", groups, "", 0, { slips: [{ value: total - groups, hint: "Gefragt ist der Anteil 1/k, nicht der Rest." }] })],
        hint,
        `${fmt(total, 0)} : ${fmt(k, 0)} = ${fmt(groups, 0)}.`,
        fmt(groups, 0),
        { k, total },
      );
    },
  };
}

export function frequency(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const total = rng.pick([10, 20, 25, 50]);
      const countAbs = rng.int(1, total - 1);
      const answer = (countAbs / total) * 100;
      const hint = "Relative Häufigkeit = absolute Häufigkeit geteilt durch die Anzahl aller Daten. Als Prozentsatz mal 100.";
      return task(
        level,
        `Von ${fmt(total, 0)} Beobachtungen entfallen ${fmt(countAbs, 0)} auf eine Sorte. Wie viel Prozent sind das?`,
        `In einer Umfrage mit ${count(total, "Antwort", "Antworten")} wählen ${fmt(countAbs, 0)} Personen dieselbe Farbe. Wie groß ist die relative Häufigkeit in Prozent?`,
        [num("Prozent", answer, "%", 0, { slips: [{ value: countAbs, hint: "Das ist die absolute Häufigkeit, nicht der Anteil in Prozent." }] })],
        hint,
        `${fmt(countAbs, 0)} : ${fmt(total, 0)} · 100 = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} %.`,
        { total, countAbs },
      );
    },
  };
}

export function pieAngle(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const total = rng.pick([12, 18, 36]);
      const votes = rng.int(1, total - 1);
      const answer = (votes / total) * 360;
      const hint = "Der volle Kreis hat 360 Grad und steht für 100 %. Mittelpunktswinkel = Anteil mal 360 Grad.";
      return task(
        level,
        `${fmt(votes, 0)} von ${fmt(total, 0)} Stimmen gehören zu einer Farbe. Wie groß ist der Mittelpunktswinkel im Kreisdiagramm?`,
        `Bei einer Wahl mit ${count(total, "Stimme", "Stimmen")} erhält ein Vorschlag ${fmt(votes, 0)} Stimmen. Welchen Mittelpunktswinkel zeichnest du dafür?`,
        [num("Winkel", answer, "°", 0, { slips: [{ value: (votes / total) * 100, hint: "Das ist der Prozentsatz. Der Winkel entsteht aus dem Anteil mal 360 Grad." }] })],
        hint,
        `${fmt(votes, 0)} : ${fmt(total, 0)} · 360 = ${fmt(answer, 0)}.`,
        `${fmt(answer, 0)} °.`,
        { votes, total },
      );
    },
  };
}

export function meanTask(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const m = rng.int(6, 12);
      const a = m + rng.int(-2, 2);
      const b = m + rng.int(-2, 2);
      const c = m + rng.int(-2, 2);
      const d = 4 * m - a - b - c;
      const hint = "Arithmetisches Mittel: alle Werte addieren und durch die Anzahl teilen.";
      return task(
        level,
        `Bilde das arithmetische Mittel von ${fmt(a, 0)}, ${fmt(b, 0)}, ${fmt(c, 0)} und ${fmt(d, 0)}.`,
        `Vier Messungen eines Weges ergeben ${fmt(a, 0)} m, ${fmt(b, 0)} m, ${fmt(c, 0)} m und ${fmt(d, 0)} m. Welches arithmetische Mittel haben sie?`,
        [num("Mittel", m, "m", 0, { slips: [{ value: a + b + c + d, hint: "Das ist die Summe. Teile noch durch 4." }] })],
        hint,
        `Summe ${fmt(4 * m, 0)}. Geteilt durch 4: ${fmt(m, 0)}.`,
        `${fmt(m, 0)} m.`,
        { a, b, c, d },
      );
    },
  };
}

export function whichPlace(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const ones = rng.int(1, 9);
      let tenths = rng.int(0, 9);
      if (tenths === ones) tenths = (tenths + 1) % 10;
      let hundredths = rng.int(0, 9);
      if (hundredths === ones || hundredths === tenths) {
        hundredths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].find((digit) => digit !== ones && digit !== tenths) ?? 0;
      }
      const digits = [ones, tenths, hundredths];
      const value = ones + tenths / 10 + hundredths / 100;
      const place = rng.int(0, 2);
      const options = ["Einer", "Zehntel", "Hundertstel"];
      const hint = "Die erste Stelle nach dem Komma sind die Zehntel, die zweite die Hundertstel.";
      return task(
        level,
        `An welcher Stelle steht die Ziffer ${fmt(digits[place], 0)} in der Zahl ${fmt(value, 2)}?`,
        `Ein Messwert lautet ${fmt(value, 2)}. An welcher Stelle steht darin die Ziffer ${fmt(digits[place], 0)}?`,
        [pick("Die Stelle ist …", options, place)],
        hint,
        `Die Ziffer ${fmt(digits[place], 0)} steht an der Stelle ${options[place]}.`,
        options[place],
        { ones, tenths, hundredths, place },
      );
    },
  };
}

export function barRead(id: string): ExerciseGenerator {
  return {
    id,
    make: (rng, level) => {
      const a = rng.int(2, 12);
      const b = rng.int(0, 12);
      const c = rng.int(0, 12);
      const hint = "Lies die Höhen an der Skala ab und addiere sie. Eine abgeschnittene Achse ändert die gezeichnete Höhe, nicht die Zahl.";
      return task(
        level,
        `Ein Säulendiagramm zeigt die Werte ${fmt(a, 0)}, ${fmt(b, 0)} und ${fmt(c, 0)}. Wie groß ist die Summe?`,
        `Drei Klassen haben ${count(a, "Anmeldung", "Anmeldungen")}, ${count(b, "Anmeldung", "Anmeldungen")} und ${count(c, "Anmeldung", "Anmeldungen")}. Wie viele Anmeldungen sind das zusammen, unabhängig davon, wo die Achse beginnt?`,
        [num("Summe", a + b + c, "", 0)],
        hint,
        `${fmt(a, 0)} + ${fmt(b, 0)} + ${fmt(c, 0)} = ${fmt(a + b + c, 0)}.`,
        fmt(a + b + c, 0),
        { a, b, c },
      );
    },
  };
}
