import { buildMarkdown } from "./markdown.js";
import type {
	InputData,
	NonEmptyInputData,
	TablemarkOptions
} from "./types.js";
import { normalizeOptions } from "./utilities.js";

export const tablemark = <T extends InputData>(
	input: T,
	options: TablemarkOptions<T> = {}
): string => {
	if (typeof input[Symbol.iterator] !== "function") {
		throw new TypeError(`Expected an iterable, got ${typeof input}`);
	}

	if (input.length === 0) {
		return "";
	}

	const config = normalizeOptions(options);

	return buildMarkdown(input as unknown as NonEmptyInputData, config);
};

export type * from "./types.js";
export { toCellText } from "./utilities.js";
