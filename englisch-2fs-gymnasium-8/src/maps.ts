import type { WorkshopPiece } from "./types";

// Natural Earth v5.1.2, 1:10m Admin 0 Map Units (public domain) for Great Britain & Ireland.
const britainAreas = {
	Ireland:
		"M130 181.3L125.9 184L122.3 194.7L112.2 196.5L118 200.3L105.9 206.2L113.5 213.3L114.1 216.4L127.9 220.4L132.4 215.9L131.4 211.4L135.9 208.2L139.4 210.9L141.9 216.8L145.8 218.2L146 223.4L152.6 222.5L153.4 220.6L159.6 224.5L158.2 226.1L153 224.4L152.5 228.5L156.1 230.6L156.4 239.2L160.4 243.4L159.2 246.9L157.3 247.2L160.8 251L159 250L156.7 251.9L159.9 254.4L162.6 267.8L159 273.6L157 284.7L152.9 293L149.5 292.2L151.8 295.2L152.7 293.9L153.4 299L147.3 299.8L141.5 298.4L142.5 296.4L138.2 302L136.5 295.2L137.6 299.7L136 301.4L133.6 301.7L133.6 300L120.8 303L120.1 304.5L122.2 304.7L121.1 307.5L117.6 309.4L114.3 307.9L112.4 310.7L113.5 311.5L109.9 314.3L104 315.2L105.4 311.4L99.2 311.8L101.8 312.8L102.7 316.7L99.1 319.7L97.8 318.8L97.8 320.3L95.9 319.1L97.5 319.7L96.6 323.1L90.7 321.7L92.5 322.2L92.3 324.5L88.2 323.7L86.1 326.2L81.3 325L78.6 328.1L75.3 328.7L76 326L74 327.6L72.9 325.2L63.1 329.8L62.7 328.1L70.2 323.1L62.4 325.6L72.9 318.6L69.8 316.9L68.1 320L54.4 323.3L58.9 318.1L64 316.6L65.2 313.8L69.3 312.1L54.9 317.7L52.3 313.2L49.5 315.8L48.1 311.8L51.8 310.8L50.4 309L51.5 307.6L59.2 303.4L60.3 304.5L60.8 301.7L64.7 300.9L47 303.1L46.4 299.7L48.5 300.1L48.9 297.7L53.9 295.3L54.1 297.5L55.8 297.2L56.8 294.4L59.8 297.4L65.2 296.9L61.8 295.9L62.7 291.7L59.7 290.2L67.9 287.7L66.6 286.8L67.5 283.7L78.3 283.3L90.9 279.5L85.4 278.7L85.9 275.3L80.6 281.5L77 282.9L75.7 282.6L77.1 280.9L73.1 282L69.3 279.8L70 280.9L65.8 283.4L60.1 284.3L71.4 276.2L75.2 268.8L72 268.5L77.3 260.1L80.3 261.5L82.5 261.2L81.1 259.6L84.3 260.1L83.2 259L86.1 260.1L87.1 257L83.2 257L85.9 255.4L83.8 254.8L71.1 256.7L70 254.2L68.5 256.4L70 250.3L67.9 252.6L67.4 250L63.4 253.7L60.9 252.8L64 250L61.6 249.9L62.4 248.3L59.4 250.5L53.8 249.2L58.1 246.4L53.7 243.3L58.3 243.8L57.2 241.5L61.8 240.8L66.3 241.6L60.8 239.6L61 234.7L69.7 233.5L68.2 232.6L69.7 229.2L59.9 230L60.6 227L63.9 228.5L60.9 223.5L62.7 220.5L59.2 221.9L60.8 220.2L58.1 216.1L56.1 218.6L56.7 221.2L55.3 221.2L56.8 216L55.4 215.5L58.5 212.6L61.5 214.3L59 215.2L60.7 216.7L62.1 214L64.5 214.6L62.4 211.9L64 211.2L77.4 212.6L80.7 219.1L83.1 213.2L92.8 214L97.1 216.6L94.3 214.6L98.2 213.8L95.6 212.6L96.9 211.7L93.1 210.4L98.1 207.5L98.3 205.6L98.9 206.8L104.9 204.5L103.4 203.6L107.3 198.6L102.8 200.3L102.2 199L98.5 201.9L100.4 200.3L99.5 198.8L98.4 200.4L92.9 199.7L89.7 196.5L93.8 193.6L98.5 194.1L96.6 192.8L99.8 193.8L95.9 191.6L97.6 190.2L101.9 191L100.5 190L101.6 188.1L98.7 187.3L100.9 186.2L98.5 184L101.4 181.5L102.1 182.7L103.2 177.5L106.7 177.5L106.3 179L111 175L110.3 177L112.8 176.4L114.1 178.4L115.6 173.6L115.2 176.2L117.7 177.3L118.1 180L118.1 175.1L118 177L115.9 175.1L119.7 172.9L122.7 179.3L118.7 186L124.5 181.8L122.1 175.3L122.8 172.2L129.7 172.5L126.4 168.3L138 174.3Z M59.3 227L59.5 230L56.7 226.4L51.5 225.8L59 224.2Z",
	"Northern Ireland":
		"M130 181.3L135 182.1L137.4 176.1L142.8 176.8L150 173.9L159.8 175.4L162.8 184.8L167.6 191.4L169.8 193L167.7 190.5L168.9 190L170.5 192.6L164.7 200.1L169 197.2L173.5 197.2L177.2 205.2L176.1 210.4L175 211.2L173.4 208.6L173.9 204.1L170.1 201.4L172.1 207L170 210.7L173.3 209.4L174 212.9L171.4 215.7L166 215.6L165.2 220.8L160.3 223.7L153.4 220.6L152.6 222.5L146 223.4L145.8 218.2L141.9 216.8L139.4 210.9L135.9 208.2L131.4 211.4L132.4 215.9L128.8 220.1L128.8 218.4L127.7 219L128.3 220.4L114.1 216.4L113.5 213.3L105.9 206.2L118 200.3L112.2 196.5L122.3 194.7L125.9 184Z",
	Scotland:
		"M265.8 151.1L257.8 158.1L261.5 165.7L252.1 171.2L248.3 176.7L241.6 182.4L239.7 182L239.1 184.9L225.6 184.3L225.3 188.9L219.1 190L219.2 188.8L219 191.3L215.3 193.5L213.3 193.6L212.7 191L211.2 193.4L209.2 189.6L207.4 190.7L203.9 187.9L205.4 192L204.5 197.2L191.4 189.8L189.6 192.8L191.5 199L184.3 189.1L183.8 184.5L185.4 182.8L188.5 187.4L187.1 183L188.2 178.3L191.9 175L194.9 167.1L198.1 164.9L196.4 159.3L190.5 155L192 153.1L191.7 145.7L201.9 146L196.9 144.7L193 139.9L194.1 143.4L192.3 143.6L191.9 140.4L194.8 134.6L192.3 138.5L190.5 136.2L191.2 143.5L189.6 143.2L190.6 144.7L188.8 148.4L185.2 142.7L186.2 147.1L183.7 144.4L182.1 147.5L183.2 150L180.4 148.8L179.6 143.2L190.5 131.7L178.8 142.7L176.8 142L180 152.6L175.7 157.7L176.6 159.8L173.2 166.6L174.7 169.4L173 171.3L168.3 171.7L170.7 156.4L176.6 149.4L172.8 152.8L171.2 151.4L173.6 145.8L170.9 147.7L170.3 146.5L173.6 141.6L170 145.5L173.4 139.1L174.6 139.6L175.1 135.4L172.6 137.4L175.6 132.4L173 132.9L173.5 129.6L176.7 128.4L174.4 128.4L176.5 125L183 124.8L186.7 119.9L183.2 124.2L178.6 124.3L177.7 122.5L176.2 123.6L177.3 121L182.1 119.9L177.6 120.8L180.1 116L188.5 113.7L182.2 113.7L185.3 109.5L170.9 122.7L168.9 119.6L166.2 120.5L162.2 116.8L166.6 117.4L165.9 116L168.6 114.4L174.3 114.6L158.2 115.3L156.3 113.2L168.7 110.9L166.3 109.1L171.2 107.3L164.5 106.4L166.2 106.2L166.8 102.2L174.8 101.9L172.1 102.4L168.2 99L171.6 96.8L178 97.7L170.7 95.6L173.4 91.2L177.8 92.7L175.3 90.7L176.9 89L173.4 90.7L169.4 89.9L176.7 84.8L173.7 87.2L171.8 86.8L172.2 85L167.4 87.5L165.7 81.9L166.6 78.3L171.5 81.1L175.1 79.9L171.2 79.8L167.4 75.8L167.8 73.6L170.9 73L167.5 71.6L167.3 67.9L170.9 66.8L172.6 70.5L172.5 64L175.7 67L177.6 64.9L182.6 67.4L178.2 64.5L178.9 63.4L186.6 67.9L176.8 57.6L180.6 58.2L182.1 55L178.2 50.4L185 50L190.1 52L188.9 50.8L190.3 50.3L185.9 49.8L183.9 46.6L184.7 44.1L188 45.2L185.9 44.1L188.5 43.2L185.7 40L188.7 35.3L192.7 36.3L193.1 39.6L194.2 36.2L197.2 38.3L194.6 42.7L199.2 37.6L202 37.9L203.3 39.6L201.5 42.7L205.5 39L208.3 39.6L213.6 36.7L217.1 37.9L224.9 35.4L230.9 36.5L230.7 33.3L239.9 34.8L237 40.1L239 42L237 46L214.3 63.7L212.2 62.6L214.2 66.5L206.6 66.7L204.2 64.9L206.4 67.2L213.4 68.6L220.1 67L214.7 73.6L213.3 71.9L203.9 77.1L214.2 73.9L211.7 78.3L207.6 79.5L209 80L207.9 81.7L213.5 79.3L212.2 78.1L225 75.8L229.8 72.4L238.4 74.7L266.5 73.3L270.8 76.9L272.7 82.7L266.9 89L261.6 105.6L255.3 112.3L253 118.8L247.2 124L238.8 124.6L232 128.1L243.4 124.3L245.5 125.6L244.6 128.1L251.4 131.7L245.4 135.4L241.3 134.7L236.1 140.5L231.5 142L222.9 141L218.6 138.5L223 142.6L238.4 145.3L242 144.4L245 140.6L249.9 140.7L251.2 143L262.8 146.6Z M186.6 163.2L186.4 165.4L184.1 166.3L179.4 164.3L178.2 157.6L180.7 154.5L183.7 155.6Z M187.6 153.4L183.2 146.7L186.3 148Z M161.6 154.2L160.9 157L154.9 160.4L154.1 158.3L156.1 157L153.9 154.8L155.9 152.2L153.9 152L149.3 156.2L150.8 149.3L154.1 147.7L154.3 150.5L158.8 145.5Z M167.7 138.5L169.8 136.8L170.5 138.5L161.7 151.5L160.4 146.5L165.4 144.1L162.9 144.3L162.8 142.7Z M141.1 121L143.1 121.9L139.5 124.9L137.3 124.2L136.7 122.5Z M170.5 125.3L171.3 126.7L169.1 126.1L168 128.1L170.1 128.2L167.4 130L165.7 128.4L155.5 132.3L153 130.7L153.7 129L156 130.3L161.9 127.4L157.1 127.5L162 122.5L159.1 123.7L153.6 120.5L153.9 118.2L157.4 116.7L160.9 116.9L163.4 121.5L167.9 122Z M150.5 115.3L144.5 120L147 116.4Z M126.2 101.7L124.8 104.3L121.9 104L124.7 99.7Z M153.9 99.7L156.1 101.7L153.5 104.5L150.6 101.9Z M130.1 88.8L131.3 89.6L129.7 92.4L127.2 92.1L129.6 95.5L127.4 96L130.8 97.4L127.2 98L124.6 92.4L126.3 89.3L125.3 86.2L127.2 85.4L130.6 88.2L126.8 86.2L126.8 87.5Z M129.5 82.3L131.1 84.9L125.8 83.8L126.8 82Z M160.7 87.9L162.1 81.1L162.7 87.9Z M133 75.3L134.5 75.6L133.8 77.2L130.8 76.1L133.1 78.7L128.3 79.5L132.7 79.6L132.3 81.1L122.2 77.8L124 75L126.1 76.1L128.3 73.9L129.2 75.5L131.7 73.9Z M147.7 87.9L144.3 87.2L142 83.4L143.6 83.4L143.8 81L146.6 83.9L145.9 81.7L147.7 81.5L145.4 79.5L145.7 77.2L154.3 83.1L151.6 75.6L154.3 73.3L158.4 77.9L157.5 85.9L159.1 85.4L159.8 88.5L158.4 89.6L165.4 92.2L171.6 91.2L171.3 93L162.2 100.9L162.7 97.3L166.4 94.4L162.8 94.9L161.3 92.7L160.1 96.9L158.1 93.8L154.1 95.5L155.2 93.8L153.4 94.4L153.4 92.1L149.9 89.6L154 89.3L148.6 85.1Z M137.6 71.6L133.1 67.8L134.3 68.8L138.6 66.5L137.4 65.4L140.8 65.1L140.6 63.7L133.5 61.5L138.1 59L134.9 59.5L135.8 57.8L133.5 57L133.5 53.6L136 53.3L135.6 51.1L138.8 52.2L140.1 56.7L139.8 53.3L144 53.3L141.1 49.4L156.1 40.2L158 46.9L152.9 51.4L158.5 50.5L158.2 52.2L156.3 53.5L152 52.5L152.7 55.3L146.3 57.6L151.8 56.7L153.2 59.5L148.2 60.4L150.6 62.3L147.8 64.6L144 61.5L147 58.7L144.5 58.7L142.5 60.9L145.2 66L141.9 65.2L143.1 68L140.2 67.9Z M241.6 26.7L243.4 27L242 31.1L240 27.8L241.3 27.5L239.5 27.5Z M233.9 28.6L237 28L232.6 29.2L229.2 25.2L230.2 23.4L235.4 26.1Z M247.5 21.3L247.8 23.2L245 25L240.9 21.7L235.1 23.5L234.5 18.5L232.9 22.1L231.2 20.8L231.3 16.1L233.1 14.2L238.2 14.9L240.5 17.7L237.4 20.2L245.9 20.4L245.7 23.1Z M240.3 14.9L237.7 12.3L241.6 12.6Z M254.8 8.1L255.7 7L256.2 8.4L253 10.7L250.7 10.1L248.4 12.2L250.5 8.1Z M239.1 7L241.3 5.3L240.7 7L244.8 9.8L243.4 10.7Z",
	Wales:
		"M238.2 255.5L242.5 258.3L241.5 260.2L247.8 269.2L246.1 270.2L240.6 268L237.1 270.8L236.7 274.5L241.4 277L237.4 285.4L240 283.8L241 285L234.8 289.1L238.6 292.9L241.5 293.1L237.2 304.2L240.9 310.3L243.7 310L249.6 314.4L248.4 323.7L244.1 325.7L241.1 325L235.9 329.5L235.6 331.8L232.9 332.3L225.9 331.5L221.2 328L218.2 322.5L215 323L213.7 325.4L206.9 325.3L206.9 322.8L212.6 320.4L206.2 320.3L204.9 315.7L202.4 317.9L197.6 318.1L195.9 321.4L189.9 323.6L185.3 320.3L192.4 318.8L191.5 316.9L193 315.5L190.1 316.3L190.7 318.7L183.6 319.8L181.9 318L185.5 316.2L185.3 313.5L180.3 312.7L180.6 310.8L185.3 308.8L186.6 306L192.5 306.5L195.7 302.5L206.2 298.2L211.6 292.1L212.9 285.4L215.8 284.6L213 284.9L211.1 282.3L214.7 277L213.1 277.5L210.6 274.2L212.4 269.1L203.8 270.5L201.2 274.7L198.9 273.6L195 275L195.3 273.1L205.1 264.9L205.5 261.5L209.8 257.2L218.8 254.2L217.6 252.3L224.7 254.3L231.8 251.7Z M211.8 253.4L213.3 253.7L211.9 255.8L203.7 260.7L204.4 258.6L201.5 258.7L199.6 254.8L199.6 250L206 248.9L209.1 253.9Z",
	England:
		"M249.1 322.8L249.6 314.4L243.7 310L240.9 310.3L237.2 304.2L241.5 293.1L238.6 292.9L234.8 289.1L241 285L240 283.8L237.4 285.4L241.4 277L236.7 274.5L237.1 270.8L240.6 268L246.1 270.2L247.8 269.2L241.5 260.2L242.5 258.3L238.2 255.5L235.6 250.6L239.5 248.3L243.5 254.3L248.2 251.7L245.3 252.9L242.4 251.7L237.8 243.2L243 235.9L239.1 234.5L238.9 228.9L244.1 226.4L244.8 224.4L242.5 223.7L245.7 220L244.2 217.1L245.7 214.9L242 218.7L239.1 216L236.6 222.5L234.1 220.5L235 214.3L234.4 216.8L232.4 217.2L223.9 204.1L230.9 188.2L233.8 188.2L232.2 187.4L234.8 186L239.4 186.3L238 185.7L239.8 185.4L239.7 182L241.6 182.4L252.1 171.2L261.5 165.7L257.8 158.1L265.8 151.1L271.2 158.2L276 160.1L278.9 177.7L285.2 194.4L287.9 196.3L287.2 199.6L288.8 198.6L303.8 205.5L309 215.2L316.4 220.5L312.7 224.2L321.9 239.8L321.8 242.6L321.5 240.8L315.5 240L311.6 235.9L299.5 237.4L311.1 237.1L324.8 250.1L327.7 258.4L327.1 262.3L318.7 270.8L321.1 270.6L328.4 275.6L333.2 267.4L351.5 269L361.9 276.1L364.5 287.2L359.5 303.8L353 309.6L348.5 305.9L351.4 308.9L346.2 309L351.7 309.3L349.6 312.1L351.9 312L351.6 313.5L346.1 316.3L343.9 313.5L341.1 317.5L336.6 318.6L338.2 319.7L342.6 317.6L342.4 324L339.6 326.1L330.3 327.4L328.4 329.5L336.5 328.5L337.2 329.8L333.4 332L336.9 332.3L337.3 330.9L338.3 333.2L343.8 333.8L355.4 332L354.4 341.9L345.1 346.4L343.9 351.5L338.2 350.9L334.6 353.9L327.9 355.5L325.4 358.5L311.4 355L298.7 357.2L297.9 359.2L294.9 357.5L295.9 356L294 354.5L290.2 357.1L290.6 354.5L288.1 354.5L288.5 357.1L280.3 351.5L284.2 356.3L277.9 359.6L270.1 359.3L268 360.8L265.4 358.8L264.3 360.4L267.6 361.4L267.3 364.4L256 362.6L254.6 367.5L253.8 364.9L243.9 359L233.6 361.4L230.8 363.8L228.3 361.3L227.7 370.3L225.9 371.4L227.7 372.5L224.2 375.9L223.2 380L219.9 380.4L215.4 375.9L213 376.8L209.2 370.3L206.9 372.8L209.4 373.6L209.4 375.9L205.6 373.9L197 376.2L196.3 375L193.9 379.4L188.3 383.2L187 381.1L185.1 385.2L186.9 386.6L183.4 390.8L180.5 385.8L176.5 383.9L173.4 386.9L170.1 387L170.6 382.5L180.2 378.7L187.1 371.5L188 367L189.8 366L190.1 367.8L192.4 368L190.5 364.9L193.8 364.7L199.4 357.3L200.7 347.5L206.2 348.1L209 345L208.5 340.2L220.4 337.9L230.4 340.5L239.8 340.2L241.1 332.3L247.8 327.6L256.3 317.3L256.1 316L253.9 317.6Z M290.2 359.9L288 364.4L285.1 365.2L279.5 361.5L277.6 362.1L284.1 357.4Z M342.1 331.2L342.1 333.2L337.5 331.2L338.3 329.7Z",
} as const;

