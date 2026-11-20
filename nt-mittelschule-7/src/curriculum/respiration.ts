import { inspection } from "../lab/definitions";
import { makeStage } from "./helpers";

export const RESPIRATION = makeStage(
	{
		id: "zellatmung",
		stageNumber: 7,
		title: "Oxidation in Körperzellen",
		subtitle: "Die chemische Seite der Zellatmung",
		icon: "🍎",
		accent: "#a24e28",
		badgeTitle: "Zellatmung erklärt",
		lehrplanLabel: "M7 · chemischer Bezug zu 3.1 Atmung des Menschen",
	},
	"3.1",
	3,
	[
		{
			id: "zellatmung",
			title: "Wie die Zelle Energie verfügbar macht",
			subtitle:
				"Verfolge Traubenzucker und Sauerstoff von den Ausgangsstoffen zu den Produkten.",
			tracks: ["M"],
			text: [
				"Beim Einatmen gelangt Sauerstoff in die Lunge. Das Blut bringt ihn zu den Körperzellen. Dort reagieren Stoffe aus der Nahrung, zum Beispiel Traubenzucker, in vielen kleinen Schritten mit Sauerstoff. Die Zellatmung macht einen Teil der im Traubenzucker gespeicherten Energie für die Arbeit der Zelle verfügbar. Ein anderer Teil wird als Wärme abgegeben.",
				"Traubenzucker + Sauerstoff → Kohlenstoffdioxid + Wasser. Stoffe stehen in der Wortgleichung am Reaktionspfeil. Daneben kannst du als Hinweis „Energie wird verfügbar“ notieren. Das Kohlenstoffdioxid gelangt über das Blut zur Lunge und wird ausgeatmet. Auch ohne Flamme findet eine Oxidation statt.",
			],
			rule: "Bei der Zellatmung entstehen aus Traubenzucker und Sauerstoff Kohlenstoffdioxid und Wasser. Die Zelle gewinnt nutzbare Energie.",
			quiz: [
				"Wo findet die Zellatmung statt?",
				"In Körperzellen",
				"Nur in der eingeatmeten Luft",
				"Nur in ausgeatmetem Kohlenstoffdioxid",
				"Die Lunge stellt den Gasaustausch sicher. Die Stoffumwandlung läuft in den Zellen ab.",
			],
			practice: [
				[
					[
						"Welcher Stoff steht links in der Wortgleichung?",
						"Traubenzucker",
						"Kohlenstoffdioxid",
						"Wasser",
						"Traubenzucker ist einer der Ausgangsstoffe.",
					],
					[
						"Ein Schüler behauptet, der eingeatmete Sauerstoff komme unverändert wieder heraus. Was fehlt?",
						"Ein Teil des Sauerstoffs wird bei der Zellatmung umgesetzt.",
						"Jedes Sauerstoffteilchen bleibt im Blut eingeschlossen.",
						"Die Lunge bildet neuen Traubenzucker.",
						"Ein Teil wird in den Zellen verbraucht und Kohlenstoffdioxid wird abgegeben.",
					],
				],
				[
					[
						"Welches Gas entsteht bei der Zellatmung?",
						"Kohlenstoffdioxid",
						"Stickstoff",
						"Helium",
						"In der Wortgleichung steht Kohlenstoffdioxid rechts.",
					],
					[
						"Warum steigt bei Bewegung der Bedarf der Muskeln an Sauerstoff?",
						"Ihre Zellen brauchen mehr nutzbare Energie und setzen dafür mehr Stoffe um.",
						"Sauerstoff wird in den Muskeln als Flamme sichtbar.",
						"Die Lunge hört während Bewegung mit dem Gasaustausch auf.",
						"Bei körperlicher Belastung steigt der Energiebedarf der Muskeln.",
					],
				],
				[
					[
						"Was wird bei der Zellatmung nutzbar?",
						"Energie aus den Nährstoffen",
						"Ein neues Element namens Energie",
						"Der gesamte Stickstoff aus der Atemluft",
						"Energie wird umgewandelt und für die Zellarbeit verfügbar.",
					],
					[
						"Warum ist Zellatmung mit einer Oxidation vergleichbar?",
						"Sauerstoff wird umgesetzt, und Stoffe werden umgewandelt.",
						"Sie läuft nur bei sichtbarer Flamme ab.",
						"Sie stellt nur den Transport von Luft dar.",
						"Oxidation mit Sauerstoff ist auch ohne Flamme möglich.",
					],
				],
			],
			lab: inspection(
				"respiration",
				"Stoffe und Energie auf zwei Wegen",
				"Verfolge Ausgangsstoffe, Produkte und Energieumwandlung im Modell.",
				[
					"Finde die Produkte der Zellatmung.",
					"Zeige, was mit der Energie aus dem Traubenzucker geschieht.",
				],
			),
		},
	],
);
