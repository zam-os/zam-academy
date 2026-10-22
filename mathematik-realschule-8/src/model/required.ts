/** Fail clearly when authored content or the app's HTML skeleton is incomplete. */
export function required<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Missing required app content");
  return value;
}
