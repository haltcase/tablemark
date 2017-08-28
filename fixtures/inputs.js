'use strict'

const os = require('os')

module.exports = {
  standard: {
    input: [
      {
        name: 'trilogy',
        repo: '[citycide/trilogy](//github.com/citycide/trilogy)',
        desc: 'No-hassle SQLite with type-casting schema models and support for native & pure JS backends.'
      },
      {
        name: 'strat',
        repo: '[citycide/strat](//github.com/citycide/strat)',
        desc: 'Functional-ish JavaScript string formatting, with inspirations from Python.'
      },
      {
        name: 'tablemark',
        repo: '[citycide/tablemark](//github.com/citycide/tablemark)',
        desc: 'Generate markdown tables from JSON data.'
      }
    ],
    expected: [
      '| name      | repo                                                  | desc                                                                                        |',
      '| --------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |',
      '| trilogy   | [citycide/trilogy](//github.com/citycide/trilogy)     | No-hassle SQLite with type-casting schema models and support for native & pure JS backends. |',
      '| strat     | [citycide/strat](//github.com/citycide/strat)         | Functional-ish JavaScript string formatting, with inspirations from Python.                 |',
      '| tablemark | [citycide/tablemark](//github.com/citycide/tablemark) | Generate markdown tables from JSON data.                                                    |',
    ].join(os.EOL) + os.EOL
  },
  alignments: {
    input: [
      { name: 'Bob', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    options: {
      columns: [
        { align: 'left' },
        { align: 'right' },
        { align: 'center' }
      ]
    },
    expected: [
      '| name  |   age | isCool |',
      '| :---- | ----: | :----: |',
      '| Bob   |    21 | false  |',
      '| Sarah |    22 |  true  |',
      '| Lee   |    23 |  true  |',
    ].join(os.EOL) + os.EOL
  },
  columns: {
    input: [
      { name: 'Bob', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    options: {
      columns: [
        { name: 'word' },
        { name: 'number' },
        { name: 'boolean' }
      ]
    },
    expected: [
      '| word  | number | boolean |',
      '| ----- | ------ | ------- |',
      '| Bob   | 21     | false   |',
      '| Sarah | 22     | true    |',
      '| Lee   | 23     | true    |',
    ].join(os.EOL) + os.EOL
  }
}
