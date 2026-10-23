import type { LabValues } from "../model/types";
import { DEG } from "./draw";
import { G } from "./engine";

/**
 * Physics shared by a lesson's readouts and its drawing, so the picture can
 * never disagree with the numbers.
 */

/** The nearest scale mark of a ruler, without floating-point dust. */
export function readScale(length: number, scale: number): number {
  return Number((Math.round(length / scale) * scale).toFixed(2));
}

// ─── Etappe 1: Mechanik ────────────────────────────────────────────────────

/** In the Hooke lab every spring leaves its elastic range at this force. */
export const F_ELASTIC = 6; // N

/** Extension in metres: Hooke up to the elastic limit, then a softer plastic range. */
export function springExtension(F: number, D: number): number {
  if (F <= F_ELASTIC) return F / D;
  return F_ELASTIC / D + (F - F_ELASTIC) / (D / 3);
}

export const FRICTION_STATIC_FACTOR = 1.3; // Haftreibung maximal 1,3 · Gleitreibung (Modell)
export const ROLL_FACTOR = 0.1; // Rollreibung ≈ 1/10 der Gleitreibung (Modell)

export function frictionLimits(v: LabValues): { FN: number; haftMax: number; moving: number } {
  const FN = v.m * G;
  const slide = v.surf * FN;
  if (v.mode === 0) return { FN, haftMax: FRICTION_STATIC_FACTOR * slide, moving: slide };
  return { FN, haftMax: ROLL_FACTOR * slide, moving: ROLL_FACTOR * slide };
}

// ─── Etappe 2: Optik ───────────────────────────────────────────────────────

/** Refraction angle (to the normal) for light going from air into a medium of refractive index n. */
export function refractionAngle(alphaDeg: number, n: number): number {
  return Math.asin(Math.sin(alphaDeg * DEG) / n) / DEG;
}

/** Limiting angle of total reflection for light going from a medium of index n into air. */
export function criticalAngle(n: number): number {
  return Math.asin(1 / n) / DEG;
}

/** Exit angle for light going from a medium into air, or NaN when it is totally reflected. */
export function exitAngle(alphaDeg: number, n: number): number {
  const s = n * Math.sin(alphaDeg * DEG);
  return s > 1 ? Number.NaN : Math.asin(s) / DEG;
}

/**
 * Shadow of an opaque disc of diameter Do between a light source of diameter
 * Ds and a screen: a behind the source, b behind the object (all in cm).
 * Umbra 0 means the object is too small to cast a full shadow on the screen.
 */
export function shadowSizes(Ds: number, Do: number, a: number, b: number): { umbra: number; penumbra: number } {
  const umbra = Math.max(0, Do + ((Do - Ds) * b) / a);
  const penumbra = Do + ((Do + Ds) * b) / a;
  return { umbra, penumbra };
}

export const MOON_PERIOD = 29.5; // days from new moon to new moon

export function moonAngle(day: number): number {
  return (360 * day) / MOON_PERIOD;
}

export function moonPhaseName(alpha: number): string {
  const a = ((alpha % 360) + 360) % 360;
  if (a <= 12 || a >= 348) return "Neumond";
  if (a < 78) return "zunehmende Sichel";
  if (a <= 102) return "zunehmender Halbmond (erstes Viertel)";
  if (a < 168) return "zunehmender Mond";
  if (a <= 192) return "Vollmond";
  if (a < 258) return "abnehmender Mond";
  if (a <= 282) return "abnehmender Halbmond (letztes Viertel)";
  return "abnehmende Sichel";
}

/** What is lit of the moon as seen from the Earth, in percent. */
export function moonLit(alpha: number): number {
  return ((1 - Math.cos(alpha * DEG)) / 2) * 100;
}

export function eclipseKind(alpha: number, orbit: number): string {
  const a = ((alpha % 360) + 360) % 360;
  if (orbit === 1) return "keine Finsternis: Der Mond zieht über oder unter dem Schatten vorbei";
  if (a <= 8 || a >= 352) return "Sonnenfinsternis";
  if (Math.abs(a - 180) <= 8) return "Mondfinsternis";
  return "keine Finsternis";
}

export interface LensImage {
  /** Image distance in cm; negative for a virtual image. Capped at ±999. */
  b: number;
  /** |B / G| */
  scale: number;
  real: boolean;
  kind: string;
}

