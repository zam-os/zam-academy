import { stoneValue, type Crossing } from "./crossing";
import type { World } from "../course/worlds";

export type Mood =
	| "curious"
	| "welcoming"
	| "encouraging"
	| "correct"
	| "celebrating"
	| "resting"
	| "snack"
	| "exploring"
	| "high-five";

export const MOODS: Record<Mood, string> = {
	curious: "Milo schaut dich neugierig an",
	welcoming: "Milo winkt dir zu",
	encouraging: "Milo legt den Kopf schief und hört zu",
	correct: "Milo strahlt und hebt die Pfoten",
	celebrating: "Milo macht einen Freudensprung",
	resting: "Milo schläft zufrieden",
	snack: "Milo knabbert am Apfel",
	exploring: "Milo schaut auf die Stellenwerttafel",
	"high-five": "Milo schlägt mit dir ein",
};

// The same landmark appears in the atlas and on Milo's island.
const landmarks: Record<World, string> = {
	forest:
		'<path d="M-28 8v25M2-7v36M28 6v24" stroke="#755541" stroke-width="7"/><path d="m-28-41-21 42h9l-14 19h51l-14-19h9Z" fill="#28796c"/><path d="m2-59-24 48h10l-18 24h64L16-11h10Z" fill="#24594f"/><path d="m28-34-18 35h8L5 19h44L37 1h8Z" fill="#4b9774"/><path d="M-1-44-15-13M-30-28-41-4" stroke="#87b992" stroke-width="3" stroke-linecap="round"/>',
	measure:
		'<path d="M-35-4v37M36-4v37" stroke="#674c42" stroke-width="5"/><path d="m-33-28 65 0 12 25h-90Z" fill="#fff0c1"/><path d="m-33-28 13 0-5 25h-21Zm26 0H7l2 25H-10Zm26 0h13L44-3H27Z" fill="#d76649"/><path d="M-38 15h77v15h-77Z" fill="#b77d4c"/><path d="M-25 13V2h19v11M10 13V0h13v13" fill="#efb44f"/><path d="M-38 16h77" stroke="#714a39" stroke-width="3"/>',
	shape:
		'<path d="M-38 20 4 5l36 15-40 16Z" fill="#aabfb8"/><path d="m-11 19 6-54h17l8 54Z" fill="#fff4cf"/><path d="m-8-12 23 0 2 13h-27Z" fill="#d76751"/><path d="M-6-35v-14H14v14" fill="#ffc769" stroke="#2e555b" stroke-width="4"/><path d="m-12-49 16-14 16 14Z" fill="#365c66"/><path d="M-11-34h30" stroke="#365c66" stroke-width="5"/><path d="m-38 3 7-11 8 11m46 10 5-7 9 7" fill="#678c88"/>',
	chance:
		'<path d="M-23 29V-18M4 30v-56M31 29V-8" stroke="#4c8258" stroke-width="5"/><path d="M-23 12q-20 0-20-15 16-2 20 15m27-9q19-2 20-16Q9-13 4 3m27 13q-14 0-19-12 14-3 19 12" fill="#69a170"/>' +
		[
			[-23, -20, "#e38b76"],
			[4, -37, "#b893dc"],
			[31, -12, "#f3ba5e"],
		]
			.map(
				([x, y, c]) =>
					`<g transform="translate(${x} ${y})" fill="${c}"><ellipse cy="-7" rx="8" ry="11"/><ellipse cx="8" cy="2" rx="11" ry="8"/><ellipse cx="-8" cy="2" rx="11" ry="8"/><circle cy="8" r="9"/><circle r="6" fill="#fff1ab"/></g>`,
			)
			.join(""),
	expedition:
		'<path d="m-41 26 33-53 41 53Z" fill="#efb14f"/><path d="M-8-27 4 26h29Z" fill="#d78347"/><path d="m-23 26 15-27 9 27Z" fill="#755443"/><path d="M23 7v-55" stroke="#6a513f" stroke-width="4"/><path d="M25-48q14-8 27 0l-9 7 9 5q-18-5-27 0Z" fill="#d56456"/>',
};

export function worldArt(world: World): string {
	return `<svg viewBox="-65 -66 130 111" aria-hidden="true"><path d="M-60 23q58-35 120 0-10 24-61 20-43 2-59-20Z" fill="#a5c587"/><path d="M-60 23q49 20 120 0-13 24-61 20-43 2-59-20Z" fill="#d7a96d"/>${landmarks[world]}</svg>`;
}

