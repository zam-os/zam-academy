import { worldArt } from "../companion/render";
import { COURSE_LINKS } from "../course/catalog";
import { WORLDS, type World } from "../course/worlds";

export function islandMap(
	lessonId: string,
	current: World,
	browsing: World,
	open: boolean,
	child: boolean,
): string {
	const here = WORLDS.find((world) => world.id === current)!;
	const selected = WORLDS.find((world) => world.id === browsing)!;
	const lessons = COURSE_LINKS.filter(
		(lesson) => (lesson.world ?? "forest") === browsing,
	);
	return `<nav class="island-map" aria-label="Inselkarte und Lektionen">
		<div class="map-bar"><div class="location"><span class="location-art">${worldArt(current)}</span><div><small>Dein Lernort</small><${child ? "h1" : "strong"}>${here.label}</${child ? "h1" : "strong"}></div></div>
		<button class="atlas-toggle" data-action="atlas" aria-expanded="${open}" aria-controls="atlas"><svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="m2 5 7-3 6 3 7-3v17l-7 3-6-3-7 3ZM9 2v17m6-14v17"/></svg> ${open ? "Karte schließen" : "Inselkarte öffnen"}</button></div>
		<section id="atlas" ${open ? "" : "hidden"} aria-label="Eine Lektion auswählen">${open ? `<h2>Wohin möchtest du?</h2><div class="atlas-worlds" role="group" aria-label="Lernwelt auswählen">${WORLDS.map((world) => `<button class="atlas-world" data-action="atlas-world" data-value="${world.id}" aria-pressed="${browsing === world.id}">${worldArt(world.id)}<span>${world.label}</span></button>`).join("")}</div><h3>${selected.label} <small>· ${lessons.length} Lektionen</small></h3><div class="atlas-lessons">${lessons.map((lesson) => `<a href="#lesson=${lesson.id}" ${lesson.id === lessonId ? 'aria-current="page"' : ""}>${lesson.shortTitle}<span aria-hidden="true">${lesson.id === lessonId ? "✓" : "→"}</span></a>`).join("")}</div>` : ""}</section></nav>`;
}
