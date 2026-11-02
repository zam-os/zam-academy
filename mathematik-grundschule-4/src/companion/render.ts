export type Mood =
	| "curious"
	| "welcoming"
	| "encouraging"
	| "celebrating"
	| "resting"
	| "snack";
export const MOODS: Record<Mood, string> = {
	curious: "Milo ist neugierig",
	welcoming: "Milo freut sich auf dich",
	encouraging: "Milo macht dir Mut",
	celebrating: "Milo freut sich über eure Entdeckung",
	resting: "Milo schläft zufrieden",
	snack: "Milo genießt seinen Snack",
};

/** Original code-native illustration; no remote images, fonts or animation runtime. */
export function island(mood: Mood, flower: boolean, bridge: boolean): string {
	return `<svg class="island-art mood-${mood}" viewBox="0 0 480 355" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${MOODS[mood]}. Eine bunte Insel mit einem Baum und Milos Werkstatt.">
    <defs><linearGradient id="sky" x2=".2" y2="1"><stop stop-color="#e7dcff"/><stop offset="1" stop-color="#c3e8e5"/></linearGradient><linearGradient id="fur" x2=".8" y2="1"><stop stop-color="#c7a6f2"/><stop offset="1" stop-color="#9270d4"/></linearGradient><linearGradient id="soil" x2="0" y2="1"><stop stop-color="#d3b18d"/><stop offset="1" stop-color="#aa7f66"/></linearGradient></defs>
    <rect width="480" height="355" rx="24" fill="url(#sky)"/>
    <circle cx="384" cy="68" r="31" fill="#ffdf8c"/><circle cx="384" cy="68" r="43" fill="#ffdf8c" opacity=".2"/>
    <g fill="#fff" opacity=".7"><path d="M28 91a19 19 0 0 1 36-8 25 25 0 0 1 46 14H28Z"/><path d="M329 127a16 16 0 0 1 30-6 21 21 0 0 1 40 12h-70Z"/></g>
    <ellipse cx="243" cy="306" rx="161" ry="14" fill="#718aab" opacity=".15"/>
    <path d="M62 250Q241 207 423 250Q403 320 244 320Q102 316 62 250Z" fill="url(#soil)"/>
    <ellipse cx="242" cy="248" rx="181" ry="45" fill="#93c5a1"/><path d="M65 252Q241 283 419 252" fill="none" stroke="#83b58e" stroke-width="11"/>
    <path d="M121 226 114 146" stroke="#ad8778" stroke-width="12"/>
    <path d="M80 169Q50 119 93 97Q116 67 148 100Q188 119 158 164Q121 196 80 169Z" fill="#76b18f"/><path d="M87 159Q119 181 155 150" fill="none" stroke="#68a381" stroke-width="9"/>
    <g class="workshop" transform="translate(332 195)"><path d="M-19 34H44" stroke="#a98368" stroke-width="9"/><path d="M-11 36v24m47-24v24" stroke="#987460" stroke-width="7"/><rect x="-8" y="12" width="20" height="20" rx="3" fill="#bb9cdd"/><rect x="17" y="21" width="10" height="10" rx="2" fill="#f6b37f"/>${bridge ? '<path d="M-10 7h46M-6 2v10m12-10v10m12-10v10m12-10v10" stroke="#e5ba83" stroke-width="5"/><path d="m12-5 6-10 6 10" fill="#ffdf8c"/>' : ""}</g>
    ${flower ? '<g transform="translate(149 250)"><path d="M0 0v-32" stroke="#4b956c" stroke-width="4"/><ellipse cx="-8" cy="-15" rx="10" ry="5" fill="#60a47c" transform="rotate(25 -8 -15)"/><g fill="#f39d87"><circle cy="-44" r="7"/><circle cx="10" cy="-36" r="7"/><circle cx="6" cy="-25" r="7"/><circle cx="-6" cy="-25" r="7"/><circle cx="-10" cy="-36" r="7"/></g><circle cy="-34" r="6" fill="#ffe3a0"/></g>' : '<path d="M149 250v-13m0 5q-14 0-12-9 12 0 12 9m0-4q13 0 11-10-11 0-11 10" fill="#69a47e" stroke="#69a47e" stroke-width="2"/>'}
    <g class="milo-character" transform="translate(239 188)">
      <ellipse cy="78" rx="62" ry="10" fill="#77709a" opacity=".18"/>
      <path d="M-37-11Q-78-90-42-81Q-14-64-17-11" fill="#b091e1"/><path d="M17-16Q18-91 53-75Q75-53 36-5" fill="#a486dc"/>
      <path d="M-41-29Q-60-65-45-66L-28-30M31-30Q34-68 46-62L39-30" stroke="#ddc5f5" stroke-width="10" stroke-linecap="round" fill="none"/>
      <ellipse cx="-61" cy="33" rx="15" ry="24" fill="#a182dc" transform="rotate(15 -61 33)"/><ellipse cx="61" cy="33" rx="15" ry="24" fill="#a182dc" transform="rotate(-15 61 33)"/>
      <path d="M-64 34Q-66-34 0-34Q66-34 65 35Q66 83 0 83Q-67 83-64 34Z" fill="url(#fur)"/>
      <ellipse cy="49" rx="38" ry="28" fill="#d9bff1"/>
      ${mood === "resting" ? '<path d="M-31 12q8-6 16 0m30 0q8-6 16 0" fill="none" stroke="#51396d" stroke-width="4" stroke-linecap="round"/><text x="53" y="-40" fill="#70518f" font-size="22">z z</text>' : '<ellipse cx="-24" cy="7" rx="5" ry="8" fill="#3f2c59"/><ellipse cx="24" cy="7" rx="5" ry="8" fill="#3f2c59"/><circle cx="-25" cy="4" r="2" fill="#fff"/><circle cx="23" cy="4" r="2" fill="#fff"/>'}
      <ellipse cx="-40" cy="23" rx="10" ry="5" fill="#edb0c2"/><ellipse cx="40" cy="23" rx="10" ry="5" fill="#edb0c2"/>
      <path d="M-8 22q8 12 16 0" fill="none" stroke="#624278" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="-36" cy="77" rx="20" ry="11" fill="#9571cf"/><ellipse cx="36" cy="77" rx="20" ry="11" fill="#9571cf"/>
      ${mood === "snack" ? '<g transform="translate(0 43)"><path d="M-13-4Q-21 8-10 20Q0 27 10 20Q21 8 13-4Q7-10 0-6Q-7-10-13-4" fill="#f4a279"/><path d="M0-7q-2-12 9-13" stroke="#588d69" stroke-width="4" fill="none"/></g>' : ""}
    </g>
    <g fill="#edd19d"><ellipse cx="196" cy="265" rx="8" ry="4"/><ellipse cx="214" cy="271" rx="7" ry="4"/><ellipse cx="235" cy="273" rx="8" ry="4"/></g>
  </svg>`;
}
