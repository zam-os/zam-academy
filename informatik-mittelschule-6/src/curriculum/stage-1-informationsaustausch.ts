import type { LabDefinition, LabValues, Stage } from "../model/types";
import { caseLab } from "../lab/case-lab";
import { clamp, line, open, rect, text, W } from "../lab/svg";
import { cases, cc, lesson, numberField, textField, withSlips } from "./helpers";
import { fmt } from "../exercises/format";

const STAGE_ID = "stage-1-informationsaustausch";

// ─── Lab 1: Verfeinerte Suchstrategien ───────────────────────────────────────

interface SearchHit {
  title: string;
  year: number;
  domain: string;
  exactPhrase: boolean;
  shop: boolean;
  song: boolean;
  relevant: boolean;
}

const SEARCH_HITS: SearchHit[] = [
  { title: "Biber-Schutz in Bayern (lfu.bayern.de)", year: 2025, domain: "bayern.de", exactPhrase: true, shop: false, song: false, relevant: true },
  { title: "Lebensraum Biber in Bayern (stmelf.bayern.de)", year: 2024, domain: "bayern.de", exactPhrase: true, shop: false, song: false, relevant: true },
  { title: "Naturpark-Bericht: Biber in Bayern (naturpark.bayern.de)", year: 2022, domain: "bayern.de", exactPhrase: true, shop: false, song: false, relevant: true },
  { title: "Merkblatt Biberberatung (lfu.bayern.de)", year: 2016, domain: "bayern.de", exactPhrase: true, shop: false, song: false, relevant: true },
  { title: "Kinderlied: Der kleine Biber in Bayern", year: 2023, domain: "musik.example", exactPhrase: true, shop: false, song: true, relevant: false },
  { title: "Biber-Bettwäsche Bayern-Edition · Shop", year: 2025, domain: "shop.example", exactPhrase: false, shop: true, song: false, relevant: false },
  { title: "Flanell-Bettwäsche Biber im Angebot · Shop", year: 2024, domain: "kauf.example", exactPhrase: false, shop: true, song: false, relevant: false },
  { title: "Reiseblog: Biber an der Isar beobachtet", year: 2023, domain: "blog.example", exactPhrase: false, shop: false, song: false, relevant: true },
  { title: "Alte Schülerzeitung über Biber in Bayern", year: 2012, domain: "schule.example", exactPhrase: true, shop: false, song: false, relevant: true },
  { title: "Vereinsfest FC Bayern · Biber-Maskottchen", year: 2024, domain: "verein.example", exactPhrase: false, shop: false, song: false, relevant: false },
];

function filterHits(v: LabValues): SearchHit[] {
  return SEARCH_HITS.filter((hit) => {
    if (v.begriff === 1 && !hit.exactPhrase) return false;
    if (v.ausschluss === 1 && hit.song) return false;
    if (v.ausschluss === 2 && hit.shop) return false;
    if (v.siteFilter === 1 && hit.domain !== "bayern.de") return false;
    if (hit.year < v.zeitraum) return false;
    return true;
  });
}

function queryString(v: LabValues): string {
  const parts = [v.begriff === 1 ? '"biber in bayern"' : "biber bayern"];
  if (v.ausschluss === 1) parts.push("−lied");
  if (v.ausschluss === 2) parts.push("−bettwäsche −shop");
  if (v.siteFilter === 1) parts.push("site:bayern.de");
  if (v.zeitraum > 2010) parts.push(`ab ${v.zeitraum}`);
  return parts.join(" ");
}

const suchLab: LabDefinition = {
  kind: "ms6-such-labor",
  title: "Such-Filter-Werkstatt",
  intro:
    "Du recherchierst für ein Referat über den Biber in Bayern. Kombiniere exakte Wortfolge, Ausschlusswörter, Domain-Filter und Zeitraum so, dass nur passende Fachtreffer bleiben.",
  params: [
    {
      key: "begriff",
      type: "choice",
      label: "Suchbegriff",
      options: [
        { value: 0, label: "biber bayern (lose Wörter)" },
        { value: 1, label: '"biber in bayern" (exakte Wortfolge)' },
      ],
      value: 0,
    },
    {
      key: "ausschluss",
      type: "choice",
      label: "Ausschluss mit Minus",
      options: [
        { value: 0, label: "kein Ausschluss" },
        { value: 1, label: "−lied (Musik ausschließen)" },
        { value: 2, label: "−bettwäsche −shop (Werbung ausschließen)" },
      ],
      value: 0,
    },
    {
      key: "siteFilter",
      type: "choice",
      label: "Webseiten-Filter",
      options: [
        { value: 0, label: "alle Webseiten" },
        { value: 1, label: "site:bayern.de (amtliche Fachseiten)" },
      ],
      value: 0,
    },
    {
      key: "zeitraum",
      type: "range",
      label: "Nur Treffer ab Jahr",
      unit: "",
      min: 2010,
      max: 2026,
      step: 2,
      value: 2010,
    },
  ],
  readouts: [
    { key: "query", label: "Suchanfrage", compute: (v) => queryString(v) },
    {
      key: "hits",
      label: "Treffer gesamt",
      emphasis: true,
      compute: (v) => {
        const list = filterHits(v);
        const rel = list.filter((h) => h.relevant).length;
        const noise = list.length - rel;
        return `${list.length} (${rel} fachlich · ${noise} unpassend)`;
      },
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Schließe die Bettwäsche-Angebote mit −bettwäsche −shop aus.",
      check: (v) => v.ausschluss === 2 && filterHits(v).every((h) => !h.shop),
    },
    {
      id: "g2",
      text: "Suche nach der exakten Wortfolge „biber in bayern“ ab dem Jahr 2022.",
      check: (v) => v.begriff === 1 && v.zeitraum >= 2022,
    },
    {
      id: "g3",
      text: "Erreiche eine rein fachliche Liste (mindestens 2 Fachtreffer, 0 unpassende) mit site:bayern.de ab 2022.",
      check: (v) => {
        const list = filterHits(v);
        const rel = list.filter((h) => h.relevant).length;
        const noise = list.length - rel;
        return v.siteFilter === 1 && v.zeitraum >= 2022 && rel >= 2 && noise === 0;
      },
    },
  ],
  witnesses: {
    g1: { begriff: 0, ausschluss: 2, siteFilter: 0, zeitraum: 2010 },
    g2: { begriff: 1, ausschluss: 0, siteFilter: 0, zeitraum: 2022 },
    g3: { begriff: 1, ausschluss: 2, siteFilter: 1, zeitraum: 2022 },
  },
  view: {
    handles: {
      zeitHandle: {
        x: "zeitraum",
        drag(point): Partial<LabValues> {
          const t = clamp((point.x - 44) / 432, 0, 1);
          const yr = Math.round((2010 + t * 16) / 2) * 2;
          return { zeitraum: clamp(yr, 2010, 2026) };
        },
      },
    },
    render(v) {
      const list = filterHits(v);
      const hx = 44 + ((v.zeitraum - 2010) / 16) * 432;
      let out = open("Such-Filter-Werkstatt");
      out += rect(20, 14, W - 40, 34, "lab-panel", 'rx="8"');
      out += text(32, 36, `Suche: ${queryString(v)}`.slice(0, 56), "lab-text-small");

      const shown = list.slice(0, 5);
      if (shown.length === 0) {
        out += rect(20, 62, W - 40, 190, "lab-shape", 'rx="10"');
        out += text(260, 160, "Keine Treffer für diesen Filter (Zeitraum lockern!).", "lab-text-muted", "middle");
      } else {
        shown.forEach((hit, idx) => {
          const y = 58 + idx * 39;
          out += rect(20, y, W - 40, 34, hit.relevant ? "lab-fill-ok" : "lab-fill-b", 'rx="8"');
          out += text(32, y + 21, `${hit.relevant ? "✓" : "✗"} ${hit.title}`.slice(0, 48), hit.relevant ? "lab-text-ok" : "lab-text-b");
          out += text(W - 32, y + 21, String(hit.year), "lab-text-small", "end");
        });
      }
      if (list.length > 5) {
        out += text(260, 266, `… und ${list.length - 5} weitere Treffer`, "lab-text-muted", "middle");
      }

      // Zeitschieber unten
      out += line(44, 294, 476, 294, "lab-thin");
      out += `<g class="lab-handle lab-handle-a" data-handle="zeitHandle" tabindex="0" role="slider" aria-label="Treffer ab Jahr" aria-valuemin="2010" aria-valuemax="2026" aria-valuenow="${v.zeitraum}">`;
      out += `<circle cx="${hx}" cy="294" r="16" class="lab-handle-hit" />`;
      out += `<circle cx="${hx}" cy="294" r="7.5" class="lab-handle-dot" />`;
      out += text(hx, 322, `ab ${v.zeitraum}`, "lab-text-a", "middle");
      out += "</g>";
      out += text(44, 282, "2010", "lab-text-tick");
      out += text(476, 282, "2026", "lab-text-tick", "end");
      return `${out}</svg>`;
    },
  },
};

// ─── Lab 2: Informationsqualität & Medienwirkung ─────────────────────────────

