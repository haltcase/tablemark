# tablemark &middot; [![Version](https://flat.badgen.net/npm/v/tablemark)](https://www.npmjs.com/package/tablemark) [![License](https://flat.badgen.net/npm/license/tablemark)](https://www.npmjs.com/package/tablemark) [![Travis CI](https://flat.badgen.net/travis/citycide/tablemark)](https://travis-ci.org/citycide/tablemark) [![JavaScript Standard Style](https://flat.badgen.net/badge/code%20style/standard/green)](https://standardjs.com)

> Generate markdown tables from JSON data.

Parses arrays of objects into markdown tables, complete with configuration
for renaming columns and left, center, or right-aligning them.

## installation

```sh
yarn add tablemark
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

// | Name  | Age   | Is cool |
// | ----- | ----- | ------- |
// | Bob   | 21    | false   |
// | Sarah | 22    | true    |
// | Lee   | 23    | true    |
```

... displays as:

| Name  | Age   | Is cool |
| ----- | ----- | ------- |
| Bob   | 21    | false   |
| Sarah | 22    | true    |
| Lee   | 23    | true    |

## api

```js
tablemark(input[, options = {}])
```

> **Arguments**

- `{Array<Object>} input`: the data to table-ify
- `{Object} [options = {}]`

| key            | type         | default    | description                                    |
| :------------: | :----------: | :--------: | ---------------------------------------------- |
| `columns`      | `<Array>`    | -          | Array of column descriptors.                   |
| `caseHeaders`  | `<Boolean>`  | `true`     | Sentence case headers derived from keys.       |
| `stringify`    | `<Function>` | -          | Provide a custom "toString" function.          |
| `wrap.width`   | `<Number>`   | `Infinity` | Wrap texts at this length.                     |
| `wrap.gutters` | `<Boolean>`  | `false`    | Add sides (`\| <content> \|`) to wrapped rows. |

The `columns` array can either contain objects, in which case their
`name` and `align` properties will be used to alter the display of
the column in the table, or any other type which will be coerced
to a string if necessary and used as a replacement for the column
name.

### `columns`

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

### `stringify`

```js
tablemark([
  { name: 'Bob', pet_owner: true, studying: false },
  { name: 'Sarah', pet_owner: false, studying: true },
  { name: 'Sarah', pet_owner: true, studying: true }
], {
  stringify,
  columns: [
    { align: 'left' },
    { align: 'center' },
    { align: 'center' }
  ]
})

function stringify (v) {
  if (v === true) return '✔'
  if (!v) return ''
  return v
}

// | Name  | Pet owner | Studying |
// | :---- | :-------: | :------: |
// | Bob   |     ✔︎     |          |
// | Sarah |           |    ✔     |
// | Lee   |     ✔     |    ✔     |
```

### `wrap`

To output valid [GitHub Flavored Markdown](https://github.github.com/gfm/) a
cell must not contain newlines. Consider replacing those with `<br />` (e.g.
using the `stringify` option).

Set the `wrap.width` option to wrap any content at that length onto a new
adjacent line:

```js
tablemark([
  { star: false, name: 'Benjamin' },
  { star: true, name: 'Jet Li' }
], { wrap: { width: 5 } })

// | Star  | Name  |
// | ----- | ----- |
// | false | Benja |
//           min
// | true  | Jet   |
//           Li
```

Enable `wrap.gutters` to add pipes on all lines:

```js
tablemark([
  { star: false, name: 'Benjamin' },
  { star: true, name: 'Jet Li' }
], { wrap: { width: 5, gutters: true } })

// | Star  | Name  |
// | ----- | ----- |
// | false | Benja |
// |       | min   |
// | true  | Jet   |
// |       | Li    |
```

## see also

- [`tablemark-cli`](https://github.com/citycide/tablemark-cli) &ndash; use this module from the command line

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
