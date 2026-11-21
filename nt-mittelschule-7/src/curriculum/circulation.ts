import { livingLabs } from "../lab/living-models";
import { makeStage } from "./helpers";

export const CIRCULATION = makeStage(
	{
		id: "kreislauf",
		stageNumber: 8,
		title: "Herz und Blutkreislauf",
		subtitle:
			"Körperzellen versorgen, Pumpbewegung erklären und Gesundheit einordnen",
		icon: "🫀",
		accent: "#a43f61",
		badgeTitle: "Kreislauf verstanden",
		lehrplanLabel: "NT7 · 3.2 Herz-Kreislauf-System",
	},
	"3.2",
	3,
	[
		{
			id: "blutbestandteile",
			title: "Blut kann mehr als Sauerstoff tragen",
			subtitle: "Ordne den wichtigsten Blutbestandteilen je eine Aufgabe zu.",
			text: [
				"Blut besteht aus flüssigem Blutplasma und festen Bestandteilen. Plasma enthält vor allem Wasser und transportiert gelöste Stoffe. Rote Blutkörperchen enthalten Hämoglobin, das Sauerstoff bindet. Weiße Blutkörperchen gehören zur Abwehr. Blutplättchen wirken mit weiteren Stoffen beim Wundverschluss.",
				"Bei starkem Blutverlust oder bestimmten Behandlungen können Blutspenden nötig sein. Aus gespendetem Blut können passende Blutbestandteile gewonnen werden. Betroffene können beispielsweise rote Blutkörperchen zur Unterstützung des Sauerstofftransports erhalten.",
			],
			rule: "Plasma transportiert gelöste Stoffe, rote Blutkörperchen Sauerstoff, weiße dienen der Abwehr und Plättchen helfen beim Wundverschluss.",
			quiz: [
				"Welcher Bestandteil bindet mithilfe von Hämoglobin Sauerstoff?",
				"Rote Blutkörperchen",
				"Weiße Blutkörperchen",
				"Blutplättchen",
				"Hämoglobin gibt den roten Blutkörperchen auch ihre Farbe.",
			],
			practice: [
				[
					[
						"Was ist der flüssige Anteil des Bluts?",
						"Blutplasma",
						"Blutplättchen",
						"Hämoglobin",
						"Das Plasma enthält vor allem Wasser und gelöste Stoffe.",
					],
					[
						"Worin kann gelöster Traubenzucker im Blut transportiert werden?",
						"Im Blutplasma",
						"Nur im Zellkern weißer Blutkörperchen",
						"In den Herzklappen",
						"Gelöste Stoffe können im flüssigen Anteil mitströmen.",
					],
				],
				[
					[
						"Welcher Bestandteil hilft der Abwehr?",
						"Weiße Blutkörperchen",
						"Blutplättchen",
						"Nur rote Blutkörperchen",
						"Weiße Blutkörperchen gehören zum Immunsystem.",
					],
					[
						"Eine kleine Wunde hört zu bluten auf. Was hat dabei mitgewirkt?",
						"Blutplättchen und Stoffe der Blutgerinnung",
						"Nur der Sauerstofftransport",
						"Nur der Körperkreislauf ohne feste Blutbestandteile",
						"Blutplättchen sammeln sich an der verletzten Stelle und unterstützen den Verschluss.",
					],
				],
				[
					[
						"Warum sind Blutspenden wichtig?",
						"Sie stellen Blutbestandteile für Behandlungen bereit.",
						"Sie ersetzen beim Menschen das Atmen.",
						"Sie erzeugen neue Herzklappen.",
						"Spenden können bei Blutverlust oder in Behandlungen nötig sein.",
					],
					[
						"Für einen Menschen fehlt nach Blutverlust besonders Sauerstofftransport. Welcher Bestandteil erfüllt diese Aufgabe?",
						"Rote Blutkörperchen",
						"Nur weiße Blutkörperchen",
						"Nur Blutplättchen",
						"Rote Blutkörperchen transportieren mit Hämoglobin den größten Teil des Sauerstoffs.",
					],
				],
			],
			lab: livingLabs.blood,
		},
		{
			id: "blutkreislauf",
			title: "Ein Kreislauf mit zwei Schleifen",
			subtitle: "Verfolge das Blut durch Herz, Lunge und Körper.",
			text: [
				"Die rechte Herzhälfte pumpt sauerstoffärmeres Blut zur Lunge. Dort nimmt es Sauerstoff auf und gibt Kohlenstoffdioxid ab. Es fließt zur linken Herzhälfte zurück. Diese pumpt es in den Körper. In Körperkapillaren gelangen Sauerstoff und Nährstoffe zu den Zellen. Das Blut nimmt dort unter anderem Kohlenstoffdioxid auf und kehrt zum rechten Herzen zurück.",
				"Eine Arterie führt vom Herzen weg, eine Vene zum Herzen hin. Daran erkennst du ihre Bezeichnung. Die Lungenarterie enthält sauerstoffärmeres Blut, obwohl sie eine Arterie ist. Kapillaren sind sehr kleine Gefäße zwischen dem arteriellen und venösen Teil.",
			],
			rule: "Rechtes Herz → Lunge → linkes Herz → Körper → rechtes Herz. Arterien führen vom Herzen weg, Venen dorthin zurück.",
			quiz: [
				"Wohin pumpt die rechte Herzhälfte Blut?",
				"Zur Lunge",
				"Direkt zu den Beinmuskeln",
				"Direkt zur linken Kammer",
				"Die rechte Seite ist die Pumpe der Lungenschleife.",
			],
			practice: [
				[
					[
						"Wo findet der Austausch mit Körperzellen statt?",
						"In den Körperkapillaren",
						"Im großen Herzvorhof",
						"Erst in der Luftröhre",
						"Dünne Kapillarwände liegen nahe bei den Zellen.",
					],
					[
						"Sauerstoffreicheres Blut verlässt die Lunge. Welche Herzseite folgt?",
						"Die linke Herzhälfte",
						"Die rechte Herzhälfte",
						"Die Lunge sendet es direkt in die Beine.",
						"Von der Lunge gelangt es zur Pumpe der Körperschleife.",
					],
				],
				[
					[
						"Wie erkennst du eine Arterie?",
						"Sie führt Blut vom Herzen weg.",
						"Sie enthält immer viel Sauerstoff.",
						"Sie führt Blut stets zum Herzen zurück.",
						"Der Name folgt der Strömungsrichtung zum Herzen.",
					],
					[
						"Ein Bild färbt sauerstoffarmes Blut blau. Was bedeutet das?",
						"Die Farbe zeigt einen Unterschied im Sauerstoffgehalt. Blut ist auch sauerstoffärmer rot.",
						"Dieses Blut ist im Körper blau.",
						"Diese Pfeile zeigen nur frische Atemluft.",
						"Die Farben sind eine Modellkonvention.",
					],
				],
				[
					[
						"Was ist die Aufgabe der linken Herzhälfte?",
						"Blut in die Körperschleife pumpen",
						"Luft in die Lungenbläschen pumpen",
						"Blut aus dem Körper direkt zur Lunge pumpen",
						"Die linke Herzhälfte versorgt über die Körperschleife Organe und Gewebe.",
					],
					[
						"Warum heißt das Gefäß vom rechten Herzen zur Lunge Lungenarterie?",
						"Es führt Blut vom Herzen weg.",
						"Es enthält am meisten Sauerstoff.",
						"Es führt von der Lunge ins Herz zurück.",
						"Die Flussrichtung bestimmt, ob ein Gefäß Arterie oder Vene heißt.",
					],
				],
			],
			lab: livingLabs.circulation,
		},
		{
			id: "herzpumpe",
			title: "Wie Herzmuskel und Klappen zusammenarbeiten",
			subtitle: "Wechsle zwischen Füllen und Auswerfen einer Herzkammer.",
			text: [
				"Das Herz hat zwei Vorhöfe und zwei Kammern. Blut gelangt aus den Venen in die Vorhöfe und bei entspannten Kammern weiter in die Kammern. Zieht sich der Herzmuskel einer Kammer zusammen, steigt dort der Druck. Die Klappe zum Vorhof schließt und sobald der Druck groß genug ist, öffnet sich die Klappe zur Arterie. Blut wird herausgepumpt.",
				"Nach dem Auswerfen erschlafft der Muskel. Wenn der Kammerdruck sinkt, verhindert die geschlossene Auslassklappe den Rückstrom. Beim nächsten Füllen öffnet sich die Einlassklappe wieder. Das Modell zeigt nur eine Herzhälfte und zwei Phasen vereinfacht.",
			],
			rule: "Der Herzmuskel erzeugt Druck. Klappen lassen Blut je nach Druck in die passende Richtung strömen.",
			quiz: [
				"Was verhindert Rückfluss in den Vorhof beim Auswerfen?",
				"Die geschlossene Einlassklappe",
				"Die Luftröhre",
				"Das Entspannen des Zwerchfells",
				"Beim Auswerfen ist der Druck in der Kammer höher als im Vorhof.",
			],
			practice: [
				[
					[
						"Wie viele Kammern hat das Herz?",
						"Zwei",
						"Eine",
						"Vier",
						"Es gibt je eine Kammer in der rechten und der linken Herzhälfte.",
					],
					[
						"Im Modell steigt der Druck der Kammer über den Druck in der Arterie. Welche Klappe kann öffnen?",
						"Die Auslassklappe zur Arterie",
						"Die Einlassklappe zum Vorhof",
						"Beide öffnen für Rückstrom.",
						"Der hohe Kammerdruck treibt Blut in Richtung Arterie.",
					],
				],
				[
					[
						"Wohin fließt Blut beim Füllen der Kammer?",
						"Vom Vorhof in die Kammer",
						"Von der Kammer zurück in den Vorhof",
						"Von der Arterie in den Vorhof",
						"Die offene Einlassklappe erlaubt den Weg zur Kammer.",
					],
					[
						"Ein Modell zeigt Blut in einer Entspannungsphase aus der Arterie zurückströmen. Welche Funktion fehlt?",
						"Die Auslassklappe, die Rückfluss verhindert.",
						"Eine zweite Luftröhre für den Rückweg.",
						"Weiße Blutkörperchen als Türstopper.",
						"Die Auslassklappe schließt, wenn der Kammerdruck fällt.",
					],
				],
				[
					[
						"Was zieht sich zusammen und erzeugt Druck?",
						"Der Herzmuskel",
						"Die Vorhofklappe allein",
						"Die Körperkapillaren",
						"Beim Zusammenziehen wird Blut aus der Kammer gepresst.",
					],
					[
						"Warum genügt ein Modell mit einer Kammer zur Erklärung der Klappen, aber nicht des ganzen Kreislaufs?",
						"Es zeigt den Richtungswechsel der Klappen, aber nicht beide Herzseiten und Schleifen.",
						"Im Körper gibt es nur die dargestellte Herzkammer.",
						"Nur der Körperkreislauf benötigt ein Herz.",
						"Das Modell erklärt einen Ausschnitt der Herzfunktion.",
					],
				],
			],
			lab: livingLabs.pump,
		},
		{
			id: "kreislaufgesundheit",
			title: "Was Herz und Gefäße im Alltag beeinflusst",
			subtitle:
				"Vergleiche Gewohnheiten und begründe eine kreislauffreundliche Entscheidung.",
			text: [
				"Regelmäßige Bewegung kräftigt die Ausdauer und kann Herz und Gefäße unterstützen. Ausgewogenes Essen und ausreichend Schlaf gehören zu einem gesunden Alltag. Rauchen belastet Gefäße und erhöht langfristig das Risiko für Erkrankungen. Auch eine Ernährung mit sehr viel Salz kann den Blutdruck bei vielen Menschen erhöhen.",
				"Zwei Kinder überlegen, den letzten sicheren Abschnitt zur Schule zu Fuß zu gehen. Dabei zählt auch, ob der Weg für beide geeignet ist. Regelmäßige passende Bewegung ist eine der Möglichkeiten, den Kreislauf zu trainieren. Einzelne Gewohnheiten erklären eine Erkrankung selten allein.",
			],
			rule: "Vergleiche mehrere Einflüsse auf Herz und Gefäße. Regelmäßige Bewegung und Rauchfreiheit sind einfache Ansatzpunkte.",
			quiz: [
				"Welche Aussage über Rauchen passt?",
				"Es kann Gefäße schädigen und das Erkrankungsrisiko erhöhen.",
				"Es trainiert die Gefäße wie Bewegung.",
				"Es betrifft allein Kleidung und Geruch.",
				"Die gesundheitlichen Auswirkungen betreffen auch Herz und Gefäße.",
			],
			practice: [
				[
					[
						"Welche Gewohnheit kann die Ausdauer verbessern?",
						"Regelmäßige passende Bewegung",
						"Sich möglichst wenig bewegen",
						"Nur einmal im Jahr sehr stark trainieren",
						"Regelmäßigkeit ermöglicht Anpassung an Belastung.",
					],
					[
						"Jemand behauptet, ein einzelner rauchfreier Tag schütze sicher vor jeder Herzkrankheit. Was ist angemessen?",
						"Rauchfreiheit kann Risiken verringern, aber mehrere Einflüsse spielen zusammen.",
						"Ein einzelner Tag garantiert den Schutz.",
						"Rauch beeinflusst Herz und Gefäße nie.",
						"Ein Risiko ist eine Wahrscheinlichkeit und keine sichere Vorhersage.",
					],
				],
				[
					[
						"Worauf kann eine sehr salzreiche Ernährung Einfluss haben?",
						"Auf den Blutdruck",
						"Auf die Zahl der Herzkammern",
						"Auf die Einteilung in Arterien und Venen",
						"Bei vielen Menschen kann sehr viel Salz den Blutdruck erhöhen.",
					],
					[
						"Zwei Pläne unterscheiden sich zwischen regelmäßigem Gehen und einmaliger Überlastung. Was unterstützt Ausdauer eher?",
						"Passende Bewegung regelmäßig in den Alltag einbauen.",
						"Einen Tag stark überlasten und danach dauerhaft sitzen.",
						"Nur die Anzahl der geplanten Schritte aufschreiben.",
						"Regelmäßige machbare Bewegung unterstützt Ausdauer.",
					],
				],
				[
					[
						"Was berücksichtigt eine faire Bewertung eines Schulwegs zu Fuß?",
						"Sicherheit und Möglichkeit zur regelmäßigen Bewegung",
						"Nur die Schuhfarbe",
						"Nur wer am schnellsten geht",
						"Gesundheit und praktische Bedingungen spielen zusammen.",
					],
					[
						"Warum sollte man einer Person mit einer Herzkrankheit keine Schuld aus einem einzelnen Verhalten zuschreiben?",
						"Krankheiten können viele Einflüsse und Ursachen haben.",
						"Jede Krankheit hat nur eine Gewohnheit als Ursache.",
						"Bei Herzkrankheiten spielen Gewohnheiten niemals eine Rolle.",
						"Risikofaktoren wirken zusammen und erklären kein Einzelschicksal.",
					],
				],
			],
			lab: livingLabs.health,
		},
		{
			id: "belastung",
			title: "Warum Atem und Puls schneller werden",
			subtitle:
				"Lies zwei Messreihen und erkläre die Reaktion auf mehr Bewegung.",
			tracks: ["M"],
			text: [
				"Arbeitende Muskeln brauchen bei Anstrengung mehr Energie. Dafür nutzen die Zellen mehr Sauerstoff für die Zellatmung. Meist wird die Atmung tiefer und schneller. Das Herz schlägt meist schneller und befördert mehr Blut zu den arbeitenden Muskeln. Kohlenstoffdioxid gelangt schneller zur Lunge.",
				"Ein Modell zeigt in Ruhe 72 Herzschläge und 15 Atemzüge pro Minute. Beim Laufen steigt das Beispiel auf 148 und 34. In der Erholung fallen beide wieder. Die Werte unterscheiden sich von Person zu Person. Du vergleichst Verlauf und Einheiten.",
			],
			rule: "Bei größerem Energiebedarf steigen Atem- und Pulsfrequenz meist. In der Erholung sinken sie wieder.",
			quiz: [
				"Warum schlägt das Herz beim Laufen meist schneller?",
				"Die arbeitenden Muskeln brauchen mehr Sauerstoff und Energie.",
				"Im Körper gibt es plötzlich mehr Herzkammern.",
				"Die Lunge hört bei Belastung auf, Sauerstoff auszutauschen.",
				"Der schnellere Kreislauf unterstützt die Stoffversorgung.",
			],
			practice: [
				[
					[
						"Welche Einheit passt zur Pulsfrequenz?",
						"Herzschläge pro Minute",
						"Liter pro Atemzug",
						"Grad Celsius",
						"Die Frequenz zählt Ereignisse je Zeit.",
					],
					[
						"Das Modell zeigt in Ruhe 15 Atemzüge pro Minute und beim Rennen 34. Um wie viele Atemzüge pro Minute steigt die Frequenz?",
						"19",
						"49",
						"34",
						"Ziehe den Ruhewert vom Belastungswert ab.",
						[19, "", 0],
					],
				],
				[
					[
						"Wie verändert sich die Pulsfrequenz meist in der Erholung?",
						"Sie sinkt allmählich.",
						"Sie steigt zwingend weiter.",
						"Sie bleibt für Stunden auf dem Höchstwert.",
						"Der Energiebedarf der Muskulatur fällt wieder.",
					],
					[
						"Eine Gruppe misst Puls und Atem an einer Person vor und nach ihrer Bewegung. Warum ist dieselbe Person hilfreich?",
						"Unterschiede zwischen Personen erschweren den Vergleich weniger.",
						"Jede Person hat immer gleiche Werte.",
						"Mit derselben Person muss man keine Einheiten erfassen.",
						"Ein Vergleich innerhalb einer Person hält manche Einflussgrößen gleich.",
					],
				],
				[
					[
						"Was fällt bei steigender Muskelaktivität vermehrt als Stoffwechselprodukt an?",
						"Kohlenstoffdioxid",
						"Helium",
						"Stickstoff aus roten Blutkörperchen",
						"Bei der Zellatmung entsteht Kohlenstoffdioxid.",
					],
					[
						"Ist bei einem längeren Balken automatisch der Puls stärker gestiegen als die Atmung?",
						"Erst die zugehörigen Skalen und Einheiten vergleichen.",
						"Ja, alle Balken haben dieselbe Einheit.",
						"Ja, die längere Skala bedeutet mehr Körperzellen.",
						"Balken verschiedener Skalen sind nicht direkt vergleichbar.",
					],
				],
			],
			lab: livingLabs.load,
		},
	],
);
