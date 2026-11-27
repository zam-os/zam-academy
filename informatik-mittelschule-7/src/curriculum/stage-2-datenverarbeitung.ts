import type { ExerciseGenerator, Stage } from "../model/types";
import { compareLab, editLab, pixelLab, vectorLab } from "../lab/graphics";
import { cc, cases, choiceField, explain, lesson, numberField, practice } from "./helpers";

const id = "stage-2-datenverarbeitung";
const pixelRule = "Breite mal Höhe ergibt die Pixelzahl. Dateiformat und Kompression beeinflussen zusätzlich die Größe der Datei.";
const editRule = "Zuschneiden ändert den Bildausschnitt, Freistellen trennt das Motiv vom Hintergrund, Retuschieren ändert einzelne Stellen.";
const compareRule = "Rastergrafiken speichern Bildpunkte. Vektorgrafiken speichern Formen und ihre Eigenschaften.";
const vectorRule = "Ein Objekt hat Attribute. Die Attributwerte bestimmen, wie das konkrete Objekt aussieht.";

const countPixels: ExerciseGenerator = {
  id: "pixelzahl",
  make(rng, level) {
    const width = rng.int(4, 9) * 100;
    const height = rng.int(2, 4) * 100;
    const sharper = width * height * 4;
    const field = { ...numberField("Anzahl Bildpunkte", level === 1 ? width * height : sharper), tolerance: 0 };
    return {
      prompt: level === 1
        ? "Berechne die Pixelzahl des gespeicherten Bilds."
        : "Beim erneuten Scannen werden Breite und Höhe in Pixeln verdoppelt. Wie viele Bildpunkte hat der neue Scan und wie verändert sich die Pixelzahl?",
      given: [`Ursprüngliche Breite: ${width} Pixel`, `Ursprüngliche Höhe: ${height} Pixel`],
      formulaHint: "Multipliziere die Bildbreite mit der Bildhöhe.",
      fields: level === 1 ? [field] : [field, choiceField(rng, "Änderung", "viermal so viele Pixel", ["doppelt so viele Pixel", "gleich viele Pixel"])],
      steps: level === 1
        ? [`Multipliziere ${width} mit ${height}.`, `<strong>${width * height} Pixel</strong>`]
        : [`Neu sind es ${width * 2} Pixel in der Breite und ${height * 2} Pixel in der Höhe.`, `<strong>${sharper} Pixel · viermal so viele wie zuvor.</strong>`],
    };
  },
};

