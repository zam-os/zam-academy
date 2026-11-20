import { livingLabs } from "../lab/living-models";
import { makeStage } from "./helpers";

export const ANIMALS = makeStage(
	{
		id: "wirbeltiere",
		stageNumber: 5,
		title: "Wirbeltiere an Land und in der Luft",
		subtitle: "Körperbau vergleichen und Fortbewegung erklären",
		icon: "🦇",
		accent: "#55792f",
		badgeTitle: "Wirbeltiere verglichen",
		lehrplanLabel: "NT7 · 2.3 Tiere an Land und in der Luft",
	},
	"2.3",
	2,
	[
		{
			id: "wirbeltierklassen",
			title: "Eine Fledermaus ist kein Vogel",
			subtitle:
				"Bestimme fünf Wirbeltierklassen anhand von Körperbedeckung und Körperbau.",
			text: [
				"Wirbeltiere besitzen eine Wirbelsäule. Kopf und Rumpf sind gemeinsame Körperabschnitte. Gehirn und Rückenmark bilden das Zentralnervensystem. Zur Einordnung nutzt du mehrere Merkmale. Fische haben meist Schuppen, Flossen und Kiemen. Amphibien haben oft feuchte, drüsenreiche Haut. Reptilien haben trockene Hornschuppen. Vögel haben Federn. Säugetiere besitzen Haare und säugen ihre Jungen.",
				"Bachforelle, Grasfrosch, Zauneidechse, Mauersegler und Abendsegler stehen für diese fünf Klassen. Mauersegler und Abendsegler können beide fliegen. Federn am Mauersegler und Fell und Flughaut am Abendsegler führen zu verschiedenen Klassen.",
			],
			rule: "Ein gemeinsamer Lebensraum reicht zur Einordnung nicht. Prüfe mehrere Merkmale des Aussehens und Körperbaus.",
			quiz: [
				"Welches Merkmal zeigt bei einem heimischen fliegenden Tier die Vogelklasse?",
				"Federn",
				"Flugfähigkeit",
				"Eine Wirbelsäule",
				"Flugfähigkeit gibt es auch bei Säugetieren und eine Wirbelsäule bei allen fünf Klassen.",
			],
			practice: [
				[
					[
						"Welche Kombination passt zu einer Bachforelle?",
						"Kiemen und Flossen",
						"Federn und Flügel",
						"Hornschuppen und Krallen",
						"Fische nutzen Kiemen zur Atmung und Flossen zur Fortbewegung.",
					],
					[
						"Ein Tier schwimmt gut, hat aber Fell und säugt seine Jungen. Welche Klasse passt?",
						"Säugetiere",
						"Fische",
						"Amphibien",
						"Fell und das Säugen sind geeigneter für die Zuordnung als Schwimmen.",
					],
				],
				[
					[
						"Was verbindet Grasfrosch und Mauersegler?",
						"Beide haben eine Wirbelsäule.",
						"Beide haben Federn.",
						"Beide haben Kiemen als erwachsene Tiere.",
						"Beide gehören zu den Wirbeltieren.",
					],
					[
						"Du findest ein Tier mit trockener Hornschuppenhaut statt feuchter Haut. Welche der beiden Klassen liegt näher?",
						"Reptilien",
						"Amphibien",
						"Säugetiere",
						"Trockene Hornschuppen passen zur Zauneidechse.",
					],
				],
				[
					[
						"Woraus besteht das Zentralnervensystem?",
						"Gehirn und Rückenmark",
						"Nur Beine und Flügel",
						"Herz und Lunge",
						"Gehirn und Rückenmark sind bei Wirbeltieren zentrale Teile des Nervensystems.",
					],
					[
						"Warum solltest du ein kaum sichtbares Tier nicht allein am Flügel erkennen?",
						"Vogelflügel und Fledermausflügel können ähnlich wirken. Federn oder Flughaut helfen.",
						"Alle fliegenden Wirbeltiere haben Federn.",
						"Flügel schließen die Zugehörigkeit zu den Säugetieren aus.",
						"Prüfe das Material der Tragfläche und die Körperbedeckung.",
					],
				],
			],
			lab: livingLabs.animals,
		},
		{
			id: "fortbewegung",
			title: "Füße, Flossen und Flügel",
			subtitle:
				"Vergleiche, wie ein Merkmal in Wasser, an Land oder in der Luft nützt.",
			text: [
				"Im Wasser bremst der Widerstand die Bewegung. Die Bachforelle hat eine stromlinienförmige Gestalt. Rumpf und Schwanzflosse geben Vortrieb, andere Flossen helfen beim Steuern. An Land braucht ein Tier Halt und muss sein Gewicht tragen. Die Zauneidechse läuft mit Beinen und Krallen. Der Grasfrosch springt mit kräftigen Hinterbeinen und nutzt diese auch beim Schwimmen.",
				"Mauersegler und Abendsegler erzeugen Auftrieb mit Flügeln. Beim Vogel tragen Federn zur Flügelfläche bei. Beim Abendsegler ist Flughaut zwischen langen Fingern gespannt. Zwei unterschiedliche Körperbauten erfüllen in der Luft eine ähnliche Aufgabe.",
			],
			rule: "Erkläre eine Angepasstheit mit einem Merkmal und seiner Funktion in einem bestimmten Medium.",
			quiz: [
				"Wie verringert die Bachforelle ihren Widerstand beim Schwimmen?",
				"Durch ihre stromlinienförmige Körperform",
				"Durch trockene Hornschuppen an Krallen",
				"Durch Federn an der Schwanzflosse",
				"Ein stromlinienförmiger Körper lässt Wasser günstiger vorbeiströmen.",
			],
			practice: [
				[
					[
						"Welche Struktur liefert der Forelle vor allem Vortrieb?",
						"Rumpf und Schwanzflosse",
						"Kiemen",
						"Brustkorb",
						"Körper und Schwanz drücken Wasser nach hinten.",
					],
					[
						"Die Forelle soll im Modell langsam wenden. Welche Strukturen spielen dabei eine Rolle?",
						"Steuernde Flossen",
						"Die Kiemen als Antrieb",
						"Die Hornschuppen einer Eidechse",
						"Flossen können Bewegungsrichtung und Lage verändern.",
					],
				],
				[
					[
						"Wozu hat eine Fledermaus lange Finger?",
						"Sie tragen und spannen die Flughaut.",
						"Sie halten beim Schwimmen Kiemen offen.",
						"Sie ersetzen Federn durch Hornschuppen.",
						"Die Finger geben der beweglichen Flughaut Form.",
					],
					[
						"Zwei Tiere haben Flügel. Welcher Vergleich erklärt ihren Aufbau?",
						"Der Vogel hat Federn, die Fledermaus eine Flughaut.",
						"Beide bauen die Flügelfläche aus Federn.",
						"Beide fliegen mit Hinterbeinen statt Flächen.",
						"Verschiedene Tragflächen erzeugen Auftrieb.",
					],
				],
				[
					[
						"Welches Merkmal unterstützt den Sprung des Froschs?",
						"Kräftige Hinterbeine",
						"Kiemen des erwachsenen Tiers",
						"Schmale Federflügel",
						"Die Hinterbeine können den Körper kräftig abstoßen.",
					],
					[
						"Warum nützt dem Frosch dieselbe Beinbewegung im Wasser anders als an Land?",
						"An Land stößt er sich vom Untergrund ab. Im Wasser drückt er Wasser nach hinten.",
						"Im Wasser trägt ihn ausschließlich der Luftauftrieb.",
						"Die Hinterbeine bewegen sich nur an Land.",
						"Was sich abstützt oder zurückgedrückt wird, hängt vom Medium ab.",
					],
				],
			],
			lab: livingLabs.locomotion,
		},
	],
);
