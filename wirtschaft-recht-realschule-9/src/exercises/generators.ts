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
        task.prompt = `Der Händler verlangt ${fmt(market)} Euro und liegt damit über dem Gleichgewichtspreis. Wie groß ist der Überhang bei diesem Preis? Überlege auch, ob es ein Angebots- oder ein Nachfrageüberhang ist.`;
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
    case "zins": {
      const capital = rng.int(5, 40) * 100;
      const rate = rng.int(1, 8);
      if (level === 1) {
        const years = rng.int(1, 4);
        task.prompt = `Du legst ${fmt(capital)} Euro zu ${rate} Prozent Jahreszins an. Die Zinsen werden ausgezahlt und nicht wieder angelegt. Wie viele Zinsen bekommst du in ${years} ${years === 1 ? "Jahr" : "Jahren"}?`;
        task.hint = "Zinsen = Kapital · Zinssatz · Jahre.";
        field("Zinsen", capital * (rate / 100) * years, "Euro");
        task.solution = `${fmt(capital)} Euro · ${rate} % · ${years} = ${fmt(money(capital * (rate / 100) * years))} Euro.`;
      } else {
        const days = rng.int(2, 11) * 30;
        task.prompt = `Ein Guthaben von ${fmt(capital)} Euro wird ${days} Tage lang mit ${rate} Prozent Jahreszins verzinst. Rechne mit 360 Zinstagen pro Jahr. Wie hoch sind die Zinsen?`;
        task.hint = "Zinsen = Kapital · Zinssatz · Tage : 360.";
        field("Zinsen", (capital * (rate / 100) * days) / 360, "Euro");
        task.solution = `${fmt(capital)} Euro · ${rate} % · ${days} : 360 = ${fmt(money((capital * (rate / 100) * days) / 360))} Euro.`;
      }
      break;
    }
    case "zinseszins": {
      const capital = rng.int(5, 30) * 100;
      const rate = rng.int(2, 6);
      const years = level === 1 ? rng.int(2, 3) : rng.int(3, 5);
      const end = capital * (1 + rate / 100) ** years;
      const simple = capital * (1 + (rate / 100) * years);
      task.prompt = `${fmt(capital)} Euro werden ${years} Jahre lang zu ${rate} Prozent angelegt. Die Zinsen jedes Jahres werden mitverzinst (Zinseszins). ${level === 1 ? "Wie hoch ist das Endkapital?" : "Berechne das Endkapital und vergleiche es mit einer Anlage, bei der die Zinsen jedes Jahr ausgezahlt werden."}`;
      task.hint = "Endkapital = Anfangskapital · (1 + Zinssatz)^Jahre. Bei ausgezahlten Zinsen wächst das Kapital nicht.";
      field("Endkapital", end, "Euro");
      if (level === 2) field("Mehrertrag gegenüber ausgezahlten Zinsen", end - simple, "Euro");
      task.solution = `${fmt(capital)} · ${fmt(1 + rate / 100)}^${years} = ${fmt(money(end))} Euro.${level === 2 ? ` Mit ausgezahlten Zinsen wären es ${fmt(money(simple))} Euro; der Zinseszins bringt ${fmt(money(end - simple))} Euro mehr.` : ""}`;
      break;
    }
    case "ratenkredit": {
      const credit = rng.int(3, 20) * 500;
      const months = rng.int(1, 4) * 12;
      const percent = rng.int(4, 18);
      const cost = money((credit * percent) / 100);
      if (level === 1) {
        const instalment = money((credit + cost) / months);
        task.prompt = `Ein Ratenkredit über ${fmt(credit)} Euro wird in ${months} Monatsraten zu je ${fmt(instalment)} Euro zurückgezahlt. Was zahlst du insgesamt zurück und was kostet dich der Kredit?`;
        task.hint = "Gesamtzahlung = Rate · Monate. Kreditkosten = Gesamtzahlung − Kreditsumme.";
        field("Gesamtzahlung", instalment * months, "Euro");
        field("Kreditkosten", instalment * months - credit, "Euro");
        task.solution = `${fmt(instalment)} Euro · ${months} = ${fmt(money(instalment * months))} Euro zurückgezahlt. Davon sind ${fmt(credit)} Euro das geliehene Geld; der Rest, ${fmt(money(instalment * months - credit))} Euro, sind die Kreditkosten.`;
      } else {
        const instalment = money((credit + cost) / months);
        const total = money(instalment * months);
        task.prompt = `Ein Händler bietet ein Sofa für ${fmt(credit)} Euro auf Raten an: ${months} Monatsraten zu je ${fmt(instalment)} Euro. Wie viel Prozent des Kaufpreises kostet dich die Ratenzahlung zusätzlich?`;
        task.hint = "Zusatzkosten = Raten insgesamt − Kaufpreis. Dann durch den Kaufpreis teilen.";
        field("Zusatzkosten", total - credit, "Euro");
        field("Zusatzkosten in Prozent des Kaufpreises", ((total - credit) / credit) * 100, "Prozent");
        task.solution = `${months} · ${fmt(instalment)} = ${fmt(total)} Euro. Zusatzkosten: ${fmt(total)} − ${fmt(credit)} = ${fmt(money(total - credit))} Euro, das sind ${fmt(money(((total - credit) / credit) * 100))} Prozent des Kaufpreises.`;
      }
      break;
    }
    case "sozialabgaben": {
      const gross = rng.int(20, 40) * 100;
      const parts: Array<[string, number]> = [
        ["Rentenversicherung", 9.3],
        ["Arbeitslosenversicherung", 1.3],
        ["Krankenversicherung", 8.75],
        ["Pflegeversicherung", 1.8],
      ];
      const percent = parts.reduce((sum, [, share]) => sum + share, 0);
      const share = money((gross * percent) / 100);
      const list = parts.map(([name, value]) => `${name} ${fmt(value)} %`).join(", ");
      if (level === 1) {
        task.prompt = `Ein Angestellter verdient ${fmt(gross)} Euro brutto im Monat. Seine Beiträge zu den Sozialversicherungen (Lernwerte, gerundet): ${list}. Wie hoch sind seine Beiträge insgesamt und was bleibt nach Sozialabgaben, aber vor Steuern?`;
        task.hint = "Addiere zuerst die Prozentsätze und berechne dann den Anteil vom Bruttolohn.";
        field("Beiträge des Arbeitnehmers", share, "Euro");
        field("Auszahlung vor Steuern", gross - share, "Euro");
        task.solution = `${fmt(percent)} % von ${fmt(gross)} Euro = ${fmt(share)} Euro. Es bleiben ${fmt(money(gross - share))} Euro vor Steuern.`;
      } else {
        task.prompt = `Bei ${fmt(gross)} Euro Bruttolohn zahlt der Arbeitnehmer diese Beiträge (Lernwerte, gerundet): ${list}. Nimm an, der Arbeitgeber trägt jeweils genauso viel (Beitragsteilung, Unfallversicherung bleibt außen vor). Wie hoch ist der Arbeitgeberanteil und was kostet die Stelle den Arbeitgeber insgesamt?`;
        task.hint = "Der Arbeitgeberanteil ist so groß wie der Arbeitnehmeranteil. Die Gesamtkosten sind Bruttolohn plus Arbeitgeberanteil.";
        field("Arbeitgeberanteil", share, "Euro");
        field("Gesamtkosten für den Arbeitgeber", gross + share, "Euro");
        task.solution = `Arbeitgeberanteil: ${fmt(percent)} % von ${fmt(gross)} Euro = ${fmt(share)} Euro. Die Stelle kostet ${fmt(gross)} + ${fmt(share)} = ${fmt(money(gross + share))} Euro im Monat.`;
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
