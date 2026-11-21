import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const output = process.env.BROWSER_QA_DIR ?? join(tmpdir(), "zam-nt-gym7-browser");
mkdirSync(output, { recursive: true });
const { atoms } = JSON.parse(readFileSync(join(root, "cell.json")));
const lessons = atoms.map(({ slug: id, title }) => ({ id, title }));
const profile = mkdtempSync(join(tmpdir(), "zam-nt-gym7-browser-"));
const chrome = spawn(
  process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    "--remote-debugging-pipe",
    "--no-first-run",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--disable-default-apps",
    "--no-default-browser-check",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"] },
);
let seq = 0,
  buffer = "";
const pending = new Map();
const closed = new Promise((resolve) => chrome.once("close", resolve));
chrome.on("error", (error) => {
  for (const job of pending.values()) job.reject(error);
});
const errors = [];
const requests = [];
chrome.stdio[4].on("data", (chunk) => {
  buffer += chunk.toString();
  while (buffer.includes("\0")) {
    const index = buffer.indexOf("\0");
    const line = buffer.slice(0, index);
    buffer = buffer.slice(index + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id) {
      const job = pending.get(msg.id);
      pending.delete(msg.id);
      if (!job) continue;
      if (msg.error) job.reject(Error(JSON.stringify(msg.error)));
      else job.resolve(msg.result);
    } else {
      if (msg.method === "Runtime.exceptionThrown") errors.push(msg.params.exceptionDetails);
      if (msg.method === "Network.requestWillBeSent") requests.push(msg.params.request.url);
    }
  }
});
// The first command waits for Chrome's cold start, which can take longer than
// 15 s on a busy CI runner; every later command keeps the short limit.
function send(method, params = {}, sessionId, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(Error(`Chrome timed out: ${method}`));
    }, timeout);
    pending.set(id, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
    chrome.stdio[3].write(
      `${JSON.stringify({
        id,
        method,
        params,
        ...(sessionId ? { sessionId } : {}),
      })}\0`,
    );
  });
}
let session;
const page = (method, params) => send(method, params, session);
const evaluate = async (expression) => {
  const value = await page("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (value.exceptionDetails) throw Error(JSON.stringify(value.exceptionDetails));
  return value.result.value;
};
const screenshot = async (name, selector) => {
  const layout = await page("Page.getLayoutMetrics");
  const clip = selector
    ? await evaluate(
        `(()=>{const box=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:box.x+scrollX,y:box.y+scrollY,width:box.width,height:box.height,scale:1}})()`,
      )
    : {
        x: 0,
        y: 0,
        width: layout.cssContentSize.width,
        height: layout.cssContentSize.height,
        scale: 1,
      };
  const result = await page("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip,
  });
  writeFileSync(`${output}/${name}.png`, Buffer.from(result.data, "base64"));
};

const layout = (width, height) =>
  page("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
const until = async (expression) => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  assert.fail(`Browser made no progress toward ${expression}`);
};
const navigate = async (url, ready) => {
  await page("Page.navigate", { url });
  await until(ready);
};
const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const setInput = (selector, value) =>
  evaluate(`(() => {
  const field = document.querySelector(${JSON.stringify(selector)});
  field.value = ${JSON.stringify(value)};
  field.dispatchEvent(new Event("input", { bubbles: true }));
})()`);
const theme = (name) => evaluate(`document.documentElement.dataset.theme=${JSON.stringify(name)}`);
const fitsScreen = () => evaluate("document.documentElement.scrollWidth <= innerWidth");
const noBrokenText = () =>
  evaluate("!/\\bNaN\\b|undefined/.test(document.querySelector('main').innerText)");

