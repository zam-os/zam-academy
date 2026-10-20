import { lit } from "../exercises/format";
import type { AppLocale, TableKey } from "../model/types";

/**
 * The sample database: a small online shop, the example LehrplanPLUS IT
 * 2.3.1/2.3.2 itself names (Kunden, Produkte, Bestellungen). German is the
 * key language in code; `ident`, `val` and `q` give the English twin, so the
 * same lesson runs against `kunden.nachname` or `customers.last_name`.
 */

/** German identifier → English identifier (tables and columns). */
const IDENTIFIERS: Record<string, string> = {
  kunden: "customers",
  produkte: "products",
  bestellungen: "orders",
  positionen: "order_items",
  bestellungen_flach: "orders_flat",
  adressen_roh: "raw_addresses",

  kunden_id: "customer_id",
  vorname: "first_name",
  nachname: "last_name",
  strasse: "street",
  hausnummer: "house_number",
  plz: "postcode",
  ort: "city",
  geburtsdatum: "birth_date",
  newsletter: "newsletter",

  produkt_id: "product_id",
  bezeichnung: "name",
  kategorie: "category",
  preis: "price",
  lagerbestand: "stock",

  bestell_id: "order_id",
  bestelldatum: "order_date",
  status: "status",

  position_id: "item_id",
  menge: "quantity",

  name_komplett: "full_name",
  adresse: "address",

  // Tables and columns the learner creates in tasks.
  mitglieder: "members",
  mitglied_id: "member_id",
  eintritt: "joined_on",
  beitrag: "fee",
  buecher: "books",
  buch_id: "book_id",
  titel: "title",
  autor: "author",
  seiten: "pages",
  erscheinungsjahr: "published_year",
  ausleihen: "loans",
  ausleih_id: "loan_id",
  rueckgabe: "return_date",
  kurse: "courses",
  kurs_id: "course_id",
  teilnahmen: "enrolments",
  teilnahme_id: "enrolment_id",
  geraete: "devices",
  geraet_id: "device_id",
  seriennummer: "serial_number",
  anzahl: "count",
  gesamt: "total",
  umsatz: "revenue",
  anrede: "greeting",
  durchschnitt: "average",
};

/** German value → English value (categories, statuses, product names). */
const VALUES: Record<string, string> = {
  Schule: "School",
  Elektronik: "Electronics",
  Sport: "Sports",
  Bücher: "Books",
  Haushalt: "Household",
  offen: "open",
  versendet: "shipped",
  geliefert: "delivered",
  storniert: "cancelled",
  Schulrucksack: "School backpack",
  Füller: "Fountain pen",
  Taschenrechner: "Calculator",
  Kopfhörer: "Headphones",
  "USB-Stick 64 GB": "USB stick 64 GB",
  Fußball: "Football",
  Trinkflasche: "Water bottle",
  "Formelsammlung Mathematik": "Maths formula book",
  Wandkalender: "Wall calendar",
  "Lineal 30 cm": "Ruler 30 cm",
  Powerbank: "Power bank",
  // Products the tasks let the learner add.
  Geodreieck: "Set square",
  "Bluetooth-Lautsprecher": "Bluetooth speaker",
  Springseil: "Skipping rope",
  Atlas: "Atlas",
  Schreibtischlampe: "Desk lamp",
  // Words the lessons build text from.
  Hallo: "Hello",
};

/** The locale's name of a table or column, by its German key. */
export function ident(locale: AppLocale, key: string): string {
  const en = IDENTIFIERS[key];
  if (en === undefined) throw new Error(`unknown identifier token: ${key}`);
  return locale === "de" ? key : en;
}

/** The locale's spelling of a stored value, by its German key. */
export function val(locale: AppLocale, key: string): string {
  const en = VALUES[key];
  if (en === undefined) throw new Error(`unknown value token: ${key}`);
  return locale === "de" ? key : en;
}

/**
 * Resolves `{token}`s in an SQL or prompt template: identifiers
 * (`{kunden}` → customers) and stored values (`{Schule}` → School).
 */
export function q(locale: AppLocale, template: string): string {
  return template.replace(/\{([^{}]+)\}/g, (_match, token: string) => {
    if (token in IDENTIFIERS) return ident(locale, token);
    if (token in VALUES) return val(locale, token);
    throw new Error(`unknown template token: {${token}}`);
  });
}

export interface Customer {
  id: number;
  vorname: string;
  nachname: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  geburtsdatum: string;
  newsletter: 0 | 1;
}

