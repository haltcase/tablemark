# tablemark &middot; [![Version](https://img.shields.io/npm/v/tablemark.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/tablemark) [![License](https://img.shields.io/npm/l/tablemark.svg?style=flat-square&maxAge=3600)](https://www.npmjs.com/package/tablemark) [![Travis CI](https://img.shields.io/travis/citycide/tablemark.svg?style=flat-square&maxAge=3600)](https://travis-ci.org/citycide/tablemark) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square&maxAge=3600)](https://standardjs.com)

> Generate markdown tables from JSON data.

Parses arrays of objects into markdown tables, complete with configuration
for renaming columns and left, center, or right-aligning them.

## installation

```console
npm i tablemark
```

## usage

```js
const tablemark = require('tablemark')
```

```js
tablemark([
  { name: 'Bob', age: 21, isCool: false },
  { name: 'Sarah', age: 22, isCool: true },
  { name: 'Lee', age: 23, isCool: true }
])

// | Name  | Age   | IsCool |
// | ----- | ----- | ------ |
// | Bob   | 21    | false  |
// | Sarah | 22    | true   |
// | Lee   | 23    | true   |
```

... displays as:

| Name  | Age   | IsCool |
| ----- | ----- | ------ |
| Bob   | 21    | false  |
| Sarah | 22    | true   |
| Lee   | 23    | true   |

```js
tablemark([
  { name: 'Bob', age: 21, isCool: false },
  { name: 'Sarah', age: 22, isCool: true },
  { name: 'Lee', age: 23, isCool: true }
], {
  columns: [
    'first name',
    { name: 'how old', align: 'center' },
    'are they cool'
  ]
})

// | first name | how old | are they cool |
// | ---------- | :-----: | ------------- |
// | Bob        |   21    | false         |
// | Sarah      |   22    | true          |
// | Lee        |   23    | true          |
```

... displays as:

| first name | how old | are they cool |
| ---------- | :-----: | ------------- |
| Bob        |   21    | false         |
| Sarah      |   22    | true          |
| Lee        |   23    | true          |

## api

### tablemark
```js
tablemark(input, [options = {}])
```

> **Arguments**

- `{Array<Object>} input`: the data to table-ify
- `{Object} [options = {}]`

| key           | type         | default | description                              |
| :-----------: | :----------: | :-----: | ---------------------------------------- |
| `columns`     | `<Array>`    | -       | Array of column descriptors.             |
| `caseHeaders` | `<Boolean>`  | `true`  | Sentence case headers derived from keys. |
| `stringify`   | `<Function>` | -       | Provide a custom "toString" function.    |

The `columns` array can either contain objects, in which case their
`name` and `align` properties will be used to alter the display of
the column in the table, or any other type which will be coerced
to a string if necessary and used as a replacement for the column
name.

## see also

- [`tablemark-cli`](https://github.com/citycide/tablemark-cli): use this module from the command line

## contributing

Search the [issues](https://github.com/citycide/tablemark) if you come
across any trouble, open a new one if it hasn't been posted, or, if you're
able, open a [pull request](https://help.github.com/articles/about-pull-requests/).
Contributions of any kind are welcome in this project.

The following people have already contributed their time and effort:

* Thomas Jensen (**[@tjconcept](https://github.com/tjconcept)**)

Thank you!

## license

MIT © Bo Lingen / citycide
