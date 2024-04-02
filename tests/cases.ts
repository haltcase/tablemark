import test from "ava"

import tablemark from "../dist/index.js"
import cases from "./fixtures/inputs.js"

test("outputs the expected markdown", t => {
  const result = tablemark(cases.standard.input)
  t.is(result, cases.standard.expected)
})

test("works when provided alignment options", t => {
  const result = tablemark(cases.alignments.input, cases.alignments.options)
  t.is(result, cases.alignments.expected)
})

test("replaces column names when provided", t => {
  const result = tablemark(cases.columns.input, cases.columns.options)
  t.is(result, cases.columns.expected)
})

test("can override sentence casing", t => {
  const result = tablemark(cases.casing.input, cases.casing.options)
  t.is(result, cases.casing.expected)
})

test("can use custom stringify function", t => {
  const result = tablemark(cases.coerce.input, cases.coerce.options)
  t.is(result, cases.coerce.expected)
})

test("text wrapping", t => {
  const result = tablemark(cases.wrap.input, cases.wrap.options)
  t.is(result, cases.wrap.expected)
})

test("newlines", t => {
  const result = tablemark(cases.newlines.input, cases.newlines.options)
  t.is(result, cases.newlines.expected)
})

test("text wrapping and newlines combined", t => {
  const result = tablemark(
    cases.wrapAndNewlines.input,
    cases.wrapAndNewlines.options
  )
  t.is(result, cases.wrapAndNewlines.expected)
})

test("gutters", t => {
  const result = tablemark(cases.gutters.input, cases.gutters.options)
  t.is(result, cases.gutters.expected)
})

test("can disable header separator row padding", t => {
  const result = tablemark(
    cases.padHeaderSeparator.input,
    cases.padHeaderSeparator.options
  )
  t.is(result, cases.padHeaderSeparator.expected)
})

test("pipes in content", t => {
  const result = tablemark(cases.pipes.input, cases.pipes.options)
  t.is(result, cases.pipes.expected)
})
