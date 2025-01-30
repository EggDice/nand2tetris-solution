import { parse } from './parser'
import { test, expect } from 'vitest'

test('parser trim whitespace', () => {
  const file = `  @1  `
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@1' }
  ])
})

test('parser handle multiple lines', () => {
  const file = `  @1
  @2`
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@1' },
    { lineNumber: 1, type: 'A-Instruction', value: '@2' }
  ])
})

test('parser handle empty lines', () => {
  const file = `  @1

  @2`
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@1' },
    { lineNumber: 1, type: 'A-Instruction', value: '@2' }
  ])
})

test('parser handle comments', () => {
  const file = `  @1 // comment
  // comment
  @2`
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@1' },
    { lineNumber: 1, type: 'A-Instruction', value: '@2' }
  ])
})


test('parser parse C-Instruction', () => {
  const file = `  @1 // comment
  D=M
  @2`
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@1' },
    { lineNumber: 1, type: 'C-Instruction', value: 'D=M' },
    { lineNumber: 2, type: 'A-Instruction', value: '@2' }
  ])
})

test('parser parse labels', () => {
  const file = `  @1 // comment
  (LOOP)
  @2`
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@1' },
    { lineNumber: 1, type: 'A-Instruction', value: '@2', labels: ['LOOP'] }
  ])
})

test.only('parser parse multiple labels', () => {
  const file = `  @1 // comment
  (LOOP)
  (END)
  @2`
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@1' },
    { lineNumber: 1, type: 'A-Instruction', value: '@2', labels: ['LOOP', 'END'] }
  ])
})

test('parser parse variables', () => {
  const file = `@LOOP`
  const tokens = parse(file)
  expect(tokens).toEqual([
    { lineNumber: 0, type: 'A-Instruction', value: '@LOOP', variable: 'LOOP' }
  ])
})
