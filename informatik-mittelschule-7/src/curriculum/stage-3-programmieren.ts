import type { ExerciseGenerator, Stage } from "../model/types";
import { branchLab, loopLab, sequenceLab, variableLab } from "../lab/rover";
import { cc, cases, choiceField, explain, lesson, numberField, practice } from "./helpers";

const id = "stage-3-programmieren";
const sequenceRule = "Eine Sequenz führt Anweisungen in ihrer angegebenen Reihenfolge aus. Eine Methode gehört zu einem Objekt.";
const branchRule = "Eine Bedingung ist wahr oder falsch. In einer zweiseitigen Alternative wird genau ein Zweig ausgeführt.";
const loopRule = "Ein eingerückter Block gehört zu der Struktur, in der er steht, und wird mit ihr ausgeführt.";
const variableRule = "Eine Zuweisung ändert den gespeicherten Wert. Prüfe eine Grenze mit Fällen darunter, genau darauf und darüber.";

const counters: ExerciseGenerator = {
  id: "werte-verfolgen",
  make(rng, level) {
    const start = rng.int(0, 4);
    const add = rng.int(1, 5);
    const limit = rng.int(2, 7);
    const end = start + (level === 1 ? add : 2 * add);
    return {
      prompt: level === 1
        ? "Verfolge die Zuweisung. Welchen Wert hat <code>punkte</code> nach der Änderung?"
        : "Im Programm läuft die Zuweisung zweimal. Danach lautet die Bedingung <code>punkte ≥ " + limit + "</code>. Bestimme Endwert und Testausgabe.",
      given: [`<code>punkte ← ${start}</code>`, `<code>punkte ← punkte + ${add}</code>`],
      formulaHint: "Lies rechts den alten Wert, addiere und speichere die Summe links.",
      fields: level === 1 ? [numberField("Punkte", end)] : [
        numberField("Punkte", end),
        choiceField(rng, "Testausgabe", end >= limit ? "Ziel erreicht" : "Weiter üben", [end >= limit ? "Weiter üben" : "Ziel erreicht"]),
      ],
      steps: [
        `Nach der ersten Addition stehen ${start + add} Punkte in der Variable.`,
        level === 1 ? `<strong>${end} Punkte</strong>` : `Nach der zweiten Addition sind es ${end}. Vergleiche mit ${limit}: <strong>${end >= limit ? "Ziel erreicht" : "Weiter üben"}</strong>.`,
      ],
    };
  },
};