const lessons = [
  lesson(id, "2", 1, {
    id: "ms7-pixel-formate", title: "Vom Foto zur Bilddatei", subtitle: "Pixelmosaik, Auflösung und passende Dateiformate",
    why: "Ein Wandplakat braucht andere Bilddetails als ein kleines Vorschaubild im Chat.",
    html: explain([
      "Eine Kamera nimmt Licht auf, ein Scanner tastet eine Vorlage ab. Als Rastergrafik gespeichert, ergeben die Messwerte ein Raster farbiger Bildpunkte, der Pixel. Die Auflösung in Pixeln gibt Breite und Höhe dieses Rasters an. Beim starken Vergrößern eines kleinen Bilds werden die einzelnen Pixel sichtbar oder die Übergänge weich.",
      "Breite und Höhe bestimmen die Pixelzahl. Die Dateigröße hängt außerdem von Farbe, Bildinhalt und Kompression ab. PNG bewahrt Pixelwerte beim Speichern verlustfrei und unterstützt Transparenz. JPG kann Fotos mit vergleichsweise kleinen Dateien speichern, verwirft dabei aber Details. GIF speichert höchstens 256 Farben pro Einzelbild und kann mehrere Bilder als Animation anzeigen.",
    ], "Ein Scan mit 600 × 400 Pixeln enthält 240 000 Pixel. Bei 1 200 × 800 sind es 960 000. Für ein veröffentlichtes Foto passt oft JPG, für eine Skizze mit scharfen Kanten oder transparentem Hintergrund PNG.", pixelRule),
    rule: pixelRule,
    terms: [["Auflösung", "Breite × Höhe in Pixeln", "Beispiel: 600 × 400 Pixel."], ["Kompression", "Verfahren zum platzsparenden Speichern.", "Bei JPG gehen beim Speichern Bilddetails verloren."], ["PNG", "Verlustfreie Rastergrafik mit möglicher Transparenz.", "Zum Beispiel für Bildschirmausschnitte und freigestellte Motive."]],
    quiz: ["Wie ändert sich die Pixelzahl, wenn Breite und Höhe jeweils doppelt so groß werden?", "Sie vervierfacht sich.", "Sie verdoppelt sich.", "Sie bleibt gleich.", "Zweimal so viele Pixel pro Zeile mal zweimal so viele Zeilen ergibt viermal so viele Pixel."],
    lab: pixelLab,
    exercises: [
      countPixels,
      cases("formate",
        [cc("Ein freigestelltes Symbol soll seinen transparenten Hintergrund behalten.", "PNG", ["JPG", "Nur eine unbenannte Textdatei"], "PNG kann transparente Pixel speichern.", "Welche Datei lässt die Ebene darunter durchscheinen?"),
         cc("Eine kurze Grafik wechselt zwischen drei farbarmen Einzelbildern. Welches der drei Formate kann die Animation speichern?", "GIF", ["JPG", "Ein gewöhnliches Einzelbild als PNG"], "GIF kann mehrere Einzelbilder zeitlich anzeigen.", "Denke an mehrere Bilder hintereinander.")],
        [cc("Zwei Fotos haben 800 × 600 Pixel. Beim Speichern als JPG entstehen unterschiedlich große Dateien. Warum ist das möglich?", "Bildinhalt und Kompression beeinflussen die Dateigröße.", ["Gleiche Auflösung erzwingt gleich große Dateien.", "Eine größere Datei hat unabhängig von der Auflösung immer mehr Pixel."], "Die Kompression kann verschiedene Bildinhalte unterschiedlich gut speichern.", "Pixelanzahl und Zahl der gespeicherten Bytes sind verschiedene Größen."),
         cc("Ein 120 × 80 Pixel großes Bild wirkt auf dem Plakat unscharf. Die Originalvorlage ist vorhanden. Welche Maßnahme gewinnt tatsächlich neue Bildinformationen?", "Die Vorlage mit höherer Auflösung neu scannen.", ["Die alte Datei bloß in JPG umbenennen.", "Die alte Datei mit denselben Pixeln größer aufziehen."], "Beim erneuten Scannen erfasst das Gerät mehr Details der Vorlage.", "Benötigt werden zusätzliche Messwerte aus dem Original.")]
      ),
    ],
  }),
  lesson(id, "2", 2, {
    id: "ms7-raster-bearbeiten", title: "Rasterbilder bearbeiten", subtitle: "Ausschnitt, transparenter Hintergrund und Retusche",
    why: "Für einen Flyer kannst du ein Motiv hervorheben, die Bildfläche verkleinern oder einen störenden Fleck entfernen.",
    html: explain([
      "Beim Zuschneiden behältst du einen rechteckigen Ausschnitt. Alles außerhalb des Rechtecks fällt weg. Beim Freistellen wählst du ein Motiv aus und blendest den Hintergrund aus, etwa mit einer Auswahl oder einer Maske. Das Raster kann gleich groß bleiben. Transparenz erkennst du in vielen Programmen am Schachbrettmuster.",
      "Bei einer Retusche veränderst du ausgewählte Bildpunkte. Für einen kleinen Staubfleck auf einfarbigem Himmel kann eine nahe Stelle als Farbvorlage dienen. Bewahre das Original und speichere eine Kopie. Wenn das Ergebnis als Beleg dienen soll, dürfen Bearbeitungen die Aussage nicht verfälschen.",
    ], "Ein Stern sitzt auf einem blauen Hintergrund. Beim Zuschnitt entfernst du breite Ränder. Für den Flyer stellst du den Stern frei und speicherst ihn transparent als PNG. Ein Staubfleck im Scan verschwindet mit einer kleinen Retusche.", editRule),
    rule: editRule,
    terms: [["Zuschneiden", "Rechteckigen Ausschnitt behalten.", "Die Pixel außerhalb entfallen."], ["Freistellen", "Ein Motiv vom Hintergrund trennen.", "Beim Export Transparenz erhalten, etwa mit PNG."], ["Retuschieren", "Einzelne Bildstellen gezielt ausbessern.", "Zum Beispiel einen Staubfleck ersetzen."]],
    quiz: ["Ein Stern soll auf farbigem Papier und auf Weiß gleich verwendbar sein. Was brauchst du?", "Stern freistellen und transparent speichern", "Einen größeren blauen Rand zuschneiden", "Die gesamte Grafik heller machen", "Ein transparenter Hintergrund lässt die jeweilige Fläche hinter dem Motiv sichtbar."],
    lab: editLab,
    exercises: practice(
      [cc("Links im Scan ist ein überflüssiger Rand. Wie entfernst du ihn?", "Zuschneiden", ["Retuschieren des ganzen Motivs", "Als GIF umbenennen"], "Beim Zuschneiden ändert sich der Ausschnitt.", "Du willst die Bildfläche verkleinern."),
       cc("Ein Staubkorn stört mitten in einer gleichmäßigen Fläche.", "Die Stelle retuschieren", ["Alle Ränder abschneiden", "Die Fläche vollständig freistellen"], "Die Nachbarfarbe kann den Fleck ersetzen.", "Der restliche Ausschnitt soll bleiben.")],
      [cc("Der freigestellte Umriss hat im Export plötzlich einen weißen Kasten. Welche Änderung passt?", "Als PNG mit Transparenz exportieren", ["Im JPG nur den Namen ändern", "Die Vorlage kleiner fotografieren"], "Das Dateiformat muss den durchsichtigen Hintergrund speichern können.", "JPG unterstützt keine Transparenz."),
       cc("Ein 400 × 300 Pixel großes Bild verliert links und rechts jeweils 20 Pixel. Oben und unten fällt nichts weg. Was bleibt?", "360 × 300 Pixel", ["380 × 280 Pixel", "400 × 260 Pixel"], "Die Breite sinkt zweimal um 20 Pixel, die Höhe bleibt gleich.", "Ordne links und rechts der Breite zu.")],
      [cc("Das gleiche Motiv soll auf mehrere farbige Hintergründe passen. Welche Bearbeitung trennt es ab?", "Freistellen", ["Den Dateinamen austauschen", "Nur die Helligkeit ändern"], "Das Motiv bleibt, der Hintergrund wird ausgeblendet.", "Braucht die Fläche hinter dem Motiv Sichtbarkeit?"),
       cc("Du möchtest später anders zuschneiden können. Was speicherst du zusätzlich?", "Das unbearbeitete Original", ["Nur den fertigen Ausschnitt", "Nur einen Screenshot des Dateinamens"], "Im Original sind alle Randpixel erhalten.", "Ein exportierter Ausschnitt hat keinen Zugriff auf entfernte Ränder.")],
      [cc("Jemand entfernt aus einem Beweisfoto eine sichtbare Beschädigung. Wie bewertest du das?", "Die Retusche verändert die Aussage. Für den Beleg verwende das Original.", ["Als Beleg taugt nur die glatte Fassung.", "Eine Bildbearbeitung kann keine Aussage ändern."], "Das Publikum soll den sichtbaren Zustand nachvollziehen können.", "Wofür wird das Foto verwendet?"),
       cc("Eine Schulbroschüre braucht das Motiv einer Skizze. Du willst ihren Hintergrund entfernen und die fremde Skizze danach veröffentlichen.", "Bearbeitung und Veröffentlichung vorab über Lizenz oder Erlaubnis klären", ["Nach dem Freistellen gilt sie automatisch als eigene Skizze.", "Mit neuer Dateiendung gelten keine Bedingungen."], "Die Rechte am fremden Werk gelten auch nach einer Bearbeitung.", "Verbinde die technische Entscheidung mit der Freigabe.")],
    ),
  }),
  lesson(id, "2", 3, {
    id: "ms7-raster-vektor", title: "Raster oder Vektor?", subtitle: "Vergrößern und begründet auswählen",
    why: "Das gleiche Logo soll auf einem kleinen Aufkleber und einem großen Banner sauber aussehen.",
    html: explain([
      "Eine Rastergrafik speichert für jede Position im Raster eine Farbe. Beim starken Vergrößern bleiben ohne neue Information nur die vorhandenen Bildpunkte. Harte Kanten können stufig werden, geglättete Kanten weich aussehen. Ein Foto eignet sich für ein Raster, weil es viele kleine Farb- und Helligkeitsänderungen enthält.",
      "Eine Vektorgrafik beschreibt Formen, etwa Strecken, Kurven, Rechtecke und Füllungen. Das Programm berechnet die Formen für die gewünschte Größe. Dadurch bleiben ihre Kanten beim Skalieren klar. Logos, viele Computerschriften und skalierbare Karten verwenden deshalb Vektorformen. Beim Export nach PNG wird die gewählte Größe wieder als Raster gespeichert.",
    ], "Dein Logo ist eine gelbe Raute. In einem 8 × 8 Pixel großen Raster nähert eine Treppe die Diagonale an. In einer Vektordatei genügen vier Punkte und eine Füllfarbe. Für den großformatigen Druck nimmst du die Vektorfassung.", compareRule),
    rule: compareRule,
    terms: [["Rastergrafik", "Farbwerte auf einem festen Pixelraster.", "Beispiel: JPG-Foto."], ["Vektorgrafik", "Formen mit geometrisch beschriebenen Attributen.", "Beispiel: SVG-Logo."], ["Skalieren", "Darstellungsgröße verändern.", "Vektorformen lassen sich neu berechnen."]],
    quiz: ["Warum bleiben die Vektorkanten eines Logos beim Zoomen klar?", "Das Programm berechnet die beschriebenen Formen in der neuen Größe.", "Es wiederholt lediglich die Originalpixel.", "Ein Bildschirm zeigt beim Zoomen keine Pixel mehr.", "Die Form bleibt als Beschreibung erhalten. Für die Anzeige wird sie in der passenden Größe gezeichnet."],
    lab: compareLab,
    exercises: practice(
      [cc("Welcher Inhalt eignet sich gut für eine Vektorgrafik?", "Ein Logo aus Kreisen und Linien", ["Ein Foto eines wolkigen Himmels", "Ein Scan einer grob strukturierten Holzfläche"], "Das Logo lässt sich durch wenige Formen beschreiben.", "Welche Vorlage besteht aus klaren Grundformen?"),
       cc("Du zoomst stark in eine winzige Rastergrafik. Was kann an einer schrägen Kante sichtbar werden?", "Treppenstufen aus einzelnen Bildpunkten", ["Unsichtbare mathematische Linien", "Unendlich viele neue Details"], "Die ursprüngliche Bildauflösung bleibt begrenzt.", "Denke an ein Mosaik.")],
      [cc("Ein Plakatdienst bekommt ein winziges PNG, obwohl das Logo ursprünglich als Vektor gezeichnet wurde. Womit erhält er die schärfste große Vorlage?", "Mit der ursprünglichen Vektordatei", ["Mit dem aufgezoomten kleinen PNG", "Mit dem in SVG umbenannten PNG"], "Die Vektordatei enthält die echten Formen. Ein anderer Name ändert keine Bilddaten.", "Wo sind die ursprünglichen Attributwerte noch verfügbar?"),
       cc("Eine Karte aus Linien und Symbolen soll ohne stufige Kanten zoombar bleiben. Ein Luftbild soll als eigene Ebene darunter liegen.", "Vektor für Linien und Symbole, Raster für das Luftbild", ["Raster für Linien und Vektor für jedes Detail des Fotos", "Beide Ebenen als einziges kleines Vorschaubild"], "Die Ebenen haben unterschiedliche Eigenschaften und Aufgaben.", "Welche Ebene besteht aus geometrischen Objekten?")],
      [cc("Was speichert ein Vektorrechteck?", "Zum Beispiel Position, Breite, Höhe und Farbe", ["Für jeden Bildpunkt der gesamten Grafik genau eine Farbe", "Nur den Namen des Zeichenprogramms"], "Die Attribute beschreiben die Form.", "Welche Angaben brauchst du, um das Rechteck nachzuzeichnen?"),
       cc("Du exportierst ein Vektorlogo in eine PNG-Datei mit 300 × 300 Pixeln. Was enthält diese Datei?", "Ein Raster mit 300 × 300 Bildpunkten", ["Eine beliebig skalierbare Liste von Formen", "Nur vier Linien mit ihren Endpunkten"], "Der PNG-Export speichert das in dieser Größe berechnete Raster.", "Welche Darstellung kennst du von PNG?")],
      [cc("Jemand fotografiert ein Vektorlogo vom Bildschirm ab. Wie ist das Ergebnis gespeichert?", "Als Rasterfoto mit Bildpunkten", ["Als ursprüngliche Liste der Vektorobjekte", "Als Satz von Attributen für jede Form"], "Die Kamera erfasst Licht, keine Objektbeschreibungen.", "Beurteile, wie die neue Datei entstanden ist."),
       cc("Ein Logo hat in der Vektordatei zwei Formen. Der PNG-Export wirkt gleich. Welche Fassung erlaubt am einfachsten, eine der Formen einzeln zu verschieben?", "Die Vektordatei, in der die Formen eigene Objekte sind", ["Der flache PNG-Export, weil seine Farbwerte beschriftet sind", "Beide gleich, weil die Vorschau gleich aussieht"], "Die ähnliche Anzeige verrät nichts darüber, ob Objekte getrennt gespeichert sind.", "Betrachte die gespeicherte Struktur.")],
    ),
  }),
  lesson(id, "2", 4, {
    id: "ms7-vektor-objekte", title: "Formen als Objekte gestalten", subtitle: "Attribute, Attributwerte und eine eigene Vektorgrafik",
    why: "Mit einer kleinen Änderung an einem Attribut kannst du eine Form gezielt umbauen.",
    html: explain([
      "Ein Rechteck in einem Vektorgrafikprogramm ist ein Objekt. Mögliche Attribute sind Position, Breite, Höhe und Füllfarbe. „Breite“ bezeichnet die Eigenschaft, 60 ist ein Attributwert. Zwei Rechtecke können dieselbe Füllfarbe und unterschiedliche Breiten haben.",
      "Eine Linie kannst du durch ihre beiden Endpunkte beschreiben. Dein Grafikprogramm zeichnet mit diesen Koordinaten die Strecke. Ändert sich ein Endpunkt, ändert sich die Linie. Beim Bearbeiten eines Objekts bleiben die Attribute anderer Objekte erhalten, solange du sie nicht mit auswählst.",
    ], "Wähle ein türkises Rechteck mit Breite 40 aus. Setze die Breite auf 60 und die Füllfarbe auf Gelb. Das Objekt bleibt ein Rechteck. Die Breite und die Füllfarbe haben neue Werte, seine Position bleibt beim Ändern der beiden Werte gleich.", vectorRule),
    rule: vectorRule,
    terms: [["Objekt", "Eine konkrete Form im Dokument.", "Zum Beispiel das gelbe Rechteck."], ["Attribut", "Eine beschreibbare Eigenschaft.", "Zum Beispiel Breite."], ["Attributwert", "Aktueller Wert eines Attributs.", "Zum Beispiel 60 als Wert des Attributs Breite."]],
    quiz: ["Welche Aussage beschreibt einen Attributwert einer Linie?", "Der Endpunkt liegt bei x = 8 und y = 5.", "Die Linie ist eine Vektorgrafik und hat Eigenschaften.", "Jede Linie hat zwei Endpunkte.", "Die Koordinaten 8 und 5 sind konkrete Werte für den Endpunkt dieser Linie."],
    lab: vectorLab,
    exercises: practice(
      [cc("Beim Rechteck war die Füllfarbe Türkis. Du setzt sie auf Gelb. Welches Attribut hast du geändert?", "Füllfarbe", ["Breite", "Position"], "Gelb und Türkis sind Werte des Attributs Füllfarbe.", "Unterscheide Eigenschaften und Werte."),
       cc("Die Breite deines Rechtecks ist 60. Was ist hier der Attributwert?", "60", ["Breite", "Rechteck"], "Breite ist der Name, 60 ist der aktuelle Wert.", "Der Wert steht in diesem Beispiel als Zahl da.")],
      [cc("Eine Linie verläuft von (2 | 3) nach (8 | 3). Welches Attribut änderst du, wenn nur das rechte Ende bis (8 | 5) hoch soll?", "Die y-Koordinate des rechten Endpunkts", ["Die x-Koordinate des linken Endpunkts", "Die Füllfarbe eines Rechtecks"], "Nur die Höhe des rechten Endpunkts ändert sich.", "Vergleiche die beiden Koordinaten des Endpunkts."),
       cc("Ein Logo hat zwei Rechtecke und eine Linie. Das linke Rechteck soll breiter werden, die übrigen Formen bleiben gleich. Wie gehst du vor?", "Nur das linke Rechteck auswählen und seine Breite ändern.", ["Alle Formen markieren und gemeinsam skalieren.", "Das ganze Bild als Raster exportieren und ziehen."], "Die Auswahl legt fest, welches Objekt bearbeitet wird.", "Eine lokale Änderung braucht eine lokale Auswahl.")],
      [cc("Du änderst den Durchmesser, die Füllfarbe bleibt gleich. Welche Form kann weiterhin ein Kreis sein?", "Der Kreis mit größerem Durchmesser", ["Die Linie mit neuem Endpunkt", "Nur ein Rechteck mit alter Breite"], "Durchmesser ist ein Attribut des Kreises.", "Eine Eigenschaft zu ändern ändert die Art der Form nicht automatisch."),
       cc("Welche Angabe kann ein Programm als Füllfarbe übernehmen?", "Violett", ["Ein Kreis", "Endpunkt"], "Violett ist ein möglicher Farbwert.", "Welche Antwort beschreibt einen Farbton?")],
      [cc("Zwei Kreise sind gelb und haben Durchmesser 40, liegen aber an verschiedenen Stellen. Welches Attribut muss sich unterscheiden?", "Position", ["Durchmesser", "Füllfarbe"], "Sie haben dieselbe Form und Farbe an verschiedenen Orten.", "Welche Angabe beschreibt den Ort?"),
       cc("Du willst deine Formen später einzeln bearbeiten. Welche Ausgabe bewahrt sie als Objekte?", "SVG", ["JPG", "PNG"], "SVG beschreibt die Formen. Die anderen beiden Formate speichern Rasterbilder.", "Welche Datei enthält die Attribute der Objekte?")],
    ),
  }),
];

export const STAGE_DATENVERARBEITUNG: Stage = {
  id, stageNumber: 2, title: "Datenverarbeitung", subtitle: "Pixel untersuchen, Bilder bearbeiten und Formen gestalten",
  icon: "▦", accent: "orange", badgeTitle: "Bilder gestaltet", lehrplanLabel: "R7 und M7 · Inf7 LB 2", module: "2", lessons,
};
