import "./styles.css";
import {
  CELL_TITLE,
  findLesson,
  LESSONS,
  MODULES,
  SOURCES,
} from "./curriculum";
import { esc, parseLink, shuffled } from "./html";
import { LABS, mountLab } from "./lab-ui";
import {
  canAssess,
  canCompare,
  complete,
  freshProgress,
  invalidateWriting,
  loadProgress,
  saveProgress,
  selectedLessons,
  writingKey,
} from "./progress";
import type { Lesson, Level, ModuleId } from "./types";
import { mountWorkshop } from "./workshop-ui";

let progress = loadProgress();
const main = document.querySelector<HTMLElement>("#main")!;
const dialog = document.querySelector<HTMLDialogElement>("#dialog")!;
let toastTimer: ReturnType<typeof setTimeout> | undefined;
const compared = new Set<string>();
const rubric = new Map<string, boolean[]>();

function toast(message: string): void {
  const element = document.querySelector<HTMLElement>("#toast")!;
  element.textContent = message;
  element.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("visible"), 4500);
}
function persist(): void {
  document.querySelector<HTMLElement>("#storage-notice")!.hidden =
    saveProgress(progress);
}
function updateCompletion(): void {
  persist();
  main
    .querySelectorAll<HTMLElement>("[data-lesson-status]")
    .forEach((element) => {
      const lesson = findLesson(element.dataset.lessonStatus!);
      if (lesson)
        element.textContent = complete(progress, lesson)
          ? "✓ Auf diesem Level bearbeitet"
          : "Noch in Arbeit";
    });
  main
    .querySelectorAll<HTMLElement>("[data-sidebar-status]")
    .forEach((element) => {
      const lesson = findLesson(element.dataset.sidebarStatus!);
      element.textContent =
        lesson && complete(progress, lesson) ? "✓" : element.dataset.order!;
    });
  main.querySelectorAll<HTMLElement>("[data-lab-status]").forEach((element) => {
    element.textContent = progress.labs.includes(element.dataset.labStatus!)
      ? "✓ Werkstattauftrag erfüllt"
      : "Werkstattauftrag noch offen";
  });
}
function moduleName(id: ModuleId): string {
  return MODULES.find((module) => module.id === id)!.title;
}

