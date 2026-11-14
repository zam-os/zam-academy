import { f1, label, labels, svg } from "./figures/draw";
import type { LabKind } from "./model/types";
import { esc } from "./workshop";

export interface LabGoal {
  text: string;
  met: boolean;
}

export interface LabState {
  month: number;
  hemisphere: "Nord" | "Süd";
  temp: number;
  thermoMode: "fluessigkeit" | "bimetall";
  eyeType: "normal" | "kurz" | "weitsichtig";
  lensType: "ohne" | "zerstreuung" | "sammel";
  activeOrgan: "none" | "atmung" | "kreislauf" | "verdauung" | "nerven";
  seenAtmung: boolean;
  seenKreislauf: boolean;
  seenVerdauung: boolean;
  seenNerven: boolean;
  torsoCoop: boolean;
  armAngle: number;
  showTendons: boolean;
  particlePhase: "fest" | "fluessig" | "gas";
  particleMixture: "reinstoff" | "gemisch";
}

export function freshLab(): LabState {
  return {
    month: 3,
    hemisphere: "Nord",
    temp: 20,
    thermoMode: "fluessigkeit",
    eyeType: "normal",
    lensType: "ohne",
    activeOrgan: "none",
    seenAtmung: false,
    seenKreislauf: false,
    seenVerdauung: false,
    seenNerven: false,
    torsoCoop: false,
    armAngle: 110,
    showTendons: false,
    particlePhase: "fluessig",
    particleMixture: "reinstoff",
  };
}

export const fmtDe = (value: number, digits = 0): string => {
  const rounded = Number(value.toFixed(digits));
  const safe = Object.is(rounded, -0) ? 0 : rounded;
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
    .format(safe)
    .replace(/-/g, "−");
};

const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

function seasonMetrics(s: LabState) {
  const decl = 23.5 * Math.sin((2 * Math.PI * (s.month - 3)) / 12);
  const hemiSign = s.hemisphere === "Nord" ? 1 : -1;
  const effDecl = hemiSign * decl;
  const sunAngle = 42 + effDecl;
  const daylightHours = 12 + (effDecl / 23.5) * 4;
  const northMonthIdx = s.month % 12; // 0 = Dez, 1 = Jan, ..., 11 = Nov
  const effectiveIdx =
    s.hemisphere === "Nord" ? northMonthIdx : (northMonthIdx + 6) % 12;
  const seasonLabel =
    effectiveIdx <= 2
      ? "Winter"
      : effectiveIdx <= 5
        ? "Frühling"
        : effectiveIdx <= 8
          ? "Sommer"
          : "Herbst";
  return { decl, sunAngle, daylightHours, seasonLabel };
}

export function labGoals(kind: LabKind, s: LabState): LabGoal[] {
  if (kind === "seasons") {
    const m = seasonMetrics(s);
    return [
      {
        text: "Sommer beobachten: hoher Sonnenstand (ab 60°) und langer Tag",
        met: m.sunAngle >= 60,
      },
      {
        text: "Winter beobachten: flacher Sonnenstand (bis 25°) und kurzer Tag",
        met: m.sunAngle <= 25,
      },
      {
        text: "Auf die Südhalbkugel umschalten und Jahreszeiten vergleichen",
        met: s.hemisphere === "Süd",
      },
    ];
  }
  if (kind === "thermometer") {
    return [
      {
        text: "Auf mindestens 80 °C erwärmen: Flüssigkeit steigt und Teilchen werden schneller",
        met: s.temp >= 80,
      },
      {
        text: "Bis zum Gefrierpunkt (0 °C oder kälter) abkühlen",
        met: s.temp <= 0,
      },
      {
        text: "Bimetall-Thermometer einschalten und Verbiegung bei Temperaturänderung prüfen",
        met: s.thermoMode === "bimetall",
      },
    ];
  }
  if (kind === "eyeLens") {
    return [
      {
        text: "Kurzsichtigkeit mit Zerstreuungslinse korrigieren (scharf auf Netzhaut)",
        met: s.eyeType === "kurz" && s.lensType === "zerstreuung",
      },
      {
        text: "Weitsichtigkeit mit Sammellinse korrigieren (scharf auf Netzhaut)",
        met: s.eyeType === "weitsichtig" && s.lensType === "sammel",
      },
      {
        text: "Einen Sehfehler ohne Brille ansehen: Brennpunkt liegt neben der Netzhaut",
        met: s.eyeType !== "normal" && s.lensType === "ohne",
      },
    ];
  }
  if (kind === "torso") {
    return [
      {
        text: "Atmungs- und Blutkreislaufsystem im Überblick anwählen",
        met: s.seenAtmung && s.seenKreislauf,
      },
      {
        text: "Verdauungs- und Nervensystem im Überblick anwählen",
        met: s.seenVerdauung && s.seenNerven,
      },
      {
        text: "Zusammenspiel aller vier Organsysteme einblenden",
        met: s.torsoCoop,
      },
    ];
  }
  if (kind === "armLever") {
    return [
      {
        text: "Arm stark beugen (Ellbogenwinkel bis 60°): Bizeps zieht sich zusammen",
        met: s.armAngle <= 60,
      },
      {
        text: "Arm fast ganz strecken (über 155°): Trizeps spannt als Gegenspieler",
        met: s.armAngle >= 155,
      },
      {
        text: "Knochen, Sehnen und Scharniergelenk beschriften lassen",
        met: s.showTendons,
      },
    ];
  }
  return [
    {
      text: "Festen Reinstoff im Teilchenmodell betrachten (geordnete Plätze)",
      met: s.particlePhase === "fest" && s.particleMixture === "reinstoff",
    },
    {
      text: "Gasförmigen Stoff beobachten (große Abstände, schnelle Bewegung)",
      met: s.particlePhase === "gas",
    },
    {
      text: "Auf Stoffgemisch umschalten und verschiedene Teilchensorten erkennen",
      met: s.particleMixture === "gemisch",
    },
  ];
}

