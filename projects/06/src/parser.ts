import { EOL } from 'node:os'
import type { Token, TokenType, UniformToken } from './type'


const COMMENT_TOKEN = '//'


export const parse = (file: string): Token[] => {
  const lines = file.split(EOL)
  const removedComments = lines.map(line => line.split(COMMENT_TOKEN)[0] ?? '')
  const trimmedLines = removedComments.map(line => line.trim())
  const nonEmptyLines = trimmedLines.filter(line => line.length > 0)
  const linesWithLabels = getLinesWithLabels(nonEmptyLines)
  const numberedLines = linesWithLabels.map((line, i) => ({ ...line, lineNumber: i }))
  const tokens = numberedLines.map((line) => ({ ...line, type: getType(line.value) }))
  const tokensWithVariables = tokens.map((token) => parsers[token.type](token))
  return tokensWithVariables
}

const getType = (line: string): TokenType => {
  return typeTesters.find(({ tester }) => tester(line))?.type ?? 'C-Instruction'
}

const typeTesters = [
  { type: 'A-Instruction', tester: (line: string) => line.startsWith('@') },
  { type: 'C-Instruction', tester: (line: string) => !line.startsWith('@') },
] as const

const parsers = {
  'A-Instruction': (token: UniformToken): Token => {
      const aValue = token.value.replace('@', '')
      const variable = isNaN(parseInt(aValue)) ? aValue : undefined
      return variable !== undefined ? { ...token, variable } : token
  },
  'C-Instruction': (token: UniformToken): Token => token,
} as const

const isLabel = (line: string) => line.startsWith('(')

const stripLabel = (line: string) => line.replace('(', '').replace(')', '')

const getLinesWithLabels = (lines: string[]): Array<{ value: string, label?: string }> => {
 const lineAndLabelEntries = Map.groupBy(lines, (line: string, index: number) => {
    const stepsUntilNextNonLabel = lines.slice(index).findIndex((l) => !isLabel(l))
    return isLabel(line) ? index + stepsUntilNextNonLabel : index
  }).values()
  const linesWithLabels = [...lineAndLabelEntries].map((lines) => {
    const value = lines[lines.length - 1] ?? ''
    const labels = lines.slice(0, -1).map(stripLabel)
    return lines.length > 1 ? { labels, value } : { value }
  })
  return linesWithLabels
}
