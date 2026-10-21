#!/usr/bin/env node
// The IT successor is two independent tiles, so this checks both installation
// orders and learners who hold only part of the predecessor. Only disposable
// libraries are opened; approval is a separate publication safeguard.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const legacyFile =
	"tests/fixtures/de-by-realschule-9-informatik-algorithmen-strukturen-kvt.json";
const legacyHash =
	"7eb4b02d35be4d8561e41ec4057f41813f9b0ba3ff212dcd789de0d0820e2805";
const legacyBytes = readFileSync(join(root, legacyFile));
assert.equal(
	createHash("sha256").update(legacyBytes).digest("hex"),
	legacyHash,
	"the frozen eight-card predecessor must not drift",
);
const legacy = JSON.parse(legacyBytes.toString("utf8"));
const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items);
assert.equal(oldItems.length, 8);
const oldById = new Map(oldItems.map((item) => [item.id, item]));

const packages = ["algorithmen", "datennetze"].map((app) => {
	const directory = join(root, app);
	const cell = JSON.parse(readFileSync(join(directory, "cell.json"), "utf8"));
	const mapping = JSON.parse(
		readFileSync(join(directory, "replaces-de-by.json"), "utf8"),
	);
	assert.equal(cell.tile_id, `zam-academy:${app}`);
	const source = mapping.sources.find(
		(entry) => entry.tile_id === legacy.tile_id,
	);
	assert.ok(source, `${app}: the mapping pins the predecessor snapshot`);
	assert.equal(source.sha256, legacyHash);
	assert.equal(resolve(directory, source.file), join(root, legacyFile));
	const items = cell.atoms.flatMap((atom) => atom.practice_items);
	return {
		app,
		cell,
		mapping,
		items,
		bySlug: new Map(items.map((item) => [item.slug, item])),
		topicKey: `https://academy.zam-os.org/${app}/`,
	};
});
const rows = packages.flatMap((entry) =>
	entry.mapping.rows.map((row) => ({ ...row, owner: entry })),
);
assert.equal(rows.length, 8, "one explicit disposition per old card");
assert.equal(new Set(rows.map((row) => row.de_by_id)).size, 8);
assert.deepEqual(
	[...rows.map((row) => row.de_by_id)].sort(),
	[...oldById.keys()].sort(),
);
const targetIds = new Set();
const expectedReplacements = new Map();
for (const row of rows) {
	const old = oldById.get(row.de_by_id);
	assert.equal(row.de_by_cell, legacy.tile_id);
	assert.equal(
		row.de_by_question,
		old.question,
		"mapping quotes the old question",
	);
	assert.ok(["A", "B", "C"].includes(row.category));
	assert.ok(row.note?.trim(), "each transfer or retirement has a reason");
	if (row.category === "C") continue;
	const target = row.owner.bySlug.get(row.academy_slug);
	assert.ok(target, `${row.de_by_id}: mapped successor must exist`);
	assert.ok(
		!targetIds.has(target.id),
		"two histories must never share a successor",
	);
	targetIds.add(target.id);
	expectedReplacements.set(row.de_by_id, target.id);
}

const allNewIds = packages.flatMap((entry) =>
	entry.items.map((item) => item.id),
);
assert.equal(
	new Set(allNewIds).size,
	allNewIds.length,
	"successor ids do not collide",
);
for (const entry of packages) {
	const declarations = entry.items.flatMap((item) =>
		(item.replaces ?? []).map((oldId) => [oldId, item.id]),
	);
	const wanted = rows
		.filter((row) => row.owner === entry && row.category !== "C")
		.map((row) => [row.de_by_id, expectedReplacements.get(row.de_by_id)]);
	const sortPairs = (pairs) => pairs.sort((a, b) => a[0].localeCompare(b[0]));
	assert.deepEqual(
		sortPairs(declarations),
		sortPairs(wanted),
		`${entry.app}: replaces declares exactly the mapping proposal`,
	);
	const retirements = entry.cell.retired_items ?? [];
	assert.deepEqual(
		retirements.map((item) => item.id).sort(),
		rows
			.filter((row) => row.owner === entry && row.category === "C")
			.map((row) => row.de_by_id)
			.sort(),
		`${entry.app}: corrected or split retrievals have retirement, never replaces`,
	);
	for (const retirement of retirements)
		assert.ok(retirement.reason?.trim(), "retirement explains the correction");
}