function drawSeasons(s: LabState): string {
  const m = seasonMetrics(s);
  const cx = 350;
  const cy = 105;
  const orbitR = 96;
  const orbitRy = 38;
  // Juni links (phi = PI) -> nach rechts oben geneigter Nordpol zeigt zur Sonne;
  // Dezember rechts (phi = 0) -> derselbe Nordpol zeigt von der Sonne weg.
  const phi = ((s.month - 12) / 12) * Math.PI * 2;
  const ex = cx + orbitR * Math.cos(phi);
  const ey = cy + orbitRy * Math.sin(phi);
  const dx = ex - cx;
  const dy = ey - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;
  const rays = [-10, -3.5, 3.5, 10]
    .map(
      (k) =>
        `<line x1="${f1(cx + ux * 26 + px * k)}" y1="${f1(cy + uy * 26 + py * k)}" x2="${f1(ex - ux * 18 + px * k * 0.7)}" y2="${f1(ey - uy * 18 + py * k * 0.7)}" stroke="var(--f-orange)" stroke-width="1.4" stroke-dasharray="3 3"/>`,
    )
    .join("");
  const sunAngleToEarth = Math.atan2(-uy, -ux);
  const dayR = 14;
  const dsx = dayR * Math.cos(sunAngleToEarth - Math.PI / 2);
  const dsy = dayR * Math.sin(sunAngleToEarth - Math.PI / 2);
  const dex = dayR * Math.cos(sunAngleToEarth + Math.PI / 2);
  const dey = dayR * Math.sin(sunAngleToEarth + Math.PI / 2);
  const tilt = 23.5;
  const axDx = 24 * Math.sin((tilt * Math.PI) / 180);
  const axDy = -24 * Math.cos((tilt * Math.PI) / 180);
  return svg(
    520,
    210,
    `Erdumlauf und Erdachse im ${MONTHS[s.month - 1]}`,
    `<rect class="space" x="0" y="0" width="520" height="210" rx="12"/>
     <ellipse cx="${cx}" cy="${cy}" rx="${orbitR}" ry="${orbitRy}" fill="none" stroke="#9ec3ea" stroke-width="1.5" stroke-dasharray="5 5"/>
     <circle class="sun" cx="${cx}" cy="${cy}" r="22"/>
     ${label(cx, cy + 4, "Sonne", "lbl small", "middle")}
     ${rays}
     <g transform="translate(${f1(ex)},${f1(ey)})">
       <circle cx="0" cy="0" r="${dayR}" fill="#1b2d4f" stroke="#fff" stroke-width="1.5"/>
       <path d="M ${f1(dsx)} ${f1(dsy)} A ${dayR} ${dayR} 0 0 1 ${f1(dex)} ${f1(dey)} Z" fill="#67b3f5"/>
       <circle cx="0" cy="0" r="${dayR}" fill="none" stroke="#fff" stroke-width="1.5"/>
       <line x1="${f1(-axDx)}" y1="${f1(-axDy)}" x2="${f1(axDx)}" y2="${f1(axDy)}" stroke="#ffe27a" stroke-width="2.5"/>
       <circle cx="${f1(axDx * 0.45)}" cy="${f1(axDy * 0.45)}" r="3" fill="${s.hemisphere === "Nord" ? "#ff5b5b" : "#9be8b1"}"/>
       <circle cx="${f1(-axDx * 0.45)}" cy="${f1(-axDy * 0.45)}" r="3" fill="${s.hemisphere === "Süd" ? "#ff5b5b" : "#9be8b1"}"/>
       ${label(axDx + 7, axDy - 1, "N", "lbl small on-dark", "start")}
     </g>
     ${label(22, 30, `Monat: ${MONTHS[s.month - 1]} · ${s.hemisphere}halbkugel`, "lbl strong on-dark", "start")}
     ${label(22, 52, `${m.seasonLabel}`, "lbl small on-dark", "start")}
     ${label(22, 174, `Mittagssonne: ${fmtDe(m.sunAngle, 1)}°`, "lbl small on-dark", "start")}
     ${label(22, 194, `Tageslicht: etwa ${fmtDe(m.daylightHours, 1)} h`, "lbl small on-dark", "start")}`,
  );
}

