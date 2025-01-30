import { getSymbolTable, DEFAULT_SYMBOLS, VARIABLE_BASE } from './symbol-table';
import { test, expect } from 'vitest';
import { Token } from './type';

test('symbol-table define symbols', () => {
  const tokens: Token[] = []
  const symbolTable = getSymbolTable(tokens)
  expect(symbolTable).toEqual(DEFAULT_SYMBOLS)
})

test('symbol-table handle labels', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@1', labels: ['LOOP', 'OTHER'] },
    { lineNumber: 1, type: 'A-Instruction', value: '@2', },
    { lineNumber: 2, type: 'A-Instruction', value: '@3', labels: ['END'] }
  ] as const
  const symbolTable = getSymbolTable(tokens)
  expect(symbolTable).toEqual({
    ...DEFAULT_SYMBOLS,
    LOOP: 0,
    OTHER: 0,
    END: 2
  })
})

test('symbol-table handle variables', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@X', variable: 'X' },
    { lineNumber: 1, type: 'A-Instruction', value: '@Y', variable: 'Y' },
    { lineNumber: 2, type: 'A-Instruction', value: '@Z', variable: 'Z' }
  ] as const
  const symbolTable = getSymbolTable(tokens)
  expect(symbolTable).toEqual({
    ...DEFAULT_SYMBOLS,
    X: VARIABLE_BASE,
    Y: VARIABLE_BASE + 1,
    Z: VARIABLE_BASE + 2
  })
})

test('symbol-table should not overwrite default symbols', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@R1', labels: ['LOOP'], variable: 'R1' },
  ] as const
  const symbolTable = getSymbolTable(tokens)
  expect(symbolTable).toEqual({
    ...DEFAULT_SYMBOLS,
    LOOP: 0
  })
})

test('symbol-table should not overwrite already defined symbols', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@var', variable: 'var' },
    { lineNumber: 1, type: 'A-Instruction', value: '@var', variable: 'var' },
  ] as const
  const symbolTable = getSymbolTable(tokens)
  expect(symbolTable).toEqual({
    ...DEFAULT_SYMBOLS,
    var: VARIABLE_BASE
  })
})

test('symbol-table should not overwrite already defined labels', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@1', labels: ['LOOP'] },
    { lineNumber: 1, type: 'A-Instruction', value: '@LOOP', variable: 'LOOP' },
  ] as const
  const symbolTable = getSymbolTable(tokens)
  expect(symbolTable).toEqual({
    ...DEFAULT_SYMBOLS,
    LOOP: 0
  })
})

test('symbol-table should not overwrite already defined symbols', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@var', variable: 'var' },
    { lineNumber: 1, type: 'A-Instruction', value: '@var', variable: 'var' },
  ] as const
  const symbolTable = getSymbolTable(tokens)
  expect(symbolTable).toEqual({
    ...DEFAULT_SYMBOLS,
    var: VARIABLE_BASE
  })
})


