/** Round decimal inputs with integer fractions; model balances stay in cents. */
function decimalRatio(value: number): [bigint, bigint] {
  if (!Number.isFinite(value)) throw new Error("Geldbeträge müssen endliche Zahlen sein.");
  const [mantissa, exponent = "0"] = String(value).split("e");
  const [integer, fraction = ""] = mantissa.split(".");
  const units = BigInt(integer + fraction);
  const places = fraction.length - Number(exponent);
  return places >= 0 ? [units, 10n ** BigInt(places)] : [units * 10n ** BigInt(-places), 1n];
}

/** Commercial rounding: an exact half cent rounds away from zero. */
function roundQuotient(numerator: bigint, denominator: bigint): number {
  if (denominator < 0n) return roundQuotient(-numerator, -denominator);
  const sign = numerator < 0n ? -1n : 1n;
  return Number(sign * ((sign * numerator * 2n + denominator) / (denominator * 2n)));
}

export function toCents(amount: number): number {
  const [units, scale] = decimalRatio(amount);
  return roundQuotient(units * 100n, scale);
}

/** cents × numerator ÷ denominator, rounded once to a whole cent. */
export function mulDiv(cents: number, numerator: number, denominator: number): number {
  const [nu, ns] = decimalRatio(numerator);
  const [du, ds] = decimalRatio(denominator);
  if (du === 0n) throw new Error("Division durch null.");
  return roundQuotient(BigInt(cents) * nu * ds, du * ns);
}

/** Share of a base in percent, exact to two decimals. */
export function percentOf(partCents: number, baseCents: number): number {
  if (baseCents <= 0) throw new Error("Die Bezugsgröße muss positiv sein.");
  return roundQuotient(BigInt(partCents) * 10_000n, BigInt(baseCents)) / 100;
}

export const money = (amount: number) => toCents(amount) / 100;
export const euro = (cents: number) => cents / 100;

/** German notation with the real minus sign (U+2212). */
export const fmt = (amount: number) =>
  amount
    .toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace("-", "−");

/** Whole numbers such as quantities: no decimals, German grouping. */
export const fmtInt = (amount: number) =>
  amount.toLocaleString("de-DE", { maximumFractionDigits: 0 }).replace("-", "−");

const positive = (n: number) => Number.isFinite(n) && n > 0 && n <= 100_000_000;
const nonNegative = (n: number) => Number.isFinite(n) && n >= 0 && n <= 100_000_000;

/** Household income vs. fixed, variable and extra wish expenses. */
export function householdBudget(income: number, fixed: number, variable: number, wish = 0) {
  if (!positive(income) || ![fixed, variable, wish].every(nonNegative)) {
    throw new Error("Einkommen muss positiv und Ausgaben dürfen nicht negativ sein.");
  }
  const incC = toCents(income);
  const expC = toCents(fixed) + toCents(variable) + toCents(wish);
  const balC = incC - expC;
  return {
    totalExpenses: euro(expC),
    balance: euro(balC),
    savingsRate: percentOf(balC, incC),
  };
}

/** Percentage value P = G · p : 100. */
export function percentValue(base: number, rate: number) {
  if (!nonNegative(base) || !Number.isFinite(rate) || rate < 0 || rate > 1000) {
    throw new Error("Grundwert und Prozentsatz prüfen.");
  }
  return euro(mulDiv(toCents(base), rate, 100));
}

/** Percentage rate p = P · 100 : G. */
export function percentRate(part: number, base: number) {
  if (!nonNegative(part) || !positive(base)) {
    throw new Error("Prozentwert und positiven Grundwert prüfen.");
  }
  return percentOf(toCents(part), toCents(base));
}

/** Base value G = P · 100 : p. */
export function percentBase(part: number, rate: number) {
  if (!nonNegative(part) || !positive(rate)) {
    throw new Error("Prozentwert und positiven Prozentsatz prüfen.");
  }
  return euro(mulDiv(toCents(part), 100, rate));
}

