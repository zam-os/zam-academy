import { sourceUrl } from "./curriculum/sources";
import painting from "./media/kaiserproklamation.jpg?inline";
import { esc } from "./workshop";

type MapPoint = [label: string, detail: string, column: 1 | 2 | 3, row: 1 | 2 | 3 | 4, highlighted?: boolean];
type MapLayer = { label: string; note: string; key: string; points: MapPoint[] };

const maps: Record<string, { title: string; layers: MapLayer[] }> = {
  napoleon: {
    title: "Mitteleuropa vor und nach der napoleonischen Neuordnung",
    layers: [
      { label: "Um 1790", key: "Beispiel aus dem Heiligen Römischen Reich", note: "Frankreich liegt westlich von Rhein und deutschen Territorien.", points: [
        ["Sachsen", "Kurfürstentum im Reich", 3, 1, true],
        ["Frankreich", "Eigenes Königreich", 1, 2],
        ["Rhein", "Orientierung", 2, 2],
        ["Bayern", "Kurfürstentum im Reich", 3, 3, true],
      ] },
      { label: "Um 1812", key: "Rheinbund unter Napoleons Einfluss", note: "Das Heilige Römische Reich ist seit 1806 aufgelöst. Sachsen und Bayern gehören dem Rheinbund an.", points: [
        ["Sachsen", "Königreich im Rheinbund", 3, 1, true],
        ["Frankreich", "Direkte französische Herrschaft", 1, 2],
        ["Rhein", "Orientierung", 2, 2],
        ["Bayern", "Königreich im Rheinbund", 3, 3, true],
      ] },
    ],
  },
  "wiener-kongress": {
    title: "Der Deutsche Bund und seine Umgebung",
    layers: [
      { label: "Mitgliedsgebiete 1815", key: "Beispiele aus dem Deutschen Bund", note: "Nur ein Teil der Gebiete Preußens und der Habsburgermonarchie gehörte zum Bund.", points: [
        ["Preußische Gebiete am Rhein", "Westen des Bundes", 1, 1, true],
        ["Frankfurt am Main", "Sitz des Bundestags", 2, 2, true],
        ["Bayern", "Süden des Bundes", 2, 3, true],
        ["Wien", "Österreichisches Bundesgebiet", 3, 3, true],
      ] },
      { label: "Beispiele außerhalb", key: "Nicht zum Deutschen Bund gehörig", note: "Ostpreußen und Ungarn gehörten zu Mächten, die mit anderen Gebieten im Bund vertreten waren.", points: [
        ["Ostpreußen", "Teil des Königreichs Preußen", 3, 1, true],
        ["Frankreich", "Eigenständiges Nachbarland", 1, 2, true],
        ["Bayern", "Zum Vergleich: im Bund", 2, 3],
        ["Ungarn", "Teil der Habsburgermonarchie", 3, 4, true],
      ] },
    ],
  },
  "bayern-karten": {
    title: "Vier Zeitstände in Bayerns Geschichte",
    layers: [
      { label: "Um 780", key: "Bayerisches Stammesherzogtum", note: "Das mittelalterliche Herzogtum reichte im Südosten über die späteren Landesgrenzen hinaus.", points: [
        ["Mainfranken", "Im fränkischen Herrschaftsraum", 2, 1],
        ["Regensburg", "Herzogssitz", 3, 2, true],
        ["Salzburg", "Bayerischer Raum", 3, 3, true],
      ] },
      { label: "Um 1750", key: "Kurfürstentum Bayern", note: "Mehrere eigenständige Territorien lagen auf dem Gebiet des heutigen Bayern.", points: [
        ["Bamberg", "Geistliches Hochstift", 2, 1],
        ["Augsburg", "Freie Reichsstadt", 2, 3],
        ["München", "Kurfürstliche Residenz", 3, 3, true],
      ] },
      { label: "1816", key: "Beispiele aus dem Königreich Bayern", note: "Die linksrheinische Pfalz gehörte jetzt zu Bayern und war vom Hauptgebiet getrennt.", points: [
        ["Bamberg", "Franken", 2, 1, true],
        ["Pfalz", "Westlich des Rheins", 1, 2, true],
        ["Augsburg", "Schwaben", 2, 3, true],
        ["München", "Altbayern", 3, 3, true],
      ] },
      { label: "Nach 1945", key: "Beispiele aus dem Freistaat Bayern", note: "Seit 1946 liegt die linksrheinische Pfalz im neu gegründeten Land Rheinland-Pfalz.", points: [
        ["Bamberg", "Franken", 2, 1, true],
        ["Pfalz", "Rheinland-Pfalz", 1, 2],
        ["Augsburg", "Schwaben", 2, 3, true],
        ["München", "Altbayern", 3, 3, true],
      ] },
    ],
  },
  imperialismus: {
    title: "Koloniale Aufteilung Afrikas um 1900",
    layers: [
      { label: "Deutsche Herrschaft", key: "Deutscher Herrschaftsanspruch", note: "Togo, Kamerun und Deutsch-Südwestafrika lagen weit auseinander.", points: [
        ["Togo", "Westafrika", 1, 2, true],
        ["Kamerun", "Westliches Zentralafrika", 2, 2, true],
        ["Deutsch-Südwestafrika", "Heute Namibia", 2, 4, true],
      ] },
      { label: "Weitere Beispiele", key: "Weitere Formen von Kolonialherrschaft", note: "Frankreich und Großbritannien kontrollierten ebenfalls Gebiete. Äthiopien blieb in dieser Zeit unabhängig.", points: [
        ["Algerien", "Französische Herrschaft", 1, 1, true],
        ["Ägypten", "Britisch besetzt", 3, 1, true],
        ["Äthiopien", "In dieser Zeit unabhängig", 3, 2],
        ["Deutsch-Südwestafrika", "Zum räumlichen Vergleich", 2, 4],
      ] },
    ],
  },
  friedensordnung: {
    title: "Mitteleuropa vor und nach dem Krieg",
    layers: [
      { label: "1914", key: "Beispiele für Gebiete der Mittelmächte", note: "Das Deutsche Reich und Österreich-Ungarn gehörten zu den Mittelmächten.", points: [
        ["Berlin", "Deutsches Reich", 2, 1, true],
        ["Elsass-Lothringen", "Deutsches Reich", 1, 2, true],
        ["Prag", "Österreich-Ungarn", 2, 2, true],
        ["Wien", "Österreich-Ungarn", 2, 3, true],
        ["Budapest", "Österreich-Ungarn", 3, 3, true],
      ] },
      { label: "1920", key: "Beispiele für veränderte Zugehörigkeiten", note: "Die Verträge von Versailles, Saint-Germain und Trianon betrafen unterschiedliche Staaten.", points: [
        ["Berlin", "Deutsches Reich", 2, 1],
        ["Elsass-Lothringen", "Frankreich", 1, 2, true],
        ["Prag", "Tschechoslowakei", 2, 2, true],
        ["Wien", "Österreich", 2, 3, true],
        ["Budapest", "Ungarn", 3, 3, true],
      ] },
    ],
  },
};

