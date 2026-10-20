import type { AppLocale, DifficultyLevel } from "../model/types";

/** Every string of the app chrome, in both languages. Lesson content lives in the curriculum. */
export interface UiStrings {
  htmlTitle: string;
  brandTitle: string;
  brandSubtitle: string;
  navPath: string;
  navLesson: string;
  navCheatSheet: string;
  level1: string;
  level2: string;
  level1Title: string;
  level2Title: string;
  levelToast: (level: DifficultyLevel) => string;
  progressText: (done: number, total: number) => string;
  progressTitle: (percent: number, stagesDone: number, stagesTotal: number) => string;
  zamButton: string;
  zamButtonTitle: string;
  themeTitle: string;
  localeDe: string;
  localeEn: string;
  closeToast: string;
  footerCurriculum: string;
  footerCurriculumLink: string;
  footerPrivacy: string;
  footerSource: string;

  // Path view
  heroTitle: string;
  heroText: string;
  filterLabel: string;
  continueButton: (title: string) => string;
  statsLessons: (done: number, total: number) => string;
  statsStages: (done: number, total: number) => string;
  badgesLabel: string;
  badgeOff: (title: string) => string;
  resetButton: string;
  stageWord: string;
  lessonWord: string;
  notInScope: string;
  chipQuiz: string;
  chipLab: string;
  chipTasks: string;
  chipTransfer: string;
  chipExtra: string;

  // Lesson view
  stagePill: (stage: number, step: number, total: number) => string;
  lessonSelectLabel: string;
  whyTitle: string;
  syntaxTitle: string;
  quizTitle: string;
  quizIdle: string;
  quizWrong: string;
  quizRight: string;
  exerciseTitle: (level: DifficultyLevel) => string;
  exerciseCount: (solved: number, required: number, extra: number) => string;
  hintLabel: string;
  sqlPlaceholder: string;
  checkButton: string;
  newTaskButton: string;
  revealButton: string;
  feedbackIdleSql: string;
  feedbackIdleChoice: string;
  feedbackRevealed: string;
  feedbackCorrect: string;
  feedbackRevealHint: string;
  solutionTitle: string;
  statusTitle: string;
  statusQuiz: string;
  statusLab: (reached: number, total: number) => string;
  statusTasks: (required: number, solved: number) => string;
  statusBonus: (required: number, solved: number) => string;
  statusDone: string;
  zamCardTitle: string;
  zamCardText: string;
  zamCardButton: string;
  prevStart: string;
  nextEnd: string;
  tasksDoneToast: (required: number, level: DifficultyLevel) => string;
  lessonDoneToast: (title: string) => string;
  goalToast: (text: string) => string;

  // SQL sandbox
  labRun: string;
  labRunTitle: string;
  labReset: string;
  labResetDone: string;
  labTables: string;
  labTablesHint: string;
  labResult: string;
  labRows: (n: number) => string;
  labNoRows: string;
  labChanged: (statements: number, changes: number) => string;
  labError: string;
  labGoals: string;
  labPk: string;
  labFk: string;
  labMoreRows: (hidden: number) => string;

  // ER lab
  erPick: string;
  erUnset: string;
  erRight: string;
  erWrong: string;
  erCardinality: Record<"1:1" | "1:n" | "n:m", string>;

  // Cheat sheet
  cheatTitle: string;
  cheatText: string;
  cheatWhat: string;
  cheatSql: string;
  cheatNote: string;
  cheatLesson: string;

  // Dialogs
  zamKicker: string;
  zamTitle: string;
  zamPhase1Title: string;
  zamPhase1Text: string;
  zamPhase2Title: string;
  zamPhase2Text: string;
  zamHowTitle: string;
  zamStep1Html: string;
  zamStep2Html: (cellTitle: string) => string;
  zamOrSay: string;
  zamCopy: string;
  zamCopied: string;
  zamNote: string;
  zamBack: string;
  celebrationKicker: (stage: number) => string;
  celebrationBody: (count: number, title: string) => string;
  celebrationKeep: string;
  celebrationZam: string;
  celebrationContinue: string;
  resetTitle: string;
  resetText: string;
  resetCancel: string;
  resetConfirm: string;
  resetDone: string;