function renderPath(): void {
  const selected = selectedLessons(progress);
  const done = selected.filter((lesson) => complete(progress, lesson)).length;
  const next =
    selected.find((lesson) => !complete(progress, lesson)) ?? selected[0];
  main.innerHTML = `<section class="hero"><div><p class="eyebrow">REALSCHULE BAYERN · IT-VERTIEFUNGEN</p><h1>Informatik verstehen.<br><em>Selbst ausprobieren.</em></h1><p class="lead">Eigene Programme, digitale Schaltungen, Roboter und KI: Entdecke, wie die Systeme funktionieren, und prüfe deine Ideen in fünf Werkstätten.</p><a class="button" href="#lesson=${next.id}">${done ? "Weiterlernen" : "Mit der ersten Lektion starten"}<span aria-hidden="true">→</span></a><p class="hero-meta">36 Lektionen · 72 ZAM-Karten · offline nutzbar</p></div><div class="hero-art" aria-hidden="true"><div class="art-code">if (neugierig) {<br>&nbsp; ausprobieren();<br>&nbsp; verstehen();<br>}</div><div class="art-orbit orbit-one">01</div><div class="art-orbit orbit-two">{ }</div><div class="art-caption">DEIN WISSEN. DEIN EXPERIMENT.</div></div></section><section class="scope"><span class="scope-symbol" aria-hidden="true">i</span><div><strong>Wähle passend zu deinem Unterricht.</strong><p>In Bayern heißt das Fach Informationstechnologie. Die Schule legt fest, wann sie die Module unterrichtet. Dieses Vertiefungspaket für Klasse 10 bietet fünf Wahlmodule; es deckt nicht das gesamte IT-Angebot ab.</p></div></section><section class="path-heading"><div><p class="eyebrow">DEIN LERNPFAD</p><h2>Schritt für Schritt zum Verständnis</h2></div><div class="progress-summary"><strong>${done}<span> / ${selected.length}</span></strong><span>auf Level ${progress.level} bearbeitet</span><progress value="${done}" max="${selected.length}" aria-label="Bearbeitete Lektionen"></progress></div></section><details class="module-selection"><summary>Module für deinen Lernpfad auswählen · ${progress.modules.length} aktiv</summary><p>Die Auswahl filtert deinen Lernpfad. Deine Antworten bleiben erhalten. Die ganze ZAM-Zelle enthält nach der Aufnahme alle 72 Karten.</p><fieldset><legend>Welche Bereiche behandelt ihr?</legend>${MODULES.map((module) => `<label><input type="checkbox" data-module="${module.id}" ${progress.modules.includes(module.id) ? "checked" : ""}><strong>${esc(module.title)}</strong><span>IT ${module.code}</span></label>`).join("")}</fieldset></details><div class="modules">${MODULES.filter(
    (module) => progress.modules.includes(module.id),
  )
    .map((module, moduleIndex) => {
      const lessons = LESSONS.filter((lesson) => lesson.module === module.id);
      return `<section class="module-card" data-stage="${module.id}"><div class="module-heading"><span class="module-icon" aria-hidden="true">${esc(module.icon)}</span><div><p class="eyebrow">${String(moduleIndex + 1).padStart(2, "0")} · WAHL­MODUL IT ${module.code}</p><h2>${esc(module.title)}</h2><p>${esc(module.description)}</p></div><span class="module-count">${lessons.filter((lesson) => complete(progress, lesson)).length}/${lessons.length}</span></div><ol class="lessons">${lessons.map((lesson, index) => `<li><a href="#lesson=${lesson.id}"><span class="lesson-number ${complete(progress, lesson) ? "done" : ""}">${complete(progress, lesson) ? "✓" : String(index + 1).padStart(2, "0")}</span><span>${esc(lesson.title)}${lesson.lab ? `<small>Mit ausführbarem Werkstattauftrag</small>` : ""}</span><span class="lesson-arrow" aria-hidden="true">↗</span></a></li>`).join("")}</ol></section>`;
    })
    .join(
      "",
    )}</div><section class="related"><p class="eyebrow">VORHANDENE GRUNDLAGEN · ONLINE</p><h2>Hier kannst du anknüpfen</h2><div class="related-links"><a href="https://academy.zam-os.org/algorithmen/" target="_blank" rel="noopener noreferrer">Algorithmen & Programmieren ↗<small>IT 2.6.1 · eigene Programme und Debugging</small></a><a href="https://academy.zam-os.org/sql/" target="_blank" rel="noopener noreferrer">Datenbanken & SQL ↗<small>IT 2.3.1 / 2.3.2 · Tabellen und Abfragen</small></a><a href="https://academy.zam-os.org/datennetze/" target="_blank" rel="noopener noreferrer">Datennetze I ↗<small>IT 2.5.1 · Adressen und Übertragungswege</small></a><a href="https://academy.zam-os.org/uml/" target="_blank" rel="noopener noreferrer">UML-Werkstatt ↗<small>Modelle und Diagramme selbst zeichnen</small></a></div></section>`;
  main
    .querySelectorAll<HTMLInputElement>("input[data-module]")
    .forEach((input) => {
      input.addEventListener("change", () => {
        const id = input.dataset.module as ModuleId;
        if (!input.checked && progress.modules.length === 1) {
          input.checked = true;
          toast(
            "Lass mindestens einen Bereich für deinen Lernpfad ausgewählt.",
          );
          return;
        }
        progress.modules = input.checked
          ? [...progress.modules, id]
          : progress.modules.filter((module) => module !== id);
        persist();
        renderPath();
        main.querySelector<HTMLDetailsElement>(".module-selection")!.open =
          true;
      });
    });
}

