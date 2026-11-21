export const WIKI_DRAFT_KEY = "informatik_gym7_wiki_v1";
export const WIKI_VERSIONS_KEY = "informatik_gym7_wiki_versions_v1";
export const WIKI_TOPICS = ["Schulwiki", "Bücherei", "Arbeitsgemeinschaften"];
const TEXT_FIELDS = { title: 60, body: 700, label: 50, source: 230 } as const;

export type WikiPage = {
  title: string;
  body: string;
  target: number | null;
  label: string;
  source: string;
};
export type WikiDraft = { name: string; pages: WikiPage[] };
export type WikiCheckpoint = WikiDraft & { schema: 1 };

function emptyDraft(): WikiDraft {
  return {
    name: "schulwiki-v1",
    pages: WIKI_TOPICS.map((title) => ({ title, body: "", target: null, label: "", source: "" })),
  };
}

function isWikiPages(data: unknown): data is WikiPage[] {
  return (
    Array.isArray(data) &&
    data.length === WIKI_TOPICS.length &&
    data.every(
      (page) =>
        page &&
        Object.entries(TEXT_FIELDS).every(([key, max]) => {
          const value: unknown = page[key];
          return typeof value === "string" && value.length <= max;
        }) &&
        (page.target === null ||
          (Number.isInteger(page.target) && page.target >= 0 && page.target < WIKI_TOPICS.length)),
    )
  );
}

function readStoredJson(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return undefined;
  }
}

function saveStoredJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function isNamedDraft(value: unknown): value is WikiDraft {
  const draft = value as Partial<WikiDraft> | undefined;
  return (
    !!draft &&
    typeof draft.name === "string" &&
    draft.name.trim().length > 0 &&
    draft.name.length <= 45 &&
    isWikiPages(draft.pages)
  );
}

/** Restore both the named draft and the page array used in the first local draft. */
export function loadWikiDraft(): WikiDraft {
  const saved = readStoredJson(WIKI_DRAFT_KEY);
  if (isNamedDraft(saved)) return saved;
  const draft = emptyDraft();
  if (isWikiPages(saved)) draft.pages = saved;
  return draft;
}

export function saveWikiDraft(draft: WikiDraft): boolean {
  return saveStoredJson(WIKI_DRAFT_KEY, draft);
}

export function loadWikiVersions(): WikiDraft[] {
  const saved = readStoredJson(WIKI_VERSIONS_KEY);
  return Array.isArray(saved) ? saved.filter(isNamedDraft) : [];
}

export function saveWikiVersions(versions: WikiDraft[]): boolean {
  return saveStoredJson(WIKI_VERSIONS_KEY, versions);
}

export function parseWikiCheckpoint(text: string): WikiCheckpoint | undefined {
  try {
    const checkpoint: unknown = JSON.parse(text);
    if (isNamedDraft(checkpoint) && (checkpoint as Partial<WikiCheckpoint>).schema === 1) {
      return { schema: 1, name: checkpoint.name, pages: checkpoint.pages };
    }
  } catch {
    // Invalid files leave the current draft open.
  }
  return undefined;
}