function drawThermometer(s: LabState): string {
  const frac = (s.temp + 10) / 110;
  const colH = 14 + frac * 98;
  const spacing = 12 + frac * 14;
  const speedArrow = 4 + frac * 14;
  const particles = [
    [350, 96],
    [350 + spacing, 96],
    [350, 96 + spacing * 0.9],
    [350 + spacing, 96 + spacing * 0.9],
    [350 + spacing * 0.5, 96 + spacing * 1.75],
  ]
    .map(
      ([x, y]) =>
        `<circle cx="${f1(x)}" cy="${f1(y)}" r="5.5" fill="var(--f-red)"/>
         <line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x + speedArrow)}" y2="${f1(y - speedArrow * 0.5)}" stroke="var(--f-orange)" stroke-width="2"/>`,
    )
    .join("");
  const instrument =
    s.thermoMode === "fluessigkeit"
      ? `<rect x="132" y="28" width="24" height="122" rx="12" fill="var(--f-white)" stroke="var(--f-ink)" stroke-width="2"/>
         <circle cx="144" cy="158" r="18" fill="var(--f-red)" stroke="var(--f-ink)" stroke-width="2"/>
         <rect x="138" y="${f1(148 - colH)}" width="12" height="${f1(colH + 4)}" rx="5" fill="var(--f-red)"/>
         <line x1="160" y1="36" x2="174" y2="36" stroke="var(--f-ink)" stroke-width="2"/>
         ${label(182, 40, "100 °C (Sieden)", "lbl small", "start")}
         <line x1="160" y1="126" x2="174" y2="126" stroke="var(--f-ink)" stroke-width="2"/>
         ${label(182, 130, "0 °C (Gefrieren)", "lbl small", "start")}`
      : (() => {
          const bend = ((s.temp - 20) / 80) * 34;
          return `<rect x="74" y="96" width="16" height="36" rx="4" fill="var(--f-stone)" stroke="var(--f-ink)"/>
                  <path d="M90 110 Q165 ${f1(110 - bend)} 228 ${f1(110 - bend * 1.4)}" fill="none" stroke="var(--f-orange)" stroke-width="6"/>
                  <path d="M90 116 Q165 ${f1(116 - bend)} 228 ${f1(116 - bend * 1.4)}" fill="none" stroke="var(--f-blue)" stroke-width="5"/>
                  ${label(160, 56, s.temp > 25 ? "Metall 1 dehnt sich stärker → Biegt" : s.temp < 15 ? "Kühlt ab → Biegt zur Gegenseite" : "Bei 20 °C fast gerade", "lbl small", "middle")}
                  ${label(160, 152, "Bimetall aus zwei Metallen", "lbl small", "middle")}`;
        })();
  return svg(
    500,
    196,
    `Temperatur ${fmtDe(s.temp)} Grad Celsius`,
    `<rect class="panel-bg" x="8" y="8" width="484" height="180" rx="12"/>
     ${instrument}
     <rect x="314" y="64" width="144" height="106" rx="10" fill="var(--surface)" stroke="var(--line)"/>
     ${label(386, 82, "Teilchenmodell", "lbl small strong", "middle")}
     ${particles}
     ${label(386, 50, `${fmtDe(s.temp)} °C`, "lbl strong", "middle")}`,
  );
}

