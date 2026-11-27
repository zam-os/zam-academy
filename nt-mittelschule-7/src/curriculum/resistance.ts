import { physicsLabs } from "../lab/physics-models";
import { makeStage } from "./helpers";

export const RESISTANCE = makeStage(
	{
		id: "widerstand",
		stageNumber: 10,
		title: "Elektrischer Widerstand",
		subtitle: "Messwerte auswerten, Leitungen vergleichen und Risiken erkennen",
		icon: "🔌",
		accent: "#765097",
		badgeTitle: "Widerstand erklärt",
		lehrplanLabel: "NT7 · 4.2 Elektrischer Widerstand",
	},
	"4.2",
	4,
	[
		{
			id: "widerstand",
			title: "Wie stark ein Bauteil den Strom begrenzt",
			subtitle: "Berechne aus Spannung und Stromstärke den Widerstand.",
			text: [
				"Ein enger Durchgang bremst in einem Vergleichsmodell einen Fluss. In einem elektrischen Kreis begrenzt ein größerer Widerstand bei gleicher Spannung die Stromstärke. Der Durchgang veranschaulicht, wie der Fluss begrenzt wird. Die Bewegung elektrischer Ladungen im Metall folgt anderen Regeln.",
				"Bei 4 V und 0,1 A ist der Widerstand 4 V geteilt durch 0,1 A, also 40 Ω. Liegen an einem ohmschen Widerstand bei gleichbleibender Temperatur 8 V an, fließen 0,2 A und der Quotient bleibt 40 Ω. Dieses proportionale Verhältnis von Spannung und Stromstärke bei konstanter Temperatur heißt Ohm’sches Gesetz, benannt nach Georg Simon Ohm. Für andere Bauteile kann sich der Quotient verändern. Bei einem warm werdenden Glühfaden kann sich der Widerstand ändern.",
			],
			rule: "R = U ÷ I. Miss U in Volt und I in Ampere. Der Quotient hat die Einheit Ohm (Ω).",
			quiz: [
				"Wie ändert sich die Stromstärke bei gleicher Spannung und größerem Widerstand?",
				"Sie wird kleiner.",
				"Sie wird größer.",
				"Sie bleibt bei jedem Widerstand gleich.",
				"Ein größerer Widerstand begrenzt den Ladungsfluss stärker.",
			],
			practice: [
				[
					[
						"Wie groß ist R bei 6 V und 0,2 A?",
						"30 Ω",
						"12 Ω",
						"3 Ω",
						"Teile 6 durch 0,2.",
						[30, "Ω", 0],
					],
					[
						"Bei 9 V fließen 150 mA. Wie groß ist der Widerstand?",
						"60 Ω",
						"0,06 Ω",
						"1350 Ω",
						"150 mA sind 0,15 A. Teile 9 durch 0,15.",
						[60, "Ω", 0],
					],
				],
				[
					[
						"Welche Rechnung liefert den Widerstand?",
						"Spannung geteilt durch Stromstärke",
						"Stromstärke geteilt durch Spannung",
						"Spannung mal Stromstärke",
						"Widerstand misst Volt pro Ampere.",
					],
					[
						"Messpaar A ist 4 V und 0,1 A. Paar B ist 8 V und 0,2 A. Was ist gleich?",
						"Der Widerstand von 40 Ω",
						"Die Spannungen",
						"Die Stromstärken",
						"Wenn beide Größen verdoppelt werden, bleibt ihr Quotient gleich.",
					],
				],
				[
					[
						"Wie viel sind 250 mA in Ampere?",
						"0,25 A",
						"2,5 A",
						"25 A",
						"Teile die Milliampere durch 1000.",
						[0.25, "A", 2],
					],
					[
						"Zwei Bauteile liegen im Vergleich je an 6 V. Bei A misst du 100 mA, bei B 200 mA. Welches hat den größeren Widerstand?",
						"A",
						"B",
						"Beide sind gleich.",
						"Bei gleicher Spannung gehört der kleinere Strom zum größeren Widerstand.",
					],
				],
			],
			lab: physicsLabs.resistance,
		},
		{
			id: "leiterwahl",
			title: "Länge, Dicke und Material eines Leiters",
			subtitle: "Begründe die Leiterwahl mithilfe eines fairen Vergleichs.",
			text: [
				"Vergleiche gleich warme Leitungen. Je länger ein Kabel aus gleichem Material und mit gleicher Querschnittsfläche ist, desto größer sein Widerstand. Je größer der Querschnitt eines gleich langen Leiters ist, desto kleiner sein Widerstand. Kupfer hat bei gleicher Geometrie und Temperatur einen kleineren Widerstand als Aluminium. In der Praxis zählen zusätzlich Gewicht, Kosten und die Eignung des ganzen Kabels.",
				"Ein dickerer Leiter kann bei gleicher Länge einen geringeren Widerstand haben. So geht bei gleichem Strom weniger Energie als Wärme in der Leitung ab. Im M-Zug vergleichst du außerdem die Temperatur. Der Widerstand von Kupfer- und Aluminiumleitungen steigt im gezeigten Temperaturbereich mit der Erwärmung.",
			],
			rule: "Bei sonst gleichen Bedingungen erhöhen mehr Länge und ein weniger gut leitendes Material den Widerstand. Mehr Querschnitt senkt ihn.",
			quiz: [
				"Welche Änderung senkt den Widerstand bei gleicher Länge und gleichem Material?",
				"Querschnittsfläche vergrößern",
				"Querschnittsfläche verkleinern",
				"Einen längeren Leiter verwenden",
				"Ein Leiter mit mehr Querschnitt hat bei sonst gleichen Bedingungen weniger Widerstand.",
			],
			practice: [
				[
					[
						"Welche von zwei sonst gleichen Leitungen hat weniger Widerstand?",
						"Die kürzere",
						"Die längere",
						"Die mit der kleineren Querschnittsfläche",
						"Ein kürzerer Leiter bietet dem Strom weniger Widerstand.",
					],
					[
						"Ein Kabel ist länger geworden. Wie könnte man seinen Widerstand bei gleichem Material senken?",
						"Einen größeren Querschnitt wählen.",
						"Den Querschnitt verkleinern.",
						"Das Kabel zusätzlich verlängern.",
						"Eine größere Querschnittsfläche wirkt der Erhöhung entgegen.",
					],
				],
				[
					[
						"Welches Metall hat bei gleichen Abmessungen im Modell weniger Widerstand?",
						"Kupfer",
						"Aluminium",
						"Beide haben immer denselben Widerstand.",
						"Die Stoffeigenschaft ist beim Materialvergleich verschieden.",
					],
					[
						"Ein kurzes Aluminiumkabel und ein langes Kupferkabel werden verglichen. Kannst du aus dem Material allein auf das Ergebnis schließen?",
						"Nein. Querschnitt und Länge können das Ergebnis mitbestimmen.",
						"Ja. Material dominiert jeden anderen Einfluss immer.",
						"Ja. Bei Metall spielt nur die Farbe eine Rolle.",
						"Ändert sich mehr als eine Größe, genügt eine einzelne Angabe zur Bewertung nicht.",
					],
				],
				[
					[
						"Was hältst du fest, wenn du nur den Einfluss der Länge prüfen willst?",
						"Material, Querschnitt und Temperatur",
						"Nur die Farbe des Steckers",
						"Nur die veränderte Länge",
						"Ein fairer Vergleich ändert die Länge allein.",
					],
					[
						"Ein Modell zeigt bei gleicher Spannung mit größerem Widerstand weniger Strom. Wie sollte ein Leiter aussehen, wenn möglichst wenig Widerstand erwünscht ist?",
						"Kurz und mit passendem großem Querschnitt",
						"Möglichst lang und dünn",
						"Möglichst dünn, ganz unabhängig vom Material",
						"Kürzere Länge und größere Querschnittsfläche verringern den Widerstand.",
					],
				],
			],
			lab: physicsLabs.wire,
		},
		{
			id: "stromsicherheit",
			title: "Weshalb Strom im Alltag gefährlich werden kann",
			subtitle:
				"Erkenne beschädigte Leitungen, unerwünschte Stromwege und Überlastung.",
			text: [
				"Der menschliche Körper kann Strom leiten. Beschädigte Isolierungen oder leitfähiges Wasser können unerwünschte Stromwege ermöglichen. Halte im Alltag Netzgeräte von Wasser fern und benutze beschädigte Geräte nicht. Lass Netzgeräte, Steckdosen und Reparaturen von Erwachsenen oder Fachleuten prüfen. Schulversuche verwenden nur dafür geeignete Spannungsquellen unter Aufsicht.",
				"Mehrere leistungsstarke Geräte an einer Steckdosenleiste können die zulässige Belastung überschreiten. Leitungen können sich dadurch stark erwärmen. Sicherungen schützen Leitungen vor zu hohem Strom. Ein Fehlerstrom-Schutzschalter kann bei einem unerwünschten Stromweg abschalten. Vorsicht und intakte Geräte bleiben wichtig.",
			],
			rule: "Intakte Isolierung, Abstand zu Wasser und geeignete Belastung schützen vor gefährlichen Stromwegen und Überhitzung.",
			quiz: [
				"Was ist bei einer sichtbar beschädigten Netzleitung sinnvoll?",
				"Abstand halten und einer erwachsenen Person Bescheid sagen.",
				"Die offene Stelle kurz anfassen.",
				"Das Gerät nur besonders schnell benutzen.",
				"Beschädigte Isolierung kann den Schutz vor stromführenden Teilen aufheben.",
			],
			practice: [
				[
					[
						"Was schützt vor Berührung eines leitenden Drahtes?",
						"Eine intakte Isolierung",
						"Ein farbiger Strompfeil",
						"Eine besonders lange offene Leitung",
						"Die Isolierung trennt die Hand vom leitenden Teil.",
					],
					[
						"Warum ist ein Netzgerät am nassen Rand eines Waschbeckens riskant?",
						"Wasser kann einen zusätzlichen leitenden Weg schaffen.",
						"Nässe macht jede Leitung zum Nichtleiter.",
						"Wasser stoppt den Stromfluss im Gerät immer.",
						"Wasser aus dem Alltag enthält meist gelöste Stoffe und kann Strom leiten.",
					],
				],
				[
					[
						"Wogegen schützt eine passende Sicherung vor allem?",
						"Zu hohen Strom in der Leitung",
						"Eine leere Batterie",
						"Zu kleine Leuchtkraft einer Lampe",
						"Bei zu großer Stromstärke wird der Kreis abgeschaltet.",
					],
					[
						"Mehrere Heizgeräte an einer Leiste sollen gleichzeitig laufen. Welche Frage ist wichtig?",
						"Ob die zulässige Belastung der Steckdosenleiste eingehalten wird.",
						"Ob die Geräte dieselbe Farbe haben.",
						"Ob die Leiste einen lange aufgerollten Draht zeigt.",
						"Überlastung kann zu Erwärmung und Brandgefahr führen.",
					],
				],
				[
					[
						"Wo finden echte Experimente am sicheren Schulstromkreis statt?",
						"Beaufsichtigt mit dafür geeigneten Geräten und Quellen",
						"An beliebigen geöffneten Netzgeräten",
						"An der Steckdose ohne Aufsicht",
						"Geeignete Quellen und Geräte begrenzen das Risiko.",
					],
					[
						"Ein Sicherungsautomat schaltet wiederholt ab. Was ist der sinnvolle Umgang?",
						"Den Grund durch eine zuständige Person prüfen lassen.",
						"Die Sicherung umgehen.",
						"Mehr Geräte anschließen, damit der Strom sich selbst verteilt.",
						"Wiederholtes Abschalten kann auf Überlastung oder einen Defekt hinweisen.",
					],
				],
			],
			lab: physicsLabs.electricalSafety,
		},
	],
);
