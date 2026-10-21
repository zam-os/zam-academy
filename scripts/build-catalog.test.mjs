import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildCatalog } from "./build-catalog.mjs";

const APPROVED = "2026-10-21";
const row = (category, extra = {}) => ({
  de_by_id: "test-old-item",
  category,
  ...(category === "C" ? {} : { academy_slug: "test-item" }),
  ...extra,
});

function withCatalog(run) {
  const root = mkdtempSync(join(tmpdir(), "zam-catalog-approval-test-"));
  const tile = {
    tile_id: "test:sample",
    version: "1",
    atoms: [
      {
        practice_items: [
          {
            id: "test-item",
            slug: "test-item",
            language: "de",
            replaces: ["test-old-item"],
          },
        ],
      },
    ],
  };
  const app = join(root, "sample");
  mkdirSync(app);
  const writeCell = (value) =>
    writeFileSync(join(app, "cell.json"), `${JSON.stringify(value)}\n`);
  const writeMapping = (value) =>
    writeFileSync(join(app, "replaces-de-by.json"), JSON.stringify(value));
  writeCell(tile);
  try {
    run({ root, app, tile, writeCell, writeMapping });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

for (const approved of [
  null,
  undefined,
  "",
  true,
  "approved",
  "2026-02-30",
  "2026-13-01",
  "2026-10-21T00:00:00Z",
]) {
  test(`catalog refuses an unapproved or invalid date: ${String(approved)}`, () =>
    withCatalog(({ root, writeMapping }) => {
      writeMapping({ approved });
      assert.throws(
        () => buildCatalog(root),
        /mapping approval.*publication is blocked/,
      );
      assert.equal(existsSync(join(root, "catalog.json")), false);
    }));
}

test("catalog requires an approval record when replacements exist", () =>
  withCatalog(({ root }) => {
    assert.throws(
      () => buildCatalog(root),
      /without a mapping approval record/,
    );
  }));

test("retirements alone also require approval", () =>
  withCatalog(({ root, tile, writeCell, writeMapping }) => {
    tile.atoms[0].practice_items[0].replaces = [];
    tile.retired_items = [{ id: "test-old-item", reason: "test correction" }];
    writeCell(tile);
    writeMapping({ approved: null });
    assert.throws(() => buildCatalog(root), /mapping approval/);
    writeMapping({ approved: APPROVED, rows: [row("C")] });
    assert.equal(buildCatalog(root).cells.length, 1);
  }));

test("an approved mapping preserves the catalog and exact cell hash", () =>
  withCatalog(({ root, app, writeMapping }) => {
    writeMapping({ approved: APPROVED, rows: [row("A")] });
    const catalog = buildCatalog(root);
    assert.equal(catalog.cells.length, 1);
    assert.equal(catalog.cells[0].id, "test:sample");
    assert.equal(
      catalog.cells[0].sha256,
      createHash("sha256")
        .update(readFileSync(join(app, "cell.json")))
        .digest("hex"),
    );
  }));

test("a new cell with no history changes needs no mapping", () =>
  withCatalog(({ root, tile, writeCell }) => {
    tile.atoms[0].practice_items[0].replaces = [];
    writeCell(tile);
    assert.equal(buildCatalog(root).cells.length, 1);
  }));

// The approval covers only the documented rows; the cell must declare exactly those.
for (const [name, change, message] of [
  [
    "an approval without rows",
    ({ writeMapping }) => writeMapping({ approved: APPROVED }),
    /approved mapping has no rows/,
  ],
  [
    "an undocumented replacement",
    ({ writeMapping }) =>
      writeMapping({
        approved: APPROVED,
        rows: [row("A", { de_by_id: "another-old-item" })],
      }),
    /replacement of test-old-item is not documented/,
  ],
  [
    "a category C row that transfers a history",
    ({ writeMapping }) => writeMapping({ approved: APPROVED, rows: [row("C")] }),
    /category C and must not transfer a history/,
  ],
  [
    "a successor other than the documented slug",
    ({ writeMapping }) =>
      writeMapping({
        approved: APPROVED,
        rows: [row("A", { academy_slug: "other-item" })],
      }),
    /must be replaced only by other-item/,
  ],
  [
    "two successors for one old item",
    ({ tile, writeCell, writeMapping }) => {
      tile.atoms[0].practice_items.push({
        id: "test-item-2",
        slug: "test-item-2",
        language: "de",
        replaces: ["test-old-item"],
      });
      writeCell(tile);
      writeMapping({ approved: APPROVED, rows: [row("A")] });
    },
    /replaced only by test-item, not by test-item, test-item-2/,
  ],
  [
    "an approved A row the cell leaves out",
    ({ writeMapping }) =>
      writeMapping({
        approved: APPROVED,
        rows: [row("A"), row("B", { de_by_id: "skipped-old-item" })],
      }),
    /approved B row skipped-old-item is missing from the cell/,
  ],
  [
    "an undocumented retirement",
    ({ tile, writeCell, writeMapping }) => {
      tile.retired_items = [{ id: "unlisted-old-item", reason: "test" }];
      writeCell(tile);
      writeMapping({ approved: APPROVED, rows: [row("A")] });
    },
    /retirement of unlisted-old-item is not documented/,
  ],
  [
    "a retired A row",
    ({ tile, writeCell, writeMapping }) => {
      tile.atoms[0].practice_items[0].replaces = [];
      tile.retired_items = [{ id: "test-old-item", reason: "test" }];
      writeCell(tile);
      writeMapping({ approved: APPROVED, rows: [row("A")] });
    },
    /category A and must be replaced, not retired/,
  ],
  [
    "a duplicate mapping row",
    ({ writeMapping }) =>
      writeMapping({ approved: APPROVED, rows: [row("A"), row("A")] }),
    /test-old-item is mapped twice/,
  ],
  [
    "a row without a valid category",
    ({ writeMapping }) =>
      writeMapping({ approved: APPROVED, rows: [row("D")] }),
    /has no category A, B or C/,
  ],
])
  test(`catalog refuses ${name}`, () =>
    withCatalog((context) => {
      change(context);
      assert.throws(() => buildCatalog(context.root), message);
      assert.equal(existsSync(join(context.root, "catalog.json")), false);
    }));

test("a category C row may stay untouched, as in older mappings", () =>
  withCatalog(({ root, writeMapping }) => {
    writeMapping({
      approved: APPROVED,
      rows: [row("A"), row("C", { de_by_id: "kept-old-item" })],
    });
    assert.equal(buildCatalog(root).cells.length, 1);
  }));
