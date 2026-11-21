import { caseLab } from "../lab/case-lab";
import { timeline } from "../lab/diagrams";
import type { Stage } from "../model/types";
import { cc, drills, explain, lesson } from "./helpers";
import { planVariants, saveVariants } from "./practice-project";

const id = "projekt";
const module = "2.4";
const planning =
  "Plant ein überprüfbares Ergebnis, klare Zuständigkeiten, Übergaben und Zeit zum Testen.";
const snapshots =
  "Speichere Zwischenstände mit eindeutigen Versionsnamen. Dokumentiere Änderung, Test und nächsten Schritt.";

export const STAGE_PROJEKT: Stage = {
  id,
  module,
  stageNumber: 4,
  icon: "🧩",
  accent: "#9a450f",
  title: "Ein Teamprojekt umsetzen",
  subtitle: "Ein Versuchs-Wiki planen, testen und Zwischenstände sichern.",
  badgeTitle: "Vom Plan zum Ergebnis",
  lehrplanLabel: "NT7 2.4 · ca. 4 Std.",
  lessons: [
    lesson(id, module, 1, {
      id: "inf7-projekt-planen",
      title: "Ein Versuchs-Wiki planen",
      subtitle: "Zeitfenster, Arbeitsteilung und Übergaben",
      why: "Mit einem gemeinsamen Plan weiß jede Person, was sie beitragen und wann sie es übergeben soll.",
      html: explain(
        [
          "Entwickelt im Team in 40 Minuten ein dreiseitiges Versuchs-Wiki zur Frage „Wie entsteht ein Schatten?“. Die Startseite stellt die Frage. Eine Seite beschreibt Aufbau und Beobachtung aus dem Physikunterricht. Die dritte Seite zeigt eine Erklärungsskizze und erklärt Kern- und Halbschatten. Verlinkt zwischen den Seiten und nennt verwendete Quellen.",
          "Einigt euch auf drei überprüfbare Ziele: alle Seiten erreichbar, jede Beobachtung von der Erklärung getrennt und jede fremde Abbildung mit geklärter Freigabe und Herkunft. Verteilt Aufgaben und klärt, wer das jeweilige Ergebnis als Nächstes braucht.",
          'Nutzt den <a href="#lesson=inf7-wiki-editor">Wiki-Editor</a> als Vorlage. Sammelt im Unterricht die Arbeitsergebnisse im freigegebenen Werkzeug. Nutzt die letzte Phase zum Durchklicken, Korrigieren und Vorstellen.',
        ],
        "Sam skizziert Start, Aufbau und Erklärung. Kim setzt die Links und die Seiten im Editor. Jo prüft, ob ältere Links und Quellen noch stimmen, und meldet Korrekturen mit Seite und Fundstelle zurück.",
        planning,
      ),
      rule: planning,
      terms: [
        [
          "Arbeitsteilung",
          "Zuständigkeiten mit Ergebnis festlegen",
          "Wer macht was und übergibt es an wen?",
        ],
        [
          "Meilenstein",
          "Prüfbares Zwischenergebnis zu einer bestimmten Zeit",
          "Beispiel: Die drei Seiten und ihre Verweise sind skizziert.",
        ],
      ],
      quiz: [
        "Was sagt ein sinnvoller erster Meilenstein?",
        "Nach zehn Minuten sind drei Seiten und ihre Verweise skizziert.",
        "Irgendwann macht jemand etwas.",
        "Das Projekt dauert möglichst lange.",
        "Ein Meilenstein benennt ein sichtbares Ergebnis und einen prüfbaren Zeitpunkt.",
      ],
      lab: timeline,
      exercises: drills(
        planVariants,
        [
          cc(
            "Was ist ein überprüfbares Projektziel?",
            "Drei Seiten sind über getestete Links erreichbar.",
            ["Das Wiki wird irgendwie schön.", "Alle sollen sehr schnell sein."],
            "Die Anzahl und die Erreichbarkeit lassen sich prüfen.",
            "Formuliere etwas, das eine andere Person testen kann.",
          ),
          cc(
            "Ein Team hat nur 40 Minuten und plant sechs Seiten. Was hilft am meisten?",
            "Drei notwendige Seiten festlegen und Zeit für den Test reservieren.",
            ["Bis zum Ende weitere Seiten sammeln.", "Den Test aus dem Plan streichen."],
            "Der reduzierte Umfang ermöglicht ein brauchbares und geprüftes Ergebnis.",
            "Entscheide, was zum Mindestziel gehört.",
          ),
        ],
        [
          cc(
            "Wer braucht den Plan der Verweise?",
            "Die Person, die die Links einsetzt",
            ["Nur Besucher nach der Abgabe", "Niemand"],
            "Die Linkziele werden aus dem Plan übernommen.",
            "Suche nach der unmittelbar abhängigen Aufgabe.",
          ),
          cc(
            "Jemand erstellt Inhalte, jemand anderes setzt Links. Was bei der Übergabe hilft?",
            "Eine Liste stabiler Seitennamen mit vorgesehenen Verweisen.",
            ["Nur ein mündliches „fertig“ ohne Angaben.", "Eine zufällige Reihenfolge der Texte."],
            "Die Zuordnung verhindert Links auf falsche Ziele.",
            "Nenne, welche Information die nächste Person braucht.",
          ),
        ],
        [
          cc(
            "Wann kannst du den vollständigen Linktest durchführen?",
            "Sobald Seiten und Verweise umgesetzt sind.",
            ["Nur vor der Skizze.", "Sobald der Projekttitel gewählt ist."],
            "Der vollständige Test braucht die tatsächlich verlinkten Seiten.",
            "Prüfe, welche Ergebnisse vorher vorliegen müssen.",
          ),
          cc(
            "Ein Teammitglied fällt beim Test aus. Wie bleibt der Plan umsetzbar?",
            "Die Links mit vorhandener Checkliste neu verteilen und Zuständigkeiten nennen.",
            ["Die Verantwortung stillschweigend offenlassen.", "Den gesamten Zeitplan löschen."],
            "Die Checkliste hält das Ergebnis überprüfbar, auch wenn die Person wechselt.",
            "Ersetze die Zuständigkeit und behalte die Testaufgabe.",
          ),
        ],
      ),
    }),
    lesson(id, module, 2, {
      id: "inf7-projekt-sichern",
      title: "Zwischenstände sichern und testen",
      subtitle: "Versionen vergleichen und Änderungen festhalten",
      why: "Mit gesicherten und beschriebenen Ständen kannst du einen Fehler eingrenzen oder einen funktionierenden Stand wieder öffnen.",
      html: explain(
        [
          'Speichere zu den Meilensteinen einen eigenen Zwischenstand, zum Beispiel <code>schattenwiki-v1</code> und nach einer Änderung <code>schattenwiki-v2</code>. Übe das Sichern und Öffnen im <a href="#lesson=inf7-wiki-editor">Wiki-Editor</a> mit „Zwischenstand speichern“ und „Zwischenstand öffnen“. Legt die Kopien für die Teamarbeit am vereinbarten Ort ab. Prüft, ob sie sich mit allen benötigten Dateien öffnen lassen.',
          "Ein kurzer Protokolleintrag hält fest, wer wann was geändert hat, was getestet wurde und was noch offen ist. Eine Testliste kann pro Zeile Ausgangsseite, gewählten Link, erwartetes Ziel und beobachtetes Ziel enthalten.",
          "Wähle vor der Abgabe einen geprüften Stand. Teste von der Startseite aus, ob Besucher alle Seiten erreichen, prüfen können, woher ein Bild stammt, und wieder zum Anfang finden.",
        ],
        "In v2 öffnet der Link „Erklärung“ versehentlich „Aufbau“. In v1 führte er zur richtigen Seite. Öffne beide Stände, vergleiche das Linkziel, korrigiere es in v3 und notiere den erfolgreichen erneuten Test.",
        snapshots,
      ),
      rule: snapshots,
      terms: [
        [
          "Zwischenstand",
          "Wiederöffnbare Fassung des Projekts",
          "Im Namen erkennen Teammitglieder die Version.",
        ],
        [
          "Testprotokoll",
          "Eingabe, Erwartung, Beobachtung und Ergebnis",
          "So kann eine andere Person den Test wiederholen.",
        ],
      ],
      quiz: [
        "Der neue Stand hat einen Fehler. Was hilft beim Eingrenzen?",
        "Den letzten funktionierenden Zwischenstand öffnen und die Änderung vergleichen.",
        "Alle früheren Versionen sofort löschen.",
        "Am aktuellen Dateinamen raten, was sich geändert hat.",
        "Der Vergleich zeigt, welche Änderung zwischen dem Fehler und der funktionierenden Fassung liegt.",
      ],
      lab: caseLab({
        kind: "project-checkpoints",
        title: "Ein Fehler zwischen v1 und v2",
        intro: "Ordne die drei Schritte dem passenden Zweck zu.",
        categories: ["Zwischenstand sichern", "Link testen", "Änderung protokollieren"],
        cases: [
          {
            short: "Funktionierendes Wiki",
            text: "Bevor du die Links änderst, legst du eine wiederöffnbare Kopie v1 ab.",
            answer: 0,
            why: "Das Team kann den alten Zustand wieder öffnen.",
            hint: "Es geht um eine vollständige Kopie.",
          },
          {
            short: "Erwartet: Erklärung",
            text: "Du klickst auf „Erklärung“ und stellst fest, dass „Aufbau“ geöffnet wird.",
            answer: 1,
            why: "Erwartetes und beobachtetes Ziel lassen sich vergleichen.",
            hint: "Du probierst eine konkrete Aktion aus.",
          },
          {
            short: "Eintrag zu v3",
            text: "Du notierst: Jo, v3, Linkziel korrigiert, Linktest bestanden.",
            answer: 2,
            why: "Der Eintrag hält Änderung, Person und Test fest.",
            hint: "Der Zweck ist, den Ablauf nachvollziehbar zu machen.",
          },
        ],
        goals: [
          { text: "Erkenne einen gesicherten Zwischenstand.", cases: [0] },
          { text: "Erkenne einen Test mit Soll und Ist.", cases: [1] },
          { text: "Erkenne einen nachvollziehbaren Protokolleintrag.", cases: [2] },
        ],
      }),
      exercises: drills(
        saveVariants,
        [
          cc(
            "Welcher Name hilft Versionsstände zu unterscheiden?",
            "schattenwiki-v2",
            ["neu-neu-fertig", "irgendwas"],
            "Die Versionsnummer benennt den Stand eindeutig, wenn das Team die Namen abspricht.",
            "Wähle eine erkennbare Reihenfolge.",
          ),
          cc(
            "Zwei Personen ändern parallel einen Projektordner. Was verhindert, dass ein brauchbarer Stand verloren geht?",
            "Den letzten geprüften Stand erhalten und neue Fassungen mit klarer Zuordnung speichern.",
            [
              "Ständig dieselbe Datei ohne Sicherung überschreiben.",
              "Beide Stände löschen, sobald sich etwas ändert.",
            ],
            "Eine getrennte Sicherung bleibt wiederöffnbar und vergleichbar.",
            "Plane den Vergleich beider Fassungen.",
          ),
        ],
        [
          cc(
            "Was macht einen Fehlerbericht nachvollziehbar?",
            "Ausgangsseite, geklickter Link, erwartetes und tatsächliches Ziel",
            ["Nur der Text „geht nicht“", "Nur die Farbe der Seite"],
            "Die Beschreibung ermöglicht, denselben Weg zu testen.",
            "Nenne, was eine andere Person genau anklicken soll.",
          ),
          cc(
            "In Version 2 öffnet der Link „Schatten“ die Seite „Aufbau“. Version 1 funktioniert. Was prüfst du zuerst?",
            "Die Zieladressen desselben Links in beiden Versionen vergleichen.",
            ["Alle Seitentitel umbenennen.", "Eine neue Grafik suchen."],
            "Der Vergleich kann die fehlerhafte Änderung direkt sichtbar machen.",
            "Untersuche genau das Attribut, das das Ziel bestimmt.",
          ),
        ],
        [
          cc(
            "Welche Angabe fehlt bei „v3, Link korrigiert“, wenn das Team den Test nachvollziehen soll?",
            "Das Ergebnis des erneuten Linktests",
            ["Die Farbe des Schreibtischs", "Der WLAN-Name"],
            "Das Team weiß erst dadurch, ob die Korrektur geprüft wurde.",
            "Unterscheide Änderung und Testergebnis.",
          ),
          cc(
            "Der Linktest besteht auf deinem Rechner. Auf dem Schulrechner fehlt ein Bild. Was prüfst du am Abgabestand?",
            "Ob die Abgabe das Bild enthält und der Verweis auf seinen abgegebenen Speicherort zeigt.",
            [
              "Ob die Versionsnummer größer geschrieben ist.",
              "Ob der Schulrechner einen anderen Hintergrund hat.",
            ],
            "Der zweite Rechner muss die verknüpfte Datei im Abgabestand finden können.",
            "Teste mit den tatsächlich übergebenen Dateien.",
          ),
        ],
      ),
    }),
  ],
};
