import { CATEGORIES, CITIES, SHARED_CITIES, STATUSES } from "../db/dataset";
import { money } from "../exercises/format";
import { lastResultEquals } from "../lab/goals";
import type { Lesson, Localized, Stage } from "../model/types";
import { goal, L, queryTask, SHOP, sqlLab } from "./helpers";

const STATUS_WORDS: Record<string, Localized> = {
  offen: L("noch offen sind", "are still open"),
  versendet: L("schon versendet, aber noch nicht geliefert sind", "have been shipped but not delivered yet"),
  geliefert: L("bereits geliefert wurden", "have already been delivered"),
  storniert: L("storniert wurden", "were cancelled"),
};

const CATEGORY_WORDS: Record<string, Localized> = {
  Schule: L("Schulbedarf", "school supplies"),
  Elektronik: L("Elektronik", "electronics"),
  Sport: L("Sportartikel", "sports goods"),
  Bücher: L("Bücher", "books"),
  Haushalt: L("Haushaltswaren", "household goods"),
};

// ─── Lektion 5: WHERE ───────────────────────────────────────────────────────

const PRICE_OPS: Array<{ op: string; words: Localized<(price: string) => string> }> = [
  { op: ">", words: L((p) => `teurer als ${p} sind`, (p) => `cost more than ${p}`) },
  { op: "<", words: L((p) => `weniger als ${p} kosten`, (p) => `cost less than ${p}`) },
  { op: ">=", words: L((p) => `mindestens ${p} kosten`, (p) => `cost at least ${p}`) },
  { op: "<=", words: L((p) => `höchstens ${p} kosten`, (p) => `cost at most ${p}`) },
];

const LESSON_SQL_1: Lesson = {
  id: "sql-1-where",
  stageId: "stage-2-abfragen",
  stepNumber: 1,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Zeilen filtern mit WHERE",
      subtitle: "Selektion: Vergleichsoperatoren =, <>, <, >, <=, >= und der Unterschied zwischen Text und Zahl",
      whyItMatters:
        "Niemand will 10.000 Kunden lesen, um die aus Ulm zu finden. Die WHERE-Bedingung lässt das DBMS die Auswahl treffen, in Millisekunden und ohne Flüchtigkeitsfehler.",
      explanationHtml: `
<p>Die <code>WHERE</code>-Klausel wählt Zeilen aus (<strong>Selektion</strong>). Nur Datensätze, für die die Bedingung wahr ist, landen im Ergebnis:</p>
<pre class="sql"><code>SELECT vorname, nachname FROM kunden
WHERE ort = 'Ulm';</code></pre>
<p>Vergleichsoperatoren: <code>=</code> gleich, <code>&lt;&gt;</code> ungleich, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Text steht in einfachen Hochkommas (<code>'Ulm'</code>), Zahlen stehen ohne (<code>20</code>), Kommazahlen mit Punkt (<code>19.95</code>). Groß- und Kleinschreibung zählt beim Text: <code>'ulm'</code> findet <code>'Ulm'</code> nicht.</p>
<pre class="sql"><code>SELECT bezeichnung, preis FROM produkte
WHERE preis &gt; 20;</code></pre>
<p>Reihenfolge der Klauseln: erst <code>SELECT</code> (welche Spalten), dann <code>FROM</code> (welche Tabelle), dann <code>WHERE</code> (welche Zeilen). Ein Datum vergleichst du wie Text: <code>bestelldatum &gt;= '2026-10-01'</code>.</p>`,
      syntax: [
        { name: "Zeilen filtern", sql: "SELECT spalten FROM tabelle WHERE bedingung;", note: "Operatoren: = <> < > <= >=" },
        { name: "Text und Zahl", sql: "WHERE ort = 'Ulm'   WHERE preis > 20", note: "Text in Hochkommas, Zahlen ohne, Kommazahlen mit Punkt." },
      ],
      quiz: {
        question: "Welche Bedingung findet alle Produkte, die weniger als 9,50 Euro kosten?",
        options: ["WHERE preis < 9.50", "WHERE preis < 9,50", "WHERE preis = 9.50"],
        correctIndex: 0,
        explanation: "Kommazahlen schreibt SQL mit Punkt; 9,50 ist ein Syntaxfehler. = findet nur genau 9.50, < alles darunter.",
      },
      lab: {
        title: "Sandbox: Zeilen auswählen",
        intro: "Formuliere Bedingungen über Text- und Zahlenspalten.",
        goals: {
          g1: "Zeige alle Spalten aller Kunden aus Augsburg.",
          g2: "Zeige bezeichnung und preis aller Produkte, die mehr als 20 Euro kosten.",
          g3: "Zeige alle Spalten der Bestellungen mit dem Status offen.",
        },
      },
      celebrationMessage: "Du wählst mit WHERE genau die Zeilen aus, die du brauchst.",
    },
    {
      title: "Filtering rows with WHERE",
      subtitle: "Selection: comparison operators =, <>, <, >, <=, >= and the difference between text and number",
      whyItMatters:
        "Nobody wants to read 10,000 customers to find the ones from Ulm. The WHERE condition lets the DBMS do the choosing, in milliseconds and without slips.",
      explanationHtml: `
<p>The <code>WHERE</code> clause chooses rows (<strong>selection</strong>). Only records for which the condition is true end up in the result:</p>
<pre class="sql"><code>SELECT first_name, last_name FROM customers
WHERE city = 'Ulm';</code></pre>
<p>Comparison operators: <code>=</code> equal, <code>&lt;&gt;</code> not equal, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Text goes in single quotes (<code>'Ulm'</code>), numbers do not (<code>20</code>), decimals use a point (<code>19.95</code>). Case matters in text: <code>'ulm'</code> does not find <code>'Ulm'</code>.</p>
<pre class="sql"><code>SELECT name, price FROM products
WHERE price &gt; 20;</code></pre>
<p>Order of the clauses: first <code>SELECT</code> (which columns), then <code>FROM</code> (which table), then <code>WHERE</code> (which rows). A date compares like text: <code>order_date &gt;= '2026-10-01'</code>.</p>`,
      syntax: [
        { name: "Filter rows", sql: "SELECT columns FROM table WHERE condition;", note: "Operators: = <> < > <= >=" },
        { name: "Text and number", sql: "WHERE city = 'Ulm'   WHERE price > 20", note: "Text in quotes, numbers without, decimals with a point." },
      ],
      quiz: {
        question: "Which condition finds all products that cost less than 9.50 euros?",
        options: ["WHERE price < 9.50", "WHERE price < 9,50", "WHERE price = 9.50"],
        correctIndex: 0,
        explanation: "SQL writes decimals with a point; 9,50 is a syntax error. = finds only exactly 9.50, < everything below.",
      },
      lab: {
        title: "Sandbox: choose rows",
        intro: "Write conditions over text and number columns.",
        goals: {
          g1: "Show all columns of all customers from Augsburg.",
          g2: "Show name and price of all products that cost more than 20 euros.",
          g3: "Show all columns of the orders with status open.",
        },
      },
      celebrationMessage: "With WHERE you choose exactly the rows you need.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT * FROM {kunden}\nWHERE {ort} = 'Ulm';", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT * FROM {kunden} WHERE {ort} = 'Augsburg';")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {preis} > 20;")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT * FROM {bestellungen} WHERE {status} = '{offen}';")),
  ]),
  exercises: [
    {
      id: "ort-filter",
      make: (rng, level, locale) => {
        const city = rng.pick(CITIES);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige alle Spalten der Tabelle {kunden} für die Kunden, deren {ort} gleich '${city}' ist.`,
            `Show all columns of the table {kunden} for the customers whose {ort} equals '${city}'.`,
          ),
          prompt2: L(`Welche Kunden wohnen in ${city}? Zeige alle Angaben zu ihnen.`, `Which customers live in ${city}? Show everything about them.`),
          hint: L("SELECT * FROM <Tabelle> WHERE <Spalte> = 'Text';", "SELECT * FROM <table> WHERE <column> = 'text';"),
          sql: `SELECT * FROM {kunden} WHERE {ort} = '${city}';`,
          meta: { city },
        });
      },
    },
    {
      id: "preis-filter",
      make: (rng, level, locale) => {
        const { op, words } = rng.pick(PRICE_OPS);
        const threshold = rng.pick([10, 15, 20, 25, 30, 50]);
        const price = money(locale, threshold);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {bezeichnung} und {preis} der Produkte ({produkte}), deren {preis} ${op} ${threshold} ist.`,
            `Show {bezeichnung} and {preis} of the products ({produkte}) whose {preis} is ${op} ${threshold}.`,
          ),
          prompt2: L(
            `Welche Produkte ${words.de(price)}? Zeige Name und Preis.`,
            `Which products ${words.en(price)}? Show name and price.`,
          ),
          hint: L("SELECT <Spalten> FROM <Tabelle> WHERE <Spalte> <Operator> <Zahl>;", "SELECT <columns> FROM <table> WHERE <column> <operator> <number>;"),
          sql: `SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {preis} ${op} ${threshold};`,
          meta: { op, threshold },
        });
      },
    },
    {
      id: "status-filter",
      make: (rng, level, locale) => {
        const status = rng.pick(STATUSES);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige alle Spalten der Tabelle {bestellungen}, deren {status} gleich {${status}} ist.`,
            `Show all columns of the table {bestellungen} whose {status} equals {${status}}.`,
          ),
          prompt2: L(
            `Der Versand braucht alle Bestellungen, die ${STATUS_WORDS[status].de}. Zeige sie mit allen Angaben.`,
            `Shipping needs all orders that ${STATUS_WORDS[status].en}. Show them with every detail.`,
          ),
          hint: L("SELECT * FROM <Tabelle> WHERE <Spalte> = 'Text';", "SELECT * FROM <table> WHERE <column> = 'text';"),
          sql: `SELECT * FROM {bestellungen} WHERE {status} = '{${status}}';`,
          meta: { status },
        });
      },
    },
    {
      id: "ungleich",
      make: (rng, level, locale) => {
        const city = rng.pick(SHARED_CITIES);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {vorname}, {nachname} und {ort} aller Kunden, deren {ort} ungleich '${city}' ist.`,
            `Show {vorname}, {nachname} and {ort} of all customers whose {ort} is not '${city}'.`,
          ),
          prompt2: L(
            `Alle Kunden, die nicht in ${city} wohnen, bekommen eine Einladung. Zeige Vorname, Nachname und Wohnort.`,
            `All customers who do not live in ${city} get an invitation. Show first name, last name and city.`,
          ),
          hint: L("… WHERE <Spalte> <> 'Text';", "… WHERE <column> <> 'text';"),
          sql: `SELECT {vorname}, {nachname}, {ort} FROM {kunden} WHERE {ort} <> '${city}';`,
          meta: { city },
        });
      },
    },
  ],
};

