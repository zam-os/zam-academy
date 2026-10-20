import { CUSTOMERS, CUSTOMERS_WITHOUT_ORDERS, ORDERS, PRODUCTS } from "../db/dataset";
import { countNow, lastErrorIncludes, lastResultEquals, scalarNow } from "../lab/goals";
import type { Lesson, Localized, Stage } from "../model/types";
import { choiceTask, goal, L, mutationTask, queryTask, SHOP, sqlLab } from "./helpers";

// ─── Lektion 16: GROUP BY ───────────────────────────────────────────────────

const GROUPS: Array<{ sql: string; prompt: Localized; words: Localized }> = [
  {
    sql: "SELECT {kategorie}, COUNT(*) FROM {produkte} GROUP BY {kategorie};",
    prompt: L("Zeige je {kategorie} aus {produkte} die Anzahl der Zeilen (COUNT(*)), gruppiert nach {kategorie}.", "Show per {kategorie} from {produkte} the number of rows (COUNT(*)), grouped by {kategorie}."),
    words: L("Wie viele Produkte gibt es in jeder Kategorie? Eine Zeile je Kategorie mit Name und Anzahl.", "How many products are there in each category? One row per category with name and count."),
  },
  {
    sql: "SELECT {status}, COUNT(*) FROM {bestellungen} GROUP BY {status};",
    prompt: L("Zeige je {status} aus {bestellungen} die Anzahl der Zeilen, gruppiert nach {status}.", "Show per {status} from {bestellungen} the number of rows, grouped by {status}."),
    words: L("Wie viele Bestellungen haben welchen Status? Eine Zeile je Status mit Anzahl.", "How many orders have which status? One row per status with count."),
  },
  {
    sql: "SELECT {ort}, COUNT(*) FROM {kunden} GROUP BY {ort};",
    prompt: L("Zeige je {ort} aus {kunden} die Anzahl der Zeilen, gruppiert nach {ort}.", "Show per {ort} from {kunden} the number of rows, grouped by {ort}."),
    words: L("Wie viele Kunden wohnen in jeder Stadt? Eine Zeile je Stadt mit Anzahl.", "How many customers live in each city? One row per city with count."),
  },
  {
    sql: "SELECT {kategorie}, AVG({preis}) FROM {produkte} GROUP BY {kategorie};",
    prompt: L("Zeige je {kategorie} aus {produkte} den Durchschnitt von {preis} (AVG), gruppiert nach {kategorie}.", "Show per {kategorie} from {produkte} the average {preis} (AVG), grouped by {kategorie}."),
    words: L("Was kostet ein Produkt in jeder Kategorie im Durchschnitt? Eine Zeile je Kategorie.", "What does a product cost on average in each category? One row per category."),
  },
  {
    sql: "SELECT {kategorie}, SUM({lagerbestand}) FROM {produkte} GROUP BY {kategorie};",
    prompt: L("Zeige je {kategorie} aus {produkte} die Summe von {lagerbestand}, gruppiert nach {kategorie}.", "Show per {kategorie} from {produkte} the sum of {lagerbestand}, grouped by {kategorie}."),
    words: L("Wie viele Artikel liegen je Kategorie im Lager? Eine Zeile je Kategorie mit Summe.", "How many items are in stock per category? One row per category with the sum."),
  },
  {
    sql: "SELECT {bestell_id}, SUM({menge}) FROM {positionen} GROUP BY {bestell_id};",
    prompt: L("Zeige je {bestell_id} aus {positionen} die Summe von {menge}, gruppiert nach {bestell_id}.", "Show per {bestell_id} from {positionen} the sum of {menge}, grouped by {bestell_id}."),
    words: L("Wie viele Stück umfasst jede Bestellung insgesamt? Eine Zeile je Bestellnummer mit Summe.", "How many pieces does each order comprise in total? One row per order number with the sum."),
  },
];

const JOIN_GROUPS: Array<{ sql: string; prompt: Localized; words: Localized }> = [
  {
    sql: "SELECT k.{nachname}, COUNT(*) FROM {bestellungen} b JOIN {kunden} k ON b.{kunden_id} = k.{kunden_id} GROUP BY k.{kunden_id};",
    prompt: L("Verbinde {bestellungen} mit {kunden} und zeige je Kunde {nachname} und COUNT(*), gruppiert nach {kunden_id}.", "Join {bestellungen} with {kunden} and show per customer {nachname} and COUNT(*), grouped by {kunden_id}."),
    words: L("Wie viele Bestellungen hat jeder Kunde, der bestellt hat? Nachname und Anzahl.", "How many orders does every customer who ordered have? Last name and count."),
  },
  {
    sql: "SELECT pos.{bestell_id}, SUM(p.{preis} * pos.{menge}) FROM {positionen} pos JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} GROUP BY pos.{bestell_id};",
    prompt: L("Verbinde {positionen} mit {produkte} und zeige je {bestell_id} die Summe von {preis} * {menge}, gruppiert nach {bestell_id}.", "Join {positionen} with {produkte} and show per {bestell_id} the sum of {preis} * {menge}, grouped by {bestell_id}."),
    words: L("Welchen Gesamtbetrag hat jede Bestellung? Bestellnummer und Betrag.", "What is the total amount of each order? Order number and amount."),
  },
  {
    sql: "SELECT p.{bezeichnung}, SUM(pos.{menge}) FROM {positionen} pos JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} GROUP BY p.{produkt_id};",
    prompt: L("Verbinde {positionen} mit {produkte} und zeige je Produkt {bezeichnung} und die Summe von {menge}, gruppiert nach {produkt_id}.", "Join {positionen} with {produkte} and show per product {bezeichnung} and the sum of {menge}, grouped by {produkt_id}."),
    words: L("Wie viele Stück wurden von jedem bestellten Produkt insgesamt bestellt? Name und Summe.", "How many pieces of every ordered product were ordered in total? Name and sum."),
  },
];

