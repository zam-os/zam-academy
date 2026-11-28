function decimalRatio(value: number): [bigint, bigint] {
  if (!Number.isFinite(value)) throw new Error("Zahlenwerte müssen endlich sein.");
  const [mantissa, exponent = "0"] = String(value).split("e");
  const [integer, fraction = ""] = mantissa.split(".");
  const units = BigInt(integer + fraction);
  const places = fraction.length - Number(exponent);
  return places >= 0 ? [units, 10n ** BigInt(places)] : [units * 10n ** BigInt(-places), 1n];
}

function roundQuotient(numerator: bigint, denominator: bigint): number {
  if (denominator < 0n) return roundQuotient(-numerator, -denominator);
  const sign = numerator < 0n ? -1n : 1n;
  return Number(sign * ((sign * numerator * 2n + denominator) / (denominator * 2n)));
}

/** Commercial rounding to cents without binary floating-point drift (2,675 → 2,68). */
export const money = (value: number): number => {
  const [units, scale] = decimalRatio(value);
  return roundQuotient(units * 100n, scale) / 100;
};

export function fmt(value: number, digits = 2): string {
  const clean = Math.abs(value) < 0.0005 ? 0 : value;
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(clean)
    .replace("-", "−");
}

export function fmtInt(value: number): string {
  const clean = Math.abs(value) < 0.5 ? 0 : Math.round(value);
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: 0,
  })
    .format(clean)
    .replace("-", "−");
}

/** Allgemeiner gesetzlicher Mindestlohn seit 1. Januar 2026 (BMAS, abgerufen am 28. November 2026). */
export const MINIMUM_WAGE = 13.9;

/** Projektzeitplan: Arbeitspakete plus Zeitpuffer gegen die verfügbaren Projektwochen. */
export function projectSchedule(
  planHours: number,
  execHours: number,
  closeHours: number,
  bufferPct: number,
  hoursPerWeek: number,
  weeksAvailable: number,
) {
  const workHours = money(planHours + execHours + closeHours);
  const bufferHours = money(workHours * (bufferPct / 100));
  const totalHours = money(workHours + bufferHours);
  const weeksNeeded = hoursPerWeek > 0 ? Math.ceil(money(totalHours / hoursPerWeek)) : Infinity;
  const fits = weeksNeeded <= weeksAvailable;
  const spareWeeks = Number.isFinite(weeksNeeded) ? weeksAvailable - weeksNeeded : -weeksAvailable;
  return { workHours, bufferHours, totalHours, weeksNeeded, fits, spareWeeks };
}

/** Kosten- und Ergebnisplan eines Projektprodukts (Material je Stück plus feste Kosten). */
export function projectCost(
  qty: number,
  materialPerPiece: number,
  fixedCost: number,
  sellPrice: number,
) {
  const materialTotal = money(qty * materialPerPiece);
  const totalCost = money(materialTotal + fixedCost);
  const costPerPiece = qty > 0 ? money(totalCost / qty) : 0;
  const revenue = money(qty * sellPrice);
  const result = money(revenue - totalCost);
  return { materialTotal, totalCost, costPerPiece, revenue, result };
}

export interface CareerTarget {
  name: string;
  body: string;
  /** Anforderungen: Technik/Handwerk, Kommunikation, Sorgfalt, Rechnen/Logik (je 1–6). */
  weights: [number, number, number, number];
}

export const CAREER_TARGETS: CareerTarget[] = [
  { name: "Kfz-Mechatroniker/in", body: "HWK", weights: [6, 3, 5, 4] },
  { name: "Kaufmann/-frau im Einzelhandel", body: "IHK", weights: [2, 6, 4, 4] },
  { name: "Zahnmedizinische/r Fachangestellte/r", body: "Zahnärztekammer", weights: [3, 5, 6, 3] },
];

/** Passung in Prozent: 100 % minus Abstand (Summe der Punktabweichungen, höchstens 20) in Prozent. */
export function careerProfileMatch(tech: number, social: number, care: number, logic: number) {
  const profile = [tech, social, care, logic];
  return CAREER_TARGETS.map((target) => {
    const distance = target.weights.reduce(
      (sum, req, idx) => sum + Math.abs(req - profile[idx]),
      0,
    );
    const fitPct = money(Math.max(0, 100 - (distance / 20) * 100));
    return { ...target, distance, fitPct };
  }).sort((a, b) => b.fitPct - a.fitPct);
}

