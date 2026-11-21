import type { Entry, Exercise, Level, PracticeKind } from "../model/types";
import {
  balanceShift,
  changedBase,
  euro,
  fmt,
  fmtInt,
  householdBudget,
  inventarTotals,
  inventoryDiff,
  money,
  offerPrice,
  originalBase,
  percentBase,
  percentOf,
  percentRate,
  percentValue,
  periodOutcome,
  tAccountClosing,
  toCents,
  vatFromGross,
  vatFromNet,
  weightedLocation,
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

const MATERIALS = [
  { account: "AWR", short: "AWR", label: "Rohstoffe (z. B. Aluminiumrohre)", unit: "Stange(n)" },
  { account: "AWF", short: "AWF", label: "Fremdbauteile (z. B. Fahrradbremsen)", unit: "Set(s)" },
  { account: "AWH", short: "AWH", label: "Hilfsstoffe (z. B. Rahmenlack)", unit: "Dose(n)" },
  { account: "AWB", short: "AWB", label: "Betriebsstoffe (z. B. Maschinenöl)", unit: "Kanister" },
] as const;

const ASSETS = [
  { account: "MA", label: "eine Schweißmaschine (MA)" },
  { account: "FP", label: "einen Lieferwagen (FP)" },
  { account: "BM", label: "einen Bürodrucker (BM)" },
  { account: "BGA", label: "Werkstattregale (BGA)" },
] as const;

export function makeExercise(kind: PracticeKind, rng: Rng, level: Level): Exercise {
  const task: Exercise = { prompt: "", hint: "", fields: [], booking: [], solution: "" };
  const field = (label: string, answer: number, unit = "Euro") =>
    task.fields.push({ label, answer: money(answer), unit });
  const intField = (label: string, answer: number, unit = "Stück") =>
    task.fields.push({ label, answer: Math.round(answer), unit });
  const book = (...rows: Entry[]) => {
    task.booking = rows;
  };

  switch (kind) {
    case "budget": {
      const income = rng.int(26, 48) * 100;
      const fixed = rng.int(14, 24) * 100;
      const variable = rng.int(5, 14) * 100;
      const wish = rng.int(2, 8) * 50;
      if (level === 1) {
        const r = householdBudget(income, fixed, variable, 0);
        task.prompt = `Familie Weber hat im Monat ${fmt(income)} Euro Einkommen. Die festen Ausgaben betragen ${fmt(fixed)} Euro, die veränderlichen Ausgaben ${fmt(variable)} Euro. Ermittle die Gesamtausgaben und den monatlichen Saldo (Fehlbetrag negativ).`;
        task.hint = "Gesamtausgaben = feste + veränderliche Ausgaben. Saldo = Einnahmen − Gesamtausgaben.";
        field("Gesamtausgaben", r.totalExpenses);
        field("Monatlicher Saldo", r.balance);
      } else {
        const r = householdBudget(income, fixed, variable, wish);
        task.prompt = `Familie Weber nimmt monatlich ${fmt(income)} Euro ein. Feste Ausgaben: ${fmt(fixed)} Euro, veränderliche Ausgaben: ${fmt(variable)} Euro. Zusätzlich möchte die Familie ein Fahrrad für ${fmt(wish)} Euro bar kaufen. Ermittle die Gesamtausgaben mit Wunsch und den verbleibenden Saldo (Fehlbetrag negativ).`;
        task.hint = "Prüfe, ob die Einnahmen alle laufenden Ausgaben plus den Sonderwunsch decken.";
        field("Gesamtausgaben mit Wunsch", r.totalExpenses);
        field("Verbleibender Saldo", r.balance);
      }
      break;
    }

    case "receipt": {
      const qty1 = rng.int(2, 5);
      const p1 = rng.int(3, 9) + 0.5;
      const qty2 = rng.int(1, 4);
      const p2 = rng.int(2, 7);
      const sum = euro(toCents(p1) * qty1 + toCents(p2) * qty2);
      if (level === 1) {
        const paid = [20, 50, 100, 200].find((bill) => bill >= sum) ?? 200;
        task.prompt = `Kassenbon im Supermarkt: ${qty1} × Müsli zu je ${fmt(p1)} Euro und ${qty2} × Saft zu je ${fmt(p2)} Euro. Bezahlt wird bar mit einem ${fmtInt(paid)}-Euro-Schein. Ermittle den Gesamtbetrag (brutto) und das Rückgeld.`;
        task.hint = "Einzelbeträge addieren; Rückgeld = gezahlter Betrag − Gesamtbetrag.";
        field("Gesamtbetrag", sum);
        field("Rückgeld", euro(toCents(paid) - toCents(sum)));
      } else {
        const netSum = rng.int(8, 40) * 50;
        const v = vatFromNet(netSum, 19);
        const pos1 = euro(toCents(netSum) - rng.int(2, 6) * 5000);
        const pos2 = euro(toCents(netSum) - toCents(pos1));
        task.prompt = `Auf einer Familienrechnung für eine Fahrradreparatur stehen netto ${fmt(pos1)} Euro für Ersatzteile und ${fmt(pos2)} Euro für Arbeitszeit, zuzüglich 19 % Umsatzsteuer. Ermittle die Nettosumme, den Umsatzsteuerbetrag und den Bruttorechnungsbetrag.`;
        task.hint = "Erst die Nettopositionen zusammenzählen, dann 19 % Umsatzsteuer aufschlagen.";
        field("Nettosumme", v.net);
        field("Umsatzsteuer (19 %)", v.vat);
        field("Bruttobetrag", v.gross);
      }
      break;
    }

    case "percentBasic": {
      const rate = pick(rng, [5, 10, 15, 20, 25]);
      const base = rng.int(4, 30) * 20;
      const part = percentValue(base, rate);
      if (level === 1) {
        task.prompt = `Eine Familie plant ${fmtInt(rate)} % ihres Monatseinkommens von ${fmt(base)} Euro als Sparbetrag ein. Berechne den monatlichen Sparbetrag (Prozentwert).`;
        task.hint = "Prozentwert = Grundwert · Prozentsatz : 100.";
        field("Sparbetrag", part);
      } else {
        const share = percentRate(part, base);
        const recovered = percentBase(part, share);
        task.prompt = `Eine Familie legt jeden Monat ${fmt(part)} Euro zurück; das entspricht genau ${fmtInt(rate)} % des Haushaltseinkommens. Ermittle das gesamte Monatseinkommen (Grundwert).`;
        task.hint = "Grundwert = Prozentwert · 100 : Prozentsatz.";
        field("Monatseinkommen", recovered);
      }
      break;
    }

    case "percentChange": {
      const rate = pick(rng, [5, 10, 15, 20, 25]);
      const orig = rng.int(12, 45) * 20;
      const incMode = rng.int(0, 1) === 0;
      if (level === 1) {
        const result = changedBase(orig, rate, incMode ? "inc" : "dec");
        task.prompt = incMode
          ? `Ein Jugendfahrrad kostete bisher ${fmt(orig)} Euro. Der Preis steigt um ${fmtInt(rate)} %. Berechne den neuen Preis (vermehrter Grundwert).`
          : `Ein Trekkingrad kostet regulär ${fmt(orig)} Euro. Im Angebot wird der Preis um ${fmtInt(rate)} % gesenkt. Berechne den neuen Preis (verminderter Grundwert).`;
        task.hint = incMode
          ? "Vermehrter Grundwert: Ausgangswert · (100 + p) : 100."
          : "Verminderter Grundwert: Ausgangswert · (100 − p) : 100.";
        field("Neuer Preis", result);
      } else {
        const changed = changedBase(orig, rate, "dec");
        const back = originalBase(changed, rate, "dec");
        task.prompt = `Nach einem Preisnachlass von ${fmtInt(rate)} % kostet ein Mountainbike nur noch ${fmt(changed)} Euro. Berechne den ursprünglichen Preis vor dem Rabatt (Grundwert).`;
        task.hint = `Der neue Preis entspricht (100 − ${fmtInt(rate)}) % des Ausgangspreises. Rechne auf 100 % zurück.`;
        field("Ursprünglicher Preis", back);
      }
      break;
    }

    case "locationScore": {
      if (level === 1) {
        const w1 = pick(rng, [40, 50, 60, 70]);
        const w2 = 100 - w1;
        const s1 = rng.int(3, 6);
        const s2 = rng.int(1, 5);
        const r = weightedLocation([s1, s2], [s2, s1], [w1, w2]);
        task.prompt = `Standortbewertung für ein Gewerbegebiet (Punkte 1 bis 6): Verkehrsanbindung ${fmtInt(s1)} Punkte (Gewicht ${fmtInt(w1)} %), Grundstückspreis ${fmtInt(s2)} Punkte (Gewicht ${fmtInt(w2)} %). Berechne die gewichtete Gesamtpunktzahl.`;
        task.hint = "Jede Punktzahl mit ihrem Gewicht (%) malnehmen, addieren und durch 100 teilen.";
        field("Gesamtpunktzahl", r.scoreA, "Punkte");
      } else {
        const w = [35, 25, 25, 15];
        const a = [rng.int(4, 6), rng.int(4, 6), rng.int(3, 5), rng.int(1, 4)];
        const b = [rng.int(2, 4), rng.int(1, 3), rng.int(3, 5), rng.int(4, 6)];
        const r = weightedLocation(a, b, w);
        task.prompt = `Standortvergleich (1–6 Punkte): Verkehr (35 %): A=${fmtInt(a[0])}, B=${fmtInt(b[0])}; Miete (25 %): A=${fmtInt(a[1])}, B=${fmtInt(b[1])}; Fachkräfte (25 %): A=${fmtInt(a[2])}, B=${fmtInt(b[2])}; Laufkundschaft (15 %): A=${fmtInt(a[3])}, B=${fmtInt(b[3])}. Berechne die Punktzahl beider Standorte und den Vorsprung von A vor B (Rückstand negativ).`;
        task.hint = "Für jeden Standort: Summe aus (Punktzahl · Gewicht) : 100. Differenz = Punkte A − Punkte B.";
        field("Punktzahl A", r.scoreA, "Punkte");
        field("Punktzahl B", r.scoreB, "Punkte");
        field("Vorsprung A", r.diff, "Punkte");
      }
      break;
    }

    case "inventar": {
      const ma = rng.int(60, 140) * 1000;
      const fp = rng.int(30, 70) * 1000;
      const bk = rng.int(15, 45) * 1000;
      const lbkv = rng.int(25, 65) * 1000;
      const ve = rng.int(5, 20) * 1000;
      if (level === 1) {
        const r = inventarTotals([ma, fp], [bk], [lbkv, ve]);
        task.prompt = `Aus dem Inventar der Radwerk Brenner GmbH: Maschinen ${fmt(ma)} Euro, Fuhrpark ${fmt(fp)} Euro, Bankguthaben ${fmt(bk)} Euro, Darlehen ${fmt(lbkv)} Euro, Verbindlichkeiten gegenüber Lieferanten ${fmt(ve)} Euro. Ermittle die Summe des Vermögens, die Summe der Schulden und das Reinvermögen (Eigenkapital).`;
        task.hint = "Vermögen = Anlagevermögen + Umlaufvermögen. Reinvermögen = Summe Vermögen − Summe Schulden.";
        field("Summe Vermögen", r.assets);
        field("Summe Schulden", r.debts);
        field("Eigenkapital", r.equity);
      } else {
        const qty = rng.int(20, 50);
        const unitP = rng.int(120, 260);
        const stockVal = qty * unitP;
        const ka = rng.int(1, 5) * 1000;
        const r = inventarTotals([ma, fp], [stockVal, bk, ka], [lbkv, ve]);
        task.prompt = `Inventurwerte der Radwerk Brenner GmbH: Maschinen ${fmt(ma)} Euro, Fuhrpark ${fmt(fp)} Euro, ${fmtInt(qty)} fertige Jugendräder zu je ${fmt(unitP)} Euro, Bank ${fmt(bk)} Euro, Kasse ${fmt(ka)} Euro; Schulden: langfristiges Darlehen ${fmt(lbkv)} Euro und Lieferantenverbindlichkeiten ${fmt(ve)} Euro. Ermittle den Wert der fertigen Räder, die Summe des Vermögens und das Eigenkapital.`;
        task.hint = "Zuerst Stückzahl · Stückpreis für die Vorräte berechnen, dann zum Umlaufvermögen zählen.";
        field("Wert fertige Jugendräder", stockVal);
        field("Summe Vermögen", r.assets);
        field("Eigenkapital", r.equity);
      }
      break;
    }

    case "balanceEq": {
      const av = rng.int(100, 300) * 1000;
      const uv = rng.int(40, 120) * 1000;
      const total = av + uv;
      const lbkv = rng.int(30, 90) * 1000;
      const ve = rng.int(10, 40) * 1000;
      const ek = total - lbkv - ve;
      if (level === 1) {
        task.prompt = `In der Bilanz stehen Anlagevermögen ${fmt(av)} Euro und Umlaufvermögen ${fmt(uv)} Euro. Auf der Passivseite stehen Eigenkapital ${fmt(ek)} Euro und langfristige Bankverbindlichkeiten ${fmt(lbkv)} Euro; gesucht sind die Verbindlichkeiten aus Lieferungen und Leistungen (VE). Ermittle Bilanzsumme und VE.`;
        task.hint = "Bilanzsumme = Aktiva = Passiva. VE = Bilanzsumme − Eigenkapital − Darlehen.";
        field("Bilanzsumme", total);
        field("Verbindlichkeiten (VE)", ve);
      } else {
        const share = percentOf(toCents(ek), toCents(total));
        task.prompt = `Vermögen: Anlagevermögen ${fmt(av)} Euro, Umlaufvermögen ${fmt(uv)} Euro. Schulden: Darlehen ${fmt(lbkv)} Euro und Verbindlichkeiten LL ${fmt(ve)} Euro. Ermittle das Eigenkapital (EK) und die Eigenkapitalquote (Eigenkapital · 100 : Bilanzsumme).`;
        task.hint = "Eigenkapital = Bilanzsumme − Schulden. Danach Anteil an der Bilanzsumme in Prozent berechnen.";
        field("Eigenkapital", ek);
        field("Eigenkapitalquote", share, "%");
      }
      break;
    }

    case "bilanzShift": {
      const base = {
        av: rng.int(120, 200) * 1000,
        uv: rng.int(60, 100) * 1000,
        ek: 0,
        lbkv: rng.int(40, 80) * 1000,
        ve: rng.int(20, 40) * 1000,
      };
      base.ek = base.av + base.uv - base.lbkv - base.ve;
      const startTotal = base.av + base.uv;
      const amt = rng.int(4, 18) * 1000;
      if (level === 1) {
        const shiftKind = pick(rng, ["aktivtausch", "mehrung", "minderung"] as const);
        const res = balanceShift(base, shiftKind, amt);
        const desc =
          shiftKind === "aktivtausch"
            ? `Kauf einer Maschine für ${fmt(amt)} Euro per Banküberweisung`
            : shiftKind === "mehrung"
              ? `Kauf einer Maschine für ${fmt(amt)} Euro auf Ziel (Rechnung später bezahlen)`
              : `Begleichung einer Lieferantenrechnung über ${fmt(amt)} Euro per Bank`;
        task.prompt = `Ausgangsbilanz (Summe ${fmt(startTotal)} Euro): AV ${fmt(base.av)} Euro, UV ${fmt(base.uv)} Euro; EK ${fmt(base.ek)} Euro, LBKV ${fmt(base.lbkv)} Euro, VE ${fmt(base.ve)} Euro. Geschäftsfall: ${desc}. Ermittle die neue Bilanzsumme und das neue Umlaufvermögen.`;
        task.hint = "Aktiv- und Passivtausch verändern die Bilanzsumme nicht; Mehrung erhöht beide Seiten, Minderung senkt beide.";
        field("Neue Bilanzsumme", res.total);
        field("Neues Umlaufvermögen", res.uv);
      } else {
        const amt2 = rng.int(2, 10) * 1000;
        const step1 = balanceShift(base, "mehrung", amt);
        const step2 = balanceShift(
          { av: step1.av, uv: step1.uv, ek: step1.ek, lbkv: step1.lbkv, ve: step1.ve },
          "minderung",
          amt2,
        );
        task.prompt = `Ausgangsbilanz (Summe ${fmt(startTotal)} Euro): AV ${fmt(base.av)} Euro, UV ${fmt(base.uv)} Euro, VE ${fmt(base.ve)} Euro. Erst wird ein Baugrundstück auf Ziel (Rechnung) für ${fmt(amt)} Euro gekauft, danach wird eine alte Rechnung über ${fmt(amt2)} Euro per Bank beglichen. Ermittle die endgültige Bilanzsumme und die verbleibenden Verbindlichkeiten (VE).`;
        task.hint = "Beide Veränderungen Schritt für Schritt verfolgen: erst Bilanzverlängerung, dann Bilanzverkürzung.";
        field("Endgültige Bilanzsumme", step2.total);
        field("Verbindlichkeiten (VE)", step2.ve);
      }
      break;
    }

    case "tAccount": {
      const ab = rng.int(15, 60) * 1000;
      const add1 = rng.int(4, 15) * 1000;
      const add2 = rng.int(2, 10) * 1000;
      const red1 = rng.int(3, 12) * 1000;
      const red2 = rng.int(1, 5) * 1000;
      if (level === 1) {
        const r = tAccountClosing("active", ab, [add1, add2], [red1]);
        task.prompt = `Auf dem Aktivkonto BK (Bank) stehen ein Anfangsbestand von ${fmt(ab)} Euro, zwei Zugänge über ${fmt(add1)} Euro und ${fmt(add2)} Euro sowie ein Abgang von ${fmt(red1)} Euro. Berechne die Kontensumme (Soll) und den Schlussbestand (SB).`;
        task.hint = "Aktivkonto: AB und Zugänge stehen im Soll, Abgänge und Schlussbestand im Haben.";
        field("Kontensumme", r.sideTotal);
        field("Schlussbestand (SB)", r.balance);
      } else {
        const r = tAccountClosing("passive", ab, [add1], [red1, red2]);
        task.prompt = `Auf dem Passivkonto VE (Verbindlichkeiten) stehen ein Anfangsbestand von ${fmt(ab)} Euro, ein Zugang von ${fmt(add1)} Euro sowie zwei Abgänge durch Überweisung über ${fmt(red1)} Euro und ${fmt(red2)} Euro. Berechne die Kontensumme (Haben) und den Schlussbestand (SB).`;
        task.hint = "Passivkonto: AB und Zugänge stehen im Haben, Abgänge und Schlussbestand im Soll.";
        field("Kontensumme", r.sideTotal);
        field("Schlussbestand (SB)", r.balance);
      }
      break;
    }

    case "bestandsBooking": {
      const amt = rng.int(5, 45) * 500;
      if (level === 1) {
        const cases = [
          {
            text: `Barabhebung vom Bankkonto für die Geschäftskasse über ${fmt(amt)} Euro.`,
            d: "KA",
            c: "BK",
            hint: "Kasse (Aktivkonto) nimmt zu → Soll; Bank (Aktivkonto) nimmt ab → Haben.",
          },
          {
            text: `Ein Kunde begleicht unsere offene Forderung (FO) über ${fmt(amt)} Euro per Banküberweisung.`,
            d: "BK",
            c: "FO",
            hint: "Bank (Aktivkonto) nimmt zu → Soll; Forderungen (Aktivkonto) nehmen ab → Haben.",
          },
          {
            text: `Wir begleichen eine Lieferantenrechnung (VE) über ${fmt(amt)} Euro durch Banküberweisung.`,
            d: "VE",
            c: "BK",
            hint: "Verbindlichkeiten (Passivkonto) nehmen ab → Soll; Bank (Aktivkonto) nimmt ab → Haben.",
          },
          {
            text: `Umwandlung von Lieferantenverbindlichkeiten (VE) über ${fmt(amt)} Euro in ein langfristiges Bankdarlehen (LBKV).`,
            d: "VE",
            c: "LBKV",
            hint: "VE (Passivkonto) nimmt ab → Soll; LBKV (Passivkonto) nimmt zu → Haben.",
          },
        ] as const;
        const chosen = pick(rng, cases);
        task.prompt = `Bilde den Buchungssatz (ohne Umsatzsteuer): ${chosen.text}`;
        task.hint = chosen.hint;
        book(D(chosen.d, amt), C(chosen.c, amt));
      } else {
        const part1 = rng.int(4, 20) * 1000;
        const part2 = rng.int(2, 10) * 1000;
        const total = part1 + part2;
        if (rng.int(0, 1) === 0) {
          task.prompt = `Das Radwerk Brenner kauft ein unbebautes Betriebsgrundstück (GR, steuerfrei) für ${fmt(total)} Euro: ${fmt(part1)} Euro werden durch ein langfristiges Bankdarlehen (LBKV) finanziert, die restlichen ${fmt(part2)} Euro per Banküberweisung bezahlt. Bilde den zusammengesetzten Buchungssatz.`;
          task.hint = "Grundstücke nehmen im Soll zu; LBKV im Haben zu, Bank im Haben ab.";
          book(D("GR", total), C("LBKV", part1), C("BK", part2));
        } else {
          task.prompt = `Wir tilgen per Banküberweisung gleichzeitig ein kurzfristiges Bankdarlehen (KBKV) in Höhe von ${fmt(part1)} Euro und begleichen eine Lieferantenverbindlichkeit (VE) über ${fmt(part2)} Euro. Ermittle den gesamten Bankabgang und bilde den Buchungssatz.`;
          task.hint = "Beide Passivkonten nehmen im Soll ab; Bank nimmt um die Summe im Haben ab.";
          field("Gesamter Bankabgang", total);
          book(D("KBKV", part1), D("VE", part2), C("BK", total));
        }
      }
      break;
    }

    case "fixBooking": {
      const amt = rng.int(3, 30) * 500;
      if (level === 1) {
        const cases = [
          {
            beleg: `Kontoauszug: Überweisung an einen Lieferanten zum Ausgleich einer offenen Rechnung über ${fmt(amt)} Euro.`,
            wrong: `BK ${fmt(amt)} € an VE ${fmt(amt)} €`,
            d: "VE",
            c: "BK",
            hint: "Auf dem Kontoauszug nimmt BK ab (Haben) und die Schuld VE wird weniger (Soll).",
          },
          {
            beleg: `Quittung: Einzahlung von Bargeld aus der Kasse auf das Geschäftskonto über ${fmt(amt)} Euro.`,
            wrong: `KA ${fmt(amt)} € an BK ${fmt(amt)} €`,
            d: "BK",
            c: "KA",
            hint: "Die Bank wächst (Soll), die Kasse leert sich (Haben).",
          },
        ] as const;
        const chosen = pick(rng, cases);
        task.prompt = `Belegprüfung — der Azubi hat einen Buchungssatz falsch herum notiert. Beleg: ${chosen.beleg} Vorgeschlagener falscher Buchungssatz: „${chosen.wrong}“. Bilde den richtigen Buchungssatz.`;
        task.hint = chosen.hint;
        book(D(chosen.d, amt), C(chosen.c, amt));
      } else {
        const net = rng.int(4, 24) * 500;
        const vat = vatFromNet(net, 19);
        task.prompt = `Belegprüfung — Ausgangsrechnung über ${fmt(vat.gross)} Euro brutto (darin ${fmt(vat.net)} Euro netto plus ${fmt(vat.vat)} Euro Umsatzsteuer) für gelieferte Jugendräder auf Ziel. Falscher Vorschlag: „UEFE an FO“. Ermittle die fehlende Vorsteuer- oder Umsatzsteuerbuchung und bilde den vollständigen richtigen Buchungssatz.`;
        task.hint = "Forderungen (FO) nehmen brutto im Soll zu; UEFE (netto) und UST (Steuer) stehen im Haben.";
        book(D("FO", vat.gross), C("UEFE", vat.net), C("UST", vat.vat));
      }
      break;
    }

    case "vatCalc": {
      const rate: 7 | 19 = rng.int(0, 3) === 0 ? 7 : 19;
      const net = rng.int(3, 50) * 100;
      const v = vatFromNet(net, rate);
      if (level === 1) {
        task.prompt = `Berechne bei einem Nettobetrag von ${fmt(v.net)} Euro und einem Steuersatz von ${rate} % den Umsatzsteuerbetrag und den Bruttobetrag.`;
        task.hint = `Steuerbetrag = Netto · ${rate} : 100. Brutto = Netto + Steuerbetrag.`;
        field(`Steuerbetrag (${rate} %)`, v.vat);
        field("Bruttobetrag", v.gross);
      } else {
        const back = vatFromGross(v.gross, rate);
        task.prompt = `Auf einer Quittung steht der Bruttobetrag ${fmt(back.gross)} Euro einschließlich ${rate} % Umsatzsteuer. Berechne den Nettobetrag und die enthaltene Umsatzsteuer.`;
        task.hint = `Netto = Brutto · 100 : ${100 + rate}. Steuerbetrag = Brutto − Netto.`;
        field("Nettobetrag", back.net);
        field(`Umsatzsteuer (${rate} %)`, back.vat);
      }
      break;
    }

    case "vatBooking": {
      const net = rng.int(4, 36) * 500;
      const v = vatFromNet(net, 19);
      if (level === 1) {
        const asset = pick(rng, ASSETS);
        task.prompt = `Das Radwerk Brenner kauft ${asset.label} auf Ziel (Rechnung später bezahlen) für ${fmt(v.net)} Euro netto zuzüglich 19 % Umsatzsteuer. Ermittle Vorsteuer und Bruttobetrag und bilde den Buchungssatz.`;
        task.hint = "Anlagekonto (netto) und VORST im Soll; VE (brutto) im Haben.";
        field("Vorsteuer", v.vat);
        field("Bruttobetrag", v.gross);
        book(D(asset.account, v.net), D("VORST", v.vat), C("VE", v.gross));
      } else {
        const viaBank = rng.int(0, 1) === 0;
        const payAcc = viaBank ? "BK" : "FO";
        const payWord = viaBank ? "gegen sofortige Banküberweisung" : "auf Ziel (Ausgangsrechnung)";
        task.prompt = `Verkauf eigener Fertigerzeugnisse ${payWord} für ${fmt(v.gross)} Euro brutto einschließlich 19 % Umsatzsteuer. Berechne den Nettoerlös sowie die Umsatzsteuer und buche den Verkauf.`;
        task.hint = "Netto = Brutto · 100 : 119. Zahlungs-/Forderungskonto brutto im Soll; UEFE (netto) und UST im Haben.";
        field("Nettoerlös", v.net);
        field("Umsatzsteuer", v.vat);
        book(D(payAcc, v.gross), C("UEFE", v.net), C("UST", v.vat));
      }
      break;
    }

    case "periodSuccess": {
      const rev = rng.int(30, 95) * 1000;
      const awr = rng.int(12, 40) * 1000;
      const awf = rng.int(8, 30) * 1000;
      const awh = rng.int(2, 10) * 1000;
      const awb = rng.int(1, 6) * 1000;
      const out = periodOutcome([rev], [awr, awf, awh, awb]);
      if (level === 1) {
        task.prompt = `Im Quartal fallen an: Umsatzerlöse (UEFE) ${fmt(rev)} Euro, Aufwendungen für Rohstoffe (AWR) ${fmt(awr)} Euro, Fremdbauteile (AWF) ${fmt(awf)} Euro, Hilfsstoffe (AWH) ${fmt(awh)} Euro und Betriebsstoffe (AWB) ${fmt(awb)} Euro. Ermittle die Summe der Aufwendungen und den Periodenerfolg (Verlust negativ).`;
        task.hint = "Periodenerfolg = Summe Erträge − Summe Aufwendungen.";
        field("Summe Aufwendungen", out.totalExpense);
        field("Periodenerfolg", out.result);
      } else {
        const machine = rng.int(15, 45) * 1000;
        task.prompt = `Vorgänge im Monat: Verkauf von Jugendrädern (UEFE) ${fmt(rev)} Euro; Werkstoffverbrauch: Rohstoffe (AWR) ${fmt(awr)} Euro, Fremdbauteile (AWF) ${fmt(awf)} Euro, Hilfs- und Betriebsstoffe (AWH/AWB) zusammen ${fmt(awh + awb)} Euro. Außerdem wird eine Schweißmaschine (MA) für ${fmt(machine)} Euro per Bank gekauft. Ermittle die erfolgswirksamen Aufwendungen und den Periodenerfolg (Verlust negativ).`;
        task.hint = "Der Kauf einer Maschine per Bank ist nur ein Aktivtausch (bestandsverändernd) und gehört nicht zu den Aufwendungen.";
        field("Erfolgswirksame Aufwendungen", out.totalExpense);
        field("Periodenerfolg", out.result);
      }
      break;
    }

    case "offerCalc": {
      const listA = rng.int(20, 80) * 200;
      const rabA = pick(rng, [5, 10, 15, 20]);
      if (level === 1) {
        const a = offerPrice(listA, rabA, 19);
        task.prompt = `Ein Lieferer bietet Alurahmen zum Listenpreis von ${fmt(a.listPrice)} Euro netto an und gewährt ${fmtInt(rabA)} % Sofortrabatt. Es gelten 19 % Umsatzsteuer. Berechne den Rabattbetrag, den Netto-Einkaufspreis und den Bruttobetrag.`;
        task.hint = "Sofortrabatt vom Listenpreis abziehen, erst auf den verbleibenden Nettobetrag kommen 19 % Vorsteuer.";
        field("Rabattbetrag", a.discount);
        field("Netto-Einkaufspreis", a.net);
        field("Bruttobetrag", a.gross);
      } else {
        const listB = listA + rng.int(2, 8) * 200;
        const rabB = rabA + pick(rng, [10, 15]);
        const a = offerPrice(listA, rabA, 19);
        const b = offerPrice(listB, rabB, 19);
        const diff = euro(Math.abs(toCents(a.net) - toCents(b.net)));
        task.prompt = `Angebotsvergleich für Fahrradrahmen: Lieferer A verlangt ${fmt(a.listPrice)} Euro netto minus ${fmtInt(rabA)} % Sofortrabatt; Lieferer B verlangt ${fmt(b.listPrice)} Euro netto minus ${fmtInt(rabB)} % Sofortrabatt. Berechne beide Netto-Einkaufspreise und den Netto-Preisunterschied zwischen A und B.`;
        task.hint = "Für beide Angebote den Rabatt abziehen; die Differenz beider Nettobeträge zeigt den Preisvorteil.";
        field("Nettopreis A", a.net);
        field("Nettopreis B", b.net);
        field("Netto-Unterschied", diff);
      }
      break;
    }

    case "materialBuy": {
      const idx = rng.int(0, MATERIALS.length - 1);
      const m1 = MATERIALS[idx];
      if (level === 1) {
        const net = rng.int(6, 40) * 200;
        const v = vatFromNet(net, 19);
        task.prompt = `Eingangsrechnung über ${m1.label} für ${fmt(v.net)} Euro netto plus 19 % Umsatzsteuer, Zahlung auf Ziel (VE). Ermittle Vorsteuer und Bruttobetrag und buche den Werkstoffeinkauf.`;
        task.hint = `Werkstoffaufwand (${m1.short}) und VORST im Soll an VE im Haben.`;
        field("Vorsteuer", v.vat);
        field("Bruttobetrag", v.gross);
        book(D(m1.account, v.net), D("VORST", v.vat), C("VE", v.gross));
      } else {
        const m2 = MATERIALS[(idx + 1) % MATERIALS.length];
        const list1 = rng.int(10, 40) * 100;
        const list2 = rng.int(5, 25) * 100;
        const rab = pick(rng, [5, 10]);
        const n1 = offerPrice(list1, rab, 19).net;
        const n2 = offerPrice(list2, rab, 19).net;
        const totalNet = euro(toCents(n1) + toCents(n2));
        const v = vatFromNet(totalNet, 19);
        task.prompt = `Eingangsrechnung auf Ziel (VE): ${m1.label} zum Listenpreis von ${fmt(list1)} Euro netto und ${m2.label} zum Listenpreis von ${fmt(list2)} Euro netto. Auf beide Positionen gewährt der Lieferer ${fmtInt(rab)} % Sofortrabatt; dazu kommen 19 % Umsatzsteuer. Ermittle die Vorsteuer sowie den Bruttobetrag und bilde den zusammengesetzten Buchungssatz.`;
        task.hint = "Auf beide Listenpreise jeweils den Sofortrabatt abziehen, die Nettobeträge buchen, 19 % Vorsteuer berechnen und die Bruttosumme an VE buchen.";
        field("Vorsteuer", v.vat);
        field("Bruttobetrag", v.gross);
        book(D(m1.account, n1), D(m2.account, n2), D("VORST", v.vat), C("VE", v.gross));
      }
      break;
    }

    case "productSell": {
      const qty = rng.int(10, 45);
      const unitP = rng.int(18, 40) * 10;
      const listTotal = qty * unitP;
      if (level === 1) {
        const v = vatFromNet(listTotal, 19);
        task.prompt = `Ausgangsrechnung an einen Sporthändler auf Ziel (FO): ${fmtInt(qty)} Jugendräder zu je ${fmt(unitP)} Euro netto plus 19 % Umsatzsteuer. Ermittle Nettoerlös, Umsatzsteuer und Rechnungsbetrag (brutto) und buche den Verkauf.`;
        task.hint = "FO (brutto) im Soll an UEFE (netto) und UST im Haben.";
        field("Nettoerlös", v.net);
        field("Umsatzsteuer", v.vat);
        field("Bruttobetrag", v.gross);
        book(D("FO", v.gross), C("UEFE", v.net), C("UST", v.vat));
      } else {
        const rab = pick(rng, [5, 10]);
        const o = offerPrice(listTotal, rab, 19);
        task.prompt = `Ausgangsrechnung an ein Fahrradgeschäft (sofortige Banküberweisung): ${fmtInt(qty)} Jugendräder zu je ${fmt(unitP)} Euro Listenpreis netto abzüglich ${fmtInt(rab)} % Sofortrabatt, zuzüglich 19 % Umsatzsteuer. Ermittle den Nettoerlös nach Rabatt, die Umsatzsteuer sowie den Bruttobetrag und buche den Verkauf.`;
        task.hint = "Erst Rabatt abziehen, dann 19 % Umsatzsteuer auf den Nettoerlös aufschlagen; BK im Soll an UEFE und UST.";
        field("Nettoerlös nach Rabatt", o.net);
        field("Umsatzsteuer", o.vat);
        field("Bruttobetrag", o.gross);
        book(D("BK", o.gross), C("UEFE", o.net), C("UST", o.vat));
      }
      break;
    }

    case "invoiceComplete": {
      const q1 = rng.int(5, 20);
      const p1 = rng.int(20, 45) * 10;
      const q2 = rng.int(4, 15);
      const p2 = rng.int(10, 25) * 10;
      const total1 = q1 * p1;
      const total2 = q2 * p2;
      const subtotal = total1 + total2;
      const invoiceNo = `AR-2026-${rng.int(104, 989)}`;
      if (level === 1) {
        const v = vatFromNet(subtotal, 19);
        task.prompt =
          "Vervollständige die Lücken im Vordruck dieser Ausgangsrechnung der Radwerk Brenner GmbH und bilde anschließend den Buchungssatz (Verkauf auf Ziel über FO).";
        task.hint =
          "Position 2 berechnen (Menge · Einzelpreis), Nettosumme bilden, 19 % Umsatzsteuer aufschlagen und FO (brutto) an UEFE (netto) und UST buchen.";
        field("Gesamtpreis Pos. 2 (netto)", total2);
        field("Nettosumme", v.net);
        field("Umsatzsteuer (19 %)", v.vat);
        field("Rechnungsbetrag (brutto)", v.gross);
        book(D("FO", v.gross), C("UEFE", v.net), C("UST", v.vat));
        task.invoice = {
          seller: "Radwerk Brenner GmbH",
          sellerAddress: "Gewerbepark Nord 8 · 84030 Ergolding",
          buyer: "Zweiradhandel Alpenblick e. K.",
          buyerAddress: "Bahnhofstraße 14 · 83022 Rosenheim",
          invoiceNo,
          date: "14.10.2026",
          deliveryDate: "14.10.2026",
          paymentTerms: "Zahlbar innerhalb von 14 Tagen rein netto (Zielverkauf auf FO).",
          rows: [
            { pos: 1, description: "Jugendfahrrad „Isar 24“", qty: q1, unit: "Stück", unitPrice: p1, total: total1 },
            { pos: 2, description: "City-Roller „Alu Klapp“", qty: q2, unit: "Stück", unitPrice: p2, fieldIndex: 0 },
          ],
          summary: [
            { label: "Nettosumme", fieldIndex: 1 },
            { label: "+ 19 % Umsatzsteuer", fieldIndex: 2 },
            { label: "Rechnungsbetrag (brutto)", fieldIndex: 3, strong: true },
          ],
        };
      } else {
        const rab = pick(rng, [5, 10]);
        const o = offerPrice(subtotal, rab, 19);
        task.prompt = `Vervollständige den Ausgangsrechnungs-Vordruck einschließlich ${fmtInt(rab)} % Kunden-Sofortrabatt und buche den Beleg auf Ziel (FO).`;
        task.hint =
          "Zuerst beide Positionswerte und die Zwischensumme berechnen, dann den Sofortrabatt abziehen, auf den Nettobetrag 19 % Umsatzsteuer aufschlagen und FO an UEFE und UST buchen.";
        field("Gesamtpreis Pos. 1 (netto)", total1);
        field("Gesamtpreis Pos. 2 (netto)", total2);
        field("Zwischensumme netto", subtotal);
        field(`Sofortrabatt (${fmtInt(rab)} %)`, o.discount);
        field("Nettobetrag nach Rabatt", o.net);
        field("Umsatzsteuer (19 %)", o.vat);
        field("Rechnungsbetrag (brutto)", o.gross);
        book(D("FO", o.gross), C("UEFE", o.net), C("UST", o.vat));
        task.invoice = {
          seller: "Radwerk Brenner GmbH",
          sellerAddress: "Gewerbepark Nord 8 · 84030 Ergolding",
          buyer: "Sporthaus Bergland GmbH",
          buyerAddress: "Marktplatz 5 · 87435 Kempten",
          invoiceNo,
          date: "19.10.2026",
          deliveryDate: "18.10.2026",
          paymentTerms: "Zahlbar innerhalb von 14 Tagen rein netto (Zielverkauf auf FO).",
          rows: [
            { pos: 1, description: "Jugendfahrrad „Isar 26“", qty: q1, unit: "Stück", unitPrice: p1, fieldIndex: 0 },
            { pos: 2, description: "City-Roller „Alu Klapp“", qty: q2, unit: "Stück", unitPrice: p2, fieldIndex: 1 },
          ],
          summary: [
            { label: "Zwischensumme netto", fieldIndex: 2 },
            { label: `− ${fmtInt(rab)} % Sofortrabatt`, fieldIndex: 3 },
            { label: "Nettobetrag nach Rabatt", fieldIndex: 4 },
            { label: "+ 19 % Umsatzsteuer", fieldIndex: 5 },
            { label: "Rechnungsbetrag (brutto)", fieldIndex: 6, strong: true },
          ],
        };
      }
      break;
    }

    case "ledgerPost": {
      const ab = rng.int(20, 60) * 1000;
      const net = rng.int(3, 20) * 500;
      const v = vatFromNet(net, 19);
      if (level === 1) {
        const pay = rng.int(2, 12) * 1000;
        const endBk = euro(toCents(ab) - toCents(pay));
        task.prompt = `Anfangsbestand auf BK: ${fmt(ab)} Euro. Geschäftsfall im Grund- und Hauptbuch: Begleichung einer offenen Lieferantenverbindlichkeit (VE) über ${fmt(pay)} Euro per Bank. Ermittle den neuen Kontostand von BK und buche den Geschäftsfall.`;
        task.hint = "BK ist ein Aktivkonto: Der Bankabgang steht im Haben und verringert den Bestand.";
        field("Neuer Kontostand BK", endBk);
        book(D("VE", pay), C("BK", pay));
      } else {
        const endVe = euro(toCents(ab) + toCents(v.gross));
        task.prompt = `Anfangsbestand auf VE: ${fmt(ab)} Euro. Geschäftsfall: Kauf von Rohstoffen (AWR) auf Ziel für ${fmt(v.net)} Euro netto plus 19 % Umsatzsteuer. Ermittle die Vorsteuer und den neuen Kontostand auf VE und buche den Geschäftsfall.`;
        task.hint = "Die Bruttoschuld erhöht das Passivkonto VE im Haben.";
        field("Vorsteuer", v.vat);
        field("Neuer Kontostand VE", endVe);
        book(D("AWR", v.net), D("VORST", v.vat), C("VE", v.gross));
      }
      break;
    }

    case "guvClose": {
      const awr = rng.int(20, 60) * 1000;
      const awf = rng.int(10, 40) * 1000;
      const awh = rng.int(4, 15) * 1000;
      const uefe = rng.int(45, 130) * 1000;
      if (level === 1) {
        const out = periodOutcome([uefe], [awr, awf]);
        task.prompt = `Abschluss der Erfolgskonten: AWR ${fmt(awr)} Euro, AWF ${fmt(awf)} Euro, UEFE ${fmt(uefe)} Euro. Ermittle die Summe der Aufwendungen und den Periodenerfolg (Verlust negativ) und schließe die beiden Aufwandskonten über GUV ab.`;
        task.hint = "Aufwandskonten stehen im Soll und werden im Haben an GUV abgeschlossen.";
        field("Summe Aufwendungen", out.totalExpense);
        field("Periodenerfolg", out.result);
        book(D("GUV", out.totalExpense), C("AWR", awr), C("AWF", awf));
      } else {
        const out = periodOutcome([uefe], [awr, awf, awh]);
        task.prompt = `Salden der Erfolgskonten: UEFE ${fmt(uefe)} Euro, AWR ${fmt(awr)} Euro, AWF ${fmt(awf)} Euro, AWH ${fmt(awh)} Euro. Ermittle den Periodenerfolg (Verlust negativ) und schließe das Ertragskonto UEFE auf GUV ab.`;
        task.hint = "Ertragskonten stehen im Haben und werden im Soll an GUV abgeschlossen.";
        field("Periodenerfolg", out.result);
        book(D("UEFE", uefe), C("GUV", uefe));
      }
      break;
    }

    case "ekClose": {
      const ekStart = rng.int(120, 260) * 1000;
      const exp = rng.int(50, 110) * 1000;
      if (level === 1) {
        const rev = exp + rng.int(8, 35) * 1000;
        const out = periodOutcome([rev], [exp]);
        const ekEnd = ekStart + out.result;
        task.prompt = `Konto EK hat einen Anfangsbestand von ${fmt(ekStart)} Euro. Auf GUV stehen ${fmt(rev)} Euro Erträge und ${fmt(exp)} Euro Aufwendungen. Ermittle den Reingewinn und das End-Eigenkapital und buche den Abschluss von GUV auf EK.`;
        task.hint = "Gewinn mehrt das Eigenkapital: GUV im Soll an EK im Haben.";
        field("Reingewinn", out.result);
        field("End-Eigenkapital", ekEnd);
        book(D("GUV", out.absResult), C("EK", out.absResult));
      } else {
        const rev = exp - rng.int(4, 25) * 1000;
        const out = periodOutcome([rev], [exp]);
        const ekEnd = ekStart + out.result;
        task.prompt = `Konto EK hat einen Anfangsbestand von ${fmt(ekStart)} Euro. Auf GUV stehen ${fmt(rev)} Euro Erträge und ${fmt(exp)} Euro Aufwendungen. Ermittle den Periodenerfolg (Verlust negativ) und das End-Eigenkapital und buche den Abschluss von GUV auf EK.`;
        task.hint = "Verlust mindert das Eigenkapital: EK im Soll an GUV im Haben.";
        field("Periodenerfolg", out.result);
        field("End-Eigenkapital", ekEnd);
        book(D("EK", out.absResult), C("GUV", out.absResult));
      }
      break;
    }

    case "sbkClose": {
      if (level === 1) {
        const fp = rng.int(30, 80) * 1000;
        const bk = rng.int(15, 50) * 1000;
        const sum = fp + bk;
        task.prompt = `Schlussbestände zweier aktiver Bestandskonten: FP ${fmt(fp)} Euro und BK ${fmt(bk)} Euro. Ermittle deren Summe im Schlussbilanzkonto und schließe beide Konten auf SBK ab.`;
        task.hint = "Aktivkonten schließen im Haben an SBK (im Soll) ab.";
        field("Summe Aktiva im Beispiel", sum);
        book(D("SBK", sum), C("FP", fp), C("BK", bk));
      } else {
        const ek = rng.int(90, 200) * 1000;
        const ve = rng.int(15, 45) * 1000;
        const sum = ek + ve;
        task.prompt = `Schlussbestände zweier passiver Bestandskonten: EK ${fmt(ek)} Euro und VE ${fmt(ve)} Euro. Ermittle die Summe im Schlussbilanzkonto und schließe beide Konten auf SBK ab.`;
        task.hint = "Passivkonten schließen im Soll an SBK (im Haben) ab.";
        field("Summe Passiva im Beispiel", sum);
        book(D("EK", ek), D("VE", ve), C("SBK", sum));
      }
      break;
    }

    case "bilanzCompare": {
      const av0 = rng.int(100, 180) * 1000;
      const uv0 = rng.int(50, 100) * 1000;
      const total0 = av0 + uv0;
      const fk0 = rng.int(60, 110) * 1000;
      const ek0 = total0 - fk0;
      const ekDelta = (rng.int(0, 1) === 0 ? 1 : -1) * rng.int(5, 20) * 1000;
      const ek1 = ek0 + ekDelta;
      const av1 = av0 + rng.int(-10, 20) * 1000;
      const uv1 = uv0 + rng.int(-10, 20) * 1000;
      const total1 = av1 + uv1;
      const fk1 = total1 - ek1;
      if (level === 1) {
        task.prompt = `Eröffnungsbilanz: Eigenkapital ${fmt(ek0)} Euro, Fremdkapital ${fmt(fk0)} Euro. Schlussbilanz: Eigenkapital ${fmt(ek1)} Euro, Fremdkapital ${fmt(fk1)} Euro (keine Einlagen oder Entnahmen). Ermittle die Veränderung des Eigenkapitals und die Veränderung der Bilanzsumme (Abnahme negativ).`;
        task.hint = "Veränderung = Schlusswert − Anfangswert. Ohne Einlagen/Entnahmen zeigt die EK-Veränderung den Erfolg.";
        field("Veränderung Eigenkapital", ekDelta);
        field("Veränderung Bilanzsumme", total1 - total0);
      } else {
        const share0 = percentOf(toCents(ek0), toCents(total0));
        const share1 = percentOf(toCents(ek1), toCents(total1));
        task.prompt = `Eröffnungsbilanz: AV ${fmt(av0)} Euro, UV ${fmt(uv0)} Euro, EK ${fmt(ek0)} Euro, FK ${fmt(fk0)} Euro. Schlussbilanz: AV ${fmt(av1)} Euro, UV ${fmt(uv1)} Euro, EK ${fmt(ek1)} Euro, FK ${fmt(fk1)} Euro. Berechne die alte und die neue Eigenkapitalquote (in %) sowie die Eigenkapitalveränderung (Abnahme negativ).`;
        task.hint = "Eigenkapitalquote = EK · 100 : Bilanzsumme.";
        field("Eigenkapitalquote alt", share0, "%");
        field("Eigenkapitalquote neu", share1, "%");
        field("Veränderung Eigenkapital", ekDelta);
      }
      break;
    }

    case "invDiff": {
      const bookQty = rng.int(120, 400);
      const unitP = rng.int(15, 80);
      if (level === 1) {
        const missing = rng.int(3, 25);
        const actualQty = bookQty - missing;
        const r = inventoryDiff(bookQty, actualQty, unitP);
        task.prompt = `Lagerinventur bei Aluminiumrohren (Wert ${fmt(unitP)} Euro je Stück): Laut Buchhaltung müssten ${fmtInt(bookQty)} Stück im Lager sein (Sollbestand); gezählt werden ${fmtInt(actualQty)} Stück (Istbestand). Ermittle die Bestandsabweichung in Stück und Euro (Fehlbestand negativ).`;
        task.hint = "Abweichung = Istbestand − Sollbestand. Wertabweichung = Stückabweichung · Stückpreis.";
        intField("Bestandsabweichung", r.qtyDiff, "Stück");
        field("Wertabweichung", r.valueDiff);
      } else {
        const delta1 = -rng.int(4, 18);
        const actual1 = bookQty + delta1;
        const book2 = rng.int(80, 220);
        const delta2 = rng.int(2, 12);
        const actual2 = book2 + delta2;
        const p2 = rng.int(10, 45);
        const r1 = inventoryDiff(bookQty, actual1, unitP);
        const r2 = inventoryDiff(book2, actual2, p2);
        const totalDiff = euro(toCents(r1.valueDiff) + toCents(r2.valueDiff));
        task.prompt = `Jahresinventur: 1. Alurohre (${fmt(unitP)} Euro/Stück): Soll ${fmtInt(bookQty)} Stück, Ist ${fmtInt(actual1)} Stück. 2. Bremshebel (${fmt(p2)} Euro/Stück): Soll ${fmtInt(book2)} Stück, Ist ${fmtInt(actual2)} Stück. Ermittle die beiden Wertabweichungen und den Gesamtsaldo (Minderung negativ).`;
        task.hint = "Je Position (Ist − Soll) · Stückpreis berechnen und die Eurobeträge mit Vorzeichen addieren.";
        field("Abweichung Alurohre", r1.valueDiff);
        field("Abweichung Bremshebel", r2.valueDiff);
        field("Gesamtsaldo", totalDiff);
      }
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