  // Checker
  check: {
    empty: string;
    noResult: string;
    oneQuery: string;
    columns: (actual: number, expected: number) => string;
    rowCount: (actual: number, expected: number) => string;
    rows: string;
    order: string;
    sqlError: (message: string) => string;
    tableDiffers: (table: string, actual: number, expected: number) => string;
    tableMissing: (table: string) => string;
    schemaDiffers: (table: string) => string;
    wrongChoice: string;
    correct: string;
    loading: string;
  };
}

export const UI_STRINGS: Record<AppLocale, UiStrings> = {
  de: {
    htmlTitle: "Relationale Datenbanken und SQL · ZAM Academy",
    brandTitle: "Relationale Datenbanken und SQL",
    brandSubtitle: "Tabellen verstehen, Abfragen schreiben, Daten verknüpfen. Behalten mit ZAM.",
    navPath: "🗺️ Lernpfad",
    navLesson: "🎓 Lektion",
    navCheatSheet: "📖 SQL-Spickzettel",
    level1: "🌱 Level 1: geführt",
    level2: "🦅 Level 2: Transfer",
    level1Title: "Tabellen, Spalten und Syntax werden genannt",
    level2Title: "Aufgaben in Worten, du findest die Spalten selbst",
    levelToast: (level) =>
      level === 2 ? "Level 2: Aufgaben in Worten, ohne Syntaxhilfe." : "Level 1: Tabellen, Spalten und Syntax werden genannt.",
    progressText: (done, total) => `${done} / ${total} Lektionen`,
    progressTitle: (percent, stagesDone, stagesTotal) =>
      `${percent} % des Lernpfads, ${stagesDone} von ${stagesTotal} Etappen abgeschlossen`,
    zamButton: "🧠 In ZAM festigen",
    zamButtonTitle: "Wissen in ZAM festigen",
    themeTitle: "Hell / Dunkel umschalten",
    localeDe: "Deutsch",
    localeEn: "English",
    closeToast: "Hinweis schließen",
    footerCurriculum: "ZAM Academy · Relationale Datenbanken und SQL folgt den Modulen 2.3.1 und 2.3.2 des",
    footerCurriculumLink: "LehrplanPLUS Bayern, Realschule, Informationstechnologie",
    footerPrivacy: "Keine Konten, keine Cookies, kein Tracking. Die Datenbank läuft in diesem Browser, dein Fortschritt bleibt hier.",
    footerSource: "Quelltext",

    heroTitle: "Relationale Datenbanken und SQL",
    heroText:
      "Vier Etappen: Tabellen und Schlüssel, Abfragen mit SQL, mehrere Tabellen verknüpfen, Berichte und Datenpflege. In jeder Lektion: kurz lesen, in der Sandbox mit einer echten Datenbank ausprobieren, dann Aufgaben lösen. Was du hier verstehst, hält ZAM mit Karten fest, die auf die Lektion zurückverlinken.",
    filterLabel: "Mein Ziel",
    continueButton: (title) => `▶ Weiter mit ${title}`,
    statsLessons: (done, total) => `${done} von ${total} Lektionen`,
    statsStages: (done, total) => `${done} von ${total} Etappen`,
    badgesLabel: "Abzeichen",
    badgeOff: (title) => `${title}: keine Lektion in deiner Auswahl`,
    resetButton: "Fortschritt zurücksetzen",
    stageWord: "Etappe",
    lessonWord: "Lektion",
    notInScope: "nicht in deiner Auswahl",
    chipQuiz: "Schnellcheck",
    chipLab: "Aufträge",
    chipTasks: "Aufgaben Level 1",
    chipTransfer: "Transfer gemeistert",
    chipExtra: "Zusatz",

    stagePill: (stage, step, total) => `Etappe ${stage} · Lektion ${step} von ${total}`,
    lessonSelectLabel: "Lektion wählen",
    whyTitle: "Warum das wichtig ist:",
    syntaxTitle: "SQL dieser Lektion",
    quizTitle: "❓ Schnellcheck",
    quizIdle: "Wähle eine Antwort. Erst denken, dann klicken.",
    quizWrong: "Noch nicht. Lies die Erklärung oben noch einmal und versuche es erneut.",
    quizRight: "Schnellcheck richtig!",
    exerciseTitle: (level) => `🧮 Aufgaben · ${level === 1 ? "Level 1: geführt" : "Level 2: Transfer"}`,
    exerciseCount: (solved, required, extra) => `${solved} / ${required} gelöst${extra > 0 ? ` (+${extra})` : ""}`,
    hintLabel: "Syntax",
    sqlPlaceholder: "SELECT … FROM … ;",
    checkButton: "Prüfen",
    newTaskButton: "Neue Aufgabe",
    revealButton: "Lösung zeigen",
    feedbackIdleSql: "Schreib deine SQL-Anweisung und klicke Prüfen. Geprüft wird das Ergebnis, nicht der Wortlaut.",
    feedbackIdleChoice: "Wähle die passende Antwort.",
    feedbackRevealed: "Lösung angezeigt. Diese Aufgabe zählt nicht, die nächste schon.",
    feedbackCorrect: "✅ Richtig!",
    feedbackRevealHint: " Du kannst dir die Lösung zeigen lassen.",
    solutionTitle: "Lösung",
    statusTitle: "Lektion abschließen",
    statusQuiz: "Schnellcheck richtig beantwortet",
    statusLab: (reached, total) => `Aufträge erfüllt (${reached} von ${total})`,
    statusTasks: (required, solved) => `${required} Aufgaben auf Level 1 gelöst (${solved} von ${required})`,
    statusBonus: (required, solved) => `Bonus 🦅: ${required} Transferaufgaben auf Level 2 (${solved} von ${required})`,
    statusDone: "🎉 Lektion abgeschlossen.",
    zamCardTitle: "🧠 In ZAM behalten",
    zamCardText: "Die ZAM-Karten zu dieser Lektion verlinken genau hierher:",
    zamCardButton: "So nimmst du die Zelle in ZAM auf",
    prevStart: "Anfang",
    nextEnd: "Ende",
    tasksDoneToast: (required, level) => `Richtig! ${required} Aufgaben auf Level ${level} gelöst.`,
    lessonDoneToast: (title) => `Lektion abgeschlossen: ${title}`,
    goalToast: (text) => `Auftrag erfüllt: ${text}`,

    labRun: "▶ Ausführen",
    labRunTitle: "Strg+Enter führt aus",
    labReset: "Datenbank zurücksetzen",
    labResetDone: "Datenbank auf den Anfangszustand zurückgesetzt.",
    labTables: "Tabellen",
    labTablesHint: "Klick auf eine Tabelle setzt SELECT * in den Editor.",
    labResult: "Ergebnis",
    labRows: (n) => `${n} ${n === 1 ? "Zeile" : "Zeilen"}`,
    labNoRows: "Die Abfrage liefert keine Zeilen.",
    labChanged: (statements, changes) =>
      `${statements === 1 ? "Anweisung ausgeführt" : `${statements} Anweisungen ausgeführt`}, ${changes} ${changes === 1 ? "Zeile" : "Zeilen"} geändert.`,
    labError: "Fehler",
    labGoals: "Aufträge",
    labPk: "Primärschlüssel",
    labFk: "Fremdschlüssel auf",
    labMoreRows: (hidden) => `… ${hidden} weitere Zeilen`,

    erPick: "Kardinalität wählen",
    erUnset: "noch offen",
    erRight: "✅ Richtig.",
    erWrong: "Noch nicht. Frag dich: Wie viele auf der einen Seite gehören zu einem auf der anderen, und umgekehrt?",
    erCardinality: { "1:1": "1:1 (eins zu eins)", "1:n": "1:n (eins zu viele)", "n:m": "n:m (viele zu viele)" },

    cheatTitle: "SQL-Spickzettel",
    cheatText:
      "Alle Anweisungen der Lektionen auf einen Blick. Jede Zeile führt zur Lektion mit Sandbox und Aufgaben. Text steht in einfachen Hochkommas, Zahlen ohne; jede Anweisung endet mit einem Semikolon.",
    cheatWhat: "Was",
    cheatSql: "SQL",
    cheatNote: "Hinweis",
    cheatLesson: "Lektion",

    zamKicker: "🧠 HIER ÜBEN → IN ZAM BEHALTEN",
    zamTitle: "Datenbanken und SQL mit ZAM behalten",
    zamPhase1Title: "1️⃣ Hier üben",
    zamPhase1Text: "Schreib Abfragen in der Sandbox, verknüpfe Tabellen, löse Aufgaben, bis die Zusammenhänge sitzen.",
    zamPhase2Title: "2️⃣ In ZAM behalten",
    zamPhase2Text: "ZAM fragt kurz nach, bevor du es vergessen würdest. Jede Karte verlinkt die Lektion, in der du geübt hast.",
    zamHowTitle: "So kommt die Zelle in dein ZAM",
    zamStep1Html: "Öffne ZAM Studio → <strong>Lern-Karten</strong> → Importieren → <strong>„Aus der ZAM Academy“</strong>.",
    zamStep2Html: (cellTitle) => `Wähle <strong>„${cellTitle}“</strong> und klicke <strong>„Aufnehmen“</strong>.`,
    zamOrSay: "Oder sag deinem Agenten in ZAM:",
    zamCopy: "📋 Kopieren",
    zamCopied: "Kopiert.",
    zamNote: "Die Karten sind auf Deutsch und fragen je einen Punkt ab, zum Beispiel eine Klausel, einen Begriff oder einen Zusammenhang aus der Sandbox.",
    zamBack: "Zurück zum Üben",
    celebrationKicker: (stage) => `ETAPPE ${stage} GESCHAFFT`,
    celebrationBody: (count, title) =>
      `Du hast alle ${count} Lektionen von „${title}“ in deiner Auswahl abgeschlossen: Schnellcheck, Sandbox-Aufträge und Aufgaben.`,
    celebrationKeep: "Damit es bleibt: In ZAM fragt dich eine Karte nach jedem Punkt dieser Etappe genau dann, wenn du ihn vergessen würdest.",
    celebrationZam: "🧠 In ZAM festigen",
    celebrationContinue: "Weiter",
    resetTitle: "Fortschritt zurücksetzen?",
    resetText: "Alle Schnellchecks, Sandbox-Aufträge und gelösten Aufgaben werden gelöscht. Das lässt sich nicht rückgängig machen.",
    resetCancel: "Abbrechen",
    resetConfirm: "Zurücksetzen",
    resetDone: "Fortschritt zurückgesetzt.",

    check: {
      empty: "Bitte zuerst eine SQL-Anweisung schreiben.",
      noResult: "Deine Eingabe liefert keine Ergebnistabelle. Eine Abfrage beginnt mit SELECT.",
      oneQuery: "Bitte genau eine Abfrage eingeben.",
      columns: (actual, expected) => `Deine Abfrage liefert ${actual} Spalte${actual === 1 ? "" : "n"}, erwartet ${expected === 1 ? "ist eine Spalte" : `sind ${expected} Spalten`}.`,
      rowCount: (actual, expected) => `Deine Abfrage liefert ${actual} Zeile${actual === 1 ? "" : "n"}, erwartet ${expected === 1 ? "ist eine Zeile" : `sind ${expected} Zeilen`}. Prüf die Bedingung.`,
      rows: "Spalten- und Zeilenzahl stimmen, aber nicht die Inhalte. Prüf Bedingung und Spalten.",
      order: "Die Zeilen stimmen, aber nicht ihre Reihenfolge. Prüf ORDER BY.",
      sqlError: (message) => `SQL-Fehler: ${message}`,
      tableDiffers: (table, actual, expected) => `Die Tabelle ${table} hat danach nicht den erwarteten Inhalt (${actual} statt ${expected} Zeilen, oder andere Werte).`,
      tableMissing: (table) => `Die Tabelle ${table} gibt es danach nicht.`,
      schemaDiffers: (table) => `Die Tabelle ${table} hat nicht die erwarteten Spalten, Datentypen oder den Primärschlüssel.`,
      wrongChoice: "Das ist nicht die passende Antwort.",
      correct: "Richtig!",
      loading: "Die Datenbank wird noch geladen …",
    },
  },
  en: {
    htmlTitle: "Relational Databases and SQL · ZAM Academy",
    brandTitle: "Relational Databases and SQL",
    brandSubtitle: "Understand tables, write queries, join data. Keep it with ZAM.",
    navPath: "🗺️ Learning path",
    navLesson: "🎓 Lesson",
    navCheatSheet: "📖 SQL cheat sheet",
    level1: "🌱 Level 1: guided",
    level2: "🦅 Level 2: transfer",
    level1Title: "Tables, columns and syntax are named",
    level2Title: "Tasks in words, you find the columns yourself",
    levelToast: (level) =>
      level === 2 ? "Level 2: tasks in words, no syntax help." : "Level 1: tables, columns and syntax are named.",
    progressText: (done, total) => `${done} / ${total} lessons`,
    progressTitle: (percent, stagesDone, stagesTotal) =>
      `${percent}% of the path, ${stagesDone} of ${stagesTotal} stages complete`,
    zamButton: "🧠 Keep it in ZAM",
    zamButtonTitle: "Consolidate what you learned in ZAM",
    themeTitle: "Toggle light / dark",
    localeDe: "Deutsch",
    localeEn: "English",
    closeToast: "Close notice",
    footerCurriculum: "ZAM Academy · Relational Databases and SQL follows modules 2.3.1 and 2.3.2 of the",
    footerCurriculumLink: "Bavarian LehrplanPLUS, Realschule, Informationstechnologie",
    footerPrivacy: "No accounts, no cookies, no tracking. The database runs in this browser and your progress stays here.",
    footerSource: "Source code",

    heroTitle: "Relational Databases and SQL",
    heroText:
      "Four stages: tables and keys, queries with SQL, joining several tables, reports and data maintenance. Each lesson: read briefly, try it in the sandbox on a real database, then solve tasks. What you understand here, ZAM keeps with cards that link back to the lesson.",
    filterLabel: "My goal",
    continueButton: (title) => `▶ Continue with ${title}`,
    statsLessons: (done, total) => `${done} of ${total} lessons`,
    statsStages: (done, total) => `${done} of ${total} stages`,
    badgesLabel: "Badges",
    badgeOff: (title) => `${title}: no lesson in your selection`,
    resetButton: "Reset progress",
    stageWord: "Stage",
    lessonWord: "Lesson",
    notInScope: "not in your selection",
    chipQuiz: "Quick check",
    chipLab: "Goals",
    chipTasks: "Tasks level 1",
    chipTransfer: "Transfer mastered",
    chipExtra: "Extra",

    stagePill: (stage, step, total) => `Stage ${stage} · Lesson ${step} of ${total}`,
    lessonSelectLabel: "Choose a lesson",
    whyTitle: "Why it matters:",
    syntaxTitle: "SQL in this lesson",
    quizTitle: "❓ Quick check",
    quizIdle: "Pick an answer. Think first, then click.",
    quizWrong: "Not yet. Read the explanation above once more and try again.",
    quizRight: "Quick check correct!",
    exerciseTitle: (level) => `🧮 Tasks · ${level === 1 ? "Level 1: guided" : "Level 2: transfer"}`,
    exerciseCount: (solved, required, extra) => `${solved} / ${required} solved${extra > 0 ? ` (+${extra})` : ""}`,
    hintLabel: "Syntax",
    sqlPlaceholder: "SELECT … FROM … ;",
    checkButton: "Check",
    newTaskButton: "New task",
    revealButton: "Show solution",
    feedbackIdleSql: "Write your SQL statement and click Check. The result is checked, not the wording.",
    feedbackIdleChoice: "Pick the fitting answer.",
    feedbackRevealed: "Solution shown. This task does not count, the next one does.",
    feedbackCorrect: "✅ Correct!",
    feedbackRevealHint: " You can show the solution.",
    solutionTitle: "Solution",
    statusTitle: "Complete the lesson",
    statusQuiz: "Quick check answered correctly",
    statusLab: (reached, total) => `Goals reached (${reached} of ${total})`,
    statusTasks: (required, solved) => `${required} tasks solved on level 1 (${solved} of ${required})`,
    statusBonus: (required, solved) => `Bonus 🦅: ${required} transfer tasks on level 2 (${solved} of ${required})`,
    statusDone: "🎉 Lesson complete.",
    zamCardTitle: "🧠 Keep it in ZAM",
    zamCardText: "The ZAM cards for this lesson link exactly here:",
    zamCardButton: "How to take the cell in ZAM",
    prevStart: "Start",
    nextEnd: "End",
    tasksDoneToast: (required, level) => `Correct! ${required} tasks solved on level ${level}.`,
    lessonDoneToast: (title) => `Lesson complete: ${title}`,
    goalToast: (text) => `Goal reached: ${text}`,

    labRun: "▶ Run",
    labRunTitle: "Ctrl+Enter runs",
    labReset: "Reset database",
    labResetDone: "Database reset to its initial state.",
    labTables: "Tables",
    labTablesHint: "Click a table to put SELECT * into the editor.",
    labResult: "Result",
    labRows: (n) => `${n} ${n === 1 ? "row" : "rows"}`,
    labNoRows: "The query returns no rows.",
    labChanged: (statements, changes) =>
      `${statements === 1 ? "Statement executed" : `${statements} statements executed`}, ${changes} ${changes === 1 ? "row" : "rows"} changed.`,
    labError: "Error",
    labGoals: "Goals",
    labPk: "primary key",
    labFk: "foreign key to",
    labMoreRows: (hidden) => `… ${hidden} more rows`,

    erPick: "Pick the cardinality",
    erUnset: "not set yet",
    erRight: "✅ Correct.",
    erWrong: "Not yet. Ask: how many on one side belong to one on the other, and the other way round?",
    erCardinality: { "1:1": "1:1 (one to one)", "1:n": "1:n (one to many)", "n:m": "n:m (many to many)" },

    cheatTitle: "SQL cheat sheet",
    cheatText:
      "Every statement of the lessons at a glance. Each row leads to the lesson with its sandbox and tasks. Text goes in single quotes, numbers do not; every statement ends with a semicolon.",
    cheatWhat: "What",
    cheatSql: "SQL",
    cheatNote: "Note",
    cheatLesson: "Lesson",

    zamKicker: "🧠 PRACTISE HERE → KEEP IT IN ZAM",
    zamTitle: "Keep databases and SQL with ZAM",
    zamPhase1Title: "1️⃣ Practise here",
    zamPhase1Text: "Write queries in the sandbox, join tables, solve tasks until the ideas stick.",
    zamPhase2Title: "2️⃣ Keep it in ZAM",
    zamPhase2Text: "ZAM asks briefly before you would forget. Every card links to the lesson you practised in.",
    zamHowTitle: "How the cell gets into your ZAM",
    zamStep1Html: "Open ZAM Studio → <strong>Cards</strong> → Import → <strong>“From the ZAM Academy”</strong>.",
    zamStep2Html: (cellTitle) => `Choose <strong>“${cellTitle}”</strong> and click <strong>“Enrol”</strong>.`,
    zamOrSay: "Or tell your agent in ZAM:",
    zamCopy: "📋 Copy",
    zamCopied: "Copied.",
    zamNote: "The cards are in German and ask one point each, for example a clause, a term or a relationship from the sandbox.",
    zamBack: "Back to practising",
    celebrationKicker: (stage) => `STAGE ${stage} COMPLETE`,
    celebrationBody: (count, title) =>
      `You completed all ${count} lessons of “${title}” in your selection: quick check, sandbox goals and tasks.`,
    celebrationKeep: "To make it stay: in ZAM a card asks you about each point of this stage exactly when you would forget it.",
    celebrationZam: "🧠 Keep it in ZAM",
    celebrationContinue: "Continue",
    resetTitle: "Reset progress?",
    resetText: "Every quick check, sandbox goal and solved task is deleted. This cannot be undone.",
    resetCancel: "Cancel",
    resetConfirm: "Reset",
    resetDone: "Progress reset.",

    check: {
      empty: "Write an SQL statement first.",
      noResult: "Your input returns no result table. A query starts with SELECT.",
      oneQuery: "Enter exactly one query.",
      columns: (actual, expected) => `Your query returns ${actual} column${actual === 1 ? "" : "s"}, ${expected} ${expected === 1 ? "is" : "are"} expected.`,
      rowCount: (actual, expected) => `Your query returns ${actual} row${actual === 1 ? "" : "s"}, ${expected} ${expected === 1 ? "is" : "are"} expected. Check the condition.`,
      rows: "Column and row counts match, but not the contents. Check the condition and the columns.",
      order: "The rows match, but not their order. Check ORDER BY.",
      sqlError: (message) => `SQL error: ${message}`,
      tableDiffers: (table, actual, expected) => `Table ${table} does not have the expected contents afterwards (${actual} instead of ${expected} rows, or different values).`,
      tableMissing: (table) => `Table ${table} does not exist afterwards.`,
      schemaDiffers: (table) => `Table ${table} does not have the expected columns, data types or primary key.`,
      wrongChoice: "That is not the fitting answer.",
      correct: "Correct!",
      loading: "The database is still loading …",
    },
  },
};
