import { expect, test } from "vitest";

import { alignmentOptions } from "../src/constants.js";
import { transformAnsiString } from "../src/transformAnsiString.js";
import * as utilites from "../src/utilities.js";

const defaultConfig = utilites.normalizeOptions({});

const fancyConfig = utilites.normalizeOptions({
	textHandlingStrategy: "advanced"
});

// use this to avoid column-level overrides for some settings
const nonExistentColumnIndex = Number.POSITIVE_INFINITY;

test("pad (left alignment): content wider than given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"foo",
			nonExistentColumnIndex,
			alignmentOptions.left,
			2
		)
	).toBe("foo");
});

test("pad (left alignment): content narrower than given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"foo",
			nonExistentColumnIndex,
			alignmentOptions.left,
			6
		)
	).toBe("foo   ");
});

test("pad (right alignment): content wider than given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"foo",
			nonExistentColumnIndex,
			alignmentOptions.right,
			6
		)
	).toBe("   foo");
});

test("pad (right alignment): content narrower than given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"foo",
			nonExistentColumnIndex,
			alignmentOptions.right,
			6
		)
	).toBe("   foo");
});

test("pad (center alignment): content wider than given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"foo",
			nonExistentColumnIndex,
			alignmentOptions.center,
			2
		)
	).toBe("foo");
});

test("pad (center alignment): odd content width but even given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"foo",
			nonExistentColumnIndex,
			alignmentOptions.center,
			6
		)
	).toBe(" foo  ");
});

test("pad (center alignment): odd content width and given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"foo",
			nonExistentColumnIndex,
			alignmentOptions.center,
			7
		)
	).toBe("  foo  ");
});

test("pad (center alignment): even content width and given width", () => {
	expect(
		utilites.pad(
			defaultConfig,
			"hi",
			nonExistentColumnIndex,
			alignmentOptions.center,
			8
		)
	).toBe("   hi   ");
});

test("advancedStringWidth: ignores ANSI escape codes when `countAnsiEscapeCodes: false`", () => {
	expect(utilites.advancedStringWidth("\u001B[31mRed\u001B[0m", false)).toBe(3);
});

test("advancedStringWidth: counts ANSI escape codes when `countAnsiEscapeCodes: true`", () => {
	expect(utilites.advancedStringWidth("\u001B[31mRed\u001B[0m", true)).toBe(12);
});

test("toCellText: renders its argument as a string suitable for a table cell", () => {
	expect(utilites.toCellText({ key: "undefined", value: undefined })).toBe("");

	expect(utilites.toCellText({ key: "numberToString", value: 3 })).toBe("3");
});

test("toCellText: escapes pipe characters", () => {
	expect(utilites.toCellText({ key: "escapedPipe", value: "|" })).toBe("\\|");
});

test("getMaxStringWidth: finds longest line in a simple string", () => {
	expect(
		utilites.getMaxStringWidth(
			defaultConfig,
			nonExistentColumnIndex,
			"single line"
		)
	).toBe(11);
});

test("getMaxStringWidth: finds longest line in a multi-line string", () => {
	expect(
		utilites.getMaxStringWidth(
			defaultConfig,
			nonExistentColumnIndex,
			"of several lines,\none is considered longest\nand this is not it"
		)
	).toBe(25);
});

test("getMaxStringWidth (auto): ANSI style aware", () => {
	expect(
		utilites.getMaxStringWidth(
			defaultConfig,
			nonExistentColumnIndex,
			"\u001B[4mfour\u001B[0m"
		)
	).toBe(4);
});

test("getMaxStringWidth (advanced): ANSI style aware", () => {
	expect(
		utilites.getMaxStringWidth(
			fancyConfig,
			nonExistentColumnIndex,
			"\u001B[4mfour\u001B[0m"
		)
	).toBe(4);
});

test("getMaxStringWidth (auto): not multi-codepoint emoji aware", () => {
	expect(
		utilites.getMaxStringWidth(defaultConfig, nonExistentColumnIndex, "👨‍👩‍👧‍👦")
	).toBe(2);
});

test("getMaxStringWidth (advanced): multi-codepoint emoji aware", () => {
	expect(
		utilites.getMaxStringWidth(fancyConfig, nonExistentColumnIndex, "👨‍👩‍👧‍👦")
	).toBe(2);
});

test("getMaxStringWidth (auto): not CJK aware", () => {
	expect(
		utilites.getMaxStringWidth(defaultConfig, nonExistentColumnIndex, "古")
	).toBe(2);
});

test("getMaxStringWidth (advanced): CJK aware", () => {
	expect(
		utilites.getMaxStringWidth(fancyConfig, nonExistentColumnIndex, "古")
	).toBe(2);
});

test("transformAnsiString: alters the string while retaining ANSI styles", () => {
	expect(
		transformAnsiString("\u001B[4msomeSort of String\u001B[0m", (part) =>
			part.toUpperCase()
		)
	).toBe("\u001B[4mSOMESORT OF STRING\u001B[0m");
});
