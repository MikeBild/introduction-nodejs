import { shop } from '../src/contexts.ts'
import { decisionLine } from './decide.ts'

for (const context of shop) console.info(decisionLine(context))