/** The image a thin converging lens of focal length f makes of an object at distance g (both in cm). */
export function lensImage(f: number, g: number): LensImage {
  if (Math.abs(g - f) < 0.01) {
    return { b: 999, scale: 999, real: true, kind: "kein Bild: Die Strahlen laufen parallel" };
  }
  const b = (g * f) / (g - f);
  const scale = Math.abs(b / g);
  if (b < 0) {
    return { b, scale, real: false, kind: "virtuell, aufrecht, vergrößert" };
  }
  if (Math.abs(g - 2 * f) < 0.01) {
    return { b, scale, real: true, kind: "reell, umgekehrt, gleich groß" };
  }
  return {
    b,
    scale,
    real: true,
    kind: g > 2 * f ? "reell, umgekehrt, verkleinert" : "reell, umgekehrt, vergrößert",
  };
}

/** Eye model: how many dpt too strong (+) or too weak (−) the eye is before glasses. */
export const EYE_ERRORS = [0, 2.5, -2.5];

/** Where the sharp image lies relative to the retina in mm; positive means behind it. */
export function eyeFocusShift(eye: number, glassesDpt: number): number {
  const net = EYE_ERRORS[eye] + glassesDpt;
  return -2 * net;
}

export function eyeState(dx: number): string {
  if (Math.abs(dx) <= 0.5) return "scharf auf der Netzhaut";
  return dx < 0 ? "Bild vor der Netzhaut, unscharf" : "Bild hinter der Netzhaut, unscharf";
}

// ─── Etappe 3: Mechanik und Energie ────────────────────────────────────────

/** A wagon on a frictionless valley track h(x) = h0 · (x − 1)², x from 0 (start) to 2; with friction it loses 12,5 % of the start energy per unit of x. */
export function trackEnergies(
  m: number,
  h0: number,
  x: number,
  friction: number,
): { E0: number; h: number; Epot: number; Ekin: number; Eint: number; reachable: boolean; v: number } {
  const E0 = m * G * h0;
  const h = h0 * (x - 1) ** 2;
  const Epot = m * G * h;
  const loss = friction === 1 ? E0 * 0.125 * x : 0;
  const Eges = E0 - loss;
  const reachable = Eges >= Epot - 1e-9;
  const Ekin = reachable ? Math.max(0, Eges - Epot) : 0;
  const Eint = Math.max(0, E0 - Epot - Ekin);
  return { E0, h, Epot, Ekin, Eint, reachable, v: Math.sqrt((2 * Ekin) / m) };
}

// ─── Etappe 4: Wärmelehre ──────────────────────────────────────────────────

/** Energy unit of the heating-curve lab: 100 units heat 1 kg of ice from −20 °C to steam of 120 °C (about 3 100 kJ). */
export const HEATING_STEPS = [1.4, 12.2, 25.8, 98.8, 100] as const;

export interface HeatingState {
  theta: number;
  state: string;
  /** Share of the mixture that has changed state, 0 … 1 (melting and boiling only). */
  fraction: number;
}

export function heatingState(E: number): HeatingState {
  const [eis, melt, water, boil] = HEATING_STEPS;
  if (E <= eis) return { theta: -20 + (20 * E) / eis, state: "Eis wird erwärmt", fraction: 0 };
  if (E <= melt) return { theta: 0, state: "Eis schmilzt (Eis und Wasser)", fraction: (E - eis) / (melt - eis) };
  if (E <= water) return { theta: (100 * (E - melt)) / (water - melt), state: "Wasser wird erwärmt", fraction: 0 };
  if (E <= boil) return { theta: 100, state: "Wasser siedet (Wasser und Dampf)", fraction: (E - water) / (boil - water) };
  return { theta: 100 + (20 * (E - boil)) / (100 - boil), state: "Dampf wird erwärmt", fraction: 0 };
}

/** Density of liquid water in kg/m³ between 0 °C and 12 °C (maximum at about 4 °C). */
export function waterDensity(theta: number): number {
  return 999.972 - 0.0079 * (theta - 3.98) ** 2;
}

export const ICE_DENSITY = 917; // kg/m³

/** Complementary error function (Abramowitz and Stegun 7.1.26). */
export function erfc(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-ax * ax);
  return 1 - sign * erf;
}

/** Temperature of a rod heated to 100 °C at one end, at distance x (m) after t (s); diffusivity a in m²/s. */
export function conductionTemp(a: number, t: number, x: number): number {
  if (t <= 0) return 20;
  return 20 + 80 * erfc(x / (2 * Math.sqrt(a * t)));
}