const HAVINGS: Array<{ sql: string; prompt: Localized; words: Localized }> = [
  {
    sql: "SELECT {kategorie}, COUNT(*) FROM {produkte} GROUP BY {kategorie} HAVING COUNT(*) > 2;",
    prompt: L("Zeige {kategorie} und COUNT(*) aus {produkte}, gruppiert nach {kategorie}, nur Gruppen mit COUNT(*) > 2.", "Show {kategorie} and COUNT(*) from {produkte}, grouped by {kategorie}, only groups with COUNT(*) > 2."),
    words: L("Welche Kategorien haben mehr als zwei Produkte? Kategorie und Anzahl.", "Which categories have more than two products? Category and count."),
  },
  {
    sql: "SELECT {ort}, COUNT(*) FROM {kunden} GROUP BY {ort} HAVING COUNT(*) >= 2;",
    prompt: L("Zeige {ort} und COUNT(*) aus {kunden}, gruppiert nach {ort}, nur Gruppen mit COUNT(*) >= 2.", "Show {ort} and COUNT(*) from {kunden}, grouped by {ort}, only groups with COUNT(*) >= 2."),
    words: L("In welchen Städten wohnen mindestens zwei Kunden? Stadt und Anzahl.", "In which cities do at least two customers live? City and count."),
  },
  {
    sql: "SELECT p.{bezeichnung}, SUM(pos.{menge}) FROM {positionen} pos JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} GROUP BY p.{produkt_id} HAVING SUM(pos.{menge}) >= 3;",
    prompt: L("Verbinde {positionen} mit {produkte}, zeige {bezeichnung} und SUM({menge}) je Produkt, nur Gruppen mit SUM({menge}) >= 3.", "Join {positionen} with {produkte}, show {bezeichnung} and SUM({menge}) per product, only groups with SUM({menge}) >= 3."),
    words: L("Welche Produkte wurden insgesamt mindestens dreimal bestellt (Stückzahl)? Name und Summe.", "Which products were ordered at least three times in total (pieces)? Name and sum."),
  },
];