function drawEyeLens(s: LabState): string {
  const depthOffset = s.eyeType === "kurz" ? 26 : s.eyeType === "weitsichtig" ? -24 : 0;
  const retinaX = 398 + depthOffset;
  let corr = 0;
  if (s.lensType === "zerstreuung") corr = 26;
  if (s.lensType === "sammel") corr = -24;
  const naturalFocusX = 398;
  const focusX = naturalFocusX + corr;
  const sharp = Math.abs(focusX - retinaX) <= 3;

  const glasses =
    s.lensType === "ohne"
      ? label(164, 152, "Ohne Brille", "lbl small muted", "middle")
      : s.lensType === "zerstreuung"
        ? `<path d="M158 58 Q168 100 158 142 L174 142 Q164 100 174 58 Z" fill="#9fd6ff88" stroke="var(--accent)" stroke-width="2"/>
           ${label(166, 164, "Zerstreuungslinse", "lbl small", "middle")}`
        : `<path d="M164 58 Q180 100 164 142 Q148 100 164 58 Z" fill="#9fd6ff88" stroke="var(--accent)" stroke-width="2"/>
           ${label(164, 164, "Sammellinse", "lbl small", "middle")}`;

  const rayYGlassTop = 76;
  const rayYGlassBot = 124;
  const rayYLensTop = s.lensType === "zerstreuung" ? 68 : s.lensType === "sammel" ? 84 : 76;
  const rayYLensBot = 200 - rayYLensTop;
  const atRetinaTop = 100 + ((retinaX - focusX) / (focusX - 246)) * (100 - rayYLensTop);
  const atRetinaBot = 200 - atRetinaTop;
  const farX = Math.max(retinaX, focusX);
  const farTop = focusX > retinaX ? 100 : atRetinaTop;
  const farBot = focusX > retinaX ? 100 : atRetinaBot;

  return svg(
    500,
    200,
    `Augenmodell mit ${s.eyeType === "kurz" ? "Kurzsichtigkeit" : s.eyeType === "weitsichtig" ? "Weitsichtigkeit" : "Normalsichtigkeit"}`,
    `<rect class="panel-bg" x="8" y="8" width="484" height="184" rx="12"/>
     <ellipse cx="${f1(315 + depthOffset * 0.5)}" cy="100" rx="${f1(88 + depthOffset * 0.5)}" ry="62" fill="#fff6ea" stroke="var(--f-ink)" stroke-width="2.5"/>
     <path d="M${f1(retinaX - 18)} 48 Q${f1(retinaX + 16)} 100 ${f1(retinaX - 18)} 152" fill="none" stroke="var(--f-red)" stroke-width="4.5"/>
     <ellipse cx="246" cy="100" rx="11" ry="34" fill="#cde8ff" stroke="var(--f-ink)" stroke-width="2"/>
     ${glasses}
     <polyline points="26,${rayYGlassTop} 164,${rayYGlassTop} 246,${rayYLensTop} ${f1(retinaX)},${f1(atRetinaTop)}" fill="none" stroke="var(--f-orange)" stroke-width="2.5"/>
     <polyline points="26,${rayYGlassBot} 164,${rayYGlassBot} 246,${rayYLensBot} ${f1(retinaX)},${f1(atRetinaBot)}" fill="none" stroke="var(--f-orange)" stroke-width="2.5"/>
     ${focusX > retinaX ? `<polyline points="${f1(retinaX)},${f1(atRetinaTop)} ${f1(farX)},${f1(farTop)}" fill="none" stroke="var(--f-orange)" stroke-width="1.8" stroke-dasharray="4 3"/><polyline points="${f1(retinaX)},${f1(atRetinaBot)} ${f1(farX)},${f1(farBot)}" fill="none" stroke="var(--f-orange)" stroke-width="1.8" stroke-dasharray="4 3"/>` : ""}
     <circle cx="${f1(focusX)}" cy="100" r="5" fill="${sharp ? "var(--success)" : "var(--f-red)"}"/>
     ${label(246, 30, "Augenlinse", "lbl small", "middle")}
     ${label(retinaX, 28, "Netzhaut", "lbl small", "middle")}
     ${label(270, 182, sharp ? "✓ Brennpunkt genau auf der Netzhaut (scharf)" : focusX < retinaX ? "Brennpunkt VOR der Netzhaut (unscharf)" : "Brennpunkt HINTER der Netzhaut (unscharf)", "lbl small strong", "middle")}`,
  );
}

function drawTorso(s: LabState): string {
  const hi = (k: LabState["activeOrgan"]) => (s.activeOrgan === k ? "3.5" : "1.5");
  const op = (k: LabState["activeOrgan"]) =>
    s.activeOrgan === "none" || s.activeOrgan === k ? "1" : "0.45";
  const coopLines = s.torsoCoop
    ? `<line x1="250" y1="62" x2="210" y2="108" stroke="var(--f-orange)" stroke-width="2.5" stroke-dasharray="4 3"/>
       <line x1="226" y1="112" x2="250" y2="148" stroke="var(--f-red)" stroke-width="2.5" stroke-dasharray="4 3"/>
       <line x1="250" y1="36" x2="250" y2="96" stroke="var(--f-purple)" stroke-width="2.5" stroke-dasharray="4 3"/>
       ${labels(389, 86, "Sauerstoff + Nährstoffe\nverteilen sich übers Blut.\nNerven steuern alles.", "lbl small", "middle", 17)}`
    : labels(389, 94, "Wähle ein Organsystem\noder das Zusammenspiel.", "lbl small muted", "middle", 17);
  return svg(
    500,
    210,
    "Vier Organsysteme des Menschen im Überblick",
    `<rect class="panel-bg" x="8" y="8" width="484" height="194" rx="12"/>
     <rect x="174" y="20" width="112" height="170" rx="28" fill="#f7e3cf" stroke="var(--f-ink)" stroke-width="2"/>
     <g opacity="${op("nerven")}">
       <ellipse cx="230" cy="38" rx="22" ry="12" fill="var(--f-purple)" stroke="var(--f-ink)" stroke-width="${hi("nerven")}"/>
       <line x1="230" y1="50" x2="230" y2="176" stroke="var(--f-purple)" stroke-width="3"/>
     </g>
     <g opacity="${op("atmung")}">
       <ellipse cx="210" cy="96" rx="16" ry="22" fill="#9fd6ff" stroke="var(--f-ink)" stroke-width="${hi("atmung")}"/>
       <ellipse cx="250" cy="96" rx="16" ry="22" fill="#9fd6ff" stroke="var(--f-ink)" stroke-width="${hi("atmung")}"/>
     </g>
     <g opacity="${op("kreislauf")}">
       <circle cx="233" cy="98" r="10" fill="var(--f-red)" stroke="var(--f-ink)" stroke-width="${hi("kreislauf")}"/>
     </g>
     <g opacity="${op("verdauung")}">
       <path d="M214 134 Q246 126 246 146 Q244 166 214 166 Q200 166 202 148 Q204 138 214 134 Z" fill="var(--f-orange)" stroke="var(--f-ink)" stroke-width="${hi("verdauung")}"/>
     </g>
     ${label(106, 52, "Nervensystem", "lbl small", "end")}
     ${label(106, 98, "Atmungssystem", "lbl small", "end")}
     ${label(106, 122, "Blutkreislauf", "lbl small", "end")}
     ${label(106, 156, "Verdauung", "lbl small", "end")}
     ${coopLines}`,
  );
}

