import type { alignmentOptions } from "./shared.js";

export type LooseObject = Record<string, unknown>;

export type InputData<T = LooseObject> = T[];

export type Alignment =
	| keyof typeof alignmentOptions
	| Uppercase<keyof typeof alignmentOptions>;

export interface ColumnDescriptor {
	/**
	 * Alignment to use for this column.
	 */
	align?: Alignment;

	/**
	 * Text to use as the column title.
	 */
	name?: string;
}

export type ToCellText = (value: unknown) => string;

export interface TablemarkOptions {
	/**
	 * Whether to sentence-case header titles derived from input object
	 * keys.
	 */
	caseHeaders?: boolean;

	/**
	 * Array for configuring column alignment, where each element sets
	 * options for its corresponding item in the input data.
	 *
	 * Each element can be either an object, in which case the `name`
	 * and `align` properties control the display of the column, or
	 * a `string` to be used as the column title.
	 */
	columns?: (ColumnDescriptor | string)[];

	/**
	 * Function used to convert input values to `string`s suitable
	 * for display in the output table. By default all values are
	 * converted using `String()` and `|` characters are escaped.
	 */
	toCellText?: ToCellText;

	/**
	 * Whether to add `|` characters when wrapping within rows.
	 */
	wrapWithGutters?: boolean;

	/**
	 * Width at which to wrap the content of columns. The default is
	 * `Infinity` meaning no wrapping will be performed.
	 */
	wrapWidth?: number;

	/**
	 * Text to use as the line ending, `\n` by default.
	 */
	lineEnding?: string;

	/**
	 * Include padding on the header separator row, `true` by default.
	 */
	padHeaderSeparator?: boolean;
}

export type TablemarkOptionsNormalized = Omit<
	{
		[key in keyof TablemarkOptions]-?: TablemarkOptions[key];
	},
	"columns"
> & {
	columns: ColumnDescriptor[];
};
