import { robotLab } from "../lab/robot";
import type { Stage } from "../model/types";
import { cc, drills, explain, lesson } from "./helpers";

const id = "algorithmen";
const module = "2.3";
const sequence = "Eine Sequenz führt eindeutige Anweisungen in einer festgelegten Reihenfolge aus.";
const branch =
  "Bei WENN–DANN läuft der Block nur bei wahrer Bedingung. Mit SONST gibt es auch für falsch einen eigenen Zweig.";
const count =
  "Eine Zählschleife führt ihren gesamten Schleifenblock genau so oft aus, wie die feste Zahl angibt.";
const until =
  "Eine SOLANGE-Schleife prüft die Bedingung vor jedem Durchlauf. Ist sie schon beim Start falsch, läuft der Block kein einziges Mal.";

export const STAGE_ALGORITHMEN: Stage = {
  id,
  module,
  stageNumber: 3,
  icon: "🤖",
  accent: "#6d28d9",
  title: "Abläufe programmieren",
  subtitle: "Anweisungen ordnen, Bedingungen testen und Schleifen steuern.",
  badgeTitle: "Programme lesen und bauen",
  lehrplanLabel: "NT7 2.3 · ca. 11 Std.",
  lessons: [
    lesson(id, module, 1, {
      id: "inf7-sequenz",
      title: "Anweisung und Sequenz",
      subtitle: "Vom Problem zum nachvollziehbaren Programm",
      why: "Ein Roboter kann nur ausführen, was du ihm eindeutig vorgibst.",
      html: explain(
        [
          "Ein <strong>Algorithmus</strong> ist eine eindeutig beschriebene, ausführbare Vorgehensweise. Sie löst eine Aufgabe in endlich vielen Schritten für die vorgesehenen Eingaben. Eine <strong>Anweisung</strong> ist ein einzelner ausführbarer Schritt. Mehrere Anweisungen in fester Reihenfolge bilden eine <strong>Sequenz</strong>.",
          "Beschreibe zuerst Startlage und Ziel. Zerlege den Weg in kleine Schritte, die dein Werkzeug kennt. Bau daraus ein Programm und führe es mit einem konkreten Startzustand aus. Halte nach jedem Schritt fest, was sich geändert hat.",
          "Prüfe bei einem Fehler die erste Stelle, an der der tatsächliche Zustand vom geplanten Zustand abweicht.",
        ],
        "Der Roboter steht links unten. Direkt darüber liegt eine Wand. „Rechts, hoch, markieren“ erreicht und markiert das Zielfeld. „Hoch, rechts, markieren“ kommt gleich beim ersten Schritt an die Wand.",
        sequence,
      ),
      rule: sequence,
      terms: [
        [
          "Algorithmus",
          "Eindeutiges, ausführbares Vorgehen",
          "Die vorgesehenen Fälle enden nach endlich vielen Schritten.",
        ],
        ["Anweisung", "Ein ausführbarer Schritt", "Beispiel: Gehe ein Feld nach rechts."],
      ],
      quiz: [
        "Warum kann die Reihenfolge bei denselben Blöcken wichtig sein?",
        "Jeder Block beginnt mit dem Zustand, den der vorherige hinterlässt.",
        "Die Blöcke laufen immer gleichzeitig.",
        "Die Reihenfolge ändert nur den Text im Editor.",
        "Die Ausgangslage des nächsten Befehls hängt davon ab, was davor passiert ist.",
      ],
      lab: robotLab("sequence"),
      exercises: drills(
        [
          cc(
            "Welche Anweisung versteht der Roboter direkt?",
            "Gehe ein Feld nach rechts.",
            ["Geh irgendwie zum Ziel.", "Mach es schöner."],
            "Der Befehl gibt Richtung und Schrittweite eindeutig an.",
            "Wähle nur einen ausführbaren Schritt.",
          ),
          cc(
            "Zwei Personen deuten „geh ein Stück weiter“ verschieden. Wie machst du den Befehl eindeutig?",
            "Gehe von deinem Feld zwei Felder nach rechts.",
            ["Bewege dich schön schnell.", "Versuche, das Ziel zu finden."],
            "Richtung und Anzahl bestimmen denselben Schritt für beide.",
            "Nenne, von wo, wohin und wie weit.",
          ),
        ],
        [
          cc(
            "Was muss beim Gießen vor „Gießkanne ausleeren“ passieren?",
            "Gießkanne füllen",
            ["Gießkanne erneut ausleeren", "Gießkanne wieder abstellen"],
            "Die Anweisung setzt eine gefüllte Kanne voraus.",
            "Welche Voraussetzung muss vorher gelten?",
          ),
          cc(
            "An der Leihstation kann die Ausgabe erst nach dem Scannen der Karte starten. Welche Folge passt?",
            "Karte scannen, Ausgabe starten, Gegenstand entnehmen.",
            [
              "Gegenstand entnehmen, Ausgabe starten, Karte scannen.",
              "Ausgabe starten, Gegenstand entnehmen, Karte scannen.",
            ],
            "Scannen erlaubt die Ausgabe. Entnommen wird danach.",
            "Ordne die Schritte nach ihren Voraussetzungen.",
          ),
        ],
        [
          cc(
            "Der Roboter fährt gegen die Wand, obwohl das Ziel frei ist. Wo suchst du zuerst?",
            "Beim ersten Schritt, der vom geplanten Weg abweicht.",
            ["Nur beim letzten Markierungsblock.", "Beim Namen des Programms."],
            "Die erste Abweichung zeigt am ehesten die Ursache.",
            "Vergleiche den Weg Schritt für Schritt.",
          ),
          cc(
            "Ein Regalroboter stellt das Buch in das falsche Fach. Der Zustandsplan zeigt: Schon nach Schritt zwei steht er zu weit rechts. Was prüfst du zuerst?",
            "Die Bewegung in Schritt zwei und ihre Startposition.",
            ["Den Ton nach dem Abstellen.", "Den Text auf dem Buchrücken."],
            "Die Bewegung veränderte die Position vor dem eigentlichen Abstellen.",
            "Finde den ersten abweichenden Zustand.",
          ),
        ],
      ),
    }),
    lesson(id, module, 2, {
      id: "inf7-verzweigung",
      title: "Wenn, dann und sonst",
      subtitle: "Einseitige und zweiseitige bedingte Anweisungen",
      why: "Dasselbe Programm kann auf unterschiedliche Situationen passend reagieren.",
      html: explain(
        [
          "Eine <strong>Bedingung</strong> ist eine prüfbare Aussage. Ihr Ergebnis ist wahr oder falsch. Bei einer einseitig bedingten Anweisung gibt es einen Dann-Zweig. Bei falsch wird er übersprungen.",
          "Eine zweiseitig bedingte Anweisung hat zusätzlich einen Sonst-Zweig. Genau einer der beiden Zweige läuft. Danach geht es mit der nächsten gemeinsamen Anweisung weiter.",
          "Teste jede Entscheidung mit mindestens zwei passenden Eingaben. Eine macht die Bedingung wahr, die andere falsch. Vergleiche den tatsächlich gewählten Zweig mit deiner Erwartung.",
        ],
        "Wenn rechts eine Wand ist, fährt der Roboter nach oben. Ergänzt du „sonst fahre nach rechts“, fährt er auch bei freiem Weg los. Ohne den Sonst-Zweig wird bei freiem Weg kein Bewegungsblock in dieser Verzweigung ausgeführt.",
        branch,
      ),
      rule: branch,
      terms: [
        ["Bedingung", "Prüfung mit Ergebnis wahr oder falsch", "Beispiel: Der Weg ist blockiert."],
        [
          "Zweig",
          "Anweisung oder Anweisungsfolge für einen Fall",
          "Bei WENN–DANN–SONST läuft genau ein Zweig.",
        ],
      ],
      quiz: [
        "Welche Anweisung läuft bei falscher Bedingung in WENN–DANN–SONST?",
        "Die Anweisung im Sonst-Zweig",
        "Die Anweisung im Dann-Zweig",
        "Beide Zweige",
        "Der Sonst-Zweig gehört genau zum Fall, in dem die angegebene Bedingung falsch ist.",
      ],
      lab: robotLab("branch"),
      exercises: drills(
        [
          cc(
            "WENN es regnet, DANN Schirm einpacken. Es ist trocken. Was passiert in diesem Block?",
            "Der Block packt keinen Schirm ein.",
            ["Der Block packt immer einen Schirm ein.", "Das Programm beginnt von vorn."],
            "Die Bedingung ist falsch und es gibt keinen Sonst-Zweig.",
            "Prüfe zuerst die Bedingung.",
          ),
          cc(
            "Eine Anlage soll bei leerem Behälter nachfüllen und sonst nichts ändern. Welche Struktur genügt?",
            "WENN leer, DANN nachfüllen.",
            ["Wiederhole immer fünfmal nachfüllen.", "WENN voll, DANN nachfüllen."],
            "Nur der ausdrücklich genannte Fall soll etwas auslösen.",
            "Überlege, ob der falsche Fall eine eigene Aktion braucht.",
          ),
        ],
        [
          cc(
            "WENN Licht an, DANN abschalten, SONST einschalten. Das Licht ist aus. Was geschieht?",
            "Das Licht wird eingeschaltet.",
            ["Das Licht wird ausgeschaltet.", "Es wechselt zweimal."],
            "Die Bedingung ist falsch. Der Sonst-Zweig läuft.",
            "Lies den Zustand vor der Prüfung.",
          ),
          cc(
            "Eine Anzeigetafel soll für freie Plätze grün leuchten, bei voller Halle rot. Welche Lösung zeigt für jeden Fall eine Farbe?",
            "WENN es einen freien Platz gibt, DANN grün, SONST rot.",
            [
              "WENN es einen freien Platz gibt, DANN grün, danach immer rot.",
              "Zuerst grün und gleich danach rot.",
            ],
            "Die beiden Fälle sind getrennt, und genau eine Anzeige wird gesetzt.",
            "Ordne jeder Bedingungslage genau eine Ausgabe zu.",
          ),
        ],
        [
          cc(
            "Welche beiden Tests decken die Bedingung „Tür geschlossen“ ab?",
            "Eine geschlossene und eine offene Tür",
            ["Zwei geschlossene Türen", "Zwei offene Türen"],
            "Die Tests liefern einmal wahr und einmal falsch.",
            "Teste beide möglichen Wahrheitswerte.",
          ),
          cc(
            "Der Roboter funktioniert bei freiem Weg. Womit prüfst du den ungetesteten Zweig?",
            "Ein Hindernis rechts einsetzen und die Ausweichbewegung beobachten.",
            ["Noch einmal mit freiem Weg starten.", "Den freien Weg mit einer anderen Farbe markieren."],
            "Nur ein Hindernis macht die gegebene Bedingung wahr.",
            "Ändere genau den Eingangswert, der für die Bedingung zählt.",
          ),
        ],
      ),
    }),
    lesson(id, module, 3, {
      id: "inf7-feste-schleife",
      title: "Wiederholen mit fester Anzahl",
      subtitle: "Gleiche Abläufe mit einer Zählschleife beschreiben",
      why: "Mit einem Block kannst du eine Reihe gleicher Arbeitsschritte übersichtlich programmieren.",
      html: explain(
        [
          "Eine <strong>Wiederholung mit fester Anzahl</strong> passt, wenn vor dem Start klar ist, wie oft ein Ablauf ausgeführt werden soll. In der Klammer der Schleife steht ihr <strong>Schleifenblock</strong>. Alle Anweisungen darin gehören zu jedem Durchlauf.",
          "Schritte nach der Klammer laufen erst, wenn die Schleife fertig ist. Deshalb hängt es von der Platzierung ab, ob etwa ein Signal nach jeder Bewegung oder einmal am Ende erklingt.",
          "Verfolge im Simulator mindestens den ersten und letzten Durchlauf. Vergleiche Schrittzahl und Endzustand mit deiner Vorhersage.",
        ],
        "„Wiederhole dreimal: nach rechts. Danach markieren.“ führt zu drei Rechtsbewegungen und genau einer Markierung. Rückt die Markierung in den Schleifenblock, folgt in jedem Durchlauf auf die Bewegung eine Markierung.",
        count,
      ),
      rule: count,
      terms: [
        [
          "Schleifenblock",
          "Anweisungsfolge in der Wiederholung",
          "Reihenfolge bleibt bei jedem Durchlauf gleich.",
        ],
        [
          "Durchlauf",
          "Einmalige Ausführung des gesamten Schleifenblocks",
          "Eine Wiederholung mit fester Anzahl legt die Zahl im Voraus fest.",
        ],
      ],
      quiz: [
        "Was wird bei dreimal [rechts, markieren] ausgeführt?",
        "Dreimal je eine Rechtsbewegung und eine Markierung.",
        "Dreimal rechts und genau einmal markieren.",
        "Eine Rechtsbewegung und dreimal markieren.",
        "Rechts und markieren stehen beide innerhalb des Schleifenblocks und laufen daher in jedem Durchlauf.",
      ],
      lab: robotLab("count"),
      exercises: drills(
        [
          cc(
            "Wiederhole viermal „gehe ein Feld vor“. Wie viele Felder gehst du?",
            "Vier Felder",
            ["Drei Felder", "Ein Feld"],
            "Der einzelne Schritt läuft viermal.",
            "Multipliziere die Schritte pro Durchlauf mit der Anzahl.",
          ),
          cc(
            "Eine Maschine soll fünf gleiche Schilder drucken. Welche Struktur bleibt leicht auf sieben änderbar?",
            "Wiederhole fünfmal den Druck eines Schildes.",
            [
              "Schreibe fünf einzelne Druckbefehle mit verschiedenen Namen.",
              "Drucke einmal und warte auf einen unbekannten Fehler.",
            ],
            "Du änderst lediglich die Zahl im Schleifenkopf.",
            "Suche, wo die Zahl an einer einzigen Stelle steht.",
          ),
        ],
        [
          cc(
            "Wiederhole zweimal [A, B]. Welche Folge entsteht?",
            "A, B, A, B",
            ["A, A, B, B", "A, B, B, A"],
            "Der ganze Block A, B wiederholt sich in derselben Reihenfolge.",
            "Schreibe erst den ersten vollständigen Durchlauf.",
          ),
          cc(
            "Ein Roboter geht in jedem Durchlauf zwei Felder vor. Bei drei Durchläufen blinkt er am Ende einmal. Was passt?",
            "Wiederhole dreimal [zwei Felder vor], dann blinke.",
            [
              "Wiederhole dreimal [zwei Felder vor, blinke].",
              "Gehe zwei Felder vor, danach blinke dreimal.",
            ],
            "Das Blinken steht außerhalb der Schleife und läuft einmal.",
            "Markiere die Grenze des wiederholten Blocks.",
          ),
        ],
        [
          cc(
            "Nach zwei Durchläufen mit einem Feld pro Durchlauf stehst du wie weit vom Start?",
            "Zwei Felder",
            ["Null Felder", "Vier Felder"],
            "Jeder Durchlauf verschiebt dich um ein Feld.",
            "Zähle die Zustandsänderungen pro Durchlauf.",
          ),
          cc(
            "Zwei Drehungen gehören zu einer Runde. Das Protokoll zeigt acht Drehungen. Wie viele Runden waren es?",
            "Vier Runden",
            ["Zwei Runden", "Acht Runden"],
            "Acht Aktionen geteilt durch zwei je Runde sind vier Durchläufe.",
            "Unterscheide einzelne Aktionen und vollständige Schleifenrunden.",
          ),
        ],
      ),
    }),
    lesson(id, module, 4, {
      id: "inf7-bedingte-schleife",
      title: "Wiederholen mit Bedingung",
      subtitle: "Solange ein Ziel fehlt, prüft und läuft das Programm weiter",
      why: "Wenn sich die Ausgangslage ändert, muss das Programm selbst entscheiden, wann es anhält.",
      html: explain(
        [
          "Eine <strong>Wiederholung mit Bedingung</strong> prüft, ob ein weiterer Durchlauf nötig ist. Bei der hier verwendeten SOLANGE-Schleife passiert das vor jedem Durchlauf. Ist die Bedingung wahr, wird der Block ausgeführt. Ist sie falsch, geht es danach weiter.",
          "Damit sie endet, muss sich etwas an der geprüften Situation ändern. Wenn der Roboter beim Gehen der Marke näher kommt, kann „Ziel fehlt“ falsch werden. Ein Block, der nur an Ort und Stelle markiert, bringt ihn der entfernten Marke nicht näher.",
          "Teste einen nahen, einen fernen und den Startfall, in dem die Bedingung sofort falsch ist. Das Modell begrenzt wirkungslose Wiederholungen auf fünf Durchläufe.",
        ],
        "„Solange Zielmarke nicht erreicht: ein Feld nach rechts“ fährt zwei Schritte bis zur nahen Marke und vier bis zur fernen Marke. Steht der Roboter bereits auf der Marke, führt er den Block kein einziges Mal aus.",
        until,
      ),
      rule: until,
      terms: [
        [
          "SOLANGE",
          "Bedingung vor jedem Durchlauf prüfen",
          "Der Block bekommt keinen Durchlauf, wenn die Prüfung sofort falsch ist.",
        ],
        ["Abbruch", "Die Bedingung ist falsch", "Der folgende Teil des Programms übernimmt."],
      ],
      quiz: [
        "Was geschieht, wenn der Roboter schon auf der Zielmarke steht?",
        "Er führt den Schleifenblock keinmal aus.",
        "Er führt den Block sicher einmal aus.",
        "Er läuft unabhängig von der Bedingung fünfmal.",
        "Die Prüfung findet zuerst statt. „Ziel fehlt“ ist bereits falsch.",
      ],
      lab: robotLab("until"),
      exercises: drills(
        [
          cc(
            "SOLANGE noch ein Platz frei ist: belege einen Platz. Es sind bereits alle voll. Wie oft läuft der Block?",
            "Keinmal",
            ["Einmal", "Immer wieder"],
            "Die Bedingung ist beim ersten Prüfen falsch.",
            "Betrachte die Lage vor der ersten Ausführung.",
          ),
          cc(
            "Ein Reinigungsroboter fährt bis zur nächsten Markierung. Ihr Abstand variiert. Welche Struktur passt?",
            "Solange die Markierung fehlt: einen Schritt vorwärts.",
            ["Gehe immer drei Schritte.", "Drehe dich, solange die Markierung fehlt."],
            "Die Zahl der Schritte folgt dem Zustand. Das Vorwärtsgehen kann ihn ändern.",
            "Wähle eine Prüfung, die das wechselnde Ziel erfasst.",
          ),
        ],
        [
          cc(
            "Der Block soll bei erreichter Marke enden. Welche Bedingung lässt ihn bis dahin laufen?",
            "Marke noch nicht erreicht",
            ["Marke bereits erreicht", "Marke ist absichtlich ausgeschaltet"],
            "Vor dem Ziel ist die Bedingung wahr, am Ziel falsch.",
            "Formuliere, wann der Block weiterlaufen soll.",
          ),
          cc(
            "Eine Pumpe soll auffüllen, bis der Behälter voll ist. Das aktuelle Programm lautet „Solange voll: pumpen“. Wie korrigierst du es?",
            "Solange noch Platz im Behälter ist: pumpen.",
            ["Solange voll: warten und pumpen.", "Pumpe auch bei vollem Behälter mindestens einmal."],
            "Bei Platz startet die Pumpe, bei erreichtem Ziel endet die Schleife.",
            "Setze Durchlaufbedingung und Endzustand in Beziehung.",
          ),
        ],
        [
          cc(
            "Der Roboter bleibt stehen und prüft wiederholt „Ziel fehlt“. Wodurch kann die Schleife enden?",
            "Ein Schritt in Richtung Ziel ändert die Lage.",
            [
              "Der Schleifenname erhält einen Punkt.",
              "Der Roboter wiederholt dieselbe Prüfung ohne Handlung.",
            ],
            "Wenn er das Ziel erreicht, wird die Bedingung falsch.",
            "Eine Aktion muss die geprüfte Lage verändern.",
          ),
          cc(
            "Ein Stapel enthält vier Karten. „Solange der Stapel nicht leer ist: schau auf die oberste Karte“ beendet sich nicht. Was ergänzt du?",
            "Entferne die betrachtete Karte in jedem Durchlauf.",
            [
              "Benenne den Stapel nach seiner Farbe.",
              "Füge nach jedem Blick eine weitere Karte auf den Stapel.",
            ],
            "Jeder Durchlauf macht den Stapel kleiner, bis er leer ist.",
            "Verringere in jedem Durchlauf die Menge, die geprüft wird.",
          ),
        ],
      ),
    }),
  ],
};