// ─── Lektion 6: AND, OR, NOT, BETWEEN, IN ───────────────────────────────────

const PRICE_RANGES: Array<[number, number]> = [
  [10, 30],
  [5, 15],
  [20, 60],
  [1, 10],
];

const LESSON_SQL_2: Lesson = {
  id: "sql-2-und-oder",
  stageId: "stage-2-abfragen",
  stepNumber: 2,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Bedingungen verknüpfen: AND, OR, NOT",
      subtitle: "Erweiterte Bedingungen mit UND und ODER, Klammern, BETWEEN und IN",
      whyItMatters:
        "„Alle Schulartikel unter 20 Euro“ oder „Kunden aus Ulm oder Augsburg“: Echte Fragen haben mehrere Bedingungen. Wer AND und OR verwechselt, bekommt die falschen Zeilen, ohne dass das DBMS warnt.",
      explanationHtml: `
<p>Mit <code>AND</code> müssen beide Bedingungen wahr sein, mit <code>OR</code> reicht eine. <code>NOT</code> kehrt eine Bedingung um.</p>
<pre class="sql"><code>SELECT bezeichnung, preis FROM produkte
WHERE kategorie = 'Schule' AND preis &lt; 20;

SELECT vorname, nachname, ort FROM kunden
WHERE ort = 'Ulm' OR ort = 'Augsburg';</code></pre>
<p><code>AND</code> bindet stärker als <code>OR</code>. Mit Klammern machst du die Absicht eindeutig: <code>WHERE (ort = 'Ulm' OR ort = 'Augsburg') AND newsletter = 1</code>.</p>
<p>Zwei Abkürzungen: <code>BETWEEN a AND b</code> prüft einen Bereich, beide Grenzen eingeschlossen. <code>IN (…)</code> prüft, ob der Wert in einer Liste steht:</p>
<pre class="sql"><code>SELECT bezeichnung, preis FROM produkte
WHERE preis BETWEEN 10 AND 30;

SELECT vorname, nachname FROM kunden
WHERE ort IN ('Ulm', 'Augsburg', 'München');</code></pre>`,
      syntax: [
        { name: "Beide Bedingungen", sql: "WHERE bedingung1 AND bedingung2", note: "Nur Zeilen, die beide erfüllen." },
        { name: "Eine von beiden", sql: "WHERE bedingung1 OR bedingung2", note: "Klammern setzen, wenn AND und OR gemischt werden." },
        { name: "Bereich", sql: "WHERE spalte BETWEEN a AND b", note: "Grenzen eingeschlossen." },
        { name: "Liste", sql: "WHERE spalte IN ('a', 'b', 'c')", note: "Kurz für mehrere OR." },
      ],
      quiz: {
        question: "Was liefert WHERE ort = 'Ulm' AND ort = 'Augsburg'?",
        options: [
          "Keine Zeile: Ein Ort kann nicht gleichzeitig Ulm und Augsburg sein",
          "Alle Kunden aus Ulm und alle aus Augsburg",
          "Einen Syntaxfehler",
        ],
        correctIndex: 0,
        explanation: "Für „Ulm oder Augsburg“ braucht es OR (oder IN). AND verlangt beides zugleich.",
      },
      lab: {
        title: "Sandbox: Bedingungen kombinieren",
        intro: "Probiere AND, OR, BETWEEN und IN aus und vergleiche die Zeilenzahlen.",
        goals: {
          g1: "Zeige bezeichnung und preis der Produkte der Kategorie Schule, die weniger als 20 Euro kosten.",
          g2: "Zeige alle Spalten der Kunden aus Ulm oder Augsburg.",
          g3: "Zeige bezeichnung und preis der Produkte mit einem Preis zwischen 10 und 30 Euro (Grenzen eingeschlossen).",
        },
      },
      celebrationMessage: "Du verknüpfst Bedingungen sicher mit AND, OR, BETWEEN und IN.",
    },
    {
      title: "Combining conditions: AND, OR, NOT",
      subtitle: "Extended conditions with AND and OR, parentheses, BETWEEN and IN",
      whyItMatters:
        "“All school supplies under 20 euros” or “customers from Ulm or Augsburg”: real questions have several conditions. Mixing up AND and OR returns the wrong rows, and the DBMS does not warn you.",
      explanationHtml: `
<p>With <code>AND</code> both conditions must be true, with <code>OR</code> one is enough. <code>NOT</code> inverts a condition.</p>
<pre class="sql"><code>SELECT name, price FROM products
WHERE category = 'School' AND price &lt; 20;

SELECT first_name, last_name, city FROM customers
WHERE city = 'Ulm' OR city = 'Augsburg';</code></pre>
<p><code>AND</code> binds more strongly than <code>OR</code>. Parentheses make the intent clear: <code>WHERE (city = 'Ulm' OR city = 'Augsburg') AND newsletter = 1</code>.</p>
<p>Two shortcuts: <code>BETWEEN a AND b</code> checks a range, both limits included. <code>IN (…)</code> checks whether the value is in a list:</p>
<pre class="sql"><code>SELECT name, price FROM products
WHERE price BETWEEN 10 AND 30;

SELECT first_name, last_name FROM customers
WHERE city IN ('Ulm', 'Augsburg', 'München');</code></pre>`,
      syntax: [
        { name: "Both conditions", sql: "WHERE condition1 AND condition2", note: "Only rows that satisfy both." },
        { name: "One of them", sql: "WHERE condition1 OR condition2", note: "Use parentheses when mixing AND and OR." },
        { name: "Range", sql: "WHERE column BETWEEN a AND b", note: "Limits included." },
        { name: "List", sql: "WHERE column IN ('a', 'b', 'c')", note: "Short for several OR." },
      ],
      quiz: {
        question: "What does WHERE city = 'Ulm' AND city = 'Augsburg' return?",
        options: [
          "No row: a city cannot be Ulm and Augsburg at the same time",
          "All customers from Ulm and all from Augsburg",
          "A syntax error",
        ],
        correctIndex: 0,
        explanation: "“Ulm or Augsburg” needs OR (or IN). AND demands both at once.",
      },
      lab: {
        title: "Sandbox: combine conditions",
        intro: "Try AND, OR, BETWEEN and IN and compare the row counts.",
        goals: {
          g1: "Show name and price of the products in the category School that cost less than 20 euros.",
          g2: "Show all columns of the customers from Ulm or Augsburg.",
          g3: "Show name and price of the products priced between 10 and 30 euros (limits included).",
        },
      },
      celebrationMessage: "You combine conditions confidently with AND, OR, BETWEEN and IN.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT {bezeichnung}, {preis} FROM {produkte}\nWHERE {kategorie} = '{Elektronik}' AND {preis} < 30;", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {kategorie} = '{Schule}' AND {preis} < 20;")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT * FROM {kunden} WHERE {ort} IN ('Ulm', 'Augsburg');")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {preis} BETWEEN 10 AND 30;")),
  ]),
  exercises: [
    {
      id: "und",
      make: (rng, level, locale) => {
        const category = rng.pick(["Schule", "Elektronik", "Sport"]);
        const threshold = rng.pick([20, 30, 50]);
        const price = money(locale, threshold);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {bezeichnung} und {preis} der Produkte mit {kategorie} {${category}} und {preis} kleiner als ${threshold}.`,
            `Show {bezeichnung} and {preis} of the products with {kategorie} {${category}} and {preis} less than ${threshold}.`,
          ),
          prompt2: L(
            `Welche ${CATEGORY_WORDS[category].de} kosten weniger als ${price}? Zeige Name und Preis.`,
            `Which ${CATEGORY_WORDS[category].en} cost less than ${price}? Show name and price.`,
          ),
          hint: L("… WHERE <Bedingung1> AND <Bedingung2>;", "… WHERE <condition1> AND <condition2>;"),
          sql: `SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {kategorie} = '{${category}}' AND {preis} < ${threshold};`,
          meta: { category, threshold },
        });
      },
    },
    {
      id: "oder",
      make: (rng, level, locale) => {
        const [a, b] = rng.sample(CITIES, 2);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {vorname}, {nachname} und {ort} der Kunden, deren {ort} '${a}' oder '${b}' ist.`,
            `Show {vorname}, {nachname} and {ort} of the customers whose {ort} is '${a}' or '${b}'.`,
          ),
          prompt2: L(
            `Eine Aktion läuft in ${a} und ${b}. Zeige Vorname, Nachname und Wohnort aller Kunden aus diesen beiden Städten.`,
            `A promotion runs in ${a} and ${b}. Show first name, last name and city of all customers from these two cities.`,
          ),
          hint: L("… WHERE <Spalte> = 'a' OR <Spalte> = 'b';   oder   … WHERE <Spalte> IN ('a', 'b');", "… WHERE <column> = 'a' OR <column> = 'b';   or   … WHERE <column> IN ('a', 'b');"),
          sql: `SELECT {vorname}, {nachname}, {ort} FROM {kunden} WHERE {ort} = '${a}' OR {ort} = '${b}';`,
          meta: { a, b },
        });
      },
    },
    {
      id: "bereich",
      make: (rng, level, locale) => {
        const [low, high] = rng.pick(PRICE_RANGES);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {bezeichnung} und {preis} der Produkte, deren {preis} zwischen ${low} und ${high} liegt (Grenzen eingeschlossen).`,
            `Show {bezeichnung} and {preis} of the products whose {preis} is between ${low} and ${high} (limits included).`,
          ),
          prompt2: L(
            `Für ein Geschenk stehen ${money(locale, low)} bis ${money(locale, high)} zur Verfügung. Welche Produkte kommen infrage? Zeige Name und Preis.`,
            `A gift budget allows ${money(locale, low)} to ${money(locale, high)}. Which products qualify? Show name and price.`,
          ),
          hint: L("… WHERE <Spalte> BETWEEN <a> AND <b>;", "… WHERE <column> BETWEEN <a> AND <b>;"),
          sql: `SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {preis} BETWEEN ${low} AND ${high};`,
          meta: { low, high },
        });
      },
    },
    {
      id: "nicht",
      make: (rng, level, locale) => {
        const city = rng.pick([...SHARED_CITIES, "München"]);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {vorname}, {nachname} und {ort} der Kunden mit {newsletter} gleich 1, deren {ort} nicht '${city}' ist.`,
            `Show {vorname}, {nachname} and {ort} of the customers with {newsletter} equal to 1 whose {ort} is not '${city}'.`,
          ),
          prompt2: L(
            `Der Newsletter geht an alle Abonnenten außerhalb von ${city}. Zeige Vorname, Nachname und Wohnort der Empfänger.`,
            `The newsletter goes to every subscriber outside ${city}. Show first name, last name and city of the recipients.`,
          ),
          hint: L("… WHERE <Bedingung> AND NOT <Bedingung>;   (Ja/Nein-Felder: = 1 oder = 0)", "… WHERE <condition> AND NOT <condition>;   (yes/no fields: = 1 or = 0)"),
          sql: `SELECT {vorname}, {nachname}, {ort} FROM {kunden} WHERE {newsletter} = 1 AND NOT {ort} = '${city}';`,
          meta: { city },
        });
      },
    },
  ],
};

