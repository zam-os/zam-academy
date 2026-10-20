import { CUSTOMERS } from "../db/dataset";
import { money } from "../exercises/format";
import { countNow, lastErrorIncludes, lastResultEquals, tableHasColumns } from "../lab/goals";
import type { Lesson, Localized, Stage } from "../model/types";
import { choiceTask, goal, L, mutationTask, queryTask, SHOP, sqlLab } from "./helpers";

// ─── Lektion 1: Datenbanksystem ─────────────────────────────────────────────

const OBJECT_SCENARIOS: Array<{ scenario: Localized; answer: number }> = [
  {
    scenario: L(
      "Eine Mitarbeiterin tippt einen neuen Kunden in eine Eingabemaske, die prüft, ob die Postleitzahl fünf Ziffern hat, und speichert ihn dann.",
      "An employee types a new customer into an input mask that checks whether the postcode has five digits and then saves it.",
    ),
    answer: 2,
  },
  {
    scenario: L(
      "Die Chefin möchte eine gedruckte Übersicht: der Umsatz jedes Monats, Summen inklusive.",
      "The manager wants a printed overview: the revenue of every month, totals included.",
    ),
    answer: 3,
  },
  {
    scenario: L(
      "Es sollen alle Kunden aus Ulm ermittelt werden, die den Newsletter bekommen.",
      "All customers from Ulm who receive the newsletter are to be found.",
    ),
    answer: 1,
  },
  {
    scenario: L(
      "Hier liegen alle Produkte gespeichert, jedes in einer Zeile, jede Eigenschaft in einer Spalte.",
      "Here every product is stored, one per row, each property in a column.",
    ),
    answer: 0,
  },
];

const TERM_SCENARIOS: Array<{ scenario: Localized; answer: number }> = [
  {
    scenario: L(
      "Die Software, die Daten speichert, Regeln prüft und Abfragen beantwortet, zum Beispiel SQLite oder MySQL, heißt …",
      "The software that stores data, checks rules and answers queries, for example SQLite or MySQL, is called …",
    ),
    answer: 1,
  },
  {
    scenario: L(
      "Eine geordnete Sammlung zusammengehöriger Daten, zum Beispiel alle Kunden, Produkte und Bestellungen eines Shops, heißt …",
      "An organised collection of related data, for example all customers, products and orders of a shop, is called …",
    ),
    answer: 0,
  },
  {
    scenario: L(
      "Datenbank und Datenbankmanagementsystem zusammen heißen …",
      "The database and the database management system together are called …",
    ),
    answer: 2,
  },
];

const TABLE_WORDS: Record<string, Localized> = {
  kunden: L("alle Kunden", "all customers"),
  produkte: L("alle Produkte", "all products"),
  bestellungen: L("alle Bestellungen", "all orders"),
  positionen: L(
    "alle Bestellpositionen, also welche Produkte in welcher Menge zu welcher Bestellung gehören",
    "all order items, that is which products belong to which order in which quantity",
  ),
};

