import type * as changeCase from "change-case";

import type {
	alignmentOptions,
	lineBreakStrategies,
	overflowStrategies,
	textHandlingStrategies,
	unknownKeyStrategies
} from "./constants.ts";

type ChangeCaseExports = keyof typeof changeCase;

type TextCaseMethod = keyof {
	[TKey in ChangeCaseExports as TKey extends `${string}Case`
		? TKey
		: never]: (typeof changeCase)[TKey];
};

/**
 * Text casing methods supported for column titles.
 */
export type HeaderCase = TextCaseMethod | "preserve";

export type LooseObject = Record<string, unknown>;
export type DataRecord = Record<string, string>;

export type InputData<T = LooseObject> = readonly T[];

export type NonEmptyInputData<T = LooseObject> = [T, ...T[]];
export type NonEmptyData<T = DataRecord> = [T, ...T[]];

export type GetDataKeys<T extends InputData> = keyof T[0];

export type Alignment = keyof typeof alignmentOptions;
export type UnknownKeyStrategy = keyof typeof unknownKeyStrategies;
export type OverflowStrategy = keyof typeof overflowStrategies;
export type LineBreakStrategy = keyof typeof lineBreakStrategies;
export type TextHandlingStrategy = keyof typeof textHandlingStrategies;

export interface ColumnDescriptor {
	/**
	 * Alignment to use for this column.
	 */
	align?: Alignment;

	/**
	 * Maximum content width of this column, overriding the root configuration.
	 */
	maxWidth?: number;

	/**
	 * Text to use as the column title.
	 */
	name?: string;

	/**
	 * What to do when this column's content reaches `maxWidth`, overriding the
	 * root configuration.
	 */
	overflowStrategy?: OverflowStrategy;

	/**
	 * What to do when this column's header content reaches `maxWidth`, overriding
	 * the root configuration.
	 */
	overflowHeaderStrategy?: OverflowStrategy;

	/**
	 * Which text processing method to use for this column, overriding the root
	 * configuration.
	 */
	textHandlingStrategy?: TextHandlingStrategy;

	/**
	 * Fixed display width for the column, overriding both the root
	 * configuration's `maxWidth` property and this column's `maxWidth`.
	 */
	width?: number;
}

export interface ToHeaderTitle<TKey = string> {
	// eslint-disable-next-line @typescript-eslint/prefer-function-type
	(props: {
		/**
		 * Original object key.
		 */
		key: TKey;
		/**
		 * Column title with casing applied according to `config.headerCase`.
		 */
		title: string;
	}): string;
}

export interface ToCellText<TKey = string> {
	// eslint-disable-next-line @typescript-eslint/prefer-function-type
	(props: {
		/**
		 * Original object key.
		 */
		key: TKey;
		/**
		 * Input value which can be altered before being rendered into the table cell.
		 */
		value: unknown;
	}): string;
}

export interface TablemarkOptions<
	TData extends InputData = InputData,
	TKey = keyof TData[0]
> {
	/**
	 * Default alignment to use for all columns, `left` by default.
	 */
	align?: Alignment;

	/**
	 * @deprecated Use `headerCase: "preserve"` or `headerCase: "sentenceCase"` instead.
	 */
	caseHeaders?: boolean;

	/**
	 * Array for configuring individual columns, where each element sets options
	 * for its corresponding item in the input data.
	 *
	 * Each element can be either an object, in which case its properties control
	 * the display of the column (overriding the same settings from the root
	 * configuration), or a `string` to be used as the column title.
	 */
	columns?: (ColumnDescriptor | string)[];

	/**
	 * Text casing method for header titles derived from input object keys.
	 */
	headerCase?: HeaderCase;

	/**
	 * What to do when cell content contains line breaks. The default is
	 * "preserve"
	 */
	lineBreakStrategy?: LineBreakStrategy;

	/**
	 * Text to use as the line ending, `\n` by default.
	 */
	lineEnding?: string;

	/**
	 * Maximum content width of all columns. The default is `Infinity`, meaning
	 * columns will fit to content width.
	 */
	maxWidth?: number;

	/**
	 * @deprecated Use `maxWidth` instead.
	 */
	wrapWidth?: number;

	/**
	 * What to do when body cell content reaches `maxWidth`. The default is
	 * "truncateEnd".
	 */
	overflowStrategy?: OverflowStrategy;

	/**
	 * What to do when header cell content reaches `maxWidth`. The default is
	 * "wrap".
	 */
	overflowHeaderStrategy?: OverflowStrategy;

	/**
	 * Include padding on the header separator row, `true` by default.
	 */
	padHeaderSeparator?: boolean;

	/**
	 * Function used to convert input values to `string`s suitable for display
	 * in the output table. By default all values are converted using `String()`
	 * and `|` characters are escaped.
	 */
	toCellText?: ToCellText<TKey>;

	/**
	 * Function used to transform header titles, receiving as arguments both the
	 * original object key as well as the title (cased according to `headerCase`).
	 */
	toHeaderTitle?: ToHeaderTitle<TKey>;

	/**
	 * Strategy for handling unknown keys, `"ignore"` by default.
	 */
	unknownKeyStrategy?: UnknownKeyStrategy;

	/**
	 * Set to `true` to enable broader support of languages, Unicode entities
	 * like emoji and [fullwidth](https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms)
	 * characters, and ANSI escape codes (like terminal colors and styles).
	 *
	 * By default, tablemark uses "naive" text processing that is much faster,
	 * but is unaware of these "wider" or invisible characters.
	 */
	textHandlingStrategy?: TextHandlingStrategy;

	/**
	 * Whether to add `|` characters when wrapping within rows.
	 */
	wrapWithGutters?: boolean;
}

export type TablemarkOptionsNormalized = Omit<
	{
		[key in keyof TablemarkOptions]-?: TablemarkOptions[key];
	},
	"caseHeaders" | "columns" | "toHeaderTitle" | "wrapWidth"
> & {
	columns: ColumnDescriptor[];
	toHeaderTitle?: TablemarkOptions["toHeaderTitle"];
	stringWidthMethod: (string: string) => number;
	stringWrapMethod: (string: string, width: number) => string[];
};
