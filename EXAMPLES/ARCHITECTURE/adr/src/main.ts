import { fileURLToPath } from 'node:url'
import { checkDirectory } from './check-adr.ts'

const directory = process.argv[2] ?? fileURLToPath(new URL('../docs/adr', import.meta.url))
const problems = checkDirectory(directory)
console.info(problems.length ? problems.join('\n') : `${directory}: alle ADRs nach Vorlage`)
process.exitCode = problems.length ? 1 : 0
