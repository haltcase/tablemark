import getAnsiRegex from "ansi-regex";
import * as changeCase from "change-case";
import stringWidth from "string-width";
import wordwrap from "wordwrapjs";
import wrapAnsi from "wrap-ansi";

import {
	alignmentOptions,
	ansiCodeRegex,
	lineBreakStrategies,
	lineEndingRegex,
	overflowStrategies,
	textHandlingStrategies,
	truncationCharacter,
	unknownKeyStrategies
} from "./constants.js";
import type {
	Alignment,
	ColumnDescriptor,
	HeaderCase,
	OverflowStrategy,
	TablemarkOptions,
	TablemarkOptionsNormalized,
	ToCellText
} from "./types.js";

type StringWrapMethod = (string: string, width: number) => string[];
type StringWidthMethod = (
	string: string,
	shouldCountAnsiEscapeCodes?: boolean
) => number;

const pipeRegex = /\|/g;
export const ansiRegex = getAnsiRegex({ onlyFirst: true });

/**
 * Check if the given `string` contains special characters or character
 * sequences that require special handling, such as multi-byte emojis, ANSI
 * styles, or CJK characters.
 */
export const hasSpecialCharacters = (string: string): boolean =>
	ansiRegex.test(string) || string.length !== stringWidth(string);

export const basicStringWrap: StringWrapMethod = (string, width) =>
	wordwrap.lines(string, {
		width,
		break: true
	});

export const advancedStringWrap: StringWrapMethod = (string, width) =>
	wrapAnsi(string, width, {
		hard: true
	}).split("\n");

/**
 * Wrap the given `string` to the specified `width` using the "advanced"
 * strategy if the string contains special characters or character sequences.
 */
export const autoStringWrap: StringWrapMethod = (string, width) => {
	if (hasSpecialCharacters(string)) {
		return advancedStringWrap(string, width);
	}

	return basicStringWrap(string, width);
};

/**
 * Check if the column at `columnIndex` is affected by any truncation, either
 * for the body or the header, according to the column descriptor or the root
 * configuration.
 */