export function britainPoint(longitude: number, latitude: number): [number, number] {
	return [35 + (longitude + 10.9) * 26, 16 + (59.1 - latitude) * 41];
}

export type MapId = "canada" | "wales" | "southwest" | "usa-expansion";
export type SceneId =
	| "history-frieze"
	| "holiday-calendar"
	| "condition-scale"
	| "passive-flow"
	| "film-media";

export type MapPlace = WorkshopPiece & { point: readonly [number, number] };

export const MAP_DATA: Record<
	MapId,
	{
		ariaLabel: string;
		caption: string;
		places: readonly MapPlace[];
	}
> = {
	canada: {
		ariaLabel:
			"Skizze von Kanada, Norden oben. Markierung 1 liegt an der Westküste bei Vancouver, Markierung 2 im Südosten bei Ottawa und Toronto, Markierung 3 weit im arktischen Norden bei Nunavut.",
		caption: "Schematische Lernskizze · Norden oben · nicht maßstäblich.",
		places: [
			{
				id: "vancouver",
				label: "Vancouver & Rockies",
				point: [84, 214],
				note: "An der Pazifikküste liegt Vancouver zwischen Meer und Rocky Mountains.",
			},
			{
				id: "ottawa",
				label: "Ottawa & Toronto",
				point: [336, 244],
				note: "Im Südosten liegen die Hauptstadt Ottawa und Toronto am Ontariosee; östlich schließt Québec an.",
			},
			{
				id: "nunavut",
				label: "Nunavut (Inuit North)",
				point: [272, 92],
				note: "Nunavut liegt im arktischen Norden und wurde 1999 als eigenes Territorium mit Selbstverwaltung der Inuit gegründet.",
			},
		],
	},
	wales: {
		ariaLabel:
			"Karte von Großbritannien und Wales, Norden oben. Markierung 1 zeigt Eryri im Nordwesten von Wales, Markierung 2 zeigt Cardiff im Süden von Wales, Markierung 3 zeigt London im Südosten Englands. Kartengrundlage: Natural Earth.",
		caption: "Heutige Grenzen in Großbritannien · Norden oben · Kartengrundlage: Natural Earth.",
		places: [
			{
				id: "eryri",
				label: "Eryri (Snowdonia)",
				point: britainPoint(-3.95, 53.05),
				note: "Eryri (Snowdonia) liegt im gebirgigen Norden von Wales; dort ist Walisisch im Alltag stark vertreten.",
			},
			{
				id: "cardiff",
				label: "Cardiff (Senedd)",
				point: britainPoint(-3.18, 51.48),
				note: "Cardiff im Süden von Wales ist die Hauptstadt und Sitz des walisischen Parlaments (Senedd).",
			},
			{
				id: "london",
				label: "London (Westminster)",
				point: britainPoint(-0.13, 51.51),
				note: "In London tagt das britische Parlament in Westminster mit House of Commons und House of Lords.",
			},
		],
	},
	southwest: {
		ariaLabel:
			"Lernskizze des Desert South-West der USA, Norden oben. Markierung 1 liegt am Grand Canyon im Norden Arizonas, Markierung 2 im Monument Valley an der Grenze zu Utah, Markierung 3 bei Santa Fe in New Mexico.",
		caption: "Schematische Lernskizze · Norden oben · nicht maßstäblich.",
		places: [
			{
				id: "grand-canyon",
				label: "Grand Canyon",
				point: [170, 166],
				note: "Im Norden Arizonas hat der Colorado River über Millionen Jahre die tiefe Schlucht des Grand Canyon gegraben.",
			},
			{
				id: "monument-valley",
				label: "Monument Valley",
				point: [248, 122],
				note: "Monument Valley liegt an der Grenze zwischen Arizona und Utah auf dem Gebiet der Navajo Nation.",
			},
			{
				id: "santa-fe",
				label: "Santa Fe & Pueblos",
				point: [358, 168],
				note: "In New Mexico und Zentralarizona erinnern Städte wie Santa Fe sowie Lehm- und Felsensiedlungen an Pueblo-Kulturen.",
			},
		],
	},
	"usa-expansion": {
		ariaLabel:
			"Lernskizze Nordamerikas von Ost nach West, Norden oben. Markierung 1 zeigt New England (Plymouth und Boston), Markierung 2 zeigt Philadelphia an der Ostküste, Markierung 3 zeigt die Great Plains und den Oregon Trail nach Westen.",
		caption: "Schematische Lernskizze · Norden oben · nicht maßstäblich.",
		places: [
			{
				id: "new-england",
				label: "Plymouth & Boston",
				point: [446, 98],
				note: "1620 landete die Mayflower in New England; 1773 protestierten Kolonisten bei der Boston Tea Party.",
			},
			{
				id: "philadelphia",
				label: "Philadelphia (1776)",
				point: [418, 146],
				note: "In Philadelphia unterzeichnete der Kontinentalkongress am 4. Juli 1776 die Declaration of Independence.",
			},
			{
				id: "west-plains",
				label: "Great Plains & Oregon Trail",
				point: [192, 134],
				note: "Die Besiedlung des Westens entlang von Routen wie dem Oregon Trail verdrängte viele Native Americans und zerstörte Bisons.",
			},
		],
	},
};

