import { livingLabs } from "../lab/living-models";
import { makeStage } from "./helpers";

export const BREATHING = makeStage(
	{
		id: "atmung",
		stageNumber: 6,
		title: "Atmung des Menschen",
		subtitle: "Vom ersten Luftstrom bis zum Gasaustausch",
		icon: "🫁",
		accent: "#2c768e",
		badgeTitle: "Atmung erklärt",
		lehrplanLabel: "NT7 · 3.1 Atmung des Menschen",
	},
	"3.1",
	3,
	[
		{
			id: "atemwege",
			title: "Der Weg eines Atemzugs",
			subtitle:
				"Verfolge den Weg der Luft und erkläre die Aufgabe der Atemwege.",
			text: [
				"Luft gelangt durch Nase oder Mund in den Rachen. In der Nase werden Teilchen zurückgehalten, und die Luft wird angewärmt und befeuchtet. Beim Atmen strömt sie durch den Kehlkopf in die Luftröhre. Knorpelspangen halten die Luftröhre offen. Beim Schlucken hilft der Kehldeckel, den Eingang zu den Atemwegen zu verschließen.",
				"Die Luftröhre teilt sich in zwei Hauptbronchien. In den Lungenflügeln zweigen feinere Bronchien und Bronchiolen ab. Am Ende liegen viele Lungenbläschen, umgeben von sehr feinen Blutgefäßen. Dort geht Sauerstoff in das Blut über.",
			],
			rule: "Nase oder Mund → Kehlkopf → Luftröhre → Bronchien → Bronchiolen → Lungenbläschen.",
			quiz: [
				"Welche Struktur liegt am Ende der feinen Atemwege?",
				"Lungenbläschen",
				"Kehlkopf",
				"Speiseröhre",
				"Bronchiolen führen in die Bereiche der Lungenbläschen.",
			],
			practice: [
				[
					[
						"Was folgt auf die Luftröhre?",
						"Die Hauptbronchien",
						"Die Nase",
						"Die Speiseröhre",
						"Die Luftröhre verzweigt sich in die beiden Lungenflügel.",
					],
					[
						"Ein Modell zeigt nach den Hauptbronchien sofort einen großen Luftsack. Was würdest du ergänzen?",
						"Feinere Verzweigungen und viele kleine Lungenbläschen.",
						"Nur noch einen zweiten Kehlkopf.",
						"Eine große Öffnung vom Rachen direkt ins Blut.",
						"Die Atemwege verzweigen sich bis zu den vielen Austauschflächen.",
					],
				],
				[
					[
						"Was hält die Luftröhre offen?",
						"Knorpelspangen",
						"Blutplättchen",
						"Lungenbläschen",
						"Die Knorpel stützen die Wand.",
					],
					[
						"Du atmest bei kalter Luft durch die Nase. Welche Aufgabe erfüllt sie unterwegs?",
						"Sie wärmt und befeuchtet einen Teil der Atemluft.",
						"Sie gibt Sauerstoff direkt ans Blut der Lungenbläschen ab.",
						"Sie zieht die Rippen nach oben.",
						"Die Nase bereitet die Atemluft vor dem Weiterströmen vor.",
					],
				],
				[
					[
						"Was umgibt die Lungenbläschen?",
						"Feine Blutkapillaren",
						"Knorpelspangen wie in der Luftröhre",
						"Nur Knochen",
						"Die kleinen Gefäße liegen dicht an der Austauschfläche.",
					],
					[
						"Warum ist „Bronchien → Mund → Lungenbläschen“ als Weg beim Einatmen falsch?",
						"Der Mund ist ein Eingang vor den Bronchien.",
						"Die Lungenbläschen liegen vor der Nase.",
						"Die Atemluft durchläuft zuerst die Blutkapillaren.",
						"Die Luft strömt von außen durch Mund oder Nase nach innen.",
					],
				],
			],
			lab: livingLabs.airway,
		},
		{
			id: "atembewegung",
			title: "Warum die Luft in die Lunge strömt",
			subtitle:
				"Bewege Rippen und Zwerchfell im Modell und vergleiche den Luftstrom.",
			text: [
				"Beim Einatmen zieht sich das Zwerchfell zusammen, wird flacher und bewegt sich nach unten. Muskeln zwischen den Rippen heben den Brustkorb. Der Brustraum wird größer, die Lunge dehnt sich mit, und kurzzeitig ist der Druck in der Lunge geringer als draußen. Luft strömt hinein.",
				"Beim ruhigen Ausatmen entspannen sich die beteiligten Muskeln. Das Zwerchfell wölbt sich nach oben. Brustraum und Lunge werden kleiner, und Luft strömt heraus. Ein Flaschenmodell kann den Einfluss einer bewegten Membran zeigen. Es stellt Rippen und aktive Muskeln nur vereinfacht dar.",
			],
			rule: "Größerer Brustraum beim Einatmen: Druck sinkt, Luft strömt hinein. Beim Ausatmen kehrt sich die Richtung um.",
			quiz: [
				"Was passiert mit dem Zwerchfell beim Einatmen?",
				"Es spannt sich an und wird flacher.",
				"Es entspannt sich und wölbt sich stärker nach oben.",
				"Es verschließt die Luftröhre.",
				"Das absinkende Zwerchfell vergrößert den Brustraum.",
			],
			practice: [
				[
					[
						"Was geschieht mit den Rippen beim Einatmen?",
						"Sie heben sich, der Brustraum wird größer.",
						"Sie senken sich, der Brustraum wird kleiner.",
						"Sie schließen die Bronchiolen.",
						"Die Rippenbewegung trägt zur Erweiterung des Brustraums bei.",
					],
					[
						"Eine Membran im Flaschenmodell wird nach unten gezogen. Was beobachtest du an den Ballons im Inneren?",
						"Sie werden größer, weil Luft hinein strömt.",
						"Sie werden kleiner, weil der Raum größer wird.",
						"Sie bilden neue Luft aus ihrem Gummi.",
						"Durch die Vergrößerung des Raums sinkt zunächst der Druck.",
					],
				],
				[
					[
						"Wohin bewegt sich die Luft beim ruhigen Ausatmen?",
						"Aus der Lunge nach außen",
						"Von außen in die Lunge",
						"Von der Lunge direkt in den Magen",
						"Der kleinere Brustraum begünstigt den Luftstrom nach draußen.",
					],
					[
						"Welche Atembewegung bildet die starre Wand eines Flaschenmodells schlecht ab?",
						"Das Heben und Senken der Rippen",
						"Die Strömungsrichtung im Luftschlauch",
						"Die Verschiebung der Gummimembran",
						"Die Flaschenwand kann sich anders als der Brustkorb nicht bewegen.",
					],
				],
				[
					[
						"Welche Größe ändert sich durch Atemmuskeln zuerst?",
						"Das Volumen des Brustraums",
						"Die Zahl der Lungenbläschen",
						"Der Sauerstoffanteil der Außenluft",
						"Muskeln bewegen Zwerchfell und Rippen.",
					],
					[
						"Innen und außen herrscht gerade gleicher Druck. Was bewegt im vereinfachten Modell jetzt Luft?",
						"Ohne Druckunterschied gibt es keinen gerichteten Luftstrom.",
						"Luft fließt sofort kräftig nach innen.",
						"Luft fließt allein wegen ruhender Rippen heraus.",
						"Ein gerichteter Luftstrom braucht eine Druckdifferenz.",
					],
				],
			],
			lab: livingLabs.ventilation,
		},
		{
			id: "gasaustausch",
			title: "Zwei Gase, zwei Richtungen",
			subtitle:
				"Unterscheide den Weg von Sauerstoff und Kohlenstoffdioxid an der Lunge.",
			text: [
				"Viele Lungenbläschen bilden zusammen eine große Oberfläche. Ihre dünnen Wände liegen an Blutkapillaren. Sauerstoff gelangt aus der Luft im Bläschen ins Blut. Kohlenstoffdioxid gelangt in Gegenrichtung aus dem Blut in das Bläschen und wird ausgeatmet.",
				"Lungenluft und Blut bleiben durch dünne Wände getrennt. Gelöste Gase und Gasteilchen bewegen sich ständig. Im Ergebnis wandert jedes der beiden Gase von der Seite mit höherem zu niedrigerem Teildruck. Blut aus dem Körper ist sauerstoffärmer als Blut, das die Lunge verlässt.",
			],
			rule: "An den Lungenbläschen geht Sauerstoff ins Blut und Kohlenstoffdioxid in die Atemluft.",
			quiz: [
				"In welche Richtung geht Kohlenstoffdioxid an einem Lungenbläschen?",
				"Vom Blut in die Atemluft",
				"Von der Atemluft ins Blut",
				"Von der Atemluft zum Herzmuskel ohne Blut",
				"Kohlenstoffdioxid kommt aus dem Körper mit dem Blut zur Lunge.",
			],
			practice: [
				[
					[
						"Welches Gas gelangt hauptsächlich für den Transport zu den Zellen ins Blut?",
						"Sauerstoff",
						"Kohlenstoffdioxid",
						"Helium",
						"Sauerstoff geht in der Lunge ins Blut über.",
					],
					[
						"Warum helfen viele kleine Bläschen im Vergleich zu einem glatten großen Sack?",
						"Viele Bläschen ergeben zusammen eine große Austauschfläche.",
						"Nur viele Bläschen können Rippen bewegen.",
						"Die Bläschen lassen Blut frei in die Luftwege fließen.",
						"Die fein gegliederte Oberfläche ermöglicht viel Gasaustausch.",
					],
				],
				[
					[
						"Was macht den Austauschweg kurz?",
						"Dünne Wände zwischen Luft und Kapillare",
						"Knorpelspangen weit oben in der Luftröhre",
						"Dicke Muskelschichten zwischen beiden",
						"Gase brauchen dort nur eine geringe Strecke zu überwinden.",
					],
					[
						"Ein Bild zeigt Luftblasen im Blutgefäß als normalen Austausch. Was korrigierst du?",
						"Die Gase treten durch dünne Wände über. Luft und Blut bleiben getrennt.",
						"Nur die Blutkörperchen sollten in die Atemluft wandern.",
						"Im normalen Austausch wird das ganze Blut ausgeatmet.",
						"Beim normalen Austausch gelangen einzelne Gasteilchen jeweils auf die andere Seite.",
					],
				],
				[
					[
						"Was bringt Kohlenstoffdioxid aus dem Körper zur Lunge?",
						"Das Blut",
						"Die Rippen",
						"Eingeatmete Luft",
						"Der Blutstrom transportiert Kohlenstoffdioxid zur Austauschfläche.",
					],
					[
						"Ein Pfeil startet im Lungenbläschen und endet im Blut. Welche Beschriftung passt?",
						"Sauerstoff",
						"Abzuatmendes Kohlenstoffdioxid",
						"Blutplasma",
						"In diese Netto-Richtung wandert Sauerstoff.",
					],
				],
			],
			lab: livingLabs.exchange,
		},
	],
);
