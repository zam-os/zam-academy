import type { LabValues } from "../src/model/types";

/** Concrete legal settings; the reference suite proves each goal and no free starts. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "pt-1-negative-exponenten": {
    achtel: { a: 2, n: -3 },
    null: { a: 3, n: 0 },
    hundertstel: { a: 5, n: -2 },
  },
  "pt-2-gleiche-basis": {
    kuerzen: { m: 2, n: 2, op: 1 },
    negativ: { m: -2, n: -1, op: 0 },
    "minus-minus": { m: 1, n: -2, op: 1 },
  },
  "pt-3-weitere-potenzgesetze": {
    produkt: { a: 2, b: 3, m: 2, n: 2, op: 0 },
    quotient: { a: 4, b: 2, m: 2, n: 3, op: 1 },
    verschachtelt: { a: 2, b: 3, m: 2, n: -3, op: 2 },
  },
  "pt-4-zehnerpotenzen": {
    gross: { a: 4.2, n: 3 },
    klein: { a: 7.2, n: -4 },
    million: { a: 6.5, n: 6 },
  },
  "pt-5-vorsilben": {
    mikro: { amount: 3, from: -3, to: -6 },
    kilo: { amount: 2, from: 3, to: 0 },
    extrem: { amount: 1, from: 18, to: -18 },
  },

  "pv-1-verschiebung": {
    rechts: {
      x: -2,
      y: 1,
      u: 3,
      v: -1,
    },
    links: {
      x: -2,
      y: 1,
      u: -2,
      v: 2,
    },
    identisch: {
      x: -2,
      y: 1,
      u: 0,
      v: 0,
    },
  },
  "pv-2-vektoren": {
    beispiel: {
      x: -2,
      y: 3,
      u: 6,
      v: -4,
    },
    gegen: {
      x: -2,
      y: 1,
      u: -3,
      v: -2,
    },
    senkrecht: {
      x: -2,
      y: 1,
      u: 0,
      v: 4,
    },
  },
  "pv-3-vektoraddition": {
    ziel: {
      u: 2,
      v: 1,
      p: 2,
      q: -1,
    },
    null: {
      u: 1,
      v: 1,
      p: -1,
      q: -1,
    },
    beispiel: {
      u: 3,
      v: 1,
      p: -1,
      q: 2,
    },
  },
  "pv-4-parallelogramm-mitte": {
    rechteck: {
      x: 4,
      y: 0,
      u: 0,
      v: 4,
    },
    schief: {
      x: 3,
      y: 1,
      u: -1,
      v: 3,
    },
    mitte: {
      x: 2,
      y: 1,
      u: -2,
      v: 1,
    },
  },
  "pv-5-determinante": {
    positiv: {
      u: 4,
      v: 0,
      p: 0,
      q: 3,
    },
    negativ: {
      u: 0,
      v: 4,
      p: 3,
      q: 0,
    },
    gerade: {
      u: 2,
      v: 1,
      p: 4,
      q: 2,
    },
  },
  "pv-6-parallelen-winkel": {
    sechzig: {
      alpha: 60,
      beta: 0,
    },
    hundertzwanzig: {
      alpha: 120,
      beta: 0,
    },
    widerlegen: {
      alpha: 50,
      beta: 20,
    },
  },
  "pv-7-winkelsummen": {
    dreieck: {
      n: 3,
      alpha: 40,
      beta: 60,
      gamma: 80,
    },
    rechteck: {
      n: 4,
      alpha: 90,
      beta: 90,
      gamma: 90,
    },
    gleichseitig: {
      n: 3,
      alpha: 60,
      beta: 60,
      gamma: 80,
    },
  },
  "pv-8-vielecke": {
    fuenf: {
      n: 5,
    },
    sechs: {
      n: 6,
    },
    acht: {
      n: 8,
    },
  },
  "dr-1-existenz": {
    grenze: {
      a: 3,
      b: 4,
      c: 7,
    },
    unmoeglich: {
      a: 2,
      b: 3,
      c: 8,
    },
    gleichseitig: {
      a: 4,
      b: 4,
      c: 4,
    },
  },
  "dr-2-konstruktion": {
    kreise: {
      a: 4,
      b: 5,
      c: 6,
      step: 3,
    },
    gleichseitig: {
      a: 5,
      b: 5,
      c: 5,
      step: 4,
    },
    grenze: {
      a: 2,
      b: 3,
      c: 5,
      step: 3,
    },
  },
  "dr-3-kongruenz": {
    zwei: {
      a: 4,
      step: 3,
    },
    eine: {
      a: 7,
      step: 3,
    },
    keine: {
      a: 2,
      step: 3,
    },
  },
  "dr-4-begruenden": {
    sss: {
      x: 0,
      h: 4,
      half: 3,
    },
    gegenbeispiel: {
      x: 2,
      h: 3,
      half: 2,
    },
    zweites: {
      x: 0,
      h: 2,
      half: 1,
    },
  },
  "rg-1-lagebeziehungen": {
    windschief: {
      case: 1,
      angle: 60,
    },
    senkrecht: {
      case: 2,
      angle: 30,
    },
    ebenen: {
      case: 3,
      angle: 45,
    },
  },
  "rg-2-schraegbilder": {
    quader: {
      shape: 0,
      width: 6,
      depth: 4,
      height: 4,
      q: 0.5,
      angle: 45,
    },
    pyramide: {
      shape: 1,
      width: 4,
      depth: 4,
      height: 3,
      q: 0.5,
      angle: 30,
    },
    verkürzt: {
      shape: 0,
      width: 5,
      depth: 6,
      height: 3,
      q: 0.25,
      angle: 60,
    },
  },
  "rg-3-wahre-groessen": {
    grund: {
      section: 0,
      width: 3,
      depth: 4,
      height: 2,
      q: 0.25,
    },
    raum: {
      section: 1,
      width: 4,
      depth: 3,
      height: 2,
      q: 0.5,
    },
    pyramide: {
      section: 2,
      width: 4,
      depth: 6,
      height: 4,
      q: 0.5,
    },
  },
  "ol-1-kreisbereiche": {
    rand: {
      x: 3,
      y: 0,
      radius: 3,
      mode: 0,
    },
    innen: {
      x: 1,
      y: 2,
      radius: 3,
      mode: 1,
    },
    aussen: {
      x: 4,
      y: 0,
      radius: 3,
      mode: 2,
    },
  },
  "ol-2-abstandsorte": {
    mitte: {
      x: 0,
      y: 3,
      mode: 0,
    },
    winkel: {
      x: 3,
      y: 3,
      mode: 1,
    },
    parallel: {
      x: 1,
      y: -2,
      mode: 2,
    },
  },
  "ol-3-thales": {
    recht: {
      x: 0,
      y: 4,
    },
    innen: {
      x: 0,
      y: 2,
    },
    aussen: {
      x: 0,
      y: 5,
    },
  },
  "ol-4-kreis-gerade": {
    tangente: {
      radius: 3,
      d: 3,
    },
    passante: {
      radius: 2,
      d: 4,
    },
    sekante: {
      radius: 4,
      d: -2,
    },
  },
  "ol-5-tangenten-konstruktion": {
    hilfskreis: {
      radius: 3,
      d: 8,
      step: 2,
    },
    beruehrpunkte: {
      radius: 2,
      d: 6,
      step: 3,
    },
    tangenten: {
      radius: 4,
      d: 9,
      step: 4,
    },
  },
  "ol-6-ortsschnitte": {
    beide: {
      x: 0,
      y: 1,
      mode: 0,
    },
    oder: {
      x: -4,
      y: 0,
      mode: 1,
    },
    rand: {
      x: 1,
      y: 0,
      mode: 2,
    },
  },
  "ol-7-umkreis-inkreis": {
    aussen: {
      x: 0,
      h: 1,
      mode: 0,
    },
    recht: {
      x: 0,
      h: 3,
      mode: 0,
    },
    inkreis: {
      x: 1,
      h: 4,
      mode: 1,
    },
  },
  "ol-8-schwerpunkt": {
    symmetrisch: {
      x: 0,
      h: 6,
    },
    rechts: {
      x: 3,
      h: 3,
    },
    links: {
      x: -3,
      h: 6,
    },
  },
  "al-1-terme": {
    null: {
      a: 3,
      b: -3,
      x: 2,
      mode: 0,
    },
    produkt: {
      a: 2,
      b: 3,
      x: 2,
      mode: 1,
    },
    klammer: {
      a: -2,
      b: 3,
      x: 1,
      mode: 2,
    },
  },
  "al-2-gleichungen": {
    positiv: {
      a: 2,
      b: 1,
      d: 0,
      c: 7,
      x: 3,
    },
    negativ: {
      a: -2,
      b: 3,
      d: 0,
      c: 7,
      x: -2,
    },
    beidseitig: {
      a: 3,
      b: 1,
      d: 1,
      c: 5,
      x: 2,
    },
  },
  "al-3-ungleichungen": {
    offen: {
      a: 2,
      b: 1,
      c: 5,
      relation: 0,
      x: 2,
    },
    negativ: {
      a: -2,
      b: 1,
      c: 5,
      relation: 1,
      x: -2,
    },
    rechts: {
      a: 1,
      b: -2,
      c: 1,
      relation: 3,
      x: 4,
    },
  },
  "al-4-sachgleichungen": {
    treffen: {
      fee: 2,
      price: 3,
      budget: 14,
      n: 4,
    },
    zweiter: {
      fee: 4,
      price: 2,
      budget: 18,
      n: 7,
    },
    "kein-grundpreis": {
      fee: 0,
      price: 5,
      budget: 20,
      n: 4,
    },
  },
  "al-5-sachungleichungen": {
    hoechstens: {
      fee: 2,
      price: 3,
      budget: 20,
      n: 6,
      strict: 0,
    },
    streng: {
      fee: 2,
      price: 3,
      budget: 20,
      n: 6,
      strict: 1,
    },
    nachbar: {
      fee: 2,
      price: 3,
      budget: 20,
      n: 5,
      strict: 1,
    },
  },
  "pr-1-veraenderter-grundwert": {
    rabatt: {
      base: 80,
      p: 15,
      mode: 0,
    },
    aufschlag: {
      base: 100,
      p: 20,
      mode: 1,
    },
    halb: {
      base: 200,
      p: 50,
      mode: 0,
    },
  },
  "pr-2-grundwert-zurueck": {
    rabatt: {
      "new": 60,
      p: 25,
      mode: 0,
    },
    aufschlag: {
      "new": 120,
      p: 20,
      mode: 1,
    },
    haelfte: {
      "new": 80,
      p: 50,
      mode: 0,
    },
  },
  "pr-3-zinsrechnung": {
    zwanzig: {
      capital: 800,
      p: 2.5,
    },
    dreissig: {
      capital: 1000,
      p: 3,
    },
    verdoppeln: {
      capital: 1600,
      p: 2,
    },
  },
  "pr-4-indirekt-proportional": {
    drei: {
      k: 24,
      x: 3,
    },
    sechs: {
      k: 24,
      x: 6,
    },
    anderes: {
      k: 36,
      x: 9,
    },
  },
  "pr-5-zuordnungen": {
    direkt: {
      mode: 0,
      x: 4,
    },
    indirekt: {
      mode: 1,
      x: 6,
    },
    weder: {
      mode: 2,
      x: 3,
    },
  },
  "da-1-kenngroessen": {
    gleich: {
      a: 2,
      b: 2,
      c: 2,
      d: 2,
      e: 2,
    },
    symmetrisch: {
      a: 1,
      b: 3,
      c: 5,
      d: 7,
      e: 9,
    },
    haeufig: {
      a: 2,
      b: 6,
      c: 6,
      d: 6,
      e: 10,
    },
  },
  "da-2-aussagekraft": {
    beispiel: {
      last: 24,
    },
    extrem: {
      last: 100,
    },
    klein: {
      last: 5,
    },
  },
  "da-3-stichproben": {
    ausgewogen: {
      a: 20,
      b: 20,
      method: 1,
    },
    einseitig: {
      a: 0,
      b: 50,
      method: 0,
    },
    kleiner: {
      a: 10,
      b: 10,
      method: 1,
    },
  },
  "da-4-diagramme": {
    fair: {
      baseline: 0,
    },
    doppelt: {
      baseline: 80,
    },
    dreifach: {
      baseline: 85,
    },
  },
};
