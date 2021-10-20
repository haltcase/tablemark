import test from "ava"

import { alignmentOptions } from "../dist/index.js"
import * as utilites from "../dist/utilities.js"

test("pad: left alignment", t => {
  t.is(utilites.pad(alignmentOptions.left, 2, "foo"), "foo")
  t.is(utilites.pad(alignmentOptions.left, 6, "foo"), "foo   ")
})

test("pad: right alignment", t => {
  t.is(utilites.pad(alignmentOptions.right, 2, "foo"), "foo")
  t.is(utilites.pad(alignmentOptions.right, 6, "foo"), "   foo")
})

test("pad: center alignment", t => {
  t.is(utilites.pad(alignmentOptions.center, 2, "foo"), "foo")
  t.is(utilites.pad(alignmentOptions.center, 6, "foo"), " foo  ")
  t.is(utilites.pad(alignmentOptions.center, 7, "foo"), "  foo  ")
  t.is(utilites.pad(alignmentOptions.center, 8, "hi"), "   hi   ")
})

test("toCellText: renders its argument as a string suitable for a table cell", t => {
  t.is(utilites.toCellText(undefined), "")
  t.is(utilites.toCellText(3), "3")
  t.is(utilites.toCellText("|"), "\\|")
})
