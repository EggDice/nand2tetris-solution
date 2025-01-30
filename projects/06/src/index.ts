import { readFileSync, writeFileSync } from 'fs'
import { parse } from './parser.ts'
import {generate} from './generator.ts'

const source = process.argv[2] ?? ''
const dest = process.argv[3] ?? ''

const sourceFile = readFileSync(source, 'utf-8').toString()

const tokens = parse(sourceFile)
const output = generate(tokens)

writeFileSync(dest, output)
