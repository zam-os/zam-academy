import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const packageRoot = new URL("../", import.meta.url);
const mapping = JSON.parse(readFileSync(new URL("replaces-de-by.json", packageRoot), "utf8"));

it.each(mapping.sources)("pins the byte-exact snapshot for $tile_id", (entry) => {
  const bytes = readFileSync(new URL(entry.file, packageRoot));
  const tile = JSON.parse(bytes);
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(entry.sha256);
  expect(tile.tile_id).toBe(entry.tile_id);
  expect(tile.version).toBe(entry.version);
});
