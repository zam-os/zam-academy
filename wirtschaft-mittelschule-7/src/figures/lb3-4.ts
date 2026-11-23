import {
  arrow,
  badge,
  card,
  coins,
  type ConceptFigure,
  group,
  label,
  lines,
  pill,
  sheetDoc,
  shield,
  stall,
} from "./draw";

export const LB3_4_FIGURES: Record<string, ConceptFigure> = {
  "bo-berufswahlportfolio": {
    title: "Das Berufswahlportfolio mit vier Registern",
    question: "Wie sammelst du Erfahrungen und Nachweise von Klasse 7 bis zum Abschluss übersichtlich?",
    alt: "Drei Schritte zum Berufswahlportfolio von Jonas: Registerstruktur (1–4), maßstäblicher Fortschrittsbalken 12 von 20 Nachweisen (60 %), Nutzung für Beratung und Bewerbung.",
    caption: "Beispiel Jonas (Klasse 7b): vier geordnete Register, aktueller Stand 12 von 20 Nachweisen (60 %).",
    parts: [
      {
        label: "Vier feste Register",
        note: "1. Ich über mich, 2. Betriebserkundungen, 3. Berufe & Ausbildungswege, 4. Bewerbung & Zertifikate geben jedem Dokument einen festen Platz.",
      },
      {
        label: "Aktuell gepflegt (60 %)",
        note: "12 von 20 geplanten Nachweisen sind schon abgeheftet — wichtige Protokolle und Zertifikate gehen nicht verloren.",
      },
      {
        label: "Nutzen im Gespräch",
        note: "Vor der Berufsberatung oder Praktikumssuche hat Jonas in zwei Minuten alle Stärken und Erkundungsergebnisse griffbereit.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "4 Register", "heading", "start")}${sheetDoc(38, 66, 176, 128, "Berufswahlportfolio", ["1. Ich über mich", "2. Erkundungen & Praxis", "3. Berufe & Beratung", "4. Bewerbung & Nachweise"])}${label(126, 218, "Klare Ordnung statt Zettelbox", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Aktueller Stand", "heading", "start")}<rect x="290" y="96" width="180" height="24" rx="5" class="v-soft-fill"/><rect x="290" y="96" width="108" height="24" rx="5" class="v-green"/>${label(344, 112, "12 (60 %)", "micro on-fill")}${label(440, 112, "8 offen", "micro")}${lines(380, 152, "12 von 20 geplanten Belegen\naktuell eingeordnet", "micro")}${pill(284, 190, 192, 34, "Jedes Halbjahr ergänzen", "v-gold-fill", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Einsatz ab Kl. 7–9", "heading", "start")}${pill(538, 76, 192, 36, "Vorbereitung Berufsberatung", "v-blue-fill", "micro")}${pill(538, 124, 192, 36, "Basis für Betriebspraktikum", "v-teal-fill", "micro")}${pill(538, 172, 192, 36, "Belege für Bewerbungen", "v-green-fill", "micro")}`,
      )}`,
  },

  "bo-berufsberatung-kammern": {
    title: "Berufsberatung, Kammern, Innungen und Verbände",
    question: "Wer informiert dich unabhängig bei der Berufswahl und wer betreut die Ausbildung im Betrieb?",
    alt: "Drei Säulen verlässlicher Berufsinformation: Agentur für Arbeit (§ 29 SGB III, BERUFENET/BiZ), Zuständige Kammern IHK und HWK (§ 71 BBiG), Innungen und Wirtschaftsverbände.",
    caption: "Geprüfte Quellen statt Zufallstreffer: Agentur für Arbeit berät neutral; IHK, HWK, Innungen und Verbände kennen die Betriebe.",
    parts: [
      {
        label: "Berufsberatung & BiZ",
        note: "Die Agentur für Arbeit (§ 29 SGB III) berät kostenlos und neutral über alle Berufe und bietet BERUFENET-Steckbriefe.",
      },
      {
        label: "Kammern (IHK & HWK)",
        note: "Als zuständige Stellen (§ 71 BBiG) überwachen IHK (Industrie/Handel) und HWK (Handwerk) Ausbildungsverträge und Prüfungen.",
      },
      {
        label: "Innungen & Verbände",
        note: "Örtliche Handwerksinnungen und Fachverbände liefern praxisnahe Infos zu Betrieben, Branchen und Lehrstellen vor Ort.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Arbeitsagentur", "heading", "start")}${pill(30, 74, 192, 34, "Berufsberatung (§ 29 SGB III)", "v-blue-fill", "micro")}${pill(30, 120, 192, 34, "BiZ & BERUFENET", "v-teal-fill", "micro")}${lines(126, 186, "Unabhängig, kostenlos\nund über alle Branchen hinweg", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "IHK & HWK", "heading", "start")}${pill(284, 74, 192, 36, "IHK · Industrie & Handel", "v-gold-fill", "micro")}${pill(284, 122, 192, 36, "HWK · Handwerk", "v-orange-fill", "micro")}${lines(380, 188, "Verträge eintragen,\nAusbildung prüfen (§ 71 BBiG)", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Innungen & Verbände", "heading", "start")}${shield(634, 98, 0.85, "v-green")}${lines(634, 152, "Bäcker-, Elektroinnung\n& Fachverbände kennen\nBetriebe vor Ort.", "micro")}${pill(538, 202, 192, 32, "Verlässliche Fakten prüfen", "v-green-fill", "micro")}`,
      )}`,
  },

  "bo-taetigkeitsbereiche-anforderungen": {
    title: "Persönliches Profil und Berufsanforderungen abgleichen",
    question: "Wie erkennst du objektiv, welcher Tätigkeitsbereich wirklich zu deinen Stärken passt?",
    alt: "Profilabgleich am Beispiel Tim (Technik 5, Soziales 3, Sorgfalt 5, Kreativität 3) gegen drei Berufe mit maßstäblichen Passungsbalken: Elektroniker/in 95 %, Büromanagement 80 %, Med. Fachangestellte/r 70 %.",
    caption: "Beispiel Tim: Abgleich über vier Merkmale zeigt 95 % Passung bei Elektroniker/in (Abstand nur 1 Punkt).",
    parts: [
      {
        label: "Dein Stärkenprofil",
        note: "Du bewertest Technik (5), Soziales (3), Sorgfalt (5) und Kreativität (3) ehrlich anhand von Projekten und Interessen.",
      },
      {
        label: "Berufsanforderungen",
        note: "Jeder Tätigkeitsbereich setzt eigene Schwerpunkte — z. B. Elektroniker/in (6/3/5/3) vs. Med. Fachangestellte/r (3/6/5/2).",
      },
      {
        label: "Passung im Vergleich",
        note: "Je kleiner die Abweichung über alle Merkmale, desto höher die Passung: Elektroniker 95 %, Büro 80 %, MFA 70 %.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Tims Profil (1–6)", "heading", "start")}${sheetDoc(38, 66, 176, 118, "Interessen & Stärken", ["Technik: 5 Punkte", "Soziales: 3 Punkte", "Sorgfalt: 5 Punkte", "Kreativität: 3 Punkte"])}${label(126, 212, "Basis: Erkundung & Alltag", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Anforderungen", "heading", "start")}${pill(284, 72, 192, 36, "Elektronik: 6 / 3 / 5 / 3", "v-teal-fill", "micro")}${pill(284, 120, 192, 36, "Büromanagement: 3 / 4 / 6 / 3", "v-blue-fill", "micro")}${pill(284, 168, 192, 36, "Med. Fachang.: 3 / 6 / 5 / 2", "v-orange-fill", "micro")}${label(380, 226, "Abstandssumme: 1 · 4 · 6 Pkt.", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Passungsvergleich", "heading", "start")}${label(536, 86, "Elektr.", "micro", "start")}<rect x="592" y="72" width="114" height="20" rx="4" class="v-green"/>${label(710, 86, "95 %", "micro", "start")}${label(536, 122, "Büro", "micro", "start")}<rect x="592" y="108" width="96" height="20" rx="4" class="v-blue"/>${label(694, 122, "80 %", "micro", "start")}${label(536, 158, "MFA", "micro", "start")}<rect x="592" y="144" width="84" height="20" rx="4" class="v-orange"/>${label(682, 158, "70 %", "micro", "start")}${pill(538, 186, 192, 34, "Höchste Passung: Elektroniker", "v-green-fill", "micro")}`,
      )}`,
  },

  "bo-selbst-fremdeinschaetzung": {
    title: "Selbst- und Fremdeinschätzung abgleichen",
    question: "Warum deckt erst das Gespräch über beide Blickwinkel deine echten Stärken und Übungsfelder auf?",
    alt: "Beispiel Lenas Praxisprojekt: Selbsteinschätzung (Team 3, Ordnung 5) neben Fremdeinschätzung (Team 5, Ordnung 3) und dem realistischen Ergebnisbild mit Schnitt 4,25 Punkte.",
    caption: "Lenas Praxisprojekt: Im Abgleich von Eigenbild und Rückmeldung werden verborgene Stärken und Übungsfelder klar.",
    parts: [
      {
        label: "Eigene Sicht (Selbst)",
        note: "Lena gibt sich in Teamarbeit nur 3 Punkte, bewertet ihre Arbeitsplatzordnung jedoch optimistisch mit 5 Punkten.",
      },
      {
        label: "Blick von außen (Fremd)",
        note: "Ihre Lehrkraft beobachtet geduldige Hilfe im Team (5 Punkte), aber zweimal liegen gebliebenes Werkzeug (3 Punkte).",
      },
      {
        label: "Kluge Konsequenz",
        note: "Ergebnis (Schnitt 4,25 Punkte): Lena erkennt eine echte Teamstärke und arbeitet vor dem Praktikum gezielt an Arbeitsordnung.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Selbsteinschätzung", "heading", "start")}${label(32, 92, "Team", "micro", "start")}<rect x="92" y="78" width="60" height="20" rx="4" class="v-blue"/>${label(158, 92, "3 Pkt.", "micro", "start")}${label(32, 128, "Ordnung", "micro", "start")}<rect x="92" y="114" width="100" height="20" rx="4" class="v-blue"/>${label(198, 128, "5 Pkt.", "micro", "start")}${lines(126, 178, "Eigenbild allein kann\nzu streng oder mild sein.", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Fremdeinschätzung", "heading", "start")}${label(286, 92, "Team", "micro", "start")}<rect x="346" y="78" width="100" height="20" rx="4" class="v-teal"/>${label(452, 92, "5 Pkt.", "micro", "start")}${label(286, 128, "Ordnung", "micro", "start")}<rect x="346" y="114" width="60" height="20" rx="4" class="v-orange"/>${label(412, 128, "3 Pkt.", "micro", "start")}${lines(380, 178, "Beobachtung zeigt\nkonkrete Situationen.", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Lerngewinn", "heading", "start")}${pill(538, 74, 192, 36, "Teamstärke entdeckt (+ 2)", "v-green-fill", "micro")}${pill(538, 122, 192, 36, "Übungsfeld Ordnung (− 2)", "v-coral-fill", "micro")}${pill(538, 174, 192, 38, "Realistischer Schnitt: 4,25", "v-gold-fill", "micro")}`,
      )}`,
  },

  "bo-finanzielle-aspekte-sichtweisen": {
    title: "Sichtweisen auf Arbeit und Ausbildungsbudget (M7)",
    question: "Wie wirken persönliche Arbeitszufriedenheit und das echte Monatsbudget in der Ausbildung zusammen?",
    alt: "Links Chancen vs. Belastungen von Arbeit, in der Mitte Abzüge von 840,00 € Nettovergütung (58 € Ticket, 42 € Mittel, 84 € Rücklage), rechts 656,00 € frei verfügbares Ausbildungsbudget.",
    caption: "Beispiel M7: Vom Netto-Azubigehalt (840 €) bleiben nach Fahrtkosten, Arbeitsmitteln und 10 % Rücklage genau 656 € frei.",
    parts: [
      {
        label: "Zwei Sichtweisen",
        note: "Arbeit bringt Einkommen, Sinn und Teamkontakt, fordert aber auch Frühaufstehen, Belastbarkeit oder Wochenenddienste.",
      },
      {
        label: "Ausbildungsabzüge",
        note: "Von 840,00 € netto gehen 58,00 € Fahrticket, 42,00 € Arbeitsmittel und 84,00 € Rücklage (10 %) fest ab.",
      },
      {
        label: "Freier Spielraum",
        note: "Die verbleibenden 656,00 € (78,10 %) zeigen die echte Kaufkraft während der Ausbildung.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Sicht auf Arbeit", "heading", "start")}${pill(30, 74, 192, 42, "+ Team, Ergebnis, Aufstieg", "v-green-fill", "micro")}${pill(30, 128, 192, 42, "− Frühschicht, Zeitdruck", "v-coral-fill", "micro")}${lines(126, 200, "Beide Seiten vor der\nBerufswahl ehrlich prüfen", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Budgetaufteilung", "heading", "start")}<rect x="288" y="84" width="184" height="24" rx="4" class="v-blue"/>${label(380, 100, "840,00 € Nettovergütung", "micro on-fill")}<rect x="288" y="118" width="13" height="24" rx="2" class="v-orange"/><rect x="301" y="118" width="9" height="24" rx="2" class="v-coral"/><rect x="310" y="118" width="18" height="24" rx="2" class="v-gold"/><rect x="328" y="118" width="144" height="24" rx="3" class="v-green"/>${label(400, 134, "656,00 €", "micro on-fill")}${lines(380, 168, "Ticket 58 € · Mittel 42 €\nRücklage (10 %) 84 €", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Spielraum", "heading", "start")}${pill(538, 78, 192, 42, "Frei verfügbar: 656,00 €", "v-green-fill", "small")}${lines(634, 152, "Langfristige Perspektive:\nMeister / Techniker erhöht\nspäter das Einkommen.", "micro")}`,
      )}`,
  },

  "wi-geldwert-arbeitszeit": {
    title: "Den Geldwert in Arbeitszeit sichtbar machen",
    question: "Wie viele Stunden Arbeit stecken hinter einem Einkauf von 75,00 € oder 3,00 €?",
    alt: "Umrechnung von Geldbeträgen über 15,00 € Nettostundenlohn: Pausensnack 3,00 € = 12 Min., Markenschuhe 75,00 € = 5 Stunden (300 Min.), Monats-Pausensnacks 60,00 € = 4 Stunden.",
    caption: "Bei 15,00 € netto je Stunde kostet ein Paar Turnschuhe (75,00 €) genau 5 Stunden Erwerbsarbeit.",
    parts: [
      {
        label: "Netto-Stundenlohn",
        note: "Maßstab ist immer das Netto je Stunde (hier 15,00 €), weil Steuern und Sozialabgaben bereits abgezogen sind.",
      },
      {
        label: "Einzelkauf: 75,00 €",
        note: "75,00 € / 15,00 €/Std. = 5,00 Stunden (300 Minuten) konzentrierte Arbeitszeit für ein Paar Schuhe.",
      },
      {
        label: "Kleine Summen: 3,00 €/Tag",
        note: "3,00 € kosten nur 12 Minuten, aber an 20 Schultagen im Monat werden daraus 60,00 € = volle 4 Stunden Arbeit.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Rechenmaßstab", "heading", "start")}${coins(126, 94, 0.95)}${pill(30, 134, 192, 34, "1 Std. Arbeit = 15,00 € netto", "v-blue-fill", "micro")}${lines(126, 198, "Formel:\nZeit = Preis / Stundenlohn", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Sportschuhe 75 €", "heading", "start")}<rect x="292" y="92" width="176" height="28" rx="5" class="v-orange"/>${label(380, 110, "75,00 € / 15,00 € = 5,00 Std.", "micro on-fill")}${pill(284, 140, 192, 34, "5,00 Std. = 300 Minuten", "v-orange-fill", "micro")}${lines(380, 200, "Vergleich lohnt sich vor\njedem teuren Kauf.", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Alltagssummen", "heading", "start")}<rect x="546" y="88" width="8" height="22" rx="3" class="v-teal"/>${label(562, 103, "3 € = 12 Min. (1 Tag)", "micro", "start")}<rect x="546" y="126" width="160" height="22" rx="4" class="v-coral"/>${label(626, 141, "60 € = 4 Std. (20 Tg.)", "micro on-fill")}${label(634, 174, "Maßstab 1 : 20 im Monat", "micro")}${pill(538, 194, 192, 32, "Kleinkäufe prüfen!", "v-gold-fill", "micro")}`,
      )}`,
  },

  "wi-einkommen-lebensstandard": {
    title: "Einkommen, Grundbedarf und Lebensstandard (M7)",
    question: "Warum wächst der frei verfügbare Spielraum stärker als das Einkommen selbst?",
    alt: "Maßstäblicher Balkenvergleich zweier Haushalte: Haushalt A (2.000 € = 1.200 € Grundbedarf [60 %] + 800 € frei [40 %]) vs. Haushalt B (3.000 € = 1.350 € Grundbedarf [45 %] + 1.650 € frei [55 %]).",
    caption: "Vergleich A (2.000 €) vs. B (3.000 €): Grundbedarf sinkt anteilig von 60 % auf 45 %; freier Spielraum verdoppelt sich von 800 € auf 1.650 €.",
    parts: [
      {
        label: "Haushalt A (2.000 €)",
        note: "1.200,00 € für Wohnen, Essen und Strom bedeuten 60 % Grundbedarfsquote — es bleiben 800,00 € (40 %) frei.",
      },
      {
        label: "Haushalt B (3.000 €)",
        note: "1.350,00 € Grundbedarf sind nur 45 % vom Nettoeinkommen — dadurch stehen 1.650,00 € (55 %) frei zur Verfügung.",
      },
      {
        label: "Qualifikation & Ort",
        note: "Bessere Ausbildung erhöht meist das Einkommen; zusätzlich entscheiden regionale Miet- und Lebenskosten mit.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Haushalt A · 2.000 €", "heading", "start")}<rect x="34" y="88" width="110" height="28" rx="4" class="v-coral"/><rect x="144" y="88" width="74" height="28" rx="4" class="v-green"/>${label(89, 106, "60 % (1.200 €)", "micro on-fill")}${label(181, 106, "40 %", "micro on-fill")}${lines(126, 150, "Grundbedarf: 1.200,00 €\nFrei verfügbar: 800,00 €", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Haushalt B · 3.000 €", "heading", "start")}<rect x="282" y="88" width="85" height="28" rx="4" class="v-coral"/><rect x="367" y="88" width="105" height="28" rx="4" class="v-green"/>${label(324, 106, "45 %", "micro on-fill")}${label(419, 106, "55 % (1.650 €)", "micro on-fill")}${lines(380, 150, "Grundbedarf: 1.350,00 €\nFrei verfügbar: 1.650,00 €", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Wirkung", "heading", "start")}${pill(538, 76, 192, 36, "+ 50 % Lohn → + 106 % frei", "v-green-fill", "micro")}${lines(634, 146, "Höhere Qualifikation senkt\ndie Grundbedarfsquote.\nMietniveau vor Ort mitrechnen!", "micro")}`,
      )}`,
  },

  "wi-einnahmen-ausgaben-planen": {
    title: "Vier-Wochen-Übersicht von Einnahmen und Ausgaben",
    question: "Wie bleibt bei 100,00 € in vier Wochen am Ende sicher ein Überschuss fürs Sparziel übrig?",
    alt: "Maßstäbliches Balkendiagramm zum 4-Wochen-Plan: Einnahmen 100,00 € (4 · 25 €) gegenüber Ausgaben-Stapel 20,00 € fest + 48,00 € veränderlich + 32,00 € Überschuss (32 % Sparquote, Ziel 30,00 € erreicht).",
    caption: "4-Wochen-Beispiel: 100,00 € Einnahmen minus 20,00 € fest minus 48,00 € veränderlich = 32,00 € Überschuss.",
    parts: [
      {
        label: "4-Wochen-Einnahmen",
        note: "Wöchentlich 25,00 € (Taschengeld + Mithilfe) summieren sich in vier Wochen auf genau 100,00 € (100 %).",
      },
      {
        label: "Fest vs. veränderlich",
        note: "20,00 € feste Ausgaben (20 %, z. B. Handytarif) und 48,00 € veränderliche Ausgaben (48 %, Snacks/Kino) kosten zusammen 68,00 €.",
      },
      {
        label: "Kontrolle & Sparziel",
        note: "Übrig bleiben 32,00 € (32 % Sparquote) — das Kopfhörer-Sparziel von 30,00 € wird sicher übertroffen.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Einnahmen (4 Wo.)", "heading", "start")}<rect x="34" y="88" width="184" height="30" rx="5" class="v-green"/>${label(126, 108, "4 · 25,00 € = 100,00 €", "micro on-fill")}${lines(126, 152, "Alle Zuflüsse über vier\nWochen vollständig notieren", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Ausgaben-Stapel", "heading", "start")}<rect x="288" y="88" width="37" height="30" rx="3" class="v-blue"/><rect x="325" y="88" width="88" height="30" rx="3" class="v-orange"/><rect x="413" y="88" width="59" height="30" rx="3" class="v-teal-fill"/>${label(306, 107, "20", "micro on-fill")}${label(369, 107, "48 €", "micro on-fill")}${label(442, 107, "32", "micro")}${lines(380, 152, "20,00 € fest (20 %)\n+ 48,00 € veränderlich (48 %)", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Sparziel-Kontrolle", "heading", "start")}${pill(538, 78, 192, 38, "Überschuss: + 32,00 € (32 %)", "v-green-fill", "micro")}${pill(538, 130, 192, 34, "Ziel 30,00 € erreicht ✓", "v-gold-fill", "micro")}${label(634, 196, "Spielraum für nächste Wochen", "micro")}`,
      )}`,
  },

  "wi-markterkundung": {
    title: "Regalzonen und Grundpreis bei der Markterkundung",
    question: "Wie durchschaust du Warenplatzierung und unterschiedliche Packungsgrößen im Laden?",
    alt: "Drei Teile zur Markterkundung: Vier Regalzonen (Streck-, Sicht-, Greif-, Bückzone), Sortimentsaspekte und Grundpreisvergleich 0,5 kg für 1,80 € (3,60 €/kg) vs. 0,75 kg für 2,40 € (3,20 €/kg).",
    caption: "Markterkundung: teure Marken auf Augenhöhe, günstige oft unten — immer den Grundpreis (€/kg oder €/l) vergleichen!",
    parts: [
      {
        label: "Vier Regalzonen",
        note: "In Sicht- und Greifzone liegen oft teurere Markenwaren; günstige Eigenmarken verstecken sich in der Bück- und Streckzone.",
      },
      {
        label: "Sortiment & Werbung",
        note: "Beobachte Angebotsbreite (Bio, regional, Eigenmarke), lange Laufwege zu Grundnahrungsmitteln und Kassen-Quengelware.",
      },
      {
        label: "Grundpreis (§ 4 PAngV)",
        note: "Müsli A (0,50 kg zu 1,80 €) kostet 3,60 €/kg; Müsli B (0,75 kg zu 2,40 €) kostet nur 3,20 €/kg und spart 0,40 €/kg.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Regalzonen", "heading", "start")}${pill(34, 68, 184, 28, "Streckzone (ganz oben)", "v-panel", "micro")}${pill(34, 102, 184, 28, "Sichtzone (Augenhöhe · teuer)", "v-coral-fill", "micro")}${pill(34, 136, 184, 28, "Greifzone (bequem · teuer)", "v-orange-fill", "micro")}${pill(34, 170, 184, 28, "Bückzone (unten · oft günstig)", "v-green-fill", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Leittext-Aspekte", "heading", "start")}${sheetDoc(292, 68, 176, 122, "Beobachtungsbogen", ["1. Warenangebot & Herkunft", "2. Zweitplatzierung / Aktion", "3. Quengelzone an Kasse", "4. Licht, Musik & Laufwege"])}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Grundpreis €/kg", "heading", "start")}${label(536, 86, "A: 0,5 kg", "micro", "start")}<rect x="598" y="72" width="108" height="22" rx="4" class="v-coral"/>${label(652, 87, "3,60 €/kg", "micro on-fill")}${label(536, 126, "B: 0,75 kg", "micro", "start")}<rect x="598" y="112" width="96" height="22" rx="4" class="v-green"/>${label(646, 127, "3,20 €/kg", "micro on-fill")}${pill(538, 168, 192, 38, "B spart 0,40 €/kg ✓", "v-green-fill", "micro")}`,
      )}`,
  },

  "wi-angebot-und-nachfrage": {
    title: "Preisbildung durch Angebot und Nachfrage",
    question: "Wie reagieren Mengen und Preise bei Nachfrageüberhang, Angebotsüberhang und im Gleichgewicht?",
    alt: "Drei Marktzustände am Pausenkiosk: 1. Nachfrageüberhang bei 1,50 € (90 Nachfrage vs. 50 Angebot), 2. Gleichgewicht bei 2,50 € (70 vs. 70), 3. Angebotsüberhang bei 3,50 € (45 Nachfrage vs. 95 Angebot).",
    caption: "Pausenbrötchen-Beispiel: Knappheit bei 1,50 € treibt den Preis hoch; Überhang bei 3,50 € drückt den Preis nach unten.",
    parts: [
      {
        label: "Nachfrageüberhang (1,50 €)",
        note: "Bei niedrigem Preis (1,50 €) wünschen 90 Jugendliche ein Brötchen, aber nur 50 sind da → Überhang +40, Preis steigt eher.",
      },
      {
        label: "Gleichgewicht (2,50 €)",
        note: "Bei etwa 2,50 € entsprechen rund 70 gewünschte Brötchen genau den 70 angebotenen → der Markt wird ohne Reste geräumt.",
      },
      {
        label: "Angebotsüberhang (3,50 €)",
        note: "Bei hohem Preis (3,50 €) fragen nur noch 45 Käufer nach, während 95 bereitliegen → +50 Reste, Preis muss sinken.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Bei 1,50 € · Mangel", "heading", "start")}${label(32, 88, "Nachfr.", "micro", "start")}<rect x="94" y="74" width="126" height="20" rx="4" class="v-orange"/>${label(157, 88, "90 Stk.", "micro on-fill")}${label(32, 120, "Angeb.", "micro", "start")}<rect x="94" y="106" width="70" height="20" rx="4" class="v-blue"/>${label(129, 120, "50 Stk.", "micro on-fill")}${pill(30, 156, 192, 34, "Nachfrageüberhang: +40", "v-orange-fill", "micro")}${label(126, 214, "Preisdruck nach oben ↑", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Bei 2,50 € · Ausgleich", "heading", "start")}${label(286, 88, "Nachfr.", "micro", "start")}<rect x="348" y="74" width="98" height="20" rx="4" class="v-green"/>${label(397, 88, "70 Stk.", "micro on-fill")}${label(286, 120, "Angeb.", "micro", "start")}<rect x="348" y="106" width="98" height="20" rx="4" class="v-green"/>${label(397, 120, "70 Stk.", "micro on-fill")}${pill(284, 156, 192, 34, "Marktgleichgewicht", "v-green-fill", "micro")}${label(380, 214, "Weder Mangel noch Reste ✓", "micro")}`,
      )}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Bei 3,50 € · Reste", "heading", "start")}${label(540, 88, "Nachfr.", "micro", "start")}<rect x="602" y="74" width="63" height="20" rx="4" class="v-orange"/>${label(634, 88, "45", "micro on-fill")}${label(540, 120, "Angeb.", "micro", "start")}<rect x="602" y="106" width="133" height="20" rx="4" class="v-blue"/>${label(668, 120, "95 Stk.", "micro on-fill")}${pill(538, 156, 192, 34, "Angebotsüberhang: +50", "v-coral-fill", "micro")}${label(634, 214, "Preisdruck nach unten ↓", "micro")}`,
      )}`,
  },

  "wi-pausenverkauf-handeln": {
    title: "Marktreaktion beim schulischen Pausenverkauf",
    question: "Wie reagierst du beim eigenen Verkauf, wenn die Nachfrage geringer ausfällt als geplant?",
    alt: "Pausenverkauf mit 80 Bechern (74,00 € Gesamtausgaben): voller Verkauf bei 2,00 € = 160,00 € Einnahmen (+86,00 € Überschuss) vs. schwacher Tag 70 % (56 Stück = 112,00 €, +38,00 €) und Gegenmaßnahmen.",
    caption: "80 Becher zu 0,80 € (+ 10 € Stand = 74 € Kosten): rechtzeitige Preissenkung verhindert verderbliche Reste.",
    parts: [
      {
        label: "Einkauf & Startplan",
        note: "80 Becher zu je 0,80 € plus 10,00 € Standkosten bedeuten 74,00 € Gesamtausgaben schon vor der ersten Pause.",
      },
      {
        label: "Nachfrage-Szenarien",
        note: "Bei 100 % Absatz (2,00 €) entstehen 160,00 € Erlös (+86 €); bei Regen (70 % = 56 Stk.) sinkt der Erlös auf 112,00 € (+38 €).",
      },
      {
        label: "Klug nachsteuern",
        note: "Bleiben Reste liegen, helfen ein rechtzeitiger Restepreis in der 2. Pause oder Kombiaktionen; fürs nächste Mal Vorbestellung nutzen.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Ausgangslage", "heading", "start")}${stall(126, 98, 0.9)}${pill(30, 144, 192, 34, "80 Stk · 0,80 € + 10 € = 74 €", "v-coral-fill", "micro")}${label(126, 206, "Startpreis: 2,00 € je Becher", "micro")}`,
      )}${arrow(242, 134, 264, 134)}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Verkaufserlös", "heading", "start")}${label(286, 86, "100 %", "micro", "start")}<rect x="336" y="72" width="136" height="22" rx="4" class="v-green"/>${label(404, 87, "160 € (+86 €)", "micro on-fill")}${label(286, 124, "70 %", "micro", "start")}<rect x="336" y="110" width="95" height="22" rx="4" class="v-orange"/>${label(384, 125, "112 € (+38 €)", "micro on-fill")}${lines(380, 168, "Ohne Aktion bleiben\n24 Becher unverkauft.", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Marktreaktion", "heading", "start")}${pill(538, 72, 192, 36, "2. Pause: Restepreis / Kombi", "v-teal-fill", "micro")}${pill(538, 120, 192, 36, "Nächstes Mal: Vorbestellung", "v-blue-fill", "micro")}${pill(538, 168, 192, 36, "Sortiment flexibel anpassen", "v-gold-fill", "micro")}`,
      )}`,
  },

  "wi-einnahmen-ausgaben-projekt": {
    title: "Einfache Übersicht über Einnahmen und Ausgaben",
    question: "Wie rechnest du die Kasse nach einem Schulprojekt belegtreu und ohne Wechselgeld-Fehler ab?",
    alt: "Kassenabrechnung Klasse 7a: Ausgaben 78,00 € (68 € Bons + 10 € Material), Einnahmen 144,00 € (Kasse 174,00 € minus 30,00 € Start-Wechselgeld), ergibt 66,00 € Überschuss.",
    caption: "Beispiel Klassenverkauf 7a: Kasse 174,00 € − 30,00 € Start-Wechselgeld = 144,00 € Verkaufserlös; 144,00 € − 78,00 € = 66,00 € Überschuss.",
    parts: [
      {
        label: "Alle Ausgabenbelege",
        note: "Jeder Einkauf wird per Bon belegt: 68,00 € für Brezeln & Getränke plus 10,00 € für Servietten & Plakat = 78,00 € Ausgaben.",
      },
      {
        label: "Echte Einnahmen",
        note: "Vom Kassen-Endbestand werden die eingelegten 30,00 € Wechselgeld abgezogen → 72 Brezeln + 24 Schorlen = 144,00 € Erlös.",
      },
      {
        label: "Überschuss 66,00 €",
        note: "144,00 € Einnahmen minus 78,00 € Ausgaben zeigen der Klasse transparent 66,00 € Gewinn für die Klassenkasse.",
      },
    ],
    draw: () =>
      `${group(
        1,
        `${card(14, 16, 224, 238)}${badge(36, 38, 1)}${label(56, 43, "Ausgaben (Bons)", "heading", "start")}${sheetDoc(38, 68, 176, 114, "Belege sammeln", ["Einkauf Ware: 68,00 €", "Standmaterial: 10,00 €", "Keine Zahlung ohne Bon!"])}${pill(30, 196, 192, 32, "Summe Ausgaben: 78,00 €", "v-coral-fill", "micro")}`,
      )}${group(
        2,
        `${card(268, 16, 224, 238)}${badge(290, 38, 2)}${label(310, 43, "Einnahmen prüfen", "heading", "start")}${sheetDoc(292, 68, 176, 114, "Kassensturz", ["Kasse gesamt: 174,00 €", "− Wechselgeld: 30,00 €", "= Verkaufserlös: 144,00 €"])}${pill(284, 196, 192, 32, "Einnahmen: 144,00 €", "v-blue-fill", "micro")}`,
      )}${arrow(496, 134, 518, 134)}${group(
        3,
        `${card(522, 16, 224, 238)}${badge(544, 38, 3)}${label(564, 43, "Projekt-Saldo", "heading", "start")}<rect x="546" y="78" width="168" height="24" rx="4" class="v-blue"/>${label(630, 94, "Einnahmen 144,00 €", "micro on-fill")}<rect x="546" y="110" width="91" height="24" rx="4" class="v-coral"/><rect x="637" y="110" width="77" height="24" rx="4" class="v-green"/>${label(591, 126, "78 €", "micro on-fill")}${label(675, 126, "66 €", "micro on-fill")}${pill(538, 176, 192, 40, "Überschuss: + 66,00 €", "v-green-fill", "small")}`,
      )}`,
  },
};