export const CUSTOMERS: Customer[] = [
  { id: 1, vorname: "Anna", nachname: "Berg", strasse: "Hauptstraße", hausnummer: "5", plz: "89073", ort: "Ulm", geburtsdatum: "2009-03-14", newsletter: 1 },
  { id: 2, vorname: "Ben", nachname: "Huber", strasse: "Bahnhofstraße", hausnummer: "12", plz: "86150", ort: "Augsburg", geburtsdatum: "2008-11-02", newsletter: 0 },
  { id: 3, vorname: "Clara", nachname: "Fischer", strasse: "Domplatz", hausnummer: "3", plz: "93047", ort: "Regensburg", geburtsdatum: "2009-07-21", newsletter: 1 },
  { id: 4, vorname: "David", nachname: "Maier", strasse: "Königstraße", hausnummer: "48", plz: "90402", ort: "Nürnberg", geburtsdatum: "2008-01-30", newsletter: 0 },
  { id: 5, vorname: "Elif", nachname: "Yilmaz", strasse: "Leopoldstraße", hausnummer: "110", plz: "80802", ort: "München", geburtsdatum: "2009-05-09", newsletter: 1 },
  { id: 6, vorname: "Finn", nachname: "Wagner", strasse: "Juliuspromenade", hausnummer: "7", plz: "97070", ort: "Würzburg", geburtsdatum: "2010-02-17", newsletter: 0 },
  { id: 7, vorname: "Greta", nachname: "Schulz", strasse: "Obere Brücke", hausnummer: "2", plz: "96049", ort: "Bamberg", geburtsdatum: "2009-09-28", newsletter: 1 },
  { id: 8, vorname: "Hannah", nachname: "Becker", strasse: "Residenzplatz", hausnummer: "8", plz: "94032", ort: "Passau", geburtsdatum: "2008-06-05", newsletter: 0 },
  { id: 9, vorname: "Ivan", nachname: "Petrov", strasse: "Max-Josefs-Platz", hausnummer: "1", plz: "83022", ort: "Rosenheim", geburtsdatum: "2009-12-12", newsletter: 1 },
  { id: 10, vorname: "Jana", nachname: "Hoffmann", strasse: "Theresienstraße", hausnummer: "23", plz: "85049", ort: "Ingolstadt", geburtsdatum: "2008-08-19", newsletter: 1 },
  { id: 11, vorname: "Karim", nachname: "Nasser", strasse: "Söflinger Straße", hausnummer: "100", plz: "89077", ort: "Ulm", geburtsdatum: "2010-04-01", newsletter: 0 },
  { id: 12, vorname: "Lea", nachname: "Bergmann", strasse: "Hauptstraße", hausnummer: "19", plz: "86159", ort: "Augsburg", geburtsdatum: "2009-10-23", newsletter: 0 },
  { id: 13, vorname: "Moritz", nachname: "Klein", strasse: "Prager Straße", hausnummer: "4", plz: "01069", ort: "Dresden", geburtsdatum: "2009-01-15", newsletter: 1 },
];

export interface Product {
  id: number;
  /** German name; a key of `VALUES`. */
  name: string;
  /** German category; a key of `VALUES`. */
  kategorie: string;
  preis: number;
  lagerbestand: number;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "Schulrucksack", kategorie: "Schule", preis: 49.9, lagerbestand: 25 },
  { id: 2, name: "Füller", kategorie: "Schule", preis: 12.5, lagerbestand: 80 },
  { id: 3, name: "Taschenrechner", kategorie: "Schule", preis: 24.99, lagerbestand: 40 },
  { id: 4, name: "Kopfhörer", kategorie: "Elektronik", preis: 59, lagerbestand: 15 },
  { id: 5, name: "USB-Stick 64 GB", kategorie: "Elektronik", preis: 9.99, lagerbestand: 120 },
  { id: 6, name: "Fußball", kategorie: "Sport", preis: 19.95, lagerbestand: 30 },
  { id: 7, name: "Trinkflasche", kategorie: "Sport", preis: 14.9, lagerbestand: 60 },
  { id: 8, name: "Formelsammlung Mathematik", kategorie: "Bücher", preis: 8.5, lagerbestand: 50 },
  { id: 9, name: "Wandkalender", kategorie: "Haushalt", preis: 6.99, lagerbestand: 0 },
  { id: 10, name: "Lineal 30 cm", kategorie: "Schule", preis: 1.49, lagerbestand: 200 },
  { id: 11, name: "Powerbank", kategorie: "Elektronik", preis: 29.9, lagerbestand: 8 },
];

export interface Order {
  id: number;
  kunde: number;
  datum: string;
  /** German status; a key of `VALUES`. */
  status: string;
}

