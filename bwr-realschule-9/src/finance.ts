/** All money is rounded to cents at the point where a payment or posting occurs. */
export const money = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;
export const fmt = (amount: number) =>
  amount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  const annual = cost / years;
  let remaining = Math.round(cost * 100);
  const floor = memory ? 100 : 0;
  const rows: Array<{ year: number; depreciation: number; book: number }> = [];
  for (let year = 1; remaining > floor && year <= years + 2; year++) {
    const planned = Math.round(annual * 100 * (year === 1 ? (13 - month) / 12 : 1));
    const amount = year === years + 1 ? remaining - floor : Math.min(planned, remaining - floor);
    remaining -= amount;
    rows.push({ year, depreciation: amount / 100, book: remaining / 100 });
  }
  return { annual: money(annual), rate: 100 / years, rows };
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
  let balance = Math.round(principal * 100);
  const p = rate / 100;
  const annuity = Math.round(
    (p === 0 ? principal / years : (principal * p) / (1 - (1 + p) ** -years)) * 100,
  );
  const base = Math.floor(balance / years);
  const rows = [];
  for (let year = 1; year <= years; year++) {
    const interest = Math.round(balance * p);
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
  const saving = money((net * discount) / 100);
  const financed = money(net - saving);
  const interest = money((financed * annualRate * extraDays) / 36_000);
  return {
    saving,
    financed,
    interest,
    advantage: money(saving - interest),
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
  const net = money(gross / (1 + vatRate / 100));
  const grossLoss = money((gross * lossPercent) / 100);
  const netLoss = money(grossLoss / (1 + vatRate / 100));
  return {
    net,
    expectedLoss: money((net * lossPercent) / 100),
    netLoss,
    taxCorrection: money(grossLoss - netLoss),
    grossLoss,
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
