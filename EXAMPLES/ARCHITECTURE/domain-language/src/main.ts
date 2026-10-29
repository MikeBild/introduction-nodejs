import { board } from './board.ts'
import { lint } from './lint.ts'

const problems = lint(board)
console.info(problems.length ? problems.join('\n') : 'Das Board spricht Fachsprache.')