export const ORDERS: Order[] = [
  { id: 101, kunde: 1, datum: "2026-09-02", status: "geliefert" },
  { id: 102, kunde: 3, datum: "2026-09-03", status: "geliefert" },
  { id: 103, kunde: 1, datum: "2026-09-10", status: "versendet" },
  { id: 104, kunde: 5, datum: "2026-09-11", status: "geliefert" },
  { id: 105, kunde: 7, datum: "2026-09-15", status: "storniert" },
  { id: 106, kunde: 2, datum: "2026-09-18", status: "geliefert" },
  { id: 107, kunde: 9, datum: "2026-09-20", status: "versendet" },
  { id: 108, kunde: 5, datum: "2026-09-22", status: "offen" },
  { id: 109, kunde: 10, datum: "2026-09-25", status: "geliefert" },
  { id: 110, kunde: 3, datum: "2026-09-28", status: "offen" },
  { id: 111, kunde: 12, datum: "2026-10-01", status: "versendet" },
  { id: 112, kunde: 1, datum: "2026-10-03", status: "offen" },
  { id: 113, kunde: 8, datum: "2026-10-05", status: "offen" },
  { id: 114, kunde: 5, datum: "2026-10-07", status: "offen" },
];

export interface OrderItem {
  id: number;
  bestellung: number;
  produkt: number;
  menge: number;
}

export const ORDER_ITEMS: OrderItem[] = [
  { id: 1, bestellung: 101, produkt: 1, menge: 1 },
  { id: 2, bestellung: 101, produkt: 2, menge: 2 },
  { id: 3, bestellung: 101, produkt: 10, menge: 3 },
  { id: 4, bestellung: 102, produkt: 8, menge: 1 },
  { id: 5, bestellung: 102, produkt: 3, menge: 1 },
  { id: 6, bestellung: 103, produkt: 5, menge: 2 },
  { id: 7, bestellung: 104, produkt: 4, menge: 1 },
  { id: 8, bestellung: 104, produkt: 5, menge: 1 },
  { id: 9, bestellung: 104, produkt: 11, menge: 1 },
  { id: 10, bestellung: 105, produkt: 6, menge: 1 },
  { id: 11, bestellung: 106, produkt: 7, menge: 2 },
  { id: 12, bestellung: 106, produkt: 6, menge: 1 },
  { id: 13, bestellung: 107, produkt: 1, menge: 1 },
  { id: 14, bestellung: 107, produkt: 3, menge: 1 },
  { id: 15, bestellung: 107, produkt: 10, menge: 2 },
  { id: 16, bestellung: 108, produkt: 2, menge: 1 },
  { id: 17, bestellung: 109, produkt: 8, menge: 2 },
  { id: 18, bestellung: 109, produkt: 10, menge: 5 },
  { id: 19, bestellung: 110, produkt: 4, menge: 1 },
  { id: 20, bestellung: 111, produkt: 7, menge: 1 },
  { id: 21, bestellung: 111, produkt: 5, menge: 3 },
  { id: 22, bestellung: 112, produkt: 6, menge: 1 },
  { id: 23, bestellung: 113, produkt: 1, menge: 1 },
  { id: 24, bestellung: 113, produkt: 8, menge: 1 },
  { id: 25, bestellung: 114, produkt: 11, menge: 1 },
  { id: 26, bestellung: 114, produkt: 4, menge: 1 },
];

/** Every city a customer lives in, in id order without repeats. */
export const CITIES: string[] = [...new Set(CUSTOMERS.map((c) => c.ort))];
/** Cities with more than one customer. */
export const SHARED_CITIES: string[] = CITIES.filter(
  (city) => CUSTOMERS.filter((c) => c.ort === city).length > 1,
);
/** German category keys, in product order without repeats. */
export const CATEGORIES: string[] = [...new Set(PRODUCTS.map((p) => p.kategorie))];
/** German status keys that occur in orders. */
export const STATUSES: string[] = ["offen", "versendet", "geliefert", "storniert"];

/** Customers with at least one order, and those without. */
export const CUSTOMERS_WITH_ORDERS: Customer[] = CUSTOMERS.filter((c) =>
  ORDERS.some((o) => o.kunde === c.id),
);
export const CUSTOMERS_WITHOUT_ORDERS: Customer[] = CUSTOMERS.filter(
  (c) => !ORDERS.some((o) => o.kunde === c.id),
);
/** Products nobody ordered. */
export const PRODUCTS_NEVER_ORDERED: Product[] = PRODUCTS.filter(
  (p) => !ORDER_ITEMS.some((i) => i.produkt === p.id),
);

export const SHOP_TABLES: TableKey[] = ["kunden", "produkte", "bestellungen", "positionen"];

