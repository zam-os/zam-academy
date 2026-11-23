import type { Exercise, Level, PracticeKind } from "../model/types";
import {
  applianceUsageCost,
  careerProfileMatch,
  fmt,
  fmtInt,
  fourWeekBudget,
  livingStandardSplit,
  money,
  projectBudgetPlan,
  schoolSaleOutcome,
  selfEmployedResult,
  trainingMonthlyBudget,
  unitPrice,
  workplaceScore,
  workTimeHours,
} from "../wib";
import type { Rng } from "./rng";

const pick = <T,>(rng: Rng, items: readonly T[]): T => items[rng.int(0, items.length - 1)];

export function makeExercise(kind: PracticeKind, rng: Rng, level: Level): Exercise {
  switch (kind) {
    case "projectTime": {
      const team = rng.int(4, 7);
      if (level === 1) {
        const minsPerPerson = pick(rng, [120, 150, 180, 210, 240]);
        const planPct = pick(rng, [20, 25, 30, 40]);
        const totalMins = team * minsPerPerson;
        const planMins = Math.round(totalMins * (planPct / 100));
        return {
          prompt: `Für ein Marktprojekt arbeiten ${team} Jugendliche zusammen. Pro Person sind insgesamt ${minsPerPerson} Min. für alle fünf Handlungsphasen eingeplant, davon entfallen ${planPct} % auf Projektinitiative und Projektplanung. Berechne die gesamte Teamzeit und die Planungszeit.`,
          hint: "Gesamte Teamzeit = Teamgröße · Zeit pro Person. Planungszeit = Gesamte Teamzeit · Prozentsatz / 100.",
          fields: [
            { label: "Gesamte Teamzeit", answer: totalMins, unit: "Min." },
            { label: "Zeit für Initiative und Planung", answer: planMins, unit: "Min." },
          ],
          solution: `Teamzeit = ${team} · ${minsPerPerson} Min. = ${fmtInt(totalMins)} Min. · Planungszeit = ${fmtInt(totalMins)} Min. · ${planPct} % = ${fmtInt(planMins)} Min.`,
        };
      }
      const totalHours = team * pick(rng, [4, 5, 6]);
      const fixedMinsPerPerson = pick(rng, [30, 45, 60]);
      const fixedTotalHours = money((team * fixedMinsPerPerson) / 60);
      const execHours = money(totalHours - fixedTotalHours);
      const execPct = money((execHours / totalHours) * 100);
      return {
        prompt: `Ein ${team}-köpfiges Projektteam hat insgesamt ${totalHours} Std. Projektzeit zur Verfügung. Für Präsentation und Reflexion braucht jedes Teammitglied fest ${fixedMinsPerPerson} Min. Wie viele Stunden bleiben für Planung und Durchführung übrig, und wie hoch ist deren Anteil an der Gesamtzeit?`,
        hint: "Rechne zuerst die gesamte feste Zeit für Präsentation und Reflexion in Stunden um und ziehe sie von der Gesamtzeit ab.",
        fields: [
          { label: "Restzeit für Planung & Durchführung", answer: execHours, unit: "Std." },
          { label: "Anteil an der Gesamtzeit", answer: execPct, unit: "%" },
        ],
        solution: `Feste Zeit = (${team} · ${fixedMinsPerPerson} Min.) / 60 = ${fmt(fixedTotalHours)} Std. · Restzeit = ${totalHours} Std. − ${fmt(fixedTotalHours)} Std. = ${fmt(execHours)} Std. · Anteil = (${fmt(execHours)} / ${totalHours}) · 100 = ${fmt(execPct)} %.`,
      };
    }

    case "projectBudget": {
      const fixedCost = pick(rng, [18, 24, 30, 36, 42]);
      const unitCost = pick(rng, [0.8, 1.0, 1.2, 1.5]);
      const margin = pick(rng, [0.6, 0.8, 1.0, 1.2]);
      const sellPrice = money(unitCost + margin);
      if (level === 1) {
        const qty = rng.int(40, 90);
        const res = projectBudgetPlan(4, 3, fixedCost, unitCost, sellPrice, qty);
        return {
          prompt: `Beim Schulmarktprojekt fallen ${fmt(fixedCost)} € feste Stand- und Werbekosten an. Ein Produkt kostet im Einkauf ${fmt(unitCost)} € und wird für ${fmt(sellPrice)} € verkauft. Es werden ${qty} Stück verkauft. Berechne die Gesamteinnahmen und den Projektüberschuss.`,
          hint: "Einnahmen = Stückzahl · Verkaufspreis. Überschuss = Einnahmen − (Fixkosten + Stückzahl · Stückkosten).",
          fields: [
            { label: "Gesamteinnahmen", answer: res.revenue, unit: "€" },
            { label: "Projektüberschuss", answer: res.surplus, unit: "€" },
          ],
          solution: `Einnahmen = ${qty} · ${fmt(sellPrice)} € = ${fmt(res.revenue)} € · Kosten = ${fmt(fixedCost)} € + ${qty} · ${fmt(unitCost)} € = ${fmt(res.totalCost)} € · Überschuss = ${fmt(res.surplus)} €.`,
        };
      }
      const breakEven = Math.ceil(fixedCost / margin);
      const qty = breakEven + rng.int(15, 40);
      const res = projectBudgetPlan(4, 3, fixedCost, unitCost, sellPrice, qty);
      return {
        prompt: `Ein Marktteam kalkuliert mit ${fmt(fixedCost)} € Fixkosten für Material und Plakate, ${fmt(unitCost)} € Einkaufskosten je Stück und einem Verkaufspreis von ${fmt(sellPrice)} €. Ab wie vielen verkauften Stück deckt das Team alle Kosten (ganzzahlig), und welcher Überschuss entsteht bei ${qty} verkauften Stück?`,
        hint: "Ermittle zuerst den Überschuss pro Stück (Verkaufspreis − Stückkosten) und teile die Fixkosten dadurch (aufrunden).",
        fields: [
          { label: "Mindestabsatz für Kostendeckung", answer: breakEven, unit: "Stück" },
          { label: "Überschuss bei Zielabsatz", answer: res.surplus, unit: "€" },
        ],
        solution: `Beitrag pro Stück = ${fmt(sellPrice)} € − ${fmt(unitCost)} € = ${fmt(margin)} € · Mindestabsatz = ${fmt(fixedCost)} € / ${fmt(margin)} € = ${breakEven} Stück · Bei ${qty} Stück: ${fmt(res.revenue)} € − ${fmt(res.totalCost)} € = ${fmt(res.surplus)} €.`,
      };
    }

    case "workplaceScore": {
      const s1 = rng.int(3, 6);
      const s2 = rng.int(2, 6);
      const s3 = rng.int(3, 6);
      const s4 = rng.int(2, 6);
      const scoreA = workplaceScore(s1, s2, s3, s4).total;
      if (level === 1) {
        return {
          prompt: `Bei der Zugangserkundung bewertest du einen Arbeitsplatz auf einer Punkteskala von 1 (sehr schlecht) bis 6 (sehr gut): Licht und Lärmschutz (25 %) erhalten ${s1} Punkte, Ergonomie (30 %) ${s2} Punkte, Arbeitsmittel (25 %) ${s3} Punkte und Pausenregelung (20 %) ${s4} Punkte. Berechne die gewichtete Gesamtpunktzahl.`,
          hint: "Multipliziere jede Punktzahl mit ihrem Prozentgewicht (z. B. · 0,25) und addiere die vier Werte.",
          fields: [{ label: "Gewichtete Gesamtpunktzahl", answer: scoreA, unit: "Punkte" }],
          solution: `Gesamt = ${s1} · 0,25 + ${s2} · 0,30 + ${s3} · 0,25 + ${s4} · 0,20 = ${fmt(scoreA)} Punkte.`,
        };
      }
      const b1 = rng.int(1, 2);
      const b2 = rng.int(1, 2);
      const b3 = rng.int(1, 3);
      const b4 = rng.int(1, 2);
      const scoreB = workplaceScore(b1, b2, b3, b4).total;
      const higher = Math.max(scoreA, scoreB);
      const lower = Math.min(scoreA, scoreB);
      const diff = money(higher - lower);
      return {
        prompt: `Vergleiche zwei erkundete Arbeitsplätze (Gewichte: Licht/Lärm 25 %, Ergonomie 30 %, Arbeitsmittel 25 %, Pausen 20 %): Betrieb A erreicht (${s1} / ${s2} / ${s3} / ${s4}) Punkte, Betrieb B (${b1} / ${b2} / ${b3} / ${b4}) Punkte. Berechne die höhere Gesamtpunktzahl und den Punktevorsprung vor dem anderen Betrieb.`,
        hint: "Berechne zuerst beide gewichteten Summen getrennt und bilde anschließend die Differenz zwischen dem besseren und dem schwächeren Betrieb.",
        fields: [
          { label: "Höhere Gesamtpunktzahl", answer: higher, unit: "Punkte" },
          { label: "Vorsprung", answer: diff, unit: "Punkte" },
        ],
        solution: `Betrieb A = ${fmt(scoreA)} Punkte · Betrieb B = ${fmt(scoreB)} Punkte · Besserer Betrieb = ${fmt(higher)} Punkte · Vorsprung = ${fmt(diff)} Punkte.`,
      };
    }

    case "trainingCompare": {
      const y1 = pick(rng, [750, 820, 880, 940, 1000]);
      const y2 = y1 + pick(rng, [60, 80, 100]);
      const y3 = y2 + pick(rng, [80, 100, 120]);
      if (level === 1) {
        const year1Sum = money(y1 * 12);
        const allThreeYears = money((y1 + y2 + y3) * 12);
        return {
          prompt: `Ein erkundeter Ausbildungsbetrieb zahlt im 1. Ausbildungsjahr ${fmtInt(y1)} € monatlich, im 2. Jahr ${fmtInt(y2)} € und im 3. Jahr ${fmtInt(y3)} € (jeweils 12 Monate). Berechne die Jahresvergütung im 1. Jahr und die gesamte Vergütung über alle drei Ausbildungsjahre.`,
          hint: "1. Jahr = Monatsbetrag · 12. Drei Jahre = (Monat 1 + Monat 2 + Monat 3) · 12.",
          fields: [
            { label: "Vergütung im 1. Jahr", answer: year1Sum, unit: "€" },
            { label: "Gesamtvergütung (3 Jahre)", answer: allThreeYears, unit: "€" },
          ],
          solution: `1. Jahr = ${fmtInt(y1)} € · 12 = ${fmt(year1Sum)} € · 3 Jahre = (${fmtInt(y1)} + ${fmtInt(y2)} + ${fmtInt(y3)}) € · 12 = ${fmt(allThreeYears)} €.`,
        };
      }
      const gross = y1;
      const deductPct = pick(rng, [20, 21, 22]);
      const ticket = pick(rng, [49, 58, 65]);
      const net = money(gross * (1 - deductPct / 100));
      const afterTravel = money(net - ticket);
      return {
        prompt: `Von der monatlichen Brutto-Ausbildungsvergütung (${fmtInt(gross)} €) gehen rund ${deductPct} % für gesetzliche Sozialabgaben ab. Für den Weg zur Berufsschule und zum Betrieb fällt zudem ein Ticket von ${fmt(ticket)} € im Monat an. Berechne das Nettogehalt und den Restbetrag nach Abzug der Fahrtkosten.`,
        hint: "Netto = Brutto · (1 − Abzugssatz / 100). Ziehe anschließend das Monatsticket ab.",
        fields: [
          { label: "Monatliches Netto", answer: net, unit: "€" },
          { label: "Rest nach Fahrtkosten", answer: afterTravel, unit: "€" },
        ],
        solution: `Netto = ${fmtInt(gross)} € · (1 − ${deductPct} / 100) = ${fmt(net)} € · Nach Fahrtkosten = ${fmt(net)} € − ${fmt(ticket)} € = ${fmt(afterTravel)} €.`,
      };
    }

    case "workShare": {
      const totalStaff = pick(rng, [20, 25, 40, 50, 80, 100]);
      const skilled = Math.round(totalStaff * pick(rng, [0.4, 0.5, 0.6, 0.75]));
      const unskilled = totalStaff - skilled;
      const skilledPct = money((skilled / totalStaff) * 100);
      if (level === 1) {
        return {
          prompt: `In einem erkundeten Handwerksbetrieb arbeiten ${totalStaff} Beschäftigte. Davon üben ${skilled} Beschäftigte gelernte Tätigkeiten mit abgeschlossener Berufsausbildung aus, die übrigen arbeiten angelernt. Berechne die Anzahl der angelernten Kräfte und den Prozentanteil der gelernten Fachkräfte.`,
          hint: "Angelernte Kräfte = Gesamtzahl − Gelernte. Anteil (%) = (Gelernte / Gesamtzahl) · 100.",
          fields: [
            { label: "Angelernte Beschäftigte", answer: unskilled, unit: "Stück" },
            { label: "Anteil gelernter Fachkräfte", answer: skilledPct, unit: "%" },
          ],
          solution: `Angelernt = ${totalStaff} − ${skilled} = ${unskilled} · Anteil gelernt = (${skilled} / ${totalStaff}) · 100 = ${fmt(skilledPct)} %.`,
        };
      }
      const indoorPct = pick(rng, [35, 40, 60, 75]);
      const indoorHours = pick(rng, [36, 38, 40]);
      const totalWeeklyHours = money(totalStaff * indoorHours);
      const indoorTeamHours = money(totalWeeklyHours * (indoorPct / 100));
      return {
        prompt: `Ein Betrieb ordnet seine Arbeitsplätze nach dem Arbeitsort: ${totalStaff} Beschäftigte arbeiten je ${indoorHours} Std. pro Woche. Laut Ordnungssystematik entfallen ${indoorPct} % der gesamten Arbeitszeit auf Arbeiten in geschlossenen Werkhallen und Büros, der Rest auf Außeneinsätze. Berechne die gesamte Wochenarbeitszeit des Betriebs und die Stunden im Innenbereich.`,
        hint: "Gesamte Wochenstunden = Beschäftigte · Wochenarbeitszeit. Berechne davon den Prozentanteil im Innenbereich.",
        fields: [
          { label: "Gesamte Wochenarbeitszeit", answer: totalWeeklyHours, unit: "Std." },
          { label: "Wochenstunden im Innenbereich", answer: indoorTeamHours, unit: "Std." },
        ],
        solution: `Gesamt = ${totalStaff} · ${indoorHours} Std. = ${fmt(totalWeeklyHours)} Std. · Innenbereich = ${fmt(totalWeeklyHours)} Std. · ${indoorPct} % = ${fmt(indoorTeamHours)} Std.`,
      };
    }

    case "selfEmployedProfit": {
      const rate = pick(rng, [40, 50, 60, 75, 80]);
      const matPct = pick(rng, [20, 25, 30, 40]);
      const fixed = pick(rng, [900, 1200, 1500, 1800]);
      if (level === 1) {
        const hours = rng.int(80, 130);
        const res = selfEmployedResult(hours, rate, matPct, fixed);
        return {
          prompt: `Im Planspiel Selbständigkeit stellt ein junges Handwerksunternehmen ${hours} Auftragsstunden zu je ${fmt(rate)} € in Rechnung. Die Materialkosten betragen ${matPct} % des Umsatzes, hinzu kommen ${fmt(fixed)} € feste Monatskosten (Miete, Versicherung, Werbung). Berechne den Monatsumsatz und das Betriebsergebnis vor Steuern.`,
          hint: "Umsatz = Stunden · Stundensatz. Ziehe davon Materialkosten (Anteil vom Umsatz) und Fixkosten ab.",
          fields: [
            { label: "Monatsumsatz", answer: res.revenue, unit: "€" },
            { label: "Ergebnis vor Steuern", answer: res.profit, unit: "€" },
          ],
          solution: `Umsatz = ${hours} · ${fmt(rate)} € = ${fmt(res.revenue)} € · Material = ${fmt(res.materialCost)} € · Ergebnis = ${fmt(res.revenue)} € − ${fmt(res.materialCost)} € − ${fmt(fixed)} € = ${fmt(res.profit)} €.`,
        };
      }
      const targetProfit = pick(rng, [1800, 2100, 2400, 3000]);
      const marginRate = 1 - matPct / 100;
      // Ensure clean division by picking revenue as multiple of rate
      const reqHours = Math.ceil((targetProfit + fixed) / (marginRate * rate));
      const actualRes = selfEmployedResult(reqHours, rate, matPct, fixed);
      return {
        prompt: `Ein Selbständiger rechnet im Planspiel mit einem Stundensatz von ${fmt(rate)} €, einer Materialquote von ${matPct} % vom Umsatz und ${fmt(fixed)} € festen Monatskosten. Mindestens wie viele volle Auftragsstunden muss er abrechnen, um mindestens ${fmt(targetProfit)} € vor Steuern zu erwirtschaften, und welchen Überschuss erzielt er genau bei dieser Stundenzahl?`,
        hint: "Je Stunde bleiben Stundensatz · (1 − Materialquote) für Fixkosten und Gewinn übrig. Teile (Fixkosten + Zielgewinn) durch diesen Stundenbeitrag und runde auf ganze Stunden auf.",
        fields: [
          { label: "Mindestens nötige Auftragsstunden", answer: reqHours, unit: "Std." },
          { label: "Ergebnis bei dieser Stundenzahl", answer: actualRes.profit, unit: "€" },
        ],
        solution: `Deckungsbeitrag/Std. = ${fmt(rate)} € · (1 − ${matPct} %) = ${fmt(rate * marginRate)} € · Stunden = (${fmt(fixed)} + ${fmt(targetProfit)}) / ${fmt(rate * marginRate)} → ${reqHours} Std. · Ergebnis = ${fmt(actualRes.profit)} €.`,
      };
    }

    case "portfolioCheck": {
      const targetDocs = pick(rng, [16, 20, 24, 25]);
      if (level === 1) {
        const doneDocs = Math.round(targetDocs * pick(rng, [0.5, 0.625, 0.75, 0.8]));
        const missing = targetDocs - doneDocs;
        const pct = money((doneDocs / targetDocs) * 100);
        return {
          prompt: `Das Berufswahlportfolio einer Siebtklässlerin soll bis Schuljahresende ${targetDocs} geordnete Nachweise (Interessenbogen, Erkundungsbericht, Beratungsnotizen) umfassen. Bisher sind ${doneDocs} Belege aktuell abgeheftet. Berechne die noch fehlenden Einträge und den aktuellen Vollständigkeitsgrad in Prozent.`,
          hint: "Fehlend = Zielanzahl − erledigt. Prozent = (erledigt / Zielanzahl) · 100.",
          fields: [
            { label: "Noch fehlende Nachweise", answer: missing, unit: "Stück" },
            { label: "Vollständigkeit", answer: pct, unit: "%" },
          ],
          solution: `Fehlend = ${targetDocs} − ${doneDocs} = ${missing} Stück · Vollständigkeit = (${doneDocs} / ${targetDocs}) · 100 = ${fmt(pct)} %.`,
        };
      }
      const extraVisits = pick(rng, [3, 4, 5]);
      const perCompany = pick(rng, [8, 10, 12, 14]);
      const open = extraVisits * perCompany;
      const filledPct = pick(rng, [60, 75, 80]);
      const freePct = 100 - filledPct;
      const offered = (open * 100) / freePct;
      return {
        prompt: `Für den Ausbildungsmarkt im Landkreis melden Betriebe bei IHK und HWK insgesamt ${offered} Ausbildungsplätze. Davon sind ${filledPct} % bereits besetzt. Wie viele Ausbildungsplätze sind noch offen, und wie viele Plätze kämen durchschnittlich auf jeden von ${extraVisits} erkundeten Betrieben (falls gleichmäßig verteilt)?`,
        hint: "Offene Plätze = Gesamtplätze · (100 % − besetzt %). Teile die noch offenen Plätze anschließend durch die Zahl der Betriebe.",
        fields: [
          { label: "Noch offene Ausbildungsplätze", answer: open, unit: "Stück" },
          { label: "Offene Plätze je Betrieb", answer: perCompany, unit: "Stück" },
        ],
        solution: `Offen = ${offered} · (1 − ${filledPct} / 100) = ${open} Plätze · Je Betrieb = ${open} / ${extraVisits} = ${perCompany} Stück.`,
      };
    }

    case "profileMatch": {
      const tech = rng.int(2, 6);
      const social = rng.int(2, 6);
      const care = rng.int(3, 6);
      const creative = rng.int(1, 5);
      if (level === 1) {
        const extTech = rng.int(2, 6);
        const extSocial = rng.int(2, 6);
        const extCare = rng.int(3, 6);
        const extCreative = rng.int(1, 5);
        const avgSelf = money((tech + social + care + creative) / 4);
        const avgExt = money((extTech + extSocial + extCare + extCreative) / 4);
        return {
          prompt: `Im Berufsorientierungsgespräch vergleicht ein Schüler seine Selbsteinschätzung (${tech} / ${social} / ${care} / ${creative} Punkte) mit der Fremdeinschätzung seiner Praxislehrkraft (${extTech} / ${extSocial} / ${extCare} / ${extCreative} Punkte) über vier Kompetenzfelder. Berechne jeweils den Durchschnittswert beider Einschätzungen.`,
          hint: "Durchschnitt = Summe der vier Punktwerte geteilt durch 4.",
          fields: [
            { label: "Durchschnitt Selbsteinschätzung", answer: avgSelf, unit: "Punkte" },
            { label: "Durchschnitt Fremdeinschätzung", answer: avgExt, unit: "Punkte" },
          ],
          solution: `Selbsteinschätzung = (${tech} + ${social} + ${care} + ${creative}) / 4 = ${fmt(avgSelf)} · Fremdeinschätzung = (${extTech} + ${extSocial} + ${extCare} + ${extCreative}) / 4 = ${fmt(avgExt)}.`,
        };
      }
      const matches = careerProfileMatch(tech, social, care, creative);
      const best = matches[0];
      const worst = matches[matches.length - 1];
      const spread = money(best.fitPct - worst.fitPct);
      return {
        prompt: `Ein Jugendlicher bewertet seine vier Merkmale (Technik ${tech}, Soziales ${social}, Sorgfalt ${care}, Kreativität ${creative}) auf einer Skala von 1 bis 6. Die Anforderungsprofile lauten: Elektroniker/in (6/3/5/3), Büromanagement (3/4/6/3), Med. Fachangestellte/r (3/6/5/2). Die Passung beträgt 100 % minus (Abstandssumme / 20 · 100). Berechne die beste Passung und den Abstand zur niedrigsten Passung in Prozentpunkten.`,
        hint: "Addiere für jeden Beruf die Beträge der Abweichungen in allen vier Merkmalen, berechne 100 − (Abstand / 20) · 100 und bilde die Differenz zwischen bestem und niedrigstem Wert.",
        fields: [
          { label: "Beste Berufspassung", answer: best.fitPct, unit: "%" },
          { label: "Unterschied zur niedrigsten Passung", answer: spread, unit: "%" },
        ],
        solution: `Beste Passung (${best.name}) = ${fmt(best.fitPct)} % · Niedrigste (${worst.name}) = ${fmt(worst.fitPct)} % · Unterschied = ${fmt(spread)} Prozentpunkte.`,
      };
    }

    case "trainingBudget": {
      const allowance = pick(rng, [720, 780, 840, 900, 960]);
      const travel = pick(rng, [49, 58, 65]);
      const gear = pick(rng, [35, 45, 55]);
      const reservePct = pick(rng, [10, 15, 20]);
      const res = trainingMonthlyBudget(allowance, travel, gear, reservePct);
      if (level === 1) {
        return {
          prompt: `Eine Auszubildende der M-Klasse erhält netto ${fmt(allowance)} € monatlich. Für Fahrtkosten zur Berufsschule plant sie ${fmt(travel)} € und für Arbeitskleidung und Fachbücher ${fmt(gear)} € ein. Außerdem legt sie ${reservePct} % der Nettovergütung als Rücklage zurück. Berechne die monatliche Rücklage und das frei verfügbare Budget.`,
          hint: "Rücklage = Nettovergütung · Rücklagesatz / 100. Frei verfügbar = Vergütung − Fahrtkosten − Arbeitsmittel − Rücklage.",
          fields: [
            { label: "Monatliche Rücklage", answer: res.reserve, unit: "€" },
            { label: "Frei verfügbares Monatsbudget", answer: res.available, unit: "€" },
          ],
          solution: `Rücklage = ${fmt(allowance)} € · ${reservePct} % = ${fmt(res.reserve)} € · Verfügbar = ${fmt(allowance)} € − ${fmt(travel)} € − ${fmt(gear)} € − ${fmt(res.reserve)} € = ${fmt(res.available)} €.`,
        };
      }
      const months = pick(rng, [6, 8, 10]);
      const totalSaved = money(res.reserve * months);
      const laptopCost = money(totalSaved + pick(rng, [60, 120, 180]));
      const neededMonthly = money(laptopCost / months);
      const newAvailable = money(allowance - travel - gear - neededMonthly);
      return {
        prompt: `Ein angehender Azubi möchte nach ${months} Monaten einen eigenen Laptop für ${fmt(laptopCost)} € kaufen. Seine Nettovergütung liegt bei ${fmt(allowance)} € monatlich, Fahrtkosten kosten ${fmt(travel)} € und Arbeitsmittel ${fmt(gear)} €. Wie viel muss er pro Monat mindestens zurücklegen, und wie viel bleibt ihm dann monatlich zur freien Verfügung?`,
        hint: "Monatliche Sparrate = Kaufpreis / Sparmonate. Ziehe Fahrtkosten, Arbeitsmittel und Sparrate von der Vergütung ab.",
        fields: [
          { label: "Nötige Sparrate pro Monat", answer: neededMonthly, unit: "€" },
          { label: "Frei verfügbar pro Monat", answer: newAvailable, unit: "€" },
        ],
        solution: `Sparrate = ${fmt(laptopCost)} € / ${months} = ${fmt(neededMonthly)} € · Verfügbar = ${fmt(allowance)} € − ${fmt(travel)} € − ${fmt(gear)} € − ${fmt(neededMonthly)} € = ${fmt(newAvailable)} €.`,
      };
    }

    case "workTimeValue": {
      const wage = pick(rng, [12, 14, 15, 16, 18, 20]);
      const hours = pick(rng, [1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]);
      const price = money(wage * hours);
      if (level === 1) {
        const mins = Math.round(workTimeHours(price, wage) * 60);
        return {
          prompt: `Ein Paar Sportschuhe kostet ${fmt(price)} €. Bei einem Netto-Stundenlohn von ${fmt(wage)} € möchte ein Jugendlicher den Geldwert in Arbeitszeit einschätzen. Wie viele Stunden und wie viele Minuten muss man dafür arbeiten?`,
          hint: "Arbeitszeit (Std.) = Kaufpreis / Stundenlohn. Multipliziere die Stunden mit 60 für Minuten.",
          fields: [
            { label: "Benötigte Arbeitszeit", answer: hours, unit: "Std." },
            { label: "Benötigte Arbeitszeit in Minuten", answer: mins, unit: "Min." },
          ],
          solution: `Arbeitszeit = ${fmt(price)} € / ${fmt(wage)} €/Std. = ${fmt(hours)} Std. = ${fmtInt(mins)} Min.`,
        };
      }
      const altHours = pick(rng, [1, 1.5, 2, 3]);
      const cheaperHours = Math.max(0.5, hours - altHours);
      const altPrice = money(wage * cheaperHours);
      const savedEuro = money(price - altPrice);
      const savedHours = workTimeHours(savedEuro, wage);
      return {
        prompt: `Ein Schüler vergleicht zwei Bluetooth-Lautsprecher: Modell A kostet ${fmt(price)} €, das gleichwertige Modell B ${fmt(altPrice)} €. Eine Arbeitsstunde bringt netto ${fmt(wage)} €. Berechne die Geldersparnis in Euro und die dadurch eingesparte Arbeitszeit in Stunden.`,
        hint: "Ziehe zuerst den günstigeren Preis vom teureren ab und teile die Ersparnis durch den Stundenlohn.",
        fields: [
          { label: "Geldersparnis", answer: savedEuro, unit: "€" },
          { label: "Eingesparte Arbeitszeit", answer: savedHours, unit: "Std." },
        ],
        solution: `Ersparnis = ${fmt(price)} € − ${fmt(altPrice)} € = ${fmt(savedEuro)} € · Eingesparte Zeit = ${fmt(savedEuro)} € / ${fmt(wage)} €/Std. = ${fmt(savedHours)} Std.`,
      };
    }

    case "livingStandard": {
      const netIncome = pick(rng, [1800, 2000, 2400, 2500, 3000]);
      const housingFood = Math.round(netIncome * pick(rng, [0.45, 0.5, 0.55, 0.6]));
      const res = livingStandardSplit(netIncome, housingFood);
      if (level === 1) {
        return {
          prompt: `Ein Haushalt erzielt ${fmt(netIncome)} € Nettoeinkommen pro Monat. Wohnen, Lebensmittel und Energie (Grundbedarf) kosten zusammen ${fmt(housingFood)} €. Berechne die Grundbedarfsquote in Prozent und das frei verfügbare Einkommen für Freizeit, Bildung und Rücklagen.`,
          hint: "Grundbedarfsquote (%) = (Grundbedarf / Nettoeinkommen) · 100. Frei verfügbar = Nettoeinkommen − Grundbedarf.",
          fields: [
            { label: "Grundbedarfsquote", answer: res.basicRatioPct, unit: "%" },
            { label: "Frei verfügbare Mittel", answer: res.freeIncome, unit: "€" },
          ],
          solution: `Quote = (${fmt(housingFood)} € / ${fmt(netIncome)} €) · 100 = ${fmt(res.basicRatioPct)} % · Frei verfügbar = ${fmt(res.freeIncome)} €.`,
        };
      }
      const raisePct = pick(rng, [5, 10, 15]);
      const costUp = pick(rng, [120, 150, 180]);
      const newNet = money(netIncome * (1 + raisePct / 100));
      const newBasic = money(housingFood + costUp);
      const newRes = livingStandardSplit(newNet, newBasic);
      return {
        prompt: `Das Haushaltseinkommen von ${fmt(netIncome)} € steigt durch eine neue Qualifikation um ${raisePct} %, gleichzeitig erhöhen sich Miete und Nebenkosten um ${fmt(costUp)} € (bisheriger Grundbedarf: ${fmt(housingFood)} €). Berechne das neue frei verfügbare Einkommen und die neue Grundbedarfsquote.`,
        hint: "Erhöhe zuerst Einkommen um den Prozentsatz und Grundbedarf um den Eurobetrag, berechne dann freien Rest und Quote.",
        fields: [
          { label: "Neues frei verfügbares Einkommen", answer: newRes.freeIncome, unit: "€" },
          { label: "Neue Grundbedarfsquote", answer: newRes.basicRatioPct, unit: "%" },
        ],
        solution: `Neues Einkommen = ${fmt(newNet)} € · Neuer Grundbedarf = ${fmt(newBasic)} € · Frei verfügbar = ${fmt(newRes.freeIncome)} € · Quote = ${fmt(newRes.basicRatioPct)} %.`,
      };
    }

    case "multiWeekBudget": {
      const wInc = pick(rng, [22, 25, 30, 35]);
      const wFix = pick(rng, [4, 5, 6, 8]);
      const wVar = pick(rng, [5, 7, 8, 10]);
      const goal = pick(rng, [24, 32, 40]);
      const res = fourWeekBudget(wInc, wFix, wVar, goal);
      if (level === 1) {
        return {
          prompt: `Über einen Zeitraum von vier Wochen stehen wöchentlich ${fmt(wInc)} € zur Verfügung (Taschengeld und kleine Hilfe im Familienhaushalt). Pro Woche fallen ${fmt(wFix)} € feste Ausgaben (Handyguthaben) und ${fmt(wVar)} € veränderliche Ausgaben (Snacks, Kino) an. Berechne die Gesamteinnahmen und den Überschuss nach vier Wochen.`,
          hint: "Multipliziere alle Wochenbeträge mit 4 und ziehe feste plus veränderliche Ausgaben von den Einnahmen ab.",
          fields: [
            { label: "Einnahmen in 4 Wochen", answer: res.income4, unit: "€" },
            { label: "Überschuss nach 4 Wochen", answer: res.surplus4, unit: "€" },
          ],
          solution: `Einnahmen = 4 · ${fmt(wInc)} € = ${fmt(res.income4)} € · Ausgaben = 4 · (${fmt(wFix)} + ${fmt(wVar)}) € = ${fmt(res.expenses4)} € · Überschuss = ${fmt(res.surplus4)} €.`,
        };
      }
      const targetGoal = pick(rng, [28, 36, 44, 48]);
      const maxVar4 = money(res.income4 - res.fixed4 - targetGoal);
      const maxVarWeek = money(maxVar4 / 4);
      const savePct = money((targetGoal / res.income4) * 100);
      return {
        prompt: `In vier Wochen sollen bei ${fmt(wInc)} € Wocheneinnahmen und ${fmt(wFix)} € festen Wochenausgaben genau ${fmt(targetGoal)} € für neue Kopfhörer angespart werden. Wie viel darf höchstens pro Woche für veränderliche Wünsche ausgegeben werden, und wie hoch ist diese Sparquote?`,
        hint: "Ziehe die 4-Wochen-Fixkosten und das Sparziel von den 4-Wochen-Einnahmen ab und teile durch 4 Wochen.",
        fields: [
          { label: "Max. veränderliche Ausgaben/Woche", answer: maxVarWeek, unit: "€" },
          { label: "Sparquote am Einkommen", answer: savePct, unit: "%" },
        ],
        solution: `4-Wochen-Einnahmen = ${fmt(res.income4)} € · Rest für Wünsche = ${fmt(res.income4)} − ${fmt(res.fixed4)} − ${fmt(targetGoal)} = ${fmt(maxVar4)} € → ${fmt(maxVarWeek)} €/Woche · Sparquote = ${fmt(savePct)} %.`,
      };
    }

    case "unitPriceCompare": {
      const weights = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0];
      const wA = pick(rng, weights);
      const wB = pick(rng, weights);
      const baseA = pick(rng, [2.4, 3.2, 4.0, 4.8, 6.0]);
      const baseB = pick(rng, [2.8, 3.6, 4.4, 5.2, 6.4]);
      const pA = money(wA * baseA);
      const pB = money(wB * baseB);
      if (level === 1) {
        return {
          prompt: `Bei der Markterkundung werden zwei Packungen Müsli verglichen: Packung A (${fmt(wA)} kg) kostet ${fmt(pA)} €, Packung B (${fmt(wB)} kg) kostet ${fmt(pB)} €. Berechne beide Grundpreise in Euro je Kilogramm.`,
          hint: "Grundpreis = Packungspreis geteilt durch Packungsgewicht in kg.",
          fields: [
            { label: "Grundpreis Packung A", answer: unitPrice(pA, wA), unit: "€/kg" },
            { label: "Grundpreis Packung B", answer: unitPrice(pB, wB), unit: "€/kg" },
          ],
          solution: `Grundpreis A = ${fmt(pA)} € / ${fmt(wA)} kg = ${fmt(unitPrice(pA, wA))} €/kg · Grundpreis B = ${fmt(pB)} € / ${fmt(wB)} kg = ${fmt(unitPrice(pB, wB))} €/kg.`,
        };
      }
      const discPct = pick(rng, [10, 20, 25]);
      const pADisc = money(pA * (1 - discPct / 100));
      const gpADisc = unitPrice(pADisc, wA);
      const totalFor3KgA = money(gpADisc * 3);
      return {
        prompt: `Packung A (${fmt(wA)} kg, Normalpreis ${fmt(pA)} €) ist diese Woche mit ${discPct} % Aktionsrabatt ausgezeichnet. Berechne den reduzierten Grundpreis je Kilogramm und den Gesamtpreis für eine Vergleichsmenge von 3 kg zum Aktionspreis.`,
        hint: "Reduziere zuerst den Packungspreis um den Rabatt, berechne dann Preis / kg und multipliziere mit 3 kg.",
        fields: [
          { label: "Aktions-Grundpreis A", answer: gpADisc, unit: "€/kg" },
          { label: "Preis für 3 kg", answer: totalFor3KgA, unit: "€" },
        ],
        solution: `Aktionspreis Packung = ${fmt(pA)} € · (1 − ${discPct} %) = ${fmt(pADisc)} € · Grundpreis = ${fmt(gpADisc)} €/kg · Für 3 kg = ${fmt(totalFor3KgA)} €.`,
      };
    }

    case "marketBalance": {
      const price = pick(rng, [1.5, 2.0, 2.5, 3.0]);
      const supply = rng.int(40, 80);
      const gap = rng.int(12, 35);
      const demand = level === 1 ? supply + gap : Math.max(10, supply - gap);
      const traded = Math.min(demand, supply);
      const revenue = money(traded * price);
      if (level === 1) {
        return {
          prompt: `Beim Pausenverkauf werden belegte Vollkornbrötchen zu ${fmt(price)} € angeboten. Die Schülergruppe hat ${supply} Brötchen vorbereitet, aber ${demand} Schülerinnen und Schüler möchten eines kaufen. Berechne den Nachfrageüberhang in Stück und den erzielten Umsatz.`,
          hint: "Nachfrageüberhang = Nachfrage − Angebot. Verkauft werden kann höchstens die vorhandene Angebotsmenge.",
          fields: [
            { label: "Nachfrageüberhang", answer: demand - supply, unit: "Stück" },
            { label: "Erzielter Umsatz", answer: revenue, unit: "€" },
          ],
          solution: `Nachfrageüberhang = ${demand} − ${supply} = ${demand - supply} Stück · Verkauft werden ${traded} Stück → Umsatz = ${traded} · ${fmt(price)} € = ${fmt(revenue)} €.`,
        };
      }
      const leftover = supply - demand;
      const newPrice = money(price - 0.5);
      const extraDemand = Math.min(leftover, rng.int(6, leftover));
      const newRevenue = money(demand * price + extraDemand * newPrice);
      return {
        prompt: `Zu einem höheren Preis von ${fmt(price)} € sinkt die Nachfrage auf ${demand} Stück, während ${supply} Stück bereitstehen. Kurz vor Pausenende senkt das Team den Preis für den Restbestand auf ${fmt(newPrice)} € und verkauft dadurch noch ${extraDemand} weitere Stück. Berechne den anfänglichen Angebotsüberhang und den gesamten Umsatz.`,
        hint: "Angebotsüberhang = Angebot − ursprüngliche Nachfrage. Addiere den Umsatz zum Normalpreis und den Umsatz aus der Preissenkung.",
        fields: [
          { label: "Anfänglicher Angebotsüberhang", answer: leftover, unit: "Stück" },
          { label: "Gesamtumsatz nach Preissenkung", answer: newRevenue, unit: "€" },
        ],
        solution: `Überhang = ${supply} − ${demand} = ${leftover} Stück · Gesamtumsatz = ${demand} · ${fmt(price)} € + ${extraDemand} · ${fmt(newPrice)} € = ${fmt(newRevenue)} €.`,
      };
    }

    case "schoolSaleCalc": {
      const buyQty = pick(rng, [50, 60, 80, 100]);
      const unitCost = pick(rng, [0.7, 0.8, 0.9, 1.0]);
      const sellPrice = pick(rng, [1.8, 2.0, 2.2, 2.5]);
      const standCost = pick(rng, [8, 10, 12]);
      if (level === 1) {
        const res = schoolSaleOutcome(buyQty, unitCost, sellPrice, 100, standCost);
        return {
          prompt: `Für einen Pausenverkauf kauft die Klasse 7a ${buyQty} Obstbecher zu je ${fmt(unitCost)} € ein und zahlt ${fmt(standCost)} € für Servietten und Standmaterial. Alle ${buyQty} Becher werden zu je ${fmt(sellPrice)} € verkauft. Berechne die Gesamtausgaben und den Überschuss.`,
          hint: "Gesamtausgaben = Stückzahl · Einkaufspreis + Standkosten. Überschuss = Einnahmen − Gesamtausgaben.",
          fields: [
            { label: "Gesamtausgaben", answer: res.expense, unit: "€" },
            { label: "Überschuss", answer: res.surplus, unit: "€" },
          ],
          solution: `Ausgaben = ${buyQty} · ${fmt(unitCost)} € + ${fmt(standCost)} € = ${fmt(res.expense)} € · Einnahmen = ${fmt(res.revenue)} € · Überschuss = ${fmt(res.surplus)} €.`,
        };
      }
      const demandPct = pick(rng, [70, 80, 90]);
      const res = schoolSaleOutcome(buyQty, unitCost, sellPrice, demandPct, standCost);
      return {
        prompt: `Vom Einkauf von ${buyQty} Stück (Einkaufspreis ${fmt(unitCost)} €, Standkosten ${fmt(standCost)} €) können beim Preis von ${fmt(sellPrice)} € nur ${demandPct} % verkauft werden, der Rest bleibt unverkauft. Berechne die unverkaufte Restmenge und das tatsächliche Ergebnis (Überschuss).`,
        hint: "Berechne zuerst die tatsächlich verkaufte Menge, dann Einnahmen minus gesamte Einkaufs- und Standkosten.",
        fields: [
          { label: "Unverkaufte Stückzahl", answer: res.unsoldQty, unit: "Stück" },
          { label: "Überschuss nach allen Ausgaben", answer: res.surplus, unit: "€" },
        ],
        solution: `Verkauft = ${res.soldQty} Stück, unverkauft = ${res.unsoldQty} Stück · Einnahmen = ${fmt(res.revenue)} € · Ausgaben = ${fmt(res.expense)} € · Überschuss = ${fmt(res.surplus)} €.`,
      };
    }

    case "holidayJobLimits": {
      if (level === 1) {
        const days = pick(rng, [5, 10, 12, 15]);
        const hoursPerDay = pick(rng, [5, 6, 7, 8]);
        const wage = pick(rng, [12, 13, 14]);
        const minBreak = hoursPerDay > 6 ? 60 : 30;
        const gross = money(days * hoursPerDay * wage);
        return {
          prompt: `Ein 15-jähriger Schüler möchte in den Sommerferien ${days} Arbeitstage lang jeweils ${hoursPerDay} Std. täglich bei einer Gärtnerei für ${fmt(wage)} € pro Stunde aushelfen (§ 5 Abs. 4 JArbSchG). Berechne den Gesamtverdienst und die gesetzliche Mindestruhepause pro Arbeitstag nach § 11 JArbSchG.`,
          hint: "Verdienst = Tage · Stunden/Tag · Stundenlohn. Ruhepause: ab > 4,5 bis 6 Std. mind. 30 Min., bei > 6 Std. mind. 60 Min.",
          fields: [
            { label: "Ferienjob-Verdienst", answer: gross, unit: "€" },
            { label: "Mindestruhepause je Tag", answer: minBreak, unit: "Min." },
          ],
          solution: `Verdienst = ${days} · ${hoursPerDay} Std. · ${fmt(wage)} € = ${fmt(gross)} € · Bei ${hoursPerDay} Std./Tag gilt nach § 11 JArbSchG eine Pause von mindestens ${minBreak} Min.`,
        };
      }
      const workedDays = pick(rng, [5, 8, 10, 12]);
      const remainingDays = 20 - workedDays;
      const hoursPerDay = pick(rng, [6, 7, 8]);
      const wage = pick(rng, [12, 13, 14]);
      const maxRemainingEarnings = money(remainingDays * hoursPerDay * wage);
      return {
        prompt: `Vollzeitschulpflichtige Jugendliche ab 15 Jahren dürfen im Kalenderjahr höchstens 4 Wochen (20 Arbeitstage in der 5-Tage-Woche) Ferienarbeit leisten. Eine 15-Jährige hat in den Osterferien bereits ${workedDays} Arbeitstage gejobbt. Wie viele Arbeitstage bleiben ihr in den Sommerferien maximal übrig, und wie viel kann sie bei ${hoursPerDay} Std./Tag zu ${fmt(wage)} €/Std. noch verdienen?`,
        hint: "Restliche Arbeitstage = 20 − bereits gearbeitete Tage. Multipliziere die Resttage mit täglicher Stundenzahl und Stundenlohn.",
        fields: [
          { label: "Verbleibende Arbeitstage im Jahr", answer: remainingDays, unit: "Tage" },
          { label: "Maximaler Restverdienst", answer: maxRemainingEarnings, unit: "€" },
        ],
        solution: `Resttage = 20 − ${workedDays} = ${remainingDays} Tage · Restverdienst = ${remainingDays} · ${hoursPerDay} Std. · ${fmt(wage)} € = ${fmt(maxRemainingEarnings)} €.`,
      };
    }

    case "applianceCost": {
      const watts = pick(rng, [400, 600, 800, 1200, 1500, 2000]);
      const hoursPerWeek = pick(rng, [2, 4, 5, 10]);
      const cents = pick(rng, [30, 35, 40]);
      if (level === 1) {
        const res = applianceUsageCost(watts, hoursPerWeek, 0, cents, 0);
        return {
          prompt: `Im Technikprotokoll wird ein Haushaltsgerät mit ${watts} Watt Leistungsaufnahme durchschnittlich ${hoursPerWeek} Std. pro Woche genutzt (52 Wochen im Jahr). Der Strompreis beträgt ${cents} ct/kWh. Berechne den jährlichen Stromverbrauch in kWh und die jährlichen Stromkosten in Euro.`,
          hint: "kWh = (Watt · Wochenstunden · 52) / 1.000. Kosten = kWh · (Cent / 100).",
          fields: [
            { label: "Jährlicher Stromverbrauch", answer: res.activeKwhYear, unit: "kWh" },
            { label: "Jährliche Stromkosten", answer: res.activeCostYear, unit: "€" },
          ],
          solution: `Energie = (${watts} W · ${hoursPerWeek} Std. · 52) / 1.000 = ${fmt(res.activeKwhYear)} kWh · Kosten = ${fmt(res.activeKwhYear)} · ${fmt(cents / 100)} € = ${fmt(res.activeCostYear)} €.`,
        };
      }
      const oldCost = pick(rng, [95, 110, 125, 140]);
      const newCost = oldCost - pick(rng, [25, 30, 35, 40]);
      const annualSaving = money(oldCost - newCost);
      const extraPrice = money(annualSaving * pick(rng, [3, 4, 5]));
      const amortYears = money(extraPrice / annualSaving);
      return {
        prompt: `Ein Haushalt vergleicht zwei Kühlschränke: Gerät A kostet jährlich ${fmt(oldCost)} € Strom, das energieeffiziente Gerät B kostet nur ${fmt(newCost)} € Strom pro Jahr, ist aber beim Kauf um ${fmt(extraPrice)} € teurer. Berechne die jährliche Stromkostenersparnis und nach wie vielen Jahren sich der höhere Kaufpreis amortisiert.`,
        hint: "Jährliche Ersparnis = Stromkosten A − Stromkosten B. Amortisation (Jahre) = Mehrpreis / jährliche Ersparnis.",
        fields: [
          { label: "Jährliche Ersparnis", answer: annualSaving, unit: "€" },
          { label: "Amortisationsdauer", answer: amortYears, unit: "Jahre" },
        ],
        solution: `Ersparnis/Jahr = ${fmt(oldCost)} € − ${fmt(newCost)} € = ${fmt(annualSaving)} € · Amortisation = ${fmt(extraPrice)} € / ${fmt(annualSaving)} € = ${fmt(amortYears)} Jahre.`,
      };
    }

    case "householdProduction": {
      const qty = pick(rng, [4, 5, 6, 8]);
      const ingred = pick(rng, [4.8, 5.4, 6.0, 7.2]);
      const watts = pick(rng, [1500, 2000, 2400]);
      const bakeHours = pick(rng, [0.5, 0.75, 1.0]);
      const cents = pick(rng, [32, 36, 40]);
      const energyCost = money(((watts * bakeHours) / 1000) * (cents / 100));
      const homeTotal = money(ingred + energyCost);
      const buyEach = pick(rng, [2.8, 3.2, 3.6, 4.0]);
      const buyTotal = money(qty * buyEach);
      const saved = money(buyTotal - homeTotal);
      if (level === 1) {
        return {
          prompt: `Ein Haushalt backt ${qty} Portionen Pizza selbst: Die Zutaten kosten ${fmt(ingred)} €, der Backofen (${watts} W) läuft ${fmt(bakeHours)} Std. bei einem Strompreis von ${cents} ct/kWh. Der Kauf von ${qty} fertigen Portionen würde je ${fmt(buyEach)} € kosten. Berechne die Gesamtkosten der Eigenproduktion und die Geldersparnis gegenüber dem Kauf.`,
          hint: "Energiekosten = (Watt · Stunden / 1.000) · (Cent / 100). Addiere Zutaten plus Energiekosten und vergleiche mit dem Kaufpreis.",
          fields: [
            { label: "Gesamtkosten Eigenproduktion", answer: homeTotal, unit: "€" },
            { label: "Ersparnis gegenüber Kauf", answer: saved, unit: "€" },
          ],
          solution: `Strom = ${fmt(energyCost)} € · Eigenproduktion = ${fmt(ingred)} € + ${fmt(energyCost)} € = ${fmt(homeTotal)} € · Kauf = ${fmt(buyTotal)} € · Ersparnis = ${fmt(saved)} €.`,
        };
      }
      const prepMins = pick(rng, [30, 45, 60]);
      const savedPerHour = money(saved / (prepMins / 60));
      return {
        prompt: `Für ${qty} Portionen Eigenherstellung entstehen insgesamt ${fmt(homeTotal)} € Kosten für Zutaten und Strom; der Kauf fertiger Portionen würde ${fmt(buyTotal)} € kosten. Für Vorbereitung, Zubereitung und Abwasch wendet der Haushalt ${prepMins} Min. eigene Arbeitszeit auf. Berechne die Geldersparnis und die rechnerische Ersparnis pro Stunde eigener Arbeit.`,
        hint: "Ersparnis = Kaufpreis − Eigenkosten. Teile die Ersparnis durch die eigene Arbeitszeit in Stunden (Minuten / 60).",
        fields: [
          { label: "Geldersparnis", answer: saved, unit: "€" },
          { label: "Ersparnis je Arbeitsstunde", answer: savedPerHour, unit: "€/Std." },
        ],
        solution: `Ersparnis = ${fmt(buyTotal)} € − ${fmt(homeTotal)} € = ${fmt(saved)} € · Arbeitszeit = ${prepMins} Min. = ${fmt(prepMins / 60)} Std. → ${fmt(savedPerHour)} €/Std.`,
      };
    }
  }
}