/** Increased or reduced base value G+ = G · (100 + p) : 100 / G− = G · (100 − p) : 100. */
export function changedBase(base: number, rate: number, mode: "inc" | "dec") {
  if (!nonNegative(base) || !Number.isFinite(rate) || rate < 0 || (mode === "dec" && rate >= 100)) {
    throw new Error("Grundwert und Änderungsprozentsatz prüfen.");
  }
  const factor = mode === "inc" ? 100 + rate : 100 - rate;
  return euro(mulDiv(toCents(base), factor, 100));
}

/** Original base value from an increased or reduced value. */
export function originalBase(changed: number, rate: number, mode: "inc" | "dec") {
  if (!nonNegative(changed) || !Number.isFinite(rate) || rate < 0 || (mode === "dec" && rate >= 100)) {
    throw new Error("Veränderten Grundwert und Prozentsatz prüfen.");
  }
  const factor = mode === "inc" ? 100 + rate : 100 - rate;
  return euro(mulDiv(toCents(changed), 100, factor));
}

/** Weighted scoring comparison for two business locations; weights must total 100 %. */
export function weightedLocation(scoresA: number[], scoresB: number[], weights: number[]) {
  if (
    !weights.length ||
    scoresA.length !== weights.length ||
    scoresB.length !== weights.length ||
    weights.some((w) => !nonNegative(w)) ||
    scoresA.some((s) => !Number.isFinite(s) || s < 0 || s > 10) ||
    scoresB.some((s) => !Number.isFinite(s) || s < 0 || s > 10)
  ) {
    throw new Error("Bewertungspunkte und Gewichte prüfen.");
  }
  const weightSum = weights.reduce((sum, w) => sum + toCents(w), 0);
  if (weightSum !== 10_000) {
    throw new Error("Die Gewichte müssen zusammen genau 100 % ergeben.");
  }
  const sumA = scoresA.reduce((acc, s, i) => acc + BigInt(toCents(s)) * BigInt(toCents(weights[i])), 0n);
  const sumB = scoresB.reduce((acc, s, i) => acc + BigInt(toCents(s)) * BigInt(toCents(weights[i])), 0n);
  const scoreACents = roundQuotient(sumA, 10_000n);
  const scoreBCents = roundQuotient(sumB, 10_000n);
  return {
    scoreA: euro(scoreACents),
    scoreB: euro(scoreBCents),
    diff: euro(scoreACents - scoreBCents),
  };
}

/** Summarise fixed assets, current assets, debts and equity for an inventory. */
export function inventarTotals(avItems: number[], uvItems: number[], debtItems: number[]) {
  if (![...avItems, ...uvItems, ...debtItems].every(nonNegative)) {
    throw new Error("Inventarwerte dürfen nicht negativ sein.");
  }
  const avC = avItems.reduce((s, x) => s + toCents(x), 0);
  const uvC = uvItems.reduce((s, x) => s + toCents(x), 0);
  const assetsC = avC + uvC;
  const debtsC = debtItems.reduce((s, x) => s + toCents(x), 0);
  const eqC = assetsC - debtsC;
  return {
    av: euro(avC),
    uv: euro(uvC),
    assets: euro(assetsC),
    debts: euro(debtsC),
    equity: euro(eqC),
  };
}

export interface BalanceState {
  av: number;
  uv: number;
  ek: number;
  lbkv: number;
  ve: number;
}
export type ShiftKind = "aktivtausch" | "passivtausch" | "mehrung" | "minderung";