export const SCENE_DATA: Record<
	SceneId,
	{
		ariaLabel: string;
		caption: string;
		pieces: readonly WorkshopPiece[];
	}
> = {
	"history-frieze": {
		ariaLabel:
			"Maßstäblicher Zeitstrahl von 1500 bis 1800 mit drei markierten Epochen: 1534 (Henry VIII), 1588 (Elizabeth I) und 1773–1776 (Unabhängigkeit der USA).",
		caption: "Maßstäblicher Zeitstrahl 1500–1800 · Tippe auf eine Epoche.",
		pieces: [
			{
				id: "henry",
				label: "1534 · Henry VIII",
				note: "1534 trennte sich England unter Henry VIII von Rom und gründete die anglikanische Kirche (Act of Supremacy).",
			},
			{
				id: "elizabeth",
				label: "1558–1603 · Elizabeth I",
				note: "Unter Elizabeth I wuchs England zur Seemacht; 1588 besiegte die Flotte die spanische Armada.",
			},
			{
				id: "independence",
				label: "1773–1776 · USA",
				note: "Auf die Boston Tea Party (1773) folgte am 4. Juli 1776 die Unabhängigkeitserklärung.",
			},
		],
	},
	"holiday-calendar": {
		ariaLabel:
			"Maßstäbliche Jahresleiste von Januar bis Dezember mit drei Feiertagen: Independence Day am 4. Juli, kanadischem Thanksgiving und Columbus Day am zweiten Montag im Oktober und US-Thanksgiving am vierten Donnerstag im November.",
		caption: "Maßstäblicher Jahreskalender · Tippe auf ein Festdatum.",
		pieces: [
			{
				id: "july4",
				label: "4. Juli · Independence Day",
				note: "Am 4. Juli feiern die USA die Unabhängigkeitserklärung von 1776.",
			},
			{
				id: "october-day",
				label: "Oktober · CAN & Columbus",
				note: "Am 2. Montag im Oktober feiert Kanada Thanksgiving; in den USA liegt dort Columbus Day oder Indigenous Peoples’ Day.",
			},
			{
				id: "nov-thanksgiving",
				label: "November · US Thanksgiving",
				note: "Am 4. Donnerstag im November feiern Familien in den USA Thanksgiving.",
			},
		],
	},
	"condition-scale": {
		ariaLabel:
			"Vergleichsskala für Bedingungssätze und Wünsche: Typ II (unwahrscheinliche Gegenwart), Typ III (unveränderliche Vergangenheit) und Mischform oder Wunsch.",
		caption: "Skala nach Zeit und Wahrscheinlichkeit · Tippe auf einen Baustein.",
		pieces: [
			{
				id: "type2",
				label: "Type II · Gedachte Gegenwart",
				note: "if + simple past, would + Grundform: unwahrscheinlich oder nur vorgestellt (jetzt/Zukunft).",
			},
			{
				id: "type3",
				label: "Type III · Abgeschlossene Vergangenheit",
				note: "if + past perfect, would have + 3. Verbform: blickt auf eine verpasste Chance zurück.",
			},
			{
				id: "mixed-wish",
				label: "Mixed & Wish · Brücke ins Jetzt",
				note: "Mischform verbindet frühere Bedingung (past perfect) mit Folge heute (would + Grundform); Wünsche nutzen I wish + past/past perfect.",
			},
		],
	},
	"passive-flow": {
		ariaLabel:
			"Satzbau-Flussbild vom Aktiv zum Passiv: Empfänger oder Sache wird Subjekt, das Verb wechselt zu to be plus 3. Form, der Handelnde folgt optional mit by.",
		caption: "Umwandlungsfluss Aktiv → Passiv · Tippe auf einen Satzbaustein.",
		pieces: [
			{
				id: "new-subject",
				label: "Objekt → Passivsubjekt",
				note: "Bei zwei Objekten rückt meistens die Person (Personal Passive) oder die Sache nach vorn ans Satzanfang.",
			},
			{
				id: "be-participle",
				label: "to be (Zeitform) + 3. Form",
				note: "Die Zeitform steckt immer in der Form von to be (is, was, has been, will be); das Vollverb bleibt 3. Form.",
			},
			{
				id: "by-agent",
				label: "by-agent (optional)",
				note: "Der Handelnde folgt nur dann mit by, wenn die Person wichtig ist; oft bleibt er ganz weg.",
			},
		],
	},
	"film-media": {
		ariaLabel:
			"Medien- und Filmrahmen mit drei Bereichen: Handlung und Figuren im Bildfeld, Musik und Tonspur sowie Quellenprüfung.",
		caption: "Film- und Medienanalyse · Tippe auf einen Untersuchungsbereich.",
		pieces: [
			{
				id: "visual-story",
				label: "Figuren, Ort & Handlung",
				note: "Kamerabild, Ort und Mimik zeigen Schauplatz, Konflikt und die Sichtweise der Figuren.",
			},
			{
				id: "sound-music",
				label: "Musik, Ton & Untertitel",
				note: "Tempo, Geräusche und Musik verstärken Spannung oder Stimmung und lenken das Mitgefühl.",
			},
			{
				id: "critical-check",
				label: "Absicht & Quellenprüfung",
				note: "Wer veröffentlicht den Beitrag, welche Belege fehlen und welche Wirkung soll erzielt werden?",
			},
		],
	},
};

