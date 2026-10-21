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
  const sign = numerator < 0n ? -1n : 1n;
  return Number(sign * ((sign * numerator * 2n + denominator) / (denominator * 2n)));
}
function toCents(amount: number): number {
  const [units, scale] = decimalRatio(amount);
  return roundQuotient(units * 100n, scale);
}
function portionCents(cents: number, multiplier: number, divisor: number): number {
  const [units, scale] = decimalRatio(multiplier);
  return roundQuotient(BigInt(cents) * units, BigInt(divisor) * scale);
}
export const money = (amount: number) => toCents(amount) / 100;
export const fmt = (amount: number) =>
  amount.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const positive = (n: number) => Number.isFinite(n) && n > 0 && n <= 10_000_000;
export function depreciation(cost: number, years: number, month = 1, memory = false) {
  if (
    !positive(cost) ||
    !Number.isInteger(years) ||
    years < 1 ||
    years > 50 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    (memory && cost < 1)
  )
    throw new Error("Kosten, volle Nutzungsjahre und Anschaffungsmonat prüfen.");
  const costCents = toCents(cost);
  const annualCents = portionCents(costCents, 1, years);
  let remaining = costCents;
  const floor = memory ? 100 : 0;
  const lastYear = month === 1 ? years : years + 1;
  const rows: Array<{ year: number; depreciation: number; book: number }> = [];
  for (let year = 1; remaining > floor && year <= lastYear; year++) {
    const planned = year === 1 ? portionCents(annualCents, 13 - month, 12) : annualCents;
    const amount = year === lastYear ? remaining - floor : Math.min(planned, remaining - floor);
    remaining -= amount;
    rows.push({ year, depreciation: amount / 100, book: remaining / 100 });
  }
  return { annual: annualCents / 100, rate: 100 / years, rows };
}
export type LoanType = "fixed" | "instalment" | "annuity";
export function loanSchedule(principal: number, rate: number, years: number, kind: LoanType) {
  if (
    !positive(principal) ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    rate > 30 ||
    !Number.isInteger(years) ||
    years < 1 ||
    years > 30 ||
    !["fixed", "instalment", "annuity"].includes(kind)
  )
    throw new Error("Kreditsumme, Zinssatz und volle Laufzeitjahre prüfen.");
  let balance = toCents(principal);
  const p = rate / 100;
  const annuity =
    p === 0
      ? portionCents(balance, 1, years)
      : toCents(((balance / 100) * p) / (1 - (1 + p) ** -years));
  const base = Math.floor(balance / years);
  const rows = [];
  for (let year = 1; year <= years; year++) {
    const interest = portionCents(balance, rate, 100);
    const redemption =
      year === years
        ? balance
        : Math.min(
            balance,
            kind === "fixed" ? 0 : kind === "instalment" ? base : annuity - interest,
          );
    balance -= redemption;
    rows.push({
      year,
      interest: interest / 100,
      redemption: redemption / 100,
      payment: (interest + redemption) / 100,
      balance: balance / 100,
    });
  }
  return rows;
}
/** Net-only classroom comparison; not the actual gross temporary funding need. */
export function supplierCredit(
  net: number,
  discount: number,
  annualRate: number,
  extraDays: number,
) {
  if (
    !positive(net) ||
    !Number.isFinite(discount) ||
    discount <= 0 ||
    discount >= 100 ||
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    annualRate > 50 ||
    !Number.isInteger(extraDays) ||
    extraDays <= 0 ||
    extraDays > 360
  )
    throw new Error(
      "Es braucht einen positiven Preisnachlass und zusätzliche Kredittage von 1 bis 360.",
    );
  const netCents = toCents(net);
  const savingCents = portionCents(netCents, discount, 100);
  const financedCents = netCents - savingCents;
  const interestCents = portionCents(financedCents * extraDays, annualRate, 36_000);
  return {
    saving: savingCents / 100,
    financed: financedCents / 100,
    interest: interestCents / 100,
    advantage: (savingCents - interestCents) / 100,
    annualized: (((discount / (100 - discount)) * 360) / extraDays) * 100,
  };
}
export function claimAmounts(gross: number, vatRate: number, lossPercent: number) {
  if (
    !positive(gross) ||
    ![0, 7, 19].includes(vatRate) ||
    !Number.isFinite(lossPercent) ||
    lossPercent < 0 ||
    lossPercent > 100
  )
    throw new Error("Bruttoforderung, Steuersatz und Ausfallquote prüfen.");
  const grossCents = toCents(gross);
  const netCents = portionCents(grossCents, 100, 100 + vatRate);
  const grossLossCents = portionCents(grossCents, lossPercent, 100);
  const netLossCents = portionCents(grossLossCents, 100, 100 + vatRate);
  return {
    net: netCents / 100,
    expectedLoss: portionCents(netCents, lossPercent, 100) / 100,
    netLoss: netLossCents / 100,
    taxCorrection: (grossLossCents - netLossCents) / 100,
    grossLoss: grossLossCents / 100,
  };
}
export const ACCOUNTS: Record<string, string> = {
  "0700": "MA · Maschinen und Anlagen",
  "0860": "BM · Büromaschinen",
  "0890": "GWG · Geringwertige Wirtschaftsgüter",
  "1500": "WP · Wertpapiere des Anlagevermögens",
  "2400": "FO · Forderungen",
  "2470": "ZWFO · Zweifelhafte Forderungen",
  "2600": "VORST · Vorsteuer",
  "2800": "BK · Bank",
  "3000": "EK · Eigenkapital",
  "3001": "P · Privatkonto",
  "3670": "EWB · Einzelwertberichtigung",
  "3680": "PWB · Pauschalwertberichtigung",
  "4250": "LBKV · Langfristige Bankverbindlichkeiten",
  "4400": "VE · Verbindlichkeiten aus Lieferungen und Leistungen",
  "4800": "UST · Umsatzsteuer",
  "5000": "UEFE · Umsatzerlöse eigene Erzeugnisse",
  "5400": "EMP · Erträge aus Mieten und Pachten",
  "5430": "ASBE · Andere sonstige betriebliche Erträge",
  "5495": "EFO · Erträge aus abgeschriebenen Forderungen",
  "5650": "EAWP · Erträge aus Wertpapierabgang",
  "5710": "ZE · Zinserträge",
  "5780": "DDE · Dividendenerträge",
  "6000": "AWR · Aufwendungen für Rohstoffe",
  "6160": "FRI · Fremdinstandhaltung",
  "6520": "ABSA · Abschreibungen auf Sachanlagen",
  "6540": "ABGWG · Abschreibungen auf GWG",
  "6700": "AWMP · Mieten und Pachten",
  "6750": "KGV · Kosten des Geldverkehrs",
  "6800": "BMK · Büromaterial und Kleingüter",
  "6900": "VBEI · Versicherungsbeiträge",
  "6950": "ABFO · Abschreibungen auf Forderungen",
  "7460": "VAWP · Verluste aus Wertpapierabgang",
  "7510": "ZAW · Zinsaufwendungen",
};
