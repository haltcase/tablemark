import { sentenceCase } from "sentence-case"
import split from "split-text-to-chunks"

import { alignmentOptions } from "./index.js"

import type {
  Alignment,
  InputData,
  ToCellText,
  TablemarkOptions,
  TablemarkOptionsNormalized
} from "./types.js"

const columnsWidthMin = 5
const pipeRegex = /\|/g

const alignmentSet: Set<Uppercase<Alignment>> = new Set([
  "LEFT",
  "CENTER",
  "RIGHT"
])

export const pad = (
  alignment: Alignment,
  width: number,
  content: string
): string => {
  if (alignment == null || alignment === alignmentOptions.left) {
    return content.padEnd(width)
  }

  if (alignment === alignmentOptions.right) {
    return content.padStart(width)
  }

  // center alignment
  const remainder = Math.max(0, (width - content.length) % 2)
  const sides = Math.max(0, (width - content.length - remainder) / 2)

  return " ".repeat(sides) + content + " ".repeat(sides + remainder)
}

export const toCellText: ToCellText = v => {
  if (typeof v === "undefined") return ""
  return String(v).replace(pipeRegex, "\\|")
}

export const line = (
  columns: readonly string[],
  config: TablemarkOptionsNormalized,
  forceGutters = false
): string => {
  const gutters = forceGutters ? true : config.wrapWithGutters

  return (
    (gutters ? "| " : "  ") +
    columns.join(gutters ? " | " : "   ") +
    (gutters ? " |" : "  ") +
    config.lineEnding
  )
}

export const row = (
  alignments: readonly Alignment[],
  widths: readonly number[],
  columns: readonly string[],
  config: TablemarkOptionsNormalized
): string => {
  const width = columns.length
  const values = new Array(width)
  const first = new Array(width)
  let height = 1

  for (let h = 0; h < width; h++) {
    const cells = (values[h] = split(columns[h], widths[h]))
    if (cells.length > height) height = cells.length
    first[h] = pad(alignments[h], widths[h], cells[0])
  }

  if (height === 1) {
    return line(first, config, true)
  }

  const lines = new Array(height)
  lines[0] = line(first, config, true)

  for (let v = 1; v < height; v++) {
    lines[v] = new Array(width)
  }

  for (let h = 0; h < width; h++) {
    const cells = values[h]
    let v = 1

    for (; v < cells.length; v++) {
      lines[v][h] = pad(alignments[h], widths[h], cells[v])
    }

    for (; v < height; v++) {
      lines[v][h] = " ".repeat(widths[h])
    }
  }

  for (let h = 1; h < height; h++) {
    lines[h] = line(lines[h], config)
  }

  return lines.join("")
}

export const normalizeOptions = (
  options: TablemarkOptions
): TablemarkOptionsNormalized => {
  const defaults: TablemarkOptionsNormalized = {
    toCellText: toCellText,
    caseHeaders: true,
    columns: [],
    lineEnding: "\n",
    wrapWidth: Infinity,
    wrapWithGutters: false
  }

  Object.assign(defaults, options)

  defaults.columns =
    options?.columns?.map(descriptor => {
      if (typeof descriptor === "string") {
        return { name: descriptor }
      }

      const align =
        (descriptor.align?.toUpperCase() as Uppercase<Alignment>) ??
        alignmentOptions.left

      if (!alignmentSet.has(align)) {
        throw new TypeError(`Unknown alignment, got ${descriptor.align}`)
      }

      return {
        align,
        name: descriptor.name
      }
    }) ?? []

  return defaults
}

export const getColumnTitles = (
  keys: readonly string[],
  config: TablemarkOptionsNormalized
): string[] => {
  return keys.map((key, i) => {
    if (Array.isArray(config.columns)) {
      const customTitle = config.columns[i]?.name

      if (customTitle != null) {
        return customTitle
      }
    }

    if (!config.caseHeaders) {
      return key
    }

    return sentenceCase(key)
  })
}

export const getColumnWidths = (
  input: InputData,
  keys: readonly string[],
  titles: readonly string[],
  config: TablemarkOptionsNormalized
): number[] => {
  return input.reduce(
    (sizes, item) =>
      keys.map((key, i) =>
        Math.max(
          split.width(config.toCellText(item[key]), config.wrapWidth),
          sizes[i]
        )
      ),
    titles.map(t => Math.max(columnsWidthMin, split.width(t, config.wrapWidth)))
  )
}

export const getColumnAlignments = (
  keys: readonly string[],
  config: TablemarkOptionsNormalized
): Alignment[] => {
  return keys.map((_, i) => {
    if (typeof config.columns[i]?.align === "string") {
      return config.columns[i].align as Alignment
    }

    return alignmentOptions.left
  })
}
