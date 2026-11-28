import type { Exercise, Level, PracticeKind } from "../model/types";
import { euro, fmt, money } from "../format";
import type { Rng } from "./rng";

const pick = <T>(rng: Rng, list: readonly T[]): T => list[rng.int(0, list.length - 1)];
/** Two decimals in a solution text; amounts keep their cents. */
const e = (value: number) => euro(money(value));
const pct = (value: number) => fmt(money(value));

const CRITERIA = ["Preis", "Qualität", "Nachhaltigkeit", "Design", "Haltbarkeit", "Service"] as const;
const PRODUCTS = ["Rucksack", "Fahrradhelm", "Schulranzen", "Sportschuh", "Wasserkocher"] as const;

/** Every task is built from whole numbers, so the expected answers are exact to the cent. */
export function makeExercise(kind: PracticeKind, rng: Rng, level: Level): Exercise {
  const task: Exercise = { prompt: "", hint: "", fields: [], solution: "" };
  const field = (label: string, answer: number, unit: string) => task.fields.push({ label, answer: money(answer), unit });
  switch (kind) {
    case "nutzwert": {
      const product = pick(rng, PRODUCTS);
      const first = rng.int(0, CRITERIA.length - 3);
      const criteria = CRITERIA.slice(first, first + 3);
      if (level === 1) {
        const weights = criteria.map(() => rng.int(1, 5));
        const a = criteria.map(() => rng.int(1, 5));
        const b = criteria.map(() => rng.int(1, 5));
        const sum = (r: number[]) => r.reduce((s, v, i) => s + v * weights[i], 0);
        task.table = { head: ["Kriterium", "Gewicht", "Angebot A", "Angebot B"], rows: criteria.map((c, i) => [c, weights[i], a[i], b[i]]) };
        task.prompt = `Du vergleichst zwei Angebote für einen ${product}. Die Bewertungen reichen von 1 (schwach) bis 5 (stark). Berechne für jedes Angebot die gewichtete Punktsumme der Entscheidungsmatrix.`;
        task.hint = "Multipliziere jede Bewertung mit dem Gewicht ihres Kriteriums und addiere die Produkte eines Angebots.";
        field("Punktsumme Angebot A", sum(a), "Punkte");
        field("Punktsumme Angebot B", sum(b), "Punkte");
        task.solution = `A: ${criteria.map((_, i) => `${weights[i]} · ${a[i]}`).join(" + ")} = ${sum(a)} Punkte. B: ${criteria.map((_, i) => `${weights[i]} · ${b[i]}`).join(" + ")} = ${sum(b)} Punkte. ${sum(a) === sum(b) ? "Gleichstand: Ein weiteres Kriterium muss entscheiden." : `Angebot ${sum(a) > sum(b) ? "A" : "B"} hat den höheren Nutzwert.`}`;
      } else {
        const weights = pick(rng, [[50, 30, 20], [40, 40, 20], [60, 25, 15], [45, 35, 20], [35, 35, 30]] as const);
        let ratings: number[][] = [];
        let scores: number[] = [];
        for (let tries = 0; tries < 50; tries++) {
          ratings = [0, 1, 2].map(() => criteria.map(() => rng.int(1, 5)));
          scores = ratings.map((r) => r.reduce((s, v, i) => s + (v * weights[i]) / 100, 0));
          const sorted = [...scores].sort((x, y) => y - x);
          if (sorted[0] - sorted[1] > 0.04) break;
        }
        const order = scores.map((s, i) => [s, i] as const).sort((x, y) => y[0] - x[0]);
        const names = ["A", "B", "C"];
        task.table = {
          head: ["Kriterium", "Gewicht", "A", "B", "C"],
          rows: criteria.map((c, i) => [c, `${weights[i]} %`, ratings[0][i], ratings[1][i], ratings[2][i]]),
        };
        task.prompt = `Drei Angebote für einen ${product} sind von 1 bis 5 bewertet, die Gewichte sind in Prozent angegeben. Bestimme den Nutzwert des besten Angebots und seinen Vorsprung vor dem zweitbesten.`;
        task.hint = "Nutzwert = Summe aus Gewicht · Bewertung, mit dem Gewicht als Dezimalzahl (50 % = 0,5).";
        field("Nutzwert des besten Angebots", order[0][0], "Punkte");
        field("Vorsprung vor dem zweitbesten", order[0][0] - order[1][0], "Punkte");
        task.solution = `${names.map((n, k) => `${n}: ${criteria.map((_, i) => `${fmt(weights[i] / 100)} · ${ratings[k][i]}`).join(" + ")} = ${pct(scores[k])}`).join(". ")}. Bestes Angebot: ${names[order[0][1]]} mit ${pct(order[0][0])} Punkten, Vorsprung ${pct(order[0][0] - order[1][0])} Punkte.`;
      }
      break;
    }
    case "kaufkraft": {
      if (level === 1) {
        const price = rng.int(8, 30) * 10;
        const rate = pick(rng, [2, 3, 4, 5, 6, 8] as const);
        const next = (price * (100 + rate)) / 100;
        task.prompt = `Ein Warenkorb mit Lebensmitteln kostet heute ${e(price)} €. Die Inflationsrate beträgt ${rate} % im Jahr. Wie viel kostet derselbe Warenkorb in einem Jahr, und um wie viel Euro ist er teurer geworden?`;
        task.hint = `Neuer Preis = alter Preis · (1 + ${rate} : 100).`;
        field("Preis in einem Jahr", next, "€");
        field("Preisanstieg", next - price, "€");
        task.solution = `${e(price)} € · ${fmt(1 + rate / 100)} = ${e(next)} €. Der Warenkorb wird um ${e(next - price)} € teurer. Für dasselbe Geld bekommst du also weniger.`;
      } else {
        const capital = rng.int(5, 30) * 100;
        const zins = pick(rng, [0.5, 1, 1.5, 2, 2.5, 3] as const);
        const infl = pick(rng, [2, 3, 4, 5, 6] as const);
        const balance = (capital * (100 + zins)) / 100;
        const real = balance / (1 + infl / 100);
        task.prompt = `Mia legt ${e(capital)} € für ein Jahr zu ${fmt(zins)} % Zinsen an. Die Inflationsrate liegt im selben Jahr bei ${infl} %. Wie hoch ist ihr Kontostand nach einem Jahr, und was ist er in Preisen von heute wert?`;
        task.hint = `Kontostand = Betrag · (1 + Zinssatz). Kaufkraft in Preisen von heute = Kontostand : (1 + ${infl} : 100).`;
        field("Kontostand nach einem Jahr", balance, "€");
        field("Kaufkraft in Preisen von heute", real, "€");
        task.solution = `Kontostand: ${e(capital)} € · ${fmt(1 + zins / 100)} = ${e(balance)} €. Kaufkraft: ${e(balance)} € : ${fmt(1 + infl / 100)} ≈ ${e(real)} €. ${real < capital ? "Trotz Zinsen hat Mia real an Kaufkraft verloren." : "Mia hat real an Kaufkraft gewonnen."}`;
      }
      break;
    }
    case "haushalt": {
      const tg = rng.int(6, 14) * 5;
      const job = pick(rng, [0, 20, 30, 40, 50, 60] as const);
      const handy = pick(rng, [10, 15, 20] as const);
      const income = tg + job;
      const free = rng.int(2, 6) * 5;
      const clothes = pick(rng, [0, 10, 15, 20] as const);
      const room = income - handy - free - clothes;
      const snacks = Math.max(5, Math.min(room - 5, rng.int(1, 4) * 5));
      const spend = handy + free + clothes + snacks;
      const rest = income - spend;
      if (rest <= 0) return makeExercise(kind, rng, level);
      if (level === 1) {
        task.table = {
          head: ["Posten", "Betrag im Monat (€)"],
          rows: [["Taschengeld", tg], ["Nebenjob", job], ["Handyvertrag", handy], ["Freizeit", free], ["Kleidung", clothes], ["Snacks", snacks]],
        };
        task.prompt = "Der Haushaltsplan zeigt die Einnahmen und Ausgaben eines Monats. Berechne die Summe der Ausgaben und die monatliche Sparrate.";
        task.hint = "Einnahmen sind Taschengeld und Nebenjob. Sparrate = Summe der Einnahmen minus Summe der Ausgaben.";
        field("Summe der Ausgaben", spend, "€");
        field("Sparrate im Monat", rest, "€");
        task.solution = `Einnahmen: ${tg} + ${job} = ${income} €. Ausgaben: ${handy} + ${free} + ${clothes} + ${snacks} = ${spend} €. Sparrate: ${income} − ${spend} = ${rest} €.`;
      } else {
        const months = pick(rng, [6, 8, 10, 12] as const);
        const extra = rng.int(1, 4) * 5;
        const goal = months * (rest + extra);
        const needed = Math.ceil(goal / rest);
        task.prompt = `Jonas nimmt im Monat ${income} € ein und gibt ${spend} € aus. Er spart auf eine Konsole für ${goal} €. Wie viele Monate braucht er bei gleicher Sparrate? Um wie viel Euro muss er seine Ausgaben jeden Monat senken, damit er die Konsole schon in ${months} Monaten kaufen kann?`;
        task.hint = "Sparrate = Einnahmen minus Ausgaben. Für die Monate teilst du den Preis durch die Sparrate und rundest auf. Für das Ziel teilst du den Preis durch die gewünschte Zahl der Monate.";
        field("Monate bei gleicher Sparrate", needed, "Monate");
        field("Nötige Kürzung je Monat", extra, "€");
        task.solution = `Sparrate: ${income} − ${spend} = ${rest} €. ${goal} : ${rest} ≈ ${fmt(Math.round((goal / rest) * 100) / 100)}, aufgerundet ${needed} Monate. Für ${months} Monate braucht er ${goal} : ${months} = ${rest + extra} € im Monat, also ${extra} € weniger Ausgaben.`;
      }
      break;
    }
    case "ratenkauf": {
      const price = rng.int(4, 24) * 50;
      const months = pick(rng, [6, 10, 12, 18, 24] as const);
      const down = pick(rng, [0, 0.1, 0.2] as const) * price;
      const markup = pick(rng, [0.06, 0.08, 0.1, 0.12, 0.15] as const);
      const rate = Math.ceil(((price - down) * (1 + markup)) / months);
      const total = down + months * rate;
      const extra = total - price;
      const item = pick(rng, ["Laptop", "Fernseher", "Tablet", "Smartphone"] as const);
      if (level === 1) {
        task.prompt = `Ein ${item} kostet bar ${e(price)} €. Beim Ratenkauf zahlst du ${down ? `${e(down)} € an und dann ` : ""}${months} Monatsraten zu je ${e(rate)} €. Wie viel zahlst du insgesamt, und wie hoch sind die Mehrkosten gegenüber dem Barkauf?`;
        task.hint = "Gesamtpreis = Anzahlung + Zahl der Raten · Rate. Mehrkosten = Gesamtpreis minus Barpreis.";
        field("Gesamtpreis beim Ratenkauf", total, "€");
        field("Mehrkosten", extra, "€");
        task.solution = `${down ? `${e(down)} + ` : ""}${months} · ${e(rate)} = ${e(total)} €. Mehrkosten: ${e(total)} − ${e(price)} = ${e(extra)} €.`;
      } else {
        task.prompt = `Ein Händler wirbt: „${item} für nur ${e(rate)} € im Monat!“ Im Kleingedruckten steht: ${down ? `Anzahlung ${e(down)} €, ` : ""}${months} Raten. Bar kostet das Gerät ${e(price)} €. Berechne die Mehrkosten in Euro und in Prozent des Barpreises.`;
        task.hint = "Rechne zuerst den Gesamtpreis aus. Mehrkosten in Prozent = Mehrkosten : Barpreis · 100.";
        field("Mehrkosten", extra, "€");
        field("Mehrkosten in Prozent des Barpreises", (extra / price) * 100, "%");
        task.solution = `Gesamtpreis: ${down ? `${e(down)} + ` : ""}${months} · ${e(rate)} = ${e(total)} €. Mehrkosten: ${e(extra)} €. ${e(extra)} : ${e(price)} · 100 ≈ ${pct((extra / price) * 100)} %. Die kleine Monatsrate verdeckt die Gesamtkosten.`;
      }
      break;
    }
    case "produktivitaet": {
      const people = rng.int(2, 4);
      const hours = rng.int(2, 4);
      const before = rng.int(5, 9);
      const after = before + rng.int(2, 5);
      if (level === 1) {
        task.prompt = `In einer Schülerfirma bauen ${people} Personen ${hours} Stunden lang Vogelhäuser. Jede macht zunächst alle Arbeitsschritte: Sie schaffen zusammen ${before * people * hours} Stück. Nach der Arbeitsteilung schaffen sie in derselben Zeit ${after * people * hours} Stück. Berechne die Arbeitsproduktivität vorher und nachher.`;
        task.hint = "Arbeitsproduktivität = hergestellte Menge : Arbeitsstunden. Arbeitsstunden = Personen · Stunden.";
        field("Produktivität vorher", before, "Stück je Arbeitsstunde");
        field("Produktivität nachher", after, "Stück je Arbeitsstunde");
        task.solution = `Arbeitsstunden: ${people} · ${hours} = ${people * hours}. Vorher: ${before * people * hours} : ${people * hours} = ${before} Stück, nachher: ${after * people * hours} : ${people * hours} = ${after} Stück je Arbeitsstunde.`;
      } else {
        const count = rng.int(4, 12) * 10;
        const price = pick(rng, [4, 5, 6, 8, 10] as const);
        const revenue = count * price;
        const cost = Math.round((revenue * pick(rng, [0.6, 0.7, 0.75, 0.8, 0.9] as const)) / 10) * 10;
        task.prompt = `Die Schülerfirma verkauft beim Schulfest ${count} Vogelhäuser zu je ${e(price)} €. Für Holz, Farbe und Standmiete fallen ${e(cost)} € an. Nach der Arbeitsteilung steigt die Produktivität von ${before} auf ${after} Stück je Arbeitsstunde. Berechne die Wirtschaftlichkeit und die Steigerung der Produktivität in Prozent.`;
        task.hint = "Wirtschaftlichkeit = Ertrag : Aufwand (in Euro). Steigerung in Prozent = (neu minus alt) : alt · 100.";
        field("Wirtschaftlichkeit", revenue / cost, "Ertrag je Euro Aufwand");
        field("Steigerung der Produktivität", ((after - before) / before) * 100, "%");
        task.solution = `Ertrag: ${count} · ${e(price)} = ${e(revenue)} €. Wirtschaftlichkeit: ${e(revenue)} : ${e(cost)} ≈ ${pct(revenue / cost)}; ein Wert über 1 heißt, der Ertrag übersteigt den Aufwand. Produktivität: (${after} − ${before}) : ${before} · 100 ≈ ${pct(((after - before) / before) * 100)} %.`;
      }
      break;
    }
    case "marktanteil": {
      if (level === 1) {
        const volume = pick(rng, [200, 400, 600, 800, 1000, 1200, 2000] as const);
        const share = rng.int(4, 30);
        const sales = (volume * share) / 100;
        task.prompt = `Im Jahr werden in Deutschland ${fmt(volume)} Tausend Trinkflaschen einer Sorte verkauft (Marktvolumen). Ein Hersteller verkauft davon ${fmt(sales)} Tausend Stück. Berechne seinen Marktanteil und den Anteil aller anderen Anbieter zusammen.`;
        task.hint = "Marktanteil = eigener Absatz : Marktvolumen · 100.";
        field("Marktanteil des Herstellers", share, "%");
        field("Anteil der anderen Anbieter", 100 - share, "%");
        task.solution = `${fmt(sales)} : ${fmt(volume)} · 100 = ${share} %. Die anderen Anbieter haben zusammen 100 − ${share} = ${100 - share} %.`;
      } else {
        const potential = pick(rng, [800, 1000, 2000, 4000] as const);
        const level2 = rng.int(8, 18) * 5;
        const volume = (potential * level2) / 100;
        const own = rng.int(8, 30);
        let rival = rng.int(8, 30);
        if (rival === own) rival += 3;
        task.prompt = `Für Fahrradhelme schätzt ein Hersteller das Marktpotenzial auf ${fmt(potential)} Tausend Stück im Jahr; tatsächlich verkauft werden ${fmt(volume)} Tausend Stück. Sein eigener Marktanteil beträgt ${own} %, der des größten Konkurrenten ${rival} %. Berechne den Sättigungsgrad des Marktes und den relativen Marktanteil.`;
        task.hint = "Sättigungsgrad = Marktvolumen : Marktpotenzial · 100. Relativer Marktanteil = eigener Marktanteil : Marktanteil des größten Konkurrenten.";
        field("Sättigungsgrad", level2, "%");
        field("Relativer Marktanteil", own / rival, "Verhältnis");
        task.solution = `Sättigungsgrad: ${fmt(volume)} : ${fmt(potential)} · 100 = ${level2} %. Relativer Marktanteil: ${own} : ${rival} ≈ ${pct(own / rival)}. ${own > rival ? "Der Hersteller ist Marktführer." : "Ein Wert unter 1 heißt: Der größte Konkurrent ist stärker."}`;
      }
      break;
    }
    case "kalkulation": {
      const cost = rng.int(4, 24) * 5;
      const markup = pick(rng, [10, 15, 20, 25, 30, 40] as const);
      const net = (cost * (100 + markup)) / 100;
      const gross = money(net * 1.19);
      const item = pick(rng, PRODUCTS);
      if (level === 1) {
        task.prompt = `Ein Händler kalkuliert den Preis für einen ${item}. Die Selbstkosten betragen ${e(cost)} €, er rechnet mit einem Gewinnzuschlag von ${markup} %. Dazu kommen 19 % Umsatzsteuer. Berechne Nettoverkaufspreis und Bruttoverkaufspreis.`;
        task.hint = `Nettoverkaufspreis = Selbstkosten · (1 + ${markup} : 100). Bruttoverkaufspreis = Nettoverkaufspreis · 1,19.`;
        field("Nettoverkaufspreis", net, "€");
        field("Bruttoverkaufspreis", gross, "€");
        task.solution = `Gewinn: ${e(cost)} € · ${markup} % = ${e(net - cost)} €. Netto: ${e(cost)} + ${e(net - cost)} = ${e(net)} €. Brutto: ${e(net)} € · 1,19 ≈ ${e(gross)} €.`;
      } else {
        task.prompt = `Ein Konkurrent verkauft einen ${item} für ${e(gross)} € einschließlich 19 % Umsatzsteuer. Seine Selbstkosten schätzt du auf ${e(cost)} €. Rechne zurück: Wie hoch ist sein Nettoverkaufspreis, und mit welchem Gewinnzuschlag in Prozent kalkuliert er?`;
        task.hint = "Nettoverkaufspreis = Bruttoverkaufspreis : 1,19. Gewinnzuschlag in Prozent = (Netto minus Selbstkosten) : Selbstkosten · 100.";
        field("Nettoverkaufspreis", net, "€");
        field("Gewinnzuschlag", markup, "%");
        task.solution = `Netto: ${e(gross)} € : 1,19 ≈ ${e(net)} €. Gewinn: ${e(net)} − ${e(cost)} = ${e(net - cost)} €. Zuschlag: ${e(net - cost)} : ${e(cost)} · 100 = ${markup} %.`;
      }
      break;
    }
  }
  return task;
}
