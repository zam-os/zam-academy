import type { Entry, Exercise, Level, PracticeKind } from "../model/types";
import {
  accrual,
  breakEven,
  calculation,
  euro,
  fmt,
  fmtInt,
  makeOrBuy,
  money,
  monthName,
  mulDiv,
  percentOf,
  provisionRelease,
  ratios,
  toCents,
} from "../finance";
import type { Rng } from "./rng";
const D = (account: string, amount: number): Entry => ({
  side: "debit",
  account,
  amount: money(amount),
});
const C = (account: string, amount: number): Entry => ({
  side: "credit",
  account,
  amount: money(amount),
});
const pick = <T>(rng: Rng, items: readonly T[]): T => items[rng.int(0, items.length - 1)];

/** Prepaid expenses of the school model: account, wording, and whether the payment carried VAT. */
const PREPAID = [
  { account: "6900", text: "den Jahresbeitrag der Betriebshaftpflichtversicherung", vat: false },
  { account: "7030", text: "die Kraftfahrzeugsteuer für den Lieferwagen", vat: false },
  { account: "6700", text: "die laut Vertrag umsatzsteuerfreie Miete für eine Lagerhalle", vat: false },
  { account: "6870", text: "eine Werbekampagne im Lokalradio", vat: true },
] as const;
const PREPAID_INCOME = [
  { account: "5400", text: "die laut Vertrag umsatzsteuerfreie Miete für vermietete Büroräume" },
  { account: "5710", text: "Zinsen für ein gewährtes Darlehen" },
] as const;

