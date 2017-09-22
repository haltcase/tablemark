'use strict'

const os = require('os')
const sentence = require('sentence-case')
const split = require('split-text-to-chunks')
const chalk = require('chalk')

const width = split.width
const columnsWidthMin = 5
const ALIGN = [ 'LEFT', 'CENTER', 'RIGHT' ]

module.exports = (input, options) => {
  if (!Array.isArray(input)) {
    throw new TypeError(`Expected an Array, got ${typeof input}`)
  }

  options = Object.assign({
    stringify: toString,
    color: false
  }, options, {
    wrap: Object.assign({
      width: Infinity,
      gutters: false
    }, options && options.wrap)
  })

  const stringify = options.stringify
  const columnsMaxWidth = options.wrap.width
  const gutters = options.wrap.gutters
  const color = options.color

  const keys = Object.keys(input[0])

  const titles = keys.map((key, i) => {
    if (Array.isArray(options.columns) && options.columns[i]) {
      if (typeof options.columns[i] === 'string') {
        return options.columns[i]
      } else if (options.columns[i].name) {
        return options.columns[i].name
      }
    }

    if (options.caseHeaders === false) return key

    return sentence(key)
  })

  const widths = input.reduce(
    (sizes, item) => keys.map(
      (key, i) => Math.max(width(stringify(item[key]), columnsMaxWidth), sizes[i])
    ),
    titles.map(t => Math.max(columnsWidthMin, width(t, columnsMaxWidth)))
  )

  const alignments = keys.map((key, i) => {
    if (
      Array.isArray(options.columns) &&
      options.columns[i] &&
      options.columns[i].align
    ) {
      const align = String(options.columns[i].align).toUpperCase()

      if (ALIGN.indexOf(align) === -1) {
        throw new TypeError(`Unknown alignment, got ${options.columns[i].align}`)
      }

      return align
    }
  })

  let table = ''

  // header line
  table += color
    ? chalk.bold(row(alignments, widths, titles, gutters))
    : row(alignments, widths, titles, gutters)

  // header separator
  table += line(alignments.map(
    (align, i) => (
      (align === 'LEFT' || align === 'CENTER' ? ':' : '-') +
      repeat('-', widths[i] - 2) +
      (align === 'RIGHT' || align === 'CENTER' ? ':' : '-')
    )
  ), true, color, true)

  // table body
  table += input.map(
    (item, i) => row(alignments, widths, keys.map(
      key => stringify(item[key])
    ), gutters, color, i % 2 === 1)
  ).join('')

  return table
}

function row (alignments, widths, columns, gutters, color, odd) {
  const width = columns.length
  const values = new Array(width)
  const first = new Array(width)
  let height = 1

  for (let h = 0; h < width; h++) {
    const cells = values[h] = split(columns[h], widths[h])
    if (cells.length > height) height = cells.length
    first[h] = pad(alignments[h], widths[h], cells[0])
  }

  if (height === 1) return line(first, true, color, odd)

  const lines = new Array(height)
  lines[0] = line(first, true, color, odd)

  for (let v = 1; v < height; v++) {
    lines[v] = new Array(width)
  }

  for (let h = 0; h < width; h++) {
    const cells = values[h]
    let v = 1

    for (;v < cells.length; v++) {
      lines[v][h] = pad(alignments[h], widths[h], cells[v])
    }

    for (;v < height; v++) {
      lines[v][h] = repeat(' ', widths[h])
    }
  }

  for (let h = 1; h < height; h++) {
    lines[h] = line(lines[h], gutters, color, odd)
  }

  return lines.join('')
}

function line (columns, gutters, color, odd) {
  if (color && odd) {
    return chalk.gray(
      (gutters ? '| ' : '  ') +
      columns.join((gutters ? ' | ' : '   ')) +
      (gutters ? ' |' : '  ') + os.EOL
    )
  }

  return (
    (gutters ? '| ' : '  ') +
    columns.join((gutters ? ' | ' : '   ')) +
    (gutters ? ' |' : '  ') + os.EOL
  )
}

function pad (alignment, width, what) {
  if (!alignment || alignment === 'LEFT') {
    return padEnd(what, width)
  }

  if (alignment === 'RIGHT') {
    return padStart(what, width)
  }

  // CENTER
  const remainder = (width - what.length) % 2
  const sides = (width - what.length - remainder) / 2

  return repeat(' ', sides) + what + repeat(' ', sides + remainder)
}

function repeat (what, times) {
  return new Array(times).fill(what).join('')
}

function padStart (what, target, start) {
  return repeat(' ', target - what.length) + what
}

function padEnd (what, target, start) {
  return what + repeat(' ', target - what.length)
}

function toString (v) {
  if (typeof v === 'undefined') return ''

  return String(v).replace(/\|/g, '\\|')
}