/** Apply one of the four balance-sheet transformations while keeping Aktiva = Passiva. */
export function balanceShift(base: BalanceState, kind: ShiftKind, amount: number) {
  if (!Object.values(base).every(nonNegative) || !positive(amount)) {
    throw new Error("Bilanzwerte und Betrag prüfen.");
  }
  const av = toCents(base.av);
  const uv = toCents(base.uv);
  const ek = toCents(base.ek);
  const lbkv = toCents(base.lbkv);
  const ve = toCents(base.ve);
  if (av + uv !== ek + lbkv + ve) {
    throw new Error("Die Ausgangsbilanz ist nicht ausgeglichen.");
  }
  const a = toCents(amount);
  let nextAv = av;
  let nextUv = uv;
  let nextLbkv = lbkv;
  let nextVe = ve;
  switch (kind) {
    case "aktivtausch":
      if (uv < a) throw new Error("Umlaufvermögen reicht für diesen Aktivtausch nicht aus.");
      nextAv += a;
      nextUv -= a;
      break;
    case "passivtausch":
      if (ve < a) throw new Error("Verbindlichkeiten (VE) reichen für die Umwandlung nicht aus.");
      nextLbkv += a;
      nextVe -= a;
      break;
    case "mehrung":
      nextAv += a;
      nextVe += a;
      break;
    case "minderung":
      if (uv < a || ve < a) throw new Error("Umlaufvermögen oder Verbindlichkeiten reichen für die Minderung nicht aus.");
      nextUv -= a;
      nextVe -= a;
      break;
  }
  const beforeTotal = av + uv;
  const afterTotal = nextAv + nextUv;
  return {
    av: euro(nextAv),
    uv: euro(nextUv),
    ek: euro(ek),
    lbkv: euro(nextLbkv),
    ve: euro(nextVe),
    total: euro(afterTotal),
    deltaTotal: euro(afterTotal - beforeTotal),
  };
}

/** Close a single active or passive balance-sheet T-account and return its closing balance (SB). */
export function tAccountClosing(
  kind: "active" | "passive",
  ab: number,
  additions: number[],
  reductions: number[],
) {
  if (!nonNegative(ab) || !additions.every(nonNegative) || !reductions.every(nonNegative)) {
    throw new Error("Kontowerte dürfen nicht negativ sein.");
  }
  const abC = toCents(ab);
  const addC = additions.reduce((s, x) => s + toCents(x), 0);
  const redC = reductions.reduce((s, x) => s + toCents(x), 0);
  const grossSideC = abC + addC;
  const balanceC = grossSideC - redC;
  if (balanceC < 0) {
    throw new Error("Die Abgänge übersteigen den verfügbaren Bestand.");
  }
  return {
    sideTotal: euro(grossSideC),
    debitEntries: euro(kind === "active" ? grossSideC : redC),
    creditEntries: euro(kind === "passive" ? grossSideC : redC),
    balance: euro(balanceC),
  };
}

/** Calculate VAT and gross amount from net amount (standard 19 % or reduced 7 %). */
export function vatFromNet(net: number, rate: 7 | 19 = 19) {
  if (!nonNegative(net) || ![7, 19].includes(rate)) {
    throw new Error("Nettobetrag und Steuersatz (7 % oder 19 %) prüfen.");
  }
  const netC = toCents(net);
  const vatC = mulDiv(netC, rate, 100);
  return {
    net: euro(netC),
    vat: euro(vatC),
    gross: euro(netC + vatC),
  };
}

/** Calculate net amount and VAT from a gross invoice total. */
export function vatFromGross(gross: number, rate: 7 | 19 = 19) {
  if (!nonNegative(gross) || ![7, 19].includes(rate)) {
    throw new Error("Bruttobetrag und Steuersatz (7 % oder 19 %) prüfen.");
  }
  const grossC = toCents(gross);
  const netC = mulDiv(grossC, 100, 100 + rate);
  return {
    net: euro(netC),
    vat: euro(grossC - netC),
    gross: euro(grossC),
  };
}