export function makeExercise(kind: PracticeKind, rng: Rng, level: Level): Exercise {
  const task: Exercise = { prompt: "", hint: "", fields: [], booking: [], solution: "" };
  const field = (label: string, answer: number, unit = "Euro") =>
    task.fields.push({ label, answer: money(answer), unit });
  const book = (...rows: Entry[]) => {
    task.booking = rows;
  };
  switch (kind) {
    case "split": {
      // Level 2 uses shorter periods that still reach into the new year.
      const months = level === 1 ? 12 : pick(rng, [6, 9]),
        start = level === 1 ? rng.int(2, 12) : rng.int(14 - months, 12),
        amount = rng.int(12, 96) * 100 * (months === 12 ? 2 : 3);
      const result = accrual(amount, start, months);
      task.prompt = `Am 1. ${monthName(start)} zahlt die Möbelfabrik Lindner ${fmt(amount)} Euro im Voraus für ${months} Monate (${monthName(start)} bis ${monthName(((start + months - 2) % 12) + 1)}). Ermittle, welcher Teil des Betrags wirtschaftlich zum alten und welcher zum neuen Geschäftsjahr gehört.`;
      task.hint = `Zeitleiste zeichnen: Vom 1. ${monthName(start)} bis 31. Dezember sind es ${result.oldMonths} Monate. Betrag ÷ ${months} × Monate.`;
      field("Anteil altes Jahr", result.oldPart);
      field("Anteil neues Jahr", result.newPart);
      break;
    }
    case "ara": {
      const item = level === 1 ? pick(rng, PREPAID.slice(0, 3)) : PREPAID[3];
      const start = rng.int(2, 12),
        net = rng.int(12, 96) * 100,
        part = accrual(net, start, 12).newPart;
      task.prompt =
        level === 1
          ? `Am 1. ${monthName(start)} wurde ${item.text} für ein Jahr im Voraus per Bank bezahlt und vollständig als Aufwand gebucht: ${fmt(net)} Euro. Ermittle den Abgrenzungsbetrag und buche zum 31. Dezember.`
          : `Am 1. ${monthName(start)} wurde ${item.text} für zwölf Monate bezahlt: ${fmt(net)} Euro netto plus 19 Prozent Umsatzsteuer. Aufwand und Vorsteuer sind bereits gebucht. Ermittle den Abgrenzungsbetrag und buche zum 31. Dezember.`;
      task.hint =
        "Abgegrenzt wird nur der Teil, der ins neue Jahr gehört, und nur netto: 2900 ARA an das Aufwandskonto.";
      field("Abgrenzungsbetrag", part);
      book(D("2900", part), C(item.account, part));
      break;
    }
    case "pra": {
      const item = pick(rng, PREPAID_INCOME),
        months = level === 1 ? 12 : 6,
        // Six months reach into the new year only from August on.
        start = months === 6 ? rng.int(8, 12) : rng.int(2, 12),
        amount = rng.int(6, 60) * 100 * (months === 12 ? 2 : 1),
        part = accrual(amount, start, months).newPart;
      task.prompt = `Am 1. ${monthName(start)} gingen ${fmt(amount)} Euro für ${item.text} per Bank ein. Sie decken ${months} Monate ab dem Zahlungsmonat und sind vollständig als Ertrag gebucht. Ermittle den Abgrenzungsbetrag und buche zum 31. Dezember.`;
      task.hint = "Den Ertrag des neuen Jahres herausnehmen: Ertragskonto an 4900 PRA.";
      field("Abgrenzungsbetrag", part);
      book(D(item.account, part), C("4900", part));
      break;
    }
    case "reverse": {
      const passive = level === 2,
        item = passive ? pick(rng, PREPAID_INCOME) : pick(rng, PREPAID.slice(0, 3)),
        amount = rng.int(3, 90) * 100;
      task.prompt = passive
        ? `Zum 31. Dezember wurden ${fmt(amount)} Euro vorauserhaltener Ertrag für ${item.text} passiv abgegrenzt. Buche die Auflösung am 1. Januar des neuen Jahres.`
        : `Zum 31. Dezember wurden ${fmt(amount)} Euro für ${item.text} aktiv abgegrenzt. Buche die Auflösung am 1. Januar des neuen Jahres.`;
      task.hint = passive
        ? "Die Abgrenzung wird umgekehrt: 4900 PRA an das Ertragskonto. Jetzt ist der Ertrag im richtigen Jahr."
        : "Die Abgrenzung wird umgekehrt: Aufwandskonto an 2900 ARA. Jetzt ist der Aufwand im richtigen Jahr.";
      book(...(passive ? [D("4900", amount), C(item.account, amount)] : [D(item.account, amount), C("2900", amount)]));
      break;
    }
    case "provision": {
      const repair = level === 1,
        estimate = rng.int(8, 90) * 100;
      task.prompt = repair
        ? `Eine dringende Reparatur der Lackieranlage wird auf Februar verschoben. Laut Kostenvoranschlag kostet sie ${fmt(estimate)} Euro netto plus 19 Prozent Umsatzsteuer. Buche zum 31. Dezember.`
        : `Ein Kunde klagt wegen eines angeblichen Mangels. Die Anwältin schätzt die Prozesskosten auf ${fmt(estimate)} Euro netto plus 19 Prozent Umsatzsteuer; das Urteil wird im nächsten Jahr erwartet. Buche zum 31. Dezember.`;
      task.hint =
        "Rückstellungen enthalten nur den geschätzten Nettobetrag, keine Vorsteuer: Aufwandskonto an 3900 RST.";
      book(D(repair ? "6160" : "6770", estimate), C("3900", estimate));
      break;
    }
    case "release": {
      const rst = rng.int(10, 60) * 100,
        mode = level === 1 ? rng.int(0, 1) : rng.int(0, 2),
        delta = rng.int(1, 9) * 50,
        net = mode === 0 ? rst + delta : mode === 1 ? rst - delta : rst,
        r = provisionRelease(rst, net);
      const payable = level === 1 ? "4400" : "2800";
      task.prompt =
        level === 1
          ? `Für eine verschobene Reparatur steht eine Rückstellung von ${fmt(rst)} Euro. Im März des neuen Jahres kommt die Rechnung: ${fmt(net)} Euro netto plus 19 Prozent Umsatzsteuer, zahlbar später (Ziel). Ermittle die Differenz zwischen Rückstellung und Nettobetrag und buche den Rechnungseingang.`
          : `Für einen Prozess wurden ${fmt(rst)} Euro zurückgestellt. Nach dem Urteil im April überweist Lindner die Anwaltsrechnung sofort per Bank: ${fmt(money(r.gross))} Euro einschließlich 19 Prozent Umsatzsteuer. Ermittle Nettobetrag und Differenz zur Rückstellung und buche die Zahlung.`;
      task.hint =
        "Rückstellung vollständig auflösen, Vorsteuer aus der Rechnung, Bruttobetrag an VE oder BK. Zu wenig zurückgestellt: 6990 PFAW. Zu viel zurückgestellt: 5490 PFE.";
      if (level === 2) field("Nettobetrag", net);
      field("Differenz", r.difference);
      book(
        D("3900", rst),
        ...(r.kind === "expense" ? [D("6990", r.difference)] : []),
        D("2600", r.vat),
        C(payable, r.gross),
        ...(r.kind === "income" ? [C("5490", r.difference)] : []),
      );
      break;
    }
    case "closing": {
      const revenue = rng.int(300, 900) * 1000,
        interest = rng.int(2, 20) * 100,
        material = rng.int(100, 280) * 1000,
        wages = rng.int(80, 200) * 1000,
        depreciation = rng.int(10, 60) * 1000,
        other = rng.int(5, 90) * 1000;
      const result = revenue + interest - material - wages - depreciation - other;
      task.prompt =
        level === 1
          ? `Auf dem GUV-Konto stehen ${fmt(revenue + interest)} Euro Erträge und ${fmt(material + wages + depreciation + other)} Euro Aufwendungen. Ermittle das Ergebnis (Verlust negativ) und buche den Abschluss des GUV-Kontos.`
          : `Salden nach den Vorabschlussbuchungen: 5000 UEFE ${fmt(revenue)}, 5710 ZE ${fmt(interest)}, 6000 AWR ${fmt(material)}, 6200 LG ${fmt(wages)}, 6520 ABSA ${fmt(depreciation)}, sonstige Aufwendungen ${fmt(other)} Euro. Ermittle das Ergebnis (Verlust negativ) und buche den Abschluss des GUV-Kontos.`;
      task.hint = "Erträge minus Aufwendungen. Gewinn: 8020 GUV an 3000 EK; Verlust: 3000 EK an 8020 GUV.";
      field("Ergebnis", result);
      book(
        ...(result >= 0
          ? [D("8020", result), C("3000", result)]
          : [D("3000", -result), C("8020", -result)]),
      );
      break;
    }
    case "equity": {
      const start = rng.int(20, 90) * 5000,
        profit = rng.int(4, 30) * 2500,
        input = rng.int(0, 8) * 1000,
        output = rng.int(10, 40) * 1000,
        end = start + profit + input - output;
      task.prompt =
        level === 1
          ? `Eigenkapital am 1. Januar ${fmt(start)} Euro, Gewinn ${fmt(profit)}, Privateinlagen ${fmt(input)}, Privatentnahmen ${fmt(output)} Euro. Ermittle das Eigenkapital am 31. Dezember und buche den Abschluss des Privatkontos.`
          : `Eigenkapital am 1. Januar ${fmt(start)} Euro, am 31. Dezember ${fmt(end)} Euro. Privateinlagen ${fmt(input)}, Privatentnahmen ${fmt(output)} Euro. Ermittle den Gewinn und buche den Abschluss des Privatkontos.`;
      task.hint =
        "Schlusskapital = Anfangskapital + Gewinn + Einlagen − Entnahmen. Entnahmen größer als Einlagen: 3000 EK an 3001 P.";
      field(level === 1 ? "Eigenkapital am 31. Dezember" : "Gewinn", level === 1 ? end : profit);
      const balance = output - input;
      book(D("3000", balance), C("3001", balance));
      break;
    }
    case "condense": {
      const fo = rng.int(40, 160) * 500,
        zwfo = rng.int(2, 20) * 500,
        vorst = rng.int(2, 12) * 250,
        ara = rng.int(1, 8) * 300,
        ewb = rng.int(1, 4) * 250,
        pwb = rng.int(2, 9) * 100,
        bk = rng.int(10, 90) * 500,
        ka = rng.int(1, 9) * 100;
      const rst = rng.int(2, 9) * 500,
        kbkv = rng.int(0, 10) * 1000,
        ve = rng.int(20, 90) * 500,
        ust = rng.int(2, 15) * 400,
        pra = rng.int(1, 6) * 300,
        lbkv = rng.int(20, 80) * 1000;
      if (level === 1) {
        task.prompt = `Schlussbilanz (Auszug, Euro): 2400 FO ${fmt(fo)}, 2470 ZWFO ${fmt(zwfo)}, 2600 VORST ${fmt(vorst)}, 2900 ARA ${fmt(ara)}, 3670 EWB ${fmt(ewb)}, 3680 PWB ${fmt(pwb)}, 2800 BK ${fmt(bk)}, 2880 KA ${fmt(ka)}. Ermittle die Posten Forderungen und flüssige Mittel der aufbereiteten Bilanz.`;
        task.hint = "Forderungen = FO + ZWFO + VORST + ARA − EWB − PWB; flüssige Mittel = BK + KA.";
        field("Forderungen", fo + zwfo + vorst + ara - ewb - pwb);
        field("Flüssige Mittel", bk + ka);
      } else {
        task.prompt = `Passivseite der Schlussbilanz (Auszug, Euro): 3000 EK ${fmt(lbkv * 2)}, 3900 RST ${fmt(rst)}, 4200 KBKV ${fmt(kbkv)}, 4250 LBKV ${fmt(lbkv)}, 4400 VE ${fmt(ve)}, 4800 UST ${fmt(ust)}, 4900 PRA ${fmt(pra)}. Ermittle die Posten langfristiges und kurzfristiges Fremdkapital der aufbereiteten Bilanz.`;
        task.hint =
          "Langfristig nur LBKV. Kurzfristig: RST + KBKV + VE + UST + PRA (im Schulmodell werden Rückstellungen im Folgejahr aufgelöst).";
        field("Langfristiges Fremdkapital", lbkv);
        field("Kurzfristiges Fremdkapital", rst + kbkv + ve + ust + pra);
      }
      break;
    }
    case "cashratio":
    case "quickratio": {
      const kfk = rng.int(40, 200) * 1000,
        fluessig = rng.int(4, 60) * 1000,
        ford = rng.int(20, 160) * 1000;
      const base = { av: 1, vorraete: 0, forderungen: ford, fluessig, ek: 0, lfk: 0, kfk };
      const r = ratios(base, 0, 1);
      const label = kind === "cashratio" ? "Barliquidität" : "Einzugsliquidität";
      if (level === 1) {
        task.prompt = `Aufbereitete Bilanz: flüssige Mittel ${fmt(fluessig)} Euro, Forderungen ${fmt(ford)} Euro, kurzfristiges Fremdkapital ${fmt(kfk)} Euro. Berechne die ${label} auf zwei Dezimalstellen.`;
        task.hint =
          kind === "cashratio"
            ? "Barliquidität = flüssige Mittel · 100 : kurzfristiges Fremdkapital."
            : "Einzugsliquidität = (Forderungen + flüssige Mittel) · 100 : kurzfristiges Fremdkapital.";
        field(label, kind === "cashratio" ? r.cash : r.quick, "%");
      } else {
        const paid = Math.min(fluessig - 1000, rng.int(1, 8) * 1000);
        const after = ratios({ ...base, fluessig: fluessig - paid, kfk: kfk - paid }, 0, 1);
        task.prompt = `Aufbereitete Bilanz: flüssige Mittel ${fmt(fluessig)} Euro, Forderungen ${fmt(ford)} Euro, kurzfristiges Fremdkapital ${fmt(kfk)} Euro. Am 31. Dezember wird noch eine Liefererrechnung über ${fmt(paid)} Euro per Bank bezahlt. Berechne die ${label} vor und nach der Zahlung.`;
        task.hint =
          "Die Zahlung senkt flüssige Mittel und kurzfristiges Fremdkapital um denselben Betrag. Beide Werte neu einsetzen.";
        field(`${label} vorher`, kind === "cashratio" ? r.cash : r.quick, "%");
        field(`${label} nachher`, kind === "cashratio" ? after.cash : after.quick, "%");
      }
      break;
    }
    case "coverage": {
      const av = rng.int(100, 600) * 1000,
        ek = rng.int(40, 400) * 1000,
        lfk = rng.int(20, 300) * 1000;
      const r = ratios({ av, vorraete: 0, forderungen: 0, fluessig: 0, ek, lfk, kfk: 1 }, 0, 1);
      if (level === 1) {
        task.prompt = `Aufbereitete Bilanz: Anlagevermögen ${fmt(av)}, Eigenkapital ${fmt(ek)}, langfristiges Fremdkapital ${fmt(lfk)} Euro. Berechne Anlagendeckung I und II.`;
        task.hint = "ALD I = EK · 100 : AV; ALD II = (EK + langfristiges FK) · 100 : AV.";
        field("Anlagendeckung I", r.coverage1, "%");
        field("Anlagendeckung II", r.coverage2, "%");
      } else {
        const loan = rng.int(2, 10) * 10000;
        const after = ratios({ av: av + loan, vorraete: 0, forderungen: 0, fluessig: 0, ek, lfk: lfk + loan, kfk: 1 }, 0, 1);
        task.prompt = `Aufbereitete Bilanz: Anlagevermögen ${fmt(av)}, Eigenkapital ${fmt(ek)}, langfristiges Fremdkapital ${fmt(lfk)} Euro. Eine Maschine für ${fmt(loan)} Euro wird vollständig mit einem langfristigen Darlehen bezahlt. Berechne die Anlagendeckung II vor und nach dem Kauf.`;
        task.hint = "Der Kauf erhöht das Anlagevermögen und das langfristige Fremdkapital um denselben Betrag.";
        field("Anlagendeckung II vorher", r.coverage2, "%");
        field("Anlagendeckung II nachher", after.coverage2, "%");
      }
      break;
    }
    case "roe": {
      const start = rng.int(20, 90) * 5000,
        profit = rng.int(2, 40) * 1250,
        input = rng.int(0, 6) * 1000,
        output = rng.int(8, 30) * 1000;
      const roe = percentOf(toCents(profit), toCents(start));
      if (level === 1) {
        task.prompt = `Eigenkapital am 1. Januar ${fmt(start)} Euro, Jahresgewinn ${fmt(profit)} Euro. Berechne die Eigenkapitalrentabilität.`;
        task.hint = "Eigenkapitalrentabilität = Gewinn · 100 : Eigenkapital zu Beginn des Jahres.";
        field("Eigenkapitalrentabilität", roe, "%");
      } else {
        const end = start + profit + input - output;
        task.prompt = `Eigenkapital am 1. Januar ${fmt(start)} Euro, am 31. Dezember ${fmt(end)} Euro. Privateinlagen ${fmt(input)}, Privatentnahmen ${fmt(output)} Euro. Ermittle den Gewinn und die Eigenkapitalrentabilität.`;
        task.hint =
          "Zuerst den Gewinn aus der Eigenkapitalentwicklung zurückrechnen, dann Gewinn · 100 : Anfangskapital.";
        field("Gewinn", profit);
        field("Eigenkapitalrentabilität", roe, "%");
      }
      break;
    }
    case "trend": {
      const kfk1 = rng.int(50, 150) * 1000,
        fl1 = rng.int(5, 40) * 1000,
        kfk2 = rng.int(50, 150) * 1000,
        fl2 = rng.int(5, 40) * 1000;
      const a = percentOf(toCents(fl1), toCents(kfk1)),
        b = percentOf(toCents(fl2), toCents(kfk2));
      task.prompt =
        level === 1
          ? `Zeitvergleich der Möbelfabrik Lindner. Vorjahr: flüssige Mittel ${fmt(fl1)}, kurzfristiges Fremdkapital ${fmt(kfk1)} Euro. Berichtsjahr: flüssige Mittel ${fmt(fl2)}, kurzfristiges Fremdkapital ${fmt(kfk2)} Euro. Berechne die Barliquidität beider Jahre und die Veränderung in Prozentpunkten (Rückgang negativ).`
          : `Branchenvergleich: Der Branchendurchschnitt der Barliquidität liegt bei 20 %. Die Möbelfabrik Lindner hat flüssige Mittel von ${fmt(fl2)} Euro und kurzfristiges Fremdkapital von ${fmt(kfk2)} Euro. Berechne ihre Barliquidität und den Abstand zum Branchenwert in Prozentpunkten (darunter negativ).`;
      task.hint =
        "Barliquidität = flüssige Mittel · 100 : kurzfristiges FK. Prozentpunkte sind die Differenz zweier Prozentwerte.";
      if (level === 1) {
        field("Barliquidität Vorjahr", a, "%");
        field("Barliquidität Berichtsjahr", b, "%");
        field("Veränderung", money(b - a), "Prozentpunkte");
      } else {
        field("Barliquidität", b, "%");
        field("Abstand zum Branchenwert", money(b - 20), "Prozentpunkte");
      }
      break;
    }
    case "results": {
      const revenue = rng.int(400, 900) * 1000,
        neutralIncome = rng.int(2, 30) * 500,
        costs = rng.int(250, 380) * 1000,
        neutralExpense = rng.int(2, 40) * 500;
      if (level === 1) {
        task.prompt = `Im Rechnungskreis I stehen Erträge von ${fmt(revenue + neutralIncome)} Euro, davon ${fmt(neutralIncome)} Euro neutral, und Aufwendungen von ${fmt(costs + neutralExpense)} Euro, davon ${fmt(neutralExpense)} Euro neutral. Kosten und Zweckaufwand stimmen überein. Ermittle Gesamtergebnis, neutrales Ergebnis und Betriebsergebnis (Verluste negativ).`;
        task.hint =
          "Neutrales Ergebnis = neutrale Erträge − neutrale Aufwendungen; Betriebsergebnis = Leistungen − Kosten; beide zusammen ergeben das Gesamtergebnis.";
      } else {
        const interest = rng.int(1, 10) * 500,
          securities = neutralIncome - interest;
        task.prompt = `Salden (Euro): 5000 UEFE ${fmt(revenue)}, 5710 ZE ${fmt(interest)}, 5650 EAWP ${fmt(Math.max(securities, 0))}, 6000 AWR ${fmt(costs / 2)}, 6200 LG ${fmt(costs / 2)}, 6950 ABFO ${fmt(neutralExpense)}. Ordne nach dem ISB-Kontenplan neutral und betrieblich zu. Ermittle Gesamtergebnis, neutrales Ergebnis und Betriebsergebnis (Verluste negativ).`;
        task.hint =
          "ZE, EAWP und ABFO sind betriebsfremd oder außerordentlich und gehen nicht in die Kosten- und Leistungsrechnung ein.";
        const ni = interest + Math.max(securities, 0);
        field("Gesamtergebnis", revenue + ni - costs - neutralExpense);
        field("Neutrales Ergebnis", ni - neutralExpense);
        field("Betriebsergebnis", revenue - costs);
        break;
      }
      field("Gesamtergebnis", revenue + neutralIncome - costs - neutralExpense);
      field("Neutrales Ergebnis", neutralIncome - neutralExpense);
      field("Betriebsergebnis", revenue - costs);
      break;
    }
    case "imputed": {
      const years = rng.int(4, 10),
        cost = rng.int(5, 40) * 1000 * years,
        replacement = cost + rng.int(1, 10) * 1000 * years;
      const balance = cost / years,
        calc = replacement / years;
      if (level === 1) {
        task.prompt = `Eine Maschine kostete ${fmt(cost)} Euro, Nutzungsdauer ${years} Jahre, lineare Abschreibung. Eine gleichwertige neue Maschine würde heute ${fmt(replacement)} Euro kosten. Ermittle die bilanzielle und die kalkulatorische Abschreibung eines Jahres sowie ihren Unterschied.`;
        task.hint =
          "Bilanziell von den Anschaffungskosten, kalkulatorisch vom Wiederbeschaffungswert, jeweils geteilt durch die Nutzungsdauer.";
        field("Bilanzielle Abschreibung", balance);
        field("Kalkulatorische Abschreibung", calc);
        field("Unterschied (Anderskosten)", calc - balance);
      } else {
        const leistungen = rng.int(300, 700) * 1000,
          grund = rng.int(150, 250) * 1000,
          lohn = rng.int(4, 8) * 10000;
        task.prompt = `Leistungen ${fmt(leistungen)} Euro, Grundkosten ohne Abschreibung ${fmt(grund)} Euro. Bilanzielle Abschreibung ${fmt(balance)} Euro, kalkulatorische Abschreibung ${fmt(calc)} Euro. Die Inhaberin rechnet einen kalkulatorischen Unternehmerlohn von ${fmt(lohn)} Euro. Ermittle die gesamten Kosten und das Betriebsergebnis.`;
        task.hint =
          "In der Kosten- und Leistungsrechnung zählt die kalkulatorische statt der bilanziellen Abschreibung; der Unternehmerlohn kommt als Zusatzkosten hinzu.";
        field("Kosten", grund + calc + lohn);
        field("Betriebsergebnis", leistungen - grund - calc - lohn);
      }
      break;
    }
    case "key": {
      const areas = [rng.int(1, 6) * 50, rng.int(4, 16) * 50, rng.int(1, 4) * 50, rng.int(1, 4) * 50],
        sum = areas.reduce((s, x) => s + x, 0),
        perUnit = rng.int(2, 9),
        total = sum * perUnit;
      task.prompt =
        level === 1
          ? `Die Miete von ${fmt(total)} Euro wird nach Fläche verteilt: Material ${areas[0]} m², Fertigung ${areas[1]} m², Verwaltung ${areas[2]} m², Vertrieb ${areas[3]} m². Ermittle den Mietanteil je Quadratmeter und den Anteil der Fertigung.`
          : `Die Heizkosten von ${fmt(total)} Euro werden nach beheizter Fläche verteilt: Material ${areas[0]} m², Fertigung ${areas[1]} m², Verwaltung ${areas[2]} m², Vertrieb ${areas[3]} m². Ermittle die Anteile von Material und Verwaltung.`;
      task.hint = "Gemeinkosten ÷ Summe der Schlüsselwerte = Betrag je Einheit; dann mit dem Schlüssel der Kostenstelle multiplizieren.";
      if (level === 1) {
        field("Miete je m²", perUnit);
        field("Anteil Fertigung", areas[1] * perUnit);
      } else {
        field("Anteil Material", areas[0] * perUnit);
        field("Anteil Verwaltung", areas[2] * perUnit);
      }
      break;
    }
    case "bab": {
      const direct = [rng.int(4, 20) * 500, rng.int(20, 80) * 500, rng.int(6, 30) * 500, rng.int(4, 20) * 500],
        areas = [rng.int(1, 4) * 100, rng.int(4, 10) * 100, rng.int(1, 3) * 100, rng.int(1, 3) * 100],
        perArea = rng.int(2, 6),
        rent = areas.reduce((s, x) => s + x, 0) * perArea,
        kwh = [rng.int(1, 5) * 1000, rng.int(10, 40) * 1000, rng.int(1, 4) * 1000, rng.int(1, 3) * 1000],
        perKwh = level === 2 ? 0.25 : 0,
        power = kwh.reduce((s, x) => s + x, 0) * perKwh;
      const totals = direct.map((d, i) => d + areas[i] * perArea + kwh[i] * perKwh);
      task.prompt = `BAB der Möbelfabrik Lindner. Bereits verteilte Gemeinkosten: Material ${fmt(direct[0])}, Fertigung ${fmt(direct[1])}, Verwaltung ${fmt(direct[2])}, Vertrieb ${fmt(direct[3])} Euro. Noch zu verteilen: Miete ${fmt(rent)} Euro nach Fläche (${areas.join(" : ")} m²)${level === 2 ? ` und Strom ${fmt(power)} Euro nach Verbrauch (${kwh.map(fmtInt).join(" : ")} kWh)` : ""}. Ermittle die Gemeinkosten der Kostenstellen Material und Fertigung.`;
      task.hint = "Jede Gemeinkostenart mit ihrem eigenen Schlüssel verteilen und dann je Kostenstelle addieren.";
      field("Materialgemeinkosten", totals[0]);
      field("Fertigungsgemeinkosten", totals[1]);
      break;
    }
    case "rates": {
      const fm = rng.int(40, 200) * 1000,
        mgkRate = rng.int(4, 20) * 2.5,
        fl = rng.int(30, 150) * 1000,
        fgkRate = rng.int(8, 24) * 12.5,
        mgk = euro(mulDiv(toCents(fm), mgkRate, 100)),
        fgk = euro(mulDiv(toCents(fl), fgkRate, 100));
      if (level === 1) {
        task.prompt = `Aus dem BAB: Materialgemeinkosten ${fmt(mgk)} Euro bei Fertigungsmaterial ${fmt(fm)} Euro; Fertigungsgemeinkosten ${fmt(fgk)} Euro bei Fertigungslöhnen ${fmt(fl)} Euro. Berechne beide Zuschlagssätze.`;
        task.hint = "MGK-Zuschlag = MGK · 100 : FM; FGK-Zuschlag = FGK · 100 : FL.";
        field("MGK-Zuschlagssatz", mgkRate, "%");
        field("FGK-Zuschlagssatz", fgkRate, "%");
      } else {
        const hku = fm + mgk + fl + fgk,
          vwgk = rng.int(5, 25) * 1000,
          vtgk = rng.int(3, 20) * 1000;
        task.prompt = `Fertigungsmaterial ${fmt(fm)}, MGK ${fmt(mgk)}, Fertigungslöhne ${fmt(fl)}, FGK ${fmt(fgk)}, Verwaltungsgemeinkosten ${fmt(vwgk)}, Vertriebsgemeinkosten ${fmt(vtgk)} Euro. Keine Bestandsveränderungen. Berechne die Herstellkosten des Umsatzes sowie die Zuschlagssätze für Verwaltung und Vertrieb.`;
        task.hint =
          "Ohne Bestandsveränderungen sind die Herstellkosten des Umsatzes gleich MK + FK. VwGK- und VtGK-Zuschlag beziehen sich auf die HKU.";
        field("Herstellkosten des Umsatzes", hku);
        field("VwGK-Zuschlagssatz", percentOf(toCents(vwgk), toCents(hku)), "%");
        field("VtGK-Zuschlagssatz", percentOf(toCents(vtgk), toCents(hku)), "%");
      }
      break;
    }
    case "period": {
      const fm = rng.int(40, 160) * 1000,
        mgkRate = rng.int(2, 8) * 5,
        fl = rng.int(30, 120) * 1000,
        fgkRate = rng.int(4, 12) * 25,
        change = rng.int(1, 10) * 1000,
        more = rng.int(0, 1) === 1,
        vwRate = rng.int(2, 6) * 2.5,
        vtRate = rng.int(1, 4) * 2.5;
      const mk = toCents(fm) + mulDiv(toCents(fm), mgkRate, 100),
        fk = toCents(fl) + mulDiv(toCents(fl), fgkRate, 100),
        hke = mk + fk,
        hku = hke + (more ? -1 : 1) * toCents(change),
        sk =
          level === 1
            ? hke + mulDiv(hke, vwRate + vtRate, 100)
            : hku + mulDiv(hku, vwRate, 100) + mulDiv(hku, vtRate, 100);
      task.prompt =
        level === 1
          ? `Kostenträgerzeitrechnung für den Monat Mai: Fertigungsmaterial ${fmt(fm)} Euro, MGK ${mgkRate} %, Fertigungslöhne ${fmt(fl)} Euro, FGK ${fgkRate} %, gemeinsamer Zuschlag für Verwaltung und Vertrieb ${fmt(vwRate + vtRate)} %. Keine Bestandsveränderungen. Ermittle die Herstellkosten und die Selbstkosten.`
          : `Kostenträgerzeitrechnung für den Monat Mai: Fertigungsmaterial ${fmt(fm)} Euro, MGK ${mgkRate} %, Fertigungslöhne ${fmt(fl)} Euro, FGK ${fgkRate} %, ${more ? "Bestandsmehrung" : "Bestandsminderung"} an fertigen Erzeugnissen ${fmt(change)} Euro, VwGK ${fmt(vwRate)} %, VtGK ${fmt(vtRate)} %. Ermittle Herstellkosten der Erzeugung, Herstellkosten des Umsatzes und Selbstkosten des Umsatzes.`;
      task.hint =
        "HKE = MK + FK. Mehrbestand abziehen, Minderbestand addieren = HKU. Verwaltung und Vertrieb werden auf die HKU bezogen.";
      field(level === 1 ? "Herstellkosten" : "Herstellkosten der Erzeugung", euro(hke));
      if (level === 2) field("Herstellkosten des Umsatzes", euro(hku));
      field("Selbstkosten", euro(sk));
      break;
    }
    case "unitcost":
    case "offer": {
      const base: Parameters<typeof calculation>[0] = {
        fm: rng.int(8, 60) * 25,
        mgk: rng.int(2, 8) * 5,
        fl: rng.int(8, 40) * 25,
        fgk: rng.int(4, 12) * 25,
        sek: kind === "unitcost" && level === 2 ? rng.int(2, 12) * 25 : 0,
        vwvt: rng.int(2, 8) * 2.5,
        profit: rng.int(2, 6) * 5,
        discount: pick(rng, [2, 3]),
        rebate: pick(rng, [5, 10, 15, 20]),
      };
      const r = calculation(base);
      if (kind === "unitcost") {
        task.prompt = `Auftrag über einen Esstisch: Fertigungsmaterial ${fmt(base.fm)} Euro, MGK ${base.mgk} %, Fertigungslöhne ${fmt(base.fl)} Euro, FGK ${base.fgk} %${base.sek ? `, Sondereinzelkosten der Fertigung (Spezialwerkzeug) ${fmt(base.sek)} Euro` : ""}, Verwaltungs- und Vertriebsgemeinkosten ${fmt(base.vwvt)} %. Ermittle Materialkosten, Fertigungskosten, Herstellkosten und Selbstkosten.`;
        task.hint =
          "MK = FM + MGK; FK = FL + FGK + SEKF; HK = MK + FK; SK = HK + VwVtGK. Die FGK beziehen sich nur auf die Fertigungslöhne.";
        field("Materialkosten", r.mk);
        field("Fertigungskosten", r.fk);
        field("Herstellkosten", r.hk);
        field("Selbstkosten", r.sk);
      } else if (level === 1) {
        task.prompt = `Selbstkosten eines Esstischs ${fmt(r.sk)} Euro. Kalkuliert werden ${base.profit} % Gewinn, ${base.discount} % Kundenskonto und ${base.rebate} % Kundenrabatt. Ermittle Barverkaufspreis, Zielverkaufspreis und Listenverkaufspreis (Angebotspreis netto).`;
        task.hint =
          "Gewinn vom Hundert der Selbstkosten. Skonto und Rabatt im Hundert: ZVP = BVP · 100 : (100 − Skontosatz), LVP = ZVP · 100 : (100 − Rabattsatz).";
        field("Barverkaufspreis", r.bvp);
        field("Zielverkaufspreis", r.zvp);
        field("Listenverkaufspreis", r.lvp);
      } else {
        task.prompt = `Angebot für einen Esstisch: Fertigungsmaterial ${fmt(base.fm)} Euro, MGK ${base.mgk} %, Fertigungslöhne ${fmt(base.fl)} Euro, FGK ${base.fgk} %, VwVtGK ${fmt(base.vwvt)} %, Gewinn ${base.profit} %, Kundenskonto ${base.discount} %, Kundenrabatt ${base.rebate} %. Ermittle Selbstkosten und Listenverkaufspreis.`;
        task.hint =
          "Erst bis zu den Selbstkosten kalkulieren, dann Gewinn vom Hundert, Skonto und Rabatt im Hundert. Jeden Schritt auf Cent runden.";
        field("Selbstkosten", r.sk);
        field("Listenverkaufspreis", r.lvp);
      }
      break;
    }
    case "control": {
      const fl1 = rng.int(40, 80) * 1000,
        fl2 = fl1 + rng.int(-10, 10) * 1000,
        rate1 = rng.int(6, 12) * 25,
        rate2 = rate1 + pick(rng, [-25, -12.5, 12.5, 25, 37.5]),
        fgk1 = euro(mulDiv(toCents(fl1), rate1, 100)),
        fgk2 = euro(mulDiv(toCents(fl2), rate2, 100));
      if (level === 1) {
        task.prompt = `Kostenstelle Fertigung. Januar: Fertigungslöhne ${fmt(fl1)} Euro, Fertigungsgemeinkosten ${fmt(fgk1)} Euro. Februar: Fertigungslöhne ${fmt(fl2)} Euro, Fertigungsgemeinkosten ${fmt(fgk2)} Euro. Berechne beide FGK-Zuschlagssätze und die Veränderung in Prozentpunkten (Rückgang negativ).`;
        task.hint =
          "Absolute Gemeinkosten sagen wenig, wenn sich die Löhne ändern. Der Zuschlagssatz setzt beides ins Verhältnis.";
        field("FGK-Zuschlag Januar", rate1, "%");
        field("FGK-Zuschlag Februar", rate2, "%");
        field("Veränderung", rate2 - rate1, "Prozentpunkte");
      } else {
        const expected = euro(mulDiv(toCents(fl2), rate1, 100));
        task.prompt = `Im Januar betrug der FGK-Zuschlag ${fmt(rate1)} %. Im Februar fielen bei Fertigungslöhnen von ${fmt(fl2)} Euro Fertigungsgemeinkosten von ${fmt(fgk2)} Euro an. Ermittle, wie hoch die FGK im Februar beim Januar-Zuschlag gewesen wären, und die Abweichung der tatsächlichen FGK davon (Einsparung negativ).`;
        task.hint =
          "Den Januar-Zuschlag auf die Februar-Löhne anwenden und mit den tatsächlichen FGK vergleichen. Eine positive Abweichung heißt: weniger wirtschaftlich.";
        field("FGK beim Januar-Zuschlag", expected);
        field("Abweichung", fgk2 - expected);
      }
      break;
    }
    case "fixvar": {
      const kf = rng.int(10, 60) * 1000,
        kv = rng.int(10, 80),
        x1 = rng.int(1, 4) * 500,
        x2 = x1 * 2;
      task.prompt =
        level === 1
          ? `Fixkosten ${fmt(kf)} Euro im Monat, variable Kosten ${fmt(kv)} Euro je Stück. Ermittle die Gesamtkosten und die Stückkosten bei ${fmtInt(x1)} Stück.`
          : `Fixkosten ${fmt(kf)} Euro im Monat, variable Kosten ${fmt(kv)} Euro je Stück. Ermittle die Stückkosten bei ${fmtInt(x1)} und bei ${fmtInt(x2)} Stück.`;
      task.hint = "Gesamtkosten = Fixkosten + variable Stückkosten · Menge; Stückkosten = Gesamtkosten : Menge.";
      if (level === 1) {
        field("Gesamtkosten", kf + kv * x1);
        field("Stückkosten", euro(mulDiv(toCents(kf + kv * x1), 1, x1)));
      } else {
        field(`Stückkosten bei ${fmtInt(x1)} Stück`, euro(mulDiv(toCents(kf + kv * x1), 1, x1)));
        field(`Stückkosten bei ${fmtInt(x2)} Stück`, euro(mulDiv(toCents(kf + kv * x2), 1, x2)));
      }
      break;
    }
    case "db": {
      const kv = rng.int(20, 120),
        p = kv + rng.int(5, 60),
        x = rng.int(4, 30) * 100,
        kf = rng.int(20, 120) * 1000;
      task.prompt =
        level === 1
          ? `Ein Stuhl wird für ${fmt(p)} Euro netto verkauft; die variablen Kosten betragen ${fmt(kv)} Euro je Stück. Verkauft werden ${fmtInt(x)} Stück, die Fixkosten betragen ${fmt(kf)} Euro. Ermittle Stückdeckungsbeitrag, Gesamtdeckungsbeitrag und Betriebsergebnis (Verlust negativ).`
          : `Nettoverkaufserlöse ${fmt(p * x)} Euro für ${fmtInt(x)} Stühle, variable Kosten insgesamt ${fmt(kv * x)} Euro, Fixkosten ${fmt(kf)} Euro. Ermittle Stückdeckungsbeitrag, Gesamtdeckungsbeitrag und Betriebsergebnis (Verlust negativ).`;
      task.hint = "db = Preis − variable Stückkosten; DB = db · Menge; Betriebsergebnis = DB − Fixkosten.";
      field("Stückdeckungsbeitrag", p - kv);
      field("Gesamtdeckungsbeitrag", (p - kv) * x);
      field("Betriebsergebnis", (p - kv) * x - kf);
      break;
    }
    case "breakeven": {
      const kv = rng.int(20, 120),
        p = kv + rng.int(7, 60),
        kf = rng.int(20, 150) * 1000 + rng.int(0, 1) * rng.int(1, 999);
      const be = breakEven(kf, p, kv);
      task.prompt =
        level === 1
          ? `Fixkosten ${fmt(kf)} Euro, Nettoverkaufspreis ${fmt(p)} Euro, variable Kosten ${fmt(kv)} Euro je Stück. Ermittle den Stückdeckungsbeitrag und die Gewinnschwellenmenge.`
          : `Fixkosten ${fmt(kf)} Euro, Nettoverkaufspreis ${fmt(p)} Euro, variable Kosten ${fmt(kv)} Euro je Stück. Ermittle die Gewinnschwellenmenge und das Betriebsergebnis bei genau dieser Menge.`;
      task.hint =
        "Gewinnschwellenmenge = Fixkosten : Stückdeckungsbeitrag, immer auf ganze Stück aufrunden. Abrunden würde einen Verlust lassen.";
      if (level === 1) field("Stückdeckungsbeitrag", be.db);
      field("Gewinnschwellenmenge", be.quantity, "Stück");
      if (level === 2) field("Betriebsergebnis", (p - kv) * be.quantity - kf);
      break;
    }
    case "pricechange": {
      const kv = rng.int(20, 80),
        db = rng.int(4, 12) * 5,
        p = kv + db,
        kf = db * rng.int(10, 60) * 100,
        cut = level === 1 ? 5 : pick(rng, [10, 15]);
      const newP = euro(mulDiv(toCents(p), 100 - cut, 100)),
        after = breakEven(kf, newP, kv);
      task.prompt = `Ein Regal kostet netto ${fmt(p)} Euro, die variablen Kosten betragen ${fmt(kv)} Euro je Stück, die Fixkosten ${fmt(kf)} Euro. Für eine Verkaufsaktion wird der Preis um ${cut} % gesenkt. Ermittle die alte Gewinnschwellenmenge, den neuen Stückdeckungsbeitrag und die neue Gewinnschwellenmenge.`;
      task.hint =
        "Eine Preissenkung verringert den Stückdeckungsbeitrag um den vollen Nachlass; die Fixkosten bleiben. Gewinnschwellenmengen aufrunden.";
      const before = breakEven(kf, p, kv).quantity;
      field("Alte Gewinnschwellenmenge", before, "Stück");
      field("Neuer Stückdeckungsbeitrag", after.db);
      field("Neue Gewinnschwellenmenge", after.quantity, "Stück");
      if (level === 2) {
        task.prompt += " Wie viele Stück muss Lindner zusätzlich verkaufen, nur um wieder die Gewinnschwelle zu erreichen?";
        field("Zusätzliche Menge", after.quantity - before, "Stück");
      }
      break;
    }
    case "twoproducts": {
      const a = { kv: rng.int(20, 90), x: rng.int(5, 40) * 100 },
        b = { kv: rng.int(40, 200), x: rng.int(2, 20) * 100 };
      const pa = a.kv + rng.int(5, 50),
        pb = b.kv + rng.int(10, 90),
        kf = rng.int(60, 300) * 1000;
      task.prompt = `Zweiproduktunternehmen. Stuhl: Preis ${fmt(pa)} Euro, variable Kosten ${fmt(a.kv)} Euro, Absatz ${fmtInt(a.x)} Stück. Tisch: Preis ${fmt(pb)} Euro, variable Kosten ${fmt(b.kv)} Euro, Absatz ${fmtInt(b.x)} Stück. Gemeinsame Fixkosten ${fmt(kf)} Euro. Ermittle die Gesamtdeckungsbeiträge beider Produkte und das Betriebsergebnis (Verlust negativ).`;
      task.hint =
        "Je Produkt db · Menge. Die Fixkosten werden erst von der Summe der Deckungsbeiträge abgezogen, nicht auf die Produkte verteilt.";
      field("Deckungsbeitrag Stühle", (pa - a.kv) * a.x);
      field("Deckungsbeitrag Tische", (pb - b.kv) * b.x);
      field("Betriebsergebnis", (pa - a.kv) * a.x + (pb - b.kv) * b.x - kf);
      if (level === 2) {
        task.prompt += " Ermittle zusätzlich, um wie viel Euro der Deckungsbeitrag je Tisch höher ist als je Stuhl (niedriger negativ).";
        field("Unterschied der Stückdeckungsbeiträge", pb - b.kv - (pa - a.kv));
      }
      break;
    }
    case "program": {
      const goods = [
        { name: "Stühle", db: rng.int(5, 40), x: rng.int(10, 40) * 100 },
        { name: "Tische", db: rng.int(20, 90), x: rng.int(3, 15) * 100 },
        { name: "Hocker", db: -rng.int(1, 6), x: rng.int(5, 20) * 100 },
      ];
      const kf = rng.int(30, 120) * 1000,
        total = goods.reduce((s, g) => s + g.db * g.x, 0);
      task.prompt = `Stückdeckungsbeiträge: Stühle ${fmt(goods[0].db)} Euro bei ${fmtInt(goods[0].x)} Stück, Tische ${fmt(goods[1].db)} Euro bei ${fmtInt(goods[1].x)} Stück, Hocker ${fmt(goods[2].db)} Euro bei ${fmtInt(goods[2].x)} Stück. Fixkosten ${fmt(kf)} Euro, die kurzfristig unverändert bleiben. Ermittle das Betriebsergebnis mit allen drei Produkten und nach Streichung des Produkts mit negativem Deckungsbeitrag (Verluste negativ).`;
      task.hint =
        "Ein Produkt mit negativem Stückdeckungsbeitrag senkt das Ergebnis mit jedem Stück. Beim Streichen fallen nur seine variablen Kosten und Erlöse weg, nicht die Fixkosten.";
      field("Betriebsergebnis mit allen Produkten", total - kf);
      field("Betriebsergebnis ohne Hocker", total - goods[2].db * goods[2].x - kf);
      if (level === 2) {
        task.prompt += " Ermittle außerdem die Verbesserung durch die Streichung.";
        field("Verbesserung", -goods[2].db * goods[2].x);
      }
      break;
    }
    case "extra": {
      const kv = rng.int(30, 90),
        fixedPerUnit = rng.int(10, 40),
        offer = kv + rng.int(-8, 15),
        q = rng.int(2, 10) * 100;
      task.prompt =
        level === 1
          ? `Die Möbelfabrik hat freie Kapazitäten. Ein Hotel bietet für ${fmtInt(q)} Stühle ${fmt(offer)} Euro je Stück. Die variablen Kosten betragen ${fmt(kv)} Euro je Stück; die Fixkosten ändern sich durch den Auftrag nicht. Ermittle den Stückdeckungsbeitrag und die Veränderung des Betriebsergebnisses (Verschlechterung negativ).`
          : `Bei voller Kalkulation kostet ein Stuhl ${fmt(kv + fixedPerUnit)} Euro (davon ${fmt(kv)} Euro variable Kosten). Ein Hotel bietet für ${fmtInt(q)} Stühle ${fmt(offer)} Euro je Stück; freie Kapazitäten sind vorhanden, die Fixkosten bleiben gleich. Ermittle den Verlust je Stück nach Vollkostenrechnung (negativ) und die tatsächliche Veränderung des Betriebsergebnisses.`;
      task.hint =
        "Entscheidend sind die zusätzlichen Erlöse und die zusätzlichen variablen Kosten. Fixkosten fallen ohnehin an.";
      if (level === 1) field("Stückdeckungsbeitrag", offer - kv);
      else field("Ergebnis je Stück nach Vollkosten", offer - kv - fixedPerUnit);
      field("Veränderung Betriebsergebnis", (offer - kv) * q);
      break;
    }
    case "floor": {
      const kv = rng.int(20, 120),
        x = rng.int(2, 20) * 500,
        kf = x * rng.int(4, 40);
      task.prompt =
        level === 1
          ? `Variable Kosten ${fmt(kv)} Euro je Stück, Fixkosten ${fmt(kf)} Euro bei einer Absatzmenge von ${fmtInt(x)} Stück. Ermittle die kurzfristige und die langfristige Preisuntergrenze je Stück.`
          : `Variable Kosten insgesamt ${fmt(kv * x)} Euro, Fixkosten ${fmt(kf)} Euro, Absatzmenge ${fmtInt(x)} Stück. Ermittle die kurzfristige und die langfristige Preisuntergrenze je Stück.`;
      task.hint =
        "Kurzfristig müssen nur die variablen Stückkosten gedeckt sein (db = 0); langfristig alle Kosten je Stück (Betriebsergebnis = 0).";
      field("Kurzfristige Preisuntergrenze", kv);
      field("Langfristige Preisuntergrenze", kv + kf / x);
      break;
    }
    case "makebuy": {
      const kv = rng.int(5, 40),
        ep = kv + rng.int(2, 20),
        critical = rng.int(2, 30) * 100,
        kf = critical * (ep - kv),
        x = rng.int(1, 40) * 100,
        r = makeOrBuy(kf, kv, ep, x);
      task.prompt =
        level === 1
          ? `Eigenfertigung eines Beschlags: Fixkosten ${fmt(kf)} Euro, variable Kosten ${fmt(kv)} Euro je Stück. Fremdbezug: Einstandspreis ${fmt(ep)} Euro je Stück. Benötigt werden ${fmtInt(x)} Stück. Ermittle die Kosten beider Möglichkeiten.`
          : `Eigenfertigung eines Beschlags: Fixkosten ${fmt(kf)} Euro, variable Kosten ${fmt(kv)} Euro je Stück. Fremdbezug: Einstandspreis ${fmt(ep)} Euro je Stück. Ermittle die kritische Menge und die Kosten beider Möglichkeiten bei ${fmtInt(x)} Stück.`;
      task.hint =
        "Make = Fixkosten + kv · Menge; Buy = Einstandspreis · Menge. Kritische Menge = Fixkosten : (Einstandspreis − kv).";
      if (level === 2) field("Kritische Menge", r.critical, "Stück");
      field("Kosten Eigenfertigung", r.make);
      field("Kosten Fremdbezug", r.buy);
      break;
    }
    case "vat": {
      const net = rng.int(4, 90) * 50,
        vat = euro(mulDiv(toCents(net), 19, 100));
      task.prompt =
        level === 1
          ? `Eine Reparaturrechnung lautet über ${fmt(net)} Euro netto plus 19 Prozent Umsatzsteuer, Zahlung später. Ermittle Vorsteuer und Bruttobetrag und buche den Rechnungseingang auf 6160 FRI.`
          : `Eine Reparaturrechnung lautet über ${fmt(money(net + vat))} Euro brutto einschließlich 19 Prozent Umsatzsteuer, Zahlung später. Ermittle Nettobetrag und Vorsteuer und buche den Rechnungseingang auf 6160 FRI.`;
      task.hint = "Netto = Brutto · 100 : 119; Vorsteuer = Netto · 19 : 100. Aufwand und Vorsteuer im Soll, VE brutto im Haben.";
      if (level === 1) {
        field("Vorsteuer", vat);
        field("Bruttobetrag", net + vat);
      } else {
        field("Nettobetrag", net);
        field("Vorsteuer", vat);
      }
      book(D("6160", net), D("2600", vat), C("4400", net + vat));
      break;
    }
    case "percent": {
      const bvp = rng.int(40, 400) * 5,
        s = pick(rng, [2, 3, 4]),
        r = pick(rng, [5, 10, 20, 25]),
        zvp = euro(mulDiv(toCents(bvp), 100, 100 - s)),
        lvp = euro(mulDiv(toCents(zvp), 100, 100 - r));
      task.prompt =
        level === 1
          ? `Der Barverkaufspreis beträgt ${fmt(bvp)} Euro. Der Kunde darf ${s} % Skonto abziehen. Ermittle den Zielverkaufspreis (Skonto im Hundert).`
          : `Der Barverkaufspreis beträgt ${fmt(bvp)} Euro. Der Kunde erhält ${r} % Rabatt und darf ${s} % Skonto abziehen. Ermittle Zielverkaufspreis und Listenverkaufspreis.`;
      task.hint =
        "Skonto wird vom Zielverkaufspreis abgezogen. Der BVP entspricht also (100 − Skontosatz) %, gesucht sind 100 %.";
      field("Zielverkaufspreis", zvp);
      if (level === 2) field("Listenverkaufspreis", lvp);
      break;
    }
  }
  const numeric = task.fields
    .map((f) => `${f.label}: ${f.unit === "Stück" ? fmtInt(f.answer) : fmt(f.answer)} ${f.unit}.`)
    .join(" ");
  const booking = task.booking
    .map((e) => `${e.side === "debit" ? "Soll" : "Haben"}: ${e.account} ${fmt(e.amount)} Euro`)
    .join("; ");
  task.solution = `${numeric} ${booking}${booking ? "." : ""} ${task.hint}`.trim();
  return task;
}
