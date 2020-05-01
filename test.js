'use strict'

const test = require('ava')

const fn = require('./')
const cases = require('./fixtures/inputs')

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

test('text wrapping', t => {
  const result = fn(cases.wrap.input, cases.wrap.options)
  t.is(result, cases.wrap.expected)
})

test('newlines', t => {
  const result = fn(cases.newlines.input, cases.newlines.options)
  t.is(result, cases.newlines.expected)
})

test('text wrapping and newlines combined', t => {
  const result = fn(cases.wrapAndNewlines.input, cases.wrapAndNewlines.options)
  t.is(result, cases.wrapAndNewlines.expected)
})

test('gutters', t => {
  const result = fn(cases.gutters.input, cases.gutters.options)
  t.is(result, cases.gutters.expected)
})

test('pipes in content', t => {
  const result = fn(cases.pipes.input, cases.pipes.options)
  t.is(result, cases.pipes.expected)
})
