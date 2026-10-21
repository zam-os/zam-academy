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

function withCatalog(run) {
  const root = mkdtempSync(join(tmpdir(), "zam-catalog-approval-test-"));
  const tile = {
    tile_id: "test:sample",
    version: "1",
    atoms: [
      {
        practice_items: [
          { id: "test-item", language: "de", replaces: ["test-old-item"] },
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
    writeMapping({ approved: "2026-10-21" });
    assert.equal(buildCatalog(root).cells.length, 1);
  }));

test("an approved mapping preserves the catalog and exact cell hash", () =>
  withCatalog(({ root, app, writeMapping }) => {
    writeMapping({ approved: "2026-10-21" });
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
