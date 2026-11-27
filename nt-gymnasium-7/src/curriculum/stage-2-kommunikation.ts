import { caseLab } from "../lab/case-lab";
import type { Stage } from "../model/types";
import { cc, drills, explain, lesson } from "./helpers";
import { channelVariants, privacyVariants } from "./practice-communication";

const id = "kommunikation";
const module = "2.2";
const channelRule =
  "Wähle den Kanal nach Anlass, Empfängern und nötiger Vertraulichkeit. Prüfe Inhalte, bevor du sie weiterleitest.";
const privacyRule =
  "Teile nur nötige Daten, kläre die Freigabe und prüfe bei überraschenden Nachrichten den Absender auf einem zweiten Weg.";

export const STAGE_KOMMUNIKATION: Stage = {
  id,
  module,
  stageNumber: 2,
  icon: "💬",
  accent: "#0b7265",
  title: "Digital kommunizieren",
  subtitle: "Nachrichten passend verschicken und persönliche Daten schützen.",
  badgeTitle: "Bewusst kommunizieren",
  lehrplanLabel: "NT7 2.2 · ca. 5 Std.",
  lessons: [
    lesson(id, module, 1, {
      id: "inf7-digitale-kommunikation",
      title: "Vom Klassenchat bis zur E-Mail",
      subtitle: "Reichweite, Ton und Verantwortung",
      why: "Ob du einer Lehrkraft eine Datei schickst oder im Team etwas verabredest, macht für die Wahl des Kanals einen Unterschied.",
      html: explain(
        [
          "Eine <strong>E-Mail</strong> eignet sich für eine Nachricht mit Betreff, Anhängen und Zeit zum Lesen. Ein <strong>Messenger</strong> hilft einer kleinen Gruppe, sich schnell abzusprechen. Ein <strong>soziales Netzwerk</strong> kann Beiträge weit verbreiten, auch über deine bekannte Gruppe hinaus.",
          "Schnelle Verbreitung ist hilfreich, etwa für eine öffentliche Erinnerung an einen Termin. Sie vergrößert aber auch die Reichweite falscher Nachrichten. Prüfe bei einer überraschenden Meldung, wer sie veröffentlicht hat und ob eine unabhängige Quelle sie bestätigt. Teile eine Behauptung erst nach der Prüfung.",
          "Lies vor dem Absenden den Ton und die Empfängerliste. Wenn jemand wiederholt online bloßgestellt wird, beteilige dich nicht am Weiterleiten. Sprich mit der betroffenen Person, hol eine Vertrauensperson dazu und nutze die Meldefunktion, wenn sie hilft.",
        ],
        "Die AG will kurzfristig den Treffpunkt ändern. Ein zugelassener Gruppenchat erreicht die Beteiligten schnell. Den Bericht über die AG kannst du über einen freigegebenen Schulkanal öffentlich machen, nachdem Inhalte und Bilder geprüft wurden.",
        channelRule,
      ),
      rule: channelRule,
      terms: [
        [
          "Reichweite",
          "Kreis möglicher Empfänger",
          "Weiterleiten und Screenshots können ihn vergrößern.",
        ],
        [
          "Cybermobbing",
          "Wiederholtes Angreifen oder Bloßstellen mit digitalen Mitteln",
          "Unterstütze Betroffene und hol Hilfe.",
        ],
      ],
      quiz: [
        "Im Klassenchat wird wiederholt ein Mitschüler beleidigt. Wie hilfst du?",
        "Ich hole Unterstützung und leite die Beiträge nicht weiter.",
        "Ich leite alles als Unterhaltung weiter.",
        "Ich poste öffentlich seine Telefonnummer.",
        "Unterstützung kann das Mobbing stoppen. Weiterverbreiten vergrößert den Schaden.",
      ],
      lab: caseLab({
        kind: "channel-choice",
        title: "Der richtige Kanal",
        intro: "Die Schule hat die drei Kanäle freigegeben. Wähle für jede Situation den passendsten.",
        categories: ["Schul-E-Mail", "Geschlossener Gruppenchat", "Öffentlicher Schulkanal"],
        cases: [
          {
            short: "Entwurf für die Lehrkraft",
            text: "Du sendest einer Lehrkraft einen Entwurf mit Betreff und Anhang.",
            answer: 0,
            why: "Der Empfängerkreis ist klar und der Anhang nachvollziehbar.",
            hint: "Die Nachricht soll gezielt an eine Person gehen.",
          },
          {
            short: "Neuer Treffpunkt",
            text: "Die AG muss sich sofort intern auf einen anderen Treffpunkt einigen.",
            answer: 1,
            why: "Die beteiligte Gruppe kann schnell reagieren.",
            hint: "Nur die AG muss kurzfristig antworten.",
          },
          {
            short: "Einladung fürs Schulfest",
            text: "Eine freigegebene Einladung ohne personenbezogene Daten soll alle Familien erreichen.",
            answer: 2,
            why: "Die Einladung ist für die Öffentlichkeit bestimmt.",
            hint: "Die große Reichweite ist hier beabsichtigt.",
          },
        ],
        goals: [
          { text: "Wähle einen passenden Kanal für einen Anhang an eine Person.", cases: [0] },
          { text: "Wähle den Kanal für die schnelle interne Abstimmung.", cases: [1] },
          { text: "Wähle den Kanal für die öffentliche Einladung.", cases: [2] },
        ],
      }),
      exercises: drills(
        channelVariants,
        [
          cc(
            "Was braucht eine Mail zur Hausaufgabe, damit sie leicht einzuordnen ist?",
            "Einen klaren Betreff und den richtigen Empfänger",
            ["Einen öffentlichen Link zum privaten Projekt", "Viele Weiterleitungen"],
            "Betreff und Empfänger machen Anlass und Adressaten klar.",
            "Prüfe, wer die Datei erwartet.",
          ),
          cc(
            "Du hast eine vertrauliche Rückfrage an die Lehrkraft. Wie gehst du vor?",
            "Ich verwende den dafür freigegebenen direkten Schulkanal.",
            ["Ich poste die Frage öffentlich.", "Ich schicke ein Bildschirmfoto an alle."],
            "Ein direkter Kanal begrenzt den Empfängerkreis.",
            "Wähle zuerst den kleinsten passenden Empfängerkreis.",
          ),
        ],
        [
          cc(
            "Eine überraschende Meldung im Klassenchat nennt keine Quelle. Was tust du?",
            "Herkunft und eine unabhängige Bestätigung suchen",
            ["Sofort an weitere Gruppen senden", "Nur die Zahl der Reaktionen ansehen"],
            "Eine Bestätigung muss eigenständig und überprüfbar sein.",
            "Eine Weiterleitung macht eine Meldung nicht wahr.",
          ),
          cc(
            "Eine Falschmeldung über einen Stundenplan erreicht mehrere Klassen. Was mindert den Schaden?",
            "Die Schule prüfen und die geprüfte Korrektur in den betroffenen Gruppen teilen.",
            [
              "Die Meldung ohne Kommentar erneut posten.",
              "Die Verantwortung einer beliebigen Person zuschieben.",
            ],
            "Eine belegte Korrektur erreicht die Menschen, die sich nach der Meldung richten könnten.",
            "Prüfe den Ursprung und wähle dieselbe relevante Reichweite.",
          ),
        ],
        [
          cc(
            "Was hilft bei wiederholten Beleidigungen im Chat?",
            "Unterstützung holen und den Vorfall melden",
            ["Die Beiträge als Witz weiterleiten", "Die betroffene Person öffentlich beschuldigen"],
            "Unterstützung und eine gezielte Meldung helfen beim Eingreifen.",
            "Überlege, wie du die Verbreitung stoppst.",
          ),
          cc(
            "Ein beleidigender Screenshot wird geteilt. Wie kannst du der betroffenen Person helfen, ohne ihn weiter zu verbreiten?",
            "Privat Hilfe anbieten und mit einer Vertrauensperson das weitere Vorgehen klären.",
            [
              "Den Screenshot öffentlich als Gegenbeweis posten.",
              "Namen und Bild in eine zweite Gruppe kopieren.",
            ],
            "Privater Kontakt und Hilfe begrenzen die weitere Bloßstellung.",
            "Trenne Unterstützung von öffentlicher Wiederholung.",
          ),
        ],
      ),
    }),
    lesson(id, module, 2, {
      id: "inf7-datenschutz-sicherheit",
      title: "Bilder, Daten und Konten schützen",
      subtitle: "Persönlichkeitsrechte, sichere Zugänge und Fallen im Netz",
      why: "Schon ein weitergeleitetes Gruppenfoto oder eine überraschende Login-Aufforderung kann andere Personen betreffen.",
      html: explain(
        [
          "<strong>Personenbezogene Daten</strong> beziehen sich auf eine Person, die man erkennen oder bestimmen kann: etwa Name, Telefonnummer oder ein erkennbares Foto. Vor dem Veröffentlichen eines Gruppenbilds klärst du mit den Abgebildeten und der Schule, ob und wo es geteilt werden darf. Der Wunsch der AG nach Aufmerksamkeit und der Wunsch einer Person nach Privatsphäre können zusammenstoßen.",
          "Verwende für jedes Konto ein eigenes langes Passwort. Schalte einen zweiten Faktor ein, wenn er angeboten wird. Updates schließen bekannte Sicherheitslücken. Eine <strong>Firewall</strong> filtert Netzwerkverkehr nach Regeln. <strong>Virenschutz</strong> sucht verdächtige Dateien oder Programme. Beides hilft, ersetzt aber keine Entscheidung vor einem Klick.",
          "Ein Virus kann weitere Dateien befallen; ein Trojaner tarnt sich als nützliches Programm. Gefälschte Profile können Vertrauen erschleichen. Bei einer vermeintlich kostenlosen Anmeldung können Abo-Kosten versteckt sein. Prüfe bei Druck oder unerwarteten Aufforderungen den Absender über einen bekannten Kontakt und öffne den Dienst über den vertrauten Einstieg.",
        ],
        "Ein angebliches Profil der Schul-IT verlangt im Chat ein Passwort zur „sofortigen Prüfung“. Gib es nicht ein. Frage über den bekannten Schulkanal nach, ob die Aufforderung echt ist.",
        privacyRule,
      ),
      rule: privacyRule,
      terms: [
        [
          "Personenbezogene Daten",
          "Informationen über eine identifizierbare Person",
          "Auch ein Gesicht oder eine Kombination von Angaben kann jemanden identifizieren.",
        ],
        [
          "Firewall",
          "Filtert Netzwerkverkehr nach Regeln",
          "Virenschutz sucht verdächtige Dateien und Programme.",
        ],
        ["Trojaner", "Getarntes Schadprogramm", "Der versprochene Zweck kann harmlos aussehen."],
      ],
      quiz: [
        "Vor einem öffentlichen AG-Foto ist eine Person auf dem Bild dagegen. Welche Lösung respektiert das?",
        "Ein anderes Bild verwenden oder die Person unkenntlich machen und die Freigabe klären.",
        "Das Bild ungefragt mit Namen posten.",
        "Auf Likes warten und danach fragen.",
        "Ein alternatives Bild kann das Projekt zeigen und den Wunsch der Person nach Privatsphäre schützen.",
      ],
      lab: caseLab({
        kind: "privacy-decisions",
        title: "Was tust du vor dem Klick?",
        intro: "Ordne jedem Fall einen ersten sinnvollen Prüfschritt zu.",
        categories: [
          "Bildfreigabe klären",
          "Absender unabhängig prüfen",
          "Kosten und Vertragsbedingungen prüfen",
        ],
        cases: [
          {
            short: "Foto für den AG-Blog",
            text: "Auf dem Foto sind mehrere Personen klar erkennbar.",
            answer: 0,
            why: "Kläre den vorgesehenen Kanal und respektiere Einwände.",
            hint: "Der Fall betrifft erkennbare Personen.",
          },
          {
            short: "Passwortfrage im Chat",
            text: "Ein neues Konto nennt sich „Schul-IT“ und verlangt dein Passwort.",
            answer: 1,
            why: "Nutze den bekannten Schulkanal zur Überprüfung.",
            hint: "Der sichtbare Profilname beweist die Identität nicht.",
          },
          {
            short: "Probezugang",
            text: "„Kostenlos starten“ führt zu einer Maske mit Zahlungsdaten.",
            answer: 2,
            why: "Preis, Laufzeit und Kündigung können versteckt sein.",
            hint: "Prüfe, was du tatsächlich abschließen würdest.",
          },
        ],
        goals: [
          { text: "Schütze die erkennbare Person auf einem Foto.", cases: [0] },
          { text: "Reagiere auf eine mögliche falsche Identität.", cases: [1] },
          { text: "Erkenne, wann du nach Folgekosten suchen musst.", cases: [2] },
        ],
      }),
      exercises: drills(
        privacyVariants,
        [
          cc(
            "Welche Angabe ist personenbezogen?",
            "Eine Telefonnummer mit Zuordnung zu einer Mitschülerin",
            ["Die Anzahl der Schreibtische", "Die Fläche des Pausenhofs"],
            "Die Telefonnummer ist einer konkreten Person zugeordnet.",
            "Wer lässt sich anhand der Angabe erkennen?",
          ),
          cc(
            "Der AG-Bericht enthält eine private Telefonnummer. Wie bleibt die AG erreichbar und schützt die Person?",
            "Den freigegebenen Schul-Kontakt statt der privaten Nummer nennen.",
            [
              "Die private Nummer im Titel wiederholen.",
              "Die Nummer in ein öffentliches Bild schreiben.",
            ],
            "Eine offizielle Kontaktstelle erfüllt den Zweck ohne unnötige private Daten.",
            "Trenne den Zweck von der dafür notwendigen Angabe.",
          ),
        ],
        [
          cc(
            "Was macht eine Firewall?",
            "Sie filtert ein- oder ausgehenden Netzwerkverkehr nach Regeln.",
            ["Sie ersetzt jedes Passwort.", "Sie klärt die Bildrechte."],
            "Die Firewall entscheidet nach Regeln über Datenverkehr.",
            "Überlege, was am Übergang zwischen Netzen geschieht.",
          ),
          cc(
            "Ein Spiel aus einer unbekannten Quelle fordert dich auf, den Virenschutz auszuschalten. Was passt?",
            "Ich breche ab und nutze eine vertrauenswürdige Bezugsquelle.",
            [
              "Ich schalte sämtliche Schutzfunktionen aus.",
              "Ich schicke die Datei zuerst in den Klassenchat.",
            ],
            "Getarnte Programme können Schaden anrichten. Der Schutz soll aktiv bleiben.",
            "Achte auf die ungewöhnliche Aufforderung und die Quelle.",
          ),
        ],
        [
          cc(
            "Welcher Passwortplan schützt verschiedene Konten?",
            "Für jedes Konto ein eigenes langes Passwort",
            ["Ein kurzes Passwort für alle Konten", "Die Klassenbezeichnung für alle Konten"],
            "Ein bekannt gewordenes Passwort öffnet so nicht gleichzeitig andere Konten.",
            "Plane für den Fall, dass ein Zugang bekannt wird.",
          ),
          cc(
            "Ein Konto wurde verdächtig benutzt und teilt sein Passwort mit einem zweiten Konto. Was änderst du?",
            "Beide Zugänge absichern, unterschiedliche Passwörter wählen und zweiten Faktor einrichten.",
            ["Nur den Profilnamen ändern.", "Das alte Passwort an der nächsten Stelle wiederverwenden."],
            "Beide Konten sind betroffen, solange das bekannte Passwort dort gilt.",
            "Suche alle Orte, an denen der bekannte Zugang noch funktioniert.",
          ),
        ],
      ),
    }),
  ],
};
