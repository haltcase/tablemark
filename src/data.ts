import { columnsMinimumWidth } from "./constants.js";
import { transformAnsiString } from "./transformAnsiString.js";
import type {
	Alignment,
	NonEmptyData,
	NonEmptyInputData,
	TablemarkOptionsNormalized
} from "./types.js";
import { getMaxStringWidth, toTextCase } from "./utilities.js";

type MaxWidthMap = Map<string, number>;

export interface DataProfile {
	data: NonEmptyData;
	maxWidthMap: MaxWidthMap;
	keys: string[];
	titles: string[];
	alignments: Alignment[];
	widths: number[];
}

export const initializeProfile = (
	input: NonEmptyInputData,
	config: TablemarkOptionsNormalized
): DataProfile => {
	const maxWidthMap: MaxWidthMap = new Map();
	const keys = Object.keys(input[0]);
	const columnIndices = new Map(keys.map((key, index) => [key, index]));

	const data = input.map((record, recordIndex) => {
		const entries: [string, string][] = [];
		for (const [key, value] of Object.entries(record)) {
			const columnIndex = columnIndices.get(key);
			if (columnIndex === undefined) {
				if (config.unknownKeyStrategy === "throw") {
					throw new RangeError(
						`Unexpected object key '${key}' at record index ${recordIndex}`
					);
				}
				continue;
			}

			const cellValue = config.toCellText({ key, value });
			const thisLength = getMaxStringWidth(config, columnIndex, cellValue);
			maxWidthMap.set(key, Math.max(thisLength, maxWidthMap.get(key) ?? 0));
			entries.push([key, cellValue]);
		}

		return Object.fromEntries(entries);
	}) as NonEmptyData;

	return {
		data,
		maxWidthMap,
		alignments: [],
		keys,
		titles: [],
		widths: []
	};
};

const getColumnTitle = (
	config: TablemarkOptionsNormalized,
	key: string,
	columnIndex: number
): string => {
	const { name: suppliedName } = config.columns[columnIndex] ?? {};

	if (suppliedName) {
		return suppliedName;
	}

	const casedTitle = transformAnsiString(key, (part) =>
		toTextCase(part, config.headerCase)
	);

	return config.toHeaderTitle?.({ key, title: casedTitle }) ?? casedTitle;
};

export const getDataProfile = (
	input: NonEmptyInputData,
	config: TablemarkOptionsNormalized
): DataProfile => {
	const profile = initializeProfile(input, config);

	for (const [columnIndex, key] of profile.keys.entries()) {
		const title = getColumnTitle(config, key, columnIndex);
		const {
			align = config.align,
			maxWidth = config.maxWidth,
			width
		} = config.columns[columnIndex] ?? {};

		const calculatedWidth =
			width ??
			Math.min(
				Math.max(
					profile.maxWidthMap.get(key) ?? 0,
					getMaxStringWidth(config, columnIndex, title),
					columnsMinimumWidth
				),
				maxWidth
			);

		profile.titles.push(title);
		profile.alignments.push(align);
		profile.widths.push(calculatedWidth);
	}

	return profile;
};
