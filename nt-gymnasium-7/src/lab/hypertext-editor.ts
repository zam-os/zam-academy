import { esc } from "../exercises/format";

const KEY = "informatik_gym7_wiki_v1";
const VERSION_KEY = "informatik_gym7_wiki_versions_v1";
const TOPICS = ["Schulwiki", "Bücherei", "Arbeitsgemeinschaften"];
type Page = { title: string; body: string; target: number | null; label: string; source: string };
type Checkpoint = { name: string; pages: Page[] };

function defaults(): Page[] {
  return TOPICS.map((title) => ({ title, body: "", target: null, label: "", source: "" }));
}

function readPages(data: unknown): Page[] | undefined {
  if (!Array.isArray(data) || data.length !== TOPICS.length) return undefined;
  if (
    !data.every(
      (page) =>
        page &&
        ["title", "body", "label", "source"].every((field) => typeof page[field] === "string") &&
        (page.target === null ||
          (Number.isInteger(page.target) && page.target >= 0 && page.target < TOPICS.length)),
    )
  )
    return undefined;
  return data;
}

function readStorage(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return undefined;
  }
}

function loadVersions(): Checkpoint[] {
  const saved = readStorage(VERSION_KEY);
  return Array.isArray(saved)
    ? saved.flatMap((entry) => {
        const pages = readPages(entry?.pages);
        return typeof entry?.name === "string" && pages ? [{ name: entry.name, pages }] : [];
      })
    : [];
}

export function mountHypertextEditor(root: HTMLElement): void {
  let pages = readPages(readStorage(KEY)) ?? defaults();
  let versions = loadVersions();
  let current = 0;
  root.innerHTML = `
    <h4>Dein Schulwiki</h4>
    <p>Schreibe eigene Texte, füge einen Verweis ein und probiere ihn in der Vorschau aus. Verwende erfundene Angaben.</p>
    <label>Seite bearbeiten <select data-wiki-page>${TOPICS.map((title, i) => `<option value="${i}">${title}</option>`).join("")}</select></label>
    <div class="wiki-grid">
      <div class="wiki-fields">
        <label>Überschrift <input data-wiki-field="title" maxlength="60"></label>
        <label>Seitentext <textarea data-wiki-field="body" rows="4" maxlength="700"></textarea></label>
        <label>Beschriftung des Verweises <input data-wiki-field="label" maxlength="50"></label>
        <label>Verweisziel <select data-wiki-field="target"><option value="">Kein Verweis</option>${TOPICS.map((title, i) => `<option value="${i}">${title}</option>`).join("")}</select></label>
        <label>Quellenangabe <input data-wiki-field="source" maxlength="230" placeholder="Name, Titel, Fundstelle, Abrufdatum"></label>
      </div>
      <article class="wiki-preview" aria-label="Seitenvorschau"></article>
    </div>
    <button type="button" class="btn btn-secondary btn-sm" data-wiki-save>Wiki in diesem Browser speichern</button>
    <details class="wiki-versions">
      <summary>Zwischenstände</summary>
      <div class="wiki-versions-form">
        <label>Name für den neuen Zwischenstand <input data-version-name maxlength="45" placeholder="z. B. schattenwiki-v1"></label>
        <button type="button" class="btn btn-secondary btn-sm" data-version-save>Zwischenstand sichern</button>
        <label>Gesicherter Stand <select data-version-list></select></label>
        <button type="button" class="btn btn-secondary btn-sm" data-version-open>Stand als Entwurf öffnen</button>
      </div>
    </details>
    <p data-wiki-status role="status"></p>`;
  const picker = root.querySelector<HTMLSelectElement>("[data-wiki-page]")!;
  const preview = root.querySelector<HTMLElement>(".wiki-preview")!;
  const status = root.querySelector<HTMLElement>("[data-wiki-status]")!;
  const inputs = [
    ...root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "[data-wiki-field]",
    ),
  ];

  const titleOf = (index: number) => pages[index].title.trim() || TOPICS[index];
  const target = root.querySelector<HTMLSelectElement>('[data-wiki-field="target"]')!;
  const versionName = root.querySelector<HTMLInputElement>("[data-version-name]")!;
  const versionList = root.querySelector<HTMLSelectElement>("[data-version-list]")!;
  const versionOpen = root.querySelector<HTMLButtonElement>("[data-version-open]")!;

  function renderVersions(): void {
    versionList.replaceChildren(
      ...versions.map((version, index) => new Option(version.name, String(index))),
    );
    versionOpen.disabled = versions.length === 0;
  }

  function renderPreview(): void {
    for (const [index, option] of [...picker.options].entries()) option.textContent = titleOf(index);
    for (const [index, option] of [...target.options].slice(1).entries())
      option.textContent = titleOf(index);
    const page = pages[current];
    preview.innerHTML = `
      <h5>${esc(page.title || "Seite ohne Überschrift")}</h5>
      <p>${esc(page.body || "Hier erscheint dein Text.")}</p>
      ${page.target === null ? "" : `<button type="button" class="btn btn-secondary btn-sm" data-wiki-link="${page.target}">${esc(page.label || titleOf(page.target))}</button>`}
      ${page.source ? `<p class="muted">Quelle · ${esc(page.source)}</p>` : ""}`;
  }

  function switchPage(index: number): void {
    current = index;
    picker.value = String(index);
    for (const input of inputs) {
      const key = input.dataset.wikiField as keyof Page;
      input.value = String(pages[index][key] ?? "");
    }
    renderPreview();
  }

  switchPage(0);
  renderVersions();
  picker.addEventListener("change", () => switchPage(Number(picker.value)));
  for (const input of inputs) {
    input.addEventListener("input", () => {
      const field = input.dataset.wikiField as keyof Page;
      if (field === "target") pages[current].target = input.value ? Number(input.value) : null;
      else pages[current][field] = input.value;
      status.textContent = "Änderungen noch nicht gespeichert.";
      renderPreview();
    });
  }
  preview.addEventListener("click", (event) => {
    const link = (event.target as Element).closest<HTMLButtonElement>("[data-wiki-link]");
    if (!link) return;
    switchPage(Number(link.dataset.wikiLink));
    picker.focus();
  });
  root.querySelector("[data-wiki-save]")?.addEventListener("click", () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(pages));
      status.textContent = "Wiki gespeichert.";
    } catch {
      status.textContent = "Der Browser kann den Entwurf gerade nicht speichern.";
    }
  });
  root.querySelector("[data-version-save]")?.addEventListener("click", () => {
    const name = versionName.value.trim();
    const existing = loadVersions();
    if (!name || existing.some((version) => version.name === name)) {
      status.textContent = "Gib dem Zwischenstand einen eigenen Namen.";
      versionName.focus();
      return;
    }
    const version = { name, pages: pages.map((page) => ({ ...page })) };
    try {
      const updated = [...existing, version];
      localStorage.setItem(VERSION_KEY, JSON.stringify(updated));
      versions = updated;
      renderVersions();
      versionList.value = String(versions.length - 1);
      versionName.value = "";
      status.textContent = `Zwischenstand „${name}“ gespeichert.`;
    } catch {
      status.textContent = "Der Browser kann keinen weiteren Stand speichern.";
    }
  });
  versionOpen.addEventListener("click", () => {
    const version = versions[Number(versionList.value)];
    if (!version) return;
    pages = version.pages.map((page) => ({ ...page }));
    switchPage(0);
    status.textContent = `„${version.name}“ ist geöffnet. Speichere das Wiki, um diesen Stand als Entwurf zu übernehmen.`;
  });
}
