import { type LoadState, icon, render } from './load-state.ts'

const states: readonly LoadState[] = [
  { status: 'loading' },
  { status: 'success', data: ['Ada', 'Grace'] },
  { status: 'error', message: 'Timeout' },
]

states.forEach((state) => console.info(`[${icon(state)}] ${render(state)}`))