const lessons = [
  lesson(id, "3", 1, {
    id: "ms7-objekte-methoden", title: "Ein Rover lernt Befehle", subtitle: "Objekte erzeugen, Methoden aufrufen und Reihenfolgen testen",
    why: "Wenn ein Rover zuerst fahren und dann leuchten soll, muss dein Programm diese Reihenfolge festlegen.",
    html: explain([
      "Wiederholung aus Klasse 6: Eine Sequenz ist eine Folge von Anweisungen. Im Struktogramm stehen ihre Blöcke untereinander. Lies sie von oben nach unten. Heute beschreiben die Anweisungen ein Objekt, das du in der Werkstatt erzeugst.",
      "Ein Rover-Objekt hat Attribute wie Position und Lichtzustand. Eine Methode beschreibt, was ein Objekt tun kann. Der Aufruf <code>rover.fahre()</code> ändert die Position dieses Rovers. <code>rover.lichtAn()</code> ändert seinen Lichtzustand. Solche Aufrufe brauchen ein vorhandenes Objekt.",
    ], "Erzeuge den Rover auf Feld 0 mit ausgeschaltetem Licht. Führe <code>rover.lichtAn()</code> aus: Er steht weiterhin auf Feld 0, aber leuchtet. Führe danach <code>rover.fahre()</code> aus: Er steht auf Feld 1 und das Licht bleibt an.", sequenceRule),
    rule: sequenceRule,
    terms: [["Methode", "Aufrufbare Aktion eines Objekts.", "Beispiel: rover.fahre()."], ["Sequenz", "Anweisungen in fester Reihenfolge.", "Im Struktogramm von oben nach unten."], ["Objektzustand", "Die aktuellen Attributwerte eines Objekts.", "Beim Rover etwa Position und Lichtzustand."]],
    quiz: ["Welche Anweisung ändert im Beispiel die Position des Rover-Objekts?", "rover.fahre()", "rover.lichtAn()", "Position ansehen", "Die Methode fahre bewegt den Rover, lichtAn ändert den Lichtzustand."],
    lab: sequenceLab,
    exercises: practice(
      [cc("Der Rover beginnt auf Feld 0. Er führt fahre genau einmal aus. Was ändert sich?", "Die Position wechselt zu Feld 1.", ["Das Licht geht an, die Position bleibt gleich.", "Es entsteht automatisch ein zweiter Rover."], "Der Aufruf hat einen festen Effekt auf dieses Objekt.", "Lies die Bedeutung der Methode."),
       cc("Welche Anweisung muss am Anfang stehen, bevor du eine Methode des Rovers aufrufst?", "Rover erzeugen", ["Rover ein zweites Mal fahren lassen", "Die Endposition ausgeben"], "Ein Methodenaufruf braucht ein vorhandenes Zielobjekt.", "Was braucht der Aufruf vor dem Punkt?")],
      [cc("Zwei Folgen enden mit Rover auf Feld 1 und Licht an. Wie prüfst du, welche zuerst das Licht einschaltet?", "Nach dem ersten Methodenaufruf den Zwischenzustand ansehen.", ["Nur die Endposition vergleichen.", "Die Namen der Programme alphabetisch sortieren."], "Der Unterschied zeigt sich vor dem zweiten Aufruf.", "Beobachte einen Zwischenschritt."),
       cc("Es gibt roverA und roverB. Der Code führt roverB.lichtAn() aus. Was folgt ohne weitere Anweisung?", "Nur das Licht von roverB wechselt auf an.", ["Beide Lichter gehen an.", "Das Licht von roverA geht an."], "Der Name vor dem Punkt benennt das Zielobjekt.", "Lies, an welches Objekt der Aufruf gerichtet ist.")],
      [cc("Welche Reihenfolge lässt den Rover vor der ersten Fahrt leuchten?", "Erzeugen → Licht an → fahren", ["Erzeugen → fahren → Licht an", "Fahren → erzeugen → Licht an"], "Der Lichtzustand ändert sich vor der Bewegung.", "Setze die Vorgabe in eine zeitliche Folge um."),
       cc("Eine Figur wird erzeugt. Danach folgen zwei Aufrufe von fahre. Welches Feld erreicht sie bei Start auf Feld 0?", "Feld 2", ["Feld 1", "Feld 0"], "Jeder Aufruf verschiebt den Zustand um ein Feld.", "Zähle die ausgeführten Aufrufe.")],
      [cc("Ein Programm soll erst fahren, wenn das Licht brennt. Beim ersten Test leuchtet das Licht am Ende, aber bei der Fahrt war es aus. Was änderst du?", "Licht an vor fahre setzen.", ["Licht an löschen.", "Die Endposition von 1 auf 2 umbenennen."], "Der Fehler liegt in der Reihenfolge, nicht im Endzustand.", "Teste die Eigenschaft zum Zeitpunkt der Fahrt."),
       cc("Ein Rover startet auf Feld 2 und soll bis Feld 4. Jede Fahrt erhöht um ein Feld. Ein Test endet auf Feld 3. Welche minimale Korrektur passt?", "Einen weiteren Aufruf von fahre hinzufügen.", ["Licht an ein zweites Mal aufrufen.", "Die Position nur im Ausgabetext 4 nennen."], "Es fehlt genau eine Bewegung.", "Vergleiche den echten mit dem erwarteten Zustand.")],
    ),
  }),
  lesson(id, "3", 2, {
    id: "ms7-bedingung-alternative", title: "Wenn der Weg versperrt ist", subtitle: "Wahr oder falsch, zwei Zweige und passende Testfälle",
    why: "Ein Rover soll je nach Situation unterschiedlich reagieren.",
    html: explain([
      "Eine Bedingung liefert wahr oder falsch, zum Beispiel „Hindernis voraus?“. Eine einseitige Alternative führt bei wahr eine Anweisung aus. Bei falsch geht das Programm danach einfach weiter. Eine zweiseitige Alternative enthält zusätzlich einen Sonst-Zweig.",
      "Im Struktogramm steht die Frage oben und die Zweige liegen nebeneinander. Nur der passende Zweig läuft. Danach geht das Programm unter dem gesamten Block weiter. Teste jeweils einen Fall für wahr und für falsch.",
    ], "Wenn der Sensor ein Hindernis meldet, schaltet der Rover das Licht an und wartet. Sonst fährt er ein Feld weiter. Mit Hindernis erwartest du Feld 0 und Licht an. Ohne Hindernis erwartest du Feld 1. Erst beide Läufe zeigen, ob beide Zweige stimmen.", branchRule),
    rule: branchRule,
    terms: [["Bedingung", "Eine Prüfung mit dem Ergebnis wahr oder falsch.", "Hier: Hindernis voraus?"], ["Alternative", "Ein Block, der nach einer Bedingung verzweigt.", "Ein Sonst-Zweig ist möglich."], ["Testfall", "Eingabe zusammen mit dem erwarteten Ergebnis.", "Teste beide Zweige."]],
    quiz: ["Beim Test ist die Bedingung falsch. Was passiert in einer zweiseitigen Alternative?", "Der Sonst-Zweig läuft.", "Beide Zweige laufen nacheinander.", "Der Ja-Zweig läuft trotzdem zuerst.", "Der Wahrheitswert bestimmt genau einen der beiden Zweige."],
    lab: branchLab,
    exercises: practice(
      [cc("Falls es regnet, öffne den Schirm, sonst setze die Mütze auf. Es regnet. Welche Aktion läuft?", "Schirm öffnen", ["Mütze aufsetzen", "Beide Aktionen ausführen"], "Bei wahr läuft nur der Ja-Zweig.", "Bestimme zuerst den Wahrheitswert."),
       cc("Falls der Weg frei ist, fahre. Es gibt keinen Sonst-Zweig und der Weg ist versperrt.", "Die Fahrt wird übersprungen.", ["Der Rover fährt trotzdem.", "Der Rover erzeugt eine neue Bedingung."], "Bei falsch tut diese Alternative nichts.", "Wie viele Zweige hat der Block?")],
      [cc("Ein Rover wartet mit Hindernis korrekt, fährt ohne Hindernis aber nicht. Welchen Teil kontrollierst du zuerst?", "Den Zweig für frei beziehungsweise falsch bei „Hindernis voraus?“", ["Nur die Anweisung im Zweig mit Hindernis", "Nur das Startsymbol des Struktogramms"], "Der Fehler zeigt sich im Lauf ohne Hindernis.", "Bestimme, welcher Zweig im fehlerhaften Test tatsächlich läuft."),
       cc("Nach den beiden Zweigen steht der Befehl „Meldefeld aktualisieren“ unterhalb des ganzen Blocks. Wann läuft er?", "Nach beiden Arten von Testläufen, jeweils nach dem gewählten Zweig", ["Nur wenn die Bedingung wahr ist", "Nur wenn beide Zweige ausgeführt wurden"], "Die gemeinsame Fortsetzung liegt außerhalb der Alternative.", "Die Blockgrenze zeigt den Geltungsbereich.")],
      [cc("Welche zwei Testfälle prüfen beide Zweige von „Hindernis voraus?“?", "Ein Test mit Hindernis und ein Test ohne Hindernis", ["Zwei Tests ohne Hindernis", "Zwei Tests mit Hindernis"], "Die Bedingung muss einmal wahr und einmal falsch sein.", "Wähle absichtlich verschiedene Eingaben."),
       cc("Bei einem Hindernis soll der Rover warten. Welcher Teil gehört in den Ja-Zweig?", "rover.warte()", ["rover.fahre()", "Den Rover löschen"], "Wenn die Meldung stimmt, soll er warten.", "Formuliere „wenn wahr, dann …“.")],
      [cc("Das Programm prüft „Weg frei?“. Was ist im Vergleich zu „Hindernis voraus?“ für dieselbe Regel zu ändern?", "Fahren gehört nun in den Ja-Zweig, warten in den Sonst-Zweig.", ["Die Zweige bleiben wortgleich, weil jede Bedingung wahr ist.", "Es müssen stets beide Zweige ausgeführt werden."], "Die neue Frage hat für dieselbe Lage den umgekehrten Wahrheitswert.", "Vergleiche die Fragen im Fall eines freien Wegs."),
       cc("Zwei unterschiedliche Eingaben erzeugen versehentlich beide die Ausgabe „Warten“. Wie findest du den Fehler am besten?", "Schrittweise verfolgen, welchen Zweig jeder Test wirklich ausführt.", ["Nur die Fehlermeldungen löschen.", "Beide Tests mit exakt derselben Eingabe wiederholen."], "Die Schritte zeigen, ob die Prüfung oder eine Zweiganweisung falsch ist.", "Halte bei der Bedingung und beim Aufruf an.")],
    ),
  }),
  lesson(id, "3", 3, {
    id: "ms7-wiederholung-schachtelung", title: "Mit Schleifen Marken sammeln", subtitle: "Wiederholung, Schachtelung und Struktogramme",
    why: "Eine kurze Schleife kann mehrere Felder nacheinander bearbeiten und jedes Feld neu prüfen.",
    html: explain([
      "Eine gezählte Wiederholung führt einen Block eine festgelegte Anzahl von Malen aus. Bei einer bedingten Wiederholung kann stattdessen eine Prüfung entscheiden, ob ein weiterer Durchlauf startet. Bei einer kopfgesteuerten Schleife kann der Block dadurch auch kein einziges Mal laufen.",
      "Schachteln heißt, eine Struktur in eine andere einzubauen. Steht die Alternative im Schleifenblock, wird ihre Bedingung pro Durchlauf geprüft. Steht sie unter dem Block, wird sie nach allen Durchläufen einmal geprüft. Im Struktogramm zeigen Umrandung und Einrückung, welche Anweisungen dazugehören.",
    ], "Starte auf Feld 0. Wiederhole dreimal: Fahre ein Feld, prüfe dann „Ist hier eine Marke?“. Sammle sie nur bei Ja. Marken liegen auf Feld 1 und 3. Der Rover endet auf Feld 3 mit zwei Marken, weil die Bedingung auf jedem neuen Feld geprüft wurde.", loopRule),
    rule: loopRule,
    terms: [["Wiederholung", "Ein Block läuft mehrfach.", "Gezählt oder von einer Bedingung gesteuert."], ["Durchlauf", "Einmal den gesamten Schleifenblock abarbeiten.", "Eingeschachtelte Prüfungen gehören dazu."], ["Struktogramm", "Blockdarstellung für den Aufbau eines Programms.", "Ein Rahmen zeigt zusammengehörige Anweisungen."]],
    quiz: ["Der Rover fährt in vier Durchläufen je ein Feld und prüft in jedem Durchlauf auf eine Marke. Wie oft prüft er?", "Viermal", "Einmal am Ende", "Nur wenn wirklich eine Marke da ist", "Die Prüfung steht im Schleifenblock und läuft bei jedem Durchlauf."],
    lab: loopLab,
    exercises: practice(
      [cc("Der Rover startet auf Feld 0 und wiederholt fahre dreimal.", "Feld 3", ["Feld 1", "Feld 4"], "In jedem der drei Durchläufe kommt ein Feld dazu.", "Zähle die Durchläufe."),
       cc("Eine gezählte Schleife wiederholt „fahr, prüfe“ zweimal. Wie oft prüft der Rover?", "Zweimal", ["Einmal", "Viermal"], "Jeder Durchlauf enthält genau eine Prüfung.", "Zähle nur den Prüfblock.")],
      [cc("Der Rover fährt dreimal, prüft aber erst nach der Schleife. Marken sind auf Feld 1 und 3. Wie viele Marken sammelt er bei Start auf Feld 0?", "Eine Marke auf Feld 3", ["Zwei Marken auf Feld 1 und 3", "Keine Marke, weil die Fahrt endet"], "Die einmalige Prüfung findet auf dem Endfeld statt.", "Steht die Prüfung innerhalb oder unterhalb des Rahmens?"),
       cc("Eine Schleife soll laufen, solange noch Platz frei ist. Der Platz ist beim Start schon voll. Die Prüfung steht vor dem Schleifenblock.", "Kein Durchlauf", ["Genau ein Durchlauf", "Der Block läuft auf jeden Fall zweimal"], "Die kopfgesteuerte Schleife prüft vor dem ersten Durchlauf.", "Wann wird die erste Bedingung geprüft?")],
      [cc("Der Rover fährt je ein Feld und prüft dann innerhalb der Schleife. Er macht zwei Durchläufe von Feld 0 aus. Marken sind auf Feld 1 und 3.", "Er sammelt eine Marke.", ["Er sammelt zwei Marken.", "Er sammelt keine Marke."], "Er prüft die Felder 1 und 2.", "Notiere das Feld nach jedem Fahraufruf."),
       cc("Du möchtest in jedem Durchlauf nach der Fahrt das Licht einschalten. Wohin kommt der Aufruf?", "Innerhalb des Schleifenblocks nach der Fahrt", ["Unterhalb des gesamten Schleifenblocks", "Vor dem Schleifenblock"], "Nur innerhalb des Blocks wird der Aufruf mit wiederholt.", "Achte auf die Begrenzung des Blocks.")],
      [cc("Der Rover prüft zuerst das Feld und fährt dann in jedem von drei Durchläufen weiter. Er startet auf Feld 0. Marken liegen auf Feld 1 und 3. Was sammelt er?", "Nur die Marke auf Feld 1", ["Beide Marken", "Nur die Marke auf Feld 3"], "Er prüft die Felder 0, 1 und 2. Auf Feld 3 fährt er erst am Ende.", "Schreibe für jede Runde erst Prüfung und dann Fahrt auf."),
       cc("Äußere Schleife: zweimal. Darin läuft eine innere Schleife dreimal mit je einer Prüfung. Wie viele Prüfungen finden statt?", "Sechs Prüfungen", ["Fünf Prüfungen", "Drei Prüfungen"], "Die drei inneren Prüfungen laufen für jeden der zwei äußeren Durchläufe.", "Denke an zwei vollständige Dreiergruppen.")],
    ),
  }),
  lesson(id, "3", 4, {
    id: "ms7-variablen-grenztest", title: "Variablen und der Test an der Grenze", subtitle: "Bezeichner, Datentypen, Zuweisungen und Debuggen",
    why: "Schon ein fehlendes Gleichheitszeichen in einer Bedingung kann genau den Fall am Zielwert falsch behandeln.",
    html: explain([
      "Eine Variable hat einen Bezeichner wie <code>punkte</code>. Ihr Wert kann sich ändern. Ein Datentyp beschreibt, welche Art von Werten möglich ist: Eine Ganzzahl kann zum Beispiel 0 oder 3 sein. Ein Text enthält Zeichen. Ein Wahrheitswert ist wahr oder falsch.",
      "Im Struktogramm steht <code>punkte ← punkte + 1</code> für eine Zuweisung. Zuerst wird rechts der bisherige Wert gelesen und 1 dazugezählt. Danach wird links der neue Wert gespeichert. Eine Bedingung wie <code>punkte ≥ 3</code> liest den Wert und entscheidet, sie verändert ihn nicht.",
      "Beim Debuggen vergleichst du beobachtete und erwartete Ergebnisse. Teste die kleinsten Fälle, an denen sich zwei Regeln unterscheiden. Passe die Bedingung an und führe auch die zuvor erfolgreichen Fälle erneut aus.",
    ], "Die Ausgabe soll ab 3 Punkten „Ziel erreicht“ lauten. Bei 2 Punkten erwartest du „Weiter üben“, bei 3 und 4 „Ziel erreicht“. Der Ausdruck <code>punkte &gt; 3</code> scheitert bei 3, während <code>punkte ≥ 3</code> alle drei Erwartungen erfüllt.", variableRule),
    rule: variableRule,
    terms: [["Bezeichner", "Name einer Variable.", "Beispiel: punkte."], ["Datentyp", "Art zulässiger Werte.", "Ganzzahl, Text oder Wahrheitswert."], ["Grenztest", "Test direkt am Wechsel des erwarteten Ergebnisses.", "Hier: 2, 3 und 4 Punkte."]],
    quiz: ["Der alte Wert von punkte ist 2. Was steht danach in punkte, wenn punkte ← punkte + 1 läuft?", "3", "2", "Der Text „punkte + 1“", "Erst ausrechnen, dann den neuen Wert links speichern."],
    lab: variableLab,
    exercises: [
      counters,
      cases("datentypen-tests",
        [cc("Welche Art von Wert ist „Ziel erreicht“ in einer Ausgabevariable?", "Text", ["Ganzzahl", "Wahrheitswert"], "Die Meldung besteht aus Zeichen.", "Was genau steht in der Variable?"),
         cc("Bei wert ← 5: Was ist der Bezeichner?", "wert", ["5", "Ganzzahl"], "Der Bezeichner ist der Name links vom Pfeil.", "Unterscheide Name, Wert und Typ.")],
        [cc("Ein Programm soll bei mindestens 8 Schritten „Fertig“ anzeigen. Welche Testgruppe findet den typischen Grenzfehler?", "7, 8 und 9 Schritte testen", ["Nur 10, 11 und 12 Schritte testen", "Nur 1, 2 und 3 Schritte testen"], "Genau bei 8 unterscheiden sich „größer als“ und „mindestens“.", "Prüfe auch den ersten Wert, bei dem sich die Ausgabe ändern soll."),
         cc("Ein Punktezähler soll 4 Punkte anzeigen, doch er zeigt den Text „2“ gefolgt von „2“ als „22“. Wie muss das Programm die gespeicherten Werte behandeln?", "Als Zahlen addieren.", ["Als Texte zusammenhängen.", "Beide Textwerte umbenennen."], "Die Art der Werte entscheidet, ob das Plus addiert oder Text verbindet.", "Vergleiche Rechnen und Zusammenfügen.")]
      ),
    ],
  }),
];

export const STAGE_PROGRAMMIERUNG: Stage = {
  id, stageNumber: 3, title: "Programmieren", subtitle: "Rover steuern, Abläufe verzweigen und Programme testen",
  icon: ">_", accent: "indigo", badgeTitle: "Programme getestet", lehrplanLabel: "R7 und M7 · Inf7 LB 3", module: "3", lessons,
};
