import * as changeCase from "change-case";

import type { HeaderCase } from "./types.js";

export const alignmentOptions = {
	left: "left",
	center: "center",
	right: "right"
} as const;

export const headerCaseOptions = Object.fromEntries([
	...Object.keys(changeCase)
		.filter((key) => key.endsWith("Case"))
		.map((key) => [key, key]),
	["preserve", "preserve"]
]) as Record<HeaderCase, HeaderCase>;

export const unknownKeyStrategies = {
	ignore: "ignore",
	throw: "throw"
} as const;

export const overflowStrategies = {
	wrap: "wrap",
	truncateStart: "truncateStart",
	truncateEnd: "truncateEnd"
} as const;

export const lineBreakStrategies = {
	preserve: "preserve",
	truncate: "truncate",
	strip: "strip"
} as const;

export const textHandlingStrategies = {
	auto: "auto",
	basic: "basic",
	advanced: "advanced"
} as const;

export const columnsMinimumWidth = 3;

// oxlint-disable-next-line no-control-regex
export const ansiCodeRegex = /\u001B/g;
export const lineEndingRegex = /\r?\n/g;

export const truncationCharacter = "\u2026";
