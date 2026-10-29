import { fileURLToPath } from 'node:url'
import { checkDirectory } from '../src/check-adr.ts'

const directory = fileURLToPath(new URL('.', import.meta.url))
const problems = checkDirectory(directory)
console.info(problems.length ? problems.join('\n') : 'ADR 0003 folgt der Vorlage')
