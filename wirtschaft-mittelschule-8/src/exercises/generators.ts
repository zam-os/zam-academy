import type { Exercise, Level, PracticeKind } from "../model/types";
import {
  careerProfileMatch,
  checkInternship,
  circularFlow,
  fmt,
  fmtInt,
  MINIMUM_WAGE,
  money,
  netPay,
  projectCost,
  projectSchedule,
  trainingMinimum,
  wageForms,
  weightedScore,
} from "../wib";
import type { Rng } from "./rng";

const pick = <T,>(rng: Rng, items: readonly T[]): T => items[rng.int(0, items.length - 1)];
const hourText = (h: number): string => (Number.isInteger(h) ? `${h}` : `${Math.floor(h)}:30`);
const weeksText = (n: number): string => `${n} ${n === 1 ? "Woche" : "Wochen"}`;

/**
 * Level 1 is guided (values and a hint for one step); level 2 is a transfer task in the style
 * of the Abschlussprüfung with an extra step. Every answer is rounded to cents or is an integer.
 */
export function makeExercise(kind: PracticeKind, rng: Rng, level: Level): Exercise {
  switch (kind) {
    case "projectCost": {
      const qty = pick(rng, [20, 25, 30, 40, 50, 60]);
      const material = pick(rng, [0.8, 1.2, 1.5, 1.8, 2.4]);
      const fixed = pick(rng, [18, 24, 30, 36, 45]);
      const price = money(material + pick(rng, [1.5, 2, 2.5, 3]));
      const r = projectCost(qty, material, fixed, price);
      if (level === 1)
        return {
          prompt: `Für ein Werkstattprojekt fertigt deine Klasse ${qty} Schlüsselbretter. Das Material kostet ${fmt(material)} € je Stück, dazu kommen ${fmt(fixed)} € feste Kosten für Schleifpapier und Leim. Berechne die Gesamtkosten und die Kosten je Stück.`,
          hint: "Gesamtkosten = Stückzahl · Material je Stück + feste Kosten. Kosten je Stück = Gesamtkosten : Stückzahl.",
          fields: [
            { label: "Gesamtkosten", answer: r.totalCost, unit: "€" },
            { label: "Kosten je Stück", answer: r.costPerPiece, unit: "€" },
          ],
          solution: `Gesamtkosten = ${qty} · ${fmt(material)} € + ${fmt(fixed)} € = ${fmt(r.totalCost)} € · Kosten je Stück = ${fmt(r.totalCost)} € : ${qty} = ${fmt(r.costPerPiece)} €.`,
        };
      const sold = qty - pick(rng, [2, 4, 5, 8]);
      const revenue = money(sold * price);
      const result = money(revenue - r.totalCost);
      return {
        prompt: `Eine Projektgruppe stellt ${qty} Schlüsselbretter her (Material ${fmt(material)} € je Stück, feste Kosten ${fmt(fixed)} €) und verkauft am Basar ${sold} Stück zu je ${fmt(price)} €. Die übrigen Bretter werden verschenkt. Berechne die Einnahmen und das Projektergebnis.`,
        hint: "Alle hergestellten Bretter verursachen Kosten, Einnahmen gibt es nur für die verkauften. Ergebnis = Einnahmen − Gesamtkosten.",
        fields: [
          { label: "Einnahmen", answer: revenue, unit: "€" },
          { label: "Projektergebnis", answer: result, unit: "€" },
        ],
        solution: `Gesamtkosten = ${qty} · ${fmt(material)} € + ${fmt(fixed)} € = ${fmt(r.totalCost)} € · Einnahmen = ${sold} · ${fmt(price)} € = ${fmt(revenue)} € · Ergebnis = ${fmt(revenue)} € − ${fmt(r.totalCost)} € = ${fmt(result)} €.`,
      };
    }

    case "projectSchedule": {
      const plan = rng.int(4, 8);
      const exec = rng.int(10, 18);
      const close = rng.int(2, 5);
      const buffer = pick(rng, [10, 20, 25, 30]);
      const perWeek = pick(rng, [2, 3, 4]);
      const r = projectSchedule(plan, exec, close, buffer, perWeek, 99);
      if (level === 1)
        return {
          prompt: `Ein Projekt besteht aus Planung (${plan} Std.), Durchführung (${exec} Std.) sowie Präsentation und Reflexion (${close} Std.). Das Team plant ${buffer} % Zeitpuffer ein. Berechne die Pufferzeit und die Gesamtzeit in Stunden.`,
          hint: "Arbeitszeit = Summe der Arbeitspakete. Puffer = Arbeitszeit · Prozentsatz : 100. Gesamtzeit = Arbeitszeit + Puffer.",
          fields: [
            { label: "Pufferzeit", answer: r.bufferHours, unit: "Std." },
            { label: "Gesamtzeit", answer: r.totalHours, unit: "Std." },
          ],
          solution: `Arbeitszeit = ${plan} + ${exec} + ${close} = ${r.workHours} Std. · Puffer = ${r.workHours} · ${buffer} % = ${fmt(r.bufferHours)} Std. · Gesamtzeit = ${fmt(r.totalHours)} Std.`,
        };
      const weeks = r.weeksNeeded + pick(rng, [0, 1, 2]);
      return {
        prompt: `Die Arbeitspakete eines Projekts umfassen ${plan} Std. Planung, ${exec} Std. Durchführung und ${close} Std. Abschluss; dazu kommen ${buffer} % Zeitpuffer. Pro Woche stehen ${perWeek} Projektstunden zur Verfügung, die Präsentation ist in ${weeks} Wochen. Wie viele Wochen braucht das Team (aufgerundet), und wie viele Wochen Reserve bleiben?`,
        hint: "Rechne zuerst die Gesamtzeit mit Puffer aus, teile durch die Projektstunden pro Woche und runde auf ganze Wochen auf.",
        fields: [
          { label: "Benötigte Wochen", answer: r.weeksNeeded, unit: "Wochen" },
          { label: "Reserve", answer: weeks - r.weeksNeeded, unit: "Wochen" },
        ],
        solution: `Gesamtzeit = (${plan} + ${exec} + ${close}) Std. · ${fmt(1 + buffer / 100)} = ${fmt(r.totalHours)} Std. · ${fmt(r.totalHours)} : ${perWeek} = ${fmt(r.totalHours / perWeek)}, aufgerundet ${weeksText(r.weeksNeeded)} · Reserve = ${weeks} − ${r.weeksNeeded} = ${weeksText(weeks - r.weeksNeeded)}.`,
      };
    }

    case "applicationTimeline": {
      const deadline = rng.int(8, 16);
      const cv = rng.int(1, 2);
      const letter = rng.int(1, 2);
      const check = 1;
      const need = cv + letter + check;
      if (level === 1)
        return {
          prompt: `Der Bewerbungsschluss für einen Praktikumsplatz ist in ${deadline} Wochen. Für den Lebenslauf planst du ${cv} Woche(n), für das Anschreiben ${letter} Woche(n) und für das Korrekturlesen durch deine Lehrkraft 1 Woche ein. Wie viele Wochen brauchst du insgesamt, und in spätestens wie vielen Wochen musst du anfangen?`,
          hint: "Bearbeitungszeit = Summe aller Schritte. Spätester Start = Wochen bis zur Frist − Bearbeitungszeit.",
          fields: [
            { label: "Bearbeitungszeit", answer: need, unit: "Wochen" },
            { label: "Spätester Start in", answer: deadline - need, unit: "Wochen" },
          ],
          solution: `Bearbeitungszeit = ${cv} + ${letter} + 1 = ${need} Wochen · Spätester Start = ${deadline} − ${need} = ${deadline - need} Wochen.`,
        };
      const days = need * 7;
      const reserveDays = pick(rng, [7, 14]);
      const startDays = deadline * 7 - days - reserveDays;
      return {
        prompt: `Bis zum Bewerbungsschluss für einen Ausbildungsplatz sind es noch ${deadline} Wochen. Lebenslauf (${cv} Woche(n)), Anschreiben (${letter} Woche(n)) und Korrektur (1 Woche) sollen erledigt sein, und du willst zusätzlich ${reserveDays} Tage Reserve für Zeugniskopien und Post einplanen. Wie viele Tage dauert die Bearbeitung ohne Reserve, und in spätestens wie vielen Tagen musst du beginnen?`,
        hint: "Rechne Wochen in Tage um (1 Woche = 7 Tage) und ziehe Bearbeitungszeit und Reserve von der Zeit bis zur Frist ab.",
        fields: [
          { label: "Bearbeitung", answer: days, unit: "Tage" },
          { label: "Spätester Start in", answer: startDays, unit: "Tage" },
        ],
        solution: `Bearbeitung = (${cv} + ${letter} + 1) · 7 = ${days} Tage · Frist = ${deadline} · 7 = ${deadline * 7} Tage · Spätester Start = ${deadline * 7} − ${days} − ${reserveDays} = ${startDays} Tage.`,
      };
    }

    case "trainingPay": {
      const first = pick(rng, [650, 680, 700, 720, 750, 780, 800, 850]);
      const y2 = trainingMinimum(first, 2);
      const y3 = trainingMinimum(first, 3);
      if (level === 1)
        return {
          prompt: `Angenommen, die Mindestvergütung für Auszubildende beträgt im 1. Ausbildungsjahr ${fmtInt(first)} € im Monat. Nach § 17 BBiG liegt sie im 2. Jahr 18 % und im 3. Jahr 35 % höher, gerundet auf volle Euro. Berechne die Mindestvergütung im 2. und im 3. Jahr.`,
          hint: "2. Jahr = 1. Jahr · 1,18; 3. Jahr = 1. Jahr · 1,35. Runde auf volle Euro (ab 0,50 € aufrunden).",
          fields: [
            { label: "Mindestvergütung 2. Jahr", answer: y2, unit: "€" },
            { label: "Mindestvergütung 3. Jahr", answer: y3, unit: "€" },
          ],
          solution: `2. Jahr = ${fmtInt(first)} € · 1,18 = ${fmt(first * 1.18)} € ≈ ${fmtInt(y2)} € · 3. Jahr = ${fmtInt(first)} € · 1,35 = ${fmt(first * 1.35)} € ≈ ${fmtInt(y3)} €.`,
        };
      const offer = first + pick(rng, [120, 180, 250, 300]);
      const total = (first + y2 + y3) * 12;
      const offerTotal = money((offer + money(offer * 1.1) + money(offer * 1.2)) * 12);
      return {
        prompt: `Ein Betrieb zahlt laut Anzeige ${fmtInt(offer)} € im 1. Jahr und erhöht jedes Jahr um 10 % auf den Betrag des 1. Jahres (2. Jahr + 10 %, 3. Jahr + 20 %). Die angenommene Mindestvergütung beträgt ${fmtInt(first)} € im 1. Jahr mit den Aufschlägen nach § 17 BBiG (18 % und 35 %, gerundet auf volle Euro). Berechne die gesamte Vergütung über drei Jahre (je 12 Monate) beim Betrieb und den Mehrbetrag gegenüber der Mindestvergütung.`,
        hint: "Rechne je Jahr den Monatsbetrag aus, addiere die drei Beträge und multipliziere mit 12. Vergleiche dann mit der Summe der Mindestvergütung.",
        fields: [
          { label: "Vergütung beim Betrieb (3 Jahre)", answer: offerTotal, unit: "€" },
          { label: "Mehrbetrag", answer: money(offerTotal - total), unit: "€" },
        ],
        solution: `Betrieb: (${fmt(offer)} + ${fmt(money(offer * 1.1))} + ${fmt(money(offer * 1.2))}) € · 12 = ${fmt(offerTotal)} € · Mindestvergütung: (${fmtInt(first)} + ${fmtInt(y2)} + ${fmtInt(y3)}) € · 12 = ${fmt(total)} € · Mehrbetrag = ${fmt(money(offerTotal - total))} €.`,
      };
    }

    case "profileMatch": {
      const p = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
      const matches = careerProfileMatch(p[0], p[1], p[2], p[3]);
      const kfz = matches.find((m) => m.name.startsWith("Kfz")) ?? matches[0];
      if (level === 1)
        return {
          prompt: `Dein Kompetenzprofil (1 bis 6 Punkte): Technik ${p[0]}, Kommunikation ${p[1]}, Sorgfalt ${p[2]}, Rechnen ${p[3]}. Das Anforderungsprofil Kfz-Mechatroniker/in lautet 6, 3, 5, 4. Berechne den Abstand (Summe der Punktabweichungen) und die Passung in Prozent (100 % − Abstand : 20 · 100 %).`,
          hint: "Bilde für jeden Bereich die Differenz ohne Vorzeichen und addiere. Jeder Punkt Abstand kostet 5 % Passung.",
          fields: [
            { label: "Abstand", answer: kfz.distance, unit: "Punkte" },
            { label: "Passung", answer: kfz.fitPct, unit: "%" },
          ],
          solution: `Abstand = |${p[0]} − 6| + |${p[1]} − 3| + |${p[2]} − 5| + |${p[3]} − 4| = ${kfz.distance} Punkte · Passung = 100 % − ${kfz.distance} · 5 % = ${fmt(kfz.fitPct)} %.`,
        };
      const best = matches[0];
      const second = matches[1];
      return {
        prompt: `Vergleiche dein Profil (Technik ${p[0]}, Kommunikation ${p[1]}, Sorgfalt ${p[2]}, Rechnen ${p[3]}) mit drei Anforderungsprofilen: Kfz-Mechatroniker/in (6, 3, 5, 4), Kaufmann/-frau im Einzelhandel (2, 6, 4, 4) und Zahnmedizinische/r Fachangestellte/r (3, 5, 6, 3). Wie hoch ist die beste Passung, und um wie viele Prozentpunkte liegt sie vor der zweitbesten?`,
        hint: "Berechne für alle drei Berufe den Abstand und die Passung (100 % − Abstand · 5 %). Vergleiche dann die beiden höchsten Werte.",
        fields: [
          { label: "Beste Passung", answer: best.fitPct, unit: "%" },
          { label: "Vorsprung", answer: money(best.fitPct - second.fitPct), unit: "Prozentpunkte" },
        ],
        solution: `${matches.map((m) => `${m.name}: Abstand ${m.distance}, Passung ${fmt(m.fitPct)} %`).join(" · ")} · Vorsprung = ${fmt(best.fitPct)} − ${fmt(second.fitPct)} = ${fmt(money(best.fitPct - second.fitPct))} Prozentpunkte.`,
      };
    }

    case "procurementCompare": {
      const listA = pick(rng, [18, 20, 21, 22, 24]);
      const rebate = pick(rng, [5, 10, 15]);
      const freight = pick(rng, [1.5, 2, 2.5, 3]);
      const priceA = money(listA - listA * (rebate / 100) + freight);
      if (level === 1)
        return {
          prompt: `Ein Lieferant bietet einen Sack Mehl für ${fmt(listA)} € an, gewährt ${rebate} % Rabatt und berechnet ${fmt(freight)} € Lieferkosten je Sack. Berechne den Rabatt in Euro und den Bezugspreis je Sack.`,
          hint: "Rabatt = Listenpreis · Prozentsatz : 100. Bezugspreis = Listenpreis − Rabatt + Lieferkosten.",
          fields: [
            { label: "Rabatt", answer: money(listA * (rebate / 100)), unit: "€" },
            { label: "Bezugspreis", answer: priceA, unit: "€" },
          ],
          solution: `Rabatt = ${fmt(listA)} € · ${rebate} % = ${fmt(money(listA * (rebate / 100)))} € · Bezugspreis = ${fmt(listA)} € − ${fmt(money(listA * (rebate / 100)))} € + ${fmt(freight)} € = ${fmt(priceA)} €.`,
        };
      const listB = money(listA - pick(rng, [0.5, 1, 1.5, 2]));
      const sacks = pick(rng, [20, 30, 40, 50]);
      const cheaper = Math.min(priceA, listB);
      return {
        prompt: `Eine Bäckerei braucht ${sacks} Sack Mehl. Mühle A: Listenpreis ${fmt(listA)} € je Sack, ${rebate} % Rabatt, ${fmt(freight)} € Lieferkosten je Sack. Mühle B: ${fmt(listB)} € je Sack ohne Rabatt, Lieferung frei Haus. Berechne den günstigeren Bezugspreis je Sack und den Preisunterschied für die ganze Bestellung.`,
        hint: "Berechne für beide Mühlen den Bezugspreis je Sack, wähle den kleineren und multipliziere die Differenz mit der Zahl der Säcke.",
        fields: [
          { label: "Günstigerer Bezugspreis je Sack", answer: cheaper, unit: "€" },
          { label: "Unterschied für die Bestellung", answer: money(Math.abs(priceA - listB) * sacks), unit: "€" },
        ],
        solution: `Mühle A: ${fmt(listA)} € − ${rebate} % + ${fmt(freight)} € = ${fmt(priceA)} € · Mühle B: ${fmt(listB)} € · günstiger: ${fmt(cheaper)} € · Unterschied = ${fmt(money(Math.abs(priceA - listB)))} € · ${sacks} = ${fmt(money(Math.abs(priceA - listB) * sacks))} €.`,
      };
    }

    case "ecoSaving": {
      const lamps = pick(rng, [20, 30, 40, 50]);
      const oldW = pick(rng, [36, 58]);
      const newW = oldW === 58 ? pick(rng, [22, 24, 28]) : pick(rng, [14, 16, 18]);
      const hours = pick(rng, [2000, 2500, 3000]);
      const ct = pick(rng, [24, 28, 30, 32]);
      const kwh = money(((oldW - newW) * lamps * hours) / 1000);
      const euro = money((kwh * ct) / 100);
      if (level === 1)
        return {
          prompt: `Ein Betrieb ersetzt ${lamps} Leuchtröhren mit je ${oldW} W durch LED-Leuchten mit je ${newW} W. Sie brennen ${fmtInt(hours)} Stunden im Jahr, Strom kostet ${ct} ct je kWh. Berechne die eingesparte Energie in kWh und die Ersparnis in Euro pro Jahr.`,
          hint: "Ersparnis in kWh = (alte Leistung − neue Leistung) · Anzahl · Stunden : 1.000. Euro = kWh · Preis in ct : 100.",
          fields: [
            { label: "Eingesparte Energie", answer: kwh, unit: "kWh" },
            { label: "Ersparnis", answer: euro, unit: "€" },
          ],
          solution: `(${oldW} W − ${newW} W) · ${lamps} · ${fmtInt(hours)} h : 1.000 = ${fmt(kwh)} kWh · ${fmt(kwh)} kWh · ${ct} ct = ${fmt(euro)} €.`,
        };
      const cost = pick(rng, [600, 800, 1000, 1200]);
      const years = money(cost / euro);
      const pct = money(((oldW - newW) / oldW) * 100);
      return {
        prompt: `Die Umstellung von ${lamps} Leuchten (${oldW} W) auf LED (${newW} W) kostet ${fmtInt(cost)} €. Bei ${fmtInt(hours)} Betriebsstunden und ${ct} ct je kWh: Um wie viel Prozent sinkt der Stromverbrauch der Beleuchtung, und nach wie vielen Jahren hat sich die Umstellung bezahlt gemacht?`,
        hint: "Prozent = (alt − neu) : alt · 100. Ersparnis pro Jahr in Euro wie gewohnt berechnen; Jahre = Kosten : Ersparnis pro Jahr.",
        fields: [
          { label: "Einsparung", answer: pct, unit: "%" },
          { label: "Amortisation", answer: years, unit: "Jahre" },
        ],
        solution: `Einsparung = (${oldW} − ${newW}) : ${oldW} · 100 = ${fmt(pct)} % · Ersparnis = ${fmt(kwh)} kWh · ${ct} ct = ${fmt(euro)} € pro Jahr · ${fmtInt(cost)} € : ${fmt(euro)} € = ${fmt(years)} Jahre.`,
      };
    }

    case "priceCalc": {
      const cost = pick(rng, [0.4, 0.5, 0.6, 0.8, 1.2, 1.5]);
      const markup = pick(rng, [50, 80, 100, 120, 150]);
      const price = money(cost * (1 + markup / 100));
      if (level === 1)
        return {
          prompt: `Beim Schulfest kostet eine Waffel deine Klasse ${fmt(cost)} € an Zutaten. Ihr rechnet einen Zuschlag von ${markup} % für weitere Kosten und Gewinn. Berechne den Zuschlag in Euro und den Verkaufspreis.`,
          hint: "Zuschlag = Kosten · Prozentsatz : 100. Verkaufspreis = Kosten + Zuschlag.",
          fields: [
            { label: "Zuschlag", answer: money(price - cost), unit: "€" },
            { label: "Verkaufspreis", answer: price, unit: "€" },
          ],
          solution: `Zuschlag = ${fmt(cost)} € · ${markup} % = ${fmt(money(price - cost))} € · Verkaufspreis = ${fmt(cost)} € + ${fmt(money(price - cost))} € = ${fmt(price)} €.`,
        };
      const market = money(cost + pick(rng, [0.3, 0.5, 0.7, 0.9, 1.1]));
      const pct = money(((market - cost) / cost) * 100);
      const qty = pick(rng, [60, 80, 100, 120]);
      return {
        prompt: `Die Konkurrenz am Markt verlangt ${fmt(market)} € je Stück. Deine Klasse hat Kosten von ${fmt(cost)} € je Stück und will genau diesen Marktpreis verlangen. Welchem Zuschlag in Prozent entspricht das (auf zwei Dezimalstellen), und welchen Überschuss bringen ${qty} verkaufte Stück?`,
        hint: "Zuschlag in % = (Verkaufspreis − Kosten) : Kosten · 100. Überschuss = Stückzahl · (Verkaufspreis − Kosten).",
        fields: [
          { label: "Zuschlag", answer: pct, unit: "%" },
          { label: "Überschuss", answer: money(qty * (market - cost)), unit: "€" },
        ],
        solution: `Zuschlag = (${fmt(market)} − ${fmt(cost)}) : ${fmt(cost)} · 100 = ${fmt(pct)} % · Überschuss = ${qty} · ${fmt(money(market - cost))} € = ${fmt(money(qty * (market - cost)))} €.`,
      };
    }

    case "guvCalc": {
      const sold = pick(rng, [80, 90, 100, 120, 140]);
      const price = pick(rng, [1.5, 2, 2.5, 3]);
      const unit = pick(rng, [0.6, 0.8, 1, 1.2]);
      const rent = pick(rng, [20, 30, 40, 50]);
      const ad = pick(rng, [10, 15, 20, 25]);
      const revenue = money(sold * price);
      const goods = money(sold * unit);
      const expenses = money(goods + rent + ad);
      const result = money(revenue - expenses);
      if (level === 1)
        return {
          prompt: `Ein Marktstand verkauft ${sold} Becher Punsch zu je ${fmt(price)} €. Wareneinsatz ${fmt(unit)} € je Becher, Standmiete ${fmt(rent)} €, Werbung ${fmt(ad)} €. Berechne die Summe der Aufwendungen und das Ergebnis der Gewinn- und Verlustrechnung.`,
          hint: "Aufwendungen = Wareneinsatz (Becher · Kosten je Becher) + Standmiete + Werbung. Ergebnis = Erträge − Aufwendungen.",
          fields: [
            { label: "Aufwendungen", answer: expenses, unit: "€" },
            { label: "Ergebnis", answer: result, unit: "€" },
          ],
          solution: `Erträge = ${sold} · ${fmt(price)} € = ${fmt(revenue)} € · Aufwendungen = ${fmt(goods)} € + ${fmt(rent)} € + ${fmt(ad)} € = ${fmt(expenses)} € · Ergebnis = ${fmt(result)} €.`,
        };
      const target = pick(rng, [50, 80, 100]);
      // Level 2 uses a realistic margin so the required number of cups stays plausible.
      const price2 = money(unit + pick(rng, [0.8, 1, 1.2, 1.5]));
      const contribution = money(price2 - unit);
      const needed = Math.ceil(money((rent + ad + target) / contribution));
      return {
        prompt: `Für den nächsten Markttag plant die Klasse wieder ${fmt(rent)} € Standmiete und ${fmt(ad)} € Werbung ein. Ein Becher bringt ${fmt(price2)} € und kostet ${fmt(unit)} € Wareneinsatz. Wie viel bleibt je Becher nach dem Wareneinsatz übrig, und wie viele Becher müssen mindestens verkauft werden, damit ein Gewinn von mindestens ${target} € entsteht?`,
        hint: "Überschuss je Becher = Preis − Wareneinsatz. Benötigte Becher = (Standmiete + Werbung + Zielgewinn) : Überschuss je Becher, aufrunden.",
        fields: [
          { label: "Überschuss je Becher", answer: contribution, unit: "€" },
          { label: "Mindestabsatz", answer: needed, unit: "Stück" },
        ],
        solution: `Überschuss je Becher = ${fmt(price2)} € − ${fmt(unit)} € = ${fmt(contribution)} € · (${fmt(rent)} € + ${fmt(ad)} € + ${target} €) : ${fmt(contribution)} € = ${fmt((rent + ad + target) / contribution)}, aufgerundet ${needed} Stück.`,
      };
    }

    case "circularFlowCalc": {
      const workers = pick(rng, [20, 30, 40, 50, 60]);
      const wage = pick(rng, [1800, 2000, 2250, 2400, 2600]);
      const savings = pick(rng, [5, 10, 12, 15, 20]);
      const r = circularFlow(workers, wage, savings);
      if (level === 1)
        return {
          prompt: `Im einfachen Wirtschaftskreislauf zahlen Unternehmen ${workers} Beschäftigten je ${fmtInt(wage)} € Einkommen im Monat. Die Haushalte sparen ${savings} % davon. Berechne das gesamte Einkommen und die Konsumausgaben.`,
          hint: "Einkommen = Beschäftigte · Monatseinkommen. Konsumausgaben = Einkommen − Ersparnis (Einkommen · Sparquote).",
          fields: [
            { label: "Einkommen", answer: r.income, unit: "€" },
            { label: "Konsumausgaben", answer: r.consumption, unit: "€" },
          ],
          solution: `Einkommen = ${workers} · ${fmtInt(wage)} € = ${fmt(r.income)} € · Ersparnis = ${savings} % = ${fmt(r.saving)} € · Konsum = ${fmt(r.consumption)} €.`,
        };
      const newSavings = savings + pick(rng, [5, 10]);
      const r2 = circularFlow(workers, wage, newSavings);
      const drop = money(r.consumption - r2.consumption);
      const pct = money((drop / r.consumption) * 100);
      return {
        prompt: `In einer Stadt erhalten ${workers} Beschäftigte je ${fmtInt(wage)} € im Monat. Aus Sorge um ihre Arbeitsplätze erhöhen die Haushalte ihre Sparquote von ${savings} % auf ${newSavings} %. Um wie viel Euro sinken die Konsumausgaben, und um wie viel Prozent sinken damit die Einnahmen der Unternehmen aus dem Konsum?`,
        hint: "Berechne die Konsumausgaben vorher und nachher. Prozent = Rückgang : Konsum vorher · 100.",
        fields: [
          { label: "Rückgang der Konsumausgaben", answer: drop, unit: "€" },
          { label: "Rückgang", answer: pct, unit: "%" },
        ],
        solution: `Konsum vorher = ${fmt(r.consumption)} € · nachher = ${fmt(r2.consumption)} € · Rückgang = ${fmt(drop)} € · ${fmt(drop)} : ${fmt(r.consumption)} · 100 = ${fmt(pct)} %.`,
      };
    }

    case "pieceRate": {
      const rate = pick(rng, [15, 16, 18, 20, 24]);
      const normal = pick(rng, [10, 12, 15, 20]);
      const hours = pick(rng, [7, 8]);
      const actual = normal + pick(rng, [1, 2, 3, 4, 5]);
      const r = wageForms(rate, hours, normal, actual);
      const minuteFactor = money(rate / 60);
      if (level === 1)
        return {
          prompt: `Der Akkordrichtsatz beträgt ${fmt(rate)} € je Stunde, die Normalleistung ${normal} Stück je Stunde. Eine Beschäftigte schafft in ${hours} Stunden ${r.pieces} Stück. Berechne ihren Akkordlohn und ihren Zeitlohn für ${hours} Stunden.`,
          hint: "Akkordlohn = Stückzahl · Akkordrichtsatz : Normalleistung. Zeitlohn = Stunden · Stundenlohn.",
          fields: [
            { label: "Akkordlohn", answer: r.pieceWage, unit: "€" },
            { label: "Zeitlohn", answer: r.timeWage, unit: "€" },
          ],
          solution: `Akkordlohn = ${r.pieces} · ${fmt(rate)} € : ${normal} = ${fmt(r.pieceWage)} € · Zeitlohn = ${hours} · ${fmt(rate)} € = ${fmt(r.timeWage)} €.`,
        };
      return {
        prompt: `Im Minutenakkord gilt: Akkordrichtsatz ${fmt(rate)} € je Stunde, Normalleistung ${normal} Stück je Stunde. Ein Monteur stellt in ${hours} Stunden ${r.pieces} Stück her. Berechne seinen Leistungsgrad in Prozent und seinen Verdienst je Stunde im Akkord.`,
        hint: "Leistungsgrad = Ist-Leistung je Stunde : Normalleistung · 100. Akkordlohn = Stück · Vorgabezeit · Minutenfaktor; dann durch die Stunden teilen.",
        fields: [
          { label: "Leistungsgrad", answer: r.performancePct, unit: "%" },
          { label: "Akkordverdienst je Stunde", answer: r.pieceHourly, unit: "€" },
        ],
        solution: `Vorgabezeit = 60 : ${normal} = ${fmt(60 / normal)} Min. · Minutenfaktor = ${fmt(rate)} : 60 ≈ ${fmt(minuteFactor)} € · Leistungsgrad = ${actual} : ${normal} · 100 = ${fmt(r.performancePct)} % · Akkordlohn = ${r.pieces} · ${fmt(rate)} € : ${normal} = ${fmt(r.pieceWage)} € · je Stunde ${fmt(r.pieceWage)} € : ${hours} = ${fmt(r.pieceHourly)} €.`,
      };
    }

    case "minimumWageCheck": {
      const hours = pick(rng, [80, 100, 120, 140, 160]);
      const hourly = money(MINIMUM_WAGE + pick(rng, [-1.2, -0.8, -0.5, 0.4, 0.9, 1.6]));
      const gross = money(hours * hourly);
      const ok = hourly >= MINIMUM_WAGE;
      if (level === 1)
        return {
          prompt: `Eine 30-jährige Aushilfe arbeitet ${hours} Stunden im Monat und erhält ${fmt(gross)} € brutto. Berechne ihren Stundenlohn und den Bruttolohn, der ihr bei ${hours} Stunden mindestens zusteht (Mindestlohn ${fmt(MINIMUM_WAGE)} € je Stunde).`,
          hint: "Stundenlohn = Bruttolohn : Stunden. Mindestbrutto = Stunden · Mindestlohn.",
          fields: [
            { label: "Stundenlohn", answer: hourly, unit: "€" },
            { label: "Mindestbrutto", answer: money(hours * MINIMUM_WAGE), unit: "€" },
          ],
          solution: `Stundenlohn = ${fmt(gross)} € : ${hours} = ${fmt(hourly)} € · Mindestbrutto = ${hours} · ${fmt(MINIMUM_WAGE)} € = ${fmt(money(hours * MINIMUM_WAGE))} € · ${ok ? "Der Mindestlohn ist eingehalten." : "Der Mindestlohn ist unterschritten."}`,
        };
      const tariff = money(MINIMUM_WAGE + pick(rng, [1.5, 2.1, 2.8, 3.4]));
      const diff = money(hours * (tariff - hourly));
      return {
        prompt: `Ein Verkäufer (25 Jahre) arbeitet ${hours} Stunden im Monat für ${fmt(gross)} € brutto. Sein Betrieb ist tarifgebunden, der Tarifvertrag sieht für seine Entgeltgruppe ${fmt(tariff)} € je Stunde vor. Wie viel Euro liegt sein Stundenlohn über oder unter dem Mindestlohn (unter: mit Minuszeichen), und wie viel Euro im Monat fehlen ihm gegenüber dem Tariflohn?`,
        hint: "Stundenlohn = Brutto : Stunden. Abstand zum Mindestlohn = Stundenlohn − 13,90 €. Fehlbetrag = Stunden · (Tariflohn − Stundenlohn).",
        fields: [
          { label: "Abstand zum Mindestlohn je Stunde", answer: money(hourly - MINIMUM_WAGE), unit: "€" },
          { label: "Fehlbetrag zum Tarif", answer: diff, unit: "€" },
        ],
        solution: `Stundenlohn = ${fmt(gross)} € : ${hours} = ${fmt(hourly)} € · Abstand = ${fmt(hourly)} € − ${fmt(MINIMUM_WAGE)} € = ${fmt(money(hourly - MINIMUM_WAGE))} € · Fehlbetrag = ${hours} · (${fmt(tariff)} € − ${fmt(hourly)} €) = ${fmt(diff)} €.`,
      };
    }

    case "netPayCalc": {
      const hours = pick(rng, [140, 150, 160, 168]);
      const hourly = pick(rng, [14, 14.5, 15, 16, 17.5]);
      const tax = pick(rng, [120, 150, 180, 210, 240]);
      const sv = pick(rng, [20, 20.5, 21, 21.5]);
      const church = level === 2;
      const r = netPay(hourly, hours, tax, church, sv);
      if (level === 1)
        return {
          prompt: `Lena arbeitet ${hours} Stunden zu ${fmt(hourly)} €. Laut Lohnsteuertabelle zahlt sie ${fmt(tax)} € Lohnsteuer, sie ist kein Kirchenmitglied, Solidaritätszuschlag fällt nicht an. Ihr Arbeitnehmeranteil zur Sozialversicherung beträgt im Modell ${fmt(sv)} %. Berechne den Bruttolohn und den Nettolohn.`,
          hint: "Brutto = Stunden · Stundenlohn. Sozialversicherung = Brutto · Prozentsatz : 100. Netto = Brutto − Lohnsteuer − Sozialversicherung.",
          fields: [
            { label: "Bruttolohn", answer: r.gross, unit: "€" },
            { label: "Nettolohn", answer: r.net, unit: "€" },
          ],
          solution: `Brutto = ${hours} · ${fmt(hourly)} € = ${fmt(r.gross)} € · Sozialversicherung = ${fmt(sv)} % = ${fmt(r.social)} € · Netto = ${fmt(r.gross)} € − ${fmt(tax)} € − ${fmt(r.social)} € = ${fmt(r.net)} €.`,
        };
      return {
        prompt: `Prüfe Jonas' Abrechnung: ${hours} Stunden zu ${fmt(hourly)} €, Lohnsteuer laut Tabelle ${fmt(tax)} €, er ist Kirchenmitglied (Kirchensteuer 8 % der Lohnsteuer), Solidaritätszuschlag 0,00 €, Arbeitnehmeranteil Sozialversicherung im Modell ${fmt(sv)} %. Berechne die Kirchensteuer und den richtigen Nettolohn.`,
        hint: "Kirchensteuer = Lohnsteuer · 8 %. Netto = Brutto − Lohnsteuer − Kirchensteuer − Sozialversicherung.",
        fields: [
          { label: "Kirchensteuer", answer: r.churchTax, unit: "€" },
          { label: "Nettolohn", answer: r.net, unit: "€" },
        ],
        solution: `Brutto = ${fmt(r.gross)} € · Kirchensteuer = ${fmt(tax)} € · 8 % = ${fmt(r.churchTax)} € · Sozialversicherung = ${fmt(r.social)} € · Netto = ${fmt(r.gross)} € − ${fmt(tax)} € − ${fmt(r.churchTax)} € − ${fmt(r.social)} € = ${fmt(r.net)} €.`,
      };
    }

    case "internshipHours": {
      const start = pick(rng, [7, 7.5, 8, 8.5]);
      const shift = pick(rng, [6, 6.5, 7, 7.5, 8]);
      const end = start + shift;
      const pause = pick(rng, [30, 45, 60]);
      const r = checkInternship(start, end, pause, 5);
      if (level === 1)
        return {
          prompt: `Im Betriebspraktikum beginnst du um ${hourText(start)} Uhr und endest um ${hourText(end)} Uhr, mit insgesamt ${pause} Minuten Pause, an 5 Tagen. Berechne deine tägliche und deine wöchentliche Arbeitszeit in Stunden.`,
          hint: "Arbeitszeit = Ende − Beginn − Pause (Minuten in Stunden umrechnen: 30 Min. = 0,5 Std.). Woche = Tag · 5.",
          fields: [
            { label: "Arbeitszeit am Tag", answer: r.workHours, unit: "Std." },
            { label: "Arbeitszeit in der Woche", answer: r.weeklyHours, unit: "Std." },
          ],
          solution: `${fmt(shift)} Std. − ${fmt(pause / 60)} Std. = ${fmt(r.workHours)} Std. · Woche = ${fmt(r.workHours)} · 5 = ${fmt(r.weeklyHours)} Std. · ${r.allowed ? "Der Plan ist zulässig." : `Nicht zulässig: ${r.violations.join("; ")}.`}`,
        };
      const required = r.requiredBreak;
      const missing = Math.max(0, required - pause);
      const over = money(Math.max(0, r.workHours - 7) * 5);
      return {
        prompt: `Ein Betrieb plant dein Praktikum von ${hourText(start)} bis ${hourText(end)} Uhr mit ${pause} Minuten Pause an 5 Tagen. Wie viele Minuten Pause schreibt § 11 JArbSchG bei dieser Arbeitszeit mindestens vor, wie viele Minuten fehlen, und um wie viele Stunden pro Woche wird die Grenze von 35 Stunden überschritten (0, wenn nicht)?`,
        hint: "Arbeitszeit = Ende − Beginn − Pause. Mehr als 4,5 bis 6 Std.: 30 Min. Pause; mehr als 6 Std.: 60 Min. Überschreitung = (Arbeitszeit − 7) · 5, falls positiv.",
        fields: [
          { label: "Mindestpause", answer: required, unit: "Min." },
          { label: "Fehlende Pause", answer: missing, unit: "Min." },
          { label: "Überschreitung pro Woche", answer: over, unit: "Std." },
        ],
        solution: `Arbeitszeit = ${fmt(shift)} − ${fmt(pause / 60)} = ${fmt(r.workHours)} Std. · Mindestpause ${required} Min. · fehlend ${missing} Min. · Woche ${fmt(r.weeklyHours)} Std., Überschreitung ${fmt(over)} Std.`,
      };
    }

    case "productivity": {
      const people = pick(rng, [2, 3, 4]);
      const hours = pick(rng, [7, 8]);
      const handPerHour = pick(rng, [2, 3, 4, 5]);
      const handQty = people * hours * handPerHour;
      const machinePerHour = handPerHour * pick(rng, [2, 3, 4, 5]);
      const machineQty = hours * machinePerHour;
      const pHand = money(handQty / (people * hours));
      const pMachine = money(machineQty / hours);
      const pct = money(((pMachine - pHand) / pHand) * 100);
      if (level === 1)
        return {
          prompt: `${people} Beschäftigte fertigen in ${hours} Stunden zusammen ${handQty} Teile von Hand. Berechne die Arbeitsstunden insgesamt und die Arbeitsproduktivität (Teile je Arbeitsstunde).`,
          hint: "Arbeitsstunden = Personen · Stunden. Produktivität = Menge : Arbeitsstunden.",
          fields: [
            { label: "Arbeitsstunden", answer: people * hours, unit: "Std." },
            { label: "Produktivität", answer: pHand, unit: "Stück" },
          ],
          solution: `Arbeitsstunden = ${people} · ${hours} = ${people * hours} Std. · Produktivität = ${handQty} : ${people * hours} = ${fmt(pHand)} Teile je Arbeitsstunde.`,
        };
      return {
        prompt: `Früher fertigten ${people} Beschäftigte in ${hours} Stunden ${handQty} Teile von Hand. Heute bedient eine Fachkraft eine CNC-Maschine, die in ${hours} Stunden ${machineQty} Teile herstellt. Berechne die Produktivität mit CNC-Maschine (Teile je Arbeitsstunde) und die Steigerung der Arbeitsproduktivität in Prozent.`,
        hint: "Produktivität = Menge : Arbeitsstunden (Personen · Stunden). Steigerung = (neu − alt) : alt · 100.",
        fields: [
          { label: "Produktivität mit CNC", answer: pMachine, unit: "Stück" },
          { label: "Steigerung", answer: pct, unit: "%" },
        ],
        solution: `Vorher: ${handQty} : (${people} · ${hours}) = ${fmt(pHand)} · Nachher: ${machineQty} : ${hours} = ${fmt(pMachine)} · Steigerung = (${fmt(pMachine)} − ${fmt(pHand)}) : ${fmt(pHand)} · 100 = ${fmt(pct)} %.`,
      };
    }

    case "noiseCheck": {
      const machine = rng.int(86, 102);
      const enclosure = pick(rng, [5, 8, 10, 12]);
      const workplace = machine - enclosure;
      if (level === 1) {
        const att = pick(rng, [15, 20, 25]);
        return {
          prompt: `Eine Maschine erzeugt ${machine} dB(A). Eine Schallschutzhaube senkt den Pegel um ${enclosure} dB, ein Gehörschutz dämpft vereinfacht um weitere ${att} dB. Berechne den Pegel am Arbeitsplatz ohne Gehörschutz und den Pegel am Ohr.`,
          hint: "Vereinfacht ziehst du die Dämmwerte nacheinander ab: Arbeitsplatz = Maschine − Haube; Ohr = Arbeitsplatz − Gehörschutz.",
          fields: [
            { label: "Pegel am Arbeitsplatz", answer: workplace, unit: "dB(A)" },
            { label: "Pegel am Ohr", answer: workplace - att, unit: "dB(A)" },
          ],
          solution: `Arbeitsplatz = ${machine} − ${enclosure} = ${workplace} dB(A) (${workplace >= 85 ? "oberer Auslösewert erreicht: Tragepflicht" : workplace >= 80 ? "unterer Auslösewert erreicht: Gehörschutz bereitstellen" : "unter den Auslösewerten"}) · Ohr = ${workplace} − ${att} = ${workplace - att} dB(A).`,
        };
      }
      const toUpper = Math.max(0, workplace - 84);
      const toLower = Math.max(0, workplace - 79);
      return {
        prompt: `An einer Presse misst die Fachkraft für Arbeitssicherheit ${machine} dB(A). Nach dem Einbau einer Kapselung (minus ${enclosure} dB, vereinfacht) soll geprüft werden: Um wie viele dB müsste der Pegel am Arbeitsplatz mindestens weiter sinken, damit er unter dem oberen Auslösewert von 85 dB(A) liegt, und um wie viele dB, damit er unter dem unteren Auslösewert von 80 dB(A) liegt? (Ganze dB; 0, wenn schon erfüllt.)`,
        hint: "Pegel nach Kapselung = Messwert − Dämmung. Unter 85 heißt höchstens 84 dB(A), unter 80 höchstens 79 dB(A).",
        fields: [
          { label: "Senkung bis unter 85 dB(A)", answer: toUpper, unit: "dB(A)" },
          { label: "Senkung bis unter 80 dB(A)", answer: toLower, unit: "dB(A)" },
        ],
        solution: `Nach Kapselung: ${machine} − ${enclosure} = ${workplace} dB(A) · bis 84 dB(A): ${toUpper} dB · bis 79 dB(A): ${toLower} dB. Nach § 4 ArbSchG zuerst weitere technische Maßnahmen prüfen, erst dann persönlichen Gehörschutz.`,
      };
    }

    case "weightedDecision": {
      const weights = pick(rng, [
        [30, 30, 20, 20],
        [40, 20, 20, 20],
        [25, 25, 25, 25],
        [20, 40, 20, 20],
        [10, 30, 20, 40],
      ]);
      const a = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
      const b = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];
      const sa = weightedScore(a, weights);
      const sb = weightedScore(b, weights);
      const desc = `Kosten ${weights[0]} %, Gesundheit ${weights[1]} %, Qualität ${weights[2]} %, Arbeitsplätze ${weights[3]} %`;
      if (level === 1)
        return {
          prompt: `In einer Nutzwertanalyse gelten die Gewichte ${desc}. Ein Schweißroboter erhält die Punkte ${a.join(", ")} (1 bis 5). Berechne seinen Nutzwert und die Punktzahl, die er im Kriterium Gesundheit gewichtet beiträgt.`,
          hint: "Nutzwert = Summe aus Punkte · Gewicht (als Dezimalzahl, zum Beispiel 30 % = 0,3).",
          fields: [
            { label: "Nutzwert Roboter", answer: sa, unit: "Punkte" },
            { label: "Beitrag Gesundheit", answer: weightedScore([a[1]], [weights[1]]), unit: "Punkte" },
          ],
          solution: `Nutzwert = ${a.map((p, i) => `${p} · ${fmt(weights[i] / 100, 1)}`).join(" + ")} = ${fmt(sa)} Punkte · Gesundheit: ${a[1]} · ${fmt(weights[1] / 100, 1)} = ${fmt(weightedScore([a[1]], [weights[1]]))} Punkte.`,
        };
      return {
        prompt: `Ein Betrieb vergleicht Schweißroboter und Handarbeit mit den Gewichten ${desc}. Punkte (1 bis 5) Roboter: ${a.join(", ")}; Handarbeit: ${b.join(", ")}. Berechne den Nutzwert der Handarbeit und den Unterschied zwischen dem höheren und dem niedrigeren Nutzwert.`,
        hint: "Berechne beide Nutzwerte getrennt; Unterschied = höherer Nutzwert − niedrigerer Nutzwert.",
        fields: [
          { label: "Nutzwert Handarbeit", answer: sb, unit: "Punkte" },
          { label: "Unterschied", answer: money(Math.abs(sa - sb)), unit: "Punkte" },
        ],
        solution: `Roboter: ${fmt(sa)} Punkte · Handarbeit: ${b.map((p, i) => `${p} · ${fmt(weights[i] / 100, 1)}`).join(" + ")} = ${fmt(sb)} Punkte · Unterschied = ${fmt(money(Math.abs(sa - sb)))} Punkte · ${sa === sb ? "Gleichstand: weitere Kriterien klären." : sa > sb ? "Der Roboter liegt vorne." : "Die Handarbeit liegt vorne."}`,
      };
    }
  }
}

