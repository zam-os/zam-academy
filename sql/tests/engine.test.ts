import initSqlJs, { type SqlJsStatic } from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";
import {
  CUSTOMERS,
  CUSTOMERS_WITHOUT_ORDERS,
  ORDER_ITEMS,
  ORDERS,
  PRODUCTS,
  PRODUCTS_NEVER_ORDERED,
  SHOP_TABLES,
  describeTables,
  q,
  setupSql,
} from "../src/db/dataset";
import {
  affinityGroup,
  compareResults,
  createDatabase,
  dumpTable,
  firstKeyword,
  normalizeCell,
  runSql,
  sameSchema,
  tableNames,
  tableSchema,
} from "../src/db/engine";
import type { AppLocale, ResultSet } from "../src/model/types";

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

const ALL_TABLES = [...SHOP_TABLES, "bestellungen_flach", "adressen_roh"] as const;

function count(db: ReturnType<typeof createDatabase>, locale: AppLocale, table: string): number {
  const outcome = runSql(db, q(locale, `SELECT count(*) FROM {${table}};`));
  if (!outcome.ok) throw new Error(outcome.error);
  return Number(outcome.results[0].values[0][0]);
}

describe("the sample database", () => {
  for (const locale of ["de", "en"] as const) {
    it(`builds in ${locale} with every table, row and foreign key`, () => {
      const db = createDatabase(SQL, setupSql(locale, [...ALL_TABLES]));
      expect(count(db, locale, "kunden")).toBe(CUSTOMERS.length);
      expect(count(db, locale, "produkte")).toBe(PRODUCTS.length);
      expect(count(db, locale, "bestellungen")).toBe(ORDERS.length);
      expect(count(db, locale, "positionen")).toBe(ORDER_ITEMS.length);
      expect(count(db, locale, "bestellungen_flach")).toBe(ORDER_ITEMS.length);
      expect(count(db, locale, "adressen_roh")).toBe(6);

      // Foreign keys are enforced from the start.
      const orphan = runSql(
        db,
        q(locale, "INSERT INTO {bestellungen} ({bestell_id}, {kunden_id}, {bestelldatum}) VALUES (999, 999, '2026-10-20');"),
      );
      expect(orphan.ok).toBe(false);
      if (!orphan.ok) expect(orphan.error).toMatch(/FOREIGN KEY/);

      // A primary key refuses a duplicate.
      const duplicate = runSql(
        db,
        q(locale, "INSERT INTO {kunden} ({kunden_id}, {vorname}, {nachname}) VALUES (1, 'X', 'Y');"),
      );
      expect(duplicate.ok).toBe(false);
      if (!duplicate.ok) expect(duplicate.error).toMatch(/UNIQUE/);

      // The schema browser names what the database holds.
      for (const table of describeTables(locale, [...ALL_TABLES])) {
        const schema = tableSchema(db, table.name);
        expect(schema, table.name).not.toBeNull();
        expect(schema!.map((c) => c.name).sort()).toEqual(table.columns.map((c) => c.name.toLowerCase()).sort());
        expect(table.rowCount).toBe(count(db, locale, table.key));
      }
      db.close();
    });
  }

  it("has customers without orders and a product nobody ordered, for outer joins", () => {
    expect(CUSTOMERS_WITHOUT_ORDERS.map((c) => c.id)).toEqual([4, 6, 11, 13]);
    expect(PRODUCTS_NEVER_ORDERED.map((p) => p.id)).toEqual([9]);
    expect(CUSTOMERS.find((c) => c.ort === "Dresden")?.plz.startsWith("0")).toBe(true);
  });
});

describe("runSql", () => {
  it("returns columns for a query without rows and counts changes only for data statements", () => {
    const db = createDatabase(SQL, setupSql("en", SHOP_TABLES));
    const none = runSql(db, "SELECT first_name FROM customers WHERE city = 'Nowhere';");
    expect(none.ok).toBe(true);
    if (none.ok) expect(none.results).toEqual([{ columns: ["first_name"], values: [] }]);

    const multi = runSql(
      db,
      "UPDATE products SET price = price WHERE product_id <= 3; CREATE TABLE t (a INTEGER); SELECT 1 AS one;",
    );
    expect(multi.ok).toBe(true);
    if (multi.ok) {
      expect(multi.statements).toBe(3);
      expect(multi.changes).toBe(3);
      expect(multi.results).toEqual([{ columns: ["one"], values: [1] }].map((r) => ({ ...r, values: [[1]] })));
    }

    const broken = runSql(db, "SELEC 1;");
    expect(broken.ok).toBe(false);
    if (!broken.ok) expect(broken.error).toMatch(/syntax error/);

    const partial = runSql(db, "DELETE FROM order_items WHERE item_id = 1; DELETE FROM customers WHERE customer_id = 1;");
    expect(partial.ok).toBe(false);
    if (!partial.ok) expect(partial.failedSql).toBe("DELETE FROM customers WHERE customer_id = 1;");
    expect(count(db, "en", "positionen")).toBe(ORDER_ITEMS.length - 1);
    db.close();
  });

  it("counts changes after a leading comment and in a WITH statement", () => {
    const db = createDatabase(SQL, setupSql("de", SHOP_TABLES));
    const commented = runSql(db, "-- Preis senken\nUPDATE produkte SET preis = 8.99 WHERE produkt_id = 5;");
    expect(commented.ok && commented.changes).toBe(1);
    const withCte = runSql(db, "WITH alt AS (SELECT 1) /* zwei */ DELETE FROM positionen WHERE bestell_id = 101;");
    expect(withCte.ok && withCte.changes).toBe(3);
    const ddl = runSql(db, "CREATE TABLE t (a INTEGER); DROP TABLE t;");
    expect(ddl.ok && ddl.changes).toBe(0);
    db.close();
  });

  it("names the statement that failed, also when it does not compile", () => {
    const db = createDatabase(SQL, setupSql("de", SHOP_TABLES));
    const broken = runSql(db, "SELECT 1;\n-- dann\nINSERT INTO kunden (vorname) VALUES ('X'); SELECT 2;");
    expect(broken.ok).toBe(false);
    if (!broken.ok) expect(firstKeyword(broken.failedSql)).toBe("INSERT");
    const typo = runSql(db, "SELECT 1; SELEC 2;");
    expect(typo.ok).toBe(false);
    if (!typo.ok) expect(typo.failedSql).toBe("SELEC 2;");
    expect(firstKeyword("/* a */ -- b\n  delete from x")).toBe("DELETE");
    db.close();
  });

  it("stops a result that runs away instead of freezing the page", () => {
    const db = createDatabase(SQL, setupSql("de", SHOP_TABLES));
    const endless = runSql(db, "WITH RECURSIVE c(x) AS (SELECT 1 UNION ALL SELECT x + 1 FROM c) SELECT x FROM c;");
    expect(endless.ok).toBe(false);
    if (!endless.ok) expect(endless.error).toMatch(/more than 10000 rows/);
    const cross = runSql(db, "SELECT * FROM positionen a, positionen b, positionen c;", 1000);
    expect(cross.ok).toBe(false);
    db.close();
  });

  it("lists the user tables", () => {
    const db = createDatabase(SQL, setupSql("en", SHOP_TABLES));
    expect(tableNames(db)).toEqual(["customers", "order_items", "orders", "products"]);
    db.close();
  });
});

