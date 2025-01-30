import { EOL } from 'node:os'
import type { Token } from './type.ts'
import { getSymbolTable, type SymbolTable } from './symbol-table.ts'

export const generate = (tokens: readonly Token[]): string => {
  const symbolTable = getSymbolTable(tokens)
  const lines = tokens.map(token => generators[token.type](token, symbolTable))
  return lines.join(EOL)
}

const generators = {
  'A-Instruction': ({ value }: Token, symbolTable: SymbolTable) => {
    const valueWithoutAt = value.replace('@', '')
    const integerValue = isInteger(valueWithoutAt) ? valueWithoutAt : String(symbolTable[valueWithoutAt])
    const number = parseInt(integerValue.replace('@', ''))
    const binary = number.toString(2).padStart(16, '0')
    return binary
  },
  'C-Instruction': ({value}: Token) => {
    const start = '111'
    const { dest, comp, jump } = splitCInstruction(value)
    const compBinary = COMP_INSTRUCTION_MAP[comp] ?? '0000000'
    const destBinary = DEST_INSTRUCTION_MAP[dest] ?? '000'
    const jumpBinary = JUMP_INSTRUCTION_MAP[jump] ?? '000'
    return `${start}${compBinary}${destBinary}${jumpBinary}`
  }
} as const

const isInteger = (str: string): boolean => {
  return /^\+?\d+$/.test(str);
}

const splitCInstruction = (instruction: string): { dest: string, comp: string, jump: string } => {
  const regexWithOptionals = /^(?<dest>[AMD]{0,3})=?(?<comp>[^;]+);?(?<jump>[A-Z]{0,3})?$/
  const match = instruction.match(regexWithOptionals)
  return match?.groups as { dest: string, comp: string, jump: string } ?? { dest: '', comp: '', jump: '' }
}

const COMP_INSTRUCTION_MAP: Record<string, string> = {
  '0': '0101010',
  '1': '0111111',
  '-1': '0111010',
  'D': '0001100',
  'A': '0110000',
  '!D': '0001101',
  '!A': '0110001',
  '-D': '0001111',
  '-A': '0110011',
  'D+1': '0011111',
  'A+1': '0110111',
  'D-1': '0001110',
  'A-1': '0110010',
  'D+A': '0000010',
  'D-A': '0010011',
  'A-D': '0000111',
  'D&A': '0000000',
  'D|A': '0010101',
  'M': '1110000',
  '!M': '1110001',
  '-M': '1110011',
  'M+1': '1110111',
  'M-1': '1110010',
  'D+M': '1000010',
  'D-M': '1010011',
  'M-D': '1000111',
  'D&M': '1000000',
  'D|M': '1010101',
}

const DEST_INSTRUCTION_MAP: Record<string, string> = {
  '': '000',
  'M': '001',
  'D': '010',
  'MD': '011',
  'A': '100',
  'AM': '101',
  'AD': '110',
  'AMD': '111',
}

const JUMP_INSTRUCTION_MAP: Record<string, string> = {
  '': '000',
  'JGT': '001',
  'JEQ': '010',
  'JGE': '011',
  'JLT': '100',
  'JNE': '101',
  'JLE': '110',
  'JMP': '111',
}