const LESSON_REP_1: Lesson = {
  id: "rep-1-group-by",
  stageId: "stage-4-berichte",
  stepNumber: 1,
  module: "extra",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Berichte je Gruppe: GROUP BY und HAVING",
      subtitle: "Eine Kennzahl pro Kategorie, Kunde oder Bestellung; Gruppen filtern mit HAVING",
      whyItMatters:
        "„Umsatz pro Kunde“, „Produkte pro Kategorie“: Fast jeder Bericht fasst Zeilen zu Gruppen zusammen. GROUP BY ist das Werkzeug dafür, in jeder Datenbank und in jedem Dashboard.",
      explanationHtml: `
<p><code>GROUP BY</code> teilt die Zeilen in Gruppen mit gleichem Wert und liefert <strong>eine Ergebniszeile je Gruppe</strong>. Aggregatfunktionen rechnen dann innerhalb jeder Gruppe:</p>
<pre class="sql"><code>SELECT kategorie, COUNT(*) AS anzahl, AVG(preis) AS durchschnitt
FROM produkte
GROUP BY kategorie;</code></pre>
<p>Regel: Jede Spalte in der <code>SELECT</code>-Liste ist entweder in <code>GROUP BY</code> genannt oder steht in einer Aggregatfunktion. Gruppieren funktioniert auch über einen Join:</p>
<pre class="sql"><code>SELECT k.nachname, COUNT(*) AS bestellungen
FROM bestellungen b
JOIN kunden k ON b.kunden_id = k.kunden_id
GROUP BY k.kunden_id
HAVING COUNT(*) &gt;= 2
ORDER BY bestellungen DESC;</code></pre>
<p><code>WHERE</code> filtert Zeilen <em>vor</em> dem Gruppieren, <code>HAVING</code> filtert Gruppen <em>danach</em>, mit einer Bedingung an das Aggregat. <code>ORDER BY</code> darf den Alias der Kennzahl verwenden. Reihenfolge: <code>SELECT … FROM … JOIN … WHERE … GROUP BY … HAVING … ORDER BY …</code>.</p>`,
      syntax: [
        { name: "Eine Zeile je Gruppe", sql: "SELECT spalte, COUNT(*) FROM tabelle GROUP BY spalte;", note: "Auch SUM, AVG, MIN, MAX je Gruppe." },
        { name: "Gruppen filtern", sql: "GROUP BY spalte HAVING COUNT(*) >= 2", note: "WHERE filtert Zeilen vorher, HAVING Gruppen danach." },
      ],
      quiz: {
        question: "Worin unterscheiden sich WHERE und HAVING?",
        options: [
          "WHERE filtert einzelne Zeilen vor dem Gruppieren, HAVING filtert Gruppen anhand von Aggregaten danach",
          "HAVING ist nur ein anderes Wort für WHERE",
          "WHERE funktioniert nur mit Text, HAVING nur mit Zahlen",
        ],
        correctIndex: 0,
        explanation: "HAVING COUNT(*) >= 2 kann WHERE nicht ausdrücken, weil die Anzahl erst nach dem Gruppieren feststeht.",
      },
      lab: {
        title: "Sandbox: Gruppieren",
        intro: "Eine Ergebniszeile je Gruppe. Vergleiche mit und ohne HAVING.",
        goals: {
          g1: "Zeige je kategorie die Anzahl der Produkte (kategorie, COUNT(*)).",
          g2: "Zeige je status die Anzahl der Bestellungen (status, COUNT(*)).",
          g3: "Zeige nachname und Anzahl der Bestellungen aller Kunden mit mindestens zwei Bestellungen (JOIN, GROUP BY, HAVING).",
        },
      },
      celebrationMessage: "Du erstellst Berichte mit einer Kennzahl je Gruppe.",
    },
    {
      title: "Reports per group: GROUP BY and HAVING",
      subtitle: "One figure per category, customer or order; filtering groups with HAVING",
      whyItMatters:
        "“Revenue per customer”, “products per category”: almost every report combines rows into groups. GROUP BY is the tool for it, in every database and every dashboard.",
      explanationHtml: `
<p><code>GROUP BY</code> splits the rows into groups with equal values and returns <strong>one result row per group</strong>. Aggregate functions then compute within each group:</p>
<pre class="sql"><code>SELECT category, COUNT(*) AS count, AVG(price) AS average
FROM products
GROUP BY category;</code></pre>
<p>Rule: every column in the <code>SELECT</code> list is either named in <code>GROUP BY</code> or sits inside an aggregate function. Grouping also works across a join:</p>
<pre class="sql"><code>SELECT c.last_name, COUNT(*) AS orders
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.customer_id
HAVING COUNT(*) &gt;= 2
ORDER BY orders DESC;</code></pre>
<p><code>WHERE</code> filters rows <em>before</em> grouping, <code>HAVING</code> filters groups <em>afterwards</em>, with a condition on the aggregate. <code>ORDER BY</code> may use the alias of the figure. Order: <code>SELECT … FROM … JOIN … WHERE … GROUP BY … HAVING … ORDER BY …</code>.</p>`,
      syntax: [
        { name: "One row per group", sql: "SELECT column, COUNT(*) FROM table GROUP BY column;", note: "Also SUM, AVG, MIN, MAX per group." },
        { name: "Filter groups", sql: "GROUP BY column HAVING COUNT(*) >= 2", note: "WHERE filters rows before, HAVING groups after." },
      ],
      quiz: {
        question: "How do WHERE and HAVING differ?",
        options: [
          "WHERE filters single rows before grouping, HAVING filters groups by aggregates afterwards",
          "HAVING is just another word for WHERE",
          "WHERE only works with text, HAVING only with numbers",
        ],
        correctIndex: 0,
        explanation: "WHERE cannot express HAVING COUNT(*) >= 2, because the count is only known after grouping.",
      },
      lab: {
        title: "Sandbox: grouping",
        intro: "One result row per group. Compare with and without HAVING.",
        goals: {
          g1: "Show per category the number of products (category, COUNT(*)).",
          g2: "Show per status the number of orders (status, COUNT(*)).",
          g3: "Show last_name and number of orders of all customers with at least two orders (JOIN, GROUP BY, HAVING).",
        },
      },
      celebrationMessage: "You build reports with one figure per group.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT {kategorie}, COUNT(*) AS {anzahl}\nFROM {produkte}\nGROUP BY {kategorie};", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT {kategorie}, COUNT(*) FROM {produkte} GROUP BY {kategorie};")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT {status}, COUNT(*) FROM {bestellungen} GROUP BY {status};")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT k.{nachname}, COUNT(*) FROM {bestellungen} b JOIN {kunden} k ON b.{kunden_id} = k.{kunden_id} GROUP BY k.{kunden_id} HAVING COUNT(*) >= 2;")),
  ]),
  exercises: [
    {
      id: "gruppieren",
      make: (rng, level, locale) => {
        const pick = rng.pick(GROUPS);
        return queryTask(locale, level, {
          prompt: pick.prompt,
          prompt2: pick.words,
          hint: L("SELECT <Spalte>, <Aggregat> FROM <Tabelle> GROUP BY <Spalte>;", "SELECT <column>, <aggregate> FROM <table> GROUP BY <column>;"),
          sql: pick.sql,
        });
      },
    },
    {
      id: "gruppieren-join",
      make: (rng, level, locale) => {
        const pick = rng.pick(JOIN_GROUPS);
        return queryTask(locale, level, {
          prompt: pick.prompt,
          prompt2: pick.words,
          hint: L("SELECT …, <Aggregat> FROM a JOIN b ON … GROUP BY <Schlüssel>;", "SELECT …, <aggregate> FROM a JOIN b ON … GROUP BY <key>;"),
          sql: pick.sql,
        });
      },
    },
    {
      id: "having",
      make: (rng, level, locale) => {
        const pick = rng.pick(HAVINGS);
        return queryTask(locale, level, {
          prompt: pick.prompt,
          prompt2: pick.words,
          hint: L("… GROUP BY <Spalte> HAVING <Aggregat> <Operator> <Zahl>;", "… GROUP BY <column> HAVING <aggregate> <operator> <number>;"),
          sql: pick.sql,
        });
      },
    },
  ],
};

// ─── Lektion 17: LEFT JOIN ──────────────────────────────────────────────────

