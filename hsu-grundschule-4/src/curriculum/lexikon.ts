import type { Lesson, Stage, StageId } from "../model/types";

export interface LexikonEntry {
	term: string;
	definition: string;
	lessonId: string;
	lessonNumber: number;
	lessonShortTitle: string;
	stageId: StageId;
}

export interface ReferenceTable {
	id: string;
	stageId: StageId;
	icon: string;
	title: string;
	subtitle: string;
	rows: ReadonlyArray<{ readonly key: string; readonly value: string }>;
}

export interface LexikonStageGroup {
	stage: Stage;
	entries: ReadonlyArray<LexikonEntry>;
}

export const REFERENCE_TABLES: ReadonlyArray<ReferenceTable> = [
	{
		id: "notruf-5w",
		stageId: "lb2",
		icon: "🚑",
		title: "Notruf 112 – Die 5 W-Fragen",
		subtitle: "Kostenlos und europaweit ohne Vorwahl erreichbar",
		rows: [
			{ key: "1. Wo ist es passiert?", value: "Ort, Straße, Hausnummer, Stockwerk oder markanter Punkt" },
			{ key: "2. Was ist passiert?", value: "Kurze Beschreibung (z. B. Sturz vom Klettergerüst, Brand)" },
			{ key: "3. Wie viele Verletzte?", value: "Anzahl der betroffenen Personen nennen" },
			{ key: "4. Welche Verletzungen?", value: "z. B. bewusstlos, starke Blutung, Verbrennung" },
			{ key: "5. Warten auf Rückfragen!", value: "Niemals sofort auflegen – die Leitstelle beendet das Gespräch" },
		],
	},
	{
		id: "eierstempel",
		stageId: "lb3",
		icon: "🥚",
		title: "Der Eierstempel-Code",
		subtitle: "Erste Ziffer = Haltungsform · Buchstaben = Herkunftsland",
		rows: [
			{ key: "0 – Ökologische Erzeugung", value: "Bio-Futter, viel Auslauf im Freien und mehr Platz im Stall" },
			{ key: "1 – Freilandhaltung", value: "Tagsüber Auslauf auf bewachsenen Wiesen, abends Stall" },
			{ key: "2 – Bodenhaltung", value: "Hennen bewegen sich frei in großen Hallen, aber ohne Freiland" },
			{ key: "3 – Käfig-/Kleingruppenhaltung", value: "Sehr wenig Platz auf Gitterböden (in DE kaum noch im Handel)" },
			{ key: "Länderkürzel (z. B. DE, AT, NL)", value: "DE = Deutschland (erste 2 Ziffern danach: Bundesland, 09 = Bayern)" },
		],
	},
	{
		id: "feuer-loeschen",
		stageId: "lb3",
		icon: "🔥",
		title: "Verbrennungsdreieck & Löschregeln",
		subtitle: "Fehlt nur eine Voraussetzung, erlischt das Feuer",
		rows: [
			{ key: "Brennbarer Stoff fehlt", value: "Brennstoff entfernen (z. B. Gashahn zudrehen, Brandgut wegräumen)" },
			{ key: "Sauerstoff fehlt", value: "Ersticken mit Löschdecke, Sand, Schaum oder passendem Topfdeckel" },
			{ key: "Zündtemperatur unterschritten", value: "Abkühlen mit Wasser (z. B. bei Holz-, Papier- oder Lagerfeuer)" },
			{ key: "Achtung Fettbrand / Strom!", value: "Niemals Wasser in brennendes Öl gießen (Fettexplosion!) – Deckel drauf!" },
		],
	},
	{
		id: "bayern-bezirke",
		stageId: "lb5",
		icon: "🦁",
		title: "Bayerns 7 Regierungsbezirke & Sitze",
		subtitle: "Landeshauptstadt des Freistaats Bayern: München",
		rows: [
			{ key: "Oberbayern", value: "Regierungssitz München (Alpen, Isar, Inn, Chiemsee)" },
			{ key: "Niederbayern", value: "Regierungssitz Landshut (Donau, Bayerischer Wald)" },
			{ key: "Oberpfalz", value: "Regierungssitz Regensburg (Donau, Naab, Regen, Oberpfälzer Wald)" },
			{ key: "Oberfranken", value: "Regierungssitz Bayreuth (Obermain, Fichtelgebirge, Frankenwald)" },
			{ key: "Mittelfranken", value: "Regierungssitz Ansbach (größte Stadt: Nürnberg; Rednitz/Pegnitz)" },
			{ key: "Unterfranken", value: "Regierungssitz Würzburg (Maindreieck, Rhön, Spessart)" },
			{ key: "Schwaben", value: "Regierungssitz Augsburg (Iller, Lech, Allgäuer Alpen, Bodensee-Ufer)" },
		],
	},
	{
		id: "linksabbiegen-8",
		stageId: "lb5",
		icon: "🚲",
		title: "Die 8 Punkte beim Linksabbiegen",
		subtitle: "Kernablauf in der Jugendverkehrsschule (4. Klasse)",
		rows: [
			{ key: "1. Umschauen", value: "Schulterblick nach links hinten: Ist die Fahrbahn frei?" },
			{ key: "2. Handzeichen links", value: "Linken Arm deutlich und rechtzeitig waagrecht ausstrecken" },
			{ key: "3. Einordnen zur Mitte", value: "Zur Fahrbahnmitte (bzw. an die Mittellinie) fahren, beide Hände an den Lenker" },
			{ key: "4. Vorfahrt & Gegenverkehr", value: "Verkehrszeichen, rechts vor links und entgegenkommende Fahrzeuge beachten" },
			{ key: "5. Nochmals umschauen", value: "Zweiter Schulterblick links kurz vor dem Abbiegen" },
			{ key: "6. Weiter Bogen", value: "Im weiten Bogen nach links abbiegen – Kurve niemals schneiden!" },
			{ key: "7. Rechtsfahrgebot", value: "In der neuen Straße sofort wieder am rechten Fahrbahnrand einordnen" },
			{ key: "8. Weiterfahren", value: "Aufmerksam geradeaus weiterfahren" },
		],
	},
	{
		id: "massstab-spicker",
		stageId: "lb5",
		icon: "📏",
		title: "Maßstab schnell umrechnen",
		subtitle: "Merke: 100 cm = 1 m · 100 000 cm = 1 000 m = 1 km",
		rows: [
			{ key: "Maßstab 1 : 1 000 (Ortsplan)", value: "1 cm auf der Karte = 1 000 cm = 10 m in der Wirklichkeit" },
			{ key: "Maßstab 1 : 10 000 (Stadtplan)", value: "1 cm auf der Karte = 10 000 cm = 100 m in der Wirklichkeit" },
			{ key: "Maßstab 1 : 25 000 (Wanderkarte)", value: "1 cm auf der Karte = 25 000 cm = 250 m (4 cm = 1 km)" },
			{ key: "Maßstab 1 : 50 000 (Freizeitkarte)", value: "1 cm auf der Karte = 50 000 cm = 500 m (2 cm = 1 km)" },
			{ key: "Maßstab 1 : 100 000 (Regionalkarte)", value: "1 cm auf der Karte = 100 000 cm = 1 km in der Wirklichkeit" },
		],
	},
];

export function buildLexikonGroups(
	stages: ReadonlyArray<Stage>,
	lessons: ReadonlyArray<Lesson>,
): ReadonlyArray<LexikonStageGroup> {
	return stages.map((stage) => {
		const entries: LexikonEntry[] = [];
		for (const lesson of lessons) {
			if (lesson.stageId !== stage.id) continue;
			for (const item of lesson.probenWissen) {
				entries.push({
					term: item.term,
					definition: item.definition,
					lessonId: lesson.id,
					lessonNumber: lesson.number,
					lessonShortTitle: lesson.shortTitle,
					stageId: stage.id,
				});
			}
		}
		return { stage, entries };
	});
}
