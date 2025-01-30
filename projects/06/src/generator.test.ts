import { generate } from './generator';
import { test, expect } from 'vitest';

test('generator generate A-Instruction', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@1' }
  ] as const
  const result = generate(tokens)
  expect(result).toEqual('0000000000000001')
})

test('generator multiple lines', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@1' },
    { lineNumber: 1, type: 'A-Instruction', value: '@2' }
  ] as const
  const result = generate(tokens)
  expect(result).toEqual('0000000000000001\n0000000000000010')
})

test('generator generate A-Instruction with variable', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@X', variable: 'X' }
  ] as const
  const result = generate(tokens)
  expect(result).toEqual('0000000000010000')
})

test('generator generate A-Instruction with label', () => {
  const tokens = [
    { lineNumber: 0, type: 'A-Instruction', value: '@1', labels: ['LOOP'] },
    { lineNumber: 1, type: 'A-Instruction', value: '@LOOP' },
  ] as const
  const result = generate(tokens)
  expect(result).toEqual('0000000000000001\n0000000000000000')
})

test.each([
  ['0', '1110101010000000'],
  ['1', '1110111111000000'],
  ['D=M', '1111110000010000'],
  ['D;JGT', '1110001100000001'],
])('generator generate C-Instruction', (instruction, binary) => {
  const tokens = [
    { lineNumber: 0, type: 'C-Instruction', value: instruction }
  ] as const
  const result = generate(tokens)
  expect(result).toEqual(binary)
})