const LESSON_DB_1: Lesson = {
  id: "db-1-datenbanksystem",
  stageId: "stage-1-tabellen",
  stepNumber: 1,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Was ein Datenbanksystem ist",
      subtitle: "Datenbank, Datenbankmanagementsystem und die vier Objekte Tabelle, Abfrage, Formular, Bericht",
      whyItMatters:
        "Ob Onlineshop, Schülerverwaltung oder Streaming-Dienst: Fast jede App bewahrt ihre Daten in einer Datenbank auf. Wer ihren Aufbau versteht, findet Daten gezielt, statt zu suchen.",
      explanationHtml: `
<p>Eine <strong>Datenbank</strong> ist eine geordnete Sammlung zusammengehöriger Daten, zum Beispiel alle Kunden, Produkte und Bestellungen eines Onlineshops. Das <strong>Datenbankmanagementsystem (DBMS)</strong> ist das Programm, das diese Daten verwaltet: Es speichert sie, prüft Regeln, beantwortet Abfragen und lässt viele Nutzer gleichzeitig arbeiten. Datenbank und DBMS zusammen heißen <strong>Datenbanksystem</strong>. Bekannte DBMS sind SQLite (läuft hier in deinem Browser), MySQL, PostgreSQL, Microsoft Access und Oracle.</p>
<p>In einer <strong>relationalen</strong> Datenbank liegen die Daten in <strong>Tabellen</strong>. Vier Arten von Objekten begegnen dir in jedem Datenbanksystem:</p>
<ul>
  <li><strong>Tabelle</strong>: speichert die Daten in Zeilen und Spalten.</li>
  <li><strong>Abfrage</strong>: holt gezielt Daten aus Tabellen, in SQL mit <code>SELECT</code>.</li>
  <li><strong>Formular</strong>: Eingabemaske, über die Daten geprüft und gespeichert werden.</li>
  <li><strong>Bericht</strong>: Auswertung zum Lesen oder Drucken, etwa „Umsatz pro Monat“.</li>
</ul>
<p>Typische Einsatzgebiete: Onlineshops (Kunden, Produkte, Bestellungen), Schulverwaltung (Schüler, Klassen, Noten), Bibliotheken (Bücher, Ausleihen), Fahrplanauskunft, Streaming-Dienste.</p>
<p>Deine erste Abfrage zeigt eine ganze Tabelle. Der Stern <code>*</code> steht für „alle Spalten“, das Semikolon schließt die Anweisung ab:</p>
<pre class="sql"><code>SELECT * FROM kunden;</code></pre>
<p>Die Sandbox rechts enthält den Datenbestand eines kleinen Onlineshops mit den Tabellen <code>kunden</code>, <code>produkte</code>, <code>bestellungen</code> und <code>positionen</code>. Probier es aus: Ein Klick auf einen Tabellennamen setzt die Abfrage in den Editor.</p>`,
      syntax: [
        {
          name: "Alle Spalten einer Tabelle",
          sql: "SELECT * FROM tabelle;",
          note: "Der Stern steht für alle Spalten; das Semikolon schließt die Anweisung ab.",
        },
      ],
      quiz: {
        question: "Welches Programm verwaltet die Daten einer Datenbank, prüft Regeln und beantwortet Abfragen?",
        options: ["Das Datenbankmanagementsystem (DBMS)", "Die Tabelle", "Der Bericht"],
        correctIndex: 0,
        explanation: "Das DBMS ist die Software. Tabellen enthalten die Daten, Berichte werten sie aus.",
      },
      lab: {
        title: "Sandbox: Den Shop erkunden",
        intro: "Führe Abfragen gegen die Datenbank aus. Klick links auf einen Tabellennamen oder schreib selbst.",
        goals: {
          g1: "Zeige die ganze Tabelle produkte an.",
          g2: "Zeige die ganze Tabelle bestellungen an.",
          g3: "Zeige die ganze Tabelle positionen an und finde heraus, wie viele Zeilen sie hat.",
        },
      },
      celebrationMessage: "Du weißt, was ein Datenbanksystem ist, und hast deine erste Abfrage geschrieben.",
    },
    {
      title: "What a database system is",
      subtitle: "Database, database management system and the four objects table, query, form, report",
      whyItMatters:
        "Online shop, school administration or streaming service: almost every app keeps its data in a database. Those who understand how it is built find data on purpose instead of searching.",
      explanationHtml: `
<p>A <strong>database</strong> is an organised collection of related data, for example all customers, products and orders of an online shop. The <strong>database management system (DBMS)</strong> is the program that manages this data: it stores it, checks rules, answers queries and lets many users work at the same time. Database and DBMS together are the <strong>database system</strong>. Well-known DBMS are SQLite (running here in your browser), MySQL, PostgreSQL, Microsoft Access and Oracle.</p>
<p>In a <strong>relational</strong> database the data lives in <strong>tables</strong>. Four kinds of objects meet you in every database system:</p>
<ul>
  <li><strong>Table</strong>: stores the data in rows and columns.</li>
  <li><strong>Query</strong>: fetches data from tables on purpose, in SQL with <code>SELECT</code>.</li>
  <li><strong>Form</strong>: an input mask through which data is checked and saved.</li>
  <li><strong>Report</strong>: an evaluation to read or print, such as “revenue per month”.</li>
</ul>
<p>Typical uses: online shops (customers, products, orders), school administration (students, classes, grades), libraries (books, loans), timetable information, streaming services.</p>
<p>Your first query shows a whole table. The star <code>*</code> stands for “all columns”, the semicolon ends the statement:</p>
<pre class="sql"><code>SELECT * FROM customers;</code></pre>
<p>The sandbox on the right holds the data of a small online shop with the tables <code>customers</code>, <code>products</code>, <code>orders</code> and <code>order_items</code>. Try it: a click on a table name puts the query into the editor.</p>`,
      syntax: [
        {
          name: "All columns of a table",
          sql: "SELECT * FROM table;",
          note: "The star stands for all columns; the semicolon ends the statement.",
        },
      ],
      quiz: {
        question: "Which program manages the data of a database, checks rules and answers queries?",
        options: ["The database management system (DBMS)", "The table", "The report"],
        correctIndex: 0,
        explanation: "The DBMS is the software. Tables hold the data, reports evaluate it.",
      },
      lab: {
        title: "Sandbox: explore the shop",
        intro: "Run queries against the database. Click a table name on the left or write your own.",
        goals: {
          g1: "Show the whole table products.",
          g2: "Show the whole table orders.",
          g3: "Show the whole table order_items and find out how many rows it has.",
        },
      },
      celebrationMessage: "You know what a database system is and have written your first query.",
    },
  ),
  lab: sqlLab(SHOP, "SELECT * FROM {kunden};", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT * FROM {produkte};")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT * FROM {bestellungen};")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT * FROM {positionen};")),
  ]),
  exercises: [
    {
      id: "ganze-tabelle",
      make: (rng, level, locale) => {
        const table = rng.pick(["kunden", "produkte", "bestellungen", "positionen"]);
        const words = TABLE_WORDS[table];
        return queryTask(locale, level, {
          prompt: L(
            `Zeige alle Datensätze der Tabelle {${table}} mit allen Spalten.`,
            `Show every record of the table {${table}} with all its columns.`,
          ),
          prompt2: L(
            `Der Shop will ${words.de} sehen, mit allen gespeicherten Angaben. Finde die passende Tabelle in der Übersicht und zeige sie vollständig an.`,
            `The shop wants to see ${words.en}, with everything stored about them. Find the right table in the overview and show it completely.`,
          ),
          hint: L("SELECT * FROM <Tabelle>;", "SELECT * FROM <table>;"),
          sql: `SELECT * FROM {${table}};`,
          meta: { table },
        });
      },
    },
    {
      id: "objektart",
      make: (rng, _level, locale) => {
        const pick = rng.pick(OBJECT_SCENARIOS);
        return choiceTask(locale, rng, {
          prompt: L(
            `${pick.scenario.de} Um welche Art von Objekt eines Datenbanksystems geht es?`,
            `${pick.scenario.en} Which kind of database object is this about?`,
          ),
          options: L(["Tabelle", "Abfrage", "Formular", "Bericht"], ["Table", "Query", "Form", "Report"]),
          correctIndex: pick.answer,
          explanation: L(
            "Tabellen speichern, Abfragen holen gezielt Daten, Formulare prüfen und speichern Eingaben, Berichte werten zum Lesen oder Drucken aus.",
            "Tables store, queries fetch data on purpose, forms check and save input, reports evaluate for reading or printing.",
          ),
        });
      },
    },
    {
      id: "begriffe",
      make: (rng, _level, locale) => {
        const pick = rng.pick(TERM_SCENARIOS);
        return choiceTask(locale, rng, {
          prompt: pick.scenario,
          options: L(
            ["Datenbank", "Datenbankmanagementsystem (DBMS)", "Datenbanksystem"],
            ["database", "database management system (DBMS)", "database system"],
          ),
          correctIndex: pick.answer,
          explanation: L(
            "Die Datenbank sind die Daten, das DBMS ist die Software, beides zusammen ist das Datenbanksystem.",
            "The database is the data, the DBMS is the software, both together are the database system.",
          ),
        });
      },
    },
  ],
};

// ─── Lektion 2: Tabelle, Datensatz, Datenfeld ───────────────────────────────

const COLUMN_SETS: Array<{ table: string; columns: string[]; words: Localized }> = [
  { table: "kunden", columns: ["vorname", "nachname"], words: L("die Vor- und Nachnamen aller Kunden, sonst nichts", "the first and last names of all customers, nothing else") },
  { table: "kunden", columns: ["nachname", "ort"], words: L("von jedem Kunden Nachname und Wohnort", "the last name and city of every customer") },
  { table: "kunden", columns: ["vorname", "nachname", "ort"], words: L("für einen Serienbrief Vorname, Nachname und Wohnort aller Kunden", "first name, last name and city of all customers for a mail merge") },
  { table: "produkte", columns: ["bezeichnung", "preis"], words: L("jedes Produkt mit seinem Preis, sonst nichts", "every product with its price, nothing else") },
  { table: "produkte", columns: ["bezeichnung", "lagerbestand"], words: L("für die Inventur jedes Produkt mit seinem Lagerbestand", "every product with its stock level, for stocktaking") },
  { table: "bestellungen", columns: ["bestell_id", "bestelldatum"], words: L("von jeder Bestellung nur Nummer und Datum", "only the number and date of every order") },
];

const DISTINCT_SETS: Array<{ table: string; column: string; words: Localized }> = [
  { table: "kunden", column: "ort", words: L("jeden Wohnort, in dem Kunden leben, nur einmal", "every city a customer lives in, each only once") },
  { table: "produkte", column: "kategorie", words: L("jede Produktkategorie nur einmal", "every product category only once") },
  { table: "bestellungen", column: "status", words: L("jeden Status, den Bestellungen haben, nur einmal", "every status an order can have, each only once") },
];