const diagrams: Record<string, { title: string; rows: Array<[string, string, string]>; note: string }> = {
  "verfassung-1791": {
    title: "Wer übt welche Gewalt aus?",
    rows: [
      ["Aktivbürger", "wählen", "Wahlmänner"],
      ["Wahlmänner", "wählen", "Gesetzgebende Versammlung"],
      ["Versammlung", "beschließt", "Gesetze"],
      ["König und Minister", "vollziehen", "Gesetze"],
      ["Gewählte Richter", "sprechen", "Recht"],
    ],
    note: "Der König konnte viele Beschlüsse aufschieben. Das Schaubild zeigt ausgewählte Befugnisse.",
  },
  "reichsverfassung": {
    title: "Wie gelangt Macht in die Staatsorgane?",
    rows: [
      ["Wahlberechtigte Männer", "wählen", "Reichstag"],
      ["Länderregierungen", "entsenden Vertreter in den", "Bundesrat"],
      ["Reichstag und Bundesrat", "stimmen zu", "Reichsgesetzen"],
      ["Kaiser", "ernennt", "Reichskanzler"],
    ],
    note: "Ein Pfeil bezeichnet jeweils eine bestimmte Befugnis. Der Reichstag ernennt den Reichskanzler nicht.",
  },
  "fabrik-alltag": {
    title: "Wie eine Fabrik das Umfeld verändert",
    rows: [
      ["Maschinen und Energie", "bündeln Arbeit in der", "Fabrik"],
      ["Fabrik und Arbeitsplätze", "ziehen Arbeitssuchende in den", "Fabrikort"],
      ["Wachsender Fabrikort", "benötigt mehr", "Wohnraum und Versorgung"],
    ],
    note: "Das Modell zeigt einen häufigen Ablauf. Die Entwicklung hing auch von lokalen Entscheidungen ab.",
  },
  julikrise: {
    title: "Von Spannungen zur Ausweitung des Kriegs",
    rows: [
      ["Großmachtrivalität und Wettrüsten", "erhöhen das", "Konfliktrisiko"],
      ["Attentat von Sarajevo", "löst aus", "Julikrise"],
      ["Ultimatum und Kriegserklärungen", "weiten aus", "Militärischen Konflikt"],
    ],
    note: "Lies die Pfeile als Erklärungsbeziehungen. Sie bedeuten keine Zwangsläufigkeit.",
  },
};