/** Nachfrage am Marktstand: sinkt mit dem Preis, steigt mit Werbung (vereinfachtes Lernmodell). */
export const standDemand = (price: number, advertising: number): number =>
  Math.max(0, Math.round(200 - 50 * price + advertising));

/** Einfache Gewinn- und Verlustrechnung eines Marktstands. */
export function shopGuV(price: number, advertising: number, unitCost: number, standRent: number) {
  const sold = standDemand(price, advertising);
  const revenue = money(sold * price);
  const goodsCost = money(sold * unitCost);
  const expenses = money(goodsCost + standRent + advertising);
  const result = money(revenue - expenses);
  return { sold, revenue, goodsCost, standRent, advertising, expenses, result };
}

/** Einfacher Wirtschaftskreislauf mit Sparen: Einkommen = Konsum + Ersparnis. */
export function circularFlow(workers: number, monthlyWage: number, savingsPct: number) {
  const income = money(workers * monthlyWage);
  const saving = money(income * (savingsPct / 100));
  const consumption = money(income - saving);
  return { income, saving, consumption };
}

/** Zeitlohn gegen Akkordlohn (Minutenakkord, ohne Garantielohn) und Stundenverdienst. */
export function wageForms(
  baseRate: number,
  hours: number,
  normalPerHour: number,
  actualPerHour: number,
) {
  const timeWage = money(baseRate * hours);
  const pieces = Math.round(actualPerHour * hours);
  const pieceWage = normalPerHour > 0 ? money((pieces * baseRate) / normalPerHour) : 0;
  const performancePct = normalPerHour > 0 ? money((actualPerHour / normalPerHour) * 100) : 0;
  const pieceHourly = hours > 0 ? money(pieceWage / hours) : 0;
  return { timeWage, pieces, pieceWage, performancePct, pieceHourly };
}

/** Vereinfachte Lohnabrechnung: Lohnsteuer aus der Tabelle, Kirchensteuer als Prozentsatz davon. */
export function netPay(
  hourly: number,
  hours: number,
  incomeTax: number,
  churchMember: boolean,
  svPct: number,
  churchPct = 8,
) {
  const gross = money(hourly * hours);
  const churchTax = churchMember ? money(incomeTax * (churchPct / 100)) : 0;
  const taxes = money(incomeTax + churchTax);
  const social = money(gross * (svPct / 100));
  const net = money(gross - taxes - social);
  const minimumWageOk = hourly >= MINIMUM_WAGE;
  return { gross, incomeTax, churchTax, taxes, social, net, minimumWageOk };
}

/**
 * Arbeitszeit im Betriebspraktikum während der Vollzeitschulpflicht:
 * § 5 Abs. 2 Satz 2 JArbSchG verweist auf § 7 Satz 1 Nr. 2 (7 Std./Tag, 35 Std./Woche)
 * und die §§ 9 bis 46 (u. a. Pausen § 11, Schichtzeit § 12, 6–20 Uhr § 14, Fünf-Tage-Woche § 15).
 */
export function checkInternship(
  startHour: number,
  endHour: number,
  breakMinutes: number,
  daysPerWeek: number,
) {
  const shiftHours = money(endHour - startHour);
  const workHours = money(shiftHours - breakMinutes / 60);
  const weeklyHours = money(workHours * daysPerWeek);
  const requiredBreak = workHours > 6 ? 60 : workHours > 4.5 ? 30 : 0;
  const checks = {
    timeWindow: startHour >= 6 && endHour <= 20,
    daily: workHours <= 7,
    weekly: weeklyHours <= 35,
    breaks: breakMinutes >= requiredBreak,
    shift: shiftHours <= 10,
    days: daysPerWeek <= 5,
  };
  const violations: string[] = [];
  if (!checks.timeWindow) violations.push("Beschäftigung nur zwischen 6 und 20 Uhr (§ 14 Abs. 1 JArbSchG)");
  if (!checks.daily) violations.push("Höchstens 7 Std. täglich (§ 5 Abs. 2 mit § 7 Satz 1 Nr. 2 JArbSchG)");
  if (!checks.weekly) violations.push("Höchstens 35 Std. wöchentlich (§ 5 Abs. 2 mit § 7 Satz 1 Nr. 2 JArbSchG)");
  if (!checks.breaks) violations.push(`Mindestens ${requiredBreak} Min. Ruhepause (§ 11 Abs. 1 JArbSchG)`);
  if (!checks.shift) violations.push("Schichtzeit höchstens 10 Std. (§ 12 JArbSchG)");
  if (!checks.days) violations.push("Höchstens fünf Tage pro Woche (§ 15 JArbSchG)");
  return {
    shiftHours,
    workHours,
    weeklyHours,
    requiredBreak,
    checks,
    allowed: violations.length === 0 && workHours > 0,
    violations,
  };
}

