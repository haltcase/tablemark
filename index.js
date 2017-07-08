'use strict'

const os = require('os')
const isPlainObject = require('is-plain-obj')

const ALIGN = {
  LEFT: ':----',
  CENTER: ':---:',
  RIGHT: '----:'
}

module.exports = (input, options) => {
  if (!Array.isArray(input)) {
    throw new TypeError(
      `Expected an Array, got ${typeof input}`
    )
  }

  options = Object.assign({}, options)

  let table = ''
  let titles = []
  let alignments = []

  let keys = Object.keys(input[0])

  if (!options.columns || !Array.isArray(options.columns)) {
    // use the keys from the first object
    titles = keys
    alignments = new Array(titles.length).fill('')
  } else {
    titles = keys.map((key, i) => {
      let column = options.columns[i]

      if (isPlainObject(column)) {
        alignments[i] = column.align
        return column.name || key
      } else {
        alignments[i] = ''
        return column || key
      }
    })
  }

  // header line
  table += titles.join(' | ')
  table += os.EOL

  // header separator
  table += alignments.map(v => {
    let s = String(v).toUpperCase()
    return ALIGN[s] || '-----'
  }).join(' | ')
  table += os.EOL

  // table body
  input.forEach(item => {
    table += keys.map(key => {
      let v = item[key]
      if (typeof v === 'undefined') return ''
      return String(v)
    }).join(' | ') + os.EOL
  })

  return table
}
