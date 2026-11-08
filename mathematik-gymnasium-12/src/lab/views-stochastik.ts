/**
 * Lab-Visualisierungen für Stochastik und Signifikanztests (Stufen 2 und 3).
 */

import type { LabValues, ReadoutValues } from "../model/types";
import { open, text, line, rect, circle, r1 } from "./svg";
import { binom, bernoulliProb, binomCdf } from "../math/stochastics";

// 9. Kolmogorow-Axiome (Venn-Diagramm)
export function kolmogorovAxiomsView(v: LabValues, _r: ReadoutValues): string {
  const pA = (v.pA ?? 50) / 100;
  const pB = (v.pB ?? 40) / 100;
  const pSchnitt = (v.pSchnitt ?? 20) / 100;
  const pVereinigung = pA + pB - pSchnitt;

  let s = open("Kolmogorow-Axiome und Mengendiagramm");
  // Rahmen Grundmenge Omega
  s += rect(60, 70, 400, 200, "lab-box");
  s += text(70, 95, "Ω (P(Ω) = 1)", "lab-axis-label");
  // Kreis A
  s += circle(210, 170, 70, "lab-circle-a");
  s += text(180, 175, `A: ${r1(pA)}`, "lab-text-bold");
  // Kreis B
  s += circle(310, 170, 70, "lab-circle-b");
  s += text(330, 175, `B: ${r1(pB)}`, "lab-text-bold");
  // Schnittmenge
  s += text(260, 175, `${r1(pSchnitt)}`, "lab-text-accent", "middle");
  s += text(20, 30, "Axiome von Kolmogorow", "lab-title");
  s += text(20, 52, `Additionssatz: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = ${r1(pVereinigung)}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 10. Zufallsgröße & Wahrscheinlichkeitsverteilung
export function randomVariableView(v: LabValues, _r: ReadoutValues): string {
  const p1 = (v.p1 ?? 30) / 100;
  const p2 = (v.p2 ?? 50) / 100;
  const p3 = Math.max(0, 1 - p1 - p2);
  const probs = [p1, p2, p3];
  const vals = [1, 2, 3];
  const mu = vals.reduce((sum, x, i) => sum + x * probs[i], 0);

  let s = open("Zufallsgröße und Erwartungswert");
  const originX = 80;
  const originY = 260;
  s += line(originX, originY, 460, originY, "lab-axis");
  s += line(originX, originY, originX, 60, "lab-axis");

  const barW = 60;
  const scaleY = 250;
  for (let i = 0; i < 3; i++) {
    const x = originX + 50 + i * 110;
    const h = probs[i] * scaleY;
    s += rect(x, originY - h, barW, h, "lab-bar lab-primary");
    s += text(x + barW / 2, originY + 20, `x = ${vals[i]}`, "lab-axis-tick", "middle");
    s += text(x + barW / 2, originY - h - 8, `${r1(probs[i])}`, "lab-text", "middle");
  }
  // Erwartungswert-Linie
  const muX = originX + 50 + (mu - 1) * 110 + barW / 2;
  s += line(muX, 70, muX, originY, "lab-line-thick lab-accent");
  s += text(muX, 60, `E(X) = ${r1(mu)}`, "lab-text-accent", "middle");

  s += text(20, 30, "Wahrscheinlichkeitsverteilung P(X = x)", "lab-title");
  s += text(20, 52, `Erwartungswert μ = E(X) = ∑ x_i · P(X = x_i) = ${r1(mu)}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 11. Urnenmodelle & Kombinatorik
export function urnModelsView(v: LabValues, _r: ReadoutValues): string {
  const n = v.n ?? 10;
  const k = v.k ?? 3;
  const withRep = (v.withRep ?? 0) === 1;
  const ways = withRep ? Math.pow(n, k) : binom(n, k);

  let s = open("Urnenmodelle und Kombinatorik");
  s += rect(80, 80, 160, 200, "lab-urn");
  // Kugeln
  for (let i = 0; i < Math.min(n, 12); i++) {
    const bx = 110 + (i % 3) * 45;
    const by = 130 + Math.floor(i / 3) * 40;
    s += circle(bx, by, 16, i < k ? "lab-ball-red" : "lab-ball-blue");
    s += text(bx, by + 5, String(i + 1), "lab-ball-text", "middle");
  }
  s += text(280, 110, `Gesamtzahl Kugeln: n = ${n}`, "lab-axis-label");
  s += text(280, 140, `Gezogene Kugeln: k = ${k}`, "lab-axis-label");
  s += text(280, 170, withRep ? "Mit Zurücklegen (n^k)" : "Ohne Zurücklegen ((n über k))", "lab-axis-label");
  s += text(280, 210, `Möglichkeiten: ${ways}`, "lab-title");
  s += text(20, 30, "Urnenmodell: Ziehen mit / ohne Zurücklegen", "lab-title");
  s += text(20, 52, withRep ? `${n}^${k} = ${ways} Möglichkeiten` : `(${n} über ${k}) = ${ways} Kombinationen`, "lab-legend");
  s += "</svg>";
  return s;
}

// 12. Bernoulli-Ketten & Binomialverteilung
export function bernoulliChainView(v: LabValues, _r: ReadoutValues): string {
  const n = v.n ?? 10;
  const p = (v.p ?? 40) / 100;
  const kMax = v.kMax ?? 4;
  const sumP = binomCdf(n, p, kMax);

  let s = open("Binomialverteilung und Summenschreibweise");
  const originX = 50;
  const originY = 260;
  s += line(originX, originY, 480, originY, "lab-axis");
  s += line(originX, originY, originX, 60, "lab-axis");

  const barW = Math.max(12, Math.floor(380 / (n + 1)) - 4);
  const scaleY = 400;

  for (let i = 0; i <= n; i++) {
    const prob = bernoulliProb(n, p, i);
    const x = originX + 20 + i * (barW + 4);
    const h = prob * scaleY;
    const isSelected = i <= kMax;
    s += rect(x, originY - h, barW, h, isSelected ? "lab-bar lab-accent" : "lab-bar lab-muted");
    if (n <= 12 || i % 2 === 0) {
      s += text(x + barW / 2, originY + 16, String(i), "lab-axis-tick", "middle");
    }
  }

  s += text(20, 30, `B(${n}; ${r1(p)}; k) mit Summe k ≤ ${kMax}`, "lab-title");
  s += text(20, 52, `P(X ≤ ${kMax}) = ∑_{k=0}^{${kMax}} B(${n}; ${r1(p)}; k) = ${r1(sumP)}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 13. Parameter der Binomialverteilung (μ und σ)
export function binomialParamsView(v: LabValues, _r: ReadoutValues): string {
  const n = v.n ?? 20;
  const p = (v.p ?? 50) / 100;
  const mu = n * p;
  const sigma = Math.sqrt(n * p * (1 - p));

  let s = open("Parameter der Binomialverteilung");
  const originX = 40;
  const originY = 260;
  s += line(originX, originY, 490, originY, "lab-axis");
  s += line(originX, originY, originX, 60, "lab-axis");

  const barW = Math.max(8, Math.floor(420 / (n + 1)) - 3);
  const scaleY = 500;

  for (let i = 0; i <= n; i++) {
    const prob = bernoulliProb(n, p, i);
    const x = originX + 10 + i * (barW + 3);
    const h = prob * scaleY;
    const in1Sigma = Math.abs(i - mu) <= sigma;
    s += rect(x, originY - h, barW, h, in1Sigma ? "lab-bar lab-accent" : "lab-bar lab-primary");
  }

  s += text(20, 30, `Kenngrößen: μ = ${r1(mu)}, σ = ${r1(sigma)}`, "lab-title");
  s += text(20, 52, `1-Sigma-Intervall [${r1(mu - sigma)}; ${r1(mu + sigma)}] (orange gefärbt)`, "lab-legend");
  s += "</svg>";
  return s;
}

// 14. Hypothesentest Grundprinzip (Nullhypothese & Gegenhypothese)
export function hypothesisSetupView(v: LabValues, _r: ReadoutValues): string {
  const p0 = (v.p0 ?? 60) / 100;
  const isRight = (v.isRight ?? 1) === 1;

  let s = open("Grundprinzip des Signifikanztests");
  s += rect(50, 90, 420, 160, "lab-box");
  s += text(70, 120, "Entscheidungsraum des Tests", "lab-axis-label");

  if (isRight) {
    s += rect(70, 140, 240, 60, "lab-bar lab-primary");
    s += text(190, 175, "Annahmebereich A_quer", "lab-text", "middle");
    s += rect(310, 140, 140, 60, "lab-bar lab-accent");
    s += text(380, 175, "Ablehnungsbereich A", "lab-text-bold", "middle");
    s += text(20, 30, `Rechtsseitiger Test: H_0: p ≤ ${r1(p0)} vs. H_1: p > ${r1(p0)}`, "lab-title");
  } else {
    s += rect(70, 140, 140, 60, "lab-bar lab-accent");
    s += text(140, 175, "Ablehnungsbereich A", "lab-text-bold", "middle");
    s += rect(210, 140, 240, 60, "lab-bar lab-primary");
    s += text(330, 175, "Annahmebereich A_quer", "lab-text", "middle");
    s += text(20, 30, `Linksseitiger Test: H_0: p ≥ ${r1(p0)} vs. H_1: p < ${r1(p0)}`, "lab-title");
  }
  s += text(20, 52, "Die Nullhypothese H_0 wird abgelehnt, wenn das Ergebnis im Ablehnungsbereich liegt", "lab-legend");
  s += "</svg>";
  return s;
}

// 15. Fehler 1. und 2. Art
export function errorVisualizerView(v: LabValues, _r: ReadoutValues): string {
  const c = v.c ?? 14;
  const n = 20;
  const p0 = 0.5;
  const p1 = 0.75;
  const alphaReal = 1 - binomCdf(n, p0, c - 1);
  const betaReal = binomCdf(n, p1, c - 1);

  let s = open("Fehler 1. Art und Fehler 2. Art");
  const originX = 40;
  const originY = 260;
  s += line(originX, originY, 490, originY, "lab-axis");

  const barW = 18;
  const scaleY = 400;

  for (let i = 0; i <= n; i++) {
    const prob0 = bernoulliProb(n, p0, i);
    const x = originX + 10 + i * (barW + 3);
    const isReject = i >= c;
    s += rect(x, originY - prob0 * scaleY, barW, prob0 * scaleY, isReject ? "lab-bar lab-accent" : "lab-bar lab-primary");
  }
  // Kritische Grenze c
  const cX = originX + 10 + c * (barW + 3);
  s += line(cX, 70, cX, originY, "lab-line-dashed");
  s += text(cX, 65, `c = ${c}`, "lab-text-accent", "middle");

  s += text(20, 30, `Fehler 1. Art (Alpha) und Fehler 2. Art (Beta) bei n = ${n}`, "lab-title");
  s += text(20, 52, `P(Fehler 1. Art) = α = ${r1(alphaReal)}  |  P(Fehler 2. Art bei p=0,75) = β = ${r1(betaReal)}`, "lab-legend");
  s += "</svg>";
  return s;
}

// 16. Bestimmung des Ablehnungsbereichs
export function rejectionRegionView(v: LabValues, _r: ReadoutValues): string {
  const n = 20;
  const p0 = 0.5;
  const alphaSoll = (v.alpha ?? 5) / 100;
  // Suche c
  let bestC = n;
  for (let c = 0; c <= n; c++) {
    if (1 - binomCdf(n, p0, c - 1) <= alphaSoll + 1e-9) {
      bestC = c;
      break;
    }
  }
  const alphaIst = 1 - binomCdf(n, p0, bestC - 1);

  let s = open("Ablehnungsbereich bei Signifikanzniveau");
  const originX = 40;
  const originY = 260;
  s += line(originX, originY, 490, originY, "lab-axis");

  const barW = 18;
  const scaleY = 400;
  for (let i = 0; i <= n; i++) {
    const prob = bernoulliProb(n, p0, i);
    const x = originX + 10 + i * (barW + 3);
    const inA = i >= bestC;
    s += rect(x, originY - prob * scaleY, barW, prob * scaleY, inA ? "lab-bar lab-accent" : "lab-bar lab-primary");
  }

  s += text(20, 30, `Vorgegebenes Niveau α = ${r1(alphaSoll * 100)} %`, "lab-title");
  s += text(20, 52, `Ablehnungsbereich A = {${bestC}, ..., ${n}} mit tatsächlicher Irrtumswahrscheinlichkeit ${r1(alphaIst * 100)} %`, "lab-legend");
  s += "</svg>";
  return s;
}

// 17. Interpretation im Sachzusammenhang
export function testInterpretationView(v: LabValues, _r: ReadoutValues): string {
  const k = v.k ?? 15;
  const c = 14;
  const isSignificant = k >= c;

  let s = open("Interpretation des Testergebnisses");
  s += rect(60, 90, 400, 150, "lab-box");
  s += text(80, 125, `Stichprobenergebnis: k = ${k} Treffer`, "lab-axis-label");
  s += text(80, 155, `Kritischer Wert: c = ${c}`, "lab-axis-label");
  s += text(80, 195, isSignificant ? "Ergebnis ist SIGNIFIKANT: H_0 wird verworfen!" : "Ergebnis ist NICHT signifikant: H_0 wird beibehalten.", isSignificant ? "lab-text-bold lab-accent" : "lab-text-bold");

  s += text(20, 30, "Signifikanzbewertung in Sachkontexten", "lab-title");
  s += text(20, 52, isSignificant ? "Die Abweichung ist zu groß, um als rein zufällig zu gelten." : "Die Abweichung liegt noch im Rahmen des Zufalls.", "lab-legend");
  s += "</svg>";
  return s;
}