function renderLesson(lesson: Lesson): void {
  const module = MODULES.find((entry) => entry.id === lesson.module)!;
  const path = selectedLessons(progress);
  const index = path.findIndex((entry) => entry.id === lesson.id);
  const task = lesson.tasks[progress.level];
  const key = writingKey(lesson.id, progress.level);
  const draft = progress.drafts[key] ?? "";
  const assessed = progress.writing.includes(key);
  if (assessed) compared.add(key);
  if (!rubric.has(key)) rubric.set(key, [assessed, assessed, assessed]);
  const answers = shuffled(
    [lesson.quiz.answer, ...lesson.quiz.wrong],
    `${lesson.id}:quiz`,
  );
  main.innerHTML = `<div class="lesson-shell" data-stage="${lesson.module}"><aside class="lesson-sidebar"><a href="#view=path" class="back-link">← Zum Lernpfad</a><p class="eyebrow">IT ${module.code}</p><h2>${esc(module.title)}</h2><ol>${LESSONS.filter(
    (entry) => entry.module === lesson.module,
  )
    .map(
      (entry, order) =>
        `<li><a href="#lesson=${entry.id}" ${entry.id === lesson.id ? 'aria-current="page"' : ""}><span data-sidebar-status="${entry.id}" data-order="${order + 1}">${complete(progress, entry) ? "✓" : order + 1}</span>${esc(entry.title)}</a></li>`,
    )
    .join(
      "",
    )}</ol></aside><article class="lesson-content"><div class="lesson-topline"><p class="eyebrow">${esc(module.title)} · ${index + 1} / ${path.length}</p><span class="badge" data-lesson-status="${lesson.id}"></span></div><h1>${esc(lesson.title)}</h1><p class="lead">${esc(lesson.intro)}</p><div class="reading">${lesson.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</div><div class="takeaway"><span aria-hidden="true">↳</span><p>${esc(lesson.takeaway)}</p></div><section class="activity"><p class="eyebrow">01 · SCHNELLCHECK</p><h2>${esc(lesson.quiz.question)}</h2><div class="quiz">${answers.map((answer, answerIndex) => `<button class="quiz-option" data-answer="${answerIndex}"><span>${String.fromCharCode(65 + answerIndex)}</span>${esc(answer)}</button>`).join("")}</div><div id="quiz-feedback" aria-live="polite">${progress.quiz.includes(lesson.id) ? '<p class="small">✓ Schnellcheck bereits richtig beantwortet. Du kannst ihn erneut versuchen.</p>' : ""}</div></section><section class="activity" id="lesson-workshop"></section><section class="activity"><div class="writing-heading"><p class="eyebrow">03 · SELBST ERKLÄREN</p><div class="level-switch" role="group" aria-label="Aufgabenniveau"><button data-level="1" aria-pressed="${progress.level === 1}">Level 1 · geführt</button><button data-level="2" aria-pressed="${progress.level === 2}">Level 2 · Transfer</button></div></div><h2>${progress.level === 1 ? "Erkläre den Zusammenhang" : "Wende dein Wissen an"}</h2><p class="task">${esc(task.prompt)}</p>${progress.level === 1 ? `<details><summary>Ein Denkanstoß</summary><ul>${task.hints.map((hint) => `<li>${esc(hint)}</li>`).join("")}</ul></details>` : ""}<label class="field-label" for="draft">Deine Erklärung</label><textarea id="draft" rows="5" maxlength="8000" placeholder="Beschreibe deinen Gedankengang mit eigenen Worten …">${esc(draft)}</textarea><div class="actions"><button id="compare" class="button secondary" ${canCompare(draft) ? "" : "disabled"}>Mit der Musterlösung vergleichen</button><span class="small">Mindestens ein eigener Gedankengang · 20 Zeichen</span></div><div id="self-review" ${compared.has(key) ? "" : "hidden"}><div class="model-answer"><strong>Eine mögliche Lösung</strong><p>${esc(task.model)}</p></div><fieldset class="rubric"><legend>Prüfe deine eigene Erklärung</legend>${task.criteria.map((criterion, criterionIndex) => `<label><input type="checkbox" data-criterion="${criterionIndex}" ${rubric.get(key)![criterionIndex] ? "checked" : ""}>${esc(criterion)}</label>`).join("")}</fieldset><button class="button" id="assess" ${canAssess(draft, rubric.get(key)!) ? "" : "disabled"}>Selbsteinschätzung speichern</button><p class="small">Du beurteilst den Inhalt selbst. Die App bewertet deinen Text nicht automatisch.</p></div><p id="writing-status" role="status">${assessed ? "✓ Deine Selbsteinschätzung ist auf diesem Level gespeichert." : ""}</p></section>${lesson.lab ? `<section class="activity"><p class="eyebrow">04 · AUSPROBIEREN</p><div class="lab-heading"><h2>${esc(LABS.find((entry) => entry.id === lesson.lab)!.title)}</h2><span class="badge" data-lab-status="${lesson.lab}"></span></div><div id="lesson-lab"></div></section>` : ""}<section class="lesson-sources"><h3>Nachlesen und weiterdenken</h3><ul>${lesson.sourceIds
    .map((id) => {
      const source = SOURCES.find((entry) => entry.id === id)!;
      return `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a></li>`;
    })
    .join(
      "",
    )}</ul>${lesson.prerequisites.length ? `<p>Vorwissen: ${lesson.prerequisites.map((id) => `<a href="#lesson=${id}">${esc(findLesson(id)!.title)}</a>`).join(" · ")}</p>` : ""}</section><nav class="lesson-navigation" aria-label="Lektionen">${index > 0 ? `<a class="button secondary" href="#lesson=${path[index - 1].id}">← Vorherige Lektion</a>` : '<a class="button secondary" href="#view=path">← Lernpfad</a>'}${index < path.length - 1 ? `<a class="button" href="#lesson=${path[index + 1].id}">Nächste Lektion →</a>` : '<a class="button" href="#view=path">Zum Lernpfad →</a>'}</nav></article></div>`;
  main
    .querySelectorAll<HTMLButtonElement>("[data-answer]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const correct =
          answers[Number(button.dataset.answer)] === lesson.quiz.answer;
        progress.quiz = progress.quiz.filter((id) => id !== lesson.id);
        if (correct) progress.quiz.push(lesson.id);
        main.querySelectorAll("[data-answer]").forEach((entry) => {
          entry.classList.remove("correct", "incorrect");
          entry.removeAttribute("aria-pressed");
        });
        button.classList.add(correct ? "correct" : "incorrect");
        button.setAttribute("aria-pressed", "true");
        main.querySelector("#quiz-feedback")!.innerHTML =
          `<p class="feedback ${correct ? "success" : "warning"}">${correct ? "✓ Das stimmt." : "Noch nicht. Versuche es erneut."} ${esc(correct ? lesson.quiz.explanation : "Lies die Regel und prüfe die Begriffe noch einmal.")}</p>`;
        updateCompletion();
      });
    });
  main.querySelectorAll<HTMLButtonElement>("[data-level]").forEach((button) => {
    button.addEventListener("click", () => {
      progress.level = Number(button.dataset.level) as Level;
      persist();
      const params = new URLSearchParams({
        lesson: lesson.id,
        level: String(progress.level),
      });
      history.replaceState(null, "", `#${params}`);
      renderLesson(lesson);
    });
  });
  const draftInput = main.querySelector<HTMLTextAreaElement>("#draft")!;
  const compareButton = main.querySelector<HTMLButtonElement>("#compare")!;
  const assessButton = main.querySelector<HTMLButtonElement>("#assess")!;
  const updateAssess = () => {
    assessButton.disabled = !canAssess(draftInput.value, rubric.get(key)!);
  };
  draftInput.addEventListener("input", () => {
    progress.drafts[key] = draftInput.value;
    invalidateWriting(progress, lesson.id, progress.level);
    compared.delete(key);
    rubric.set(key, [false, false, false]);
    main
      .querySelectorAll<HTMLInputElement>("[data-criterion]")
      .forEach((input) => {
        input.checked = false;
      });
    main.querySelector<HTMLElement>("#self-review")!.hidden = true;
    main.querySelector("#writing-status")!.textContent =
      "Text geändert. Vergleiche die neue Fassung erneut.";
    compareButton.disabled = !canCompare(draftInput.value);
    updateAssess();
    updateCompletion();
  });
  compareButton.addEventListener("click", () => {
    if (!canCompare(draftInput.value)) return;
    compared.add(key);
    main.querySelector<HTMLElement>("#self-review")!.hidden = false;
    main.querySelector("#writing-status")!.textContent =
      "Vergleiche deine Erklärung mit der Musterlösung und prüfe die drei Kriterien.";
    updateAssess();
  });
  main
    .querySelectorAll<HTMLInputElement>("[data-criterion]")
    .forEach((input) => {
      input.addEventListener("change", () => {
        rubric.get(key)![Number(input.dataset.criterion)] = input.checked;
        invalidateWriting(progress, lesson.id, progress.level);
        main.querySelector("#writing-status")!.textContent = "";
        updateAssess();
        updateCompletion();
      });
    });
  assessButton.addEventListener("click", () => {
    if (!compared.has(key) || !canAssess(draftInput.value, rubric.get(key)!))
      return;
    progress.drafts[key] = draftInput.value;
    if (!progress.writing.includes(key)) progress.writing.push(key);
    main.querySelector("#writing-status")!.textContent =
      "✓ Deine Selbsteinschätzung ist auf diesem Level gespeichert.";
    updateCompletion();
  });
  mountWorkshop(
    main.querySelector("#lesson-workshop")!,
    lesson.id,
    progress,
    updateCompletion,
  );
  if (lesson.lab)
    mountLab(
      main.querySelector("#lesson-lab")!,
      lesson.lab,
      progress,
      updateCompletion,
    );
  updateCompletion();
}

