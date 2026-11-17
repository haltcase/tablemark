// https://github.com/haltcase/tablemark/issues/57

import { expect, test } from "vitest";

import { tablemark } from "../../src/index.js";
import { snapshotFile } from "../helpers.js";

test("wraps emoji without splitting surrogate pairs in auto mode", async () => {
	const data = [{ a: "😀😀😀😀😀😀" }];

	await expect(tablemark(data, { maxWidth: 5 })).toMatchFileSnapshot(
		snapshotFile("issues/57-wrapping-surrogate-pairs")
	);
});