const ATOMIC_SCENARIOS: Array<{ field: Localized; options: Localized<string[]>; answer: number }> = [
  {
    field: L("ein Feld adresse mit dem Inhalt „Hauptstraße 5, 89073 Ulm“", "a field address containing “Hauptstraße 5, 89073 Ulm”"),
    options: L(
      ["strasse, hausnummer, plz, ort", "adresse_zeile1, adresse_zeile2", "adresse (so lassen)"],
      ["street, house_number, postcode, city", "address_line1, address_line2", "address (keep as is)"],
    ),
    answer: 0,
  },
  {
    field: L("ein Feld name mit dem Inhalt „Anna Berg“", "a field name containing “Anna Berg”"),
    options: L(["vorname, nachname", "name (so lassen)", "initialen, name"], ["first_name, last_name", "name (keep as is)", "initials, name"]),
    answer: 0,
  },
  {
    field: L("ein Feld geboren mit dem Inhalt „14.03.2009 (17 Jahre)“", "a field born containing “14.03.2009 (17 years)”"),
    options: L(
      ["geburtsdatum; das Alter wird bei Bedarf berechnet", "geburtsdatum_und_alter (so lassen)", "alter; das Datum ist überflüssig"],
      ["birth_date; the age is calculated when needed", "birth_date_and_age (keep as is)", "age; the date is unnecessary"],
    ),
    answer: 0,
  },
];

function joinWords(locale: "de" | "en", items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ${locale === "de" ? "und" : "and"} ${items[items.length - 1]}`;
}

const LESSON_DB_2: Lesson = {
  id: "db-2-datensatz-datenfeld",
  stageId: "stage-1-tabellen",
  stepNumber: 2,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Tabelle, Datensatz, Datenfeld",
      subtitle: "Zeilen, Spalten und atomisierte Datenfelder; Spalten gezielt auswählen",
      whyItMatters:
        "Eine Tabelle ist nur dann brauchbar, wenn jedes Datenfeld genau eine Information enthält. Sonst kannst du weder nach Nachnamen sortieren noch alle Kunden einer Stadt finden.",
      explanationHtml: `
<p>Eine <strong>Tabelle</strong> (in der Theorie: Relation) besteht aus Zeilen und Spalten. Eine Zeile ist ein <strong>Datensatz</strong> (Tupel): alle Angaben zu einem Objekt, zum Beispiel zur Kundin Anna Berg. Eine Spalte ist ein <strong>Datenfeld</strong> (Attribut): eine Eigenschaft, die jedes Objekt hat, zum Beispiel <code>ort</code>. Jedes Datenfeld hat einen Namen und einen Datentyp.</p>
<p><strong>Atomisierte Datenfelder</strong>: Jedes Feld enthält genau eine Information. „Anna Berg“ wird zu <code>vorname</code> und <code>nachname</code>, „Hauptstraße 5, 89073 Ulm“ zu <code>strasse</code>, <code>hausnummer</code>, <code>plz</code> und <code>ort</code>. Erst dann kannst du nach Nachnamen sortieren, alle Kunden aus Ulm finden oder einen Serienbrief mit „Liebe Anna“ beginnen. Die Tabelle <code>adressen_roh</code> in der Sandbox zeigt, wie es nicht geht.</p>
<p>Mit <code>SELECT</code> wählst du Spalten aus (<strong>Projektion</strong>). Die Spalten erscheinen in der Reihenfolge, in der du sie nennst:</p>
<pre class="sql"><code>SELECT vorname, nachname FROM kunden;</code></pre>
<p><code>DISTINCT</code> lässt doppelte Zeilen weg, zum Beispiel jede Stadt nur einmal:</p>
<pre class="sql"><code>SELECT DISTINCT ort FROM kunden;</code></pre>`,
      syntax: [
        { name: "Bestimmte Spalten", sql: "SELECT spalte1, spalte2 FROM tabelle;", note: "Reihenfolge wie angegeben; Projektion." },
        { name: "Ohne doppelte Zeilen", sql: "SELECT DISTINCT spalte FROM tabelle;", note: "Jeder Wert erscheint nur einmal." },
      ],
      quiz: {
        question: "Was ist ein Datensatz?",
        options: [
          "Eine Zeile der Tabelle: alle Angaben zu einem Objekt, zum Beispiel einer Kundin",
          "Eine Spalte der Tabelle: eine Eigenschaft aller Objekte",
          "Die ganze Tabelle mit allen Zeilen und Spalten",
        ],
        correctIndex: 0,
        explanation: "Zeile = Datensatz, Spalte = Datenfeld, die ganze Tabelle = Relation.",
      },
      lab: {
        title: "Sandbox: Spalten auswählen",
        intro: "Die Tabelle adressen_roh ist nicht atomisiert; vergleiche sie mit kunden.",
        goals: {
          g1: "Zeige nur vorname und nachname aller Kunden.",
          g2: "Zeige jeden Wohnort (ort) der Kunden nur einmal.",
          g3: "Zeige nachname, vorname und ort der Kunden.",
        },
      },
      celebrationMessage: "Du unterscheidest Datensatz und Datenfeld und wählst Spalten gezielt aus.",
    },
    {
      title: "Table, record, field",
      subtitle: "Rows, columns and atomic fields; choosing columns on purpose",
      whyItMatters:
        "A table is only useful when every field holds exactly one piece of information. Otherwise you can neither sort by last name nor find all customers of one city.",
      explanationHtml: `
<p>A <strong>table</strong> (in theory: relation) consists of rows and columns. A row is a <strong>record</strong> (tuple): everything stored about one object, for example the customer Anna Berg. A column is a <strong>field</strong> (attribute): a property every object has, for example <code>city</code>. Every field has a name and a data type.</p>
<p><strong>Atomic fields</strong>: every field holds exactly one piece of information. “Anna Berg” becomes <code>first_name</code> and <code>last_name</code>, “Hauptstraße 5, 89073 Ulm” becomes <code>street</code>, <code>house_number</code>, <code>postcode</code> and <code>city</code>. Only then can you sort by last name, find all customers from Ulm or start a mail merge with “Dear Anna”. The table <code>raw_addresses</code> in the sandbox shows how not to do it.</p>
<p>With <code>SELECT</code> you choose columns (<strong>projection</strong>). They appear in the order you name them:</p>
<pre class="sql"><code>SELECT first_name, last_name FROM customers;</code></pre>
<p><code>DISTINCT</code> drops duplicate rows, for example each city only once:</p>
<pre class="sql"><code>SELECT DISTINCT city FROM customers;</code></pre>`,
      syntax: [
        { name: "Specific columns", sql: "SELECT column1, column2 FROM table;", note: "Order as given; projection." },
        { name: "Without duplicate rows", sql: "SELECT DISTINCT column FROM table;", note: "Every value appears once." },
      ],
      quiz: {
        question: "What is a record?",
        options: [
          "A row of the table: everything stored about one object, for example a customer",
          "A column of the table: one property of all objects",
          "The whole table with all rows and columns",
        ],
        correctIndex: 0,
        explanation: "Row = record, column = field, the whole table = relation.",
      },
      lab: {
        title: "Sandbox: choose columns",
        intro: "The table raw_addresses is not atomic; compare it with customers.",
        goals: {
          g1: "Show only first_name and last_name of all customers.",
          g2: "Show every city a customer lives in only once.",
          g3: "Show last_name, first_name and city of the customers.",
        },
      },
      celebrationMessage: "You tell records from fields and choose columns on purpose.",
    },
  ),
  lab: sqlLab([...SHOP, "adressen_roh"], "SELECT * FROM {adressen_roh};", [
    goal("g1", (ctx) => lastResultEquals(ctx, "SELECT {vorname}, {nachname} FROM {kunden};")),
    goal("g2", (ctx) => lastResultEquals(ctx, "SELECT DISTINCT {ort} FROM {kunden};")),
    goal("g3", (ctx) => lastResultEquals(ctx, "SELECT {nachname}, {vorname}, {ort} FROM {kunden};")),
  ]),
  exercises: [
    {
      id: "spalten-waehlen",
      make: (rng, level, locale) => {
        const set = rng.pick(COLUMN_SETS);
        const tokens = set.columns.map((column) => `{${column}}`);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige von der Tabelle {${set.table}} nur die Spalten ${joinWords("de", tokens)}.`,
            `Show only the columns ${joinWords("en", tokens)} of the table {${set.table}}.`,
          ),
          prompt2: L(`Zeige ${set.words.de}.`, `Show ${set.words.en}.`),
          hint: L("SELECT <Spalte1>, <Spalte2> FROM <Tabelle>;", "SELECT <column1>, <column2> FROM <table>;"),
          sql: `SELECT ${tokens.join(", ")} FROM {${set.table}};`,
          meta: { table: set.table, columns: set.columns.length },
        });
      },
    },
    {
      id: "distinct",
      make: (rng, level, locale) => {
        const set = rng.pick(DISTINCT_SETS);
        return queryTask(locale, level, {
          prompt: L(
            `Zeige jeden Wert der Spalte {${set.column}} der Tabelle {${set.table}} nur einmal.`,
            `Show every value of the column {${set.column}} of the table {${set.table}} only once.`,
          ),
          prompt2: L(`Zeige ${set.words.de}.`, `Show ${set.words.en}.`),
          hint: L("SELECT DISTINCT <Spalte> FROM <Tabelle>;", "SELECT DISTINCT <column> FROM <table>;"),
          sql: `SELECT DISTINCT {${set.column}} FROM {${set.table}};`,
          meta: { table: set.table },
        });
      },
    },
    {
      id: "atomisieren",
      make: (rng, _level, locale) => {
        const pick = rng.pick(ATOMIC_SCENARIOS);
        return choiceTask(locale, rng, {
          prompt: L(
            `Eine Tabelle hat ${pick.field.de}. Welche Aufteilung macht die Datenfelder atomar?`,
            `A table has ${pick.field.en}. Which split makes the fields atomic?`,
          ),
          options: pick.options,
          correctIndex: pick.answer,
          explanation: L(
            "Atomar heißt: genau eine Information pro Feld. Dann kann man danach sortieren, filtern und rechnen.",
            "Atomic means exactly one piece of information per field. Then you can sort, filter and calculate with it.",
          ),
        });
      },
    },
  ],
};

