import type { Entry, Exercise, Level, PracticeKind } from "../model/types";
import { claimAmounts, fmt, loanSchedule, money, supplierCredit } from "../finance";
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

export function makeExercise(kind: PracticeKind, rng: Rng, level: Level): Exercise {
  const n = rng.int(10, 80) * 100,
    rate = rng.int(3, 9),
    years = rng.int(2, 8),
    units = rng.int(10, 80);
  const task: Exercise = { prompt: "", hint: "", fields: [], booking: [], solution: "" };
  const field = (label: string, answer: number, unit = "Euro") =>
    task.fields.push({ label, answer: money(answer), unit });
  const book = (...rows: Entry[]) => {
    task.booking = rows;
  };
  switch (kind) {
    case "private": {
      const deposit = level === 2;
      task.prompt = `Die Inhaberin ${deposit ? "legt privates Geld auf das Geschäftskonto ein" : "entnimmt Geld vom Geschäftskonto für private Zwecke"}: ${fmt(n)} Euro. Buche den reinen Geldvorgang.`;
      task.hint = "Privatkonto und Bank verwenden; kein Aufwand und keine Umsatzsteuer.";
      book(D(deposit ? "2800" : "3001", n), C(deposit ? "3001" : "2800", n));
      break;
    }
    case "equity": {
      const start = n * 5,
        gain = n,
        input = level === 2 ? n * 1.5 : units * 10,
        output = level === 2 ? n : n * 1.5;
      const end = start + gain + input - output;
      task.prompt = `Anfangskapital ${fmt(start)}, ${level === 1 ? `Gewinn ${fmt(gain)}` : `Endkapital ${fmt(end)}`}, Einlagen ${fmt(input)}, Entnahmen ${fmt(output)} Euro. Bestimme ${level === 1 ? "das Endkapital" : "den Gewinn"} und buche nur den Abschluss des Privatkontos über 3000 EK.`;
      task.hint = "Endkapital = Anfangskapital + Gewinn + Einlagen − Entnahmen.";
      field(level === 1 ? "Endkapital" : "Gewinn", level === 1 ? end : gain);
      const balance = Math.abs(input - output);
      book(
        D(input > output ? "3001" : "3000", balance),
        C(input > output ? "3000" : "3001", balance),
      );
      break;
    }
    case "purchase": {
      const discount = level === 2 ? 10 : 0,
        extra = units * 10;
      const ak = n * 10 * (1 - discount / 100) + extra,
        vat = money(ak * 0.19);
      task.prompt = `Maschinenkauf auf Ziel: Listenpreis ${fmt(n * 10)} Euro netto, ${discount} Prozent Rabatt auf den Listenpreis, notwendige Montage ${fmt(extra)} Euro netto. Alle Positionen 19 Prozent, voller Vorsteuerabzug. Ermittle die Anschaffungskosten und buche die gesamte Rechnung.`;
      task.hint = "Rabatt nur vom Listenpreis abziehen; Montage addieren; Steuer getrennt.";
      field("Anschaffungskosten", ak);
      book(D("0700", ak), D("2600", vat), C("4400", ak + vat));
      break;
    }
    case "land": {
      const price = n * 100,
        extras = price * 0.1,
        share = rng.int(2, 4) * 10;
      task.prompt = `Immobilienkauf ${fmt(price)} Euro, gemeinsame Nebenkosten ${fmt(extras)} Euro. Laut Wertaufteilung entfallen ${share} Prozent auf Boden, der Rest auf Gebäude. Keine Umsatzsteuer im Fall. Bestimme den abschreibbaren Gebäudeanteil.`;
      task.hint = "Kaufpreis und gemeinsame Kosten nach dem vorgegebenen Wertverhältnis aufteilen.";
      field("Gebäudeanteil", ((price + extras) * (100 - share)) / 100);
      break;
    }
    case "depreciation":
    case "partial":
    case "depreciationBooking": {
      const ak = n * years,
        months = kind === "partial" ? rng.int(2, 10) : 12;
      const amount = money((n * months) / 12);
      task.prompt = `Maschine: ${fmt(ak)} Euro Anschaffungskosten, ${years} Jahre, linear, kein Restwert. ${kind === "partial" ? `Anschaffung und Betriebsbereitschaft im Monat ${13 - months}; Anschaffungsmonat zählt.` : "Nutzung das volle Jahr."} Ermittle die AfA dieses Jahres${level === 2 || kind === "depreciationBooking" ? " und buche sie direkt" : ""}.`;
      task.hint = "Jahres-AfA = Kosten / Jahre; gegebenenfalls Monate / 12 anwenden.";
      field("AfA", amount);
      if (level === 2 || kind === "depreciationBooking") book(D("6520", amount), C("0700", amount));
      break;
    }
    case "gwg": {
      const value = [250, 250.01, 600, 800, 800.01][rng.int(0, 4)];
      const account = value <= 250 ? "6800" : value <= 800 ? "0890" : "0860";
      if (level === 2) {
        const balance = rng.int(1, 10) * 100;
        task.prompt = `Das Konto 0890 GWG enthält am Jahresende ${fmt(balance)} Euro neu angeschaffte, selbständig nutzbare GWG nach der ISB-Schuleinteilung. Alle sind in diesem Anschaffungsjahr vollständig abzuschreiben. Buche nur die Abschreibung.`;
        task.hint =
          "Gesamten Kontensaldo über 6540 ABGWG an 0890 GWG abschreiben, ohne neue Vorsteuer.";
        book(D("6540", balance), C("0890", balance));
        break;
      }
      task.prompt = `Eine selbständig nutzbare, bewegliche, abnutzbare Büromaschine kostet ${fmt(value)} Euro netto plus 19 Prozent. Zahlung per Bank; voller Vorsteuerabzug. Buche den Kauf nach der ISB-Schuleinteilung (bis 250 BMK, bis 800 GWG, darüber BM).`;
      task.hint = "Sachliche Voraussetzungen sind erfüllt; Grenzwerte einschließlich prüfen.";
      const vat = money(value * 0.19);
      book(D(account, value), D("2600", vat), C("2800", value + vat));
      break;
    }
    case "running": {
      const mode = rng.int(0, 2);
      if (mode > 0) {
        const account = mode === 1 ? "6700" : "6900";
        task.prompt = `Der Betrieb zahlt ${mode === 1 ? "eine laut Beleg umsatzsteuerfreie Hallenmiete" : "einen Versicherungsbeitrag einschließlich Versicherungssteuer, aber ohne Umsatzsteuer"} von ${fmt(n)} Euro per Bank. Buche die Zahlung.`;
        task.hint =
          mode === 1
            ? "Mietaufwand auf 6700 AWMP; bei ausdrücklich umsatzsteuerfreiem Beleg keine Vorsteuer."
            : "Versicherungsaufwand auf 6900 VBEI; Versicherungssteuer ist keine Vorsteuer.";
        book(D(account, n), C("2800", n));
        break;
      }
      task.prompt = `Erhaltungsreparatur ohne Erweiterung: ${fmt(n)} Euro netto und 19 Prozent Vorsteuer, Zahlung per Bank. Buche bei vollem Vorsteuerabzug.`;
      task.hint = "Erhaltungsreparatur auf 6160 FRI, keine neue Anlage.";
      const vat = money(n * 0.19);
      book(D("6160", n), D("2600", vat), C("2800", n + vat));
      break;
    }
    case "costs": {
      const a = n * years,
        b = a + n,
        runA = n,
        runB = n * 0.6;
      task.prompt = `Zwei gleich leistungsfähige Maschinen: A kostet ${fmt(a)} Euro, B ${fmt(b)} Euro. Beide ${years} Jahre Nutzungsdauer ohne Restwert. Jährliche Betriebskosten A ${fmt(runA)}, B ${fmt(runB)} Euro. Ohne Zinsen und weitere Kosten: Ermittle beide jährlichen Gesamtkosten.`;
      task.hint = "Je Maschine lineare Abschreibung plus laufende Jahreskosten.";
      field("Jahreskosten A", a / years + runA);
      field("Jahreskosten B", b / years + runB);
      break;
    }
    case "payback": {
      const ak = n * years,
        gain = n * 0.5,
        depreciation = n * 0.5;
      task.prompt = `Investitionsauszahlung ${fmt(ak)} Euro. Jährlich konstant ${fmt(gain)} Euro Gewinn nach ${fmt(depreciation)} Euro Abschreibung. Vereinfacht keine weiteren nicht zahlungswirksamen Posten. Bestimme Rückfluss und Amortisationsdauer.`;
      task.hint = "Abschreibung zum Gewinn zurückaddieren; Auszahlung / Rückfluss.";
      field("Rückfluss pro Jahr", gain + depreciation);
      field("Amortisationsdauer", ak / (gain + depreciation), "Jahre");
      break;
    }
    case "ratio": {
      const own = n * rng.int(1, 4),
        foreign = n * rng.int(2, 7);
      task.prompt = `Eigenkapital ${fmt(own)}, Fremdkapital ${fmt(foreign)} Euro. Ermittle die Eigenkapitalquote.`;
      task.hint = "Gesamtkapital = Eigenkapital + Fremdkapital.";
      field("Eigenkapitalquote", (own / (own + foreign)) * 100, "%");
      break;
    }
    case "payout": {
      const nominal = n * 10,
        discount = money(nominal * 0.02);
      task.prompt = `Langfristiger Kredit nominal ${fmt(nominal)} Euro, Disagio 2 Prozent, keine weiteren Abzüge. Das Disagio wird in diesem Schulfall sofort als Zinsaufwand behandelt. Ermittle die Auszahlung und buche die Kreditaufnahme.`;
      task.hint = "Die neue Schuld ist der volle Nominalbetrag.";
      field("Auszahlung", nominal - discount);
      book(D("2800", nominal - discount), D("7510", discount), C("4250", nominal));
      break;
    }
    case "interest":
    case "deposit": {
      if (kind === "deposit" && rng.int(0, 1) === 1) {
        task.prompt = `Für eine betriebliche Immobilie gehen ${fmt(n)} Euro Miete per Bank ein. Die Aufgabe erklärt diese Vermietung ausdrücklich für umsatzsteuerfrei. Buche den Mietertrag.`;
        task.hint = "Bank im Soll, 5400 EMP im Haben; hier keine Umsatzsteuer.";
        book(D("2800", n), C("5400", n));
        break;
      }
      const days = rng.int(1, 6) * 30,
        interest = money((n * rate * days) / 36000);
      task.prompt = `${kind === "deposit" ? "Geldanlage" : "Kreditschuld"} ${fmt(n)} Euro, ${rate} Prozent jährlich, ${days} Tage, einfache 360-Tage-Rechnung ohne Zinseszins oder Gebühren. Ermittle die Zinsen${kind === "deposit" ? " und buche deren Gutschrift ohne Steuerabzüge" : ""}.`;
      task.hint = "Kapital × Prozentzahl × Tage / 36.000.";
      field("Zinsen", interest);
      if (kind === "deposit") book(D("2800", interest), C("5710", interest));
      break;
    }
    case "loan": {
      const rows = loanSchedule(n * years, rate, years, level === 1 ? "instalment" : "annuity"),
        index = level === 1 ? 1 : 0;
      task.prompt = `${level === 1 ? "Abzahlungsdarlehen mit gleichen jährlichen Tilgungen" : "Annuitätendarlehen"}: ${fmt(n * years)} Euro, ${rate} Prozent, ${years} Jahre, jährliche Zahlungen am Jahresende. ${level === 2 ? `Die konstante Jahresrate beträgt ${fmt(rows[0].payment)} Euro. ` : ""}Bestimme Zinsen und Tilgung im Jahr ${index + 1}.`;
      task.hint =
        "Zinsen auf die Schuld zu Jahresbeginn; beim Abzahlungsdarlehen gleiche Tilgung, bei Annuität Rate minus Zins.";
      field("Zinsanteil", rows[index].interest);
      field("Tilgungsanteil", rows[index].redemption);
      break;
    }
    case "effective": {
      const nominal = n * 10,
        payout = nominal * 0.98,
        costs = ((nominal * rate) / 100) * years + nominal * 0.02;
      task.prompt = `Endfälliger Schulvergleich: nominal ${fmt(nominal)}, Auszahlung ${fmt(payout)}, ${years} Jahre, gesamte Kreditkosten einschließlich Disagio ${fmt(costs)} Euro. Bestimme die einfache Jahreskostenquote (kein gesetzlicher Effektivzins).`;
      task.hint = "Gesamtkosten / tatsächliche Auszahlung × 100 / Jahre.";
      field("Jährliche Näherung", ((costs / payout) * 100) / years, "%");
      break;
    }
    case "repayment": {
      const interest = money(n * 0.05);
      task.prompt = `Schuldendienst für langfristigen Kredit: ${fmt(n)} Euro Tilgung und ${fmt(interest)} Euro Zinsen per Bank. Keine Gebühren. Buche die Gesamtzahlung.`;
      task.hint = "Tilgung vermindert 4250 LBKV, Zins ist Aufwand auf 7510 ZAW.";
      book(D("4250", n), D("7510", interest), C("2800", n + interest));
      break;
    }
    case "supplier": {
      const extra = rng.int(1, 4) * 10,
        result = supplierCredit(n, 2, rate, extra);
      task.prompt = `Nettovergleich bei vollständigem Vorsteuerabzug: Rechnung ${fmt(n)} Euro netto; 2 Prozent Skonto in 10 Tagen, sonst Zahlung nach ${10 + extra} Tagen. Kontokorrent ${rate} Prozent auf den Nettozahlbetrag nach Skonto, 360-Tage-Basis. Bestimme Nettoskonto, Kreditzinsen und Vorteil der frühen Zahlung (gegebenenfalls negativ).`;
      task.hint =
        "Nur die zusätzlichen Tage finanzieren. Nettozahlbetrag = Nettorechnung minus Skonto.";
      field("Nettoskonto", result.saving);
      field("Kreditzinsen", result.interest);
      field("Vorteil frühe Zahlung", result.advantage);
      break;
    }
    case "stockbuy": {
      const price = rng.int(20, 90),
        fees = rng.int(1, 5) * 10,
        ak = units * price + fees;
      task.prompt = `${units} Aktien für das Anlagevermögen zu ${fmt(price)} Euro je Stück, unmittelbare Kaufkosten ${fmt(fees)} Euro als Endbetrag ohne gesonderte Vorsteuer. Zahlung per Bank. Ermittle die Anschaffungskosten und buche.`;
      task.hint = "Kurswert plus Kaufkosten auf 1500 WP.";
      field("Anschaffungskosten", ak);
      book(D("1500", ak), C("2800", ak));
      break;
    }
    case "dividend": {
      if (rng.int(0, 1) === 1) {
        task.prompt = `Die Bank belastet laufende Depotgebühren von ${fmt(units)} Euro als endgültigen Abrechnungsbetrag ohne gesonderte Umsatzsteuer. Buche die Gebühr, keinen neuen Wertpapierkauf.`;
        task.hint = "Laufende Depotverwaltung: 6750 KGV an 2800 BK.";
        book(D("6750", units), C("2800", units));
        break;
      }
      const perShare = rng.int(1, 4),
        result = units * perShare;
      task.prompt = `Für ${units} Aktien werden ${fmt(perShare)} Euro Dividende je Stück gutgeschrieben. In diesem Fall keine Steuern und Gebühren. Ermittle den Ertrag und buche die Gutschrift.`;
      task.hint = "Stückzahl × Ausschüttung; Dividende auf 5780 DDE.";
      field("Dividendenertrag", result);
      book(D("2800", result), C("5780", result));
      break;
    }
    case "stocksell": {
      const bookValue = n,
        gross = money(n * (level === 1 ? 1.2 : 0.8)),
        fees = units,
        net = gross - fees,
        gain = net - bookValue;
      task.prompt = `Verkauf einer Finanzanlage: Buchwert ${fmt(bookValue)}, Kurswert des Verkaufs ${fmt(gross)}, Verkaufskosten ${fmt(fees)} Euro als Endbetrag ohne gesonderte Vorsteuer. Ermittle Nettoerlös und Erfolg (Verlust negativ); buche den Verkauf per Bank.`;
      task.hint = "Nettoerlös = Kurswert − Verkaufskosten; Erfolg = Nettoerlös − Buchwert.";
      field("Nettoerlös", net);
      field("Verkaufserfolg", gain);
      book(
        D("2800", net),
        ...(gain < 0 ? [D("7460", -gain)] : []),
        C("1500", bookValue),
        ...(gain > 0 ? [C("5650", gain)] : []),
      );
      break;
    }
    case "overdue": {
      const days = rng.int(1, 3) * 30,
        interest = money((n * rate * days) / 36000),
        fee = 5;
      task.prompt = `Verzug ist rechtlich bereits festgestellt. Forderung ${fmt(n)} Euro; vorgegebener Verzugszins ${rate} Prozent, ${days} Tage, ausdrücklich 360-Tage-Schulmodell. Ersatzfähige Mahnkosten 5 Euro. Buche nur die zusätzliche Forderung aus Zinsen und Mahnkosten, beide ohne Umsatzsteuer.`;
      task.hint =
        "Zinsen auf 5710 ZE, Mahnkostenersatz auf 5430 ASBE, zusätzliche Forderung auf 2400 FO.";
      book(D("2400", interest + fee), C("5710", interest), C("5430", fee));
      break;
    }
    case "doubtful": {
      task.prompt = `Eine Forderung von ${fmt(n * 1.19)} Euro brutto wird wegen konkreten Einzelrisikos zweifelhaft. Buche nur die Umbuchung von FO auf ZWFO, keine Wertberichtigung.`;
      task.hint = "Voller Bruttobetrag; keine Umsatzsteuerkorrektur.";
      book(D("2470", n * 1.19), C("2400", n * 1.19));
      break;
    }
    case "writeoff": {
      const percent = level === 1 ? 100 : 40,
        amounts = claimAmounts(n * 1.19, 19, percent);
      task.prompt = `Eine Forderung über ${fmt(n * 1.19)} Euro brutto (19 Prozent) steht auf 2470 ZWFO. ${percent} Prozent sind jetzt endgültig uneinbringlich, kein EWB-Altbestand. Buche nur den endgültig ausgefallenen Teil; der Rest bleibt vorerst offen.`;
      task.hint = "Ausgefallenen Bruttoteil in Nettoverlust und Umsatzsteuerkorrektur zerlegen.";
      book(
        D("6950", amounts.netLoss),
        D("4800", amounts.taxCorrection),
        C("2470", amounts.grossLoss),
      );
      break;
    }
    case "recovery": {
      task.prompt = `Nach vollständiger Abschreibung gehen ${fmt(n * 1.19)} Euro auf eine zuvor mit 19 Prozent versteuerte Forderung ein. Buche den späten Bankeingang.`;
      task.hint = "Nettoertrag auf 5495 EFO und erneut Umsatzsteuer auf 4800 UST.";
      book(D("2800", n * 1.19), C("5495", n), C("4800", n * 0.19));
      break;
    }
    case "ewb":
    case "pwb": {
      const percent = kind === "ewb" ? rng.int(2, 6) * 10 : rng.int(1, 3);
      task.prompt = `${kind === "ewb" ? "Zweifelhafte" : "Bereits um zweifelhafte und uneinbringliche Posten bereinigte einwandfreie"} Forderungen: ${fmt(n * 1.19)} Euro brutto bei 19 Prozent. ${kind === "ewb" ? "Erwarteter Nettoausfall" : "Allgemeiner PWB-Satz"}: ${percent} Prozent. Kein Altbestand. Ermittle die neue ${kind.toUpperCase()} und buche die Neubildung.`;
      task.hint = "Nettobasis verwenden; keine Umsatzsteuerkorrektur durch bloße Wertberichtigung.";
      const amount = money((n * percent) / 100);
      field("Neue Wertberichtigung", amount);
      book(D("6950", amount), C(kind === "ewb" ? "3670" : "3680", amount));
      break;
    }
    case "vat": {
      task.prompt = `Rohstoffeinkauf auf Ziel: ${fmt(n)} Euro netto plus 19 Prozent bei berechtigtem vollem Vorsteuerabzug. Buche den Einkauf auf 6000 AWR.`;
      task.hint = "Aufwand und Vorsteuer ins Soll; volle Bruttoschuld ins Haben.";
      book(D("6000", n), D("2600", n * 0.19), C("4400", n * 1.19));
      break;
    }
    case "vatbalance": {
      const vat = money(n * 0.19 * 3),
        inputVat = money(n * 0.19);
      task.prompt = `Umsatzsteuer ${fmt(vat)} Euro, abziehbare Vorsteuer ${fmt(inputVat)} Euro. Die Kontenverrechnung ist bereits gebucht. Ermittle die restliche Zahllast und buche nur deren Zahlung per Bank.`;
      task.hint = "Zahllast = USt − Vorsteuer; verbleibende Steuerschuld bezahlen.";
      field("Zahllast", vat - inputVat);
      book(D("4800", vat - inputVat), C("2800", vat - inputVat));
      break;
    }
  }
  const numeric = task.fields.map((f) => `${f.label}: ${fmt(f.answer)} ${f.unit}.`).join(" ");
  const booking = task.booking
    .map((e) => `${e.side === "debit" ? "Soll" : "Haben"}: ${e.account} ${fmt(e.amount)} Euro`)
    .join("; ");
  task.solution = `${numeric} ${booking}${booking ? "." : ""} ${task.hint}`.trim();
  return task;
}
