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

export function projectBudgetPlan(
  teamSize: number,
  prepHoursPerPerson: number,
  fixedCost: number,
  unitCost: number,
  sellPrice: number,
  demandQty: number,
) {
  const totalPrepHours = money(teamSize * prepHoursPerPerson);
  const contribution = money(sellPrice - unitCost);
  const breakEvenQty = contribution > 0 ? Math.ceil(fixedCost / contribution) : Infinity;
  const revenue = money(demandQty * sellPrice);
  const variableTotal = money(demandQty * unitCost);
  const totalCost = money(fixedCost + variableTotal);
  const surplus = money(revenue - totalCost);
  const returnPerHour = totalPrepHours > 0 ? money(surplus / totalPrepHours) : 0;
  return {
    totalPrepHours,
    contribution,
    breakEvenQty,
    revenue,
    variableTotal,
    totalCost,
    surplus,
    returnPerHour,
  };
}

export function workplaceScore(
  lightNoise: number,
  ergonomics: number,
  tools: number,
  breaksHours: number,
) {
  const total = money(
    (lightNoise * 25 + ergonomics * 30 + tools * 25 + breaksHours * 20) / 100,
  );
  return {
    lightNoise,
    ergonomics,
    tools,
    breaksHours,
    total,
    weakPoints: [
      ...(lightNoise <= 2 ? ["Licht/Lärm"] : []),
      ...(ergonomics <= 2 ? ["Ergonomie"] : []),
      ...(tools <= 2 ? ["Arbeitsmittel"] : []),
      ...(breaksHours <= 2 ? ["Arbeitszeit/Pausen"] : []),
    ],
  };
}

export function selfEmployedResult(
  billableHours: number,
  hourlyRate: number,
  materialPct: number,
  monthlyFixed: number,
) {
  const revenue = money(billableHours * hourlyRate);
  const materialCost = money(revenue * (materialPct / 100));
  const grossMargin = money(revenue - materialCost);
  const profit = money(grossMargin - monthlyFixed);
  const marginPct = revenue > 0 ? money((profit / revenue) * 100) : 0;
  return { revenue, materialCost, grossMargin, profit, marginPct };
}

export interface CareerTarget {
  name: string;
  body: string;
  weights: [number, number, number, number];
}

export const CAREER_TARGETS: CareerTarget[] = [
  {
    name: "Elektroniker/in (Handwerk)",
    body: "HWK",
    weights: [6, 3, 5, 3],
  },
  {
    name: "Kauffrau/-mann für Büromanagement",
    body: "IHK",
    weights: [3, 4, 6, 3],
  },
  {
    name: "Medizinische/r Fachangestellte/r",
    body: "Ärztekammer",
    weights: [3, 6, 5, 2],
  },
];

export function careerProfileMatch(
  tech: number,
  social: number,
  care: number,
  creative: number,
) {
  const profile = [tech, social, care, creative];
  const matches = CAREER_TARGETS.map((target) => {
    const distance = target.weights.reduce(
      (sum, req, idx) => sum + Math.abs(req - profile[idx]),
      0,
    );
    const fitPct = money(Math.max(0, 100 - (distance / 20) * 100));
    return { ...target, distance, fitPct };
  }).sort((a, b) => b.fitPct - a.fitPct);
  return matches;
}

export function trainingMonthlyBudget(
  allowance: number,
  travelCost: number,
  workGear: number,
  reservePct: number,
) {
  const reserve = money(allowance * (reservePct / 100));
  const available = money(allowance - travelCost - workGear - reserve);
  return { allowance, travelCost, workGear, reserve, available };
}

export function workTimeHours(price: number, netHourlyWage: number): number {
  return netHourlyWage > 0 ? money(price / netHourlyWage) : Infinity;
}

export function livingStandardSplit(
  netIncome: number,
  basicCosts: number,
) {
  const basicRatioPct = netIncome > 0 ? money((basicCosts / netIncome) * 100) : 0;
  const freeIncome = money(netIncome - basicCosts);
  const freeRatioPct = netIncome > 0 ? money((freeIncome / netIncome) * 100) : 0;
  return { netIncome, basicCosts, basicRatioPct, freeIncome, freeRatioPct };
}

export function fourWeekBudget(
  weeklyIncome: number,
  weeklyFixed: number,
  weeklyVariable: number,
  fourWeekGoal: number,
) {
  const income4 = money(weeklyIncome * 4);
  const fixed4 = money(weeklyFixed * 4);
  const variable4 = money(weeklyVariable * 4);
  const expenses4 = money(fixed4 + variable4);
  const surplus4 = money(income4 - expenses4);
  const saveRatePct = income4 > 0 ? money((surplus4 / income4) * 100) : 0;
  const gapToGoal = money(fourWeekGoal - surplus4);
  return {
    income4,
    fixed4,
    variable4,
    expenses4,
    surplus4,
    saveRatePct,
    fourWeekGoal,
    gapToGoal,
  };
}