function renderLabs(id?: string): void {
  const lab = LABS.find((entry) => entry.id === id);
  if (lab) {
    main.innerHTML = `<section class="standalone-lab" data-stage="${lab.module}"><a class="back-link" href="#view=labs">← Alle Werkstätten</a><p class="eyebrow">${esc(moduleName(lab.module as ModuleId))}</p><div class="lab-heading"><h1>${esc(lab.title)}</h1><span class="badge" data-lab-status="${lab.id}"></span></div><div id="lab"></div><p class="linked-lessons">Passende Lektionen: ${
      LESSONS.filter((lesson) => lesson.lab === lab.id)
        .map(
          (lesson) => `<a href="#lesson=${lesson.id}">${esc(lesson.title)}</a>`,
        )
        .join(" · ") ||
      '<a href="#lesson=it10-roboterprogramm">Ein Programm auf mehreren Höfen testen</a>'
    }</p></section>`;
    mountLab(main.querySelector("#lab")!, lab.id, progress, updateCompletion);
    updateCompletion();
  } else {
    main.innerHTML = `<section class="page-intro"><p class="eyebrow">DEIN EXPERIMENTIERRAUM</p><h1>Ideen werden überprüfbar.</h1><p class="lead">Verändere Regeln, schreibe Programme, beobachte Ergebnisse. Jede Werkstatt läuft vollständig in deinem Browser.</p></section><div class="lab-cards">${MODULES.map(
      (module) =>
        `<section data-stage="${module.id}"><h2><span class="module-icon">${esc(module.icon)}</span>${esc(module.title)}</h2>${LABS.filter(
          (entry) => entry.module === module.id,
        )
          .map(
            (entry) =>
              `<a class="lab-card" href="#view=labs&lab=${entry.id}"><strong>${esc(entry.title)} <span aria-hidden="true">↗</span></strong><p>${esc(entry.description)}</p><small>${progress.labs.includes(entry.id) ? "✓ Auftrag erfüllt" : "Selbst ausprobieren"}</small></a>`,
          )
          .join("")}</section>`,
    ).join("")}</div>`;
  }
}

