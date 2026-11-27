import type { Exercise, Level, PracticeKind } from "../model/types";
import { fmt, money } from "../format";
import type { Rng } from "./rng";

/**
 * A market that is easy to read off a table: both curves have the same slope
 * `k`, so the equilibrium sits at a whole price and a whole quantity, and a
 * shift of the demand curve by 2k moves it by exactly one euro.
 */
function marketTable(rng: Rng) {
  const k = rng.int(0, 1) ? 10 : 5;
  const price = rng.int(3, 7);
  const supplyBase = rng.int(1, 5) * 10;
  const quantity = k * price + supplyBase;
  const demandBase = quantity + k * price;
  const demand = (p: number) => demandBase - k * p;
  const supply = (p: number) => supplyBase + k * p;
  const prices = [price - 2, price - 1, price, price + 1, price + 2];
  return { k, price, quantity, demandBase, supplyBase, demand, supply, prices };
}

export function makeExercise(kind: PracticeKind, rng: Rng, level: Level): Exercise {
  const task: Exercise = { prompt: "", hint: "", fields: [], solution: "" };
  const field = (label: string, answer: number, unit: string) =>
    task.fields.push({ label, answer: money(answer), unit });
  switch (kind) {
    case "gleichgewicht": {
      const m = marketTable(rng);
      task.table = {
        head: ["Preis (Euro)", "Nachfrage (Stück)", "Angebot (Stück)"],
        rows: m.prices.map((p) => [fmt(p), m.demand(p), m.supply(p)]),
      };
      if (level === 1) {
        task.prompt =
          "Die Tabelle zeigt, wie viele Stück Käufer und Verkäufer bei jedem Preis wollen. Bestimme den Gleichgewichtspreis und die Gleichgewichtsmenge.";
        task.hint = "Suche die Zeile, in der Angebot und Nachfrage gleich groß sind.";
        field("Gleichgewichtspreis", m.price, "Euro");
        field("Gleichgewichtsmenge", m.quantity, "Stück");
        task.solution = `Bei ${fmt(m.price)} Euro fragen die Käufer ${m.demand(m.price)} Stück nach und die Verkäufer bieten ${m.supply(m.price)} Stück an. Das ist das Marktgleichgewicht: ${fmt(m.price)} Euro und ${m.quantity} Stück.`;
      } else {
        const shift = 2 * m.k;
        task.prompt = `Ausgangslage ist die Tabelle. Nun steigt die Nachfrage: Bei jedem Preis wollen die Käufer ${shift} Stück mehr, das Angebot bleibt gleich. Bestimme das neue Marktgleichgewicht.`;
        task.hint =
          "Addiere die zusätzliche Nachfrage zu jeder Nachfragezahl und suche wieder die Zeile mit gleichem Angebot und gleicher Nachfrage.";
        field("Neuer Gleichgewichtspreis", m.price + 1, "Euro");
        field("Neue Gleichgewichtsmenge", m.quantity + m.k, "Stück");
        task.solution = `Neue Nachfrage bei ${fmt(m.price + 1)} Euro: ${m.demand(m.price + 1)} + ${shift} = ${m.demand(m.price + 1) + shift} Stück, das Angebot beträgt dort ${m.supply(m.price + 1)} Stück. Der Preis steigt auf ${fmt(m.price + 1)} Euro, die Menge auf ${m.quantity + m.k} Stück.`;
      }
      break;
    }
    case "ueberhang": {
      const m = marketTable(rng);
      if (level === 1) {
        const offset = rng.int(1, 2);
        const market = m.price + offset;
        task.table = {
          head: ["Preis (Euro)", "Nachfrage (Stück)", "Angebot (Stück)"],
          rows: m.prices.map((p) => [fmt(p), m.demand(p), m.supply(p)]),
        };
        task.prompt = `Der Händler verlangt ${fmt(market)} Euro und liegt damit über dem Gleichgewichtspreis. Wie groß ist der Überhang bei diesem Preis? Gib auch an, auf welcher Marktseite der Überhang entsteht.`;
        task.hint = "Lies Angebot und Nachfrage in der Zeile des Marktpreises ab und bilde die Differenz.";
        field("Überhang", m.supply(market) - m.demand(market), "Stück");
        task.solution = `Bei ${fmt(market)} Euro werden ${m.supply(market)} Stück angeboten, aber nur ${m.demand(market)} nachgefragt. Es gibt einen Angebotsüberhang von ${m.supply(market) - m.demand(market)} Stück; der Preis gerät unter Druck nach unten.`;
      } else {
        const offset = rng.int(1, 2);
        const market = m.price - offset;
        task.prompt = `Auf einem Markt gilt für die Nachfrage q = ${m.demandBase} − ${m.k}·p und für das Angebot q = ${m.supplyBase} + ${m.k}·p (p in Euro, q in Stück). Eine Behörde setzt den Höchstpreis ${fmt(market)} Euro fest. Wie groß ist der Überhang? Benenne ihn auch.`;
        task.hint = "Setze den Preis in beide Gleichungen ein und bilde die Differenz.";
        field("Überhang", m.demand(market) - m.supply(market), "Stück");
        task.solution = `Nachfrage: ${m.demandBase} − ${m.k}·${fmt(market)} = ${m.demand(market)} Stück. Angebot: ${m.supplyBase} + ${m.k}·${fmt(market)} = ${m.supply(market)} Stück. Es gibt einen Nachfrageüberhang von ${m.demand(market) - m.supply(market)} Stück: Mehr Käufer als Ware.`;
      }
      break;
    }
    case "verzugszins": {
      const claim = level === 1 ? rng.int(2, 15) * 100 : rng.int(10, 60) * 100;
      const base = [0.5, 1, 1.5, 2, 2.5, 3][rng.int(0, 5)];
      const rate = base + 5;
      const days = level === 1 ? rng.int(2, 6) * 30 : rng.int(1, 4) * 90;
      const interest = (claim * (rate / 100) * days) / 360;
      if (level === 1) {
        task.prompt = `Ein Verbraucher zahlt eine Rechnung über ${fmt(claim)} Euro ${days} Tage zu spät. Bei Verbrauchern beträgt der Verzugszins 5 Prozentpunkte über dem Basiszinssatz; angenommen sei ein Basiszinssatz von ${fmt(base)} Prozent. Bestimme den Verzugszinssatz und die Verzugszinsen (360 Zinstage pro Jahr).`;
        task.hint = "Zinssatz = Basiszinssatz + 5 Prozentpunkte. Zinsen = Forderung · Zinssatz · Tage : 360.";
        field("Verzugszinssatz", rate, "Prozent");
        field("Verzugszinsen", interest, "Euro");
        task.solution = `Zinssatz: ${fmt(base)} + 5 = ${fmt(rate)} %. Zinsen: ${fmt(claim)} · ${fmt(rate)} % · ${days} : 360 = ${fmt(money(interest))} Euro.`;
      } else {
        task.prompt = `Ein Verbraucher schuldet ${fmt(claim)} Euro und kommt ${days} Tage in Zahlungsverzug. Angenommener Basiszinssatz: ${fmt(base)} Prozent; der Verzugszins liegt 5 Prozentpunkte darüber (360 Zinstage pro Jahr). Wie hoch sind die Verzugszinsen und wie viel muss er insgesamt zahlen?`;
        task.hint = "Berechne zuerst die Zinsen mit dem Satz Basiszinssatz + 5 Prozentpunkte und addiere sie dann zur Forderung.";
        field("Verzugszinsen", interest, "Euro");
        field("Gesamtbetrag", claim + interest, "Euro");
        task.solution = `Zinsen: ${fmt(claim)} · ${fmt(rate)} % · ${days} : 360 = ${fmt(money(interest))} Euro. Gesamt: ${fmt(claim)} + ${fmt(money(interest))} = ${fmt(money(claim + interest))} Euro.`;
      }
      break;
    }
  }
  return task;
}