const quellenPrueferLab: LabDefinition = {
  kind: "ms6-quellen-pruefer",
  title: "Quellen-Prüfer für Online-Artikel",
  intro:
    "Bewerte einen Webseiten-Fund anhand von Absender, Tonfall, unabhängigen Belegen und Alter. Ziehe an den Punkten oder stelle die Felder um.",
  params: [
    {
      key: "absender",
      type: "choice",
      label: "Absender / Impressum",
      options: [
        { value: 0, label: "Anonyme Seite ohne Impressum" },
        { value: 1, label: "Werbeartikel eines Herstellers" },
        { value: 2, label: "Fachinstitut / Behörde mit Impressum" },
      ],
      value: 0,
    },
    {
      key: "tonfall",
      type: "choice",
      label: "Sprache und Überschrift",
      options: [
        { value: 0, label: "Reißerisch (‚UNGLAUBLICHER SKANDAL!‘)" },
        { value: 1, label: "Sachlich mit klaren Fakten und Grenzen" },
      ],
      value: 0,
    },
    {
      key: "quellenAnzahl",
      type: "range",
      label: "Unabhängige Belege / Zweitquellen",
      unit: "Quellen",
      min: 0,
      max: 3,
      step: 1,
      value: 0,
    },
    {
      key: "alterJahre",
      type: "range",
      label: "Alter des Beitrags",
      unit: "Jahre",
      min: 0,
      max: 12,
      step: 1,
      value: 10,
    },
  ],
  readouts: [
    {
      key: "vertrauen",
      label: "Vertrauenswürdigkeit",
      compute: (v) =>
        v.absender === 2 && v.tonfall === 1
          ? "Vertrauenswürdig und sachlich"
          : v.absender === 1
            ? "Vorsicht: Werbeinteresse möglich"
            : "Ungeprüft oder reißerisch",
    },
    {
      key: "aktualitaet",
      label: "Aktualität & Belege",
      compute: (v) =>
        `${v.quellenAnzahl} Belege · ${v.alterJahre} ${v.alterJahre === 1 ? "Jahr" : "Jahre"} alt`,
    },
    {
      key: "urteil",
      label: "Qualitätsurteil",
      emphasis: true,
      compute: (v) =>
        v.absender === 2 && v.tonfall === 1 && v.quellenAnzahl >= 2 && v.alterJahre <= 2
          ? "Hohe Informationsqualität"
          : "Noch nicht zitierfähig",
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Wähle eine vertrauenswürdige Quelle mit Impressum und sachlichem Tonfall.",
      check: (v) => v.absender === 2 && v.tonfall === 1,
    },
    {
      id: "g2",
      text: "Stelle mindestens 2 unabhängige Belege und höchstens 2 Jahre Alter ein.",
      check: (v) => v.quellenAnzahl >= 2 && v.alterJahre <= 2,
    },
    {
      id: "g3",
      text: "Erfülle alle vier Qualitätskriterien gleichzeitig (‚Hohe Informationsqualität‘).",
      check: (v) => v.absender === 2 && v.tonfall === 1 && v.quellenAnzahl >= 2 && v.alterJahre <= 2,
    },
  ],
  witnesses: {
    g1: { absender: 2, tonfall: 1, quellenAnzahl: 0, alterJahre: 10 },
    g2: { absender: 0, tonfall: 0, quellenAnzahl: 2, alterJahre: 1 },
    g3: { absender: 2, tonfall: 1, quellenAnzahl: 2, alterJahre: 1 },
  },
  view: {
    handles: {
      belegeHandle: {
        x: "quellenAnzahl",
        drag(point): Partial<LabValues> {
          const t = clamp((point.x - 50) / 180, 0, 1);
          return { quellenAnzahl: clamp(Math.round(t * 3), 0, 3) };
        },
      },
      alterHandle: {
        x: "alterJahre",
        drag(point): Partial<LabValues> {
          const t = clamp((point.x - 280) / 190, 0, 1);
          return { alterJahre: clamp(Math.round(t * 12), 0, 12) };
        },
      },
    },
    render(v) {
      const topOk = v.absender === 2 && v.tonfall === 1;
      const allOk = topOk && v.quellenAnzahl >= 2 && v.alterJahre <= 2;
      const headline =
        v.tonfall === 1
          ? "Trinkwasserbericht 2026: Messwerte im Überblick"
          : "SCHOCK-BERICHT: DAS VERSCHWEIGEN SIE DIR!!";
      const sender =
        v.absender === 2
          ? "Hrsg.: Landesamt für Umwelt · Impressum vollständig"
          : v.absender === 1
            ? "Gesponsert von Filter-Profi GmbH (Anzeige)"
            : "Unbekannter Blog · kein Impressum";

      const bx = 50 + (v.quellenAnzahl / 3) * 180;
      const ax = 280 + (v.alterJahre / 12) * 190;

      let out = open("Quellen-Prüfer");
      out += rect(20, 16, W - 40, 134, allOk ? "lab-fill-ok" : "lab-panel", 'rx="12"');
      out += text(36, 46, headline.slice(0, 48), v.tonfall === 1 ? "lab-text-ok" : "lab-text-bad");
      out += text(36, 72, sender, v.absender === 2 ? "lab-text-small" : "lab-text-b");
      out += text(
        36,
        102,
        `Belege: ${v.quellenAnzahl}  ·  Alter: ${v.alterJahre} ${v.alterJahre === 1 ? "Jahr" : "Jahre"}`,
        v.quellenAnzahl >= 2 && v.alterJahre <= 2 ? "lab-text-ok" : "lab-text-muted",
      );
      out += rect(36, 114, W - 72, 24, allOk ? "lab-fill-ok" : "lab-bad", 'rx="6"');
      out += text(260, 130, allOk ? "✓ Hohe Informationsqualität bestätigt" : "✗ Prüfkriterien noch nicht alle erfüllt", allOk ? "lab-text-ok" : "lab-text-bad", "middle");

      // Zwei getrennte Regler im SVG
      out += rect(20, 174, 230, 130, "lab-shape", 'rx="10"');
      out += text(135, 198, "Unabhängige Belege", "lab-text", "middle");
      out += line(50, 236, 230, 236, "lab-thin");
      out += `<g class="lab-handle lab-handle-a" data-handle="belegeHandle" tabindex="0" role="slider" aria-label="Anzahl Belege" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${v.quellenAnzahl}">`;
      out += `<circle cx="${bx}" cy="236" r="16" class="lab-handle-hit" />`;
      out += `<circle cx="${bx}" cy="236" r="7.5" class="lab-handle-dot" />`;
      out += text(bx, 266, `${v.quellenAnzahl} Quellen`, v.quellenAnzahl >= 2 ? "lab-text-ok" : "lab-text-bad", "middle");
      out += "</g>";

      out += rect(270, 174, 230, 130, "lab-shape", 'rx="10"');
      out += text(385, 198, "Alter des Beitrags", "lab-text", "middle");
      out += line(280, 236, 470, 236, "lab-thin");
      out += `<g class="lab-handle lab-handle-b" data-handle="alterHandle" tabindex="0" role="slider" aria-label="Alter in Jahren" aria-valuemin="0" aria-valuemax="12" aria-valuenow="${v.alterJahre}">`;
      out += `<circle cx="${ax}" cy="236" r="16" class="lab-handle-hit" />`;
      out += `<circle cx="${ax}" cy="236" r="7.5" class="lab-handle-dot" />`;
      out += text(ax, 266, `${v.alterJahre} J.`, v.alterJahre <= 2 ? "lab-text-ok" : "lab-text-bad", "middle");
      out += "</g>";

      out += text(260, 326, "Ziehe die Punkte oder nutze die Auswahlfelder unten.", "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
};

// ─── Lab 3: Urheberrecht & Creative-Commons-Lizenzprüfer ─────────────────────

interface LicenseCheck {
  allowed: boolean;
  badges: string[];
  reason: string;
}

const LICENSE_NAMES = [
  "Alle Rechte vorbehalten",
  "CC0 (gemeinfrei)",
  "CC BY",
  "CC BY-SA",
  "CC BY-NC",
  "CC BY-ND",
] as const;

const USAGE_NAMES = [
  "Unverändert + Quelle",
  "Bearbeiten + Quelle",
  "Kommerziell nutzen",
  "Ohne Urhebernennung",
] as const;

function checkLicense(lizenz: number, nutzung: number): LicenseCheck {
  const badgeMap: string[][] = [
    ["© geschützt"],
    ["CC0", "frei"],
    ["CC", "BY"],
    ["CC", "BY", "SA"],
    ["CC", "BY", "NC"],
    ["CC", "BY", "ND"],
  ];
  const badges = badgeMap[lizenz] ?? ["?"];
  if (lizenz === 0) {
    return {
      allowed: false,
      badges,
      reason: "Ohne Erlaubnis oder freie Lizenz darf ein fremdes Werk nicht frei weiterverwendet werden.",
    };
  }
  if (lizenz === 1) {
    return {
      allowed: true,
      badges,
      reason: "CC0 ist gemeinfrei: Nutzung und Bearbeitung sind frei, eine Fundstelle anzugeben ist dennoch sauber.",
    };
  }
  if (nutzung === 3) {
    return {
      allowed: false,
      badges,
      reason: "Das Kürzel BY verlangt bei jeder Verwendung eine klare Namensnennung des Urhebers.",
    };
  }
  if (lizenz === 4 && nutzung === 2) {
    return {
      allowed: false,
      badges,
      reason: "NC (Non-Commercial) verbietet kommerzielle Zwecke und Verkaufsaktionen.",
    };
  }
  if (lizenz === 5 && nutzung === 1) {
    return {
      allowed: false,
      badges,
      reason: "ND (No Derivatives) verbietet das Bearbeiten, Zuschneiden oder Verändern des Werks.",
    };
  }
  if (lizenz === 3 && nutzung === 1) {
    return {
      allowed: true,
      badges,
      reason: "Erlaubt mit Namensnennung – das neue Werk muss aber wieder unter derselben Lizenz (SA) stehen.",
    };
  }
  return {
    allowed: true,
    badges,
    reason: "Diese Nutzung erfüllt die gewählten Creative-Commons-Bedingungen vollständig.",
  };
}

const ccWerkstattLab: LabDefinition = {
  kind: "ms6-cc-werkstatt",
  title: "Creative-Commons-Lizenzprüfer",
  intro:
    "Teste verschiedene Creative-Commons-Lizenzen gegen vier Nutzungswünsche und beobachte, welche Kürzel (BY, SA, NC, ND) eine Handlung erlauben oder verbieten.",
  params: [
    {
      key: "lizenz",
      type: "choice",
      label: "Lizenz des fremden Bildes",
      options: LICENSE_NAMES.map((label, value) => ({ value, label })),
      value: 0,
    },
    {
      key: "nutzung",
      type: "choice",
      label: "Geplante Nutzung",
      options: [
        { value: 0, label: "Unverändert einfügen (mit vollständiger Quelle)" },
        { value: 1, label: "Bild zuschneiden / beschriften (Bearbeiten + Quelle)" },
        { value: 2, label: "Auf verkauften Heften / Shirts nutzen (kommerziell)" },
        { value: 3, label: "Im Internet ohne Namensnennung posten" },
      ],
      value: 3,
    },
  ],
  readouts: [
    {
      key: "status",
      label: "Ergebnis",
      emphasis: true,
      compute: (v) => (checkLicense(v.lizenz, v.nutzung).allowed ? "Erlaubt" : "Nicht erlaubt"),
    },
    {
      key: "hinweis",
      label: "Begründung",
      compute: (v) => checkLicense(v.lizenz, v.nutzung).reason,
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Wähle das Bearbeiten mit Quelle und eine CC-Lizenz, die Bearbeitungen erlaubt.",
      check: (v) => v.nutzung === 1 && checkLicense(v.lizenz, v.nutzung).allowed,
    },
    {
      id: "g2",
      text: "Prüfe beim Bearbeiten gezielt CC BY-ND und erkenne, warum ND das Bearbeiten verbietet.",
      check: (v) => v.nutzung === 1 && v.lizenz === 5,
    },
    {
      id: "g3",
      text: "Finde das Modell, bei dem sogar eine Nutzung ohne Pflicht-Namensnennung erlaubt ist.",
      check: (v) => v.nutzung === 3 && v.lizenz === 1,
    },
  ],
  witnesses: {
    g1: { lizenz: 2, nutzung: 1 },
    g2: { lizenz: 5, nutzung: 1 },
    g3: { lizenz: 1, nutzung: 3 },
  },
  view: {
    render(v) {
      const res = checkLicense(v.lizenz, v.nutzung);
      let out = open("Creative-Commons-Lizenzprüfer");
      out += rect(24, 20, W - 48, 96, "lab-panel", 'rx="12"');
      out += text(42, 48, `Lizenz: ${LICENSE_NAMES[v.lizenz]}`, "lab-text-big");
      let bx = 42;
      res.badges.forEach((badge) => {
        const bw = Math.max(72, badge.length * 10 + 28);
        out += rect(bx, 62, bw, 34, "lab-fill-a", 'rx="17"');
        out += text(bx + bw / 2, 84, badge, "lab-text-a", "middle");
        bx += bw + 10;
      });

      out += rect(24, 134, W - 48, 56, "lab-shape", 'rx="10"');
      out += text(42, 166, `Plan: ${USAGE_NAMES[v.nutzung]}`, "lab-text");

      out += rect(24, 208, W - 48, 108, res.allowed ? "lab-fill-ok" : "lab-bad", 'rx="12"');
      out += text(260, 240, res.allowed ? "✓ Nutzung erlaubt" : "✗ Nutzung nicht erlaubt", res.allowed ? "lab-text-ok" : "lab-text-bad", "middle");
      out += text(260, 272, res.reason.slice(0, 62), "lab-text-small", "middle");
      if (res.reason.length > 62) {
        out += text(260, 292, res.reason.slice(62, 124), "lab-text-small", "middle");
      }
      return `${out}</svg>`;
    },
  },
};

// ─── Lab 4: Personenbezogene Daten (Sortier-Werkstatt) ────────────────────────

const datenLab = caseLab({
  kind: "ms6-daten-werkstatt",
  title: "Datenschutz-Werkstatt im Schulalltag",
  intro: "Ordne jeden Alltagssachverhalt der passenden Bewertung zu.",
  categories: [
    "Personenbezogene Daten (besonders schützen)",
    "Allgemeine Sachangabe (unbedenklich)",
    "Sicherheitsrisiko bzw. Rechtsverstoß",
  ],
  cases: [
    {
      short: "Name, Adresse und Geburtsdatum",
      text: "Vollständiger Name, Wohnadresse und Geburtsdatum in einem Online-Formular",
      answer: 0,
      why: "Diese Angaben identifizieren eine bestimmte Person direkt und gehören zu den personenbezogenen Daten.",
      hint: "Kann man damit genau herausfinden, wer gemeint ist und wo die Person wohnt?",
    },
    {
      short: "Juli-Temperatur in Bayern",
      text: "Die durchschnittliche Tagestemperatur im Juli in Bayern (20 Grad Celsius)",
      answer: 1,
      why: "Das ist eine allgemeine Wetterangabe ohne Bezug zu einer einzelnen Person.",
      hint: "Lässt sich aus einer Landestemperatur eine bestimmte Person erkennen?",
    },
    {
      short: "Video eines Mitschülers teilen",
      text: "Ohne zu fragen ein Video eines Mitschülers im Klassenchat weiterleiten",
      answer: 2,
      why: "Das Recht am eigenen Bild schützt Fotos und Videos – Verbreitung ohne Einwilligung ist ein Verstoß.",
      hint: "Darf man Bild- oder Videoaufnahmen anderer einfach ohne deren Zustimmung verschicken?",
    },
    {
      short: "Schulrechner offen lassen",
      text: "Den eigenen Schul-Account nach der Stunde im Computerraum offen stehen lassen",
      answer: 2,
      why: "Unberechtigte Dritte könnten auf deine Dateien und Nachrichten zugreifen – immer abmelden oder sperren.",
      hint: "Was kann passieren, wenn nach dir die nächste Gruppe am selben Platz sitzt?",
    },
    {
      short: "Standortverlauf & Handynummer",
      text: "Standortverlauf und private Handynummer für eine einfache Spiel-App freigeben",
      answer: 0,
      why: "Handynummer und Bewegungsprofil sind personenbezogene Daten, die eine Spiele-App nach Datensparsamkeit nicht braucht.",
      hint: "Bewegungsdaten und Telefonnummern verweisen direkt auf dich.",
    },
    {
      short: "Öffnungszeiten Stadtbücherei",
      text: "Öffnungszeiten der Stadtbücherei auf der öffentlichen Webseite der Gemeinde",
      answer: 1,
      why: "Öffnungszeiten einer Einrichtung betreffen keine einzelne Privatperson.",
      hint: "Geht es um eine Privatperson oder um allgemeine Öffnungszeiten?",
    },
  ],
  goals: [
    { text: "Erkenne beide schützenswerten personenbezogenen Datensätze (Fall 1 und Fall 5).", cases: [0, 4] },
    { text: "Erkenne beide Sicherheitsrisiken bzw. Rechtsverstöße (Fall 3 und Fall 4).", cases: [2, 3] },
    { text: "Ordne alle sechs Fälle richtig ein.", cases: [0, 1, 2, 3, 4, 5] },
  ],
});

// ─── Lab 5: Passwörter & Schutz vor Schadsoftware ────────────────────────────

function charsetSize(code: number): number {
  return [26, 52, 62, 80][code] ?? 26;
}

function samplePassword(v: LabValues): string {
  const pool =
    v.persoenlich === 0
      ? "max2014geheim!!!"
      : v.zeichensatz === 0
        ? "sonneblumewaldxx"
        : v.zeichensatz === 1
          ? "SonneBlumeWaldXx"
          : v.zeichensatz === 2
            ? "Sonne7Blume4Wald"
            : "Mk6!sZ9#pW3?bL2&";
  return pool.slice(0, v.laenge);
}

function comboMagnitude(alphabet: number, len: number): string {
  const log10 = len * Math.log10(alphabet);
  if (log10 < 6) return `ca. ${fmt(Math.round(alphabet ** len), 0)}`;
  if (log10 < 9) return `ca. ${fmt(Math.round(alphabet ** len / 1e6), 0)} Mio.`;
  if (log10 < 12) return `ca. ${fmt(Math.round(alphabet ** len / 1e9), 0)} Mrd.`;
  if (log10 < 15) return `über ${fmt(Math.floor(alphabet ** len / 1e12), 0)} Bio.`;
  return `über 10^${Math.floor(log10)} Möglichkeiten`;
}

const passwortLab: LabDefinition = {
  kind: "ms6-passwort-labor",
  title: "Passwort- und Geräteschutz-Labor",
  intro:
    "Stelle Länge, Zeichenarten, Merksatz-Regel und Geräteschutz ein. Ziehe den Punkt für die Passwortlänge.",
  params: [
    {
      key: "laenge",
      type: "range",
      label: "Passwortlänge",
      unit: "Zeichen",
      min: 4,
      max: 16,
      step: 1,
      value: 6,
    },
    {
      key: "zeichensatz",
      type: "choice",
      label: "Verwendete Zeichenarten",
      options: [
        { value: 0, label: "Nur Kleinbuchstaben (26)" },
        { value: 1, label: "Groß- und Kleinbuchstaben (52)" },
        { value: 2, label: "Buchstaben + Ziffern (62)" },
        { value: 3, label: "Groß + Klein + Ziffern + Sonderzeichen (80)" },
      ],
      value: 0,
    },
    {
      key: "persoenlich",
      type: "choice",
      label: "Aufbau des Passworts",
      options: [
        { value: 0, label: "Vorname / Geburtsjahr enthalten" },
        { value: 1, label: "Merksatz ohne persönliche Daten" },
      ],
      value: 0,
    },
    {
      key: "schutz",
      type: "choice",
      label: "Virenschutz und Updates",
      options: [
        { value: 0, label: "Ausgeschaltet / Updates aufgeschoben" },
        { value: 1, label: "Virenschutz aktuell & Updates aktiviert" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "kombis",
      label: "Mögliche Kombinationen",
      compute: (v) => comboMagnitude(charsetSize(v.zeichensatz), v.laenge),
    },
    {
      key: "status",
      label: "Schutzniveau",
      emphasis: true,
      compute: (v) =>
        v.laenge >= 12 && v.zeichensatz === 3 && v.persoenlich === 1 && v.schutz === 1
          ? "Sehr gut geschützt"
          : v.persoenlich === 0
            ? "Leicht erratbar (persönliche Daten!)"
            : "Noch Lücken im Schutz",
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Wähle mindestens 12 Zeichen Länge und alle vier Zeichenarten.",
      check: (v) => v.laenge >= 12 && v.zeichensatz === 3,
    },
    {
      id: "g2",
      text: "Nutze die Merksatz-Methode ohne persönliche Daten und aktiviere Virenschutz + Updates.",
      check: (v) => v.persoenlich === 1 && v.schutz === 1,
    },
    {
      id: "g3",
      text: "Erfülle alle vier Schutzmaßnahmen gleichzeitig (‚Sehr gut geschützt‘).",
      check: (v) => v.laenge >= 12 && v.zeichensatz === 3 && v.persoenlich === 1 && v.schutz === 1,
    },
  ],
  witnesses: {
    g1: { laenge: 12, zeichensatz: 3, persoenlich: 0, schutz: 0 },
    g2: { laenge: 6, zeichensatz: 0, persoenlich: 1, schutz: 1 },
    g3: { laenge: 14, zeichensatz: 3, persoenlich: 1, schutz: 1 },
  },
  view: {
    handles: {
      laengeHandle: {
        x: "laenge",
        drag(point): Partial<LabValues> {
          const t = clamp((point.x - 44) / 432, 0, 1);
          return { laenge: clamp(Math.round(4 + t * 12), 4, 16) };
        },
      },
    },
    render(v) {
      const pwOk = v.laenge >= 12 && v.zeichensatz === 3 && v.persoenlich === 1;
      const allOk = pwOk && v.schutz === 1;
      const hx = 44 + ((v.laenge - 4) / 12) * 432;
      const sample = samplePassword(v);
      let out = open("Passwort- und Geräteschutz-Labor");
      out += rect(24, 18, W - 48, 66, pwOk ? "lab-fill-ok" : "lab-panel", 'rx="12"');
      out += text(260, 44, `Beispiel: ${sample}`, "lab-text-big", "middle");
      out += text(
        260,
        68,
        `${v.laenge} Zeichen · Zeichenvorrat ${charsetSize(v.zeichensatz)} (${comboMagnitude(charsetSize(v.zeichensatz), v.laenge)})`,
        "lab-text-small",
        "middle",
      );

      // Längen-Handle
      out += line(44, 114, 476, 114, "lab-thin");
      out += rect(44 + ((12 - 4) / 12) * 432, 108, 432 - ((12 - 4) / 12) * 432, 12, "lab-fill-ok", 'rx="6"');
      out += `<g class="lab-handle lab-handle-a" data-handle="laengeHandle" tabindex="0" role="slider" aria-label="Passwortlänge" aria-valuemin="4" aria-valuemax="16" aria-valuenow="${v.laenge}">`;
      out += `<circle cx="${hx}" cy="114" r="16" class="lab-handle-hit" />`;
      out += `<circle cx="${hx}" cy="114" r="7.5" class="lab-handle-dot" />`;
      out += text(hx, 142, `${v.laenge} Zeichen`, v.laenge >= 12 ? "lab-text-ok" : "lab-text-bad", "middle");
      out += "</g>";

      // Vier Schutz-Kacheln
      const checks = [
        { label: "Länge ≥ 12", ok: v.laenge >= 12 },
        { label: "4 Zeichenarten", ok: v.zeichensatz === 3 },
        { label: "Keine Privatdaten", ok: v.persoenlich === 1 },
        { label: "Virenschutz & Updates", ok: v.schutz === 1 },
      ];
      checks.forEach((c, i) => {
        const cx = 24 + (i % 2) * 242;
        const cy = 162 + Math.floor(i / 2) * 56;
        out += rect(cx, cy, 230, 44, c.ok ? "lab-fill-ok" : "lab-bad", 'rx="10"');
        out += text(cx + 115, cy + 27, `${c.ok ? "✓" : "✗"} ${c.label}`, c.ok ? "lab-text-ok" : "lab-text-bad", "middle");
      });

      out += rect(24, 282, W - 48, 36, allOk ? "lab-fill-ok" : "lab-shape", 'rx="10"');
      out += text(260, 305, allOk ? "Schutz vollständig: Starkes Passwort + aktueller Geräteschutz" : "Mindestens ein Kriterium ist noch ungeschützt", allOk ? "lab-text-ok" : "lab-text-muted", "middle");
      return `${out}</svg>`;
    },
  },
};

// ─── Lab 6: Bedeutung von Datensicherung ─────────────────────────────────────

function backupOutcome(v: LabValues): { status: string; ok: boolean; detail: string } {
  if (v.ereignis === 0) {
    return { status: "Normalbetrieb", ok: v.ort >= 2 && v.intervall <= 7, detail: "Teste nun einen Störfall, um die Datensicherung zu prüfen." };
  }
  if (v.ereignis === 1) {
    return v.ort >= 2
      ? { status: "Daten gerettet", ok: true, detail: "Getrennter Speicher überlebt den Defekt der internen Festplatte." }
      : { status: "Datenverlust!", ok: false, detail: "Kopie auf derselben Festplatte fällt beim Hardwaredefekt mit aus." };
  }
  if (v.ereignis === 2) {
    return v.ort === 3
      ? { status: "Daten gerettet", ok: true, detail: "Die getrennte Schulcloud schützt vor Verschlüsselung lokal verbundener Medien." }
      : { status: "Daten gefährdet!", ok: false, detail: "Schadsoftware kann am Laptop angeschlossene Medien mit verschlüsseln." };
  }
  if (v.ort === 0) {
    return { status: "Daten verloren!", ok: false, detail: "Ohne jede Sicherung ist die versehentlich gelöschte Datei weg." };
  }
  return v.intervall <= 7
    ? { status: "Daten aktuell gerettet", ok: true, detail: `Höchstens ${v.intervall} ${v.intervall === 1 ? "Tag" : "Tage"} Arbeitsstand betroffen.` }
    : { status: "Große Datenlücke!", ok: false, detail: `Letzte Sicherung vor ${v.intervall} Tagen – wochenlange Arbeit fehlt.` };
}

const backupLab: LabDefinition = {
  kind: "ms6-backup-labor",
  title: "Datensicherungs-Simulator",
  intro:
    "Wähle Speicherort, Sicherungsabstand und teste verschiedene Schadensfälle, um echte Datensicherung von Scheinsicherheit zu unterscheiden.",
  params: [
    {
      key: "ort",
      type: "choice",
      label: "Wo liegen deine Dateien?",
      options: [
        { value: 0, label: "Nur ein Ordner auf dem Laptop" },
        { value: 1, label: "Zweiter Ordner auf derselben Festplatte" },
        { value: 2, label: "Laptop + externer USB-Stick" },
        { value: 3, label: "Laptop + externer USB-Stick + Schulcloud" },
      ],
      value: 0,
    },
    {
      key: "intervall",
      type: "range",
      label: "Sicherungsabstand",
      unit: "Tage",
      min: 1,
      max: 30,
      step: 1,
      value: 30,
    },
    {
      key: "ereignis",
      type: "choice",
      label: "Simulierter Vorfall",
      options: [
        { value: 0, label: "Kein Vorfall (Normalbetrieb)" },
        { value: 1, label: "Festplatte des Laptops ist defekt" },
        { value: 2, label: "Schadsoftware befällt alle angesteckten Laufwerke" },
        { value: 3, label: "Wichtige Projektdatei heute versehentlich gelöscht" },
      ],
      value: 0,
    },
  ],
  readouts: [
    {
      key: "ergebnis",
      label: "Ergebnis nach Vorfall",
      emphasis: true,
      compute: (v) => backupOutcome(v).status,
    },
    {
      key: "erklaerung",
      label: "Auswirkung",
      compute: (v) => backupOutcome(v).detail,
    },
  ],
  goals: [
    {
      id: "g1",
      text: "Prüfe, was bei ‚Festplatte defekt‘ passiert, wenn die Kopie auf demselben Laptop liegt.",
      check: (v) => v.ort <= 1 && v.ereignis === 1,
    },
    {
      id: "g2",
      text: "Rette die Daten beim Festplattendefekt durch ein getrenntes Speichermedium.",
      check: (v) => v.ort >= 2 && v.ereignis === 1,
    },
    {
      id: "g3",
      text: "Sichere höchstens alle 7 Tage auf zwei getrennten Wegen (Stick + Schulcloud) und bestehe den Schadsoftware-Test.",
      check: (v) => v.ort === 3 && v.intervall <= 7 && v.ereignis === 2,
    },
  ],
  witnesses: {
    g1: { ort: 1, intervall: 30, ereignis: 1 },
    g2: { ort: 2, intervall: 30, ereignis: 1 },
    g3: { ort: 3, intervall: 7, ereignis: 2 },
  },
  view: {
    handles: {
      intervallHandle: {
        x: "intervall",
        drag(point): Partial<LabValues> {
          const t = clamp((point.x - 44) / 432, 0, 1);
          return { intervall: clamp(Math.round(1 + t * 29), 1, 30) };
        },
      },
    },
    render(v) {
      const res = backupOutcome(v);
      const laptopOk = v.ereignis === 0;
      const stickOk = v.ort >= 2 && v.ereignis !== 2;
      const cloudOk = v.ort === 3;
      const hx = 44 + ((v.intervall - 1) / 29) * 432;

      let out = open("Datensicherungs-Simulator");
      const places = [
        { x: 24, title: "Laptop-Festplatte", active: true, safe: laptopOk, note: v.ort === 1 ? "2 Ordner (selbe Platte)" : "Originaldatei" },
        { x: 184, title: "Externer USB-Stick", active: v.ort >= 2, safe: stickOk, note: v.ort >= 2 ? "Getrenntes Medium" : "Nicht genutzt" },
        { x: 344, title: "Schulcloud", active: v.ort === 3, safe: cloudOk, note: v.ort === 3 ? "Räumlich getrennt" : "Nicht genutzt" },
      ];
      places.forEach((p) => {
        const cls = !p.active ? "lab-shape" : p.safe ? "lab-fill-ok" : "lab-bad";
        out += rect(p.x, 22, 150, 96, cls, 'rx="10"');
        out += text(p.x + 75, 52, p.title, "lab-text-small", "middle");
        out += text(p.x + 75, 76, !p.active ? "—" : p.safe ? "✓ intakt" : "✗ betroffen", !p.active ? "lab-text-muted" : p.safe ? "lab-text-ok" : "lab-text-bad", "middle");
        out += text(p.x + 75, 100, p.note, "lab-text-small", "middle");
      });

      out += rect(24, 140, W - 48, 72, res.ok ? "lab-fill-ok" : v.ereignis === 0 ? "lab-panel" : "lab-bad", 'rx="12"');
      out += text(260, 170, res.status, res.ok ? "lab-text-ok" : v.ereignis === 0 ? "lab-text-big" : "lab-text-bad", "middle");
      out += text(260, 196, res.detail.slice(0, 68), "lab-text-small", "middle");

      out += text(44, 246, "Sicherungsabstand: jeder 1. bis 30. Tag", "lab-text-small");
      out += line(44, 272, 476, 272, "lab-thin");
      out += rect(44, 266, ((7 - 1) / 29) * 432, 12, "lab-fill-ok", 'rx="6"');
      out += `<g class="lab-handle lab-handle-a" data-handle="intervallHandle" tabindex="0" role="slider" aria-label="Sicherungsabstand in Tagen" aria-valuemin="1" aria-valuemax="30" aria-valuenow="${v.intervall}">`;
      out += `<circle cx="${hx}" cy="272" r="16" class="lab-handle-hit" />`;
      out += `<circle cx="${hx}" cy="272" r="7.5" class="lab-handle-dot" />`;
      out += text(hx, 302, `alle ${v.intervall} Tage`, v.intervall <= 7 ? "lab-text-ok" : "lab-text-bad", "middle");
      out += "</g>";
      return `${out}</svg>`;
    },
  },
};

// ─── Stage 1 Definition ───────────────────────────────────────────────────────

export const STAGE_INFORMATIONSAUSTAUSCH: Stage = {
  id: STAGE_ID,
  stageNumber: 1,
  title: "Digitaler Informationsaustausch",
  subtitle: "Suchstrategien, Informationsqualität, Urheberrecht, Datenschutz, Passwörter und Datensicherung",
  icon: "🔍",
  accent: "#0f766e",
  badgeTitle: "Sicherer Informationsprofi",
  lehrplanLabel: "Inf6 LB 1",
  module: "1",
  lessons: [
    lesson(STAGE_ID, "1", 1, {
      id: "ms6-suchstrategien",
      title: "Verfeinerte Suchstrategien",
      subtitle: "Exakte Wortfolgen, Begriffe ausschließen, Seiten- und Zeitfilter gezielt kombinieren",
      why: "Wer nur ein einzelnes Wort eintippt, bekommt Millionen Treffer voller Werbung – mit Suchoperatoren findest du in Sekunden passende Fachseiten.",
      html: `<p>In Klasse 5 hast du bereits erste Internetdienste genutzt und einfache Begriffe in eine Suchmaschine eingegeben. In Klasse 6 lernst du <strong>verfeinerte Suchstrategien</strong>, damit du auch bei schwierigen Schulthemen zielgenau verlässliche Treffer findest.</p>
<ul>
<li><strong>Gezielte Stichwörter:</strong> Verzichte auf lange Fragesätze und kombiniere treffende Fachwörter (z. B. <code>biber lebensraum bayern</code> statt „Wo wohnt eigentlich der Biber?“).</li>
<li><strong>Exakte Wortfolge <code>"..."</code>:</strong> Wörter in Anführungszeichen sucht die Maschine genau in dieser Reihenfolge nebeneinander, etwa <code>"biber in bayern"</code>.</li>
<li><strong>Begriffe ausschließen <code>−wort</code>:</strong> Ein Minus direkt vor einem Wort (ohne Leerzeichen dazwischen, auf der Tastatur <code>-wort</code>) blendet unerwünschte Bedeutungen aus, z. B. <code>−bettwäsche −shop</code>.</li>
<li><strong>Webseiten einschränken <code>site:</code>:</strong> Mit <code>site:bayern.de</code> oder <code>site:.de</code> durchsuchst du gezielt bestimmte Seitenbereiche, z. B. amtliche Landesstellen.</li>
<li><strong>Dateityp &amp; Zeitraum:</strong> Mit <code>filetype:pdf</code> findest du gezielt Arbeitsblätter oder Berichte; über die Filter der Suchmaschine grenzst du Treffer auf aktuelle Jahre ein.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Die Suche <code>biber bayern</code> zeigt auch Bettwäsche-Shops und Kinderlieder. Erst die verfeinerte Abfrage <code>"biber in bayern" −bettwäsche −shop site:bayern.de</code> liefert gezielt aktuelle Fachseiten bayerischer Umweltämter.</div>
<div class="merke"><strong>Merke:</strong> Mit Anführungszeichen (<code>"..."</code>), Ausschluss (<code>−wort</code> ohne Leerzeichen), Domain-Filter (<code>site:</code>), Dateityp (<code>filetype:</code>) und Zeitraum filterst du Treffer gezielt vor.</div>`,
      rule: 'Exakte Wortfolge ("...") + Ausschluss (−wort) + Domain/Typ (site:, filetype:) = präzise Treffer',
      terms: [
        ['Exakte Wortfolge ("...")', 'Findet die Wörter exakt in dieser Reihenfolge', 'Verhindert verstreute Zufallstreffer'],
        ["Ausschluss (−wort)", "Blendet Treffer mit diesem Wort aus (ohne Leerzeichen nach dem Minus)", "Auf der Tastatur mit Bindestrich -wort"],
        ["Domain- und Dateifilter", "site:domain.de begrenzt die Seite · filetype:pdf sucht PDF-Dateien", "Ideal für amtliche Berichte und Merkblätter"],
      ],
      quiz: [
        "Mit welcher Eingabe schließt du bei der Suche nach dem Tier ‚Jaguar‘ gezielt alle Autohäuser aus?",
        "jaguar −auto",
        "jaguar − auto",
        "jaguar ohne auto",
        "Nur ein Minuszeichen direkt ohne Leerzeichen vor dem unerwünschten Wort (−auto) schließt dieses Wort sauber aus.",
      ],
      lab: suchLab,
      exercises: [
        cases(
          "ms6-suche-operatoren",
          [
            cc(
              "Du suchst genau nach dem Buchtitel ‚Der rote Faden‘ und willst keine Seiten, auf denen die drei Wörter irgendwo verstreut stehen.",
              '"Der rote Faden"',
              ["Der −rote −Faden", "site:Der_rote_Faden"],
              "Anführungszeichen erzwingen genau diese zusammenhängende Wortfolge.",
              "Welches Zeichenpaar hält mehrere Wörter genau in ihrer Reihenfolge zusammen?",
            ),
            cc(
              "Bei der Suche nach ‚Apfel‘ für Biologie erscheinen nur Technik-Seiten über Smartphones. Was ergänzt du am sinnvollsten?",
              "apfel baum −iphone −handy",
              ["apfel +iphone +handy", "site:apfel.com"],
              "Mit dem Minuszeichen direkt vor den Störwörtern verschwinden die Smartphone-Treffer.",
              "Wie blendest du ein störendes Thema aus der Trefferliste aus?",
            ),
            cc(
              "Du möchtest nur Informationsblätter im PDF-Format zum Thema Hochwasserschutz finden.",
              "hochwasserschutz filetype:pdf",
              ["hochwasserschutz −pdf", '"filetype pdf"'],
              "Der Operator filetype:pdf filtert gezielt auf PDF-Dokumente.",
              "Welcher Suchoperator wählt ein bestimmtes Dateiformat aus?",
            ),
          ],
          [
            cc(
              "Für GPG suchst du ein offizielles PDF zum Thema Jugendschutz direkt von einer bayerischen Landesbehörde (Endung bayern.de), ohne Zeitungsartikel. Welche Kombination passt?",
              "jugendschutz site:bayern.de filetype:pdf",
              ['"jugendschutz bayern" −pdf', "jugendschutz −site:bayern.de"],
              "site:bayern.de begrenzt die Quelle auf Landesbehörden und filetype:pdf wählt gezielt offizielle Infoblätter.",
              "Kombiniere den Webseiten-Filter für Bayern mit dem passenden Dateityp-Operator.",
            ),
            cc(
              "Eine Schülerin tippt ‚Was ist eigentlich der Unterschied zwischen einem Laptop und einem Tablet bitte?‘ ein und findet unübersichtliche Foren. Was verbessert die Suche am stärksten?",
              "Füllwörter weglassen und gezielte Fachbegriffe wie ‚laptop tablet unterschied‘ nutzen",
              ["Alle Wörter in Großbuchstaben schreiben", "Jedes einzelne Wort in eigene Anführungszeichen setzen"],
              "Suchmaschinen arbeiten mit klaren Schlüsselwörtern viel genauer als mit umgangssprachlichen Füllwörtern.",
              "Braucht eine Suchmaschine höfliche Sätze oder klare Schlüsselwörter?",
            ),
            cc(
              "Für das Jahr 2026 suchst du aktuelle Fahrradregeln und findest viele veraltete Texte aus 2011. Was hilft am zuverlässigsten?",
              "In den Suchfiltern den Zeitraum auf das letzte Jahr eingrenzen",
              ["Die alte Seite zehnmal neu laden", "Den Suchbegriff dreimal hintereinander eintippen"],
              "Der Zeitfilter der Suchmaschine sortiert überholte Treffer aus früheren Jahren aus.",
              "Welches Werkzeug der Suchmaschine schließt veraltete Beiträge aus?",
            ),
          ],
        ),
        {
          id: "ms6-suche-anfrage-bauen",
          make(rng, level) {
            if (level === 1) {
              const casesL1 = [
                {
                  topic: "den Schutz des Eisvogels",
                  phrase: '"eisvogel schutz"',
                  exclude: "restaurant",
                  answer: '"eisvogel schutz" −restaurant',
                  alt: '−restaurant "eisvogel schutz"',
                  noQuotes: "eisvogel schutz −restaurant",
                },
                {
                  topic: "die historische Altstadt von Regensburg",
                  phrase: '"altstadt regensburg"',
                  exclude: "hotel",
                  answer: '"altstadt regensburg" −hotel',
                  alt: '−hotel "altstadt regensburg"',
                  noQuotes: "altstadt regensburg −hotel",
                },
                {
                  topic: "das richtige Verhalten bei Gewitter",
                  phrase: '"verhalten bei gewitter"',
                  exclude: "roman",
                  answer: '"verhalten bei gewitter" −roman',
                  alt: '−roman "verhalten bei gewitter"',
                  noQuotes: "verhalten bei gewitter −roman",
                },
              ];
              const item = rng.pick(casesL1);
              return {
                prompt: `Baue eine verfeinerte Suchanfrage für ${item.topic} als exakte Wortfolge und schließe Treffer zum Wort „${item.exclude}“ aus.`,
                given: [
                  `Exakte Wortfolge: ${item.phrase}`,
                  `Auszuschließen: ${item.exclude}`,
                ],
                formulaHint: 'Setze die exakte Wortfolge in "..." und stelle direkt vor das auszuschließende Wort ein − (oder -).',
                fields: [
                  textField(
                    "Suchanfrage",
                    [item.answer, item.alt],
                    'z. B. "wortfolge" -ausschluss',
                    [
                      [item.noQuotes, 'Vergiss die Anführungszeichen "..." um die exakte Wortfolge nicht.'],
                      [`${item.phrase} ${item.exclude}`, `Setze direkt vor „${item.exclude}“ das Minuszeichen (− oder -).`],
                    ],
                  ),
                ],
                steps: [
                  `Exakte Wortfolge mit Anführungszeichen: ${item.phrase}`,
                  `Ausschluss direkt mit Minus davor: −${item.exclude}`,
                  `<strong>${item.answer}</strong>`,
                ],
              };
            }
            const casesL2 = [
              {
                thema: "ein PDF zu Wasserkraft auf der Domain bayern.de ohne Werbung",
                a1: "wasserkraft site:bayern.de filetype:pdf −werbung",
                a2: "wasserkraft filetype:pdf site:bayern.de −werbung",
                a3: '"wasserkraft" site:bayern.de filetype:pdf −werbung',
                noSite: "wasserkraft filetype:pdf −werbung",
                noPdf: "wasserkraft site:bayern.de −werbung",
              },
              {
                thema: "die exakte Wortfolge ‚solarenergie schule‘ auf der Domain bildung.de als PDF",
                a1: '"solarenergie schule" site:bildung.de filetype:pdf',
                a2: '"solarenergie schule" filetype:pdf site:bildung.de',
                a3: 'site:bildung.de "solarenergie schule" filetype:pdf',
                noSite: '"solarenergie schule" filetype:pdf',
                noPdf: '"solarenergie schule" site:bildung.de',
              },
            ];
            const item = rng.pick(casesL2);
            return {
              prompt: `Formuliere eine Suchanfrage für ${item.thema}.`,
              given: ["Nutze passende Suchoperatoren ohne überflüssige Füllwörter."],
              fields: [
                textField(
                  "Suchanfrage",
                  [item.a1, item.a2, item.a3],
                  "Suchbegriff site:... filetype:...",
                  [
                    [item.noSite, "Ergänze den Domain-Filter site:... laut Aufgabe."],
                    [item.noPdf, "Vergiss den Dateityp-Filter filetype:pdf nicht."],
                  ],
                ),
              ],
              steps: [
                "Bestimme Hauptbegriff bzw. exakte Wortfolge.",
                "Ergänze site:-Filter, filetype:pdf und gegebenenfalls −ausschluss.",
                `<strong>${item.a1}</strong>`,
              ],
            };
          },
        },
      ],
    }),

    lesson(STAGE_ID, "1", 2, {
      id: "ms6-informationsqualitaet",
      title: "Informationen kritisch prüfen und Medienwirkung einschätzen",
      subtitle: "Qualitätskriterien für digitale Informationen anwenden und Beeinflussung erkennen",
      why: "Im Internet kann jede Person alles veröffentlichen – ohne Qualitätsprüfung übernimmst du Fehler, veraltete Zahlen oder versteckte Werbung.",
      html: `<p>Eine Suchmaschine listet Treffer danach auf, wie gut Schlüsselwörter passen – nicht automatisch danach, ob eine Information richtig oder ausgewogen ist. Darum prüfst du digitales Informationsmaterial anhand klarer <strong>Beurteilungskriterien</strong>:</p>
<ul>
<li><strong>Informationsgehalt:</strong> Bietet die Seite nachprüfbare Fakten, Zahlen und Erklärungen statt leerer Behauptungen?</li>
<li><strong>Vertrauenswürdigkeit der Quelle:</strong> Wer steht hinter der Seite (Impressum, Fachbehörde, Museum, Schulbuchverlag oder anonymer Blog)? Verfolgt der Anbieter eigene Verkaufs- oder Werbeziele?</li>
<li><strong>Aktualität:</strong> Wann wurde der Beitrag verfasst oder zuletzt aktualisiert?</li>
<li><strong>Gegenprüfung (Zweitquelle):</strong> Bestätigen zwei voneinander unabhängige, verlässliche Quellen dieselbe Aussage?</li>
<li><strong>Medienwirkung:</strong> Achte darauf, wie Überschriften in Großbuchstaben, dramatische Musik oder bearbeitete Bilder starke Gefühle wie Angst oder Wut auslösen und dadurch Meinungen steuern sollen.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Ein Video verspricht „DIE WAHRHEIT ÜBER ALLE ENERGY-DRINKS!!“ ohne Namen des Autors und verlinkt direkt auf einen eigenen Shop. Eine Fachseite des Bundeszentrums für Ernährung dagegen nennt Autoren, Datum, Studien und Vor- und Nachteile sachlich.</div>
<div class="merke"><strong>Merke:</strong> Prüfe bei digitalen Informationen stets <strong>Informationsgehalt</strong>, <strong>Vertrauenswürdigkeit (Impressum &amp; Absicht)</strong>, <strong>Aktualität</strong> und eine <strong>Zweitquelle</strong> – und durchschaue emotionale Medienwirkung.</div>`,
      rule: "Qualität = hoher Informationsgehalt + vertrauenswürdige Quelle (Impressum) + Aktualität + Zweitquelle",
      terms: [
        ["Informationsgehalt", "Nachprüfbare Fakten, Zahlen und klare Erklärungen statt bloßer Parolen", "Zeigt, wie ergiebig der Beitrag ist"],
        ["Vertrauenswürdigkeit der Quelle", "Klarer Herausgeber im Impressum, Fachkompetenz, erkennbare Absicht", "Trennt Information von Werbung"],
        ["Medienwirkung", "Gezielter Einsatz von Schlagzeilen, Bildern, Ton und Wortwahl auf Gefühle und Meinung", "Emotionale Aufmachung kritisch hinterfragen"],
      ],
      quiz: [
        "Welche Quelle ist für ein Sachthema in einem Schulreferat am vertrauenswürdigsten?",
        "Eine sachliche Fachseite mit vollständigem Impressum, aktuellem Datum und belegten Zahlen",
        "Ein anonymer Beitrag ohne Namen, der in Großbuchstaben eine Sensation ankündigt",
        "Ein Werbetext eines Herstellers, der nur das eigene Produkt als einzig gutes lobt",
        "Impressum, Sachlichkeit, Aktualität und Belege zeigen, wer verantwortlich ist und worauf sich die Aussagen stützen.",
      ],
      lab: quellenPrueferLab,
      exercises: [
        cases(
          "ms6-qualitaet-kriterien",
          [
            cc(
              "Auf einer Webseite findest du ein beeindruckendes Ergebnis, aber weder Autor noch Impressum und kein Datum. Wie gehst du vor?",
              "Die Aussage nicht ungeprüft übernehmen, sondern in einer zweiten, vertrauenswürdigen Quelle gegenprüfen",
              [
                "Die Zahl trotzdem sofort übernehmen, weil die Seite bunt gestaltet ist",
                "Die URL kürzen und als eigene Messung ausgeben",
              ],
              "Ohne erkennbare Verantwortliche und Aktualität lässt sich die Zuverlässigkeit nicht einschätzen.",
              "Wie prüfst du Aussagen einer unbekannten Seite?",
            ),
            cc(
              "Was erfährst du beim Blick ins Impressum einer Webseite?",
              "Wer die Seite betreibt, wer für den Inhalt verantwortlich ist und wie man den Herausgeber erreicht",
              [
                "Welche Schriftgröße auf deinem Bildschirm eingestellt ist",
                "Wie viele Personen das Bild heute bereits heruntergeladen haben",
              ],
              "Das Impressum benennt Herausgeber und Kontaktadresse – ein zentraler Anhaltspunkt für Seriosität.",
              "Wozu dient das gesetzlich vorgesehene Impressum?",
            ),
            cc(
              "Welche Angabe hilft dir, veraltete Daten auszusortieren?",
              "Das Veröffentlichungs- oder Aktualisierungsdatum des Artikels",
              [
                "Die Anzahl der Werbebanner am Seitenrand",
                "Die Lieblingsfarbe des Webdesigners",
              ],
              "Besonders bei Bevölkerungs-, Technik- oder Umweltzahlen entscheidet das Erstellungsdatum über die Brauchbarkeit.",
              "Welches Merkmal verrät, wie neu eine Information ist?",
            ),
          ],
          [
            cc(
              "Ein sehr professionell wirkender Artikel auf ‚gesund-kaufen.example‘ warnt vor allen normalen Trinkflaschen und empfiehlt ganz am Ende genau eine teure Spezialflasche mit Bestell-Link. Welches Kriterium mahnt zur Vorsicht?",
              "Die Absicht der Quelle ist wirtschaftliche Werbung, nicht neutrale Aufklärung",
              [
                "Der Artikel enthält wahrscheinlich zu viele sachliche Belege",
                "Die Schriftart ist besonders gut lesbar",
              ],
              "Wer eigene Produkte verkauft, hat ein klares Eigeninteresse und wählt Fakten oft einseitig aus.",
              "Frage nach der Absicht des Herausgebers: informieren oder verkaufen?",
            ),
            cc(
              "Du findest eine interessante Zahl aus dem Jahr 2012 zur Smartphone-Nutzung von Jugendlichen. Warum eignet sie sich nicht für einen Bericht über das Jahr 2026?",
              "Wegen mangelnder Aktualität hat sich die Nutzung seither stark verändert",
              [
                "Weil Zahlen aus dem Internet nach fünf Jahren rechtlich ungültig sind",
                "Weil man im Jahr 2012 noch keine Prozentwerte berechnen konnte",
              ],
              "Technik- und Mediennutzung wandeln sich rasch – ein Beleg aus 2012 beschreibt nicht die heutige Situation.",
              "Welches Qualitätskriterium passt bei einer 14 Jahre alten Technikzahl nicht?",
            ),
            cc(
              "Zwei seriöse, voneinander unabhängige Quellen nennen exakt die gleiche Einwohnerzahl, eine dritte kleine Fanseite nennt das Doppelte. Was schließt du daraus?",
              "Die übereinstimmenden verlässlichen Quellen sind deutlich glaubwürdiger; den Ausreißer übernimmst du nicht",
              [
                "Die größere Zahl ist immer richtig, weil sie beeindruckender wirkt",
                "Du bildest einfach den Mittelwert aus allen drei Seiten",
              ],
              "Die Gegenprüfung mit mehreren unabhängigen Fachquellen entlarvt Ausreißer und Falschmeldungen.",
              "Wozu dient die Zweitquellen-Prüfung?",
            ),
          ],
        ),
        cases(
          "ms6-medienwirkung-analyse",
          [
            cc(
              "Ein kurzer Clip nutzt dramatische Gruselmusik, schnelle Schnitte und die Überschrift ‚SCHOCK FÜR ALLE SCHÜLER!!‘. Was soll diese Aufmachung in erster Linie bewirken?",
              "Starke Emotionen wie Angst oder Neugier wecken, damit man schnell klickt und teilt, bevor man nachdenkt",
              [
                "Möglichst nüchtern verschiedene Gegenargumente abwägen",
                "Die genaue Quellenangabe übersichtlich hervorheben",
              ],
              "Starke Gefühle überdecken ruhiges Prüfen – genau deshalb prüfen wir Medienwirkung bewusst.",
              "Welche Wirkung haben Schock-Überschriften und dramatische Effekte auf Betrachter?",
            ),
            cc(
              "Warum wirken bearbeitete oder aus dem Zusammenhang gerissene Bilder besonders stark auf Leserinnen und Leser?",
              "Bilder prägen sich blitzschnell emotional ein und werden oft ohne Hinterfragen für bare Münze genommen",
              [
                "Weil Bilder niemals bearbeitet werden können",
                "Weil man bei Bildern keine Quelle benötigt",
              ],
              "Ein Bild erzeugt sofort einen Eindruck – daher prüfen wir Bildquelle, Kontext und mögliche Bearbeitung.",
              "Warum vertrauen viele Menschen Bildern schneller als langem Text?",
            ),
            cc(
              "Woran erkennst du einen sachlichen Bericht im Vergleich zu einem reißerischen Meinungsbeitrag?",
              "An ruhiger Wortwahl, belegten Fakten, genannten Grenzen und dem Verzicht auf Übertreibungen",
              [
                "An besonders vielen Ausrufezeichen und Schimpfwörtern",
                "Daran, dass jede Gegenmeinung lächerlich gemacht wird",
              ],
              "Sachliche Information trennt Fakten von Wertungen und bleibt in der Wortwahl ruhig.",
              "Wie unterscheiden sich sachliche Information und emotionale Beeinflussung sprachlich?",
            ),
          ],
          [
            cc(
              "Ein bekannter Video-Creator zeigt ein Getränk ‚ganz zufällig‘ in jedem seiner Clips, ohne es als Werbung zu kennzeichnen, und lobt es überschwänglich. Wie ordnest du die Medienwirkung ein?",
              "Versteckte Produktplatzierung nutzt Sympathie und Vertrauen der Zuschauer als Werbung",
              [
                "Es handelt sich um eine neutrale wissenschaftliche Langzeitstudie",
                "Die Erwähnung ist frei von jedem Einfluss auf die Zuschauenden",
              ],
              "Wer eine bekannte Person mag, übernimmt Empfehlungen unkritischer – genau darauf baut Schleichwerbung.",
              "Warum setzen Unternehmen sympathische Vorbilder statt nüchterner Tabellen ein?",
            ),
            cc(
              "Unter einem reißerischen Beitrag stehen hunderte empörte Kommentare ohne einen einzigen Beleg. Was sollte dein nächster Schritt sein?",
              "Nicht mit dem Strom mitschwimmen, sondern zuerst Originalquelle und sachliche Medien prüfen",
              [
                "Den Beitrag sofort teilen, damit man nichts verpasst",
                "Die Lautstärke aufdrehen und den Kommentaren blind vertrauen",
              ],
              "Viele emotionale Kommentare ersetzen keine geprüften Fakten und verstärken oft nur Gruppendruck.",
              "Bedeuten viele Aufregungs-Kommentare automatisch, dass ein Beitrag stimmt?",
            ),
            cc(
              "Eine Schlagzeile lautet ‚Fast alle Jugendlichen verbringen den ganzen Tag nur noch vor dem Bildschirm‘, doch im Kleingedruckten steht eine Mini-Umfrage unter 12 Bekannten. Welche Wirkung nutzt die Überschrift aus?",
              "Sie verallgemeinert stark, um Aufmerksamkeit zu erzeugen, obwohl die Datenbasis winzig ist",
              [
                "Sie beweist wissenschaftlich das Verhalten aller Jugendlichen in Deutschland",
                "Sie fasst alle verlässlichen Landesstatistiken exakt zusammen",
              ],
              "Überschriften spitzen oft zu – erst der Blick auf Datenbasis, Methode und Umfang zeigt den echten Informationsgehalt.",
              "Vergleiche das Versprechen der Überschrift mit den tatsächlichen Zahlen im Text.",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "1", 3, {
      id: "ms6-urheberrecht-lizenzen",
      title: "Urheberrecht und Lizenzmodelle (Creative Commons)",
      subtitle: "Fremde Werke rechtmäßig nutzen, Creative-Commons-Lizenzen unterscheiden und sauber zitieren",
      why: "Einfach ein Bild aus der Suchmaschine zu kopieren verstößt gegen das Urheberrecht – freie Lizenzen zeigen dir den sauberen Weg.",
      html: `<p>In Klasse 5 hast du bereits erste Quellen zu deiner Stoffsammlung notiert. Jetzt lernst du die Regeln des <strong>Urheber- und Lizenzrechts</strong> genauer kennen. Sobald ein Mensch ein Foto schießt, einen Text schreibt, eine Grafik zeichnet oder Musik komponiert, entsteht automatisch das <strong>Urheberrecht</strong> – auch ohne ein kleines ©-Zeichen.</p>
<p>Fremde Werke darfst du nicht einfach beliebig ins Netz stellen. Neben der Verwendung <strong>eigener</strong> Fotos und Zeichnungen helfen dir <strong>Lizenzmodelle</strong> wie <strong>Creative Commons (CC)</strong>. Über vier einfache Kürzel legt die Urheberin fest, was erlaubt ist:</p>
<ul>
<li><code>CC0</code> (gemeinfrei): Nutzung und Veränderung sind ohne einschränkende Pflichten frei erlaubt.</li>
<li><code>BY</code> (Namensnennung): Du musst Urheber, Titel, Lizenz und Fundstelle nennen.</li>
<li><code>SA</code> (Weitergabe unter gleichen Bedingungen): Bearbeitete Fassungen müssen dieselbe Lizenz behalten.</li>
<li><code>NC</code> (nicht kommerziell): Keine Nutzung für kommerzielle Zwecke bzw. Verkauf.</li>
<li><code>ND</code> (keine Bearbeitung): Das Werk darfst du nicht verändern, zuschneiden oder verfremden.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Ein Foto steht unter <code>CC BY-NC</code>. Du darfst es im unveröffentlichten oder nicht-kommerziellen Schulprojekt einbauen und musst Urheber, Titel, Link, Abrufdatum und <code>CC BY-NC</code> angeben. Auf verkaufte Schulfest-T-Shirts darf das Motiv wegen <code>NC</code> nicht. Eine Angabe wie „Quelle: Google“ ist <strong>niemals</strong> gültig.</div>
<div class="merke"><strong>Merke:</strong> Fremde Werke stehen automatisch unter Urheberrecht. Nutze eigene Werke oder freie Lizenzen wie Creative Commons, beachte jedes Lizenzkürzel (<code>BY</code>, <code>SA</code>, <code>NC</code>, <code>ND</code>) und gib eine vollständige Quelle an – niemals bloß eine Suchmaschine.</div>`,
      rule: "Urheberrecht gilt automatisch · CC-Kürzel beachten (BY, SA, NC, ND) · Suchmaschinen sind keine Quellen",
      terms: [
        ["Urheberrecht", "Schützt automatisch Texte, Fotos, Grafiken, Musik und Videos", "Gilt ab Erstellung auch ohne ©-Symbol"],
        ["Creative Commons (CC)", "BY = Namensnennung · SA = gleiche Lizenz · NC = nicht kommerziell · ND = keine Bearbeitung · CC0 = frei", "Erlaubt Nutzung unter festen Bedingungen"],
        ["Vollständige Quellenangabe", "Urheber · Titel · genaue URL / Buch · Lizenz · Abrufdatum", "„Quelle: Google“ reicht nicht"],
      ],
      quiz: [
        "Was verlangt das Lizenzkürzel ‚ND‘ bei einem Bild mit der Lizenz ‚CC BY-ND‘?",
        "Du darfst das Bild zwar mit Namensnennung verwenden, es aber nicht verändern oder bearbeiten",
        "Du musst weder Urheber noch Webseite als Quelle nennen",
        "Du darfst das Bild nur nachts herunterladen",
        "ND steht für ‚No Derivatives‘ (keine Bearbeitung): Das Werk bleibt unverändert.",
      ],
      lab: ccWerkstattLab,
      exercises: [
        cases(
          "ms6-urh-cc-faelle",
          [
            cc(
              "Ein Foto im Internet trägt kein ©-Symbol und keinen Hinweis zur Lizenz. Darfst du es einfach für deine Klassen-Webseite übernehmen?",
              "Nein, das Urheberrecht schützt jedes fremde Werk automatisch ab seiner Erstellung",
              [
                "Ja, ohne ©-Symbol gehört das Bild automatisch allen",
                "Ja, wenn du es mit einem Bildprogramm etwas heller machst",
              ],
              "Das Urheberrecht entsteht automatisch und erfordert Erlaubnis oder eine passende freie Lizenz.",
              "Braucht das Urheberrecht in Deutschland ein besonderes ©-Symbol?",
            ),
            cc(
              "Du findest eine Zeichnung unter ‚CC BY‘. Welche Bedingung musst du bei der Verwendung auf jeden Fall erfüllen?",
              "Urheber, Titel, genaue Fundstelle und die Lizenz ‚CC BY‘ angeben",
              [
                "Eine Lizenzgebühr an die Suchmaschine überweisen",
                "Die Zeichnung vorher unbedingt schwarzweiß drucken",
              ],
              "BY verpflichtet zur Namensnennung mit Titel, Link und Angabe der Lizenz.",
              "Wofür steht das Kürzel BY bei Creative Commons?",
            ),
            cc(
              "Welches Lizenzmodell verzichtet auf weitere Einschränkungen und erlaubt sogar eine freie Nutzung ohne Verpflichtungen?",
              "CC0 (gemeinfrei)",
              ["CC BY-ND", "Alle Rechte vorbehalten"],
              "Mit CC0 verzichtet der Urheber auf einschränkende Vorbehalte und gibt das Werk gemeinfrei frei.",
              "Welches CC-Kürzel trägt eine Null für ‚keine Bedingungen‘?",
            ),
          ],
          [
            cc(
              "Für das Schulfest-Programmheft soll ein Foto unter ‚CC BY-ND‘ zugeschnitten und mit lustigen Sprechblasen beklebt werden. Ist das erlaubt?",
              "Nein, denn ND verbietet jede Bearbeitung oder Veränderung des Werks",
              [
                "Ja, denn BY erlaubt automatisch jede Veränderung",
                "Ja, solange das Heft bunt gedruckt wird",
              ],
              "Wegen ND (keine Bearbeitung) darfst du das Foto nur unverändert einbinden – Sprechblasen verändern das Werk.",
              "Achte genau auf die Bedeutung des Zusatzes ‚ND‘.",
            ),
            cc(
              "Eine Schülerfirma verkauft selbst gestaltete Postkarten auf dem Weihnachtsmarkt und möchte eine Grafik mit ‚CC BY-NC‘ aufdrucken. Darf sie das?",
              "Nein, denn ‚NC‘ verbietet die kommerzielle Nutzung bzw. den Verkauf",
              [
                "Ja, solange der Preis unter fünf Euro liegt",
                "Ja, wenn ‚NC‘ ganz klein auf der Rückseite steht",
              ],
              "NC (Non-Commercial) schließt kommerzielle Verwendung gegen Bezahlung aus.",
              "Prüfe das Kürzel ‚NC‘ im Lizenzmodell!",
            ),
            cc(
              "Du bearbeitest eine Landkarte mit ‚CC BY-SA‘ für dein Referat und lädst die neue Karte auf der freien Schulplattform hoch. Was fordert ‚SA‘?",
              "Die neue bearbeitete Karte muss wieder unter derselben Lizenz ‚CC BY-SA‘ weitergegeben werden",
              [
                "Du musst alle anderen Bilder in der Präsentation löschen",
                "Du darfst das Wort ‚Bayern‘ nicht verändern",
              ],
              "SA (Share Alike) sichert, dass Weiterentwicklungen frei bleiben und unter gleichen Bedingungen geteilt werden.",
              "Wofür steht ‚SA‘ (Weitergabe unter gleichen Bedingungen)?",
            ),
          ],
        ),
        cases(
          "ms6-urh-quellenangabe",
          [
            cc(
              "Welche Angabe unter einem Bild auf deinem Arbeitsblatt ist FACHLICH UNZUREICHEND?",
              "„Quelle: Google Bilder“",
              [
                "„Foto ‚Waldkauz‘ von Max Beispiel, CC BY, commons.wikimedia.org/wiki/File:Waldkauz.jpg, abgerufen am 20. November 2026“",
                "„Eigenes Foto aus dem Schulgarten, aufgenommen am 12. Mai 2026“",
              ],
              "Google ist eine Suchmaschine und weder Urheber noch der echte Fundort des Bildes.",
              "Hat eine Suchmaschine das Foto selbst erstellt?",
            ),
            cc(
              "Welche Bausteine gehören zu einer vollständigen Online-Quellenangabe für eine frei lizenzierte Grafik?",
              "Urheber, Titel, genaue Internetadresse (URL), Abrufdatum und Lizenzname",
              [
                "Nur das Wort ‚Internet‘ und der Browsername",
                "Ausschließlich die Dateigröße in Kilobyte",
              ],
              "Nur mit allen fünf Angaben lässt sich die Herkunft eindeutig nachweisen und die Lizenz einhalten.",
              "Welche Infos braucht man, um genau das Bild samt Lizenz prüfen zu können?",
            ),
            cc(
              "Warum notierst du bei Internetquellen immer das Abrufdatum?",
              "Weil Webseiten sich später verändern oder gelöscht werden können",
              [
                "Weil Texte sonst nach einer Woche unsichtbar werden",
                "Weil sonst die Datei auf dem USB-Stick nicht speichert",
              ],
              "Das Abrufdatum hält fest, wann genau der zitierte Stand online zu lesen war.",
              "Bleibt eine Internetseite dauerhaft unverändert?",
            ),
          ],
          [
            cc(
              "Du nimmst für ein Referat über die Donau selbst ein Foto am Flussufer auf. Wie kennzeichnet man es am besten?",
              "Mit dem Hinweis ‚Eigenes Foto‘ (und Datum/Ort), weil du selbst Urheberin oder Urheber bist",
              [
                "Mit ‚Quelle: Google‘ zur Sicherheit",
                "Mit der Lizenz eines fremden Lexikons",
              ],
              "Auch bei eigenen Bildern macht ein kurzer Hinweis sofort klar, dass keine fremden Rechte verletzt wurden.",
              "Wem gehören selbst aufgenommene Fotos?",
            ),
            cc(
              "Du nutzt für einen Vortrag im Klassenzimmer ein Zitat aus einem gedruckten Lexikon. Was gehört in die Quellenangabe?",
              "Autor oder Herausgeber, Buchtitel, Erscheinungsjahr und Seitenzahl",
              [
                "Nur ‚ein dickes Buch aus dem Regal‘",
                "Eine erfundene Internetadresse",
              ],
              "Auch gedruckte Bücher werden genau mit Titel, Herausgeber, Jahr und Seitenzahl belegt.",
              "Wie findet eine Leserin deine Textstelle im Buch exakt wieder?",
            ),
            cc(
              "Ein Mitschüler schlägt vor, einfach ‚Bild: Wikipedia‘ unter jedes Foto zu schreiben und die Lizenz wegzulassen. Reicht das bei CC-BY-Bildern?",
              "Nein, es fehlen der eigentliche Urheber, der genaue Dateilink, das Abrufdatum und der Lizenzname",
              [
                "Ja, ‚Wikipedia‘ allein reicht für jedes Foto im Internet",
                "Ja, solange das Bild kleiner als ein Viertel der Seite ist",
              ],
              "Der Plattformname ersetzt weder den Namen des Fotografen noch die verpflichtende Lizenzangabe.",
              "Wer ist Urheber eines Fotos auf Wikimedia Commons – die Plattform oder der Fotograf?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "1", 4, {
      id: "ms6-personenbezogene-daten",
      title: "Personenbezogene Daten erkennen und schützen",
      subtitle: "Persönliche Angaben einordnen, Datensparsamkeit leben und Rechte am eigenen Bild achten",
      why: "Einmal unbedacht geteilte Privatdaten, Fotos oder offene Konten lassen sich im Netz kaum noch zurückholen.",
      html: `<p>Sobald Informationen eine bestimmte Person direkt oder über Umwege eindeutig erkennbar machen, heißen sie <strong>personenbezogene Daten</strong>. Dazu zählen etwa der volle Name, die Wohnadresse, das Geburtsdatum, Handynummern, E-Mail-Adressen, Schulnoten, Standortverläufe sowie Fotos und Videos einer Person.</p>
<p>Um deine Daten vor dem Zugriff unberechtigter Dritter zu schützen, setzt du im Alltag drei einfache Regeln um:</p>
<ul>
<li><strong>Datensparsamkeit:</strong> Gib bei Anmeldungen, Foren oder Spielen nur wirklich nötige Angaben ein – nutze nach Möglichkeit einen Spitznamen statt deines echten Namens.</li>
<li><strong>Recht am eigenen Bild:</strong> Fotos oder Videos anderer Personen darfst du nicht ohne deren Zustimmung aufnehmen, verschicken oder veröffentlichen.</li>
<li><strong>Geräte &amp; Berechtigungen sichern:</strong> Sperre Tablet und Smartphone beim Weglegen mit PIN oder Muster, melde dich am Schulrechner nach jeder Stunde ab und prüfe bei Apps, ob sie wirklich Zugriff auf Kamera, Mikrofon oder Standort brauchen.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Eine Taschenlampen-App verlangt beim Installieren Zugriff auf dein Adressbuch und deinen Standort. Nach dem Grundsatz der Datensparsamkeit lehnt man diese überflüssigen Berechtigungen ab oder wählt eine sichere Alternative.</div>
<div class="merke"><strong>Merke:</strong> Schütze personenbezogene Daten im Alltag durch <strong>Datensparsamkeit</strong>, geprüfte <strong>App-Berechtigungen</strong>, das <strong>Abmelden bzw. Sperren</strong> von Geräten und das <strong>Recht am eigenen Bild</strong>.</div>`,
      rule: "Personenbezogene Daten sparsam weitergeben · Geräte sperren/abmelden · Recht am eigenen Bild wahren",
      terms: [
        ["Personenbezogene Daten", "Alle Angaben zu einer bestimmten oder bestimmbaren Person", "z. B. Name, Adresse, Telefonnummer, Foto, Standort"],
        ["Datensparsamkeit", "Nur Daten angeben, die für den jeweiligen Zweck nötig sind", "Spitznamen statt Klarnamen nutzen"],
        ["Recht am eigenen Bild", "Jede Person bestimmt selbst über Fotos und Videos von sich", "Fremde Aufnahmen nie ungefragt teilen"],
      ],
      quiz: [
        "Welcher Grundsatz schützt deine Privatsphäre bei der Anmeldung auf einer Freizeitplattform am wirksamsten?",
        "Datensparsamkeit: nur unbedingt nötige Angaben machen und statt des vollen Namens einen Spitznamen wählen",
        "Möglichst immer echte Wohnadresse und Handynummer öffentlich eintragen",
        "Dasselbe Profilfoto gemeinsam mit Namen und Schuladresse posten",
        "Je weniger persönliche Daten auf Plattformen liegen, desto geringer ist die Gefahr von Missbrauch durch Dritte.",
      ],
      lab: datenLab,
      exercises: [
        cases(
          "ms6-daten-erkennen",
          [
            cc(
              "Welche Information gehört eindeutig zu den personenbezogenen Daten?",
              "Deine private Handynummer und deine Wohnadresse",
              [
                "Die Höhe der Zugspitze in Metern",
                "Die Durchschnittszahl der Regentage im April",
              ],
              "Handynummer und Wohnadresse ordnen Angaben direkt dir als Person zu.",
              "Woran lässt sich eine konkrete einzelne Person erkennen?",
            ),
            cc(
              "Auf einem Klassenfoto sind zwölf Kinder deutlich erkennbar. Darf man das Foto einfach öffentlich hochladen?",
              "Nein, wegen des Rechts am eigenen Bild braucht man die Einwilligung der Abgebildeten (bei Kindern der Eltern)",
              [
                "Ja, sobald man selbst auch auf dem Bild zu sehen ist",
                "Ja, wenn das Bild am Dienstag aufgenommen wurde",
              ],
              "Jeder abgebildete Mensch entscheidet mit, ob Aufnahmen von ihm veröffentlicht werden.",
              "Welches Recht schützt Menschen auf Fotos und Videos?",
            ),
            cc(
              "Warum sollte eine einfache Notiz-App keinen dauerhaften Zugriff auf deinen genauen GPS-Standort erhalten?",
              "Weil sie den Standort für Notizen gar nicht braucht und so unnötig persönliche Bewegungsdaten sammelt",
              [
                "Weil GPS sonst Buchstaben auf dem Bildschirm verdreht",
                "Weil Notizen nur ohne Strom funktionieren",
              ],
              "Nach dem Prinzip der Datensparsamkeit vergibst du nur notwendige App-Berechtigungen.",
              "Braucht eine Notiz-App deinen Aufenthaltsort?",
            ),
          ],
          [
            cc(
              "In einem öffentlich einsehbaren Forum steht kein Vor- und Nachname, aber: ‚Der Sechstklässler aus Zimmer 204 der Grund- und Mittelschule Musterdorf, der gestern beim Radrennen gewonnen hat.‘ Sind das personenbezogene Daten?",
              "Ja, denn über diese Hinweise lässt sich genau eine Person eindeutig bestimmen",
              [
                "Nein, weil der Vorname nicht genannt wurde",
                "Nein, weil Schulsport niemals persönlich sein kann",
              ],
              "Auch indirekt identifizierbare Angaben zählen zu den personenbezogenen Daten.",
              "Kann man die gemeinte Person trotz fehlendem Namen zweifelsfrei herausfinden?",
            ),
            cc(
              "Ein Mitschüler will deinen Schul-Account schnell für ein Referat mitbenutzen, weil er sein eigenes Kennwort vergessen hat. Was ist richtig?",
              "Zugangsdaten geheim halten und den Mitschüler die Lehrkraft um Hilfe für seinen eigenen Account bitten lassen",
              [
                "Ihm dein Passwort auf einen Zettel schreiben",
                "Ihn unter deinem Namen weiterarbeiten lassen, bis er fertig ist",
              ],
              "Wer unter deinem Konto handelt, greift auf deine privaten Daten zu; Handlungen werden dir zugerechnet.",
              "Warum bleiben Zugangsdaten streng persönlich?",
            ),
            cc(
              "Was bedeutet es für den Informatikraum, wenn du am Ende der Stunde noch kurz die Pausenglocke hörst und sofort aufstehst?",
              "Du musst dich trotzdem kurz abmelden oder den Bildschirm sperren, damit niemand auf deine Daten zugreift",
              [
                "Der nächste Schüler meldet dich schon irgendwann ab",
                "Solange der Monitor ausgeschaltet wird, ist dein Konto sicher abgemeldet",
              ],
              "Nur den Bildschirm auszuschalten sperrt das Konto nicht – jeder Handgriff danach wäre weiterhin in deinem Namen.",
              "Reicht es, lediglich den Monitor auszuknipsen?",
            ),
          ],
        ),
        cases(
          "ms6-daten-schutzmassnahmen",
          [
            cc(
              "Welche Einstellung schützt ein verlorenes oder kurz liegengelassenes Smartphone sofort vor fremden Blicken?",
              "Eine automatische Bildschirmsperre mit PIN, Muster oder Biometrie",
              [
                "Eine besonders helle Hintergrundbeleuchtung",
                "Das Ausschalten der Lautstärke",
              ],
              "Ohne Bildschirmsperre kann jede fremde Person sofort Nachrichten, Fotos und Konten öffnen.",
              "Wie verhinderst du, dass Finder direkt auf deine Apps zugreifen?",
            ),
            cc(
              "Ein neues Online-Quiz möchte neben einem Spitznamen unbedingt deine echte Telefonnummer und deinen Schulnamen wissen, um eine Urkunde anzuzeigen. Wie entscheidest du?",
              "Keine echten Privatdaten angeben oder ein seriöses Angebot ohne Datenzwang wählen",
              [
                "Alle Daten wahrheitsgemäß eintragen, damit es schnell geht",
                "Die Telefonnummer deiner Mitschülerin statt deiner eigenen eintippen",
              ],
              "Unnötige Datensammlungen meidest du konsequent (Datensparsamkeit); fremde Daten gibt man ohnehin nie ein.",
              "Darfst du für ein einfaches Online-Quiz deine Privatnummer preisgeben?",
            ),
            cc(
              "Wann prüfst du die Berechtigungen einer App am sinnvollsten?",
              "Bereits beim Installieren und regelmäßig in den Geräteeinstellungen",
              [
                "Erst wenn das Gerät gar keinen Speicherplatz mehr hat",
                "Niemals, Apps brauchen immer alle Rechte",
              ],
              "Unnötige Zugriffe auf Kontakte, Kamera, Mikrofon und Standort verhinderst du direkt beim Einrichten.",
              "Wann kannst du überflüssige App-Rechte abdrehen?",
            ),
          ],
          [
            cc(
              "Eine kostenlose Fotobearbeitungs-App möchte im Hintergrund deine Kontakte, deinen Standort und den Kalender auslesen. Was machst du?",
              "Kontakte, Standort und Kalender verweigern – zum Bildbearbeiten reicht gezielter Zugriff auf ausgewählte Fotos",
              [
                "Alles erlauben, weil kostenlose Apps sonst langsamer rechnen",
                "Nur den Kalender sperren, aber das gesamte Telefonbuch freigeben",
              ],
              "Auch für gute Funktionen genügt der minimal nötige Zugriff auf einzelne gewählte Dateien.",
              "Welche Daten braucht ein Fotoprogramm wirklich?",
            ),
            cc(
              "Warum schaltest du im Browser nach der Arbeit auf einem fremden oder öffentlichen PC zusätzlich auf ‚Abmelden‘ (Logout) statt nur das Fenster zu schließen?",
              "Damit das angemeldete Konto sicher beendet ist und niemand beim nächsten Öffnen deine Sitzung übernimmt",
              [
                "Weil der Browser beim Schließen alle Bilder ausdruckt",
                "Damit die Tastatur für die nächste Person gereinigt wird",
              ],
              "Auf fremden Geräten kann die Sitzung beim bloßen Schließen eines Tabs gespeichert bleiben – erst Abmelden beendet sie.",
              "Was passiert auf einem fremden PC, wenn man angemeldet bleibt?",
            ),
            cc(
              "Ein Freund bittet dich, ein peinliches Foto aus der Umkleide sofort zu löschen, das du aus Spaß gemacht hast. Was gilt?",
              "Sofort endgültig löschen – niemand darf gegen seinen Willen fotografiert oder festgehalten werden",
              [
                "Behalten und nur versprechen, es niemandem zu zeigen",
                "Das Foto verkleinern und in einer privaten Gruppe posten",
              ],
              "Das Recht am eigenen Bild und Persönlichkeitsrechte verbieten unerwünschte Aufnahmen und verlangen das Löschen.",
              "Darf ein Bild gegen den Willen der abgebildeten Person behalten werden?",
            ),
          ],
        ),
      ],
    }),

    lesson(STAGE_ID, "1", 5, {
      id: "ms6-passwoerter-virenschutz",
      title: "Sichere Passwörter und Schutz vor Schadsoftware",
      subtitle: "Starke Passwörter nach der Merksatz-Methode bilden und Geräte mit Virenschutz sowie Updates absichern",
      why: "Ein schwaches Passwort wie ‚123456‘ oder ein veraltetes Gerät öffnet fremden Personen in Sekunden die Tür zu all deinen Konten.",
      html: `<p>Um deine Konten und Geräte vor unbefugtem Zugriff zu schützen, greifen <strong>sichere Passwörter</strong> und ein aktueller <strong>Schutz vor Schadsoftware</strong> Hand in Hand.</p>
<ul>
<li><strong>Regeln für ein sicheres Passwort:</strong> Mindestens <code>12</code> Zeichen lang; Mischung aus <strong>Großbuchstaben</strong>, <strong>Kleinbuchstaben</strong>, <strong>Ziffern</strong> und <strong>Sonderzeichen</strong>; keine Namen, Geburtsdaten oder einfache Wörter aus dem Wörterbuch; für jeden wichtigen Dienst ein <strong>eigenes Passwort</strong>.</li>
<li><strong>Merksatz-Methode:</strong> Bilde aus einem leicht merkbaren Satz die Anfangsbuchstaben und füge Zahlen sowie Zeichen ein. Aus „<em>Meine 6. Klasse hat heute Informatik um 8 Uhr!</em>“ wird etwa <code>M6KhhIu8U!</code> (oder noch etwas länger: <code>M6KhhI&amp;u8U!26</code>).</li>
<li><strong>Virenschutzprogramme &amp; Updates:</strong> Ein aktuelles <strong>Virenschutzprogramm</strong> erkennt bekannte Schadsoftware (Viren, Trojaner). Genauso wichtig sind <strong>regelmäßige Updates</strong> für Betriebssystem und Apps, weil sie Sicherheitslücken schließen, und Vorsicht bei unbekannten E-Mail-Anhängen oder Downloads.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Ein vierstelliges Ziffern-Passwort hat nur <code>10 · 10 · 10 · 10 = 10 000</code> Möglichkeiten – ein Computer probiert das blitzschnell durch. Nutzt man <code>12</code> Zeichen aus <code>80</code> möglichen Zeichen (Groß, Klein, Ziffern, Sonderzeichen), steigt die Zahl der Möglichkeiten unvorstellbar stark an.</div>
<div class="merke"><strong>Merke:</strong> Sichere Passwörter sind mindestens <code>12</code> Zeichen lang, nutzen alle vier Zeichenarten und keine Privatdaten – zusammen mit einem aktuellen <strong>Virenschutzprogramm</strong> und <strong>Updates</strong> schützen sie vor Fremdzugriff.</div>`,
      rule: "Mind. 12 Zeichen + 4 Zeichenarten + Merksatz ohne Privatdaten + aktueller Virenschutz & Updates",
      terms: [
        ["Sicheres Passwort", "Mind. 12 Zeichen · Groß, Klein, Ziffern, Sonderzeichen · keine Namen/Daten · je Dienst einzigartig", "Merksatz-Methode erleichtert das Erinnern"],
        ["Virenschutzprogramm", "Prüft Dateien und Downloads auf bekannte Schadsoftware", "Muss stets aktuell gehalten werden"],
        ["Schadsoftware & Updates", "Viren oder Trojaner nutzen oft veraltete Programme aus", "Sicherheitsupdates zeitnah installieren"],
      ],
      quiz: [
        "Welches Passwort ist am sichersten und lässt sich mit einem Merksatz gut behalten?",
        "I6M#l2026!wS (aus einem langen Merksatz ohne eigenen Namen oder Geburtsdatum)",
        "Lukas2014 (Vorname und Geburtsjahr)",
        "123456789012 (zwölf aufeinanderfolgende Ziffern)",
        "Nur ein Passwort mit mindestens 12 Zeichen, vier Zeichenarten und ohne persönliche Daten oder einfache Reihen widersteht automatischem Ausprobieren.",
      ],
      lab: passwortLab,
      exercises: [
        cases(
          "ms6-passwort-bewerten",
          [
            cc(
              "Was macht den Ausdruck ‚Hund123!‘ für ein wichtiges Konto trotz Ziffer und Sonderzeichen noch angreifbar?",
              "Es ist zu kurz (8 Zeichen) und enthält ein bekanntes Wörterbuchwort samt simpler Zahlenreihe",
              [
                "Es enthält ein Ausrufezeichen, das verboten ist",
                "Es beginnt mit einem Großbuchstaben",
              ],
              "Wörterbuchwörter mit angehängtem ‚123!‘ stehen in jeder Angreiferliste und die Länge liegt unter 12 Zeichen.",
              "Vergleiche Länge und Aufbau mit unseren vier Passwort-Regeln.",
            ),
            cc(
              "Warum solltest du nicht überall genau dasselbe Passwort verwenden?",
              "Wird ein einziger Dienst gehackt, wären sonst sofort alle anderen Konten ebenfalls gefährdet",
              [
                "Weil ein Computer sonst die Buchstaben vertauscht",
                "Weil jede Webseite das erste Passwort nach sieben Tagen löscht",
              ],
              "Eigene Passwörter (oder Passwort-Zusätze pro Dienst) begrenzen Schäden auf genau einen Dienst.",
              "Was passiert, wenn eines deiner Konten ein Datenleck hat?",
            ),
            cc(
              "Welche zwei Maßnahmen schützen deinen Rechner technisch am zuverlässigsten vor Schadsoftware?",
              "Ein aktuelles Virenschutzprogramm und das regelmäßige Einspielen von Sicherheitsupdates",
              [
                "Den Bildschirm besonders dunkel stellen und den Ton abschalten",
                "Alle Programme auf dem Desktop alphabetisch anordnen",
              ],
              "Updates schließen bekannte Sicherheitslücken und der Virenschutz prüft Dateien laufend auf Schädlinge.",
              "Wie wehrt man bekannte Lücken und infizierte Dateien ab?",
            ),
          ],
          [
            cc(
              "Eine Schülerin bildet nach der Merksatz-Regel aus ‚Jeden Montag trinke ich 2 Tassen Tee um 7 Uhr!‘ das Passwort ‚JMti2TTu7U!‘. Wie beurteilst du das Ergebnis?",
              "Sehr guter Ansatz (Groß, Klein, Ziffern, Sonderzeichen, keine Privatdaten) – mit einem weiteren Zeichen erreicht es mindestens 12 Stellen",
              [
                "Völlig unbrauchbar, weil eine Zahl vorkommt",
                "Unsicher, weil jemand ihren Wochentag leicht erraten kann",
              ],
              "Der Merksatz kombiniert alle Zeichenarten; ab 12 Zeichen (11 sind hier noch eines zu kurz) erfüllt es alle Regeln.",
              "Zähle die Länge von ‚JMti2TTu7U!‘ genau nach und prüfe die Zeichenarten.",
            ),
            cc(
              "Du bekommst eine E-Mail von einem unbekannten Absender mit dem Anhang ‚Gewinn_Dokument.exe‘. Wie reagierst du richtig?",
              "Anhang nicht öffnen, E-Mail löschen oder bei Unklarheit eine vertraute Person fragen",
              [
                "Kurz anklicken, um zu sehen, ob ein Gewinn darin steht",
                "Erst das Passwort deines Kontos als Antwort zurückschicken",
              ],
              "Ausführbare Dateien (.exe) von unbekannten Absendern enthalten häufig Schadsoftware.",
              "Ist ein unbekannter Programm-Anhang harmlos?",
            ),
            cc(
              "Warum genügt ein Virenschutzprogramm allein nicht, wenn jemand auf dem Rechner alle Betriebssystem-Updates ein Jahr lang ablehnt?",
              "Veraltete Programme behalten bekannte Sicherheitslücken, durch die neue Angriffe eindringen können",
              [
                "Weil der Virenschutz ohne Updates keine Farben mehr darstellen kann",
                "Weil das Passwort sich automatisch auf ‚1234‘ zurücksetzt",
              ],
              "Virenschutz und zeitnahe Updates ergänzen sich als Schutzschicht gegen unterschiedliche Angriffe.",
              "Was genau reparieren regelmäßige Software-Updates?",
            ),
          ],
        ),
        {
          id: "ms6-passwort-kombinationen",
          make(rng, level) {
            if (level === 1) {
              const digits = rng.pick([2, 3, 4]);
              const answer = 10 ** digits;
              const sumWrong = 10 * digits;
              return {
                prompt: `Ein Fahrradschloss bzw. eine PIN hat ${digits} Stellen, an jeder Stelle stehen die 10 Ziffern von 0 bis 9 zur Wahl. Wie viele verschiedene Codes gibt es insgesamt?`,
                given: [
                  `Stellen: ${digits}`,
                  "Möglichkeiten je Stelle: 10 (Ziffern 0 bis 9)",
                ],
                formulaHint: "Multipliziere die Möglichkeiten je Stelle miteinander (10 · 10 · ...).",
                fields: [
                  withSlips(
                    numberField("Möglichkeiten =", answer),
                    [sumWrong, "Du hast addiert statt multipliziert – je Stelle vervielfachen sich die Möglichkeiten."],
                    [10 ** (digits - 1), `Prüfe die Stellenzahl: es sind ${digits} Stellen, nicht ${digits - 1}.`],
                  ),
                ],
                steps: [
                  `Für jede der ${digits} Stellen gibt es 10 Möglichkeiten.`,
                  `Multiplizieren: ${Array.from({ length: digits }, () => "10").join(" · ")} = ${fmt(answer, 0)}`,
                  `<strong>${fmt(answer, 0)}</strong>`,
                ],
              };
            }
            const useFactor = rng.next() < 0.5;
            if (useFactor) {
              const extra = rng.pick([1, 2, 3]);
              const factor = 10 ** extra;
              return {
                prompt: `Eine reine Ziffern-PIN wird um ${extra} zusätzliche Ziffer${extra === 1 ? "" : "n"} (0 bis 9) verlängert. Mit welchem Faktor vervielfacht sich dadurch die Zahl der möglichen PINs?`,
                given: [
                  `Zusätzliche Stellen: ${extra}`,
                  "Je zusätzliche Stelle: 10 neue Möglichkeiten (0 bis 9)",
                ],
                fields: [
                  withSlips(
                    numberField("Faktor =", factor),
                    [10 * extra, "Jede neue Stelle verzehnfacht die Gesamtzahl – multipliziere 10 miteinander, addiere nicht."],
                  ),
                ],
                steps: [
                  "Jede weitere Ziffernstelle verzehnfacht alle bisherigen Kombinationen.",
                  `Bei ${extra} weiteren Stelle${extra === 1 ? "" : "n"}: ${Array.from({ length: extra }, () => "10").join(" · ")} = ${fmt(factor, 0)}`,
                  `<strong>Faktor ${fmt(factor, 0)}</strong>`,
                ],
              };
            }
            const len = 2;
            const ziffern = 10 ** len;
            const buchstaben = 26 ** len;
            const diff = buchstaben - ziffern;
            return {
              prompt: `Vergleiche zwei 2-stellige Codes: Code A nutzt nur die 10 Ziffern (0–9), Code B nutzt die 26 Kleinbuchstaben (a–z). Wie viele Möglichkeiten hat Code B mehr als Code A?`,
              given: [
                "Code A: 2 Stellen mit je 10 Ziffern",
                "Code B: 2 Stellen mit je 26 Kleinbuchstaben",
              ],
              fields: [
                withSlips(
                  numberField("Unterschied =", diff),
                  [buchstaben, "Das sind alle Möglichkeiten von Code B – ziehe noch die Möglichkeiten von Code A ab."],
                  [52 - 20, "Multipliziere erst die Möglichkeiten je Stelle (26 · 26 und 10 · 10), bevor du abziehst."],
                ),
              ],
              steps: [
                `Code A: 10 · 10 = ${ziffern}`,
                `Code B: 26 · 26 = ${buchstaben}`,
                `<strong>Unterschied: ${buchstaben} − ${ziffern} = ${diff}</strong>`,
              ],
            };
          },
        },
      ],
    }),

    lesson(STAGE_ID, "1", 6, {
      id: "ms6-datensicherung",
      title: "Datenverlust vermeiden: Bedeutung von Datensicherung",
      subtitle: "Ursachen von Datenverlust verstehen und Backups auf getrennten Speichermedien planen",
      why: "Wenn ein Tablet herunterfällt oder eine Datei aus Versehen gelöscht wird, rettet dich nur eine echte Datensicherung.",
      html: `<p>Wichtige Schulprojekte, Familienfotos oder Referate können durch verschiedene Ereignisse plötzlich verloren gehen: eine defekte Festplatte, versehentliches Überschreiben oder Löschen, Diebstahl eines Geräts oder verschlüsselnde Schadsoftware.</p>
<p>Darum hat eine regelmäßige <strong>Datensicherung (Backup)</strong> große Bedeutung:</p>
<ul>
<li><strong>Getrenntes Speichermedium:</strong> Eine zweite Kopie im anderen Ordner auf derselben Festplatte ist <strong>keine</strong> echte Datensicherung – geht diese Platte kaputt, sind beide Kopien verloren.</li>
<li><strong>Unterschiedliche Orte schützen doppelt:</strong> Sichere wichtige Dateien auf einem getrennten Datenträger (z. B. externer USB-Stick oder externe Festplatte) und bei besonders wichtigen Daten zusätzlich an einem zweiten Ort (z. B. sichere Schulcloud).</li>
<li><strong>Regelmäßig sichern &amp; prüfen:</strong> Je kürzer der Sicherungsabstand (z. B. wöchentlich oder nach jedem Projekttag), desto weniger Arbeit geht im Ernstfall verloren. Stichproben prüfen, ob sich Dateien wirklich zurückladen lassen.</li>
</ul>
<div class="example"><strong>Beispiel:</strong> Vor der Projektprüfung speichert Samira ihre Präsentation und Fotos sowohl auf dem Laptop als auch jede Woche auf einem beschrifteten USB-Stick im Federmäppchen und in der Schulcloud. Als ihr Laptop einen Festplattenschaden hat, lädt sie alle Daten innerhalb weniger Minuten wieder her.</div>
<div class="merke"><strong>Merke:</strong> Echte Datensicherung heißt: regelmäßig wichtige Dateien auf <strong>getrennten Speichermedien</strong> (ideal an zwei Orten) sichern und niemals nur eine Kopie auf demselben Gerät ablegen.</div>`,
      rule: "Echtes Backup = regelmäßig + getrenntes Speichermedium (+ ideal zweiter Ort)",
      terms: [
        ["Datensicherung (Backup)", "Kopie wichtiger Daten auf einem unabhängigen, getrennten Speicher", "Schützt vor Defekt, Verlust und versehentlichem Löschen"],
        ["Scheinsicherheit", "Zweite Kopie auf derselben Festplatte oder im selben Ordner", "Schützt nicht bei Hardware-Defekt oder Diebstahl"],
        ["Sicherungsabstand", "Zeitraum zwischen zwei Backups (z. B. täglich oder wöchentlich)", "Bestimmt den höchstmöglichen Verlust neuer Änderungen"],
      ],
      quiz: [
        "Warum schützt eine Kopie deines Referats in einem zweiten Ordner derselben Laptop-Festplatte nicht zuverlässig?",
        "Geht die Festplatte kaputt oder wird der Laptop gestohlen, sind beide Kopien gleichzeitig verloren",
        "Weil man Kopien auf demselben Laptop gar nicht wieder öffnen darf",
        "Weil sich Dateien in einem zweiten Ordner von selbst in PDF verwandeln",
        "Nur ein räumlich und technisch getrenntes Medium (z. B. USB-Stick oder Cloud) übersteht einen Festplattenschaden oder Geräteverlust.",
      ],
      lab: backupLab,
      exercises: [
        cases(
          "ms6-backup-faelle",
          [
            cc(
              "Tim legt vor der Abgabe einen Ordner ‚Referat_Sicherung‘ auf dem Desktop desselben Computers an. Ist seine Arbeit damit gegen einen Festplattenschaden gesichert?",
              "Nein, beide Ordner liegen auf demselben Datenträger und fallen gemeinsam aus",
              [
                "Ja, weil zwei verschiedene Ordnernamen ausreichen",
                "Ja, weil der Desktop automatisch feuerfest ist",
              ],
              "Erst ein zweites, getrenntes Speichermedium schützt bei einem Defekt des Hauptlaufwerks.",
              "Auf welchem Bauteil liegen sowohl das Original als auch der zweite Ordner?",
            ),
            cc(
              "Was ist ein häufiger Grund dafür, dass wichtige Daten ohne jeden technischen Defekt verschwinden?",
              "Versehentliches Löschen, Überschreiben einer Datei oder Verlust eines ungesicherten USB-Sticks",
              [
                "Ein zu langes Passwort mit Sonderzeichen",
                "Zu viele sachliche Quellenangaben im Dokument",
              ],
              "Bedienfehler wie versehentliches Löschen passieren täglich – ein Backup macht sie rückgängig.",
              "Kann ein Mensch wichtige Dateien aus Versehen selbst verlieren?",
            ),
            cc(
              "Warum lohnt sich eine kurze Probe-Wiederherstellung nach dem Backup?",
              "Damit man sicher weiß, dass die gesicherten Dateien vollständig und lesbar zurückgeladen werden können",
              [
                "Damit der USB-Stick dadurch mehr Gigabyte Speicher erhält",
                "Damit alle älteren Kopien automatisch gelöscht werden",
              ],
              "Eine Sicherung, die sich im Ernstfall nicht öffnen lässt, nützt nichts – ein kurzes Prüfen gibt Sicherheit.",
              "Woher weißt du, ob ein Backup im Ernstfall wirklich funktioniert?",
            ),
          ],
          [
            cc(
              "Eine Schülerin sichert ihr Jahresprojekt einmal im September und danach bis Mai nie wieder. Im Mai stürzt der Rechner ab. Welches Problem entsteht?",
              "Alle Änderungen aus fast acht Monaten fehlen im alten Backup",
              [
                "Es entsteht gar kein Problem, das Backup aktualisiert sich gedanklich von selbst",
                "Die Daten vom September sind plötzlich auch verloren",
              ],
              "Ein Backup hält immer nur den Stand fest, den die Dateien zum Zeitpunkt der Sicherung hatten.",
              "Was steht in einer acht Monate alten Kopie über die Arbeit von gestern?",
            ),
            cc(
              "Nach dem Kopieren auf eine externe Festplatte bleibt diese dauerhaft am PC eingesteckt. Warum empfiehlt man für wichtige Sicherungen ein Ausstecken oder einen zweiten Ort (z. B. Schulcloud)?",
              "Damit Schadsoftware oder ein Blitzschaden am PC nicht gleichzeitig alle angesteckten Laufwerke erfasst",
              [
                "Weil eingesteckte Festplatten jeden Tag kleiner werden",
                "Weil man sie sonst nicht mehr mit Mauszeigern anklicken kann",
              ],
              "Getrennt gelagerte Datenträger oder eine Cloud-Sicherung bleiben unberührt, wenn Schadsoftware lokale Laufwerke befällt.",
              "Was passiert mit einem dauerhaft angeschlossenen Laufwerk bei Schadsoftware auf dem PC?",
            ),
            cc(
              "Du hast nur noch einen 4-GB-USB-Stick frei, aber deine komplette Fotosammlung ist 60 GB groß. Welche Lösung ist am sinnvollsten?",
              "Zuerst das Wichtigste auf dem Stick sichern und für alle Fotos ein ausreichend großes Medium wählen (keine wichtigen Daten ungesichert lassen)",
              [
                "Einfach 56 GB ungesichert lassen und darauf hoffen, dass nichts passiert",
                "Die Fotos auf demselben Laptop doppelt speichern und Stick weglegen",
              ],
              "Priorisieren rettet das Wichtigste sofort, ersetzt für den Rest aber kein passend dimensioniertes externes Backup.",
              "Welches Prinzip schützt alle unersetzlichen Dateien zuverlässig?",
            ),
          ],
        ),
        {
          id: "ms6-backup-speicher",
          make(rng, level) {
            if (level === 1) {
              const fotos = rng.pick([120, 180, 240, 320]);
              const texte = rng.pick([15, 25, 40]);
              const folien = rng.pick([45, 65, 85]);
              const total = fotos + texte + folien;
              return {
                prompt: "Du willst deinen gesamten Projektordner auf einem USB-Stick sichern. Wie viel Speicherplatz in MB belegt die Datensicherung insgesamt?",
                given: [
                  `Projektfotos: ${fotos} MB`,
                  `Textdokumente: ${texte} MB`,
                  `Präsentation: ${folien} MB`,
                ],
                formulaHint: "Addiere die Dateigrößen aller drei Ordnerbestandteile.",
                fields: [
                  withSlips(
                    numberField("Gesamtgröße =", total, "MB"),
                    [fotos + texte, "Vergiss die Präsentation nicht."],
                    [fotos + folien, "Zähle auch die Textdokumente mit."],
                  ),
                ],
                steps: [
                  "Alle Bestandteile des Projektordners addieren:",
                  `${fotos} MB + ${texte} MB + ${folien} MB = ${total} MB`,
                  `<strong>${total} MB</strong>`,
                ],
              };
            }
            const stickGb = rng.pick([2, 4, 8]);
            const backupMb = rng.pick([300, 400, 600, 750]);
            const stickMb = stickGb * 1000;
            const count = Math.floor(stickMb / backupMb);
            return {
              prompt: `Ein USB-Stick hat ${stickGb} GB freien Speicherplatz (rechne 1 GB = 1000 MB). Ein vollständiges Backup deines Projekts benötigt ${backupMb} MB. Wie viele vollständige Sicherungen passen höchstens auf den Stick?`,
              given: [
                `Freier Speicher: ${stickGb} GB (1 GB = 1000 MB)`,
                `Größe einer Sicherung: ${backupMb} MB`,
              ],
              fields: [
                withSlips(
                  numberField("Anzahl Sicherungen =", count),
                  [Math.ceil(stickMb / backupMb), "Eine angebrochene letzte Kopie reicht nicht für eine vollständige Sicherung – runde ab."],
                  [Math.floor(stickGb / backupMb), "Rechne zuerst GB in MB um (1 GB = 1000 MB)."],
                ),
              ],
              steps: [
                `Speicher in MB umrechnen: ${stickGb} · 1000 MB = ${stickMb} MB`,
                `Teilen: ${stickMb} : ${backupMb} = ${fmt(stickMb / backupMb, 2)}`,
                `Nur vollständige Sicherungen zählen: <strong>${count}</strong>`,
              ],
            };
          },
        },
      ],
    }),
  ],
};