function milo(mood: Mood): string {
	const raised = ["celebrating", "welcoming", "correct", "high-five"].includes(
		mood,
	);
	const smiling = mood === "correct" || mood === "celebrating";
	const eyes =
		mood === "resting" || smiling
			? '<path d="M-21-7q6-7 12 0m19 0q6-7 12 0" fill="none" stroke="#342944" stroke-width="3.6" stroke-linecap="round"/>'
			: '<g fill="#33293e"><ellipse cx="-16" cy="-8" rx="5" ry="7"/><ellipse cx="16" cy="-8" rx="5" ry="7"/></g><g fill="white"><circle cx="-17" cy="-10" r="1.8"/><circle cx="15" cy="-10" r="1.8"/></g>';
	return `<g class="milo-pose">
		<ellipse cx="-21" cy="35" rx="14" ry="8" fill="#8365ae"/><ellipse cx="22" cy="35" rx="14" ry="8" fill="#8365ae"/>
		<ellipse cy="15" rx="32" ry="23" fill="#ad8ad3"/>
		<g transform="rotate(${mood === "exploring" ? 8 : mood === "encouraging" ? -12 : mood === "resting" ? 9 : 0} 0 0)">
		<path d="M-25-21C-34-27-62-65-53-74c9-10 35 12 43 44" fill="#b299d8" stroke="#8065a4" stroke-width="2.2"/><path d="M-27-33q-28-32-23-33 10 0 26 30" fill="#ebcadf"/>
		<path d="M12-29q13-61 31-55 21 10-12 62" fill="#b99cde" stroke="#8065a4" stroke-width="2.2"/><path d="M23-34q12-41 19-43 7 8-13 46" fill="#eccfe4"/>
		<path d="M-44-4q0-39 44-39T44-4Q45 25 0 26T-44-4Z" fill="url(#milo-fur)" stroke="#8065a4" stroke-width="2"/>
		<path d="M-32-25q10-10 22-10" fill="none" stroke="#e8d8fa" stroke-width="3" stroke-linecap="round"/>
		<g class="milo-eyes">${eyes}</g><g fill="#e4a7b8"><ellipse cx="-28" cy="2" rx="8" ry="4"/><ellipse cx="28" cy="2" rx="8" ry="4"/></g>
		<path d="M-3-2q3-2 6 0l-3 3Z" fill="#63475d"/>${smiling ? '<path d="M-8 5q8 16 16 0Z" fill="#724759"/>' : '<path d="M-6 5q6 6 12 0" stroke="#69485d" stroke-width="2.5" fill="none" stroke-linecap="round"/>'}
		</g>
		<path d="M-32 16q30 14 62 0l-5 10q-14 5-27 4l-14 12-4-13-9-3Z" fill="#227c78"/><path d="M-25 21q22 7 44 3" stroke="#8bd2bd" stroke-width="2" fill="none"/>
		<ellipse cx="-31" cy="22" rx="8" ry="13" fill="#a986c9" transform="rotate(23 -31 22)"/>
		<g transform="translate(32 19) rotate(${raised ? -120 : mood === "snack" ? 55 : -22})"><g class="milo-paw"><ellipse cy="6" rx="8" ry="14" fill="#b796d9" stroke="#9476b4" stroke-width="1.8"/><ellipse cy="11" rx="4" ry="5" fill="#ecc8df"/></g></g>
		${mood === "snack" ? '<g transform="translate(17 16)"><path d="M0-3q-14-7-12 5 2 15 12 12 9 4 12-11Q15-7 0-3" fill="#dc6c4d"/><path d="M0-3q-2-12 9-12-1 9-9 12" fill="#46815d"/></g>' : ""}
		${mood === "resting" ? '<text x="43" y="-28" fill="#534b75" font-size="19" font-weight="bold">z Z</text>' : ""}
	</g>`;
}

const stones = [79, 193, 307, 421];

