export type TokenType = 'A-Instruction' | 'C-Instruction'

export type UniformToken = {
  lineNumber: number
  type: TokenType
  value: string
  labels?: readonly string[]
}

export type AInstructionToken = UniformToken & {
  type: 'A-Instruction'
  variable?: string
}

export type CInstructionToken = UniformToken & {
  type: 'C-Instruction'
}

export type Token = AInstructionToken | CInstructionToken
