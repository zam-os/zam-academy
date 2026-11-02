const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** ULID encoding using the browser's cryptographic random source. */
export function ulid(now = Date.now()): string {
	if (!Number.isSafeInteger(now) || now < 0 || now > 281474976710655)
		throw new Error("Ungültiger Zeitpunkt.");
	let time = BigInt(now);
	let prefix = "";
	for (let i = 0; i < 10; i++) {
		prefix = ALPHABET[Number(time & 31n)] + prefix;
		time >>= 5n;
	}
	const bytes = crypto.getRandomValues(new Uint8Array(10));
	let random = 0n;
	for (const byte of bytes) random = (random << 8n) | BigInt(byte);
	let suffix = "";
	for (let i = 0; i < 16; i++) {
		suffix = ALPHABET[Number(random & 31n)] + suffix;
		random >>= 5n;
	}
	return prefix + suffix;
}
