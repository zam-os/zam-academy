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
}
