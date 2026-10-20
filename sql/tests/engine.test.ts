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
  runSql,
  sameSchema,
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
    expect(count(db, "en", "positionen")).toBe(ORDER_ITEMS.length - 1);
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
  it("treats 49.9 and 49.90 and '49.9' alike", () => {
    expect(compareResults({ columns: ["p"], values: [[49.9]] }, { columns: ["p"], values: [["49.90"]] }, false)).toBeNull();
    expect(compareResults({ columns: ["p"], values: [[60]] }, { columns: ["p"], values: [[60.0]] }, false)).toBeNull();
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