try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" }, undefined, 60000);
  session = (await send("Target.attachToTarget", { targetId, flatten: true })).sessionId;
  await page("Page.enable");
  await page("Runtime.enable");
  await page("Network.enable");
  const course = pathToFileURL(join(root, "dist", "index.html")).href;
  const physics = new URL("./physik/index.html", course).href;
  await layout(1280, 1080);
  await navigate(course, "!!document.querySelector('.subject-overview')");
  assert.equal(await evaluate("document.querySelector('.subject-physics a').href"), physics);

  let lessonViews = 0;
  for (const mode of ["light", "dark"]) {
    await click('[data-view="overview"]');
    await theme(mode);
    await screenshot(`overview-${mode}`);
    await click("[data-open-informatics]");
    assert.equal(await evaluate("document.querySelectorAll('.stage-card').length"), 4);
    await screenshot(`informatik-path-${mode}`);
    await click('[data-view="formulas"]');
    assert.ok((await evaluate("document.querySelector('main h2').innerText")).includes("Fachbegriffe"));
    await screenshot(`informatik-reference-${mode}`);
    for (const { id, title } of lessons) {
      for (const level of [1, 2]) {
        await evaluate(`location.hash="#lesson=${id}&level=${level}"`);
        await until(`document.querySelector('.lesson-title')?.innerText === ${JSON.stringify(title)} &&
          document.querySelector('.exercise-head')?.innerText.includes("Level ${level}")`);
        assert.equal(await evaluate("document.querySelectorAll('#lab-goals li').length"), 3, id);
        assert.ok(await evaluate("!!document.querySelector('.task-prompt')?.innerText"), id);
        assert.ok(await evaluate("!!document.querySelector('#lab-visual svg[aria-label]')"), id);
        assert.ok(await noBrokenText(), id);
        assert.ok(await fitsScreen(), id);
        if (level === 1) await screenshot(`${id}-${mode}`, "#lab-card");
        lessonViews++;
      }
    }
  }

  await evaluate('location.hash="#lesson=inf7-wiki-editor"');
  await until("!!document.querySelector('.wiki-editor')");
  assert.equal(await evaluate("document.querySelector('.wiki-text-info').open"), false);
  await click(".wiki-text-info summary");
  assert.ok(
    await evaluate(
      "document.querySelector('.wiki-text-info[open] p').innerText.includes('Fortschritt zurücksetzen')",
    ),
  );
  await click(".wiki-text-info summary");
  await setInput('[data-wiki-field="title"]', "Unser Schatten-Wiki");
  await setInput('[data-wiki-field="body"]', "<img src=example> Versuchsbeschreibung");
  assert.equal(await evaluate("document.querySelector('.wiki-preview img') === null"), true);
  await setInput('[data-wiki-field="target"]', "1");
  await click("[data-wiki-link]");
  assert.equal(await evaluate("document.querySelector('[data-wiki-page]').value"), "1");
  await setInput("[data-version-name]", "schattenwiki-v1");
  await click("[data-version-save]");
  await page("Page.reload");
  await until("document.querySelector('.wiki-preview h5')?.textContent === 'Unser Schatten-Wiki'");
  assert.equal(await evaluate("document.querySelector('[data-version-list]').value"), "schattenwiki-v1");
  await setInput('[data-wiki-field="title"]', "Zweite Fassung");
  await click("[data-version-open]");
  assert.equal(
    await evaluate("document.querySelector('.wiki-preview h5').textContent"),
    "Unser Schatten-Wiki",
  );

  const downloadFolder = join(profile, "downloads");
  mkdirSync(downloadFolder);
  await send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: downloadFolder });
  await click(".wiki-file-options summary");
  await click("[data-version-export]");
  const downloaded = join(downloadFolder, "schattenwiki-v1.json");
  for (let attempt = 0; attempt < 100 && !existsSync(downloaded); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  assert.ok(existsSync(downloaded), "the browser downloaded the wiki checkpoint");
  const checkpoint = JSON.parse(readFileSync(downloaded, "utf8"));
  assert.equal(checkpoint.name, "schattenwiki-v1");
  assert.equal(checkpoint.pages[0].title, "Unser Schatten-Wiki");
  assert.equal(checkpoint.pages[0].target, 1);

  const openCheckpoint = async (path) => {
    const { root } = await page("DOM.getDocument");
    const { nodeId } = await page("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: "[data-version-file]",
    });
    await page("DOM.setFileInputFiles", { nodeId, files: [path] });
  };
  await setInput('[data-wiki-field="title"]', "Entwurf vor dem Import");
  await openCheckpoint(downloaded);
  await until("document.querySelector('.wiki-preview h5')?.textContent === 'Unser Schatten-Wiki'");
  assert.equal(await evaluate("document.querySelector('.wiki-preview img') === null"), true);
  const invalid = join(downloadFolder, "invalid.json");
  writeFileSync(invalid, '{"schema":1,"name":"invalid","pages":[]}');
  await openCheckpoint(invalid);
  await until("document.querySelector('[data-wiki-status]')?.textContent.includes('kein gültiger')");
  assert.equal(
    await evaluate("document.querySelector('.wiki-preview h5').textContent"),
    "Unser Schatten-Wiki",
  );

  await evaluate('location.hash="#lesson=inf7-feste-schleife&level=1"');
  await until(
    "document.querySelector('.lesson-title')?.textContent === 'Wiederholen mit fester Anzahl'",
  );
  for (
    let attempt = 0;
    attempt < 3 && !(await evaluate("!!document.querySelector('[data-field]')"));
    attempt++
  ) {
    await click("#task-new-btn");
  }
  assert.equal(await evaluate("document.querySelector('[data-field]').inputMode"), "numeric");
  const prompt = await evaluate("document.querySelector('.task-prompt').textContent");
  const [, repeats, perRound] = prompt.match(/läuft (\d+)-mal.*jeweils (\d+) Spielmarken/);
  const answer = Number(repeats) * Number(perRound);
  await setInput("[data-field]", String(answer + 1));
  await click("#task-check-btn");
  assert.ok(await evaluate("document.querySelector('#task-feedback').classList.contains('is-warning')"));
  await setInput("[data-field]", String(answer));
  await click("#task-check-btn");
  assert.ok(
    (await evaluate("document.querySelector('#task-feedback').textContent")).includes("Richtig"),
  );
  await screenshot("written-answer", "#exercise-card");

  await evaluate('location.hash="#lesson=inf7-bedingte-schleife"');
  await until("!!document.querySelector('[data-action=step]')");
  await setInput('[data-param="body"]', "1");
  await click('[data-action="step"]');
  await click('[data-action="step"]');
  assert.ok(
    (await evaluate("document.querySelector('#lab-readouts').innerText")).includes("Durchläufe: 2"),
  );
  assert.ok(await evaluate("document.querySelector('[data-goal=near]').classList.contains('is-done')"));
  await screenshot("robot-goal");

  await evaluate("document.querySelectorAll('.toast-close').forEach(button => button.click())");
  await layout(390, 870);
  await click('[data-view="overview"]');
  assert.ok(await fitsScreen(), "mobile overview");
  await screenshot("overview-mobile");
  await evaluate('location.hash="#lesson=inf7-wiki-editor"');
  await until("!!document.querySelector('.wiki-editor')");
  assert.ok(await fitsScreen(), "mobile wiki lesson");
  await screenshot("wiki-mobile", ".wiki-editor");

  const learnerKeys = [
    "informatik_gym7_academy_progress_v1",
    "informatik_gym7_wiki_v1",
    "informatik_gym7_wiki_versions_v1",
  ];
  const storedLearnerKeys = () =>
    evaluate(`${JSON.stringify(learnerKeys)}.filter(key => localStorage.getItem(key) !== null)`);
  assert.deepEqual(await storedLearnerKeys(), learnerKeys);
  const firstSession = session;
  const { targetId: secondTarget } = await send("Target.createTarget", { url: "about:blank" });
  const secondSession = (
    await send("Target.attachToTarget", {
      targetId: secondTarget,
      flatten: true,
    })
  ).sessionId;
  session = secondSession;
  await page("Page.enable");
  await page("Runtime.enable");
  await navigate(
    `${course}#lesson=inf7-wiki-editor`,
    "document.querySelector('.wiki-preview h5')?.textContent === 'Unser Schatten-Wiki'",
  );
  session = firstSession;

  await click('[data-view="path"]');
  await click("#reset-progress-btn");
  assert.ok(await evaluate("document.querySelector('#reset-dialog').innerText.includes('Wiki-Seiten')"));
  await click("#reset-dialog [data-close]");
  assert.deepEqual(await storedLearnerKeys(), learnerKeys);
  await click("#reset-progress-btn");
  await click("#reset-confirm-btn");
  assert.deepEqual(await storedLearnerKeys(), []);
  assert.ok(
    existsSync(downloaded),
    "a previously exported copy remains in the selected download folder",
  );

  session = secondSession;
  await until("!!document.querySelector('.path') && !document.querySelector('.wiki-editor')");
  await evaluate('location.hash="#lesson=inf7-wiki-editor"');
  await until("document.querySelector('.wiki-preview h5')?.textContent === 'Schulwiki'");
  assert.equal(await evaluate("document.querySelector('[data-version-list]').options.length"), 0);
  await send("Target.closeTarget", { targetId: secondTarget });
  session = firstSession;

  await layout(1280, 1080);
  await click('[data-view="overview"]');
  await click(".subject-physics a");
  await until("location.pathname.endsWith('/physik/index.html') && !!document.querySelector('main h1')");
  assert.ok((await evaluate("document.querySelector('main').innerText")).includes("Licht und Schatten"));
  await screenshot("physik-path");
  await click('[data-view="experiments"]');
  await until("location.hash === '#view=experiments'");
  assert.ok((await evaluate("document.querySelector('main').innerText")).includes("Versuchsnotizbuch"));
  await screenshot("physik-versuche");
  await click('a[href="../index.html"]');
  await until("!!document.querySelector('.subject-overview')");
  assert.equal(await evaluate("location.href"), course);
  assert.deepEqual(errors, []);
  assert.deepEqual(
    requests.filter((url) => /^https?:/.test(url)),
    [],
  );
  console.log(
    `Chrome checked ${lessonViews} Informatics lesson views, both themes, mobile, wiki storage and files, reset across tabs, a typed exercise, robot goals and the Physics round trip.`,
  );
} finally {
  chrome.kill();
  await closed;
  rmSync(profile, { recursive: true, force: true, maxRetries: 3 });
}