export interface ThermosLosses {
  conduction: number;
  convection: number;
  radiation: number;
  opening: number;
  total: number;
}

/** Heat loss in W of a flask of tea: vacuum, mirror coating and stopper each remove one channel. */
export function thermosLosses(vacuum: number, mirror: number, lid: number): ThermosLosses {
  const conduction = vacuum === 1 ? 0.3 : 5;
  const convection = vacuum === 1 ? 0.5 : 8;
  const radiation = mirror === 1 ? 0.4 : 4;
  const opening = lid === 1 ? 0 : 6;
  return { conduction, convection, radiation, opening, total: conduction + convection + radiation + opening };
}

/** Tea temperature after the given hours, never below room temperature. */
export function teaTemperature(totalLossW: number, hours: number): number {
  const kPerHour = (totalLossW * 3600) / 4190;
  return Math.max(20, 90 - kPerHour * hours);
}

/** Thermal diffusivity in m²/s for the conductivities offered in the conduction lab. */
export function diffusivity(lambda: number): number {
  const table: Array<[number, number]> = [
    [400, 1.1e-4],
    [235, 9.7e-5],
    [80, 2.3e-5],
    [1, 5e-7],
    [0.15, 1.5e-7],
  ];
  return table.find(([l]) => l === lambda)?.[1] ?? 1e-6;
}

/** Where the probe sits in the conduction lab, in metres from the heated end. */
export const PROBE_POSITION = 0.3;

// ─── Etappe 5: Magnetismus und Elektrizitätslehre ──────────────────────────

/** Share of aligned elementary magnets in percent: material 0 soft iron, 1 hard steel; phase 0 before, 1 at the magnet, 2 magnet removed. */
export function alignment(material: number, phase: number): number {
  const table = [
    [0, 90, 5],
    [0, 60, 50],
  ];
  return table[material][phase];
}

export function clipsAttracted(alignPercent: number): string {
  if (alignPercent >= 40) return "ja, stark";
  if (alignPercent >= 10) return "ja, schwach";
  return "nein";
}

export interface Pole {
  x: number;
  y: number;
  /** +1 for a north pole, −1 for a south pole. */
  q: number;
}

/** Pole positions (in cm) of the field-line lab: 0 bar, 1 horseshoe, 2 north poles face to face, 3 north faces south, 4 Earth. */
export function magnetPoles(kind: number): Pole[] {
  switch (kind) {
    case 0:
      return [{ x: 1.6, y: 0, q: 1 }, { x: -1.6, y: 0, q: -1 }];
    case 1:
      return [{ x: -0.7, y: 0, q: 1 }, { x: 0.7, y: 0, q: -1 }];
    case 2:
      return [{ x: -1.6, y: 0, q: 1 }, { x: 1.6, y: 0, q: 1 }];
    case 3:
      return [{ x: -1.6, y: 0, q: 1 }, { x: 1.6, y: 0, q: -1 }];
    default:
      return [{ x: 0, y: -0.9, q: 1 }, { x: 0, y: 0.9, q: -1 }];
  }
}

/** Field vector at a point as the sum of point poles (relative units). */
export function fieldAt(poles: Pole[], x: number, y: number): { bx: number; by: number } {
  let bx = 0;
  let by = 0;
  for (const p of poles) {
    const dx = x - p.x;
    const dy = y - p.y;
    const r2 = dx * dx + dy * dy + 1e-6;
    const r3 = r2 * Math.sqrt(r2);
    bx += (p.q * dx) / r3;
    by += (p.q * dy) / r3;
  }
  return { bx, by };
}

export function compassWord(bx: number, by: number): string {
  if (Math.hypot(bx, by) < 0.05) return "kaum ein Ausschlag (Feld fast null)";
  const angle = (Math.atan2(by, bx) * 180) / Math.PI;
  const a = (angle + 360) % 360;
  if (a < 22.5 || a >= 337.5) return "nach rechts";
  if (a < 67.5) return "schräg nach rechts oben";
  if (a < 112.5) return "nach oben";
  if (a < 157.5) return "schräg nach links oben";
  if (a < 202.5) return "nach links";
  if (a < 247.5) return "schräg nach links unten";
  if (a < 292.5) return "nach unten";
  return "schräg nach rechts unten";
}

/** Materials ordered by the triboelectric series: the lower rank becomes positive when rubbed. */
export const TRIBO_SERIES = ["Fell", "Glas", "Wolle", "Seide", "Hartgummi", "PVC"];