function drawArmLever(s: LabState): string {
  const elbow = { x: 168, y: 122 };
  const shoulder = { x: 168, y: 28 };
  const thetaRad = (s.armAngle * Math.PI) / 180;
  // Vorderseite (Bizeps) rechts (+x), Rückseite (Trizeps) links (-x);
  // Unterarm schwenkt ausschließlich über die Beugeseite zwischen 40° und 170°.
  const vx = Math.sin(thetaRad);
  const vy = -Math.cos(thetaRad);
  const hand = {
    x: elbow.x + 96 * vx,
    y: elbow.y + 96 * vy,
  };
  const measuredDeg =
    (Math.acos(Math.max(-1, Math.min(1, -vy))) * 180) / Math.PI;
  const flex = (170 - s.armAngle) / 130;
  const bicepRx = 8 + flex * 7;
  const bicepRy = 33 - flex * 8;
  const tricepRx = 7.5 + (1 - flex) * 7.5;
  const tricepRy = 25 + flex * 8;
  const bicepAttach = { x: elbow.x + 28 * vx, y: elbow.y + 28 * vy };
  const forearmMid = { x: elbow.x + 58 * vx, y: elbow.y + 58 * vy };
  const arcR = 22;
  const arcStart = { x: elbow.x, y: elbow.y - arcR };
  const arcEnd = { x: elbow.x + arcR * vx, y: elbow.y + arcR * vy };
  const roleNote =
    flex > 0.55
      ? "Bizeps spannt an (Arm beugen)\nTrizeps bleibt locker"
      : flex < 0.25
        ? "Trizeps zieht straff (Arm strecken)\nBizeps entspannt"
        : "Bizeps vorn (Beuger)\nTrizeps hinten (Strecker)";
  const labelsSvg = s.showTendons
    ? `<line x1="130" y1="44" x2="162" y2="44" stroke="var(--f-ink)" stroke-width="1" opacity="0.65"/>
       ${label(126, 48, "Oberarmknochen", "lbl small", "end")}
       <line x1="130" y1="78" x2="${f1(152 - tricepRx)}" y2="78" stroke="var(--f-ink)" stroke-width="1" opacity="0.65"/>
       ${label(126, 82, "Trizeps (Strecker)", "lbl small", "end")}
       <line x1="130" y1="138" x2="161" y2="124" stroke="var(--f-ink)" stroke-width="1" opacity="0.65"/>
       ${label(126, 142, "Scharniergelenk", "lbl small", "end")}
       <line x1="${f1(184 + bicepRx)}" y1="78" x2="302" y2="78" stroke="var(--f-ink)" stroke-width="1" opacity="0.65"/>
       ${label(306, 82, "Bizeps (Beuger)", "lbl small", "start")}
       <line x1="${f1(bicepAttach.x)}" y1="${f1(bicepAttach.y)}" x2="302" y2="122" stroke="var(--f-ink)" stroke-width="1" opacity="0.65"/>
       ${label(306, 126, "Sehnen (Zugseile)", "lbl small", "start")}
       <line x1="${f1(forearmMid.x)}" y1="${f1(forearmMid.y)}" x2="302" y2="166" stroke="var(--f-ink)" stroke-width="1" opacity="0.65"/>
       ${label(306, 170, "Unterarm (Elle/Speiche)", "lbl small", "start")}
       ${label(392, 42, `Gelenkwinkel: ${fmtDe(measuredDeg)}°`, "lbl strong", "middle")}`
    : `${label(390, 88, `Gelenkwinkel: ${fmtDe(measuredDeg)}°`, "lbl strong", "middle")}
       ${labels(390, 118, roleNote, "lbl small muted", "middle", 18)}`;
  return svg(
    500,
    236,
    `Armmodell im Winkel von ${fmtDe(measuredDeg)} Grad`,
    `<rect class="panel-bg" x="8" y="8" width="484" height="220" rx="12"/>
     <path d="M ${f1(arcStart.x)} ${f1(arcStart.y)} A ${arcR} ${arcR} 0 0 1 ${f1(arcEnd.x)} ${f1(arcEnd.y)}" fill="none" stroke="var(--f-orange)" stroke-width="2" stroke-dasharray="3 2"/>
     <line x1="${shoulder.x}" y1="${shoulder.y}" x2="${elbow.x}" y2="${elbow.y}" stroke="#e7dfd0" stroke-width="14" stroke-linecap="round"/>
     <line x1="${shoulder.x}" y1="${shoulder.y}" x2="${elbow.x}" y2="${elbow.y}" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="${elbow.x}" y1="${elbow.y}" x2="${f1(hand.x)}" y2="${f1(hand.y)}" stroke="#e7dfd0" stroke-width="12" stroke-linecap="round"/>
     <line x1="${elbow.x}" y1="${elbow.y}" x2="${f1(hand.x)}" y2="${f1(hand.y)}" stroke="var(--f-ink)" stroke-width="2"/>
     <line x1="${shoulder.x + 6}" y1="${shoulder.y + 8}" x2="184" y2="${f1(74 - bicepRy + 4)}" stroke="var(--f-ink)" stroke-width="5" stroke-linecap="round"/>
     <line x1="${shoulder.x + 6}" y1="${shoulder.y + 8}" x2="184" y2="${f1(74 - bicepRy + 4)}" stroke="#fbf7ef" stroke-width="2.8" stroke-linecap="round"/>
     <line x1="184" y1="${f1(74 + bicepRy - 4)}" x2="${f1(bicepAttach.x)}" y2="${f1(bicepAttach.y)}" stroke="var(--f-ink)" stroke-width="5" stroke-linecap="round"/>
     <line x1="184" y1="${f1(74 + bicepRy - 4)}" x2="${f1(bicepAttach.x)}" y2="${f1(bicepAttach.y)}" stroke="#fbf7ef" stroke-width="2.8" stroke-linecap="round"/>
     <ellipse cx="184" cy="74" rx="${f1(bicepRx)}" ry="${f1(bicepRy)}" fill="var(--f-red)" opacity="${f1(0.55 + flex * 0.45)}"/>
     <line x1="${shoulder.x - 6}" y1="${shoulder.y + 8}" x2="152" y2="${f1(74 - tricepRy + 4)}" stroke="var(--f-ink)" stroke-width="5" stroke-linecap="round"/>
     <line x1="${shoulder.x - 6}" y1="${shoulder.y + 8}" x2="152" y2="${f1(74 - tricepRy + 4)}" stroke="#fbf7ef" stroke-width="2.8" stroke-linecap="round"/>
     <line x1="152" y1="${f1(74 + tricepRy - 4)}" x2="${elbow.x - 9}" y2="${elbow.y + 5}" stroke="var(--f-ink)" stroke-width="5" stroke-linecap="round"/>
     <line x1="152" y1="${f1(74 + tricepRy - 4)}" x2="${elbow.x - 9}" y2="${elbow.y + 5}" stroke="#fbf7ef" stroke-width="2.8" stroke-linecap="round"/>
     <ellipse cx="152" cy="74" rx="${f1(tricepRx)}" ry="${f1(tricepRy)}" fill="var(--f-blue)" opacity="${f1(0.95 - flex * 0.4)}"/>
     <circle cx="${elbow.x}" cy="${elbow.y}" r="9" fill="var(--f-orange)" stroke="var(--f-ink)" stroke-width="2"/>
     <circle cx="${f1(hand.x)}" cy="${f1(hand.y)}" r="8" fill="var(--f-skin)" stroke="var(--f-ink)"/>
     ${labelsSvg}`,
  );
}

