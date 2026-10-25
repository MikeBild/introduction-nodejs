export type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: readonly string[] }
  | { status: 'error'; message: string }

export type ErrorState = Extract<LoadState, { status: 'error' }>

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected case: ${JSON.stringify(value)}`)
}

export const formatId = (id: string | number): string =>
  typeof id === 'number' ? id.toFixed(0) : id.toUpperCase()

export const toList = (input: string | readonly string[]): readonly string[] =>
  typeof input === 'string' ? [input] : input

export const render = (state: LoadState): string => {
  switch (state.status) {
    case 'loading':
      return 'Loading'
    case 'success':
      return state.data.join(', ')
    case 'error':
      return `Error: ${state.message}`
    default:
      return assertNever(state)
  }
}

export const icon = (state: LoadState): string => {
  switch (state.status) {
    case 'loading':
      return 'spinner'
    case 'success':
      return 'check'
    case 'error':
      return 'alert'
    default:
      return assertNever(state)
  }
}

export const isError = (state: LoadState): state is ErrorState => state.status === 'error'