export function stageIconSvg(id: string): string {
	const paths: Record<string, string> = {
		talk: '<path d="M4 6h16v10H9l-5 4V6Z"/><path d="M8 10h8M8 13h5"/>',
		tenses: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
		structures: '<rect x="3" y="5" width="7" height="6" rx="1.5"/><rect x="14" y="13" width="7" height="6" rx="1.5"/><path d="M10 8h5v5"/>',
		"north-america": '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/>',
		history: '<path d="M5 19h14M7 16V9m5 7V9m5 7V9M4 9l8-4 8 4H4Z"/>',
		"texts-media": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6M16 14l3 2-3 2v-4Z"/>',
		"language-methods": '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20M8 10.5h5M10.5 8v5"/>',
	};
	return `<svg class="stage-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id] ?? paths.talk}</svg>`;
}

function markerPins(places: readonly MapPlace[]): string {
	return places
		.map(
			({ id, point: [x, y] }, index) =>
				`<g class="svg-hotspot map-pin" data-map-marker="${id}" transform="translate(${x} ${y})" role="button" tabindex="-1" aria-hidden="true"><circle r="13"/><text y="4.5" text-anchor="middle">${index + 1}</text></g>`,
		)
		.join("");
}

export function renderMapSvg(id: MapId): string {
	const data = MAP_DATA[id];
	if (id === "wales") {
		const labels = [
			["Scotland", -4.25, 57.0],
			["England", -1.2, 53.0],
			["Wales", -4.15, 52.1],
			["Ireland", -8.25, 53.4],
		] as const;
		const countries = Object.entries(britainAreas)
			.map(([area, d]) => `<path data-country="${area}" d="${d}"/>`)
			.join("");
		const countryLabels = labels
			.map(([name, lon, lat]) => {
				const [x, y] = britainPoint(lon, lat);
				return `<text class="country-label" lang="en" x="${x}" y="${y}" text-anchor="middle">${name}</text>`;
			})
			.join("");
		return `<svg class="workshop-svg britannia" viewBox="0 0 370 415" role="img" aria-label="${data.ariaLabel}"><text class="compass" x="322" y="34">N ↑</text>${countries}${countryLabels}${markerPins(data.places)}</svg>`;
	}
	if (id === "canada") {
		return `<svg class="workshop-svg geo-map" viewBox="0 0 480 310" role="img" aria-label="${data.ariaLabel}">
			<rect width="480" height="310" rx="14" class="svg-sea"/>
			<text class="compass" x="430" y="30">N ↑</text>
			<path class="svg-land" d="M68 104 L126 98 L168 112 L212 96 L256 128 L272 162 L308 160 L332 128 L374 148 L414 196 L392 224 L376 218 L342 254 L318 274 L288 248 L244 252 L174 244 L106 238 L78 232 L58 176 Z"/>
			<path class="svg-land-alt" d="M210 92 L248 48 L302 42 L338 82 L316 124 L274 126 L256 108 Z M148 64 L194 48 L206 76 L166 86 Z M254 22 L304 16 L316 36 L266 38 Z"/>
			<path class="svg-border" d="M138 110 L122 238 M188 112 L182 244 M234 118 L242 250 M312 160 L316 266"/>
			<path class="svg-river" d="M322 258 C346 244 374 222 406 200"/>
			<text class="svg-region-label" x="14" y="182">Pacific</text>
			<text class="svg-region-label" x="414" y="138">Atlantic</text>
			<text class="svg-region-label" x="280" y="152">Hudson Bay</text>
			<text class="svg-region-label" x="148" y="182">Prairies</text>
			<text class="svg-region-label" x="366" y="206">Québec</text>
			${markerPins(data.places)}
		</svg>`;
	}
	if (id === "southwest") {
		return `<svg class="workshop-svg geo-map" viewBox="0 0 480 300" role="img" aria-label="${data.ariaLabel}">
			<rect width="480" height="300" rx="14" class="svg-desert-bg"/>
			<text class="compass" x="430" y="30">N ↑</text>
			<path class="svg-land" d="M74 44 L184 44 L184 134 L122 192 L74 138 Z"/>
			<path class="svg-land-alt" d="M184 44 L294 44 L294 140 L184 140 Z"/>
			<path class="svg-land" d="M142 140 L256 140 L256 262 L134 242 L122 192 Z"/>
			<path class="svg-land-alt" d="M256 140 L394 140 L394 264 L256 264 Z"/>
			<path class="svg-river" d="M268 48 C250 96 226 132 184 162 C154 176 138 206 126 246"/>
			<text class="svg-region-label" x="128" y="88">Nevada</text>
			<text class="svg-region-label" x="238" y="88">Utah</text>
			<text class="svg-region-label" x="192" y="228">Arizona</text>
			<text class="svg-region-label" x="326" y="228">New Mexico</text>
			<text class="svg-river-label" x="154" y="198">Colorado River</text>
			${markerPins(data.places)}
		</svg>`;
	}
	return `<svg class="workshop-svg geo-map" viewBox="0 0 520 300" role="img" aria-label="${data.ariaLabel}">
		<rect width="520" height="300" rx="14" class="svg-sea"/>
		<text class="compass" x="470" y="30">N ↑</text>
		<path class="svg-land" d="M54 58 L466 58 L472 104 L434 148 L410 218 L398 258 L350 228 L294 232 L248 264 L194 218 L92 214 L52 152 Z"/>
		<path class="svg-land-alt" d="M416 68 L464 68 L458 118 L420 118 Z"/>
		<path class="svg-trail" d="M326 148 C264 134 196 124 88 94"/>
		<path class="svg-route" d="M510 74 C488 78 474 88 456 96"/>
		<text class="svg-region-label" x="150" y="182">Great Plains &amp; West</text>
		<text class="svg-region-label" x="444" y="184">Atlantic</text>
		<text class="svg-river-label" x="498" y="64" text-anchor="end">Mayflower 1620</text>
		<text class="svg-river-label" x="176" y="106" text-anchor="middle">Westward Trails</text>
		${markerPins(data.places)}
	</svg>`;
}

