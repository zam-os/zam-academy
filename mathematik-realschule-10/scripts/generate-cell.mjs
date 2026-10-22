import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cellPath = resolve(__dirname, "..", "cell.json");

// ULID format: exactly 26 uppercase Crockford base32 characters
function atomId(index) {
  // 11 chars + 12 zeros + 3 chars ("A01".."A26") = 26 chars
  const suffix = `A${String(index).padStart(2, "0")}`;
  return `01K8MATH10R${"0".repeat(12)}${suffix}`;
}

function itemId(index) {
  // 11 chars + 11 zeros + 4 chars ("K001".."K099") = 26 chars
  const suffix = `K${String(index).padStart(3, "0")}`;
  return `01K8MATH10R${"0".repeat(11)}${suffix}`;
}

const tile = {
  "$schema": "https://zam.app/schemas/v1/kvt-tile.json",
  "tile_id": "zam-academy:mathematik-realschule-10",
  "version": "2026.10.1",
  "title": "Mathematik 10 Realschule (ZAM Academy)",
  "description": "Hält fest, was du in der ZAM Academy zu Mathematik 10 (Realschule Bayern, LehrplanPLUS) geübt hast: Trigonometrie am Einheitskreis, ebene Vektorgeometrie und Determinanten, Potenzen und Potenzfunktionen, Exponentialfunktionen und Logarithmen, Raumgeometrie und quadratische Funktionen zur Abschlussprüfung, sowie Daten und Zufall (Stochastik). Jede Karte verlinkt die Lektion mit Labor, Lehrer-Erklärvideo und Aufgaben.",
  "publisher": "ZAM Academy",
  "published_at": "2026-10-22T10:00:00Z",
  "sources": [
    {
      "uri": "https://academy.zam-os.org/mathematik-realschule-10/",
      "checked": "2026-10-22",
      "label": "ZAM Academy · Mathematik 10 Realschule (interaktives Labor, Etappen 1–6)"
    },
    {
      "uri": "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg1",
      "label": "LehrplanPLUS Realschule, Mathematik 10, Wahlpflichtfächergruppe I (LB 1 bis LB 5)"
    },
    {
      "uri": "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg2-3",
      "label": "LehrplanPLUS Realschule, Mathematik 10, Wahlpflichtfächergruppen II/III (LB 1 bis LB 5)"
    }
  ],
  "atoms": [
    // --- ETAPPE 1: TRIGONOMETRIE ---
    {
      "id": atomId(1),
      "atom_uri": `urn:zam:atom:${atomId(1)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-tr-einheitskreis",
      "title": "Sinus und Kosinus am Einheitskreis",
      "domain": "mathematik/geometrie",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-1-einheitskreis",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-1-trigonometrie",
          "topic_title": "Etappe 1: Trigonometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb1",
          "topic_title": "Trigonometrie am Einheitskreis",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(1),
          "slug": "m10-tr-einheitskreis-vorzeichen",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-1-einheitskreis",
          "question": "Welche Vorzeichen besitzen Sinus und Kosinus für einen stumpfen Winkel im II. Quadranten (90° < alpha < 180°)?",
          "concept": "Sinus ist positiv und Kosinus ist negativ (sin > 0, cos < 0).",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "Sinus positiv und Kosinus negativ",
              "Sinus negativ und Kosinus positiv"
            ],
            "correct_index": 0
          }
        },
        {
          "id": itemId(2),
          "slug": "m10-tr-einheitskreis-beziehung",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-1-einheitskreis",
          "question": "Wie lautet die fundamentale Beziehung (trigonometrischer Pythagoras) zwischen Sinus und Kosinus für jeden beliebigen Winkel alpha?",
          "concept": "sin²(alpha) + cos²(alpha) = 1",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "sin²(alpha) + cos²(alpha) = 1",
              "sin²(alpha) - cos²(alpha) = 1"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(2),
      "atom_uri": `urn:zam:atom:${atomId(2)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-tr-sinussatz",
      "title": "Der Sinussatz im beliebigen Dreieck",
      "domain": "mathematik/geometrie",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-2-sinussatz",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-1-trigonometrie",
          "topic_title": "Etappe 1: Trigonometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb1",
          "topic_title": "Sinussatz",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(3),
          "slug": "m10-tr-sinussatz-formel",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-2-sinussatz",
          "question": "Wie lautet der Sinussatz für die Seiten a, b, c und die jeweils gegenüberliegenden Winkel alpha, beta, gamma?",
          "concept": "a / sin(alpha) = b / sin(beta) = c / sin(gamma)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "a / sin(alpha) = b / sin(beta) = c / sin(gamma)",
              "a · sin(alpha) = b · sin(beta) = c · sin(gamma)"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(3),
      "atom_uri": `urn:zam:atom:${atomId(3)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-tr-kosinussatz",
      "title": "Der Kosinussatz im beliebigen Dreieck",
      "domain": "mathematik/geometrie",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-3-kosinussatz",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-1-trigonometrie",
          "topic_title": "Etappe 1: Trigonometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb1",
          "topic_title": "Kosinussatz",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(4),
          "slug": "m10-tr-kosinussatz-formel",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-3-kosinussatz",
          "question": "Wie lautet der Kosinussatz zur Berechnung der Seite a aus den Seiten b, c und dem eingeschlossenen Winkel alpha?",
          "concept": "a² = b² + c² - 2bc · cos(alpha)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "a² = b² + c² - 2bc · cos(alpha)",
              "a² = b² + c² + 2bc · cos(alpha)"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(4),
      "atom_uri": `urn:zam:atom:${atomId(4)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-tr-dreiecksflaeche",
      "title": "Dreiecksfläche mit dem Sinus",
      "domain": "mathematik/geometrie",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-4-dreiecksflaeche",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-1-trigonometrie",
          "topic_title": "Etappe 1: Trigonometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb1",
          "topic_title": "Trigonometrische Flächeninhaltsformel",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(5),
          "slug": "m10-tr-dreiecksflaeche-formel",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-4-dreiecksflaeche",
          "question": "Wie berechnet man den Flächeninhalt A eines Dreiecks aus zwei Seiten a, b und dem eingeschlossenen Winkel gamma?",
          "concept": "A = 0,5 · a · b · sin(gamma)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "A = 0,5 · a · b · sin(gamma)",
              "A = 0,5 · a · b · cos(gamma)"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(5),
      "atom_uri": `urn:zam:atom:${atomId(5)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-tr-bogenmass",
      "title": "Bogenmaß und Radiant",
      "domain": "mathematik/geometrie",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-5-bogenmass",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-1-trigonometrie",
          "topic_title": "Etappe 1: Trigonometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb1",
          "topic_title": "Bogenmaß",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(6),
          "slug": "m10-tr-bogenmass-umrechnung",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=tr-5-bogenmass",
          "question": "Welcher Bogenmaß-Wert in Radiant entspricht genau einem gestreckten Winkel von 180°?",
          "concept": "pi rad (ca. 3,1416 rad)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "pi rad (ca. 3,1416 rad)",
              "2pi rad (ca. 6,2832 rad)"
            ],
            "correct_index": 0
          }
        }
      ]
    },

    // --- ETAPPE 2: EBENE VEKTORGEOMETRIE & ABBILDUNGEN ---
    {
      "id": atomId(6),
      "atom_uri": `urn:zam:atom:${atomId(6)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-vg-vektorbegriff",
      "title": "Vektorbegriff, Gegenvektor und Pfeilklassen",
      "domain": "mathematik/geometrie",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-1-vektorbegriff",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-2-vektorgeometrie",
          "topic_title": "Etappe 2: Vektorgeometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Vektorbegriff",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(7),
          "slug": "m10-vg-vektorbegriff",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-1-vektorbegriff",
          "question": "Definiere den Verbindungsvektor AB zweier Punkte A(x_A | y_A) und B(x_B | y_B) nach der 'Spitze-minus-Schaft'-Regel, bestimme für A(-2 | 3) und B(4 | -5) den Vektor AB sowie dessen Gegenvektor BA und berechne die exakte Länge der Strecke [AB].",
          "concept": "AB = (6, -8)^T, Gegenvektor BA = (-6, 8)^T, Länge = 10 LE",
          "sample_solution": "1. Spitze-minus-Schaft: AB = (4 - (-2), -5 - 3)^T = (6, -8)^T. 2. Gegenvektor: BA = -AB = (-6, 8)^T. 3. Betrag: |AB| = sqrt(6^2 + (-8)^2) = sqrt(100) = 10 LE.",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "AB = (6, -8)^T, BA = (-6, 8)^T, Länge = 10 LE",
              "AB = (2, -2)^T, BA = (-2, 2)^T, Länge = 4 LE"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J02"
          ]
        }
      ]
    },
    {
      "id": atomId(7),
      "atom_uri": `urn:zam:atom:${atomId(7)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-vg-vektorbetrag",
      "title": "Betrag eines Vektors und Streckenlänge",
      "domain": "mathematik/geometrie",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-2-vektorbetrag",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-2-vektorgeometrie",
          "topic_title": "Etappe 2: Vektorgeometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Vektorbetrag",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(8),
          "slug": "m10-vg-vektorbetrag",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-2-vektorbetrag",
          "question": "Wie berechnet man den Betrag (die Länge) des zweidimensionalen Vektors v = (3, 4)^T?",
          "concept": "5 Längeneinheiten",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "5 Längeneinheiten",
              "7 Längeneinheiten"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J01"
          ]
        }
      ]
    },
    {
      "id": atomId(8),
      "atom_uri": `urn:zam:atom:${atomId(8)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-vg-vektorrechnung",
      "title": "Vektoraddition, Subtraktion und Skalarmultiplikation",
      "domain": "mathematik/geometrie",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-3-vektorrechnung",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-2-vektorgeometrie",
          "topic_title": "Etappe 2: Vektorgeometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Rechnen mit Vektoren",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(9),
          "slug": "m10-vg-vektoraddition-regel",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-3-vektorrechnung",
          "question": "Wie werden zwei Vektoren a = (a_x, a_y)^T und b = (b_x, b_y)^T rechnerisch addiert?",
          "concept": "a + b = (a_x + b_x, a_y + b_y)^T",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "a + b = (a_x + b_x, a_y + b_y)^T",
              "a + b = (a_x · b_x, a_y · b_y)^T"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(9),
      "atom_uri": `urn:zam:atom:${atomId(9)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-vg-skalarprodukt",
      "title": "Das Skalarprodukt zweier Vektoren",
      "domain": "mathematik/geometrie",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-4-skalarprodukt",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-2-vektorgeometrie",
          "topic_title": "Etappe 2: Vektorgeometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Skalarprodukt",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(10),
          "slug": "m10-vg-skalarprodukt",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-4-skalarprodukt",
          "question": "Berechne das Skalarprodukt der Vektoren a = (2, 3)^T und b = (6, -4)^T, folgere daraus ihre geometrische Lagebeziehung und berechne den Schnittwinkel zwischen den Vektoren u = (1, 0)^T und v = (1, 1)^T mit der Kosinusformel cos(alpha) = (u · v) / (|u| · |v|).",
          "concept": "a · b = 0 (orthogonal) und Schnittwinkel von u und v beträgt 45°",
          "sample_solution": "1. a · b = 2·6 + 3·(-4) = 12 - 12 = 0 -> orthogonal (90°). 2. cos(alpha) = 1 / (1 · sqrt(2)) = 1/sqrt(2) -> alpha = 45°.",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "a · b = 0 (orthogonal) und Schnittwinkel von u und v beträgt 45°",
              "a · b = 24 (nicht orthogonal) und Schnittwinkel von u und v beträgt 60°"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J04"
          ]
        }
      ]
    },
    {
      "id": atomId(10),
      "atom_uri": `urn:zam:atom:${atomId(10)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-vg-orthogonalitaet",
      "title": "Orthogonalität und Normalenvektoren",
      "domain": "mathematik/geometrie",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-5-orthogonalitaet",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-2-vektorgeometrie",
          "topic_title": "Etappe 2: Vektorgeometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Orthogonalitätskriterium",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(11),
          "slug": "m10-vg-orthogonalitaet",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-5-orthogonalitaet",
          "question": "Welche Bedingung muss für das Skalarprodukt a · b zweier vom Nullvektor verschiedener Vektoren gelten, damit sie zueinander orthogonal (senkrecht) stehen?",
          "concept": "a · b = 0",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "a · b = 0",
              "a · b = 1"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J03"
          ]
        }
      ]
    },
    {
      "id": atomId(11),
      "atom_uri": `urn:zam:atom:${atomId(11)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-vg-determinante",
      "title": "2x2-Determinante und Flächeninhalt",
      "domain": "mathematik/geometrie",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-6-determinante",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-2-vektorgeometrie",
          "topic_title": "Etappe 2: Vektorgeometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Determinanten-Flächenformel",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(12),
          "slug": "m10-vg-determinante-formel",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-6-determinante",
          "question": "Wie lautet die Berechnungsformel für den Wert der zweireihigen Determinante det(a, b) = | a_x  b_x | / | a_y  b_y |?",
          "concept": "a_x · b_y - a_y · b_x",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "a_x · b_y - a_y · b_x",
              "a_x · b_x + a_y · b_y"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J05"
          ]
        },
        {
          "id": itemId(13),
          "slug": "m10-vg-determinante-dreieck",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-6-determinante",
          "question": "Erkläre die Flächeninhaltsformel für ein Dreieck ABC im Koordinatensystem mittels Determinante A = 0.5 · |det(AB, AC)| und berechne die Fläche des Dreiecks mit A(1 | 1), B(5 | 2) und C(2 | 6), wobei auf den mathematisch positiven Umlaufsinn (gegen den Uhrzeigersinn) geachtet wird.",
          "concept": "AB = (4, 1)^T, AC = (1, 5)^T, det = 19, Fläche A = 9,5 FE",
          "sample_solution": "1. Vektoren aufstellen: AB = (4, 1)^T, AC = (1, 5)^T. 2. Determinante: 4·5 - 1·1 = 19. 3. Dreiecksfläche: A = 0,5 · 19 = 9,5 FE.",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "AB = (4, 1)^T, AC = (1, 5)^T, det = 19, Fläche A = 9,5 FE",
              "AB = (4, 1)^T, AC = (1, 5)^T, det = 21, Fläche A = 10,5 FE"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J06"
          ]
        }
      ]
    },
    {
      "id": atomId(12),
      "atom_uri": `urn:zam:atom:${atomId(12)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-vg-drehung",
      "title": "Drehmatrix und Drehung um den Ursprung",
      "domain": "mathematik/geometrie",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-7-drehung",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-2-vektorgeometrie",
          "topic_title": "Etappe 2: Vektorgeometrie"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Drehung um den Ursprung",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(14),
          "slug": "m10-vg-drehung-90",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-7-drehung",
          "question": "Welche Koordinaten erhält man, wenn man den Vektor v = (x, y)^T um 90° gegen den Uhrzeigersinn dreht (Orthogonalvektor / Normalenvektor)?",
          "concept": "(-y, x)^T",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "(-y, x)^T",
              "(y, -x)^T"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J07"
          ]
        },
        {
          "id": itemId(15),
          "slug": "m10-vg-drehmatrix",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=vg-7-drehung",
          "question": "Gib die allgemeine Drehmatrix D_phi = [cos(phi) -sin(phi); sin(phi) cos(phi)] für eine Drehung um das Drehzentrum Z(0|0) um den Winkel phi an und berechne den Bildvektor v' bei Drehung von v = (4, 0)^T um phi = 60° gegen den Uhrzeigersinn.",
          "concept": "v' = (2, 2·sqrt(3))^T (ca. (2, 3,46)^T)",
          "sample_solution": "1. Drehmatrix: x' = x·cos(phi) - y·sin(phi); y' = x·sin(phi) + y·cos(phi). 2. Fuer v = (4, 0)^T und phi = 60°: x' = 4·0,5 - 0 = 2; y' = 4·(sqrt(3)/2) + 0 = 2·sqrt(3) ≈ 3,46. Bildvektor v' = (2, 2·sqrt(3))^T.",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "v' = (2, 2·sqrt(3))^T (ca. (2, 3,46)^T)",
              "v' = (2·sqrt(3), 2)^T (ca. (3,46, 2)^T)"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4V0M0000000000000000J08"
          ]
        }
      ]
    },

    // --- ETAPPE 3: POTENZEN & POTENZFUNKTIONEN ---
    {
      "id": atomId(13),
      "atom_uri": `urn:zam:atom:${atomId(13)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-pt-potenzgesetze",
      "title": "Rationale und negative Exponenten, Potenzgesetze",
      "domain": "mathematik/algebra",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=pt-1-potenzgesetze",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-3-potenzen",
          "topic_title": "Etappe 3: Potenzen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb3",
          "topic_title": "Potenzgesetze",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(16),
          "slug": "m10-pt-potenzen-negativ",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=pt-1-potenzgesetze",
          "question": "Wie wird eine Potenz mit negativem ganzzahligem Exponenten a^(-n) (für a != 0) als Bruch dargestellt?",
          "concept": "a^(-n) = 1 / (a^n)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "a^(-n) = 1 / (a^n)",
              "a^(-n) = -(a^n)"
            ],
            "correct_index": 0
          }
        },
        {
          "id": itemId(17),
          "slug": "m10-pt-potenzen-bruch",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=pt-1-potenzgesetze",
          "question": "Wie lautet die Wurzelschreibweise für eine Potenz mit rationalem Exponenten a^(m/n) (für a > 0)?",
          "concept": "n-te Wurzel aus (a^m)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "n-te Wurzel aus (a^m)",
              "m-te Wurzel aus (a^n)"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(14),
      "atom_uri": `urn:zam:atom:${atomId(14)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-pt-potenzfunktionen",
      "title": "Potenzfunktionen und deren Graphen",
      "domain": "mathematik/analysis",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=pt-2-potenzfunktionen",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-3-potenzen",
          "topic_title": "Etappe 3: Potenzen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb3",
          "topic_title": "Potenzfunktionen",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(18),
          "slug": "m10-pt-potenzfunktion-grad",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=pt-2-potenzfunktionen",
          "question": "Welche Symmetrieeigenschaft besitzt der Graph der Potenzfunktion f(x) = x^n für eine ungerade natürliche Hochzahl n (z. B. f(x) = x³)?",
          "concept": "Punktsymmetrisch zum Ursprung",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "Punktsymmetrisch zum Ursprung",
              "Achsensymmetrisch zur y-Achse"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(15),
      "atom_uri": `urn:zam:atom:${atomId(15)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-pt-wurzelfunktionen",
      "title": "Wurzelfunktionen als Umkehrfunktionen",
      "domain": "mathematik/analysis",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=pt-3-wurzelfunktionen",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-3-potenzen",
          "topic_title": "Etappe 3: Potenzen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb3",
          "topic_title": "Wurzelfunktionen",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(19),
          "slug": "m10-pt-wurzelfunktion-spiegelung",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=pt-3-wurzelfunktionen",
          "question": "Durch welche geometrische Abbildung geht der Graph einer umkehrbaren Funktion in den Graphen ihrer Umkehrfunktion (z. B. f(x) = x² für x >= 0 in g(x) = sqrt(x)) über?",
          "concept": "Achsenspiegelung an der Geraden y = x",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "Achsenspiegelung an der Geraden y = x",
              "Achsenspiegelung an der y-Achse"
            ],
            "correct_index": 0
          }
        }
      ]
    },

    // --- ETAPPE 4: EXPONENTIALFUNKTIONEN & LOGARITHMEN ---
    {
      "id": atomId(16),
      "atom_uri": `urn:zam:atom:${atomId(16)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-el-exponentialfunktionen",
      "title": "Exponentialfunktionen f(x) = b · a^x und Asymptote",
      "domain": "mathematik/analysis",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-1-exponentialfunktionen",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-4-exponential",
          "topic_title": "Etappe 4: Exponentialfunktionen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb4",
          "topic_title": "Exponentialfunktionen",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(20),
          "slug": "m10-el-asymptote",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-1-exponentialfunktionen",
          "question": "Wie lautet die Gleichung der waagrechten Asymptote der Exponentialfunktion f(x) = 2 · 3^x - 4?",
          "concept": "y = -4",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "y = -4",
              "x = -4"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J01"
          ]
        },
        {
          "id": itemId(21),
          "slug": "m10-el-parameter",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-1-exponentialfunktionen",
          "question": "Analysiere die allgemeine Exponentialfunktion f(x) = a · b^x + c (mit b > 0, b != 1): Erkläre die Bedeutung der Parameter a (Streckfaktor/Anfangswert), b (Wachstumsfaktor: b > 1 Wachstum, 0 < b < 1 Zerfall) und c (vertikale Verschiebung/waagrechte Asymptote y = c) und bestimme den Schnittpunkt des Graphen mit der y-Achse.",
          "concept": "Sy(0 | a + c), Asymptote y = c, b > 1 Wachstum, 0 < b < 1 Zerfall",
          "sample_solution": "1. b: b > 1 Wachstum, 0 < b < 1 Zerfall. 2. a: Streckfaktor. 3. c: Asymptote y = c. 4. y-Achsenschnittpunkt: f(0) = a·b^0 + c = a + c -> Sy(0 | a + c).",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "Sy(0 | a + c), Asymptote y = c, b > 1 Wachstum, 0 < b < 1 Zerfall",
              "Sy(0 | a · c), Asymptote x = c, b > 1 Zerfall, 0 < b < 1 Wachstum"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J02"
          ]
        }
      ]
    },
    {
      "id": atomId(17),
      "atom_uri": `urn:zam:atom:${atomId(17)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-el-wachstumsmodelle",
      "title": "Reale Wachstumsmodelle, Halbwertszeit und Verdopplungszeit",
      "domain": "mathematik/anwendung",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-2-wachstumsmodelle",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-4-exponential",
          "topic_title": "Etappe 4: Exponentialfunktionen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb4",
          "topic_title": "Wachstumsprozesse",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(22),
          "slug": "m10-el-halbwertszeit",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-2-wachstumsmodelle",
          "question": "Ein radioaktiver Stoff hat eine Halbwertszeit von T_1/2 = 8 Tagen. Welcher Bruchteil der Ausgangsmenge N_0 ist nach 24 Tagen (3 Halbwertszeiten) noch vorhanden?",
          "concept": "1/8 (12,5%)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "1/8 (12,5%)",
              "1/6 (16,7%)"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J07"
          ]
        },
        {
          "id": itemId(23),
          "slug": "m10-el-verdopplungszeit",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-2-wachstumsmodelle",
          "question": "Eine Bakterienkultur zählt zu Beginn 500 Exemplare und vermehrt sich stündlich um 15% (b = 1,15). Stelle die Funktionsgleichung N(t) auf, berechne den Bestand nach 10 Stunden und bestimme die Verdopplungszeit T_V der Bakterienkultur durch Logarithmieren.",
          "concept": "N(10) ≈ 2023 Bakterien und Verdopplungszeit T_V ≈ 4,96 Stunden",
          "sample_solution": "1. N(t) = 500 · 1,15^t. 2. N(10) = 500 · 1,15^10 ≈ 2023 Bakterien. 3. 1,15^t = 2 <=> t = lg(2)/lg(1,15) ≈ 4,96 Stunden.",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "N(10) ≈ 2023 Bakterien und Verdopplungszeit T_V ≈ 4,96 Stunden",
              "N(10) ≈ 1250 Bakterien und Verdopplungszeit T_V ≈ 6,67 Stunden"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J08"
          ]
        }
      ]
    },
    {
      "id": atomId(18),
      "atom_uri": `urn:zam:atom:${atomId(18)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-el-logarithmus",
      "title": "Der Logarithmus als Umkehrung der Exponentialfunktion",
      "domain": "mathematik/analysis",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-3-logarithmus",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-4-exponential",
          "topic_title": "Etappe 4: Exponentialfunktionen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb4",
          "topic_title": "Logarithmusbegriff",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(24),
          "slug": "m10-el-logarithmus-basis",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-3-logarithmus",
          "question": "Welchen exakten Wert hat der dekadische Logarithmus log_10(1000) bzw. log_2(32)?",
          "concept": "3 bzw. 5",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "3 bzw. 5",
              "100 bzw. 16"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J03"
          ]
        }
      ]
    },
    {
      "id": atomId(19),
      "atom_uri": `urn:zam:atom:${atomId(19)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-el-logarithmengesetze",
      "title": "Logarithmengesetze und Basiswechsel",
      "domain": "mathematik/algebra",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-4-logarithmengesetze",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-4-exponential",
          "topic_title": "Etappe 4: Exponentialfunktionen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb4",
          "topic_title": "Logarithmengesetze",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(25),
          "slug": "m10-el-logarithmengesetze",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-4-logarithmengesetze",
          "question": "Formuliere die drei fundamentalen Logarithmengesetze für Produkte, Quotienten und Potenzen (log(u · v), log(u / v), log(u^r)) und gib die Formel für den Basiswechsel log_b(a) = log_10(a) / log_10(b) an.",
          "concept": "log(u·v)=log u + log v; log(u/v)=log u - log v; log(u^r)=r·log u; log_b(a)=lg a / lg b",
          "sample_solution": "1. log_b(u·v) = log_b(u) + log_b(v). 2. log_b(u/v) = log_b(u) - log_b(v). 3. log_b(u^r) = r·log_b(u). 4. Basiswechsel: log_b(a) = lg(a) / lg(b).",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "log(u·v)=log u + log v; log(u/v)=log u - log v; log(u^r)=r·log u; log_b(a)=lg a / lg b",
              "log(u·v)=log u · log v; log(u/v)=log u / log v; log(u^r)=(log u)^r; log_b(a)=lg b / lg a"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J04"
          ]
        }
      ]
    },
    {
      "id": atomId(20),
      "atom_uri": `urn:zam:atom:${atomId(20)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-el-exponentialgleichungen",
      "title": "Exponentialgleichungen lösen",
      "domain": "mathematik/algebra",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-5-exponentialgleichungen",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-4-exponential",
          "topic_title": "Etappe 4: Exponentialfunktionen"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb4",
          "topic_title": "Exponentialgleichungen",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(26),
          "slug": "m10-el-gleichung-einfach",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-5-exponentialgleichungen",
          "question": "Wie lautet die exakte Lösung der Exponentialgleichung 5^x = 125 bzw. 3^x = 20?",
          "concept": "x = 3 bzw. x = lg(20)/lg(3)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "x = 3 bzw. x = lg(20)/lg(3)",
              "x = 25 bzw. x = 20/3"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J05"
          ]
        },
        {
          "id": itemId(27),
          "slug": "m10-el-gleichung-schritte",
          "language": "de",
          "tier": "tier2_synthesis",
          "bloom_level": 2,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=el-5-exponentialgleichungen",
          "question": "Löse die Exponentialgleichung 4 · 2^(3x - 1) - 12 = 20 schrittweise nach x auf unter Verwendung der Logarithmengesetze und runde das Endergebnis auf zwei Nachkommastellen.",
          "concept": "x = 4/3 ≈ 1,33",
          "sample_solution": "1. 4·2^(3x-1) = 32 <=> 2^(3x-1) = 8 = 2^3. 2. 3x - 1 = 3 <=> 3x = 4 <=> x = 4/3 ≈ 1,33.",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "x = 4/3 ≈ 1,33",
              "x = 2/3 ≈ 0,67"
            ],
            "correct_index": 0
          },
          "replaces": [
            "01K4X0M0000000000000000J06"
          ]
        }
      ]
    },

    // --- ETAPPE 5: RAUMGEOMETRIE & QUADRATISCHE VERTIEFUNG ---
    {
      "id": atomId(21),
      "atom_uri": `urn:zam:atom:${atomId(21)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-ap-rotationskoerper",
      "title": "Zylinder, Kegel, Pyramide und Kugel",
      "domain": "mathematik/geometrie",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=ap-1-rotationskoerper",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-5-abschlusspruefung",
          "topic_title": "Etappe 5: Abschlussprüfung"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "II_III",
          "subject": "mathematik",
          "topic_code": "lb2",
          "topic_title": "Raumgeometrie",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(28),
          "slug": "m10-ap-kegel-volumen",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=ap-1-rotationskoerper",
          "question": "Wie berechnet man das Volumen V eines geraden Kreiskegels mit Radius r und Körperhöhe h?",
          "concept": "V = 1/3 · pi · r² · h",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "V = 1/3 · pi · r² · h",
              "V = pi · r² · h"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(22),
      "atom_uri": `urn:zam:atom:${atomId(22)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-ap-parabeln-abschluss",
      "title": "Parabeln und quadratische Gleichungen in der Abschlussprüfung",
      "domain": "mathematik/analysis",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=ap-2-parabeln-abschluss",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-5-abschlusspruefung",
          "topic_title": "Etappe 5: Abschlussprüfung"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "II_III",
          "subject": "mathematik",
          "topic_code": "lb4",
          "topic_title": "Parabeln",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(29),
          "slug": "m10-ap-parabel-schnittpunkte",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=ap-2-parabeln-abschluss",
          "question": "Wie bestimmt man die Schnittpunkte einer Parabel p: y = ax² + bx + c und einer Geraden g: y = mx + t rechnerisch?",
          "concept": "Gleichsetzen ax² + bx + c = mx + t und quadratische Gleichung lösen",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "Gleichsetzen ax² + bx + c = mx + t und quadratische Gleichung lösen",
              "Addieren der beiden Funktionsterme zu null"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(23),
      "atom_uri": `urn:zam:atom:${atomId(23)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-ap-extremwerte",
      "title": "Extremwertprobleme und quadratische Optimierung",
      "domain": "mathematik/analysis",
      "reduction": "formal",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=ap-3-extremwerte",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-5-abschlusspruefung",
          "topic_title": "Etappe 5: Abschlussprüfung"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "II_III",
          "subject": "mathematik",
          "topic_code": "lb4",
          "topic_title": "Extremwertaufgaben",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(30),
          "slug": "m10-ap-extremwert-quadratisch",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=ap-3-extremwerte",
          "question": "An welcher x-Stelle nimmt die quadratische Funktion f(x) = ax² + bx + c ihr Extremum (Scheitelpunkt) an?",
          "concept": "x_S = -b / (2a)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "x_S = -b / (2a)",
              "x_S = -b / a"
            ],
            "correct_index": 0
          }
        }
      ]
    },

    // --- ETAPPE 6: DATEN UND ZUFALL (STOCHASTIK) ---
    {
      "id": atomId(24),
      "atom_uri": `urn:zam:atom:${atomId(24)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-dz-bedingte-wahrscheinlichkeit",
      "title": "Bedingte Wahrscheinlichkeit und Baumdiagramm",
      "domain": "mathematik/stochastik",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=dz-1-bedingte-wahrscheinlichkeit",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-6-stochastik",
          "topic_title": "Etappe 6: Stochastik"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb5",
          "topic_title": "Bedingte Wahrscheinlichkeit",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(31),
          "slug": "m10-dz-bedingte-w",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=dz-1-bedingte-wahrscheinlichkeit",
          "question": "Wie lautet die mathematische Definition der bedingten Wahrscheinlichkeit P_B(A) (Wahrscheinlichkeit von A unter der Bedingung B)?",
          "concept": "P_B(A) = P(A und B) / P(B)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "P_B(A) = P(A und B) / P(B)",
              "P_B(A) = P(A und B) / P(A)"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(25),
      "atom_uri": `urn:zam:atom:${atomId(25)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-dz-unabhaengigkeit",
      "title": "Stochastische Unabhängigkeit",
      "domain": "mathematik/stochastik",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=dz-2-unabhaengigkeit",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-6-stochastik",
          "topic_title": "Etappe 6: Stochastik"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb5",
          "topic_title": "Stochastische Unabhängigkeit",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(32),
          "slug": "m10-dz-unabhaengigkeit-formel",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=dz-2-unabhaengigkeit",
          "question": "Welche Bedingung müssen zwei Ereignisse A und B erfüllen, damit sie stochastisch unabhängig sind?",
          "concept": "P(A und B) = P(A) · P(B)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "P(A und B) = P(A) · P(B)",
              "P(A und B) = 0"
            ],
            "correct_index": 0
          }
        }
      ]
    },
    {
      "id": atomId(26),
      "atom_uri": `urn:zam:atom:${atomId(26)}`,
      "namespace": "zam-academy-mathematik-realschule-10",
      "slug": "m10-dz-vierfeldertafel-vertieft",
      "title": "Vierfeldertafel und inverses Baumdiagramm",
      "domain": "mathematik/stochastik",
      "reduction": "axiomatic",
      "typical_age_min": 15,
      "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=dz-3-vierfeldertafel-vertieft",
      "prerequisites": [],
      "curricula": [
        {
          "provider": "zam-academy",
          "subject": "mathematik-realschule-10",
          "topic_code": "stage-6-stochastik",
          "topic_title": "Etappe 6: Stochastik"
        },
        {
          "provider": "lehrplanplus-bayern",
          "school_type": "realschule",
          "grade": 10,
          "track": "I",
          "subject": "mathematik",
          "topic_code": "lb5",
          "topic_title": "Vierfeldertafel",
          "exam_relevant": true
        }
      ],
      "practice_items": [
        {
          "id": itemId(33),
          "slug": "m10-dz-vierfeldertafel-summen",
          "language": "de",
          "tier": "tier1_fast",
          "bloom_level": 1,
          "source_link": "https://academy.zam-os.org/mathematik-realschule-10/#lesson=dz-3-vierfeldertafel-vertieft",
          "question": "Welcher Gesamtwert steht unten rechts in einer normierten Vierfeldertafel für Wahrscheinlichkeiten?",
          "concept": "1 (bzw. 100%)",
          "fast_check": {
            "type": "binary_choice",
            "options": [
              "1 (bzw. 100%)",
              "0 (bzw. 0%)"
            ],
            "correct_index": 0
          }
        }
      ]
    }
  ]
};

writeFileSync(cellPath, JSON.stringify(tile, null, 2) + "\n", "utf8");
console.log(`Generated ${cellPath}: ${tile.atoms.length} atoms, ${tile.atoms.reduce((sum, a) => sum + a.practice_items.length, 0)} items.`);
