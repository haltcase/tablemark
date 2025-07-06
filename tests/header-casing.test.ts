import * as changeCase from "change-case";
import { describe, expect, test } from "vitest";

import type { HeaderCase } from "../src/index.js";
import { tablemark } from "../src/index.js";

describe("header casing", () => {
	for (const [key, method] of Object.entries(changeCase)) {
		if (!key.endsWith("Case")) {
			continue;
		}

		const testKey = "someSort of String";
		const testObject: Record<string, string> = {
			[testKey]: "value"
		};

		const expected = `| ${String(method(testKey))} |`;

		const actual = tablemark([testObject], {
			headerCase: key as HeaderCase
		}).split("\n")[0];

		test(`applies \`headerCase: ${key}\` to column titles`, () => {
			expect(actual).toBe(expected);
		});
	}
});
