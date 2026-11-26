const MAX_SIDE = 1200;

function sampleImage(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 220;
  const ctx = canvas.getContext("2d")!;
  const sky = ctx.createLinearGradient(0, 0, 0, 220);
  sky.addColorStop(0, "#447baf");
  sky.addColorStop(1, "#ffcc8d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 320, 220);
  ctx.fillStyle = "#ffe5a8";
  ctx.beginPath();
  ctx.arc(152, 78, 32, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#455e71";
  ctx.beginPath();
  ctx.moveTo(0, 175);
  ctx.lineTo(90, 97);
  ctx.lineTo(148, 152);
  ctx.lineTo(221, 84);
  ctx.lineTo(320, 178);
  ctx.lineTo(320, 220);
  ctx.lineTo(0, 220);
  ctx.fill();
  ctx.fillStyle = "#284647";
  ctx.fillRect(0, 185, 320, 35);
  ctx.fillStyle = "#22234e";
  ctx.fillRect(192, 38, 9, 9);
  return canvas;
}

export function makeRasterEditor(): HTMLElement {
  const editor = document.createElement("section");
  editor.className = "raster-editor";
  editor.innerHTML = `
    <h5>Dein Rasterbild bearbeiten</h5>
    <p>Nutze das Beispiel oder öffne ein eigenes Foto oder einen Scan. Die Datei bleibt auf deinem Gerät.</p>
    <div class="raster-actions">
      <label>Bilddatei <input type="file" accept="image/jpeg,image/png,image/webp" data-raster="file"></label>
      <button type="button" class="btn btn-ghost btn-sm" data-raster="sample">Beispielbild laden</button>
    </div>
    <div class="raster-preview"><canvas tabindex="0" aria-label="Arbeitskopie des Rasterbilds" aria-describedby="raster-help">Die Vorschau benötigt Canvas-Unterstützung.</canvas><span class="raster-cursor" aria-hidden="true"></span></div>
    <div class="raster-actions">
      <label>Rand pro Seite <select data-raster="crop">
        <option value="0">0 %</option><option value="0.1">10 %</option><option value="0.2">20 %</option>
      </select></label>
      <label>Werkzeug <select data-raster="tool">
        <option value="retouch">Retuschieren</option><option value="mask">Hintergrundfarbe entfernen</option>
      </select></label>
      <button type="button" class="btn btn-ghost btn-sm" data-raster="restore">Bearbeitung zurücksetzen</button>
    </div>
    <p id="raster-help">Klicke auf einen Fleck zum Retuschieren oder auf einen einfarbigen Hintergrund zum Freistellen. Mit der Tastatur bewegst du die Auswahl mit den Pfeiltasten und wendest das Werkzeug mit der Eingabetaste an.</p>
    <div class="raster-actions">
      <button type="button" class="btn btn-secondary btn-sm" data-raster="png">PNG speichern</button>
      <button type="button" class="btn btn-secondary btn-sm" data-raster="jpeg">JPG speichern</button>
    </div>
    <p class="muted" role="status" data-raster="info"></p>`;

  const sample = sampleImage();
  let original = sample;
  const working = document.createElement("canvas");
  const ctx = working.getContext("2d")!;
  const preview = editor.querySelector("canvas")!;
  const previewCtx = preview.getContext("2d")!;
  const file = editor.querySelector<HTMLInputElement>('[data-raster="file"]')!;
  const crop = editor.querySelector<HTMLSelectElement>('[data-raster="crop"]')!;
  const tool = editor.querySelector<HTMLSelectElement>('[data-raster="tool"]')!;
  const info = editor.querySelector<HTMLElement>('[data-raster="info"]')!;
  let revision = 0;
  const cursor = { x: 50, y: 50 };

  function draw(message = "") {
    const left = Math.floor(working.width * Number(crop.value));
    const top = Math.floor(working.height * Number(crop.value));
    preview.width = working.width - left * 2;
    preview.height = working.height - top * 2;
    previewCtx.drawImage(working, left, top, preview.width, preview.height, 0, 0, preview.width, preview.height);
    info.textContent = `${preview.width} × ${preview.height} Pixel${message ? " · " + message : ""}`;
  }

  function reset() {
    working.width = original.width;
    working.height = original.height;
    ctx.drawImage(original, 0, 0);
    crop.value = "0";
    cursor.x = cursor.y = 50;
    showCursor();
    draw();
  }

  file.addEventListener("change", async () => {
    const selection = file.files?.[0];
    if (!selection) return;
    const request = ++revision;
    if (selection.size > 15_000_000 || !["image/png", "image/jpeg", "image/webp"].includes(selection.type)) {
      draw("Wähle eine PNG-, JPG- oder WebP-Datei bis 15 MB.");
      return;
    }
    try {
      const bitmap = await createImageBitmap(selection);
      try {
        if (request !== revision) return;
        const ratio = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
        canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
        canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        original = canvas;
        reset();
        if (ratio < 1) draw("Arbeitskopie für die Werkstatt verkleinert.");
      } finally {
        bitmap.close();
      }
    } catch {
      if (request === revision) draw("Dieses Bild konnte nicht geöffnet werden.");
    }
  });

  function edit(xRatio: number, yRatio: number) {
    const originX = (working.width - preview.width) / 2;
    const originY = (working.height - preview.height) / 2;
    const x = originX + Math.min(preview.width - 1, Math.floor(xRatio * preview.width));
    const y = originY + Math.min(preview.height - 1, Math.floor(yRatio * preview.height));
    if (tool.value === "mask") {
      const image = ctx.getImageData(0, 0, working.width, working.height);
      const data = image.data;
      const base = (y * working.width + x) * 4;
      const [r, g, b, a] = data.slice(base, base + 4);
      if (a === 0) {
        draw("Diese Stelle ist bereits transparent.");
        return;
      }
      for (let i = 0; i < data.length; i += 4) {
        if (Math.max(Math.abs(data[i] - r), Math.abs(data[i + 1] - g), Math.abs(data[i + 2] - b)) <= 20) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(image, 0, 0);
      draw("Hintergrundfarbe entfernt. Prüfe, ob das Motiv vollständig bleibt.");
      return;
    }
    const radius = Math.max(2, Math.round(Math.min(working.width, working.height) * 0.035));
    const sampleX = x + 2 * radius < working.width ? x + 2 * radius : Math.max(0, x - 2 * radius);
    const [r, g, b, a] = ctx.getImageData(sampleX, y, 1, 1).data;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    ctx.clearRect(x - radius, y - radius, 2 * radius, 2 * radius);
    ctx.fillRect(x - radius, y - radius, 2 * radius, 2 * radius);
    draw("Stelle retuschiert.");
  }

  function showCursor() {
    editor.style.setProperty("--cursor-x", `${cursor.x}%`);
    editor.style.setProperty("--cursor-y", `${cursor.y}%`);
  }

  preview.addEventListener("click", (event) => {
    const box = preview.getBoundingClientRect();
    cursor.x = (event.clientX - box.left) / box.width * 100;
    cursor.y = (event.clientY - box.top) / box.height * 100;
    showCursor();
    edit(cursor.x / 100, cursor.y / 100);
  });
  const directions: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
  };
  preview.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      edit(cursor.x / 100, cursor.y / 100);
    } else if (event.key in directions) {
      event.preventDefault();
      const [x, y] = directions[event.key];
      cursor.x = Math.min(99, Math.max(1, cursor.x + x * 5));
      cursor.y = Math.min(99, Math.max(1, cursor.y + y * 5));
      showCursor();
      info.textContent = `Auswahl: ${Math.round(cursor.x)} % von links, ${Math.round(cursor.y)} % von oben.`;
    }
  });

  crop.addEventListener("change", () => draw());
  editor.querySelector('[data-raster="restore"]')!.addEventListener("click", reset);
  editor.querySelector('[data-raster="sample"]')!.addEventListener("click", () => {
    ++revision;
    file.value = "";
    original = sample;
    reset();
  });
  for (const type of ["png", "jpeg"]) {
    editor.querySelector(`[data-raster="${type}"]`)!.addEventListener("click", () => {
      const output = document.createElement("canvas");
      output.width = preview.width;
      output.height = preview.height;
      const out = output.getContext("2d")!;
      if (type === "jpeg") {
        out.fillStyle = "#ffffff";
        out.fillRect(0, 0, output.width, output.height);
      }
      out.drawImage(preview, 0, 0);
      output.toBlob((blob) => {
        if (!blob) {
          draw("Das Bild konnte nicht gespeichert werden.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const download = document.createElement("a");
        download.href = url;
        download.download = `mein-rasterbild.${type === "jpeg" ? "jpg" : "png"}`;
        download.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, `image/${type}`, 0.85);
    });
  }
  reset();
  return editor;
}
