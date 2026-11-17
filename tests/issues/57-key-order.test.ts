// https://github.com/haltcase/tablemark/issues/57

import { expect, test } from "vitest";

import { tablemark } from "../../src/index.js";
import { snapshotFile } from "../helpers.js";

test("renders reordered record keys under the matching headers", async () => {
	const data = [
		{ a: 1, b: 2 },
		{ b: 3, a: 4 }
	];

	await expect(tablemark(data)).toMatchFileSnapshot(
		snapshotFile("issues/57-key-order")
	);
});

test("keeps missing cells and column overrides in header order", async () => {
	const data = [
		{ a: 1, b: 2 },
		{ b: 333, a: 4 },
		{ b: 5, extra: 6 }
	];

	await expect(
		tablemark(data, { columns: [{ width: 3 }, { width: 4, align: "right" }] })
	).toMatchFileSnapshot(snapshotFile("issues/57-key-order-column-overrides"));
	expect(() => tablemark(data, { unknownKeyStrategy: "throw" })).toThrow(
		"Unexpected object key 'extra' at record index 2"
	);
});