function renderMap(id: string, map: (typeof maps)[string], selected: number): string {
  const layer = map.layers[selected] ?? map.layers[0];
  return `<figure class="history-visual">
    <figcaption><strong>${esc(map.title)}</strong><span class="visual-kicker">Lageskizze · Auswahl von Orten und Gebieten · Norden oben</span></figcaption>
    <label class="map-select">Kartenansicht
      <select data-map="${esc(id)}">${map.layers.map(({ label }, index) => `<option value="${index}" ${index === selected ? "selected" : ""}>${esc(label)}</option>`).join("")}</select>
    </label>
    <ul class="sketch">${layer.points.map(([name, detail, column, row, highlighted]) =>
      `<li class="map-point${highlighted ? " highlighted" : ""}" style="--column:${column};--row:${row}"><strong>${esc(name)}</strong><span>${esc(detail)}</span></li>`
    ).join("")}</ul>
    <p class="map-key"><span aria-hidden="true"></span>${esc(layer.key)}</p>
    <p class="small">${esc(layer.note)} Die Skizze dient der Orientierung und zeichnet keine historischen Grenzlinien nach.</p>
  </figure>`;
}

export function mapViewCount(id: string): number {
  return maps[id]?.layers.length ?? 0;
}

export function renderVisual(id: string, selected = 0): string {
  if (maps[id]) return renderMap(id, maps[id], selected);
  if (diagrams[id]) {
    const { title, rows, note } = diagrams[id];
    return `<figure class="history-visual"><figcaption><strong>${esc(title)}</strong></figcaption><ul class="flow-diagram">${rows.map(([start, arrow, end]) =>
      `<li><strong>${esc(start)}</strong><span class="flow-arrow">${esc(arrow)} <span aria-hidden="true">→</span></span><strong>${esc(end)}</strong></li>`
    ).join("")}</ul><p class="small">${esc(note)}</p></figure>`;
  }
  if (id === "reichsgruendung") {
    return `<figure class="history-visual picture-source"><img src="${painting}" width="1050" height="777" alt="Gemälde im Spiegelsaal von Versailles. Links stehen Wilhelm und weitere Fürsten auf einem erhöhten Podest. In der Mitte hebt sich Bismarck in heller Uniform von den Umstehenden ab. Rechts grüßen Militärs."><figcaption><strong>Anton von Werner · Die Kaiserproklamation in Versailles</strong><span class="visual-kicker">Friedrichsruher Fassung von 1885 · dargestellt ist der 18. Januar 1871</span><a href="${esc(sourceUrl("painting-copy"))}" target="_blank" rel="noopener">Gemeinfreie Reproduktion und Bildnachweis ↗</a></figcaption></figure>`;
  }
  return "";
}
