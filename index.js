'use strict'

const os = require('os')
const sentence = require('sentence-case')

const columnWidthMin = 5
const ALIGN = [ 'LEFT', 'CENTER', 'RIGHT' ]

module.exports = (input, options) => {
  if (!Array.isArray(input)) {
    throw new TypeError(`Expected an Array, got ${typeof input}`)
  }

  options = Object.assign({
    stringify: v => typeof v === 'undefined' ? '' : String(v)
  }, options)

  const stringify = options.stringify
  const keys = Object.keys(input[0])

  let table = ''

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
      (key, i) => Math.max(columnWidthMin, stringify(item[key]).length, sizes[i])
    ),
    titles.map(t => t.length)
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

  // header line
  table += row(titles.map((title, i) => {
    return pad(alignments[i], widths[i], title)
  }))

  // header separator
  table += row(alignments.map((align, i) => {
    return (
      (align === 'LEFT' || align === 'CENTER' ? ':' : '-') +
      repeat('-', widths[i] - 2) +
      (align === 'RIGHT' || align === 'CENTER' ? ':' : '-')
    )
  }))

  // table body
  input.forEach(item => {
    table += row(keys.map((key, i) => {
      return pad(alignments[i], widths[i], stringify(item[key]))
    }))
  })

  return table
}

function pad (alignment, target, value) {
  if (!alignment || alignment === 'LEFT') {
    return padEnd(value, target)
  }

  if (alignment === 'RIGHT') {
    return padStart(value, target)
  }

  // CENTER
  const remainder = (target - value.length) % 2
  const sides = (target - value.length - remainder) / 2

  return repeat(' ', sides) + value + repeat(' ', sides + remainder)
}

function row (v) {
  if (Array.isArray(v)) {
    v = v.join(' | ')
  }

  return '| ' + v + ' |' + os.EOL
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
