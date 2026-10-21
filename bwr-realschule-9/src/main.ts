import "./styles.css";
import { CORE_LESSONS, EDITORIAL_DATE, findLesson, LESSONS, SOURCES, STAGES } from "./curriculum";
import {
  createAttempt,
  revealAttempt,
  skipAttempt,
  submitAttempt,
  type Attempt,
} from "./exercises/attempt";
import { ACCOUNTS } from "./finance";
import { bindLab, labHtml } from "./labs";
import type { LearnerEntry, Lesson } from "./model/types";
import {
  completion,
  isComplete,
  keyOf,
  loadProgress,
  noteDocumented,
  saveProgress,
} from "./storage/progress";
import { canAcceptSelfAssessment, checkWorkshop, esc, shuffle } from "./workshop";
import { parseTrainingDeepLink, zamEnrolRequest } from "./zam/zam-link";

const loaded = loadProgress();
const p = loaded.progress;
let persistent = loaded.persistent;
const attempts = new Map<string, Attempt>();
const $ = <T extends Element = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Bedienelement fehlt: ${selector}`);
  return element;
};
const app = $("#app");
function persist() {
  persistent = saveProgress(p);
  const warning = document.querySelector<HTMLElement>("#storage-warning");
  if (warning) warning.hidden = persistent;
}
function addOnce(list: string[], id: string) {
  if (!list.includes(id)) list.push(id);
}
function deepLink() {
  const link = parseTrainingDeepLink(location.hash, location.search);
  if (link.lessonId && findLesson(link.lessonId)) p.active = link.lessonId;
  if (link.level) p.level = link.level;
}
deepLink();
function navigate(id: string) {
  if (!findLesson(id)) return;
  p.active = id;
  history.replaceState(null, "", `#lesson=${encodeURIComponent(id)}`);
  persist();
  render();
  $("#lesson").focus();
  window.scrollTo({ top: 0, behavior: "instant" });
}
function render() {
  const lesson = findLesson(p.active) ?? LESSONS[0];
  const c = completion(p);
  const visible = LESSONS.filter((l) => !l.optional || p.extra || l.id === p.active);
  app.innerHTML = `<a class="skip-link" href="#lesson">Zum Lerninhalt</a><header class="topbar"><a class="brand" href="../">ZAM <span>ACADEMY</span></a><span class="course-label">Bayern · Realschule · Zweig II</span><button id="sources-button" class="quiet">Quellen & Praxis</button></header>
    <div class="shell"><aside class="sidebar" aria-label="Lernpfad"><div class="sidebar-heading"><span class="eyebrow">Dein Lernpfad</span><h1>BwR <span>9</span></h1><p>Verstehen. Rechnen. Buchen.</p></div><div class="progress-box"><div><strong id="progress-count">${c.done} / ${c.total}</strong><span>Kernlektionen</span></div><progress id="progress" max="${c.total}" value="${c.done}" aria-label="Abgeschlossene Kernlektionen"></progress></div><label class="extra-switch"><input id="extra" type="checkbox" ${p.extra ? "checked" : ""}> Grundlagen anzeigen</label><nav>${STAGES.map(
      (s) => {
        const entries = visible.filter((l) => l.lb === s.lb);
        if (!entries.length) return "";
        return `<details class="stage" ${s.lb === lesson.lb ? "open" : ""}><summary>${s.lb ? `0${s.lb}` : "+"} <span>${esc(s.title)}</span></summary>${entries.map((l) => `<button class="lesson-link ${l.id === lesson.id ? "active" : ""}" data-lesson="${l.id}" ${l.id === lesson.id ? 'aria-current="step"' : ""}><span class="lesson-dot" aria-hidden="true">${isComplete(p, l.id) ? "✓" : "·"}</span>${esc(l.title)}</button>`).join("")}</details>`;
      },
    ).join(
      "",
    )}</nav><p class="small">44 Kernlektionen · 2 Auffrischungen<br>Ohne Anmeldung. Lokal gespeichert.</p></aside>
    <main id="lesson" tabindex="-1"><div id="storage-warning" class="notice" ${persistent ? "hidden" : ""}>Dieser Browser erlaubt das Speichern gerade nicht. Du kannst weiterlernen; dein Fortschritt bleibt nur bis zum Schließen erhalten.</div><div class="lesson-top"><span class="eyebrow">${lesson.optional ? "Optionale Auffrischung" : `Lernbereich ${lesson.lb} · ${STAGES.find((s) => s.lb === lesson.lb)?.title ?? "BwR"}`}</span><label class="level-switch">Übungsniveau <select id="level"><option value="1" ${p.level === 1 ? "selected" : ""}>1 · Mit Leitfragen</option><option value="2" ${p.level === 2 ? "selected" : ""}>2 · Übertragen</option></select></label></div><h2 class="lesson-title">${esc(lesson.title)}</h2><p class="intro">${esc(lesson.intro)}</p>${lesson.optional ? '<p class="notice">Diese Auffrischung zählt nicht zu den 44 Kernlektionen. Ein ZAM-Kartenlink öffnet sie auch bei ausgeblendetem Grundlagenbereich.</p>' : ""}<div class="reading">${lesson.paragraphs.map((x) => `<p>${esc(x)}</p>`).join("")}</div><div class="takeaway"><span>Zum Mitnehmen</span><p>${esc(lesson.takeaway)}</p></div>
    <div class="evidence" id="evidence"></div>${lesson.lab ? labHtml(lesson.lab) : ""}${quizHtml(lesson)}${workshopHtml(lesson)}${lesson.practice ? practiceHtml(lesson) : ""}${writingHtml(lesson)}<div class="lesson-end"><p id="completion-note"></p><button id="next" class="primary">Nächste Lektion →</button></div><details class="source-details"><summary>Quellen zu dieser Lektion</summary><ul>${lesson.sourceIds
      .map((id) => {
        const s = SOURCES.find((x) => x.id === id);
        return s
          ? `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`
          : "";
      })
      .join(
        "",
      )}</ul><p class="small">Lehrplan- und Quellenabgleich: ${EDITORIAL_DATE}. Alle Fallwerte und Texte sind eigens verfasste Lernbeispiele.</p></details>${footerHtml()}</main></div>`;
  document.querySelectorAll<HTMLButtonElement>("[data-lesson]").forEach((b) => {
    b.addEventListener("click", () => navigate(b.dataset.lesson ?? ""));
  });
  $("#extra").addEventListener("change", (e) => {
    p.extra = (e.target as HTMLInputElement).checked;
    persist();
    render();
  });
  $("#level").addEventListener("change", (e) => {
    p.level = (e.target as HTMLSelectElement).value === "2" ? 2 : 1;
    persist();
    render();
  });
  $("#sources-button").addEventListener("click", () => {
    const d = $<HTMLDetailsElement>("#practice-note");
    d.open = true;
    d.scrollIntoView({ behavior: "smooth" });
  });
  $("#next").addEventListener("click", () => {
    const index = visible.findIndex((l) => l.id === lesson.id);
    navigate(visible[(index + 1) % visible.length].id);
  });
  bindQuiz(lesson);
  bindWorkshop(lesson);
  bindWriting(lesson);
  bindNote();
  if (lesson.practice) bindPractice(lesson);
  if (lesson.lab) bindLab(lesson.lab);
  updateEvidence();
}
function updateEvidence() {
  const l = findLesson(p.active) ?? LESSONS[0],
    key = keyOf(l.id, 1),
    c = completion(p);
  const flags: Array<[string, boolean]> = [
    ["Schnellcheck", p.quiz.includes(l.id)],
    ["Fallwerkstatt", p.workshop.includes(l.id)],
    ...(l.practice
      ? [[`Selbst gelöst: ${p.solved[key] ?? 0}/3`, (p.solved[key] ?? 0) >= 3] as [string, boolean]]
      : []),
    ["Eigene Begründung", p.assessed.includes(key)],
  ];
  $("#evidence").innerHTML = flags
    .map(
      ([label, done]) =>
        `<span class="${done ? "done" : ""}">${done ? "✓" : "○"} ${esc(label)}</span>`,
    )
    .join("");
  $("#progress-count").textContent = `${c.done} / ${c.total}`;
  $<HTMLProgressElement>("#progress").value = c.done;
  $("#completion-note").textContent = isComplete(p, l.id)
    ? "Diese Lektion ist abgeschlossen. Zusätzliche Transferaufgaben bleiben freiwillig."
    : "Für den Abschluss: Schnellcheck, Fallwerkstatt und eigene Begründung auf Niveau 1; bei Rechenlektionen zusätzlich drei selbst gelöste Aufgaben.";
  document.querySelectorAll<HTMLButtonElement>("[data-lesson]").forEach((b) => {
    const dot = b.querySelector(".lesson-dot");
    if (dot) dot.textContent = isComplete(p, b.dataset.lesson ?? "") ? "✓" : "·";
  });
}
function quizHtml(l: Lesson) {
  const options = shuffle([l.quiz.answer, ...l.quiz.wrong], l.id);
  return `<section class="panel"><div class="eyebrow">01 · Abrufen</div><h2>Schnellcheck</h2><form id="quiz"><fieldset><legend>${esc(l.quiz.question)}</legend>${options.map((option, i) => `<label class="option"><input type="radio" name="quiz" value="${i}"> <span>${esc(option)}</span></label>`).join("")}</fieldset><button type="submit">Antwort prüfen</button></form><p id="quiz-feedback" class="feedback" role="status"></p></section>`;
}
function bindQuiz(l: Lesson) {
  $("#quiz").addEventListener("submit", (e) => {
    e.preventDefault();
    const checked = document.querySelector<HTMLInputElement>('input[name="quiz"]:checked');
    if (!checked) {
      $("#quiz-feedback").textContent = "Wähle zuerst eine Antwort.";
      return;
    }
    const right =
      shuffle([l.quiz.answer, ...l.quiz.wrong], l.id)[Number(checked.value)] === l.quiz.answer;
    if (right) {
      addOnce(p.quiz, l.id);
      persist();
      updateEvidence();
    }
    $("#quiz-feedback").textContent =
      `${right ? "Richtig." : "Prüfe noch einmal."} ${l.quiz.explanation}`;
  });
}
function workshopHtml(l: Lesson) {
  return `<section class="panel"><div class="eyebrow">02 · Untersuchen</div><h2>Fallwerkstatt</h2><p>${esc(l.workshop.instruction)}</p><form id="workshop">${shuffle(
    l.workshop.entries.map((entry, i) => ({ entry, i })),
    `${l.id}:cases`,
  )
    .map(
      ({ entry, i }) =>
        `<label class="work-entry"><span>${esc(entry.text)}</span><select name="case-${i}" aria-label="Zuordnung für Fall ${i + 1}"><option value="">Zuordnung wählen</option>${l.workshop.categories.map((cat, j) => `<option value="${j}">${esc(cat)}</option>`).join("")}</select></label><p class="small" id="case-feedback-${i}"></p>`,
    )
    .join(
      "",
    )}<button type="submit">Fälle prüfen</button></form><p id="workshop-feedback" role="status"></p></section>`;
}
function bindWorkshop(l: Lesson) {
  $("#workshop").addEventListener("submit", (e) => {
    e.preventDefault();
    const choices = l.workshop.entries.map((_, i) => {
      const value = $<HTMLSelectElement>(`[name="case-${i}"]`).value;
      return value === "" ? -1 : Number(value);
    });
    const results = checkWorkshop(l.workshop, choices);
    results.forEach((correct, i) => {
      $(`#case-feedback-${i}`).textContent =
        `${correct ? "Richtig." : "Noch einmal prüfen."} ${l.workshop.entries[i].feedback}`;
    });
    if (results.every(Boolean)) {
      addOnce(p.workshop, l.id);
      persist();
      updateEvidence();
      $("#workshop-feedback").textContent = "Alle Fälle richtig zugeordnet.";
    } else
      $("#workshop-feedback").textContent =
        "Mindestens eine Zuordnung fehlt oder passt noch nicht.";
  });
}
function attemptFor(l: Lesson) {
  const key = keyOf(l.id, p.level);
  let a = attempts.get(key);
  if (!a) {
    a = createAttempt(p, l, p.level);
    attempts.set(key, a);
  }
  return a;
}
function practiceHtml(l: Lesson) {
  const a = attemptFor(l);
  return `<section class="panel" id="practice"><div class="eyebrow">03 · Rechnen und buchen · Niveau ${p.level}</div><h2>Deine Rechnung zählt</h2><p>${esc(a.task.prompt)}</p><form id="calculation"><div class="number-fields">${a.task.fields.map((f, i) => `<label>${esc(f.label)} (${esc(f.unit)})<input name="number-${i}" value="${esc(a.values[i] ?? "")}" inputmode="decimal" autocomplete="off" maxlength="60" required ${a.finished ? "disabled" : ""}></label>`).join("")}</div>${
    a.task.booking.length
      ? `<p class="small">Buche mit Soll/Haben, Konto und Betrag je Zeile. Die Reihenfolge ist frei; Beträge bitte auf Cent runden.</p><div class="booking">${a.task.booking
          .map(
            (_, i) =>
              `<fieldset class="booking-row"><legend>Zeile ${i + 1}</legend><label>Seite<select name="side-${i}" required ${a.finished ? "disabled" : ""}><option value="">Wählen</option><option value="debit" ${a.entries[i]?.side === "debit" ? "selected" : ""}>Soll</option><option value="credit" ${a.entries[i]?.side === "credit" ? "selected" : ""}>Haben</option></select></label><label>Konto<select name="account-${i}" required ${a.finished ? "disabled" : ""}><option value="">Konto wählen</option>${Object.entries(
                ACCOUNTS,
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(
                  ([code, name]) =>
                    `<option value="${code}" ${a.entries[i]?.account === code ? "selected" : ""}>${code} ${esc(name)}</option>`,
                )
                .join(
                  "",
                )}</select></label><label>Euro<input name="amount-${i}" value="${esc(a.entries[i]?.amount ?? "")}" inputmode="decimal" autocomplete="off" maxlength="60" required ${a.finished ? "disabled" : ""}></label></fieldset>`,
          )
          .join("")}</div>`
      : ""
  }<div class="actions"><button type="submit" ${a.finished ? "disabled" : ""}>Rechnung prüfen</button><button type="button" id="solution-button" class="quiet" ${a.finished ? "disabled" : ""}>Lösung ansehen</button><button type="button" id="new-exercise" class="quiet">Neue Aufgabe</button></div></form><details><summary>Rechenhilfe</summary><p>${esc(a.task.hint)}</p></details><p id="calculation-feedback" role="status">${a.finished ? (a.credited ? "Selbst gelöst und gezählt." : "Lösung angesehen; dieser Versuch zählt nicht als selbst gelöst.") : "Dezimalkomma und Dezimalpunkt sind möglich. Finanzbeträge werden auf Cent geprüft."}</p><p id="solution" class="solution" ${a.finished ? "" : "hidden"}>${esc(a.task.solution)}</p></section>`;
}
function bindPractice(l: Lesson) {
  const a = attemptFor(l);
  $("#calculation").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = $<HTMLFormElement>("#calculation");
    const values = a.task.fields.map(
      (_, i) => (form.elements.namedItem(`number-${i}`) as HTMLInputElement).value,
    );
    const entries: LearnerEntry[] = a.task.booking.map((_, i) => ({
      side: (form.elements.namedItem(`side-${i}`) as HTMLSelectElement).value,
      account: (form.elements.namedItem(`account-${i}`) as HTMLSelectElement).value,
      amount: (form.elements.namedItem(`amount-${i}`) as HTMLInputElement).value,
    }));
    if (submitAttempt(p, a, values, entries)) {
      persist();
      refreshPractice(l);
      updateEvidence();
    } else
      $("#calculation-feedback").textContent =
        "Noch nicht vollständig richtig. Prüfe Netto/Brutto, Konten und Buchungsrichtung. Geldbeträge auf Cent runden.";
  });
  $("#solution-button").addEventListener("click", () => {
    revealAttempt(p, a);
    persist();
    refreshPractice(l);
  });
  $("#new-exercise").addEventListener("click", () => {
    skipAttempt(p, a);
    persist();
    attempts.delete(a.key);
    refreshPractice(l);
  });
}
function refreshPractice(l: Lesson) {
  $("#practice").outerHTML = practiceHtml(l);
  bindPractice(l);
}
function writingHtml(l: Lesson) {
  const task = l.tasks[p.level],
    key = keyOf(l.id, p.level),
    draft = p.drafts[key] ?? "";
  return `<section class="panel"><div class="eyebrow">${l.practice ? "04" : "03"} · Begründen · Niveau ${p.level}</div><h2>In deinen eigenen Worten</h2><p>${esc(task.prompt)}</p><details><summary>Leitfragen</summary><ul>${task.hints.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></details><label for="draft">Deine Begründung</label><textarea id="draft" maxlength="8000" rows="5" placeholder="Erkläre den Zusammenhang und begründe dein Urteil …">${esc(draft)}</textarea><p class="small">Dein Text wird lokal gespeichert und nicht automatisch bewertet.</p><button id="compare-writing" ${draft.trim().length < 20 ? "disabled" : ""}>Mit dem Beispiel vergleichen</button><div id="self-review" ${p.assessed.includes(key) ? "" : "hidden"}><div class="solution"><strong>Ein mögliches Beispiel</strong><p>${esc(task.model)}</p></div><p>Prüfe deinen eigenen Text an diesen Kriterien:</p>${task.criteria.map((criterion, i) => `<label class="criterion"><input type="checkbox" name="criterion" value="${i}" ${p.assessed.includes(key) ? "checked" : ""}> ${esc(criterion)}</label>`).join("")}<button id="accept-writing">Eigene Einschätzung speichern</button><p id="writing-feedback" role="status"></p></div></section>`;
}
function bindWriting(l: Lesson) {
  const key = keyOf(l.id, p.level);
  $("#draft").addEventListener("input", (e) => {
    const value = (e.target as HTMLTextAreaElement).value;
    p.drafts[key] = value;
    p.assessed = p.assessed.filter((x) => x !== key);
    document.querySelectorAll<HTMLInputElement>('[name="criterion"]').forEach((x) => {
      x.checked = false;
    });
    $("#writing-feedback").textContent =
      "Text geändert. Prüfe deine Begründung erneut an den Kriterien.";
    $<HTMLButtonElement>("#compare-writing").disabled = value.trim().length < 20;
    persist();
    updateEvidence();
  });
  $("#compare-writing").addEventListener("click", () => {
    $("#self-review").hidden = false;
  });
  $("#accept-writing").addEventListener("click", () => {
    const criteria = [...document.querySelectorAll<HTMLInputElement>('[name="criterion"]')].map(
      (x) => x.checked,
    );
    if (canAcceptSelfAssessment(p.drafts[key] ?? "", criteria)) {
      addOnce(p.assessed, key);
      persist();
      updateEvidence();
      $("#writing-feedback").textContent =
        "Deine eigene Einschätzung ist gespeichert. Das ist keine automatische fachliche Bewertung.";
    } else
      $("#writing-feedback").textContent =
        "Schreibe zuerst mindestens einen erklärenden Satz und prüfe alle drei Kriterien an deinem Text.";
  });
}
function footerHtml() {
  const note = p.note;
  return `<details id="practice-note" class="panel"><summary>Quellen, Praxis und Behalten mit ZAM</summary><h2>Eine echte Praxismaßnahme</h2><p>Der Lehrplan sieht eine praxisorientierte Maßnahme vor, etwa die Erkundung eines Kreditinstituts. Vereinbare sie mit deiner Lehrkraft. Ein App-Modell und die Fallaufgaben ersetzen diese Durchführung nicht.</p><p>Notiere eine eigene Frage, datierte Quellen oder Ansprechpersonen, Beobachtungen und ein begründetes Ergebnis. Keine Konto-, Kunden- oder anderen vertraulichen Daten eintragen. Die App prüft nur ausgefüllte Felder und deine eigene Angabe.</p>${(
    [
      ["question", "Meine Frage"],
      ["source", "Quelle, Datum oder Gesprächskontext"],
      ["observation", "Meine Beobachtungen"],
      ["conclusion", "Mein begründetes Ergebnis"],
    ] as const
  )
    .map(
      ([key, label]) =>
        `<label>${label}<textarea data-note="${key}" rows="2" maxlength="4000">${esc(note[key])}</textarea></label>`,
    )
    .join(
      "",
    )}<label class="criterion"><input id="performed" type="checkbox" ${note.performed ? "checked" : ""}> Ich habe die Maßnahme selbst durchgeführt.</label><p id="note-status" role="status"></p><h2>Mit ZAM behalten</h2><p>Die zugehörige Zelle hält das Gelernte mit Wiederholungskarten fest. Karten führen direkt zur passenden Lektion. Die Aufnahme der ganzen Zelle umfasst auch die beiden Auffrischungen.</p><p class="small">Die Anfrage an deinen ZAM-Agenten lautet: „${esc(zamEnrolRequest())}“</p><h2>Nachschlagen</h2><ul>${SOURCES.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join("")}</ul><p class="small">BwR 9 gehört zu Zweig II. IIIa hat BwR in Klasse 7 und 8, in Klasse 9 Wirtschaft und Recht. Keine externen Laufzeitanfragen, Konten oder Telemetrie. Stand: ${EDITORIAL_DATE}.</p></details>`;
}
function bindNote() {
  const update = () => {
    $("#note-status").textContent = noteDocumented(p.note)
      ? "Praxisnotiz vollständig dokumentiert und von dir als durchgeführt angegeben. Die Durchführung wurde nicht unabhängig geprüft."
      : "Praxisnotiz noch unvollständig oder Durchführung noch nicht angegeben. Dieser Status ist vom Lektionsfortschritt getrennt.";
  };
  document.querySelectorAll<HTMLTextAreaElement>("[data-note]").forEach((x) => {
    x.addEventListener("input", () => {
      const key = x.dataset.note as "question" | "source" | "observation" | "conclusion";
      p.note[key] = x.value;
      persist();
      update();
    });
  });
  $("#performed").addEventListener("change", (e) => {
    p.note.performed = (e.target as HTMLInputElement).checked;
    persist();
    update();
  });
  update();
}
window.addEventListener("hashchange", () => {
  deepLink();
  persist();
  render();
});
render();
persist();
// The progress denominator is the curriculum core; optional deep links never enlarge it.
if (CORE_LESSONS.length !== 44) throw new Error("Unexpected curriculum core");