const dir = mkdtempSync(join(tmpdir(), "zam-it-migration-"));
const userId = legacy.atoms[0].id;
const withoutToken = ({ token_id, ...rest }) => rest;
const oldIdSet = new Set(oldItems.map((item) => item.id));

async function reviewedCard(db, tokenId, index) {
	const card = await zam.ensureCard(db, tokenId, userId);
	const now = new Date("2026-10-01T12:00:00.000Z");
	await zam.evaluateRating(db, {
		cardId: card.id,
		tokenId,
		userId,
		rating: index % 3 === 0 ? 1 : 3,
		answerFormat: "recall",
		responseTimeMs: 1000 + index * 300,
		now,
	});
	await zam.evaluateRating(db, {
		cardId: card.id,
		tokenId,
		userId,
		rating: index % 2 === 0 ? 3 : 4,
		answerFormat: "recall",
		responseTimeMs: 1600 + index * 200,
		now: new Date(now.getTime() + (index + 1) * 86_400_000),
	});
}

async function snapshot(db) {
	return {
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	};
}

function assertHistory(before, after, expected) {
	assert.equal(
		after.cards.length,
		before.cards.length,
		"installation enrols no cards",
	);
	assert.equal(
		after.reviews.length,
		before.reviews.length,
		"no review is lost or invented",
	);
	for (const collection of ["cards", "reviews"]) {
		for (const old of before[collection]) {
			const fresh = after[collection].find((item) => item.id === old.id);
			assert.ok(fresh, `${collection}: evidence id ${old.id} survives`);
			assert.deepEqual(
				withoutToken(fresh),
				withoutToken(old),
				`${collection}: state/evidence unchanged for ${old.token_id}`,
			);
			assert.equal(fresh.token_id, expected.get(old.token_id) ?? old.token_id);
		}
	}
}

async function assertTopics(db, expectedHeld) {
	const topics = await zam.listLibraryTopics(db, userId);
	assert.equal(
		topics.length,
		2,
		"the split creates exactly two library topics",
	);
	for (const entry of packages) {
		const topic = topics.find((item) => item.key === entry.topicKey);
		assert.ok(topic, `${entry.app}: lesson fragments share one app topic`);
		assert.equal(topic.itemCount, entry.items.length);
		assert.equal(topic.heldCount, expectedHeld.get(entry.app) ?? 0);
	}
}

