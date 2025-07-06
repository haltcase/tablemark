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
	const fieldSet = new Set(Object.keys(input[0]));

	const data = input.map((record, recordIndex) => {
		let entries = Object.entries(record);

		if (config.unknownKeyStrategy === "ignore") {
			entries = entries.filter(([key]) => fieldSet.has(key));
		}

		return Object.fromEntries(
			entries.map(([key, value], columnIndex) => {
				if (config.unknownKeyStrategy === "throw" && !fieldSet.has(key)) {
					throw new RangeError(
						`Unexpected object key '${key}' at record index ${recordIndex}`
					);
				}

				const cellValue = config.toCellText({ key, value });
				const thisLength = getMaxStringWidth(config, columnIndex, cellValue);
				const entryLength = maxWidthMap.get(key);

				if (entryLength == null) {
					maxWidthMap.set(key, thisLength);
				} else {
					maxWidthMap.set(key, Math.max(thisLength, entryLength));
				}

				return [key, cellValue];
			})
		);
	}) as NonEmptyData;

	return {
		data,
		maxWidthMap,
		alignments: [],
		keys: [],
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
	const object = profile.data[0];

	for (const [columnIndex, key] of Object.keys(object).entries()) {
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

		profile.keys.push(key);
		profile.titles.push(title);
		profile.alignments.push(align);
		profile.widths.push(calculatedWidth);
	}

	return profile;
};
