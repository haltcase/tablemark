'use strict'

const os = require('os')
const sentence = require('sentence-case')
const split = require('split-text-to-chunks')

const width = split.width
const columnsWidthMin = 5
const ALIGN = [ 'LEFT', 'CENTER', 'RIGHT' ]

module.exports = (input, options) => {
  if (!Array.isArray(input)) {
    throw new TypeError(`Expected an Array, got ${typeof input}`)
  }

  options = Object.assign({
    stringify: v => typeof v === 'undefined' ? '' : String(v),
  }, options, {
    wrap: Object.assign({
      width: Infinity,
      gutters: false,
    }, options && options.wrap),
  })

  const stringify = options.stringify
  const columnsMaxWidth = options.wrap.width
  const gutters = options.wrap.gutters

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
      (key, i) => max(width(stringify(item[key]), columnsMaxWidth), sizes[i])
    ),
    titles.map(t => max(columnsWidthMin, width(t, columnsMaxWidth)))
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
  table += row(alignments, widths, titles, gutters)

  // header separator
  table += line(alignments.map(
    (align, i) => (
      (align === 'LEFT' || align === 'CENTER' ? ':' : '-') +
      repeat('-', widths[i] - 2) +
      (align === 'RIGHT' || align === 'CENTER' ? ':' : '-')
    )
  ), true)

  // table body
  table += input.map(
    (item, i) => row(alignments, widths, keys.map(
      key => stringify(item[key])
    ), gutters)
  ).join('')

  return table
}

function row (alignments, widths, columns, gutters) {
  const width = columns.length
  const values = new Array(width)
  const first = new Array(width)
  let height = 1

  for (let i = 0;i < width;i++){
    const cell = values[i] = split(columns[i], widths[i])

    if (cell.length > height) height = cell.length

    first[i] = pad(alignments[i], widths[i], cell[0])
  }

  if (height === 1) return line(first, true)

  const lines = new Array(height)

  lines[0] = line(first, true)

  for (let i = 1;i < height;i++){
    lines[i] = new Array(width)
  }

  for (let i = 0;i < width;i++){
    const cells = values[i]
    let u = 1

    for (;u < cells.length;u++){
      lines[u][i] = pad(alignments[i], widths[i], cells[u])
    }

    for (;u < height;u++){
      lines[u][i] = repeat(' ', widths[i])
    }
  }

  for (let i = 1;i < height;i++){
    lines[i] = line(lines[i], gutters)
  }

  return lines.join('')
}

function line (columns, gutters) {
  return (
    (gutters?'| ':'  ') +
    columns.join((gutters?' | ':'   ')) +
    (gutters?' |':'  ') + os.EOL
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

function max (a, b) {
  return a > b ? a : b
}
