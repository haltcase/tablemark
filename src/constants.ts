export const alignmentOptions = {
	left: "left",
	center: "center",
	right: "right"
} as const;

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

export const lineEndingRegex = /\r?\n/g;

export const truncationCharacter = "\u2026";