const LESSON_REP_2: Lesson = {
  id: "rep-2-left-join",
  stageId: "stage-4-berichte",
  stepNumber: 2,
  module: "extra",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Auch ohne Partner: LEFT JOIN und NULL",
      subtitle: "Kunden ohne Bestellung, Produkte ohne Verkauf, Zählungen mit 0",
      whyItMatters:
        "Ein INNER JOIN zeigt nur, was zusammenpasst. Die Frage „Wer hat noch nie bestellt?“ oder „Welches Produkt verkauft sich nicht?“ beantwortet erst der LEFT JOIN.",
      explanationHtml: `
<p>Ein <code>LEFT JOIN</code> behält <strong>alle Zeilen der linken Tabelle</strong>, auch wenn rechts kein Partner existiert. Die fehlenden Werte sind dann <code>NULL</code>:</p>
<pre class="sql"><code>SELECT k.nachname, b.bestell_id
FROM kunden k
LEFT JOIN bestellungen b ON b.kunden_id = k.kunden_id;</code></pre>
<p>Kunden ohne Bestellung erkennst du an <code>NULL</code> in der rechten Spalte. <code>IS NULL</code> prüft darauf (<code>= NULL</code> funktioniert nicht):</p>
<pre class="sql"><code>SELECT k.vorname, k.nachname
FROM kunden k
LEFT JOIN bestellungen b ON b.kunden_id = k.kunden_id
WHERE b.bestell_id IS NULL;</code></pre>
<p>Beim Zählen je Kunde zählt <code>COUNT(b.bestell_id)</code> nur echte Bestellungen und liefert 0 für Kunden ohne; <code>COUNT(*)</code> würde die NULL-Zeile als 1 zählen. <code>COALESCE(SUM(…), 0)</code> ersetzt ein NULL-Ergebnis durch 0.</p>
<pre class="sql"><code>SELECT k.nachname, COUNT(b.bestell_id) AS bestellungen
FROM kunden k
LEFT JOIN bestellungen b ON b.kunden_id = k.kunden_id
GROUP BY k.kunden_id;</code></pre>`,
      syntax: [
        { name: "Alle linken Zeilen behalten", sql: "FROM a LEFT JOIN b ON b.a_id = a.a_id", note: "Fehlende Partner werden NULL." },
        { name: "Ohne Partner", sql: "WHERE b.schluessel IS NULL", note: "Nie = NULL schreiben." },
        { name: "Mit 0 zählen", sql: "COUNT(b.schluessel)   COALESCE(SUM(x), 0)", note: "COUNT(spalte) zählt keine NULL." },
      ],
      quiz: {
        question: "Was liefert ein LEFT JOIN von kunden zu bestellungen für einen Kunden ohne Bestellung?",
        options: [
          "Eine Zeile mit den Kundendaten und NULL in den Spalten der Bestellung",
          "Gar keine Zeile, wie beim INNER JOIN",
          "Einen Fehler, weil der Fremdschlüssel fehlt",
        ],
        correctIndex: 0,
        explanation: "Die linke Tabelle bleibt vollständig; was rechts fehlt, wird NULL.",
      },
      lab: {
        title: "Sandbox: Fehlende Partner",
        intro: "Vergleiche JOIN und LEFT JOIN an denselben Tabellen.",
        goals: {
          g1: "Zeige nachname und bestell_id für alle Kunden, auch für Kunden ohne Bestellung (LEFT JOIN).",
          g2: "Zeige vorname und nachname der Kunden ohne Bestellung (IS NULL).",
          g3: "Zeige je Kunde nachname und die Anzahl seiner Bestellungen, mit 0 für Kunden ohne Bestellung.",
        },
      },
      celebrationMessage: "Du findest, was fehlt: Zeilen ohne Partner und Zählungen mit 0.",
    },
    {
      title: "Even without a partner: LEFT JOIN and NULL",
      subtitle: "Customers without orders, products without sales, counts with 0",
      whyItMatters:
        "An INNER JOIN shows only what matches. “Who has never ordered?” or “Which product does not sell?” is answered only by the LEFT JOIN.",
      explanationHtml: `
<p>A <code>LEFT JOIN</code> keeps <strong>all rows of the left table</strong>, even when there is no partner on the right. The missing values are then <code>NULL</code>:</p>
<pre class="sql"><code>SELECT c.last_name, o.order_id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id;</code></pre>
<p>Customers without orders show <code>NULL</code> in the right column. <code>IS NULL</code> tests for it (<code>= NULL</code> does not work):</p>
<pre class="sql"><code>SELECT c.first_name, c.last_name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;</code></pre>
<p>When counting per customer, <code>COUNT(o.order_id)</code> counts only real orders and gives 0 for customers without; <code>COUNT(*)</code> would count the NULL row as 1. <code>COALESCE(SUM(…), 0)</code> replaces a NULL result with 0.</p>
<pre class="sql"><code>SELECT c.last_name, COUNT(o.order_id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_id;</code></pre>`,
      syntax: [
        { name: "Keep all left rows", sql: "FROM a LEFT JOIN b ON b.a_id = a.a_id", note: "Missing partners become NULL." },
        { name: "Without a partner", sql: "WHERE b.key IS NULL", note: "Never write = NULL." },
        { name: "Count with 0", sql: "COUNT(b.key)   COALESCE(SUM(x), 0)", note: "COUNT(column) does not count NULL." },
      ],
      quiz: {
        question: "What does a LEFT JOIN from customers to orders return for a customer without orders?",
        options: [
          "One row with the customer's data and NULL in the order columns",
          "No row at all, like the INNER JOIN",
          "An error, because the foreign key is missing",
        ],
        correctIndex: 0,
        explanation: "The left table stays complete; what is missing on the right becomes NULL.",
      },
      lab: {
        title: "Sandbox: missing partners",
        intro: "Compare JOIN and LEFT JOIN on the same tables.",
        goals: {
          g1: "Show last_name and order_id for all customers, including customers without an order (LEFT JOIN).",
          g2: "Show first_name and last_name of the customers without an order (IS NULL).",
          g3: "Show per customer last_name and the number of their orders, with 0 for customers without an order.",
        },
      },
      celebrationMessage: "You find what is missing: rows without a partner and counts with 0.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT k.{nachname}, b.{bestell_id}\nFROM {kunden} k\nLEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id};", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT k.{nachname}, b.{bestell_id} FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id};")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT k.{vorname}, k.{nachname} FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} WHERE b.{bestell_id} IS NULL;")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT k.{nachname}, COUNT(b.{bestell_id}) FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} GROUP BY k.{kunden_id};")),
  ]),
  exercises: [
    {
      id: "ohne-partner",
      make: (rng, level, locale) => {
        const variant = rng.pick(["kunden", "produkte"]);
        if (variant === "kunden") {
          return queryTask(locale, level, {
            prompt: L(
              "Zeige {vorname} und {nachname} der Kunden ohne Zeile in {bestellungen} (LEFT JOIN über {kunden_id}, WHERE {bestell_id} IS NULL).",
              "Show {vorname} and {nachname} of the customers without a row in {bestellungen} (LEFT JOIN via {kunden_id}, WHERE {bestell_id} IS NULL).",
            ),
            prompt2: L("Welche Kunden haben noch nie bestellt? Zeige Vor- und Nachname.", "Which customers have never ordered? Show first and last name."),
            hint: L("SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK> WHERE b.<PK> IS NULL;", "SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK> WHERE b.<PK> IS NULL;"),
            sql: "SELECT k.{vorname}, k.{nachname} FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} WHERE b.{bestell_id} IS NULL;",
            meta: { variant, expected: CUSTOMERS_WITHOUT_ORDERS.length },
          });
        }
        return queryTask(locale, level, {
          prompt: L(
            "Zeige die {bezeichnung} der Produkte ohne Zeile in {positionen} (LEFT JOIN über {produkt_id}, WHERE {position_id} IS NULL).",
            "Show the {bezeichnung} of the products without a row in {positionen} (LEFT JOIN via {produkt_id}, WHERE {position_id} IS NULL).",
          ),
          prompt2: L("Welche Produkte wurden noch nie bestellt? Zeige ihre Namen.", "Which products have never been ordered? Show their names."),
          hint: L("SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK> WHERE b.<PK> IS NULL;", "SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK> WHERE b.<PK> IS NULL;"),
          sql: "SELECT p.{bezeichnung} FROM {produkte} p LEFT JOIN {positionen} pos ON pos.{produkt_id} = p.{produkt_id} WHERE pos.{position_id} IS NULL;",
          meta: { variant },
        });
      },
    },
    {
      id: "alle-mit-null",
      make: (rng, level, locale) => {
        const variant = rng.pick(["kunden", "produkte"]);
        if (variant === "kunden") {
          return queryTask(locale, level, {
            prompt: L(
              "Zeige {nachname} und {bestelldatum} für alle Kunden, mit NULL für Kunden ohne Bestellung (LEFT JOIN von {kunden} zu {bestellungen}).",
              "Show {nachname} and {bestelldatum} for all customers, with NULL for customers without an order (LEFT JOIN from {kunden} to {bestellungen}).",
            ),
            prompt2: L(
              "Eine Liste aller Kunden mit dem Datum jeder ihrer Bestellungen; Kunden ohne Bestellung erscheinen trotzdem, mit leerem Datum.",
              "A list of all customers with the date of each of their orders; customers without an order still appear, with an empty date.",
            ),
            hint: L("SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK>;", "SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK>;"),
            sql: "SELECT k.{nachname}, b.{bestelldatum} FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id};",
            meta: { variant },
          });
        }
        return queryTask(locale, level, {
          prompt: L(
            "Zeige {bezeichnung} und {menge} für alle Produkte, mit NULL für Produkte ohne Position (LEFT JOIN von {produkte} zu {positionen}).",
            "Show {bezeichnung} and {menge} for all products, with NULL for products without an item (LEFT JOIN from {produkte} to {positionen}).",
          ),
          prompt2: L(
            "Eine Liste aller Produkte mit der Menge jeder Bestellposition; Produkte ohne Position erscheinen trotzdem, mit leerer Menge.",
            "A list of all products with the quantity of every order item; products without an item still appear, with an empty quantity.",
          ),
          hint: L("SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK>;", "SELECT … FROM a LEFT JOIN b ON b.<FK> = a.<PK>;"),
          sql: "SELECT p.{bezeichnung}, pos.{menge} FROM {produkte} p LEFT JOIN {positionen} pos ON pos.{produkt_id} = p.{produkt_id};",
          meta: { variant },
        });
      },
    },
    {
      id: "zaehlen-mit-null",
      make: (rng, level, locale) => {
        const variant = rng.pick(["kunden", "produkte"]);
        if (variant === "kunden") {
          return queryTask(locale, level, {
            prompt: L(
              "Zeige je Kunde {nachname} und COUNT({bestell_id}) über einen LEFT JOIN von {kunden} zu {bestellungen}, gruppiert nach {kunden_id}.",
              "Show per customer {nachname} and COUNT({bestell_id}) via a LEFT JOIN from {kunden} to {bestellungen}, grouped by {kunden_id}.",
            ),
            prompt2: L(
              "Wie viele Bestellungen hat jeder Kunde? Auch Kunden ohne Bestellung erscheinen, mit 0.",
              "How many orders does every customer have? Customers without an order appear too, with 0.",
            ),
            hint: L("SELECT a.<Spalte>, COUNT(b.<PK>) FROM a LEFT JOIN b ON … GROUP BY a.<PK>;", "SELECT a.<column>, COUNT(b.<PK>) FROM a LEFT JOIN b ON … GROUP BY a.<PK>;"),
            sql: "SELECT k.{nachname}, COUNT(b.{bestell_id}) FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} GROUP BY k.{kunden_id};",
            meta: { variant },
          });
        }
        return queryTask(locale, level, {
          prompt: L(
            "Zeige je Produkt {bezeichnung} und COALESCE(SUM({menge}), 0) über einen LEFT JOIN von {produkte} zu {positionen}, gruppiert nach {produkt_id}.",
            "Show per product {bezeichnung} and COALESCE(SUM({menge}), 0) via a LEFT JOIN from {produkte} to {positionen}, grouped by {produkt_id}.",
          ),
          prompt2: L(
            "Wie viele Stück wurden von jedem Produkt bestellt? Auch nie bestellte Produkte erscheinen, mit 0.",
            "How many pieces of every product were ordered? Never ordered products appear too, with 0.",
          ),
          hint: L("SELECT a.<Spalte>, COALESCE(SUM(b.<Spalte>), 0) FROM a LEFT JOIN b ON … GROUP BY a.<PK>;", "SELECT a.<column>, COALESCE(SUM(b.<column>), 0) FROM a LEFT JOIN b ON … GROUP BY a.<PK>;"),
          sql: "SELECT p.{bezeichnung}, COALESCE(SUM(pos.{menge}), 0) FROM {produkte} p LEFT JOIN {positionen} pos ON pos.{produkt_id} = p.{produkt_id} GROUP BY p.{produkt_id};",
          meta: { variant },
        });
      },
    },
  ],
};

