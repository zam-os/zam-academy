import type { LabValues } from "../src/model/types";

export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "tv-1-variablen": {
    "acht": {
      "a": 1,
      "b": 3,
      "n": 8
    },
    "quadrate": {
      "a": 2,
      "b": 4,
      "n": 7
    },
    "doppelt": {
      "a": 2,
      "b": 4,
      "n": 4
    }
  },
  "tv-2-interpretieren": {
    "fl20": {
      "x": 6,
      "y": 4,
      "c": 2
    },
    "c2": {
      "x": 6,
      "y": 6,
      "c": 2
    },
    "quadrat": {
      "x": 5,
      "y": 5,
      "c": 1
    }
  },
  "tv-3-termwerte": {
    "bruch": {
      "a": 2,
      "n": -2,
      "k": 0
    },
    "nullwert": {
      "a": 3,
      "n": 0,
      "k": -1
    },
    "fuenf": {
      "a": 5,
      "n": -2,
      "k": 1
    }
  },
  "tv-4-tabelle": {
    "nullstelle": {
      "m": 2,
      "t": -4,
      "x0": 0
    },
    "negzero": {
      "m": 2,
      "t": 4,
      "x0": -2
    },
    "b5zwanzig": {
      "m": 4,
      "t": 2,
      "x0": 2
    }
  },
  "tv-5-struktur": {
    "summe": {
      "mode": 1,
      "x": 5,
      "y": 4
    },
    "potenz": {
      "mode": 2,
      "x": 5,
      "y": 1
    },
    "quotient": {
      "mode": 3,
      "x": 4,
      "y": 3
    }
  },
  "tu-1-potenzgesetze": {
    "glBasis": {
      "mode": 0,
      "a": 2,
      "m": 2,
      "n": 4
    },
    "glExp": {
      "mode": 1,
      "a": 2,
      "m": 2,
      "n": 4
    },
    "potPot": {
      "mode": 2,
      "a": 3,
      "m": 2,
      "n": 4
    }
  },
  "tu-2-zusammenfassen": {
    "eine": {
      "x": 2,
      "y": 0
    },
    "zwei": {
      "x": 1,
      "y": 0
    },
    "alle": {
      "x": 2,
      "y": 1
    }
  },
  "tu-3-ausmultiplizieren": {
    "null": {
      "k": 3,
      "a": 2,
      "b": -2
    },
    "sub": {
      "k": 4,
      "a": 5,
      "b": -2
    },
    "drei6": {
      "k": 4,
      "a": 6,
      "b": 3
    }
  },
  "tu-4-faktorisieren": {
    "zwei": {
      "preset": 0,
      "f": 2
    },
    "max0": {
      "preset": 0,
      "f": 6
    },
    "max1": {
      "preset": 1,
      "f": 5
    }
  },
  "tu-5-summen-mal": {
    "gleich": {
      "a": 5,
      "b": 2,
      "c": 3,
      "d": 2
    },
    "misch": {
      "a": 4,
      "b": 2,
      "c": 2,
      "d": 1
    },
    "gross": {
      "a": 6,
      "b": 3,
      "c": 5,
      "d": 3
    }
  },
  "tu-6-binomisch": {
    "erste": {
      "kind": 0,
      "a": 5,
      "b": 3
    },
    "zweite": {
      "kind": 1,
      "a": 6,
      "b": 2
    },
    "dritte": {
      "kind": 2,
      "a": 7,
      "b": 3
    }
  },
  "tu-7-sachargument": {
    "vier": {
      "a": 3,
      "b": 2,
      "kx": 2,
      "ky": 2
    },
    "sechs": {
      "a": 3,
      "b": 2,
      "kx": 3,
      "ky": 2
    },
    "neun": {
      "a": 4,
      "b": 2,
      "kx": 3,
      "ky": 3
    }
  },
  "sy-1-achse": {
    "ach0": {
      "ax": 0,
      "qx": 3,
      "qy": 2
    },
    "ach1": {
      "ax": 1,
      "qx": 5,
      "qy": 2
    },
    "achM1": {
      "ax": -1,
      "qx": 1,
      "qy": 2
    }
  },
  "sy-2-punkt": {
    "z0": {
      "zx": 0,
      "qx": 3,
      "qy": -2
    },
    "z1": {
      "zx": 1,
      "qx": 5,
      "qy": -2
    },
    "zm1": {
      "zx": -1,
      "qx": 1,
      "qy": -2
    }
  },
  "sy-3-abstand": {
    "mitte": {
      "px": 0,
      "py": 2,
      "r": 4
    },
    "kreis5": {
      "px": 0,
      "py": 4,
      "r": 5
    },
    "unten": {
      "px": 0,
      "py": -4,
      "r": 5
    }
  },
  "sy-4-lot-winkel": {
    "lot": {
      "mode": 0,
      "fx": 4,
      "fy": 0
    },
    "kurz": {
      "mode": 0,
      "fx": 4,
      "fy": 0
    },
    "wh": {
      "mode": 1,
      "fx": 4.5,
      "fy": 2
    }
  },
  "sy-5-vierecke": {
    "punkt": {
      "shape": 2,
      "scale": 3
    },
    "zwei": {
      "shape": 3,
      "scale": 3
    },
    "vier": {
      "shape": 5,
      "scale": 3
    }
  },
  "wi-1-kreuzung": {
    "gleich": {
      "alpha": 90
    },
    "doppelt": {
      "alpha": 120
    },
    "spitz": {
      "alpha": 35
    }
  },
  "wi-2-parallelen": {
    "par70": {
      "alpha": 70,
      "tilt": 0
    },
    "diff": {
      "alpha": 95,
      "tilt": 0
    },
    "schräg": {
      "alpha": 80,
      "tilt": -15
    }
  },
  "wi-3-dreiecksumme": {
    "hilf": {
      "cx": 290,
      "cy": 100,
      "showAux": 1
    },
    "sym": {
      "cx": 260,
      "cy": 100,
      "showAux": 1
    },
    "flach": {
      "cx": 160,
      "cy": 100,
      "showAux": 1
    }
  },
  "wi-4-vielecksumme": {
    "sechs": {
      "n": 6,
      "showDiag": 1
    },
    "acht": {
      "n": 8,
      "showDiag": 1
    },
    "eins35": {
      "n": 8,
      "showDiag": 0
    }
  },
  "wi-5-mehrfach": {
    "parallel": {
      "eps": 65
    },
    "winkel90": {
      "eps": 90
    },
    "klein": {
      "eps": 50
    }
  },
  "gl-1-aufstellen": {
    "loes5": {
      "a": 3,
      "b": 4,
      "x": 5,
      "target": 19
    },
    "neu": {
      "a": 4,
      "b": 2,
      "x": 6,
      "target": 26
    },
    "x8": {
      "a": 2,
      "b": 4,
      "x": 8,
      "target": 20
    }
  },
  "gl-2-aequivalenz": {
    "probe0": {
      "step": 0,
      "testX": 4
    },
    "isoX": {
      "step": 2,
      "testX": 4
    },
    "fertig": {
      "step": 3,
      "testX": 4
    }
  },
  "gl-3-klammern": {
    "halb": {
      "x": 3.5,
      "b": 4
    },
    "ganz": {
      "x": 4,
      "b": 5
    },
    "vier5": {
      "x": 4.5,
      "b": 6
    }
  },
  "gl-4-sonderfaelle": {
    "leer": {
      "a": 3,
      "b": 5
    },
    "alle": {
      "a": 3,
      "b": 2
    },
    "pos2": {
      "a": 5,
      "b": 6
    }
  },
  "pr-1-gleichung": {
    "mwst": {
      "net": 100,
      "p": 20
    },
    "rabatt": {
      "net": 160,
      "p": -25
    },
    "diff9": {
      "net": 120,
      "p": 20
    }
  },
  "pr-2-wachstum": {
    "plusminus": {
      "p1": 20,
      "p2": -20
    },
    "doppel": {
      "p1": 20,
      "p2": 20
    },
    "neutral": {
      "p1": 30,
      "p2": -30
    }
  },
  "pr-3-pruefen": {
    "verdopp": {
      "v0": 10,
      "v1": 20
    },
    "halb": {
      "v0": 40,
      "v1": 50
    },
    "rueck": {
      "v0": 40,
      "v1": 20
    }
  },
  "da-1-median": {
    "ungerade": {
      "n": 5,
      "xVal": 6
    },
    "gerade": {
      "n": 6,
      "xVal": 8
    },
    "hoch": {
      "n": 7,
      "xVal": 12
    }
  },
  "da-2-ausreisser": {
    "ausr": {
      "v7": 12000
    },
    "exakt": {
      "v7": 9000
    },
    "unten": {
      "v7": 1500
    }
  },
  "da-3-quartile": {
    "r24": {
      "low": 4,
      "high": 28
    },
    "r28": {
      "low": 2,
      "high": 30
    },
    "iqr10": {
      "low": 8,
      "high": 18
    }
  },
  "da-4-boxplot": {
    "sym": {
      "q1": 9,
      "med": 15,
      "q3": 21,
      "max": 28
    },
    "eng": {
      "q1": 9,
      "med": 12,
      "q3": 16,
      "max": 24
    },
    "schief": {
      "q1": 7,
      "med": 12,
      "q3": 16,
      "max": 28
    }
  },
  "da-5-vergleich": {
    "besser": {
      "shiftB": 4,
      "spreadB": 4
    },
    "kleiner": {
      "shiftB": -4,
      "spreadB": 2
    },
    "breit": {
      "shiftB": 0,
      "spreadB": 6
    }
  },
  "ko-1-kongruenz": {
    "parallel": {
      "dx": 120,
      "rot": 0
    },
    "halb": {
      "dx": 120,
      "rot": 180
    },
    "deck": {
      "dx": 0,
      "rot": 0
    }
  },
  "ko-2-sss-sws": {
    "grenze": {
      "mode": 0,
      "a": 2,
      "alpha": 60
    },
    "sssOk": {
      "mode": 0,
      "a": 5,
      "alpha": 60
    },
    "sws90": {
      "mode": 1,
      "a": 1.5,
      "alpha": 90
    }
  },
  "ko-3-wsw-ssw": {
    "nullL": {
      "a": 2,
      "alpha": 30
    },
    "beruehr": {
      "a": 2.5,
      "alpha": 30
    },
    "eindeutig": {
      "a": 6,
      "alpha": 45
    }
  },
  "ko-4-gleichschenklig": {
    "ungleich": {
      "c": 7,
      "a": 3
    },
    "equi": {
      "c": 5,
      "a": 5
    },
    "steil": {
      "c": 3,
      "a": 6
    }
  },
  "ko-5-kehrsatz": {
    "recht": {
      "stmt": 0,
      "w": 6
    },
    "schenk": {
      "stmt": 1,
      "w": 3
    },
    "thales": {
      "stmt": 2,
      "w": 4
    }
  },
  "ko-6-umkreis-inkreis": {
    "stumpf": {
      "mode": 0,
      "cx": 5,
      "cy": 3.5
    },
    "thalesPunkt": {
      "mode": 0,
      "cx": 5,
      "cy": 4.5
    },
    "inkreis": {
      "mode": 1,
      "cx": 5,
      "cy": 6.5
    }
  },
  "ko-7-thales": {
    "auf": {
      "r": 105,
      "phi": 60
    },
    "wander": {
      "r": 105,
      "phi": 130
    },
    "aussen": {
      "r": 135,
      "phi": 60
    }
  },
  "ko-8-tangente": {
    "hilf": {
      "phi": 30,
      "showThales": 1
    },
    "tangent": {
      "phi": 60,
      "showThales": 0
    },
    "beides": {
      "phi": 80,
      "showThales": 1
    }
  },
  "ko-9-hoehen": {
    "senkr": {
      "hc": 3,
      "alpha": 90
    },
    "stumpf": {
      "hc": 3,
      "alpha": 105
    },
    "dopp": {
      "hc": 4,
      "alpha": 45
    }
  },
  "ko-10-modellieren": {
    "gleich": {
      "alpha": 45,
      "beta": 45
    },
    "rechtw": {
      "alpha": 35,
      "beta": 55
    },
    "breit50": {
      "alpha": 65,
      "beta": 65
    }
  }
};
