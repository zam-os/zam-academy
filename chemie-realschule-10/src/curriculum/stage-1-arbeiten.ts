import { makeLab } from "../lab/definitions";
import type { Stage } from "../model/types";
import { cases, cc, lesson } from "./helpers";

const id = "arbeiten";
export const STAGE_ARBEITEN: Stage = {
  id,
  stageNumber: 1,
  title: "Wie Chemiker denken und arbeiten",
  subtitle: "Sicher experimentieren, prüfbar fragen",
  icon: "🥽",
  accent: "#0d9488",
  badgeTitle: "Laborprofi",
  lehrplanLabel: "C10 LB 1 (I) · C10 LB 1 (II/III)",
  lessons: [
    lesson(id, 1, {
      id: "ch-gefahrstoffe",
      title: "Gefahrstoffe und Entsorgung",
      subtitle: "Piktogramme lesen, Maßnahmen ableiten",
      bindings: { I: 1, II_III: 1 },
      why: "Aus einem Piktogramm folgt, wie du mit einem Stoff umgehst und wohin seine Reste kommen.",
      html: "<p>Gefahrstoffe tragen nach dem weltweit einheitlichen GHS-System rot umrandete Piktogramme, ein Signalwort (‚Gefahr‘ oder ‚Achtung‘) sowie H-Sätze (Gefahrenhinweise) und P-Sätze (Sicherheitshinweise). Aus der Kennzeichnung leitest du Schutzmaßnahmen ab: Schutzbrille trägst du im Chemieraum immer, Handschuhe bei ätzenden Stoffen, giftige oder leicht verdampfende Stoffe gehören in den Abzug, entzündbare Stoffe weg von Flammen.</p><p>Auch die Entsorgung folgt aus der Kennzeichnung: Lösungen mit Schwermetallionen, organische Lösungsmittel und halogenhaltige Reste kommen in getrennte Sammelbehälter, nicht in den Ausguss. Du arbeitest nur nach Anweisung der Lehrkraft und nach der Sicherheitsunterweisung.</p><div class=\"example\"><strong>Beispiel:</strong> Brennspiritus trägt die Flamme (GHS02) und das Ausrufezeichen. Daraus folgt: Flasche geschlossen halten, keine offene Flamme in der Nähe, Augen schützen.</div>",
      rule: "Piktogramm lesen → Gefahr benennen → Schutzmaßnahme und Entsorgungsweg ableiten",
      terms: [
        ["GHS02 Flamme", "entzündbar", "von Zündquellen fernhalten"],
        ["GHS05 Ätzwirkung", "ätzend für Haut, Augen, Metalle", "Schutzbrille, Handschuhe"],
        ["GHS06 Totenkopf", "akut giftig", "Abzug, nur durch die Lehrkraft"],
        ["GHS09 Umwelt", "gewässergefährdend", "nicht in den Ausguss"],
      ],
      quiz: [
        "Ein Stoff trägt das Piktogramm Umwelt (toter Baum, toter Fisch). Was folgt für die Entsorgung?",
        "Reste kommen in den passenden Sammelbehälter.",
        "Reste dürfen mit viel Wasser in den Ausguss.",
        "Gewässergefährdende Stoffe dürfen nicht ins Abwasser; sie werden gesammelt und fachgerecht entsorgt.",
      ],
      lab: makeLab("ghs"),
      exercises: [
        cases(
          "piktogramm",
          [
            cc("Welche Gefahr zeigt das Piktogramm Flamme an?", "Der Stoff ist entzündbar.", ["Der Stoff ist ätzend.", "Der Stoff ist radioaktiv."], "GHS02 kennzeichnet entzündbare Gase, Flüssigkeiten und Feststoffe.", "Lies das Bild wörtlich: Was brennt?"),
            cc("Welche Gefahr zeigt das Piktogramm mit Reagenzgläsern, die auf Hand und Metall tropfen?", "Ätzwirkung", ["Explosionsgefahr", "Gesundheitsgefahr durch Einatmen"], "GHS05 steht für Stoffe, die Haut, Augen und Metalle angreifen.", "Was passiert mit Hand und Metall im Bild?"),
            cc("Was bedeutet das Signalwort ‚Gefahr‘ im Vergleich zu ‚Achtung‘?", "‚Gefahr‘ steht für die schwerwiegendere Gefahrenkategorie.", ["‚Gefahr‘ und ‚Achtung‘ bedeuten genau dasselbe.", "‚Achtung‘ steht für die größere Gefahr."], "GHS kennt zwei Signalwörter; ‚Gefahr‘ ist die stärkere Warnung.", "Welches Wort klingt dringlicher?"),
          ],
          [
            cc("Ein Reinigungsmittel trägt GHS05. Welche Maßnahme ist zwingend, wenn du es im Unterricht verwendest?", "Schutzbrille und Schutzhandschuhe tragen.", ["Den Raum abdunkeln.", "Das Mittel vorher erhitzen."], "Ätzende Stoffe schädigen Augen und Haut; Schutzausrüstung verhindert den Kontakt.", "Leite die Maßnahme aus der Gefahr ab."),
            cc("Eine Mitschülerin will Heptanreste in den Ausguss kippen. Was antwortest du fachlich?", "Organische Lösungsmittel kommen in den Sammelbehälter für organische Abfälle.", ["Mit viel Wasser verdünnt ist das unbedenklich.", "Heptan verdunstet ohnehin, also ist der Ausguss egal."], "Organische Lösungsmittel sind entzündbar und gewässergefährdend; sie werden getrennt gesammelt.", "Denke an Abwasser und Brandgefahr."),
          ],
        ),
        cases(
          "laborregeln",
          [
            cc("Wann trägst du im Chemieraum eine Schutzbrille?", "Bei allen Versuchen, sobald im Raum experimentiert wird.", ["Nur, wenn der Stoff Feuer fangen kann.", "Nur beim Arbeiten mit Wasser."], "Spritzer können bei jedem Versuch auftreten, auch am Nachbartisch.", "Augen sind nicht ersetzbar."),
            cc("Wie prüfst du den Geruch eines Stoffes im Unterricht?", "Mit der Hand vorsichtig zufächeln.", ["Direkt über das Gefäß beugen und tief einatmen.", "Einen Tropfen auf die Zunge geben."], "Zufächeln verringert die Menge der eingeatmeten Dämpfe.", "Nie direkt einatmen, nie kosten."),
          ],
          [
            cc("Im Versuch entsteht Bromwasser-Abfall. Welcher Entsorgungsweg passt?", "Behälter für halogenhaltige Abfälle, wie von der Lehrkraft angegeben.", ["Ausguss, weil Brom in Wasser gelöst ist.", "Hausmüll nach dem Eintrocknen."], "Halogenhaltige Reste werden getrennt gesammelt.", "Brom ist ein Halogen."),
            cc("Warum werden Kupfer(II)-sulfat-Reste nicht ins Abwasser gegeben?", "Schwermetallionen schädigen Wasserorganismen und Kläranlagen.", ["Weil Kupfer(II)-sulfat brennbar ist.", "Weil die Lösung im Abfluss explodiert."], "Das Piktogramm Umwelt warnt vor Gewässergefährdung.", "Was sagt GHS09 aus?"),
          ],
        ),
      ],
    }),
    lesson(id, 2, {
      id: "ch-versuche-planen",
      title: "Fragen, Hypothesen und Protokolle",
      subtitle: "Vom Alltagsphänomen zum prüfbaren Versuch",
      bindings: { I: 1, II_III: 1 },
      why: "Ein Versuch beantwortet nur eine Frage, die klar gestellt und fair geprüft wird.",
      html: "<p>Am Anfang steht eine Frage aus dem Alltag oder der Technik, etwa: ‚Warum entkalkt Essig den Wasserkocher?‘ Daraus wird eine <strong>Hypothese</strong>: eine prüfbare Vermutung mit Begründung. Im <strong>Versuch</strong> veränderst du nur eine Größe; alle anderen hältst du gleich (Variablenkontrolle). Ein Kontrollansatz ohne die untersuchte Größe zeigt, ob der Effekt wirklich von ihr kommt.</p><p>Das <strong>Protokoll</strong> trennt Material, Durchführung, Beobachtung und Deutung. Die Beobachtung beschreibt, was man sieht, misst oder riecht. Die Deutung erklärt sie mit Fachwissen auf Teilchenebene. Fachsprache ist genauer als Alltagssprache: ‚Der Kalk löst sich auf‘ beschreibt eine Beobachtung; fachlich reagiert Calciumcarbonat zu einem löslichen Salz und Kohlenstoffdioxid.</p><div class=\"example\"><strong>Beispiel:</strong> Hypothese: ‚Essig entkalkt, weil seine Säure mit Kalk ein Gas bildet.‘ Versuch: Kalk in Essig und Kalk in Wasser (Kontrolle). Beobachtung: Nur im Essig steigen Bläschen auf.</div>",
      rule: "Frage → Hypothese → fairer Versuch (eine Variable) → Beobachtung → Deutung",
      terms: [
        ["Hypothese", "prüfbare, begründete Vermutung", ""],
        ["Variablenkontrolle", "nur eine Größe ändern, alle anderen gleich halten", ""],
        ["Beobachtung / Deutung", "was man wahrnimmt / wie man es erklärt", ""],
      ],
      quiz: [
        "„Die Lösung färbt sich rot.“ Was ist das im Protokoll?",
        "Eine Beobachtung.",
        "Eine Deutung.",
        "Ein Farbwechsel wird wahrgenommen; er ist noch nicht erklärt.",
      ],
      lab: makeLab("planen"),
      exercises: [
        cases(
          "protokoll",
          [
            cc("„Am Glas bildet sich ein Beschlag.“ Wohin gehört der Satz?", "Beobachtung", ["Deutung", "Hypothese"], "Der Satz beschreibt nur, was man sieht.", "Wird hier etwas erklärt?"),
            cc("„Wassermoleküle kondensieren an der kalten Glaswand.“ Wohin gehört der Satz?", "Deutung", ["Beobachtung", "Material"], "Der Satz erklärt die Beobachtung auf Teilchenebene.", "Kann man Moleküle direkt sehen?"),
            cc("„Wenn Zucker Kohlenstoff enthält, bleibt beim starken Erhitzen ein schwarzer Rückstand.“ Was ist das?", "Hypothese", ["Beobachtung", "Durchführung"], "Eine Wenn-dann-Vermutung, die der Versuch prüfen kann.", "Sagt der Satz etwas voraus?"),
          ],
          [
            cc("Ein Protokoll lautet: „Das Magnesium reagiert, weil es unedel ist.“ Was fehlt für eine saubere Trennung?", "Eine reine Beobachtung, z. B. ‚Gasbläschen steigen auf, das Metall wird kleiner‘.", ["Nichts; Beobachtung und Deutung dürfen gemischt werden.", "Die Hypothese muss gestrichen werden."], "Beobachtung und Deutung stehen im Protokoll getrennt.", "Was hat man gesehen, was weiß man?"),
            cc("Alltagssprache: „Die Batterie ist leer.“ Wie beschreibt man das fachlich?", "Die Stoffe für die freiwillige Redoxreaktion sind weitgehend umgesetzt.", ["Die Batterie enthält keine Elektronen mehr.", "Die Batterie hat ihren Strom verbraucht."], "Elektronen gehen nicht verloren; es fehlen umsetzbare Ausgangsstoffe.", "Was ist in einer Batterie gespeichert?"),
          ],
        ),
        cases(
          "fairer-versuch",
          [
            cc("Du prüfst, ob Temperatur die Reaktion von Kalk mit Essig beschleunigt. Was hältst du gleich?", "Kalkmenge, Essigmenge und Essigsorte.", ["Nur die Temperatur.", "Gar nichts; Abweichungen mitteln sich."], "Nur die untersuchte Größe darf sich unterscheiden.", "Welche Größe wird bewusst verändert?"),
            cc("Wozu dient ein Kontrollansatz mit Wasser statt Essig?", "Er zeigt, ob der Effekt wirklich vom Essig kommt.", ["Er ersetzt die Schutzbrille.", "Er macht den Versuch schneller."], "Ohne Vergleich lässt sich die Ursache nicht eindeutig zuordnen.", "Was wäre ohne Vergleich unklar?"),
          ],
          [
            cc("Zwei Gruppen vergleichen Entkalker, nehmen aber verschieden viel Kalk. Warum ist das Ergebnis nicht aussagekräftig?", "Zwei Größen ändern sich gleichzeitig; die Ursache ist nicht eindeutig.", ["Weil Kalk immer gleich reagiert.", "Weil man Entkalker nicht vergleichen darf."], "Bei fairen Versuchen wird nur eine Variable verändert.", "Zähle die veränderten Größen."),
            cc("Eine Hypothese lautet: „Seife ist irgendwie besser.“ Was ist das Problem?", "Sie ist nicht prüfbar, weil nicht gesagt wird, was gemessen werden soll.", ["Sie ist zu kurz.", "Hypothesen dürfen keine Alltagsstoffe enthalten."], "Eine Hypothese muss eine beobachtbare Vorhersage machen.", "Welcher Versuch könnte sie widerlegen?"),
          ],
        ),
      ],
    }),
  ],
};
