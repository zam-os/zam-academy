import type { ModelKind } from "./model/types";

interface Scenario {
	id: string;
	label: string;
	observation: string;
	goal: string;
}

export const MODEL_SCENARIOS: Record<ModelKind, readonly Scenario[]> = {
	cells: [
		{ id: "animal", label: "Mundschleimhaut", observation: "Die Membran umgibt das Zellplasma. Die Mundschleimhautzelle hat keine feste Zellwand.", goal: "Finde eine Zelle ohne Zellwand." },
		{ id: "onion", label: "Innere Zwiebelhaut", observation: "Die Wand begrenzt die Zelle außen. Diese typische Zwiebelhautzelle besitzt eine Vakuole, aber keine Chloroplasten.", goal: "Finde eine Pflanzenzelle ohne Chloroplasten." },
		{ id: "leaf", label: "Grünes Laubblatt", observation: "Im Plasma liegen viele Chloroplasten. Beide Pflanzenbeispiele besitzen Zellwand, Vakuole und Zellkern.", goal: "Finde die Zelle mit Chloroplasten." },
	],
	plant: [
		{ id: "water", label: "Wasser und Mineralstoffe", observation: "Im Xylem führt der Weg aus der Wurzel über die Sprossachse ins Blatt.", goal: "Verfolge Wasser von der Wurzel zum Blatt." },
		{ id: "sugar-store", label: "Zucker zum Speicher", observation: "Das Blatt ist die Zuckerquelle. Im Phloem gelangt Zucker zu einem Speicher, hier in der Wurzel.", goal: "Verfolge Zucker vom Blatt in einen Speicher." },
		{ id: "sugar-growth", label: "Zucker zum Austrieb", observation: "Beim Austrieb liefert der Speicher Zucker. Der Siebteil leitet ihn zu jungen Pflanzenteilen.", goal: "Verfolge Zucker vom Speicher zu einem jungen Blatt." },
	],
	photosynthesis: [
		{ id: "bright", label: "Helles Licht", observation: "Wenn genügend Licht und Ausgangsstoffe verfügbar sind, kann das Blatt mehr Sauerstoff erzeugen als verbrauchen. Es gibt den Überschuss ab.", goal: "Finde einen Fall mit Sauerstoffabgabe." },
		{ id: "dim", label: "Schwaches Licht", observation: "Im gezeigten Beispiel erzeugt die Fotosynthese so viel Sauerstoff, wie die Zellatmung verbraucht. Der Netto-Austausch von Sauerstoff ist annähernd null.", goal: "Finde einen Fall mit ausgeglichenem Sauerstoffaustausch." },
		{ id: "dark", label: "Dunkelheit", observation: "Die Fotosynthese fällt aus. Solange Zucker und Sauerstoff da sind, läuft die Zellatmung weiter und benötigt Sauerstoff.", goal: "Finde den Fall ohne Fotosynthese." },
	],
	circulation: [
		{ id: "right", label: "Rechtes Herz", observation: "Die rechte Herzkammer pumpt sauerstoffarmes Blut zur Lunge.", goal: "Finde den Start des Lungenkreislaufs." },
		{ id: "lung", label: "Lunge", observation: "Das Blut nimmt Sauerstoff auf und gibt Kohlenstoffdioxid ab.", goal: "Finde den Ort der Sauerstoffaufnahme." },
		{ id: "left", label: "Linkes Herz", observation: "Die linke Herzkammer pumpt sauerstoffreiches Blut in den Körper.", goal: "Finde den Start des Körperkreislaufs." },
		{ id: "body", label: "Körpergewebe", observation: "Im Gewebe gibt das Blut Sauerstoff ab und fließt zur rechten Herzseite zurück.", goal: "Finde den Ort der Sauerstoffabgabe." },
	],
	ear: [
		{ id: "outer", label: "Außenohr", observation: "Ohrmuschel und Gehörgang führen Schallwellen zum Trommelfell.", goal: "Verfolge Schall bis zum Trommelfell." },
		{ id: "middle", label: "Mittelohr", observation: "Hammer, Amboss und Steigbügel leiten die Schwingungen bis zum ovalen Fenster weiter.", goal: "Verfolge die mechanische Weiterleitung." },
		{ id: "inner", label: "Innenohr", observation: "Die Flüssigkeit in der Hörschnecke bewegt sich. Haarzellen reagieren und lösen Signale für den Hörnerv aus.", goal: "Finde die Stelle, an der aus Bewegung ein Signal wird." },
	],
	hormones: [
		{ id: "high", label: "Nach dem Essen", observation: "Bei gestiegenem Blutzucker wird mehr Insulin abgegeben. Aufnahme und Speicherung von Glukose nehmen zu; der Blutzucker sinkt wieder.", goal: "Finde die Antwort auf steigenden Blutzucker." },
		{ id: "low", label: "Zwischen Mahlzeiten", observation: "Bei sinkendem Blutzucker kann mehr Glukagon abgegeben werden. Die Leber gibt Glukose ans Blut ab und der Wert steigt wieder.", goal: "Finde die Antwort auf sinkenden Blutzucker." },
	],
};

export function modelReady(kind: ModelKind, explored: readonly string[]): boolean {
	return MODEL_SCENARIOS[kind].every(({ id }) => explored.includes(id));
}

export function recordExploration(
	kind: ModelKind,
	explored: readonly string[],
	selected?: string,
): string[] {
	if (!selected || explored.includes(selected) || !MODEL_SCENARIOS[kind].some(({ id }) => id === selected))
		return [...explored];
	return [...explored, selected];
}
