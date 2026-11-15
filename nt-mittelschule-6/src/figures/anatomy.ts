import { text } from "./svg-helpers";

/** Original schematic front view. Reference: BIÖG/familienplanung.de, male reproductive organs. */
export function maleAnatomy(): string {
	const leader = (x: number, y: number, x2: number, y2: number) =>
		`<path d="M${x},${y}L${x2},${y2}" class="bio-line"/>`;
	return `
 <path data-anatomy-part="scrotum" d="M245,235Q300,250 355,235Q375,300 345,335Q300,365 255,335Q225,300 245,235Z" class="bio-outline"/>
 <ellipse data-anatomy-part="testis" cx="270" cy="295" rx="18" ry="26" class="bio-organ"/>
 <ellipse data-anatomy-part="testis" cx="330" cy="295" rx="18" ry="26" class="bio-organ"/>
 <path data-anatomy-part="epididymis" d="M255,272Q240,292 255,316M345,272Q360,292 345,316" class="bio-duct"/>
 <path data-anatomy-part="vas-deferens" d="M250,285C220,245 225,190 225,150V80Q225,35 250,45L235,130Q245,145 265,145L295,170M350,285C380,245 375,190 375,150V80Q375,35 350,45L365,130Q355,145 335,145L305,170" class="bio-duct"/>
 <ellipse data-anatomy-part="bladder" cx="300" cy="100" rx="46" ry="35" class="diagram-box"/>
 <ellipse cx="265" cy="145" rx="12" ry="18" class="bio-organ"/><ellipse cx="335" cy="145" rx="12" ry="18" class="bio-organ"/>
 <ellipse data-anatomy-part="prostate" cx="300" cy="170" rx="24" ry="20" class="bio-organ"/>
 <path data-anatomy-part="penis" d="M284,190H316V275Q320,305 300,312Q280,305 284,275Z" class="bio-organ"/>
 <path data-anatomy-part="urethra" d="M300,135V299" class="bio-duct"/>
 ${text(300, 25, "Harnblase", "diagram-small")}${leader(300, 35, 300, 63)}
 ${text(95, 75, "Samenleiter", "diagram-small")}${leader(155, 80, 225, 100)}
 ${text(500, 105, "Bläschendrüsen", "diagram-small")}${leader(450, 110, 348, 143)}
 ${text(500, 160, "Prostata", "diagram-small")}${leader(440, 165, 325, 170)}
 ${text(500, 230, "Penis", "diagram-small")}${leader(450, 225, 318, 225)}
 ${text(500, 280, "Harnröhre", "diagram-small")}${leader(440, 275, 304, 265)}
 ${text(95, 255, "Nebenhoden", "diagram-small")}${leader(165, 255, 249, 285)}
 ${text(100, 335, "Hoden", "diagram-small")}${leader(155, 330, 260, 305)}
 ${text(480, 350, "Hodensack", "diagram-small")}${leader(420, 345, 355, 325)}
 ${text(300, 395, "Vorderansicht · Lage und Größen vereinfacht", "diagram-small")}`;
}