/** Charge per rubbing stroke in nC (lab model). */
export const CHARGE_PER_STROKE_NC = 0.5;

export function rubbedCharges(rankA: number, rankB: number, strokes: number): { qA: number; qB: number } {
  if (rankA === rankB) return { qA: 0, qB: 0 };
  const q = strokes * CHARGE_PER_STROKE_NC;
  return rankA < rankB ? { qA: q, qB: -q } : { qA: -q, qB: q };
}

/** Share of the charge displaced by influence (rod at distance d cm). */
export function influenceShare(d: number): number {
  return 1 / (1 + (d / 5) ** 2);
}

export const INFLUENCE_MAX_NC = 10;

/** Deutsch's law for the electrostatic precipitator in the lab. */
export function filterEfficiency(kV: number, gasSpeed: number): number {
  const drift = 0.003 * kV; // m/s
  const x = (drift * 10) / (gasSpeed * 0.3);
  return (1 - Math.exp(-x)) * 100;
}

export function ammeterState(connection: number, range: number, I: number): string {
  if (connection === 1) return "Kurzschluss: Das Messgerät wird überlastet";
  if (I > range) return "Messbereich zu klein: Zeiger am Anschlag";
  if (I / range < 0.3) return "Zeigerausschlag zu klein, kleineren Messbereich wählen";
  return "gut ablesbar";
}

export function bodyCurrentEffect(I: number, t: number, fi: number): { effect: string; effectiveTime: number } {
  const effectiveTime = fi === 1 && I >= 30 ? Math.min(t, 0.03) : t;
  let effect: string;
  if (I < 1) effect = "kaum spürbar";
  else if (I < 10) effect = "deutlich spürbar, Kribbeln";
  else if (I < 30) effect = "Muskelkrampf: Loslassen oft unmöglich";
  else if (effectiveTime <= 0.05) effect = "kurzer Schlag, FI-Schalter schaltet sofort ab";
  else if (I < 50) effect = "gefährlich: Atemstörungen bei längerer Dauer";
  else effect = "lebensgefährlich: Herzkammerflimmern";
  return { effect, effectiveTime };
}

// ─── Etappen 6 und 7: Wahlbereich ──────────────────────────────────────────

export const HEARING_MIN = 16; // Hz
export const HEARING_MAX = 20_000; // Hz

export function hearingRange(f: number): string {
  if (f < HEARING_MIN) return "Infraschall, nicht hörbar";
  if (f > HEARING_MAX) return "Ultraschall, nicht hörbar";
  return "hörbar";
}

export function pitchWord(f: number): string {
  if (f < HEARING_MIN) return "unter dem Hörbereich";
  if (f < 250) return "tiefer Ton";
  if (f < 2000) return "mittlerer Ton";
  if (f <= HEARING_MAX) return "hoher Ton";
  return "über dem Hörbereich";
}

export const SOUND_SPEEDS: Array<{ v: number; name: string }> = [
  { v: 343, name: "Luft (20 °C)" },
  { v: 1480, name: "Wasser" },
  { v: 5100, name: "Stahl" },
];

/** Apparent ecliptic longitude of Mars seen from Earth in degrees; day 0 is the opposition. */
export function marsLongitude(day: number): number {
  const thetaE = (2 * Math.PI * day) / 365.25;
  const thetaM = (2 * Math.PI * day) / 687;
  const ex = Math.cos(thetaE);
  const ey = Math.sin(thetaE);
  const mx = 1.524 * Math.cos(thetaM);
  const my = 1.524 * Math.sin(thetaM);
  return (Math.atan2(my - ey, mx - ex) * 180) / Math.PI;
}

export function marsMotion(day: number): string {
  const d = marsLongitude(day + 1) - marsLongitude(day - 1);
  return d < 0 ? "rückläufig" : "rechtläufig";
}

export const PLANETS: Array<{ au: number; name: string }> = [
  { au: 0.39, name: "Merkur" },
  { au: 0.72, name: "Venus" },
  { au: 1.0, name: "Erde" },
  { au: 1.52, name: "Mars" },
  { au: 5.2, name: "Jupiter" },
  { au: 9.54, name: "Saturn" },
  { au: 19.2, name: "Uranus" },
  { au: 30.1, name: "Neptun" },
];

export const LIGHT_MINUTES_PER_AU = 8.3;
export const MILLION_KM_PER_AU = 150;