// ─── Lektion 3: Datentypen ──────────────────────────────────────────────────

const TYPE_FIELDS: Array<{ field: Localized; answer: number }> = [
  { field: L("Lagerbestand (Stückzahl)", "stock level (number of pieces)"), answer: 0 },
  { field: L("Preis in Euro", "price in euros"), answer: 1 },
  { field: L("Telefonnummer", "telephone number"), answer: 2 },
  { field: L("Hausnummer (zum Beispiel 12a)", "house number (for example 12a)"), answer: 2 },
  { field: L("Postleitzahl", "postcode"), answer: 2 },
  { field: L("Anzahl Sitzplätze eines Busses", "number of seats of a bus"), answer: 0 },
  { field: L("Körpergröße in Metern", "body height in metres"), answer: 1 },
  { field: L("IBAN eines Kontos", "IBAN of an account"), answer: 2 },
  { field: L("Gewicht eines Pakets in Kilogramm", "weight of a parcel in kilograms"), answer: 1 },
];

const TABLE_SPECS: Array<{
  table: string;
  columns: Array<{ name: string; type: string; words: Localized }>;
  words: Localized;
}> = [
  {
    table: "buecher",
    words: L("Die Schulbibliothek braucht eine Tabelle für ihre Bücher", "The school library needs a table for its books"),
    columns: [
      { name: "buch_id", type: "INTEGER PRIMARY KEY", words: L("eine eindeutige Nummer", "a unique number") },
      { name: "titel", type: "TEXT", words: L("den Titel", "the title") },
      { name: "autor", type: "TEXT", words: L("den Autor", "the author") },
      { name: "seiten", type: "INTEGER", words: L("die Seitenzahl", "the page count") },
      { name: "preis", type: "REAL", words: L("den Preis", "the price") },
    ],
  },
  {
    table: "geraete",
    words: L("Die Schule inventarisiert ihre Geräte", "The school takes stock of its devices"),
    columns: [
      { name: "geraet_id", type: "INTEGER PRIMARY KEY", words: L("eine eindeutige Nummer", "a unique number") },
      { name: "bezeichnung", type: "TEXT", words: L("die Bezeichnung", "the name") },
      { name: "seriennummer", type: "TEXT", words: L("die Seriennummer (Buchstaben und Ziffern)", "the serial number (letters and digits)") },
      { name: "preis", type: "REAL", words: L("den Kaufpreis", "the purchase price") },
    ],
  },
  {
    table: "kurse",
    words: L("Ein Verein verwaltet seine Kurse", "A club manages its courses"),
    columns: [
      { name: "kurs_id", type: "INTEGER PRIMARY KEY", words: L("eine eindeutige Nummer", "a unique number") },
      { name: "titel", type: "TEXT", words: L("den Kurstitel", "the course title") },
      { name: "beitrag", type: "REAL", words: L("den Teilnahmebeitrag in Euro", "the participation fee in euros") },
      { name: "anzahl", type: "INTEGER", words: L("die Anzahl der Plätze", "the number of places") },
    ],
  },
];

const NEW_PRODUCTS: Array<{ name: string; kategorie: string; preis: number; lagerbestand: number }> = [
  { name: "Geodreieck", kategorie: "Schule", preis: 2.49, lagerbestand: 150 },
  { name: "Bluetooth-Lautsprecher", kategorie: "Elektronik", preis: 39.9, lagerbestand: 12 },
  { name: "Springseil", kategorie: "Sport", preis: 7.95, lagerbestand: 45 },
  { name: "Atlas", kategorie: "Bücher", preis: 29, lagerbestand: 20 },
  { name: "Schreibtischlampe", kategorie: "Haushalt", preis: 24.5, lagerbestand: 18 },
];

const TYPE_WORDS: Localized<Record<string, string>> = {
  de: { "INTEGER PRIMARY KEY": "INTEGER, Primärschlüssel", INTEGER: "INTEGER", TEXT: "TEXT", REAL: "REAL" },
  en: { "INTEGER PRIMARY KEY": "INTEGER, primary key", INTEGER: "INTEGER", TEXT: "TEXT", REAL: "REAL" },
};