/** Procurement offer with immediate supplier rebate (Sofortrabatt) and VAT. */
export function offerPrice(listPrice: number, discountRate: number, vatRate: 7 | 19 = 19) {
  if (
    !nonNegative(listPrice) ||
    !Number.isFinite(discountRate) ||
    discountRate < 0 ||
    discountRate >= 100 ||
    ![7, 19].includes(vatRate)
  ) {
    throw new Error("Listenpreis, Rabattsatz und Steuersatz prüfen.");
  }
  const listC = toCents(listPrice);
  const discountC = mulDiv(listC, discountRate, 100);
  const netC = listC - discountC;
  const vatC = mulDiv(netC, vatRate, 100);
  return {
    listPrice: euro(listC),
    discount: euro(discountC),
    net: euro(netC),
    vat: euro(vatC),
    gross: euro(netC + vatC),
  };
}

/** Period profit or loss from revenues and expenses. */
export function periodOutcome(revenues: number[], expenses: number[]) {
  if (![...revenues, ...expenses].every(nonNegative)) {
    throw new Error("Erträge und Aufwendungen dürfen nicht negativ sein.");
  }
  const revC = revenues.reduce((s, x) => s + toCents(x), 0);
  const expC = expenses.reduce((s, x) => s + toCents(x), 0);
  const diffC = revC - expC;
  return {
    totalRevenue: euro(revC),
    totalExpense: euro(expC),
    result: euro(diffC),
    absResult: euro(Math.abs(diffC)),
    kind: (diffC > 0 ? "profit" : diffC < 0 ? "loss" : "even") as "profit" | "loss" | "even",
  };
}

/** Inventory discrepancy between book stock (Sollbestand) and counted stock (Istbestand). */
export function inventoryDiff(bookQty: number, actualQty: number, unitPrice: number) {
  if (!Number.isInteger(bookQty) || bookQty < 0 || !Number.isInteger(actualQty) || actualQty < 0 || !positive(unitPrice)) {
    throw new Error("Sollbestand, Istbestand (ganze Stück) und Stückpreis prüfen.");
  }
  const qtyDiff = actualQty - bookQty;
  const valueC = toCents(unitPrice) * qtyDiff;
  return {
    qtyDiff,
    valueDiff: euro(valueC),
    absValueDiff: euro(Math.abs(valueC)),
    kind: (qtyDiff < 0 ? "shortage" : qtyDiff > 0 ? "surplus" : "match") as "shortage" | "surplus" | "match",
  };
}

/** Accounts of the official ISB Kontenplan (LehrplanPLUS) used in BwR 7. */
export const ACCOUNTS: Record<string, string> = {
  "0500": "GR · Grundstücke",
  "0530": "BVG · Betriebs- und Verwaltungsgebäude",
  "0700": "MA · Maschinen und Anlagen",
  "0840": "FP · Fuhrpark",
  "0860": "BM · Büromaschinen",
  "0870": "BGA · Büromöbel und Geschäftsausstattung",
  "2000": "R · Rohstoffe (Fertigungsmaterial)",
  "2010": "F · Fremdbauteile",
  "2020": "H · Hilfsstoffe",
  "2030": "B · Betriebsstoffe",
  "2400": "FO · Forderungen aus Lieferungen und Leistungen",
  "2600": "VORST · Vorsteuer",
  "2800": "BK · Bank (Kontokorrentkonto)",
  "2880": "KA · Kasse",
  "3000": "EK · Eigenkapital",
  "4200": "KBKV · Kurzfristige Bankverbindlichkeiten (bis zu einem Jahr)",
  "4250": "LBKV · Langfristige Bankverbindlichkeiten",
  "4400": "VE · Verbindlichkeiten aus Lieferungen und Leistungen",
  "4800": "UST · Umsatzsteuer",
  "5000": "UEFE · Umsatzerlöse für eigene Erzeugnisse",
  "6000": "AWR · Aufwendungen für Rohstoffe",
  "6010": "AWF · Aufwendungen für Fremdbauteile",
  "6020": "AWH · Aufwendungen für Hilfsstoffe",
  "6030": "AWB · Aufwendungen für Betriebsstoffe",
  "8010": "SBK · Schlussbilanzkonto",
  "8020": "GUV · Gewinn- und Verlustkonto",
};
