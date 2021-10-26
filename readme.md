# tablemark &middot; [![Version](https://flat.badgen.net/npm/v/tablemark)](https://www.npmjs.com/package/tablemark) [![License](https://flat.badgen.net/npm/license/tablemark)](https://www.npmjs.com/package/tablemark) [![TypeScript](https://flat.badgen.net/badge/written%20in/TypeScript/294E80)](http://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) [![GitHub Actions](https://flat.badgen.net/github/checks/citycide/tablemark)](https://github.com/citycide/tablemark/actions)

> Generate markdown tables from JSON data.

Renders arrays of objects as markdown tables, complete with configuration
for renaming columns and left, center, or right-aligning them.

## installation

```sh
yarn add tablemark

# or

npm install tablemark
```

## usage

```js
import tablemark from "tablemark"
```

```js
tablemark([
  { name: "Bob", age: 21, isCool: false },
  { name: "Sarah", age: 22, isCool: true },
  { name: "Lee", age: 23, isCool: true }
])

// | Name  | Age   | Is cool |
// | :---- | :---- | :------ |
// | Bob   | 21    | false   |
// | Sarah | 22    | true    |
// | Lee   | 23    | true    |
```

... displays as:

| Name  | Age   | Is cool |
| :---- | :---- | :------ |
| Bob   | 21    | false   |
| Sarah | 22    | true    |
| Lee   | 23    | true    |

## api

```ts
tablemark (input: InputData, options?: TablemarkOptions): string
```

> **Arguments**

* `InputData` input: the data to table-ify
  * an array of objects or iterables
* `TablemarkOptions` options:

  | key            | type         | default    | description                                    |
  | :------------: | :----------: | :--------: | ---------------------------------------------- |
  | `columns`      | `Array<string \| ColumnDescriptor>` | - | Array of column descriptors.                    |
  | `caseHeaders`  | `boolean`    | `true`     | Sentence case headers derived from keys.       |
  | `toCellText`    | `(input: unknown) => string` | - | Provide a custom "toString" function.       |
  | `wrapWidth`   | `number`     | `Infinity` | Wrap cell text at this length.                     |
  | `wrapWithGutters` | `boolean`    | `false`    | Add sides (`\| <content> \|`) to wrapped rows. |
  | `lineEnding` | `string` | `"\n"` | String used at end-of-line. |

The `columns` array can either contain objects, in which case their
`name` and `align` properties will be used to alter the display of
the column in the table, or any other type which will be coerced
to a string if necessary and used as a replacement for the column
name.

> **Returns**

`string`: the resulting markdown formatted table

> **Throws**

`TypeError`: when `input` is not iterable (e.g., an array)<br />
`TypeError`: when an unknown column alignment option is provided

### `options.columns`

```js
tablemark([
  { name: "Bob", age: 21, isCool: false },
  { name: "Sarah", age: 22, isCool: true },
  { name: "Lee", age: 23, isCool: true }
], {
  columns: [
    "first name",
    { name: "how old", align: "center" },
    "are they cool"
  ]
})

// | first name | how old | are they cool |
// | :--------- | :-----: | :------------ |
// | Bob        |   21    | false         |
// | Sarah      |   22    | true          |
// | Lee        |   23    | true          |
```

... displays as:

| first name | how old | are they cool |
| :--------- | :-----: | :------------ |
| Bob        |   21    | false         |
| Sarah      |   22    | true          |
| Lee        |   23    | true          |

### `options.toCellText`

```js
tablemark([
  { name: "Bob", pet_owner: true, studying: false },
  { name: "Sarah", pet_owner: false, studying: true },
  { name: "Sarah", pet_owner: true, studying: true }
], {
  toCellText,
  columns: [
    { align: "left" },
    { align: "center" },
    { align: "center" }
  ]
})

function toCellText (v) {
  if (v === true) return "✔"
  if (!v) return ""
  return v
}

// | Name  | Pet owner | Studying |
// | :---- | :-------: | :------: |
// | Bob   |     ✔︎     |          |
// | Sarah |           |    ✔     |
// | Lee   |     ✔     |    ✔     |
```

### `options.wrapWidth`

Set `options.wrapWidth` to wrap any content at that length onto a new
adjacent line:

```js
tablemark([
  { star: false, name: "Benjamin" },
  { star: true, name: "Jet Li" }
], { wrapWidth: 5 })

// | Star  | Name  |
// | :---- | :---- |
// | false | Benja |
//           min
// | true  | Jet   |
//           Li
```

> To output valid [GitHub Flavored Markdown](https://github.github.com/gfm/) a
cell must not contain newlines. Consider replacing those with `<br />` (e.g.,
using `options.toCellText`).

### `options.wrapWithGutters`

Enable `wrapWithGutters` to add pipes on all lines:

```js
tablemark([
  { star: false, name: "Benjamin" },
  { star: true, name: "Jet Li" }
], { wrapWidth: 5, wrapWithGutters: true })

// | Star  | Name  |
// | :---- | :---- |
// | false | Benja |
// |       | min   |
// | true  | Jet   |
// |       | Li    |
```

## see also

* [`tablemark-cli`](https://github.com/citycide/tablemark-cli) &ndash; use this module from the command line

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