describe("compareResults", () => {
  const expected: ResultSet = { columns: ["a", "b"], values: [[1, "x"], [2, "y"]] };
  it("matches columns by name when the names are there, else by position", () => {
    expect(compareResults({ columns: ["b", "a"], values: [["y", 2], ["x", 1]] }, expected, false)).toBeNull();
    expect(compareResults({ columns: ["c", "d"], values: [[2, "y"], [1, "x"]] }, expected, false)).toBeNull();
    expect(compareResults({ columns: ["a", "b"], values: [[2, "y"], [1, "x"]] }, expected, true)).toBe("order");
    expect(compareResults({ columns: ["a"], values: [[1], [2]] }, expected, false)).toBe("columns");
    expect(compareResults({ columns: ["a", "b"], values: [[1, "x"]] }, expected, false)).toBe("row-count");
    expect(compareResults({ columns: ["a", "b"], values: [[1, "x"], [3, "y"]] }, expected, false)).toBe("rows");
  });
  it("treats 49.9 and 49.90 and '49.9' alike, but keeps a leading zero", () => {
    expect(compareResults({ columns: ["p"], values: [[49.9]] }, { columns: ["p"], values: [["49.90"]] }, false)).toBeNull();
    expect(compareResults({ columns: ["p"], values: [[60]] }, { columns: ["p"], values: [[60.0]] }, false)).toBeNull();
    expect(normalizeCell("01069")).toBe("01069");
    expect(normalizeCell("0.5")).toBe("0.50");
    expect(compareResults({ columns: ["plz"], values: [[1069]] }, { columns: ["plz"], values: [["01069"]] }, false)).toBe("rows");
  });
  it("matches the named columns by name and the others by position", () => {
    const grouped: ResultSet = { columns: ["kategorie", "AVG(preis)"], values: [["Sport", 17.425], ["Schule", 22.22]] };
    expect(compareResults({ columns: ["n", "kategorie"], values: [[17.425, "Sport"], [22.22, "Schule"]] }, grouped, false)).toBeNull();
    const twice: ResultSet = { columns: ["nachname", "nachname"], values: [["A", "B"]] };
    expect(compareResults({ columns: ["nachname", "nachname"], values: [["A", "B"]] }, twice, false)).toBeNull();
    expect(compareResults({ columns: ["nachname", "nachname"], values: [["B", "A"]] }, twice, false)).toBe("rows");
  });
});

describe("schemas", () => {
  it("folds declared types into SQLite affinity groups and compares tables by them", () => {
    expect(affinityGroup("INTEGER")).toBe("INTEGER");
    expect(affinityGroup("int")).toBe("INTEGER");
    expect(affinityGroup("VARCHAR(50)")).toBe("TEXT");
    expect(affinityGroup("TEXT")).toBe("TEXT");
    expect(affinityGroup("REAL")).toBe("DECIMAL");
    expect(affinityGroup("DECIMAL(6,2)")).toBe("DECIMAL");
    expect(affinityGroup("DATE")).toBe("DECIMAL");
    expect(affinityGroup("")).toBe("BLOB");

    const db = createDatabase(SQL, "CREATE TABLE a (id INTEGER PRIMARY KEY, name VARCHAR(40), price DECIMAL(6,2));");
    runSql(db, "CREATE TABLE b (price REAL, NAME TEXT, id INT PRIMARY KEY);");
    runSql(db, "CREATE TABLE c (id INTEGER, name TEXT, price REAL);");
    expect(sameSchema(tableSchema(db, "a")!, tableSchema(db, "b")!)).toBe(true);
    expect(sameSchema(tableSchema(db, "a")!, tableSchema(db, "c")!)).toBe(false);
    expect(tableSchema(db, "missing")).toBeNull();
    expect(dumpTable(db, "a")?.values).toEqual([]);
    db.close();
  });
});
