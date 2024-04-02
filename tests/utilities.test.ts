import assert from "node:assert/strict";
import test from "node:test";

import { alignmentOptions } from "../src/shared.js";
import * as utilites from "../src/utilities.js";

void test("pad: left alignment", () => {
	assert.equal(utilites.pad(alignmentOptions.left, 2, "foo"), "foo");
	assert.equal(utilites.pad(alignmentOptions.left, 6, "foo"), "foo   ");
});

void test("pad: right alignment", () => {
	assert.equal(utilites.pad(alignmentOptions.right, 2, "foo"), "foo");
	assert.equal(utilites.pad(alignmentOptions.right, 6, "foo"), "   foo");
});

void test("pad: center alignment", () => {
	assert.equal(utilites.pad(alignmentOptions.center, 2, "foo"), "foo");
	assert.equal(utilites.pad(alignmentOptions.center, 6, "foo"), " foo  ");
	assert.equal(utilites.pad(alignmentOptions.center, 7, "foo"), "  foo  ");
	assert.equal(utilites.pad(alignmentOptions.center, 8, "hi"), "   hi   ");
});

void test("toCellText: renders its argument as a string suitable for a table cell", () => {
	// eslint-disable-next-line unicorn/no-useless-undefined
	assert.equal(utilites.toCellText(undefined), "");
	assert.equal(utilites.toCellText(3), "3");
	assert.equal(utilites.toCellText("|"), "\\|");
});