export function renderSceneSvg(id: SceneId): string {
	const data = SCENE_DATA[id];
	if (id === "history-frieze") {
		const yearX = (year: number) => Math.round((44 + ((year - 1500) / 300) * 432) * 10) / 10;
		const points = [
			{ id: "henry", x: yearX(1534), label: "1534", sub: "Henry VIII", y: 66 },
			{ id: "elizabeth", x: yearX(1588), label: "1588", sub: "Elizabeth I", y: 122 },
			{ id: "independence", x: yearX(1776), label: "1776", sub: "USA 1773–76", y: 66 },
		];
		return `<svg class="workshop-svg scene-svg" viewBox="0 0 520 170" role="img" aria-label="${data.ariaLabel}">
			<line x1="36" y1="96" x2="488" y2="96" class="svg-axis"/>
			<text class="svg-axis-label" x="44" y="156">1500</text>
			<text class="svg-axis-label" x="${yearX(1600)}" y="156" text-anchor="middle">1600</text>
			<text class="svg-axis-label" x="${yearX(1700)}" y="156" text-anchor="middle">1700</text>
			<text class="svg-axis-label" x="476" y="156" text-anchor="end">1800</text>
			${points
				.map(
					(p) => `<g class="svg-hotspot" data-map-marker="${p.id}">
						<line x1="${p.x}" y1="96" x2="${p.x}" y2="${p.y}" class="svg-connector"/>
						<circle cx="${p.x}" cy="96" r="5" class="svg-dot"/>
						<rect x="${p.x - 52}" y="${p.y - 24}" width="104" height="36" rx="8" class="svg-card"/>
						<text x="${p.x}" y="${p.y - 8}" text-anchor="middle" class="svg-card-title">${p.label}</text>
						<text x="${p.x}" y="${p.y + 6}" text-anchor="middle" class="svg-card-sub">${p.sub}</text>
					</g>`,
				)
				.join("")}
		</svg>`;
	}
	if (id === "holiday-calendar") {
		const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
		const calX = (month: number, day: number) => Math.round((32 + month * 38 + ((day - 0.5) / 31) * 38) * 10) / 10;
		const marks = [
			{ id: "july4", x: calX(6, 4), label: "4. Juli", sub: "US Indep.", boxX: calX(6, 4) - 48, y: 42 },
			{ id: "october-day", x: calX(9, 12), label: "2. Mo Okt", sub: "CAN / Col.", boxX: calX(9, 12) - 52, y: 42 },
			{ id: "nov-thanksgiving", x: calX(10, 26), label: "4. Do Nov", sub: "US Thanksg.", boxX: calX(10, 26) - 46, y: 122 },
		];
		return `<svg class="workshop-svg scene-svg" viewBox="0 0 520 175" role="img" aria-label="${data.ariaLabel}">
			${months
				.map(
					(m, i) =>
						`<rect x="${32 + i * 38}" y="78" width="37" height="24" rx="4" class="svg-month"/><text x="${50.5 + i * 38}" y="94" text-anchor="middle" class="svg-month-label">${m}</text>`,
				)
				.join("")}
			${marks
				.map(
					(m) => `<g class="svg-hotspot" data-map-marker="${m.id}">
						<line x1="${m.x}" y1="78" x2="${m.x}" y2="${m.y < 78 ? m.y + 18 : m.y - 16}" class="svg-connector"/>
						<circle cx="${m.x}" cy="${m.y < 78 ? 78 : 102}" r="4.5" class="svg-dot"/>
						<rect x="${m.boxX}" y="${m.y - 18}" width="96" height="36" rx="8" class="svg-card"/>
						<text x="${m.boxX + 48}" y="${m.y - 2}" text-anchor="middle" class="svg-card-title">${m.label}</text>
						<text x="${m.boxX + 48}" y="${m.y + 12}" text-anchor="middle" class="svg-card-sub">${m.sub}</text>
					</g>`,
				)
				.join("")}
		</svg>`;
	}
	if (id === "condition-scale") {
		const cards = [
			{ id: "type2", x: 24, title: "Type II", line1: "if + simple past", line2: "→ would + inf." },
			{ id: "type3", x: 184, title: "Type III", line1: "if + past perfect", line2: "→ would have + 3. F." },
			{ id: "mixed-wish", x: 344, title: "Mixed & Wish", line1: "past cond. → now", line2: "I wish + past / p.p." },
		];
		return `<svg class="workshop-svg scene-svg" viewBox="0 0 520 155" role="img" aria-label="${data.ariaLabel}">
			<line x1="28" y1="26" x2="492" y2="26" class="svg-axis"/>
			<text x="28" y="18" class="svg-axis-label">Gedacht / Gegenwart</text>
			<text x="492" y="18" text-anchor="end" class="svg-axis-label">Unveränderte Vergangenheit</text>
			${cards
				.map(
					(c) => `<g class="svg-hotspot" data-map-marker="${c.id}">
						<rect x="${c.x}" y="42" width="152" height="96" rx="10" class="svg-card"/>
						<text x="${c.x + 76}" y="68" text-anchor="middle" class="svg-card-title">${c.title}</text>
						<text x="${c.x + 76}" y="92" text-anchor="middle" class="svg-card-sub">${c.line1}</text>
						<text x="${c.x + 76}" y="114" text-anchor="middle" class="svg-card-sub">${c.line2}</text>
					</g>`,
				)
				.join("")}
		</svg>`;
	}
	if (id === "passive-flow") {
		const blocks = [
			{ id: "new-subject", x: 20, title: "1 · Subjekt neu", sub: "Person oder Sache" },
			{ id: "be-participle", x: 184, title: "2 · Verbform", sub: "to be + 3. Form" },
			{ id: "by-agent", x: 348, title: "3 · Täter (optional)", sub: "by + Handelnde" },
		];
		return `<svg class="workshop-svg scene-svg" viewBox="0 0 520 140" role="img" aria-label="${data.ariaLabel}">
			<path d="M168 72 H182 M332 72 H346" class="svg-flow-arrow"/>
			${blocks
				.map(
					(b) => `<g class="svg-hotspot" data-map-marker="${b.id}">
						<rect x="${b.x}" y="28" width="148" height="86" rx="10" class="svg-card"/>
						<text x="${b.x + 74}" y="62" text-anchor="middle" class="svg-card-title">${b.title}</text>
						<text x="${b.x + 74}" y="86" text-anchor="middle" class="svg-card-sub">${b.sub}</text>
					</g>`,
				)
				.join("")}
		</svg>`;
	}
	return `<svg class="workshop-svg scene-svg" viewBox="0 0 520 155" role="img" aria-label="${data.ariaLabel}">
		<rect x="20" y="16" width="480" height="122" rx="12" class="svg-frame"/>
		<g class="svg-hotspot" data-map-marker="visual-story">
			<rect x="34" y="30" width="144" height="94" rx="8" class="svg-card"/>
			<text x="106" y="66" text-anchor="middle" class="svg-card-title">Bild &amp; Figuren</text>
			<text x="106" y="90" text-anchor="middle" class="svg-card-sub">Schauplatz &amp; Handlung</text>
		</g>
		<g class="svg-hotspot" data-map-marker="sound-music">
			<rect x="190" y="30" width="140" height="94" rx="8" class="svg-card"/>
			<text x="260" y="66" text-anchor="middle" class="svg-card-title">Musik &amp; Ton</text>
			<text x="260" y="90" text-anchor="middle" class="svg-card-sub">Stimmung &amp; Untertitel</text>
		</g>
		<g class="svg-hotspot" data-map-marker="critical-check">
			<rect x="342" y="30" width="144" height="94" rx="8" class="svg-card"/>
			<text x="414" y="66" text-anchor="middle" class="svg-card-title">Quellenblick</text>
			<text x="414" y="90" text-anchor="middle" class="svg-card-sub">Absicht &amp; Belege</text>
		</g>
	</svg>`;
}