const DDL: Record<TableKey, string> = {
  kunden: `CREATE TABLE {kunden} (
  {kunden_id} INTEGER PRIMARY KEY,
  {vorname} TEXT NOT NULL,
  {nachname} TEXT NOT NULL,
  {strasse} TEXT,
  {hausnummer} TEXT,
  {plz} TEXT,
  {ort} TEXT,
  {geburtsdatum} TEXT,
  {newsletter} INTEGER NOT NULL DEFAULT 0
);`,
  produkte: `CREATE TABLE {produkte} (
  {produkt_id} INTEGER PRIMARY KEY,
  {bezeichnung} TEXT NOT NULL,
  {kategorie} TEXT NOT NULL,
  {preis} REAL NOT NULL CHECK ({preis} >= 0),
  {lagerbestand} INTEGER NOT NULL DEFAULT 0 CHECK ({lagerbestand} >= 0)
);`,
  bestellungen: `CREATE TABLE {bestellungen} (
  {bestell_id} INTEGER PRIMARY KEY,
  {kunden_id} INTEGER NOT NULL REFERENCES {kunden} ({kunden_id}),
  {bestelldatum} TEXT NOT NULL,
  {status} TEXT NOT NULL DEFAULT '{offen}'
    CHECK ({status} IN ('{offen}', '{versendet}', '{geliefert}', '{storniert}'))
);`,
  positionen: `CREATE TABLE {positionen} (
  {position_id} INTEGER PRIMARY KEY,
  {bestell_id} INTEGER NOT NULL REFERENCES {bestellungen} ({bestell_id}),
  {produkt_id} INTEGER NOT NULL REFERENCES {produkte} ({produkt_id}),
  {menge} INTEGER NOT NULL CHECK ({menge} > 0)
);`,
  bestellungen_flach: `CREATE TABLE {bestellungen_flach} (
  {bestell_id} INTEGER,
  {bestelldatum} TEXT,
  {vorname} TEXT,
  {nachname} TEXT,
  {ort} TEXT,
  {bezeichnung} TEXT,
  {preis} REAL,
  {menge} INTEGER
);`,
  adressen_roh: `CREATE TABLE {adressen_roh} (
  id INTEGER PRIMARY KEY,
  {name_komplett} TEXT,
  {adresse} TEXT
);`,
};

function rows(table: string, columns: string[], values: Array<Array<string | number | null>>): string {
  if (values.length === 0) return "";
  const body = values.map((row) => `  (${row.map(lit).join(", ")})`).join(",\n");
  return `INSERT INTO ${table} (${columns.join(", ")}) VALUES\n${body};`;
}

function insertsFor(locale: AppLocale, table: TableKey): string {
  const n = (key: string) => ident(locale, key);
  const v = (key: string) => val(locale, key);
  const customer = (id: number) => CUSTOMERS.find((c) => c.id === id)!;
  const product = (id: number) => PRODUCTS.find((p) => p.id === id)!;
  const order = (id: number) => ORDERS.find((o) => o.id === id)!;
  switch (table) {
    case "kunden":
      return rows(
        n("kunden"),
        ["kunden_id", "vorname", "nachname", "strasse", "hausnummer", "plz", "ort", "geburtsdatum", "newsletter"].map(n),
        CUSTOMERS.map((c) => [c.id, c.vorname, c.nachname, c.strasse, c.hausnummer, c.plz, c.ort, c.geburtsdatum, c.newsletter]),
      );
    case "produkte":
      return rows(
        n("produkte"),
        ["produkt_id", "bezeichnung", "kategorie", "preis", "lagerbestand"].map(n),
        PRODUCTS.map((p) => [p.id, v(p.name), v(p.kategorie), p.preis, p.lagerbestand]),
      );
    case "bestellungen":
      return rows(
        n("bestellungen"),
        ["bestell_id", "kunden_id", "bestelldatum", "status"].map(n),
        ORDERS.map((o) => [o.id, o.kunde, o.datum, v(o.status)]),
      );
    case "positionen":
      return rows(
        n("positionen"),
        ["position_id", "bestell_id", "produkt_id", "menge"].map(n),
        ORDER_ITEMS.map((i) => [i.id, i.bestellung, i.produkt, i.menge]),
      );
    case "bestellungen_flach":
      return rows(
        n("bestellungen_flach"),
        ["bestell_id", "bestelldatum", "vorname", "nachname", "ort", "bezeichnung", "preis", "menge"].map(n),
        ORDER_ITEMS.map((i) => {
          const o = order(i.bestellung);
          const c = customer(o.kunde);
          const p = product(i.produkt);
          return [o.id, o.datum, c.vorname, c.nachname, c.ort, v(p.name), p.preis, i.menge];
        }),
      );
    case "adressen_roh":
      return rows(
        n("adressen_roh"),
        ["id", n("name_komplett"), n("adresse")],
        CUSTOMERS.slice(0, 6).map((c) => [c.id, `${c.vorname} ${c.nachname}`, `${c.strasse} ${c.hausnummer}, ${c.plz} ${c.ort}`]),
      );
  }
}