// ─── Lektion 7: LIKE ────────────────────────────────────────────────────────

const ENDINGS: Array<{ column: string; table: string; pattern: string; words: Localized; select: string }> = [
  { table: "kunden", column: "ort", pattern: "%burg", select: "{vorname}, {nachname}, {ort}", words: L("in einer Stadt wohnen, deren Name auf „burg“ endet", "live in a city whose name ends in “burg”") },
  { table: "kunden", column: "nachname", pattern: "%er", select: "{vorname}, {nachname}", words: L("einen Nachnamen haben, der auf „er“ endet", "have a last name ending in “er”") },
  { table: "kunden", column: "nachname", pattern: "%mann", select: "{vorname}, {nachname}", words: L("einen Nachnamen haben, der auf „mann“ endet", "have a last name ending in “mann”") },
];

const CONTAINS: Array<{ pattern: Localized; words: Localized }> = [
  { pattern: L("%stick%", "%stick%"), words: L("„stick“", "“stick”") },
  { pattern: L("%ball%", "%ball%"), words: L("„ball“", "“ball”") },
  { pattern: L("%er%", "%er%"), words: L("„er“", "“er”") },
];

const LESSON_SQL_3: Lesson = {
  id: "sql-3-like",
  stageId: "stage-2-abfragen",
  stepNumber: 3,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Muster suchen mit LIKE",
      subtitle: "Platzhalter: % für beliebig viele Zeichen, _ für genau eines",
      whyItMatters:
        "Wer nur den Anfang eines Namens kennt oder alle Orte auf „burg“ sucht, braucht keine exakte Übereinstimmung, sondern ein Muster.",
      explanationHtml: `
<p><code>LIKE</code> vergleicht Text mit einem Muster. Zwei Platzhalter gibt es:</p>
<ul>
  <li><code>%</code> steht für beliebig viele Zeichen, auch keines.</li>
  <li><code>_</code> steht für genau ein Zeichen.</li>
</ul>
<pre class="sql"><code>SELECT nachname FROM kunden WHERE nachname LIKE 'B%';     -- beginnt mit B
SELECT ort FROM kunden WHERE ort LIKE '%burg';            -- endet auf burg
SELECT bezeichnung FROM produkte WHERE bezeichnung LIKE '%stick%';  -- enthält stick
SELECT vorname FROM kunden WHERE vorname LIKE '____';     -- genau vier Zeichen</code></pre>
<p>In SQLite unterscheidet <code>LIKE</code> bei lateinischen Buchstaben nicht zwischen Groß- und Kleinschreibung: <code>'b%'</code> findet auch „Berg“. Andere Datenbanksysteme sind da strenger. <code>NOT LIKE</code> findet alles, was dem Muster nicht entspricht.</p>`,
      syntax: [
        { name: "Muster suchen", sql: "WHERE spalte LIKE 'Muster'", note: "% beliebig viele Zeichen, _ genau eines." },
        { name: "Beispiele", sql: "'B%'  '%burg'  '%stick%'  '____'", note: "beginnt mit, endet auf, enthält, genau vier Zeichen" },
      ],
      quiz: {
        question: "Welches Muster findet alle Nachnamen, die auf „mann“ enden?",
        options: ["LIKE '%mann'", "LIKE 'mann%'", "LIKE '_mann'"],
        correctIndex: 0,
        explanation: "% am Anfang: davor darf beliebig viel stehen, danach nichts mehr.",
      },
      lab: {
        title: "Sandbox: Mit Mustern suchen",
        intro: "Probiere % und _ an Namen und Orten aus.",
        goals: {
          g1: "Zeige den nachname aller Kunden, deren nachname mit B beginnt.",
          g2: "Zeige vorname, nachname und ort aller Kunden, deren ort auf „burg“ endet.",
          g3: "Zeige vorname und nachname aller Kunden, deren vorname aus genau vier Zeichen besteht.",
        },
      },
      celebrationMessage: "Du findest Text mit Mustern statt mit exakten Werten.",
    },
    {
      title: "Searching patterns with LIKE",
      subtitle: "Wildcards: % for any number of characters, _ for exactly one",
      whyItMatters:
        "Whoever knows only the start of a name or looks for all cities ending in “burg” needs a pattern, not an exact match.",
      explanationHtml: `
<p><code>LIKE</code> compares text with a pattern. There are two wildcards:</p>
<ul>
  <li><code>%</code> stands for any number of characters, including none.</li>
  <li><code>_</code> stands for exactly one character.</li>
</ul>
<pre class="sql"><code>SELECT last_name FROM customers WHERE last_name LIKE 'B%';   -- starts with B
SELECT city FROM customers WHERE city LIKE '%burg';           -- ends in burg
SELECT name FROM products WHERE name LIKE '%stick%';          -- contains stick
SELECT first_name FROM customers WHERE first_name LIKE '____'; -- exactly four characters</code></pre>
<p>In SQLite, <code>LIKE</code> ignores case for Latin letters: <code>'b%'</code> also finds “Berg”. Other database systems are stricter. <code>NOT LIKE</code> finds everything that does not match the pattern.</p>`,
      syntax: [
        { name: "Search a pattern", sql: "WHERE column LIKE 'pattern'", note: "% any number of characters, _ exactly one." },
        { name: "Examples", sql: "'B%'  '%burg'  '%stick%'  '____'", note: "starts with, ends in, contains, exactly four characters" },
      ],
      quiz: {
        question: "Which pattern finds all last names ending in “mann”?",
        options: ["LIKE '%mann'", "LIKE 'mann%'", "LIKE '_mann'"],
        correctIndex: 0,
        explanation: "% at the start: anything may come before, nothing after.",
      },
      lab: {
        title: "Sandbox: search with patterns",
        intro: "Try % and _ on names and cities.",
        goals: {
          g1: "Show the last_name of all customers whose last_name starts with B.",
          g2: "Show first_name, last_name and city of all customers whose city ends in “burg”.",
          g3: "Show first_name and last_name of all customers whose first_name has exactly four characters.",
        },
      },
      celebrationMessage: "You find text with patterns instead of exact values.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT {vorname} FROM {kunden}\nWHERE {vorname} LIKE 'J%';", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT {nachname} FROM {kunden} WHERE {nachname} LIKE 'B%';")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT {vorname}, {nachname}, {ort} FROM {kunden} WHERE {ort} LIKE '%burg';")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT {vorname}, {nachname} FROM {kunden} WHERE {vorname} LIKE '____';")),
  ]),
  exercises: [
    {
      id: "beginnt-mit",
      make: (rng, level, locale) => {
        const letter = rng.pick(["B", "H", "S", "M", "K"]);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {vorname} und {nachname} der Kunden, deren {nachname} mit '${letter}' beginnt.`,
            `Show {vorname} and {nachname} of the customers whose {nachname} starts with '${letter}'.`,
          ),
          prompt2: L(
            `Im Aktenschrank fehlt die Mappe „${letter}“. Zeige Vor- und Nachname aller Kunden, deren Nachname mit ${letter} beginnt.`,
            `The folder “${letter}” is missing from the filing cabinet. Show first and last name of all customers whose last name starts with ${letter}.`,
          ),
          hint: L("… WHERE <Spalte> LIKE 'X%';", "… WHERE <column> LIKE 'X%';"),
          sql: `SELECT {vorname}, {nachname} FROM {kunden} WHERE {nachname} LIKE '${letter}%';`,
          meta: { letter },
        });
      },
    },
    {
      id: "endet-auf",
      make: (rng, level, locale) => {
        const pick = rng.pick(ENDINGS);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige ${pick.select} der Kunden, deren {${pick.column}} auf '${pick.pattern.slice(1)}' endet.`,
            `Show ${pick.select} of the customers whose {${pick.column}} ends in '${pick.pattern.slice(1)}'.`,
          ),
          prompt2: L(
            `Zeige die genannten Spalten (${pick.select}) aller Kunden, die ${pick.words.de}.`,
            `Show the named columns (${pick.select}) of all customers who ${pick.words.en}.`,
          ),
          hint: L("… WHERE <Spalte> LIKE '%xyz';", "… WHERE <column> LIKE '%xyz';"),
          sql: `SELECT ${pick.select} FROM {${pick.table}} WHERE {${pick.column}} LIKE '${pick.pattern}';`,
          meta: { pattern: pick.pattern },
        });
      },
    },
    {
      id: "enthaelt",
      make: (rng, level, locale) => {
        const pick = rng.pick(CONTAINS);
        const pattern = pick.pattern[locale];
        return queryTask(locale, level, {
          prompt: L(
            `Zeige die {bezeichnung} aller Produkte, deren {bezeichnung} ${pick.words.de} enthält.`,
            `Show the {bezeichnung} of all products whose {bezeichnung} contains ${pick.words.en}.`,
          ),
          prompt2: L(
            `Eine Kundin erinnert sich nur an einen Teil des Produktnamens: ${pick.words.de}. Zeige die Namen aller Produkte, die das enthalten.`,
            `A customer remembers only part of the product name: ${pick.words.en}. Show the names of all products containing it.`,
          ),
          hint: L("… WHERE <Spalte> LIKE '%xyz%';", "… WHERE <column> LIKE '%xyz%';"),
          sql: `SELECT {bezeichnung} FROM {produkte} WHERE {bezeichnung} LIKE '${pattern}';`,
          meta: { pattern },
        });
      },
    },
    {
      id: "genau-n-zeichen",
      make: (rng, level, locale) => {
        const length = rng.pick([3, 4, 5]);
        const underscores = "_".repeat(length);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {vorname} und {nachname} der Kunden, deren {vorname} aus genau ${length} Zeichen besteht.`,
            `Show {vorname} and {nachname} of the customers whose {vorname} has exactly ${length} characters.`,
          ),
          prompt2: L(
            `Auf einem Namensschild ist Platz für genau ${length} Buchstaben. Welche Kunden haben einen passenden Vornamen? Zeige Vor- und Nachname.`,
            `A name badge has room for exactly ${length} letters. Which customers have a fitting first name? Show first and last name.`,
          ),
          hint: L("… WHERE <Spalte> LIKE '____';   (ein _ je Zeichen)", "… WHERE <column> LIKE '____';   (one _ per character)"),
          sql: `SELECT {vorname}, {nachname} FROM {kunden} WHERE {vorname} LIKE '${underscores}';`,
          meta: { length },
        });
      },
    },
  ],
};

// ─── Lektion 8: ORDER BY ────────────────────────────────────────────────────

const SORTS: Array<{ table: string; select: string; order: string; words: Localized }> = [
  { table: "produkte", select: "{bezeichnung}, {preis}", order: "{preis} ASC", words: L("alle Produkte mit Preis, das günstigste zuerst", "all products with their price, cheapest first") },
  { table: "produkte", select: "{bezeichnung}, {preis}", order: "{preis} DESC", words: L("alle Produkte mit Preis, das teuerste zuerst", "all products with their price, most expensive first") },
  { table: "kunden", select: "{nachname}, {vorname}", order: "{nachname} ASC", words: L("alle Kunden alphabetisch nach Nachname", "all customers alphabetically by last name") },
  { table: "kunden", select: "{vorname}, {nachname}, {geburtsdatum}", order: "{geburtsdatum} ASC", words: L("alle Kunden mit Geburtsdatum, die ältesten zuerst", "all customers with their birth date, oldest first") },
  { table: "kunden", select: "{vorname}, {nachname}, {geburtsdatum}", order: "{geburtsdatum} DESC", words: L("alle Kunden mit Geburtsdatum, die jüngsten zuerst", "all customers with their birth date, youngest first") },
  { table: "bestellungen", select: "{bestell_id}, {bestelldatum}", order: "{bestelldatum} DESC", words: L("alle Bestellungen (Nummer und Datum), die neueste zuerst", "all orders (number and date), newest first") },
];

const TOPS: Array<{ table: string; select: string; order: string; words: Localized<(n: number) => string> }> = [
  { table: "produkte", select: "{bezeichnung}, {preis}", order: "{preis} DESC", words: L((n) => `die ${n} teuersten Produkte mit Preis`, (n) => `the ${n} most expensive products with their price`) },
  { table: "produkte", select: "{bezeichnung}, {preis}", order: "{preis} ASC", words: L((n) => `die ${n} günstigsten Produkte mit Preis`, (n) => `the ${n} cheapest products with their price`) },
  { table: "kunden", select: "{vorname}, {nachname}, {geburtsdatum}", order: "{geburtsdatum} ASC", words: L((n) => `die ${n} ältesten Kunden mit Geburtsdatum`, (n) => `the ${n} oldest customers with their birth date`) },
  { table: "produkte", select: "{bezeichnung}, {lagerbestand}", order: "{lagerbestand} DESC", words: L((n) => `die ${n} Produkte mit dem größten Lagerbestand`, (n) => `the ${n} products with the largest stock`) },
];

const TWO_KEYS: Array<{ table: string; select: string; order: string; words: Localized }> = [
  { table: "kunden", select: "{ort}, {nachname}, {vorname}", order: "{ort}, {nachname}", words: L("alle Kunden nach Wohnort sortiert, innerhalb eines Orts nach Nachname", "all customers sorted by city, and by last name within a city") },
  { table: "produkte", select: "{kategorie}, {bezeichnung}, {preis}", order: "{kategorie}, {preis} DESC", words: L("alle Produkte nach Kategorie sortiert, innerhalb einer Kategorie das teuerste zuerst", "all products sorted by category, most expensive first within a category") },
  { table: "bestellungen", select: "{status}, {bestelldatum}, {bestell_id}", order: "{status}, {bestelldatum}", words: L("alle Bestellungen nach Status sortiert, innerhalb eines Status die älteste zuerst", "all orders sorted by status, oldest first within a status") },
];

const LESSON_SQL_4: Lesson = {
  id: "sql-4-order-by",
  stageId: "stage-2-abfragen",
  stepNumber: 4,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Sortieren mit ORDER BY",
      subtitle: "Aufsteigend und absteigend, nach mehreren Spalten, und die ersten n Zeilen mit LIMIT",
      whyItMatters:
        "Ohne ORDER BY kommen Zeilen in beliebiger Reihenfolge. Berichte, Ranglisten und Listen zum Abhaken brauchen eine festgelegte Sortierung.",
      explanationHtml: `
<p><code>ORDER BY</code> sortiert das Ergebnis. <code>ASC</code> (aufsteigend) ist die Voreinstellung, <code>DESC</code> sortiert absteigend:</p>
<pre class="sql"><code>SELECT bezeichnung, preis FROM produkte
ORDER BY preis DESC;</code></pre>
<p>Mehrere Sortierschlüssel trennst du mit Komma. Der zweite entscheidet nur bei Gleichstand im ersten:</p>
<pre class="sql"><code>SELECT nachname, vorname, ort FROM kunden
ORDER BY ort, nachname;</code></pre>
<p><code>LIMIT n</code> liefert nur die ersten n Zeilen des sortierten Ergebnisses, zum Beispiel die drei teuersten Produkte:</p>
<pre class="sql"><code>SELECT bezeichnung, preis FROM produkte
ORDER BY preis DESC
LIMIT 3;</code></pre>
<p>Reihenfolge der Klauseln: <code>SELECT … FROM … WHERE … ORDER BY … LIMIT …</code>. Text sortiert alphabetisch, Zahlen nach Größe, ein Datum im Format JJJJ-MM-TT chronologisch.</p>`,
      syntax: [
        { name: "Sortieren", sql: "SELECT spalten FROM tabelle ORDER BY spalte ASC|DESC;", note: "ASC ist Voreinstellung." },
        { name: "Mehrere Schlüssel", sql: "ORDER BY spalte1, spalte2 DESC", note: "Der zweite entscheidet bei Gleichstand." },
        { name: "Nur die ersten n", sql: "ORDER BY spalte DESC LIMIT n", note: "Rangliste: Top n." },
      ],
      quiz: {
        question: "Wie bekommst du die drei günstigsten Produkte?",
        options: ["ORDER BY preis ASC LIMIT 3", "ORDER BY preis DESC LIMIT 3", "LIMIT 3 ORDER BY preis"],
        correctIndex: 0,
        explanation: "Aufsteigend sortieren, dann die ersten drei. LIMIT steht nach ORDER BY.",
      },
      lab: {
        title: "Sandbox: Ergebnisse ordnen",
        intro: "Hier zählt die Reihenfolge der Zeilen.",
        goals: {
          g1: "Zeige bezeichnung und preis aller Produkte, nach preis absteigend sortiert.",
          g2: "Zeige nachname und ort aller Kunden, nach ort sortiert und bei gleichem ort nach nachname.",
          g3: "Zeige bezeichnung und preis der drei teuersten Produkte.",
        },
      },
      celebrationMessage: "Du lieferst Ergebnisse in genau der Reihenfolge, die gebraucht wird.",
    },
    {
      title: "Sorting with ORDER BY",
      subtitle: "Ascending and descending, by several columns, and the first n rows with LIMIT",
      whyItMatters:
        "Without ORDER BY rows come in any order. Reports, rankings and checklists need a defined sorting.",
      explanationHtml: `
<p><code>ORDER BY</code> sorts the result. <code>ASC</code> (ascending) is the default, <code>DESC</code> sorts descending:</p>
<pre class="sql"><code>SELECT name, price FROM products
ORDER BY price DESC;</code></pre>
<p>Several sort keys are separated by commas. The second one only decides ties in the first:</p>
<pre class="sql"><code>SELECT last_name, first_name, city FROM customers
ORDER BY city, last_name;</code></pre>
<p><code>LIMIT n</code> returns only the first n rows of the sorted result, for example the three most expensive products:</p>
<pre class="sql"><code>SELECT name, price FROM products
ORDER BY price DESC
LIMIT 3;</code></pre>
<p>Order of the clauses: <code>SELECT … FROM … WHERE … ORDER BY … LIMIT …</code>. Text sorts alphabetically, numbers by size, a date in the format YYYY-MM-DD chronologically.</p>`,
      syntax: [
        { name: "Sort", sql: "SELECT columns FROM table ORDER BY column ASC|DESC;", note: "ASC is the default." },
        { name: "Several keys", sql: "ORDER BY column1, column2 DESC", note: "The second decides ties." },
        { name: "Only the first n", sql: "ORDER BY column DESC LIMIT n", note: "Ranking: top n." },
      ],
      quiz: {
        question: "How do you get the three cheapest products?",
        options: ["ORDER BY price ASC LIMIT 3", "ORDER BY price DESC LIMIT 3", "LIMIT 3 ORDER BY price"],
        correctIndex: 0,
        explanation: "Sort ascending, then take the first three. LIMIT comes after ORDER BY.",
      },
      lab: {
        title: "Sandbox: order results",
        intro: "Here the order of the rows counts.",
        goals: {
          g1: "Show name and price of all products, sorted by price descending.",
          g2: "Show last_name and city of all customers, sorted by city and by last_name within the same city.",
          g3: "Show name and price of the three most expensive products.",
        },
      },
      celebrationMessage: "You deliver results in exactly the order that is needed.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT {bezeichnung}, {preis} FROM {produkte}\nORDER BY {preis} ASC;", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT {bezeichnung}, {preis} FROM {produkte} ORDER BY {preis} DESC;", true)),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT {nachname}, {ort} FROM {kunden} ORDER BY {ort}, {nachname};", true)),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT {bezeichnung}, {preis} FROM {produkte} ORDER BY {preis} DESC LIMIT 3;", true)),
  ]),
  exercises: [
    {
      id: "sortieren",
      make: (rng, level, locale) => {
        const pick = rng.pick(SORTS);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige ${pick.select} aus {${pick.table}}, sortiert nach ${pick.order.replace(" ASC", " aufsteigend").replace(" DESC", " absteigend")}.`,
            `Show ${pick.select} from {${pick.table}}, sorted by ${pick.order.replace(" ASC", " ascending").replace(" DESC", " descending")}.`,
          ),
          prompt2: L(`Zeige ${pick.words.de}.`, `Show ${pick.words.en}.`),
          hint: L("SELECT <Spalten> FROM <Tabelle> ORDER BY <Spalte> ASC|DESC;", "SELECT <columns> FROM <table> ORDER BY <column> ASC|DESC;"),
          sql: `SELECT ${pick.select} FROM {${pick.table}} ORDER BY ${pick.order};`,
          ordered: true,
          meta: { order: pick.order },
        });
      },
    },
    {
      id: "top-n",
      make: (rng, level, locale) => {
        const pick = rng.pick(TOPS);
        const n = rng.pick([3, 5]);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige ${pick.select} der ersten ${n} Zeilen aus {${pick.table}}, sortiert nach ${pick.order.replace(" ASC", " aufsteigend").replace(" DESC", " absteigend")}.`,
            `Show ${pick.select} of the first ${n} rows from {${pick.table}}, sorted by ${pick.order.replace(" ASC", " ascending").replace(" DESC", " descending")}.`,
          ),
          prompt2: L(`Zeige ${pick.words.de(n)}.`, `Show ${pick.words.en(n)}.`),
          hint: L("… ORDER BY <Spalte> DESC LIMIT <n>;", "… ORDER BY <column> DESC LIMIT <n>;"),
          sql: `SELECT ${pick.select} FROM {${pick.table}} ORDER BY ${pick.order} LIMIT ${n};`,
          ordered: true,
          meta: { n },
        });
      },
    },
    {
      id: "zwei-schluessel",
      make: (rng, level, locale) => {
        const pick = rng.pick(TWO_KEYS);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige ${pick.select} aus {${pick.table}}, sortiert nach ${pick.order.replace(" DESC", " absteigend")}.`,
            `Show ${pick.select} from {${pick.table}}, sorted by ${pick.order.replace(" DESC", " descending")}.`,
          ),
          prompt2: L(`Zeige ${pick.words.de}.`, `Show ${pick.words.en}.`),
          hint: L("… ORDER BY <Spalte1>, <Spalte2> [DESC];", "… ORDER BY <column1>, <column2> [DESC];"),
          sql: `SELECT ${pick.select} FROM {${pick.table}} ORDER BY ${pick.order};`,
          ordered: true,
          meta: { order: pick.order },
        });
      },
    },
  ],
};