async function checkHistoryCase(order, subset, caseName) {
	const db = await zam.openDatabase({
		dbPath: join(
			dir,
			`${order.map((entry) => entry.app).join("-")}-${caseName}.db`,
		),
		initialize: true,
		useConfiguredCloud: false,
	});
	try {
		await zam.installKvtTile(db, legacy);
		for (const [index, row] of subset.entries())
			await reviewedCard(db, row.de_by_id, index);
		const before = await snapshot(db);
		assert.equal(before.cards.length, subset.length);
		assert.equal(before.reviews.length, subset.length * 2);
		const oldQueue = await zam.buildReviewQueue(db, {
			userId,
			tokenIds: [...oldIdSet],
			now: new Date("2030-01-01T12:00:00.000Z"),
			buryNewSiblings: false,
			buryReviewSiblings: false,
		});
		assert.equal(
			oldQueue.items.length,
			subset.length,
			"the held old questions were active before the migration",
		);
		const installedRows = [];
		for (const entry of order) {
			await zam.installKvtTile(db, entry.cell);
			installedRows.push(...rows.filter((row) => row.owner === entry));
			const expected = new Map(
				installedRows
					.filter((row) => row.category !== "C")
					.map((row) => [row.de_by_id, expectedReplacements.get(row.de_by_id)]),
			);
			assertHistory(before, await snapshot(db), expected);
			for (const row of rows) {
				const oldToken = await zam.getTokenById(db, row.de_by_id);
				assert.ok(oldToken, "old tokens are never deleted");
				assert.equal(
					Boolean(oldToken.deprecated_at),
					installedRows.includes(row),
					"one successor must not retire the other successor's old content",
				);
				if (installedRows.includes(row) && row.category === "C")
					assert.equal(oldToken.editorial_state, "deprecated");
			}
		}
		const after = await snapshot(db);
		const held = new Map(
			packages.map((entry) => [
				entry.app,
				subset.filter((row) => row.owner === entry && row.category !== "C")
					.length,
			]),
		);
		await assertTopics(db, held);
		const queue = await zam.buildReviewQueue(db, {
			userId,
			tokenIds: [...oldIdSet],
			now: new Date("2030-01-01T12:00:00.000Z"),
			buryNewSiblings: false,
			buryReviewSiblings: false,
		});
		assert.equal(
			queue.items.length,
			0,
			"no replaced or retired item remains in active review",
		);
		for (const entry of order) await zam.installKvtTile(db, entry.cell);
		assert.deepEqual(
			await snapshot(db),
			after,
			"repeat installation is idempotent",
		);

		// Explicit enrolment is separate from installing the migration. Starting
		// just one topic cannot take up the other package for the learner.
		for (const entry of order) {
			const result = await zam.startLibraryTopic(db, userId, entry.topicKey);
			assert.equal(result.created, entry.items.length - held.get(entry.app));
			assert.equal(result.alreadyHeld, held.get(entry.app));
			held.set(entry.app, entry.items.length);
			await assertTopics(db, held);
			const complete = await snapshot(db);
			assert.deepEqual(
				complete.reviews,
				after.reviews,
				"enrolment invents no evidence",
			);
			for (const old of after.cards)
				assert.deepEqual(
					complete.cards.find((item) => item.id === old.id),
					old,
				);
			const originalIds = new Set(after.cards.map((item) => item.id));
			for (const fresh of complete.cards.filter(
				(item) => !originalIds.has(item.id),
			)) {
				assert.equal(fresh.state, "new");
				assert.equal(fresh.stability, 0);
				assert.equal(fresh.reps, 0);
				assert.equal(fresh.last_review_at, null);
			}
			const repeated = await zam.startLibraryTopic(db, userId, entry.topicKey);
			assert.equal(repeated.created, 0);
			assert.deepEqual(
				await snapshot(db),
				complete,
				"repeat enrolment changes nothing",
			);
		}
		console.log(
			`ok   IT ${order.map((entry) => entry.app).join(" then ")} / ${caseName}: ${subset.length} card histories and ${subset.length * 2} reviews preserved; two independent topics, fresh cards unlearned, repeat install/enrolment unchanged`,
		);
	} finally {
		await db.close();
	}
}

async function checkCollision(row) {
	const db = await zam.openDatabase({
		dbPath: join(dir, `collision-${row.de_by_id}.db`),
		initialize: true,
		useConfiguredCloud: false,
	});
	try {
		// A learner may already hold a successor from the Academy and later
		// restore a library containing the predecessor. This requires a decision.
		for (const entry of packages) await zam.installKvtTile(db, entry.cell);
		await zam.installKvtTile(db, legacy);
		await reviewedCard(db, row.de_by_id, 1);
		await reviewedCard(db, expectedReplacements.get(row.de_by_id), 2);
		const before = await snapshot(db);
		await assert.rejects(
			() =>
				zam.installKvtTile(db, {
					...row.owner.cell,
					version: `${row.owner.cell.version}.1`,
				}),
			/holds a card on both|merge/i,
		);
		assert.deepEqual(
			await snapshot(db),
			before,
			"a collision preserves both complete histories",
		);
	} finally {
		await db.close();
	}
}

try {
	for (const order of [packages, [...packages].reverse()]) {
		await checkHistoryCase(order, rows, "all-eight");
		for (const entry of packages)
			await checkHistoryCase(
				order,
				rows.filter((row) => row.owner === entry),
				`only-${entry.app}`,
			);
		await checkHistoryCase(order, [], "tokens-without-cards");
	}
	for (const row of rows.filter((entry) => entry.category !== "C"))
		await checkCollision(row);
	console.log(
		`ok   IT: every one of ${expectedReplacements.size} replacement collisions refuses an automatic merge; all eight predecessor items have one explicit disposition`,
	);
} finally {
	rmSync(dir, { recursive: true, force: true });
}