export function island(
	mood: Mood,
	world: World,
	flower: boolean,
	bridge: boolean,
	game: Crossing | null,
): string {
	const x = game ? stones[game.step] : 238;
	const pose = game
		? "translate(" + x + " 171) scale(.77)"
		: "translate(239 160) scale(1.2)";
	return `<svg class="island-art mood-${mood}" viewBox="0 0 500 255" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${MOODS[mood]}.${game ? ` Milo steht auf dem Stein mit der Zahl ${stoneValue(game)}.` : ""}">
	<defs>
		<linearGradient id="milo-sky" x2="0" y2="1"><stop stop-color="#a7dfda"/><stop offset="1" stop-color="#fff0c5"/></linearGradient>
		<linearGradient id="milo-water" x2=".2" y2="1"><stop stop-color="#81cfc4"/><stop offset="1" stop-color="#469e9f"/></linearGradient>
		<linearGradient id="milo-fur" x2=".4" y2="1"><stop stop-color="#d8c1eb"/><stop offset="1" stop-color="#b08dd5"/></linearGradient>
	</defs>
	<rect width="500" height="255" fill="url(#milo-sky)"/>
	<circle cx="394" cy="43" r="27" fill="#fff0b1"/><circle cx="394" cy="43" r="34" fill="none" stroke="#fff2bc" stroke-width="1.5"/>
	<path d="M14 42h98q-2-9-16-9-8-19-28-10-15-12-27 3-20-4-27 16Zm266 18h59q-6-10-15-9-9-13-23-2-14-1-21 11Z" fill="#fff9de" opacity=".85"/>
	<path d="M0 125q42-32 70-26 57-55 110 1 42-26 79 7 61-52 112-21 45-36 82-10l47 21v45H0Z" fill="#8db9a7"/>
	<path d="M0 123q80-26 164-6 40-11 93 2 45-14 83-9 79-30 160-4v32H0Z" fill="#6fa894"/>
	<path d="M0 124q155-6 280-4t220-5v140H0Z" fill="url(#milo-water)"/>
	<g fill="none" stroke="#e1f3d9" stroke-linecap="round" opacity=".75"><path d="M12 144h40m9 0h11m332-14h54m-370 3h27M0 194h34m408-11h42m-78 43h53M27 231h40m5 0h10M115 246h71m105-7h42"/></g>
	${
		game
			? `<g transform="translate(435 104) scale(.38)">${landmarks[world]}</g>
		${stones.map((stone, i) => `<g transform="translate(${stone} 213)"><ellipse cy="13" rx="44" ry="5" fill="#317f82" opacity=".45"/><path d="M-42-3q4-14 42-15t42 15l-5 13q-35 11-73 0Z" fill="${i <= game.step ? "#c18b55" : "#7e9b92"}"/><ellipse cy="-3" rx="42" ry="12" fill="${i <= game.step ? "#ffdc8b" : "#d9e2c2"}"/><text y="5" text-anchor="middle" fill="#324f46" font-size="20" font-weight="bold">${i <= game.step ? stoneValue(game, i) : i === game.step + 1 ? "?" : "·"}</text></g>`).join("")}`
			: `<ellipse cx="252" cy="217" rx="207" ry="13" fill="none" stroke="#bce5d6" stroke-width="2"/>
	<path d="M37 177q63-40 211-40t213 41q-6 26-58 35l-39 6-35 11-66-1-45 4-54-7-51-3q-67-9-76-46Z" fill="#bd9066"/>
	<path d="M42 184q86 23 215 22t197-22q-19 22-81 29-163 25-283-1Z" fill="#e6ba7f"/>
	<path d="M36 175q31-37 167-40 134-15 214 20 65 24 29 37-73 25-224 20-129-3-175-23-12-6-11-14Z" fill="#91bb79"/><path d="M49 169q73-37 204-33 97-3 165 21-79-8-119 5-37 17-116 17-89 1-134-10Z" fill="#acd090"/>
	<path d="M153 200q-9-9 31-13t86-10q17-5 3-11 43-1 39 8-2 9-53 14-32 3-42 12-11 8-33 9Z" fill="#f4d29b"/>
	<g transform="translate(110 138) scale(.98)">${landmarks[world]}</g>
	<g transform="translate(358 151)"><path d="M-20-7h43v32h-43Z" fill="#f9deaa"/><path d="m-29-7 27-23L32-8l-4 5-30-15-23 16Z" fill="#ac6351"/><path d="m-29-7 27-28 34 26-5 3-28-20-23 23Z" fill="#df8666"/><path d="M-13 24V7q5-8 11 0v17" fill="#885d47"/><rect x="7" y="1" width="11" height="12" rx="2" fill="#76a9a4" stroke="#ae835b" stroke-width="2"/></g>
	${flower ? '<g transform="translate(143 182)" stroke="#4f7f51" stroke-width="3"><path d="M0 5v-17"/><path d="M-4-14q-11-14 1-12 5-10 9 0 12 3 1 10 0 10-11 2" fill="#ed997d" stroke="none"/><circle cy="-17" cx="1" r="3" fill="#ffd86e"/></g>' : ""}
	${bridge ? '<path d="M364 194q21-13 46-2m-43-3v14m12-19v15m13-16v15m13-13v15" fill="none" stroke="#866144" stroke-width="4"/>' : ""}
	<g fill="#537e5a"><path d="m58 180-5-5 6 2 2-7 2 8 7-4-5 7Zm258-28-3-6 5 4 3-7 1 8 6-2-4 5Z"/></g>
	<ellipse cx="238" cy="207" rx="50" ry="7" fill="#697a65" opacity=".32"/>`
	}
	<g transform="${pose}"><g class="milo-motion">${milo(mood)}</g></g>
	</svg>`;
}
