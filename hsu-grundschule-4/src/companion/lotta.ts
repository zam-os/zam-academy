import { escapeHtml } from "../model/format";

export type LottaMood = "curious" | "celebrating" | "encouraging" | "resting";

export const LOTTA_MESSAGES: Record<LottaMood, string> = {
	curious:
		"Spitz die Luchsohren! Lass uns gemeinsam herausfinden, wie unsere Welt funktioniert.",
	celebrating:
		"Juhu, Volltreffer! Wieder ein Forscher-Geheimnis gelüftet – schau mal in dein Forscherbuch!",
	encouraging:
		"Kein Problem! Echte Forscherinnen und Forscher prüfen ihre Spur einfach noch einmal. Lies meinen Tipp!",
	resting:
		"Ich rolle mich kurz im Moos zusammen. Deine Entdeckungen warten geduldig auf dich!",
};

export function renderLottaSvg(mood: LottaMood): string {
	const eyes =
		mood === "resting"
			? `<path d="M58 64 Q64 70 70 64" fill="none" stroke="#2b1e16" stroke-width="3" stroke-linecap="round"/>
         <path d="M90 64 Q96 70 102 64" fill="none" stroke="#2b1e16" stroke-width="3" stroke-linecap="round"/>`
			: mood === "celebrating"
				? `<path d="M57 65 Q64 57 71 65" fill="none" stroke="#2b1e16" stroke-width="3.2" stroke-linecap="round"/>
           <path d="M89 65 Q96 57 103 65" fill="none" stroke="#2b1e16" stroke-width="3.2" stroke-linecap="round"/>`
				: `<circle cx="64" cy="63" r="5.5" fill="#2b1e16"/>
           <circle cx="66" cy="61" r="2" fill="#ffffff"/>
           <circle cx="96" cy="63" r="5.5" fill="#2b1e16"/>
           <circle cx="98" cy="61" r="2" fill="#ffffff"/>`;

	const mouth =
		mood === "celebrating"
			? `<path d="M72 79 Q80 89 88 79 Z" fill="#b84a39" stroke="#2b1e16" stroke-width="2.2"/>`
			: mood === "encouraging"
				? `<path d="M73 81 Q80 85 87 80" fill="none" stroke="#2b1e16" stroke-width="2.5" stroke-linecap="round"/>`
				: `<path d="M73 79 Q80 86 87 79" fill="none" stroke="#2b1e16" stroke-width="2.5" stroke-linecap="round"/>`;

	const badgeOrProp =
		mood === "celebrating"
			? `<g class="lotta-sparkle">
           <polygon points="132,26 135,34 144,34 137,39 139,48 132,43 125,48 127,39 120,34 129,34" fill="#f5b700" stroke="#9e6d00" stroke-width="1.5"/>
           <circle cx="26" cy="34" r="5" fill="#f5b700"/>
         </g>`
			: mood === "resting"
				? `<text x="122" y="38" font-size="16" font-weight="700" fill="#1f8a5b">zZz</text>`
				: `<g transform="translate(112, 74) rotate(-18)">
           <circle cx="14" cy="14" r="12" fill="#d9f2fc" stroke="#1d6fb8" stroke-width="4"/>
           <line x1="6" y1="23" x2="-4" y2="36" stroke="#7c4a21" stroke-width="5" stroke-linecap="round"/>
         </g>`;

	return `<svg class="lotta-svg lotta-mood-${mood}" viewBox="0 0 160 132" role="img" aria-label="Luchs Lotta (${mood === "celebrating" ? "jubelnd" : mood === "encouraging" ? "ermutigend" : mood === "resting" ? "ausruhend" : "neugierig"})">
    <ellipse cx="80" cy="121" rx="46" ry="7" fill="rgba(0,0,0,0.10)"/>
    <!-- Lynx ears with iconic dark tufts -->
    <polygon points="38,48 48,16 66,38" fill="#df8b3e" stroke="#2b1e16" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="44,44 49,24 59,39" fill="#f9d8b6"/>
    <path d="M48 16 L45 5 M48 16 L51 6" stroke="#2b1e16" stroke-width="3" stroke-linecap="round"/>
    <polygon points="122,48 112,16 94,38" fill="#df8b3e" stroke="#2b1e16" stroke-width="2.5" stroke-linejoin="round"/>
    <polygon points="116,44 111,24 101,39" fill="#f9d8b6"/>
    <path d="M112 16 L109 6 M112 16 L115 5" stroke="#2b1e16" stroke-width="3" stroke-linecap="round"/>
    <!-- Body & explorer scarf -->
    <path d="M52 92 Q80 124 108 92 L114 118 Q80 124 46 118 Z" fill="#df8b3e" stroke="#2b1e16" stroke-width="2.5"/>
    <path d="M50 93 Q80 108 110 93 L102 108 Q80 116 58 108 Z" fill="#1f8a5b" stroke="#135638" stroke-width="2"/>
    <circle cx="80" cy="104" r="5" fill="#f5b700" stroke="#7c4a21" stroke-width="1.5"/>
    <!-- Lynx cheek ruff & head -->
    <path d="M36 66 Q30 78 44 88 Q80 102 116 88 Q130 78 124 66 Q122 36 80 36 Q38 36 36 66 Z" fill="#ea9a4c" stroke="#2b1e16" stroke-width="2.5"/>
    <ellipse cx="80" cy="75" rx="28" ry="19" fill="#fff3e2"/>
    <!-- Lynx spots -->
    <circle cx="48" cy="70" r="2.2" fill="#8b4d1b"/>
    <circle cx="44" cy="77" r="2" fill="#8b4d1b"/>
    <circle cx="112" cy="70" r="2.2" fill="#8b4d1b"/>
    <circle cx="116" cy="77" r="2" fill="#8b4d1b"/>
    ${eyes}
    <!-- Nose & mouth -->
    <polygon points="75,71 85,71 80,77" fill="#c85343"/>
    ${mouth}
    ${badgeOrProp}
  </svg>`;
}

export function renderStampSvg(
	symbol: string,
	title: string,
	earned: boolean,
	accent: string,
): string {
	const safeTitle = escapeHtml(title);
	const safeSymbol = escapeHtml(symbol);
	const stroke = earned ? accent : "#9aa3ad";
	const fillBg = earned ? "rgba(255, 250, 235, 0.94)" : "rgba(160, 168, 178, 0.12)";
	return `<svg class="stamp-svg ${earned ? "is-earned" : "is-locked"}" viewBox="0 0 96 96" role="img" aria-label="${safeTitle}: ${earned ? "freigeschaltet" : "noch offen"}">
    <circle cx="48" cy="48" r="43" fill="${fillBg}" stroke="${stroke}" stroke-width="3.5" stroke-dasharray="${earned ? "none" : "5 4"}"/>
    <circle cx="48" cy="48" r="36" fill="none" stroke="${stroke}" stroke-width="1.5"/>
    <text x="48" y="54" text-anchor="middle" font-size="30">${earned ? safeSymbol : "🔒"}</text>
    ${earned ? `<circle cx="75" cy="21" r="9" fill="${stroke}"/><text x="75" y="25" text-anchor="middle" font-size="11" fill="#ffffff" font-weight="700">✓</text>` : ""}
  </svg>`;
}
