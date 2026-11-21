import { esc } from "../exercises/format";

const TOPICS = ["Schulwiki", "Bücherei", "Arbeitsgemeinschaften"];
const MAX_CHECKPOINT_BYTES = 32768;
const TEXT_FIELDS = { title: 60, body: 700, label: 50, source: 230 } as const;
type Page = { title: string; body: string; target: number | null; label: string; source: string };
type Checkpoint = { schema: 1; name: string; pages: Page[] };

export function createWikiDraft(): { pages: Page[]; name: string } {
  return {
    name: "schulwiki-v1",
    pages: TOPICS.map((title) => ({ title, body: "", target: null, label: "", source: "" })),
  };
}

function readCheckpoint(text: string): Checkpoint {
  const document = JSON.parse(text) as Partial<Checkpoint> | null;
  if (
    document?.schema !== 1 ||
    typeof document.name !== "string" ||
    !document.name.trim() ||
    document.name.length > 45 ||
    !Array.isArray(document.pages) ||
    document.pages.length !== TOPICS.length ||
    !document.pages.every(
      (page) =>
        page &&
        Object.entries(TEXT_FIELDS).every(([key, max]) => {
          const value = page[key as keyof typeof TEXT_FIELDS];
          return typeof value === "string" && value.length <= max;
        }) &&
        (page.target === null ||
          (Number.isInteger(page.target) && page.target >= 0 && page.target < TOPICS.length)),
    )
  )
    throw new Error("Invalid wiki checkpoint");
  return { schema: 1, name: document.name, pages: document.pages };
}

export function mountHypertextEditor(
  root: HTMLElement,
  draft: ReturnType<typeof createWikiDraft>,
): void {
  let current = 0;
  root.innerHTML = `
    <h4>Dein Schulwiki</h4>
    <p>Schreibe eigene Texte, füge einen Verweis ein und probiere ihn in der Vorschau aus. Verwende erfundene Angaben. Speichere deinen Stand als Datei, bevor du den Browser schließt.</p>
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
    <div class="wiki-versions-form">
      <label>Name des Zwischenstands <input data-version-name maxlength="45" placeholder="z. B. schattenwiki-v1"></label>
      <div class="wiki-file-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-version-save>Zwischenstand als Datei speichern</button>
        <button type="button" class="btn btn-secondary btn-sm" data-version-open>Datei öffnen</button>
        <input type="file" accept=".json,application/json" data-version-file hidden aria-label="Wiki-Zwischenstand">
      </div>
    </div>
    <p data-wiki-status role="status"></p>`;
  const picker = root.querySelector<HTMLSelectElement>("[data-wiki-page]")!;
  const preview = root.querySelector<HTMLElement>(".wiki-preview")!;
  const status = root.querySelector<HTMLElement>("[data-wiki-status]")!;
  const inputs = [
    ...root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "[data-wiki-field]",
    ),
  ];

  const titleOf = (index: number) => draft.pages[index].title.trim() || TOPICS[index];
  const target = root.querySelector<HTMLSelectElement>('[data-wiki-field="target"]')!;
  const versionName = root.querySelector<HTMLInputElement>("[data-version-name]")!;
  const versionFile = root.querySelector<HTMLInputElement>("[data-version-file]")!;
  const versionOpen = root.querySelector<HTMLButtonElement>("[data-version-open]")!;

  function renderPreview(): void {
    for (const [index, option] of [...picker.options].entries()) option.textContent = titleOf(index);
    for (const [index, option] of [...target.options].slice(1).entries())
      option.textContent = titleOf(index);
    const page = draft.pages[current];
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
      input.value = String(draft.pages[index][key] ?? "");
    }
    renderPreview();
  }

  switchPage(0);
  versionName.value = draft.name;
  versionName.addEventListener("input", () => {
    draft.name = versionName.value;
  });
  picker.addEventListener("change", () => switchPage(Number(picker.value)));
  for (const input of inputs) {
    input.addEventListener("input", () => {
      const field = input.dataset.wikiField as keyof Page;
      if (field === "target") draft.pages[current].target = input.value ? Number(input.value) : null;
      else draft.pages[current][field] = input.value;
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
  root.querySelector("[data-version-save]")?.addEventListener("click", () => {
    const name = versionName.value.trim();
    const stem = name.replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "");
    if (!stem) {
      status.textContent = "Gib dem Zwischenstand einen Namen mit Buchstaben oder Zahlen.";
      versionName.focus();
      return;
    }

    const checkpoint: Checkpoint = { schema: 1, name, pages: draft.pages };
    const file = new Blob([JSON.stringify(checkpoint, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const download = document.createElement("a");
    download.href = url;
    download.download = `${stem}.json`;
    download.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = `Download von „${stem}.json“ gestartet.`;
  });

  versionOpen.addEventListener("click", () => versionFile.click());
  versionFile.addEventListener("change", async () => {
    const [file] = versionFile.files ?? [];
    versionFile.value = "";
    if (!file) return;
    try {
      if (file.size > MAX_CHECKPOINT_BYTES) throw new Error("Wiki checkpoint is too large");
      const checkpoint = readCheckpoint(await file.text());
      draft.pages = checkpoint.pages;
      draft.name = checkpoint.name;
      versionName.value = checkpoint.name;
      switchPage(0);
      status.textContent = `Zwischenstand „${checkpoint.name}“ geöffnet.`;
    } catch {
      status.textContent =
        "Die Datei ist kein gültiger Wiki-Zwischenstand. Dein Entwurf bleibt geöffnet.";
    }
  });
}
