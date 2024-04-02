import { alignmentOptions } from "./shared.js";
import type { InputData, TablemarkOptions } from "./types.js";
import {
	getColumnAlignments,
	getColumnTitles,
	getColumnWidths,
	line,
	normalizeOptions,
	row
} from "./utilities.js";

// eslint-disable-next-line import/no-default-export
export default (input: InputData, options: TablemarkOptions = {}): string => {
	if (typeof input[Symbol.iterator] !== "function") {
		throw new TypeError(`Expected an iterable, got ${typeof input}`);
	}

	const config = normalizeOptions(options);

	const keys = Object.keys(input[0] || {});
	const titles = getColumnTitles(keys, config);
	const widths = getColumnWidths(input, keys, titles, config);
	const alignments = getColumnAlignments(keys, config);

	let table = "";

	// header line
	table += row(alignments, widths, titles, config);

	const dashLengthOffset = config.padHeaderSeparator ? 2 : 0;

	// header separator
	table += line(
		alignments.map(
			(align, index) =>
				(align === alignmentOptions.left || align === alignmentOptions.center
					? ":"
					: "-") +
				"-".repeat((widths[index] || 0) - dashLengthOffset) +
				(align === alignmentOptions.right || align === alignmentOptions.center
					? ":"
					: "-")
		),
		config,
		{
			forceGutters: true,
			isHeaderSeparator: true
		}
	);

	// table body
	table += input
		.map((item, _) =>
			row(
				alignments,
				widths,
				keys.map((key) => config.toCellText(item[key])),
				config
			)
		)
		.join("");

	return table;
};

export * from "./types.js";
export { toCellText } from "./utilities.js";
