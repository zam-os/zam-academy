import { esc } from "../exercises/format";

import {
  loadWikiVersions,
  parseWikiCheckpoint,
  saveWikiDraft,
  saveWikiVersions,
  type WikiCheckpoint,
  type WikiDraft,
  type WikiPage,
  WIKI_TOPICS,
} from "../storage/wiki";

const MAX_CHECKPOINT_BYTES = 32768;

export function mountHypertextEditor(root: HTMLElement, draft: WikiDraft): void {
  let current = 0;
  root.innerHTML = `
    <h4>Dein Schulwiki</h4>
    <p>Schreibe eigene Texte, füge einen Verweis ein und probiere ihn in der Vorschau aus. Verwende erfundene Angaben.</p>
    <label>Seite bearbeiten <select data-wiki-page>${WIKI_TOPICS.map((title, i) => `<option value="${i}">${title}</option>`).join("")}</select></label>
    <div class="wiki-grid">
      <div class="wiki-fields">
        <label>Überschrift <input data-wiki-field="title" maxlength="60"></label>
        <div class="wiki-field-title">
          <label for="wiki-page-body">Seitentext</label>
          <details class="wiki-text-info">
            <summary aria-label="Wo bleibt mein Text?">ⓘ</summary>
            <p>Deine Wiki-Texte bleiben in diesem Browserprofil. Hast du dein eigenes Benutzerkonto oder teilst du es mit anderen? Falls du es teilst, wähle am Ende im Informatik-Lernpfad „Fortschritt zurücksetzen“. Das löscht deinen Lernstand und deine Wiki-Texte aus dem Browser.</p>
          </details>
        </div>
        <textarea id="wiki-page-body" data-wiki-field="body" rows="4" maxlength="700"></textarea>
        <label>Beschriftung des Verweises <input data-wiki-field="label" maxlength="50"></label>
        <label>Verweisziel <select data-wiki-field="target"><option value="">Kein Verweis</option>${WIKI_TOPICS.map((title, i) => `<option value="${i}">${title}</option>`).join("")}</select></label>
        <label>Quellenangabe <input data-wiki-field="source" maxlength="230" placeholder="Name, Titel, Fundstelle, Abrufdatum"></label>
      </div>
      <article class="wiki-preview" aria-label="Seitenvorschau"></article>
    </div>
    <div class="wiki-versions-form">
      <label>Name des Zwischenstands <input data-version-name maxlength="45" placeholder="z. B. schattenwiki-v1"></label>
      <button type="button" class="btn btn-secondary btn-sm" data-version-save>Zwischenstand speichern</button>
      <label>Gesicherter Zwischenstand <select data-version-list></select></label>
      <button type="button" class="btn btn-secondary btn-sm" data-version-open>Zwischenstand öffnen</button>
      <details class="wiki-file-options">
        <summary>Wiki-Dateien</summary>
        <div class="wiki-file-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-version-export>Als Datei exportieren</button>
          <button type="button" class="btn btn-secondary btn-sm" data-version-import>Datei öffnen</button>
          <input type="file" accept=".json,application/json" data-version-file hidden aria-label="Wiki-Zwischenstand">
        </div>
      </details>
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

  const titleOf = (index: number) => draft.pages[index].title.trim() || WIKI_TOPICS[index];
  const target = root.querySelector<HTMLSelectElement>('[data-wiki-field="target"]')!;
  const versionName = root.querySelector<HTMLInputElement>("[data-version-name]")!;
  const versionFile = root.querySelector<HTMLInputElement>("[data-version-file]")!;
  const versionList = root.querySelector<HTMLSelectElement>("[data-version-list]")!;
  const versionOpen = root.querySelector<HTMLButtonElement>("[data-version-open]")!;

  function renderVersions(selected?: string): void {
    const versions = loadWikiVersions();
    versionList.replaceChildren(...versions.map((version) => new Option(version.name, version.name)));
    if (selected && versions.some((version) => version.name === selected)) versionList.value = selected;
    versionList.disabled = versionOpen.disabled = versions.length === 0;
  }

  function persistDraft(): void {
    if (!saveWikiDraft(draft))
      status.textContent = "Der Browser kann den Entwurf gerade nicht speichern.";
  }

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
      const key = input.dataset.wikiField as keyof WikiPage;
      input.value = String(draft.pages[index][key] ?? "");
    }
    renderPreview();
  }

  switchPage(0);
  versionName.value = draft.name;
  renderVersions(draft.name);
  picker.addEventListener("change", () => switchPage(Number(picker.value)));
  for (const input of inputs) {
    input.addEventListener("input", () => {
      const field = input.dataset.wikiField as keyof WikiPage;
      if (field === "target") draft.pages[current].target = input.value ? Number(input.value) : null;
      else draft.pages[current][field] = input.value;
      persistDraft();
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
    if (!name) {
      status.textContent = "Gib dem Zwischenstand einen Namen.";
      versionName.focus();
      return;
    }
    const versions = loadWikiVersions();
    if (versions.some((version) => version.name === name)) {
      status.textContent =
        "Dieser Name ist schon vergeben. Wähle einen neuen Namen für den Zwischenstand.";
      versionName.focus();
      return;
    }
    if (!saveWikiVersions([...versions, { name, pages: draft.pages }])) {
      status.textContent =
        "Der Browser kann den Zwischenstand gerade nicht speichern. Du kannst ihn als Datei exportieren.";
      return;
    }
    draft.name = name;
    status.textContent = `Zwischenstand „${name}“ gespeichert.`;
    persistDraft();
    renderVersions(name);
  });

  function openVersion(checkpoint: WikiDraft): void {
    draft.pages = checkpoint.pages;
    draft.name = checkpoint.name;
    versionName.value = checkpoint.name;
    switchPage(0);
    status.textContent = `Zwischenstand „${checkpoint.name}“ geöffnet.`;
    persistDraft();
  }

  versionOpen.addEventListener("click", () => {
    const version = loadWikiVersions().find((entry) => entry.name === versionList.value);
    if (version) openVersion(version);
    renderVersions(version?.name);
  });

  root.querySelector("[data-version-export]")?.addEventListener("click", () => {
    const name = versionName.value.trim();
    const stem = name.replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "");
    if (!stem) {
      status.textContent = "Gib dem Zwischenstand einen Namen mit Buchstaben oder Zahlen.";
      versionName.focus();
      return;
    }

    const checkpoint: WikiCheckpoint = { schema: 1, name, pages: draft.pages };
    const file = new Blob([JSON.stringify(checkpoint, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const download = document.createElement("a");
    download.href = url;
    download.download = `${stem}.json`;
    download.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = `Download von „${stem}.json“ gestartet.`;
  });

  root.querySelector("[data-version-import]")?.addEventListener("click", () => versionFile.click());
  versionFile.addEventListener("change", async () => {
    const [file] = versionFile.files ?? [];
    versionFile.value = "";
    if (!file) return;
    try {
      if (file.size > MAX_CHECKPOINT_BYTES) throw new Error("Wiki checkpoint is too large");
      const checkpoint = parseWikiCheckpoint(await file.text());
      if (!root.isConnected) return;
      if (!checkpoint) throw new Error("Invalid wiki checkpoint");
      openVersion(checkpoint);
      renderVersions(checkpoint.name);
    } catch {
      status.textContent =
        "Die Datei ist kein gültiger Wiki-Zwischenstand. Dein Entwurf bleibt geöffnet.";
    }
  });
}
