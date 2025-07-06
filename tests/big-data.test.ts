import { describe, expect, test } from "vitest";

import { tablemark } from "../src/index.js";
import data5mb from "./fixtures/5MB.json" with { type: "json" };

describe("big data", () => {
	test("5MB.json", () =>
		expect(tablemark(data5mb as Record<string, unknown>[])).toMatchFileSnapshot(
			"./__snapshots__/5MB.json.md"
		));

	test("5MB.json when `textHandlingStrategy` is `basic`", () =>
		expect(
			tablemark(data5mb as Record<string, unknown>[], {
				textHandlingStrategy: "basic"
			})
		).toMatchFileSnapshot("./__snapshots__/5MB.json-basic.md"));
});