/**
 * Lärm am Arbeitsplatz (vereinfacht): Pegel ohne Gehörschutz gegen die Auslösewerte
 * 80/85 dB(A) (§ 6 LärmVibrationsArbSchV) und Pegel am Ohr mit Gehörschutz (§ 8 Abs. 2).
 */
export function noiseExposure(
  machineDb: number,
  enclosure: boolean,
  protectionWorn: boolean,
  attenuationDb: number,
) {
  const workplaceDb = machineDb - (enclosure ? 10 : 0);
  const earDb = workplaceDb - (protectionWorn ? attenuationDb : 0);
  const zone =
    workplaceDb >= 85
      ? "oberer Auslösewert erreicht: Lärmbereich, Gehörschutz muss getragen werden"
      : workplaceDb >= 80
        ? "unterer Auslösewert erreicht: Gehörschutz muss bereitgestellt werden"
        : "unter den Auslösewerten";
  return { workplaceDb, earDb, zone, earOk: earDb < 85 };
}

/** Handarbeit gegen Maschine: Jahreskosten, Stückkosten und Kostengleichheitsmenge. */
export function productionCompare(
  annualQty: number,
  manualPerHour: number,
  wageRate: number,
  machineInvest: number,
  years: number,
  machinePerHour: number,
  operatorRate: number,
) {
  const manualHours = manualPerHour > 0 ? money(annualQty / manualPerHour) : 0;
  const machineHours = machinePerHour > 0 ? money(annualQty / machinePerHour) : 0;
  const manualCost = money(manualHours * wageRate);
  const depreciation = years > 0 ? money(machineInvest / years) : machineInvest;
  const machineCost = money(depreciation + machineHours * operatorRate);
  const manualPiece = annualQty > 0 ? money(manualCost / annualQty) : 0;
  const machinePiece = annualQty > 0 ? money(machineCost / annualQty) : 0;
  const saving =
    manualPerHour > 0 && machinePerHour > 0 ? wageRate / manualPerHour - operatorRate / machinePerHour : 0;
  const breakEvenQty = saving > 0 ? Math.ceil(depreciation / saving) : Infinity;
  const hoursSaved = money(manualHours - machineHours);
  return {
    manualHours,
    machineHours,
    manualCost,
    depreciation,
    machineCost,
    manualPiece,
    machinePiece,
    breakEvenQty,
    hoursSaved,
    machineCheaper: machineCost < manualCost,
  };
}

/** Nutzwertanalyse: Punkte (1–5) mal Gewicht in Prozent, Summe je Möglichkeit. */
export function weightedScore(points: number[], weightsPct: number[]): number {
  return money(points.reduce((sum, p, i) => sum + (p * (weightsPct[i] ?? 0)) / 100, 0));
}

/**
 * Mindestvergütung nach § 17 Abs. 2 BBiG: 2. Jahr +18 %, 3. Jahr +35 %, 4. Jahr +40 % auf den
 * Betrag des 1. Jahres; Aufschläge werden auf volle Euro gerundet (ab 0,50 € aufrunden).
 */
export const TRAINING_STEPS = [0, 18, 35, 40] as const;
export const trainingMinimum = (firstYear: number, year: 1 | 2 | 3 | 4): number =>
  Math.floor(money(firstYear * (1 + TRAINING_STEPS[year - 1] / 100)) + 0.5);
