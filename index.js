'use strict'

const os = require('os')

const columnWidthMin = 5

module.exports = (input, options) => {
  if (!Array.isArray(input)) {
    throw new TypeError(
      `Expected an Array, got ${typeof input}`
    )
  }

  options = Object.assign({}, options)

  let table = ''

  let keys = Object.keys(input[0])

  let titles = keys.map((key, i) => {
    if (Array.isArray(options.columns) && options.columns[i]) {
        if (typeof options.columns[i] === 'string') {
          return options.columns[i]
        } else if (options.columns[i].name) {
          return options.columns[i].name
        }
    }

    return key
  })

  let widths = input.reduce(
    (sizes, item) => keys.map(
      (key, i) => Math.max(
        columnWidthMin,
        typeof item[key] === 'undefined' ? 0 : String(item[key]).length,
        sizes[i]
      )
    ),
    titles.map(t => t.length)
  )

  let alignments = keys.map((key, i) => {
    if (Array.isArray(options.columns)
      && options.columns[i]
      && options.columns[i].align
    ) {
      return String(options.columns[i].align).toUpperCase()
    }
  })

  // header line
  table += row(titles.map((title, i) => {
    return pad(alignments[i], widths[i], title)
  }))

  // header separator
  table += row(alignments.map((align, i) => {
    return (align === 'LEFT' || align === 'CENTER' ? ':' : '-')
      + '-'.repeat(widths[i] - 2)
      + (align === 'RIGHT' || align === 'CENTER' ? ':' : '-')
  }))

  // table body
  input.forEach(item => {
    table += row(keys.map((key, i) => {
      let v = item[key]
      let s =  typeof v === 'undefined' ? '' : String(v)

      return pad(alignments[i], widths[i], s)
    }))
  })

  return table
}

function pad(alignment, target, value){
  if (!alignment || alignment === 'LEFT') {
    return value.padEnd(target)
  }

  if (alignment === 'RIGHT') {
    return value.padStart(target)
  }

  // CENTER
  let remainder = (target - value.length) % 2
  let sides = (target - value.length - remainder) / 2

  return ' '.repeat(sides) + value + ' '.repeat(sides + remainder)
}

function row(v){
  if (Array.isArray(v)) {
    v = v.join(' | ')
  }

  return '| ' + v + ' |' + os.EOL
}
