import type { AInstructionToken, Token } from "./type.ts"

export const DEFAULT_SYMBOLS = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,
  SCREEN: 16384,
  KBD: 24576,
} as const

export const VARIABLE_BASE = 16

export type SymbolTable = Record<string, number>

export const getSymbolTable = (tokens: readonly Token[]): SymbolTable => {
  const labels = getLabels(tokens)
  const labelNames = labels.map(({ label }) => label)
  const labelSymbols = Object.fromEntries(
    labels.map(({ label, lineNumber }) => [label, lineNumber])
  )
  const builtInSymbols = Object.keys(DEFAULT_SYMBOLS)
  const variables = tokens
    .filter(isAInstruction)
    .map(({ variable = '' }) => variable)
    .filter((variable) => Boolean(variable))
    .filter((variable) => !builtInSymbols.includes(variable))
    .filter((variable) => !labelNames.includes(variable))
  const uniqueVariables = [...new Set(variables)]
  const variableSymbols = Object.fromEntries(
    uniqueVariables.map((variable, i) => [variable, VARIABLE_BASE + i])
  )
  return { ...DEFAULT_SYMBOLS, ...labelSymbols, ...variableSymbols }
}

const getLabels = (tokens: readonly Token[]): { label: string, lineNumber: number }[] =>
  tokens
    .filter(token => token.labels)
    .map(({ labels = [], lineNumber }) => labels.map(label => ({ label, lineNumber })))
    .flat()

const isAInstruction = (token: Token): token is AInstructionToken => token.type === 'A-Instruction'