const LESSON_DB_3: Lesson = {
  id: "db-3-datentypen",
  stageId: "stage-1-tabellen",
  stepNumber: 3,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Datentypen",
      subtitle: "INTEGER, REAL, TEXT, Datum und Ja/Nein: Jede Spalte hat einen Typ, und eine Tabelle wird mit CREATE TABLE angelegt",
      whyItMatters:
        "Der Datentyp entscheidet, was das DBMS mit einem Wert tun kann: rechnen, sortieren, vergleichen. Eine Postleitzahl als Zahl verliert ihre führende Null: Aus 01069 wird 1069.",
      explanationHtml: `
<p>Jede Spalte bekommt beim Anlegen einen <strong>Datentyp</strong>. Die wichtigsten:</p>
<ul>
  <li><code>INTEGER</code>: ganze Zahlen, zum Beispiel Lagerbestand, Anzahl, laufende Nummern.</li>
  <li><code>REAL</code> (anderswo <code>DECIMAL</code>): Kommazahlen, zum Beispiel ein Preis. In SQL schreibst du den Punkt: <code>49.90</code>.</li>
  <li><code>TEXT</code> (anderswo <code>VARCHAR</code>): Zeichenketten, zum Beispiel Namen und Orte, aber auch Postleitzahl, Telefonnummer und Hausnummer („12a“). Text steht in SQL in einfachen Hochkommas: <code>'Ulm'</code>.</li>
  <li>Datum: in SQLite als <code>TEXT</code> im Format <code>'JJJJ-MM-TT'</code>, zum Beispiel <code>'2009-03-14'</code>. So sortiert es sich richtig.</li>
  <li>Ja/Nein (<code>BOOLEAN</code>): in SQLite als <code>INTEGER</code> mit 0 und 1, zum Beispiel <code>newsletter</code>.</li>
</ul>
<p>Faustregel: Wenn du mit einem Wert nicht rechnest, ist er <code>TEXT</code>, auch wenn er aus Ziffern besteht.</p>
<p>Eine Tabelle legst du mit <code>CREATE TABLE</code> an und nennst jede Spalte mit ihrem Typ. <code>PRIMARY KEY</code> kennzeichnet den Primärschlüssel (Lektion 4), <code>NOT NULL</code> verbietet leere Werte:</p>
<pre class="sql"><code>CREATE TABLE mitglieder (
  mitglied_id INTEGER PRIMARY KEY,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  geburtsdatum TEXT,
  beitrag REAL
);</code></pre>
<p>Datensätze fügst du mit <code>INSERT</code> ein; die Werte stehen in derselben Reihenfolge wie die Spalten:</p>
<pre class="sql"><code>INSERT INTO mitglieder (mitglied_id, vorname, nachname, geburtsdatum, beitrag)
VALUES (1, 'Mia', 'Roth', '2009-05-02', 24.00);</code></pre>`,
      syntax: [
        { name: "Tabelle anlegen", sql: "CREATE TABLE tabelle (spalte1 TYP PRIMARY KEY, spalte2 TYP, …);", note: "Typen: INTEGER, REAL, TEXT." },
        { name: "Datensatz einfügen", sql: "INSERT INTO tabelle (spalte1, spalte2) VALUES (wert1, wert2);", note: "Text in Hochkommas, Zahlen ohne, Kommazahlen mit Punkt." },
      ],
      quiz: {
        question: "Welchen Datentyp bekommt die Postleitzahl?",
        options: [
          "TEXT, weil man nicht damit rechnet und führende Nullen bleiben müssen",
          "INTEGER, weil sie nur aus Ziffern besteht",
          "REAL, weil sie fünf Stellen hat",
        ],
        correctIndex: 0,
        explanation: "01069 (Dresden) wäre als Zahl 1069. Mit Postleitzahlen rechnet niemand: TEXT.",
      },
      lab: {
        title: "Sandbox: Eine Tabelle anlegen",
        intro: "Lege die Tabelle mitglieder an und fülle sie. Mit „Datenbank zurücksetzen“ kannst du neu beginnen.",
        goals: {
          g1: "Lege die Tabelle mitglieder an: mitglied_id (INTEGER, Primärschlüssel), vorname und nachname (TEXT).",
          g2: "Die Tabelle mitglieder hat außerdem die Spalten geburtsdatum (TEXT) und beitrag (REAL). Ergänze sie beim Anlegen oder mit ALTER TABLE mitglieder ADD COLUMN …",
          g3: "Füge mindestens ein Mitglied ein (INSERT INTO mitglieder …).",
        },
      },
      celebrationMessage: "Du wählst Datentypen begründet und legst Tabellen selbst an.",
    },
    {
      title: "Data types",
      subtitle: "INTEGER, REAL, TEXT, date and yes/no: every column has a type, and a table is created with CREATE TABLE",
      whyItMatters:
        "The data type decides what the DBMS can do with a value: calculate, sort, compare. A postcode stored as a number loses its leading zero: 01069 becomes 1069.",
      explanationHtml: `
<p>Every column gets a <strong>data type</strong> when the table is created. The most important ones:</p>
<ul>
  <li><code>INTEGER</code>: whole numbers, for example stock level, counts, running numbers.</li>
  <li><code>REAL</code> (elsewhere <code>DECIMAL</code>): numbers with decimals, for example a price. In SQL you write the point: <code>49.90</code>.</li>
  <li><code>TEXT</code> (elsewhere <code>VARCHAR</code>): strings, for example names and cities, but also postcode, telephone number and house number (“12a”). Text goes in single quotes in SQL: <code>'Ulm'</code>.</li>
  <li>Date: in SQLite as <code>TEXT</code> in the format <code>'YYYY-MM-DD'</code>, for example <code>'2009-03-14'</code>. That way it sorts correctly.</li>
  <li>Yes/no (<code>BOOLEAN</code>): in SQLite as <code>INTEGER</code> with 0 and 1, for example <code>newsletter</code>.</li>
</ul>
<p>Rule of thumb: if you never calculate with a value, it is <code>TEXT</code>, even when it consists of digits.</p>
<p>You create a table with <code>CREATE TABLE</code>, naming every column with its type. <code>PRIMARY KEY</code> marks the primary key (lesson 4), <code>NOT NULL</code> forbids empty values:</p>
<pre class="sql"><code>CREATE TABLE members (
  member_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date TEXT,
  fee REAL
);</code></pre>
<p>Records are added with <code>INSERT</code>; the values come in the same order as the columns:</p>
<pre class="sql"><code>INSERT INTO members (member_id, first_name, last_name, birth_date, fee)
VALUES (1, 'Mia', 'Roth', '2009-05-02', 24.00);</code></pre>`,
      syntax: [
        { name: "Create a table", sql: "CREATE TABLE table (column1 TYPE PRIMARY KEY, column2 TYPE, …);", note: "Types: INTEGER, REAL, TEXT." },
        { name: "Insert a record", sql: "INSERT INTO table (column1, column2) VALUES (value1, value2);", note: "Text in quotes, numbers without, decimals with a point." },
      ],
      quiz: {
        question: "Which data type does the postcode get?",
        options: [
          "TEXT, because nobody calculates with it and leading zeros must stay",
          "INTEGER, because it consists of digits only",
          "REAL, because it has five digits",
        ],
        correctIndex: 0,
        explanation: "01069 (Dresden) would be 1069 as a number. Nobody calculates with postcodes: TEXT.",
      },
      lab: {
        title: "Sandbox: create a table",
        intro: "Create the table members and fill it. “Reset database” lets you start over.",
        goals: {
          g1: "Create the table members: member_id (INTEGER, primary key), first_name and last_name (TEXT).",
          g2: "The table members also has the columns birth_date (TEXT) and fee (REAL). Add them when creating it or with ALTER TABLE members ADD COLUMN …",
          g3: "Insert at least one member (INSERT INTO members …).",
        },
      },
      celebrationMessage: "You choose data types with a reason and create tables yourself.",
    },
  ),
  lab: sqlLab(
    SHOP,
    "CREATE TABLE {mitglieder} (\n  {mitglied_id} INTEGER PRIMARY KEY,\n  {vorname} TEXT NOT NULL,\n  {nachname} TEXT NOT NULL\n);",
    [
      goal("g1", (ctx) =>
        tableHasColumns(ctx, "{mitglieder}", [
          { name: "{mitglied_id}", group: "INTEGER", pk: true },
          { name: "{vorname}", group: "TEXT" },
          { name: "{nachname}", group: "TEXT" },
        ]),
      ),
      goal("g2", (ctx) =>
        tableHasColumns(ctx, "{mitglieder}", [
          { name: "{mitglied_id}", group: "INTEGER", pk: true },
          { name: "{geburtsdatum}", group: "TEXT" },
          { name: "{beitrag}", group: "DECIMAL" },
        ]),
      ),
      goal("g3", (ctx) => countNow(ctx, "SELECT count(*) FROM {mitglieder};") >= 1),
    ],
  ),
  exercises: [
    {
      id: "datentyp-waehlen",
      make: (rng, _level, locale) => {
        const pick = rng.pick(TYPE_FIELDS);
        return choiceTask(locale, rng, {
          prompt: L(`Welchen Datentyp bekommt die Spalte „${pick.field.de}“?`, `Which data type does the column “${pick.field.en}” get?`),
          options: L(["INTEGER (ganze Zahl)", "REAL (Kommazahl)", "TEXT (Zeichenkette)"], ["INTEGER (whole number)", "REAL (number with decimals)", "TEXT (string)"]),
          correctIndex: pick.answer,
          explanation: L(
            "Ganze Zahlen zum Zählen: INTEGER. Beträge und Maße mit Nachkommastellen: REAL. Alles, womit man nicht rechnet: TEXT.",
            "Whole numbers for counting: INTEGER. Amounts and measures with decimals: REAL. Everything you never calculate with: TEXT.",
          ),
        });
      },
    },
    {
      id: "tabelle-anlegen",
      make: (rng, level, locale) => {
        const spec = rng.pick(TABLE_SPECS);
        const typeWords = TYPE_WORDS[locale];
        const columnList = spec.columns.map((column) => `{${column.name}} (${typeWords[column.type]})`);
        const wordList = spec.columns.map((column) => `${column.words[locale]} {${column.name}}`);
        return mutationTask(locale, level, {
          prompt: L(
            `Lege die Tabelle {${spec.table}} an mit den Spalten ${joinWords("de", columnList)}.`,
            `Create the table {${spec.table}} with the columns ${joinWords("en", columnList)}.`,
          ),
          prompt2: L(
            `${spec.words.de}: ${joinWords("de", wordList)}. Lege die Tabelle {${spec.table}} an, wähle passende Datentypen und lege den Primärschlüssel fest.`,
            `${spec.words.en}: ${joinWords("en", wordList)}. Create the table {${spec.table}}, choose fitting data types and set the primary key.`,
          ),
          hint: L("CREATE TABLE <Tabelle> (<Spalte> TYP PRIMARY KEY, <Spalte> TYP, …);", "CREATE TABLE <table> (<column> TYPE PRIMARY KEY, <column> TYPE, …);"),
          sql: `CREATE TABLE {${spec.table}} (\n${spec.columns.map((column) => `  {${column.name}} ${column.type}`).join(",\n")}\n);`,
          verifyTables: [],
          verifySchemaOf: [`{${spec.table}}`],
          note: L(
            "Geprüft werden Spaltennamen, Datentypen und Primärschlüssel, nicht die Schreibweise. VARCHAR zählt als TEXT, DECIMAL als REAL.",
            "Column names, data types and the primary key are checked, not the spelling. VARCHAR counts as TEXT, DECIMAL as REAL.",
          ),
          meta: { table: spec.table },
        });
      },
    },
    {
      id: "produkt-einfuegen",
      make: (rng, level, locale) => {
        const product = rng.pick(NEW_PRODUCTS);
        const price = money(locale, product.preis);
        return mutationTask(locale, level, {
          prompt: L(
            `Füge in die Tabelle {produkte} das Produkt {${product.name}} ein: {produkt_id} 12, {kategorie} {${product.kategorie}}, {preis} ${price}, {lagerbestand} ${product.lagerbestand}.`,
            `Insert the product {${product.name}} into the table {produkte}: {produkt_id} 12, {kategorie} {${product.kategorie}}, {preis} ${price}, {lagerbestand} ${product.lagerbestand}.`,
          ),
          prompt2: L(
            `Ein neues Produkt kommt in den Shop: {${product.name}}, Kategorie {${product.kategorie}}, Preis ${price}, ${product.lagerbestand} Stück auf Lager. Lege es mit der Nummer 12 an.`,
            `A new product joins the shop: {${product.name}}, category {${product.kategorie}}, price ${price}, ${product.lagerbestand} in stock. Add it with the number 12.`,
          ),
          hint: L(
            "INSERT INTO <Tabelle> (<Spalte1>, <Spalte2>, …) VALUES (<Wert1>, <Wert2>, …); Text in Hochkommas, Preis mit Punkt.",
            "INSERT INTO <table> (<column1>, <column2>, …) VALUES (<value1>, <value2>, …); text in quotes, price with a point.",
          ),
          sql: `INSERT INTO {produkte} ({produkt_id}, {bezeichnung}, {kategorie}, {preis}, {lagerbestand})\nVALUES (12, '{${product.name}}', '{${product.kategorie}}', ${product.preis}, ${product.lagerbestand});`,
          verifyTables: ["{produkte}"],
          meta: { product: product.name, price: product.preis },
        });
      },
    },
  ],
};

