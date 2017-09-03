import test from 'ava'

import fn from './'
import cases from './fixtures/inputs'

test('outputs the expected markdown', t => {
  const result = fn(cases.standard.input)
  t.is(result, cases.standard.expected)
})

test('works when provided alignment options', t => {
  const result = fn(cases.alignments.input, cases.alignments.options)
  t.is(result, cases.alignments.expected)
})

test('replaces column names when provided', t => {
  const result = fn(cases.columns.input, cases.columns.options)
  t.is(result, cases.columns.expected)
})

test('can override sentence casing', t => {
  const result = fn(cases.casing.input, cases.casing.options)
  t.is(result, cases.casing.expected)
})

test('can use custom stringify function', t => {
  const result = fn(cases.coerce.input, cases.coerce.options)
  t.is(result, cases.coerce.expected)
})
