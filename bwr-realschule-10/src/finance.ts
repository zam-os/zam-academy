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
/** Share of a base in percent, exact to two decimals (e.g. a ratio or an overhead rate). */
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
const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
export const monthName = (month: number) => MONTHS[month - 1] ?? "";

/**
 * A payment in the old year for `months` months starting on the first of
 * `startMonth`. The part that falls into the new year is deferred (ARA/PRA);
 * the school model defers at most into the following year.
 */
export function accrual(amount: number, startMonth: number, months: number) {
  if (
    !positive(amount) ||
    !Number.isInteger(startMonth) ||
    startMonth < 1 ||
    startMonth > 12 ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 12
  )
    throw new Error("Betrag, Beginnmonat (1–12) und Laufzeit (1–12 Monate) prüfen.");
  const oldMonths = Math.min(months, 13 - startMonth);
  const newMonths = months - oldMonths;
  const totalCents = toCents(amount);
  const newCents = mulDiv(totalCents, newMonths, months);
  return {
    oldMonths,
    newMonths,
    oldPart: euro(totalCents - newCents),
    newPart: euro(newCents),
  };
}

export type ReleaseCase = "equal" | "income" | "expense";
/** Settling a provision with a net invoice plus input VAT; the provision itself is net. */
export function provisionRelease(provision: number, net: number, vatRate = 19) {
  if (!positive(provision) || !positive(net) || ![0, 7, 19].includes(vatRate))
    throw new Error("Rückstellung, Nettorechnungsbetrag und Steuersatz prüfen.");
  const rst = toCents(provision),
    netCents = toCents(net),
    vat = mulDiv(netCents, vatRate, 100);
  const kind: ReleaseCase = netCents === rst ? "equal" : netCents < rst ? "income" : "expense";
  return {
    kind,
    vat: euro(vat),
    gross: euro(netCents + vat),
    difference: euro(Math.abs(netCents - rst)),
  };
}

export interface Condensed {
  av: number;
  vorraete: number;
  forderungen: number;
  fluessig: number;
  ek: number;
  lfk: number;
  kfk: number;
}
/** The five ratios of BwR 10, each in percent with two decimals. */
export function ratios(b: Condensed, profit: number, equityStart: number) {
  const c = (x: number) => toCents(x);
  if (Object.values(b).some((x) => !Number.isFinite(x) || x < 0) || c(b.kfk) <= 0 || c(b.av) <= 0)
    throw new Error("Bilanzposten prüfen: keine negativen Werte, Anlagevermögen und kurzfristiges Fremdkapital größer null.");
  if (!positive(equityStart)) throw new Error("Das Eigenkapital zu Beginn muss positiv sein.");
  return {
    cash: percentOf(c(b.fluessig), c(b.kfk)),
    quick: percentOf(c(b.fluessig) + c(b.forderungen), c(b.kfk)),
    coverage1: percentOf(c(b.ek), c(b.av)),
    coverage2: percentOf(c(b.ek) + c(b.lfk), c(b.av)),
    roe: percentOf(c(profit), c(equityStart)),
  };
}

/**
 * Distribute an overhead total in proportion to a key (largest remainder):
 * every share is first rounded down to the cent, then the missing cents go one
 * by one to the largest remainders. No share is negative and a key of zero
 * always gets zero.
 */
export function distribute(total: number, weights: number[]) {
  if (!positive(total) || weights.some((w) => !Number.isFinite(w) || w < 0))
    throw new Error("Gemeinkosten und Schlüsselwerte prüfen.");
  // Keys such as m² or kWh are exact to a millionth here.
  const keys = weights.map((w) => BigInt(Math.round(w * 1_000_000)));
  const sum = keys.reduce((s, k) => s + k, 0n);
  if (sum <= 0n) throw new Error("Gemeinkosten und Schlüsselwerte prüfen.");
  const cents = BigInt(toCents(total));
  const shares = keys.map((k) => (cents * k) / sum);
  const rest = keys.map((k, i) => ({ i, r: (cents * k) % sum }));
  let missing = Number(cents - shares.reduce((s, x) => s + x, 0n));
  for (const { i } of rest.filter((x) => x.r > 0n).sort((a, b) => (b.r > a.r ? 1 : b.r < a.r ? -1 : a.i - b.i))) {
    if (missing === 0) break;
    shares[i] += 1n;
    missing--;
  }
  return shares.map((x) => Number(x) / 100);
}

export interface CalcInput {
  fm: number;
  mgk: number;
  fl: number;
  fgk: number;
  sek: number;
  vwvt: number;
  profit: number;
  discount: number;
  rebate: number;
}
/**
 * Zuschlagskalkulation of one order up to the Listenverkaufspreis.
 * Every step is rounded to the cent and the next step builds on the rounded value.
 */