// ─── Lektion 18: Daten eingeben, ändern, löschen ────────────────────────────

const CONSTRAINTS: Array<{ scenario: Localized; answer: number }> = [
  { scenario: L("Ein Produkt soll nie ohne Bezeichnung gespeichert werden.", "A product must never be stored without a name."), answer: 0 },
  { scenario: L("Zwei Kunden dürfen nicht dieselbe E-Mail-Adresse haben.", "Two customers must not have the same e-mail address."), answer: 1 },
  { scenario: L("Ein Preis darf nicht negativ sein.", "A price must not be negative."), answer: 2 },
  { scenario: L("Wird beim Anlegen kein Newsletter-Wert angegeben, soll automatisch 0 gespeichert werden.", "If no newsletter value is given when creating a record, 0 should be stored automatically."), answer: 3 },
  { scenario: L("Die Menge einer Bestellposition muss größer als 0 sein.", "The quantity of an order item must be greater than 0."), answer: 2 },
  { scenario: L("Jede Bestellung muss einen Kunden haben; das Feld darf nicht leer bleiben.", "Every order must have a customer; the field must not stay empty."), answer: 0 },
];

const UPDATES: Array<{ sql: string; prompt: Localized; words: Localized; tables: string[] }> = [
  ...PRODUCTS.slice(0, 6).map((p) => {
    const newPrice = Math.round(p.preis * 0.9 * 100) / 100;
    return {
      sql: `UPDATE {produkte} SET {preis} = ${newPrice} WHERE {produkt_id} = ${p.id};`,
      prompt: L(`Setze in {produkte} den {preis} der Zeile mit {produkt_id} ${p.id} auf ${newPrice}.`, `Set in {produkte} the {preis} of the row with {produkt_id} ${p.id} to ${newPrice}.`),
      words: L(`Das Produkt {${p.name}} (Nummer ${p.id}) wird günstiger: Der neue Preis ist ${newPrice} Euro.`, `The product {${p.name}} (number ${p.id}) gets cheaper: the new price is ${newPrice} euros.`),
      tables: ["{produkte}"],
    };
  }),
  ...ORDERS.filter((o) => o.status === "offen").map((o) => ({
    sql: `UPDATE {bestellungen} SET {status} = '{versendet}' WHERE {bestell_id} = ${o.id};`,
    prompt: L(`Setze in {bestellungen} den {status} der Zeile mit {bestell_id} ${o.id} auf {versendet}.`, `Set in {bestellungen} the {status} of the row with {bestell_id} ${o.id} to {versendet}.`),
    words: L(`Die Bestellung ${o.id} hat das Lager verlassen. Setze ihren Status auf {versendet}.`, `Order ${o.id} has left the warehouse. Set its status to {versendet}.`),
    tables: ["{bestellungen}"],
  })),
  ...CUSTOMERS.slice(0, 4).map((c) => ({
    sql: `UPDATE {kunden} SET {ort} = 'Erlangen', {plz} = '91054' WHERE {kunden_id} = ${c.id};`,
    prompt: L(`Setze in {kunden} für die Zeile mit {kunden_id} ${c.id} den {ort} auf 'Erlangen' und die {plz} auf '91054'.`, `Set in {kunden} for the row with {kunden_id} ${c.id} the {ort} to 'Erlangen' and the {plz} to '91054'.`),
    words: L(`${c.vorname} ${c.nachname} (Kundennummer ${c.id}) zieht nach 91054 Erlangen um. Ändere Ort und Postleitzahl.`, `${c.vorname} ${c.nachname} (customer number ${c.id}) moves to 91054 Erlangen. Change city and postcode.`),
    tables: ["{kunden}"],
  })),
];