/** Referenced tables first, so foreign keys can be declared. */
const TABLE_ORDER: TableKey[] = ["kunden", "produkte", "bestellungen", "positionen", "bestellungen_flach", "adressen_roh"];

/** The SQL that builds a fresh database with the given tables, in the locale's names. */
export function setupSql(locale: AppLocale, tables: TableKey[]): string {
  const wanted = TABLE_ORDER.filter((table) => tables.includes(table));
  const parts = ["PRAGMA foreign_keys = ON;"];
  for (const table of wanted) parts.push(q(locale, DDL[table]));
  for (const table of wanted) parts.push(insertsFor(locale, table));
  return parts.filter(Boolean).join("\n");
}

export interface ColumnDescription {
  name: string;
  type: string;
  pk: boolean;
  /** "table.column" the column references, when it is a foreign key. */
  fk?: string;
}

export interface TableDescription {
  key: TableKey;
  name: string;
  columns: ColumnDescription[];
  rowCount: number;
}

const COLUMNS: Record<TableKey, Array<{ key: string; type: string; pk?: boolean; fk?: [TableKey, string] }>> = {
  kunden: [
    { key: "kunden_id", type: "INTEGER", pk: true },
    { key: "vorname", type: "TEXT" },
    { key: "nachname", type: "TEXT" },
    { key: "strasse", type: "TEXT" },
    { key: "hausnummer", type: "TEXT" },
    { key: "plz", type: "TEXT" },
    { key: "ort", type: "TEXT" },
    { key: "geburtsdatum", type: "TEXT" },
    { key: "newsletter", type: "INTEGER" },
  ],
  produkte: [
    { key: "produkt_id", type: "INTEGER", pk: true },
    { key: "bezeichnung", type: "TEXT" },
    { key: "kategorie", type: "TEXT" },
    { key: "preis", type: "REAL" },
    { key: "lagerbestand", type: "INTEGER" },
  ],
  bestellungen: [
    { key: "bestell_id", type: "INTEGER", pk: true },
    { key: "kunden_id", type: "INTEGER", fk: ["kunden", "kunden_id"] },
    { key: "bestelldatum", type: "TEXT" },
    { key: "status", type: "TEXT" },
  ],
  positionen: [
    { key: "position_id", type: "INTEGER", pk: true },
    { key: "bestell_id", type: "INTEGER", fk: ["bestellungen", "bestell_id"] },
    { key: "produkt_id", type: "INTEGER", fk: ["produkte", "produkt_id"] },
    { key: "menge", type: "INTEGER" },
  ],
  bestellungen_flach: [
    { key: "bestell_id", type: "INTEGER" },
    { key: "bestelldatum", type: "TEXT" },
    { key: "vorname", type: "TEXT" },
    { key: "nachname", type: "TEXT" },
    { key: "ort", type: "TEXT" },
    { key: "bezeichnung", type: "TEXT" },
    { key: "preis", type: "REAL" },
    { key: "menge", type: "INTEGER" },
  ],
  adressen_roh: [
    { key: "id", type: "INTEGER", pk: true },
    { key: "name_komplett", type: "TEXT" },
    { key: "adresse", type: "TEXT" },
  ],
};

const ROW_COUNTS: Record<TableKey, number> = {
  kunden: CUSTOMERS.length,
  produkte: PRODUCTS.length,
  bestellungen: ORDERS.length,
  positionen: ORDER_ITEMS.length,
  bestellungen_flach: ORDER_ITEMS.length,
  adressen_roh: 6,
};

/** What the schema browser shows for the given tables. */
export function describeTables(locale: AppLocale, tables: TableKey[]): TableDescription[] {
  return TABLE_ORDER.filter((table) => tables.includes(table)).map((table) => ({
    key: table,
    name: ident(locale, table),
    rowCount: ROW_COUNTS[table],
    columns: COLUMNS[table].map((column) => ({
      name: column.key === "id" ? "id" : ident(locale, column.key),
      type: column.type,
      pk: Boolean(column.pk),
      ...(column.fk ? { fk: `${ident(locale, column.fk[0])}.${ident(locale, column.fk[1])}` } : {}),
    })),
  }));
}