function renderSources(): void {
  main.innerHTML = `<section class="page-intro"><p class="eyebrow">HERKUNFT UND UMFANG</p><h1>Worauf dieses Paket aufbaut.</h1><p class="lead">Eigene Erklärungen und Aufgaben, abgeglichen mit dem LehrplanPLUS Bayern am 24. Oktober 2026.</p></section><section class="source-content"><h2>Ein Vertiefungsangebot für deinen Unterricht</h2><p>Der offizielle IT-Lehrplan gilt modular für die Jahrgangsstufen 5 bis 10. Die fünf hier gewählten Bereiche sind Wahlmodule des Aufbauunterrichts mit jeweils etwa 14 vorgesehenen Unterrichtsstunden. Die Schule bestimmt ihre Auswahl und zeitliche Zuordnung; die Zahl der App-Lektionen ist keine Umrechnung in Unterrichtsstunden.</p><ul>${MODULES.map((module) => `<li>IT ${module.code}: ${esc(module.title)} · ${LESSONS.filter((lesson) => lesson.module === module.id).length} Lektionen</li>`).join("")}</ul><h2>Was du zusätzlich praktisch übst</h2><p>Freie standardisierte Diagramme zeichnest du im Unterricht oder der verlinkten UML-Werkstatt. Reale Robotermontage, Sensorprüfung, sichere Hardwareerprobung sowie gemeinsame Präsentation und Diskussion bleiben zusätzliche Leistungen. Die digitalen Modellgrenzen stehen bei jeder Werkstatt. Ein bearbeiteter Lernpfad bescheinigt keine vollständige fachliche Beherrschung.</p><p>Textverarbeitung, Tabellenkalkulation, CAD und Multimedia sind weitere Teile des IT-Angebots. Dieses Paket beansprucht dafür keine Abdeckung. Vorhandene Academy-Angebote für SQL, Algorithmen und Datennetze I ergänzen den Lernpfad und behalten ihre eigenen Karten und Lernstände.</p><h2>Quellen zum Nachlesen</h2><p>Links werden erst geöffnet, wenn du sie anklickst. Für externe Quellen und die anderen Academy-Angebote brauchst du eine Internetverbindung.</p><ul class="source-list">${SOURCES.map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a><small>${esc(new URL(source.url).hostname)}</small></li>`).join("")}</ul></section>`;
}

function route(focus = false): void {
  const link = parseLink(location.hash, location.search);
  if (link.level) progress.level = link.level;
  const lesson = link.lesson ? findLesson(link.lesson) : undefined;
  let current = link.view ?? "path";
  if (lesson) {
    progress.active = lesson.id;
    if (!progress.modules.includes(lesson.module))
      progress.modules.push(lesson.module);
    current = "lesson";
    persist();
    renderLesson(lesson);
  } else if (link.lesson) {
    renderPath();
    current = "path";
    toast("Diese Lektion ist nicht vorhanden. Wähle eine aus dem Lernpfad.");
  } else if (current === "labs") {
    renderLabs(link.lab);
    if (link.lab && !LABS.some((lab) => lab.id === link.lab))
      toast("Diese Werkstatt ist nicht vorhanden. Wähle einen Auftrag aus.");
  } else if (current === "sources") renderSources();
  else {
    current = "path";
    renderPath();
  }
  document
    .querySelectorAll<HTMLAnchorElement>("[data-view]")
    .forEach((anchor) => {
      if (
        anchor.dataset.view === current ||
        (current === "lesson" && anchor.dataset.view === "path")
      )
        anchor.setAttribute("aria-current", "page");
      else anchor.removeAttribute("aria-current");
    });
  document.title = `${lesson?.title ?? (current === "labs" ? "Werkstätten" : current === "sources" ? "Quellen" : "Informatik 10")} · ZAM Academy`;
  if (focus) {
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function showDialog(title: string, body: string): void {
  dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${esc(title)}</h2><button class="icon-button" data-close aria-label="Dialog schließen">×</button></div>${body}`;
  dialog.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });
  dialog.showModal();
}
document.querySelector("#zam")!.addEventListener("click", () => {
  const request = `Nimm mich in die Zelle „${CELL_TITLE}“ auf.`;
  showDialog(
    "Mit ZAM behalten",
    `<p>Die Zelle enthält <strong>72 Karten</strong>. Jede führt zurück zur passenden Lektion. Eine Aufnahme der ganzen Zelle umfasst alle fünf Module.</p><p>Nach der Veröffentlichung findest du das Paket in ZAM unter <strong>Lern-Karten → Importieren → Aus der ZAM Academy</strong>. Öffne die Academy-Liste einmal, damit dein Agent neue Pakete aus dem lokalen Katalog aufnehmen kann.</p><p>Du kannst deinen Agenten dann bitten:</p><blockquote>${esc(request)}</blockquote><button class="button" id="copy-request">Bitte kopieren</button><p id="copy-status" role="status">Deine Texte und dein App-Fortschritt werden dabei nicht übertragen.</p>`,
  );
  dialog.querySelector("#copy-request")!.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(request);
      dialog.querySelector("#copy-status")!.textContent = "Kopiert.";
    } catch {
      dialog.querySelector("#copy-status")!.textContent =
        "Markiere und kopiere den Satz bitte selbst.";
    }
  });
});
document.querySelector(".skip")!.addEventListener("click", (event) => {
  event.preventDefault();
  main.focus();
});
document.querySelector("#reset")!.addEventListener("click", () => {
  showDialog(
    "Fortschritt zurücksetzen?",
    '<p>Deine Antworten, Programme, Werkstattabschlüsse und Modulauswahl werden in dieser App gelöscht. Das lässt sich nicht rückgängig machen.</p><div class="actions"><button class="button secondary" data-close>Abbrechen</button><button class="button danger" id="confirm-reset">Zurücksetzen</button></div>',
  );
  dialog.querySelector("#confirm-reset")!.addEventListener("click", () => {
    progress = freshProgress();
    compared.clear();
    rubric.clear();
    persist();
    dialog.close();
    history.replaceState(null, "", "#view=path");
    route(true);
  });
});
const themeButton = document.querySelector<HTMLButtonElement>("#theme")!;
function applyTheme(theme: "light" | "dark"): void {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "☀ Hell" : "☾ Dunkel";
  themeButton.setAttribute(
    "aria-label",
    theme === "dark" ? "Helle Ansicht" : "Dunkle Ansicht",
  );
}
let initialTheme: "light" | "dark" = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches
  ? "dark"
  : "light";
try {
  const saved = localStorage.getItem("informatik_rs10_theme");
  if (saved === "light" || saved === "dark") initialTheme = saved;
} catch {
  /* The theme still works for this visit if storage is denied. */
}
applyTheme(initialTheme);
themeButton.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try {
    localStorage.setItem("informatik_rs10_theme", theme);
  } catch {
    /* Keep the in-memory choice. */
  }
});
window.addEventListener("hashchange", () => route(true));
persist();
route();
