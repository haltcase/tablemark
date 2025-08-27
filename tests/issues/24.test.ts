// https://github.com/haltcase/issues/24

import { expect, test } from "vitest";

import { tablemark } from "../../src/index.js";
import { snapshotFile } from "../helpers.js";

test("wraps empty cells as expected with `textHandlingStrategy: 'basic'`", async () => {
	const data = [
		{
			name: "Bob",
			age: 25,
			city: undefined
		}
	];

	await expect(
		tablemark(data, {
			textHandlingStrategy: "basic"
		})
	).toMatchFileSnapshot(snapshotFile("issues/24-empty-cells"));
});
