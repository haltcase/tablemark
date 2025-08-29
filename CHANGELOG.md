## [`4.0.0-beta.2`](https://github.com/haltcase/tablemark/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2025-08-29)


###### BUG FIXES

* run build before publishing ([991a496](https://github.com/haltcase/tablemark/commit/991a496))


---

## [`4.0.0-beta.1`](https://github.com/haltcase/tablemark/compare/v3.1.0...v4.0.0-beta.1) (2025-08-29)


###### FEATURES

- support counting ANSI escapes ([ee38d57](https://github.com/haltcase/tablemark/commit/ee38d57))
- reduce minimum column width to 3 ([75f8337](https://github.com/haltcase/tablemark/commit/75f8337))
- rewrite with extended text handling support ([468e44d](https://github.com/haltcase/tablemark/commit/468e44d))
- require node v20+ ([9f9e74f](https://github.com/haltcase/tablemark/commit/9f9e74f))

###### DEPRECATIONS

- `options.caseHeaders` is deprecated in favor of `options.headerCase`.
- `options.wrapWidth` is deprecated in favor of `options.maxWidth`.

These deprecated options will be removed in the next major version.

###### BREAKING CHANGES

- Node v20 is now the minimum required version since v18 is officially EOL.
- `tablemark` is now a named export instead of the default.
- If the input iterable is empty, an empty string is returned instead of
  an error.
- `options.align` no longer allows uppercase values like `LEFT`.
- `options.toCellText` now receives an object with `key` (object key)
  and `value` (cell content) properties, rather than just the string
  value.
- The minimum column width has been reduced to 3
  characters, which is the narrowest width that still allows for both left and
  right alignment characters and a single hyphen in the divider cell. This is a
  fairly innocuous change, but does change output table layouts.

---

## [`3.1.0`](https://github.com/haltcase/tablemark/compare/v3.0.0...v3.1.0) (2024-04-02)


###### FEATURES

* support eliding padding in header separator ([#17](https://github.com/haltcase/tablemark/issues/17)) ([a4d24ce](https://github.com/haltcase/tablemark/commit/a4d24ce)), closes [#16](https://github.com/haltcase/tablemark/issues/16)


---

## [`3.0.0`](https://github.com/haltcase/tablemark/compare/v2.0.0...v3.0.0) (2021-10-26)

###### FEATURES

* rewrite in TypeScript as ESM ([feb3dd1](https://github.com/haltcase/tablemark/commit/feb3dd1))
* require node 14.16+ ([21b6d9e](https://github.com/haltcase/tablemark/commit/21b6d9e))


###### BREAKING CHANGES

* support for node <14.16 has been dropped.
* tablemark must be used as an ES module and is no longer available as common js.
* the shape of the options object to the `tablemark` function is simplified:
  * `options.stringify` &rarr; `options.toCellText`
  * `options.wrap.width` &rarr; `options.wrapWidth`
  * `options.wrap.gutters` &rarr; `options.wrapWithGutters`
* a `RangeError` is thrown instead of a `TypeError` when
an invalid alignment is specified.

---

<a name="2.0.0"></a>
## [`2.0.0`](https://github.com/haltcase/tablemark/compare/v1.2.0...v2.0.0) (2019-07-25)


###### FEATURES

* require node >= 8.10 ([a0060ba](https://github.com/haltcase/tablemark/commit/a0060ba))


###### BREAKING CHANGES

* support for node 4, 6, and < 8.10 has been dropped.

---

<a name="1.2.0"></a>
### [`1.2.0`](https://github.com/haltcase/tablemark/compare/v1.1.0...v1.2.0) (2018-01-14)


###### BUG FIXES

* handle pipes in content correctly ([#7](https://github.com/haltcase/tablemark/issues/7)) ([3f803e9](https://github.com/haltcase/tablemark/commit/3f803e9))


###### FEATURES

* support text wrapping ([#6](https://github.com/haltcase/tablemark/issues/6)) ([304d59d](https://github.com/haltcase/tablemark/commit/304d59d))


###### PERFORMANCE

* lift regex out of function scope ([6d8ab99](https://github.com/haltcase/tablemark/commit/6d8ab99))


---

<a name="1.1.0"></a>
### `1.1.0` (2017-09-13)

Many thanks to @tjconcept for the new features in this latest release. :tada:

###### FEATURES

* align cell content ([cc5b883](https://github.com/haltcase/tablemark/commit/cc5b8831f2dd7efd8754a79d15514760889a3827)) (#1)
* sentence case headers derived from keys ([c2c97ff](https://github.com/haltcase/tablemark/commit/c2c97fffe142e363f2ab49a42a9ef6666ae8c649)) (#2)
* support custom "toString" function ([0c5d79b](https://github.com/haltcase/tablemark/commit/0c5d79be00c5f2fc0018347bb126c175161ccae5)) (#3)
