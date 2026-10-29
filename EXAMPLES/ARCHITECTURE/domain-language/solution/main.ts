import { lint } from '../src/lint.ts'
import { board } from './board.ts'

const problems = lint(board)
console.info(problems.length ? problems.join('\n') : 'Das Board spricht Fachsprache.')