// ─── Lektion 4: Primärschlüssel ─────────────────────────────────────────────

const KEY_SCENARIOS: Array<{ table: Localized; options: Localized<string[]>; answer: number }> = [
  {
    table: L("eine Schülertabelle", "a table of students"),
    options: L(["schueler_id (laufende Nummer)", "nachname", "geburtsdatum"], ["student_id (running number)", "last_name", "birth_date"]),
    answer: 0,
  },
  {
    table: L("den Buchbestand einer Bibliothek", "the book stock of a library"),
    options: L(["inventarnummer", "titel", "autor"], ["inventory_number", "title", "author"]),
    answer: 0,
  },
  {
    table: L("die Fahrzeuge einer Autovermietung", "the vehicles of a car rental"),
    options: L(["fahrgestellnummer", "farbe", "marke"], ["vehicle_identification_number", "colour", "brand"]),
    answer: 0,
  },
  {
    table: L("die Mitglieder eines Vereins", "the members of a club"),
    options: L(["mitglied_id", "vorname", "ort"], ["member_id", "first_name", "city"]),
    answer: 0,
  },
];

const KEY_STATEMENTS = {
  right: L(
    ["Jeder Wert kommt in der Tabelle genau einmal vor.", "Er darf nie leer (NULL) sein.", "Er sollte sich nie ändern."],
    ["Every value occurs exactly once in the table.", "It may never be empty (NULL).", "It should never change."],
  ),
  wrong: L(
    ["Er muss eine Zahl sein.", "Er muss der Nachname sein.", "Er darf doppelt vorkommen, wenn die Vornamen verschieden sind."],
    ["It must be a number.", "It must be the last name.", "It may occur twice when the first names differ."],
  ),
};