// ─── Lektion 9: Rechnen und verketten ───────────────────────────────────────

const CALCS: Array<{ expr: string; words: Localized; label: Localized }> = [
  { expr: "{preis} * {lagerbestand}", label: L("Lagerwert", "stock value"), words: L("den Lagerwert jedes Produkts, also Preis mal Lagerbestand", "the stock value of every product, that is price times stock") },
  { expr: "{preis} * 0.9", label: L("Preis mit 10 % Rabatt", "price with 10% off"), words: L("den Preis jedes Produkts mit 10 % Rabatt", "the price of every product with 10% off") },
  { expr: "{preis} * 0.8", label: L("Preis mit 20 % Rabatt", "price with 20% off"), words: L("den Preis jedes Produkts mit 20 % Rabatt", "the price of every product with 20% off") },
  { expr: "{preis} * 100", label: L("Preis in Cent", "price in cents"), words: L("den Preis jedes Produkts in Cent", "the price of every product in cents") },
];

const CONCATS: Array<{ expr: string; words: Localized; example: string }> = [
  { expr: "{vorname} || ' ' || {nachname}", words: L("den vollständigen Namen jedes Kunden in einer Spalte, Vorname Leerzeichen Nachname", "the full name of every customer in one column, first name space last name"), example: "Anna Berg" },
  { expr: "{nachname} || ', ' || {vorname}", words: L("jeden Kunden als „Nachname, Vorname“ in einer Spalte", "every customer as “last name, first name” in one column"), example: "Berg, Anna" },
  { expr: "{plz} || ' ' || {ort}", words: L("die Ortszeile jedes Kunden, Postleitzahl Leerzeichen Ort, in einer Spalte", "the city line of every customer, postcode space city, in one column"), example: "89073 Ulm" },
];

