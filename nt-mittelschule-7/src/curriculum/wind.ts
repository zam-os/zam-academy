import { physicsLabs } from "../lab/physics-models";
import { makeStage } from "./helpers";

export const WIND = makeStage(
	{
		id: "wind",
		stageNumber: 3,
		title: "Windkraft",
		subtitle: "Vom drehenden Rotor bis zum Stromnetz",
		icon: "🍃",
		accent: "#20775e",
		badgeTitle: "Windkraft untersucht",
		lehrplanLabel: "NT7 · 2.1 Zusammensetzung und Bedeutung der Luft",
	},
	"2.1",
	2,
	[
		{
			id: "windkraft",
			title: "Wie Wind zu elektrischer Energie beiträgt",
			subtitle:
				"Verfolge die Energie vom Rotor durch den Generator bis zum Netz.",
			text: [
				"Wind ist bewegte Luft. Er übt Kräfte auf die Rotorblätter aus und versetzt den Rotor in Drehung. Die Drehung wird über eine Welle zum Generator übertragen. Der Generator wandelt Bewegungsenergie in elektrische Energie um. Über Leitungen und passende elektrische Einrichtungen gelangt sie ins Stromnetz.",
				"Bei Windstille bleibt ein Rotor stehen und die Anlage liefert keine Energie ins Netz. Bei geeigneter Windstärke kann sie Strom bereitstellen. Erwärmung und Geräusche sind weitere Energieabgaben. Wind entsteht immer wieder durch ungleichmäßige Erwärmung der Erde. Darum zählt er zu den erneuerbaren Energiequellen.",
			],
			rule: "Rotor: Wind setzt eine Drehung in Gang. Generator: Aus Bewegungsenergie wird elektrische Energie.",
			quiz: [
				"Welches Bauteil wandelt die Drehbewegung in elektrische Energie um?",
				"Generator",
				"Rotorblatt",
				"Turm",
				"Der Rotor überträgt die Bewegung über eine Welle zum Generator.",
			],
			practice: [
				[
					[
						"Was nimmt die Bewegungsenergie der Luft zuerst auf?",
						"Der Rotor",
						"Der Netzanschluss",
						"Der Turmfuß",
						"Der Wind übt Kräfte auf die Rotorblätter aus.",
					],
					[
						"Der Rotor dreht, die Anlage ist aber vom Stromnetz getrennt. Was folgt?",
						"Im Modell kann sie nichts ins Netz einspeisen.",
						"Die Netzeinspeisung bleibt genau gleich.",
						"Der Wind hört über dem Standort auf.",
						"Für die Abgabe braucht es auch den Anschluss.",
					],
				],
				[
					[
						"Welche Kette passt?",
						"Windbewegung → Rotordrehung → elektrische Energie",
						"Rotordrehung → elektrische Energie → Windbewegung",
						"Elektrische Energie → Rotordrehung → Windbewegung",
						"Das Windrad nutzt zuerst die bewegte Luft.",
					],
					[
						"Warum kann eine angeschlossene Anlage zeitweise keine elektrische Energie liefern?",
						"Es kann Windstille herrschen.",
						"Der Generator erzeugt ohne Bewegung stets dieselbe Energie.",
						"Ein Netzanschluss liefert den Wind für den Rotor.",
						"Einspeisung erfordert geeigneten Wind und eine funktionierende Anlage.",
					],
				],
				[
					[
						"Warum heißt Wind erneuerbar?",
						"Er entsteht durch natürliche Vorgänge immer wieder.",
						"Eine Anlage speichert stets den ganzen Wind.",
						"Ein Rotor wandelt Verluste zurück in Wind.",
						"Sonneneinstrahlung führt immer wieder zu Luftbewegung.",
					],
					[
						"Ein Windrad wird etwas warm und erzeugt Geräusche. Ist dabei Energie verschwunden?",
						"Energie wurde auch als Wärme und Schall abgegeben.",
						"Jede Erwärmung vernichtet Energie.",
						"Die gesamte Energie steckt im Netz.",
						"Energie nimmt verschiedene Formen an.",
					],
				],
			],
			lab: physicsLabs.wind,
		},
		{
			id: "windstandort",
			title: "Wo könnte ein Windrad stehen?",
			subtitle: "Wäge Windangebot, Kosten, Naturschutz und Belange vor Ort ab.",
			tracks: ["M"],
			text: [
				"Ein guter Standort hat oft nutzbaren Wind. Straßen und Netzanschluss beeinflussen die Kosten. Auch Flächenbedarf, Vögel und Fledermäuse, Schutzgebiete, Landschaftsbild, Geräusche und Abstand zu Wohnhäusern zählen. Menschen vor Ort sollen verstehen, was geplant ist und wie ihre Interessen berücksichtigt werden.",
				"Ein windiger Höhenzug kann viel Energie liefern, aber für Zugvögel wichtig sein und neue Zufahrten brauchen. Ein geeigneterer Alternativort kann näher am Netz liegen. Windkraft benötigt im Betrieb keinen Brennstoff. Sie liefert wetterabhängig und die Herstellung der Anlage benötigt Material und Energie. Für echte Entscheidungen braucht es Messungen und Fachprüfungen.",
			],
			rule: "Ein Standort braucht Wind und einen tragfähigen Ausgleich zwischen Wirtschaft, Ökologie und Interessen der Menschen.",
			quiz: [
				"Was reicht allein für die Standortwahl?",
				"Keines der Kriterien allein",
				"Nur ein hoher Windwert",
				"Nur die nächste Straße",
				"Ein Standort kann beim Wind gut und beim Naturschutz ungünstig sein.",
			],
			practice: [
				[
					[
						"Welches Merkmal kann die Baukosten senken?",
						"Eine nahe geeignete Zufahrt",
						"Ein langer neuer Weg",
						"Größere Entfernung zum Netz",
						"Kurze geeignete Wege und Leitungen können günstiger sein.",
					],
					[
						"Auf der Windkarte gewinnt eine Hochfläche, auf der Naturschutzkarte liegt dort eine Flugroute. Was ist sinnvoll?",
						"Die Flugroute und Alternativen prüfen.",
						"Die Flugroute wegen des guten Winds ignorieren.",
						"Nur noch die Zufahrt vergleichen.",
						"Standortkarten beantworten verschiedene Fragen.",
					],
				],
				[
					[
						"Was ist ein Vorteil der Windkraft im Betrieb?",
						"Sie benötigt keinen verbrannten Brennstoff.",
						"Sie liefert bei Windstille immer gleich viel.",
						"Sie braucht keine Fläche.",
						"Die Anlage nutzt Bewegungsenergie der Luft.",
					],
					[
						"Welche Frage gehört zur sozialen Seite der Abwägung?",
						"Wie werden Anwohnende beteiligt und welche Geräusche erreichen sie?",
						"Wie hoch ist nur der Einkaufspreis des Generators?",
						"Wie misst man nur die Rotordrehzahl?",
						"Soziale Fragen betreffen die Menschen vor Ort.",
					],
				],
				[
					[
						"Welche Folge kann ein windarmer Standort haben?",
						"Wenig nutzbare Energie trotz guter Anbindung",
						"Gleiche Erträge wie jeder windreiche Ort",
						"Mehr Wind durch einen kürzeren Fahrweg",
						"Gute Anbindung gleicht einen schwachen Windstandort allein nicht aus.",
					],
					[
						"Zwei Orte liefern ähnlich viel Wind. Einer braucht einen neuen Weg durch ein wertvolles Gebiet. Welche Information hilft weiter?",
						"Wie stark Wege und Leitungen beide Gebiete verändern würden.",
						"Nur welcher Name kürzer ist.",
						"Nur die Zahl der Rotorblätter.",
						"Bei ähnlichem Energieertrag können unterschiedliche Eingriffe entscheidend sein.",
					],
				],
			],
			lab: physicsLabs.windSite,
		},
	],
);
