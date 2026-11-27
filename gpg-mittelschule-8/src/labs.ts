import type { LabId } from "./model/types";
import { esc } from "./workshop";

export const fmt = (n: number, digits = 1): string => {
  const rounded = Number(n.toFixed(digits));
  const clean = Object.is(rounded, -0) ? 0 : rounded;
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
    .format(clean)
    .replace(/^-/, "−");
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

export interface LabGoal {
  id: string;
  label: string;
  met: boolean;
}

/* ---------- 1. Energiemix ---------- */
export interface EnergyMixState {
  wind: number;
  solar: number;
  hydro: number;
  gas: number;
}
export const ENERGY_MIX_DEFAULT: EnergyMixState = {
  wind: 20,
  solar: 10,
  hydro: 5,
  gas: 25,
};
export function evaluateEnergyMix(s: EnergyMixState) {
  const sumFour = s.wind + s.solar + s.hydro + s.gas;
  const valid =
    [s.wind, s.solar, s.hydro, s.gas].every(
      (v) => Number.isFinite(v) && v >= 0 && v <= 100,
    ) && sumFour <= 100;
  const coal = valid ? 100 - sumFour : 0;
  const renewable = valid ? s.wind + s.solar + s.hydro : 0;
  const fossil = valid ? s.gas + coal : 0;
  const co2 = valid
    ? (s.wind * 15 + s.solar * 45 + s.hydro * 10 + s.gas * 450 + coal * 950) /
      100
    : 0;
  const fluctuating = valid ? s.wind + s.solar : 0;
  const goals: LabGoal[] = [
    {
      id: "renewable-75",
      label: "Mindestens 75 % erneuerbare Energien (bei höchstens 100 % gesamt)",
      met: valid && renewable >= 75,
    },
    {
      id: "low-co2",
      label: "Modell-Emissionen unter 150 g CO₂ pro kWh senken",
      met: valid && co2 < 150,
    },
    {
      id: "coal-exit",
      label: "Ohne Kohle (0 % Kohle) mit mindestens 20 % Erdgas-Reserve auskommen",
      met: valid && coal === 0 && s.gas >= 20,
    },
  ];
  return { valid, sumFour, coal, renewable, fossil, co2, fluctuating, goals };
}

/* ---------- 2. Haushalts-Energie ---------- */
export interface HouseholdEnergyState {
  temp: number;
  shower: number;
  led: boolean;
  efficiency: boolean;
}
export const HOUSEHOLD_DEFAULT: HouseholdEnergyState = {
  temp: 22,
  shower: 10,
  led: false,
  efficiency: false,
};
export function evaluateHousehold(s: HouseholdEnergyState) {
  const valid =
    Number.isFinite(s.temp) &&
    s.temp >= 18 &&
    s.temp <= 23 &&
    Number.isFinite(s.shower) &&
    s.shower >= 4 &&
    s.shower <= 12;
  const heating = Math.round(
    14000 * (1 + (s.temp - 22) * 0.06) - (s.efficiency ? 1000 : 0),
  );
  const hotWater = Math.round(s.shower * 240);
  const electricity = 3600 - (s.led ? 600 : 0) - (s.efficiency ? 400 : 0);
  const total = heating + hotWater + electricity;
  const baseline = 20000;
  const savingsPct = ((baseline - total) / baseline) * 100;
  const goals: LabGoal[] = [
    {
      id: "heat-11500",
      label: "Heizwärme auf höchstens 11 500 kWh/Jahr senken",
      met: valid && heating <= 11500,
    },
    {
      id: "water-elec-4500",
      label: "Warmwasser und Strom zusammen unter 4 500 kWh/Jahr bringen",
      met: valid && hotWater + electricity < 4500,
    },
    {
      id: "save-25",
      label: "Gesamtverbrauch um mindestens 25 % senken (auf ≤ 15 000 kWh/Jahr)",
      met: valid && total <= 15000,
    },
  ];
  return {
    valid,
    heating,
    hotWater,
    electricity,
    total,
    baseline,
    savingsPct,
    goals,
  };
}

/* ---------- 3. Gesetzgebung ---------- */
export interface LegislationState {
  lawType: "zustimmung" | "einspruch";
  btVotes: "none" | "simple" | "absolute";
  brStance: "agree" | "object";
  committee: boolean;
}
export const LEGISLATION_DEFAULT: LegislationState = {
  lawType: "zustimmung",
  btVotes: "none",
  brStance: "object",
  committee: false,
};
export function evaluateLegislation(s: LegislationState) {
  let stageReached: "bt" | "br" | "committee" | "enacted" = "bt";
  let passed = false;
  let statusText = "Im Bundestag abgelehnt (keine Mehrheit).";
  if (s.btVotes === "none") {
    stageReached = "bt";
    passed = false;
    statusText = "Im Bundestag gescheitert: Ohne Mehrheit geht der Entwurf nicht an den Bundesrat.";
  } else if (s.brStance === "agree") {
    stageReached = "enacted";
    passed = true;
    statusText = "Beschlossen und ausgefertigt: Bundestag und Bundesrat stimmen zu.";
  } else if (s.committee) {
    stageReached = "enacted";
    passed = true;
    statusText = "Kompromiss im Vermittlungsausschuss: Beide Kammern tragen die Einigung mit.";
  } else if (s.lawType === "zustimmung") {
    stageReached = "br";
    passed = false;
    statusText = "Am Bundesrat gescheitert: Ein Zustimmungsgesetz braucht zwingend ein Ja des Bundesrats.";
  } else if (s.btVotes === "absolute") {
    stageReached = "enacted";
    passed = true;
    statusText = "Einspruch überstimmt: Der Bundestag setzt das Einspruchsgesetz mit Kanzlermehrheit durch.";
  } else {
    stageReached = "br";
    passed = false;
    statusText = "Einspruch nicht überstimmt: Eine einfache Bundestagsmehrheit reicht nicht gegen den Bundesrat.";
  }
  const goals: LabGoal[] = [
    {
      id: "consent-direct",
      label: "Ein Zustimmungsgesetz direkt durch beide Kammern bringen",
      met: s.lawType === "zustimmung" && s.btVotes !== "none" && s.brStance === "agree" && passed,
    },
    {
      id: "override-objection",
      label: "Ein Einspruchsgesetz ohne Vermittlungsausschuss gegen den Bundesrat durchsetzen",
      met:
        s.lawType === "einspruch" &&
        s.btVotes === "absolute" &&
        s.brStance === "object" &&
        !s.committee &&
        passed,
    },
    {
      id: "use-committee",
      label: "Eine Blockade durch den Vermittlungsausschuss auflösen",
      met: s.btVotes !== "none" && s.brStance === "object" && s.committee && passed,
    },
  ];
  return { stageReached, passed, statusText, goals };
}

/* ---------- 4. Wahlbeteiligung ---------- */
export interface TurnoutState {
  young: number;
  middle: number;
  senior: number;
}
export const TURNOUT_DEFAULT: TurnoutState = {
  young: 45,
  middle: 70,
  senior: 80,
};
export function evaluateTurnout(s: TurnoutState) {
  const valid = [s.young, s.middle, s.senior].every(
    (v) => Number.isFinite(v) && v >= 20 && v <= 95,
  );
  const eligible = { young: 10000, middle: 55000, senior: 35000 };
  const votesYoung = Math.round((eligible.young * s.young) / 100);
  const votesMiddle = Math.round((eligible.middle * s.middle) / 100);
  const votesSenior = Math.round((eligible.senior * s.senior) / 100);
  const totalVotes = votesYoung + votesMiddle + votesSenior;
  const overallTurnout = (totalVotes / 100000) * 100;
  const shareYoung = totalVotes > 0 ? (votesYoung / totalVotes) * 100 : 0;
  const shareMiddle = totalVotes > 0 ? (votesMiddle / totalVotes) * 100 : 0;
  const shareSenior = totalVotes > 0 ? (votesSenior / totalVotes) * 100 : 0;
  const goals: LabGoal[] = [
    {
      id: "young-75",
      label: "Wahlbeteiligung der Erstwählenden (18–24) auf mindestens 75 % steigern",
      met: valid && s.young >= 75,
    },
    {
      id: "young-fair-share",
      label: "Stimmenanteil der 18–24-Jährigen mindestens auf ihren Bevölkerungsanteil (10,0 %) bringen",
      met: valid && shareYoung >= 10,
    },
    {
      id: "low-overall",
      label: "Gesamtbeteiligung unter 55 % senken und Stimmenverschiebung beobachten",
      met: valid && overallTurnout < 55,
    },
  ];
  return {
    valid,
    votesYoung,
    votesMiddle,
    votesSenior,
    totalVotes,
    overallTurnout,
    shareYoung,
    shareMiddle,
    shareSenior,
    goals,
  };
}

/* ---------- 5. Generationenvertrag ---------- */
export interface PensionState {
  contributors: number;
  rate: number;
  level: number;
}
export const PENSION_DEFAULT: PensionState = {
  contributors: 2.0,
  rate: 18,
  level: 48,
};
export function evaluatePension(s: PensionState) {
  const valid =
    Number.isFinite(s.contributors) &&
    s.contributors >= 1.5 &&
    s.contributors <= 6.0 &&
    Number.isFinite(s.rate) &&
    s.rate >= 14 &&
    s.rate <= 26 &&
    Number.isFinite(s.level) &&
    s.level >= 40 &&
    s.level <= 55;
  const avgWage = 3000;
  const revenue = Math.round(s.contributors * avgWage * (s.rate / 100));
  const target = Math.round(avgWage * (s.level / 100));
  const balance = revenue - target;
  const coveredLevel = (revenue / avgWage) * 100;
  const goals: LabGoal[] = [
    {
      id: "historical-ratio",
      label: "Verhältnis früherer Jahrzehnte (≥ 4,0 Beitragszahlende je Rente) mit Überschuss testen",
      met: valid && s.contributors >= 4.0 && balance > 0,
    },
    {
      id: "balance-at-2",
      label: "Bei höchstens 2,0 Beitragszahlenden und ≥ 48 % Zielniveau ohne Lücke ausgleichen",
      met: valid && s.contributors <= 2.0 && s.level >= 48 && balance >= 0,
    },
    {
      id: "stress-test",
      label: "Starken Wandel (1,5 Beitragszahlende) mit unter 40 % gedecktem Rentenniveau prüfen",
      met: valid && s.contributors <= 1.5 && coveredLevel < 40,
    },
  ];
  return { valid, revenue, target, balance, coveredLevel, goals };
}

/* ---------- 6. Ökolandbau-Kosten ---------- */
export interface FarmCostState {
  mode: "konventionell" | "oeko";
  wage: number;
  yieldPct: number;
  directSale: boolean;
}
export const FARM_COST_DEFAULT: FarmCostState = {
  mode: "konventionell",
  wage: 16,
  yieldPct: 100,
  directSale: false,
};
export function evaluateFarmCosts(s: FarmCostState) {
  const valid =
    Number.isFinite(s.wage) &&
    s.wage >= 14 &&
    s.wage <= 24 &&
    Number.isFinite(s.yieldPct) &&
    s.yieldPct >= 80 &&
    s.yieldPct <= 120;
  const calc = (isOrganic: boolean) => {
    const baseYield = isOrganic ? 24000 : 35000;
    const kg = Math.round(baseYield * (s.yieldPct / 100));
    const hours = (isOrganic ? 420 : 280) + (s.directSale ? 40 : 0);
    const labor = hours * s.wage;
    const inputs = (isOrganic ? 1350 : 2200) + (s.directSale ? 400 : 0);
    const fixed = 3500;
    const total = labor + inputs + fixed;
    const ctPerKg = Math.round((total / kg) * 100);
    const laborCt = Math.round((labor / kg) * 100);
    const inputsCt = Math.round((inputs / kg) * 100);
    const fixedCt = Math.max(0, ctPerKg - laborCt - inputsCt);
    return { kg, total, ctPerKg, laborCt, inputsCt, fixedCt };
  };
  const conv = calc(false);
  const oeko = calc(true);
  const active = s.mode === "oeko" ? oeko : conv;
  const goals: LabGoal[] = [
    {
      id: "inspect-oeko",
      label: "In den ökologischen Anbau wechseln und den Stückpreis vergleichen",
      met: valid && s.mode === "oeko",
    },
    {
      id: "weather-drop",
      label: "Ertragsrückgang auf 80 % im Öko-Anbau testen (Stückkosten über 58 ct/kg)",
      met: valid && s.mode === "oeko" && oeko.ctPerKg > 58,
    },
    {
      id: "wage-direct",
      label: "Öko-Anbau mit mindestens 22 €/h Lohn und Direktvermarktung durchrechnen",
      met: valid && s.mode === "oeko" && s.wage >= 22 && s.directSale,
    },
  ];
  return { valid, conv, oeko, active, goals };
}

/* ---------- Live SVG renderers ---------- */
function renderGoalsHtml(goals: LabGoal[]): string {
  return `<ul class="lab-goals">${goals
    .map(
      (g) =>
        `<li class="${g.met ? "met" : ""}"><span>${g.met ? "✓" : "○"}</span><span>${esc(g.label)}</span></li>`,
    )
    .join("")}</ul>`;
}

function renderEnergyMixSvg(s: EnergyMixState, r: ReturnType<typeof evaluateEnergyMix>): string {
  const parts: Array<[string, number, string]> = [
    ["Wind", s.wind, "#2f7fd0"],
    ["Solar", s.solar, "#f09a2e"],
    ["Wasser", s.hydro, "#0e8aa0"],
    ["Erdgas", s.gas, "#8c62d0"],
    ["Kohle", r.coal, "#6e655f"],
  ];
  const barW = 540;
  let x = 20;
  const segments = r.valid
    ? parts
        .filter(([, val]) => val > 0)
        .map(([labelText, val, color]) => {
          const w = (val / 100) * barW;
          const seg = `<rect x="${f1(x)}" y="36" width="${f1(w)}" height="32" fill="${color}"/>${w >= 46 ? `<text x="${f1(x + w / 2)}" y="56" text-anchor="middle" fill="#fff" font-size="11.5" font-weight="700">${esc(labelText)} ${val}%</text>` : ""}`;
          x += w;
          return seg;
        })
        .join("")
    : `<rect x="20" y="36" width="${barW}" height="32" fill="#c62f2f" opacity="0.25"/><text x="290" y="56" text-anchor="middle" class="lbl small">Summe über 100 % — Regler zurücknehmen</text>`;
  const co2W = r.valid ? clamp((r.co2 / 1000) * barW, 0, barW) : 0;
  const thresholdX = 20 + (150 / 1000) * barW;
  return `<svg class="figure-svg lab-svg" viewBox="0 0 600 185" role="img" aria-label="Maßstäbliches Balkendiagramm des Strommixes und der Modell-Emissionen">
    <text x="20" y="24" class="lbl strong small">Strommix (100-%-Balken, maßstäblich)</text>
    <rect x="20" y="36" width="${barW}" height="32" rx="4" fill="none" stroke="var(--line)"/>
    ${segments}
    <text x="20" y="92" class="lbl tiny">Erneuerbar: ${r.valid ? `${r.renewable} %` : "—"} · Wetterabhängig (Wind+Solar): ${r.valid ? `${r.fluctuating} %` : "—"} · Kohle: ${r.valid ? `${r.coal} %` : "—"}</text>
    <text x="20" y="124" class="lbl strong small">Modell-Emissionen: ${r.valid ? `${fmt(r.co2)} g CO₂/kWh` : "ungültig"} (Ziel &lt; 150 g)</text>
    <rect x="20" y="136" width="${barW}" height="24" rx="4" fill="var(--soft)" stroke="var(--line)"/>
    <rect x="20" y="136" width="${f1(co2W)}" height="24" rx="4" fill="${r.co2 < 150 ? "#1f7a3a" : "#c62f2f"}"/>
    <line x1="${f1(thresholdX)}" y1="130" x2="${f1(thresholdX)}" y2="166" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 2"/>
    <text x="${f1(thresholdX + 6)}" y="176" class="lbl tiny">150 g</text>
    <text x="560" y="176" text-anchor="end" class="lbl tiny">Skala: 0 bis 1 000 g/kWh</text>
  </svg>`;
}

function renderHouseholdSvg(r: ReturnType<typeof evaluateHousehold>): string {
  const maxKwh = 22000;
  const barW = 370;
  const x0 = 120;
  const seg = (val: number, color: string, xStart: number, y: number, name: string) => {
    const w = clamp((val / maxKwh) * barW, 0, barW);
    return {
      svg: `<rect x="${f1(xStart)}" y="${y}" width="${f1(w)}" height="28" fill="${color}"/>${w >= 58 ? `<text x="${f1(xStart + w / 2)}" y="${y + 18}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${esc(name)}</text>` : ""}`,
      nextX: xStart + w,
    };
  };
  const b1 = seg(14000, "#d4483b", x0, 34, "Heizung");
  const b2 = seg(2400, "#f09a2e", b1.nextX, 34, "Wasser");
  const b3 = seg(3600, "#2f7fd0", b2.nextX, 34, "Strom");
  const c1 = seg(r.heating, "#d4483b", x0, 84, "Heizung");
  const c2 = seg(r.hotWater, "#f09a2e", c1.nextX, 84, "Wasser");
  const c3 = seg(r.electricity, "#2f7fd0", c2.nextX, 84, "Strom");
  return `<svg class="figure-svg lab-svg" viewBox="0 0 600 155" role="img" aria-label="Maßstäblicher Vergleich zwischen Ausgangsverbrauch 20 000 kWh und aktuellem Haushaltsverbrauch">
    <text x="18" y="52" class="lbl small">Ausgangsfall</text>
    ${b1.svg}${b2.svg}${b3.svg}
    <text x="${f1(b3.nextX + 8)}" y="52" class="lbl tiny">${fmt(20000, 0)} kWh</text>
    <text x="18" y="102" class="lbl strong small">Dein Modell</text>
    ${c1.svg}${c2.svg}${c3.svg}
    <text x="${f1(c3.nextX + 8)}" y="102" class="lbl strong tiny">${fmt(r.total, 0)} kWh</text>
    <text x="18" y="138" class="lbl tiny">Heizung: ${fmt(r.heating, 0)} kWh · Warmwasser: ${fmt(r.hotWater, 0)} kWh · Strom: ${fmt(r.electricity, 0)} kWh · Veränderung: ${fmt(r.savingsPct)} %</text>
  </svg>`;
}

function renderLegislationSvg(s: LegislationState, r: ReturnType<typeof evaluateLegislation>): string {
  const btPass = s.btVotes !== "none";
  const brPass = s.brStance === "agree" || (s.lawType === "einspruch" && s.btVotes === "absolute" && !s.committee) || s.committee;
  const box = (x: number, y: number, w: number, h: number, title: string, sub: string, state: "pass" | "fail" | "idle") => {
    const rectAttrs =
      state === "pass"
        ? 'class="box-green"'
        : state === "fail"
          ? 'class="box-red"'
          : 'fill="var(--soft)" stroke="var(--line)" stroke-width="2"';
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" ${rectAttrs}/><text x="${x + w / 2}" y="${y + 23}" text-anchor="middle" fill="var(--ink)" font-size="12.5" font-weight="700">${esc(title)}</text><text x="${x + w / 2}" y="${y + 41}" text-anchor="middle" fill="var(--ink)" font-size="10.5">${esc(sub)}</text>`;
  };
  return `<svg class="figure-svg lab-svg" viewBox="0 0 640 165" role="img" aria-label="Flussdiagramm des Gesetzgebungswegs durch Bundestag, Bundesrat, Vermittlungsausschuss und Bundespräsident">
    ${box(14, 24, 125, 54, "1. Initiative", "Regierung / BT / BR", "pass")}
    <path d="M139 51H165" stroke="var(--ink)" stroke-width="2.5"/>
    ${box(165, 24, 138, 54, "2. Bundestag", s.btVotes === "none" ? "keine Mehrheit" : s.btVotes === "absolute" ? "Kanzlermehrheit" : "einfache Mehrheit", btPass ? "pass" : "fail")}
    <path d="M303 51H330" stroke="var(--ink)" stroke-width="2.5"/>
    ${box(330, 24, 138, 54, "3. Bundesrat", s.brStance === "agree" ? "stimmt zu" : s.lawType === "zustimmung" ? "Zustimmung nötig" : "Einspruch", !btPass ? "idle" : s.brStance === "agree" ? "pass" : brPass ? "pass" : "fail")}
    <path d="M468 51H494" stroke="var(--ink)" stroke-width="2.5"/>
    ${box(494, 24, 132, 54, "4. Verkündung", r.passed ? "Gesetz gilt" : "gestoppt", r.passed ? "pass" : "fail")}
    ${box(250, 98, 220, 48, "Vermittlungsausschuss", s.committee ? "Kompromiss gefunden" : "nicht angerufen", !btPass || s.brStance === "agree" ? "idle" : s.committee ? "pass" : "idle")}
  </svg>`;
}

function renderTurnoutSvg(r: ReturnType<typeof evaluateTurnout>): string {
  const groups: Array<[string, number, number, string]> = [
    ["18–24 Jahre", 10, r.shareYoung, "#1559b0"],
    ["25–59 Jahre", 55, r.shareMiddle, "#6a3bc4"],
    ["60+ Jahre", 35, r.shareSenior, "#9a4a07"],
  ];
  const barW = 360;
  const x0 = 150;
  const rows = groups
    .map(([name, elig, votes, color], i) => {
      const y = 34 + i * 48;
      const wElig = (elig / 100) * barW;
      const wVotes = (votes / 100) * barW;
      return `<text x="16" y="${y + 18}" class="lbl strong small">${esc(name)}</text>
        <rect x="${x0}" y="${y}" width="${f1(wElig)}" height="12" rx="3" fill="var(--muted)" opacity="0.45"/>
        <text x="${f1(x0 + wElig + 6)}" y="${y + 10}" class="lbl tiny">Wahlberechtigte: ${elig} %</text>
        <rect x="${x0}" y="${y + 16}" width="${f1(wVotes)}" height="14" rx="3" fill="${color}"/>
        <text x="${f1(x0 + wVotes + 6)}" y="${y + 27}" class="lbl tiny strong">Stimmen: ${fmt(votes)} %</text>`;
    })
    .join("");
  return `<svg class="figure-svg lab-svg" viewBox="0 0 600 185" role="img" aria-label="Vergleich zwischen Anteil an Wahlberechtigten und Anteil an abgegebenen Stimmen je Altersgruppe">
    <text x="16" y="20" class="lbl strong small">Gesamtwahlbeteiligung im Modell: ${fmt(r.overallTurnout)} % (${fmt(r.totalVotes, 0)} von 100 000 Stimmen)</text>
    ${rows}
  </svg>`;
}

function renderPensionSvg(r: ReturnType<typeof evaluatePension>): string {
  const maxVal = 3600;
  const barW = 380;
  const wRev = clamp((r.revenue / maxVal) * barW, 0, barW);
  const wTar = clamp((r.target / maxVal) * barW, 0, barW);
  const angle = clamp((r.balance / 1000) * 10, -14, 14);
  return `<svg class="figure-svg lab-svg" viewBox="0 0 600 190" role="img" aria-label="Waage und Vergleichsbalken des Umlage-Modells zwischen Beitragseinnahmen und Rentenziel">
    <text x="20" y="24" class="lbl strong small">Umlage pro Rentnerin / Rentner (Monat)</text>
    <text x="20" y="54" class="lbl small">Einnahmen</text>
    <rect x="130" y="38" width="${f1(wRev)}" height="22" rx="4" fill="#1f7a3a"/>
    <text x="${f1(138 + wRev)}" y="54" class="lbl small strong">${fmt(r.revenue, 0)} €</text>
    <text x="20" y="88" class="lbl small">Rentenziel</text>
    <rect x="130" y="72" width="${f1(wTar)}" height="22" rx="4" fill="#2f7fd0"/>
    <text x="${f1(138 + wTar)}" y="88" class="lbl small strong">${fmt(r.target, 0)} €</text>
    <g transform="translate(300,148)">
      <path d="M-18 28L0 4L18 28Z" fill="var(--muted)"/>
      <g transform="rotate(${f1(-angle)})">
        <line x1="-120" y1="0" x2="120" y2="0" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="-120" cy="0" r="8" fill="#1f7a3a"/>
        <circle cx="120" cy="0" r="8" fill="#2f7fd0"/>
      </g>
    </g>
    <text x="20" y="138" class="lbl tiny">Beitragskasse deckt ${fmt(r.coveredLevel)} %</text>
    <text x="580" y="138" text-anchor="end" class="lbl tiny strong">${r.balance >= 0 ? `Überschuss: +${fmt(r.balance, 0)} €` : `Lücke: ${fmt(r.balance, 0)} €`}</text>
  </svg>`;
}

function renderFarmCostsSvg(s: FarmCostState, r: ReturnType<typeof evaluateFarmCosts>): string {
  const maxCt = 100;
  const barW = 400;
  const x0 = 140;
  const drawRow = (labelText: string, y: number, d: typeof r.conv, highlighted: boolean) => {
    const wLab = clamp((d.laborCt / maxCt) * barW, 0, barW);
    const wInp = clamp((d.inputsCt / maxCt) * barW, 0, barW);
    const wFix = clamp((d.fixedCt / maxCt) * barW, 0, barW);
    return `<text x="16" y="${y + 18}" class="lbl ${highlighted ? "strong" : ""} small">${esc(labelText)}</text>
      <rect x="${x0}" y="${y}" width="${f1(wLab)}" height="24" fill="#2f7fd0"/>
      <rect x="${f1(x0 + wLab)}" y="${y}" width="${f1(wInp)}" height="24" fill="#f09a2e"/>
      <rect x="${f1(x0 + wLab + wInp)}" y="${y}" width="${f1(wFix)}" height="24" fill="#8b93a0"/>
      <text x="${f1(x0 + wLab + wInp + wFix + 8)}" y="${y + 17}" class="lbl small strong">${d.ctPerKg} ct/kg</text>`;
  };
  return `<svg class="figure-svg lab-svg" viewBox="0 0 600 156" role="img" aria-label="Maßstäblicher Kostenvergleich in Cent pro Kilogramm zwischen konventionellem und ökologischem Anbau">
    <text x="16" y="22" class="lbl strong small">Produktionskosten (ct/kg, gemeinsame Skala 0–100 ct)</text>
    ${drawRow("Konventionell", 38, r.conv, s.mode === "konventionell")}
    ${drawRow("Ökologisch", 76, r.oeko, s.mode === "oeko")}
    <text x="16" y="124" class="lbl tiny">Blau: Arbeit · Orange: Pflanzenschutz/Düngung/Kontrolle · Grau: Fläche &amp; Maschinen</text>
    <text x="16" y="142" class="lbl tiny">Ertrag (${s.mode === "oeko" ? "Öko" : "Konv."}): ${fmt(r.active.kg, 0)} kg/ha</text>
  </svg>`;
}

export function renderLab(labId: LabId): string {
  if (labId === "energiemix") {
    const r = evaluateEnergyMix(ENERGY_MIX_DEFAULT);
    return `<section class="panel lab" data-lab="energiemix" aria-labelledby="lab-title"><span class="eyebrow">MODELL-LABOR</span><h2 id="lab-title">Strommix und CO₂-Bilanz steuern</h2><p class="small">Vereinfachtes Rechenmodell (100 % gesamt). Ziehe an den Reglern für Wind, Solar, Wasser und Erdgas — Kohle füllt die Lücke bis 100 %.</p><div class="lab-controls">${[
      ["wind", "Windkraft (%)", 0, 80, 5, ENERGY_MIX_DEFAULT.wind],
      ["solar", "Solarstrom (%)", 0, 60, 5, ENERGY_MIX_DEFAULT.solar],
      ["hydro", "Wasserkraft (%)", 0, 30, 5, ENERGY_MIX_DEFAULT.hydro],
      ["gas", "Erdgas (%)", 0, 80, 5, ENERGY_MIX_DEFAULT.gas],
    ]
      .map(
        ([k, lbl, min, max, step, val]) =>
          `<label><span>${lbl}: <output id="out-${k}">${val} %</output></span><input type="range" data-control="${k}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`,
      )
      .join("")}</div><div id="lab-output" role="status" aria-live="polite">${renderEnergyMixSvg(ENERGY_MIX_DEFAULT, r)}${renderGoalsHtml(r.goals)}</div></section>`;
  }
  if (labId === "haushalt-energie") {
    const r = evaluateHousehold(HOUSEHOLD_DEFAULT);
    return `<section class="panel lab" data-lab="haushalt-energie" aria-labelledby="lab-title"><span class="eyebrow">MODELL-LABOR</span><h2 id="lab-title">Energie im Modell-Haushalt sparen</h2><p class="small">Fiktiver 4-Personen-Haushalt (Ausgangsverbrauch 20 000 kWh/Jahr). Verändere Temperatur, Duschzeit und Alltagsgewohnheiten.</p><div class="lab-controls">
      <label><span>Raumtemperatur: <output id="out-temp">22 °C</output></span><input type="range" data-control="temp" min="18" max="23" step="1" value="22"></label>
      <label><span>Duschdauer pro Person: <output id="out-shower">10 min</output></span><input type="range" data-control="shower" min="4" max="12" step="2" value="10"></label>
      <label class="toggle"><input type="checkbox" data-control="led"> LED-Lampen &amp; schaltbare Steckerleisten</label>
      <label class="toggle"><input type="checkbox" data-control="efficiency"> Stoßlüften statt Kippfenster &amp; Deckel beim Kochen</label>
    </div><div id="lab-output" role="status" aria-live="polite">${renderHouseholdSvg(r)}${renderGoalsHtml(r.goals)}</div></section>`;
  }
  if (labId === "gesetzgebung") {
    const r = evaluateLegislation(LEGISLATION_DEFAULT);
    return `<section class="panel lab" data-lab="gesetzgebung" aria-labelledby="lab-title"><span class="eyebrow">MODELL-LABOR</span><h2 id="lab-title">Weg eines Gesetzes durch Bundestag und Bundesrat</h2><p class="small">Prüfe, wann ein Gesetz die Zustimmung des Bundesrats braucht und wann der Bundestag einen Einspruch überstimmen kann.</p><div class="lab-controls">
      <label><span>Gesetzesart</span><select data-control="lawType"><option value="zustimmung" selected>Zustimmungsgesetz (Länder)</option><option value="einspruch">Einspruchsgesetz</option></select></label>
      <label><span>Bundestag (3. Lesung)</span><select data-control="btVotes"><option value="none" selected>Keine Mehrheit</option><option value="simple">Einfache Mehrheit</option><option value="absolute">Absolute Kanzlermehrheit</option></select></label>
      <label><span>Bundesrat</span><select data-control="brStance"><option value="object" selected>Einspruch / Ablehnung</option><option value="agree">Stimmt zu</option></select></label>
      <label class="toggle"><input type="checkbox" data-control="committee"> Vermittlungsausschuss findet Kompromiss</label>
    </div><div id="lab-output" role="status" aria-live="polite">${renderLegislationSvg(LEGISLATION_DEFAULT, r)}<p class="small"><strong>Ergebnis:</strong> ${esc(r.statusText)}</p>${renderGoalsHtml(r.goals)}</div></section>`;
  }
  if (labId === "wahlbeteiligung") {
    const r = evaluateTurnout(TURNOUT_DEFAULT);
    return `<section class="panel lab" data-lab="wahlbeteiligung" aria-labelledby="lab-title"><span class="eyebrow">MODELL-LABOR</span><h2 id="lab-title">Wie Wahlbeteiligung das Stimmgewicht verändert</h2><p class="small">Fiktiver Wahlkreis (100 000 Wahlberechtigte: 10 % Junge, 55 % Mittlere, 35 % Ältere). Beobachte, wie sich Nichtwählen auswirkt.</p><div class="lab-controls">
      <label><span>18–24 Jahre (Erstwählende): <output id="out-young">45 %</output></span><input type="range" data-control="young" min="20" max="95" step="5" value="45"></label>
      <label><span>25–59 Jahre: <output id="out-middle">70 %</output></span><input type="range" data-control="middle" min="20" max="95" step="5" value="70"></label>
      <label><span>60+ Jahre: <output id="out-senior">80 %</output></span><input type="range" data-control="senior" min="20" max="95" step="5" value="80"></label>
    </div><div id="lab-output" role="status" aria-live="polite">${renderTurnoutSvg(r)}${renderGoalsHtml(r.goals)}</div></section>`;
  }
  if (labId === "generationenvertrag") {
    const r = evaluatePension(PENSION_DEFAULT);
    return `<section class="panel lab" data-lab="generationenvertrag" aria-labelledby="lab-title"><span class="eyebrow">MODELL-LABOR</span><h2 id="lab-title">Generationenvertrag und demographischer Wandel</h2><p class="small">Fiktives Umlage-Rechenmodell (Durchschnittslohn 3 000 € im Monat, vereinfacht ohne Bundeszuschuss). Prüfe Einnahmen und Ausgaben.</p><div class="lab-controls">
      <label><span>Beitragszahlende je Rente: <output id="out-contributors">2,0</output></span><input type="range" data-control="contributors" min="1.5" max="6.0" step="0.5" value="2.0"></label>
      <label><span>Beitragssatz: <output id="out-rate">18 %</output></span><input type="range" data-control="rate" min="14" max="26" step="1" value="18"></label>
      <label><span>Ziel-Rentenniveau: <output id="out-level">48 %</output></span><input type="range" data-control="level" min="40" max="55" step="1" value="48"></label>
    </div><div id="lab-output" role="status" aria-live="polite">${renderPensionSvg(r)}${renderGoalsHtml(r.goals)}</div></section>`;
  }
  const r = evaluateFarmCosts(FARM_COST_DEFAULT);
  return `<section class="panel lab" data-lab="oekolandbau-kosten" aria-labelledby="lab-title"><span class="eyebrow">MODELL-LABOR</span><h2 id="lab-title">Produktionskosten: Ökologischer vs. konventioneller Anbau</h2><p class="small">Fiktives Betriebsmodell für 1 Hektar Speiseäpfel (vereinfachte Einzelkosten). Vergleiche Arbeit, Ertrag und Stückpreis.</p><div class="lab-controls">
    <label><span>Anbauweise</span><select data-control="mode"><option value="konventionell" selected>Konventionell</option><option value="oeko">Ökologisch (Bio)</option></select></label>
    <label><span>Stundenlohn: <output id="out-wage">16 €/h</output></span><input type="range" data-control="wage" min="14" max="24" step="2" value="16"></label>
    <label><span>Witterung / Ertragsfaktor: <output id="out-yieldPct">100 %</output></span><input type="range" data-control="yieldPct" min="80" max="120" step="10" value="100"></label>
    <label class="toggle"><input type="checkbox" data-control="directSale"> Direktvermarktung ab Hof einrechnen</label>
  </div><div id="lab-output" role="status" aria-live="polite">${renderFarmCostsSvg(FARM_COST_DEFAULT, r)}${renderGoalsHtml(r.goals)}</div></section>`;
}

export function bindLab(root: HTMLElement, labId: LabId): void {
  const lab = root.querySelector<HTMLElement>(`[data-lab="${labId}"]`);
  const out = lab?.querySelector<HTMLElement>("#lab-output");
  if (!lab || !out) return;
  const val = (name: string) =>
    lab.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-control="${name}"]`);
  const update = () => {
    if (labId === "energiemix") {
      const s: EnergyMixState = {
        wind: Number(val("wind")!.value),
        solar: Number(val("solar")!.value),
        hydro: Number(val("hydro")!.value),
        gas: Number(val("gas")!.value),
      };
      for (const k of ["wind", "solar", "hydro", "gas"] as const)
        lab.querySelector(`#out-${k}`)!.textContent = `${s[k]} %`;
      const r = evaluateEnergyMix(s);
      out.innerHTML = `${renderEnergyMixSvg(s, r)}${renderGoalsHtml(r.goals)}`;
    } else if (labId === "haushalt-energie") {
      const s: HouseholdEnergyState = {
        temp: Number(val("temp")!.value),
        shower: Number(val("shower")!.value),
        led: (val("led") as HTMLInputElement).checked,
        efficiency: (val("efficiency") as HTMLInputElement).checked,
      };
      lab.querySelector("#out-temp")!.textContent = `${s.temp} °C`;
      lab.querySelector("#out-shower")!.textContent = `${s.shower} min`;
      const r = evaluateHousehold(s);
      out.innerHTML = `${renderHouseholdSvg(r)}${renderGoalsHtml(r.goals)}`;
    } else if (labId === "gesetzgebung") {
      const s: LegislationState = {
        lawType: val("lawType")!.value as "zustimmung" | "einspruch",
        btVotes: val("btVotes")!.value as "none" | "simple" | "absolute",
        brStance: val("brStance")!.value as "agree" | "object",
        committee: (val("committee") as HTMLInputElement).checked,
      };
      const r = evaluateLegislation(s);
      out.innerHTML = `${renderLegislationSvg(s, r)}<p class="small"><strong>Ergebnis:</strong> ${esc(r.statusText)}</p>${renderGoalsHtml(r.goals)}`;
    } else if (labId === "wahlbeteiligung") {
      const s: TurnoutState = {
        young: Number(val("young")!.value),
        middle: Number(val("middle")!.value),
        senior: Number(val("senior")!.value),
      };
      for (const k of ["young", "middle", "senior"] as const)
        lab.querySelector(`#out-${k}`)!.textContent = `${s[k]} %`;
      const r = evaluateTurnout(s);
      out.innerHTML = `${renderTurnoutSvg(r)}${renderGoalsHtml(r.goals)}`;
    } else if (labId === "generationenvertrag") {
      const s: PensionState = {
        contributors: Number(val("contributors")!.value),
        rate: Number(val("rate")!.value),
        level: Number(val("level")!.value),
      };
      lab.querySelector("#out-contributors")!.textContent = fmt(s.contributors);
      lab.querySelector("#out-rate")!.textContent = `${s.rate} %`;
      lab.querySelector("#out-level")!.textContent = `${s.level} %`;
      const r = evaluatePension(s);
      out.innerHTML = `${renderPensionSvg(r)}${renderGoalsHtml(r.goals)}`;
    } else {
      const s: FarmCostState = {
        mode: val("mode")!.value as "konventionell" | "oeko",
        wage: Number(val("wage")!.value),
        yieldPct: Number(val("yieldPct")!.value),
        directSale: (val("directSale") as HTMLInputElement).checked,
      };
      lab.querySelector("#out-wage")!.textContent = `${s.wage} €/h`;
      lab.querySelector("#out-yieldPct")!.textContent = `${s.yieldPct} %`;
      const r = evaluateFarmCosts(s);
      out.innerHTML = `${renderFarmCostsSvg(s, r)}${renderGoalsHtml(r.goals)}`;
    }
  };
  lab.querySelectorAll("[data-control]").forEach((el) => {
    el.addEventListener("input", update);
    el.addEventListener("change", update);
  });
}
