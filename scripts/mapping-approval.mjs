import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function validApprovalDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/** Publishing history-changing declarations requires the explicit mapping's approval. */
export function assertMappingApproved(appDirectory, tile, appName) {
  const replaces = tile.atoms.some((atom) =>
    (atom.practice_items ?? []).some(
      (item) => (item.replaces?.length ?? 0) > 0,
    ),
  );
  if (!replaces && (tile.retired_items?.length ?? 0) === 0) return;

  const file = join(appDirectory, "replaces-de-by.json");
  if (!existsSync(file)) {
    throw new Error(
      `${appName}: cannot publish replacements or retirements without a mapping approval record`,
    );
  }
  const mapping = JSON.parse(readFileSync(file, "utf8"));
  if (!validApprovalDate(mapping?.approved)) {
    throw new Error(
      `${appName}: mapping approval is pending or invalid; publication is blocked until Thomas explicitly approves replaces-de-by.json`,
    );
  }
  assertCellMatchesMapping(tile, mapping, appName);
}

/**
 * The approval covers only the documented rows, so the cell must declare
 * exactly those: each A/B row is replaced by its one named successor, a C row
 * is never replaced (it may be retired or, in older mappings, left alone), and
 * nothing undocumented changes a history.
 */
function assertCellMatchesMapping(tile, mapping, appName) {
  const fail = (message) => {
    throw new Error(`${appName}: ${message} in replaces-de-by.json`);
  };
  if (!Array.isArray(mapping.rows)) fail("approved mapping has no rows");
  const rows = new Map();
  for (const row of mapping.rows) {
    if (typeof row?.de_by_id !== "string" || !row.de_by_id)
      fail("a mapping row has no de_by_id");
    if (!["A", "B", "C"].includes(row.category))
      fail(`${row.de_by_id} has no category A, B or C`);
    if (rows.has(row.de_by_id)) fail(`${row.de_by_id} is mapped twice`);
    rows.set(row.de_by_id, row);
  }

  const successors = new Map();
  for (const atom of tile.atoms)
    for (const item of atom.practice_items ?? [])
      for (const oldId of item.replaces ?? [])
        successors.set(oldId, [...(successors.get(oldId) ?? []), item.slug]);
  for (const [oldId, slugs] of successors) {
    const row = rows.get(oldId);
    if (!row) fail(`replacement of ${oldId} is not documented`);
    if (row.category === "C")
      fail(`${oldId} is category C and must not transfer a history`);
    if (slugs.length !== 1 || slugs[0] !== row.academy_slug)
      fail(
        `${oldId} must be replaced only by ${row.academy_slug}, not by ${slugs.join(", ")}`,
      );
  }
  for (const { id } of tile.retired_items ?? []) {
    const row = rows.get(id);
    if (!row) fail(`retirement of ${id} is not documented`);
    if (row.category !== "C")
      fail(`${id} is category ${row.category} and must be replaced, not retired`);
  }
  for (const row of rows.values())
    if (row.category !== "C" && !successors.has(row.de_by_id))
      fail(`approved ${row.category} row ${row.de_by_id} is missing from the cell`);
}
