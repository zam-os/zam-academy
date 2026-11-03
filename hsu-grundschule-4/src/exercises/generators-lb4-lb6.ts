import { fmt, pick } from "../model/format";
import type { ExerciseTask } from "../model/types";
import { type ChoiceBlueprint, materializeChoice } from "./generators-lb1-lb3";

export function generateLb4ToLb6Task(
	lessonId: string,
	level: 1 | 2,
	rng: () => number,
	seedTag: number,
): ExerciseTask {
	switch (lessonId) {
		case "zeitreise-und-quellen": {
			if (level === 1) {
				const item = pick(rng, [
					{ year: 1340, century: 14, event: "wurde die erste Ortsurkunde geschrieben" },
					{
						year: 1835,
						century: 19,
						event: "fuhr die erste deutsche Eisenbahn zwischen Nürnberg und Fürth",
					},
					{ year: 1905, century: 20, event: "wurde das alte Schulhaus eröffnet" },
				]);
				return {
					kind: "number",
					id: `${lessonId}-l1-n-${seedTag}`,
					lessonId,
					level: 1,
					contextTag: "Spürnase · Jahrhundert bestimmen",
					prompt: `Im Jahr ${item.year} ${item.event}. Zu welchem Jahrhundert gehört das Jahr ${item.year}? (Gib nur die Zahl ein, z. B. 19)`,
					expected: item.century,
					unit: ". Jahrhundert",
					placeholder: "z. B. 19",
					hint: "Das 1. Jahrhundert reicht von 1 bis 100 – rechne zu den vollen Hundertern 1 dazu!",
					explanation: `Die Jahre ${(item.century - 1) * 100 + 1} bis ${item.century * 100} bilden das ${item.century}. Jahrhundert.`,
				};
			}
			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Quellenkritik",
					prompt:
						"Für die Schulchronik findet ihr eine alte Münze (Sachquelle), einen Brief von 1912 (Textquelle) und befragt eine 88-jährige Nachbarin (Zeitzeugin). Warum nutzt man mehrere Quellen nebeneinander?",
					correct:
						"Weil jede einzelne Quelle Lücken hat oder nur eine Sichtweise zeigt – zusammen ergeben sie ein verlässlicheres Bild.",
					wrongs: [
						"Weil Sachquellen grundsätzlich gefälscht sind und nur Zeitzeugen alles wissen.",
						"Weil Museen und Archive Textquellen vernichten müssen.",
					],
					wrongReasons: [
						"Auch Erinnerungen von Zeitzeugen können verblassen; gerade die Kombination verschiedener Quellen hilft.",
						"Archive bewahren Textquellen sorgfältig auf, statt sie zu vernichten.",
					],
					hint: "Überlege: Weiß eine einzelne Person oder ein einzelnes Fundstück wirklich alles?",
					explanation:
						"Historisches Wissen stützt sich auf mehrere Quellenarten, die sich gegenseitig ergänzen und überprüfen.",
				},
				{
					contextTag: "Proben-Profi · Museum & Archiv",
					prompt:
						"Beim Umbau des Rathauses tauchen ein rostiger Zunftschlüssel von 1680 und eine empfindliche Pergament-Urkunde von 1420 auf. Wie ordnest und schützt du beide Funde fachgerecht?",
					correct:
						"Der Schlüssel ist eine Sachquelle des 17. Jh. fürs Heimatmuseum; die Urkunde ist eine Textquelle des 15. Jh. fürs klimatisierte Archiv.",
					wrongs: [
						"Beide stammen aus dem 14. Jh. und werden zum Lüften in den feuchten Rathaushof gehängt.",
						"Der Schlüssel ist eine Textquelle und die Urkunde eine mündliche Quelle.",
					],
					wrongReasons: [
						"1680 liegt im 17. Jh. und 1420 im 15. Jh.; Feuchtigkeit und Sonnenlicht zerstören Pergament und Metall!",
						"Gegenstände sind Sachquellen, geschriebene Dokumente sind Textquellen.",
					],
					hint: "Prüfe erst die Quellenart (Gegenstand vs. Schriftstück) und dann das Jahrhundert (+1 zu den vollen Hundertern)!",
					explanation:
						"Museen bewahren und zeigen vor allem Sachquellen, während Archive empfindliche Schriftstücke schützen.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "wandel-fakten-fiktion": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Fahrrad-Geschichte",
						prompt:
							"Wie hieß die hölzerne Laufmaschine von Karl Drais aus dem Jahr 1817, bei der man sich noch ohne Pedale vom Boden abstieß?",
						correct: "Draisine.",
						wrongs: ["Hochrad mit Kettenantrieb.", "E-Bike mit Nabendynamo."],
						wrongReasons: [
							"Das Hochrad kam erst um 1870, der Kettenantrieb ab 1885 beim Sicherheitsniederrad.",
							"Elektrofahrräder und Nabendynamos sind moderne Entwicklungen.",
						],
						hint: "Die Erfindung wurde nach ihrem Erfinder Karl Drais benannt.",
						explanation:
							"1817 baute Karl Drais die lenkbare Laufmaschine (Draisine) – der Ausgangspunkt unseres heutigen Fahrrads.",
					},
					{
						contextTag: "Spürnase · Vom Hochrad zum Niederrad",
						prompt:
							"Warum stürzten Fahrer beim Hochrad (um 1870) so leicht gefährlich kopfüber – und was löste dieses Problem ab 1885?",
						correct:
							"Der Fahrer saß hoch über dem riesigen Vorderrad; ab 1885 sorgten zwei gleich große Räder mit Kettenantrieb und Luftreifen für Sicherheit.",
						wrongs: [
							"Das Hochrad hatte überhaupt kein Vorderrad; erst das Flugzeug löste das Problem.",
							"Das Hochrad fuhr rückwärts auf Kufen aus Eis.",
						],
						wrongReasons: [
							"Gerade das übergroße Vorderrad machte das Hochrad bei Steinen kippgefährdet; das Sicherheitsniederrad brachte den Durchbruch.",
							"Hochräder rollten auf Speichenrädern vorwärts, hatten aber einen sehr hohen Schwerpunkt.",
						],
						hint: "Vergleiche im Mitmach-Labor die Radgrößen von 1870 und 1885!",
						explanation:
							"Das Sicherheitsniederrad mit Kettenantrieb aufs Hinterrad und Luftreifen machte das Fahrrad alltagstauglich.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}
			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Fakt oder Fiktion?",
					prompt:
						"In einem Kinderbuch über eine bayerische Burg heißt es: ‚1450 ließ der Burgherr einen tiefen Brunnen graben, weil im Wald ein sprechender Drache wohnte.‘ Wie trennst du Fakt und Fiktion?",
					correct:
						"Der Burgbrunnen von 1450 lässt sich als Sach- und Textquelle prüfen (Fakt); der sprechende Drache ist ausgeschmückte Sage (Fiktion).",
					wrongs: [
						"Alles in gedruckten Büchern ist automatisch ein historischer Fakt.",
						"Sowohl die Burg als auch das Mittelalter sind komplett erfunden.",
					],
					wrongReasons: [
						"Romane, Sagen und Filme mischen oft echte Schauplätze mit erfundenen Abenteuern.",
						"Burgen und mittelalterliche Urkunden sind reale historische Quellen.",
					],
					hint: "Prüfe, wofür es echte Funde oder Urkunden geben kann!",
					explanation:
						"Quellen belegen historische Fakten, während Fabelwesen typische Elemente von Sagen und Fiktion sind.",
				},
				{
					contextTag: "Proben-Profi · Erinnerungskultur vor Ort",
					prompt:
						"Auf dem Marktplatz steht eine Gedenktafel für zerstörte Häuser im Krieg, daneben feiert die Stadt ihr 700-jähriges Stadtjubiläum. Welchen Sinn haben solche Denkmäler und Gedenktage?",
					correct:
						"Sie halten die Ortsgeschichte wach, erinnern mahnend an Krieg und Unrecht und stärken unsere Verantwortung für Frieden und Demokratie heute.",
					wrongs: [
						"Sie dienen nur als Werbefläche für Supermärkte und haben keinen Bezug zur Vergangenheit.",
						"Sie sollen bewirken, dass man historische Quellen aus Archiven wegwirft.",
					],
					wrongReasons: [
						"Denkmäler und Gedenktage sind bewusste Orte der Erinnerung, nicht bloße Reklame.",
						"Erinnerungskultur und Quellenarbeit ergänzen sich gegenseitig.",
					],
					hint: "Denke daran, was eine Gemeinde aus ihrer Vergangenheit für das Zusammenleben heute lernt!",
					explanation:
						"Feste, Museen und Gedenktage verbinden historische Wurzeln mit Verantwortung in der Gegenwart.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "orientierung-und-kartenlesen": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Himmelsrichtungen & Karte",
						prompt:
							"Welche Nebenhimmelsrichtung liegt auf der Windrose genau zwischen Süden (S) und Osten (O)?",
						correct: "Südost (SO).",
						wrongs: ["Nordwest (NW).", "Südwest (SW)."],
						wrongReasons: [
							"Nordwest liegt genau gegenüber zwischen Norden und Westen.",
							"Südwest liegt zwischen Süden und Westen.",
						],
						hint: "Kombiniere die beiden Haupthimmelsrichtungen Süden + Osten!",
						explanation:
							"Zwischen S und O liegt Südost (SO); bei den Nebenhimmelsrichtungen nennt man Nord bzw. Süd immer zuerst.",
					},
					{
						contextTag: "Spürnase · Höhenschichten & Legende",
						prompt:
							"Was bedeutet auf einer physischen Karte von Bayern eine dunkelbraune Fläche im Vergleich zu einer grünen Fläche?",
						correct:
							"Dunkelbraun zeigt ein Hochgebirge (große Höhe wie die Alpen), Grün zeigt Tiefland oder Flusstäler.",
						wrongs: [
							"Dunkelbraun zeigt tiefe Badeseen, Grün zeigt schneebedeckte Dreitausender.",
							"Dunkelbraun bedeutet trockene Erde ohne Bäume wie auf einem Satellitenfoto.",
						],
						wrongReasons: [
							"Gewässer werden auf physischen Karten blau dargestellt, nicht braun.",
							"Höhenschichtenfarben auf physischen Karten zeigen die Geländehöhe an, nicht die Bodenfarbe wie auf einem Foto!",
						],
						hint: "Schau in der Kartenlegende nach der Farbskala von unten (flach) nach oben (steil/hoch)!",
						explanation:
							"Physische Karten nutzen Höhenschichtenfarben: Grün für Tiefland, Gelb/Hellbraun für Hügelland und Dunkelbraun für Hochgebirge.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}
			const item = pick(rng, [
				{ scale: "1 : 25 000", cm: 6, km: 1.5, perCmM: 250 },
				{ scale: "1 : 50 000", cm: 3, km: 1.5, perCmM: 500 },
				{ scale: "1 : 50 000", cm: 5, km: 2.5, perCmM: 500 },
				{ scale: "1 : 100 000", cm: 4, km: 4, perCmM: 1000 },
			]);
			return {
				kind: "number",
				id: `${lessonId}-l2-n-${seedTag}`,
				lessonId,
				level: 2,
				contextTag: "Proben-Profi · Maßstab umrechnen",
				prompt: `Auf einer Wanderkarte im Maßstab ${item.scale} sind Schule und Aussichtsturm ${fmt(item.cm)} cm voneinander entfernt. Wie viele Kilometer (km) ist die Luftlinie in der Wirklichkeit lang?`,
				expected: item.km,
				unit: "km",
				placeholder: "z. B. 1,5",
				hint: `Bei ${item.scale} steht 1 cm für ${fmt(item.perCmM)} m. Rechne ${fmt(item.cm)} · ${fmt(item.perCmM)} m und wandle durch 1 000 in km um!`,
				explanation: `${fmt(item.cm)} · ${fmt(item.perCmM)} m = ${fmt(item.cm * item.perCmM)} m = ${fmt(item.km)} km.`,
				diagnoseMistake: (val) =>
					val === item.cm * item.perCmM
						? `${fmt(val)} ist der Wert in Metern – teile noch durch 1 000 für Kilometer!`
						: null,
			};
		}

		case "bayern-deutschland-welt": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Raumgliederung",
						prompt:
							"Welche Reihenfolge ordnet deinen Wohnort richtig vom Kleinen zum Großen ein?",
						correct:
							"Gemeinde/Stadt → Landkreis → Regierungsbezirk → Bayern → Deutschland → Europa.",
						wrongs: [
							"Bayern → Gemeinde → Europa → Landkreis → Deutschland.",
							"Europa → Deutschland → Gemeinde → Regierungsbezirk.",
						],
						wrongReasons: [
							"Bayern ist größer als Gemeinde und Landkreis; Europa umfasst viele Staaten.",
							"Diese Reihenfolge beginnt beim Größten und vertauscht am Ende Gemeinde und Bezirk.",
						],
						hint: "Denke an Zwiebelschalen: Starte direkt vor deiner Haustür!",
						explanation:
							"Von der eigenen Kommune wächst die politische Gliederung über Landkreis, Regierungsbezirk und Freistaat Bayern bis nach Deutschland und Europa.",
					},
					{
						contextTag: "Spürnase · 7 Regierungsbezirke Bayerns",
						prompt:
							"Wie viele Regierungsbezirke hat der Freistaat Bayern – und wie heißt seine Landeshauptstadt?",
						correct: "7 Regierungsbezirke; die Landeshauptstadt ist München.",
						wrongs: [
							"16 Regierungsbezirke; die Landeshauptstadt ist Berlin.",
							"3 Regierungsbezirke; die Landeshauptstadt ist Wien.",
						],
						wrongReasons: [
							"16 ist die Zahl der deutschen Bundesländer und Berlin ist die Bundeshauptstadt Deutschlands.",
							"Wien ist die Hauptstadt des Nachbarstaates Österreich; Bayern gliedert sich in 7 Regierungsbezirke.",
						],
						hint: "Zähle Ober-/Niederbayern, Oberpfalz, Ober-/Mittel-/Unterfranken und Schwaben zusammen!",
						explanation:
							"Bayern besteht aus 7 Regierungsbezirken mit der Landeshauptstadt München (zugleich Regierungssitz von Oberbayern).",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}
			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Bayern & Raumschutz",
					prompt:
						"Welche Aussage verbindet Bayerns Geographie und nachhaltigen Raumschutz fachlich richtig?",
					correct:
						"Südlich der Donau münden Iller, Lech, Isar und Inn aus Richtung Alpen; Nationalparks und Wanderbusse schützen empfindliche Bergwälder trotz Tourismus.",
					wrongs: [
						"Der Main fließt mitten durch die Alpen direkt ins Mittelmeer, und mehr Gipfelparkplätze schützen seltene Wildtiere.",
						"Bayern hat nur zwei Regierungsbezirke und gar keine Schutzgebiete.",
					],
					wrongReasons: [
						"Der Main fließt in Nordbayern nach Westen in den Rhein; Parkplätze im Bergwald versiegeln und stören Lebensräume.",
						"Bayern gliedert sich in 7 Regierungsbezirke und schützt Natur u. a. in den Nationalparks Bayerischer Wald und Berchtesgaden.",
					],
					hint: "Prüfe den Fluss-Merkspruch ‚Iller, Lech, Isar, Inn …‘ und Maßnahmen des sanften Tourismus!",
					explanation:
						"Topographisches Grundwissen und Rücksicht in Naturräumen gehören im HSU eng zusammen.",
				},
				{
					contextTag: "Proben-Profi · Regierungsbezirke & Flusssysteme",
					prompt:
						"Welche Zuordnung von Regierungsbezirk, Regierungssitz und Flussraum in Bayern stimmt vollständig?",
					correct:
						"Unterfranken hat den Regierungssitz Würzburg am Main; Schwaben hat den Regierungssitz Augsburg zwischen Lech und Iller.",
					wrongs: [
						"Oberbayern hat den Regierungssitz Bayreuth an der Nordsee.",
						"Niederbayern hat den Regierungssitz Ansbach mitten auf der Zugspitze.",
					],
					wrongReasons: [
						"Bayreuth ist Sitz von Oberfranken; Oberbayern hat seinen Sitz in München und liegt im Süden Bayerns.",
						"Ansbach gehört zu Mittelfranken, Landshut zu Niederbayern, und die Zugspitze (2 962 m) liegt in den Alpen.",
					],
					hint: "Nordbayern wird vom Main geprägt (Franken), Südbayern von Donau und Alpenflüssen!",
					explanation:
						"In Nordbayern fließt der Main durch Franken (u. a. Würzburg), im Südwesten prägen Iller und Lech den Bezirk Schwaben (Augsburg).",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "fahrrad-und-mobilitaet": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Verkehrssicheres Fahrrad",
						prompt:
							"Welche Ausstattung macht ein Fahrrad nach den Regeln der Jugendverkehrsschule verkehrssicher?",
						correct:
							"Zwei unabhängige Bremsen, helltönende Klingel, weißes Vorderlicht + rotes Rücklicht sowie Front-, Rück-, Pedal- und Speichenreflektoren.",
						wrongs: [
							"Nur eine Hinterradbremse und eine bunte Trinkflasche am Lenker.",
							"Ein lauter Musiklautsprecher statt Klingel und Licht nur bei Regen.",
						],
						wrongReasons: [
							"Fällt die einzige Bremse aus, kannst du nicht mehr anhalten – vorgeschrieben sind zwei unabhängige Bremsen und vollständige Beleuchtung!",
							"Musik lenkt im Straßenverkehr gefährlich ab und ersetzt weder Klingel noch Scheinwerfer.",
						],
						hint: "Denke an Bremsen, Hören (Klingel), Sehen (Licht) und Gesehenwerden (Reflektoren)!",
						explanation:
							"Nur ein vollständig ausgerüstetes Rad darf in den Straßenverkehr; ein passender Helm schützt zusätzlich den Kopf.",
					},
					{
						contextTag: "Spürnase · Toter Winkel & Verkehrszeichen",
						prompt:
							"Warum darfst du an einer Kreuzung niemals rechts neben einem rechts blinkenden Lkw oder Bus vorfahren?",
						correct:
							"Weil du dort im toten Winkel trotz Spiegeln unsichtbar bist – sicher wartest du mit Abstand schräg dahinter.",
						wrongs: [
							"Weil Lkw an Kreuzungen immer rückwärts abbiegen.",
							"Weil Fahrräder neben Lkw automatisch Vorfahrt nach links haben.",
						],
						wrongReasons: [
							"Die Gefahr entsteht beim Vorwärts-Rechtsabbiegen, weil die Hinterachse enger herumzieht und das Sichtfeld verdeckt ist.",
							"Selbst bei Grün oder Radweg übersieht der Fahrer Personen im toten Winkel – Abstand dahinter rettet Leben!",
						],
						hint: "Erinnere dich an den Bereich rechts neben dem Führerhaus, den kein Spiegel komplett abdeckt!",
						explanation:
							"Im toten Winkel neben Lkw und Bussen passieren schwere Abbiegeunfälle; deshalb immer dahinter bleiben.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}
			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Linksabbiegen & Umwelt",
					prompt:
						"Du willst mit dem Rad nach links abbiegen. Welche Reihenfolge stimmt – und warum ist das Fahrrad auf kurzen Alltagswegen besonders nachhaltig?",
					correct:
						"Erst umschauen, Handzeichen links geben, zur Mitte einordnen, Gegenverkehr durchlassen, nochmals umschauen und im weiten Bogen abbiegen; Radfahren spart Abgase, Lärm und Parkfläche.",
					wrongs: [
						"Ohne Umschauen sofort vom rechten Rand schräg über die Kreuzung ziehen; Autos verbrauchen pro Person weniger Platz als Fahrräder.",
						"Auf dem Gehweg mit Vollgas links abbiegen und die Augen schließen.",
					],
					wrongReasons: [
						"Kurveschneiden ohne Schulterblick führt zu schweren Unfällen mit nachfolgendem und entgegenkommendem Verkehr!",
						"Vorausschauendes Schauen, Handzeichen und weiter Bogen sind beim Linksabbiegen lebenswichtig.",
					],
					hint: "Denke an die 8 Punkte aus der Jugendverkehrsschule: Erst umschauen, dann Handzeichen, dann einordnen!",
					explanation:
						"Die feste Reihenfolge beim Linksabbiegen schützt dich an Kreuzungen; zugleich hält Radfahren fit und schont das Klima.",
				},
				{
					contextTag: "Proben-Profi · Gleichrangige Kreuzung",
					prompt:
						"Du kommst mit dem Fahrrad an eine Kreuzung ohne Ampel und ohne Vorfahrtsschilder. Von rechts nähert sich ein Auto, geradeaus ist frei. Wie verhältst du dich richtig?",
					correct:
						"Es gilt ‚rechts vor links‘: Ich bremse rechtzeitig ab, lasse das Auto von rechts durchfahren und fahre erst danach aufmerksam weiter.",
					wrongs: [
						"Ich fahre ungebremst durch, weil Fahrräder an jeder Kreuzung immer Vorfahrt vor Autos haben.",
						"Ich biege auf die linke Straßenseite in den Gegenverkehr aus.",
					],
					wrongReasons: [
						"An gleichrangigen Kreuzungen ohne Schilder gilt ‚rechts vor links‘ für alle Fahrzeuge gleichermaßen!",
						"In Deutschland gilt das Rechtsfahrgebot – Ausweichen in den Gegenverkehr ist hochgefährlich.",
					],
					hint: "Keine Ampel, keine Schilder → welche Grundregel entscheidet?",
					explanation:
						"An Kreuzungen ohne Vorfahrtsregelung durch Ampel oder Verkehrszeichen gilt immer ‚rechts vor links‘.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "werkzeuge-maschinen-produktion": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Technische Prinzipien",
						prompt:
							"Welches technische Prinzip schleudert in der Salatschleuder und in der Waschmaschine die Wassertropfen nach außen weg?",
						correct: "Die Fliehkraft bei schneller Kreisbewegung.",
						wrongs: [
							"Ein eingebauter Haartrockner mit Heißluft.",
							"Die magnetische Anziehungskraft von Plastik.",
						],
						wrongReasons: [
							"Eine Salatschleuder hat keine Heizung – sie trocknet allein durch schnelles Drehen!",
							"Kunststoff und Wasser sind nicht magnetisch wie Eisen.",
						],
						hint: "Dasselbe Gefühl kennst du, wenn sich ein Kettenkarussell schnell dreht!",
						explanation:
							"Durch die schnelle Drehung drückt die Fliehkraft das Wasser durch die Siebschlitze nach außen.",
					},
					{
						contextTag: "Spürnase · Hebelgesetz im Alltag",
						prompt:
							"Wie setzt du eine Brechstange oder einen Flaschenöffner als Hebel an, damit du möglichst wenig eigene Kraft brauchst?",
						correct:
							"Mit einem langen Kraftarm und einem kurzen Lastarm ganz nah am schweren Gegenstand (Drehpunkt nah an der Last).",
						wrongs: [
							"Mit einem winzigen Kraftarm und einem möglichst langen Lastarm weit weg von der Kiste.",
							"Ganz ohne Drehpunkt frei in der Luft schwebend.",
						],
						wrongReasons: [
							"Je kürzer dein Kraftarm im Vergleich zum Lastarm ist, desto mehr Kraft musst du aufwenden!",
							"Jeder Hebel braucht ein festes Auflager (Drehpunkt), um Kraft zu übertragen.",
						],
						hint: "Merke: Langer Kraftarm = kleine Kraft nötig!",
						explanation:
							"Beim Hebel spart ein langer Kraftarm gegenüber einem kurzen Lastarm spürbar Muskelkraft.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}
			const gear = pick(rng, [
				{ big: 24, small: 8, turns: 1, out: 3 },
				{ big: 30, small: 10, turns: 1, out: 3 },
				{ big: 20, small: 8, turns: 1, out: 2.5 },
				{ big: 18, small: 12, turns: 1, out: 1.5 },
			]);
			return {
				kind: "number",
				id: `${lessonId}-l2-n-${seedTag}`,
				lessonId,
				level: 2,
				contextTag: "Proben-Profi · Zahnrad-Übersetzung",
				prompt: `In einem Handrührgerät greift ein großes Antriebsrad mit ${fmt(gear.big)} Zähnen in ein kleines Zahnrad mit ${fmt(gear.small)} Zähnen. Wie viele Umdrehungen macht das kleine Zahnrad bei genau 1 Umdrehung der Kurbel?`,
				expected: gear.out,
				unit: "Umdrehungen",
				placeholder: "z. B. 3 oder 2,5",
				hint: `Teile die Zähnezahl des großen Rads (${fmt(gear.big)}) durch die Zähnezahl des kleinen Rads (${fmt(gear.small)}).`,
				explanation: `${fmt(gear.big)} : ${fmt(gear.small)} = ${fmt(gear.out)}. Das kleine Zahnrad dreht sich ${fmt(gear.out)}-mal (und zwar entgegengesetzt).`,
			};
		}

		case "bruecken-und-balance": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Stabile Konstruktion",
						prompt:
							"Wie machst du im Modellbau ein einzelnes Blatt Papier als Brückenfahrbahn deutlich tragfähiger, ohne zusätzliches Material zu verschwenden?",
						correct:
							"Ich falte es zu einem Zickzack-, U- oder Winkelprofil (oder rolle Röhren) und steife Seitenteile mit Dreiecken aus.",
						wrongs: [
							"Ich mache das flache Blatt nass, damit es weicher durchhängt.",
							"Ich schneide in der Brückenmitte einen breiten Spalt quer durch das Blatt.",
						],
						wrongReasons: [
							"Nasses Papier verliert sofort seine Festigkeit und reißt.",
							"Ein Querschnitt in der Mitte schwächt den Träger genau dort, wo die Belastung am größten ist.",
						],
						hint: "Erinnere dich an die Ziehharmonika-Faltung im Brücken-Labor!",
						explanation:
							"Profile und Dreiecksverbindungen erhöhen die Stabilität bei minimalem Materialeinsatz (Materialökonomie).",
					},
					{
						contextTag: "Spürnase · Dreieck vs. Viereck im Fachwerk",
						prompt:
							"Welche geometrische Form bleibt im Brücken- und Turmbau (Fachwerk) auch unter Druck formstabil, ohne seitlich wegzuklappen?",
						correct: "Das Dreieck – eine Diagonalstrebe macht ein wackeliges Viereck sofort steif.",
						wrongs: [
							"Ein loses Viereck ohne jede Diagonalstrebe.",
							"Eine offene Schlangenlinie aus weichem Bindfaden.",
						],
						wrongReasons: [
							"Ein unversteiftes Viereck verschiebt sich unter seitlichem Druck leicht zur Raute.",
							"Schlaffer Bindfaden kann keinen Druck aufnehmen.",
						],
						hint: "Schau dir Fachwerkbrücken, Kräne oder Dachstühle genau an: Überall stecken Diagonalstreben!",
						explanation:
							"Dreiecke lassen sich an den Ecken nicht verformen, solange die Stäbe halten – das Grundprinzip jedes Fachwerks.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}
			const bal = pick(rng, [
				{ leftW: 30, leftD: 2, rightW: 20, rightD: 3 },
				{ leftW: 20, leftD: 1.5, rightW: 15, rightD: 2 },
				{ leftW: 25, leftD: 2, rightW: 20, rightD: 2.5 },
			]);
			return {
				kind: "number",
				id: `${lessonId}-l2-n-${seedTag}`,
				lessonId,
				level: 2,
				contextTag: "Proben-Profi · Wippe im Gleichgewicht",
				prompt: `Auf einer Wippe sitzt links ein Kind mit ${fmt(bal.leftW)} kg im Abstand von ${fmt(bal.leftD)} m zum Drehpunkt. Rechts setzt sich ein leichteres Kind mit ${fmt(bal.rightW)} kg hin. In welchem Abstand (in m) vom Drehpunkt muss es sitzen, damit die Wippe im Gleichgewicht ist?`,
				expected: bal.rightD,
				unit: "m",
				placeholder: "z. B. 2,5",
				hint: `Gleichgewicht heißt: Gewicht · Abstand ist links und rechts gleich (${fmt(bal.leftW)} · ${fmt(bal.leftD)} = ${fmt(bal.leftW * bal.leftD)}). Teile ${fmt(bal.leftW * bal.leftD)} durch ${fmt(bal.rightW)}!`,
				explanation: `Links gilt ${fmt(bal.leftW)} · ${fmt(bal.leftD)} = ${fmt(bal.leftW * bal.leftD)}. Rechts ergibt ${fmt(bal.rightW)} · ${fmt(bal.rightD)} ebenfalls ${fmt(bal.leftW * bal.leftD)} – die Wippe balanciert!`,
			};
		}

		default:
			throw new Error(`Unbekannte Station in LB 4–6: ${lessonId}`);
	}
}
