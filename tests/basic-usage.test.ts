import { describe, expect, test } from "vitest";

import { tablemark } from "../src/index.js";
import { snapshotFile } from "./helpers.js";

describe("basic usage", () => {
	test("outputs the expected markdown", async () => {
		const data = [
			{
				name: "trilogy",
				repo: "[haltcase/trilogy](https://github.com/haltcase/trilogy)",
				desc: "No-hassle SQLite with type-casting schema models and support for native & pure JS backends."
			},
			{
				name: "strat",
				repo: "[haltcase/strat](https://github.com/haltcase/strat)",
				desc: "Functional-ish JavaScript string formatting, with inspirations from Python."
			},
			{
				name: "tablemark",
				repo: "[haltcase/tablemark](https://github.com/haltcase/tablemark)",
				desc: "Generate markdown tables from JSON data."
			}
		];

		await expect(tablemark(data)).toMatchFileSnapshot(
			snapshotFile("basic-usage-expected-markdown")
		);
	});

	test("returns an empty string for empty input", async () => {
		const data: Record<string, unknown>[] = [];

		await expect(tablemark(data)).toMatchFileSnapshot(
			snapshotFile("empty-input")
		);
	});

	test("nested objects", async () => {
		const data = [
			{
				name: "Alice",
				details: { age: 30, hobbies: ["reading", "hiking"] }
			},
			{
				name: "Bob",
				details: { age: 25, hobbies: ["gaming", "cooking"] }
			}
		];

		await expect(tablemark(data)).toMatchFileSnapshot(
			snapshotFile("nested-objects")
		);
	});

	test('applies `headerCase: "preserve"` to column titles', async () => {
		const data = [
			{ name: "Bob", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				headerCase: "preserve"
			})
		).toMatchFileSnapshot(snapshotFile("headerCase-preserve"));
	});

	test("applies custom `toCellText` to cell values", async () => {
		const data = [
			{ name: "Bob", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				toCellText: ({ key, value }) => {
					if (key === "age") {
						return "shhh...";
					}

					if (key === "isCool") {
						return value ? "Yes" : "No";
					}

					return String(value);
				}
			})
		).toMatchFileSnapshot(snapshotFile("toCellText-custom"));
	});

	test("applies custom `toHeaderTitle` to cell values", async () => {
		const data = [
			{ name: "Bob", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				toHeaderTitle: ({ key, title }) => {
					if (key === "name") {
						return title;
					}

					if (key === "age") {
						return "Years";
					}

					return title.toUpperCase();
				}
			})
		).toMatchFileSnapshot(snapshotFile("toHeaderTitle-custom"));
	});

	test("wraps text to the given `maxWidth` (hard or soft) when `overflowStrategy: 'wrap'`", async () => {
		const data = [
			{ name: "Benjamin", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				overflowStrategy: "wrap",
				maxWidth: 5
			})
		).toMatchFileSnapshot(snapshotFile("wrap-maxWidth-5"));
	});

	test("wrap: handles newlines in a cell by adding rows as needed when `overflowStrategy: 'wrap'`", async () => {
		const data = [
			{ name: "Benjamin\nor Ben", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				overflowStrategy: "wrap"
			})
		).toMatchFileSnapshot(snapshotFile("wrap-newlines-in-cell"));
	});

	test("wraps cells with newlines properly when `overflowStrategy: 'wrap'`", async () => {
		const data = [
			{ name: "Benjamin or\nBen", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				overflowStrategy: "wrap",
				maxWidth: 8
			})
		).toMatchFileSnapshot(snapshotFile("wrap-newlines-maxWidth-8"));
	});

	test("includes gutters on wrapped rows when `wrapWithGutters: true` and `overflowStrategy: 'wrap'`", async () => {
		const data = [
			{ name: "Benjamin", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				maxWidth: 5,
				overflowStrategy: "wrap",
				wrapWithGutters: true
			})
		).toMatchFileSnapshot(snapshotFile("wrapWithGutters-true"));
	});

	test("adds truncation character when `overflowStrategy: 'truncateEnd'`", async () => {
		const data = [
			{ name: "Benjamin", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				maxWidth: 5,
				overflowStrategy: "truncateEnd"
			})
		).toMatchFileSnapshot(snapshotFile("overflowStrategy-truncateEnd"));
	});

	test("adds truncation character to header cell when `overflowHeaderStrategy: 'truncateEnd'`", async () => {
		const data = [
			{ name: "Benjamin", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				maxWidth: 5,
				overflowStrategy: "truncateEnd",
				overflowHeaderStrategy: "truncateEnd"
			})
		).toMatchFileSnapshot(snapshotFile("overflowHeaderStrategy-truncateEnd"));
	});

	test("elides padding in header separator row when `padHeaderSeparator: false`", async () => {
		const data = [
			{ name: "Bob", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				columns: [{ align: "left" }, { align: "right" }, { align: "center" }],
				padHeaderSeparator: false
			})
		).toMatchFileSnapshot(snapshotFile("padHeaderSeparator-false"));
	});

	test("preserves single and multiple line breaks in cell content when `lineBreakStrategy: 'preserve'`", async () => {
		const data = [
			{ name: "Alice\nBob", note: "Line1\n\nLine2" },
			{ name: "\nLeading", note: "Trailing\n" },
			{ name: "NoBreak", note: "NoBreak" }
		];

		await expect(
			tablemark(data, {
				lineBreakStrategy: "preserve"
			})
		).toMatchFileSnapshot(snapshotFile("lineBreakStrategy-preserve"));
	});

	test("replace line breaks in cell content with spaces when `lineBreakStrategy: 'strip'`", async () => {
		const data = [
			{ name: "Bob\nTables", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				lineBreakStrategy: "strip"
			})
		).toMatchFileSnapshot(snapshotFile("lineBreakStrategy-strip"));
	});

	test("trims cell content at first line break when `lineBreakStrategy: 'truncate'`", async () => {
		const data = [
			{ name: "Bob\nTables", age: 21, isCool: false },
			{ name: "Sarah", age: 22, isCool: true },
			{ name: "Lee", age: 23, isCool: true }
		];

		await expect(
			tablemark(data, {
				lineBreakStrategy: "truncate"
			})
		).toMatchFileSnapshot(snapshotFile("lineBreakStrategy-truncate"));
	});

	test("escapes pipe characters in cells by default", async () => {
		const data = [{ content: "yes | no" }];

		await expect(tablemark(data)).toMatchFileSnapshot(
			snapshotFile("pipe-escaping-default")
		);
	});

	test("pads cells with ANSI styles properly when `textHandlingStrategy: 'advanced'`", async () => {
		const data = [
			{
				"\u001B[4mFancy column title\u001B[0m": "\u001B[4mfancy value\u001B[0m"
			}
		];

		await expect(
			tablemark(data, {
				textHandlingStrategy: "advanced"
			})
		).toMatchFileSnapshot(
			snapshotFile("ansi-styles-padding-textHandlingStrategy-advanced")
		);
	});

	test("custom `toCellText` passes through ANSI styles when `textHandlingStrategy: 'advanced'`", async () => {
		const data = [{ regularTitle: "fancy value" }];

		await expect(
			tablemark(data, {
				textHandlingStrategy: "advanced",
				toCellText: ({ value }) => `\u001B[4m${String(value)}\u001B[0m`
			})
		).toMatchFileSnapshot(
			snapshotFile("toCellText-ansi-styles-textHandlingStrategy-advanced")
		);
	});

	test("custom `toHeaderTitle` passes through ANSI styles when `textHandlingStrategy: 'advanced'`", async () => {
		const data = [{ fancyTitle: "regular value" }];

		await expect(
			tablemark(data, {
				textHandlingStrategy: "advanced",
				toHeaderTitle: ({ title }) => `\u001B[4m${title}\u001B[0m`
			})
		).toMatchFileSnapshot(
			snapshotFile(
				"toHeaderTitle-custom-ansi-styles-textHandlingStrategy-advanced"
			)
		);
	});

	test("handles combining marks and zero-width characters", async () => {
		const data = [
			{ word: "e\u0301clair", note: "a\u0308bc" }, // éclair, äbc
			{ word: "cafe\u0301", note: "noe\u0308l" } // café, noël
		];

		await expect(tablemark(data)).toMatchFileSnapshot(
			snapshotFile("combining-marks")
		);
	});

	test("handles columns with custom toCellText and toHeaderTitle", async () => {
		const data = [
			{ foo: 1, bar: 2 },
			{ foo: 3, bar: 4 }
		];

		await expect(
			tablemark(data, {
				toCellText: ({ key, value }) =>
					key === "foo" ? `#${String(value)}` : String(value),
				toHeaderTitle: ({ key, title }) => (key === "foo" ? "FOO!" : title)
			})
		).toMatchFileSnapshot(
			snapshotFile("column-custom-toCellText-toHeaderTitle")
		);
	});

	test("handles columns with missing/undefined values", async () => {
		const data = [{ foo: 1 }, { bar: 2 }, { foo: 3, bar: 4 }];

		await expect(tablemark(data)).toMatchFileSnapshot(
			snapshotFile("column-missing-values")
		);
	});

	test("allows missing keys when `unknownKeyStrategies: 'ignore'`", async () => {
		const data = [
			{ foo: 1, bar: 2 },
			{ foo: 3, baz: 4 }
		];

		await expect(
			tablemark(data, {
				columns: [{ name: "foo" }, { name: "bar" }],
				unknownKeyStrategy: "ignore"
			})
		).toMatchFileSnapshot(snapshotFile("unknownKeyStrategy-ignore"));
	});

	test("combines headerCase and custom toHeaderTitle", async () => {
		const data = [{ fooBar: 1, bazQux: 2 }];

		await expect(
			tablemark(data, {
				headerCase: "pathCase",
				toHeaderTitle: ({ key, title }) =>
					key.toUpperCase() + title.toLowerCase()
			})
		).toMatchFileSnapshot(snapshotFile("headerCase-toHeaderTitle-combo"));
	});

	test("combines maxWidth, overflowStrategy, and lineBreakStrategy", async () => {
		const data = [
			{ text: "A very long line\nwith a break" },
			{ text: "Short" }
		];

		await expect(
			tablemark(data, {
				maxWidth: 10,
				overflowStrategy: "wrap",
				lineBreakStrategy: "strip"
			})
		).toMatchFileSnapshot(snapshotFile("combo-maxWidth-overflow-lineBreak"));
	});

	test("counts width of ANSI escape codes when `countAnsiEscapeCodes: false`", async () => {
		const data = [
			{ text: "\u001B[31mRed\u001B[0m", note: "Normal text" },
			{ text: "\u001B[32mGreen\u001B[0m", note: "More text" }
		];

		await expect(
			tablemark(data, {
				countAnsiEscapeCodes: false
			})
		).toMatchFileSnapshot(snapshotFile("countAnsiEscapeCodes-false"));
	});

	test("counts width of ANSI escape codes when `countAnsiEscapeCodes: true`", async () => {
		const data = [
			{ text: "\u001B[31mRed\u001B[0m", note: "Normal text" },
			{ text: "\u001B[32mGreen\u001B[0m", note: "More text" }
		];

		await expect(
			tablemark(data, {
				countAnsiEscapeCodes: true
			})
		).toMatchFileSnapshot(snapshotFile("countAnsiEscapeCodes-true"));
	});
});