function drawParticles(s: LabState): string {
  const mixed = s.particleMixture === "gemisch";
  const coords =
    s.particlePhase === "fest"
      ? [0, 1, 2, 3].flatMap((r) =>
          [0, 1, 2, 3, 4].map((c) => [170 + c * 24, 52 + r * 24, 0, 0]),
        )
      : s.particlePhase === "fluessig"
        ? [
            [156, 86, 8, -4],
            [184, 92, -6, 6],
            [212, 82, 5, 8],
            [244, 96, -8, 3],
            [274, 88, 6, -7],
            [168, 118, 9, 4],
            [198, 114, -5, -8],
            [230, 122, 8, -5],
            [260, 116, -7, 6],
            [288, 120, 4, -6],
            [158, 146, -6, 7],
            [192, 144, 7, 5],
            [224, 148, -8, -4],
            [256, 142, 6, 7],
            [286, 148, -5, -7],
          ]
        : [
            [130, 48, 22, -12],
            [224, 56, -18, 14],
            [318, 44, 16, 18],
            [170, 102, -20, -14],
            [274, 96, 20, -16],
            [348, 112, -16, 18],
            [142, 148, 18, -16],
            [248, 146, -22, 12],
            [328, 152, 16, -18],
          ];
  const dots = coords
    .map(([x, y, dx, dy], i) => {
      const col = mixed && i % 3 === 1 ? "var(--f-orange)" : "var(--f-blue)";
      const r = mixed && i % 3 === 1 ? 8.5 : 7;
      return `${dx || dy ? `<line x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}" stroke="var(--f-red)" stroke-width="2"/>` : ""}
              <circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="var(--f-ink)" stroke-width="1.2"/>`;
    })
    .join("");
  const caption =
    s.particlePhase === "fest"
      ? "Feste Plätze, kleinster Abstand"
      : s.particlePhase === "fluessig"
        ? "Verschiebbar, enger Abstand"
        : "Frei im Raum, großer Abstand";
  return svg(
    500,
    190,
    `Teilchenmodell ${s.particlePhase} als ${s.particleMixture}`,
    `<rect class="panel-bg" x="8" y="8" width="484" height="174" rx="12"/>
     <rect x="96" y="28" width="308" height="138" rx="10" fill="var(--surface)" stroke="var(--f-ink)" stroke-width="2"/>
     ${dots}
     ${label(250, 180, `${s.particleMixture === "reinstoff" ? "Reinstoff (eine Teilchensorte)" : "Stoffgemisch (mehrere Teilchensorten)"} · ${caption}`, "lbl small", "middle")}`,
  );
}

function drawLabSvg(kind: LabKind, s: LabState): string {
  switch (kind) {
    case "seasons":
      return drawSeasons(s);
    case "thermometer":
      return drawThermometer(s);
    case "eyeLens":
      return drawEyeLens(s);
    case "torso":
      return drawTorso(s);
    case "armLever":
      return drawArmLever(s);
    case "particles":
      return drawParticles(s);
  }
}

function renderLabControls(kind: LabKind, s: LabState): string {
  if (kind === "seasons") {
    return `<label>Monat wählen (${esc(MONTHS[s.month - 1])}) <input type="range" data-lab-range="month" min="1" max="12" step="1" value="${s.month}"></label>
      <div class="chip-row" role="group" aria-label="Halbkugel">
        ${(["Nord", "Süd"] as const).map((h) => `<button type="button" class="chip" data-lab-set="hemisphere:${h}" aria-pressed="${s.hemisphere === h}">${h}halbkugel</button>`).join("")}
      </div>`;
  }
  if (kind === "thermometer") {
    return `<label>Temperatur (${fmtDe(s.temp)} °C) <input type="range" data-lab-range="temp" min="-10" max="100" step="5" value="${s.temp}"></label>
      <div class="chip-row" role="group" aria-label="Messgerät">
        <button type="button" class="chip" data-lab-set="thermoMode:fluessigkeit" aria-pressed="${s.thermoMode === "fluessigkeit"}">Flüssigkeitsthermometer</button>
        <button type="button" class="chip" data-lab-set="thermoMode:bimetall" aria-pressed="${s.thermoMode === "bimetall"}">Bimetall-Streifen</button>
      </div>`;
  }
  if (kind === "eyeLens") {
    return `<div class="chip-row" role="group" aria-label="Auge">
        <button type="button" class="chip" data-lab-set="eyeType:normal" aria-pressed="${s.eyeType === "normal"}">Normalsichtig</button>
        <button type="button" class="chip" data-lab-set="eyeType:kurz" aria-pressed="${s.eyeType === "kurz"}">Kurzsichtig</button>
        <button type="button" class="chip" data-lab-set="eyeType:weitsichtig" aria-pressed="${s.eyeType === "weitsichtig"}">Weitsichtig</button>
      </div>
      <div class="chip-row" role="group" aria-label="Brillenglas">
        <button type="button" class="chip" data-lab-set="lensType:ohne" aria-pressed="${s.lensType === "ohne"}">Ohne Brille</button>
        <button type="button" class="chip" data-lab-set="lensType:zerstreuung" aria-pressed="${s.lensType === "zerstreuung"}">Zerstreuungslinse</button>
        <button type="button" class="chip" data-lab-set="lensType:sammel" aria-pressed="${s.lensType === "sammel"}">Sammellinse</button>
      </div>`;
  }
  if (kind === "torso") {
    return `<div class="chip-row" role="group" aria-label="Organsystem">
        <button type="button" class="chip" data-lab-set="organ:atmung" aria-pressed="${s.activeOrgan === "atmung"}">Atmung</button>
        <button type="button" class="chip" data-lab-set="organ:kreislauf" aria-pressed="${s.activeOrgan === "kreislauf"}">Blutkreislauf</button>
        <button type="button" class="chip" data-lab-set="organ:verdauung" aria-pressed="${s.activeOrgan === "verdauung"}">Verdauung</button>
        <button type="button" class="chip" data-lab-set="organ:nerven" aria-pressed="${s.activeOrgan === "nerven"}">Nervensystem</button>
      </div>
      <label class="lab-check"><input type="checkbox" data-lab-check="torsoCoop" ${s.torsoCoop ? "checked" : ""}>Zusammenspiel anzeigen</label>`;
  }
  if (kind === "armLever") {
    return `<label>Ellbogenwinkel (${fmtDe(s.armAngle)}°) <input type="range" data-lab-range="armAngle" min="40" max="170" step="5" value="${s.armAngle}"></label>
      <label class="lab-check"><input type="checkbox" data-lab-check="showTendons" ${s.showTendons ? "checked" : ""}>Knochen, Sehnen und Gelenk beschriften</label>`;
  }
  return `<div class="chip-row" role="group" aria-label="Aggregatzustand">
      <button type="button" class="chip" data-lab-set="particlePhase:fest" aria-pressed="${s.particlePhase === "fest"}">Fest</button>
      <button type="button" class="chip" data-lab-set="particlePhase:fluessig" aria-pressed="${s.particlePhase === "fluessig"}">Flüssig</button>
      <button type="button" class="chip" data-lab-set="particlePhase:gas" aria-pressed="${s.particlePhase === "gas"}">Gasförmig</button>
    </div>
    <div class="chip-row" role="group" aria-label="Stoffart">
      <button type="button" class="chip" data-lab-set="particleMixture:reinstoff" aria-pressed="${s.particleMixture === "reinstoff"}">Reinstoff</button>
      <button type="button" class="chip" data-lab-set="particleMixture:gemisch" aria-pressed="${s.particleMixture === "gemisch"}">Stoffgemisch</button>
    </div>`;
}

export function renderLab(kind: LabKind, state: LabState): string {
  const goals = labGoals(kind, state);
  const doneCount = goals.filter((g) => g.met).length;
  return `<section class="lab" data-lab="${kind}" aria-label="Interaktives Modell">
    <div class="panel-heading"><span class="eyebrow">INTERAKTIVES MODELL</span><span class="done-mark" data-lab-count>${doneCount} / ${goals.length} Erkundungsziele</span></div>
    <div class="lab-stage" data-lab-stage>${drawLabSvg(kind, state)}</div>
    <div class="lab-controls">${renderLabControls(kind, state)}</div>
    <ul class="lab-goals" data-lab-goals>${goals.map((g) => `<li class="${g.met ? "met" : ""}">${g.met ? "✓" : "○"} ${esc(g.text)}</li>`).join("")}</ul>
  </section>`;
}

function applyLabAction(state: LabState, action: string): void {
  const [key, val] = action.split(":");
  if (key === "hemisphere") state.hemisphere = val as "Nord" | "Süd";
  else if (key === "thermoMode")
    state.thermoMode = val as "fluessigkeit" | "bimetall";
  else if (key === "eyeType")
    state.eyeType = val as LabState["eyeType"];
  else if (key === "lensType")
    state.lensType = val as LabState["lensType"];
  else if (key === "organ") {
    state.activeOrgan = val as LabState["activeOrgan"];
    if (val === "atmung") state.seenAtmung = true;
    if (val === "kreislauf") state.seenKreislauf = true;
    if (val === "verdauung") state.seenVerdauung = true;
    if (val === "nerven") state.seenNerven = true;
  } else if (key === "particlePhase")
    state.particlePhase = val as LabState["particlePhase"];
  else if (key === "particleMixture")
    state.particleMixture = val as LabState["particleMixture"];
}

export function mountLab(
  host: HTMLElement,
  kind: LabKind,
  state: LabState,
): void {
  const refreshBody = () => {
    const stage = host.querySelector<HTMLElement>("[data-lab-stage]");
    const goalList = host.querySelector<HTMLElement>("[data-lab-goals]");
    const counter = host.querySelector<HTMLElement>("[data-lab-count]");
    if (stage) stage.innerHTML = drawLabSvg(kind, state);
    const goals = labGoals(kind, state);
    if (counter)
      counter.textContent = `${goals.filter((g) => g.met).length} / ${goals.length} Erkundungsziele`;
    if (goalList)
      goalList.innerHTML = goals
        .map(
          (g) =>
            `<li class="${g.met ? "met" : ""}">${g.met ? "✓" : "○"} ${esc(g.text)}</li>`,
        )
        .join("");
  };

  host
    .querySelectorAll<HTMLInputElement>("[data-lab-range]")
    .forEach((input) => {
      input.addEventListener("input", () => {
        const key = input.dataset.labRange;
        const n = Number(input.value);
        if (key === "month") state.month = n;
        else if (key === "temp") state.temp = n;
        else if (key === "armAngle") state.armAngle = n;
        const lbl = input.parentElement?.childNodes[0];
        if (lbl && lbl.nodeType === Node.TEXT_NODE) {
          if (key === "month") lbl.textContent = `Monat wählen (${MONTHS[n - 1]}) `;
          else if (key === "temp") lbl.textContent = `Temperatur (${fmtDe(n)} °C) `;
          else if (key === "armAngle") lbl.textContent = `Ellbogenwinkel (${fmtDe(n)}°) `;
        }
        refreshBody();
      });
    });

  host
    .querySelectorAll<HTMLButtonElement>("[data-lab-set]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        applyLabAction(state, button.dataset.labSet!);
        const groupKey = button.dataset.labSet!.split(":")[0];
        host
          .querySelectorAll<HTMLButtonElement>(`[data-lab-set^="${groupKey}:"]`)
          .forEach((other) => {
            other.setAttribute(
              "aria-pressed",
              other === button ? "true" : "false",
            );
          });
        refreshBody();
      });
    });

  host
    .querySelectorAll<HTMLInputElement>("[data-lab-check]")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.dataset.labCheck === "torsoCoop")
          state.torsoCoop = checkbox.checked;
        if (checkbox.dataset.labCheck === "showTendons")
          state.showTendons = checkbox.checked;
        refreshBody();
      });
    });
}