const DELETES: Array<{ sql: string; prompt: Localized; words: Localized; tables: string[] }> = [
  {
    sql: "DELETE FROM {positionen} WHERE {position_id} = 22;",
    prompt: L("Lösche aus {positionen} die Zeile mit {position_id} 22.", "Delete from {positionen} the row with {position_id} 22."),
    words: L("Die Bestellposition 22 wurde irrtümlich angelegt. Entferne sie.", "Order item 22 was created by mistake. Remove it."),
    tables: ["{positionen}"],
  },
  {
    sql: "DELETE FROM {positionen} WHERE {bestell_id} = 105;\nDELETE FROM {bestellungen} WHERE {bestell_id} = 105;",
    prompt: L("Lösche aus {positionen} alle Zeilen mit {bestell_id} 105 und danach aus {bestellungen} die Zeile mit {bestell_id} 105.", "Delete from {positionen} all rows with {bestell_id} 105 and afterwards from {bestellungen} the row with {bestell_id} 105."),
    words: L("Die stornierte Bestellung 105 soll ganz verschwinden: zuerst ihre Positionen, dann die Bestellung selbst.", "The cancelled order 105 should disappear completely: first its items, then the order itself."),
    tables: ["{positionen}", "{bestellungen}"],
  },
  {
    sql: "DELETE FROM {kunden} WHERE {kunden_id} = 13;",
    prompt: L("Lösche aus {kunden} die Zeile mit {kunden_id} 13.", "Delete from {kunden} the row with {kunden_id} 13."),
    words: L("Moritz Klein (Kundennummer 13) hat sein Konto gekündigt und nie bestellt. Entferne ihn.", "Moritz Klein (customer number 13) closed his account and never ordered. Remove him."),
    tables: ["{kunden}"],
  },
  {
    sql: "DELETE FROM {positionen} WHERE {bestell_id} = 114 AND {produkt_id} = 4;",
    prompt: L("Lösche aus {positionen} die Zeile mit {bestell_id} 114 und {produkt_id} 4.", "Delete from {positionen} the row with {bestell_id} 114 and {produkt_id} 4."),
    words: L("Aus der offenen Bestellung 114 soll der Artikel {Kopfhörer} gestrichen werden. Entferne die passende Position.", "The item {Kopfhörer} is to be removed from the open order 114. Delete the matching order item."),
    tables: ["{positionen}"],
  },
];