const NEW_CUSTOMERS: Array<{ vorname: string; nachname: string; strasse: string; hausnummer: string; plz: string; ort: string }> = [
  { vorname: "Nora", nachname: "Lang", strasse: "Hauptstraße", hausnummer: "1", plz: "89073", ort: "Ulm" },
  { vorname: "Tom", nachname: "Weber", strasse: "Bahnhofstraße", hausnummer: "7", plz: "94032", ort: "Passau" },
  { vorname: "Sara", nachname: "Öztürk", strasse: "Marienplatz", hausnummer: "8", plz: "80331", ort: "München" },
  { vorname: "Jonas", nachname: "Vogel", strasse: "Burgstraße", hausnummer: "15", plz: "90403", ort: "Nürnberg" },
];

const LESSON_DB_4: Lesson = {
  id: "db-4-primaerschluessel",
  stageId: "stage-1-tabellen",
  stepNumber: 4,
  module: "2.3.1",
  tables: SHOP,
  requiredCorrect: 3,
  text: L(
    {
      title: "Der Primärschlüssel",
      subtitle: "Eindeutig, nie leer, unveränderlich: Woran das DBMS jeden Datensatz erkennt",
      whyItMatters:
        "Zwei Kundinnen können Anna Berg heißen. Nur ein Schlüssel, der garantiert eindeutig ist, ordnet Bestellungen, Rechnungen und Lieferungen der richtigen Person zu.",
      explanationHtml: `
<p>Der <strong>Primärschlüssel</strong> (Primary Key) ist das Datenfeld, das jeden Datensatz einer Tabelle eindeutig identifiziert. Drei Eigenschaften muss er erfüllen:</p>
<ul>
  <li><strong>eindeutig</strong>: Jeder Wert kommt genau einmal vor.</li>
  <li><strong>nie leer</strong>: Kein Datensatz ohne Schlüsselwert (<code>NULL</code> ist verboten).</li>
  <li><strong>unveränderlich</strong>: Der Wert bleibt, solange der Datensatz existiert.</li>
</ul>
<p>Ein <strong>natürlicher Schlüssel</strong> ist ein Merkmal, das es ohnehin gibt: ISBN, Kfz-Kennzeichen, Matrikelnummer. Meist nimmt man einen <strong>künstlichen Schlüssel</strong>: eine laufende Nummer wie <code>kunden_id</code>. Namen eignen sich nicht, weil sie weder eindeutig sind noch gleich bleiben.</p>
<p>In SQLite vergibt <code>INTEGER PRIMARY KEY</code> die nächste freie Nummer automatisch, wenn du beim Einfügen keine angibst:</p>
<pre class="sql"><code>INSERT INTO kunden (vorname, nachname, ort)
VALUES ('Nora', 'Lang', 'Ulm');</code></pre>
<p>Ein doppelter Schlüsselwert wird abgelehnt. Das DBMS meldet <code>UNIQUE constraint failed</code>; so schützt es die Eindeutigkeit, ohne dass du daran denken musst.</p>`,
      syntax: [
        { name: "Primärschlüssel festlegen", sql: "CREATE TABLE tabelle (id INTEGER PRIMARY KEY, …);", note: "INTEGER PRIMARY KEY vergibt automatisch die nächste Nummer." },
        { name: "Einfügen ohne Schlüsselwert", sql: "INSERT INTO tabelle (spalte1, spalte2) VALUES (wert1, wert2);", note: "Der Schlüssel wird vom DBMS vergeben." },
      ],
      quiz: {
        question: "Warum ist der Nachname kein geeigneter Primärschlüssel für Kunden?",
        options: [
          "Er ist nicht eindeutig: Mehrere Kunden können gleich heißen, und Namen ändern sich",
          "Er ist zu lang zum Speichern",
          "Namen enthalten manchmal Umlaute",
        ],
        correctIndex: 0,
        explanation: "Eindeutig, nie leer, unveränderlich: Der Nachname erfüllt davon nichts zuverlässig.",
      },
      lab: {
        title: "Sandbox: Der Schlüssel wehrt sich",
        intro: "Füge Kunden ein, einmal mit einer vergebenen und einmal mit einer freien kunden_id.",
        goals: {
          g1: "Löse einen Primärschlüssel-Fehler aus: Füge einen Kunden mit einer kunden_id ein, die es schon gibt.",
          g2: "Füge den Kunden mit einer freien kunden_id ein, oder lass die kunden_id weg.",
          g3: "Zeige mit SELECT * alle Kunden mit kunden_id größer als 13, um den neuen Datensatz zu sehen.",
        },
      },
      celebrationMessage: "Du weißt, was einen Primärschlüssel ausmacht, und wie das DBMS ihn schützt.",
    },
    {
      title: "The primary key",
      subtitle: "Unique, never empty, unchanging: how the DBMS recognises every record",
      whyItMatters:
        "Two customers can be called Anna Berg. Only a key that is guaranteed unique assigns orders, invoices and deliveries to the right person.",
      explanationHtml: `
<p>The <strong>primary key</strong> is the field that identifies every record of a table uniquely. It must satisfy three properties:</p>
<ul>
  <li><strong>unique</strong>: every value occurs exactly once.</li>
  <li><strong>never empty</strong>: no record without a key value (<code>NULL</code> is forbidden).</li>
  <li><strong>unchanging</strong>: the value stays as long as the record exists.</li>
</ul>
<p>A <strong>natural key</strong> is a property that exists anyway: ISBN, licence plate, student number. Usually an <strong>artificial key</strong> is used: a running number such as <code>customer_id</code>. Names do not qualify, because they are neither unique nor constant.</p>
<p>In SQLite, <code>INTEGER PRIMARY KEY</code> assigns the next free number automatically when you insert without one:</p>
<pre class="sql"><code>INSERT INTO customers (first_name, last_name, city)
VALUES ('Nora', 'Lang', 'Ulm');</code></pre>
<p>A duplicate key value is refused. The DBMS reports <code>UNIQUE constraint failed</code>; that is how it protects uniqueness without you having to think of it.</p>`,
      syntax: [
        { name: "Set the primary key", sql: "CREATE TABLE table (id INTEGER PRIMARY KEY, …);", note: "INTEGER PRIMARY KEY assigns the next number automatically." },
        { name: "Insert without a key value", sql: "INSERT INTO table (column1, column2) VALUES (value1, value2);", note: "The DBMS assigns the key." },
      ],
      quiz: {
        question: "Why is the last name not a suitable primary key for customers?",
        options: [
          "It is not unique: several customers can share it, and names change",
          "It is too long to store",
          "Names sometimes contain umlauts",
        ],
        correctIndex: 0,
        explanation: "Unique, never empty, unchanging: the last name reliably fulfils none of these.",
      },
      lab: {
        title: "Sandbox: the key fights back",
        intro: "Insert customers, once with a taken and once with a free customer_id.",
        goals: {
          g1: "Trigger a primary key error: insert a customer with a customer_id that already exists.",
          g2: "Insert the customer with a free customer_id, or leave the customer_id out.",
          g3: "Show with SELECT * all customers with customer_id greater than 13 to see the new record.",
        },
      },
      celebrationMessage: "You know what makes a primary key and how the DBMS protects it.",
    },
  ),
  lab: sqlLab(SHOP, "INSERT INTO {kunden} ({kunden_id}, {vorname}, {nachname}, {ort})\nVALUES (3, 'Nora', 'Lang', 'Ulm');", [
    goal("g1", (ctx) => lastErrorIncludes(ctx, "UNIQUE constraint failed")),
    goal("g2", (ctx) => countNow(ctx, "SELECT count(*) FROM {kunden};") > CUSTOMERS.length),
    goal(
      "g3",
      (ctx) =>
        countNow(ctx, "SELECT count(*) FROM {kunden};") > CUSTOMERS.length &&
        lastResultEquals(ctx, `SELECT * FROM {kunden} WHERE {kunden_id} > ${CUSTOMERS.length};`),
    ),
  ]),
  exercises: [
    {
      id: "schluessel-waehlen",
      make: (rng, _level, locale) => {
        const pick = rng.pick(KEY_SCENARIOS);
        return choiceTask(locale, rng, {
          prompt: L(
            `Welche Spalte eignet sich als Primärschlüssel für ${pick.table.de}?`,
            `Which column suits as the primary key for ${pick.table.en}?`,
          ),
          options: pick.options,
          correctIndex: pick.answer,
          explanation: L(
            "Ein Primärschlüssel ist eindeutig, nie leer und ändert sich nicht. Namen, Farben und Daten erfüllen das nicht.",
            "A primary key is unique, never empty and does not change. Names, colours and dates do not qualify.",
          ),
        });
      },
    },
    {
      id: "kunde-einfuegen",
      make: (rng, level, locale) => {
        const c = rng.pick(NEW_CUSTOMERS);
        return mutationTask(locale, level, {
          prompt: L(
            `Füge in {kunden} einen Datensatz ein, ohne {kunden_id} anzugeben: {vorname} ${c.vorname}, {nachname} ${c.nachname}, {strasse} ${c.strasse}, {hausnummer} ${c.hausnummer}, {plz} ${c.plz}, {ort} ${c.ort}.`,
            `Insert a record into {kunden} without giving a {kunden_id}: {vorname} ${c.vorname}, {nachname} ${c.nachname}, {strasse} ${c.strasse}, {hausnummer} ${c.hausnummer}, {plz} ${c.plz}, {ort} ${c.ort}.`,
          ),
          prompt2: L(
            `Neue Kundin oder neuer Kunde: ${c.vorname} ${c.nachname}, ${c.strasse} ${c.hausnummer}, ${c.plz} ${c.ort}. Lege den Datensatz an; die Kundennummer vergibt die Datenbank selbst.`,
            `A new customer: ${c.vorname} ${c.nachname}, ${c.strasse} ${c.hausnummer}, ${c.plz} ${c.ort}. Create the record; the database assigns the customer number itself.`,
          ),
          hint: L(
            "INSERT INTO <Tabelle> (<Spalten ohne Schlüssel>) VALUES (<Werte>); Postleitzahl und Hausnummer sind TEXT.",
            "INSERT INTO <table> (<columns without the key>) VALUES (<values>); postcode and house number are TEXT.",
          ),
          sql: `INSERT INTO {kunden} ({vorname}, {nachname}, {strasse}, {hausnummer}, {plz}, {ort})\nVALUES ('${c.vorname}', '${c.nachname}', '${c.strasse}', '${c.hausnummer}', '${c.plz}', '${c.ort}');`,
          verifyTables: ["{kunden}"],
          note: L(
            `Die Datenbank vergibt die nächste freie Nummer, hier ${CUSTOMERS.length + 1}.`,
            `The database assigns the next free number, here ${CUSTOMERS.length + 1}.`,
          ),
          meta: { customer: c.nachname },
        });
      },
    },
    {
      id: "eigenschaft",
      make: (rng, _level, locale) => {
        const rightIndex = rng.int(0, KEY_STATEMENTS.right.de.length - 1);
        const wrong = rng.sample([0, 1, 2], 2);
        const options = L(
          [KEY_STATEMENTS.right.de[rightIndex], ...wrong.map((i) => KEY_STATEMENTS.wrong.de[i])],
          [KEY_STATEMENTS.right.en[rightIndex], ...wrong.map((i) => KEY_STATEMENTS.wrong.en[i])],
        );
        return choiceTask(locale, rng, {
          prompt: L("Welche Aussage über den Primärschlüssel stimmt?", "Which statement about the primary key is true?"),
          options,
          correctIndex: 0,
          explanation: L(
            "Eindeutig, nie leer, unveränderlich. Der Typ ist frei, und ein Name ist fast nie eindeutig.",
            "Unique, never empty, unchanging. The type is free, and a name is almost never unique.",
          ),
        });
      },
    },
  ],
};

export const STAGE_TABELLEN: Stage = {
  id: "stage-1-tabellen",
  stageNumber: 1,
  icon: "🗂️",
  accent: "#2563eb",
  text: L(
    {
      title: "Datenbank und Tabelle",
      subtitle: "Datenbanksystem, Datensatz und Datenfeld, Datentypen, Primärschlüssel",
      badgeTitle: "Tabellen-Architektin / Tabellen-Architekt",
      moduleLabel: "IT 2.3.1 Datenbanksysteme I",
    },
    {
      title: "Database and table",
      subtitle: "Database system, record and field, data types, primary key",
      badgeTitle: "Table architect",
      moduleLabel: "IT 2.3.1 Database systems I",
    },
  ),
  lessons: [LESSON_DB_1, LESSON_DB_2, LESSON_DB_3, LESSON_DB_4],
};
