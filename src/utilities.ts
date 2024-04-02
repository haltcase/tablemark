import { sentenceCase } from "sentence-case";
import split from "split-text-to-chunks";

import { alignmentOptions } from "./shared.js";
import type {
	Alignment,
	InputData,
	TablemarkOptions,
	TablemarkOptionsNormalized,
	ToCellText
} from "./types.js";

const columnsWidthMin = 5;
const pipeRegex = /\|/g;

const alignmentSet = new Set<Uppercase<Alignment>>(["LEFT", "CENTER", "RIGHT"]);

export const pad = (
	alignment: Alignment | undefined,
	width: number,
	content: string
): string => {
	if (alignment == null || alignment === alignmentOptions.left) {
		return content.padEnd(width);
	}

	if (alignment === alignmentOptions.right) {
		return content.padStart(width);
	}

	// center alignment
	const remainder = Math.max(0, (width - content.length) % 2);
	const sides = Math.max(0, (width - content.length - remainder) / 2);

	return " ".repeat(sides) + content + " ".repeat(sides + remainder);
};

export const toCellText: ToCellText = (v) => {
	if (v === undefined) return "";
	return String(v).replaceAll(pipeRegex, "\\|");
};

export const line = (
	columns: readonly string[],
	config: TablemarkOptionsNormalized,
	{
		forceGutters = false,
		isHeaderSeparator = false
	}: {
		forceGutters?: boolean;
		isHeaderSeparator?: boolean;
	} = {}
): string => {
	const gutters = forceGutters ? true : config.wrapWithGutters;
	let padding = " ";

	if (isHeaderSeparator && !config.padHeaderSeparator) {
		padding = "";
	}

	return (
		(gutters ? `|${padding}` : ` ${padding}`) +
		columns.join(gutters ? `${padding}|${padding}` : `${padding} ${padding}`) +
		(gutters ? `${padding}|` : `${padding} `) +
		config.lineEnding
	);
};

export const row = (
	alignments: readonly Alignment[],
	widths: readonly number[],
	columns: readonly string[],
	config: TablemarkOptionsNormalized
): string => {
	const width = columns.length;
	const values = Array.from<string>({ length: width });
	const first = Array.from<string>({ length: width });
	let height = 1;

	for (let h = 0; h < width; h++) {
		const cells = split(
			columns[h] || "",
			Math.max(widths[h] || 0, columnsWidthMin)
		);
		values[h] = cells;

		if (cells.length > height) {
			height = cells.length;
		}

		first[h] = pad(
			alignments[h],
			Math.max(widths[h] || 0, columnsWidthMin),
			cells[0] || ""
		);
	}

	if (height === 1) {
		return line(first, config, { forceGutters: true });
	}

	const lines: [first: string, ...rest: string[][]] = [
		line(first, config, { forceGutters: true }),
		...Array.from<string[]>({
			length: height
		})
	];

	for (let v = 1; v < height; v++) {
		lines[v as 1] = Array.from<string>({ length: width });
	}

	for (let h = 0; h < width; h++) {
		const cells = values[h];
		let v = 1;

		if (cells && cells.length > 0) {
			for (; v < cells.length; v++) {
				(lines[v] as string[])[h] = pad(
					alignments[h],
					Math.max(widths[h] || 0, columnsWidthMin),
					cells[v] || ""
				);
			}
		}

		for (; v < height; v++) {
			(lines[v] as string[])[h] = " ".repeat(
				Math.max(widths[h] || 0, columnsWidthMin)
			);
		}
	}

	for (let h = 1; h < height; h++) {
		lines[h as 0] = line(lines[h as 1] || [], config);
	}

	return lines.join("");
};

export const normalizeOptions = (
	options: TablemarkOptions
): TablemarkOptionsNormalized => {
	const defaults: TablemarkOptionsNormalized = {
		toCellText,
		caseHeaders: true,
		columns: [],
		lineEnding: "\n",
		wrapWidth: Number.POSITIVE_INFINITY,
		wrapWithGutters: false,
		padHeaderSeparator: true
	};

	Object.assign(defaults, options);

	defaults.columns =
		options.columns?.map((descriptor) => {
			if (typeof descriptor === "string") {
				return { name: descriptor };
			}

			const align =
				(descriptor.align?.toUpperCase() as Uppercase<Alignment> | undefined) ??
				alignmentOptions.left;

			if (!alignmentSet.has(align)) {
				throw new RangeError(`Unknown alignment, got ${descriptor.align}`);
			}

			return {
				align,
				name: descriptor.name
			};
		}) ?? [];

	return defaults;
};

export const getColumnTitles = (
	keys: readonly string[],
	config: TablemarkOptionsNormalized
): string[] => {
	return keys.map((key, index) => {
		if (Array.isArray(config.columns)) {
			const customTitle = config.columns[index]?.name;

			if (customTitle != null) {
				return customTitle;
			}
		}

		if (!config.caseHeaders) {
			return key;
		}

		return sentenceCase(key);
	});
};

export const getColumnWidths = (
	input: InputData,
	keys: readonly string[],
	titles: readonly string[],
	config: TablemarkOptionsNormalized
): number[] => {
	return input.reduce(
		(sizes, item) =>
			keys.map((key, index) =>
				Math.max(
					split.width(config.toCellText(item[key]), config.wrapWidth),
					sizes[index] || 0
				)
			),
		titles.map((t) =>
			Math.max(columnsWidthMin, split.width(t, config.wrapWidth))
		)
	);
};

export const getColumnAlignments = (
	keys: readonly string[],
	config: TablemarkOptionsNormalized
): Alignment[] => {
	return keys.map((_, index) => {
		if (typeof config.columns[index]?.align === "string") {
			return config.columns[index]?.align ?? alignmentOptions.left;
		}

		return alignmentOptions.left;
	});
};