const LESSON_DML_1: Lesson = {
  id: "dml-1-einfuegen-aendern",
  stageId: "stage-4-berichte",
  stepNumber: 3,
  module: "2.3.2",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Daten ändern und löschen, Eingaben prüfen",
      subtitle: "UPDATE und DELETE mit WHERE; Formulare und Integritätsregeln: NOT NULL, UNIQUE, CHECK, DEFAULT",
      whyItMatters:
        "Ein UPDATE ohne WHERE ändert jede Zeile, ein DELETE ohne WHERE leert die Tabelle. Und ein Formular ist nur so gut wie die Regeln, die falsche Eingaben abfangen, bevor sie in der Datenbank landen.",
      explanationHtml: `
<p><code>UPDATE</code> ändert Werte vorhandener Zeilen, <code>DELETE</code> entfernt Zeilen. Beide brauchen fast immer ein <code>WHERE</code>, sonst treffen sie die ganze Tabelle:</p>
<pre class="sql"><code>UPDATE produkte SET preis = 8.99 WHERE produkt_id = 5;
DELETE FROM positionen WHERE position_id = 22;</code></pre>
<p>Beim Löschen gilt die referenzielle Integrität: Eine Bestellung, auf die noch Positionen verweisen, lässt sich nicht löschen. Erst die Positionen, dann die Bestellung.</p>
<p>Ein <strong>Formular</strong> hat zwei Aufgaben: Eingaben <strong>validieren</strong> und <strong>speichern</strong>. Die Validierung prüft Pflichtfelder, Format und Wertebereich, bevor <code>INSERT</code> oder <code>UPDATE</code> ausgeführt wird. Die Datenbank sichert dieselben Regeln als <strong>Integritätsregeln</strong> ab, damit sie auch gelten, wenn das Formular umgangen wird:</p>
<ul>
  <li><code>NOT NULL</code>: das Feld darf nicht leer bleiben (Pflichtfeld).</li>
  <li><code>UNIQUE</code>: kein Wert doppelt, zum Beispiel eine E-Mail-Adresse.</li>
  <li><code>CHECK (preis &gt;= 0)</code>: der Wert muss eine Bedingung erfüllen.</li>
  <li><code>DEFAULT 0</code>: ein Vorgabewert, wenn nichts angegeben wird.</li>
</ul>
<p>Wird eine Regel verletzt, lehnt das DBMS die Anweisung ab, etwa mit <code>CHECK constraint failed</code> oder <code>NOT NULL constraint failed</code>. Probier es in der Sandbox.</p>`,
      syntax: [
        { name: "Werte ändern", sql: "UPDATE tabelle SET spalte = wert, spalte2 = wert2 WHERE bedingung;", note: "Ohne WHERE: alle Zeilen." },
        { name: "Zeilen löschen", sql: "DELETE FROM tabelle WHERE bedingung;", note: "Erst abhängige Zeilen, dann die referenzierte." },
        { name: "Regeln beim Anlegen", sql: "spalte TEXT NOT NULL UNIQUE   preis REAL CHECK (preis >= 0)   newsletter INTEGER DEFAULT 0", note: "Validierung in der Datenbank." },
      ],
      quiz: {
        question: "Was passiert bei UPDATE produkte SET preis = 1 ohne WHERE?",
        options: ["Jedes Produkt kostet danach 1", "Nur das erste Produkt kostet 1", "Ein Syntaxfehler"],
        correctIndex: 0,
        explanation: "Ohne WHERE gilt die Änderung für alle Zeilen. Deshalb zuerst mit SELECT prüfen, welche Zeilen die Bedingung trifft.",
      },
      lab: {
        title: "Sandbox: Ändern, löschen, Regeln",
        intro: "Prüfe mit SELECT, bevor du änderst oder löschst.",
        goals: {
          g1: "Setze den preis des Produkts mit produkt_id 5 auf 8.99.",
          g2: "Versuche, ein Produkt mit negativem Preis einzufügen, und lies den CHECK-Fehler.",
          g3: "Lösche die stornierte Bestellung 105 vollständig: zuerst ihre Positionen, dann die Bestellung.",
        },
      },
      celebrationMessage: "Du pflegst Daten sicher und weißt, welche Regeln Eingaben prüfen.",
    },
    {
      title: "Changing and deleting data, validating input",
      subtitle: "UPDATE and DELETE with WHERE; forms and integrity rules: NOT NULL, UNIQUE, CHECK, DEFAULT",
      whyItMatters:
        "An UPDATE without WHERE changes every row, a DELETE without WHERE empties the table. And a form is only as good as the rules that catch wrong input before it lands in the database.",
      explanationHtml: `
<p><code>UPDATE</code> changes values of existing rows, <code>DELETE</code> removes rows. Both almost always need a <code>WHERE</code>, otherwise they hit the whole table:</p>
<pre class="sql"><code>UPDATE products SET price = 8.99 WHERE product_id = 5;
DELETE FROM order_items WHERE item_id = 22;</code></pre>
<p>Referential integrity applies to deleting: an order that items still refer to cannot be deleted. First the items, then the order.</p>
<p>A <strong>form</strong> has two jobs: <strong>validate</strong> input and <strong>save</strong> it. Validation checks required fields, format and value range before <code>INSERT</code> or <code>UPDATE</code> runs. The database secures the same rules as <strong>integrity constraints</strong>, so they also hold when the form is bypassed:</p>
<ul>
  <li><code>NOT NULL</code>: the field must not stay empty (required field).</li>
  <li><code>UNIQUE</code>: no value twice, for example an e-mail address.</li>
  <li><code>CHECK (price &gt;= 0)</code>: the value must satisfy a condition.</li>
  <li><code>DEFAULT 0</code>: a default when nothing is given.</li>
</ul>
<p>When a rule is violated the DBMS refuses the statement, for example with <code>CHECK constraint failed</code> or <code>NOT NULL constraint failed</code>. Try it in the sandbox.</p>`,
      syntax: [
        { name: "Change values", sql: "UPDATE table SET column = value, column2 = value2 WHERE condition;", note: "Without WHERE: all rows." },
        { name: "Delete rows", sql: "DELETE FROM table WHERE condition;", note: "Dependent rows first, then the referenced one." },
        { name: "Rules when creating", sql: "column TEXT NOT NULL UNIQUE   price REAL CHECK (price >= 0)   newsletter INTEGER DEFAULT 0", note: "Validation in the database." },
      ],
      quiz: {
        question: "What happens with UPDATE products SET price = 1 without WHERE?",
        options: ["Every product costs 1 afterwards", "Only the first product costs 1", "A syntax error"],
        correctIndex: 0,
        explanation: "Without WHERE the change applies to all rows. So first check with SELECT which rows the condition hits.",
      },
      lab: {
        title: "Sandbox: change, delete, rules",
        intro: "Check with SELECT before you change or delete.",
        goals: {
          g1: "Set the price of the product with product_id 5 to 8.99.",
          g2: "Try to insert a product with a negative price and read the CHECK error.",
          g3: "Delete the cancelled order 105 completely: first its items, then the order.",
        },
      },
      celebrationMessage: "You maintain data safely and know which rules check input.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT * FROM {produkte} WHERE {produkt_id} = 5;", [
    goal("g1", (ctx) => {
      const price = scalarNow(ctx, "SELECT {preis} FROM {produkte} WHERE {produkt_id} = 5;");
      return typeof price === "number" && Math.abs(price - 8.99) < 0.001;
    }),
    goal("g2", (ctx) => lastErrorIncludes(ctx, "CHECK constraint failed")),
    goal("g3", (ctx) => countNow(ctx, "SELECT COUNT(*) FROM {bestellungen} WHERE {bestell_id} = 105;") === 0),
  ]),
  exercises: [
    {
      id: "aendern",
      make: (rng, level, locale) => {
        const pick = rng.pick(UPDATES);
        return mutationTask(locale, level, {
          prompt: pick.prompt,
          prompt2: pick.words,
          hint: L("UPDATE <Tabelle> SET <Spalte> = <Wert> WHERE <Schlüssel> = <Zahl>;", "UPDATE <table> SET <column> = <value> WHERE <key> = <number>;"),
          sql: pick.sql,
          verifyTables: pick.tables,
        });
      },
    },
    {
      id: "loeschen",
      make: (rng, level, locale) => {
        const pick = rng.pick(DELETES);
        return mutationTask(locale, level, {
          prompt: pick.prompt,
          prompt2: pick.words,
          hint: L("DELETE FROM <Tabelle> WHERE <Bedingung>;   (abhängige Zeilen zuerst)", "DELETE FROM <table> WHERE <condition>;   (dependent rows first)"),
          sql: pick.sql,
          verifyTables: pick.tables,
        });
      },
    },
    {
      id: "regel",
      make: (rng, _level, locale) => {
        const pick = rng.pick(CONSTRAINTS);
        return choiceTask(locale, rng, {
          prompt: L(`${pick.scenario.de} Welche Integritätsregel setzt das um?`, `${pick.scenario.en} Which integrity rule implements that?`),
          options: L(["NOT NULL", "UNIQUE", "CHECK (…)", "DEFAULT …"], ["NOT NULL", "UNIQUE", "CHECK (…)", "DEFAULT …"]),
          correctIndex: pick.answer,
          explanation: L(
            "NOT NULL: Pflichtfeld. UNIQUE: kein Wert doppelt. CHECK: Bedingung an den Wert. DEFAULT: Vorgabewert, wenn nichts angegeben wird.",
            "NOT NULL: required field. UNIQUE: no value twice. CHECK: condition on the value. DEFAULT: default when nothing is given.",
          ),
        });
      },
    },
  ],
};

export const STAGE_BERICHTE: Stage = {
  id: "stage-4-berichte",
  stageNumber: 4,
  icon: "📊",
  accent: "#be185d",
  text: L(
    {
      title: "Berichte und Datenpflege",
      subtitle: "GROUP BY und HAVING, LEFT JOIN, UPDATE und DELETE, Integritätsregeln",
      badgeTitle: "Datenverwalterin / Datenverwalter",
      moduleLabel: "IT 2.3.2 Datenbanksysteme II · Zusatz für Entwickler",
    },
    {
      title: "Reports and data maintenance",
      subtitle: "GROUP BY and HAVING, LEFT JOIN, UPDATE and DELETE, integrity rules",
      badgeTitle: "Data steward",
      moduleLabel: "IT 2.3.2 Database systems II · extra for developers",
    },
  ),
  lessons: [LESSON_REP_1, LESSON_REP_2, LESSON_DML_1],
};