export function unitPrice(price: number, amount: number): number {
  return amount > 0 ? money(price / amount) : 0;
}

export function marketState(price: number, demandShift: number, supplyCap: number) {
  const demandQty = Math.max(0, Math.round(120 + demandShift - 25 * price));
  const supplyQty = Math.max(0, Math.round(supplyCap + 20 * price - 30));
  const tradedQty = Math.min(demandQty, supplyQty);
  const excessDemand = Math.max(0, demandQty - supplyQty);
  const excessSupply = Math.max(0, supplyQty - demandQty);
  const revenue = money(tradedQty * price);
  const stateLabel =
    excessDemand > 2
      ? "Nachfrageüberhang (Preis steigt tendenziell)"
      : excessSupply > 2
        ? "Angebotsüberhang (Preis sinkt tendenziell)"
        : "Marktgleichgewicht";
  return {
    price,
    demandQty,
    supplyQty,
    tradedQty,
    excessDemand,
    excessSupply,
    revenue,
    stateLabel,
  };
}

export function schoolSaleOutcome(
  buyQty: number,
  unitCost: number,
  sellPrice: number,
  demandFactorPct: number,
  standCost = 10,
) {
  const demandQty = Math.round(buyQty * (demandFactorPct / 100));
  const soldQty = Math.min(buyQty, demandQty);
  const unsoldQty = Math.max(0, buyQty - soldQty);
  const revenue = money(soldQty * sellPrice);
  const purchaseCost = money(buyQty * unitCost);
  const expense = money(purchaseCost + standCost);
  const surplus = money(revenue - expense);
  return {
    buyQty,
    demandQty,
    soldQty,
    unsoldQty,
    revenue,
    purchaseCost,
    standCost,
    expense,
    surplus,
  };
}

export function checkHolidayJob(
  age: number,
  hoursPerDay: number,
  daysPerWeek: number,
  weeksPerYear: number,
  breakMinutes: number,
) {
  const ageOk = age >= 15;
  const dailyHoursOk = hoursPerDay <= 8;
  const weeklyHours = money(hoursPerDay * daysPerWeek);
  const weeklyHoursOk = weeklyHours <= 40;
  const daysOk = daysPerWeek <= 5;
  const weeksOk = weeksPerYear <= 4;
  const requiredBreak = hoursPerDay > 6 ? 60 : hoursPerDay > 4.5 ? 30 : 0;
  const breakOk = breakMinutes >= requiredBreak;
  const violations: string[] = [];
  if (!ageOk) violations.push("Mindestalter 15 Jahre für Ferienjobs (§ 5 Abs. 4 JArbSchG)");
  if (!dailyHoursOk) violations.push("Höchstens 8 Std. täglich (§ 8 Abs. 1 JArbSchG)");
  if (!weeklyHoursOk) violations.push("Höchstens 40 Std. wöchentlich (§ 8 Abs. 1 JArbSchG)");
  if (!daysOk) violations.push("Fünf-Tage-Woche (§ 15 JArbSchG)");
  if (!weeksOk) violations.push("Höchstens 4 Wochen pro Kalenderjahr (§ 5 Abs. 4 JArbSchG)");
  if (!breakOk)
    violations.push(`Mindestens ${requiredBreak} Min. Ruhepause (§ 11 Abs. 1 JArbSchG)`);
  return {
    age,
    hoursPerDay,
    daysPerWeek,
    weeksPerYear,
    breakMinutes,
    weeklyHours,
    requiredBreak,
    ageOk,
    dailyHoursOk,
    weeklyHoursOk,
    daysOk,
    weeksOk,
    breakOk,
    allowed: violations.length === 0,
    violations,
  };
}

export function applianceUsageCost(
  watts: number,
  hoursPerWeek: number,
  standbyWatts: number,
  centsPerKwh: number,
  purchasePrice: number,
) {
  const standbyHoursPerWeek = Math.max(0, 168 - hoursPerWeek);
  const activeKwhYear = money((watts * hoursPerWeek * 52) / 1000);
  const standbyKwhYear = money((standbyWatts * standbyHoursPerWeek * 52) / 1000);
  const totalKwhYear = money(activeKwhYear + standbyKwhYear);
  const priceEuro = centsPerKwh / 100;
  const activeCostYear = money(activeKwhYear * priceEuro);
  const standbyCostYear = money(standbyKwhYear * priceEuro);
  const totalCostYear = money(activeCostYear + standbyCostYear);
  const standbySharePct = totalKwhYear > 0 ? money((standbyKwhYear / totalKwhYear) * 100) : 0;
  const fiveYearCost = money(purchasePrice + totalCostYear * 5);
  return {
    activeKwhYear,
    standbyKwhYear,
    totalKwhYear,
    activeCostYear,
    standbyCostYear,
    totalCostYear,
    standbySharePct,
    fiveYearCost,
  };
}
