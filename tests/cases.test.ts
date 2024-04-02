import assert from "node:assert/strict";
import test from "node:test";

import tablemark from "../src/index.js";
import { cases } from "./fixtures/inputs.js";

void test("outputs the expected markdown", () => {
	const result = tablemark(cases.standard.input);
	assert.equal(result, cases.standard.expected);
});

void test("works when provided alignment options", () => {
	const result = tablemark(cases.alignments.input, cases.alignments.options);
	assert.equal(result, cases.alignments.expected);
});

void test("replaces column names when provided", () => {
	const result = tablemark(cases.columns.input, cases.columns.options);
	assert.equal(result, cases.columns.expected);
});

void test("can override sentence casing", () => {
	const result = tablemark(cases.casing.input, cases.casing.options);
	assert.equal(result, cases.casing.expected);
});

void test("can use custom stringify function", () => {
	const result = tablemark(cases.coerce.input, cases.coerce.options);
	assert.equal(result, cases.coerce.expected);
});

void test("text wrapping", () => {
	const result = tablemark(cases.wrap.input, cases.wrap.options);
	assert.equal(result, cases.wrap.expected);
});

void test("newlines", () => {
	const result = tablemark(cases.newlines.input);
	assert.equal(result, cases.newlines.expected);
});

void test("text wrapping and newlines combined", () => {
	const result = tablemark(
		cases.wrapAndNewlines.input,
		cases.wrapAndNewlines.options
	);
	assert.equal(result, cases.wrapAndNewlines.expected);
});

void test("gutters", () => {
	const result = tablemark(cases.gutters.input, cases.gutters.options);
	assert.equal(result, cases.gutters.expected);
});

void test("can disable header separator row padding", () => {
	const result = tablemark(
		cases.padHeaderSeparator.input,
		cases.padHeaderSeparator.options
	);
	assert.equal(result, cases.padHeaderSeparator.expected);
});

void test("pipes in content", () => {
	const result = tablemark(cases.pipes.input);
	assert.equal(result, cases.pipes.expected);
});