export const getIsSomeTruncateStrategy = (
	config: TablemarkOptionsNormalized,
	columnIndex: number
): boolean => {
	const isColumnSomeTruncateStrategy =
		/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
		config.columns[columnIndex]?.overflowStrategy?.includes("truncate") ||
		config.columns[columnIndex]?.overflowHeaderStrategy?.includes("truncate") ||
		/* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
		false;

	const isRootSomeTruncateStrategy =
		config.overflowStrategy.includes("truncate") ||
		config.overflowHeaderStrategy.includes("truncate");

	return isColumnSomeTruncateStrategy || isRootSomeTruncateStrategy;
};

/**
 * Get the overflow strategy for the column at `columnIndex` according to the
 * `overflowStrategy` specified in the column descriptor or the root
 * configuration.
 */
export const getOverflowStrategy = (
	config: TablemarkOptionsNormalized,
	columnIndex: number,
	isHeader = false
): OverflowStrategy => {
	const {
		overflowStrategy = config.overflowStrategy,
		overflowHeaderStrategy = config.overflowHeaderStrategy
	} = config.columns[columnIndex] ?? {};

	return isHeader ? overflowHeaderStrategy : overflowStrategy;
};

/**
 * Get the string wrapping function for the column at `columnIndex` according to
 * the `textHandlingStrategy` specified in the column descriptor or the root
 * configuration.
 */
export const getStringWrapMethod = (
	config: TablemarkOptionsNormalized,
	columnIndex: number
): StringWrapMethod => {
	const { textHandlingStrategy = config.textHandlingStrategy } =
		config.columns[columnIndex] ?? {};

	switch (textHandlingStrategy) {
		case textHandlingStrategies.auto: {
			return autoStringWrap;
		}
		case textHandlingStrategies.advanced: {
			return advancedStringWrap;
		}
		case textHandlingStrategies.basic: {
			return basicStringWrap;
		}
	}
};

export const advancedStringWidth: StringWidthMethod = (
	string,
	shouldCountAnsiEscapeCodes = false
) => {
	const width = stringWidth(string, {
		countAnsiEscapeCodes: shouldCountAnsiEscapeCodes
	});

	if (shouldCountAnsiEscapeCodes) {
		// `stringWidth` doesn't count the ASCII escape character, but we need to if
		// we want to align column sides accurately
		return width + (string.match(ansiCodeRegex) ?? []).length;
	}

	return width;
};

export const autoStringWidth: StringWidthMethod = (
	string,
	shouldCountAnsiEscapeCodes
) => {
	if (hasSpecialCharacters(string)) {
		return advancedStringWidth(string, shouldCountAnsiEscapeCodes);
	}

	return string.length;
};

/**
 * Pad the given string `content` to the given `width` according to
 * `alignment`.
 *
 * Note that `content` is expected to be a string _not_ containing newlines.
 */
export const pad = (
	config: TablemarkOptionsNormalized,
	content: string,
	_columnIndex: number,
	alignment: Alignment | undefined,
	width: number
): string => {
	const contentWidth = autoStringWidth(content, config.countAnsiEscapeCodes);

	if (alignment == null || alignment === alignmentOptions.left) {
		return content + " ".repeat(Math.max(0, width - contentWidth));
	}

	if (alignment === alignmentOptions.right) {
		return " ".repeat(Math.max(0, width - contentWidth)) + content;
	}

	// center alignment
	const remainder = Math.max(0, (width - contentWidth) % 2);
	const sides = Math.max(0, (width - contentWidth - remainder) / 2);

	return " ".repeat(sides) + content + " ".repeat(sides + remainder);
};

/**
 * The default cell content transformer.
 */
export const toCellText: ToCellText = ({ value }) => {
	if (value === undefined) {
		return "";
	}

	// eslint-disable-next-line @typescript-eslint/no-base-to-string
	return String(value).replaceAll(pipeRegex, "\\|");
};

const defaultOptions: TablemarkOptionsNormalized = {
	align: alignmentOptions.left,
	columns: [],
	countAnsiEscapeCodes: false,
	headerCase: "sentenceCase",
	lineBreakStrategy: lineBreakStrategies.preserve,
	lineEnding: "\n",
	maxWidth: Number.POSITIVE_INFINITY,
	overflowStrategy: overflowStrategies.wrap,
	overflowHeaderStrategy: overflowStrategies.wrap,
	padHeaderSeparator: true,
	stringWidthMethod: autoStringWidth,
	stringWrapMethod: autoStringWrap,
	toCellText,
	unknownKeyStrategy: unknownKeyStrategies.ignore,
	textHandlingStrategy: textHandlingStrategies.auto,
	wrapWithGutters: false
};

const handleDeprecatedOptions = (
	options: TablemarkOptions
): TablemarkOptions => {
	/* eslint-disable @typescript-eslint/no-deprecated */
	// Use `wrapWidth` as `maxWidth` if `maxWidth` is not set.
	if (options.wrapWidth != null && options.maxWidth == null) {
		options.maxWidth = options.wrapWidth;
		delete options.wrapWidth;
	}

	// Use `caseHeaders` as `headerCase: "preserve" | "sentenceCase"`.
	if (options.caseHeaders != null && options.headerCase == null) {
		options.headerCase = options.caseHeaders ? "sentenceCase" : "preserve";
		delete options.caseHeaders;
	}
	/* eslint-enable @typescript-eslint/no-deprecated */

	return options;
};

export const normalizeOptions = (
	options: TablemarkOptions
): TablemarkOptionsNormalized => {
	// Mutate the input options to preprocess deprecated properties.
	handleDeprecatedOptions(options);

	const { columns, ...rest } = options;

	const normalizedOptions: TablemarkOptionsNormalized = {
		...defaultOptions,
		...rest
	};

	switch (normalizedOptions.textHandlingStrategy) {
		case textHandlingStrategies.auto: {
			normalizedOptions.stringWidthMethod = autoStringWidth;
			normalizedOptions.stringWrapMethod = autoStringWrap;
			break;
		}
		case textHandlingStrategies.advanced: {
			normalizedOptions.stringWidthMethod = advancedStringWidth;
			normalizedOptions.stringWrapMethod = advancedStringWrap;
			break;
		}
		case textHandlingStrategies.basic: {
			// We use `autoStringWidth` even for the `basic` strategy because it
			// doesn't cost much while being more reliable
			normalizedOptions.stringWidthMethod = autoStringWidth;
			normalizedOptions.stringWrapMethod = basicStringWrap;
			break;
		}
	}

	normalizedOptions.columns =
		columns?.map((descriptor) => {
			if (typeof descriptor === "string") {
				return { name: descriptor };
			}

			return {
				name: descriptor.name,
				align: descriptor.align ?? normalizedOptions.align,
				overflowStrategy:
					descriptor.overflowStrategy ?? normalizedOptions.overflowStrategy,
				overflowHeaderStrategy:
					descriptor.overflowHeaderStrategy ??
					normalizedOptions.overflowHeaderStrategy,
				textHandlingStrategy:
					descriptor.textHandlingStrategy ??
					normalizedOptions.textHandlingStrategy,
				width: descriptor.width
			} satisfies ColumnDescriptor;
		}) ?? [];

	return normalizedOptions;
};

/**
 * Replace all line breaks in `text` with the given `replacementCharacter`.
 */
export const stripLineBreaks = (
	text: string,
	replacementCharacter = " "
): string => {
	return text.replaceAll(lineEndingRegex, replacementCharacter);
};

/**
 * Calculate the visual width of a given multiline text by finding its longest
 * line.
 */
export const getMaxStringWidth = (
	config: TablemarkOptionsNormalized,
	_columnIndex: number,
	value: unknown
): number => {
	const text = String(value);

	if (text.includes("\n")) {
		const lines =
			config.lineBreakStrategy === lineBreakStrategies.strip
				? [stripLineBreaks(text)]
				: text.split(
						lineEndingRegex,
						config.lineBreakStrategy === lineBreakStrategies.truncate
							? 1
							: undefined
					);

		const longestLineWidth =
			lines.reduce<number>(
				(currentMax, nextString) =>
					Math.max(
						currentMax,
						autoStringWidth(nextString, config.countAnsiEscapeCodes)
					),
				0
			) +
			(config.lineBreakStrategy === lineBreakStrategies.truncate
				? truncationCharacter.length
				: 0);

		return longestLineWidth;
	}

	return autoStringWidth(text, config.countAnsiEscapeCodes);
};

/**
 * Convert the given string `value` to the specified `textCase`.
 */
export const toTextCase = (value: string, textCase: HeaderCase): string => {
	if (textCase === "preserve") {
		return value;
	}

	const convertCase = changeCase[textCase];

	return convertCase(value);
};
