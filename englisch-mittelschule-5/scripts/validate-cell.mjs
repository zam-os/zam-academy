import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zamCoreArg = process.env.ZAM_CORE;
if (!zamCoreArg) {
  throw new Error(
    "Set ZAM_CORE to zam-core's dist/index.js path or file:// URL.",
  );
}
const zamCoreUrl = zamCoreArg.startsWith("file://")
  ? zamCoreArg
  : pathToFileURL(resolve(zamCoreArg)).href;

const { openDatabase, installKvtTile } = await import(zamCoreUrl);

const cell = JSON.parse(readFileSync(resolve(root, "cell.json"), "utf8"));
const lessons = JSON.parse(
  readFileSync(resolve(root, "src/curriculum/lessons.json"), "utf8"),
);
const replaces = JSON.parse(
  readFileSync(resolve(root, "replaces-de-by.json"), "utf8"),
);

if (cell.tile_id !== "zam-academy:englisch-mittelschule-5") {
  throw new Error(`Unexpected cell.tile_id: ${cell.tile_id}`);
}
if (cell.atoms.length !== lessons.length) {
  throw new Error(
    `Atom count (${cell.atoms.length}) != lesson count (${lessons.length})`,
  );
}

const ULID_RE = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const seenIds = new Set();
let itemCount = 0;

for (const atom of cell.atoms) {
  if (!ULID_RE.test(atom.id)) {
    throw new Error(`Invalid atom ULID: ${atom.id}`);
  }
  if (seenIds.has(atom.id)) {
    throw new Error(`Duplicate ID: ${atom.id}`);
  }
  seenIds.add(atom.id);
  for (const item of atom.practice_items ?? []) {
    itemCount += 1;
    if (!ULID_RE.test(item.id)) {
      throw new Error(`Invalid item ULID: ${item.id}`);
    }
    if (seenIds.has(item.id)) {
      throw new Error(`Duplicate ID: ${item.id}`);
    }
    seenIds.add(item.id);
    if (item.replaces?.length) {
      throw new Error(`Proposal-only cell must not declare item.replaces (${item.id})`);
    }
  }
  if (atom.replaces?.length) {
    throw new Error(`Proposal-only cell must not declare atom.replaces (${atom.slug})`);
  }
}

if (replaces.status !== "proposal-only" || replaces.approved !== null) {
  throw new Error("replaces-de-by.json must remain proposal-only / approved: null");
}
if (cell.retired_items?.length) {
  throw new Error("Proposal-only cell must not declare retired_items");
}

const dir = mkdtempSync(resolve(tmpdir(), "zam-cell-"));
try {
  const db = await openDatabase({
    dbPath: resolve(dir, "cell.db"),
    provider: "local",
    useConfiguredCloud: false,
    initialize: true,
  });
  const first = await installKvtTile(db, cell);
  const second = await installKvtTile(db, cell);

  console.log(
    `validate-cell: ${cell.tile_id} v${cell.version} installed (${cell.atoms.length} atoms, ${itemCount} items, idempotent second install OK)`,
    { first, second },
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