export function calculation(x: CalcInput) {
  if (
    [x.fm, x.fl].some((v) => !Number.isFinite(v) || v < 0) ||
    x.fm + x.fl <= 0 ||
    [x.mgk, x.fgk, x.sek, x.vwvt, x.profit].some((v) => !Number.isFinite(v) || v < 0 || v > 1000) ||
    [x.discount, x.rebate].some((v) => !Number.isFinite(v) || v < 0 || v >= 50)
  )
    throw new Error("Einzelkosten, Zuschlagssätze sowie Skonto und Rabatt (unter 50 %) prüfen.");
  const fm = toCents(x.fm),
    mgk = mulDiv(fm, x.mgk, 100),
    mk = fm + mgk,
    fl = toCents(x.fl),
    fgk = mulDiv(fl, x.fgk, 100),
    sek = toCents(x.sek),
    fk = fl + fgk + sek,
    hk = mk + fk,
    vwvt = mulDiv(hk, x.vwvt, 100),
    sk = hk + vwvt,
    profit = mulDiv(sk, x.profit, 100),
    bvp = sk + profit,
    zvp = mulDiv(bvp, 100, 100 - x.discount),
    lvp = mulDiv(zvp, 100, 100 - x.rebate);
  return {
    fm: euro(fm),
    mgk: euro(mgk),
    mk: euro(mk),
    fl: euro(fl),
    fgk: euro(fgk),
    sek: euro(sek),
    fk: euro(fk),
    hk: euro(hk),
    vwvt: euro(vwvt),
    sk: euro(sk),
    profit: euro(profit),
    bvp: euro(bvp),
    discount: euro(zvp - bvp),
    zvp: euro(zvp),
    rebate: euro(lvp - zvp),
    lvp: euro(lvp),
  };
}

/** Gewinnschwellenmenge: fixed costs over unit contribution, always rounded up. */
export function breakEven(fixed: number, price: number, variable: number) {
  const kf = toCents(fixed),
    p = toCents(price),
    kv = toCents(variable);
  if (!positive(fixed) || !positive(price) || !Number.isFinite(variable) || variable < 0)
    throw new Error("Fixkosten, Preis und variable Stückkosten prüfen.");
  const db = p - kv;
  if (db <= 0) return { db: euro(db), quantity: Infinity };
  return { db: euro(db), quantity: Number((BigInt(kf) + BigInt(db) - 1n) / BigInt(db)) };
}
/** Betriebsergebnis for a quantity in a one-product firm. */
export function operatingResult(fixed: number, price: number, variable: number, quantity: number) {
  return euro((toCents(price) - toCents(variable)) * quantity - toCents(fixed));
}
/** Make or buy: total costs for a quantity and the quantity at which both are equal. */
export function makeOrBuy(fixed: number, variable: number, purchase: number, quantity: number) {
  if (
    !positive(fixed) ||
    !Number.isFinite(variable) ||
    variable < 0 ||
    !positive(purchase) ||
    !Number.isInteger(quantity) ||
    quantity < 0
  )
    throw new Error("Fixkosten, variable Stückkosten, Einstandspreis und Menge prüfen.");
  const kf = toCents(fixed),
    kv = toCents(variable),
    ep = toCents(purchase);
  return {
    make: euro(kf + kv * quantity),
    buy: euro(ep * quantity),
    critical: ep > kv ? kf / (ep - kv) : Infinity,
  };
}

/** Accounts of the ISB Kontenplan (LehrplanPLUS) used in this course. */
export const ACCOUNTS: Record<string, string> = {
  "0700": "MA · Maschinen und Anlagen",
  "0840": "FP · Fuhrpark",
  "2400": "FO · Forderungen aus Lieferungen und Leistungen",
  "2600": "VORST · Vorsteuer",
  "2800": "BK · Bank",
  "2900": "ARA · Aktive Rechnungsabgrenzung",
  "3000": "EK · Eigenkapital",
  "3001": "P · Privatkonto",
  "3900": "RST · Rückstellungen",
  "4250": "LBKV · Langfristige Bankverbindlichkeiten",
  "4400": "VE · Verbindlichkeiten aus Lieferungen und Leistungen",
  "4800": "UST · Umsatzsteuer",
  "4900": "PRA · Passive Rechnungsabgrenzung",
  "5000": "UEFE · Umsatzerlöse für eigene Erzeugnisse",
  "5400": "EMP · Erlöse aus Vermietung und Verpachtung",
  "5490": "PFE · Periodenfremde Erträge",
  "5710": "ZE · Zinserträge",
  "6000": "AWR · Aufwendungen für Rohstoffe",
  "6160": "FRI · Fremdinstandhaltung",
  "6700": "AWMP · Mieten, Pachten",
  "6770": "RBK · Rechts- und Beratungskosten",
  "6870": "WER · Werbung",
  "6900": "VBEI · Versicherungsbeiträge",
  "6990": "PFAW · Periodenfremde Aufwendungen",
  "7030": "KFZST · Kraftfahrzeugsteuer",
  "7510": "ZAW · Zinsaufwendungen",
  "8010": "SBK · Schlussbilanzkonto",
  "8020": "GUV · Gewinn- und Verlustkonto",
};
