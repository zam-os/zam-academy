import { esc } from "../workshop";

type Diagram = {
	title: string;
	kind: "flow" | "compare";
	items: [label: string, detail: string][];
};
const diagrams: Record<string, Diagram> = {
	"europa-alltag": {
		title: "Eine Reise nach Salzburg",
		kind: "compare",
		items: [
			["🪙 Währung", "Euro in Deutschland und Österreich"],
			["🚆 Grenze", "Schengen: normalerweise keine Personenkontrolle"],
			["🤝 Austausch", "Partnerschulen können einander besuchen"],
		],
	},
	"europa-laenderprojekt": {
		title: "Dein Porträt wächst über das Jahr",
		kind: "flow",
		items: [
			["🧭 Start", "Land verorten und Grundkarte anlegen"],
			["📊 Lernbereiche", "Karten und Befunde zu fünf Themen ergänzen"],
			["🗣️ Zum Schluss", "Karte, Belege und Ergebnisse vorstellen"],
		],
	},
	"wetter-messen": {
		title: "Das passende Messgerät",
		kind: "compare",
		items: [
			["🌡️ Thermometer", "Lufttemperatur · °C · im Schatten"],
			["🌧️ Regenmesser", "Niederschlag · mm · frei aufgestellt"],
			["🧭 Windfahne", "Windrichtung · Herkunft des Winds"],
		],
	},
	"wetter-vorhersage": {
		title: "Vom Messwert zur Vorhersage",
		kind: "flow",
		items: [
			["🌡️ Beobachten", "Station, Radar und Satellit erfassen das Wetter"],
			["🗺️ Berechnen", "Modelle liefern mögliche Entwicklungen"],
			["☔ Vergleichen", "Ort, Zeitraum und Unsicherheit benennen"],
		],
	},
	lebensmittel: {
		title: "Wie eine Tomate in den Laden kommt",
		kind: "flow",
		items: [
			["🌱 Anbau", "Freiland oder Gewächshaus"],
			["📦 Nach der Ernte", "Sortieren, verpacken und bei Bedarf kühlen"],
			["🚚 Transport", "Weg, Verkehrsmittel und Lagerung"],
			["🛒 Einkauf", "Herkunft und Saison am Schild prüfen"],
		],
	},
	"meer-fisch": {
		title: "Drei Wege, das Meer zu belasten",
		kind: "compare",
		items: [
			["🎣 Wildfang", "Hohe Fangmengen können Bestände verkleinern"],
			["🐟 Aquakultur", "Futterreste können Wasser vor Ort belasten"],
			["♻️ Einwegplastik", "Müll kann über Flüsse ins Meer gelangen"],
		],
	},
	industrie: {
		title: "Vom Rohstoff zum Fahrzeug",
		kind: "flow",
		items: [
			["⛏️ Rohstoff", "Eisenerz gewinnen"],
			["🏭 Verarbeitung", "Stahl herstellen und Teile formen"],
			["🔧 Montage", "Bauteile zum Auto zusammensetzen"],
			["🚛 Absatz", "Fahrzeug an Händler liefern"],
		],
	},
	"tourismus-folgen": {
		title: "Zwei Landschaften, verschiedene Belastungen",
		kind: "compare",
		items: [
			[
				"🎿 Alpen im Winter",
				"Arbeitsplätze und Einnahmen · Wasser und Strom für Beschneiung",
			],
			[
				"🏖️ Mittelmeer im Sommer",
				"Einnahmen in der Hauptsaison · Wasserbedarf in trockenen Monaten",
			],
		],
	},
	reiseplanung: {
		title: "Zwei Wege zur Unterkunft",
		kind: "compare",
		items: [
			["🚆 Bahn", "Weg zum Bahnhof, Umstiege und letzter Fußweg"],
			["🚌 Reisebus", "Einstieg, Fahrstrecke und Halteplatz am Ziel"],
			[
				"🧭 Entscheidung",
				"Gesamtzeit, Zugänglichkeit, Kosten und Umweltwirkung vergleichen",
			],
		],
	},
};

export function renderDiagram(id: string): string {
	const diagram = diagrams[id];
	if (!diagram) return "";
	const list = diagram.kind === "flow" ? "ol" : "ul";
	return `<figure class="concept-diagram"><figcaption>${esc(diagram.title)}</figcaption><${list} class="${diagram.kind}">${diagram.items.map(([label, detail]) => `<li><strong>${esc(label)}</strong><span>${esc(detail)}</span></li>`).join("")}</${list}></figure>`;
}