const ROUNDS: Array<{ expr: string; words: Localized }> = [
  { expr: "ROUND({preis})", words: L("den Preis jedes Produkts auf ganze Euro gerundet", "the price of every product rounded to whole euros") },
  { expr: "ROUND({preis} * 1.1)", words: L("den Preis jedes Produkts in US-Dollar bei einem Kurs von 1,10, auf ganze Dollar gerundet", "the price of every product in US dollars at a rate of 1.10, rounded to whole dollars") },
  { expr: "ROUND({preis} * 1.19)", words: L("den Preis jedes Produkts plus 19 % Aufschlag, auf ganze Euro gerundet", "the price of every product plus a 19% surcharge, rounded to whole euros") },
];

const LESSON_SQL_5: Lesson = {
  id: "sql-5-berechnen",
  stageId: "stage-2-abfragen",
  stepNumber: 5,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Berechnete Spalten und Aliasnamen",
      subtitle: "Rechnen in SELECT, Text verketten mit ||, runden mit ROUND, Spalten benennen mit AS",
      whyItMatters:
        "Lagerwert, Rabattpreis, Anrede für den Serienbrief: Das DBMS rechnet für jede Zeile, du musst die Werte nicht einzeln ausrechnen oder in einer zweiten Spalte speichern.",
      explanationHtml: `
<p>In der <code>SELECT</code>-Liste darfst du rechnen. Das Ergebnis ist eine neue Spalte, die nicht gespeichert wird, sondern bei jeder Abfrage neu entsteht. Mit <code>AS</code> gibst du ihr einen Namen (<strong>Alias</strong>):</p>
<pre class="sql"><code>SELECT bezeichnung, preis * lagerbestand AS lagerwert
FROM produkte;</code></pre>
<p>Rechenzeichen: <code>+ - * /</code>. <code>ROUND(x)</code> rundet auf ganze Zahlen, <code>ROUND(x, 2)</code> auf zwei Nachkommastellen.</p>
<p>Text verkettest du mit <code>||</code>. So entsteht die Anrede für einen Serienbrief direkt aus der Datenbank, die Datenbankschnittstelle einer Textverarbeitung macht genau das:</p>
<pre class="sql"><code>SELECT 'Hallo ' || vorname || '!' AS anrede
FROM kunden;</code></pre>
<p>Der Alias gilt nur im Ergebnis; die Tabelle bleibt unverändert.</p>`,
      syntax: [
        { name: "Berechnete Spalte", sql: "SELECT spalte, spalte1 * spalte2 AS name FROM tabelle;", note: "+ - * /; AS vergibt den Namen." },
        { name: "Runden", sql: "ROUND(ausdruck)   ROUND(ausdruck, 2)", note: "Auf ganze Zahlen oder n Nachkommastellen." },
        { name: "Text verketten", sql: "'Hallo ' || vorname || '!'", note: "Zwei senkrechte Striche." },
      ],
      quiz: {
        question: "Was bewirkt AS lagerwert in SELECT preis * lagerbestand AS lagerwert?",
        options: [
          "Die berechnete Spalte heißt im Ergebnis lagerwert; gespeichert wird nichts",
          "Die Tabelle produkte bekommt dauerhaft eine neue Spalte lagerwert",
          "Nur Zeilen mit einem Lagerwert werden angezeigt",
        ],
        correctIndex: 0,
        explanation: "Ein Alias benennt eine Ergebnisspalte. Die Tabelle ändert sich nicht.",
      },
      lab: {
        title: "Sandbox: Rechnen und verketten",
        intro: "Berechne Werte und baue Text zusammen; vergib Aliasnamen mit AS.",
        goals: {
          g1: "Zeige bezeichnung und den Lagerwert (preis mal lagerbestand) jedes Produkts.",
          g2: "Zeige für jeden Kunden die Anrede 'Hallo ' || vorname || '!', zum Beispiel „Hallo Anna!“.",
          g3: "Zeige bezeichnung und den auf ganze Euro gerundeten preis jedes Produkts.",
        },
      },
      celebrationMessage: "Du lässt das DBMS rechnen und Text zusammensetzen.",
    },
    {
      title: "Calculated columns and aliases",
      subtitle: "Arithmetic in SELECT, joining text with ||, rounding with ROUND, naming columns with AS",
      whyItMatters:
        "Stock value, discounted price, the greeting for a mail merge: the DBMS calculates for every row, so you neither compute values by hand nor store them in a second column.",
      explanationHtml: `
<p>You may calculate in the <code>SELECT</code> list. The result is a new column that is not stored but computed afresh with every query. With <code>AS</code> you give it a name (<strong>alias</strong>):</p>
<pre class="sql"><code>SELECT name, price * stock AS stock_value
FROM products;</code></pre>
<p>Operators: <code>+ - * /</code>. <code>ROUND(x)</code> rounds to whole numbers, <code>ROUND(x, 2)</code> to two decimals.</p>
<p>Text is joined with <code>||</code>. That is how the greeting of a mail merge comes straight out of the database; the database interface of a word processor does exactly this:</p>
<pre class="sql"><code>SELECT 'Hello ' || first_name || '!' AS greeting
FROM customers;</code></pre>
<p>The alias only exists in the result; the table stays unchanged.</p>`,
      syntax: [
        { name: "Calculated column", sql: "SELECT column, column1 * column2 AS name FROM table;", note: "+ - * /; AS gives the name." },
        { name: "Round", sql: "ROUND(expression)   ROUND(expression, 2)", note: "To whole numbers or n decimals." },
        { name: "Join text", sql: "'Hello ' || first_name || '!'", note: "Two vertical bars." },
      ],
      quiz: {
        question: "What does AS stock_value do in SELECT price * stock AS stock_value?",
        options: [
          "The calculated column is called stock_value in the result; nothing is stored",
          "The table products permanently gets a new column stock_value",
          "Only rows with a stock value are shown",
        ],
        correctIndex: 0,
        explanation: "An alias names a result column. The table does not change.",
      },
      lab: {
        title: "Sandbox: calculate and join",
        intro: "Calculate values and build text; give aliases with AS.",
        goals: {
          g1: "Show name and the stock value (price times stock) of every product.",
          g2: "Show for every customer the greeting 'Hello ' || first_name || '!', for example “Hello Anna!”.",
          g3: "Show name and the price of every product rounded to whole euros.",
        },
      },
      celebrationMessage: "You let the DBMS calculate and assemble text.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT {bezeichnung}, {preis} * 2 AS {gesamt}\nFROM {produkte};", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT {bezeichnung}, {preis} * {lagerbestand} FROM {produkte};")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT '{Hallo} ' || {vorname} || '!' FROM {kunden};")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT {bezeichnung}, ROUND({preis}) FROM {produkte};")),
  ]),
  exercises: [
    {
      id: "rechnen",
      make: (rng, level, locale) => {
        const pick = rng.pick(CALCS);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {bezeichnung} und die berechnete Spalte ${pick.expr} (${pick.label.de}) für alle Produkte.`,
            `Show {bezeichnung} and the calculated column ${pick.expr} (${pick.label.en}) for all products.`,
          ),
          prompt2: L(`Zeige den Namen und ${pick.words.de}.`, `Show the name and ${pick.words.en}.`),
          hint: L("SELECT <Spalte>, <Spalte> * <Zahl oder Spalte> AS <Name> FROM <Tabelle>;", "SELECT <column>, <column> * <number or column> AS <name> FROM <table>;"),
          sql: `SELECT {bezeichnung}, ${pick.expr} FROM {produkte};`,
          note: L("Der Aliasname ist frei wählbar; geprüft werden die Werte.", "The alias is yours to choose; the values are checked."),
          meta: { expr: pick.expr },
        });
      },
    },
    {
      id: "verketten",
      make: (rng, level, locale) => {
        const pick = rng.pick(CONCATS);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige für alle Kunden die eine Spalte ${pick.expr}.`,
            `Show for all customers the single column ${pick.expr}.`,
          ),
          prompt2: L(
            `Zeige ${pick.words.de}, zum Beispiel „${pick.example}“.`,
            `Show ${pick.words.en}, for example “${pick.example}”.`,
          ),
          hint: L("SELECT <Spalte> || ' ' || <Spalte> AS <Name> FROM <Tabelle>;", "SELECT <column> || ' ' || <column> AS <name> FROM <table>;"),
          sql: `SELECT ${pick.expr} FROM {kunden};`,
          meta: { expr: pick.expr },
        });
      },
    },
    {
      id: "runden",
      make: (rng, level, locale) => {
        const pick = rng.pick(ROUNDS);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige {bezeichnung} und ${pick.expr} für alle Produkte.`,
            `Show {bezeichnung} and ${pick.expr} for all products.`,
          ),
          prompt2: L(`Zeige den Namen und ${pick.words.de}.`, `Show the name and ${pick.words.en}.`),
          hint: L("SELECT <Spalte>, ROUND(<Ausdruck>) FROM <Tabelle>;", "SELECT <column>, ROUND(<expression>) FROM <table>;"),
          sql: `SELECT {bezeichnung}, ${pick.expr} FROM {produkte};`,
          meta: { expr: pick.expr },
        });
      },
    },
  ],
};

// ─── Lektion 10: Aggregatfunktionen ─────────────────────────────────────────

const COUNTS: Array<{ sql: string; prompt: Localized; words: Localized }> = [
  ...CITIES.slice(0, 6).map((city) => ({
    sql: `SELECT COUNT(*) FROM {kunden} WHERE {ort} = '${city}';`,
    prompt: L(`Zähle mit COUNT(*) die Zeilen in {kunden}, deren {ort} '${city}' ist.`, `Count with COUNT(*) the rows in {kunden} whose {ort} is '${city}'.`),
    words: L(`Wie viele Kunden wohnen in ${city}?`, `How many customers live in ${city}?`),
  })),
  ...CATEGORIES.map((category) => ({
    sql: `SELECT COUNT(*) FROM {produkte} WHERE {kategorie} = '{${category}}';`,
    prompt: L(`Zähle mit COUNT(*) die Zeilen in {produkte} mit {kategorie} {${category}}.`, `Count with COUNT(*) the rows in {produkte} with {kategorie} {${category}}.`),
    words: L(`Wie viele Produkte gehören zur Kategorie {${category}}?`, `How many products belong to the category {${category}}?`),
  })),
  ...STATUSES.map((status) => ({
    sql: `SELECT COUNT(*) FROM {bestellungen} WHERE {status} = '{${status}}';`,
    prompt: L(`Zähle mit COUNT(*) die Zeilen in {bestellungen} mit {status} {${status}}.`, `Count with COUNT(*) the rows in {bestellungen} with {status} {${status}}.`),
    words: L(`Wie viele Bestellungen haben den Status {${status}}?`, `How many orders have the status {${status}}?`),
  })),
];

const EXTREMES: Array<{ sql: string; prompt: Localized; words: Localized }> = [
  { sql: "SELECT MAX({preis}) FROM {produkte};", prompt: L("Ermittle mit MAX den größten {preis} in {produkte}.", "Find with MAX the largest {preis} in {produkte}."), words: L("Was kostet das teuerste Produkt?", "What does the most expensive product cost?") },
  { sql: "SELECT MIN({preis}) FROM {produkte};", prompt: L("Ermittle mit MIN den kleinsten {preis} in {produkte}.", "Find with MIN the smallest {preis} in {produkte}."), words: L("Was kostet das günstigste Produkt?", "What does the cheapest product cost?") },
  { sql: "SELECT MIN({geburtsdatum}) FROM {kunden};", prompt: L("Ermittle mit MIN das kleinste {geburtsdatum} in {kunden}.", "Find with MIN the smallest {geburtsdatum} in {kunden}."), words: L("Wann wurde der älteste Kunde geboren? Ein Datum.", "When was the oldest customer born? One date.") },
  { sql: "SELECT MAX({geburtsdatum}) FROM {kunden};", prompt: L("Ermittle mit MAX das größte {geburtsdatum} in {kunden}.", "Find with MAX the largest {geburtsdatum} in {kunden}."), words: L("Wann wurde der jüngste Kunde geboren? Ein Datum.", "When was the youngest customer born? One date.") },
  { sql: "SELECT MAX({lagerbestand}) FROM {produkte};", prompt: L("Ermittle mit MAX den größten {lagerbestand} in {produkte}.", "Find with MAX the largest {lagerbestand} in {produkte}."), words: L("Wie groß ist der höchste Lagerbestand eines Produkts?", "How large is the highest stock of any product?") },
];

const SUMS: Array<{ sql: string; prompt: Localized; words: Localized }> = [
  { sql: "SELECT SUM({lagerbestand}) FROM {produkte};", prompt: L("Summiere mit SUM den {lagerbestand} aller Zeilen in {produkte}.", "Sum with SUM the {lagerbestand} of all rows in {produkte}."), words: L("Wie viele Artikel liegen insgesamt im Lager?", "How many items are in stock in total?") },
  { sql: "SELECT AVG({preis}) FROM {produkte};", prompt: L("Berechne mit AVG den Durchschnitt von {preis} in {produkte}.", "Calculate with AVG the average {preis} in {produkte}."), words: L("Was kostet ein Produkt im Durchschnitt?", "What does a product cost on average?") },
  { sql: "SELECT SUM({menge}) FROM {positionen};", prompt: L("Summiere mit SUM die {menge} aller Zeilen in {positionen}.", "Sum with SUM the {menge} of all rows in {positionen}."), words: L("Wie viele Stück wurden über alle Bestellpositionen hinweg bestellt?", "How many pieces were ordered across all order items?") },
  { sql: "SELECT AVG({preis}) FROM {produkte} WHERE {kategorie} = '{Schule}';", prompt: L("Berechne mit AVG den Durchschnitt von {preis} in {produkte} für {kategorie} {Schule}.", "Calculate with AVG the average {preis} in {produkte} for {kategorie} {Schule}."), words: L("Was kostet ein Schulartikel im Durchschnitt?", "What does a school item cost on average?") },
  { sql: "SELECT SUM({preis} * {lagerbestand}) FROM {produkte};", prompt: L("Summiere mit SUM den Ausdruck {preis} * {lagerbestand} über alle Zeilen in {produkte}.", "Sum with SUM the expression {preis} * {lagerbestand} over all rows in {produkte}."), words: L("Welchen Gesamtwert hat das Lager?", "What is the total value of the stock?") },
];

const LESSON_SQL_6: Lesson = {
  id: "sql-6-aggregat",
  stageId: "stage-2-abfragen",
  stepNumber: 6,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Zusammenfassen: COUNT, SUM, AVG, MIN, MAX",
      subtitle: "Aggregatfunktionen machen aus vielen Zeilen eine Kennzahl, auch mit WHERE",
      whyItMatters:
        "„Wie viele Kunden haben wir?“, „Was kostet ein Produkt im Schnitt?“, „Wie viel ist das Lager wert?“ Berichte bestehen aus solchen Kennzahlen, und das DBMS berechnet sie aus allen Zeilen auf einmal.",
      explanationHtml: `
<p><strong>Aggregatfunktionen</strong> fassen viele Zeilen zu einem Wert zusammen:</p>
<ul>
  <li><code>COUNT(*)</code> zählt Zeilen.</li>
  <li><code>SUM(spalte)</code> summiert, <code>AVG(spalte)</code> bildet den Durchschnitt.</li>
  <li><code>MIN(spalte)</code> und <code>MAX(spalte)</code> liefern den kleinsten und größten Wert, bei Text den alphabetisch ersten und letzten, bei einem Datum das früheste und späteste.</li>
</ul>
<pre class="sql"><code>SELECT COUNT(*) FROM kunden;
SELECT AVG(preis) FROM produkte;
SELECT SUM(preis * lagerbestand) AS lagerwert FROM produkte;</code></pre>
<p>Mit <code>WHERE</code> zählst oder summierst du nur einen Teil der Zeilen:</p>
<pre class="sql"><code>SELECT COUNT(*) FROM kunden WHERE ort = 'Ulm';</code></pre>
<p>Das Ergebnis hat genau eine Zeile. Eine Kennzahl pro Gruppe, etwa pro Kategorie, bekommst du mit <code>GROUP BY</code> in Etappe 4.</p>`,
      syntax: [
        { name: "Zeilen zählen", sql: "SELECT COUNT(*) FROM tabelle WHERE bedingung;", note: "Eine Zeile als Ergebnis." },
        { name: "Summe, Durchschnitt", sql: "SELECT SUM(spalte), AVG(spalte) FROM tabelle;", note: "Auch über einen Ausdruck: SUM(preis * menge)" },
        { name: "Kleinster, größter Wert", sql: "SELECT MIN(spalte), MAX(spalte) FROM tabelle;", note: "Bei Datum: frühestes, spätestes." },
      ],
      quiz: {
        question: "Wie viele Zeilen liefert SELECT COUNT(*) FROM kunden WHERE ort = 'Ulm'?",
        options: ["Genau eine Zeile mit der Anzahl", "Eine Zeile pro Kunde aus Ulm", "Eine Zeile pro Ort"],
        correctIndex: 0,
        explanation: "Eine Aggregatfunktion ohne GROUP BY fasst alle passenden Zeilen zu einem Wert zusammen.",
      },
      lab: {
        title: "Sandbox: Kennzahlen berechnen",
        intro: "Jede Abfrage liefert hier eine Zeile mit einer Kennzahl.",
        goals: {
          g1: "Wie viele Kunden gibt es? Zähle die Zeilen der Tabelle kunden.",
          g2: "Was kostet ein Produkt im Durchschnitt? Ermittle den Durchschnitt von preis.",
          g3: "Welchen Gesamtwert hat das Lager? Summiere preis mal lagerbestand über alle Produkte.",
        },
      },
      celebrationMessage: "Du berechnest Kennzahlen aus vielen Zeilen mit einer Abfrage.",
    },
    {
      title: "Summarising: COUNT, SUM, AVG, MIN, MAX",
      subtitle: "Aggregate functions turn many rows into one figure, also with WHERE",
      whyItMatters:
        "“How many customers do we have?”, “What does a product cost on average?”, “What is the stock worth?” Reports consist of such figures, and the DBMS computes them from all rows at once.",
      explanationHtml: `
<p><strong>Aggregate functions</strong> combine many rows into one value:</p>
<ul>
  <li><code>COUNT(*)</code> counts rows.</li>
  <li><code>SUM(column)</code> adds up, <code>AVG(column)</code> averages.</li>
  <li><code>MIN(column)</code> and <code>MAX(column)</code> give the smallest and largest value; for text the alphabetically first and last, for a date the earliest and latest.</li>
</ul>
<pre class="sql"><code>SELECT COUNT(*) FROM customers;
SELECT AVG(price) FROM products;
SELECT SUM(price * stock) AS stock_value FROM products;</code></pre>
<p>With <code>WHERE</code> you count or add only part of the rows:</p>
<pre class="sql"><code>SELECT COUNT(*) FROM customers WHERE city = 'Ulm';</code></pre>
<p>The result has exactly one row. One figure per group, say per category, comes with <code>GROUP BY</code> in stage 4.</p>`,
      syntax: [
        { name: "Count rows", sql: "SELECT COUNT(*) FROM table WHERE condition;", note: "One row as the result." },
        { name: "Sum, average", sql: "SELECT SUM(column), AVG(column) FROM table;", note: "Also over an expression: SUM(price * quantity)" },
        { name: "Smallest, largest value", sql: "SELECT MIN(column), MAX(column) FROM table;", note: "For dates: earliest, latest." },
      ],
      quiz: {
        question: "How many rows does SELECT COUNT(*) FROM customers WHERE city = 'Ulm' return?",
        options: ["Exactly one row with the count", "One row per customer from Ulm", "One row per city"],
        correctIndex: 0,
        explanation: "An aggregate function without GROUP BY combines all matching rows into one value.",
      },
      lab: {
        title: "Sandbox: compute figures",
        intro: "Every query here returns one row with one figure.",
        goals: {
          g1: "How many customers are there? Count the rows of the table customers.",
          g2: "What does a product cost on average? Find the average of price.",
          g3: "What is the total value of the stock? Sum price times stock over all products.",
        },
      },
      celebrationMessage: "You compute figures from many rows with one query.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT COUNT(*) FROM {produkte};", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT COUNT(*) FROM {kunden};")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT AVG({preis}) FROM {produkte};")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT SUM({preis} * {lagerbestand}) FROM {produkte};")),
  ]),
  exercises: [
    {
      id: "zaehlen",
      make: (rng, level, locale) => {
        const pick = rng.pick(COUNTS);
        return queryTask(locale, level, {
          prompt: pick.prompt,
          prompt2: L(`${pick.words.de} Ermittle die Anzahl mit einer Abfrage.`, `${pick.words.en} Find the number with one query.`),
          hint: L("SELECT COUNT(*) FROM <Tabelle> WHERE <Bedingung>;", "SELECT COUNT(*) FROM <table> WHERE <condition>;"),
          sql: pick.sql,
        });
      },
    },
    {
      id: "min-max",
      make: (rng, level, locale) => {
        const pick = rng.pick(EXTREMES);
        return queryTask(locale, level, {
          prompt: pick.prompt,
          prompt2: L(`${pick.words.de} Ermittle den Wert mit einer Abfrage.`, `${pick.words.en} Find the value with one query.`),
          hint: L("SELECT MIN(<Spalte>) FROM <Tabelle>;   SELECT MAX(<Spalte>) FROM <Tabelle>;", "SELECT MIN(<column>) FROM <table>;   SELECT MAX(<column>) FROM <table>;"),
          sql: pick.sql,
        });
      },
    },
    {
      id: "summe-durchschnitt",
      make: (rng, level, locale) => {
        const pick = rng.pick(SUMS);
        return queryTask(locale, level, {
          prompt: pick.prompt,
          prompt2: L(`${pick.words.de} Ermittle den Wert mit einer Abfrage.`, `${pick.words.en} Find the value with one query.`),
          hint: L("SELECT SUM(<Ausdruck>) FROM <Tabelle>;   SELECT AVG(<Spalte>) FROM <Tabelle> WHERE <Bedingung>;", "SELECT SUM(<expression>) FROM <table>;   SELECT AVG(<column>) FROM <table> WHERE <condition>;"),
          sql: pick.sql,
        });
      },
    },
  ],
};

export const STAGE_ABFRAGEN: Stage = {
  id: "stage-2-abfragen",
  stageNumber: 2,
  icon: "🔍",
  accent: "#0f766e",
  text: L(
    {
      title: "Abfragen mit SQL",
      subtitle: "WHERE, AND/OR, LIKE, ORDER BY, berechnete Spalten, Aggregatfunktionen",
      badgeTitle: "Abfrage-Profi",
      moduleLabel: "IT 2.3.1 Datenbanksysteme I",
    },
    {
      title: "Queries with SQL",
      subtitle: "WHERE, AND/OR, LIKE, ORDER BY, calculated columns, aggregate functions",
      badgeTitle: "Query pro",
      moduleLabel: "IT 2.3.1 Database systems I",
    },
  ),
  lessons: [LESSON_SQL_1, LESSON_SQL_2, LESSON_SQL_3, LESSON_SQL_4, LESSON_SQL_5, LESSON_SQL_6],
};
