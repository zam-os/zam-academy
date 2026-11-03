import { fmt, pick, shuffleWithAnswer } from "../model/format";
import type { ChoiceTask, ExerciseTask, NumberTask } from "../model/types";

export interface ChoiceBlueprint {
	contextTag: string;
	prompt: string;
	correct: string;
	wrongs: readonly [string, string];
	wrongReasons: readonly [string, string];
	hint: string;
	explanation: string;
}

export function materializeChoice(
	rng: () => number,
	lessonId: string,
	level: 1 | 2,
	seedTag: number,
	bp: ChoiceBlueprint,
): ChoiceTask {
	const shuffled = shuffleWithAnswer(rng, bp.correct, bp.wrongs, bp.wrongReasons);
	return {
		kind: "choice",
		id: `${lessonId}-l${level}-c-${seedTag}`,
		lessonId,
		level,
		contextTag: bp.contextTag,
		prompt: bp.prompt,
		options: shuffled.options,
		correctIndex: shuffled.correctIndex,
		hint: bp.hint,
		explanation: bp.explanation,
		mistakeHints: shuffled.mistakeHints,
	};
}

export function generateLb1ToLb3Task(
	lessonId: string,
	level: 1 | 2,
	rng: () => number,
	seedTag: number,
): ExerciseTask {
	switch (lessonId) {
		case "gemeinschaft-kinderrechte": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Wahlgrundsätze",
						prompt:
							"Bei der Klassensprecherwahl hat jedes Kind genau eine Stimme – egal ob groß, klein, neu in der Klasse oder schon lange dabei. Welcher Wahlgrundsatz ist das?",
						correct: "Gleich (jede Stimme zählt gleich viel).",
						wrongs: [
							"Geheim (niemand sieht den Stimmzettel).",
							"Unmittelbar (ohne Zwischenleute gewählt).",
						],
						wrongReasons: [
							"Geheim schützt deinen Stimmzettel vor fremden Blicken – beim Stimmgewicht geht es aber um ‚gleich‘.",
							"Unmittelbar heißt direkte Wahl der Person – gleiches Stimmgewicht heißt ‚gleich‘.",
						],
						hint: "Denke daran: 1 Kind = 1 gleichwertige Stimme.",
						explanation:
							"Der Grundsatz der gleichen Wahl garantiert, dass jede abgegebene Stimme exakt denselben Wert hat.",
					},
					{
						contextTag: "Spürnase · UN-Kinderrechte",
						prompt:
							"Welches Recht gehört ausdrücklich zu den UN-Kinderrechten für alle Kinder weltweit?",
						correct:
							"Das Recht auf Bildung, Schutz vor Gewalt und Mitbestimmung.",
						wrongs: [
							"Das Recht, nie Hausaufgaben machen oder Regeln beachten zu müssen.",
							"Das Recht auf ein eigenes Fernsehgerät in jedem Kinderzimmer.",
						],
						wrongReasons: [
							"Zu Rechten in der Gemeinschaft gehören auch Pflichten und gemeinsame Regeln.",
							"Konsumwünsche sind keine Kinderrechte; Kinderrechte schützen Entwicklung, Bildung und Würde.",
						],
						hint: "Überlege, was jedes Kind zum gesunden Aufwachsen und Lernen braucht.",
						explanation:
							"Bildung, Gesundheit, Freizeit, Mitbestimmung, Inklusion und Schutz vor Gewalt sind zentrale UN-Kinderrechte.",
					},
					{
						contextTag: "Spürnase · Rollenklischees",
						prompt:
							"Lukas tanzt begeistert Ballett und Aylin spielt im Fußballverein im Sturm. Ein Kind ruft: ‚Das gehört sich doch umgekehrt!‘ Wie beurteilst du das?",
						correct:
							"Das ist ein veraltetes Rollenklischee – jedes Kind darf Hobbys nach seinen eigenen Interessen wählen.",
						wrongs: [
							"Stimmt, Sportarten sind gesetzlich nach Mädchen und Buben getrennt.",
							"Beide müssen sofort aufhören, damit niemand in der Pause diskutiert.",
						],
						wrongReasons: [
							"Es gibt kein solches Gesetz – Fähigkeiten hängen nicht vom Geschlecht ab.",
							"Vielfalt an Interessen ist eine Bereicherung und kein Grund zum Aufhören.",
						],
						hint: "Erinnere dich: Entscheiden Vorurteile über Stärken – oder das Kind selbst?",
						explanation:
							"Rollenklischees schränken unnötig ein; in einer fairen Gemeinschaft zählen Interessen und gegenseitiger Respekt.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			if (rng() < 0.55) {
				const total = pick(rng, [20, 22, 24, 26, 28]);
				const needed = total / 2 + 1;
				const task: NumberTask = {
					kind: "number",
					id: `${lessonId}-l2-n-${seedTag}`,
					lessonId,
					level: 2,
					contextTag: "Proben-Profi · Mehrheitswahl",
					prompt: `In der Klasse 4a geben ${fmt(total)} Kinder einen gültigen Stimmzettel ab. Für die absolute Mehrheit im ersten Wahlgang braucht eine Kandidatin mehr als die Hälfte aller Stimmen. Wie viele Stimmen sind das mindestens?`,
					expected: needed,
					unit: "Stimmen",
					placeholder: "Anzahl eingeben",
					hint: `Teile ${fmt(total)} durch 2 (= ${fmt(total / 2)}). Für ‚mehr als die Hälfte‘ brauchst du noch 1 Stimme dazu.`,
					explanation: `Die Hälfte von ${fmt(total)} ist ${fmt(total / 2)}. Erst ab ${fmt(needed)} Stimmen liegt mehr als die Hälfte vor.`,
					diagnoseMistake: (val) =>
						val === total / 2
							? `Genau ${fmt(total / 2)} Stimmen wären nur Gleichstand (die Hälfte) – für die Mehrheit fehlt noch 1 Stimme!`
							: null,
				};
				return task;
			}

			const transferPool: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Fallanalyse Wahl",
					prompt:
						"In der 4c sagt der Wahlleiter: ‚Wer heute Geburtstag hat, darf zwei Stimmzettel einwerfen, und alle schreiben ihren eigenen Namen groß auf den Wahlzettel!‘ Welche zwei Wahlgrundsätze werden hier verletzt?",
					correct: "Die Grundsätze ‚gleich‘ und ‚geheim‘.",
					wrongs: [
						"Die Grundsätze ‚allgemein‘ und ‚unmittelbar‘.",
						"Es wird gar kein Grundsatz verletzt, weil Geburtstagskinder Vorrang haben.",
					],
					wrongReasons: [
						"Alle Kinder durften direkt wählen – verletzt wurden das gleiche Stimmgewicht und das Wahlgeheimnis.",
						"Auch am Geburtstag zählt bei demokratischen Wahlen jede Stimme genau einfach und anonym.",
					],
					hint: "Prüfe getrennt: 1. Zwei Stimmzettel für eine Person? 2. Eigener Name auf dem Stimmzettel?",
					explanation:
						"Zwei Stimmzettel verletzen die gleiche Wahl, der eigene Name auf dem Zettel verletzt die geheime Wahl.",
				},
				{
					contextTag: "Proben-Profi · Konfliktlösung",
					prompt:
						"Die Hälfte der Klasse möchte beim Sommerfest ein Völkerballturnier, die andere Hälfte ein Theaterstück. Welche Lösung entspricht einem demokratischen Kompromiss?",
					correct:
						"Beide Gruppen gestalten je 30 Minuten Programm, sodass Sport und Theater Platz finden.",
					wrongs: [
						"Wer am lautesten ruft, setzt seinen Wunsch alleine durch.",
						"Das Sommerfest wird komplett abgesagt, damit niemand gewinnt.",
					],
					wrongReasons: [
						"Lautstärke ist kein faires Mittel – dabei geht eine Gruppe völlig leer aus.",
						"Alles abzusagen schadet allen, statt beide Interessen klug zu verbinden.",
					],
					hint: "Bei einem Kompromiss gehen beide Seiten einen Schritt aufeinander zu.",
					explanation:
						"Zeitlich aufgeteilte Programmpunkte berücksichtigen die Bedürfnisse beider Gruppen fair.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, transferPool));
		}

		case "unsere-gemeinde": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Gemeindeaufgaben",
						prompt:
							"Welche Aufgabe gehört zu den gesetzlichen Pflichtaufgaben jeder bayerischen Gemeinde?",
						correct:
							"Trinkwasserversorgung, Abwasserentsorgung, Brandschutz (Feuerwehr) und Grundschulgebäude.",
						wrongs: [
							"Ein beheiztes Erlebnis-Freibad mit Wellenrutsche bauen.",
							"Jedem Haushalt kostenlos Kinokarten schenken.",
						],
						wrongReasons: [
							"Ein Schwimmbad ist eine freiwillige Aufgabe je nach Haushaltslage der Gemeinde.",
							"Kinokarten gehören weder zu Pflicht- noch zu kommunalen Grundaufgaben.",
						],
						hint: "Überlege: Ohne welche Einrichtung wären Sicherheit, Gesundheit oder Schulpflicht gefährdet?",
						explanation:
							"Wasser, Abwasser, Feuerwehr, Gemeindestraßen und Grundschulen muss jede Kommune zuverlässig sichern.",
					},
					{
						contextTag: "Spürnase · Ämter im Rathaus",
						prompt:
							"Wer leitet die Gemeindeverwaltung und führt die Beschlüsse des Gemeinderats aus?",
						correct: "Die Erste Bürgermeisterin oder der Erste Bürgermeister.",
						wrongs: [
							"Nur die Schulleitung der örtlichen Grundschule.",
							"Der Klassensprecher der 4. Klasse.",
						],
						wrongReasons: [
							"Die Schulleitung leitet die Schule, nicht die gesamte Gemeindeverwaltung.",
							"Klassensprecher vertreten ihre Schulklasse, nicht das Rathaus.",
						],
						hint: "Alle sechs Jahre wählen die Bürgerinnen und Bürger in Bayern dieses Gemeindeoberhaupt.",
						explanation:
							"Bürgermeisterin bzw. Bürgermeister und Gemeinderat werden bei der Kommunalwahl gewählt; das Rathaus setzt die Beschlüsse um.",
					},
					{
						contextTag: "Spürnase · Freiwillige Aufgaben",
						prompt:
							"Warum heißen Gemeindebücherei, Jugendtreff, Museum oder Hallenbad ‚freiwillige Aufgaben‘?",
						correct:
							"Weil die Gemeinde sie anbietet, soweit nach den Pflichtaufgaben genügend Geld im Haushalt vorhanden ist.",
						wrongs: [
							"Weil dort niemand Eintritt zahlen oder Bücher zurückgeben muss.",
							"Weil diese Gebäude ohne Baugenehmigung errichtet werden dürfen.",
						],
						wrongReasons: [
							"Ausleihregeln und Gebühren gelten trotzdem; ‚freiwillig‘ bezieht sich auf die Pflicht der Gemeinde.",
							"Für jedes öffentliche Gebäude gelten strenge Bau- und Sicherheitsvorschriften.",
						],
						hint: "Zuerst müssen Feuerwehr, Wasser und Schule bezahlt sein – danach entscheidet der Gemeinderat über Extras.",
						explanation:
							"Freiwillige Leistungen steigern die Lebensqualität, hängen aber vom Gemeindehaushalt ab.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			if (rng() < 0.5) {
				const seats = pick(rng, [16, 20, 24]);
				const yes = seats / 2 + pick(rng, [2, 3, 4]);
				const no = seats - yes;
				const diff = yes - no;
				return {
					kind: "number",
					id: `${lessonId}-l2-n-${seedTag}`,
					lessonId,
					level: 2,
					contextTag: "Proben-Profi · Gemeinderatsbeschluss",
					prompt: `Im Gemeinderat stimmen alle ${fmt(seats)} Mitglieder über einen neuen Radweg ab. ${fmt(yes)} Ratsmitglieder stimmen mit ‚Ja‘, die übrigen mit ‚Nein‘. Um wie viele Stimmen liegt die Ja-Seite vor den Nein-Stimmen?`,
					expected: diff,
					unit: "Stimmen",
					placeholder: "Vorsprung",
					hint: `Rechne zuerst die Nein-Stimmen aus (${fmt(seats)} − ${fmt(yes)} = ${fmt(no)}) und bilde dann den Unterschied ${fmt(yes)} − ${fmt(no)}.`,
					explanation: `Bei ${fmt(yes)} Ja-Stimmen gibt es ${fmt(no)} Nein-Stimmen. Der Vorsprung beträgt ${fmt(yes)} − ${fmt(no)} = ${fmt(diff)} Stimmen.`,
					diagnoseMistake: (val) =>
						val === no
							? `${fmt(no)} ist die Anzahl der Nein-Stimmen – gefragt ist der Vorsprung zwischen Ja und Nein!`
							: null,
				};
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Perspektiven abwägen",
					prompt:
						"Eine Gemeinde hat eine freie Fläche neben der Schule. Eltern wünschen sich einen Spielplatz, Anwohner fürchten Abendlärm, der Naturschutzbund will alte Obstbäume erhalten. Welcher Vorschlag dient dem Gemeinwohl am besten?",
					correct:
						"Ein Naturspielplatz unter den erhaltenen Obstbäumen mit klaren Nutzungszeiten bis 19 Uhr.",
					wrongs: [
						"Alle Obstbäume fällen und einen 24-Stunden-Lkw-Rastplatz asphaltieren.",
						"Das Gelände komplett einzäunen, damit überhaupt niemand es betreten darf.",
					],
					wrongReasons: [
						"Das schadet sowohl dem Naturschutz als auch der Ruhe der Anwohner und den Kindern.",
						"Eine Komplettsperrung ignoriert das berechtigte Spielbedürfnis der Kinder völlig.",
					],
					hint: "Suche den Vorschlag, der Kinder, Anwohnerruhe und Baumschutz sinnvoll vereint.",
					explanation:
						"Demokratische Kommunalpolitik wägt verschiedene Interessen ab und sucht tragfähige Ausgleichslösungen.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "medien-und-konsum": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Medienfunktionen",
						prompt:
							"Mira schlägt in einer Kindernachrichtenseite nach, warum es heute stürmt. Welche Funktion erfüllt das Medium hier vor allem?",
						correct: "Information und Wissenserwerb.",
						wrongs: [
							"Reiner Zeitvertreib ohne Inhalt.",
							"Versteckte Schleichwerbung für Süßigkeiten.",
						],
						wrongReasons: [
							"Mira sucht gezielt sachliche Auskunft über das Wetter – das ist Information.",
							"Ein sachlicher Wetterbericht informiert und wirbt nicht für Produkte.",
						],
						hint: "Will Mira sich informieren, unterhalten lassen oder mit jemandem chatten?",
						explanation:
							"Medien dienen je nach Nutzung der Information, der Kommunikation oder der Unterhaltung.",
					},
					{
						contextTag: "Spürnase · Supermarkt-Tricks",
						prompt:
							"Warum liegen bunte Schokoriegel und kleine Spielzeuge im Supermarkt fast immer direkt neben dem Kassenband?",
						correct:
							"Als Quengelware in der Wartezone sollen sie spontane Impulskäufe auslösen.",
						wrongs: [
							"Weil Schokolade nur in der Nähe der Registrierkasse gekühlt bleibt.",
							"Weil im restlichen Supermarkt kein einziges Regal mehr frei war.",
						],
						wrongReasons: [
							"An der Kasse ist es nicht kühler als im Laden – die Platzierung ist Verkaufspsychologie.",
							"Supermärkte planen ihre Regale gezielt; die Kassenzone soll Spontankäufe fördern.",
						],
						hint: "Überlege, was passiert, wenn man mit Kindern an der Schlange warten muss.",
						explanation:
							"Warenplatzierung (Sichtzone, Kinderaugenhöhe, Quengelzone) beeinflusst unser Kaufverhalten gezielt.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			if (rng() < 0.5) {
				const cubes = pick(rng, [8, 10, 12, 14]);
				const grams = cubes * 3;
				return {
					kind: "number",
					id: `${lessonId}-l2-n-${seedTag}`,
					lessonId,
					level: 2,
					contextTag: "Proben-Profi · Werbe-Zuckercheck",
					prompt: `Ein buntes ‚Kinder-Sportgetränk‘ wirbt mit großem Fußball-Bild. Auf der Rückseite steht im Kleingedruckten: ${fmt(grams)} g Zucker pro Flasche. Ein Zuckerwürfel wiegt 3 g. Wie viele Zuckerwürfel stecken in einer einzigen Flasche?`,
					expected: cubes,
					unit: "Zuckerwürfel",
					placeholder: "Anzahl",
					hint: `Teile die Gesamtmenge ${fmt(grams)} g durch 3 g pro Zuckerwürfel.`,
					explanation: `${fmt(grams)} g : 3 g = ${fmt(cubes)} Zuckerwürfel – ein Blick auf die Zutatenliste enttarnt das Sport-Versprechen!`,
				};
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Nachhaltiger Konsum",
					prompt:
						"In einem Video schwärmt ein bekannter Influencer von leuchtenden Einweg-Trinkbechern, die nach einmaligem Trinken im Restmüll landen. Worauf achtest du als kritischer Medien- und Konsumprofi?",
					correct:
						"Ich erkenne bezahlte Werbung (Kennzeichnung ‚Anzeige‘) und nutze lieber meine wiederverwendbare Trinkflasche.",
					wrongs: [
						"Wenn eine berühmte Person das Produkt zeigt, ist es garantiert umweltfreundlich.",
						"Einwegplastik spart Rohstoffe, weil man es nicht abspülen muss.",
					],
					wrongReasons: [
						"Influencer erhalten oft Geld für Produktplatzierungen – das sagt nichts über Qualität oder Umweltfolgen aus.",
						"Einwegprodukte verursachen unnötigen Müll und hohen Erdöl- und Energieverbrauch.",
					],
					hint: "Prüfe: Wer verdient am Video – und was passiert nach dem Trinken mit dem Becher?",
					explanation:
						"Medienkritik entlarvt versteckte Kaufanreize; Mehrweg statt Einweg schützt Umwelt und Geldbeutel.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "wunderwerk-auge": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Teile des Auges",
						prompt:
							"Welcher farbige Teil des Auges wirkt wie eine Blende und vergrößert oder verkleinert die Pupille je nach Helligkeit?",
						correct: "Die Regenbogenhaut (Iris).",
						wrongs: [
							"Die Augenbraue über dem Auge.",
							"Der Sehnerv hinter dem Augapfel.",
						],
						wrongReasons: [
							"Die Augenbraue hält Stirnschweiß ab, regelt aber nicht die Pupillenweite.",
							"Der Sehnerv leitet Signale ans Gehirn weiter, verändert aber nicht die Pupille.",
						],
						hint: "Sie gibt dem Auge seine blaue, grüne oder braune Farbe!",
						explanation:
							"Die Regenbogenhaut (Iris) regelt die Größe der Pupille und schützt die Netzhaut vor Blendung.",
					},
					{
						contextTag: "Spürnase · Schutz des Auges",
						prompt:
							"Welche Aufgabe haben Augenbrauen, Wimpern, Augenlider und Tränenflüssigkeit gemeinsam?",
						correct:
							"Sie schützen das empfindliche Auge vor Schweiß, Staub, Fremdkörpern und Austrocknung.",
						wrongs: [
							"Sie drehen das verkehrte Bild auf der Netzhaut wieder richtig herum.",
							"Sie erzeugen im Dunkeln eigenes Licht wie eine Taschenlampe.",
						],
						wrongReasons: [
							"Das Umdrehen und Verstehen des Bildes übernimmt unser Gehirn!",
							"Ein menschliches Auge leuchtet nicht selbst, sondern empfängt Licht.",
						],
						hint: "Denke daran, was passiert, wenn Staub fliegt oder dir beim Sport Schweiß über die Stirn läuft.",
						explanation:
							"Die natürlichen Schutzeinrichtungen bewahren Hornhaut und Augeninneres vor Schäden.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Sehvorgang erklären",
					prompt:
						"Du trittst aus einem dunklen Hausflur plötzlich hinaus auf einen sonnenhellen Schneehof. Was passiert in deinem Auge und in welcher Reihenfolge entsteht das Sehbild?",
					correct:
						"Die Pupille zieht sich eng zusammen; Licht fällt durch Hornhaut und Linse auf die Netzhaut (umgekehrtes Bild), der Sehnerv meldet ans Gehirn.",
					wrongs: [
						"Die Pupille öffnet sich weit, damit möglichst viel grelles Sonnenlicht direkt auf den Sehnerv brennt.",
						"Die Linse schließt sich komplett und die Wimpern senden das Bild direkt ans Ohr.",
					],
					wrongReasons: [
						"Bei greller Helligkeit zieht sich die Pupille zusammen, um die empfindliche Netzhaut vor Blendung zu schützen!",
						"Die Linse bleibt durchsichtig und bündelt das Licht; gesehen wird mit Netzhaut, Sehnerv und Gehirn.",
					],
					hint: "Achte auf zwei Punkte: 1. Groß oder klein bei hellem Licht? 2. Hornhaut → Pupille → Linse → Netzhaut → Sehnerv → Gehirn.",
					explanation:
						"Engstellen der Pupille schützt vor Blendung; auf der Netzhaut entsteht ein verkleinertes, umgekehrtes Bild, das unser Gehirn richtig deutet.",
				},
				{
					contextTag: "Proben-Profi · Augenschutz im Alltag",
					prompt:
						"Welche Gewohnheit schützt deine Augen im Alltag wirklich zuverlässig?",
					correct:
						"Niemals direkt in die Sonne schauen, bei hellem Licht lesen und nach Bildschirmzeit den Blick regelmäßig in die Ferne richten.",
					wrongs: [
						"Mit einer Lupe in die Mittagssonne blicken, um die Sehschärfe zu trainieren.",
						"Bei einem Fremdkörper im Auge kräftig mit ungewaschenen Fingern reiben.",
					],
					wrongReasons: [
						"Direkter Blick in die Sonne – erst recht durch Lupen – verbrennt die Netzhaut dauerhaft!",
						"Kräftiges Reiben kratzt den Fremdkörper über die empfindliche Hornhaut.",
					],
					hint: "Überlege, was Hornhaut und Netzhaut verletzen könnte.",
					explanation:
						"UV-Schutz, gutes Leselicht und Pausen für die Augenmuskeln halten das Auge gesund.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "wachsen-und-neues-leben": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Vor der Geburt",
						prompt:
							"Wie wird das ungeborene Kind in der Gebärmutter mit Sauerstoff und Nährstoffen versorgt?",
						correct:
							"Über den Mutterkuchen (Plazenta) und die Nabelschnur.",
						wrongs: [
							"Es atmet schon im Bauch Luft durch Mund und Nase ein.",
							"Es trinkt Kuhmilch aus einer kleinen Flasche.",
						],
						wrongReasons: [
							"In der Fruchtblase ist Fruchtwasser – der erste Atemzug mit der Lunge passiert erst nach der Geburt!",
							"Vor der Geburt laufen Ernährung und Sauerstoffaufnahme ausschließlich über Plazenta und Nabelschnur.",
						],
						hint: "Welche Verbindung führt vom Bauch der Mutter zum Bauchnabel des Babys?",
						explanation:
							"Plazenta und Nabelschnur versorgen das Kind rund neun Monate lang, während das Fruchtwasser Stöße abfedert.",
					},
					{
						contextTag: "Spürnase · Beginnende Pubertät",
						prompt:
							"Welche Aussage über die beginnende Pubertät stimmt?",
						correct:
							"Körper und Gefühle verändern sich bei jedem Kind in seinem eigenen Tempo – Unterschiede sind völlig normal.",
						wrongs: [
							"Bei allen Kindern beginnt die Pubertät exakt am 10. Geburtstag um 8 Uhr.",
							"Gefühlsschwankungen sind eine ansteckende Krankheit.",
						],
						wrongReasons: [
							"Jeder Mensch entwickelt sich individuell; manche früher, manche einige Jahre später.",
							"Stimmungsschwankungen in der Pubertät entstehen durch natürliche Botenstoffe (Hormone), nicht durch Krankheitserreger.",
						],
						hint: "Vergleiche Kinder deiner Jahrgangsstufe: Sind alle genau gleich groß?",
						explanation:
							"Hormone steuern Wachstumsschub, Körperveränderungen und neue Gefühle – jedes Kind hat seinen eigenen Zeitplan.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Schutz & Entwicklung",
					prompt:
						"Welche Zuordnung beschreibt den Weg vom Beginn neuen Lebens bis zur Pubertät fachlich richtig?",
					correct:
						"Befruchtung von Eizelle und Samenzelle → Schutz im Fruchtwasser der Gebärmutter (ca. 9 Monate) → Geburt → in der Pubertät körperliche und seelische Reifung.",
					wrongs: [
						"Befruchtung im Magen → 3 Wochen Wachstum ohne Schutz → Geburt bereits als Jugendlicher.",
						"Das Baby versorgt sich in der Gebärmutter ohne Nabelschnur selbst durch Lungenatmung.",
					],
					wrongReasons: [
						"Das Kind wächst nicht im Magen, sondern rund neun Monate gut geschützt in der Gebärmutter!",
						"Lungenatmung setzt erst mit der Geburt ein; zuvor übernimmt die Nabelschnur die Versorgung.",
					],
					hint: "Achte auf den richtigen Ort (Gebärmutter, nicht Magen!) und die Dauer (rund 9 Monate).",
					explanation:
						"Aus der verschmolzenen Ei- und Samenzelle reift das Kind in der Gebärmutter heran; später leitet die Pubertät den Übergang zum Erwachsenwerden ein.",
				},
				{
					contextTag: "Proben-Profi · Körperpflege & Grenzen",
					prompt:
						"In der beginnenden Pubertät arbeiten Schweiß- und Talgdrüsen stärker, und das Bedürfnis nach Privatsphäre wächst. Was folgt daraus für den Alltag?",
					correct:
						"Regelmäßiges Waschen und Frischekleidung helfen dem Körper; verschlossene Badezimmertüren und persönliche Grenzen anderer werden respektiert.",
					wrongs: [
						"Man sollte gar keinen Sport mehr treiben, um niemals zu schwitzen.",
						"Über Veränderungen lustig zu machen motiviert Mitschülerinnen und Mitschüler.",
					],
					wrongReasons: [
						"Sport ist gesund und wichtig – nach dem Schwitzen hilft einfach gründliches Waschen.",
						"Auslachen verletzt Grenzen; Rücksicht und Respekt stärken das Klassenklima.",
					],
					hint: "Verbinde Hygiene-Wissen mit dem Achten persönlicher Grenzen.",
					explanation:
						"Gute Körperpflege und gegenseitiger Respekt helfen allen Kindern sicher durch die Pubertät.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "erste-hilfe-und-notruf": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · 5 W-Fragen",
						prompt:
							"Welche europaweite Notrufnummer wählst du kostenlos bei Feuer oder einem schweren medizinischen Notfall?",
						correct: "112",
						wrongs: ["11880", "0800"],
						wrongReasons: [
							"Das ist eine Auskunftsnummer, kein Rettungs- und Feuerwehrnotruf!",
							"0800 ist nur eine Vorwahl – im Notfall zählt die 112!",
						],
						hint: "Drei Ziffern: Eins – Eins – Zwei!",
						explanation:
							"Unter der 112 erreichst du kostenlos und ohne Vorwahl die Rettungsleitstelle für Feuerwehr und Rettungsdienst.",
					},
					{
						contextTag: "Spürnase · Leichte Verletzung",
						prompt:
							"Deine Freundin hat sich beim Fangenspielen leicht am Knie aufgeschürft. Was ist eine sinnvolle Erste-Hilfe-Maßnahme?",
						correct:
							"Beruhigen, die Wunde vorsichtig mit sauberem Wasser reinigen und mit einem sauberen Pflaster abdecken.",
						wrongs: [
							"Sand auf die offene Wunde reiben, damit sie schneller trocknet.",
							"Weglaufen und niemanden informieren.",
						],
						wrongReasons: [
							"Sand bringt Schmutz und Keime in die Wunde!",
							"Trösten, helfen und eine erwachsene Aufsichtsperson holen gehört zur Ersten Hilfe.",
						],
						hint: "Sauber halten und schützen verhindert Entzündungen.",
						explanation:
							"Trösten, Reinigen mit klarem Wasser und keimfreies Abdecken versorgen kleine Schürfwunden sicher.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Bewusstlosigkeit",
					prompt:
						"Auf dem Radweg liegt ein gestürzter Mann. Er reagiert nicht auf lautes Ansprechen, atmet aber ruhig und regelmäßig. Welche Reihenfolge ist richtig?",
					correct:
						"Eigene Sicherheit prüfen → Hilfe rufen → Person in die stabile Seitenlage bringen → Notruf 112 mit den 5 W-Fragen absetzen und zudecken.",
					wrongs: [
						"Ihm sofort Wasser einflößen und ihn allein am Straßenrand liegen lassen.",
						"Nach dem ersten Satz am Telefon sofort auflegen, damit der Akku geschont wird.",
					],
					wrongReasons: [
						"Einer bewusstlosen Person darf man niemals etwas einflößen – Erstickungsgefahr!",
						"Beim 5. W (‚Warten auf Rückfragen‘) beendet immer die Leitstelle das Gespräch!",
					],
					hint: "Denke an freie Atemwege (stabile Seitenlage) und das 5. W beim Notruf!",
					explanation:
						"Die stabile Seitenlage hält bei normaler Atmung die Atemwege frei; beim Notruf 112 wartet man immer auf Rückfragen.",
				},
				{
					contextTag: "Proben-Profi · Kreislauf & Insektenstich",
					prompt:
						"Nach langem Stehen in der Sonne ist einem Mitschüler schwindelig und blass zumute (Kreislaufschwäche), er ist aber wach. Was hilft jetzt?",
					correct:
						"In den Schatten begleiten, hinlegen, Beine hochlagern, etwas zu trinken geben und eine Lehrkraft holen.",
					wrongs: [
						"Ihn in der prallen Sonne schnelle Sprints laufen lassen.",
						"Ihm eine dicke Winterjacke überziehen und in die Sonne stellen.",
					],
					wrongReasons: [
						"Anstrengung in der Hitze verschlimmert den Kreislaufkollaps sofort.",
						"Hitze staut sich weiter – Schatten und Beine hochlagern helfen dem Blutkreislauf zum Gehirn.",
					],
					hint: "Wie kommt das Blut leichter zurück Richtung Kopf, wenn jemand blass und schwindelig ist?",
					explanation:
						"Schatten, Ruhe und hochgelagerte Beine stabilisieren den Kreislauf rasch.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "gefuehle-grenzen-wohlbefinden": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Körperliche Selbstbestimmung",
						prompt:
							"Jemand möchte dich umarmen oder kitzeln, obwohl dir das unangenehm ist, und sagt: ‚Hab dich nicht so, behalt das als Geheimnis!‘ Was gilt?",
						correct:
							"Mein Körper gehört mir: Ich darf klar ‚Nein!‘ sagen und hole mir bei einem schlechten Geheimnis sofort Hilfe bei einer Vertrauensperson.",
						wrongs: [
							"Man muss jede Berührung höflich erdulden und jedes Geheimnis für sich behalten.",
							"Kinder dürfen erst ab 18 Jahren sagen, was ihnen unangenehm ist.",
						],
						wrongReasons: [
							"Schlechte Geheimnisse, die Angst oder Bauchweh machen, darf und soll man weitersagen!",
							"Körperliche Selbstbestimmung und Schutz gelten für jedes Kind von Anfang an.",
						],
						hint: "Unterscheide gute Überraschungs-Geheimnisse (z. B. Geburtstagsgeschenk) von schlechten Geheimnissen!",
						explanation:
							"Niemand darf deine körperlichen Grenzen übergehen; Vertrauenspersonen helfen bei unangenehmen Situationen.",
					},
					{
						contextTag: "Spürnase · Schönheitsideale",
						prompt:
							"Warum sehen Gesichter und Körper auf Werbeplakaten oft völlig makellos aus?",
						correct:
							"Weil Fotos häufig mit Lichttricks, Filtern und Bildbearbeitung künstlich verändert wurden.",
						wrongs: [
							"Weil Models in echt niemals Hautporen, Sommersprossen oder Falten haben.",
							"Weil nur digital bearbeitete Menschen gesund und sportlich sein können.",
						],
						wrongReasons: [
							"Jeder echte Mensch hat individuelle Haut- und Körpermerkmale.",
							"Gesundheit zeigt sich an Wohlbefinden und Bewegung, nicht an Foto-Filtern.",
						],
						hint: "Erinnere dich an die Foto-Filter-Lupe im Mitmach-Labor!",
						explanation:
							"Werbung inszeniert künstliche Ideale; in Wirklichkeit macht gerade die Vielfalt aller Menschen (auch mit Behinderung) unsere Gesellschaft aus.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Gefühle & Freizeitbalance",
					prompt:
						"Tom merkt nach einer stressigen Woche mit viel Bildschirmzeit, dass er gereizt ist und schlecht einschläft. Welche Kombination stärkt sein Wohlbefinden nachhaltig?",
					correct:
						"Über seine Gefühle sprechen, nachmittags draußen mit Freunden aktiv sein (z. B. Radfahren, Verein) und abends rechtzeitig Bildschirmpause machen.",
					wrongs: [
						"Gefühle komplett herunterschlucken und bis Mitternacht am Tablet weiterspielen.",
						"Nie wieder nach draußen gehen, um jedem Stress auszuweichen.",
					],
					wrongReasons: [
						"Dauerhaftes Unterdrücken von Gefühlen und Schlafmangel belasten Körper und Stimmung noch stärker.",
						"Bewegung an der frischen Luft und Kontakte in Vereinen oder Parks bauen Stress gezielt ab.",
					],
					hint: "Achtsamkeit für Gefühle + aktive Bewegung + Erholung gehören zusammen.",
					explanation:
						"Wer Warnsignale des eigenen Körpers ernst nimmt und aktive Freizeit mit Ruhezeiten verbindet, fördert seine Gesundheit.",
				},
				{
					contextTag: "Proben-Profi · Grenzen schützen & Hilfe holen",
					prompt:
						"Im Sportverein drängt ein älterer Jugendlicher ein Kind zu einer Mutprobe, die ihm Bauchschmerzen macht, und verlangt: ‚Das bleibt unser Geheimnis!‘ Wie handelt das Kind richtig?",
					correct:
						"Auf das eigene Bauchgefühl hören, klar ‚Nein!‘ sagen, weggehen und sofort einer Vertrauensperson Bescheid geben – belastende Geheimnisse darf man weitersagen.",
					wrongs: [
						"Aus Angst mitmachen und niemandem etwas erzählen, weil man Geheimnisse niemals brechen darf.",
						"Alleine abends an einen abgelegenen Ort gehen, um es heimlich zu klären.",
					],
					wrongReasons: [
						"Schlechte Geheimnisse, die Angst oder Druck auslösen, muss kein Kind für sich behalten!",
						"Bei Grenzüberschreitungen holt man sich immer Unterstützung bei vertrauten Erwachsenen oder Beratungsstellen.",
					],
					hint: "Unterscheide gute Überraschungs-Geheimnisse von schlechten Druck-Geheimnissen!",
					explanation:
						"Jedes Kind bestimmt über seine körperlichen und seelischen Grenzen selbst und hat jederzeit das Recht, Hilfe zu holen.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "lebensraeume-wald-gewaesser": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Stockwerke des Waldes",
						prompt:
							"Welche Reihenfolge ordnet alle fünf Stockwerke des Waldes (ab unter der Erde) richtig von unten nach oben?",
						correct:
							"Wurzelschicht → Moosschicht → Krautschicht → Strauchschicht → Baumschicht.",
						wrongs: [
							"Baumschicht → Moosschicht → Wurzelschicht → Wolkenschicht → Krautschicht.",
							"Kellerschicht → Erdschicht → Grasschicht → Heckenstock → Dachschicht.",
						],
						wrongReasons: [
							"Die Wurzelschicht liegt ganz unten im Boden, die Baumschicht bildet ganz oben das Kronendach.",
							"Die fünf Fachbegriffe im HSU heißen Wurzel-, Moos-, Kraut-, Strauch- und Baumschicht.",
						],
						hint: "Starte unter der Erde bei den Wurzeln, gehe über den feuchten Waldboden und klettere bis in die Baumkronen!",
						explanation:
							"Von der Wurzelschicht im Boden bis zur sonnigen Baumschicht bietet jedes der fünf Stockwerke eigene Lebensbedingungen.",
					},
					{
						contextTag: "Spürnase · Angepasstheit im Gewässer",
						prompt:
							"Womit atmet eine Bachforelle den im kalten Wasser gelösten Sauerstoff?",
						correct: "Mit ihren Kiemen.",
						wrongs: [
							"Mit einer großen Vogellunge und Schnabel.",
							"Über ihre verholzte Baumrinde.",
						],
						wrongReasons: [
							"Fische besitzen Kiemen statt Lungen, um Sauerstoff direkt aus dem Wasser aufzunehmen.",
							"Rinde schützt Bäume – Fische haben eine schleimbedeckte Schuppenhaut und Kiemen.",
						],
						hint: "Wasser strömt beim Fisch durch den Mund hinein und seitlich am Kopf wieder hinaus.",
						explanation:
							"Stromlinienform, Flossen, Schuppen und Kiemen passen Fische optimal an das Leben im Wasser an.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Nahrungsbeziehung & Mensch",
					prompt:
						"In einen klaren Wiesenbach gelangt viel Dünger von angrenzenden Feldern. Dadurch wuchern Algen, sterben ab und verbrauchen beim Faulen fast allen Sauerstoff. Welche Folge droht im Nahrungsnetz?",
					correct:
						"Empfindliche Kleintiere und Fische wie die Bachforelle ersticken, und auch Fischfresser wie der Eisvogel verlieren ihre Nahrung.",
					wrongs: [
						"Forellen freuen sich über Sauerstoffmangel und klettern einfach auf Bäume.",
						"Änderungen an einem Glied der Nahrungskette haben keinerlei Einfluss auf andere Lebewesen.",
					],
					wrongReasons: [
						"Forellen sind auf kühles, sauerstoffreiches Wasser angewiesen.",
						"Im Ökosystem hängen Pflanzen, Kleintiere und Räuber wechselseitig voneinander ab!",
					],
					hint: "Verfolge die Kette: Wasserqualität → Kleintiere → Fische → fischfressende Vögel.",
					explanation:
						"Gewässerschutz (z. B. Uferrandstreifen ohne Dünger) bewahrt das gesamte Nahrungsnetz.",
				},
				{
					contextTag: "Proben-Profi · Bäume & Wasserpflanzen",
					prompt:
						"Warum werfen heimische Laubbäume wie die Buche im Herbst ihre Blätter ab, während Seerosen luftgefüllte Hohlräume im Blattstiel besitzen?",
					correct:
						"Laubabwurf schützt den Baum im gefrorenen Winterboden vor Wasserverlust; Luftkanäle lassen das Seerosenblatt auf der Wasseroberfläche zum Licht schwimmen.",
					wrongs: [
						"Bäume werfen Blätter ab, damit Spaziergänger mehr Rascheln hören.",
						"Seerosen haben Betonstiele, damit ihre Blüten am dunklen Seegrund bleiben.",
					],
					wrongReasons: [
						"Laubwechsel ist eine lebenswichtige Angepasstheit an Frosttrocknis im Winter.",
						"Pflanzenblätter brauchen Sonnenlicht an der Wasseroberfläche – Luftkammern sorgen für Auftrieb!",
					],
					hint: "Frage bei beiden Pflanzen: Wie sichern sie Wasser bzw. Sonnenlicht in ihrem Lebensraum?",
					explanation:
						"Beide Merkmale sind präzise Angepasstheiten von Pflanzen an Jahreszeiten und Lebensraum.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "tierentwicklung-wolf-hund": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Marienkäfer-Entwicklung",
						prompt:
							"Welche Reihenfolge beschreibt die vollkommene Verwandlung (Metamorphose) des Siebenpunkt-Marienkäfers?",
						correct: "Ei → Larve → Puppe → erwachsener Marienkäfer.",
						wrongs: [
							"Kaulquappe → kleiner Käfer mit 2 Punkten → Käfer mit 7 Punkten.",
							"Samenkorn → Blüte → Marienkäfer.",
						],
						wrongReasons: [
							"Kaulquappen gehören zu Amphibien; außerdem gibt die Punktzahl die Käferart an, nicht das Alter!",
							"Marienkäfer sind Insekten und schlüpfen aus Eiern, nicht aus Pflanzensamen.",
						],
						hint: "Zwischen der gefräßigen Larve und dem fertigen Käfer liegt ein Ruhestadium!",
						explanation:
							"Insekten wie der Marienkäfer durchlaufen vier Stadien: Ei, Larve, Puppe und fertiges Insekt.",
					},
					{
						contextTag: "Spürnase · Wolf und Hund",
						prompt:
							"Von welchem Wildtier stammt unser Haushund ab – und welches Erbe steckt noch heute in ihm?",
						correct:
							"Vom Wolf: ausgeprägter Geruchssinn, Rudel-/Sozialverhalten und ein natürlicher Jagdinstinkt.",
						wrongs: [
							"Vom Feldhasen: Hunde ernähren sich in der Natur ausschließlich von Klee.",
							"Vom Luchs: Hunde sind reine Einzelgänger auf Baumwipfeln.",
						],
						wrongReasons: [
							"Hunde sind Raubtiere und Nachfahren des Wolfs, keine Nagetiere oder Hasenartigen.",
							"Der Luchs gehört zu den Katzenartigen; der Haushund stammt vom Wolf ab.",
						],
						hint: "Beide leben gern in einer festen Gruppe (Rudel bzw. Menschenfamilie) und haben eine Spürnase!",
						explanation:
							"Vor Jahrtausenden wurde der Hund aus dem Wolf domestiziert; feine Sinne und Bedürfnis nach Sozialkontakt blieben erhalten.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Frosch-Metamorphose",
					prompt:
						"Wie verändert sich die Atmung bei der Entwicklung vom Froschlaich zum erwachsenen Grasfrosch an Land?",
					correct:
						"Die frisch geschlüpfte Kaulquappe atmet im Wasser mit Kiemen; während der Verwandlung bilden sich Beine und eine Lunge (plus Hautatmung) für das Landleben.",
					wrongs: [
						"Kaulquappen haben von Anfang an vier Beine und Lungen wie ein Hund.",
						"Erwachsene Frösche verlieren ihre Lunge und leben nur noch tief im Schlamm ohne Luft.",
					],
					wrongReasons: [
						"Beine und Lunge entwickeln sich erst schrittweise während der Metamorphose!",
						"Erwachsene Frösche sind Amphibien (Lurchtiere) und atmen an Land mit Lunge und feuchter Haut.",
					],
					hint: "Amphibium bedeutet ‚doppellebig‘: erst Wasserbewohner, dann Wasser- und Landbewohner.",
					explanation:
						"Der Umbau von Schwanz und Kiemen zu vier Beinen und Lunge ermöglicht den Wechsel vom Wasser ans Land.",
				},
				{
					contextTag: "Proben-Profi · Sicherer Umgang mit Hunden",
					prompt:
						"Im Park läuft ein fremder Hund neugierig auf dich zu. Warum sollst du weder schreiend wegrennen noch ihn einfach am Kopf streicheln?",
					correct:
						"Schnelles Wegrennen kann den ererbten Jagdtrieb wecken; ungefragtes Anfassen von oben kann der Hund als Bedrohung empfinden.",
					wrongs: [
						"Weil Hunde überhaupt nichts sehen oder riechen können.",
						"Weil jeder Hund sofort einschläft, wenn man laut kreischt.",
					],
					wrongReasons: [
						"Hunde riechen und hören sogar deutlich feiner als wir Menschen!",
						"Lautes Kreischen und Hektik verunsichern oder reizen das Tier erst recht.",
					],
					hint: "Denke an das Wolfs-Erbe (Beutefang bei Fluchtbewegung) und die Körpersprache!",
					explanation:
						"Ruhig stehen bleiben, Blick abwenden und vor jedem Kontakt erst Halterin oder Halter fragen schützt Kind und Tier.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "bauernhof-und-lebensmittel": {
			if (level === 1) {
				if (rng() < 0.45) {
					const pair = pick(rng, [
						{ label: "ökologische Erzeugung (Bio-Haltung)", digit: 0 },
						{ label: "Freilandhaltung", digit: 1 },
						{ label: "reine Bodenhaltung im Stall", digit: 2 },
						{ label: "Kleingruppen-/Käfighaltung", digit: 3 },
					]);
					return {
						kind: "number",
						id: `${lessonId}-l1-n-${seedTag}`,
						lessonId,
						level: 1,
						contextTag: "Spürnase · Eierstempel-Ziffer",
						prompt: `Welche erste Ziffer steht ganz vorn im Erzeugercode auf einem Hühnerei für ‚${pair.label}‘?`,
						expected: pair.digit,
						unit: "Kennziffer",
						placeholder: "0, 1, 2 oder 3",
						hint: "Merke: Je kleiner die Ziffer von 0 bis 3, desto mehr Platz und Auslauf hat die Henne!",
						explanation: `Die Ziffer ${fmt(pair.digit)} kennzeichnet auf jedem gestempelten Ei zuverlässig die ${pair.label}.`,
					};
				}

				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Vom Korn zum Brot",
						prompt:
							"Welche heimischen Getreidearten wachsen häufig auf bayerischen Feldern und werden in Mühle und Bäckerei zu Mehl und Brot verarbeitet?",
						correct: "Weizen, Roggen, Gerste, Hafer und Dinkel.",
						wrongs: [
							"Kakaobohnen, Kokosnüsse und Bananenstauden.",
							"Baumwolle, Kautschuk und Kaffeebohnen.",
						],
						wrongReasons: [
							"Kakao, Kokos und Bananen sind tropische Pflanzen und kein heimisches Getreide.",
							"Baumwolle, Kautschuk und Kaffee wachsen in warmen Klimazonen, nicht als Getreide auf unseren Äckern.",
						],
						hint: "Denke an Ähren oder Rispen auf heimischen Äckern im Sommer!",
						explanation:
							"Weizen, Roggen, Dinkel, Gerste und Hafer sind unsere wichtigsten heimischen Getreidearten.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Preis, Tierwohl & Ökologie",
					prompt:
						"Im Supermarkt kostet ein Karton Eier mit dem Stempel ‚0-DE-09…‘ deutlich mehr als Eier mit ‚2-NL-…‘. Wie lässt sich der Preisunterschied fachlich erklären?",
					correct:
						"Ziffer 0 steht für Bio-Haltung mit mehr Platz im Stall, Freilandauslauf und teurerem Bio-Futter; DE-09 zeigt kurze Wege aus Bayern.",
					wrongs: [
						"Die Ziffer 0 bedeutet, dass im Karton null echte Eier liegen.",
						"Bio-Hühner legen goldene Schalen, während die Haltung der Tiere völlig gleich ist.",
					],
					wrongReasons: [
						"0 ist die Haltungskennziffer für ökologische Erzeugung, nicht die Stückzahl!",
						"Der höhere Preis entsteht durch besseren Tierschutz, Auslaufflächen und ökologisches Futter ohne chemisch-synthetische Pestizide.",
					],
					hint: "Entschlüssle beides: ‚0‘ (Haltung & Futter) und ‚DE-09‘ (Herkunft Bayern).",
					explanation:
						"Tiergerechte Haltung und ökologischer Anbau kosten den Bauernhof mehr Aufwand und Fläche – unsere Kaufentscheidung bestimmt die Nachfrage mit.",
				},
				{
					contextTag: "Proben-Profi · Saisonal & regional",
					prompt:
						"Warum haben frische Erdbeeren oder Spargel im Januar oft hohe ‚ökologische Kosten‘, obwohl sie im Laden hübsch aussehen?",
					correct:
						"Außerhalb unserer Erntezeit müssen sie in beheizten Gewächshäusern gezogen oder mit Flugzeug und Kühl-Lkw weit transportiert werden.",
					wrongs: [
						"Weil Erdbeeren im Januar auf bayerischen verschneiten Äckern von allein reifen.",
						"Weil regionales Sommerobst grundsätzlich mehr Treibstoff verbraucht als Flugobst.",
					],
					wrongReasons: [
						"Im Januar herrscht in Bayern Winterruhe – Freilanderdbeeren reifen hier erst ab Mai/Juni.",
						"Kurze Wege zur Erntezeit sparen Kühlung und langen Ferntransport ein!",
					],
					hint: "Überlege: Woher kommt die Wärme im Januar – oder wie weit war die Reise?",
					explanation:
						"Regionale Lebensmittel der Saison sparen Transportenergie, Heizaufwand und Verpackung.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "strom-und-energie": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Leiter & Nichtleiter",
						prompt:
							"Welche beiden Stoffe leiten den elektrischen Strom gut und bringen im geschlossenen Prüfstromkreis das Lämpchen zum Leuchten?",
						correct: "Kupferdraht und Graphit (Bleistiftmine).",
						wrongs: [
							"Trockenes Holzlineal und Plastiklöffel.",
							"Radiergummi und Glasperle.",
						],
						wrongReasons: [
							"Trockenes Holz und Kunststoff sind Nichtleiter (Isolatoren) – deshalb ummantelt man Kabel mit Kunststoff!",
							"Gummi und Glas isolieren und lassen keinen elektrischen Strom hindurch.",
						],
						hint: "Metalle und die graue Mine im Bleistift leiten Strom!",
						explanation:
							"Metalle (z. B. Kupfer, Eisen, Aluminium) und Graphit sind elektrische Leiter; Kunststoff, Gummi, Glas und trockenes Holz sind Nichtleiter.",
					},
					{
						contextTag: "Spürnase · Wirkungen des Stroms",
						prompt:
							"Welche Wirkungen elektrischer Energie nutzt du bei Toaster, Schreibtischlampe und Handrührgerät?",
						correct:
							"Wärmewirkung (Toaster), Lichtwirkung (Lampe) und Bewegungs-/magnetische Wirkung (Motor im Handrührgerät).",
						wrongs: [
							"Elektrischer Strom hat ausschließlich eine Lichtwirkung.",
							"Toaster und Waschmaschine funktionieren ohne jede Energieumwandlung.",
						],
						wrongReasons: [
							"Neben Licht erzeugt Strom auch Wärme (Herd, Föhn) und Bewegung durch Elektromotoren!",
							"Jedes Elektrogerät wandelt elektrische Energie in Wärme, Licht, Bewegung oder Schall um.",
						],
						hint: "Was spürst du am Toaster, was siehst du an der Lampe, was dreht sich am Mixer?",
						explanation:
							"Elektrische Energie ist im Alltag so wertvoll, weil sie sich vielseitig in Licht, Wärme und Bewegung umwandeln lässt.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Stromerzeugung & Klima",
					prompt:
						"Vergleiche ein Kohlekraftwerk mit Windkraft- und Solaranlagen: Wo liegen jeweils Vor- und Nachteile?",
					correct:
						"Wind und Sonne sind erneuerbar und stoßen im Betrieb kein CO2 aus, hängen aber vom Wetter ab; Kohle liefert unabhängig vom Wetter Strom, ist aber endlich und belastet das Klima stark.",
					wrongs: [
						"Kohle wächst jedes Jahr auf Wiesen nach, während Sonnenlicht nach einer Woche aufgebraucht ist.",
						"Solaranlagen funktionieren nur nachts bei Neumond.",
					],
					wrongReasons: [
						"Kohle entstand über Millionen Jahre und ist ein endlicher fossiler Energieträger!",
						"Photovoltaikanlagen wandeln tagsüber Sonnenlicht in Strom um – für die Nacht helfen Speicher und Stromnetze.",
					],
					hint: "Prüfe zwei Fragen: 1. Entsteht beim Betrieb klimaschädliches CO2? 2. Scheint immer die Sonne / weht immer Wind?",
					explanation:
						"Die Energiewende kombiniert erneuerbare Quellen (Sonne, Wind, Wasserkraft, Biomasse) mit Speichern und konsequentem Stromsparen.",
				},
				{
					contextTag: "Proben-Profi · Sicherheit & Stromsparen",
					prompt:
						"Während das Experiment mit einer 4,5-V-Flachbatterie ungefährlich ist, hat die Haushaltssteckdose 230 V. Welche Regel schützt Leben UND spart im Alltag Energie?",
					correct:
						"Niemals Gegenstände in Steckdosen stecken oder Elektrogeräte mit nassen Händen/in der Badewanne nutzen – und ungenutzte Geräte ganz ausschalten statt im Stand-by zu lassen.",
					wrongs: [
						"Defekte Kabel einfach mit Papier umwickeln und den Fernseher Tag und Nacht laufen lassen.",
						"Einen verklemmten Toast mit einer Metallgabel aus dem eingeschalteten Toaster holen.",
					],
					wrongReasons: [
						"Beschädigte Kabel sind lebensgefährlich, und Dauerbetrieb verschwendet viel Strom.",
						"Metall leitet die lebensgefährlichen 230 V direkt in deinen Körper – immer zuerst Netzstecker ziehen!",
					],
					hint: "Wasser und Metall leiten Strom – 230 V sind lebensgefährlich!",
					explanation:
						"Sicherheitsregeln an der 230-V-Steckdose schützen vor Stromschlägen; Abschalten statt Stand-by schont Umwelt und Ressourcen.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "feuer-und-brandschutz": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Verbrennungsdreieck",
						prompt:
							"Welche drei Voraussetzungen müssen gleichzeitig erfüllt sein, damit ein Feuer brennt?",
						correct:
							"Brennbarer Stoff, Sauerstoff (Luft) und die nötige Zündtemperatur.",
						wrongs: [
							"Brennbarer Stoff, kaltes Eiswasser und völlige Dunkelheit.",
							"Kohlendioxid, Sand und ein Metalldeckel.",
						],
						wrongReasons: [
							"Eiswasser kühlt unter die Zündtemperatur – damit löscht man Feuer!",
							"Kohlendioxid, Sand und Deckel verdrängen Sauerstoff und löschen Brände.",
						],
						hint: "Denke an die drei Seiten des Verbrennungsdreiecks!",
						explanation:
							"Nur wenn Brennstoff, Sauerstoff und Zündtemperatur zusammentreffen, findet eine Verbrennung statt.",
					},
					{
						contextTag: "Spürnase · Verhalten im Brandfall",
						prompt:
							"Im Treppenhaus riecht es stark nach Rauch und der Rauchmelder piept laut. Wie verhältst du dich richtig?",
						correct:
							"Ruhe bewahren, Erwachsene warnen, gebückt raus aus dem Gebäude (keinen Aufzug benutzen!), Türen schließen und draußen 112 wählen.",
						wrongs: [
							"Sich leise unter dem Bett oder im Kleiderschrank verstecken.",
							"Mit dem Aufzug fahren und erst noch alle Spielsachen zusammensuchen.",
						],
						wrongReasons: [
							"Im Schrank findet dich die Feuerwehr viel schwerer und giftiger Rauch breitet sich aus!",
							"Aufzüge können bei Feuer stecken bleiben – verlasse das Haus zügig über das Treppenhaus.",
						],
						hint: "Menschenleben geht immer vor Sachen – und niemals verstecken!",
						explanation:
							"Raus ins Freie, Türen hinter sich schließen (bremst Rauch und Flammen), keinen Aufzug nutzen und 112 rufen rettet Leben.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Löschmethode begründen",
					prompt:
						"In der Küche entzündet sich heißes Speiseöl in einer Pfanne. Warum darf man NIEMALS mit Wasser löschen, sondern legt einen passenden Topfdeckel oder eine Löschdecke darauf?",
					correct:
						"Wasser verdampft im über 300 °C heißen Öl schlagartig und reißt brennende Fetttropfen als Stichflamme mit; der Deckel entzieht dem Feuer sicher den Sauerstoff.",
					wrongs: [
						"Weil Wasser selbst ein brennbarer Stoff wie Benzin ist.",
						"Weil kaltes Wasser den Topfdeckel zum Schmelzen bringt.",
					],
					wrongReasons: [
						"Wasser brennt nicht, verdampft aber im heißen Fett explosionsartig auf das Vielfache seines Volumens!",
						"Gefährlich ist die schlagartige Wasserdampf-Fettexplosion; Ersticken per Deckel stoppt die Sauerstoffzufuhr.",
					],
					hint: "Begründe doppelt: 1. Was passiert mit Wassertropfen im siedend heißen Öl? 2. Welche Ecke des Feuerdreiecks nimmt der Deckel weg?",
					explanation:
						"Fettbrände werden immer durch Ersticken (Sauerstoffentzug) und Abschalten des Herds bekämpft – niemals mit Wasser!",
				},
				{
					contextTag: "Proben-Profi · Wasser am Lagerfeuer",
					prompt:
						"Die Feuerwehr löscht ein brennendes Holz-Gartenhaus mit einem kräftigen Wasserstrahl. Welche Voraussetzung des Verbrennungsdreiecks wird dabei vor allem ausgeschaltet?",
					correct:
						"Das Wasser kühlt das brennende Holz unter seine Zündtemperatur ab.",
					wrongs: [
						"Das Wasser verwandelt das Holz in unbrennbares Eisen.",
						"Das Wasser erhöht die Zündtemperatur der Luft auf 5 000 °C.",
					],
					wrongReasons: [
						"Holz bleibt Holz – es brennt nur deshalb nicht mehr weiter, weil die Temperatur unter die Zündtemperatur sinkt.",
						"Wasser entzieht dem Brandherd Wärme (Kühleffekt).",
					],
					hint: "Überlege: Nimmt Wasser hier den Brennstoff weg – oder entzieht es Wärme?",
					explanation:
						"Wasser wirkt bei festen Stoffen wie Holz oder Papier vor allem durch Abkühlen unter die Zündtemperatur.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		case "wasser-und-wasserkreislauf": {
			if (level === 1) {
				const pool: ReadonlyArray<ChoiceBlueprint> = [
					{
						contextTag: "Spürnase · Zustandsformen des Wassers",
						prompt:
							"Wie heißen die Übergänge, wenn flüssiges Wasser durch Sonnenwärme zu unsichtbarem Wasserdampf aufsteigt und hoch oben in kalter Luft wieder zu Wolkentröpfchen wird?",
						correct: "Erst Verdunsten, dann Kondensieren.",
						wrongs: [
							"Erst Gefrieren, dann Verholzen.",
							"Erst Versickern, dann Schmelzen.",
						],
						wrongReasons: [
							"Gefrieren macht flüssiges Wasser bei 0 °C zu festem Eis, nicht zu Wasserdampf.",
							"Versickern beschreibt das Eindringen von Regenwasser in den Boden.",
						],
						hint: "Flüssig → gasförmig an der Sonne = Verdunsten; gasförmig → flüssige Tröpfchen an kalter Luft = …?",
						explanation:
							"Verdunstung, Kondensation zu Wolken, Niederschlag und Versickern/Abfluss treiben den natürlichen Wasserkreislauf an.",
					},
					{
						contextTag: "Spürnase · Eigenschaften von Wasser",
						prompt:
							"Du gibst einen Löffel Salz und einen Löffel feinen Kiesel-Sand in zwei Gläser Wasser und rührst um. Was beobachtest du?",
						correct:
							"Salz löst sich klar im Lösungsmittel Wasser auf; Sand ist unlöslich und setzt sich am Boden ab.",
						wrongs: [
							"Sand schmilzt bei Zimmertemperatur vollständig zu blauer Tinte.",
							"Beide Stoffe verschwinden spurlos aus dem Universum, sodass das Wasser nichts mehr wiegt.",
						],
						wrongReasons: [
							"Sand löst sich in Wasser nicht – deshalb wirkt eine Sandschicht im Boden sogar als Filter!",
							"Gelöstes Salz bleibt im Wasser erhalten (man würde es schmecken und beim Eindampfen zurückgewinnen).",
						],
						hint: "Denke an Salzwasser im Meer und Sand am Strand!",
						explanation:
							"Wasser ist ein gutes Lösungsmittel für viele Stoffe (z. B. Salz, Zucker), während Sand und Kies unlöslich bleiben.",
					},
				];
				return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool));
			}

			if (rng() < 0.55) {
				const minutes = pick(rng, [2, 3, 4]);
				const tapPerMin = 6;
				const cupLiters = 0.5;
				const saved = minutes * tapPerMin - cupLiters;
				return {
					kind: "number",
					id: `${lessonId}-l2-n-${seedTag}`,
					lessonId,
					level: 2,
					contextTag: "Proben-Profi · Wasserspar-Rechnung",
					prompt: `Aus einem offenen Wasserhahn fließen 6 Liter Trinkwasser pro Minute. Ben lässt beim Zähneputzen ${fmt(minutes)} Minuten lang das Wasser laufen; Mia nutzt einen Zahnputzbecher mit nur 0,5 Litern. Wie viele Liter Trinkwasser spart Mia bei diesem einen Putzvorgang?`,
					expected: saved,
					unit: "Liter",
					placeholder: "z. B. 11,5",
					hint: `Rechne zuerst Bens Verbrauch: ${fmt(minutes)} · 6 l = ${fmt(minutes * tapPerMin)} l. Ziehe davon Mias 0,5 l ab!`,
					explanation: `Ben verbraucht ${fmt(minutes * tapPerMin)} l, Mia nur 0,5 l. Mia spart ${fmt(minutes * tapPerMin)} − 0,5 = ${fmt(saved)} Liter Trinkwasser!`,
					diagnoseMistake: (val) =>
						val === minutes * tapPerMin
							? `${fmt(minutes * tapPerMin)} l ist Bens Gesamtverbrauch – ziehe noch Mias 0,5 l ab!`
							: null,
				};
			}

			const pool2: ReadonlyArray<ChoiceBlueprint> = [
				{
					contextTag: "Proben-Profi · Virtuelles Wasser & Schutz",
					prompt:
						"Obwohl es in Bayern regelmäßig regnet, achten wir auf sauberes und sparsames Wasser. Warum schadet es doppelt, wenn Farben/Reiniger in den Gully gekippt oder unnötig viele neue Baumwoll-Shirts gekauft werden?",
					correct:
						"Schadstoffe gefährden unser Grundwasser und Klärwerke; für die Industrieproduktion (z. B. Baumwolle in trockenen Ländern) werden tausende Liter ‚verstecktes‘ Wasser benötigt.",
					wrongs: [
						"Kies im Boden verwandelt giftiges Altöl automatisch in gesundes Mineralwasser.",
						"Bei der Herstellung von Papier, Jeans oder Autos wird überhaupt kein Wasser gebraucht.",
					],
					wrongReasons: [
						"Sand und Kies filtern nur groben Schmutz, aber keine gelösten Gifte, Öle oder Medikamente – ein Tropfen Öl verdirbt hunderte Liter Wasser!",
						"Industrieprodukte benötigen für Anbau, Färben und Kühlen sehr große Mengen Wasser.",
					],
					hint: "Denke an gelöste Schadstoffe im Grundwasser UND an das Wasser in Industrieprodukten!",
					explanation:
						"Gewässerschutz vor Ort und bewusster Konsum schonen den lokalen und globalen Schatz Trinkwasser.",
				},
			];
			return materializeChoice(rng, lessonId, level, seedTag, pick(rng, pool2));
		}

		default:
			throw new Error(`Unbekannte Station in LB 1–3: ${lessonId}`);
	}
}
