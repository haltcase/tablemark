import type { InputData, TablemarkOptions } from "./types.js"

import {
  getColumnAlignments,
  getColumnTitles,
  getColumnWidths,
  line,
  normalizeOptions,
  row
} from "./utilities.js"

export const alignmentOptions = {
  left: "LEFT",
  center: "CENTER",
  right: "RIGHT"
} as const

export default (input: InputData, options: TablemarkOptions = {}): string => {
  if (typeof input[Symbol.iterator] !== "function") {
    throw new TypeError(`Expected an iterable, got ${typeof input}`)
  }

  const config = normalizeOptions(options)

  const keys = Object.keys(input[0])
  const titles = getColumnTitles(keys, config)
  const widths = getColumnWidths(input, keys, titles, config)
  const alignments = getColumnAlignments(keys, config)

  let table = ""

  // header line
  table += row(alignments, widths, titles, config)

  // header separator
  table += line(
    alignments.map(
      (align, i) =>
        (align === alignmentOptions.left || align === alignmentOptions.center
          ? ":"
          : "-") +
        "-".repeat(widths[i] - 2) +
        (align === alignmentOptions.right || align === alignmentOptions.center
          ? ":"
          : "-")
    ),
    config,
    true
  )

  // table body
  table += input
    .map((item, _) =>
      row(
        alignments,
        widths,
        keys.map(key => config.toCellText(item[key])),
        config
      )
    )
    .join("")

  return table
}

export { toCellText } from "./utilities.js"
export * from "./types.js"
