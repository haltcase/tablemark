import {
	alignmentOptions,
	columnsMinimumWidth,
	lineEndingRegex,
	truncationCharacter
} from "./constants.js";
import type { DataProfile } from "./data.js";
import { getDataProfile } from "./data.js";
import type {
	DataRecord,
	NonEmptyInputData,
	TablemarkOptionsNormalized
} from "./types.js";
import {
	getIsSomeTruncateStrategy,
	getOverflowStrategy,
	getStringWrapMethod,
	pad,
	stripLineBreaks
} from "./utilities.js";

export const getLine = (
	columns: string[],
	config: TablemarkOptionsNormalized,
	forceGutters: boolean
): string => {
	const hasGutters = forceGutters ? true : config.wrapWithGutters;

	const columnCount = columns.length;

	let line = "";
	line += hasGutters ? "|" : " ";
	line += " ";

	for (const [index, value] of columns.entries()) {
		line += value;
		line += " ";
		line += hasGutters ? "|" : " ";

		if (index < columnCount - 1) {
			line += " ";
		}
	}

	return line + config.lineEnding;
};

export const getRow = (
	columns: string[],
	profile: DataProfile,
	config: TablemarkOptionsNormalized,
	isHeader = false
): string => {
	let rowHeight = 1;

	const cellValues = columns.map((value, columnIndex) => {
		const columnWidth = profile.widths[columnIndex] || 0;
		let valueWithLineBreakStrategy = value;

		switch (config.lineBreakStrategy) {
			case "preserve": {
				// Keep the value as is
				break;
			}
			case "strip": {
				// Replace line breaks with spaces
				valueWithLineBreakStrategy = stripLineBreaks(value);
				break;
			}
			case "truncate": {
				if (value.includes("\n")) {
					// Take only the first line
					valueWithLineBreakStrategy =
						(value.split(lineEndingRegex, 1)[0] ?? "") + truncationCharacter;
				}
				break;
			}
			default: {
				throw new RangeError(
					`Unknown line break strategy ${String(config.lineBreakStrategy)}`
				);
			}
		}

		const overflowStrategy = getOverflowStrategy(config, columnIndex, isHeader);
		const stringWrapMethod = getStringWrapMethod(config, columnIndex);
		const cells = stringWrapMethod(valueWithLineBreakStrategy, columnWidth);

		switch (overflowStrategy) {
			case "wrap": {
				rowHeight = Math.max(rowHeight, cells.length);
				return cells;
			}
			case "truncateStart": {
				const lastCell = cells.at(-1) ?? "";
				return cells.length === 1 ? cells : [truncationCharacter + lastCell];
			}
			case "truncateEnd": {
				const firstCell = cells[0] ?? "";
				return cells.length === 1 ? cells : [firstCell + truncationCharacter];
			}
			default: {
				throw new RangeError(
					`Unknown overflow strategy ${String(config.overflowStrategy)}`
				);
			}
		}
	});

	let row = "";

	for (let rowIndex = 0; rowIndex < rowHeight; rowIndex++) {
		const line: string[] = [];

		for (const [columnIndex, cells] of cellValues.entries()) {
			const cellValue = cells.length > rowIndex ? (cells[rowIndex] ?? "") : "";
			const isSomeTruncateStrategy = getIsSomeTruncateStrategy(
				config,
				columnIndex
			);

			line.push(
				pad(
					config,
					cellValue,
					columnIndex,
					profile.alignments[columnIndex],
					(profile.widths[columnIndex] ?? columnsMinimumWidth) +
						(isSomeTruncateStrategy ? truncationCharacter.length : 0)
				)
			);
		}

		row += getLine(line, config, rowIndex === 0);
	}

	return row;
};

export const getHeader = (
	profile: DataProfile,
	config: TablemarkOptionsNormalized
): string => {
	let result = getRow(profile.titles, profile, config, true);

	const gutterPadding = config.padHeaderSeparator ? " " : "";

	result += `|${gutterPadding}`;

	const columnCount = profile.keys.length;

	for (let index = 0; index < columnCount; index++) {
		const isSomeTruncateStrategy = getIsSomeTruncateStrategy(config, index);

		const paddingForTruncation = isSomeTruncateStrategy
			? truncationCharacter.length
			: 0;

		const requestedAlignment = profile.alignments[index];
		const isCenterOrLeft =
			requestedAlignment === alignmentOptions.center ||
			requestedAlignment === alignmentOptions.left;

		const isCenterOrRight =
			requestedAlignment === alignmentOptions.center ||
			requestedAlignment === alignmentOptions.right;

		const dashWidthOffset = config.padHeaderSeparator ? 2 : 0;

		result += isCenterOrLeft ? ":" : "-";
		result += "-".repeat(
			(profile.widths[index] ?? columnsMinimumWidth) -
				dashWidthOffset +
				paddingForTruncation
		);
		result += isCenterOrRight ? ":" : "-";

		result += `${gutterPadding}|`;

		if (index < columnCount - 1) {
			result += gutterPadding;
		}
	}

	return result + config.lineEnding;
};

export const getObjectRow = (
	object: DataRecord,
	profile: DataProfile,
	config: TablemarkOptionsNormalized
): string => getRow(Object.values(object), profile, config);

export const getRows = (
	profile: DataProfile,
	config: TablemarkOptionsNormalized
): string => {
	let allRows = "";

	for (const object of profile.data) {
		allRows += getObjectRow(object, profile, config);
	}

	return allRows;
};

export const buildMarkdown = (
	input: NonEmptyInputData,
	config: TablemarkOptionsNormalized
): string => {
	let table = "";

	const metadata = getDataProfile(input, config);

	table += getHeader(metadata, config);
	table += getRows(metadata, config);

	return table;
};
