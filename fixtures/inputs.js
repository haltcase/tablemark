'use strict'

const { EOL } = require('os')

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
      '| Name      | Repo                                                  | Desc                                                                                        |',
      '| --------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |',
      '| trilogy   | [citycide/trilogy](//github.com/citycide/trilogy)     | No-hassle SQLite with type-casting schema models and support for native & pure JS backends. |',
      '| strat     | [citycide/strat](//github.com/citycide/strat)         | Functional-ish JavaScript string formatting, with inspirations from Python.                 |',
      '| tablemark | [citycide/tablemark](//github.com/citycide/tablemark) | Generate markdown tables from JSON data.                                                    |'
    ].join(EOL) + EOL
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
      '| Name  |   Age | Is cool |',
      '| :---- | ----: | :-----: |',
      '| Bob   |    21 |  false  |',
      '| Sarah |    22 |  true   |',
      '| Lee   |    23 |  true   |'
    ].join(EOL) + EOL
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
      '| Lee   | 23     | true    |'
    ].join(EOL) + EOL
  },
  casing: {
    input: [
      { name: 'Bob', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    options: {
      caseHeaders: false
    },
    expected: [
      '| name  | age   | isCool |',
      '| ----- | ----- | ------ |',
      '| Bob   | 21    | false  |',
      '| Sarah | 22    | true   |',
      '| Lee   | 23    | true   |'
    ].join(EOL) + EOL
  },
  coerce: {
    input: [
      { name: 'Bob', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    options: {
      stringify (v) {
        if (v === true) return 'Yes'
        if (v === false) return 'No'
        return String(v)
      }
    },
    expected: [
      '| Name  | Age   | Is cool |',
      '| ----- | ----- | ------- |',
      '| Bob   | 21    | No      |',
      '| Sarah | 22    | Yes     |',
      '| Lee   | 23    | Yes     |'
    ].join(EOL) + EOL
  },
  wrap: {
    input: [
      { name: 'Benjamin', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    options: {
      wrap: { width: 5 }
    },
    expected: [
      // headers wrap, soft wrap
      '| Name  | Age   | Is    |',
      '                  cool   ',
      '| ----- | ----- | ----- |',
      // hard wrap
      '| Benja | 21    | false |',
      '  min                    ',
      // no wrap
      '| Sarah | 22    | true  |',
      '| Lee   | 23    | true  |'
    ].join(EOL) + EOL
  },
  newlines: {
    input: [
      { name: 'Benjamin\nor Ben', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    expected: [
      '| Name     | Age   | Is cool |',
      '| -------- | ----- | ------- |',
      '| Benjamin | 21    | false   |',
      '  or Ben                      ',
      '| Sarah    | 22    | true    |',
      '| Lee      | 23    | true    |'
    ].join(EOL) + EOL
  },
  wrapAndNewlines: {
    input: [
      { name: 'Benjamin or\nBen', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    options: {
      wrap: { width: 8 }
    },
    expected: [
      '| Name     | Age   | Is cool |',
      '| -------- | ----- | ------- |',
      '| Benjamin | 21    | false   |',
      '  or                          ',
      '  Ben                         ',
      '| Sarah    | 22    | true    |',
      '| Lee      | 23    | true    |'
    ].join(EOL) + EOL
  },
  gutters: {
    input: [
      { name: 'Benjamin', age: 21, isCool: false },
      { name: 'Sarah', age: 22, isCool: true },
      { name: 'Lee', age: 23, isCool: true }
    ],
    options: {
      wrap: { width: 5, gutters: true }
    },
    expected: [
      '| Name  | Age   | Is    |',
      '|       |       | cool  |',
      '| ----- | ----- | ----- |',
      '| Benja | 21    | false |',
      '| min   |       |       |',
      '| Sarah | 22    | true  |',
      '| Lee   | 23    | true  |'
    ].join(EOL) + EOL
  },
  pipes: {
    input: [
      { content: 'yes | no' }
    ],
    expected: [
      '| Content   |',
      '| --------- |',
      '| yes \\| no |'
    ].join(EOL) + EOL
  }
}
